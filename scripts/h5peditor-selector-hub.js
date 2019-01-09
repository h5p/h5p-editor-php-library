/* global ns */
/**
 * @class
 * @alias H5PEditor.SelectorHub
 */
ns.SelectorHub = function (libraries, selectedLibrary, changeLibraryDialog) {
  var self = this;

  H5P.EventDispatcher.call(this);

  /**
   * Looks up content type object
   *
   * @param {string} machineName
   * @return {object}
   */
  this.getContentType = function (machineName) {
    for (var i = 0; i < libraries.libraries.length; i++) {
      var contentType = libraries.libraries[i];

      if (contentType.machineName === machineName) {
        return contentType;
      }
    }
  };

  var state = {
    contentId: H5PEditor.contentId || 0,
    contentTypes: libraries,
    getAjaxUrl: H5PEditor.getAjaxUrl,
    expanded: true,
    canPaste: false
  };

  if (selectedLibrary) {
    var contentType = this.getContentType(selectedLibrary.split(' ')[0]);
    state.title = contentType ? contentType.title || contentType.machineName : selectedLibrary.split(' ')[0];
    state.expanded = false;
  }

  // Initialize hub client
  this.client = new H5P.HubClient(state, H5PEditor.language.core);

  // Default to nothing selected and empty params
  this.currentLibrary = selectedLibrary;

  // Listen for content type selection
  this.client.on('select', function (event) {
    var contentType = event;

    // Already selected library
    if (contentType.machineName === self.currentLibrary.split(' ')[0]) {
      return;
    }

    if (!self.currentLibrary) {
      self.currentLibrary = self.createContentTypeId(contentType, true);
      self.trigger('selected');
      return;
    }

    self.currentLibrary = self.createContentTypeId(contentType, true);
    delete self.currentParams;
    delete self.currentMetadata;
    changeLibraryDialog.show(ns.$(self.getElement()).offset().top);
  }, this);

  // Listen for uploads
  this.client.on('upload', function (event) {
    libraries = event.contentTypes;
    var previousLibrary = self.currentLibrary;

    // Use version from event data
    const uploadedVersion = event.h5p.preloadedDependencies
      .filter(function (dependency) {
        return dependency.machineName === event.h5p.mainLibrary;
      })[0];
    self.currentLibrary = self.createContentTypeId(uploadedVersion);
    self.currentParams = event.content;
    self.currentMetadata = {
      title: event.h5p.title,
      authors: event.h5p.authors,
      license: event.h5p.license,
      licenseVersion: event.h5p.licenseVersion,
      licenseExtras: event.h5p.licenseExtras,
      yearFrom: event.h5p.yearFrom,
      yearTo: event.h5p.yearTo,
      source: event.h5p.source,
      changes: event.h5p.changes,
      authorComments: event.h5p.authorComments
    };

    // Look for the best possible upgrade
    // TODO: Create multiple(at least two) functions for doing this.
    let possibleUpgrade;
    for (let i = 0; i < libraries.libraries.length; i++) {
      const canlib = libraries.libraries[i];
      if (canlib.machineName === uploadedVersion.machineName &&
          (canlib.localMajorVersion > uploadedVersion.majorVersion ||
            (canlib.localMajorVersion == uploadedVersion.majorVersion &&
             canlib.localMinorVersion > uploadedVersion.minorVersion)
          )) {
        // Check if the upgrade is better than the previous upgrade we found
        if (!possibleUpgrade || canlib.localMajorVersion > possibleUpgrade.localMajorVersion ||
            (canlib.localMajorVersion == possibleUpgrade.localMajorVersion &&
             canlib.localMinorVersion > possibleUpgrade.localMinorVersion)) {
          possibleUpgrade = canlib;
        }
      }
    }

    // TODO: Test with not being able to install old content types - currently only tested with installed content types...
    // TODO: What happens if the uploaded version is a newer version and the libraries can't be installed?
    console.log('I want to upgrade to ', possibleUpgrade);

    const librariesCache = {};
    const librariesLoadedCallbacks = {};

    /**
     * Duplicate from h5p-content-upgrade.js - TODO could we use the editor's cached instead?
     * @class
     */
    const loadLibrary = function (name, version, next) {
      var key = name + '/' + version.major + '/' + version.minor;

      if (librariesCache[key] === true) {
        // Library is being loaded, que callback
        if (librariesLoadedCallbacks[key] === undefined) {
          librariesLoadedCallbacks[key] = [next];
          return;
        }
        librariesLoadedCallbacks[key].push(next);
        return;
      }
      else if (librariesCache[key] !== undefined) {
        // Library has been loaded before. Return cache.
        next(null, librariesCache[key]);
        return;
      }

      librariesCache[key] = true;
      H5P.jQuery.ajax({
        dataType: 'json',
        cache: true,
        // TODO: Use variable instead - Could we make this share the cache + endpoint used by the editor?
        url: '/wp-admin/admin-ajax.php?action=h5p_content_upgrade_library&library=/' + key
      }).fail(function () {
        next('Error loading library ' + name + ' ' + version);
      }).done(function (library) {
        librariesCache[key] = library;
        next(null, library);

        if (librariesLoadedCallbacks[key] !== undefined) {
          for (var i = 0; i < librariesLoadedCallbacks[key].length; i++) {
            librariesLoadedCallbacks[key][i](null, library);
          }
        }
        delete librariesLoadedCallbacks[key];
      });
    };

    /**
     * Local version of H5P.Version - TODO merge them?
     * @class
     */
    const Version = function (lib) {
      if (lib.localMajorVersion !== undefined) {
        this.major =+ lib.localMajorVersion;
        this.minor =+ lib.localMinorVersion;
      }
      else {
        this.major =+ lib.majorVersion;
        this.minor =+ lib.minorVersion;
      }

      this.toString = function () {
        return this.major + '.' + this.minor;
      };
    }

    const loadedScripts = [];

    /**
     * Duplicate from h5p-content-upgrade.js - TODO use same function as the editor?
     * @class
     */
    const loadScript = function (url, next) {
      var self = this;

      if (loadedScripts.indexOf(url) !== -1) {
        next();
        return;
      }

      H5P.jQuery.ajax({
        dataType: 'script',
        cache: true,
        url: url
      }).fail(function () {
        next(true);
      }).done(function () {
        loadedScripts.push(url);
        next();
      });
    };

    // TODO: Use H5PIntegration.editor variables instead
    const libraryUrl = '/wp-content/plugins/h5p/h5p-php-library/js';
    const pluginCacheBuster = '?v=0.0.0'

    // TODO: Version must be loaded before upgrade-process.js
    // TODO: Make this easier to read? At least the first level..
    // TODO: Avoid stringify and parsing the parameters
    // TODO: Show throbber while upgrading?
    // TODO: Use a single web worker to avoid freezing the page while upgrading
    loadScript(libraryUrl + '/h5p-version.js' + pluginCacheBuster, function (err) { });
    loadScript(libraryUrl + '/h5p-content-upgrade-process.js' + pluginCacheBuster, function (err) {

      new H5P.ContentUpgradeProcess(uploadedVersion.machineName, new Version(uploadedVersion), new Version(possibleUpgrade), JSON.stringify({params: self.currentParams, metadata: self.currentMetadata}), 1, function (name, version, next) {
        loadLibrary(name, version, function (err, library) {
          if (library.upgradesScript) {
            loadScript(library.upgradesScript, function (err) {
              if (err) {
                err = 'Error loading upgrades ' + name + ' ' + version;
              }
              next(err, library);
            });
          }
          else {
            next(null, library);
          }
        });

      }, function done(err, result) {
        if (err) {
          console.error(err); // How can we bring this news to the user?
          return;
        }

        const final = JSON.parse(result);
        console.log('Done', final);
        self.currentParams = final.params;
        self.currentMetadata = final.metadata;
        self.currentLibrary = self.createContentTypeId(possibleUpgrade, true);

        // Change library immediately or show confirmation dialog
        if (!previousLibrary) {
          self.trigger('selected');
        }
        else {
          changeLibraryDialog.show(ns.$(self.getElement()).offset().top);
        }
      });

    });

  }, this);

  this.client.on('update', function (event) {
    // Handle update to the content type cache
    libraries = event;
  });

  this.client.on('resize', function () {
    self.trigger('resize');
  });

  this.client.on('paste', function () {
    self.trigger('paste');
  });
};

// Extends the event dispatcher
ns.SelectorHub.prototype = Object.create(H5P.EventDispatcher.prototype);
ns.SelectorHub.prototype.constructor = ns.SelectorHub;

/**
 * Reset current library to the provided library.
 *
 * @param {string} library Full library name
 * @param {Object} params Library parameters
 * @param {Object} metadata Library metadata
 * @param {boolean} expanded Selector open
 */
ns.SelectorHub.prototype.resetSelection = function (library, params, metadata, expanded) {
  this.currentLibrary = library;
  this.currentParams = params;
  this.currentMetadata = metadata;

  var contentType = this.getContentType(library.split(' ')[0]);
  this.client.setPanelTitle(contentType.title || contentType.machineName, expanded);
};

/**
 * Reset current library to the provided library.
 *
 * @param {boolean} canPaste
 */
ns.SelectorHub.prototype.setCanPaste = function (canPaste) {
  this.client.setCanPaste(canPaste);
};

/**
 * Get currently selected library
 *
 * @param {function} next Callback
 */
ns.SelectorHub.prototype.getSelectedLibrary = function (next) {
  var selected = {
    uberName: this.currentLibrary
  };

  var contentType = this.getContentType(this.currentLibrary.split(' ')[0]);
  if (contentType) {
    selected.tutorialUrl = contentType.tutorial;
    selected.exampleUrl = contentType.example;
  }

  return next(selected);
};

/**
 * Get params connected with the currently selected library
 *
 * @returns {object} Parameters connected to the selected library
 */
ns.SelectorHub.prototype.getParams = function () {
  return this.currentParams;
};

/**
 * Get metadata connected with the currently selected library
 *
 * @returns {object} Metadata connected to the selected library
 */
ns.SelectorHub.prototype.getMetadata = function () {
  return this.currentMetadata;
};

/**
 * Returns the html element for the hub
 *
 * @public
 * @return {HTMLElement}
 */
ns.SelectorHub.prototype.getElement = function () {
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
