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
    apiRootUrl: H5PEditor.ajaxPath
  }, H5PEditor.language.hub);

  if (selectedLibrary) {
    this.client.setPanelTitle(selectedLibrary.split(' ')[0]);
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
          self.currentLibrary = self.createContentTypeId(contentType);
          self.trigger('selected');
          return;
        }

        self.currentLibrary = self.createContentTypeId(contentType);
        delete self.currentParams;
        changeLibraryDialog.show(ns.$(self.getElement()).offset().top);
      });
  }, this);

  // Listen for uploads
  this.client.on('upload', function (e) {
    this.client.getContentType(e.data.h5p.mainLibrary)
      .then(function (contentType) {
        self.currentLibrary = self.createContentTypeId(contentType);
        self.currentParams = e.data.content;
        changeLibraryDialog.show(ns.$(self.getElement()).offset().top);
      });
  }, this);
};

/**
 * Reset current library to the provided library.
 *
 * @param {string} library Full library name
 */
ns.SelectorHub.prototype.resetSelection = function (library) {
  this.currentLibrary = library;
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
 *
 * @private
 * @return {string}
 */
ns.SelectorHub.prototype.createContentTypeId = function (contentType) {
  return contentType.machineName + ' ' + contentType.majorVersion + '.' + contentType.minorVersion;
};
