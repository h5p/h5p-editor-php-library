/* global ns */
/**
 * Create a text field for the form.
 *
 * @param {mixed} parent
 * @param {Object} field
 * @param {mixed} params
 * @param {function} setValue
 * @returns {ns.Textarea}
 */
ns.Textarea = function (parent, field, params, setValue) {
  this.parent = parent;
  this.field = field;
  this.value = params;
  this.setValue = setValue;
};

/**
 * Append field to wrapper.
 *
 * @param {jQuery} $wrapper
 * @returns {undefined}
 */
ns.Textarea.prototype.appendTo = function ($wrapper) {
  var that = this;

  this.$item = ns.$(this.createHtml()).appendTo($wrapper);
  this.$input = this.$item.find('textarea');
  this.$errors = this.$item.find('.h5p-errors');

  ns.bindImportantDescriptionEvents(this, this.field.name, this.parent);

  this.$input.change(function () {
    // Validate
    var value = that.validate();

    if (value !== false) {
      // Set param
      that.setValue(that.field, ns.htmlspecialchars(value));
    }
  });
};

/**
 * Create HTML for the text field.
 */
ns.Textarea.prototype.createHtml = function () {
  var input = '<textarea cols="30" rows="4"';
  if (this.field.placeholder !== undefined) {
    input += ' placeholder="' + this.field.placeholder + '"';
  }
  input += '>';
  if (this.value !== undefined) {
    input += this.value;
  }
  input += '</textarea>';

  return ns.createFieldMarkup(this.field, ns.createImportantDescription(this.field.important) + input);
};

/**
 * Validate the current text field.
 */
ns.Textarea.prototype.validate = function () {
  var value = H5P.trim(this.$input.val());
  var valid = true;

  // Clear errors before showing new ones
  this.$errors.html('');

  if ((this.field.optional === undefined || !this.field.optional) && !value.length) {
    this.$errors.append(ns.createError(ns.t('core', 'requiredProperty', {':property': ns.t('core', 'textField')})));
    valid = false;
  }
  else if (value.length > this.field.maxLength) {
    this.$errors.append(ns.createError(ns.t('core', 'tooLong', {':max': this.field.maxLength})));
    valid = false;
  }
  else if (this.field.regexp !== undefined && !value.match(new RegExp(this.field.regexp.pattern, this.field.regexp.modifiers))) {
    this.$errors.append(ns.createError(ns.t('core', 'invalidFormat')));
    valid = false;
  }

  this.$input.toggleClass('error', !valid);

  return ns.checkErrors(this.$errors, this.$input, value);
};

/**
 * Remove this item.
 */
ns.Textarea.prototype.remove = function () {
  this.$item.remove();
};

/**
 * When someone from the outside wants to set a value.
 *
 * @param {string} value
 */
ns.Textarea.prototype.forceValue = function (value) {
  this.$input.val(value).change();
};

/**
 * Common function to get the input object
 */
ns.Textarea.prototype.getInput = function () {
  return this.$input;
};

// Tell the editor what semantic field we are.
ns.widgets.textarea = ns.Textarea;
