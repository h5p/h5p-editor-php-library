/**
 * @namespace
 */
var H5PEditor = (H5PEditor || {});
var ns = H5PEditor;


/**
 * Interface for classes can select a content type
 *
 * @interface ContentTypeSelector
 */
/**
 * Returns an element to apply to the dom
 *
 * @function
 * @name ContentTypeSelector#getElement
 * @returns {HTMLElement}
 */
/**
 * Calls a callback when a Content Type is selected
 *
 * @function
 * @name ContentTypeSelector#onSelect
 * @param {function} callback
 * @param {object} [scope]
 */


/**
 * Construct the editor.
 *
 * @class H5PEditor.Editor
 * @param {string} library
 * @param {Object} defaultParams
 */
ns.Editor = function (library, defaultParams, replace) {
  var self = this;

  // Create iframe and replace the given element with it
  var iframe = ns.$('<iframe/>', {
    css: {
      display: 'block',
      width: '100%',
      height: '3em',
      border: 'none',
      zIndex: 101,
      top: 0,
      left: 0
    },
    'class': 'h5p-editor-iframe',
    frameBorder: '0'
  }).replaceAll(replace).load(function () {
    var LibrarySelector = this.contentWindow.H5PEditor.LibrarySelector;

    var $ = this.contentWindow.H5P.jQuery;
    this.contentWindow.H5P.$body = $(this.contentDocument.body);
    var $container = $('body > .h5p-editor');

    $.ajax({
      dataType: 'json',
      url: ns.getAjaxUrl('libraries')
    }).fail(function () {
      $container.html('Error, unable to load libraries.');
    }).done(function (data) {
      self.selector = new LibrarySelector(data, library, defaultParams);
      self.selector.appendTo($container.html(''));
      if (library) {
        // self.selector.$selector.change();
      }
    });

    // Start resizing the iframe
    if (iframe.contentWindow.MutationObserver !== undefined) {
      // If supported look for changes to DOM elements. This saves resources.
      var running;
      var limitedResize = function (mutations) {
        if (!running) {
          running = setTimeout(function () {
            resize();
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
      resize();
    }
     else {
      // Use an interval for resizing the iframe
      (function resizeInterval() {
        resize();
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
    '<div class="h5p-editor">' + ns.t('core', 'loading') + '</div>' +
    '</body></html>');
  iframe.contentDocument.close();
  iframe.contentDocument.documentElement.style.overflow = 'hidden';

  /**
   * Checks if iframe needs resizing, and then resize it.
   *
   * @private
   */
  var resize = function () {
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
};


/**
 * Handles loading the library
 *
 * @param {string} id
 * @param {string} library
 * @param {Object} params
 *
 * @return {HTMLElement}
 */
ns.Editor.prototype.handleLoadLibrary = function (id, library, params) {
  var self = this;

  // add loading throbber
  var $loading = ns.$('<div class="h5peditor-loading h5p-throbber">' + ns.t('core', 'loading') + '</div>');

  // load the library
  ns.loadLibrary(id, function(semantics) {
    if (this.form !== undefined) {
      // Remove old form.
      this.form.remove();
    }

    self.form = self.createAndLoadForm(semantics, library, params);
    $loading.replaceWith(self.form.$form);
  });

  return $loading;
};

/**
 * Creates the form and loads it
 *
 * @param {Array} semantics
 * @param {string} library
 * @param {Object} params
 *
 * @return {H5PEditor.Form}
 */
ns.Editor.prototype.createAndLoadForm = function(semantics, library, params) {
  var form = new H5PEditor.Form();
  form.processSemantics(semantics, (params ? params : {}));
  return form;
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
    if (!vars[placeholder]) {
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
