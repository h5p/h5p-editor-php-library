/* global ns CKEDITOR */
/**
 * Adds a html text field to the form.
 *
 * @param {type} parent
 * @param {type} field
 * @param {type} params
 * @param {type} setValue
 * @returns {undefined}
 */
ns.Html = function (parent, field, params, setValue) {
  this.parent = parent;
  this.field = field;
  this.value = params;
  this.setValue = setValue;
  this.tags = ns.$.merge(['br'], (this.field.tags || this.defaultTags));
};
ns.Html.first = true;

ns.Html.prototype.defaultTags = ['strong', 'em', 'del', 'h2', 'h3', 'a', 'ul', 'ol', 'table', 'hr'];

// This should probably be named "hasTag()" instead...
// And might be more efficient if this.tags.contains() were used?
ns.Html.prototype.inTags = function (value) {
  return (ns.$.inArray(value.toLowerCase(), this.tags) >= 0);
};

/**
 * Check if the provided button is enabled by config.
 *
 * @param {string} value
 * @return {boolean}
 */
ns.Html.prototype.inButtons = function (button) {
  return (H5PIntegration.editor !== undefined && H5PIntegration.editor.wysiwygButtons !== undefined && H5PIntegration.editor.wysiwygButtons.indexOf(button) !== -1);
};

ns.Html.prototype.getCKEditorConfig = function () {
  const basicstyles = [];
  const plugins = ['Essentials', 'Paragraph'];
  const alignments = { options: ["left", "center", "right"] };
  const paragraph = [];
  const formats = [];
  const inserts = [];
  const toolbar = [];

  // Basic styles
  if (this.inTags("strong") || this.inTags("b")) {
    basicstyles.push('bold');
    plugins.push('Bold');
    // Might make "strong" duplicated in the tag lists. Which doesn't really
    // matter. Note: CKeditor will only make strongs.
    this.tags.push("strong");
  }
  if (this.inTags("em") || this.inTags("i")) {
    basicstyles.push('italic');
    plugins.push('Italic');
    this.tags.push("i");
  }
  if (this.inTags("u")) {
    basicstyles.push('underline');
    plugins.push('Underline');
    this.tags.push("u");
  }
  if (this.inTags("strike") || this.inTags("del") || this.inTags("s")) {
    basicstyles.push('strikethrough');
    plugins.push('Strikethrough');
    // Might make "strike" or "del" or both duplicated in the tag lists. Which
    // again doesn't really matter.
    this.tags.push("strike");
    this.tags.push("del");
    this.tags.push("s");
  }
  if (this.inTags("sub")) {
    basicstyles.push("subscript");
    plugins.push('Subscript');
  }
  if (this.inTags("sup")) {
    basicstyles.push("superscript");
    plugins.push('Superscript');
  }
  if (basicstyles.length > 0) {
    basicstyles.push('|', 'removeFormat');
    plugins.push('RemoveFormat');
    toolbar.push(...basicstyles);
  }

  // Alignment is added to all wysiwygs
  plugins.push('Alignment');
  toolbar.push('|', 'alignment');

  // Paragraph styles
  if (this.inTags("ul") || this.inTags("ol")) {
    plugins.push('List');
  }
  if (this.inTags("ul")) {
    paragraph.push("bulletedList");
    this.tags.push("li");
  }
  if (this.inTags("ol")) {
    paragraph.push("numberedList");
    this.tags.push("li");
  }
  if (this.inTags("blockquote")) {
    paragraph.push("blockquote");
    plugins.push('BlockQuote');
  }
  if (this.inButtons('language')) {
    this.tags.push('span');
    paragraph.push('textPartLanguage');
    plugins.push('TextPartLanguage');
  }
  if (paragraph.length > 0) {
    toolbar.push(...paragraph);
  }

  // Links.
  if (this.inTags("a")) {
    const items = ["link"];
    plugins.push('Link'); // TODO: add plugin 'AutoLink' once available in h5p-ckeditor repo
    toolbar.push("|", ...items);
  }

  // Inserts
  if (this.inTags('img')) {
    // TODO: Include toolbar functionality to insert and edit images
    // For now, we just include the plugin to prevent data loss
    plugins.push('Image');
  }
  // Include table plugins to avoid errors when creating the editor
  plugins.push('Table', 'TableToolbar');
  if (this.inTags("table")) {
    inserts.push("insertTable");
    ns.$.merge(this.tags, ["tr", "td", "th", "colgroup", "thead", "tbody", "tfoot"]);
  }
  if (this.inTags("hr")) {
    inserts.push("horizontalLine");
    plugins.push('HorizontalLine');
  }
  if (this.inTags('code')) {
    if (this.inButtons('inlineCode')) {
      inserts.push('code');
      plugins.push('Code');
    }
    if (this.inTags('pre') && this.inButtons('codeSnippet')) {
      inserts.push('codeBlock');
      plugins.push('CodeBlock');
    }
  }
  if (inserts.length > 0) {
    toolbar.push("|", ...inserts);
  }

  const config = {
    updateSourceElementOnDestroy: true,
    plugins: plugins,
    alignment: alignments,
    toolbar: toolbar,
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    }
  };

  // Add dropdown to toolbar if formatters in tags (h1, h2, etc).
  for (let index = 1; index < 7; index++) {
    if (this.inTags('h' + index)) {
      formats.push({ model: 'heading' + index, view: 'h' + index, title: 'Heading ' + index, class: 'ck-heading_heading' + index });
    }
  }
  // if (this.inTags("address")) formats.push("address"); // TODO: potential data loss
  if (formats.length > 0 || this.inTags('p') || this.inTags('div')) {
    // If the formats are shown, always have a paragraph
    formats.push({ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' });
    this.tags.push("p");
    config['heading'] = {options: formats};
    config['plugins'].push('Heading');
    config['toolbar'].push('heading');
  }

  if (this.field.font !== undefined) {
    // Create wrapper for text styling options
    var styles = [];
    var colors = [];
    this.tags.push('span');

    /**
     * Help set specified values for property.
     *
     * @private
     * @param {Array} values list
     * @param {string} prop Property name
     */
    const setValues = function (values, prop) {
      options = [];
      for (let i = 0; i < values.length; i++) {
        options.push(values[i]);
      }
      config[prop] = { options: options };
    };

    // Font family chooser
    // TODO: not used in any official h5p content types
    // TODO: Data loss risk for open source types that use it
    // if (this.field.font.family) {
    //   styles.push('fontFamily');
    //   config['plugins'].push('FontFamily');

    //   if (this.field.font.family instanceof Array) {
    //     // Use specified families
    //     setValues(this.field.font.family, 'fontFamily');
    //   }
    // }

    // Font size chooser
    if (this.field.font.size) {
      styles.push('fontSize');
      config['plugins'].push('FontSize');

      if (this.field.font.size instanceof Array) {
        // Use specified sizes
        // TODO: likely not backwards compatible as is
        setValues(this.field.font.size, 'fontSize');
      }
      else {
        const fontSizes = [];

        // Standard font sizes that are available.
        const defaultAvailable = [8, 9, 10, 11, 12, 14, 'default', 18, 20, 22, 24, 26, 28, 36, 48, 72];

        for (let i = 0; i < defaultAvailable.length; i++) {
          fontSizes.push(defaultAvailable[i]);
        }
        setValues(fontSizes, 'fontSize');
      }
    }

    /**
     * Format an array of color objects for ckeditor
     * @param {Array} values
     * @returns {string}
     */
    const getColors = function (values) {
      const colors = [];
      for (let i = 0; i < values.length; i++) {
        const val = values[i];
        if (val.label && val.css) {
          // Check if valid color format
          const css = val.css.match(/^(#[a-f0-9]{3}[a-f0-9]{3}?|rgba?\([0-9, ]+\)|hsla?\([0-9,.% ]+\)) *;?$/i);

          // If invalid, skip
          if (!css) {
            continue;
          }

          colors.push({color: css[0], label: val.label});
        }
      }
      return colors;
    };

    // Text color chooser
    if (this.field.font.color) {
      colors.push('fontColor');
      config['plugins'].push('FontColor');

      if (this.field.font.color instanceof Array) {
        config['fontColor'] = { colors: getColors(this.field.font.color) };
      }
    }

    // Text background color chooser
    if (this.field.font.background) {
      colors.push('fontBackgroundColor');
      config['plugins'].push('FontBackgroundColor');

      if (this.field.font.background instanceof Array) {
        config['fontBackgroundColor'] = { colors: getColors(this.field.font.color) };
      }
    }

    // Add the text styling options
    if (styles.length) {
      toolbar.push(...styles);
    }
    if (colors.length) {
      toolbar.push(...colors);
    }
  }

  if (this.field.enterMode === 'p') {
    this.tags.push('p');
  }
  else {
    this.tags.push('div');
  }

  return config;
};

/**
 * Append field to wrapper.
 *
 * @param {type} $wrapper
 * @returns {undefined}
 */
ns.Html.prototype.appendTo = function ($wrapper) {
  var that = this;

  this.$item = ns.$(this.createHtml()).appendTo($wrapper);
  this.$input = this.$item.children('.ckeditor');
  this.$errors = this.$item.children('.h5p-errors');
  this.ckeditor = undefined;

  ns.bindImportantDescriptionEvents(this, this.field.name, this.parent);

  this.ckEditorConfig = this.getCKEditorConfig();

  this.$input.focus(function () {
    // Blur is not fired on destroy. Therefore we need to keep track of it!
    var blurFired = false;

    // Remove placeholder
    that.$placeholder = that.$item.find('.h5peditor-ckeditor-placeholder').detach();

    if (ns.Html.first) {
      ClassicEditor.basePath = ns.basePath + '/ckeditor/';
      ns.Html.first = false;
    }

    if (ns.Html.current === that) {
      return;
    }
    // Remove existing CK instance.
    ns.Html.removeWysiwyg();

    ns.Html.current = that;

    ClassicEditor
      .create(this, that.ckEditorConfig)
      .then(editor => {
        const getEditorHeight = () => {
          const { innerHeight, innerWidth } = window;
          let ratio = 0.5;

          switch (true) {
            case innerHeight < 560:
              ratio = 0.2
              break;
            case innerHeight < 768 && innerWidth < 576:
              ratio = 0.25
              break;
            case innerHeight < 768:
              ratio = 0.3
              break;
            case innerHeight < 1024 && innerWidth < 576:
              ratio = 0.3;
              break;
            case innerHeight < 1024:
              ratio = 0.45;
              break;
            default:
              break;
          }

          return ratio * innerHeight * 0.85;
        }

        const getColors = () => {
          if (newStyles) {
            return newStyles;
          } else if (that.ckeditor.config.get('ckeStyles')) {
            return that.ckeditor.config.get('ckeStyles');
          } else {
            return {};
          }
        }


        // Use <em> elements for italic text instead of <i>
        editor.conversion.for('downcast').attributeToElement( {
          model: 'italic',
          view: 'em',
          converterPriority: 'high'
        });

        // Mimic old enter_mode behaviour if not specifically set to 'p'
        if (that.field.enterMode !== 'p') {
          // Use <div> elements instead of <p>
          editor.conversion.for('downcast').elementToElement({
            model: 'paragraph',
            view: 'div',
            converterPriority: 'high'
          });
        }

        that.ckeditor = editor;
        const editable = editor.ui.view.editable;
        editorElement = editable.element;
        editorElement.style.maxHeight = getEditorHeight() + 'px';
        editorElement.style.backgroundColor = getColors().backgroundColor;;
        editorElement.style.color = getColors().color;

        let newStyles;
        document.addEventListener('ckeStylesChanged', (event) => {
          newStyles = event.detail;
          if (that.ckeditor) {
            const editorElement = that.ckeditor.ui.view.editable.element;
            editorElement.style.backgroundColor = newStyles.backgroundColor || '';
            editorElement.style.color = newStyles.color || '';
          }
        });

        editable.on('change', (event) => {
          editorElement = event.source.element;
          editorElement.style.maxHeight = getEditorHeight() + 'px';
        });

        editable.on('change:isFocused', (event) => {
          editorElement = event.source.element;
          editorElement.style.backgroundColor = getColors().backgroundColor;
          editorElement.style.color = getColors().color;
        });

        editor.editing.view.focus();

        editor.on('focus', function () {
          blurFired = false;
        });

        editor.once('destroy', function () {
          // In some cases, the blur event is not fired. Need to be sure it is, so that
          // validation and saving is done
          if (!blurFired) {
            blur();
          }

          // Display placeholder if:
          // -- The value held by the field is empty AND
          // -- The value shown in the UI is empty AND
          // -- A placeholder is defined
          const value = editor.getData();
          if (that.$placeholder.length !== 0 && (value === undefined || value.length === 0) && (that.value === undefined || that.value.length === 0)) {
            that.$placeholder.appendTo(that.$item.find('.ckeditor'));
          }
        });

        var blur = function () {
          blurFired = true;

          // Do not validate if the field has been hidden.
          if (that.$item.is(':visible')) {
            that.validate();
          }
        };

        editor.on('blur', blur);
      })
      .catch(error => {
        throw new Error('Error loading CKEditor: ' + error);
      });
    });

  // Always preload the first CKEditor field to avoid focus problems when the
  // editor is opened inside an iframe and focus has to be set by a human made
  // event (Safari).
  // if (this.$item.is(':visible') && !ns.Html.firstLoad) {
  //   handleFocus();
  //   ns.Html.firstLoad = true;
  // }
};

/**
 * Create HTML for the HTML field.
 */
ns.Html.prototype.createHtml = function () {
  const id = ns.getNextFieldId(this.field);
  var input = '<div id="' + id + '"';
  if (this.field.description !== undefined) {
    input += ' aria-describedby="' + ns.getDescriptionId(id) + '"';
  }
  input += ' class="ckeditor" tabindex="0" contenteditable="true">';
  if (this.value !== undefined) {
    input += this.value;
  }
  else if (this.field.placeholder !== undefined) {
    input += '<span class="h5peditor-ckeditor-placeholder">' + this.field.placeholder + '</span>';
  }
  input += '</div>';

  return ns.createFieldMarkup(this.field, ns.createImportantDescription(this.field.important) + input, id);
};

/**
 * Validate the current text field.
 */
ns.Html.prototype.validate = function () {
  var that = this;

  if (that.$errors.children().length) {
    that.$errors.empty();
    this.$input.addClass('error');
  }

  // Get contents from editor
  // If there are more than one ckeditor, getData() might be undefined when ckeditor is not
  let value = ((this.ckeditor !== undefined && this.ckeditor.getData() !== undefined)
    ? this.ckeditor.getData()
    : this.$input.html());

  value = value
    // Remove placeholder text if any:
    .replace(/<span class="h5peditor-ckeditor-placeholder">.*<\/span>/, '')
    // Workaround for Microsoft browsers that otherwise can produce non-emtpy fields causing trouble
    .replace(/^<br>$/, '');

  var $value = ns.$('<div>' + value + '</div>');
  var textValue = $value.text();

  // Check if we have any text at all.
  if (!this.field.optional && !textValue.length) {
    // We can accept empty text, if there's an image instead.
    if (!(this.inTags("img") && $value.find('img').length > 0)) {
      this.$errors.append(ns.createError(ns.t('core', 'requiredProperty', { ':property': ns.t('core', 'textField') })));
    }
  }

  // Verify HTML tags.  Removes tags not in allowed tags.  Will replace with
  // the tag's content.  So if we get an unallowed container, the contents
  // will remain, without the container.
  $value.find('*').each(function () {
    if (!that.inTags(this.tagName)) {
      ns.$(this).replaceWith(ns.$(this).contents());
    }
  });
  value = $value.html();

  // Display errors and bail if set.
  if (that.$errors.children().length) {
    return false;
  }
  else {
    this.$input.removeClass('error');
  }

  this.value = value;
  this.setValue(this.field, value);
  this.$input.change(); // Trigger change event.

  return value;
};

/**
 * Destroy H5PEditor existing CK instance. If it exists.
 */
ns.Html.removeWysiwyg = function () {
  if (ns.Html.current !== undefined) {
    try {
      ns.Html.current.ckeditor.destroy();
    }
    catch (e) {
      // No-op, just stop error from propagating. This usually occurs if
      // the CKEditor DOM has been removed together with other DOM data.
    }
    ns.Html.current = undefined;
  }
};

/**
 * Remove this item.
 */
ns.Html.prototype.remove = function () {
  this.$item.remove();
};

/**
 * When someone from the outside wants to set a value.
 *
 * @param {string} value
 */
ns.Html.prototype.forceValue = function (value) {
  if (this.ckeditor === undefined) {
    this.$input.html(value);
  }
  else {
    this.ckeditor.setData(value);
  }
  this.validate();
};

ns.widgets.html = ns.Html;

