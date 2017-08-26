/**
 * @namespace
 */
var H5PEditor = (H5PEditor || {});
var ns = H5PEditor;

/**
 * Construct the editor.
 *
 * @class H5PEditor.Editor
 * @param {string} library
 * @param {Object} defaultParams
 * @param {Element} replace
 * @param {Function} iframeLoaded
 */
ns.Editor = function (library, defaultParams, replace, iframeLoaded) {
  var self = this;

  // Library may return "0", make sure this doesn't return true in checks
  library = library && library != 0 ? library : '';

  /**
   * Checks if iframe needs resizing, and then resize it.
   *
   * @private
   */
  var resize = function (iframe) {
    if (iframe.clientHeight === iframe.contentDocument.body.scrollHeight &&
      iframe.contentDocument.body.scrollHeight === iframe.contentWindow.document.body.clientHeight) {
      return; // Do not resize unless page and scrolling differs
    }

    // Retain parent size to avoid jumping/scrolling
    var parentHeight = iframe.parentElement.style.height;
    iframe.parentElement.style.height = iframe.parentElement.clientHeight + 'px';

    // Reset iframe height, in case content has shrinked.
    iframe.style.height = iframe.contentWindow.document.body.clientHeight + 'px';

    // Resize iframe so all content is visible. Use scrollHeight to make sure we get everything
    iframe.style.height = iframe.contentDocument.body.scrollHeight + 'px';

    // Free parent
    iframe.parentElement.style.height = parentHeight;
  };

  // Create iframe and replace the given element with it
  var iframe = ns.$('<iframe/>', {
    'css': {
      display: 'block',
      width: '100%',
      height: '3em',
      border: 'none',
      zIndex: 101,
      top: 0,
      left: 0
    },
    'class': 'h5p-editor-iframe',
    'frameBorder': '0'
  }).replaceAll(replace).load(function () {

    // "this" is the iframe DOM element
    var loadedIframe = this;

    if (iframeLoaded) {
      iframeLoaded.call(this.contentWindow);
    }

    var LibrarySelector = this.contentWindow.H5PEditor.LibrarySelector;
    var $ = this.contentWindow.H5P.jQuery;
    var $container = $('body > .h5p-editor');

    this.contentWindow.H5P.$body = $(this.contentDocument.body);

    $.ajax({
      url: this.contentWindow.H5PEditor.getAjaxUrl('libraries')
    }).fail(function () {
      $container.html('Error, unable to load libraries.');
    }).done(function (data) {
      // Create library selector
      self.selector = new LibrarySelector(data, library, defaultParams);
      self.selector.appendTo($container.html(''));

      // Resize iframe when selector resizes
      self.selector.on('resized', function () {
        resize(loadedIframe);
      });

      /**
       * Event handler for exposing events
       *
       * @private
       * @param {H5P.Event} event
       */
      var relayEvent = function (event) {
        H5P.externalDispatcher.trigger(event);
      };
      self.selector.on('editorload', relayEvent);
      self.selector.on('editorloaded', relayEvent);

      // Set library if editing
      if (library) {
        self.selector.setLibrary(library);
      }
    });

    // Start resizing the iframe
    if (iframe.contentWindow.MutationObserver !== undefined) {
      // If supported look for changes to DOM elements. This saves resources.
      var running;
      var limitedResize = function (mutations) {
        if (!running) {
          running = setTimeout(function () {
            resize(loadedIframe);
            running = null;
          }, 40); // 25 fps cap
        }
      };

      new iframe.contentWindow.MutationObserver(limitedResize).observe(iframe.contentWindow.document.body, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false
      });

      H5P.$window.resize(limitedResize);
      resize(loadedIframe);
    }
    else {
      // Use an interval for resizing the iframe
      (function resizeInterval() {
        resize(loadedIframe);
        setTimeout(resizeInterval, 40); // No more than 25 times per second
      })();
    }
  }).get(0);
  iframe.contentDocument.open();
  iframe.contentDocument.write(
    '<!doctype html><html>' +
    '<head>' +
    ns.wrap('<link rel="stylesheet" href="', ns.assets.css, '">') +
    ns.wrap('<script src="', ns.assets.js, '"></script>') +
    '</head><body>' +
    '<div class="h5p-editor h5peditor">' + ns.t('core', 'loading') + '</div>' +
    '</body></html>');
  iframe.contentDocument.close();
  iframe.contentDocument.documentElement.style.overflow = 'hidden';
};

/**
 * Find out which library is used/selected.
 *
 * @alias H5PEditor.Editor#getLibrary
 * @returns {string} Library name
 */
ns.Editor.prototype.getLibrary = function () {
  if (this.selector !== undefined) {
    return this.selector.getCurrentLibrary();
  }
  else if(this.selectedContentTypeId) {
    return this.selectedContentTypeId;
  }
  else {
    console.warn('no selector defined for "getLibrary"');
  }
};

/**
 * Get parameters needed to start library.
 *
 * @alias H5PEditor.Editor#getParams
 * @returns {Object} Library parameters
 */
ns.Editor.prototype.getParams = function () {
  if (this.selector !== undefined) {
    return this.selector.getParams();
  }
  else if(this.form){
    return this.form.params;
  }
  else {
    console.warn('no selector defined for "getParams"');
  }
};

/**
 * Editor translations index by library name or "core".
 *
 * @member {Object} H5PEditor.language
 */
ns.language = {};

/**
 * Translate text strings.
 *
 * @method H5PEditor.t
 * @param {string} library The library name(machineName), or "core".
 * @param {string} key Translation string identifier.
 * @param {Object} [vars] Placeholders and values to replace in the text.
 * @returns {string} Translated string, or a text if string translation is missing.
 */
ns.t = function (library, key, vars) {
  if (ns.language[library] === undefined) {
    return 'Missing translations for library ' + library;
  }

  var translation;
  if (library === 'core') {
    if (ns.language[library][key] === undefined) {
      return 'Missing translation for ' + key;
    }
    translation = ns.language[library][key];
  }
  else {
    if (ns.language[library].libraryStrings === undefined || ns.language[library].libraryStrings[key] === undefined) {
      return ns.t('core', 'missingTranslation', {':key': key});
    }
    translation = ns.language[library].libraryStrings[key];
  }

  // Replace placeholder with variables.
  for (var placeholder in vars) {
    if (vars[placeholder] === undefined) {
      continue;
    }
    translation = translation.replace(placeholder, vars[placeholder]);
  }

  return translation;
};

/**
 * Wraps multiple content between a prefix and a suffix.
 *
 * @method H5PEditor.wrap
 * @param {string} prefix Inserted before the content.
 * @param {Array} content List of content to be wrapped.
 * @param {string} suffix Inserted after the content.
 * @returns {string} All content put together with prefix and suffix.
 */
ns.wrap = function (prefix, content, suffix) {
  var result = '';
  for (var i = 0; i < content.length; i++) {
    result += prefix + content[i] + suffix;
  }
  return result;
};
