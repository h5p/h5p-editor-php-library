/** @namespace H5P */
var H5P = H5P || {};

/** @namespace H5PEditor */
var H5PEditor = H5PEditor || {};


/* ---- FILE SEPARATOR ---- */


H5P.EventDispatcher = (function () {

  /**
   * The base of the event system.
   * Inherit this class if you wish for your H5P to dispatch events.
   * @class
   */
  function EventDispatcher() {
    var self = this;

    /**
     * Keep track of events and listeners for each event.
     * @private
     * @type {Object}
     */
    var events = {};

    /**
     * Add new event listener.
     *
     * @public
     * @throws {TypeError} listener must be a function
     * @param {String} type Event type
     * @param {Function} listener Event listener
     */
    self.on = function (type, listener) {
      if (!(listener instanceof Function)) {
        throw TypeError('listener must be a function');
      }

      // Trigger event before adding to avoid recursion
      self.trigger('newListener', type, listener);

      if (!events[type]) {
        // First
        events[type] = [listener];
      }
      else {
        // Append
        events[type].push(listener);
      }
    };

    /**
     * Remove event listener.
     * If no listener is specified, all listeners will be removed.
     *
     * @public
     * @throws {TypeError} listener must be a function
     * @param {String} type Event type
     * @param {Function} [listener] Event listener
     */
    self.off = function (type, listener) {
      if (listener !== undefined && !(listener instanceof Function)) {
        throw TypeError('listener must be a function');
      }

      if (events[type] === undefined) {
        return;
      }

      if (listener === undefined) {
        // Remove all listeners
        delete events[type];
        self.trigger('removeListener', type);
        return;
      }

      // Find specific listener
      for (var i = 0; i < events[type].length; i++) {
        if (events[type][i] === listener) {
          events[type].unshift(i, 1);
          self.trigger('removeListener', type, listener);
          break;
        }
      }

      // Clean up empty arrays
      if (!events[type].length) {
        delete events[type];
      }
    };

    /**
     * Dispatch event.
     *
     * @public
     * @param {String} type Event type
     * @param {...*} args
     */
    self.trigger = function (type, args) {
      if (events[type] === undefined) {
        return;
      }

      // Copy all arguments except the first
      args = [];
      var i;
      for (i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      // Call all listeners
      for (i = 0; i < events[type].length; i++) {
        events[type][i].apply(self, args);
      }
    };

    // TODO: Add once!
  }

  return EventDispatcher;
})();


/* ---- FILE SEPARATOR ---- */


H5PEditor.SemanticStructure = (function ($) {
  var self = this;

  /**
   * The base of the semantic structure system.
   * All semantic structure class types will inherit this class.
   *
   * @class
   */
  function SemanticStructure(field) {
    var self = this;

    // Initialize event inheritance
    H5P.EventDispatcher.call(self);

    var $widgetSelect, $wrapper, $errors, $description, widgets;

    /**
     * Initialize. Wrapped to avoid leaking variables
     * @private
     */
    var init = function () {
      widgets = getValidWidgets();

      if (widgets.length > 1) {
        // Create widget select box
        $widgetSelect = $('<select/>').change(function () {
          changeWidget($widgetSelect.val());
        });
        for (var i = 0; i < widgets.length; i++) {
          var name = widgets[i];
          $('<option/>', {
            value: name,
            text: name // TODO: get from translations?
          }).appendTo($widgetSelect);
        }
      }

      // Create field wrapper
      $wrapper = $('<div/>', {
        'class': 'field ' + field.type
      });

      /* TODO: Should we move this stuff to a default widget class, thus making it easier to override?
      If so we should create functions for getting field semantic properties. That will
      avoid getting custom non-semantic properties in the semantics.json. */

      if (field.label !== 0) {
        // Add label
        $('<label/>', {
          'class': 'h5peditor-label',
          text: (field.label === undefined ? field.name : field.label)
        });
      }

      // Create errors container
      $errors = $('<div/>', {
        'class': 'h5p-errors'
      });

      // Create description block
      if (field.description !== undefined) {
        $description = $('<div/>', {
          'class': 'h5peditor-field-description',
          text: field.description
        });
      }
    };

    /**
     * Get a list of widgets that are valid and loaded.
     *
     * @private
     * @throws {TypeError} widgets must be an array
     * @returns {Array} List of valid widgets
     */
    var getValidWidgets = function () {
      if (field.widgets === undefined) {
        // No widgets specified use default
        return ['List'];
      }
      if (!(field.widgets instanceof Array)) {
        throw TypeError('widgets must be an array');
      }

      // Check if specified widgets are valid
      var validWidgets = [];
      for (var i = 0; i < field.widgets.length; i++) {
        var name = field.widgets[i];
        if (getWidget(name)) {
          validWidgets.push(name);
        }
      }

      if (!validWidgets.length) {
        // There are no valid widgets, add default
        validWidgets.push('List');
      }

      return validWidgets;
    };

    /**
     * Finds the widget class with the given name.
     *
     * @private
     * @param {String} name
     * @returns {Class}
     */
    var getWidget = function (name) {
      return H5PEditor[name + 'Widget'];
    };

    /**
     * Change the UI widget.
     *
     * @private
     * @param {String} name
     */
    var changeWidget = function (name) {
      if (self.widget !== undefined) {
        // Remove old widgets
        self.widget.remove();
      }

      var widget = getWidget(name);
      self.widget = new widget(self);
      self.trigger('changeWidget');
      self.widget.appendTo($wrapper);

      // Add errors container and description.
      $errors.appendTo($wrapper);
      if ($description !== undefined) {
        $description.appendTo($wrapper);
      }
    };

    /**
     * Appends the field widget to the given container.
     *
     * @public
     * @param {jQuery} $container
     */
    self.appendTo = function ($container) {
      if ($widgetSelect) {
        // Add widget select box
        $widgetSelect.appendTo($container);
      }

      // Use first widget by default
      changeWidget(widgets[0]);

      $wrapper.appendTo($container);
    };

    /**
     * Remove this field and widget.
     *
     * @public
     */
    self.remove = function () {
      self.widget.remove();
    };

    // Must be last
    init();
  }

  // Extends the event dispatcher
  SemanticStructure.prototype = Object.create(H5P.EventDispatcher.prototype);
  SemanticStructure.prototype.constructor = SemanticStructure;

  return SemanticStructure;
})(H5P.jQuery);


/* ---- FILE SEPARATOR ---- */


H5PEditor.List = (function ($) {

  /**
   * List structure.
   *
   * @class
   * @param {*} parent structure
   * @param {Object} field Semantic description of field
   * @param {Array} [parameters] Default parameters for this field
   * @param {Function} setValue Call to set our parameters
   */
  function List(parent, field, parameters, setValue) {
    var self = this;

    // Initialize semantics structure inheritance
    H5PEditor.SemanticStructure.call(self, field);

    // Make it possible to travel up three.
    self.parent = parent;
    // TODO: Could this be done better? Perhaps through SemanticStructure?

    /**
     * Keep track of child fields. Should not be exposed directly,
     * create functions for using or finding the children.
     *
     * @private
     * @type {Array}
     */
    var children = [];

    // Prepare the old ready callback system
    var readyCallbacks = [];
    var passReadyCallbacks = true;
    parent.ready(function () {
      passReadyCallbacks = false;
    });
    // TODO: In the future we might listen for parents ready event? (through parent.once())

    // Listen for widget changes
    self.on('changeWidget', function () {
      // Append all items to new widget
      for (var i = 0; i < children.length; i++) {
        self.widget.addItem(children[i]);
      }
    });

    /**
     * Add all items to list without appending to DOM.
     *
     * @public
     */
    var init = function () {
      var i;
      if (parameters !== undefined && parameters.length) {
        for (i = 0; i < parameters.length; i++) {
          addItem(i);
        }
      }
      else {
        if (field.defaultNum === undefined) {
          // Use min or 1 if no default item number is set.
          field.defaultNum = (field.min !== undefined ? field.min : 1);
        }
        // Add default number of fields.
        for (i = 0; i < field.defaultNum; i++) {
          addItem(i);
        }
      }
    };

    /**
     * Add item to list.
     *
     * @private
     * @param {Number} index
     * @param {*} [paramsOverride] Override params using this value.
     */
    var addItem = function (index, paramsOverride) {
      var childField = field.field;
      var widget = H5PEditor.getWidgetName(childField);

      if (parameters === undefined) {
        // Create new parameters for list
        parameters = [];
        setValue(field, parameters);
      }

      if (parameters[index] === undefined && childField['default'] !== undefined) {
        // Use default value
        parameters[index] = childField['default'];
      }
      if (paramsOverride !== undefined) {
        // Use override params
        parameters[index] = paramsOverride;
      }

      var child = children[index] = new H5PEditor.widgets[widget](self, childField, parameters[index], function (childField, value) {
        parameters[findIndex(child)] = value;
      });

      if (!passReadyCallbacks) {
        // Run collected ready callbacks
        for (var i = 0; i < readyCallbacks.length; i++) {
          readyCallbacks[i]();
        }
        readyCallbacks = []; // Reset
      }

      return child;
    };

    /**
     * Finds the index for the given child.
     *
     * @private
     * @param {Object} child field instance
     * @returns {Number} index
     */
    var findIndex = function (child) {
      for (var i = 0; i < children.length; i++) {
        if (children[i] === child) {
          return i;
        }
      }
    };

    /**
     * Get the singular form of the items added in the list.
     *
     * @public
     * @returns {String} The entity type
     */
    self.getEntity = function () {
      return (field.entity === undefined ? 'item' : field.entity);
    };

    /**
     * Adds a new list item and child field at the end of the list
     *
     * @public
     * @param {*} [paramsOverride] Override params using this value.
     */
    self.addItem = function (paramsOverride) {
      var child = addItem(children.length, paramsOverride);
      self.widget.addItem(child);
    };

    /**
     * Removes the list item at the given index.
     *
     * @public
     * @param {Number} index
     */
    self.removeItem = function (index) {
      // Remove child field
      children[index].remove();
      children.splice(index, 1);

      // Clean up parameters
      parameters.splice(index, 1);
      if (!parameters.length) {
        // Create new parameters for list
        parameters = undefined;
        setValue(field);
      }
    };

    /**
     * Removes all items.
     * This is useful if a widget wants to reset the list.
     *
     * @public
     */
    self.removeAllItems = function () {
      // Remove child fields
      for (var i = 0; i < children.length; i++) {
        children[i].remove();
      }
      children = [];

      // Clean up parameters
      parameters = undefined;
      setValue(field);
    };

    /**
     * Change the order of the items in the list.
     * Be aware that this may change the index of other existing items.
     *
     * @public
     * @param {Number} currentIndex
     * @param {Number} newIndex
     */
    self.moveItem = function (currentIndex, newIndex) {
      // Update child fields
      var child = children.splice(currentIndex, 1);
      children.splice(newIndex, 0, child[0]);

      // Update parameters
      var params = parameters.splice(currentIndex, 1);
      parameters.splice(newIndex, 0, params[0]);
    };

    /**
     * Allows ancestors and widgets to do stuff with our children.
     *
     * @public
     * @param {Function} task
     */
    self.forEachChild = function (task) {
      for (var i = 0; i < children.length; i++) {
        task(children[i]);
      }
    };

    /**
     * Collect callback to run when the editor is ready. If this item isn't
     * ready yet, jusy pass them on to the parent item.
     *
     * @public
     * @param {Function} ready
     */
    self.ready = function (ready) {
      if (passReadyCallbacks) {
        parent.ready(ready);
      }
      else {
        readyCallbacks.push(ready);
      }
    };

    /**
     * Make sure that this field and all child fields are valid.
     *
     * @public
     * @returns {Boolean}
     */
    self.validate = function () {
      var valid = true;

      for (var i = 0; i < children.length; i++) {
        if (children[i].validate() === false) {
          valid = false;
        }
      }

      return valid;
    };

    // Start the party!
    init();
  }

  // Extends the semantics structure
  List.prototype = Object.create(H5PEditor.SemanticStructure.prototype);
  List.prototype.constructor = List;

  return List;
})(H5P.jQuery);

// Register widget
H5PEditor.widgets.list = H5PEditor.List;


/* ---- FILE SEPARATOR ---- */


H5PEditor.ListWidget = (function ($) {

  /**
   * Draws the list.
   *
   * @class
   * @param {List} list
   */
  function ListWidget(list) {
    var self = this;

    var entity = list.getEntity();

    // Create list html
    var $list = $('<ul/>', {
      'class': 'h5p-ul'
    });

    // Create add button
    var $button = $('<button/>', {
      text: H5PEditor.t('core', 'addEntity', {':entity': entity})
    }).click(function () {
      list.addItem();
    });

    // Used when dragging items around
    var adjustX, adjustY, marginTop, formOffset;

    /**
     * @private
     * @param {jQuery} $item
     * @param {jQuery} $placeholder
     * @param {Number} x
     * @param {Number} y
     */
    var moveItem = function ($item, $placeholder, x, y) {
      var currentIndex;

      // Adjust so the mouse is placed on top of the icon.
      x = x - adjustX;
      y = y - adjustY;
      $item.css({
        top: y - marginTop - formOffset.top,
        left: x - formOffset.left
      });

      // Try to move up.
      var $prev = $item.prev().prev();
      if ($prev.length && y < $prev.offset().top + ($prev.height() / 2)) {
        $prev.insertAfter($item);

        currentIndex = $item.index();
        list.moveItem(currentIndex, currentIndex - 1);

        return;
      }

      // Try to move down.
      var $next = $item.next();
      if ($next.length && y + $item.height() > $next.offset().top + ($next.height() / 2)) {
        $next.insertBefore($placeholder);

        currentIndex = $item.index();
        list.moveItem(currentIndex, currentIndex + 1);
      }
    };

    /**
     * Adds UI items to the widget.
     *
     * @public
     * @param {Object} item
     */
    self.addItem = function (item) {
      var $placeholder;
      var $item = ns.$('<li/>', {
        'class' : 'h5p-li',
      });

      /**
       * Mouse move callback
       *
       * @private
       * @param {Object} event
       */
      var move = function (event) {
        moveItem($item, $placeholder, event.pageX, event.pageY);
      };

      /**
       * Mouse button release callback
       *
       * @private
       */
      var up = function () {
        H5P.$body
          .unbind('mousemove', move)
          .unbind('mouseup', up)
          .unbind('mouseleave', up)
          .attr('unselectable', 'off')
          .css({
            '-moz-user-select': '',
            '-webkit-user-select': '',
            'user-select': '',
            '-ms-user-select': ''
          })
          [0].onselectstart = H5P.$body[0].ondragstart = null;

        $item.removeClass('moving').css({
          width: 'auto',
          height: 'auto'
        });
        $placeholder.remove();
      };

      /**
       * Mouse button down callback
       *
       * @private
       */
      var down = function () {
        if (event.which !== 1) {
          return; // Only allow left mouse button
        }

        // Start tracking mouse
        H5P.$body
          .attr('unselectable', 'on')
          .mouseup(up)
          .bind('mouseleave', up)
          .css({
            '-moz-user-select': 'none',
            '-webkit-user-select': 'none',
            'user-select': 'none',
            '-ms-user-select': 'none'
          })
          .mousemove(move)
          [0].onselectstart = H5P.$body[0].ondragstart = function () {
            return false;
          };

        var offset = $item.offset();
        adjustX = event.pageX - offset.left;
        adjustY = event.pageY - offset.top;
        marginTop = parseInt($item.css('marginTop'));
        formOffset = $list.offsetParent().offset();
        // TODO: Couldn't formOffset and margin be added?

        var width = $item.width();
        var height = $item.height();

        $item.addClass('moving').css({
          width: width,
          height: height
        });
        $placeholder = $('<li/>', {
          'class': 'placeholder h5p-li',
          css: {
            width: width,
            height: height
          }
        }).insertBefore($item);

        move(event);
        return false;
      };

      // Append order button
      $('<div/>', {
        'class' : 'order',
        role: 'button',
        tabIndex: 1,
        on: {
          mousedown: down
        }
      }).appendTo($item);

      // Append remove button
      $('<div/>', {
        'class' : 'remove',
        role: 'button',
        tabIndex: 1,
        on: {
          click: function () {
            if (confirm(H5PEditor.t('core', 'confirmRemoval', {':type': list.entity}))) {
              list.removeItem($item.index());
              $item.remove();
            }
          }
        }
      }).appendTo($item);

      // Append content wrapper
      var $content = ns.$('<div/>', {
        'class' : 'content'
      }).appendTo($item);

      // Append new field item to content wrapper
      item.appendTo($content);

      // Append item to list
      $item.appendTo($list);

      // Good UX: automatically expand groups
      if (item instanceof H5PEditor.Group) {
        item.expand();
      }
    };

    /**
     * Puts this widget at the end of the given container.
     *
     * @public
     * @param {jQuery} $container
     */
    self.appendTo = function ($container) {
      $list.appendTo($container);
      $button.appendTo($container);
    };

    /**
     * Remove this widget from the editor DOM.
     *
     * @public
     */
    self.remove = function () {
      $list.remove();
      $button.remove();
    };
  }

  return ListWidget;
})(H5P.jQuery);


/* ---- FILE SEPARATOR ---- */


H5PEditor.SummariesTextWidget = (function ($) {

  /**
   * Creates a text input widget for editing summaries.
   *
   * @class
   * @param {List}
   */
  function SummariesTextWidget(list) {
    var self = this;
    var entity = list.getEntity();
    var recreation = false;

    // Create list html
    var $input = $('<textarea/>', {
      rows: 20,
      css: {
        resize: 'none'
      },
      on: {
        change: function () {
          recreateList();
        }
      }
    });

    // Used to convert HTML to text and vice versa
    var $cleaner = $('<div/>');

    /**
     * Clears all items from the list, processes the text and add the items
     * from the text. This makes it possible to switch to another widget
     * without losing datas.
     *
     * @private
     */
    var recreateList = function () {
      // Get text input
      var textLines = $input.val().split("\n");
      textLines.push(''); // Add separator

      // Reset list
      list.removeAllItems();
      //$input.val('');
      recreation = true;
      // TODO: recreation can be dropped when group structure can be created without being appended.
      // Then the fields can be added back to the textarea like a validation.

      // Go through text lines and add statements to list
      var statements = [];
      for (var i = 0; i < textLines.length; i++) {
        var textLine = textLines[i].trim();
        if (textLine === '') {
          // Task seperator
          if (statements.length) {
            // Add statements to list
            list.addItem({
              summary: statements
            });

            // Start new list of statments
            statements = [];
          }
          continue;
        }

        // Convert text to html
        $cleaner.text(textLine);

        // Add statement
        statements.push($cleaner.html());
      }

      recreation = false;
    };

    /**
     * Add items to the text input.
     *
     * @public
     * @param {Object} item instance
     */
    self.addItem = function (item) {
      if (recreation) {
        return;
      }
      if (!(item instanceof H5PEditor.Group)) {
        return;
      }

      item.forEachChild(function (child) {
        if (!(child instanceof H5PEditor.List)) {
          return;
        }

        var text = '';
        child.forEachChild(function (grandChild) {
          var html = grandChild.validate();
          if (html !== false) {
            // Strip all html tags and remove line breaks.
            text += html.replace(/(<[^>]*>|\r\n|\n|\r)/gm, '') + '\n';
          }
        });

        if (text !== '') {
          // Convert all escaped html to text
          $cleaner.html(text);
          text = $cleaner.text();

          // Append text
          var current = $input.val();
          if (current !== '') {
            current += '\n';
          }
          $input.val(current + text);
        }
      });
    };

    /**
     * Puts this widget at the end of the given container.
     *
     * @public
     * @param {jQuery} $container
     */
    self.appendTo = function ($container) {
      $input.appendTo($container);
    };

    /**
     * Remove this widget from the editor DOM.
     *
     * @public
     */
    self.remove = function () {
      $input.remove();
    };
  }

  return SummariesTextWidget;
})(H5P.jQuery);
