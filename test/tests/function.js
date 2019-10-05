'use strict';

namespace('Function', function() {

  function createCounter() {
    let n = 0;
    return function() {
      return ++n;
    }
  }

  function assertMemoized(memoizeFn, hashFn, runCount, expected) {
    const fn = memoizeFn(createCounter(), hashFn);
    let result = null;
    for (let i = 0; i < runCount; i++) {
      result = fn(i);
    }
    assertEqual(result, expected);
  }

  describeInstance('memoize', function(memoize) {

    it('should perform basic caching', () => {
      assertMemoized(memoize, null, 10, 10);
      assertMemoized(memoize, noop, 10, 1);
      assertMemoized(memoize, function(i) {
        return i % 2 === 0;
      }, 10, 2);

    });

    it('should receive same args and context', () => {
      memoize(function(a, b, c) {
        assertArrayEqual([this, a, b, c], [1,2,3,4]);
      }).call(1,2,3,4);
    });

    it('should pass same args and context to the hash function', () => {
      memoize(noop, function(a, b, c) {
        assertArrayEqual([this, a, b, c], [1,2,3,4]);
      }).call(1,2,3,4);
    });

  });

  describeInstance('debounce', function(debounce) {

    it('should perform basic debounce', () => {
      const fn = debounce(createCounter(), 200);
      assertEqual(fn(), null);
      assertEqual(fn(), null);
      clock.tick(100);
      assertEqual(fn(), null);
      clock.tick(200);
      assertEqual(fn(), 1);
      clock.tick(400);
      assertEqual(fn(), 2);
    });

    it('should be able to cancel', () => {
      const fn = debounce(createCounter(), 200);
      clock.tick(100);
      fn.cancel();
      clock.tick(200);
      assertEqual(fn(), null);
    });

  });

});
