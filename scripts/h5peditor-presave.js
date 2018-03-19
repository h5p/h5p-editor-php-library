var H5PEditor = H5PEditor || {};
var H5PPresave = H5PPresave || {};

H5PEditor.Presave = (function (H5PEditor) {
    "use strict";

    function Presave(){
        this.maxScore = 0;
    }

    Presave.prototype.getMaxScore = function () {
        return this.maxScore;
    };

    Presave.prototype.process = function (library, content) {
        var self = this;

        library = this.sanitizeLibrary(library);
        if( this.libraryExists(library) === true){
            try{
                H5PPresave[library].call(this, content, function(serverSideData){
                    if( typeof serverSideData !== 'object'){
                        return;
                    }
                    if( serverSideData.hasOwnProperty('maxScore') && self.isInt(serverSideData.maxScore)){
                        self.maxScore += serverSideData.maxScore;
                    }
                });
            } catch (err){
                alert(err.message);
            }
        }
        return this;
    };

    Presave.prototype.isInt = function (value) {
        return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
    };

    Presave.prototype.libraryExists = function (library) {
        return typeof H5PPresave[library] !== 'undefined';
    };

    Presave.prototype.sanitizeLibrary = function (library) {
        return H5PEditor.libraryFromString(library).machineName || library;
    };

    Presave.prototype.constructor = Presave;
    return Presave;
})(H5PEditor);
