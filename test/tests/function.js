'use strict';

namespace('Function', function() {

  function assertMemoized(memoize, hashFn, runCount, expected) {
    assertFunctionIterated(noop, expected, function(fn) {
      fn = memoize(fn, hashFn);
      for (let i = 0; i < runCount; i++) {
        fn(i);
      }
    });
  }

  instanceMethod('memoize', function(memoize) {
    assertMemoized(memoize, null, 10, 10);
    assertMemoized(memoize, noop, 10, 1);

    assertMemoized(memoize, function(i) {
      return i % 2 === 0;
    }, 10, 2);

    // Memoized function receives same args and context.
    memoize(function(a, b, c) {
      assertArrayEqual([this, a, b, c], [1,2,3,4]);
    }).call(1,2,3,4);

    // Hash function receives same args and context.
    memoize(noop, function(a, b, c) {
      assertArrayEqual([this, a, b, c], [1,2,3,4]);
    }).call(1,2,3,4);
  });

});
