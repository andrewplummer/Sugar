'use strict';

namespace('Function', function() {

  let args;

  function captureArgs() {
    var arr = Array.from(arguments);
    args.push(arr);
    return arr;
  }

  beforeEach(function() {
    args = [];
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
      const fn = debounce(captureArgs, 200);
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
      const fn = debounce(captureArgs, 200);
      fn('a');
      fn('b');
      assertArrayEqual(args, []);
      fn.cancel();
      clock.tick(200);
      assertArrayEqual(args, []);
    });

    it('should be able to cancel after first execution', function() {
      const fn = debounce(captureArgs, 200);
      fn('a');
      clock.tick(200);
      assertArrayEqual(args, [['a']]);
      fn('b');
      fn.cancel();
      clock.tick(200);
      assertArrayEqual(args, [['a']]);
    });

    it('should retain the last value when called repeatedly', function() {
      // Note this differs from throttle with limit 1
      const fn = debounce(captureArgs, 200, {
        limit: 1
      });
      fn('a');
      fn('b');
      fn('c');
      clock.tick(200);
      assertArrayEqual(fn('d'), ['c']);
      clock.tick(200);
      assertArrayEqual(args, [['c'],['d']]);
    });


  });

  describeInstance('throttle', function(throttle) {

    describe('No Args', function() {

      it('should queue execution with default arguments', function() {
        const fn = throttle(captureArgs, 200);
        fn('a');
        fn('b');
        assertArrayEqual(args, []);
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'],['b']]);
      });

      it('should return value from last completed execution', function() {
        const fn = throttle(captureArgs, 200);
        assertEqual(fn('a'), null);
        clock.tick(200);
        assertArrayEqual(fn('b'), ['a']);
        clock.tick(200);
        assertArrayEqual(fn('c'), ['b']);
        clock.tick(200);
        assertArrayEqual(args, [['a'],['b'],['c']]);
      });

      it('should pass all arguments to execution', function() {
        const fn = throttle(captureArgs, 200);
        fn('a','b','c');
        clock.tick(200);
        assertArrayEqual(args, [['a','b','c']]);
      });

    });

    describe('Limit option', function() {

      it('should not queue beyond limit', function() {
        const fn = throttle(captureArgs, 200, {
          limit: 2
        });
        fn('a');
        fn('b');
        fn('c');
        fn('d');
        assertArrayEqual(args, []);
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'],['b']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'],['b']]);
      });

      it('should retain the first value when called repeatedly', function() {
        // Note this differs from debounce
        const fn = throttle(captureArgs, 200, {
          limit: 1
        });
        fn('a');
        fn('b');
        fn('c');
        clock.tick(200);
        assertArrayEqual(fn('d'), ['a']);
        clock.tick(200);
        assertArrayEqual(args, [['a'],['d']]);
      });

    });

    describe('Immediate Option', function() {

      it('should allow firing immediately', function() {
        const fn = throttle(captureArgs, 200, {
          immediate: true
        });
        fn('a');
        fn('b');
        assertArrayEqual(args, [['a']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'],['b']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'],['b']]);
      });

      it('should continue firing immediately after timeout', function() {
        const fn = throttle(captureArgs, 200, {
          immediate: true
        });
        fn('a');
        assertArrayEqual(args, [['a']]);
        clock.tick(200);
        fn('b');
        assertArrayEqual(args, [['a'],['b']]);
      });

      it('should queue functions after first release', function() {
        const fn = throttle(captureArgs, 200, {
          immediate: true
        });
        fn('a');
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
        fn('b');
        fn('c');
        assertArrayEqual(args, [['a'],['b']]);
        clock.tick(200);
        assertArrayEqual(args, [['a'],['b'],['c']]);
      });

      it('should lock an immediate function with limit of 1', function() {
        const fn = throttle(captureArgs, 200, {
          limit: 1,
          immediate: true
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

    });

    describe('Canceling', function() {

      it('should cancel a lazy function', function() {
        const fn = throttle(captureArgs, 200);
        fn('a');
        fn.cancel();
        clock.tick(200);
        assertArrayEqual(args, []);
      });

      it('should cancel a lazy function after first execution', function() {
        const fn = throttle(captureArgs, 200);
        fn('a');
        fn('b');
        clock.tick(200);
        fn.cancel();
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
      });

      it('should cancel an immediate function', function() {
        const fn = throttle(captureArgs, 200, {
          immediate: true
        });
        fn('a');
        fn('b');
        assertArrayEqual(args, [['a']]);
        fn.cancel();
        clock.tick(200);
        assertArrayEqual(args, [['a']]);
      });

      it('should cancel immediate function after first execution', function() {
        const fn = throttle(captureArgs, 200, {
          immediate: true
        });
        fn('a');
        fn('b');
        fn('c');
        clock.tick(200);
        fn.cancel();
        clock.tick(200);
        assertArrayEqual(args, [['a'],['b']]);
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

  });

});
