var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

/**
 * Construct a form from library semantics.
 */
ns.Form = function () {
  var self = this;
  
  this.params = {};
  this.passReadies = false;
  this.commonFields = {};
  this.$form = ns.$(
    '<div class="h5peditor-form">' +
    ' <div class="tree"></div>' +
    ' <div class="common collapsed hidden">' +
    '   <div class="h5peditor-label">' +
    '     <span class="icon"></span>' + ns.t('core', 'commonFields') +
    '   </div>' +
    '   <div class="fields">' +
    '     <p class="desc">' + ns.t('core', 'commonFieldsDescription') + '</p>' +
    '   </div>' +
    ' </div>' +
    '</div>'
  );
  this.$common = this.$form.find('.common > .fields');
  this.library = '';
  
  this.$common.prev().click(function () {
    self.$common.parent().toggleClass('collapsed');
  });
};

/**
 * Replace the given element with our form.
 *
 * @param {jQuery} $element
 * @returns {undefined}
 */
ns.Form.prototype.replace = function ($element) {
  $element.replaceWith(this.$form);
  this.offset = this.$form.offset();
  // Prevent inputs and selects in an h5peditor form from submitting the main
  // framework form.
  this.$form.on('keydown', 'input,select', function (event) {
    if (event.keyCode === 13) {
      // Prevent enter key from submitting form.
      return false;
    }
  });
};

/**
 * Remove the current form.
 */
ns.Form.prototype.remove = function () {
  this.$form.remove();
};

/**
 * Wrapper for processing the semantics.
 *
 * @param {Array} semantics
 * @param {Object} defaultParams
 * @returns {undefined}
 */
ns.Form.prototype.processSemantics = function (semantics, defaultParams) {
  try {
    this.params = defaultParams;
    ns.processSemanticsChunk(semantics, this.params, this.$form.children('.tree'), this);
  }
  catch (error) {
    if (window['console'] !== undefined && typeof console.error === 'function') {
      console.error(error.stack);
    }

    var $error = ns.$('<div class="h5peditor-error">' + ns.t('core', 'semanticsError', {':error': error}) + '</div>');
    this.$form.replaceWith($error);
    this.$form = $error;
  }
};

/**
 * Creates a header for the given library.
 *
 * @param library
 */
ns.Form.prototype.createHeader = function (library) {
  var that = this;
  var isAdvancedMode = ns.getAdvancedModeCookie();

  (this.$form).prepend(ns.$(
    '<div class="h5peditor-library-header">' +
    ' <div class="h5peditor-library-title">' + library + '</div>' +
    ' <div class="h5peditor-advanced-mode">' +
    '   <span class="h5peditor-advanced-mode-text">Advanced Mode</span>' +
    '   <div class="h5peditor-advanced-mode-checkbox">' +
    '     <div class="h5peditor-advanced-div"></div>' +
    '     <div class="h5peditor-advanced-div"></div>' +
    '   </div>' +
    ' </div>' +
    '</div>'));

  if (isAdvancedMode) {
    ns.$('.h5peditor-advanced-mode-checkbox:first', this.$form.children('.h5peditor-library-header'))
      .children(':first')
      .addClass('h5peditor-advanced-mode-on');
  } else {
    ns.$('.h5peditor-advanced-mode-checkbox:last', this.$form.children('.h5peditor-library-header'))
      .children(':last')
      .addClass('h5peditor-advanced-mode-off');
  }

  ns.$('.h5peditor-advanced-mode-checkbox', this.$form.children('.h5peditor-library-header'))
    .click(function () {
      var advancedModeOn = ns.$(this).children(':first');
      var advancedModeOff = ns.$(this).children(':last');
      var isChecked = false;

      if (advancedModeOn.hasClass('h5peditor-advanced-mode-on')) {
        advancedModeOn.removeClass('h5peditor-advanced-mode-on');
        advancedModeOff.addClass('h5peditor-advanced-mode-off');
      } else {
        advancedModeOn.addClass('h5peditor-advanced-mode-on');
        advancedModeOff.removeClass('h5peditor-advanced-mode-off');
        isChecked = true;
      }

      //Toggle advanced settings on/off
      ns.toggleAdvancedFields(that.$form, isChecked);

      //Set new cookies
      ns.setAdvancedModeCookie(isChecked);

    });

  //Toggle advanced settings
  ns.toggleAdvancedFields(this.$form, isAdvancedMode);
};

/**
 * Collect functions to execute once the tree is complete.
 *
 * @param {function} ready
 * @returns {undefined}
 */
ns.Form.prototype.ready = function (ready) {
  this.readies.push(ready);
};
