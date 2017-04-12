var H5PEditor = H5PEditor || {};

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
    this.qualityNameApplicable = ((self.parent.library !== undefined) && (self.parent.library === '/interactiveVideo/video'));

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
      self.$addDialog.removeClass('h5p-open');
    });

    // Handle upload complete
    self.on('uploadComplete', function (event) {
      var result = event.data;

      try {
        if (result.error) {
          throw result.error;
        }

        // Set params if none is set
        if (self.params === undefined) {
          self.params = [];
          self.setValue(self.field, self.params);
        }

        var index = (self.updateIndex !== undefined ? self.updateIndex : self.params.length);
        // remember quality name that has been set already
        var qualityName;
        if ((self.params[index] !== undefined) && (self.params[index].metadata !== undefined)) {
          qualityName = self.params[index].metadata.qualityName;
        }
        else {
          qualityName = self.qualityNameApplicable ? this.$addDialog.find('.h5p-quality-name').val() : undefined;
        }

        // Add a new file/source
        var file = {
          path: result.data.path,
          mime: result.data.mime,
          copyright: self.copyright,
          metadata: {
            qualityName: qualityName
          }

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

    var imageHtml =
      '<div class="file">' + C.createAdd(self.field.type, self.qualityNameApplicable) + '</div>' +
      '<a class="h5p-copyright-button" href="#">' + H5PEditor.t('core', 'editCopyright') + '</a>' +
      '<div class="h5p-editor-dialog">' +
        '<a href="#" class="h5p-close" title="' + H5PEditor.t('core', 'close') + '"></a>' +
      '</div>';

    var html = H5PEditor.createFieldMarkup(this.field, imageHtml);

    var $container = $(html).appendTo($wrapper);
    var $file = $container.children('.file');
    this.$add = $file.children('.h5p-add-file').click(function () {
      self.$addDialog.addClass('h5p-open');
    });

    this.$addDialog = this.$add.next();
    var $url = this.$addDialog.find('.h5p-file-url');
    var $qualityName = self.qualityNameApplicable ? this.$addDialog.find('.h5p-quality-name') : undefined;

    this.$addDialog.find('.h5p-cancel').click(function () {
      self.updateIndex = undefined;
      $url.val('');
      if (self.qualityNameApplicable) {
        $qualityName.val('');
      }
      self.$addDialog.removeClass('h5p-open');
    });

    this.$addDialog.find('.h5p-file-drop-upload')
      .addClass('has-advanced-upload')
      .on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
      })
      .on('dragover dragenter', function(e) {
        $(this).addClass('over');
        e.originalEvent.dataTransfer.dropEffect = 'copy';
      })
      .on('dragleave', function(e) {
        $(this).removeClass('over');
      })
      .on('drop', function(e) {
        self.uploadFiles(e.originalEvent.dataTransfer.files);
      })
      .click(function () {
        self.openFileSelector();
      });

    this.$addDialog.find('.h5p-insert').click(function () {
      self.useUrl($url.val().trim(), self.qualityNameApplicable ? $qualityName.val().trim() : '');
      self.$addDialog.removeClass('h5p-open');
      $url.val('');
      if (self.qualityNameApplicable) {
        $qualityName.val('');
      }
    });

    this.$errors = $container.children('.h5p-errors');

    if (this.params !== undefined) {
      for (var i = 0; i < this.params.length; i++) {
        this.addFile(i);
      }
    }

    var $dialog = $container.find('.h5p-editor-dialog');
    $container.find('.h5p-copyright-button').add($dialog.find('.h5p-close')).click(function () {
      $dialog.toggleClass('h5p-open');
      return false;
    });

    var group = new H5PEditor.widgets.group(self, H5PEditor.copyrightSemantics, self.copyright, function (field, value) {
      self.setCopyright(value);
    });
    group.appendTo($dialog);
    group.expand();
    group.$group.find('.title').remove();
    this.children = [group];
  };

  /**
   * Add file icon with actions.
   *
   * @param {Number} index
   */
  C.prototype.addFile = function (index) {
    var that = this;
    var file = this.params[index];

    if (that.updateIndex !== undefined) {
      this.$add.parent().children(':eq(' + index + ')').find('.h5p-type').attr('title', file.mime).text(file.mime.split('/')[1]);
      this.updateIndex = undefined;
      return;
    }

    var $file = $('<div class="h5p-thumbnail"><div class="h5p-type" title="' + file.mime + '">' + file.mime.split('/')[1] + '</div><div role="button" tabindex="0" class="h5p-remove" title="' + H5PEditor.t('core', 'removeFile') + '"></div></div>')
      .insertBefore(this.$add)
      .click(function () {
        if (!that.$add.is(':visible')) {
          return; // Do not allow editing of file while uploading
        }
        that.$addDialog.addClass('h5p-open').find('.h5p-file-url').val(that.params[index].path);
        if ((that.params[index].metadata !== undefined) && (that.params[index].metadata.qualityName !== undefined)) {
          that.$addDialog.find('.h5p-quality-name').val(that.params[index].metadata.qualityName);
        }
        that.updateIndex = index;
      })
      .children('.h5p-remove')
        .click(function () {
          if (that.$add.is(':visible')) {
            confirmRemovalDialog.show($file.offset().top);
          }

          return false;
        })
        .end();

    // Create remove file dialog
    var confirmRemovalDialog = new H5P.ConfirmationDialog({
      headerText: H5PEditor.t('core', 'removeFile'),
      dialogText: H5PEditor.t('core', 'confirmRemoval', {':type': 'file'})
    }).appendTo(document.body);

    // Remove file on confirmation
    confirmRemovalDialog.on('confirmed', function () {
      // Remove from params.
      if (that.params.length === 1) {
        delete that.params;
        that.setValue(that.field);
      }
      else {
        that.params.splice(index, 1);
      }

      $file.remove();

      for (var i = 0; i < that.changes.length; i++) {
        that.changes[i]();
      }
    });
  };

  C.prototype.useUrl = function (url, qualityName) {
    console.log('useUrl');
    console.log(qualityName);
    if (this.params === undefined) {
      this.params = [];
      this.setValue(this.field, this.params);
    }

    var mime;
    var matches = url.match(/\.(webm|mp4|ogv|m4a|mp3|ogg|oga|wav)/i);
    if (matches !== null) {
      mime = matches[matches.length - 1];
    }
    else {
      // Try to find a provider
      for (var i = 0; i < C.providers.length; i++) {
        if (C.providers[i].regexp.test(url)) {
          mime = C.providers[i].name;
          break;
        }
      }
    }
    // Add a new file/source
    var file = {
      path: url,
      mime: this.field.type + '/' + (mime ? mime : 'unknown'),
      copyright: this.copyright,
      metadata: {
        qualityName: (qualityName !== "" ? qualityName : undefined)
      }
    };
    var index = (this.updateIndex !== undefined ? this.updateIndex : this.params.length);
    this.params[index] = file;
    this.addFile(index);

    for (var i = 0; i < this.changes.length; i++) {
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
    // TODO: Check what happens when removed during upload.
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
   * HTML for add button.
   *
   * @param {string} type 'video' or 'audio'
   * @returns {string} HTML
   */
  C.createAdd = function (type, qualityNameApplicable) {
    var inputPlaceholder = H5PEditor.t('core', type === 'audio' ? 'enterAudioUrl' : 'enterVideoUrl');
    var inputTitle = H5PEditor.t('core', type === 'audio' ? 'enterAudioTitle' : 'enterVideoTitle');
    var uploadTitle = H5PEditor.t('core', type === 'audio' ? 'uploadAudioTitle' : 'uploadVideoTitle')
    var description = (type === 'audio' ? '' : '<div class="h5p-errors"></div><div class="h5peditor-field-description">' + H5PEditor.t('core', 'addVideoDescription') + '</div>');

    // allow to set quality name for content type 'interactive video' only
    var qualityNameInput = '';

    if (qualityNameApplicable) {
      var inputPlaceholderQualityName = H5PEditor.t('core', 'enterQualityName');
      var titleQualityName = H5PEditor.t('core', 'titleQualityName');
      var descriptionQualityName = '<div class="h5p-errors"></div><div class="h5peditor-field-description">' + H5PEditor.t('core', 'addQualityNameDescription') + '</div>';
      qualityNameInput =
        '<div class="h5p-or-horizontal">' +
          '<div class="h5p-or-horizontal-line"></div>' +
          '<div class="h5p-or-horizontal-word-wrapper">' +
            '<div class="h5p-or-horizontal-word">' + H5PEditor.t('core', 'and') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="h5p-add-dialog-quality-name">' +
          '<div class="h5p-dialog-box">' +
            '<h3>' + titleQualityName + '</h3>' +
            '<div class="h5p-quality-name-wrapper">' +
              '<input type="text" placeholder="' + inputPlaceholderQualityName + '" class="h5p-quality-name h5peditor-text"/>' +
            '</div>' +
            descriptionQualityName +
          '</div>' +
        '</div>';
    }

    return '<div role="button" tabindex="0" class="h5p-add-file" title="' + H5PEditor.t('core', 'addFile') + '"></div>' +
      '<div class="h5p-add-dialog">' +
        '<div class="h5p-add-dialog-table">' +
          '<div class="h5p-dialog-box">' +
            '<h3>' + uploadTitle + '</h3>' +
            '<div class="h5p-file-drop-upload">' +
              '<div class="h5p-file-drop-upload-inner"/>' +
              '</div>' +
            '</div>' +
            '<div class="h5p-or-vertical">' +
              '<div class="h5p-or-vertical-line"></div>' +
              '<div class="h5p-or-vertical-word-wrapper">' +
              '<div class="h5p-or-vertical-word">' + H5PEditor.t('core', 'or') + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="h5p-dialog-box">' +
            '<h3>' + inputTitle + '</h3>' +
            '<div class="h5p-file-url-wrapper">' +
              '<input type="text" placeholder="' + inputPlaceholder + '" class="h5p-file-url h5peditor-text"/>' +
            '</div>' +
            description +
          '</div>' +
        '</div>' +
        qualityNameInput +
        '<div class="h5p-buttons">' +
          '<button class="h5peditor-button-textual h5p-insert">' + H5PEditor.t('core', 'insert') + '</button>' +
          '<button class="h5peditor-button-textual h5p-cancel">' + H5PEditor.t('core', 'cancel') + '</button>' +
        '</div>' +
      '</div>';
  };

  /**
   * Providers incase mime type is unknown.
   * @public
   */
  C.providers = [{
    name: 'YouTube',
    regexp: /^https?:\/\/((youtu.|y2u.)?be|(www.|m.)?youtube.com)\//i
  }];

  return C;
})(H5P.jQuery);
