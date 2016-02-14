# Sugar

[![Build Status](https://secure.travis-ci.org/andrewplummer/Sugar.png)](http://travis-ci.org/andrewplummer/Sugar)

A Javascript library for working with native objects.

---
#### Draft! Not all these links work yet!

---------------------------------------

- [Installing](#installing)
- [Upgrading](#upgrading)
- [Documentation](#documentation)
- [Getting Started](#getting-started)
- [Custom Builds](#custom-builds)
- [npm](#npm)
- [Polyfills](#polyfills)
- [Date Locales](#date-locales)
- [Timezones](#timezones)
- [Defining Methods](#defining-methods)
- [Contributing](#contributing)

---------------------------------------


## Installing

#### [sugar.js](sugar.js) | [sugar.min.js (24kb gz)](sugar.min.js)

`npm install sugar`


## Upgrading

If you are upgrading to `v2.0.0`, there is now an [upgrade helper](lib/extras/upgrade.js) available that will log method calls that may potentially break. Or refer to the [logs](CAUTION.md) to read about major changes.


## Documentation

#### [http://sugarjs.com/docs/](http://sugarjs.com/docs/)


## Getting Started

Sugar now has 3 modes of usage. Which mode is right for you depends on your use case. Sugar still fully endorses extending prototypes, and makes it as safe as possible to do so. However, if you are creating a library, plugin, or **any piece of code whose end user may not be aware that prototypes are extended**, it is strongly recommended that you avoid extended mode. The decision to extend prototypes is one that should be left up to the end user.


### Static

```javascript
Sugar.Array.sum([2,4,6]); // 12
```

Straight method calls on the global `Sugar` object. Methods marked `static` in the docs take arguments as listed. Methods marked `instance` in the docs are the same except for the first argument, which must be the instance object itself.

### Chainables

```javascript
new Sugar.Array([2,4,6]).sum().raw; // 12
```

Chainables are Sugar enhanced objects. They are wrappers around standard Javascript objects that can be accessed with the `raw` property. Sugar methods are mapped to their associated chainable type, so any instance method available to `Sugar.Array` will also be available to `new Sugar.Array(...)`. Additionally, chainables have built-in methods mapped to them as well, so they can be used in the same way:

```javascript
new Sugar.String('LONG SHOUTY TEXT!!!').truncate(4).toLowerCase().raw // "long...'
```

### Extended

```javascript
Sugar.extend();
[2,4,6].sum(); // 12
```

Extended mode extends native prototypes so that they can immediately make use of Sugar methods. As in previous versions, `Object.prototype` is never touched without a special flag ([that you generally shouldn't use](http://sugarjs.com/docs/#natives)). Additionally there are a number of [options](http://sugarjs.com/docs/Sugar/extend) when extending to allow fine grained control over which methods get mapped. Classes can be extended individually as well with: `Sugar.Array.extend()`. Once a class (or all classes) are extended, any method that is [defined later](#defining-methods) will be immediately extended onto the prototype as well.


## Custom Builds

For custom builds, use the [download page](http://sugarjs.com/download). If you are using a bundler like Browserify, the [npm](#npm) package is modularized to allow requiring exactly the methods or modules you need. This repo has tasks to customize as well. Simply clone and run `npm install`, then `gulp`. Default modules included in the distributed build:

- [Date](http://sugarjs.com/docs/Date)
- [String](http://sugarjs.com/docs/String)
- [Array](http://sugarjs.com/docs/Array)
- [Object](http://sugarjs.com/docs/Object)
- [Function](http://sugarjs.com/docs/Function)
- [Number](http://sugarjs.com/docs/Number)
- [RegExp](http://sugarjs.com/docs/RegExp)
- [Enumerable](lib/enumerable.js) (shared methods on Array and Object)
- [Range](http://sugarjs.com/docs/Range) (String, Number, and Date ranges)
- [ES6](#polyfills) (Polyfills)
- [ES7](#polyfills) (Polyfills)

Other modules available are:

- [ES5](#polyfills) (Adds IE6-8 Support)
- [Language](lib/language.js) (Character conversion and script detection)
- [Inflections](lib/inflections.js) (Pluralization and string normalization)


## npm

In additional to the main npm package, there are new packages for each Sugar "module" (`sugar-array`, `sugar-date`, etc). All packages include pre-built scripts in the `dist/` directory, and are now modularized by method so you can require only what you need:

```javascript
var Sugar = require('sugar');
require('sugar/date');
require('sugar/array/sum');
require('sugar/string/format');
```

Once required, methods will be defined on the `Sugar` global, and can be [used as normal](#usage) in any mode. Additionally, individual method packages will return references to their static form which can be used immediately:

```javascript
var sum = require('sugar/array/sum');
sum([2,4,6]); // 12
```


## Polyfills

Sugar has a full ES5 polyfill suite (most notably for IE6-8), as well as some simple core ES6/ES7 polyfills (included by default) to provide basic functionality. As of `v2.0.0`, ES5 polyfills are no longer included in the default build. You can create a [custom build](#custom-builds) to include them. If you are not worried about ES6/ES7 support, or you are using a different polyfill package, you can create a custom build to remove these modules. Note that of ES6/ES7 packages, only `Array.from`, will cause other breakages if missing. The other methods can be disregarded if not required. However, missing ES5 methods will cause significant breakage.

##### ES6 (2015):

- [Array.from](http://sugarjs.com/docs/Array/from)
- [Array#find](http://sugarjs.com/docs/Array/find)
- [Array#findIndex](http://sugarjs.com/docs/Array/findIndex)
- [String#includes](http://sugarjs.com/docs/String/includes)
- [String#startsWith](http://sugarjs.com/docs/String/startsWith)
- [String#endsWith](http://sugarjs.com/docs/String/endsWith)
- [String#repeat](http://sugarjs.com/docs/String/repeat)
- [Number.isNaN](http://sugarjs.com/docs/Number/isNaN)

##### ES7 (2016):

- [Array#includes](http://sugarjs.com/Array/includes)


## Date Locales

Locale definition files are in the [locales](locales/) directory. They can be simply included as-is after Sugar is loaded, or built together using [custom builds](#custom-builds). English is included by default and required by the Date module. Currently available locales are:

- [Catalan (ca)](locales/ca.js)
- [Danish (da)](locales/da.js)
- [Dutch (nl)](locales/nl.js)
- [Finnish (fi)](locales/fi.js)
- [French (fr)](locales/fr.js)
- [German (de)](locales/de.js)
- [Italian (it)](locales/it.js)
- [Japanese (ja)](locales/ja.js)
- [Korean (ko)](locales/ko.js)
- [Norwegian (no)](locales/no.js)
- [Polish (pl)](locales/pl.js)
- [Portuguese (pt)](locales/pt.js)
- [Russian (ru)](locales/ru.js)
- [Spanish (es)](locales/es.js)
- [Swedish (sv)](locales/sv.js)
- [Simplified Chinese (zh-CN)](locales/zh-CN.js)
- [Traditional Chinese (zh-TW)](locales/zh-TW.js)

**Customizing/Adding Locales**

If you need a locale not on this list, or if you need to tweak a locale, you can copy or change the locale definition file, which uses a format that is fairly easy to follow. Most tokens have a simple alternating format to keep them compact. For each token, a colon `:` demarcates a prefix and pipe `|` indicates suffix alternation. For example in the English definition file `Sep:tember|t|` is equivalent to `September|Sept|Sep`. Any alternate form will parse, but the order is important for formatting as the first alternate will be the "full" form, and the second alternate will be the "abbreviated" form. Plural forms for units likewise use alternates when the definition file has `'plural': true`. `parse` (without time) or `timeParse` (with time) are the main parsable formats that will be compiled into regular expressions, and should be fairly straightforward. `tokens` are arbitrary tokens such as `of` in English or `la` in French that can be used in the parsing formats but carry no value. `past`, `future`, `duration` and `relative` are output formats that allow tokens but may also be functions for grammatically complex languages. See [Russian](locales/ru.js) for example usage. `modifiers` should be easy to reason about, see [English](lib/date.js#3368) for an advanced example. For the `edge` modifier, values of `-2` and `2` are the beginning of the unit and end of the unit respectively, where a value of `1` will effectively reset the time, so is used for the "last day of ...", which is not exactly the edge. `-1` is at the moment unused.

If you do add or tweak a locale, please contribute your changes! If possible, add a [locale unit test](test/tests/locales/) for your submission asserting the correct formats and send a pull request with your changes.

**Date Formats**

If you need to add custom formats, the best way is to tweak the locale file (and contribute back!). However `Date.addFormat` also exists as a low-level runtime alternative. It allows a string to be passed that will be compiled into a regular expression whose capturing groups will map to an array of tokens:

```javascript
Sugar.Date.addFormat('(\\d{2})#(\\d{2})#(\\d{4})', ['month', 'date', 'year'], 'en');
Sugar.Date.create('12#26#2016'); // Sun Dec 25 2016 00:00:00
```

Values allowed in the token array are anything allowed in locale formats:

- Units like `year`, `month`, `weekday`, etc.
- `num`, which is used together with a unit for formats like `2 weeks ago`
- Modifiers as seen in the locale files, such as `day`, `sign`, `edge`, or `shift`.
- `ampm`


## Timezones

Accurate handling of timezones is very complex and outside the scope of Sugar. However, there are helper methods to [force internal use of UTC methods](http://sugarjs.com/docs/Date/setUTC), and it is also possible to [override the internal date constructor](http://sugarjs.com/docs/Sugar/newDateInternal) to allow specialized libraries like [TimezoneJS](https://github.com/mde/timezone-js) to hook into Sugar and play nicely together.


## Defining Methods

Sugar now makes it easy to define your own methods. This is aimed at developers hoping to release their own plugins with Sugar. After defining methods, they can be used in any of the 3 [modes](#usage):

```javascript
Sugar.Number.defineStatic('randomish', function () {
  if (Math.random() > .5) {
    return Math.random();
  } else {
    return 1;
  }
});

Sugar.Number.defineInstance({
  'square': function (n) {
    return n * n;
  },
  'cube': function (n) {
    return n * n * n;
  }
});

Sugar.Number.square(3);         // 9
new Sugar.Number(5).cube().raw; // 125
Sugar.Number.randomish()        // ???

Sugar.extend();
(2).square();       // 4
(4).cube();         // 64
Number.randomish(); // ???

```

See the [docs](http://sugarjs.com/docs/Sugar) for options and other helpers.

## Contributing

If you would like to issue a pull request, please first consider adding well formed [unit tests](test/tests/). These tests can be run directly in the browser from the [test/browser/](test/browser/) directory or in node with `npm test`.
