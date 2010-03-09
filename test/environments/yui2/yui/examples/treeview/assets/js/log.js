// Adapter for YAHOO.widget.Logger

var ygLogger = function(module) {
    return new YAHOO.widget.LogWriter(module);
};

YAHOO.widget.LogWriter.prototype.debug = function() {
    this.log.apply(this, arguments);
};

ygLogger.init = function(div) {
   new YAHOO.widget.LogReader(div, { 
            height: "400px" 
        });
};
