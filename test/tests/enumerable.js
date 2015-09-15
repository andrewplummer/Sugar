package('Object', function() {
  "use strict";

  var obj1 = {
    foo: 3,
    bar: 4,
    moo: 5,
    car: 6
  }

  var obj2 = {
   foo: { age: 11 },
   bar: { age: 22 },
   moo: { age: 33 },
   car: { age: 44 }
  }

  var obj3 = testClone(obj1); obj3['blue'] = 4;
  var obj4 = testClone(obj2); obj4['blue'] = {age:11};

  method('any', function() {
    testStaticAndInstance(obj1, [function(key, value, o) {
      equal(typeof key, 'string', 'first argument is always the key');
      equal(value, obj1[key],     'second argument is always the value');
      equal(o, obj1,              'third argument is always the original object');
      equal(this, obj1,           '"this" is always the original object');
      return true;
    }], true, 'placeholder for callback arguments');
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], true, 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 3; }], false, 'key length is greater than 3');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 0; }], true, 'key length is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 0; }], true, 'value is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 5; }], true, 'value is greater than 5');
    testStaticAndInstance(obj1, [function(key, value) { return value > 6; }], false, 'value is greater than 6');
    testStaticAndInstance(obj1, [5], true,  'shortcut | 5');
    testStaticAndInstance(obj1, [7], false, 'shortcut | 7');
  });

  method('all', function() {
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], false, 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 3; }], false, 'key length is greater than 3');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 0; }], true, 'key length is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 0; }], true, 'value is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 5; }], false, 'value is greater than 5');
    testStaticAndInstance(obj1, [function(key, value) { return value > 6; }], false, 'value is greater than 6');
    testStaticAndInstance(obj1, [5], false,  'shortcut | 5');
    testStaticAndInstance(obj1, [7], false, 'shortcut | 7');
  });

  method('none', function() {
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], false, 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 3; }], true, 'key length is greater than 3');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 0; }], false, 'key length is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 0; }], false, 'value is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 5; }], false, 'value is greater than 5');
    testStaticAndInstance(obj1, [function(key, value) { return value > 6; }], true, 'value is greater than 6');
    testStaticAndInstance(obj1, [5], false,  'shortcut | 5');
    testStaticAndInstance(obj1, [7], true, 'shortcut | 7');
  });

  method('count', function() {
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], 1, 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 3; }], 0, 'key length is greater than 3');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 0; }], 4, 'key length is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 0; }], 4, 'value is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 5; }], 1, 'value is greater than 5');
    testStaticAndInstance(obj1, [function(key, value) { return value > 6; }], 0, 'value is greater than 6');
    testStaticAndInstance(obj1, [5], 1,  'shortcut | 5');
    testStaticAndInstance(obj1, [7], 0, 'shortcut | 7');
  });

  method('sum', function() {
    testStaticAndInstance(obj1, [], 18, 'no args is sum of values');
    testStaticAndInstance(obj1, [function(key, value) { return value; }], 18, 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key === 'foo' ? value : 0; }], 3, 'key is foo');
    testStaticAndInstance(obj2, ['age'], 110, 'accepts a string shortcut');
  });

  method('average', function() {
    testStaticAndInstance(obj1, [], 4.5, 'no args is average of values');
    testStaticAndInstance(obj1, [function(key, value) { return value; }], 4.5, 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key === 'foo' ? value : 0; }], .75, 'key is foo');
    testStaticAndInstance(obj2, ['age'], 27.5, 'accepts a string shortcut');
  });

  method('find', function() {
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], 'foo', 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 3; }], undefined, 'key length is greater than 3');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 0; }], 'foo', 'key length is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 0; }], 'foo', 'value is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 5; }], 'car', 'value is greater than 5');
    testStaticAndInstance(obj1, [function(key, value) { return value > 6; }], undefined, 'value is greater than 6');
    testStaticAndInstance(obj1, [5], 'moo',  'shortcut | 5');
    testStaticAndInstance(obj1, [7], undefined, 'shortcut | 7');
    testStaticAndInstance({foo:'bar'}, [/b/], 'foo', 'uses multi-match');
  });

  method('findAll', function() {
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], {foo:3}, 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 3; }], {}, 'key length is greater than 3');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 0; }], obj1, 'key length is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 0; }], obj1, 'value is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 5; }], {car:6}, 'value is greater than 5');
    testStaticAndInstance(obj1, [function(key, value) { return value > 6; }], {}, 'value is greater than 6');
    testStaticAndInstance(obj1, [5], {moo:5},  'shortcut | 5');
    testStaticAndInstance(obj1, [7], {}, 'shortcut | 7');
    testStaticAndInstance({foo:'bar',moo:'car'}, [/a/], {foo:'bar',moo:'car'}, 'uses multi-match');
  });

  method('min', function() {
    testStaticAndInstance(obj3, [], 'foo', 'no args is min of values');
    testStaticAndInstance(obj3, [function(key, value) { return value; }], 'foo', 'return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }], 'foo', 'return key.length');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }, true], {foo:3,bar:4,moo:5,car:6}, 'return key.length');
    testStaticAndInstance(obj3, [function(key, value) { return key.charCodeAt(0); }, true], {bar: 4,blue:4}, 'all | return the char code of first letter');
    testStaticAndInstance(obj4, ['age'], 'foo', 'accepts a string shortcut');
    testStaticAndInstance(obj4, ['age', true], {foo: {age:11},blue:{age:11}}, 'all | accepts a string shortcut');
  });

  method('max', function() {
    testStaticAndInstance(obj3, [], 'car', 'no args is first object');
    testStaticAndInstance(obj3, [function(key, value) { return value; }], 'car', 'return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }], 'blue', 'return key.length');
    testStaticAndInstance(obj3, [function(key, value) { return key.charCodeAt(0); }], 'moo', 'return the char code of first letter');
    testStaticAndInstance(obj4, ['age'], 'car', 'accepts a string shortcut');
    testStaticAndInstance(obj3, [function(key, value) { return value; }, true], {car:6}, 'all | return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }, true], {blue:4}, 'all | return key.length');
    testStaticAndInstance(obj3, [function(key, value) { return key.charCodeAt(0); }, true], {moo:5}, 'all | return the char code of first letter');
    testStaticAndInstance(obj4, ['age', true], {car:{age:44}}, 'all | accepts a string shortcut');
  });

  method('least', function() {
    testStaticAndInstance(obj3, [], 'foo', 'no args is least of values');
    testStaticAndInstance(obj3, [function(key, value) { return value; }], 'foo', 'return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }], 'blue', 'return key.length');
    testStaticAndInstance(obj4, ['age'], 'bar', 'accepts a string shortcut');
    testStaticAndInstance(obj3, [function(key, value) { return value; }, true], {foo:3,moo:5,car:6}, 'all | return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }, true], {blue:4}, 'all | return key.length');
    testStaticAndInstance(obj4, ['age', true], {bar: {age:22},moo:{age:33},car:{age:44}}, 'all | accepts a string shortcut');
  });

  method('most', function() {
    testStaticAndInstance(obj3, [], 'bar', 'no args is most of values');
    testStaticAndInstance(obj3, [function(key, value) { return value; }], 'bar', 'return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }], 'foo', 'return key.length');
    testStaticAndInstance(obj3, [function(key, value) { return key.charCodeAt(0); }], 'bar', 'return the char code of first letter');
    testStaticAndInstance(obj4, ['age'], 'foo', 'accepts a string shortcut');
    testStaticAndInstance(obj3, [function(key, value) { return value; }, true], {bar: 4,blue:4}, 'all | return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }, true], {foo:3,bar:4,moo:5,car:6}, 'all | return key.length');
    testStaticAndInstance(obj3, [function(key, value) { return key.charCodeAt(0); }, true], {bar: 4,blue:4}, 'all | return the char code of first letter');
    testStaticAndInstance(obj4, ['age', true], {foo: {age:11},blue:{age:11}}, 'all | accepts a string shortcut');
  });

  method('isEmpty', function() {
    testStaticAndInstance({}, [], true, 'object is empty');
    testStaticAndInstance({ broken: 'wear' }, [], false, 'object is not empty');
    testStaticAndInstance({ length: 0 }, [], false, 'simple object with length property is not empty');
    testStaticAndInstance({ foo: null }, [], false, 'null is still counted');
    testStaticAndInstance({ foo: undefined }, [], false, 'undefined is still counted');
    testStaticAndInstance({ foo: NaN }, [], false, 'undefined is still counted');
    testStaticAndInstance([], [], true, 'empty array is empty');
    testStaticAndInstance(null, [], true, 'null is empty');
    testStaticAndInstance(undefined, [], true, 'undefined is empty');
    testStaticAndInstance('', [], true, 'empty string is empty');
    testStaticAndInstance(new String(''), [], true, 'empty string object is empty');
    testStaticAndInstance('wasabi', [], false, 'non-empty string is not empty');
    testStaticAndInstance(new String('wasabi'), [], false, 'non-empty string object is not empty');
    testStaticAndInstance(NaN, [], true, 'NaN is empty');
    testStaticAndInstance(8, [], true, '8 is empty');
    testStaticAndInstance(new Number(8), [], true, '8 object is empty');
  });

  group('Enumerables on Object.prototype', function() {
    storeNativeState();
    Sugar.Object.extend(true);

    equal(({a:1,b:3,c:5}).sum(), 9, 'Object#sum');
    equal(({a:1,b:3,c:5}).average(), 3, 'Object#average');
    equal(({a:1,b:3,c:5}).min(), 'a', 'Object#min');
    equal(({a:1,b:3,c:5}).max(), 'c', 'Object#max');
    equal(({a:1,b:1,c:5}).min(null, true), {a:1,b:1}, 'Object#min (all)');
    equal(({a:1,b:5,c:5}).max(null, true), {b:5,c:5}, 'Object#max (all)');
    equal(({a:1,b:1,c:5}).least(), 'c', 'Object#least');
    equal(({a:1,b:2,c:2}).most(), 'b', 'Object#most');
    equal(({a:1,b:1,c:5}).least(null, true), {c:5}, 'Object#least (all)');
    equal(({a:1,b:2,c:2}).most(null, true), {b:2,c:2}, 'Object#most (all)');

    equal(({a:1,b:2,c:2}).any(1), true, 'Object#any');
    equal(({a:1,b:2,c:2}).all(1), false, 'Object#all');
    equal(({a:1,b:2,c:2}).none(5), true, 'Object#none');
    equal(({a:1,b:2,c:3}).count(2), 1, 'Object#count');
    equal(({a:1,b:2,c:3}).find(3), 'c', 'Object#find');
    equal(({a:1,b:2,c:3}).findAll(3), {c:3}, 'Object#findAll');

    equal(({a:'a',b:'b',c:'c'}).findAll(/[ac]/), {a:'a',c:'c'}, 'Object#findAll');
    equal(({}).isEmpty(), true, 'Object#isEmpty');
    equal(({a:1}).isEmpty(), false, 'Object#isEmpty');

    restoreNativeState();
  });

});

