/* global ns */
/**
 * Audio/Video module.
 * Makes it possible to add audio or video through file uploads and urls.
 *
 */
H5PEditor.widgets.video = H5PEditor.widgets.audio = H5PEditor.AV = (function ($) {

  /**
   * Constructor.
   *
   * @param {mixed} parent
   * @param {object} field
   * @param {mixed} params
   * @param {function} setValue
   * @returns {_L3.C}
   */
  function C(parent, field, params, setValue) {
    var self = this;

    // Initialize inheritance
    H5PEditor.FileUploader.call(self, field);

    this.parent = parent;
    this.field = field;
    this.params = params;
    this.setValue = setValue;
    this.changes = [];
    if (params !== undefined && params[0] !== undefined) {
      this.setCopyright(params[0].copyright);
    }

    const isAudio = this.field.type === 'audio';

    this.replaceCallback = () => {};
    this.confirmReplaceDialog = new H5P.ConfirmationDialog({
      headerText: H5PEditor.t('core', isAudio ? 'replaceAudio' : 'replaceVideo'),
      dialogText: H5PEditor.t('core', isAudio ? 'confirmReplaceAudio' : 'confirmReplaceVideo')
    }).appendTo(document.body);

    this.confirmReplaceDialog.on('confirmed', function () {
      self.replaceCallback();
    });

    // Monitor upload progress
    self.on('uploadProgress', function (e) {
      // New upload, i.e. not update existing box.
      if (typeof e.data.updateIndex === 'undefined') {
        self.handleUploadProgress(this.boxEl);
      }
    });

    // Handle upload complete
    self.on('uploadComplete', function (event) {
      const result = event.data;
      const index = event.data?.updateIndex ?? self.updateIndex ?? self.params?.length ?? 0;

      let boxEl = self.boxEl;
      if (index >= 0) {
        const boxesEl = Array.from(self.$files.get(0).querySelectorAll('.h5p-dnd__videobox-wrapper:not(.h5p-dnd__videobox-wrapper--is-provider)'));
        boxEl = boxesEl[index] ?? self.boxEl;
      }

      try {
        if (result.error) {
          throw result.error;
        }

        // Set params if none is set
        if (self.params === undefined) {
          self.params = [];
          self.setValue(self.field, self.params);
        }

        // Add a new file/source
        var file = {
          path: result.data.path,
          mime: result.data.mime,
          copyright: self.copyright
        };
        self.updateIndex = event.data?.updateIndex;

        self.params[index] = file;
        self.addFile(index);

        // Trigger change callbacks (old event system)
        for (var i = 0; i < self.changes.length; i++) {
          self.changes[i](file);
        }

        const errorEls = Array.from(self.$files.get(0).querySelectorAll('.has-error'));
        errorEls.forEach(errorEl => errorEl.classList.remove('has-error'));
      }
      catch (error) {
        self.setErrorMessage(result.error, boxEl);
      }

      if (self.$uploading !== undefined && self.$uploading.length !== 0) {
        // Hide throbber and show add button
        self.$uploading.remove();
        self.$add.show();
      }

      if (boxEl.classList.contains('h5p-dnd__videobox-wrapper')) {
        boxEl = boxEl.querySelector('.h5p-dnd__box');
      }

      self.handleUploadComplete(boxEl);

    });
  }

  C.prototype = Object.create(ns.FileUploader.prototype);
  C.prototype.constructor = C;

  C.prototype.setErrorMessage = function (message, boxEl) {
    const errorEl = boxEl.querySelector('.h5p-errors');

    if (errorEl) {
      errorEl.innerText = message;
    }

    if (boxEl) {
      boxEl.classList.add('has-error');
    }

    this.setAriaLiveErrorMessage(message)
  };
  
  C.prototype.setAriaLiveErrorMessage = function (message) {
    this.ariaLiveEl.innerText = message;
    // Note: Should last long enough for the screen reader to read the text above.
    setTimeout(() => {
      this.ariaLiveEl.innerText = "";
    }, 5000);
  };

  /**
   * Append widget to given wrapper.
   *
   * @param {jQuery} $wrapper
   */
  C.prototype.appendTo = function ($wrapper) {
    var self = this;
    const id = ns.getNextFieldId(this.field);
    const isAudio = this.field.type === 'audio';
    const firstFile =  Array.isArray(this.params) ? this.params[0] : undefined;
    const isProvider = firstFile?.path && C.findProvider(firstFile.path);
    const copyPasteString = `<span class="h5p-dnd-nowrap"><span class="h5p-dnd__badge">${ns.t('core', 'ctrlKey')}<span class="h5p-dnd__badge__separator"></span>${ns.t('core', 'commandKey')}</span> + <span class="h5p-dnd__badge">${ns.t('core', 'pasteKey')}</span></span>`;
    const dragCopyPasteString = ns.t('core', isAudio ? 'dragAndDropAndPasteAudio' : 'dragAndDropAndPasteVideo', { ':keyCombination': copyPasteString });

    let imageHtml = `
      <div class="h5p-dnd__av-container">
        <div class="h5p-dnd__box h5p-dnd__box__url h5p-dnd__box--is-dashed h5p-dnd__box--is-inline h5p-dnd__box__action" tabindex="0">
          <div class="h5p-dnd__box__block"></div>

          <div class="h5p-dnd__column h5p-dnd__column--is-highlighted h5p-dnd__column--is-fixed h5p-dnd__column--hide-when-focus h5p-dnd__column--is-padded h5p-dnd__column--when-wide">
            <div class="h5p-dnd__upload-video-svg"></div>
            <button class="h5p-dnd__btn h5p-dnd__btn__upload" type="button">
              ${isAudio ? H5PEditor.t('core', 'uploadAudio') : H5PEditor.t('core', 'uploadVideo')}
            </button>
          </div>
          
          <div class="h5p-dnd__column h5p-dnd__column--hide-when-focus h5p-dnd__column--when-small">
            <button class="h5p-dnd__btn h5p-dnd__btn__upload" type="button">
              ${isAudio ? H5PEditor.t('core', 'uploadAudio') : H5PEditor.t('core', 'uploadVideo')}
            </button>
          </div>
      
          <div class="h5p-dnd__row h5p-dnd__column--hide-when-focus h5p-dnd__row--when-small">
            <span class="divider"></span> ${H5PEditor.t('core', 'uploadOr')} <span class="divider"></span>
          </div>
          <div class="h5p-dnd__column h5p-dnd__column--hide-when-focus h5p-dnd__column--is-padded-small">
            <div class="text-center">
              ${dragCopyPasteString}
            </div>
            <div class="h5p-errors"></div>
          </div>
      
          <div class="h5p-dnd__column h5p-dnd__column--is-highlighted h5p-dnd__column--show-when-focus h5p-dnd__column--is-full-width">
            ${isAudio ? H5PEditor.t('core', 'dropAudio') : H5PEditor.t('core', 'dropVideo')}
          </div>

          <div class="h5p-dnd__loader h5p-dnd__column h5p-dnd__column--is-full-width" style="display: none;">
            <div class="h5p-loader__wrapper">
              <div class="h5p-loader__icon"></div>
            </div>
          </div>
        </div>
        <div class="h5p-dnd__box__url h5p-dnd__box__video-paste">
          <div class="h5p-dnd__row">
            <div class="input-container">
              <input class="input-video" size="1" type="text" placeholder="${isAudio ? H5PEditor.t('core', 'enterAudioLink') : H5PEditor.t('core', 'enterVideoLink')}" value="${isProvider ? firstFile.path : ''}"/>
              <button class="h5p-dnd__btn h5p-dnd__btn__primary h5p-dnd__btn__insert-url" type="button">${firstFile ? H5PEditor.t('core', 'replaceUrl') : H5PEditor.t('core', 'insertUrl')}</button>
            </div>
          </div>
          ${!isAudio ? `
            <div class="h5p-dnd__row">
              <div class="text-muted">
                ${H5PEditor.t('core', 'supportedVideoFormats')}
              </div>
            </div>
          `: ''}
        </div>
        <div class="h5p-sr-only" aria-live="polite"></div>
      </div>
    `

    if (!this.field.disableCopyright) {
      imageHtml += '<a class="h5p-copyright-button" href="#">' + H5PEditor.t('core', 'editCopyright') + '</a>';
    }

    imageHtml += '<div class="h5p-editor-dialog">' +
      '<a href="#" class="h5p-close" title="' + H5PEditor.t('core', 'close') + '"></a>' +
      '</div>';

    var html = H5PEditor.createFieldMarkup(this.field, imageHtml, id);
    var $container = $(html).appendTo($wrapper);

    this.$files = $container.children('.h5p-dnd__av-container');
    this.$add = $container.children('.h5p-add-file').click(function () {
      self.$addDialog.addClass('h5p-open');
    });

    this.boxEl = this.$files.find('.h5p-dnd__box__url.h5p-dnd__box--is-dashed').get(0);
    this.ariaLiveEl = this.$files.find('.h5p-sr-only[aria-live]').get(0);

    const blockEl = this.boxEl.querySelector('.h5p-dnd__box__block');
    this.addDragAndDropListeners(this.boxEl, blockEl);

    document.addEventListener('paste', (e) => {
      const activeElement = document.activeElement.closest('.h5p-dnd__box');
      if (this.$files.get(0).contains(activeElement) && activeElement && e.clipboardData.files.length > 0) {
        const children = Array.from(activeElement.parentElement.parentElement.querySelectorAll('.h5p-dnd__box--has-video'));
        let index = -1;
        children.forEach((child, i) => {
          if (child === activeElement) {
            index = i;
          }
        })

        this.uploadOrReplaceImage(e.clipboardData.files, index, activeElement);
      }
    });

    this.$addDialog = this.$add.next().children().first();

    // Prepare to add the extra tab instances
    const tabInstances = [null, null]; // Add nulls for hard-coded tabs
    self.tabInstances = tabInstances;

    var $url = this.$url = this.$addDialog.find('.h5p-file-url');
    this.$addDialog.find('.h5p-cancel').click(function () {
      self.updateIndex = undefined;
      self.closeDialog();
    });

    this.$files.find('.h5p-dnd__btn__upload').on('click', (e) => {
      e.preventDefault();
      this.openFileSelector();
    });

    this.$files.find('.h5p-dnd__btn__insert-url').on('click', (e) => {
      const url = this.$files.find('.input-video').val().trim();
      if (url) {
        if (this.params?.length > 0) {
          this.replaceUrl(url);
        } else {
          this.useUrl(url);
        }
        this.updatePasteBox(true);
      }
    });

    this.$files.find('.input-video').on('keydown', (e) => {
      if (e.code === 'Enter') {
        const url = this.$files.find('.input-video').val().trim();
        if (url) {
          if (this.params?.length > 0) {
            this.replaceUrl(url);
          } else {
            this.useUrl(url);
          }
          this.updatePasteBox(true);
        }
      }
    });

    this.$errors = $container.children('.h5p-errors');

    if (this.params !== undefined) {
      for (var i = 0; i < this.params.length; i++) {
        this.addFile(i);
      }
    }
    else {
      $container.find('.h5p-copyright-button').addClass('hidden');
    }

    var $dialog = $container.find('.h5p-editor-dialog');
    $container.find('.h5p-copyright-button').add($dialog.find('.h5p-close')).click(function () {
      $dialog.toggleClass('h5p-open');
      return false;
    });

    ns.File.addCopyright(self, $dialog, function (field, value) {
      self.setCopyright(value);
    });

  };

  /**
   * 
   * @param {number} progress 0-100 the progress of uploading the image
   */
  C.prototype.handleUploadProgress = function (boxEl) {
    const elementsToHide = Array.from(boxEl.querySelectorAll(':scope > div:not(.h5p-dnd__loader)'));
    const loaderEl = boxEl.querySelector('.h5p-dnd__loader');

    boxEl.classList.add('h5p-dnd__box--is-uploading');
    loaderEl.removeAttribute('style');
    elementsToHide.forEach(e => e.style = 'display: none;');
  };

  C.prototype.handleUploadComplete = function (boxEl) {
    const elementsToShow = Array.from(boxEl.querySelectorAll(':scope > div:not(.h5p-dnd__loader)'));
    const loaderEl = boxEl.querySelector('.h5p-dnd__loader');

    boxEl.classList.remove('h5p-dnd__box--is-uploading');
    loaderEl.style = 'display: none;';
    elementsToShow.forEach(e => e.removeAttribute('style'));
  }

  /**
   * Add drag and drop listeners to the appropriate DOM elements.
   */
  C.prototype.addDragAndDropListeners = function (boxEl, blockEl, shouldReplace = false) {
    boxEl.addEventListener('dragenter', (e) => this.handleDragAndDrop(e, boxEl, blockEl, shouldReplace));
    blockEl.addEventListener('dragover', (e) => this.handleDragAndDrop(e, boxEl, blockEl, shouldReplace));
    blockEl.addEventListener('dragend', (e) => this.handleDragAndDrop(e, boxEl, blockEl, shouldReplace));
    blockEl.addEventListener('dragleave', (e) => this.handleDragAndDrop(e, boxEl, blockEl, shouldReplace));
    blockEl.addEventListener('drop', (e) => this.handleDragAndDrop(e, boxEl, blockEl, shouldReplace));
  };

  /**
   * Handle drag and drop events. Will apply the correct css classes (styling)
   * depending on event type and will handle uploading if the user drops the file.
   *
   * @param {Event} e 
   */
  C.prototype.handleDragAndDrop = function (e, boxEl, blockEl, shouldReplace) {
    e.preventDefault();
    e.stopPropagation();

    const boxBlock = boxEl.querySelector('.h5p-dnd__box__block');
    
    if (e.type === 'dragenter') {
      boxEl.classList.add('h5p-dnd__box--is-dragging')
    }
    else if (e.type === 'dragend' || (e.type === 'dragleave' && boxBlock === e.target)) {
      boxEl.classList.remove('h5p-dnd__box--is-dragging');
    }
    else if (e.type === 'drop') {
      boxEl.classList.remove('h5p-dnd__box--is-dragging');
      const index = shouldReplace ? $(boxEl.parentElement).index() : -1;
      this.uploadOrReplaceImage(e.dataTransfer.files, index, boxEl);
    }
  };


  /**
   * Will either upload or replace (and upload) an image.
   * 
   * @param {FileList} files 
   */
  C.prototype.uploadOrReplaceImage = function (files, indexToReplace = -1, boxEl) {
      if (indexToReplace >= 0) {
      // Need to make a copy of the file since Firefox loses the reference to it during the confirm replace dialog.
      const filesBackup = [new File([files[0]], files[0].name, { type: files[0].type })];
      this.replaceCallback = () => {
        this.handleUploadProgress(boxEl);
        this.updateIndex = indexToReplace;
        this.uploadFiles(filesBackup, { updateIndex: indexToReplace });
      };
      this.previousState = C.STATE.HAS_IMAGE;
      this.previousParams = this.params;
      this.confirmReplaceDialog.show(this.$files.offset().top);
    } else {
      this.handleUploadProgress(boxEl);
      this.previousState = C.STATE.NO_IMAGE;
      this.previousParams = null;
      this.uploadFiles(files);
    }
  };

  /**
   * Add file icon with actions.
   *
   * @param {Number} index
   */
  C.prototype.addFile = function (index) {
    var that = this;
    var fileHtml;
    var file = this.params[index];
    var rowInputId = 'h5p-av-' + C.getNextId();
    var defaultQualityName = H5PEditor.t('core', 'videoQualityDefaultLabel', { ':index': index + 1 });
    var qualityName = (file.metadata && file.metadata.qualityName) ? file.metadata.qualityName : defaultQualityName;

    // Check if source is provider (Vimeo, YouTube, Panopto)
    const isProvider = file.path && C.findProvider(file.path);
    const isAudio = this.field.type === 'audio';

    this.$add.toggleClass('hidden', isProvider);

    // If updating remove and recreate element
    if (that.updateIndex !== undefined) {
      var $oldFile = this.$files.children(':eq(' + index + ')');
      $oldFile.remove();
      this.updateIndex = undefined;
    }

    const mimeType = file.mime.split('/')[1];
    const videoText = C.providers.map(p => p.name).includes(mimeType) ? mimeType : `.${mimeType.toUpperCase()}`;

    // Create file with customizable quality if enabled and not youtube
    if (this.field.enableCustomQualityLabel === true && !isProvider) {
      const ariaLabel = `${qualityName}. ${ns.t('core', 'dragAndDropToReplaceVideo')}`
      fileHtml = `
        <div class="h5p-dnd__videobox-wrapper h5p-dnd__videobox-wrapper--has-label">
          <div class="h5p-dnd__box h5p-dnd__box--has-video h5p-dnd__box--is-dashed h5p-dnd__box--is-inline" tabindex="0" aria-label="${ariaLabel}">
            <div class="h5p-dnd__box__block"></div>
            <div class="h5p-dnd__row">
              <div class="h5p-dnd__column h5p-dnd__column--tight">
                <div class="h5p-dnd__video-container">
                  <div class="h5p-dnd__video-overlay">
                    <div class="h5p-dnd__play-icon-svg"></div>
                    ${videoText}
                  </div>
                  <div class="h5p-dnd__video-placeholder"></div>
                </div>
              </div>
              <div class="h5p-dnd__column h5p-dnd__column--tight">
                <div class="h5p-dnd__video-quality">
                  <div class="h5p-dnd__video-quality-title">${H5PEditor.t('core', 'videoQuality')}</div>
                  <label class="h5p-dnd__video-quality-description" for="${rowInputId}">${H5PEditor.t('core', 'videoQualityDescription')}</label>
                  <input id="${rowInputId}" class="h5peditor-text" type="text" maxlength="60" value="${qualityName}">
                </div>
              </div>
            </div>
            
            <div class="h5p-dnd__column h5p-dnd__column--show-when-focus h5p-dnd__column__drag-text">
              <div class="h5p-dnd__text">${isAudio ? H5PEditor.t('core', 'dragAndDropToReplaceAudio') : H5PEditor.t('core', 'dragAndDropToReplaceVideo')}</div>
            </div>

            <div class="h5p-dnd__loader h5p-dnd__column h5p-dnd__column--is-full-width" style="display: none;">
              <div class="h5p-loader__wrapper">
                <div class="h5p-loader__icon"></div>
              </div>
            </div>
          </div>

          <div class="h5p-errors"></div>
          <div class="h5p-editor-image-actions">
            <button class="delete h5p-delete-image-button h5peditor-button-textual" type="button">${ns.t('core', 'deleteLabel')}</button>
          </div>
        </div>
      `;
    }
    else {
      fileHtml = `
        <div class="h5p-dnd__videobox-wrapper ${isProvider ? 'h5p-dnd__videobox-wrapper--is-provider' : ''}">
          <div class="h5p-dnd__box h5p-dnd__box--has-video ${isProvider ? '' : 'h5p-dnd__box--is-dashed'} h5p-dnd__box--is-inline" tabindex="0" role="button">
            <div class="h5p-dnd__box__block"></div>
            <div class="h5p-dnd__column">
              <div class="h5p-dnd__video-container">
                <div class="h5p-dnd__video-overlay">
                  <div class="h5p-dnd__play-icon-svg"></div>
                  ${videoText}
                </div>
                <div class="h5p-dnd__video-placeholder"></div>
              </div>
            </div>
            ${!isProvider ? `
              <div class="h5p-dnd__column h5p-dnd__column--show-when-focus h5p-dnd__column__drag-text">
                <div class="h5p-dnd__text">${isAudio ? H5PEditor.t('core', 'dragAndDropToReplaceAudio') : H5PEditor.t('core', 'dragAndDropToReplaceVideo')}</div>
              </div>
            ` : ''}
            <div class="h5p-dnd__loader h5p-dnd__column h5p-dnd__column--is-full-width" style="display: none;">
              <div class="h5p-loader__wrapper">
                <div class="h5p-loader__icon"></div>
              </div>
            </div>
            
          </div>

          <div class="h5p-errors"></div>
          <div class="h5p-editor-image-actions">
            <button class="delete h5p-delete-image-button h5peditor-button-textual" type="button">${ns.t('core', 'deleteLabel')}</button>
          </div>
        </div>
      `;
    }

    // Insert file element in appropriate order
    var $file = $(fileHtml);
    if (index >= that.$files.children().length) {
      $file.appendTo(that.$files);
    }
    else {
      $file.insertBefore(that.$files.children().eq(index));
    }

    this.$add.parent().find('.h5p-copyright-button').removeClass('hidden');

    const boxEl = $file.find('.h5p-dnd__box').get(0);
    const blockEl = $file.find('.h5p-dnd__box__block').get(0);

    // Handle drag and drop
    this.addDragAndDropListeners(boxEl, blockEl, true);

    // Handle space/enter on frame/box
    boxEl.addEventListener('keydown', (e) => {
      if (!isProvider && e.target?.nodeName !== 'INPUT') {
        if ((e.code === 'Space' || e.code === 'Enter')) {
          this.openFileSelector({
            onChangeCallback: () => {
              this.updateIndex = index;
              this.handleUploadProgress(boxEl);
            },
            context: {
              updateIndex: index
            }
          });
        }
      }
    });

    // Handle delete file
    $file
      .find('.h5p-delete-image-button')
      .on('click', (e) => {
        e.preventDefault();
        confirmRemovalDialog.show($file.offset().top);
      });

    // Handle click on thumbnail
    $file
      .find('.h5p-dnd__video-container')
      .click((e) => {
        if (!isProvider) {
          this.openFileSelector({
            onChangeCallback: () => {
              this.updateIndex = index;
              this.handleUploadProgress(boxEl);
            },
            context: {
              updateIndex: index
            }
          });
        }
      });

    // Handle remove button click
    $file
      .find('.h5p-remove')
      .click(function () {
        if (that.$add.is(':visible')) {
          confirmRemovalDialog.show($file.offset().top);
        }

        return false;
      });

    // on input update
    $file
      .find('input')
      .change(function () {
        file.metadata = { qualityName: $(this).val() };
      });

    // Create remove file dialog
    var confirmRemovalDialog = new H5P.ConfirmationDialog({
      headerText: H5PEditor.t('core', 'removeFile'),
      dialogText: H5PEditor.t('core', 'confirmRemoval', {':type': 'file'})
    }).appendTo(document.body);

    // Remove file on confirmation
    confirmRemovalDialog.on('confirmed', function () {
      that.removeFileWithElement($file);
      if (that.$files.children().length === 0) {
        that.$add.parent().find('.h5p-copyright-button').addClass('hidden');
      }
    });
  };

  /**
   * Remove file at index
   *
   * @param {number} $file File element
   */
  C.prototype.removeFileWithElement = function ($file) {
    var index = $file.index();

    // Remove from params.
    if (this.params.length === 1) {
      delete this.params;
      this.setValue(this.field);
    }
    else {
      this.params.splice(index, 1);
    }

    $file.remove();
    this.$add.removeClass('hidden');

    if (this.params === undefined) {
      this.updatePasteBox(false);
    }

    // Notify change listeners
    for (var i = 0; i < this.changes.length; i++) {
      this.changes[i]();
    }
  };

  C.prototype.updatePasteBox = function (isReplace) {
    const pasteBoxEl = this.$files.get(0).querySelector('.h5p-dnd__box__video-paste');
    const inputEl = pasteBoxEl.querySelector('.input-video');
    const btnEl = pasteBoxEl.querySelector('.h5p-dnd__btn__insert-url');
    
    btnEl.innerText = isReplace ? H5PEditor.t('core', 'replaceUrl') : H5PEditor.t('core', 'insertUrl');
    inputEl.value = isReplace ? inputEl.value : "";
  }

  C.prototype.useUrl = function (url) {
    if (this.params === undefined) {
      this.params = [];
      this.setValue(this.field, this.params);
    }

    var mime;
    var aspectRatio;
    var i;
    var matches = url.match(/\.(webm|mp4|ogv|m4a|mp3|ogg|oga|wav)/i);
    if (matches !== null) {
      mime = matches[matches.length - 1];
    }
    else {
      // Try to find a provider
      const provider = C.findProvider(url);
      if (provider) {
        mime = provider.name;
        aspectRatio = provider.aspectRatio;
      }
    }

    var file = {
      path: url,
      mime: this.field.type + '/' + (mime ? mime : 'unknown'),
      copyright: this.copyright,
      aspectRatio: aspectRatio ? aspectRatio : undefined,
    };
    var index = (this.updateIndex !== undefined ? this.updateIndex : this.params.length);
    this.params[index] = file;
    this.addFile(index);

    for (i = 0; i < this.changes.length; i++) {
      this.changes[i](file);
    }
  };

  C.prototype.replaceUrl = function (url) {
    var mime;
    var aspectRatio;
    var matches = url.match(/\.(webm|mp4|ogv|m4a|mp3|ogg|oga|wav)/i);
    if (matches !== null) {
      mime = matches[matches.length - 1];
    }
    else {
      // Try to find a provider
      const provider = C.findProvider(url);
      if (provider) {
        mime = provider.name;
        aspectRatio = provider.aspectRatio;
      }
    }

    var file = {
      path: url,
      mime: this.field.type + '/' + (mime ? mime : 'unknown'),
      copyright: this.copyright,
      aspectRatio: aspectRatio ? aspectRatio : undefined,
    };

    const mimeType = file.mime.split('/')[1];
    const videoText = C.providers.map(p => p.name).includes(mimeType) ? mimeType : `.${mimeType.toUpperCase()}`;

    this.params[0] = file;

    // Simulating loading to give some feedback to user since this is actually instant.
    const boxEl = this.$files.get(0).querySelector('.h5p-dnd__videobox-wrapper--is-provider .h5p-dnd__box');
    const videoOverlayEl = boxEl.querySelector('.h5p-dnd__video-overlay');
    videoOverlayEl.innerHTML = `
      <div class="h5p-dnd__play-icon-svg"></div>
      ${videoText}
    `;

    this.handleUploadProgress(boxEl);
    setTimeout(() => {
      this.handleUploadComplete(boxEl)
    }, 500);
  }

  /**
   * Validate the field/widget.
   *
   * @returns {Boolean}
   */
  C.prototype.validate = function () {
    return true;
  };

  /**
   * Remove this field/widget.
   */
  C.prototype.remove = function () {
    this.$errors.parent().remove();
  };

  /**
   * Sync copyright between all video files.
   *
   * @returns {undefined}
   */
  C.prototype.setCopyright = function (value) {
    this.copyright = value;
    if (this.params !== undefined) {
      for (var i = 0; i < this.params.length; i++) {
        this.params[i].copyright = value;
      }
    }
  };

  /**
   * Collect functions to execute once the tree is complete.
   *
   * @param {function} ready
   * @returns {undefined}
   */
  C.prototype.ready = function (ready) {
    if (this.passReadies) {
      this.parent.ready(ready);
    }
    else {
      ready();
    }
  };

  /**
   * Close the add media dialog
   */
  C.prototype.closeDialog = function () {
    this.$addDialog.removeClass('h5p-open');

    // Reset URL input
    this.$url.val('');

    // Reset all of the tabs
    for (let i = 0; i < this.tabInstances.length; i++) {
      if (this.tabInstances[i]) {
        this.tabInstances[i].reset();
      }
    }
  };

  /**
   * Providers incase mime type is unknown.
   * @public
   */
  C.providers = [
    {
      name: 'YouTube',
      regexp: /(?:https?:\/\/)?(?:www\.)?(?:(?:youtube.com\/(?:attribution_link\?(?:\S+))?(?:v\/|embed\/|watch\/|(?:user\/(?:\S+)\/)?watch(?:\S+)v\=))|(?:youtu.be\/|y2u.be\/))([A-Za-z0-9_-]{11})/i,
      aspectRatio: '16:9',
    },
    {
      name: 'Panopto',
      regexp: /^[^\/]+:\/\/([^\/]*panopto\.[^\/]+)\/Panopto\/.+\?id=(.+)$/i,
      aspectRatio: '16:9',
    },
    {
      name: 'Vimeo',
      regexp: /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/,
      aspectRatio: '16:9',
    },
    {
        name: 'Echo360',
        regexp: /^[^\/]+:\/\/(echo360[^\/]+)\/media\/([^\/]+)\/h5p.*$/i,
        aspectRatio: '16:9',
    },
  ];

  /**
   * Find & return an external provider based on the URL
   *
   * @param {string} url
   * @returns {Object}
   */
  C.findProvider = function (url) {
    for (i = 0; i < C.providers.length; i++) {
      if (C.providers[i].regexp.test(url)) {
        return C.providers[i];
      }
    }
  };

  // Avoid ID attribute collisions
  let idCounter = 0;

  /**
   * Grab the next available ID to avoid collisions on the page.
   * @public
   */
  C.getNextId = function () {
    return idCounter++;
  };

  C.STATE = {
    NO_IMAGE: 'NO_IMAGE',
    UPLOADING: 'UPLOADING',
    HAS_IMAGE: 'HAS_IMAGE'
  };

  return C;
})(H5P.jQuery);
