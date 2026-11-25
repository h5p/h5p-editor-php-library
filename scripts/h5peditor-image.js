var H5PEditor = window.H5PEditor = window.H5PEditor || {};
var ns = H5PEditor;

/**
 * Adds an image upload field with image editing tool to the form.
 *
 * @param {Object} parent Parent widget of this widget
 * @param {Object} field Semantic fields
 * @param {Object} params Existing image parameters
 * @param {function} setValue Function for updating parameters
 * @returns {ns.widgets.image}
 */
ns.widgets.image = function (parent, field, params, setValue) {
  var self = this;

  // Initialize inheritance
  ns.File.call(self, parent, field, params, setValue);

  this.parent = parent;
  this.field = field;
  this.params = params;
  this.setValue = setValue;
  this.library = parent.library + '/' + field.name;
  this.id = ns.getNextFieldId(field);

  if (params !== undefined) {
    this.copyright = params.copyright;
  }

  // Keep track of editing image
  this.isEditing = false;

  // Keep track of type of image that is being uploaded
  this.isOriginalImage = false;

  this.changes = [];
  this.passReadies = true;
  parent.ready(function () {
    self.passReadies = false;
  });

  this.confirmationDialog = new H5P.ConfirmationDialog({
    headerText: H5PEditor.t('core', 'removeImage'),
    bodyText: H5PEditor.t('core', 'confirmImageRemoval')
  });

  this.confirmationDialog.on('confirmed', function () {
    self.removeImage();
  });

  // When uploading starts
  self.on('upload', function () {
    // Hide edit image button
    self.$editImage.addClass('hidden');
  });

  // When a new file has been uploaded
  self.on('fileUploaded', function (event) {
    // Uploaded new original image
    if (self.isOriginalImage) {
      delete self.params.originalImage;
      self.editImagePopup.mime = self.params.mime
    }

    // Store width and height
    self.params.width = event.data.width;
    self.params.height = event.data.height;

    // Show edit image button
    self.$editImage.removeClass('hidden');
    self.isEditing = false;
  });
};

ns.widgets.image.prototype = Object.create(ns.File.prototype);
ns.widgets.image.prototype.constructor = ns.widgets.image;

/**
 * Append field to the given wrapper.
 *
 * @param {jQuery} $wrapper
 */
ns.widgets.image.prototype.appendTo = function ($wrapper) {
  var self = this;

  var htmlString = `
    <div class="h5p-dnd__container h5p-dnd__container-image">
      <div class="h5p-dnd__box h5p-dnd__box--is-dashed h5p-dnd__box--image" tabindex="0">
        ${this.getBaseMarkup()}
      </div>
    </div>
    <div class="h5p-editor-dialog">
      <a href="#" class="h5p-close" title="${ns.t('core', 'close')}"></a>
    </div>
    <div class="h5p-sr-only" aria-live="polite"></div>
  `

  if (!this.field.disableCopyright) {
    htmlString += '<button class="h5peditor-button-textual h5p-copyright-button">' + ns.t('core', 'editCopyright') + '</button>';
  }

  htmlString += '</div>' +
    '<div class="h5p-editor-dialog">' +
      '<a href="#" class="h5p-close" title="' + ns.t('core', 'close') + '"></a>' +
    '</div>';

  var html = ns.createFieldMarkup(this.field, htmlString, this.id);
  var $container = ns.$(html).appendTo($wrapper);
  this.detailsTooltip?.remove();
  this.detailsTooltip = ns.initDetailsTooltip($container[0], this.field.details);

  this.$item = $container;
  this.$editImage = $container.find('.h5p-editing-image-button');
  this.$copyrightButton = $container.find('.h5p-copyright-button');
  this.$file = $container.find('.file');
  this.$errors = $container.find('.h5p-errors');
  this.addFile();

  const $dialog = this.$container.find('.h5p-editor-dialog');

  this.$container.on('click', '.h5p-copyright-button, .h5p-editor-dialog .h5p-close', () => {
    $dialog.toggleClass('h5p-open');
    return false;
  });

  var editImagePopup = self.editImagePopup = new H5PEditor.ImageEditingPopup(this.field.ratio);
  editImagePopup.on('savedImage', function (e) {

    // Not editing any longer
    self.isEditing = false;

    // No longer an original image
    self.isOriginalImage = false;

    // Set current source as original image, if no original image
    if (!self.params.originalImage) {
      self.params.originalImage = {
        path: self.params.path,
        mime: self.params.mime,
        height: self.params.height,
        width: self.params.width
      };
    }

    const filenameparts = self.params.path.match(/([^\/]+)\.([^#]+)/);

    // Upload new image
    self.upload(e.data, filenameparts[1] + '-edit.' + filenameparts[2]);
  });

  editImagePopup.on('resetImage', function () {
    editImagePopup.setImage(self.params.originalImage ? self.params.originalImage : self.params);
  });

  editImagePopup.on('canceled', function () {
    self.isEditing = false;
  });

  editImagePopup.on('initialized', function () {
    // Remove throbber from image
    self.$editImage.removeClass('loading');
  });

  $container.find('.h5p-editing-image-button').click(function (event) {
    if (self.params && self.params.path) {
      var imageSrc;
      if (!self.isEditing) {
        imageSrc = self.params;
        self.isEditing = true;
      }
      self.$editImage.toggleClass('loading');

      // Add throbber to image
      editImagePopup.show(ns.$(this).offset(), imageSrc, event);
    }
  });

  ns.File.addCopyright(self, $dialog, function (field, value) {
    if (self.params !== undefined) {
      self.params.copyright = value;
    }
    self.copyright = value;
  });

};

/**
 * Displays the error message to the user.
 *
 * @param {string} message
 */
ns.widgets.image.prototype.setErrorMessage = function (message) {
  if (this.previousState === this.STATE.HAS_IMAGE) {
    this.params = this.previousParams;
    this.addFile();
  } else {
    this.removeImage();
  }

  this.setAriaLiveErrorMessage(message);
  this.boxContainerEl.classList.add('has-error');
  this.boxContainerEl.querySelector('.h5p-errors').innerText = message;
};

ns.widgets.image.prototype.setAriaLiveErrorMessage = function (message) {
  this.ariaLiveEl.innerText = message;
  // Note: Should last long enough for the screen reader to read the text above.
  setTimeout(() => {
    this.ariaLiveEl.innerText = "";
  }, 5000);
};

/**
 * Will either upload or replace (and upload) an image.
 *
 * @param {FileList} files
 */
ns.widgets.image.prototype.uploadOrReplaceImage = function (files) {
  if (typeof this.params !== 'undefined') {
    // Need to make a copy of the file since Firefox loses the reference to it during the confirm replace dialog.
    const filesBackup = [new File([files[0]], files[0].name, { type: files[0].type })];
    this.replaceCallback = () => {
      this.removeImage();
      this.uploadFile(filesBackup);
    };
    this.previousState = this.STATE.HAS_IMAGE;
    this.previousParams = this.params;
    this.confirmReplaceDialog.show(this.$imageDropContainer.offset().top);
  } else {
    this.previousState = this.STATE.NO_IMAGE;
    this.previousParams = null;
    this.uploadFile(files);
  }
};

/**
 * Add drag and drop listeners to the appropriate DOM elements.
 */
ns.widgets.image.prototype.addDragAndDropListeners = function () {
  const boundedHandleDnD = this.handleDragAndDrop.bind(this);

  this.dropBlockEl = this.boxEl.querySelector('.h5p-dnd__box__block');
  this.boxEl.addEventListener('dragenter', boundedHandleDnD);
  this.dropBlockEl.addEventListener('dragover', boundedHandleDnD);
  this.dropBlockEl.addEventListener('dragend', boundedHandleDnD);
  this.dropBlockEl.addEventListener('dragleave', boundedHandleDnD);
  this.dropBlockEl.addEventListener('drop', boundedHandleDnD);
};

/**
 * Upload the first file in the FileList.
 * @todo: handle multiple files?
 *
 * @param {FileList} files
 */
ns.widgets.image.prototype.uploadFile = function (files) {
  if (files.length > 0) {
    this.upload(files[0], files[0].name);
  }
};

/**
 * Handle drag and drop events. Will apply the correct css classes (styling)
 * depending on event type and will handle uploading if the user drops the file.
 *
 * @param {Event} e
 */
ns.widgets.image.prototype.handleDragAndDrop = function (e) {
  e.preventDefault();
  e.stopPropagation();

  const container = e.target.closest('.h5p-dnd__container');
  const boxBlock = container.querySelector('.h5p-dnd__box__block');

  if (e.type === 'dragenter') {
    this.boxEl.classList.add('h5p-dnd__box--is-dragging')
  }
  else if (e.type === 'dragend' || (e.type === 'dragleave' && boxBlock === e.target)) {
	  this.boxEl.classList.remove('h5p-dnd__box--is-dragging');
  }
  else if (e.type === 'drop') {
    this.boxEl.classList.remove('h5p-dnd__box--is-dragging');
    this.uploadOrReplaceImage(e.dataTransfer.files);
  }
};

/**
 * Generates the HTML for the NO_IMAGE state.
 *
 * @returns string The HTML for the NO_IMAGE state
 */
ns.widgets.image.prototype.getBaseMarkup = function () {
  const buttonLabel = ns.t('core', 'dragAndDropAndPasteImageTitleButtonLabel');
  const button = `<button class="h5p-dnd__btn h5p-dnd__btn__upload">${buttonLabel}</button>`;
  const title = ns.t('core', 'dragAndDropAndPasteImageTitle', { ':button': button });
  const description = ns.t('core', 'dragAndDropAndPasteImageDescription');
  return `
    <div class="h5p-dnd__box__block"></div>
    <div class="h5p-dnd__column h5p-dnd__column--is-highlighted h5p-dnd__column--is-fixed h5p-dnd__column--when-wide h5p-dnd__no-x-margin h5p-dnd__box-image">
      <div class="h5p-dnd__upload-image-svg"></div>
    </div>
    <div class="h5p-dnd__column h5p-dnd__column--when-small h5p-dnd__box-image">
      <div class="h5p-dnd__upload-image-svg"></div>
    </div>
    <div class="h5p-dnd__column h5p-dnd_align_left h5p-dnd__box-text">
      <div class="text-center h5p-dnd__title">
        ${title}
      </div>
      <div class="text-muted">
        ${description}
      </div>
      <div class="h5p-errors"></div>
    </div>
  `
};

/**
 * Generates the HTML for the UPLOADING state.
 * @returns string The HTML for the UPLOADING state
 */
ns.widgets.image.prototype.getUploadingMarkup = function () {
  return `
    <div class="h5p-dnd__column h5p-dnd__column--is-full-width">
      <div class="h5p-loader__wrapper">
        <div class="h5p-loader__icon"></div>
      </div>
    </div>
  `;
};

/**
 * Generates the HTML for the HAS_IMAGE state.
 * @returns string The HTML for the HAS_IMAGE state
 */
ns.widgets.image.prototype.getUploadedMarkup = function () {
  const source = H5P.getPath(this.params.path, H5PEditor.contentId);
  const altText = (this.field.label === undefined ? '' : this.field.label);

  return `
      <div class="h5p-dnd__box__block"></div>
      <div class="h5p-dnd__column">
        <div class="h5p-dnd__img__container">
          <div class="h5p-dnd__img__overlay"></div>
          <img class="h5p-dnd__img" src="${source}" alt="${altText}" />
        </div>
      </div>
  `;
};

/**
 * Generates the HTML for the HAS_IMAGE state. This is an extra function needed
 * as this HTML will be placed in a different place than the HTML from getUploadedMarkup().
 * @returns string The HTML for the HAS_IMAGE state
 */
ns.widgets.image.prototype.getImageActionMarkup = function () {
  return `
    <div class="h5p-errors"></div>
    <div class="h5p-editor-image-actions">
      <button class="edit h5p-editing-image-button h5peditor-button-textual" type="button">${ns.t('core', 'editImage')}</button>
      <button class="delete h5p-delete-image-button h5peditor-button-textual" type="button">${ns.t('core', 'deleteLabel')}</button>
      <button class="h5peditor-button-textual h5p-copyright-button">${ns.t('core', 'editCopyright')}</button>
    </div>
  `;
};

/**
 *
 * @param {number} progress 0-100 the progress of uploading the image
 */
ns.widgets.image.prototype.handleUploadProgress = function (progress) {
  // @todo: want to use progress for something?

  // Since this function is called multiple times during upload we only want to trigger
  // the render of the uploading markup once.
  if (this.boxContainerEl.querySelector('.h5p-loader__wrapper') === null) {
    this.setAriaLiveErrorMessage(ns.t('core', 'uploadingImage'));

    this.boxEl.innerHTML = this.getUploadingMarkup();
    this.boxEl.classList.add('h5p-dnd__box--is-uploading');
    this.boxEl.classList.remove('h5p-dnd__box--is-dragging')
  }
};

/**
 * Sync copyright.
 */
ns.widgets.image.prototype.setCopyright = function (value) {
  this.copyright = this.params.copyright = value;
};


/**
 * Creates thumbnail HTML and actions.
 *
 * @returns {boolean} True if file was added, false if file was removed
 */
ns.widgets.image.prototype.addFile = function () {
  var that = this;

  if (this.params === undefined) {
    const error = this.$errors.text();
    if (error) {
      this.setErrorMessage(error);
    }
    return false;
  }

  var source = H5P.getPath(this.params.path, H5PEditor.contentId);
  var altText = (this.field.label === undefined ? '' : this.field.label);
  var fileHtmlString = '<a href="#" id="' + this.id + '" title="' + ns.t('core', 'changeFile') + '" class="thumbnail"';
  if (this.field.description !== undefined) {
    fileHtmlString += ' aria-describedby="' + ns.getDescriptionId(this.id) + '"';
  }
  fileHtmlString += '><img alt="' + altText + '"/></a>' +
    '<a href="#" class="remove" title="' + ns.t('core', 'removeFile') + '"></a>';

  this.$file.html(fileHtmlString)
    .children(':eq(0)')
    .click(function () {
      that.isOriginalImage = true;
      that.openFileSelector();
      return false;
    })
    .children('img')
    .attr('src', source)
    .end()
    .next()
    .click(function () {
      that.confirmRemovalDialog.show(that.$file.offset().top);
      return false;
    });

  var $img = this.$file.find('img');
  $img.one('load', function () {
    // Make editor resize
    $img.addClass('loaded');
  });

  // Uploading original image
  that.$editImage.removeClass('hidden');
  that.$copyrightButton.removeClass('hidden');

  // Notify listeners that image was changed to params
  that.trigger('changedImage', this.params);

  return true;
};

/**
 * Remove image
 */
ns.widgets.image.prototype.removeImage = function () {

  // Notify listeners that we removed image with params
  this.trigger('removedImage', this.params);

  delete this.params;
  this.setValue(this.field);
  this.addFile();

  for (var i = 0; i < this.changes.length; i++) {
    this.changes[i]();
  }
};

/**
 * Validate this item
 */
ns.widgets.image.prototype.validate = function () {
  return true;
};

/**
 * Remove this item.
 */
ns.widgets.image.prototype.remove = function () {
  this.detailsTooltip?.remove();
  // TODO: Check what happens when removed during upload.
  this.$file.parent().remove();
};

/**
 * Collect functions to execute once the tree is complete.
 *
 * @param {function} ready
 */
ns.widgets.image.prototype.ready = function (ready) {
  if (this.passReadies) {
    this.parent.ready(ready);
  }
  else {
    ready();
  }
};
