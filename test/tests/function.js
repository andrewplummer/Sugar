'use strict';

namespace('Function', function() {

  var args;

  function captureArgs() {
    var arr = Array.from(arguments);
    args.push(arr);
    return arr;
  }

  beforeEach(function() {
    args = [];
    clock.reset();
  });

  afterEach(function() {
    args = null;
  });

  describeInstance('memoize', function(memoize) {

    it('should perform basic caching', function() {
      var fn = memoize(captureArgs);
      assertArrayEqual(fn('a'), ['a']);
      assertArrayEqual(fn('a', 'b'), ['a']);
      assertArrayEqual(args, [['a']]);
    });

    it('should use hash function as the cache key', function() {
      var fn = memoize(captureArgs, function(i) {
        return i % 2 === 0;
      });
      assertArrayEqual(fn(1), [1]);
      assertArrayEqual(fn(2), [2]);
      assertArrayEqual(fn(3), [1]);
      assertArrayEqual(fn(4), [2]);
      assertArrayEqual(args, [[1],[2]]);
    });

    it('should receive same args and context', function() {
      memoize(function(a, b, c) {
        assertArrayEqual([this, a, b, c], [1,2,3,4]);
      }).call(1,2,3,4);
    });

    it('should be able to clear the cache', function() {
      var fn = memoize(captureArgs, function() { return true; });
      assertArrayEqual(fn('a'), ['a']);
      assertArrayEqual(fn('b'), ['a']);
      fn.cache.clear();
      assertArrayEqual(fn('b'), ['b']);
      assertArrayEqual(fn('c'), ['b']);
    });

    it('should pass same args and context to the hash function', function() {
      memoize(noop, function(a, b, c) {
        assertArrayEqual([this, a, b, c], [1,2,3,4]);
      }).call(1,2,3,4);
    });

  });

  describeInstance('once', function(once) {

    it('should only run once', function() {
      var fn = once(captureArgs);
      assertArrayEqual(fn('a'), ['a']);
      assertArrayEqual(fn('a', 'b'), ['a']);
      assertArrayEqual(args, [['a']]);
    });

    it('should receive same args and context', function() {
      once(function(a, b, c) {
        assertArrayEqual([this, a, b, c], [1,2,3,4]);
      }).call(1,2,3,4);
    });

  });

  describeInstance('debounce', function(debounce) {

    it('should perform basic debounce', function() {
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

    it('should be able to cancel', function() {
      var fn = debounce(captureArgs, 200);
      fn('a');
      fn('b');
      assertArrayEqual(args, []);
      fn.cancel();
      clock.tick(200);
      assertArrayEqual(args, []);
    });

    it('should be able to cancel after first execution', function() {
      var fn = debounce(captureArgs, 200);
      fn('a');
      clock.tick(200);
      assertArrayEqual(args, [['a']]);
      fn('b');
      fn.cancel();
      clock.tick(200);
      assertArrayEqual(args, [['a']]);
    });

    it('should retain the last return value when not immediate', function() {
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

    it('should default to 1ms', function() {
      var fn = debounce(captureArgs);
      fn('a');
      clock.tick(1);
      assertArrayEqual(args, [['a']]);
    });

    it('should allow immediate execution of the function', function() {
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

    it('should retain the last return value when immediate', function() {
      var fn = debounce(captureArgs, 200, true);
      assertArrayEqual(fn('a'), ['a']);
      assertArrayEqual(fn('b'), ['a']);
      assertArrayEqual(fn('c'), ['a']);
      clock.tick(200);
      assertArrayEqual(fn('d'), ['d']);
      assertArrayEqual(fn('e'), ['d']);
    });

    it('should handle irregular input', function() {
      assertError(function() { debounce() });
      assertError(function() { debounce(captureArgs, 0) });
      assertError(function() { debounce(captureArgs, 'str') });
      assertError(function() { debounce(captureArgs, null) });
      assertError(function() { debounce(captureArgs, NaN) });
    });

  });

  describeInstance('throttle', function(throttle) {

    describe('no args', function() {

      it('should default to 1ms', function() {
        var fn = throttle(captureArgs);
        fn('a');
        fn('b');
        assertArrayEqual(args, [['a']]);
        clock.tick(1);
        assertArrayEqual(args, [['a'], ['b']]);
      });

      it('should queue execution with default arguments', function() {
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

      it('should remain locked white executions still queued', function() {
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

      it('should return value from last completed execution', function() {
        var fn = throttle(captureArgs, 200);
        assertArrayEqual(fn('a'), ['a']);
        assertArrayEqual(fn('b'), ['a']);
        clock.tick(200);
        assertArrayEqual(fn('c'), ['b']);
        clock.tick(200);
        assertArrayEqual(fn('d'), ['c']);
      });

      it('should pass all arguments to execution', function() {
        var fn = throttle(captureArgs, 200);
        fn('a','b','c');
        clock.tick(200);
        assertArrayEqual(args, [['a','b','c']]);
      });

    });

    describe('limit', function() {

      it('should not queue beyond limit', function() {
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

      it('should retain the first value when called repeatedly', function() {
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

    describe('immediate', function() {

      it('should be immediate by default', function() {
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

      it('should continue firing immediately after timeout', function() {
        var fn = throttle(captureArgs, 200);
        fn('a');
        assertArrayEqual(args, [['a']]);
        clock.tick(200);
        fn('b');
        assertArrayEqual(args, [['a'], ['b']]);
      });

      it('should queue functions after first release', function() {
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

      it('should lock an immediate function with limit of 1', function() {
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

      it('should be able to defer execution', function() {
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

      it('should lock a deferred function with limit of 1', function() {
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

    describe('canceling', function() {

      it('should cancel second execution of an immediate function', function() {
        var fn = throttle(captureArgs, 200);
        fn('a');
        fn.cancel();
        fn('b');
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
      });

      it('should cancel first execution of deferred function', function() {
        var fn = throttle(captureArgs, 200, {
          immediate: false,
        });
        fn('a');
        fn.cancel();
        clock.tick(200);
        assertArrayEqual(args, []);
      });

      it('should cancel immediate function after being queued', function() {
        var fn = throttle(captureArgs, 200);
        fn('a');
        fn('b');
        fn.cancel();
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
      });

      it('should cancel deferred function after being queued', function() {
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

    describe('Invalid input', function() {

      it('should error on invalid duration', function() {
        assertError(function() { throttle(captureArgs, 0); });
        assertError(function() { throttle(captureArgs, -1); });
        assertError(function() { throttle(captureArgs, '5'); });
        assertError(function() { throttle(captureArgs, 1.5); });
        assertError(function() { throttle(captureArgs, NaN); });
      });

      it('should error on invalid limit', function() {
        assertError(function() { throttle(captureArgs, 200, { limit: 0 } ); });
        assertError(function() { throttle(captureArgs, 200, { limit: -1 } ); });
        assertError(function() { throttle(captureArgs, 200, { limit: '5' } ); });
        assertError(function() { throttle(captureArgs, 200, { limit: 1.5 } ); });
        assertError(function() { throttle(captureArgs, 200, { limit: NaN } ); });
      });

    });

    it('should handle irregular input', function() {
      assertError(function() { throttle() });
      assertError(function() { throttle(captureArgs, 'str') });
      assertError(function() { throttle(captureArgs, null) });
      assertError(function() { throttle(captureArgs, NaN) });
    });

  });

  describeInstance('setTimeout', function(setTimeout) {

    it('should set a timeout of 1 second', function() {
      setTimeout(captureArgs, 1000, 'a');
      assertArrayEqual(args, []);
      clock.tick(1000);
      assertArrayEqual(args, [['a']]);
      clock.tick(1000);
      assertArrayEqual(args, [['a']]);
    });

    it('should default to 0ms with no args', function() {
      setTimeout(captureArgs);
      assertArrayEqual(args, []);
      clock.tick(0);
      assertArrayEqual(args, [[]]);
    });

    it('should be cancelable', function() {
      var promise = setTimeout(captureArgs, 1000, 'a');
      assertArrayEqual(args, []);
      promise.cancel();
      clock.tick(1000);
      assertArrayEqual(args, []);
    });

    describe('promise behavior', function() {

      it('should return a promise', function() {
        assertInstanceOf(setTimeout(captureArgs, 1000), Promise);
      });

      it('should resolve the promise after execution', function() {
        return new Promise(function(resolve) {
          setTimeout(function() {}, 1000).then(function() {
            assertTrue(true);
            resolve();
          });
          clock.tick(1000);
        });
      });

      it('should reject the promise on error', function() {
        return new Promise(function(resolve) {
          setTimeout(function() {
            throw Error();
          }, 1000).catch(function() {
            assertTrue(true);
            resolve();
          });
          clock.tick(1000);
        });
      });

      it('should resolve the promise when canceled', function() {
        return new Promise(function(resolve) {
          var promise = setTimeout(function() {}, 1000);
          promise.then(function() {
            assertTrue(true);
            resolve();
          });
          promise.cancel();
        });
      });

      it('should set canceled property of false by default', function() {
        var promise = setTimeout(function() {}, 1000);
        assertFalse(promise.canceled);
      });

      it('should set canceled property to true when canceled', function() {
        return new Promise(function(resolve) {
          var promise = setTimeout(function() {}, 1000);
          promise.then(function() {
            assertTrue(promise.canceled);
            resolve();
          });
          promise.cancel();
        });
      });

      it('should not set canceled property to true when resolved', function() {
        return new Promise(function(resolve) {
          var promise = setTimeout(function() {}, 1000);
          promise.then(function() {
            assertFalse(promise.canceled);
            resolve();
          });
          clock.tick(1000);
        });
      });

      it('should not set canceled property to true when rejected', function() {
        return new Promise(function(resolve) {
          var promise = setTimeout(function() {
            throw new Error();
          }, 1000);
          promise.catch(function() {
            assertFalse(promise.canceled);
            resolve();
          });
          clock.tick(1000);
        });
      });

    });

    it('should handle irregular input', function() {
      assertError(function() { setTimeout() });
      assertError(function() { setTimeout(captureArgs, 'str') });
      assertError(function() { setTimeout(captureArgs, null) });
      assertError(function() { setTimeout(captureArgs, NaN) });
    });

  });

  describeInstance('setInterval', function(setInterval) {

    it('should set an interval of 1 second', function() {
      setInterval(captureArgs, 1000, 'a');
      assertArrayEqual(args, []);
      clock.tick(1000);
      assertArrayEqual(args, [['a']]);
      clock.tick(1000);
      assertArrayEqual(args, [['a'], ['a']]);
      clock.tick(1000);
      assertArrayEqual(args, [['a'], ['a'], ['a']]);
    });

    it('should default to 0ms with no args', function() {
      setInterval(captureArgs);
      assertArrayEqual(args, []);
      clock.tick(0);
      assertArrayEqual(args, [[]]);
    });

    it('should be cancelable', function() {
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

    describe('promise behavior', function() {

      it('should return a promise', function() {
        assertInstanceOf(setInterval(captureArgs, 1000), Promise);
      });

      it('should resolve the promise after execution', function() {
        return new Promise(function(resolve) {
          var resolved = false;
          setInterval(function() {}, 1000).then(function() {
            resolved = true;
          });
          // Need to use tickAsync here as .then is always
          // async and we're not expecting it to be called;
          clock.tickAsync(1000).then(function() {
            assertFalse(resolved);
            resolve();
          });
        });
      });

      it('should reject the promise on error', function() {
        return new Promise(function(resolve) {
          setInterval(function() {
            throw Error();
          }, 1000).catch(function() {
            assertTrue(true);
            resolve();
          });
          clock.tick(1000);
        });
      });

      it('should resolve the promise when canceled', function() {
        return new Promise(function(resolve) {
          var promise = setInterval(function() {}, 1000);
          promise.then(function() {
            assertTrue(true);
            resolve();
          });
          promise.cancel();
        });
      });

      it('should set canceled property of false by default', function() {
        var promise = setInterval(function() {}, 1000);
        assertFalse(promise.canceled);
      });

      it('should set canceled property to true when canceled', function() {
        return new Promise(function(resolve) {
          var promise = setInterval(function() {}, 1000);
          promise.then(function() {
            assertTrue(promise.canceled);
            resolve();
          });
          promise.cancel();
        });
      });

      it('should not set canceled property to true when rejected', function() {
        return new Promise(function(resolve) {
          var promise = setInterval(function() {
            throw new Error();
          }, 1000);
          promise.catch(function() {
            assertFalse(promise.canceled);
            resolve();
          });
          clock.tick(1000);
        });
      });

    });

    it('should handle irregular input', function() {
      assertError(function() { setInterval() });
      assertError(function() { setInterval(captureArgs, 'str') });
      assertError(function() { setInterval(captureArgs, null) });
      assertError(function() { setInterval(captureArgs, NaN) });
    });

    it('should handle issue #488', function() {
      var i = 0;
      var promise = setInterval(function() {
        if(++i >= 3) {
          promise.cancel();
        }
      }, 1000);
      clock.tick(5000);
      assertEqual(i, 3);
    });

  });
});
