// Core

var Sugar = function() {};

Sugar.Array    = function() {};
Sugar.Date     = function() {};
Sugar.Boolean  = function() {};
Sugar.Number   = function() {};
Sugar.String   = function() {};
Sugar.RegExp   = function() {};
Sugar.Function = function() {};

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

Sugar.String.Inflector = {
  acronyms:      null,
  acronym:       null,
  acronymRegExp: null,
  plural:        null,
  singular:      null,
  irregular:     null,
  uncountable:   null,
  human:         null,
  clear:         null,
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

Date.prototype.clone               = function() {};
Date.prototype.create              = function() {};
Date.prototype.daysSince           = function() {};
Date.prototype.addLocale           = function() {};
Date.prototype.addMinutes          = function() {};
Date.prototype.daysFromNow         = function() {};
Date.prototype.monthsFromNow       = function() {};
Date.prototype.millisecondsFromNow = function() {};

// Not exposed: monthSuffix, ordinalNumberMap
var Locale = {
  mdy:                null,
  code:               null,
  ampm:               null,
  ampmLower:          null,
  articles:           null,
  cachedFormat:       null,
  capitalizeUnit:     null,
  compiledFormats:    null,
  digitDate:          null,
  duration:           null,
  firstDayOfWeek:     null,
  firstDayOfWeekYear: null,
  full:               null,
  future:             null,
  long:               null,
  medium:             null,
  modifiers:          null,
  modifiersByName:    null,
  monthSuffix:        null,
  months:             null,
  monthsLower:        null,
  numbers:            null,
  optionals:          null,
  parse:              null,
  timeParse:          null,
  past:               null,
  plural:             null,
  relative:           null,
  short:              null,
  stamp:              null,
  timeMarker:         null,
  timeSuffixes:       null,
  time:               null,
  tokens:             null,
  units:              null,
  unitsLower:         null,
  variant:            null,
  weekdays:           null,
  weekdaysLower:      null,
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


// Ranges

Range.prototype.start   = null;
Range.prototype.end     = null;
Range.prototype.step    = function() {};
Range.prototype.clamp   = function() {};
Range.prototype.every   = function() {};
Range.prototype.isValid = function() {};

Date.range   = function() {};
Number.range = function() {};
String.range = function() {};

// Objects

/**
 * @suppress {duplicate}
 */
function Hash(obj) {};


var ObjectMergeOptions = {
  deep:       null,
  hidden:     null,
  resolve:    null,
  descriptor: null,
}

var ObjectToQueryStringOptions = {
  deep:      null,
  prefix:    null,
  transform: null,
  separator: null,
}

var ObjectFromQueryStringOptions = {
  deep:      null,
  auto:      null,
  transform: null,
  separator: null,
}
