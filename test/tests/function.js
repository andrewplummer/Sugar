'use strict';

namespace('Function', () => {

  var args;

  function captureArgs() {
    var arr = Array.from(arguments);
    args.push(arr);
    return arr;
  }

  beforeEach(() => {
    args = [];
    clock.reset();
  });

  afterEach(() => {
    args = null;
  });

  describeInstance('memoize', (memoize) => {

    it('should perform basic caching', () => {
      var fn = memoize(captureArgs);
      assertArrayEqual(fn('a'), ['a']);
      assertArrayEqual(fn('a', 'b'), ['a']);
      assertArrayEqual(args, [['a']]);
    });

    it('should use hash function as the cache key', () => {
      var fn = memoize(captureArgs, (i) => {
        return i % 2 === 0;
      });
      assertArrayEqual(fn(1), [1]);
      assertArrayEqual(fn(2), [2]);
      assertArrayEqual(fn(3), [1]);
      assertArrayEqual(fn(4), [2]);
      assertArrayEqual(args, [[1],[2]]);
    });

    it('should receive same args and context', () => {
      memoize(function(a, b, c) {
        assertArrayEqual([this, a, b, c], [1,2,3,4]);
      }).call(1,2,3,4);
    });

    it('should be able to clear the cache', () => {
      var fn = memoize(captureArgs, () => { return true; });
      assertArrayEqual(fn('a'), ['a']);
      assertArrayEqual(fn('b'), ['a']);
      fn.cache.clear();
      assertArrayEqual(fn('b'), ['b']);
      assertArrayEqual(fn('c'), ['b']);
    });

    it('should pass same args and context to the hash function', () => {
      memoize(noop, function(a, b, c) {
        assertArrayEqual([this, a, b, c], [1,2,3,4]);
      }).call(1,2,3,4);
    });

  });

  describeInstance('once', (once) => {

    it('should only run once', () => {
      var fn = once(captureArgs);
      assertArrayEqual(fn('a'), ['a']);
      assertArrayEqual(fn('a', 'b'), ['a']);
      assertArrayEqual(args, [['a']]);
    });

    it('should receive same args and context', () => {
      once(function(a, b, c) {
        assertArrayEqual([this, a, b, c], [1,2,3,4]);
      }).call(1,2,3,4);
    });

  });

  describeInstance('debounce', (debounce) => {

    it('should perform basic debounce', () => {
      var fn = debounce(captureArgs, 200);
      fn('a');
      fn('b');
      fn('c');
      fn('d');
      assertArrayEqual(args, []);
      clock.tick(200);
      assertArrayEqual(args, [['d']]);
      clock.tick(200);
      assertArrayEqual(args, [['d']]);
    });

    it('should be able to cancel', () => {
      var fn = debounce(captureArgs, 200);
      fn('a');
      fn('b');
      assertArrayEqual(args, []);
      fn.cancel();
      clock.tick(200);
      assertArrayEqual(args, []);
    });

    it('should be able to cancel after first execution', () => {
      var fn = debounce(captureArgs, 200);
      fn('a');
      clock.tick(200);
      assertArrayEqual(args, [['a']]);
      fn('b');
      fn.cancel();
      clock.tick(200);
      assertArrayEqual(args, [['a']]);
    });

    it('should retain the last return value when not immediate', () => {
      // Note this differs from throttle with limit 1
      var fn = debounce(captureArgs, 200);
      assertNull(fn('a'));
      assertNull(fn('b'));
      assertNull(fn('c'));
      clock.tick(200);
      assertArrayEqual(fn('d'), ['c']);
      clock.tick(200);
      assertArrayEqual(args, [['c'],['d']]);
    });

    it('should default to 1ms', () => {
      var fn = debounce(captureArgs);
      fn('a');
      clock.tick(1);
      assertArrayEqual(args, [['a']]);
    });

    it('should allow immediate execution of the function', () => {
      var fn = debounce(captureArgs, 200, true);
      fn('a');
      fn('b');
      fn('c');
      assertArrayEqual(args, [['a']]);
      clock.tick(200);
      assertArrayEqual(args, [['a'], ['c']]);
      fn('d');
      assertArrayEqual(args, [['a'], ['c'], ['d']]);
      clock.tick(200);
      assertArrayEqual(args, [['a'], ['c'], ['d']]);
    });

    it('should retain the last return value when immediate', () => {
      var fn = debounce(captureArgs, 200, true);
      assertArrayEqual(fn('a'), ['a']);
      assertArrayEqual(fn('b'), ['a']);
      assertArrayEqual(fn('c'), ['a']);
      clock.tick(200);
      assertArrayEqual(fn('d'), ['d']);
      assertArrayEqual(fn('e'), ['d']);
    });

    it('should handle irregular input', () => {
      assertError(() => { debounce() });
      assertError(() => { debounce(captureArgs, 0) });
      assertError(() => { debounce(captureArgs, 'str') });
      assertError(() => { debounce(captureArgs, null) });
      assertError(() => { debounce(captureArgs, NaN) });
    });

  });

  describeInstance('throttle', (throttle) => {

    describe('no args', () => {

      it('should default to 1ms', () => {
        var fn = throttle(captureArgs);
        fn('a');
        fn('b');
        assertArrayEqual(args, [['a']]);
        clock.tick(1);
        assertArrayEqual(args, [['a'], ['b']]);
      });

      it('should queue execution with default arguments', () => {
        var fn = throttle(captureArgs, 200);
        fn('a');
        fn('b');
        fn('c');
        assertArrayEqual(args, [['a']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'], ['b']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'], ['b'], ['c']]);
      });

      it('should remain locked white executions still queued', () => {
        var fn = throttle(captureArgs, 200);
        fn('a');
        fn('b');
        assertArrayEqual(args, [['a']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'], ['b']]);
        fn('c');
        assertArrayEqual(args, [['a'], ['b']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'], ['b'], ['c']]);
      });

      it('should return value from last completed execution', () => {
        var fn = throttle(captureArgs, 200);
        assertArrayEqual(fn('a'), ['a']);
        assertArrayEqual(fn('b'), ['a']);
        clock.tick(200);
        assertArrayEqual(fn('c'), ['b']);
        clock.tick(200);
        assertArrayEqual(fn('d'), ['c']);
      });

      it('should pass all arguments to execution', () => {
        var fn = throttle(captureArgs, 200);
        fn('a','b','c');
        clock.tick(200);
        assertArrayEqual(args, [['a','b','c']]);
      });

    });

    describe('limit', () => {

      it('should not queue beyond limit', () => {
        var fn = throttle(captureArgs, 200, {
          limit: 2
        });
        fn('a');
        fn('b');
        fn('c');
        fn('d');
        assertArrayEqual(args, [['a']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'],['b']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'],['b']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'],['b']]);
      });

      it('should retain the first value when called repeatedly', () => {
        // Note this differs from debounce
        var fn = throttle(captureArgs, 200, {
          limit: 1
        });
        fn('a');
        fn('b');
        fn('c');
        assertArrayEqual(args, [['a']]);
        assertArrayEqual(fn('d'), ['a']);
        clock.tick(200);
        assertArrayEqual(fn('e'), ['e']);
        clock.tick(200);
        assertArrayEqual(args, [['a'], ['e']]);
      });

    });

    describe('immediate', () => {

      it('should be immediate by default', () => {
        var fn = throttle(captureArgs, 200);
        assertArrayEqual(args, []);
        fn('a');
        assertArrayEqual(args, [['a']]);
        fn('b');
        assertArrayEqual(args, [['a']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'], ['b']]);
        fn('c');
        assertArrayEqual(args, [['a'], ['b']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'], ['b'], ['c']]);
      });

      it('should continue firing immediately after timeout', () => {
        var fn = throttle(captureArgs, 200);
        fn('a');
        assertArrayEqual(args, [['a']]);
        clock.tick(200);
        fn('b');
        assertArrayEqual(args, [['a'], ['b']]);
      });

      it('should queue functions after first release', () => {
        var fn = throttle(captureArgs, 200);
        fn('a');
        assertArrayEqual(args, [['a']]);
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
        fn('b');
        fn('c');
        assertArrayEqual(args, [['a'], ['b']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'], ['b'], ['c']]);
      });

      it('should lock an immediate function with limit of 1', () => {
        var fn = throttle(captureArgs, 200, {
          limit: 1,
        });
        fn('a');
        assertArrayEqual(args, [['a']]);
        fn('b');
        assertArrayEqual(args, [['a']]);
        fn('c');
        assertArrayEqual(args, [['a']]);
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
      });

      it('should be able to defer execution', () => {
        var fn = throttle(captureArgs, 200, {
          immediate: false
        });
        fn('a');
        assertArrayEqual(args, []);
        fn('b');
        assertArrayEqual(args, []);
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'],['b']]);
      });

      it('should lock a deferred function with limit of 1', () => {
        var fn = throttle(captureArgs, 200, {
          limit: 1,
          immediate: false,
        });
        fn('a');
        assertArrayEqual(args, []);
        fn('b');
        assertArrayEqual(args, []);
        fn('c');
        assertArrayEqual(args, []);
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
      });

    });

    describe('canceling', () => {

      it('should cancel second execution of an immediate function', () => {
        var fn = throttle(captureArgs, 200);
        fn('a');
        fn.cancel();
        fn('b');
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
      });

      it('should cancel first execution of deferred function', () => {
        var fn = throttle(captureArgs, 200, {
          immediate: false,
        });
        fn('a');
        fn.cancel();
        clock.tick(200);
        assertArrayEqual(args, []);
      });

      it('should cancel immediate function after being queued', () => {
        var fn = throttle(captureArgs, 200);
        fn('a');
        fn('b');
        fn.cancel();
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
      });

      it('should cancel deferred function after being queued', () => {
        var fn = throttle(captureArgs, 200, {
          immediate: false,
        });
        fn('a');
        fn('b');
        clock.tick(200);
        fn.cancel();
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
      });

    });

    describe('Invalid input', () => {

      it('should error on invalid duration', () => {
        assertError(() => { throttle(captureArgs, 0); });
        assertError(() => { throttle(captureArgs, -1); });
        assertError(() => { throttle(captureArgs, '5'); });
        assertError(() => { throttle(captureArgs, 1.5); });
        assertError(() => { throttle(captureArgs, NaN); });
      });

      it('should error on invalid limit', () => {
        assertError(() => { throttle(captureArgs, 200, { limit: 0 } ); });
        assertError(() => { throttle(captureArgs, 200, { limit: -1 } ); });
        assertError(() => { throttle(captureArgs, 200, { limit: '5' } ); });
        assertError(() => { throttle(captureArgs, 200, { limit: 1.5 } ); });
        assertError(() => { throttle(captureArgs, 200, { limit: NaN } ); });
      });

    });

    it('should handle irregular input', () => {
      assertError(() => { throttle() });
      assertError(() => { throttle(captureArgs, 'str') });
      assertError(() => { throttle(captureArgs, null) });
      assertError(() => { throttle(captureArgs, NaN) });
    });

  });

  describeInstance('setTimeout', (setTimeout) => {

    it('should set a timeout of 1 second', () => {
      setTimeout(captureArgs, 1000, 'a');
      assertArrayEqual(args, []);
      clock.tick(1000);
      assertArrayEqual(args, [['a']]);
      clock.tick(1000);
      assertArrayEqual(args, [['a']]);
    });

    it('should default to 0ms with no args', () => {
      setTimeout(captureArgs);
      assertArrayEqual(args, []);
      clock.tick(0);
      assertArrayEqual(args, [[]]);
    });

    it('should be cancelable', () => {
      var promise = setTimeout(captureArgs, 1000, 'a');
      assertArrayEqual(args, []);
      promise.cancel();
      clock.tick(1000);
      assertArrayEqual(args, []);
    });

    describe('promise behavior', () => {

      it('should return a promise', () => {
        assertInstanceOf(setTimeout(captureArgs, 1000), Promise);
      });

      it('should resolve the promise after execution', () => {
        return new Promise((resolve) => {
          setTimeout(() => {}, 1000).then(() => {
            assertTrue(true);
            resolve();
          });
          clock.tick(1000);
        });
      });

      it('should reject the promise on error', () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            throw Error();
          }, 1000).catch(() => {
            assertTrue(true);
            resolve();
          });
          clock.tick(1000);
        });
      });

      it('should resolve the promise when canceled', () => {
        return new Promise((resolve) => {
          var promise = setTimeout(() => {}, 1000);
          promise.then(() => {
            assertTrue(true);
            resolve();
          });
          promise.cancel();
        });
      });

      it('should set canceled property of false by default', () => {
        var promise = setTimeout(() => {}, 1000);
        assertFalse(promise.canceled);
      });

      it('should set canceled property to true when canceled', () => {
        return new Promise((resolve) => {
          var promise = setTimeout(() => {}, 1000);
          promise.then(() => {
            assertTrue(promise.canceled);
            resolve();
          });
          promise.cancel();
        });
      });

      it('should not set canceled property to true when resolved', () => {
        return new Promise((resolve) => {
          var promise = setTimeout(() => {}, 1000);
          promise.then(() => {
            assertFalse(promise.canceled);
            resolve();
          });
          clock.tick(1000);
        });
      });

      it('should not set canceled property to true when rejected', () => {
        return new Promise((resolve) => {
          var promise = setTimeout(() => {
            throw new Error();
          }, 1000);
          promise.catch(() => {
            assertFalse(promise.canceled);
            resolve();
          });
          clock.tick(1000);
        });
      });

    });

    it('should handle irregular input', () => {
      assertError(() => { setTimeout() });
      assertError(() => { setTimeout(captureArgs, 'str') });
      assertError(() => { setTimeout(captureArgs, null) });
      assertError(() => { setTimeout(captureArgs, NaN) });
    });

  });

  describeInstance('setInterval', (setInterval) => {

    it('should set an interval of 1 second', () => {
      setInterval(captureArgs, 1000, 'a');
      assertArrayEqual(args, []);
      clock.tick(1000);
      assertArrayEqual(args, [['a']]);
      clock.tick(1000);
      assertArrayEqual(args, [['a'], ['a']]);
      clock.tick(1000);
      assertArrayEqual(args, [['a'], ['a'], ['a']]);
    });

    it('should default to 0ms with no args', () => {
      setInterval(captureArgs);
      assertArrayEqual(args, []);
      clock.tick(0);
      assertArrayEqual(args, [[]]);
    });

    it('should be cancelable', () => {
      var promise = setInterval(captureArgs, 1000, 'a');
      assertArrayEqual(args, []);
      clock.tick(1000);
      assertArrayEqual(args, [['a']]);
      promise.cancel();
      clock.tick(1000);
      assertArrayEqual(args, [['a']]);
      clock.tick(1000);
      assertArrayEqual(args, [['a']]);
    });

    describe('promise behavior', () => {

      it('should return a promise', () => {
        assertInstanceOf(setInterval(captureArgs, 1000), Promise);
      });

      it('should resolve the promise after execution', () => {
        return new Promise((resolve) => {
          var resolved = false;
          setInterval(() => {}, 1000).then(() => {
            resolved = true;
          });
          // Need to use tickAsync here as .then is always
          // async and we're not expecting it to be called;
          clock.tickAsync(1000).then(() => {
            assertFalse(resolved);
            resolve();
          });
        });
      });

      it('should reject the promise on error', () => {
        return new Promise((resolve) => {
          setInterval(() => {
            throw Error();
          }, 1000).catch(() => {
            assertTrue(true);
            resolve();
          });
          clock.tick(1000);
        });
      });

      it('should resolve the promise when canceled', () => {
        return new Promise((resolve) => {
          var promise = setInterval(() => {}, 1000);
          promise.then(() => {
            assertTrue(true);
            resolve();
          });
          promise.cancel();
        });
      });

      it('should set canceled property of false by default', () => {
        var promise = setInterval(() => {}, 1000);
        assertFalse(promise.canceled);
      });

      it('should set canceled property to true when canceled', () => {
        return new Promise((resolve) => {
          var promise = setInterval(() => {}, 1000);
          promise.then(() => {
            assertTrue(promise.canceled);
            resolve();
          });
          promise.cancel();
        });
      });

      it('should not set canceled property to true when rejected', () => {
        return new Promise((resolve) => {
          var promise = setInterval(() => {
            throw new Error();
          }, 1000);
          promise.catch(() => {
            assertFalse(promise.canceled);
            resolve();
          });
          clock.tick(1000);
        });
      });

    });

    it('should handle irregular input', () => {
      assertError(() => { setInterval() });
      assertError(() => { setInterval(captureArgs, 'str') });
      assertError(() => { setInterval(captureArgs, null) });
      assertError(() => { setInterval(captureArgs, NaN) });
    });

    it('should handle issue #488', () => {
      var i = 0;
      var promise = setInterval(() => {
        if(++i >= 3) {
          promise.cancel();
        }
      }, 1000);
      clock.tick(5000);
      assertEqual(i, 3);
    });

  });

  describeInstance('partial', (partial) => {

    var _ = partial.replace;

    it('should perform basic currying of arguments', () => {
      var fn = partial(captureArgs, 'a');
      assertArrayEqual(fn('b'), ['a', 'b']);
      assertArrayEqual(fn('b', 'c', 'd'), ['a', 'b', 'c', 'd']);
    });

    it('should allow a placeholder that is replaced', () => {
      var fn = partial(captureArgs, _, 'b');
      assertArrayEqual(fn('a'), ['a', 'b']);
    });

    it('should be able to curry past the placeholder', () => {
      var fn = partial(captureArgs, 'a', _, 'c');
      assertArrayEqual(fn('b', 'd'), ['a', 'b', 'c', 'd']);
    });

    it('should not accept undefined or null as a placeholder', () => {
      var fn = partial(captureArgs, undefined, null);
      assertArrayEqual(fn('a', 'b'), [undefined, null, 'a', 'b']);
    });

    it('should not have issues with 0', () => {
      var fn = partial(captureArgs, 0);
      assertArrayEqual(fn(0), [0, 0]);
    });

    it('should not have issues with passing non-primitive input', () => {
      var fn = partial(captureArgs, [1], {}, captureArgs, NaN);
      assertArrayEqual(fn(), [[1], {}, captureArgs, NaN]);
    });

    it('should not have issues with invoking with non-primitive input', () => {
      var fn = partial(captureArgs);
      assertArrayEqual(fn([1], {}, captureArgs, NaN), [[1], {}, captureArgs, NaN]);
    });

    it('should work with no arguments', () => {
      var fn = partial(captureArgs);
      assertArrayEqual(fn('a', 'b'), ['a', 'b']);
    });

    it('should error on invalid input', () => {
      assertError(() => { partial(); });
      assertError(() => { partial(null); });
      assertError(() => { partial(undefined); });
    });

    describe('ported tests', () => {

      function build() {
        return partial.apply(null, [captureArgs].concat(
          Array.prototype.slice.call(arguments)
        ));
      }

      function assert(result, expected) {
        assertArrayEqual(result, expected);
      }

      it('should handle various cases', () => {

        assert(build(null, 'a')('b'), [null, 'a', 'b']);
        assert(build('a', null)('b'), ['a', null, 'b']);
        assert(build(null, null, 'a')(), [null, null, 'a']);
        assert(build('a', null, null)(), ['a', null, null]);
        assert(build(null, null, null)(), [null, null, null]);
        assert(build(null, null, null)('a','b','c'), [null, null, null, 'a', 'b', 'c']);

        assert(build(_, 'a')('b'), ['b', 'a']);
        assert(build('a', _)('b'), ['a', 'b']);
        assert(build(_, _, 'a')('a', 'b'), ['a', 'b', 'a']);
        assert(build('a', _, _)('a', 'b'), ['a', 'a', 'b']);
        assert(build(_, _, _)('a', 'b', 'c'), ['a', 'b', 'c']);
        assert(build(_, _, _)('a', 'b'), ['a', 'b', undefined]);
        assert(build(_, _, _)('a','b','c','d','e'), ['a', 'b', 'c', 'd', 'e']);

        assert(build(null, _, null)(), [null, undefined, null]);
        assert(build(null, _, null)('a'), [null, 'a', null]);
        assert(build(null, _, null)('a', 'b'), [null, 'a', null, 'b']);
        assert(build(null, _, null)('a', 'b', 'c'), [null, 'a', null, 'b', 'c']);

        assert(build(_, null, _)(), [undefined, null, undefined]);
        assert(build(_, null, _)('a'), ['a', null, undefined]);
        assert(build(_, null, _)('a', 'b'), ['a', null, 'b']);
        assert(build(_, null, _)('a', 'b', 'c'), ['a', null, 'b', 'c']);

        assert(build('a')(undefined), ['a', undefined]);
        assert(build('a')(undefined, 'b'), ['a', undefined, 'b']);
        assert(build('a')('b', undefined), ['a', 'b', undefined]);

        assert(build(_)(undefined), [undefined]);
        assert(build(_)(undefined, 'b'), [undefined, 'b']);
        assert(build(_)('b', undefined), ['b', undefined]);

        assert(build('a')(null), ['a', null]);
        assert(build('a')(null, 'b'), ['a', null, 'b']);
        assert(build('a')('b', null), ['a', 'b', null]);

        assert(build(_)(null), [null]);
        assert(build(_)(null, 'b'), [null, 'b']);
        assert(build(_)('b', null), ['b', null]);

        assert(build([undefined])('a'), [[undefined], 'a']);
      });

      it('should handle more complex cases', () => {
        assert(build([undefined])('a'), [[undefined], 'a']);
        assert(build([undefined], _)('a'), [[undefined], 'a']);
        assert(build(_, [undefined])('a'), ['a', [undefined]]);

        assert(build([null])('a'), [[null], 'a']);
        assert(build([null], _)('a'), [[null], 'a']);
        assert(build(_, [null])('a'), ['a', [null]]);
      });

      it('should handle Underscore cases', () => {

        var obj = {name: 'moe'};
        var func = function() {
          return this.name + ' ' + Array.prototype.slice.call(arguments).join(' ');
        };

        obj.func = partial(func, 'a', 'b');
        assertEqual(obj.func('c', 'd'), 'moe a b c d');

        obj.func = partial(func, _, 'b', _, 'd');
        assertEqual(obj.func('a', 'c'), 'moe a b c d');

        func = partial(function() {
          return arguments.length;
        }, _, 'b', _, 'd');
        assertEqual(func('a', 'c', 'e'), 5);
        assertEqual(func('a'), 4);

        func = partial(function() {
          return typeof arguments[2];
        }, _, 'b', _, 'd');
        assertEqual(func('a'), 'undefined');

        // passes context
        var widget;

        function MyWidget(name, options) {
          this.name = name;
          this.options = options;
        }
        MyWidget.prototype.get = function() {
          return this.name;
        };

        var MyWidgetWithCoolOpts = partial(MyWidget, _, {a: 1});
        widget = new MyWidgetWithCoolOpts('foo');
        assertInstanceOf(widget, MyWidget);
        assertEqual(widget.get(), 'foo');
        assertObjectEqual(widget.options, {a: 1});

        // explicit return value in constructor
        function MyWidget2() {
          return {foo:'bar'};
        }
        var MyFilledWidget = partial(MyWidget2, _, {a: 1});
        widget = new MyFilledWidget();
        assertFalse(widget instanceof MyWidget);
        assertEqual(widget.foo, 'bar');

      });

      it('should handle Lodash cases', () => {

        var fn;
        var object;
        var a, b;

        function identity(n) {
          return n;
        }

        assertEqual(partial(identity, 'a')(), 'a');

        fn = (a, b) => {
          return [a, b];
        };

        // creates a function that can be invoked with additional arguments
        assertArrayEqual(partial(fn, 'a')('b'), ['a', 'b']);

        fn = function() { return arguments.length; };
        // works when there are no partially applied arguments and the created function is invoked without additional arguments
        assertEqual(partial(fn)(), 0);

        // works when there are no partially applied arguments and the created function is invoked with additional arguments
        assertEqual(partial(identity)('a'), 'a', '');


        fn = function() {
          return Array.prototype.slice.call(arguments);
        };
        assertArrayEqual(partial(fn, _, 'b', _)('a', 'c'), ['a','b','c']);
        assertArrayEqual(partial(fn, _, 'b', _)('a'), ['a','b',undefined]);
        assertArrayEqual(partial(fn, _, 'b', _)(), [undefined,'b',undefined]);
        assertArrayEqual(partial(fn, _, 'b', _)('a','c','d'), ['a','b','c','d']);


        /* eslint no-unused-vars: "off" */
        fn = (a, b, c) => {};

        // creates a function with a length of 0
        assertEqual(partial(fn, 'a').length, 0);

        object = {};
        function Foo(value) {
          return value && object;
        }

        // ensure new partialed is an instance of func
        assertInstanceOf(new (partial(Foo)), Foo);

        // ensure new partialed return value
        assertObjectEqual(new (partial(Foo))(true), object);

        function greet(greeting, name) {
          return greeting + ' ' + name;
        }
        assertEqual(partial(greet, 'hi')('fred'), 'hi fred');
        assertEqual(partial(partial(greet, 'hi'), 'barney')(), 'hi barney');
        assertEqual(partial(partial(greet, 'hi'), 'pebbles')(), 'hi pebbles');

        fn = function() {
          var result = [this.a];
          Array.prototype.push.apply(result, arguments);
          return result;
        };
        object = {
          'a': 1,
          'fn': fn,
        };

        a = fn.bind(object);
        b = partial(a, 2);

        // should work with combinations of bound and partial functions
        assertArrayEqual(b(3), [1,2,3]);

        a = partial(fn, 2);
        b = a.bind(object);

        // should work with combinations of partial and bound functions
        assertArrayEqual(b(3), [1,2,3]);


        // Function#bind is spec so our hands are tied here

        fn = function() {
          return Array.prototype.slice.call(arguments);
        };
        object = { 'fn': fn };

        a = fn.bind(object, _, 2);
        b = partial(a, 1, _, 4);

        // should not work when placeholder is passed to bind
        assertArrayEqual(b(3, 5), [_, 2, 1, 3, 4, 5]);

        a = partial(fn, _, 2);
        b = a.bind(object, 1, _, 4);

        // should not work when placeholder is passed to bind
        assertArrayEqual(b(3, 5), [1, 2, _, 4, 3, 5]);

      });

    });

  });

  describeInstance('lock', (lock) => {

    describe('returns undefined', () => {

      function getThreeNoLength(args) {
        var arr = [];
        for (var i = 0; i < 3; i++) {
          arr[i] = args[i];
        }
        return arr;
      }

      function takesNone() {
        return getThreeNoLength(arguments);
      }

      function takesOne(a) {
        return getThreeNoLength(arguments);
      }

      function takesTwo(a, b) {
        return getThreeNoLength(arguments);
      }

      describe('default behavior', () => {

        it('should take 0 arguments', () => {
          var fn = lock(takesNone);
          assertArrayEqual(fn(),      [undefined, undefined, undefined]);
          assertArrayEqual(fn(1),     [undefined, undefined, undefined]);
          assertArrayEqual(fn(1,2,3), [undefined, undefined, undefined]);
        });

        it('should take 1 argument', () => {
          var fn = lock(takesOne);
          assertArrayEqual(fn(),      [undefined, undefined, undefined]);
          assertArrayEqual(fn(1),     [1, undefined, undefined]);
          assertArrayEqual(fn(1,2,3), [1, undefined, undefined]);
        });

        it('should take 2 arguments', () => {
          var fn = lock(takesTwo);
          assertArrayEqual(fn(),      [undefined, undefined, undefined]);
          assertArrayEqual(fn(1),     [1, undefined, undefined]);
          assertArrayEqual(fn(1,2,3), [1, 2, undefined]);
        });

      });

      describe('passing an arg', () => {

        it('should take 0 arguments', () => {
          var fn = lock(takesNone, 1);
          assertArrayEqual(fn(),      [undefined, undefined, undefined]);
          assertArrayEqual(fn(1),     [1, undefined, undefined]);
          assertArrayEqual(fn(1,2,3), [1, undefined, undefined]);
        });

        it('should take 1 argument', () => {
          var fn = lock(takesOne, 1);
          assertArrayEqual(fn(),      [undefined, undefined, undefined]);
          assertArrayEqual(fn(1),     [1, undefined, undefined]);
          assertArrayEqual(fn(1,2,3), [1, undefined, undefined]);
        });

        it('should take 2 arguments', () => {
          var fn = lock(takesTwo, 1);
          assertArrayEqual(fn(),      [undefined, undefined, undefined]);
          assertArrayEqual(fn(1),     [1, undefined, undefined]);
          assertArrayEqual(fn(1,2,3), [1, undefined, undefined]);
        });

      });

    });

    describe('returns varied', () => {

      // Get all arguments by length as forcing 3 could mask
      // real number called with .apply
      function getAllWithLength(args) {
        var arr = [];
        for (var i = 0; i < args.length; i++) {
          arr[i] = args[i];
        }
        return arr;
      }

      function takesNoneReturnsVaried() {
        return getAllWithLength(arguments);
      }

      function takesTwoReturnsVaried(a, b) {
        return getAllWithLength(arguments);
      }

      describe('default behavior', () => {

        it('should take 0 arguments', () => {
          var fn = lock(takesNoneReturnsVaried);
          assertArrayEqual(fn(),      []);
          assertArrayEqual(fn(1),     []);
          assertArrayEqual(fn(1,2,3), []);
        });

        it('should take 2 arguments', () => {
          var fn = lock(takesTwoReturnsVaried);
          assertArrayEqual(fn(),      []);
          assertArrayEqual(fn(1),     [1]);
          assertArrayEqual(fn(1,2,3), [1,2]);
        });

      });

      describe('passing an arg', () => {

        it('should take 0 arguments', () => {
          var fn = lock(takesNoneReturnsVaried, 1);
          assertArrayEqual(fn(),      []);
          assertArrayEqual(fn(1),     [1]);
          assertArrayEqual(fn(1,2,3), [1]);
        });

        it('should take 2 arguments', () => {
          var fn = lock(takesTwoReturnsVaried, 1);
          assertArrayEqual(fn(),      [],  'takes 2 returns varied | manual 1 | 0 args');
          assertArrayEqual(fn(1),     [1], 'takes 2 returns varied | manual 1 | 1 arg');
          assertArrayEqual(fn(1,2,3), [1], 'takes 2 returns varied | manual 1 | 3 args');
        });

      });

    });

  });

  describeInstance('filter', (filter) => {

    var captureFiltered = filter(captureArgs, (n) => {
      return n > 3;
    });

    it('should filter out calls below 3', () => {
      captureFiltered(0);
      captureFiltered(1);
      captureFiltered(2);
      captureFiltered(3);
      captureFiltered(4);
      assertArrayEqual(args, [[4]]);
    });

    it('should not return a value when filtered', () => {
      assertUndefined(captureFiltered(0));
    });

    it('should return when not filtered', () => {
      assertArrayEqual(captureFiltered(4), [4]);
    });

    it('should filter when falsy', () => {
      filter(captureArgs, () => {
        return null;
      })(1);
      filter(captureArgs, () => {
        return undefined;
      })(2);
      filter(captureArgs, () => {
        return '';
      })(3);
      filter(captureArgs, () => {
        return NaN;
      })(4);
      filter(captureArgs, () => {
        return 'a';
      })(5);
      filter(captureArgs, () => {
        return 8;
      })(6);
      filter(captureArgs, () => {
        return [];
      })(7);
      assertArrayEqual(args, [[5], [6], [7]]);
    });

    it('should pass all args to the function', () => {
      captureFiltered(4, 'a','b','c','d');
      assertArrayEqual(args, [[4, 'a','b','c','d']]);
    });

    it('should pass all args to filter function', () => {
      (filter(captureArgs, (a, b, c, d) => {
        assertArrayEqual([a,b,c,d], ['a','b','c','d']);
      }))('a','b','c','d');
    });

    it('should pass context to the function', () => {
      filter(function() {
        assertEqual(this, 'a');
      }, () => {
        return true;
      }).call('a');
    });

    it('should pass context to filter function', () => {
      filter(captureArgs, function() {
        assertEqual(this, 'a');
      }).call('a');
    });

    it('should work when typeof number', () => {
      var fn = filter(captureArgs, (n) => {
        return typeof n === 'number';
      });
      fn(0)
      fn(1)
      fn('1')
      fn(null)
      fn(NaN)
      fn(true)
      fn(false)
      assertArrayEqual(args, [[0],[1],[NaN]]);
    });

    it('should work with Number', () => {
      var fn = filter(captureArgs, Number);
      fn(0)
      fn(1)
      fn('1')
      fn(null)
      fn(NaN)
      fn(true)
      fn(false)
      assertArrayEqual(args, [[1],['1'],[true]]);
    });

    it('should error on invalid input', () => {
      assertError(() => { filter() });
      assertError(() => { filter(null) });
      assertError(() => { filter(captureArgs) });
      assertError(() => { filter(captureArgs, null) });
    });

  });

  describeInstance('callAfter', (callAfter) => {

    it('should capture after returning true', () => {
      var fn = callAfter(captureArgs, (arg) => {
        return arg === true;
      });
      fn(false, 1);
      fn(false, 2);
      fn(true, 3);
      fn(false, 4);
      fn(true, 5);
      assertArrayEqual(args, [[true, 3], [false, 4], [true, 5]]);
    });

    it('should return values only after locked', () => {
      var fn = callAfter(captureArgs, (arg) => {
        return arg === true;
      });
      assertUndefined(fn(false, 1));
      assertUndefined(fn(false, 2));
      assertArrayEqual(fn(true, 3), [true, 3]);
      assertArrayEqual(fn(false, 4), [false, 4]);
      assertArrayEqual(fn(true, 5), [true, 5]);
    });

    it('should work with a number as a shortcut for iterations', () => {
      var fn = callAfter(captureArgs, 3);
      fn('a');
      fn('b');
      fn('c');
      fn('d');
      assertArrayEqual(args, [['c'], ['d']]);
    });

    it('should pass all args to the function', () => {
      var fn = callAfter(captureArgs, (arg) => {
        return arg === true;
      });
      assertArrayEqual(fn(true, 1, 2, 3, 4, 5), [true, 1, 2, 3, 4, 5]);
    });

    it('should pass context to the function', () => {
      var fn = callAfter(function() {
        assertEqual(this, 'a');
      }, (arg) => {
        return true;
      }).call('a');
    });

    it('should pass all args to the filter function', () => {
      (callAfter(captureArgs, (a, b, c, d) => {
        assertArrayEqual([a,b,c,d], ['a','b','c','d']);
      }))('a','b','c','d');
    });

    it('should pass context to the filter function', () => {
      callAfter(captureArgs, function() {
        assertEqual(this, 'a');
      }).call('a');
    });

    it('should error on invalid input', () => {
      assertError(() => { callAfter() });
      assertError(() => { callAfter(null) });
      assertError(() => { callAfter(captureArgs) });
      assertError(() => { callAfter(captureArgs, null) });
      assertError(() => { callAfter(captureArgs, '1') });
      assertError(() => { callAfter(captureArgs, -1) });
      assertError(() => { callAfter(captureArgs, Infinity) });
      assertError(() => { callAfter(captureArgs, -Infinity) });
    });

  });

  describeInstance('callUntil', (callUntil) => {

    it('should capture until returning true', () => {
      var fn = callUntil(captureArgs, (arg) => {
        return arg === true;
      });
      fn(false, 1);
      fn(false, 2);
      fn(true, 3);
      fn(false, 4);
      fn(true, 5);
      assertArrayEqual(args, [[false, 1], [false, 2]]);
    });

    it('should return values only until locked', () => {
      var fn = callUntil(captureArgs, (arg) => {
        return arg === true;
      });
      assertArrayEqual(fn(false, 1), [false, 1]);
      assertArrayEqual(fn(false, 2), [false, 2]);
      assertUndefined(fn(true, 3));
      assertUndefined(fn(false, 4));
      assertUndefined(fn(true, 5));
    });

    it('should work with a number as a shortcut for iterations', () => {
      var fn = callUntil(captureArgs, 3);
      fn('a');
      fn('b');
      fn('c');
      fn('d');
      assertArrayEqual(args, [['a'], ['b']]);
    });

    it('should pass all args to the function', () => {
      var fn = callUntil(captureArgs, (arg) => {
        return arg === false;
      });
      assertArrayEqual(fn(true, 1, 2, 3, 4, 5), [true, 1, 2, 3, 4, 5]);
    });

    it('should pass context to the function', () => {
      var fn = callUntil(function() {
        assertEqual(this, 'a');
      }, (arg) => {
        return false;
      }).call('a');
    });

    it('should pass all args to the filter function', () => {
      (callUntil(captureArgs, (a, b, c, d) => {
        assertArrayEqual([a,b,c,d], ['a','b','c','d']);
      }))('a','b','c','d');
    });

    it('should pass context to the filter function', () => {
      callUntil(captureArgs, function() {
        assertEqual(this, 'a');
      }).call('a');
    });

    it('should error on invalid input', () => {
      assertError(() => { callUntil() });
      assertError(() => { callUntil(null) });
      assertError(() => { callUntil(captureArgs) });
      assertError(() => { callUntil(captureArgs, null) });
      assertError(() => { callUntil(captureArgs, '1') });
      assertError(() => { callUntil(captureArgs, -1) });
      assertError(() => { callUntil(captureArgs, Infinity) });
      assertError(() => { callUntil(captureArgs, -Infinity) });
    });

  });
});
