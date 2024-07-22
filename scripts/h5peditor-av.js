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
    this.avContentList;

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


    self.on('upload', function () {
      // Insert throbber
      self.$uploading = $('<div class="h5peditor-uploading h5p-throbber">' + H5PEditor.t('core', 'uploading') + '</div>').insertAfter(self.$add.hide());

      // Clear old error messages
      self.$errors.html('');

      self.closeDialog();
    });

    self.on('uploadProgress', function (e) {
      // New upload, i.e. not update existing box.
      if (typeof e.data.updateId === 'undefined') {
        self.handleUploadProgress(this.dndAddDialog);
      }
    });

    self.on('uploadComplete', function (event) {
      const result = event.data;
      let index = self.params?.length ?? 0;
      const updateId = event.data?.updateId ?? undefined;
      this.updateId = updateId;
      const boxesEl = Array.from(self.$dndFiles.get(0).querySelectorAll('.h5p-dnd__videobox-wrapper:not(.h5p-dnd__videobox-wrapper--is-provider)'));
      let boxEl;
      
      try {
        if (result.error) {
          throw result.error;
        }

        // Clear out add dialog
        this.$addDialog.find('.h5p-file-url').val('');

        // Set params if none is set
        if (self.params === undefined) {
          self.params = [];
          self.setValue(self.field, self.params);
        }

        // Add a new file/source
        var file = {
          path: result.data.path,
          mime: result.data.mime,
          copyright: self.copyright,
          parentContainer: C.FILE_CONTAINER.DRAG_AND_DROP,
        };
        
        if (updateId) {
          let foundUpdateIndex = self.params.findIndex(param => param.id === updateId);
          
          if (foundUpdateIndex !== -1) {
            file.id = updateId;

            self.updateIndex = index = foundUpdateIndex;
            self.params[index] = file;
            boxEl = boxesEl.find(element => element.id === updateId);

            self.addFile(foundUpdateIndex, updateId);
          }
          else {
            throw new Error(`Index: ${foundUpdateIndex} not found`);
          }

        }
        else {
          file.id = `${C.getNextId()}`;

          boxEl = self.dndAddDialog;
          self.params[index] = file;
          self.addFile(index);
        }

        // Trigger change callbacks (old event system)
        for (var i = 0; i < self.changes.length; i++) {
          self.changes[i](file);
        }

        const errorEls = Array.from(self.$dndFiles.get(0).querySelectorAll('.has-error'));
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

    var imageHtml =
      '<ul class="file list-unstyled"></ul>' +
      C.createTabbedAdd(self.field.type, self.field.widgetExtensions, id, self.field.description !== undefined);

    if (!this.field.disableCopyright) {
      imageHtml += '<a class="h5p-copyright-button" href="#">' + H5PEditor.t('core', 'editCopyright') + '</a>';
    }

    imageHtml += '<div class="h5p-editor-dialog">' +
    '<a href="#" class="h5p-close" title="' + H5PEditor.t('core', 'close') + '"></a>' +
    '</div>';
    
    var html = H5PEditor.createFieldMarkup(this.field, imageHtml, id);
    var $container = $(html).appendTo($wrapper);
    
    // Wrappers (hierarchyl)
    this.$dialogAnchor = $container.children('.h5p-dialog-anchor');
    this.$addDialog = this.$dialogAnchor.children('.h5p-add-dialog');
    this.$dialogTable = this.$addDialog.children('.h5p-add-dialog-table');
    this.$tabList = this.$dialogTable.children('.av-tablist');
    
    this.$add = $container.children('.h5p-add-file').click(function () {
      this.$addDialog.addClass('h5p-open');
    });

    // Prepare to add the extra tab instances
    const tabInstances = [null, null]; // Add nulls for hard-coded tabs
    self.tabInstances = tabInstances;

    // Tabs that are hard-coded into this widget. Any other tab must be an extension.
    const TABS = {
      UPLOAD: 0,
      INPUT: 1
    };

    let activeTab = TABS.UPLOAD;

    /**
     * @param {number} tab
     * @return {boolean}
     */
    const isExtension = function (tab) {
      return tab > TABS.INPUT; // Always last tab
    };

    const toggleTab = function () {
      // Pause the last active tab
      if (isExtension(activeTab)) {
        tabInstances[activeTab].pause();
      }

      // Update tab
      this.parentElement.querySelector('.selected').classList.remove('selected');
      this.classList.add('selected');
      
      // Update tab panel
      const inactiveTabPanel = document.getElementById(this.getAttribute('aria-controls'));
      const activeTabPanel = inactiveTabPanel.parentElement.querySelector('.av-tabpanel:not([hidden])');
      activeTabPanel.setAttribute('hidden', '');
      inactiveTabPanel.removeAttribute('hidden');

      // Set active tab index
      for (let i = 0; i < inactiveTabPanel.parentElement.children.length; i++) {
        if (inactiveTabPanel.parentElement.children[i] === inactiveTabPanel) {
          activeTab = i - 1; // Compensate for .av-tablist in the same wrapper
          break;
        }
      }
    }

    const moveFocus = function (el) {
      if (el) {
        this.setAttribute('tabindex', '-1');
        el.setAttribute('tabindex', '0');
        el.focus();
      }
    }

    if (self.field.widgetExtensions) {
      /**
       * @param {string} type Constructor name scoped inside this widget
       * @param {number} index
       */
      const createTabInstance = function (type, index) {
        const tabInstance = new H5PEditor.AV[type]();
        tabInstance.appendTo(self.$addDialog[0].children[0].children[index + 1]); // Compensate for .av-tablist in the same wrapper
        tabInstance.on('hasMedia', function () {
          if (index === activeTab) {
            // something
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
    
    this.$dndTabPanel = this.$dialogTable.children('.av-tabpanel:not([hidden])');
    this.$dndFiles = this.$dndTabPanel.children('.h5p-dnd__av-container');
    
    this.$urlTabPanel = this.$dialogTable.children('.av-tabpanel hidden');
    this.$urlFiles = this.$dndFiles.parent().children('#urlFiles');
    
    this.dndAddDialog = this.$dndFiles.children('.h5p-dnd__box__url.h5p-dnd__box--is-dashed').get(0);
    this.ariaLiveEl = this.$dndFiles.find('.h5p-sr-only[aria-live]').get(0);

    const blockEl = this.dndAddDialog.querySelector('.h5p-dnd__box__block');
    this.addDragAndDropListeners(this.dndAddDialog, blockEl);

    let urlInsertButton = this.$dialogTable.find('.h5p-dnd__btn__insert-url'); 
    let inputContainer = urlInsertButton.parent().parent().parent();
    this.$videoUrlErrorContainer = inputContainer.find('#errorContainer');

    urlInsertButton.on('click', () => {
      const inputContainer = urlInsertButton.parent().parent().parent();
      const url = inputContainer.find('.input-video').val().trim();
      const isAudio = this.field.type === 'audio';
      if (url.length === 0) {
        return;
      }

      if (!C.findProvider(url)) {
        this.$videoUrlErrorContainer.removeClass('hidden');
        this.$videoUrlErrorContainer.addClass("has-error");
        this.$videoUrlErrorContainer.find('.h5p-errors').text(isAudio ? ns.t('core', 'unsupportedAudioSource') : ns.t('core', 'unsupportedVideoSource'));
      }
      else {
        this.$videoUrlErrorContainer.addClass('hidden');

        // Check if there is an existing media propery in params
        let existingMedia = this.params?.some(p => C.findProvider(p.path));
        
        if (existingMedia) {
          this.replaceUrl(url);
        } else {
          this.useUrl(url);
        }
        this.updatePasteBox(true);
      }
    });

    // Fix context-specific selection
    let urlInputField = this.$dialogTable.find('.input-video'); 
    urlInputField.on('keydown', (e) => {
      this.$videoUrlErrorContainer.addClass('hidden');
      if (e.code === 'Enter') {
        const url = this.$dialogTable.find('.input-video').val().trim();
        const isAudio = this.field.type === 'audio';
        if (url.length === 0) {
          return;
        }
        
        if (!C.findProvider(url)) {
          this.$videoUrlErrorContainer.removeClass('hidden');
          this.$videoUrlErrorContainer.addClass("has-error");
          this.$videoUrlErrorContainer.find('.h5p-errors').text(isAudio ? ns.t('core', 'unsupportedAudioSource') : ns.t('core', 'unsupportedVideoSource'));
        }
        else {

          // Check if there is an existing media propery in params
          let existingMedia = this.params?.some(p => C.findProvider(p.path));

          if (existingMedia) {
            this.replaceUrl(url);
          } else {
            this.useUrl(url);
          }
          this.updatePasteBox(true);
        }
      }
    });

    // May need to add listener on the specific dnd tab here
    document.addEventListener('paste', (e) => {
      const activeElement = document.activeElement.closest('.h5p-dnd__box');
      if (this.$dndFiles.get(0).contains(activeElement) && activeElement && e.clipboardData.files.length > 0) {
        const children = Array.from(activeElement.parentElement.parentElement.querySelectorAll('.h5p-dnd__box--has-video'));
        let index = -1;
        let id;
        children.forEach((child, i) => {
          if (child === activeElement) {
            index = i;
            id = child.id ?? null;
          }
        })

        this.uploadOrReplaceImage(e.clipboardData.files, index, id, activeElement);
      }
    });

    let uploadButton = this.$dialogTable.find('.h5p-dnd__btn__upload');
    uploadButton.on('click', (e) => {
      e.preventDefault();
      this.openFileSelector();
    });
    
    this.$errors = $container.children('.h5p-errors');

    if (this.params !== undefined) {
      this.avContentList = this.params;
      this.params = this.params.map((param) => ({
        ...param,
        id: `${C.getNextId()}`,
        parentContainer: C.findProvider(param.url) ? C.FILE_CONTAINER.URL_INPUT : C.FILE_CONTAINER.DRAG_AND_DROP,
      }));

      for (var index = 0; index < this.params.length; index++) {
        this.addFile(index);
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

    self.$addDialog = this.$add.next().children().first();
    
    // Open dialog logic : setting the dialog open from beginning
    self.$addDialog.addClass('h5p-open');

    var $url = this.$url = this.$addDialog.find('.input-video');

    this.$addDialog.find('.h5p-file-drop-upload')
      .addClass('has-advanced-upload')
      .on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
      })
      .on('dragover dragenter', function (e) {
        $(this).addClass('over');
        e.originalEvent.dataTransfer.dropEffect = 'copy';
      })
      .on('dragleave', function () {
        $(this).removeClass('over');
      })
      .on('drop', function (e) {
        self.uploadFiles(e.originalEvent.dataTransfer.files);
      })
      .click(function () {
        self.openFileSelector();
      });
    
    // AudioRecorder
    this.$insertButton = this.$dialogTable.find('.h5p-insert').click(function () {
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
    loaderEl?.removeAttribute('style');
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
  C.prototype.handleDragAndDrop = function (e, boxEl, shouldReplace) {
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
      const id = shouldReplace ? $(boxEl.parentElement).attr(id) : null;
      this.uploadOrReplaceImage(e.dataTransfer.files, index, id, boxEl);
    }
  };


  /**
   * Will either upload or replace (and upload) an image.
   * 
   * @param {FileList} files 
   */
  C.prototype.uploadOrReplaceImage = function (files, indexToReplace = -1, idToReplace = undefined, boxEl) {
    if (idToReplace) {
      // Need to make a copy of the file since Firefox loses the reference to it during the confirm replace dialog.
      const filesBackup = [new File([files[0]], files[0].name, { type: files[0].type })];
      this.replaceCallback = () => {
        this.handleUploadProgress(boxEl);
        this.updateIndex = indexToReplace;
        this.updateId = idToReplace;
        this.uploadFiles(filesBackup, { updateId: idToReplace });
      };
      this.previousState = C.STATE.HAS_IMAGE;
      this.previousParams = this.params;
      this.confirmReplaceDialog.show(this.$dndFiles.offset().top);
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
  C.prototype.addFile = function (index, updateFileId = undefined) {
    var that = this;
    var file = this.params[index];

    // Check if source is provider (Vimeo, YouTube, Panopto)
    const isProvider = file?.path && C.findProvider(file.path);
    const isAudio = this.field.type === 'audio';

    let filesContainer;
    switch (file.parentContainer) {
      case C.FILE_CONTAINER.DRAG_AND_DROP:
        filesContainer = this.$dialogTable.find('#dndFiles');
        break;
      
      case C.FILE_CONTAINER.URL_INPUT:
        filesContainer = this.$dialogTable.find('#urlFiles');
        break;

      case C.FILE_CONTAINER.AUDIO_RECORDER:
        filesContainer = this.$dialogTable.find('#audioRecorderFiles');
        break;
    }

    const boxEl = updateFileId ? filesContainer.find(`#${updateFileId}`).get(0) : filesContainer.find('.h5p-dnd__box').get(0);

    const blockEl = filesContainer.find('.h5p-dnd__box__block').get(0);
    const mimeType = file.mime.split('/')[1];
    const videoText = C.providers.map(p => p.name).includes(mimeType) ? mimeType : `.${mimeType.toUpperCase()}`;
    let fileHtml;
    if (!isProvider) {
      fileHtml = `
        <div id="${this.params[index].id}" class="h5p-dnd__videobox-wrapper">
          <div class="h5p-dnd__box h5p-dnd__box--has-video h5p-dnd__box--is-dashed h5p-dnd__box--is-inline" tabindex="0" role="button">
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
              <div class="h5p-dnd__column h5p-dnd__column--show-when-focus h5p-dnd__column__drag-text">
                <div class="h5p-dnd__text">${isAudio ? H5PEditor.t('core', 'dragAndDropToReplaceAudio') : H5PEditor.t('core', 'dragAndDropToReplaceVideo')}</div>
              </div>
          </div>
          <div class="h5p-dnd__loader h5p-dnd__box h5p-dnd__box--has-video h5p-dnd__box--is-dashed h5p-dnd__box--is-inline" tabindex="0" style="display: none;">
            <div class="h5p-dnd__column">
              <div class="h5p-loader__wrapper">
                <div class="h5p-loader__icon"></div>
              </div>
            </div>
          </div>

          <div class="h5p-errors"></div>
          <div class="h5p-editor-image-actions">
            <button class="delete h5p-delete-image-button h5peditor-button-textual" type="button">${isAudio ? ns.t('core', 'deleteAudioLabel') : ns.t('core', 'deleteVideoLabel')}</button>
          </div>
        </div>
      `;
    } else {
      fileHtml = `
        <div id="${this.params[index].id}" class="h5p-dnd__videobox-wrapper h5p-dnd__videobox-wrapper--is-provider">
          <div class="h5p-dnd__box h5p-dnd__box--has-video h5p-dnd__box--is-inline" tabindex="0" role="button">
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
            <div class="h5p-dnd__loader h5p-dnd__column h5p-dnd__column--is-full-width" style="display: none;">
              <div class="h5p-loader__wrapper">
                <div class="h5p-loader__icon"></div>
              </div>
            </div>
          </div>

          <div class="h5p-errors"></div>
          <div class="h5p-editor-image-actions">
            <button class="delete h5p-delete-image-button h5peditor-button-textual" type="button">${isAudio ? ns.t('core', 'deleteAudioLabel') : ns.t('core', 'deleteVideoLabel')}</button>
          </div>
        </div>
      `;
    }
    
    // Insert file element in appropriate order
    var $file = $(fileHtml);

    this.$add.toggleClass('hidden', isProvider);

    // Check if I can update the params here instead of every time before calling the addFile method 
    if (updateFileId) {
      this.updateId = undefined;
      this.updateIndex = undefined;
      var $oldFile = filesContainer.find(`#${updateFileId}`);
      index = $oldFile.index();
      $oldFile.remove();
      $file.insertBefore(filesContainer.children().eq(index));
    }
    else {
      $file.prependTo(filesContainer);
    }

    this.$add.parent().find('.h5p-copyright-button').removeClass('hidden');

    // Handle drag and drop
    this.addDragAndDropListeners(boxEl, blockEl, true);

    // Handle space/enter on frame/box
    boxEl.addEventListener('keydown', (e) => {
      if (!isProvider && e.target?.nodeName !== 'INPUT') {
        if ((e.code === 'Space' || e.code === 'Enter')) {
          this.openFileSelector({
            onChangeCallback: () => {
              this.updateIndex = index;
              this.updateId = boxEl.attr('id');
              this.handleUploadProgress(boxEl);
            },
            context: {
              updateId: boxEl.attr('id'),
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
      .click(() => {
        if (!isProvider) {
          this.openFileSelector({
            onChangeCallback: () => {
              this.updateIndex = index;
              this.updateId = $file.attr('id');
              let current = filesContainer.find(`#${this.updateId}`).get(0);
              this.handleUploadProgress(current);
            },
            context: {
              updateId: $file.attr('id'),
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
      if (filesContainer.children().length === 0) {
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
    if (this.params && this.params.length === 1) {
      // Remove from params.
      delete this.params;
      this.setValue(this.field);
    }
    else if (this.params.length > 1) {
      var index = $file.index();
      this.params.splice(index, 1);
    }

    $file.remove();
    this.$add.removeClass('hidden');

    if (this.params === undefined) {
      this.updatePasteBox(false);
      this.$videoUrlErrorContainer.addClass('hidden');
    }

    // Notify change listeners
    for (var i = 0; i < this.changes.length; i++) {
      this.changes[i]();
    }
  };

  C.prototype.updatePasteBox = function (isReplace) {
    const filesContainer = $('.av-tabpanel:not([hidden])');
    const pasteBoxEl = filesContainer.find('.h5p-dnd__box__video-paste');
    const inputEl = pasteBoxEl.find('.input-video');
    const btnEl = pasteBoxEl.find('.h5p-dnd__btn__insert-url');
    
    btnEl.innerText = isReplace ? H5PEditor.t('core', 'replaceUrl') : H5PEditor.t('core', 'insertUrl');
    inputEl.value = isReplace ? inputEl.value : "";
  }

  /**
   * Add new url to Url container
   *  
   * @param {string} url new url
   */
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
      id: `${C.getNextId()}`,
      path: url,
      mime: this.field.type + '/' + (mime ? mime : 'unknown'),
      copyright: this.copyright,
      aspectRatio: aspectRatio ? aspectRatio : undefined,
      parentContainer: C.FILE_CONTAINER.URL_INPUT,
    };

    this.params.push(file);
    index = this.params.findIndex(param => param.id === file.id);
    this.addFile(index);

    for (i = 0; i < this.changes.length; i++) {
      this.changes[i](file);
    }
  };

  /**
   * Replace the file in the Url container
   *  
   * @param {string} url New file url
   */
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
    
    const index = this.params.findIndex(param => C.findProvider(param.path));
    
    var file = {
      id: this.params[index].id,
      path: url,
      mime: this.field.type + '/' + (mime ? mime : 'unknown'),
      copyright: this.copyright,
      aspectRatio: aspectRatio ? aspectRatio : undefined,
      parentContainer: C.FILE_CONTAINER.URL_INPUT,
    };

    this.params[index] = file;

    const mimeType = file.mime.split('/')[1];
    const videoText = C.providers.map(p => p.name).includes(mimeType) ? mimeType : `.${mimeType.toUpperCase()}`;

    // Simulating loading to give some feedback to user since this is actually instant.
    const urlFilesContainer = this.$dialogTable.find('#urlFiles');
    const boxEl = urlFilesContainer.get(0).querySelector('.h5p-dnd__videobox-wrapper--is-provider .h5p-dnd__box');
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

  C.prototype.getInputUrlFile = function () {
    if (this.params && this.params.length) {
      return this.params.filter(param => C.isProvider(param.mimeType) !== 'undefined'); // Should only give one result
    }
    return null;
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
  // Open dialog logic
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
  C.createInsertDialog = function (content) {
    return '<div class="h5p-dialog-anchor"><div class="h5p-add-dialog h5p-open">' +
      '<div id="dialogTable" class="h5p-add-dialog-table">' + content + '</div>' +
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
    const firstFile =  Array.isArray(this.params) ? this.params[0] : undefined;
    const isProvider = firstFile?.path && C.findProvider(firstFile.path);
    const copyPasteString = `<span class="h5p-dnd-nowrap"><span class="h5p-dnd__badge">${ns.t('core', 'ctrlKey')}<span class="h5p-dnd__badge__separator"></span>${ns.t('core', 'commandKey')}</span> + <span class="h5p-dnd__badge">${ns.t('core', 'pasteKey')}</span></span>`;
    const dragCopyPasteString = ns.t('core', isAudio ? 'dragAndDropAndPasteAudio' : 'dragAndDropAndPasteVideo', { ':keyCombination': copyPasteString });
    
    switch (tab) {
      case 'BasicFileUpload':
        return `
          <div id="dndFiles" class="h5p-dnd__av-container">
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
          </div>
        `;

      


      case 'InputLinkURL':
          return `
            <div id="urlFiles" class="h5p-dnd__av-container">
              <div class="h5p-dnd__box__block"></div>
              <div class="h5p-dnd__box h5p-dnd__box__url h5p-dnd__box__video-paste">
                
                <div class="h5p-dnd__row">
                  <div class="input-container">
                    <input class="input-video" size="1" type="text" placeholder="${isAudio ? H5PEditor.t('core', 'enterAudioLink') : H5PEditor.t('core', 'enterVideoLink')}" value="${isProvider ? firstFile.path : ''}"/>
                    <button class="h5p-dnd__btn h5p-dnd__btn__primary h5p-dnd__btn__insert-url" type="button">${firstFile ? H5PEditor.t('core', 'replaceUrl') : H5PEditor.t('core', 'insertUrl')}</button>
                  </div>
                </div>
                <div class="h5p-dnd__row">
                  <div id="errorContainer" class="video-url-error-container hidden">
                    <div class="h5p-errors"></div>
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
            </div>
          `;
      default:
        return '';
    }
  };

  // AudioRecorder
  C.createAudioRecorderTabContent = function () {
    return `
      <div id="audioRecorderFiles" class="h5p-dnd__av-container">
        <div class="h5p-dnd__box__block"></div>
        <div class="h5p-dnd__box__url h5p-dnd__box__video-paste">
          <div class="h5p-buttons">
            <button class="h5peditor-button-textual h5p-insert" disabled> ${H5PEditor.t('core', 'insert')} </button>
          </div>

        </div>
      </div>
    `;
  };

  /**
   * Creates the HTML for the tabbed insert media dialog. Only used when there
   * are extra tabs.
   *
   * @param {string} type 'video' or 'audio'
   * @param {Array} extraTabs
   * @returns {string} HTML
   */
  C.createTabbedAdd = function (type, extraTabs) {
    let i;

    const tabs = [
      'BasicFileUpload',
      'InputLinkURL'
    ];

    // Add when adding record audio
    if (extraTabs && extraTabs.length > 0) {
      for (i = 0; i < extraTabs.length; i++) {
        tabs.push(extraTabs[i]);
      }
    }

    let tabsHTML = '';
    let tabpanelsHTML = '';

    for (i = 0; i < tabs.length; i++) {
      let title = '';
      const tab = tabs[i];
      const tabId = C.getNextId();
      const tabindex = (i === 0 ? 0 : -1)
      const selected = (i === 0 ? 'true' : 'false');

      switch (tab) {
        case 'BasicFileUpload':
          title = H5PEditor.t('core', 'fileUploadTitle');
          tabsHTML +='<div class="av-tab av-tab__file-upload' + (i === 0 ? ' selected' : '') + '" tabindex="' + tabindex + '" role="tab" aria-selected="' + selected + '" aria-controls="av-tabpanel-' + tabId + '" id="av-tab-' + tabId + '">' + title + '</div>';
          break;
        case 'InputLinkURL':
          title = H5PEditor.t('core', 'insertLinkTitle');
          tabsHTML +='<div class="av-tab av-tab__insert-url' + (i === 0 ? ' selected' : '') + '" tabindex="' + tabindex + '" role="tab" aria-selected="' + selected + '" aria-controls="av-tabpanel-' + tabId + '" id="av-tab-' + tabId + '">' + title + '</div>';
          break;
        case 'AudioRecorder':
          title = H5PEditor.t('core', 'recordAudioTitle');
          tabsHTML +='<div class="av-tab av-tab__record-audio' + (i === 0 ? ' selected' : '') + '" tabindex="' + tabindex + '" role="tab" aria-selected="' + selected + '" aria-controls="av-tabpanel-' + tabId + '" id="av-tab-' + tabId + '">' + title + '</div>';
          break;
        default:
          title = H5PEditor.t('H5PEditor.' + tab, 'title')
          break;
        }
      tabpanelsHTML += '<div class="av-tabpanel" tabindex="-1" role="tabpanel" id="av-tabpanel-' + tabId + '" aria-labelledby="av-tab-' + tabId + '"' + (i === 0 ? '' : ' hidden=""') + '>' + C.createTabContent(tab, type) + '</div>';
    }

    return C.createInsertDialog(
      '<div class="av-tablist" role="tablist" aria-label="' + H5PEditor.t('core', 'avTablistLabel') + '">' + tabsHTML + '</div>' + tabpanelsHTML
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

  C.FILE_CONTAINER = {
    DRAG_AND_DROP: 1,
    URL_INPUT: 2,
    AUDIO_RECORDER: 3
  };

  return C;
})(H5P.jQuery);
