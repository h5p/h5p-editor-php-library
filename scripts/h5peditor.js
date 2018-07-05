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
              '/>')
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

          ns.libraryRequested(libraryName, function (semen) {
            callback(semen);

            // Run queue.
            if (ns.loadedCallbacks[libraryName]) {
              for (var i = 0; i < ns.loadedCallbacks[libraryName].length; i++) {
                ns.loadedCallbacks[libraryName][i](semen);
              }
            }
          });
        },
        error: function(jqXHR, textStatus, errorThrown) {
          if (window['console'] !== undefined) {
            console.log('Ajax request failed');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
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
}

/**
 * Recursive processing of the semantics chunks.
 *
 * @param {array} semanticsChunk
 * @param {object} params
 * @param {jQuery} $wrapper
 * @param {mixed} parent
 * @returns {undefined}
 */
ns.processSemanticsChunk = function (semanticsChunk, params, $wrapper, parent) {
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

      ns.addCommonField(field, parent, params, ancestor);
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

  if (!parent.passReadies) {
    // Run ready callbacks.
    for (var i = 0; i < parent.readies.length; i++) {
      parent.readies[i]();
    }
    delete parent.readies;
  }
};

/**
 * Add a field to the common container.
 *
 * @param {object} field
 * @param {object} parent
 * @param {object} params
 * @param {object} ancestor
 * @returns {undefined}
 */
ns.addCommonField = function (field, parent, params, ancestor) {
  var commonField;
  if (ancestor.commonFields[parent.library] === undefined) {
    ancestor.commonFields[parent.library] = {};
  }

  ancestor.commonFields[parent.library][parent.currentLibrary] =
    ancestor.commonFields[parent.library][parent.currentLibrary] || {};

  if (ancestor.commonFields[parent.library][parent.currentLibrary][field.name] === undefined) {
    var widget = ns.getWidgetName(field);
    ancestor.commonFields[parent.library][parent.currentLibrary][field.name] = {
      instance: new ns.widgets[widget](parent, field, params[field.name], function (field, value) {
          for (var i = 0; i < commonField.setValues.length; i++) {
            commonField.setValues[i](field, value);
          }
        }),
      setValues: [],
      parents: []
    };
  }

  commonField = ancestor.commonFields[parent.library][parent.currentLibrary][field.name];
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
    commonField.instance.appendTo(ancestor.$common);
    commonField.params = params[field.name];
  }
  else {
    params[field.name] = commonField.params;
  }

  parent.children.push(commonField.instance);
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
  // There's no good way to retrieve the current library the label is processed for, is it?
  // We use the previous library's state of entitlement instead.
  const wrapperFront = (this.previousLibraryEntitledForMetadata) ? '<div class="h5p-editor-flex-wrapper">' : '';
  const wrapperBack = (this.previousLibraryEntitledForMetadata) ? '</div>' : '';

  // New items can be added next to the label within the flex-wrapper
  var html = wrapperFront + '<label class="h5peditor-label-wrapper">';

  if (field.label !== 0) {
    html += '<span class="h5peditor-label' + (field.optional ? '' : ' h5peditor-required') + '">' + (field.label === undefined ? field.name : field.label) + '</span>';
  }

  return html + (content || '') + '</label>' + wrapperBack;
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
  var that = this;
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

  var $importantField = widget.$item.find('.h5peditor-field-important-description');

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
    .keydown(function () {
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
    .keydown(function () {
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
  return '<label class="h5peditor-copypaste-wrap">' +
           '<button class="h5peditor-copy-button" disabled>' + ns.t('core', 'copyButton') + '</button>' +
           '<button class="h5peditor-paste-button" disabled>' + ns.t('core', 'pasteButton') + '</button>' +
         '</label>';
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
      dialogText: H5PEditor.t('core', 'confirmPasteContent')
    }).appendTo(document.body);
    confirmReplace.on('confirmed', next);
    confirmReplace.show(top);
  }
  else {
    // No need to confirm
    next();
  }
}

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
ns.htmlspecialchars = function(string) {
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
      click: function (event) {
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
 * Sync two input fields. Empty fields will take value of the other or be set to ''.
 * master fields takes precedence if both are set already.
 *
 * @param {jQuery} $masterField - Master field that holds the value for initialization.
 * @param {jQuery} $slaveField - Slave field to be synced with.
 * @param {object} [options] - Options.
 * @param {string} [options.defaultText] - Default text if fields are empty.
 * @param {string} [options.listenerName] - Listener name.
 */
 ns.sync = function ($masterField, $slaveField, options) {
  if (!$masterField || $masterField.length === 0 || !$slaveField || $slaveField.length === 0) {
    return;
  }
  options = options || {};

  const listenerName = options.listenerName || 'input.metadata-sync';

  // Remove old sync
  $masterField.off(listenerName);
  $slaveField.off(listenerName);

  // Initialize fields
  if ($masterField.val()) {
    $slaveField.val($masterField.val()).trigger('change');
  }
  else if ($slaveField.val()) {
    $masterField.val($slaveField.val()).trigger('change');
  }
  else if (options.defaultText) {
    $masterField.val(options.defaultText).trigger('change');
    $slaveField.val(options.defaultText).trigger('change');
  }

  // Keep fields in sync
  $masterField.on(listenerName, function() {
    $slaveField.val($masterField.val()).trigger('change');
  });
  $slaveField.on(listenerName, function() {
    $masterField.val($slaveField.val()).trigger('change');
  });
};

/**
 * Check if the current library is entitled for the metadata button. No by default.
 *
 * It will probably be okay to remove this check at some point in time when
 * the majority of content types and plugins have been updated to a version
 * that supports the metadata system.
 *
 * @param {string} library - Current library.
 * @return {boolean} True, if form should have the metadata button.
 */
ns.entitledForMetadata = function (library) {
  this.previousLibraryEntitledForMetadata = false;

  if (!library || typeof library !== 'string') {
    return false;
  }

  library = H5P.libraryFromString(library);
  if (!library) {
    return false;
  }

  // This list holds all the libraries that (and later) are ready for metadata
  const passList = [
    'H5P.Accordion 1.1',
    'H5P.AdvancedText 1.2',
    'H5P.Agamotto 1.4',
    'H5P.AppearIn 1.1',
    'H5P.ArithmeticQuiz 1.2',
    'H5P.Audio 1.3',
    'H5P.AudioRecorder 1.1',
    'H5P.Blanks 1.11',
    'H5P.Chart 1.3',
    'H5P.Collage 0.4',
    'H5P.Column 1.8',
    'H5P.ContinuousText 1.3',
    'H5P.CoursePresentation 1.20',
    'H5P.Dialogcards 1.8',
    'H5P.DocumentationTool 1.7',
    'H5P.DocumentExportPage 1.4',
    'H5P.DragQuestion 1.13',
    'H5P.DragText 1.8',
    'H5P.Essay 1.2',
    'H5P.ExportableTextArea 1.3',
    'H5P.ExportPage 1.2',
    'H5P.FacebookPageFeed 1.1',
    'H5P.Flashcards 1.6',
    'H5P.FreeTextQuestion 1.1',
    'H5P.GoalsAssessmentPage 1.4',
    'H5P.GoalsPage 1.5',
    'H5P.GoToQuestion 1.4',
    'H5P.GuessTheAnswer 1.4',
    'H5P.IFrameEmbed 1.1',
    'H5P.Image 1.1',
    'H5P.ImageHotspotQuestion 1.8',
    'H5P.ImageHotspots 1.7',
    'H5P.ImageJuxtaposition 1.2',
    'H5P.ImageMultipleHotspotQuestion 1.1',
    'H5P.ImagePair 1.4',
    'H5P.ImageSequencing 1.1',
    'H5P.ImageSlider 1.1',
    'H5P.InteractiveVideo 1.20',
    'H5P.IVHotspot 1.3',
    'H5P.Link 1.4',
    'H5P.MarkTheWords 1.9',
    'H5P.MemoryGame 1.3',
    'H5P.MultiChoice 1.13',
    'H5P.OpenEndedQuestion 1.1',
    'H5P.PersonalityQuiz 1.1',
    'H5P.Questionnaire 1.3',
    'H5P.QuestionSet 1.16',
    'H5P.SimpleMultiChoice 1.2',
    'H5P.SingleChoiceSet 1.11',
    'H5P.SpeakTheWords 1.4',
    'H5P.SpeakTheWordsSet 1.2',
    'H5P.StandardPage 1.4',
    'H5P.Summary 1.10',
    'H5P.Table 1.2',
    'H5P.Text 1.2',
    'H5P.TextInputField 1.2',
    'H5P.Timeline 1.2',
    'H5P.TrueFalse 1.5',
    'H5P.TwitterUserFeed 1.1',
    'H5P.Video 1.5'
  ];

  let pass = passList.filter(function(item) {
    return item.indexOf(library.machineName + ' ') !== -1;
  });
  if (pass.length === 0) {
    return false;
  }

  pass = H5P.libraryFromString(pass[0]);
  if (library.majorVersion < pass.majorVersion || library.minorVersion < pass.minorVersion) {
    return false;
  }

  this.previousLibraryEntitledForMetadata = true;

  return true;
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
      catch (err) {}
    },
  };
  return instance;
})();
