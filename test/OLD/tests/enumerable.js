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

  method('sum', function() {
    test(obj1, [], 18, 'no args is sum of values');
    test(obj1, [function(val, key) { return val; }], 18, 'should sum values');
    test(obj1, [function(val, key) { return key === 'foo' ? 0 : val; }], 16, 'without foo');
    test(obj2, ['age'], 110, 'accepts a string shortcut');
    test(deepObj2, ['user.age'], 110, 'accepts a deep string shortcut');
    test([{age:2},{age:3}], ['age'], 5, 'called on arrays should still work');
  });

  method('average', function() {
    test(obj1, [], 4.5, 'no args is average of values');
    test(obj1, [function(val, key) { return val; }], 4.5, 'should average values');
    test(obj1, [function(val, key) { return key === 'foo' ? 0 : val; }], 4, 'without foo');
    test(obj2, ['age'], 27.5, 'accepts a string shortcut');
    test(deepObj2, ['user.age'], 27.5, 'accepts a deep string shortcut');
    test([{age:2},{age:4}], ['age'], 3, 'called on arrays should still work');
  });

  method('median', function() {
    test(obj1, [], 5, 'no args is average of values');
    test(obj1, [function(val, key) { return val; }], 5, 'should average values');
    test(obj1, [function(val, key) { return key === 'moo' ? 0 : val; }], 3, 'without moo');
    test(obj2, ['age'], 27.5, 'accepts a string shortcut');
    test(deepObj2, ['user.age'], 27.5, 'accepts a deep string shortcut');
    test([{age:2},{age:2},{age:4}], ['age'], 2, 'called on arrays should still work');
  });

  method('min', function() {
    test(obj3, [], 'foo', 'no args is min of values');
    test(obj3, [function(val, key) { return val; }], 'foo', 'return value');
    test(obj3, [function(val, key) { return key.length; }], 'foo', 'return key.length');
    test(obj3, [true, function(val, key) { return key.length; }], {foo:2,bar:4,moo:6,car:6}, 'return key.length');
    test(obj3, [true, function(val, key) { return key.charCodeAt(0); }], {bar: 4,blue:4}, 'all | return the char code of first letter');
    test(obj4, ['age'], 'foo', 'accepts a string shortcut');
    test(obj4, [true, 'age'], {foo: {age:11},blue:{age:11}}, 'all | accepts a string shortcut');
    test(deepObj2, ['user.age'], 'foo', 'accepts a deep string shortcut');

    test([{age:2},{age:4}], ['age'], 0, 'called on arrays returns index');
    test([{age:2},{age:2}], [true, 'age'], {'0':{age:2},'1':{age:2}}, 'all | called on arrays returns object');
  });

  method('max', function() {
    test(obj3, [], 'moo', 'no args is first object');
    test(obj3, [function(val, key) { return val; }], 'moo', 'return value');
    test(obj3, [function(val, key) { return key.length; }], 'blue', 'return key.length');
    test(obj3, [function(val, key) { return key.charCodeAt(0); }], 'moo', 'return the char code of first letter');
    test(obj4, ['age'], 'car', 'accepts a string shortcut');
    test(obj3, [true, function(val, key) { return val; }], {moo:6,car:6}, 'all | return value');
    test(obj3, [true, function(val, key) { return key.length; }], {blue:4}, 'all | return key.length');
    test(obj3, [true, function(val, key) { return key.charCodeAt(0); }], {moo:6}, 'all | return the char code of first letter');
    test(obj4, [true, 'age'], {car:{age:44}}, 'all | accepts a string shortcut');
    test(deepObj2, ['user.age'], 'car', 'accepts a deep string shortcut');

    test([{age:2},{age:4}], ['age'], 1, 'called on arrays returns index');
    test([{age:2},{age:4}], [true, 'age'], {'1':{age:4}}, 'all | called on arrays returns object');
  });

  method('count', function() {
    test(obj1, [function(val, key) { return key == 'foo'; }], 1, 'key is foo');
    test(obj1, [function(val, key) { return key.length > 3; }], 0, 'key length is greater than 3');
    test(obj1, [function(val, key) { return key.length > 0; }], 4, 'key length is greater than 0');
    test(obj1, [function(val, key) { return val > 0; }], 4, 'value is greater than 0');
    test(obj1, [function(val, key) { return val > 5; }], 2, 'value is greater than 5');
    test(obj1, [function(val, key) { return val > 6; }], 0, 'value is greater than 6');
    test(obj1, [2], 1,  'shortcut | 2');
    test(obj1, [7], 0, 'shortcut | 7');
  });

  method('none', function() {
    test(obj1, [function(val, key) { return key == 'foo'; }], false, 'key is foo');
    test(obj1, [function(val, key) { return key.length > 3; }], true, 'key length is greater than 3');
    test(obj1, [function(val, key) { return key.length > 0; }], false, 'key length is greater than 0');
    test(obj1, [function(val, key) { return val > 0; }], false, 'value is greater than 0');
    test(obj1, [function(val, key) { return val > 5; }], false, 'value is greater than 5');
    test(obj1, [function(val, key) { return val > 6; }], true, 'value is greater than 6');
    test(obj1, [2], false,  'shortcut | 2');
    test(obj1, [7], true, 'shortcut | 7');
  });

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
