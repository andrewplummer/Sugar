
  /***
   * Function module
   *
   ***/

  extend(Function, false, {

     /***
     * @method Function.lazy(<fn>, [throttle] = 1)
     * @returns Function
     * @short Creates lazy functions for non-blocking operations.
     * @extra This class method will return a function that when called will execute after the CPU is free, preventing "freezing" on heavy operations. Although this will work for a single function, it is best when used in conjunction with loops like %each%. In such situations, the returned function will be called multiple times. By default each iteration of <fn> will be called 1ms after the last, or the iteration number * [throttle]. By passing in a smaller value for [throttle] (can be a decimal < 1), you can "tighen up" the execution time so that the iterations happen faster. By passing in a greater value for [throttle], you can space the function execution out to prevent thread blocking. Playing with this number is the easiest way to strike a balance for heavier operations.
     * @example
     *
     *   Function.lazy(function() {
     *     // Executes 1ms later
     *   })();
     *   [1,2,3].each(Function.lazy(function() {
     *     // Executes 3 times, each 1ms later than the other.
     *   }));
     *   [1,2,3].each(Function.lazy(function() {
     *     // Executes 3 times, each 20ms later than the other.
     *   }, 20));
     *
     ***/
    'lazy': function(fn, throttle) {
      if(throttle === undefined) throttle = 1;
      var run = 0;
      return function() {
        var self = this, args = arguments;
        setTimeout(function() {
          return fn.apply(self, args);
        }, Math.round(++run * throttle));
      }
    }

  });

  extend(Function, true, {

     /***
     * @method bind(<scope>, [arg1], [arg2], ...)
     * @returns Function
     * @short Binds <scope> as the %this% object for the function when it is called. Also allows currying an unlimited number of parameters.
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
      var fn = this;
      var args = Array.prototype.slice.call(arguments, 1);
      return function() {
        return fn.apply(scope, args.concat(Array.prototype.slice.call(arguments)));
      }
    },

     /***
     * @method delay(<duration>)
     * @returns Number
     * @short Delays the function for <duration> milliseconds. Returns the timer to be used with %clearTimeout%.
     * @extra In addition to the timer returned, functions using the delay method can be canceled using the %cancel% method. Can also curry arguments passed in after the duration.
     * @example
     *
     *   (function(arg1) {
     *     // called 1s later
     *   }).delay(1000, 'arg1');    -> returns a timer to clear the function. Called 5 seconds later.
     *
     ***/
    'delay': function(duration) {
      var fn = this;
      var args = Array.prototype.slice.call(arguments, 1);
      this.timer = setTimeout(function() {
        return fn.apply(fn, args);
      }, duration);
      return this.timer;
    },

     /***
     * @method defer()
     * @returns Function
     * @short Defers the function to be called after the stack is empty.
     * @extra Defer can also curry arguments passed in.
     * @example
     *
     *   (function(arg1) {
     *     // called when CPU becomes idle
     *   }).defer('arg1');     -> returns the function
     *
     ***/
    'defer': function() {
      this.delay.apply(this, [0].concat(Array.prototype.slice.call(arguments)));
      return this;
    },

     /***
     * @method cancel()
     * @returns Nothing
     * @short Cancels a function scheduled to be called with %delay%.
     * @extra Note: This method won't work when using certain other frameworks like Prototype, as they will retain their %delay% method.
     * @example
     *
     *   var f = (function() {
     *     alert('hay'); // Never called
     *   }); f.delay(500); f.cancel();
     *
     ***/
    'cancel': function() {
      return clearTimeout(this.timer);
    }
