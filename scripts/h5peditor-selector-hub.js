var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

/**
 * @class
 * @alias H5PEditor.SelectorHub
 */
ns.SelectorHub = function (selectedLibrary, changeLibraryDialog) {
  var self = this;

  H5P.EventDispatcher.call(this);

  // Initialize hub client
  this.client = new H5P.HubClient({
    apiRootUrl: H5PEditor.ajaxPath,
    apiVersion: {
      major: H5PEditor.apiVersion.majorVersion,
      minor: H5PEditor.apiVersion.minorVersion,
    }
  }, H5PEditor.language.hub);

  if (selectedLibrary) {
    this.client.setPanelTitle({id: selectedLibrary.split(' ')[0]});
  }

  // Default to nothing selected and empty params
  this.currentLibrary = selectedLibrary;

  // Listen for content type selection
  this.client.on('select', function (event) {
    // Already selected library
    if (event.id === self.currentLibrary.split(' ')[0]) {
      return;
    }
    this.client.getContentType(event.id)
      .then(function (contentType) {
        if (!self.currentLibrary) {
          self.currentLibrary = self.createContentTypeId(contentType, true);
          self.trigger('selected');
          return;
        }

        self.currentLibrary = self.createContentTypeId(contentType, true);
        delete self.currentParams;
        changeLibraryDialog.show(ns.$(self.getElement()).offset().top);
      });
  }, this);

  // Listen for uploads
  this.client.on('upload', function (e) {
    this.client.getContentType(e.data.h5p.mainLibrary)
      .then(function (contentType) {
        var previousLibrary = self.currentLibrary;
        self.currentLibrary = self.createContentTypeId(contentType);
        self.client.setPanelTitle({id: self.currentLibrary.split(' ')[0]})
        self.currentParams = e.data.content;

        // Change library immediately or show confirmation dialog
        if (!previousLibrary) {
          self.trigger('selected');
          self.clearUploadForm();
        }
        else {
          changeLibraryDialog.show(ns.$(self.getElement()).offset().top);
        }
      });
  }, this);

  this.client.on('resized', function () {
    self.trigger('resized');
  });

  // Clear upload field when changing library
  changeLibraryDialog.on('confirmed', function () {
    self.clearUploadForm();
  })
};

// Extends the event dispatcher
ns.SelectorHub.prototype = Object.create(H5P.EventDispatcher.prototype);
ns.SelectorHub.prototype.constructor = ns.SelectorHub;

/**
 * Clears the upload form in the hub client
 */
ns.SelectorHub.prototype.clearUploadForm = function () {
  this.client.trigger('clear-upload-form');
}

/**
 * Reset current library to the provided library.
 *
 * @param {string} library Full library name
 */
ns.SelectorHub.prototype.resetSelection = function (library, params) {
  this.currentLibrary = library;
  this.currentParams = params;
  var machineName = library.split(' ')[0];
  this.client.setPanelTitle({id: machineName});
}

/**
 * Get currently selected library
 *
 * @returns {string} Selected library
 */
ns.SelectorHub.prototype.getSelectedLibrary = function () {
  return this.currentLibrary;
}

/**
 * Get params connected with the currently selected library
 *
 * @returns {string} Parameters connected to the selected library
 */
ns.SelectorHub.prototype.getParams = function () {
  return this.currentParams;
}

/**
 * Returns the html element for the hub
 *
 * @public
 * @return {HTMLElement}
 */
ns.SelectorHub.prototype.getElement = function(){
  return this.client.getElement();
};

/**
 * Takes a content type, and extracts the full id (ubername)
 *
 * @param {ContentType} contentType
 * @param {boolean} [useLocalVersion] Decides if we should use local version or cached version
 *
 * @private
 * @return {string}
 */
ns.SelectorHub.prototype.createContentTypeId = function (contentType, useLocalVersion) {
  var id = contentType.machineName;
  if (useLocalVersion) {
    id += ' ' + contentType.localMajorVersion + '.' + contentType.localMinorVersion;
  }
  else {
    id += ' ' + contentType.majorVersion + '.' + contentType.minorVersion;
  }

  return id;
};
