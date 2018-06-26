/*global H5P*/
var H5PEditor = H5PEditor || {};
var H5PIntegration = H5PIntegration || false;
var ns = H5PEditor;

/**
 * Creates a metadata form
 *
 * @param {object} field
 * @param {object} metadata params for the metadata fields
 * @param {jQuery} $container Container.
 * @param {mixed} parent used in processSemanticsChunk().
 * @param {jQuery} [$syncField] Input field to sync with.
 * @returns {ns.Coordinates}
 */
H5PEditor.metadataForm = function (field, metadata, $container, parent, $syncField) {
  const that = this;
  /*
   * TODO: Is there a decent way to make this a "real class" that can be used?
   *       Changing all the fields by using a DOM selector here and in other
   *       source files feels very wrong.
   */
  var self = this;
  self.field = field;
  self.metadata = metadata;
  self.parent = parent;

  // Set default title, but not for main content
  if (!self.metadata.title || self.metadata.title === '') {
    self.metadata.title = H5PEditor.t('core', 'untitled') + ' ' + H5PEditor.parent.currentLibrary.split(' ')[0].split('.')[1];
  }

  self.metadataSemantics = Object.keys(H5PEditor.metadataSemantics).map(function (item) {
    return H5PEditor.metadataSemantics[item];
  });

  var $wrapper = H5PEditor.$('' +
  '<div class="h5p-editor-dialog h5p-dialog-wide h5p-metadata-wrapper">' +
    '<div class="h5p-metadata-header">' +
      '<div class="h5p-title-container">' +
        '<h2>' + H5PEditor.t('core', 'metadataSharingAndLicensingInfo') + '</h2>' +
        '<p>' + H5PEditor.t('core', 'fillInTheFieldsBelow') + '</p>' +
      '</div>' +
      '<div class="metadata-button-wrapper">' +
        '<a href="#" class="h5p-metadata-button h5p-save">' + H5PEditor.t('core', 'saveMetadata') + '</a>' +
      '</div>' +
    '</div>' +
  '</div>');

  // Create a group to handle the copyright data
  function setCopyright(field, value) {
    self.metadata = value;
  }
  var group = new H5PEditor.widgets.group(field, getPartialSemantics('copyright'), self.metadata, setCopyright);
  group.appendTo($wrapper);
  group.expand();

  group.$group.find('.title').remove();
  group.$group.find('.content').addClass('copyright-form');
  field.children = [group];

  // Locate license and version selectors
  this.licenseField = find(group.children, 'field.name', 'license');
  var versionField = find(group.children, 'field.name', 'licenseVersion');
  versionField.field.optional = true; // Avoid any error messages

  // Listen for changes to license
  this.licenseField.changes.push(function (value) {
    // Find versions for selected value
    function getNestedOptions(options) {
      var flattenedOptions = [];
      options.forEach(function(option) {
        if (option.type === 'optgroup') {
          flattenedOptions = flattenedOptions.concat(getNestedOptions(option.options));
        }
        else {
          flattenedOptions.push(option);
        }
      });
      return flattenedOptions;
    }

    var nestedOptions = getNestedOptions(that.licenseField.field.options);
    var option = find(nestedOptions, 'value', value);
    var versions = (option) ? option.versions : undefined;

    versionField.$select.prop('disabled', versions === undefined);
    if (versions === undefined) {
      // If no versions add default
      versions = [{
        value: '-',
        label: '-'
      }];
    }

    // Find default selected version
    var selected = (self.metadata.license === value &&
                    self.metadata ? self.metadata.licenseVersion : versions[0].value);

    // Update versions selector
    versionField.$select.html(H5PEditor.Select.createOptionsHtml(versions, selected)).change();
  });

  // Trigger update straight away
  this.licenseField.changes[this.licenseField.changes.length - 1](self.metadata.license);

  // Make sure the source field is empty or starts with a protocol
  const sourceField = find(group.children, 'field.name', 'source');
  sourceField.$item.on('change', function() {
    const sourceInput = H5PEditor.$(this).find('input.h5peditor-text');
    if (sourceInput.val().trim() !== '' &&
      sourceInput.val().indexOf('https://') !== 0 &&
      sourceInput.val().indexOf('http://') !== 0
    ) {
      sourceInput.val('https://' + sourceInput.val()).trigger('change');
    }
  });

  // Create and append the rest of the widgets and fields
  // Append the metadata author list widget
  this.$addAuthorButton = H5PEditor.metadataAuthorWidget(getPartialSemantics('authorWidget').fields, self.metadata, group, this.parent);

  // Append the additional license field
  var widget = H5PEditor.$('<div class="h5p-metadata-license-extras"></div>');
  ns.processSemanticsChunk([getPartialSemantics('licenseExtras')], self.metadata, widget, this.parent);
  widget.appendTo(group.$group.find('.content.copyright-form'));

  // Append the metadata changelog widget
  H5PEditor.metadataChangelogWidget([getPartialSemantics('changeLog')], self.metadata, group, this.parent);

  // Append the additional information field
  var $widget = H5PEditor.$('<div class="h5p-metadata-additional-information"></div>');
  ns.processSemanticsChunk([getPartialSemantics('authorComments')], self.metadata, $widget, this.parent);
  $widget.appendTo(group.$group.find('.content.copyright-form'));

  $wrapper.find('.h5p-save').click(function () {
    // Automatically store author if a license is set
    if (that.licenseField.value !== 'U') {
      that.$addAuthorButton.click();
    }

    $wrapper.toggleClass('h5p-open');
    $container.closest('.tree').find('.overlay').toggle();
  });

  // Sync title field with other field
  if ($syncField) {
    sync(
      group.$group.find('.field.field-name-title.text').find('input.h5peditor-text'), // title field
      $syncField
    );
  }

  // Set author of main content.
  // TODO: Add realName to H5PIntegration
  if (
    H5PIntegration && H5PIntegration.user && H5PIntegration.user.name
  ) {
    $wrapper
      .find('.h5p-author-data')
      .find('.field-name-name')
      .find('input.h5peditor-text')
      .val(H5PIntegration.user.name);
  }

  // Select title field text on click
  $wrapper.find('.field-name-title').find('.h5peditor-text').on('click', function () {
    this.select();
    this.setSelectionRange(0, this.value.length); // Safari mobile fix
  });

  $wrapper.appendTo($container);

  function getPartialSemantics(selector) {
    return find(self.metadataSemantics, 'name', selector);
  }
};

/**
 * Sync two input fields. Empty fields will take value of the other or be set to ''.
 * master fields takes precedence if both are set already.
 *
 * @param {jQuery} $masterField - Master field that holds the value for initialization.
 * @param {jQuery} $slaveField - Slave field to be synced with.
 * @param {string} [defaultText] - Default text if fields are empty.
 */
 function sync ($masterField, $slaveField, defaultText) {
  if (!$masterField || !$slaveField) {
    return;
  }

  const listenerName = 'input.metadataSync';

  // Remove old sync
  $masterField.off(listenerName);
  $slaveField.off(listenerName);

  // Initialize fields
  if ($masterField.val()) {
    $slaveField
      .val($masterField.val())
      .trigger('change');
  }
  else if ($slaveField.val()) {
    $masterField
      .val($slaveField.val())
      .trigger('change');
  }
  else {
    $masterField
      .val(defaultText || '')
      .trigger('change');
    $slaveField
      .val(defaultText || '')
      .trigger('change');
  }

  // Keep fields in sync
  $masterField.on(listenerName, function() {
    $slaveField
      .val($masterField.val())
      .trigger('change');
  });
  $slaveField.on(listenerName, function() {
    $masterField
      .val($slaveField.val())
      .trigger('change');
  });
}

/**
 * Help find object in list with the given property value.
 *
 * @param {Object[]} list of objects to search through
 * @param {string} property to look for
 * @param {string} value to match property value against
 */
function find (list, property, value) {
  var properties = property.split('.');

  for (var i = 0; i < list.length; i++) {
    var objProp = list[i];

    for (var j = 0; j < properties.length; j++) {
      objProp = objProp[properties[j]];
    }

    if (objProp === value) {
      return list[i];
    }
  }
}
