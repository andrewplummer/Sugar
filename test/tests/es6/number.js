namespace('Number', function () {
  'use strict';

  method('Number.isNaN', function() {

    // Tests from https://github.com/ljharb/is-nan/blob/master/test.js
    equal(Number.isNaN(), false, 'undefined is not NaN');
    equal(Number.isNaN(null), false, 'null is not NaN');
    equal(Number.isNaN(false), false, 'false is not NaN');
    equal(Number.isNaN(true), false, 'true is not NaN');
    equal(Number.isNaN(0), false, 'positive zero is not NaN');
    equal(Number.isNaN(Infinity), false, 'Infinity is not NaN');
    equal(Number.isNaN(-Infinity), false, '-Infinity is not NaN');
    equal(Number.isNaN('foo'), false, 'string is not NaN');
    equal(Number.isNaN([]), false, 'array is not NaN');
    equal(Number.isNaN({}), false, 'object is not NaN');
    equal(Number.isNaN(function () {}), false, 'function is not NaN');
    equal(Number.isNaN('NaN'), false, 'string NaN is not NaN');

    var obj = { valueOf: function () { return NaN; } };
    equal(Number.isNaN(Number(obj)), true, 'object with valueOf of NaN, converted to Number, is NaN');
    equal(Number.isNaN(obj), false, 'object with valueOf of NaN is not NaN');

    equal(Number.isNaN(NaN), true, 'NaN responds');
    equal(Number.isNaN(new Number(NaN)), false, 'wrapped NaN does not respond');

  });

});
