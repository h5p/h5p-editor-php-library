var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

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
  this.field = field;
  this.value = params;
  this.setValue = setValue;
  this.tags = ns.$.merge(['br'], (this.field.tags || this.defaultTags));
};

ns.Html.prototype.defaultTags = ['strong', 'em', 'del', 'h1', 'h2', 'a', 'ul', 'ol', 'img', 'table'];

ns.Html.prototype.inTags = function (value) {
  return (ns.$.inArray(value.toLowerCase(), this.tags) >= 0);
};

ns.Html.prototype.createToolbar = function () {
  var basicstyles = [];
  var paragraph = [];
  var formats = [];
  var inserts = [];
  var toolbar = [];

  // Basic styles
  if (this.inTags("strong") || this.inTags("b")) {
    basicstyles.push('Bold');
    // Might make "strong" duplicated in the tag lists. Which doesn't really
    // matter. Note: CKeditor will only make strongs.
    this.tags.push("strong");
  }
  if (this.inTags("em") || this.inTags("i")) {
    basicstyles.push('Italic');
    // Might make "em" duplicated in the tag lists. Which again
    // doesn't really matter. Note: CKeditor will only make ems.
    this.tags.push("em");
  }
  if (this.inTags("u")) basicstyles.push('Underline');
  if (this.inTags("strike") || this.inTags("del")) {
    basicstyles.push('Strike');
    // Might make "strike" or "del" or both duplicated in the tag lists. Which
    // again doesn't really matter.
    this.tags.push("strike");
    this.tags.push("del");
  }
  if (this.inTags("sub")) basicstyles.push("Subscript");
  if (this.inTags("sup")) basicstyles.push("Superscript");
  if (basicstyles.length > 0) {
    basicstyles.push("-");
    basicstyles.push("RemoveFormat");
    toolbar.push({
      name: 'basicstyles',
      items: basicstyles
    });
  }

  // Paragraph styles
  if (this.inTags("ul")) {
    paragraph.push("BulletedList");
    this.tags.push("li");
  }
  if (this.inTags("ol")) {
    paragraph.push("NumberedList");
    this.tags.push("li");
  }
  if (this.inTags("blockquote")) paragraph.push("Blockquote");
  if (paragraph.length > 0) {
    toolbar.push(paragraph);
  }

  // Links.
  if (this.inTags("a")) {
    toolbar.push({
      name: "links",
      items: ["Link", "Unlink", "Anchor"]
    });
  }

  // Inserts
  if (this.inTags("img")) inserts.push("Image");
  if (this.inTags("table")) {
    inserts.push("Table");
    ns.$.merge(this.tags, ["tr", "td", "th", "colgroup", "thead", "tbody", "tfoot"]);
  }
  if (this.inTags("hr")) inserts.push("HorizontalRule");
  if (inserts.length > 0) {
    toolbar.push({
      name: "insert",
      items: inserts
    });
  }

  // Add format group if formatters in tags (h1, h2, etc). Formats use their
  // own format_tags to filter available formats.
  if (this.inTags("h1")) formats.push("h1");
  if (this.inTags("h2")) formats.push("h2");
  if (this.inTags("h3")) formats.push("h3");
  if (this.inTags("h4")) formats.push("h4");
  if (this.inTags("h5")) formats.push("h5");
  if (this.inTags("h6")) formats.push("h6");
  if (this.inTags("address")) formats.push("address");
  if (this.inTags("pre")) formats.push("pre");
  if (formats.length > 0 || this.inTags('p') || this.inTags('div')) {
    formats.push("p");   // If the formats are shown, always have a paragraph..
    this.tags.push("p");
    formats.push("div"); // ..and a plain old div.
    this.tags.push("div");
    toolbar.push({
      name: "styles",
      items: ['Format']
    });
  }

  var ret = {
    toolbar: toolbar
  }
  // Set format_tags if not empty. CKeditor does not like empty format_tags.
  if (formats.length > 0) {
    ret['format_tags'] = formats.join(';');
  }
  return ret;
};

/**
 * Append field to wrapper.
 * 
 * @param {type} $wrapper
 * @returns {undefined}
 */
ns.Html.prototype.appendTo = function ($wrapper) {
  var that = this;

  this.$item = ns.$(ns.createItem(this.field.type, this.createHtml())).appendTo($wrapper);
  this.$input = this.$item.children('.ckeditor');
  this.$errors = this.$item.children('.errors');

  var ckConfig = {
    extraPlugins: "",
    forcePasteAsPlainText: true,
    enterMode: CKEDITOR.ENTER_DIV,
    protectedSource: []
  };
  ns.$.extend(ckConfig, this.createToolbar());

  // Look for additions in HtmlAddons
  if (ns.HtmlAddons) {
    for (var tag in ns.HtmlAddons) {
      if (that.inTags(tag)) {
        for (var provider in ns.HtmlAddons[tag]) {
          ns.HtmlAddons[tag][provider](ckConfig, that.tags);
        }
      }
    }
  }

  this.$item.children('.ckeditor').click(function () {
    if (! ns.$(this).hasClass('cke_editable')) {
      that.ckeditor = CKEDITOR.inline(this, ckConfig);
      that.ckeditor.on('change', function () {
        // Validate before submit.
        var value = that.validate();
        if (value !== false) {
          that.setValue(that.field, value);
        }
      });
      that.ckeditor.on('blur', function () {
        // When blurred, remove completely.
        this.destroy();
      });
    }
  });
};

/**
 * Create HTML for the HTML field.
 */
ns.Html.prototype.createHtml = function () {
  var html = '<label>';

  if (this.field.label !== undefined) {
    html += '<span class="label">' + this.field.label + '</span>';
  }
  html += '</label>';

  html += '<div class="ckeditor" contenteditable="true"';
  if (this.field.description !== undefined) {
    html += ' title="' + this.field.description + '" placeholder="' + this.field.description + '"';
  }
  html += '>';

  if (this.value !== undefined) {
    html += this.value;
  }
  html += '</div>';

  return html;
};

/**
 * Validate the current text field.
 */
ns.Html.prototype.validate = function () {
  var that = this;
  if (that.$errors.children().length) {
    that.$errors.empty();
  }

  // Get contents from editor
  var value = this.ckeditor !== undefined ? this.ckeditor.getData() : this.$input.html();

  var $value = ns.$('<div/>');
  if (value) { // Appending an empty object fails..
    $value.append($(value));
  }
  var textValue = $value.text();

  // Check if we have any text at all.
  if (!this.field.optional && !textValue.length) {
    // We can accept empty text, if there's an image instead.
    if (! (this.inTags("img") && $value.find('img').length > 0)) {
      this.$errors.append(ns.createError(this.field.label + ' is required and must have some text or at least an image in it.'));
    }
  }

  // Verify HTML tags.  Removes tags not in allowed tags.  Will replace with
  // the tag's content.  So if we get an unallowed container, the contents
  // will remain, without the container.
  $value.find('*').each(function () {
    if (! that.inTags(this.tagName)) {
      ns.$(this).replaceWith(ns.$(this).contents());
    }
  });
  value = $value.html();

  // Display errors and bail if set.
  if (that.$errors.children().length) {
    return false;
  }

  return value;
};

/**
 * Remove this item.
 */
ns.Html.prototype.remove = function () {
  this.$item.remove();
};

ns.widgets.html = ns.Html;