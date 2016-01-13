(function(global, __filename) {
  'use strict';

//- Level: Major
  //- `Object.equal` is renamed to `Object.isEqual` in both the static and instance method types.

//- Level: Major
  //- `String#has` is now removed in favor of `String#contains` to be in compliance with the ES6 spec. For more complex string checking, use `String#match` with standard regexes instead.

//- Level: Major
  //- `Date.past`, `Date.future`, `Date.utc.create`, `Date.utc.past`, and `Date.utc.future` are all deprecated. Instead, pass an options object as the last argument to `Date.create` with the equivalent properties. For example: `Date.create('March', { future: true, fromUTC: true, locale: 'ja' })`, etc. Additionally, the `utc` parameter is now `fromUTC` and a new parameter `setUTC` has been added to clear up confusion about what the flag was doing. `fromUTC` assumes the input to be UTC but the output is a normal Javascript local date. `setUTC` sets an internal flag which tells Sugar to use utc methods like `getUTCHours`.

//- Level: Major
  //- `Date#utc` is now `Date#setUTC`, and now requires explicitly passing `true` as the first argument to set the flag to true.

//- Level: Major
  //- `String#startsWith` and `String#endsWith` are now more in compliance with the ES6 spec. They now no longer accept a RegExp (will throw an error) or a `case` parameter. If you need to do more complex string checking, use `String#match` with standard regexes instead. Also minor differences in the way the starting/ending positions are coerced may also be present.

//- Level: Major
  //- `Object.reduce` is now deprecated. Use `Array#reduce` together with `Object.keys` instead.

//- Level: Major
  //- `Object.merge` now takes an options object instead of a list of arguments. The 3rd argument is now "deep" in the options hash, and the 4th is "resolve". Resolver functions will now abort the merge (for a single property) if `undefined` is the return value. To tell the resolver function to continue as normal, return the `Sugar` global object instead. Any non-undefined value returned by the function will now resolve the conflict completely and will not continue traversing into it when in "deep" mode. To tell the resolver function to continue with the merge, return the Sugar global object instead.

//- Level: Major
  //- `String#assign` is now `String#format`, and behaves very closely to Python's method of the same name. Tokens are now zero based, and start with `{0}`. Also, errors will be thrown when tokens cannot be matched. Braces can now be escaped by repeating them. Lastly, multiple objects passed will no longer be merged together. Instead either access with new dot syntax (0.prop) or merge together with Object.merge beforehand.

//- Level: Major
  //- `Array#randomize` was renamed to `Array#shuffle`.

//- Level: Major
  //- `Array.create` was removed. Use ES6 method `Array.from` instead. Sugar provides this as a polyfill in the default bundle.

//- Level: Major
  //- `Object.watch` was removed. This method was the only part of Sugar that was not 100% compatible in all environments, and was an overly simplistic solution to a difficult problem that others have done better (see discussions around Object.observe and polling). As a quick and dirty solution, this will be made available as a [plugin](https://github.com/andrewplummer/sugar-plugins). Also includes `Object.unwatch`.

//- Level: Major
  //- `Function#after` has changed behavior. Previously it would fire every `n` times. Now it will fire after `n` calls. Additionally it will not immediately fire when `0` is passed.

//- Level: Major
  //- `Function#fill` was renamed to `Function#partial`. Additionally, it no longer accepts `null` as a placeholder. Use `undefined` instead.

//- Level: Major
  //- `Array#findAll` was replaced with `Array#filterFrom` in cases that require a start index. For cases without a start index, simply use `Array#filter` instead.

//- Level: Major
  //- `Array#add` is now non-destructive. To append to the array in place, use `Array#append`.

//- Level: Major
  //- `Array#include` was removed as it is now identical to `Array#add`.

//- Level: Major
  //- `Object.findAll` was replaced with `Object.filter`, which simply wraps an enhanced `Array#filter`.

//- Level: Major
  //- `Object.toQueryString` no longer uses square bracket syntax by default. To enable this pass `deep` in the options object which is now the second argument to the function. `namespace`, which was previously the second argument to this method, is now `prefix` in the same options object.

//- Level: Major
  //- `Object.fromQueryString` now performs "smart" conversion of numerals, booleans, and multiple keys by default. To turn this off, pass `smart: false` in the options object which is now the second argument to the function. Deep bracket syntax (`[]` in keys) is now off by defualt but can be enabled with `deep` on the options object.

//- Level: Major
  //- `Date#format` shortcuts ("short", "long", "full", etc) have significantly changed. See the docs for the new formats. Tokens `f`, `fff`, `izotz`, and `ord`, have been replaced with `S`, `SSS`, `Z`, and `do` to align better with Moment/LDML. `Dow` and `Mon` were previously always 3 characters and uppercased. Both of these are now locale dependent, as certain locales may prefer different casing or abbreviation length. Lowercased formats `dow` and `mon` are also locale-dependent in length, but always lowercased.

//- Level: Major
  //- `RegExp#addFlag` and `RegExp#removeFlag` are now `RegExp#addFlags` and `RegExp#removeFlags` and now work on multiple flags at once.

//- Level: Moderate
  //- `Number#format` no longer accepts arguments for the thousands separator and decimal point. Instead these can now be set on the global object Sugar.Number.thousands and Sugar.Number.decimal. These will also be respected by Number#abbr, Number#metric, and Number#bytes as well.

//- Level: Moderate
  //- Alphanumeric array options are now defined on the global object `Sugar.Array` instead of `Array` itself.

//- Level: Moderate
  //- `String#map` was removed. This functionality can easily be replicated by mapping an array, and even more succinctly by using `Function#partial`.

//- Level: Moderate
  //- `String#normalize` is now renamed to `String#toAscii` to comply with the ES6 spec.

//- Level: Moderate
  //- `Date#beginning/endOfWeek` is now locale dependent, as different locales have different definitions of the start of a week. Currently, this is Monday except for en-US and ja, which are Sunday.

//- Level: Moderate
  //- `Array#at` and `String#at` now no longer accept enumerated arguments. To get an multiple indexes, pass an array instead.

//- Level: Moderate
  //- Array natural sort options (`AlphanumericSortOrder`, `AlphanumericSortIgnore`, etc) now no longer have `Alphanumeric` in the name, and are now static accessor methods on `Sugar.Array` that either get or set the option depending on argument length. Lastly, `AlphanumericSort`, which simply exposed Sugar's internal sort algorithm is now `sortCollate`.

//- Level: Moderate
  //- `Object.select` and `Object.reject` now, when passed an object as a matcher, only check for key existence, not whether values also match or not. To do the "intersect" operation that these methods previously performed, `Object.filter`, `Object.remove`, or `Object.exclude` can instead be used.

//- Level: Minor
  //- `Array#remove` and `Array#exclude` no longer accept enumerated paramters. To remove multiple elements, depending on the type a regex or function may be used. Otherwise the method must be called multiple times.

//- Level: Minor
  //- `Date.create` no longer accepts enumerated parameters (2001, 5, 31, ...). Use the normal date constructor instead.

//- Level: Minor
  //- `Number#metric` now uses a "units" string instead of the "limit" argument, which allows a more flexible, intuitive way to define custom units and min/max ranges. Check the docs for more about this.

//- Level: Minor
  //- `Date#set` now rewinds dates that have accidentally traversed into a new month, such as setting `{ month: 1 }` on `January 31st`. This behavior was previously only on `advance` and `rewind`.

//- Level: Minor
  //- `String#escapeHTML` now double escapes entities, meaning '&amp;' will become '&amp;amp;', etc.

//- Level: Minor
  //- `Date.SugarNewDate` is now `Sugar.Date.newDateInternal`. This method is always on the `Sugar` global (not `Date`).

//- Level: Minor
  //- `Object.map`, `Object.each`, and `Object.size` were moved to the Object module from the Array module. If you were using these methods and making custom builds you may have to include the Object module now as well.

//- Level: Minor
  //- `Date#unitSince` (`Date#hoursSince`, etc) now assumes that the passed in format is UTC if the context date is also flagged as UTC (if you're using `setUTC`). This behavior can be overriden by passing `{ fromUTC: false }` to these methods.

//- Level: Minor
  //- `Object.clone` now clones both non-enumerable properties if they exist and the attribute accessors "get" and "set".

//- Level: Minor
  //- `Array#isEmpty` now does a simple check if the length is zero. To also check if `undefined`, `null`, or `NaN` are present, use `Array#compact` first.

//- Level: Minor
  //- `Object.fromQueryString` now returns a plain object. If you want an extended object call `Object.extended` on the result.

//- Level: Minor
  //- `String#stripTags` and `String#removeTags` no longer accept enumerated arguments. Simply pass an array of tags to remove multiple.

//- Level: Minor
  //- `String#titleize` was moved from the Inflections module to String.

//- Level: Very Minor
  //- `Array#map`, `Array#unique`, `Array#groupBy`, `Array#min`, `Array#max`, `Array#least`, `Array#most`, `Array#sortBy`: Mapping shortcut strings now accept deep matchers with the dot `.` token. If you have objects that use `.` in the keys and are using these methods, be careful as this now makes the methods try to go deep. Pass a function instead to map as before.

//- Level: Very Minor
  //- Some minor behavior changes around the way `String#removeTags` works on malformed html. Unmatched closing tags are removed.

//- Level: Very Minor
  //- `String#hankaku` and `String#zenkaku` now don't take multiple arguments for modes. Just mix them together in the first argument as a string. See docs for more.



  var SHORT_TRUNCATE = 100;
  var notified = {};
  var isNotifying;


  function setCurrentFilename() {
    if (!__filename) {
      var scripts = document.getElementsByTagName('script');
      __filename = scripts[scripts.length - 1].src;
    }
  }

  function getCaller() {
    var stack = new Error().stack.split('\n'), i = 0, match;
    stack.shift();
    while (stack[i].match(__filename)) {
      i++;
    }
    match = stack[i].match(/[@ ]\(?(\S+):(\d+):(\d+)\)?$/);
    return {
      src: match[1],
      line: match[2],
      char: match[3],
      short: match[1].split('/').slice(-3).join('/')
    }
  }

  function pad(str, len, fromLeft) {
    var left = fromLeft ? str.slice(-len) : str.slice(0, len);
    return left + new Array(Math.max(0, len - str.length + 1)).join(' ');
  }

  function truncate(left, right) {
    var ellipsis = '...  ', cols, lcols;
    cols = typeof process !== 'undefined' && process.stdout.columns || 160;
    right = pad(right, Math.floor(cols * .33), true);
    lcols = cols - right.length;
    if (left.length > lcols - ellipsis.length) {
      left = left.slice(0, lcols - ellipsis.length) + ellipsis;
    } else {
      left = pad(left, lcols);
    }
    return left + right;
  }

  function notify(message, logLevel) {
    if (SUGAR_UPGRADE_UNIQUE_MESSAGES && message in notified) {
      return;
    }
    var caller = getCaller();
    notified[message] = true;
    if (SUGAR_UPGRADE_SHOW_META_FULL) {
      message += '\n';
      message += '\n----------- File: ' + caller.src + ' ---------';
      message += '\n----------- Line: ' + caller.line + ' --------------';
      message += '\n----------- Char: ' + caller.char + ' --------------';
      message += '\n----------- Docs: http://sugarjs.com/api/' + docs + ' ---------';
    } else {
      message = truncate(message, caller.src + ':' + caller.line + ':' + caller.char);
    }
    log(message, logLevel);
  };

  function getDateOptions(future, utc) {
    return function(f, localeCode) {
      var opts = [future ? 'future: true' : 'past: true'];
      if (utc) {
        opts.push('fromUTC: true');
      }
      if (localeCode) {
        opts.push('locale: "' + localeCode + '"');
      }
      return 'Date.create("' + f + '", { ' + opts.join(', ') + ' })';
    }
  }

  function thirdIsBoolean(a, b, c) {
    return typeof c === 'boolean';
  }

  function isClass(obj, klass) {
    return Object.prototype.toString.call(obj) === '[object ' + klass + ']';
  }

  function firstIsRegExp(a) {
    return isClass(a, 'RegExp');
  }


  var METHODS = [
    {
      type: 'Object',
      sName: 'equal',
      message: 'Object.equal was renamed to Object.isEqual.',
    },
    {
      type: 'Object',
      iName: 'equals',
      message: 'Object#equals was renamed to Object#isEqual.',
    },
    {
      type: 'String',
      iName: 'has',
      message: 'String#has was renamed to String#includes for ES6 compliance. The native method only takes a string, however Sugar optionally enhances it to allow regexes.',
    },
    {
      type: 'Date',
      sName: 'past',
      call: getDateOptions(),
      message: 'Date.past was removed. New equivalent: %call%.',
    },
    {
      type: 'Date',
      sName: 'future',
      message: 'Date.future was removed. New equivalent: %call%.',
      call: getDateOptions(true),
    },
    {
      type: 'Date.utc',
      sName: 'past',
      call: getDateOptions(false, true),
      message: 'Date.utc.past was removed. New equivalent: %call%.',
    },
    {
      type: 'Date.utc',
      sName: 'future',
      call: getDateOptions(true, true),
      message: 'Date.utc.future was removed. New equivalent: %call%.',
    },
    {
      type: 'Date',
      iName: 'utc',
      message: 'Date#utc is now Date#setUTC, and requires an explicit boolean flag.',
    },
    {
      type: 'String',
      iName: 'startsWith,endsWith',
      check: firstIsRegExp,
      message: 'String#%name% | RegExp matching was removed for ES6 compliance. Use standard regex methods "match" or "test" here. Additionally, Sugar also optionally enhances String#includes to allow regexes, which simply calls "test" under the hood.',
    },
    {
      type: 'String',
      iName: 'startsWith,endsWith',
      check: thirdIsBoolean,
      message: 'String#%name% | Third "case" argument was removed for ES6 compliance. Use standard regex methods for case sensitivity. Additionally, Sugar also optionally enhances String#includes to allow regexes, which simply calls "test" under the hood.',
    }
  ];

  var ANSI = typeof process !== 'undefined' &&
      (process.platform === 'win32' ||
      'COLORTERM' in process.env ||
      /^xterm-256(?:color)?/.test(process.env.TERM) ||
      /^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM));


  function log(message, logLevel) {
    if (logLevel === 'warn' && ANSI) {
      message = '\x1b[33m' + message +'\x1b[0m';
    }
    console[logLevel](message);
  }

  function wrapMethod(method) {

    var type = method.type;
    var ns = getNamespace(type);

    function getNamespace(type) {
      return type.split('.').reduce(function(ns, name) {
        return ns[name];
      }, global);
    }

    function getFullName(target, name) {
      return (target === ns ? type : type + '.prototype') + '.' + name;
    }

    function wrapper(target, name) {
      var fn = target[name];
      var fullName = getFullName(target, name);
      target[name] = function() {
        var canNotify, message, result;
        canNotify = !method.check || method.check.apply(this, arguments);
        message = method.message.replace(/%name%/g, name);
        if (method.call) {
          message = message.replace(/%call%/g, method.call.apply(this, arguments));
        }
        if (canNotify && !isNotifying) {
          // Preventing nested notifications means that we don't have to
          // worry about detecting Sugar in the call stack as any call other
          // than the main entry point must be Sugar calling itself.
          isNotifying = true;
          notify(message, method.level || 'warn');
          result = fn ? fn.apply(this, arguments) : null;
          isNotifying = false;
          return;
        }
        return fn ? fn.apply(this, arguments) : null;
      }
    }

    function wrapForEach(target, name) {
      name.split(',').forEach(function(n) {
        wrapper(target, n);
      });
    }

    if (method.sName) {
      wrapForEach(ns, method.sName);
    }
    if (method.iName) {
      wrapForEach(ns.prototype, method.iName);
    }
  };

  function supplant(str, obj) {
    var val;
    return  str.replace(/\{(.+?)\}/g, function(m, d) {
      val = obj[d];
      return val !== undefined ? jsonify(val) : m;
    });
  }

  function jsonify(o){
    if (typeof JSON != 'undefined') {
      return JSON.stringify(o);
    } else {
      return o.toString();
    }
  }

  function setDefault(name, defaultValue) {
    if (global[name] === undefined) {
      global[name] = defaultValue;
    }
  }

  function init(soft) {
    var sugarLoaded = !!Object.SugarMethods;

    setCurrentFilename();

    if (!sugarLoaded && soft) {
      //  Sugar not loaded yet, so initialize again after page load...
      return typeof window !== 'undefined' ? window.addEventListener('load', init) : setTimeout(init);
    }

    for (var i = 0; i < METHODS.length; i++) {
      wrapMethod(METHODS[i])
    }

    var welcome = [
      '### Welcome to the Sugar upgrade script! ###\n\n',
      "As your program calls various methods, it will warn you about incompatibilities with Sugar, and give\n",
      'suggestions about how to refactor. You can run this before refactoring to get a general idea about what needs to change\n',
      'or you can immediately remove Prototype/Underscore for Sugar, let breakages happen, and fix as you go!',
      '\n\nAnalyzer options (set these as globals):\n\n',
      'SUGAR_UPGRADE_UNIQUE_MESSAGES    = true/false       |  Display each message only once (default is false)\n',
      'SUGAR_UPGRADE_SHOW_META_FULL     = true/false       |  Show multi-line metadata with docs link (default is true).\n',
      "SUGAR_UPGRADE_EXCLUDES           = ['a', 'b', ...]  |  Array of filenames to exclude messages from (default is [], can be partial match, leave off .js at the end)\n",
      'SUGAR_UPGRADE_INFO               = true/false       |  Display messages even when methods do not conflict (default is true)'
    ].join('\n');
    //welcome += '\n\n#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#';
    //console.info(welcome + '\n\n\n');
    //console.info('-------------------------------------------------------------------------------------------------------------------');
  }

  setDefault('SUGAR_UPGRADE_SHOW_META_FULL',  false);
  setDefault('SUGAR_UPGRADE_UNIQUE_MESSAGES', false);
  setDefault('SUGAR_UPGRADE_INFO', true);
  setDefault('SUGAR_UPGRADE_EXCLUDES', []);

  init(true);

})(typeof global !== 'undefined' ? global : this, typeof __filename !== 'undefined' ? __filename : null);
