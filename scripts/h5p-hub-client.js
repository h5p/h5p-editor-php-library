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
exports.nodeListToArray = exports.classListContains = exports.removeChild = exports.querySelectorAll = exports.querySelector = exports.appendChild = exports.toggleAttribute = exports.attributeEquals = exports.hasAttribute = exports.removeAttribute = exports.setAttribute = exports.getAttribute = undefined;

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
  return el.setAttribute(name, value);
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
  return el.removeAttribute(name);
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
 * The removeChild() method removes a child node from the DOM. Returns removed node.
 *
 * @param {Node} parent
 * @param {Node} oldChild
 *
 * @return {Node}
 */
var removeChild = exports.removeChild = (0, _functional.curry)(function (parent, oldChild) {
  return parent.removeChild(oldChild);
});

/**
 * Returns true if a node has a class
 *
 * @param {string} cls
 * @param {HTMLElement} el
 *
 * @function
 */
var classListContains = exports.classListContains = (0, _functional.curry)(function (cls, el) {
  return el.classList.contains(cls);
});

/**
 * Transforms a NodeList to an Array
 *
 * @param {NodeList} nodeList
 *
 * @return {Node[]}
 */
var nodeListToArray = exports.nodeListToArray = function nodeListToArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
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
      return fetch(ns.getAjaxUrl('library-install', { id: id }), {
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
 * @constant {number}
 */
var MAX_TEXT_SIZE_DESCRIPTION = 300;

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

    // create view
    this.rootElement = this.createView();

    // grab references
    this.useButton = this.rootElement.querySelector('.button-use');
    this.installButton = this.rootElement.querySelector('.button-install');
    this.image = this.rootElement.querySelector('.content-type-image');
    this.title = this.rootElement.querySelector('.text-details h3');
    this.owner = this.rootElement.querySelector('.owner');
    this.description = this.rootElement.querySelector('.text-details .small');
    this.demoButton = this.rootElement.querySelector('.demo-button');
    this.carousel = this.rootElement.querySelector('.carousel');
    this.carouselList = this.carousel.querySelector('ul');
    this.licencePanel = this.rootElement.querySelector('.licence-panel');

    // init interactive elements
    (0, _panel2.default)(this.licencePanel);
    (0, _imageScroller2.default)(this.carousel);

    // fire events on button click
    (0, _events.relayClickEventAs)('close', this, this.rootElement.querySelector('.back-button'));
    (0, _events.relayClickEventAs)('select', this, this.useButton);
    (0, _events.relayClickEventAs)('install', this, this.installButton);
  }

  /**
   * Creates the view as a HTMLElement
   *
   * @return {HTMLElement}
   */


  _createClass(ContentTypeDetailView, [{
    key: "createView",
    value: function createView() {
      var element = document.createElement('div');
      element.className = 'content-type-detail';
      element.setAttribute('aria-hidden', 'true');
      element.innerHTML = "\n      <div class=\"back-button icon-arrow-thick\"></div>\n      <div class=\"container\">\n        <div class=\"image-wrapper\"><img class=\"img-responsive content-type-image\" src=\"" + _contentTypePlaceholder2.default + "\"></div>\n        <div class=\"text-details\">\n          <h3></h3>\n          <div class=\"owner\"></div>\n          <p class=\"small\"></p>\n          <a class=\"button demo-button\" target=\"_blank\" aria-hidden=\"false\" href=\"https://h5p.org/chart\">Content Demo</a>\n        </div>\n      </div>\n      <div class=\"carousel\" role=\"region\" data-size=\"5\">\n        <span class=\"carousel-button previous\" aria-hidden=\"true\" disabled><span class=\"icon-arrow-thick\"></span></span>\n        <span class=\"carousel-button next\" aria-hidden=\"true\" disabled><span class=\"icon-arrow-thick\"></span></span>\n        <nav class=\"scroller\">\n          <ul></ul>\n        </nav>\n      </div>\n      <hr />\n      <div class=\"button-bar\">\n        <span class=\"button button-primary button-use\" aria-hidden=\"false\" data-id=\"H5P.Chart\">Use</span>\n        <span class=\"button button-inverse-primary button-install\" aria-hidden=\"true\" data-id=\"H5P.Chart\"><span class=\"icon-arrow-thick\"></span>Install</span>\n      </div>\n      <div class=\"panel-group\">\n        <div class=\"panel licence-panel\" aria-hidden=\"true\">\n          <div class=\"panel-header\" aria-expanded=\"false\" aria-controls=\"licence-panel\">The Licence Info</div>\n          <div class=\"panel-body\" id=\"licence-panel\" aria-hidden=\"true\">\n            <div class=\"panel-body-inner\"></div>\n          </div>\n        </div>\n      </div>";

      return element;
    }

    /**
     * Removes all images from the carousel
     */

  }, {
    key: "removeAllImagesInCarousel",
    value: function removeAllImagesInCarousel() {
      this.carouselList.querySelectorAll('li').forEach((0, _elements.removeChild)(this.carouselList));
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
      lightbox.id = "lightbox-" + this.carouselList.childElementCount;
      lightbox.className = 'carousel-lightbox';
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.innerHTML = "<img class=\"img-responsive\" src=\"" + image.url + "\" alt=\"" + image.alt + "\">";
      this.carousel.appendChild(lightbox);

      // add thumbnail
      var thumbnail = document.createElement('li');
      thumbnail.className = 'slide';
      thumbnail.innerHTML = "<img src=\"" + image.url + "\" alt=\"" + image.alt + "\" class=\"img-responsive\" aria-controls=\"" + lightbox.id + "\" />";
      this.carouselList.appendChild(thumbnail);
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
      this.title.innerHTML = "" + title;
    }

    /**
     * Sets the long description
     *
     * @param {string} text
     */

  }, {
    key: "setDescription",
    value: function setDescription(text) {
      var _this = this;

      if (text.length > MAX_TEXT_SIZE_DESCRIPTION) {
        this.description.innerHTML = this.ellipsis(MAX_TEXT_SIZE_DESCRIPTION, text) + " <span class=\"read-more link\">Read more</span>";
        this.description.querySelector('.read-more, .read-less').addEventListener('click', function () {
          return _this.toggleDescriptionExpanded(text);
        });
        this.descriptionExpanded = false;
      } else {
        this.description.innerText = text;
      }
    }

    /**
     * Toggles Read less and Read more text
     *
     * @param {string} text
     */

  }, {
    key: "toggleDescriptionExpanded",
    value: function toggleDescriptionExpanded(text) {
      var _this2 = this;

      // flip boolean
      this.descriptionExpanded = !this.descriptionExpanded;

      if (this.descriptionExpanded) {
        this.description.innerHTML = text + " <span class=\"read-less link\">Read less</span>";
      } else {
        this.description.innerHTML = this.ellipsis(MAX_TEXT_SIZE_DESCRIPTION, text) + " <span class=\"read-more link\">Read more</span>";
      }

      this.description.querySelector('.read-more, .read-less').addEventListener('click', function () {
        return _this2.toggleDescriptionExpanded(text);
      });
    }

    /**
     * Shortens a string, and puts an elipsis at the end
     *
     * @param {number} size
     * @param {string} text
     */

  }, {
    key: "ellipsis",
    value: function ellipsis(size, text) {
      return text.substr(0, size) + "...";
    }

    /**
     * Sets the licence
     *
     * @param {string} type
     */

  }, {
    key: "setLicence",
    value: function setLicence(type) {
      if (type) {
        this.licencePanel.querySelector('.panel-body-inner').innerText = type;
        _show(this.licencePanel);
      } else {
        _hide(this.licencePanel);
      }
    }

    /**
     * Sets the long description
     *
     * @param {string} owner
     */

  }, {
    key: "setOwner",
    value: function setOwner(owner) {
      if (owner) {
        this.owner.innerHTML = "By " + owner;
      } else {
        this.owner.innerHTML = '';
      }
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
        return console.debug('TODO, gui updates', contentType);
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
      this.view.setOwner(contentType.owner);
      this.view.setIsInstalled(!!contentType.installed);
      this.view.setLicence(contentType.license);

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
      var useButtonConfig = { text: 'Use', cls: 'button-primary', icon: '' };
      var installButtonConfig = { text: 'install', cls: 'button-inverse-primary button-install', icon: 'icon-arrow-thick' };
      var button = contentType.installed ? useButtonConfig : installButtonConfig;

      var title = contentType.title || contentType.machineName;
      var description = contentType.summary || '';

      var image = contentType.icon || _contentTypePlaceholder2.default;

      // create html
      element.innerHTML = "\n      <img class=\"img-responsive\" src=\"" + image + "\">\n      <span class=\"button " + button.cls + "\" data-id=\"" + contentType.machineName + "\" tabindex=\"0\"><span class=\"" + button.icon + "\"></span>" + button.text + "</span>\n      <h4>" + title + "</h4>\n      <div class=\"description\">" + description + "</div>\n   ";

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
  return contentTypes.map(function (contentType) {
    return {
      contentType: contentType,
      score: getSearchScore(query, contentType)
    };
  }).filter(function (result) {
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
  }

  if (a.contentType.installed && !b.contentType.installed) {
    return -1;
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
  var queries = query.split(' ').filter(function (query) {
    return query !== '';
  });
  var queryScores = queries.map(function (query) {
    return getScoreForEachQuery(query, contentType);
  });
  if (queryScores.indexOf(0) > -1) {
    return 0;
  }
  return queryScores.reduce(function (a, b) {
    return a + b;
  }, 0);
};

/**
 * Generates a relevance score for a single string
 *
 * @param  {type} query       description
 * @param  {type} contentType description
 * @return {type}             description
 */
var getScoreForEachQuery = function getScoreForEachQuery(query, contentType) {
  query = query.trim();
  if (hasSubString(query, contentType.title)) {
    return 100;
  } else if (hasSubString(query, contentType.summary)) {
    return 5;
  } else if (hasSubString(query, contentType.description)) {
    return 5;
  } else if (arrayHasSubString(query, contentType.keywords)) {
    return 5;
  } else {
    return 0;
  }
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

var AddNumber = function AddNumber(a, b) {
  return a + b;
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
 * @function
 */
var onNavigationButtonClick = (0, _functional.curry)(function (element, state, updateState, event) {
  if (!isDisabled(event.target)) {
    updateState(state);
    updateView(element, state);
  }
});

var initImage = (0, _functional.curry)(function (element, image) {
  var targetId = image.getAttribute('aria-controls');
  var target = element.querySelector('#' + targetId);

  target.addEventListener('click', function (event) {
    return target.setAttribute('aria-hidden', 'true');
  });
  image.addEventListener('click', function (event) {
    return target.setAttribute('aria-hidden', 'false');
  });
});

/**
 * Callback for when the dom is updated
 *
 * @param {HTMLElement} element
 * @param {ImageScrollerState} state
 * @param {MutationRecord} record
 * @function
 */
var handleDomUpdate = (0, _functional.curry)(function (element, state, record) {
  // on add image run initialization
  if (record.type === 'childList') {
    (0, _elements.nodeListToArray)(record.addedNodes).filter((0, _elements.classListContains)('slide')).map((0, _elements.querySelector)('img')).forEach(initImage(element));
  }

  // update the view
  updateView(element, _extends(state, {
    displayCount: element.getAttribute(ATTRIBUTE_SIZE) || 5,
    position: 0
  }));
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
  element.querySelector('.next').addEventListener('click', onNavigationButtonClick(element, state, function (state) {
    return state.position--;
  }));
  element.querySelector('.previous').addEventListener('click', onNavigationButtonClick(element, state, function (state) {
    return state.position++;
  }));

  // initialize images
  element.querySelectorAll('[aria-controls]').forEach(initImage(element));

  // listen for updates to data-size
  var observer = new MutationObserver((0, _functional.forEach)(handleDomUpdate(element, state)));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWRhMmIyZTY5MjQ2MzA4NjA1MjAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvbWl4aW5zL2V2ZW50ZnVsLmpzIiwid2VicGFjazovLy8uLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvdXRpbHMvZnVuY3Rpb25hbC5qcyIsIndlYnBhY2s6Ly8vLi8uLi9oNXAtc2RrL3NyYy9zY3JpcHRzL3V0aWxzL2VsZW1lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2h1Yi1zZXJ2aWNlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy91dGlscy9lcnJvcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdXRpbHMvZXZlbnRzLmpzIiwid2VicGFjazovLy8uLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvY29tcG9uZW50cy9wYW5lbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1hZ2VzL2NvbnRlbnQtdHlwZS1wbGFjZWhvbGRlci5zdmciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvaHViLmpzIiwid2VicGFjazovLy8uL3NyYy9zdHlsZXMvbWFpbi5zY3NzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1kZXRhaWwvY29udGVudC10eXBlLWRldGFpbC12aWV3LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1kZXRhaWwvY29udGVudC10eXBlLWRldGFpbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy9jb250ZW50LXR5cGUtbGlzdC9jb250ZW50LXR5cGUtbGlzdC12aWV3LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1saXN0L2NvbnRlbnQtdHlwZS1saXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1zZWN0aW9uL2NvbnRlbnQtdHlwZS1zZWN0aW9uLXZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvY29udGVudC10eXBlLXNlY3Rpb24vY29udGVudC10eXBlLXNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvaHViLXZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvc2VhcmNoLXNlcnZpY2Uvc2VhcmNoLXNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdXBsb2FkLXNlY3Rpb24vdXBsb2FkLXNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vLi4vaDVwLXNkay9zcmMvc2NyaXB0cy9jb21wb25lbnRzL2ltYWdlLXNjcm9sbGVyLmpzIiwid2VicGFjazovLy8uLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvY29tcG9uZW50cy90YWItcGFuZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJpZXMvZGlzdC5qcyJdLCJuYW1lcyI6WyJFdmVudGZ1bCIsImxpc3RlbmVycyIsIm9uIiwidHlwZSIsImxpc3RlbmVyIiwic2NvcGUiLCJ0cmlnZ2VyIiwicHVzaCIsImZpcmUiLCJldmVudCIsInRyaWdnZXJzIiwiZXZlcnkiLCJjYWxsIiwicHJvcGFnYXRlIiwidHlwZXMiLCJldmVudGZ1bCIsInNlbGYiLCJmb3JFYWNoIiwiY3VycnkiLCJmbiIsImFyaXR5IiwibGVuZ3RoIiwiZjEiLCJhcmdzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImFyZ3VtZW50cyIsImFwcGx5IiwiZjIiLCJhcmdzMiIsImNvbmNhdCIsImNvbXBvc2UiLCJmbnMiLCJyZWR1Y2UiLCJmIiwiZyIsImFyciIsIm1hcCIsImZpbHRlciIsInNvbWUiLCJjb250YWlucyIsInZhbHVlIiwiaW5kZXhPZiIsIndpdGhvdXQiLCJ2YWx1ZXMiLCJpbnZlcnNlQm9vbGVhblN0cmluZyIsImJvb2wiLCJ0b1N0cmluZyIsImdldEF0dHJpYnV0ZSIsIm5hbWUiLCJlbCIsInNldEF0dHJpYnV0ZSIsInJlbW92ZUF0dHJpYnV0ZSIsImhhc0F0dHJpYnV0ZSIsImF0dHJpYnV0ZUVxdWFscyIsInRvZ2dsZUF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwicGFyZW50IiwiY2hpbGQiLCJxdWVyeVNlbGVjdG9yIiwic2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yQWxsIiwicmVtb3ZlQ2hpbGQiLCJvbGRDaGlsZCIsImNsYXNzTGlzdENvbnRhaW5zIiwiY2xzIiwiY2xhc3NMaXN0Iiwibm9kZUxpc3RUb0FycmF5Iiwibm9kZUxpc3QiLCJIdWJTZXJ2aWNlcyIsImFwaVJvb3RVcmwiLCJ3aW5kb3ciLCJjYWNoZWRDb250ZW50VHlwZXMiLCJmZXRjaCIsIm1ldGhvZCIsImNyZWRlbnRpYWxzIiwidGhlbiIsInJlc3VsdCIsImpzb24iLCJpc1ZhbGlkIiwibGlicmFyaWVzIiwicmVzcG9uc2UiLCJtZXNzYWdlQ29kZSIsIlByb21pc2UiLCJyZWplY3QiLCJyZXNvbHZlIiwibWFjaGluZU5hbWUiLCJjb250ZW50VHlwZXMiLCJjb250ZW50VHlwZSIsImlkIiwibnMiLCJnZXRBamF4VXJsIiwiYm9keSIsImZvcm1EYXRhIiwicmVuZGVyRXJyb3JNZXNzYWdlIiwibWVzc2FnZSIsImNsb3NlQnV0dG9uIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwibWVzc2FnZUNvbnRlbnQiLCJ0aXRsZSIsImNvbnRlbnQiLCJtZXNzYWdlV3JhcHBlciIsImRpc21pc3NpYmxlIiwiYnV0dG9uIiwidW5kZWZpbmVkIiwibWVzc2FnZUJ1dHRvbiIsImNvbnNvbGUiLCJsb2ciLCJyZWxheUNsaWNrRXZlbnRBcyIsImVsZW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwic3RvcFByb3BhZ2F0aW9uIiwiaW5pdCIsImlzRXhwYW5kZWQiLCJoaWRlIiwic2hvdyIsInRvZ2dsZUJvZHlWaXNpYmlsaXR5IiwiYm9keUVsZW1lbnQiLCJvbkFyaWFFeHBhbmRlZENoYW5nZSIsInRhcmdldCIsInRpdGxlRWwiLCJib2R5SWQiLCJib2R5RWwiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJvYnNlcnZlIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZU9sZFZhbHVlIiwiYXR0cmlidXRlRmlsdGVyIiwiSHViIiwic3RhdGUiLCJjb250ZW50VHlwZVNlY3Rpb24iLCJ1cGxvYWRTZWN0aW9uIiwidmlldyIsInNlcnZpY2VzIiwic2V0UGFuZWxUaXRsZSIsImNsb3NlUGFuZWwiLCJzZXRTZWN0aW9uVHlwZSIsInRvZ2dsZVBhbmVsT3BlbiIsImJpbmQiLCJpbml0VGFiUGFuZWwiLCJnZXRDb250ZW50VHlwZSIsInNldFRpdGxlIiwic2VjdGlvbklkIiwidGFiQ29uZmlncyIsImdldEVsZW1lbnQiLCJjb25maWciLCJzZWxlY3RlZCIsImFkZFRhYiIsInRhYkNvbmZpZyIsImFkZEJvdHRvbUJvcmRlciIsIkFUVFJJQlVURV9DT05URU5UX1RZUEVfSUQiLCJNQVhfVEVYVF9TSVpFX0RFU0NSSVBUSU9OIiwidG9nZ2xlVmlzaWJpbGl0eSIsInZpc2libGUiLCJpc0VtcHR5IiwidGV4dCIsIkNvbnRlbnRUeXBlRGV0YWlsVmlldyIsInJvb3RFbGVtZW50IiwiY3JlYXRlVmlldyIsInVzZUJ1dHRvbiIsImluc3RhbGxCdXR0b24iLCJpbWFnZSIsIm93bmVyIiwiZGVzY3JpcHRpb24iLCJkZW1vQnV0dG9uIiwiY2Fyb3VzZWwiLCJjYXJvdXNlbExpc3QiLCJsaWNlbmNlUGFuZWwiLCJsaWdodGJveCIsImNoaWxkRWxlbWVudENvdW50IiwidXJsIiwiYWx0IiwidGh1bWJuYWlsIiwic3JjIiwiZWxsaXBzaXMiLCJ0b2dnbGVEZXNjcmlwdGlvbkV4cGFuZGVkIiwiZGVzY3JpcHRpb25FeHBhbmRlZCIsImlubmVyVGV4dCIsInNpemUiLCJzdWJzdHIiLCJpbnN0YWxsZWQiLCJDb250ZW50VHlwZURldGFpbCIsImluc3RhbGwiLCJ1cGRhdGUiLCJpbnN0YWxsQ29udGVudFR5cGUiLCJkZWJ1ZyIsInNldElkIiwic2V0RGVzY3JpcHRpb24iLCJzZXRJbWFnZSIsImljb24iLCJzZXRFeGFtcGxlIiwiZXhhbXBsZSIsInNldE93bmVyIiwic2V0SXNJbnN0YWxsZWQiLCJzZXRMaWNlbmNlIiwibGljZW5zZSIsInJlbW92ZUFsbEltYWdlc0luQ2Fyb3VzZWwiLCJzY3JlZW5zaG90cyIsImFkZEltYWdlVG9DYXJvdXNlbCIsIkNvbnRlbnRUeXBlTGlzdFZpZXciLCJoYXNDaGlsZE5vZGVzIiwibGFzdENoaWxkIiwicm93IiwiY3JlYXRlQ29udGVudFR5cGVSb3ciLCJ1c2VCdXR0b25Db25maWciLCJpbnN0YWxsQnV0dG9uQ29uZmlnIiwic3VtbWFyeSIsIkNvbnRlbnRUeXBlTGlzdCIsInJlbW92ZUFsbFJvd3MiLCJhZGRSb3ciLCJDb250ZW50QnJvd3NlclZpZXciLCJtZW51IiwiY3JlYXRlTWVudUVsZW1lbnQiLCJpbnB1dEdyb3VwIiwiY3JlYXRlSW5wdXRHcm91cEVsZW1lbnQiLCJtZW51R3JvdXAiLCJtZW51QmFyRWxlbWVudCIsIm5hdkVsZW1lbnQiLCJpbnB1dEZpZWxkIiwicXVlcnkiLCJpbnB1dEJ1dHRvbiIsIm9uY2xpY2siLCJwYXJlbnRFbGVtZW50IiwiZm9jdXMiLCJDb250ZW50VHlwZVNlY3Rpb24iLCJzZWFyY2hTZXJ2aWNlIiwiY29udGVudFR5cGVMaXN0IiwiY29udGVudFR5cGVEZXRhaWwiLCJhZGRNZW51SXRlbSIsIm1lbnVUZXh0Iiwic2VjdGlvbiIsImFkZCIsInNlYXJjaCIsImFwcGx5U2VhcmNoRmlsdGVyIiwic2hvd0RldGFpbFZpZXciLCJjbG9zZURldGFpbFZpZXciLCJpbml0Q29udGVudFR5cGVMaXN0IiwiY2F0Y2giLCJlcnJvciIsImxvYWRCeUlkIiwiQVRUUklCVVRFX0RBVEFfSUQiLCJpc09wZW4iLCJIdWJWaWV3IiwicmVuZGVyVGFiUGFuZWwiLCJyZW5kZXJQYW5lbCIsImV4cGFuZGVkIiwidGFiQ29udGFpbmVyRWxlbWVudCIsInBhbmVsIiwic2V0VGltZW91dCIsInRhYmxpc3QiLCJ0YWJMaXN0V3JhcHBlciIsInRhYklkIiwidGFiUGFuZWxJZCIsInRhYiIsInRhYlBhbmVsIiwiU2VhcmNoU2VydmljZSIsImZpbHRlckJ5UXVlcnkiLCJzY29yZSIsImdldFNlYXJjaFNjb3JlIiwic29ydCIsInNvcnRTZWFyY2hSZXN1bHRzIiwiYSIsImIiLCJwb3B1bGFyaXR5IiwicXVlcmllcyIsInNwbGl0IiwicXVlcnlTY29yZXMiLCJnZXRTY29yZUZvckVhY2hRdWVyeSIsInRyaW0iLCJoYXNTdWJTdHJpbmciLCJhcnJheUhhc1N1YlN0cmluZyIsImtleXdvcmRzIiwibmVlZGxlIiwiaGF5c3RhY2siLCJ0b0xvd2VyQ2FzZSIsInN1YlN0cmluZyIsInN0cmluZyIsIkFkZE51bWJlciIsIlVwbG9hZFNlY3Rpb24iLCJoNXBVcGxvYWQiLCJ0ZXh0Q29udGVudCIsImRhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsImZpbGVzIiwidXBsb2FkQ29udGVudCIsIkFUVFJJQlVURV9TSVpFIiwiZGlzYWJsZSIsImVuYWJsZSIsInRvZ2dsZUVuYWJsZWQiLCJlbmFibGVkIiwiaGlkZGVuIiwiaXNEaXNhYmxlZCIsInVwZGF0ZVZpZXciLCJwcmV2QnV0dG9uIiwibmV4dEJ1dHRvbiIsImxpc3QiLCJ0b3RhbENvdW50Iiwic3R5bGUiLCJ3aWR0aCIsImRpc3BsYXlDb3VudCIsIm1hcmdpbkxlZnQiLCJwb3NpdGlvbiIsIm9uTmF2aWdhdGlvbkJ1dHRvbkNsaWNrIiwidXBkYXRlU3RhdGUiLCJpbml0SW1hZ2UiLCJ0YXJnZXRJZCIsImhhbmRsZURvbVVwZGF0ZSIsInJlY29yZCIsImFkZGVkTm9kZXMiLCJzdWJ0cmVlIiwiY2hpbGRMaXN0IiwiaGlkZUFsbCIsInVuU2VsZWN0QWxsIiwidGFicyIsInRhYlBhbmVscyIsInJlcXVpcmUiLCJINVAiLCJIdWJDbGllbnQiLCJkZWZhdWx0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFD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QUF6QixDQUFsQjs7QUFFQWlRLE9BQUs5UyxPQUFMLENBQWEsZUFBTztBQUNsQmlQLFFBQUloSixnQkFBSixDQUFxQixPQUFyQixFQUE4QixVQUFVekcsS0FBVixFQUFpQjs7QUFFN0NxVCxrQkFBWUMsSUFBWjtBQUNBdFQsWUFBTWtILE1BQU4sQ0FBYXZFLFlBQWIsQ0FBMEIsZUFBMUIsRUFBMkMsTUFBM0M7O0FBRUF5USxjQUFRRyxTQUFSOztBQUVBLFVBQUkvRCxhQUFheFAsTUFBTWtILE1BQU4sQ0FBYTFFLFlBQWIsQ0FBMEIsZUFBMUIsQ0FBakI7QUFDQXNFLFdBQUtOLFFBQVFyRCxhQUFSLE9BQTBCcU0sVUFBMUIsQ0FBTDtBQUNELEtBVEQ7QUFVRCxHQVhEO0FBWUQsQzs7Ozs7Ozs7O0FDdkNELG1CQUFBZ0UsQ0FBUSxDQUFSOztBQUVBO0FBQ0FDLE1BQU1BLE9BQU8sRUFBYjtBQUNBQSxJQUFJQyxTQUFKLEdBQWdCLG1CQUFBRixDQUFRLENBQVIsRUFBMEJHLE9BQTFDO0FBQ0FGLElBQUlDLFNBQUosQ0FBY3BPLGtCQUFkLEdBQW1DLG1CQUFBa08sQ0FBUSxDQUFSLEVBQW1DRyxPQUF0RSxDIiwiZmlsZSI6Img1cC1odWItY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMjEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDFkYTJiMmU2OTI0NjMwODYwNTIwIiwiLyoqXHJcbiAqIEBtaXhpblxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IEV2ZW50ZnVsID0gKCkgPT4gKHtcclxuICBsaXN0ZW5lcnM6IHt9LFxyXG5cclxuICAvKipcclxuICAgKiBMaXN0ZW4gdG8gZXZlbnRcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXJcclxuICAgKiBAcGFyYW0ge29iamVjdH0gW3Njb3BlXVxyXG4gICAqXHJcbiAgICogQGZ1bmN0aW9uXHJcbiAgICogQHJldHVybiB7RXZlbnRmdWx9XHJcbiAgICovXHJcbiAgb246IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyLCBzY29wZSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZWRlZiB7b2JqZWN0fSBUcmlnZ2VyXHJcbiAgICAgKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBsaXN0ZW5lclxyXG4gICAgICogQHByb3BlcnR5IHtvYmplY3R9IHNjb3BlXHJcbiAgICAgKi9cclxuICAgIGNvbnN0IHRyaWdnZXIgPSB7XHJcbiAgICAgICdsaXN0ZW5lcic6IGxpc3RlbmVyLFxyXG4gICAgICAnc2NvcGUnOiBzY29wZVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXSA9IHRoaXMubGlzdGVuZXJzW3R5cGVdIHx8IFtdO1xyXG4gICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0ucHVzaCh0cmlnZ2VyKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBGaXJlIGV2ZW50LiBJZiBhbnkgb2YgdGhlIGxpc3RlbmVycyByZXR1cm5zIGZhbHNlLCByZXR1cm4gZmFsc2VcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IFtldmVudF1cclxuICAgKlxyXG4gICAqIEBmdW5jdGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgZmlyZTogZnVuY3Rpb24odHlwZSwgZXZlbnQpIHtcclxuICAgIGNvbnN0IHRyaWdnZXJzID0gdGhpcy5saXN0ZW5lcnNbdHlwZV0gfHwgW107XHJcblxyXG4gICAgcmV0dXJuIHRyaWdnZXJzLmV2ZXJ5KGZ1bmN0aW9uKHRyaWdnZXIpIHtcclxuICAgICAgcmV0dXJuIHRyaWdnZXIubGlzdGVuZXIuY2FsbCh0cmlnZ2VyLnNjb3BlIHx8IHRoaXMsIGV2ZW50KSAhPT0gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBMaXN0ZW5zIGZvciBldmVudHMgb24gYW5vdGhlciBFdmVudGZ1bCwgYW5kIHByb3BhZ2F0ZSBpdCB0cm91Z2ggdGhpcyBFdmVudGZ1bFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZXNcclxuICAgKiBAcGFyYW0ge0V2ZW50ZnVsfSBldmVudGZ1bFxyXG4gICAqL1xyXG4gIHByb3BhZ2F0ZTogZnVuY3Rpb24odHlwZXMsIGV2ZW50ZnVsKSB7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICB0eXBlcy5mb3JFYWNoKHR5cGUgPT4gZXZlbnRmdWwub24odHlwZSwgZXZlbnQgPT4gc2VsZi5maXJlKHR5cGUsIGV2ZW50KSkpO1xyXG4gIH1cclxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvbWl4aW5zL2V2ZW50ZnVsLmpzIiwiLyoqXHJcbiAqIFJldHVybnMgYSBjdXJyaWVkIHZlcnNpb24gb2YgYSBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGN1cnJ5ID0gZnVuY3Rpb24oZm4pIHtcclxuICBjb25zdCBhcml0eSA9IGZuLmxlbmd0aDtcclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIGYxKCkge1xyXG4gICAgY29uc3QgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XHJcbiAgICBpZiAoYXJncy5sZW5ndGggPj0gYXJpdHkpIHtcclxuICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiBmMigpIHtcclxuICAgICAgICBjb25zdCBhcmdzMiA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XHJcbiAgICAgICAgcmV0dXJuIGYxLmFwcGx5KG51bGwsIGFyZ3MuY29uY2F0KGFyZ3MyKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXBvc2UgZnVuY3Rpb25zIHRvZ2V0aGVyLCBleGVjdXRpbmcgZnJvbSByaWdodCB0byBsZWZ0XHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb24uLi59IGZuc1xyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cclxuICovXHJcbmV4cG9ydCBjb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZSgoZiwgZykgPT4gKC4uLmFyZ3MpID0+IGYoZyguLi5hcmdzKSkpO1xyXG5cclxuLyoqXHJcbiAqIEFwcGxpZXMgYSBmdW5jdGlvbiB0byBlYWNoIGVsZW1lbnQgaW4gYW4gYXJyYXlcclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm5cclxuICogQHBhcmFtIHtBcnJheX0gYXJyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGZvckVhY2ggPSBjdXJyeShmdW5jdGlvbiAoZm4sIGFycikge1xyXG4gIGFyci5mb3JFYWNoKGZuKTtcclxufSk7XHJcblxyXG4vKipcclxuICogTWFwcyBhIGZ1bmN0aW9uIHRvIGFuIGFycmF5XHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cclxuICovXHJcbmV4cG9ydCBjb25zdCBtYXAgPSBjdXJyeShmdW5jdGlvbiAoZm4sIGFycikge1xyXG4gIHJldHVybiBhcnIubWFwKGZuKTtcclxufSk7XHJcblxyXG4vKipcclxuICogQXBwbGllcyBhIGZpbHRlciB0byBhbiBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxyXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHJldHVybiB7ZnVuY3Rpb259XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZmlsdGVyID0gY3VycnkoZnVuY3Rpb24gKGZuLCBhcnIpIHtcclxuICByZXR1cm4gYXJyLmZpbHRlcihmbik7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIEFwcGxpZXMgYSBzb21lIHRvIGFuIGFycmF5XHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cclxuICovXHJcbmV4cG9ydCBjb25zdCBzb21lID0gY3VycnkoZnVuY3Rpb24gKGZuLCBhcnIpIHtcclxuICByZXR1cm4gYXJyLnNvbWUoZm4pO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgYW4gYXJyYXkgY29udGFpbnMgYSB2YWx1ZVxyXG4gKlxyXG4gKiBAcGFyYW0geyp9IHZhbHVlXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cclxuICovXHJcbmV4cG9ydCBjb25zdCBjb250YWlucyA9IGN1cnJ5KGZ1bmN0aW9uICh2YWx1ZSwgYXJyKSB7XHJcbiAgcmV0dXJuIGFyci5pbmRleE9mKHZhbHVlKSAhPSAtMTtcclxufSk7XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhbiBhcnJheSB3aXRob3V0IHRoZSBzdXBwbGllZCB2YWx1ZXNcclxuICpcclxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cclxuICovXHJcbmV4cG9ydCBjb25zdCB3aXRob3V0ID0gY3VycnkoZnVuY3Rpb24gKHZhbHVlcywgYXJyKSB7XHJcbiAgcmV0dXJuIGZpbHRlcih2YWx1ZSA9PiAhY29udGFpbnModmFsdWUsIHZhbHVlcyksIGFycilcclxufSk7XHJcblxyXG4vKipcclxuICogVGFrZXMgYSBzdHJpbmcgdGhhdCBpcyBlaXRoZXIgJ3RydWUnIG9yICdmYWxzZScgYW5kIHJldHVybnMgdGhlIG9wcG9zaXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBib29sXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGludmVyc2VCb29sZWFuU3RyaW5nID0gZnVuY3Rpb24gKGJvb2wpIHtcclxuICByZXR1cm4gKGJvb2wgIT09ICd0cnVlJykudG9TdHJpbmcoKTtcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi8uLi9oNXAtc2RrL3NyYy9zY3JpcHRzL3V0aWxzL2Z1bmN0aW9uYWwuanMiLCJpbXBvcnQge2N1cnJ5LCBpbnZlcnNlQm9vbGVhblN0cmluZ30gZnJvbSAnLi9mdW5jdGlvbmFsJ1xyXG5cclxuLyoqXHJcbiAqIEdldCBhbiBhdHRyaWJ1dGUgdmFsdWUgZnJvbSBlbGVtZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZ2V0QXR0cmlidXRlID0gY3VycnkoKG5hbWUsIGVsKSA9PiBlbC5nZXRBdHRyaWJ1dGUobmFtZSkpO1xyXG5cclxuLyoqXHJcbiAqIFNldCBhbiBhdHRyaWJ1dGUgb24gYSBodG1sIGVsZW1lbnRcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHNldEF0dHJpYnV0ZSA9IGN1cnJ5KChuYW1lLCB2YWx1ZSwgZWwpID0+IGVsLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSkpO1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBhdHRyaWJ1dGUgZnJvbSBodG1sIGVsZW1lbnRcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcmVtb3ZlQXR0cmlidXRlID0gY3VycnkoKG5hbWUsIGVsKSA9PiBlbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSkpO1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGVsZW1lbnQgaGFzIGFuIGF0dHJpYnV0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHJldHVybiB7Ym9vbGVhbn1cclxuICovXHJcbmV4cG9ydCBjb25zdCBoYXNBdHRyaWJ1dGUgPSBjdXJyeSgobmFtZSwgZWwpID0+IGVsLmhhc0F0dHJpYnV0ZShuYW1lKSk7XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZWxlbWVudCBoYXMgYW4gYXR0cmlidXRlIHRoYXQgZXF1YWxzXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHJldHVybiB7Ym9vbGVhbn1cclxuICovXHJcbmV4cG9ydCBjb25zdCBhdHRyaWJ1dGVFcXVhbHMgPSBjdXJyeSgobmFtZSwgdmFsdWUsIGVsKSA9PiBlbC5nZXRBdHRyaWJ1dGUobmFtZSkgPT09IHZhbHVlKTtcclxuXHJcbi8qKlxyXG4gKiBUb2dnbGVzIGFuIGF0dHJpYnV0ZSBiZXR3ZWVuICd0cnVlJyBhbmQgJ2ZhbHNlJztcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgdG9nZ2xlQXR0cmlidXRlID0gY3VycnkoKG5hbWUsIGVsKSA9PiB7XHJcbiAgY29uc3QgdmFsdWUgPSBnZXRBdHRyaWJ1dGUobmFtZSwgZWwpO1xyXG4gIHNldEF0dHJpYnV0ZShuYW1lLCBpbnZlcnNlQm9vbGVhblN0cmluZyh2YWx1ZSksIGVsKTtcclxufSk7XHJcblxyXG4vKipcclxuICogVGhlIGFwcGVuZENoaWxkKCkgbWV0aG9kIGFkZHMgYSBub2RlIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Qgb2YgY2hpbGRyZW4gb2YgYSBzcGVjaWZpZWQgcGFyZW50IG5vZGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjaGlsZFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgYXBwZW5kQ2hpbGQgPSBjdXJyeSgocGFyZW50LCBjaGlsZCkgPT4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKSk7XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IGlzIGEgZGVzY2VuZGFudCBvZiB0aGUgZWxlbWVudCBvbiB3aGljaCBpdCBpcyBpbnZva2VkXHJcbiAqIHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIGdyb3VwIG9mIHNlbGVjdG9ycy5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICovXHJcbmV4cG9ydCBjb25zdCBxdWVyeVNlbGVjdG9yID0gY3VycnkoKHNlbGVjdG9yLCBlbCkgPT4gZWwucXVlcnlTZWxlY3RvcihzZWxlY3RvcikpO1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYSBub24tbGl2ZSBOb2RlTGlzdCBvZiBhbGwgZWxlbWVudHMgZGVzY2VuZGVkIGZyb20gdGhlIGVsZW1lbnQgb24gd2hpY2ggaXRcclxuICogaXMgaW52b2tlZCB0aGF0IG1hdGNoZXMgdGhlIHNwZWNpZmllZCBncm91cCBvZiBDU1Mgc2VsZWN0b3JzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEByZXR1cm4ge05vZGVMaXN0fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHF1ZXJ5U2VsZWN0b3JBbGwgPSBjdXJyeSgoc2VsZWN0b3IsIGVsKSA9PiBlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XHJcblxyXG4vKipcclxuICogVGhlIHJlbW92ZUNoaWxkKCkgbWV0aG9kIHJlbW92ZXMgYSBjaGlsZCBub2RlIGZyb20gdGhlIERPTS4gUmV0dXJucyByZW1vdmVkIG5vZGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7Tm9kZX0gcGFyZW50XHJcbiAqIEBwYXJhbSB7Tm9kZX0gb2xkQ2hpbGRcclxuICpcclxuICogQHJldHVybiB7Tm9kZX1cclxuICovXHJcbmV4cG9ydCBjb25zdCByZW1vdmVDaGlsZCA9IGN1cnJ5KChwYXJlbnQsIG9sZENoaWxkKSA9PiBwYXJlbnQucmVtb3ZlQ2hpbGQob2xkQ2hpbGQpKTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBub2RlIGhhcyBhIGNsYXNzXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbHNcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY2xhc3NMaXN0Q29udGFpbnMgPSBjdXJyeSgoY2xzLCBlbCkgPT4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNscykpO1xyXG5cclxuLyoqXHJcbiAqIFRyYW5zZm9ybXMgYSBOb2RlTGlzdCB0byBhbiBBcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge05vZGVMaXN0fSBub2RlTGlzdFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtOb2RlW119XHJcbiAqL1xyXG5leHBvcnQgY29uc3Qgbm9kZUxpc3RUb0FycmF5ID0gbm9kZUxpc3QgPT4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZUxpc3QpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvdXRpbHMvZWxlbWVudHMuanMiLCIvKipcclxuICogQHR5cGVkZWYge29iamVjdH0gQ29udGVudFR5cGVcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1hY2hpbmVOYW1lXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtYWpvclZlcnNpb25cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1pbm9yVmVyc2lvblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcGF0Y2hWZXJzaW9uXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBoNXBNYWpvclZlcnNpb25cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGg1cE1pbm9yVmVyc2lvblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gc3VtbWFyeVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZGVzY3JpcHRpb25cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGljb25cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNyZWF0ZWRBdFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdXBkYXRlZF9BdFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaXNSZWNvbW1lbmRlZFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcG9wdWxhcml0eVxyXG4gKiBAcHJvcGVydHkge29iamVjdFtdfSBzY3JlZW5zaG90c1xyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbGljZW5zZVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZXhhbXBsZVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdHV0b3JpYWxcclxuICogQHByb3BlcnR5IHtzdHJpbmdbXX0ga2V5d29yZHNcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG93bmVyXHJcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaW5zdGFsbGVkXHJcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gcmVzdHJpY3RlZFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHViU2VydmljZXMge1xyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhcGlSb290VXJsXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoeyBhcGlSb290VXJsIH0pIHtcclxuICAgIHRoaXMuYXBpUm9vdFVybCA9IGFwaVJvb3RVcmw7XHJcblxyXG4gICAgaWYoIXdpbmRvdy5jYWNoZWRDb250ZW50VHlwZXMpe1xyXG4gICAgICAvLyBUT0RPIHJlbW92ZSB0aGlzIHdoZW4gZG9uZSB0ZXN0aW5nIGZvciBlcnJvcnNcclxuICAgICAgLy8gd2luZG93LmNhY2hlZENvbnRlbnRUeXBlcyA9IGZldGNoKGAke3RoaXMuYXBpUm9vdFVybH1lcnJvcnMvTk9fUkVTUE9OU0UuanNvbmAsIHtcclxuXHJcbiAgICAgIHdpbmRvdy5jYWNoZWRDb250ZW50VHlwZXMgPSBmZXRjaChgJHt0aGlzLmFwaVJvb3RVcmx9Y29udGVudC10eXBlLWNhY2hlYCwge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJ1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0Lmpzb24oKSlcclxuICAgICAgLnRoZW4odGhpcy5pc1ZhbGlkKVxyXG4gICAgICAudGhlbihqc29uID0+IGpzb24ubGlicmFyaWVzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7Q29udGVudFR5cGVbXXxFcnJvck1lc3NhZ2V9IHJlc3BvbnNlXHJcbiAgICogQHJldHVybiB7UHJvbWlzZTxDb250ZW50VHlwZVtdfEVycm9yTWVzc2FnZT59XHJcbiAgICovXHJcbiAgaXNWYWxpZChyZXNwb25zZSkge1xyXG4gICAgaWYgKHJlc3BvbnNlLm1lc3NhZ2VDb2RlKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXNwb25zZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgbGlzdCBvZiBjb250ZW50IHR5cGVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxDb250ZW50VHlwZVtdPn1cclxuICAgKi9cclxuICBjb250ZW50VHlwZXMoKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmNhY2hlZENvbnRlbnRUeXBlcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBDb250ZW50IFR5cGVcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYWNoaW5lTmFtZVxyXG4gICAqXHJcbiAgICogQHJldHVybiB7UHJvbWlzZS48Q29udGVudFR5cGU+fVxyXG4gICAqL1xyXG4gIGNvbnRlbnRUeXBlKG1hY2hpbmVOYW1lKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmNhY2hlZENvbnRlbnRUeXBlcy50aGVuKGNvbnRlbnRUeXBlcyA9PiB7XHJcbiAgICAgIHJldHVybiBjb250ZW50VHlwZXMuZmlsdGVyKGNvbnRlbnRUeXBlID0+IGNvbnRlbnRUeXBlLm1hY2hpbmVOYW1lID09PSBtYWNoaW5lTmFtZSlbMF07XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKnJldHVybiBmZXRjaChgJHt0aGlzLmFwaVJvb3RVcmx9Y29udGVudF90eXBlX2NhY2hlLyR7aWR9YCwge1xyXG4gICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnXHJcbiAgICB9KS50aGVuKHJlc3VsdCA9PiByZXN1bHQuanNvbigpKTsqL1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5zdGFsbHMgYSBjb250ZW50IHR5cGUgb24gdGhlIHNlcnZlclxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxDb250ZW50VHlwZT59XHJcbiAgICovXHJcbiAgaW5zdGFsbENvbnRlbnRUeXBlKGlkKSB7XHJcbiAgICByZXR1cm4gZmV0Y2gobnMuZ2V0QWpheFVybCgnbGlicmFyeS1pbnN0YWxsJywge2lkOiBpZH0pLCB7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxyXG4gICAgICBib2R5OiAnJ1xyXG4gICAgfSkudGhlbihyZXN1bHQgPT4gcmVzdWx0Lmpzb24oKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGxvYWRzIGEgY29udGVudCB0eXBlIHRvIHRoZSBzZXJ2ZXIgZm9yIHZhbGlkYXRpb25cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Rm9ybURhdGF9IGZvcm1EYXRhIEZvcm0gY29udGFpbmluZyB0aGUgaDVwIHRoYXQgc2hvdWxkIGJlIHVwbG9hZGVkIGFzICdoNXAnXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBSZXR1cm5zIHRoZSBwcm9taXNlIG9mIGEganNvbiBjb250YWluaW5nIHRoZSBjb250ZW50IGpzb24gYW5kIHRoZSBoNXAganNvblxyXG4gICAqL1xyXG4gIHVwbG9hZENvbnRlbnQoZm9ybURhdGEpIHtcclxuICAgIHJldHVybiBmZXRjaChgJHt0aGlzLmFwaVJvb3RVcmx9bGlicmFyeS11cGxvYWRgLCB7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxyXG4gICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgfSkudGhlbihyZXN1bHQgPT4gcmVzdWx0Lmpzb24oKSk7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL2h1Yi1zZXJ2aWNlcy5qcyIsIi8qKlxyXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgY29uZmlnLnR5cGUgICAgICAgICB0eXBlIG9mIHRoZSBtZXNzYWdlOiBpbmZvLCBzdWNjZXNzLCBlcnJvclxyXG4gKiBAcGFyYW0gIHtib29sZWFufSAgY29uZmlnLmRpc21pc3NpYmxlICB3aGV0aGVyIHRoZSBtZXNzYWdlIGNhbiBiZSBkaXNtaXNzZWRcclxuICogQHBhcmFtICB7c3RyaW5nfSAgIGNvbmZpZy5jb250ZW50ICAgICAgbWVzc2FnZSBjb250ZW50IHVzdWFsbHkgYSAnaDMnIGFuZCBhICdwJ1xyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gZGl2IGNvbnRhaW5pbmcgdGhlIG1lc3NhZ2UgZWxlbWVudFxyXG4gKi9cclxuXHJcbi8vVE9ETyBoYW5kbGUgc3RyaW5ncywgaHRtbCwgYmFkbHkgZm9ybWVkIG9iamVjdFxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW5kZXJFcnJvck1lc3NhZ2UobWVzc2FnZSkge1xyXG4gIC8vIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xyXG4gIGNvbnN0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgY2xvc2VCdXR0b24uY2xhc3NOYW1lID0gJ2Nsb3NlJztcclxuICBjbG9zZUJ1dHRvbi5pbm5lckhUTUwgPSAnJiN4MjcxNSc7XHJcblxyXG4gIGNvbnN0IG1lc3NhZ2VDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgbWVzc2FnZUNvbnRlbnQuY2xhc3NOYW1lID0gJ21lc3NhZ2UtY29udGVudCc7XHJcbiAgbWVzc2FnZUNvbnRlbnQuaW5uZXJIVE1MID0gJzxoMT4nICsgbWVzc2FnZS50aXRsZSArICc8L2gxPicgKyAnPHA+JyArIG1lc3NhZ2UuY29udGVudCArICc8L3A+JztcclxuXHJcbiAgY29uc3QgbWVzc2FnZVdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBtZXNzYWdlV3JhcHBlci5jbGFzc05hbWUgPSAnbWVzc2FnZScgKyAnICcgKyBgJHttZXNzYWdlLnR5cGV9YCArIChtZXNzYWdlLmRpc21pc3NpYmxlID8gJyBkaXNtaXNzaWJsZScgOiAnJyk7XHJcbiAgbWVzc2FnZVdyYXBwZXIuYXBwZW5kQ2hpbGQoY2xvc2VCdXR0b24pO1xyXG4gIG1lc3NhZ2VXcmFwcGVyLmFwcGVuZENoaWxkKG1lc3NhZ2VDb250ZW50KTtcclxuXHJcbiAgaWYgKG1lc3NhZ2UuYnV0dG9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgIGNvbnN0IG1lc3NhZ2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgIG1lc3NhZ2VCdXR0b24uY2xhc3NOYW1lID0gJ2J1dHRvbic7XHJcbiAgICBtZXNzYWdlQnV0dG9uLmlubmVySFRNTCA9IG1lc3NhZ2UuYnV0dG9uO1xyXG4gICAgbWVzc2FnZVdyYXBwZXIuYXBwZW5kQ2hpbGQobWVzc2FnZUJ1dHRvbik7XHJcbiAgfVxyXG5cclxuICBjb25zb2xlLmxvZyhtZXNzYWdlV3JhcHBlcik7XHJcbiAgcmV0dXJuIG1lc3NhZ2VXcmFwcGVyO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy91dGlscy9lcnJvcnMuanMiLCJpbXBvcnQgeyBjdXJyeSB9IGZyb20gXCJ1dGlscy9mdW5jdGlvbmFsXCI7XHJcblxyXG4vKipcclxuICogIFRyYW5zZm9ybXMgYSBET00gY2xpY2sgZXZlbnQgaW50byBhbiBFdmVudGZ1bCdzIGV2ZW50XHJcbiAqICBAc2VlIEV2ZW50ZnVsXHJcbiAqXHJcbiAqIEBwYXJhbSAge3N0cmluZyB8IE9iamVjdH0gdHlwZVxyXG4gKiBAcGFyYW0gIHtFdmVudGZ1bH0gZXZlbnRmdWxcclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcmVsYXlDbGlja0V2ZW50QXMgPSBjdXJyeShmdW5jdGlvbih0eXBlLCBldmVudGZ1bCwgZWxlbWVudCkge1xyXG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICBldmVudGZ1bC5maXJlKHR5cGUsIHtcclxuICAgICAgZWxlbWVudDogZWxlbWVudCxcclxuICAgICAgaWQ6IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJylcclxuICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAvLyBkb24ndCBidWJibGVcclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gZWxlbWVudDtcclxufSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL3V0aWxzL2V2ZW50cy5qcyIsImltcG9ydCB7c2V0QXR0cmlidXRlLCBhdHRyaWJ1dGVFcXVhbHMsIHRvZ2dsZUF0dHJpYnV0ZX0gZnJvbSAnLi4vdXRpbHMvZWxlbWVudHMnO1xyXG5pbXBvcnQge2N1cnJ5LCBmb3JFYWNofSBmcm9tICcuLi91dGlscy9mdW5jdGlvbmFsJztcclxuXHJcbi8qKlxyXG4gKiBAdHlwZSB7ZnVuY3Rpb259XHJcbiAqL1xyXG5jb25zdCBpc0V4cGFuZGVkID0gYXR0cmlidXRlRXF1YWxzKFwiYXJpYS1leHBhbmRlZFwiLCAndHJ1ZScpO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtmdW5jdGlvbn1cclxuICovXHJcbmNvbnN0IGhpZGUgPSBzZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZSB7ZnVuY3Rpb259XHJcbiAqL1xyXG5jb25zdCBzaG93ID0gc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZXMgdGhlIGJvZHkgdmlzaWJpbGl0eVxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBib2R5RWxlbWVudFxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRXhwYW5kZWRcclxuICovXHJcbmNvbnN0IHRvZ2dsZUJvZHlWaXNpYmlsaXR5ID0gZnVuY3Rpb24oYm9keUVsZW1lbnQsIGlzRXhwYW5kZWQpIHtcclxuICBpZighaXNFeHBhbmRlZCkge1xyXG4gICAgaGlkZShib2R5RWxlbWVudCk7XHJcbiAgICAvL2JvZHlFbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiMFwiO1xyXG4gIH1cclxuICBlbHNlIC8qaWYoYm9keUVsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gMCkqLyB7XHJcbiAgICBzaG93KGJvZHlFbGVtZW50KTtcclxuICAgIC8vYm9keUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7Ym9keUVsZW1lbnQuc2Nyb2xsSGVpZ2h0fXB4YDtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogSGFuZGxlcyBjaGFuZ2VzIHRvIGFyaWEtZXhwYW5kZWRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gYm9keUVsZW1lbnRcclxuICogQHBhcmFtIHtNdXRhdGlvblJlY29yZH0gZXZlbnRcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5jb25zdCBvbkFyaWFFeHBhbmRlZENoYW5nZSA9IGN1cnJ5KGZ1bmN0aW9uKGJvZHlFbGVtZW50LCBldmVudCkge1xyXG4gIHRvZ2dsZUJvZHlWaXNpYmlsaXR5KGJvZHlFbGVtZW50LCBpc0V4cGFuZGVkKGV2ZW50LnRhcmdldCkpO1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplcyBhIHBhbmVsXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbml0KGVsZW1lbnQpIHtcclxuICBjb25zdCB0aXRsZUVsID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1leHBhbmRlZF0nKTtcclxuICBjb25zdCBib2R5SWQgPSB0aXRsZUVsLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xyXG4gIGNvbnN0IGJvZHlFbCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgIyR7Ym9keUlkfWApO1xyXG5cclxuICBpZih0aXRsZUVsKSB7XHJcbiAgICAvLyBzZXQgb2JzZXJ2ZXIgb24gdGl0bGUgZm9yIGFyaWEtZXhwYW5kZWRcclxuICAgIGxldCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZvckVhY2gob25BcmlhRXhwYW5kZWRDaGFuZ2UoYm9keUVsKSkpO1xyXG5cclxuICAgIG9ic2VydmVyLm9ic2VydmUodGl0bGVFbCwge1xyXG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxyXG4gICAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcclxuICAgICAgYXR0cmlidXRlRmlsdGVyOiBbXCJhcmlhLWV4cGFuZGVkXCJdXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBTZXQgY2xpY2sgbGlzdGVuZXIgdGhhdCB0b2dnbGVzIGFyaWEtZXhwYW5kZWRcclxuICAgIHRpdGxlRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICB0b2dnbGVBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIGV2ZW50LnRhcmdldCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0b2dnbGVCb2R5VmlzaWJpbGl0eShib2R5RWwsIGlzRXhwYW5kZWQodGl0bGVFbCkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGVsZW1lbnQ7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi8uLi9oNXAtc2RrL3NyYy9zY3JpcHRzL2NvbXBvbmVudHMvcGFuZWwuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhacFpYZENiM2c5SWpBZ01DQTBNREFnTWpJMUlqNE5DaUFnUEdSbFpuTStEUW9nSUNBZ1BITjBlV3hsUGcwS0lDQWdJQ0FnTG1Oc2N5MHhJSHNOQ2lBZ0lDQWdJR1pwYkd3NklHNXZibVU3RFFvZ0lDQWdJQ0I5RFFvTkNpQWdJQ0FnSUM1amJITXRNaUI3RFFvZ0lDQWdJQ0JtYVd4c09pQWpZelpqTm1NM093MEtJQ0FnSUNBZ2ZRMEtEUW9nSUNBZ0lDQXVZMnh6TFRNc0lDNWpiSE10TkNCN0RRb2dJQ0FnSUNCbWFXeHNPaUFqWm1abU93MEtJQ0FnSUNBZ2ZRMEtEUW9nSUNBZ0lDQXVZMnh6TFRNZ2V3MEtJQ0FnSUNBZ2IzQmhZMmwwZVRvZ01DNDNPdzBLSUNBZ0lDQWdmUTBLSUNBZ0lEd3ZjM1I1YkdVK0RRb2dJRHd2WkdWbWN6NE5DaUFnUEhScGRHeGxQbU52Ym5SbGJuUWdkSGx3WlNCd2JHRmpaV2h2YkdSbGNsOHlQQzkwYVhSc1pUNE5DaUFnUEdjZ2FXUTlJa3hoZVdWeVh6SWlJR1JoZEdFdGJtRnRaVDBpVEdGNVpYSWdNaUkrRFFvZ0lDQWdQR2NnYVdROUltTnZiblJsYm5SZmRIbHdaVjl3YkdGalpXaHZiR1JsY2kweFgyTnZjSGtpSUdSaGRHRXRibUZ0WlQwaVkyOXVkR1Z1ZENCMGVYQmxJSEJzWVdObGFHOXNaR1Z5TFRFZ1kyOXdlU0krRFFvZ0lDQWdJQ0E4Y21WamRDQmpiR0Z6Y3owaVkyeHpMVEVpSUhkcFpIUm9QU0kwTURBaUlHaGxhV2RvZEQwaU1qSTFJaTgrRFFvZ0lDQWdJQ0E4Y21WamRDQmpiR0Z6Y3owaVkyeHpMVElpSUhnOUlqRXhNaTQxTVNJZ2VUMGlORE11TkRFaUlIZHBaSFJvUFNJeE56WXVPVFlpSUdobGFXZG9kRDBpTVRNMUxqUTFJaUJ5ZUQwaU1UQWlJSEo1UFNJeE1DSXZQZzBLSUNBZ0lDQWdQR05wY21Oc1pTQmpiR0Z6Y3owaVkyeHpMVE1pSUdONFBTSXhNell1TmpZaUlHTjVQU0kyTVM0NU9DSWdjajBpTkM0NE1TSXZQZzBLSUNBZ0lDQWdQR05wY21Oc1pTQmpiR0Z6Y3owaVkyeHpMVE1pSUdONFBTSXhOVEV1TkRraUlHTjVQU0kyTVM0NU9DSWdjajBpTkM0NE1TSXZQZzBLSUNBZ0lDQWdQR05wY21Oc1pTQmpiR0Z6Y3owaVkyeHpMVE1pSUdONFBTSXhOall1TVNJZ1kzazlJall4TGprNElpQnlQU0kwTGpneElpOCtEUW9nSUNBZ0lDQThaeUJwWkQwaVgwZHliM1Z3WHlJZ1pHRjBZUzF1WVcxbFBTSW1iSFE3UjNKdmRYQW1aM1E3SWo0TkNpQWdJQ0FnSUNBZ1BHY2dhV1E5SWw5SGNtOTFjRjh5SWlCa1lYUmhMVzVoYldVOUlpWnNkRHRIY205MWNDWm5kRHNpUGcwS0lDQWdJQ0FnSUNBZ0lEeHdZWFJvSUdsa1BTSmZRMjl0Y0c5MWJtUmZVR0YwYUY4aUlHUmhkR0V0Ym1GdFpUMGlKbXgwTzBOdmJYQnZkVzVrSUZCaGRHZ21aM1E3SWlCamJHRnpjejBpWTJ4ekxUUWlJR1E5SWsweU5qTXVNamdzT1RVdU1qRkRNall3TERreUxqQTNMREkxTlN3NU1TNDFMREkwT0M0ME15dzVNUzQxU0RJeU4zWTRTREU1T1M0MWJDMHlMakUzTERFd0xqSTBZVEkxTGpnMExESTFMamcwTERBc01Dd3hMREV4TGpRNExURXVOak1zTVRrdU9UTXNNVGt1T1RNc01Dd3dMREVzTVRRdU16a3NOUzQxTnl3eE9DNHlOaXd4T0M0eU5pd3dMREFzTVN3MUxqVXlMREV6TGpZc01qTXVNVEVzTWpNdU1URXNNQ3d3TERFdE1pNDROQ3d4TVM0d05Td3hPQzQyTlN3eE9DNDJOU3d3TERBc01TMDRMakEyTERjdU56a3NPU3c1TERBc01Dd3hMVFF1TVRJc01TNHpOMGd5TXpaMkxUSXhhREV3TGpReVl6Y3VNellzTUN3eE1pNDRNeTB4TGpZeExERTJMalF5TFRWek5TNHpPQzAzTGpRNExEVXVNemd0TVRNdU5EUkRNalk0TGpJeUxERXdNaTR5T1N3eU5qWXVOVGNzT1RndU16VXNNall6TGpJNExEazFMakl4V20wdE1UVXNNVGRqTFRFdU5ESXNNUzR5TWkwekxqa3NNUzR5TlMwM0xqUXhMREV1TWpWSU1qTTJkaTB4TkdnMUxqWXlZVGt1TlRjc09TNDFOeXd3TERBc01TdzNMREl1T1RNc055NHdOU3czTGpBMUxEQXNNQ3d4TERFdU9EVXNOQzQ1TWtFMkxqTXpMRFl1TXpNc01Dd3dMREVzTWpRNExqTXhMREV4TWk0eU5Wb2lMejROQ2lBZ0lDQWdJQ0FnSUNBOGNHRjBhQ0JwWkQwaVgxQmhkR2hmSWlCa1lYUmhMVzVoYldVOUlpWnNkRHRRWVhSb0ptZDBPeUlnWTJ4aGMzTTlJbU5zY3kwMElpQmtQU0pOTWpBeUxqa3NNVEU1TGpFeFlUZ3VNVElzT0M0eE1pd3dMREFzTUMwM0xqSTRMRFF1TlRKc0xURTJMVEV1TWpJc055NHlNaTB6TUM0NU1rZ3hOelIyTWpKSU1UVXpkaTB5TWtneE16WjJOVFpvTVRkMkxUSXhhREl4ZGpJeGFESXdMak14WXkweUxqY3lMREF0TlMweExqVXpMVGN0TTJFeE9TNHhPU3d4T1M0eE9Td3dMREFzTVMwMExqY3pMVFF1T0RNc01qTXVOVGdzTWpNdU5UZ3NNQ3d3TERFdE15MDJMalpzTVRZdE1pNHlObUU0TGpFeExEZ3VNVEVzTUN3eExEQXNOeTR5TmkweE1TNDNNbG9pTHo0TkNpQWdJQ0FnSUNBZ1BDOW5QZzBLSUNBZ0lDQWdQQzluUGcwS0lDQWdJQ0FnUEhKbFkzUWdZMnhoYzNNOUltTnNjeTB6SWlCNFBTSXhOemN1TmpZaUlIazlJalUzTGpZMklpQjNhV1IwYUQwaU9USXVNamdpSUdobGFXZG9kRDBpT1M0ek9DSWdjbmc5SWpNdU5TSWdjbms5SWpNdU5TSXZQZzBLSUNBZ0lEd3ZaejROQ2lBZ1BDOW5QZzBLUEM5emRtYytEUW89XCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWFnZXMvY29udGVudC10eXBlLXBsYWNlaG9sZGVyLnN2Z1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgSHViVmlldyBmcm9tICcuL2h1Yi12aWV3JztcclxuaW1wb3J0IENvbnRlbnRUeXBlU2VjdGlvbiBmcm9tICcuL2NvbnRlbnQtdHlwZS1zZWN0aW9uL2NvbnRlbnQtdHlwZS1zZWN0aW9uJztcclxuaW1wb3J0IFVwbG9hZFNlY3Rpb24gZnJvbSAnLi91cGxvYWQtc2VjdGlvbi91cGxvYWQtc2VjdGlvbic7XHJcbmltcG9ydCBIdWJTZXJ2aWNlcyBmcm9tICcuL2h1Yi1zZXJ2aWNlcyc7XHJcbmltcG9ydCB7IEV2ZW50ZnVsIH0gZnJvbSAnLi9taXhpbnMvZXZlbnRmdWwnO1xyXG5pbXBvcnQge3JlbmRlckVycm9yTWVzc2FnZX0gZnJvbSAnLi91dGlscy9lcnJvcnMnO1xyXG4vKipcclxuICogQHR5cGVkZWYge29iamVjdH0gSHViU3RhdGVcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRpdGxlXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzZWN0aW9uSWRcclxuICogQHByb3BlcnR5IHtib29sZWFufSBleHBhbmRlZFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYXBpUm9vdFVybFxyXG4gKi9cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtvYmplY3R9IEVycm9yTWVzc2FnZVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbWVzc2FnZVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZXJyb3JDb2RlXHJcbiAqL1xyXG4vKipcclxuICogQHR5cGVkZWYge29iamVjdH0gU2VsZWN0ZWRFbGVtZW50XHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkXHJcbiAqL1xyXG4vKipcclxuICogU2VsZWN0IGV2ZW50XHJcbiAqIEBldmVudCBIdWIjc2VsZWN0XHJcbiAqIEB0eXBlIHtTZWxlY3RlZEVsZW1lbnR9XHJcbiAqL1xyXG4vKipcclxuICogRXJyb3IgZXZlbnRcclxuICogQGV2ZW50IEh1YiNlcnJvclxyXG4gKiBAdHlwZSB7RXJyb3JNZXNzYWdlfVxyXG4gKi9cclxuLyoqXHJcbiAqIFVwbG9hZCBldmVudFxyXG4gKiBAZXZlbnQgSHViI3VwbG9hZFxyXG4gKiBAdHlwZSB7T2JqZWN0fVxyXG4gKi9cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBAbWl4ZXMgRXZlbnRmdWxcclxuICogQGZpcmVzIEh1YiNzZWxlY3RcclxuICogQGZpcmVzIEh1YiNlcnJvclxyXG4gKiBAZmlyZXMgSHViI3VwbG9hZFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHViIHtcclxuICAvKipcclxuICAgKiBAcGFyYW0ge0h1YlN0YXRlfSBzdGF0ZVxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICAvLyBhZGQgZXZlbnQgc3lzdGVtXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIEV2ZW50ZnVsKCkpO1xyXG5cclxuICAgIC8vIGNvbnRyb2xsZXJzXHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlU2VjdGlvbiA9IG5ldyBDb250ZW50VHlwZVNlY3Rpb24oc3RhdGUpO1xyXG4gICAgdGhpcy51cGxvYWRTZWN0aW9uID0gbmV3IFVwbG9hZFNlY3Rpb24oc3RhdGUpO1xyXG5cclxuICAgIC8vIHZpZXdzXHJcbiAgICB0aGlzLnZpZXcgPSBuZXcgSHViVmlldyhzdGF0ZSk7XHJcblxyXG4gICAgLy8gc2VydmljZXNcclxuICAgIHRoaXMuc2VydmljZXMgPSBuZXcgSHViU2VydmljZXMoe1xyXG4gICAgICBhcGlSb290VXJsOiBzdGF0ZS5hcGlSb290VXJsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBwcm9wYWdhdGUgY29udHJvbGxlciBldmVudHNcclxuICAgIHRoaXMucHJvcGFnYXRlKFsnc2VsZWN0JywgJ2Vycm9yJ10sIHRoaXMuY29udGVudFR5cGVTZWN0aW9uKTtcclxuICAgIHRoaXMucHJvcGFnYXRlKFsndXBsb2FkJ10sIHRoaXMudXBsb2FkU2VjdGlvbik7XHJcblxyXG4gICAgLy8gaGFuZGxlIGV2ZW50c1xyXG4gICAgdGhpcy5vbignc2VsZWN0JywgdGhpcy5zZXRQYW5lbFRpdGxlLCB0aGlzKTtcclxuICAgIHRoaXMub24oJ3NlbGVjdCcsIHRoaXMudmlldy5jbG9zZVBhbmVsLCB0aGlzLnZpZXcpO1xyXG4gICAgdGhpcy52aWV3Lm9uKCd0YWItY2hhbmdlJywgdGhpcy52aWV3LnNldFNlY3Rpb25UeXBlLCB0aGlzLnZpZXcpO1xyXG4gICAgdGhpcy52aWV3Lm9uKCdwYW5lbC1jaGFuZ2UnLCB0aGlzLnZpZXcudG9nZ2xlUGFuZWxPcGVuLmJpbmQodGhpcy52aWV3KSwgdGhpcy52aWV3KTtcclxuXHJcbiAgICB0aGlzLmluaXRUYWJQYW5lbChzdGF0ZSlcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHByb21pc2Ugb2YgYSBjb250ZW50IHR5cGVcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWFjaGluZU5hbWVcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxDb250ZW50VHlwZT59XHJcbiAgICovXHJcbiAgZ2V0Q29udGVudFR5cGUobWFjaGluZU5hbWUpIHtcclxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VzLmNvbnRlbnRUeXBlKG1hY2hpbmVOYW1lKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIHRpdGxlIG9mIHRoZSBwYW5lbFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXHJcbiAgICovXHJcbiAgc2V0UGFuZWxUaXRsZSh7aWR9KcKge1xyXG4gICAgdGhpcy5nZXRDb250ZW50VHlwZShpZCkudGhlbigoe3RpdGxlfSkgPT4gdGhpcy52aWV3LnNldFRpdGxlKHRpdGxlKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbml0aWF0ZXMgdGhlIHRhYiBwYW5lbFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3Rpb25JZFxyXG4gICAqL1xyXG4gIGluaXRUYWJQYW5lbCh7IHNlY3Rpb25JZCA9ICdjb250ZW50LXR5cGVzJyB9KSB7XHJcbiAgICBjb25zdCB0YWJDb25maWdzID0gW3tcclxuICAgICAgdGl0bGU6ICdDcmVhdGUgQ29udGVudCcsXHJcbiAgICAgIGlkOiAnY29udGVudC10eXBlcycsXHJcbiAgICAgIGNvbnRlbnQ6IHRoaXMuY29udGVudFR5cGVTZWN0aW9uLmdldEVsZW1lbnQoKSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHRpdGxlOiAnVXBsb2FkJyxcclxuICAgICAgaWQ6ICd1cGxvYWQnLFxyXG4gICAgICBjb250ZW50OiB0aGlzLnVwbG9hZFNlY3Rpb24uZ2V0RWxlbWVudCgpXHJcbiAgICB9XTtcclxuXHJcbiAgICAvLyBzZXRzIHRoZSBjb3JyZWN0IG9uZSBzZWxlY3RlZFxyXG4gICAgdGFiQ29uZmlnc1xyXG4gICAgICAuZmlsdGVyKGNvbmZpZyA9PiBjb25maWcuaWQgPT09IHNlY3Rpb25JZClcclxuICAgICAgLmZvckVhY2goY29uZmlnID0+IGNvbmZpZy5zZWxlY3RlZCA9IHRydWUpO1xyXG5cclxuICAgIHRhYkNvbmZpZ3MuZm9yRWFjaCh0YWJDb25maWcgPT4gdGhpcy52aWV3LmFkZFRhYih0YWJDb25maWcpKTtcclxuICAgIHRoaXMudmlldy5hZGRCb3R0b21Cb3JkZXIoKTsgLy8gQWRkcyBhbiBhbmltYXRlZCBib3R0b20gYm9yZGVyIHRvIGVhY2ggdGFiXHJcbiAgICB0aGlzLnZpZXcuaW5pdFRhYlBhbmVsKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSByb290IGVsZW1lbnQgaW4gdGhlIHZpZXdcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAqL1xyXG4gIGdldEVsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy52aWV3LmdldEVsZW1lbnQoKTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvaHViLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZXMvbWFpbi5zY3NzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHNldEF0dHJpYnV0ZSwgZ2V0QXR0cmlidXRlLCByZW1vdmVDaGlsZCB9IGZyb20gXCJ1dGlscy9lbGVtZW50c1wiO1xyXG5pbXBvcnQgeyBjdXJyeSB9IGZyb20gXCJ1dGlscy9mdW5jdGlvbmFsXCI7XHJcbmltcG9ydCB7IEV2ZW50ZnVsIH0gZnJvbSAnLi4vbWl4aW5zL2V2ZW50ZnVsJztcclxuaW1wb3J0IGluaXRQYW5lbCBmcm9tIFwiY29tcG9uZW50cy9wYW5lbFwiO1xyXG5pbXBvcnQgaW5pdEltYWdlU2Nyb2xsZXIgZnJvbSBcImNvbXBvbmVudHMvaW1hZ2Utc2Nyb2xsZXJcIjtcclxuaW1wb3J0IHsgcmVsYXlDbGlja0V2ZW50QXMgfSBmcm9tICcuLi91dGlscy9ldmVudHMnO1xyXG5pbXBvcnQgbm9JY29uIGZyb20gJy4uLy4uL2ltYWdlcy9jb250ZW50LXR5cGUtcGxhY2Vob2xkZXIuc3ZnJztcclxuXHJcbi8qKlxyXG4gKiBAY29uc3RhbnQge3N0cmluZ31cclxuICovXHJcbmNvbnN0IEFUVFJJQlVURV9DT05URU5UX1RZUEVfSUQgPSAnZGF0YS1pZCc7XHJcblxyXG4vKipcclxuICogQGNvbnN0YW50IHtudW1iZXJ9XHJcbiAqL1xyXG5jb25zdCBNQVhfVEVYVF9TSVpFX0RFU0NSSVBUSU9OID0gMzAwO1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuY29uc3QgaGlkZSA9IHNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuY29uc3Qgc2hvdyA9IHNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbi8qKlxyXG4gKiBUb2dnbGVzIHRoZSB2aXNpYmlsaXR5IGlmIGFuIGVsZW1lbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGVcclxuICovXHJcbmNvbnN0IHRvZ2dsZVZpc2liaWxpdHkgPSAoZWxlbWVudCwgdmlzaWJsZSkgPT4gKHZpc2libGUgPyBzaG93IDogaGlkZSkoZWxlbWVudCk7XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIGEgc3RyaW5nIGlzIGVtcHR5XHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XHJcbiAqXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VtcHR5ID0gKHRleHQpID0+ICh0eXBlb2YgdGV4dCA9PT0gJ3N0cmluZycpICYmICh0ZXh0Lmxlbmd0aCA9PT0gMCk7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEBtaXhlcyBFdmVudGZ1bFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudFR5cGVEZXRhaWxWaWV3IHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgLy8gYWRkIGV2ZW50IHN5c3RlbVxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBFdmVudGZ1bCgpKTtcclxuXHJcbiAgICAvLyBjcmVhdGUgdmlld1xyXG4gICAgdGhpcy5yb290RWxlbWVudCA9IHRoaXMuY3JlYXRlVmlldygpO1xyXG5cclxuICAgIC8vIGdyYWIgcmVmZXJlbmNlc1xyXG4gICAgdGhpcy51c2VCdXR0b24gPSB0aGlzLnJvb3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXR0b24tdXNlJyk7XHJcbiAgICB0aGlzLmluc3RhbGxCdXR0b24gPSB0aGlzLnJvb3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXR0b24taW5zdGFsbCcpO1xyXG4gICAgdGhpcy5pbWFnZSA9IHRoaXMucm9vdEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnQtdHlwZS1pbWFnZScpO1xyXG4gICAgdGhpcy50aXRsZSA9IHRoaXMucm9vdEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRleHQtZGV0YWlscyBoMycpO1xyXG4gICAgdGhpcy5vd25lciA9IHRoaXMucm9vdEVsZW1lbnQucXVlcnlTZWxlY3RvcignLm93bmVyJyk7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gdGhpcy5yb290RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dC1kZXRhaWxzIC5zbWFsbCcpO1xyXG4gICAgdGhpcy5kZW1vQnV0dG9uID0gdGhpcy5yb290RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGVtby1idXR0b24nKTtcclxuICAgIHRoaXMuY2Fyb3VzZWwgPSB0aGlzLnJvb3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJvdXNlbCcpO1xyXG4gICAgdGhpcy5jYXJvdXNlbExpc3QgPSB0aGlzLmNhcm91c2VsLnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XHJcbiAgICB0aGlzLmxpY2VuY2VQYW5lbCA9IHRoaXMucm9vdEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmxpY2VuY2UtcGFuZWwnKTtcclxuXHJcbiAgICAvLyBpbml0IGludGVyYWN0aXZlIGVsZW1lbnRzXHJcbiAgICBpbml0UGFuZWwodGhpcy5saWNlbmNlUGFuZWwpO1xyXG4gICAgaW5pdEltYWdlU2Nyb2xsZXIodGhpcy5jYXJvdXNlbCk7XHJcblxyXG4gICAgLy8gZmlyZSBldmVudHMgb24gYnV0dG9uIGNsaWNrXHJcbiAgICByZWxheUNsaWNrRXZlbnRBcygnY2xvc2UnLCB0aGlzLCB0aGlzLnJvb3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iYWNrLWJ1dHRvbicpKTtcclxuICAgIHJlbGF5Q2xpY2tFdmVudEFzKCdzZWxlY3QnLCB0aGlzLCB0aGlzLnVzZUJ1dHRvbik7XHJcbiAgICByZWxheUNsaWNrRXZlbnRBcygnaW5zdGFsbCcsIHRoaXMsIHRoaXMuaW5zdGFsbEJ1dHRvbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIHRoZSB2aWV3IGFzIGEgSFRNTEVsZW1lbnRcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAqL1xyXG4gIGNyZWF0ZVZpZXcgKCkge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSAnY29udGVudC10eXBlLWRldGFpbCc7XHJcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBgXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJiYWNrLWJ1dHRvbiBpY29uLWFycm93LXRoaWNrXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW1hZ2Utd3JhcHBlclwiPjxpbWcgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZSBjb250ZW50LXR5cGUtaW1hZ2VcIiBzcmM9XCIke25vSWNvbn1cIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1kZXRhaWxzXCI+XHJcbiAgICAgICAgICA8aDM+PC9oMz5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJvd25lclwiPjwvZGl2PlxyXG4gICAgICAgICAgPHAgY2xhc3M9XCJzbWFsbFwiPjwvcD5cclxuICAgICAgICAgIDxhIGNsYXNzPVwiYnV0dG9uIGRlbW8tYnV0dG9uXCIgdGFyZ2V0PVwiX2JsYW5rXCIgYXJpYS1oaWRkZW49XCJmYWxzZVwiIGhyZWY9XCJodHRwczovL2g1cC5vcmcvY2hhcnRcIj5Db250ZW50IERlbW88L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY2Fyb3VzZWxcIiByb2xlPVwicmVnaW9uXCIgZGF0YS1zaXplPVwiNVwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY2Fyb3VzZWwtYnV0dG9uIHByZXZpb3VzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgZGlzYWJsZWQ+PHNwYW4gY2xhc3M9XCJpY29uLWFycm93LXRoaWNrXCI+PC9zcGFuPjwvc3Bhbj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cImNhcm91c2VsLWJ1dHRvbiBuZXh0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgZGlzYWJsZWQ+PHNwYW4gY2xhc3M9XCJpY29uLWFycm93LXRoaWNrXCI+PC9zcGFuPjwvc3Bhbj5cclxuICAgICAgICA8bmF2IGNsYXNzPVwic2Nyb2xsZXJcIj5cclxuICAgICAgICAgIDx1bD48L3VsPlxyXG4gICAgICAgIDwvbmF2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGhyIC8+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tYmFyXCI+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJidXR0b24gYnV0dG9uLXByaW1hcnkgYnV0dG9uLXVzZVwiIGFyaWEtaGlkZGVuPVwiZmFsc2VcIiBkYXRhLWlkPVwiSDVQLkNoYXJ0XCI+VXNlPC9zcGFuPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiYnV0dG9uIGJ1dHRvbi1pbnZlcnNlLXByaW1hcnkgYnV0dG9uLWluc3RhbGxcIiBhcmlhLWhpZGRlbj1cInRydWVcIiBkYXRhLWlkPVwiSDVQLkNoYXJ0XCI+PHNwYW4gY2xhc3M9XCJpY29uLWFycm93LXRoaWNrXCI+PC9zcGFuPkluc3RhbGw8L3NwYW4+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtZ3JvdXBcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwgbGljZW5jZS1wYW5lbFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRlclwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGFyaWEtY29udHJvbHM9XCJsaWNlbmNlLXBhbmVsXCI+VGhlIExpY2VuY2UgSW5mbzwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIiBpZD1cImxpY2VuY2UtcGFuZWxcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHktaW5uZXJcIj48L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5gO1xyXG5cclxuICAgIHJldHVybiBlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlcyBhbGwgaW1hZ2VzIGZyb20gdGhlIGNhcm91c2VsXHJcbiAgICovXHJcbiAgcmVtb3ZlQWxsSW1hZ2VzSW5DYXJvdXNlbCgpIHtcclxuICAgIHRoaXMuY2Fyb3VzZWxMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykuZm9yRWFjaChyZW1vdmVDaGlsZCh0aGlzLmNhcm91c2VsTGlzdCkpO1xyXG4gICAgdGhpcy5jYXJvdXNlbC5xdWVyeVNlbGVjdG9yQWxsKCcuY2Fyb3VzZWwtbGlnaHRib3gnKS5mb3JFYWNoKHJlbW92ZUNoaWxkKHRoaXMuY2Fyb3VzZWwpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZCBpbWFnZSB0byB0aGUgY2Fyb3VzZWxcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpbWFnZVxyXG4gICAqL1xyXG4gIGFkZEltYWdlVG9DYXJvdXNlbChpbWFnZSkge1xyXG4gICAgLy8gYWRkIGxpZ2h0Ym94XHJcbiAgICBjb25zdCBsaWdodGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgbGlnaHRib3guaWQgPSBgbGlnaHRib3gtJHt0aGlzLmNhcm91c2VsTGlzdC5jaGlsZEVsZW1lbnRDb3VudH1gO1xyXG4gICAgbGlnaHRib3guY2xhc3NOYW1lID0gJ2Nhcm91c2VsLWxpZ2h0Ym94JztcclxuICAgIGxpZ2h0Ym94LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgbGlnaHRib3guaW5uZXJIVE1MID0gYDxpbWcgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIHNyYz1cIiR7aW1hZ2UudXJsfVwiIGFsdD1cIiR7aW1hZ2UuYWx0fVwiPmA7XHJcbiAgICB0aGlzLmNhcm91c2VsLmFwcGVuZENoaWxkKGxpZ2h0Ym94KTtcclxuXHJcbiAgICAvLyBhZGQgdGh1bWJuYWlsXHJcbiAgICBjb25zdCB0aHVtYm5haWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgdGh1bWJuYWlsLmNsYXNzTmFtZSA9ICdzbGlkZSc7XHJcbiAgICB0aHVtYm5haWwuaW5uZXJIVE1MID0gYDxpbWcgc3JjPVwiJHtpbWFnZS51cmx9XCIgYWx0PVwiJHtpbWFnZS5hbHR9XCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFyaWEtY29udHJvbHM9XCIke2xpZ2h0Ym94LmlkfVwiIC8+YDtcclxuICAgIHRoaXMuY2Fyb3VzZWxMaXN0LmFwcGVuZENoaWxkKHRodW1ibmFpbCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBpbWFnZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNyY1xyXG4gICAqL1xyXG4gIHNldEltYWdlKHNyYykge1xyXG4gICAgdGhpcy5pbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYyB8fCBub0ljb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgdGl0bGVcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxyXG4gICAqL1xyXG4gIHNldElkKGlkKSB7XHJcbiAgICB0aGlzLmluc3RhbGxCdXR0b24uc2V0QXR0cmlidXRlKEFUVFJJQlVURV9DT05URU5UX1RZUEVfSUQsIGlkKTtcclxuICAgIHRoaXMudXNlQnV0dG9uLnNldEF0dHJpYnV0ZShBVFRSSUJVVEVfQ09OVEVOVF9UWVBFX0lELCBpZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSB0aXRsZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlXHJcbiAgICovXHJcbiAgc2V0VGl0bGUodGl0bGUpIHtcclxuICAgIHRoaXMudGl0bGUuaW5uZXJIVE1MID0gYCR7dGl0bGV9YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGxvbmcgZGVzY3JpcHRpb25cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XHJcbiAgICovXHJcbiAgc2V0RGVzY3JpcHRpb24odGV4dCkge1xyXG4gICAgaWYodGV4dC5sZW5ndGggPiBNQVhfVEVYVF9TSVpFX0RFU0NSSVBUSU9OKSB7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb24uaW5uZXJIVE1MID0gYCR7dGhpcy5lbGxpcHNpcyhNQVhfVEVYVF9TSVpFX0RFU0NSSVBUSU9OLCB0ZXh0KX0gPHNwYW4gY2xhc3M9XCJyZWFkLW1vcmUgbGlua1wiPlJlYWQgbW9yZTwvc3Bhbj5gO1xyXG4gICAgICB0aGlzLmRlc2NyaXB0aW9uXHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJy5yZWFkLW1vcmUsIC5yZWFkLWxlc3MnKVxyXG4gICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMudG9nZ2xlRGVzY3JpcHRpb25FeHBhbmRlZCh0ZXh0KSk7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25FeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb24uaW5uZXJUZXh0ID0gdGV4dDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRvZ2dsZXMgUmVhZCBsZXNzIGFuZCBSZWFkIG1vcmUgdGV4dFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRcclxuICAgKi9cclxuICB0b2dnbGVEZXNjcmlwdGlvbkV4cGFuZGVkKHRleHQpIHtcclxuICAgIC8vIGZsaXAgYm9vbGVhblxyXG4gICAgdGhpcy5kZXNjcmlwdGlvbkV4cGFuZGVkID0gIXRoaXMuZGVzY3JpcHRpb25FeHBhbmRlZDtcclxuXHJcbiAgICBpZih0aGlzLmRlc2NyaXB0aW9uRXhwYW5kZWQpIHtcclxuICAgICAgdGhpcy5kZXNjcmlwdGlvbi5pbm5lckhUTUwgPSBgJHt0ZXh0fSA8c3BhbiBjbGFzcz1cInJlYWQtbGVzcyBsaW5rXCI+UmVhZCBsZXNzPC9zcGFuPmA7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5kZXNjcmlwdGlvbi5pbm5lckhUTUwgPSBgJHt0aGlzLmVsbGlwc2lzKE1BWF9URVhUX1NJWkVfREVTQ1JJUFRJT04sIHRleHQpfSA8c3BhbiBjbGFzcz1cInJlYWQtbW9yZSBsaW5rXCI+UmVhZCBtb3JlPC9zcGFuPmA7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kZXNjcmlwdGlvblxyXG4gICAgICAucXVlcnlTZWxlY3RvcignLnJlYWQtbW9yZSwgLnJlYWQtbGVzcycpXHJcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMudG9nZ2xlRGVzY3JpcHRpb25FeHBhbmRlZCh0ZXh0KSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaG9ydGVucyBhIHN0cmluZywgYW5kIHB1dHMgYW4gZWxpcHNpcyBhdCB0aGUgZW5kXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0gc2l6ZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XHJcbiAgICovXHJcbiAgZWxsaXBzaXMoc2l6ZSwgdGV4dCkge1xyXG4gICAgcmV0dXJuIGAke3RleHQuc3Vic3RyKDAsIHNpemUpfS4uLmA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBsaWNlbmNlXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxyXG4gICAqL1xyXG4gIHNldExpY2VuY2UodHlwZSkge1xyXG4gICAgaWYodHlwZSl7XHJcbiAgICAgIHRoaXMubGljZW5jZVBhbmVsLnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbC1ib2R5LWlubmVyJykuaW5uZXJUZXh0ID0gdHlwZTtcclxuICAgICAgc2hvdyh0aGlzLmxpY2VuY2VQYW5lbCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgaGlkZSh0aGlzLmxpY2VuY2VQYW5lbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBsb25nIGRlc2NyaXB0aW9uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3duZXJcclxuICAgKi9cclxuICBzZXRPd25lcihvd25lcikge1xyXG4gICAgaWYob3duZXIpIHtcclxuICAgICAgdGhpcy5vd25lci5pbm5lckhUTUwgPSBgQnkgJHtvd25lcn1gO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMub3duZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBleGFtcGxlIHVybFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxyXG4gICAqL1xyXG4gIHNldEV4YW1wbGUodXJsKSB7XHJcbiAgICB0aGlzLmRlbW9CdXR0b24uc2V0QXR0cmlidXRlKCdocmVmJywgdXJsIHx8ICcjJyk7XHJcbiAgICB0b2dnbGVWaXNpYmlsaXR5KHRoaXMuZGVtb0J1dHRvbiwgIWlzRW1wdHkodXJsKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIGlmIHRoZSBjb250ZW50IHR5cGUgaXMgaW5zdGFsbGVkXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGluc3RhbGxlZFxyXG4gICAqL1xyXG4gIHNldElzSW5zdGFsbGVkKGluc3RhbGxlZCkge1xyXG4gICAgdG9nZ2xlVmlzaWJpbGl0eSh0aGlzLnVzZUJ1dHRvbiwgaW5zdGFsbGVkKTtcclxuICAgIHRvZ2dsZVZpc2liaWxpdHkodGhpcy5pbnN0YWxsQnV0dG9uLCAhaW5zdGFsbGVkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhpZGVzIHRoZSByb290IGVsZW1lbnRcclxuICAgKi9cclxuICBoaWRlKCkge1xyXG4gICAgaGlkZSh0aGlzLnJvb3RFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNob3dzIHRoZSByb290IGVsZW1lbnRcclxuICAgKi9cclxuICBzaG93KCkge1xyXG4gICAgc2hvdyh0aGlzLnJvb3RFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHJvb3QgaHRtbCBlbGVtZW50XHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLnJvb3RFbGVtZW50O1xyXG4gIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1kZXRhaWwvY29udGVudC10eXBlLWRldGFpbC12aWV3LmpzIiwiaW1wb3J0IENvbnRldFR5cGVEZXRhaWxWaWV3IGZyb20gXCIuL2NvbnRlbnQtdHlwZS1kZXRhaWwtdmlld1wiO1xyXG5pbXBvcnQgSHViU2VydmljZXMgZnJvbSBcIi4uL2h1Yi1zZXJ2aWNlc1wiO1xyXG5pbXBvcnQgeyBFdmVudGZ1bCB9IGZyb20gJy4uL21peGlucy9ldmVudGZ1bCc7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEBtaXhlcyBFdmVudGZ1bFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudFR5cGVEZXRhaWwge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICAvLyBhZGQgZXZlbnQgc3lzdGVtXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIEV2ZW50ZnVsKCkpO1xyXG5cclxuICAgIC8vIHNlcnZpY2VzXHJcbiAgICB0aGlzLnNlcnZpY2VzID0gbmV3IEh1YlNlcnZpY2VzKHtcclxuICAgICAgYXBpUm9vdFVybDogc3RhdGUuYXBpUm9vdFVybFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gdmlld3NcclxuICAgIHRoaXMudmlldyA9IG5ldyBDb250ZXRUeXBlRGV0YWlsVmlldyhzdGF0ZSk7XHJcbiAgICB0aGlzLnZpZXcub24oJ2luc3RhbGwnLCB0aGlzLmluc3RhbGwsIHRoaXMpO1xyXG5cclxuICAgIC8vIHByb3BhZ2F0ZSBldmVudHNcclxuICAgIHRoaXMucHJvcGFnYXRlKFsnY2xvc2UnLCAnc2VsZWN0J10sIHRoaXMudmlldyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIaWRlcyB0aGUgZGV0YWlsIHZpZXdcclxuICAgKi9cclxuICBoaWRlKCkge1xyXG4gICAgdGhpcy52aWV3LmhpZGUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNob3dzIHRoZSBkZXRhaWwgdmlld1xyXG4gICAqL1xyXG4gIHNob3coKSB7XHJcbiAgICB0aGlzLnZpZXcuc2hvdygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9hZHMgYSBDb250ZW50IFR5cGUgZGVzY3JpcHRpb25cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7UHJvbWlzZS48Q29udGVudFR5cGU+fVxyXG4gICAqL1xyXG4gIGxvYWRCeUlkKGlkKSB7XHJcbiAgICB0aGlzLnNlcnZpY2VzLmNvbnRlbnRUeXBlKGlkKVxyXG4gICAgICAudGhlbih0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9hZHMgYSBDb250ZW50IFR5cGUgZGVzY3JpcHRpb25cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7UHJvbWlzZS48Q29udGVudFR5cGU+fVxyXG4gICAqL1xyXG4gICBpbnN0YWxsKHtpZH0pIHtcclxuICAgICByZXR1cm4gdGhpcy5zZXJ2aWNlcy5jb250ZW50VHlwZShpZClcclxuICAgICAgIC50aGVuKGNvbnRlbnRUeXBlID0+IGNvbnRlbnRUeXBlLm1hY2hpbmVOYW1lKVxyXG4gICAgICAgLnRoZW4obWFjaGluZU5hbWUgPT4gdGhpcy5zZXJ2aWNlcy5pbnN0YWxsQ29udGVudFR5cGUobWFjaGluZU5hbWUpKVxyXG4gICAgICAgLnRoZW4oY29udGVudFR5cGUgPT4gY29uc29sZS5kZWJ1ZygnVE9ETywgZ3VpIHVwZGF0ZXMnLCBjb250ZW50VHlwZSkpXHJcbiAgIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlcyB0aGUgdmlldyB3aXRoIHRoZSBjb250ZW50IHR5cGUgZGF0YVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtDb250ZW50VHlwZX0gY29udGVudFR5cGVcclxuICAgKi9cclxuICB1cGRhdGUoY29udGVudFR5cGUpIHtcclxuICAgIHRoaXMudmlldy5zZXRJZChjb250ZW50VHlwZS5tYWNoaW5lTmFtZSk7XHJcbiAgICB0aGlzLnZpZXcuc2V0VGl0bGUoY29udGVudFR5cGUudGl0bGUpO1xyXG4gICAgdGhpcy52aWV3LnNldERlc2NyaXB0aW9uKGNvbnRlbnRUeXBlLmRlc2NyaXB0aW9uKTtcclxuICAgIHRoaXMudmlldy5zZXRJbWFnZShjb250ZW50VHlwZS5pY29uKTtcclxuICAgIHRoaXMudmlldy5zZXRFeGFtcGxlKGNvbnRlbnRUeXBlLmV4YW1wbGUpO1xyXG4gICAgdGhpcy52aWV3LnNldE93bmVyKGNvbnRlbnRUeXBlLm93bmVyKTtcclxuICAgIHRoaXMudmlldy5zZXRJc0luc3RhbGxlZCghIWNvbnRlbnRUeXBlLmluc3RhbGxlZCk7XHJcbiAgICB0aGlzLnZpZXcuc2V0TGljZW5jZShjb250ZW50VHlwZS5saWNlbnNlKTtcclxuXHJcbiAgICAvLyB1cGRhdGUgY2Fyb3VzZWxcclxuICAgIHRoaXMudmlldy5yZW1vdmVBbGxJbWFnZXNJbkNhcm91c2VsKCk7XHJcbiAgICBjb250ZW50VHlwZS5zY3JlZW5zaG90cy5mb3JFYWNoKHRoaXMudmlldy5hZGRJbWFnZVRvQ2Fyb3VzZWwsIHRoaXMudmlldyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSByb290IGh0bWwgZWxlbWVudFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLnZpZXcuZ2V0RWxlbWVudCgpO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9jb250ZW50LXR5cGUtZGV0YWlsL2NvbnRlbnQtdHlwZS1kZXRhaWwuanMiLCJpbXBvcnQgeyBjdXJyeSB9IGZyb20gXCJ1dGlscy9mdW5jdGlvbmFsXCI7XHJcbmltcG9ydCB7IHNldEF0dHJpYnV0ZSwgZ2V0QXR0cmlidXRlLCByZW1vdmVDaGlsZCB9IGZyb20gXCJ1dGlscy9lbGVtZW50c1wiO1xyXG5pbXBvcnQgeyBFdmVudGZ1bCB9IGZyb20gJy4uL21peGlucy9ldmVudGZ1bCc7XHJcbmltcG9ydCB7IHJlbGF5Q2xpY2tFdmVudEFzIH0gZnJvbSAnLi4vdXRpbHMvZXZlbnRzJztcclxuaW1wb3J0IG5vSWNvbiBmcm9tICcuLi8uLi9pbWFnZXMvY29udGVudC10eXBlLXBsYWNlaG9sZGVyLnN2Zyc7XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5jb25zdCBoaWRlID0gc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5jb25zdCBzaG93ID0gc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBAbWl4ZXMgRXZlbnRmdWxcclxuICogQGZpcmVzIEh1YiNzZWxlY3RcclxuICogQGZpcmVzIENvbnRlbnRUeXBlTGlzdCNyb3ctc2VsZWN0ZWRcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRUeXBlTGlzdFZpZXcge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcblxyXG4gICAgLy8gYWRkIGV2ZW50IHN5c3RlbVxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBFdmVudGZ1bCgpKTtcclxuXHJcbiAgICAvLyBjcmVhdGUgcm9vdCBlbGVtZW50XHJcbiAgICB0aGlzLnJvb3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuY2xhc3NOYW1lID0gJ2NvbnRlbnQtdHlwZS1saXN0JztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhpZGVzIHRoZSByb290IGVsZW1lbnRcclxuICAgKi9cclxuICBoaWRlKCkge1xyXG4gICAgaGlkZSh0aGlzLnJvb3RFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNob3dzIHRoZSByb290IGVsZW1lbnRcclxuICAgKi9cclxuICBzaG93KCkge1xyXG4gICAgc2hvdyh0aGlzLnJvb3RFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgYWxsIHJvd3MgZnJvbSByb290IGVsZW1lbnRcclxuICAgKi9cclxuICByZW1vdmVBbGxSb3dzKCkge1xyXG4gICAgd2hpbGUodGhpcy5yb290RWxlbWVudC5oYXNDaGlsZE5vZGVzKCkgKXtcclxuICAgICAgdGhpcy5yb290RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnJvb3RFbGVtZW50Lmxhc3RDaGlsZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGRzIGEgcm93XHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0NvbnRlbnRUeXBlfSBjb250ZW50VHlwZVxyXG4gICAqL1xyXG4gIGFkZFJvdyhjb250ZW50VHlwZSkge1xyXG4gICAgY29uc3Qgcm93ID0gdGhpcy5jcmVhdGVDb250ZW50VHlwZVJvdyhjb250ZW50VHlwZSwgdGhpcyk7XHJcbiAgICByZWxheUNsaWNrRXZlbnRBcygncm93LXNlbGVjdGVkJywgdGhpcywgcm93KTtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQocm93KVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYSBDb250ZW50IFR5cGUgY29uZmlndXJhdGlvbiBhbmQgY3JlYXRlcyBhIHJvdyBkb21cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Q29udGVudFR5cGV9IGNvbnRlbnRUeXBlXHJcbiAgICogQHBhcmFtIHtFdmVudGZ1bH0gc2NvcGVcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAqL1xyXG4gIGNyZWF0ZUNvbnRlbnRUeXBlUm93KGNvbnRlbnRUeXBlLCBzY29wZSkge1xyXG4gICAgLy8gcm93IGl0ZW1cclxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgZWxlbWVudC5pZCA9IGBjb250ZW50LXR5cGUtJHtjb250ZW50VHlwZS5tYWNoaW5lTmFtZX1gO1xyXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBjb250ZW50VHlwZS5tYWNoaW5lTmFtZSk7XHJcblxyXG4gICAgLy8gY3JlYXRlIGJ1dHRvbiBjb25maWdcclxuICAgIGNvbnN0IHVzZUJ1dHRvbkNvbmZpZyA9IHsgdGV4dDogJ1VzZScsIGNsczogJ2J1dHRvbi1wcmltYXJ5JywgaWNvbjogJycgfTtcclxuICAgIGNvbnN0IGluc3RhbGxCdXR0b25Db25maWcgPSB7IHRleHQ6ICdpbnN0YWxsJywgY2xzOiAnYnV0dG9uLWludmVyc2UtcHJpbWFyeSBidXR0b24taW5zdGFsbCcsIGljb246ICdpY29uLWFycm93LXRoaWNrJ307XHJcbiAgICBjb25zdCBidXR0b24gPSBjb250ZW50VHlwZS5pbnN0YWxsZWQgPyAgdXNlQnV0dG9uQ29uZmlnOiBpbnN0YWxsQnV0dG9uQ29uZmlnO1xyXG5cclxuICAgIGNvbnN0IHRpdGxlID0gY29udGVudFR5cGUudGl0bGUgfHwgY29udGVudFR5cGUubWFjaGluZU5hbWU7XHJcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGNvbnRlbnRUeXBlLnN1bW1hcnkgfHwgJyc7XHJcblxyXG4gICAgY29uc3QgaW1hZ2UgPSBjb250ZW50VHlwZS5pY29uIHx8IG5vSWNvbjtcclxuXHJcbiAgICAvLyBjcmVhdGUgaHRtbFxyXG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBgXHJcbiAgICAgIDxpbWcgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIHNyYz1cIiR7aW1hZ2V9XCI+XHJcbiAgICAgIDxzcGFuIGNsYXNzPVwiYnV0dG9uICR7YnV0dG9uLmNsc31cIiBkYXRhLWlkPVwiJHtjb250ZW50VHlwZS5tYWNoaW5lTmFtZX1cIiB0YWJpbmRleD1cIjBcIj48c3BhbiBjbGFzcz1cIiR7YnV0dG9uLmljb259XCI+PC9zcGFuPiR7YnV0dG9uLnRleHR9PC9zcGFuPlxyXG4gICAgICA8aDQ+JHt0aXRsZX08L2g0PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZGVzY3JpcHRpb25cIj4ke2Rlc2NyaXB0aW9ufTwvZGl2PlxyXG4gICBgO1xyXG5cclxuICAgIC8vIGhhbmRsZSB1c2UgYnV0dG9uXHJcbiAgICBjb25zdCB1c2VCdXR0b24gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXR0b24tcHJpbWFyeScpO1xyXG4gICAgaWYodXNlQnV0dG9uKXtcclxuICAgICAgcmVsYXlDbGlja0V2ZW50QXMoJ3NlbGVjdCcsIHNjb3BlLCB1c2VCdXR0b24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcm9vdCBlbGVtZW50XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICAgKi9cclxuICBnZXRFbGVtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucm9vdEVsZW1lbnQ7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL2NvbnRlbnQtdHlwZS1saXN0L2NvbnRlbnQtdHlwZS1saXN0LXZpZXcuanMiLCJpbXBvcnQgQ29udGV0VHlwZUxpc3RWaWV3IGZyb20gXCIuL2NvbnRlbnQtdHlwZS1saXN0LXZpZXdcIjtcclxuaW1wb3J0IHtFdmVudGZ1bH0gZnJvbSAnLi4vbWl4aW5zL2V2ZW50ZnVsJztcclxuXHJcbi8qKlxyXG4gKiBSb3cgc2VsZWN0ZWQgZXZlbnRcclxuICogQGV2ZW50IENvbnRlbnRUeXBlTGlzdCNyb3ctc2VsZWN0ZWRcclxuICogQHR5cGUge1NlbGVjdGVkRWxlbWVudH1cclxuICovXHJcbi8qKlxyXG4gKiBVcGRhdGUgY29udGVudCB0eXBlIGxpc3QgZXZlbnRcclxuICogQGV2ZW50IENvbnRlbnRUeXBlTGlzdCN1cGRhdGUtY29udGVudC10eXBlLWxpc3RcclxuICogQHR5cGUge1NlbGVjdGVkRWxlbWVudH1cclxuICovXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQG1peGVzIEV2ZW50ZnVsXHJcbiAqIEBmaXJlcyBIdWIjc2VsZWN0XHJcbiAqIEBmaXJlcyBDb250ZW50VHlwZUxpc3Qjcm93LXNlbGVjdGVkXHJcbiAqIEBmaXJlcyBDb250ZW50VHlwZUxpc3QjdXBkYXRlLWNvbnRlbnQtdHlwZS1saXN0XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50VHlwZUxpc3Qge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICAvLyBhZGQgZXZlbnQgc3lzdGVtXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIEV2ZW50ZnVsKCkpO1xyXG5cclxuICAgIC8vIGFkZCB0aGUgdmlld1xyXG4gICAgdGhpcy52aWV3ID0gbmV3IENvbnRldFR5cGVMaXN0VmlldyhzdGF0ZSk7XHJcbiAgICB0aGlzLnByb3BhZ2F0ZShbJ3Jvdy1zZWxlY3RlZCcsICdzZWxlY3QnXSwgdGhpcy52aWV3KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhpZGUgdGhpcyBlbGVtZW50XHJcbiAgICovXHJcbiAgaGlkZSgpIHtcclxuICAgIHRoaXMudmlldy5oaWRlKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaG93IHRoaXMgZWxlbWVudFxyXG4gICAqL1xyXG4gIHNob3coKSB7XHJcbiAgICB0aGlzLnZpZXcuc2hvdygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHRoZSBsaXN0IHdpdGggbmV3IGNvbnRlbnQgdHlwZXNcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Q29udGVudFR5cGVbXX0gY29udGVudFR5cGVzXHJcbiAgICovXHJcbiAgdXBkYXRlKGNvbnRlbnRUeXBlcykge1xyXG4gICAgdGhpcy52aWV3LnJlbW92ZUFsbFJvd3MoKTtcclxuICAgIGNvbnRlbnRUeXBlcy5mb3JFYWNoKHRoaXMudmlldy5hZGRSb3csIHRoaXMudmlldyk7XHJcbiAgICB0aGlzLmZpcmUoJ3VwZGF0ZS1jb250ZW50LXR5cGUtbGlzdCcsIHt9KTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSB2aWV3cyByb290IGVsZW1lbnRcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAqL1xyXG4gIGdldEVsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy52aWV3LmdldEVsZW1lbnQoKTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvY29udGVudC10eXBlLWxpc3QvY29udGVudC10eXBlLWxpc3QuanMiLCJpbXBvcnQge0V2ZW50ZnVsfSBmcm9tICcuLi9taXhpbnMvZXZlbnRmdWwnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBDb250ZW50QnJvd3NlclZpZXdcclxuICogQG1peGVzIEV2ZW50ZnVsXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50QnJvd3NlclZpZXcge1xyXG4gIC8qKlxyXG4gICAqIEBjb25zdHJ1Y3RvclxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZVxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICAvLyBhZGQgZXZlbnQgc3lzdGVtXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIEV2ZW50ZnVsKCkpO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBlbGVtZW50c1xyXG4gICAgY29uc3QgbWVudSA9IHRoaXMuY3JlYXRlTWVudUVsZW1lbnQoKTtcclxuICAgIGNvbnN0IGlucHV0R3JvdXAgPSB0aGlzLmNyZWF0ZUlucHV0R3JvdXBFbGVtZW50KCk7XHJcblxyXG4gICAgLy8gbWVudSBncm91cFxyXG4gICAgY29uc3QgbWVudUdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBtZW51R3JvdXAuY2xhc3NOYW1lID0gJ21lbnUtZ3JvdXAnO1xyXG4gICAgbWVudUdyb3VwLmFwcGVuZENoaWxkKG1lbnUpO1xyXG4gICAgbWVudUdyb3VwLmFwcGVuZENoaWxkKGlucHV0R3JvdXApO1xyXG5cclxuICAgIC8vIHJvb3QgZWxlbWVudFxyXG4gICAgdGhpcy5yb290RWxlbWVudCAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQobWVudUdyb3VwKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZHMgYSBtZW51IGl0ZW1cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cclxuICAgKi9cclxuICBhZGRNZW51SXRlbSh0ZXh0KSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdyb2xlJywgJ21lbnVpdGVtJyk7XHJcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IHRleHQ7XHJcblxyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgdGhpcy5maXJlKCdtZW51LXNlbGVjdGVkJywge1xyXG4gICAgICAgIGVsZW1lbnQ6IGV2ZW50LnRhcmdldFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHNldHMgZmlyc3QgdG8gYmUgc2VsZWN0ZWRcclxuICAgIGlmKHRoaXMubWVudUJhckVsZW1lbnQuY2hpbGRFbGVtZW50Q291bnQgPCAxKSB7XHJcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhZGQgdG8gbWVudSBiYXJcclxuICAgIHRoaXMubWVudUJhckVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcblxyXG4gICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIHRoZSBtZW51IGJhciBlbGVtZW50XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAqL1xyXG4gIGNyZWF0ZU1lbnVFbGVtZW50KCkge1xyXG4gICAgdGhpcy5tZW51QmFyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XHJcbiAgICB0aGlzLm1lbnVCYXJFbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdtZW51YmFyJyk7XHJcbiAgICB0aGlzLm1lbnVCYXJFbGVtZW50LmNsYXNzTmFtZSA9ICdoNXAtbWVudSc7XHJcblxyXG4gICAgY29uc3QgbmF2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ25hdicpO1xyXG4gICAgbmF2RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1lbnVCYXJFbGVtZW50KTtcclxuXHJcbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGl0bGUuY2xhc3NOYW1lID0gXCJtZW51LXRpdGxlXCI7XHJcbiAgICB0aXRsZS5pbm5lckhUTUwgPSBcIkJyb3dzZSBjb250ZW50IHR5cGVzXCI7XHJcblxyXG4gICAgY29uc3QgbWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgbWVudS5jbGFzc05hbWUgPSBcIm1lbnVcIjtcclxuICAgIG1lbnUuYXBwZW5kQ2hpbGQodGl0bGUpO1xyXG4gICAgbWVudS5hcHBlbmRDaGlsZChuYXZFbGVtZW50KTtcclxuXHJcbiAgICByZXR1cm4gbWVudTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgdGhlIGlucHV0IGdyb3VwIHVzZWQgZm9yIHNlYXJjaFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgY3JlYXRlSW5wdXRHcm91cEVsZW1lbnQoKSB7XHJcbiAgICAvLyBpbnB1dCBmaWVsZFxyXG4gICAgY29uc3QgaW5wdXRGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICBpbnB1dEZpZWxkLmlkID0gXCJodWItc2VhcmNoLWJhclwiO1xyXG4gICAgaW5wdXRGaWVsZC5jbGFzc05hbWUgPSAnZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1yb3VuZGVkJztcclxuICAgIGlucHV0RmllbGQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcclxuICAgIGlucHV0RmllbGQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIFwiU2VhcmNoIGZvciBDb250ZW50IFR5cGVzXCIpO1xyXG4gICAgaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGV2ZW50ID0+IHtcclxuICAgICAgdGhpcy5maXJlKCdzZWFyY2gnLCB7XHJcbiAgICAgICAgZWxlbWVudDogZXZlbnQudGFyZ2V0LFxyXG4gICAgICAgIHF1ZXJ5OiBldmVudC50YXJnZXQudmFsdWVcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBpbnB1dCBidXR0b25cclxuICAgIGNvbnN0IGlucHV0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBpbnB1dEJ1dHRvbi5jbGFzc05hbWUgPSAnaW5wdXQtZ3JvdXAtYWRkb24gaWNvbi1zZWFyY2gnO1xyXG4gICAgaW5wdXRCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignI3NlYXJjaC1iYXInKS5mb2N1cygpXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGlucHV0IGdyb3VwXHJcbiAgICBjb25zdCBpbnB1dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBpbnB1dEdyb3VwLmNsYXNzTmFtZSA9ICdpbnB1dC1ncm91cCc7XHJcbiAgICBpbnB1dEdyb3VwLmFwcGVuZENoaWxkKGlucHV0RmllbGQpO1xyXG4gICAgaW5wdXRHcm91cC5hcHBlbmRDaGlsZChpbnB1dEJ1dHRvbik7XHJcblxyXG4gICAgcmV0dXJuIGlucHV0R3JvdXA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSByb290IGVsZW1lbnQgb2YgdGhlIGNvbnRlbnQgYnJvd3NlclxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLnJvb3RFbGVtZW50O1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9jb250ZW50LXR5cGUtc2VjdGlvbi9jb250ZW50LXR5cGUtc2VjdGlvbi12aWV3LmpzIiwiaW1wb3J0IENvbnRlbnRUeXBlU2VjdGlvblZpZXcgZnJvbSBcIi4vY29udGVudC10eXBlLXNlY3Rpb24tdmlld1wiO1xyXG5pbXBvcnQgU2VhcmNoU2VydmljZSBmcm9tIFwiLi4vc2VhcmNoLXNlcnZpY2Uvc2VhcmNoLXNlcnZpY2VcIjtcclxuaW1wb3J0IENvbnRlbnRUeXBlTGlzdCBmcm9tICcuLi9jb250ZW50LXR5cGUtbGlzdC9jb250ZW50LXR5cGUtbGlzdCc7XHJcbmltcG9ydCBDb250ZW50VHlwZURldGFpbCBmcm9tICcuLi9jb250ZW50LXR5cGUtZGV0YWlsL2NvbnRlbnQtdHlwZS1kZXRhaWwnO1xyXG5pbXBvcnQge0V2ZW50ZnVsfSBmcm9tICcuLi9taXhpbnMvZXZlbnRmdWwnO1xyXG5pbXBvcnQge3JlbmRlckVycm9yTWVzc2FnZX0gZnJvbSAnLi4vdXRpbHMvZXJyb3JzJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgQ29udGVudFR5cGVTZWN0aW9uXHJcbiAqIEBtaXhlcyBFdmVudGZ1bFxyXG4gKlxyXG4gKiBAZmlyZXMgSHViI3NlbGVjdFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudFR5cGVTZWN0aW9uIHtcclxuICAvKipcclxuICAgKiBAcGFyYW0ge0h1YlN0YXRlfSBzdGF0ZVxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICAvLyBhZGQgZXZlbnQgc3lzdGVtXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIEV2ZW50ZnVsKCkpO1xyXG5cclxuICAgIC8vIGFkZCB2aWV3XHJcbiAgICB0aGlzLnZpZXcgPSBuZXcgQ29udGVudFR5cGVTZWN0aW9uVmlldyhzdGF0ZSk7XHJcblxyXG4gICAgLy8gY29udHJvbGxlclxyXG4gICAgdGhpcy5zZWFyY2hTZXJ2aWNlID0gbmV3IFNlYXJjaFNlcnZpY2UoeyBhcGlSb290VXJsOiBzdGF0ZS5hcGlSb290VXJsIH0pO1xyXG4gICAgdGhpcy5jb250ZW50VHlwZUxpc3QgPSBuZXcgQ29udGVudFR5cGVMaXN0KCk7XHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlRGV0YWlsID0gbmV3IENvbnRlbnRUeXBlRGV0YWlsKHsgYXBpUm9vdFVybDogc3RhdGUuYXBpUm9vdFVybCB9KTtcclxuXHJcbiAgICAvLyBhZGQgbWVudSBpdGVtc1xyXG4gICAgWydNeSBDb250ZW50IFR5cGVzJywgJ05ld2VzdCcsICdNb3N0IFBvcHVsYXInLCAnUmVjb21tZW5kZWQnXVxyXG4gICAgICAuZm9yRWFjaChtZW51VGV4dCA9PiB0aGlzLnZpZXcuYWRkTWVudUl0ZW0obWVudVRleHQpKTtcclxuXHJcbiAgICAvLyBFbGVtZW50IGZvciBob2xkaW5nIGxpc3QgYW5kIGRldGFpbHMgdmlld3NcclxuICAgIGNvbnN0IHNlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgnY29udGVudC10eXBlLXNlY3Rpb24nKTtcclxuXHJcbiAgICB0aGlzLnJvb3RFbGVtZW50ID0gc2VjdGlvbjtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50VHlwZUxpc3QuZ2V0RWxlbWVudCgpKTtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50VHlwZURldGFpbC5nZXRFbGVtZW50KCkpO1xyXG5cclxuICAgIHRoaXMudmlldy5nZXRFbGVtZW50KCkuYXBwZW5kQ2hpbGQodGhpcy5yb290RWxlbWVudCk7XHJcblxyXG4gICAgLy8gcHJvcGFnYXRlIGV2ZW50c1xyXG4gICAgdGhpcy5wcm9wYWdhdGUoWydzZWxlY3QnLCAndXBkYXRlLWNvbnRlbnQtdHlwZS1saXN0J10sIHRoaXMuY29udGVudFR5cGVMaXN0KTtcclxuICAgIHRoaXMucHJvcGFnYXRlKFsnc2VsZWN0J10sIHRoaXMuY29udGVudFR5cGVEZXRhaWwpO1xyXG5cclxuICAgIC8vIHJlZ2lzdGVyIGxpc3RlbmVyc1xyXG4gICAgdGhpcy52aWV3Lm9uKCdzZWFyY2gnLCB0aGlzLnNlYXJjaCwgdGhpcyk7XHJcbiAgICB0aGlzLnZpZXcub24oJ21lbnUtc2VsZWN0ZWQnLCB0aGlzLmFwcGx5U2VhcmNoRmlsdGVyLCB0aGlzKTtcclxuICAgIHRoaXMuY29udGVudFR5cGVMaXN0Lm9uKCdyb3ctc2VsZWN0ZWQnLCB0aGlzLnNob3dEZXRhaWxWaWV3LCB0aGlzKTtcclxuICAgIHRoaXMuY29udGVudFR5cGVEZXRhaWwub24oJ2Nsb3NlJywgdGhpcy5jbG9zZURldGFpbFZpZXcsIHRoaXMpO1xyXG4gICAgdGhpcy5jb250ZW50VHlwZURldGFpbC5vbignc2VsZWN0JywgdGhpcy5jbG9zZURldGFpbFZpZXcsIHRoaXMpO1xyXG5cclxuICAgIHRoaXMuaW5pdENvbnRlbnRUeXBlTGlzdCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhdGVzIHRoZSBjb250ZW50IHR5cGUgbGlzdCB3aXRoIGEgc2VhcmNoXHJcbiAgICovXHJcbiAgaW5pdENvbnRlbnRUeXBlTGlzdCgpIHtcclxuICAgIC8vIGluaXRpYWxpemUgYnkgc2VhcmNoXHJcbiAgICB0aGlzLnNlYXJjaFNlcnZpY2Uuc2VhcmNoKFwiXCIpXHJcbiAgICAgIC50aGVuKGNvbnRlbnRUeXBlcyA9PiB0aGlzLmNvbnRlbnRUeXBlTGlzdC51cGRhdGUoY29udGVudFR5cGVzKSlcclxuICAgICAgLmNhdGNoKGVycm9yID0+IHRoaXMuZmlyZSgnZXJyb3InLCBlcnJvcikpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXhlY3V0ZXMgYSBzZWFyY2ggYW5kIHVwZGF0ZXMgdGhlIGNvbnRlbnQgdHlwZSBsaXN0XHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcXVlcnlcclxuICAgKi9cclxuICBzZWFyY2goe3F1ZXJ5fSkge1xyXG4gICAgdGhpcy5zZWFyY2hTZXJ2aWNlLnNlYXJjaChxdWVyeSlcclxuICAgICAgLnRoZW4oY29udGVudFR5cGVzID0+IHRoaXMuY29udGVudFR5cGVMaXN0LnVwZGF0ZShjb250ZW50VHlwZXMpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNob3VsZCBhcHBseSBhIHNlYXJjaCBmaWx0ZXJcclxuICAgKi9cclxuICBhcHBseVNlYXJjaEZpbHRlcigpIHtcclxuICAgIGNvbnNvbGUuZGVidWcoJ0NvbnRlbnRUeXBlU2VjdGlvbjogbWVudSB3YXMgY2xpY2tlZCEnLCBldmVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaG93cyBkZXRhaWwgdmlld1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXHJcbiAgICovXHJcbiAgc2hvd0RldGFpbFZpZXcoe2lkfSkge1xyXG4gICAgdGhpcy5jb250ZW50VHlwZUxpc3QuaGlkZSgpO1xyXG4gICAgdGhpcy5jb250ZW50VHlwZURldGFpbC5sb2FkQnlJZChpZCk7XHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlRGV0YWlsLnNob3coKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBDbG9zZSBkZXRhaWwgdmlld1xyXG4gICAqL1xyXG4gIGNsb3NlRGV0YWlsVmlldygpIHtcclxuICAgIHRoaXMuY29udGVudFR5cGVEZXRhaWwuaGlkZSgpO1xyXG4gICAgdGhpcy5jb250ZW50VHlwZUxpc3Quc2hvdygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgZWxlbWVudFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgZ2V0RWxlbWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLnZpZXcuZ2V0RWxlbWVudCgpO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9jb250ZW50LXR5cGUtc2VjdGlvbi9jb250ZW50LXR5cGUtc2VjdGlvbi5qcyIsImltcG9ydCBpbml0UGFuZWwgZnJvbSBcImNvbXBvbmVudHMvcGFuZWxcIlxyXG5pbXBvcnQgaW5pdFRhYlBhbmVsIGZyb20gXCJjb21wb25lbnRzL3RhYi1wYW5lbFwiXHJcbmltcG9ydCB7IGN1cnJ5IH0gZnJvbSBcInV0aWxzL2Z1bmN0aW9uYWxcIjtcclxuaW1wb3J0IHsgYXR0cmlidXRlRXF1YWxzLCBnZXRBdHRyaWJ1dGUsIGhhc0F0dHJpYnV0ZSB9IGZyb20gXCJ1dGlscy9lbGVtZW50c1wiO1xyXG5pbXBvcnQgeyBFdmVudGZ1bCB9IGZyb20gJy4vbWl4aW5zL2V2ZW50ZnVsJztcclxuaW1wb3J0IHsgcmVsYXlDbGlja0V2ZW50QXMgfSBmcm9tICcuL3V0aWxzL2V2ZW50cyc7XHJcbi8qKlxyXG4gKiBUYWIgY2hhbmdlIGV2ZW50XHJcbiAqIEBldmVudCBIdWJWaWV3I3RhYi1jaGFuZ2VcclxuICogQHR5cGUge1NlbGVjdGVkRWxlbWVudH1cclxuICovXHJcbi8qKlxyXG4gKiBQYW5lbCBvcGVuIG9yIGNsb3NlIGV2ZW50XHJcbiAqIEBldmVudCBIdWJWaWV3I3BhbmVsLWNoYW5nZVxyXG4gKiBAdHlwZSB7U2VsZWN0ZWRFbGVtZW50fVxyXG4gKi9cclxuLyoqXHJcbiAqIEBjb25zdGFudCB7c3RyaW5nfVxyXG4gKi9cclxuY29uc3QgQVRUUklCVVRFX0RBVEFfSUQgPSAnZGF0YS1pZCc7XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5jb25zdCBpc09wZW4gPSBoYXNBdHRyaWJ1dGUoJ29wZW4nKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQG1peGVzIEV2ZW50ZnVsXHJcbiAqIEBmaXJlcyBIdWJWaWV3I3RhYi1jaGFuZ2VcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh1YlZpZXcge1xyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7SHViU3RhdGV9IHN0YXRlXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIC8vIGFkZCBldmVudCBzeXN0ZW1cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgRXZlbnRmdWwoKSk7XHJcblxyXG4gICAgdGhpcy5yZW5kZXJUYWJQYW5lbChzdGF0ZSk7XHJcbiAgICB0aGlzLnJlbmRlclBhbmVsKHN0YXRlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENsb3NlcyB0aGUgcGFuZWxcclxuICAgKi9cclxuICBjbG9zZVBhbmVsKCkge1xyXG4gICAgdGhpcy50aXRsZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgdGl0bGVcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZVxyXG4gICAqL1xyXG4gIHNldFRpdGxlKHRpdGxlKSB7XHJcbiAgICB0aGlzLnRpdGxlLmlubmVySFRNTCA9IHRpdGxlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyB0aGUgZG9tIGZvciB0aGUgcGFuZWxcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWN0aW9uSWRcclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGV4cGFuZGVkXHJcbiAgICovXHJcbiAgcmVuZGVyUGFuZWwoe3RpdGxlID0gJycsIHNlY3Rpb25JZCA9ICdjb250ZW50LXR5cGVzJywgZXhwYW5kZWQgPSBmYWxzZX0pIHtcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLnRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0aGlzLnRpdGxlLmNsYXNzTmFtZSArPSBcInBhbmVsLWhlYWRlciBpY29uLWh1Yi1pY29uXCI7XHJcbiAgICB0aGlzLnRpdGxlLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICghIWV4cGFuZGVkKS50b1N0cmluZygpKTtcclxuICAgIHRoaXMudGl0bGUuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgYHBhbmVsLWJvZHktJHtzZWN0aW9uSWR9YCk7XHJcbiAgICB0aGlzLnRpdGxlLmlubmVySFRNTCA9IHRpdGxlO1xyXG4gICAgcmVsYXlDbGlja0V2ZW50QXMoJ3BhbmVsLWNoYW5nZScsIHRoaXMsIHRoaXMudGl0bGUpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLmJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMuYm9keS5jbGFzc05hbWUgKz0gXCJwYW5lbC1ib2R5XCI7XHJcbiAgICB0aGlzLmJvZHkuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICghZXhwYW5kZWQpLnRvU3RyaW5nKCkpO1xyXG4gICAgdGhpcy5ib2R5LmlkID0gYHBhbmVsLWJvZHktJHtzZWN0aW9uSWR9YDtcclxuICAgIHRoaXMuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnRhYkNvbnRhaW5lckVsZW1lbnQpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLnBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0aGlzLnBhbmVsLmNsYXNzTmFtZSArPSBgcGFuZWwgaDVwLXNlY3Rpb24tJHtzZWN0aW9uSWR9YDtcclxuICAgIGlmKGV4cGFuZGVkKXtcclxuICAgICAgdGhpcy5wYW5lbC5zZXRBdHRyaWJ1dGUoJ29wZW4nLCAnJyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnBhbmVsLmFwcGVuZENoaWxkKHRoaXMudGl0bGUpO1xyXG4gICAgdGhpcy5wYW5lbC5hcHBlbmRDaGlsZCh0aGlzLmJvZHkpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMucm9vdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMucm9vdEVsZW1lbnQuY2xhc3NOYW1lICs9IGBoNXAgaDVwLWh1YmA7XHJcbiAgICB0aGlzLnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMucGFuZWwpO1xyXG4gICAgaW5pdFBhbmVsKHRoaXMucm9vdEVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IGlmIHBhbmVsIGlzIG9wZW4sIHRoaXMgaXMgdXNlZCBmb3Igb3V0ZXIgYm9yZGVyIGNvbG9yXHJcbiAgICovXHJcbiAgdG9nZ2xlUGFuZWxPcGVuKCkge1xyXG4gICAgbGV0IHBhbmVsID0gdGhpcy5wYW5lbDtcclxuICAgIGlmKGlzT3BlbihwYW5lbCkpIHtcclxuICAgICAgcGFuZWwucmVtb3ZlQXR0cmlidXRlKCdvcGVuJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcGFuZWwuc2V0QXR0cmlidXRlKCdvcGVuJywgJycpO1xyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cGFuZWwucXVlcnlTZWxlY3RvcignI2h1Yi1zZWFyY2gtYmFyJykuZm9jdXMoKX0sMjApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyB0aGUgZG9tIGZvciB0aGUgdGFiIHBhbmVsXHJcbiAgICovXHJcbiAgcmVuZGVyVGFiUGFuZWwoc3RhdGUpIHtcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLnRhYmxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xyXG4gICAgdGhpcy50YWJsaXN0LmNsYXNzTmFtZSArPSBcInRhYmxpc3RcIjtcclxuICAgIHRoaXMudGFibGlzdC5zZXRBdHRyaWJ1dGUgKCdyb2xlJywgJ3RhYmxpc3QnKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy50YWJMaXN0V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ25hdicpO1xyXG4gICAgdGhpcy50YWJMaXN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLnRhYmxpc3QpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLnRhYkNvbnRhaW5lckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMudGFiQ29udGFpbmVyRWxlbWVudC5jbGFzc05hbWUgKz0gJ3RhYi1wYW5lbCc7XHJcbiAgICB0aGlzLnRhYkNvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy50YWJMaXN0V3JhcHBlcik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGRzIGEgdGFiXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGVcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50XHJcbiAgICogQHBhcmFtIHtib29sZWFufSBzZWxlY3RlZFxyXG4gICAqL1xyXG4gIGFkZFRhYih7dGl0bGUsIGlkLCBjb250ZW50LCBzZWxlY3RlZCA9IGZhbHNlfSkge1xyXG4gICAgY29uc3QgdGFiSWQgPSBgdGFiLSR7aWR9YDtcclxuICAgIGNvbnN0IHRhYlBhbmVsSWQgPSBgdGFiLXBhbmVsLSR7aWR9YDtcclxuXHJcbiAgICBjb25zdCB0YWIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgdGFiLmNsYXNzTmFtZSArPSAndGFiJztcclxuICAgIHRhYi5pZCA9IHRhYklkO1xyXG4gICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIHRhYlBhbmVsSWQpO1xyXG4gICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHNlbGVjdGVkLnRvU3RyaW5nKCkpO1xyXG4gICAgdGFiLnNldEF0dHJpYnV0ZShBVFRSSUJVVEVfREFUQV9JRCwgaWQpO1xyXG4gICAgdGFiLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWInKTtcclxuICAgIHRhYi5pbm5lckhUTUwgPSB0aXRsZTtcclxuICAgIHJlbGF5Q2xpY2tFdmVudEFzKCd0YWItY2hhbmdlJywgdGhpcywgdGFiKTtcclxuXHJcbiAgICBjb25zdCB0YWJQYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGFiUGFuZWwuaWQgPSB0YWJQYW5lbElkO1xyXG4gICAgdGFiUGFuZWwuY2xhc3NOYW1lICs9ICd0YWJwYW5lbCc7XHJcbiAgICB0YWJQYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFibGxlZGJ5JywgdGFiSWQpO1xyXG4gICAgdGFiUGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICghc2VsZWN0ZWQpLnRvU3RyaW5nKCkpO1xyXG4gICAgdGFiUGFuZWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYnBhbmVsJyk7XHJcbiAgICB0YWJQYW5lbC5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuXHJcbiAgICB0aGlzLnRhYmxpc3QuYXBwZW5kQ2hpbGQodGFiKTtcclxuICAgIHRoaXMudGFiQ29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZCh0YWJQYW5lbCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGRzIGFuIGFuaW1hdGVkIGJvcmRlciB0byB0aGUgYm90dG9tIG9mIHRoZSB0YWJcclxuICAgKi9cclxuICBhZGRCb3R0b21Cb3JkZXIoKSB7XHJcbiAgICB0aGlzLnRhYmxpc3QuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpKTtcclxuICB9XHJcblxyXG4gIGluaXRUYWJQYW5lbCgpIHtcclxuICAgIGluaXRUYWJQYW5lbCh0aGlzLnRhYkNvbnRhaW5lckVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgc2VjdGlvblxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXHJcbiAgICovXHJcbiAgc2V0U2VjdGlvblR5cGUoe2lkfSkge1xyXG4gICAgdGhpcy5wYW5lbC5jbGFzc05hbWUgPSBgaDVwLXNlY3Rpb24tJHtpZH0gcGFuZWxgO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcm9vdCBodG1sIGVsZW1lbnRcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gICAqL1xyXG4gIGdldEVsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yb290RWxlbWVudDtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdHMvaHViLXZpZXcuanMiLCJpbXBvcnQge2N1cnJ5fSBmcm9tICd1dGlscy9mdW5jdGlvbmFsJ1xyXG5pbXBvcnQgSHViU2VydmljZXMgZnJvbSAnLi4vaHViLXNlcnZpY2VzJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogVGhlIFNlYXJjaCBTZXJ2aWNlIGdldHMgYSBjb250ZW50IHR5cGUgZnJvbSBodWItc2VydmljZXMuanNcclxuICogaW4gdGhlIGZvcm0gb2YgYSBwcm9taXNlLiBJdCB0aGVuIGdlbmVyYXRlcyBhIHNjb3JlIGJhc2VkXHJcbiAqIG9uIHRoZSBkaWZmZXJlbnQgd2VpZ2h0aW5ncyBvZiB0aGUgY29udGVudCB0eXBlIGZpZWxkcyBhbmRcclxuICogc29ydHMgdGhlIHJlc3VsdHMgYmFzZWQgb24gdGhlIGdlbmVyYXRlZCBzY29yZS5cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaFNlcnZpY2Uge1xyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZS5hcGlSb290VXJsXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIHRoaXMuc2VydmljZXMgPSBuZXcgSHViU2VydmljZXMoe1xyXG4gICAgICBhcGlSb290VXJsOiBzdGF0ZS5hcGlSb290VXJsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBZGQgY29udGVudCB0eXBlcyB0byB0aGUgc2VhcmNoIGluZGV4XHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlcyA9IHRoaXMuc2VydmljZXMuY29udGVudFR5cGVzKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQZXJmb3JtcyBhIHNlYXJjaFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHF1ZXJ5XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlPENvbnRlbnRUeXBlW10+fSBBIHByb21pc2Ugb2YgYW4gYXJyYXkgb2YgY29udGVudCB0eXBlc1xyXG4gICAqL1xyXG4gIHNlYXJjaChxdWVyeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGVudFR5cGVzLnRoZW4oZmlsdGVyQnlRdWVyeShxdWVyeSkpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEZpbHRlcnMgYSBsaXN0IG9mIGNvbnRlbnQgdHlwZXMgYmFzZWQgb24gYSBxdWVyeVxyXG4gKiBAdHlwZSB7RnVuY3Rpb259XHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBxdWVyeVxyXG4gKiBAcGFyYW0ge0NvbnRlbnRUeXBlW119IGNvbnRlbnRUeXBlc1xyXG4gKi9cclxuY29uc3QgZmlsdGVyQnlRdWVyeSA9IGN1cnJ5KGZ1bmN0aW9uKHF1ZXJ5LCBjb250ZW50VHlwZXMpIHtcclxuICBpZiAocXVlcnkgPT0gJycpIHtcclxuICAgIHJldHVybiBjb250ZW50VHlwZXM7XHJcbiAgfVxyXG5cclxuICAvLyBBcHBlbmQgYSBzZWFyY2ggc2NvcmUgdG8gZWFjaCBjb250ZW50IHR5cGVcclxuICByZXR1cm4gY29udGVudFR5cGVzLm1hcChjb250ZW50VHlwZSA9PlxyXG4gICAgKHtcclxuICAgICAgY29udGVudFR5cGU6IGNvbnRlbnRUeXBlLFxyXG4gICAgICBzY29yZTogZ2V0U2VhcmNoU2NvcmUocXVlcnksIGNvbnRlbnRUeXBlKVxyXG4gICAgfSkpXHJcbiAgICAuZmlsdGVyKHJlc3VsdCA9PiByZXN1bHQuc2NvcmUgPiAwKVxyXG4gICAgLnNvcnQoc29ydFNlYXJjaFJlc3VsdHMpIC8vIFNvcnQgYnkgaW5zdGFsbGVkLCByZWxldmFuY2UgYW5kIHBvcHVsYXJpdHlcclxuICAgIC5tYXAocmVzdWx0ID0+IHJlc3VsdC5jb250ZW50VHlwZSk7IC8vIFVud3JhcCByZXN1bHQgb2JqZWN0O1xyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBDYWxsYmFjayBmb3IgQXJyYXkuc29ydCgpXHJcbiAqIENvbXBhcmVzIHR3byBjb250ZW50IHR5cGVzIG9uIGRpZmZlcmVudCBjcml0ZXJpYVxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gYSBGaXJzdCBjb250ZW50IHR5cGVcclxuICogQHBhcmFtIHtPYmplY3R9IGIgU2Vjb25kIGNvbnRlbnQgdHlwZVxyXG4gKiBAcmV0dXJuIHtpbnR9XHJcbiAqL1xyXG5jb25zdCBzb3J0U2VhcmNoUmVzdWx0cyA9IChhLGIpID0+IHtcclxuICBpZiAoIWEuY29udGVudFR5cGUuaW5zdGFsbGVkICYmIGIuY29udGVudFR5cGUuaW5zdGFsbGVkKSB7XHJcbiAgICByZXR1cm4gMTtcclxuICB9XHJcblxyXG4gIGlmIChhLmNvbnRlbnRUeXBlLmluc3RhbGxlZCAmJiAhYi5jb250ZW50VHlwZS5pbnN0YWxsZWQpIHtcclxuICAgIHJldHVybiAtMTtcclxuICB9XHJcblxyXG4gIGVsc2UgaWYgKGIuc2NvcmUgIT09IGEuc2NvcmUpIHtcclxuICAgIHJldHVybiBiLnNjb3JlIC0gYS5zY29yZTtcclxuICB9XHJcblxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIGIuY29udGVudFR5cGUucG9wdWxhcml0eSAtIGEuY29udGVudFR5cGUucG9wdWxhcml0eTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlcyB3ZWlnaHRpbmcgZm9yIGRpZmZlcmVudCBzZWFyY2ggdGVybXMgYmFzZWRcclxuICogb24gZXhpc3RlbmNlIG9mIHN1YnN0cmluZ3NcclxuICpcclxuICogQHBhcmFtICB7c3RyaW5nfSBxdWVyeVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IGNvbnRlbnRUeXBlXHJcbiAqIEByZXR1cm4ge2ludH1cclxuICovXHJcbiBjb25zdCBnZXRTZWFyY2hTY29yZSA9IGZ1bmN0aW9uKHF1ZXJ5LCBjb250ZW50VHlwZSkge1xyXG4gICBsZXQgcXVlcmllcyA9IHF1ZXJ5LnNwbGl0KCcgJykuZmlsdGVyKHF1ZXJ5ID0+IHF1ZXJ5ICE9PSAnJyk7XHJcbiAgIGxldCBxdWVyeVNjb3JlcyA9IHF1ZXJpZXMubWFwKHF1ZXJ5ID0+IGdldFNjb3JlRm9yRWFjaFF1ZXJ5KHF1ZXJ5LCBjb250ZW50VHlwZSkpO1xyXG4gICBpZiAocXVlcnlTY29yZXMuaW5kZXhPZigwKSA+IC0xKSB7XHJcbiAgICAgcmV0dXJuIDA7XHJcbiAgIH1cclxuICAgcmV0dXJuIHF1ZXJ5U2NvcmVzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xyXG4gfTtcclxuXHJcblxyXG4vKipcclxuICogR2VuZXJhdGVzIGEgcmVsZXZhbmNlIHNjb3JlIGZvciBhIHNpbmdsZSBzdHJpbmdcclxuICpcclxuICogQHBhcmFtICB7dHlwZX0gcXVlcnkgICAgICAgZGVzY3JpcHRpb25cclxuICogQHBhcmFtICB7dHlwZX0gY29udGVudFR5cGUgZGVzY3JpcHRpb25cclxuICogQHJldHVybiB7dHlwZX0gICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICovXHJcbmNvbnN0IGdldFNjb3JlRm9yRWFjaFF1ZXJ5ID0gZnVuY3Rpb24gKHF1ZXJ5LCBjb250ZW50VHlwZSkge1xyXG4gICBxdWVyeSA9IHF1ZXJ5LnRyaW0oKTtcclxuICAgaWYgKGhhc1N1YlN0cmluZyhxdWVyeSwgY29udGVudFR5cGUudGl0bGUpKSB7XHJcbiAgICAgcmV0dXJuIDEwMDtcclxuICAgfVxyXG4gICBlbHNlIGlmIChoYXNTdWJTdHJpbmcocXVlcnksIGNvbnRlbnRUeXBlLnN1bW1hcnkpKSB7XHJcbiAgICAgcmV0dXJuIDU7XHJcbiAgIH1cclxuICAgZWxzZSBpZiAoaGFzU3ViU3RyaW5nKHF1ZXJ5LCBjb250ZW50VHlwZS5kZXNjcmlwdGlvbikpIHtcclxuICAgICByZXR1cm4gNTtcclxuICAgfVxyXG4gICBlbHNlIGlmIChhcnJheUhhc1N1YlN0cmluZyhxdWVyeSwgY29udGVudFR5cGUua2V5d29yZHMpKSB7XHJcbiAgICAgcmV0dXJuIDU7XHJcbiAgIH1cclxuICAgZWxzZSB7XHJcbiAgICAgcmV0dXJuIDA7XHJcbiAgIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgYSBuZWVkbGUgaXMgZm91bmQgaW4gdGhlIGhheXN0YWNrLlxyXG4gKiBOb3QgY2FzZSBzZW5zaXRpdmVcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5lZWRsZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gaGF5c3RhY2tcclxuICogQHJldHVybiB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGhhc1N1YlN0cmluZyA9IGZ1bmN0aW9uKG5lZWRsZSwgaGF5c3RhY2spIHtcclxuICBpZiAoaGF5c3RhY2sgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGhheXN0YWNrLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUudG9Mb3dlckNhc2UoKSkgIT09IC0xO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhlbHBlciBmdW5jdGlvbiwgY2hlY2tzIGlmIGFycmF5IGhhcyBjb250YWlucyBhIHN1YnN0cmluZ1xyXG4gKlxyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHN1YlN0cmluZ1xyXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBhcnJheUhhc1N1YlN0cmluZyA9IGZ1bmN0aW9uKHN1YlN0cmluZywgYXJyKSB7XHJcbiAgaWYgKGFyciA9PT0gdW5kZWZpbmVkIHx8IHN1YlN0cmluZyA9PT0gJycpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhcnIuc29tZShzdHJpbmcgPT4gaGFzU3ViU3RyaW5nKHN1YlN0cmluZywgc3RyaW5nKSk7XHJcbn07XHJcblxyXG5jb25zdCBBZGROdW1iZXI9ZnVuY3Rpb24oYSxiKVxyXG57XHJcbiAgcmV0dXJuIGErYjtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2NyaXB0cy9zZWFyY2gtc2VydmljZS9zZWFyY2gtc2VydmljZS5qcyIsImltcG9ydCBIdWJTZXJ2aWNlcyBmcm9tICcuLi9odWItc2VydmljZXMnO1xyXG5pbXBvcnQgeyBFdmVudGZ1bCB9IGZyb20gJy4uL21peGlucy9ldmVudGZ1bCc7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEBtaXhlcyBFdmVudGZ1bFxyXG4gKlxyXG4gKiBAZmlyZXMgSHViI3VwbG9hZFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXBsb2FkU2VjdGlvbiB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgRXZlbnRmdWwoKSk7XHJcblxyXG4gICAgLy8gc2VydmljZXNcclxuICAgIHRoaXMuc2VydmljZXMgPSBuZXcgSHViU2VydmljZXMoe1xyXG4gICAgICBhcGlSb290VXJsOiBzdGF0ZS5hcGlSb290VXJsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBJbnB1dCBlbGVtZW50IGZvciB0aGUgSDVQIGZpbGVcclxuICAgIGNvbnN0IGg1cFVwbG9hZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICBoNXBVcGxvYWQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2ZpbGUnKTtcclxuXHJcbiAgICAvLyBTZW5kcyB0aGUgSDVQIGZpbGUgdG8gdGhlIHBsdWdpblxyXG4gICAgY29uc3QgdXNlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICB1c2VCdXR0b24udGV4dENvbnRlbnQgPSAnVXNlJztcclxuICAgIHVzZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHJcbiAgICAgIC8vIEFkZCB0aGUgSDVQIGZpbGUgdG8gYSBmb3JtLCByZWFkeSBmb3IgdHJhbnNwb3J0YXRpb25cclxuICAgICAgY29uc3QgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICBkYXRhLmFwcGVuZCgnaDVwJywgaDVwVXBsb2FkLmZpbGVzWzBdKTtcclxuXHJcbiAgICAgIC8vIFVwbG9hZCBjb250ZW50IHRvIHRoZSBwbHVnaW5cclxuICAgICAgdGhpcy5zZXJ2aWNlcy51cGxvYWRDb250ZW50KGRhdGEpXHJcbiAgICAgICAgLnRoZW4oanNvbiA9PiB7XHJcbiAgICAgICAgICAvLyBGaXJlIHRoZSByZWNlaXZlZCBkYXRhIHRvIGFueSBsaXN0ZW5lcnNcclxuICAgICAgICAgIHNlbGYuZmlyZSgndXBsb2FkJywganNvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGg1cFVwbG9hZCk7XHJcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKHVzZUJ1dHRvbik7XHJcblxyXG4gICAgdGhpcy5yb290RWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucm9vdEVsZW1lbnQ7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zY3JpcHRzL3VwbG9hZC1zZWN0aW9uL3VwbG9hZC1zZWN0aW9uLmpzIiwiaW1wb3J0IHsgc2V0QXR0cmlidXRlLCByZW1vdmVBdHRyaWJ1dGUsIGhhc0F0dHJpYnV0ZSwgY2xhc3NMaXN0Q29udGFpbnMsIHF1ZXJ5U2VsZWN0b3IsIG5vZGVMaXN0VG9BcnJheSB9IGZyb20gJy4uL3V0aWxzL2VsZW1lbnRzJztcclxuaW1wb3J0IHtjdXJyeSwgZm9yRWFjaH0gZnJvbSAnLi4vdXRpbHMvZnVuY3Rpb25hbCc7XHJcblxyXG4vKipcclxuICogQGNvbnN0YW50XHJcbiAqL1xyXG5jb25zdCBBVFRSSUJVVEVfU0laRSA9ICdkYXRhLXNpemUnO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtmdW5jdGlvbn1cclxuICovXHJcbmNvbnN0IGRpc2FibGUgPSBzZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtmdW5jdGlvbn1cclxuICovXHJcbmNvbnN0IGVuYWJsZSA9IHJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZFxyXG4gKi9cclxuY29uc3QgdG9nZ2xlRW5hYmxlZCA9IChlbGVtZW50LCBlbmFibGVkKSA9PiAoZW5hYmxlZCA/IGVuYWJsZSA6IGRpc2FibGUpKGVsZW1lbnQpO1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICogQHBhcmFtIHtib29sZWFufSBoaWRkZW5cclxuICovXHJcbmNvbnN0IHRvZ2dsZVZpc2liaWxpdHkgPSBjdXJyeSgoaGlkZGVuLCBlbGVtZW50KSA9PiBzZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgaGlkZGVuLnRvU3RyaW5nKCksIGVsZW1lbnQpKTtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZSB7ZnVuY3Rpb259XHJcbiAqL1xyXG5jb25zdCBpc0Rpc2FibGVkID0gaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSB0aGUgdmlld1xyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7SW1hZ2VTY3JvbGxlclN0YXRlfSBzdGF0ZVxyXG4gKi9cclxuY29uc3QgdXBkYXRlVmlldyA9IChlbGVtZW50LCBzdGF0ZSkgPT4ge1xyXG4gIGNvbnN0IHByZXZCdXR0b24gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmV2aW91cycpO1xyXG4gIGNvbnN0IG5leHRCdXR0b24gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXh0Jyk7XHJcbiAgY29uc3QgbGlzdCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcigndWwnKTtcclxuICBjb25zdCB0b3RhbENvdW50ID0gbGlzdC5jaGlsZEVsZW1lbnRDb3VudDtcclxuXHJcbiAgLy8gdXBkYXRlIGxpc3Qgc2l6ZXNcclxuICBsaXN0LnN0eWxlLndpZHRoID0gYCR7MTAwIC8gc3RhdGUuZGlzcGxheUNvdW50ICogdG90YWxDb3VudH0lYDtcclxuICBsaXN0LnN0eWxlLm1hcmdpbkxlZnQgPSBgJHtzdGF0ZS5wb3NpdGlvbiAqICgxMDAgLyBzdGF0ZS5kaXNwbGF5Q291bnQpfSVgO1xyXG5cclxuICAvLyB1cGRhdGUgaW1hZ2Ugc2l6ZXNcclxuICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJylcclxuICAgIC5mb3JFYWNoKGVsZW1lbnQgPT4gZWxlbWVudC5zdHlsZS53aWR0aCA9IGAkezEwMCAvIHRvdGFsQ291bnR9JWApO1xyXG5cclxuICAvLyB0b2dnbGUgYnV0dG9uIHZpc2liaWxpdHlcclxuICBbcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbl1cclxuICAgIC5mb3JFYWNoKHRvZ2dsZVZpc2liaWxpdHkoc3RhdGUuZGlzcGxheUNvdW50ID49IHRvdGFsQ291bnQpKTtcclxuXHJcbiAgLy8gdG9nZ2xlIGJ1dHRvbiBlbmFibGUsIGRpc2FibGVkXHJcbiAgdG9nZ2xlRW5hYmxlZChuZXh0QnV0dG9uLCBzdGF0ZS5wb3NpdGlvbiA+IChzdGF0ZS5kaXNwbGF5Q291bnQgLSB0b3RhbENvdW50KSk7XHJcbiAgdG9nZ2xlRW5hYmxlZChwcmV2QnV0dG9uLCBzdGF0ZS5wb3NpdGlvbiA8IDApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhhbmRsZXMgYnV0dG9uIGNsaWNrZWRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcGFyYW0ge0ltYWdlU2Nyb2xsZXJTdGF0ZX0gc3RhdGVcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gdXBkYXRlU3RhdGVcclxuICogQHBhcmFtIHtFdmVudH1cclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5jb25zdCBvbk5hdmlnYXRpb25CdXR0b25DbGljayA9IGN1cnJ5KChlbGVtZW50LCBzdGF0ZSwgdXBkYXRlU3RhdGUsIGV2ZW50KSA9PiB7XHJcbiAgaWYoIWlzRGlzYWJsZWQoZXZlbnQudGFyZ2V0KSl7XHJcbiAgICB1cGRhdGVTdGF0ZShzdGF0ZSk7XHJcbiAgICB1cGRhdGVWaWV3KGVsZW1lbnQsIHN0YXRlKTtcclxuICB9XHJcbn0pO1xyXG5cclxuY29uc3QgaW5pdEltYWdlID0gY3VycnkoKGVsZW1lbnQsIGltYWdlKSA9PiB7XHJcbiAgbGV0IHRhcmdldElkID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgbGV0IHRhcmdldCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgIyR7dGFyZ2V0SWR9YCk7XHJcblxyXG4gIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKSk7XHJcbiAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB0YXJnZXQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpKVxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBDYWxsYmFjayBmb3Igd2hlbiB0aGUgZG9tIGlzIHVwZGF0ZWRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcGFyYW0ge0ltYWdlU2Nyb2xsZXJTdGF0ZX0gc3RhdGVcclxuICogQHBhcmFtIHtNdXRhdGlvblJlY29yZH0gcmVjb3JkXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuY29uc3QgaGFuZGxlRG9tVXBkYXRlID0gY3VycnkoKGVsZW1lbnQsIHN0YXRlLCByZWNvcmQpID0+IHtcclxuICAvLyBvbiBhZGQgaW1hZ2UgcnVuIGluaXRpYWxpemF0aW9uXHJcbiAgaWYocmVjb3JkLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XHJcbiAgICBub2RlTGlzdFRvQXJyYXkocmVjb3JkLmFkZGVkTm9kZXMpXHJcbiAgICAgIC5maWx0ZXIoY2xhc3NMaXN0Q29udGFpbnMoJ3NsaWRlJykpXHJcbiAgICAgIC5tYXAocXVlcnlTZWxlY3RvcignaW1nJykpXHJcbiAgICAgIC5mb3JFYWNoKGluaXRJbWFnZShlbGVtZW50KSk7XHJcbiAgfVxyXG5cclxuICAvLyB1cGRhdGUgdGhlIHZpZXdcclxuICB1cGRhdGVWaWV3KGVsZW1lbnQsIE9iamVjdC5hc3NpZ24oc3RhdGUsIHtcclxuICAgIGRpc3BsYXlDb3VudDogZWxlbWVudC5nZXRBdHRyaWJ1dGUoQVRUUklCVVRFX1NJWkUpIHx8IDUsXHJcbiAgICBwb3NpdGlvbjogMFxyXG4gIH0pKTtcclxufSk7XHJcblxyXG4vKipcclxuICogSW5pdGlhbGl6ZXMgYSBwYW5lbFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5pdChlbGVtZW50KSB7XHJcbiAgLyoqXHJcbiAgICogQHR5cGVkZWYge29iamVjdH0gSW1hZ2VTY3JvbGxlclN0YXRlXHJcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9IGRpc3BsYXlDb3VudFxyXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwb3NpdGlvblxyXG4gICAqL1xyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgZGlzcGxheUNvdW50OiBlbGVtZW50LmdldEF0dHJpYnV0ZShBVFRSSUJVVEVfU0laRSkgfHwgNSxcclxuICAgIHBvc2l0aW9uOiAwXHJcbiAgfTtcclxuXHJcbiAgLy8gaW5pdGlhbGl6ZSBidXR0b25zXHJcbiAgZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubmV4dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25OYXZpZ2F0aW9uQnV0dG9uQ2xpY2soZWxlbWVudCwgc3RhdGUsIHN0YXRlID0+IHN0YXRlLnBvc2l0aW9uLS0pKTtcclxuICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmV2aW91cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25OYXZpZ2F0aW9uQnV0dG9uQ2xpY2soZWxlbWVudCwgc3RhdGUsIHN0YXRlID0+IHN0YXRlLnBvc2l0aW9uKyspKTtcclxuXHJcbiAgLy8gaW5pdGlhbGl6ZSBpbWFnZXNcclxuICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1thcmlhLWNvbnRyb2xzXScpLmZvckVhY2goaW5pdEltYWdlKGVsZW1lbnQpKTtcclxuXHJcbiAgLy8gbGlzdGVuIGZvciB1cGRhdGVzIHRvIGRhdGEtc2l6ZVxyXG4gIGxldCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZvckVhY2goaGFuZGxlRG9tVXBkYXRlKGVsZW1lbnQsIHN0YXRlKSkpO1xyXG5cclxuICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIHtcclxuICAgIHN1YnRyZWU6IHRydWUsXHJcbiAgICBjaGlsZExpc3Q6IHRydWUsXHJcbiAgICBhdHRyaWJ1dGVzOiB0cnVlLFxyXG4gICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXHJcbiAgICBhdHRyaWJ1dGVGaWx0ZXI6IFtBVFRSSUJVVEVfU0laRV1cclxuICB9KTtcclxuXHJcbiAgLy8gaW5pdGlhbGl6ZSBwb3NpdGlvblxyXG4gIHVwZGF0ZVZpZXcoZWxlbWVudCwgc3RhdGUpO1xyXG5cclxuICByZXR1cm4gZWxlbWVudDtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvY29tcG9uZW50cy9pbWFnZS1zY3JvbGxlci5qcyIsImltcG9ydCB7c2V0QXR0cmlidXRlfSBmcm9tICcuLi91dGlscy9lbGVtZW50cyc7XHJcbmltcG9ydCB7Zm9yRWFjaH0gZnJvbSAnLi4vdXRpbHMvZnVuY3Rpb25hbCc7XHJcblxyXG4vKipcclxuICogQHR5cGUge2Z1bmN0aW9ufVxyXG4gKi9cclxuY29uc3QgaGlkZUFsbCA9IGZvckVhY2goc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJykpO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtmdW5jdGlvbn1cclxuICovXHJcbmNvbnN0IHNob3cgPSBzZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4vKipcclxuICogQHR5cGUge2Z1bmN0aW9ufVxyXG4gKi9cclxuY29uc3QgdW5TZWxlY3RBbGwgPSBmb3JFYWNoKHNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpKTtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWF0ZXMgYSB0YWIgcGFuZWxcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5pdChlbGVtZW50KSB7XHJcbiAgY29uc3QgdGFicyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3JvbGU9XCJ0YWJcIl0nKTtcclxuICBjb25zdCB0YWJQYW5lbHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyb2xlPVwidGFicGFuZWxcIl0nKTtcclxuXHJcbiAgdGFicy5mb3JFYWNoKHRhYiA9PiB7XHJcbiAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHJcbiAgICAgIHVuU2VsZWN0QWxsKHRhYnMpO1xyXG4gICAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuXHJcbiAgICAgIGhpZGVBbGwodGFiUGFuZWxzKTtcclxuXHJcbiAgICAgIGxldCB0YWJQYW5lbElkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xyXG4gICAgICBzaG93KGVsZW1lbnQucXVlcnlTZWxlY3RvcihgIyR7dGFiUGFuZWxJZH1gKSk7XHJcbiAgICB9KTtcclxuICB9KVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLy4uL2g1cC1zZGsvc3JjL3NjcmlwdHMvY29tcG9uZW50cy90YWItcGFuZWwuanMiLCJyZXF1aXJlKCcuLi8uLi9zcmMvc3R5bGVzL21haW4uc2NzcycpO1xyXG5cclxuLy8gTG9hZCBsaWJyYXJ5XHJcbkg1UCA9IEg1UCB8fCB7fTtcclxuSDVQLkh1YkNsaWVudCA9IHJlcXVpcmUoJy4uL3NjcmlwdHMvaHViJykuZGVmYXVsdDtcclxuSDVQLkh1YkNsaWVudC5yZW5kZXJFcnJvck1lc3NhZ2UgPSByZXF1aXJlKCcuLi9zY3JpcHRzL3V0aWxzL2Vycm9ycycpLmRlZmF1bHQ7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9lbnRyaWVzL2Rpc3QuanMiXSwic291cmNlUm9vdCI6IiJ9