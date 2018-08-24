/**
 * Construct a form from library semantics.
 */
ns.Form = function () {
  var self = this;

  this.params = {};
  this.passReadies = false;
  this.commonFields = {};

  this.$form = ns.$('' +
    '<div class="h5peditor-form">' +
      '<div class="tree"></div>' +
      '<div class="common collapsed hidden">' +
        '<div class="fields">' +
          '<p class="desc">' +
            ns.t('core', 'commonFieldsDescription') +
          '</p>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
  this.$common = this.$form.find('.common > .fields');
  this.library = Object.keys(ns.libraryLoaded)[0];

  this.entitledForMetadata = ns.entitledForMetadata(this.library);
  // Add overlay
  this.$form.append('<div class="overlay"></div>');

  // Inject a custom text field for the metadata title
  var metaDataTitleSemantics = [{
    'name' : 'title',
    'type' : 'text',
    'label' : ns.t('core', 'title'),
    'description': ns.t('core', 'usedForSearchingReportsAndCopyrightInformation'),
    'optional': false
  }];

  // Ensure it has validation functions
  ns.processSemanticsChunk(metaDataTitleSemantics, {}, this.$form.children('.tree'), this)

  // Give title field an ID
  this.$form.find('.field-name-title').attr('id', 'metadata-title-main-label');
  this.$form.find('.h5peditor-text').attr('id', 'metadata-title-main');

  // Add the metadata button
  const metadataButton = ns.$('' +
    '<div class="h5p-metadata-button-wrapper">' +
      '<div class="h5p-metadata-button-tip"></div>' +
      '<div class="toggle-metadata">' + ns.t('core', 'metadata') + '</div>' +
    '</div>');

  /*
   * Temporarily needed for old content where wrapper will not be created by
   * the editor. Can be removed as soon as the new content types are considered
   * to be the default.
   */
  if (!this.entitledForMetadata) {
    const $wrapper = ns.$('<div/>', {'class': 'h5p-editor-flex-wrapper'});
    this.$form.find('label.h5peditor-label-wrapper').wrap($wrapper);
     // This fixes CSS overrides done by some old custom editors, but should not be in core
    switch (this.library.split(' ')[0]) {
      case 'H5P.InteractiveVideo':
        this.$form.find('#metadata-title-main-label').first().css('padding', '20px 20px 0 20px');
        break;
      case 'H5P.DragQuestion':
        this.$form.find('#metadata-title-main-label').first().css('padding', '20px 20px 0 20px');
        break;
      case 'H5P.CoursePresentation':
        this.$form.find('#metadata-title-main-label').first().css('margin-bottom', '0');
        break;
    }
  }
  else {
    this.$form.find('.h5p-editor-flex-wrapper').append(metadataButton);
    this.$form.find('.toggle-metadata').click(function () {
      self.$form.find('.h5p-metadata-wrapper').first().toggleClass('h5p-open');
      self.$form.find('.overlay').toggle();
    });
  }

  // Add title expand/collapse button
  ns.$('<div/>', {
    'class': 'h5peditor-label',
    title: ns.t('core', 'expandCollapse'),
    role: 'button',
    tabIndex: 0,
    html: '<span class="icon"></span>' + ns.t('core', 'commonFields'),
    on: {
      click: function () {
        self.$common.parent().toggleClass('collapsed');
      },
      keypress: function (event) {
        if ((event.charCode || event.keyCode) === 32) {
          self.$common.parent().toggleClass('collapsed');
          event.preventDefault();
        }
      }
    },
    prependTo: this.$common.parent()
  });

  // Alternate background colors
  this.zebra = "odd";
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
  ns.removeChildren(this.children);
  this.$form.remove();
};

/**
 * Wrapper for processing the semantics.
 *
 * @param {Array} semantics
 * @param {Object} defaultParams
 * @returns {undefined}
 */
ns.Form.prototype.processSemantics = function (semantics, defaultParams, metadata) {
  this.metadata = (metadata ? metadata : defaultParams.metadata || {});

  const $metadataForm = ns.metadataForm(semantics, this.metadata, this.$form.children('.tree'), this);

  // Sync title fields of this editor form and a metadata form
  ns.sync(
    this.$form.find('#metadata-title-main'),
    $metadataForm.find('.field-name-title').find('input')
  );

  // Set the title
  const title = (this.metadata && this.metadata.title) ? this.metadata.title : '';
  this.$form.find('input#metadata-title-main').val(title);

  // Overriding this.params with {} will lead to old content not being editable for now
  this.params = (defaultParams.params ? defaultParams.params : defaultParams);
  ns.processSemanticsChunk(semantics, this.params, this.$form.children('.tree'), this);
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
