/*
 *
 * Sugar
 *
 * A library for working with primitive Javascript objects.
 *
 */

(function(){

  /** Private functions used throughout the API. **/

  var extend = function(klass, instance, extend){
    for(var name in extend){
      if(extend.hasOwnProperty(name) && (instance ? !klass.prototype[name] : !klass[name])){
        if(instance){
          klass.prototype[name] = extend[name];
        } else {
          klass[name] = extend[name];
        }
      }
    }
  };

  var extendWithNativeCondition = function(klass, instance, condition, methods){
    var extendee = instance ? klass.prototype : klass;
    iterateOverObject(methods, function(name, fn){
      extendee[name] = wrapNative(extendee[name], fn, condition);
    });
  };

  var wrapNative = function(nativeFn, extendedFn, condition){
    return function(){
      if(nativeFn && (condition === true || condition.apply(this, arguments))){
        return nativeFn.apply(this, arguments);
      } else {
        return extendedFn.apply(this, arguments);
      }
    }
  };

  var collectArguments = function(args){
    if(typeof args[0] === 'object') return args;
    var result = {};
    var format = Array.prototype.slice.call(arguments, 1);
    for(var i = 0; i < args.length; i++){
      result[format[i]] = args[i];
    }
    return [result];
  };

  var deepEquals = function(a,b){
    if(typeof a == 'object' && typeof b == 'object'){
      var checked = false;
      for(var key in a){
        if(!a.hasOwnProperty(key)) continue;
        if(!deepEquals(a[key], b[key])){
          return false;
        }
        checked = true;
      }
      if(!checked){
        for(var key in b){
          if(!b.hasOwnProperty(key)) continue;
          return false;
        }
      }
      return true;
    } else {
      return a === b;
    }
  };

  var multiMatch = function(el, match, scope, params){
    if(Object.isRegExp(match)){
      // Match against a regexp
      return match.test(el);
    } else if(Object.isFunction(match)){
      // Match against a filtering function
      return match.apply(scope, [el].concat(params));
    } else if(typeof match === 'object'){
      // Match against a hash or array.
      return deepEquals(match, el);
    } else if(match !== undefined){
      // Do a one-to-one equals
      return match === el;
    } else {
      // If undefined, match if truthy.
      return !!el;
    }
  };

  var transformArgument = function(argument, transform, scope, params){
    if(Object.isFunction(transform)){
      return transform.apply(scope, [argument].concat(params));
    } else if(transform === undefined){
      return argument;
    } else {
      return argument[transform];
    }
  };

  var getMinOrMax = function(obj, which, transform){
    var max = which === 'max', min = which === 'min';
    var edge = max ? -Infinity : Infinity;
    var result = [];
    for(var key in obj){
      if(!obj.hasOwnProperty(key)) continue;
      var entry = obj[key];
      var test = transformArgument(entry, transform);
      if(test === undefined || test === null){
        continue;
      } else if(test === edge){
        result.push(entry);
      } else if((max && test > edge) || (min && test < edge)){
        result = [entry];
        edge = test;
      }
    }
    return result;
  };

  var getFromIndexes = function(obj, arguments, str){
    var loop = arguments[arguments.length - 1] !== false,
        result = [],
        index, i;
    for(i = 0; i < arguments.length; i++){
      index = arguments[i];
      if(index === true || index === false) break;
      if(loop){
        index = index % obj.length;
        if(index < 0) index = obj.length + index;
      }
      if(index >= 0 && index < obj.length){
        result.push(str ? obj.charAt(index) : obj[index]);
      }
    }
    if(result.length == 0){
      return str ? '' : null;
    } else if(result.length == 1){
      return result[0];
    } else {
      return result;
    }
  }







  /***
   * Object module
   *
   * Much thanks to "kangax" for his informative aricle about how problems with instanceof and constructor
   * http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
   *
   ***/

  var instance = function(obj, str){
    return Object.prototype.toString.call(obj) === '[object '+str+']';
  };

  var Hash = function(obj){
    var self = this;
    iterateOverObject(obj, function(key, value){
      self[key] = value;
    });
  }

  var typeMethods = ['Array','Boolean','Date','Function','Number','String','RegExp'];
  var hashMethods = ['keys','values','each','merge','clone','isEmpty','equals'];

  /***
   * @method Object.isArray(<obj>)
   * @returns Boolean
   * @description Returns true if <obj> is an Array. False otherwise.
   * @example
   *
   *   Object.isArray([1,2,3])  -> true
   *   Object.isArray('wasabi') -> false
   *   Object.isArray(3)        -> false
   *
   ***
   * @method Object.isBoolean(<obj>)
   * @returns Boolean
   * @description Returns true if <obj> is a Boolean. False otherwise.
   * @example
   *
   *   Object.isBoolean(true)     -> true
   *   Object.isBoolean(false)    -> true
   *   Object.isBoolean('wasabi') -> false
   *   Object.isBoolean(3)        -> false
   *
   ***
   * @method Object.isDate(<obj>)
   * @returns Boolean
   * @description Returns true if <obj> is a Date. False otherwise.
   * @example
   *
   *   Object.isDate(new Date()) -> true
   *   Object.isDate('wasabi')   -> false
   *   Object.isDate(3)          -> false
   *
   ***
   * @method Object.isFunction(<obj>)
   * @returns Boolean
   * @description Returns true if <obj> is a Function. False otherwise.
   * @example
   *
   *   Object.isFunction(function(){}) -> true
   *   Object.isFunction('wasabi')     -> false
   *   Object.isFunction(3)            -> false
   *
   ***
   * @method Object.isNumber(<obj>)
   * @returns Boolean
   * @description Returns true if <obj> is a Number. False otherwise.
   * @example
   *
   *   Object.isNumber(3)        -> true
   *   Object.isNumber('wasabi') -> false
   *   Object.isNumber(/wasabi/) -> false
   *
   ***
   * @method Object.isString(<obj>)
   * @returns Boolean
   * @description Returns true if <obj> is a String. False otherwise.
   * @example
   *
   *   Object.isString('wasabi') -> true
   *   Object.isString(/wasabi/) -> false
   *   Object.isString(3)        -> false
   *
   ***
   * @method Object.isRegExp(<obj>)
   * @returns Boolean
   * @description Returns true if <obj> is a RegExp. False otherwise.
   * @example
   *
   *   Object.isRegExp(/wasabi/) -> true
   *   Object.isRegExp('wasabi') -> false
   *   Object.isRegExp(3)        -> false
   *
   ***/
  var buildObject = function(){
    typeMethods.each(function(m){
      Object['is'+m] = function(obj){
        return instance(obj, m);
      };
    });
    hashMethods.each(function(m){
      Hash.prototype[m] = function(){
        return Object[m].apply(null, [this].concat(Array.prototype.slice.call(arguments)));
      };
    });
    Object.enableSugar = function(){
      typeMethods.each(function(m){
        Object.prototype['is'+m] = function(){
          return instance(this, m);
        };
      });
      hashMethods.each(function(m){
        Object.prototype[m] = Hash.prototype[m];
      });
    };

  };

  var iterateOverObject = function(obj, fn){
    var count = 0;
    for(var key in obj){
      if(!obj.hasOwnProperty(key)) continue;
      fn.call(obj, key, obj[key], count);
      count++;
    }
  };

  extendWithNativeCondition(Object, false, function(){ return arguments.length > 1; }, {

    /***
     * @method Object.create(<obj>)
     * @returns Created object
     * @description This is equivalent to the standard Object constructor %new Object()% but additionally returns an object with extended methods.
     * @example
     *
     *   var f = Object.create({ broken: 'wear', fire: 'breath' });
     *   f.keys() -> ['broken', 'fire'];
     *
     ***/
    'create': function(obj){
      return new Hash(obj);
    }

  });


  extend(Object, false, {

    /***
     * @method Object.isObject(<obj>)
     * @returns Boolean
     * @description Returns true if <obj> is an object literal.
     * @example
     *
     *   Object.isObject({})                 -> true
     *   Object.isObject({ broken: 'wear' }) -> true
     *   Object.isObject('wasabi')           -> false
     *   Object.isObject(3)                  -> false
     *
     ***/
    'isObject': function(o){
      if(o === null || o === undefined || arguments.length === 0){
        return false;
      } else {
        return instance(o, 'Object');
      }
    },

    /***
     * @method Object.each(<obj>, [fn])
     * @returns nothing
     * @description Iterates over each property in <obj>.
     * @example
     *
     *   Object.create({ broken: 'wear' }).each(function(key, value){
     *     // Iterates over each key/value pair.
     *   });
     *
     ***/
    'each': function(obj, fn){
      iterateOverObject(obj, function(k,v){
        if(fn) fn.call(obj, k, v, obj);
      });
    },

    /***
     * @method Object.merge(<obj1>, <obj2>, ...)
     * @returns Merged object
     * @description Accepts an arbitrary number of objects as arguments and merges them all into the first.
     * @example
     *
     *   Object.merge({ broken: 'wear' }, { jumpy: 'jump' }); -> { broken: 'wear', jumpy: 'jump'}
     *
     ***/
    'merge': function(){
      var target = arguments[0];
      for(var i = 1; i < arguments.length; i++){
        var obj = arguments[i];
        for(var key in obj){
          if(!obj.hasOwnProperty(key)) continue;
          target[key] = obj[key];
        }
      }
      return target;
    },

    /***
     * @method Object.clone(<obj>)
     * @returns Cloned object
     * @description Creates a deep clone (copy) of <obj>.
     * @example
     *
     *   Object.clone({ broken: 'wear', jumpy: 'jump' }); -> { broken: 'wear', jumpy: 'jump'}
     *
     ***/
    'clone': function(obj){
      var result = Object.create({});
      iterateOverObject(obj, function(k,v){
        if(Object.isObject(v) || Object.isArray(v)){
          result[k] = Object.clone(v);
        } else {
          result[k] = v;
        }
      });
      return result;
    },

    /***
     * @method Object.isEmpty(<obj>)
     * @returns Boolean
     * @description Returns true if <obj> is empty. False otherwise.
     * @example
     *
     *
     ***/
    'isEmpty': function(obj){
      return deepEquals(obj, {});
    },

    /***
     * @method Object.equals(<a>, <b>)
     * @returns Boolean
     * @description Returns true if <a> and <b> are equal. False otherwise.
     * @example
     *
     *
     ***/
    'equals': function(a, b){
      return deepEquals(a, b);
    }

  });


  extendWithNativeCondition(Object, false, function(){ return arguments.length == 1; }, {

    /***
     * @method Object.keys(<obj>, [fn])
     * @returns Array
     * @description Returns an array containing the keys <obj>. Optionally calls [fn] for each key.
     * @example
     *
     *   Object.create({ broken: 'wear' }).keys() -> ['broken']
     *   Object.create({ broken: 'wear' }).keys(function(key, value){
     *     // Called once for each key.
     *   });
     *
     ***/
    'keys': function(obj, fn){
      var keys = [];
      iterateOverObject(obj, function(k,v){
        keys.push(k);
        if(fn) fn.call(obj, k);
      });
      return keys;
    },

    /***
     * @method Object.values(<obj>, [fn])
     * @returns Array
     * @description Returns an array containing the values of <obj>. Optionally calls [fn] for each value.
     * @example
     *
     *   Object.create({ broken: 'wear' }).values() -> ['wear']
     *   Object.create({ broken: 'wear' }).values(function(value){
     *     // Called once for each value.
     *   });
     *
     ***/
    'values': function(obj, fn){
      var values = [];
      iterateOverObject(obj, function(k,v){
        values.push(v);
        if(fn) fn.call(obj,v);
      });
      return values;
    }


  });



  /***
   * RegExp module
   *
   ***/

  RegExp.NPCGSupport = /()??/.exec("")[1] === undefined; // NPCG: nonparticipating capturing group

  var addGlobalFlag = function(r){
    return new RegExp(r.source, (r.ignoreCase ? 'i' : '') + (r.multiline  ? 'm' : '') + (r.sticky     ? 'y' : '') + 'g');
  }

  extend(RegExp, false, {

   /***
    * @method RegExp.escape(<str>)
    * @returns String
    * @description Escapes all RegExp tokens in a string.
    * @example
    *
    *   RegExp.escape('really?')      -> 'really\?'
    *   RegExp.escape('yes.')         -> 'yes\.'
    *   RegExp.escape('(not really)') -> '\(not really\)'
    *
    ***/
    'escape': function(str){
      return str.replace(/([/'*+?|()\[\]{}.^$])/g,'\\$1');
    },

   /***
    * @method RegExp.unescape(<str>)
    * @returns String
    * @description Unescapes all RegExp tokens in a string.
    * @example
    *
    *   RegExp.unescape('really?')      -> 'really\?'
    *   RegExp.unescape('yes.')         -> 'yes\.'
    *   RegExp.unescape('(not really)') -> '\(not really\)'
    *
    ***/
    'unescape': function(str){
      return str.replace(/\\([/'*+?|()\[\]{}.^$])/g,'$1');
    }

  });










  /***
   * Number module
   *
   ***/

  var round = function(val, precision, method){
    var fn = Math[method];
    var multiplier = Math.pow(10, Math.abs(precision || 0));
    if(precision < 0) multiplier = 1 / multiplier;
    return fn(val * multiplier) / multiplier;
  }

  extend(Number, true, {

    /***
     * @method toNumber()
     * @returns Number
     * @description Returns a number. This is mostly for compatibility reasons.
     * @example
     *
     *   (420).toNumber() -> 420
     *
     ***/
    'toNumber': function(){
      return parseFloat(this, 10);
    },

    /***
     * @method ceil([precision])
     * @returns Number
     * @description Rounds the number up. If [precision] is specified it will round to the given precision.
     * @example
     *
     *   (4.434).ceil()  -> 5
     *   (-4.434).ceil() -> -4
     *   (44.17).ceil(1) -> 44.2
     *   (4417).ceil(-2) -> 4500
     *
     ***/
    'ceil': function(precision){
      return round(this, precision, 'ceil');
    },

    /***
     * @method floor([precision])
     * @returns Number
     * @description Rounds the number down. If [precision] is specified it will round to the given precision.
     * @example
     *
     *   (4.434).floor()  -> 4
     *   (-4.434).floor() -> -5
     *   (44.17).floor(1) -> 44.1
     *   (4417).floor(-2) -> 4400
     *
     ***/
    'floor': function(precision){
      return round(this, precision, 'floor');
    },

    /***
     * @method abs()
     * @returns Number
     * @description Returns the absolute value for the number.
     * @example
     *
     *   (3).abs()  -> 3
     *   (-3).abs() -> 3
     *
     ***/
    'abs': function(){
      return Math.abs(this);
    },

    /***
     * @method pow(<p> = 1)
     * @returns Number
     * @description Returns the number to the power of <p>.
     * @example
     *
     *   (3).pow(2); -> 9
     *   (3).pow(3); -> 27
     *   (3).pow();  -> 3
     *
     ***/
    'pow': function(power){
      if(power === undefined || power == null) power = 1;
      return Math.pow(this, power);
    },

    /***
     * @method round(<precision> = 0)
     * @returns Number
     * @description Rounds a number to the precision of <precision>
     * @example
     *
     *   (3.241).round();  -> 3
     *   (3.841).round();  -> 4
     *   (-3.241).round(); -> -3
     *   (-3.841).round(); -> -4
     *   (3.241).round(2); -> 3.24
     *   (3748).round(-2); -> 3800
     *
     ***/
    'round': function(precision){
      return round(this, precision, 'round');
    },

    /***
     * @method chr()
     * @returns String
     * @description Returns a string at the code point of the number.
     * @example
     *
     *   (65).chr(); -> "A"
     *   (75).chr(); -> "K"
     *
     ***/
    'chr': function(){
      return String.fromCharCode(this);
    },

    /***
     * @method odd()
     * @returns Boolean
     * @description Returns true if the number is odd.
     * @example
     *
     *   (3).odd();  -> true
     *   (18).odd(); -> false
     *
     ***/
    'odd': function(){
      return !this.multipleOf(2);
    },

    /***
     * @method even()
     * @returns Boolean
     * @description Returns true if the number is even.
     * @example
     *
     *   (6).even();  -> true
     *   (17).even(); -> false
     *
     ***/
    'even': function(){
      return this.multipleOf(2);
    },

    /***
     * @method multipleOf(<num>)
     * @returns Boolean
     * @description Returns true if the number is a multiple of <num>.
     * @example
     *
     *   (6).multipleOf(2);  -> true
     *   (17).multipleOf(2); -> false
     *   (32).multipleOf(4); -> true
     *   (34).multipleOf(4); -> false
     *
     ***/
    'multipleOf': function(num){
      return this % num === 0;
    },

    /***
     * @method upto(<num>, [fn])
     * @returns Array
     * @description Returns an array containing numbers from the number up to <num>. Optionally calls [fn] callback for each number in that array.
     * @example
     *
     *   (2).upto(6); -> [2, 3, 4, 5, 6]
     *   (2).upto(6, function(n){
     *     // This function is called 5 times receiving n as the value.
     *   });
     *
     ***/
    'upto': function(num, fn){
      var arr = [];
      for(var i = parseInt(this); i <= num; i++){
        arr.push(i);
        if(fn) fn.call(this, i);
      }
      return arr;
    },

    /***
     * @method downto(<num>, [fn])
     * @returns Array
     * @description Returns an array containing numbers from the number down to <num>. Optionally calls [fn] callback for each number in that array.
     * @example
     *
     *   (8).downto(3); -> [8, 7, 6, 5, 4, 3]
     *   (8).upto(3, function(n){
     *     // This function is called 6 times receiving n as the value.
     *   });
     *
     ***/
    'downto': function(num, fn){
      var arr = [];
      for(var i = parseInt(this); i >= num; i--){
        arr.push(i);
        if(fn) fn.call(this, i);
      }
      return arr;
    },


    /***
     * @method times(<fn>)
     * @returns Nothing
     * @description Calls <fn> a number of times equivalent to the number.
     * @example
     *
     *   (8).times(function(i){
     *     // This function is called 8 times. i is a counter for the current iteration.
     *   });
     *
     ***/
    'times': function(fn){
      if(fn){
        for(var i = 0; i < this; i++){
          fn.call(this, i);
        }
      }
      return this.toNumber();
    },

    /***
     * @method ordinalize()
     * @returns String
     * @description Returns an ordinalized (English) string, i.e. "1st", "2nd", etc.
     * @example
     *
     *   (1).ordinalize(); -> '1st';
     *   (2).ordinalize(); -> '2nd';
     *   (8).ordinalize(); -> '8th';
     *
     ***/
    'ordinalize': function(){
      var suffix;
      if(this >= 11 && this <= 13){
        suffix = 'th';
      } else {
        switch(this % 10){
          case 1:  suffix = 'st'; break;
          case 2:  suffix = 'nd'; break;
          case 3:  suffix = 'rd'; break;
          default: suffix = 'th';
        }
      }
      return this.toString() + suffix;
    },


    /***
     * @method pad(<place> = 0, [sign] = false)
     * @returns String
     * @description Pads a number with "0" to <place>. [sign] allows you to force the sign as well (+05, etc).
     * @example
     *
     *   (5).pad(2);  -> '05'
     *   (-5).pad(4); -> '-0005'
     *   (82).pad(3); -> '+072'
     *
     ***/
    'pad': function(place, sign){
      var str  = this.toNumber() === 0 ? '' : this.toString().replace(/^-/, '');
      str = str.padLeft(place - str.length, '0');
      if(sign || this < 0){
        str = (this < 0 ? '-' : '+') + str;
      }
      return str;
    },

    /***
     * @method format([comma] = ',', [period] = '.')
     * @returns String
     * @description Formats a string separating the thousands into groups. [comma] is the character used for the thousands separator. [period] is the character used for the decimal point.
     * @example
     *
     *   (56782).format();  -> '56,782'
     *   (4388.43).format(); -> '4,388.43'
     *   (4388.43).format(' '); -> '4 388.43'
     *   (4388.43).format('.', ','); -> '4.388,43'
     *
     ***/
    'format': function(comma, period){
      comma = comma || ',';
      period = period || '.';
      var split = this.toString().split('.');
      var numeric = split[0];
      var decimal = split.length > 1 ? period + split[1] : '';
      var reg = /(\d+)(\d{3})/;
      while (reg.test(numeric)){
        numeric = numeric.replace(reg, '$1' + comma + '$2');
      }
      return numeric + decimal;
    },

    /***
     * @method hex()
     * @returns String
     * @description Converts the number to hexidecimal.
     * @example
     *
     *   (255).hex();   -> 'ff';
     *   (23654).hex(); -> '5c66';
     *
     ***/
    'hex': function(){
      return this.toString(16);
    }

  });









  /***
   * String module
   *
   ***/


  var normalizeTable;
  var accentTable;
  var fullWidthTable;
  var halfWidthTable;
  var hiraganaTable;
  var katakanaTable;

  var accentedChars = [
    { character: 'à', base: 'a',  accent: '`'  },
    { character: 'ā', base: 'a',  accent: '-'  },
    { character: 'á', base: 'a',  accent: '\'' },
    { character: 'ǎ', base: 'a',  accent: 'v'  },
    { character: 'ä', base: 'a',  accent: ':'  },
    { character: 'ă', base: 'a',  accent: 'u'  },
    { character: 'â', base: 'a',  accent: '^'  },
    { character: 'å', base: 'a',  accent: 'o'  },
    { character: 'ã', base: 'a',  accent: '~'  },
    { character: 'ć', base: 'c',  accent: '\'' },
    { character: 'č', base: 'c',  accent: 'v'  },
    { character: 'ĉ', base: 'c',  accent: '^'  },
    { character: 'ċ', base: 'c',  accent: '.'  },
    { character: 'ç', base: 'c',  accent: ','  },
    { character: 'ď', base: 'd',  accent: 'v'  },
    { character: 'đ', base: 'd',  accent: '-'  },
    { character: 'è', base: 'e',  accent: '`'  },
    { character: 'ē', base: 'e',  accent: '-'  },
    { character: 'é', base: 'e',  accent: '\'' },
    { character: 'ě', base: 'e',  accent: 'v'  },
    { character: 'ë', base: 'e',  accent: ':'  },
    { character: 'ĕ', base: 'e',  accent: 'u'  },
    { character: 'ê', base: 'e',  accent: '^'  },
    { character: 'ğ', base: 'g',  accent: 'u'  },
    { character: 'ì', base: 'i',  accent: '`'  },
    { character: 'ī', base: 'i',  accent: '-'  },
    { character: 'í', base: 'i',  accent: '\'' },
    { character: 'ǐ', base: 'i',  accent: 'v'  },
    { character: 'ï', base: 'i',  accent: ':'  },
    { character: 'ĭ', base: 'i',  accent: 'u'  },
    { character: 'î', base: 'i',  accent: '^'  },
    { character: 'ĩ', base: 'i',  accent: '~'  },
    { character: 'ĺ', base: 'l',  accent: '`'  },
    { character: 'ľ', base: 'l',  accent: '\'' },
    { character: 'ł', base: 'l',  accent: '/'  },
    { character: 'ň', base: 'n',  accent: 'v'  },
    { character: 'ń', base: 'n',  accent: '\'' },
    { character: 'ñ', base: 'n',  accent: '~'  },
    { character: 'ò', base: 'o',  accent: '`'  },
    { character: 'ō', base: 'o',  accent: '-'  },
    { character: 'ó', base: 'o',  accent: '\'' },
    { character: 'ǒ', base: 'o',  accent: 'v'  },
    { character: 'ö', base: 'o',  accent: ':'  },
    { character: 'ŏ', base: 'o',  accent: 'u'  },
    { character: 'ô', base: 'o',  accent: '^'  },
    { character: 'õ', base: 'o',  accent: '~'  },
    { character: 'ø', base: 'o',  accent: '/'  },
    { character: 'ő', base: 'o',  accent: '"'  },
    { character: 'ř', base: 'r',  accent: 'v'  },
    { character: 'ŕ', base: 'r',  accent: '\'' },
    { character: 'š', base: 's',  accent: 'v'  },
    { character: 'ş', base: 's',  accent: ','  },
    { character: 'ś', base: 's',  accent: '\'' },
    { character: 'ť', base: 't',  accent: '\'' },
    { character: 'ţ', base: 't',  accent: ','  },
    { character: 'ù', base: 'u',  accent: '`'  },
    { character: 'ū', base: 'u',  accent: '-'  },
    { character: 'ú', base: 'u',  accent: '\'' },
    { character: 'ǔ', base: 'u',  accent: 'v'  },
    { character: 'ü', base: 'u',  accent: ':'  },
    { character: 'ŭ', base: 'u',  accent: 'u'  },
    { character: 'û', base: 'u',  accent: '^'  },
    { character: 'ů', base: 'u',  accent: 'o'  },
    { character: 'ǘ', base: 'u',  accent: '\':'},
    { character: 'ǖ', base: 'u',  accent: '-:' },
    { character: 'ý', base: 'y',  accent: '\'' },
    { character: 'ÿ', base: 'y',  accent: ':'  },
    { character: 'ŷ', base: 'y',  accent: '^'  },
    { character: 'ž', base: 'z',  accent: 'v'  },
    { character: 'ź', base: 'z',  accent: '\'' },
    { character: 'ż', base: 'z',  accent: '.'  },
    { character: 'œ', base: 'oe', accent: ''  },
    { character: 'æ', base: 'ae', accent: ''  }
  ];


  var variableWidthChars = [

    { full:'　', half:' ',  type: 'p' },
    { full:'、', half:'､',  type: 'p' },
    { full:'。', half:'｡',  type: 'p' },
    { full:'，', half:',',  type: 'p' },
    { full:'．', half:'.',  type: 'p' },
    { full:'・', half:'･',  type: 'p' },
    { full:'：', half:':',  type: 'p' },
    { full:'；', half:';',  type: 'p' },
    { full:'？', half:'?',  type: 'p' },
    { full:'！', half:'!',  type: 'p' },
    { full:'‘',  half:'\'', type: 'p' },
    { full:'’',  half:'\'', type: 'p' },
    { full:'“',  half:'"',  type: 'p' },
    { full:'”',  half:'"',  type: 'p' },
    { full:'ー', half:'ｰ',  type: 'p' },
    { full:'～', half:'~',  type: 'p' },
    { full:'゛', half:'ﾞ',  type: 's' },
    { full:'゜', half:'ﾟ',  type: 's' },
    { full:'＾', half:'^',  type: 's' },
    { full:'‐',  half:'-',  type: 's' },
    { full:'／', half:'/',  type: 's' },
    { full:'｜', half:'|',  type: 's' },
    { full:'（', half:'(',  type: 's' },
    { full:'）', half:')',  type: 's' },
    { full:'［', half:'[',  type: 's' },
    { full:'］', half:']',  type: 's' },
    { full:'｛', half:'{',  type: 's' },
    { full:'｝', half:'}',  type: 's' },
    { full:'「', half:'｢',  type: 's' },
    { full:'」', half:'｣',  type: 's' },
    { full:'〈', half:'<',  type: 's' },
    { full:'〉', half:'>',  type: 's' },
    { full:'《', half:'«',  type: 's' },
    { full:'》', half:'»',  type: 's' },
    { full:'＋', half:'+',  type: 's' },
    { full:'－', half:'-',  type: 's' },
    { full:'＝', half:'=',  type: 's' },
    { full:'＜', half:'<',  type: 's' },
    { full:'＞', half:'>',  type: 's' },
    { full:'℃',  half:'°C', type: 's' },
    { full:'￥', half:'¥',  type: 's' },
    { full:'＄', half:'$',  type: 's' },
    { full:'￠', half:'¢',  type: 's' },
    { full:'￡', half:'£',  type: 's' },
    { full:'％', half:'%',  type: 's' },
    { full:'＃', half:'#',  type: 's' },
    { full:'＆', half:'&',  type: 's' },
    { full:'＊', half:'*',  type: 's' },
    { full:'＠', half:'@',  type: 's' },
    { full:'０', half:'0',  type: 'n' },
    { full:'１', half:'1',  type: 'n' },
    { full:'２', half:'2',  type: 'n' },
    { full:'３', half:'3',  type: 'n' },
    { full:'４', half:'4',  type: 'n' },
    { full:'５', half:'5',  type: 'n' },
    { full:'６', half:'6',  type: 'n' },
    { full:'７', half:'7',  type: 'n' },
    { full:'８', half:'8',  type: 'n' },
    { full:'９', half:'9',  type: 'n' },
    { full:'Ａ', half:'A',  type: 'a' },
    { full:'Ｂ', half:'B',  type: 'a' },
    { full:'Ｃ', half:'C',  type: 'a' },
    { full:'Ｄ', half:'D',  type: 'a' },
    { full:'Ｅ', half:'E',  type: 'a' },
    { full:'Ｆ', half:'F',  type: 'a' },
    { full:'Ｇ', half:'G',  type: 'a' },
    { full:'Ｈ', half:'H',  type: 'a' },
    { full:'Ｉ', half:'I',  type: 'a' },
    { full:'Ｊ', half:'J',  type: 'a' },
    { full:'Ｋ', half:'K',  type: 'a' },
    { full:'Ｌ', half:'L',  type: 'a' },
    { full:'Ｍ', half:'M',  type: 'a' },
    { full:'Ｎ', half:'N',  type: 'a' },
    { full:'Ｏ', half:'O',  type: 'a' },
    { full:'Ｐ', half:'P',  type: 'a' },
    { full:'Ｑ', half:'Q',  type: 'a' },
    { full:'Ｒ', half:'R',  type: 'a' },
    { full:'Ｓ', half:'S',  type: 'a' },
    { full:'Ｔ', half:'T',  type: 'a' },
    { full:'Ｕ', half:'U',  type: 'a' },
    { full:'Ｖ', half:'V',  type: 'a' },
    { full:'Ｗ', half:'W',  type: 'a' },
    { full:'Ｘ', half:'X',  type: 'a' },
    { full:'Ｙ', half:'Y',  type: 'a' },
    { full:'Ｚ', half:'Z',  type: 'a' },
    { full:'ａ', half:'a',  type: 'a' },
    { full:'ｂ', half:'b',  type: 'a' },
    { full:'ｃ', half:'c',  type: 'a' },
    { full:'ｄ', half:'d',  type: 'a' },
    { full:'ｅ', half:'e',  type: 'a' },
    { full:'ｆ', half:'f',  type: 'a' },
    { full:'ｇ', half:'g',  type: 'a' },
    { full:'ｈ', half:'h',  type: 'a' },
    { full:'ｉ', half:'i',  type: 'a' },
    { full:'ｊ', half:'j',  type: 'a' },
    { full:'ｋ', half:'k',  type: 'a' },
    { full:'ｌ', half:'l',  type: 'a' },
    { full:'ｍ', half:'m',  type: 'a' },
    { full:'ｎ', half:'n',  type: 'a' },
    { full:'ｏ', half:'o',  type: 'a' },
    { full:'ｐ', half:'p',  type: 'a' },
    { full:'ｑ', half:'q',  type: 'a' },
    { full:'ｒ', half:'r',  type: 'a' },
    { full:'ｓ', half:'s',  type: 'a' },
    { full:'ｔ', half:'t',  type: 'a' },
    { full:'ｕ', half:'u',  type: 'a' },
    { full:'ｖ', half:'v',  type: 'a' },
    { full:'ｗ', half:'w',  type: 'a' },
    { full:'ｘ', half:'x',  type: 'a' },
    { full:'ｙ', half:'y',  type: 'a' },
    { full:'ｚ', half:'z',  type: 'a' },
    { full:'ァ', half:'ｧ',  type: 'k' },
    { full:'ア', half:'ｱ',  type: 'k' },
    { full:'ィ', half:'ｨ',  type: 'k' },
    { full:'イ', half:'ｲ',  type: 'k' },
    { full:'ゥ', half:'ｩ',  type: 'k' },
    { full:'ウ', half:'ｳ',  type: 'k' },
    { full:'ェ', half:'ｪ',  type: 'k' },
    { full:'エ', half:'ｴ',  type: 'k' },
    { full:'ォ', half:'ｫ',  type: 'k' },
    { full:'オ', half:'ｵ',  type: 'k' },
    { full:'カ', half:'ｶ',  type: 'k' },
    { full:'ガ', half:'ｶﾞ', type: 'k' },
    { full:'キ', half:'ｷ',  type: 'k' },
    { full:'ギ', half:'ｷﾞ', type: 'k' },
    { full:'ク', half:'ｸ',  type: 'k' },
    { full:'グ', half:'ｸﾞ', type: 'k' },
    { full:'ケ', half:'ｹ',  type: 'k' },
    { full:'ゲ', half:'ｹﾞ', type: 'k' },
    { full:'コ', half:'ｺ',  type: 'k' },
    { full:'ゴ', half:'ｺﾞ', type: 'k' },
    { full:'サ', half:'ｻ',  type: 'k' },
    { full:'ザ', half:'ｻﾞ', type: 'k' },
    { full:'シ', half:'ｼ',  type: 'k' },
    { full:'ジ', half:'ｼﾞ', type: 'k' },
    { full:'ス', half:'ｽ',  type: 'k' },
    { full:'ズ', half:'ｽﾞ', type: 'k' },
    { full:'セ', half:'ｾ',  type: 'k' },
    { full:'ゼ', half:'ｾﾞ', type: 'k' },
    { full:'ソ', half:'ｿ',  type: 'k' },
    { full:'ゾ', half:'ｿﾞ', type: 'k' },
    { full:'タ', half:'ﾀ',  type: 'k' },
    { full:'ダ', half:'ﾀﾞ', type: 'k' },
    { full:'チ', half:'ﾁ',  type: 'k' },
    { full:'ヂ', half:'ﾁﾞ', type: 'k' },
    { full:'ッ', half:'ｯ',  type: 'k' },
    { full:'ツ', half:'ﾂ',  type: 'k' },
    { full:'ヅ', half:'ﾂﾞ', type: 'k' },
    { full:'テ', half:'ﾃ',  type: 'k' },
    { full:'デ', half:'ﾃﾞ', type: 'k' },
    { full:'ト', half:'ﾄ',  type: 'k' },
    { full:'ド', half:'ﾄﾞ', type: 'k' },
    { full:'ナ', half:'ﾅ',  type: 'k' },
    { full:'ニ', half:'ﾆ',  type: 'k' },
    { full:'ヌ', half:'ﾇ',  type: 'k' },
    { full:'ネ', half:'ﾈ',  type: 'k' },
    { full:'ノ', half:'ﾉ',  type: 'k' },
    { full:'ハ', half:'ﾊ',  type: 'k' },
    { full:'バ', half:'ﾊﾞ', type: 'k' },
    { full:'パ', half:'ﾊﾟ', type: 'k' },
    { full:'ヒ', half:'ﾋ',  type: 'k' },
    { full:'ビ', half:'ﾋﾞ', type: 'k' },
    { full:'ピ', half:'ﾋﾟ', type: 'k' },
    { full:'フ', half:'ﾌ',  type: 'k' },
    { full:'ブ', half:'ﾌﾞ', type: 'k' },
    { full:'プ', half:'ﾌﾟ', type: 'k' },
    { full:'ヘ', half:'ﾍ',  type: 'k' },
    { full:'ベ', half:'ﾍﾞ', type: 'k' },
    { full:'ペ', half:'ﾍﾟ', type: 'k' },
    { full:'ホ', half:'ﾎ',  type: 'k' },
    { full:'ボ', half:'ﾎﾞ', type: 'k' },
    { full:'ポ', half:'ﾎﾟ', type: 'k' },
    { full:'マ', half:'ﾏ',  type: 'k' },
    { full:'ミ', half:'ﾐ',  type: 'k' },
    { full:'ム', half:'ﾑ',  type: 'k' },
    { full:'メ', half:'ﾒ',  type: 'k' },
    { full:'モ', half:'ﾓ',  type: 'k' },
    { full:'ャ', half:'ｬ',  type: 'k' },
    { full:'ヤ', half:'ﾔ',  type: 'k' },
    { full:'ュ', half:'ｭ',  type: 'k' },
    { full:'ユ', half:'ﾕ',  type: 'k' },
    { full:'ョ', half:'ｮ',  type: 'k' },
    { full:'ヨ', half:'ﾖ',  type: 'k' },
    { full:'ラ', half:'ﾗ',  type: 'k' },
    { full:'リ', half:'ﾘ',  type: 'k' },
    { full:'ル', half:'ﾙ',  type: 'k' },
    { full:'レ', half:'ﾚ',  type: 'k' },
    { full:'ロ', half:'ﾛ',  type: 'k' },
    { full:'ワ', half:'ﾜ',  type: 'k' },
    { full:'ヲ', half:'ｦ',  type: 'k' },
    { full:'ン', half:'ﾝ',  type: 'k' }

  ];


  var kana = [

    { 'hira':'ぁ', 'kata':'ァ' },
    { 'hira':'あ', 'kata':'ア' },
    { 'hira':'ぃ', 'kata':'ィ' },
    { 'hira':'い', 'kata':'イ' },
    { 'hira':'ぅ', 'kata':'ゥ' },
    { 'hira':'う', 'kata':'ウ' },
    { 'hira':'ぇ', 'kata':'ェ' },
    { 'hira':'え', 'kata':'エ' },
    { 'hira':'ぉ', 'kata':'ォ' },
    { 'hira':'お', 'kata':'オ' },
    { 'hira':'か', 'kata':'カ' },
    { 'hira':'が', 'kata':'ガ' },
    { 'hira':'き', 'kata':'キ' },
    { 'hira':'ぎ', 'kata':'ギ' },
    { 'hira':'く', 'kata':'ク' },
    { 'hira':'ぐ', 'kata':'グ' },
    { 'hira':'け', 'kata':'ケ' },
    { 'hira':'げ', 'kata':'ゲ' },
    { 'hira':'こ', 'kata':'コ' },
    { 'hira':'ご', 'kata':'ゴ' },
    { 'hira':'さ', 'kata':'サ' },
    { 'hira':'ざ', 'kata':'ザ' },
    { 'hira':'し', 'kata':'シ' },
    { 'hira':'じ', 'kata':'ジ' },
    { 'hira':'す', 'kata':'ス' },
    { 'hira':'ず', 'kata':'ズ' },
    { 'hira':'せ', 'kata':'セ' },
    { 'hira':'ぜ', 'kata':'ゼ' },
    { 'hira':'そ', 'kata':'ソ' },
    { 'hira':'ぞ', 'kata':'ゾ' },
    { 'hira':'た', 'kata':'タ' },
    { 'hira':'だ', 'kata':'ダ' },
    { 'hira':'ち', 'kata':'チ' },
    { 'hira':'ぢ', 'kata':'ヂ' },
    { 'hira':'っ', 'kata':'ッ' },
    { 'hira':'つ', 'kata':'ツ' },
    { 'hira':'づ', 'kata':'ヅ' },
    { 'hira':'て', 'kata':'テ' },
    { 'hira':'で', 'kata':'デ' },
    { 'hira':'と', 'kata':'ト' },
    { 'hira':'ど', 'kata':'ド' },
    { 'hira':'な', 'kata':'ナ' },
    { 'hira':'に', 'kata':'ニ' },
    { 'hira':'ぬ', 'kata':'ヌ' },
    { 'hira':'ね', 'kata':'ネ' },
    { 'hira':'の', 'kata':'ノ' },
    { 'hira':'は', 'kata':'ハ' },
    { 'hira':'ば', 'kata':'バ' },
    { 'hira':'ぱ', 'kata':'パ' },
    { 'hira':'ひ', 'kata':'ヒ' },
    { 'hira':'び', 'kata':'ビ' },
    { 'hira':'ぴ', 'kata':'ピ' },
    { 'hira':'ふ', 'kata':'フ' },
    { 'hira':'ぶ', 'kata':'ブ' },
    { 'hira':'ぷ', 'kata':'プ' },
    { 'hira':'へ', 'kata':'ヘ' },
    { 'hira':'べ', 'kata':'ベ' },
    { 'hira':'ぺ', 'kata':'ペ' },
    { 'hira':'ほ', 'kata':'ホ' },
    { 'hira':'ぼ', 'kata':'ボ' },
    { 'hira':'ぽ', 'kata':'ポ' },
    { 'hira':'ま', 'kata':'マ' },
    { 'hira':'み', 'kata':'ミ' },
    { 'hira':'む', 'kata':'ム' },
    { 'hira':'め', 'kata':'メ' },
    { 'hira':'も', 'kata':'モ' },
    { 'hira':'ゃ', 'kata':'ャ' },
    { 'hira':'や', 'kata':'ヤ' },
    { 'hira':'ゅ', 'kata':'ュ' },
    { 'hira':'ゆ', 'kata':'ユ' },
    { 'hira':'ょ', 'kata':'ョ' },
    { 'hira':'よ', 'kata':'ヨ' },
    { 'hira':'ら', 'kata':'ラ' },
    { 'hira':'り', 'kata':'リ' },
    { 'hira':'る', 'kata':'ル' },
    { 'hira':'れ', 'kata':'レ' },
    { 'hira':'ろ', 'kata':'ロ' },
    { 'hira':'ゎ', 'kata':'ヮ' },
    { 'hira':'わ', 'kata':'ワ' },
    { 'hira':'ゐ', 'kata':'ヰ' },
    { 'hira':'ゑ', 'kata':'ヱ' },
    { 'hira':'を', 'kata':'ヲ' },
    { 'hira':'ん', 'kata':'ン' }

  ];

  var unicodeScripts = [
    { names: ['Greek'],       source: '\\u0370-\\u03FF' },
    { names: ['Cyrillic'],    source: '\\u0400-\\u04FF' },
    { names: ['Armenian'],    source: '\\u0530-\\u058F' },
    { names: ['Hebrew'],      source: '\\u0590-\\u05FF' },
    { names: ['Arabic'],      source: '\\u0600-\\u06FF' },
    { names: ['Thai'],        source: '\\u0E00-\\u0E7F' },
    { names: ['Tibetan'],     source: '\\u0F00-\\u0FFF' },
    { names: ['Georgian'],    source: '\\u10A0-\\u10FF' },
    { names: ['Tagalog'],     source: '\\u1700-\\u171F' },
    { names: ['Mongolian'],   source: '\\u1800-\\u18AF' },
    { names: ['Hiragana'],    source: '\\u3040-\\u309F\\u30FB-\\u30FC' },
    { names: ['Katakana'],    source: "\\u30A0-\\u30FF\\uFF61-\\uFF9F" },
    { names: ['Kana'],        source: '\\u3040-\\u30FF\\uFF61-\\uFF9F' },
    { names: ['Bopomofo'],    source: '\\u3100-\\u312F' },
    { names: ['Hangul'],      source: '\\uAC00-\\uD7AF\\u1100-\\u11FF' },
    { names: ['Han','Kanji'], source: '\\u4E00-\\u9FFF\\uF900-\\uFAFF' }
  ];

  var buildNormalizeTable = function(){
    normalizeTable = {};
    var tempTable = {};
    for(var i=0; i<accentedChars.length; i++){
      var c = accentedChars[i];
      var character = c['character'];
      var base      = c['base'];
      if(!tempTable[base]) tempTable[base] = character;
      else tempTable[base] += character;
    }
    for(var base in tempTable){
      if(!tempTable.hasOwnProperty(base)) continue;
      var chars = tempTable[base];
      normalizeTable[base] = new RegExp('[' + chars + ']', 'g');
      normalizeTable[base.toUpperCase()] = new RegExp('[' + chars.toUpperCase() + ']', 'g');
    }
  }

  var buildAccentTable = function(){
    accentTable = {};
    for(var i=0; i<accentedChars.length; i++){
      var c = accentedChars[i];
      var character = c['character'];
      var accent = c.accent;
      var base = c.base;
      if(!accentTable[accent]) accentTable[accent] = {};
      accentTable[accent][base] = character;
      accentTable[accent][base.toUpperCase()] = character.toUpperCase();
    }
  }

  var buildVariableWidthTables = function(){
    fullWidthTable = {};
    halfWidthTable = {};
    for(var i=0; i<variableWidthChars.length; i++){
      var c = variableWidthChars[i];
      fullWidthTable[c.half] = c;
      halfWidthTable[c.full] = c;
    }
  }

  var buildKanaTables = function(){
    hiraganaTable = {};
    katakanaTable = {};
    for(var i=0; i<kana.length; i++){
      var k = kana[i];
      hiraganaTable[k.kata] = k;
      katakanaTable[k.hira] = k;
    }
  }

  var buildUnicodeScripts = function(){
    unicodeScripts.each(function(s){
      var is = new RegExp('^['+s.source+'\\s]+$');
      var has = new RegExp('['+s.source+']');
      s.names.each(function(name){
        String.prototype['is'+name] = function(){ return !!this.trim().match(is); }
        String.prototype['has'+name] = function(){ return !!this.match(has); }
      });
    });
  }

  var variableWidthMode = function(mode){
    /* hankaku/zenkaku transposition arguments default to everything */
    if(!mode) return { 'a':true,'n':true,'k':true,'s':true,'p':true };
    var result = {};
    if(mode.length < 6){
      for(var i=0; i < mode.length; i++){
        result[mode.charAt(i)] = true;
      }
    } else {
      if(mode === 'alphabet')    result.a = true;
      if(mode === 'numbers')     result.n = true;
      if(mode === 'katakana')    result.k = true;
      if(mode === 'special')     result.s = true;
      if(mode === 'punctuation') result.p = true;
    }
    return result;
  }

  var padString = function(str, num, padding, direction){
    num = num || 0;
    padding = padding || ' ';
    direction = direction || 'both';
    for(var i=0; i<num; i++){
      if(direction === 'left'  || direction === 'both') str = padding + str;
      if(direction === 'right' || direction === 'both') str = str + padding;
    }
    return str.toString();
  }

   // Match patched to support non-participating capturing groups.
   var NPCGMatch = function(str, reg){
     var match = str.match(reg);
     if(match && !RegExp.NPCGSupport && !reg.global){
        for(var i = 1; i < match.length; i++){
          if(match[i] === '') match[i] = undefined;
        }
     }
     return match;
   }

   var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

   if(typeof btoa === 'undefined'){
     btoa = function(str){
       var output = '';
       var chr1, chr2, chr3 = '';
       var enc1, enc2, enc3, enc4 = '';
       var i = 0;
       do {
         chr1 = str.charCodeAt(i++);
         chr2 = str.charCodeAt(i++);
         chr3 = str.charCodeAt(i++);
         enc1 = chr1 >> 2;
         enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
         enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
         enc4 = chr3 & 63;
         if (isNaN(chr2)) {
           enc3 = enc4 = 64;
         } else if (isNaN(chr3)) {
           enc4 = 64;
         }
         output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
         chr1 = chr2 = chr3 = '';
         enc1 = enc2 = enc3 = enc4 = '';
       } while (i < str.length);
       return output;
     }
   }

   if(typeof atob === 'undefined'){

     atob = function(input){
       var output = '';
       var chr1, chr2, chr3 = '';
       var enc1, enc2, enc3, enc4 = '';
       var i = 0;

       // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
       var base64test = /[^A-Za-z0-9\+\/\=]/g;
       if(base64test.test(input)){
         throw new Error('String contains invalid base64 characters');
       }
       input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
       do {
         enc1 = keyStr.indexOf(input.charAt(i++));
         enc2 = keyStr.indexOf(input.charAt(i++));
         enc3 = keyStr.indexOf(input.charAt(i++));
         enc4 = keyStr.indexOf(input.charAt(i++));
         chr1 = (enc1 << 2) | (enc2 >> 4);
         chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
         chr3 = ((enc3 & 3) << 6) | enc4;
         output = output + String.fromCharCode(chr1);
         if (enc3 != 64) {
           output = output + String.fromCharCode(chr2);
         }
         if (enc4 != 64) {
           output = output + String.fromCharCode(chr3);
         }
         chr1 = chr2 = chr3 = "";
         enc1 = enc2 = enc3 = enc4 = "";
       } while (i < input.length);
       return unescape(output);
     }
   }

  var buildString = function(){
    buildKanaTables();
    buildAccentTable();
    buildNormalizeTable();
    buildVariableWidthTables();
    buildUnicodeScripts();
  }



  extend(String, true, {

     /***
      * @method escapeRegExp()
      * @returns String
      * @description Escapes all RegExp tokens in the string.
      * @example
      *
      *   'really'.escapeRegExp()       -> 'really\?'
      *   'yes.'.escapeRegExp()         -> 'yes\.'
      *   '(not really)'.escapeRegExp() -> '\(not really\)'
      *
      ***/
    'escapeRegExp': function(){
      return RegExp.escape(this);
    },

     /***
      * @method unescapeRegExp()
      * @returns String
      * @description Escapes all RegExp tokens in the string.
      * @example
      *
      *   'really'.unescapeRegExp()       -> 'really\?'
      *   'yes.'.unescapeRegExp()         -> 'yes\.'
      *   '(not really)'.unescapeRegExp() -> '\(not really\)'
      *
      ***/
    'unescapeRegExp': function(){
      return RegExp.unescape(this);
    },

    'escapeURL': function(partial){
      return partial ? encodeURI(this) : encodeURIComponent(this);
    },

    'unescapeURL': function(partial){
      return partial ? decodeURI(this) : decodeURIComponent(this);
    },

    'encodeBase64': function(){
      return btoa(this);
    },

    'decodeBase64': function(){
      return atob(this);
    },

    /***
     * @method capitalize()
     * @returns String
     * @description Capitalizes the first character in the string.
      * @example
      *
      *   'hello'.capitalize()              -> 'Hello'
      *   'why hello there...'.capitalize() -> 'Why hello there...'
      *
     *
     ***/
    'capitalize': function(){
      return this.substr(0,1).toUpperCase() + this.substr(1).toLowerCase();
    },

    /***
     * @method trim()
     * @returns String
     * @description Removes leading and trailing whitespace from the string.
     * @example
     *
     *   '   wasabi   '.trim()   -> 'wasabi'
     *   "   wasabi  \n ".trim() -> 'wasabi'
     *
     ***/
    'trim': function(){
      return this.trimLeft().trimRight();
    },

    /***
     * @method trimLeft()
     * @returns String
     * @description Removes leading whitespace from the string.
     * @example
     *
     *   '   wasabi   '.trimLeft()   -> 'wasabi   '
     *   " \n  wasabi   ".trimLeft() -> 'wasabi   '
     *
     ***/
    'trimLeft': function(){
      return this.replace(/^[\s　][\s　]*/, '');
    },

    /***
     * @method trimRight()
     * @returns String
     * @description Removes trailing whitespace from the string.
     * @example
     *
     *   '   wasabi   '.trimRight()   -> '   wasabi'
     *   "   wasabi  \n ".trimRight() -> '   wasabi'
     *
     ***/
    'trimRight': function(){
      return this.replace(/[\s　][\s　]*$/, '');
    },

    /***
     * @method pad([num] = 0, [padding] = ' ')
     * @returns String
     * @description Pads both sides of the string. [num] is the number of characters on each side, and [padding] is the character to pad with.
     * @example
     *
     *   'wasabi'.pad(2)               -> '  wasabi  '
     *   'wasabi'.pad(2, '--')         -> '--wasabi--'
     *   'wasabi'.pad(2).pad(3, '---') -> '---  wasabi  ---'
     *
     ***/
    'pad': function(num, padding){
      return this.padLeft(num, padding).padRight(num, padding);
    },

    /***
     * @method padLeft([num] = 0, [padding] = ' ')
     * @returns String
     * @description Pads the left side of the string. [num] is the number of characters on each side, and [padding] is the character to pad with.
     * @example
     *
     *   'wasabi'.padLeft(2)       -> '  wasabi'
     *   'wasabi'.padLeft(2, '--') -> '--wasabi'
     *
     ***/
    'padLeft': function(num, padding){
      return padString(this, num, padding, 'left');
    },

    /***
     * @method padRight([num] = 0, [padding] = ' ')
     * @returns String
     * @description Pads the right side of the string. [num] is the number of characters on each side, and [padding] is the character to pad with.
     * @example
     *
     *   'wasabi'.padRight(2)       -> 'wasabi  '
     *   'wasabi'.padRight(2, '--') -> 'wasabi--'
     *
     ***/
    'padRight': function(num, padding){
      return padString(this, num, padding, 'right');
    },


    /***
     * @method repeat([num] = 0)
     * @returns String
     * @description Returns the string repeated [num] times.
     * @example
     *
     *   'jumpy'.repeat(2) -> 'jumpyjumpy'
     *   'a'.repeat(5)     -> 'aaaaa'
     *
     ***/
    'repeat': function(num){
      num = num || 0;
      if(num < 0) return this;
      var str = '';
      for(var i=0; i<num; i++){
        str += this;
      }
      return str;
    },

    /***
     * @method each([search] =  /./g, [fn])
     * @returns Array
     * @description Runs callback [fn] against each occurence of [search]. [search] may be either a string or regex. If [search] isn't specified, it defaults to each character in the string. Return value is an array of matches.
     * @example
     *
     *   'jumpy'.each() -> ['j','u','m','p','y'];
     *   'jumpy'.each(/[r-z]/) -> ['u','y'];
     *   'jumpy'.each(/[r-z]/, function(str){
     *     // This function is called once with parameter str as "u" and "y", respectively.
     *   });
     *
     ***/
    'each': function(search, fn){
      if(Object.isFunction(search)){
        fn = search;
        search = /./g;
      } else if(!search){
        search = /./g
      } else if(Object.isString(search)){
        search = new RegExp(RegExp.escape(search), 'gi');
      } else if(Object.isRegExp(search)){
        search = addGlobalFlag(search);
      }
      var match = this.match(search) || [];
      if(fn){
        for(var i=0; i<match.length; i++){
          match[i] = fn.call(this, match[i], i) || match[i];
        }
      }
      return match;
    },


    /***
     * @method codes([fn])
     * @returns Array
     * @description Runs callback [fn] against each character in the string, passing in the character code for each character. Returns an array of character codes.
     * @example
     *
     *   'jumpy'.codes() -> [106,117,109,112,121];
     *   'jumpy'.codes(function(c){
     *     // Called once for each character in the string, with c as the character code.
     *   });
     *
     ***/
    'codes': function(fn){
      var codes = [];
      for(var i=0; i<this.length; i++){
        var code = this.charCodeAt(i);
        codes.push(code);
        if(fn) fn.call(this, code, i);
      }
      return codes;
    },

    /***
     * @method chars([fn])
     * @returns Array
     * @description Runs callback [fn] against each character in the string. Returns an array of characters.
     * @example
     *
     *   'jumpy'.chars() -> ['j','u','m','p','y'];
     *   'jumpy'.chars(function(c){
     *     // Called once for each character in the string, with c as the character.
     *   });
     *
     ***/
    'chars': function(fn){
      return this.trim().each(fn);
    },

    /***
     * @method words([fn])
     * @returns Array
     * @description Runs callback [fn] against each "word" in the string. Returns an array of "words". A "word" here is defined as any sequence of non-whitespace characters.
     * @example
     *
     *   'broken wear'.words() -> ['broken','wear'];
     *   'broken wear'.words(function(w){
     *     // Called once for each "word" in the string, with w as the word.
     *   });
     *
     ***/
    'words': function(fn){
      return this.trim().each(/\S+/g, fn);
    },

    /***
     * @method lines([fn])
     * @returns Array
     * @description Runs callback [fn] against each line in the string. Returns an array of lines.
     * @example
     *
     *   'broken wear\nand\njumpy jump'.lines() -> ['broken wear','and','jumpy jump'];
     *   'broken wear\nand\njumpy jump'.lines(function(l){
     *     // Called once for each line in the string, with l as the line.
     *   });
     *
     ***/
    'lines': function(fn){
      return this.trim().each(/^.*$/gm, fn);
    },

    /***
     * @method paragraphs([fn])
     * @returns Array
     * @description Runs callback [fn] against each paragraph in the string. Returns an array of paragraphs. A paragraph here is defined as a block of text bounded by two or more line breaks.
     * @example
     *
     *   'Once upon a time.\n\nIn the land of oz...'.paragraphs() -> ['Once upon a time.','In the land of oz...'];
     *   'Once upon a time.\n\nIn the land of oz...'.paragraphs(function(p){
     *     // Called once for each paragraph in the string, with p as the paragraph.
     *   });
     *
     ***/
    'paragraphs': function(fn){
      var paragraphs = this.trim().split(/[\r\n]{2,}/);
      paragraphs = paragraphs.map(function(p){
        if(fn) var s = fn.call(p);
        return s ? s : p;
      });
      return paragraphs;
    },

    /***
     * @method normalize()
     * @returns String
     * @description Returns the string with Latin-based diacritics removed.
     * @example
     *
     *   'á'.normalize()               -> 'a';
     *   'Ménage à trois'.normalize()  -> 'Menage a trois';
     *   'Volkswagen'.normalize() -> 'Volkswagen';
     *
     ***/
    'normalize': function(){
      var text = this.toString();
      for(var character in normalizeTable){
        if(!normalizeTable.hasOwnProperty(character)) continue;
        var reg = normalizeTable[character];
        text = text.replace(reg, character);
      }
      return text;
    },

    /***
     * @method accent(<mark>)
     * @returns String
     * @description Applies an intuitive mapping of punctuation marks to create accented Latin characters. Expected to be called on a single character string.
     * @example
     *
     *   'o'.accent('-') -> 'ō';
     *   'e'.accent(':') -> 'ë';
     *   'a'.accent('`') -> 'à';
     *
     ***/
    'accent': function(accent){
      accent = accent || '';
      var key = this.toString();
      if(accentTable[accent] && accentTable[accent][this]){
        return accentTable[accent][key];
      } else {
        return key;
      }
    },

    /***
     * @method startsWith(<find>, [caseSensitive] = true)
     * @returns Boolean
     * @description Returns true if the string starts with <find> which may be either a string or RegExp. Returns false otherwise.
     * @example
     *
     *   'hello'.startsWith('hell')        -> true;
     *   'hello'.startsWith(/[a-h]/)       -> true;
     *   'hello'.startsWith('HELL')        -> false;
     *   'hello'.startsWith('HELL', false) -> true;
     *
     ***/
    'startsWith': function(reg, caseSensitive){
      if(caseSensitive === undefined) caseSensitive = true;
      var source = Object.isRegExp(reg) ? reg.source.replace('^', '') : RegExp.escape(reg);
      return new RegExp('^' + source, caseSensitive ? '' : 'i').test(this);
    },

    /***
     * @method endsWith(<find>, [caseSensitive] = true)
     * @returns Boolean
     * @description Returns true if the string ends with <find> which may be either a string or RegExp. Returns false otherwise.
     * @example
     *
     *   'jumpy'.endsWith('py')         -> true;
     *   'jumpy'.endsWith(/[q-z]/)      -> true;
     *   'jumpy'.endsWith('MPY')        -> false;
     *   'jumpy'.endsWith('MPY', false) -> true;
     *
     ***/
    'endsWith': function(reg, caseSensitive){
      if(caseSensitive === undefined) caseSensitive = true;
      var source = Object.isRegExp(reg) ? reg.source.replace('$', '') : RegExp.escape(reg);
      return new RegExp(source + '$', caseSensitive ? '' : 'i').test(this);
    },

    /***
     * @method isBlank()
     * @returns Boolean
     * @description Returns true if the string has a length of 0 or contains only whitespace.
     * @defaults [caseSensitive] = true
     * @example
     *
     *   'jumpy'.isBlank('py')         -> true;
     *   'jumpy'.isBlank(/[q-z]/)      -> true;
     *   'jumpy'.isBlank('MPY')        -> false;
     *   'jumpy'.isBlank('MPY', false) -> true;
     *
     ***/
    'isBlank': function(){
      return this.trim().length === 0;
    },

    'has': function(find){
      return this.search(find) !== -1;
    },

    'insert': function(str, index){
      index = index || 0;
      if(index < 0) index = this.length + index + 1;
      if(index < 0 || index > this.length) return this;
      return this.substr(0, index) + str + this.substr(index);
    },

    'hankaku': function(mode){
      mode = variableWidthMode(mode);
      var text = '';
      for(var i=0; i<this.length; i++){
        var character = this.charAt(i);
        if(halfWidthTable[character] && mode[halfWidthTable[character]['type']]){
          text += halfWidthTable[character]['half'];
        } else {
          text += character;
        }
      }
      return text;
    },

    'zenkaku': function(mode){
      mode = variableWidthMode(mode);
      var text = '';
      for(var i=0; i<this.length; i++){
        var character = this.charAt(i);
        var nextCharacter = this.charAt(i+1);
        if(nextCharacter && fullWidthTable[character + nextCharacter]){
          text += fullWidthTable[character + nextCharacter]['full'];
          i++;
        } else if(fullWidthTable[character] && mode[fullWidthTable[character]['type']]){
          text += fullWidthTable[character]['full'];
        } else {
          text += character;
        }
      }
      return text;
    },

    'hiragana': function(convertWidth){
      var str = convertWidth === false ? this : this.zenkaku('k');
      var text = '';
      for(var i=0; i<str.length; i++){
        var character = str.charAt(i);
        if(hiraganaTable[character]){
          text += hiraganaTable[character]['hira'];
        } else {
          text += character;
        }
      }
      return text;
    },

    'katakana': function(){
      var text = '';
      for(var i=0; i<this.length; i++){
        var character = this.charAt(i);
        if(katakanaTable[character]){
          text += katakanaTable[character]['kata'];
        } else {
          text += character;
        }
      }
      return text;
    },

    /* toNumber will return any value with a '.' as a floating point value, otherwise as an integer
     * Also it will throw away leading '0's. This means it will not parse non-decimal numbers correctly. */
    'toNumber': function(base){
      var str = this.replace(/,/g, '');
      return str.match(/\./) ? parseFloat(str) : parseInt(str, base || 10);
    },

    'reverse': function(){
      return this.split('').reverse().join('');
    },

    'compact': function(){
      var str = this.replace(/[\r\n]/g, ''); // remove line breaks
      return str.trim().replace(/([\s　])+/g, '$1');
    },

    'at': function(){
      return getFromIndexes(this, arguments, true);
    },

    'first': function(num){
      num = num  === undefined ? 1 : num;
      return this.substr(0, num);
    },

    'last': function(num){
      num = num  === undefined ? 1 : num;
      var start = this.length - num < 0 ? 0 : this.length - num;
      return this.substr(start);
    },

    'from': function(num){
      num = num  === undefined ? 0 : num;
      if(num < 0) num = this.length + num;
      return this.substr(num);
    },

    'to': function(num){
      num = num  === undefined ? this.length : num;
      if(num < 0) num = this.length + num;
      return this.substr(0, num + 1);
    },

    'toDate': function(){
      return createDate([this.toString()]);
    },

    'dasherize': function(){
      return this.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
    },

    'underscore': function(){
      return this.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
    },

    'camelize': function(mode){
      var capitalizeFirst = mode === 'lower';
      var split = this.dasherize().split('-');
      var text = '';
      for(var i=0; i<split.length; i++){
        if(capitalizeFirst && i === 0) text += split[i].toLowerCase();
        else text += split[i].substr(0, 1).toUpperCase() + split[i].substr(1).toLowerCase();
      }
      return text;
    },

    'titleize': function(){
      return this.trim().words(function(s){ return s.capitalize(); }).join(' ');
    },

    'stripTags': function(){
      args = arguments.length > 0 ? arguments : [''];
      var str = this.toString();
      for(var i=0; i < args.length; i++){
        var tag = args[i];
        var reg = new RegExp('<\/?' + tag.escapeRegExp() + '[^<>]*>', 'gi');
        str = str.replace(reg, '');
      }
      return str;
    },

    'removeTags': function(){
      var str = this.toString();
      if(arguments.length == 0){
        str = str.replace(/<.+?\/>/g, '');
        str = str.replace(/<.+?>.*<\/.+?>/g, '');
      } else {
        for(var i=0; i < arguments.length; i++){
          var match = arguments[i].escapeRegExp();
          str = str.replace(new RegExp('<' + match + '[^<>]*?\/>', 'gi'), '');
          str = str.replace(new RegExp('<' + match + '[^<>]*>.*?<\/' + match + '>', 'gi'), '');
        }
      }
      return str;
    },

    'toObject': function(sep1, sep2){
      var result = {};
      this.split(sep1 || '&').each(function(el){
        var split   = el.split(sep2 || '=');
        var key     = split[0];
        var value   = split[1];
        var numeric = parseInt(split[1]);
        if(numeric){
          value = numeric;
        } else if(value === 'true'){
          value = true;
        } else if(value === 'false'){
          value = false;
        }
        result[key] = value;
      });
      return result;
    }

  });


  extendWithNativeCondition(String, true, function(s){ return !Object.isRegExp(s); }, {

    /*
     * Many thanks to Steve Levithan here for a ton of inspiration and work dealing with
     * cross browser Regex splitting.  http://blog.stevenlevithan.com/archives/cross-browser-split
     */

    'split': function(separator, limit){
      var output = [];
      var lastLastIndex = 0;
      var flags = (separator.ignoreCase ? "i" : "") + (separator.multiline  ? "m" : "") + (separator.sticky     ? "y" : "");
      var separator = addGlobalFlag(separator); // make `global` and avoid `lastIndex` issues by working with a copy
      var separator2, match, lastIndex, lastLength;
      if(!RegExp.NPCGSupport){
        separator2 = RegExp("^" + separator.source + "$(?!\\s)", flags); // doesn't need /g or /y, but they don't hurt
      }
      if(limit === undefined || +limit < 0){
        limit = Infinity;
      } else {
        limit = Math.floor(+limit);
        if(!limit) return [];
      }

      while (match = separator.exec(this)){
        lastIndex = match.index + match[0].length; // `separator.lastIndex` is not reliable cross-browser
        if(lastIndex > lastLastIndex){
          output.push(this.slice(lastLastIndex, match.index));
          // fix browsers whose `exec` methods don't consistently return `undefined` for nonparticipating capturing groups
          if(!RegExp.NPCGSupport && match.length > 1){
            match[0].replace(separator2, function (){
              for (var i = 1; i < arguments.length - 2; i++){
                if(arguments[i] === undefined){
                  match[i] = undefined;
                }
              }
            });
          }
          if(match.length > 1 && match.index < this.length){
            Array.prototype.push.apply(output, match.slice(1));
          }
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if(output.length >= limit){
            break;
          }
        }
        if(separator.lastIndex === match.index){
          separator.lastIndex++; // avoid an infinite loop
        }
      }
      if(lastLastIndex === this.length){
        if(lastLength || !separator.test("")) output.push("");
      } else {
        output.push(this.slice(lastLastIndex));
      }
      return output.length > limit ? output.slice(0, limit) : output;
    }
  });






  /***
   * Array module
   *
   ***/



  extendWithNativeCondition(Array, true, true, {

    'forEach': function(fn, scope){
      for(var i=0,len=this.length; i < len; i++){
        fn.call(scope, this[i], i, this);
      }
    },

    'reduce': function(fn, init){
      var result = init === undefined ? this[0] : init;
      for(var i= init ? 0 : 1,len=this.length; i < len; i++){
        result = fn.call(null, result, this[i], i, this);
      }
      return result;
    },

    'reduceRight': function(fn, init){
      var result = init === undefined ? this[this.length - 1] : init;
      for(var i = init ? this.length - 1 : this.length - 2; i >= 0; i--){
        result = fn.call(null, result, this[i], i, this);
      }
      return result;
    }

  });


  extendWithNativeCondition(Array, true, function(a){ return !Object.isObject(a) && !Object.isFunction(a); }, {

    'indexOf': function(f, offset){
      if(offset < 0) offset = this.length + offset;
      else if(offset === undefined) offset = 0;
      if(offset >= this.length) return -1;
      for(var i=offset,len=this.length; i < len; i++){
        if(multiMatch(this[i], f, this, [i, this])) return i;
      }
      return -1;
    },

    'lastIndexOf': function(f, offset){
      if(offset < 0) offset = this.length + offset;
      else if(offset === undefined || offset > this.length) offset = this.length - 1;
      for(var i=offset; i >= 0; i--){
        if(multiMatch(this[i], f, this, [i, this])) return i;
      }
      return -1;
    }

  });


  extendWithNativeCondition(Array, true, function(){ return Object.isFunction(arguments[0]); }, {

    'every': function(f, scope){
      for(var i=0,len=this.length; i < len; i++){
        var match = multiMatch(this[i], f, scope, [i, this]);
        if(!match){
          return false;
        }
      }
      return true;
    },

    'some': function(f, scope){
      for(var i=0,len=this.length; i < len; i++){
        var match = multiMatch(this[i], f, scope, [i, this]);
        if(match){
          return true;
        }
      }
      return false;
    },

    'filter': function(f, scope){
      var result = [];
      for(var i=0,len=this.length; i < len; i++){
        var match = multiMatch(this[i], f, scope, [i, this]);
        if(match){
          result.push(this[i]);
        }
      }
      return result;
    },

    'map': function(f, scope){
      var result = [];
      for(var i=0,len=this.length; i < len; i++){
        result.push(transformArgument(this[i], f, scope, [i, this]));
      }
      return result;
    }


  });


  extend(Array, true, {


    'find': function(f){
      var result = this.findAllFromIndex(0, f, 1);
      return result.length > 0 ? result[0] : undefined;
    },

    'findAll': function(f, stop){
      return this.findAllFromIndex(0, f, stop);
    },

    'findFromIndex': function(index, f){
      var result = this.findAllFromIndex(index, f, 1);
      return result.length > 0 ? result[0] : undefined;
    },

    'findAllFromIndex': function(index, f, loop){
      var result = [], arr = this;
      this.eachFromIndex(index, function(el, i){
        if(multiMatch(el, f, arr, [i,arr])){
          result.push(el);
        }
      }, loop);
      return result;
    },

    'eachFromIndex': function(index, fn, loop){
      if(index < 0 || index >= this.length) return;
      var length = loop ? this.length : this.length - index;
      for(var cur, i = 0; i < length; i++){
        cur = (index + i) % this.length;
        fn.call(this, this[cur], cur);
      }
    },

    'count': function(f){
      return this.findAllFromIndex(0, f).length;
    },

    'none': function(f){
      return !this.any(f);
    },

    'remove': function(f){
      var arr = this, result = [];
      this.each(function(el, i){
        if(!multiMatch(el, f, arr, [i, arr])){
          result.push(el);
        }
      });
      return result;
    },

    'removeIndex': function(start, end){
      if(start === undefined) return this;
      if(end === undefined) end = start;
      return this.findAllFromIndex(0, function(el, i){
        return i < start || i > end;
      });
    },

    'unique': function(){
      var result = [];
      this.each(function(el){
        if(result.indexOf(el) === -1) result.push(el);
      });
      return result;
    },

    'union': function(arr){
      return this.concat(arr).unique();
    },

    'intersect': function(arr){
      var result = [];
      if(!Object.isArray(arr)) arr = [arr];
      this.each(function(el){
        if(arr.indexOf(el) !== -1){
          result.push(el);
        }
      });
      return result.unique();
    },

    'subtract': function(arr){
      var result = [];
      if(!Object.isArray(arr)) arr = [arr];
      this.each(function(el){
        if(arr.indexOf(el) === -1){
          result.push(el);
        }
      });
      return result;
    },

    'at': function(){
      return getFromIndexes(this, arguments, false);
    },

    'first': function(num){
      if(num === undefined) return this[0];
      if(num < 0) num = 0;
      return this.slice(0, num);
    },

    'last': function(num){
      if(num === undefined) return this[this.length - 1];
      var start = this.length - num < 0 ? 0 : this.length - num;
      return this.slice(start);
    },

    'from': function(num){
      num = num  === undefined ? 0 : num;
      return this.slice(num);
    },

    'to': function(num){
      num = num  === undefined ? this.length - 1 : num;
      if(num < 0) num = this.length + num;
      return this.slice(0, num + 1);
    },

    'min': function(f){
      return getMinOrMax(this, 'min', f).unique();
    },

    'max': function(f){
      return getMinOrMax(this, 'max', f).unique();
    },

    'least': function(f){
      var result = getMinOrMax(this.groupBy(f), 'min', 'length').flatten();
      return result.length === this.length ? [] : result.unique();
    },

    'most': function(f){
      var result = getMinOrMax(this.groupBy(f), 'max', 'length').flatten();
      return result.length === this.length ? [] : result.unique();
    },

    'sum': function(f){
      var arr = f ? this.map(f) : this;
      return arr.length > 0 ? arr.reduce(function(a,b){ return a + b; }) : 0;
    },

    'average': function(f){
      var arr = f ? this.map(f) : this;
      return arr.length > 0 ? arr.sum() / arr.length : 0;
    },

    'groupBy': function(property){
      var result = {};
      this.each(function(el){
        var key = transformArgument(el, property);
        if(!result[key]) result[key] = [];
        result[key].push(el);
      });
      return result;
    },

    'inGroups': function(num, padding){
      var pad = arguments.length > 1;
      var arr = this;
      var result = [];
      var divisor = Math.ceil(this.length / num);
      (0).upto(num - 1, function(i){
        var index = i * divisor;
        var group = arr.slice(index, index + divisor);
        if(pad && group.length < divisor){
          (divisor - group.length).times(function(){
            group = group.add(padding);
          });
        }
        result.push(group);
      });
      return result;
    },

    'inGroupsOf': function(num, padding){
      if(this.length === 0 || num === 0) return this;
      if(num === undefined) num = 1;
      if(padding === undefined) padding = null;
      var result = [];
      var group = null;
      var len = this.length;
      this.each(function(el, i){
        if((i % num) === 0){
          if(group) result.push(group);
          group = [];
        }
        if(el === undefined) el = padding;
        group.push(el);
      });
      if(!this.length.multipleOf(num)){
        (num - (this.length % num)).times(function(){
          group.push(padding);
        });
        this.length = this.length + (num - (this.length % num));
      }
      if(group.length > 0) result.push(group);
      return result;
    },

    'split': function(split){
      var arr = this;
      var result = [];
      var lastIndex = 0;
      this.each(function(el, i){
          var performSplit = Object.isFunction(split) ? split(el) : el === split;
          if(performSplit){
            var slice = arr.slice(lastIndex, i);
            if(slice.length > 0) result.push(slice);
            lastIndex = i + 1;
          }
      });
      if(lastIndex < this.length) result.push(this.slice(lastIndex, this.length));
      return result;
    },

    'compact': function(){
      var result = [];
      this.each(function(el, i){
        if(Object.isArray(el)){
          result.push(el.compact());
        } else if(el !== undefined && el !== null && !isNaN(el)){
          result.push(el);
        }
      });
      return result;
    },

    'isEmpty': function(){
      return this.compact().length == 0;
    },

    'flatten': function(){
      var result = [];
      this.each(function(el){
        if(Object.isArray(el)){
          result = result.concat(el.flatten());
        } else {
          result.push(el);
        }
      });
      return result;
    },

    'sortBy': function(property, desc){
      var arr = this;
      arr.sort(function(a, b){
        var aProperty = transformArgument(a, property);
        var bProperty = transformArgument(b, property);
        var numeric = typeof aProperty == 'number';
        if(numeric && desc) return bProperty - aProperty;
        else if(numeric && !desc) return aProperty - bProperty;
        else if(aProperty === bProperty) return 0;
        else if(desc) return aProperty < bProperty ?  1 : -1;
        else return aProperty < bProperty ? -1 :  1;
      });
      return arr;
    },

    'addAtIndex': function(index, add){
      if(index < 0) index = this.length + index + 1;
      if(!Object.isNumber(index) || isNaN(index) || index < 0 || index > this.length) index = this.length;
      return this.slice(0, index).concat(add).concat(this.slice(index));
    },

    /* Fisher-Yates based randomization */
    'randomize': function(){
      var a = this.concat();
      for(var j, x, i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x){};
      return a;
    }

  });


  // Aliases
  extend(Array, true, {
      'collect': Array.prototype.map,
      'shuffle': Array.prototype.randomize,
      'each': Array.prototype.forEach,
      'all': Array.prototype.every,
      'any': Array.prototype.some,
      'has': Array.prototype.some,
      'add': Array.prototype.concat
  });


  /***
   * Date module
   *
   ***/

  var abbreviatedMonths;
  var abbreviatedWeekdays;
  var months      = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  var weekdays    = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  var textNumbers = ['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
  var timeArray   = ['hour','minute','second','millisecond','meridian','utc','offset_sign','offset_hours','offset_minutes']
  var optionalTime  = '(?:(?:\\s+|t)(\\d{1,2}):?(\\d{2})?:?(\\d{2})?(\\.\\d{1,6})?(am|pm)?(?:(Z)|(?:([+-])(\\d{2})(?::?(\\d{2}))?)?)?)?$';

  var dateInputFormats = [
    // @date_format 2010
    { reg: '(\\d{4})', to: ['year'] },
    // @date_format 2010-05
    // @date_format 2010.05
    { reg: '(\\d{4})[-/.](\\d{1,2})', to: ['year','month'] },
    // @date_format 2010-05-25 (ISO8601)
    // @date_format 2010-05-25T12:30:40.299Z (ISO8601)
    // @date_format 2010-05-25T12:30:40.299+01:00 (ISO8601)
    // @date_format 2010.05.25
    // @date_format 2010/05/25
    { reg: '([+-])?(\\d{4})[-/.]?(\\d{1,2})[-/.]?(\\d{1,2})', to: ['year_sign','year','month','day'] },
    // @date_format 10-05-25 (ISO8601)
    { reg: '(\\d{2})-?(\\d{2})-?(\\d{2})', to: ['year','month','day'] },
    // @date_format 05-25
    // @date_format 05/25
    // @date_format 05.25
    { reg: '(\\d{1,2})[\\-/.](\\d{1,2})', to: ['month','day'], variant: true },
    // @date_format 05-25-2010
    // @date_format 05/25/2010
    // @date_format 05.25.2010
    { reg: '(\\d{1,2})[\\-/.](\\d{1,2})[\\-/.](\\d{2,4})', to: ['month','day','year'], variant: true },
    // @date_format May 2010
    { reg: '({MONTHS})[\\s\\-.](\\d{4})', to: ['month','year'] },
    // @date_format Tuesday May 25th, 2010
    { reg: '(?:{WEEKDAYS})?\\s*({MONTHS})[\\s\\-.]?(?:(\\d{1,2})(?:st|nd|rd|th)?)?,?[\\s\\-.]?(\\d{2,4})?', to: ['month','day','year'] },
    // @date_format 25 May 2010
    { reg: '(\\d{1,2}) ({MONTHS}),? (\\d{4})', to: ['day','month','year'] },
    // @date_format the day after tomorrow
    // @date_format one day before yesterday
    // @date_format 2 days after monday
    // @date_format 2 weeks/months/years from monday
    { reg: '(?:(the|a|{NUMBER}|\\d+) (day|week|month|year)s? (before|after|from)\\s+)?(today|tomorrow|yesterday|{WEEKDAYS})', to: ['modifier_amount','modifier_unit','modifier_sign','fuzzy_day'] },
    // @date_format a second ago
    // @date_format two days from now
    // @date_format 25 minutes/hours/days/weeks/months/years from now
    { reg: '(a|{NUMBER}|\\d+) (millisecond|second|minute|hour|day|week|month|year)s? (from now|ago)', to: ['modifier_amount','modifier_unit','modifier_sign'], relative: true },
    // @date_format last wednesday
    // @date_format next friday
    // @date_format this week tuesday
    { reg: '(this|next|last)?\\s*(?:week\\s*)?({WEEKDAYS})', to: ['modifier_sign','fuzzy_day'] },
    // @date_format monday of this/next/last week
    { reg: '({WEEKDAYS}) (?:of\\s*)?(this|next|last) week', to: ['fuzzy_day','modifier_sign'] },
    // @date_format May 25th of this/next/last year
    { reg: '({MONTHS})(?: (\\d{1,2})(?:st|nd|rd|th)?)? of (this|next|last) (year)', to: ['month','day','modifier_sign','modifier_unit'] },
    // @date_format the first day of the month
    // @date_format the last day of March
    // @date_format the 23rd of last month
    { reg: '(?:the\\s)?(first day|last day)?(\\d{1,2}(?:st|nd|rd|th))? of (?:(the|this|next|last) (month)|({MONTHS}))', to: ['modifier_edge', 'day','modifier_sign','modifier_unit','month'] },
    // @date_format the beginning of this week/month/year
    // @date_format the end of next month
    { reg: '(?:the\\s)?(beginning|end|first day|last day) of (?:(the|this|next|last) (week|month|year)|(\\d{4})|({MONTHS}))', to: ['modifier_edge','modifier_sign','modifier_unit','year','month'] },
    // @date_format this week
    // @date_format last month
    // @date_format next year
    { reg: '(this|next|last) (week|month|year)', to: ['modifier_sign','modifier_unit'], relative: true },
    // @date_format noon
    // @date_format midnight tonight
    { reg: '(midnight|noon)(?: (tonight|today|tomorrow|yesterday|{WEEKDAYS}))?', to: ['hour','fuzzy_day'], timeIncluded: true },
    // @date_format 12pm
    // @date_format 12:30pm
    // @date_format 12:30:40
    // @date_format 12:30:40.299
    // @date_format 12:30:40.299+01:00
    { reg: '^(?:(\\d{1,2}):?(\\d{2})?:?(\\d{2})?(\\.\\d{1,6})?(am|pm)?(?:(Z)|(?:([+-])(\\d{2})(?::?(\\d{2}))?)?)?)$', to: timeArray, today: true, timeIncluded: true }
  ];

  var dateOutputFormats = [
    {
      token: 'millisec(?:onds?)?|ms(?:ms)?',
      pad: 3,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'Milliseconds');
      }
    },
    {
      token: 's(?:s|ec(?:onds?)?)?',
      pad: 2,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'Seconds');
      }
    },
    {
      token: 'm(?:m|in(?:utes?)?)?',
      pad: 2,
      caps: true,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'Minutes');
      }
    },
    {
      token: 'h(?:h|(?:ours?))?|24hr',
      pad: 2,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'Hours');
      }
    },
    {
      token: '12hr',
      pad: 2,
      format: function(d, utc){
        return getShortHour(d, utc);
      }
    },
    {
      token: 'd(?:d|(?:ays?))?',
      pad: 2,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'Date');
      }
    },
    {
      token: 'dow|weekday(?: short)?',
      weekdays: true,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'Day');
      }
    },
    {
      token: 'MM?',
      pad: 2,
      caps: true,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'Month') + 1;
      }
    },
    {
      token: 'mon(th)?(?: short)?',
      months: true,
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'Month');
      }
    },
    {
      token: 'yy',
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'FullYear').toString().from(2);
      }
    },
    {
      token: 'yyyy|year',
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'FullYear');
      }
    },
    {
      token: 't{1,2}',
      meridian: true,
      format: function(d, utc){
        return getMeridian(d, utc);
      }
    },
    {
      token: 'tz|timezone',
      format: function(d, utc){
        return d.getUTCOffset();
      }
    },
    {
      token: 'iso(tz|timezone)',
      format: function(d, utc){
        return d.getUTCOffset(true);
      }
    },
    {
      token: 'ord',
      format: function(d, utc){
        return callDateMethod(d, 'get', utc, 'Date').ordinalize();
      }
    }
  ];

  var dateUnits = [
    {
      unit: 'year',
      method: 'FullYear',
      multiplier: function(d){
        var adjust = d ? (d.leapYear() ? 1 : 0) : 0.25;
        return (365 + adjust) * 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'month',
      method: 'Month',
      multiplier: function(d){
        var days = d ? d.daysInMonth() : 30.4375;
        return days * 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'week',
      method: 'Week',
      multiplier: function(d){
        return 7 * 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'day',
      method: 'Date',
      multiplier: function(d){
        return 24 * 60 * 60 * 1000;
      }
    },
    {
      unit: 'hour',
      method: 'Hours',
      multiplier: function(d){
        return 60 * 60 * 1000;
      }
    },
    {
      unit: 'minute',
      method: 'Minutes',
      multiplier: function(d){
        return 60 * 1000;
      }
    },
    {
      unit: 'second',
      method: 'Seconds',
      multiplier: function(d){
        return 1000;
      }
    },
    {
      unit: 'millisecond',
      method: 'Milliseconds',
      multiplier: function(d){
        return 1;
      }
    }
  ];


  var getFormatMatch = function(match, arr){
    var obj = {};
    arr.each(function(key, i){
      var value = match[i + 1];
      if(typeof value === 'string') value = value.toLowerCase();
      obj[key] = value;
    });
    return obj;
  }

  var getExtendedDate = function(f, variant){
    var match, format = {}, set = {};
    var utc = false;
    var d = new Date();

    if(Object.isObject(f)){
      set = f;
      d = new Date().set(f, true);
    } else if(Object.isNumber(f)){
      d = new Date(f);
    } else if(Object.isDate(f)){
      d = f;
    } else if(Object.isString(f)){
      f = f.trim().replace(/\.+$/,'').replace(/^now$/, '');
      dateInputFormats.each(function(df){
        if(match) return;
        match = NPCGMatch(f, df.reg);
        if(match){
          format = df;
          var m = getFormatMatch(match, format.to);

          if(variant && format.variant){
            // If there's a European variant, swap the month and day.
            var tmp = m.month;
            m.month = m.day;
            m.day = tmp;
          }

          if(m.year){
            if(!m.modifier_unit){
              m.modifier_unit = 'year';
            }
            if(m.year.length === 2){
              m.year = getYearFromAbbreviation(m.year.toNumber());
            }
          }
          if(m.month){
            var num = m.month.toNumber();
            if(isNaN(num)){
              // If the month is not a number, find it in the array of text months.
              m.month = abbreviatedMonths.indexOf(m.month.to(2));
            } else {
              // Otherwise decrement by 1.
              m.month = num - 1;
            }
          }
          if(m.hour === 'noon' || m.hour === 'midnight'){
            m.hour = m.hour === 'noon' ? 12 : 24;
            if(!set.day && !m.fuzzy_day) m.fuzzy_day = 'today';
          }
          if(m.fuzzy_day){
            // Fuzzy day can be today, tomorrow, yesterday, or a day of the week.
            // This resolves to an offset of the current date.
            var dayOffset = 0;
            var fuzzy = m.fuzzy_day;
            var weekday;
            if(fuzzy === 'yesterday'){
              dayOffset = -1;
            } else if(fuzzy === 'tomorrow'){
              dayOffset = 1;
            } else if((weekday = abbreviatedWeekdays.indexOf(fuzzy.to(2))) !== -1){
              d.setWeekday(weekday);
              dayOffset = 0;
              if(m.modifier_sign && !m.modifier_unit && !m.modifier_amount){
                m.modifier_unit = 'week';
              }
            }
            set.year  = d.getFullYear();
            set.month = d.getMonth();
            set.day  = d.getDate() + dayOffset;
          }
          if(m.millisecond){
            // Round the milliseconds out to 4 digits
            m.millisecond = (parseFloat(m.millisecond, 10) * 1000).round();
          }

          // Now turn this into actual numbers
          dateUnits.each(function(u){
            var unit = u.unit;
            if(m[unit] !== undefined){
              set[unit] = m[unit].toNumber();
            }
          });

          if(m.meridian){
            // If the time is after 1pm-11pm advance the time by 12 hours.
            if(m.meridian === 'pm' && m.hour < 12) set.hour  += 12;
          }
          if(m.utc || m.offset_hours || m.offset_minutes){
            utc = true;
            // Adjust for timezone offset
            var offset = 0;
            if(m.offset_hours){
              offset += m.offset_hours.toNumber() * 60;
            }
            if(m.offset_minutes){
              offset += m.offset_minutes.toNumber();
            }
            if(m.offset_sign && m.offset_sign === '-'){
              offset *= -1;
            }
            set.minute -= offset;
          }
          if(m.modifier_unit && m.modifier_sign){
            var amt  = m.modifier_amount || 1;
            var unit = m.modifier_unit;
            var textNumIndex;
            if(amt === 'the' || amt === 'a'){
              amt = 1;
            } else if((textNumIndex = textNumbers.indexOf(amt)) !== -1){
              amt = textNumIndex;
            } else {
              amt = amt.toNumber();
            }
            if(m.modifier_sign === 'before' || m.modifier_sign === 'ago' || m.modifier_sign === 'last'){
              amt *= -1;
            } else if(m.modifier_sign === 'this' || m.modifier_sign === 'the'){
              amt = 0;
            }
            if(unit === 'year' && !format.relative){
              set.year = d.getFullYear();
            } else if(unit === 'month' && !format.relative){
              set.month = d.getMonth();
            } else if(unit === 'week' && !format.relative){
              set.day = d.getDate();
              unit = 'day';
              amt *= 7;
            }
            if(set[unit] === undefined){
              set[unit] = 0;
            }
            set[unit] += amt;
          }
          if(m.modifier_edge){
            var edge = m.modifier_edge;
            if(edge === 'beginning' || edge === 'first' || edge === 'first day'){
              if(m.modifier_unit === 'week'){
                set.month = d.getMonth();
                set.weekday = 0;
              } else if(m.modifier_unit === 'month' || m.month){
                set.day = 1;
              }
              if(!edge.match(/day/)){
                set.hour        = 0;
                set.minute      = 0;
                set.second      = 0;
                set.millisecond = 0;
              }
            } else if(edge === 'end' || edge === 'last' || edge === 'last day'){
              if(m.modifier_unit === 'week'){
                set.month = d.getMonth();
                set.weekday = 6;
              } else if(m.modifier_unit === 'month' || m.month){
                set.day = 32 - new Date(d.getFullYear(), set.month, 32).getDate();
              } else if(m.modifier_unit === 'year'){
                set.month = 11;
                set.day  = 31;
              }
              if(!edge.match(/day/)){
                set.hour        = 23;
                set.minute      = 59;
                set.second      = 59;
                set.millisecond = 999;
              }
            }

          }
          if(m.year_sign && m.year_sign === '-'){
            set.year *= -1;
          }
          if(format.today){
            set.year  = d.getFullYear();
            set.month = d.getMonth();
            set.day  = d.getDate();
          }
        }
      });
      if(!match){
        // The Date constructor does something tricky like checking the number
        // of arguments so simply passing in undefined won't work.
        d = f ? new Date(f) : new Date();
      } else if(format.relative){
        d.advance(set);
      } else if(utc){
        d.setUTC(set, true);
      } else {
        d.set(set, true);
      }
    }
    return {
      date: d,
      set: set,
      format: format
    }
  }

  var compareDate = function(d, find, buffer, dir, edges){
    var unit, accuracy;
    var p = getExtendedDate(find);
    buffer = buffer > 0 ? buffer : 0;
    if(!p.date.isValid()) return false;
    dateUnits.each(function(u){
      if(p.set[u.unit] !== undefined || p.set[u.unit + 's'] !== undefined){
        unit = u.unit;
        accuracy = u.multiplier(p.date) - 1;
      }
    });
    if(p.format.relative){
      var beginning = p.date['beginningOf'+unit.capitalize()];
      if(beginning){
        beginning.call(p.date);
      } else {
        buffer = buffer || Math.round(accuracy / 2);
        accuracy = 0;
      }
    }
    accuracy = accuracy || 0;
    var t   = d.getTime();
    var min = p.date.getTime();
    var max = min + accuracy;
    if(dir === 'after'){
      return edges ? (t - buffer > min) : (t > max + buffer);
    } else if(dir === 'before'){
      return edges ? (t < max + buffer) : (t - buffer < min);
    } else {
      return t >= (min - buffer) && t < (max + buffer + 1);
    }
  }

  var updateDate = function(date, params, reset, utc, advance){
    utc = utc === true ? 'UTC' : '';
    if(params.date) params.day = params.date;
    // If the date is 1/31, setMonth(1) will set the month to March, not February.
    // This is definitely not what we want for rest dates (i.e. non-relative), so
    // pre-emptively set the date here. Also, setting to the middle of the month
    // so that timezone offset's can't traverse dates, which is also not what we want.
    if(reset){
      date.setDate(15);
    }
    dateUnits.each(function(u){
      var unit   = u.unit;
      var method = u.method;
      var value = getDateValue(params, unit, reset);
      if(value === undefined) return;
      if(advance){
        if(unit === 'week'){
          value  = (params.day || 0) + (value * 7);
          method = 'Date';
        }
        value = (value * advance) + callDateMethod(date, 'get', '', method);
      }
      callDateMethod(date, 'set', utc, method, value);
    });
    if(!advance){
      var weekday = getDateValue(params, 'weekday', reset);
      if(weekday !== undefined){
        callDateMethod(date, 'set', utc, 'Weekday', weekday)
      }
    }
    return date;
  }

  var getDateValue = function(params, unit, reset){
    var value = params[unit];
    if(value === undefined) value = params[unit + 's'];
    if(value === undefined && reset){
      switch(unit){
        case 'day': value = 1;  break;
        case 'year': case 'week': case 'weekday': break; // assign no value
        default: value = 0;
      }
    }
    return value;
  }

  var callDateMethod = function(d, g, utc, method, value){
    return d[g + utc + method].call(d, value);
  }

  // If the year is two digits, add the most appropriate century prefix.
  // Duplicating the .round() function here because we don't want the
  // Date class to break if it is overwritten.
  var getYearFromAbbreviation = function(year){
    return Math.round(new Date().getFullYear() / 100) * 100 - Math.round(year / 100) * 100 + year;
  }


  var getMonth = function(s){
    if(/\w+\s+\w+/.test(s)) return null;
    var index = abbreviatedMonths.indexOf(s.toLowerCase().to(2));
    return index === -1 ? null : index;
  }

  var getWeekday = function(s){
    if(/\w+\s+\w+/.test(s)) return null;
    var index = abbreviatedWeekdays.indexOf(s.toLowerCase().to(2));
    return index === -1 ? null : index;
  }

  var getShortHour = function(d, utc){
    var hours = callDateMethod(d, 'get', utc, 'Hours');
    return hours === 0 ? 12 : hours - (Math.floor(hours / 13) * 12);
  }

  var getMeridian = function(d, utc){
    var hours = callDateMethod(d, 'get', utc, 'Hours');
    return hours < 12 ? 'am' : 'pm';
  }

  var getOffsetDate = function(num, args, unit, method){
    var d = createDate(args);
    var set = {};
    set[unit] = num;
    return d[method].call(d, set);
  }

  var createDate = function(args){
    var f = args[0], variant = args[1];
    if(args.length >= 2 && Object.isNumber(variant)){
      // If there are 2 or more paramters and the second parameter is a number,
      // we have an enumerated constructor type as in "new Date(2003, 2, 12);"
      f = collectArguments(args,'year','month','day','hour','minute','second','millisecond')[0];
      variant = false;
    }
    return getExtendedDate(f, variant).date;
  }


  var buildNumberAlias = function(unit, multiplier){
    var base   = function(){  return this * multiplier; }
    var before = function(){ return getOffsetDate(this, arguments, unit, 'rewind'); }
    var after  = function(){ return getOffsetDate(this, arguments, unit, 'advance'); }
    Number.prototype[unit] = base;
    Number.prototype[unit + 's']        = base;
    Number.prototype[unit + 'Ago']      = before;
    Number.prototype[unit + 'sAgo']     = before;
    Number.prototype[unit + 'Before']   = before;
    Number.prototype[unit + 'sBefore']  = before;
    Number.prototype[unit + 'After']    = after;
    Number.prototype[unit + 'sAfter']   = after;
    Number.prototype[unit + 'FromNow']  = after;
    Number.prototype[unit + 'sFromNow'] = after;
  }


  var buildDateMethods = function(){
    dateUnits.each(function(u, i){
      var unit = u.unit;
      var caps = unit.capitalize();
      var multiplier = u.multiplier();
      Date.prototype[unit+'sSince'] = function(f, variant){
        return ((this.getTime() - Date.create(f, variant).getTime()) / multiplier).round();
      }
      Date.prototype[unit+'sUntil'] = function(f, variant){
        return ((Date.create(f, variant).getTime() - this.getTime()) / multiplier).round();
      }
      Date.prototype['add'+caps+'s'] = function(num){
        var set = {};
        set[unit] = num;
        return this.advance(set);
      }
      buildNumberAlias(unit, multiplier);
      if(i < 3){
        Date.prototype['isLast'+caps] = function(){
          return this.is('last ' + unit);
        }
        Date.prototype['isThis'+caps] = function(){
          return this.is('this ' + unit);
        }
        Date.prototype['isNext'+caps] = function(){
          return this.is('next ' + unit);
        }
      }
      if(i < 4){
        Date.prototype['beginningOf'+caps] = function(reset){
          if(reset === undefined) reset = true;
          var set = { month: 0, day: 1 };
          switch(unit){
            case 'week':  set.weekday = 0;
            case 'day':   set.day = this.getDate();
            case 'month': set.month = this.getMonth();
          }
          return this.set(set, reset);
        }
        Date.prototype['endOf'+caps] = function(reset){
          if(reset === undefined) reset = true;
          var set = reset ? { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 } : {};
          set.day   = this.getDate();
          set.month = this.getMonth();
          switch(unit){
            case 'year':  set.month = 11; set.day = 31; break;
            case 'month': set.day = this.daysInMonth(); break;
            case 'week':  set.weekday = 6; break;
          }
          return this.set(set, reset);
        }
      }
    });
  }

  var buildFormatRegExp = function(){

    abbreviatedMonths   = months.map(function(m){ return m.to(2); });
    abbreviatedWeekdays = weekdays.map(function(m){ return m.to(2); });

    var monthReg   = months.map(function(m){ return m.to(2)+'(?:\\.|'+m.from(3)+')?'; }).join('|');
    var weekdayReg = weekdays.map(function(m){ return m.to(2)+'(?:\\.|'+m.from(3)+')?'; }).join('|');
    var numberReg  = textNumbers.join('|');

    dateInputFormats.each(function(m){
      var src = '^' + m.reg;
      src = src.replace(/{WEEKDAYS}/, weekdayReg);
      src = src.replace(/{MONTHS}/, monthReg);
      src = src.replace(/{NUMBER}/, numberReg);
      if(!m.timeIncluded){
        src = src + optionalTime;
        m.to = m.to.concat(['hour','minute','second','millisecond','meridian','utc','offset_sign','offset_hours','offset_minutes']);
      }
      m.reg = new RegExp(src, 'i');
    });
  }

  var buildRelativeAliases = function(){
    ['today','yesterday','tomorrow','weekday','weekend','future','past'].concat(weekdays).concat(months).each(function(s){
      Date.prototype['is'+s.capitalize()] = function(){
        return this.is(s);
      }
    });
  }

  var buildDate = function(){
    buildDateMethods();
    buildFormatRegExp();
    buildRelativeAliases();
  }


  extend(Date, false, {
    'make': function(){
      return createDate(arguments);
    },
    'DSTOffset': (new Date(2000, 6, 1).getTimezoneOffset() - new Date(2000, 0, 1).getTimezoneOffset()) * 60 * 1000,
    'AMERICAN_DATE': '{M}/{d}/{yyyy}',
    'AMERICAN_DATETIME': '{M}/{d}/{yyyy} {h}:{mm}{tt}',
    'EUROPEAN_DATE': '{d}/{M}/{yyyy}',
    'INTERNATIONAL_TIME': '{h}:{mm}:{ss}',
    'RFC1123': '{Dow}, {dd} {Mon} {yyyy} {hh}:{mm}:{ss} GMT{tz}',
    'RFC1036': '{Weekday}, {dd}-{Mon}-{yy} {hh}:{mm}:{ss} GMT{tz}',
    'ISO8601_DATE': '{yyyy}-{MM}-{dd}',
    'ISO8601_DATETIME': '{yyyy}-{MM}-{dd}T{hh}:{mm}:{ss}.{ms}Z'
  });

  extend(Date, true, {

    'set': function(){
      var args = collectArguments(arguments,'year','month','day','hour','minute','second','millisecond');
      return updateDate(this, args[0], args[1])
    },

    'setUTC': function(){
      var args = collectArguments(arguments,'year','month','day','hour','minute','second','millisecond');
      return updateDate(this, args[0], args[1], true)
    },

    'setWeekday': function(dow){
      if(dow === undefined) return;
      this.setDate(this.getDate() + dow - this.getDay());
    },

    'setUTCWeekday': function(dow){
      if(dow === undefined) return;
      this.setDate(this.getUTCDate() + dow - this.getDay());
    },

    'setWeek': function(week){
      if(week === undefined) return;
      var date = this.getDate();
      this.setMonth(0);
      this.setDate((week * 7) + 1);
    },

    'setUTCWeek': function(week){
      if(week === undefined) return;
      var date = this.getUTCDate();
      this.setMonth(0);
      this.setUTCDate((week * 7) + 1);
    },

    'getWeek': function(){
      var d = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((this.getTime() - d.getTime() + 1) / (7 * 24 * 60 * 60 * 1000));
    },

    'getUTCWeek': function(){
      var d = new Date().setUTC(this.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      return Math.ceil((this.getTime() - d.getTime() + 1) / (7 * 24 * 60 * 60 * 1000));
    },

    'getUTCOffset': function(iso){
      var offset = this.getTimezoneOffset();
      var colon  = iso === true ? ':' : '';
      if(!offset && iso) return 'Z';
      return Math.round(-offset / 60).pad(2, true) + colon + (offset % 60).pad(2);
    },

    'utc': function(){
      return this.addMinutes(this.getTimezoneOffset());
    },

    'isUTC': function(){
      return this.getTimezoneOffset() === 0;
    },

    'advance': function(params){
      var args = collectArguments(arguments,'year','month','day','hour','minute','second','millisecond');
      return updateDate(this, args[0], false, false, 1, true);
    },

    'rewind': function(params){
      var args = collectArguments(arguments,'year','month','day','hour','minute','second','millisecond');
      return updateDate(this, args[0], false, false, -1);
    },

    'isValid': function(){
      return !isNaN(this.getTime());
    },

    'isAfter': function(f, buffer){
      return compareDate(this, f, buffer, 'after');
    },

    'isBefore': function(f, buffer){
      return compareDate(this, f, buffer, 'before');
    },

    'isBetween': function(first, second, buffer){
      if(compareDate(this, first, buffer, 'after', true) && compareDate(this, second, buffer, 'before', true)){
        return true;
      } else {
        return compareDate(this, second, buffer, 'after', true) && compareDate(this, first, buffer, 'before', true);
      }
    },

    'leapYear': function(){
      var year = this.getFullYear();
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    },

    'daysInMonth': function(){
      return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
    },

    'format': function(str, utc){
      var d = this;
      if(!d.isValid()){
        return 'Invalid Date';
      }
      utc = utc === true ? 'UTC' : '';
      if(Date[str]) str = Date[str];
      if(!str) return this.toString();
      dateOutputFormats.each(function(f){
        if(!str) return;
        str = str.replace(new RegExp('{('+f.token+')(?: (pad))?}', f.caps ? '' : 'i'), function(m,t,p){
          var value = f.format.call(null, d, utc);
          if(f.pad && (t.length === 2 || p === 'pad')){
            value = value.pad(f.pad);
          }
          if(f.weekdays){
            var l = t.toLowerCase();
            var abbreviated = l === 'dow' || l === 'weekday short';
            value = abbreviated ? abbreviatedWeekdays[value] : weekdays[value];
            if(t.first().toUpperCase() === t.first()) value = value.capitalize();
          }
          if(f.months){
            var l = t.toLowerCase();
            var abbreviated = l === 'mon' || l === 'month short';
            value = abbreviated ? abbreviatedMonths[value] : months[value];
            if(t.first().toUpperCase() === t.first()) value = value.capitalize();
          }
          if(f.meridian){
            if(t.length === 1) value = value.to(0);
            if(t.toUpperCase() === t) value = value.toUpperCase();
          }
          return value;
        });
      });
      return str;
    },

    'is': function(find, buffer){
      var month, weekday;
      if(Object.isString(buffer)){
        var f = dateUnits.find(function(u){
          return u.unit === buffer;
        });
        if(f){
          buffer = f.multiplier();
        }
      }
      buffer = buffer > 0 ? buffer : 0;
      if(!Object.isString(find)){
        find   = Date.create(find);
        buffer = buffer || 0;
        var t = this.getTime();
        var f = find.getTime();
        return t >= (f - buffer) && t < (f + 1 + buffer);
      } else {
        find = find.trim();
        if(find === 'future'){
          return this.getTime() > new Date().getTime();
        } else if(find === 'past'){
          return this.getTime() < new Date().getTime();
        } else if(find === 'weekday'){
          return !(this.getDay() === 0 || this.getDay() === 6);
        } else if(find === 'weekend'){
          return this.getDay() === 0 || this.getDay() === 6;
        } else if(weekday = getWeekday(find)){
          return this.getDay() === weekday;
        } else if(month = getMonth(find)){
          return this.getMonth() === month;
        } else {
          return compareDate(this, find, buffer);
        }
      }
    },

    'resetTime': function(){
      return this.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    },

    'toISOString': function(){
      return this.format(Date.ISO8601_DATETIME, true);
    }

  });

  // Class aliases
  // Creating "create" as an alias as there are instances where it may be overwritten.
  extend(Date, false, {
    'ISO8601': Date.ISO8601_DATETIME,
    'create': Date.make
  });

  // Instance aliases
  extend(Date, true, {
    'getWeekday':    Date.prototype.getDay,
    'getUTCWeekday':    Date.prototype.getUTCDay,
    'iso':    Date.prototype.toISOString
  });



  /***
   * Function module
   *
   ***/

  extend(Function, true, {

    'bind': function(scope){
      var fn = this;
      var args = Array.prototype.slice.call(arguments, 1);
      return function(){
        return fn.apply(scope, args.concat(Array.prototype.slice.call(arguments)));
      }
    },

    'delay': function(duration){
      var fn = this;
      var args = Array.prototype.slice.call(arguments, 1);
      this.timer = setTimeout(function(){
        return fn.apply(fn, args);
      }, duration);
      return this.timer;
    },

    'defer': function(){
      this.delay.apply(this, [0].concat(Array.prototype.slice.call(arguments)));
      return this;
    },

    'cancel': function(){
      return clearTimeout(this.timer);
    }

  });


  // Initializer
  function initialize(){
    buildObject();
    buildString();
    buildDate();
  }

  initialize();

})();
