/**
 * Creates a widget to add author information to a form
 *
 * @param {object} semantics
 * @param {object} params
 * @param {object} group
 * @param {mixed} parent used in processSemanticsChunk()
 * @returns {ns.Coordinates}
 */
H5PEditor.metadataAuthorWidget = function (semantics, params, $wrapper, parent) {
  if (!params.authors) {
    params.authors = [];
  }

  const $ = H5PEditor.$;

  // Store authors that have just been removed
  const removedAuthors = [];

  const widget = $('<div class="field h5p-metadata-author-widget"></div>');

  var $authorData = $('<div class="h5p-author-data"></div>');
  widget.append($authorData);

  H5PEditor.processSemanticsChunk(semantics, {}, $authorData, parent);

  // Get references to the fields
  var nameField = H5PEditor.findField('name', parent);
  var roleField = H5PEditor.findField('role', parent);

  var $button = $('<div class="field authorList">' +
    '<button class="h5p-metadata-button h5p-add-author" tabindex="0">' +
      H5PEditor.t('core', 'addAuthor') +
    '</button>' +
  '</div>').click(function (event) {
    addAuthor(event.originalEvent !== undefined);
  });
  $authorData.append($button);

  var authorListWrapper = $('<div class="h5p-author-list-wrapper"><ul class="h5p-author-list"></ul></div>');
  widget.append(authorListWrapper);
  renderAuthorList();

  widget.appendTo($wrapper);

  /**
   * Add author to the list of authors.
   *
   * @param {boolean} deliberatelyAdded - If true, user clicked to add an author.
   */
  function addAuthor(deliberatelyAdded) {
    // Temporarily set name as mandatory to get the error messages only when
    // clicking the Add Author button
    nameField.field.optional = false;
    var name = nameField.validate();
    nameField.field.optional = true;
    var role = roleField.validate();

    if (!name) {
      return;
    }

    // Don't add author if already in list with the same role
    const authorDuplicate = params.authors.some(function (author) {
      return author.name === name && author.role === role;
    });
    if (authorDuplicate) {
      resetForm();
      return;
    }

    // Don't add author automatically if she/he was just removed from list
    const justRemoved = removedAuthors.some(function (author) {
      return author.name === name && author.role === role;
    });
    if (justRemoved && !deliberatelyAdded) {
      return;
    }

    params.authors.push({
      name: name,
      role: role
    });

    renderAuthorList();
    resetForm();
  }

  function resetForm() {
    nameField.$input.val('');
  }

  /**
   * Remove author from list.
   *
   * @param {object} author - Author to be removed.
   * @param {string} author.name - Author name.
   * @param {string} author.role - Author role.
   */
  function removeAuthor(author) {
    params.authors = params.authors.filter(function (e) {
      const remove = (e === author);
      if (remove) {
        removedAuthors.push(author);
      }
      return !remove;
    });

    renderAuthorList();
  }

  function renderAuthorList() {
    var wrapper = widget.find('.h5p-author-list-wrapper');
    wrapper.empty();

    const authorList = $('<ul></ul>');
    params.authors.forEach(function (author) {
      // Name and role
      var listItem = $('<li>', {
        html: H5PEditor.htmlspecialchars(author.name),
        append: $('<span>', {
          'class': 'h5p-metadata-role',
          html: author.role
        })
      });

      // The delete-button
      $('<button>', {
        click: function () {
          removeAuthor(author);
        }
      }).appendTo(listItem);

      authorList.append(listItem);
    });

    wrapper.append(authorList);
  }
};
