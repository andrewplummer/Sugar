
  var extend = function(klass, instance, extend) {
    for(var name in extend) {
      if(extend.hasOwnProperty(name) && (instance ? !klass.prototype[name] : !klass[name])) {
        if(instance) {
          defineProperty(klass.prototype, name, extend[name]);
        } else {
          defineProperty(klass, name, extend[name]);
        }
      }
    }
  };

  var extendWithNativeCondition = function(klass, instance, condition, methods) {
    var extendee = instance ? klass.prototype : klass;
    iterateOverObject(methods, function(name, fn) {
      defineProperty(extendee, name, wrapNative(extendee[name], fn, condition));
    });
  };

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
    // defineProperty exists in IE8 but will error when trying to define a property on
    // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
    if(Object.defineProperty && Object.defineProperties){
      Object.defineProperty(target, name, { value: method, configurable: true, enumerable: false, writeable: true });
    } else {
      target[name] = method;
    }
  };

  var collectDateArguments = function(args) {
    if(typeof args[0] === 'object') {
      return args;
    } else if (args.length == 1 && Object.isNumber(args[0])) {
      return [args[0]];
    }
    var result = {};
    var format = Array.prototype.slice.call(arguments, 1);
    for(var i = 0; i < args.length; i++) {
      result[format[i]] = args[i];
    }
    return [result];
  };

  var deepEquals = function(a,b) {
    if(typeof a == 'object' && typeof b == 'object') {
      var checked = false;
      for(var key in a) {
        if(!a.hasOwnProperty(key)) continue;
        if(!deepEquals(a[key], b[key])) {
          return false;
        }
        checked = true;
      }
      if(!checked) {
        for(var key in b) {
          if(!b.hasOwnProperty(key)) continue;
          return false;
        }
      }
      return true;
    } else {
      return a === b;
    }
  };

  var multiMatch = function(el, match, scope, params) {
    if(Object.isRegExp(match)) {
      // Match against a regexp
      return match.test(el);
    } else if(Object.isFunction(match)) {
      // Match against a filtering function
      return match.apply(scope, [el].concat(params));
    } else if(typeof match === 'object') {
      // Match against a hash or array.
      return deepEquals(match, el);
    } else if(match !== undefined) {
      // Do a one-to-one equals
      return match === el;
    } else {
      // If undefined, match if truthy.
      return !!el;
    }
  };

  var transformArgument = function(argument, transform, scope, params) {
    if(Object.isFunction(transform)) {
      return transform.apply(scope, [argument].concat(params));
    } else if(transform === undefined) {
      return argument;
    } else if(typeof argument[transform] == 'function') {
      return argument[transform].call(argument);
    } else {
      return argument[transform];
    }
  };

  var getMinOrMax = function(obj, which, transform) {
    var max = which === 'max', min = which === 'min';
    var edge = max ? -Infinity : Infinity;
    var result = [];
    for(var key in obj) {
      if(!obj.hasOwnProperty(key)) continue;
      var entry = obj[key];
      var test = transformArgument(entry, transform);
      if(test === undefined || test === null) {
        continue;
      } else if(test === edge) {
        result.push(entry);
      } else if((max && test > edge) || (min && test < edge)) {
        result = [entry];
        edge = test;
      }
    }
    return result;
  };

  var getFromIndexes = function(obj, args, str) {
    var loop = args[args.length - 1] !== false,
        result = [],
        index, i;
    for(i = 0; i < args.length; i++) {
      index = args[i];
      if(index === true || index === false) break;
      if(loop) {
        index = index % obj.length;
        if(index < 0) index = obj.length + index;
      }
      if(index >= 0 && index < obj.length) {
        result.push(str ? obj.charAt(index) : obj[index]);
      }
    }
    if(result.length == 0) {
      return str ? '' : null;
    } else if(result.length == 1) {
      return result[0];
    } else {
      return result;
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
