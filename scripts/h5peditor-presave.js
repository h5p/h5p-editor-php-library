var H5PEditor = H5PEditor || {};
var H5PPresave = H5PPresave || {};

H5PEditor.Presave = (function () {
    "use strict"

    var isInt = function (value) {
        return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
    };

    function Presave(){
        var self = this;
        self.maxScore = 0;

        self.processMaxScore = function (library, content) {
            this.process(library, content);
            return this.maxScore;
        };

        self.process = function (library, content) {
            if( typeof H5PPresave[library] !== 'undefined'){
                H5PPresave[library](content, function(params){
                    if( typeof params !== 'object'){
                        return;
                    }
                    if( params.hasOwnProperty('maxScore') && isInt(params.maxScore)){
                        self.maxScore += params.maxScore;
                    }
                });
            }
        };

        self.getMaxScore = function () {
            return this.maxScore;
        }
    };

    Presave.prototype.constructor = Presave;
    return Presave;
})();
