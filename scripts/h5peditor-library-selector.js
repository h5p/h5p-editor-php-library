/* global ns */
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

  this.libraries = libraries;

  H5P.EventDispatcher.call(this);

  try {
    this.defaultParams = JSON.parse(defaultParams);
    if (!(this.defaultParams instanceof Object)) {
      throw true;
    }
  }
  catch (event) {
    // Content parameters are broken. Reset. (This allows for broken content to be reused without deleting it)
    this.defaultParams = {};
  }

  this.defaultLibrary = this.currentLibrary = defaultLibrary;
  this.defaultLibraryParameterized = defaultLibrary ? defaultLibrary.replace('.', '-').toLowerCase() : undefined;

  // Create confirm dialog
  var changeLibraryDialog = new H5P.ConfirmationDialog({
    headerText: H5PEditor.t('core', 'changeLibrary'),
    dialogText: H5PEditor.t('core', 'confirmChangeLibrary')
  }).appendTo(document.body);

  if (H5PIntegration.hubIsEnabled) {
    this.selector = new ns.SelectorHub(libraries, defaultLibrary, changeLibraryDialog);
  }
  else {
    this.selector = new ns.SelectorLegacy(libraries, defaultLibrary, changeLibraryDialog);
  }

  this.$selector = ns.$(this.selector.getElement());

  /**
   * @private
   * @param {object} library
   */
  const librarySelectHandler = (library) => {
    this.currentLibrary = library.uberName;
    this.loadSemantics(library.uberName, this.selector.getParams(), this.selector.getMetadata());

    if (library.tutorialUrl) {
      this.helpMenu.querySelector('.h5p-tutorial-url').setAttribute('href', library.tutorialUrl);
    }
    else {
      this.helpMenu.querySelector('.h5p-tutorial-item').remove();
    }

    if (library.exampleUrl) {
      this.helpMenu.querySelector('.h5p-example-url').setAttribute('href', library.exampleUrl);
    }
    else {
      this.helpMenu.querySelector('.h5p-example-item').remove();
    }

    if (!library.tutorialUrl && !library.exampleUrl) {
      this.helpContainer.remove();
    }
    else {
      ns.attachMenuBehavior(this.helpButton, this.helpMenu);
    }
  };

  /**
   * Event handler for loading a new library editor
   * @private
   */
  const loadLibrary = function () {
    that.trigger('editorload', that.selector.currentLibrary);
    that.selector.getSelectedLibrary(librarySelectHandler);
  };

  /**
   * Confirm replace if there is content selected
   *
   * @param {number} top Offset
   * @param {function} next Next callback
   */
  this.confirmPasteError = function (message, top, next) {
    // Confirm changing library
    var confirmReplace = new H5P.ConfirmationDialog({
      headerText: H5PEditor.t('core', 'pasteError'),
      dialogText: message,
      cancelText: ' ',
      confirmText: H5PEditor.t('core', 'ok')
    }).appendTo(document.body);
    confirmReplace.on('confirmed', next);
    confirmReplace.show(top);
  };

  // Change library on confirmation
  changeLibraryDialog.on('confirmed', loadLibrary);

  // Revert selector on cancel
  changeLibraryDialog.on('canceled', function () {
    that.selector.resetSelection(that.currentLibrary, that.defaultParams, that.form.metadata, true);
  });

  // First time a library is selected in the editor
  this.selector.on('selected', loadLibrary);

  this.selector.on('resize', function () {
    that.trigger('resize');
  });

  this.on('select', loadLibrary);
  H5P.externalDispatcher.on('datainclipboard', this.updateCopyPasteButtons.bind(this));
  this.selector.on('paste', this.pasteContent.bind(this));
};

// Extends the event dispatcher
ns.LibrarySelector.prototype = Object.create(H5P.EventDispatcher.prototype);
ns.LibrarySelector.prototype.constructor = ns.LibrarySelector;

/**
 * Sets the current library
 *
 * @param {string} library
 */
ns.LibrarySelector.prototype.setLibrary = function (library) {
  this.trigger('select');
};

/**
 * Append the selector html to the given container.
 *
 * @param {jQuery} $element
 * @returns {undefined}
 */
ns.LibrarySelector.prototype.appendTo = function ($element) {
  this.$parent = $element;
  this.$selector.appendTo($element);
  const wrapper = document.createElement('div');
  wrapper.className = 'h5peditor-help-copypaste-wrap';
  wrapper.hidden = true;
  $element[0].append(wrapper);
  wrapper.insertAdjacentHTML('beforeend', ns.createHelpMenuButton());
  this.helpContainer = wrapper.querySelector('.h5peditor-help');
  this.helpButton = this.helpContainer.querySelector('.h5peditor-help-button');
  this.helpMenu = this.helpContainer.querySelector('.h5peditor-help-menu');

  if (window.localStorage) {
    wrapper.insertAdjacentHTML('beforeend', ns.createCopyPasteButtons());
    this.copyButton = wrapper.querySelector('.h5peditor-copy-button');
    this.pasteButton = wrapper.querySelector('.h5peditor-paste-button');

    this.copyButton.addEventListener('click', () => {
      H5P.clipboardify({
        library: this.getCurrentLibrary(),
        params: this.getParams(),
        metadata: this.getMetadata(),
      });

      ns.attachToastTo(
        this.copyButton,
        H5PEditor.t('core', 'copiedToClipboard'),
        {
          position: {
            horizontal: 'center',
            vertical: 'above',
            noOverflowX: true,
          },
        },
      );
    });

    this.pasteButton.addEventListener(
      'click',
      this.pasteContent.bind(this),
    );

    this.updateCopyPasteButtons();
  }
  this.on('editorloaded', () => {
    wrapper.hidden = false;
  });
};

/**
 * Update state of copy and paste buttons dependent on what is currently in
 * the clipboard
 */
ns.LibrarySelector.prototype.updateCopyPasteButtons = function () {
  if (!window.localStorage) {
    return;
  }

  // Check if content type is supported here
  const pasteCheck = ns.canPastePlus(H5P.getClipboard(), this.libraries);
  const canPaste = pasteCheck.canPaste;

  this.copyButton.disabled = false;
  this.copyButton.classList.remove('disabled');

  this.pasteButton.textContent = ns.t('core', 'pasteAndReplaceButton');
  this.pasteButton.title = canPaste ? ns.t('core', 'pasteAndReplaceFromClipboard') : pasteCheck.description;
  this.pasteButton.classList.toggle('disabled', !canPaste);
  this.pasteButton.disabled = !canPaste;

  this.selector.setCanPaste && this.selector.setCanPaste(canPaste, !canPaste ? pasteCheck.description : undefined);
};

/**
 * Sets the current library
 *
 * @param {string} library
 */
ns.LibrarySelector.prototype.pasteContent = function () {
  const clipboard = H5P.getClipboard();

  ns.confirmReplace(this.getCurrentLibrary(), this.$parent.offset().top, () => {
    this.selector.resetSelection(clipboard.generic.library, clipboard.generic.params, clipboard.generic.metadata, false);
    this.setLibrary();
  });
};

/**
 * Display loading message and load library semantics.
 *
 * @param {String} library
 * @param {Object} params Pass in params to semantics
 * @returns {unresolved}
 */
ns.LibrarySelector.prototype.loadSemantics = function (library, params, metadata) {
  var that = this;

  if (this.form !== undefined) {
    // Remove old form.
    this.form.remove();
  }

  if (library === '-') {
    // No library chosen.
    this.$parent.attr('class', 'h5peditor');
    return;
  }
  this.$parent.attr('class', 'h5peditor ' + library.split(' ')[0].toLowerCase().replace('.', '-') + '-editor');

  // Display loading message
  var $loading = ns.$('<div class="h5peditor-loading h5p-throbber">' + ns.t('core', 'loading') + '</div>').appendTo(this.$parent);

  this.$selector.attr('disabled', true);

  ns.resetLoadedLibraries();
  ns.loadLibrary(library, function (semantics) {
    if (!semantics) {
      that.form = ns.$('<div/>', {
        'class': 'h5p-errors',
        text: H5PEditor.t('core', 'noSemantics'),
        insertAfter: $loading
      });
    }
    else {
      var overrideParams = {};
      if (params) {
        overrideParams = params;
        that.defaultParams = overrideParams;
      }
      else if (library === that.defaultLibrary || library === that.defaultLibraryParameterized) {
        overrideParams = that.defaultParams;
      }

      if (!metadata) {
        metadata = overrideParams.metadata;
      }
      const defaultLanguage = metadata && metadata.defaultLanguage
        ? metadata.defaultLanguage
        : null;
      that.form = new ns.Form(
        library,
        ns.libraryCache[library].languages,
        defaultLanguage
      );
      that.form.replace($loading);
      that.form.currentLibrary = library;
      that.form.processSemantics(semantics, overrideParams, metadata);
      that.updateCopyPasteButtons();
    }

    that.$selector.attr('disabled', false);
    $loading.remove();
    that.trigger('editorloaded', library);
  });
};

/**
 * Returns currently selected library
 *
 * @returns {string} Currently selected library
 */
ns.LibrarySelector.prototype.getCurrentLibrary = function () {
  return this.currentLibrary;
};

/**
 * Return params needed to start library.
 */
ns.LibrarySelector.prototype.getParams = function () {
  if (this.form === undefined) {
    return;
  }

  // Only return if all fields has validated.
  //var valid = true;

  if (this.form.metadataForm.children !== undefined) {
    for (var i = 0; i < this.form.metadataForm.children.length; i++) {
      if (this.form.metadataForm.children[i].validate() === false) {
        //valid = false;
      }
    }
  }

  if (this.form.children !== undefined) {
    for (var i = 0; i < this.form.children.length; i++) {
      if (this.form.children[i].validate() === false) {
        //valid = false;
      }
    }
  }

  //return valid ? this.form.params : false;
  return this.form.params; // TODO: Switch to the line above when we are able to tell the user where the validation fails
};

/**
 * Get the metadata of the main form.
 *
 * @return {object} Metadata object.
 */
ns.LibrarySelector.prototype.getMetadata = function () {
  if (this.form === undefined) {
    return;
  }

  return this.form.metadata;
};

/**
 *
 * @param content
 * @param library
 * @returns {H5PEditor.Presave} Result after processing library and content
 */
ns.LibrarySelector.prototype.presave = function (content, library) {
  return (new ns.Presave).process(library, content);
};
