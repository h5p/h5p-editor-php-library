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
  const config = {
    plugins: ['Essentials', 'Paragraph', 'NonBreakingSpace'],
    alignment: { options: ["left", "center", "right"] },
    toolbar: [],
  };

  // Basic styles
  const basicstyles = [];
  const basicstylesPlugins = [];
  if (this.inTags("strong") || this.inTags("b")) {
    basicstyles.push('bold');
    basicstylesPlugins.push('Bold');
    // Might make "strong" duplicated in the tag lists. Which doesn't really
    // matter. Note: CKeditor will only make strongs.
    this.tags.push("strong");
  }
  if (this.inTags("em") || this.inTags("i")) {
    // Use <em> elements for italic text instead of CKE's default <i>
    // Has to be a plugin to work
    const ItalicAsEmPlugin = ( editor ) => {
      editor.conversion.for('downcast').attributeToElement({
        model: 'italic',
        view: 'em',
        converterPriority: 'high',
      });
    }

    basicstyles.push('italic');
    basicstylesPlugins.push('Italic', ItalicAsEmPlugin);
    this.tags.push("i");
  }
  if (this.inTags("u")) {
    basicstyles.push('underline');
    basicstylesPlugins.push('Underline');
    this.tags.push("u");
  }
  if (this.inTags("strike") || this.inTags("del") || this.inTags("s")) {
    basicstyles.push('strikethrough');
    basicstylesPlugins.push('Strikethrough');
    // Might make "strike" or "del" or both duplicated in the tag lists. Which
    // again doesn't really matter.
    this.tags.push("strike");
    this.tags.push("del");
    this.tags.push("s");
  }
  if (this.inTags("sub")) {
    basicstyles.push("subscript");
    basicstylesPlugins.push('Subscript');
  }
  if (this.inTags("sup")) {
    basicstyles.push("superscript");
    basicstylesPlugins.push('Superscript');
  }
  if (basicstyles.length > 0) {
    basicstyles.push('|', 'removeFormat');
    basicstylesPlugins.push('RemoveFormat');
    config.plugins.push(...basicstylesPlugins);
    config.toolbar.push(...basicstyles);
  }

  // Alignment is added to all wysiwygs
  config.plugins.push('Alignment');
  config.toolbar.push('|', 'alignment');

  // Paragraph styles
  const paragraph = [];
  const paragraphPlugins = [];
  if (this.inTags("ul") || this.inTags("ol")) {
    paragraphPlugins.push('List');
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
    paragraphPlugins.push('BlockQuote');
  }
  if (this.inButtons('language')) {
    this.tags.push('span');
    paragraph.push('textPartLanguage');
    paragraphPlugins.push('TextPartLanguage');
  }
  if (paragraph.length > 0) {
    config.plugins.push(...paragraphPlugins);
    config.toolbar.push(...paragraph);
  }

  // Links.
  if (this.inTags("a")) {
    const items = ["link"];
    config.plugins.push('Link', 'AutoLink');
    config.toolbar.push("|", ...items);
    config.link = {
      // Automatically add protocol if not present
      defaultProtocol: 'http://',
      // Give the author the option to choose how to open
      decorators: {
        openInNewTab: {
          mode: 'manual',
          label: ns.t('core', 'openInNewTab'),
          defaultValue: true,  // This option will be selected by default.
          attributes: {
            target: '_blank',
            rel: 'noopener noreferrer'
          }
        }
      }
    }
  }

  // Inserts
  const inserts = [];
  const insertsPlugins = [];
  if (this.inTags('img')) {
    // TODO: Include toolbar functionality to insert and edit images
    // For now, we just include the plugin to prevent data loss
    insertsPlugins.push('Image');
  }
  if (this.inTags("hr")) {
    inserts.push("horizontalLine");
    insertsPlugins.push('HorizontalLine');
  }
  if (this.inTags('code')) {
    if (this.inButtons('inlineCode')) {
      inserts.push('code');
      insertsPlugins.push('Code');
    }
    if (this.inTags('pre') && this.inButtons('codeSnippet')) {
      inserts.push('codeBlock');
      insertsPlugins.push('CodeBlock');
    }
  }
  if (inserts.length > 0) {
    config.toolbar.push("|", ...inserts);
  }
  if (insertsPlugins.length > 0) {
    config.plugins.push(...insertsPlugins);
  }

  if (this.inTags("table")) {
    config.toolbar.push("insertTable");
    config.plugins.push(
      'Table',
      'TableToolbar',
      'TableProperties',
      'TableCellProperties',
      'TableColumnResize',
      'TableCaption'
    );
    config.table = {
      contentToolbar: [
        'toggleTableCaption',
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties'
      ],
      tableProperties: {
        defaultProperties: {
          borderStyle: 'underline',
          borderWidth: '0.083em',
          borderColor: '#494949',
          padding: '0',
          alignment: 'left'
        }
      },
      tableCellProperties: {
        defaultProperties: {
          borderStyle: 'underline',
          borderWidth: '0.083em',
          borderColor: '#494949',
          padding: '1px'
        }
      }
    }
    ns.$.merge(this.tags, ["tr", "td", "th", "colgroup", "col", "thead", "tbody", "tfoot", "figure", "figcaption"]);
  }

  // Add dropdown to toolbar if formatters in tags (h1, h2, etc).
  const formats = [];
  for (let index = 1; index < 7; index++) {
    if (this.inTags('h' + index)) {
      formats.push({ model: 'heading' + index, view: 'h' + index, title: 'Heading ' + index, class: 'ck-heading_heading' + index });
    }
  }

  if (this.inTags('pre')) {
    formats.push({ model: 'formatted', view: 'pre', title: 'Formatted', class: 'ck-heading_formatted' });
  }

  // if (this.inTags("address")) formats.push("address"); // TODO: potential data loss
  if (formats.length > 0 || this.inTags('p') || this.inTags('div')) {
    // If the formats are shown, always have a paragraph
    formats.push({ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' });
    this.tags.push("p");
    this.field.enterMode = "p";
    config.heading = {options: formats};
    config.plugins.push('Heading');
    config.toolbar.push('heading');
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
    if (this.field.font.family) {
      styles.push('fontFamily');
      config.plugins.push('FontFamily');

      let fontFamilies = [
        'default',
        'Arial, Helvetica, sans-serif',
        'Comic Sans MS, Cursive, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif'
      ]

      // If custom fonts are set, use those
      if (this.field.font.family instanceof Array) {
        fontFamilies = ['default', ...this.field.font.family.map(font => (
          font.label + ', ' + font.css
        ))];
      }

      setValues(fontFamilies, 'fontFamily');
      config.fontFamily.supportAllValues = true;
    }

    // Font size chooser
    if (this.field.font.size) {
      styles.push('fontSize');
      config.plugins.push('FontSize');

      let fontSizes = [];
      const convertToEm = (percent) => parseFloat(percent) / 100 + 'em';

      if (this.field.font.size instanceof Array) {
        // Use specified sizes
        fontSizes = this.field.font.size.map(size => ({
          title: size.label,
          model: convertToEm(size.css)
        }));
      } else {
        // Standard font sizes that are available
        fontSizes = [
          'Default', '50%', '56.25%', '62.5%', '68.75%', '75%', '87.5%',
          '100%', '112.5%', '125%', '137.5%', '150%', '162.5%', '175%',
          '225%', '300%', '450%'
        ].map(percent => ({
          title: percent,
          model: percent === 'Default' ? '1em' : convertToEm(percent)
        }));
      }

      setValues(fontSizes, 'fontSize');
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
      config.plugins.push('FontColor');

      if (this.field.font.color instanceof Array) {
        config.fontColor = { colors: getColors(this.field.font.color) };
      }
    }

    // Text background color chooser
    if (this.field.font.background) {
      colors.push('fontBackgroundColor');
      config.plugins.push('FontBackgroundColor');

      if (this.field.font.background instanceof Array) {
        config.fontBackgroundColor = { colors: getColors(this.field.font.color) };
      }
    }

    // Add the text styling options
    if (styles.length) {
      config.toolbar.push(...styles);
    }
    if (colors.length) {
      config.toolbar.push(...colors);
    }
  }

  if (this.field.enterMode === 'p') {
    this.tags.push('p');
  }
  else {
    this.tags.push('div');

    // Without this, empty divs get deleted on init of cke
    config.plugins.push('GeneralHtmlSupport');
    config.htmlSupport = {
      allow: [{
        name: 'div',
        attributes: [
          /^aria-/i,
          'id'
        ],
        classes: true,
        styles: true
      }]
    };
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

  const supportedLanguages = [];
  for (const langCode in ns.supportedLanguages) {
    if (ns.supportedLanguages.hasOwnProperty(langCode)) {
      supportedLanguages.push({title: ns.supportedLanguages[langCode], languageCode: langCode});
    }
  }
  this.ckEditorConfig.language = {
    textPartLanguage: supportedLanguages,
    ui: ns.contentLanguage,
    content: ns.contentLanguage,
  };

  // Look for additions in HtmlAddons
  if (ns.HtmlAddons) {
    for (const tag in ns.HtmlAddons) {
      if (that.inTags(tag)) {
        for (const provider in ns.HtmlAddons[tag]) {
          ns.HtmlAddons[tag][provider](this.ckEditorConfig, that.tags);
        }
      }
    }
  }

  this.$input.focus(function () {
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

    that.inputWidth = that.$input[0].getBoundingClientRect().width;
    ns.Html.current = that;

    const config = that.ckEditorConfig;
    delete config.initialData;

    // Convert Latex to MathML if MathtType plugin is used!
    if (that.$input.html() && config.plugins.indexOf('MathType') !== -1) {
      let moreMassage = ns.Html.mathMassage('\\(', '\\)', 'service=latex2mathml&latex=', that.$input.html(), 2);
      config.initialData = ns.Html.mathMassage('\\[', '\\]', 'service=latex2mathml&latex=', moreMassage, 2);
    }

    ClassicEditor
      .create(this, config)
      .then(editor => {
        const getEditorHeight = () => {
          // Use the dimensions of the H5P iframe, not the editor iframe
          const { innerHeight, innerWidth } = window.parent;

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

          return (ratio * innerHeight * 0.85) + 'px';
        }

        that.ckeditor = editor;
        editor.ui.view.element.style.maxWidth = that.inputWidth + 'px';

        // Set height dynamically based on iframe height,
        // needs to use the change function since CKE overrides style settings
        editor.editing.view.change((writer) => {
          writer.setStyle(
              "max-height",
              getEditorHeight(),
              editor.editing.view.document.getRoot()
          );
        });

        // Readjust toolbar's grouped item dropdown panel,
        // since it can overflow the parent iframe element by using default positioning
        const dropdownPanel = editor.ui.view.toolbar._behavior.groupedItemsDropdown;
        dropdownPanel.panelPosition = 'auto';

        // Disable sticky toolbar, since it has problem within iframes
        editor.ui.view.stickyPanel.unbind('isActive');
        editor.ui.view.stickyPanel.isActive = false;

        // Remove overflow protection on startup
        let initialData = editor.getData();
        if (initialData.includes('<div class="table-overflow-protection"')) {
          initialData = initialData.replace(/<div class=\"table-overflow-protection\">.*<\/div>/, '');
          editor.setData(initialData);
        }

        // Mimic old enter_mode behaviour if not specifically set to 'p'
        if (that.field.enterMode !== 'p') {
          // Use <div> elements instead of <p>
          editor.conversion.for('downcast').elementToElement({
            model: 'paragraph',
            view: 'div',
            converterPriority: 'high'
          });
        }

        editor.editing.view.focus();

        editor.once('destroy', function () {
           // Close WIRIS
          if (window.WirisPlugin && WirisPlugin.currentInstance && WirisPlugin.currentInstance.core && WirisPlugin.currentInstance.core.modalDialog) {
            WirisPlugin.currentInstance.core.modalDialog.close(); // All changes are lost!
          }

          // We always need to run validate when removing CKE5 to have the .$input properly populated.
          // CKE5 cannot do this as the data has to be massaged/filtered before updating the .$input.
          const value = that.validate();
          delete that.ckeditor; // Prevent usage of destroyed CK beyond this point

          // Display placeholder if:
          // -- The value held by the field is empty AND
          // -- The value shown in the UI is empty AND
          // -- A placeholder is defined
          if (that.$placeholder.length !== 0 && (value === undefined || value.length === 0)) {
            that.$placeholder.appendTo(that.$item.find('.ckeditor'));
          }
        });

        function massageWirisDialog() {
          // Move modal dialog into attack pattern delta
          const modalDialog = WirisPlugin.currentInstance.core.modalDialog;
          const fieldRect = editor.ui.view.element.getBoundingClientRect();

          const y = (window.innerHeight - fieldRect.top) - modalDialog.properties.size.height - 40;
          modalDialog.setPosition(
            Math.max(y, 5),
            (window.innerWidth / 2) - (modalDialog.properties.size.width / 2)
          );

          // Prevent minimize
          modalDialog.minimizeDiv.style.visibility = 'hidden';
        }
        const mathTypeCommand = editor.commands.get('MathType');
        if (mathTypeCommand) {
          mathTypeCommand.on('execute', massageWirisDialog);
        }
        const chemTypeCommand = editor.commands.get('ChemType');
        if (chemTypeCommand) {
          chemTypeCommand.on('execute', massageWirisDialog);
        }
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
  // Add overflow protection if table
  if (this.field.tags.includes('table') && !input.includes('<div class="table-overflow-protection"')) {
    input += '<div class="table-overflow-protection"></div>';
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

  // Get contents from CKEditor5
  let value = this.ckeditor ? this.ckeditor.getData() : this.$input.html();

  if (this.ckEditorConfig.plugins.indexOf('MathType') !== -1) {
    // Convert mathml to latex
    value = ns.Html.mathMassage('<math', '</math>', 'service=mathml2latex&mml=', value, 0, '\\(', '\\)');
  }

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

  if (value.includes('<table') && !value.includes('<div class="table-overflow-protection"')) {
    value = value + '<div class="table-overflow-protection"></div>';
  }

  this.value = value;
  this.setValue(this.field, value);
  this.$input.html(value).change(); // Trigger change event.

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

(Html => {
  const cache = {};

  const wirisService = data => {
    if (cache[data] === undefined) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://www.wiris.net/demo/plugins/app/service', false);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
      xhr.send(data);

      cache[data] = JSON.parse(xhr.responseText).result.text;
    }

    return cache[data];
  };

  // Modern async version (can be used when editor support async getParams)
  //const wirisService = async data => {
  //  const response = await fetch('https://www.wiris.net/demo/plugins/app/service', {
  //    method: 'POST',
  //    headers: {
  //      'Content-Type': 'application/x-www-form-urlencoded'
  //    },
  //    body: data
  //  });
  //  return (await response.json()).result.text;
  //};

  // We need a converter to massage our html entities
  const leConverter = document.createElement('div');

  /**
   * Prepares value for conversion.
   *
   * @param {string} value
   * @param {number} chop How many characters to cut off at both ends.
   * @param {boolean} htmlToText Convert HTML entities to text
   * @returns {string} value
   */
  const preMassage = (value, chop, htmlToText) => {
    if (chop) { // Both ends are chopped off
      value = value.substring(chop, value.length - chop);
    }
    if (htmlToText) {
      leConverter.innerHTML = value;
      value = leConverter.innerText;
    }
    else {
      if (value.includes('<mstyle')) {
        // Hack: Adjust mstyle tags to be copatible with WIRIS converter as their CKEditor plugins strips most attributes (happens to xmlns etc. also)
        value = value.replace(/<mstyle((?![\s\S]*displaystyle)[\s\S]*?)>/g, '<mstyle displaystyle="true"$1>');
      }
      // Hack: Remove all block fillers from CKEditor (the WIRIS service don't like 'em)
      value = value.replace(/>&(nbsp|#160);<\//g, '></');
    }
    return encodeURIComponent(value);
  }

  /**
   * Massages the value after the conversion.
   *
   * @param {string} value
   * @param {string} prefix
   * @param {string} suffix
   * @returns {string} value
   */
  const postMassage = (value, prefix, suffix) => {
    if (prefix && suffix) {
      leConverter.innerText = value;
      value = prefix + leConverter.innerHTML + suffix;
    }
    return value;
  }

  const domParser = new DOMParser();

  Html.mathMassage = (prefix, suffix, service, value, chop = 0, wrapPrefix = '', wrapSuffix = '') => {
    // input could have several <math> elements - iterate over all
    let start = value.indexOf(prefix);
    while (start !== -1) {
      let end = value.indexOf(suffix, start + prefix.length);

      if (end !== -1) {
        let midfix = value.substring(start, end + suffix.length);
        let midfixDoc = domParser.parseFromString(midfix, 'text/html'); // TODO: Only run if wrapPrefix is true?
        let latexAnnotation = midfixDoc.querySelector('annotation[encoding=LaTeX]');

        if (latexAnnotation) {
          // Wiris MathType plugin produces a MathML element with an <annotation encoding="LaTeX">
          // child element containing the original LaTeX, when users are inputting using double $$.
          midfix = `$$${latexAnnotation.innerHTML}$$`;
          value = value.substring(0, start) + midfix + value.substring(end + suffix.length);
        }
        else if (wrapPrefix || (!wrapPrefix && Html.hasOnlySupportedLatexCommands(midfix))) {
          // Only send to Wiris if it should be translated back or is a supported command
          try {
            midfix = postMassage(wirisService(service + preMassage(midfix, chop, !wrapPrefix)), wrapPrefix, wrapSuffix);
          }
          catch (err) {
            console.error(err); // midfix will remain the same
          }
          value = value.substring(0, start) + midfix + value.substring(end + suffix.length);
        }

        start = value.indexOf(prefix, start + midfix.length - chop);
      }
      else {
        break; // if no matching suffix found, exit the loop
      }
    }

    return value;
  };

  Html.hasOnlySupportedLatexCommands = (value) => {
    let hasMatch = false;
    for (const match of value.matchAll(Html.wirisLatexCommandsRegex)) {
      hasMatch = true;
      if (!Html.wirisSupportedLatexCommands.has(match[0])) {
        return false;
      }
    }

    return hasMatch;
  };

  Html.wirisLatexCommandsRegex = /\\begin{[a-z]+}|\\[a-zA-Z]+|\\[!,:;~\\]|~/g;
  Html.wirisSupportedLatexCommands = new Set([
    '\\Alpha','\\And','\\Arrowvert','\\Bbb','\\Beta','\\Box','\\Bumpeq','\\Cap','\\Chi','\\Cup','\\Delta','\\Diamond','\\Doteq','\\Downarrow','\\Epsilon',
    '\\Eta','\\Finv','\\Game','\\Gamma','\\Huge','\\Im','\\Iota','\\Kappa','\\LARGE','\\Lambda','\\Large','\\Leftarrow','\\Leftrightarrow','\\Lleftarrow',
    '\\Longleftarrow','\\Longleftrightarrow','\\Longrightarrow','\\Lsh','\\Omega','\\Phi','\\Pi','\\Psi','\\Re','\\Rho','\\Rightarrow','\\Rrightarrow',
    '\\Rsh','\\S','\\Sigma','\\Subset','\\Supset','\\Tau','\\Theta','\\uparrow','\\updownarrow','\\upsilon','\\Vdash','\\Vert','\\Vvdash','\\xi','\\Zeta',
    '\\aleph','\\alpha','\\amalg','\\angle','\\approx','\\approxeq','\\arrowvert','\\ast','\\asymp','\\atop','\\backepsilon','\\backsim','\\backsimeq',
    '\\backslash','\\bar','\\barwedge','\\because','\\begin{array}','\\begin{bmatrix}','\\begin{displaymath}','\\begin{math}','\\begin{pmatrix}',
    '\\begin{vmatrix}','\\beta','\\beth','\\between','\\bf','\\bigcirc','\\bigstar','\\bigtriangledown','\\bigtriangleup','\\binom','\\blacklozenge',
    '\\blacksquare','\\blacktriangle','\\blacktriangledown','\\blacktriangleleft','\\blacktriangleright','\\bmod','\\boldsymbol','\\bot','\\bowtie',
    '\\boxdot','\\boxed','\\boxminus','\\boxplus','\\boxtimes','\\brace','\\bracevert','\\brack','\\buildrel','\\bullet','\\bumpeq','\\cal','\\cap','\\cdot',
    '\\cdotp','\\cdots','\\centerdot','\\cfrac','\\checkmark','\\chi','\\choose','\\circ','\\circeq','\\circlearrowleft','\\circlearrowright','\\circledR',
    '\\circledS','\\circledast','\\circledcirc','\\circleddash','\\clubsuit','\\colon','\\color','\\complement','\\cong','\\cos','\\cup','\\curlyeqprec',
    '\\curlyeqsucc','\\curlyvee','\\curlywedge','\\curvearrowleft','\\curvearrowright','\\dagger','\\daleth','\\dashleftarrow','\\dashrightarrow','\\dashv',
    '\\dbinom','\\ddagger','\\ddots','\\delta','\\dfrac','\\diagdown','\\diagup','\\diamond','\\diamondsuit','\\digamma','\\displaystyle','\\div',
    '\\divideontimes','\\dlsh','\\doteq','\\doteqdot','\\dotplus','\\dots','\\dotsb','\\dotsc','\\dotsi','\\dotsm','\\dotso','\\doublebarwedge','\\doublecap',
    '\\doublecup','\\downarrow','\\downdownarrows','\\downharpoonleft','\\downharpoonright','\\ell','\\emptyset','\\epsilon','\\eqcirc','\\eqsim',
    '\\eqslantgtr','\\eqslantless','\\equiv','\\eta','\\eth','\\exists','\\fallingdotseq','\\flat','\\forall','\\frac','\\frak','\\frown','\\gamma','\\ge',
    '\\geq','\\geqq','\\geqslant','\\gets','\\gg','\\ggg','\\gggtr','\\gimel','\\gnapprox','\\gneq','\\gneqq','\\gnsim','\\gt','\\gtrapprox','\\gtrdot',
    '\\gtreqless','\\gtreqqless','\\gtrless','\\gtrsim','\\gvertneqq','\\hat','\\hbar','\\hdashline','\\heartsuit','\\hline','\\hookleftarrow',
    '\\hookrightarrow','\\hslash','\\hspace','\\huge','\\iff','\\imath','\\impliedby','\\implies','\\in','\\infty','\\int','\\intercal','\\intop','\\iota',
    '\\it','\\jmath','\\kappa','\\lVert','\\lambda','\\land','\\langle','\\large','\\lbrace','\\lbrack','\\lceil','\\ldotp','\\ldots','\\le','\\left','\\leftarrow',
    '\\leftarrowtail','\\leftbarharpoon','\\leftharpoondown','\\leftharpoonup','\\leftleftarrows','\\leftrightarrow','\\leftrightarrows','\\leftrightharpoons',
    '\\leftrightsquigarrow','\\leftthreetimes','\\leq','\\leqq','\\leqslant','\\lessapprox','\\lessdot','\\lesseqgtr','\\lesseqqgtr','\\lessgtr','\\lesssim',
    '\\lfloor','\\lgroup','\\lhd','\\limits','\\ll','\\llcorner','\\lll','\\llless','\\lmoustache','\\lnapprox','\\lneq','\\lneqq','\\lnot','\\lnsim',
    '\\longleftarrow','\\longleftrightarrow','\\longmapsto','\\longrightarrow','\\looparrowleft','\\looparrowright','\\lor','\\lozenge','\\lrcorner',
    '\\ltimes','\\ltr','\\lvert','\\lvertneqq','\\maltese','\\mapsto','\\mathbb','\\mathbf','\\mathcal','\\mathfrak','\\mathit','\\mathrm','\\mathsf',
    '\\mathtt','\\mbox','\\measuredangle','\\mho','\\mid','\\mod','\\models','\\mp','\\mu','\\multimap','\\nLeftarrow','\\nLeftrightarrow','\\nRightarrow',
    '\\nVDash','\\nVdash','\\nabla','\\natural','\\ncong','\\ne','\\nearrow','\\neg','\\neq','\\neswarrow','\\newline','\\nexists','\\ni','\\nicefrac',
    '\\nleftarrow','\\nleftrightarrow','\\nmid','\\nolimits','\\normalsize','\\not','\\notin','\\nparallel','\\nprec','\\npreceq','\\nrightarrow',
    '\\nshortmid','\\nshortparallel','\\nsim','\\nsubseteq','\\nsucc','\\nsupseteq','\\ntriangleleft','\\ntrianglelefteq','\\ntriangleright',
    '\\ntrianglerighteq','\\nu','\\nvDash','\\nvdash','\\nwarrow','\\nwsearrow','\\odot','\\of','\\omega','\\omicron','\\ominus','\\operatorname',
    '\\oplus','\\oslash','\\otimes','\\over','\\overbrace','\\overbracket','\\overleftarrow','\\overleftrightarrow','\\overline','\\overrightarrow',
    '\\overset','\\owns','\\parallel','\\partial','\\perp','\\phi','\\pi','\\pitchfork','\\pm','\\pmod','\\prec','\\precapprox','\\preccurlyeq','\\preceq',
    '\\precnapprox','\\precneqq','\\precnsim','\\precsim','\\prime','\\prod','\\propto','\\psi','\\rVert','\\rangle','\\rbrace','\\rbrack','\\rceil',
    '\\restriction','\\rfloor','\\rgroup','\\rhd','\\rho','\\right','\\rightarrow','\\rightarrowtail','\\rightbarharpoon','\\rightharpoondown','\\rightharpoonup',
    '\\rightleftarrows','\\rightleftharpoons','\\rightrightarrows','\\rightsquigarrow','\\rightthreetimes','\\risingdotseq','\\rm','\\rmoustache',
    '\\root','\\rtimes','\\rtl','\\rvert','\\scriptscriptstyle','\\scriptsize','\\scriptstyle','\\searrow','\\setminus','\\sf','\\sharp','\\shortmid',
    '\\shortparallel','\\sideset','\\sigma','\\sim','\\simeq','\\sin','\\small','\\smile','\\spadesuit','\\sphericalangle','\\sqcap','\\sqcup','\\sqrt',
    '\\sqsubset','\\sqsubseteq','\\sqsupset','\\sqsupseteq','\\square','\\stackrel','\\star','\\style','\\subset','\\subseteq','\\subseteqq','\\subsetneq',
    '\\subsetneqq','\\succ','\\succapprox','\\succcurlyeq','\\succeq','\\succnapprox','\\succneqq','\\succnsim','\\succsim','\\sum','\\supset','\\supseteq',
    '\\supseteqq','\\supsetneq','\\supsetneqq','\\surd','\\swarrow','\\tau','\\tbinom','\\text','\\textbf','\\textit','\\textrm','\\textsterling','\\textstyle',
    '\\tfrac','\\therefore','\\theta','\\times','\\tiny','\\to','\\top','\\triangle','\\triangledown','\\triangleleft','\\trianglelefteq','\\triangleq',
    '\\triangleright','\\tt','\\twoheadleftarrow','\\twoheadrightarrow','\\ulcorner','\\underbrace','\\underbracket','\\underleftarrow',
    '\\underleftrightarrow','\\underrightarrow','\\underset','\\unlhd','\\uparrow','\\updownarrow','\\upharpoonleft','\\upharpoonright','\\uplus',
    '\\upsilon','\\upslopeellipsis','\\upuparrows','\\urcorner','\\vDash','\\varepsilon','\\varkappa','\\varnothing','\\varphi','\\varpi','\\varrho',
    '\\varsigma','\\vartheta','\\vartriangle','\\vartriangleleft','\\vartriangleright','\\vdash','\\vdots','\\vee','\\veebar','\\vert','\\wedge','\\wp',
    '\\wr','\\xLeftrightarrow','\\xLongleftarrow','\\xLongleftrightarrow','\\xLongrightarrow','\\xcancel','\\xi','\\xleftarrow','\\xleftrightarrow',
    '\\xlongequal','\\xlongleftarrow','\\xlongleftrightarrow','\\xlongrightarrow','\\xrightarrow','\\yen','\\zeta', '\\quad', '\\qquad', '\\;', '\\\\',
    '\\!', '\\,', '\\:', '~', '\\~'
  ]);

})(ns.Html);

ns.widgets.html = ns.Html;
