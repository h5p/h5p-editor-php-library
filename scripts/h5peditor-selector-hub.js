var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

/**
 * @class
 * @alias H5PEditor.SelectorHub
 * @implements {ContentTypeSelector}
 */
ns.SelectorHub = function () {
  this.client = new H5P.HubClient({
    apiRootUrl: H5PEditor.ajaxPath,
    apiVersion: {
      major: H5PEditor.apiVersion.majorVersion,
      minor: H5PEditor.apiVersion.minorVersion,
    }
  }, H5PEditor.language.hub);
};

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
 * Registers a listener for select events
 *
 * @param {function} callback
 * @param {object} scope
 */
ns.SelectorHub.prototype.onSelect = function(callback, scope) {
  this.client.on('select', function (event) {
    this.client.getContentType(event.id)
      .then(this.createContentTypeId)
      .then(function(contentTypeId){
        callback.call(scope || this, contentTypeId)
      });
  }, this);
};

ns.SelectorHub.prototype.onUpload = function(callback, scope) {
  this.client.on('upload', function (e) {
    console.log("we ever get an upload event ???");

    // Retrieve the preloaded dependency that has the same machineName as h5p.json
    debugger;
    const libraryVersion = e.data.h5p.preloadedDependencies
      .filter(function (dependency) {
        return dependency.machineName === e.data.h5p.mainLibrary;
      })[0];
    const libraryId = this.createContentTypeId(libraryVersion);
    callback({
      libraryId: libraryId,
      contentJson: e.data.content
    });
  }, this);
}


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
