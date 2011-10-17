(function() {

  // defineProperty exists in IE8 but will error when trying to define a property on
  // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
  var definePropertySupport = Object.defineProperty && Object.defineProperties;

  var extend = function(klass, instance, override, methods) {
    var extendee = instance ? klass.prototype : klass;
    storeMethods(klass, instance, methods);
    iterateOverObject(methods, function(name, method) {
      if(typeof override === 'function') {
        defineProperty(extendee, name, wrapNative(extendee[name], method, override));
      } else if(override === true || !extendee[name]) {
        defineProperty(extendee, name, method);
      }
      klass.SugarMethods[name] = { instance: instance, method: method };
    });
  };

  var storeMethods = function(klass, instance, methods) {
    if(klass.SugarMethods) return;
    klass.SugarMethods = {};
    defineProperty(klass, 'sugar', function() {
      var args = arguments, all = args.length === 0;
      iterateOverObject(klass.SugarMethods, function(name, m) {
        if(all || arrayFind(args, name)) {
          defineProperty(m.instance ? klass.prototype : klass, name, m.method);
        }
      });
    });
  }

  var wrapNative = function(nativeFn, extendedFn, condition) {
    return function() {
      if(nativeFn && (condition === true || condition.apply(this, arguments))) {
        return nativeFn.apply(this, arguments);
      } else {
        return extendedFn.apply(this, arguments);
      }
    }
  };

  var defineProperty = function(target, name, method) {
    if(definePropertySupport) {
      Object.defineProperty(target, name, { value: method, configurable: true, enumerable: false, writeable: true });
    } else {
      target[name] = method;
    }
  };

  var iterateOverObject = function(obj, fn) {
    var count = 0;
    for(var key in obj) {
      if(!obj.hasOwnProperty(key)) continue;
      fn.call(obj, key, obj[key], count);
      count++;
    }
  };

  var arrayEach = function(arr, fn, index, loop, sparse) {
    var length, index, i;
    checkCallback(fn);
    i = toIntegerWithDefault(index, 0);
    length = loop === true ? arr.length + i : arr.length;
    while(i < length) {
      index = i % arr.length;
      if(!(index in arr) && sparse === true) {
        return iterateOverSparseArray(arr, fn, i, loop);
      } else if(fn.call(arr, arr[index], index, arr) === false) {
        break;
      }
      i++;
    }
  };

  var arrayFind = function(arr, f, fromIndex, loop, returnIndex) {
    var result, index;
    arrayEach(arr, function(el, i, arr) {
      if(multiMatch(el, f, arr, [i, arr])) {
        result = el;
        index = i;
        return false;
      }
    }, fromIndex, loop);
    return returnIndex ? index : result;
  };

  var multiMatch = function(el, match, scope, params) {
    if(el === match) {
      // Return if exact match
      return true;
    } else if(Object.isRegExp(match)) {
      // Match against a regexp
      return match.test(el);
    } else if(Object.isFunction(match)) {
      // Match against a filtering function
      return match.apply(scope, [el].concat(params));
    } else if(typeof match === 'object') {
      // Match against a hash or array.
      return deepEquals(match, el);
    } else {
      // Otherwise false
      return false;
    }
  };


  var checkCallback = function(fn) {
    if(!fn || !fn.call) {
      throw new TypeError('Callback is not callable');
    }
  };

  var toIntegerWithDefault = function(i, d) {
    if(isNaN(i)) {
      return d;
    } else {
      return parseInt(i >> 0);
    }
  };

  var transformArgument = function(args, el, scope, params) {
    var transform = args[0];
    if(args.length === 0) {
      return el;
    } else if(!Object.isFunction(transform) && !Object.isString(transform)) {
      throw new TypeError('First argument must be a function or a string');
    }
    if(Object.isFunction(transform)) {
      return transform.apply(scope, [el].concat(params));
    } else if(typeof el[transform] == 'function') {
      return el[transform].call(el);
    } else {
      return el[transform];
    }
  };

  var checkFirstArgumentExists = function(args) {
    if(args.length === 0) {
      throw new TypeError('First argument must be defined');
    }
  };

  var multiArgs = function(args, fn) {
    arrayEach(Array.prototype.slice.call(args).flatten(), fn);
  };

  var getRange = function(start, stop, fn, step) {
    var arr = [], i = parseInt(start), up = step > 0;
    while((up && i <= stop) || (!up && i >= stop)) {
      arr.push(i);
      if(fn) fn.call(this, i);
      i += step;
    }
    return arr;
  };

  // Match patched to support non-participating capturing groups.
  var NPCGMatch = function(str, reg) {
    if(!str || !str.match) return null;
    var match = str.match(reg);
    if(match && !RegExp.NPCGSupport && !reg.global) {
      for(var i = 1; i < match.length; i++) {
        if(match[i] === '') match[i] = undefined;
      }
    }
    return match;
  };


  /***
   * Object module
   *
   * Much thanks to "kangax" for his informative aricle about how problems with instanceof and constructor
   * http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
   *
   ***/

  var instance = function(obj, str) {
    return Object.prototype.toString.call(obj) === '[object '+str+']';
  };

  var typeMethods = ['Array','Boolean','Date','Function','Number','String','RegExp'];
  var hashMethods = ['keys','values','each','merge','isEmpty','equals','watch'];

  /***
   * @method Object.is[Type](<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is an object of that type.
   * @extra %isObject% will return false on anything that is not an object literal, including instances of inherited classes.
   * @example
   *
   *   Object.isArray([1,2,3])            -> true
   *   Object.isDate(3)                   -> false
   *   Object.isRegExp(/wasabi/)          -> true
   *   Object.isObject({ broken:'wear' }) -> true
   *
   ***
   * @method Object.isArray()
   * @set isType
   ***
   * @method Object.isBoolean()
   * @set isType
   ***
   * @method Object.isDate()
   * @set isType
   ***
   * @method Object.isFunction()
   * @set isType
   ***
   * @method Object.isNumber()
   * @set isType
   ***
   * @method Object.isString()
   * @set isType
   ***
   * @method Object.isRegExp()
   * @set isType
   ***
   * @method Object.isObject()
   * @set isType
   ***/
  var buildObject = function() {
    buildTypeMethods();
    buildHashMethods();
  }

  var buildTypeMethods = function() {
    var methods = {};
    typeMethods.slice(1).forEach(function(m) {
      methods['is' + m] = function(obj) {
        return instance(obj, m);
      };
    });
    extend(Object, false, false, methods);
  };

  var buildHashMethods = function() {
    hashMethods.forEach(function(m) {
      defineProperty(Hash.prototype, m, function() {
        return Object[m].apply(null, [this].concat(Array.prototype.slice.call(arguments)));
      });
    });
  };

  var Hash = function(obj) {
    var self = this;
    iterateOverObject(obj, function(key, value) {
      self[key] = value;
    });
  }

  Hash.prototype.constructor = Object;

  extend(Hash, true, false, {
    'clone': function(deep) {
      return cloneObject(this, deep, true);
    }
  });


  extend(Object, false, false, {

    'extended': function(obj) {
      return new Hash(obj);
    },

    'isObject': function(o) {
      if(o === null || o === undefined || arguments.length === 0) {
        return false;
      } else {
        return instance(o, 'Object') && o.constructor === Object;
      }
    },


    'merge': function() {
      var target = arguments[0];
      multiArgs(arguments, function(a) {
        if(typeof a !== 'object') return;
        iterateOverObject(a, function(key, value) {
          target[key] = value;
        });
      });
      return target;
    },


    'each': function(obj, fn) {
      iterateOverObject(obj, function(k,v) {
        if(fn) fn.call(obj, k, v, obj);
      });
      return obj;
    },

  });



  /***
   * Array module
   *
   ***/



  extend(Array, true, function() { return arguments.length === 0 || Object.isFunction(arguments[0]); }, {

    'map': function(f, scope) {
      var length = this.length, index = 0, result = new Array(length);
      checkFirstArgumentExists(arguments);
      while(index < length) {
        if(index in this) {
          result[index] = transformArgument(arguments, this[index], scope, [index, this]);
        }
        index++;
      }
      return result;
    },

  });

  extend(Array, true, false, {

    'groupBy': function() {
      var result = Object.extended(), args = arguments, key;
      arrayEach(this, function(el) {
        key = transformArgument(args, el);
        if(!result[key]) result[key] = [];
        result[key].push(el);
      });
      return result;
    },

    'compact': function(all) {
      var result = [];
      arrayEach(this, function(el, i) {
        if(Array.isArray(el)) {
          result.push(el.compact());
        } else if(all && el) {
          result.push(el);
        } else if(!all && el !== undefined && el !== null && (typeof el != 'number' || !isNaN(el))) {
          result.push(el);
        }
      });
      return result;
    },

    'flatten': function() {
      var result = [];
      arrayEach(this, function(el) {
        if(Array.isArray(el)) {
          result = result.concat(el.flatten());
        } else {
          result.push(el);
        }
      });
      return result;
    },

    'clone': function() {
      return this.concat();
    },

    'removeAt': function(start, end) {
      if(start === undefined) return this;
      if(end === undefined) end = start;
      for(var i = 0; i <= (end - start); i++) {
        this.splice(start, 1);
      }
      return this;
    },


  });

  var padString = function(str, p, left, right) {
    var padding = String(p);
    if(padding != p) {
      padding = '';
    }
    if(!Object.isNumber(left))  left = 1;
    if(!Object.isNumber(right)) right = 1;
    return padding.repeat(left) + str + padding.repeat(right);
  };

  var convertCharacterWidth = function(str, args, reg, table) {
    var mode = Array.prototype.slice.call(args).join('');
    mode = mode.replace(/all/, '').replace(/(\w)lphabet|umbers?|atakana|paces?|unctuation/g, '$1');
    return str.replace(reg, function(c) {
      if(table[c] && (!mode || mode.has(table[c]['type']))) {
        return table[c]['to'];
      } else {
        return c;
      }
    });
  }


  var ZenkakuTable = {};
  var HankakuTable = {};
  var allHankaku   = /[\u0020-\u00A5]|[\uFF61-\uFF9F][ﾞﾟ]?/g;
  var allZenkaku   = /[\u3000-\u301C]|[\u301A-\u30FC]|[\uFF01-\uFF60]|[\uFFE0-\uFFE6]/g;
  var hankakuPunctuation  = '｡､｢｣¥¢£';
  var zenkakuPunctuation  = '。、「」￥￠￡';
  var voicedKatakana      = /[カキクケコサシスセソタチツテトハヒフヘホ]/;
  var semiVoicedKatakana  = /[ハヒフヘホヲ]/;
  var hankakuKatakana     = 'ｱｲｳｴｵｧｨｩｪｫｶｷｸｹｺｻｼｽｾｿﾀﾁﾂｯﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔｬﾕｭﾖｮﾗﾘﾙﾚﾛﾜｦﾝｰ･';
  var zenkakuKatakana     = 'アイウエオァィゥェォカキクケコサシスセソタチツッテトナニヌネノハヒフヘホマミムメモヤャユュヨョラリルレロワヲンー・';


  var buildWidthConversionTables = function() {
    var hankaku;
    arrayEach(widthConversionRanges, function(r) {
      r.start.upto(r.end, function(n) {
        setWidthConversion(r.type, n.chr(), (n + r.shift).chr());
      });
    });
    zenkakuKatakana.each(function(c, i) {
      hankaku = hankakuKatakana.charAt(i);
      setWidthConversion('k', hankaku, c);
      if(voicedKatakana.test(c)) {
        setWidthConversion('k', hankaku + 'ﾞ', c.shift(1));
      }
      if(semiVoicedKatakana.test(c)) {
        setWidthConversion('k', hankaku + 'ﾟ', c.shift(2));
      }
    });
    zenkakuPunctuation.each(function(c, i) {
      setWidthConversion('p', hankakuPunctuation.charAt(i), c);
    });
    setWidthConversion('k', 'ｳﾞ', 'ヴ');
    setWidthConversion('k', 'ｦﾞ', 'ヺ');
    setWidthConversion('s', ' ', '　');
  }

  var setWidthConversion = function(type, half, full) {
    ZenkakuTable[half] = { type: type, to: full };
    HankakuTable[full] = { type: type, to: half };
  };

  var widthConversionRanges = [
    { type: 'a', shift: 65248, start: 65,  end: 90  },
    { type: 'a', shift: 65248, start: 97,  end: 122 },
    { type: 'n', shift: 65248, start: 48,  end: 57  },
    { type: 'p', shift: 65248, start: 33,  end: 47  },
    { type: 'p', shift: 65248, start: 58,  end: 64  },
    { type: 'p', shift: 65248, start: 91,  end: 96  },
    { type: 'p', shift: 65248, start: 123, end: 126 }
  ];


  extend(String, true, false, {

    'has': function(find) {
      return this.search(find) !== -1;
    },


    'shift': function(n) {
      var result = '';
      n = n || 0;
      this.codes(function(c) {
        result += (c + n).chr();
      });
      return result;
    },

    'codes': function(fn) {
      var codes = [];
      for(var i=0; i<this.length; i++) {
        var code = this.charCodeAt(i);
        codes.push(code);
        if(fn) fn.call(this, code, i);
      }
      return codes;
    },

    'repeat': function(num) {
      if(!Object.isNumber(num) || num < 1) {
        return '';
      }
      var str = '';
      for(var i=0; i<num; i++) {
        str += this;
      }
      return str;
    },

    'toNumber': function(base) {
      var str = this.replace(/,/g, '');
      return str.match(/\./) ? parseFloat(str) : parseInt(str, base || 10);
    },

    'capitalize': function(all) {
      var reg = all ? /\b[a-z]/g : /^[a-z]/;
      return this.toLowerCase().replace(reg, function(letter) {
        return letter.toUpperCase();
      });
    },

    'each': function(search, fn) {
      if(Object.isFunction(search)) {
        fn = search;
        search = /./g;
      } else if(!search) {
        search = /./g
      } else if(Object.isString(search)) {
        search = new RegExp(RegExp.escape(search), 'gi');
      } else if(Object.isRegExp(search)) {
        search = search.addFlag('g');
      }
      var match = this.match(search) || [];
      if(fn) {
        for(var i=0; i<match.length; i++) {
          match[i] = fn.call(this, match[i], i) || match[i];
        }
      }
      return match;
    },

    'from': function(num) {
      return this.slice(num);
    },

    'to': function(num) {
      if(num === undefined) num = this.length;
      return this.slice(0, num);
    },

    'hankaku': function() {
      return convertCharacterWidth(this, arguments, allZenkaku, HankakuTable);
    },

    'assign': function() {
      var assign = Object.extended();
      multiArgs(arguments, function(a, i) {
        if(Object.isObject(a)) {
          assign.merge(a);
        } else {
          assign[i+1] = a;
        }
      });
      return this.replace(/\{(.+?)\}/g, function(m, key) {
        return assign[key] || m;
      });
    }


  });

  var round = function(val, precision, method) {
    var fn = Math[method || 'round'];
    var multiplier = Math.pow(10, Math.abs(precision || 0));
    if(precision < 0) multiplier = 1 / multiplier;
    return fn(val * multiplier) / multiplier;
  }

  extend(Number, true, false, {

    'ordinalize': function() {
      var suffix;
      if(this >= 11 && this <= 13) {
        suffix = 'th';
      } else {
        switch(this % 10) {
          case 1:  suffix = 'st'; break;
          case 2:  suffix = 'nd'; break;
          case 3:  suffix = 'rd'; break;
          default: suffix = 'th';
        }
      }
      return this.toString() + suffix;
    },

    'toNumber': function() {
      return parseFloat(this, 10);
    },

    'chr': function() {
      return String.fromCharCode(this);
    },

    'pad': function(place, sign, base) {
      base = base || 10;
      var str = this.toNumber() === 0 ? '' : this.toString(base).replace(/^-/, '');
      str = padString(str, '0', place - str.replace(/\.\d+$/, '').length, 0);
      if(sign || this < 0) {
        str = (this < 0 ? '-' : '+') + str;
      }
      return str;
    },

    'upto': function(num, fn, step) {
      return getRange(this, num, fn, step || 1);
    },

  });


  /***
   * Date module
   *
   * Note: The Date module depends on a number of Sugar methods. It can be used on its own, but you will
   * have to keep the following dependencies in addition to this module. The Array Module's polyfill methods can be
   * skipped if you don't care about < IE8 or if you are using another library that provides them. Finally, you
   * must keep "buildDate" in the initialization script at the very bottom of the file.
   *
   *
   *  ### Global private methods (at the top of the file)
   *
   *  - extend
   *  - storeMethods
   *  - wrapNative
   *  - defineProperty
   *  - iterateOverObject
   *
   *  ### Object private methods
   *
   *  - instance
   *  - typeMethods
   *  - buildTypeMethods
   *
   *  ### Number instance methods
   *
   *  - ordinalize
   *  - pad
   *
   *  ### String private methods
   *
   *  - padstring
   *  - NPCGMatch
   *
   *  ### String instance methods
   *
   *  - capitalize
   *  - first
   *  - from
   *  - repeat
   *  - to
   *
   *  ### Array instance methods (polyfill)
   *
   *  - indexOf
   *  - map
   *
   ***/

  var TimeFormat = ['hour','minute','second','millisecond','meridian','utc','offset_sign','offset_hours','offset_minutes']
  var RequiredTime = '(\\d{1,2}):?(\\d{2})?:?(\\d{2})?(?:\\.(\\d{1,6}))?(am|pm)?(?:(Z)|(?:([+-])(\\d{2})(?::?(\\d{2}))?)?)?';
  var OptionalTime = '\\s*(?:(?:t|at |\\s+)' + RequiredTime + ')?';
  var DateInputFormats = [];
  var DateArgumentUnits;
  var DateUnitsReversed;

  var StaticInputFormats = [
    // @date_format 2010
    { src: '(\\d{4})', to: ['year'] },
    // @date_format 2010-05
    // @date_format 2010.05
    // @date_format 2010/05
    // @date_format 2010-05-25 (ISO8601)
    // @date_format 2010-05-25T12:30:40.299Z (ISO8601)
    // @date_format 2010-05-25T12:30:40.299+01:00 (ISO8601)
    // @date_format 2010.05.25
    // @date_format 2010/05/25
    { src: '([+-])?(\\d{4})[-.]?({month})[-.]?(\\d{1,2})?', to: ['year_sign','year','month','date'] },
    // @date_format 05-25
    // @date_format 05/25
    // @date_format 05.25
    // @date_format 05-25-2010
    // @date_format 05/25/2010
    // @date_format 05.25.2010
    { src: '(\\d{1,2})[-.\\/]({month})[-.\\/]?(\\d{2,4})?', to: ['month','date','year'], variant: true }
  ];

  var DateOutputFormats = [
    {
      token: 'millisec(?:onds?)?|ms(?:ms)?',
      pad: 3,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Milliseconds');
      }
    },
    {
      token: 's(?:s|ec(?:onds?)?)?',
      pad: 2,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Seconds');
      }
    },
    {
      token: 'm(?:m|in(?:utes?)?)?',
      pad: 2,
      caps: true,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Minutes');
      }
    },
    {
      token: 'h(?:h|(?:ours?))?|24hr',
      pad: 2,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Hours');
      }
    },
    {
      token: '12hr',
      pad: 2,
      format: function(d, utc) {
        return getShortHour(d, utc);
      }
    },
    {
      token: 'd(?:d|ate|ays?)?',
      pad: 2,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Date');
      }
    },
    {
      token: 'dow|weekday',
      weekdays: true,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Day');
      }
    },
    {
      token: 'MM?',
      pad: 2,
      caps: true,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Month') + 1;
      }
    },
    {
      token: 'mon(?:th)?',
      months: true,
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Month');
      }
    },
    {
      token: 'yy',
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'FullYear').toString().from(2);
      }
    },
    {
      token: 'yyyy|year',
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'FullYear');
      }
    },
    {
      token: 't{1,2}',
      meridian: true,
      format: function(d, utc) {
        return getMeridian(d, utc);
      }
    },
    {
      token: 'tz|timezone',
      format: function(d, utc) {
        return d.getUTCOffset();
      }
    },
    {
      token: 'iso(tz|timezone)',
      format: function(d, utc) {
        return d.getUTCOffset(true);
      }
    },
    {
      token: 'ord',
      format: function(d, utc) {
        return callDateMethod(d, 'get', utc, 'Date').ordinalize();
      }
    }
  ];

  var DateUnits = [
    {
      unit: 'year',
      method: 'FullYear',
      multiplier: function(d) {
        var adjust = d ? (d.isLeapYear() ? 1 : 0) : 0.25;
        return (365 + adjust) * 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'month',
      method: 'Month',
      multiplier: function(d, ms) {
        var days = 30.4375, inMonth;
        if(d) {
          inMonth = d.daysInMonth();
          if(ms <= inMonth.days()) {
            days = inMonth;
          }
        }
        return days * 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'week',
      method: 'Week',
      multiplier: function(d) {
        return 7 * 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'day',
      method: 'Date',
      multiplier: function(d) {
        return 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'hour',
      method: 'Hours',
      multiplier: function(d) {
        return 60 * 60 * 1000;
      }
    },
    {
      unit: 'minute',
      method: 'Minutes',
      multiplier: function(d) {
        return 60 * 1000;
      }
    },
    {
      unit: 'second',
      method: 'Seconds',
      multiplier: function(d) {
        return 1000;
      }
    },
    {
      unit: 'millisecond',
      method: 'Milliseconds',
      multiplier: function(d) {
        return 1;
      }
    }
  ];




  // Date Localization

  var Localizations = {};

  var getLocalization = function(code) {
    return initializeLocale(code) || initializeLocale(Date.currentLocale);
  };

  var CommonLocales = {

    'en': '2;;January,February,March,April,May,June,July,August,September,October,November,December;Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday;millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s;one,two,three,four,five,six,seven,eight,nine,ten;a,an,the;the,st|nd|rd|th,of;{num} {unit} {sign},{num} {unit4} {sign} {day},{weekday?} {month} {date}{2} {year?} {time?},{date} {month} {year},{month} {year},{shift?} {weekday} {time?},{shift} week {weekday?} {time?},{shift} {unit=5-7},{1} {edge} of {shift?} {unit=4-7?}{month?}{year?},{weekday} {3} {shift} week,{1} {date}{2} of {month},{1}{month?} {date?}{2} of {shift} {unit=6-7},{day} at {time?},{time} {day};{Month} {d}, {yyyy};,yesterday,today,tomorrow;,ago|before,,from now|after|from;,last,the|this,next;last day,end,,first day|beginning',

    'ja': '1;月;;日曜日,月曜日,火曜日,水曜日,木曜日,金曜日,土曜日;ミリ秒,秒,分,時間,日,週間|週,ヶ月|ヵ月|月,年;一,二,三,四,五,六,七,八,九,十;;;{num}{unit}{sign},{shift}{unit=5-7}{weekday?},{year}年{month?}月?{date?}日?,{month}月{date?}日?,{date}日;{yyyy}年{M}月{d}日;一昨日,昨日,今日,明日,明後日;,前,,後;,去|先,,来',

    'ko': '1;월;;일요일,월요일,화요일,수요일,목요일,금요일,토요일;밀리초,초,분,시간,일,주,개월|달,년;일|한,이,삼,사,오,육,칠,팔,구,십;;;{num}{unit} {sign},{shift} {unit=5-7},{shift} {unit=5?} {weekday},{year}년{month?}월?{date?}일?,{month}월{date?}일?,{date}일;{yyyy}년{M}월{d}일;그저께,어제,오늘,내일,모레;,전,,후;,지난|작,이번,다음|내',

    'ru': '4;;Январ:я|ь,Феврал:я|ь,Март:а|,Апрел:я|ь,Ма:я|й,Июн:я|ь,Июл:я|ь,Август:а|,Сентябр:я|ь,Октябр:я|ь,Ноябр:я|ь,Декабр:я|ь;Воскресенье,Понедельник,Вторник,Среда,Четверг,Пятница,Суббота;миллисекунд:а|у|ы|,секунд:а|у|ы|,минут:а|у|ы|,час:||а|ов,день|день|дня|дней,недел:я|ю|и|ь|е,месяц:||а|ев|е,год|год|года|лет|году;од:ин|ну,дв:а|е,три,четыре,пять,шесть,семь,восемь,девять,десять;;в|на;{num} {unit} {sign},{sign} {num} {unit},{date} {month} {year?},{month} {year},{1} {shift} {unit=5-7};{d} {month} {yyyy} года;позавчера,вчера,сегодня,завтра,послезавтра;,назад,,через;,прошло:й|м,,следующе:й|м',

    'es': '6;;enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre;domingo,lunes,martes,miércoles|miercoles,jueves,viernes,sábado|sabado;milisegundo:|s,segundo:|s,minuto:|s,hora:|s,día|días|dia|dias,semana:|s,mes:|es,año|años|ano|anos;uno,dos,tres,cuatro,cinco,seis,siete,ocho,nueve,diez;;el,de;{sign} {num} {unit},{num} {unit} {sign},{date?} {2} {month} {2} {year?},{1} {unit=5-7} {shift},{1} {shift} {unit=5-7};{d} de {month} de {yyyy};anteayer,ayer,hoy,mañana|manana;,hace,,de ahora;,pasad:o|a,,próximo|próxima|proximo|proxima',

    'pt': '6;;janeiro,fevereiro,março,abril,maio,junho,julho,agosto,setembro,outubro,novembro,dezembro;domingo,segunda-feira,terça-feira,quarta-feira,quinta-feira,sexta-feira,sábado|sabado;milisegundo:|s,segundo:|s,minuto:|s,hora:|s,dia:|s,semana:|s,mês|mêses|mes|meses,ano:|s;um,dois,três|tres,quatro,cinco,seis,sete,oito,nove,dez,uma,duas;;a,de;{num} {unit} {sign},{sign} {num} {unit},{date?} {2} {month} {2} {year?},{1} {unit=5-7} {shift},{1} {shift} {unit=5-7};{d} de {month} de {yyyy};anteontem,ontem,hoje,amanh:ã|a;,atrás|atras|há|ha,,daqui a;,passad:o|a,,próximo|próxima|proximo|proxima',

    'fr': '2;;janvier,février|fevrier,mars,avril,mai,juin,juillet,août,septembre,octobre,novembre;dimanche,lundi,mardi,mercredi,jeudi,vendredi,samedi;milliseconde:|s,seconde:|s,minute:|s,heure:|s,jour:|s,semaine:|s,mois,an:|s|née|nee;un:|e,deux,trois,quatre,cinq,six,sept,huit,neuf,dix;;l\'|la|le;{sign} {num} {unit},{sign} {num} {unit},{1} {date?} {month} {year?},{1} {unit=5-7} {shift};{d} {month} {yyyy};,hier,aujourd\'hui,demain;,il y a,,dans|d\'ici;,derni:er|ère|ere,,prochain:|e',

    'it': '2;;Gennaio,Febbraio,Marzo,Aprile,Maggio,Giugno,Luglio,Agosto,Settembre,Ottobre,Novembre,Dicembre;Domenica,Luned:ì|i,Marted:ì|i,Mercoled:ì|i,Gioved:ì|i,Venerd:ì|i,Sabato;millisecond:o|i,second:o|i,minut:o|i,or:a|e,giorn:o|i,settiman:a|e,mes:e|i,ann:o|i;un:|\'|a|o,due,tre,quattro,cinque,sei,sette,otto,nove,dieci;;l\'|la|il;{num} {unit} {sign},{weekday?} {date?} {month} {year?},{1} {unit=5-7} {shift},{1} {shift} {unit=5-7};{d} {month} {yyyy};,ieri,oggi,domani,dopodomani;,fa,,da adesso;,scors:o|a,,prossim:o|a',

    'de': '2;;Januar,Februar,März|Marz,April,Mai,Juni,Juli,August,September,November,Dezember;Sonntag,Montag,Dienstag,Mittwoch,Donnerstag,Freitag,Samstag;Millisekunde:|n,Sekunde:|n,Minute:|n,Stunde:|n,Tag:|en,Woche:|n,Monat:|en,Jahr:|en;ein:|e|er|em|en,zwei,drei,vier,fuenf,sechs,sieben,acht,neun,zehn;;der;{sign} {num} {unit},{num} {unit} {sign},{num} {unit} {sign},{sign} {num} {unit},{weekday?} {date?} {month} {year?},{shift} {unit=5-7};{d}. {Month} {yyyy};vorgestern,gestern,heute,morgen,übermorgen|ubermorgen|uebermorgen;,vor:|her,,in;,letzte:|r|n|s,,nächste:|r|n|s+naechste:|r|n|s',

    'zh-TW': '1;月;;日,一,二,三,四,五,六;毫秒,秒鐘,分鐘,小時,天,個星期|週,個月,年;一,二,三,四,五,六,七,八,九,十;;;{num}{unit}{sign},星期{weekday},{shift}{unit=5-7},{shift}{unit=5}{weekday},{year}年{month?}月?{date?}日?,{month}月{date?}日?,{date}日;{yyyy}年{M}月{d}日;前天,昨天,今天,明天,後天;,前,,後;,上|去,這,下|明',

    'zh-CN': '1;月;;日,一,二,三,四,五,六;毫秒,秒钟,分钟,小时,天,个星期|周,个月,年;一,二,三,四,五,六,七,八,九,十;;;{num}{unit}{sign},星期{weekday},{shift}{unit=5-7},{shift}{unit=5}{weekday},{year}年{month?}月?{date?}日?,{month}月{date?}日?,{date}日;{yyyy}年{M}月{d}日;前天,昨天,今天,明天,后天;,前,,后;,上|去,这,下|明'

  };

  var setLocaleFormats = function(code) {
    var addFormat = Date.addFormat, set;
    if(!code || !Object.isString(code)) code = 'en';
    set = initializeLocale(code);
    if(set.formatsAdded) return;
    addFormat('(' + set.months.join('|') + ')', ['month'], code);
    addFormat('(' + set.weekdays.join('|') + ')', ['weekday'], code);
    addFormat('(' + set.modifiers.filter(function(m){ return m.name === 'day'; }).map('text').join('|') + ')', ['day'], code);
    arrayEach(set.formats, function(src) {
      var to = [];
      src = src.replace(/\s+/g, '[-,. ]*');
      src = src.replace(/\{(.+?)\}/g, function(all, k) {
        var opt = k.match(/\?$/), slice = k.match(/(\d)(?:-(\d))?/), nc = k.match(/^\d+$/), key = k.replace(/[^a-z]+$/, ''), value;
        if(key === 'time') {
          to = to.concat(TimeFormat);
          return opt ? OptionalTime : RequiredTime;
        }
        if(nc) {
          value = set.optionals[nc[0] - 1];
        } else if(set[key]) {
          value = set[key];
        } else if(set[key + 's']) {
          value = set[key + 's'];
          if(slice) {
            value = value.filter(function(m,i){
              var mod = i % (set.units ? 8 : value.length);
              return mod >= slice[1] && mod <= (slice[2] || slice[1]);
            });
          }
          value = value.compact().join('|');
        }
        if(nc) {
          return '(?:' + value + ')?';
        } else {
          to.push(key);
          return '(' + value + ')' + (opt ? '?' : '');
        }
      });
      addFormat(src, to, code);
    });
    set.formatsAdded = true;
  };

  var initializeLocale = function(code, set, current) {
    if(!code) return null;
    if(current) Date.currentLocale = code;
    if(Localizations[code]) return Localizations[code];
    set = set || getLocalizationSet(code);
    if(!set) throw new Error('Invalid locale.');

    var eachAlternate = function(str, fn) {
      str = str.split('+').map(function(split) {
        return split.replace(/(.+):(.+)$/, function(full, base, suffixes) {
          return suffixes.split('|').map(function(suffix) {
            return base + suffix;
          }).join('|');
        });
      }).join('|');
      return arrayEach(str.split('|'), fn);
    }

    var setArray = function(name, abbreviate, multiple) {
      var arr = [];
      if(!set[name]) return;
      arrayEach(set[name], function(el, i) {
        eachAlternate(el, function(str, j) {
          arr[j * multiple + i] = str.toLowerCase();
        });
      });
      if(abbreviate) arr = arr.concat(set[name].map(function(str) {
        return str.slice(0,3).toLowerCase();
      }));
      return set[name] = arr;
    }

    var getDigit = function(start, stop) {
      var str = '[0-9０-９]' + (start ? '{' + start + ',' + stop + '}' : '+');
      if(set.digits) str += '|[' + set.digits + ']+';
      return str;
    }

    var getNum = function() {
      var arr = [getDigit()].concat(set.articles);
      if(!set.digits) arr = arr.concat(set.numbers);
      return arr.compact().join('|');
    }

    var setModifiers = function() {
      var arr = [];
      set.modifiersByName = {};
      arrayEach(set.modifiers, function(modifier) {
        eachAlternate(modifier.text, function(t) {
          set.modifiersByName[t] = modifier;
          arr.push({ name: modifier.name, text: t, value: modifier.value });
        });
      });
      Object.each(arr.groupBy('name'), function(name, group) {
        group = group.map('text');
        if(name === 'day') group = group.concat(set.weekdays);
        set[name] = group.join('|');
      });
      set.modifiers = arr;
    }

    if(set.numbersAreDigits) {
      set.digits = set.numbers.join('');
    }

    setArray('months', true, 12);
    setArray('weekdays', true, 7);
    setArray('units', false, 8);
    setArray('numbers', false, 10);

    set.code = code;
    set.date = getDigit(1,2);
    set.year = getDigit(4,4);
    set.num  = getNum();

    setModifiers();

    if(set.monthSuffix) {
      set.month = getDigit(1,2);
      set.months = (1).upto(12).map(function(n) { return n + set.monthSuffix; });
    }
    Localizations[code] = new Localization(set);
    return Localizations[code];
  };

  var getLocalizationSet = function(code) {
    var set = { modifiers: [], past: 0 }, pre = CommonLocales[code].split(';');
    var bool = function(n) {
      return !!(pre[0] & Math.pow(2,n-1));
    }
    arrayEach(['months','weekdays','units','numbers','articles','optionals','formats'], function(name, i) {
      set[name] = pre[i + 2] ? pre[i + 2].split(',') : [];
    });
    set.outputFormat = pre[9];
    arrayEach(['day','sign','shift','edge'], function(name, i) {
      if(!pre[i + 10]) return;
      arrayEach(pre[i + 10].split(','),  function(t, j) {
        if(t) set.modifiers.push({ name: name, text: t, value: j - 2 });
      });
    });
    if(bool(1)) {
      set.numbersAreDigits = true;
      set.monthSuffix = pre[1];
    }
    set.capitalizeUnit = (code == 'de');
    set.hasPlural = bool(2);
    set.future = Number(bool(3));
    return set;
  };

  var Localization = function(l) {
    Object.merge(this, l);
  };

  extend(Localization, true, false, {

    'getMonth': function(n) {
      if(Object.isNumber(n)) {
        return n - 1;
      } else {
        return arrayFind(this.months, new RegExp(n, 'i'), 0, false, true) % 12;
      }
    },

    'getWeekday': function(n) {
      return arrayFind(this.weekdays, new RegExp(n, 'i'), 0, false, true) % 7;
    },

    'getNumber': function(n) {
      var i;
      if(Object.isNumber(n)) {
        return n;
      } else if((i = this.numbers.indexOf(n)) !== -1) {
        return (i + 1) % 10;
      } else {
        return 1;
      }
    },

    'getNumericDate': function(n) {
      var self = this;
      return n.replace(this.numbers[9], '').each(function(d) {
        return self.getNumber(d);
      }).join('');
    },

    'getEnglishUnit': function(n) {
      return English['units'][this.units.indexOf(n) % 8];
    },

    'relative': function(num, u, ms) {
      var format, sign, unit, last, mult;
      format = this.formats[ms > 0 ? this.future : this.past];
      if(this.code == 'ru') {
        last = num.toString().slice(-1);
        switch(true) {
          case last == 1: mult = 1; break;
          case last >= 2 && last <= 4: mult = 2; break;
          default: mult = 3;
        }
      } else {
        mult = this.hasPlural && num > 1 ? 1 : 0;
      }
      unit = this.units[mult * 8 + u] || this.units[u];
      if(this.capitalizeUnit) unit = unit.capitalize();
      sign = arrayFind(this.modifiers, function(m) { return m.name == 'sign' && m.value == (ms > 0 ? 1 : -1); });
      return format.assign({ num: num, unit: unit, sign: sign.text });
    }

  });

  var collectDateArguments = function(args) {
    var obj, arr;
    if(typeof args[0] === 'object') {
      return args;
    } else if (args.length == 1 && Object.isNumber(args[0])) {
      return [args[0]];
    }
    obj = {};
    arrayEach(DateArgumentUnits, function(u,i) {
      obj[u.unit] = args[i];
    });
    return [obj];
  };

  var getFormatMatch = function(match, arr) {
    var obj = {}, value, num;
    arrayEach(arr, function(key, i) {
      value = match[i + 1];
      if(value === undefined) return;
      if(value.match(/^[０-９]+$/)) value = value.hankaku('n');
      if(key === 'year') obj.yearAsString = value;
      if(key === 'millisecond') value = value * Math.pow(10, 3 - value.length);
      num = parseFloat(value);
      obj[key] = !isNaN(num) ? num : value.toLowerCase();
    });
    return obj;
  }

  var getExtendedDate = function(f, locale) {
    var d = new Date(), relative = false, format, set, unit, num, loc, tmp;
    if(Object.isDate(f)) {
      d = f;
    } else if(Object.isNumber(f)) {
      d = new Date(f);
    } else if(Object.isObject(f)) {
      d = new Date().set(f, true);
      set = f;
    } else if(Object.isString(f)) {
      // Pre-initialize the localization formats.
      setLocaleFormats(locale);
      f = f.trim().replace(/\.+$/,'').replace(/^now$/, '');
      arrayEach(DateInputFormats, function(dif) {
        var match = NPCGMatch(f, dif.reg);
        if(match) {
          format = dif;
          set = getFormatMatch(match, format.to);
          loc = getLocalization(format.locale);

          // If there's a European variant, swap the month and day.
          if(set.date && NPCGMatch(set.date, /^[a-z]+$/) || (Date.allowVariant && format.variant)) {
            tmp = set.month;
            set.month = set.date;
            set.date = tmp;
          }

          // If the year is 2 digits then get the implied century.
          if(set.year && set.yearAsString.length === 2) {
            set.year = getYearFromAbbreviation(set.year);
          }

          // Set the month which may be localized.
          if(set.month) {
            set.month = loc.getMonth(set.month);
            if(set.shift && !set.unit) set.unit = 'year';
          }

          // If there is both a weekday and a date, the date takes precedence.
          if(set.weekday && set.date) {
            delete set.weekday;
          // Otherwise set a localized weekday.
          } else if(set.weekday) {
            set.weekday = loc.getWeekday(set.weekday);
            if(set.shift && !set.unit) set.unit = 'week';
          }

          // Relative day localizations such as "today" and "tomorrow".
          if(set.day && (tmp = loc.modifiersByName[set.day])) {
            set.day = tmp.value;
            d.resetTime();
            relative = true;
          // If the day is a weekday, then set that instead.
          } else if(set.day && (tmp = loc.getWeekday(set.day)) > -1) {
            delete set.day;
            set.weekday = tmp;
          }

          if(set.date && !Object.isNumber(set.date)) {
            set.date = loc.getNumericDate(set.date);
          }

          // If the time is 1pm-11pm advance the time by 12 hours.
          if(set.meridian) {
            if(set.meridian === 'pm' && set.hour < 12) set.hour += 12;
          }

          // Adjust for timezone offset
          if(set.offset_hours || set.offset_minutes) {
            set.utc = true;
            set.offset_minutes = set.offset_minutes || 0;
            set.offset_minutes += set.offset_hours * 60;
            if(set.offset_sign === '-') {
              set.offset_minutes *= -1;
            }
            set.minute -= set.offset_minutes;
          }

          // Date has a unit like "days", "months", etc. are all relative to the current date.
          if(set.unit) {
            relative = true;
            num = loc.getNumber(set.num);
            unit = loc.getEnglishUnit(set.unit);

            // Shift and unit, ie "next month", "last week", etc.
            if(set.shift && (tmp = loc.modifiersByName[set.shift])) {
              num *= tmp.value || 0;

              // Relative month and static date: "the 15th of last month"
              if(unit === 'month' && set.date !== undefined) {
                d.set({ day: set.date }, true);
                delete set.date;
              }

              // Relative year and static month/date: "June 15th of last year"
              if(unit === 'year' && set.month !== undefined) {
                d.set({ month: set.month, day: set.date }, true);
                delete set.month;
                delete set.date;
              }
            }

            // Unit and sign, ie "months ago", "weeks from now", etc.
            if(set.sign && (tmp = loc.modifiersByName[set.sign])) {
              num *= tmp.value;
            }

            // Units can be with non-relative dates, set here. ie "the day after monday"
            if(set.weekday !== undefined) {
              d.set({ weekday: set.weekday }, true);
              delete set.weekday;
            }

            // Finally shift the unit.
            set[unit] = (set[unit] || 0) + num;
          }
          if(set.year_sign === '-') {
            set.year *= -1;
          }
          return false;
        }
      });
      if(!format) {
        // The Date constructor does something tricky like checking the number
        // of arguments so simply passing in undefined won't work.
        d = f ? new Date(f) : new Date();
      } else if(relative) {
        d.advance(set);
      } else if(set.utc) {
        d.setUTC(set, true);
      } else {
        d.set(set, true);
      }

      // If there is an "edge" it needs to be set after the
      // other fields are set. ie "the end of February"
      if(set && set.edge) {
        tmp = loc.modifiersByName[set.edge];
        arrayEach(DateUnitsReversed.slice(4), function(u) {
          if(set[u.unit] !== undefined) {
            unit = u.unit;
            return false;
          }
        });
        if(unit === 'year') set.specificity = 'month';
        else if(unit === 'month' || unit === 'week') set.specificity = 'day';
        d[(tmp.value < 0 ? 'endOf' : 'beginningOf') + unit.capitalize()]();
        // This value of -2 is arbitrary but it's a nice clean way to hook into this system.
        if(tmp.value === -2) d.resetTime();
      }
    }
    return {
      date: d,
      set: set
    }
  }

  var formatDate = function(date, f, relative, locale) {
    var adu, loc = getLocalization(locale), caps = /^[A-Z]/;
    if(!date.isValid()) {
      return 'Invalid Date';
    } else if(Date[f]) {
      f = Date[f];
    } else if(typeof f == 'function') {
      adu = getAdjustedDateUnit(date);
      f = f.apply(date, adu);
    }
    if(!f && !relative) {
      f = loc.outputFormat;
    } else if(!f && relative) {
      adu = adu || getAdjustedDateUnit(date);
      // Adjust up if time is in ms, as this doesn't
      // look very good for a standard relative date.
      if(adu[1] === 0) {
        adu[1] = 1;
        adu[0] = 1;
      }
      return loc.relative(adu[0],adu[1],adu[2]);
    }
    arrayEach(DateOutputFormats, function(dof) {
      f = f.replace(new RegExp('\\{('+dof.token+')(\\d)?\\}', dof.caps ? '' : 'i'), function(m,t,d) {
        d = d || 1;
        var value = dof.format.call(null, date, '');
        if(dof.pad && t.length === 2) {
          value = value.pad(dof.pad);
        }
        if(dof.weekdays) {
          var l = t.toLowerCase();
          value = loc.weekdays[value + (d - 1) * 7];
          if(l === 'dow') value = value.slice(0,3);
          if(caps.test(t)) value = value.capitalize();
        }
        if(dof.months) {
          var l = t.toLowerCase();
          value = loc.months[value + (d - 1) * 12];
          if(l === 'mon') value = value.slice(0,3);
          if(caps.test(t)) value = value.capitalize();
        }
        if(dof.meridian) {
          if(t.length === 1) value = value.to(1);
          if(caps.test(t)) value = value.toUpperCase();
        }
        return value;
      });
    });
    return f;
  };

  var compareDate = function(d, find, buffer) {
    var p = getExtendedDate(find), accuracy = 0;
    buffer = buffer > 0 ? buffer : 0;
    if(!p.date.isValid()) return false;
    if(p.set && p.set.specificity) {
      arrayEach(DateUnits, function(u) {
        if(u.unit === p.set.specificity) {
          accuracy = u.multiplier(p.date, d - p.date) - 1;
        }
      });
      if(p.set.edge || p.set.shift) {
        p.date['beginningOf' + p.set.specificity.capitalize()]();
      }
    }
    var t   = d.getTime();
    var min = p.date.getTime();
    var max = min + accuracy;
    return t >= (min - buffer) && t < (max + buffer + 1);
  }

  var updateDate = function(date, params, reset, utc, advance) {
    if(Object.isNumber(params) && advance) {
      // If param is a number and we're advancing, the number is presumed to be milliseconds.
      params = { milliseconds: params };
    } else if(Object.isNumber(params)) {
      // Otherwise just set the timestamp and return.
      date.setTime(params);
      return date;
    }
    // .date can also be passed for the day
    if(params.date) params.day = params.date;
    // If a weekday is included in the params, set it ahead of time and set the params
    // to reflect the updated date so that resetting works properly.
    if(!advance && params.day === undefined && params.weekday !== undefined) {
      callDateMethod(date, 'set', utc, 'Weekday', params.weekday)
      params.day = callDateMethod(date, 'get', utc, 'Date');
      delete params.weekday;
    }
    // Reset any unit lower than the least specific unit set. Do not do this for weeks
    // or for years. This needs to be performed before the acutal setting of the date
    // because the order needs to be reversed in order to get the lowest specificity.
    // The order of the date setting is also fixed because higher order units can be
    // overwritten by lower order units, such as setting hour: 3, minute: 345, etc.
    // Also we need to actually SET the date here (rather than just adding to the params)
    // for the sake of the edge case of setting a month on a date whose date does not
    // exist in the target month. For example, setting month: 1 (February) on a date
    // that is already January 31st will effectively make the month March, as this day
    // does not exist in February. Any date that is resetting (especially date creation)
    // wants to avoid this situation, so set all the defaults ahead.
    arrayEach(DateUnitsReversed, function(u) {
      if(params[u.unit] !== undefined || params[u.unit + 's'] !== undefined) {
        params.specificity = u.unit;
        return false;
      } else if(reset && u.unit !== 'week' && u.unit !== 'year') {
        callDateMethod(date, 'set', utc, u.method, (u.unit === 'day') ? 1 : 0);
      }
    });
    // If the we're advancing the date by months then we don't want to accidentally
    // traverse into a new month just because the target month doesn't have enough
    // days. In other words, "5 months ago" from July 30th is still February, even
    // though there is no February 30th, so it will of necessity be February 28th
    // (or 29th in the case of a leap year). This is just what you'll have to expect
    // when dealing with a unit as ambiguous as months.
    if(advance && params.month !== undefined) {
      checkMonthTraversal(date, params, advance);
    }
    // Now actually set or advance the date in order, higher units first.
    arrayEach(DateUnits, function(u,i) {
      var unit   = u.unit;
      var method = u.method;
      var value = params[unit] !== undefined ? params[unit] : params[unit + 's'];
      if(value === undefined) return;
      if(advance) {
        if(unit === 'week') {
          value  = (params.day || 0) + (value * 7);
          method = 'Date';
        }
        value = (value * advance) + callDateMethod(date, 'get', '', method);
      }
      callDateMethod(date, 'set', utc, method, value);
    });
    return date;
  }

  var callDateMethod = function(d, g, utc, method, value) {
    return d[g + (utc ? 'UTC' : '') + method](value);
  }

  // If the year is two digits, add the most appropriate century prefix.
  var getYearFromAbbreviation = function(year) {
    return Math.round(new Date().getFullYear() / 100) * 100 - Math.round(year / 100) * 100 + year;
  }

  var getShortHour = function(d, utc) {
    var hours = callDateMethod(d, 'get', utc, 'Hours');
    return hours === 0 ? 12 : hours - (Math.floor(hours / 13) * 12);
  }

  var getMeridian = function(d, utc) {
    var hours = callDateMethod(d, 'get', utc, 'Hours');
    return hours < 12 ? 'am' : 'pm';
  }

  var getAdjustedDateUnit = function(d) {
    var next, ms = d.millisecondsFromNow(), ams = Math.abs(ms), value = ams, unit = 0;
    arrayEach(DateUnits.concat().reverse().slice(1), function(u, i) {
      next = Math.floor(round(ams / u.multiplier(), 1));
      if(next >= 1) {
        value = next;
        unit = i + 1;
      }
    });
    return [value, unit, ms, getLocalization()];
  }

  var checkMonthTraversal = function(d, set, advance) {
    var targetDate = d.getDate(), daysInTargetMonth;
    // Don't compensate if there is more specificity than just "months", as this could have unintended consequences.
    if(targetDate < 29 || (set.specificity != 'month' && set.specificity != 'year')) return;
    daysInTargetMonth = new Date(d.getFullYear() + ((set.year * advance) || 0), d.getMonth() + (set.month * advance)).daysInMonth();
    if(daysInTargetMonth < targetDate) {
      d.setDate(daysInTargetMonth);
    }
  }

  var createDate = function(args) {
    var f;
    if(Object.isNumber(args[1])) {
      // If the second argument is a number, then we have an enumerated constructor type as in "new Date(2003, 2, 12);"
      f = collectDateArguments(args)[0];
    } else {
      f = args[0];
    }
    return getExtendedDate(f, args[1]).date;
  }




   /***
   * @method [units]Since([d])
   * @returns Number
   * @short Returns the time since [d] in the appropriate unit.
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. For more see @date_format.
   * @example
   *
   *   Date.create().millisecondsSince('1 hour ago') -> 3,600,000
   *   Date.create().daysSince('1 week ago')         -> 7
   *   Date.create().yearsSince('15 years ago')      -> 15
   *   Date.create('15 years ago').yearsAgo()        -> 15
   *
   ***
   * @method millisecondsSince()
   * @set unitsSince
   ***
   * @method secondsSince()
   * @set unitsSince
   ***
   * @method minutesSince()
   * @set unitsSince
   ***
   * @method hoursSince()
   * @set unitsSince
   ***
   * @method daysSince()
   * @set unitsSince
   ***
   * @method weeksSince()
   * @set unitsSince
   ***
   * @method monthsSince()
   * @set unitsSince
   ***
   * @method yearsSince()
   * @set unitsSince
   ***
   * @method [units]Ago()
   * @returns Number
   * @short Returns the time ago in the appropriate unit.
   * @example
   *
   *   Date.create('last year').millisecondsAgo() -> 3,600,000
   *   Date.create('last year').daysAgo()         -> 7
   *   Date.create('last year').yearsAgo()        -> 15
   *
   ***
   * @method millisecondsAgo()
   * @set unitsAgo
   ***
   * @method secondsAgo()
   * @set unitsAgo
   ***
   * @method minutesAgo()
   * @set unitsAgo
   ***
   * @method hoursAgo()
   * @set unitsAgo
   ***
   * @method daysAgo()
   * @set unitsAgo
   ***
   * @method weeksAgo()
   * @set unitsAgo
   ***
   * @method monthsAgo()
   * @set unitsAgo
   ***
   * @method yearsAgo()
   * @set unitsAgo
   ***
   * @method [units]Until([d])
   * @returns Number
   * @short Returns the time until [d] in the appropriate unit.
   * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. %[unit]FromNow% is provided as an alias to make this more readable. For more see @date_format.
   * @example
   *
   *   Date.create().millisecondsUntil('1 hour from now') -> 3,600,000
   *   Date.create().daysUntil('1 week from now')         -> 7
   *   Date.create().yearsUntil('15 years from now')      -> 15
   *   Date.create('15 years from now').yearsFromNow()    -> 15
   *
   ***
   * @method millisecondsUntil()
   * @set unitsUntil
   ***
   * @method secondsUntil()
   * @set unitsUntil
   ***
   * @method minutesUntil()
   * @set unitsUntil
   ***
   * @method hoursUntil()
   * @set unitsUntil
   ***
   * @method daysUntil()
   * @set unitsUntil
   ***
   * @method weeksUntil()
   * @set unitsUntil
   ***
   * @method monthsUntil()
   * @set unitsUntil
   ***
   * @method yearsUntil()
   * @set unitsUntil
   ***
   * @method [units]FromNow()
   * @returns Number
   * @short Returns the time from now in the appropriate unit.
   * @example
   *
   *   Date.create('next year').millisecondsFromNow() -> 3,600,000
   *   Date.create('next year').daysFromNow()         -> 7
   *   Date.create('next year').yearsFromNow()        -> 15
   *
   ***
   * @method millisecondsFromNow()
   * @set unitsFromNow
   ***
   * @method secondsFromNow()
   * @set unitsFromNow
   ***
   * @method minutesFromNow()
   * @set unitsFromNow
   ***
   * @method hoursFromNow()
   * @set unitsFromNow
   ***
   * @method daysFromNow()
   * @set unitsFromNow
   ***
   * @method weeksFromNow()
   * @set unitsFromNow
   ***
   * @method monthsFromNow()
   * @set unitsFromNow
   ***
   * @method yearsFromNow()
   * @set unitsFromNow
   ***
   * @method add[Units](<num>)
   * @returns Date
   * @short Adds <num> of the unit to the date.
   * @extra Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Don't use this method if you need precision.
   * @example
   *
   *   Date.create().addMilliseconds(5) -> current time + 5 milliseconds
   *   Date.create().addDays(5)         -> current time + 5 days
   *   Date.create().addYears(5)        -> current time + 5 years
   *
   ***
   * @method addMilliseconds()
   * @set addUnits
   ***
   * @method addSeconds()
   * @set addUnits
   ***
   * @method addMinutes()
   * @set addUnits
   ***
   * @method addHours()
   * @set addUnits
   ***
   * @method addDays()
   * @set addUnits
   ***
   * @method addWeeks()
   * @set addUnits
   ***
   * @method addMonths()
   * @set addUnits
   ***
   * @method addYears()
   * @set addUnits
   ***
   * @method isLast[Unit]()
   * @returns Boolean
   * @short Returns true if the date is last week/month/year.
   * @example
   *
   *   Date.create('yesterday').isLastWeek()  -> true or false?
   *   Date.create('yesterday').isLastMonth() -> probably not...
   *   Date.create('yesterday').isLastYear()  -> even less likely...
   *
   ***
   * @method isThis[Unit]()
   * @returns Boolean
   * @short Returns true if the date is this week/month/year.
   * @example
   *
   *   Date.create('tomorrow').isThisWeek()  -> true or false?
   *   Date.create('tomorrow').isThisMonth() -> probably...
   *   Date.create('tomorrow').isThisYear()  -> signs point to yes...
   *
   ***
   * @method isNext[Unit]()
   * @returns Boolean
   * @short Returns true if the date is next week/month/year.
   * @example
   *
   *   Date.create('tomorrow').isNextWeek()  -> true or false?
   *   Date.create('tomorrow').isNextMonth() -> probably not...
   *   Date.create('tomorrow').isNextYear()  -> even less likely...
   *
   ***
   * @method isLastWeek()
   * @set isLastUnit
   ***
   * @method isLastMonth()
   * @set isLastUnit
   ***
   * @method isLastYear()
   * @set isLastUnit
   ***
   * @method isThisWeek()
   * @set isThisUnit
   ***
   * @method isThisMonth()
   * @set isThisUnit
   ***
   * @method isThisYear()
   * @set isThisUnit
   ***
   * @method isNextWeek()
   * @set isNextUnit
   ***
   * @method isNextMonth()
   * @set isNextUnit
   ***
   * @method isNextYear()
   * @set isNextUnit
   ***
   * @method beginningOf[Unit]()
   * @returns Date
   * @short Sets the date to the beginning of the appropriate unit.
   * @example
   *
   *   Date.create().beginningOfDay()   -> the beginning of today (resets the time)
   *   Date.create().beginningOfWeek()  -> the beginning of the week
   *   Date.create().beginningOfMonth() -> the beginning of the month
   *   Date.create().beginningOfYear()  -> the beginning of the year
   *
   ***
   * @method endOf[Unit]()
   * @returns Date
   * @short Sets the date to the end of the appropriate unit.
   * @example
   *
   *   Date.create().endOfDay()   -> the end of today (sets the time to 23:59:59.999)
   *   Date.create().endOfWeek()  -> the end of the week
   *   Date.create().endOfMonth() -> the end of the month
   *   Date.create().endOfYear()  -> the end of the year
   *
   ***
   * @method beginningOfDay()
   * @set beginningOfUnit
   ***
   * @method beginningOfWeek()
   * @set beginningOfUnit
   ***
   * @method beginningOfMonth()
   * @set beginningOfUnit
   ***
   * @method beginningOfYear()
   * @set beginningOfUnit
   ***
   * @method endOfDay()
   * @set endOfUnit
   ***
   * @method endOfWeek()
   * @set endOfUnit
   ***
   * @method endOfMonth()
   * @set endOfUnit
   ***
   * @method endOfYear()
   * @set endOfUnit
   ***/
  var buildNumberToDateAlias = function(unit, multiplier) {
    var add    = 'add' + unit.capitalize() + 's';
    var base   = function() { return Math.round(this * multiplier); }
    var before = function() { return createDate(arguments)[add](-this); }
    var after  = function() { return createDate(arguments)[add](this);  }
    defineProperty(Number.prototype, unit, base);
    defineProperty(Number.prototype, unit + 's', base);
    defineProperty(Number.prototype, unit + 'Before', before);
    defineProperty(Number.prototype, unit + 'sBefore', before);
    defineProperty(Number.prototype, unit + 'Ago', before);
    defineProperty(Number.prototype, unit + 'sAgo', before);
    defineProperty(Number.prototype, unit + 'After', after);
    defineProperty(Number.prototype, unit + 'sAfter', after);
    defineProperty(Number.prototype, unit + 'FromNow', after);
    defineProperty(Number.prototype, unit + 'sFromNow', after);
  }

  var buildDateMethods = function() {
    arrayEach(DateUnits, function(u, i) {
      var unit = u.unit;
      var caps = unit.capitalize();
      var multiplier = u.multiplier();
      defineProperty(Date.prototype, unit+'sSince', function(f) {
        return Math.round((this.getTime() - Date.create(f).getTime()) / multiplier);
      });
      defineProperty(Date.prototype, unit+'sUntil', function(f) {
        return Math.round((Date.create(f).getTime() - this.getTime()) / multiplier);
      });
      defineProperty(Date.prototype, unit+'sAgo', Date.prototype[unit+'sUntil']);
      defineProperty(Date.prototype, unit+'sFromNow', Date.prototype[unit+'sSince']);
      defineProperty(Date.prototype, 'add'+caps+'s', function(num) {
        var set = {};
        set[unit] = num;
        return this.advance(set);
      });
      buildNumberToDateAlias(unit, multiplier);
      if(i < 3) {
        defineProperty(Date.prototype, 'isLast'+caps, function() {
          return this.is('last ' + unit);
        });
        defineProperty(Date.prototype, 'isThis'+caps, function() {
          return this.is('this ' + unit);
        });
        defineProperty(Date.prototype, 'isNext'+caps, function() {
          return this.is('next ' + unit);
        });
      }
      if(i < 4) {
        defineProperty(Date.prototype, 'beginningOf'+caps, function() {
          var set = {};
          switch(unit) {
            case 'year':  set.year = this.getFullYear(); break;
            case 'month': set.month = this.getMonth(); break;
            case 'day':   set.day = this.getDate(); break;
            case 'week':  set.weekday = 0; break;
          }
          return this.set(set, true);
        });
        defineProperty(Date.prototype, 'endOf'+caps, function() {
          var set = { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 };
          switch(unit) {
            case 'year':  set.month = 11; set.day = 31; break;
            case 'month': set.day = this.daysInMonth(); break;
            case 'week':  set.weekday = 6; break;
          }
          return this.set(set, true);
        });
      }
    });
  }

  var buildDateInputFormats = function() {
    DateArgumentUnits = DateUnits.clone().removeAt(2);
    DateUnitsReversed = DateUnits.clone().reverse();
    var monthReg = '\\d{1,2}|' + English.months.join('|');
    arrayEach(StaticInputFormats, function(f) {
      f.src = f.src.replace(/\{month\}/, monthReg);
      f.reg = new RegExp('^' + f.src + OptionalTime + '$', 'i');
      f.to = f.to.concat(TimeFormat);
      DateInputFormats.push(f);
    });
    DateInputFormats.push({ reg: new RegExp('^' + RequiredTime + '$', 'i'), to: TimeFormat });
  }

   /***
   * @method isToday()
   * @returns Boolean
   * @short Returns true if the date is today.
   * @example
   *
   *   Date.create().isToday()           -> true
   *   Date.create('tomorrow').isToday() -> false
   *
   ***
   * @method isYesterday()
   * @returns Boolean
   * @short Returns true if the date is yesterday.
   * @example
   *
   *   Date.create().isYesterday()            -> false
   *   Date.create('yesterday').isYesterday() -> true
   *
   ***
   * @method isTomorrow()
   * @returns Boolean
   * @short Returns true if the date is tomorrow.
   * @example
   *
   *   Date.create().isTomorrow()           -> false
   *   Date.create('tomorrow').isTomorrow() -> true
   *
   ***
   * @method isWeekday()
   * @returns Boolean
   * @short Returns true if the date is a weekday.
   * @example
   *
   *   Date.create('monday').isWeekday() -> true
   *   Date.create('sunday').isWeekday() -> false
   *
   ***
   * @method isWeekend()
   * @returns Boolean
   * @short Returns true if the date is a weekend.
   * @example
   *
   *   Date.create('saturday').isWeekend() -> true
   *   Date.create('thursday').isWeekend() -> false
   *
   ***
   * @method isFuture()
   * @returns Boolean
   * @short Returns true if the date is in the future.
   * @example
   *
   *   Date.create('next week').isFuture() -> true
   *   Date.create('last week').isFuture() -> false
   *
   ***
   * @method isPast()
   * @returns Boolean
   * @short Returns true if the date is in the past.
   * @example
   *
   *   Date.create('last week').isPast() -> true
   *   Date.create('next week').isPast() -> false
   *
   ***/
  var buildRelativeAliases = function() {
    var weekdays = English.weekdays.slice(0,7);
    var months = English.months.slice(0,12);
    arrayEach(['today','yesterday','tomorrow','weekday','weekend','future','past'].concat(weekdays).concat(months), function(s) {
      defineProperty(Date.prototype, 'is'+ s.capitalize(), function() {
        return this.is(s);
      });
    });
  }

  var checkISOString = function() {
    var d = new Date(1999, 11, 31), support = d.toISOString && d.ISOString === '1999-12-31T00:00:00.000Z';
    extend(Date, true, !support, {

       /***
       * @method toISOString()
       * @returns String
       * @short Formats the string to ISO8601 format.
       * @extra This will always format as UTC time. Provided for browsers that do not support this method.
       * @example
       *
       *   Date.create().toISOString() -> ex. 2011-07-05 12:24:55.528Z
       *
       ***/
      'toISOString': function(utc) {
        return formatDate(this.toUTC(), Date.ISO8601_DATETIME);
      }

    });
    extend(Date, true, false, {
       /***
       * @method iso()
       * @alias toISOString
       *
       ***/
      'iso':    Date.prototype.toISOString
    });
  }

  var checkToJSON = function() {
    var d = new Date(1999, 11, 31), support = d.toJSON && d.toJSON === '1999-12-31T00:00:00.000Z';
    extend(Date, true, !support, {

       /***
       * @method toJSON()
       * @returns String
       * @short Returns a JSON representation of the date.
       * @extra This is effectively an alias for %toISOString%. Will always return the date in UTC time. Implemented for browsers that do not support it.
       * @example
       *
       *   Date.create().toJSON() -> ex. 2011-07-05 12:24:55.528Z
       *
       ***/
      'toJSON': Date.prototype.toISOString

    });
  };

  var setDateProperties = function() {
    Date.DSTOffset = (new Date(2000, 6, 1).getTimezoneOffset() - new Date(2000, 0, 1).getTimezoneOffset()) * 60 * 1000;
    Date.INTERNATIONAL_TIME = '{h}:{mm}:{ss}';
    Date.RFC1123 = '{Dow}, {dd} {Mon} {yyyy} {hh}:{mm}:{ss} GMT{tz}';
    Date.RFC1036 = '{Weekday}, {dd}-{Mon}-{yy} {hh}:{mm}:{ss} GMT{tz}';
    Date.ISO8601_DATE = '{yyyy}-{MM}-{dd}';
    Date.ISO8601_DATETIME = '{yyyy}-{MM}-{dd}T{hh}:{mm}:{ss}.{ms}{isotz}';
    Date.ISO8601 = Date.ISO8601_DATETIME;
  };


  var buildDate = function() {
    English = initializeLocale('en', null, true);
    buildDateMethods();
    buildDateInputFormats();
    buildRelativeAliases();
    checkISOString();
    checkToJSON();
    setDateProperties();
  }

  extend(Date, false, false, {

     /***
     * @method Date.create(<d>)
     * @returns Date
     * @short Alternate Date constructor which understands various formats.
     * @extra Accepts a multitude of text formats, a timestamp, or another date. If no argument is given, date is assumed to be now. %Date.create% additionally can accept enumerated parameters as with the standard date constructor. For more information, see @date_format.
     * @example
     *
     *   Date.create('July')          -> July of this year
     *   Date.create('1776')          -> 1776
     *   Date.create('today')         -> today
     *   Date.create('wednesday')     -> This wednesday
     *   Date.create('next friday')   -> Next friday
     *   Date.create('July 4, 1776')  -> July 4, 1776
     *   Date.create(-446806800000)   -> November 5, 1955
     *   Date.create(1776, 6, 4)      -> July 4, 1776
     *
     ***/
    'create': function() {
      return createDate(arguments);
    },

     /***
     * @method Date.now()
     * @returns String
     * @short Returns the number of milliseconds since January 1st, 1970 00:00:00 (UTC time).
     * @example
     *
     *   Date.now() -> ex. 1311938296231
     *
     ***/
    'now': function() {
      return new Date().getTime();
    },

     /***
     * @method Date.setLocale(<code>, [set])
     * @returns String
     * @short Sets the locale to be used with dates.
     * @extra Predefined locales are: English (en), French (fr), Italian (it), Spanish (es), Portuguese (pt), German (de), Russian (ru), Japanese (ja), Korean (ko), Simplified Chinese (zh-CN), and Traditional Chinese (zh-TW). In addition to available major locales, you can define a new local here by passing an object for [set]. For more see @date_format.
     * @example
     *
     ***/
    'setLocale': function(code, set) {
      initializeLocale(code, set, true);
      setLocaleFormats(code);
    },

    /* Let's not document this one for now... */
    'addFormat': function(format, to, locale) {
      DateInputFormats.unshift({
        reg: new RegExp('^' + format + '$', 'i'),
        locale: locale,
        to: to
      });
    },

    'getLocalization': function(code) {
      return getLocalization(code);
    }

  });

  extend(Date, true, false, {

     /***
     * @method set(<set>, [reset] = false)
     * @returns Date
     * @short Sets the date object.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). If [reset] is %true%, any units more specific than those passed will be reset.
     * @example
     *
     *   new Date().set({ year: 2011, month: 11, day: 31 }) -> December 31, 2011
     *   new Date().set(2011, 11, 31)                       -> December 31, 2011
     *   new Date().set(86400000)                           -> 1 day after Jan 1, 1970
     *   new Date().set({ year: 2004, month: 6 }, true)     -> June 1, 2004, 00:00:00.000
     *
     ***/
    'set': function() {
      var args = collectDateArguments(arguments);
      return updateDate(this, args[0], args[1])
    },

     /***
     * @method setUTC()
     * @returns Date
     * @short Sets the date object according to universal time.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor).
     * @example
     *
     *   new Date().setUTC({ year: 2011, month: 11, day: 31 }) -> December 31, 2011
     *   new Date().setUTC(2011, 11, 31)                       -> December 31, 2011
     *   new Date().setUTC(86400000)                           -> 1 day after Jan 1, 1970
     *
     ***/
    'setUTC': function() {
      var args = collectDateArguments(arguments);
      return updateDate(this, args[0], args[1], true)
    },

     /***
     * @method setWeekday()
     * @returns Nothing
     * @short Sets the weekday of the date.
     * @example
     *
     *   d = new Date(); d.setWeekday(1); d; -> Monday of this week
     *   d = new Date(); d.setWeekday(6); d; -> Saturday of this week
     *
     ***/
    'setWeekday': function(dow) {
      if(dow === undefined) return;
      this.setDate(this.getDate() + dow - this.getDay());
    },

     /***
     * @method setUTCWeekday()
     * @returns Nothing
     * @short Sets the weekday of the date according to universal time.
     * @example
     *
     *   d = new Date(); d.setUTCWeekday(1); d; -> Monday of this week
     *   d = new Date(); d.setUTCWeekday(6); d; -> Saturday of this week
     *
     ***/
    'setUTCWeekday': function(dow) {
      if(dow === undefined) return;
      this.setDate(this.getUTCDate() + dow - this.getDay());
    },

     /***
     * @method setWeek()
     * @returns Nothing
     * @short Sets the week (of the year).
     * @example
     *
     *   d = new Date(); d.setWeek(15); d; -> 15th week of the year
     *
     ***/
    'setWeek': function(week) {
      if(week === undefined) return;
      var date = this.getDate();
      this.setMonth(0);
      this.setDate((week * 7) + 1);
    },

     /***
     * @method setUTCWeek()
     * @returns Nothing
     * @short Sets the week (of the year) according to universal time.
     * @example
     *
     *   d = new Date(); d.setUTCWeek(15); d; -> 15th week of the year
     *
     ***/
    'setUTCWeek': function(week) {
      if(week === undefined) return;
      var date = this.getUTCDate();
      this.setMonth(0);
      this.setUTCDate((week * 7) + 1);
    },

     /***
     * @method getWeek()
     * @returns Number
     * @short Gets the date's week (of the year).
     * @example
     *
     *   new Date().getWeek() -> today's week of the year
     *
     ***/
    'getWeek': function() {
      var d = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((this.getTime() - d.getTime() + 1) / (7 * 24 * 60 * 60 * 1000));
    },

     /***
     * @method getUTCWeek()
     * @returns Number
     * @short Gets the date's week (of the year) according to universal time.
     * @example
     *
     *   new Date().getUTCWeek() -> today's week of the year
     *
     ***/
    'getUTCWeek': function() {
      var d = new Date().setUTC(this.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      return Math.ceil((this.getTime() - d.getTime() + 1) / (7 * 24 * 60 * 60 * 1000));
    },

     /***
     * @method getUTCOffset([iso])
     * @returns String
     * @short Returns a string representation of the offset from UTC time. If [iso] is true the offset will be in ISO8601 format.
     * @example
     *
     *   new Date().getUTCOffset()     -> "+0900"
     *   new Date().getUTCOffset(true) -> "+09:00"
     *
     ***/
    'getUTCOffset': function(iso) {
      var offset = this.utc ? 0 : this.getTimezoneOffset();
      var colon  = iso === true ? ':' : '';
      if(!offset && iso) return 'Z';
      return Math.round(-offset / 60).pad(2, true) + colon + (offset % 60).pad(2);
    },

     /***
     * @method toUTC()
     * @returns Date
     * @short Converts the date to UTC time, effectively subtracting the timezone offset.
     * @extra Note here that the method %getTimezoneOffset% will still show an offset even after this method is called, as this method effectively just rewinds the date. %format% however, will correctly set the %{tz}% (timezone) token as UTC once this method has been called on the date.
     * @example
     *
     *   new Date().toUTC() -> current time in UTC
     *
     ***/
    'toUTC': function() {
      if(this.utc) return this;
      var d = this.clone().addMinutes(this.getTimezoneOffset());
      d.utc = true;
      return d;
    },

     /***
     * @method isUTC()
     * @returns Boolean
     * @short Returns true if the date has no timezone offset.
     * @example
     *
     *   new Date().isUTC() -> true or false?
     *
     ***/
    'isUTC': function() {
      return this.utc || this.getTimezoneOffset() === 0;
    },

     /***
     * @method advance()
     * @returns Date
     * @short Sets the date forward.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). For more see @date_format.
     * @example
     *
     *   new Date().advance({ year: 2 }) -> 2 years in the future
     *   new Date().advance(0, 2, 3)     -> 2 months 3 days in the future
     *   new Date().advance(86400000)    -> 1 day in the future
     *
     ***/
    'advance': function(params) {
      var args = collectDateArguments(arguments);
      return updateDate(this, args[0], false, false, 1, true);
    },

     /***
     * @method rewind()
     * @returns Date
     * @short Sets the date back.
     * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). For more see @date_format.
     * @example
     *
     *   new Date().rewind({ year: 2 }) -> 2 years in the past
     *   new Date().rewind(0, 2, 3)     -> 2 months 3 days in the past
     *   new Date().rewind(86400000)    -> 1 day in the past
     *
     ***/
    'rewind': function(params) {
      var args = collectDateArguments(arguments);
      return updateDate(this, args[0], false, false, -1);
    },

     /***
     * @method isValid()
     * @returns Boolean
     * @short Returns true if the date is valid.
     * @example
     *
     *   new Date().isValid()         -> true
     *   new Date('flexor').isValid() -> false
     *
     ***/
    'isValid': function() {
      return !isNaN(this.getTime());
    },

     /***
     * @method isAfter(<d>, [margin])
     * @returns Boolean
     * @short Returns true if the date is after the <d>.
     * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, <d> is assumed to be now.
     * @example
     *
     *   new Date().isAfter('tomorrow')  -> false
     *   new Date().isAfter('yesterday') -> true
     *
     ***/
    'isAfter': function(d, margin) {
      return this.getTime() > Date.create(d).getTime() - (margin || 0);
    },

     /***
     * @method isBefore(<d>, [margin])
     * @returns Boolean
     * @short Returns true if the date is before <d>.
     * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, <d> is assumed to be now.
     * @example
     *
     *   new Date().isBefore('tomorrow')  -> true
     *   new Date().isBefore('yesterday') -> false
     *
     ***/
    'isBefore': function(d, margin) {
      return this.getTime() < Date.create(d).getTime() + (margin || 0);
    },

     /***
     * @method isBetween(<d1>, <d2>, [margin])
     * @returns Boolean
     * @short Returns true if the date falls between <d1> and <d2>.
     * @extra [margin] is to allow extra margin of error (in ms). <d1> and <d2> will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, they are assumed to be now.
     * @example
     *
     *   new Date().isBetween('yesterday', 'tomorrow')    -> true
     *   new Date().isBetween('last year', '2 years ago') -> false
     *
     ***/
    'isBetween': function(d1, d2, margin) {
      var t  = this.getTime();
      var t1 = Date.create(d1).getTime();
      var t2 = Date.create(d2).getTime();
      var lo = Math.min(t1, t2);
      var hi = Math.max(t1, t2);
      margin = margin || 0;
      return (lo - margin < t) && (hi + margin > t);
    },

     /***
     * @method isLeapYear()
     * @returns Boolean
     * @short Returns true if the date is a leap year.
     * @example
     *
     *   Date.create('2000').isLeapYear() -> true
     *
     ***/
    'isLeapYear': function() {
      var year = this.getFullYear();
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    },

     /***
     * @method daysInMonth()
     * @returns Number
     * @short Returns the number of days in the date's month.
     * @example
     *
     *   Date.create('May').daysInMonth()            -> 31
     *   Date.create('February, 2000').daysInMonth() -> 29
     *
     ***/
    'daysInMonth': function() {
      return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
    },

     /***
     * @method format(<format>, [locale] = currentLocale)
     * @returns String
     * @short Formats the date.
     * @extra <format> will accept a number of tokens as well as pre-determined formats. [locale] specifies a locale code to use. If <format> is blank, a default format for the current locale is used. A function may also be passed here to allow more granular control. %relative% is provided as an alias. See @date_format for more details.
     * @example
     *
     *   Date.create().format()                                   -> ex. July 4, 2003
     *   Date.create().format('{Weekday} {d} {Month}, {YYYY}')    -> ex. Monday July 4, 2003
     *   Date.create().format('{hh}:{mm}')                        -> ex. 15:57
     *   Date.create().format('{12hr}:{mm}{tt}')                  -> ex. 3:57pm
     *   Date.create().format(Date.RFC1123)                       -> ex. Tue, 05 Jul 2011 04:04:22 GMT+0900
     *   Date.create().format(Date.ISO8601)                       -> ex. 2011-07-05 12:24:55.528Z
     *   Date.create('beginning of this week').format('relative') -> ex. 3 days ago
     *   Date.create('yesterday').format(function(value,unit,ms,loc) {
     *     // value = 1, unit = 'day', ms = -86400000, loc = [current locale object]
     *   });                                                      -> ex. 1 day ago
     *
     ***/
    'format': function(f, locale) {
      return formatDate(this, f, false, locale);
    },

     /***
     * @method relative([fn], [locale] = currentLocale)
     * @returns String
     * @short Returns a relative date string offset to the current time.
     * @extra [fn] can be passed to provide for more granular control over the resulting string. [fn] is passed 4 arguments: the adjusted value, unit, offset in milliseconds, and a localization object. For more information, see @date_format.
     * @example
     *
     *   Date.create('90 seconds ago').relative() -> 1 minute ago
     *   Date.create('January').relative()        -> ex. 5 months ago
     +   Date.create('120 minutes ago').relative(function(val, unit, ms, dir) {
     *    return val + ' ' + unit + ' ago';
     *   });                                      -> ex. 5 months ago
     *
     ***/
    'relative': function(fn, locale) {
      if(Object.isString(fn)) {
        locale = fn;
        fn = null;
      }
      return formatDate(this, fn, true, locale);
    },

     /***
     * @method is(<d>, [buffer])
     * @returns Boolean
     * @short Returns true if the date is <d>.
     * @extra <d> will accept a date object, timestamp, or text format. %is% additionally understands more generalized expressions like month/weekday names, 'today', etc, and compares to the precision implied in <d>. [buffer] allows an extra buffer of error in milliseconds.  For more information, see @date_format.
     * @example
     *
     *   Date.create().is('July')               -> true or false?
     *   Date.create().is('1776')               -> false
     *   Date.create().is('today')              -> true
     *   Date.create().is('weekday')            -> true or false?
     *   Date.create().is('July 4, 1776')       -> false
     *   Date.create().is(-6106093200000)       -> false
     *   Date.create().is(new Date(1776, 6, 4)) -> false
     *
     ***/
    'is': function(d, buffer) {
      var tmp;
      if(Object.isString(d)) {
        d = d.trim().toLowerCase();
        switch(true) {
          case d === 'future':  return this.getTime() > new Date().getTime();
          case d === 'past':    return this.getTime() < new Date().getTime();
          case d === 'weekday': return this.getDay() > 0 && this.getDay() < 6;
          case d === 'weekend': return this.getDay() === 0 || this.getDay() === 6;
          case (tmp = English['weekdays'].indexOf(d) % 7) > -1: return this.getDay() === tmp;
          case (tmp = English['months'].indexOf(d) % 12) > -1:  return this.getMonth() === tmp;
        }
      }
      return compareDate(this, d, buffer);
    },

     /***
     * @method resetTime()
     * @returns Date
     * @short Resets the time in the date to 00:00:00.000.
     * @example
     *
     *   Date.create().resetTime()  -> Beginning of today
     *
     ***/
    'resetTime': function() {
      return this.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    },

     /***
     * @method clone()
     * @returns Date
     * @short Clones the date.
     * @example
     *
     *   Date.create().clone() -> Copy of now
     *
     ***/
    'clone': function() {
      return new Date(this.getTime());
    }

  });


  // Instance aliases
  extend(Date, true, false, {

     /***
     * @method getWeekday()
     * @alias getDay
     *
     ***/
    'getWeekday':    Date.prototype.getDay,

     /***
     * @method getUTCWeekday()
     * @alias getUTCDay
     *
     ***/
    'getUTCWeekday':    Date.prototype.getUTCDay

  });



  // Initializer
  function initialize() {
    buildObject();
    buildWidthConversionTables();
    buildDate();
  }

  initialize();



})();


