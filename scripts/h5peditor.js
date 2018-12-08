/* global ns */
/**
 * This file contains helper functions for the editor.
 */

// Grab common resources set in parent window, but avoid sharing back resources set in iframe)
window.ns = window.H5PEditor = H5P.jQuery.extend(false, {}, window.parent.H5PEditor);
ns.$ = H5P.jQuery;

// Load needed resources from parent.
H5PIntegration = H5P.jQuery.extend(false, {}, window.parent.H5PIntegration);
H5PIntegration.loadedJs = {};
H5PIntegration.loadedCss = {};

/**
 * Keep track of our widgets.
 */
ns.widgets = {};

/**
 * Caches library data (semantics, js and css)
 */
ns.libraryCache = {};

/**
 * Keeps track of callbacks to run once a library gets loaded.
 */
ns.loadedCallbacks = [];

/**
 * Keep track of which libraries have been loaded in the browser, i.e CSS is
 * added and JS have been run
 *
 * @type {Object}
 */
ns.libraryLoaded = {};

/**
 * Indiciates if the user is using Internet Explorer.
 */
ns.isIE = navigator.userAgent.match(/; MSIE \d+.\d+;/) !== null;

/**
 * Keep track of renderable common fields.
 *
 * @type {Object}
 */
ns.renderableCommonFields = {};

/**
 * Helper function invoked when a library is requested. Will add CSS and eval JS
 * if not already done.
 *
 * @private
 * @param {string} libraryName On the form "machineName majorVersion.minorVersion"
 * @param {Function} callback
 */
ns.libraryRequested = function (libraryName, callback) {
  var libraryData = ns.libraryCache[libraryName];

  if (!ns.libraryLoaded[libraryName]) {
    // Add CSS.
    if (libraryData.css !== undefined) {
      libraryData.css.forEach(function (path) {
        if (!H5P.cssLoaded(path)) {
          H5PIntegration.loadedCss.push(path);
          if (path) {
            ns.$('head').append('<link ' +
              'rel="stylesheet" ' +
              'href="' + path + '" ' +
              'type="text/css" ' +
              '/>');
          }
        }
      });
    }

    // Add JS
    var loadingJs = false;
    if (libraryData.javascript !== undefined && libraryData.javascript.length) {
      libraryData.javascript.forEach(function (path) {
        if (!H5P.jsLoaded(path)) {
          loadingJs = true;
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.charset = 'UTF-8';
          script.async = false;

          script.onload = function () {
            H5PIntegration.loadedJs.push(path);

            var isFinishedLoading = libraryData.javascript.reduce(function (hasLoaded, jsPath) {
              return hasLoaded && H5P.jsLoaded(jsPath);
            }, true);

            if (isFinishedLoading) {
              ns.libraryLoaded[libraryName] = true;

              // Need to set translations after all scripts have been loaded
              if (libraryData.translations) {
                for (var machineName in libraryData.translations) {
                  H5PEditor.language[machineName] = libraryData.translations[machineName];
                }
              }

              callback(ns.libraryCache[libraryName].semantics);
            }
          };

          script.onerror = function (e) {
            console.error("Error while loading scripts:", e);
          };

          script.src = path;
          document.head.appendChild(script);
        }
      });
    }
    if (!loadingJs) {
      // Don't have to wait for any scripts, run callback
      ns.libraryLoaded[libraryName] = true;
      callback(ns.libraryCache[libraryName].semantics);
    }
  }
  else {
    // Already loaded, run callback
    callback(ns.libraryCache[libraryName].semantics);
  }
};

/**
 * Loads the given library, inserts any css and js and
 * then runs the callback with the samantics as an argument.
 *
 * @param {string} libraryName
 *  On the form machineName majorVersion.minorVersion
 * @param {function} callback
 * @returns {undefined}
 */
ns.loadLibrary = function (libraryName, callback) {
  switch (ns.libraryCache[libraryName]) {
    default:
      // Get semantics from cache.
      ns.libraryRequested(libraryName, callback);
      break;

    case 0:
      // Add to queue.
      if (ns.loadedCallbacks[libraryName] === undefined) {
        ns.loadedCallbacks[libraryName] = [];
      }
      ns.loadedCallbacks[libraryName].push(callback);
      break;

    case undefined:
      // Load semantics.
      ns.libraryCache[libraryName] = 0; // Indicates that others should queue.
      ns.loadedCallbacks[libraryName] = []; // Other callbacks to run once loaded.
      var library = ns.libraryFromString(libraryName);

      var url = ns.getAjaxUrl('libraries', library);

      // Add content language to URL
      if (ns.contentLanguage !== undefined) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + 'language=' + ns.contentLanguage;
      }

      // Fire away!
      ns.$.ajax({
        url: url,
        success: function (libraryData) {
          var semantics = libraryData.semantics;
          if (libraryData.language !== null) {
            var language = JSON.parse(libraryData.language);
            semantics = ns.$.extend(true, [], semantics, language.semantics);
          }
          libraryData.semantics = semantics;
          ns.libraryCache[libraryName] = libraryData;

          ns.libraryRequested(libraryName, function (semantics) {
            callback(semantics);

            // Run queue.
            if (ns.loadedCallbacks[libraryName]) {
              for (var i = 0; i < ns.loadedCallbacks[libraryName].length; i++) {
                ns.loadedCallbacks[libraryName][i](semantics);
              }
            }
          });
        },
        error: function (jqXHR, textStatus, errorThrown) {
          if (window['console'] !== undefined) {
            console.warn('Ajax request failed');
            console.warn(jqXHR);
            console.warn(textStatus);
            console.warn(errorThrown);
          }
        },
        dataType: 'json'
      });
  }
};

/**
 * Reset loaded libraries - i.e removes CSS added previously.
 * @method
 * @return {[type]}
 */
ns.resetLoadedLibraries = function () {
  ns.$('head style.h5p-editor-style').remove();
  H5PIntegration.loadedCss = [];
  H5PIntegration.loadedJs = [];
  ns.loadedCallbacks = [];
  ns.libraryLoaded = {};
};

/**
 * Recursive processing of the semantics chunks.
 *
 * @param {array} semanticsChunk
 * @param {object} params
 * @param {jQuery} $wrapper
 * @param {mixed} parent
 * @param {string} [machineName] Machine name of library that is being processed
 * @returns {undefined}
 */
ns.processSemanticsChunk = function (semanticsChunk, params, $wrapper, parent, machineName) {
  var ancestor;
  parent.children = [];

  if (parent.passReadies === undefined) {
    throw 'Widget tried to run processSemanticsChunk without handling ready callbacks. [field:' + parent.field.type + ':' + parent.field.name + ']';
  }

  if (!parent.passReadies) {
    // If the parent can't pass ready callbacks we need to take care of them.
    parent.readies = [];
  }

  for (var i = 0; i < semanticsChunk.length; i++) {
    var field = semanticsChunk[i];

    // Check generic field properties.
    if (field.name === undefined) {
      throw ns.t('core', 'missingProperty', {':index': i, ':property': 'name'});
    }
    if (field.type === undefined) {
      throw ns.t('core', 'missingProperty', {':index': i, ':property': 'type'});
    }

    // Set default value.
    if (params[field.name] === undefined && field['default'] !== undefined) {
      params[field.name] = field['default'];
    }

    var widget = ns.getWidgetName(field);

    // TODO: Remove later, this is here for debugging purposes.
    if (ns.widgets[widget] === undefined) {
      $wrapper.append('<div>[field:' + field.type + ':' + widget + ':' + field.name + ']</div>');
      continue;
    }

    // Add common fields to bottom of form.
    if (field.common !== undefined && field.common) {
      if (ancestor === undefined) {
        ancestor = ns.findAncestor(parent);
      }

      var library = machineName ? machineName
        : (field.library ? field.library
          : (parent.currentLibrary ? parent.currentLibrary : 'Other libraries'));
      ns.renderableCommonFields[library] = ns.renderableCommonFields[library] || {};
      ns.renderableCommonFields[library].fields = ns.renderableCommonFields[library].fields || [];

      // Add renderable if it doesn't exist
      ns.renderableCommonFields[library].fields.push({
        field: field,
        parent: parent,
        params: params,
        ancestor: ancestor,
        rendered: false
      });
      continue;
    }

    var fieldInstance = new ns.widgets[widget](parent, field, params[field.name], function (field, value) {
      if (value === undefined) {
        delete params[field.name];
      }
      else {
        params[field.name] = value;
      }
    });
    fieldInstance.appendTo($wrapper);
    parent.children.push(fieldInstance);
  }

  // Render all gathered common field
  if (ns.renderableCommonFields) {
    for (var commonFieldMachineName in ns.renderableCommonFields) {
      // Get title for common fields group
      H5PEditor.LibraryListCache.getLibraries([commonFieldMachineName], function (libraries) {
        var commonFields = ns.renderableCommonFields[commonFieldMachineName].fields;
        var renderableCommonFields = [];

        commonFields.forEach(function (field) {
          if (!field.rendered) {
            var commonField = ns.addCommonField(field.field, field.parent, field.params, field.ancestor);
            if (commonField.setValues.length === 1) {
              renderableCommonFields.push({
                field: field,
                instance: commonField.instance
              });
            }
          }
          field.rendered = true;
        });

        // Render common fields if found
        if (renderableCommonFields.length) {
          var libraryName = commonFieldMachineName === 'Other libraries' ? commonFieldMachineName
            : (commonFieldMachineName.length ? commonFieldMachineName.split(' ')[0] : '');
          if (libraries.length && libraries[0].title) {
            libraryName = libraries[0].title;
          }

          // Create a library wrapper
          var hasLibraryWrapper = !!ns.renderableCommonFields[commonFieldMachineName].wrapper;
          var commonFieldsLibraryWrapper = ns.renderableCommonFields[commonFieldMachineName].wrapper;
          if (!hasLibraryWrapper) {
            commonFieldsLibraryWrapper = document.createElement('fieldset');
            var libraryWrapperClass = libraryName.replace(/\s+/g, '-').toLowerCase();

            commonFieldsLibraryWrapper.classList.add('common-fields-library-wrapper');
            commonFieldsLibraryWrapper.classList.add('common-fields-' + libraryWrapperClass);

            var libraryTitle = document.createElement('legend');
            libraryTitle.classList.add('common-field-legend');
            libraryTitle.textContent = libraryName;
            libraryTitle.tabIndex = '0';
            libraryTitle.setAttribute('role', 'button');
            libraryTitle.addEventListener('click', function () {
              commonFieldsLibraryWrapper.classList.toggle('expanded');
            });
            libraryTitle.addEventListener('keypress', function (e) {
              if (e.which === 32) {
                commonFieldsLibraryWrapper.classList.toggle('expanded');
              }
            });
            commonFieldsLibraryWrapper.appendChild(libraryTitle);

            ns.renderableCommonFields[commonFieldMachineName].wrapper = commonFieldsLibraryWrapper;
          }

          renderableCommonFields.forEach(function (commonField) {
            commonField.instance.appendTo(ns.$(commonFieldsLibraryWrapper));
            // Gather under a common ancestor
            if (commonField.field && commonField.field.ancestor) {
              ancestor = commonField.field.ancestor;
            }
          });

          if (!hasLibraryWrapper && ancestor) {
            ancestor.$common[0].appendChild(commonFieldsLibraryWrapper);
          }
        }
      });
    }
  }

  if (!parent.passReadies) {
    // Run ready callbacks.
    for (i = 0; i < parent.readies.length; i++) {
      parent.readies[i]();
    }
    delete parent.readies;
  }
};

/**
 * Attach ancestor of parent's common fields to a new wrapper
 *
 * @param {Object} parent Parent content type instance that common fields should be attached to
 * @param {HTMLElement} wrapper New wrapper of common fields
 */
ns.setCommonFieldsWrapper = function (parent, wrapper) {
  var ancestor = ns.findAncestor(parent);
  // Hide the ancestor whose children will be reattached elsewhere
  wrapper.appendChild(ancestor.$common[0]);
};

/**
 * Add a field to the common container.
 *
 * @param {object} field
 * @param {object} parent
 * @param {object} params
 * @param {object} ancestor
 * @param {boolean} skipAppendTo
 * @returns {undefined}
 */
ns.addCommonField = function (field, parent, params, ancestor, skipAppendTo) {
  var commonField;

  // Group all fields based on library name + version
  if (ancestor.commonFields[parent.currentLibrary] === undefined) {
    ancestor.commonFields[parent.currentLibrary] = {};
  }

  // Field name will have to be unique for library
  if (ancestor.commonFields[parent.currentLibrary][field.name] === undefined) {
    var widget = ns.getWidgetName(field);
    ancestor.commonFields[parent.currentLibrary][field.name] = {
      instance: new ns.widgets[widget](parent, field, params[field.name], function (field, value) {
        for (var i = 0; i < commonField.setValues.length; i++) {
          commonField.setValues[i](field, value);
        }
      }),
      setValues: [],
      parents: []
    };
  }

  commonField = ancestor.commonFields[parent.currentLibrary][field.name];
  commonField.parents.push(ns.findLibraryAncestor(parent));
  commonField.setValues.push(function (field, value) {
    if (value === undefined) {
      delete params[field.name];
    }
    else {
      params[field.name] = value;
    }
  });

  if (commonField.setValues.length === 1) {
    ancestor.$common.parent().removeClass('hidden');
    if (skipAppendTo) {
      commonField.instance.appendTo(ancestor.$common);
    }
    commonField.params = params[field.name];
  }
  else {
    params[field.name] = commonField.params;
  }

  parent.children.push(commonField.instance);
  return commonField;
};

/**
 * Find the nearest library ancestor. Used when adding commonfields.
 *
 * @param {object} parent
 * @returns {ns.findLibraryAncestor.parent|@exp;ns@call;findLibraryAncestor}
 */
ns.findLibraryAncestor = function (parent) {
  if (parent.parent === undefined || parent.field.type === 'library') {
    return parent;
  }
  return ns.findLibraryAncestor(parent.parent);
};

/**
 * getParentZebra
 *
 * Alternate the background color of fields
 *
 * @param parent
 * @returns {string} to determine background color of callee
 */
ns.getParentZebra = function (parent) {
  if (parent.zebra) {
    return parent.zebra;
  }
  else {
    return ns.getParentZebra(parent.parent);
  }
};

/**
 * Find the nearest ancestor which handles commonFields.
 *
 * @param {type} parent
 * @returns {@exp;ns@call;findAncestor|ns.findAncestor.parent}
 */
ns.findAncestor = function (parent) {
  if (parent.commonFields === undefined) {
    return ns.findAncestor(parent.parent);
  }
  return parent;
};

/**
 * Call remove on the given children.
 *
 * @param {Array} children
 * @returns {unresolved}
 */
ns.removeChildren = function (children) {
  if (children === undefined) {
    return;
  }

  for (var i = 0; i < children.length; i++) {
    // Common fields will be removed by library.
    var isCommonField = (children[i].field === undefined ||
                         children[i].field.common === undefined ||
                         !children[i].field.common);

    var hasRemove = (children[i].remove instanceof Function ||
                     typeof children[i].remove === 'function');

    if (isCommonField && hasRemove) {
      children[i].remove();
    }
  }
};

/**
 * Find field from path.
 *
 * @param {String} path
 * @param {Object} parent
 * @returns {@exp;ns.Form@call;findField|Boolean}
 */
ns.findField = function (path, parent) {
  if (typeof path === 'string') {
    path = path.split('/');
  }

  if (path[0] === '..') {
    path.splice(0, 1);
    return ns.findField(path, parent.parent);
  }
  if (parent.children) {
    for (var i = 0; i < parent.children.length; i++) {
      if (parent.children[i].field.name === path[0]) {
        path.splice(0, 1);
        if (path.length) {
          return ns.findField(path, parent.children[i]);
        }
        else {
          return parent.children[i];
        }
      }
    }
  }

  return false;
};

/**
 * Find a semantics field in the semantics structure by name of the field
 * Will return the first found by depth first search if there are identically named fields
 *
 * @param {string} fieldName Name of the field we wish to find
 * @param {Object|Array} semanticsStructure Semantics we wish to find the field within
 * @returns {null|Object} Returns the field if found, otherwise null.
 */
ns.findSemanticsField = function (fieldName, semanticsStructure) {
  if (Array.isArray(semanticsStructure)) {
    for (let i = 0; i < semanticsStructure.length; i++) {
      var semanticsField = ns.findSemanticsField(fieldName, semanticsStructure[i]);
      if (semanticsField !== null) {
        // Return immediately if field is found
        return semanticsField;
      }
    }
    return null;
  }
  else if (semanticsStructure.name === fieldName) {
    return semanticsStructure;
  }
  else if (semanticsStructure.field) {
    // Process field
    return ns.findSemanticsField(fieldName, semanticsStructure.field);
  }
  else if (semanticsStructure.fields) {
    // Process fields
    return ns.findSemanticsField(fieldName, semanticsStructure.fields);
  }
  else {
    // No matching semantics found within known properties and list structures
    return null;
  }
};

/**
 * Follow a field and get all changes to its params.
 *
 * @param {Object} parent The parent object of the field.
 * @param {String} path Relative to parent object.
 * @param {Function} callback Gets called for params changes.
 * @returns {undefined}
 */
ns.followField = function (parent, path, callback) {
  if (path === undefined) {
    return;
  }

  // Find field when tree is ready.
  parent.ready(function () {
    var def;

    if (path instanceof Object) {
      // We have an object with default values
      def = H5P.cloneObject(path);

      if (path.field === undefined) {
        callback(path, null);
        return; // Exit if we have no field to follow.
      }

      path = def.field;
      delete def.field;
    }

    var field = ns.findField(path, parent);

    if (!field) {
      throw ns.t('core', 'unknownFieldPath', {':path': path});
    }
    if (field.changes === undefined) {
      throw ns.t('core', 'noFollow', {':path': path});
    }

    var params = (field.params === undefined ? def : field.params);
    callback(params, field.changes.length + 1);

    field.changes.push(function () {
      var params = (field.params === undefined ? def : field.params);
      callback(params);
    });
  });
};

/**
 * Create HTML wrapper for error messages.
 *
 * @param {String} message
 * @returns {String}
 */
ns.createError = function (message) {
  return '<p>' + message + '</p>';
};

/**
 * Turn a numbered importance into a string.
 *
 * @param {string} importance
 * @returns {String}
 */
ns.createImportance = function (importance) {
  return importance ? 'importance-' + importance : '';
};

/**
 * Create HTML wrapper for field items.
 * Makes sure the different elements are placed in an consistent order.
 *
 * @param {string} type
 * @param {string} [label]
 * @param {string} [description]
 * @param {string} [content]
 * @deprecated since version 1.12 (Jan. 2017, will be removed Jan. 2018). Use createFieldMarkup instead.
 * @see createFieldMarkup
 * @returns {string} HTML
 */
ns.createItem = function (type, label, description, content) {
  return '<div class="field ' + type + '">' +
           (label ? label : '') +
           (description ? '<div class="h5peditor-field-description">' + description + '</div>' : '') +
           (content ? content : '') +
           '<div class="h5p-errors"></div>' +
         '</div>';
};

/**
 * An object describing the semantics of a field
 * @typedef {Object} SemanticField
 * @property {string} name
 * @property {string} type
 * @property {string} label
 * @property {string} [importance]
 * @property {string} [description]
 * @property {string} [widget]
 * @property {boolean} [optional]
 */

/**
 * Create HTML wrapper for a field item.
 * Replacement for createItem()
 *
 * @since 1.12
 * @param  {SemanticField} field
 * @param  {string} content
 *
 * @return {string}
 */
ns.createFieldMarkup = function (field, content) {
  content = content || '';
  var markup = this.createLabel(field) + this.createDescription(field.description) + content;

  return this.wrapFieldMarkup(field, markup);
};

/**
 * Create HTML wrapper for a boolean field item.
 *
 * @param  {SemanticField} field
 * @param  {string} content
 *
 * @return {string}
 */
ns.createBooleanFieldMarkup = function (field, content) {
  var markup =
    '<label class="h5peditor-label">' + content + (field.label || field.name || '') + '</label>' +
    this.createDescription(field.description);

  return this.wrapFieldMarkup(field, markup);
};

/**
 * Wraps a field with some metadata classes, and adds error field
 *
 * @param {SemanticField} field
 * @param {string} markup
 *
 * @private
 * @return {string}
 */
ns.wrapFieldMarkup = function (field, markup) {
  // removes undefined and joins
  var wrapperClasses = this.joinNonEmptyStrings(['field', 'field-name-' + field.name, field.type, ns.createImportance(field.importance), field.widget]);

  // wrap and return
  return '<div class="' + wrapperClasses + '">' +
    markup +
    '<div class="h5p-errors"></div>' +
    '</div>';
};

/**
 * Joins an array of strings if they are defined and non empty
 *
 * @param {string[]} arr
 * @param {string} [separator] Default is space
 * @return {string}
 */
ns.joinNonEmptyStrings = function (arr, separator) {
  separator = separator || ' ';

  return arr.filter(function (str) {
    return str !== undefined && str.length > 0;
  }).join(separator);
};

/**
 * Create HTML for select options.
 *
 * @param {String} value
 * @param {String} text
 * @param {Boolean} selected
 * @returns {String}
 */
ns.createOption = function (value, text, selected) {
  return '<option value="' + value + '"' + (selected !== undefined && selected ? ' selected="selected"' : '') + '>' + text + '</option>';
};

/**
 * Create HTML for text input.
 *
 * @param {String} value
 * @param {number} maxLength
 * @param {String} placeholder
 *
 * @returns {String}
 */
ns.createText = function (value, maxLength, placeholder) {
  var html = '<input class="h5peditor-text" type="text"';

  if (value !== undefined) {
    html += ' value="' + value + '"';
  }

  if (placeholder !== undefined) {
    html += ' placeholder="' + placeholder + '"';
  }

  html += ' maxlength="' + (maxLength === undefined ? 255 : maxLength) + '"/>';

  return html;
};

/**
 * Create a label to wrap content in.
 *
 * @param {SemanticField} field
 * @param {String} [content]
 * @returns {String}
 */
ns.createLabel = function (field, content) {
  // New items can be added next to the label within the flex-wrapper
  var html = '<label class="h5peditor-label-wrapper">';

  // Temporary fix for the old version of CoursePresentation's custom editor
  if (field.widget === 'coursepresentation' && field.name === 'presentation') {
    field.label = 0;
  }

  if (field.label !== 0) {
    html += '<span class="h5peditor-label' + (field.optional ? '' : ' h5peditor-required') + '">' + (field.label === undefined ? field.name : field.label) + '</span>';
  }

  return html + (content || '') + '</label>';
};

/**
 * Create a description
 * @param {String} description
 * @returns {string}
 */
ns.createDescription = function (description) {
  var html = '';
  if (description !== undefined) {
    html += '<div class="h5peditor-field-description">' + description + '</div>';
  }
  return html;
};

/**
 * Create an important description
 * @param {Object} importantDescription
 * @returns {String}
 */
ns.createImportantDescription = function (importantDescription) {
  var html = '';

  if (importantDescription !== undefined) {
    html += '<div class="h5peditor-field-important-description">' +
              '<div class="important-description-tail">' +
              '</div>' +
              '<div class="important-description-close" role="button" tabindex="0" aria-label="' + ns.t('core', 'hideImportantInstructions') + '">' +
                '<span>' +
                   ns.t('core', 'hide') +
                '</span>' +
              '</div>' +
              '<span class="h5p-info-icon">' +
              '</span>' +
              '<span class="important-description-title">' +
                 ns.t('core', 'importantInstructions') +
              '</span>';

    if (importantDescription.description !== undefined) {
      html += '<div class="important-description-content">' +
                 importantDescription.description +
              '</div>';
    }

    if (importantDescription.example !== undefined) {
      html += '<div class="important-description-example">' +
                '<div class="important-description-example-title">' +
                  '<span>' +
                     ns.t('core', 'example') +
                  ':</span>' +
                '</div>' +
                '<div class="important-description-example-text">' +
                  '<span>' +
                     importantDescription.example +
                  '</span>' +
                '</div>' +
              '</div>';
    }

    html += '</div>' +
            '<span class="important-description-show" role="button" tabindex="0">' +
              ns.t('core', 'showImportantInstructions') +
            '</span><span class="important-description-clear-right"></span>';
  }

  return html;
};

/**
 * Bind events to important description
 * @param {Object} widget
 * @param {String} fieldName
 * @param {Object} parent
 */
ns.bindImportantDescriptionEvents = function (widget, fieldName, parent) {
  var context;

  if (!widget.field.important) {
    return;
  }

  // Generate a context string for using as referance in ex. localStorage.
  var librarySelector = ns.findLibraryAncestor(parent);
  if (librarySelector.currentLibrary !== undefined) {
    var lib = librarySelector.currentLibrary.split(' ')[0];
    context = (lib + '-' + fieldName).replace(/\.|_/g,'-') + '-important-description-open';
  }

  // Set first occurance to visible
  ns.storage.get(context, function (value) {
    if (value === undefined || value === true) {
      widget.$item.addClass('important-description-visible');
    }
  });

  widget.$item.addClass('has-important-description');

  // Bind events to toggle button and update aria-pressed
  widget.$item.find('.important-description-show')
    .click(function () {
      widget.$item.addClass('important-description-visible');
      ns.storage.set(context, true);
    })
    .keydown(function (event) {
      if (event.which == 13 || event.which == 32) {
        ns.$(this).trigger('click');
        event.preventDefault();
      }
    });

  // Bind events to close button and update aria-pressed of toggle button
  widget.$item.find('.important-description-close')
    .click(function () {
      widget.$item.removeClass('important-description-visible');
      ns.storage.set(context, false);
    })
    .keydown(function (event) {
      if (event.which == 13 || event.which == 32) {
        ns.$(this).trigger('click');
        event.preventDefault();
      }
    });
};

/**
 * Generate markup for the copy and paste buttons.
 *
 * @returns {string} HTML
 */
ns.createCopyPasteButtons = function () {
  return '<div class="h5peditor-copypaste-wrap">' +
           '<button class="h5peditor-copy-button disabled" title="' + H5PEditor.t('core', 'copyToClipboard') + '">' + ns.t('core', 'copyButton') + '</button>' +
           '<button class="h5peditor-paste-button disabled" title="' + H5PEditor.t('core', 'pasteFromClipboard') + '">' + ns.t('core', 'pasteButton') + '</button>' +
         '</div><div class="h5peditor-clearfix"></div>';
};

/**
 * Confirm replace if there is content selected
 *
 * @param {string} library Current selected library
 * @param {number} top Offset
 * @param {function} next Next callback
 */
ns.confirmReplace = function (library, top, next) {
  if (library) {
    // Confirm changing library
    var confirmReplace = new H5P.ConfirmationDialog({
      headerText: H5PEditor.t('core', 'pasteContent'),
      dialogText: H5PEditor.t('core', 'confirmPasteContent'),
      confirmText: H5PEditor.t('core', 'confirmPasteButtonText')
    }).appendTo(document.body);
    confirmReplace.on('confirmed', next);
    confirmReplace.show(top);
  }
  else {
    // No need to confirm
    next();
  }
};

/**
 * Check if any errors has been set.
 *
 * @param {jQuery} $errors
 * @param {jQuery} $input
 * @param {String} value
 * @returns {mixed}
 */
ns.checkErrors = function ($errors, $input, value) {
  if ($errors.children().length) {
    $input.keyup(function (event) {
      if (event.keyCode === 9) { // TAB
        return;
      }
      $errors.html('');
      $input.removeClass('error');
      $input.unbind('keyup');
    });

    return false;
  }
  return value;
};

/**
 * @param {object} library
 *  with machineName, majorVersion and minorVersion params
 * @returns {string}
 *  Concatinated version of the library
 */
ns.libraryToString = function (library) {
  return library.name + ' ' + library.majorVersion + '.' + library.minorVersion;
};

/**
 * TODO: Remove from here, and use from H5P instead(move this to the h5p.js...)
 *
 * @param {string} library
 *  library in the format machineName majorVersion.minorVersion
 * @returns
 *  library as an object with machineName, majorVersion and minorVersion properties
 *  return false if the library parameter is invalid
 */
ns.libraryFromString = function (library) {
  var regExp = /(.+)\s(\d+)\.(\d+)$/g;
  var res = regExp.exec(library);
  if (res !== null) {
    return {
      'machineName': res[1],
      'majorVersion': res[2],
      'minorVersion': res[3]
    };
  }
  else {
    H5P.error('Invalid überName');
    return false;
  }
};

/**
 * Helper function for detecting field widget.
 *
 * @param {Object} field
 * @returns {String} Widget name
 */
ns.getWidgetName = function (field) {
  return (field.widget === undefined ? field.type : field.widget);
};

/**
 * Mimics how php's htmlspecialchars works (the way we uses it)
 */
ns.htmlspecialchars = function (string) {
  return string.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#039;').replace(/"/g, '&quot;');
};

/**
 * Makes it easier to add consistent buttons across the editor widget.
 *
 * @param {string} id Typical CSS class format
 * @param {string} title Human readable format
 * @param {function} handler Action handler when triggered
 * @param {boolean} [displayTitle=false] Show button with text
 * @return {H5P.jQuery}
 */
ns.createButton = function (id, title, handler, displayTitle) {
  var options = {
    class: 'h5peditor-button ' + (displayTitle ? 'h5peditor-button-textual ' : '') + id,
    role: 'button',
    tabIndex: 0,
    'aria-disabled': 'false',
    on: {
      click: function () {
        handler.call(this);
      },
      keydown: function (event) {
        switch (event.which) {
          case 13: // Enter
          case 32: // Space
            handler.call(this);
            event.preventDefault();
        }
      }
    }
  };

  // Determine if we're a icon only button or have a textual label
  options[displayTitle ? 'html' : 'aria-label'] = title;

  return ns.$('<div/>', options);
};

/**
 * Check if the current library is entitled for the metadata button. True by default.
 *
 * It will probably be okay to remove this check at some point in time when
 * the majority of content types and plugins have been updated to a version
 * that supports the metadata system.
 *
 * @param {string} library - Current library.
 * @return {boolean} True, if form should have the metadata button.
 */
ns.enableMetadata = function (library) {

  if (!library || typeof library !== 'string') {
    return false;
  }

  library = H5P.libraryFromString(library);
  if (!library) {
    return false;
  }

  // This list holds all old libraries (/older versions implicitly) that need an update for metadata
  const blackList = [
    // Should never have metadata because it does not make sense
    'H5P.IVHotspot 1.2',
    'H5P.Link 1.3',
    'H5P.TwitterUserFeed 1.0',
    'H5P.GoToQuestion 1.3',
    'H5P.Nil 1.0',

    // Copyright information moved to metadata
    'H5P.Audio 1.2',
    'H5P.Video 1.4',
    'H5P.Image 1.0',

    // Title moved to metadata
    'H5P.DocumentExportPage 1.3',
    'H5P.ExportableTextArea 1.2',
    'H5P.GoalsAssessmentPage 1.3',
    'H5P.GoalsPage 1.4',
    'H5P.StandardPage 1.3',
    'H5P.DragQuestion 1.12',
    'H5P.ImageHotspotQuestion 1.7',

    // Custom editor changed
    'H5P.CoursePresentation 1.19',
    'H5P.InteractiveVideo 1.19'
  ];

  let block = blackList.filter(function (item) {
    // + ' ' makes sure to avoid partial matches
    return item.indexOf(library.machineName + ' ') !== -1;
  });
  if (block.length === 0) {
    return true;
  }

  block = H5P.libraryFromString(block[0]);
  if (library.majorVersion > block.majorVersion || library.majorVersion === block.majorVersion && library.minorVersion > block.minorVersion) {
    return true;
  }

  return false;
};

/**
 * Show a toast message.
 *
 * The reference element could be dom elements the toast should be attached to,
 * or e.g. the document body for general toast messages.
 *
 * @param {DOM} element Reference element to show toast message for.
 * @param {string} message Message to show.
 * @param {object} [config] Configuration.
 * @param {string} [config.style=h5p-editor-toast] Style name for the tooltip.
 * @param {number} [config.duration=3000] Toast message length in ms.
 * @param {object} [config.position] Relative positioning of the toast.
 * @param {string} [config.position.horizontal=centered] [before|left|centered|right|after].
 * @param {string} [config.position.vertical=below] [above|top|centered|bottom|below].
 * @param {number} [config.position.offsetHorizontal=0] Extra horizontal offset.
 * @param {number} [config.position.offsetVertical=0] Extra vetical offset.
 * @param {boolean} [config.position.noOverflowLeft=false] True to prevent overflow left.
 * @param {boolean} [config.position.noOverflowRight=false] True to prevent overflow right.
 * @param {boolean} [config.position.noOverflowTop=false] True to prevent overflow top.
 * @param {boolean} [config.position.noOverflowBottom=false] True to prevent overflow bottom.
 * @param {boolean} [config.position.noOverflowX=false] True to prevent overflow left and right.
 * @param {boolean} [config.position.noOverflowY=false] True to prevent overflow top and bottom.
 * @param {object} [config.position.overflowReference=document.body] DOM reference for overflow.
 */
ns.attachToastTo = function (element, message, config) {
  if (element === undefined || message === undefined) {
    return;
  }

  const eventPath = function (evt) {
    var path = (evt.composedPath && evt.composedPath()) || evt.path;
    var target = evt.target;

    if (path != null) {
      // Safari doesn't include Window, but it should.
      return (path.indexOf(window) < 0) ? path.concat(window) : path;
    }

    if (target === window) {
      return [window];
    }

    function getParents(node, memo) {
      memo = memo || [];
      var parentNode = node.parentNode;

      if (!parentNode) {
        return memo;
      }
      else {
        return getParents(parentNode, memo.concat(parentNode));
      }
    }

    return [target].concat(getParents(target), window);
  };

  /**
   * Handle click while toast is showing.
   */
  const clickHandler = function (event) {
    /*
     * A common use case will be to attach toasts to buttons that are clicked.
     * The click would remove the toast message instantly without this check.
     * Children of the clicked element are also ignored.
     */
    var path = eventPath(event);
    if (path.indexOf(element) !== -1) {
      return;
    }
    clearTimeout(timer);
    removeToast();
  };



  /**
   * Remove the toast message.
   */
  const removeToast = function () {
    document.removeEventListener('click', clickHandler);
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  };

  /**
   * Get absolute coordinates for the toast.
   *
   * @param {DOM} element Reference element to show toast message for.
   * @param {DOM} toast Toast element.
   * @param {object} [position={}] Relative positioning of the toast message.
   * @param {string} [position.horizontal=centered] [before|left|centered|right|after].
   * @param {string} [position.vertical=below] [above|top|centered|bottom|below].
   * @param {number} [position.offsetHorizontal=0] Extra horizontal offset.
   * @param {number} [position.offsetVertical=0] Extra vetical offset.
   * @param {boolean} [position.noOverflowLeft=false] True to prevent overflow left.
   * @param {boolean} [position.noOverflowRight=false] True to prevent overflow right.
   * @param {boolean} [position.noOverflowTop=false] True to prevent overflow top.
   * @param {boolean} [position.noOverflowBottom=false] True to prevent overflow bottom.
   * @param {boolean} [position.noOverflowX=false] True to prevent overflow left and right.
   * @param {boolean} [position.noOverflowY=false] True to prevent overflow top and bottom.
   * @return {object}
   */
  const getToastCoordinates = function (element, toast, position) {
    position = position || {};
    position.offsetHorizontal = position.offsetHorizontal || 0;
    position.offsetVertical = position.offsetVertical || 0;

    const toastRect = toast.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    let left = 0;
    let top = 0;

    // Compute horizontal position
    switch (position.horizontal) {
      case 'before':
        left = elementRect.left - toastRect.width - position.offsetHorizontal;
        break;
      case 'after':
        left = elementRect.left + elementRect.width + position.offsetHorizontal;
        break;
      case 'left':
        left = elementRect.left + position.offsetHorizontal;
        break;
      case 'right':
        left = elementRect.left + elementRect.width - toastRect.width - position.offsetHorizontal;
        break;
      case 'centered':
        left = elementRect.left + elementRect.width / 2 - toastRect.width / 2 + position.offsetHorizontal;
        break;
      default:
        left = elementRect.left + elementRect.width / 2 - toastRect.width / 2 + position.offsetHorizontal;
    }

    // Compute vertical position
    switch (position.vertical) {
      case 'above':
        top = elementRect.top - toastRect.height - position.offsetVertical;
        break;
      case 'below':
        top = elementRect.top + elementRect.height + position.offsetVertical;
        break;
      case 'top':
        top = elementRect.top + position.offsetVertical;
        break;
      case 'bottom':
        top = elementRect.top + elementRect.height - toastRect.height - position.offsetVertical;
        break;
      case 'centered':
        top = elementRect.top + elementRect.height / 2 - toastRect.height / 2 + position.offsetVertical;
        break;
      default:
        top = elementRect.top + elementRect.height + position.offsetVertical;
    }

    // Prevent overflow
    const overflowElement = document.body;
    const bounds = overflowElement.getBoundingClientRect();
    if ((position.noOverflowLeft || position.noOverflowX) && (left < bounds.x)) {
      left = bounds.x;
    }
    if ((position.noOverflowRight || position.noOverflowX) && ((left + toastRect.width) > (bounds.x + bounds.width))) {
      left = bounds.x + bounds.width - toastRect.width;
    }
    if ((position.noOverflowTop || position.noOverflowY) && (top < bounds.y)) {
      top = bounds.y;
    }
    if ((position.noOverflowBottom || position.noOverflowY) && ((top + toastRect.height) > (bounds.y + bounds.height))) {
      left = bounds.y + bounds.height - toastRect.height;
    }

    return {left: left, top: top};
  };

  // Sanitization
  config = config || {};
  config.style = config.style || 'h5p-editor-toast';
  config.duration = config.duration || 3000;

  // Build toast
  const toast = document.createElement('div');
  toast.setAttribute('id', config.style);
  toast.classList.add('h5p-toast-disabled');
  toast.classList.add(config.style);

  const msg = document.createElement('span');
  msg.innerHTML = message;
  toast.appendChild(msg);

  document.body.appendChild(toast);

  // The message has to be set before getting the coordinates
  const coordinates = getToastCoordinates(element, toast, config.position);
  toast.style.left = Math.round(coordinates.left) + 'px';
  toast.style.top = Math.round(coordinates.top) + 'px';

  toast.classList.remove('h5p-toast-disabled');
  const timer = setTimeout(removeToast, config.duration);

  // The toast can also be removed by clicking somewhere
  document.addEventListener('click', clickHandler);
};

/**
 * Check if clipboard can be pasted.
 *
 * @param {Object} clipboard Clipboard data.
 * @param {Object} libs Libraries to compare against.
 * @return {boolean} True, if content can be pasted.
 */
ns.canPaste = function (clipboard, libs) {
  return (this.canPastePlus(clipboard, libs)).canPaste;
};

/**
 * Check if clipboard can be pasted and give reason if not.
 *
 * @param {Object} clipboard Clipboard data.
 * @param {Object} libs Libraries to compare against.
 * @return {Object} Results. {canPaste: boolean, reason: string, description: string}.
 */
ns.canPastePlus = function (clipboard, libs) {
  // Clipboard is empty
  if (!clipboard || !clipboard.generic) {
    return {
      canPaste: false,
      reason: 'pasteNoContent',
      description: ns.t('core', 'pasteNoContent')
    };
  }

  // No libraries to compare to
  if (libs === undefined) {
    return {
      canPaste: false,
      reason: 'pasteError',
      description: ns.t('core', 'pasteError')
    };
  }

  // Translate Hub format to common library format
  if (libs.libraries !== undefined) {
    libs = libs.libraries;
    libs.forEach(function (lib) {
      lib.name = lib.machineName;
      lib.majorVersion = lib.localMajorVersion;
      lib.minorVersion = lib.localMinorVersion;
    });
  }

  // Check if clipboard library type is available
  const machineNameClip = clipboard.generic.library.split(' ')[0];
  let candidates = libs.filter(function (library) {
    return library.name === machineNameClip;
  });
  if (candidates.length === 0) {
    return {
      canPaste: false,
      reason: 'pasteContentNotSupported',
      description: ns.t('core', 'pasteContentNotSupported')
    };
  }

  // Check if clipboard library version is available
  const versionClip = clipboard.generic.library.split(' ')[1];
  const match = candidates.some(function (candidate) {
    return ('' + candidate.majorVersion + '.' + candidate.minorVersion) === versionClip;
  });
  if (match) {
    return {canPaste: true};
  }

  // Sort remaining candidates by version number
  candidates = candidates
    .map(function (candidate) {
      return '' + candidate.majorVersion + '.' + candidate.minorVersion;
    })
    .map(function (candidate) {
      return candidate.replace(/\d+/g, function (d) {
        return +d + 1000;
      });
    })
    .sort()
    .map(function (candidate) {
      return candidate.replace(/\d+/g, function (d) {
        return +d - 1000;
      });
    });

  // Clipboard library is newer than latest available local library
  const candidateMax = candidates.slice(-1)[0];
  if (+candidateMax.split('.')[0] < +versionClip.split('.')[0] ||
      (+candidateMax.split('.')[0] === +versionClip.split('.')[0] &&
      +candidateMax.split('.')[1] < +versionClip.split('.')[1])) {
    return {
      canPaste: false,
      reason: 'pasteTooNew',
      description: ns.t('core', 'pasteTooNew', {
        ':clip': versionClip,
        ':local': candidateMax
      })
    };
  }

  // Clipboard library is older than latest available local library
  const candidateMin = candidates.slice(0, 1)[0];
  if (+candidateMin.split('.')[0] > +versionClip.split('.')[0] ||
      (+candidateMin.split('.')[0] === +versionClip.split('.')[0] &&
       +candidateMin.split('.')[1] > +versionClip.split('.')[1])) {
    return {
      canPaste: false,
      reason: 'pasteTooOld',
      description: ns.t('core', 'pasteTooOld', {
        ':clip': versionClip,
        ':local': candidateMin
      })
    };
  }

  return {
    canPaste: false,
    reason: 'pasteError',
    description: ns.t('core', 'pasteError')
  };
};

// Factory for creating storage instance
ns.storage = (function () {
  var instance = {
    get: function (key, next) {
      var value;

      // Get value from browser storage
      if (window.localStorage !== undefined) {
        value = !!window.localStorage.getItem(key);
      }

      // Try to get a better value from user data storage
      try {
        H5P.getUserData(0, key, function (err, result) {
          if (!err) {
            value = result;
          }
          next(value);
        });
      }
      catch (err) {
        next(value);
      }
    },
    set: function (key, value) {

      // Store in browser
      if (window.localStorage !== undefined) {
        window.localStorage.setItem(key, value);
      }

      // Try to store in user data storage
      try {
        H5P.setUserData(0, key, value);
      }
      catch (err) { /*Intentionally left empty*/ }
    }
  };
  return instance;
})();
