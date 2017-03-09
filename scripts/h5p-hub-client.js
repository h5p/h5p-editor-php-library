/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @mixin
 */
var Eventful = exports.Eventful = function Eventful() {
  return {
    listeners: {},

    /**
     * Listen to event
     *
     * @param {string} type
     * @param {function} listener
     * @param {object} [scope]
     *
     * @function
     * @return {Eventful}
     */
    on: function on(type, listener, scope) {
      /**
       * @typedef {object} Trigger
       * @property {function} listener
       * @property {object} scope
       */
      var trigger = {
        'listener': listener,
        'scope': scope
      };

      this.listeners[type] = this.listeners[type] || [];
      this.listeners[type].push(trigger);

      return this;
    },

    /**
     * Fire event. If any of the listeners returns false, return false
     *
     * @param {string} type
     * @param {object} [event]
     *
     * @function
     * @return {boolean}
     */
    fire: function fire(type, event) {
      var triggers = this.listeners[type] || [];

      return triggers.every(function (trigger) {
        return trigger.listener.call(trigger.scope || this, event) !== false;
      });
    },

    /**
     * Listens for events on another Eventful, and propagate it trough this Eventful
     *
     * @param {string[]} types
     * @param {Eventful} eventful
     */
    propagate: function propagate(types, eventful) {
      var self = this;
      types.forEach(function (type) {
        return eventful.on(type, function (event) {
          return self.fire(type, event);
        });
      });
    }
  };
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Returns a curried version of a function
 *
 * @param {function} fn
 *
 * @public
 *
 * @return {function}
 */
var curry = exports.curry = function curry(fn) {
  var arity = fn.length;

  return function f1() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (args.length >= arity) {
      return fn.apply(null, args);
    } else {
      return function f2() {
        var args2 = Array.prototype.slice.call(arguments, 0);
        return f1.apply(null, args.concat(args2));
      };
    }
  };
};

/**
 * Compose functions together, executing from right to left
 *
 * @param {function...} fns
 *
 * @function
 * @public
 *
 * @return {function}
 */
var compose = exports.compose = function compose() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return fns.reduce(function (f, g) {
    return function () {
      return f(g.apply(undefined, arguments));
    };
  });
};

/**
 * Applies a function to each element in an array
 *
 * @param {function} fn
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
var forEach = exports.forEach = curry(function (fn, arr) {
  arr.forEach(fn);
});

/**
 * Maps a function to an array
 *
 * @param {function} fn
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
var map = exports.map = curry(function (fn, arr) {
  return arr.map(fn);
});

/**
 * Applies a filter to an array
 *
 * @param {function} fn
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
var filter = exports.filter = curry(function (fn, arr) {
  return arr.filter(fn);
});

/**
 * Applies a some to an array
 *
 * @param {function} fn
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
var some = exports.some = curry(function (fn, arr) {
  return arr.some(fn);
});

/**
 * Returns true if an array contains a value
 *
 * @param {*} value
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
var contains = exports.contains = curry(function (value, arr) {
  return arr.indexOf(value) != -1;
});

/**
 * Returns an array without the supplied values
 *
 * @param {Array} values
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
var without = exports.without = curry(function (values, arr) {
  return filter(function (value) {
    return !contains(value, values);
  }, arr);
});

/**
 * Takes a string that is either 'true' or 'false' and returns the opposite
 *
 * @param {string} bool
 *
 * @public
 * @return {string}
 */
var inverseBooleanString = exports.inverseBooleanString = function inverseBooleanString(bool) {
  return (bool !== 'true').toString();
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.querySelectorAll = exports.querySelector = exports.appendChild = exports.toggleAttribute = exports.attributeEquals = exports.hasAttribute = exports.removeAttribute = exports.setAttribute = exports.getAttribute = undefined;

var _functional = __webpack_require__(1);

/**
 * Get an attribute value from element
 *
 * @param {string} name
 * @param {HTMLElement} el
 *
 * @function
 * @return {string}
 */
var getAttribute = exports.getAttribute = (0, _functional.curry)(function (name, el) {
  return el.getAttribute(name);
});

/**
 * Set an attribute on a html element
 *
 * @param {string} name
 * @param {string} value
 * @param {HTMLElement} el
 *
 * @function
 */
var setAttribute = exports.setAttribute = (0, _functional.curry)(function (name, value, el) {
  el.setAttribute(name, value);
});

/**
 * Remove attribute from html element
 *
 * @param {string} name
 * @param {HTMLElement} el
 *
 * @function
 */
var removeAttribute = exports.removeAttribute = (0, _functional.curry)(function (name, el) {
  el.removeAttribute(name);
});

/**
 * Check if element has an attribute
 *
 * @param {string} name
 * @param {HTMLElement} el
 *
 * @function
 * @return {boolean}
 */
var hasAttribute = exports.hasAttribute = (0, _functional.curry)(function (name, el) {
  return el.hasAttribute(name);
});

/**
 * Check if element has an attribute that equals
 *
 * @param {string} name
 * @param {string} value
 * @param {HTMLElement} el
 *
 * @function
 * @return {boolean}
 */
var attributeEquals = exports.attributeEquals = (0, _functional.curry)(function (name, value, el) {
  return el.getAttribute(name) === value;
});

/**
 * Toggles an attribute between 'true' and 'false';
 *
 * @param {string} name
 * @param {HTMLElement} el
 *
 * @function
 */
var toggleAttribute = exports.toggleAttribute = (0, _functional.curry)(function (name, el) {
  var value = getAttribute(name, el);
  setAttribute(name, (0, _functional.inverseBooleanString)(value), el);
});

/**
 * The appendChild() method adds a node to the end of the list of children of a specified parent node.
 *
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 *
 * @function
 * @return {HTMLElement}
 */
var appendChild = exports.appendChild = (0, _functional.curry)(function (parent, child) {
  return parent.appendChild(child);
});

/**
 * Returns the first element that is a descendant of the element on which it is invoked
 * that matches the specified group of selectors.
 *
 * @param {string} selector
 * @param {HTMLElement} el
 *
 * @function
 * @return {HTMLElement}
 */
var querySelector = exports.querySelector = (0, _functional.curry)(function (selector, el) {
  return el.querySelector(selector);
});

/**
 * Returns a non-live NodeList of all elements descended from the element on which it
 * is invoked that matches the specified group of CSS selectors.
 *
 * @param {string} selector
 * @param {HTMLElement} el
 *
 * @function
 * @return {NodeList}
 */
var querySelectorAll = exports.querySelectorAll = (0, _functional.curry)(function (selector, el) {
  return el.querySelectorAll(selector);
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {object} ContentType
 * @property {string} machineName
 * @property {string} majorVersion
 * @property {string} minorVersion
 * @property {string} patchVersion
 * @property {string} h5pMajorVersion
 * @property {string} h5pMinorVersion
 * @property {string} summary
 * @property {string} description
 * @property {string} icon
 * @property {string} createdAt
 * @property {string} updated_At
 * @property {string} isRecommended
 * @property {string} popularity
 * @property {object[]} screenshots
 * @property {string} license
 * @property {string} example
 * @property {string} tutorial
 * @property {string[]} keywords
 * @property {string} owner
 * @property {boolean} installed
 * @property {boolean} restricted
 */
var HubServices = function () {
  /**
   * @param {string} apiRootUrl
   */
  function HubServices(_ref) {
    var apiRootUrl = _ref.apiRootUrl;

    _classCallCheck(this, HubServices);

    this.apiRootUrl = apiRootUrl;

    if (!window.cachedContentTypes) {
      // TODO remove this when done testing for errors
      // window.cachedContentTypes = fetch(`${this.apiRootUrl}errors/NO_RESPONSE.json`, {

      window.cachedContentTypes = fetch(this.apiRootUrl + 'content-type-cache', {
        method: 'GET',
        credentials: 'include'
      }).then(function (result) {
        return result.json();
      }).then(this.isValid).then(function (json) {
        return json.libraries;
      });
    }
  }

  /**
   *
   * @param  {ContentType[]|ErrorMessage} response
   * @return {Promise<ContentType[]|ErrorMessage>}
   */


  _createClass(HubServices, [{
    key: 'isValid',
    value: function isValid(response) {
      if (response.messageCode) {
        return Promise.reject(response);
      } else {
        return Promise.resolve(response);
      }
    }

    /**
     * Returns a list of content types
     *
     * @return {Promise.<ContentType[]>}
     */

  }, {
    key: 'contentTypes',
    value: function contentTypes() {
      return window.cachedContentTypes;
    }

    /**
     * Returns a Content Type
     *
     * @param {string} machineName
     *
     * @return {Promise.<ContentType>}
     */

  }, {
    key: 'contentType',
    value: function contentType(machineName) {
      return window.cachedContentTypes.then(function (contentTypes) {
        return contentTypes.filter(function (contentType) {
          return contentType.machineName === machineName;
        })[0];
      });

      /*return fetch(`${this.apiRootUrl}content_type_cache/${id}`, {
        method: 'GET',
        credentials: 'include'
      }).then(result => result.json());*/
    }

    /**
     * Installs a content type on the server
     *
     * @param {string} id
     *
     * @return {Promise.<ContentType>}
     */

  }, {
    key: 'installContentType',
    value: function installContentType(id) {
      return fetch(this.apiRootUrl + 'library-install?id=' + id, {
        method: 'POST',
        credentials: 'include',
        body: ''
      }).then(function (result) {
        return result.json();
      });
    }

    /**
     * Uploads a content type to the server for validation
     *
     * @param {FormData} formData Form containing the h5p that should be uploaded as 'h5p'
     *
     * @return {Promise} Returns the promise of a json containing the content json and the h5p json
     */

  }, {
    key: 'uploadContent',
    value: function uploadContent(formData) {
      return fetch(this.apiRootUrl + 'library-upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      }).then(function (result) {
        return result.json();
      });
    }
  }]);

  return HubServices;
}();

exports.default = HubServices;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderErrorMessage;
/**
 * @param  {string}   config.type         type of the message: info, success, error
 * @param  {boolean}  config.dismissible  whether the message can be dismissed
 * @param  {string}   config.content      message content usually a 'h3' and a 'p'
 * @return {HTMLElement} div containing the message element
 */

//TODO handle strings, html, badly formed object
function renderErrorMessage(message) {
  // console.log(message);
  var closeButton = document.createElement('div');
  closeButton.className = 'close';
  closeButton.innerHTML = '&#x2715';

  var messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  messageContent.innerHTML = '<h1>' + message.title + '</h1>' + '<p>' + message.content + '</p>';

  var messageWrapper = document.createElement('div');
  messageWrapper.className = 'message' + ' ' + ('' + message.type) + (message.dismissible ? ' dismissible' : '');
  messageWrapper.appendChild(closeButton);
  messageWrapper.appendChild(messageContent);

  if (message.button !== undefined) {
    var messageButton = document.createElement('button');
    messageButton.className = 'button';
    messageButton.innerHTML = message.button;
    messageWrapper.appendChild(messageButton);
  }

  console.log(messageWrapper);
  return messageWrapper;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.relayClickEventAs = undefined;

var _functional = __webpack_require__(1);

/**
 *  Transforms a DOM click event into an Eventful's event
 *  @see Eventful
 *
 * @param  {string | Object} type
 * @param  {Eventful} eventful
 * @param  {HTMLElement} element
 * @return {HTMLElement}
 */
var relayClickEventAs = exports.relayClickEventAs = (0, _functional.curry)(function (type, eventful, element) {
  element.addEventListener('click', function (event) {
    eventful.fire(type, {
      element: element,
      id: element.getAttribute('data-id')
    }, false);

    // don't bubble
    event.stopPropagation();
  });

  return element;
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _elements = __webpack_require__(2);

var _functional = __webpack_require__(1);

/**
 * @type {function}
 */
var isExpanded = (0, _elements.attributeEquals)("aria-expanded", 'true');

/**
 * @type {function}
 */
var hide = (0, _elements.setAttribute)('aria-hidden', 'true');

/**
 * @type {function}
 */
var show = (0, _elements.setAttribute)('aria-hidden', 'false');

/**
 * Toggles the body visibility
 *
 * @param {HTMLElement} bodyElement
 * @param {boolean} isExpanded
 */
var toggleBodyVisibility = function toggleBodyVisibility(bodyElement, isExpanded) {
  if (!isExpanded) {
    hide(bodyElement);
    //bodyElement.style.height = "0";
  } else /*if(bodyElement.scrollHeight > 0)*/{
      show(bodyElement);
      //bodyElement.style.height = `${bodyElement.scrollHeight}px`;
    }
};

/**
 * Handles changes to aria-expanded
 *
 * @param {HTMLElement} bodyElement
 * @param {MutationRecord} event
 *
 * @function
 */
var onAriaExpandedChange = (0, _functional.curry)(function (bodyElement, event) {
  toggleBodyVisibility(bodyElement, isExpanded(event.target));
});

/**
 * Initializes a panel
 *
 * @param {HTMLElement} element
 * @return {HTMLElement}
 */
function init(element) {
  var titleEl = element.querySelector('[aria-expanded]');
  var bodyId = titleEl.getAttribute('aria-controls');
  var bodyEl = element.querySelector('#' + bodyId);

  if (titleEl) {
    // set observer on title for aria-expanded
    var observer = new MutationObserver((0, _functional.forEach)(onAriaExpandedChange(bodyEl)));

    observer.observe(titleEl, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["aria-expanded"]
    });

    // Set click listener that toggles aria-expanded
    titleEl.addEventListener('click', function (event) {
      (0, _elements.toggleAttribute)("aria-expanded", event.target);
    });

    toggleBodyVisibility(bodyEl, isExpanded(titleEl));
  }

  return element;
}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjI1Ij4NCiAgPGRlZnM+DQogICAgPHN0eWxlPg0KICAgICAgLmNscy0xIHsNCiAgICAgIGZpbGw6IG5vbmU7DQogICAgICB9DQoNCiAgICAgIC5jbHMtMiB7DQogICAgICBmaWxsOiAjYzZjNmM3Ow0KICAgICAgfQ0KDQogICAgICAuY2xzLTMsIC5jbHMtNCB7DQogICAgICBmaWxsOiAjZmZmOw0KICAgICAgfQ0KDQogICAgICAuY2xzLTMgew0KICAgICAgb3BhY2l0eTogMC43Ow0KICAgICAgfQ0KICAgIDwvc3R5bGU+DQogIDwvZGVmcz4NCiAgPHRpdGxlPmNvbnRlbnQgdHlwZSBwbGFjZWhvbGRlcl8yPC90aXRsZT4NCiAgPGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+DQogICAgPGcgaWQ9ImNvbnRlbnRfdHlwZV9wbGFjZWhvbGRlci0xX2NvcHkiIGRhdGEtbmFtZT0iY29udGVudCB0eXBlIHBsYWNlaG9sZGVyLTEgY29weSI+DQogICAgICA8cmVjdCBjbGFzcz0iY2xzLTEiIHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1Ii8+DQogICAgICA8cmVjdCBjbGFzcz0iY2xzLTIiIHg9IjExMi41MSIgeT0iNDMuNDEiIHdpZHRoPSIxNzYuOTYiIGhlaWdodD0iMTM1LjQ1IiByeD0iMTAiIHJ5PSIxMCIvPg0KICAgICAgPGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxMzYuNjYiIGN5PSI2MS45OCIgcj0iNC44MSIvPg0KICAgICAgPGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxNTEuNDkiIGN5PSI2MS45OCIgcj0iNC44MSIvPg0KICAgICAgPGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxNjYuMSIgY3k9IjYxLjk4IiByPSI0LjgxIi8+DQogICAgICA8ZyBpZD0iX0dyb3VwXyIgZGF0YS1uYW1lPSImbHQ7R3JvdXAmZ3Q7Ij4NCiAgICAgICAgPGcgaWQ9Il9Hcm91cF8yIiBkYXRhLW5hbWU9IiZsdDtHcm91cCZndDsiPg0KICAgICAgICAgIDxwYXRoIGlkPSJfQ29tcG91bmRfUGF0aF8iIGRhdGEtbmFtZT0iJmx0O0NvbXBvdW5kIFBhdGgmZ3Q7IiBjbGFzcz0iY2xzLTQiIGQ9Ik0yNjMuMjgsOTUuMjFDMjYwLDkyLjA3LDI1NSw5MS41LDI0OC40Myw5MS41SDIyN3Y4SDE5OS41bC0yLjE3LDEwLjI0YTI1Ljg0LDI1Ljg0LDAsMCwxLDExLjQ4LTEuNjMsMTkuOTMsMTkuOTMsMCwwLDEsMTQuMzksNS41NywxOC4yNiwxOC4yNiwwLDAsMSw1LjUyLDEzLjYsMjMuMTEsMjMuMTEsMCwwLDEtMi44NCwxMS4wNSwxOC42NSwxOC42NSwwLDAsMS04LjA2LDcuNzksOSw5LDAsMCwxLTQuMTIsMS4zN0gyMzZ2LTIxaDEwLjQyYzcuMzYsMCwxMi44My0xLjYxLDE2LjQyLTVzNS4zOC03LjQ4LDUuMzgtMTMuNDRDMjY4LjIyLDEwMi4yOSwyNjYuNTcsOTguMzUsMjYzLjI4LDk1LjIxWm0tMTUsMTdjLTEuNDIsMS4yMi0zLjksMS4yNS03LjQxLDEuMjVIMjM2di0xNGg1LjYyYTkuNTcsOS41NywwLDAsMSw3LDIuOTMsNy4wNSw3LjA1LDAsMCwxLDEuODUsNC45MkE2LjMzLDYuMzMsMCwwLDEsMjQ4LjMxLDExMi4yNVoiLz4NCiAgICAgICAgICA8cGF0aCBpZD0iX1BhdGhfIiBkYXRhLW5hbWU9IiZsdDtQYXRoJmd0OyIgY2xhc3M9ImNscy00IiBkPSJNMjAyLjksMTE5LjExYTguMTIsOC4xMiwwLDAsMC03LjI4LDQuNTJsLTE2LTEuMjIsNy4yMi0zMC45MkgxNzR2MjJIMTUzdi0yMkgxMzZ2NTZoMTd2LTIxaDIxdjIxaDIwLjMxYy0yLjcyLDAtNS0xLjUzLTctM2ExOS4xOSwxOS4xOSwwLDAsMS00LjczLTQuODMsMjMuNTgsMjMuNTgsMCwwLDEtMy02LjZsMTYtMi4yNmE4LjExLDguMTEsMCwxLDAsNy4yNi0xMS43MloiLz4NCiAgICAgICAgPC9nPg0KICAgICAgPC9nPg0KICAgICAgPHJlY3QgY2xhc3M9ImNscy0zIiB4PSIxNzcuNjYiIHk9IjU3LjY2IiB3aWR0aD0iOTIuMjgiIGhlaWdodD0iOS4zOCIgcng9IjMuNSIgcnk9IjMuNSIvPg0KICAgIDwvZz4NCiAgPC9nPg0KPC9zdmc+DQo="

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hubView = __webpack_require__(16);

var _hubView2 = _interopRequireDefault(_hubView);

var _contentTypeSection = __webpack_require__(15);

var _contentTypeSection2 = _interopRequireDefault(_contentTypeSection);

var _uploadSection = __webpack_require__(18);

var _uploadSection2 = _interopRequireDefault(_uploadSection);

var _hubServices = __webpack_require__(3);

var _hubServices2 = _interopRequireDefault(_hubServices);

var _eventful = __webpack_require__(0);

var _errors = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {object} HubState
 * @property {string} title
 * @property {string} sectionId
 * @property {boolean} expanded
 * @property {string} apiRootUrl
 */
/**
 * @typedef {object} ErrorMessage
 * @property {string} message
 * @property {string} errorCode
 */
/**
 * @typedef {object} SelectedElement
 * @property {HTMLElement} element
 * @property {string} id
 */
/**
 * Select event
 * @event Hub#select
 * @type {SelectedElement}
 */
/**
 * Error event
 * @event Hub#error
 * @type {ErrorMessage}
 */
/**
 * Upload event
 * @event Hub#upload
 * @type {Object}
 */
/**
 * @class
 * @mixes Eventful
 * @fires Hub#select
 * @fires Hub#error
 * @fires Hub#upload
 */
var Hub = function () {
  /**
   * @param {HubState} state
   */
  function Hub(state) {
    _classCallCheck(this, Hub);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    // controllers
    this.contentTypeSection = new _contentTypeSection2.default(state);
    this.uploadSection = new _uploadSection2.default(state);

    // views
    this.view = new _hubView2.default(state);

    // services
    this.services = new _hubServices2.default({
      apiRootUrl: state.apiRootUrl
    });

    // propagate controller events
    this.propagate(['select', 'error'], this.contentTypeSection);
    this.propagate(['upload'], this.uploadSection);

    // handle events
    this.on('select', this.setPanelTitle, this);
    this.on('select', this.view.closePanel, this.view);
    this.view.on('tab-change', this.view.setSectionType, this.view);
    this.view.on('panel-change', this.view.togglePanelOpen.bind(this.view), this.view);

    this.initTabPanel();
  }

  /**
   * Returns the promise of a content type
   * @param {string} machineName
   * @return {Promise.<ContentType>}
   */


  _createClass(Hub, [{
    key: 'getContentType',
    value: function getContentType(machineName) {
      return this.services.contentType(machineName);
    }

    /**
     * Sets the title of the panel
     *
     * @param {string} id
     */

  }, {
    key: 'setPanelTitle',
    value: function setPanelTitle(_ref) {
      var _this = this;

      var id = _ref.id;

      this.getContentType(id).then(function (_ref2) {
        var title = _ref2.title;
        return _this.view.setTitle(title);
      });
    }

    /**
     * Initiates the tab panel
     */

  }, {
    key: 'initTabPanel',
    value: function initTabPanel() {
      var _this2 = this;

      var tabConfigs = [{
        title: 'Create Content',
        id: 'content-types',
        content: this.contentTypeSection.getElement(),
        selected: true
      }, {
        title: 'Upload',
        id: 'upload',
        content: this.uploadSection.getElement()
      }];

      tabConfigs.forEach(function (tabConfig) {
        return _this2.view.addTab(tabConfig);
      });
      this.view.addBottomBorder(); // Adds an animated bottom border to each tab
      this.view.initTabPanel();
    }

    /**
     * Returns the root element in the view
     *
     * @return {HTMLElement}
     */

  }, {
    key: 'getElement',
    value: function getElement() {
      return this.view.getElement();
    }
  }]);

  return Hub;
}();

exports.default = Hub;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _elements = __webpack_require__(2);

var _functional = __webpack_require__(1);

var _eventful = __webpack_require__(0);

var _panel = __webpack_require__(6);

var _panel2 = _interopRequireDefault(_panel);

var _events = __webpack_require__(5);

var _contentTypePlaceholder = __webpack_require__(7);

var _contentTypePlaceholder2 = _interopRequireDefault(_contentTypePlaceholder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @constant {string}
 */
var ATTRIBUTE_CONTENT_TYPE_ID = 'data-id';

/**
 * @function
 */
var _hide = (0, _elements.setAttribute)('aria-hidden', 'true');

/**
 * @function
 */
var _show = (0, _elements.setAttribute)('aria-hidden', 'false');

/**
 * Toggles the visibility if an element
 *
 * @param {HTMLElement} element
 * @param {boolean} visible
 */
var toggleVisibility = function toggleVisibility(element, visible) {
  return (visible ? _show : _hide)(element);
};

/**
 * Checks if a string is empty
 *
 * @param {string} text
 *
 * @return {boolean}
 */
var isEmpty = function isEmpty(text) {
  return typeof text === 'string' && text.length === 0;
};

/**
 * @class
 * @mixes Eventful
 */

var ContentTypeDetailView = function () {
  function ContentTypeDetailView(state) {
    _classCallCheck(this, ContentTypeDetailView);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    // back button
    var backButtonElement = document.createElement('div');
    backButtonElement.className = 'back-button icon-arrow-thick';
    (0, _events.relayClickEventAs)('close', this, backButtonElement);

    // image
    this.image = document.createElement('img');
    this.image.className = 'img-responsive';

    var imageWrapperElement = document.createElement('div');
    imageWrapperElement.className = 'image-wrapper';
    imageWrapperElement.appendChild(this.image);

    // title
    this.title = document.createElement('h3');

    // author
    this.author = document.createElement('div');
    this.author.className = 'author';
    this.author.innerHTML = 'by Joubel'; // TODO Make dynamic

    // description
    this.description = document.createElement('p');
    this.description.className = 'small';

    // demo button
    this.demoButton = document.createElement('a');
    this.demoButton.className = 'button';
    this.demoButton.innerHTML = 'Content Demo';
    this.demoButton.setAttribute('target', '_blank');
    _hide(this.demoButton);

    var textDetails = document.createElement('div');
    textDetails.className = 'text-details';
    textDetails.appendChild(this.title);
    textDetails.appendChild(this.author);
    textDetails.appendChild(this.description);
    textDetails.appendChild(this.demoButton);

    var detailsElement = document.createElement('div');
    detailsElement.className = 'container';
    detailsElement.appendChild(imageWrapperElement);
    detailsElement.appendChild(textDetails);

    // use button
    this.useButton = document.createElement('span');
    this.useButton.className = 'button button-primary';
    this.useButton.innerHTML = 'Use';
    _hide(this.useButton);
    (0, _events.relayClickEventAs)('select', this, this.useButton);

    // install button
    this.installButton = document.createElement('span');
    this.installButton.className = 'button button-inverse-primary';
    this.installButton.innerHTML = 'Install';
    _hide(this.installButton);
    (0, _events.relayClickEventAs)('install', this, this.installButton);

    var buttonBar = document.createElement('div');
    buttonBar.className = 'button-bar';
    buttonBar.appendChild(this.useButton);
    buttonBar.appendChild(this.installButton);

    // licence panel
    var licencePanel = this.createPanel('The Licence Info', 'ipsum lorum', 'licence-panel');
    var pluginsPanel = this.createPanel('Available plugins', 'ipsum lorum', 'plugins-panel');
    var publisherPanel = this.createPanel('Publisher Info', 'ipsum lorum', 'publisher-panel');

    // panel group
    var panelGroupElement = document.createElement('div');
    panelGroupElement.className = 'panel-group';
    panelGroupElement.appendChild(licencePanel);
    panelGroupElement.appendChild(pluginsPanel);
    panelGroupElement.appendChild(publisherPanel);

    // images
    this.carousel = document.createElement('ul');

    // add root element
    this.rootElement = document.createElement('div');
    this.rootElement.className = 'content-type-detail';
    this.rootElement.setAttribute('aria-hidden', 'true');
    this.rootElement.appendChild(backButtonElement);
    this.rootElement.appendChild(detailsElement);
    this.rootElement.appendChild(buttonBar);
    this.rootElement.appendChild(this.carousel);
    this.rootElement.appendChild(panelGroupElement);
  }

  /**
   * Creates a panel
   *
   * @param {string} title
   * @param {string} body
   * @param {string} bodyId
   *
   * @return {HTMLElement}
   */


  _createClass(ContentTypeDetailView, [{
    key: "createPanel",
    value: function createPanel(title, body, bodyId) {
      var headerEl = document.createElement('div');
      headerEl.className = 'panel-header';
      headerEl.setAttribute('aria-expanded', 'false');
      headerEl.setAttribute('aria-controls', bodyId);
      headerEl.innerHTML = title;

      var bodyInnerEl = document.createElement('div');
      bodyInnerEl.className = 'panel-body-inner';
      bodyInnerEl.innerHTML = body;

      var bodyEl = document.createElement('div');
      bodyEl.className = 'panel-body';
      bodyEl.id = bodyId;
      bodyEl.setAttribute('aria-hidden', 'true');
      bodyEl.appendChild(bodyInnerEl);

      var panelEl = document.createElement('div');
      panelEl.className = 'panel';
      panelEl.appendChild(headerEl);
      panelEl.appendChild(bodyEl);

      (0, _panel2.default)(panelEl);

      return panelEl;
    }

    /**
     * Add image to the carousel
     *
     * @param {object} image
     */

  }, {
    key: "addImageToCarousel",
    value: function addImageToCarousel(image) {
      var item = document.createElement('li');
      item.innerHTML = "<img src=\"" + image.url + "\" alt=\"" + image.alt + "\" style=\"width: 100px;\"/>";

      this.carousel.appendChild(item);
    }

    /**
     * Sets the image
     *
     * @param {string} src
     */

  }, {
    key: "setImage",
    value: function setImage(src) {
      this.image.setAttribute('src', src || _contentTypePlaceholder2.default);
    }

    /**
     * Sets the title
     *
     * @param {string} id
     */

  }, {
    key: "setId",
    value: function setId(id) {
      this.installButton.setAttribute(ATTRIBUTE_CONTENT_TYPE_ID, id);
      this.useButton.setAttribute(ATTRIBUTE_CONTENT_TYPE_ID, id);
    }

    /**
     * Sets the title
     *
     * @param {string} title
     */

  }, {
    key: "setTitle",
    value: function setTitle(title) {
      this.title.innerHTML = title;
    }

    /**
     * Sets the long description
     *
     * @param {string} text
     */

  }, {
    key: "setDescription",
    value: function setDescription(text) {
      this.description.innerHTML = text;
    }

    /**
     * Sets the example url
     *
     * @param {string} url
     */

  }, {
    key: "setExample",
    value: function setExample(url) {
      this.demoButton.setAttribute('href', url || '#');
      toggleVisibility(this.demoButton, !isEmpty(url));
    }

    /**
     * Sets if the content type is installed
     *
     * @param {boolean} installed
     */

  }, {
    key: "setIsInstalled",
    value: function setIsInstalled(installed) {
      toggleVisibility(this.useButton, installed);
      toggleVisibility(this.installButton, !installed);
    }

    /**
     * Hides the root element
     */

  }, {
    key: "hide",
    value: function hide() {
      _hide(this.rootElement);
    }

    /**
     * Shows the root element
     */

  }, {
    key: "show",
    value: function show() {
      _show(this.rootElement);
    }

    /**
     * Returns the root html element
     * @return {HTMLElement}
     */

  }, {
    key: "getElement",
    value: function getElement() {
      return this.rootElement;
    }
  }]);

  return ContentTypeDetailView;
}();

exports.default = ContentTypeDetailView;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _contentTypeDetailView = __webpack_require__(10);

var _contentTypeDetailView2 = _interopRequireDefault(_contentTypeDetailView);

var _hubServices = __webpack_require__(3);

var _hubServices2 = _interopRequireDefault(_hubServices);

var _eventful = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @mixes Eventful
 */
var ContentTypeDetail = function () {
  function ContentTypeDetail(state) {
    _classCallCheck(this, ContentTypeDetail);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    // services
    this.services = new _hubServices2.default({
      apiRootUrl: state.apiRootUrl
    });

    // views
    this.view = new _contentTypeDetailView2.default(state);
    this.view.on('install', this.install, this);

    // propagate events
    this.propagate(['close', 'select'], this.view);
  }

  /**
   * Hides the detail view
   */


  _createClass(ContentTypeDetail, [{
    key: "hide",
    value: function hide() {
      this.view.hide();
    }

    /**
     * Shows the detail view
     */

  }, {
    key: "show",
    value: function show() {
      this.view.show();
    }

    /**
     * Loads a Content Type description
     *
     * @param {string} id
     *
     * @return {Promise.<ContentType>}
     */

  }, {
    key: "loadById",
    value: function loadById(id) {
      this.services.contentType(id).then(this.update.bind(this));
    }

    /**
     * Loads a Content Type description
     *
     * @param {string} id
     *
     * @return {Promise.<ContentType>}
     */

  }, {
    key: "install",
    value: function install(_ref) {
      var _this = this;

      var id = _ref.id;

      return this.services.contentType(id).then(function (contentType) {
        return contentType.machineName;
      }).then(function (machineName) {
        return _this.services.installContentType(machineName);
      }).then(function (contentType) {
        return console.debug('TODO, gui updates');
      });
    }

    /**
     * Updates the view with the content type data
     *
     * @param {ContentType} contentType
     */

  }, {
    key: "update",
    value: function update(contentType) {
      this.view.setId(contentType.machineName);
      this.view.setTitle(contentType.title);
      this.view.setDescription(contentType.description);
      this.view.setImage(contentType.icon);
      this.view.setExample(contentType.example);
      this.view.setIsInstalled(!!contentType.installed);

      contentType.screenshots.forEach(this.view.addImageToCarousel, this.view);
    }

    /**
     * Returns the root html element
     *
     * @return {HTMLElement}
     */

  }, {
    key: "getElement",
    value: function getElement() {
      return this.view.getElement();
    }
  }]);

  return ContentTypeDetail;
}();

exports.default = ContentTypeDetail;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functional = __webpack_require__(1);

var _elements = __webpack_require__(2);

var _eventful = __webpack_require__(0);

var _events = __webpack_require__(5);

var _contentTypePlaceholder = __webpack_require__(7);

var _contentTypePlaceholder2 = _interopRequireDefault(_contentTypePlaceholder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @function
 */
var _hide = (0, _elements.setAttribute)('aria-hidden', 'true');

/**
 * @function
 */
var _show = (0, _elements.setAttribute)('aria-hidden', 'false');

/**
 * @class
 * @mixes Eventful
 * @fires Hub#select
 * @fires ContentTypeList#row-selected
 */

var ContentTypeListView = function () {
  function ContentTypeListView(state) {
    _classCallCheck(this, ContentTypeListView);

    this.state = state;

    console.log('place', _contentTypePlaceholder2.default);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    // create root element
    this.rootElement = document.createElement('ul');
    this.rootElement.className = 'content-type-list';
  }

  /**
   * Hides the root element
   */


  _createClass(ContentTypeListView, [{
    key: "hide",
    value: function hide() {
      _hide(this.rootElement);
    }

    /**
     * Shows the root element
     */

  }, {
    key: "show",
    value: function show() {
      _show(this.rootElement);
    }

    /**
     * Removes all rows from root element
     */

  }, {
    key: "removeAllRows",
    value: function removeAllRows() {
      if (this.rootElement) {
        while (this.rootElement.firstChild) {
          this.rootElement.removeChild(this.rootElement.firstChild);
        }
      }
    }

    /**
     * Adds a row
     *
     * @param {ContentType} contentType
     */

  }, {
    key: "addRow",
    value: function addRow(contentType) {
      var row = this.createContentTypeRow(contentType, this);
      (0, _events.relayClickEventAs)('row-selected', this, row);
      this.rootElement.appendChild(row);
    }

    /**
     * Takes a Content Type configuration and creates a row dom
     *
     * @param {ContentType} contentType
     * @param {Eventful} scope
     *
     * @return {HTMLElement}
     */

  }, {
    key: "createContentTypeRow",
    value: function createContentTypeRow(contentType, scope) {
      // row item
      var element = document.createElement('li');
      element.id = "content-type-" + contentType.machineName;
      element.setAttribute('data-id', contentType.machineName);

      // create button config
      var useButtonConfig = { text: 'Use', cls: 'button-primary' };
      var installButtonConfig = { text: 'install', cls: 'button-inverse-primary' };
      var button = contentType.installed ? useButtonConfig : installButtonConfig;

      var title = contentType.title || contentType.machineName;
      var description = contentType.summary || '';

      var image = contentType.icon || _contentTypePlaceholder2.default;

      // create html
      element.innerHTML = "\n      <img class=\"img-responsive\" src=\"" + image + "\">\n      <span class=\"button " + button.cls + "\" data-id=\"" + contentType.machineName + "\" tabindex=\"0\">" + button.text + "</span>\n      <h4>" + title + "</h4>\n      <div class=\"description\">" + description + "</div>\n   ";

      // handle use button
      var useButton = element.querySelector('.button-primary');
      if (useButton) {
        (0, _events.relayClickEventAs)('select', scope, useButton);
      }

      return element;
    }

    /**
     * Returns the root element
     *
     * @return {HTMLElement}
     */

  }, {
    key: "getElement",
    value: function getElement() {
      return this.rootElement;
    }
  }]);

  return ContentTypeListView;
}();

exports.default = ContentTypeListView;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _contentTypeListView = __webpack_require__(12);

var _contentTypeListView2 = _interopRequireDefault(_contentTypeListView);

var _eventful = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Row selected event
 * @event ContentTypeList#row-selected
 * @type {SelectedElement}
 */
/**
 * Update content type list event
 * @event ContentTypeList#update-content-type-list
 * @type {SelectedElement}
 */
/**
 * @class
 * @mixes Eventful
 * @fires Hub#select
 * @fires ContentTypeList#row-selected
 * @fires ContentTypeList#update-content-type-list
 */
var ContentTypeList = function () {
  function ContentTypeList(state) {
    _classCallCheck(this, ContentTypeList);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    // add the view
    this.view = new _contentTypeListView2.default(state);
    this.propagate(['row-selected', 'select'], this.view);
  }

  /**
   * Hide this element
   */


  _createClass(ContentTypeList, [{
    key: 'hide',
    value: function hide() {
      this.view.hide();
    }

    /**
     * Show this element
     */

  }, {
    key: 'show',
    value: function show() {
      this.view.show();
    }

    /**
     * Update the list with new content types
     *
     * @param {ContentType[]} contentTypes
     */

  }, {
    key: 'update',
    value: function update(contentTypes) {
      this.view.removeAllRows();
      contentTypes.forEach(this.view.addRow, this.view);
      this.fire('update-content-type-list', {});
    }

    /**
     * Returns the views root element
     *
     * @return {HTMLElement}
     */

  }, {
    key: 'getElement',
    value: function getElement() {
      return this.view.getElement();
    }
  }]);

  return ContentTypeList;
}();

exports.default = ContentTypeList;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventful = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class ContentBrowserView
 * @mixes Eventful
 */
var ContentBrowserView = function () {
  /**
   * @constructor
   * @param {object} state
   */
  function ContentBrowserView(state) {
    _classCallCheck(this, ContentBrowserView);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    // create elements
    var menu = this.createMenuElement();
    var inputGroup = this.createInputGroupElement();

    // menu group
    var menuGroup = document.createElement('div');
    menuGroup.className = 'menu-group';
    menuGroup.appendChild(menu);
    menuGroup.appendChild(inputGroup);

    // root element
    this.rootElement = document.createElement('div');
    this.rootElement.appendChild(menuGroup);
  }

  /**
   * Adds a menu item
   *
   * @param {string} text
   *
   * @return {HTMLElement}
   */


  _createClass(ContentBrowserView, [{
    key: 'addMenuItem',
    value: function addMenuItem(text) {
      var _this = this;

      var element = document.createElement('li');
      element.setAttribute('role', 'menuitem');
      element.innerHTML = text;

      element.addEventListener('click', function (event) {
        _this.fire('menu-selected', {
          element: event.target
        });
      });

      // sets first to be selected
      if (this.menuBarElement.childElementCount < 1) {
        element.setAttribute('aria-selected', 'true');
      }

      // add to menu bar
      this.menuBarElement.appendChild(element);

      return element;
    }

    /**
     * Creates the menu bar element
     *
     * @return {Element}
     */

  }, {
    key: 'createMenuElement',
    value: function createMenuElement() {
      this.menuBarElement = document.createElement('ul');
      this.menuBarElement.setAttribute('role', 'menubar');
      this.menuBarElement.className = 'h5p-menu';

      var navElement = document.createElement('nav');
      navElement.appendChild(this.menuBarElement);

      var title = document.createElement('div');
      title.className = "menu-title";
      title.innerHTML = "Browse content types";

      var menu = document.createElement('div');
      menu.className = "menu";
      menu.appendChild(title);
      menu.appendChild(navElement);

      return menu;
    }

    /**
     * Creates the input group used for search
     *
     * @return {HTMLElement}
     */

  }, {
    key: 'createInputGroupElement',
    value: function createInputGroupElement() {
      var _this2 = this;

      // input field
      var inputField = document.createElement('input');
      inputField.id = "hub-search-bar";
      inputField.className = 'form-control form-control-rounded';
      inputField.setAttribute('type', 'text');
      inputField.setAttribute('placeholder', "Search for Content Types");
      inputField.addEventListener('keyup', function (event) {
        _this2.fire('search', {
          element: event.target,
          query: event.target.value
        });
      });

      // input button
      var inputButton = document.createElement('div');
      inputButton.className = 'input-group-addon icon-search';
      inputButton.onclick = function () {
        this.parentElement.querySelector('#search-bar').focus();
      };

      // input group
      var inputGroup = document.createElement('div');
      inputGroup.className = 'input-group';
      inputGroup.appendChild(inputField);
      inputGroup.appendChild(inputButton);

      return inputGroup;
    }

    /**
     * Returns the root element of the content browser
     *
     * @return {HTMLElement}
     */

  }, {
    key: 'getElement',
    value: function getElement() {
      return this.rootElement;
    }
  }]);

  return ContentBrowserView;
}();

exports.default = ContentBrowserView;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _contentTypeSectionView = __webpack_require__(14);

var _contentTypeSectionView2 = _interopRequireDefault(_contentTypeSectionView);

var _searchService = __webpack_require__(17);

var _searchService2 = _interopRequireDefault(_searchService);

var _contentTypeList = __webpack_require__(13);

var _contentTypeList2 = _interopRequireDefault(_contentTypeList);

var _contentTypeDetail = __webpack_require__(11);

var _contentTypeDetail2 = _interopRequireDefault(_contentTypeDetail);

var _eventful = __webpack_require__(0);

var _errors = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class ContentTypeSection
 * @mixes Eventful
 *
 * @fires Hub#select
 */
var ContentTypeSection = function () {
  /**
   * @param {HubState} state
   */
  function ContentTypeSection(state) {
    var _this = this;

    _classCallCheck(this, ContentTypeSection);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    // add view
    this.view = new _contentTypeSectionView2.default(state);

    // controller
    this.searchService = new _searchService2.default({ apiRootUrl: state.apiRootUrl });
    this.contentTypeList = new _contentTypeList2.default();
    this.contentTypeDetail = new _contentTypeDetail2.default({ apiRootUrl: state.apiRootUrl });

    // add menu items
    ['My Content Types', 'Newest', 'Most Popular', 'Recommended'].forEach(function (menuText) {
      return _this.view.addMenuItem(menuText);
    });

    // Element for holding list and details views
    var section = document.createElement('div');
    section.classList.add('content-type-section');

    this.rootElement = section;
    this.rootElement.appendChild(this.contentTypeList.getElement());
    this.rootElement.appendChild(this.contentTypeDetail.getElement());

    this.view.getElement().appendChild(this.rootElement);

    // propagate events
    this.propagate(['select', 'update-content-type-list'], this.contentTypeList);
    this.propagate(['select'], this.contentTypeDetail);

    // register listeners
    this.view.on('search', this.search, this);
    this.view.on('menu-selected', this.applySearchFilter, this);
    this.contentTypeList.on('row-selected', this.showDetailView, this);
    this.contentTypeDetail.on('close', this.closeDetailView, this);
    this.contentTypeDetail.on('select', this.closeDetailView, this);

    this.initContentTypeList();
  }

  /**
   * Initiates the content type list with a search
   */


  _createClass(ContentTypeSection, [{
    key: "initContentTypeList",
    value: function initContentTypeList() {
      var _this2 = this;

      // initialize by search
      this.searchService.search("").then(function (contentTypes) {
        return _this2.contentTypeList.update(contentTypes);
      }).catch(function (error) {
        return _this2.fire('error', error);
      });
    }

    /**
     * Executes a search and updates the content type list
     *
     * @param {string} query
     */

  }, {
    key: "search",
    value: function search(_ref) {
      var _this3 = this;

      var query = _ref.query;

      this.searchService.search(query).then(function (contentTypes) {
        return _this3.contentTypeList.update(contentTypes);
      });
    }

    /**
     * Should apply a search filter
     */

  }, {
    key: "applySearchFilter",
    value: function applySearchFilter() {
      console.debug('ContentTypeSection: menu was clicked!', event);
    }

    /**
     * Shows detail view
     *
     * @param {string} id
     */

  }, {
    key: "showDetailView",
    value: function showDetailView(_ref2) {
      var id = _ref2.id;

      this.contentTypeList.hide();
      this.contentTypeDetail.loadById(id);
      this.contentTypeDetail.show();
    }

    /**
     * Close detail view
     */

  }, {
    key: "closeDetailView",
    value: function closeDetailView() {
      this.contentTypeDetail.hide();
      this.contentTypeList.show();
    }

    /**
     * Returns the element
     *
     * @return {HTMLElement}
     */

  }, {
    key: "getElement",
    value: function getElement() {
      return this.view.getElement();
    }
  }]);

  return ContentTypeSection;
}();

exports.default = ContentTypeSection;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _panel = __webpack_require__(6);

var _panel2 = _interopRequireDefault(_panel);

var _tabPanel = __webpack_require__(19);

var _tabPanel2 = _interopRequireDefault(_tabPanel);

var _functional = __webpack_require__(1);

var _elements = __webpack_require__(2);

var _eventful = __webpack_require__(0);

var _events = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Tab change event
 * @event HubView#tab-change
 * @type {SelectedElement}
 */
/**
 * Panel open or close event
 * @event HubView#panel-change
 * @type {SelectedElement}
 */
/**
 * @constant {string}
 */
var ATTRIBUTE_DATA_ID = 'data-id';

/**
 * @function
 */
var isOpen = (0, _elements.hasAttribute)('open');

/**
 * @class
 * @mixes Eventful
 * @fires HubView#tab-change
 */

var HubView = function () {
  /**
   * @param {HubState} state
   */
  function HubView(state) {
    _classCallCheck(this, HubView);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    this.renderTabPanel(state);
    this.renderPanel(state);
  }

  /**
   * Closes the panel
   */


  _createClass(HubView, [{
    key: "closePanel",
    value: function closePanel() {
      this.title.setAttribute('aria-expanded', 'false');
    }

    /**
     * Sets the title
     *
     * @param {string} title
     */

  }, {
    key: "setTitle",
    value: function setTitle(title) {
      this.title.innerHTML = title;
    }

    /**
     * Creates the dom for the panel
     *
     * @param {string} title
     * @param {string} sectionId
     * @param {boolean} expanded
     */

  }, {
    key: "renderPanel",
    value: function renderPanel(_ref) {
      var _ref$title = _ref.title,
          title = _ref$title === undefined ? '' : _ref$title,
          _ref$sectionId = _ref.sectionId,
          sectionId = _ref$sectionId === undefined ? 'content-types' : _ref$sectionId,
          _ref$expanded = _ref.expanded,
          expanded = _ref$expanded === undefined ? false : _ref$expanded;

      /**
       * @type {HTMLElement}
       */
      this.title = document.createElement('div');
      this.title.className += "panel-header icon-hub-icon";
      this.title.setAttribute('aria-expanded', (!!expanded).toString());
      this.title.setAttribute('aria-controls', "panel-body-" + sectionId);
      this.title.innerHTML = title;
      (0, _events.relayClickEventAs)('panel-change', this, this.title);

      /**
       * @type {HTMLElement}
       */
      this.body = document.createElement('div');
      this.body.className += "panel-body";
      this.body.setAttribute('aria-hidden', (!expanded).toString());
      this.body.id = "panel-body-" + sectionId;
      this.body.appendChild(this.tabContainerElement);

      /**
       * @type {HTMLElement}
       */
      this.panel = document.createElement('div');
      this.panel.className += "panel h5p-section-" + sectionId;
      if (expanded) {
        this.panel.setAttribute('open', '');
      }
      this.panel.appendChild(this.title);
      this.panel.appendChild(this.body);
      /**
       * @type {HTMLElement}
       */
      this.rootElement = document.createElement('div');
      this.rootElement.className += "h5p h5p-hub";
      this.rootElement.appendChild(this.panel);
      (0, _panel2.default)(this.rootElement);
    }

    /**
     * Set if panel is open, this is used for outer border color
     */

  }, {
    key: "togglePanelOpen",
    value: function togglePanelOpen() {
      var panel = this.panel;
      if (isOpen(panel)) {
        panel.removeAttribute('open');
      } else {
        panel.setAttribute('open', '');
        setTimeout(function () {
          panel.querySelector('#hub-search-bar').focus();
        }, 20);
      }
    }

    /**
     * Creates the dom for the tab panel
     */

  }, {
    key: "renderTabPanel",
    value: function renderTabPanel(state) {
      /**
       * @type {HTMLElement}
       */
      this.tablist = document.createElement('ul');
      this.tablist.className += "tablist";
      this.tablist.setAttribute('role', 'tablist');

      /**
       * @type {HTMLElement}
       */
      this.tabListWrapper = document.createElement('nav');
      this.tabListWrapper.appendChild(this.tablist);

      /**
       * @type {HTMLElement}
       */
      this.tabContainerElement = document.createElement('div');
      this.tabContainerElement.className += 'tab-panel';
      this.tabContainerElement.appendChild(this.tabListWrapper);
    }

    /**
     * Adds a tab
     *
     * @param {string} title
     * @param {string} id
     * @param {HTMLElement} content
     * @param {boolean} selected
     */

  }, {
    key: "addTab",
    value: function addTab(_ref2) {
      var title = _ref2.title,
          id = _ref2.id,
          content = _ref2.content,
          _ref2$selected = _ref2.selected,
          selected = _ref2$selected === undefined ? false : _ref2$selected;

      var tabId = "tab-" + id;
      var tabPanelId = "tab-panel-" + id;

      var tab = document.createElement('li');
      tab.className += 'tab';
      tab.id = tabId;
      tab.setAttribute('aria-controls', tabPanelId);
      tab.setAttribute('aria-selected', selected.toString());
      tab.setAttribute(ATTRIBUTE_DATA_ID, id);
      tab.setAttribute('role', 'tab');
      tab.innerHTML = title;
      (0, _events.relayClickEventAs)('tab-change', this, tab);

      var tabPanel = document.createElement('div');
      tabPanel.id = tabPanelId;
      tabPanel.className += 'tabpanel';
      tabPanel.setAttribute('aria-lablledby', tabId);
      tabPanel.setAttribute('aria-hidden', (!selected).toString());
      tabPanel.setAttribute('role', 'tabpanel');
      tabPanel.appendChild(content);

      this.tablist.appendChild(tab);
      this.tabContainerElement.appendChild(tabPanel);
    }

    /**
     * Adds an animated border to the bottom of the tab
     */

  }, {
    key: "addBottomBorder",
    value: function addBottomBorder() {
      this.tablist.appendChild(document.createElement('span'));
    }
  }, {
    key: "initTabPanel",
    value: function initTabPanel() {
      (0, _tabPanel2.default)(this.tabContainerElement);
    }

    /**
     * Sets the section
     *
     * @param {string} id
     */

  }, {
    key: "setSectionType",
    value: function setSectionType(_ref3) {
      var id = _ref3.id;

      this.panel.className = "h5p-section-" + id + " panel";
    }

    /**
     * Returns the root html element
     *
     * @return {HTMLElement}
     */

  }, {
    key: "getElement",
    value: function getElement() {
      return this.rootElement;
    }
  }]);

  return HubView;
}();

exports.default = HubView;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functional = __webpack_require__(1);

var _hubServices = __webpack_require__(3);

var _hubServices2 = _interopRequireDefault(_hubServices);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * The Search Service gets a content type from hub-services.js
 * in the form of a promise. It then generates a score based
 * on the different weightings of the content type fields and
 * sorts the results based on the generated score.
 */
var SearchService = function () {
  /**
   * @param {Object} state
   * @param {string} state.apiRootUrl
   */
  function SearchService(state) {
    _classCallCheck(this, SearchService);

    this.services = new _hubServices2.default({
      apiRootUrl: state.apiRootUrl
    });

    // Add content types to the search index
    this.contentTypes = this.services.contentTypes();
  }

  /**
   * Performs a search
   *
   * @param {String} query
   *
   * @return {Promise<ContentType[]>} A promise of an array of content types
   */


  _createClass(SearchService, [{
    key: 'search',
    value: function search(query) {
      return this.contentTypes.then(filterByQuery(query));
    }
  }]);

  return SearchService;
}();

/**
 * Filters a list of content types based on a query
 * @type {Function}
 *
 * @param {string} query
 * @param {ContentType[]} contentTypes
 */


exports.default = SearchService;
var filterByQuery = (0, _functional.curry)(function (query, contentTypes) {
  // Sort alphabetically upon initialization
  if (query == '') {
    return contentTypes.sort(function (a, b) {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
  }

  return contentTypes.map(function (contentType) {
    // Append a search score to each content type
    var result = {
      contentType: contentType,
      score: getSearchScore(query, contentType)
    };
    return result;
  }).filter(function (result) {
    return result.score > 0;
  }) // Only show hits
  .sort(function (a, b) {
    return b.score - a.score;
  }) // Sort by relevance
  .map(function (result) {
    return result.contentType;
  }); // Unwrap result object
});

/**
 * Calculates weighting for different search terms based
 * on existence of substrings
 *
 * @param  {string} query
 * @param  {Object} contentType
 * @return {int}
 */
var getSearchScore = function getSearchScore(query, contentType) {
  var score = 0;
  // Tokenize the query string and ignore spaces 
  var queries = query.split(' ').filter(function (query) {
    return query !== '';
  });

  queries.forEach(function (query) {
    if (hasSubString(query, contentType.title)) {
      score += 100;
    }
    if (hasSubString(query, contentType.summary)) {
      score += 5;
    }
    if (hasSubString(query, contentType.description)) {
      score += 5;
    }
    if (arrayHasSubString(query, contentType.keywords)) {
      score += 5;
    }
  });

  return score;
};

/**
 * Checks if a needle is found in the haystack.
 * Not case sensitive
 *
 * @param {string} needle
 * @param {string} haystack
 * @return {boolean}
 */
var hasSubString = function hasSubString(needle, haystack) {
  if (haystack === undefined) {
    return false;
  }

  return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
};

/**
 * Helper function, checks if array has contains a substring
 *
 * @param  {String} subString
 * @param  {Array} arr
 * @return {boolean}
 */
var arrayHasSubString = function arrayHasSubString(subString, arr) {
  if (arr === undefined || subString === '') {
    return false;
  }

  return arr.some(function (string) {
    return hasSubString(subString, string);
  });
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hubServices = __webpack_require__(3);

var _hubServices2 = _interopRequireDefault(_hubServices);

var _eventful = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @mixes Eventful
 *
 * @fires Hub#upload
 */
var UploadSection = function () {
  function UploadSection(state) {
    var _this = this;

    _classCallCheck(this, UploadSection);

    var self = this;
    _extends(this, (0, _eventful.Eventful)());

    // services
    this.services = new _hubServices2.default({
      apiRootUrl: state.apiRootUrl
    });

    // Input element for the H5P file
    var h5pUpload = document.createElement('input');
    h5pUpload.setAttribute('type', 'file');

    // Sends the H5P file to the plugin
    var useButton = document.createElement('button');
    useButton.textContent = 'Use';
    useButton.addEventListener('click', function () {

      // Add the H5P file to a form, ready for transportation
      var data = new FormData();
      data.append('h5p', h5pUpload.files[0]);

      // Upload content to the plugin
      _this.services.uploadContent(data).then(function (json) {
        // Fire the received data to any listeners
        self.fire('upload', json);
      });
    });

    var element = document.createElement('div');
    element.appendChild(h5pUpload);
    element.appendChild(useButton);

    this.rootElement = element;
  }

  _createClass(UploadSection, [{
    key: 'getElement',
    value: function getElement() {
      return this.rootElement;
    }
  }]);

  return UploadSection;
}();

exports.default = UploadSection;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _elements = __webpack_require__(2);

var _functional = __webpack_require__(1);

/**
 * @type {function}
 */
var hideAll = (0, _functional.forEach)((0, _elements.setAttribute)('aria-hidden', 'true'));

/**
 * @type {function}
 */
var show = (0, _elements.setAttribute)('aria-hidden', 'false');

/**
 * @type {function}
 */
var unSelectAll = (0, _functional.forEach)((0, _elements.setAttribute)('aria-selected', 'false'));

/**
 * Initiates a tab panel
 *
 * @param {HTMLElement} element
 */
function init(element) {
  var tabs = element.querySelectorAll('[role="tab"]');
  var tabPanels = element.querySelectorAll('[role="tabpanel"]');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function (event) {

      unSelectAll(tabs);
      event.target.setAttribute('aria-selected', 'true');

      hideAll(tabPanels);

      var tabPanelId = event.target.getAttribute('aria-controls');
      show(element.querySelector('#' + tabPanelId));
    });
  });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(9);

// Load library
H5P = H5P || {};
H5P.HubClient = __webpack_require__(8).default;
H5P.HubClient.renderErrorMessage = __webpack_require__(4).default;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTgyMjNlOGQwZjBlNTRkNWRmMDQiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvbWl4aW5zL2V2ZW50ZnVsLmpzIiwid2VicGFjazovLy8uLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvdXRpbHMvZnVuY3Rpb25hbC5qcyIsIndlYnBhY2s6Ly8vLi8uLi9oNXAtc2RrL3NyYy9zY3JpcHRzL3V0aWxzL2VsZW1lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2h1Yi1zZXJ2aWNlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy91dGlscy9lcnJvcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdXRpbHMvZXZlbnRzLmpzIiwid2VicGFjazovLy8uLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvY29tcG9uZW50cy9wYW5lbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1hZ2VzL2NvbnRlbnQtdHlwZS1wbGFjZWhvbGRlci5zdmciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvaHViLmpzIiwid2VicGFjazovLy8uL3NyYy9zdHlsZXMvbWFpbi5zY3NzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1kZXRhaWwvY29udGVudC10eXBlLWRldGFpbC12aWV3LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1kZXRhaWwvY29udGVudC10eXBlLWRldGFpbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy9jb250ZW50LXR5cGUtbGlzdC9jb250ZW50LXR5cGUtbGlzdC12aWV3LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1saXN0L2NvbnRlbnQtdHlwZS1saXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1zZWN0aW9uL2NvbnRlbnQtdHlwZS1zZWN0aW9uLXZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvY29udGVudC10eXBlLXNlY3Rpb24vY29udGVudC10eXBlLXNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvaHViLXZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvc2VhcmNoLXNlcnZpY2Uvc2VhcmNoLXNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdXBsb2FkLXNlY3Rpb24vdXBsb2FkLXNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vLi4vaDVwLXNkay9zcmMvc2NyaXB0cy9jb21wb25lbnRzL3RhYi1wYW5lbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9kaXN0LmpzIl0sIm5hbWVzIjpbIkV2ZW50ZnVsIiwibGlzdGVuZXJzIiwib24iLCJ0eXBlIiwibGlzdGVuZXIiLCJzY29wZSIsInRyaWdnZXIiLCJwdXNoIiwiZmlyZSIsImV2ZW50IiwidHJpZ2dlcnMiLCJldmVyeSIsImNhbGwiLCJwcm9wYWdhdGUiLCJ0eXBlcyIsImV2ZW50ZnVsIiwic2VsZiIsImZvckVhY2giLCJjdXJyeSIsImZuIiwiYXJpdHkiLCJsZW5ndGgiLCJmMSIsImFyZ3MiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJmMiIsImFyZ3MyIiwiY29uY2F0IiwiY29tcG9zZSIsImZucyIsInJlZHVjZSIsImYiLCJnIiwiYXJyIiwibWFwIiwiZmlsdGVyIiwic29tZSIsImNvbnRhaW5zIiwidmFsdWUiLCJpbmRleE9mIiwid2l0aG91dCIsInZhbHVlcyIsImludmVyc2VCb29sZWFuU3RyaW5nIiwiYm9vbCIsInRvU3RyaW5nIiwiZ2V0QXR0cmlidXRlIiwibmFtZSIsImVsIiwic2V0QXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwiaGFzQXR0cmlidXRlIiwiYXR0cmlidXRlRXF1YWxzIiwidG9nZ2xlQXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiLCJwYXJlbnQiLCJjaGlsZCIsInF1ZXJ5U2VsZWN0b3IiLCJzZWxlY3RvciIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJIdWJTZXJ2aWNlcyIsImFwaVJvb3RVcmwiLCJ3aW5kb3ciLCJjYWNoZWRDb250ZW50VHlwZXMiLCJmZXRjaCIsIm1ldGhvZCIsImNyZWRlbnRpYWxzIiwidGhlbiIsInJlc3VsdCIsImpzb24iLCJpc1ZhbGlkIiwibGlicmFyaWVzIiwicmVzcG9uc2UiLCJtZXNzYWdlQ29kZSIsIlByb21pc2UiLCJyZWplY3QiLCJyZXNvbHZlIiwibWFjaGluZU5hbWUiLCJjb250ZW50VHlwZXMiLCJjb250ZW50VHlwZSIsImlkIiwiYm9keSIsImZvcm1EYXRhIiwicmVuZGVyRXJyb3JNZXNzYWdlIiwibWVzc2FnZSIsImNsb3NlQnV0dG9uIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwibWVzc2FnZUNvbnRlbnQiLCJ0aXRsZSIsImNvbnRlbnQiLCJtZXNzYWdlV3JhcHBlciIsImRpc21pc3NpYmxlIiwiYnV0dG9uIiwidW5kZWZpbmVkIiwibWVzc2FnZUJ1dHRvbiIsImNvbnNvbGUiLCJsb2ciLCJyZWxheUNsaWNrRXZlbnRBcyIsImVsZW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwic3RvcFByb3BhZ2F0aW9uIiwiaW5pdCIsImlzRXhwYW5kZWQiLCJoaWRlIiwic2hvdyIsInRvZ2dsZUJvZHlWaXNpYmlsaXR5IiwiYm9keUVsZW1lbnQiLCJvbkFyaWFFeHBhbmRlZENoYW5nZSIsInRhcmdldCIsInRpdGxlRWwiLCJib2R5SWQiLCJib2R5RWwiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJvYnNlcnZlIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZU9sZFZhbHVlIiwiYXR0cmlidXRlRmlsdGVyIiwiSHViIiwic3RhdGUiLCJjb250ZW50VHlwZVNlY3Rpb24iLCJ1cGxvYWRTZWN0aW9uIiwidmlldyIsInNlcnZpY2VzIiwic2V0UGFuZWxUaXRsZSIsImNsb3NlUGFuZWwiLCJzZXRTZWN0aW9uVHlwZSIsInRvZ2dsZVBhbmVsT3BlbiIsImJpbmQiLCJpbml0VGFiUGFuZWwiLCJnZXRDb250ZW50VHlwZSIsInNldFRpdGxlIiwidGFiQ29uZmlncyIsImdldEVsZW1lbnQiLCJzZWxlY3RlZCIsImFkZFRhYiIsInRhYkNvbmZpZyIsImFkZEJvdHRvbUJvcmRlciIsIkFUVFJJQlVURV9DT05URU5UX1RZUEVfSUQiLCJ0b2dnbGVWaXNpYmlsaXR5IiwidmlzaWJsZSIsImlzRW1wdHkiLCJ0ZXh0IiwiQ29udGVudFR5cGVEZXRhaWxWaWV3IiwiYmFja0J1dHRvbkVsZW1lbnQiLCJpbWFnZSIsImltYWdlV3JhcHBlckVsZW1lbnQiLCJhdXRob3IiLCJkZXNjcmlwdGlvbiIsImRlbW9CdXR0b24iLCJ0ZXh0RGV0YWlscyIsImRldGFpbHNFbGVtZW50IiwidXNlQnV0dG9uIiwiaW5zdGFsbEJ1dHRvbiIsImJ1dHRvbkJhciIsImxpY2VuY2VQYW5lbCIsImNyZWF0ZVBhbmVsIiwicGx1Z2luc1BhbmVsIiwicHVibGlzaGVyUGFuZWwiLCJwYW5lbEdyb3VwRWxlbWVudCIsImNhcm91c2VsIiwicm9vdEVsZW1lbnQiLCJoZWFkZXJFbCIsImJvZHlJbm5lckVsIiwicGFuZWxFbCIsIml0ZW0iLCJ1cmwiLCJhbHQiLCJzcmMiLCJpbnN0YWxsZWQiLCJDb250ZW50VHlwZURldGFpbCIsImluc3RhbGwiLCJ1cGRhdGUiLCJpbnN0YWxsQ29udGVudFR5cGUiLCJkZWJ1ZyIsInNldElkIiwic2V0RGVzY3JpcHRpb24iLCJzZXRJbWFnZSIsImljb24iLCJzZXRFeGFtcGxlIiwiZXhhbXBsZSIsInNldElzSW5zdGFsbGVkIiwic2NyZWVuc2hvdHMiLCJhZGRJbWFnZVRvQ2Fyb3VzZWwiLCJDb250ZW50VHlwZUxpc3RWaWV3IiwiZmlyc3RDaGlsZCIsInJlbW92ZUNoaWxkIiwicm93IiwiY3JlYXRlQ29udGVudFR5cGVSb3ciLCJ1c2VCdXR0b25Db25maWciLCJjbHMiLCJpbnN0YWxsQnV0dG9uQ29uZmlnIiwic3VtbWFyeSIsIkNvbnRlbnRUeXBlTGlzdCIsInJlbW92ZUFsbFJvd3MiLCJhZGRSb3ciLCJDb250ZW50QnJvd3NlclZpZXciLCJtZW51IiwiY3JlYXRlTWVudUVsZW1lbnQiLCJpbnB1dEdyb3VwIiwiY3JlYXRlSW5wdXRHcm91cEVsZW1lbnQiLCJtZW51R3JvdXAiLCJtZW51QmFyRWxlbWVudCIsImNoaWxkRWxlbWVudENvdW50IiwibmF2RWxlbWVudCIsImlucHV0RmllbGQiLCJxdWVyeSIsImlucHV0QnV0dG9uIiwib25jbGljayIsInBhcmVudEVsZW1lbnQiLCJmb2N1cyIsIkNvbnRlbnRUeXBlU2VjdGlvbiIsInNlYXJjaFNlcnZpY2UiLCJjb250ZW50VHlwZUxpc3QiLCJjb250ZW50VHlwZURldGFpbCIsImFkZE1lbnVJdGVtIiwibWVudVRleHQiLCJzZWN0aW9uIiwiY2xhc3NMaXN0IiwiYWRkIiwic2VhcmNoIiwiYXBwbHlTZWFyY2hGaWx0ZXIiLCJzaG93RGV0YWlsVmlldyIsImNsb3NlRGV0YWlsVmlldyIsImluaXRDb250ZW50VHlwZUxpc3QiLCJjYXRjaCIsImVycm9yIiwibG9hZEJ5SWQiLCJBVFRSSUJVVEVfREFUQV9JRCIsImlzT3BlbiIsIkh1YlZpZXciLCJyZW5kZXJUYWJQYW5lbCIsInJlbmRlclBhbmVsIiwic2VjdGlvbklkIiwiZXhwYW5kZWQiLCJ0YWJDb250YWluZXJFbGVtZW50IiwicGFuZWwiLCJzZXRUaW1lb3V0IiwidGFibGlzdCIsInRhYkxpc3RXcmFwcGVyIiwidGFiSWQiLCJ0YWJQYW5lbElkIiwidGFiIiwidGFiUGFuZWwiLCJTZWFyY2hTZXJ2aWNlIiwiZmlsdGVyQnlRdWVyeSIsInNvcnQiLCJhIiwiYiIsInNjb3JlIiwiZ2V0U2VhcmNoU2NvcmUiLCJxdWVyaWVzIiwic3BsaXQiLCJoYXNTdWJTdHJpbmciLCJhcnJheUhhc1N1YlN0cmluZyIsImtleXdvcmRzIiwibmVlZGxlIiwiaGF5c3RhY2siLCJ0b0xvd2VyQ2FzZSIsInN1YlN0cmluZyIsInN0cmluZyIsIlVwbG9hZFNlY3Rpb24iLCJoNXBVcGxvYWQiLCJ0ZXh0Q29udGVudCIsImRhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsImZpbGVzIiwidXBsb2FkQ29udGVudCIsImhpZGVBbGwiLCJ1blNlbGVjdEFsbCIsInRhYnMiLCJ0YWJQYW5lbHMiLCJyZXF1aXJlIiwiSDVQIiwiSHViQ2xpZW50IiwiZGVmYXVsdCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNoRUE7OztBQUdPLElBQU1BLDhCQUFXLFNBQVhBLFFBQVc7QUFBQSxTQUFPO0FBQzdCQyxlQUFXLEVBRGtCOztBQUc3Qjs7Ozs7Ozs7OztBQVVBQyxRQUFJLFlBQVNDLElBQVQsRUFBZUMsUUFBZixFQUF5QkMsS0FBekIsRUFBZ0M7QUFDbEM7Ozs7O0FBS0EsVUFBTUMsVUFBVTtBQUNkLG9CQUFZRixRQURFO0FBRWQsaUJBQVNDO0FBRkssT0FBaEI7O0FBS0EsV0FBS0osU0FBTCxDQUFlRSxJQUFmLElBQXVCLEtBQUtGLFNBQUwsQ0FBZUUsSUFBZixLQUF3QixFQUEvQztBQUNBLFdBQUtGLFNBQUwsQ0FBZUUsSUFBZixFQUFxQkksSUFBckIsQ0FBMEJELE9BQTFCOztBQUVBLGFBQU8sSUFBUDtBQUNELEtBNUI0Qjs7QUE4QjdCOzs7Ozs7Ozs7QUFTQUUsVUFBTSxjQUFTTCxJQUFULEVBQWVNLEtBQWYsRUFBc0I7QUFDMUIsVUFBTUMsV0FBVyxLQUFLVCxTQUFMLENBQWVFLElBQWYsS0FBd0IsRUFBekM7O0FBRUEsYUFBT08sU0FBU0MsS0FBVCxDQUFlLFVBQVNMLE9BQVQsRUFBa0I7QUFDdEMsZUFBT0EsUUFBUUYsUUFBUixDQUFpQlEsSUFBakIsQ0FBc0JOLFFBQVFELEtBQVIsSUFBaUIsSUFBdkMsRUFBNkNJLEtBQTdDLE1BQXdELEtBQS9EO0FBQ0QsT0FGTSxDQUFQO0FBR0QsS0E3QzRCOztBQStDN0I7Ozs7OztBQU1BSSxlQUFXLG1CQUFTQyxLQUFULEVBQWdCQyxRQUFoQixFQUEwQjtBQUNuQyxVQUFJQyxPQUFPLElBQVg7QUFDQUYsWUFBTUcsT0FBTixDQUFjO0FBQUEsZUFBUUYsU0FBU2IsRUFBVCxDQUFZQyxJQUFaLEVBQWtCO0FBQUEsaUJBQVNhLEtBQUtSLElBQUwsQ0FBVUwsSUFBVixFQUFnQk0sS0FBaEIsQ0FBVDtBQUFBLFNBQWxCLENBQVI7QUFBQSxPQUFkO0FBQ0Q7QUF4RDRCLEdBQVA7QUFBQSxDQUFqQixDOzs7Ozs7Ozs7Ozs7QUNIUDs7Ozs7Ozs7O0FBU08sSUFBTVMsd0JBQVEsU0FBUkEsS0FBUSxDQUFTQyxFQUFULEVBQWE7QUFDaEMsTUFBTUMsUUFBUUQsR0FBR0UsTUFBakI7O0FBRUEsU0FBTyxTQUFTQyxFQUFULEdBQWM7QUFDbkIsUUFBTUMsT0FBT0MsTUFBTUMsU0FBTixDQUFnQkMsS0FBaEIsQ0FBc0JkLElBQXRCLENBQTJCZSxTQUEzQixFQUFzQyxDQUF0QyxDQUFiO0FBQ0EsUUFBSUosS0FBS0YsTUFBTCxJQUFlRCxLQUFuQixFQUEwQjtBQUN4QixhQUFPRCxHQUFHUyxLQUFILENBQVMsSUFBVCxFQUFlTCxJQUFmLENBQVA7QUFDRCxLQUZELE1BR0s7QUFDSCxhQUFPLFNBQVNNLEVBQVQsR0FBYztBQUNuQixZQUFNQyxRQUFRTixNQUFNQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQmQsSUFBdEIsQ0FBMkJlLFNBQTNCLEVBQXNDLENBQXRDLENBQWQ7QUFDQSxlQUFPTCxHQUFHTSxLQUFILENBQVMsSUFBVCxFQUFlTCxLQUFLUSxNQUFMLENBQVlELEtBQVosQ0FBZixDQUFQO0FBQ0QsT0FIRDtBQUlEO0FBQ0YsR0FYRDtBQVlELENBZk07O0FBaUJQOzs7Ozs7Ozs7O0FBVU8sSUFBTUUsNEJBQVUsU0FBVkEsT0FBVTtBQUFBLG9DQUFJQyxHQUFKO0FBQUlBLE9BQUo7QUFBQTs7QUFBQSxTQUFZQSxJQUFJQyxNQUFKLENBQVcsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsV0FBVTtBQUFBLGFBQWFELEVBQUVDLDZCQUFGLENBQWI7QUFBQSxLQUFWO0FBQUEsR0FBWCxDQUFaO0FBQUEsQ0FBaEI7O0FBRVA7Ozs7Ozs7Ozs7O0FBV08sSUFBTW5CLDRCQUFVQyxNQUFNLFVBQVVDLEVBQVYsRUFBY2tCLEdBQWQsRUFBbUI7QUFDOUNBLE1BQUlwQixPQUFKLENBQVlFLEVBQVo7QUFDRCxDQUZzQixDQUFoQjs7QUFJUDs7Ozs7Ozs7Ozs7QUFXTyxJQUFNbUIsb0JBQU1wQixNQUFNLFVBQVVDLEVBQVYsRUFBY2tCLEdBQWQsRUFBbUI7QUFDMUMsU0FBT0EsSUFBSUMsR0FBSixDQUFRbkIsRUFBUixDQUFQO0FBQ0QsQ0FGa0IsQ0FBWjs7QUFJUDs7Ozs7Ozs7Ozs7QUFXTyxJQUFNb0IsMEJBQVNyQixNQUFNLFVBQVVDLEVBQVYsRUFBY2tCLEdBQWQsRUFBbUI7QUFDN0MsU0FBT0EsSUFBSUUsTUFBSixDQUFXcEIsRUFBWCxDQUFQO0FBQ0QsQ0FGcUIsQ0FBZjs7QUFJUDs7Ozs7Ozs7Ozs7QUFXTyxJQUFNcUIsc0JBQU90QixNQUFNLFVBQVVDLEVBQVYsRUFBY2tCLEdBQWQsRUFBbUI7QUFDM0MsU0FBT0EsSUFBSUcsSUFBSixDQUFTckIsRUFBVCxDQUFQO0FBQ0QsQ0FGbUIsQ0FBYjs7QUFJUDs7Ozs7Ozs7Ozs7QUFXTyxJQUFNc0IsOEJBQVd2QixNQUFNLFVBQVV3QixLQUFWLEVBQWlCTCxHQUFqQixFQUFzQjtBQUNsRCxTQUFPQSxJQUFJTSxPQUFKLENBQVlELEtBQVosS0FBc0IsQ0FBQyxDQUE5QjtBQUNELENBRnVCLENBQWpCOztBQUlQOzs7Ozs7Ozs7OztBQVdPLElBQU1FLDRCQUFVMUIsTUFBTSxVQUFVMkIsTUFBVixFQUFrQlIsR0FBbEIsRUFBdUI7QUFDbEQsU0FBT0UsT0FBTztBQUFBLFdBQVMsQ0FBQ0UsU0FBU0MsS0FBVCxFQUFnQkcsTUFBaEIsQ0FBVjtBQUFBLEdBQVAsRUFBMENSLEdBQTFDLENBQVA7QUFDRCxDQUZzQixDQUFoQjs7QUFJUDs7Ozs7Ozs7QUFRTyxJQUFNUyxzREFBdUIsU0FBdkJBLG9CQUF1QixDQUFVQyxJQUFWLEVBQWdCO0FBQ2xELFNBQU8sQ0FBQ0EsU0FBUyxNQUFWLEVBQWtCQyxRQUFsQixFQUFQO0FBQ0QsQ0FGTSxDOzs7Ozs7Ozs7Ozs7OztBQ3hJUDs7QUFFQTs7Ozs7Ozs7O0FBU08sSUFBTUMsc0NBQWUsdUJBQU0sVUFBVUMsSUFBVixFQUFnQkMsRUFBaEIsRUFBb0I7QUFDcEQsU0FBT0EsR0FBR0YsWUFBSCxDQUFnQkMsSUFBaEIsQ0FBUDtBQUNELENBRjJCLENBQXJCOztBQUlQOzs7Ozs7Ozs7QUFTTyxJQUFNRSxzQ0FBZSx1QkFBTSxVQUFVRixJQUFWLEVBQWdCUixLQUFoQixFQUF1QlMsRUFBdkIsRUFBMkI7QUFDM0RBLEtBQUdDLFlBQUgsQ0FBZ0JGLElBQWhCLEVBQXNCUixLQUF0QjtBQUNELENBRjJCLENBQXJCOztBQUlQOzs7Ozs7OztBQVFPLElBQU1XLDRDQUFrQix1QkFBTSxVQUFVSCxJQUFWLEVBQWdCQyxFQUFoQixFQUFvQjtBQUN2REEsS0FBR0UsZUFBSCxDQUFtQkgsSUFBbkI7QUFDRCxDQUY4QixDQUF4Qjs7QUFJUDs7Ozs7Ozs7O0FBU08sSUFBTUksc0NBQWUsdUJBQU0sVUFBVUosSUFBVixFQUFnQkMsRUFBaEIsRUFBb0I7QUFDcEQsU0FBT0EsR0FBR0csWUFBSCxDQUFnQkosSUFBaEIsQ0FBUDtBQUNELENBRjJCLENBQXJCOztBQUlQOzs7Ozs7Ozs7O0FBVU8sSUFBTUssNENBQWtCLHVCQUFNLFVBQVVMLElBQVYsRUFBZ0JSLEtBQWhCLEVBQXVCUyxFQUF2QixFQUEyQjtBQUM5RCxTQUFPQSxHQUFHRixZQUFILENBQWdCQyxJQUFoQixNQUEwQlIsS0FBakM7QUFDRCxDQUY4QixDQUF4Qjs7QUFJUDs7Ozs7Ozs7QUFRTyxJQUFNYyw0Q0FBa0IsdUJBQU0sVUFBVU4sSUFBVixFQUFnQkMsRUFBaEIsRUFBb0I7QUFDdkQsTUFBTVQsUUFBUU8sYUFBYUMsSUFBYixFQUFtQkMsRUFBbkIsQ0FBZDtBQUNBQyxlQUFhRixJQUFiLEVBQW1CLHNDQUFxQlIsS0FBckIsQ0FBbkIsRUFBZ0RTLEVBQWhEO0FBQ0QsQ0FIOEIsQ0FBeEI7O0FBS1A7Ozs7Ozs7OztBQVNPLElBQU1NLG9DQUFjLHVCQUFNLFVBQVVDLE1BQVYsRUFBa0JDLEtBQWxCLEVBQXlCO0FBQ3hELFNBQU9ELE9BQU9ELFdBQVAsQ0FBbUJFLEtBQW5CLENBQVA7QUFDRCxDQUYwQixDQUFwQjs7QUFJUDs7Ozs7Ozs7OztBQVVPLElBQU1DLHdDQUFnQix1QkFBTSxVQUFVQyxRQUFWLEVBQW9CVixFQUFwQixFQUF3QjtBQUN6RCxTQUFPQSxHQUFHUyxhQUFILENBQWlCQyxRQUFqQixDQUFQO0FBQ0QsQ0FGNEIsQ0FBdEI7O0FBSVA7Ozs7Ozs7Ozs7QUFVTyxJQUFNQyw4Q0FBbUIsdUJBQU0sVUFBVUQsUUFBVixFQUFvQlYsRUFBcEIsRUFBd0I7QUFDNUQsU0FBT0EsR0FBR1csZ0JBQUgsQ0FBb0JELFFBQXBCLENBQVA7QUFDRCxDQUYrQixDQUF6QixDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3JIUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBd0JxQkUsVztBQUNuQjs7O0FBR0EsNkJBQTRCO0FBQUEsUUFBZEMsVUFBYyxRQUFkQSxVQUFjOztBQUFBOztBQUMxQixTQUFLQSxVQUFMLEdBQWtCQSxVQUFsQjs7QUFFQSxRQUFHLENBQUNDLE9BQU9DLGtCQUFYLEVBQThCO0FBQzVCO0FBQ0E7O0FBRUFELGFBQU9DLGtCQUFQLEdBQTRCQyxNQUFTLEtBQUtILFVBQWQseUJBQThDO0FBQ3hFSSxnQkFBUSxLQURnRTtBQUV4RUMscUJBQWE7QUFGMkQsT0FBOUMsRUFJM0JDLElBSjJCLENBSXRCO0FBQUEsZUFBVUMsT0FBT0MsSUFBUCxFQUFWO0FBQUEsT0FKc0IsRUFLM0JGLElBTDJCLENBS3RCLEtBQUtHLE9BTGlCLEVBTTNCSCxJQU4yQixDQU10QjtBQUFBLGVBQVFFLEtBQUtFLFNBQWI7QUFBQSxPQU5zQixDQUE1QjtBQU9EO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs0QkFLUUMsUSxFQUFVO0FBQ2hCLFVBQUlBLFNBQVNDLFdBQWIsRUFBMEI7QUFDeEIsZUFBT0MsUUFBUUMsTUFBUixDQUFlSCxRQUFmLENBQVA7QUFDRCxPQUZELE1BR0s7QUFDSCxlQUFPRSxRQUFRRSxPQUFSLENBQWdCSixRQUFoQixDQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7bUNBS2U7QUFDYixhQUFPVixPQUFPQyxrQkFBZDtBQUNEOztBQUVEOzs7Ozs7Ozs7O2dDQU9ZYyxXLEVBQWE7QUFDdkIsYUFBT2YsT0FBT0Msa0JBQVAsQ0FBMEJJLElBQTFCLENBQStCLHdCQUFnQjtBQUNwRCxlQUFPVyxhQUFhMUMsTUFBYixDQUFvQjtBQUFBLGlCQUFlMkMsWUFBWUYsV0FBWixLQUE0QkEsV0FBM0M7QUFBQSxTQUFwQixFQUE0RSxDQUE1RSxDQUFQO0FBQ0QsT0FGTSxDQUFQOztBQUlBOzs7O0FBSUQ7O0FBRUQ7Ozs7Ozs7Ozs7dUNBT21CRyxFLEVBQUk7QUFDckIsYUFBT2hCLE1BQVMsS0FBS0gsVUFBZCwyQkFBOENtQixFQUE5QyxFQUFvRDtBQUN6RGYsZ0JBQVEsTUFEaUQ7QUFFekRDLHFCQUFhLFNBRjRDO0FBR3pEZSxjQUFNO0FBSG1ELE9BQXBELEVBSUpkLElBSkksQ0FJQztBQUFBLGVBQVVDLE9BQU9DLElBQVAsRUFBVjtBQUFBLE9BSkQsQ0FBUDtBQUtEOztBQUVEOzs7Ozs7Ozs7O2tDQU9jYSxRLEVBQVU7QUFDdEIsYUFBT2xCLE1BQVMsS0FBS0gsVUFBZCxxQkFBMEM7QUFDL0NJLGdCQUFRLE1BRHVDO0FBRS9DQyxxQkFBYSxTQUZrQztBQUcvQ2UsY0FBTUM7QUFIeUMsT0FBMUMsRUFJSmYsSUFKSSxDQUlDO0FBQUEsZUFBVUMsT0FBT0MsSUFBUCxFQUFWO0FBQUEsT0FKRCxDQUFQO0FBS0Q7Ozs7OztrQkExRmtCVCxXOzs7Ozs7Ozs7Ozs7a0JDaEJHdUIsa0I7QUFSeEI7Ozs7Ozs7QUFPQTtBQUNlLFNBQVNBLGtCQUFULENBQTRCQyxPQUE1QixFQUFxQztBQUNsRDtBQUNBLE1BQU1DLGNBQWNDLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBcEI7QUFDQUYsY0FBWUcsU0FBWixHQUF3QixPQUF4QjtBQUNBSCxjQUFZSSxTQUFaLEdBQXdCLFNBQXhCOztBQUVBLE1BQU1DLGlCQUFpQkosU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUF2QjtBQUNBRyxpQkFBZUYsU0FBZixHQUEyQixpQkFBM0I7QUFDQUUsaUJBQWVELFNBQWYsR0FBMkIsU0FBU0wsUUFBUU8sS0FBakIsR0FBeUIsT0FBekIsR0FBbUMsS0FBbkMsR0FBMkNQLFFBQVFRLE9BQW5ELEdBQTZELE1BQXhGOztBQUVBLE1BQU1DLGlCQUFpQlAsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUF2QjtBQUNBTSxpQkFBZUwsU0FBZixHQUEyQixZQUFZLEdBQVosU0FBcUJKLFFBQVFwRixJQUE3QixLQUF1Q29GLFFBQVFVLFdBQVIsR0FBc0IsY0FBdEIsR0FBdUMsRUFBOUUsQ0FBM0I7QUFDQUQsaUJBQWV2QyxXQUFmLENBQTJCK0IsV0FBM0I7QUFDQVEsaUJBQWV2QyxXQUFmLENBQTJCb0MsY0FBM0I7O0FBRUEsTUFBSU4sUUFBUVcsTUFBUixLQUFtQkMsU0FBdkIsRUFBa0M7QUFDaEMsUUFBTUMsZ0JBQWdCWCxTQUFTQyxhQUFULENBQXVCLFFBQXZCLENBQXRCO0FBQ0FVLGtCQUFjVCxTQUFkLEdBQTBCLFFBQTFCO0FBQ0FTLGtCQUFjUixTQUFkLEdBQTBCTCxRQUFRVyxNQUFsQztBQUNBRixtQkFBZXZDLFdBQWYsQ0FBMkIyQyxhQUEzQjtBQUNEOztBQUVEQyxVQUFRQyxHQUFSLENBQVlOLGNBQVo7QUFDQSxTQUFPQSxjQUFQO0FBQ0QsRTs7Ozs7Ozs7Ozs7Ozs7QUNoQ0Q7O0FBRUE7Ozs7Ozs7OztBQVNPLElBQU1PLGdEQUFvQix1QkFBTSxVQUFTcEcsSUFBVCxFQUFlWSxRQUFmLEVBQXlCeUYsT0FBekIsRUFBa0M7QUFDdkVBLFVBQVFDLGdCQUFSLENBQXlCLE9BQXpCLEVBQWtDLGlCQUFTO0FBQ3pDMUYsYUFBU1AsSUFBVCxDQUFjTCxJQUFkLEVBQW9CO0FBQ2xCcUcsZUFBU0EsT0FEUztBQUVsQnJCLFVBQUlxQixRQUFRdkQsWUFBUixDQUFxQixTQUFyQjtBQUZjLEtBQXBCLEVBR0csS0FISDs7QUFLQTtBQUNBeEMsVUFBTWlHLGVBQU47QUFDRCxHQVJEOztBQVVBLFNBQU9GLE9BQVA7QUFDRCxDQVpnQyxDQUExQixDOzs7Ozs7Ozs7Ozs7a0JDMENpQkcsSTs7QUFyRHhCOztBQUNBOztBQUVBOzs7QUFHQSxJQUFNQyxhQUFhLCtCQUFnQixlQUFoQixFQUFpQyxNQUFqQyxDQUFuQjs7QUFFQTs7O0FBR0EsSUFBTUMsT0FBTyw0QkFBYSxhQUFiLEVBQTRCLE1BQTVCLENBQWI7O0FBRUE7OztBQUdBLElBQU1DLE9BQU8sNEJBQWEsYUFBYixFQUE0QixPQUE1QixDQUFiOztBQUVBOzs7Ozs7QUFNQSxJQUFNQyx1QkFBdUIsU0FBdkJBLG9CQUF1QixDQUFTQyxXQUFULEVBQXNCSixVQUF0QixFQUFrQztBQUM3RCxNQUFHLENBQUNBLFVBQUosRUFBZ0I7QUFDZEMsU0FBS0csV0FBTDtBQUNBO0FBQ0QsR0FIRCxNQUlLLG9DQUFxQztBQUN4Q0YsV0FBS0UsV0FBTDtBQUNBO0FBQ0Q7QUFDRixDQVREOztBQVdBOzs7Ozs7OztBQVFBLElBQU1DLHVCQUF1Qix1QkFBTSxVQUFTRCxXQUFULEVBQXNCdkcsS0FBdEIsRUFBNkI7QUFDOURzRyx1QkFBcUJDLFdBQXJCLEVBQWtDSixXQUFXbkcsTUFBTXlHLE1BQWpCLENBQWxDO0FBQ0QsQ0FGNEIsQ0FBN0I7O0FBSUE7Ozs7OztBQU1lLFNBQVNQLElBQVQsQ0FBY0gsT0FBZCxFQUF1QjtBQUNwQyxNQUFNVyxVQUFVWCxRQUFRNUMsYUFBUixDQUFzQixpQkFBdEIsQ0FBaEI7QUFDQSxNQUFNd0QsU0FBU0QsUUFBUWxFLFlBQVIsQ0FBcUIsZUFBckIsQ0FBZjtBQUNBLE1BQU1vRSxTQUFTYixRQUFRNUMsYUFBUixPQUEwQndELE1BQTFCLENBQWY7O0FBRUEsTUFBR0QsT0FBSCxFQUFZO0FBQ1Y7QUFDQSxRQUFJRyxXQUFXLElBQUlDLGdCQUFKLENBQXFCLHlCQUFRTixxQkFBcUJJLE1BQXJCLENBQVIsQ0FBckIsQ0FBZjs7QUFFQUMsYUFBU0UsT0FBVCxDQUFpQkwsT0FBakIsRUFBMEI7QUFDeEJNLGtCQUFZLElBRFk7QUFFeEJDLHlCQUFtQixJQUZLO0FBR3hCQyx1QkFBaUIsQ0FBQyxlQUFEO0FBSE8sS0FBMUI7O0FBTUE7QUFDQVIsWUFBUVYsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsVUFBU2hHLEtBQVQsRUFBZ0I7QUFDaEQscUNBQWdCLGVBQWhCLEVBQWlDQSxNQUFNeUcsTUFBdkM7QUFDRCxLQUZEOztBQUlBSCx5QkFBcUJNLE1BQXJCLEVBQTZCVCxXQUFXTyxPQUFYLENBQTdCO0FBQ0Q7O0FBRUQsU0FBT1gsT0FBUDtBQUNELEM7Ozs7OztBQzdFRCxxQ0FBcUMsNC9FOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FyQzs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFDQTs7Ozs7OztBQU9BOzs7OztBQUtBOzs7OztBQUtBOzs7OztBQUtBOzs7OztBQUtBOzs7OztBQUtBOzs7Ozs7O0lBT3FCb0IsRztBQUNuQjs7O0FBR0EsZUFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUNqQjtBQUNBLGFBQWMsSUFBZCxFQUFvQix5QkFBcEI7O0FBRUE7QUFDQSxTQUFLQyxrQkFBTCxHQUEwQixpQ0FBdUJELEtBQXZCLENBQTFCO0FBQ0EsU0FBS0UsYUFBTCxHQUFxQiw0QkFBa0JGLEtBQWxCLENBQXJCOztBQUVBO0FBQ0EsU0FBS0csSUFBTCxHQUFZLHNCQUFZSCxLQUFaLENBQVo7O0FBRUE7QUFDQSxTQUFLSSxRQUFMLEdBQWdCLDBCQUFnQjtBQUM5QmpFLGtCQUFZNkQsTUFBTTdEO0FBRFksS0FBaEIsQ0FBaEI7O0FBSUE7QUFDQSxTQUFLbkQsU0FBTCxDQUFlLENBQUMsUUFBRCxFQUFXLE9BQVgsQ0FBZixFQUFvQyxLQUFLaUgsa0JBQXpDO0FBQ0EsU0FBS2pILFNBQUwsQ0FBZSxDQUFDLFFBQUQsQ0FBZixFQUEyQixLQUFLa0gsYUFBaEM7O0FBRUE7QUFDQSxTQUFLN0gsRUFBTCxDQUFRLFFBQVIsRUFBa0IsS0FBS2dJLGFBQXZCLEVBQXNDLElBQXRDO0FBQ0EsU0FBS2hJLEVBQUwsQ0FBUSxRQUFSLEVBQWtCLEtBQUs4SCxJQUFMLENBQVVHLFVBQTVCLEVBQXdDLEtBQUtILElBQTdDO0FBQ0EsU0FBS0EsSUFBTCxDQUFVOUgsRUFBVixDQUFhLFlBQWIsRUFBMkIsS0FBSzhILElBQUwsQ0FBVUksY0FBckMsRUFBcUQsS0FBS0osSUFBMUQ7QUFDQSxTQUFLQSxJQUFMLENBQVU5SCxFQUFWLENBQWEsY0FBYixFQUE2QixLQUFLOEgsSUFBTCxDQUFVSyxlQUFWLENBQTBCQyxJQUExQixDQUErQixLQUFLTixJQUFwQyxDQUE3QixFQUF3RSxLQUFLQSxJQUE3RTs7QUFFQSxTQUFLTyxZQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzttQ0FLZXZELFcsRUFBYTtBQUMxQixhQUFPLEtBQUtpRCxRQUFMLENBQWMvQyxXQUFkLENBQTBCRixXQUExQixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dDQUtvQjtBQUFBOztBQUFBLFVBQUxHLEVBQUssUUFBTEEsRUFBSzs7QUFDbEIsV0FBS3FELGNBQUwsQ0FBb0JyRCxFQUFwQixFQUF3QmIsSUFBeEIsQ0FBNkI7QUFBQSxZQUFFd0IsS0FBRixTQUFFQSxLQUFGO0FBQUEsZUFBYSxNQUFLa0MsSUFBTCxDQUFVUyxRQUFWLENBQW1CM0MsS0FBbkIsQ0FBYjtBQUFBLE9BQTdCO0FBQ0Q7O0FBRUQ7Ozs7OzttQ0FHZTtBQUFBOztBQUNiLFVBQU00QyxhQUFhLENBQUM7QUFDbEI1QyxlQUFPLGdCQURXO0FBRWxCWCxZQUFJLGVBRmM7QUFHbEJZLGlCQUFTLEtBQUsrQixrQkFBTCxDQUF3QmEsVUFBeEIsRUFIUztBQUlsQkMsa0JBQVU7QUFKUSxPQUFELEVBTW5CO0FBQ0U5QyxlQUFPLFFBRFQ7QUFFRVgsWUFBSSxRQUZOO0FBR0VZLGlCQUFTLEtBQUtnQyxhQUFMLENBQW1CWSxVQUFuQjtBQUhYLE9BTm1CLENBQW5COztBQVlBRCxpQkFBV3pILE9BQVgsQ0FBbUI7QUFBQSxlQUFhLE9BQUsrRyxJQUFMLENBQVVhLE1BQVYsQ0FBaUJDLFNBQWpCLENBQWI7QUFBQSxPQUFuQjtBQUNBLFdBQUtkLElBQUwsQ0FBVWUsZUFBVixHQWRhLENBY2dCO0FBQzdCLFdBQUtmLElBQUwsQ0FBVU8sWUFBVjtBQUNEOztBQUVEOzs7Ozs7OztpQ0FLYTtBQUNYLGFBQU8sS0FBS1AsSUFBTCxDQUFVVyxVQUFWLEVBQVA7QUFDRDs7Ozs7O2tCQS9Fa0JmLEc7Ozs7OztBQzdDckIseUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQTs7O0FBR0EsSUFBTW9CLDRCQUE0QixTQUFsQzs7QUFFQTs7O0FBR0EsSUFBTW5DLFFBQU8sNEJBQWEsYUFBYixFQUE0QixNQUE1QixDQUFiOztBQUVBOzs7QUFHQSxJQUFNQyxRQUFPLDRCQUFhLGFBQWIsRUFBNEIsT0FBNUIsQ0FBYjs7QUFFQTs7Ozs7O0FBTUEsSUFBTW1DLG1CQUFtQixTQUFuQkEsZ0JBQW1CLENBQUN6QyxPQUFELEVBQVUwQyxPQUFWO0FBQUEsU0FBc0IsQ0FBQ0EsVUFBVXBDLEtBQVYsR0FBaUJELEtBQWxCLEVBQXdCTCxPQUF4QixDQUF0QjtBQUFBLENBQXpCOztBQUVBOzs7Ozs7O0FBT0EsSUFBTTJDLFVBQVUsU0FBVkEsT0FBVSxDQUFDQyxJQUFEO0FBQUEsU0FBVyxPQUFPQSxJQUFQLEtBQWdCLFFBQWpCLElBQStCQSxLQUFLL0gsTUFBTCxLQUFnQixDQUF6RDtBQUFBLENBQWhCOztBQUVBOzs7OztJQUlxQmdJLHFCO0FBQ25CLGlDQUFZeEIsS0FBWixFQUFtQjtBQUFBOztBQUNqQjtBQUNBLGFBQWMsSUFBZCxFQUFvQix5QkFBcEI7O0FBRUE7QUFDQSxRQUFNeUIsb0JBQW9CN0QsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUExQjtBQUNBNEQsc0JBQWtCM0QsU0FBbEIsR0FBOEIsOEJBQTlCO0FBQ0EsbUNBQWtCLE9BQWxCLEVBQTJCLElBQTNCLEVBQWlDMkQsaUJBQWpDOztBQUVBO0FBQ0EsU0FBS0MsS0FBTCxHQUFhOUQsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFiO0FBQ0EsU0FBSzZELEtBQUwsQ0FBVzVELFNBQVgsR0FBdUIsZ0JBQXZCOztBQUVBLFFBQU02RCxzQkFBc0IvRCxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQTVCO0FBQ0E4RCx3QkFBb0I3RCxTQUFwQixHQUFnQyxlQUFoQztBQUNBNkQsd0JBQW9CL0YsV0FBcEIsQ0FBZ0MsS0FBSzhGLEtBQXJDOztBQUVBO0FBQ0EsU0FBS3pELEtBQUwsR0FBYUwsU0FBU0MsYUFBVCxDQUF1QixJQUF2QixDQUFiOztBQUVBO0FBQ0EsU0FBSytELE1BQUwsR0FBY2hFLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBZDtBQUNBLFNBQUsrRCxNQUFMLENBQVk5RCxTQUFaLEdBQXdCLFFBQXhCO0FBQ0EsU0FBSzhELE1BQUwsQ0FBWTdELFNBQVosR0FBd0IsV0FBeEIsQ0F2QmlCLENBdUJvQjs7QUFFckM7QUFDQSxTQUFLOEQsV0FBTCxHQUFtQmpFLFNBQVNDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBbkI7QUFDQSxTQUFLZ0UsV0FBTCxDQUFpQi9ELFNBQWpCLEdBQTZCLE9BQTdCOztBQUVBO0FBQ0EsU0FBS2dFLFVBQUwsR0FBa0JsRSxTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQWxCO0FBQ0EsU0FBS2lFLFVBQUwsQ0FBZ0JoRSxTQUFoQixHQUE0QixRQUE1QjtBQUNBLFNBQUtnRSxVQUFMLENBQWdCL0QsU0FBaEIsR0FBNEIsY0FBNUI7QUFDQSxTQUFLK0QsVUFBTCxDQUFnQnZHLFlBQWhCLENBQTZCLFFBQTdCLEVBQXVDLFFBQXZDO0FBQ0F5RCxVQUFLLEtBQUs4QyxVQUFWOztBQUVBLFFBQU1DLGNBQWNuRSxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQXBCO0FBQ0FrRSxnQkFBWWpFLFNBQVosR0FBd0IsY0FBeEI7QUFDQWlFLGdCQUFZbkcsV0FBWixDQUF3QixLQUFLcUMsS0FBN0I7QUFDQThELGdCQUFZbkcsV0FBWixDQUF3QixLQUFLZ0csTUFBN0I7QUFDQUcsZ0JBQVluRyxXQUFaLENBQXdCLEtBQUtpRyxXQUE3QjtBQUNBRSxnQkFBWW5HLFdBQVosQ0FBd0IsS0FBS2tHLFVBQTdCOztBQUVBLFFBQU1FLGlCQUFpQnBFLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBdkI7QUFDQW1FLG1CQUFlbEUsU0FBZixHQUEyQixXQUEzQjtBQUNBa0UsbUJBQWVwRyxXQUFmLENBQTJCK0YsbUJBQTNCO0FBQ0FLLG1CQUFlcEcsV0FBZixDQUEyQm1HLFdBQTNCOztBQUVBO0FBQ0EsU0FBS0UsU0FBTCxHQUFpQnJFLFNBQVNDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBakI7QUFDQSxTQUFLb0UsU0FBTCxDQUFlbkUsU0FBZixHQUEyQix1QkFBM0I7QUFDQSxTQUFLbUUsU0FBTCxDQUFlbEUsU0FBZixHQUEyQixLQUEzQjtBQUNBaUIsVUFBSyxLQUFLaUQsU0FBVjtBQUNBLG1DQUFrQixRQUFsQixFQUE0QixJQUE1QixFQUFrQyxLQUFLQSxTQUF2Qzs7QUFFQTtBQUNBLFNBQUtDLGFBQUwsR0FBcUJ0RSxTQUFTQyxhQUFULENBQXVCLE1BQXZCLENBQXJCO0FBQ0EsU0FBS3FFLGFBQUwsQ0FBbUJwRSxTQUFuQixHQUErQiwrQkFBL0I7QUFDQSxTQUFLb0UsYUFBTCxDQUFtQm5FLFNBQW5CLEdBQStCLFNBQS9CO0FBQ0FpQixVQUFLLEtBQUtrRCxhQUFWO0FBQ0EsbUNBQWtCLFNBQWxCLEVBQTZCLElBQTdCLEVBQW1DLEtBQUtBLGFBQXhDOztBQUVBLFFBQU1DLFlBQVl2RSxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWxCO0FBQ0FzRSxjQUFVckUsU0FBVixHQUFzQixZQUF0QjtBQUNBcUUsY0FBVXZHLFdBQVYsQ0FBc0IsS0FBS3FHLFNBQTNCO0FBQ0FFLGNBQVV2RyxXQUFWLENBQXNCLEtBQUtzRyxhQUEzQjs7QUFFQTtBQUNBLFFBQU1FLGVBQWUsS0FBS0MsV0FBTCxDQUFpQixrQkFBakIsRUFBcUMsYUFBckMsRUFBb0QsZUFBcEQsQ0FBckI7QUFDQSxRQUFNQyxlQUFlLEtBQUtELFdBQUwsQ0FBaUIsbUJBQWpCLEVBQXNDLGFBQXRDLEVBQXFELGVBQXJELENBQXJCO0FBQ0EsUUFBTUUsaUJBQWlCLEtBQUtGLFdBQUwsQ0FBaUIsZ0JBQWpCLEVBQW1DLGFBQW5DLEVBQWtELGlCQUFsRCxDQUF2Qjs7QUFFQTtBQUNBLFFBQU1HLG9CQUFvQjVFLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBMUI7QUFDQTJFLHNCQUFrQjFFLFNBQWxCLEdBQThCLGFBQTlCO0FBQ0EwRSxzQkFBa0I1RyxXQUFsQixDQUE4QndHLFlBQTlCO0FBQ0FJLHNCQUFrQjVHLFdBQWxCLENBQThCMEcsWUFBOUI7QUFDQUUsc0JBQWtCNUcsV0FBbEIsQ0FBOEIyRyxjQUE5Qjs7QUFFQTtBQUNBLFNBQUtFLFFBQUwsR0FBZ0I3RSxTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQWhCOztBQUdBO0FBQ0EsU0FBSzZFLFdBQUwsR0FBbUI5RSxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQW5CO0FBQ0EsU0FBSzZFLFdBQUwsQ0FBaUI1RSxTQUFqQixHQUE2QixxQkFBN0I7QUFDQSxTQUFLNEUsV0FBTCxDQUFpQm5ILFlBQWpCLENBQThCLGFBQTlCLEVBQTZDLE1BQTdDO0FBQ0EsU0FBS21ILFdBQUwsQ0FBaUI5RyxXQUFqQixDQUE2QjZGLGlCQUE3QjtBQUNBLFNBQUtpQixXQUFMLENBQWlCOUcsV0FBakIsQ0FBNkJvRyxjQUE3QjtBQUNBLFNBQUtVLFdBQUwsQ0FBaUI5RyxXQUFqQixDQUE2QnVHLFNBQTdCO0FBQ0EsU0FBS08sV0FBTCxDQUFpQjlHLFdBQWpCLENBQTZCLEtBQUs2RyxRQUFsQztBQUNBLFNBQUtDLFdBQUwsQ0FBaUI5RyxXQUFqQixDQUE2QjRHLGlCQUE3QjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7O2dDQVNZdkUsSyxFQUFPVixJLEVBQU1nQyxNLEVBQVE7QUFDL0IsVUFBTW9ELFdBQVcvRSxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWpCO0FBQ0E4RSxlQUFTN0UsU0FBVCxHQUFxQixjQUFyQjtBQUNBNkUsZUFBU3BILFlBQVQsQ0FBc0IsZUFBdEIsRUFBdUMsT0FBdkM7QUFDQW9ILGVBQVNwSCxZQUFULENBQXNCLGVBQXRCLEVBQXVDZ0UsTUFBdkM7QUFDQW9ELGVBQVM1RSxTQUFULEdBQXFCRSxLQUFyQjs7QUFFQSxVQUFNMkUsY0FBY2hGLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBcEI7QUFDQStFLGtCQUFZOUUsU0FBWixHQUF3QixrQkFBeEI7QUFDQThFLGtCQUFZN0UsU0FBWixHQUF3QlIsSUFBeEI7O0FBRUEsVUFBTWlDLFNBQVM1QixTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWY7QUFDQTJCLGFBQU8xQixTQUFQLEdBQW1CLFlBQW5CO0FBQ0EwQixhQUFPbEMsRUFBUCxHQUFZaUMsTUFBWjtBQUNBQyxhQUFPakUsWUFBUCxDQUFvQixhQUFwQixFQUFtQyxNQUFuQztBQUNBaUUsYUFBTzVELFdBQVAsQ0FBbUJnSCxXQUFuQjs7QUFFQSxVQUFNQyxVQUFVakYsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFoQjtBQUNBZ0YsY0FBUS9FLFNBQVIsR0FBb0IsT0FBcEI7QUFDQStFLGNBQVFqSCxXQUFSLENBQW9CK0csUUFBcEI7QUFDQUUsY0FBUWpILFdBQVIsQ0FBb0I0RCxNQUFwQjs7QUFFQSwyQkFBVXFELE9BQVY7O0FBRUEsYUFBT0EsT0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozt1Q0FLbUJuQixLLEVBQU87QUFDeEIsVUFBTW9CLE9BQU9sRixTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQWI7QUFDQWlGLFdBQUsvRSxTQUFMLG1CQUE4QjJELE1BQU1xQixHQUFwQyxpQkFBaURyQixNQUFNc0IsR0FBdkQ7O0FBRUEsV0FBS1AsUUFBTCxDQUFjN0csV0FBZCxDQUEwQmtILElBQTFCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzZCQUtTRyxHLEVBQUs7QUFDWixXQUFLdkIsS0FBTCxDQUFXbkcsWUFBWCxDQUF3QixLQUF4QixFQUErQjBILHVDQUEvQjtBQUNEOztBQUVEOzs7Ozs7OzswQkFLTTNGLEUsRUFBSTtBQUNSLFdBQUs0RSxhQUFMLENBQW1CM0csWUFBbkIsQ0FBZ0M0Rix5QkFBaEMsRUFBMkQ3RCxFQUEzRDtBQUNBLFdBQUsyRSxTQUFMLENBQWUxRyxZQUFmLENBQTRCNEYseUJBQTVCLEVBQXVEN0QsRUFBdkQ7QUFDRDs7QUFFRDs7Ozs7Ozs7NkJBS1NXLEssRUFBTztBQUNkLFdBQUtBLEtBQUwsQ0FBV0YsU0FBWCxHQUF1QkUsS0FBdkI7QUFDRDs7QUFFRDs7Ozs7Ozs7bUNBS2VzRCxJLEVBQU07QUFDbkIsV0FBS00sV0FBTCxDQUFpQjlELFNBQWpCLEdBQTZCd0QsSUFBN0I7QUFDRDs7QUFFRDs7Ozs7Ozs7K0JBS1d3QixHLEVBQUs7QUFDZCxXQUFLakIsVUFBTCxDQUFnQnZHLFlBQWhCLENBQTZCLE1BQTdCLEVBQXFDd0gsT0FBTyxHQUE1QztBQUNBM0IsdUJBQWlCLEtBQUtVLFVBQXRCLEVBQWtDLENBQUNSLFFBQVF5QixHQUFSLENBQW5DO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O21DQUtlRyxTLEVBQVc7QUFDeEI5Qix1QkFBaUIsS0FBS2EsU0FBdEIsRUFBaUNpQixTQUFqQztBQUNBOUIsdUJBQWlCLEtBQUtjLGFBQXRCLEVBQXFDLENBQUNnQixTQUF0QztBQUNEOztBQUVEOzs7Ozs7MkJBR087QUFDTGxFLFlBQUssS0FBSzBELFdBQVY7QUFDRDs7QUFFRDs7Ozs7OzJCQUdPO0FBQ0x6RCxZQUFLLEtBQUt5RCxXQUFWO0FBQ0Q7O0FBRUQ7Ozs7Ozs7aUNBSWE7QUFDWCxhQUFPLEtBQUtBLFdBQVo7QUFDRDs7Ozs7O2tCQTVOa0JsQixxQjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzQ3JCOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7SUFJcUIyQixpQjtBQUNuQiw2QkFBWW5ELEtBQVosRUFBbUI7QUFBQTs7QUFDakI7QUFDQSxhQUFjLElBQWQsRUFBb0IseUJBQXBCOztBQUVBO0FBQ0EsU0FBS0ksUUFBTCxHQUFnQiwwQkFBZ0I7QUFDOUJqRSxrQkFBWTZELE1BQU03RDtBQURZLEtBQWhCLENBQWhCOztBQUlBO0FBQ0EsU0FBS2dFLElBQUwsR0FBWSxvQ0FBeUJILEtBQXpCLENBQVo7QUFDQSxTQUFLRyxJQUFMLENBQVU5SCxFQUFWLENBQWEsU0FBYixFQUF3QixLQUFLK0ssT0FBN0IsRUFBc0MsSUFBdEM7O0FBRUE7QUFDQSxTQUFLcEssU0FBTCxDQUFlLENBQUMsT0FBRCxFQUFVLFFBQVYsQ0FBZixFQUFvQyxLQUFLbUgsSUFBekM7QUFDRDs7QUFFRDs7Ozs7OzsyQkFHTztBQUNMLFdBQUtBLElBQUwsQ0FBVW5CLElBQVY7QUFDRDs7QUFFRDs7Ozs7OzJCQUdPO0FBQ0wsV0FBS21CLElBQUwsQ0FBVWxCLElBQVY7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs2QkFPUzNCLEUsRUFBSTtBQUNYLFdBQUs4QyxRQUFMLENBQWMvQyxXQUFkLENBQTBCQyxFQUExQixFQUNHYixJQURILENBQ1EsS0FBSzRHLE1BQUwsQ0FBWTVDLElBQVosQ0FBaUIsSUFBakIsQ0FEUjtBQUVEOztBQUVEOzs7Ozs7Ozs7O2tDQU9lO0FBQUE7O0FBQUEsVUFBTG5ELEVBQUssUUFBTEEsRUFBSzs7QUFDWixhQUFPLEtBQUs4QyxRQUFMLENBQWMvQyxXQUFkLENBQTBCQyxFQUExQixFQUNKYixJQURJLENBQ0M7QUFBQSxlQUFlWSxZQUFZRixXQUEzQjtBQUFBLE9BREQsRUFFSlYsSUFGSSxDQUVDO0FBQUEsZUFBZSxNQUFLMkQsUUFBTCxDQUFja0Qsa0JBQWQsQ0FBaUNuRyxXQUFqQyxDQUFmO0FBQUEsT0FGRCxFQUdKVixJQUhJLENBR0M7QUFBQSxlQUFlK0IsUUFBUStFLEtBQVIsQ0FBYyxtQkFBZCxDQUFmO0FBQUEsT0FIRCxDQUFQO0FBSUQ7O0FBRUY7Ozs7Ozs7OzJCQUtPbEcsVyxFQUFhO0FBQ2xCLFdBQUs4QyxJQUFMLENBQVVxRCxLQUFWLENBQWdCbkcsWUFBWUYsV0FBNUI7QUFDQSxXQUFLZ0QsSUFBTCxDQUFVUyxRQUFWLENBQW1CdkQsWUFBWVksS0FBL0I7QUFDQSxXQUFLa0MsSUFBTCxDQUFVc0QsY0FBVixDQUF5QnBHLFlBQVl3RSxXQUFyQztBQUNBLFdBQUsxQixJQUFMLENBQVV1RCxRQUFWLENBQW1CckcsWUFBWXNHLElBQS9CO0FBQ0EsV0FBS3hELElBQUwsQ0FBVXlELFVBQVYsQ0FBcUJ2RyxZQUFZd0csT0FBakM7QUFDQSxXQUFLMUQsSUFBTCxDQUFVMkQsY0FBVixDQUF5QixDQUFDLENBQUN6RyxZQUFZNkYsU0FBdkM7O0FBRUE3RixrQkFBWTBHLFdBQVosQ0FBd0IzSyxPQUF4QixDQUFnQyxLQUFLK0csSUFBTCxDQUFVNkQsa0JBQTFDLEVBQThELEtBQUs3RCxJQUFuRTtBQUNEOztBQUVEOzs7Ozs7OztpQ0FLYTtBQUNYLGFBQU8sS0FBS0EsSUFBTCxDQUFVVyxVQUFWLEVBQVA7QUFDRDs7Ozs7O2tCQWpGa0JxQyxpQjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSckI7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUE7OztBQUdBLElBQU1uRSxRQUFPLDRCQUFhLGFBQWIsRUFBNEIsTUFBNUIsQ0FBYjs7QUFFQTs7O0FBR0EsSUFBTUMsUUFBTyw0QkFBYSxhQUFiLEVBQTRCLE9BQTVCLENBQWI7O0FBRUE7Ozs7Ozs7SUFNcUJnRixtQjtBQUNuQiwrQkFBWWpFLEtBQVosRUFBbUI7QUFBQTs7QUFDakIsU0FBS0EsS0FBTCxHQUFhQSxLQUFiOztBQUVBeEIsWUFBUUMsR0FBUixDQUFZLE9BQVo7O0FBRUE7QUFDQSxhQUFjLElBQWQsRUFBb0IseUJBQXBCOztBQUVBO0FBQ0EsU0FBS2lFLFdBQUwsR0FBbUI5RSxTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQW5CO0FBQ0EsU0FBSzZFLFdBQUwsQ0FBaUI1RSxTQUFqQixHQUE2QixtQkFBN0I7QUFDRDs7QUFFRDs7Ozs7OzsyQkFHTztBQUNMa0IsWUFBSyxLQUFLMEQsV0FBVjtBQUNEOztBQUVEOzs7Ozs7MkJBR087QUFDTHpELFlBQUssS0FBS3lELFdBQVY7QUFDRDs7QUFFRDs7Ozs7O29DQUdnQjtBQUNkLFVBQUcsS0FBS0EsV0FBUixFQUFvQjtBQUNsQixlQUFNLEtBQUtBLFdBQUwsQ0FBaUJ3QixVQUF2QixFQUFrQztBQUNoQyxlQUFLeEIsV0FBTCxDQUFpQnlCLFdBQWpCLENBQTZCLEtBQUt6QixXQUFMLENBQWlCd0IsVUFBOUM7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQ7Ozs7Ozs7OzJCQUtPN0csVyxFQUFhO0FBQ2xCLFVBQU0rRyxNQUFNLEtBQUtDLG9CQUFMLENBQTBCaEgsV0FBMUIsRUFBdUMsSUFBdkMsQ0FBWjtBQUNBLHFDQUFrQixjQUFsQixFQUFrQyxJQUFsQyxFQUF3QytHLEdBQXhDO0FBQ0EsV0FBSzFCLFdBQUwsQ0FBaUI5RyxXQUFqQixDQUE2QndJLEdBQTdCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O3lDQVFxQi9HLFcsRUFBYTdFLEssRUFBTztBQUN2QztBQUNBLFVBQU1tRyxVQUFVZixTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQWhCO0FBQ0FjLGNBQVFyQixFQUFSLHFCQUE2QkQsWUFBWUYsV0FBekM7QUFDQXdCLGNBQVFwRCxZQUFSLENBQXFCLFNBQXJCLEVBQWdDOEIsWUFBWUYsV0FBNUM7O0FBRUE7QUFDQSxVQUFNbUgsa0JBQWtCLEVBQUUvQyxNQUFNLEtBQVIsRUFBZWdELEtBQUssZ0JBQXBCLEVBQXhCO0FBQ0EsVUFBTUMsc0JBQXNCLEVBQUVqRCxNQUFNLFNBQVIsRUFBbUJnRCxLQUFLLHdCQUF4QixFQUE1QjtBQUNBLFVBQU1sRyxTQUFTaEIsWUFBWTZGLFNBQVosR0FBeUJvQixlQUF6QixHQUEwQ0UsbUJBQXpEOztBQUVBLFVBQU12RyxRQUFRWixZQUFZWSxLQUFaLElBQXFCWixZQUFZRixXQUEvQztBQUNBLFVBQU0wRSxjQUFjeEUsWUFBWW9ILE9BQVosSUFBdUIsRUFBM0M7O0FBRUEsVUFBTS9DLFFBQVFyRSxZQUFZc0csSUFBWixvQ0FBZDs7QUFFQTtBQUNBaEYsY0FBUVosU0FBUixvREFDcUMyRCxLQURyQyx3Q0FFd0JyRCxPQUFPa0csR0FGL0IscUJBRWdEbEgsWUFBWUYsV0FGNUQsMEJBRXlGa0IsT0FBT2tELElBRmhHLDJCQUdRdEQsS0FIUixnREFJNkI0RCxXQUo3Qjs7QUFPQTtBQUNBLFVBQU1JLFlBQVl0RCxRQUFRNUMsYUFBUixDQUFzQixpQkFBdEIsQ0FBbEI7QUFDQSxVQUFHa0csU0FBSCxFQUFhO0FBQ1gsdUNBQWtCLFFBQWxCLEVBQTRCekosS0FBNUIsRUFBbUN5SixTQUFuQztBQUNEOztBQUVELGFBQU90RCxPQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O2lDQUthO0FBQ1gsYUFBTyxLQUFLK0QsV0FBWjtBQUNEOzs7Ozs7a0JBbEdrQnVCLG1COzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCckI7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7O0FBS0E7Ozs7O0FBS0E7Ozs7Ozs7SUFPcUJTLGU7QUFDbkIsMkJBQVkxRSxLQUFaLEVBQW1CO0FBQUE7O0FBQ2pCO0FBQ0EsYUFBYyxJQUFkLEVBQW9CLHlCQUFwQjs7QUFFQTtBQUNBLFNBQUtHLElBQUwsR0FBWSxrQ0FBdUJILEtBQXZCLENBQVo7QUFDQSxTQUFLaEgsU0FBTCxDQUFlLENBQUMsY0FBRCxFQUFpQixRQUFqQixDQUFmLEVBQTJDLEtBQUttSCxJQUFoRDtBQUNEOztBQUVEOzs7Ozs7OzJCQUdPO0FBQ0wsV0FBS0EsSUFBTCxDQUFVbkIsSUFBVjtBQUNEOztBQUVEOzs7Ozs7MkJBR087QUFDTCxXQUFLbUIsSUFBTCxDQUFVbEIsSUFBVjtBQUNEOztBQUVEOzs7Ozs7OzsyQkFLTzdCLFksRUFBYztBQUNuQixXQUFLK0MsSUFBTCxDQUFVd0UsYUFBVjtBQUNBdkgsbUJBQWFoRSxPQUFiLENBQXFCLEtBQUsrRyxJQUFMLENBQVV5RSxNQUEvQixFQUF1QyxLQUFLekUsSUFBNUM7QUFDQSxXQUFLeEgsSUFBTCxDQUFVLDBCQUFWLEVBQXNDLEVBQXRDO0FBQ0Q7O0FBR0Q7Ozs7Ozs7O2lDQUthO0FBQ1gsYUFBTyxLQUFLd0gsSUFBTCxDQUFVVyxVQUFWLEVBQVA7QUFDRDs7Ozs7O2tCQTNDa0I0RCxlOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3BCckI7Ozs7QUFFQTs7OztJQUlxQkcsa0I7QUFDbkI7Ozs7QUFJQSw4QkFBWTdFLEtBQVosRUFBbUI7QUFBQTs7QUFDakI7QUFDQSxhQUFjLElBQWQsRUFBb0IseUJBQXBCOztBQUVBO0FBQ0EsUUFBTThFLE9BQU8sS0FBS0MsaUJBQUwsRUFBYjtBQUNBLFFBQU1DLGFBQWEsS0FBS0MsdUJBQUwsRUFBbkI7O0FBRUE7QUFDQSxRQUFNQyxZQUFZdEgsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFsQjtBQUNBcUgsY0FBVXBILFNBQVYsR0FBc0IsWUFBdEI7QUFDQW9ILGNBQVV0SixXQUFWLENBQXNCa0osSUFBdEI7QUFDQUksY0FBVXRKLFdBQVYsQ0FBc0JvSixVQUF0Qjs7QUFFQTtBQUNBLFNBQUt0QyxXQUFMLEdBQW9COUUsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFwQjtBQUNBLFNBQUs2RSxXQUFMLENBQWlCOUcsV0FBakIsQ0FBNkJzSixTQUE3QjtBQUNEOztBQUVEOzs7Ozs7Ozs7OztnQ0FPWTNELEksRUFBTTtBQUFBOztBQUNoQixVQUFNNUMsVUFBVWYsU0FBU0MsYUFBVCxDQUF1QixJQUF2QixDQUFoQjtBQUNBYyxjQUFRcEQsWUFBUixDQUFxQixNQUFyQixFQUE2QixVQUE3QjtBQUNBb0QsY0FBUVosU0FBUixHQUFvQndELElBQXBCOztBQUVBNUMsY0FBUUMsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsaUJBQVM7QUFDekMsY0FBS2pHLElBQUwsQ0FBVSxlQUFWLEVBQTJCO0FBQ3pCZ0csbUJBQVMvRixNQUFNeUc7QUFEVSxTQUEzQjtBQUdELE9BSkQ7O0FBTUE7QUFDQSxVQUFHLEtBQUs4RixjQUFMLENBQW9CQyxpQkFBcEIsR0FBd0MsQ0FBM0MsRUFBOEM7QUFDNUN6RyxnQkFBUXBELFlBQVIsQ0FBcUIsZUFBckIsRUFBc0MsTUFBdEM7QUFDRDs7QUFFRDtBQUNBLFdBQUs0SixjQUFMLENBQW9CdkosV0FBcEIsQ0FBZ0MrQyxPQUFoQzs7QUFFQSxhQUFPQSxPQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dDQUtvQjtBQUNsQixXQUFLd0csY0FBTCxHQUFzQnZILFNBQVNDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBdEI7QUFDQSxXQUFLc0gsY0FBTCxDQUFvQjVKLFlBQXBCLENBQWlDLE1BQWpDLEVBQXlDLFNBQXpDO0FBQ0EsV0FBSzRKLGNBQUwsQ0FBb0JySCxTQUFwQixHQUFnQyxVQUFoQzs7QUFFQSxVQUFNdUgsYUFBYXpILFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBbkI7QUFDQXdILGlCQUFXekosV0FBWCxDQUF1QixLQUFLdUosY0FBNUI7O0FBRUEsVUFBTWxILFFBQVFMLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBZDtBQUNBSSxZQUFNSCxTQUFOLEdBQWtCLFlBQWxCO0FBQ0FHLFlBQU1GLFNBQU4sR0FBa0Isc0JBQWxCOztBQUVBLFVBQU0rRyxPQUFPbEgsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFiO0FBQ0FpSCxXQUFLaEgsU0FBTCxHQUFpQixNQUFqQjtBQUNBZ0gsV0FBS2xKLFdBQUwsQ0FBaUJxQyxLQUFqQjtBQUNBNkcsV0FBS2xKLFdBQUwsQ0FBaUJ5SixVQUFqQjs7QUFFQSxhQUFPUCxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzhDQUswQjtBQUFBOztBQUN4QjtBQUNBLFVBQU1RLGFBQWExSCxTQUFTQyxhQUFULENBQXVCLE9BQXZCLENBQW5CO0FBQ0F5SCxpQkFBV2hJLEVBQVgsR0FBZ0IsZ0JBQWhCO0FBQ0FnSSxpQkFBV3hILFNBQVgsR0FBdUIsbUNBQXZCO0FBQ0F3SCxpQkFBVy9KLFlBQVgsQ0FBd0IsTUFBeEIsRUFBZ0MsTUFBaEM7QUFDQStKLGlCQUFXL0osWUFBWCxDQUF3QixhQUF4QixFQUF1QywwQkFBdkM7QUFDQStKLGlCQUFXMUcsZ0JBQVgsQ0FBNEIsT0FBNUIsRUFBcUMsaUJBQVM7QUFDNUMsZUFBS2pHLElBQUwsQ0FBVSxRQUFWLEVBQW9CO0FBQ2xCZ0csbUJBQVMvRixNQUFNeUcsTUFERztBQUVsQmtHLGlCQUFPM00sTUFBTXlHLE1BQU4sQ0FBYXhFO0FBRkYsU0FBcEI7QUFJRCxPQUxEOztBQU9BO0FBQ0EsVUFBTTJLLGNBQWM1SCxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQXBCO0FBQ0EySCxrQkFBWTFILFNBQVosR0FBd0IsK0JBQXhCO0FBQ0EwSCxrQkFBWUMsT0FBWixHQUFzQixZQUFXO0FBQy9CLGFBQUtDLGFBQUwsQ0FBbUIzSixhQUFuQixDQUFpQyxhQUFqQyxFQUFnRDRKLEtBQWhEO0FBQ0QsT0FGRDs7QUFJQTtBQUNBLFVBQU1YLGFBQWFwSCxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQW5CO0FBQ0FtSCxpQkFBV2xILFNBQVgsR0FBdUIsYUFBdkI7QUFDQWtILGlCQUFXcEosV0FBWCxDQUF1QjBKLFVBQXZCO0FBQ0FOLGlCQUFXcEosV0FBWCxDQUF1QjRKLFdBQXZCOztBQUVBLGFBQU9SLFVBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7aUNBS2E7QUFDWCxhQUFPLEtBQUt0QyxXQUFaO0FBQ0Q7Ozs7OztrQkF4SGtCbUMsa0I7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTnJCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7SUFNcUJlLGtCO0FBQ25COzs7QUFHQSw4QkFBWTVGLEtBQVosRUFBbUI7QUFBQTs7QUFBQTs7QUFDakI7QUFDQSxhQUFjLElBQWQsRUFBb0IseUJBQXBCOztBQUVBO0FBQ0EsU0FBS0csSUFBTCxHQUFZLHFDQUEyQkgsS0FBM0IsQ0FBWjs7QUFFQTtBQUNBLFNBQUs2RixhQUFMLEdBQXFCLDRCQUFrQixFQUFFMUosWUFBWTZELE1BQU03RCxVQUFwQixFQUFsQixDQUFyQjtBQUNBLFNBQUsySixlQUFMLEdBQXVCLCtCQUF2QjtBQUNBLFNBQUtDLGlCQUFMLEdBQXlCLGdDQUFzQixFQUFFNUosWUFBWTZELE1BQU03RCxVQUFwQixFQUF0QixDQUF6Qjs7QUFFQTtBQUNBLEtBQUMsa0JBQUQsRUFBcUIsUUFBckIsRUFBK0IsY0FBL0IsRUFBK0MsYUFBL0MsRUFDRy9DLE9BREgsQ0FDVztBQUFBLGFBQVksTUFBSytHLElBQUwsQ0FBVTZGLFdBQVYsQ0FBc0JDLFFBQXRCLENBQVo7QUFBQSxLQURYOztBQUdBO0FBQ0EsUUFBTUMsVUFBVXRJLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBaEI7QUFDQXFJLFlBQVFDLFNBQVIsQ0FBa0JDLEdBQWxCLENBQXNCLHNCQUF0Qjs7QUFFQSxTQUFLMUQsV0FBTCxHQUFtQndELE9BQW5CO0FBQ0EsU0FBS3hELFdBQUwsQ0FBaUI5RyxXQUFqQixDQUE2QixLQUFLa0ssZUFBTCxDQUFxQmhGLFVBQXJCLEVBQTdCO0FBQ0EsU0FBSzRCLFdBQUwsQ0FBaUI5RyxXQUFqQixDQUE2QixLQUFLbUssaUJBQUwsQ0FBdUJqRixVQUF2QixFQUE3Qjs7QUFFQSxTQUFLWCxJQUFMLENBQVVXLFVBQVYsR0FBdUJsRixXQUF2QixDQUFtQyxLQUFLOEcsV0FBeEM7O0FBRUE7QUFDQSxTQUFLMUosU0FBTCxDQUFlLENBQUMsUUFBRCxFQUFXLDBCQUFYLENBQWYsRUFBdUQsS0FBSzhNLGVBQTVEO0FBQ0EsU0FBSzlNLFNBQUwsQ0FBZSxDQUFDLFFBQUQsQ0FBZixFQUEyQixLQUFLK00saUJBQWhDOztBQUVBO0FBQ0EsU0FBSzVGLElBQUwsQ0FBVTlILEVBQVYsQ0FBYSxRQUFiLEVBQXVCLEtBQUtnTyxNQUE1QixFQUFvQyxJQUFwQztBQUNBLFNBQUtsRyxJQUFMLENBQVU5SCxFQUFWLENBQWEsZUFBYixFQUE4QixLQUFLaU8saUJBQW5DLEVBQXNELElBQXREO0FBQ0EsU0FBS1IsZUFBTCxDQUFxQnpOLEVBQXJCLENBQXdCLGNBQXhCLEVBQXdDLEtBQUtrTyxjQUE3QyxFQUE2RCxJQUE3RDtBQUNBLFNBQUtSLGlCQUFMLENBQXVCMU4sRUFBdkIsQ0FBMEIsT0FBMUIsRUFBbUMsS0FBS21PLGVBQXhDLEVBQXlELElBQXpEO0FBQ0EsU0FBS1QsaUJBQUwsQ0FBdUIxTixFQUF2QixDQUEwQixRQUExQixFQUFvQyxLQUFLbU8sZUFBekMsRUFBMEQsSUFBMUQ7O0FBRUEsU0FBS0MsbUJBQUw7QUFDRDs7QUFFRDs7Ozs7OzswQ0FHc0I7QUFBQTs7QUFDcEI7QUFDQSxXQUFLWixhQUFMLENBQW1CUSxNQUFuQixDQUEwQixFQUExQixFQUNHNUosSUFESCxDQUNRO0FBQUEsZUFBZ0IsT0FBS3FKLGVBQUwsQ0FBcUJ6QyxNQUFyQixDQUE0QmpHLFlBQTVCLENBQWhCO0FBQUEsT0FEUixFQUVHc0osS0FGSCxDQUVTO0FBQUEsZUFBUyxPQUFLL04sSUFBTCxDQUFVLE9BQVYsRUFBbUJnTyxLQUFuQixDQUFUO0FBQUEsT0FGVDtBQUdEOztBQUVEOzs7Ozs7OztpQ0FLZ0I7QUFBQTs7QUFBQSxVQUFScEIsS0FBUSxRQUFSQSxLQUFROztBQUNkLFdBQUtNLGFBQUwsQ0FBbUJRLE1BQW5CLENBQTBCZCxLQUExQixFQUNHOUksSUFESCxDQUNRO0FBQUEsZUFBZ0IsT0FBS3FKLGVBQUwsQ0FBcUJ6QyxNQUFyQixDQUE0QmpHLFlBQTVCLENBQWhCO0FBQUEsT0FEUjtBQUVEOztBQUVEOzs7Ozs7d0NBR29CO0FBQ2xCb0IsY0FBUStFLEtBQVIsQ0FBYyx1Q0FBZCxFQUF1RDNLLEtBQXZEO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzBDQUtxQjtBQUFBLFVBQUwwRSxFQUFLLFNBQUxBLEVBQUs7O0FBQ25CLFdBQUt3SSxlQUFMLENBQXFCOUcsSUFBckI7QUFDQSxXQUFLK0csaUJBQUwsQ0FBdUJhLFFBQXZCLENBQWdDdEosRUFBaEM7QUFDQSxXQUFLeUksaUJBQUwsQ0FBdUI5RyxJQUF2QjtBQUNEOztBQUdEOzs7Ozs7c0NBR2tCO0FBQ2hCLFdBQUs4RyxpQkFBTCxDQUF1Qi9HLElBQXZCO0FBQ0EsV0FBSzhHLGVBQUwsQ0FBcUI3RyxJQUFyQjtBQUNEOztBQUVEOzs7Ozs7OztpQ0FLYTtBQUNYLGFBQU8sS0FBS2tCLElBQUwsQ0FBVVcsVUFBVixFQUFQO0FBQ0Q7Ozs7OztrQkFsR2tCOEUsa0I7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYnJCOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBQ0E7Ozs7O0FBS0E7Ozs7O0FBS0E7OztBQUdBLElBQU1pQixvQkFBb0IsU0FBMUI7O0FBRUE7OztBQUdBLElBQU1DLFNBQVMsNEJBQWEsTUFBYixDQUFmOztBQUVBOzs7Ozs7SUFLcUJDLE87QUFDbkI7OztBQUdBLG1CQUFZL0csS0FBWixFQUFtQjtBQUFBOztBQUNqQjtBQUNBLGFBQWMsSUFBZCxFQUFvQix5QkFBcEI7O0FBRUEsU0FBS2dILGNBQUwsQ0FBb0JoSCxLQUFwQjtBQUNBLFNBQUtpSCxXQUFMLENBQWlCakgsS0FBakI7QUFDRDs7QUFFRDs7Ozs7OztpQ0FHYTtBQUNYLFdBQUsvQixLQUFMLENBQVcxQyxZQUFYLENBQXdCLGVBQXhCLEVBQXlDLE9BQXpDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzZCQUtTMEMsSyxFQUFPO0FBQ2QsV0FBS0EsS0FBTCxDQUFXRixTQUFYLEdBQXVCRSxLQUF2QjtBQUNEOztBQUVEOzs7Ozs7Ozs7O3NDQU95RTtBQUFBLDRCQUE1REEsS0FBNEQ7QUFBQSxVQUE1REEsS0FBNEQsOEJBQXBELEVBQW9EO0FBQUEsZ0NBQWhEaUosU0FBZ0Q7QUFBQSxVQUFoREEsU0FBZ0Qsa0NBQXBDLGVBQW9DO0FBQUEsK0JBQW5CQyxRQUFtQjtBQUFBLFVBQW5CQSxRQUFtQixpQ0FBUixLQUFROztBQUN2RTs7O0FBR0EsV0FBS2xKLEtBQUwsR0FBYUwsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFiO0FBQ0EsV0FBS0ksS0FBTCxDQUFXSCxTQUFYLElBQXdCLDRCQUF4QjtBQUNBLFdBQUtHLEtBQUwsQ0FBVzFDLFlBQVgsQ0FBd0IsZUFBeEIsRUFBeUMsQ0FBQyxDQUFDLENBQUM0TCxRQUFILEVBQWFoTSxRQUFiLEVBQXpDO0FBQ0EsV0FBSzhDLEtBQUwsQ0FBVzFDLFlBQVgsQ0FBd0IsZUFBeEIsa0JBQXVEMkwsU0FBdkQ7QUFDQSxXQUFLakosS0FBTCxDQUFXRixTQUFYLEdBQXVCRSxLQUF2QjtBQUNBLHFDQUFrQixjQUFsQixFQUFrQyxJQUFsQyxFQUF3QyxLQUFLQSxLQUE3Qzs7QUFFQTs7O0FBR0EsV0FBS1YsSUFBTCxHQUFZSyxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQVo7QUFDQSxXQUFLTixJQUFMLENBQVVPLFNBQVYsSUFBdUIsWUFBdkI7QUFDQSxXQUFLUCxJQUFMLENBQVVoQyxZQUFWLENBQXVCLGFBQXZCLEVBQXNDLENBQUMsQ0FBQzRMLFFBQUYsRUFBWWhNLFFBQVosRUFBdEM7QUFDQSxXQUFLb0MsSUFBTCxDQUFVRCxFQUFWLG1CQUE2QjRKLFNBQTdCO0FBQ0EsV0FBSzNKLElBQUwsQ0FBVTNCLFdBQVYsQ0FBc0IsS0FBS3dMLG1CQUEzQjs7QUFFQTs7O0FBR0EsV0FBS0MsS0FBTCxHQUFhekosU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFiO0FBQ0EsV0FBS3dKLEtBQUwsQ0FBV3ZKLFNBQVgsMkJBQTZDb0osU0FBN0M7QUFDQSxVQUFHQyxRQUFILEVBQVk7QUFDVixhQUFLRSxLQUFMLENBQVc5TCxZQUFYLENBQXdCLE1BQXhCLEVBQWdDLEVBQWhDO0FBQ0Q7QUFDRCxXQUFLOEwsS0FBTCxDQUFXekwsV0FBWCxDQUF1QixLQUFLcUMsS0FBNUI7QUFDQSxXQUFLb0osS0FBTCxDQUFXekwsV0FBWCxDQUF1QixLQUFLMkIsSUFBNUI7QUFDQTs7O0FBR0EsV0FBS21GLFdBQUwsR0FBbUI5RSxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQW5CO0FBQ0EsV0FBSzZFLFdBQUwsQ0FBaUI1RSxTQUFqQjtBQUNBLFdBQUs0RSxXQUFMLENBQWlCOUcsV0FBakIsQ0FBNkIsS0FBS3lMLEtBQWxDO0FBQ0EsMkJBQVUsS0FBSzNFLFdBQWY7QUFDRDs7QUFFRDs7Ozs7O3NDQUdrQjtBQUNoQixVQUFJMkUsUUFBUSxLQUFLQSxLQUFqQjtBQUNBLFVBQUdQLE9BQU9PLEtBQVAsQ0FBSCxFQUFrQjtBQUNoQkEsY0FBTTdMLGVBQU4sQ0FBc0IsTUFBdEI7QUFDRCxPQUZELE1BR0s7QUFDSDZMLGNBQU05TCxZQUFOLENBQW1CLE1BQW5CLEVBQTJCLEVBQTNCO0FBQ0ErTCxtQkFBVyxZQUFVO0FBQUNELGdCQUFNdEwsYUFBTixDQUFvQixpQkFBcEIsRUFBdUM0SixLQUF2QztBQUErQyxTQUFyRSxFQUFzRSxFQUF0RTtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7OzttQ0FHZTNGLEssRUFBTztBQUNwQjs7O0FBR0EsV0FBS3VILE9BQUwsR0FBZTNKLFNBQVNDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBZjtBQUNBLFdBQUswSixPQUFMLENBQWF6SixTQUFiLElBQTBCLFNBQTFCO0FBQ0EsV0FBS3lKLE9BQUwsQ0FBYWhNLFlBQWIsQ0FBMkIsTUFBM0IsRUFBbUMsU0FBbkM7O0FBRUE7OztBQUdBLFdBQUtpTSxjQUFMLEdBQXNCNUosU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUF0QjtBQUNBLFdBQUsySixjQUFMLENBQW9CNUwsV0FBcEIsQ0FBZ0MsS0FBSzJMLE9BQXJDOztBQUVBOzs7QUFHQSxXQUFLSCxtQkFBTCxHQUEyQnhKLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBM0I7QUFDQSxXQUFLdUosbUJBQUwsQ0FBeUJ0SixTQUF6QixJQUFzQyxXQUF0QztBQUNBLFdBQUtzSixtQkFBTCxDQUF5QnhMLFdBQXpCLENBQXFDLEtBQUs0TCxjQUExQztBQUNEOztBQUVEOzs7Ozs7Ozs7OztrQ0FRK0M7QUFBQSxVQUF2Q3ZKLEtBQXVDLFNBQXZDQSxLQUF1QztBQUFBLFVBQWhDWCxFQUFnQyxTQUFoQ0EsRUFBZ0M7QUFBQSxVQUE1QlksT0FBNEIsU0FBNUJBLE9BQTRCO0FBQUEsaUNBQW5CNkMsUUFBbUI7QUFBQSxVQUFuQkEsUUFBbUIsa0NBQVIsS0FBUTs7QUFDN0MsVUFBTTBHLGlCQUFlbkssRUFBckI7QUFDQSxVQUFNb0ssNEJBQTBCcEssRUFBaEM7O0FBRUEsVUFBTXFLLE1BQU0vSixTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQVo7QUFDQThKLFVBQUk3SixTQUFKLElBQWlCLEtBQWpCO0FBQ0E2SixVQUFJckssRUFBSixHQUFTbUssS0FBVDtBQUNBRSxVQUFJcE0sWUFBSixDQUFpQixlQUFqQixFQUFrQ21NLFVBQWxDO0FBQ0FDLFVBQUlwTSxZQUFKLENBQWlCLGVBQWpCLEVBQWtDd0YsU0FBUzVGLFFBQVQsRUFBbEM7QUFDQXdNLFVBQUlwTSxZQUFKLENBQWlCc0wsaUJBQWpCLEVBQW9DdkosRUFBcEM7QUFDQXFLLFVBQUlwTSxZQUFKLENBQWlCLE1BQWpCLEVBQXlCLEtBQXpCO0FBQ0FvTSxVQUFJNUosU0FBSixHQUFnQkUsS0FBaEI7QUFDQSxxQ0FBa0IsWUFBbEIsRUFBZ0MsSUFBaEMsRUFBc0MwSixHQUF0Qzs7QUFFQSxVQUFNQyxXQUFXaEssU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFqQjtBQUNBK0osZUFBU3RLLEVBQVQsR0FBY29LLFVBQWQ7QUFDQUUsZUFBUzlKLFNBQVQsSUFBc0IsVUFBdEI7QUFDQThKLGVBQVNyTSxZQUFULENBQXNCLGdCQUF0QixFQUF3Q2tNLEtBQXhDO0FBQ0FHLGVBQVNyTSxZQUFULENBQXNCLGFBQXRCLEVBQXFDLENBQUMsQ0FBQ3dGLFFBQUYsRUFBWTVGLFFBQVosRUFBckM7QUFDQXlNLGVBQVNyTSxZQUFULENBQXNCLE1BQXRCLEVBQThCLFVBQTlCO0FBQ0FxTSxlQUFTaE0sV0FBVCxDQUFxQnNDLE9BQXJCOztBQUVBLFdBQUtxSixPQUFMLENBQWEzTCxXQUFiLENBQXlCK0wsR0FBekI7QUFDQSxXQUFLUCxtQkFBTCxDQUF5QnhMLFdBQXpCLENBQXFDZ00sUUFBckM7QUFDRDs7QUFFRDs7Ozs7O3NDQUdrQjtBQUNoQixXQUFLTCxPQUFMLENBQWEzTCxXQUFiLENBQXlCZ0MsU0FBU0MsYUFBVCxDQUF1QixNQUF2QixDQUF6QjtBQUNEOzs7bUNBRWM7QUFDYiw4QkFBYSxLQUFLdUosbUJBQWxCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzBDQUtxQjtBQUFBLFVBQUw5SixFQUFLLFNBQUxBLEVBQUs7O0FBQ25CLFdBQUsrSixLQUFMLENBQVd2SixTQUFYLG9CQUFzQ1IsRUFBdEM7QUFDRDs7QUFFRDs7Ozs7Ozs7aUNBS2E7QUFDWCxhQUFPLEtBQUtvRixXQUFaO0FBQ0Q7Ozs7OztrQkE5S2tCcUUsTzs7Ozs7Ozs7Ozs7Ozs7O0FDL0JyQjs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7OztJQU9xQmMsYTtBQUNuQjs7OztBQUlBLHlCQUFZN0gsS0FBWixFQUFtQjtBQUFBOztBQUNqQixTQUFLSSxRQUFMLEdBQWdCLDBCQUFnQjtBQUM5QmpFLGtCQUFZNkQsTUFBTTdEO0FBRFksS0FBaEIsQ0FBaEI7O0FBSUE7QUFDQSxTQUFLaUIsWUFBTCxHQUFvQixLQUFLZ0QsUUFBTCxDQUFjaEQsWUFBZCxFQUFwQjtBQUNEOztBQUVEOzs7Ozs7Ozs7OzsyQkFPT21JLEssRUFBTztBQUNaLGFBQU8sS0FBS25JLFlBQUwsQ0FBa0JYLElBQWxCLENBQXVCcUwsY0FBY3ZDLEtBQWQsQ0FBdkIsQ0FBUDtBQUNEOzs7Ozs7QUFHSDs7Ozs7Ozs7O2tCQTFCcUJzQyxhO0FBaUNyQixJQUFNQyxnQkFBZ0IsdUJBQU0sVUFBU3ZDLEtBQVQsRUFBZ0JuSSxZQUFoQixFQUE4QjtBQUN4RDtBQUNBLE1BQUltSSxTQUFTLEVBQWIsRUFBaUI7QUFDZixXQUFPbkksYUFBYTJLLElBQWIsQ0FBa0IsVUFBU0MsQ0FBVCxFQUFXQyxDQUFYLEVBQWE7QUFDcEMsVUFBR0QsRUFBRS9KLEtBQUYsR0FBVWdLLEVBQUVoSyxLQUFmLEVBQXNCLE9BQU8sQ0FBQyxDQUFSO0FBQ3RCLFVBQUcrSixFQUFFL0osS0FBRixHQUFVZ0ssRUFBRWhLLEtBQWYsRUFBc0IsT0FBTyxDQUFQO0FBQ3RCLGFBQU8sQ0FBUDtBQUNELEtBSk0sQ0FBUDtBQUtEOztBQUVELFNBQU9iLGFBQ0ozQyxHQURJLENBQ0EsVUFBUzRDLFdBQVQsRUFBcUI7QUFDeEI7QUFDQSxRQUFJWCxTQUFTO0FBQ1hXLG1CQUFhQSxXQURGO0FBRVg2SyxhQUFPQyxlQUFlNUMsS0FBZixFQUFzQmxJLFdBQXRCO0FBRkksS0FBYjtBQUlBLFdBQU9YLE1BQVA7QUFDRCxHQVJJLEVBU0poQyxNQVRJLENBU0c7QUFBQSxXQUFVZ0MsT0FBT3dMLEtBQVAsR0FBZSxDQUF6QjtBQUFBLEdBVEgsRUFTK0I7QUFUL0IsR0FVSkgsSUFWSSxDQVVDLFVBQUNDLENBQUQsRUFBR0MsQ0FBSDtBQUFBLFdBQVNBLEVBQUVDLEtBQUYsR0FBVUYsRUFBRUUsS0FBckI7QUFBQSxHQVZELEVBVTZCO0FBVjdCLEdBV0p6TixHQVhJLENBV0E7QUFBQSxXQUFVaUMsT0FBT1csV0FBakI7QUFBQSxHQVhBLENBQVAsQ0FWd0QsQ0FxQmxCO0FBQ3ZDLENBdEJxQixDQUF0Qjs7QUF3QkE7Ozs7Ozs7O0FBUUEsSUFBTThLLGlCQUFpQixTQUFqQkEsY0FBaUIsQ0FBUzVDLEtBQVQsRUFBZ0JsSSxXQUFoQixFQUE2QjtBQUNsRCxNQUFJNkssUUFBUSxDQUFaO0FBQ0E7QUFDQSxNQUFJRSxVQUFVN0MsTUFBTThDLEtBQU4sQ0FBWSxHQUFaLEVBQWlCM04sTUFBakIsQ0FBd0I7QUFBQSxXQUFTNkssVUFBVSxFQUFuQjtBQUFBLEdBQXhCLENBQWQ7O0FBRUE2QyxVQUFRaFAsT0FBUixDQUFnQixVQUFTbU0sS0FBVCxFQUFnQjtBQUM5QixRQUFJK0MsYUFBYS9DLEtBQWIsRUFBb0JsSSxZQUFZWSxLQUFoQyxDQUFKLEVBQTRDO0FBQzFDaUssZUFBUyxHQUFUO0FBQ0Q7QUFDRCxRQUFJSSxhQUFhL0MsS0FBYixFQUFvQmxJLFlBQVlvSCxPQUFoQyxDQUFKLEVBQThDO0FBQzVDeUQsZUFBUyxDQUFUO0FBQ0Q7QUFDRCxRQUFJSSxhQUFhL0MsS0FBYixFQUFvQmxJLFlBQVl3RSxXQUFoQyxDQUFKLEVBQWtEO0FBQ2hEcUcsZUFBUyxDQUFUO0FBQ0Q7QUFDRCxRQUFJSyxrQkFBa0JoRCxLQUFsQixFQUF5QmxJLFlBQVltTCxRQUFyQyxDQUFKLEVBQW9EO0FBQ2hETixlQUFTLENBQVQ7QUFDSDtBQUNGLEdBYkQ7O0FBZUEsU0FBT0EsS0FBUDtBQUNELENBckJEOztBQXVCQTs7Ozs7Ozs7QUFRQSxJQUFNSSxlQUFlLFNBQWZBLFlBQWUsQ0FBU0csTUFBVCxFQUFpQkMsUUFBakIsRUFBMkI7QUFDOUMsTUFBSUEsYUFBYXBLLFNBQWpCLEVBQTRCO0FBQzFCLFdBQU8sS0FBUDtBQUNEOztBQUVELFNBQU9vSyxTQUFTQyxXQUFULEdBQXVCN04sT0FBdkIsQ0FBK0IyTixPQUFPRSxXQUFQLEVBQS9CLE1BQXlELENBQUMsQ0FBakU7QUFDRCxDQU5EOztBQVFBOzs7Ozs7O0FBT0EsSUFBTUosb0JBQW9CLFNBQXBCQSxpQkFBb0IsQ0FBU0ssU0FBVCxFQUFvQnBPLEdBQXBCLEVBQXlCO0FBQ2pELE1BQUlBLFFBQVE4RCxTQUFSLElBQXFCc0ssY0FBYyxFQUF2QyxFQUEyQztBQUN6QyxXQUFPLEtBQVA7QUFDRDs7QUFFRCxTQUFPcE8sSUFBSUcsSUFBSixDQUFTO0FBQUEsV0FBVTJOLGFBQWFNLFNBQWIsRUFBd0JDLE1BQXhCLENBQVY7QUFBQSxHQUFULENBQVA7QUFDRCxDQU5ELEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekhBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7SUFNcUJDLGE7QUFFbkIseUJBQVk5SSxLQUFaLEVBQW1CO0FBQUE7O0FBQUE7O0FBQ2pCLFFBQU03RyxPQUFPLElBQWI7QUFDQSxhQUFjLElBQWQsRUFBb0IseUJBQXBCOztBQUVBO0FBQ0EsU0FBS2lILFFBQUwsR0FBZ0IsMEJBQWdCO0FBQzlCakUsa0JBQVk2RCxNQUFNN0Q7QUFEWSxLQUFoQixDQUFoQjs7QUFJQTtBQUNBLFFBQU00TSxZQUFZbkwsU0FBU0MsYUFBVCxDQUF1QixPQUF2QixDQUFsQjtBQUNBa0wsY0FBVXhOLFlBQVYsQ0FBdUIsTUFBdkIsRUFBK0IsTUFBL0I7O0FBRUE7QUFDQSxRQUFNMEcsWUFBWXJFLFNBQVNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBbEI7QUFDQW9FLGNBQVUrRyxXQUFWLEdBQXdCLEtBQXhCO0FBQ0EvRyxjQUFVckQsZ0JBQVYsQ0FBMkIsT0FBM0IsRUFBb0MsWUFBTTs7QUFFeEM7QUFDQSxVQUFNcUssT0FBTyxJQUFJQyxRQUFKLEVBQWI7QUFDQUQsV0FBS0UsTUFBTCxDQUFZLEtBQVosRUFBbUJKLFVBQVVLLEtBQVYsQ0FBZ0IsQ0FBaEIsQ0FBbkI7O0FBRUE7QUFDQSxZQUFLaEosUUFBTCxDQUFjaUosYUFBZCxDQUE0QkosSUFBNUIsRUFDR3hNLElBREgsQ0FDUSxnQkFBUTtBQUNaO0FBQ0F0RCxhQUFLUixJQUFMLENBQVUsUUFBVixFQUFvQmdFLElBQXBCO0FBQ0QsT0FKSDtBQUtELEtBWkQ7O0FBY0EsUUFBTWdDLFVBQVVmLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBaEI7QUFDQWMsWUFBUS9DLFdBQVIsQ0FBb0JtTixTQUFwQjtBQUNBcEssWUFBUS9DLFdBQVIsQ0FBb0JxRyxTQUFwQjs7QUFFQSxTQUFLUyxXQUFMLEdBQW1CL0QsT0FBbkI7QUFDRDs7OztpQ0FFWTtBQUNYLGFBQU8sS0FBSytELFdBQVo7QUFDRDs7Ozs7O2tCQXpDa0JvRyxhOzs7Ozs7Ozs7Ozs7a0JDY0doSyxJOztBQXZCeEI7O0FBQ0E7O0FBRUE7OztBQUdBLElBQU13SyxVQUFVLHlCQUFRLDRCQUFhLGFBQWIsRUFBNEIsTUFBNUIsQ0FBUixDQUFoQjs7QUFFQTs7O0FBR0EsSUFBTXJLLE9BQU8sNEJBQWEsYUFBYixFQUE0QixPQUE1QixDQUFiOztBQUVBOzs7QUFHQSxJQUFNc0ssY0FBYyx5QkFBUSw0QkFBYSxlQUFiLEVBQThCLE9BQTlCLENBQVIsQ0FBcEI7O0FBRUE7Ozs7O0FBS2UsU0FBU3pLLElBQVQsQ0FBY0gsT0FBZCxFQUF1QjtBQUNwQyxNQUFNNkssT0FBTzdLLFFBQVExQyxnQkFBUixDQUF5QixjQUF6QixDQUFiO0FBQ0EsTUFBTXdOLFlBQVk5SyxRQUFRMUMsZ0JBQVIsQ0FBeUIsbUJBQXpCLENBQWxCOztBQUVBdU4sT0FBS3BRLE9BQUwsQ0FBYSxlQUFPO0FBQ2xCdU8sUUFBSS9JLGdCQUFKLENBQXFCLE9BQXJCLEVBQThCLFVBQVVoRyxLQUFWLEVBQWlCOztBQUU3QzJRLGtCQUFZQyxJQUFaO0FBQ0E1USxZQUFNeUcsTUFBTixDQUFhOUQsWUFBYixDQUEwQixlQUExQixFQUEyQyxNQUEzQzs7QUFFQStOLGNBQVFHLFNBQVI7O0FBRUEsVUFBSS9CLGFBQWE5TyxNQUFNeUcsTUFBTixDQUFhakUsWUFBYixDQUEwQixlQUExQixDQUFqQjtBQUNBNkQsV0FBS04sUUFBUTVDLGFBQVIsT0FBMEIyTCxVQUExQixDQUFMO0FBQ0QsS0FURDtBQVVELEdBWEQ7QUFZRCxDOzs7Ozs7Ozs7QUN2Q0QsbUJBQUFnQyxDQUFRLENBQVI7O0FBRUE7QUFDQUMsTUFBTUEsT0FBTyxFQUFiO0FBQ0FBLElBQUlDLFNBQUosR0FBZ0IsbUJBQUFGLENBQVEsQ0FBUixFQUEwQkcsT0FBMUM7QUFDQUYsSUFBSUMsU0FBSixDQUFjbk0sa0JBQWQsR0FBbUMsbUJBQUFpTSxDQUFRLENBQVIsRUFBbUNHLE9BQXRFLEMiLCJmaWxlIjoiaDVwLWh1Yi1jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZTgyMjNlOGQwZjBlNTRkNWRmMDQiLCIvKipcclxuICogQG1peGluXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgRXZlbnRmdWwgPSAoKSA9PiAoe1xyXG4gIGxpc3RlbmVyczoge30sXHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3RlbiB0byBldmVudFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbc2NvcGVdXHJcbiAgICpcclxuICAgKiBAZnVuY3Rpb25cclxuICAgKiBAcmV0dXJuIHtFdmVudGZ1bH1cclxuICAgKi9cclxuICBvbjogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIsIHNjb3BlKSB7XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlZGVmIHtvYmplY3R9IFRyaWdnZXJcclxuICAgICAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IGxpc3RlbmVyXHJcbiAgICAgKiBAcHJvcGVydHkge29iamVjdH0gc2NvcGVcclxuICAgICAqL1xyXG4gICAgY29uc3QgdHJpZ2dlciA9IHtcclxuICAgICAgJ2xpc3RlbmVyJzogbGlzdGVuZXIsXHJcbiAgICAgICdzY29wZSc6IHNjb3BlXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdID0gdGhpcy5saXN0ZW5lcnNbdHlwZV0gfHwgW107XHJcbiAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXS5wdXNoKHRyaWdnZXIpO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEZpcmUgZXZlbnQuIElmIGFueSBvZiB0aGUgbGlzdGVuZXJzIHJldHVybnMgZmFsc2UsIHJldHVybiBmYWxzZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICAgKiBAcGFyYW0ge29iamVjdH0gW2V2ZW50XVxyXG4gICAqXHJcbiAgICogQGZ1bmN0aW9uXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBmaXJlOiBmdW5jdGlvbih0eXBlLCBldmVudCkge1xyXG4gICAgY29uc3QgdHJpZ2dlcnMgPSB0aGlzLmxpc3RlbmVyc1t0eXBlXSB8fCBbXTtcclxuXHJcbiAgICByZXR1cm4gdHJpZ2dlcnMuZXZlcnkoZnVuY3Rpb24odHJpZ2dlcikge1xyXG4gICAgICByZXR1cm4gdHJpZ2dlci5saXN0ZW5lci5jYWxsKHRyaWdnZXIuc2NvcGUgfHwgdGhpcywgZXZlbnQpICE9PSBmYWxzZTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3RlbnMgZm9yIGV2ZW50cyBvbiBhbm90aGVyIEV2ZW50ZnVsLCBhbmQgcHJvcGFnYXRlIGl0IHRyb3VnaCB0aGlzIEV2ZW50ZnVsXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlc1xyXG4gICAqIEBwYXJhbSB7RXZlbnRmdWx9IGV2ZW50ZnVsXHJcbiAgICovXHJcbiAgcHJvcGFnYXRlOiBmdW5jdGlvbih0eXBlcywgZXZlbnRmdWwpIHtcclxuICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgIHR5cGVzLmZvckVhY2godHlwZSA9PiBldmVudGZ1bC5vbih0eXBlLCBldmVudCA9PiBzZWxmLmZpcmUodHlwZSwgZXZlbnQpKSk7XHJcbiAgfVxyXG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9taXhpbnMvZXZlbnRmdWwuanMiLCIvKipcclxuICogUmV0dXJucyBhIGN1cnJpZWQgdmVyc2lvbiBvZiBhIGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHJldHVybiB7ZnVuY3Rpb259XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3VycnkgPSBmdW5jdGlvbihmbikge1xyXG4gIGNvbnN0IGFyaXR5ID0gZm4ubGVuZ3RoO1xyXG5cclxuICByZXR1cm4gZnVuY3Rpb24gZjEoKSB7XHJcbiAgICBjb25zdCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcclxuICAgIGlmIChhcmdzLmxlbmd0aCA+PSBhcml0eSkge1xyXG4gICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgYXJncyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGYyKCkge1xyXG4gICAgICAgIGNvbnN0IGFyZ3MyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcclxuICAgICAgICByZXR1cm4gZjEuYXBwbHkobnVsbCwgYXJncy5jb25jYXQoYXJnczIpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcG9zZSBmdW5jdGlvbnMgdG9nZXRoZXIsIGV4ZWN1dGluZyBmcm9tIHJpZ2h0IHRvIGxlZnRcclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbi4uLn0gZm5zXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKChmLCBnKSA9PiAoLi4uYXJncykgPT4gZihnKC4uLmFyZ3MpKSk7XHJcblxyXG4vKipcclxuICogQXBwbGllcyBhIGZ1bmN0aW9uIHRvIGVhY2ggZWxlbWVudCBpbiBhbiBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxyXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHJldHVybiB7ZnVuY3Rpb259XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZm9yRWFjaCA9IGN1cnJ5KGZ1bmN0aW9uIChmbiwgYXJyKSB7XHJcbiAgYXJyLmZvckVhY2goZm4pO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBNYXBzIGEgZnVuY3Rpb24gdG8gYW4gYXJyYXlcclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm5cclxuICogQHBhcmFtIHtBcnJheX0gYXJyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IG1hcCA9IGN1cnJ5KGZ1bmN0aW9uIChmbiwgYXJyKSB7XHJcbiAgcmV0dXJuIGFyci5tYXAoZm4pO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWVzIGEgZmlsdGVyIHRvIGFuIGFycmF5XHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cclxuICovXHJcbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSBjdXJyeShmdW5jdGlvbiAoZm4sIGFycikge1xyXG4gIHJldHVybiBhcnIuZmlsdGVyKGZuKTtcclxufSk7XHJcblxyXG4vKipcclxuICogQXBwbGllcyBhIHNvbWUgdG8gYW4gYXJyYXlcclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm5cclxuICogQHBhcmFtIHtBcnJheX0gYXJyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHNvbWUgPSBjdXJyeShmdW5jdGlvbiAoZm4sIGFycikge1xyXG4gIHJldHVybiBhcnIuc29tZShmbik7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiBhbiBhcnJheSBjb250YWlucyBhIHZhbHVlXHJcbiAqXHJcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcclxuICogQHBhcmFtIHtBcnJheX0gYXJyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGNvbnRhaW5zID0gY3VycnkoZnVuY3Rpb24gKHZhbHVlLCBhcnIpIHtcclxuICByZXR1cm4gYXJyLmluZGV4T2YodmFsdWUpICE9IC0xO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGFycmF5IHdpdGhvdXQgdGhlIHN1cHBsaWVkIHZhbHVlc1xyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXNcclxuICogQHBhcmFtIHtBcnJheX0gYXJyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHdpdGhvdXQgPSBjdXJyeShmdW5jdGlvbiAodmFsdWVzLCBhcnIpIHtcclxuICByZXR1cm4gZmlsdGVyKHZhbHVlID0+ICFjb250YWlucyh2YWx1ZSwgdmFsdWVzKSwgYXJyKVxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBUYWtlcyBhIHN0cmluZyB0aGF0IGlzIGVpdGhlciAndHJ1ZScgb3IgJ2ZhbHNlJyBhbmQgcmV0dXJucyB0aGUgb3Bwb3NpdGVcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGJvb2xcclxuICpcclxuICogQHB1YmxpY1xyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgaW52ZXJzZUJvb2xlYW5TdHJpbmcgPSBmdW5jdGlvbiAoYm9vbCkge1xyXG4gIHJldHVybiAoYm9vbCAhPT0gJ3RydWUnKS50b1N0cmluZygpO1xyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvdXRpbHMvZnVuY3Rpb25hbC5qcyIsImltcG9ydCB7Y3VycnksIGludmVyc2VCb29sZWFuU3RyaW5nfSBmcm9tICcuL2Z1bmN0aW9uYWwnXHJcblxyXG4vKipcclxuICogR2V0IGFuIGF0dHJpYnV0ZSB2YWx1ZSBmcm9tIGVsZW1lbnRcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmV4cG9ydCBjb25zdCBnZXRBdHRyaWJ1dGUgPSBjdXJyeShmdW5jdGlvbiAobmFtZSwgZWwpIHtcclxuICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKG5hbWUpO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgYW4gYXR0cmlidXRlIG9uIGEgaHRtbCBlbGVtZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICovXHJcbmV4cG9ydCBjb25zdCBzZXRBdHRyaWJ1dGUgPSBjdXJyeShmdW5jdGlvbiAobmFtZSwgdmFsdWUsIGVsKSB7XHJcbiAgZWwuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcclxufSk7XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGF0dHJpYnV0ZSBmcm9tIGh0bWwgZWxlbWVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICovXHJcbmV4cG9ydCBjb25zdCByZW1vdmVBdHRyaWJ1dGUgPSBjdXJyeShmdW5jdGlvbiAobmFtZSwgZWwpIHtcclxuICBlbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGVsZW1lbnQgaGFzIGFuIGF0dHJpYnV0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHJldHVybiB7Ym9vbGVhbn1cclxuICovXHJcbmV4cG9ydCBjb25zdCBoYXNBdHRyaWJ1dGUgPSBjdXJyeShmdW5jdGlvbiAobmFtZSwgZWwpIHtcclxuICByZXR1cm4gZWwuaGFzQXR0cmlidXRlKG5hbWUpO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBlbGVtZW50IGhhcyBhbiBhdHRyaWJ1dGUgdGhhdCBlcXVhbHNcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcmV0dXJuIHtib29sZWFufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGF0dHJpYnV0ZUVxdWFscyA9IGN1cnJ5KGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgZWwpIHtcclxuICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKG5hbWUpID09PSB2YWx1ZTtcclxufSk7XHJcblxyXG4vKipcclxuICogVG9nZ2xlcyBhbiBhdHRyaWJ1dGUgYmV0d2VlbiAndHJ1ZScgYW5kICdmYWxzZSc7XHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHRvZ2dsZUF0dHJpYnV0ZSA9IGN1cnJ5KGZ1bmN0aW9uIChuYW1lLCBlbCkge1xyXG4gIGNvbnN0IHZhbHVlID0gZ2V0QXR0cmlidXRlKG5hbWUsIGVsKTtcclxuICBzZXRBdHRyaWJ1dGUobmFtZSwgaW52ZXJzZUJvb2xlYW5TdHJpbmcodmFsdWUpLCBlbCk7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBhcHBlbmRDaGlsZCgpIG1ldGhvZCBhZGRzIGEgbm9kZSB0byB0aGUgZW5kIG9mIHRoZSBsaXN0IG9mIGNoaWxkcmVuIG9mIGEgc3BlY2lmaWVkIHBhcmVudCBub2RlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY2hpbGRcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGFwcGVuZENoaWxkID0gY3VycnkoZnVuY3Rpb24gKHBhcmVudCwgY2hpbGQpIHtcclxuICByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcclxufSk7XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IGlzIGEgZGVzY2VuZGFudCBvZiB0aGUgZWxlbWVudCBvbiB3aGljaCBpdCBpcyBpbnZva2VkXHJcbiAqIHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIGdyb3VwIG9mIHNlbGVjdG9ycy5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICovXHJcbmV4cG9ydCBjb25zdCBxdWVyeVNlbGVjdG9yID0gY3VycnkoZnVuY3Rpb24gKHNlbGVjdG9yLCBlbCkge1xyXG4gIHJldHVybiBlbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxufSk7XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIG5vbi1saXZlIE5vZGVMaXN0IG9mIGFsbCBlbGVtZW50cyBkZXNjZW5kZWQgZnJvbSB0aGUgZWxlbWVudCBvbiB3aGljaCBpdFxyXG4gKiBpcyBpbnZva2VkIHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIGdyb3VwIG9mIENTUyBzZWxlY3RvcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHJldHVybiB7Tm9kZUxpc3R9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcXVlcnlTZWxlY3RvckFsbCA9IGN1cnJ5KGZ1bmN0aW9uIChzZWxlY3RvciwgZWwpIHtcclxuICByZXR1cm4gZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvdXRpbHMvZWxlbWVudHMuanMiLCIvKipcclxuICogQHR5cGVkZWYge29iamVjdH0gQ29udGVudFR5cGVcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1hY2hpbmVOYW1lXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtYWpvclZlcnNpb25cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1pbm9yVmVyc2lvblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcGF0Y2hWZXJzaW9uXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBoNXBNYWpvclZlcnNpb25cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGg1cE1pbm9yVmVyc2lvblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gc3VtbWFyeVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZGVzY3JpcHRpb25cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGljb25cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNyZWF0ZWRBdFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdXBkYXRlZF9BdFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaXNSZWNvbW1lbmRlZFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcG9wdWxhcml0eVxyXG4gKiBAcHJvcGVydHkge29iamVjdFtdfSBzY3JlZW5zaG90c1xyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbGljZW5zZVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZXhhbXBsZVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdHV0b3JpYWxcclxuICogQHByb3BlcnR5IHtzdHJpbmdbXX0ga2V5d29yZHNcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG93bmVyXHJcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaW5zdGFsbGVkXHJcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gcmVzdHJpY3RlZFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHViU2VydmljZXMge1xyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhcGlSb290VXJsXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoeyBhcGlSb290VXJsIH0pIHtcclxuICAgIHRoaXMuYXBpUm9vdFVybCA9IGFwaVJvb3RVcmw7XHJcblxyXG4gICAgaWYoIXdpbmRvdy5jYWNoZWRDb250ZW50VHlwZXMpe1xyXG4gICAgICAvLyBUT0RPIHJlbW92ZSB0aGlzIHdoZW4gZG9uZSB0ZXN0aW5nIGZvciBlcnJvcnNcclxuICAgICAgLy8gd2luZG93LmNhY2hlZENvbnRlbnRUeXBlcyA9IGZldGNoKGAke3RoaXMuYXBpUm9vdFVybH1lcnJvcnMvTk9fUkVTUE9OU0UuanNvbmAsIHtcclxuXHJcbiAgICAgIHdpbmRvdy5jYWNoZWRDb250ZW50VHlwZXMgPSBmZXRjaChgJHt0aGlzLmFwaVJvb3RVcmx9Y29udGVudC10eXBlLWNhY2hlYCwge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJ1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0Lmpzb24oKSlcclxuICAgICAgLnRoZW4odGhpcy5pc1ZhbGlkKVxyXG4gICAgICAudGhlbihqc29uID0+IGpzb24ubGlicmFyaWVzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7Q29udGVudFR5cGVbXXxFcnJvck1lc3NhZ2V9IHJlc3BvbnNlXHJcbiAgICogQHJldHVybiB7UHJvbWlzZTxDb250ZW50VHlwZVtdfEVycm9yTWVzc2FnZT59XHJcbiAgICovXHJcbiAgaXNWYWxpZChyZXNwb25zZSkge1xyXG4gICAgaWYgKHJlc3BvbnNlLm1lc3NhZ2VDb2RlKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXNwb25zZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgbGlzdCBvZiBjb250ZW50IHR5cGVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxDb250ZW50VHlwZVtdPn1cclxuICAgKi9cclxuICBjb250ZW50VHlwZXMoKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmNhY2hlZENvbnRlbnRUeXBlcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBDb250ZW50IFR5cGVcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYWNoaW5lTmFtZVxyXG4gICAqXHJcbiAgICogQHJldHVybiB7UHJvbWlzZS48Q29udGVudFR5cGU+fVxyXG4gICAqL1xyXG4gIGNvbnRlbnRUeXBlKG1hY2hpbmVOYW1lKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmNhY2hlZENvbnRlbnRUeXBlcy50aGVuKGNvbnRlbnRUeXBlcyA9PiB7XHJcbiAgICAgIHJldHVybiBjb250ZW50VHlwZXMuZmlsdGVyKGNvbnRlbnRUeXBlID0+IGNvbnRlbnRUeXBlLm1hY2hpbmVOYW1lID09PSBtYWNoaW5lTmFtZSlbMF07XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKnJldHVybiBmZXRjaChgJHt0aGlzLmFwaVJvb3RVcmx9Y29udGVudF90eXBlX2NhY2hlLyR7aWR9YCwge1xyXG4gICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnXHJcbiAgICB9KS50aGVuKHJlc3VsdCA9PiByZXN1bHQuanNvbigpKTsqL1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5zdGFsbHMgYSBjb250ZW50IHR5cGUgb24gdGhlIHNlcnZlclxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxDb250ZW50VHlwZT59XHJcbiAgICovXHJcbiAgaW5zdGFsbENvbnRlbnRUeXBlKGlkKSB7XHJcbiAgICByZXR1cm4gZmV0Y2goYCR7dGhpcy5hcGlSb290VXJsfWxpYnJhcnktaW5zdGFsbD9pZD0ke2lkfWAsIHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXHJcbiAgICAgIGJvZHk6ICcnXHJcbiAgICB9KS50aGVuKHJlc3VsdCA9PiByZXN1bHQuanNvbigpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwbG9hZHMgYSBjb250ZW50IHR5cGUgdG8gdGhlIHNlcnZlciBmb3IgdmFsaWRhdGlvblxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtGb3JtRGF0YX0gZm9ybURhdGEgRm9ybSBjb250YWluaW5nIHRoZSBoNXAgdGhhdCBzaG91bGQgYmUgdXBsb2FkZWQgYXMgJ2g1cCdcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFJldHVybnMgdGhlIHByb21pc2Ugb2YgYSBqc29uIGNvbnRhaW5pbmcgdGhlIGNvbnRlbnQganNvbiBhbmQgdGhlIGg1cCBqc29uXHJcbiAgICovXHJcbiAgdXBsb2FkQ29udGVudChmb3JtRGF0YSkge1xyXG4gICAgcmV0dXJuIGZldGNoKGAke3RoaXMuYXBpUm9vdFVybH1saWJyYXJ5LXVwbG9hZGAsIHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXHJcbiAgICAgIGJvZHk6IGZvcm1EYXRhXHJcbiAgICB9KS50aGVuKHJlc3VsdCA9PiByZXN1bHQuanNvbigpKTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvaHViLXNlcnZpY2VzLmpzIiwiLyoqXHJcbiAqIEBwYXJhbSAge3N0cmluZ30gICBjb25maWcudHlwZSAgICAgICAgIHR5cGUgb2YgdGhlIG1lc3NhZ2U6IGluZm8sIHN1Y2Nlc3MsIGVycm9yXHJcbiAqIEBwYXJhbSAge2Jvb2xlYW59ICBjb25maWcuZGlzbWlzc2libGUgIHdoZXRoZXIgdGhlIG1lc3NhZ2UgY2FuIGJlIGRpc21pc3NlZFxyXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgY29uZmlnLmNvbnRlbnQgICAgICBtZXNzYWdlIGNvbnRlbnQgdXN1YWxseSBhICdoMycgYW5kIGEgJ3AnXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSBkaXYgY29udGFpbmluZyB0aGUgbWVzc2FnZSBlbGVtZW50XHJcbiAqL1xyXG5cclxuLy9UT0RPIGhhbmRsZSBzdHJpbmdzLCBodG1sLCBiYWRseSBmb3JtZWQgb2JqZWN0XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbmRlckVycm9yTWVzc2FnZShtZXNzYWdlKSB7XHJcbiAgLy8gY29uc29sZS5sb2cobWVzc2FnZSk7XHJcbiAgY29uc3QgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBjbG9zZUJ1dHRvbi5jbGFzc05hbWUgPSAnY2xvc2UnO1xyXG4gIGNsb3NlQnV0dG9uLmlubmVySFRNTCA9ICcmI3gyNzE1JztcclxuXHJcbiAgY29uc3QgbWVzc2FnZUNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBtZXNzYWdlQ29udGVudC5jbGFzc05hbWUgPSAnbWVzc2FnZS1jb250ZW50JztcclxuICBtZXNzYWdlQ29udGVudC5pbm5lckhUTUwgPSAnPGgxPicgKyBtZXNzYWdlLnRpdGxlICsgJzwvaDE+JyArICc8cD4nICsgbWVzc2FnZS5jb250ZW50ICsgJzwvcD4nO1xyXG5cclxuICBjb25zdCBtZXNzYWdlV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIG1lc3NhZ2VXcmFwcGVyLmNsYXNzTmFtZSA9ICdtZXNzYWdlJyArICcgJyArIGAke21lc3NhZ2UudHlwZX1gICsgKG1lc3NhZ2UuZGlzbWlzc2libGUgPyAnIGRpc21pc3NpYmxlJyA6ICcnKTtcclxuICBtZXNzYWdlV3JhcHBlci5hcHBlbmRDaGlsZChjbG9zZUJ1dHRvbik7XHJcbiAgbWVzc2FnZVdyYXBwZXIuYXBwZW5kQ2hpbGQobWVzc2FnZUNvbnRlbnQpO1xyXG5cclxuICBpZiAobWVzc2FnZS5idXR0b24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgY29uc3QgbWVzc2FnZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgbWVzc2FnZUJ1dHRvbi5jbGFzc05hbWUgPSAnYnV0dG9uJztcclxuICAgIG1lc3NhZ2VCdXR0b24uaW5uZXJIVE1MID0gbWVzc2FnZS5idXR0b247XHJcbiAgICBtZXNzYWdlV3JhcHBlci5hcHBlbmRDaGlsZChtZXNzYWdlQnV0dG9uKTtcclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKG1lc3NhZ2VXcmFwcGVyKTtcclxuICByZXR1cm4gbWVzc2FnZVdyYXBwZXI7XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL3V0aWxzL2Vycm9ycy5qcyIsImltcG9ydCB7IGN1cnJ5IH0gZnJvbSBcInV0aWxzL2Z1bmN0aW9uYWxcIjtcclxuXHJcbi8qKlxyXG4gKiAgVHJhbnNmb3JtcyBhIERPTSBjbGljayBldmVudCBpbnRvIGFuIEV2ZW50ZnVsJ3MgZXZlbnRcclxuICogIEBzZWUgRXZlbnRmdWxcclxuICpcclxuICogQHBhcmFtICB7c3RyaW5nIHwgT2JqZWN0fSB0eXBlXHJcbiAqIEBwYXJhbSAge0V2ZW50ZnVsfSBldmVudGZ1bFxyXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICovXHJcbmV4cG9ydCBjb25zdCByZWxheUNsaWNrRXZlbnRBcyA9IGN1cnJ5KGZ1bmN0aW9uKHR5cGUsIGV2ZW50ZnVsLCBlbGVtZW50KSB7XHJcbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgIGV2ZW50ZnVsLmZpcmUodHlwZSwge1xyXG4gICAgICBlbGVtZW50OiBlbGVtZW50LFxyXG4gICAgICBpZDogZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKVxyXG4gICAgfSwgZmFsc2UpO1xyXG5cclxuICAgIC8vIGRvbid0IGJ1YmJsZVxyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBlbGVtZW50O1xyXG59KTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvdXRpbHMvZXZlbnRzLmpzIiwiaW1wb3J0IHtzZXRBdHRyaWJ1dGUsIGF0dHJpYnV0ZUVxdWFscywgdG9nZ2xlQXR0cmlidXRlfSBmcm9tICcuLi91dGlscy9lbGVtZW50cyc7XHJcbmltcG9ydCB7Y3VycnksIGZvckVhY2h9IGZyb20gJy4uL3V0aWxzL2Z1bmN0aW9uYWwnO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtmdW5jdGlvbn1cclxuICovXHJcbmNvbnN0IGlzRXhwYW5kZWQgPSBhdHRyaWJ1dGVFcXVhbHMoXCJhcmlhLWV4cGFuZGVkXCIsICd0cnVlJyk7XHJcblxyXG4vKipcclxuICogQHR5cGUge2Z1bmN0aW9ufVxyXG4gKi9cclxuY29uc3QgaGlkZSA9IHNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtmdW5jdGlvbn1cclxuICovXHJcbmNvbnN0IHNob3cgPSBzZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4vKipcclxuICogVG9nZ2xlcyB0aGUgYm9keSB2aXNpYmlsaXR5XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGJvZHlFbGVtZW50XHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNFeHBhbmRlZFxyXG4gKi9cclxuY29uc3QgdG9nZ2xlQm9keVZpc2liaWxpdHkgPSBmdW5jdGlvbihib2R5RWxlbWVudCwgaXNFeHBhbmRlZCkge1xyXG4gIGlmKCFpc0V4cGFuZGVkKSB7XHJcbiAgICBoaWRlKGJvZHlFbGVtZW50KTtcclxuICAgIC8vYm9keUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIwXCI7XHJcbiAgfVxyXG4gIGVsc2UgLyppZihib2R5RWxlbWVudC5zY3JvbGxIZWlnaHQgPiAwKSovIHtcclxuICAgIHNob3coYm9keUVsZW1lbnQpO1xyXG4gICAgLy9ib2R5RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHtib2R5RWxlbWVudC5zY3JvbGxIZWlnaHR9cHhgO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBIYW5kbGVzIGNoYW5nZXMgdG8gYXJpYS1leHBhbmRlZFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBib2R5RWxlbWVudFxyXG4gKiBAcGFyYW0ge011dGF0aW9uUmVjb3JkfSBldmVudFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICovXHJcbmNvbnN0IG9uQXJpYUV4cGFuZGVkQ2hhbmdlID0gY3VycnkoZnVuY3Rpb24oYm9keUVsZW1lbnQsIGV2ZW50KSB7XHJcbiAgdG9nZ2xlQm9keVZpc2liaWxpdHkoYm9keUVsZW1lbnQsIGlzRXhwYW5kZWQoZXZlbnQudGFyZ2V0KSk7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemVzIGEgcGFuZWxcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluaXQoZWxlbWVudCkge1xyXG4gIGNvbnN0IHRpdGxlRWwgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWV4cGFuZGVkXScpO1xyXG4gIGNvbnN0IGJvZHlJZCA9IHRpdGxlRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgY29uc3QgYm9keUVsID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAjJHtib2R5SWR9YCk7XHJcblxyXG4gIGlmKHRpdGxlRWwpIHtcclxuICAgIC8vIHNldCBvYnNlcnZlciBvbiB0aXRsZSBmb3IgYXJpYS1leHBhbmRlZFxyXG4gICAgbGV0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZm9yRWFjaChvbkFyaWFFeHBhbmRlZENoYW5nZShib2R5RWwpKSk7XHJcblxyXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0aXRsZUVsLCB7XHJcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXHJcbiAgICAgIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlLFxyXG4gICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFtcImFyaWEtZXhwYW5kZWRcIl1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFNldCBjbGljayBsaXN0ZW5lciB0aGF0IHRvZ2dsZXMgYXJpYS1leHBhbmRlZFxyXG4gICAgdGl0bGVFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIHRvZ2dsZUF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgZXZlbnQudGFyZ2V0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRvZ2dsZUJvZHlWaXNpYmlsaXR5KGJvZHlFbCwgaXNFeHBhbmRlZCh0aXRsZUVsKSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZWxlbWVudDtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvY29tcG9uZW50cy9wYW5lbC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSFpwWlhkQ2IzZzlJakFnTUNBME1EQWdNakkxSWo0TkNpQWdQR1JsWm5NK0RRb2dJQ0FnUEhOMGVXeGxQZzBLSUNBZ0lDQWdMbU5zY3kweElIc05DaUFnSUNBZ0lHWnBiR3c2SUc1dmJtVTdEUW9nSUNBZ0lDQjlEUW9OQ2lBZ0lDQWdJQzVqYkhNdE1pQjdEUW9nSUNBZ0lDQm1hV3hzT2lBall6WmpObU0zT3cwS0lDQWdJQ0FnZlEwS0RRb2dJQ0FnSUNBdVkyeHpMVE1zSUM1amJITXROQ0I3RFFvZ0lDQWdJQ0JtYVd4c09pQWpabVptT3cwS0lDQWdJQ0FnZlEwS0RRb2dJQ0FnSUNBdVkyeHpMVE1nZXcwS0lDQWdJQ0FnYjNCaFkybDBlVG9nTUM0M093MEtJQ0FnSUNBZ2ZRMEtJQ0FnSUR3dmMzUjViR1UrRFFvZ0lEd3ZaR1ZtY3o0TkNpQWdQSFJwZEd4bFBtTnZiblJsYm5RZ2RIbHdaU0J3YkdGalpXaHZiR1JsY2w4eVBDOTBhWFJzWlQ0TkNpQWdQR2NnYVdROUlreGhlV1Z5WHpJaUlHUmhkR0V0Ym1GdFpUMGlUR0Y1WlhJZ01pSStEUW9nSUNBZ1BHY2dhV1E5SW1OdmJuUmxiblJmZEhsd1pWOXdiR0ZqWldodmJHUmxjaTB4WDJOdmNIa2lJR1JoZEdFdGJtRnRaVDBpWTI5dWRHVnVkQ0IwZVhCbElIQnNZV05sYUc5c1pHVnlMVEVnWTI5d2VTSStEUW9nSUNBZ0lDQThjbVZqZENCamJHRnpjejBpWTJ4ekxURWlJSGRwWkhSb1BTSTBNREFpSUdobGFXZG9kRDBpTWpJMUlpOCtEUW9nSUNBZ0lDQThjbVZqZENCamJHRnpjejBpWTJ4ekxUSWlJSGc5SWpFeE1pNDFNU0lnZVQwaU5ETXVOREVpSUhkcFpIUm9QU0l4TnpZdU9UWWlJR2hsYVdkb2REMGlNVE0xTGpRMUlpQnllRDBpTVRBaUlISjVQU0l4TUNJdlBnMEtJQ0FnSUNBZ1BHTnBjbU5zWlNCamJHRnpjejBpWTJ4ekxUTWlJR040UFNJeE16WXVOallpSUdONVBTSTJNUzQ1T0NJZ2NqMGlOQzQ0TVNJdlBnMEtJQ0FnSUNBZ1BHTnBjbU5zWlNCamJHRnpjejBpWTJ4ekxUTWlJR040UFNJeE5URXVORGtpSUdONVBTSTJNUzQ1T0NJZ2NqMGlOQzQ0TVNJdlBnMEtJQ0FnSUNBZ1BHTnBjbU5zWlNCamJHRnpjejBpWTJ4ekxUTWlJR040UFNJeE5qWXVNU0lnWTNrOUlqWXhMams0SWlCeVBTSTBMamd4SWk4K0RRb2dJQ0FnSUNBOFp5QnBaRDBpWDBkeWIzVndYeUlnWkdGMFlTMXVZVzFsUFNJbWJIUTdSM0p2ZFhBbVozUTdJajROQ2lBZ0lDQWdJQ0FnUEdjZ2FXUTlJbDlIY205MWNGOHlJaUJrWVhSaExXNWhiV1U5SWlac2REdEhjbTkxY0NabmREc2lQZzBLSUNBZ0lDQWdJQ0FnSUR4d1lYUm9JR2xrUFNKZlEyOXRjRzkxYm1SZlVHRjBhRjhpSUdSaGRHRXRibUZ0WlQwaUpteDBPME52YlhCdmRXNWtJRkJoZEdnbVozUTdJaUJqYkdGemN6MGlZMnh6TFRRaUlHUTlJazB5TmpNdU1qZ3NPVFV1TWpGRE1qWXdMRGt5TGpBM0xESTFOU3c1TVM0MUxESTBPQzQwTXl3NU1TNDFTREl5TjNZNFNERTVPUzQxYkMweUxqRTNMREV3TGpJMFlUSTFMamcwTERJMUxqZzBMREFzTUN3eExERXhMalE0TFRFdU5qTXNNVGt1T1RNc01Ua3VPVE1zTUN3d0xERXNNVFF1TXprc05TNDFOeXd4T0M0eU5pd3hPQzR5Tml3d0xEQXNNU3cxTGpVeUxERXpMallzTWpNdU1URXNNak11TVRFc01Dd3dMREV0TWk0NE5Dd3hNUzR3TlN3eE9DNDJOU3d4T0M0Mk5Td3dMREFzTVMwNExqQTJMRGN1Tnprc09TdzVMREFzTUN3eExUUXVNVElzTVM0ek4wZ3lNeloyTFRJeGFERXdMalF5WXpjdU16WXNNQ3d4TWk0NE15MHhMall4TERFMkxqUXlMVFZ6TlM0ek9DMDNMalE0TERVdU16Z3RNVE11TkRSRE1qWTRMakl5TERFd01pNHlPU3d5TmpZdU5UY3NPVGd1TXpVc01qWXpMakk0TERrMUxqSXhXbTB0TVRVc01UZGpMVEV1TkRJc01TNHlNaTB6TGprc01TNHlOUzAzTGpReExERXVNalZJTWpNMmRpMHhOR2cxTGpZeVlUa3VOVGNzT1M0MU55d3dMREFzTVN3M0xESXVPVE1zTnk0d05TdzNMakExTERBc01Dd3hMREV1T0RVc05DNDVNa0UyTGpNekxEWXVNek1zTUN3d0xERXNNalE0TGpNeExERXhNaTR5TlZvaUx6NE5DaUFnSUNBZ0lDQWdJQ0E4Y0dGMGFDQnBaRDBpWDFCaGRHaGZJaUJrWVhSaExXNWhiV1U5SWlac2REdFFZWFJvSm1kME95SWdZMnhoYzNNOUltTnNjeTAwSWlCa1BTSk5NakF5TGprc01URTVMakV4WVRndU1USXNPQzR4TWl3d0xEQXNNQzAzTGpJNExEUXVOVEpzTFRFMkxURXVNaklzTnk0eU1pMHpNQzQ1TWtneE56UjJNakpJTVRVemRpMHlNa2d4TXpaMk5UWm9NVGQyTFRJeGFESXhkakl4YURJd0xqTXhZeTB5TGpjeUxEQXROUzB4TGpVekxUY3RNMkV4T1M0eE9Td3hPUzR4T1N3d0xEQXNNUzAwTGpjekxUUXVPRE1zTWpNdU5UZ3NNak11TlRnc01Dd3dMREV0TXkwMkxqWnNNVFl0TWk0eU5tRTRMakV4TERndU1URXNNQ3d4TERBc055NHlOaTB4TVM0M01sb2lMejROQ2lBZ0lDQWdJQ0FnUEM5blBnMEtJQ0FnSUNBZ1BDOW5QZzBLSUNBZ0lDQWdQSEpsWTNRZ1kyeGhjM005SW1Oc2N5MHpJaUI0UFNJeE56Y3VOallpSUhrOUlqVTNMalkySWlCM2FXUjBhRDBpT1RJdU1qZ2lJR2hsYVdkb2REMGlPUzR6T0NJZ2NuZzlJak11TlNJZ2NuazlJak11TlNJdlBnMEtJQ0FnSUR3dlp6NE5DaUFnUEM5blBnMEtQQzl6ZG1jK0RRbz1cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltYWdlcy9jb250ZW50LXR5cGUtcGxhY2Vob2xkZXIuc3ZnXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBIdWJWaWV3IGZyb20gJy4vaHViLXZpZXcnO1xyXG5pbXBvcnQgQ29udGVudFR5cGVTZWN0aW9uIGZyb20gJy4vY29udGVudC10eXBlLXNlY3Rpb24vY29udGVudC10eXBlLXNlY3Rpb24nO1xyXG5pbXBvcnQgVXBsb2FkU2VjdGlvbiBmcm9tICcuL3VwbG9hZC1zZWN0aW9uL3VwbG9hZC1zZWN0aW9uJztcclxuaW1wb3J0IEh1YlNlcnZpY2VzIGZyb20gJy4vaHViLXNlcnZpY2VzJztcclxuaW1wb3J0IHsgRXZlbnRmdWwgfSBmcm9tICcuL21peGlucy9ldmVudGZ1bCc7XHJcbmltcG9ydCB7cmVuZGVyRXJyb3JNZXNzYWdlfSBmcm9tICcuL3V0aWxzL2Vycm9ycyc7XHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBIdWJTdGF0ZVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdGl0bGVcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IHNlY3Rpb25JZFxyXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGV4cGFuZGVkXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhcGlSb290VXJsXHJcbiAqL1xyXG4vKipcclxuICogQHR5cGVkZWYge29iamVjdH0gRXJyb3JNZXNzYWdlXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXNzYWdlXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBlcnJvckNvZGVcclxuICovXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBTZWxlY3RlZEVsZW1lbnRcclxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWRcclxuICovXHJcbi8qKlxyXG4gKiBTZWxlY3QgZXZlbnRcclxuICogQGV2ZW50IEh1YiNzZWxlY3RcclxuICogQHR5cGUge1NlbGVjdGVkRWxlbWVudH1cclxuICovXHJcbi8qKlxyXG4gKiBFcnJvciBldmVudFxyXG4gKiBAZXZlbnQgSHViI2Vycm9yXHJcbiAqIEB0eXBlIHtFcnJvck1lc3NhZ2V9XHJcbiAqL1xyXG4vKipcclxuICogVXBsb2FkIGV2ZW50XHJcbiAqIEBldmVudCBIdWIjdXBsb2FkXHJcbiAqIEB0eXBlIHtPYmplY3R9XHJcbiAqL1xyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEBtaXhlcyBFdmVudGZ1bFxyXG4gKiBAZmlyZXMgSHViI3NlbGVjdFxyXG4gKiBAZmlyZXMgSHViI2Vycm9yXHJcbiAqIEBmaXJlcyBIdWIjdXBsb2FkXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdWIge1xyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7SHViU3RhdGV9IHN0YXRlXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIC8vIGFkZCBldmVudCBzeXN0ZW1cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgRXZlbnRmdWwoKSk7XHJcblxyXG4gICAgLy8gY29udHJvbGxlcnNcclxuICAgIHRoaXMuY29udGVudFR5cGVTZWN0aW9uID0gbmV3IENvbnRlbnRUeXBlU2VjdGlvbihzdGF0ZSk7XHJcbiAgICB0aGlzLnVwbG9hZFNlY3Rpb24gPSBuZXcgVXBsb2FkU2VjdGlvbihzdGF0ZSk7XHJcblxyXG4gICAgLy8gdmlld3NcclxuICAgIHRoaXMudmlldyA9IG5ldyBIdWJWaWV3KHN0YXRlKTtcclxuXHJcbiAgICAvLyBzZXJ2aWNlc1xyXG4gICAgdGhpcy5zZXJ2aWNlcyA9IG5ldyBIdWJTZXJ2aWNlcyh7XHJcbiAgICAgIGFwaVJvb3RVcmw6IHN0YXRlLmFwaVJvb3RVcmxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHByb3BhZ2F0ZSBjb250cm9sbGVyIGV2ZW50c1xyXG4gICAgdGhpcy5wcm9wYWdhdGUoWydzZWxlY3QnLCAnZXJyb3InXSwgdGhpcy5jb250ZW50VHlwZVNlY3Rpb24pO1xyXG4gICAgdGhpcy5wcm9wYWdhdGUoWyd1cGxvYWQnXSwgdGhpcy51cGxvYWRTZWN0aW9uKTtcclxuXHJcbiAgICAvLyBoYW5kbGUgZXZlbnRzXHJcbiAgICB0aGlzLm9uKCdzZWxlY3QnLCB0aGlzLnNldFBhbmVsVGl0bGUsIHRoaXMpO1xyXG4gICAgdGhpcy5vbignc2VsZWN0JywgdGhpcy52aWV3LmNsb3NlUGFuZWwsIHRoaXMudmlldyk7XHJcbiAgICB0aGlzLnZpZXcub24oJ3RhYi1jaGFuZ2UnLCB0aGlzLnZpZXcuc2V0U2VjdGlvblR5cGUsIHRoaXMudmlldyk7XHJcbiAgICB0aGlzLnZpZXcub24oJ3BhbmVsLWNoYW5nZScsIHRoaXMudmlldy50b2dnbGVQYW5lbE9wZW4uYmluZCh0aGlzLnZpZXcpLCB0aGlzLnZpZXcpO1xyXG5cclxuICAgIHRoaXMuaW5pdFRhYlBhbmVsKClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHByb21pc2Ugb2YgYSBjb250ZW50IHR5cGVcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWFjaGluZU5hbWVcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxDb250ZW50VHlwZT59XHJcbiAgICovXHJcbiAgZ2V0Q29udGVudFR5cGUobWFjaGluZU5hbWUpIHtcclxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VzLmNvbnRlbnRUeXBlKG1hY2hpbmVOYW1lKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIHRpdGxlIG9mIHRoZSBwYW5lbFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXHJcbiAgICovXHJcbiAgc2V0UGFuZWxUaXRsZSh7aWR9KcKge1xyXG4gICAgdGhpcy5nZXRDb250ZW50VHlwZShpZCkudGhlbigoe3RpdGxlfSkgPT4gdGhpcy52aWV3LnNldFRpdGxlKHRpdGxlKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbml0aWF0ZXMgdGhlIHRhYiBwYW5lbFxyXG4gICAqL1xyXG4gIGluaXRUYWJQYW5lbCgpIHtcclxuICAgIGNvbnN0IHRhYkNvbmZpZ3MgPSBbe1xyXG4gICAgICB0aXRsZTogJ0NyZWF0ZSBDb250ZW50JyxcclxuICAgICAgaWQ6ICdjb250ZW50LXR5cGVzJyxcclxuICAgICAgY29udGVudDogdGhpcy5jb250ZW50VHlwZVNlY3Rpb24uZ2V0RWxlbWVudCgpLFxyXG4gICAgICBzZWxlY3RlZDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgdGl0bGU6ICdVcGxvYWQnLFxyXG4gICAgICBpZDogJ3VwbG9hZCcsXHJcbiAgICAgIGNvbnRlbnQ6IHRoaXMudXBsb2FkU2VjdGlvbi5nZXRFbGVtZW50KClcclxuICAgIH1dO1xyXG5cclxuICAgIHRhYkNvbmZpZ3MuZm9yRWFjaCh0YWJDb25maWcgPT4gdGhpcy52aWV3LmFkZFRhYih0YWJDb25maWcpKTtcclxuICAgIHRoaXMudmlldy5hZGRCb3R0b21Cb3JkZXIoKTsgLy8gQWRkcyBhbiBhbmltYXRlZCBib3R0b20gYm9yZGVyIHRvIGVhY2ggdGFiXHJcbiAgICB0aGlzLnZpZXcuaW5pdFRhYlBhbmVsKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSByb290IGVsZW1lbnQgaW4gdGhlIHZpZXdcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAqL1xyXG4gIGdldEVsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy52aWV3LmdldEVsZW1lbnQoKTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvaHViLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZXMvbWFpbi5zY3NzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHNldEF0dHJpYnV0ZSwgZ2V0QXR0cmlidXRlIH0gZnJvbSBcInV0aWxzL2VsZW1lbnRzXCI7XHJcbmltcG9ydCB7IGN1cnJ5IH0gZnJvbSBcInV0aWxzL2Z1bmN0aW9uYWxcIjtcclxuaW1wb3J0IHsgRXZlbnRmdWwgfSBmcm9tICcuLi9taXhpbnMvZXZlbnRmdWwnO1xyXG5pbXBvcnQgaW5pdFBhbmVsIGZyb20gXCJjb21wb25lbnRzL3BhbmVsXCI7XHJcbmltcG9ydCB7IHJlbGF5Q2xpY2tFdmVudEFzIH0gZnJvbSAnLi4vdXRpbHMvZXZlbnRzJztcclxuaW1wb3J0IG5vSWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvY29udGVudC10eXBlLXBsYWNlaG9sZGVyLnN2Zyc7XHJcblxyXG4vKipcclxuICogQGNvbnN0YW50IHtzdHJpbmd9XHJcbiAqL1xyXG5jb25zdCBBVFRSSUJVVEVfQ09OVEVOVF9UWVBFX0lEID0gJ2RhdGEtaWQnO1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuY29uc3QgaGlkZSA9IHNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuY29uc3Qgc2hvdyA9IHNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbi8qKlxyXG4gKiBUb2dnbGVzIHRoZSB2aXNpYmlsaXR5IGlmIGFuIGVsZW1lbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGVcclxuICovXHJcbmNvbnN0IHRvZ2dsZVZpc2liaWxpdHkgPSAoZWxlbWVudCwgdmlzaWJsZSkgPT4gKHZpc2libGUgPyBzaG93IDogaGlkZSkoZWxlbWVudCk7XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIGEgc3RyaW5nIGlzIGVtcHR5XHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XHJcbiAqXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VtcHR5ID0gKHRleHQpID0+ICh0eXBlb2YgdGV4dCA9PT0gJ3N0cmluZycpICYmICh0ZXh0Lmxlbmd0aCA9PT0gMCk7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEBtaXhlcyBFdmVudGZ1bFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudFR5cGVEZXRhaWxWaWV3IHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgLy8gYWRkIGV2ZW50IHN5c3RlbVxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBFdmVudGZ1bCgpKTtcclxuXHJcbiAgICAvLyBiYWNrIGJ1dHRvblxyXG4gICAgY29uc3QgYmFja0J1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGJhY2tCdXR0b25FbGVtZW50LmNsYXNzTmFtZSA9ICdiYWNrLWJ1dHRvbiBpY29uLWFycm93LXRoaWNrJztcclxuICAgIHJlbGF5Q2xpY2tFdmVudEFzKCdjbG9zZScsIHRoaXMsIGJhY2tCdXR0b25FbGVtZW50KTtcclxuXHJcbiAgICAvLyBpbWFnZVxyXG4gICAgdGhpcy5pbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgdGhpcy5pbWFnZS5jbGFzc05hbWUgPSAnaW1nLXJlc3BvbnNpdmUnO1xyXG5cclxuICAgIGNvbnN0IGltYWdlV3JhcHBlckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGltYWdlV3JhcHBlckVsZW1lbnQuY2xhc3NOYW1lID0gJ2ltYWdlLXdyYXBwZXInO1xyXG4gICAgaW1hZ2VXcmFwcGVyRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmltYWdlKTtcclxuXHJcbiAgICAvLyB0aXRsZVxyXG4gICAgdGhpcy50aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XHJcblxyXG4gICAgLy8gYXV0aG9yXHJcbiAgICB0aGlzLmF1dGhvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGhpcy5hdXRob3IuY2xhc3NOYW1lID0gJ2F1dGhvcic7XHJcbiAgICB0aGlzLmF1dGhvci5pbm5lckhUTUwgPSAnYnkgSm91YmVsJzsgLy8gVE9ETyBNYWtlIGR5bmFtaWNcclxuXHJcbiAgICAvLyBkZXNjcmlwdGlvblxyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24uY2xhc3NOYW1lID0gJ3NtYWxsJztcclxuXHJcbiAgICAvLyBkZW1vIGJ1dHRvblxyXG4gICAgdGhpcy5kZW1vQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgdGhpcy5kZW1vQnV0dG9uLmNsYXNzTmFtZSA9ICdidXR0b24nO1xyXG4gICAgdGhpcy5kZW1vQnV0dG9uLmlubmVySFRNTCA9ICdDb250ZW50IERlbW8nO1xyXG4gICAgdGhpcy5kZW1vQnV0dG9uLnNldEF0dHJpYnV0ZSgndGFyZ2V0JywgJ19ibGFuaycpO1xyXG4gICAgaGlkZSh0aGlzLmRlbW9CdXR0b24pO1xyXG5cclxuICAgIGNvbnN0IHRleHREZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0ZXh0RGV0YWlscy5jbGFzc05hbWUgPSAndGV4dC1kZXRhaWxzJztcclxuICAgIHRleHREZXRhaWxzLmFwcGVuZENoaWxkKHRoaXMudGl0bGUpO1xyXG4gICAgdGV4dERldGFpbHMuYXBwZW5kQ2hpbGQodGhpcy5hdXRob3IpO1xyXG4gICAgdGV4dERldGFpbHMuYXBwZW5kQ2hpbGQodGhpcy5kZXNjcmlwdGlvbik7XHJcbiAgICB0ZXh0RGV0YWlscy5hcHBlbmRDaGlsZCh0aGlzLmRlbW9CdXR0b24pO1xyXG5cclxuICAgIGNvbnN0IGRldGFpbHNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkZXRhaWxzRWxlbWVudC5jbGFzc05hbWUgPSAnY29udGFpbmVyJztcclxuICAgIGRldGFpbHNFbGVtZW50LmFwcGVuZENoaWxkKGltYWdlV3JhcHBlckVsZW1lbnQpO1xyXG4gICAgZGV0YWlsc0VsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dERldGFpbHMpO1xyXG5cclxuICAgIC8vIHVzZSBidXR0b25cclxuICAgIHRoaXMudXNlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgdGhpcy51c2VCdXR0b24uY2xhc3NOYW1lID0gJ2J1dHRvbiBidXR0b24tcHJpbWFyeSc7XHJcbiAgICB0aGlzLnVzZUJ1dHRvbi5pbm5lckhUTUwgPSAnVXNlJztcclxuICAgIGhpZGUodGhpcy51c2VCdXR0b24pO1xyXG4gICAgcmVsYXlDbGlja0V2ZW50QXMoJ3NlbGVjdCcsIHRoaXMsIHRoaXMudXNlQnV0dG9uKTtcclxuXHJcbiAgICAvLyBpbnN0YWxsIGJ1dHRvblxyXG4gICAgdGhpcy5pbnN0YWxsQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgdGhpcy5pbnN0YWxsQnV0dG9uLmNsYXNzTmFtZSA9ICdidXR0b24gYnV0dG9uLWludmVyc2UtcHJpbWFyeSc7XHJcbiAgICB0aGlzLmluc3RhbGxCdXR0b24uaW5uZXJIVE1MID0gJ0luc3RhbGwnO1xyXG4gICAgaGlkZSh0aGlzLmluc3RhbGxCdXR0b24pO1xyXG4gICAgcmVsYXlDbGlja0V2ZW50QXMoJ2luc3RhbGwnLCB0aGlzLCB0aGlzLmluc3RhbGxCdXR0b24pO1xyXG5cclxuICAgIGNvbnN0IGJ1dHRvbkJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgYnV0dG9uQmFyLmNsYXNzTmFtZSA9ICdidXR0b24tYmFyJztcclxuICAgIGJ1dHRvbkJhci5hcHBlbmRDaGlsZCh0aGlzLnVzZUJ1dHRvbik7XHJcbiAgICBidXR0b25CYXIuYXBwZW5kQ2hpbGQodGhpcy5pbnN0YWxsQnV0dG9uKTtcclxuXHJcbiAgICAvLyBsaWNlbmNlIHBhbmVsXHJcbiAgICBjb25zdCBsaWNlbmNlUGFuZWwgPSB0aGlzLmNyZWF0ZVBhbmVsKCdUaGUgTGljZW5jZSBJbmZvJywgJ2lwc3VtIGxvcnVtJywgJ2xpY2VuY2UtcGFuZWwnKTtcclxuICAgIGNvbnN0IHBsdWdpbnNQYW5lbCA9IHRoaXMuY3JlYXRlUGFuZWwoJ0F2YWlsYWJsZSBwbHVnaW5zJywgJ2lwc3VtIGxvcnVtJywgJ3BsdWdpbnMtcGFuZWwnKTtcclxuICAgIGNvbnN0IHB1Ymxpc2hlclBhbmVsID0gdGhpcy5jcmVhdGVQYW5lbCgnUHVibGlzaGVyIEluZm8nLCAnaXBzdW0gbG9ydW0nLCAncHVibGlzaGVyLXBhbmVsJyk7XHJcblxyXG4gICAgLy8gcGFuZWwgZ3JvdXBcclxuICAgIGNvbnN0IHBhbmVsR3JvdXBFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBwYW5lbEdyb3VwRWxlbWVudC5jbGFzc05hbWUgPSAncGFuZWwtZ3JvdXAnO1xyXG4gICAgcGFuZWxHcm91cEVsZW1lbnQuYXBwZW5kQ2hpbGQobGljZW5jZVBhbmVsKTtcclxuICAgIHBhbmVsR3JvdXBFbGVtZW50LmFwcGVuZENoaWxkKHBsdWdpbnNQYW5lbCk7XHJcbiAgICBwYW5lbEdyb3VwRWxlbWVudC5hcHBlbmRDaGlsZChwdWJsaXNoZXJQYW5lbCk7XHJcblxyXG4gICAgLy8gaW1hZ2VzXHJcbiAgICB0aGlzLmNhcm91c2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcclxuXHJcblxyXG4gICAgLy8gYWRkIHJvb3QgZWxlbWVudFxyXG4gICAgdGhpcy5yb290RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGhpcy5yb290RWxlbWVudC5jbGFzc05hbWUgPSAnY29udGVudC10eXBlLWRldGFpbCc7XHJcbiAgICB0aGlzLnJvb3RFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgdGhpcy5yb290RWxlbWVudC5hcHBlbmRDaGlsZChiYWNrQnV0dG9uRWxlbWVudCk7XHJcbiAgICB0aGlzLnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKGRldGFpbHNFbGVtZW50KTtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQoYnV0dG9uQmFyKTtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jYXJvdXNlbCk7XHJcbiAgICB0aGlzLnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKHBhbmVsR3JvdXBFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBwYW5lbFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGJvZHlcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gYm9keUlkXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICAgKi9cclxuICBjcmVhdGVQYW5lbCh0aXRsZSwgYm9keSwgYm9keUlkKSB7XHJcbiAgICBjb25zdCBoZWFkZXJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgaGVhZGVyRWwuY2xhc3NOYW1lID0gJ3BhbmVsLWhlYWRlcic7XHJcbiAgICBoZWFkZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgIGhlYWRlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIGJvZHlJZCk7XHJcbiAgICBoZWFkZXJFbC5pbm5lckhUTUwgPSB0aXRsZTtcclxuXHJcbiAgICBjb25zdCBib2R5SW5uZXJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgYm9keUlubmVyRWwuY2xhc3NOYW1lID0gJ3BhbmVsLWJvZHktaW5uZXInO1xyXG4gICAgYm9keUlubmVyRWwuaW5uZXJIVE1MID0gYm9keTtcclxuXHJcbiAgICBjb25zdCBib2R5RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGJvZHlFbC5jbGFzc05hbWUgPSAncGFuZWwtYm9keSc7XHJcbiAgICBib2R5RWwuaWQgPSBib2R5SWQ7XHJcbiAgICBib2R5RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICBib2R5RWwuYXBwZW5kQ2hpbGQoYm9keUlubmVyRWwpO1xyXG5cclxuICAgIGNvbnN0IHBhbmVsRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHBhbmVsRWwuY2xhc3NOYW1lID0gJ3BhbmVsJztcclxuICAgIHBhbmVsRWwuYXBwZW5kQ2hpbGQoaGVhZGVyRWwpO1xyXG4gICAgcGFuZWxFbC5hcHBlbmRDaGlsZChib2R5RWwpO1xyXG5cclxuICAgIGluaXRQYW5lbChwYW5lbEVsKTtcclxuXHJcbiAgICByZXR1cm4gcGFuZWxFbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZCBpbWFnZSB0byB0aGUgY2Fyb3VzZWxcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpbWFnZVxyXG4gICAqL1xyXG4gIGFkZEltYWdlVG9DYXJvdXNlbChpbWFnZSkge1xyXG4gICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICBpdGVtLmlubmVySFRNTCA9IGA8aW1nIHNyYz1cIiR7aW1hZ2UudXJsfVwiIGFsdD1cIiR7aW1hZ2UuYWx0fVwiIHN0eWxlPVwid2lkdGg6IDEwMHB4O1wiLz5gO1xyXG5cclxuICAgIHRoaXMuY2Fyb3VzZWwuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBpbWFnZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNyY1xyXG4gICAqL1xyXG4gIHNldEltYWdlKHNyYykge1xyXG4gICAgdGhpcy5pbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYyB8fCBub0ljb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgdGl0bGVcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxyXG4gICAqL1xyXG4gIHNldElkKGlkKSB7XHJcbiAgICB0aGlzLmluc3RhbGxCdXR0b24uc2V0QXR0cmlidXRlKEFUVFJJQlVURV9DT05URU5UX1RZUEVfSUQsIGlkKTtcclxuICAgIHRoaXMudXNlQnV0dG9uLnNldEF0dHJpYnV0ZShBVFRSSUJVVEVfQ09OVEVOVF9UWVBFX0lELCBpZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSB0aXRsZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlXHJcbiAgICovXHJcbiAgc2V0VGl0bGUodGl0bGUpIHtcclxuICAgIHRoaXMudGl0bGUuaW5uZXJIVE1MID0gdGl0bGU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBsb25nIGRlc2NyaXB0aW9uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxyXG4gICAqL1xyXG4gIHNldERlc2NyaXB0aW9uKHRleHQpIHtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24uaW5uZXJIVE1MID0gdGV4dDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGV4YW1wbGUgdXJsXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXHJcbiAgICovXHJcbiAgc2V0RXhhbXBsZSh1cmwpIHtcclxuICAgIHRoaXMuZGVtb0J1dHRvbi5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwgfHwgJyMnKTtcclxuICAgIHRvZ2dsZVZpc2liaWxpdHkodGhpcy5kZW1vQnV0dG9uLCAhaXNFbXB0eSh1cmwpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgaWYgdGhlIGNvbnRlbnQgdHlwZSBpcyBpbnN0YWxsZWRcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5zdGFsbGVkXHJcbiAgICovXHJcbiAgc2V0SXNJbnN0YWxsZWQoaW5zdGFsbGVkKSB7XHJcbiAgICB0b2dnbGVWaXNpYmlsaXR5KHRoaXMudXNlQnV0dG9uLCBpbnN0YWxsZWQpO1xyXG4gICAgdG9nZ2xlVmlzaWJpbGl0eSh0aGlzLmluc3RhbGxCdXR0b24sICFpbnN0YWxsZWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGlkZXMgdGhlIHJvb3QgZWxlbWVudFxyXG4gICAqL1xyXG4gIGhpZGUoKSB7XHJcbiAgICBoaWRlKHRoaXMucm9vdEVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2hvd3MgdGhlIHJvb3QgZWxlbWVudFxyXG4gICAqL1xyXG4gIHNob3coKSB7XHJcbiAgICBzaG93KHRoaXMucm9vdEVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcm9vdCBodG1sIGVsZW1lbnRcclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICAgKi9cclxuICBnZXRFbGVtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucm9vdEVsZW1lbnQ7XHJcbiAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvY29udGVudC10eXBlLWRldGFpbC9jb250ZW50LXR5cGUtZGV0YWlsLXZpZXcuanMiLCJpbXBvcnQgQ29udGV0VHlwZURldGFpbFZpZXcgZnJvbSBcIi4vY29udGVudC10eXBlLWRldGFpbC12aWV3XCI7XHJcbmltcG9ydCBIdWJTZXJ2aWNlcyBmcm9tIFwiLi4vaHViLXNlcnZpY2VzXCI7XHJcbmltcG9ydCB7IEV2ZW50ZnVsIH0gZnJvbSAnLi4vbWl4aW5zL2V2ZW50ZnVsJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQG1peGVzIEV2ZW50ZnVsXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50VHlwZURldGFpbCB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIC8vIGFkZCBldmVudCBzeXN0ZW1cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgRXZlbnRmdWwoKSk7XHJcblxyXG4gICAgLy8gc2VydmljZXNcclxuICAgIHRoaXMuc2VydmljZXMgPSBuZXcgSHViU2VydmljZXMoe1xyXG4gICAgICBhcGlSb290VXJsOiBzdGF0ZS5hcGlSb290VXJsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyB2aWV3c1xyXG4gICAgdGhpcy52aWV3ID0gbmV3IENvbnRldFR5cGVEZXRhaWxWaWV3KHN0YXRlKTtcclxuICAgIHRoaXMudmlldy5vbignaW5zdGFsbCcsIHRoaXMuaW5zdGFsbCwgdGhpcyk7XHJcblxyXG4gICAgLy8gcHJvcGFnYXRlIGV2ZW50c1xyXG4gICAgdGhpcy5wcm9wYWdhdGUoWydjbG9zZScsICdzZWxlY3QnXSwgdGhpcy52aWV3KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhpZGVzIHRoZSBkZXRhaWwgdmlld1xyXG4gICAqL1xyXG4gIGhpZGUoKSB7XHJcbiAgICB0aGlzLnZpZXcuaGlkZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2hvd3MgdGhlIGRldGFpbCB2aWV3XHJcbiAgICovXHJcbiAgc2hvdygpIHtcclxuICAgIHRoaXMudmlldy5zaG93KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMb2FkcyBhIENvbnRlbnQgVHlwZSBkZXNjcmlwdGlvblxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxDb250ZW50VHlwZT59XHJcbiAgICovXHJcbiAgbG9hZEJ5SWQoaWQpIHtcclxuICAgIHRoaXMuc2VydmljZXMuY29udGVudFR5cGUoaWQpXHJcbiAgICAgIC50aGVuKHRoaXMudXBkYXRlLmJpbmQodGhpcykpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMb2FkcyBhIENvbnRlbnQgVHlwZSBkZXNjcmlwdGlvblxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxDb250ZW50VHlwZT59XHJcbiAgICovXHJcbiAgIGluc3RhbGwoe2lkfSkge1xyXG4gICAgIHJldHVybiB0aGlzLnNlcnZpY2VzLmNvbnRlbnRUeXBlKGlkKVxyXG4gICAgICAgLnRoZW4oY29udGVudFR5cGUgPT4gY29udGVudFR5cGUubWFjaGluZU5hbWUpXHJcbiAgICAgICAudGhlbihtYWNoaW5lTmFtZSA9PiB0aGlzLnNlcnZpY2VzLmluc3RhbGxDb250ZW50VHlwZShtYWNoaW5lTmFtZSkpXHJcbiAgICAgICAudGhlbihjb250ZW50VHlwZSA9PiBjb25zb2xlLmRlYnVnKCdUT0RPLCBndWkgdXBkYXRlcycpKVxyXG4gICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZXMgdGhlIHZpZXcgd2l0aCB0aGUgY29udGVudCB0eXBlIGRhdGFcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Q29udGVudFR5cGV9IGNvbnRlbnRUeXBlXHJcbiAgICovXHJcbiAgdXBkYXRlKGNvbnRlbnRUeXBlKSB7XHJcbiAgICB0aGlzLnZpZXcuc2V0SWQoY29udGVudFR5cGUubWFjaGluZU5hbWUpO1xyXG4gICAgdGhpcy52aWV3LnNldFRpdGxlKGNvbnRlbnRUeXBlLnRpdGxlKTtcclxuICAgIHRoaXMudmlldy5zZXREZXNjcmlwdGlvbihjb250ZW50VHlwZS5kZXNjcmlwdGlvbik7XHJcbiAgICB0aGlzLnZpZXcuc2V0SW1hZ2UoY29udGVudFR5cGUuaWNvbik7XHJcbiAgICB0aGlzLnZpZXcuc2V0RXhhbXBsZShjb250ZW50VHlwZS5leGFtcGxlKTtcclxuICAgIHRoaXMudmlldy5zZXRJc0luc3RhbGxlZCghIWNvbnRlbnRUeXBlLmluc3RhbGxlZCk7XHJcblxyXG4gICAgY29udGVudFR5cGUuc2NyZWVuc2hvdHMuZm9yRWFjaCh0aGlzLnZpZXcuYWRkSW1hZ2VUb0Nhcm91c2VsLCB0aGlzLnZpZXcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcm9vdCBodG1sIGVsZW1lbnRcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAqL1xyXG4gIGdldEVsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy52aWV3LmdldEVsZW1lbnQoKTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvY29udGVudC10eXBlLWRldGFpbC9jb250ZW50LXR5cGUtZGV0YWlsLmpzIiwiaW1wb3J0IHsgY3VycnkgfSBmcm9tIFwidXRpbHMvZnVuY3Rpb25hbFwiO1xyXG5pbXBvcnQgeyBzZXRBdHRyaWJ1dGUsIGdldEF0dHJpYnV0ZSB9IGZyb20gXCJ1dGlscy9lbGVtZW50c1wiO1xyXG5pbXBvcnQgeyBFdmVudGZ1bCB9IGZyb20gJy4uL21peGlucy9ldmVudGZ1bCc7XHJcbmltcG9ydCB7IHJlbGF5Q2xpY2tFdmVudEFzIH0gZnJvbSAnLi4vdXRpbHMvZXZlbnRzJztcclxuaW1wb3J0IG5vSWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvY29udGVudC10eXBlLXBsYWNlaG9sZGVyLnN2Zyc7XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5jb25zdCBoaWRlID0gc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5jb25zdCBzaG93ID0gc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBAbWl4ZXMgRXZlbnRmdWxcclxuICogQGZpcmVzIEh1YiNzZWxlY3RcclxuICogQGZpcmVzIENvbnRlbnRUeXBlTGlzdCNyb3ctc2VsZWN0ZWRcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRUeXBlTGlzdFZpZXcge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ3BsYWNlJywgbm9JY29uKTtcclxuXHJcbiAgICAvLyBhZGQgZXZlbnQgc3lzdGVtXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIEV2ZW50ZnVsKCkpO1xyXG5cclxuICAgIC8vIGNyZWF0ZSByb290IGVsZW1lbnRcclxuICAgIHRoaXMucm9vdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xyXG4gICAgdGhpcy5yb290RWxlbWVudC5jbGFzc05hbWUgPSAnY29udGVudC10eXBlLWxpc3QnO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGlkZXMgdGhlIHJvb3QgZWxlbWVudFxyXG4gICAqL1xyXG4gIGhpZGUoKSB7XHJcbiAgICBoaWRlKHRoaXMucm9vdEVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2hvd3MgdGhlIHJvb3QgZWxlbWVudFxyXG4gICAqL1xyXG4gIHNob3coKSB7XHJcbiAgICBzaG93KHRoaXMucm9vdEVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlcyBhbGwgcm93cyBmcm9tIHJvb3QgZWxlbWVudFxyXG4gICAqL1xyXG4gIHJlbW92ZUFsbFJvd3MoKSB7XHJcbiAgICBpZih0aGlzLnJvb3RFbGVtZW50KXtcclxuICAgICAgd2hpbGUodGhpcy5yb290RWxlbWVudC5maXJzdENoaWxkKXtcclxuICAgICAgICB0aGlzLnJvb3RFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMucm9vdEVsZW1lbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZHMgYSByb3dcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Q29udGVudFR5cGV9IGNvbnRlbnRUeXBlXHJcbiAgICovXHJcbiAgYWRkUm93KGNvbnRlbnRUeXBlKSB7XHJcbiAgICBjb25zdCByb3cgPSB0aGlzLmNyZWF0ZUNvbnRlbnRUeXBlUm93KGNvbnRlbnRUeXBlLCB0aGlzKTtcclxuICAgIHJlbGF5Q2xpY2tFdmVudEFzKCdyb3ctc2VsZWN0ZWQnLCB0aGlzLCByb3cpO1xyXG4gICAgdGhpcy5yb290RWxlbWVudC5hcHBlbmRDaGlsZChyb3cpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUYWtlcyBhIENvbnRlbnQgVHlwZSBjb25maWd1cmF0aW9uIGFuZCBjcmVhdGVzIGEgcm93IGRvbVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtDb250ZW50VHlwZX0gY29udGVudFR5cGVcclxuICAgKiBAcGFyYW0ge0V2ZW50ZnVsfSBzY29wZVxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgY3JlYXRlQ29udGVudFR5cGVSb3coY29udGVudFR5cGUsIHNjb3BlKSB7XHJcbiAgICAvLyByb3cgaXRlbVxyXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICBlbGVtZW50LmlkID0gYGNvbnRlbnQtdHlwZS0ke2NvbnRlbnRUeXBlLm1hY2hpbmVOYW1lfWA7XHJcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIGNvbnRlbnRUeXBlLm1hY2hpbmVOYW1lKTtcclxuXHJcbiAgICAvLyBjcmVhdGUgYnV0dG9uIGNvbmZpZ1xyXG4gICAgY29uc3QgdXNlQnV0dG9uQ29uZmlnID0geyB0ZXh0OiAnVXNlJywgY2xzOiAnYnV0dG9uLXByaW1hcnknIH07XHJcbiAgICBjb25zdCBpbnN0YWxsQnV0dG9uQ29uZmlnID0geyB0ZXh0OiAnaW5zdGFsbCcsIGNsczogJ2J1dHRvbi1pbnZlcnNlLXByaW1hcnknfTtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGNvbnRlbnRUeXBlLmluc3RhbGxlZCA/ICB1c2VCdXR0b25Db25maWc6IGluc3RhbGxCdXR0b25Db25maWc7XHJcblxyXG4gICAgY29uc3QgdGl0bGUgPSBjb250ZW50VHlwZS50aXRsZSB8fCBjb250ZW50VHlwZS5tYWNoaW5lTmFtZTtcclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gY29udGVudFR5cGUuc3VtbWFyeSB8fCAnJztcclxuXHJcbiAgICBjb25zdCBpbWFnZSA9IGNvbnRlbnRUeXBlLmljb24gfHwgbm9JY29uO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBodG1sXHJcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IGBcclxuICAgICAgPGltZyBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgc3JjPVwiJHtpbWFnZX1cIj5cclxuICAgICAgPHNwYW4gY2xhc3M9XCJidXR0b24gJHtidXR0b24uY2xzfVwiIGRhdGEtaWQ9XCIke2NvbnRlbnRUeXBlLm1hY2hpbmVOYW1lfVwiIHRhYmluZGV4PVwiMFwiPiR7YnV0dG9uLnRleHR9PC9zcGFuPlxyXG4gICAgICA8aDQ+JHt0aXRsZX08L2g0PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZGVzY3JpcHRpb25cIj4ke2Rlc2NyaXB0aW9ufTwvZGl2PlxyXG4gICBgO1xyXG5cclxuICAgIC8vIGhhbmRsZSB1c2UgYnV0dG9uXHJcbiAgICBjb25zdCB1c2VCdXR0b24gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXR0b24tcHJpbWFyeScpO1xyXG4gICAgaWYodXNlQnV0dG9uKXtcclxuICAgICAgcmVsYXlDbGlja0V2ZW50QXMoJ3NlbGVjdCcsIHNjb3BlLCB1c2VCdXR0b24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcm9vdCBlbGVtZW50XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICAgKi9cclxuICBnZXRFbGVtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucm9vdEVsZW1lbnQ7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1saXN0L2NvbnRlbnQtdHlwZS1saXN0LXZpZXcuanMiLCJpbXBvcnQgQ29udGV0VHlwZUxpc3RWaWV3IGZyb20gXCIuL2NvbnRlbnQtdHlwZS1saXN0LXZpZXdcIjtcclxuaW1wb3J0IHtFdmVudGZ1bH0gZnJvbSAnLi4vbWl4aW5zL2V2ZW50ZnVsJztcclxuXHJcbi8qKlxyXG4gKiBSb3cgc2VsZWN0ZWQgZXZlbnRcclxuICogQGV2ZW50IENvbnRlbnRUeXBlTGlzdCNyb3ctc2VsZWN0ZWRcclxuICogQHR5cGUge1NlbGVjdGVkRWxlbWVudH1cclxuICovXHJcbi8qKlxyXG4gKiBVcGRhdGUgY29udGVudCB0eXBlIGxpc3QgZXZlbnRcclxuICogQGV2ZW50IENvbnRlbnRUeXBlTGlzdCN1cGRhdGUtY29udGVudC10eXBlLWxpc3RcclxuICogQHR5cGUge1NlbGVjdGVkRWxlbWVudH1cclxuICovXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQG1peGVzIEV2ZW50ZnVsXHJcbiAqIEBmaXJlcyBIdWIjc2VsZWN0XHJcbiAqIEBmaXJlcyBDb250ZW50VHlwZUxpc3Qjcm93LXNlbGVjdGVkXHJcbiAqIEBmaXJlcyBDb250ZW50VHlwZUxpc3QjdXBkYXRlLWNvbnRlbnQtdHlwZS1saXN0XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50VHlwZUxpc3Qge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICAvLyBhZGQgZXZlbnQgc3lzdGVtXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIEV2ZW50ZnVsKCkpO1xyXG5cclxuICAgIC8vIGFkZCB0aGUgdmlld1xyXG4gICAgdGhpcy52aWV3ID0gbmV3IENvbnRldFR5cGVMaXN0VmlldyhzdGF0ZSk7XHJcbiAgICB0aGlzLnByb3BhZ2F0ZShbJ3Jvdy1zZWxlY3RlZCcsICdzZWxlY3QnXSwgdGhpcy52aWV3KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhpZGUgdGhpcyBlbGVtZW50XHJcbiAgICovXHJcbiAgaGlkZSgpIHtcclxuICAgIHRoaXMudmlldy5oaWRlKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaG93IHRoaXMgZWxlbWVudFxyXG4gICAqL1xyXG4gIHNob3coKSB7XHJcbiAgICB0aGlzLnZpZXcuc2hvdygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHRoZSBsaXN0IHdpdGggbmV3IGNvbnRlbnQgdHlwZXNcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Q29udGVudFR5cGVbXX0gY29udGVudFR5cGVzXHJcbiAgICovXHJcbiAgdXBkYXRlKGNvbnRlbnRUeXBlcykge1xyXG4gICAgdGhpcy52aWV3LnJlbW92ZUFsbFJvd3MoKTtcclxuICAgIGNvbnRlbnRUeXBlcy5mb3JFYWNoKHRoaXMudmlldy5hZGRSb3csIHRoaXMudmlldyk7XHJcbiAgICB0aGlzLmZpcmUoJ3VwZGF0ZS1jb250ZW50LXR5cGUtbGlzdCcsIHt9KTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSB2aWV3cyByb290IGVsZW1lbnRcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAqL1xyXG4gIGdldEVsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy52aWV3LmdldEVsZW1lbnQoKTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvY29udGVudC10eXBlLWxpc3QvY29udGVudC10eXBlLWxpc3QuanMiLCJpbXBvcnQge0V2ZW50ZnVsfSBmcm9tICcuLi9taXhpbnMvZXZlbnRmdWwnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBDb250ZW50QnJvd3NlclZpZXdcclxuICogQG1peGVzIEV2ZW50ZnVsXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50QnJvd3NlclZpZXcge1xyXG4gIC8qKlxyXG4gICAqIEBjb25zdHJ1Y3RvclxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZVxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICAvLyBhZGQgZXZlbnQgc3lzdGVtXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIEV2ZW50ZnVsKCkpO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBlbGVtZW50c1xyXG4gICAgY29uc3QgbWVudSA9IHRoaXMuY3JlYXRlTWVudUVsZW1lbnQoKTtcclxuICAgIGNvbnN0IGlucHV0R3JvdXAgPSB0aGlzLmNyZWF0ZUlucHV0R3JvdXBFbGVtZW50KCk7XHJcblxyXG4gICAgLy8gbWVudSBncm91cFxyXG4gICAgY29uc3QgbWVudUdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBtZW51R3JvdXAuY2xhc3NOYW1lID0gJ21lbnUtZ3JvdXAnO1xyXG4gICAgbWVudUdyb3VwLmFwcGVuZENoaWxkKG1lbnUpO1xyXG4gICAgbWVudUdyb3VwLmFwcGVuZENoaWxkKGlucHV0R3JvdXApO1xyXG5cclxuICAgIC8vIHJvb3QgZWxlbWVudFxyXG4gICAgdGhpcy5yb290RWxlbWVudCAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQobWVudUdyb3VwKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZHMgYSBtZW51IGl0ZW1cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICAgKi9cclxuICBhZGRNZW51SXRlbSh0ZXh0KSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdyb2xlJywgJ21lbnVpdGVtJyk7XHJcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IHRleHQ7XHJcblxyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgdGhpcy5maXJlKCdtZW51LXNlbGVjdGVkJywge1xyXG4gICAgICAgIGVsZW1lbnQ6IGV2ZW50LnRhcmdldFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHNldHMgZmlyc3QgdG8gYmUgc2VsZWN0ZWRcclxuICAgIGlmKHRoaXMubWVudUJhckVsZW1lbnQuY2hpbGRFbGVtZW50Q291bnQgPCAxKSB7XHJcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhZGQgdG8gbWVudSBiYXJcclxuICAgIHRoaXMubWVudUJhckVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcblxyXG4gICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIHRoZSBtZW51IGJhciBlbGVtZW50XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAqL1xyXG4gIGNyZWF0ZU1lbnVFbGVtZW50KCkge1xyXG4gICAgdGhpcy5tZW51QmFyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XHJcbiAgICB0aGlzLm1lbnVCYXJFbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdtZW51YmFyJyk7XHJcbiAgICB0aGlzLm1lbnVCYXJFbGVtZW50LmNsYXNzTmFtZSA9ICdoNXAtbWVudSc7XHJcblxyXG4gICAgY29uc3QgbmF2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ25hdicpO1xyXG4gICAgbmF2RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1lbnVCYXJFbGVtZW50KTtcclxuXHJcbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGl0bGUuY2xhc3NOYW1lID0gXCJtZW51LXRpdGxlXCI7XHJcbiAgICB0aXRsZS5pbm5lckhUTUwgPSBcIkJyb3dzZSBjb250ZW50IHR5cGVzXCI7XHJcblxyXG4gICAgY29uc3QgbWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgbWVudS5jbGFzc05hbWUgPSBcIm1lbnVcIjtcclxuICAgIG1lbnUuYXBwZW5kQ2hpbGQodGl0bGUpO1xyXG4gICAgbWVudS5hcHBlbmRDaGlsZChuYXZFbGVtZW50KTtcclxuXHJcbiAgICByZXR1cm4gbWVudTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgdGhlIGlucHV0IGdyb3VwIHVzZWQgZm9yIHNlYXJjaFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgY3JlYXRlSW5wdXRHcm91cEVsZW1lbnQoKSB7XHJcbiAgICAvLyBpbnB1dCBmaWVsZFxyXG4gICAgY29uc3QgaW5wdXRGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICBpbnB1dEZpZWxkLmlkID0gXCJodWItc2VhcmNoLWJhclwiO1xyXG4gICAgaW5wdXRGaWVsZC5jbGFzc05hbWUgPSAnZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1yb3VuZGVkJztcclxuICAgIGlucHV0RmllbGQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcclxuICAgIGlucHV0RmllbGQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIFwiU2VhcmNoIGZvciBDb250ZW50IFR5cGVzXCIpO1xyXG4gICAgaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGV2ZW50ID0+IHtcclxuICAgICAgdGhpcy5maXJlKCdzZWFyY2gnLCB7XHJcbiAgICAgICAgZWxlbWVudDogZXZlbnQudGFyZ2V0LFxyXG4gICAgICAgIHF1ZXJ5OiBldmVudC50YXJnZXQudmFsdWVcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBpbnB1dCBidXR0b25cclxuICAgIGNvbnN0IGlucHV0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBpbnB1dEJ1dHRvbi5jbGFzc05hbWUgPSAnaW5wdXQtZ3JvdXAtYWRkb24gaWNvbi1zZWFyY2gnO1xyXG4gICAgaW5wdXRCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignI3NlYXJjaC1iYXInKS5mb2N1cygpXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGlucHV0IGdyb3VwXHJcbiAgICBjb25zdCBpbnB1dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBpbnB1dEdyb3VwLmNsYXNzTmFtZSA9ICdpbnB1dC1ncm91cCc7XHJcbiAgICBpbnB1dEdyb3VwLmFwcGVuZENoaWxkKGlucHV0RmllbGQpO1xyXG4gICAgaW5wdXRHcm91cC5hcHBlbmRDaGlsZChpbnB1dEJ1dHRvbik7XHJcblxyXG4gICAgcmV0dXJuIGlucHV0R3JvdXA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSByb290IGVsZW1lbnQgb2YgdGhlIGNvbnRlbnQgYnJvd3NlclxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLnJvb3RFbGVtZW50O1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9jb250ZW50LXR5cGUtc2VjdGlvbi9jb250ZW50LXR5cGUtc2VjdGlvbi12aWV3LmpzIiwiaW1wb3J0IENvbnRlbnRUeXBlU2VjdGlvblZpZXcgZnJvbSBcIi4vY29udGVudC10eXBlLXNlY3Rpb24tdmlld1wiO1xyXG5pbXBvcnQgU2VhcmNoU2VydmljZSBmcm9tIFwiLi4vc2VhcmNoLXNlcnZpY2Uvc2VhcmNoLXNlcnZpY2VcIjtcclxuaW1wb3J0IENvbnRlbnRUeXBlTGlzdCBmcm9tICcuLi9jb250ZW50LXR5cGUtbGlzdC9jb250ZW50LXR5cGUtbGlzdCc7XHJcbmltcG9ydCBDb250ZW50VHlwZURldGFpbCBmcm9tICcuLi9jb250ZW50LXR5cGUtZGV0YWlsL2NvbnRlbnQtdHlwZS1kZXRhaWwnO1xyXG5pbXBvcnQge0V2ZW50ZnVsfSBmcm9tICcuLi9taXhpbnMvZXZlbnRmdWwnO1xyXG5pbXBvcnQge3JlbmRlckVycm9yTWVzc2FnZX0gZnJvbSAnLi4vdXRpbHMvZXJyb3JzJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgQ29udGVudFR5cGVTZWN0aW9uXHJcbiAqIEBtaXhlcyBFdmVudGZ1bFxyXG4gKlxyXG4gKiBAZmlyZXMgSHViI3NlbGVjdFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudFR5cGVTZWN0aW9uIHtcclxuICAvKipcclxuICAgKiBAcGFyYW0ge0h1YlN0YXRlfSBzdGF0ZVxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICAvLyBhZGQgZXZlbnQgc3lzdGVtXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIEV2ZW50ZnVsKCkpO1xyXG5cclxuICAgIC8vIGFkZCB2aWV3XHJcbiAgICB0aGlzLnZpZXcgPSBuZXcgQ29udGVudFR5cGVTZWN0aW9uVmlldyhzdGF0ZSk7XHJcblxyXG4gICAgLy8gY29udHJvbGxlclxyXG4gICAgdGhpcy5zZWFyY2hTZXJ2aWNlID0gbmV3IFNlYXJjaFNlcnZpY2UoeyBhcGlSb290VXJsOiBzdGF0ZS5hcGlSb290VXJsIH0pO1xyXG4gICAgdGhpcy5jb250ZW50VHlwZUxpc3QgPSBuZXcgQ29udGVudFR5cGVMaXN0KCk7XHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlRGV0YWlsID0gbmV3IENvbnRlbnRUeXBlRGV0YWlsKHsgYXBpUm9vdFVybDogc3RhdGUuYXBpUm9vdFVybCB9KTtcclxuXHJcbiAgICAvLyBhZGQgbWVudSBpdGVtc1xyXG4gICAgWydNeSBDb250ZW50IFR5cGVzJywgJ05ld2VzdCcsICdNb3N0IFBvcHVsYXInLCAnUmVjb21tZW5kZWQnXVxyXG4gICAgICAuZm9yRWFjaChtZW51VGV4dCA9PiB0aGlzLnZpZXcuYWRkTWVudUl0ZW0obWVudVRleHQpKTtcclxuXHJcbiAgICAvLyBFbGVtZW50IGZvciBob2xkaW5nIGxpc3QgYW5kIGRldGFpbHMgdmlld3NcclxuICAgIGNvbnN0IHNlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgnY29udGVudC10eXBlLXNlY3Rpb24nKTtcclxuXHJcbiAgICB0aGlzLnJvb3RFbGVtZW50ID0gc2VjdGlvbjtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50VHlwZUxpc3QuZ2V0RWxlbWVudCgpKTtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50VHlwZURldGFpbC5nZXRFbGVtZW50KCkpO1xyXG5cclxuICAgIHRoaXMudmlldy5nZXRFbGVtZW50KCkuYXBwZW5kQ2hpbGQodGhpcy5yb290RWxlbWVudCk7XHJcblxyXG4gICAgLy8gcHJvcGFnYXRlIGV2ZW50c1xyXG4gICAgdGhpcy5wcm9wYWdhdGUoWydzZWxlY3QnLCAndXBkYXRlLWNvbnRlbnQtdHlwZS1saXN0J10sIHRoaXMuY29udGVudFR5cGVMaXN0KTtcclxuICAgIHRoaXMucHJvcGFnYXRlKFsnc2VsZWN0J10sIHRoaXMuY29udGVudFR5cGVEZXRhaWwpO1xyXG5cclxuICAgIC8vIHJlZ2lzdGVyIGxpc3RlbmVyc1xyXG4gICAgdGhpcy52aWV3Lm9uKCdzZWFyY2gnLCB0aGlzLnNlYXJjaCwgdGhpcyk7XHJcbiAgICB0aGlzLnZpZXcub24oJ21lbnUtc2VsZWN0ZWQnLCB0aGlzLmFwcGx5U2VhcmNoRmlsdGVyLCB0aGlzKTtcclxuICAgIHRoaXMuY29udGVudFR5cGVMaXN0Lm9uKCdyb3ctc2VsZWN0ZWQnLCB0aGlzLnNob3dEZXRhaWxWaWV3LCB0aGlzKTtcclxuICAgIHRoaXMuY29udGVudFR5cGVEZXRhaWwub24oJ2Nsb3NlJywgdGhpcy5jbG9zZURldGFpbFZpZXcsIHRoaXMpO1xyXG4gICAgdGhpcy5jb250ZW50VHlwZURldGFpbC5vbignc2VsZWN0JywgdGhpcy5jbG9zZURldGFpbFZpZXcsIHRoaXMpO1xyXG5cclxuICAgIHRoaXMuaW5pdENvbnRlbnRUeXBlTGlzdCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhdGVzIHRoZSBjb250ZW50IHR5cGUgbGlzdCB3aXRoIGEgc2VhcmNoXHJcbiAgICovXHJcbiAgaW5pdENvbnRlbnRUeXBlTGlzdCgpIHtcclxuICAgIC8vIGluaXRpYWxpemUgYnkgc2VhcmNoXHJcbiAgICB0aGlzLnNlYXJjaFNlcnZpY2Uuc2VhcmNoKFwiXCIpXHJcbiAgICAgIC50aGVuKGNvbnRlbnRUeXBlcyA9PiB0aGlzLmNvbnRlbnRUeXBlTGlzdC51cGRhdGUoY29udGVudFR5cGVzKSlcclxuICAgICAgLmNhdGNoKGVycm9yID0+IHRoaXMuZmlyZSgnZXJyb3InLCBlcnJvcikpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXhlY3V0ZXMgYSBzZWFyY2ggYW5kIHVwZGF0ZXMgdGhlIGNvbnRlbnQgdHlwZSBsaXN0XHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcXVlcnlcclxuICAgKi9cclxuICBzZWFyY2goe3F1ZXJ5fSkge1xyXG4gICAgdGhpcy5zZWFyY2hTZXJ2aWNlLnNlYXJjaChxdWVyeSlcclxuICAgICAgLnRoZW4oY29udGVudFR5cGVzID0+IHRoaXMuY29udGVudFR5cGVMaXN0LnVwZGF0ZShjb250ZW50VHlwZXMpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNob3VsZCBhcHBseSBhIHNlYXJjaCBmaWx0ZXJcclxuICAgKi9cclxuICBhcHBseVNlYXJjaEZpbHRlcigpIHtcclxuICAgIGNvbnNvbGUuZGVidWcoJ0NvbnRlbnRUeXBlU2VjdGlvbjogbWVudSB3YXMgY2xpY2tlZCEnLCBldmVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaG93cyBkZXRhaWwgdmlld1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXHJcbiAgICovXHJcbiAgc2hvd0RldGFpbFZpZXcoe2lkfSkge1xyXG4gICAgdGhpcy5jb250ZW50VHlwZUxpc3QuaGlkZSgpO1xyXG4gICAgdGhpcy5jb250ZW50VHlwZURldGFpbC5sb2FkQnlJZChpZCk7XHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlRGV0YWlsLnNob3coKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBDbG9zZSBkZXRhaWwgdmlld1xyXG4gICAqL1xyXG4gIGNsb3NlRGV0YWlsVmlldygpIHtcclxuICAgIHRoaXMuY29udGVudFR5cGVEZXRhaWwuaGlkZSgpO1xyXG4gICAgdGhpcy5jb250ZW50VHlwZUxpc3Quc2hvdygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgZWxlbWVudFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLnZpZXcuZ2V0RWxlbWVudCgpO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9jb250ZW50LXR5cGUtc2VjdGlvbi9jb250ZW50LXR5cGUtc2VjdGlvbi5qcyIsImltcG9ydCBpbml0UGFuZWwgZnJvbSBcImNvbXBvbmVudHMvcGFuZWxcIlxyXG5pbXBvcnQgaW5pdFRhYlBhbmVsIGZyb20gXCJjb21wb25lbnRzL3RhYi1wYW5lbFwiXHJcbmltcG9ydCB7IGN1cnJ5IH0gZnJvbSBcInV0aWxzL2Z1bmN0aW9uYWxcIjtcclxuaW1wb3J0IHsgYXR0cmlidXRlRXF1YWxzLCBnZXRBdHRyaWJ1dGUsIGhhc0F0dHJpYnV0ZSB9IGZyb20gXCJ1dGlscy9lbGVtZW50c1wiO1xyXG5pbXBvcnQgeyBFdmVudGZ1bCB9IGZyb20gJy4vbWl4aW5zL2V2ZW50ZnVsJztcclxuaW1wb3J0IHsgcmVsYXlDbGlja0V2ZW50QXMgfSBmcm9tICcuL3V0aWxzL2V2ZW50cyc7XHJcbi8qKlxyXG4gKiBUYWIgY2hhbmdlIGV2ZW50XHJcbiAqIEBldmVudCBIdWJWaWV3I3RhYi1jaGFuZ2VcclxuICogQHR5cGUge1NlbGVjdGVkRWxlbWVudH1cclxuICovXHJcbi8qKlxyXG4gKiBQYW5lbCBvcGVuIG9yIGNsb3NlIGV2ZW50XHJcbiAqIEBldmVudCBIdWJWaWV3I3BhbmVsLWNoYW5nZVxyXG4gKiBAdHlwZSB7U2VsZWN0ZWRFbGVtZW50fVxyXG4gKi9cclxuLyoqXHJcbiAqIEBjb25zdGFudCB7c3RyaW5nfVxyXG4gKi9cclxuY29uc3QgQVRUUklCVVRFX0RBVEFfSUQgPSAnZGF0YS1pZCc7XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5jb25zdCBpc09wZW4gPSBoYXNBdHRyaWJ1dGUoJ29wZW4nKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQG1peGVzIEV2ZW50ZnVsXHJcbiAqIEBmaXJlcyBIdWJWaWV3I3RhYi1jaGFuZ2VcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh1YlZpZXcge1xyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7SHViU3RhdGV9IHN0YXRlXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIC8vIGFkZCBldmVudCBzeXN0ZW1cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgRXZlbnRmdWwoKSk7XHJcblxyXG4gICAgdGhpcy5yZW5kZXJUYWJQYW5lbChzdGF0ZSk7XHJcbiAgICB0aGlzLnJlbmRlclBhbmVsKHN0YXRlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENsb3NlcyB0aGUgcGFuZWxcclxuICAgKi9cclxuICBjbG9zZVBhbmVsKCkge1xyXG4gICAgdGhpcy50aXRsZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgdGl0bGVcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZVxyXG4gICAqL1xyXG4gIHNldFRpdGxlKHRpdGxlKSB7XHJcbiAgICB0aGlzLnRpdGxlLmlubmVySFRNTCA9IHRpdGxlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyB0aGUgZG9tIGZvciB0aGUgcGFuZWxcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWN0aW9uSWRcclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGV4cGFuZGVkXHJcbiAgICovXHJcbiAgcmVuZGVyUGFuZWwoe3RpdGxlID0gJycsIHNlY3Rpb25JZCA9ICdjb250ZW50LXR5cGVzJywgZXhwYW5kZWQgPSBmYWxzZX0pIHtcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLnRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0aGlzLnRpdGxlLmNsYXNzTmFtZSArPSBcInBhbmVsLWhlYWRlciBpY29uLWh1Yi1pY29uXCI7XHJcbiAgICB0aGlzLnRpdGxlLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICghIWV4cGFuZGVkKS50b1N0cmluZygpKTtcclxuICAgIHRoaXMudGl0bGUuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgYHBhbmVsLWJvZHktJHtzZWN0aW9uSWR9YCk7XHJcbiAgICB0aGlzLnRpdGxlLmlubmVySFRNTCA9IHRpdGxlO1xyXG4gICAgcmVsYXlDbGlja0V2ZW50QXMoJ3BhbmVsLWNoYW5nZScsIHRoaXMsIHRoaXMudGl0bGUpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLmJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMuYm9keS5jbGFzc05hbWUgKz0gXCJwYW5lbC1ib2R5XCI7XHJcbiAgICB0aGlzLmJvZHkuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICghZXhwYW5kZWQpLnRvU3RyaW5nKCkpO1xyXG4gICAgdGhpcy5ib2R5LmlkID0gYHBhbmVsLWJvZHktJHtzZWN0aW9uSWR9YDtcclxuICAgIHRoaXMuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnRhYkNvbnRhaW5lckVsZW1lbnQpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLnBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0aGlzLnBhbmVsLmNsYXNzTmFtZSArPSBgcGFuZWwgaDVwLXNlY3Rpb24tJHtzZWN0aW9uSWR9YDtcclxuICAgIGlmKGV4cGFuZGVkKXtcclxuICAgICAgdGhpcy5wYW5lbC5zZXRBdHRyaWJ1dGUoJ29wZW4nLCAnJyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnBhbmVsLmFwcGVuZENoaWxkKHRoaXMudGl0bGUpO1xyXG4gICAgdGhpcy5wYW5lbC5hcHBlbmRDaGlsZCh0aGlzLmJvZHkpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMucm9vdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuY2xhc3NOYW1lICs9IGBoNXAgaDVwLWh1YmA7XHJcbiAgICB0aGlzLnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMucGFuZWwpO1xyXG4gICAgaW5pdFBhbmVsKHRoaXMucm9vdEVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IGlmIHBhbmVsIGlzIG9wZW4sIHRoaXMgaXMgdXNlZCBmb3Igb3V0ZXIgYm9yZGVyIGNvbG9yXHJcbiAgICovXHJcbiAgdG9nZ2xlUGFuZWxPcGVuKCkge1xyXG4gICAgbGV0IHBhbmVsID0gdGhpcy5wYW5lbDtcclxuICAgIGlmKGlzT3BlbihwYW5lbCkpIHtcclxuICAgICAgcGFuZWwucmVtb3ZlQXR0cmlidXRlKCdvcGVuJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcGFuZWwuc2V0QXR0cmlidXRlKCdvcGVuJywgJycpO1xyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cGFuZWwucXVlcnlTZWxlY3RvcignI2h1Yi1zZWFyY2gtYmFyJykuZm9jdXMoKX0sMjApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyB0aGUgZG9tIGZvciB0aGUgdGFiIHBhbmVsXHJcbiAgICovXHJcbiAgcmVuZGVyVGFiUGFuZWwoc3RhdGUpIHtcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLnRhYmxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xyXG4gICAgdGhpcy50YWJsaXN0LmNsYXNzTmFtZSArPSBcInRhYmxpc3RcIjtcclxuICAgIHRoaXMudGFibGlzdC5zZXRBdHRyaWJ1dGUgKCdyb2xlJywgJ3RhYmxpc3QnKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy50YWJMaXN0V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ25hdicpO1xyXG4gICAgdGhpcy50YWJMaXN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLnRhYmxpc3QpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLnRhYkNvbnRhaW5lckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMudGFiQ29udGFpbmVyRWxlbWVudC5jbGFzc05hbWUgKz0gJ3RhYi1wYW5lbCc7XHJcbiAgICB0aGlzLnRhYkNvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy50YWJMaXN0V3JhcHBlcik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGRzIGEgdGFiXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGVcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50XHJcbiAgICogQHBhcmFtIHtib29sZWFufSBzZWxlY3RlZFxyXG4gICAqL1xyXG4gIGFkZFRhYih7dGl0bGUsIGlkLCBjb250ZW50LCBzZWxlY3RlZCA9IGZhbHNlfSkge1xyXG4gICAgY29uc3QgdGFiSWQgPSBgdGFiLSR7aWR9YDtcclxuICAgIGNvbnN0IHRhYlBhbmVsSWQgPSBgdGFiLXBhbmVsLSR7aWR9YDtcclxuXHJcbiAgICBjb25zdCB0YWIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgdGFiLmNsYXNzTmFtZSArPSAndGFiJztcclxuICAgIHRhYi5pZCA9IHRhYklkO1xyXG4gICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIHRhYlBhbmVsSWQpO1xyXG4gICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHNlbGVjdGVkLnRvU3RyaW5nKCkpO1xyXG4gICAgdGFiLnNldEF0dHJpYnV0ZShBVFRSSUJVVEVfREFUQV9JRCwgaWQpO1xyXG4gICAgdGFiLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWInKTtcclxuICAgIHRhYi5pbm5lckhUTUwgPSB0aXRsZTtcclxuICAgIHJlbGF5Q2xpY2tFdmVudEFzKCd0YWItY2hhbmdlJywgdGhpcywgdGFiKTtcclxuXHJcbiAgICBjb25zdCB0YWJQYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGFiUGFuZWwuaWQgPSB0YWJQYW5lbElkO1xyXG4gICAgdGFiUGFuZWwuY2xhc3NOYW1lICs9ICd0YWJwYW5lbCc7XHJcbiAgICB0YWJQYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFibGxlZGJ5JywgdGFiSWQpO1xyXG4gICAgdGFiUGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICghc2VsZWN0ZWQpLnRvU3RyaW5nKCkpO1xyXG4gICAgdGFiUGFuZWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYnBhbmVsJyk7XHJcbiAgICB0YWJQYW5lbC5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuXHJcbiAgICB0aGlzLnRhYmxpc3QuYXBwZW5kQ2hpbGQodGFiKTtcclxuICAgIHRoaXMudGFiQ29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZCh0YWJQYW5lbCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGRzIGFuIGFuaW1hdGVkIGJvcmRlciB0byB0aGUgYm90dG9tIG9mIHRoZSB0YWJcclxuICAgKi9cclxuICBhZGRCb3R0b21Cb3JkZXIoKSB7XHJcbiAgICB0aGlzLnRhYmxpc3QuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpKTtcclxuICB9XHJcblxyXG4gIGluaXRUYWJQYW5lbCgpIHtcclxuICAgIGluaXRUYWJQYW5lbCh0aGlzLnRhYkNvbnRhaW5lckVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgc2VjdGlvblxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXHJcbiAgICovXHJcbiAgc2V0U2VjdGlvblR5cGUoe2lkfSkge1xyXG4gICAgdGhpcy5wYW5lbC5jbGFzc05hbWUgPSBgaDVwLXNlY3Rpb24tJHtpZH0gcGFuZWxgO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcm9vdCBodG1sIGVsZW1lbnRcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAqL1xyXG4gIGdldEVsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yb290RWxlbWVudDtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvaHViLXZpZXcuanMiLCJpbXBvcnQge2N1cnJ5fSBmcm9tICd1dGlscy9mdW5jdGlvbmFsJ1xyXG5pbXBvcnQgSHViU2VydmljZXMgZnJvbSAnLi4vaHViLXNlcnZpY2VzJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogVGhlIFNlYXJjaCBTZXJ2aWNlIGdldHMgYSBjb250ZW50IHR5cGUgZnJvbSBodWItc2VydmljZXMuanNcclxuICogaW4gdGhlIGZvcm0gb2YgYSBwcm9taXNlLiBJdCB0aGVuIGdlbmVyYXRlcyBhIHNjb3JlIGJhc2VkXHJcbiAqIG9uIHRoZSBkaWZmZXJlbnQgd2VpZ2h0aW5ncyBvZiB0aGUgY29udGVudCB0eXBlIGZpZWxkcyBhbmRcclxuICogc29ydHMgdGhlIHJlc3VsdHMgYmFzZWQgb24gdGhlIGdlbmVyYXRlZCBzY29yZS5cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaFNlcnZpY2Uge1xyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZS5hcGlSb290VXJsXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIHRoaXMuc2VydmljZXMgPSBuZXcgSHViU2VydmljZXMoe1xyXG4gICAgICBhcGlSb290VXJsOiBzdGF0ZS5hcGlSb290VXJsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBZGQgY29udGVudCB0eXBlcyB0byB0aGUgc2VhcmNoIGluZGV4XHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlcyA9IHRoaXMuc2VydmljZXMuY29udGVudFR5cGVzKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQZXJmb3JtcyBhIHNlYXJjaFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHF1ZXJ5XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlPENvbnRlbnRUeXBlW10+fSBBIHByb21pc2Ugb2YgYW4gYXJyYXkgb2YgY29udGVudCB0eXBlc1xyXG4gICAqL1xyXG4gIHNlYXJjaChxdWVyeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGVudFR5cGVzLnRoZW4oZmlsdGVyQnlRdWVyeShxdWVyeSkpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEZpbHRlcnMgYSBsaXN0IG9mIGNvbnRlbnQgdHlwZXMgYmFzZWQgb24gYSBxdWVyeVxyXG4gKiBAdHlwZSB7RnVuY3Rpb259XHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBxdWVyeVxyXG4gKiBAcGFyYW0ge0NvbnRlbnRUeXBlW119IGNvbnRlbnRUeXBlc1xyXG4gKi9cclxuY29uc3QgZmlsdGVyQnlRdWVyeSA9IGN1cnJ5KGZ1bmN0aW9uKHF1ZXJ5LCBjb250ZW50VHlwZXMpIHtcclxuICAvLyBTb3J0IGFscGhhYmV0aWNhbGx5IHVwb24gaW5pdGlhbGl6YXRpb25cclxuICBpZiAocXVlcnkgPT0gJycpIHtcclxuICAgIHJldHVybiBjb250ZW50VHlwZXMuc29ydChmdW5jdGlvbihhLGIpe1xyXG4gICAgICBpZihhLnRpdGxlIDwgYi50aXRsZSkgcmV0dXJuIC0xO1xyXG4gICAgICBpZihhLnRpdGxlID4gYi50aXRsZSkgcmV0dXJuIDE7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGVudFR5cGVzXHJcbiAgICAubWFwKGZ1bmN0aW9uKGNvbnRlbnRUeXBlKXtcclxuICAgICAgLy8gQXBwZW5kIGEgc2VhcmNoIHNjb3JlIHRvIGVhY2ggY29udGVudCB0eXBlXHJcbiAgICAgIGxldCByZXN1bHQgPSB7XHJcbiAgICAgICAgY29udGVudFR5cGU6IGNvbnRlbnRUeXBlLFxyXG4gICAgICAgIHNjb3JlOiBnZXRTZWFyY2hTY29yZShxdWVyeSwgY29udGVudFR5cGUpXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9KVxyXG4gICAgLmZpbHRlcihyZXN1bHQgPT4gcmVzdWx0LnNjb3JlID4gMCkgLy8gT25seSBzaG93IGhpdHNcclxuICAgIC5zb3J0KChhLGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKSAvLyBTb3J0IGJ5IHJlbGV2YW5jZVxyXG4gICAgLm1hcChyZXN1bHQgPT4gcmVzdWx0LmNvbnRlbnRUeXBlKTsgLy8gVW53cmFwIHJlc3VsdCBvYmplY3RcclxufSk7XHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlcyB3ZWlnaHRpbmcgZm9yIGRpZmZlcmVudCBzZWFyY2ggdGVybXMgYmFzZWRcclxuICogb24gZXhpc3RlbmNlIG9mIHN1YnN0cmluZ3NcclxuICpcclxuICogQHBhcmFtICB7c3RyaW5nfSBxdWVyeVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IGNvbnRlbnRUeXBlXHJcbiAqIEByZXR1cm4ge2ludH1cclxuICovXHJcbmNvbnN0IGdldFNlYXJjaFNjb3JlID0gZnVuY3Rpb24ocXVlcnksIGNvbnRlbnRUeXBlKSB7XHJcbiAgbGV0IHNjb3JlID0gMDtcclxuICAvLyBUb2tlbml6ZSB0aGUgcXVlcnkgc3RyaW5nIGFuZCBpZ25vcmUgc3BhY2VzIFxyXG4gIGxldCBxdWVyaWVzID0gcXVlcnkuc3BsaXQoJyAnKS5maWx0ZXIocXVlcnkgPT4gcXVlcnkgIT09ICcnKTtcclxuXHJcbiAgcXVlcmllcy5mb3JFYWNoKGZ1bmN0aW9uKHF1ZXJ5KSB7XHJcbiAgICBpZiAoaGFzU3ViU3RyaW5nKHF1ZXJ5LCBjb250ZW50VHlwZS50aXRsZSkpIHtcclxuICAgICAgc2NvcmUgKz0gMTAwO1xyXG4gICAgfVxyXG4gICAgaWYgKGhhc1N1YlN0cmluZyhxdWVyeSwgY29udGVudFR5cGUuc3VtbWFyeSkpIHtcclxuICAgICAgc2NvcmUgKz0gNTtcclxuICAgIH1cclxuICAgIGlmIChoYXNTdWJTdHJpbmcocXVlcnksIGNvbnRlbnRUeXBlLmRlc2NyaXB0aW9uKSkge1xyXG4gICAgICBzY29yZSArPSA1O1xyXG4gICAgfVxyXG4gICAgaWYgKGFycmF5SGFzU3ViU3RyaW5nKHF1ZXJ5LCBjb250ZW50VHlwZS5rZXl3b3JkcykpIHtcclxuICAgICAgICBzY29yZSArPSA1O1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gc2NvcmU7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIGEgbmVlZGxlIGlzIGZvdW5kIGluIHRoZSBoYXlzdGFjay5cclxuICogTm90IGNhc2Ugc2Vuc2l0aXZlXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuZWVkbGVcclxuICogQHBhcmFtIHtzdHJpbmd9IGhheXN0YWNrXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBoYXNTdWJTdHJpbmcgPSBmdW5jdGlvbihuZWVkbGUsIGhheXN0YWNrKSB7XHJcbiAgaWYgKGhheXN0YWNrID09PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBoYXlzdGFjay50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlLnRvTG93ZXJDYXNlKCkpICE9PSAtMTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBIZWxwZXIgZnVuY3Rpb24sIGNoZWNrcyBpZiBhcnJheSBoYXMgY29udGFpbnMgYSBzdWJzdHJpbmdcclxuICpcclxuICogQHBhcmFtICB7U3RyaW5nfSBzdWJTdHJpbmdcclxuICogQHBhcmFtICB7QXJyYXl9IGFyclxyXG4gKiBAcmV0dXJuIHtib29sZWFufVxyXG4gKi9cclxuY29uc3QgYXJyYXlIYXNTdWJTdHJpbmcgPSBmdW5jdGlvbihzdWJTdHJpbmcsIGFycikge1xyXG4gIGlmIChhcnIgPT09IHVuZGVmaW5lZCB8fCBzdWJTdHJpbmcgPT09ICcnKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYXJyLnNvbWUoc3RyaW5nID0+IGhhc1N1YlN0cmluZyhzdWJTdHJpbmcsIHN0cmluZykpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9zZWFyY2gtc2VydmljZS9zZWFyY2gtc2VydmljZS5qcyIsImltcG9ydCBIdWJTZXJ2aWNlcyBmcm9tICcuLi9odWItc2VydmljZXMnO1xyXG5pbXBvcnQgeyBFdmVudGZ1bCB9IGZyb20gJy4uL21peGlucy9ldmVudGZ1bCc7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEBtaXhlcyBFdmVudGZ1bFxyXG4gKlxyXG4gKiBAZmlyZXMgSHViI3VwbG9hZFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXBsb2FkU2VjdGlvbiB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgRXZlbnRmdWwoKSk7XHJcblxyXG4gICAgLy8gc2VydmljZXNcclxuICAgIHRoaXMuc2VydmljZXMgPSBuZXcgSHViU2VydmljZXMoe1xyXG4gICAgICBhcGlSb290VXJsOiBzdGF0ZS5hcGlSb290VXJsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBJbnB1dCBlbGVtZW50IGZvciB0aGUgSDVQIGZpbGVcclxuICAgIGNvbnN0IGg1cFVwbG9hZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICBoNXBVcGxvYWQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2ZpbGUnKTtcclxuXHJcbiAgICAvLyBTZW5kcyB0aGUgSDVQIGZpbGUgdG8gdGhlIHBsdWdpblxyXG4gICAgY29uc3QgdXNlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICB1c2VCdXR0b24udGV4dENvbnRlbnQgPSAnVXNlJztcclxuICAgIHVzZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHJcbiAgICAgIC8vIEFkZCB0aGUgSDVQIGZpbGUgdG8gYSBmb3JtLCByZWFkeSBmb3IgdHJhbnNwb3J0YXRpb25cclxuICAgICAgY29uc3QgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICBkYXRhLmFwcGVuZCgnaDVwJywgaDVwVXBsb2FkLmZpbGVzWzBdKTtcclxuXHJcbiAgICAgIC8vIFVwbG9hZCBjb250ZW50IHRvIHRoZSBwbHVnaW5cclxuICAgICAgdGhpcy5zZXJ2aWNlcy51cGxvYWRDb250ZW50KGRhdGEpXHJcbiAgICAgICAgLnRoZW4oanNvbiA9PiB7XHJcbiAgICAgICAgICAvLyBGaXJlIHRoZSByZWNlaXZlZCBkYXRhIHRvIGFueSBsaXN0ZW5lcnNcclxuICAgICAgICAgIHNlbGYuZmlyZSgndXBsb2FkJywganNvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGg1cFVwbG9hZCk7XHJcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKHVzZUJ1dHRvbik7XHJcblxyXG4gICAgdGhpcy5yb290RWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucm9vdEVsZW1lbnQ7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL3VwbG9hZC1zZWN0aW9uL3VwbG9hZC1zZWN0aW9uLmpzIiwiaW1wb3J0IHtzZXRBdHRyaWJ1dGV9IGZyb20gJy4uL3V0aWxzL2VsZW1lbnRzJztcclxuaW1wb3J0IHtmb3JFYWNofSBmcm9tICcuLi91dGlscy9mdW5jdGlvbmFsJztcclxuXHJcbi8qKlxyXG4gKiBAdHlwZSB7ZnVuY3Rpb259XHJcbiAqL1xyXG5jb25zdCBoaWRlQWxsID0gZm9yRWFjaChzZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKSk7XHJcblxyXG4vKipcclxuICogQHR5cGUge2Z1bmN0aW9ufVxyXG4gKi9cclxuY29uc3Qgc2hvdyA9IHNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZSB7ZnVuY3Rpb259XHJcbiAqL1xyXG5jb25zdCB1blNlbGVjdEFsbCA9IGZvckVhY2goc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJykpO1xyXG5cclxuLyoqXHJcbiAqIEluaXRpYXRlcyBhIHRhYiBwYW5lbFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbml0KGVsZW1lbnQpIHtcclxuICBjb25zdCB0YWJzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbcm9sZT1cInRhYlwiXScpO1xyXG4gIGNvbnN0IHRhYlBhbmVscyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3JvbGU9XCJ0YWJwYW5lbFwiXScpO1xyXG5cclxuICB0YWJzLmZvckVhY2godGFiID0+IHtcclxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cclxuICAgICAgdW5TZWxlY3RBbGwodGFicyk7XHJcbiAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xyXG5cclxuICAgICAgaGlkZUFsbCh0YWJQYW5lbHMpO1xyXG5cclxuICAgICAgbGV0IHRhYlBhbmVsSWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgICAgIHNob3coZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAjJHt0YWJQYW5lbElkfWApKTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi8uLi9oNXAtc2RrL3NyYy9zY3JpcHRzL2NvbXBvbmVudHMvdGFiLXBhbmVsLmpzIiwicmVxdWlyZSgnLi4vLi4vc3JjL3N0eWxlcy9tYWluLnNjc3MnKTtcclxuXHJcbi8vIExvYWQgbGlicmFyeVxyXG5INVAgPSBINVAgfHwge307XHJcbkg1UC5IdWJDbGllbnQgPSByZXF1aXJlKCcuLi9zY3JpcHRzL2h1YicpLmRlZmF1bHQ7XHJcbkg1UC5IdWJDbGllbnQucmVuZGVyRXJyb3JNZXNzYWdlID0gcmVxdWlyZSgnLi4vc2NyaXB0cy91dGlscy9lcnJvcnMnKS5kZWZhdWx0O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZW50cmllcy9kaXN0LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==