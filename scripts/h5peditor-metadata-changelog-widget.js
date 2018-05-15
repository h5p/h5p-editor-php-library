/*global H5P*/
var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

var MOCKED_SEMANTICS_1 = [{
    "name": "changeLog",
    "type": "group",
    "expanded": false,
    "label": "Change Log",
    "fields": [
      {
          "name": "changeLogForm",
          "type": "group",
          "label": "Question",
          "expanded": true,
          "fields": [
            {
              "name": "date",
              "type": "text",
              "label": "Date",
              "optional": true
            },
            {
              "name": "author",
              "type": "text",
              "label": "Changed by",
              "optional": true
            },
            {
              "name": "log",
              "type": "textarea",
              "label": "Description of change",
              "placeholder": "Add a description of your change",
              "optional": true
            }
          ]
        }
    ]
  }];

H5PEditor.metadataChangelogWidget = function (params, group, parent) {
  if (!params.changes) {
    params.changes = [];
  }

  var editing = false;
  var newLog = false;
  var widget = H5PEditor.$('<div class="h5p-metadata-changelog"></div>');
  var currentLog;

  ns.processSemanticsChunk(MOCKED_SEMANTICS_1, {}, widget, parent);
  var form = widget.find('.field-name-changeLogForm');
  form.find('.title').remove();

  var dateInput = widget.find('.field-name-date').find('input');
  var authorInput = widget.find('.field-name-author').find('input');
  var logInput = widget.find('.field-name-log').find('textarea');

  var cancelButton = H5PEditor.$('<div class="file authorList">' +
    '<a class="h5p-metadata-button h5p-cancel">' +
      'Cancel' +
    '</a>' +
  '</div>')
  .click(function () {
    dateInput.val('');
    authorInput.val('');
    logInput.val('');
    editing = false;
    render();
  });

  var createLogButton = H5PEditor.$('<div class="file authorList">' +
    '<a class="h5p-metadata-button h5p-add-author">' +
      'Log this change' +
    '</a>' +
  '</div>')
  .click(function () {
    editing = false;

    if (!dateInput.val() || !authorInput.val() || !logInput.val()) {
      return;
    }

    if (currentLog) {
      params.changes[currentLog].date = dateInput.val();
      params.changes[currentLog].author = authorInput.val();
      params.changes[currentLog].log = logInput.val();
    }

    else {
      params.changes.push({
        date: dateInput.val(),
        author: authorInput.val(),
        log: logInput.val()
      });
      newLog = true;
    }

    dateInput.val('');
    authorInput.val('');
    logInput.val('');

    render();
    currentLog = undefined;
  });

  var formButtonWrapper = H5PEditor.$('<div class="h5p-metadata-formButtonWrapper"></div>');
  formButtonWrapper.append(cancelButton);
  formButtonWrapper.append(createLogButton);
  form.append(formButtonWrapper);

  var button = H5PEditor.$('<div class="file h5p-metadata-new-log">' +
    '<a class="h5p-metadata-button h5p-add-author">' +
      '+ Add new change' +
    '</a>' +
  '</div>')
  .click(function () {
    editing = true;
    newLog = false;
    render();
  });
  widget.find('.content').first().append(button);

  var newLogMessage = H5PEditor.$('<div class="h5p-metadata-new-log-message">New change has been logged</div>');
  widget.find('.content').first().append(newLogMessage);

  var logWrapper = H5PEditor.$('<div></div>');
  widget.find('.content').first().append(logWrapper);

  var logList;

  widget.appendTo(group.$group);
  render();


  function render() {
    newLogMessage.hide();

    if (editing) {
      button.hide();
      form.show();
      populateForm();
      formButtonWrapper.show();
      renderLogWrapper(logWrapper);
      newLogMessage.hide();

      var dateWrapping = widget.find('.field-name-date');
      var dateInput = dateWrapping.find('input')[0]
      H5PEditor.$(dateInput).addClass('datepicker');
      loadScripts(dateInput);
    }
    else {
      button.show();
      form.hide();
      formButtonWrapper.hide();
      renderLogWrapper(logWrapper);

      if (newLog) {
        newLogMessage.show();
      }
    }
  }

  function renderLogWrapper(logWrapper) {
    logWrapper.empty();
    logWrapper.append('<span class="h5p-metadata-log-wrapper-title">Logged changes</span>');

    if (params.changes.length == 0) {
      logWrapper.append(H5PEditor.$('<p>No changes have been logged</p>'));
    }
    else {
      var logList = H5PEditor.$('<div class="h5p-metadata-log-wrapper"></div>');
      logWrapper.append(logList);

      for (var i = 0; i < params.changes.length; i++) {
        var log = params.changes[i];

        var dateWrapper = H5PEditor.$('<div class="h5p-metadata-log-date">' +
          log.date +
        '</div>');

        var logDescription = H5PEditor.$('<div class="h5p-metadata-log-description">' +
          log.log +
        '</div>');

        var authorWrapper = H5PEditor.$('<div class="h5p-metadata-log-author">' +
          '<span>by </span>' +
          log.author +
        '</div>');

        var logWrapper = H5PEditor.$('<div class="h5p-metadata-description-wrapper"></div>');
        logWrapper.append(logDescription);
        logWrapper.append(authorWrapper);

        var logButtons = H5PEditor.$('<div class="h5p-metadata-log-buttons">' +
         '<button class="h5p-metadata-edit"></button>' +
         '<button class="h5p-metadata-delete"></button>' +
        '</div>');

        logButtons.find('.h5p-metadata-delete').click(function() {
          var wrapper = this.closest('.h5p-metadata-log');
          var index = H5PEditor.$(wrapper).attr('data');
          deleteLog(index);
        });

        logButtons.find('.h5p-metadata-edit').click(function() {
          var wrapper = this.closest('.h5p-metadata-log');
          var index = H5PEditor.$(wrapper).attr('data');
          editLog(index);
        });

        var logContent = H5PEditor.$('<div class="h5p-metadata-log ' + (i == 0 ? '' : 'not-first') + '"  data="' + i + '"></div>');
        logContent.append(dateWrapper);
        logContent.append(logWrapper);
        logContent.append(logButtons);

        logList.prepend(logContent);
      }
    }
  }

  function editLog(index) {
    editing = true;
    currentLog = index;
    newLog = false;
    render();
  }

  function populateForm() {
    if (currentLog) {
      var log = params.changes[currentLog];
      dateInput.val(log.date);
      authorInput.val(log.author);
      logInput.val(log.log);
    }
  }

  function deleteLog(index) {
    params.changes.splice(index, 1);
    render();
  }

  /**
   * Load scripts dynamically
   */
  function loadScripts(dateInput) {
    loadScript(H5PEditor.basePath + 'libs/zebra_datepicker.src.js', function () {
      H5PEditor.$(dateInput).Zebra_DatePicker({
        format: 'd-m-y G:i:s'
      });
    });
  };

  /**
   * Load a script dynamically
   *
   * @param {string} path Path to script
   * @param {function} [callback]
   */
  function loadScript(path, callback) {
    H5PEditor.$.ajax({
      url: path,
      dataType: 'script',
      success: function () {
        if (callback) {
          callback();
        }
      },
      error: function (r,e) {
        console.log('error loading libraries: ', e);
      },
      async: true
    });
  };

}
