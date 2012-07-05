// Google Closure Compiler will output a wrapping function here.

  // A few optimizations for Google Closure Compiler will save us a couple kb in the release script.
  var object = Object, array = Array, regexp = RegExp, date = Date, string = String, number = Number, math = Math, Undefined;

  // defineProperty exists in IE8 but will error when trying to define a property on
  // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
  var definePropertySupport = object.defineProperty && object.defineProperties;

  // Class extending methods

  function extend(klass, instance, override, methods) {
    var extendee = instance ? klass.prototype : klass, original;
    initializeClass(klass, instance, methods);
    iterateOverObject(methods, function(name, method) {
      original = extendee[name];
      if(typeof override === 'function') {
        method = wrapNative(extendee[name], method, override);
      }
      if(override !== false || !extendee[name]) {
        defineProperty(extendee, name, method);
      }
      // If the method is internal to Sugar, then store a reference so it can be restored later.
      klass['SugarMethods'][name] = { instance: instance, method: method, original: original };
    });
  }

  function initializeClass(klass) {
    if(klass['SugarMethods']) return;
    defineProperty(klass, 'SugarMethods', {});
    extend(klass, false, false, {
      'restore': function() {
        var all = arguments.length === 0, methods = getArgs(arguments);
        iterateOverObject(klass['SugarMethods'], function(name, m) {
          if(all || methods.indexOf(name) > -1) {
            defineProperty(m.instance ? klass.prototype : klass, name, m.method);
          }
        });
      },
      'extend': function(methods, override, instance) {
        extend(klass, instance !== false, override, methods);
      }
    });
  }

  function wrapNative(nativeFn, extendedFn, condition) {
    return function() {
      if(nativeFn && (condition === true || !condition.apply(this, arguments))) {
        return nativeFn.apply(this, arguments);
      } else {
        return extendedFn.apply(this, arguments);
      }
    }
  }

  function defineProperty(target, name, method) {
    if(definePropertySupport) {
      object.defineProperty(target, name, { 'value': method, 'configurable': true, 'enumerable': false, 'writable': true });
    } else {
      target[name] = method;
    }
  }

  function extendSimilar(klass, instance, set, fn) {
    var methods = {};
    set = isString(set) ? set.split(',') : set;
    simpleArrayEach(set, function(el) {
      fn(el, methods);
    });
    extend(klass, instance, false, methods);
  }

  // Argument helpers

  function getArgs(args, index) {
    return array.prototype.slice.call(args, index);
  }

  function multiArgs(args, fn) {
    simpleArrayEach(getArgs(args), fn);
  }

  // Used for both arrays and strings

  function entryAtIndex(arr, args, str) {
    var result = [], length = arr.length, loop = args[args.length - 1] !== false, r;
    multiArgs(args, function(index) {
      if(isBoolean(index)) return false;
      if(loop) {
        index = index % length;
        if(index < 0) index = length + index;
      }
      r = str ? arr.charAt(index) || '' : arr[index];
      result.push(r);
    });
    return result.length < 2 ? result[0] : result;
  }

  // General helpers

  function isDefined(o) {
    return o !== Undefined;
  }

  function isUndefined(o) {
    return o === Undefined;
  }

  function isClass(obj, str) {
    return object.prototype.toString.call(obj) === '[object '+str+']';
  }

  function isObject(obj) {
    // === on the constructor is not safe across iframes
    return !!obj && isClass(obj, 'Object') && string(obj.constructor) === string(object);
  }

  function isObjectPrimitive(obj) {
    // Check for null
    return obj && typeof obj === 'object';
  }

  function hasOwnProperty(obj, key) {
    return object.prototype.hasOwnProperty.call(obj, key);
  }

  /***
   * Object module
   *
   ***/



  // Object helpers

  function iterateOverObject(obj, fn) {
    var key;
    for(key in obj) {
      if(!hasOwnProperty(obj, key)) continue;
      fn.call(obj, key, obj[key]);
    }
  }

  function commaSeparatedEach(str, fn) {
    str.split(',').forEach(fn);
  }

  function simpleArrayEach(arr, fn) {
    arr.forEach(fn);
  }

  function simpleMerge(target, source) {
    iterateOverObject(source, function(key) {
      target[key] = source[key];
    });
  }

  function stringify(thing, stack) {
    var value, klass, isObject, isArray, arr, i, key, type = typeof thing;

    // Return quickly if string to save cycles
    if(type === 'string') return thing;

    klass    = object.prototype.toString.call(thing)
    isObject = klass === '[object Object]';
    isArray  = klass === '[object Array]';

    if(thing != null && isObject || isArray) {
      // This method for checking for cyclic structures was egregiously stolen from
      // the ingenious method by @kitcambridge from the Underscore script:
      // https://github.com/documentcloud/underscore/issues/240
      if(!stack) stack = [];
      // Allowing a step into the structure before triggering this
      // script to save cycles on standard JSON structures and also to
      // try as hard as possible to catch basic properties that may have
      // been modified.
      if(stack.length > 1) {
        i = stack.length;
        while (i--) {
          if (stack[i] === thing) {
            return 'CYC';
          }
        }
      }
      stack.push(thing);
      value = string(thing.constructor);
      arr = isArray ? thing : object.keys(thing).sort();
      for(i = 0; i < arr.length; i++) {
        key = isArray ? i : arr[i];
        value += key + stringify(thing[key], stack);
      }
      stack.pop();
    } else if(1 / thing === -Infinity) {
      value = '-0';
    } else {
      value = string(thing && thing.valueOf());
    }
    return type + klass + value;
  }

  var ClassNames = 'Object,Array,Boolean,Date,Function,Number,String,RegExp'.split(',');

  var isArray    = buildClassCheck(ClassNames[1]);
  var isBoolean  = buildClassCheck(ClassNames[2]);
  var isDate     = buildClassCheck(ClassNames[3]);
  var isFunction = buildClassCheck(ClassNames[4]);
  var isNumber   = buildClassCheck(ClassNames[5]);
  var isString   = buildClassCheck(ClassNames[6]);
  var isRegExp   = buildClassCheck(ClassNames[7]);

  function buildClassCheck(type) {
    return function(obj) {
      return isClass(obj, type);
    }
  }

  function initializeClasses() {
    var top = typeof global !== 'undefined' ? global : this;
    simpleArrayEach(ClassNames, function(name) {
      initializeClass(top[name]);
    });
  }
  initializeClasses();



  /***
   * Array module
   *
   ***/




  /***
   * Number module
   *
   ***/

  function getRange(start, stop, fn, step) {
    var arr = [], i = parseInt(start), down = step < 0;
    while((!down && i <= stop) || (down && i >= stop)) {
      arr.push(i);
      if(fn) fn.call(this, i);
      i += step || 1;
    }
    return arr;
  }

  function round(val, precision, method) {
    var fn = math[method || 'round'];
    var multiplier = math.pow(10, math.abs(precision || 0));
    if(precision < 0) multiplier = 1 / multiplier;
    return fn(val * multiplier) / multiplier;
  }

  function ceil(val, precision) {
    return round(val, precision, 'ceil');
  }

  function floor(val, precision) {
    return round(val, precision, 'floor');
  }

  /***
   * String module
   *
   ***/


  // WhiteSpace/LineTerminator as defined in ES5.1 plus Unicode characters in the Space, Separator category.
  var getTrimmableCharacters = function() {
    return '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';
  }

  function padString(str, p, left, right) {
    var padding = String(p);
    if(padding != p) {
      padding = '';
    }
    if(!isNumber(left))  left = 1;
    if(!isNumber(right)) right = 1;
    return padding.repeat(left) + str + padding.repeat(right);
  }

  function buildTrim() {
    var support = getTrimmableCharacters().match(/^\s+$/);
    try { string.prototype.trim.call([1]); } catch(e) { support = false; }
    var trimL = regexp('^['+getTrimmableCharacters()+']+');
    var trimR = regexp('['+getTrimmableCharacters()+']+$');
    extend(string, true, !support, {

      /***
       * @method trim[Side]()
       * @returns String
       * @short Removes leading and/or trailing whitespace from the string.
       * @extra Whitespace is defined as line breaks, tabs, and any character in the "Space, Separator" Unicode category, conforming to the the ES5 spec. The standard %trim% method is only added when not fully supported natively.
       * @example
       *
       *   '   wasabi   '.trim()      -> 'wasabi'
       *   '   wasabi   '.trimLeft()  -> 'wasabi   '
       *   '   wasabi   '.trimRight() -> '   wasabi'
       *
       ***
       * @method trim()
       * @set trimSide
       ***/
      'trim': function() {
        return this.toString().trimLeft().trimRight();
      },

      /***
       * @method trimLeft()
       * @set trimSide
       ***/
      'trimLeft': function() {
        return this.replace(trimL, '');
      },

      /***
       * @method trimRight()
       * @set trimSide
       ***/
      'trimRight': function() {
        return this.replace(trimR, '');
      }
    });
  }


  /***
   * RegExp module
   *
   * Note here that methods on the RegExp class like .exec and .test will fail in the current version of SpiderMonkey being
   * used by CouchDB when using shorthand regex notation like /foo/. This is the reason for the intermixed use of shorthand
   * and compiled regexes here. If you're using JS in CouchDB, it is safer to ALWAYS compile your regexes from a string.
   *
   ***/

  regexp.NPCGSupport = isUndefined(regexp('()??').exec('')[1]); // NPCG: nonparticipating capturing group

  function getFlags(reg, flag) {
    var flags = '';
    if(flag == 'g' || reg.global)     flags += 'g';
    if(flag == 'i' || reg.ignoreCase) flags += 'i';
    if(flag == 'm' || reg.multiline)  flags += 'm';
    if(flag == 'y' || reg.sticky)     flags += 'y';
    return flags;
  }

  extend(regexp, false, false, {

   /***
    * @method RegExp.escape(<str> = '')
    * @returns String
    * @short Escapes all RegExp tokens in a string.
    * @example
    *
    *   RegExp.escape('really?')      -> 'really\?'
    *   RegExp.escape('yes.')         -> 'yes\.'
    *   RegExp.escape('(not really)') -> '\(not really\)'
    *
    ***/
    'escape': function(str) {
      if(!isString(str)) str = String(str);
      return str.replace(/([\\/'*+?|()\[\]{}.^$])/g,'\\$1');
    }

  });

  extend(regexp, true, false, {

   /***
    * @method getFlags()
    * @returns String
    * @short Returns the flags of the regex as a string.
    * @example
    *
    *   /texty/gim.getFlags('testy') -> 'gim'
    *
    ***/
    'getFlags': function() {
      return getFlags(this);
    },

   /***
    * @method setFlags(<flags>)
    * @returns RegExp
    * @short Sets the flags on a regex and retuns a copy.
    * @example
    *
    *   /texty/.setFlags('gim') -> now has global, ignoreCase, and multiline set
    *
    ***/
    'setFlags': function(flags) {
      return regexp(this.source, flags);
    },

   /***
    * @method addFlag(<flag>)
    * @returns RegExp
    * @short Adds <flag> to the regex.
    * @example
    *
    *   /texty/.addFlag('g') -> now has global flag set
    *
    ***/
    'addFlag': function(flag) {
      return this.setFlags(getFlags(this, flag));
    },

   /***
    * @method removeFlag(<flag>)
    * @returns RegExp
    * @short Removes <flag> from the regex.
    * @example
    *
    *   /texty/g.removeFlag('g') -> now has global flag removed
    *
    ***/
    'removeFlag': function(flag) {
      return this.setFlags(getFlags(this).replace(flag, ''));
    }

  });



  /***
   * Function module
   *
   ***/


  function buildFunction() {
    var support = false;
    if(Function.prototype.bind) {
      function F() {};
      var B = F.bind();
      support = (new B instanceof B) && !(new F instanceof B);
    }
    extend(Function, true, !support, {

       /***
       * @method bind(<scope>, [arg1], ...)
       * @returns Function
       * @short Binds <scope> as the %this% object for the function when it is called. Also allows currying an unlimited number of parameters.
       * @extra "currying" means setting parameters ([arg1], [arg2], etc.) ahead of time so that they are passed when the function is called later. If you pass additional parameters when the function is actually called, they will be added will be added to the end of the curried parameters.
       * @example
       *
       +   (function() {
       *     return this;
       *   }).bind('woof')(); -> returns 'woof'; function is bound with 'woof' as the this object.
       *   (function(a) {
       *     return a;
       *   }).bind(1, 2)();   -> returns 2; function is bound with 1 as the this object and 2 curried as the first parameter
       *   (function(a, b) {
       *     return a + b;
       *   }).bind(1, 2)(3);  -> returns 5; function is bound with 1 as the this object, 2 curied as the first parameter and 3 passed as the second when calling the function
       *
       ***/
      'bind': function(scope) {
        var fn = this, args = getArgs(arguments, 1), nop, bound;
        if(!isFunction(this)) {
          throw new TypeError('Function.prototype.bind called on a non-function');
        }
        bound = function() {
          return fn.apply(fn.prototype && this instanceof fn ? this : scope, args.concat(getArgs(arguments)));
        }
        nop = function() {};
        nop.prototype = this.prototype;
        bound.prototype = new nop();
        return bound;
      }

    });
  }


  // Initialize
  buildTrim();
  buildFunction();

