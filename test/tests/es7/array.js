namespace('Array', function () {
  'use strict';

  method('includes', function() {

    // Tests stolen from https://github.com/ljharb/array-includes

    var includes = Array.prototype.includes;

    var thrower          = { valueOf: function () { throw new RangeError('whoa'); } };
    var numberish        = { valueOf: function () { return 2; } };
    var sparseish        = { length: 5, 0: 'a', 1: 'b' };
    var overfullarrayish = { length: 2, 0: 'a', 1: 'b', 2: 'c' };

    equal([1, 2, 3].includes(1), true, '[1, 2, 3] includes 1');
    equal([1, 2, 3].includes(4), false, '[1, 2, 3] does not include 4');
    equal([NaN].includes(NaN), true, '[NaN] includes NaN');

    equal(Array(1).includes(), true, 'Array(1) includes undefined');

    equal(includes.call(sparseish, 'a'), true, 'sparse array-like object includes "a"');
    equal(includes.call(sparseish, 'c'), false, 'sparse array-like object does not include "c"');

    equal(includes.call(overfullarrayish, 'b'), true, 'sparse array-like object includes "b"');
    equal(includes.call(overfullarrayish, 'c'), false, 'sparse array-like object does not include "c"');

    equal([1].includes(1, NaN), true, 'NaN fromIndex -> 0 fromIndex');
    equal(['a', 'b', 'c'].includes('a', numberish), false, 'does not find "a" with object fromIndex coercing to 2');
    equal(['a', 'b', 'c'].includes('a', '2'), false, 'does not find "a" with string fromIndex coercing to 2');
    equal(['a', 'b', 'c'].includes('c', numberish), true, 'finds "c" with object fromIndex coercing to 2');
    equal(['a', 'b', 'c'].includes('c', '2'), true, 'finds "c" with string fromIndex coercing to 2');

    equal([1].includes(1, 2), false, 'array of length 1 is not searched if fromIndex is > 1');
    equal([1].includes(1, 1), false, 'array of length 1 is not searched if fromIndex is >= 1');
    equal([1].includes(1, 1.1), false, 'array of length 1 is not searched if fromIndex is 1.1');
    equal([1].includes(1, Infinity), false, 'array of length 1 is not searched if fromIndex is Infinity');

    equal([1, 3].includes(1, -4), true, 'computed length would be negative; fromIndex is thus 0');
    equal([1, 3].includes(3, -4), true, 'computed length would be negative; fromIndex is thus 0');
    equal([1, 3].includes(1, -Infinity), true, 'computed length would be negative; fromIndex is thus 0');

    equal([12, 13].includes(13, -1), true, 'finds -1st item with -1 fromIndex');
    equal([12, 13].includes(12, -1), false, 'does not find -2nd item with -1 fromIndex');
    equal([12, 13].includes(13, -2), true, 'finds -2nd item with -2 fromIndex');

    equal(includes.call(sparseish, 'b', -4), true, 'finds -4th item with -4 fromIndex');
    equal(includes.call(sparseish, 'a', -4), false, 'does not find -5th item with -4 fromIndex');
    equal(includes.call(sparseish, 'a', -5), true, 'finds -5th item with -5 fromIndex');

    equal(Array.prototype.includes.call('abc', 'c'), true, 'can call with string');

    raisesError(function() {
      Array.prototype.includes.call([0], 0, thrower);
    }, 'fromIndex conversion throws', RangeError);

    raisesError(function() {
      Array.prototype.includes.call({length: thrower, 0: true}, true);
    }, 'fromIndex conversion throws', RangeError);

    equal([0].includes(0),   true,  '[0] includes 0');
    equal([-0].includes(-0), true,  '[0] includes -0');

  });

});
