/*global H5P*/
var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

// TODO: This should be sent from the server
var MOCKED_SEMANTICS = [
  {
    label: "Author's name",
    name: "authorName",
    optional: true,
    type: "text"
  },
  {
    "name": "authorRole",
    "type": "select",
    "label": "Author's role",
    "options": [
      {
        "value": "Editor",
        "label": "Editor"
      },
      {
        "value": "Licensee",
        "label": "Licensee"
      },
      {
        "value": "Originator",
        "label": "Originator"
      }
    ],
    default: "Originator"
  }
];

H5PEditor.metadataAuthorWidget = function (params, group, parent) {

  if (!params.authors) {
    params.authors = [];
  }

  var widget = H5PEditor.$('<div class="h5p-metadata-author-widget"></div>');

  ns.processSemanticsChunk(MOCKED_SEMANTICS, {}, widget, parent);

  var button = H5PEditor.$('<div class="file authorList">' +
    '<a class="h5p-metadata-button h5p-add-author">' +
      '+ Add author' +
    '</a>' +
  '</div>')
  .click(function () {
    addAuthor();
  });

  widget.append(button);

  var authorListWrapper = H5PEditor.$('<div class="h5p-author-list-wrapper"><ul class="h5p-author-list"></ul></div>');
  widget.append(authorListWrapper);
  renderAuthorList();

  widget.appendTo(group.$group.find('.content'));

  function addAuthor() {
    var authorNameInput = (widget.find('.field-name-authorName')).find('input');
    var authorRoleInput = (widget.find('.field-name-authorRole')).find('select');

    // TODO serverside validation?
    if (authorNameInput.val().trim() == '') {
      return;
    }

    params.authors.push({
      name: authorNameInput.val(),
      role: authorRoleInput.val()
    });
    renderAuthorList();
    authorNameInput.val(' ');
    authorRoleInput.val(1);
  }

  function removeAuthor(author) {
    params.authors = params.authors.filter(function(e) {
      return e !== author;
    });

    renderAuthorList();
  }

  function renderAuthorList() {
    var wrapper = widget.find('.h5p-author-list-wrapper');
    wrapper.empty();

    authorList = H5PEditor.$('<ul></ul>');
    params.authors.forEach(function(author) {
      var listItem = H5PEditor.$('<li>' + author.name + ' <span class="h5p-metadata-role">' + author.role + '</span></li>').data('author', author);
      var deleteButton = H5PEditor.$('<button></button>');
      deleteButton.click(function() {
        removeAuthor(H5PEditor.$(listItem).data().author);
      });

      listItem.append(deleteButton);
      authorList.append(listItem);
    });

    wrapper.append(authorList);
  }
};
