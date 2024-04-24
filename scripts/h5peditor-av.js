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

    this.replaceCallback = () => {};
    this.confirmReplaceDialog = new H5P.ConfirmationDialog({
      headerText: H5PEditor.t('core', 'replaceImage'),
      dialogText: H5PEditor.t('core', 'confirmReplaceImage')
    }).appendTo(document.body);

    this.confirmReplaceDialog.on('confirmed', function () {
      self.replaceCallback();
    });

    // When uploading starts
    self.on('upload', function () {
      // // Insert throbber
      // self.$uploading = $('<div class="h5peditor-uploading h5p-throbber">' + H5PEditor.t('core', 'uploading') + '</div>').insertAfter(self.$add.hide());

      // // Clear old error messages
      // self.$errors.html('');

      // // Close dialog
      // self.closeDialog();
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
      setTimeout(() => {
        var result = event.data;
        let isUpdate = typeof event.data?.updateIndex !== 'undefined';

        // Clear out add dialog
        this.$addDialog.find('.h5p-file-url').val('');
  
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

          const index = event.data?.updateIndex ?? self.updateIndex ?? self.params.length;

          self.params[index] = file;
          self.addFile(index);
  
          // Trigger change callbacks (old event system)
          for (var i = 0; i < self.changes.length; i++) {
            self.changes[i](file);
          }
        }
        catch (error) {
          // Display errors
          self.$errors.append(H5PEditor.createError(error));QQ
        }
  
        if (self.$uploading !== undefined && self.$uploading.length !== 0) {
          // Hide throbber and show add button
          self.$uploading.remove();
          self.$add.show();
        }

        if (!isUpdate) {
          self.handleUploadComplete(self.boxEl);
        }
      }, 3000)
    });
  }

  C.prototype = Object.create(ns.FileUploader.prototype);
  C.prototype.constructor = C;

  /**
   * Append widget to given wrapper.
   *
   * @param {jQuery} $wrapper
   */
  C.prototype.appendTo = function ($wrapper) {
    var self = this;
    const id = ns.getNextFieldId(this.field);

    let imageHtml = `
      <div class="h5p-dnd__av-container">
        <div class="h5p-dnd__box h5p-dnd__box__url h5p-dnd__box--is-dashed h5p-dnd__box--is-inline" tabindex="0">
          <div class="h5p-dnd__box__block"></div>
          <div class="h5p-dnd__column h5p-dnd__column--hide-when-focus">
            <div class="h5p-dnd__upload-video-svg">
              ${C.getUploadSVG()}
            </div>
            <button class="h5p-dnd__btn h5p-dnd__btn__upload" type="button">Upload video</button>
          </div>
      
          <div class="h5p-dnd__row h5p-dnd__column--hide-when-focus">
            <span class="divider"></span> or <span class="divider"></span>
          </div>
          <div class="h5p-dnd__row h5p-dnd__column--hide-when-focus">
            <div class="text-center">
              Drag and drop video file here to upload or paste by <span class="h5p-dnd__badge">ctrl&nbsp;(⌘)</span>&nbsp;+&nbsp;<span class="h5p-dnd__badge">v</span>
            </div>
            <div class="h5p-errors"></div>
          </div>
      
          <div class="h5p-dnd__column h5p-dnd__column--is-highlighted h5p-dnd__column--show-when-focus h5p-dnd__column--is-full-width">
            Drop video file here to upload
          </div>

          <div class="h5p-dnd__loader h5p-dnd__column h5p-dnd__column--is-full-width" style="display: none;">
            <div class="h5p-loader__wrapper">
              <div class="h5p-loader__icon"></div>
            </div>
          </div>
        </div>
        <div class="h5p-dnd__box__url h5p-dnd__box__video-paste">
          <div class="h5p-dnd__row">
            <div class="h5p-dnd__box__title">
              Paste Youtube link or other video source
            </div>
          </div>
          <div class="h5p-dnd__row">
            <div class="input-container">
              <input class="input-video" type="text" placeholder="Enter a video link" />
              <button class="h5p-dnd__btn h5p-dnd__btn__primary h5p-dnd__btn__insert-url" type="button">Insert url</button>
            </div>
          </div>
          <div class="h5p-dnd__row">
            <div class="text-muted">
              H5P supports all external video sources formatted as <span class="h5p-bold">mp4</span>, <span class="h5p-bold">webm</span> or <span class="h5p-bold">ogv</span>, like Vimeo Pro, and has support for YouTube and Panopto links.
            </div>
          </div>
        </div>
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
    const blockEl = this.boxEl.querySelector('.h5p-dnd__box__block');
    this.addDragAndDropListeners(this.boxEl, blockEl);
    // Tabs that are hard-coded into this widget. Any other tab must be an extension.
    const TABS = {
      UPLOAD: 0,
      INPUT: 1
    };

    // The current active tab
    let activeTab = TABS.UPLOAD;

    /**
     * @param {number} tab
     * @return {boolean}
     */
    const isExtension = function (tab) {
      return tab > TABS.INPUT; // Always last tab
    };

    /**
     * Toggle the currently active tab.
     */
    const toggleTab = function () {
      // Pause the last active tab
      if (isExtension(activeTab)) {
        tabInstances[activeTab].pause();
      }

      // Update tab
      this.parentElement.querySelector('.selected').classList.remove('selected');
      this.classList.add('selected');

      // Update tab panel
      const el = document.getElementById(this.getAttribute('aria-controls'));
      el.parentElement.querySelector('.av-tabpanel:not([hidden])').setAttribute('hidden', '');
      el.removeAttribute('hidden');

      // Set active tab index
      for (let i = 0; i < el.parentElement.children.length; i++) {
        if (el.parentElement.children[i] === el) {
          activeTab = i - 1; // Compensate for .av-tablist in the same wrapper
          break;
        }
      }

      // Toggle insert button disabled
      if (activeTab === TABS.UPLOAD) {
        self.$insertButton[0].disabled = true;
      }
      else if (activeTab === TABS.INPUT) {
        self.$insertButton[0].disabled = false;
      }
      else {
        self.$insertButton[0].disabled = !tabInstances[activeTab].hasMedia();
      }
    }

    /**
     * Switch focus between the buttons in the tablist
     */
    const moveFocus = function (el) {
      if (el) {
        this.setAttribute('tabindex', '-1');
        el.setAttribute('tabindex', '0');
        el.focus();
      }
    }

    // Register event listeners to tab DOM elements
    $container.find('.av-tab').click(toggleTab).keydown(function (e) {
      if (e.which === 13 || e.which === 32) { // Enter or Space
        toggleTab.call(this, e);
        e.preventDefault();
      }
      else if (e.which === 37 || e.which === 38) { // Left or Up
        moveFocus.call(this, this.previousSibling);
        e.preventDefault();
      }
      else if (e.which === 39 || e.which === 40) { // Right or Down
        moveFocus.call(this, this.nextSibling);
        e.preventDefault();
      }
    });

    this.$addDialog = this.$add.next().children().first();

    // Prepare to add the extra tab instances
    const tabInstances = [null, null]; // Add nulls for hard-coded tabs
    self.tabInstances = tabInstances;

    if (self.field.widgetExtensions) {

      /**
       * @param {string} type Constructor name scoped inside this widget
       * @param {number} index
       */
      const createTabInstance = function (type, index) {
        const tabInstance = new H5PEditor.AV[type]();
        tabInstance.appendTo(self.$addDialog[0].children[0].children[index + 1]); // Compensate for .av-tablist in the same wrapper
        tabInstance.on('hasMedia', function (e) {
          if (index === activeTab) {
            self.$insertButton[0].disabled = !e.data;
          }
        });
        tabInstances.push(tabInstance);
      }

      // Append extra tabs
      for (let i = 0; i < self.field.widgetExtensions.length; i++) {
        if (H5PEditor.AV[self.field.widgetExtensions[i]]) {
          createTabInstance(self.field.widgetExtensions[i], i + 2); // Compensate for the number of hard-coded tabs
        }
      }
    }

    var $url = this.$url = this.$addDialog.find('.h5p-file-url');
    this.$addDialog.find('.h5p-cancel').click(function () {
      self.updateIndex = undefined;
      self.closeDialog();
    });

    // this.$addDialog.find('.h5p-file-drop-upload')
    //   .addClass('has-advanced-upload')
    //   .on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //   })
    //   .on('dragover dragenter', function (e) {
    //     $(this).addClass('over');
    //     e.originalEvent.dataTransfer.dropEffect = 'copy';
    //   })
    //   .on('dragleave', function () {
    //     $(this).removeClass('over');
    //   })
    //   .on('drop', function (e) {
    //     self.uploadFiles(e.originalEvent.dataTransfer.files);
    //   })
    //   .click(function () {
    //     self.openFileSelector();
    //   });
    this.$files.find('.h5p-dnd__btn__upload').on('click', (e) => {
      e.preventDefault();
      this.openFileSelector();
    });

    this.$files.find('.h5p-dnd__btn__insert-url').on('click', (e) => {
      const url = this.$files.find('.input-video').val().trim();
      if (url) {
        this.useUrl(url);
      }
    });

    this.$files.find('.input-video').on('keydown', (e) => {
      if (e.code === 'Enter') {
        const url = this.$files.find('.input-video').val().trim();
        if (url) {
          this.useUrl(url);
        }
      }
    });

    this.$insertButton = this.$addDialog.find('.h5p-insert').click(function () {
      if (isExtension(activeTab)) {
        const media = tabInstances[activeTab].getMedia();
        if (media) {
          self.upload(media.data, media.name);
        }
      }
      else {
        const url = $url.val().trim();
        if (url) {
          self.useUrl(url);
        }
      }

      self.closeDialog();
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
    // const boundedHandleDnD = this.handleDragAndDrop.bind(this, ...arguments, boxEl, blockEl);

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
        // this.removeImage();
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

    this.$add.toggleClass('hidden', isProvider);

    // If updating remove and recreate element
    if (that.updateIndex !== undefined) {
      var $oldFile = this.$files.children(':eq(' + index + ')');
      $oldFile.remove();
      this.updateIndex = undefined;
    }

    // Create file with customizable quality if enabled and not youtube
    if (this.field.enableCustomQualityLabel === true && !isProvider) {
      fileHtml = `
        <div style="min-width: 400px; flex: 1;" class="h5p-dnd__videobox-wrapper ${isProvider ? 'h5p-dnd__videobox-wrapper--is-provider' : ''}">
          <div class="h5p-dnd__box h5p-dnd__box--has-video ${isProvider ? '' : 'h5p-dnd__box--is-dashed'} h5p-dnd__box--is-inline" tabindex="0">
            <div class="h5p-dnd__box__block"></div>
            <div class="h5p-dnd__row">
              <div class="h5p-dnd__column" style="max-height: 130px; margin-right: 0;">
                <div class="h5p-dnd__video-container">
                  <div class="h5p-dnd__video-overlay">
                    ${file.mime.split('/')[1]}
                  </div>
                  <div class="h5p-dnd__video-placeholder"></div>
                </div>
              </div>
              <div class="h5p-dnd__column" style="max-height: 130px">
                <div class="h5p-dnd__video-quality">
                  <div class="h5p-dnd__video-quality-title">${H5PEditor.t('core', 'videoQuality')}</div>
                  <label class="h5p-dnd__video-quality-description" for="${rowInputId}">${H5PEditor.t('core', 'videoQualityDescription')}</label>
                  <input id="${rowInputId}" class="h5peditor-text" type="text" maxlength="60" value="${qualityName}">
                </div>
              </div>
            </div>
            
            <div class="h5p-dnd__column h5p-dnd__column--show-when-focus">
              <div class="h5p-dnd__text">
                Drag and drop video file here to replace  
              </div>
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
          <div class="h5p-dnd__box h5p-dnd__box--has-video ${isProvider ? '' : 'h5p-dnd__box--is-dashed'} h5p-dnd__box--is-inline" tabindex="0">
            <div class="h5p-dnd__box__block"></div>
            <div class="h5p-dnd__column">
              <div class="h5p-dnd__video-container">
                <div class="h5p-dnd__video-overlay">
                  ${file.mime.split('/')[1]}
                </div>
                <div class="h5p-dnd__video-placeholder"></div>
              </div>
            </div>
            ${!isProvider ? `
              <div class="h5p-dnd__column h5p-dnd__column--show-when-focus">
                <div class="h5p-dnd__text">
                  Drag and drop video file here to replace  
                </div>
              </div>
              <div class="h5p-dnd__loader h5p-dnd__column h5p-dnd__column--is-full-width" style="display: none;">
                <div class="h5p-loader__wrapper">
                  <div class="h5p-loader__icon"></div>
                </div>
              </div>
            ` : ''}
            
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
      if (!isProvider) {
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

    // Notify change listeners
    for (var i = 0; i < this.changes.length; i++) {
      this.changes[i]();
    }
  };

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
   * Create the HTML for the dialog itself.
   *
   * @param {string} content HTML
   * @param {boolean} disableInsert
   * @param {string} id
   * @param {boolean} hasDescription
   * @returns {string} HTML
   */
  C.createInsertDialog = function (content, disableInsert, id, hasDescription) {
    return '<div role="button" tabindex="0" id="' + id + '"' + (hasDescription ? ' aria-describedby="' + ns.getDescriptionId(id) + '"' : '') + ' class="h5p-add-file" title="' + H5PEditor.t('core', 'addFile') + '"></div>' +
      '<div class="h5p-dialog-anchor"><div class="h5p-add-dialog">' +
        '<div class="h5p-add-dialog-table">' + content + '</div>' +
        '<div class="h5p-buttons">' +
          '<button class="h5peditor-button-textual h5p-insert"' + (disableInsert ? ' disabled' : '') + '>' + H5PEditor.t('core', 'insert') + '</button>' +
          '<button class="h5peditor-button-textual h5p-cancel">' + H5PEditor.t('core', 'cancel') + '</button>' +
        '</div>' +
      '</div></div>';
  };

  /**
   * Creates the HTML needed for the given tab.
   *
   * @param {string} tab Tab Identifier
   * @param {string} type 'video' or 'audio'
   * @returns {string} HTML
   */
  C.createTabContent = function (tab, type) {
    const isAudio = (type === 'audio');

    switch (tab) {
      case 'BasicFileUpload':
        const id = 'av-upload-' + C.getNextId();
        return '<h3 id="' + id + '">' + H5PEditor.t('core', isAudio ? 'uploadAudioTitle' : 'uploadVideoTitle') + '</h3>' +
          '<div class="h5p-file-drop-upload" tabindex="0" role="button" aria-labelledby="' + id + '">' +
            '<div class="h5p-file-drop-upload-inner ' + type + '"></div>' +
          '</div>';

      case 'InputLinkURL':
        return '<h3>' + H5PEditor.t('core', isAudio ? 'enterAudioTitle' : 'enterVideoTitle') + '</h3>' +
          '<div class="h5p-file-url-wrapper ' + type + '">' +
            '<input type="text" placeholder="' + H5PEditor.t('core', isAudio ? 'enterAudioUrl' : 'enterVideoUrl') + '" class="h5p-file-url h5peditor-text"/>' +
          '</div>' +
          (isAudio ? '' : '<div class="h5p-errors"></div><div class="h5peditor-field-description">' + H5PEditor.t('core', 'addVideoDescription') + '</div>');

      default:
        return '';
    }
  };

  /**
   * Creates the HTML for the tabbed insert media dialog. Only used when there
   * are extra tabs.
   *
   * @param {string} type 'video' or 'audio'
   * @param {Array} extraTabs
   * @returns {string} HTML
   */
  C.createTabbedAdd = function (type, extraTabs, id, hasDescription) {
    let i;

    const tabs = [
      'BasicFileUpload',
      'InputLinkURL'
    ];
    for (i = 0; i < extraTabs.length; i++) {
      tabs.push(extraTabs[i]);
    }

    let tabsHTML = '';
    let tabpanelsHTML = '';

    for (i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const tabId = C.getNextId();
      const tabindex = (i === 0 ? 0 : -1)
      const selected = (i === 0 ? 'true' : 'false');
      const title = (i > 1 ? H5PEditor.t('H5PEditor.' + tab, 'title') : H5PEditor.t('core', 'tabTitle' + tab));

      tabsHTML += '<div class="av-tab' + (i === 0 ? ' selected' : '') + '" tabindex="' + tabindex + '" role="tab" aria-selected="' + selected + '" aria-controls="av-tabpanel-' + tabId + '" id="av-tab-' + tabId + '">' + title + '</div>';
      tabpanelsHTML += '<div class="av-tabpanel" tabindex="-1" role="tabpanel" id="av-tabpanel-' + tabId + '" aria-labelledby="av-tab-' + tabId + '"' + (i === 0 ? '' : ' hidden=""') + '>' + C.createTabContent(tab, type) + '</div>';
    }

    return C.createInsertDialog(
      '<div class="av-tablist" role="tablist" aria-label="' + H5PEditor.t('core', 'avTablistLabel') + '">' + tabsHTML + '</div>' + tabpanelsHTML,
      true, id, hasDescription
    );
  };

  /**
   * Creates the HTML for the basic 'Upload or URL' dialog.
   *
   * @param {string} type 'video' or 'audio'
   * @param {string} id
   * @param {boolean} hasDescription
   * @returns {string} HTML
   */
  C.createAdd = function (type, id, hasDescription) {
    return C.createInsertDialog(
      '<div class="h5p-dialog-box">' +
        C.createTabContent('BasicFileUpload', type) +
      '</div>' +
      '<div class="h5p-or-vertical">' +
        '<div class="h5p-or-vertical-line"></div>' +
        '<div class="h5p-or-vertical-word-wrapper">' +
          '<div class="h5p-or-vertical-word">' + H5PEditor.t('core', 'or') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="h5p-dialog-box">' +
          C.createTabContent('InputLinkURL', type) +
      '</div>',
      false, id, hasDescription
    );
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
    }
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

  C.getUploadSVG = function () {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="42" viewBox="0 0 60 42" fill="none">
        <path d="M37.5822 33.9912C37.5428 33.8902 37.5165 33.8019 37.4902 33.7009H12.2302C10.2467 33.7009 8.63102 32.5145 8.19754 30.7601C8.10559 30.3563 8.06618 30.0155 8.06618 29.7252C8.05305 21.7611 8.05305 13.6582 8.05305 5.82028C8.05305 5.26494 8.15813 4.73484 8.35517 4.26785C8.26322 4.25523 8.17127 4.24261 8.07932 4.25523C7.97423 4.26785 7.86915 4.29309 7.7772 4.33096C7.52762 4.44455 7.31745 4.65911 7.21236 4.9494C7.17295 5.05038 7.14668 5.15135 7.12041 5.25232C6.18777 8.52126 2.62799 21.3951 1.70849 24.6766C1.31442 26.065 0.907208 27.466 0.5 28.8543V30.0281C0.526271 30.0786 0.565679 30.1291 0.578814 30.1796C0.959751 31.8203 2.01061 32.8174 3.67885 33.2466C8.07932 34.3699 12.4667 35.5058 16.8671 36.6291C22.6731 38.131 28.4923 39.6204 34.2982 41.1097C36.4788 41.665 38.5674 40.5291 39.211 38.4592C39.3161 38.131 39.408 37.8029 39.5 37.4873C38.7513 36.5534 38.147 35.4932 37.7135 34.3699C37.661 34.2436 37.6216 34.1174 37.5822 33.9912Z" fill="#C4D9EE"/>
        <path d="M50.4864 3.79139L50.4593 3.76446L50.4186 3.6298C49.7677 1.28683 48.3846 0.25 45.9437 0.25H12.0292C11.663 0.25 11.2291 0.25 10.863 0.317327C9.39846 0.613564 8.30006 1.54267 7.81189 2.84881C7.62204 3.34703 7.51356 3.91257 7.5 4.50505C7.5 12.867 7.5 21.5118 7.51356 30.0084C7.51356 30.3181 7.55424 30.6817 7.64916 31.1126C8.09666 32.9843 9.76459 34.25 11.8122 34.25H37.8753C37.8753 34.2365 37.8617 34.2096 37.8617 34.1961C37.699 33.6441 37.5769 33.0785 37.482 32.4995H11.9207C11.0121 32.4995 10.3748 32.2437 9.88663 31.6916L9.79171 31.5839L9.60186 31.3684C9.60186 31.3684 9.46626 31.2068 9.28997 30.6278C9.24929 30.5066 9.27641 4.6801 9.27641 4.6801C9.27641 2.88921 10.1985 1.98703 12.0156 1.98703H45.9573C47.7879 1.98703 48.7236 2.90267 48.7236 8.1003V18.1185C49.049 18.0916 49.388 18.0647 49.7271 18.0512C49.822 18.0512 49.9169 18.0377 50.0118 18.0377C50.0389 18.0377 50.0796 18.0377 50.1067 18.0377C50.2288 18.0377 50.3644 18.0377 50.4864 18.0512H50.5C50.5 13.1498 50.4864 7.68287 50.4864 3.79139Z" fill="#3B435A"/>
        <path d="M50.3784 24.25H49H48.7297H48.4595H47.5946V28.3632H46.6487H46.3649H46.1081H43.5V30.2574V30.528V30.7986V31.1504H47.4459H47.5946V31.3669V31.7863V35.25H50.3784V31.1504H54.5V28.3632H50.3784V24.25Z" fill="#277ACA"/>
        <path d="M49.3283 19.2634C49.2345 19.2634 49.1541 19.2634 49.0603 19.25C49.0335 19.25 49.0201 19.25 48.9933 19.25C48.9263 19.25 48.8593 19.25 48.7923 19.25C48.1892 19.2634 47.613 19.3171 47.0367 19.4243C46.9563 19.4377 46.8625 19.4511 46.7821 19.478C46.7017 19.4914 46.6078 19.5182 46.5274 19.5316C46.1522 19.6255 45.777 19.7328 45.4151 19.8669C45.3213 19.8937 45.2409 19.9339 45.1471 19.9741C45.0533 20.0144 44.9729 20.0412 44.8791 20.0814C44.3162 20.3228 43.7802 20.6178 43.2709 20.9397C43.1905 20.9933 43.1235 21.0335 43.0565 21.0872C42.9895 21.1408 42.9091 21.1944 42.8421 21.2347C40.2154 23.1523 38.5 26.25 38.5 29.7366C38.5 29.8171 38.5 29.8975 38.5 29.978C38.5 30.0718 38.5 30.1523 38.5134 30.2462C38.5134 30.34 38.5268 30.4205 38.5268 30.5144C38.5402 30.6216 38.5402 30.7289 38.5536 30.8362C38.6072 31.319 38.6876 31.8017 38.8082 32.2577C38.835 32.3381 38.8484 32.432 38.8752 32.5125C38.902 32.6063 38.9288 32.7002 38.9556 32.7941C39.0227 32.9952 39.0897 33.2098 39.1567 33.4109C40.6442 37.4071 44.4904 40.25 48.9933 40.25C54.7827 40.25 59.5 35.5297 59.5 29.7366C59.5 24.0776 54.9703 19.4377 49.3283 19.2634ZM48.9933 38.6676C45.1605 38.6676 41.8906 36.227 40.6442 32.8209C40.604 32.727 40.5772 32.6331 40.5504 32.5393C40.5236 32.4588 40.4968 32.3649 40.47 32.2845C40.3092 31.7213 40.1886 31.1446 40.135 30.5412C40.1216 30.4473 40.1216 30.3669 40.1082 30.273C40.1082 30.1791 40.0948 30.0987 40.0948 30.0048C40.0948 29.9243 40.0948 29.8439 40.0948 29.7634C40.0948 26.7596 41.5957 24.091 43.8874 22.4818C43.9544 22.4282 44.0348 22.3745 44.1018 22.3343C44.1822 22.2807 44.2492 22.2404 44.3296 22.1868C44.8523 21.8649 45.4151 21.5967 45.9914 21.3822C46.0852 21.3554 46.179 21.3151 46.2594 21.2883C46.4336 21.2347 46.5944 21.181 46.7687 21.1408C46.8491 21.114 46.9429 21.1006 47.0233 21.0872C47.5861 20.9531 48.1758 20.886 48.7789 20.8726C48.8459 20.8726 48.9129 20.8726 48.9799 20.8726C49.0067 20.8726 49.0201 20.8726 49.0469 20.8726C49.1407 20.8726 49.2211 20.8726 49.3149 20.886C54.0724 21.0603 57.8784 24.9761 57.8784 29.7768C57.8918 34.6715 53.8982 38.6676 48.9933 38.6676Z" fill="#277ACA"/>
        <path d="M39.3782 9.15576C39.0874 9.0048 38.7827 8.93618 38.4642 8.93618C38.0349 8.93618 37.6471 9.07342 37.2732 9.3479C36.9547 9.56747 36.6362 9.80078 36.3177 10.0341C35.7499 10.4458 35.1544 10.8712 34.5589 11.2829L34.0049 11.6809L33.908 11.7495L33.8941 11.6398L33.7972 10.9673C33.7002 10.2811 33.4094 9.66354 32.9385 9.18321C32.3707 8.59309 31.5675 8.27745 30.6812 8.27745C28.7977 8.25 26.9282 8.25 25.1278 8.25C23.3136 8.25 21.444 8.25 19.6437 8.26372C17.8572 8.27745 16.5 9.63609 16.5 11.4339V20.0661C16.5 21.8639 17.8572 23.2226 19.6437 23.2363C21.4302 23.25 23.2998 23.25 25.114 23.25C26.9143 23.25 28.7839 23.25 30.6673 23.2363C31.5398 23.2363 32.3569 22.9069 32.9524 22.3168C33.4233 21.8365 33.7141 21.2326 33.7972 20.5464L33.8803 19.8602L33.8941 19.7505L33.9911 19.8191L34.5589 20.2171C34.9051 20.4504 35.2513 20.7111 35.5975 20.9581C35.8745 21.1503 36.1376 21.3424 36.4146 21.5345C36.5669 21.6443 36.7193 21.7541 36.8716 21.8639C37.0239 21.9737 37.1901 22.0835 37.3425 22.1933C37.5225 22.3305 37.6748 22.4129 37.8687 22.4677C38.1042 22.5364 38.3119 22.5638 38.5058 22.5638C39.5998 22.5638 40.5 21.6581 40.5 20.5464V14.0002V10.9398C40.4723 10.1439 40.0845 9.51258 39.3782 9.15576ZM31.6091 21.013C31.3598 21.2738 30.9997 21.411 30.5704 21.411H30.5427C29.9057 21.3973 29.2132 21.3973 28.3269 21.3973H26.7204H25.1278H23.549H21.9564C21.1671 21.3973 20.5439 21.3973 19.9622 21.411L19.9484 21.4247H19.9207H19.7545C19.339 21.4247 18.9928 21.2875 18.6881 21.013C18.425 20.7523 18.2726 20.3817 18.2726 19.9563C18.2865 18.0487 18.2865 16.1137 18.2865 14.2335V11.4202C18.2865 10.7203 18.6743 10.2125 19.3113 10.0478H19.3252H19.339H19.3529H19.3667C19.3806 10.0478 19.4221 10.0478 19.4636 10.0341C19.5467 10.0204 19.6575 10.0204 19.7683 10.0204H26.2911H30.5704C31.4983 10.0204 32.0245 10.5556 32.0245 11.4751V14.1512C32.0245 16.0588 32.0245 18.0213 32.0384 19.9563C32.0107 20.5464 31.7614 20.8758 31.6091 21.013ZM38.672 10.6379V11.4476V13.616V14.5492V15.3726V15.702V16.6764V19.9838V20.7797V20.917L38.5612 20.8346L37.9103 20.368L37.3702 19.9838C36.1792 19.1329 35.0851 18.3506 34.0326 17.5958L33.8664 17.4723L33.8387 17.4586V17.4312V17.2116V15.6059C33.8249 15.3726 33.8249 15.153 33.8249 14.906C33.8249 14.6727 33.8249 14.4394 33.811 14.2061V14.0002V13.9591L33.8387 13.9453L34.0188 13.8218L34.6835 13.3415C35.3205 12.8886 35.9853 12.4083 36.6362 11.9554C37.0516 11.6535 37.481 11.3516 37.8964 11.0496L38.5612 10.583L38.672 10.5007V10.6379Z" fill="#3B435A"/>
      </svg>
    `;
  }

  C.STATE = {
    NO_IMAGE: 'NO_IMAGE',
    UPLOADING: 'UPLOADING',
    HAS_IMAGE: 'HAS_IMAGE'
  };
  

  return C;
})(H5P.jQuery);
