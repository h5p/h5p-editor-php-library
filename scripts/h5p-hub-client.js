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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
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
exports.removeAllChildren = exports.querySelectorAll = exports.querySelector = exports.appendChild = exports.toggleAttribute = exports.attributeEquals = exports.hasAttribute = exports.removeAttribute = exports.setAttribute = exports.getAttribute = undefined;

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

/**
 * Removes
 *
 * @param {HTMLElement} el
 *
 * @return {HTMLElement}
 */
var removeAllChildren = exports.removeAllChildren = function removeAllChildren(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }return el;
};

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

    this.initTabPanel(state);
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
     *
     * @param {string} sectionId
     */

  }, {
    key: 'initTabPanel',
    value: function initTabPanel(_ref3) {
      var _this2 = this;

      var _ref3$sectionId = _ref3.sectionId,
          sectionId = _ref3$sectionId === undefined ? 'content-types' : _ref3$sectionId;

      var tabConfigs = [{
        title: 'Create Content',
        id: 'content-types',
        content: this.contentTypeSection.getElement()
      }, {
        title: 'Upload',
        id: 'upload',
        content: this.uploadSection.getElement()
      }];

      // sets the correct one selected
      tabConfigs.filter(function (config) {
        return config.id === sectionId;
      }).forEach(function (config) {
        return config.selected = true;
      });

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

var _imageScroller = __webpack_require__(19);

var _imageScroller2 = _interopRequireDefault(_imageScroller);

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
    this.carousel = document.createElement('div');
    this.carousel.setAttribute('role', 'region');
    this.carousel.setAttribute('data-size', '5');
    this.carousel.innerHTML = "<div class=\"carousel\" role=\"region\" data-size=\"5\">\n    <span class=\"carousel-button previous\" aria-hidden=\"true\">&larr;</span>\n    <span class=\"carousel-button next\" aria-hidden=\"true\">&rarr;</span>\n    <nav class=\"scroller\"><ul></ul></nav>";

    (0, _imageScroller2.default)(this.carousel);

    this.thumbnailList = this.carousel.querySelector('ul');

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
     * Removes all images from the carousel
     */

  }, {
    key: "removeAllImagesInCarousel",
    value: function removeAllImagesInCarousel() {
      this.thumbnailList.querySelectorAll('li').forEach((0, _elements.removeChild)(this.thumbnailList));
      this.carousel.querySelectorAll('.carousel-lightbox').forEach((0, _elements.removeChild)(this.carousel));
    }

    /**
     * Add image to the carousel
     *
     * @param {object} image
     */

  }, {
    key: "addImageToCarousel",
    value: function addImageToCarousel(image) {
      // add lightbox
      var lightbox = document.createElement('div');
      lightbox.id = "lightbox-" + this.thumbnailList.childElementCount;
      lightbox.className = 'carousel-lightbox';
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.innerHTML = "<img class=\"img-responsive\" src=\"" + image.url + "\" alt=\"" + image.alt + "\">";
      this.carousel.appendChild(lightbox);

      // add thumbnail
      var thumbnail = document.createElement('li');
      thumbnail.className = 'slide';
      thumbnail.innerHTML = "<img src=\"" + image.url + "\" alt=\"" + image.alt + "\" class=\"img-responsive\" aria-controls=\"" + lightbox.id + "\" />";
      this.thumbnailList.appendChild(thumbnail);
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

      // update carousel
      this.view.removeAllImagesInCarousel();
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
      while (this.rootElement.hasChildNodes()) {
        this.rootElement.removeChild(this.rootElement.lastChild);
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

var _tabPanel = __webpack_require__(20);

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
  if (query == '') {
    return contentTypes;
  }

  // Append a search score to each content type
  contentTypes = contentTypes.map(function (contentType) {
    return {
      contentType: contentType,
      score: 0
    };
  });

  // Tokenize query and sanitize
  var queries = query.split(' ').filter(function (query) {
    return query !== '';
  });

  // Loop through queries and generate a relevance score
  for (var i = 0; i < queries.length; i++) {
    if (i > 0) {
      // Search a smaller subset each time
      contentTypes = contentTypes.filter(function (result) {
        return result.score > 0;
      });
    }
    contentTypes.forEach(function (contentType) {
      return contentType.score = getSearchScore(queries[i], contentType.contentType);
    });
  }

  return contentTypes.filter(function (result) {
    return result.score > 0;
  }).sort(sortSearchResults) // Sort by installed, relevance and popularity
  .map(function (result) {
    return result.contentType;
  }); // Unwrap result object;
});

/**
 * Callback for Array.sort()
 * Compares two content types on different criteria
 *
 * @param {Object} a First content type
 * @param {Object} b Second content type
 * @return {int}
 */
var sortSearchResults = function sortSearchResults(a, b) {
  if (!a.contentType.installed && b.contentType.installed) {
    return 1;
  } else if (b.score !== a.score) {
    return b.score - a.score;
  } else {
    return b.contentType.popularity - a.contentType.popularity;
  }
};

/**
 * Calculates weighting for different search terms based
 * on existence of substrings
 *
 * @param  {string} query
 * @param  {Object} contentType
 * @return {int}
 */
var getSearchScore = function getSearchScore(query, contentType) {
  console.log(contentType);
  query = query.trim();
  var score = 0;
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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = init;

var _elements = __webpack_require__(2);

var _functional = __webpack_require__(1);

/**
 * @constant
 */
var ATTRIBUTE_SIZE = 'data-size';

/**
 * @type {function}
 */
var disable = (0, _elements.setAttribute)('disabled', '');

/**
 * @type {function}
 */
var enable = (0, _elements.removeAttribute)('disabled');

/**
 * @param {HTMLElement} element
 * @param {boolean} enabled
 */
var toggleEnabled = function toggleEnabled(element, enabled) {
  return (enabled ? enable : disable)(element);
};

/**
 * @param {HTMLElement} element
 * @param {boolean} hidden
 */
var toggleVisibility = (0, _functional.curry)(function (hidden, element) {
  return (0, _elements.setAttribute)('aria-hidden', hidden.toString(), element);
});

/**
 * @type {function}
 */
var isDisabled = (0, _elements.hasAttribute)('disabled');

/**
 * Update the view
 *
 * @param {HTMLElement} element
 * @param {ImageScrollerState} state
 */
var updateView = function updateView(element, state) {
  var prevButton = element.querySelector('.previous');
  var nextButton = element.querySelector('.next');
  var list = element.querySelector('ul');
  var totalCount = list.childElementCount;

  // update list sizes
  list.style.width = 100 / state.displayCount * totalCount + '%';
  list.style.marginLeft = state.position * (100 / state.displayCount) + '%';

  // update image sizes
  element.querySelectorAll('li').forEach(function (element) {
    return element.style.width = 100 / totalCount + '%';
  });

  // toggle button visibility
  [prevButton, nextButton].forEach(toggleVisibility(state.displayCount >= totalCount));

  // toggle button enable, disabled
  toggleEnabled(nextButton, state.position > state.displayCount - totalCount);
  toggleEnabled(prevButton, state.position < 0);
};

/**
 * Handles button clicked
 *
 * @param {HTMLElement} element
 * @param {ImageScrollerState} state
 * @param {function} updateState
 * @param {Event}
 * @type {function}
 */
var onButtonClick = (0, _functional.curry)(function (element, state, updateState, event) {
  if (!isDisabled(event.target)) {
    updateState(state);
    updateView(element, state);
  }
});

/**
 * Initializes a panel
 *
 * @param {HTMLElement} element
 * @return {HTMLElement}
 */
function init(element) {
  /**
   * @typedef {object} ImageScrollerState
   * @property {number} displayCount
   * @property {number} position
   */
  var state = {
    displayCount: element.getAttribute(ATTRIBUTE_SIZE) || 5,
    position: 0
  };

  // initialize buttons
  element.querySelector('.next').addEventListener('click', onButtonClick(element, state, function (state) {
    return state.position--;
  }));
  element.querySelector('.previous').addEventListener('click', onButtonClick(element, state, function (state) {
    return state.position++;
  }));

  // initialize images
  element.querySelectorAll('[aria-controls]').forEach(function (image) {
    var targetId = image.getAttribute('aria-controls');
    var target = element.querySelector('#' + targetId);

    target.addEventListener('click', function (event) {
      return target.setAttribute('aria-hidden', 'true');
    });
    image.addEventListener('click', function (event) {
      return target.setAttribute('aria-hidden', 'false');
    });
  });

  // listen for updates to data-size
  var observer = new MutationObserver((0, _functional.forEach)(function (record) {
    updateView(element, _extends(state, {
      position: 0,
      displayCount: element.getAttribute(ATTRIBUTE_SIZE)
    }));
  }));

  observer.observe(element, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [ATTRIBUTE_SIZE]
  });

  // initialize position
  updateView(element, state);

  return element;
}

/***/ }),
/* 20 */
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(9);

// Load library
H5P = H5P || {};
H5P.HubClient = __webpack_require__(8).default;
H5P.HubClient.renderErrorMessage = __webpack_require__(4).default;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzQwN2QyN2FlYmRhOTY2ZDdkNjIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvbWl4aW5zL2V2ZW50ZnVsLmpzIiwid2VicGFjazovLy8uLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvdXRpbHMvZnVuY3Rpb25hbC5qcyIsIndlYnBhY2s6Ly8vLi8uLi9oNXAtc2RrL3NyYy9zY3JpcHRzL3V0aWxzL2VsZW1lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2h1Yi1zZXJ2aWNlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy91dGlscy9lcnJvcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdXRpbHMvZXZlbnRzLmpzIiwid2VicGFjazovLy8uLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvY29tcG9uZW50cy9wYW5lbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1hZ2VzL2NvbnRlbnQtdHlwZS1wbGFjZWhvbGRlci5zdmciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvaHViLmpzIiwid2VicGFjazovLy8uL3NyYy9zdHlsZXMvbWFpbi5zY3NzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1kZXRhaWwvY29udGVudC10eXBlLWRldGFpbC12aWV3LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1kZXRhaWwvY29udGVudC10eXBlLWRldGFpbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy9jb250ZW50LXR5cGUtbGlzdC9jb250ZW50LXR5cGUtbGlzdC12aWV3LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1saXN0L2NvbnRlbnQtdHlwZS1saXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1zZWN0aW9uL2NvbnRlbnQtdHlwZS1zZWN0aW9uLXZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvY29udGVudC10eXBlLXNlY3Rpb24vY29udGVudC10eXBlLXNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvaHViLXZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvc2VhcmNoLXNlcnZpY2Uvc2VhcmNoLXNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdXBsb2FkLXNlY3Rpb24vdXBsb2FkLXNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vLi4vaDVwLXNkay9zcmMvc2NyaXB0cy9jb21wb25lbnRzL2ltYWdlLXNjcm9sbGVyLmpzIiwid2VicGFjazovLy8uLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvY29tcG9uZW50cy90YWItcGFuZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJpZXMvZGlzdC5qcyJdLCJuYW1lcyI6WyJFdmVudGZ1bCIsImxpc3RlbmVycyIsIm9uIiwidHlwZSIsImxpc3RlbmVyIiwic2NvcGUiLCJ0cmlnZ2VyIiwicHVzaCIsImZpcmUiLCJldmVudCIsInRyaWdnZXJzIiwiZXZlcnkiLCJjYWxsIiwicHJvcGFnYXRlIiwidHlwZXMiLCJldmVudGZ1bCIsInNlbGYiLCJmb3JFYWNoIiwiY3VycnkiLCJmbiIsImFyaXR5IiwibGVuZ3RoIiwiZjEiLCJhcmdzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImFyZ3VtZW50cyIsImFwcGx5IiwiZjIiLCJhcmdzMiIsImNvbmNhdCIsImNvbXBvc2UiLCJmbnMiLCJyZWR1Y2UiLCJmIiwiZyIsImFyciIsIm1hcCIsImZpbHRlciIsInNvbWUiLCJjb250YWlucyIsInZhbHVlIiwiaW5kZXhPZiIsIndpdGhvdXQiLCJ2YWx1ZXMiLCJpbnZlcnNlQm9vbGVhblN0cmluZyIsImJvb2wiLCJ0b1N0cmluZyIsImdldEF0dHJpYnV0ZSIsIm5hbWUiLCJlbCIsInNldEF0dHJpYnV0ZSIsInJlbW92ZUF0dHJpYnV0ZSIsImhhc0F0dHJpYnV0ZSIsImF0dHJpYnV0ZUVxdWFscyIsInRvZ2dsZUF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwicGFyZW50IiwiY2hpbGQiLCJxdWVyeVNlbGVjdG9yIiwic2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yQWxsIiwicmVtb3ZlQWxsQ2hpbGRyZW4iLCJoYXNDaGlsZE5vZGVzIiwicmVtb3ZlQ2hpbGQiLCJsYXN0Q2hpbGQiLCJIdWJTZXJ2aWNlcyIsImFwaVJvb3RVcmwiLCJ3aW5kb3ciLCJjYWNoZWRDb250ZW50VHlwZXMiLCJmZXRjaCIsIm1ldGhvZCIsImNyZWRlbnRpYWxzIiwidGhlbiIsInJlc3VsdCIsImpzb24iLCJpc1ZhbGlkIiwibGlicmFyaWVzIiwicmVzcG9uc2UiLCJtZXNzYWdlQ29kZSIsIlByb21pc2UiLCJyZWplY3QiLCJyZXNvbHZlIiwibWFjaGluZU5hbWUiLCJjb250ZW50VHlwZXMiLCJjb250ZW50VHlwZSIsImlkIiwiYm9keSIsImZvcm1EYXRhIiwicmVuZGVyRXJyb3JNZXNzYWdlIiwibWVzc2FnZSIsImNsb3NlQnV0dG9uIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwibWVzc2FnZUNvbnRlbnQiLCJ0aXRsZSIsImNvbnRlbnQiLCJtZXNzYWdlV3JhcHBlciIsImRpc21pc3NpYmxlIiwiYnV0dG9uIiwidW5kZWZpbmVkIiwibWVzc2FnZUJ1dHRvbiIsImNvbnNvbGUiLCJsb2ciLCJyZWxheUNsaWNrRXZlbnRBcyIsImVsZW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwic3RvcFByb3BhZ2F0aW9uIiwiaW5pdCIsImlzRXhwYW5kZWQiLCJoaWRlIiwic2hvdyIsInRvZ2dsZUJvZHlWaXNpYmlsaXR5IiwiYm9keUVsZW1lbnQiLCJvbkFyaWFFeHBhbmRlZENoYW5nZSIsInRhcmdldCIsInRpdGxlRWwiLCJib2R5SWQiLCJib2R5RWwiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJvYnNlcnZlIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZU9sZFZhbHVlIiwiYXR0cmlidXRlRmlsdGVyIiwiSHViIiwic3RhdGUiLCJjb250ZW50VHlwZVNlY3Rpb24iLCJ1cGxvYWRTZWN0aW9uIiwidmlldyIsInNlcnZpY2VzIiwic2V0UGFuZWxUaXRsZSIsImNsb3NlUGFuZWwiLCJzZXRTZWN0aW9uVHlwZSIsInRvZ2dsZVBhbmVsT3BlbiIsImJpbmQiLCJpbml0VGFiUGFuZWwiLCJnZXRDb250ZW50VHlwZSIsInNldFRpdGxlIiwic2VjdGlvbklkIiwidGFiQ29uZmlncyIsImdldEVsZW1lbnQiLCJjb25maWciLCJzZWxlY3RlZCIsImFkZFRhYiIsInRhYkNvbmZpZyIsImFkZEJvdHRvbUJvcmRlciIsIkFUVFJJQlVURV9DT05URU5UX1RZUEVfSUQiLCJ0b2dnbGVWaXNpYmlsaXR5IiwidmlzaWJsZSIsImlzRW1wdHkiLCJ0ZXh0IiwiQ29udGVudFR5cGVEZXRhaWxWaWV3IiwiYmFja0J1dHRvbkVsZW1lbnQiLCJpbWFnZSIsImltYWdlV3JhcHBlckVsZW1lbnQiLCJhdXRob3IiLCJkZXNjcmlwdGlvbiIsImRlbW9CdXR0b24iLCJ0ZXh0RGV0YWlscyIsImRldGFpbHNFbGVtZW50IiwidXNlQnV0dG9uIiwiaW5zdGFsbEJ1dHRvbiIsImJ1dHRvbkJhciIsImxpY2VuY2VQYW5lbCIsImNyZWF0ZVBhbmVsIiwicGx1Z2luc1BhbmVsIiwicHVibGlzaGVyUGFuZWwiLCJwYW5lbEdyb3VwRWxlbWVudCIsImNhcm91c2VsIiwidGh1bWJuYWlsTGlzdCIsInJvb3RFbGVtZW50IiwiaGVhZGVyRWwiLCJib2R5SW5uZXJFbCIsInBhbmVsRWwiLCJsaWdodGJveCIsImNoaWxkRWxlbWVudENvdW50IiwidXJsIiwiYWx0IiwidGh1bWJuYWlsIiwic3JjIiwiaW5zdGFsbGVkIiwiQ29udGVudFR5cGVEZXRhaWwiLCJpbnN0YWxsIiwidXBkYXRlIiwiaW5zdGFsbENvbnRlbnRUeXBlIiwiZGVidWciLCJzZXRJZCIsInNldERlc2NyaXB0aW9uIiwic2V0SW1hZ2UiLCJpY29uIiwic2V0RXhhbXBsZSIsImV4YW1wbGUiLCJzZXRJc0luc3RhbGxlZCIsInJlbW92ZUFsbEltYWdlc0luQ2Fyb3VzZWwiLCJzY3JlZW5zaG90cyIsImFkZEltYWdlVG9DYXJvdXNlbCIsIkNvbnRlbnRUeXBlTGlzdFZpZXciLCJyb3ciLCJjcmVhdGVDb250ZW50VHlwZVJvdyIsInVzZUJ1dHRvbkNvbmZpZyIsImNscyIsImluc3RhbGxCdXR0b25Db25maWciLCJzdW1tYXJ5IiwiQ29udGVudFR5cGVMaXN0IiwicmVtb3ZlQWxsUm93cyIsImFkZFJvdyIsIkNvbnRlbnRCcm93c2VyVmlldyIsIm1lbnUiLCJjcmVhdGVNZW51RWxlbWVudCIsImlucHV0R3JvdXAiLCJjcmVhdGVJbnB1dEdyb3VwRWxlbWVudCIsIm1lbnVHcm91cCIsIm1lbnVCYXJFbGVtZW50IiwibmF2RWxlbWVudCIsImlucHV0RmllbGQiLCJxdWVyeSIsImlucHV0QnV0dG9uIiwib25jbGljayIsInBhcmVudEVsZW1lbnQiLCJmb2N1cyIsIkNvbnRlbnRUeXBlU2VjdGlvbiIsInNlYXJjaFNlcnZpY2UiLCJjb250ZW50VHlwZUxpc3QiLCJjb250ZW50VHlwZURldGFpbCIsImFkZE1lbnVJdGVtIiwibWVudVRleHQiLCJzZWN0aW9uIiwiY2xhc3NMaXN0IiwiYWRkIiwic2VhcmNoIiwiYXBwbHlTZWFyY2hGaWx0ZXIiLCJzaG93RGV0YWlsVmlldyIsImNsb3NlRGV0YWlsVmlldyIsImluaXRDb250ZW50VHlwZUxpc3QiLCJjYXRjaCIsImVycm9yIiwibG9hZEJ5SWQiLCJBVFRSSUJVVEVfREFUQV9JRCIsImlzT3BlbiIsIkh1YlZpZXciLCJyZW5kZXJUYWJQYW5lbCIsInJlbmRlclBhbmVsIiwiZXhwYW5kZWQiLCJ0YWJDb250YWluZXJFbGVtZW50IiwicGFuZWwiLCJzZXRUaW1lb3V0IiwidGFibGlzdCIsInRhYkxpc3RXcmFwcGVyIiwidGFiSWQiLCJ0YWJQYW5lbElkIiwidGFiIiwidGFiUGFuZWwiLCJTZWFyY2hTZXJ2aWNlIiwiZmlsdGVyQnlRdWVyeSIsInNjb3JlIiwicXVlcmllcyIsInNwbGl0IiwiaSIsImdldFNlYXJjaFNjb3JlIiwic29ydCIsInNvcnRTZWFyY2hSZXN1bHRzIiwiYSIsImIiLCJwb3B1bGFyaXR5IiwidHJpbSIsImhhc1N1YlN0cmluZyIsImFycmF5SGFzU3ViU3RyaW5nIiwia2V5d29yZHMiLCJuZWVkbGUiLCJoYXlzdGFjayIsInRvTG93ZXJDYXNlIiwic3ViU3RyaW5nIiwic3RyaW5nIiwiVXBsb2FkU2VjdGlvbiIsImg1cFVwbG9hZCIsInRleHRDb250ZW50IiwiZGF0YSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwiZmlsZXMiLCJ1cGxvYWRDb250ZW50IiwiQVRUUklCVVRFX1NJWkUiLCJkaXNhYmxlIiwiZW5hYmxlIiwidG9nZ2xlRW5hYmxlZCIsImVuYWJsZWQiLCJoaWRkZW4iLCJpc0Rpc2FibGVkIiwidXBkYXRlVmlldyIsInByZXZCdXR0b24iLCJuZXh0QnV0dG9uIiwibGlzdCIsInRvdGFsQ291bnQiLCJzdHlsZSIsIndpZHRoIiwiZGlzcGxheUNvdW50IiwibWFyZ2luTGVmdCIsInBvc2l0aW9uIiwib25CdXR0b25DbGljayIsInVwZGF0ZVN0YXRlIiwidGFyZ2V0SWQiLCJzdWJ0cmVlIiwiY2hpbGRMaXN0IiwiaGlkZUFsbCIsInVuU2VsZWN0QWxsIiwidGFicyIsInRhYlBhbmVscyIsInJlcXVpcmUiLCJINVAiLCJIdWJDbGllbnQiLCJkZWZhdWx0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFD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LHlCQUFRLDRCQUFhLGFBQWIsRUFBNEIsTUFBNUIsQ0FBUixDQUFoQjs7QUFFQTs7O0FBR0EsSUFBTWpNLE9BQU8sNEJBQWEsYUFBYixFQUE0QixPQUE1QixDQUFiOztBQUVBOzs7QUFHQSxJQUFNa00sY0FBYyx5QkFBUSw0QkFBYSxlQUFiLEVBQThCLE9BQTlCLENBQVIsQ0FBcEI7O0FBRUE7Ozs7O0FBS2UsU0FBU3JNLElBQVQsQ0FBY0gsT0FBZCxFQUF1QjtBQUNwQyxNQUFNeU0sT0FBT3pNLFFBQVE5QyxnQkFBUixDQUF5QixjQUF6QixDQUFiO0FBQ0EsTUFBTXdQLFlBQVkxTSxRQUFROUMsZ0JBQVIsQ0FBeUIsbUJBQXpCLENBQWxCOztBQUVBdVAsT0FBS3BTLE9BQUwsQ0FBYSxlQUFPO0FBQ2xCNk8sUUFBSWpKLGdCQUFKLENBQXFCLE9BQXJCLEVBQThCLFVBQVVwRyxLQUFWLEVBQWlCOztBQUU3QzJTLGtCQUFZQyxJQUFaO0FBQ0E1UyxZQUFNNkcsTUFBTixDQUFhbEUsWUFBYixDQUEwQixlQUExQixFQUEyQyxNQUEzQzs7QUFFQStQLGNBQVFHLFNBQVI7O0FBRUEsVUFBSXpELGFBQWFwUCxNQUFNNkcsTUFBTixDQUFhckUsWUFBYixDQUEwQixlQUExQixDQUFqQjtBQUNBaUUsV0FBS04sUUFBUWhELGFBQVIsT0FBMEJpTSxVQUExQixDQUFMO0FBQ0QsS0FURDtBQVVELEdBWEQ7QUFZRCxDOzs7Ozs7Ozs7QUN2Q0QsbUJBQUEwRCxDQUFRLENBQVI7O0FBRUE7QUFDQUMsTUFBTUEsT0FBTyxFQUFiO0FBQ0FBLElBQUlDLFNBQUosR0FBZ0IsbUJBQUFGLENBQVEsQ0FBUixFQUEwQkcsT0FBMUM7QUFDQUYsSUFBSUMsU0FBSixDQUFjL04sa0JBQWQsR0FBbUMsbUJBQUE2TixDQUFRLENBQVIsRUFBbUNHLE9BQXRFLEMiLCJmaWxlIjoiaDVwLWh1Yi1jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMzQwN2QyN2FlYmRhOTY2ZDdkNjIiLCIvKipcclxuICogQG1peGluXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgRXZlbnRmdWwgPSAoKSA9PiAoe1xyXG4gIGxpc3RlbmVyczoge30sXHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3RlbiB0byBldmVudFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbc2NvcGVdXHJcbiAgICpcclxuICAgKiBAZnVuY3Rpb25cclxuICAgKiBAcmV0dXJuIHtFdmVudGZ1bH1cclxuICAgKi9cclxuICBvbjogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIsIHNjb3BlKSB7XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlZGVmIHtvYmplY3R9IFRyaWdnZXJcclxuICAgICAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IGxpc3RlbmVyXHJcbiAgICAgKiBAcHJvcGVydHkge29iamVjdH0gc2NvcGVcclxuICAgICAqL1xyXG4gICAgY29uc3QgdHJpZ2dlciA9IHtcclxuICAgICAgJ2xpc3RlbmVyJzogbGlzdGVuZXIsXHJcbiAgICAgICdzY29wZSc6IHNjb3BlXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdID0gdGhpcy5saXN0ZW5lcnNbdHlwZV0gfHwgW107XHJcbiAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXS5wdXNoKHRyaWdnZXIpO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEZpcmUgZXZlbnQuIElmIGFueSBvZiB0aGUgbGlzdGVuZXJzIHJldHVybnMgZmFsc2UsIHJldHVybiBmYWxzZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICAgKiBAcGFyYW0ge29iamVjdH0gW2V2ZW50XVxyXG4gICAqXHJcbiAgICogQGZ1bmN0aW9uXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBmaXJlOiBmdW5jdGlvbih0eXBlLCBldmVudCkge1xyXG4gICAgY29uc3QgdHJpZ2dlcnMgPSB0aGlzLmxpc3RlbmVyc1t0eXBlXSB8fCBbXTtcclxuXHJcbiAgICByZXR1cm4gdHJpZ2dlcnMuZXZlcnkoZnVuY3Rpb24odHJpZ2dlcikge1xyXG4gICAgICByZXR1cm4gdHJpZ2dlci5saXN0ZW5lci5jYWxsKHRyaWdnZXIuc2NvcGUgfHwgdGhpcywgZXZlbnQpICE9PSBmYWxzZTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3RlbnMgZm9yIGV2ZW50cyBvbiBhbm90aGVyIEV2ZW50ZnVsLCBhbmQgcHJvcGFnYXRlIGl0IHRyb3VnaCB0aGlzIEV2ZW50ZnVsXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlc1xyXG4gICAqIEBwYXJhbSB7RXZlbnRmdWx9IGV2ZW50ZnVsXHJcbiAgICovXHJcbiAgcHJvcGFnYXRlOiBmdW5jdGlvbih0eXBlcywgZXZlbnRmdWwpIHtcclxuICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgIHR5cGVzLmZvckVhY2godHlwZSA9PiBldmVudGZ1bC5vbih0eXBlLCBldmVudCA9PiBzZWxmLmZpcmUodHlwZSwgZXZlbnQpKSk7XHJcbiAgfVxyXG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9taXhpbnMvZXZlbnRmdWwuanMiLCIvKipcclxuICogUmV0dXJucyBhIGN1cnJpZWQgdmVyc2lvbiBvZiBhIGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHJldHVybiB7ZnVuY3Rpb259XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3VycnkgPSBmdW5jdGlvbihmbikge1xyXG4gIGNvbnN0IGFyaXR5ID0gZm4ubGVuZ3RoO1xyXG5cclxuICByZXR1cm4gZnVuY3Rpb24gZjEoKSB7XHJcbiAgICBjb25zdCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcclxuICAgIGlmIChhcmdzLmxlbmd0aCA+PSBhcml0eSkge1xyXG4gICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgYXJncyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGYyKCkge1xyXG4gICAgICAgIGNvbnN0IGFyZ3MyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcclxuICAgICAgICByZXR1cm4gZjEuYXBwbHkobnVsbCwgYXJncy5jb25jYXQoYXJnczIpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcG9zZSBmdW5jdGlvbnMgdG9nZXRoZXIsIGV4ZWN1dGluZyBmcm9tIHJpZ2h0IHRvIGxlZnRcclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbi4uLn0gZm5zXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKChmLCBnKSA9PiAoLi4uYXJncykgPT4gZihnKC4uLmFyZ3MpKSk7XHJcblxyXG4vKipcclxuICogQXBwbGllcyBhIGZ1bmN0aW9uIHRvIGVhY2ggZWxlbWVudCBpbiBhbiBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxyXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHJldHVybiB7ZnVuY3Rpb259XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZm9yRWFjaCA9IGN1cnJ5KGZ1bmN0aW9uIChmbiwgYXJyKSB7XHJcbiAgYXJyLmZvckVhY2goZm4pO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBNYXBzIGEgZnVuY3Rpb24gdG8gYW4gYXJyYXlcclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm5cclxuICogQHBhcmFtIHtBcnJheX0gYXJyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IG1hcCA9IGN1cnJ5KGZ1bmN0aW9uIChmbiwgYXJyKSB7XHJcbiAgcmV0dXJuIGFyci5tYXAoZm4pO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWVzIGEgZmlsdGVyIHRvIGFuIGFycmF5XHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cclxuICovXHJcbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSBjdXJyeShmdW5jdGlvbiAoZm4sIGFycikge1xyXG4gIHJldHVybiBhcnIuZmlsdGVyKGZuKTtcclxufSk7XHJcblxyXG4vKipcclxuICogQXBwbGllcyBhIHNvbWUgdG8gYW4gYXJyYXlcclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm5cclxuICogQHBhcmFtIHtBcnJheX0gYXJyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHNvbWUgPSBjdXJyeShmdW5jdGlvbiAoZm4sIGFycikge1xyXG4gIHJldHVybiBhcnIuc29tZShmbik7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiBhbiBhcnJheSBjb250YWlucyBhIHZhbHVlXHJcbiAqXHJcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcclxuICogQHBhcmFtIHtBcnJheX0gYXJyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGNvbnRhaW5zID0gY3VycnkoZnVuY3Rpb24gKHZhbHVlLCBhcnIpIHtcclxuICByZXR1cm4gYXJyLmluZGV4T2YodmFsdWUpICE9IC0xO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGFycmF5IHdpdGhvdXQgdGhlIHN1cHBsaWVkIHZhbHVlc1xyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXNcclxuICogQHBhcmFtIHtBcnJheX0gYXJyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHdpdGhvdXQgPSBjdXJyeShmdW5jdGlvbiAodmFsdWVzLCBhcnIpIHtcclxuICByZXR1cm4gZmlsdGVyKHZhbHVlID0+ICFjb250YWlucyh2YWx1ZSwgdmFsdWVzKSwgYXJyKVxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBUYWtlcyBhIHN0cmluZyB0aGF0IGlzIGVpdGhlciAndHJ1ZScgb3IgJ2ZhbHNlJyBhbmQgcmV0dXJucyB0aGUgb3Bwb3NpdGVcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGJvb2xcclxuICpcclxuICogQHB1YmxpY1xyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgaW52ZXJzZUJvb2xlYW5TdHJpbmcgPSBmdW5jdGlvbiAoYm9vbCkge1xyXG4gIHJldHVybiAoYm9vbCAhPT0gJ3RydWUnKS50b1N0cmluZygpO1xyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvdXRpbHMvZnVuY3Rpb25hbC5qcyIsImltcG9ydCB7Y3VycnksIGludmVyc2VCb29sZWFuU3RyaW5nfSBmcm9tICcuL2Z1bmN0aW9uYWwnXHJcblxyXG4vKipcclxuICogR2V0IGFuIGF0dHJpYnV0ZSB2YWx1ZSBmcm9tIGVsZW1lbnRcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmV4cG9ydCBjb25zdCBnZXRBdHRyaWJ1dGUgPSBjdXJyeShmdW5jdGlvbiAobmFtZSwgZWwpIHtcclxuICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKG5hbWUpO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgYW4gYXR0cmlidXRlIG9uIGEgaHRtbCBlbGVtZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICovXHJcbmV4cG9ydCBjb25zdCBzZXRBdHRyaWJ1dGUgPSBjdXJyeShmdW5jdGlvbiAobmFtZSwgdmFsdWUsIGVsKSB7XHJcbiAgZWwuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcclxufSk7XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGF0dHJpYnV0ZSBmcm9tIGh0bWwgZWxlbWVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICovXHJcbmV4cG9ydCBjb25zdCByZW1vdmVBdHRyaWJ1dGUgPSBjdXJyeShmdW5jdGlvbiAobmFtZSwgZWwpIHtcclxuICBlbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGVsZW1lbnQgaGFzIGFuIGF0dHJpYnV0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHJldHVybiB7Ym9vbGVhbn1cclxuICovXHJcbmV4cG9ydCBjb25zdCBoYXNBdHRyaWJ1dGUgPSBjdXJyeShmdW5jdGlvbiAobmFtZSwgZWwpIHtcclxuICByZXR1cm4gZWwuaGFzQXR0cmlidXRlKG5hbWUpO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBlbGVtZW50IGhhcyBhbiBhdHRyaWJ1dGUgdGhhdCBlcXVhbHNcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcmV0dXJuIHtib29sZWFufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGF0dHJpYnV0ZUVxdWFscyA9IGN1cnJ5KGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgZWwpIHtcclxuICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKG5hbWUpID09PSB2YWx1ZTtcclxufSk7XHJcblxyXG4vKipcclxuICogVG9nZ2xlcyBhbiBhdHRyaWJ1dGUgYmV0d2VlbiAndHJ1ZScgYW5kICdmYWxzZSc7XHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHRvZ2dsZUF0dHJpYnV0ZSA9IGN1cnJ5KGZ1bmN0aW9uIChuYW1lLCBlbCkge1xyXG4gIGNvbnN0IHZhbHVlID0gZ2V0QXR0cmlidXRlKG5hbWUsIGVsKTtcclxuICBzZXRBdHRyaWJ1dGUobmFtZSwgaW52ZXJzZUJvb2xlYW5TdHJpbmcodmFsdWUpLCBlbCk7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBhcHBlbmRDaGlsZCgpIG1ldGhvZCBhZGRzIGEgbm9kZSB0byB0aGUgZW5kIG9mIHRoZSBsaXN0IG9mIGNoaWxkcmVuIG9mIGEgc3BlY2lmaWVkIHBhcmVudCBub2RlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY2hpbGRcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGFwcGVuZENoaWxkID0gY3VycnkoZnVuY3Rpb24gKHBhcmVudCwgY2hpbGQpIHtcclxuICByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcclxufSk7XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IGlzIGEgZGVzY2VuZGFudCBvZiB0aGUgZWxlbWVudCBvbiB3aGljaCBpdCBpcyBpbnZva2VkXHJcbiAqIHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIGdyb3VwIG9mIHNlbGVjdG9ycy5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICovXHJcbmV4cG9ydCBjb25zdCBxdWVyeVNlbGVjdG9yID0gY3VycnkoZnVuY3Rpb24gKHNlbGVjdG9yLCBlbCkge1xyXG4gIHJldHVybiBlbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxufSk7XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIG5vbi1saXZlIE5vZGVMaXN0IG9mIGFsbCBlbGVtZW50cyBkZXNjZW5kZWQgZnJvbSB0aGUgZWxlbWVudCBvbiB3aGljaCBpdFxyXG4gKiBpcyBpbnZva2VkIHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIGdyb3VwIG9mIENTUyBzZWxlY3RvcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHJldHVybiB7Tm9kZUxpc3R9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcXVlcnlTZWxlY3RvckFsbCA9IGN1cnJ5KGZ1bmN0aW9uIChzZWxlY3RvciwgZWwpIHtcclxuICByZXR1cm4gZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZXNcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcclxuICpcclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcmVtb3ZlQWxsQ2hpbGRyZW4gPSBmdW5jdGlvbiAoZWwpIHtcclxuICB3aGlsZShlbC5oYXNDaGlsZE5vZGVzKCkpIGVsLnJlbW92ZUNoaWxkKGVsLmxhc3RDaGlsZCk7XHJcbiAgcmV0dXJuIGVsO1xyXG59O1xyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vLi4vaDVwLXNkay9zcmMvc2NyaXB0cy91dGlscy9lbGVtZW50cy5qcyIsIi8qKlxyXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBDb250ZW50VHlwZVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbWFjaGluZU5hbWVcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1ham9yVmVyc2lvblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbWlub3JWZXJzaW9uXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwYXRjaFZlcnNpb25cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGg1cE1ham9yVmVyc2lvblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaDVwTWlub3JWZXJzaW9uXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzdW1tYXJ5XHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXNjcmlwdGlvblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWNvblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gY3JlYXRlZEF0XHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB1cGRhdGVkX0F0XHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpc1JlY29tbWVuZGVkXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwb3B1bGFyaXR5XHJcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0W119IHNjcmVlbnNob3RzXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBsaWNlbnNlXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBleGFtcGxlXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0dXRvcmlhbFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ1tdfSBrZXl3b3Jkc1xyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gb3duZXJcclxuICogQHByb3BlcnR5IHtib29sZWFufSBpbnN0YWxsZWRcclxuICogQHByb3BlcnR5IHtib29sZWFufSByZXN0cmljdGVkXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdWJTZXJ2aWNlcyB7XHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFwaVJvb3RVcmxcclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcih7IGFwaVJvb3RVcmwgfSkge1xyXG4gICAgdGhpcy5hcGlSb290VXJsID0gYXBpUm9vdFVybDtcclxuXHJcbiAgICBpZighd2luZG93LmNhY2hlZENvbnRlbnRUeXBlcyl7XHJcbiAgICAgIC8vIFRPRE8gcmVtb3ZlIHRoaXMgd2hlbiBkb25lIHRlc3RpbmcgZm9yIGVycm9yc1xyXG4gICAgICAvLyB3aW5kb3cuY2FjaGVkQ29udGVudFR5cGVzID0gZmV0Y2goYCR7dGhpcy5hcGlSb290VXJsfWVycm9ycy9OT19SRVNQT05TRS5qc29uYCwge1xyXG5cclxuICAgICAgd2luZG93LmNhY2hlZENvbnRlbnRUeXBlcyA9IGZldGNoKGAke3RoaXMuYXBpUm9vdFVybH1jb250ZW50LXR5cGUtY2FjaGVgLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQuanNvbigpKVxyXG4gICAgICAudGhlbih0aGlzLmlzVmFsaWQpXHJcbiAgICAgIC50aGVuKGpzb24gPT4ganNvbi5saWJyYXJpZXMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtDb250ZW50VHlwZVtdfEVycm9yTWVzc2FnZX0gcmVzcG9uc2VcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlPENvbnRlbnRUeXBlW118RXJyb3JNZXNzYWdlPn1cclxuICAgKi9cclxuICBpc1ZhbGlkKHJlc3BvbnNlKSB7XHJcbiAgICBpZiAocmVzcG9uc2UubWVzc2FnZUNvZGUpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlc3BvbnNlKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBsaXN0IG9mIGNvbnRlbnQgdHlwZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPENvbnRlbnRUeXBlW10+fVxyXG4gICAqL1xyXG4gIGNvbnRlbnRUeXBlcygpIHtcclxuICAgIHJldHVybiB3aW5kb3cuY2FjaGVkQ29udGVudFR5cGVzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIENvbnRlbnQgVHlwZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1hY2hpbmVOYW1lXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxDb250ZW50VHlwZT59XHJcbiAgICovXHJcbiAgY29udGVudFR5cGUobWFjaGluZU5hbWUpIHtcclxuICAgIHJldHVybiB3aW5kb3cuY2FjaGVkQ29udGVudFR5cGVzLnRoZW4oY29udGVudFR5cGVzID0+IHtcclxuICAgICAgcmV0dXJuIGNvbnRlbnRUeXBlcy5maWx0ZXIoY29udGVudFR5cGUgPT4gY29udGVudFR5cGUubWFjaGluZU5hbWUgPT09IG1hY2hpbmVOYW1lKVswXTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8qcmV0dXJuIGZldGNoKGAke3RoaXMuYXBpUm9vdFVybH1jb250ZW50X3R5cGVfY2FjaGUvJHtpZH1gLCB7XHJcbiAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZSdcclxuICAgIH0pLnRoZW4ocmVzdWx0ID0+IHJlc3VsdC5qc29uKCkpOyovXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbnN0YWxscyBhIGNvbnRlbnQgdHlwZSBvbiB0aGUgc2VydmVyXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPENvbnRlbnRUeXBlPn1cclxuICAgKi9cclxuICBpbnN0YWxsQ29udGVudFR5cGUoaWQpIHtcclxuICAgIHJldHVybiBmZXRjaChgJHt0aGlzLmFwaVJvb3RVcmx9bGlicmFyeS1pbnN0YWxsP2lkPSR7aWR9YCwge1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcclxuICAgICAgYm9keTogJydcclxuICAgIH0pLnRoZW4ocmVzdWx0ID0+IHJlc3VsdC5qc29uKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBsb2FkcyBhIGNvbnRlbnQgdHlwZSB0byB0aGUgc2VydmVyIGZvciB2YWxpZGF0aW9uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0Zvcm1EYXRhfSBmb3JtRGF0YSBGb3JtIGNvbnRhaW5pbmcgdGhlIGg1cCB0aGF0IHNob3VsZCBiZSB1cGxvYWRlZCBhcyAnaDVwJ1xyXG4gICAqXHJcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUmV0dXJucyB0aGUgcHJvbWlzZSBvZiBhIGpzb24gY29udGFpbmluZyB0aGUgY29udGVudCBqc29uIGFuZCB0aGUgaDVwIGpzb25cclxuICAgKi9cclxuICB1cGxvYWRDb250ZW50KGZvcm1EYXRhKSB7XHJcbiAgICByZXR1cm4gZmV0Y2goYCR7dGhpcy5hcGlSb290VXJsfWxpYnJhcnktdXBsb2FkYCwge1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcclxuICAgICAgYm9keTogZm9ybURhdGFcclxuICAgIH0pLnRoZW4ocmVzdWx0ID0+IHJlc3VsdC5qc29uKCkpO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9odWItc2VydmljZXMuanMiLCIvKipcclxuICogQHBhcmFtICB7c3RyaW5nfSAgIGNvbmZpZy50eXBlICAgICAgICAgdHlwZSBvZiB0aGUgbWVzc2FnZTogaW5mbywgc3VjY2VzcywgZXJyb3JcclxuICogQHBhcmFtICB7Ym9vbGVhbn0gIGNvbmZpZy5kaXNtaXNzaWJsZSAgd2hldGhlciB0aGUgbWVzc2FnZSBjYW4gYmUgZGlzbWlzc2VkXHJcbiAqIEBwYXJhbSAge3N0cmluZ30gICBjb25maWcuY29udGVudCAgICAgIG1lc3NhZ2UgY29udGVudCB1c3VhbGx5IGEgJ2gzJyBhbmQgYSAncCdcclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9IGRpdiBjb250YWluaW5nIHRoZSBtZXNzYWdlIGVsZW1lbnRcclxuICovXHJcblxyXG4vL1RPRE8gaGFuZGxlIHN0cmluZ3MsIGh0bWwsIGJhZGx5IGZvcm1lZCBvYmplY3RcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVuZGVyRXJyb3JNZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAvLyBjb25zb2xlLmxvZyhtZXNzYWdlKTtcclxuICBjb25zdCBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGNsb3NlQnV0dG9uLmNsYXNzTmFtZSA9ICdjbG9zZSc7XHJcbiAgY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gJyYjeDI3MTUnO1xyXG5cclxuICBjb25zdCBtZXNzYWdlQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIG1lc3NhZ2VDb250ZW50LmNsYXNzTmFtZSA9ICdtZXNzYWdlLWNvbnRlbnQnO1xyXG4gIG1lc3NhZ2VDb250ZW50LmlubmVySFRNTCA9ICc8aDE+JyArIG1lc3NhZ2UudGl0bGUgKyAnPC9oMT4nICsgJzxwPicgKyBtZXNzYWdlLmNvbnRlbnQgKyAnPC9wPic7XHJcblxyXG4gIGNvbnN0IG1lc3NhZ2VXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgbWVzc2FnZVdyYXBwZXIuY2xhc3NOYW1lID0gJ21lc3NhZ2UnICsgJyAnICsgYCR7bWVzc2FnZS50eXBlfWAgKyAobWVzc2FnZS5kaXNtaXNzaWJsZSA/ICcgZGlzbWlzc2libGUnIDogJycpO1xyXG4gIG1lc3NhZ2VXcmFwcGVyLmFwcGVuZENoaWxkKGNsb3NlQnV0dG9uKTtcclxuICBtZXNzYWdlV3JhcHBlci5hcHBlbmRDaGlsZChtZXNzYWdlQ29udGVudCk7XHJcblxyXG4gIGlmIChtZXNzYWdlLmJ1dHRvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjb25zdCBtZXNzYWdlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICBtZXNzYWdlQnV0dG9uLmNsYXNzTmFtZSA9ICdidXR0b24nO1xyXG4gICAgbWVzc2FnZUJ1dHRvbi5pbm5lckhUTUwgPSBtZXNzYWdlLmJ1dHRvbjtcclxuICAgIG1lc3NhZ2VXcmFwcGVyLmFwcGVuZENoaWxkKG1lc3NhZ2VCdXR0b24pO1xyXG4gIH1cclxuXHJcbiAgY29uc29sZS5sb2cobWVzc2FnZVdyYXBwZXIpO1xyXG4gIHJldHVybiBtZXNzYWdlV3JhcHBlcjtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvdXRpbHMvZXJyb3JzLmpzIiwiaW1wb3J0IHsgY3VycnkgfSBmcm9tIFwidXRpbHMvZnVuY3Rpb25hbFwiO1xyXG5cclxuLyoqXHJcbiAqICBUcmFuc2Zvcm1zIGEgRE9NIGNsaWNrIGV2ZW50IGludG8gYW4gRXZlbnRmdWwncyBldmVudFxyXG4gKiAgQHNlZSBFdmVudGZ1bFxyXG4gKlxyXG4gKiBAcGFyYW0gIHtzdHJpbmcgfCBPYmplY3R9IHR5cGVcclxuICogQHBhcmFtICB7RXZlbnRmdWx9IGV2ZW50ZnVsXHJcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHJlbGF5Q2xpY2tFdmVudEFzID0gY3VycnkoZnVuY3Rpb24odHlwZSwgZXZlbnRmdWwsIGVsZW1lbnQpIHtcclxuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgZXZlbnRmdWwuZmlyZSh0eXBlLCB7XHJcbiAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXHJcbiAgICAgIGlkOiBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpXHJcbiAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgLy8gZG9uJ3QgYnViYmxlXHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGVsZW1lbnQ7XHJcbn0pO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy91dGlscy9ldmVudHMuanMiLCJpbXBvcnQge3NldEF0dHJpYnV0ZSwgYXR0cmlidXRlRXF1YWxzLCB0b2dnbGVBdHRyaWJ1dGV9IGZyb20gJy4uL3V0aWxzL2VsZW1lbnRzJztcclxuaW1wb3J0IHtjdXJyeSwgZm9yRWFjaH0gZnJvbSAnLi4vdXRpbHMvZnVuY3Rpb25hbCc7XHJcblxyXG4vKipcclxuICogQHR5cGUge2Z1bmN0aW9ufVxyXG4gKi9cclxuY29uc3QgaXNFeHBhbmRlZCA9IGF0dHJpYnV0ZUVxdWFscyhcImFyaWEtZXhwYW5kZWRcIiwgJ3RydWUnKTtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZSB7ZnVuY3Rpb259XHJcbiAqL1xyXG5jb25zdCBoaWRlID0gc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcblxyXG4vKipcclxuICogQHR5cGUge2Z1bmN0aW9ufVxyXG4gKi9cclxuY29uc3Qgc2hvdyA9IHNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbi8qKlxyXG4gKiBUb2dnbGVzIHRoZSBib2R5IHZpc2liaWxpdHlcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gYm9keUVsZW1lbnRcclxuICogQHBhcmFtIHtib29sZWFufSBpc0V4cGFuZGVkXHJcbiAqL1xyXG5jb25zdCB0b2dnbGVCb2R5VmlzaWJpbGl0eSA9IGZ1bmN0aW9uKGJvZHlFbGVtZW50LCBpc0V4cGFuZGVkKSB7XHJcbiAgaWYoIWlzRXhwYW5kZWQpIHtcclxuICAgIGhpZGUoYm9keUVsZW1lbnQpO1xyXG4gICAgLy9ib2R5RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcclxuICB9XHJcbiAgZWxzZSAvKmlmKGJvZHlFbGVtZW50LnNjcm9sbEhlaWdodCA+IDApKi8ge1xyXG4gICAgc2hvdyhib2R5RWxlbWVudCk7XHJcbiAgICAvL2JvZHlFbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke2JvZHlFbGVtZW50LnNjcm9sbEhlaWdodH1weGA7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhhbmRsZXMgY2hhbmdlcyB0byBhcmlhLWV4cGFuZGVkXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGJvZHlFbGVtZW50XHJcbiAqIEBwYXJhbSB7TXV0YXRpb25SZWNvcmR9IGV2ZW50XHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuY29uc3Qgb25BcmlhRXhwYW5kZWRDaGFuZ2UgPSBjdXJyeShmdW5jdGlvbihib2R5RWxlbWVudCwgZXZlbnQpIHtcclxuICB0b2dnbGVCb2R5VmlzaWJpbGl0eShib2R5RWxlbWVudCwgaXNFeHBhbmRlZChldmVudC50YXJnZXQpKTtcclxufSk7XHJcblxyXG4vKipcclxuICogSW5pdGlhbGl6ZXMgYSBwYW5lbFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5pdChlbGVtZW50KSB7XHJcbiAgY29uc3QgdGl0bGVFbCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignW2FyaWEtZXhwYW5kZWRdJyk7XHJcbiAgY29uc3QgYm9keUlkID0gdGl0bGVFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKTtcclxuICBjb25zdCBib2R5RWwgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2JvZHlJZH1gKTtcclxuXHJcbiAgaWYodGl0bGVFbCkge1xyXG4gICAgLy8gc2V0IG9ic2VydmVyIG9uIHRpdGxlIGZvciBhcmlhLWV4cGFuZGVkXHJcbiAgICBsZXQgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmb3JFYWNoKG9uQXJpYUV4cGFuZGVkQ2hhbmdlKGJvZHlFbCkpKTtcclxuXHJcbiAgICBvYnNlcnZlci5vYnNlcnZlKHRpdGxlRWwsIHtcclxuICAgICAgYXR0cmlidXRlczogdHJ1ZSxcclxuICAgICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXHJcbiAgICAgIGF0dHJpYnV0ZUZpbHRlcjogW1wiYXJpYS1leHBhbmRlZFwiXVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gU2V0IGNsaWNrIGxpc3RlbmVyIHRoYXQgdG9nZ2xlcyBhcmlhLWV4cGFuZGVkXHJcbiAgICB0aXRsZUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgdG9nZ2xlQXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBldmVudC50YXJnZXQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdG9nZ2xlQm9keVZpc2liaWxpdHkoYm9keUVsLCBpc0V4cGFuZGVkKHRpdGxlRWwpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBlbGVtZW50O1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vLi4vaDVwLXNkay9zcmMvc2NyaXB0cy9jb21wb25lbnRzL3BhbmVsLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIWnBaWGRDYjNnOUlqQWdNQ0EwTURBZ01qSTFJajROQ2lBZ1BHUmxabk0rRFFvZ0lDQWdQSE4wZVd4bFBnMEtJQ0FnSUNBZ0xtTnNjeTB4SUhzTkNpQWdJQ0FnSUdacGJHdzZJRzV2Ym1VN0RRb2dJQ0FnSUNCOURRb05DaUFnSUNBZ0lDNWpiSE10TWlCN0RRb2dJQ0FnSUNCbWFXeHNPaUFqWXpaak5tTTNPdzBLSUNBZ0lDQWdmUTBLRFFvZ0lDQWdJQ0F1WTJ4ekxUTXNJQzVqYkhNdE5DQjdEUW9nSUNBZ0lDQm1hV3hzT2lBalptWm1PdzBLSUNBZ0lDQWdmUTBLRFFvZ0lDQWdJQ0F1WTJ4ekxUTWdldzBLSUNBZ0lDQWdiM0JoWTJsMGVUb2dNQzQzT3cwS0lDQWdJQ0FnZlEwS0lDQWdJRHd2YzNSNWJHVStEUW9nSUR3dlpHVm1jejROQ2lBZ1BIUnBkR3hsUG1OdmJuUmxiblFnZEhsd1pTQndiR0ZqWldodmJHUmxjbDh5UEM5MGFYUnNaVDROQ2lBZ1BHY2dhV1E5SWt4aGVXVnlYeklpSUdSaGRHRXRibUZ0WlQwaVRHRjVaWElnTWlJK0RRb2dJQ0FnUEdjZ2FXUTlJbU52Ym5SbGJuUmZkSGx3WlY5d2JHRmpaV2h2YkdSbGNpMHhYMk52Y0hraUlHUmhkR0V0Ym1GdFpUMGlZMjl1ZEdWdWRDQjBlWEJsSUhCc1lXTmxhRzlzWkdWeUxURWdZMjl3ZVNJK0RRb2dJQ0FnSUNBOGNtVmpkQ0JqYkdGemN6MGlZMnh6TFRFaUlIZHBaSFJvUFNJME1EQWlJR2hsYVdkb2REMGlNakkxSWk4K0RRb2dJQ0FnSUNBOGNtVmpkQ0JqYkdGemN6MGlZMnh6TFRJaUlIZzlJakV4TWk0MU1TSWdlVDBpTkRNdU5ERWlJSGRwWkhSb1BTSXhOell1T1RZaUlHaGxhV2RvZEQwaU1UTTFMalExSWlCeWVEMGlNVEFpSUhKNVBTSXhNQ0l2UGcwS0lDQWdJQ0FnUEdOcGNtTnNaU0JqYkdGemN6MGlZMnh6TFRNaUlHTjRQU0l4TXpZdU5qWWlJR041UFNJMk1TNDVPQ0lnY2owaU5DNDRNU0l2UGcwS0lDQWdJQ0FnUEdOcGNtTnNaU0JqYkdGemN6MGlZMnh6TFRNaUlHTjRQU0l4TlRFdU5Ea2lJR041UFNJMk1TNDVPQ0lnY2owaU5DNDRNU0l2UGcwS0lDQWdJQ0FnUEdOcGNtTnNaU0JqYkdGemN6MGlZMnh6TFRNaUlHTjRQU0l4TmpZdU1TSWdZM2s5SWpZeExqazRJaUJ5UFNJMExqZ3hJaTgrRFFvZ0lDQWdJQ0E4WnlCcFpEMGlYMGR5YjNWd1h5SWdaR0YwWVMxdVlXMWxQU0ltYkhRN1IzSnZkWEFtWjNRN0lqNE5DaUFnSUNBZ0lDQWdQR2NnYVdROUlsOUhjbTkxY0Y4eUlpQmtZWFJoTFc1aGJXVTlJaVpzZER0SGNtOTFjQ1puZERzaVBnMEtJQ0FnSUNBZ0lDQWdJRHh3WVhSb0lHbGtQU0pmUTI5dGNHOTFibVJmVUdGMGFGOGlJR1JoZEdFdGJtRnRaVDBpSm14ME8wTnZiWEJ2ZFc1a0lGQmhkR2dtWjNRN0lpQmpiR0Z6Y3owaVkyeHpMVFFpSUdROUlrMHlOak11TWpnc09UVXVNakZETWpZd0xEa3lMakEzTERJMU5TdzVNUzQxTERJME9DNDBNeXc1TVM0MVNESXlOM1k0U0RFNU9TNDFiQzB5TGpFM0xERXdMakkwWVRJMUxqZzBMREkxTGpnMExEQXNNQ3d4TERFeExqUTRMVEV1TmpNc01Ua3VPVE1zTVRrdU9UTXNNQ3d3TERFc01UUXVNemtzTlM0MU55d3hPQzR5Tml3eE9DNHlOaXd3TERBc01TdzFMalV5TERFekxqWXNNak11TVRFc01qTXVNVEVzTUN3d0xERXRNaTQ0TkN3eE1TNHdOU3d4T0M0Mk5Td3hPQzQyTlN3d0xEQXNNUzA0TGpBMkxEY3VOemtzT1N3NUxEQXNNQ3d4TFRRdU1USXNNUzR6TjBneU16WjJMVEl4YURFd0xqUXlZemN1TXpZc01Dd3hNaTQ0TXkweExqWXhMREUyTGpReUxUVnpOUzR6T0MwM0xqUTRMRFV1TXpndE1UTXVORFJETWpZNExqSXlMREV3TWk0eU9Td3lOall1TlRjc09UZ3VNelVzTWpZekxqSTRMRGsxTGpJeFdtMHRNVFVzTVRkakxURXVORElzTVM0eU1pMHpMamtzTVM0eU5TMDNMalF4TERFdU1qVklNak0yZGkweE5HZzFMall5WVRrdU5UY3NPUzQxTnl3d0xEQXNNU3czTERJdU9UTXNOeTR3TlN3M0xqQTFMREFzTUN3eExERXVPRFVzTkM0NU1rRTJMak16TERZdU16TXNNQ3d3TERFc01qUTRMak14TERFeE1pNHlOVm9pTHo0TkNpQWdJQ0FnSUNBZ0lDQThjR0YwYUNCcFpEMGlYMUJoZEdoZklpQmtZWFJoTFc1aGJXVTlJaVpzZER0UVlYUm9KbWQwT3lJZ1kyeGhjM005SW1Oc2N5MDBJaUJrUFNKTk1qQXlMamtzTVRFNUxqRXhZVGd1TVRJc09DNHhNaXd3TERBc01DMDNMakk0TERRdU5USnNMVEUyTFRFdU1qSXNOeTR5TWkwek1DNDVNa2d4TnpSMk1qSklNVFV6ZGkweU1rZ3hNeloyTlRab01UZDJMVEl4YURJeGRqSXhhREl3TGpNeFl5MHlMamN5TERBdE5TMHhMalV6TFRjdE0yRXhPUzR4T1N3eE9TNHhPU3d3TERBc01TMDBMamN6TFRRdU9ETXNNak11TlRnc01qTXVOVGdzTUN3d0xERXRNeTAyTGpac01UWXRNaTR5Tm1FNExqRXhMRGd1TVRFc01Dd3hMREFzTnk0eU5pMHhNUzQzTWxvaUx6NE5DaUFnSUNBZ0lDQWdQQzluUGcwS0lDQWdJQ0FnUEM5blBnMEtJQ0FnSUNBZ1BISmxZM1FnWTJ4aGMzTTlJbU5zY3kweklpQjRQU0l4TnpjdU5qWWlJSGs5SWpVM0xqWTJJaUIzYVdSMGFEMGlPVEl1TWpnaUlHaGxhV2RvZEQwaU9TNHpPQ0lnY25nOUlqTXVOU0lnY25rOUlqTXVOU0l2UGcwS0lDQWdJRHd2Wno0TkNpQWdQQzluUGcwS1BDOXpkbWMrRFFvPVwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW1hZ2VzL2NvbnRlbnQtdHlwZS1wbGFjZWhvbGRlci5zdmdcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IEh1YlZpZXcgZnJvbSAnLi9odWItdmlldyc7XHJcbmltcG9ydCBDb250ZW50VHlwZVNlY3Rpb24gZnJvbSAnLi9jb250ZW50LXR5cGUtc2VjdGlvbi9jb250ZW50LXR5cGUtc2VjdGlvbic7XHJcbmltcG9ydCBVcGxvYWRTZWN0aW9uIGZyb20gJy4vdXBsb2FkLXNlY3Rpb24vdXBsb2FkLXNlY3Rpb24nO1xyXG5pbXBvcnQgSHViU2VydmljZXMgZnJvbSAnLi9odWItc2VydmljZXMnO1xyXG5pbXBvcnQgeyBFdmVudGZ1bCB9IGZyb20gJy4vbWl4aW5zL2V2ZW50ZnVsJztcclxuaW1wb3J0IHtyZW5kZXJFcnJvck1lc3NhZ2V9IGZyb20gJy4vdXRpbHMvZXJyb3JzJztcclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtvYmplY3R9IEh1YlN0YXRlXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0aXRsZVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gc2VjdGlvbklkXHJcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gZXhwYW5kZWRcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGFwaVJvb3RVcmxcclxuICovXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBFcnJvck1lc3NhZ2VcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1lc3NhZ2VcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGVycm9yQ29kZVxyXG4gKi9cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtvYmplY3R9IFNlbGVjdGVkRWxlbWVudFxyXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZFxyXG4gKi9cclxuLyoqXHJcbiAqIFNlbGVjdCBldmVudFxyXG4gKiBAZXZlbnQgSHViI3NlbGVjdFxyXG4gKiBAdHlwZSB7U2VsZWN0ZWRFbGVtZW50fVxyXG4gKi9cclxuLyoqXHJcbiAqIEVycm9yIGV2ZW50XHJcbiAqIEBldmVudCBIdWIjZXJyb3JcclxuICogQHR5cGUge0Vycm9yTWVzc2FnZX1cclxuICovXHJcbi8qKlxyXG4gKiBVcGxvYWQgZXZlbnRcclxuICogQGV2ZW50IEh1YiN1cGxvYWRcclxuICogQHR5cGUge09iamVjdH1cclxuICovXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQG1peGVzIEV2ZW50ZnVsXHJcbiAqIEBmaXJlcyBIdWIjc2VsZWN0XHJcbiAqIEBmaXJlcyBIdWIjZXJyb3JcclxuICogQGZpcmVzIEh1YiN1cGxvYWRcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh1YiB7XHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtIdWJTdGF0ZX0gc3RhdGVcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgLy8gYWRkIGV2ZW50IHN5c3RlbVxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBFdmVudGZ1bCgpKTtcclxuXHJcbiAgICAvLyBjb250cm9sbGVyc1xyXG4gICAgdGhpcy5jb250ZW50VHlwZVNlY3Rpb24gPSBuZXcgQ29udGVudFR5cGVTZWN0aW9uKHN0YXRlKTtcclxuICAgIHRoaXMudXBsb2FkU2VjdGlvbiA9IG5ldyBVcGxvYWRTZWN0aW9uKHN0YXRlKTtcclxuXHJcbiAgICAvLyB2aWV3c1xyXG4gICAgdGhpcy52aWV3ID0gbmV3IEh1YlZpZXcoc3RhdGUpO1xyXG5cclxuICAgIC8vIHNlcnZpY2VzXHJcbiAgICB0aGlzLnNlcnZpY2VzID0gbmV3IEh1YlNlcnZpY2VzKHtcclxuICAgICAgYXBpUm9vdFVybDogc3RhdGUuYXBpUm9vdFVybFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gcHJvcGFnYXRlIGNvbnRyb2xsZXIgZXZlbnRzXHJcbiAgICB0aGlzLnByb3BhZ2F0ZShbJ3NlbGVjdCcsICdlcnJvciddLCB0aGlzLmNvbnRlbnRUeXBlU2VjdGlvbik7XHJcbiAgICB0aGlzLnByb3BhZ2F0ZShbJ3VwbG9hZCddLCB0aGlzLnVwbG9hZFNlY3Rpb24pO1xyXG5cclxuICAgIC8vIGhhbmRsZSBldmVudHNcclxuICAgIHRoaXMub24oJ3NlbGVjdCcsIHRoaXMuc2V0UGFuZWxUaXRsZSwgdGhpcyk7XHJcbiAgICB0aGlzLm9uKCdzZWxlY3QnLCB0aGlzLnZpZXcuY2xvc2VQYW5lbCwgdGhpcy52aWV3KTtcclxuICAgIHRoaXMudmlldy5vbigndGFiLWNoYW5nZScsIHRoaXMudmlldy5zZXRTZWN0aW9uVHlwZSwgdGhpcy52aWV3KTtcclxuICAgIHRoaXMudmlldy5vbigncGFuZWwtY2hhbmdlJywgdGhpcy52aWV3LnRvZ2dsZVBhbmVsT3Blbi5iaW5kKHRoaXMudmlldyksIHRoaXMudmlldyk7XHJcblxyXG4gICAgdGhpcy5pbml0VGFiUGFuZWwoc3RhdGUpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBwcm9taXNlIG9mIGEgY29udGVudCB0eXBlXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1hY2hpbmVOYW1lXHJcbiAgICogQHJldHVybiB7UHJvbWlzZS48Q29udGVudFR5cGU+fVxyXG4gICAqL1xyXG4gIGdldENvbnRlbnRUeXBlKG1hY2hpbmVOYW1lKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlcy5jb250ZW50VHlwZShtYWNoaW5lTmFtZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSB0aXRsZSBvZiB0aGUgcGFuZWxcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxyXG4gICAqL1xyXG4gIHNldFBhbmVsVGl0bGUoe2lkfSnCoHtcclxuICAgIHRoaXMuZ2V0Q29udGVudFR5cGUoaWQpLnRoZW4oKHt0aXRsZX0pID0+IHRoaXMudmlldy5zZXRUaXRsZSh0aXRsZSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhdGVzIHRoZSB0YWIgcGFuZWxcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWN0aW9uSWRcclxuICAgKi9cclxuICBpbml0VGFiUGFuZWwoeyBzZWN0aW9uSWQgPSAnY29udGVudC10eXBlcycgfSkge1xyXG4gICAgY29uc3QgdGFiQ29uZmlncyA9IFt7XHJcbiAgICAgIHRpdGxlOiAnQ3JlYXRlIENvbnRlbnQnLFxyXG4gICAgICBpZDogJ2NvbnRlbnQtdHlwZXMnLFxyXG4gICAgICBjb250ZW50OiB0aGlzLmNvbnRlbnRUeXBlU2VjdGlvbi5nZXRFbGVtZW50KCksXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICB0aXRsZTogJ1VwbG9hZCcsXHJcbiAgICAgIGlkOiAndXBsb2FkJyxcclxuICAgICAgY29udGVudDogdGhpcy51cGxvYWRTZWN0aW9uLmdldEVsZW1lbnQoKVxyXG4gICAgfV07XHJcblxyXG4gICAgLy8gc2V0cyB0aGUgY29ycmVjdCBvbmUgc2VsZWN0ZWRcclxuICAgIHRhYkNvbmZpZ3NcclxuICAgICAgLmZpbHRlcihjb25maWcgPT4gY29uZmlnLmlkID09PSBzZWN0aW9uSWQpXHJcbiAgICAgIC5mb3JFYWNoKGNvbmZpZyA9PiBjb25maWcuc2VsZWN0ZWQgPSB0cnVlKTtcclxuXHJcbiAgICB0YWJDb25maWdzLmZvckVhY2godGFiQ29uZmlnID0+IHRoaXMudmlldy5hZGRUYWIodGFiQ29uZmlnKSk7XHJcbiAgICB0aGlzLnZpZXcuYWRkQm90dG9tQm9yZGVyKCk7IC8vIEFkZHMgYW4gYW5pbWF0ZWQgYm90dG9tIGJvcmRlciB0byBlYWNoIHRhYlxyXG4gICAgdGhpcy52aWV3LmluaXRUYWJQYW5lbCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcm9vdCBlbGVtZW50IGluIHRoZSB2aWV3XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICAgKi9cclxuICBnZXRFbGVtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmlldy5nZXRFbGVtZW50KCk7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL2h1Yi5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3R5bGVzL21haW4uc2Nzc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBzZXRBdHRyaWJ1dGUsIGdldEF0dHJpYnV0ZSwgcmVtb3ZlQ2hpbGQgfSBmcm9tIFwidXRpbHMvZWxlbWVudHNcIjtcclxuaW1wb3J0IHsgY3VycnkgfSBmcm9tIFwidXRpbHMvZnVuY3Rpb25hbFwiO1xyXG5pbXBvcnQgeyBFdmVudGZ1bCB9IGZyb20gJy4uL21peGlucy9ldmVudGZ1bCc7XHJcbmltcG9ydCBpbml0UGFuZWwgZnJvbSBcImNvbXBvbmVudHMvcGFuZWxcIjtcclxuaW1wb3J0IGluaXRJbWFnZVNjcm9sbGVyIGZyb20gXCJjb21wb25lbnRzL2ltYWdlLXNjcm9sbGVyXCI7XHJcbmltcG9ydCB7IHJlbGF5Q2xpY2tFdmVudEFzIH0gZnJvbSAnLi4vdXRpbHMvZXZlbnRzJztcclxuaW1wb3J0IG5vSWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvY29udGVudC10eXBlLXBsYWNlaG9sZGVyLnN2Zyc7XHJcblxyXG4vKipcclxuICogQGNvbnN0YW50IHtzdHJpbmd9XHJcbiAqL1xyXG5jb25zdCBBVFRSSUJVVEVfQ09OVEVOVF9UWVBFX0lEID0gJ2RhdGEtaWQnO1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuY29uc3QgaGlkZSA9IHNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuY29uc3Qgc2hvdyA9IHNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbi8qKlxyXG4gKiBUb2dnbGVzIHRoZSB2aXNpYmlsaXR5IGlmIGFuIGVsZW1lbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGVcclxuICovXHJcbmNvbnN0IHRvZ2dsZVZpc2liaWxpdHkgPSAoZWxlbWVudCwgdmlzaWJsZSkgPT4gKHZpc2libGUgPyBzaG93IDogaGlkZSkoZWxlbWVudCk7XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIGEgc3RyaW5nIGlzIGVtcHR5XHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XHJcbiAqXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VtcHR5ID0gKHRleHQpID0+ICh0eXBlb2YgdGV4dCA9PT0gJ3N0cmluZycpICYmICh0ZXh0Lmxlbmd0aCA9PT0gMCk7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEBtaXhlcyBFdmVudGZ1bFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudFR5cGVEZXRhaWxWaWV3IHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgLy8gYWRkIGV2ZW50IHN5c3RlbVxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBFdmVudGZ1bCgpKTtcclxuXHJcbiAgICAvLyBiYWNrIGJ1dHRvblxyXG4gICAgY29uc3QgYmFja0J1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGJhY2tCdXR0b25FbGVtZW50LmNsYXNzTmFtZSA9ICdiYWNrLWJ1dHRvbiBpY29uLWFycm93LXRoaWNrJztcclxuICAgIHJlbGF5Q2xpY2tFdmVudEFzKCdjbG9zZScsIHRoaXMsIGJhY2tCdXR0b25FbGVtZW50KTtcclxuXHJcbiAgICAvLyBpbWFnZVxyXG4gICAgdGhpcy5pbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgdGhpcy5pbWFnZS5jbGFzc05hbWUgPSAnaW1nLXJlc3BvbnNpdmUnO1xyXG5cclxuICAgIGNvbnN0IGltYWdlV3JhcHBlckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGltYWdlV3JhcHBlckVsZW1lbnQuY2xhc3NOYW1lID0gJ2ltYWdlLXdyYXBwZXInO1xyXG4gICAgaW1hZ2VXcmFwcGVyRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmltYWdlKTtcclxuXHJcbiAgICAvLyB0aXRsZVxyXG4gICAgdGhpcy50aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XHJcblxyXG4gICAgLy8gYXV0aG9yXHJcbiAgICB0aGlzLmF1dGhvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGhpcy5hdXRob3IuY2xhc3NOYW1lID0gJ2F1dGhvcic7XHJcbiAgICB0aGlzLmF1dGhvci5pbm5lckhUTUwgPSAnYnkgSm91YmVsJzsgLy8gVE9ETyBNYWtlIGR5bmFtaWNcclxuXHJcbiAgICAvLyBkZXNjcmlwdGlvblxyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24uY2xhc3NOYW1lID0gJ3NtYWxsJztcclxuXHJcbiAgICAvLyBkZW1vIGJ1dHRvblxyXG4gICAgdGhpcy5kZW1vQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgdGhpcy5kZW1vQnV0dG9uLmNsYXNzTmFtZSA9ICdidXR0b24nO1xyXG4gICAgdGhpcy5kZW1vQnV0dG9uLmlubmVySFRNTCA9ICdDb250ZW50IERlbW8nO1xyXG4gICAgdGhpcy5kZW1vQnV0dG9uLnNldEF0dHJpYnV0ZSgndGFyZ2V0JywgJ19ibGFuaycpO1xyXG4gICAgaGlkZSh0aGlzLmRlbW9CdXR0b24pO1xyXG5cclxuICAgIGNvbnN0IHRleHREZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0ZXh0RGV0YWlscy5jbGFzc05hbWUgPSAndGV4dC1kZXRhaWxzJztcclxuICAgIHRleHREZXRhaWxzLmFwcGVuZENoaWxkKHRoaXMudGl0bGUpO1xyXG4gICAgdGV4dERldGFpbHMuYXBwZW5kQ2hpbGQodGhpcy5hdXRob3IpO1xyXG4gICAgdGV4dERldGFpbHMuYXBwZW5kQ2hpbGQodGhpcy5kZXNjcmlwdGlvbik7XHJcbiAgICB0ZXh0RGV0YWlscy5hcHBlbmRDaGlsZCh0aGlzLmRlbW9CdXR0b24pO1xyXG5cclxuICAgIGNvbnN0IGRldGFpbHNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkZXRhaWxzRWxlbWVudC5jbGFzc05hbWUgPSAnY29udGFpbmVyJztcclxuICAgIGRldGFpbHNFbGVtZW50LmFwcGVuZENoaWxkKGltYWdlV3JhcHBlckVsZW1lbnQpO1xyXG4gICAgZGV0YWlsc0VsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dERldGFpbHMpO1xyXG5cclxuICAgIC8vIHVzZSBidXR0b25cclxuICAgIHRoaXMudXNlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgdGhpcy51c2VCdXR0b24uY2xhc3NOYW1lID0gJ2J1dHRvbiBidXR0b24tcHJpbWFyeSc7XHJcbiAgICB0aGlzLnVzZUJ1dHRvbi5pbm5lckhUTUwgPSAnVXNlJztcclxuICAgIGhpZGUodGhpcy51c2VCdXR0b24pO1xyXG4gICAgcmVsYXlDbGlja0V2ZW50QXMoJ3NlbGVjdCcsIHRoaXMsIHRoaXMudXNlQnV0dG9uKTtcclxuXHJcbiAgICAvLyBpbnN0YWxsIGJ1dHRvblxyXG4gICAgdGhpcy5pbnN0YWxsQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgdGhpcy5pbnN0YWxsQnV0dG9uLmNsYXNzTmFtZSA9ICdidXR0b24gYnV0dG9uLWludmVyc2UtcHJpbWFyeSc7XHJcbiAgICB0aGlzLmluc3RhbGxCdXR0b24uaW5uZXJIVE1MID0gJ0luc3RhbGwnO1xyXG4gICAgaGlkZSh0aGlzLmluc3RhbGxCdXR0b24pO1xyXG4gICAgcmVsYXlDbGlja0V2ZW50QXMoJ2luc3RhbGwnLCB0aGlzLCB0aGlzLmluc3RhbGxCdXR0b24pO1xyXG5cclxuICAgIGNvbnN0IGJ1dHRvbkJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgYnV0dG9uQmFyLmNsYXNzTmFtZSA9ICdidXR0b24tYmFyJztcclxuICAgIGJ1dHRvbkJhci5hcHBlbmRDaGlsZCh0aGlzLnVzZUJ1dHRvbik7XHJcbiAgICBidXR0b25CYXIuYXBwZW5kQ2hpbGQodGhpcy5pbnN0YWxsQnV0dG9uKTtcclxuXHJcbiAgICAvLyBsaWNlbmNlIHBhbmVsXHJcbiAgICBjb25zdCBsaWNlbmNlUGFuZWwgPSB0aGlzLmNyZWF0ZVBhbmVsKCdUaGUgTGljZW5jZSBJbmZvJywgJ2lwc3VtIGxvcnVtJywgJ2xpY2VuY2UtcGFuZWwnKTtcclxuICAgIGNvbnN0IHBsdWdpbnNQYW5lbCA9IHRoaXMuY3JlYXRlUGFuZWwoJ0F2YWlsYWJsZSBwbHVnaW5zJywgJ2lwc3VtIGxvcnVtJywgJ3BsdWdpbnMtcGFuZWwnKTtcclxuICAgIGNvbnN0IHB1Ymxpc2hlclBhbmVsID0gdGhpcy5jcmVhdGVQYW5lbCgnUHVibGlzaGVyIEluZm8nLCAnaXBzdW0gbG9ydW0nLCAncHVibGlzaGVyLXBhbmVsJyk7XHJcblxyXG4gICAgLy8gcGFuZWwgZ3JvdXBcclxuICAgIGNvbnN0IHBhbmVsR3JvdXBFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBwYW5lbEdyb3VwRWxlbWVudC5jbGFzc05hbWUgPSAncGFuZWwtZ3JvdXAnO1xyXG4gICAgcGFuZWxHcm91cEVsZW1lbnQuYXBwZW5kQ2hpbGQobGljZW5jZVBhbmVsKTtcclxuICAgIHBhbmVsR3JvdXBFbGVtZW50LmFwcGVuZENoaWxkKHBsdWdpbnNQYW5lbCk7XHJcbiAgICBwYW5lbEdyb3VwRWxlbWVudC5hcHBlbmRDaGlsZChwdWJsaXNoZXJQYW5lbCk7XHJcblxyXG4gICAgLy8gaW1hZ2VzXHJcbiAgICB0aGlzLmNhcm91c2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0aGlzLmNhcm91c2VsLnNldEF0dHJpYnV0ZSgncm9sZScsICdyZWdpb24nKTtcclxuICAgIHRoaXMuY2Fyb3VzZWwuc2V0QXR0cmlidXRlKCdkYXRhLXNpemUnLCAnNScpO1xyXG4gICAgdGhpcy5jYXJvdXNlbC5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cImNhcm91c2VsXCIgcm9sZT1cInJlZ2lvblwiIGRhdGEtc2l6ZT1cIjVcIj5cclxuICAgIDxzcGFuIGNsYXNzPVwiY2Fyb3VzZWwtYnV0dG9uIHByZXZpb3VzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+JmxhcnI7PC9zcGFuPlxyXG4gICAgPHNwYW4gY2xhc3M9XCJjYXJvdXNlbC1idXR0b24gbmV4dFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZyYXJyOzwvc3Bhbj5cclxuICAgIDxuYXYgY2xhc3M9XCJzY3JvbGxlclwiPjx1bD48L3VsPjwvbmF2PmA7XHJcblxyXG4gICAgaW5pdEltYWdlU2Nyb2xsZXIodGhpcy5jYXJvdXNlbCk7XHJcblxyXG4gICAgdGhpcy50aHVtYm5haWxMaXN0ID0gdGhpcy5jYXJvdXNlbC5xdWVyeVNlbGVjdG9yKCd1bCcpO1xyXG5cclxuICAgIC8vIGFkZCByb290IGVsZW1lbnRcclxuICAgIHRoaXMucm9vdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuY2xhc3NOYW1lID0gJ2NvbnRlbnQtdHlwZS1kZXRhaWwnO1xyXG4gICAgdGhpcy5yb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQoYmFja0J1dHRvbkVsZW1lbnQpO1xyXG4gICAgdGhpcy5yb290RWxlbWVudC5hcHBlbmRDaGlsZChkZXRhaWxzRWxlbWVudCk7XHJcbiAgICB0aGlzLnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKGJ1dHRvbkJhcik7XHJcbiAgICB0aGlzLnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY2Fyb3VzZWwpO1xyXG4gICAgdGhpcy5yb290RWxlbWVudC5hcHBlbmRDaGlsZChwYW5lbEdyb3VwRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgcGFuZWxcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBib2R5XHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGJvZHlJZFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgY3JlYXRlUGFuZWwodGl0bGUsIGJvZHksIGJvZHlJZCkge1xyXG4gICAgY29uc3QgaGVhZGVyRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGhlYWRlckVsLmNsYXNzTmFtZSA9ICdwYW5lbC1oZWFkZXInO1xyXG4gICAgaGVhZGVyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICBoZWFkZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCBib2R5SWQpO1xyXG4gICAgaGVhZGVyRWwuaW5uZXJIVE1MID0gdGl0bGU7XHJcblxyXG4gICAgY29uc3QgYm9keUlubmVyRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGJvZHlJbm5lckVsLmNsYXNzTmFtZSA9ICdwYW5lbC1ib2R5LWlubmVyJztcclxuICAgIGJvZHlJbm5lckVsLmlubmVySFRNTCA9IGJvZHk7XHJcblxyXG4gICAgY29uc3QgYm9keUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBib2R5RWwuY2xhc3NOYW1lID0gJ3BhbmVsLWJvZHknO1xyXG4gICAgYm9keUVsLmlkID0gYm9keUlkO1xyXG4gICAgYm9keUVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgYm9keUVsLmFwcGVuZENoaWxkKGJvZHlJbm5lckVsKTtcclxuXHJcbiAgICBjb25zdCBwYW5lbEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBwYW5lbEVsLmNsYXNzTmFtZSA9ICdwYW5lbCc7XHJcbiAgICBwYW5lbEVsLmFwcGVuZENoaWxkKGhlYWRlckVsKTtcclxuICAgIHBhbmVsRWwuYXBwZW5kQ2hpbGQoYm9keUVsKTtcclxuXHJcbiAgICBpbml0UGFuZWwocGFuZWxFbCk7XHJcblxyXG4gICAgcmV0dXJuIHBhbmVsRWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIGFsbCBpbWFnZXMgZnJvbSB0aGUgY2Fyb3VzZWxcclxuICAgKi9cclxuICByZW1vdmVBbGxJbWFnZXNJbkNhcm91c2VsKCkge1xyXG4gICAgdGhpcy50aHVtYm5haWxMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykuZm9yRWFjaChyZW1vdmVDaGlsZCh0aGlzLnRodW1ibmFpbExpc3QpKTtcclxuICAgIHRoaXMuY2Fyb3VzZWwucXVlcnlTZWxlY3RvckFsbCgnLmNhcm91c2VsLWxpZ2h0Ym94JykuZm9yRWFjaChyZW1vdmVDaGlsZCh0aGlzLmNhcm91c2VsKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGQgaW1hZ2UgdG8gdGhlIGNhcm91c2VsXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge29iamVjdH0gaW1hZ2VcclxuICAgKi9cclxuICBhZGRJbWFnZVRvQ2Fyb3VzZWwoaW1hZ2UpIHtcclxuICAgIC8vIGFkZCBsaWdodGJveFxyXG4gICAgY29uc3QgbGlnaHRib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGxpZ2h0Ym94LmlkID0gYGxpZ2h0Ym94LSR7dGhpcy50aHVtYm5haWxMaXN0LmNoaWxkRWxlbWVudENvdW50fWA7XHJcbiAgICBsaWdodGJveC5jbGFzc05hbWUgPSAnY2Fyb3VzZWwtbGlnaHRib3gnO1xyXG4gICAgbGlnaHRib3guc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICBsaWdodGJveC5pbm5lckhUTUwgPSBgPGltZyBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgc3JjPVwiJHtpbWFnZS51cmx9XCIgYWx0PVwiJHtpbWFnZS5hbHR9XCI+YDtcclxuICAgIHRoaXMuY2Fyb3VzZWwuYXBwZW5kQ2hpbGQobGlnaHRib3gpO1xyXG5cclxuICAgIC8vIGFkZCB0aHVtYm5haWxcclxuICAgIGNvbnN0IHRodW1ibmFpbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICB0aHVtYm5haWwuY2xhc3NOYW1lID0gJ3NsaWRlJztcclxuICAgIHRodW1ibmFpbC5pbm5lckhUTUwgPSBgPGltZyBzcmM9XCIke2ltYWdlLnVybH1cIiBhbHQ9XCIke2ltYWdlLmFsdH1cIiBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgYXJpYS1jb250cm9scz1cIiR7bGlnaHRib3guaWR9XCIgLz5gO1xyXG4gICAgdGhpcy50aHVtYm5haWxMaXN0LmFwcGVuZENoaWxkKHRodW1ibmFpbCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBpbWFnZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNyY1xyXG4gICAqL1xyXG4gIHNldEltYWdlKHNyYykge1xyXG4gICAgdGhpcy5pbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYyB8fCBub0ljb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgdGl0bGVcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxyXG4gICAqL1xyXG4gIHNldElkKGlkKSB7XHJcbiAgICB0aGlzLmluc3RhbGxCdXR0b24uc2V0QXR0cmlidXRlKEFUVFJJQlVURV9DT05URU5UX1RZUEVfSUQsIGlkKTtcclxuICAgIHRoaXMudXNlQnV0dG9uLnNldEF0dHJpYnV0ZShBVFRSSUJVVEVfQ09OVEVOVF9UWVBFX0lELCBpZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSB0aXRsZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlXHJcbiAgICovXHJcbiAgc2V0VGl0bGUodGl0bGUpIHtcclxuICAgIHRoaXMudGl0bGUuaW5uZXJIVE1MID0gdGl0bGU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBsb25nIGRlc2NyaXB0aW9uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxyXG4gICAqL1xyXG4gIHNldERlc2NyaXB0aW9uKHRleHQpIHtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24uaW5uZXJIVE1MID0gdGV4dDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGV4YW1wbGUgdXJsXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXHJcbiAgICovXHJcbiAgc2V0RXhhbXBsZSh1cmwpIHtcclxuICAgIHRoaXMuZGVtb0J1dHRvbi5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwgfHwgJyMnKTtcclxuICAgIHRvZ2dsZVZpc2liaWxpdHkodGhpcy5kZW1vQnV0dG9uLCAhaXNFbXB0eSh1cmwpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgaWYgdGhlIGNvbnRlbnQgdHlwZSBpcyBpbnN0YWxsZWRcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5zdGFsbGVkXHJcbiAgICovXHJcbiAgc2V0SXNJbnN0YWxsZWQoaW5zdGFsbGVkKSB7XHJcbiAgICB0b2dnbGVWaXNpYmlsaXR5KHRoaXMudXNlQnV0dG9uLCBpbnN0YWxsZWQpO1xyXG4gICAgdG9nZ2xlVmlzaWJpbGl0eSh0aGlzLmluc3RhbGxCdXR0b24sICFpbnN0YWxsZWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGlkZXMgdGhlIHJvb3QgZWxlbWVudFxyXG4gICAqL1xyXG4gIGhpZGUoKSB7XHJcbiAgICBoaWRlKHRoaXMucm9vdEVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2hvd3MgdGhlIHJvb3QgZWxlbWVudFxyXG4gICAqL1xyXG4gIHNob3coKSB7XHJcbiAgICBzaG93KHRoaXMucm9vdEVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcm9vdCBodG1sIGVsZW1lbnRcclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICAgKi9cclxuICBnZXRFbGVtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucm9vdEVsZW1lbnQ7XHJcbiAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvY29udGVudC10eXBlLWRldGFpbC9jb250ZW50LXR5cGUtZGV0YWlsLXZpZXcuanMiLCJpbXBvcnQgQ29udGV0VHlwZURldGFpbFZpZXcgZnJvbSBcIi4vY29udGVudC10eXBlLWRldGFpbC12aWV3XCI7XHJcbmltcG9ydCBIdWJTZXJ2aWNlcyBmcm9tIFwiLi4vaHViLXNlcnZpY2VzXCI7XHJcbmltcG9ydCB7IEV2ZW50ZnVsIH0gZnJvbSAnLi4vbWl4aW5zL2V2ZW50ZnVsJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQG1peGVzIEV2ZW50ZnVsXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50VHlwZURldGFpbCB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIC8vIGFkZCBldmVudCBzeXN0ZW1cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgRXZlbnRmdWwoKSk7XHJcblxyXG4gICAgLy8gc2VydmljZXNcclxuICAgIHRoaXMuc2VydmljZXMgPSBuZXcgSHViU2VydmljZXMoe1xyXG4gICAgICBhcGlSb290VXJsOiBzdGF0ZS5hcGlSb290VXJsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyB2aWV3c1xyXG4gICAgdGhpcy52aWV3ID0gbmV3IENvbnRldFR5cGVEZXRhaWxWaWV3KHN0YXRlKTtcclxuICAgIHRoaXMudmlldy5vbignaW5zdGFsbCcsIHRoaXMuaW5zdGFsbCwgdGhpcyk7XHJcblxyXG4gICAgLy8gcHJvcGFnYXRlIGV2ZW50c1xyXG4gICAgdGhpcy5wcm9wYWdhdGUoWydjbG9zZScsICdzZWxlY3QnXSwgdGhpcy52aWV3KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhpZGVzIHRoZSBkZXRhaWwgdmlld1xyXG4gICAqL1xyXG4gIGhpZGUoKSB7XHJcbiAgICB0aGlzLnZpZXcuaGlkZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2hvd3MgdGhlIGRldGFpbCB2aWV3XHJcbiAgICovXHJcbiAgc2hvdygpIHtcclxuICAgIHRoaXMudmlldy5zaG93KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMb2FkcyBhIENvbnRlbnQgVHlwZSBkZXNjcmlwdGlvblxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxDb250ZW50VHlwZT59XHJcbiAgICovXHJcbiAgbG9hZEJ5SWQoaWQpIHtcclxuICAgIHRoaXMuc2VydmljZXMuY29udGVudFR5cGUoaWQpXHJcbiAgICAgIC50aGVuKHRoaXMudXBkYXRlLmJpbmQodGhpcykpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMb2FkcyBhIENvbnRlbnQgVHlwZSBkZXNjcmlwdGlvblxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxDb250ZW50VHlwZT59XHJcbiAgICovXHJcbiAgIGluc3RhbGwoe2lkfSkge1xyXG4gICAgIHJldHVybiB0aGlzLnNlcnZpY2VzLmNvbnRlbnRUeXBlKGlkKVxyXG4gICAgICAgLnRoZW4oY29udGVudFR5cGUgPT4gY29udGVudFR5cGUubWFjaGluZU5hbWUpXHJcbiAgICAgICAudGhlbihtYWNoaW5lTmFtZSA9PiB0aGlzLnNlcnZpY2VzLmluc3RhbGxDb250ZW50VHlwZShtYWNoaW5lTmFtZSkpXHJcbiAgICAgICAudGhlbihjb250ZW50VHlwZSA9PiBjb25zb2xlLmRlYnVnKCdUT0RPLCBndWkgdXBkYXRlcycpKVxyXG4gICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZXMgdGhlIHZpZXcgd2l0aCB0aGUgY29udGVudCB0eXBlIGRhdGFcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Q29udGVudFR5cGV9IGNvbnRlbnRUeXBlXHJcbiAgICovXHJcbiAgdXBkYXRlKGNvbnRlbnRUeXBlKSB7XHJcbiAgICB0aGlzLnZpZXcuc2V0SWQoY29udGVudFR5cGUubWFjaGluZU5hbWUpO1xyXG4gICAgdGhpcy52aWV3LnNldFRpdGxlKGNvbnRlbnRUeXBlLnRpdGxlKTtcclxuICAgIHRoaXMudmlldy5zZXREZXNjcmlwdGlvbihjb250ZW50VHlwZS5kZXNjcmlwdGlvbik7XHJcbiAgICB0aGlzLnZpZXcuc2V0SW1hZ2UoY29udGVudFR5cGUuaWNvbik7XHJcbiAgICB0aGlzLnZpZXcuc2V0RXhhbXBsZShjb250ZW50VHlwZS5leGFtcGxlKTtcclxuICAgIHRoaXMudmlldy5zZXRJc0luc3RhbGxlZCghIWNvbnRlbnRUeXBlLmluc3RhbGxlZCk7XHJcblxyXG4gICAgLy8gdXBkYXRlIGNhcm91c2VsXHJcbiAgICB0aGlzLnZpZXcucmVtb3ZlQWxsSW1hZ2VzSW5DYXJvdXNlbCgpO1xyXG4gICAgY29udGVudFR5cGUuc2NyZWVuc2hvdHMuZm9yRWFjaCh0aGlzLnZpZXcuYWRkSW1hZ2VUb0Nhcm91c2VsLCB0aGlzLnZpZXcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcm9vdCBodG1sIGVsZW1lbnRcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAqL1xyXG4gIGdldEVsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy52aWV3LmdldEVsZW1lbnQoKTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvY29udGVudC10eXBlLWRldGFpbC9jb250ZW50LXR5cGUtZGV0YWlsLmpzIiwiaW1wb3J0IHsgY3VycnkgfSBmcm9tIFwidXRpbHMvZnVuY3Rpb25hbFwiO1xyXG5pbXBvcnQgeyBzZXRBdHRyaWJ1dGUsIGdldEF0dHJpYnV0ZSwgcmVtb3ZlQ2hpbGQgfSBmcm9tIFwidXRpbHMvZWxlbWVudHNcIjtcclxuaW1wb3J0IHsgRXZlbnRmdWwgfSBmcm9tICcuLi9taXhpbnMvZXZlbnRmdWwnO1xyXG5pbXBvcnQgeyByZWxheUNsaWNrRXZlbnRBcyB9IGZyb20gJy4uL3V0aWxzL2V2ZW50cyc7XHJcbmltcG9ydCBub0ljb24gZnJvbSAnLi4vLi4vaW1hZ2VzL2NvbnRlbnQtdHlwZS1wbGFjZWhvbGRlci5zdmcnO1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuY29uc3QgaGlkZSA9IHNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuY29uc3Qgc2hvdyA9IHNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQG1peGVzIEV2ZW50ZnVsXHJcbiAqIEBmaXJlcyBIdWIjc2VsZWN0XHJcbiAqIEBmaXJlcyBDb250ZW50VHlwZUxpc3Qjcm93LXNlbGVjdGVkXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50VHlwZUxpc3RWaWV3IHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG5cclxuICAgIC8vIGFkZCBldmVudCBzeXN0ZW1cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgRXZlbnRmdWwoKSk7XHJcblxyXG4gICAgLy8gY3JlYXRlIHJvb3QgZWxlbWVudFxyXG4gICAgdGhpcy5yb290RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XHJcbiAgICB0aGlzLnJvb3RFbGVtZW50LmNsYXNzTmFtZSA9ICdjb250ZW50LXR5cGUtbGlzdCc7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIaWRlcyB0aGUgcm9vdCBlbGVtZW50XHJcbiAgICovXHJcbiAgaGlkZSgpIHtcclxuICAgIGhpZGUodGhpcy5yb290RWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaG93cyB0aGUgcm9vdCBlbGVtZW50XHJcbiAgICovXHJcbiAgc2hvdygpIHtcclxuICAgIHNob3codGhpcy5yb290RWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIGFsbCByb3dzIGZyb20gcm9vdCBlbGVtZW50XHJcbiAgICovXHJcbiAgcmVtb3ZlQWxsUm93cygpIHtcclxuICAgIHdoaWxlKHRoaXMucm9vdEVsZW1lbnQuaGFzQ2hpbGROb2RlcygpICl7XHJcbiAgICAgIHRoaXMucm9vdEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5yb290RWxlbWVudC5sYXN0Q2hpbGQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkcyBhIHJvd1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHtDb250ZW50VHlwZX0gY29udGVudFR5cGVcclxuICAgKi9cclxuICBhZGRSb3coY29udGVudFR5cGUpIHtcclxuICAgIGNvbnN0IHJvdyA9IHRoaXMuY3JlYXRlQ29udGVudFR5cGVSb3coY29udGVudFR5cGUsIHRoaXMpO1xyXG4gICAgcmVsYXlDbGlja0V2ZW50QXMoJ3Jvdy1zZWxlY3RlZCcsIHRoaXMsIHJvdyk7XHJcbiAgICB0aGlzLnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKHJvdylcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2VzIGEgQ29udGVudCBUeXBlIGNvbmZpZ3VyYXRpb24gYW5kIGNyZWF0ZXMgYSByb3cgZG9tXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0NvbnRlbnRUeXBlfSBjb250ZW50VHlwZVxyXG4gICAqIEBwYXJhbSB7RXZlbnRmdWx9IHNjb3BlXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICAgKi9cclxuICBjcmVhdGVDb250ZW50VHlwZVJvdyhjb250ZW50VHlwZSwgc2NvcGUpIHtcclxuICAgIC8vIHJvdyBpdGVtXHJcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgIGVsZW1lbnQuaWQgPSBgY29udGVudC10eXBlLSR7Y29udGVudFR5cGUubWFjaGluZU5hbWV9YDtcclxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgY29udGVudFR5cGUubWFjaGluZU5hbWUpO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBidXR0b24gY29uZmlnXHJcbiAgICBjb25zdCB1c2VCdXR0b25Db25maWcgPSB7IHRleHQ6ICdVc2UnLCBjbHM6ICdidXR0b24tcHJpbWFyeScgfTtcclxuICAgIGNvbnN0IGluc3RhbGxCdXR0b25Db25maWcgPSB7IHRleHQ6ICdpbnN0YWxsJywgY2xzOiAnYnV0dG9uLWludmVyc2UtcHJpbWFyeSd9O1xyXG4gICAgY29uc3QgYnV0dG9uID0gY29udGVudFR5cGUuaW5zdGFsbGVkID8gIHVzZUJ1dHRvbkNvbmZpZzogaW5zdGFsbEJ1dHRvbkNvbmZpZztcclxuXHJcbiAgICBjb25zdCB0aXRsZSA9IGNvbnRlbnRUeXBlLnRpdGxlIHx8IGNvbnRlbnRUeXBlLm1hY2hpbmVOYW1lO1xyXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBjb250ZW50VHlwZS5zdW1tYXJ5IHx8ICcnO1xyXG5cclxuICAgIGNvbnN0IGltYWdlID0gY29udGVudFR5cGUuaWNvbiB8fCBub0ljb247XHJcblxyXG4gICAgLy8gY3JlYXRlIGh0bWxcclxuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gYFxyXG4gICAgICA8aW1nIGNsYXNzPVwiaW1nLXJlc3BvbnNpdmVcIiBzcmM9XCIke2ltYWdlfVwiPlxyXG4gICAgICA8c3BhbiBjbGFzcz1cImJ1dHRvbiAke2J1dHRvbi5jbHN9XCIgZGF0YS1pZD1cIiR7Y29udGVudFR5cGUubWFjaGluZU5hbWV9XCIgdGFiaW5kZXg9XCIwXCI+JHtidXR0b24udGV4dH08L3NwYW4+XHJcbiAgICAgIDxoND4ke3RpdGxlfTwvaDQ+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJkZXNjcmlwdGlvblwiPiR7ZGVzY3JpcHRpb259PC9kaXY+XHJcbiAgIGA7XHJcblxyXG4gICAgLy8gaGFuZGxlIHVzZSBidXR0b25cclxuICAgIGNvbnN0IHVzZUJ1dHRvbiA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1dHRvbi1wcmltYXJ5Jyk7XHJcbiAgICBpZih1c2VCdXR0b24pe1xyXG4gICAgICByZWxheUNsaWNrRXZlbnRBcygnc2VsZWN0Jywgc2NvcGUsIHVzZUJ1dHRvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSByb290IGVsZW1lbnRcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAqL1xyXG4gIGdldEVsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yb290RWxlbWVudDtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvY29udGVudC10eXBlLWxpc3QvY29udGVudC10eXBlLWxpc3Qtdmlldy5qcyIsImltcG9ydCBDb250ZXRUeXBlTGlzdFZpZXcgZnJvbSBcIi4vY29udGVudC10eXBlLWxpc3Qtdmlld1wiO1xyXG5pbXBvcnQge0V2ZW50ZnVsfSBmcm9tICcuLi9taXhpbnMvZXZlbnRmdWwnO1xyXG5cclxuLyoqXHJcbiAqIFJvdyBzZWxlY3RlZCBldmVudFxyXG4gKiBAZXZlbnQgQ29udGVudFR5cGVMaXN0I3Jvdy1zZWxlY3RlZFxyXG4gKiBAdHlwZSB7U2VsZWN0ZWRFbGVtZW50fVxyXG4gKi9cclxuLyoqXHJcbiAqIFVwZGF0ZSBjb250ZW50IHR5cGUgbGlzdCBldmVudFxyXG4gKiBAZXZlbnQgQ29udGVudFR5cGVMaXN0I3VwZGF0ZS1jb250ZW50LXR5cGUtbGlzdFxyXG4gKiBAdHlwZSB7U2VsZWN0ZWRFbGVtZW50fVxyXG4gKi9cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBAbWl4ZXMgRXZlbnRmdWxcclxuICogQGZpcmVzIEh1YiNzZWxlY3RcclxuICogQGZpcmVzIENvbnRlbnRUeXBlTGlzdCNyb3ctc2VsZWN0ZWRcclxuICogQGZpcmVzIENvbnRlbnRUeXBlTGlzdCN1cGRhdGUtY29udGVudC10eXBlLWxpc3RcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRUeXBlTGlzdCB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIC8vIGFkZCBldmVudCBzeXN0ZW1cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgRXZlbnRmdWwoKSk7XHJcblxyXG4gICAgLy8gYWRkIHRoZSB2aWV3XHJcbiAgICB0aGlzLnZpZXcgPSBuZXcgQ29udGV0VHlwZUxpc3RWaWV3KHN0YXRlKTtcclxuICAgIHRoaXMucHJvcGFnYXRlKFsncm93LXNlbGVjdGVkJywgJ3NlbGVjdCddLCB0aGlzLnZpZXcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGlkZSB0aGlzIGVsZW1lbnRcclxuICAgKi9cclxuICBoaWRlKCkge1xyXG4gICAgdGhpcy52aWV3LmhpZGUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNob3cgdGhpcyBlbGVtZW50XHJcbiAgICovXHJcbiAgc2hvdygpIHtcclxuICAgIHRoaXMudmlldy5zaG93KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgdGhlIGxpc3Qgd2l0aCBuZXcgY29udGVudCB0eXBlc1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHtDb250ZW50VHlwZVtdfSBjb250ZW50VHlwZXNcclxuICAgKi9cclxuICB1cGRhdGUoY29udGVudFR5cGVzKSB7XHJcbiAgICB0aGlzLnZpZXcucmVtb3ZlQWxsUm93cygpO1xyXG4gICAgY29udGVudFR5cGVzLmZvckVhY2godGhpcy52aWV3LmFkZFJvdywgdGhpcy52aWV3KTtcclxuICAgIHRoaXMuZmlyZSgndXBkYXRlLWNvbnRlbnQtdHlwZS1saXN0Jywge30pO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHZpZXdzIHJvb3QgZWxlbWVudFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLnZpZXcuZ2V0RWxlbWVudCgpO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9jb250ZW50LXR5cGUtbGlzdC9jb250ZW50LXR5cGUtbGlzdC5qcyIsImltcG9ydCB7RXZlbnRmdWx9IGZyb20gJy4uL21peGlucy9ldmVudGZ1bCc7XHJcblxyXG4vKipcclxuICogQGNsYXNzIENvbnRlbnRCcm93c2VyVmlld1xyXG4gKiBAbWl4ZXMgRXZlbnRmdWxcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRCcm93c2VyVmlldyB7XHJcbiAgLyoqXHJcbiAgICogQGNvbnN0cnVjdG9yXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IHN0YXRlXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIC8vIGFkZCBldmVudCBzeXN0ZW1cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgRXZlbnRmdWwoKSk7XHJcblxyXG4gICAgLy8gY3JlYXRlIGVsZW1lbnRzXHJcbiAgICBjb25zdCBtZW51ID0gdGhpcy5jcmVhdGVNZW51RWxlbWVudCgpO1xyXG4gICAgY29uc3QgaW5wdXRHcm91cCA9IHRoaXMuY3JlYXRlSW5wdXRHcm91cEVsZW1lbnQoKTtcclxuXHJcbiAgICAvLyBtZW51IGdyb3VwXHJcbiAgICBjb25zdCBtZW51R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIG1lbnVHcm91cC5jbGFzc05hbWUgPSAnbWVudS1ncm91cCc7XHJcbiAgICBtZW51R3JvdXAuYXBwZW5kQ2hpbGQobWVudSk7XHJcbiAgICBtZW51R3JvdXAuYXBwZW5kQ2hpbGQoaW5wdXRHcm91cCk7XHJcblxyXG4gICAgLy8gcm9vdCBlbGVtZW50XHJcbiAgICB0aGlzLnJvb3RFbGVtZW50ICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGhpcy5yb290RWxlbWVudC5hcHBlbmRDaGlsZChtZW51R3JvdXApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkcyBhIG1lbnUgaXRlbVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAqL1xyXG4gIGFkZE1lbnVJdGVtKHRleHQpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnbWVudWl0ZW0nKTtcclxuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGV4dDtcclxuXHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICB0aGlzLmZpcmUoJ21lbnUtc2VsZWN0ZWQnLCB7XHJcbiAgICAgICAgZWxlbWVudDogZXZlbnQudGFyZ2V0XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gc2V0cyBmaXJzdCB0byBiZSBzZWxlY3RlZFxyXG4gICAgaWYodGhpcy5tZW51QmFyRWxlbWVudC5jaGlsZEVsZW1lbnRDb3VudCA8IDEpIHtcclxuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGFkZCB0byBtZW51IGJhclxyXG4gICAgdGhpcy5tZW51QmFyRWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuXHJcbiAgICByZXR1cm4gZWxlbWVudDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgdGhlIG1lbnUgYmFyIGVsZW1lbnRcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICovXHJcbiAgY3JlYXRlTWVudUVsZW1lbnQoKSB7XHJcbiAgICB0aGlzLm1lbnVCYXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcclxuICAgIHRoaXMubWVudUJhckVsZW1lbnQuc2V0QXR0cmlidXRlKCdyb2xlJywgJ21lbnViYXInKTtcclxuICAgIHRoaXMubWVudUJhckVsZW1lbnQuY2xhc3NOYW1lID0gJ2g1cC1tZW51JztcclxuXHJcbiAgICBjb25zdCBuYXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbmF2Jyk7XHJcbiAgICBuYXZFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWVudUJhckVsZW1lbnQpO1xyXG5cclxuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0aXRsZS5jbGFzc05hbWUgPSBcIm1lbnUtdGl0bGVcIjtcclxuICAgIHRpdGxlLmlubmVySFRNTCA9IFwiQnJvd3NlIGNvbnRlbnQgdHlwZXNcIjtcclxuXHJcbiAgICBjb25zdCBtZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBtZW51LmNsYXNzTmFtZSA9IFwibWVudVwiO1xyXG4gICAgbWVudS5hcHBlbmRDaGlsZCh0aXRsZSk7XHJcbiAgICBtZW51LmFwcGVuZENoaWxkKG5hdkVsZW1lbnQpO1xyXG5cclxuICAgIHJldHVybiBtZW51O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyB0aGUgaW5wdXQgZ3JvdXAgdXNlZCBmb3Igc2VhcmNoXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICAgKi9cclxuICBjcmVhdGVJbnB1dEdyb3VwRWxlbWVudCgpIHtcclxuICAgIC8vIGlucHV0IGZpZWxkXHJcbiAgICBjb25zdCBpbnB1dEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgIGlucHV0RmllbGQuaWQgPSBcImh1Yi1zZWFyY2gtYmFyXCI7XHJcbiAgICBpbnB1dEZpZWxkLmNsYXNzTmFtZSA9ICdmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLXJvdW5kZWQnO1xyXG4gICAgaW5wdXRGaWVsZC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xyXG4gICAgaW5wdXRGaWVsZC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgXCJTZWFyY2ggZm9yIENvbnRlbnQgVHlwZXNcIik7XHJcbiAgICBpbnB1dEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZXZlbnQgPT4ge1xyXG4gICAgICB0aGlzLmZpcmUoJ3NlYXJjaCcsIHtcclxuICAgICAgICBlbGVtZW50OiBldmVudC50YXJnZXQsXHJcbiAgICAgICAgcXVlcnk6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGlucHV0IGJ1dHRvblxyXG4gICAgY29uc3QgaW5wdXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGlucHV0QnV0dG9uLmNsYXNzTmFtZSA9ICdpbnB1dC1ncm91cC1hZGRvbiBpY29uLXNlYXJjaCc7XHJcbiAgICBpbnB1dEJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjc2VhcmNoLWJhcicpLmZvY3VzKClcclxuICAgIH07XHJcblxyXG4gICAgLy8gaW5wdXQgZ3JvdXBcclxuICAgIGNvbnN0IGlucHV0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGlucHV0R3JvdXAuY2xhc3NOYW1lID0gJ2lucHV0LWdyb3VwJztcclxuICAgIGlucHV0R3JvdXAuYXBwZW5kQ2hpbGQoaW5wdXRGaWVsZCk7XHJcbiAgICBpbnB1dEdyb3VwLmFwcGVuZENoaWxkKGlucHV0QnV0dG9uKTtcclxuXHJcbiAgICByZXR1cm4gaW5wdXRHcm91cDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHJvb3QgZWxlbWVudCBvZiB0aGUgY29udGVudCBicm93c2VyXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICAgKi9cclxuICBnZXRFbGVtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucm9vdEVsZW1lbnQ7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1zZWN0aW9uL2NvbnRlbnQtdHlwZS1zZWN0aW9uLXZpZXcuanMiLCJpbXBvcnQgQ29udGVudFR5cGVTZWN0aW9uVmlldyBmcm9tIFwiLi9jb250ZW50LXR5cGUtc2VjdGlvbi12aWV3XCI7XHJcbmltcG9ydCBTZWFyY2hTZXJ2aWNlIGZyb20gXCIuLi9zZWFyY2gtc2VydmljZS9zZWFyY2gtc2VydmljZVwiO1xyXG5pbXBvcnQgQ29udGVudFR5cGVMaXN0IGZyb20gJy4uL2NvbnRlbnQtdHlwZS1saXN0L2NvbnRlbnQtdHlwZS1saXN0JztcclxuaW1wb3J0IENvbnRlbnRUeXBlRGV0YWlsIGZyb20gJy4uL2NvbnRlbnQtdHlwZS1kZXRhaWwvY29udGVudC10eXBlLWRldGFpbCc7XHJcbmltcG9ydCB7RXZlbnRmdWx9IGZyb20gJy4uL21peGlucy9ldmVudGZ1bCc7XHJcbmltcG9ydCB7cmVuZGVyRXJyb3JNZXNzYWdlfSBmcm9tICcuLi91dGlscy9lcnJvcnMnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBDb250ZW50VHlwZVNlY3Rpb25cclxuICogQG1peGVzIEV2ZW50ZnVsXHJcbiAqXHJcbiAqIEBmaXJlcyBIdWIjc2VsZWN0XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50VHlwZVNlY3Rpb24ge1xyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7SHViU3RhdGV9IHN0YXRlXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIC8vIGFkZCBldmVudCBzeXN0ZW1cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgRXZlbnRmdWwoKSk7XHJcblxyXG4gICAgLy8gYWRkIHZpZXdcclxuICAgIHRoaXMudmlldyA9IG5ldyBDb250ZW50VHlwZVNlY3Rpb25WaWV3KHN0YXRlKTtcclxuXHJcbiAgICAvLyBjb250cm9sbGVyXHJcbiAgICB0aGlzLnNlYXJjaFNlcnZpY2UgPSBuZXcgU2VhcmNoU2VydmljZSh7IGFwaVJvb3RVcmw6IHN0YXRlLmFwaVJvb3RVcmwgfSk7XHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlTGlzdCA9IG5ldyBDb250ZW50VHlwZUxpc3QoKTtcclxuICAgIHRoaXMuY29udGVudFR5cGVEZXRhaWwgPSBuZXcgQ29udGVudFR5cGVEZXRhaWwoeyBhcGlSb290VXJsOiBzdGF0ZS5hcGlSb290VXJsIH0pO1xyXG5cclxuICAgIC8vIGFkZCBtZW51IGl0ZW1zXHJcbiAgICBbJ015IENvbnRlbnQgVHlwZXMnLCAnTmV3ZXN0JywgJ01vc3QgUG9wdWxhcicsICdSZWNvbW1lbmRlZCddXHJcbiAgICAgIC5mb3JFYWNoKG1lbnVUZXh0ID0+IHRoaXMudmlldy5hZGRNZW51SXRlbShtZW51VGV4dCkpO1xyXG5cclxuICAgIC8vIEVsZW1lbnQgZm9yIGhvbGRpbmcgbGlzdCBhbmQgZGV0YWlscyB2aWV3c1xyXG4gICAgY29uc3Qgc2VjdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCdjb250ZW50LXR5cGUtc2VjdGlvbicpO1xyXG5cclxuICAgIHRoaXMucm9vdEVsZW1lbnQgPSBzZWN0aW9uO1xyXG4gICAgdGhpcy5yb290RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnRUeXBlTGlzdC5nZXRFbGVtZW50KCkpO1xyXG4gICAgdGhpcy5yb290RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnRUeXBlRGV0YWlsLmdldEVsZW1lbnQoKSk7XHJcblxyXG4gICAgdGhpcy52aWV3LmdldEVsZW1lbnQoKS5hcHBlbmRDaGlsZCh0aGlzLnJvb3RFbGVtZW50KTtcclxuXHJcbiAgICAvLyBwcm9wYWdhdGUgZXZlbnRzXHJcbiAgICB0aGlzLnByb3BhZ2F0ZShbJ3NlbGVjdCcsICd1cGRhdGUtY29udGVudC10eXBlLWxpc3QnXSwgdGhpcy5jb250ZW50VHlwZUxpc3QpO1xyXG4gICAgdGhpcy5wcm9wYWdhdGUoWydzZWxlY3QnXSwgdGhpcy5jb250ZW50VHlwZURldGFpbCk7XHJcblxyXG4gICAgLy8gcmVnaXN0ZXIgbGlzdGVuZXJzXHJcbiAgICB0aGlzLnZpZXcub24oJ3NlYXJjaCcsIHRoaXMuc2VhcmNoLCB0aGlzKTtcclxuICAgIHRoaXMudmlldy5vbignbWVudS1zZWxlY3RlZCcsIHRoaXMuYXBwbHlTZWFyY2hGaWx0ZXIsIHRoaXMpO1xyXG4gICAgdGhpcy5jb250ZW50VHlwZUxpc3Qub24oJ3Jvdy1zZWxlY3RlZCcsIHRoaXMuc2hvd0RldGFpbFZpZXcsIHRoaXMpO1xyXG4gICAgdGhpcy5jb250ZW50VHlwZURldGFpbC5vbignY2xvc2UnLCB0aGlzLmNsb3NlRGV0YWlsVmlldywgdGhpcyk7XHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlRGV0YWlsLm9uKCdzZWxlY3QnLCB0aGlzLmNsb3NlRGV0YWlsVmlldywgdGhpcyk7XHJcblxyXG4gICAgdGhpcy5pbml0Q29udGVudFR5cGVMaXN0KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbml0aWF0ZXMgdGhlIGNvbnRlbnQgdHlwZSBsaXN0IHdpdGggYSBzZWFyY2hcclxuICAgKi9cclxuICBpbml0Q29udGVudFR5cGVMaXN0KCkge1xyXG4gICAgLy8gaW5pdGlhbGl6ZSBieSBzZWFyY2hcclxuICAgIHRoaXMuc2VhcmNoU2VydmljZS5zZWFyY2goXCJcIilcclxuICAgICAgLnRoZW4oY29udGVudFR5cGVzID0+IHRoaXMuY29udGVudFR5cGVMaXN0LnVwZGF0ZShjb250ZW50VHlwZXMpKVxyXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gdGhpcy5maXJlKCdlcnJvcicsIGVycm9yKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeGVjdXRlcyBhIHNlYXJjaCBhbmQgdXBkYXRlcyB0aGUgY29udGVudCB0eXBlIGxpc3RcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBxdWVyeVxyXG4gICAqL1xyXG4gIHNlYXJjaCh7cXVlcnl9KSB7XHJcbiAgICB0aGlzLnNlYXJjaFNlcnZpY2Uuc2VhcmNoKHF1ZXJ5KVxyXG4gICAgICAudGhlbihjb250ZW50VHlwZXMgPT4gdGhpcy5jb250ZW50VHlwZUxpc3QudXBkYXRlKGNvbnRlbnRUeXBlcykpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2hvdWxkIGFwcGx5IGEgc2VhcmNoIGZpbHRlclxyXG4gICAqL1xyXG4gIGFwcGx5U2VhcmNoRmlsdGVyKCkge1xyXG4gICAgY29uc29sZS5kZWJ1ZygnQ29udGVudFR5cGVTZWN0aW9uOiBtZW51IHdhcyBjbGlja2VkIScsIGV2ZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNob3dzIGRldGFpbCB2aWV3XHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcclxuICAgKi9cclxuICBzaG93RGV0YWlsVmlldyh7aWR9KSB7XHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlTGlzdC5oaWRlKCk7XHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlRGV0YWlsLmxvYWRCeUlkKGlkKTtcclxuICAgIHRoaXMuY29udGVudFR5cGVEZXRhaWwuc2hvdygpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIENsb3NlIGRldGFpbCB2aWV3XHJcbiAgICovXHJcbiAgY2xvc2VEZXRhaWxWaWV3KCkge1xyXG4gICAgdGhpcy5jb250ZW50VHlwZURldGFpbC5oaWRlKCk7XHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlTGlzdC5zaG93KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBlbGVtZW50XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICAgKi9cclxuICBnZXRFbGVtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmlldy5nZXRFbGVtZW50KCk7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1zZWN0aW9uL2NvbnRlbnQtdHlwZS1zZWN0aW9uLmpzIiwiaW1wb3J0IGluaXRQYW5lbCBmcm9tIFwiY29tcG9uZW50cy9wYW5lbFwiXHJcbmltcG9ydCBpbml0VGFiUGFuZWwgZnJvbSBcImNvbXBvbmVudHMvdGFiLXBhbmVsXCJcclxuaW1wb3J0IHsgY3VycnkgfSBmcm9tIFwidXRpbHMvZnVuY3Rpb25hbFwiO1xyXG5pbXBvcnQgeyBhdHRyaWJ1dGVFcXVhbHMsIGdldEF0dHJpYnV0ZSwgaGFzQXR0cmlidXRlIH0gZnJvbSBcInV0aWxzL2VsZW1lbnRzXCI7XHJcbmltcG9ydCB7IEV2ZW50ZnVsIH0gZnJvbSAnLi9taXhpbnMvZXZlbnRmdWwnO1xyXG5pbXBvcnQgeyByZWxheUNsaWNrRXZlbnRBcyB9IGZyb20gJy4vdXRpbHMvZXZlbnRzJztcclxuLyoqXHJcbiAqIFRhYiBjaGFuZ2UgZXZlbnRcclxuICogQGV2ZW50IEh1YlZpZXcjdGFiLWNoYW5nZVxyXG4gKiBAdHlwZSB7U2VsZWN0ZWRFbGVtZW50fVxyXG4gKi9cclxuLyoqXHJcbiAqIFBhbmVsIG9wZW4gb3IgY2xvc2UgZXZlbnRcclxuICogQGV2ZW50IEh1YlZpZXcjcGFuZWwtY2hhbmdlXHJcbiAqIEB0eXBlIHtTZWxlY3RlZEVsZW1lbnR9XHJcbiAqL1xyXG4vKipcclxuICogQGNvbnN0YW50IHtzdHJpbmd9XHJcbiAqL1xyXG5jb25zdCBBVFRSSUJVVEVfREFUQV9JRCA9ICdkYXRhLWlkJztcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICovXHJcbmNvbnN0IGlzT3BlbiA9IGhhc0F0dHJpYnV0ZSgnb3BlbicpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBAbWl4ZXMgRXZlbnRmdWxcclxuICogQGZpcmVzIEh1YlZpZXcjdGFiLWNoYW5nZVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHViVmlldyB7XHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtIdWJTdGF0ZX0gc3RhdGVcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgLy8gYWRkIGV2ZW50IHN5c3RlbVxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBFdmVudGZ1bCgpKTtcclxuXHJcbiAgICB0aGlzLnJlbmRlclRhYlBhbmVsKHN0YXRlKTtcclxuICAgIHRoaXMucmVuZGVyUGFuZWwoc3RhdGUpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2xvc2VzIHRoZSBwYW5lbFxyXG4gICAqL1xyXG4gIGNsb3NlUGFuZWwoKSB7XHJcbiAgICB0aGlzLnRpdGxlLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSB0aXRsZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlXHJcbiAgICovXHJcbiAgc2V0VGl0bGUodGl0bGUpIHtcclxuICAgIHRoaXMudGl0bGUuaW5uZXJIVE1MID0gdGl0bGU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIHRoZSBkb20gZm9yIHRoZSBwYW5lbFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3Rpb25JZFxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZXhwYW5kZWRcclxuICAgKi9cclxuICByZW5kZXJQYW5lbCh7dGl0bGUgPSAnJywgc2VjdGlvbklkID0gJ2NvbnRlbnQtdHlwZXMnLCBleHBhbmRlZCA9IGZhbHNlfSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMudGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMudGl0bGUuY2xhc3NOYW1lICs9IFwicGFuZWwtaGVhZGVyIGljb24taHViLWljb25cIjtcclxuICAgIHRoaXMudGl0bGUuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgKCEhZXhwYW5kZWQpLnRvU3RyaW5nKCkpO1xyXG4gICAgdGhpcy50aXRsZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCBgcGFuZWwtYm9keS0ke3NlY3Rpb25JZH1gKTtcclxuICAgIHRoaXMudGl0bGUuaW5uZXJIVE1MID0gdGl0bGU7XHJcbiAgICByZWxheUNsaWNrRXZlbnRBcygncGFuZWwtY2hhbmdlJywgdGhpcywgdGhpcy50aXRsZSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGhpcy5ib2R5LmNsYXNzTmFtZSArPSBcInBhbmVsLWJvZHlcIjtcclxuICAgIHRoaXMuYm9keS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgKCFleHBhbmRlZCkudG9TdHJpbmcoKSk7XHJcbiAgICB0aGlzLmJvZHkuaWQgPSBgcGFuZWwtYm9keS0ke3NlY3Rpb25JZH1gO1xyXG4gICAgdGhpcy5ib2R5LmFwcGVuZENoaWxkKHRoaXMudGFiQ29udGFpbmVyRWxlbWVudCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMucGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMucGFuZWwuY2xhc3NOYW1lICs9IGBwYW5lbCBoNXAtc2VjdGlvbi0ke3NlY3Rpb25JZH1gO1xyXG4gICAgaWYoZXhwYW5kZWQpe1xyXG4gICAgICB0aGlzLnBhbmVsLnNldEF0dHJpYnV0ZSgnb3BlbicsICcnKTtcclxuICAgIH1cclxuICAgIHRoaXMucGFuZWwuYXBwZW5kQ2hpbGQodGhpcy50aXRsZSk7XHJcbiAgICB0aGlzLnBhbmVsLmFwcGVuZENoaWxkKHRoaXMuYm9keSk7XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5yb290RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGhpcy5yb290RWxlbWVudC5jbGFzc05hbWUgKz0gYGg1cCBoNXAtaHViYDtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5wYW5lbCk7XHJcbiAgICBpbml0UGFuZWwodGhpcy5yb290RWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgaWYgcGFuZWwgaXMgb3BlbiwgdGhpcyBpcyB1c2VkIGZvciBvdXRlciBib3JkZXIgY29sb3JcclxuICAgKi9cclxuICB0b2dnbGVQYW5lbE9wZW4oKSB7XHJcbiAgICBsZXQgcGFuZWwgPSB0aGlzLnBhbmVsO1xyXG4gICAgaWYoaXNPcGVuKHBhbmVsKSkge1xyXG4gICAgICBwYW5lbC5yZW1vdmVBdHRyaWJ1dGUoJ29wZW4nKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBwYW5lbC5zZXRBdHRyaWJ1dGUoJ29wZW4nLCAnJyk7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtwYW5lbC5xdWVyeVNlbGVjdG9yKCcjaHViLXNlYXJjaC1iYXInKS5mb2N1cygpfSwyMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIHRoZSBkb20gZm9yIHRoZSB0YWIgcGFuZWxcclxuICAgKi9cclxuICByZW5kZXJUYWJQYW5lbChzdGF0ZSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMudGFibGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XHJcbiAgICB0aGlzLnRhYmxpc3QuY2xhc3NOYW1lICs9IFwidGFibGlzdFwiO1xyXG4gICAgdGhpcy50YWJsaXN0LnNldEF0dHJpYnV0ZSAoJ3JvbGUnLCAndGFibGlzdCcpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLnRhYkxpc3RXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbmF2Jyk7XHJcbiAgICB0aGlzLnRhYkxpc3RXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMudGFibGlzdCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMudGFiQ29udGFpbmVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGhpcy50YWJDb250YWluZXJFbGVtZW50LmNsYXNzTmFtZSArPSAndGFiLXBhbmVsJztcclxuICAgIHRoaXMudGFiQ29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnRhYkxpc3RXcmFwcGVyKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZHMgYSB0YWJcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRlbnRcclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNlbGVjdGVkXHJcbiAgICovXHJcbiAgYWRkVGFiKHt0aXRsZSwgaWQsIGNvbnRlbnQsIHNlbGVjdGVkID0gZmFsc2V9KSB7XHJcbiAgICBjb25zdCB0YWJJZCA9IGB0YWItJHtpZH1gO1xyXG4gICAgY29uc3QgdGFiUGFuZWxJZCA9IGB0YWItcGFuZWwtJHtpZH1gO1xyXG5cclxuICAgIGNvbnN0IHRhYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICB0YWIuY2xhc3NOYW1lICs9ICd0YWInO1xyXG4gICAgdGFiLmlkID0gdGFiSWQ7XHJcbiAgICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgdGFiUGFuZWxJZCk7XHJcbiAgICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgc2VsZWN0ZWQudG9TdHJpbmcoKSk7XHJcbiAgICB0YWIuc2V0QXR0cmlidXRlKEFUVFJJQlVURV9EQVRBX0lELCBpZCk7XHJcbiAgICB0YWIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYicpO1xyXG4gICAgdGFiLmlubmVySFRNTCA9IHRpdGxlO1xyXG4gICAgcmVsYXlDbGlja0V2ZW50QXMoJ3RhYi1jaGFuZ2UnLCB0aGlzLCB0YWIpO1xyXG5cclxuICAgIGNvbnN0IHRhYlBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0YWJQYW5lbC5pZCA9IHRhYlBhbmVsSWQ7XHJcbiAgICB0YWJQYW5lbC5jbGFzc05hbWUgKz0gJ3RhYnBhbmVsJztcclxuICAgIHRhYlBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJsbGVkYnknLCB0YWJJZCk7XHJcbiAgICB0YWJQYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgKCFzZWxlY3RlZCkudG9TdHJpbmcoKSk7XHJcbiAgICB0YWJQYW5lbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFicGFuZWwnKTtcclxuICAgIHRhYlBhbmVsLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG5cclxuICAgIHRoaXMudGFibGlzdC5hcHBlbmRDaGlsZCh0YWIpO1xyXG4gICAgdGhpcy50YWJDb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKHRhYlBhbmVsKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZHMgYW4gYW5pbWF0ZWQgYm9yZGVyIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhYlxyXG4gICAqL1xyXG4gIGFkZEJvdHRvbUJvcmRlcigpIHtcclxuICAgIHRoaXMudGFibGlzdC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJykpO1xyXG4gIH1cclxuXHJcbiAgaW5pdFRhYlBhbmVsKCkge1xyXG4gICAgaW5pdFRhYlBhbmVsKHRoaXMudGFiQ29udGFpbmVyRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBzZWN0aW9uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcclxuICAgKi9cclxuICBzZXRTZWN0aW9uVHlwZSh7aWR9KSB7XHJcbiAgICB0aGlzLnBhbmVsLmNsYXNzTmFtZSA9IGBoNXAtc2VjdGlvbi0ke2lkfSBwYW5lbGA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSByb290IGh0bWwgZWxlbWVudFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLnJvb3RFbGVtZW50O1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9odWItdmlldy5qcyIsImltcG9ydCB7Y3Vycnl9IGZyb20gJ3V0aWxzL2Z1bmN0aW9uYWwnXHJcbmltcG9ydCBIdWJTZXJ2aWNlcyBmcm9tICcuLi9odWItc2VydmljZXMnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBUaGUgU2VhcmNoIFNlcnZpY2UgZ2V0cyBhIGNvbnRlbnQgdHlwZSBmcm9tIGh1Yi1zZXJ2aWNlcy5qc1xyXG4gKiBpbiB0aGUgZm9ybSBvZiBhIHByb21pc2UuIEl0IHRoZW4gZ2VuZXJhdGVzIGEgc2NvcmUgYmFzZWRcclxuICogb24gdGhlIGRpZmZlcmVudCB3ZWlnaHRpbmdzIG9mIHRoZSBjb250ZW50IHR5cGUgZmllbGRzIGFuZFxyXG4gKiBzb3J0cyB0aGUgcmVzdWx0cyBiYXNlZCBvbiB0aGUgZ2VuZXJhdGVkIHNjb3JlLlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoU2VydmljZSB7XHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlLmFwaVJvb3RVcmxcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgdGhpcy5zZXJ2aWNlcyA9IG5ldyBIdWJTZXJ2aWNlcyh7XHJcbiAgICAgIGFwaVJvb3RVcmw6IHN0YXRlLmFwaVJvb3RVcmxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEFkZCBjb250ZW50IHR5cGVzIHRvIHRoZSBzZWFyY2ggaW5kZXhcclxuICAgIHRoaXMuY29udGVudFR5cGVzID0gdGhpcy5zZXJ2aWNlcy5jb250ZW50VHlwZXMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBlcmZvcm1zIGEgc2VhcmNoXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcXVlcnlcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1Byb21pc2U8Q29udGVudFR5cGVbXT59IEEgcHJvbWlzZSBvZiBhbiBhcnJheSBvZiBjb250ZW50IHR5cGVzXHJcbiAgICovXHJcbiAgc2VhcmNoKHF1ZXJ5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250ZW50VHlwZXMudGhlbihmaWx0ZXJCeVF1ZXJ5KHF1ZXJ5KSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogRmlsdGVycyBhIGxpc3Qgb2YgY29udGVudCB0eXBlcyBiYXNlZCBvbiBhIHF1ZXJ5XHJcbiAqIEB0eXBlIHtGdW5jdGlvbn1cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5XHJcbiAqIEBwYXJhbSB7Q29udGVudFR5cGVbXX0gY29udGVudFR5cGVzXHJcbiAqL1xyXG5jb25zdCBmaWx0ZXJCeVF1ZXJ5ID0gY3VycnkoZnVuY3Rpb24ocXVlcnksIGNvbnRlbnRUeXBlcykge1xyXG4gIGlmIChxdWVyeSA9PSAnJykge1xyXG4gICAgcmV0dXJuIGNvbnRlbnRUeXBlcztcclxuICB9XHJcblxyXG4gIC8vIEFwcGVuZCBhIHNlYXJjaCBzY29yZSB0byBlYWNoIGNvbnRlbnQgdHlwZVxyXG4gIGNvbnRlbnRUeXBlcyA9IGNvbnRlbnRUeXBlcy5tYXAoY29udGVudFR5cGUgPT5cclxuICAgICh7XHJcbiAgICAgIGNvbnRlbnRUeXBlOiBjb250ZW50VHlwZSxcclxuICAgICAgc2NvcmU6IDBcclxuICAgIH0pXHJcbiAgKTtcclxuXHJcbiAgLy8gVG9rZW5pemUgcXVlcnkgYW5kIHNhbml0aXplXHJcbiAgbGV0IHF1ZXJpZXMgPSBxdWVyeS5zcGxpdCgnICcpLmZpbHRlcihxdWVyeSA9PiBxdWVyeSAhPT0gJycpO1xyXG5cclxuICAvLyBMb29wIHRocm91Z2ggcXVlcmllcyBhbmQgZ2VuZXJhdGUgYSByZWxldmFuY2Ugc2NvcmVcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXJpZXMubGVuZ3RoOyBpICsrKSB7XHJcbiAgICBpZiAoaSA+IDApIHsgLy8gU2VhcmNoIGEgc21hbGxlciBzdWJzZXQgZWFjaCB0aW1lXHJcbiAgICAgIGNvbnRlbnRUeXBlcyA9IGNvbnRlbnRUeXBlcy5maWx0ZXIocmVzdWx0ID0+IHJlc3VsdC5zY29yZSA+IDApO1xyXG4gICAgfVxyXG4gICAgY29udGVudFR5cGVzLmZvckVhY2goY29udGVudFR5cGUgPT4gY29udGVudFR5cGUuc2NvcmUgPSBnZXRTZWFyY2hTY29yZShxdWVyaWVzW2ldLCBjb250ZW50VHlwZS5jb250ZW50VHlwZSkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRlbnRUeXBlc1xyXG4gICAgLmZpbHRlcihyZXN1bHQgPT4gcmVzdWx0LnNjb3JlID4gMClcclxuICAgIC5zb3J0KHNvcnRTZWFyY2hSZXN1bHRzKSAvLyBTb3J0IGJ5IGluc3RhbGxlZCwgcmVsZXZhbmNlIGFuZCBwb3B1bGFyaXR5XHJcbiAgICAubWFwKHJlc3VsdCA9PiByZXN1bHQuY29udGVudFR5cGUpOyAvLyBVbndyYXAgcmVzdWx0IG9iamVjdDtcclxufSk7XHJcblxyXG4vKipcclxuICogQ2FsbGJhY2sgZm9yIEFycmF5LnNvcnQoKVxyXG4gKiBDb21wYXJlcyB0d28gY29udGVudCB0eXBlcyBvbiBkaWZmZXJlbnQgY3JpdGVyaWFcclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IGEgRmlyc3QgY29udGVudCB0eXBlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFNlY29uZCBjb250ZW50IHR5cGVcclxuICogQHJldHVybiB7aW50fVxyXG4gKi9cclxuY29uc3Qgc29ydFNlYXJjaFJlc3VsdHMgPSAoYSxiKSA9PiB7XHJcbiAgaWYgKCFhLmNvbnRlbnRUeXBlLmluc3RhbGxlZCAmJiBiLmNvbnRlbnRUeXBlLmluc3RhbGxlZCkge1xyXG4gICAgcmV0dXJuIDE7XHJcbiAgfVxyXG5cclxuICBlbHNlIGlmIChiLnNjb3JlICE9PSBhLnNjb3JlKSB7XHJcbiAgICByZXR1cm4gYi5zY29yZSAtIGEuc2NvcmU7XHJcbiAgfVxyXG5cclxuICBlbHNlIHtcclxuICAgIHJldHVybiBiLmNvbnRlbnRUeXBlLnBvcHVsYXJpdHkgLSBhLmNvbnRlbnRUeXBlLnBvcHVsYXJpdHk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENhbGN1bGF0ZXMgd2VpZ2h0aW5nIGZvciBkaWZmZXJlbnQgc2VhcmNoIHRlcm1zIGJhc2VkXHJcbiAqIG9uIGV4aXN0ZW5jZSBvZiBzdWJzdHJpbmdzXHJcbiAqXHJcbiAqIEBwYXJhbSAge3N0cmluZ30gcXVlcnlcclxuICogQHBhcmFtICB7T2JqZWN0fSBjb250ZW50VHlwZVxyXG4gKiBAcmV0dXJuIHtpbnR9XHJcbiAqL1xyXG4gY29uc3QgZ2V0U2VhcmNoU2NvcmUgPSBmdW5jdGlvbihxdWVyeSwgY29udGVudFR5cGUpIHtcclxuICAgY29uc29sZS5sb2coY29udGVudFR5cGUpO1xyXG4gICBxdWVyeSA9IHF1ZXJ5LnRyaW0oKTtcclxuICAgbGV0IHNjb3JlID0gMDtcclxuICAgaWYgKGhhc1N1YlN0cmluZyhxdWVyeSwgY29udGVudFR5cGUudGl0bGUpKSB7XHJcbiAgICAgc2NvcmUgKz0gMTAwO1xyXG4gICB9XHJcbiAgIGlmIChoYXNTdWJTdHJpbmcocXVlcnksIGNvbnRlbnRUeXBlLnN1bW1hcnkpKSB7XHJcbiAgICAgc2NvcmUgKz0gNTtcclxuICAgfVxyXG4gICBpZiAoaGFzU3ViU3RyaW5nKHF1ZXJ5LCBjb250ZW50VHlwZS5kZXNjcmlwdGlvbikpIHtcclxuICAgICBzY29yZSArPSA1O1xyXG4gICB9XHJcbiAgIGlmIChhcnJheUhhc1N1YlN0cmluZyhxdWVyeSwgY29udGVudFR5cGUua2V5d29yZHMpKSB7XHJcbiAgICAgICBzY29yZSArPSA1O1xyXG4gICB9XHJcbiAgIHJldHVybiBzY29yZTtcclxuIH07XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIGEgbmVlZGxlIGlzIGZvdW5kIGluIHRoZSBoYXlzdGFjay5cclxuICogTm90IGNhc2Ugc2Vuc2l0aXZlXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuZWVkbGVcclxuICogQHBhcmFtIHtzdHJpbmd9IGhheXN0YWNrXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBoYXNTdWJTdHJpbmcgPSBmdW5jdGlvbihuZWVkbGUsIGhheXN0YWNrKSB7XHJcbiAgaWYgKGhheXN0YWNrID09PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBoYXlzdGFjay50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlLnRvTG93ZXJDYXNlKCkpICE9PSAtMTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBIZWxwZXIgZnVuY3Rpb24sIGNoZWNrcyBpZiBhcnJheSBoYXMgY29udGFpbnMgYSBzdWJzdHJpbmdcclxuICpcclxuICogQHBhcmFtICB7U3RyaW5nfSBzdWJTdHJpbmdcclxuICogQHBhcmFtICB7QXJyYXl9IGFyclxyXG4gKiBAcmV0dXJuIHtib29sZWFufVxyXG4gKi9cclxuY29uc3QgYXJyYXlIYXNTdWJTdHJpbmcgPSBmdW5jdGlvbihzdWJTdHJpbmcsIGFycikge1xyXG4gIGlmIChhcnIgPT09IHVuZGVmaW5lZCB8fCBzdWJTdHJpbmcgPT09ICcnKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYXJyLnNvbWUoc3RyaW5nID0+IGhhc1N1YlN0cmluZyhzdWJTdHJpbmcsIHN0cmluZykpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9zZWFyY2gtc2VydmljZS9zZWFyY2gtc2VydmljZS5qcyIsImltcG9ydCBIdWJTZXJ2aWNlcyBmcm9tICcuLi9odWItc2VydmljZXMnO1xyXG5pbXBvcnQgeyBFdmVudGZ1bCB9IGZyb20gJy4uL21peGlucy9ldmVudGZ1bCc7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEBtaXhlcyBFdmVudGZ1bFxyXG4gKlxyXG4gKiBAZmlyZXMgSHViI3VwbG9hZFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXBsb2FkU2VjdGlvbiB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgRXZlbnRmdWwoKSk7XHJcblxyXG4gICAgLy8gc2VydmljZXNcclxuICAgIHRoaXMuc2VydmljZXMgPSBuZXcgSHViU2VydmljZXMoe1xyXG4gICAgICBhcGlSb290VXJsOiBzdGF0ZS5hcGlSb290VXJsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBJbnB1dCBlbGVtZW50IGZvciB0aGUgSDVQIGZpbGVcclxuICAgIGNvbnN0IGg1cFVwbG9hZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICBoNXBVcGxvYWQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2ZpbGUnKTtcclxuXHJcbiAgICAvLyBTZW5kcyB0aGUgSDVQIGZpbGUgdG8gdGhlIHBsdWdpblxyXG4gICAgY29uc3QgdXNlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICB1c2VCdXR0b24udGV4dENvbnRlbnQgPSAnVXNlJztcclxuICAgIHVzZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHJcbiAgICAgIC8vIEFkZCB0aGUgSDVQIGZpbGUgdG8gYSBmb3JtLCByZWFkeSBmb3IgdHJhbnNwb3J0YXRpb25cclxuICAgICAgY29uc3QgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICBkYXRhLmFwcGVuZCgnaDVwJywgaDVwVXBsb2FkLmZpbGVzWzBdKTtcclxuXHJcbiAgICAgIC8vIFVwbG9hZCBjb250ZW50IHRvIHRoZSBwbHVnaW5cclxuICAgICAgdGhpcy5zZXJ2aWNlcy51cGxvYWRDb250ZW50KGRhdGEpXHJcbiAgICAgICAgLnRoZW4oanNvbiA9PiB7XHJcbiAgICAgICAgICAvLyBGaXJlIHRoZSByZWNlaXZlZCBkYXRhIHRvIGFueSBsaXN0ZW5lcnNcclxuICAgICAgICAgIHNlbGYuZmlyZSgndXBsb2FkJywganNvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGg1cFVwbG9hZCk7XHJcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKHVzZUJ1dHRvbik7XHJcblxyXG4gICAgdGhpcy5yb290RWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucm9vdEVsZW1lbnQ7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL3VwbG9hZC1zZWN0aW9uL3VwbG9hZC1zZWN0aW9uLmpzIiwiaW1wb3J0IHsgc2V0QXR0cmlidXRlLCByZW1vdmVBdHRyaWJ1dGUsIGhhc0F0dHJpYnV0ZSB9IGZyb20gJy4uL3V0aWxzL2VsZW1lbnRzJztcclxuaW1wb3J0IHtjdXJyeSwgZm9yRWFjaH0gZnJvbSAnLi4vdXRpbHMvZnVuY3Rpb25hbCc7XHJcblxyXG4vKipcclxuICogQGNvbnN0YW50XHJcbiAqL1xyXG5jb25zdCBBVFRSSUJVVEVfU0laRSA9ICdkYXRhLXNpemUnO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtmdW5jdGlvbn1cclxuICovXHJcbmNvbnN0IGRpc2FibGUgPSBzZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtmdW5jdGlvbn1cclxuICovXHJcbmNvbnN0IGVuYWJsZSA9IHJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZFxyXG4gKi9cclxuY29uc3QgdG9nZ2xlRW5hYmxlZCA9IChlbGVtZW50LCBlbmFibGVkKSA9PiAoZW5hYmxlZCA/IGVuYWJsZSA6IGRpc2FibGUpKGVsZW1lbnQpO1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICogQHBhcmFtIHtib29sZWFufSBoaWRkZW5cclxuICovXHJcbmNvbnN0IHRvZ2dsZVZpc2liaWxpdHkgPSBjdXJyeSgoaGlkZGVuLCBlbGVtZW50KSA9PiBzZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgaGlkZGVuLnRvU3RyaW5nKCksIGVsZW1lbnQpKTtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZSB7ZnVuY3Rpb259XHJcbiAqL1xyXG5jb25zdCBpc0Rpc2FibGVkID0gaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSB0aGUgdmlld1xyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7SW1hZ2VTY3JvbGxlclN0YXRlfSBzdGF0ZVxyXG4gKi9cclxuY29uc3QgdXBkYXRlVmlldyA9IChlbGVtZW50LCBzdGF0ZSkgPT4ge1xyXG4gIGNvbnN0IHByZXZCdXR0b24gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmV2aW91cycpO1xyXG4gIGNvbnN0IG5leHRCdXR0b24gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXh0Jyk7XHJcbiAgY29uc3QgbGlzdCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcigndWwnKTtcclxuICBjb25zdCB0b3RhbENvdW50ID0gbGlzdC5jaGlsZEVsZW1lbnRDb3VudDtcclxuXHJcbiAgLy8gdXBkYXRlIGxpc3Qgc2l6ZXNcclxuICBsaXN0LnN0eWxlLndpZHRoID0gYCR7MTAwIC8gc3RhdGUuZGlzcGxheUNvdW50ICogdG90YWxDb3VudH0lYDtcclxuICBsaXN0LnN0eWxlLm1hcmdpbkxlZnQgPSBgJHtzdGF0ZS5wb3NpdGlvbiAqICgxMDAgLyBzdGF0ZS5kaXNwbGF5Q291bnQpfSVgO1xyXG5cclxuICAvLyB1cGRhdGUgaW1hZ2Ugc2l6ZXNcclxuICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJylcclxuICAgIC5mb3JFYWNoKGVsZW1lbnQgPT4gZWxlbWVudC5zdHlsZS53aWR0aCA9IGAkezEwMCAvIHRvdGFsQ291bnR9JWApO1xyXG5cclxuICAvLyB0b2dnbGUgYnV0dG9uIHZpc2liaWxpdHlcclxuICBbcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbl1cclxuICAgIC5mb3JFYWNoKHRvZ2dsZVZpc2liaWxpdHkoc3RhdGUuZGlzcGxheUNvdW50ID49IHRvdGFsQ291bnQpKTtcclxuXHJcbiAgLy8gdG9nZ2xlIGJ1dHRvbiBlbmFibGUsIGRpc2FibGVkXHJcbiAgdG9nZ2xlRW5hYmxlZChuZXh0QnV0dG9uLCBzdGF0ZS5wb3NpdGlvbiA+IChzdGF0ZS5kaXNwbGF5Q291bnQgLSB0b3RhbENvdW50KSk7XHJcbiAgdG9nZ2xlRW5hYmxlZChwcmV2QnV0dG9uLCBzdGF0ZS5wb3NpdGlvbiA8IDApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhhbmRsZXMgYnV0dG9uIGNsaWNrZWRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcGFyYW0ge0ltYWdlU2Nyb2xsZXJTdGF0ZX0gc3RhdGVcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gdXBkYXRlU3RhdGVcclxuICogQHBhcmFtIHtFdmVudH1cclxuICogQHR5cGUge2Z1bmN0aW9ufVxyXG4gKi9cclxuY29uc3Qgb25CdXR0b25DbGljayA9IGN1cnJ5KChlbGVtZW50LCBzdGF0ZSwgdXBkYXRlU3RhdGUsIGV2ZW50KSA9PiB7XHJcbiAgaWYoIWlzRGlzYWJsZWQoZXZlbnQudGFyZ2V0KSl7XHJcbiAgICB1cGRhdGVTdGF0ZShzdGF0ZSk7XHJcbiAgICB1cGRhdGVWaWV3KGVsZW1lbnQsIHN0YXRlKTtcclxuICB9XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemVzIGEgcGFuZWxcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluaXQoZWxlbWVudCkge1xyXG4gIC8qKlxyXG4gICAqIEB0eXBlZGVmIHtvYmplY3R9IEltYWdlU2Nyb2xsZXJTdGF0ZVxyXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkaXNwbGF5Q291bnRcclxuICAgKiBAcHJvcGVydHkge251bWJlcn0gcG9zaXRpb25cclxuICAgKi9cclxuICBjb25zdCBzdGF0ZSA9IHtcclxuICAgIGRpc3BsYXlDb3VudDogZWxlbWVudC5nZXRBdHRyaWJ1dGUoQVRUUklCVVRFX1NJWkUpIHx8IDUsXHJcbiAgICBwb3NpdGlvbjogMFxyXG4gIH07XHJcblxyXG4gIC8vIGluaXRpYWxpemUgYnV0dG9uc1xyXG4gIGVsZW1lbnQucXVlcnlTZWxlY3RvcignLm5leHQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQnV0dG9uQ2xpY2soZWxlbWVudCwgc3RhdGUsIHN0YXRlID0+IHN0YXRlLnBvc2l0aW9uLS0pKTtcclxuICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmV2aW91cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25CdXR0b25DbGljayhlbGVtZW50LCBzdGF0ZSwgc3RhdGUgPT4gc3RhdGUucG9zaXRpb24rKykpO1xyXG5cclxuICAvLyBpbml0aWFsaXplIGltYWdlc1xyXG4gIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2FyaWEtY29udHJvbHNdJylcclxuICAgIC5mb3JFYWNoKGltYWdlID0+IHtcclxuICAgICAgbGV0IHRhcmdldElkID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgICAgIGxldCB0YXJnZXQgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke3RhcmdldElkfWApO1xyXG5cclxuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4gdGFyZ2V0LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpKTtcclxuICAgICAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB0YXJnZXQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpKVxyXG4gICAgfSk7XHJcblxyXG4gIC8vIGxpc3RlbiBmb3IgdXBkYXRlcyB0byBkYXRhLXNpemVcclxuICBsZXQgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmb3JFYWNoKHJlY29yZCA9PiB7XHJcbiAgICB1cGRhdGVWaWV3KGVsZW1lbnQsIE9iamVjdC5hc3NpZ24oc3RhdGUsIHtcclxuICAgICAgcG9zaXRpb246IDAsXHJcbiAgICAgIGRpc3BsYXlDb3VudDogZWxlbWVudC5nZXRBdHRyaWJ1dGUoQVRUUklCVVRFX1NJWkUpXHJcbiAgICB9KSk7XHJcbiAgfSkpO1xyXG5cclxuICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIHtcclxuICAgIHN1YnRyZWU6IHRydWUsXHJcbiAgICBjaGlsZExpc3Q6IHRydWUsXHJcbiAgICBhdHRyaWJ1dGVzOiB0cnVlLFxyXG4gICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXHJcbiAgICBhdHRyaWJ1dGVGaWx0ZXI6IFtBVFRSSUJVVEVfU0laRV1cclxuICB9KTtcclxuXHJcbiAgLy8gaW5pdGlhbGl6ZSBwb3NpdGlvblxyXG4gIHVwZGF0ZVZpZXcoZWxlbWVudCwgc3RhdGUpO1xyXG5cclxuICByZXR1cm4gZWxlbWVudDtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbWFnZS1zY3JvbGxlci5qcyIsImltcG9ydCB7c2V0QXR0cmlidXRlfSBmcm9tICcuLi91dGlscy9lbGVtZW50cyc7XHJcbmltcG9ydCB7Zm9yRWFjaH0gZnJvbSAnLi4vdXRpbHMvZnVuY3Rpb25hbCc7XHJcblxyXG4vKipcclxuICogQHR5cGUge2Z1bmN0aW9ufVxyXG4gKi9cclxuY29uc3QgaGlkZUFsbCA9IGZvckVhY2goc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJykpO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtmdW5jdGlvbn1cclxuICovXHJcbmNvbnN0IHNob3cgPSBzZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4vKipcclxuICogQHR5cGUge2Z1bmN0aW9ufVxyXG4gKi9cclxuY29uc3QgdW5TZWxlY3RBbGwgPSBmb3JFYWNoKHNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpKTtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWF0ZXMgYSB0YWIgcGFuZWxcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5pdChlbGVtZW50KSB7XHJcbiAgY29uc3QgdGFicyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3JvbGU9XCJ0YWJcIl0nKTtcclxuICBjb25zdCB0YWJQYW5lbHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyb2xlPVwidGFicGFuZWxcIl0nKTtcclxuXHJcbiAgdGFicy5mb3JFYWNoKHRhYiA9PiB7XHJcbiAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHJcbiAgICAgIHVuU2VsZWN0QWxsKHRhYnMpO1xyXG4gICAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuXHJcbiAgICAgIGhpZGVBbGwodGFiUGFuZWxzKTtcclxuXHJcbiAgICAgIGxldCB0YWJQYW5lbElkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xyXG4gICAgICBzaG93KGVsZW1lbnQucXVlcnlTZWxlY3RvcihgIyR7dGFiUGFuZWxJZH1gKSk7XHJcbiAgICB9KTtcclxuICB9KVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vLi4vaDVwLXNkay9zcmMvc2NyaXB0cy9jb21wb25lbnRzL3RhYi1wYW5lbC5qcyIsInJlcXVpcmUoJy4uLy4uL3NyYy9zdHlsZXMvbWFpbi5zY3NzJyk7XHJcblxyXG4vLyBMb2FkIGxpYnJhcnlcclxuSDVQID0gSDVQIHx8IHt9O1xyXG5INVAuSHViQ2xpZW50ID0gcmVxdWlyZSgnLi4vc2NyaXB0cy9odWInKS5kZWZhdWx0O1xyXG5INVAuSHViQ2xpZW50LnJlbmRlckVycm9yTWVzc2FnZSA9IHJlcXVpcmUoJy4uL3NjcmlwdHMvdXRpbHMvZXJyb3JzJykuZGVmYXVsdDtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VudHJpZXMvZGlzdC5qcyJdLCJzb3VyY2VSb290IjoiIn0=