(function() {

  const getTimezoneOffset = Date.prototype.getTimezoneOffset;

  mockTimeZoneOffset = function(offset) {
    Date.prototype.getTimezoneOffset = function() {
      return offset;
    }
  }

  releaseTimeZoneOffset = function() {
    Date.prototype.getTimezoneOffset = getTimezoneOffset;
  }

})();
