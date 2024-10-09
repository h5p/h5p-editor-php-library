H5PEditor.FileUploader = (function ($, EventDispatcher) {

  /**
   * File Upload API for H5P
   *
   * @class H5PEditor.FileUploader
   * @extends H5P.EventDispatcher
   * @param {Object} field Required for validating the uploaded file
   */
  function FileUploader(field) {
    var self = this;

    // Initialize event inheritance
    EventDispatcher.call(self);

    /**
     * Triggers the actual upload of the file.
     *
     * @param {Blob|File} file
     * @param {string} filename Required due to validation
     */
    self.upload = function (file, filename, context = {}) {
      // First check if file is too large
      const { sizeLimit, sizeLimitText } = getSizeLimitAndText(file);

      if (isFileTooLarge(file, sizeLimit)) {
        const uploadComplete = {
          ...context,
          error: H5PEditor.t('core', 'fileToLarge', { ':sizeLimit': sizeLimitText }),
        };
        self.trigger('uploadComplete', uploadComplete);
        return;
      }
      var formData = new FormData();
      formData.append('file', file, filename);
      formData.append('field', JSON.stringify(field));
      formData.append('contentId', H5PEditor.contentId || 0);

      // Submit the form
      var request = new XMLHttpRequest();
      request.onerror = function () {
        var uploadComplete = {
          ...context,
          error: H5PEditor.t('core', 'unknownFileUploadError'),
          data: null
        };
        self.trigger('uploadComplete', uploadComplete);
      }
      request.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          self.trigger('uploadProgress', {
            ...context,
            progress: (e.loaded / e.total)
          });
        }
      };
      request.onload = function () {
        var result;
        var uploadComplete = {
          ...context,
          error: null,
          data: null
        };

        try {
          result = JSON.parse(request.responseText);
        }
        catch (err) {
          H5P.error(err);
          // Add error data to event object
          uploadComplete.error = H5PEditor.t('core', 'fileToLarge');
        }

        if (result !== undefined) {
          if (result.error !== undefined) {
            uploadComplete.error = result.error;
          }
          if (result.success === false) {
            uploadComplete.error = (result.message ? result.message : H5PEditor.t('core', 'unknownFileUploadError'));
          }
        }

        if (uploadComplete.error === null) {
          // No problems, add response data to event object
          uploadComplete.data = result;
          uploadComplete.data.title = filename;
        }

        // Allow the widget to process the result
        self.trigger('uploadComplete', uploadComplete);
      };

      request.open('POST', H5PEditor.getAjaxUrl('files'), true);
      request.send(formData);
      self.trigger('upload');
    };

    /**
     * Upload the list of file objects.
     * TODO: Future improvement, iterate for multiple files
     *
     * @param {File[]} files
     */
    self.uploadFiles = function (files, context = {}) {
      self.upload(files[0], files[0].name, context);
    };

    /**
     * Open the file selector and trigger upload upon selecting file.
     */
    self.openFileSelector = function ({ onChangeCallback, context } = {}) {
      // Create a file selector
      const input = document.createElement('input');
      input.type = 'file';
      input.setAttribute('accept', determineAllowedMimeTypes());
      input.style='display:none';
      input.addEventListener('change', function () {
        if (typeof onChangeCallback === 'function') {
          onChangeCallback();
        }
        // When files are selected, upload them
        self.uploadFiles(this.files, context);
        document.body.removeChild(input);
      });

      document.body.appendChild(input);
      // Open file selector
      input.click();
    };

    /**
     * Determine allowed file mimes. Used to make it easier to find and
     * select the correct file.
     *
     * @return {string}
     */
    const determineAllowedMimeTypes = function () {
      if (field.mimes) {
        return field.mimes.join(',');
      }

      switch (field.type) {
        case 'image':
          return 'image/jpeg,image/png,image/gif';
        case 'audio':
          return 'audio/mpeg,audio/x-wav,audio/ogg,audio/mp4';
        case 'video':
          return 'video/mp4,video/webm,video/ogg';
      }
    }

    /**
     * Check if the file is a video.
     *
     * @param {string} mimeType - The MIME type of the file.
     * @return {boolean} - Returns true if the file is a video, false otherwise.
     */
    const isVideoFile = function (mimeType) {
      return mimeType.startsWith('video/');
    }

    /**
     * Get the size limit and its text based on the file type.
     *
     * @param {Object} file - The file object.
     * @param {string} file.type - The MIME type of the file.
     * @return {Object} - An object containing the size limit and its text.
     * @return {number} sizeLimit - The size limit in bytes.
     * @return {string} sizeLimitText - The size limit text.
     */
    const getSizeLimitAndText = function (file) {
      // Define size limits
      const VIDEO_SIZE_LIMIT = 2147483648; // 2 GB
      const AUDIO_IMAGE_SIZE_LIMIT = 20971520; // 20 MB
      
      const videoSizeLimitText = H5PEditor.t('core', 'videoSizeLimit');
      const audioImageSizeLimitText = H5PEditor.t('core', 'audioImageSizeLimit');

      if (isVideoFile(file.type)) {
        return { sizeLimit: VIDEO_SIZE_LIMIT, sizeLimitText: videoSizeLimitText };
      } else {
        return { sizeLimit: AUDIO_IMAGE_SIZE_LIMIT, sizeLimitText: audioImageSizeLimitText };
      }
    }

    /**
     * Function to check if the file size exceeds the limit.
     *
     * @param {Object} file - The file object.
     * @param {number} file.size - The size of the file in bytes.
     * @param {number} sizeLimit - The size limit in bytes.
     * @return {boolean} - Returns true if the file size exceeds the limit, false otherwise.
     */
    const isFileTooLarge = function (file, sizeLimit) {
      return file.size > sizeLimit;
    }
  }

  // Extends the event dispatcher
  FileUploader.prototype = Object.create(EventDispatcher.prototype);
  FileUploader.prototype.constructor = FileUploader;

  return FileUploader;
})(H5P.jQuery, H5P.EventDispatcher);
