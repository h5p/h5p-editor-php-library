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
ns.Video = function (parent, field, params, setValue) {
  this.field = field;
  this.params = params;
  this.setValue = setValue;
  this.$files = [];
};

/**
 * Append field to the given wrapper.
 * 
 * @param {jQuery} $wrapper
 * @returns {undefined}
 */
ns.Video.prototype.appendTo = function ($wrapper) {
  var that = this;
  
  ns.File.addIframe();
  
  var label = '';
  if (this.field.label !== 0) {
    label = '<label>' + (this.field.label === undefined ? this.field.name : this.field.label) + '</label>';
  }
  
  var html = ns.createItem(this.field.type, label + '<div class="file"><a href="#" class="add" title="' + ns.t('addFile') + '"></a></div>');
  
  var $file = ns.$(html).appendTo($wrapper).children('.file');
  this.$add = $file.children('.add').click(function () {
    that.uploadFile();
    return false;
  });
  this.$errors = $file.next();
  
  if (this.params !== undefined) {
    for (var i = 0; i < this.params.length; i++) {
      this.addFile(this.params[i]);
    }
  }
};

/**
 * Creates thumbnail HTML and actions.
 * 
 * @param {object} file
 * @returns {undefined}
 */
ns.Video.prototype.addFile = function (file) {
  var that = this;

  var mimeParts = file.mime.split('/');
  var $file = ns.$('<div class="thumbnail"><div class="type" title="' + file.mime + '">' + mimeParts[1] + '</div><a href="#" class="remove" title="' + ns.t('removeFile') + '"></a></div>').insertBefore(this.$add).children('.remove').click(function (e) {
    if (!confirm(ns.t('confirmRemoval', {':type': 'file'}))) {
      return false;
    }
    
    // Remove from params.
    for (var i = 0; i < that.$files.length; i++) {
      if (that.$files[i] === $file) {
        that.$files.splice(i, 1);
        that.params.splice(i, 1);
      }
    }
    
    if (!that.params.length) {
      delete that.params;
      that.setValue(that.field);
    }
    
    $file.remove();

    return false;
  }).end();
  
  this.$files.push($file);
};

/**
 * Start a new upload.
 */
ns.Video.prototype.uploadFile = function () {
  var that = this;
  
  if (ns.File.$file === 0) {
    return; // Wait for our turn :)
  }
  
  this.$errors.html('');
  
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
  
      that.params.push({
        path: result.path,
        mime: result.mime
      });
      
      that.addFile(result);
    }
    catch (error) {
      that.$errors.append(ns.createError(error));
    }
  };
  
  ns.File.$field.val(JSON.stringify(this.field));
  ns.File.$file.click();
};

/**
 * Remove this item.
 */
ns.Video.prototype.remove = function () {
  // TODO: Check what happens when removed during upload.
  this.$errors.parent().remove();
};

// Tell the editor what widget we are.
ns.widgets.video = ns.Video;