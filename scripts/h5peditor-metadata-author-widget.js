/*global H5P*/
var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

var MOCKED_SEMANTICS = [
  {
    label: "Author's name",
    description: "Used for metadata",
    name: "authorName",
    type: "text"
  },
  {
    "name": "authorRole",
    "type": "select",
    "label": "Author's role",
    "options": [
      {
        "value": "Designer",
        "label": "Designer"
      },
      {
        "value": "Illustrator",
        "label": "Illustrator"
      },
      {
        "value": "Photographer",
        "label": "Photographer"
      }
    ],
    default: "first"
  }
];

var AUTHORS = [
  {
    name: 'Thomas Marstrander',
    role: 'Photographer'
  },
  {
    name: 'Frode Petterson',
    role: 'Illustrator'
  }
]

/**
 * Adds an image upload field with image editing tool to the form.
 *
 * @param {Object} parent Parent widget of this widget
 * @param {Object} field Semantic fields
 * @param {Object} params Existing image parameters
 * @param {function} setValue Function for updating parameters
 * @returns {ns.widgets.image}
 */
H5PEditor.metadataAuthorWidget = function (params, group, parent) {

  params.authors = AUTHORS;

  var widget = H5PEditor.$('<div></div>');

  ns.processSemanticsChunk(MOCKED_SEMANTICS, {}, widget, parent);

  var button = H5PEditor.$('<div class="file authorList">' +
    '<a class="add">' +
      '<div class="h5peditor-field-file-upload-text">Add author</div>' +
    '</a>' +
  '</div>')
  .click(function () {
    addAuthor();
  });
  
  widget.append(button);

  var authorListWrapper = H5PEditor.$('<div class="h5p-author-list-wrapper"><ul class="h5p-author-list"></ul></div>');
  widget.append(authorListWrapper);
  renderAuthorList();

  widget.appendTo(group.$group.find('.content'))

  function addAuthor() {
    var authorNameInput = (widget.find('.field-name-authorName')).find('input');
    var authorRoleInput = (widget.find('.field-name-authorRole')).find('select');

    // TODO better validation
    if (authorNameInput.val().trim() == '') {
      return;
    }

    AUTHORS.push({
      name: authorNameInput.val(),
      role: authorRoleInput.val()
    })
    renderAuthorList();
    params.authors = AUTHORS;
    authorNameInput.val(' ');
    authorRoleInput.val(1);
  }

  function removeAuthor(author) {
    AUTHORS = AUTHORS.filter(function(e) {
      return e !== author
    })
    renderAuthorList();
    params.authors = AUTHORS;
  }

  function renderAuthorList() {
    var wrapper = widget.find('.h5p-author-list-wrapper');
    wrapper.empty();

    authorList = H5PEditor.$('<ul></ul>');
    AUTHORS.forEach(function(author) {
      var listItem = H5PEditor.$('<li>' + author.name + ' <span>' + author.role + '</span></li>').data('author', author);
      listItem.append('<button>x</button>').click(function() {
        removeAuthor(H5PEditor.$(this).data().author)
      })
      authorList.append(listItem);
    });

    wrapper.append(authorList);
  }
}
