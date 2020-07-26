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
      assertArrayEqual(fn('a'), ['a']);;
      assertArrayEqual(fn('b'), ['a']);;
      assertArrayEqual(fn('c'), ['a']);;
      clock.tick(200);
      assertArrayEqual(fn('d'), ['d']);;
      assertArrayEqual(fn('e'), ['d']);;
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

  describeInstance('delay', function(delay) {

    var fn;

    beforeEach(function() {
      fn = function() {
        return captureArgs.apply(this, arguments);
      };
    });

    it('should delay execution of the function for 1s', function() {
      delay(fn, 1000, 'a');
      assertArrayEqual(args, []);
      clock.tick(1000);
      assertArrayEqual(args, [['a']]);
      clock.tick(1000);
      assertArrayEqual(args, [['a']]);
    });

    it('should default to 0ms with no args', function() {
      delay(fn);
      assertArrayEqual(args, []);
      clock.tick(100);
      assertArrayEqual(args, [[]]);
    });

    it('should be cancelable', function() {
      delay(fn, 1000, 'a');
      assertArrayEqual(args, []);
      fn.cancel();
      clock.tick(1000);
      assertArrayEqual(args, []);
      assertArrayEqual(fn.timers, []);
    });

    it('should handle irregular input', function() {
      assertError(function() { delay() });
      assertError(function() { delay(fn, 'str') });
      assertError(function() { delay(fn, null) });
      assertError(function() { delay(fn, NaN) });
    });

  });

});
