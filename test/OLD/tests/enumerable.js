namespace('Object', function() {
  'use strict';

  var obj1 = {
    foo: 2,
    bar: 4,
    moo: 6,
    car: 6
  }

  var obj2 = {
   foo: { age: 11 },
   bar: { age: 22 },
   moo: { age: 33 },
   car: { age: 44 }
  }

  var deepObj2 = {
   foo: { user: {age: 11 } },
   bar: { user: {age: 22 } },
   moo: { user: {age: 33 } },
   car: { user: {age: 44 } }
  }

  var obj3 = testClone(obj1); obj3['blue'] = 4;
  var obj4 = testClone(obj2); obj4['blue'] = {age:11};
  var deepObj4 = testClone(deepObj2); deepObj4['blue'] = {user:{age:11}};

  method('reduce', function() {
    var fn = function(a, b) {
      return a * b;
    }
    var obj = {
      foo: 2,
      bar: 4,
      moo: 6
    }

    test(obj, [fn], 48, 'reduced value should be 48');
    test(obj, [fn, 10], 480, 'reduced value with initial should be 480');
    test(obj, [function() {}], undefined, 'reduced with anonymous function');
    test(obj, [function() {}, 10], undefined, 'reduced with anonymous function and initial');

    // These tests are making an assumption that objects
    // will be iterated over in a specific order. This is
    // incorrect, but simplifies the tests greatly, so going
    // with this for now.
    var count = 0;
    var expectedA = [2, -2];
    var expectedB = [4, 6];
    var expectedKeys = ['bar','moo'];
    var checkArgs = function(a, b, key, obj) {
      equal(a, expectedA[count], 'a should be equal');
      equal(b, expectedB[count], 'key should be equal');
      equal(key, expectedKeys[count], 'key should be equal');
      equal(obj, obj, 'object should remain same as original');
      count++;
      return a - b;
    }
    var result = run(obj, 'reduce', [checkArgs]);
    equal(count, 2, 'Should have ran twice');
    equal(result, -8, 'Result of subtracted should be -8');

    var count = 0;
    var expectedA = [18, 16, 12];
    var expectedB = [2, 4, 6];
    var expectedKeys = ['foo', 'bar','moo'];
    var checkArgs = function(a, b, key, obj) {
      equal(a, expectedA[count], 'a should be equal');
      equal(b, expectedB[count], 'key should be equal');
      equal(key, expectedKeys[count], 'key should be equal');
      equal(obj, obj, 'object should remain same as original');
      count++;
      return a - b;
    }
    var result = run(obj, 'reduce', [checkArgs, 18]);
    equal(count, 3, 'Should have ran twice');
    equal(result, 6, 'Result of subtracted should be -8');

    raisesError(function(){ run(obj, 'reduce', []) }, 'no function raises an error');

  });

});
