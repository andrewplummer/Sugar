Sugar = {};
Sugar.Array    = {};
Sugar.Boolean  = {};
Sugar.Date     = {};
Sugar.Date.addLocale = function() {};
Sugar.Date.millisecondsFromNow = function() {};
Sugar.Date.daysFromNow   = function() {};
Sugar.Date.monthsFromNow = function() {};
Sugar.Date.daysSince = function() {};
Sugar.Date.clone  = function() {};
Sugar.Date.create = function() {};
Sugar.Function = {};
Sugar.Number   = {};
Sugar.Number.thousands = '';
Sugar.Number.decimal   = '';
Sugar.Object   = {};
Sugar.RegExp   = {};
Sugar.String   = {};
Sugar.String.Inflector = {};
Sugar.String.Inflector.acronyms = {};
Sugar.String.Inflector.acronym     = function() {};
Sugar.String.Inflector.plural      = function() {};
Sugar.String.Inflector.singular    = function() {};
Sugar.String.Inflector.irregular   = function() {};
Sugar.String.Inflector.uncountable = function() {};
Sugar.String.Inflector.human       = function() {};
Sugar.String.Inflector.clear       = function() {};
Sugar.natives  = [];
Sugar.extend  = function() {};
Sugar.revert  = function() {};
Sugar.restore = function() {};
Sugar.define  = function() {};
Sugar.global  = function() {};
Sugar.noConflict        = false;
Sugar.hasOwnProperty    = function() {};
Sugar.iterateOverObject = function() {};

Date.prototype._utc = false;
Function.prototype.timers = [];

// ES6
String.prototype.startsWith = function() {};
String.prototype.endsWith   = function() {};
String.prototype.contains   = function() {};

Range                   = function() {};
Range.prototype.step    = function() {};
Range.prototype.clamp   = function() {};
Range.prototype.every   = function() {};
Range.prototype.isValid   = function() {};

var l = new Localization();
l.modifiers       = [{ name: 'shift', src: 'last', value: -1 }];
l.cachedFormat    = l.compiledFormats[0];
l.compiledFormats = [{ variant: false, locale: '', reg: /date/, to: [] }];
l.modifiersByName = {};

process = { env: {} };
module  = { exports: {} };

function Hash() {};
