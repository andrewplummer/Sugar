'use strict';

/***
 * @module Function
 * @description Lazy, throttled, and memoized functions, delayed functions and
 *              handling of timers, argument currying.
 *
 ***/

var _lock     = privatePropertyAccessor('lock');
var _timers   = privatePropertyAccessor('timers');
var _partial  = privatePropertyAccessor('partial');
var _canceled = privatePropertyAccessor('canceled');

// istanbul ignore next
var createInstanceFromPrototype = Object.create || function(prototype) {
  var ctor = function() {};
  ctor.prototype = prototype;
  return new ctor;
};

function setDelay(fn, ms, after, scope, args) {
  // Delay of infinity is never called of course...
  ms = coercePositiveInteger(ms || 0);
  if (!_timers(fn)) {
    _timers(fn, []);
  }
  // This is a workaround for <= IE8, which apparently has the
  // ability to call timeouts in the queue on the same tick (ms?)
  // even if functionally they have already been cleared.
  _canceled(fn, false);
  _timers(fn).push(setTimeout(function() {
    if (!_canceled(fn)) {
      after.apply(scope, args || []);
    }
  }, ms));
}

function cancelFunction(fn) {
  var timers = _timers(fn), timer;
  if (isArray(timers)) {
    while(timer = timers.shift()) {
      clearTimeout(timer);
    }
  }
  _canceled(fn, true);
  return fn;
}

function createLazyFunction(fn, ms, immediate, limit) {
  var queue = [], locked = false, execute, rounded, perExecution, result;
  ms = ms || 1;
  limit = limit || Infinity;
  rounded = ceil(ms);
  perExecution = round(rounded / ms) || 1;
  execute = function() {
    var queueLength = queue.length, maxPerRound;
    if (queueLength == 0) return;
    // Allow fractions of a millisecond by calling
    // multiple times per actual timeout execution
    maxPerRound = max(queueLength - perExecution, 0);
    while(queueLength > maxPerRound) {
      // Getting uber-meta here...
      result = Function.prototype.apply.apply(fn, queue.shift());
      queueLength--;
    }
    setDelay(lazy, rounded, function() {
      locked = false;
      execute();
    });
  };
  function lazy() {
    // If the execution has locked and it's immediate, then
    // allow 1 less in the queue as 1 call has already taken place.
    if (queue.length < limit - (locked && immediate ? 1 : 0)) {
      // Optimized: no leaking arguments
      var args = []; for(var $i = 0, $len = arguments.length; $i < $len; $i++) args.push(arguments[$i]);
      queue.push([this, args]);
    }
    if (!locked) {
      locked = true;
      if (immediate) {
        execute();
      } else {
        setDelay(lazy, rounded, execute);
      }
    }
    // Return the memoized result
    return result;
  }
  return lazy;
}

// Collecting arguments in an array instead of
// passing back the arguments object which will
// deopt this function in V8.
function collectArguments() {
  var args = arguments, i = args.length, arr = new Array(i);
  while (i--) {
    arr[i] = args[i];
  }
  return arr;
}

function createHashedMemoizeFunction(fn, hashFn, limit) {
  var map = {}, refs = [], counter = 0;
  return function() {
    var hashObj = hashFn.apply(this, arguments);
    var key = serializeInternal(hashObj, refs);
    if (hasOwn(map, key)) {
      return getOwn(map, key);
    }
    if (counter === limit) {
      map = {};
      refs = [];
      counter = 0;
    }
    counter++;
    return map[key] = fn.apply(this, arguments);
  };
}

defineInstance(sugarFunction, {

  /***
   * @method lazy([ms] = 1, [immediate] = false, [limit] = Infinity)
   * @returns Function
   * @short Creates a lazy function that, when called repeatedly, will queue
   *        execution and wait [ms] milliseconds to execute.
   * @extra If [immediate] is `true`, first execution will happen immediately,
   *        then lock. If [limit] is a fininte number, calls past [limit] will
   *        be ignored while execution is locked. Compare this to `throttle`,
   *        which will execute only once per [ms] milliseconds. Note that [ms]
   *        can also be a fraction. Calling `cancel` on a lazy function will
   *        clear the entire queue.
   *
   * @example
   *
   *   var fn = logHello.lazy(250);
   *   runTenTimes(fn); -> Logs 10 times each time 250ms later
   *
   *   var fn = logHello.lazy(250, false, 5);
   *   runTenTimes(fn); -> Logs 5 times each time 250ms later
   *
   * @param {number} [ms]
   * @param {number} [limit]
   * @param {boolean} [immediate]
   *
   ***/
  'lazy': function(fn, ms, immediate, limit) {
    return createLazyFunction(fn, ms, immediate, limit);
  },

  /***
   * @method throttle([ms] = 1)
   * @returns Function
   * @short Creates a "throttled" version of the function that will only be
   *        executed once per `ms` milliseconds.
   * @extra This is functionally equivalent to calling `lazy` with a [limit] of
   *        `1` and [immediate] as `true`. `throttle` is appropriate when you
   *        want to make sure a function is only executed at most once for a
   *        given duration.
   *
   * @example
   *
   *   var fn = logHello.throttle(50);
   *   runTenTimes(fn);
   *
   * @param {number} [ms]
   *
   ***/
  'throttle': function(fn, ms) {
    return createLazyFunction(fn, ms, true, 1);
  },

  /***
   * @method debounce([ms] = 1)
   * @returns Function
   * @short Creates a "debounced" function that postpones its execution until
   *        after `ms` milliseconds have passed.
   * @extra This method is useful to execute a function after things have
   *        "settled down". A good example of this is when a user tabs quickly
   *        through form fields, execution of a heavy operation should happen
   *        after a few milliseconds when they have "settled" on a field.
   *
   * @example
   *
   *   var fn = logHello.debounce(250)
   *   runTenTimes(fn); -> called once 250ms later
   *
   * @param {number} [ms]
   *
   ***/
  'debounce': function(fn, ms) {
    function debounced() {
      // Optimized: no leaking arguments
      var args = []; for(var $i = 0, $len = arguments.length; $i < $len; $i++) args.push(arguments[$i]);
      cancelFunction(debounced);
      setDelay(debounced, ms, fn, this, args);
    }
    return debounced;
  },

  /***
   * @method cancel()
   * @returns Function
   * @short Cancels a delayed function scheduled to be run.
   * @extra `delay`, `lazy`, `throttle`, and `debounce` can all set delays.
   *
   * @example
   *
   *   logHello.delay(500).cancel() -> never logs
   *
   ***/
  'cancel': function(fn) {
    return cancelFunction(fn);
  },

  /***
   * @method after(n)
   * @returns Function
   * @short Creates a function that will execute after `n` calls.
   * @extra `after` is useful for running a final callback after a specific
   *        number of operations, often when the order in which the operations
   *        will complete is unknown. The created function will be passed an
   *        array of the arguments that it has collected from each after `n`.
   *        Note that the function will execute on every call after `n`.
   *        Use `once` in conjunction with this method to prevent being
   *        triggered by subsequent calls.
   *
   * @example
   *
   *   var fn = logHello.after(5);
   *   runTenTimes(fn); -> logs 6 times
   *
   *   var fn = logHello.once().after(5)
   *   runTenTimes(fn); -> logs once
   *
   * @param {number} [n]
   *
   ***/
  'after': function(fn, num) {
    var count = 0, collectedArgs = [];
    num = coercePositiveInteger(num);
    return function() {
      // Optimized: no leaking arguments
      var args = []; for(var $i = 0, $len = arguments.length; $i < $len; $i++) args.push(arguments[$i]);
      collectedArgs.push(args);
      count++;
      if (count >= num) {
        return fn.call(this, collectedArgs);
      }
    };
  },

  /***
   * @method once()
   * @returns Function
   * @short Creates a function that will execute only once and store the result.
   * @extra `once` is useful for creating functions that will cache the result
   *        of an expensive operation and use it on subsequent calls. Also it
   *        can be useful for creating initialization functions that only need
   *        to be run once.
   *
   * @example
   *
   *   var fn = logHello.once();
   *   runTenTimes(fn); -> logs once
   *
   ***/
  'once': function(fn) {
    var called = false, val;
    return function() {
      if (called) {
        return val;
      }
      called = true;
      return val = fn.apply(this, arguments);
    };
  },

  /***
   * @method memoize([hashFn], [limit])
   * @returns Function
   * @short Creates a function that will memoize results for unique calls.
   * @extra `memoize` can be thought of as a more powerful `once`. Where `once`
   *        will only call a function once ever, memoized functions will be
   *        called once per unique call. A "unique call" is determined by the
   *        return value of [hashFn], which is passed the arguments of each call.
   *        If [hashFn] is undefined, it will deeply serialize all arguments,
   *        such that any different argument signature will result in a unique
   *        call. [hashFn] may be a string (allows `deep properties`) that acts
   *        as a shortcut to return a property of the first argument passed.
   *        [limit] sets an upper limit on memoized results. The default is no
   *        limit, meaning that unique calls will continue to memoize results.
   *        For most use cases this is fine, however [limit] is useful for more
   *        persistent (often server-side) applications for whom memory leaks
   *        are a concern.
   *
   * @example
   *
   *   var fn = logHello.memoize();
   *   fn(1); fn(1); fn(2); -> logs twice, memoizing once
   *
   *   var fn = calculateUserBalance.memoize('id');
   *   fn(Harry); fn(Mark); fn(Mark); -> logs twice, memoizing once
   *
   * @param {string|Function} [hashFn]
   * @param {number} [limit]
   *
   ***/
  'memoize': function(fn, arg1, arg2) {
    var hashFn, limit, prop;
    if (isNumber(arg1)) {
      limit = arg1;
    } else {
      hashFn = arg1;
      limit  = arg2;
    }
    if (isString(hashFn)) {
      prop = hashFn;
      hashFn = function(obj) {
        return deepGetProperty(obj, prop);
      };
    } else if (!hashFn) {
      hashFn = collectArguments;
    }
    return createHashedMemoizeFunction(fn, hashFn, limit);
  },

  /***
   * @method lock([n])
   * @returns Function
   * @short Locks the number of arguments accepted by the function.
   * @extra If not passed, [n] will be the length of the function. This method
   *        can be called on functions created by `partial`, in which case it
   *        will lock the total arguments during execution.
   *
   * @example
   *
   *   logArgs.lock(2)(1,2,3)      -> logs 1,2
   *
   * @param {number} [n]
   *
   ***/
  'lock': function(fn, n) {
    var lockedFn;
    if (_partial(fn)) {
      _lock(fn, isNumber(n) ? n : null);
      return fn;
    }
    lockedFn = function() {
      arguments.length = min(_lock(lockedFn), arguments.length);
      return fn.apply(this, arguments);
    };
    _lock(lockedFn, isNumber(n) ? n : fn.length);
    return lockedFn;
  }

});

defineInstanceWithArguments(sugarFunction, {

  /***
   * @method partial([arg1], [arg2], ...)
   * @returns Function
   * @short Returns a new version of the function which has part of its arguments
   *        pre-emptively filled in, also known as "currying".
   * @extra `undefined` can be passed as any argument, and is a placeholder that
   *        will be replaced with arguments passed when the function is executed.
   *        This allows currying of arguments even when they occur toward the end
   *        of an argument list (the example demonstrates this more clearly).
   *
   * @example
   *
   *   logArgs.partial(undefined, 'b')('a') -> logs a, b
   *
   * @param {any} [arg1]
   * @param {any} [arg2]
   *
   ***/
  'partial': function(fn, curriedArgs) {
    var curriedLen = curriedArgs.length;
    var partialFn = function() {
      var argIndex = 0, applyArgs = [], self = this, lock = _lock(partialFn), result, i;
      for (i = 0; i < curriedLen; i++) {
        var arg = curriedArgs[i];
        if (isDefined(arg)) {
          applyArgs[i] = arg;
        } else {
          applyArgs[i] = arguments[argIndex++];
        }
      }
      for (i = argIndex; i < arguments.length; i++) {
        applyArgs.push(arguments[i]);
      }
      if (lock === null) {
        lock = curriedLen;
      }
      if (isNumber(lock)) {
        applyArgs.length = min(applyArgs.length, lock);
      }
      // If the bound "this" object is an instance of the partialed
      // function, then "new" was used, so preserve the prototype
      // so that constructor functions can also be partialed.
      if (self instanceof partialFn) {
        self = createInstanceFromPrototype(fn.prototype);
        result = fn.apply(self, applyArgs);
        // An explicit return value is allowed from constructors
        // as long as they are of "object" type, so return the
        // correct result here accordingly.
        return isObjectType(result) ? result : self;
      }
      return fn.apply(self, applyArgs);
    };
    _partial(partialFn, true);
    return partialFn;
  },

  /***
   * @method delay([ms] = 1, [arg1], [arg2], ...)
   * @returns Function
   * @short Executes the function after `ms` milliseconds.
   * @extra Returns a reference to itself. `delay` is also a way to execute non-
   *        blocking operations that will wait until the CPU is free. Delayed
   *        functions can be canceled using the `cancel` method. Can also curry
   *        arguments passed in after `ms`.
   *
   * @example
   *
   *   logHello.delay(500)     -> logs after 500ms
   *   logArgs.delay(500, 'a') -> logs "a" after 500ms
   *
   * @param {number} [ms]
   * @param {any} [arg1]
   * @param {any} [arg2]
   *
   ***/
  'delay': function(fn, ms, args) {
    setDelay(fn, ms, fn, fn, args);
    return fn;
  },

  /***
   * @method every([ms] = 1, [arg1], [arg2], ...)
   * @returns Function
   * @short Executes the function every `ms` milliseconds.
   * @extra Returns a reference to itself. `every` uses `setTimeout`, which
   *        means that you are guaranteed a period of idle time equal to [ms]
   *        after execution has finished. Compare this to `setInterval` which
   *        will try to run a function every [ms], even when execution itself
   *        takes up a portion of that time. In most cases avoiding `setInterval`
   *        is better as calls won't "back up" when the CPU is under strain,
   *        however this also means that calls are less likely to happen at
   *        exact intervals of [ms], so the use case here should be considered.
   *        Additionally, `every` can curry arguments passed in after [ms], and
   *        also be canceled with `cancel`.
   *
   * @example
   *
   *   logHello.every(1000)        -> logs every second
   *   logArgs.every(1000, 'Hola') -> logs 'hola' every second
   *
   * @param {number} [ms]
   * @param {any} [arg1]
   * @param {any} [arg2]
   *
   ***/
  'every': function(fn, ms, args) {
    function execute () {
      // Set the delay first here, so that cancel
      // can be called within the executing function.
      setDelay(fn, ms, execute);
      fn.apply(fn, args);
    }
    setDelay(fn, ms, execute);
    return fn;
  }

});
