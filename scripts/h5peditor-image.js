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
  this.previousState = typeof params === 'undefined' ? this.STATE.NO_IMAGE : this.STATE.HAS_IMAGE;
  this.previousParams = params;

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
    dialogText: H5PEditor.t('core', 'confirmImageRemoval')
  }).appendTo(document.body);

  this.confirmationDialog.on('confirmed', function () {
    self.boxEl.classList.remove('h5p-dnd__box--has-image', 'h5p-dnd__box--is-inline');
    self.previousState = self.STATE.NO_IMAGE;
    self.removeImage();
  });

  this.replaceCb = () => {};
  this.confirmReplaceDialog = new H5P.ConfirmationDialog({
    headerText: H5PEditor.t('core', 'replaceImage'),
    dialogText: H5PEditor.t('core', 'confirmReplaceImage')
  }).appendTo(document.body);

  this.confirmReplaceDialog.on('confirmed', function () {
    self.replaceCb();
  });

  // When uploading starts
  self.on('upload', function () {
    // Hide edit image button
    self.$editImage.addClass('hidden');
  });

  // When a new file has been uploaded
  self.on('fileUploaded', function (event) {
    self.boxContainerEl.classList.remove('has-error');
    // Uploaded new original image
    if (self.isOriginalImage) {
      delete self.params.originalImage;
      self.editImagePopup.mime = self.params.mime;
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
    <div class="h5p-dnd__container">
      <div class="h5p-dnd__box h5p-dnd__box--is-dashed" tabindex="0">
        ${this.getBaseMarkup()}
      </div>
    </div>
    <div class="h5p-editor-image-buttons">
      ${!this.field.disableCopyright ? (
        `<button class="h5peditor-button-textual h5p-copyright-button">${ns.t('core', 'editCopyright')}</button>`
      ): ''} 
    </div>
    <div class="h5p-editor-dialog">
      <a href="#" class="h5p-close" title="${ns.t('core', 'close')}"></a>'
    </div>
    <div class="h5p-sr-only" aria-live="polite"></div>
  `

  const markup = ns.createLabel(this.field, '', this.id) + ns.createDescription(this.field.description, this.id) + htmlString;
  const wrapperClasses = ns.joinNonEmptyStrings(['field', `field-name-${this.field.name}`, this.field.type, ns.createImportance(this.field.importance), this.field.widget]);
  const html = `<div class="${wrapperClasses}">${markup}</div>`;

  this.$container = ns.$(html).appendTo($wrapper);
  this.$imageDropContainer = this.$container.find('.h5p-dnd__container');
  this.boxEl = this.$container.find(".h5p-dnd__box").get(0);
  this.boxContainerEl = this.$container.find('.h5p-dnd__container').get(0);
  
  this.ariaLiveEl = this.$container.find('.h5p-sr-only').get(0);

  this.addDragAndDropListeners();

  this.$editImage = this.$container.find('.h5p-editing-image-button');
  this.$copyrightButton = this.$container.find('.h5p-copyright-button');
  this.$file = this.$container.find('.file');
  
  this.$errors = this.$container.find('.h5p-errors');
  this.addFile();
  
  var $dialog = this.$container.find('.h5p-editor-dialog');
  this.$container.find('.h5p-copyright-button').add($dialog.find('.h5p-close')).click(function () {
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

    self.removeImage();
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

  this.$container.on('click', '.edit', function (event) {
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

  this.$container.on('click', '.h5p-dnd__btn__upload', (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.isOriginalImage = true;
    this.openFileSelector();
  });

  document.addEventListener('paste', (e) => {
    if (document.activeElement.closest('.h5p-dnd__box') === this.boxEl) {
      if (e.clipboardData.files.length === 0) {
        this.boxContainerEl.classList.add("has-error");
        this.$container.find('.h5p-errors').text(ns.t('core', 'onlyPasteImageFiles'));
        this.setAriaLiveErrorMessage(ns.t('core', 'onlyPasteImageFiles'));
      } else {
        this.uploadOrReplaceImage(e.clipboardData.files);
      }
    }
  });

  this.boxEl.addEventListener('keydown', (e) => {
    if (this.boxEl.classList.contains('h5p-dnd__box--has-image')) {
      if ((e.code === 'Space' || e.code === 'Enter')) {
        this.isOriginalImage = true;
        this.openFileSelector();
      }
    }
  });

  this.boxEl.addEventListener('click', (e) => {
    e.preventDefault();
    const imageContainerEl = this.boxEl.querySelector('.h5p-dnd__img__container');
    
    // Only trigger file selector when we have an image and the user is actually clicking on the
    // image (not the frame around).
    if (this.boxEl.classList.contains('h5p-dnd__box--has-image')
      && e.target.closest('.h5p-dnd__img__container') === imageContainerEl) {
      this.isOriginalImage = true;
      this.openFileSelector();
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
  this.$container.find('.h5p-errors').text(message);
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
    this.replaceCb = () => {
      this.removeImage();
      this.uploadFile(filesBackup);
    };
    this.previousState = this.STATE.HAS_IMAGE;
    this.previousParams = this.params;
    this.confirmReplaceDialog.show(this.$imageDropContainer.offset().top);
  } else {
    this.previousState.NO_IMAGE;
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
  return `
    <div class="h5p-dnd__box__block"></div>
    <div class="h5p-dnd__column h5p-dnd__column--is-highlighted h5p-dnd__column--is-fixed h5p-dnd__column--hide-when-focus">
      ${this.getImageUploadSvg()}
      <button class="h5p-dnd__btn h5p-dnd__btn__upload" type="button">${ns.t('core', 'uploadImage')}</button>
    </div>

    <div class="h5p-dnd__column h5p-dnd__column--hide-when-focus">
      <div>
        ${ns.t('core', 'dragAndDropAndPasteImage')} <span class="h5p-dnd__pill">ctrl</span> + <span class="h5p-dnd__pill">v</span>
      </div>
      <div class="h5p-errors"></div>
    </div>
    
    <div class="h5p-dnd__column h5p-dnd__column--is-highlighted h5p-dnd__column--show-when-focus h5p-dnd__column--is-full-width">
      ${ns.t('core', 'dropImage')}
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
          <div class="h5p-dnd__img__overlay" aria-label="${ns.t('core', 'uploadImage')}"></div>
          <img class="h5p-dnd__img" src="${source}" alt="${altText}" />
        </div>
      </div>
      <div class="h5p-dnd__column h5p-dnd__column--show-when-focus">
        <div class="h5p-dnd__text">
          ${ns.t('core', 'dragAndDropAndPasteReplaceImage')}
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
 * @returns {boolean} True if file was added
 */
ns.widgets.image.prototype.addFile = function () {
  if (this.params === undefined) {
    return false;
  }
  
  this.boxEl.classList.add('h5p-dnd__box--is-inline','h5p-dnd__box--has-image')
  this.boxEl.classList.remove('h5p-dnd__box--is-uploading');
  this.boxEl.innerHTML = this.getUploadedMarkup();
  this.boxEl.setAttribute('role', 'button');
  // We cannot use aria-labelledby + aria-describedby because NVDA ignores the
  // aria-describedby attribute. So the solution is to create an aria-label that
  // is the combination of aria-labelledby and aria-describedby.
  const altText = (this.field.label === undefined ? '' : this.field.label);
  const ariaLabel = `${altText ?? ns.t('core', 'image')}. ${ns.t('core', 'dragAndDropAndPasteReplaceImage')}`;
  this.boxEl.setAttribute('aria-label', ariaLabel);
  const actionsContainerEl = document.createElement('div');
  actionsContainerEl.classList.add('h5p-image-action-container');
  actionsContainerEl.innerHTML = this.getImageActionMarkup();

  this.boxContainerEl.insertBefore(actionsContainerEl, this.boxEl.nextElementSibling);

  this.boxContainerEl.querySelector('.delete').addEventListener('click', (e) => {
    e.stopPropagation();
    this.confirmationDialog.show(this.$imageDropContainer.offset().top);
  });

  this.cleanUp();
  this.addDragAndDropListeners();

  // Notify listeners that image was changed to params
  this.trigger('changedImage', this.params);

  return true;
};

/**
 * Remove image
 */
ns.widgets.image.prototype.removeImage = function () {
  this.boxEl.classList.remove('h5p-dnd__box--is-uploading');
  this.boxContainerEl.classList.remove('has-error');
  this.cleanUp();
  // Notify listeners that we removed image with params
  this.trigger('removedImage', this.params);

  const actionsContainerEl = this.$container.find('.h5p-image-action-container').get(0);
  if (actionsContainerEl) {
    actionsContainerEl.remove();
  }

  delete this.params;
  this.setValue(this.field);

  this.boxEl.removeAttribute('role');
  this.boxEl.innerHTML = this.getBaseMarkup();

  this.addDragAndDropListeners();

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
  // TODO: Check what happens when removed during upload.
  this.$file.parent().remove();
};

ns.widgets.image.prototype.cleanUp = function () {
  const boundedHandleDnD = this.handleDragAndDrop.bind(this);

  this.boxEl.removeEventListener('dragenter', boundedHandleDnD);
  this.dropBlockEl?.removeEventListener('dragover', boundedHandleDnD);
  this.dropBlockEl?.removeEventListener('dragend', boundedHandleDnD);
  this.dropBlockEl?.removeEventListener('dragleave', boundedHandleDnD);
  this.dropBlockEl?.removeEventListener('drop', boundedHandleDnD);
}

ns.widgets.image.prototype.getImageUploadSvg = function () {
  return `
    <svg style="margin-bottom: 10px;" width="60" height="43" viewBox="0 0 60 43" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38.6712 35.0989C38.6308 34.9924 38.6038 34.8993 38.5769 34.7929H12.6692C10.6348 34.7929 8.97769 33.5423 8.5331 31.6931C8.43879 31.2674 8.39837 30.9082 8.39837 30.6022C8.3849 22.2076 8.3849 13.6667 8.3849 5.40516C8.3849 4.8198 8.49268 4.26105 8.69477 3.76881C8.60046 3.75551 8.50615 3.74221 8.41184 3.75551C8.30406 3.76881 8.19628 3.79542 8.10198 3.83533C7.846 3.95506 7.63044 4.18123 7.52266 4.48721C7.48224 4.59364 7.45529 4.70007 7.42835 4.8065C6.4718 8.25214 2.82074 21.8218 1.87766 25.2808C1.47348 26.7442 1.05583 28.2209 0.638184 29.6843V30.9215C0.665129 30.9747 0.705546 31.0279 0.719019 31.0812C1.10972 32.8106 2.18753 33.8616 3.89854 34.3139C8.41184 35.498 12.9117 36.6953 17.425 37.8793C23.3798 39.4624 29.3482 41.0323 35.3031 42.6021C37.5395 43.1875 39.6816 41.9901 40.3418 39.8083C40.4496 39.4624 40.5439 39.1166 40.6382 38.784C39.8702 37.7995 39.2505 36.682 38.8059 35.498C38.752 35.3649 38.7116 35.2319 38.6712 35.0989Z" fill="#C4D9EE"/>
      <path d="M18.443 7.75C18.4176 7.75 18.4049 7.75 18.3795 7.75C18.3287 7.75 18.2907 7.75 18.2399 7.75C16.1066 7.82643 14.3924 9.57166 14.3797 11.7245C14.367 12.7946 14.7733 13.7882 15.5352 14.5525C16.2844 15.3169 17.2875 15.7373 18.3541 15.75H18.3795C19.4589 15.75 20.462 15.3296 21.2112 14.5653C21.9604 13.801 22.3794 12.8073 22.3794 11.7373C22.3667 9.55892 20.6144 7.78822 18.443 7.75ZM18.3795 14.1194C17.0843 14.1194 16.0304 13.0494 16.0304 11.75C16.0304 10.4761 16.9955 9.46975 18.2399 9.39331C18.2907 9.39331 18.3287 9.38057 18.3795 9.38057C18.4049 9.38057 18.4176 9.38057 18.443 9.38057C19.7001 9.41879 20.7287 10.4634 20.7287 11.7373C20.7287 13.0621 19.6747 14.1194 18.3795 14.1194Z" fill="#3B435A"/>
      <path d="M7.65175 30.5084C7.65175 30.8181 7.69244 31.1817 7.78739 31.6126C8.23503 33.4843 9.90348 34.75 11.9517 34.75H38.023C38.023 34.7365 38.0095 34.7096 38.0095 34.6961C37.8467 34.1441 37.7246 33.5785 37.6297 32.9995H12.0603C11.1514 32.9995 10.5139 32.7437 10.0256 32.1916L9.93061 32.0839L9.74071 31.8684L9.7814 31.8146L9.99844 31.5183C10.0391 31.4779 10.0663 31.4375 10.0934 31.4106C10.107 31.3837 10.1205 31.3702 10.1341 31.3567L10.1612 31.3298L10.1883 31.3029L10.2969 31.1682C13.2404 28.2462 16.2924 25.2165 19.2902 22.2542C19.5751 21.9848 19.9413 21.6751 20.4297 21.6751C20.918 21.6751 21.2978 21.9849 21.5827 22.2676C22.7085 23.3718 23.848 24.5029 24.9603 25.607L25.001 25.6474C25.3401 25.9841 25.6385 26.1456 25.8962 26.1456C25.9098 26.1456 25.9098 26.1456 25.9098 26.1726C26.1675 26.1591 26.4524 25.9706 26.7779 25.5801C29.4637 22.3888 32.5836 18.6993 35.5678 15.131C35.9612 14.6732 36.341 14.4443 36.748 14.4443C37.1549 14.4443 37.5347 14.6597 37.901 15.0906C39.5287 16.9623 41.2107 18.9013 42.8792 20.8403C42.9877 20.773 43.0827 20.6922 43.1912 20.6249C43.2997 20.5575 43.4082 20.4902 43.5032 20.4229C43.8016 20.2344 44.1136 20.0593 44.4391 19.9112C44.0186 19.4264 43.6117 18.9551 43.1912 18.4704C41.9025 16.9623 40.5461 15.4003 39.2303 13.8787C38.4978 13.0439 37.6568 12.613 36.7615 12.613C36.3275 12.613 35.8934 12.7072 35.4729 12.9227C35.0253 13.1381 34.5776 13.5151 34.1842 13.973C32.9634 15.4138 31.729 16.8815 30.5353 18.2953C29.8029 19.1571 29.0839 20.0189 28.365 20.8672C27.7003 21.6617 27.0085 22.4831 26.3167 23.291C26.2353 23.3852 26.1675 23.4526 26.1133 23.5064L25.7334 23.8835L25.3536 23.5064L25.001 23.1563L24.6483 22.7928C24.4855 22.6312 24.3227 22.4696 24.16 22.308C23.6988 21.8367 23.2511 21.4058 22.7899 20.9615C22.0981 20.2748 21.2842 19.9112 20.4432 19.9112C19.6158 19.9112 18.8019 20.2882 18.083 20.9884C15.682 23.3583 12.9691 26.0379 10.324 28.6771L9.40159 29.6062V28.3001V5.1801C9.40159 3.38921 10.324 2.48703 12.1417 2.48703H46.094C47.9253 2.48703 48.8612 3.40267 48.8612 8.6003V18.6185C49.1868 18.5916 49.5259 18.5647 49.865 18.5512C49.9599 18.5512 50.0549 18.5377 50.1499 18.5377C50.177 18.5377 50.2177 18.5377 50.2448 18.5377C50.3669 18.5377 50.5025 18.5377 50.6246 18.5512H50.6382C50.6382 13.6363 50.6382 8.16941 50.6246 4.27792L50.5975 4.25099L50.5568 4.11634C49.9193 1.78683 48.5357 0.75 46.094 0.75H12.1688C11.8025 0.75 11.3685 0.75 11.0022 0.817327C9.53724 1.11356 8.4385 2.04267 7.95017 3.34881C7.76027 3.84703 7.65175 4.41257 7.63818 5.00505C7.63818 13.367 7.63818 22.0118 7.65175 30.5084Z" fill="#3B435A"/>
      <path d="M50.7578 24.75H49.3794H49.1091H48.8389H47.974V28.8632H47.028H46.7443H46.4875H43.8794V30.7574V31.028V31.2986V31.6504H47.8253H47.974V31.8669V32.2863V35.75H50.7578V31.6504H54.8794V28.8632H50.7578V24.75Z" fill="#277ACA"/>
      <path d="M49.7077 19.7634C49.6139 19.7634 49.5335 19.7634 49.4397 19.75C49.4129 19.75 49.3995 19.75 49.3727 19.75C49.3057 19.75 49.2387 19.75 49.1717 19.75C48.5686 19.7634 47.9923 19.8171 47.4161 19.9243C47.3357 19.9377 47.2419 19.9511 47.1615 19.978C47.0811 19.9914 46.9872 20.0182 46.9068 20.0316C46.5316 20.1255 46.1564 20.2328 45.7945 20.3669C45.7007 20.3937 45.6203 20.4339 45.5265 20.4741C45.4327 20.5144 45.3523 20.5412 45.2585 20.5814C44.6956 20.8228 44.1595 21.1178 43.6503 21.4397C43.5699 21.4933 43.5029 21.5335 43.4359 21.5872C43.3689 21.6408 43.2885 21.6944 43.2214 21.7347C40.5948 23.6523 38.8794 26.75 38.8794 30.2366C38.8794 30.3171 38.8794 30.3975 38.8794 30.478C38.8794 30.5718 38.8794 30.6523 38.8928 30.7462C38.8928 30.84 38.9062 30.9205 38.9062 31.0144C38.9196 31.1216 38.9196 31.2289 38.933 31.3362C38.9866 31.819 39.067 32.3017 39.1876 32.7577C39.2144 32.8381 39.2278 32.932 39.2546 33.0125C39.2814 33.1063 39.3082 33.2002 39.335 33.2941C39.402 33.4952 39.4691 33.7098 39.5361 33.9109C41.0236 37.9071 44.8698 40.75 49.3727 40.75C55.1621 40.75 59.8794 36.0297 59.8794 30.2366C59.8794 24.5776 55.3497 19.9377 49.7077 19.7634ZM49.3727 39.1676C45.5399 39.1676 42.27 36.727 41.0236 33.3209C40.9834 33.227 40.9566 33.1331 40.9298 33.0393C40.903 32.9588 40.8762 32.8649 40.8494 32.7845C40.6886 32.2213 40.568 31.6446 40.5144 31.0412C40.501 30.9473 40.501 30.8669 40.4876 30.773C40.4876 30.6791 40.4742 30.5987 40.4742 30.5048C40.4742 30.4243 40.4742 30.3439 40.4742 30.2634C40.4742 27.2596 41.9751 24.591 44.2668 22.9818C44.3338 22.9282 44.4142 22.8745 44.4812 22.8343C44.5616 22.7807 44.6286 22.7404 44.709 22.6868C45.2317 22.3649 45.7945 22.0967 46.3708 21.8822C46.4646 21.8554 46.5584 21.8151 46.6388 21.7883C46.813 21.7347 46.9738 21.681 47.1481 21.6408C47.2285 21.614 47.3223 21.6006 47.4027 21.5872C47.9655 21.4531 48.5552 21.386 49.1583 21.3726C49.2253 21.3726 49.2923 21.3726 49.3593 21.3726C49.3861 21.3726 49.3995 21.3726 49.4263 21.3726C49.5201 21.3726 49.6005 21.3726 49.6943 21.386C54.4518 21.5603 58.2578 25.4761 58.2578 30.2768C58.2712 35.1715 54.2776 39.1676 49.3727 39.1676Z" fill="#277ACA"/>
    </svg>
  `;
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

/**
 * Lazy load images
 */
ns.widgets.imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
      ns.widgets.imageObserver.unobserve(entry.target);
    }
  });
});

ns.widgets.image.prototype.STATE = {
  NO_IMAGE: 'NO_IMAGE',
  UPLOADING: 'UPLOADING',
  HAS_IMAGE: 'HAS_IMAGE'
};
