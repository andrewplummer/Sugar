// Core

function Sugar() {}

Sugar.VERSION = null;

// Definition methods

Sugar.alias                       = function() {};
Sugar.createNamespace             = function() {};
Sugar.defineInstance              = function() {};
Sugar.defineInstanceAndStatic     = function() {};
Sugar.defineInstancePolyfill      = function() {};
Sugar.defineInstanceWithArguments = function() {};
Sugar.defineStatic                = function() {};
Sugar.defineStaticPolyfill        = function() {};
Sugar.defineStaticWithArguments   = function() {};
Sugar.extend                      = function() {};
Sugar.toString                    = function() {};

// Utility methods

Sugar.util = {
  hasOwn:               function() {},
  getOwn:               function() {},
  setProperty:          function() {},
  classToString:        function() {},
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
  this.allowsFullWidth    = null;
  this.ampm               = null;
  this.ampmFront          = null;
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
  this.monthMap           = null;
  this.monthSuffix        = null;
  this.months             = null;
  this.numeralMap         = null;
  this.numeralUnits       = null;
  this.numerals           = null;
  this.ordinalSuffix      = null;
  this.parse              = null;
  this.parsingAliases     = null;
  this.parsingTokens      = null;
  this.past               = null;
  this.placeholders       = null;
  this.plural             = null;
  this.relative           = null;
  this.short              = null;
  this.stamp              = null;
  this.time               = null;
  this.timeFrontParse     = null;
  this.timeMarkerOptional = null;
  this.timeMarkers        = null;
  this.timeSeparator      = null;
  this.timeParse          = null;
  this.timeSuffixes       = null;
  this.tokens             = null;
  this.units              = null;
  this.weekdayMap         = null;
  this.weekdays           = null;
};

Locale.prototype.addFormat = function() {};
Locale.prototype.addRawFormat = function() {};

var DateSet = {
  ampm:          null,
  date:          null,
  day:           null,
  edge:          null,
  half:          null,
  hour:          null,
  midday:        null,
  millisecond:   null,
  minute:        null,
  month:         null,
  num:           null,
  second:        null,
  shift:         null,
  sign:          null,
  specificity:   null,
  timestamp:     null,
  tzHour:        null,
  tzMinute:      null,
  tzSign:        null,
  unit:          null,
  utc:           null,
  week:          null,
  weekday:       null,
  year:          null,
  yearSign:      null,
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
  clone:   null,
  fromUTC: null,
  future:  null,
  locale:  null,
  params:  null,
  past:    null,
  prefer:  null,
  setUTC:  null,
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
