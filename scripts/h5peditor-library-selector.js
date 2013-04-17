var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

/**
 * Construct a library selector.
 * 
 * @param {Array} libraries
 * @param {String} defaultLibrary
 * @param {Object} defaultParams
 * @returns {ns.LibrarySelector}
 */
ns.LibrarySelector = function (libraries, defaultLibrary, defaultParams) {
  var that = this;
  var options = '<option value="-">-</option>';
  
  this.defaultParams = defaultParams;
  this.defaultLibrary = defaultLibrary;
  this.defaultLibraryParameterized = defaultLibrary.replace('.', '-').toLowerCase();
  
  for (var i = 0; i < libraries.length; i++) {
    var library = libraries[i];
    var libraryName = ns.libraryToString(library);
    options += '<option value="' + libraryName + '"';
    if (libraryName === defaultLibrary || library.name === this.defaultLibraryParameterized) {
      options += ' selected="selected"';
    }
    options += '>' + library.title + '</option>';
  }
  
  this.$selector = ns.$('<select name="h5peditor-library" title="' + ns.t('selectLibrary') + '">' + options + '</select>').change(function () {
    var library = that.$selector.val();
    that.loadSemantics(library);
  });
};

/**
 * Append the selector html to the given container.
 * 
 * @param {jQuery} $element
 * @returns {undefined}
 */
ns.LibrarySelector.prototype.appendTo = function ($element) {
  this.$selector.appendTo($element);
};

/**
 * Display loading message and load library semantics.
 * 
 * @param {String} library
 * @returns {unresolved}
 */
ns.LibrarySelector.prototype.loadSemantics = function (library) {
  var that = this;

  if (this.form !== undefined) {
    // Remove old form.
    this.form.remove();
  }
  
  if (library === '-') {
    // No library chosen.
    return;
  }

  // Display loading message
  var $loading = $('<div>' + ns.t('loading', {':type': 'semantics'}) + '</div>').insertAfter(this.$selector);
  
  this.$selector.attr('disabled', true);
  
  ns.loadLibrary(library, function (semantics) {
    that.form = new ns.Form();
    that.form.replace($loading);
    
    that.form.processSemantics(semantics, (library === that.defaultLibrary || library === that.defaultLibraryParameterized ? that.defaultParams : {}));

    that.$selector.attr('disabled', false);
    $loading.remove();
  });
};

/**
 * Return params needed to start library.
 */
ns.LibrarySelector.prototype.getParams = function () {
  if (this.form === undefined) {
    return;
  }
  
  // Only return if all fields has validated.
  if (this.children !== undefined) {
    for (var i = 0; i < this.children.length; i++) {
      if (!this.children[i].validate()) {
        return false;
      }
    }
  }
 
  return this.form.params;
};