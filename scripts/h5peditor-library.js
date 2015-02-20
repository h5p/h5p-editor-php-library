var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

/**
 * Create a field where one can select and include another library to the form.
 *
 * @param {mixed} parent
 * @param {Object} field
 * @param {mixed} params
 * @param {function} setValue
 * @returns {ns.Library}
 */
ns.Library = function (parent, field, params, setValue) {
  var self = this;
  H5P.EventDispatcher.call(this);
  
  if (params === undefined) {
    this.params = {params: {}};
    // If you do a console log here it might show that this.params is
    // something else than what we set it to. One of life's big mysteries...
    setValue(field, this.params);
  } else {
    this.params = params;
  }
  this.field = field;
  this.$myField;
  this.parent = parent;
  this.changes = [];
  this.optionsLoaded = false;
  this.library = parent.library + '/' + field.name;
  this.libraries;

  this.passReadies = true;
  parent.ready(function () {
    self.passReadies = false;
  });
};

ns.Library.prototype = Object.create(H5P.EventDispatcher.prototype);
ns.Library.prototype.constructor = ns.Library;

/**
 * Append the library selector to the form.
 *
 * @param {jQuery} $wrapper
 * @returns {undefined}
 */
ns.Library.prototype.appendTo = function ($wrapper) {
  var that = this;
  var html = '';
  if (this.field.label !== 0) {
    html = '<label class="h5peditor-label">' + (this.field.label === undefined ? this.field.name : this.field.label) + '</label>';
  }

  html = '<div class="field ' + this.field.type + '">' + html + '<select>' + ns.createOption('-', 'Loading...') + '</select>';
  if (this.field.description !== undefined) {
    html += '<div class="h5peditor-field-description">' + this.field.description + '</div>';
  }
  // TODO: Remove errors, it is deprecated
  html += '<div class="errors h5p-errors"></div><div class="libwrap"></div></div>';

  this.$myField = ns.$(html).appendTo($wrapper);
  this.$select = this.$myField.children('select');
  this.$libraryWrapper = this.$myField.children('.libwrap');
  ns.LibraryListCache.getLibraries(that.field.options, that.librariesLoaded, that);
}

/**
 * Handler for when the library list has been loaded
 * 
 * @param {H5P.Event} event
 */
ns.Library.prototype.librariesLoaded = function(libList) {
  this.libraries = libList;
  var self = this;
  var options = ns.createOption('-', '-');
  for (var i = 0; i < self.libraries.length; i++) {
    var library = self.libraries[i];
    if (library.uberName === self.params.library
      || (library.title !== undefined && (library.restricted === undefined || !library.restricted))) {
      options += ns.createOption(library.uberName, library.title, library.uberName === self.params.library);
    }
  }

  self.$select.html(options).change(function () {
    if (self.params.library === undefined || confirm(H5PEditor.t('core', 'confirmChangeLibrary'))) {
      self.loadLibrary(ns.$(this).val());
    }
  });

  if (self.libraries.length === 1) {
    self.$select.hide();
    self.$myField.children('.h5peditor-label').hide();
    self.loadLibrary(self.$select.children(':last').val(), true);
  }

  if (self.runChangeCallback === true) {
    // In case a library has been selected programmatically trigger change events, e.g. a default library.
    self.change();
    self.runChangeCallback = false;
  }
  // Load default library.
  if (this.params.library !== undefined) {
    self.loadLibrary(this.params.library, true);
  }
}

/**
 * Load the selected library.
 *
 * @param {String} libraryName On the form machineName.majorVersion.minorVersion
 * @param {Boolean} preserveParams
 * @returns {unresolved}
 */
ns.Library.prototype.loadLibrary = function (libraryName, preserveParams) {
  var that = this;

  this.removeChildren();

  if (libraryName === '-') {
    delete this.params.library;
    delete this.params.params;
    this.$libraryWrapper.attr('class', 'libwrap');
    return;
  }

  this.$libraryWrapper.html(ns.t('core', 'loading', {':type': 'semantics'})).addClass(libraryName.split(' ')[0].toLowerCase().replace('.', '-') + '-editor');

  ns.loadLibrary(libraryName, function (semantics) {
    that.currentLibrary = libraryName;
    that.params.library = libraryName;

    if (preserveParams === undefined || !preserveParams) {
      // Reset params
      that.params.params = {};
    }

    ns.processSemanticsChunk(semantics, that.params.params, that.$libraryWrapper.html(''), that);

    if (that.libraries !== undefined) {
      that.change();
    }
    else {
      that.runChangeCallback = true;
    }
  });
};

/**
 * Add the given callback or run
 * @param {type} callback
 * @returns {Number|@pro;length@this.changes}
 */
ns.Library.prototype.change = function (callback) {
  if (callback !== undefined) {
    // Add callback
    this.changes.push(callback);
  }
  else {
    // Find library
    var library;
    for (var i = 0; i < this.libraries.length; i++) {
      if (this.libraries[i].uberName === this.currentLibrary) {
        library = this.libraries[i];
        break;
      }
    }

    // Run callbacks
    for (var i = 0; i < this.changes.length; i++) {
      this.changes[i](library);
    }
  }
};

/**
 * Validate this field and its children.
 */
ns.Library.prototype.validate = function () {
  if (this.params.library === undefined) {
    return false;
  }

  var valid = true;

  if (this.children) {
    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i].validate() === false) {
        valid = false;
      }
    }
  }

  return valid;
};

/**
 * Collect functions to execute once the tree is complete.
 *
 * @param {function} ready
 * @returns {undefined}
 */
ns.Library.prototype.ready = function (ready) {
  if (this.passReadies) {
    this.parent.ready(ready);
  }
  else {
    this.readies.push(ready);
  }
};

/**
 * Custom remove children that supports common fields.
 *
 * @returns {unresolved}
 */
ns.Library.prototype.removeChildren = function () {
  if (this.currentLibrary === '-' || this.children === undefined) {
    return;
  }

  var ancestor = ns.findAncestor(this.parent);

  for (var libraryPath in ancestor.commonFields) {
    var library = libraryPath.split('/')[0];

    if (library === this.currentLibrary) {
      var remove = false;

      for (var fieldName in ancestor.commonFields[libraryPath]) {
        var field = ancestor.commonFields[libraryPath][fieldName];
        if (field.parents.length === 1) {
          field.instance.remove();
          remove = true;
        }

        for (var i = 0; i < field.parents.length; i++) {
          if (field.parents[i] === this) {
            field.parents.splice(i, 1);
            field.setValues.splice(i, 1);
          }
        }
      }

      if (remove) {
        delete ancestor.commonFields[libraryPath];
      }
    }
  }
  ns.removeChildren(this.children);
};

/**
 * Allows ancestors and widgets to do stuff with our children.
 *
 * @public
 * @param {Function} task
 */
ns.Library.prototype.forEachChild = function (task) {
  for (var i = 0; i < this.children.length; i++) {
    if (task(this.children[i], i)) {
      return;
    }
  }
};

/**
 * Called when this item is being removed.
 */
ns.Library.prototype.remove = function () {
  this.removeChildren();
  if (this.$select !== undefined) {
    this.$select.parent().remove();
  }
};

// Tell the editor what widget we are.
ns.widgets.library = ns.Library;
