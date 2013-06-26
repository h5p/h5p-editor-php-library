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
ns.AV = function (parent, field, params, setValue) {
  this.field = field;
  this.params = params;
  this.setValue = setValue;
  this.changes = [];
};

/**
 * Append field to the given wrapper.
 *
 * @param {jQuery} $wrapper
 * @returns {undefined}
 */
ns.AV.prototype.appendTo = function ($wrapper) {
  var that = this;

  ns.File.addIframe();

  var label = '';
  if (this.field.label !== 0) {
    label = '<span class="h5peditor-label">' + (this.field.label === undefined ? this.field.name : this.field.label) + '</span>';
  }

  var html = ns.createItem(this.field.type, label + '<div class="file">' + ns.AV.createAdd() + '</div>', this.field.description);

  var $file = ns.$(html).appendTo($wrapper).children('.file');
  this.$add = $file.children('.add').click(function (e) {
    that.uploadFile();
    return false;
  });
  this.$errors = $file.next();

  if (this.params !== undefined) {
    for (var i = 0; i < this.params.length; i++) {
      this.addFile(i);
    }
  }
};

/**
 * Create html for the add button.
 *
 * @returns {String} HTML
 */
ns.AV.createAdd = function () {
  return '<a href="#" class="add" title="' + ns.t('core', 'addFile') + '"></a>';
};

/**
 * Creates thumbnail HTML and actions.
 *
 * @param {object} file
 * @returns {undefined}
 */
ns.AV.prototype.addFile = function (index) {
  var that = this;

  var file = this.params[index];
  var mimeParts = file.mime.split('/');
  var $file = ns.$('<div class="thumbnail"><div class="type" title="' + file.mime + '">' + mimeParts[1] + '</div><a href="#" class="remove" title="' + ns.t('core', 'removeFile') + '"></a></div>').insertBefore(this.$add).children('.remove').click(function (e) {
    if (!confirm(ns.t('core', 'confirmRemoval', {':type': 'file'}))) {
      return false;
    }

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

    return false;
  }).end();
};

/**
 * Start a new upload.
 */
ns.AV.prototype.uploadFile = function () {
  var that = this;

  if (ns.File.$file === 0) {
    return; // Wait for our turn :)
  }

  this.$errors.html('');

  ns.File.changeCallback = function () {
    that.$uploading = ns.$('<div class="h5peditor-uploading">' + ns.t('core', 'uploading') + '</div>').insertAfter(that.$add.hide());
  };

  ns.File.callback = function (json) {
    try {
      var result = JSON.parse(json);
      if (result['error'] !== undefined) {
        throw(result['error']);
      }

      if (that.params === undefined) {
        that.params = [];
        that.setValue(that.field, that.params);
      }

      var file = {
        path: result.path,
        mime: result.mime
      };
      that.params.push(file);

      that.addFile(that.params.length - 1);

      for (var i = 0; i < that.changes.length; i++) {
        that.changes[i](file);
      }
    }
    catch (error) {
      that.$errors.append(ns.createError(error));
    }

    if (that.$uploading !== undefined && that.$uploading.length !== 0) {
      that.$uploading.remove();
      that.$add.show();
    }
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
  else if (this.field.type === 'audio') {
    ns.File.$file.attr('accept', 'audio/mpeg,audio/x-wav,audio/ogg');
  }
  else if (this.field.type === 'video') {
    ns.File.$file.attr('accept', 'video/mp4,video/webm,video/ogg');
  }

  ns.File.$field.val(JSON.stringify(this.field));
  ns.File.$file.click();
};

/**
 * Validate this item
 */
ns.AV.prototype.validate = function () {
  return true;
};

/**
 * Remove this item.
 */
ns.AV.prototype.remove = function () {
  // TODO: Check what happens when removed during upload.
  this.$errors.parent().remove();
};

// Tell the editor what widget we are.
ns.widgets.video = ns.AV;
ns.widgets.audio = ns.AV;