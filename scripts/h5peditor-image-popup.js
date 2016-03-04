var H5PEditor = H5PEditor || {};

H5PEditor.ImageEditingPopup = (function ($, EventDispatcher) {
  var instanceCounter = 0;
  var scriptsLoaded = false;
  var editorPath = '/sites/all/modules/h5p/modules/h5peditor/h5peditor/';

  function ImageEditingPopup() {

    EventDispatcher.call(this);

    var self = this;
    var uniqueId = instanceCounter;
    instanceCounter++;
    var isShowing = false;

    var background = document.createElement('div');
    background.className = 'h5p-editing-image-popup-background hidden';

    var popup = document.createElement('div');
    popup.className = 'h5p-editing-image-popup';
    background.appendChild(popup);

    var header = document.createElement('div');
    header.className = 'h5p-editing-image-header';
    popup.appendChild(header);

    var headerTitle = document.createElement('div');
    headerTitle.className = 'h5p-editing-image-header-title';
    headerTitle.textContent = 'Edit Image!';
    header.appendChild(headerTitle);

    var headerButtons = document.createElement('div');
    headerButtons.className = 'h5p-editing-image-header-buttons';
    header.appendChild(headerButtons);

    var resetButton = document.createElement('button');
    resetButton.textContent = ns.t('core', 'resetToOriginalLabel');
    resetButton.className = 'h5p-editing-image-reset-button';
    resetButton.onclick = function () {
      resetToOriginalImage();
    };
    headerButtons.appendChild(resetButton);

    var cancelButton = document.createElement('button');
    cancelButton.textContent = ns.t('core', 'cancelLabel');
    cancelButton.className = 'h5p-editing-image-cancel-button';
    cancelButton.onclick = function () {
      self.trigger('canceled');
    };
    headerButtons.appendChild(cancelButton);

    var saveButton = document.createElement('button');
    saveButton.textContent = ns.t('core', 'saveLabel');
    saveButton.className = 'h5p-editing-image-save-button';
    saveButton.onclick = function () {
      saveImage();
    };
    headerButtons.appendChild(saveButton);

    var editingImage = new Image();
    editingImage.className = 'h5p-editing-image';
    editingImage.id = 'h5p-editing-image-' + uniqueId;
    popup.appendChild(editingImage);

    H5P.$body.get(0).appendChild(background);

    var topOffset = 0;

    var resetToOriginalImage = function () {
      self.trigger('resetImage');
    };

    var loadScripts = function () {
      loadScript('../..' + editorPath + 'libs/fabric.js', function () {
        loadScript('../..' + editorPath + 'libs/darkroom.js', function () {
          createDarkroom();
          scriptsLoaded = true;
        });
      });
    };

    var loadScript = function (path, callback) {
      $.ajax({
        url: path,
        dataType: 'script',
        success: function () {
          if (callback) {
            callback();
          }
        },
        async: true
      });
    };

    var saveImage = function() {

      // Check if image has changed
      console.log("transformations", self.darkroom.transformations);
      console.log("transformations", self.darkroom.transformations.length);
      if (self.darkroom.transformations.length) {
        var newImage = self.darkroom.canvas.toDataURL();
        self.trigger('savedImage', newImage);
      }

      self.hide();
    };

    var createDarkroom = function () {
      self.darkroom = new Darkroom('#h5p-editing-image-' + uniqueId, {
        plugins: {
          save : false
        }
      });
    };

    this.adjustOffset = function (offset) {
      if (offset) {
        topOffset = offset.top;
      }
      var offsetCentered = topOffset - parseInt(popup.getBoundingClientRect().height) / 2;
      topOffset = offsetCentered > 0 ? offsetCentered : 0;
      popup.style.top = topOffset + 'px';
    };

    this.setImage = function (imgSrc) {
      var darkroom = popup.querySelector('.darkroom-container');
      popup.removeChild(darkroom);

      editingImage.src = imgSrc;
      popup.appendChild(editingImage);

      createDarkroom();
    };

    this.show = function (offset, imageSrc) {
      topOffset = offset.top;

      if (imageSrc) {

        if (!scriptsLoaded) {
          editingImage.src = imageSrc;
          loadScripts();
        }
        else {
          self.setImage(imageSrc);
        }
      }

      isShowing = true;
      background.classList.remove('hidden');
      this.adjustOffset();
    };

    this.hide = function () {
      isShowing = false;
      background.classList.add('hidden');
    };

    this.toggle = function () {
      if (isShowing) {
        this.hide();
      }
      else {
        this.show();
      }
    };

    // Close popup on background click
    background.onclick = function () {
      this.hide();
    }.bind(this);

    // Prevent closing popup
    popup.onclick = function (e) {
      e.stopPropagation();
    }
  }

  ImageEditingPopup.prototype = Object.create(EventDispatcher.prototype);
  ImageEditingPopup.prototype.constructor = ImageEditingPopup;

  return ImageEditingPopup;

})(H5P.jQuery, H5P.EventDispatcher);
