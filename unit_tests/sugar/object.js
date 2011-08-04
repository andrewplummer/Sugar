test('Object', function () {

  var count,result;
  var Person = function() {};
  var p = new Person();

  equals(Object.isObject({}), true, 'Object#isObject | {}');
  equals(Object.isObject(new Object({})), true, 'Object#isObject | new Object()');
  equals(Object.isObject([]), false, 'Object#isObject | []');
  equals(Object.isObject(new Array(1,2,3)), false, 'Object#isObject | new Array(1,2,3)');
  equals(Object.isObject(new RegExp()), false, 'Object#isObject | new RegExp()');
  equals(Object.isObject(new Date()), false, 'Object#isObject | new Date()');
  equals(Object.isObject(function() {}), false, 'Object#isObject | function() {}');
  equals(Object.isObject(1), false, 'Object#isObject | 1');
  equals(Object.isObject('wasabi'), false, 'Object#isObject | "wasabi"');
  equals(Object.isObject(null), false, 'Object#isObject | null');
  equals(Object.isObject(undefined), false, 'Object#isObject | undefined');
  equals(Object.isObject(NaN), false, 'Object#isObject | NaN');
  equals(Object.isObject(), false, 'Object#isObject | blank');
  equals(Object.isObject(false), false, 'Object#isObject | false');
  equals(Object.isObject(true), false, 'Object#isObject | true');
  equals(Object.isObject(p), false, 'Object#isObject | {}');

  equals(Object.isArray({}), false, 'Object#isArray | {}');
  equals(Object.isArray([]), true, 'Object#isArray | []');
  equals(Object.isArray(new Array(1,2,3)), true, 'Object#isArray | new Array(1,2,3)');
  equals(Object.isArray(new RegExp()), false, 'Object#isArray | new RegExp()');
  equals(Object.isArray(new Date()), false, 'Object#isArray | new Date()');
  equals(Object.isArray(function() {}), false, 'Object#isArray | function() {}');
  equals(Object.isArray(1), false, 'Object#isArray | 1');
  equals(Object.isArray('wasabi'), false, 'Object#isArray | "wasabi"');
  equals(Object.isArray(null), false, 'Object#isArray | null');
  equals(Object.isArray(undefined), false, 'Object#isArray | undefined');
  equals(Object.isArray(NaN), false, 'Object#isArray | NaN');
  equals(Object.isArray(), false, 'Object#isArray | blank');
  equals(Object.isArray(false), false, 'Object#isArray | false');
  equals(Object.isArray(true), false, 'Object#isArray | true');

  equals(Object.isBoolean({}), false, 'Object#isBoolean | {}');
  equals(Object.isBoolean([]), false, 'Object#isBoolean | []');
  equals(Object.isBoolean(new RegExp()), false, 'Object#isBoolean | new RegExp()');
  equals(Object.isBoolean(new Date()), false, 'Object#isBoolean | new Date()');
  equals(Object.isBoolean(function() {}), false, 'Object#isBoolean | function() {}');
  equals(Object.isBoolean(1), false, 'Object#isBoolean | 1');
  equals(Object.isBoolean('wasabi'), false, 'Object#isBoolean | "wasabi"');
  equals(Object.isBoolean(null), false, 'Object#isBoolean | null');
  equals(Object.isBoolean(undefined), false, 'Object#isBoolean | undefined');
  equals(Object.isBoolean(NaN), false, 'Object#isBoolean | NaN');
  equals(Object.isBoolean(), false, 'Object#isBoolean | blank');
  equals(Object.isBoolean(false), true, 'Object#isBoolean | false');
  equals(Object.isBoolean(true), true, 'Object#isBoolean | true');

  equals(Object.isDate({}), false, 'Object#isDate | {}');
  equals(Object.isDate([]), false, 'Object#isDate | []');
  equals(Object.isDate(new RegExp()), false, 'Object#isDate | new RegExp()');
  equals(Object.isDate(new Date()), true, 'Object#isDate | new Date()');
  equals(Object.isDate(function() {}), false, 'Object#isDate | function() {}');
  equals(Object.isDate(1), false, 'Object#isDate | 1');
  equals(Object.isDate('wasabi'), false, 'Object#isDate | "wasabi"');
  equals(Object.isDate(null), false, 'Object#isDate | null');
  equals(Object.isDate(undefined), false, 'Object#isDate | undefined');
  equals(Object.isDate(NaN), false, 'Object#isDate | NaN');
  equals(Object.isDate(), false, 'Object#isDate | blank');
  equals(Object.isDate(false), false, 'Object#isDate | false');
  equals(Object.isDate(true), false, 'Object#isDate | true');

  equals(Object.isFunction({}), false, 'Object#isFunction | {}');
  equals(Object.isFunction([]), false, 'Object#isFunction | []');
  equals(Object.isFunction(new RegExp()), false, 'Object#isFunction | new RegExp()');
  equals(Object.isFunction(new Date()), false, 'Object#isFunction | new Date()');
  equals(Object.isFunction(function() {}), true, 'Object#isFunction | function() {}');
  equals(Object.isFunction(new Function()), true, 'Object#isFunction | new Function()');
  equals(Object.isFunction(1), false, 'Object#isFunction | 1');
  equals(Object.isFunction('wasabi'), false, 'Object#isFunction | "wasabi"');
  equals(Object.isFunction(null), false, 'Object#isFunction | null');
  equals(Object.isFunction(undefined), false, 'Object#isFunction | undefined');
  equals(Object.isFunction(NaN), false, 'Object#isFunction | NaN');
  equals(Object.isFunction(), false, 'Object#isFunction | blank');
  equals(Object.isFunction(false), false, 'Object#isFunction | false');
  equals(Object.isFunction(true), false, 'Object#isFunction | true');

  equals(Object.isNumber({}), false, 'Object#isNumber | {}');
  equals(Object.isNumber([]), false, 'Object#isNumber | []');
  equals(Object.isNumber(new RegExp()), false, 'Object#isNumber | new RegExp()');
  equals(Object.isNumber(new Date()), false, 'Object#isNumber | new Date()');
  equals(Object.isNumber(function() {}), false, 'Object#isNumber | function() {}');
  equals(Object.isNumber(new Function()), false, 'Object#isNumber | new Function()');
  equals(Object.isNumber(1), true, 'Object#isNumber | 1');
  equals(Object.isNumber(0), true, 'Object#isNumber | 0');
  equals(Object.isNumber(-1), true, 'Object#isNumber | -1');
  equals(Object.isNumber(new Number('3')), true, 'Object#isNumber | new Number("3")');
  equals(Object.isNumber('wasabi'), false, 'Object#isNumber | "wasabi"');
  equals(Object.isNumber(null), false, 'Object#isNumber | null');
  equals(Object.isNumber(undefined), false, 'Object#isNumber | undefined');
  equals(Object.isNumber(NaN), true, 'Object#isNumber | NaN');
  equals(Object.isNumber(), false, 'Object#isNumber | blank');
  equals(Object.isNumber(false), false, 'Object#isNumber | false');
  equals(Object.isNumber(true), false, 'Object#isNumber | true');

  equals(Object.isString({}), false, 'Object#isString | {}');
  equals(Object.isString([]), false, 'Object#isString | []');
  equals(Object.isString(new RegExp()), false, 'Object#isString | new RegExp()');
  equals(Object.isString(new Date()), false, 'Object#isString | new Date()');
  equals(Object.isString(function() {}), false, 'Object#isString | function() {}');
  equals(Object.isString(new Function()), false, 'Object#isString | new Function()');
  equals(Object.isString(1), false, 'Object#isString | 1');
  equals(Object.isString('wasabi'), true, 'Object#isString | "wasabi"');
  equals(Object.isString(new String('wasabi')), true, 'Object#isString | new String("wasabi")');
  equals(Object.isString(null), false, 'Object#isString | null');
  equals(Object.isString(undefined), false, 'Object#isString | undefined');
  equals(Object.isString(NaN), false, 'Object#isString | NaN');
  equals(Object.isString(), false, 'Object#isString | blank');
  equals(Object.isString(false), false, 'Object#isString | false');
  equals(Object.isString(true), false, 'Object#isString | true');

  equals(Object.isRegExp({}), false, 'Object#isRegExp | {}');
  equals(Object.isRegExp([]), false, 'Object#isRegExp | []');
  equals(Object.isRegExp(new RegExp()), true, 'Object#isRegExp | new RegExp()');
  equals(Object.isRegExp(/afda/), true, 'Object#isRegExp | /afda/');
  equals(Object.isRegExp(new Date()), false, 'Object#isRegExp | new Date()');
  equals(Object.isRegExp(function() {}), false, 'Object#isRegExp | function() {}');
  equals(Object.isRegExp(new Function()), false, 'Object#isRegExp | new Function()');
  equals(Object.isRegExp(1), false, 'Object#isRegExp | 1');
  equals(Object.isRegExp('wasabi'), false, 'Object#isRegExp | "wasabi"');
  equals(Object.isRegExp(null), false, 'Object#isRegExp | null');
  equals(Object.isRegExp(undefined), false, 'Object#isRegExp | undefined');
  equals(Object.isRegExp(NaN), false, 'Object#isRegExp | NaN');
  equals(Object.isRegExp(), false, 'Object#isRegExp | blank');
  equals(Object.isRegExp(false), false, 'Object#isRegExp | false');
  equals(Object.isRegExp(true), false, 'Object#isRegExp | true');


  equals(({}).keys, undefined, 'Object | native objects are not wrapped by default');
  same(Object.extended(), Object.extended({}), 'Object#create | null argument same as empty object');

  var keys,values;
  var d = new Date();
  var obj = Object.extended({
    number: 3,
    person: 'jim',
    date: d
  });


  keys = ['number','person','date'];
  values = [3,'jim',d];
  same(obj.keys(), keys, "Object#keys | returns object's keys", true);
  count = 0;
  obj.keys(function(key) {
    equal(key, keys[count], 'Object#keys | accepts a block');
    count++;
  });

  equal(count, 3, 'Object#keys | accepts a block | iterated properly');

  same(Object.extended().keys(), [], 'Object#keys | empty object', true);
  same(Object.keys(Object.extended()), [], 'Object#keys | empty object', true);

  keys = ['number','person','date'];
  values = [3,'jim',d];
  same(Object.keys(obj), keys, "Object.keys | returns object's keys", true);
  count = 0;
  Object.keys(obj, function(key) {
    equal(key, keys[count], 'Object.keys | accepts a block');
    count++;
  });
  equal(count, 3, 'Object.keys | accepts a block | iterated properly');



  var strippedValues;

  strippedValues = obj.values().remove(function(m) { return typeof m == 'function'; });
  sameWithException(strippedValues, values, { prototype: values }, "Object#values | returns object's values", true);
  count = 0;
  obj.values(function(value) {
    equal(value, values[count], 'Object#values | accepts a block');
    count++;
  });

  equalsWithException(count, 3, { prototype: 0 }, 'Object#values | accepts a block | iterated properly');

  strippedValues = Object.values(obj).remove(function(m) { return typeof m == 'function'; });
  sameWithException(strippedValues, values, { prototype: values }, "Object.values | returns object's values", true);
  count = 0;
  Object.values(obj, function(value) {
    equal(value, values[count], 'Object.values | accepts a block');
    count++;
  });
  equalsWithException(count, 3, { prototype: 0 }, 'Object.values | accepts a block | iterated properly');

  strippedValues = Object.extended().values().remove(function(m) { return typeof m == 'function'; });
  sameWithException(strippedValues, [], { prototype: [] }, 'Object#values | empty object', true);

  strippedValues = Object.values(Object.extended()).remove(function(m) { return typeof m == 'function'; });
  sameWithException(strippedValues, [], { prototype: [] }, 'Object#values | empty object', true);




  count = 0;
  result = obj.each(function(key, value, o) {
    equalsWithException(key, keys[count], { mootools: values[count] }, 'Object#each | accepts a block | key is first param');
    equalsWithException(value, values[count], { mootools: keys[count] }, 'Object#each | accepts a block | value is second param');
    same(o, obj, 'Object#each | accepts a block | object is third param');
    count++;
  });
  equal(count, 3, 'Object#each | accepts a block | iterated properly');
  equalsWithException(result, obj, { mootools: undefined }, 'Object#each | accepts a block | result should equal object passed in');


  count = 0;
  result = Object.each(obj, function(key, value, o) {
    equalsWithException(key, keys[count], { mootools: values[count] }, 'Object.each | accepts a block');
    equalsWithException(value, values[count], { mootools: keys[count] }, 'Object.each | accepts a block');
    same(o, obj, 'Object.each | accepts a block | object is third param');
    count++;
  });
  equal(count, 3, 'Object.each | accepts a block | iterated properly');
  equalsWithException(result, obj, { mootools: undefined }, 'Object.each | accepts a block | result should equal object passed in');


  same(Object.merge({ foo: 'bar' }, { broken: 'wear' }), { foo: 'bar', broken: 'wear' }, 'Object.merge | basic');
  same(Object.merge({ foo: 'bar' }, { broken: 'wear' }, { jumpy: 'jump' }, { fire: 'breath'}), { foo: 'bar', broken: 'wear', jumpy: 'jump', fire: 'breath' }, 'Object.merge | merge 3');
  same(Object.merge({ foo: 'bar' }, 'aha'), { foo: 'bar', 0: 'a', 1: 'h', 2: 'a'  }, 'Object.merge | merge string');
  same(Object.merge({ foo: 'bar' }, null), { foo: 'bar' }, 'Object.merge | merge null');
  same(Object.merge({}, {}, {}), {}, 'Object.merge | merge multi empty');


  sameWithException(
    Object.merge({ foo: 'bar' }, 8),
    { foo: 'bar' },
    { mootools: (function() { var s = new Number(8); s.foo = 'bar'; return s; })() },
    'Object.merge | merge number');


  sameWithException(
    Object.merge({ foo: 'bar' }, 'wear', 8, null),
    { foo: 'bar', 0: 'w', 1: 'e', 2: 'a', 3: 'r' },
    { mootools: { foo: 'bar', wear: 8 } },
    'Object.merge | merge multi invalid');



  same(Object.extended({ foo: 'bar' }).merge({ broken: 'wear' }), { foo: 'bar', broken: 'wear' }, 'Object#merge | basic');
  same(Object.extended({ foo: 'bar' }).merge({ broken: 'wear' }, { jumpy: 'jump' }, { fire: 'breath'}), { foo: 'bar', broken: 'wear', jumpy: 'jump', fire: 'breath' }, 'Object#merge | merge 3');
  same(Object.extended({ foo: 'bar' }).merge('aha'), { foo: 'bar', 0: 'a', 1: 'h', 2: 'a'  }, 'Object#merge | merge string');
  same(Object.extended({ foo: 'bar' }).merge(null), { foo: 'bar' }, 'Object#merge | merge null');
  same(Object.extended({}).merge({}, {}, {}), {}, 'Object#merge | merge multi empty');

  sameWithException(
    Object.extended({ foo: 'bar' }).merge('wear', 8, null),
    { foo: 'bar', 0: 'w', 1: 'e', 2: 'a', 3: 'r' },
    { mootools: { foo: 'bar', wear: 8 } },
    'Object#merge | merge multi invalid');


  same(Object.clone({ foo: 'bar' }), { foo: 'bar' }, 'Object.clone | basic clone');
  same(Object.clone({ foo: 'bar', broken: 1, wear: null }), { foo: 'bar', broken: 1, wear: null }, 'Object.clone | complex clone');
  same(Object.clone({ foo: { broken: 'wear' }}), { foo: { broken: 'wear' }}, 'Object.clone | deep clone');
  equals(Object.clone({ foo: 'bar', broken: 1, wear: /foo/ }) == { foo: 'bar', broken: 1, wear: /foo/ }, false, 'Object.clone | fully cloned');

  var obj1 = {
    broken: 'wear',
    foo: {
      jumpy: 'jump',
      bucket: {
        reverse: true
      }
    }
  }
  var obj2 = Object.clone(obj1);
  equals(obj1.foo.jumpy, 'jump', 'Object.clone | cloned object has nested attribute');
  obj1.foo.jumpy = 'hump';
  equals(obj1.foo.jumpy, 'hump', 'Object.clone | original object is modified');
  equals(obj2.foo.jumpy, 'jump', 'Object.clone | cloned object is not modified');

  obj1 = {
    foo: {
      bar: [1,2,3]
    }
  };
  obj2 = Object.clone(obj1);

  obj1.foo.bar = ['a','b','c'];
  same(obj1.foo.bar, ['a','b','c'], 'Object#clone | original object is modified');
  same(obj2.foo.bar, [1,2,3], 'Object#clone | cloned object is not modified');



  // Note here that the need for these complicated syntaxes is that both Prototype and Mootools' Object.clone is incorrectly
  // cloning properties in the prototype chain directly into the object itself.
  equals(deepEqualWithoutPrototyping(Object.extended({ foo: 'bar' }).clone(), { foo: 'bar' }), true, 'Object#clone | basic clone');
  equals(deepEqualWithoutPrototyping(Object.extended({ foo: 'bar', broken: 1, wear: null }).clone(), { foo: 'bar', broken: 1, wear: null }), true, 'Object#clone | complex clone');
  equals(deepEqualWithoutPrototyping(Object.extended({ foo: { broken: 'wear' }}).clone(), { foo: { broken: 'wear' }}), true, 'Object#clone | deep clone');

  equals(Object.extended({ foo: 'bar', broken: 1, wear: /foo/ }).clone() == { foo: 'bar', broken: 1, wear: /foo/ }, false, 'Object#clone | fully cloned');

  var obj1 = Object.extended({
    broken: 'wear',
    foo: {
      jumpy: 'jump',
      bucket: {
        reverse: true
      }
    }
  });
  obj2 = obj1.clone();

  equals(obj1.foo.jumpy, 'jump', 'Object#clone | cloned object has nested attribute');
  obj1.foo.jumpy = 'hump';
  equals(obj1.foo.jumpy, 'hump', 'Object#clone | original object is modified');
  equals(obj2.foo.jumpy, 'jump', 'Object#clone | cloned object is not modified');

  same(obj2.keys().sort(), ['broken','foo'], 'Object#clone | cloned objects are themselves extended');

  obj1 = Object.extended({
    foo: {
      bar: [1,2,3]
    }
  });
  obj2 = obj1.clone();

  obj1.foo.bar[1] = 'b';
  same(obj1.foo.bar, [1,'b',3], 'Object#clone | original object is modified');
  same(obj2.foo.bar, [1,2,3], 'Object#clone | cloned object is not modified');

  equals(Object.isEmpty({}), true, 'Object.isEmpty | object is empty');
  equals(Object.isEmpty({ broken: 'wear' }), false, 'Object.isEmpty | object is not empty');

  equals(Object.extended({}).isEmpty({}), true, 'Object#isEmpty | object is empty');
  equals(Object.extended({ broken: 'wear' }).isEmpty(), false, 'Object#empty | object is not empty');

  equals(Object.equals({ broken: 'wear' }, { broken: 'wear' }), true, 'Object.equals | objects are equal');
  equals(Object.equals({ broken: 'wear' }, { broken: 'jumpy' }), false, 'Object.equals | objects are not equal');
  equals(Object.equals({}, {}), true, 'Object.equals | empty objects are equal');
  equals(Object.equals({}, { broken: 'wear' }), false, 'Object.equals | 1st empty');
  equals(Object.equals({ broken: 'wear' }, {}), false, 'Object.equals | 2nd empty');

  equals(Object.extended({ broken: 'wear' }).equals({ broken: 'wear' }), true, 'Object#equals | objects are equal');
  equals(Object.extended({ broken: 'wear' }).equals({ broken: 'jumpy' }), false, 'Object#equals | objects are not equal');
  equals(Object.extended({}).equals({}), true, 'Object#equals | empty objects are equal');
  equals(Object.extended({}).equals({ broken: 'wear' }), false, 'Object#equals | 1st empty');
  equals(Object.extended({ broken: 'wear' }).equals({}), false, 'Object#equals | 2nd empty');



  // Enabling native object methods


  rememberObjectProtoypeMethods();

  Object.enableSugar();

  var prototypeBaseValues = ({}).values();

  count = 0;
  same(({ foo: 'bar' }).keys(function() { count++; }), ['foo'], 'Object#keys | Object.prototype');
  sameWithException(({ foo: 'bar' }).values(function() { count++; }).sort(), ['bar'], { prototype: ['bar'].concat(prototypeBaseValues) }, 'Object#values | Object.prototype');
  ({ foo: 'bar' }).each(function() { count++; });

  equalsWithException(count, 3, { prototype: 2 }, 'Object | Object.prototype should have correctly called all functions');

  equals(({}).isEmpty(), true, 'Object#empty | Object.prototype');
  equals(({ foo: 'bar' }).equals({ foo: 'bar' }), true, 'Object#equals | Object.prototype');
  same(({ foo: 'bar' }).merge({ moo: 'car' }), { foo: 'bar', moo: 'car' }, 'Object#merge | Object.prototype');

  obj1 = { foo: 'bar' };
  obj2 = obj1.clone();
  obj1.foo = 'mar';

  same(obj2, { foo: 'bar' }, 'Object#clone | Object.prototype');

  equals(([1,2,3]).isArray(), true, 'Object#isArray | Object.prototype');
  equals(([1,2,3]).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equals(([1,2,3]).isDate(), false, 'Object#isDate | Object.prototype');
  equals(([1,2,3]).isFunction(), false, 'Object#isFunction | Object.prototype');
  equals(([1,2,3]).isNumber(), false, 'Object#isNumber | Object.prototype');
  equals(([1,2,3]).isString(), false, 'Object#isString | Object.prototype');
  equals(([1,2,3]).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equals((true).isArray(), false, 'Object#isArray | Object.prototype');
  equals((true).isBoolean(), true, 'Object#isBoolean | Object.prototype');
  equals((true).isDate(), false, 'Object#isDate | Object.prototype');
  equals((true).isFunction(), false, 'Object#isFunction | Object.prototype');
  equals((true).isNumber(), false, 'Object#isNumber | Object.prototype');
  equals((true).isString(), false, 'Object#isString | Object.prototype');
  equals((true).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equals((new Date()).isArray(), false, 'Object#isArray | Object.prototype');
  equals((new Date()).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equals((new Date()).isDate(), true, 'Object#isDate | Object.prototype');
  equals((new Date()).isFunction(), false, 'Object#isFunction | Object.prototype');
  equals((new Date()).isNumber(), false, 'Object#isNumber | Object.prototype');
  equals((new Date()).isString(), false, 'Object#isString | Object.prototype');
  equals((new Date()).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equals((function() {}).isArray(), false, 'Object#isArray | Object.prototype');
  equals((function() {}).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equals((function() {}).isDate(), false, 'Object#isDate | Object.prototype');
  equals((function() {}).isFunction(), true, 'Object#isFunction | Object.prototype');
  equals((function() {}).isNumber(), false, 'Object#isNumber | Object.prototype');
  equals((function() {}).isString(), false, 'Object#isString | Object.prototype');
  equals((function() {}).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equals((3).isArray(), false, 'Object#isArray | Object.prototype');
  equals((3).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equals((3).isDate(), false, 'Object#isDate | Object.prototype');
  equals((3).isFunction(), false, 'Object#isFunction | Object.prototype');
  equals((3).isNumber(), true, 'Object#isNumber | Object.prototype');
  equals((3).isString(), false, 'Object#isString | Object.prototype');
  equals((3).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equals(('wasabi').isArray(), false, 'Object#isArray | Object.prototype');
  equals(('wasabi').isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equals(('wasabi').isDate(), false, 'Object#isDate | Object.prototype');
  equals(('wasabi').isFunction(), false, 'Object#isFunction | Object.prototype');
  equals(('wasabi').isNumber(), false, 'Object#isNumber | Object.prototype');
  equals(('wasabi').isString(), true, 'Object#isString | Object.prototype');
  equals(('wasabi').isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equals((/wasabi/).isArray(), false, 'Object#isArray | Object.prototype');
  equals((/wasabi/).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equals((/wasabi/).isDate(), false, 'Object#isDate | Object.prototype');
  equals((/wasabi/).isFunction(), false, 'Object#isFunction | Object.prototype');
  equals((/wasabi/).isNumber(), false, 'Object#isNumber | Object.prototype');
  equals((/wasabi/).isString(), false, 'Object#isString | Object.prototype');
  equals((/wasabi/).isRegExp(), true, 'Object#isRegExp | Object.prototype');

  restoreObjectPrototypeMethods();

});

