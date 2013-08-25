
var overridingFunction = function() {
  return 'Something totally unexpected!';
}

Object.map      = overridingFunction;
Object.each     = overridingFunction;
Object.any      = overridingFunction;
Object.sum      = overridingFunction;
Object.isObject = overridingFunction;
Object.isNumber = overridingFunction;
Object.extend   = overridingFunction;

Array.create              = overridingFunction;
Array.prototype.findAll   = overridingFunction;
Array.prototype.all       = overridingFunction;
Array.prototype.add       = overridingFunction;
Array.prototype.groupBy   = overridingFunction;

String.extend              = overridingFunction;
String.range               = overridingFunction;
String.prototype.each      = overridingFunction;
String.prototype.to        = overridingFunction;
String.prototype.pad       = overridingFunction;
String.prototype.insert    = overridingFunction;
String.prototype.pluralize = overridingFunction;
String.prototype.hankaku   = overridingFunction;

Number.random                  = overridingFunction;
Number.range                   = overridingFunction;
Number.prototype.log           = overridingFunction;
Number.prototype.ceil          = overridingFunction;
Number.prototype.round         = overridingFunction;
Number.prototype.floor         = overridingFunction;
Number.prototype.abs           = overridingFunction;
Number.prototype.upto          = overridingFunction;
Number.prototype.downto        = overridingFunction;
Number.prototype.secondsBefore = overridingFunction;
Number.prototype.duration      = overridingFunction;

RegExp.escape             = overridingFunction;
RegExp.prototype.getFlags = overridingFunction;
RegExp.prototype.setFlags = overridingFunction;

Function.prototype.lazy     = overridingFunction;
Function.prototype.throttle = overridingFunction;
Function.prototype.debounce = overridingFunction;


Date['ISO8601_DATE'] = 'none!';
Date.create               = overridingFunction;
Date.range                = overridingFunction;
Date.prototype.set        = overridingFunction;
Date.prototype.iso        = overridingFunction;
Date.prototype.endOfDay   = overridingFunction;
Date.prototype.long       = overridingFunction;
Date.prototype.isToday    = overridingFunction;
Date.prototype.addMinutes = overridingFunction;




// ES6

// Array.prototype.find       = overridingFunction;
// Array.prototype.findIndex  = overridingFunction;
// String.prototype.repeat    = overridingFunction;
// String.prototype.normalize = overridingFunction;
