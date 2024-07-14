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

    // When uploading starts
    self.on('upload', function () {
      // Insert throbber
      self.$uploading = $('<div class="h5peditor-uploading h5p-throbber">' + H5PEditor.t('core', 'uploading') + '</div>').insertAfter(self.$add.hide());

      // Clear old error messages
      self.$errors.html('');

      // Close dialog
      self.closeDialog();
    });

    // Monitor upload progress
    self.on('uploadProgress', function (e) {
      self.$uploading.html(H5PEditor.t('core', 'uploading') + ' ' + Math.round(e.data * 100) + ' %');
    });

    // Handle upload complete
    self.on('uploadComplete', function (event) {
      var result = event.data;

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
        var index = (self.updateIndex !== undefined ? self.updateIndex : self.params.length);
        self.params[index] = file;
        self.addFile(index);

        // Trigger change callbacks (old event system)
        for (var i = 0; i < self.changes.length; i++) {
          self.changes[i](file);
        }
      }
      catch (error) {
        // Display errors
        self.$errors.append(H5PEditor.createError(error));
      }

      if (self.$uploading !== undefined && self.$uploading.length !== 0) {
        // Hide throbber and show add button
        self.$uploading.remove();
        self.$add.show();
      }
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

    var imageHtml =
      '<ul class="file list-unstyled"></ul>' +
      C.createTabbedAdd(self.field.type, self.field.widgetExtensions, id, self.field.description !== undefined)
      // C.createAdd(self.field.type, id, 'BasicFileUpload', self.field.description !== undefined)
      // C.createAdd(self.field.type, id, 'InputLinkURL', self.field.description !== undefined)
      // (self.field.widgetExtensions ? C.createTabbedAdd(self.field.type, self.field.widgetExtensions, id, self.field.description !== undefined) : C.createAdd(self.field.type, id, self.field.description !== undefined))



    if (!this.field.disableCopyright) {
      imageHtml += '<a class="h5p-copyright-button" href="#">' + H5PEditor.t('core', 'editCopyright') + '</a>';
    }

    imageHtml += '<div class="h5p-editor-dialog">' +
      '<a href="#" class="h5p-close" title="' + H5PEditor.t('core', 'close') + '"></a>' +
      '</div>';

    

    var html = H5PEditor.createFieldMarkup(this.field, imageHtml, id);
    var $container = $(html).appendTo($wrapper);

    // DND logic
    this.$tabContainer = $container.children('.h5p-add-dialog-table');
    this.$activeTabPanel = this.$dndTabPanel = $('.av-tabpanel:not([hidden])');
    this.$activeFiles = this.$dndFiles = this.$activeTabPanel.children('.h5p-dnd__av-container');

    // this.$urlFiles =
    this.$urlTabPanel = this.$tabContainer.children('.av-tabpanel hidden');
    this.$urlFiles = this.$urlTabPanel.children('.h5p-dnd__av-container');
    
    
    console.log("this.$activeFiles::", this.$activeFiles);

    this.$add = $container.children('.h5p-add-file').click(function () {
      self.$addDialog.addClass('h5p-open');
    });

    this.boxEl = this.$activeFiles.children('.h5p-dnd__box__url.h5p-dnd__box--is-dashed').get(0);
    this.ariaLiveEl = this.$activeFiles.find('.h5p-sr-only[aria-live]').get(0);

    const blockEl = this.boxEl.querySelector('.h5p-dnd__box__block');
    this.addDragAndDropListeners(this.boxEl, blockEl);

    // May need to add listener on the specific dnd tab here
    document.addEventListener('paste', (e) => {
      const activeElement = document.activeElement.closest('.h5p-dnd__box');
      if (this.$activeFiles.get(0).contains(activeElement) && activeElement && e.clipboardData.files.length > 0) {
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
    this.$videoUrlErrorContainer = this.$activeFiles.find('.video-url-error-container');

    // // Prepare to add the extra tab instances
    // var tabInstances = [null, null]; // Add nulls for hard-coded tabs
    // self.tabInstances = tabInstances;

    // URL input logic
    var $url = this.$url = this.$addDialog.find('.h5p-file-url');
    this.$addDialog.find('.h5p-cancel').click(function () {
      self.updateIndex = undefined;
      self.closeDialog();
    });

    this.$activeFiles.find('.h5p-dnd__btn__upload').on('click', (e) => {
      debugger;
      e.preventDefault();
      this.openFileSelector();
    });

    // this.$urlFiles.find('.h5p-dnd__btn__upload').on('click', (e) => {
    //   e.preventDefault();
    //   this.openFileSelector();
    // });

    this.$activeFiles.find('.h5p-dnd__btn__insert-url').on('click', (e) => {
      debugger;
      const url = this.$urlFiles.find('.input-video').val().trim();
      if (url.length === 0) {
        return;
      }

      if (!C.findProvider(url)) {
        this.$videoUrlErrorContainer.removeClass('hidden');
        this.$videoUrlErrorContainer.addClass("has-error");
        this.$videoUrlErrorContainer.find('.h5p-errors').text(ns.t('core', 'unsupportedVideoSource'));
      }
      else {
        this.$videoUrlErrorContainer.addClass('hidden');
        if (this.params?.length > 0) {
          this.replaceUrl(url);
        } else {
          this.useUrl(url);
        }
        this.updatePasteBox(true);
      }
    });

    this.$urlFiles.find('.input-video').on('keydown', (e) => {
      this.$videoUrlErrorContainer.addClass('hidden');
      if (e.code === 'Enter') {
        const url = this.$urlFiles.find('.input-video').val().trim();
        if (url.length === 0) {
          return;
        }
        
        if (!C.findProvider(url)) {
          this.$videoUrlErrorContainer.removeClass('hidden');
          this.$videoUrlErrorContainer.addClass("has-error");
          this.$videoUrlErrorContainer.find('.h5p-errors').text(ns.t('core', 'unsupportedVideoSource'));
        }
        else {
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
    
    
    
    // C.prepareTabContents();
    
    // this.$addDialog = $container.children('.h5p-add-dialog');
    // this.$addDialogTable = this.$addDialog.children('.h5p-add-dialog-table');
    // console.log("this.$addDialogTable:", this.$addDialogTable);
    
    // // Get list of tabs and active tab
    // this.$tabList = this.$addDialogTable.children('.av-tablist');
    // this.$selectedTab = this.$tabList.children('.av-tab selected');
    // console.log("this.$selectedTab:", this.$selectedTab);
    
    // // Get active tab panel
    // this.$activeTaabPanel = this.$addDialogTable.children('.av-tabpanel:not([hidden])');
    // console.log("this.$activeTabPanel:", this.$activeTaabPanel);




    // Container for the tab (tab-list)
    // this.$tabsContainer = $files.find();

    // Container for the actual tab content in each tab ()
    // this.$tabContentContainer 

    // const el = document.getElementById(this.getAttribute('aria-controls'));
    // const tabPanel = el.parentElement.querySelector('.av-tabpanel:not([hidden])');
    // this.$activeFiles = $activeTaabPanel.children('.h5p-dnd__av-container');
    // console.log("this.$activeFiles 1", this.$activeFiles);

    // debugger;
    //Open dialog logic
    // this.$add = $container.children('.h5p-add-file').click(function () {
    //   self.$addDialog.addClass('h5p-open');
    // });
    // this.$tabTable = $container.children('.h5p-add-dialog');
    // console.log(this.$tabContainer);
    

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
      const inactiveTabPanel = document.getElementById(this.getAttribute('aria-controls'));
      const activeTabPanel = inactiveTabPanel.parentElement.querySelector('.av-tabpanel:not([hidden])');
      activeTabPanel.setAttribute('hidden', '');
      inactiveTabPanel.removeAttribute('hidden');

      // Update tab files
      this.$activeTabPanel = activeTabPanel;
      this.$activeFiles = activeTabPanel.querySelector('.h5p-dnd__av-container');

      // Set active tab index
      for (let i = 0; i < inactiveTabPanel.parentElement.children.length; i++) {
        if (inactiveTabPanel.parentElement.children[i] === inactiveTabPanel) {
          activeTab = i - 1; // Compensate for .av-tablist in the same wrapper
          break;
        }
      }

      // Toggle insert button disabled
      // if (activeTab === TABS.UPLOAD) {
      //   self.$insertButton[0].disabled = true;
      // }
      // else if (activeTab === TABS.INPUT) {
      //   self.$insertButton[0].disabled = false;
      // }
      // else {
      //   self.$insertButton[0].disabled = !tabInstances[activeTab].hasMedia();
      // }
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

    self.$addDialog = this.$tabContainer.next().children().first();
    // console.log('this.$tabContainer', this.$tabTable);
    // debugger;

    // Open dialog logic : setting the dialog open from beginning
    self.$addDialog.addClass('h5p-open');

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
        // console.log('self.$addDialog', self.$addDialog);
        
        // console.log('self.$container', self.$container);
        debugger;
        tabInstance.appendTo(self.$addDialog[0].children[0].children[index + 1]); // Compensate for .av-tablist in the same wrapper
        tabInstance.on('hasMedia', function (e) {
          if (index === activeTab) {
            // self.$insertButton[0].disabled = !e.data;
          }
        });
        debugger;
        tabInstances.push(tabInstance);
      }

      // Append extra tabs
      for (let i = 0; i < self.field.widgetExtensions.length; i++) {
        if (H5PEditor.AV[self.field.widgetExtensions[i]]) {
          createTabInstance(self.field.widgetExtensions[i], i + 2); // Compensate for the number of hard-coded tabs
        }
      }
    }
 // Checkout
    var $url = this.$url = this.$addDialog.find('.h5p-file-url');
    
    //Open dialog logic
    // this.$addDialog.find('.h5p-cancel').click(function () {
    //   self.updateIndex = undefined;
    //   self.closeDialog();
    // });

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
    
    // DND and video url should not have the $insertButton
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
      this.confirmReplaceDialog.show(this.$activeFiles.offset().top);
    } else {
      this.handleUploadProgress(boxEl);
      this.previousState = C.STATE.NO_IMAGE;
      this.previousParams = null;
      this.uploadFiles(files);
    }
  };


  // /**
  //  * Add file icon with actions.
  //  *
  //  * @param {Number} index
  //  */
  // C.prototype.addFile = function (index) {
  //   var that = this;
  //   var fileHtml;
  //   var file = this.params[index];
  //   var rowInputId = 'h5p-av-' + C.getNextId();
  //   var defaultQualityName = H5PEditor.t('core', 'videoQualityDefaultLabel', { ':index': index + 1 });
  //   var qualityName = (file.metadata && file.metadata.qualityName) ? file.metadata.qualityName : defaultQualityName;

  //   // Check if source is provider (Vimeo, YouTube, Panopto)
  //   const isProvider = file.path && C.findProvider(file.path);

  //   // Only allow single source if YouTube
  //   if (isProvider) {
  //     // Remove all other files except this one
  //     that.$files.children().each(function (i) {
  //       if (i !== that.updateIndex) {
  //         that.removeFileWithElement($(this));
  //       }
  //     });
  //     // Remove old element if updating
  //     that.$files.children().each(function () {
  //       $(this).remove();
  //     });
  //     // This is now the first and only file
  //     index = 0;
  //   }
  //   this.$add.toggleClass('hidden', isProvider);

  //   // If updating remove and recreate element
  //   if (that.updateIndex !== undefined) {
  //     var $oldFile = this.$files.children(':eq(' + index + ')');
  //     $oldFile.remove();
  //     this.updateIndex = undefined;
  //   }

  //   // Create file with customizable quality if enabled and not youtube
  //   if (this.field.enableCustomQualityLabel === true && !isProvider) {
  //     fileHtml = '<li class="h5p-av-row">' +
  //       '<div class="h5p-thumbnail">' +
  //         '<div class="h5p-type" title="' + file.mime + '">' + file.mime.split('/')[1] + '</div>' +
  //           '<div role="button" tabindex="0" class="h5p-remove" title="' + H5PEditor.t('core', 'removeFile') + '">' +
  //         '</div>' +
  //       '</div>' +
  //       '<div class="h5p-video-quality">' +
  //         '<div class="h5p-video-quality-title">' + H5PEditor.t('core', 'videoQuality') + '</div>' +
  //         '<label class="h5peditor-field-description" for="' + rowInputId + '">' + H5PEditor.t('core', 'videoQualityDescription') + '</label>' +
  //         '<input id="' + rowInputId + '" class="h5peditor-text" type="text" maxlength="60" value="' + qualityName + '">' +
  //       '</div>' +
  //     '</li>';
  //   }
  //   else {
  //     fileHtml = '<li class="h5p-av-cell">' +
  //       '<div class="h5p-thumbnail">' +
  //         '<div class="h5p-type" title="' + file.mime + '">' + file.mime.split('/')[1] + '</div>' +
  //         '<div role="button" tabindex="0" class="h5p-remove" title="' + H5PEditor.t('core', 'removeFile') + '">' +
  //       '</div>' +
  //     '</li>';
  //   }

  //   // Insert file element in appropriate order
  //   var $file = $(fileHtml);
  //   if (index >= that.$files.children().length) {
  //     $file.appendTo(that.$files);
  //   }
  //   else {
  //     $file.insertBefore(that.$files.children().eq(index));
  //   }

  //   this.$add.parent().find('.h5p-copyright-button').removeClass('hidden');

  //   // Handle thumbnail click
  //   $file
  //     .children('.h5p-thumbnail')
  //     .click(function () {
  //       if (!that.$add.is(':visible')) {
  //         return; // Do not allow editing of file while uploading
  //       }
  //       // Open dialog logic
  //       // that.$addDialog.addClass('h5p-open').find('.h5p-file-url').val(that.params[index].path);
  //       that.updateIndex = index;
  //     });

  //   // Handle remove button click
  //   $file
  //     .find('.h5p-remove')
  //     .click(function () {
  //       if (that.$add.is(':visible')) {
  //         confirmRemovalDialog.show($file.offset().top);
  //       }

  //       return false;
  //     });

  //   // on input update
  //   $file
  //     .find('input')
  //     .change(function () {
  //       file.metadata = { qualityName: $(this).val() };
  //     });

  //   // Create remove file dialog
  //   var confirmRemovalDialog = new H5P.ConfirmationDialog({
  //     headerText: H5PEditor.t('core', 'removeFile'),
  //     dialogText: H5PEditor.t('core', 'confirmRemoval', {':type': 'file'})
  //   }).appendTo(document.body);

  //   // Remove file on confirmation
  //   confirmRemovalDialog.on('confirmed', function () {
  //     that.removeFileWithElement($file);
  //     if (that.$files.children().length === 0) {
  //       that.$add.parent().find('.h5p-copyright-button').addClass('hidden');
  //     }
  //   });
  // };

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
    // this.$activeFiles = this.

    // Check if source is provider (Vimeo, YouTube, Panopto)
    const isProvider = file.path && C.findProvider(file.path);
    const isAudio = this.field.type === 'audio';

    this.$add.toggleClass('hidden', isProvider);

    // If updating remove and recreate element
    if (that.updateIndex !== undefined) {
      var $oldFile = this.$activeFiles.children(':eq(' + index + ')');
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
    console.log("this.$activeFiles", this.$activeFiles);

    // Insert file element in appropriate order
    var $file = $(fileHtml);
    if (index >= this.$activeFiles.children().length) {
      $file.appendTo(this.$activeFiles);
    }
    else {
      $file.insertBefore(that.$activeFiles.children().eq(index));
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
      if (that.$activeFiles.children().length === 0) {
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
      this.$videoUrlErrorContainer.addClass('hidden');
    }

    // Notify change listeners
    for (var i = 0; i < this.changes.length; i++) {
      this.changes[i]();
    }
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
    debugger;
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
  C.createInsertDialog = function (content, disableInsert, id, hasDescription) {
    // return '<div role="button" tabindex="0" id="' + id + '"' + (hasDescription ? ' aria-describedby="' + ns.getDescriptionId(id) + '"' : '') + ' class="h5p-add-file" title="' + H5PEditor.t('core', 'addFile') + '"></div>' +
    return '<div class="h5p-dialog-anchor"><div class="h5p-add-dialog h5p-open">' +
        '<div class="h5p-add-dialog-table">' + content + '</div>' +
        // '<div class="h5p-buttons">' +
          // '<button class="h5peditor-button-textual h5p-insert"' + (disableInsert ? ' disabled' : '') + '>' + H5PEditor.t('core', 'insert') + '</button>' +
          // '<button class="h5peditor-button-textual h5p-cancel">' + H5PEditor.t('core', 'cancel') + '</button>' +
        // '</div>' +
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
    var self = this;
    const isAudio = (type === 'audio');
    // const isAudio = self.field.type === 'audio';
    const firstFile =  Array.isArray(this.params) ? this.params[0] : undefined;
    const isProvider = firstFile?.path && C.findProvider(firstFile.path);
    const copyPasteString = `<span class="h5p-dnd-nowrap"><span class="h5p-dnd__badge">${ns.t('core', 'ctrlKey')}<span class="h5p-dnd__badge__separator"></span>${ns.t('core', 'commandKey')}</span> + <span class="h5p-dnd__badge">${ns.t('core', 'pasteKey')}</span></span>`;
    const dragCopyPasteString = ns.t('core', isAudio ? 'dragAndDropAndPasteAudio' : 'dragAndDropAndPasteVideo', { ':keyCombination': copyPasteString });
    
    switch (tab) {
      case 'BasicFileUpload':
        // // const id = 'av-upload-' + C.getNextId();
        // const id = ns.getNextFieldId(this.field);
        // return '<h3 id="' + id + '">' + H5PEditor.t('core', isAudio ? 'uploadAudioTitle' : 'uploadVideoTitle') + '</h3>' +
        //   '<div class="h5p-file-drop-upload" tabindex="0" role="button" aria-labelledby="' + id + '">' +
        //     '<div class="h5p-file-drop-upload-inner ' + type + '"></div>' +
        //   '</div>';
        return `
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
        </div>
      `;

      


      case 'InputLinkURL':
        // return '<h3>' + H5PEditor.t('core', isAudio ? 'enterAudioTitle' : 'enterVideoTitle') + '</h3>' +
        //   '<div class="h5p-file-url-wrapper ' + type + '">' +
        //     '<input type="text" placeholder="' + H5PEditor.t('core', isAudio ? 'enterAudioUrl' : 'enterVideoUrl') + '" class="h5p-file-url h5peditor-text"/>' +
        //   '</div>' +
        //   (isAudio ? '' : '<div class="h5p-errors"></div><div class="h5peditor-field-description">' + H5PEditor.t('core', 'addVideoDescription') + '</div>');
          return `
          <div class="h5p-dnd__av-container">
            <div class="h5p-dnd__box__url h5p-dnd__box__video-paste">
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
          `; //h5p-dnd__videobox-wrapper h5p-dnd__videobox-wrapper--has-label

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

    // Add when adding record audio
    // for (i = 0; i < extraTabs.length; i++) {
    //   tabs.push(extraTabs[i]);
    // }

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

      // debugger;
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
  // C.createAdd = function (type, id, hasDescription) {
  //   return C.createInsertDialog(
  //     '<div class="h5p-dialog-box">' +
  //       C.createTabContent('BasicFileUpload', type) +
  //     '</div>',

  //     // '<div class="h5p-or-vertical">' +
  //     //   '<div class="h5p-or-vertical-line"></div>' +
  //     //   '<div class="h5p-or-vertical-word-wrapper">' +
  //     //     '<div class="h5p-or-vertical-word">' + H5PEditor.t('core', 'or') + '</div>' +
  //     //   '</div>' +
  //     // '</div>' +
      
  //     // +
  //     // '<div class="h5p-dialog-box">' +
  //     //     C.createTabContent('InputLinkURL', type) +
  //     // '</div>',
  //     false, id, hasDescription);
  // };

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

  return C;
})(H5P.jQuery);