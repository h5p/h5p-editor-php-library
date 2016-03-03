var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

/**
 * Adds a file upload field to the form.
 *
 * @param {mixed} parent
 * @param {object} field
 * @param {mixed} params
 * @param {function} setValue
 * @returns {ns.File}
 */
ns.widgets.image = function (parent, field, params, setValue) {
  var self = this;
  console.log("image", field, params);

  this.parent = parent;
  this.field = field;
  this.params = params;
  this.setValue = setValue;
  this.library = parent.library + '/' + field.name;

  if (params !== undefined) {
    this.copyright = params.copyright;
  }

  // Keep track of editing image
  this.isEditing = false;

  this.changes = [];
  this.passReadies = true;
  parent.ready(function () {
    self.passReadies = false;
  });
};

/**
 * Append field to the given wrapper.
 *
 * @param {jQuery} $wrapper
 * @returns {undefined}
 */
ns.widgets.image.prototype.appendTo = function ($wrapper) {
  var self = this;
  ns.File.addIframe();

  var label = '';
  if (this.field.label !== 0) {
    var labelString = this.field.label === undefined ? this.field.name : this.field.label;
    label = '<span class="h5peditor-label">' + labelString + '</span>';
  }

  var htmlString = label + '<div class="file"></div>' +
    '<div class="h5p-editor-image-buttons">' +
      '<button class="h5p-editing-image-button">' + ns.t('core', 'editImage') + '</button>' +
      '<a class="h5p-copyright-button" href="#">' + ns.t('core', 'editCopyright') + '</a>' +
    '</div>' +
    '<div class="h5p-editor-dialog">' +
      '<a href="#" class="h5p-close" title="' + ns.t('core', 'close') + '"></a>' +
    '</div>';

  var html = ns.createItem(this.field.type, htmlString, this.field.description);
  var $container = ns.$(html).appendTo($wrapper);
  this.$file = $container.find('.file');
  this.$errors = $container.find('.h5p-errors');
  this.addFile();

  var $dialog = $container.find('.h5p-editor-dialog');
  $container.find('.h5p-copyright-button').add($dialog.find('.h5p-close')).click(function () {
    $dialog.toggleClass('h5p-open');
    return false;
  });

  var editImagePopup = new H5PEditor.ImageEditingPopup();
  editImagePopup.on('savedImage', function (e) {
    console.log("got event");
    console.log("set as new img source");
    var src = e.data;
    self.$img.attr('src', e.data);

    // Set current source as original image, if no original image
    if (!params.originalImage) {
      params.originalImage = {
        path: params.path,
        mime: params.mime,
        height: params.height,
        width: params.width
      }
    }

    // Set new source as current image

  });

  $container.find('.h5p-editing-image-button').click(function () {
    console.log("this", H5P.jQuery(this));
    console.log("offset body", H5P.jQuery(this).offset());
    console.log("self", self);
    console.log("params", self.params);
    if (self.params && self.params.path) {
      console.log("image src", self.$img, self.$img.attr('src'));
      var imageSrc;
      if (!self.isEditing) {
        imageSrc = self.$img.attr('src');
        self.isEditing = true;
      }
      console.log("show, imagesrc", imageSrc);
      editImagePopup.show(H5P.jQuery(this).offset(), imageSrc);
    }
    else {
      // TODO: handle no image set
      console.log("NO image set");
    }
  });

  var group = new ns.widgets.group(self, ns.copyrightSemantics, self.copyright, function (field, value) {
    if (self.params !== undefined) {
      self.params.copyright = value;
    }
    self.copyright = value;
  });
  group.appendTo($dialog);
  group.expand();
  group.$group.find('.title').remove();
  this.children = [group];
};


/**
 * Sync copyright between all video files.
 *
 * @returns {undefined}
 */
ns.widgets.image.prototype.setCopyright = function (value) {
  this.copyright = this.params.copyright = value;
};


/**
 * Creates thumbnail HTML and actions.
 *
 * @returns {Boolean}
 */
ns.widgets.image.prototype.addFile = function () {
  var that = this;

  if (this.params === undefined) {
    this.$file
      .html('<a href="#" class="add" title="' + ns.t('core', 'addFile') + '"></a>')
      .children('.add')
      .click(function () {
        that.uploadFile();
        return false;
      });
    return;
  }

  var thumbnail;
  if (this.field.type === 'image') {
    thumbnail = {};
    thumbnail.path = H5P.getPath(this.params.path, H5PEditor.contentId);
      thumbnail.height = 100;
    if (this.params.width !== undefined) {
      thumbnail.width = thumbnail.height * (this.params.width / this.params.height);
    }
  }
  else {
    thumbnail = ns.fileIcon;
  }

  var thumbnailWidth = thumbnail.width === undefined ? '' : ' width="' + thumbnail.width + '"';
  var altText = (this.field.label === undefined ? '' : this.field.label);
  var fileHtmlString = '' +
    '<a href="#" title="' + ns.t('core', 'changeFile') + '" class="thumbnail">' +
      '<img ' + thumbnailWidth + 'height="' + thumbnail.height + '" alt="' + altText + '"/>' +
    '</a>' +
    '<a href="#" class="remove" title="' + ns.t('core', 'removeFile') + '"></a>';

  this.$file.html(fileHtmlString)
    .children(':eq(0)')
    .click(function () {
      that.uploadFile();
      return false;
    })
    .children('img')
    .attr('src', thumbnail.path)
    .end()
    .next()
    .click(function () {
      if (!confirm(ns.t('core', 'confirmRemoval', {':type': 'file'}))) {
        return false;
      }
      delete that.params;
      that.setValue(that.field);
      that.addFile();

      for (var i = 0; i < that.changes.length; i++) {
        that.changes[i]();
      }

      return false;
    });

  this.$img = this.$file.find('img');
};

/**
 * Start a new upload.
 */
ns.widgets.image.prototype.uploadFile = function () {
  var that = this;
  debugger;

  if (ns.File.$file === 0) {
    return; // Wait for our turn :)
  }

  this.$errors.html('');

  ns.File.changeCallback = function () {
    that.$file.html('<div class="h5peditor-uploading h5p-throbber">' + ns.t('core', 'uploading') + '</div>');
  };

  ns.File.callback = function (err, result) {
    try {
      if (err) {
        throw err;
      }

      that.params = {
        path: result.path,
        mime: result.mime,
        copyright: that.copyright
      };
      if (that.field.type === 'image') {
        that.params.width = result.width;
        that.params.height = result.height;
      }

      that.setValue(that.field, that.params);

      for (var i = 0; i < that.changes.length; i++) {
        that.changes[i](that.params);
      }
    }
    catch (error) {
      that.$errors.append(ns.createError(error));
    }

    that.addFile();
  };

  if (this.field.mimes !== undefined) {
    var mimes = '';
    for (var i = 0; i < this.field.mimes.length; i++) {
      if (mimes !== '') {
        mimes += ',';
      }
      mimes += this.field.mimes[i];
    }
    ns.File.$file.attr('accept', mimes);
  }
  else if (this.field.type === 'image') {
    ns.File.$file.attr('accept', 'image/jpeg,image/png,image/gif');
  }

  ns.File.$field.val(JSON.stringify(this.field));
  ns.File.$file.click();
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

/**
 * Collect functions to execute once the tree is complete.
 *
 * @param {function} ready
 * @returns {undefined}
 */
ns.widgets.image.prototype.ready = function (ready) {
  if (this.passReadies) {
    this.parent.ready(ready);
  }
  else {
    ready();
  }
};

/*

H5PEditor.widgets.imageEditing = H5PEditor.ImageEditing = (function ($, ImageEditingPopup) {

  /!**
   * Edit images
   *
   * @param parent
   * @param field
   * @param params
   * @param setValue
   * @constructor
   *!/
  function ImageEditing(parent, field, params, setValue) {
    console.log("iamge editing constructor", params, field);
    var self = this;

    params = params || {};

    var imageFields = field.fields.find(function (image) {
      return image.name === 'image';
    });

    var originalImageFields = field.fields.find(function (image) {
      return image.name === 'originalImage';
    });

    var popup = new ImageEditingPopup();

    var $imageEditing = $('<div>', {
      'class': 'h5p-image-editing'
    });

    var $imageEditingButton = $('<button>', {
      'class': 'h5p-editor-image-editing-button',
      'html': H5PEditor.t('H5PEditor.ImageEditing', 'editImage', {}),
      'appendTo': $imageEditing
    }).click(function () {

    });

    this.appendTo = function ($wrapper) {
      H5PEditor.processSemanticsChunk([imageFields],  params, $imageEditing, self);

      // Append before copyright button
      var $copyrightButton = $imageEditing.find('.h5p-copyright-button');
      $imageEditingButton.insertBefore($copyrightButton);

      $imageEditing.appendTo($wrapper);
    };

    this.passReadies = true;
    this.ready = function () {
      return true;
    };

    this.validate = function () {
      return true;
    }
  }

  return ImageEditing;
})(
  H5P.jQuery,
  H5PEditor.ImageEditing.ImageEditingPopup
);
*/
