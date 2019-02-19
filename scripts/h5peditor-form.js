/* global ns */
/**
 * Construct a form from library semantics.
 */
ns.Form = function (library, startLanguages) {
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
          '<div class="h5peditor-language-switcher">' +
            '<span class="language-label">' + ns.t('core', 'language') + ':</span>' +
            '<select>' +
              '<option value="-">' + ns.t('core', 'noLanguagesSupported') + '</option>' +
            '</select>' +
          '</div>' +
          '<div class="h5peditor-language-notice">' +
            '<div class="first"></div>' +
            '<div class="last"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
  this.$common = this.$form.find('.common > .fields');

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

  // Locate the language switcher DOM element
  const $switcher = this.$form.find('.h5peditor-language-switcher select');
  const $notice = this.$form.find('.h5peditor-language-notice');
  const loadedLibs = [];
  const languages = {};
  let selected = 'en'; // TODO: Get from starting library

  /**
   * Create options DOM elements
   *
   * @private
   * @return {string}
   */
  const createOptions = function () {
    let options = '';
    for (let code in languages) {
      let label = ns.supportedLanguages[code] ? ns.supportedLanguages[code] : code.toLocaleUpperCase();
      options += '<option value="' + code + '"' + (code === selected ? ' selected' : '') + '>' + label + '</option>';
    }
    return options;
  };

  /**
   * Figure out if all loaded libraries supports the chosen language code
   *
   * @private
   * @param {string} code
   * @return {boolean}
   */
  const isSupportedByAll = function (code) {
    return (languages[code].length === loadedLibs.length);
  }

  /**
   * Add new languages for content type.
   *
   * @param {string} lib uberName
   * @param {Array} langs
   */
  self.addLanguages = function (lib, langs) {
    // Update language counters
    for (let i = 0; i < langs.length; i++) {
      const code = langs[i];
      if (languages[code] === undefined) {
        languages[code] = [lib];
      }
      else {
        languages[code].push(lib);
      }
    }
    loadedLibs.push(lib);

    // Update
    $switcher.html(createOptions());
  };

  /**
   * Remove languages for content type.
   *
   * @param {string} lib uberName
   * @param {Array} langs
   */
  self.removeLanguages = function (lib, langs) {
    // Update language counters
    for (let i = 0; i < langs.length; i++) {
      const code = langs[i];
      if (languages[code] !== undefined) {
        if (languages[code].length === 1) {
          delete languages[code];
        }
        else {
          languages[code].splice(languages[code].indexOf(lib), 1);
        }
      }
    }
    loadedLibs.splice(loadedLibs.indexOf(lib), 1);

    // Update
    $switcher.html(createOptions());
  };

  // Handle switching language and loading new translations
  $switcher.change(function (e) {
    // Create confirmation dialog
    const confirmDialog = new H5P.ConfirmationDialog({
      headerText: ns.t('core', 'changeLanguage', {':language': ns.supportedLanguages[this.value]}),
      dialogText: ns.t('core', 'thisWillPotentially'),
    }).appendTo(document.body);
    confirmDialog.on('confirmed', function () {
      selected = $switcher.val();

      // Figure out if all libraries were supported
      if (!isSupportedByAll(selected)) {
        // Show a warning message
        $notice.children('.first').html(ns.t('core', 'notAllTextsChanged', {':language': ns.supportedLanguages[selected]}));
        $notice.children('.last').html(ns.t('core', 'ifYouWantTo', {':language': ns.supportedLanguages[selected], ':url': 'https://h5p.org/contributing#translating'}));
        $notice.addClass('show');
      }
      else {
        // Hide a warning message
        $notice.removeClass('show');
      }
    });
    confirmDialog.on('canceled', function () {
      $switcher.val(selected);
    });
    // Show
    confirmDialog.show($switcher.offset().top);
  });

  // Add initial langauges for content type
  self.addLanguages(library, startLanguages);
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
  ns.removeChildren(this.metadataForm.children);
  ns.removeChildren(this.children);
  ns.renderableCommonFields = {}; // Reset all common fields
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

  if (ns.enableMetadata(this.currentLibrary)) {
    this.metadataForm = new ns.MetadataForm(this, this.metadata, this.$form.children('.tree'), true);
  }
  else {
    this.metadataForm = H5PEditor.MetadataForm.createLegacyForm(this.metadata, this.$form.children('.tree'));

    // This fixes CSS overrides done by some old custom editors
    switch (this.currentLibrary.split(' ')[0]) {
      case 'H5P.InteractiveVideo':
      case 'H5P.DragQuestion':
      case 'H5P.ImageHotspotQuestion':
        this.metadataForm.getExtraTitleField().$item.css('padding', '20px 20px 0 20px');
        break;

      case 'H5P.CoursePresentation':
        this.metadataForm.getExtraTitleField().$item.css('padding-bottom', '1em');
        break;
    }
  }

  // Overriding this.params with {} will lead to old content not being editable for now
  this.params = (defaultParams.params ? defaultParams.params : defaultParams);

  // Create real children
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
