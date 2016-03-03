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
    console.log("h5peditor", H5PEditor);
    console.log("h5p", H5P);
    console.log("body", H5P.$body);
    var isShowing = false;

    var background = document.createElement('div');
    background.className = 'h5p-editing-image-popup-background hidden';

    var popup = document.createElement('div');
    popup.className = 'h5p-editing-image-popup';
    background.appendChild(popup);

    var header = document.createElement('div');
    header.className = 'h5p-editing-image-header';
    header.textContent = 'Edit Image!';
    popup.appendChild(header);

    var editingImage = new Image();
    editingImage.className = 'h5p-editing-image';
    editingImage.id = 'h5p-editing-image-' + uniqueId;
    popup.appendChild(editingImage);

    H5P.$body.get(0).appendChild(background);

    var topOffset = 0;

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

    var createDarkroom = function () {
      new Darkroom('#h5p-editing-image-' + uniqueId, {
        initialize: function () {
          self.adjustOffset();
        },
        plugins: {
          save : {
            callback: function () {
              var newImage = this.darkroom.canvas.toDataURL();
              self.trigger('savedImage', newImage);
              self.hide();
            }
          }
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

    this.show = function (offset, imageSrc) {
      topOffset = offset.top;

      if (imageSrc) {
        console.log("inside imagesrc");
        editingImage.src = imageSrc;

        if (!scriptsLoaded) {
          loadScripts();
        }
        else {
          createDarkroom();
        }
      }

      isShowing = true;
      background.classList.remove('hidden');
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
