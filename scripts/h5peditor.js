/**
 * This file contains helper functions for the editor.
 */

var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

/**
 * Keep track of our widgets.
 */
ns.widgets = {};

/**
 * Keeps track of which semantics are loaded.
 */
ns.loadedSemantics = {};

/**
 * Keeps track of callbacks to run once a semantic gets loaded.
 */
ns.semanticsLoaded = {};

/**
 * Indiciates if the user is using Internet Explorer.
 */
ns.isIE = navigator.userAgent.match(/; MSIE \d+.\d+;/) !== null;

/**
 * The current localization mapping. To be translated by your framework.
 */
ns.l10n = {
  missingTranslation: '[Missing translation :key]',
  loading: 'Loading :type...',
  selectLibrary: 'Select the library you wish to use for your content.',
  unknownFieldPath: 'Unable to find ":path".',
  notImageField: '":path" is not an image.',
  notImageOrDimensionsField: '":path" is not an image or dimensions field.',
  requiredProperty: 'The :property is required and must have a value.',
  onlyNumbers: 'The :property value can only contain numbers.',
  exceedsMax: 'The :property value exceeds the maximum of :max.',
  exceedsMin: 'The :property value exceeds the minimum of :min.',
  outOfStep: 'The :property value can only be changed in steps of :step.',
  addFile: 'Add file',
  removeFile: 'Remove file',
  confirmRemoval: 'Are you sure you wish to remove this :type?',
  changeFile: 'Change file',
  semanticsError: 'Semantics error: :error',
  missingProperty: 'Field :index is missing its :property property.',
  expandCollapse: 'Expand/Collapse',
  addEntity: 'Add :entity',
  tooLong: 'Field value is too long, should contain :max letters or less.',
  invalidFormat: 'Field value contains an invalid format or characters that are forbidden.',
  confirmChangeLibrary: 'Are you sure you wish to change library?'
};

/**
 * Translate text strings.
 * 
 * @param {String} key
 * @param {Object} vars
 * @returns {String|@exp;H5peditor@call;t}
 */
ns.t = function (key, vars) {
  if (ns.l10n[key] === undefined) {
    return key === 'missingTranslation' ? '[Missing translation "' + key + '"]' : ns.t('missingTranslation', {':key': key});
  }
  
  var translation = ns.l10n[key];
  
  // Replace placeholder with variables.
  for (var placeholder in vars) {
    translation = translation.replace(placeholder, vars[placeholder]);
  }
  
  return translation;
};

/**
 * Extremely advanced function that loads the given library, inserts any css and js and
 * then runs the callback with the samantics as an argument.
 * 
 * @param {string} libraryName
 *  On the form machineName.majorVersion.minorVersion
 * @param {function} callback
 * @returns {undefined}
 */
ns.loadLibrary = function (libraryName, callback) {
  switch (ns.loadedSemantics[libraryName]) {
    default:
      // Get semantics from cache.
      callback(ns.loadedSemantics[libraryName]);
      break;
      
    case 0:
      // Add to queue.
      ns.semanticsLoaded[libraryName].push(callback);
      break;
    
    case undefined:
      // Load semantics.
      ns.loadedSemantics[libraryName] = 0; // Indicates that others should queue.
      ns.semanticsLoaded[libraryName] = []; // Other callbacks to run once loaded.
      var library = ns.libraryFromString(libraryName);
      ns.$.get(ns.basePath + 'libraries/' + library.machineName + '/' + library.majorVersion + '/' + library.minorVersion, function (libraryData) {
        libraryData.semantics = JSON.parse(libraryData.semantics);
        ns.loadedSemantics[libraryName] = libraryData.semantics;
        
        // Add CSS.
        if (libraryData.css !== undefined) {
          ns.$('head').append('<style type="text/css">' + libraryData.css + '</style>');
        }
        
        // Add JS.
        if (libraryData.javascript !== undefined) {
          eval.apply(window, [libraryData.javascript]);
        }
        
        callback(libraryData.semantics);

        // Run queue.
        for (var i = 0; i < ns.semanticsLoaded[libraryName].length; i++) {
          ns.semanticsLoaded[libraryName][i](libraryData.semantics);
        }
      });
  }
};

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
  
  for (var i = 0; i < semanticsChunk.length; i++) {
    var field = semanticsChunk[i];
    
    // Check generic field properties.
    if (field.name === undefined) {
      throw ns.t('missingProperty', {':index': i, ':property': 'name'});
    }
    if (field.type === undefined) {
      throw ns.t('missingProperty', {':index': i, ':property': 'type'});
    }
    
    // Set default value.
    if (params[field.name] === undefined && field['default'] !== undefined) {
      params[field.name] = field['default'];
    }
    
    var widget = field.widget === undefined ? field.type : field.widget;

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
};

ns.addCommonField = function (field, parent, params, ancestor) {
  var commonField;
  if (ancestor.commonFields[parent.library] === undefined) {
    ancestor.commonFields[parent.library] = {};
  }
      
  if (ancestor.commonFields[parent.library][field.name] === undefined) {
    var widget = field.widget === undefined ? field.type : field.widget;
    ancestor.commonFields[parent.library][field.name] = { 
      instance: new ns.widgets[widget](parent, field, params[field.name], function (field, value) {
          for (var i = 0; i < commonField.setValues.length; i++) {
            commonField.setValues[i](field, value);
          }
        }),
      setValues: [],
      parents: []
    };
  }
  
  commonField = ancestor.commonFields[parent.library][field.name];
  commonField.parents.push(parent);
  commonField.setValues.push(function (field, value) {
    if (value === undefined) {
      delete params[field.name];
    }
    else {
      params[field.name] = value;
    }
  });
      
  if (commonField.setValues.length === 1) {
    commonField.instance.appendTo(ancestor.$common);
    commonField.params = params[field.name];
  }
  else {
    params[field.name] = commonField.params;
  }
      
  parent.children.push(commonField.instance);
};

ns.findAncestor = function (parent) {
  if (parent.commonFields === undefined) {
    return ns.findAncestor(parent.parent);
  }
  return parent;
};

ns.removeChildren = function (children) {
  for (var i = 0; i < children.length; i++) {
    // Common fields will be removed by library.
    if (children[i].field.common === undefined || !children[i].field.common) {
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
  
  for (var i = 0; i < parent.children.length; i++) {
    if (parent.children[i].field.name === path[0]) {
      path.splice(0, 1);
      if (path.length > 1) {
        return ns.findField(path, parent.children[i]);
      }
      else {
        return parent.children[i];
      }
    }
  }
  
  return false;
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
 * Create HTML wrapper for field items.
 * 
 * @param {String} type
 * @param {String} content
 * @returns {String}
 */
ns.createItem = function (type, content) {
  return '<div class="field ' + type + '">' + content + '<div class="errors"></div></div>';
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
 * @param {String} description
 * @param {String} value
 * @param {Integer} maxLength
 * @returns {String}
 */
ns.createText = function (hint, value, maxLength, description) {
  var html = '<input type="text"';
  
  if (value !== undefined) {
    html += ' value="' + value + '"';
  }
  
  if (hint !== undefined) {
    html += ' placeholder="' + hint + '"';
  }

  html += ' maxlength="' + (maxLength === undefined ? 255 : maxLength) + '"/>';
  
  if (description !== undefined) {
    html += '<div class="h5p-description">' + description + '</div>';
  }

  return html;
};

/**
 * Create a label to wrap content in.
 * 
 * @param {Object} field
 * @param {String} content
 * @returns {String}
 */
ns.createLabel = function (field, content) {
  var html = '<label>';
  
  if (field.label !== 0) {
    html += '<span class="label">' + (field.label === undefined ? field.name : field.label) + '</span>';
  }
  
  return html + content + '</label>';
};

/**
 * Remove all empty spaces before and after the value.
 * 
 * @param {String} value
 * @returns {@exp;value@call;replace}
 */
ns.trim = function (value) {
  return value.replace(/^\s+|\s+$/g, '');
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
  return library.machineName + ' ' + library.majorVersion + '.' + library.minorVersion;
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
  var regExp = /(.+)\s(\d)+\.(\d)$/g;
  var res = regExp.exec(library);
  if (res !== null) {
    return {
      'machineName': res[1],
      'majorVersion': res[2],
      'minorVersion': res[3]
    };
  }
  else {
    return false;
  }
};