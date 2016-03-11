// Core

var Sugar = function () {};
var SugarChainable = function(obj) {};

// Utility methods

Sugar.VERSION              = null;
Sugar.hasOwn               = function() {};
Sugar.toString             = function() {};
Sugar.className            = function() {};
Sugar.setProperty          = function() {};
Sugar.defineProperty       = function() {};
Sugar.createNamespace      = function() {};
Sugar.iterateOverObject    = function() {};
Sugar.mapNativeToChainable = function() {};

var SugarNamespaceMethod = {
  flags: null,
  static: null,
  instance: null,
}

var SugarExtendOptions = {
  except:          null,
  methods:         null,
  objectPrototype: null,
}

// Strings

Sugar.String.Inflector = {
  acronyms:      null,
  acronym:       null,
  acronymRegExp: null,
  humanize:      null,
  plural:        null,
  singular:      null,
  inflect:       null,
  irregular:     null,
  uncountable:   null,
  human:         null,
  clear:         null,
  reset:         null,
};

// ES6

Array.from                  = function() {};
Array.prototype.find        = function() {};
Array.prototype.findIndex   = function() {};

String.prototype.startsWith = function() {};
String.prototype.endsWith   = function() {};
String.prototype.contains   = function() {};
String.prototype.includes   = function() {};
String.prototype.repeat     = function() {};


// Dates

Date.prototype.addLocale = function() {};

// Not exposed: monthSuffix, ordinalNumberMap
var Locale = function() {
  this.mdy                = null;
  this.code               = null;
  this.ampm               = null;
  this.ampmLower          = null;
  this.articles           = null;
  this.compiledFormats    = null;
  this.digitDate          = null;
  this.duration           = null;
  this.firstDayOfWeek     = null;
  this.firstDayOfWeekYear = null;
  this.full               = null;
  this.future             = null;
  this.long               = null;
  this.medium             = null;
  this.modifiers          = null;
  this.monthSuffix        = null;
  this.months             = null;
  this.monthsLower        = null;
  this.numbers            = null;
  this.optionals          = null;
  this.ordinalSuffix      = null;
  this.parse              = null;
  this.timeParse          = null;
  this.past               = null;
  this.plural             = null;
  this.relative           = null;
  this.short              = null;
  this.stamp              = null;
  this.timeMarker         = null;
  this.timeSuffixes       = null;
  this.time               = null;
  this.tokens             = null;
  this.units              = null;
  this.unitsLower         = null;
  this.variant            = null;
  this.weekdays           = null;
  this.weekdaysLower      = null;
}

Locale.prototype.addFormat = function() {};
Locale.prototype.addRawFormat = function() {};

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

Sugar.Date.range   = function() {};
Sugar.Number.range = function() {};
Sugar.String.range = function() {};

// Objects

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
