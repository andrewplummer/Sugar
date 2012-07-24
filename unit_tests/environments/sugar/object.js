test('Object', function () {


  var count,result;
  var Person = function() {};
  var p = new Person();



  equal(Object.isObject({}), true, 'Object.isObject | {}');
  equal(Object.isObject(Object.extended()), true, 'Object.isObject | extended object');
  equal(Object.isObject(new Object({})), true, 'Object.isObject | new Object()');
  equal(Object.isObject([]), false, 'Object.isObject | []');
  equal(Object.isObject(new Array(1,2,3)), false, 'Object.isObject | new Array(1,2,3)');
  equal(Object.isObject(new RegExp()), false, 'Object.isObject | new RegExp()');
  equal(Object.isObject(new Date()), false, 'Object.isObject | new Date()');
  equal(Object.isObject(function() {}), false, 'Object.isObject | function() {}');
  equal(Object.isObject(1), false, 'Object.isObject | 1');
  equal(Object.isObject('wasabi'), false, 'Object.isObject | "wasabi"');
  equal(Object.isObject(null), false, 'Object.isObject | null');
  equal(Object.isObject(undefined), false, 'Object.isObject | undefined');
  equal(Object.isObject(NaN), false, 'Object.isObject | NaN');
  equal(Object.isObject(), false, 'Object.isObject | blank');
  equal(Object.isObject(false), false, 'Object.isObject | false');
  equal(Object.isObject(true), false, 'Object.isObject | true');
  equal(Object.isObject(p), false, 'Object.isObject | {}');

  equal(Object.isArray({}), false, 'Object.isArray | {}');
  equal(Object.isArray([]), true, 'Object.isArray | []');
  equal(Object.isArray(new Array(1,2,3)), true, 'Object.isArray | new Array(1,2,3)');
  equal(Object.isArray(new RegExp()), false, 'Object.isArray | new RegExp()');
  equal(Object.isArray(new Date()), false, 'Object.isArray | new Date()');
  equal(Object.isArray(function() {}), false, 'Object.isArray | function() {}');
  equal(Object.isArray(1), false, 'Object.isArray | 1');
  equal(Object.isArray('wasabi'), false, 'Object.isArray | "wasabi"');
  equal(Object.isArray(null), false, 'Object.isArray | null');
  equal(Object.isArray(undefined), false, 'Object.isArray | undefined');
  equal(Object.isArray(NaN), false, 'Object.isArray | NaN');
  equal(Object.isArray(), false, 'Object.isArray | blank');
  equal(Object.isArray(false), false, 'Object.isArray | false');
  equal(Object.isArray(true), false, 'Object.isArray | true');

  equal(Object.isBoolean({}), false, 'Object.isBoolean | {}');
  equal(Object.isBoolean([]), false, 'Object.isBoolean | []');
  equal(Object.isBoolean(new RegExp()), false, 'Object.isBoolean | new RegExp()');
  equal(Object.isBoolean(new Date()), false, 'Object.isBoolean | new Date()');
  equal(Object.isBoolean(function() {}), false, 'Object.isBoolean | function() {}');
  equal(Object.isBoolean(1), false, 'Object.isBoolean | 1');
  equal(Object.isBoolean('wasabi'), false, 'Object.isBoolean | "wasabi"');
  equal(Object.isBoolean(null), false, 'Object.isBoolean | null');
  equal(Object.isBoolean(undefined), false, 'Object.isBoolean | undefined');
  equal(Object.isBoolean(NaN), false, 'Object.isBoolean | NaN');
  equal(Object.isBoolean(), false, 'Object.isBoolean | blank');
  equal(Object.isBoolean(false), true, 'Object.isBoolean | false');
  equal(Object.isBoolean(true), true, 'Object.isBoolean | true');

  equal(Object.isDate({}), false, 'Object.isDate | {}');
  equal(Object.isDate([]), false, 'Object.isDate | []');
  equal(Object.isDate(new RegExp()), false, 'Object.isDate | new RegExp()');
  equal(Object.isDate(new Date()), true, 'Object.isDate | new Date()');
  equal(Object.isDate(function() {}), false, 'Object.isDate | function() {}');
  equal(Object.isDate(1), false, 'Object.isDate | 1');
  equal(Object.isDate('wasabi'), false, 'Object.isDate | "wasabi"');
  equal(Object.isDate(null), false, 'Object.isDate | null');
  equal(Object.isDate(undefined), false, 'Object.isDate | undefined');
  equal(Object.isDate(NaN), false, 'Object.isDate | NaN');
  equal(Object.isDate(), false, 'Object.isDate | blank');
  equal(Object.isDate(false), false, 'Object.isDate | false');
  equal(Object.isDate(true), false, 'Object.isDate | true');

  equal(Object.isFunction({}), false, 'Object.isFunction | {}');
  equal(Object.isFunction([]), false, 'Object.isFunction | []');
  equal(Object.isFunction(new RegExp()), false, 'Object.isFunction | new RegExp()');
  equal(Object.isFunction(new Date()), false, 'Object.isFunction | new Date()');
  equal(Object.isFunction(function() {}), true, 'Object.isFunction | function() {}');
  equal(Object.isFunction(new Function()), true, 'Object.isFunction | new Function()');
  equal(Object.isFunction(1), false, 'Object.isFunction | 1');
  equal(Object.isFunction('wasabi'), false, 'Object.isFunction | "wasabi"');
  equal(Object.isFunction(null), false, 'Object.isFunction | null');
  equal(Object.isFunction(undefined), false, 'Object.isFunction | undefined');
  equal(Object.isFunction(NaN), false, 'Object.isFunction | NaN');
  equal(Object.isFunction(), false, 'Object.isFunction | blank');
  equal(Object.isFunction(false), false, 'Object.isFunction | false');
  equal(Object.isFunction(true), false, 'Object.isFunction | true');

  equal(Object.isNumber({}), false, 'Object.isNumber | {}');
  equal(Object.isNumber([]), false, 'Object.isNumber | []');
  equal(Object.isNumber(new RegExp()), false, 'Object.isNumber | new RegExp()');
  equal(Object.isNumber(new Date()), false, 'Object.isNumber | new Date()');
  equal(Object.isNumber(function() {}), false, 'Object.isNumber | function() {}');
  equal(Object.isNumber(new Function()), false, 'Object.isNumber | new Function()');
  equal(Object.isNumber(1), true, 'Object.isNumber | 1');
  equal(Object.isNumber(0), true, 'Object.isNumber | 0');
  equal(Object.isNumber(-1), true, 'Object.isNumber | -1');
  equal(Object.isNumber(new Number('3')), true, 'Object.isNumber | new Number("3")');
  equal(Object.isNumber('wasabi'), false, 'Object.isNumber | "wasabi"');
  equal(Object.isNumber(null), false, 'Object.isNumber | null');
  equal(Object.isNumber(undefined), false, 'Object.isNumber | undefined');
  equal(Object.isNumber(NaN), true, 'Object.isNumber | NaN');
  equal(Object.isNumber(), false, 'Object.isNumber | blank');
  equal(Object.isNumber(false), false, 'Object.isNumber | false');
  equal(Object.isNumber(true), false, 'Object.isNumber | true');

  equal(Object.isString({}), false, 'Object.isString | {}');
  equal(Object.isString([]), false, 'Object.isString | []');
  equal(Object.isString(new RegExp()), false, 'Object.isString | new RegExp()');
  equal(Object.isString(new Date()), false, 'Object.isString | new Date()');
  equal(Object.isString(function() {}), false, 'Object.isString | function() {}');
  equal(Object.isString(new Function()), false, 'Object.isString | new Function()');
  equal(Object.isString(1), false, 'Object.isString | 1');
  equal(Object.isString('wasabi'), true, 'Object.isString | "wasabi"');
  equal(Object.isString(new String('wasabi')), true, 'Object.isString | new String("wasabi")');
  equal(Object.isString(null), false, 'Object.isString | null');
  equal(Object.isString(undefined), false, 'Object.isString | undefined');
  equal(Object.isString(NaN), false, 'Object.isString | NaN');
  equal(Object.isString(), false, 'Object.isString | blank');
  equal(Object.isString(false), false, 'Object.isString | false');
  equal(Object.isString(true), false, 'Object.isString | true');

  equal(Object.isRegExp({}), false, 'Object.isRegExp | {}');
  equal(Object.isRegExp([]), false, 'Object.isRegExp | []');
  equal(Object.isRegExp(new RegExp()), true, 'Object.isRegExp | new RegExp()');
  equal(Object.isRegExp(/afda/), true, 'Object.isRegExp | /afda/');
  equal(Object.isRegExp(new Date()), false, 'Object.isRegExp | new Date()');
  equal(Object.isRegExp(function() {}), false, 'Object.isRegExp | function() {}');
  equal(Object.isRegExp(new Function()), false, 'Object.isRegExp | new Function()');
  equal(Object.isRegExp(1), false, 'Object.isRegExp | 1');
  equal(Object.isRegExp('wasabi'), false, 'Object.isRegExp | "wasabi"');
  equal(Object.isRegExp(null), false, 'Object.isRegExp | null');
  equal(Object.isRegExp(undefined), false, 'Object.isRegExp | undefined');
  equal(Object.isRegExp(NaN), false, 'Object.isRegExp | NaN');
  equal(Object.isRegExp(), false, 'Object.isRegExp | blank');
  equal(Object.isRegExp(false), false, 'Object.isRegExp | false');
  equal(Object.isRegExp(true), false, 'Object.isRegExp | true');

  equal(Object.isNaN({}), false, 'Object.isNaN | {}');
  equal(Object.isNaN([]), false, 'Object.isNaN | []');
  equal(Object.isNaN(new RegExp()), false, 'Object.isNaN | new RegExp()');
  equal(Object.isNaN(/afda/), false, 'Object.isNaN | /afda/');
  equal(Object.isNaN(new Date()), false, 'Object.isNaN | new Date()');
  equal(Object.isNaN(function() {}), false, 'Object.isNaN | function() {}');
  equal(Object.isNaN(new Function()), false, 'Object.isNaN | new Function()');
  equal(Object.isNaN(1), false, 'Object.isNaN | 1');
  equal(Object.isNaN('wasabi'), false, 'Object.isNaN | "wasabi"');
  equal(Object.isNaN(null), false, 'Object.isNaN | null');
  equal(Object.isNaN(undefined), false, 'Object.isNaN | undefined');
  equal(Object.isNaN(NaN), true, 'Object.isNaN | NaN');
  equal(Object.isNaN(), false, 'Object.isNaN | blank');
  equal(Object.isNaN(false), false, 'Object.isNaN | false');
  equal(Object.isNaN(true), false, 'Object.isNaN | true');


  equal(({}).keys, undefined, 'Object | native objects are not wrapped by default');
  equal(Object.extended(), Object.extended({}), 'Object.extended | null argument same as empty object');

  var keys,values;
  var d = new Date();
  var obj = Object.extended({
    number: 3,
    person: 'jim',
    date: d
  });


  keys = ['number','person','date'];
  values = [3,'jim',d];
  equal(obj.keys(), keys, "Object#keys | returns object's keys");
  count = 0;
  obj.keys(function(key, value) {
    equal(key, keys[count], 'Object#keys | accepts a block');
    equal(value, values[count], 'Object#keys | value is also passed');
    equal(this, obj, 'Object#keys | "this" is the object');
    count++;
  });

  equal(count, 3, 'Object#keys | accepts a block | iterated properly');

  equal(Object.extended().keys(), [], 'Object#keys | empty object');
  equal(Object.keys(Object.extended()), [], 'Object#keys | empty object');

  keys = ['number','person','date'];
  values = [3,'jim',d];
  equal(Object.keys(obj), keys, "Object.keys | returns object's keys");
  count = 0;
  Object.keys(obj, function(key) {
    equal(key, keys[count], 'Object.keys | accepts a block');
    count++;
  });
  equal(count, 3, 'Object.keys | accepts a block | iterated properly');



  var strippedValues;

  strippedValues = obj.values().filter(function(m) { return typeof m != 'function'; });
  equal(strippedValues, values, "Object#values | returns object's values", { prototype: values });
  count = 0;
  obj.values(function(value) {
    equal(value, values[count], 'Object#values | accepts a block');
    count++;
  });

  equal(count, 3, 'Object#values | accepts a block | iterated properly', { prototype: 0, mootools: 0 });

  strippedValues = Object.values(obj).filter(function(m) { return typeof m != 'function'; });
  equal(strippedValues, values, "Object.values | returns object's values", { prototype: values });
  count = 0;
  Object.values(obj, function(value) {
    equal(value, values[count], 'Object.values | accepts a block');
    count++;
  });
  equal(count, 3, 'Object.values | accepts a block | iterated properly', { prototype: 0, mootools: 0 });

  strippedValues = Object.extended().values().filter(function(m) { return typeof m != 'function'; });
  equal(strippedValues, [], 'Object#values | empty object');

  strippedValues = Object.values(Object.extended()).filter(function(m) { return typeof m != 'function'; });
  equal(strippedValues, [], 'Object#values | empty object');






  equal(Object.merge({ foo: 'bar' }, { broken: 'wear' }), { foo: 'bar', broken: 'wear' }, 'Object.merge | basic');
  equal(Object.merge({ foo: 'bar' }, 'aha'), { foo: 'bar' }, 'Object.merge | will not merge a string', { mootools: { foo: 'bar', aha: undefined } });
  equal(Object.merge({ foo: 'bar' }, null), { foo: 'bar' }, 'Object.merge | merge null');
  equal(Object.merge({}, {}), {}, 'Object.merge | merge multi empty');


  equal(Object.merge({ foo: 'bar' }, 8), { foo: 'bar' }, 'Object.merge | merge number', { mootools: (function() { var s = Object.clone(8); s.foo = 'bar'; return s; })() });


  equal(Object.merge({ foo:'bar' }, 'wear', 8, null), { foo:'bar' }, 'Object.merge | merge multi invalid', { mootools: { foo: 'bar', wear: 7 } });
  equal(Object.merge([1,2,3,4], [4,5,6]), [4,5,6,4], 'Object.merge | arrays should also be mergeable');
  equal(Object.merge({ foo: { one: 'two' }}, { foo: { two: 'three' }}, true, true), { foo: { one: 'two', two: 'three' }}, 'Object.merge | accepts deep merges');

  equal(Object.merge('foo', 'bar'), 'foo', 'Object.merge | two strings');

  equal(Object.merge({ a:1 }, { a:2 }), { a:2 }, 'Object.merge | incoming wins');
  equal(Object.merge({ a:1 }, { a:2 }), { a:2 }, 'Object.merge | incoming wins | params true');
  equal(Object.merge({ a:1 }, { a:2 }, false, false), { a:1 }, 'Object.merge | target wins');
  equal(Object.merge({ a:undefined }, { a:2 }), { a:2 }, 'Object.merge | existing but undefined properties are overwritten');
  equal(Object.merge({ a:null }, { a:2 }), { a:2 }, 'Object.merge | null properties are not overwritten');
  equal(Object.merge({ a:undefined }, { a:2 }, false, false), { a:2 }, 'Object.merge | false |existing but undefined properties are overwritten');
  equal(Object.merge({ a:null }, { a:2 }, false, false), { a:null }, 'Object.merge | false | null properties are not overwritten');
  equal(Object.merge([{ foo:'bar' }], [{ moo:'car' }], true, true), [{ foo:'bar',moo:'car' }], 'Object.merge | can merge arrays as well');

  var fn1 = function() {};
  fn1.foo = 'bar';
  equal(Object.merge(function(){}, fn1).foo, 'bar', 'Object.merge | retains properties');

  var fn = function(key, a, b) {
    equal(key, 'a', 'Object.merge | resolve function | first argument is the key');
    equal(a, 1, 'Object.merge | resolve function | second argument is the target val');
    equal(b, 2, 'Object.merge | resolve function | third argument is the source val');
    equal(this, { a:2 }, 'Object.merge | resolve function | context is the source object');
    return a + b;
  };

  equal(Object.merge({ a:1 }, { a:2 }, false, fn), { a:3 }, 'Object.merge | function resolves');

  var fn1 = function() { return 'joe' };
  var fn2 = function() { return 'moe' };
  var date1 = new Date(2001, 1, 6);
  var date2 = new Date(2005, 1, 6);
  var inner1 = { foo: 'bar', hee: 'haw' }
  var inner2 = { foo: 'car', mee: 'maw' }

  var obj1 = {
    str: 'oolala',
    num: 18,
    fn: fn1,
    date: date1,
    prop1: 'next',
    inner: inner1,
    arr: [1,2,3,4]
  }

  var obj2 = {
    str: 'foofy',
    num: 67,
    fn: fn2,
    date: date2,
    prop2: 'beebop',
    inner: inner2,
    arr: [4,5,6]
  }

  var fn = function(key, a, b) {
    if(key == 'str') {
      return 'conflict!';
    } else if(key == 'num') {
      return a + b;
    } else {
      return b;
    }
  }

  var expected = {
    str: 'conflict!',
    num: 85,
    fn: fn2,
    date: date2,
    prop1: 'next',
    prop2: 'beebop',
    inner: {
      foo: 'car',
      hee: 'haw',
      mee: 'maw'
    },
    arr: [4,5,6,4]
  }

  equal(Object.merge(obj1, obj2, true, fn), expected, 'Object.merge | complex objects with resolve function');
  equal(obj1.fn(), 'moe', 'Object.merge | fn conflict resolved');
  equal(obj1.date.getTime(), new Date(2005, 1, 6).getTime(), 'Object.merge | date conflict resolved');



  equal(Object.extended({ foo: 'bar' }).merge({ broken: 'wear' }), { foo: 'bar', broken: 'wear' }, 'Object#merge | basic');
  equal(Object.extended({ foo: 'bar' }).merge('aha'), { foo: 'bar' }, 'Object#merge | will not merge a string', { mootools: { foo: 'bar', aha: undefined } });
  equal(Object.extended({ foo: 'bar' }).merge(null), { foo: 'bar' }, 'Object#merge | merge null');
  equal(Object.extended({}).merge({}, {}, {}), {}, 'Object#merge | merge multi empty');

  equal(Object.extended({ foo: 'bar' }).merge('wear', 8, null), { foo:'bar' }, 'Object#merge | merge multi invalid', { mootools: { foo: 'bar', wear: 8 } });


  var fn1 = function() {};
  fn1.foo = 'bar';
  equal(Object.extended(function(){}).merge(fn1).foo, 'bar', 'Object.merge | retains properties');


  equal(Object.extended({ a:1 }).merge({ a:2 }), { a:2 }, 'Object.merge | incoming wins');
  equal(Object.extended({ a:1 }).merge({ a:2 }, true), { a:2 }, 'Object.merge | incoming wins | params true');
  equal(Object.extended({ a:1 }).merge({ a:2 }, false, false), { a:1 }, 'Object.merge | target wins');
  equal(Object.extended({ a:1 }).merge({ a:2 }, false, function(key, a, b){ return a + b; }), { a:3 }, 'Object.merge | function resolves');



  skipEnvironments(['prototype','mootools'], function() {
    equal(Object.clone('hardy'), 'hardy', 'Object.clone | clone on a string');
  });
  equal(Object.clone(undefined), undefined, 'Object.clone | clone on undefined', { prototype: {} });
  equal(Object.clone(null), null, 'Object.clone | clone on null', { prototype: {} });
  equal(Object.clone({ foo: 'bar' }), { foo: 'bar' }, 'Object.clone | basic clone');
  equal(Object.clone({ foo: 'bar', broken: 1, wear: null }), { foo: 'bar', broken: 1, wear: null }, 'Object.clone | complex clone');
  equal(Object.clone({ foo: { broken: 'wear' }}), { foo: { broken: 'wear' }}, 'Object.clone | deep clone');
  equal(Object.clone({ foo: 'bar', broken: 1, wear: /foo/ }) == { foo: 'bar', broken: 1, wear: /foo/ }, false, 'Object.clone | fully cloned');
  equal(Object.clone([1,2,3]), [1,2,3], 'Object.clone | clone on arrays');


  var obj1, obj2, obj3;



  obj1 = {
    broken: 'wear',
    foo: {
      jumpy: 'jump',
      bucket: {
        reverse: true
      }
    }
  }
  obj2 = Object.clone(obj1);
  equal(obj1.foo.jumpy, 'jump', 'Object.clone | cloned object has nested attribute');
  obj1.foo.jumpy = 'hump';
  equal(obj1.foo.jumpy, 'hump', 'Object.clone | original object is modified');
  equal(obj2.foo.jumpy, 'hump', 'Object.clone | clone is shallow', { mootools: 'jump' });

  obj1 = {
    foo: {
      bar: [1,2,3]
    }
  };
  obj2 = Object.clone(obj1);
  obj3 = Object.clone(obj1, true);

  obj1.foo.bar = ['a','b','c'];
  equal(obj1.foo.bar, ['a','b','c'], 'Object#clone | original object is modified');
  equal(obj2.foo.bar, ['a','b','c'], 'Object#clone | clone is shallow', { mootools: [1,2,3] });


  obj1.foo.bar = ['a','b','c'];
  equal(obj3.foo.bar, [1,2,3], 'Object#clone | clone is deep', { prototype: ['a','b','c'] });


  // Note here that the need for these complicated syntaxes is that both Prototype and Mootools' Object.clone is incorrectly
  // cloning properties in the prototype chain directly into the object itself.
  equal(Object.extended({ foo: 'bar' }).clone(), { foo: 'bar' }, 'Object#clone | basic clone');
  equal(Object.extended({ foo: 'bar', broken: 1, wear: null }).clone(), { foo: 'bar', broken: 1, wear: null }, 'Object#clone | complex clone');
  equal(Object.extended({ foo: { broken: 'wear' }}).clone(), { foo: { broken: 'wear' }}, 'Object#clone | deep clone');

  equal(Object.extended({ foo: 'bar', broken: 1, wear: /foo/ }).clone() == { foo: 'bar', broken: 1, wear: /foo/ }, false, 'Object#clone | fully cloned');

  var obj1, obj2, obj3;

  obj1 = Object.extended({
    broken: 'wear',
    foo: {
      jumpy: 'jump',
      bucket: {
        reverse: true
      }
    }
  });
  obj2 = obj1.clone();
  obj3 = obj1.clone(true);

  equal(obj1.foo.jumpy, 'jump', 'Object#clone | cloned object has nested attribute');
  obj1.foo.jumpy = 'hump';
  equal(obj1.foo.jumpy, 'hump', 'Object#clone | original object is modified');
  equal(obj2.foo.jumpy, 'hump', 'Object#clone | clone is shallow');
  equal(obj3.foo.jumpy, 'jump', 'Object#clone | clone is deep', { prototype: 'hump' });

  skipEnvironments(['prototype','mootools'], function() {
    equal(obj2.keys().sort(), ['broken','foo'], 'Object#clone | cloned objects are themselves extended');
  });

  obj1 = Object.extended({
    foo: {
      bar: [1,2,3]
    }
  });
  obj2 = obj1.clone();
  obj3 = obj1.clone(true);

  obj1.foo.bar[1] = 'b';
  equal(obj1.foo.bar, [1,'b',3], 'Object#clone | original object is modified');
  equal(obj3.foo.bar, [1,2,3], 'Object#clone | cloned object is not modified', { prototype: [1,'b',3] });



  equal(Object.equal({ broken: 'wear' }, { broken: 'wear' }), true, 'Object.equal | objects are equal');
  equal(Object.equal({ broken: 'wear' }, { broken: 'jumpy' }), false, 'Object.equal | objects are not equal');
  equal(Object.equal({}, {}), true, 'Object.equal | empty objects are equal');
  equal(Object.equal({}, { broken: 'wear' }), false, 'Object.equal | 1st empty');
  equal(Object.equal({ broken: 'wear' }, {}), false, 'Object.equal | 2nd empty');

  equal(Object.equal({x: 1, y: undefined}, {x: 1, z: 2}), false, 'Object.equal | undefined keys');


  equal(Object.extended({ broken: 'wear' }).equals({ broken: 'wear' }), true, 'Object#equals | extended objects are equal to plain objects');
  equal(Object.extended({ broken: 'wear' }).equals({ broken: 'jumpy' }), false, 'Object#equals | objects are not equal');
  equal(Object.extended({}).equals({}), true, 'Object#equals | empty extended objects are equal to empty plain objects');
  equal(Object.extended({}).equals({ broken: 'wear' }), false, 'Object#equals | 1st empty');
  equal(Object.extended({ broken: 'wear' }).equals({}), false, 'Object#equals | 2nd empty');


  var obj1 = { foo: 'bar' };
  equal(Object.equal({ a: obj1, b: obj1 }, { a: obj1, b: obj1 }), true, 'Object.equal | multiple references will not choke');

  var obj1 = { foo: 'bar' };
  obj1.moo = obj1;
  equal(Object.equal(obj1, { foo: 'bar', moo: obj1 }), true, 'Object.equal | cyclical references handled');

  equal(Object.equal(undefined, 'one'), false, 'Object.equal | string to undefined');
  // Enabling native object methods


  rememberObjectProtoypeMethods();

  Object.extend();

  var prototypeBaseValues = ({}).values().sort();

  count = 0;
  equal(({ foo: 'bar' }).keys(function() { count++; }), ['foo'], 'Object#keys | Object.prototype');
  equal(({ foo: 'bar' }).values(function() { count++; }).sort(), ['bar'], 'Object#values | Object.prototype', { prototype: ['bar'].concat(prototypeBaseValues) });

  equal(count, 2, 'Object | Object.prototype should have correctly called all functions', { prototype: 2, mootools: 2 });

  equal(({ foo: 'bar' }).equals({ foo: 'bar' }), true, 'Object#equals | Object.prototype');
  equal(({ foo: 'bar' }).merge({ moo: 'car' }), { foo: 'bar', moo: 'car' }, 'Object#merge | Object.prototype', { mootools: Object.clone({ foo: 'bar', moo: 'car' }) });

  obj1 = { foo: 'bar' };
  obj2 = obj1.clone();
  obj1.foo = 'mar';

  equal(obj2, { foo: 'bar' }, 'Object#clone | Object.prototype');

  equal(([1,2,3]).isArray(), true, 'Object#isArray | Object.prototype');
  equal(([1,2,3]).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equal(([1,2,3]).isDate(), false, 'Object#isDate | Object.prototype');
  equal(([1,2,3]).isFunction(), false, 'Object#isFunction | Object.prototype');
  equal(([1,2,3]).isNumber(), false, 'Object#isNumber | Object.prototype');
  equal(([1,2,3]).isString(), false, 'Object#isString | Object.prototype');
  equal(([1,2,3]).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equal(([1,2,3]).isNaN(), false, 'Object#isNaN | Object.prototype');
  equal((true).isArray(), false, 'Object#isArray | Object.prototype');
  equal((true).isBoolean(), true, 'Object#isBoolean | Object.prototype');
  equal((true).isDate(), false, 'Object#isDate | Object.prototype');
  equal((true).isFunction(), false, 'Object#isFunction | Object.prototype');
  equal((true).isNumber(), false, 'Object#isNumber | Object.prototype');
  equal((true).isString(), false, 'Object#isString | Object.prototype');
  equal((true).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equal((true).isNaN(), false, 'Object#isNaN | Object.prototype');
  equal((new Date()).isArray(), false, 'Object#isArray | Object.prototype');
  equal((new Date()).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equal((new Date()).isDate(), true, 'Object#isDate | Object.prototype');
  equal((new Date()).isFunction(), false, 'Object#isFunction | Object.prototype');
  equal((new Date()).isNumber(), false, 'Object#isNumber | Object.prototype');
  equal((new Date()).isString(), false, 'Object#isString | Object.prototype');
  equal((new Date()).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equal((new Date()).isNaN(), false, 'Object#isNaN | Object.prototype');
  equal((function() {}).isArray(), false, 'Object#isArray | Object.prototype');
  equal((function() {}).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equal((function() {}).isDate(), false, 'Object#isDate | Object.prototype');
  equal((function() {}).isFunction(), true, 'Object#isFunction | Object.prototype');
  equal((function() {}).isNumber(), false, 'Object#isNumber | Object.prototype');
  equal((function() {}).isString(), false, 'Object#isString | Object.prototype');
  equal((function() {}).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equal((function() {}).isNaN(), false, 'Object#isNaN | Object.prototype');
  equal((3).isArray(), false, 'Object#isArray | Object.prototype');
  equal((3).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equal((3).isDate(), false, 'Object#isDate | Object.prototype');
  equal((3).isFunction(), false, 'Object#isFunction | Object.prototype');
  equal((3).isNumber(), true, 'Object#isNumber | Object.prototype');
  equal((3).isString(), false, 'Object#isString | Object.prototype');
  equal((3).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equal((3).isNaN(), false, 'Object#isNaN | Object.prototype');
  equal(('wasabi').isArray(), false, 'Object#isArray | Object.prototype');
  equal(('wasabi').isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equal(('wasabi').isDate(), false, 'Object#isDate | Object.prototype');
  equal(('wasabi').isFunction(), false, 'Object#isFunction | Object.prototype');
  equal(('wasabi').isNumber(), false, 'Object#isNumber | Object.prototype');
  equal(('wasabi').isString(), true, 'Object#isString | Object.prototype');
  equal(('wasabi').isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equal(('wasabi').isNaN(), false, 'Object#isNaN | Object.prototype');
  equal((/wasabi/).isArray(), false, 'Object#isArray | Object.prototype');
  equal((/wasabi/).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equal((/wasabi/).isDate(), false, 'Object#isDate | Object.prototype');
  equal((/wasabi/).isFunction(), false, 'Object#isFunction | Object.prototype');
  equal((/wasabi/).isNumber(), false, 'Object#isNumber | Object.prototype');
  equal((/wasabi/).isString(), false, 'Object#isString | Object.prototype');
  equal((/wasabi/).isRegExp(), true, 'Object#isRegExp | Object.prototype');
  equal((/wasabi/).isNaN(), false, 'Object#isNaN | Object.prototype');
  equal((NaN).isArray(), false, 'Object#isArray | Object.prototype');
  equal((NaN).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equal((NaN).isDate(), false, 'Object#isDate | Object.prototype');
  equal((NaN).isFunction(), false, 'Object#isFunction | Object.prototype');
  equal((NaN).isNumber(), true, 'Object#isNumber | Object.prototype');
  equal((NaN).isString(), false, 'Object#isString | Object.prototype');
  equal((NaN).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equal((NaN).isNaN(), true, 'Object#isNaN | Object.prototype');




  // Object#watch

  var obj = Object.extended({ foo: 'bar' }), ran = false, counter = 0, key;

  obj.watch('foo', function(prop, oldVal, newVal) {
    equal(this, obj, 'Object#watch | scope is the object');
    equal(prop, 'foo', 'Object#watch | first argument is the propety');
    equal(oldVal, 'bar', 'Object#watch | second argument is the old value');
    equal(newVal, 'howdy', 'Object#watch | third argument is the new value');
    ran = true;
    return newVal;
  });

  equal(obj.foo, 'bar', 'Object#watch | old property is retained');
  obj.foo = 'howdy';
  equal(obj.foo, 'howdy', 'Object#watch | property was set');
  equal(ran, true, 'Object#watch | setter ran');
  for(key in obj) counter++;
  equal(counter, 1, 'Object#watch | property should be enumerable');



  // Object#tap

  var fn = function(first) {
    equal(this, [1,2,3,4,5], 'Object#tap | context is the object');
    equal(first, [1,2,3,4,5], 'Object#tap | first argument is also the object');
    this.pop();
  }

  var map = function(n) {
    return n * 2;
  }

  var expected = [2,4,6,8];

  equal([1,2,3,4,5].tap(fn).map(map), expected, 'Object#tap | pop the array');
  equal([1,2,3,4,5].tap('pop').map(map), expected, 'Object#tap | string shortcut | pop the array');
  equal([1,2].tap(function() { this.push(3, 4); }).map(map), expected, 'Object#tap | push to the array');
  equal([1,2].tap('push', 3, 4).map(map), [2,4], 'Object#tap | string shortcut | passing arguments is not supported');
  equal([1,2,3,4].tap(function(){ if(this[this.length - 1] === 5) this.pop(); }).map(map), expected, 'Object#tap | checking last');


  var obj = { foo: 'bar' };
  equal(obj.tap(), obj, 'Object#tap | return value is strictly equal');



  equal('foo'.fromQueryString, undefined, 'Object.fromQueryString should not be mapped');
  equal('foo'.extended, undefined, 'Object.extended should not be mapped');
  equal('foo'.equal, undefined, 'Object.equal should not be mapped (should be "equals" instead)');

  restoreObjectPrototypeMethods();




  // Object.fromQueryString

  equal(Object.fromQueryString('foo=bar&moo=car'), {foo:'bar',moo:'car'}, 'Object.fromQueryString | basic');
  equal(Object.fromQueryString('foo=bar&moo=3'), {foo:'bar',moo:3}, 'Object.fromQueryString | with numbers');
  equal(Object.fromQueryString('foo=bar&moo=true'), {foo:'bar',moo:true}, 'Object.fromQueryString | with true');
  equal(Object.fromQueryString('foo=bar&moo=false'), {foo:'bar',moo:false}, 'Object.fromQueryString | with false');
  equal(Object.fromQueryString('foo=bar3'), { foo: 'bar3' }, 'Object.fromQueryString | number in back');
  equal(Object.fromQueryString('foo=3bar'), { foo: '3bar' }, 'Object.fromQueryString | number up front');
  equal(Object.fromQueryString('foo=345'), { foo: 345 }, 'Object.fromQueryString | numbers only');
  equal(Object.fromQueryString('foo=&bar='), { foo: '', bar: '' }, 'Object.fromQueryString | undefined params');
  equal(Object.fromQueryString('foo[]=bar&foo[]=car'), { foo: ['bar','car'] }, 'Object.fromQueryString | handles array params');
  equal(Object.fromQueryString('foo[bar]=tee&foo[car]=hee'), { foo: { bar: 'tee', car: 'hee' } }, 'Object.fromQueryString | handles hash params');
  equal(Object.fromQueryString('foo[0]=a&foo[1]=b&foo[2]=c'), { foo: ['a','b','c'] }, 'Object.fromQueryString | handles array indexes');
  equal(Object.fromQueryString('foo[cap][map]=3'), { foo: { cap: { map: 3 } } }, 'Object.fromQueryString | handles array indexes');
  equal(Object.fromQueryString('foo[cap][map][]=3'), { foo: { cap: { map: [3] } } }, 'Object.fromQueryString | nested with trailing array');
  equal(Object.fromQueryString('foo[moo]=1&bar[far]=2'), { foo: { moo: 1 }, bar: { far: 2 }}, 'Object.fromQueryString | sister objects');
  equal(Object.fromQueryString('f[]=a&f[]=b&f[]=c&f[]=d&f[]=e&f[]=f'), { f: ['a','b','c','d','e','f'] }, 'Object.fromQueryString | large array');
  equal(Object.fromQueryString('foo[0][]=a&foo[1][]=b'), { foo: [['a'],['b']] }, 'Object.fromQueryString | nested arrays separate');
  equal(Object.fromQueryString('foo[0][0]=3&foo[0][1]=4'), { foo: [[3,4]] }, 'Object.fromQueryString | nested arrays together');
  equal(Object.fromQueryString('foo[][]=3&foo[][]=4'), { foo: [[3],[4]] }, 'Object.fromQueryString | nested arrays');

  equal(Object.fromQueryString('foo[]=bar&foo[]=car', false), { 'foo[]': 'car' }, 'Object.fromQueryString | disallows nested params');

  var sparse = [];
  sparse[3] = 'hardy';
  sparse[10] = 'har har';
  equal(Object.fromQueryString('foo[3]=hardy&foo[10]=har har'), { foo: sparse }, 'Object.fromQueryString | constructed arrays can be sparse');

  equal(Object.fromQueryString('text=What%20is%20going%20on%20here%3f%3f&url=http://animalsbeingdicks.com/page/2'), { text: 'What is going on here??', url: 'http://animalsbeingdicks.com/page/2' }, 'Object.fromQueryString | handles partially escaped params');
  equal(Object.fromQueryString('text=What%20is%20going%20on%20here%3f%3f&url=http%3A%2F%2Fanimalsbeingdicks.com%2Fpage%2F2'), { text: 'What is going on here??', url: 'http://animalsbeingdicks.com/page/2' }, 'Object.fromQueryString | handles fully escaped params');

  equal(Object.fromQueryString('http://fake.com?foo=bar'), { foo: 'bar' }, 'Object.fromQueryString | handles whole URLs');
  equal(Object.fromQueryString('foo=bar&moo=car').keys(), ['foo', 'moo'], 'Object.fromQueryString | should be extended');
  equal(Object.fromQueryString(), {}, 'Object.fromQueryString | will not die if no arguments');

  if(typeof window !== 'undefined') {
    equal(Object.isArray(Object.fromQueryString(window.location).keys()), true, 'Object.fromQueryString | can handle just window.location');
  }

  equal(Object.fromQueryString('foo=3.14156'), { foo: 3.14156 }, 'Object.fromQueryString | can handle float values');



  // Object.watch

  var obj = { foo: 'bar' }, ran = false, counter = 0, key;

  Object.watch(obj, 'foo', function(prop, oldVal, newVal) {
    equal(this, obj, 'Object.watch | scope is the object');
    equal(prop, 'foo', 'Object.watch | first argument is the propety');
    equal(oldVal, 'bar', 'Object.watch | second argument is the old value');
    equal(newVal, 'howdy', 'Object.watch | third argument is the new value');
    ran = true;
    return newVal;
  });

  equal(obj.foo, 'bar', 'Object.watch | old property is retained');
  obj.foo = 'howdy';
  equal(obj.foo, 'howdy', 'Object.watch | property was set');
  equal(ran, true, 'Object.watch | setter ran');
  for(key in obj) counter++;
  equal(counter, 1, 'Object.watch | property should be enumerable');



  // Object.tap

  var fn = function(first) {
    equal(this, [1,2,3,4,5], 'Object.tap | context is the object');
    equal(first, [1,2,3,4,5], 'Object.tap | first argument is also the object');
    this.pop();
  }

  var map = function(n) {
    return n * 2;
  }

  var expected = [2,4,6,8];

  equal(Object.tap([1,2,3,4,5], fn).map(map), expected, 'Object.tap | pop the array');
  equal(Object.tap([1,2,3,4,5], 'pop').map(map), expected, 'Object.tap | string shortcut | pop the array');
  equal(Object.tap([1,2], function() { this.push(3, 4); }).map(map), expected, 'Object.tap | push to the array');
  equal(Object.tap([1,2], 'push', 3, 4).map(map), [2,4], 'Object.tap | string shortcut | not supported');
  equal(Object.tap([1,2,3,4], function(){ if(this[this.length - 1] === 5) this.pop(); }).map(map), expected, 'Object.tap | checking last');


  var obj = { foo: 'bar' };
  equal(Object.tap(obj), obj, 'Object.tap | return value is strictly equal');

  // Class.extend functionality


  String.extend({
    foo: function() {
      return 'bar';
    }
  });


  equal('s'.foo(), 'bar', 'Class.extend | basic functionality');

  Number.extend({
    plus: function(a, b) {
      return this + a + b;
    },
    chr: function() {
      return String.fromCharCode(this);
    }
  });


  equal((1).plus(2, 3), 6, 'Class.extend | arguments and scope are correct');

  Number.prototype.chr = function() { return 'F'; };

  equal((69).chr(), 'F', 'Class.extend | should overwrite existing methods');

  Number.restore('chr');

  equal((69).chr(), 'E', 'Class.extend | simple array of strings should restore Sugar methods');
  equal((1).plus(2, 3), 6, 'Class.extend | restoring Sugar methods should not override other custom extended methods');


  // Object.extended hasOwnProperty issue #97
  // see: http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/

  var a = Object.extended({ hasOwnProperty: true });


  // Object.has

  equal(Object.has({ foo: 'bar' }, 'foo'), true, 'Object.has | finds a property');
  equal(Object.has({ foo: 'bar' }, 'baz'), false, 'Object.has | does not find a nonexistant property');
  equal(Object.has({ hasOwnProperty: true, foo: 'bar' }, 'foo'), true, 'Object.has | local hasOwnProperty is ignored');



  // Object.clone on dates and regexes

  var obj1 = {
    d: new Date(2000, 5, 25),
    r: /dasfsa/gi
  }

  var obj2 = Object.clone(obj1, true);

  obj1.d.setDate(3);
  obj1.r.source = 'mwahaha';

  equal(obj2.d.getDate(), 25, 'Object.clone | deep cloning also clones dates');
  equal(obj2.r.source, 'dasfsa', 'Object.clone | deep cloning also clones regexes');


  // Object.merge should not merge prototype properties

  var Foo = function(){};
  Foo.prototype.bar = 3;

  var f = new Foo();

  equal(Object.merge({}, f).bar, undefined, 'Object.merge should not merge inherited properties');

  // Object.merge should not choke when target and source contain strictly equal objects

  var obj = { foo: 'bar' };

  equal(Object.merge({ one: obj }, { one: obj }), { one: obj }, 'Object.merge should be able to handle identical source/target objects');

  obj.moo = obj;

  equal(typeof Object.merge(obj, { foo: obj }), 'object', 'Object.merge should not choke on cyclic references');

  // Object.merge deep merges should clone regexes

  var obj1 = {
    reg: /foobar/g
  }

  equal(Object.merge({}, obj1, true).reg === obj1.reg, false, 'Object.merge | deep merging will clone regexes');


});

