(function ($, ns) {
  H5PEditor.init = function ($form, $type, $upload, $create, $editor, $library, $params, $maxScore, submitCallback) {
    H5PEditor.$ = H5P.jQuery;
    H5PEditor.basePath = H5PIntegration.editor.libraryUrl;
    H5PEditor.fileIcon = H5PIntegration.editor.fileIcon;
    H5PEditor.ajaxPath = H5PIntegration.editor.ajaxPath;
    H5PEditor.filesPath = H5PIntegration.editor.filesPath;
    H5PEditor.apiVersion = H5PIntegration.editor.apiVersion;

    // Semantics describing what copyright information can be stored for media.
    H5PEditor.copyrightSemantics = H5PIntegration.editor.copyrightSemantics;
    H5PEditor.metadataSemantics = H5PIntegration.editor.metadataSemantics;

    // Required styles and scripts for the editor
    H5PEditor.assets = H5PIntegration.editor.assets;

    // Required for assets
    H5PEditor.baseUrl = '';

    if (H5PIntegration.editor.nodeVersionId !== undefined) {
      H5PEditor.contentId = H5PIntegration.editor.nodeVersionId;
    }

    var h5peditor;
    $create.hide();
    var library = $library.val();

    $type.change(function () {
      if ($type.filter(':checked').val() === 'upload') {
        $create.hide();
        $upload.show();
      }
      else {
        $upload.hide();
        if (h5peditor === undefined) {
          h5peditor = new ns.Editor(library, $params.val(), $editor[0]);
        }
        $create.show();
      }
    });

    if ($type.filter(':checked').val() === 'upload') {
      $type.change();
    }
    else {
      $type.filter('input[value="create"]').attr('checked', true).change();
    }

    $form.submit(function () {
      if (h5peditor !== undefined) {
        var params = h5peditor.getParams();
        if (params !== undefined) {
          params.metadata = params.metadata || {};

          // Set default metadata title if not set
          var defaultName = h5peditor.getLibrary().split('.')[1].split(' ')[0].replace(/([a-z])([A-Z])/g, '$1 $2');
          params.metadata.title = params.metadata.title || H5PEditor.language.core.untitled + ' ' + defaultName;

          $library.val(h5peditor.getLibrary());
          $params.val(JSON.stringify(params));
          try{
            var presave = h5peditor.presave(params);
            $maxScore.val(presave.maxScore);
          } catch (err) {
            alert(err.message); //This halts processing. Swap with H5P.Dialog? And perhaps stop probagation?
            $maxScore.val(0);
          }

          if (submitCallback) {
            submitCallback(params);
          }
        }
      }
    });
  };

  H5PEditor.getAjaxUrl = function (action, parameters) {
    var url = H5PIntegration.editor.ajaxPath + action;

    if (parameters !== undefined) {
      for (var property in parameters) {
        if (parameters.hasOwnProperty(property)) {
          url += '&' + property + '=' + parameters[property];
        }
      }
    }

    return url;
  };
})(H5P.jQuery, H5PEditor);
