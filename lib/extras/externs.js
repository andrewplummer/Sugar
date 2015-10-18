// Core

var SugarNamespaceMethod = {
  flags: null,
  static: null,
  instance: null,
}

var SugarExtendOptions = {
  methods:        null,
  enhanceArray:   null,
  enhanceString:  null,
  objectInstance: null,
}

// Numbers

Sugar.Number.thousands = null;
Sugar.Number.decimal   = null;


// Strings

var Inflector = {
  acronyms:     null,
  acronym:      null,
  plural:       null,
  singular:     null,
  irregular:    null,
  uncountable:  null,
  human:        null,
  clear:        null,
};


// ES6

Array.prototype.find        = function() {};
Array.prototype.findIndex   = function() {};

String.prototype.startsWith = function() {};
String.prototype.endsWith   = function() {};
String.prototype.contains   = function() {};
String.prototype.includes   = function() {};
String.prototype.repeat     = function() {};


// Dates

Sugar.Date.newDateInternal = null;

Date.prototype._utc = false;
Date.prototype.addLocale = function() {};
Date.prototype.millisecondsFromNow = function() {};
Date.prototype.daysFromNow   = function() {};
Date.prototype.monthsFromNow = function() {};
Date.prototype.daysSince = function() {};
Date.prototype.clone  = function() {};
Date.prototype.create = function() {};
Date.prototype.addMinutes = null;

// Not exposed: monthSuffix, ordinalNumberMap
var Locale = {
  code:              null,
  ampm:              null,
  articles:          null,
  cachedFormat:      null,
  capitalizeUnit:    null,
  compiledFormats:   null,
  digitDate:         null,
  duration:          null,
  full:              null,
  future:            null,
  long:              null,
  modifiers:         null,
  modifiersByName:   null,
  monthSuffix:       null,
  months:            null,
  numbers:           null,
  optionals:         null,
  parse:             null,
  timeParse:         null,
  past:              null,
  plural:            null,
  relative:          null,
  short:             null,
  timeMarker:        null,
  timeSuffixes:      null,
  tokens:            null,
  units:             null,
  variant:           null,
  weekdays:          null,
  weekdayAbbreviate: null,
}

var DateSet = {
  ampm:          null,
  date:          null,
  day:           null,
  days:          null,
  edge:          null,
  fullMonth:     null,
  hour:          null,
  hours:         null,
  millisecond:   null,
  milliseconds:  null,
  minute:        null,
  minutes:       null,
  month:         null,
  months:        null,
  num:           null,
  offsetHours:   null,
  offsetMinutes: null,
  offsetSign:    null,
  second:        null,
  seconds:       null,
  shift:         null,
  sign:          null,
  specificity:   null,
  unit:          null,
  utc:           null,
  timestamp:     null,
  week:          null,
  weekday:       null,
  weeks:         null,
  year:          null,
  yearSign:      null,
  years:         null,
}

var DateInputFormat = {
  variant:  null,
  locale:   null,
  reg:      null,
  to:       null,
}

var DateModifier = {
  src:    null,
  name:   null,
  value:  null,
}

var DateCreateOptions = {
  fromUTC: null,
  setUTC:  null,
  locale:  null,
  future:  null,
  past:    null,
}



// Functions

Function.prototype.timers = [];


// Ranges

var Range = function() {};

Range.prototype.step    = function() {};
Range.prototype.clamp   = function() {};
Range.prototype.every   = function() {};
Range.prototype.isValid = function() {};

var range = {
  start: null,
  end:   null,
}

Date.range   = function() {};
Number.range = function() {};
String.range = function() {};

// Objects

var Hash = function(obj) {};

Hash.prototype.get = function() {};
Hash.prototype.set = function() {};
