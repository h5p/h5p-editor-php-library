/*global H5P*/
var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

/**
 * Creates a widget to add author information to a form
 *
 * @param {object} semantics
 * @param {object} params
 * @param {object} group
 * @param {mixed} parent used in processSemanticsChunk()
 * @returns {ns.Coordinates}
 */
H5PEditor.metadataAuthorWidget = function (semantics, params, group, parent) {

  if (!params.authors) {
    params.authors = [];
  }

  var widget = H5PEditor.$('<div class="h5p-metadata-author-widget"></div>');

  var $authorData = H5PEditor.$('<div class="h5p-author-data"></div>');
  widget.append($authorData);

  ns.processSemanticsChunk(semantics, {}, $authorData, parent);

  var $button = H5PEditor.$('<div class="file authorList">' +
    '<a class="h5p-metadata-button h5p-add-author">' +
      H5PEditor.t('core', 'addAuthor') +
    '</a>' +
  '</div>')
  .click(function () {
    addAuthor();
  });

  $authorData.append($button);

  var authorListWrapper = H5PEditor.$('<div class="h5p-author-list-wrapper"><ul class="h5p-author-list"></ul></div>');
  widget.append(authorListWrapper);
  renderAuthorList();

  widget.appendTo(group.$group.find('.content'));

  function addAuthor() {
    var authorNameInput = (widget.find('.field-name-name')).find('input');
    var authorRoleInput = (widget.find('.field-name-role')).find('select');

    var authorName = authorNameInput.val().trim();
    var authorRole = authorRoleInput.val();

    // TODO serverside validation?
    if (authorName === '') {
      return;
    }

    // Don't add author if already in list with the same role
    const authorDuplicate = params.authors.some(function (author) {
      return author.name === authorName && author.role === authorRole;
    });
    if (authorDuplicate) {
      authorNameInput.val('');
      authorRoleInput.val(1);
      return;
    }

    params.authors.push({
      name: authorName,
      role: authorRole
    });

    renderAuthorList();
    authorNameInput.val('');
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

    const authorList = H5PEditor.$('<ul></ul>');
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

  return $button;
};
