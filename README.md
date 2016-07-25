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
- [npm](#npm)
- [Modules](#modules)
- [Custom Builds](#custom-builds)
- [Date Locales](#date-locales)
- [Timezones](#timezones)
- [Defining Methods](#defining-methods)
- [Contributing](#contributing)

---------------------------------------


## Installing

#### [sugar.js](sugar.js) | [sugar.min.js (24kb gz)](sugar.min.js)

`npm install sugar`


## Upgrading

If you are upgrading from v1, there is now an upgrade [helper script](https://sugarjs.com/upgrading)
available that makes upgrading easier by warning you about breaking changes as
your code is run. The [CAUTIONLOG](CAUTION.md) is also available, which is a
vetted changelog showing breaking changes in order of severity.

## Documentation

#### [https://sugarjs.com/docs/](https://sugarjs.com/docs/)

## Getting Started

#### [https://sugarjs.com/quickstart/](https://sugarjs.com/quickstart/)

## npm

The sugar npm package allows methods as well as entire modules to be required
individually. If you are using a build tool like Browserify, this will make it
simple to create smaller custom builds without going through the download page.
All packages also include pre-built distributions in the `dist/` directory.

In addition to the main `sugar` package, there are also packages separated by
Sugar module, i.e. `sugar-date`, `sugar-array`, etc.

When an entry point is required (the package name or entire modules), it will
return a reference to `Sugar`, which is equivalent to the global object in the
browser. All methods will be defined on this object and can be called as normal.
Requiring an individual method will define it on `Sugar` and additionally return
a reference to its static form that can be called immediately:


```javascript
// Require all modules
var Sugar = require('sugar');

Sugar.Number.round(3.1415);

// Require only the Number module
var Sugar = require('sugar/number');

Sugar.Number.round(3.1415);

// Require only the "round" method
var round = require('sugar/number/round');
round(3.1415);
```

As the npm package is designed with node in mind, polyfills must be explicitly
required (the `sugar` entry point will not include them), and will immediately
apply themselves if the methods they polyfill are missing.

```javascript
// Require and apply ES6 polyfills
require('sugar/polyfills/es6');
```

## Modules

Although Sugar builds can now be customized at method level, modules are still
used as an intuitive way of grouping similar methods. Sugar npm packages make
use of modules, both in the main `sugar` package as well as individual module
packages beginning with `sugar-`. The following modules are available:

##### Default:

- [Date](https://sugarjs.com/docs/#/Date)
- [String](https://sugarjs.com/docs/#/String)
- [Array](https://sugarjs.com/docs/#/Array)
- [Object](https://sugarjs.com/docs/#/Object)
- [Function](https://sugarjs.com/docs/#/Function)
- [Number](https://sugarjs.com/docs/#/Number)
- [RegExp](https://sugarjs.com/docs/#/RegExp)
- [Enumerable](lib/enumerable.js) (shared methods on Array and Object)
- [Range](https://sugarjs.com/docs/#/Range) (String, Number, and Date ranges)
- [ES6](#polyfills) (Polyfills)
- [ES7](#polyfills) (Polyfills)

##### Non-default:

- [ES5](#polyfills) (Adds IE6-8 Support)
- [Language](lib/language.js) (Character conversion and script detection)
- [Inflections](lib/inflections.js) (Pluralization and string normalization)

Non-default modules are excluded from the main Sugar build, but can be added by
creating a [custom build](#custom-builds). The main npm package includes the ES5
module, polyfills are disabled by default and must be explicitly required.
Other non-default modules can be found individually (i.e. `sugar-language`, etc).

## Custom Builds

#### [https://sugarjs.com/download/](https://sugarjs.com/download/)

Custom browser builds can be created on the site download page. In addition,
tools like Browserify can also be used to create custom builds, as npm packages
are now fully modular. The main repo also has tasks to create custom builds as
well. Simply clone and run `gulp`.

## Date Locales

Locale definition files are in the [locales](locales/) directory. They can be
simply included as-is after Sugar is loaded, or built together using
[custom builds](#custom-builds). English is included by default and required by
the Date module. Currently available locales are:

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

##### Adding/Customizing Locales

If a locale or format is missing, it can easily be added by modifying or adding
the definition. See [this guide](https://sugarjs.com/docs/#/DateLocales) for
more on this.

Please consider contributing any changes made back to the community!


## Timezones

Sugar does not deal with timezone abbreviations. Timezone offsets will be
correctly parsed if they are in ISO-8601 format (+09:00, +0900, or Z for UTC),
however if an abbreviation like PST exists it will be ignored. Sugar however
plays nicely with other libraries that offer full timezone support such as
[timezone.js](https://github.com/mde/timezone-js).

`Date.create` allows two options for dealing with UTC dates. `fromUTC` will
parse the string as UTC, but return a normal date. In contrast, `setUTC` tells
Sugar to use methods like `getUTCHours` when handling the date, and is usually
used when the date needs to be formatted as UTC. Native methods like `getHours`
still return local values.

## Defining Methods

Sugar now makes it easy to define your own methods. This is aimed at developers
hoping to release their own plugins with Sugar. After defining methods, they can
be extended or used as chainables just like other methods:

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

See the [docs](https://sugarjs.com/docs/#/Sugar) for options and other helpers.

## Contributing

If you would like to issue a pull request, please first consider adding well
formed [unit tests](test/tests/). These tests can be run directly in the browser
from the [test/browser/](test/browser/) directory or in node with `npm test`.
