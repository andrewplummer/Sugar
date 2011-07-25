
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


  /***
   * @method Object.clone(<obj> = {})
   * @returns Cloned object
   * @short Creates a deep clone (copy) of <obj>.
   * @example
   *
   *   Object.clone({foo:'bar'}) -> { foo: 'bar' }
   *   Object.clone({})          -> {}
   *
   ***
   * @method clone()
   * @returns Cloned object
   * @short Creates a deep clone (copy) of the object.
   * @extra This method is only available on extended objects created with %Object.extended%.
   * @example
   *
   *   Object.extended({foo:'bar'}).clone() -> { foo: 'bar' }
   *   Object.extended({}).clone()          -> {}
   *
   ***/
  var cloneObject = function(obj) {
    var result = Object.isArray(obj) ? [] : Object.extended({});
    iterateOverObject(obj, function(k,v) {
      if(Object.isObject(v) || Object.isArray(v)) {
        result[k] = cloneObject(v);
      } else {
        result[k] = v;
      }
    });
    return result;
  };

  var Hash = function(obj) {
    var self = this;
    iterateOverObject(obj, function(key, value) {
      self[key] = value;
    });
  }

  Hash.prototype.constructor = Object;

  var typeMethods = ['Array','Boolean','Date','Function','Number','String','RegExp'];
  var hashMethods = ['keys','values','each','merge','isEmpty','equals'];

  /***
   * @method Object.isArray(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is an Array.
   * @example
   *
   *   Object.isArray(3)        -> false
   *   Object.isArray(true)     -> false
   *   Object.isArray('wasabi') -> false
   *   Object.isArray([1,2,3])  -> true
   *
   ***
   * @method Object.isBoolean(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a Boolean.
   * @example
   *
   *   Object.isBoolean(3)        -> false
   *   Object.isBoolean(true)     -> true
   *   Object.isBoolean('wasabi') -> false
   *
   ***
   * @method Object.isDate(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a Date.
   * @example
   *
   *   Object.isDate(3)          -> false
   *   Object.isDate(true)       -> false
   *   Object.isDate('wasabi')   -> false
   *   Object.isDate(new Date()) -> true
   *
   ***
   * @method Object.isFunction(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a Function.
   * @example
   *
   *   Object.isFunction(3)            -> false
   *   Object.isFunction(true)         -> false
   *   Object.isFunction('wasabi')     -> false
   *   Object.isFunction(function() {}) -> true
   *
   ***
   * @method Object.isNumber(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a Number.
   * @example
   *
   *   Object.isNumber(3)        -> true
   *   Object.isNumber(true)     -> false
   *   Object.isNumber('wasabi') -> false
   *
   ***
   * @method Object.isString(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a String.
   * @example
   *
   *   Object.isString(3)        -> false
   *   Object.isString(true)     -> false
   *   Object.isString('wasabi') -> true
   *
   ***
   * @method Object.isRegExp(<obj>)
   * @returns Boolean
   * @short Returns true if <obj> is a RegExp.
   * @example
   *
   *   Object.isRegExp(3)        -> false
   *   Object.isRegExp(true)     -> false
   *   Object.isRegExp('wasabi') -> false
   *   Object.isRegExp(/wasabi/) -> true
   *
   ***/

  var buildObject = function() {
    typeMethods.slice(1).each(function(m) {
      defineProperty(Object, 'is'+m, function(obj) {
        return instance(obj, m);
      });
    });
    defineProperty(Object, 'isArray', Array.isArray || function(obj){
      return instance(obj, 'Array');
    });
    hashMethods.each(function(m) {
      defineProperty(Hash.prototype, m, function() {
        return Object[m].apply(null, [this].concat(Array.prototype.slice.call(arguments)));
      });
    });
    defineProperty(Object, 'clone', cloneObject);
    defineProperty(Hash.prototype, 'clone', function(){
      return cloneObject(this);
    });
    defineProperty(Object, 'enableSugar', function() {
      typeMethods.each(function(m) {
        defineProperty(Object.prototype, 'is'+m, function() {
          return Object['is'+m](this);
        });
      });
      hashMethods.each(function(m) {
        defineProperty(Object.prototype, m, Hash.prototype[m]);
      });
      defineProperty(Object.prototype, 'clone', function(){
        return cloneObject(this);
      });
    });
  };

  extend(Object, false, {

    /***
     * @method Object.extended(<obj> = {})
     * @returns Extended object
     * @short Creates a new object with extended hash-like methods.
     * @extra This is equivalent to the standard Object constructor %new Object()% but additionally returns an object with extended hash methods.
     * @example
     *
     *   Object.extended()
     *   Object.extended({ happy:true, pappy:false })
     *
     ***/
    'extended': function(obj) {
      return new Hash(obj);
    }

  });


  extend(Object, false, {

    /***
     * @method Object.isObject(<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is an object literal or "plain object".
     * @extra Anything that is not an object literal will return false, including instances of inherited classes.
     * @example
     *
     *   Object.isObject({})                -> true
     *   Object.isObject({ broken:'wear' }) -> true
     *   Object.isObject('wasabi')          -> false
     *   Object.isObject(3)                 -> false
     *
     ***/
    'isObject': function(o) {
      if(o === null || o === undefined || arguments.length === 0) {
        return false;
      } else {
        return instance(o, 'Object') && o.constructor === Object;
      }
    },

    /***
     * @method Object.each(<obj>, [fn])
     * @returns Object
     * @short Iterates over each property in <obj> calling [fn] on each iteration.
     * @example
     *
     *   Object.each({ broken:'wear' }, function(key, value) {
     *     // Iterates over each key/value pair.
     *   });
     *
     ***
     * @method each([fn])
     * @returns Object
     * @short Iterates over each property in the object calling [fn] on each iteration.
     * @extra This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({ broken: 'wear' }).each(function(key, value) {
     *     // Iterates over each key/value pair.
     *   });
     *
     ***/
    'each': function(obj, fn) {
      iterateOverObject(obj, function(k,v) {
        if(fn) fn.call(obj, k, v, obj);
      });
      return obj;
    },

    /***
     * @method Object.merge(<obj1>, <obj2>, ...)
     * @returns Merged object
     * @short Accepts an arbitrary number of objects as arguments and merges them all into <obj1>.
     * @example
     *
     *   Object.merge({a:1},{b:2}) -> { a:1, b:2 }
     *
     ***
     * @method merge(<obj1>, <obj2>, ...)
     * @returns Merged object
     * @short Accepts an arbitrary number of objects as arguments and merges them all into itself.
     * @extra This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({a:1}).merge({b:2}) -> { a:1, b:2 }
     *
     ***/
    'merge': function() {
      var target = arguments[0];
      for(var i = 1; i < arguments.length; i++) {
        var obj = arguments[i];
        for(var key in obj) {
          if(!obj.hasOwnProperty(key)) continue;
          target[key] = obj[key];
        }
      }
      return target;
    },

    /***
     * @method Object.isEmpty(<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is empty.
     * @example
     *
     *   Object.isEmpty({})          -> true
     *   Object.isEmpty({foo:'bar'}) -> false
     *
     ***
     * @method isEmpty()
     * @returns Boolean
     * @short Returns true if the object is empty.
     * @extra This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({}).isEmpty()          -> true
     *   Object.extended({foo:'bar'}).isEmpty() -> false
     *
     ***/
    'isEmpty': function(obj) {
      return deepEquals(obj, {});
    },

    /***
     * @method Object.equals(<a>, <b>)
     * @returns Boolean
     * @short Returns true if <a> and <b> are equal.
     * @example
     *
     *   Object.equals({a:2}, {a:2}) -> true
     *   Object.equals({a:2}, {a:3}) -> false
     *
     ***
     * @method equals(<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is equal to the object.
     * @extra This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({a:2}).equals({a:2}) -> true
     *   Object.extended({a:2}).equals({a:3}) -> false
     *
     ***/
    'equals': function(a, b) {
      return deepEquals(a, b);
    }

  });


  extendWithNativeCondition(Object, false, function() { return arguments.length == 1; }, {

    /***
     * @method Object.keys(<obj>, [fn])
     * @returns Array
     * @short Returns an array containing the keys in <obj>. Optionally calls [fn] for each key.
     * @extra Note that this method provides added functionality over the browser native %keys% method, which will not accept [fn].
     * @example
     *
     *   Object.keys({ broken: 'wear' }) -> ['broken']
     *   Object.keys({ broken: 'wear' }, function(key, value) {
     *     // Called once for each key.
     *   });
     *
     ***
     * @method keys([fn])
     * @returns Array
     * @short Returns an array containing the keys in the object. Optionally calls [fn] for each key.
     * @extra This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({ broken: 'wear' }).keys() -> ['broken']
     *   Object.extended({ broken: 'wear' }).keys(function(key, value) {
     *     // Called once for each key.
     *   });
     *
     ***/
    'keys': function(obj, fn) {
      var keys = [];
      iterateOverObject(obj, function(k,v) {
        keys.push(k);
        if(fn) fn.call(obj, k);
      });
      return keys;
    },

    /***
     * @method Object.values(<obj>, [fn])
     * @returns Array
     * @short Returns an array containing the values in <obj>. Optionally calls [fn] for each value.
     * @example
     *
     *   Object.values({ broken: 'wear' }) -> ['wear']
     *   Object.values({ broken: 'wear' }, function(value) {
     *     // Called once for each value.
     *   });
     *
     ***
     * @method values([fn])
     * @returns Array
     * @short Returns an array containing the values in the object. Optionally calls [fn] for each value.
     * @extra This method is only available on extended objects created with %Object.extended%.
     * @example
     *
     *   Object.extended({ broken: 'wear' }).values() -> ['wear']
     *   Object.extended({ broken: 'wear' }).values(function(value) {
     *     // Called once for each value.
     *   });
     *
     ***/
    'values': function(obj, fn) {
      var values = [];
      iterateOverObject(obj, function(k,v) {
        values.push(v);
        if(fn) fn.call(obj,v);
      });
      return values;
    }


  });
