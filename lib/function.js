
  /***
   * @package Function
   * @dependency core
   * @description Lazy, throttled, and memoized functions, delayed functions and handling of timers, argument currying.
   *
   ***/

  function setDelay(fn, ms, after, scope, args) {
    var index;
    // Delay of infinity is never called of course...
    if(ms === Infinity) return;
    if(!fn.timers) fn.timers = [];
    if(!isNumber(ms)) ms = 0;
    fn.timers.push(setTimeout(function(){
      fn.timers.splice(index, 1);
      after.apply(scope, args || []);
    }, ms));
    index = fn.timers.length;
  }

  extend(Function, true, false, {

     /***
     * @method lazy([ms] = 1, [limit] = Infinity)
     * @returns Function
     * @short Creates a lazy function that, when called repeatedly, will queue execution and wait [ms] milliseconds to execute again.
     * @extra Lazy functions will always execute as many times as they are called up to [limit], after which point subsequent calls will be ignored (if it is set to a finite number). Compare this to %throttle%, which will execute only once per [ms] milliseconds. %lazy% is useful when you need to be sure that every call to a function is executed, but in a non-blocking manner. Calling %cancel% on a lazy function will clear the entire queue. Note that [ms] can also be a fraction.
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
     *   }.lazy(20, 50));
     *
     ***/
    'lazy': function(ms, limit) {
      var fn = this, queue = [], lock = false, execute, rounded, perExecution, result;
      ms = ms || 1;
      limit = limit || Infinity;
      rounded = ceil(ms);
      perExecution = round(rounded / ms) || 1;
      execute = function() {
        if(lock || queue.length == 0) return;
        // Allow fractions of a millisecond by calling
        // multiple times per actual timeout execution
        var max = math.max(queue.length - perExecution, 0);
        while(queue.length > max) {
          // Getting uber-meta here...
          result = Function.prototype.apply.apply(fn, queue.shift());
        }
        setDelay(lazy, rounded, function() {
          lock = false;
          execute();
        });
        lock = true;
      }
      function lazy() {
        // The first call is immediate, so having 1 in the queue
        // implies two calls have already taken place.
        if(!lock || queue.length < limit - 1) {
          queue.push([this, arguments]);
          execute();
        }
        // Return the memoized result
        return result;
      }
      return lazy;
    },

     /***
     * @method delay([ms] = 0, [arg1], ...)
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
    'delay': function(ms) {
      var fn = this;
      var args = multiArgs(arguments).slice(1);
      setDelay(fn, ms, fn, fn, args);
      return fn;
    },

     /***
     * @method throttle(<ms>)
     * @returns Function
     * @short Creates a "throttled" version of the function that will only be executed once per <ms> milliseconds.
     * @extra This is functionally equivalent to calling %lazy% with a [limit] of %1%. %throttle% is appropriate when you want to make sure a function is only executed at most once for a given duration. Compare this to %lazy%, which will queue rapid calls and execute them later.
     * @example
     *
     *   (3).times(function() {
     *     // called only once. will wait 50ms until it responds again
     *   }.throttle(50));
     *
     ***/
    'throttle': function(ms) {
      return this.lazy(ms, 1);
    },

     /***
     * @method debounce(<ms>)
     * @returns Function
     * @short Creates a "debounced" function that postpones its execution until after <ms> milliseconds have passed.
     * @extra This method is useful to execute a function after things have "settled down". A good example of this is when a user tabs quickly through form fields, execution of a heavy operation should happen after a few milliseconds when they have "settled" on a field.
     * @example
     *
     *   var fn = (function(arg1) {
     *     // called once 50ms later
     *   }).debounce(50); fn() fn() fn();
     *
     ***/
    'debounce': function(ms) {
      var fn = this;
      function debounced() {
        debounced.cancel();
        setDelay(debounced, ms, fn, this, arguments);
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
     *     alert('hay'); // Never called
     *   }).delay(500).cancel();
     *
     ***/
    'cancel': function() {
      if(isArray(this.timers)) {
        while(this.timers.length > 0) {
          clearTimeout(this.timers.shift());
        }
      }
      return this;
    },

     /***
     * @method after([num] = 1)
     * @returns Function
     * @short Creates a function that will execute after [num] calls.
     * @extra %after% is useful for running a final callback after a series of asynchronous operations, when the order in which the operations will complete is unknown.
     * @example
     *
     *   var fn = (function() {
     *     // Will be executed once only
     *   }).after(3); fn(); fn(); fn();
     *
     ***/
    'after': function(num) {
      var fn = this, counter = 0, storedArguments = [];
      if(!isNumber(num)) {
        num = 1;
      } else if(num === 0) {
        fn.call();
        return fn;
      }
      return function() {
        var ret;
        storedArguments.push(multiArgs(arguments));
        counter++;
        if(counter == num) {
          ret = fn.call(this, storedArguments);
          counter = 0;
          storedArguments = [];
          return ret;
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
    'once': function() {
      return this.throttle(Infinity);
    },

     /***
     * @method fill(<arg1>, <arg2>, ...)
     * @returns Function
     * @short Returns a new version of the function which when called will have some of its arguments pre-emptively filled in, also known as "currying".
     * @extra Arguments passed to a "filled" function are generally appended to the curried arguments. However, if %undefined% is passed as any of the arguments to %fill%, it will be replaced, when the "filled" function is executed. This allows currying of arguments even when they occur toward the end of an argument list (the example demonstrates this much more clearly).
     * @example
     *
     *   var delayOneSecond = setTimeout.fill(undefined, 1000);
     *   delayOneSecond(function() {
     *     // Will be executed 1s later
     *   });
     *
     ***/
    'fill': function() {
      var fn = this, curried = multiArgs(arguments);
      return function() {
        var args = multiArgs(arguments);
        curried.forEach(function(arg, index) {
          if(arg != null || index >= args.length) args.splice(index, 0, arg);
        });
        return fn.apply(this, args);
      }
    }


  });

