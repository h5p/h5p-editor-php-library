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
/******/ 	return __webpack_require__(__webpack_require__.s = 35);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElement = exports.toggleClass = exports.toggleVisibility = exports.show = exports.hide = exports.removeClass = exports.addClass = exports.classListContains = exports.removeChild = exports.querySelectorAll = exports.nodeListToArray = exports.querySelector = exports.appendChild = exports.toggleAttribute = exports.attributeEquals = exports.hasAttribute = exports.removeAttribute = exports.setAttribute = exports.getAttribute = undefined;

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
 * Transforms a NodeList to an Array
 *
 * @param {NodeList} nodeList
 *
 * @return {Node[]}
 */
var nodeListToArray = exports.nodeListToArray = function nodeListToArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
};

/**
 * Returns a non-live NodeList of all elements descended from the element on which it
 * is invoked that matches the specified group of CSS selectors.
 *
 * @param {string} selector
 * @param {HTMLElement} el
 *
 * @function
 * @return {Node[]}
 */
var querySelectorAll = exports.querySelectorAll = (0, _functional.curry)(function (selector, el) {
  return nodeListToArray(el.querySelectorAll(selector));
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
 * Adds a css class to an element
 *
 * @param {string} cls
 * @param {Element} element
 *
 * @function
 */
var addClass = exports.addClass = (0, _functional.curry)(function (cls, element) {
  return element.classList.add(cls);
});

/**
 * Removes a css class from an element
 *
 * @param {string} cls
 * @param {Element} element
 *
 * @function
 */
var removeClass = exports.removeClass = (0, _functional.curry)(function (cls, element) {
  return element.classList.remove(cls);
});

/**
 * Adds hidden class on an element
 *
 * @param {HTMLElement} element
 * @function
 */
var hide = exports.hide = addClass('hidden');

/**
 * Removes hidden class from an element
 * @function
 */
var show = exports.show = removeClass('hidden');

/**
 * Toggles hidden class on an element
 *
 * @param {boolean} visible
 * @param {HTMLElement} element
 */
var toggleVisibility = exports.toggleVisibility = (0, _functional.curry)(function (visible, element) {
  return (visible ? show : hide)(element);
});

/**
 * Toggles a class on an element
 *
 * @param {string} cls
 * @param {boolean} add
 * @param {HTMLElement} element
 */
var toggleClass = exports.toggleClass = (0, _functional.curry)(function (cls, add, element) {
  element.classList[add ? 'add' : 'remove'](cls);
});

/**
 * Helper for creating a DOM element
 *
 * @function
 *
 * @param {string} tag
 * @param {string} [id]
 * @param {string[]} [classes] - array of strings
 * @param {Object} [attributes]
 *
 * @return {HTMLElement}
 */
var createElement = exports.createElement = function createElement(_ref) {
  var tag = _ref.tag,
      id = _ref.id,
      classes = _ref.classes,
      attributes = _ref.attributes;

  var element = document.createElement(tag);

  if (id) {
    element.id = id;
  }
  if (classes) {
    classes.forEach(function (clazz) {
      element.classList.add(clazz);
    });
  }
  if (attributes) {
    Object.keys(attributes).forEach(function (key) {
      element.setAttribute(key, attributes[key]);
    });
  }

  return element;
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
     * Triggers event. If any of the listeners returns false, return false
     *
     * @param {string} type
     * @param {object} [event]
     *
     * @function
     * @return {boolean}
     */
    trigger: function trigger(type, event) {
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
     * @param {String} [eventName] the name of the event when propogated
     */
    propagate: function propagate(types, eventful, newType) {
      var self = this;
      types.forEach(function (type) {
        return eventful.on(type, function (event) {
          return self.trigger(newType || type, event);
        });
      });
    }
  };
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
 * Class responsible for providing translations
 */
var Dictionary = function () {
  function Dictionary() {
    _classCallCheck(this, Dictionary);
  }

  _createClass(Dictionary, null, [{
    key: "init",


    /**
     * Initialize the dictionary
     *
     * @param {Object} dictionary - dictionary as key/value
     */
    value: function init(dictionary) {
      Dictionary.dictionary = dictionary;
    }

    /**
     * Get a string from the dictionary. Optionally replace variables
     *
     * @param {string} key
     * @param {Object} [replacements]
     *
     * @returns {string}
     */

  }, {
    key: "get",
    value: function get(key, replacements) {
      var translation = Dictionary.dictionary[key];

      if (translation === undefined) {
        return "Key not found in dictionary: " + key;
      }

      // Replace placeholder with variables.
      for (var placeholder in replacements) {
        if (!replacements[placeholder]) {
          continue;
        }
        translation = translation.replace(placeholder, replacements[placeholder]);
      }

      return translation;
    }
  }]);

  return Dictionary;
}();

exports.default = Dictionary;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _elements = __webpack_require__(0);

var _functional = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @event Keyboard#sdk.keyboard.update
 * @type {object}
 * @param {Element} element
 * @param {number} index
 */
/**
 * @event Keyboard#sdk.keyboard.focus
 * @type {object}
 * @param {Element} element
 * @param {number} index
 */

/**
 * @param {HTMLElement} element
 * @function
 */
var addTabIndex = (0, _elements.setAttribute)('tabindex', '0');

/**
 * @param {HTMLElement} element
 * @function
 */
var removeTabIndex = (0, _elements.removeAttribute)('tabindex');

/**
 * @param {HTMLElement[]} elements
 * @function
 */

var removeTabIndexForAll = (0, _functional.forEach)(removeTabIndex);

/**
 * @param {HTMLElement} element
 * @function
 */
var hasTabIndex = (0, _elements.hasAttribute)('tabindex');

/**
 * Creates a custom event
 *
 * @param {string} type
 * @param {Element} element
 * @param {number} index
 *
 * @return {boolean}
 */
var triggerEvent = function triggerEvent(type, element, index) {
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent(type, true, true, { element: element, index: index });
  return element.dispatchEvent(event);
};

/**
 * Sets tabindex and focus on an element, remove it from all others
 *
 * @param {HTMLElement[]} elements
 * @param {number} index
 *
 * @fires Keyboard#sdk.keyboard.update
 */
var updateTabbable = function updateTabbable(elements, index) {
  var selectedElement = elements[index];

  if (selectedElement) {
    removeTabIndexForAll(elements);
    addTabIndex(selectedElement);
    triggerEvent('sdk.keyboard.update', selectedElement, index);
  }
};

/**
 * Sets tabindex on an element, remove it from all others
 *
 * @param {number} currentIndex
 * @param {number} lastIndex
 *
 * @return {number}
 */
var nextIndex = function nextIndex(currentIndex, lastIndex) {
  return currentIndex === lastIndex ? 0 : currentIndex + 1;
};

/**
 * Sets tabindex on an element, remove it from all others
 *
 * @param {number} currentIndex
 * @param {number} lastIndex
 *
 * @return {number}
 */
var previousIndex = function previousIndex(currentIndex, lastIndex) {
  return currentIndex === 0 ? lastIndex : currentIndex - 1;
};

/**
 * @class
 */

var Keyboard = function () {
  function Keyboard() {
    _classCallCheck(this, Keyboard);

    /**
     * @property {HTMLElement[]} elements
     */
    this.elements = [];
    /**
     * Creates a bound key handler, that can be removed
     * @property {function} boundHandleKeyDown
     */
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.boundHandleFocus = this.handleFocus.bind(this);
    /**
     * @property {number} selectedIndex
     */
    this.selectedIndex = 0;
  }

  /**
   * Add keyboard support to an element
   *
   * @param {HTMLElement} element
   *
   * @public
   * @return {HTMLElement}
   */


  _createClass(Keyboard, [{
    key: 'addElement',
    value: function addElement(element) {
      this.elements.push(element);
      element.addEventListener('keydown', this.boundHandleKeyDown);
      element.addEventListener('focus', this.boundHandleFocus);

      if (this.elements.length === 1) {
        // if first
        addTabIndex(element);
      }

      return element;
    }
  }, {
    key: 'removeElement',


    /**
     * Add controls to an element
     *
     * @param {HTMLElement} element
     *
     * @public
     * @return {HTMLElement}
     */
    value: function removeElement(element) {
      this.elements = (0, _functional.without)([element], this.elements);

      element.removeEventListener('keydown', this.boundHandleKeyDown);
      element.removeEventListener('focus', this.boundHandleFocus);

      // if removed element was selected
      if (hasTabIndex(element)) {
        removeTabIndex(element);

        this.selectedIndex = 0;
        updateTabbable(this.elements, this.selectedIndex);
      }

      return element;
    }
  }, {
    key: 'handleKeyDown',


    /**
     * Handles key down, and updates the tab index
     *
     * @param {KeyboardEvent} event Keyboard event
     *
     * @fires Keyboard#sdk.keyboard.focus
     * @private
     */
    value: function handleKeyDown(event) {
      var lastIndex = this.elements.length - 1;

      if (this.hasElement(event.target)) {
        switch (event.which) {
          case 13: // Enter
          case 32:
            // Space
            this.select();
            event.preventDefault();
            break;
          case 35:
            // End
            this.selectedIndex = lastIndex;
            event.preventDefault();
            break;
          case 36:
            // Home
            this.selectedIndex = 0;
            event.preventDefault();
            break;
          case 37: // Left Arrow
          case 38:
            // Up Arrow
            this.selectedIndex = previousIndex(this.selectedIndex, lastIndex);
            event.preventDefault();
            break;
          case 39: // Right Arrow
          case 40:
            // Down Arrow
            this.selectedIndex = nextIndex(this.selectedIndex, lastIndex);
            event.preventDefault();
            break;
          default:
            return;
        }

        // move tabindex to currently selected
        updateTabbable(this.elements, this.selectedIndex);

        // set focus
        var selectedElement = this.elements[this.selectedIndex];
        if (triggerEvent('sdk.keyboard.focus', selectedElement, this.selectedIndex) !== false) {
          selectedElement.focus();
        }
      }
    }
  }, {
    key: 'hasElement',


    /**
     * Returns true if element is in list ov navigatable elements
     *
     * @param {Element|EventTarget} element
     *
     * @return {boolean}
     */
    value: function hasElement(element) {
      return this.elements.indexOf(element) !== -1;
    }

    /**
     * Updates the selected index with the focused element
     *
     * @param {FocusEvent} event
     */

  }, {
    key: 'handleFocus',
    value: function handleFocus(event) {
      this.selectedIndex = this.elements.indexOf(event.srcElement);
    }

    /**
     * Sets the selected index, and updates the tab index
     *
     * @param {number} index
     */

  }, {
    key: 'forceSelectedIndex',
    value: function forceSelectedIndex(index) {
      this.selectedIndex = index;
      updateTabbable(this.elements, this.selectedIndex);
    }

    /**
     * Triggers 'onSelect' function if it exists
     */

  }, {
    key: 'select',
    value: function select() {
      if (this.onSelect != undefined) {
        this.onSelect(this.elements[this.selectedIndex]);
      }

      triggerEvent('sdk.keyboard.select', this.elements[this.selectedIndex], this.selectedIndex);
    }
  }]);

  return Keyboard;
}();

exports.default = Keyboard;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, Promise, global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   3.3.1
 */

(function (global, factory) {
  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : global.ES6Promise = factory();
})(undefined, function () {
  'use strict';

  function objectOrFunction(x) {
    return typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
  }

  function isFunction(x) {
    return typeof x === 'function';
  }

  var _isArray = undefined;
  if (!Array.isArray) {
    _isArray = function _isArray(x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  } else {
    _isArray = Array.isArray;
  }

  var isArray = _isArray;

  var len = 0;
  var vertxNext = undefined;
  var customSchedulerFn = undefined;

  var asap = function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len === 2) {
      // If len is 2, that means that we need to schedule an async flush.
      // If additional callbacks are queued before the queue is flushed, they
      // will be processed by this flush that we are scheduling.
      if (customSchedulerFn) {
        customSchedulerFn(flush);
      } else {
        scheduleFlush();
      }
    }
  };

  function setScheduler(scheduleFn) {
    customSchedulerFn = scheduleFn;
  }

  function setAsap(asapFn) {
    asap = asapFn;
  }

  var browserWindow = typeof window !== 'undefined' ? window : undefined;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

  // test for web worker but not in IE10
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

  // node
  function useNextTick() {
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // see https://github.com/cujojs/when/issues/410 for details
    return function () {
      return process.nextTick(flush);
    };
  }

  // vertx
  function useVertxTimer() {
    return function () {
      vertxNext(flush);
    };
  }

  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function () {
      node.data = iterations = ++iterations % 2;
    };
  }

  // web worker
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      return channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    // Store setTimeout reference so es6-promise will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var globalSetTimeout = setTimeout;
    return function () {
      return globalSetTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];

      callback(arg);

      queue[i] = undefined;
      queue[i + 1] = undefined;
    }

    len = 0;
  }

  function attemptVertx() {
    try {
      var r = require;
      var vertx = __webpack_require__(34);
      vertxNext = vertx.runOnLoop || vertx.runOnContext;
      return useVertxTimer();
    } catch (e) {
      return useSetTimeout();
    }
  }

  var scheduleFlush = undefined;
  // Decide what async method to use to triggering processing of queued callbacks:
  if (isNode) {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else if (browserWindow === undefined && "function" === 'function') {
    scheduleFlush = attemptVertx();
  } else {
    scheduleFlush = useSetTimeout();
  }

  function then(onFulfillment, onRejection) {
    var _arguments = arguments;

    var parent = this;

    var child = new this.constructor(noop);

    if (child[PROMISE_ID] === undefined) {
      makePromise(child);
    }

    var _state = parent._state;

    if (_state) {
      (function () {
        var callback = _arguments[_state - 1];
        asap(function () {
          return invokeCallback(_state, child, callback, parent._result);
        });
      })();
    } else {
      subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }

  /**
    `Promise.resolve` returns a promise that will become resolved with the
    passed `value`. It is shorthand for the following:

    ```javascript
    let promise = new Promise(function(resolve, reject){
      resolve(1);
    });

    promise.then(function(value){
      // value === 1
    });
    ```

    Instead of writing the above, your code now simply becomes the following:

    ```javascript
    let promise = Promise.resolve(1);

    promise.then(function(value){
      // value === 1
    });
    ```

    @method resolve
    @static
    @param {Any} value value that the returned promise will be resolved with
    Useful for tooling.
    @return {Promise} a promise that will become fulfilled with the given
    `value`
  */
  function resolve(object) {
    /*jshint validthis:true */
    var Constructor = this;

    if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
      return object;
    }

    var promise = new Constructor(noop);
    _resolve(promise, object);
    return promise;
  }

  var PROMISE_ID = Math.random().toString(36).substring(16);

  function noop() {}

  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;

  var GET_THEN_ERROR = new ErrorObject();

  function selfFulfillment() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function cannotReturnOwn() {
    return new TypeError('A promises callback cannot return that same promise.');
  }

  function getThen(promise) {
    try {
      return promise.then;
    } catch (error) {
      GET_THEN_ERROR.error = error;
      return GET_THEN_ERROR;
    }
  }

  function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
    try {
      then.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }

  function handleForeignThenable(promise, thenable, then) {
    asap(function (promise) {
      var sealed = false;
      var error = tryThen(then, thenable, function (value) {
        if (sealed) {
          return;
        }
        sealed = true;
        if (thenable !== value) {
          _resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function (reason) {
        if (sealed) {
          return;
        }
        sealed = true;

        _reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));

      if (!sealed && error) {
        sealed = true;
        _reject(promise, error);
      }
    }, promise);
  }

  function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (thenable._state === REJECTED) {
      _reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function (value) {
        return _resolve(promise, value);
      }, function (reason) {
        return _reject(promise, reason);
      });
    }
  }

  function handleMaybeThenable(promise, maybeThenable, then$$) {
    if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
      handleOwnThenable(promise, maybeThenable);
    } else {
      if (then$$ === GET_THEN_ERROR) {
        _reject(promise, GET_THEN_ERROR.error);
      } else if (then$$ === undefined) {
        fulfill(promise, maybeThenable);
      } else if (isFunction(then$$)) {
        handleForeignThenable(promise, maybeThenable, then$$);
      } else {
        fulfill(promise, maybeThenable);
      }
    }
  }

  function _resolve(promise, value) {
    if (promise === value) {
      _reject(promise, selfFulfillment());
    } else if (objectOrFunction(value)) {
      handleMaybeThenable(promise, value, getThen(value));
    } else {
      fulfill(promise, value);
    }
  }

  function publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }

    publish(promise);
  }

  function fulfill(promise, value) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._result = value;
    promise._state = FULFILLED;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }

  function _reject(promise, reason) {
    if (promise._state !== PENDING) {
      return;
    }
    promise._state = REJECTED;
    promise._result = reason;

    asap(publishRejection, promise);
  }

  function subscribe(parent, child, onFulfillment, onRejection) {
    var _subscribers = parent._subscribers;
    var length = _subscribers.length;

    parent._onerror = null;

    _subscribers[length] = child;
    _subscribers[length + FULFILLED] = onFulfillment;
    _subscribers[length + REJECTED] = onRejection;

    if (length === 0 && parent._state) {
      asap(publish, parent);
    }
  }

  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;

    if (subscribers.length === 0) {
      return;
    }

    var child = undefined,
        callback = undefined,
        detail = promise._result;

    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];

      if (child) {
        invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }

    promise._subscribers.length = 0;
  }

  function ErrorObject() {
    this.error = null;
  }

  var TRY_CATCH_ERROR = new ErrorObject();

  function tryCatch(callback, detail) {
    try {
      return callback(detail);
    } catch (e) {
      TRY_CATCH_ERROR.error = e;
      return TRY_CATCH_ERROR;
    }
  }

  function invokeCallback(settled, promise, callback, detail) {
    var hasCallback = isFunction(callback),
        value = undefined,
        error = undefined,
        succeeded = undefined,
        failed = undefined;

    if (hasCallback) {
      value = tryCatch(callback, detail);

      if (value === TRY_CATCH_ERROR) {
        failed = true;
        error = value.error;
        value = null;
      } else {
        succeeded = true;
      }

      if (promise === value) {
        _reject(promise, cannotReturnOwn());
        return;
      }
    } else {
      value = detail;
      succeeded = true;
    }

    if (promise._state !== PENDING) {
      // noop
    } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
  }

  function initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        _resolve(promise, value);
      }, function rejectPromise(reason) {
        _reject(promise, reason);
      });
    } catch (e) {
      _reject(promise, e);
    }
  }

  var id = 0;
  function nextId() {
    return id++;
  }

  function makePromise(promise) {
    promise[PROMISE_ID] = id++;
    promise._state = undefined;
    promise._result = undefined;
    promise._subscribers = [];
  }

  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this._input = input;
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate();
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      _reject(this.promise, validationError());
    }
  }

  function validationError() {
    return new Error('Array Methods must be provided an Array');
  };

  Enumerator.prototype._enumerate = function () {
    var length = this.length;
    var _input = this._input;

    for (var i = 0; this._state === PENDING && i < length; i++) {
      this._eachEntry(_input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function (entry, i) {
    var c = this._instanceConstructor;
    var resolve$$ = c.resolve;

    if (resolve$$ === resolve) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$) {
          return resolve$$(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function (state, i, value) {
    var promise = this.promise;

    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        _reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function (promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  /**
    `Promise.all` accepts an array of promises, and returns a new promise which
    is fulfilled with an array of fulfillment values for the passed promises, or
    rejected with the reason of the first passed promise to be rejected. It casts all
    elements of the passed iterable to promises as it runs this algorithm.

    Example:

    ```javascript
    let promise1 = resolve(1);
    let promise2 = resolve(2);
    let promise3 = resolve(3);
    let promises = [ promise1, promise2, promise3 ];

    Promise.all(promises).then(function(array){
      // The array here would be [ 1, 2, 3 ];
    });
    ```

    If any of the `promises` given to `all` are rejected, the first promise
    that is rejected will be given as an argument to the returned promises's
    rejection handler. For example:

    Example:

    ```javascript
    let promise1 = resolve(1);
    let promise2 = reject(new Error("2"));
    let promise3 = reject(new Error("3"));
    let promises = [ promise1, promise2, promise3 ];

    Promise.all(promises).then(function(array){
      // Code here never runs because there are rejected promises!
    }, function(error) {
      // error.message === "2"
    });
    ```

    @method all
    @static
    @param {Array} entries array of promises
    @param {String} label optional string for labeling the promise.
    Useful for tooling.
    @return {Promise} promise that is fulfilled when all `promises` have been
    fulfilled, or rejected if any of them become rejected.
    @static
  */
  function all(entries) {
    return new Enumerator(this, entries).promise;
  }

  /**
    `Promise.race` returns a new promise which is settled in the same way as the
    first passed promise to settle.

    Example:

    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });

    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 2');
      }, 100);
    });

    Promise.race([promise1, promise2]).then(function(result){
      // result === 'promise 2' because it was resolved before promise1
      // was resolved.
    });
    ```

    `Promise.race` is deterministic in that only the state of the first
    settled promise matters. For example, even if other promises given to the
    `promises` array argument are resolved, but the first settled promise has
    become rejected before the other promises became fulfilled, the returned
    promise will become rejected:

    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });

    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        reject(new Error('promise 2'));
      }, 100);
    });

    Promise.race([promise1, promise2]).then(function(result){
      // Code here never runs
    }, function(reason){
      // reason.message === 'promise 2' because promise 2 became rejected before
      // promise 1 became fulfilled
    });
    ```

    An example real-world use case is implementing timeouts:

    ```javascript
    Promise.race([ajax('foo.json'), timeout(5000)])
    ```

    @method race
    @static
    @param {Array} promises array of promises to observe
    Useful for tooling.
    @return {Promise} a promise which settles in the same way as the first passed
    promise to settle.
  */
  function race(entries) {
    /*jshint validthis:true */
    var Constructor = this;

    if (!isArray(entries)) {
      return new Constructor(function (_, reject) {
        return reject(new TypeError('You must pass an array to race.'));
      });
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length;
        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject);
        }
      });
    }
  }

  /**
    `Promise.reject` returns a promise rejected with the passed `reason`.
    It is shorthand for the following:

    ```javascript
    let promise = new Promise(function(resolve, reject){
      reject(new Error('WHOOPS'));
    });

    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```

    Instead of writing the above, your code now simply becomes the following:

    ```javascript
    let promise = Promise.reject(new Error('WHOOPS'));

    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```

    @method reject
    @static
    @param {Any} reason value that the returned promise will be rejected with.
    Useful for tooling.
    @return {Promise} a promise rejected with the given `reason`.
  */
  function reject(reason) {
    /*jshint validthis:true */
    var Constructor = this;
    var promise = new Constructor(noop);
    _reject(promise, reason);
    return promise;
  }

  function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  /**
    Promise objects represent the eventual result of an asynchronous operation. The
    primary way of interacting with a promise is through its `then` method, which
    registers callbacks to receive either a promise's eventual value or the reason
    why the promise cannot be fulfilled.

    Terminology
    -----------

    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
    - `thenable` is an object or function that defines a `then` method.
    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
    - `exception` is a value that is thrown using the throw statement.
    - `reason` is a value that indicates why a promise was rejected.
    - `settled` the final resting state of a promise, fulfilled or rejected.

    A promise can be in one of three states: pending, fulfilled, or rejected.

    Promises that are fulfilled have a fulfillment value and are in the fulfilled
    state.  Promises that are rejected have a rejection reason and are in the
    rejected state.  A fulfillment value is never a thenable.

    Promises can also be said to *resolve* a value.  If this value is also a
    promise, then the original promise's settled state will match the value's
    settled state.  So a promise that *resolves* a promise that rejects will
    itself reject, and a promise that *resolves* a promise that fulfills will
    itself fulfill.


    Basic Usage:
    ------------

    ```js
    let promise = new Promise(function(resolve, reject) {
      // on success
      resolve(value);

      // on failure
      reject(reason);
    });

    promise.then(function(value) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```

    Advanced Usage:
    ---------------

    Promises shine when abstracting away asynchronous interactions such as
    `XMLHttpRequest`s.

    ```js
    function getJSON(url) {
      return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();

        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(this.response);
            } else {
              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        };
      });
    }

    getJSON('/posts.json').then(function(json) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```

    Unlike callbacks, promises are great composable primitives.

    ```js
    Promise.all([
      getJSON('/posts'),
      getJSON('/comments')
    ]).then(function(values){
      values[0] // => postsJSON
      values[1] // => commentsJSON

      return values;
    });
    ```

    @class Promise
    @param {function} resolver
    Useful for tooling.
    @constructor
  */
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  Promise.all = all;
  Promise.race = race;
  Promise.resolve = resolve;
  Promise.reject = reject;
  Promise._setScheduler = setScheduler;
  Promise._setAsap = setAsap;
  Promise._asap = asap;

  Promise.prototype = {
    constructor: Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      let result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      let author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
    then: then,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
    'catch': function _catch(onRejection) {
      return this.then(null, onRejection);
    }
  };

  function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
      local = global;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }

    var P = local.Promise;

    if (P) {
      var promiseToString = null;
      try {
        promiseToString = Object.prototype.toString.call(P.resolve());
      } catch (e) {
        // silently ignored
      }

      if (promiseToString === '[object Promise]' && !P.cast) {
        return;
      }
    }

    local.Promise = Promise;
  }

  polyfill();
  // Strange compat..
  Promise.polyfill = polyfill;
  Promise.Promise = Promise;

  return Promise;
});
//# sourceMappingURL=es6-promise.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17), __webpack_require__(5), __webpack_require__(18)))

/***/ }),
/* 6 */
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
    eventful.trigger(type, {
      element: element,
      id: element.getAttribute('data-id')
    }, false);

    // don't bubble
    event.stopPropagation();
  });

  return element;
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventful = __webpack_require__(2);

var _events = __webpack_require__(6);

var _dictionary = __webpack_require__(3);

var _dictionary2 = _interopRequireDefault(_dictionary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class MessageView
 * @mixes Eventful
 */
var MessageView = function () {
  /**
   * @constructor
   * @param {Object} state
   * @param {string} state.type 'info', 'warning' or 'error'
   * @param {string} state.title
   * @param {string} [state.content]
   * @param {string} [state.name]
   * @param {string} [state.action]
   * @param {string} [state.dismissable]
   */
  function MessageView(state) {
    _classCallCheck(this, MessageView);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    state.name = state.name || '';

    // create elements
    this.rootElement = this.createElement(state);
  }

  /**
   * Create the DOM element
   *
   * @param {object} message
   * @return {HTMLElement}
   */


  _createClass(MessageView, [{
    key: 'createElement',
    value: function createElement(message) {
      var _this = this;

      // Create wrapper:
      var messageWrapper = document.createElement('div');
      messageWrapper.className = 'message ' + message.name + ' ' + message.type + (message.dismissible ? ' dismissible' : '');
      messageWrapper.setAttribute('role', 'alert');

      // Add close button if dismisable
      if (message.dismissible) {
        var closeButton = document.createElement('button');
        closeButton.className = 'message-close';
        closeButton.setAttribute('tabIndex', 0);
        closeButton.setAttribute('aria-label', _dictionary2.default.get('closeButtonLabel'));
        messageWrapper.appendChild(closeButton);
        closeButton.addEventListener('click', function () {
          return _this.remove();
        });
      }

      var messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      messageContent.innerHTML = '<h2 class="message-header">' + message.title + '</h2>' + (message.content ? '<p class="message-body">' + message.content + '</p>' : '');
      messageWrapper.appendChild(messageContent);

      if (message.action !== undefined) {
        var messageButton = document.createElement('button');
        messageButton.className = 'button';
        messageButton.innerHTML = message.action;
        messageWrapper.appendChild(messageButton);

        (0, _events.relayClickEventAs)('action-clicked', this, messageButton);
      }

      return messageWrapper;
    }

    /**
     * Remove element from parent DOM element
     */

  }, {
    key: 'remove',
    value: function remove() {
      var parent = this.rootElement.parentNode;
      if (parent) {
        parent.removeChild(this.rootElement);
      }
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

  return MessageView;
}();

exports.default = MessageView;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(28);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {object} ContentType
 * @property {string} machineName
 * @property {string} majorVersion
 * @property {string} minorVersion
 * @property {string} patchVersion
 * @property {string} h5pMajorVersion
 * @property {string} h5pMinorVersion
 * @property {string} title
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
 * @property {boolean} isUpToDate
 * @property {boolean} restricted
 */
var HubServices = function () {
  /**
   * @param {string} apiRootUrl
   * @param {number} contentId
   */
  function HubServices(_ref) {
    var apiRootUrl = _ref.apiRootUrl,
        contentId = _ref.contentId;

    _classCallCheck(this, HubServices);

    this.contentId = contentId || 0;
    this.apiRootUrl = apiRootUrl;
    this.licenseCache = {};
  }

  /**
   * Fetch the content type metadata
   */


  _createClass(HubServices, [{
    key: 'setup',
    value: function setup() {
      this.cachedContentTypes = fetch(this.apiRootUrl + 'content-type-cache', {
        method: 'GET',
        credentials: 'include'
      }).then(function (result) {
        return result.json();
      }).catch(function (err) {
        return {
          messageCode: 'SERVER_ERROR',
          err: err,
          success: false
        };
      }).then(this.isValid);

      return this.cachedContentTypes;
    }

    /**
     * Returns a list of content types
     *
     * @return {Promise.<ContentType[]>}
     */

  }, {
    key: 'contentTypes',
    value: function contentTypes() {
      return this.cachedContentTypes.then(function (json) {
        return json.libraries;
      });
    }

    /**
     * Returns a list of H5P Machine names ordered by most recently used
     *
     * @return {string[]}  Machine names
     */

  }, {
    key: 'recentlyUsed',
    value: function recentlyUsed() {
      return this.cachedContentTypes.then(function (json) {
        return json.recentlyUsed;
      });
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
      return this.contentTypes().then(function (contentTypes) {
        return contentTypes.filter(function (contentType) {
          return contentType.machineName === machineName;
        })[0];
      });
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
      }).then(this.rejectIfNotSuccess);
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
      formData.append('contentId', this.contentId);

      return fetch(this.apiRootUrl + 'library-upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      }).then(function (result) {
        return result.json();
      });
    }

    /**
     * Get license info from h5p.org. Cache it, so that it is only fetched once.
     *
     * @param {string} licenseId
     * @return {Promise}
     */

  }, {
    key: 'getLicenseDetails',
    value: function getLicenseDetails(licenseId) {
      var _this = this;

      // Check if already cached:
      var cachedLicense = this.licenseCache[licenseId];

      if (cachedLicense) {
        return Promise.resolve(cachedLicense);
      }

      return fetch('https://api.h5p.org/v1/licenses/' + licenseId).then(function (result) {
        return result.json();
      }).then(function (result) {
        return _this.licenseCache[licenseId] = result;
      });
    }

    /**
     *
     * @param  {ContentType[]|ErrorMessage} response
     *
     * @return {Promise<ContentType[]|ErrorMessage>}
     */

  }, {
    key: 'isValid',
    value: function isValid(response) {
      if (response.messageCode) {
        return Promise.reject(response);
      } else {
        return Promise.resolve(response);
      }
    }

    /**
     * Rejects the Promise if response.success != true
     *
     * @param {object} response
     *
     * @return {Promise<ContentType[]|ErrorMessage>}
     */

  }, {
    key: 'rejectIfNotSuccess',
    value: function rejectIfNotSuccess(response) {
      return Promise[response.success ? 'resolve' : 'reject'](response);
    }
  }]);

  return HubServices;
}();

exports.default = HubServices;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _contentTypeSectionView = __webpack_require__(23);

var _contentTypeSectionView2 = _interopRequireDefault(_contentTypeSectionView);

var _searchService = __webpack_require__(26);

var _contentTypeList = __webpack_require__(22);

var _contentTypeList2 = _interopRequireDefault(_contentTypeList);

var _contentTypeDetail = __webpack_require__(20);

var _contentTypeDetail2 = _interopRequireDefault(_contentTypeDetail);

var _eventful = __webpack_require__(2);

var _dictionary = __webpack_require__(3);

var _dictionary2 = _interopRequireDefault(_dictionary);

var _messageView = __webpack_require__(7);

var _messageView2 = _interopRequireDefault(_messageView);

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
   * @param {object} state
   * @param {HubServices} services
   */
  function ContentTypeSection(state, services) {
    var _this = this;

    _classCallCheck(this, ContentTypeSection);

    var self = this;
    this.services = services;

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    /*
     * Tab section constants
     */
    ContentTypeSection.Tabs = {
      ALL: {
        id: 'filter-most-popular',
        title: _dictionary2.default.get('contentTypeSectionAll'),
        eventName: 'most-popular'
      },
      MY_CONTENT_TYPES: {
        id: 'filter-my-content-types',
        title: _dictionary2.default.get('contentTypeSectionMine'),
        eventName: 'my-content-types'
      }
    };

    // add view
    this.view = new _contentTypeSectionView2.default(state);

    // controller
    this.searchService = new _searchService.SearchService(this.services);
    this.contentTypeList = new _contentTypeList2.default();
    this.contentTypeDetail = new _contentTypeDetail2.default(state, this.services);

    // Element for holding list and details views
    var section = document.createElement('div');
    section.classList.add('content-type-section');

    this.rootElement = section;
    this.rootElement.appendChild(this.contentTypeList.getElement());
    this.rootElement.appendChild(this.contentTypeDetail.getElement());

    this.view.getElement().appendChild(this.rootElement);

    // propagate events
    this.propagate(['select', 'update-content-type-list'], this.contentTypeList);
    this.propagate(['select', 'modal'], this.contentTypeDetail);
    this.propagate(['reload'], this.view);

    // register listeners
    this.view.on('search', this.search, this);
    this.view.on('menu-selected', this.closeDetailView, this);
    this.view.on('menu-selected', this.applySearchFilter, this);
    this.view.on('menu-selected', this.clearInputField, this);
    this.view.on('menu-selected', this.updateDisplaySelected, this);
    this.view.on('menu-selected', this.removeMessages, this);
    this.contentTypeList.on('row-selected', this.showDetailView, this);
    this.contentTypeList.on('row-selected', this.view.clearSelection, this.view);
    this.contentTypeDetail.on('close', this.goBackToListView, this);
    this.contentTypeDetail.on('select', this.closeDetailView, this);
    this.contentTypeDetail.on('installed-content-type', function () {
      _this.services.setup();
      _this.services.contentTypes().then(function (contentTypes) {
        _this.contentTypeList.refreshContentTypes(contentTypes);
      });
    });

    // add menu items
    Object.keys(ContentTypeSection.Tabs).forEach(function (tab) {
      return _this.view.addMenuItem(ContentTypeSection.Tabs[tab]);
    });
    this.view.initMenu();
    this.selectDefaultMenuItem();
  }

  /**
   * Data has been loaded
   */


  _createClass(ContentTypeSection, [{
    key: "loaded",
    value: function loaded() {
      this.view.loaded();
    }

    /**
     * Handle errors communicating with HUB
     */

  }, {
    key: "handleError",
    value: function handleError(error) {
      this.view.displayMessage({
        type: 'error',
        title: _dictionary2.default.get('errorCommunicatingHubTitle'),
        content: _dictionary2.default.get('errorCommunicatingHubContent')
      });
    }

    /**
     * Determine which browsing category to show initially
     */

  }, {
    key: "selectDefaultMenuItem",
    value: function selectDefaultMenuItem() {
      var self = this;

      this.services.contentTypes().then(function (contentTypes) {
        // Show my content types if any is installed
        var installed = contentTypes.filter(function (contentType) {
          return contentType.installed;
        });

        self.view.selectMenuItem(installed.length ? ContentTypeSection.Tabs.MY_CONTENT_TYPES : ContentTypeSection.Tabs.ALL);
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
      var _this2 = this;

      var query = _ref.query;

      this.contentTypeList.resetList();

      // Always browse ALL when searching
      this.view.selectMenuItem(ContentTypeSection.Tabs.ALL);
      this.searchService.search(query).then(function (contentTypes) {
        return _this2.contentTypeList.update(contentTypes);
      });
    }

    /**
     * Updates the displayed name of the selected filter for mobile
     *
     * @param {SelectedElement} event
     */

  }, {
    key: "updateDisplaySelected",
    value: function updateDisplaySelected(event) {
      this.view.setDisplaySelected(event.element.innerText);
    }

    /**
     * Applies search filter depending on what event it receives
     *
     * @param {Object} e Event
     * @param {string} e.choice Event name of chosen tab
     */

  }, {
    key: "applySearchFilter",
    value: function applySearchFilter(e) {
      var _this3 = this;

      switch (e.choice) {
        case ContentTypeSection.Tabs.ALL.eventName:
          var sortOrder = ['restricted', 'popularity'];
          this.searchService.sortOn(sortOrder).then(function (sortedContentTypes) {
            return _this3.contentTypeList.update(sortedContentTypes);
          });
          break;

        case ContentTypeSection.Tabs.MY_CONTENT_TYPES.eventName:
          this.searchService.applyFilters(['restricted', 'installed']).then(function (filteredContentTypes) {
            return (0, _searchService.multiSort)(filteredContentTypes, ['title']);
          }).then(function (sortedContentTypes) {
            return _this3.searchService.sortOnRecent(sortedContentTypes);
          }).then(function (sortedContentTypes) {
            _this3.contentTypeList.update(sortedContentTypes);

            // Show warning if no local libraries
            if (!sortedContentTypes.length) {
              _this3.displayNoLibrariesWarning();
            }
          });
          break;
      }
    }

    /**
     * Clears the input field
     *
     * @param {string} id
     */

  }, {
    key: "clearInputField",
    value: function clearInputField(_ref2) {
      var id = _ref2.id;

      if (id !== ContentTypeSection.Tabs.ALL.id) {
        this.view.clearInputField();
      }
    }

    /**
     * Display no libraries warning
     */

  }, {
    key: "displayNoLibrariesWarning",
    value: function displayNoLibrariesWarning() {
      if (!this.noLibrariesMessage) {
        var messageView = new _messageView2.default({
          type: 'warning',
          dismissible: true,
          title: _dictionary2.default.get('warningNoContentTypesInstalled'),
          content: _dictionary2.default.get('warningChangeBrowsingToSeeResults')
        });
        var message = messageView.getElement();
        message.classList.add('content-type-section-no-libraries-warning');
        this.noLibrariesMessage = message;
      }

      this.rootElement.appendChild(this.noLibrariesMessage);
    }

    /**
     * Remove messages if found
     */

  }, {
    key: "removeMessages",
    value: function removeMessages() {
      if (this.noLibrariesMessage && this.noLibrariesMessage.parentNode) {
        this.noLibrariesMessage.parentNode.removeChild(this.noLibrariesMessage);
      }
    }

    /**
     * Shows detail view
     *
     * @param {string} id
     */

  }, {
    key: "showDetailView",
    value: function showDetailView(_ref3) {
      var _this4 = this;

      var id = _ref3.id;

      this.contentTypeDetail.loadById(id);
      this.contentTypeDetail.show();
      this.contentTypeList.hide();
      this.view.typeAheadEnabled = false;
      this.view.removeDeactivatedStyleFromMenu();

      // Wait for transition before focusing since focusing an element will force the browser to
      // put that element into view. Doing so before the element is in the correct position will
      // skew all elements on the page.
      setTimeout(function () {
        _this4.contentTypeDetail.focus();
      }, 300);
    }

    /**
     * Closes the detail view
     */

  }, {
    key: "closeDetailView",
    value: function closeDetailView() {
      if (!this.contentTypeDetail.isHidden()) {
        this.contentTypeDetail.hide();
        this.contentTypeList.show();
        this.view.typeAheadEnabled = true;
        this.view.addDeactivatedStyleToMenu();
      }
    }

    /**
     * Closes the detail view then sets focus on the content type list
     */

  }, {
    key: "goBackToListView",
    value: function goBackToListView() {
      var _this5 = this;

      this.closeDetailView();
      // Wait for transition before focusing since focusing an element will force the browser to
      // put that element into view. Doing so before the element is in the correct position will
      // skew all elements on the page.
      setTimeout(function () {
        _this5.contentTypeList.focus();
      }, 300);
    }

    /**
     * Focus search bar in the view
     */

  }, {
    key: "focusSearchBar",
    value: function focusSearchBar() {
      this.view.focusSearchBar();
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = init;

var _elements = __webpack_require__(0);

var _functional = __webpack_require__(1);

var _keyboard = __webpack_require__(4);

var _keyboard2 = _interopRequireDefault(_keyboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @constant
 */
var ATTRIBUTE_SHOW = 'data-show';

/**
 * @constant
 * @type Object.<string, number>
 */
var KEY = {
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  SPACE: 32,
  ESC: 27,
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39
};

/**
 * @constant
 * @type Object.<string, number>
 */
var TAB_DIRECTION = {
  FORWARD: 0,
  BACKWARD: 1
};

/**
 * @function
 * @param {HTMLElement} element
 */
var show = function show(element) {
  return element.classList.add('active');
};

/**
 * @function
 * @param {HTMLElement} element
 */
var hide = function hide(element) {
  element.classList.remove('active');
  element.removeAttribute('aria-live');
};

/**
 * @function
 * @param {HTMLElement} element
 */
var live = (0, _elements.setAttribute)('aria-live', 'polite');

/**
 * @function
 * @param {HTMLElement} element
 */
var enable = function enable(element) {
  element.tabIndex = 0;
  element.removeAttribute('aria-disabled');
};

/**
 * @function
 * @param {HTMLElement} element
 */
var disable = function disable(element) {
  element.tabIndex = -1;
  element.setAttribute('aria-disabled', 'true');
};

/**
 * @function
 * @param {HTMLElement} element
 */
var isDisabled = (0, _elements.hasAttribute)('aria-disabled');

/**
 * @function
 * @param {HTMLElement} element
 * @param {boolean} force
 */
var toggleDisabled = function toggleDisabled(element, force) {
  return (force ? disable : enable)(element);
};

/**
 * @function
 * @param {HTMLElement} element
 * @param {boolean} force
 */
var toggleHidden = function toggleHidden(element, force) {
  return (force ? hide : show)(element);
};

/**
 * @function
 * @param {HTMLElement} element
 * @param {number} imageIndex
 */
var showImageLightbox = (0, _functional.curry)(function (element, imageIndex) {
  return (0, _elements.setAttribute)('data-show', imageIndex, element);
});

/**
 * @function
 * @param {HTMLElement} element
 */
var hideLightbox = function hideLightbox(element) {
  element.removeAttribute(ATTRIBUTE_SHOW);
  element.dispatchEvent(new Event('lightbox-hidden'));
};

/**
 * Focus first element with tabindex from arguments
 *
 * @function
 * @param {...HTMLElement} elements
 */
var focus = function focus() {
  for (var _len = arguments.length, elements = Array(_len), _key = 0; _key < _len; _key++) {
    elements[_key] = arguments[_key];
  }

  for (var i = 0; i < elements.length; i++) {
    if (elements[i].tabIndex !== -1) {
      return elements[i].focus();
    }
  }
};

/**
 * Will toggle the siblings of the element visible or not.
 *
 * @function
 * @param {HTMLElement} element
 * @param {boolean} show
 */
var toggleSiblings = function toggleSiblings(element, show) {
  var siblings = element.parentNode.children;

  for (var i = 0; i < siblings.length; i++) {
    var sibling = siblings[i];

    if (sibling !== element) {
      if (show) {
        // TODO This is dangerous, and will interfere with
        // the aria-hidden state set by other compoents
        sibling.removeAttribute('aria-hidden');
      } else {
        sibling.setAttribute('aria-hidden', 'true');
      }
    }
  }
};

/**
 * @type string
 */
var progressTemplateText = void 0;

/**
 * Update the view
 *
 * @function
 * @param {HTMLElement} element
 * @param {ImageScrollerState} state
 * @param {boolean} setDialogFocus
 */
var updateView = function updateView(element, state) {

  var images = (0, _elements.querySelectorAll)('.imagelightbox-image', element);
  var progress = element.querySelector('.imagelightbox-progress');
  var prevButton = element.querySelector('.previous');
  var nextButton = element.querySelector('.next');
  var closeButton = element.querySelector('.close');

  // Hide all images
  images.forEach(function (image) {
    return hide(image);
  });
  if (state.currentImage !== null) {
    // Show selected image
    var image = element.querySelector('.imagelightbox-image:nth-child(' + (state.currentImage + 1) + ')');

    show(image);
    live(image);
  }

  // Update progress text
  if (!progressTemplateText) {
    // Keep template for future updates
    progressTemplateText = progress.innerText;
  }
  progress.innerText = progressTemplateText.replace(':num', state.currentImage + 1).replace(':total', images.length);

  // Determine if buttons should be shown or hidden
  toggleHidden(prevButton, !images.length);
  toggleHidden(nextButton, !images.length);

  // Determine if buttons should be enabled or disabled
  toggleDisabled(prevButton, state.currentImage === 0);
  toggleDisabled(nextButton, state.currentImage === images.length - 1);

  // Determine if lightbox should be shown or hidden
  var isAlreadyShowing = element.classList.contains('active');
  toggleHidden(element, state.currentImage === null);
  toggleSiblings(element, state.currentImage === null);

  // Set focus to close button if not already showing
  if (!isAlreadyShowing) {
    setTimeout(function () {
      closeButton.focus();
    }, 20);
  }
};

/**
 * Handles button clicked
 *
 * @function
 * @param {HTMLElement} element
 * @param {HTMLElement} button
 * @param {number} imageIndex
 */
var onNavigationButtonClick = function onNavigationButtonClick(element, button, imageIndex) {
  if (!isDisabled(button)) {
    showImageLightbox(element, imageIndex);
  }
};

/**
 * Generic function for handling keydowns
 *
 * @function
 * @param {HTMLElement} element
 * @param {number[]}  keycodes
 * @param {function} handler
 */
var onKeyDown = function onKeyDown(element, keycodes, handler) {
  element.addEventListener('keydown', function (event) {
    if (keycodes.indexOf(event.which) !== -1) {
      handler();
      event.preventDefault();
    }
  });
};

/**
 * @function
 */
var onButtonPress = function onButtonPress(button, handler) {
  button.addEventListener('click', handler);
  onKeyDown(button, [KEY.ENTER, KEY.SPACE], handler);
};

/**
 * Keep track of which keys are currently pressed.
 *
 * @type Object.<number, boolean>
 */
var keysDown = {};

/**
 * Binds key listeners that traps focus when the lightbox is open.
 *
 * @function
 */
var onButtonTab = function onButtonTab(button, direction, handler) {
  button.addEventListener('keydown', function (event) {
    // Keep track of which keys are currently pressed
    keysDown[event.which] = true;

    if (event.which === KEY.TAB) {
      // Tab key press

      if (keysDown[KEY.SHIFT]) {
        if (direction === TAB_DIRECTION.BACKWARD) {
          // Shift is down, tab backward
          handler();
          event.preventDefault();
        }
      } else {
        if (direction === TAB_DIRECTION.FORWARD) {
          // Tab forward
          handler();
          event.preventDefault();
        }
      }
    }
  });
  button.addEventListener('keyup', function (event) {
    delete keysDown[event.which];
  });
};

/**
 * Callback for when the dom is updated
 *
 * @function
 * @param {HTMLElement} element
 * @param {ImageLightboxState} state
 * @param {Keyboard} keyboard
 * @param {MutationRecord} record
 */
var handleDomUpdate = (0, _functional.curry)(function (element, state, keyboard, record) {
  if (record.type === 'attributes' && record.attributeName === ATTRIBUTE_SHOW) {

    var showImage = parseInt(record.target.getAttribute(ATTRIBUTE_SHOW));

    // update the view
    updateView(element, _extends(state, {
      currentImage: isNaN(showImage) ? null : showImage
    }));
  }
});

/**
 * Initializes a panel
 *
 * @function
 * @param {HTMLElement} element
 * @return {HTMLElement}
 */
function init(element) {
  // get button html elements
  var nextButton = element.querySelector('.next');
  var prevButton = element.querySelector('.previous');
  var closeButton = element.querySelector('.close');
  var keyboard = new _keyboard2.default();

  /**
   * @typedef {object} ImageLightboxState
   * @property {number} currentImage Index of image to display
   */
  var state = {
    currentImage: false
  };

  // initialize buttons
  onButtonPress(nextButton, function () {
    return onNavigationButtonClick(element, nextButton, state.currentImage + 1);
  });
  onButtonTab(nextButton, TAB_DIRECTION.BACKWARD, function () {
    return focus(prevButton, closeButton);
  });
  onButtonTab(nextButton, TAB_DIRECTION.FORWARD, function () {
    return focus(closeButton, prevButton);
  });

  onButtonPress(prevButton, function () {
    return onNavigationButtonClick(element, prevButton, state.currentImage - 1);
  });
  onButtonTab(prevButton, TAB_DIRECTION.BACKWARD, function () {
    return focus(closeButton, nextButton);
  });
  onButtonTab(prevButton, TAB_DIRECTION.FORWARD, function () {
    return focus(nextButton, closeButton);
  });

  onButtonPress(closeButton, function () {
    return hideLightbox(element);
  });
  onButtonTab(closeButton, TAB_DIRECTION.BACKWARD, function () {
    return focus(nextButton, prevButton);
  });
  onButtonTab(closeButton, TAB_DIRECTION.FORWARD, function () {
    return focus(prevButton, nextButton);
  });

  // When clicking on the background, let's close it
  element.addEventListener('click', function (event) {
    if (event.target === element) {
      hideLightbox(element);
    }
  });

  // Initialize keyboard navigation
  element.addEventListener('keyup', function (event) {
    if (event.which === KEY.ESC) {
      event.preventDefault();
      hideLightbox(element);
    } else if (event.which === KEY.LEFT_ARROW) {
      if (state.currentImage !== 0) {
        showImageLightbox(element, state.currentImage - 1);
      }
    } else if (event.which === KEY.RIGHT_ARROW) {
      var images = (0, _elements.querySelectorAll)('.imagelightbox-image', element);
      if (state.currentImage !== images.length - 1) {
        showImageLightbox(element, state.currentImage + 1);
      }
    }
  });

  // listen for updates to data-size
  var observer = new MutationObserver((0, _functional.forEach)(handleDomUpdate(element, state, keyboard)));

  observer.observe(element, {
    subtree: false,
    childList: false,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [ATTRIBUTE_SHOW]
  });

  return element;
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _collapsible = __webpack_require__(12);

var _keyboard = __webpack_require__(4);

var _keyboard2 = _interopRequireDefault(_keyboard);

var _elements = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Initializes a panel
 *
 * @param {HTMLElement} element
 * @return {HTMLElement}
 */
function init(element) {
  var keyboard = new _keyboard2.default();
  var togglerSelector = '[role="heading"] [aria-controls][aria-expanded]';
  keyboard.onSelect = function (el) {
    return (0, _elements.toggleAttribute)('aria-expanded', el);
  };

  // collapse/expand on header press
  (0, _collapsible.initCollapsible)(element, function (expanded, element) {
    return (0, _elements.toggleVisibility)(expanded, element);
  }, togglerSelector);

  // Add keyboard support to expand collapse
  (0, _elements.querySelectorAll)(togglerSelector, element).forEach(function (el) {
    return keyboard.addElement(el);
  });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCollapsible = undefined;

var _elements = __webpack_require__(0);

/**
 * Returns true if aria-expanded=true on element
 *
 * @param {HTMLElement} element
 * @function
 */
var isExpanded = (0, _elements.attributeEquals)("aria-expanded", 'true');

/**
 * Toggles hidden class on 'collapsible' when aria-expanded changes on 'toggler',
 * and toggles aria-expanded on 'toggler' on click
 *
 * @param {HTMLElement} element
 * @param {function} [targetHandler] falls back to toggleVisibility with hidden class
 * @param {string} [togglerSelector]
 */
var initCollapsible = exports.initCollapsible = function initCollapsible(element) {
  var targetHandler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _elements.toggleVisibility;
  var togglerSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '[aria-controls][aria-expanded]';

  // elements
  var togglers = (0, _elements.querySelectorAll)(togglerSelector, element);

  togglers.forEach(function (toggler) {
    var collapsibleId = toggler.getAttribute('aria-controls');
    var collapsible = element.querySelector('#' + collapsibleId);

    // set observer on title for aria-expanded
    var observer = new MutationObserver(function () {
      return targetHandler(isExpanded(toggler), collapsible);
    });

    observer.observe(toggler, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["aria-expanded"]
    });

    // Set click listener that toggles aria-expanded
    toggler.addEventListener('click', function () {
      return (0, _elements.toggleAttribute)("aria-expanded", toggler);
    });

    // initialize
    targetHandler(isExpanded(toggler), collapsible);
  });
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjI1Ij4NCiAgPGRlZnM+DQogICAgPHN0eWxlPg0KICAgICAgLmNscy0xIHsNCiAgICAgIGZpbGw6IG5vbmU7DQogICAgICB9DQoNCiAgICAgIC5jbHMtMiB7DQogICAgICBmaWxsOiAjYzZjNmM3Ow0KICAgICAgfQ0KDQogICAgICAuY2xzLTMsIC5jbHMtNCB7DQogICAgICBmaWxsOiAjZmZmOw0KICAgICAgfQ0KDQogICAgICAuY2xzLTMgew0KICAgICAgb3BhY2l0eTogMC43Ow0KICAgICAgfQ0KICAgIDwvc3R5bGU+DQogIDwvZGVmcz4NCiAgPHRpdGxlPmNvbnRlbnQgdHlwZSBwbGFjZWhvbGRlcl8yPC90aXRsZT4NCiAgPGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+DQogICAgPGcgaWQ9ImNvbnRlbnRfdHlwZV9wbGFjZWhvbGRlci0xX2NvcHkiIGRhdGEtbmFtZT0iY29udGVudCB0eXBlIHBsYWNlaG9sZGVyLTEgY29weSI+DQogICAgICA8cmVjdCBjbGFzcz0iY2xzLTEiIHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1Ii8+DQogICAgICA8cmVjdCBjbGFzcz0iY2xzLTIiIHg9IjExMi41MSIgeT0iNDMuNDEiIHdpZHRoPSIxNzYuOTYiIGhlaWdodD0iMTM1LjQ1IiByeD0iMTAiIHJ5PSIxMCIvPg0KICAgICAgPGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxMzYuNjYiIGN5PSI2MS45OCIgcj0iNC44MSIvPg0KICAgICAgPGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxNTEuNDkiIGN5PSI2MS45OCIgcj0iNC44MSIvPg0KICAgICAgPGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxNjYuMSIgY3k9IjYxLjk4IiByPSI0LjgxIi8+DQogICAgICA8ZyBpZD0iX0dyb3VwXyIgZGF0YS1uYW1lPSImbHQ7R3JvdXAmZ3Q7Ij4NCiAgICAgICAgPGcgaWQ9Il9Hcm91cF8yIiBkYXRhLW5hbWU9IiZsdDtHcm91cCZndDsiPg0KICAgICAgICAgIDxwYXRoIGlkPSJfQ29tcG91bmRfUGF0aF8iIGRhdGEtbmFtZT0iJmx0O0NvbXBvdW5kIFBhdGgmZ3Q7IiBjbGFzcz0iY2xzLTQiIGQ9Ik0yNjMuMjgsOTUuMjFDMjYwLDkyLjA3LDI1NSw5MS41LDI0OC40Myw5MS41SDIyN3Y4SDE5OS41bC0yLjE3LDEwLjI0YTI1Ljg0LDI1Ljg0LDAsMCwxLDExLjQ4LTEuNjMsMTkuOTMsMTkuOTMsMCwwLDEsMTQuMzksNS41NywxOC4yNiwxOC4yNiwwLDAsMSw1LjUyLDEzLjYsMjMuMTEsMjMuMTEsMCwwLDEtMi44NCwxMS4wNSwxOC42NSwxOC42NSwwLDAsMS04LjA2LDcuNzksOSw5LDAsMCwxLTQuMTIsMS4zN0gyMzZ2LTIxaDEwLjQyYzcuMzYsMCwxMi44My0xLjYxLDE2LjQyLTVzNS4zOC03LjQ4LDUuMzgtMTMuNDRDMjY4LjIyLDEwMi4yOSwyNjYuNTcsOTguMzUsMjYzLjI4LDk1LjIxWm0tMTUsMTdjLTEuNDIsMS4yMi0zLjksMS4yNS03LjQxLDEuMjVIMjM2di0xNGg1LjYyYTkuNTcsOS41NywwLDAsMSw3LDIuOTMsNy4wNSw3LjA1LDAsMCwxLDEuODUsNC45MkE2LjMzLDYuMzMsMCwwLDEsMjQ4LjMxLDExMi4yNVoiLz4NCiAgICAgICAgICA8cGF0aCBpZD0iX1BhdGhfIiBkYXRhLW5hbWU9IiZsdDtQYXRoJmd0OyIgY2xhc3M9ImNscy00IiBkPSJNMjAyLjksMTE5LjExYTguMTIsOC4xMiwwLDAsMC03LjI4LDQuNTJsLTE2LTEuMjIsNy4yMi0zMC45MkgxNzR2MjJIMTUzdi0yMkgxMzZ2NTZoMTd2LTIxaDIxdjIxaDIwLjMxYy0yLjcyLDAtNS0xLjUzLTctM2ExOS4xOSwxOS4xOSwwLDAsMS00LjczLTQuODMsMjMuNTgsMjMuNTgsMCwwLDEtMy02LjZsMTYtMi4yNmE4LjExLDguMTEsMCwxLDAsNy4yNi0xMS43MloiLz4NCiAgICAgICAgPC9nPg0KICAgICAgPC9nPg0KICAgICAgPHJlY3QgY2xhc3M9ImNscy0zIiB4PSIxNzcuNjYiIHk9IjU3LjY2IiB3aWR0aD0iOTIuMjgiIGhlaWdodD0iOS4zOCIgcng9IjMuNSIgcnk9IjMuNSIvPg0KICAgIDwvZz4NCiAgPC9nPg0KPC9zdmc+DQo="

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hubView = __webpack_require__(24);

var _hubView2 = _interopRequireDefault(_hubView);

var _contentTypeSection = __webpack_require__(9);

var _contentTypeSection2 = _interopRequireDefault(_contentTypeSection);

var _uploadSection = __webpack_require__(27);

var _uploadSection2 = _interopRequireDefault(_uploadSection);

var _hubServices = __webpack_require__(8);

var _hubServices2 = _interopRequireDefault(_hubServices);

var _dictionary = __webpack_require__(3);

var _dictionary2 = _interopRequireDefault(_dictionary);

var _eventful = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {object} HubState
 * @property {string} title
 * @property {string} sectionId
 * @property {boolean} expanded
 * @property {string} apiRootUrl
 * @property {ApiVersion} apiVersion
 */
/**
 * @typedef {object} ApiVersion
 * @property {number} major
 * @property {number} minor
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
 * Attach modal event
 * @event Hub#attachModal
 * @type {object}
 * @property {Element} element
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
   * @param {object} dictionary
   */
  function Hub(state, services, dictionary) {
    var _this = this;

    _classCallCheck(this, Hub);

    var self = this;

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    // Setting up Dictionary
    _dictionary2.default.init(dictionary);

    // services
    this.services = services;
    this.setupServices();

    // controllers
    this.contentTypeSection = new _contentTypeSection2.default(state, this.services);
    this.uploadSection = new _uploadSection2.default(state, this.services);

    // views
    this.view = new _hubView2.default(state);

    // propagate controller events
    this.propagate(['select'], this.contentTypeSection);
    this.propagate(['upload'], this.uploadSection);

    // handle events
    this.on('select', this.setPanelTitle, this);
    this.on('select', this.view.togglePanelOpen.bind(this.view, false));
    this.on('upload', this.view.togglePanelOpen.bind(this.view, false));
    this.view.on('tab-change', function (event) {
      if (event.id === 'upload' && !event.element.getAttribute('aria-selected')) {
        // Clean up messages
        self.uploadSection.clearMessages();
      }

      _this.view.setSectionType(event);
    });
    this.view.on('panel-change', function (_ref) {
      var element = _ref.element;

      _this.view.togglePanelOpen();
      _this.postponedResize();
      if (element.getAttribute('aria-expanded') === 'true') {
        _this.contentTypeSection.focusSearchBar();
      }
    }, this);
    this.contentTypeSection.on('reload', this.setupServices, this);
    this.contentTypeSection.on('reload', this.contentTypeSection.selectDefaultMenuItem.bind(this.contentTypeSection, false));
    this.contentTypeSection.on('modal', this.showModal, this);
    this.on('clear-upload-form', function () {
      _this.uploadSection.clearUploadForm();
    });

    this.initTabPanel(state);
  }

  /**
   * Does a resize after 150ms
   */


  _createClass(Hub, [{
    key: 'postponedResize',
    value: function postponedResize() {
      var _this2 = this;

      setTimeout(function () {
        return _this2.trigger('resized');
      }, 150);
    }

    /**
     * Appends a modal to the root element and shows it
     *
     * @param {HTMLElement} element
     */

  }, {
    key: 'showModal',
    value: function showModal(_ref2) {
      var element = _ref2.element;

      // Prepend to catch and trap focus
      var parent = this.view.getElement();
      parent.insertBefore(element, parent.firstChild);
      element.classList.remove('hidden');
    }

    /**
     * Setup services and handle fetching data
     */

  }, {
    key: 'setupServices',
    value: function setupServices() {
      var self = this;

      this.services.setup().then(function () {
        self.contentTypeSection.loaded();
      }).catch(function (error) {
        self.contentTypeSection.handleError(error);
      });
    }

    /**
     * Returns the promise of a content type
     * @param {string} machineName
     * @return {Promise.<ContentType>}
     */

  }, {
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
    value: function setPanelTitle(_ref3) {
      var _this3 = this;

      var id = _ref3.id;

      this.getContentType(id).then(function (_ref4) {
        var title = _ref4.title;
        return _this3.view.setTitle(title ? title : id);
      });
    }

    /**
     * Initiates the tab panel
     *
     * @param {string} sectionId
     */

  }, {
    key: 'initTabPanel',
    value: function initTabPanel(_ref5) {
      var _this4 = this;

      var _ref5$sectionId = _ref5.sectionId,
          sectionId = _ref5$sectionId === undefined ? 'content-types' : _ref5$sectionId;

      var tabConfigs = [{
        title: _dictionary2.default.get('createContentTabLabel'),
        id: 'content-types',
        content: this.contentTypeSection.getElement()
      }, {
        title: _dictionary2.default.get('uploadTabLabel'),
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
        return _this4.view.addTab(tabConfig);
      });
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _hubServices = __webpack_require__(8);

var _hubServices2 = _interopRequireDefault(_hubServices);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function createDelayedPromise(rejectMe, data) {
  data = data || 'no-data';
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (rejectMe) {
        reject(data);
      } else {
        resolve(data);
      }
    }, 3000);
  });
}

var HubServicesFailInit = function (_HubServices) {
  _inherits(HubServicesFailInit, _HubServices);

  function HubServicesFailInit(state) {
    _classCallCheck(this, HubServicesFailInit);

    return _possibleConstructorReturn(this, (HubServicesFailInit.__proto__ || Object.getPrototypeOf(HubServicesFailInit)).call(this, state));
  }

  _createClass(HubServicesFailInit, [{
    key: 'setup',
    value: function setup() {
      this.counter = (this.counter || 0) + 1;

      if (this.counter === 1) {
        this.cachedContentTypes = Promise.reject({
          messageCode: 'SERVER_ERROR'
        });
        return this.cachedContentTypes;
      }

      if (this.counter === 2) {
        this.cachedContentTypes = Promise.reject('failed');
        return this.cachedContentTypes;
      }

      return _get(HubServicesFailInit.prototype.__proto__ || Object.getPrototypeOf(HubServicesFailInit.prototype), 'setup', this).call(this);
    }
  }]);

  return HubServicesFailInit;
}(_hubServices2.default);

var HubServicesFailInstalling = function (_HubServices2) {
  _inherits(HubServicesFailInstalling, _HubServices2);

  function HubServicesFailInstalling() {
    _classCallCheck(this, HubServicesFailInstalling);

    return _possibleConstructorReturn(this, (HubServicesFailInstalling.__proto__ || Object.getPrototypeOf(HubServicesFailInstalling)).apply(this, arguments));
  }

  _createClass(HubServicesFailInstalling, [{
    key: 'installContentType',
    value: function installContentType(id) {
      this.counter = (this.counter || 0) + 1;
      return createDelayedPromise(this.counter < 3);
    }
  }]);

  return HubServicesFailInstalling;
}(_hubServices2.default);

var HubServicesFailFetchLicense = function (_HubServices3) {
  _inherits(HubServicesFailFetchLicense, _HubServices3);

  function HubServicesFailFetchLicense() {
    _classCallCheck(this, HubServicesFailFetchLicense);

    return _possibleConstructorReturn(this, (HubServicesFailFetchLicense.__proto__ || Object.getPrototypeOf(HubServicesFailFetchLicense)).apply(this, arguments));
  }

  _createClass(HubServicesFailFetchLicense, [{
    key: 'getLicenseDetails',
    value: function getLicenseDetails(licenseId) {
      this.counter = (this.counter || 0) + 1;

      return createDelayedPromise(this.counter == 1, {
        id: licenseId,
        description: 'Here comes the license'
      });
    }
  }]);

  return HubServicesFailFetchLicense;
}(_hubServices2.default);

var HubServicesFailUploadingValidation = function (_HubServices4) {
  _inherits(HubServicesFailUploadingValidation, _HubServices4);

  function HubServicesFailUploadingValidation() {
    _classCallCheck(this, HubServicesFailUploadingValidation);

    return _possibleConstructorReturn(this, (HubServicesFailUploadingValidation.__proto__ || Object.getPrototypeOf(HubServicesFailUploadingValidation)).apply(this, arguments));
  }

  _createClass(HubServicesFailUploadingValidation, [{
    key: 'uploadContent',
    value: function uploadContent(formData) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          return resolve({
            errorCode: "VALIDATION_FAILED",
            message: "Validating h5p package failed.",
            success: false
          });
        }, 5000);
      });
    }
  }]);

  return HubServicesFailUploadingValidation;
}(_hubServices2.default);

var HubServicesFailUploading = function (_HubServices5) {
  _inherits(HubServicesFailUploading, _HubServices5);

  function HubServicesFailUploading() {
    _classCallCheck(this, HubServicesFailUploading);

    return _possibleConstructorReturn(this, (HubServicesFailUploading.__proto__ || Object.getPrototypeOf(HubServicesFailUploading)).apply(this, arguments));
  }

  _createClass(HubServicesFailUploading, [{
    key: 'uploadContent',
    value: function uploadContent(formData) {
      return createDelayedPromise(true, 'failed');
    }
  }]);

  return HubServicesFailUploading;
}(_hubServices2.default);

var HubServicesFactory = function () {
  function HubServicesFactory() {
    _classCallCheck(this, HubServicesFactory);
  }

  _createClass(HubServicesFactory, null, [{
    key: 'get',
    value: function get(mode, state) {
      switch (mode) {
        case 'fail-fetch-content-types':
          return new HubServicesFailInit(state);
        case 'fail-installing':
        case 'fail-updating':
          return new HubServicesFailInstalling(state);
        case 'fail-fetch-license':
          return new HubServicesFailFetchLicense(state);
        case 'fail-uploading':
          return new HubServicesFailUploading(state);
        case 'fail-uploading-validation':
          return new HubServicesFailUploadingValidation(state);
      }
    }
  }]);

  return HubServicesFactory;
}();

exports.default = HubServicesFactory;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 16 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _elements = __webpack_require__(0);

var _functional = __webpack_require__(1);

var _eventful = __webpack_require__(2);

var _panel = __webpack_require__(11);

var _panel2 = _interopRequireDefault(_panel);

var _modal = __webpack_require__(31);

var _modal2 = _interopRequireDefault(_modal);

var _imageScroller = __webpack_require__(30);

var _imageScroller2 = _interopRequireDefault(_imageScroller);

var _imageLightbox = __webpack_require__(10);

var _imageLightbox2 = _interopRequireDefault(_imageLightbox);

var _events = __webpack_require__(6);

var _contentTypePlaceholder = __webpack_require__(13);

var _contentTypePlaceholder2 = _interopRequireDefault(_contentTypePlaceholder);

var _dictionary = __webpack_require__(3);

var _dictionary2 = _interopRequireDefault(_dictionary);

var _messageView = __webpack_require__(7);

var _messageView2 = _interopRequireDefault(_messageView);

var _imageLightbox3 = __webpack_require__(25);

var _imageLightbox4 = _interopRequireDefault(_imageLightbox3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @event {ContentTypeDetailView#show-license-dialog}
 * @type {object}
 * @property {string[]} types
 */

/**
 * @constant {string}
 */
var ATTRIBUTE_CONTENT_TYPE_ID = 'data-id';

/**
 * @constant {number}
 */
var MAX_TEXT_SIZE_DESCRIPTION = 285;

/**
 * @constant {string}
 */
var IMAGELIGHTBOX = 'imagelightbox';

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
 * Disables an HTMLElement
 *
 * @param {HTMLElement} element
 *
 * @function
 */
var disable = (0, _elements.setAttribute)('disabled', '');

/**
 * Disables an HTMLElement
 *
 * @param {HTMLElement} element
 *
 * @function
 */
var enable = (0, _elements.removeAttribute)('disabled');

/**
 * Focuses an HTMLElement
 *
 * @param {HTMLElement} element
 *
 * @function
 */
var focus = function focus(element) {
  return element.focus();
};

/**
 * Registers a click handler on an HTMLElement
 *
 * @param {HTMLElement} element
 * @param {Function} handler
 *
 * @function
 */
var onClick = function onClick(element, handler) {
  return element.addEventListener('click', handler);
};

/**
 * @class
 * @mixes Eventful
 */

var ContentTypeDetailView = function () {
  function ContentTypeDetailView(state) {
    var _this = this;

    _classCallCheck(this, ContentTypeDetailView);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    // create view
    this.rootElement = this.createView();

    // grab references
    this.buttonBar = this.rootElement.querySelector('.button-bar');
    this.useButton = this.buttonBar.querySelector('.button-use');
    this.updateButton = this.buttonBar.querySelector('.button-update');
    this.updatingButton = this.buttonBar.querySelector('.button-updating');
    this.installButton = this.buttonBar.querySelector('.button-install');
    this.installingButton = this.buttonBar.querySelector('.button-installing');
    this.buttons = (0, _elements.querySelectorAll)('.button', this.buttonBar);

    this.imageLightbox = new _imageLightbox4.default();

    // Restore focus to image when lightbox is hidden
    this.imageLightbox.on('lightbox-hidden', function () {
      if (_this.focusedImage) {
        _this.focusedImage.focus();
        delete _this.focusedImage;
      }
    });

    this.contentContainer = this.rootElement.querySelector('.container');
    this.image = this.rootElement.querySelector('.content-type-image');
    this.title = this.rootElement.querySelector('.text-details .title');
    this.ownerElement = this.rootElement.querySelector('.owner');
    this.description = this.rootElement.querySelector('.text-details .small');
    this.demoButton = this.rootElement.querySelector('.demo-button');
    this.carousel = this.rootElement.querySelector('.carousel');
    this.carouselList = this.carousel.querySelector('ul');

    this.panel = this.rootElement.querySelector('.panel');
    this.licensePanelHeading = this.rootElement.querySelector('.license-panel-heading');
    this.licensePanelBody = this.rootElement.querySelector('#license-panel');
    this.container = this.rootElement.querySelector('.container');

    /**
     * Finds the license button for us
     *
     * @return {HTMLElement}
     */
    this.licenseButton = function () {
      return _this.licensePanelBody.querySelector('.short-license-read-more');
    };

    /**
     * Generates an event handler for showing the license
     *
     * @function
     */
    this.showLicense = (0, _functional.curry)(function (licenseId, event) {
      return _this.trigger('show-license-dialog', { licenseId: licenseId });
    });

    // init interactive elements
    (0, _panel2.default)(this.panel);
    (0, _imageScroller2.default)(this.carousel);

    // fire events on button click
    (0, _events.relayClickEventAs)('close', this, this.rootElement.querySelector('.back-button'));
    (0, _events.relayClickEventAs)('select', this, this.useButton);
    (0, _events.relayClickEventAs)('install', this, this.updateButton);
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
      // ids
      var titleId = 'content-type-detail-view-title';

      // create element
      var element = document.createElement('div');
      element.className = 'content-type-detail';
      element.id = 'content-type-detail';
      element.setAttribute('role', 'region');
      element.setAttribute('tabindex', '-1');
      element.setAttribute('aria-labelledby', titleId);

      element.innerHTML = "\n      <button type=\"button\" class=\"back-button icon-arrow-thick\" aria-label=\"" + _dictionary2.default.get("contentTypeBackButtonLabel") + "\" tabindex=\"0\"></button>\n      <div class=\"container\">\n        <div class=\"image-wrapper\">\n          <img class=\"img-responsive content-type-image\" src=\"" + _contentTypePlaceholder2.default + "\">\n        </div>\n        <div class=\"text-details\">\n          <h2 id=\"" + titleId + "\" class=\"title\" tabindex=\"-1\"></h2>\n          <div class=\"owner\"></div>\n          <p class=\"small\"></p>\n          <a class=\"button demo-button\" target=\"_blank\" href=\"#\">\n            " + _dictionary2.default.get("contentTypeDemoButtonLabel") + "\n          </a>\n        </div>\n      </div>\n      <div class=\"carousel\" role=\"region\" data-size=\"5\" data-prevent-resize-loop=\"true\" aria-label=\"" + _dictionary2.default.get('screenshots') + "\">\n        <nav class=\"scroller\">\n          <ul></ul>\n        </nav>\n        <button type=\"button\" class=\"carousel-button next hidden\" disabled aria-label=\"" + _dictionary2.default.get('nextImage') + "\">\n          <span class=\"icon-arrow-thick\"></span>\n        </button>\n        <button type=\"button\" class=\"carousel-button previous hidden\" disabled aria-label=\"" + _dictionary2.default.get('previousImage') + "\">\n          <span class=\"icon-arrow-thick\"></span>\n        </button>\n      </div>\n      <hr />\n      <div class=\"button-bar\">\n        <button type=\"button\" class=\"button button-inverse-primary button-install hidden\" data-id=\"\">\n          <span class=\"icon-arrow-thick\"></span>\n          " + _dictionary2.default.get('contentTypeInstallButtonLabel') + "\n        </button>\n        <button type=\"button\" class=\"button button-inverse-primary button-installing hidden\">\n          <span class=\"icon-loading-search icon-spin\"></span>\n          " + _dictionary2.default.get("contentTypeInstallingButtonLabel") + "\n        </button>\n        <button type=\"button\" class=\"button button-inverse-primary button-update\">\n          " + _dictionary2.default.get("contentTypeUpdateButtonLabel") + "\n        </button>\n        <button type=\"button\" class=\"button button-inverse-primary button-updating\">\n          <span class=\"icon-loading-search icon-spin\"></span>\n          " + _dictionary2.default.get("contentTypeUpdatingButtonLabel") + "\n        </button>\n        <button type=\"button\" class=\"button button-primary button-use\" data-id=\"\">\n          " + _dictionary2.default.get("contentTypeUseButtonLabel") + "\n        </button>\n      </div>\n      <dl class=\"panel panel-default license-panel\">\n        <dt aria-level=\"2\" role=\"heading\" class=\"license-panel-heading\">\n          <div role=\"button\" aria-expanded=\"false\" aria-controls=\"license-panel\">\n            <span class=\"icon-accordion-arrow\"></span>\n            <span>" + _dictionary2.default.get('contentTypeLicensePanelTitle') + "</span>\n          </div>\n        </dt>\n        <dl id=\"license-panel\" role=\"region\" class=\"hidden\">\n          <div class=\"panel-body\"></div>\n        </dl>\n      </dl>";

      return element;
    }

    /**
     * Sets a message on install
     *
     * @param {boolean} success
     * @param {string} message
     */

  }, {
    key: "setInstallMessage",
    value: function setInstallMessage(_ref) {
      var _ref$success = _ref.success,
          success = _ref$success === undefined ? true : _ref$success,
          message = _ref.message;

      if (this.installMessage) {
        this.installMessage.remove();
      }

      this.installMessage = new _messageView2.default({
        dismissible: true,
        type: success ? 'info' : 'error',
        name: 'install-message',
        title: message
      });

      this.rootElement.insertBefore(this.installMessage.getElement(), this.buttonBar);
    }

    /**
     * Set screenshots
     *
     * @param {{url: string, alt:string}[]} screenshots
     */

  }, {
    key: "setScreenshots",
    value: function setScreenshots(screenshots) {
      var _this2 = this;

      screenshots.forEach(function (image, index) {
        // add lightbox
        _this2.imageLightbox.addImage(image);

        // add thumbnail
        var thumbnail = document.createElement('li');
        thumbnail.className = 'slide';
        thumbnail.innerHTML = "<img src=\"" + image.url + "\"\n              alt=\"" + image.alt + "\"\n              data-index=\"" + index + "\"\n              class=\"img-responsive\"\n              aria-controls=\"" + IMAGELIGHTBOX + "-detail\"\n        />";

        var img = thumbnail.querySelector('img');
        img.addEventListener('click', function () {
          _this2.imageLightbox.show(index);
          _this2.trigger('modal', { element: _this2.imageLightbox.getElement() });
          _this2.focusedImage = img;
        });

        img.addEventListener('keydown', function (event) {
          if (event.which === 32 || event.which === 13) {
            _this2.imageLightbox.show(index);
            _this2.trigger('modal', { element: _this2.imageLightbox.getElement() });
            _this2.focusedImage = img;
            event.preventDefault();
          }
        });

        _this2.carouselList.appendChild(thumbnail);
      });
    }

    /**
     * Resets the detail view
     */

  }, {
    key: "reset",
    value: function reset() {
      this.installButton.removeAttribute('disabled');
      if (this.messageViewElement) {
        this.container.removeChild(this.messageViewElement);
        delete this.messageViewElement;
      }

      // Hide all buttons
      this.buttons.forEach(function (button) {
        button.classList.add('hidden');
      });

      // Remove messages
      this.removeMessages();
      this.resetLicenses();

      // Remove images:
      (0, _elements.querySelectorAll)('li', this.carouselList).forEach((0, _elements.removeChild)(this.carouselList));
      this.imageLightbox.reset();
    }

    /**
     * Informs view if api version required by content type is un supported. The view
     * will disable the install-button and display a warning message.
     */

  }, {
    key: "apiVersionUnsupported",
    value: function apiVersionUnsupported() {
      // Disable install button
      this.installButton.setAttribute('disabled', 'disabled');

      var messageView = new _messageView2.default({
        type: 'warning',
        title: _dictionary2.default.get('contentTypeUnsupportedApiVersionTitle'),
        content: _dictionary2.default.get('contentTypeUnsupportedApiVersionContent')
      });

      this.messageViewElement = messageView.getElement();
      this.container.insertBefore(this.messageViewElement, this.container.childNodes[0]);
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
      this.updateButton.setAttribute(ATTRIBUTE_CONTENT_TYPE_ID, id);
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
    value: function setDescription() {
      var _this3 = this;

      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (text && text.length > MAX_TEXT_SIZE_DESCRIPTION) {
        this.description.innerHTML = this.ellipsis(MAX_TEXT_SIZE_DESCRIPTION, text, true) + "<button type=\"button\" class=\"read-more link\">" + _dictionary2.default.get('readMore') + "</button>";
        this.description.querySelector('.read-more, .read-less').addEventListener('click', function () {
          return _this3.toggleDescriptionExpanded(text);
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
      var _this4 = this;

      // flip boolean
      this.descriptionExpanded = !this.descriptionExpanded;

      if (this.descriptionExpanded) {
        this.description.innerHTML = "" + this.ellipsis(MAX_TEXT_SIZE_DESCRIPTION, text) + this.ellipsisRest(MAX_TEXT_SIZE_DESCRIPTION, text) + "\n                                    <button type=\"button\" class=\"read-less link\">" + _dictionary2.default.get('readLess') + "</button>";

        this.description.querySelector('.part-two').focus();
      } else {
        this.description.innerHTML = this.ellipsis(MAX_TEXT_SIZE_DESCRIPTION, text, true) + "\n                                    <button type=\"button\" class=\"read-more link\">" + _dictionary2.default.get('readMore') + "</button>";

        this.description.querySelector('.part-one').focus();
      }

      this.description.querySelector('.read-more, .read-less').addEventListener('click', function () {
        return _this4.toggleDescriptionExpanded(text);
      });
    }

    /**
     * Shortens a string, and puts an elipsis at the end
     *
     * @param {number} size
     * @param {string} text
     * @param {boolean} [addEllipses] whether ellipses should be added
     */

  }, {
    key: "ellipsis",
    value: function ellipsis(size, text, addEllipses) {
      if (addEllipses) {
        return "<span class=\"part-one\" tabindex=\"-1\">" + text.substr(0, size) + "...</span>";
      }
      return "<span class=\"part-one\" tabindex=\"-1\">" + text.substr(0, size) + "</span>";
    }

    /**
     * Gets the text cut off by ellipsis
     *
     * @param {number} size
     * @param {string} text
     */

  }, {
    key: "ellipsisRest",
    value: function ellipsisRest(size, text) {
      return "<span class=\"part-two\" tabindex=\"-1\">" + text.substr(size) + "</span>";
    }

    /**
     * Removes the licenses that are listed
     */

  }, {
    key: "resetLicenses",
    value: function resetLicenses() {
      var container = this.licensePanelBody.querySelector('.panel-body');
      (0, _elements.querySelectorAll)('dt,dl', container).forEach((0, _elements.removeChild)(container));
    }

    /**
     * Sets the lisence
     *
     * @param {object} license
     * @param {string} license.id
     * @param {object} license.attributes
     */

  }, {
    key: "setLicense",
    value: function setLicense(license) {
      this.license = license;

      var panelContainer = this.licensePanelBody.querySelector('.panel-body');

      if (license) {
        // Create short version for detail page
        var shortLicenseInfo = document.createElement('div');
        shortLicenseInfo.className = 'short-license-info';
        shortLicenseInfo.innerHTML = "\n        <h3>" + license.id + "</h3>\n        <button type=\"button\" class=\"short-license-read-more icon-info-circle\" aria-label=\"" + _dictionary2.default.get('readMore') + "\"></button>\n        <ul class=\"ul small\">\n          <li>" + _dictionary2.default.get(license.attributes.useCommercially ? "licenseCanUseCommercially" : "licenseCannotUseCommercially") + "</li>\n          <li>" + _dictionary2.default.get(license.attributes.modifiable ? "licenseCanModify" : "licenseCannotModify") + "</li>\n          <li>" + _dictionary2.default.get(license.attributes.distributable ? "licenseCanDistribute" : "licenseCannotDistribute") + "</li>\n          <li>" + _dictionary2.default.get(license.attributes.sublicensable ? "licenseCanSublicense" : "licenseCannotSublicense") + "</li>\n          <li>" + _dictionary2.default.get(license.attributes.canHoldLiable ? "licenseCanHoldLiable" : "licenseCannotHoldLiable") + "</li>\n          <li>" + _dictionary2.default.get(license.attributes.mustIncludeCopyright ? "licenseMustIncludeCopyright" : "licenseMustNotIncludeCopyright") + "</li>\n          <li>" + _dictionary2.default.get(license.attributes.mustIncludeLicense ? "licenseMustIncludeLicense" : "licenseMustNotIncludeLicense") + "</li>\n        </ul>";

        // add short version of lisence
        panelContainer.innerText = '';
        panelContainer.appendChild(shortLicenseInfo);

        // handle clicking read more
        onClick(this.licenseButton(), this.showLicense(license.id));
      } else {
        panelContainer.innerText = _dictionary2.default.get('licenseUnspecified');
      }
    }

    /**
     * Creates a modal window for license details
     *
     * @param {Promise} licenseDetails
     *
     * @return {Element}
     */

  }, {
    key: "createLicenseDialog",
    value: function createLicenseDialog(licenseDetails) {
      var _this5 = this;

      var titleId = 'license-dialog-title';
      var modal = document.createElement('div');
      modal.innerHTML = "\n      <div class=\"modal fade show\" role=\"dialog\">\n        <div class=\"modal-dialog license-dialog\" role=\"document\">\n          <div class=\"modal-content\">\n            <div class=\"modal-header\" tabindex=\"-1\"  aria-labelledby=\"" + titleId + "\">\n              <button type=\"button\" class=\"close icon-close\" data-dismiss=\"modal\" aria-label=\"" + _dictionary2.default.get('close') + "\"></button>\n              <h5 class=\"modal-title\" id=\"" + titleId + "\">" + _dictionary2.default.get('licenseModalTitle') + "</h5>\n              <h5 class=\"modal-subtitle\">" + _dictionary2.default.get('licenseModalSubtitle') + "</h5>\n            </div>\n            <div class=\"modal-body loading\">\n              <dl class=\"panel panel-simple\"></dl>\n            </div>\n          </div>\n        </div>\n      </div>";

      var modalBody = modal.querySelector('.modal-body');
      var panel = modalBody.querySelector('.panel');
      var id = "content-type-detail-license";

      var header = document.createElement('dt');
      header.setAttribute('role', 'heading');
      header.setAttribute('aria-level', '2');
      header.innerHTML = "<div role=\"button\" aria-expanded=\"true\" aria-controls=\"" + id + "\">\n        <span class=\"icon-accordion-arrow\"></span>\n        <span class=\"license-title\">" + this.license.id + "</span>\n      </div>";

      var body = document.createElement('dd');
      body.id = id;
      body.className = 'hidden';
      body.setAttribute('role', 'region');
      body.innerHTML = "\n      <div class=\"panel-body\">\n        <div class=\"license-description\"></div>\n      </div>";
      (0, _elements.hide)(body);

      var title = header.querySelector('.license-title');
      var description = body.querySelector('.license-description');

      panel.appendChild(header);
      panel.appendChild(body);

      licenseDetails.then(function (details) {
        title.innerHTML = details.id;
        description.innerHTML = details.description.replace(':year', new Date().getFullYear()).replace(':owner', _this5.owner);
      }).catch(function (error) {
        modalBody.innerHTML = _dictionary2.default.get('licenseFetchDetailsFailed');
      }).then(function () {
        return (0, _elements.removeClass)('loading', modalBody);
      });

      (0, _modal2.default)(modal, function () {
        return _this5.trigger('hide-license-dialog');
      });
      (0, _panel2.default)(panel);

      return modal;
    }

    /**
     *
     */

  }, {
    key: "focusLicenseDetailsButton",
    value: function focusLicenseDetailsButton() {
      focus(this.licenseButton());
    }

    /**
     * Sets the long description
     *
     * @param {string} owner
     */

  }, {
    key: "setOwner",
    value: function setOwner(owner) {
      this.owner = owner;

      if (owner) {
        this.ownerElement.innerHTML = _dictionary2.default.get('contentTypeOwner', { ':owner': owner });
      } else {
        this.ownerElement.innerHTML = '';
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
      (0, _elements.toggleVisibility)(!isEmpty(url), this.demoButton);
    }

    /**
     * Sets if the content type is installed
     *
     * @param {boolean} installed
     */

  }, {
    key: "setIsInstalled",
    value: function setIsInstalled(installed) {
      this.useButton.classList[installed ? 'remove' : 'add']('hidden');
      this.installButton.classList[installed ? 'add' : 'remove']('hidden');
    }

    /**
     * Shows the update button if it is possible to update the content type
     *
     * @param {boolean} isUpdatePossible
     * @param {string} [title] Used to display update message. Only required if
     * update is possible
     */

  }, {
    key: "setIsUpdatePossible",
    value: function setIsUpdatePossible(isUpdatePossible, title) {
      this.updateButton.classList[isUpdatePossible ? 'remove' : 'add']('hidden');

      // Set warning message
      if (isUpdatePossible) {
        this.updateMessage = new _messageView2.default({
          type: 'warning',
          title: _dictionary2.default.get('warningUpdateAvailableTitle', { ':contentType': title || _dictionary2.default.get('theContentType') }),
          content: _dictionary2.default.get('warningUpdateAvailableBody')
        });
        this.rootElement.insertBefore(this.updateMessage.getElement(), this.contentContainer);
      }
    }

    /**
     * Removes all install/update messages
     */

  }, {
    key: "removeMessages",
    value: function removeMessages() {
      if (this.updateMessage) {
        this.updateMessage.remove();
      }
      if (this.installMessage) {
        this.installMessage.remove();
      }
    }

    /**
     * Marks content type as restricted, disabling installing and using the content type.
     *
     * @param {boolean} restricted True if content type is restricted
     */

  }, {
    key: "setIsRestricted",
    value: function setIsRestricted(restricted) {
      if (restricted) {
        disable(this.useButton);
        disable(this.installButton);
      } else {
        enable(this.useButton);
        enable(this.installButton);
      }
    }

    /**
     * Toggle spinner visibility for the currently showing install or update button
     *
     * @param {boolean} enable Set spinner state
     */

  }, {
    key: "toggleSpinner",
    value: function toggleSpinner(enable) {
      var buttonToCheck = enable ? 'updateButton' : 'updatingButton';
      var isShowingInstallButton = this[buttonToCheck].classList.contains('hidden');
      if (isShowingInstallButton) {
        this.installButton.classList[enable ? 'add' : 'remove']('hidden');
        this.installingButton.classList[enable ? 'remove' : 'add']('hidden');
      } else {
        this.updateButton.classList[enable ? 'add' : 'remove']('hidden');
        this.updatingButton.classList[enable ? 'remove' : 'add']('hidden');
      }
    }

    /**
     * Hides the root element
     */

  }, {
    key: "hide",
    value: function hide() {
      this.rootElement.classList.remove('show');
    }

    /**
     * Shows the root element
     */

  }, {
    key: "show",
    value: function show() {
      this.rootElement.classList.add('show');
    }

    /**
     * Focuses on the title
     */

  }, {
    key: "focus",
    value: function focus() {
      var _this6 = this;

      setTimeout(function () {
        return _this6.title.focus();
      }, 200);
    }

    /**
     * Returns whether the detailview is hidden
     *
     * @return {boolean}
     */

  }, {
    key: "isHidden",
    value: function isHidden() {
      return this.rootElement.classList.contains('hidden');
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _contentTypeDetailView = __webpack_require__(19);

var _contentTypeDetailView2 = _interopRequireDefault(_contentTypeDetailView);

var _eventful = __webpack_require__(2);

var _dictionary = __webpack_require__(3);

var _dictionary2 = _interopRequireDefault(_dictionary);

var _media = __webpack_require__(29);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @mixes Eventful
 */
var ContentTypeDetail = function () {
  function ContentTypeDetail(state, services) {
    var _this = this;

    _classCallCheck(this, ContentTypeDetail);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    // set member variables
    this.apiVersion = state.apiVersion;

    // services
    this.services = services;

    // views
    this.view = new _contentTypeDetailView2.default(state);
    this.view.on('install', function (_ref) {
      var id = _ref.id;

      _this.services.contentType(id).then(function (contentType) {
        return _this.install({
          id: contentType.machineName,
          title: contentType.title,
          installed: contentType.installed
        });
      });
    }, this);
    this.view.on('show-license-dialog', this.showLicenseDialog, this);
    this.view.on('hide-license-dialog', function () {
      return _this.view.focusLicenseDetailsButton();
    });

    // propagate events
    this.propagate(['close', 'select', 'modal'], this.view);
  }

  /**
   * Hides the detail view
   */


  _createClass(ContentTypeDetail, [{
    key: 'hide',
    value: function hide() {
      this.view.hide();
    }

    /**
     * Shows the detail view
     */

  }, {
    key: 'show',
    value: function show() {
      this.view.show();
    }

    /**
     * Focuses on the title
     */

  }, {
    key: 'focus',
    value: function focus() {
      this.view.focus();
    }

    /**
     * Returns whether the detailview is hidden
     *
     * @return {boolean}
     */

  }, {
    key: 'isHidden',
    value: function isHidden() {
      return this.view.isHidden();
    }

    /**
     * Loads a Content Type description
     *
     * @param {string} id
     *
     * @return {Promise.<ContentType>}
     */

  }, {
    key: 'loadById',
    value: function loadById(id) {
      this.services.contentType(id).then(this.update.bind(this));
    }

    /**
     * Displays the license dialog
     *
     * @param {string} licenseId
     */

  }, {
    key: 'showLicenseDialog',
    value: function showLicenseDialog(_ref2) {
      var licenseId = _ref2.licenseId;

      var licenseDialog = this.view.createLicenseDialog(this.services.getLicenseDetails(licenseId));

      // triggers the modal event
      this.trigger('modal', {
        element: licenseDialog
      });

      // set focus on the modal dialog
      setTimeout(function () {
        return licenseDialog.querySelector('.modal-header').focus();
      }, 10);
    }

    /**
     * Loads a Content Type description
     *
     * @param {string} id
     * @param {boolean} installed Whether the content type is already installed
     *
     * @return {Promise.<ContentType>}
     */

  }, {
    key: 'install',
    value: function install(_ref3) {
      var _this2 = this;

      var id = _ref3.id,
          installed = _ref3.installed,
          title = _ref3.title;

      // set spinner
      this.view.toggleSpinner(true);

      return this.services.installContentType(id).then(function (response) {
        _this2.trigger('installed-content-type');
        _this2.view.removeMessages();
        _this2.view.toggleSpinner(false);
        _this2.view.setIsInstalled(true);
        _this2.view.setIsUpdatePossible(false);

        var installMessageKey = installed ? 'contentTypeUpdateSuccess' : 'contentTypeInstallSuccess';

        _this2.view.setInstallMessage({
          message: _dictionary2.default.get(installMessageKey, { ':contentType': title })
        });
      }).catch(function (error) {
        _this2.view.toggleSpinner(false);

        // print error message
        var errorMessage = error.errorCode ? error : {
          success: false,
          errorCode: 'RESPONSE_FAILED',
          message: _dictionary2.default.get('contentTypeInstallError', { ':contentType': title })
        };
        _this2.view.setInstallMessage(errorMessage);

        // log whole error message to console
        console.error('Installation error', error);
      });
    }

    /**
     * Updates the view with the content type data
     *
     * @param {ContentType} contentType
     */

  }, {
    key: 'update',
    value: function update(contentType) {
      var _this3 = this;

      this.view.reset();

      this.view.setId(contentType.machineName);
      this.view.setTitle(contentType.title || contentType.machineName);
      this.view.setDescription(contentType.description);
      this.view.setImage(contentType.icon);
      this.view.setExample(contentType.example);
      this.view.setOwner(contentType.owner);
      this.view.setIsInstalled(contentType.installed);
      this.view.setLicense(contentType.license);
      this.view.setIsRestricted(contentType.restricted);
      var isUpdatePossible = contentType.installed && !contentType.isUpToDate && !contentType.restricted;
      this.view.setIsUpdatePossible(isUpdatePossible, contentType.title || contentType.machineName);

      // Check if api version is supported
      var apiVersionSupported = this.apiVersion.major > contentType.h5pMajorVersion || this.apiVersion.major === contentType.h5pMajorVersion && this.apiVersion.minor >= contentType.h5pMinorVersion;

      // If not installed and unsupported version - let view know
      if (!contentType.installed && !apiVersionSupported) {
        this.view.apiVersionUnsupported();
      }

      // update carousel
      if (contentType.screenshots) {
        // Fetch screenshots if they exist
        (0, _media.preloadImages)(contentType.screenshots).then(function (screenshots) {
          return _this3.view.setScreenshots(screenshots);
        });
      }
    }

    /**
     * Returns the root html element
     *
     * @return {HTMLElement}
     */

  }, {
    key: 'getElement',
    value: function getElement() {
      return this.view.getElement();
    }
  }]);

  return ContentTypeDetail;
}();

exports.default = ContentTypeDetail;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functional = __webpack_require__(1);

var _elements = __webpack_require__(0);

var _eventful = __webpack_require__(2);

var _events = __webpack_require__(6);

var _contentTypePlaceholder = __webpack_require__(13);

var _contentTypePlaceholder2 = _interopRequireDefault(_contentTypePlaceholder);

var _keyboard = __webpack_require__(4);

var _keyboard2 = _interopRequireDefault(_keyboard);

var _dictionary = __webpack_require__(3);

var _dictionary2 = _interopRequireDefault(_dictionary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @function
 */
var hasTabindex = (0, _elements.hasAttribute)('tabindex');

/**
 * @function
 */
var getRowId = (0, _elements.getAttribute)('data-id');

/**
 * @class
 * @mixes Eventful
 * @fires Hub#select
 * @fires ContentTypeList#row-selected
 */

var ContentTypeListView = function () {
  function ContentTypeListView(state) {
    var _this = this;

    _classCallCheck(this, ContentTypeListView);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    // setup keyboard
    this.keyboard = new _keyboard2.default();
    this.keyboard.onSelect = function (element) {
      _this.trigger('row-selected', {
        element: element,
        id: getRowId(element)
      });
    };

    // create root element
    this.rootElement = document.createElement('ul');
    this.rootElement.setAttribute('role', 'list');
    this.rootElement.className = 'content-type-list';
  }

  /**
   * Hides the root element from keyboard input
   */


  _createClass(ContentTypeListView, [{
    key: "hideFromKeyboard",
    value: function hideFromKeyboard() {
      this.rootElement.setAttribute('aria-hidden', 'true');
    }

    /**
     * Shows the root element to keyboard input
     */

  }, {
    key: "showToKeyboard",
    value: function showToKeyboard() {
      this.rootElement.removeAttribute('aria-hidden');
    }

    /**
     * Focuses on the previously selected element
     */

  }, {
    key: "focus",
    value: function focus() {
      var selectedElement = (0, _elements.querySelector)('li[tabindex="0"]', this.rootElement);

      if (selectedElement) {
        selectedElement.focus();
      }
    }

    /**
     * Scrolls the root element to the top
     */

  }, {
    key: "scrollToTop",
    value: function scrollToTop() {
      this.rootElement.scrollTop = 0;
    }

    /**
     * Removes all rows from root element
     */

  }, {
    key: "removeAllRows",
    value: function removeAllRows() {
      while (this.rootElement.hasChildNodes()) {
        var row = this.rootElement.lastChild;

        this.keyboard.removeElement(row);
        this.rootElement.removeChild(row);
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
      var _this2 = this;

      var row = this.createContentTypeRow(contentType, this);

      row.addEventListener('click', function (event) {
        _this2.trigger('row-selected', {
          element: row,
          id: row.getAttribute('data-id')
        }, false);

        // don't bubble
        event.stopPropagation();

        // Set tab index of on row
        var rows = row.parentNode.childNodes;
        (0, _elements.nodeListToArray)(rows).forEach(function (singleRow) {
          singleRow.removeAttribute('tabindex');
        });
        row.setAttribute('tabindex', '0');
      });

      this.rootElement.appendChild(row);
      this.keyboard.addElement(row);
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
      // create ids
      var index = this.rootElement.querySelectorAll('li').length;
      var contentTypeRowTitleId = "content-type-row-title-" + index;
      var contentTypeRowDescriptionId = "content-type-row-description-" + index;

      // field configuration
      var useButtonConfig = { text: _dictionary2.default.get('contentTypeUseButtonLabel'), cls: 'button-primary', icon: '' };
      var installButtonConfig = { text: _dictionary2.default.get('contentTypeGetButtonLabel'), cls: 'button-inverse-primary button-install', icon: 'icon-arrow-thick' };
      var button = contentType.installed ? useButtonConfig : installButtonConfig;
      var title = contentType.title || contentType.machineName;
      var description = contentType.summary || '';
      var image = contentType.icon || _contentTypePlaceholder2.default;
      var disabled = contentType.restricted ? 'disabled="disabled"' : '';
      var updateAvailable = !contentType.isUpToDate && contentType.installed && !contentType.restricted;

      // row item
      var element = document.createElement('li');
      element.id = "content-type-" + contentType.machineName;
      element.classList.add('media');
      element.setAttribute('data-id', contentType.machineName);
      element.setAttribute('aria-labelledby', contentTypeRowTitleId);
      element.setAttribute('aria-describedby', contentTypeRowDescriptionId);

      // create html
      element.innerHTML = "\n      <div class=\"media-left\">\n        <img class=\"media-object\" src=\"" + image + "\" alt=\"" + title + " " + _dictionary2.default.get('contentTypeIconAltText') + "\" />\n      </div>\n\n      <div class=\"media-body\">\n        <div id=\"" + contentTypeRowTitleId + "\" class=\"h4 media-heading\">" + title + "</div>\n\n        <button type=\"button\" aria-describedby=\"" + contentTypeRowTitleId + "\" class=\"button " + button.cls + "\" data-id=\"" + contentType.machineName + "\" tabindex=\"-1\" " + disabled + ">\n          <span class=\"" + button.icon + "\"></span>\n          " + button.text + "\n        </button>\n\n        <div class=\"content-type-update-info" + (updateAvailable ? '' : ' hidden') + "\">\n          " + _dictionary2.default.get('contentTypeUpdateAvailable') + "\n        </div>\n\n        <div id=\"" + contentTypeRowDescriptionId + "\" class=\"description\">" + description + "</div>\n      </div>\n   ";

      // handle use button
      var useButton = element.querySelector('.button-primary');
      if (useButton) {
        (0, _events.relayClickEventAs)('select', scope, useButton);
      }

      // listens for tabindex change, and update button too
      var actionButton = element.querySelector('.button');
      var observer = new MutationObserver(function (records) {
        var el = records[0].target;

        // use -1 since element is <button>
        actionButton.setAttribute('tabindex', hasTabindex(el) ? '0' : '-1');
      });

      observer.observe(element, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["tabindex"]
      });

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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _contentTypeListView = __webpack_require__(21);

var _contentTypeListView2 = _interopRequireDefault(_contentTypeListView);

var _eventful = __webpack_require__(2);

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
    this.currentContentTypes = [];
  }

  /**
   * Hide this element
   */


  _createClass(ContentTypeList, [{
    key: 'hide',
    value: function hide() {
      this.view.hideFromKeyboard();
    }

    /**
     * Show this element
     */

  }, {
    key: 'show',
    value: function show() {
      this.view.showToKeyboard();
    }

    /**
     * Focuses on the previously selected element
     */

  }, {
    key: 'focus',
    value: function focus() {
      this.view.focus();
    }

    /**
     * Resets the content type list
     */

  }, {
    key: 'resetList',
    value: function resetList() {
      this.view.scrollToTop();
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
      this.trigger('update-content-type-list', {});
      this.currentContentTypes = contentTypes;
    }

    /**
     * Refreshes the currently displayed content types with updated data
     *
     * @param {ContentType[]} contentTypes New content type data
     */

  }, {
    key: 'refreshContentTypes',
    value: function refreshContentTypes(contentTypes) {
      var _this = this;

      var displayedContentTypes = contentTypes.filter(function (contentType) {
        for (var i = 0; i < _this.currentContentTypes.length; i++) {
          if (_this.currentContentTypes[i].machineName === contentType.machineName) {
            return true;
          }
        }
      });
      this.update(displayedContentTypes);
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _messageView = __webpack_require__(7);

var _messageView2 = _interopRequireDefault(_messageView);

var _elements = __webpack_require__(0);

var _events = __webpack_require__(6);

var _navbar = __webpack_require__(32);

var _navbar2 = _interopRequireDefault(_navbar);

var _eventful = __webpack_require__(2);

var _dictionary = __webpack_require__(3);

var _dictionary2 = _interopRequireDefault(_dictionary);

var _contentTypeSection = __webpack_require__(9);

var _contentTypeSection2 = _interopRequireDefault(_contentTypeSection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @constant {number}
 */
var KEY_CODE_TAB = 9;

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
    var _this = this;

    _classCallCheck(this, ContentBrowserView);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    // general configuration
    this.typeAheadEnabled = true;
    this.currentlySelected = '';
    this.menuId = 'content-type-filter';
    this.currentMenuId = this.menuId + '-a11y-desc-current';

    // create elements
    this.rootElement = this.createElement(state);

    // pick elements
    this.menu = this.rootElement.querySelector('nav');
    this.menubar = this.rootElement.querySelector('.navbar-nav');
    this.inputField = this.rootElement.querySelector('[role="search"] input');
    this.displaySelected = this.rootElement.querySelector('.navbar-toggler-selected');
    this.searchBar = this.rootElement.querySelector('#hub-search-bar');
    var inputButton = this.rootElement.querySelector('[role="search"] .input-group-addon');

    // Listen to input changes
    this.inputField.addEventListener('input', function (event) {
      if (_this.typeAheadEnabled) {
        _this.trigger('search', {
          element: _this.searchBar,
          query: _this.searchBar.value
        });
      }
    });

    // Allow searching with 'enter' key
    this.inputField.addEventListener('keydown', function (event) {
      if (event.which === 13) {
        _this.trigger('search', {
          element: _this.searchBar,
          query: _this.searchBar.value
        });
      }
    });

    // Search button
    inputButton.addEventListener('click', function () {
      _this.trigger('search', {
        element: _this.searchBar,
        query: _this.searchBar.value
      });
    });
  }

  /**
   * Creates the menu group element
   *
   * @param {object} state
   *
   * @return {HTMLElement}
   */


  _createClass(ContentBrowserView, [{
    key: "createElement",
    value: function createElement(state) {
      var searchText = _dictionary2.default.get('contentTypeSearchFieldPlaceholder');

      // create element
      var element = document.createElement('div');
      element.className = 'content-type-section-view loading';
      element.innerHTML = "\n      <div class=\"menu-group\">\n        <nav  role=\"menubar\" class=\"navbar\">\n          <div class=\"navbar-header\">\n            <span class=\"navbar-toggler-selected\" tabindex=\"0\" aria-haspopup=\"true\" role=\"button\" aria-controls=\"" + this.menuId + "\" aria-expanded=\"false\"></span>\n            <span class=\"navbar-brand\">" + _dictionary2.default.get("contentTypeSectionTitle") + "</span>\n          </div>\n\n          <ul id=\"" + this.menuId + "\" class=\"navbar-nav\">\n            <span id=\"" + this.currentMenuId + "\" style=\"display: none\">" + _dictionary2.default.get("currentMenuSelected") + "</span>\n          </ul>\n        </nav>\n\n        <div class=\"input-group\" role=\"search\">\n          <input id=\"hub-search-bar\" class=\"form-control form-control-rounded\" type=\"text\" aria-label=\"" + searchText + "\" placeholder=\"" + searchText + "\" />\n          <div class=\"input-group-addon icon-search\"></div>\n        </div>\n      </div>";

      return element;
    }

    /**
     * Display a message
     *
     * @param {object} config - parameters sent to MessageView constructor
     */

  }, {
    key: "displayMessage",
    value: function displayMessage(config) {
      var self = this;
      // Set the action
      config.action = _dictionary2.default.get('reloadButtonLabel');

      var messageView = new _messageView2.default(config);
      var element = messageView.getElement();

      messageView.on('action-clicked', function () {
        self.rootElement.classList.remove('error');
        self.rootElement.classList.add('loading');
        element.parentNode.removeChild(element);
        // Give the user a chance to see that it's reloading
        setTimeout(function () {
          return self.trigger('reload');
        }, 500);
      });

      this.rootElement.classList.remove('loading');
      this.rootElement.classList.add('error');
      this.rootElement.appendChild(messageView.getElement());
    }

    /**
     * Inform view data is loaded
     */

  }, {
    key: "loaded",
    value: function loaded() {
      this.rootElement.classList.remove('loading');
      this.rootElement.classList.add('loaded');
    }

    /**
     * Adds a menu item
     *
     * @param {string} title
     * @param {string} id
     * @param {string} eventName Name of event that tab will fire off
     *
     * @return {HTMLElement}
     */

  }, {
    key: "addMenuItem",
    value: function addMenuItem(_ref) {
      var title = _ref.title,
          id = _ref.id,
          eventName = _ref.eventName;

      var self = this;
      var element = document.createElement('li');
      element.setAttribute('role', 'menuitem');
      element.setAttribute('data-id', id);
      element.innerText = title;

      element.addEventListener('click', function () {
        self.selectMenuItem({ id: id, eventName: eventName });
      });

      element.addEventListener('keydown', function (event) {
        if (event.which === 13 || event.which === 32) {
          self.selectMenuItem({ id: id, eventName: eventName });
          event.preventDefault();
        }
      });

      // add to menu bar
      this.menubar.appendChild(element);
      return element;
    }

    /**
     * Clears the input field
     */

  }, {
    key: "clearInputField",
    value: function clearInputField() {
      this.inputField.value = '';
    }

    /**
     * Clears menu item selection
     */

  }, {
    key: "clearSelection",
    value: function clearSelection() {
      this.currentlySelected = '';
    }

    /**
     * Sets the name of the currently selected filter
     *
     * @param {string} selectedName
     */

  }, {
    key: "setDisplaySelected",
    value: function setDisplaySelected(selectedName) {
      this.displaySelected.innerText = selectedName;
    }

    /**
     * Selects a menu item
     *
     * @param {string} id Id of menu
     * @param {string} eventName Event name of menu
     */

  }, {
    key: "selectMenuItem",
    value: function selectMenuItem(_ref2) {
      var id = _ref2.id,
          eventName = _ref2.eventName;

      // Skip if already selected
      if (this.currentlySelected === eventName) {
        return;
      }

      var menuItems = (0, _elements.querySelectorAll)('[role="menuitem"]', this.menubar);
      var selectedMenuItem = this.menubar.querySelector("[role=\"menuitem\"][data-id=\"" + id + "\"]");

      if (selectedMenuItem) {
        // Manually set the classes and aria attributes upon initialisation - toggling logic is handled in the h5p-sdk

        // Set readspeaker information for the current menu item
        menuItems.forEach(function (menuitem) {
          menuitem.classList.remove('selected');
          menuitem.removeAttribute('aria-describedby');
        });

        selectedMenuItem.classList.add('selected');
        selectedMenuItem.setAttribute('aria-describedby', this.currentMenuId);

        this.trigger('menu-selected', {
          element: selectedMenuItem,
          id: id,
          choice: eventName
        });
      }
    }

    /*
     * Initialize the menu from the controller
     */

  }, {
    key: "initMenu",
    value: function initMenu() {
      var _this2 = this;

      this.on('menu-selected', function (event) {
        // Focus on search bar if in most popular tab (labeled All)
        if (event.choice === 'most-popular') {
          _this2.focusSearchBar();
        }

        _this2.currentlySelected = event.choice;
      }, this);

      // call init menu from sdk
      (0, _navbar2.default)(this.menu);
    }

    /**
     * Hides text styles and the menu underline
     */

  }, {
    key: "addDeactivatedStyleToMenu",
    value: function addDeactivatedStyleToMenu() {
      this.menu.classList.remove('deactivated');
    }
    /**
     * Restores text styles and the menu underline
     */

  }, {
    key: "removeDeactivatedStyleFromMenu",
    value: function removeDeactivatedStyleFromMenu() {
      this.menu.classList.add("deactivated");
    }

    /**
     * Focus on the search bar after opening main panel
     */

  }, {
    key: "focusSearchBar",
    value: function focusSearchBar() {
      var _this3 = this;

      setTimeout(function () {
        return _this3.searchBar.focus();
      }, 200);
    }

    /**
     * Returns the root element of the content browser
     *
     * @return {HTMLElement}
     */

  }, {
    key: "getElement",
    value: function getElement() {
      return this.rootElement;
    }
  }]);

  return ContentBrowserView;
}();

exports.default = ContentBrowserView;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _panel = __webpack_require__(11);

var _panel2 = _interopRequireDefault(_panel);

var _tabPanel = __webpack_require__(33);

var _tabPanel2 = _interopRequireDefault(_tabPanel);

var _functional = __webpack_require__(1);

var _elements = __webpack_require__(0);

var _eventful = __webpack_require__(2);

var _events = __webpack_require__(6);

var _dictionary = __webpack_require__(3);

var _dictionary2 = _interopRequireDefault(_dictionary);

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
 * @class
 * @mixes Eventful
 * @fires HubView#tab-change
 */

var HubView = function () {
  /**
   * @param {HubState} state
   */
  function HubView(state) {
    var _this = this;

    _classCallCheck(this, HubView);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    /**
     * @type {HTMLElement}
     */
    this.rootElement = this.createPanel(state);

    // select dynamic elements
    this.panel = this.rootElement.querySelector('.panel');
    this.toggler = this.rootElement.querySelector('[aria-expanded][aria-controls]');
    this.selectedName = this.rootElement.querySelector('.h5p-hub-selected');
    this.tablist = this.rootElement.querySelector('[role="tablist"]');
    this.tabContainerElement = this.rootElement.querySelector('.tab-panel');

    // initiates panel
    (0, _panel2.default)(this.panel);
    this.setTitle(_dictionary2.default.get("hubPanelLabel"));

    // relay events
    (0, _events.relayClickEventAs)('panel-change', this, this.toggler);

    // relay keyboard events
    this.toggler.addEventListener('keyup', function (event) {
      if (event.which === 32 || event.which === 13) {
        _this.trigger('panel-change', {
          element: _this.toggler,
          id: _this.toggler.getAttribute('data-id')
        }, false);

        event.preventDefault();
      }
    });
  }

  /**
   * Sets the title
   *
   * @param {string} title
   */


  _createClass(HubView, [{
    key: "setTitle",
    value: function setTitle(title) {
      this.selectedName.innerText = title;
    }

    /**
     * Creates the dom for the panel
     *
     * @param {string} title
     * @param {string} sectionId
     * @param {boolean} expanded
     */

  }, {
    key: "createPanel",
    value: function createPanel(_ref) {
      var _ref$title = _ref.title,
          title = _ref$title === undefined ? '' : _ref$title,
          _ref$sectionId = _ref.sectionId,
          sectionId = _ref$sectionId === undefined ? 'content-types' : _ref$sectionId,
          _ref$expanded = _ref.expanded,
          expanded = _ref$expanded === undefined ? false : _ref$expanded;

      var labels = {
        h5pHub: 'H5P Hub.'
      };
      var element = document.createElement('section');
      element.className += "h5p-hub h5p-sdk";
      var panelClasses = "panel" + (expanded ? ' open' : '');

      element.innerHTML = "\n      <div class=\"" + panelClasses + "\">\n        <div class=\"h5p-hub-client-drop-down\" aria-level=\"1\" role=\"heading\">\n          <span role=\"button\" class=\"icon-hub-icon\" aria-expanded=\"" + expanded + "\" aria-controls=\"panel-body-" + sectionId + "\">\n          <span class=\"h5p-hub-description\">" + labels.h5pHub + "</span>\n          <span class=\"h5p-hub-selected\"></span>\n        </span>\n        </div>\n        <div id=\"panel-body-" + sectionId + "\" role=\"region\" class=\"" + (expanded ? '' : 'hidden') + "\">\n          <div class=\"tab-panel\">\n            <nav>\n              <ul role=\"tablist\"></ul>\n            </nav>\n          </div>\n        </div>\n      </div>";

      return element;
    }

    /**
     * Set if panel is open, this is used for outer border color
     *
     * @param {boolean} [forceOpen] Forces the state of the panel
     *
     * @return {boolean} if the panel is open now
     */

  }, {
    key: "togglePanelOpen",
    value: function togglePanelOpen(forceOpen) {

      // If no argument set forceOpen to opposite of what it is now
      if (forceOpen === undefined) {
        forceOpen = !this.panel.classList.contains('open');
      }

      // Set open class and aria-expanded attribute
      this.panel.classList[forceOpen ? 'add' : 'remove']('open');
      this.toggler.setAttribute('aria-expanded', "" + forceOpen);

      return !forceOpen;
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
      tab.innerText = title;
      (0, _events.relayClickEventAs)('tab-change', this, tab);

      var tabPanel = document.createElement('div');
      tabPanel.id = tabPanelId;
      tabPanel.className += 'tabpanel';
      tabPanel.setAttribute('aria-labelledby', tabId);
      tabPanel.setAttribute('role', 'tabpanel');
      tabPanel.appendChild(content);
      (0, _elements.toggleClass)('hidden', !selected, tabPanel);

      this.tablist.appendChild(tab);
      this.tabContainerElement.appendChild(tabPanel);

      // fires the tab-change event when selected is created
      if (selected) {
        this.trigger('tab-change', {
          element: tab,
          id: id
        });
      }
    }

    /**
     * Appends a child element to the root node
     * @param {Element} element
     *
     * @return {Node}
     */

  }, {
    key: "appendChild",
    value: function appendChild(element) {
      return this.rootElement.appendChild(element);
    }

    /*
     * Initialize the tab panel from the controller
     */

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

      var SECTION_PREFIX = 'h5p-section-';
      this.panel.className = this.removeWordByPrefix(SECTION_PREFIX, this.panel.className);
      this.panel.classList.add(SECTION_PREFIX + id, 'panel');
    }

    /**
     * Takes a string and removes words that start with prefix
     *
     * @param {string} prefix
     * @param {string} classes
     *
     * @return {string}
     */

  }, {
    key: "removeWordByPrefix",
    value: function removeWordByPrefix(prefix, classes) {
      return classes.split(/ +/).filter(function (cls) {
        return cls.indexOf(prefix) !== 0;
      }).join(' ');
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventful = __webpack_require__(2);

var _elements = __webpack_require__(0);

var _imageLightbox = __webpack_require__(10);

var _imageLightbox2 = _interopRequireDefault(_imageLightbox);

var _dictionary = __webpack_require__(3);

var _dictionary2 = _interopRequireDefault(_dictionary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @constant {string}
 */
var IMAGELIGHTBOX = 'imagelightbox';

/**
 * @class
 * @mixes Eventful
 */

var ImageLightBox = function () {
  function ImageLightBox() {
    var _this = this;

    _classCallCheck(this, ImageLightBox);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    this.rootElement = this.createView();
    this.imageLightboxList = this.rootElement.querySelector('.' + IMAGELIGHTBOX + '-list');

    (0, _imageLightbox2.default)(this.rootElement);

    this.rootElement.addEventListener('lightbox-hidden', function () {
      _this.trigger('lightbox-hidden');
    });
  }

  /**
   * Create the DOM structure
   *
   * @function
   * @returns {HTMLElement}
   */


  _createClass(ImageLightBox, [{
    key: 'createView',
    value: function createView() {
      var rootElement = (0, _elements.createElement)({
        tag: 'div',
        id: IMAGELIGHTBOX + '-detail',
        classes: [IMAGELIGHTBOX],
        attributes: {
          role: 'dialog',
          'aria-label': _dictionary2.default.get('imageLightboxTitle')
        }
      });

      rootElement.innerHTML = '\n      <div class="' + IMAGELIGHTBOX + '-inner">\n        <div class="' + IMAGELIGHTBOX + '-button close" role="button" tabindex="0" aria-label="' + _dictionary2.default.get('close') + '"></div>\n        <ol class="' + IMAGELIGHTBOX + '-list"></ol>\n        <div class="' + IMAGELIGHTBOX + '-progress">' + _dictionary2.default.get('imageLightBoxProgress') + '</div>\n        <div class="' + IMAGELIGHTBOX + '-button next" role="button" aria-disabled="true" aria-label="' + _dictionary2.default.get('nextImage') + '"></div>\n        <div class="' + IMAGELIGHTBOX + '-button previous" role="button" aria-disabled="true" aria-label="' + _dictionary2.default.get('previousImage') + '"></div>\n      </div>';

      return rootElement;
    }

    /**
     * Add an image
     *
     * @param {string} url
     * @param {string} alt
     */

  }, {
    key: 'addImage',
    value: function addImage(_ref) {
      var url = _ref.url,
          alt = _ref.alt;

      var item = (0, _elements.createElement)({
        tag: 'li',
        classes: [IMAGELIGHTBOX + '-image']
      });
      item.innerHTML = '<img class="img-responsive" src="' + url + '" alt="' + alt + '">';
      this.imageLightboxList.appendChild(item);
    }

    /**
     * Show the lightbox
     *
     * @param {number} index - the image to show first
     */

  }, {
    key: 'show',
    value: function show(index) {
      this.rootElement.setAttribute('data-show', index);
    }

    /**
     * Remove all images
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.imageLightboxList.innerHTML = '';
    }

    /**
     * Return the DOM element
     *
     * @returns {HTMLElement}
     */

  }, {
    key: 'getElement',
    value: function getElement() {
      return this.rootElement;
    }
  }]);

  return ImageLightBox;
}();

exports.default = ImageLightBox;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.multiSort = exports.SearchService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functional = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {Object} MixedContentType
 *
 * @property {ContentType} contentType Original content type properties
 * @property {number} score Indicates how well the content type matches the current search context
 */

/**
 * @class
 * The Search Service gets a content type from hub-services.js
 * in the form of a promise. It then generates a score based
 * on the different weightings of the content type fields and
 * sorts the results based on the generated score.
 */
var SearchService = exports.SearchService = function () {
  /**
   * @param {HubServices} services
   */
  function SearchService(services) {
    _classCallCheck(this, SearchService);

    this.services = services;
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
      // Add content types to the search index
      return this.services.contentTypes().then(filterByQuery(query));
    }

    /**
     * Filter all content types by given property
     *
     * @param {string|Array} sortOrder One or more properties
     *
     * @return {Promise.<ContentType[]>|*}
     */

  }, {
    key: 'sortOn',
    value: function sortOn(sortOrder) {
      return this.services.contentTypes().then(function (contentTypes) {
        return multiSort(contentTypes, sortOrder);
      });
    }

    /**
     * Returns a list of content type objects sorted
     * on most recently used.
     *
     * @return {ContentType[]}  Content Types
     */

  }, {
    key: 'sortOnRecent',
    value: function sortOnRecent(contentTypes) {
      return this.services.recentlyUsed().then(function (recentlyUsed) {
        if (recentlyUsed.length !== 0) {
          return sortContentTypesByMachineName(contentTypes, recentlyUsed);
        } else {
          return contentTypes;
        }
      });
    }

    /**
     * Filter out restricted if it is defined and false
     *
     * @param {string[]} filters Filters that should be applied
     *
     * @return {Promise.<ContentType[]>}
     */

  }, {
    key: 'applyFilters',
    value: function applyFilters(filters) {
      return this.services.contentTypes().then(function (contentTypes) {
        return multiFilter(contentTypes, filters);
      });
    }
  }]);

  return SearchService;
}();

/**
 * Sort on multiple properties
 *
 * @param {MixedContentType[]|ContentType[]} contentTypes Content types that should be sorted
 * @param {string|string[]} sortOrder Order that sort properties should be applied
 *
 * @return {Array.<ContentType>} Content types sorted
 */


var multiSort = exports.multiSort = function multiSort(contentTypes, sortOrder) {
  // Make sure all sorted instances are mixed content type
  var mixedContentTypes = contentTypes.map(function (contentType) {
    if (contentType.hasOwnProperty('score') && contentType.hasOwnProperty('contentType')) {
      return contentType;
    }

    // Return a mixed content type with score 1 to survive filtering
    return {
      contentType: contentType,
      score: 1
    };
  });

  sortOrder = Array.isArray(sortOrder) ? sortOrder : [sortOrder];
  return mixedContentTypes.sort(function (firstContentType, secondContentType) {
    return handleSortType(firstContentType, secondContentType, sortOrder);
  }).map(function (mixedContentType) {
    return mixedContentType.contentType;
  });
};

/**
 * Apply multiple filters to content types
 *
 * @param {ContentType[]} contentTypes Content types that should be filtered
 * @param {string[]} filters Filters that should be applied
 *
 * @return {ContentType[]} Remaining content types after filtering
 */
var multiFilter = function multiFilter(contentTypes, filters) {
  // Finished filtering
  if (!filters.length) {
    return contentTypes;
  }

  // Apply filter
  return multiFilter(handleFilter(contentTypes, filters.shift()), filters);
};

/**
 * Applies a single filter to content types
 *
 * @param {ContentType[]} contentTypes Content types that should be filtered
 * @param {string} filter Filter that should be applied
 *
 * @return {ContentType[]} Content types remaining after applying filter
 */
var handleFilter = function handleFilter(contentTypes, filter) {
  switch (filter) {
    case 'restricted':
      return contentTypes.filter(function (contentType) {
        return !contentType.restricted;
      });
    case 'installed':
      return contentTypes.filter(function (contentType) {
        return contentType.installed;
      });
  }
};

/**
 * Compares two content types and returns a sortable value for them
 *
 * @param {MixedContentType} firstContentType
 * @param {MixedContentType} secondContentType
 * @param {string[]} sortOrder Order that sort properties should be applied in
 *
 * @return {number} A number indicating how to sort the two content types
 */
var handleSortType = function handleSortType(firstContentType, secondContentType, sortOrder) {
  switch (sortOrder[0]) {
    case 'restricted':
      return sortOnRestricted(firstContentType, secondContentType, sortOrder.slice(1));
    case 'popularity':
      return sortOnProperty(firstContentType, secondContentType, sortOrder[0], sortOrder.slice(1));
    case 'title':
      return sortOnProperty(firstContentType, secondContentType, sortOrder[0], sortOrder.slice(1));
    default:
      return sortSearchResults(firstContentType, secondContentType);
  }
};

/**
 * Sort restricted content types. Restricted content types will be moved to the bottom of the
 * list. Content types with undefined restricted property are consider not restricted.
 *
 * @param {MixedContentType} firstContentType
 * @param {MixedContentType} secondContentType
 * @param {string[]} sortOrder Order to apply sort properties
 *
 * @return {number} A standard comparable value for the two content types
 */
var sortOnRestricted = function sortOnRestricted(firstContentType, secondContentType, sortOrder) {
  if (!firstContentType.contentType.restricted === !secondContentType.contentType.restricted) {
    if (sortOrder.length) {
      return handleSortType(firstContentType, secondContentType, sortOrder);
    } else {
      return 0;
    }
  } else if (firstContentType.contentType.restricted) {
    return 1;
  } else if (secondContentType.contentType.restricted) {
    return -1;
  }
};

/**
 * Sort on a property. Any valid property can be applied. If the content type does not have the
 * supplied property it will get moved to the bottom.
 *
 * @param {MixedContentType} firstContentType
 * @param {MixedContentType} secondContentType
 * @param {string} property Property that the content types will be sorted on, either
 * numerically or lexically
 * @param {string[]} sortOrder Remaining sort order to apply if two content types have the same
 * value
 *
 * @return {number} A value indicating the comparison between the two content types
 */
var sortOnProperty = function sortOnProperty(firstContentType, secondContentType, property, sortOrder) {
  // Property does not exist, move to bottom
  if (!firstContentType.contentType.hasOwnProperty(property)) {
    return 1;
  }
  if (!secondContentType.contentType.hasOwnProperty(property)) {
    return -1;
  }

  // Sort on property
  if (firstContentType.contentType[property] > secondContentType.contentType[property]) {
    return 1;
  } else if (firstContentType.contentType[property] < secondContentType.contentType[property]) {
    return -1;
  } else {
    if (sortOrder.length) {
      return handleSortType(firstContentType, secondContentType, sortOrder);
    } else {
      return 0;
    }
  }
};

/**
 * Filters a list of content types based on a query
 * @type {Function}
 *
 * @param {string} query
 * @param {ContentType[]} contentTypes
 */
var filterByQuery = (0, _functional.curry)(function (query, contentTypes) {
  if (query == '') {
    return contentTypes;
  }

  // Append a search score to each content type
  var filtered = contentTypes.map(function (contentType) {
    return {
      contentType: contentType,
      score: getSearchScore(query, contentType)
    };
  }).filter(function (result) {
    return result.score > 0;
  });

  return multiSort(filtered, ['restricted', 'default']);
});

/**
 * Callback for Array.sort()
 * Compares two content types on different criteria
 *
 * @param {MixedContentType} a First content type
 * @param {MixedContentType} b Second content type
 * @return {number}
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
 * @param  {string}       query
 * @param  {ContentType}  contentType
 * @return {number}
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
 * Generates a score for a query based on a content type's properties
 *
 * @param  {string}       query
 * @param  {ContentType}  contentType
 * @return {number}
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
  } else if (hasSubString(query, contentType.machineName)) {
    return 1;
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

/**
 * Filters an array of content type objects based
 * on an order specified by an array of machine names
 *
 * @param  {ContentType[]} contentTypes
 * @param  {string[]}     machineNames
 * @return {ContentType[]}              filtered content types
 */
var sortContentTypesByMachineName = function sortContentTypesByMachineName(contentTypes, machineNames) {
  var sortables = [];

  // Find all the content types that need to be sorted move them to a new array
  contentTypes.forEach(function (contentType) {
    var index = machineNames.indexOf(contentType.machineName.toString());
    if (index > -1) {
      sortables.push(contentType);
      contentTypes.splice(contentTypes.indexOf(contentType), 1);
    }
  });

  sortables.sort(function (a, b) {
    var aIndex = machineNames.indexOf(a.machineName.toString());
    var bIndex = machineNames.indexOf(b.machineName.toString());

    if (aIndex === -1 && bIndex === -1) {
      // neither are recently used
      return 0;
    } else if (aIndex !== -1 && bIndex === -1) {
      // b is not recently used
      return -1;
    } else if (aIndex === -1 && bIndex !== -1) {
      // a is not recently used
      return 1;
    } else if (aIndex !== -1 && bIndex !== -1) {
      // both are recently used
      return aIndex < bIndex ? -1 : 1;
    }
  });

  return sortables.concat(contentTypes);
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dictionary = __webpack_require__(3);

var _dictionary2 = _interopRequireDefault(_dictionary);

var _eventful = __webpack_require__(2);

var _messageView = __webpack_require__(7);

var _messageView2 = _interopRequireDefault(_messageView);

var _elements = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @mixes Eventful
 *
 * @fires Hub#upload
 */
var UploadSection = function () {
  function UploadSection(state, services) {
    _classCallCheck(this, UploadSection);

    _extends(this, (0, _eventful.Eventful)());
    this.services = services;

    // Create the upload form
    var uploadForm = this.renderUploadForm();
    this.initUploadForm(uploadForm);

    // Create the container and attach children
    var element = document.createElement('div');
    element.appendChild(uploadForm);
    this.rootElement = element;
  }

  /**
   * Generates HTML for the upload form
   *
   * returns {HTMLElement}
   */


  _createClass(UploadSection, [{
    key: 'renderUploadForm',
    value: function renderUploadForm() {
      // Create the html
      var uploadForm = document.createElement('div');
      uploadForm.innerHTML = '\n      <div class="upload-wrapper">\n        <div class="message-wrapper"></div>\n        <div class="upload-throbber hidden" aria-label="' + _dictionary2.default.get('uploadingThrobber') + '" tabindex="-1"></div>\n        <h1 class="upload-instruction-header">' + _dictionary2.default.get('uploadInstructionsTitle') + '</h1>\n        <div class="upload-form">\n          <input class="upload-path" placeholder="' + _dictionary2.default.get("uploadPlaceholder") + '" tabindex="-1" readonly/>\n          <button type="button" class="button use-button">Use</button>\n          <div class="input-wrapper">\n            <input type="file" accept=".h5p" aria-hidden="true"/>\n            <button type="button" class="button upload-button" tabindex="0">' + _dictionary2.default.get('uploadFileButtonLabel') + '</button>\n          </div>\n        </div>\n        <p class="upload-instruction-description">' + _dictionary2.default.get('uploadInstructionsContent') + '</p>\n      </div>\n    ';
      return uploadForm;
    }

    /**
     * Attach upload form elements to the DOM and initializes
     * logic that binds them together
     *
     * @param  {HTMLElement} uploadForm
     */

  }, {
    key: 'initUploadForm',
    value: function initUploadForm(uploadForm) {
      this.uploadInput = uploadForm.querySelector('.upload-wrapper input[type="file"]');
      this.uploadButton = uploadForm.querySelector('.upload-button');
      this.uploadPath = uploadForm.querySelector('.upload-path');
      this.useButton = uploadForm.querySelector('.use-button');
      this.uploadThrobber = uploadForm.querySelector('.upload-throbber');
      this.messageWrapper = uploadForm.querySelector('.message-wrapper');

      this.initUploadInput();
      this.initUseButton();
      this.initUploadButton();
    }

    /**
     * Handle the main logic for the upload form.
     */

  }, {
    key: 'initUploadInput',
    value: function initUploadInput() {
      var self = this;
      // Handle errors and update styles when a file is selected
      this.uploadInput.onchange = function (event) {
        if (this.value.length === 0) {
          self.clearUploadForm();
          return;
        }
        // Clear messages
        self.clearMessages();

        // Replace the placeholder text with the selected filepath
        self.uploadPath.value = this.value.replace('C:\\fakepath\\', '');

        // Update the upload button
        self.uploadButton.textContent = _dictionary2.default.get('uploadFileButtonChangeLabel');

        // Check that it's a h5p file
        if (self.getFileExtension(this.value) !== 'h5p') {

          self.renderWrongExtensionMessage();

          // Hide the 'use' button for non-h5p files
          self.useButton.classList.remove('visible');
        } else {
          // Only show the 'use' button once a h5p file has been selected
          self.useButton.classList.add('visible');
          self.uploadPath.removeAttribute('placeholder');

          // Focus use button
          event.stopPropagation();
          self.useButton.focus();
        }
      };

      this.uploadPath.addEventListener('click', function () {
        self.uploadInput.click();
      });
    }

    /**
     * Add logic to pass data from the upload input to the plugin
     */

  }, {
    key: 'initUseButton',
    value: function initUseButton() {
      var self = this;

      // Send the file to the plugin
      this.useButton.addEventListener('click', function () {
        self.uploadFile();
      });

      // Allow users to upload a file by pressing enter or spacebar
      this.useButton.onkeydown = function (e) {
        if (e.which === 13 || e.which === 32) {
          self.uploadFile();
        }
      };
    }

    /**
     * Uploads chosen file input
     */

  }, {
    key: 'uploadFile',
    value: function uploadFile() {
      var _this = this;

      this.setIsUploading(true);
      var self = this;

      // Add the H5P file to a form, ready for transportation
      var data = new FormData();
      data.append('h5p', self.uploadInput.files[0]);

      // Upload content to the plugin
      self.services.uploadContent(data).then(function (json) {
        _this.setIsUploading(false);

        // Validation failed
        if (!json.success) {
          // Render fail message
          self.renderUploadValidationFailedMessage();
          self.clearUploadForm();
          return;
        }

        // Fire the received data to any listeners
        self.trigger('upload', json);
      }).catch(function () {
        // Server side error message
        self.renderServerErrorMessage();
        self.clearUploadForm();
        self.setIsUploading(false);
      });
    }

    /**
     * Initialize the upload button logic
     * to be handled by the upload input element
     */

  }, {
    key: 'initUploadButton',
    value: function initUploadButton() {
      var self = this;
      // Reuse the upload input logic to upload a file
      this.uploadButton.onclick = function () {
        self.uploadInput.click();
      };

      // Allow users to upload a file by pressing enter or spacebar
      this.uploadButton.onkeydown = function (e) {
        if (e.which === 13 || e.which === 32) {
          self.uploadInput.click();
        }
      };
    }

    /**
     * Clear input of file upload form
     */

  }, {
    key: 'clearUploadForm',
    value: function clearUploadForm() {
      this.uploadInput.value = '';
      this.uploadPath.value = _dictionary2.default.get("uploadPlaceholder");
      this.uploadButton.textContent = _dictionary2.default.get('uploadFileButtonLabel');
      this.useButton.classList.remove('visible');
    }

    /**
     * Clears all messages
     */

  }, {
    key: 'clearMessages',
    value: function clearMessages() {
      this.removeAllChildren(this.rootElement.querySelector('.message-wrapper'));
    }

    /**
     * Adds throbber to upload view
     *
     * @param {boolean} enable If true the throbber will be shown
     */

  }, {
    key: 'setIsUploading',
    value: function setIsUploading(enable) {
      if (enable) {
        this.uploadThrobber.classList.remove('hidden');

        // disable buttons
        this.useButton.setAttribute('disabled', 'true');
        this.uploadButton.setAttribute('disabled', 'true');
        this.uploadPath.setAttribute('disabled', 'true');
        this.uploadThrobber.focus();
      } else {
        this.uploadThrobber.classList.add('hidden');

        // Enable buttons
        this.useButton.removeAttribute('disabled');
        this.uploadButton.removeAttribute('disabled');
        this.uploadPath.removeAttribute('disabled');
      }
    }

    /**
     * Helper function to get a file extension from a filename
     *
     * @param  {string} fileName
     * @return {string}
     */

  }, {
    key: 'getFileExtension',
    value: function getFileExtension(fileName) {
      return fileName.replace(/^.*\./, '');
    }

    /**
     * Renders a message notifying the user that an incorrect filetype was uploaded
     */

  }, {
    key: 'renderWrongExtensionMessage',
    value: function renderWrongExtensionMessage() {
      this.renderMessage({
        type: 'error',
        title: _dictionary2.default.get('h5pFileWrongExtensionTitle'),
        content: _dictionary2.default.get('h5pFileWrongExtensionContent')
      });
    }

    /**
     * Renders a message notifying the user that the uploaded file failed to validate
     */

  }, {
    key: 'renderUploadValidationFailedMessage',
    value: function renderUploadValidationFailedMessage() {
      this.renderMessage({
        type: 'error',
        title: _dictionary2.default.get('h5pFileValidationFailedTitle'),
        content: _dictionary2.default.get('h5pFileValidationFailedContent')
      });
    }

    /**
     * Renders a message notifying the user that the server responded with an error when attempting
     * to upload the H5P file.
     */

  }, {
    key: 'renderServerErrorMessage',
    value: function renderServerErrorMessage() {
      this.renderMessage({
        type: 'error',
        title: _dictionary2.default.get('h5pFileUploadServerErrorTitle'),
        content: _dictionary2.default.get('h5pFileUploadServerErrorContent')
      });
    }

    /**
     * Creates a message based on a configuration and prepends it to the message wrapper
     *
     * @param  {Object} config
     */

  }, {
    key: 'renderMessage',
    value: function renderMessage(config) {
      // Clean any previous message
      if (this.messageView && this.messageView.getElement().parentNode) {
        this.messageView.getElement().parentNode.removeChild(this.messageView.getElement());
      }
      this.messageView = new _messageView2.default(config);
      this.prepend(this.messageWrapper, this.messageView.getElement());
    }

    /**
     * Helper function. Prepends an element to another
     */

  }, {
    key: 'prepend',
    value: function prepend(parent, child) {
      parent.insertBefore(child, parent.firstChild);
    }

    /**
     * Helper function to remove all children from a node
     */

  }, {
    key: 'removeAllChildren',
    value: function removeAllChildren(node) {
      while (node.lastChild) {
        node.removeChild(node.lastChild);
      }
    }

    /**
     * Gets the upload section wrapper
     *
     * @return {HTMLElement} Wrapper for upload section
     */

  }, {
    key: 'getElement',
    value: function getElement() {
      return this.rootElement;
    }
  }]);

  return UploadSection;
}();

exports.default = UploadSection;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {

(function (self) {
  'use strict';

  if (self.fetch) {
    return;
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    }(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  if (support.arrayBuffer) {
    var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

    var isDataView = function isDataView(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj);
    };

    var isArrayBufferView = ArrayBuffer.isView || function (obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value;
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function next() {
        var value = items.shift();
        return { done: value === undefined, value: value };
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }

    return iterator;
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function (header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function (name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ',' + value : value;
  };

  Headers.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function (name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null;
  };

  Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  };

  Headers.prototype.values = function () {
    var items = [];
    this.forEach(function (value) {
      items.push(value);
    });
    return iteratorFor(items);
  };

  Headers.prototype.entries = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise;
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('');
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function (body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type');
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function () {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };

      this.arrayBuffer = function () {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
        } else {
          return this.blob().then(readBlobAsArrayBuffer);
        }
      };
    }

    this.text = function () {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text');
      } else {
        return Promise.resolve(this._bodyText);
      }
    };

    if (support.formData) {
      this.formData = function () {
        return this.text().then(decode);
      };
    }

    this.json = function () {
      return this.text().then(JSON.parse);
    };

    return this;
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    this._initBody(body);
  }

  Request.prototype.clone = function () {
    return new Request(this, { body: this._bodyInit });
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = 'status' in options ? options.status : 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    });
  };

  Response.error = function () {
    var response = new Response(null, { status: 0, statusText: '' });
    response.type = 'error';
    return response;
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, { status: status, headers: { location: url } });
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function (input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    });
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : undefined);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preloadImage = preloadImage;
exports.preloadImages = preloadImages;
/**
 * Check whether an image exists at a specified URL
 *
 * @param  {object} image
 * @return {Promise<HTMLImageElement>}
 */
function preloadImage(image) {
  return new Promise(function (resolve, reject) {
    var imageData = new Image();
    imageData.src = image.url;

    imageData.onload = function () {
      return resolve(image);
    };
    imageData.onerror = function () {
      return reject(image);
    };

    if (imageData.complete) {
      resolve(image);
    }
  });
}

/**
 * Preload images
 *
 * @param {object[]} images
 * @return {Promise<HTMLImageElement[]>}
 */
function preloadImages(images) {
  var IMAGE_LOAD_FAIL = null;

  var promises = images.map(preloadImage).map(function (image) {
    return image.catch(function (err) {
      return IMAGE_LOAD_FAIL;
    });
  });

  return Promise.all(promises).then(function (images) {
    return images.filter(function (image) {
      return image !== IMAGE_LOAD_FAIL;
    });
  });
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = init;

var _elements = __webpack_require__(0);

var _functional = __webpack_require__(1);

var _keyboard = __webpack_require__(4);

var _keyboard2 = _interopRequireDefault(_keyboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {object} ScreenMapping
 * @param {number} width
 * @param {number} size
 */

/**
 * Mapping for number of images to show per screen size
 * @type {ScreenMapping[]}
 */
var NUM_IMAGES_TO_SHOW_FOR_WIDTH = [{
  width: 576,
  size: 2
}, {
  width: 768,
  size: 3
}, {
  width: 992,
  size: 4
}];

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
var toggleEnabled = function toggleEnabled(element, force, nextElement) {
  if (force) {
    if (isDisabled(element)) {
      enable(element);
    }
  } else {
    if (!isDisabled(element)) {
      disable(element);
      if (nextElement) {
        nextElement.focus();
      }
    }
  }
};

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
var updateView = function updateView(element, state, clickChange) {
  var prevButton = element.querySelector('.previous');
  var nextButton = element.querySelector('.next');
  var list = element.querySelector('ul');
  var totalCount = list.childElementCount;

  // update list sizes
  list.style.width = 100 / state.displayCount * totalCount + '%';
  list.style.marginLeft = state.position * (100 / state.displayCount) + '%';

  // update image sizes
  (0, _elements.querySelectorAll)('li', element).forEach(function (element) {
    return element.style.width = 100 / totalCount + '%';
  });

  // toggle button visibility
  [prevButton, nextButton].forEach((0, _elements.toggleVisibility)(state.displayCount < totalCount));

  // toggle button enable, disabled
  toggleEnabled(nextButton, state.position > state.displayCount - totalCount, clickChange ? prevButton : null);
  toggleEnabled(prevButton, state.position < 0, clickChange ? nextButton : null);

  if (element.dataset.preventResizeLoop === 'true') {
    element.ignoreResize = true;
  }
};

/**
 * Handles button clicked
 *
 * @param {HTMLElement} element
 * @param {ImageScrollerState} state
 * @param {HTMLElement} button
 * @param {function} updateState
 *
 * @function
 */
var onNavigationButtonClick = function onNavigationButtonClick(element, state, button, updateState) {
  if (!isDisabled(button)) {
    updateState(state);
    updateView(element, state, true);
  }
};

/**
 * Callback for when the dom is updated
 *
 * @param {HTMLElement} element
 * @param {ImageScrollerState} state
 * @param {MutationRecord} record
 * @function
 */
var handleDomUpdate = (0, _functional.curry)(function (element, state, keyboard, record) {
  // on add image run initialization
  if (record.type === 'childList') {
    // Remove keyboard events for removed nodes
    var added = (0, _elements.nodeListToArray)(record.removedNodes).filter((0, _elements.classListContains)('slide')).map((0, _elements.querySelector)('img')).filter(function (image) {
      return image !== null;
    }).map(function (image) {
      return keyboard.removeElement(image);
    });

    // Add keyboard events for new nodes
    var removed = (0, _elements.nodeListToArray)(record.addedNodes).filter((0, _elements.classListContains)('slide')).map((0, _elements.querySelector)('img')).filter(function (image) {
      return image !== null;
    }).map(function (image) {
      return keyboard.addElement(image);
    });

    if (added.length > 0 || removed.length > 0) {
      // update the view
      updateView(element, _extends(state, {
        position: 0
      }));
    }
  }
});

/**
 * Handles focus when using keyboard navigation
 *
 * @param {Element} element
 * @param {ImageScrollerState} state
 * @param {CustomEvent} event
 * @function
 */
var handleFocus = (0, _functional.curry)(function (element, state, event) {
  var focusedIndex = event.detail.index;
  var firstVisibleElementIndex = state.position * -1;
  var lastVisibleElementIndex = firstVisibleElementIndex + state.displayCount - 1;

  var moveLeft = focusedIndex < firstVisibleElementIndex;
  var moveRight = focusedIndex > lastVisibleElementIndex;
  var doAnimation = moveLeft || moveRight;

  var focusOnTabbableElement = function focusOnTabbableElement() {
    return element.querySelector('img[tabindex="0"]').focus();
  };

  // animation stuff
  if (doAnimation) {
    element.addEventListener("transitionend", focusOnTabbableElement, { once: true, bubbles: true });
  }

  if (moveLeft) {
    state.position = focusedIndex * -1;
    updateView(element, state);
  } else if (moveRight) {
    state.position = state.position - (focusedIndex - lastVisibleElementIndex);
    updateView(element, state);
  } else if (element.dataset.preventResizeLoop === 'true') {
    element.ignoreResize = true;
  }

  if (!doAnimation) {
    focusOnTabbableElement();
  }
});

/**
 * Handles updating the screen size to make thumbnails responsive
 *
 * @param {Element} element
 * @param {ImageScrollerState} state
 */
var onResize = function onResize(element, state) {
  var defaultSize = parseInt(element.getAttribute(ATTRIBUTE_SIZE)) || 5;
  var displayCount = calculateDisplayCount(window.innerWidth, defaultSize);

  updateView(element, _extends(state, {
    displayCount: displayCount,
    position: 0
  }));
};

/**
 * Returns the number of elements to show for a given width
 *
 * @param {number} elementWidth
 * @param {number} defaultValue
 *
 * @return {number}
 */
var calculateDisplayCount = function calculateDisplayCount(elementWidth, defaultValue) {
  return NUM_IMAGES_TO_SHOW_FOR_WIDTH.reduce(function (res, opt) {
    return Math.min(elementWidth < opt.width ? opt.size : Infinity, res);
  }, defaultValue);
};

/**
 * Initializes a panel
 *
 * @param {HTMLElement} element
 * @return {HTMLElement}
 */
function init(element) {
  // get button html elements
  var nextButton = element.querySelector('.next');
  var prevButton = element.querySelector('.previous');
  var keyboard = new _keyboard2.default();
  var defaultSize = parseInt(element.getAttribute(ATTRIBUTE_SIZE)) || 5;
  var displayCount = calculateDisplayCount(window.innerWidth, defaultSize);

  /**
   * @typedef {object} ImageScrollerState
   * @property {number} displayCount
   * @property {number} position
   */
  var state = {
    displayCount: displayCount,
    position: 0
  };

  // initialize images already existing in the dom
  (0, _elements.querySelectorAll)('[aria-controls]', element).filter(function (image) {
    return image !== null;
  }).forEach(function (image) {
    return keyboard.addElement(image);
  });

  // initialize buttons
  nextButton.addEventListener('click', function () {
    return onNavigationButtonClick(element, state, nextButton, function (state) {
      return state.position--;
    });
  });
  prevButton.addEventListener('click', function () {
    return onNavigationButtonClick(element, state, prevButton, function (state) {
      return state.position++;
    });
  });

  // stop keyboard from setting focus
  element.addEventListener('sdk.keyboard.focus', function (event) {
    return event.preventDefault();
  });

  // react to keyboard input
  element.addEventListener('sdk.keyboard.update', handleFocus(element, state));

  // listen for updates to data-size
  var observer = new MutationObserver((0, _functional.forEach)(handleDomUpdate(element, state, keyboard)));

  observer.observe(element, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [ATTRIBUTE_SIZE]
  });

  // on screen resize calculate number of images to show
  window.addEventListener('resize', function () {
    if (element.ignoreResize) {
      // If resize is triggered by resize we don't want to continue resizing
      element.ignoreResize = false;
      return;
    }

    onResize(element, state);
  });

  // initialize position
  updateView(element, state);

  return element;
}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _functional = __webpack_require__(1);

var _elements = __webpack_require__(0);

var getAllTabbableChildren = function getAllTabbableChildren(element) {
  return (0, _elements.querySelectorAll)('a[href],link[href],button,input,select,textarea,[tabindex="0"]', element);
};

/**
 * Handles key press inside modal
 *
 * @param {Element} element
 * @param {KeyboardEvent} event
 *
 * @function
 */
var handleKeyPress = (0, _functional.curry)(function (element, closeModal, event) {
  var target = event.srcElement || event.target;

  switch (event.which) {
    case 27:
      // ESC
      closeModal();
      event.preventDefault();
      break;
    case 9:
      // TAB
      var elements = getAllTabbableChildren(element);

      // wrap around on tabbing
      if (elements.length > 0) {
        var lastIndex = elements.length - 1;

        if (target === elements[0] && event.shiftKey) {
          elements[lastIndex].focus();
          event.preventDefault();
        } else if (target === elements[lastIndex]) {
          elements[0].focus();
          event.preventDefault();
        }
      }
      break;
  }
});

/**
 * Initiates a modal window
 *
 * @param {HTMLElement} element
 */
function init(element, closeHandler) {
  var dismissButtons = (0, _elements.querySelectorAll)('[data-dismiss="modal"]', element);
  (0, _elements.hide)(element);

  var closeModal = function closeModal() {
    (0, _elements.hide)(element);
    closeHandler();
  };
  dismissButtons.forEach(function (button) {
    return button.addEventListener('click', closeModal);
  });

  // hide modal on escape keypress
  element.addEventListener('keydown', handleKeyPress(element, closeModal));
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _elements = __webpack_require__(0);

var _functional = __webpack_require__(1);

var _collapsible = __webpack_require__(12);

var _keyboard = __webpack_require__(4);

var _keyboard2 = _interopRequireDefault(_keyboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Unselects all elements in an array
 *
 * @param {HTMLElement[]} elements
 * @function
 */
var unselectAll = (0, _functional.forEach)(function (item) {
  item.classList.remove('selected');
  //  item.removeAttribute('aria-describedby');
});

/**
 * Sets the aria-expanded attribute on an element to false
 *
 * @param {HTMLElement} element
 */
var unExpand = (0, _elements.setAttribute)('aria-expanded', 'false');

/**
 * Selects an element, and un selects all other menu items
 *
 * @param {HTMLElement[]} menuItems
 * @param {HTMLElement} element
 * @function
 */
var onSelectMenuItem = function onSelectMenuItem(menuItems, element) {
  unselectAll(menuItems);
  element.classList.add('selected');
  // element.setAttribute('aria-describedby', 'a11y-desc-current');
};

/**
 * Initiates a tab panel
 *
 * @param {HTMLElement} element
 */
function init(element) {
  // elements
  var menuItems = (0, _elements.querySelectorAll)('[role="menuitem"]', element);
  var toggler = element.querySelector('[aria-controls][aria-expanded]');
  var keyboard = new _keyboard2.default();

  keyboard.onSelect = function (element) {
    onSelectMenuItem(menuItems, element);
    unExpand(toggler);
  };

  // move select
  menuItems.forEach(function (menuItem) {
    // add mouse click listener
    menuItem.addEventListener('click', function (event) {
      var element = event.target;
      var elementIndex = menuItems.indexOf(element);

      onSelectMenuItem(menuItems, element);
      unExpand(toggler);
      keyboard.forceSelectedIndex(elementIndex);
    });

    // add keyboard support
    keyboard.addElement(menuItem);
  });

  // Handling keydown, space & enter)
  toggler.addEventListener('keydown', function (event) {
    if (event.which === 13 || event.which === 32) {
      (0, _elements.toggleAttribute)('aria-expanded', toggler);
      event.preventDefault();
    }
  });

  // init collapse and open
  (0, _collapsible.initCollapsible)(element, function (expanded, el) {
    return (0, _elements.toggleClass)('collapsed', !expanded, el);
  });
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _elements = __webpack_require__(0);

var _functional = __webpack_require__(1);

var _keyboard = __webpack_require__(4);

var _keyboard2 = _interopRequireDefault(_keyboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function
 */
var hideAll = (0, _functional.forEach)(_elements.hide);

/**
 * @function
 */
var isSelected = (0, _elements.attributeEquals)('aria-selected', 'true');

/**
 * @function
 */
var unSelectAll = (0, _functional.forEach)((0, _elements.removeAttribute)('aria-selected'));

/**
 * Change tab panel when tab's aria-selected is changed
 *
 * @param {HTMLElement} element
 * @param {HTMLElement} tab
 */
var addAriaSelectedObserver = function addAriaSelectedObserver(element, tab) {
  // set observer on title for aria-expanded
  var observer = new MutationObserver(function () {
    var panelId = tab.getAttribute('aria-controls');
    var panel = element.querySelector('#' + panelId);
    var allPanels = (0, _elements.querySelectorAll)('[role="tabpanel"]', element);

    if (isSelected(tab)) {
      hideAll(allPanels);
      (0, _elements.show)(panel);
    }
  });

  observer.observe(tab, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["aria-selected"]
  });
};

/**
 * Selects an element, and unselects all other tabs
 *
 * @param {HTMLElement[]} allTabs
 * @param {HTMLElement} element
 * @function
 */
var selectTab = (0, _functional.curry)(function (allTabs, element) {
  unSelectAll(allTabs);
  element.setAttribute('aria-selected', 'true');
});

/**
 * Initiates a tab panel
 *
 * @param {HTMLElement} element
 */
function init(element) {
  var tabs = (0, _elements.querySelectorAll)('[role="tab"]', element);
  var keyboard = new _keyboard2.default();

  // handle enter + space click
  keyboard.onSelect = selectTab(tabs);

  // init tabs
  tabs.forEach(function (tab) {
    addAriaSelectedObserver(element, tab);

    tab.addEventListener('click', function (event) {
      var element = event.target;
      var elementIndex = tabs.indexOf(element);
      selectTab(tabs, element);
      keyboard.forceSelectedIndex(elementIndex);
    });

    keyboard.addElement(tab);
  });
}

/***/ }),
/* 34 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(16);

// Load library
H5P = H5P || {};
H5P.HubClient = __webpack_require__(14).default;
H5P.HubServices = __webpack_require__(8).default;
H5P.HubServicesFactory = __webpack_require__(15).default;

/***/ })
/******/ ]);
//# sourceMappingURL=h5p-hub-client.js.map
