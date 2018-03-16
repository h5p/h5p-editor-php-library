/*global H5P*/
var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

var MOCKED_SEMANTICS = [
  {
    label: "Content title",
    description: "Used for metadata",
    name: "contentTitle",
    type: "text",
    importance: "high"
  }
];

H5PEditor.metadataForm = function (field, params, $container, parent) {
  var self = this;
  self.field = field;
  self.params = params;
  self.parent = parent;

  var $wrapper = H5PEditor.$('<div class="h5p-editor-dialog h5p-dialog-wide h5p-metadata-title">' +
  '<h2>Metadata (sharing and licensing info)</h2>' +
  '<p>Fill in the fields below</p>' +
  '<div class="metadata-button-wrapper">' +
    '<a href="#" class="h5p-cancel">Cancel</a>' +
    '<a href="#" class="h5p-cancel"> Save Metadata</a>' +
  '</div>' +
  '<a href="#" class="h5p-close" title="Close"></a>' +
  '</div>');

  $wrapper.find('.h5p-cancel').click(function () {
    $wrapper.toggleClass('h5p-open');
  });

  $wrapper.find('.h5p-close').click(function () {
    $wrapper.toggleClass('h5p-open');
  });

  /**
   * Help find object in list with the given property value.
   *
   * @param {Object[]} list of objects to search through
   * @param {string} property to look for
   * @param {string} value to match property value against
   */
  var find = function (list, property, value) {
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

  var group = new H5PEditor.widgets.group(field, getCopyrightSemantics(), self.params, setCopyright);
  group.appendTo($wrapper);
  group.expand();
  group.$group.find('.title').remove();
  field.children = [group];

  // Locate license and version selectors
  var licenseField = find(group.children, 'field.name', 'license');
  var versionField = find(group.children, 'field.name', 'version');
  versionField.field.optional = true; // Avoid any error messages

  // Listen for changes to license
  licenseField.changes.push(function (value) {
    // Find versions for selected value
    var option = find(licenseField.field.options, 'value', value);
    var versions = option.versions;

    versionField.$select.prop('disabled', versions === undefined);
    if (versions === undefined) {
      // If no versions add default
      versions = [{
        value: '-',
        label: '-'
      }];
    }

    // Find default selected version
    var selected = (self.params.license === value &&
                    self.params ? self.params.version : versions[0].value);

    // Update versions selector
    versionField.$select.html(H5PEditor.Select.createOptionsHtml(versions, selected)).change();
  });

  // Trigger update straight away
  licenseField.changes[licenseField.changes.length - 1](self.params.license);

  var test = {}

  H5PEditor.metadataAuthorWidget(test, group, this.parent);
  self.params.authors = test;

  function setCopyright(field, value) {
    // console.log(field, value, 'field, value');
    self.params = value;
  }

  function setMetadataAuthors(value) {
    this.params.authors = value;
  }

  $wrapper.appendTo($container);
}

function getCopyrightSemantics() {

  var ccVersions = [
    {
      'value': '4.0',
      'label': '4.0 International'
    },
    {
      'value': '3.0',
      'label': '3.0 Unported'
    },
    {
      'value': '2.5',
      'label': '2.5 Generic'
    },
    {
      'value': '2.0',
      'label': '2.0 Generic'
    },
    {
      'value': '1.0',
      'label': '1.0 Generic'
    }
  ]

  return {
    'name': 'copyright',
    'type': 'group',
    'label': 'Copyright information',
    'fields': [
      {
        'name' : 'title',
        'type' : 'text',
        'label' : 'Title',
        'placeholder' : 'NDLA Content',
        'optional' : true
      },
      {
        'name' : 'license',
        'type' : 'select',
        'label' : 'License',
        'default' : 'U',
        'options' : [
          {
            'value' : 'U',
            'label' : 'Undisclosed'
          },
          {
            'value' : 'CC BY',
            'label' : 'Attribution 4.0',
            'versions': ccVersions
          },
          {
            'value' : 'CC BY-SA',
            'label' : 'Attribution-ShareAlike 4.0'
          },
          {
            'value' : 'CC BY-ND',
            'label' : 'Attribution-NoDerivs 4.0'
          },
          {
            'value' : 'CC BY-NC',
            'label' : 'Attribution-NonCommercial 4.0'
          },
          {
            'value' : 'CC BY-NC-SA',
            'label' : 'Attribution-NonCommercial-ShareAlike 4.0'
          },
          {
            'value' : 'CC BY-NC-ND',
            'label' : 'Attribution-NonCommercial-NoDerivs 4.0'
          },
          {
            'value' : 'GNU GPL',
            'label' : 'General Public License v3'
          },
          {
            'value' : 'PD',
            'label' : 'Public Domain'
          },
          {
            'value' : 'ODC PDDL',
            'label' : 'Public Domain Dedication and Licence'
          },
          {
            'value' : 'CC PDM',
            'label' : 'Public Domain Mark'
          },
          {
            'value' : 'C',
            'label' : 'Copyright'
          }
        ]
      },
      {
        'name': 'version',
        'type': 'select',
        'label': 'License Version',
        'options': []
      },
      {
        'name' : 'yearFrom',
        'type' : 'text',
        'label' : 'Years (from-to)',
        'placeholder' : '1503',
        'optional' : true
      },
      {
        'name' : 'yearTo',
        'label' : ' ',
        'type' : 'text',
        'placeholder' : '1593',
        'optional' : true
      },
      {
        'name' : 'source',
        'type' : 'text',
        'label' : 'Source',
        'placeholder' : 'http://en.wikipedia.org/wiki/Mona_Lisa',
        'optional' : true,
        'regexp' : {
          'pattern' : '^http[s]?://.+',
          'modifiers' : 'i'
        }
      }
    ]
  };
}
