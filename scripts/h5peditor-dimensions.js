var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

/**
 * Adds a dimensions field to the form.
 *
 * TODO: Make it possible to lock width/height ratio.
 *
 * @param {mixed} parent
 * @param {object} field
 * @param {mixed} params
 * @param {function} setValue
 * @returns {ns.Dimensions}
 */
ns.Dimensions = function (parent, field, params, setValue) {
  var that = this;

  this.parent = parent;
  this.field = field;
  this.changes = [];

  // Find image filed to get max size from.
  this.findImageField('max', function (field) {
    if (field instanceof ns.File) {
      if (field.params !== undefined) {
        that.setMax(field.params.width, field.params.height);
      }

      field.changes.push(function (file) {
        // TODO: Callback should be removed when this item is removed.
        that.setMax(file.width, file.height);

      });
    }
  });

  if (typeof params === 'string') {
    params = undefined;

    // Find image filed to get default size from.
    this.findImageField('default', function (field) {
      if (field.params !== undefined) {
        that.setSize(field.params.width, field.params.height);
      }

      field.changes.push(function (file) {
        // TODO: Callback should be removed when this item is removed.
        that.setSize(file.width, file.height);
        // TODO: Figure out if we should keep same ratio when image changes.
        //that.setSize(Math.round(file.width / (width / that.params.width)), Math.round(file.height / (height / that.params.height)));
      });
    });
  }

  this.params = params;
  this.setValue = setValue;
};

/**
 * Set max dimensions.
 *
 * @param {string} width
 * @param {string} height
 * @returns {undefined}
 */
ns.Dimensions.prototype.setMax = function (width, height) {
  this.field.max = {
    width: parseInt(width),
    height: parseInt(height)
  };
};

/**
 * Set current dimensions.
 *
 * @param {string} width
 * @param {string} height
 * @returns {undefined}
 */
ns.Dimensions.prototype.setSize = function (width, height) {
  this.params = {
    width: parseInt(width),
    height: parseInt(height)
  };
  this.setValue(this.field, this.params);

  this.$inputs.filter(':eq(0)').val(width).next().val(height);

  for (var i = 0; i < this.changes.length; i++) {
    this.changes[i](width, height);
  }
};

/**
 * Find the image field for the given property and then run the callback.
 *
 * @param {string} property
 * @param {function} callback
 * @returns {unresolved}
 */
ns.Dimensions.prototype.findImageField = function (property, callback) {
  var that = this;
  var str = 'string';

  if (typeof this.field[property] !== str) {
    return;
  }

  // Find field when tree is ready.
  this.parent.ready(function () {
    if (typeof that.field[property] !== str) {
      if (that.field[property] !== undefined) {
        callback(that.field[property]);
      }
      return; // We've already found this field before.
    }
    var path = that.field[property];

    that.field[property] = ns.findField(that.field[property], that.parent);
    if (!that.field[property]) {
      throw ns.t('unknownFieldPath', {':path': path});
    }
    if (that.field[property].field.type !== 'image') {
      throw ns.t('notImageField', {':path': path});
    }

    callback(that.field[property]);
  });
};

/**
 * Append the field to the given wrapper.
 *
 * @param {jQuery} $wrapper
 * @returns {undefined}
 */
ns.Dimensions.prototype.appendTo = function ($wrapper) {
  var that = this;

  this.$item = ns.$(this.createHtml()).appendTo($wrapper);
  this.$inputs = this.$item.find('input');
  this.$errors = this.$item.children('.errors');

  this.$inputs.change(function () {
    // Validate
    var value = that.validate();

    if (value) {
      // Set param
      that.params = value;
      that.setValue(that.field, value);

      for (var i = 0; i < that.changes.length; i++) {
        that.changes[i](value.width, value.height);
      }
    }
  }).click(function () {
    return false;
  });
};

/**
 * Create HTML for the field.
 */
ns.Dimensions.prototype.createHtml = function () {
  var input = ns.createText(this.params !== undefined ? this.params.width : undefined, 15, 'Width') + ' x ' + ns.createText(this.params !== undefined ? this.params.height : undefined, 15, 'Height');
  var label = ns.createLabel(this.field, input);

  return ns.createItem(this.field.widget, label, this.field.description, this.field.description);
};

/**
 * Validate the current text field.
 */
ns.Dimensions.prototype.validate = function () {
  var that = this;
  var size = {};

  this.$errors.html('');

  this.$inputs.each(function (i) {
    var $input = ns.$(this);
    var value = H5P.trim($input.val());
    var property = i ? 'height' : 'width';

    if ((that.field.optional === undefined || !that.field.optional) && !value.length) {
      that.$errors.append(ns.createError(ns.t('requiredProperty', {':property': property})));
      return false;
    }
    else if (!value.match(new RegExp('^[0-9]+$'))) {
      that.$errors.append(ns.createError(ns.t('onlyNumbers', {':property': property})));
      return false;
    }

    value = parseInt(value);
    if (that.field.max !== undefined && value > that.field.max[property]) {
      that.$errors.append(ns.createError(ns.t('exceedsMax', {':property': property, ':max': that.field.max[property]})));
      return false;
    }

    size[property] = value;
  });

  return ns.checkErrors(this.$errors, this.$inputs, size);
};

/**
 * Remove this item.
 */
ns.Dimensions.prototype.remove = function () {
  this.$item.remove();
};

// Tell the editor what widget we are.
ns.widgets.dimensions = ns.Dimensions;