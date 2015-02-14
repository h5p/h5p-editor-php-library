/** @namespace H5PEditor */
var H5PEditor = H5PEditor || {};

H5PEditor.LibraryListCache = function() {
  H5P.EventDispatcher.call(this);
  this.libraryCache = {};
  this.librariesComingIn = {};
  this.librariesMissing = {};
  this.que = [];
};

H5PEditor.LibraryListCache.prototype = Object.create(H5P.EventDispatcher.prototype);
H5PEditor.LibraryListCache.prototype.constructor = H5PEditor.LibraryListCache;

H5PEditor.LibraryListCache.prototype.getLibraries = function(libraries, handler, scope) {
  var cachedLibraries = [];
  var status = 'hasAll';
  var self = this;
  for (var i = 0; i < libraries.length; i++) {
    if (libraries[i] in this.libraryCache) {
      // Libraries that are missing on the server are set to null...
      if (this.libraryCache[libraries[i]] !== null) {
        cachedLibraries.push(this.libraryCache[libraries[i]]);
      }
    }
    else if (libraries[i] in this.librariesComingIn) {
      if (status === 'hasAll') {
        status = 'onTheWay';
      }
    }
    else {
      status = 'requestThem';
      this.librariesComingIn[libraries[i]] = true;
    }
  }
  switch (status) {
    case 'hasAll':
      handler.call(scope, cachedLibraries);
      break;
  case 'onTheWay':
    this.que.push({libraries: libraries, handler: handler, scope: scope});
    break;
  case 'requestThem':
    ns.$.post(ns.getAjaxUrl('libraries'), {libraries: libraries}, function (data) {
      self.setLibraries(data, libraries);
      handler.call(scope, data);
      self.runQue();
    });
    break;
  }
};

H5PEditor.LibraryListCache.prototype.runQue = function() {
  var l = this.que.length
  for (var i = 0; i < l; i++) {
    var handlerObject = this.que.shift();
    this.getLibraries(handlerObject.libraries, handlerObject.handler, handlerObject.scope);
  }
};

H5PEditor.LibraryListCache.prototype.setLibraries = function(libraries, requestedLibraries) {
  var reqLibraries = requestedLibraries.slice();
  for (var i = 0; i < libraries.length; i++) {
    this.libraryCache[libraries[i].uberName] = libraries[i];
    if (libraries[i].uberName in this.librariesComingIn) {
      delete this.librariesComingIn[libraries[i].uberName];
    }
    var index = reqLibraries.indexOf(libraries[i].uberName);
    if (index > -1) {
      reqLibraries.splice(index, 1);
    }
  }
  for (var i = 0; i < reqLibraries.length; i++) {
    this.libraryCache[reqLibraries[i]] = null;
    if (reqLibraries[i] in this.librariesComingIn) {
      delete this.librariesComingIn[libraries[i]];
    }
  }
};

H5PEditor.LibraryListCache = new H5PEditor.LibraryListCache(); 
