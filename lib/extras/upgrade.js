(function(exports, global, __filename) {
  'use strict';

  var NODE = typeof process !== 'undefined' && typeof module !== 'undefined';

  var storage = global['localStorage'];

  var ANSI = NODE &&
      (process.platform === 'win32' ||
      'COLORTERM' in process.env ||
      /^xterm-256(?:color)?/.test(process.env.TERM) ||
      /^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM));


  var notified = {};
  var encountered = {};
  var isNotifying;




//- Level: Major
  //- `Object.reduce` is now deprecated. Use `Array#reduce` together with `Object.keys` instead.

//- Level: Major
  //- `Object.merge` now takes an options object instead of a list of arguments. The 3rd argument is now "deep" in the options hash, and the 4th is "resolve". Resolver functions will now abort the merge (for a single property) if `undefined` is the return value. To tell the resolver function to continue as normal, return the `Sugar` global object instead. Any non-undefined value returned by the function will now resolve the conflict completely and will not continue traversing into it when in "deep" mode. To tell the resolver function to continue with the merge, return the Sugar global object instead.

//- Level: Major
  //- `String#assign` is now `String#format`, and behaves very closely to Python's method of the same name. Tokens are now zero based, and start with `{0}`. Also, errors will be thrown when tokens cannot be matched. Braces can now be escaped by repeating them. Lastly, multiple objects passed will no longer be merged together. Instead either access with new dot syntax (0.prop) or merge together with Object.merge beforehand.

//- Level: Major
  //- `Object.watch` was removed. This method was the only part of Sugar that was not 100% compatible in all environments, and was an overly simplistic solution to a difficult problem that others have done better (see discussions around Object.observe and polling). As a quick and dirty solution, this will be made available as a [plugin](https://github.com/andrewplummer/sugar-plugins). Also includes `Object.unwatch`.

//- Level: Major
  //- `Function#after` has changed behavior. Previously it would fire every `n` times. Now it will fire after `n` calls. Additionally it will not immediately fire when `0` is passed.

//- Level: Major
  //- `Function#fill` was renamed to `Function#partial`. Additionally, it no longer accepts `null` as a placeholder. Use `undefined` instead.

//- Level: Major
  //- `Array#findAll` was replaced with `Array#filterFrom` in cases that require a start index. For cases without a start index, simply use `Array#filter` instead.

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
    cols = NODE && process.stdout.columns || 160;
    right = pad(right, Math.floor(cols * .33), true);
    lcols = cols - right.length;
    if (left.length > lcols - ellipsis.length) {
      left = left.slice(0, lcols - ellipsis.length) + ellipsis;
    } else {
      left = pad(left, lcols);
    }
    return left + right;
  }

  function notify(message) {
    var caller = getCaller();
    if (optionMeta()) {
      message += '\n';
      message += '\n----------- File: ' + caller.src + ' ---------';
      message += '\n----------- Line: ' + caller.line + ' --------------';
      message += '\n----------- Char: ' + caller.char + ' --------------';
      message += '\n----------- Docs: http://sugarjs.com/api/nono' + ' ---------';
    } else {
      message = truncate(message, caller.src + ':' + caller.line + ':' + caller.char);
    }
    if (message in notified) {
      // Never show exact same codepoint, regardless of "unique" flag.
      return;
    }
    warn(message);
    notified[message] = true;
  };

  function replay() {
    var count = 0;
    for (var message in notified) {
      if(!notified.hasOwnProperty(message)) continue;
      warn(message);
      count++;
    };
    var s = count === 1 ? '' : 's';
    console.info('########### ' + count + ' Total Warning'+s+' ###########');
  }

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

  function noArguments() {
    return arguments.length === 0;
  }

  var METHODS = [
    {
      type: 'Object',
      sName: 'extend',
      check: noArguments,
      message: 'Object.extend() is now Sugar.Object.extend({ objectPrototype: true });',
    },
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
      type: 'Array',
      iName: 'randomize',
      message: 'Array#randomize was renamed to Array#shuffle.',
    },
    {
      type: 'Array',
      sName: 'create',
      message: 'Array.create was removed. Use native Array.from instead. Sugar provides this as a polyfill in the default bundle.'
    },
    {
      type: 'Array',
      iName: 'add',
      message: 'Array#add is now non-destructive. To append to the array in place, use Array#append. Suppress this warning if it is giving false positives.'
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

  function warn(message) {
    if (ANSI) {
      message = '\x1b[33m' + message +'\x1b[0m';
    }
    console.warn(message);
  }

  function wrapMethod(method) {

    function getNamespace(type) {
      return type.split('.').reduce(function(ns, name) {
        if (!ns[name]) {
          // Create missing namespaces.
          ns[name] = {};
        }
        return ns[name];
      }, global);
    }

    function canNotify(self, args) {
      var wasNotified = method.message in encountered, check;
      check = (!method.check || method.check.apply(self, args)) &&
              (!optionUnique() || !wasNotified);
      if (check) {
        encountered[method.message] = true;
      }
      return check;
    }

    function wrapper(target, name) {
      var fn = target[name];
      target[name] = function() {
        var message, result;

        function exec(self, args) {
          if (!fn) {
            var targetName = method.type + (self === target ? '' : '.prototype');
            throw new Error(['Method', name, 'does not exist on', targetName].join(' '));
          }
          return fn.apply(self, args);
        }

        message = method.message.replace(/%name%/g, name);

        if (method.call) {
          message = message.replace(/%call%/g, method.call.apply(this, arguments));
        }

        if (!isNotifying && canNotify(this, arguments)) {
          // Preventing nested notifications means that we don't have to
          // worry about detecting Sugar in the call stack as any call other
          // than the main entry point must be Sugar calling itself.
          isNotifying = true;
          notify(message);
          result = exec(this, arguments);
          isNotifying = false;
          return result;
        }
        return exec(this, arguments);
      }
    }

    function wrapForEach(target, name) {
      name.split(',').forEach(function(n) {
        wrapper(target, n);
      });
    }

    var ns = getNamespace(method.type);

    if (method.sName) {
      wrapForEach(ns, method.sName);
    }
    if (method.iName) {
      wrapForEach(ns.prototype, method.iName);
    }
  };

  function storageRead(key, val) {
    if (storage) {
      val = !!+(storage.getItem(key) || val);
    }
    return val;
  }

  function storageWrite(key, val) {
    if (storage) {
      storage.setItem(key, +val);
    }
    return val;
  }

  function exportOption(name, val) {
    val = storageRead(name, val);
    function set(newVal) {
      if (typeof newVal !== 'undefined') {
        val = storageWrite(name, newVal);
      }
      return val;
    };
    exports[name] = set;
    return set;
  }

  function init(soft) {

    var sugarFound = !!Object.SugarMethods || typeof Sugar !== 'undefined';

    setCurrentFilename();

    if (!sugarFound && soft) {
      //  Sugar not loaded yet, so initialize again after page load...
      var hardInit = init.bind(this, false);
      warn('Sugar not found! Will retry...');
      return typeof window !== 'undefined' ? window.addEventListener('load', hardInit) : setTimeout(hardInit);
    } else if (!sugarFound) {
      warn('Sugar still not found! Bailing...');
      return;
    }

    for (var i = 0; i < METHODS.length; i++) {
      wrapMethod(METHODS[i])
    }

    if (!optionWelcome()) {
      return;
    }

    var welcome = [
      '',
      '%cUpgrade to Sugar 2.0.0!%c',
      '',
      'This script will monitor your calls to Sugar methods, warn you about incompatibilities,',
      'and help you fix them! Just drop it in to get a general idea of what needs to change, or',
      'upgrade and fix as you go! Set options %OPT%:',
      '',
      'sugarUpgradeMeta(true|false)     Shows multi-line metadata with docs link (currently '+ optionMeta() +').',
      'sugarUpgradeUnique(true|false)   Show same message only once (currently '+ optionUnique() +').',
      'sugarUpgradeWelcome(true|false)  Show this message on load (currently '+ optionWelcome() +').',
      '',
      'sugarUpgradeDetails(N)           Show full details for a given warning (multiple ok).',
      'sugarUpgradeSupress(N)           Suppress a given warning (multiple ok).',
      'sugarUpgradeReplay()             Shows all warnings received so far.',
      '',
      'When upgrading note that prototypes now must be extended explicitly through the global:',
      '',
      'Sugar.extendAll();    %c// Extend all%c',
      'Sugar.Array.extend(); %c// Extend Array methods%c',
      ' ',
    ].join('\n');

    welcome = welcome.replace(/%OPT%/, NODE ? 'with exported methods' : 'in the console');
    if (NODE) {
      welcome = welcome.replace(/^sugarUpgradeWelcome.+\n/m, '');
      console.log(welcome.replace(/%c/g, ''));
    } else {
      var h1 = 'font-size:1.4em;background-color:#5886b9;color:#ffffff;padding:2px 8px;border-radius:2px;';
      var p  = 'font-size:1.1em;line-height:1.6em;color:#333;';
      var c  = 'font-size:1.1em;line-height:1.6em;color:#999;';
      console.log.call(console, welcome, h1, p, c, p, c, p);
    }
  }

  var optionMeta    = exportOption('sugarUpgradeMeta', false);
  var optionUnique  = exportOption('sugarUpgradeUnique', true);
  var optionWelcome = exportOption('sugarUpgradeWelcome', true);

  exports['sugarUpgradeReplay'] = replay;

  init(true);

})(this, typeof global !== 'undefined' ? global : this, typeof __filename !== 'undefined' ? __filename : null);
