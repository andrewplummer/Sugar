
  'use strict';

  /***
   * @package Function
   * @dependency core
   * @description Lazy, throttled, and memoized functions, delayed functions and handling of timers, argument currying.
   *
   ***/

  var _lock     = privatePropertyAccessor('lock');
  var _timers   = privatePropertyAccessor('timers');
  var _partial  = privatePropertyAccessor('partial');
  var _canceled = privatePropertyAccessor('canceled');

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
    }
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

  function stringifyArguments() {
    var str = '';
    for (var i = 0; i < arguments.length; i++) {
      str += stringify(arguments[i]);
    }
    return str;
  }

  function createMemoizedFunction(fn, hashFn) {
    var cache = {}, key;
    if (!hashFn) {
      hashFn = stringifyArguments;
    } else if(isString(hashFn)) {
      key = hashFn;
      hashFn = function(arg) {
        return deepGetProperty(arg, key);
      }
    }
    return function memoized() {
      var key = hashFn.apply(this, arguments);
      if (hasOwnProperty(cache, key)) {
        return cache[key];
      }
      return cache[key] = fn.apply(this, arguments);
    }
  }

  var createInstanceFromPrototype = Object.create || function(prototype) {
    var ctor = function() {};
    ctor.prototype = prototype;
    return new ctor;
  }

  defineInstance(sugarFunction, {

     /***
     * @method lazy([ms] = 1, [immediate] = false, [limit] = Infinity)
     * @returns Function
     * @short Creates a lazy function that, when called repeatedly, will queue execution and wait [ms] milliseconds to execute.
     * @extra If [immediate] is %true%, first execution will happen immediately, then lock. If [limit] is a fininte number, calls past [limit] will be ignored while execution is locked. Compare this to %throttle%, which will execute only once per [ms] milliseconds. Note that [ms] can also be a fraction. Calling %cancel% on a lazy function will clear the entire queue. For more see %functions%.
     * @example
     *
     *   (function() {
     *     // Executes immediately.
     *   }).lazy()();
     *   (3).times(function() {
     *     // Executes 3 times, with each execution 20ms later than the last.
     *   }.lazy(20));
     *   (100).times(function() {
     *     // Executes 50 times, with each execution 20ms later than the last.
     *   }.lazy(20, false, 50));
     *
     ***/
    'lazy': function(fn, ms, immediate, limit) {
      return createLazyFunction(fn, ms, immediate, limit);
    },

     /***
     * @method throttle([ms] = 1)
     * @returns Function
     * @short Creates a "throttled" version of the function that will only be executed once per <ms> milliseconds.
     * @extra This is functionally equivalent to calling %lazy% with a [limit] of %1% and [immediate] as %true%. %throttle% is appropriate when you want to make sure a function is only executed at most once for a given duration. For more see %functions%.
     * @example
     *
     *   (3).times(function() {
     *     // called only once. will wait 50ms until it responds again
     *   }.throttle(50));
     *
     ***/
    'throttle': function(fn, ms) {
      return createLazyFunction(fn, ms, true, 1);
    },

     /***
     * @method debounce([ms] = 1)
     * @returns Function
     * @short Creates a "debounced" function that postpones its execution until after <ms> milliseconds have passed.
     * @extra This method is useful to execute a function after things have "settled down". A good example of this is when a user tabs quickly through form fields, execution of a heavy operation should happen after a few milliseconds when they have "settled" on a field. For more see %functions%.
     * @example
     *
     *   var fn = (function(arg1) {
     *     // called once 50ms later
     *   }).debounce(50); fn(); fn(); fn();
     *
     ***/
    'debounce': function(fn, ms) {
      function debounced() {
        // Optimized: no leaking arguments
        var args = []; for(var $i = 0, $len = arguments.length; $i < $len; $i++) args.push(arguments[$i]);
        cancelFunction(debounced);
        setDelay(debounced, ms, fn, this, args);
      };
      return debounced;
    },

     /***
     * @method cancel()
     * @returns Function
     * @short Cancels a delayed function scheduled to be run.
     * @extra %delay%, %lazy%, %throttle%, and %debounce% can all set delays.
     * @example
     *
     *   (function() {
     *     alert('hay'); -> Never called
     *   }).delay(500).cancel();
     *
     ***/
    'cancel': function(fn) {
      return cancelFunction(fn);
    },

     /***
     * @method after(<n>)
     * @returns Function
     * @short Creates a function that will execute after <n> calls.
     * @extra %after% is useful for running a final callback after a specific number of operations, often when the order in which the operations will complete is unknown. The created function will be passed an array of the arguments that it has collected from each after <n>.
     * @example
     *
     *   var fn = (function() {
     *     // Will be executed once
     *   }).after(3); fn(); fn(); fn();
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
      }
    },

     /***
     * @method once()
     * @returns Function
     * @short Creates a function that will execute only once and store the result.
     * @extra %once% is useful for creating functions that will cache the result of an expensive operation and use it on subsequent calls. Also it can be useful for creating initialization functions that only need to be run once.
     * @example
     *
     *   var fn = (function() {
     *     // Will be executed once only
     *   }).once(); fn(); fn(); fn();
     *
     ***/
    'once': function(fn) {
      // noop always returns "undefined" as the cache key.
      return createMemoizedFunction(fn, function() {});
    },

     /***
     * @method memoize([hashFn])
     * @returns Function
     * @short Creates a function that will cache results for unique calls.
     * @extra %memoize% can be thought of as a more power %once%. Where %once% will only call a function once ever, memoized functions will be called once per unique call. A "unique call" is determined by the return value of [hashFn], which is passed the arguments of each call. If [hashFn] is undefined, it will stringify all arguments, such that any different argument signature will result in a unique call. Passing a string for [hashFn] is a shortcut that will get that property from the first argument. This operation supports %deep_properties%.
     * @example
     *
     *   var fn = (function() {
     *     // Will be executed twice, returning the memoized
     *     // result of the first call again on the last.
     *   }).memoize(); fn(1); fn(2); fn(1);
     *
     ***/
    'memoize': function(fn, hashFn) {
      return createMemoizedFunction(fn, hashFn);
    },

     /***
     * @method lock([n])
     * @returns Function
     * @short Locks the number of arguments accepted by the function.
     * @extra If not passed, [n] will be the length of the function. This method can be called on functions created by %partial%, in which case it will lock the total arguments during execution.
     * @example
     *
     *   parseInt.lock(1)('10', 16); -> 10 (only 1 argument passed to parseInt)
     *   (function() {
     *     console.info(arguments.length); // Should be 2
     *   }).lock(2)('a','b','c');
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
      }
      _lock(lockedFn, isNumber(n) ? n : fn.length);
      return lockedFn;
    }

  });


  defineInstanceWithArguments(sugarFunction, {

     /***
     * @method partial(<arg1>, <arg2>, ...)
     * @returns Function
     * @short Returns a new version of the function which has part of its arguments pre-emptively filled in, also known as "currying".
     * @extra %undefined% can be passed as any argument, and is a placeholder that will be replaced with arguments passed when the function is executed. This allows currying of arguments even when they occur toward the end of an argument list (the example demonstrates this more clearly).
     * @example
     *
     *   var delayOneSecond = setTimeout.partial(undefined, 1000);
     *   delayOneSecond(function() {
     *     // Will be executed 1s later
     *   });
     *
     ***/
    'partial': function(fn, curriedArgs) {
      var curriedLen = curriedArgs.length;
      var partialFn = function() {
        var argIndex = 0, applyArgs = [], self = this, lock = _lock(partialFn), result;
        for (var i = 0; i < curriedLen; i++) {
          var arg = curriedArgs[i];
          if (isDefined(arg)) {
            applyArgs[i] = arg;
          } else {
            applyArgs[i] = arguments[argIndex++];
          }
        }
        for (var i = argIndex; i < arguments.length; i++) {
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
      }
      _partial(partialFn, true);
      return partialFn;
    },

     /***
     * @method delay([ms] = 1, [arg1], ...)
     * @returns Function
     * @short Executes the function after <ms> milliseconds.
     * @extra Returns a reference to itself. %delay% is also a way to execute non-blocking operations that will wait until the CPU is free. Delayed functions can be canceled using the %cancel% method. Can also curry arguments passed in after <ms>.
     * @example
     *
     *   (function(arg1) {
     *     // called 1s later
     *   }).delay(1000, 'arg1');
     *
     ***/
    'delay': function(fn, ms, args) {
      setDelay(fn, ms, fn, fn, args);
      return fn;
    },

     /***
     * @method every([ms] = 1, [arg1], ...)
     * @returns Function
     * @short Executes the function every <ms> milliseconds.
     * @extra Returns a reference to itself. %every% uses %setTimeout%, which means that you are guaranteed a period of idle time equal to [ms] after execution has finished. Compare this to %setInterval% which will try to run a function every [ms], even when execution itself takes up a portion of that time. In most cases avoiding %setInterval% is better as calls won't "back up" when the CPU is under strain, however this also means that calls are less likely to happen at exact intervals of [ms], so the use case here should be considered. Additionally, %every% can curry arguments passed in after [ms], and also be canceled with %cancel%.
     * @example
     *
     *   (function(arg1) {
     *     // called every 1s
     *   }).every(1000, 'arg1');
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
