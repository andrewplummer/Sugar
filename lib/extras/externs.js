// Core

var Sugar = function () {};
var SugarChainable = function() {};

// Utility methods

Sugar.VERSION         = null;
Sugar.extend          = function() {};
Sugar.toString        = function() {};
Sugar.createNamespace = function() {};

Sugar.util = {
  hasOwn:               function() {},
  className:            function() {},
  setProperty:          function() {},
  defineProperty:       function() {},
  forEachProperty:      function() {},
  mapNativeToChainable: function() {},
};

var SugarNamespaceMethod = {
  flags: null,
  static: null,
  instance: null,
};

var SugarExtendOptions = {
  except:          null,
  methods:         null,
  namespaces:      null,
  objectPrototype: null,
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

Sugar.Date.create    = function() {};
Sugar.Date.get       = function() {};
Sugar.Date.addLocale = function() {};

var Locale = function() {
  this.ampm               = null;
  this.articles           = null;
  this.code               = null;
  this.compiledFormats    = null;
  this.duration           = null;
  this.firstDayOfWeek     = null;
  this.firstDayOfWeekYear = null;
  this.full               = null;
  this.future             = null;
  this.long               = null;
  this.mdy                = null;
  this.medium             = null;
  this.modifiers          = null;
  this.months             = null;
  this.numerals           = null;
  this.ordinalSuffix      = null;
  this.parse              = null;
  this.parseAliases       = null;
  this.parseTokens        = null;
  this.past               = null;
  this.plural             = null;
  this.relative           = null;
  this.short              = null;
  this.stamp              = null;
  this.time               = null;
  this.timeFrontParse     = null;
  this.timeMarkers        = null;
  this.timeParse          = null;
  this.timeSuffixes       = null;
  this.tokens             = null;
  this.units              = null;
  this.weekdays           = null;
};

Locale.prototype.addFormat = function() {};
Locale.prototype.addRawFormat = function() {};

var DateSet = {
  ampm:          null,
  date:          null,
  day:           null,
  days:          null,
  edge:          null,
  half:          null,
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
};

var DateInputFormat = {
  variant:  null,
  locale:   null,
  reg:      null,
  to:       null,
};

var DateModifier = {
  src:    null,
  name:   null,
  value:  null,
};

var DateCreateOptions = {
  set:     null,
  fromUTC: null,
  setUTC:  null,
  locale:  null,
  future:  null,
  past:    null,
};

// Objects

var ObjectMergeOptions = {
  deep:       null,
  hidden:     null,
  resolve:    null,
  descriptor: null,
};

var ObjectToQueryStringOptions = {
  deep:      null,
  prefix:    null,
  transform: null,
  separator: null,
};

var ObjectFromQueryStringOptions = {
  deep:      null,
  auto:      null,
  transform: null,
  separator: null,
};

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

// Inflections

var Inflections = {
  plural:   null,
  singular: null,
  human:    null,
  acronyms: null,
};
