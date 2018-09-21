/**
 * Creates a metadata form
 *
 * @param {object} field
 * @param {object} metadata params for the metadata fields
 * @param {jQuery} $container Container.
 * @param {mixed} parent used in processSemanticsChunk().
 * @param {object} options Options.
 * @param {boolean} [options.populateTitle] If true, will populate the title if empty.
 */
H5PEditor.metadataForm = function (field, metadata, $container, parent, options) {
  options = options || {};

  var $ = H5PEditor.$;

  var semantics = H5PEditor.metadataSemantics;
  var fields = {};
  semantics.forEach(function (field) {
    fields[field.name] = field;
  });

  var currentUserName = (H5PIntegration.user && H5PIntegration.user.name) ? H5PIntegration.user.name : undefined;

  // Set author as defaults in semantics
  if (currentUserName) {
    // Set current user as default for "changed by":
    fields['changes'].field.fields[1].default = currentUserName;
    fields['authors'].field.fields[0].default = currentUserName;
  }

  var $wrapper = $('' +
  '<div class="h5p-editor-dialog h5p-dialog-wide h5p-metadata-wrapper">' +
    '<div class="h5p-metadata-header">' +
      '<div class="h5p-title-container">' +
        '<h2>' + H5PEditor.t('core', 'metadataSharingAndLicensingInfo') + '</h2>' +
        '<p>' + H5PEditor.t('core', 'fillInTheFieldsBelow') + '</p>' +
      '</div>' +
      '<div class="metadata-button-wrapper">' +
        '<button href="#" class="h5p-metadata-button h5p-save">' + H5PEditor.t('core', 'saveMetadata') + '</button>' +
      '</div>' +
    '</div>' +
  '</div>');

  var $fieldsWrapper = $('<div>', {
    'class': 'h5p-metadata-fields-wrapper',
    appendTo: $wrapper
  });

  var setupTitleField = function () {
    // Select title field text on click
    var titleField = H5PEditor.findField('title', parent);
    titleField.$input.click(function () {
      if (this.selectionStart === 0 && this.selectionEnd === this.value.length) {
        return;
      }
      this.select();
      this.setSelectionRange(0, this.value.length); // Safari mobile fix
    });

    // Set the default title
    if (!metadata.title && options.populateTitle) {
      titleField.$input.val(H5PEditor.LibraryListCache.getDefaultTitle(parent.currentLibrary));
    }
  };

  var setupLicenseField = function () {
    // Locate license and version selectors
    var licenseField = H5PEditor.findField('license', parent);
    var versionField = H5PEditor.findField('licenseVersion', parent);
    versionField.field.optional = true; // Avoid any error messages

    // Listen for changes to license
    licenseField.changes.push(function (value) {
      // Find versions for selected value
      function getNestedOptions(options) {
        var flattenedOptions = [];
        options.forEach(function (option) {
          if (option.type === 'optgroup') {
            flattenedOptions = flattenedOptions.concat(getNestedOptions(option.options));
          }
          else {
            flattenedOptions.push(option);
          }
        });
        return flattenedOptions;
      }

      var nestedOptions = getNestedOptions(licenseField.field.options);
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
      var selected = (metadata.license === value && metadata ? metadata.licenseVersion : versions[0].value);

      // Update versions selector
      versionField.$select.html(H5PEditor.Select.createOptionsHtml(versions, selected)).change();
    });

    // Trigger update straight away
    licenseField.changes[licenseField.changes.length - 1](metadata.license);
  };

  var setupSourceField = function () {
    // Make sure the source field is empty or starts with a protocol
    const sourceField = H5PEditor.findField('source', parent);
    sourceField.$item.on('change', function () {
      const sourceInput = $(this).find('input.h5peditor-text');
      if (sourceInput.val().trim() !== '' &&
        sourceInput.val().indexOf('https://') !== 0 &&
        sourceInput.val().indexOf('http://') !== 0
      ) {
        sourceInput.val('http://' + sourceInput.val()).trigger('change');
      }
    });
  };

  var children = parent.children;

  // Create the first fields:
  H5PEditor.processSemanticsChunk([
    fields['title'],
    fields['license'],
    fields['licenseVersion'],
    fields['yearFrom'],
    fields['yearTo'],
    fields['source']
  ], metadata, $fieldsWrapper, parent);
  children = children.concat(parent.children);

  setupTitleField();
  setupLicenseField();
  setupSourceField();

  // Append the metadata author list widget
  var metadataAuthorWidget = H5PEditor.metadataAuthorWidget(fields['authors'].field.fields, metadata, $fieldsWrapper, parent);
  children = children.concat(parent.children);

  // Append the License Extras field
  H5PEditor.processSemanticsChunk([fields['licenseExtras']], metadata, $fieldsWrapper, parent);
  children = children.concat(parent.children);

  // Append the metadata changelog widget
  H5PEditor.metadataChangelogWidget([fields['changes'].field], metadata, $fieldsWrapper, parent);
  children = children.concat(parent.children);

  // Append the Additional information group
  var additionals = new H5PEditor.widgets.group(parent, {
    name: 'additionals',
    label: 'Additional information',
    fields: [
      fields['authorComments']
    ]
  }, metadata.authorComments, function (field, value) {
    metadata.authorComments = value;
  });
  additionals.appendTo($fieldsWrapper);

  parent.children = children.concat([additionals]);

  // Handle click on save button
  $wrapper.find('.h5p-save').click(function () {
    // If license selected, and there's no authors, add the current one
    if (metadata.license !== 'U' && metadata.authors.length === 0) {
      metadataAuthorWidget.addAuthor(currentUserName, 'Author');
    }

    $wrapper.toggleClass('h5p-open');
    $container.closest('.h5peditor-form').find('.overlay').toggle();
  });

  return $wrapper.appendTo($container);
};

/**
 * Help find object in list with the given property value.
 *
 * @param {Object[]} list of objects to search through
 * @param {string} property to look for
 * @param {string} value to match property value against
 */
function find(list, property, value) {
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
