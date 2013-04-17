var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

/**
 * Construct the editor.
 * 
 * @param {String} library
 * @param {Object} defaultParams
 * @returns {H5peditor}
 */
ns.Editor = function (library, defaultParams) {
  var that = this;
  
  if (ns.$document === undefined) {
    ns.$document = ns.$(document);
  }
  if (ns.$body === undefined) {
    ns.$body = ns.$('body');
  }
  
  // Create a wrapper
  this.$wrapper = ns.$('<div class="h5peditor">' + ns.t('loading', {':type': 'libraries'}) + '</div>');

  // Load libraries.
  ns.$.get(ns.basePath + 'libraries', function (data) {
    that.selector = new ns.LibrarySelector(data, library, defaultParams);
    that.selector.appendTo(that.$wrapper.html(''));
    if (library) {
      that.selector.$selector.change();
    }
  });
};

/**
 * Replace $element with our editor element.
 * 
 * @param {jQuery} $element
 * @returns {undefined}
 */
ns.Editor.prototype.replace = function ($element) {
  $element.replaceWith(this.$wrapper);
};

/**
 * Return library used.
 */
ns.Editor.prototype.getLibrary = function () {
  if (this.selector !== undefined) {
    return this.selector.$selector.val();
  }
};

/**
 * Return params needed to start library.
 */
ns.Editor.prototype.getParams = function () {
  if (this.selector !== undefined) {
    var params = this.selector.getParams();
    ns.Editor.cleanParams(params);
    return params;
  }
};

/**
 * Clean params.
 *
 * TODO: Reconsider this so that libraries don't have to worry about this tmp stuff.
 *
 * TODO: Also document it better if this stays this way. It is a strange thing to do.
 * Feels like a hack
 *
 * @param {type} params
 * @returns {undefined}
 */
ns.Editor.cleanParams = function (params) {
  for (var name in params) {
    var param = params[name];
    if (param instanceof Object || param instanceof Array) {
      if (param.path !== undefined && param.mime !== undefined) {
        // This can be a file
        if (param.tmp !== undefined) {
          delete param.tmp; // Remove tmp tag from file.
        }
        continue;
      }
      ns.Editor.cleanParams(param);
    }
  }
};