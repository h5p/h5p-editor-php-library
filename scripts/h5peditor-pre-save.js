var H5P = H5P || {};
var H5PEditor = H5PEditor || {};
var H5PPresave = H5PPresave || {};

H5PEditor.Presave = (function (H5P, Editor) {
  "use strict";

  function Presave() {
    this.maxScore = 0;
  }

  Presave.prototype.process = function (library, content) {
    var self = this;

    library = Presave.sanitizeLibrary(library);
    if (Presave.libraryExists(library) === true) {
      H5PPresave[library](content, function (serverSideData) {
        if (typeof serverSideData !== 'object') {
          return;
        }
        if (serverSideData.hasOwnProperty('maxScore') && Presave.isInt(serverSideData.maxScore)) {
          self.maxScore += serverSideData.maxScore;
        }
      });
    }
    return this;
  };

  Presave.validateScore = function (score) {
    if (!Presave.isInt(score) || score < 0) {
      throw new this.exceptions.InvalidMaxScoreException();
    }
    return true;
  };

  Presave.isScoreValid = function (score) {
    try {
      Presave.validateScore(score);
    } catch (err) {
      return false;
    }
    return true;
  };

  Presave.checkNestedRequirements = function (content, requirements) {
    if (typeof content === 'undefined') {
      return false;
    }
    if (typeof requirements === 'string') {
      requirements = requirements.split('.');
    }
    for (var i = 1; i < requirements.length; i++) {
      if (!content.hasOwnProperty(requirements[i])) {
        return false;
      }
      content = content[requirements[i]];
    }
    return true;
  };

  Presave.isInt = function (value) {
    return !isNaN(value) && (function (x) {
      return (x | 0) === x;
    })(parseFloat(value));
  };

  Presave.libraryExists = function (library) {
    return typeof H5PPresave[library] !== 'undefined';
  };

  Presave.sanitizeLibrary = function (library) {
    return H5P.libraryFromString(library).machineName || library;
  };

  Presave.exceptions = {
    InvalidMaxScoreException: function (message) {
      this.message = typeof message === 'string' ? message : Editor.t('core', 'errorCalculatingMaxScore');
      this.name = 'InvalidMaxScoreError';
      this.code = 'H5P-P400';
    },
    InvalidContentSemanticsException: function (name, message) {
      this.message = typeof message === 'string' ? message : Editor.t('core', 'semanticsError', {':error': Editor.t('core', 'maxScoreSemanticsMissing')});
      this.name = typeof name === 'string' ? name : 'Invalid Content Semantics Error';
      this.code = 'H5P-P500';
    }
  };

  Presave.prototype.constructor = Presave;
  return Presave;
})(H5P, H5PEditor);
