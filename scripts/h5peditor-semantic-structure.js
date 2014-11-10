/** @namespace H5PEditor */
var H5PEditor = H5PEditor || {};

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

    /**
     * Global instance variables.
     * @private
     */
    var $widgetSelect, $wrapper, $errors, $description, widgets;

    /**
     * Initialize. Wrapped to avoid leaking variables
     * @private
     */
    var init = function () {
      widgets = getValidWidgets();
      console.log(field, widgets);

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
