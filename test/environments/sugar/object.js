package('Object', function () {

  method('isObject', function() {
    var Person = function() {};
    var p = new Person();

    test(Object, [{}], true, '{}');
    test(Object, [run(Object, 'extended')], true, 'extended object');
    test(Object, [new Object({})], true, 'new Object()');
    test(Object, [[]], false, '[]');
    test(Object, [new Array(1,2,3)], false, 'new Array(1,2,3)');
    test(Object, [new RegExp()], false, 'new RegExp()');
    test(Object, [new Date()], false, 'new Date()');
    test(Object, [function() {}], false, 'function() {}');
    test(Object, [1], false, '1');
    test(Object, ['wasabi'], false, '"wasabi"');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
    test(Object, [NaN], false, 'NaN');
    test(Object, [], false, 'blank');
    test(Object, [false], false, 'false');
    test(Object, [true], false, 'true');
    test(Object, [p], false, 'instance');
  });

  method('isArray', function() {
    test(Object, [{}], false, '{}');
    test(Object, [[]], true, '[]');
    test(Object, [new Array(1,2,3)], true, 'new Array(1,2,3)');
    test(Object, [new RegExp()], false, 'new RegExp()');
    test(Object, [new Date()], false, 'new Date()');
    test(Object, [function() {}], false, 'function() {}');
    test(Object, [1], false, '1');
    test(Object, ['wasabi'], false, '"wasabi"');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
    test(Object, [NaN], false, 'NaN');
    test(Object, [], false, 'blank');
    test(Object, [false], false, 'false');
    test(Object, [true], false, 'true');
  });

  method('isBoolean', function() {
    test(Object, [{}], false, '{}');
    test(Object, [[]], false, '[]');
    test(Object, [new RegExp()], false, 'new RegExp()');
    test(Object, [new Date()], false, 'new Date()');
    test(Object, [function() {}], false, 'function() {}');
    test(Object, [1], false, '1');
    test(Object, ['wasabi'], false, '"wasabi"');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
    test(Object, [NaN], false, 'NaN');
    test(Object, [], false, 'blank');
    test(Object, [false], true, 'false');
    test(Object, [true], true, 'true');
  });

  method('isDate', function() {
    test(Object, [{}], false, '{}');
    test(Object, [[]], false, '[]');
    test(Object, [new RegExp()], false, 'new RegExp()');
    test(Object, [new Date()], true, 'new Date()');
    test(Object, [function() {}], false, 'function() {}');
    test(Object, [1], false, '1');
    test(Object, ['wasabi'], false, '"wasabi"');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
    test(Object, [NaN], false, 'NaN');
    test(Object, [], false, 'blank');
    test(Object, [false], false, 'false');
    test(Object, [true], false, 'true');
  });

  method('isFunction', function() {
    test(Object, [{}], false, '{}');
    test(Object, [[]], false, '[]');
    test(Object, [new RegExp()], false, 'new RegExp()');
    test(Object, [new Date()], false, 'new Date()');
    test(Object, [function() {}], true, 'function() {}');
    test(Object, [new Function()], true, 'new Function()');
    test(Object, [1], false, '1');
    test(Object, ['wasabi'], false, '"wasabi"');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
    test(Object, [NaN], false, 'NaN');
    test(Object, [], false, 'blank');
    test(Object, [false], false, 'false');
    test(Object, [true], false, 'true');
  });


  method('isNumber', function() {
    test(Object, [{}], false, '{}');
    test(Object, [[]], false, '[]');
    test(Object, [new RegExp()], false, 'new RegExp()');
    test(Object, [new Date()], false, 'new Date()');
    test(Object, [function() {}], false, 'function() {}');
    test(Object, [new Function()], false, 'new Function()');
    test(Object, [1], true, '1');
    test(Object, [0], true, '0');
    test(Object, [-1], true, '-1');
    test(Object, [new Number('3')], true, 'new Number("3")');
    test(Object, ['wasabi'], false, '"wasabi"');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
    test(Object, [NaN], true, 'NaN');
    test(Object, [], false, 'blank');
    test(Object, [false], false, 'false');
    test(Object, [true], false, 'true');
  });

  method('isString', function() {
    test(Object, [{}], false, '{}');
    test(Object, [[]], false, '[]');
    test(Object, [new RegExp()], false, 'new RegExp()');
    test(Object, [new Date()], false, 'new Date()');
    test(Object, [function() {}], false, 'function() {}');
    test(Object, [new Function()], false, 'new Function()');
    test(Object, [1], false, '1');
    test(Object, ['wasabi'], true, '"wasabi"');
    test(Object, [new String('wasabi')], true, 'new String("wasabi")');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
    test(Object, [NaN], false, 'NaN');
    test(Object, [], false, 'blank');
    test(Object, [false], false, 'false');
    test(Object, [true], false, 'true');
  });

  method('isRegExp', function() {
    test(Object, [{}], false, '{}');
    test(Object, [[]], false, '[]');
    test(Object, [new RegExp()], true, 'new RegExp()');
    test(Object, [/afda/], true, '/afda/');
    test(Object, [new Date()], false, 'new Date()');
    test(Object, [function() {}], false, 'function() {}');
    test(Object, [new Function()], false, 'new Function()');
    test(Object, [1], false, '1');
    test(Object, ['wasabi'], false, '"wasabi"');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
    test(Object, [NaN], false, 'NaN');
    test(Object, [], false, 'blank');
    test(Object, [false], false, 'false');
    test(Object, [true], false, 'true');
  });

  method('isNaN', function() {
    test(Object, [{}], false, '{}');
    test(Object, [[]], false, '[]');
    test(Object, [new RegExp()], false, 'new RegExp()');
    test(Object, [/afda/], false, '/afda/');
    test(Object, [new Date()], false, 'new Date()');
    test(Object, [function() {}], false, 'function() {}');
    test(Object, [new Function()], false, 'new Function()');
    test(Object, [1], false, '1');
    test(Object, ['wasabi'], false, '"wasabi"');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
    test(Object, [NaN], true, 'NaN');
    test(Object, [], false, 'blank');
    test(Object, [false], false, 'false');
    test(Object, [true], false, 'true');
  });

  method('extended', function() {
    var keys, values, obj, strippedValues;
    var d = new Date();

    equal(({}).keys, undefined, 'Object | native objects are not wrapped by default');
    equal(run(Object, 'extended'), run(Object, 'extended', [{}]), 'Object.extended | null argument same as empty object');

    obj = run(Object, 'extended', [{
      number: 3,
      person: 'jim',
      date: d
    }]);
    keys = ['number','person','date'];
    values = [3,'jim',d];
    equal(obj.keys(), keys, "returns object's keys");
    count = 0;
    obj.keys(function(key, value) {
      equal(key, keys[count], 'accepts a block');
      equal(value, values[count], 'value is also passed');
      equal(this, obj, '"this" is the object');
      count++;
    });

    equal(count, 3, 'accepts a block | iterated properly');

    equal(run(Object, 'extended').keys(), [], 'empty object');
    equal(run(Object, 'keys', [run(Object, 'extended')]), [], 'empty object');

    keys = ['number','person','date'];
    values = [3,'jim',d];
    equal(run(Object, 'keys', [obj]), keys, "Object.keys | returns object's keys");
    count = 0;
    run(Object, 'keys', [obj, function(key) {
      equal(key, keys[count], 'Object.keys | accepts a block');
      count++;
    }]);
    equal(count, 3, 'Object.keys | accepts a block | iterated properly');

    strippedValues = obj.values().filter(function(m) { return typeof m != 'function'; });
    equal(strippedValues, values, "returns object's values");
    count = 0;
    obj.values(function(value) {
      equal(value, values[count], 'accepts a block');
      count++;
    });

    equal(count, 3, 'accepts a block | iterated properly');

    strippedValues = run(Object, 'values', [obj]).filter(function(m) { return typeof m != 'function'; });
    equal(strippedValues, values, "Object.values | returns object's values");
    count = 0;
    run(Object, 'values', [obj, function(value) {
      equal(value, values[count], 'Object.values | accepts a block');
      count++;
    }]);
    equal(count, 3, 'Object.values | accepts a block | iterated properly');

    strippedValues = run(Object, 'extended').values().filter(function(m) { return typeof m != 'function'; });
    equal(strippedValues, [], 'empty object');

    strippedValues = run(Object, 'values', [run(Object, 'extended')]).filter(function(m) { return typeof m != 'function'; });
    equal(strippedValues, [], 'empty object');

  });

  method('merge', function() {

    test(Object, [{ foo: 'bar' }, { broken: 'wear' }], { foo: 'bar', broken: 'wear' }, 'basic');
    test(Object, [{ foo: 'bar' }, 'aha'], { foo: 'bar' }, 'will not merge a string');
    test(Object, [{ foo: 'bar' }, null], { foo: 'bar' }, 'merge null');
    test(Object, [{}, {}], {}, 'merge multi empty');
    test(Object, [{ foo: 'bar' }, 8], { foo: 'bar' }, 'merge number');
    test(Object, [{ foo:'bar' }, 'wear', 8, null], { foo:'bar' }, 'merge multi invalid');
    test(Object, [[1,2,3,4], [4,5,6]], [4,5,6,4], 'arrays should also be mergeable');
    test(Object, [{ foo: { one: 'two' }}, { foo: { two: 'three' }}, true, true], { foo: { one: 'two', two: 'three' }}, 'accepts deep merges');
    test(Object, ['foo', 'bar'], 'foo', 'two strings');
    test(Object, [{ a:1 }, { a:2 }], { a:2 }, 'incoming wins');
    test(Object, [{ a:1 }, { a:2 }], { a:2 }, 'incoming wins | params true');
    test(Object, [{ a:1 }, { a:2 }, false, false], { a:1 }, 'target wins');
    test(Object, [{ a:undefined }, { a:2 }], { a:2 }, 'existing but undefined properties are overwritten');
    test(Object, [{ a:null }, { a:2 }], { a:2 }, 'null properties are not overwritten');
    test(Object, [{ a:undefined }, { a:2 }, false, false], { a:2 }, 'false | existing but undefined properties are overwritten');
    test(Object, [{ a:null }, { a:2 }, false, false], { a:null }, 'false | null properties are not overwritten');
    test(Object, [[{ foo:'bar' }], [{ moo:'car' }], true, true], [{ foo:'bar',moo:'car' }], 'can merge arrays as well');

    var fn1 = function() {};
    fn1.foo = 'bar';
    equal(run(Object, 'merge', [function(){}, fn1]).foo, 'bar', 'retains properties');

    var fn = function(key, a, b) {
      equal(key, 'a', 'resolve function | first argument is the key');
      equal(a, 1, 'resolve function | second argument is the target val');
      equal(b, 2, 'resolve function | third argument is the source val');
      equal(this, { a:2 }, 'resolve function | context is the source object');
      return a + b;
    };

    test(Object, [{ a:1 }, { a:2 }, false, fn], { a:3 }, 'function resolves');


    // Issue #335

    test(Object, [{a:{b:1}}, {a:{b:2,c:3} }, true, false], {a:{b:1,c:3}}, 'two deep properties');


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

    test(Object, [obj1, obj2, true, fn], expected, 'complex objects with resolve function');
    equal(obj1.fn(), 'moe', 'fn conflict resolved');
    equal(obj1.date.getTime(), new Date(2005, 1, 6).getTime(), 'date conflict resolved');

    equal(run(Object, 'extended', [{ foo: 'bar' }]).merge({ broken: 'wear' }), { foo: 'bar', broken: 'wear' }, 'Object#merge | basic');
    equal(run(Object, 'extended', [{ foo: 'bar' }]).merge('aha'), { foo: 'bar' }, 'Object#merge | will not merge a string');
    equal(run(Object, 'extended', [{ foo: 'bar' }]).merge(null), { foo: 'bar' }, 'Object#merge | merge null');
    equal(run(Object, 'extended', [{}]).merge({}, {}, {}), {}, 'Object#merge | merge multi empty');
    equal(run(Object, 'extended', [{ foo: 'bar' }]).merge('wear', 8, null), { foo:'bar' }, 'Object#merge | merge multi invalid');

    var fn1 = function() {};
    fn1.foo = 'bar';
    equal(run(Object, 'extended', [function(){}]).merge(fn1).foo, 'bar', 'retains properties');
    equal(run(Object, 'extended', [{ a:1 }]).merge({ a:2 }), { a:2 }, 'incoming wins');
    equal(run(Object, 'extended', [{ a:1 }]).merge({ a:2 }, true), { a:2 }, 'incoming wins | params true');
    equal(run(Object, 'extended', [{ a:1 }]).merge({ a:2 }, false, false), { a:1 }, 'target wins');
    equal(run(Object, 'extended', [{ a:1 }]).merge({ a:2 }, false, function(key, a, b){ return a + b; }), { a:3 }, 'function resolves');

  });

  method('clone', function() {

    test(Object, ['hardy'], 'hardy', 'Object.clone | clone on a string');
    test(Object, [undefined], undefined, 'Object.clone | clone on undefined');
    test(Object, [null], null, 'Object.clone | clone on null');
    test(Object, [{ foo: 'bar' }], { foo: 'bar' }, 'Object.clone | basic clone');
    test(Object, [{ foo: 'bar', broken: 1, wear: null }], { foo: 'bar', broken: 1, wear: null }, 'Object.clone | complex clone');
    test(Object, [{ foo: { broken: 'wear' }}], { foo: { broken: 'wear' }}, 'Object.clone | deep clone');
    test(Object, [[1,2,3]], [1,2,3], 'Object.clone | clone on arrays');
    test(Object, [['a','b','c']], ['a','b','c'], 'Object.clone | clone on array of strings');
    // PICK UP HERE
    return;

    var arr1    = [1];
    var arr2    = [2];
    var arr3    = [3];
    var shallow = Object.clone([arr1,arr2,arr3]);
    var deep    = Object.clone([arr1,arr2,arr3], true);

    equal(shallow[0] === arr1, true, 'Object.clone | shallow clone | index 0 is strictly equal');
    equal(shallow[1] === arr2, true, 'Object.clone | shallow clone | index 1 is strictly equal');
    equal(shallow[2] === arr3, true, 'Object.clone | shallow clone | index 2 is strictly equal');

    equal(deep[0] === arr1, false, 'Object.clone | deep clone | index 0 is not strictly equal');
    equal(deep[1] === arr2, false, 'Object.clone | deep clone | index 1 is not strictly equal');
    equal(deep[2] === arr3, false, 'Object.clone | deep clone | index 2 is not strictly equal');

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
    equal(obj2.foo.jumpy, 'hump', 'Object.clone | clone is shallow');

    obj1 = {
      foo: {
        bar: [1,2,3]
      }
    };
    obj2 = Object.clone(obj1);
    obj3 = Object.clone(obj1, true);

    obj1.foo.bar = ['a','b','c'];
    equal(obj1.foo.bar, ['a','b','c'], 'Object#clone | original object is modified');
    equal(obj2.foo.bar, ['a','b','c'], 'Object#clone | clone is shallow');


    obj1.foo.bar = ['a','b','c'];
    equal(obj3.foo.bar, [1,2,3], 'Object#clone | clone is deep');

    var arr1 = [obj1, obj1, obj1];
    var arr2 = Object.clone(arr1, true);

    equal(arr1.length, arr2.length, 'Object.clone | array deep | lengths should be equal');
    equal(arr2[0] === obj1, false, 'Object.clone | array deep | obj1 is not equal');
    equal(arr2[1] === obj2, false, 'Object.clone | array deep | obj2 is not equal');
    equal(arr2[2] === obj3, false, 'Object.clone | array deep | obj3 is not equal');


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
    equal(obj3.foo.jumpy, 'jump', 'Object#clone | clone is deep');

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
    equal(obj3.foo.bar, [1,2,3], 'Object#clone | cloned object is not modified');
  });
  return;



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
  equal(({ foo: 'bar' }).values(function() { count++; }).sort(), ['bar'], 'Object#values | Object.prototype');

  equal(count, 2, 'Object | Object.prototype should have correctly called all functions');

  equal(({ foo: 'bar' }).equals({ foo: 'bar' }), true, 'Object#equals | Object.prototype');
  equal(({ foo: 'bar' }).merge({ moo: 'car' }), { foo: 'bar', moo: 'car' }, 'Object#merge | Object.prototype');

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
  equal(Object.fromQueryString('foo=bar&moo=3'), {foo:'bar',moo:'3'}, 'Object.fromQueryString | with numbers');

  equal(Object.fromQueryString('foo=bar&moo=true'), {foo:'bar',moo:'true'}, 'Object.fromQueryString | with true');
  equal(Object.fromQueryString('foo=bar&moo=false'), {foo:'bar',moo:'false'}, 'Object.fromQueryString | with false');

  equal(Object.fromQueryString('foo=bar&moo=true', true), {foo:'bar',moo:true}, 'Object.fromQueryString | coerced | with true');
  equal(Object.fromQueryString('foo=bar&moo=false', true), {foo:'bar',moo:false}, 'Object.fromQueryString | coerced | with false');

  equal(Object.fromQueryString('foo=bar3'), { foo: 'bar3' }, 'Object.fromQueryString | number in back');
  equal(Object.fromQueryString('foo=3bar'), { foo: '3bar' }, 'Object.fromQueryString | number up front');
  equal(Object.fromQueryString('foo=345'), { foo: '345' }, 'Object.fromQueryString | numbers only');
  equal(Object.fromQueryString('foo=&bar='), { foo: '', bar: '' }, 'Object.fromQueryString | undefined params');
  equal(Object.fromQueryString('foo[]=bar&foo[]=car'), { foo: ['bar','car'] }, 'Object.fromQueryString | handles array params');
  equal(Object.fromQueryString('foo[bar]=tee&foo[car]=hee'), { foo: { bar: 'tee', car: 'hee' } }, 'Object.fromQueryString | handles hash params');
  equal(Object.fromQueryString('foo[0]=a&foo[1]=b&foo[2]=c'), { foo: ['a','b','c'] }, 'Object.fromQueryString | handles array indexes');

  equal(Object.fromQueryString('foo[cap][map]=3'), { foo: { cap: { map: '3' } } }, 'Object.fromQueryString | handles array indexes');
  equal(Object.fromQueryString('foo[cap][map][]=3'), { foo: { cap: { map: ['3'] } } }, 'Object.fromQueryString | nested with trailing array');
  equal(Object.fromQueryString('foo[moo]=1&bar[far]=2'), { foo: { moo: '1' }, bar: { far: '2' }}, 'Object.fromQueryString | sister objects');

  equal(Object.fromQueryString('f[]=a&f[]=b&f[]=c&f[]=d&f[]=e&f[]=f'), { f: ['a','b','c','d','e','f'] }, 'Object.fromQueryString | large array');
  equal(Object.fromQueryString('foo[0][]=a&foo[1][]=b'), { foo: [['a'],['b']] }, 'Object.fromQueryString | nested arrays separate');
  equal(Object.fromQueryString('foo[0][0]=3&foo[0][1]=4'), { foo: [['3','4']] }, 'Object.fromQueryString | nested arrays together');
  equal(Object.fromQueryString('foo[][]=3&foo[][]=4'), { foo: [['3'],['4']] }, 'Object.fromQueryString | nested arrays');

  var qs = 'foo[cap][map]=true&foo[cap][pap]=false';
  equal(Object.fromQueryString(qs), {foo:{cap:{ map:'true',pap:'false'}}}, 'Object.fromQueryString | nested boolean without coercion');
  equal(Object.fromQueryString(qs, true), {foo:{cap:{map:true,pap:false}}}, 'Object.fromQueryString | nested boolean with coercion');


  var sparse = [];
  sparse[3] = 'hardy';
  sparse[10] = 'har har';
  equal(Object.fromQueryString('foo[3]=hardy&foo[10]=har har'), { foo: sparse }, 'Object.fromQueryString | constructed arrays can be sparse');

  equal(Object.fromQueryString('text=What%20is%20going%20on%20here%3f%3f&url=http://animalsbeingdicks.com/page/2'), { text: 'What is going on here??', url: 'http://animalsbeingdicks.com/page/2' }, 'Object.fromQueryString | handles partially escaped params');
  equal(Object.fromQueryString('text=What%20is%20going%20on%20here%3f%3f&url=http%3A%2F%2Fanimalsbeingdicks.com%2Fpage%2F2'), { text: 'What is going on here??', url: 'http://animalsbeingdicks.com/page/2' }, 'Object.fromQueryString | handles fully escaped params');

  equal(Object.fromQueryString('url=http%3A%2F%2Fwww.site.com%2Fslug%3Fin%3D%2Fuser%2Fjoeyblake'), { url: 'http://www.site.com/slug?in=/user/joeyblake' }, 'Object.fromQueryString | equal must be escaped as well');

  equal(Object.fromQueryString('http://fake.com?foo=bar'), { foo: 'bar' }, 'Object.fromQueryString | handles whole URLs');
  equal(Object.fromQueryString('foo=bar&moo=car').keys(), ['foo', 'moo'], 'Object.fromQueryString | should be extended');
  equal(Object.fromQueryString(), {}, 'Object.fromQueryString | will not die if no arguments');

  if(typeof window !== 'undefined') {
    equal(Object.isArray(Object.fromQueryString(window.location).keys()), true, 'Object.fromQueryString | can handle just window.location');
  }

  equal(Object.fromQueryString('foo=3.14156'), { foo: '3.14156' }, 'Object.fromQueryString | float values are not coerced');
  equal(Object.fromQueryString('foo=127.0.0.1'), { foo: '127.0.0.1' }, 'Object.fromQueryString | IP addresses not treated as numbers');
  equal(Object.fromQueryString('zip=00165'), { zip: '00165' }, 'Object.fromQueryString | zipcodes are not treated as numbers');
  equal(Object.fromQueryString('foo[=bar'), { 'foo[': 'bar' }, 'Object.fromQueryString | opening bracket does not trigger deep parameters');



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

  // Issue #307  Object.clone should error when cloning unknown types.

  raisesError(function(){ Object.clone(f); }, 'Object.clone | raises an error if clone is not a basic object type');



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


  // Object.select

  var obj = {
    one:    1,
    two:    2,
    three:  3,
    four:   4,
    five:   5
  };

  var obj2 = { foo: obj };

  testClassAndInstance('select', obj, ['one'], { one: 1 }, 'Object.select | one key');
  testClassAndInstance('select', obj, ['foo'], {}, 'Object.select | nonexistent key');
  testClassAndInstance('select', obj, ['one', 'two'], { one: 1, two: 2 }, 'Object.select | two keys');
  testClassAndInstance('select', obj, ['one', 'foo'], { one: 1 }, 'Object.select | one existing one non-existing');
  testClassAndInstance('select', obj, ['four', 'two'], { two: 2, four: 4 }, 'Object.select | keys out of order');
  testClassAndInstance('select', obj, [['four', 'two']], { two: 2, four: 4 }, 'Object.select | keys in an array');
  testClassAndInstance('select', obj, [/o/], { one: 1, two: 2, four: 4 }, 'Object.select | regex');
  testClassAndInstance('select', obj, [/o$/], { two: 2 }, 'Object.select | regex $');
  testClassAndInstance('select', obj, [/^o/], { one: 1 }, 'Object.select | ^ regex');
  testClassAndInstance('select', obj, [/z/], {}, 'Object.select | non-matching regex');
  testClassAndInstance('select', obj, [{ one: 1 }], { one: 1 }, 'Object.select | comparing object');
  testClassAndInstance('select', obj, [{ one: 'foobar' }], {}, 'Object.select | should not match with different values');
  testClassAndInstance('select', obj, [{}], {}, 'Object.select | empty object');
  testClassAndInstance('select', obj, [[/^o/, /^f/]], { one: 1, four: 4, five: 5 }, 'Object.select | complex nested array of regexes');

  equal(Object.select(obj2, 'foo').foo === obj, true, 'Object.select | selected values should be equal by reference');

  var obj3 = Object.extended(obj);

  equal(typeof Object.select(obj,  'one').select, "undefined", 'Object.select | non-Hash should return non Hash');
  equal(typeof Object.select(obj,  'two', 'three').select, "undefined", 'Object.select | non-Hash should return non Hash');
  equal(typeof Object.select(obj3, 'one').select, "function", 'Object.select | Hash should return Hash');
  equal(typeof Object.select(obj3, 'two', 'three').select, "function", 'Object.select | Hash should return Hash');

  testClassAndInstance('reject', obj, ['one'], { two: 2, three: 3, four: 4, five: 5 }, 'Object.reject | one key');
  testClassAndInstance('reject', obj, ['foo'], obj, 'Object.reject | nonexistent key');
  testClassAndInstance('reject', obj, ['one', 'two'], { three: 3, four: 4, five: 5 }, 'Object.reject | two keys');
  testClassAndInstance('reject', obj, ['one', 'foo'], { two: 2, three: 3, four: 4, five: 5 }, 'Object.reject | one existing one non-existing');
  testClassAndInstance('reject', obj, ['four', 'two'], { one: 1, three: 3, five: 5 }, 'Object.reject | keys out of order');
  testClassAndInstance('reject', obj, [['four', 'two']], { one: 1, three: 3, five: 5 }, 'Object.reject | keys in an array');
  testClassAndInstance('reject', obj, [/o/], { three: 3, five: 5 }, 'Object.reject | regex');
  testClassAndInstance('reject', obj, [/o$/], { one: 1, three: 3, four: 4, five: 5 }, 'Object.reject | regex $');
  testClassAndInstance('reject', obj, [/^o/], { two: 2, three: 3, four: 4, five: 5 }, 'Object.reject | ^ regex');
  testClassAndInstance('reject', obj, [/z/], obj, 'Object.reject | non-matching regex');
  testClassAndInstance('reject', obj, [{ one: 1 }], { two: 2, three: 3, four: 4, five: 5 }, 'Object.reject | comparing object');
  testClassAndInstance('reject', obj, [{ one: 'foobar' }], obj, 'Object.reject | comparing object with different values');
  testClassAndInstance('reject', obj, [{}], obj, 'Object.reject | empty object');
  testClassAndInstance('reject', obj, [[/^o/, /^f/]], { two: 2, three: 3 }, 'Object.reject | complex nested array of regexes');

  equal(Object.reject(obj2, 'moo').foo === obj, true, 'Object.reject | rejected values should be equal by reference');


  // Issue #256

  if(Date.prototype.clone) {
    equal(Object.clone(new Date().utc())._utc, true, 'Object.clone | should preserve utc flag when set');
  }


  var date = new Date(2012, 8, 25);

  assertQueryStringGenerated({foo:'bar'}, [], 'foo=bar', 'Object.toQueryString | basic string');
  assertQueryStringGenerated({foo:'bar',moo:'car'}, [], 'foo=bar&moo=car', 'Object.toQueryString | two keys');
  assertQueryStringGenerated({foo:'bar',moo:8}, [], 'foo=bar&moo=8', 'Object.toQueryString | one string one numeric');
  assertQueryStringGenerated({foo:'bar3'}, [], 'foo=bar3', 'Object.toQueryString | number in back');
  assertQueryStringGenerated({foo:'3bar'}, [], 'foo=3bar', 'Object.toQueryString | number in front');
  assertQueryStringGenerated({foo: 3}, [], 'foo=3', 'Object.toQueryString | basic number');
  assertQueryStringGenerated({foo: true}, [], 'foo=true', 'Object.toQueryString | basic boolean');
  assertQueryStringGenerated({foo: /reg/}, [], 'foo=%2Freg%2F', 'Object.toQueryString | regexp');
  assertQueryStringGenerated({foo:'a b'}, [], 'foo=a+b', 'Object.toQueryString | should escape string');
  assertQueryStringGenerated({foo: date}, [], 'foo=' + date.getTime(), 'Object.toQueryString | should stringify date');
  assertQueryStringGenerated({foo:['a','b','c']}, [], 'foo[0]=a&foo[1]=b&foo[2]=c', 'Object.toQueryString | basic array');
  assertQueryStringGenerated({foo:{bar:'tee',car:'hee'}}, [], 'foo[bar]=tee&foo[car]=hee', 'Object.toQueryString | basic object');

  assertQueryStringGenerated({foo:undefined}, [], 'foo=', 'Object.toQueryString | undefined');
  assertQueryStringGenerated({foo:false}, [], 'foo=false', 'Object.toQueryString | false');
  assertQueryStringGenerated({foo:null}, [], 'foo=', 'Object.toQueryString | null');
  assertQueryStringGenerated({foo:NaN}, [], 'foo=', 'Object.toQueryString | NaN');
  assertQueryStringGenerated({foo:''}, [], 'foo=', 'Object.toQueryString | empty string');
  assertQueryStringGenerated({foo:0}, [], 'foo=0', 'Object.toQueryString | 0');
  assertQueryStringGenerated({foo:[['fap','cap']]}, [], 'foo[0][0]=fap&foo[0][1]=cap', 'Object.toQueryString | array double nested');
  assertQueryStringGenerated({foo:[['fap'],['cap']]}, [], 'foo[0][0]=fap&foo[1][0]=cap', 'Object.toQueryString | array horizonal nested');
  assertQueryStringGenerated({foo:{bar:{map:'fap'}}}, [], 'foo[bar][map]=fap', 'Object.toQueryString | object double nested');

  assertQueryStringGenerated({foo:'bar'}, ['paw'], 'paw[foo]=bar', 'Object.toQueryString | namespace | basic string');
  assertQueryStringGenerated({foo:'bar',moo:'car'}, ['paw'], 'paw[foo]=bar&paw[moo]=car', 'Object.toQueryString | namespace | two keys');
  assertQueryStringGenerated({foo:'bar',moo:8}, ['paw'], 'paw[foo]=bar&paw[moo]=8', 'Object.toQueryString | namespace | one string one numeric');
  assertQueryStringGenerated({foo:'bar3'}, ['paw'], 'paw[foo]=bar3', 'Object.toQueryString | namespace | number in back');
  assertQueryStringGenerated({foo:'3bar'}, ['paw'], 'paw[foo]=3bar', 'Object.toQueryString | namespace | number in front');
  assertQueryStringGenerated({foo: 3}, ['paw'], 'paw[foo]=3', 'Object.toQueryString | namespace | basic number');
  assertQueryStringGenerated({foo: true}, ['paw'], 'paw[foo]=true', 'Object.toQueryString | namespace | basic boolean');
  assertQueryStringGenerated({foo: /reg/}, ['paw'], 'paw[foo]=%2Freg%2F', 'Object.toQueryString | namespace | regexp');
  assertQueryStringGenerated({foo:'a b'}, ['paw'], 'paw[foo]=a+b', 'Object.toQueryString | namespace | should escape string');
  assertQueryStringGenerated({foo: date}, ['paw'], 'paw[foo]=' + date.getTime(), 'Object.toQueryString | namespace | should stringify date');
  assertQueryStringGenerated({foo:['a','b','c']}, ['paw'], 'paw[foo][0]=a&paw[foo][1]=b&paw[foo][2]=c', 'Object.toQueryString | namespace | basic array');
  assertQueryStringGenerated({foo:{bar:'tee',car:'hee'}}, ['paw'], 'paw[foo][bar]=tee&paw[foo][car]=hee', 'Object.toQueryString | namespace | basic object');

  assertQueryStringGenerated({foo:undefined}, ['paw'], 'paw[foo]=', 'Object.toQueryString | namespace | undefined');
  assertQueryStringGenerated({foo:false}, ['paw'], 'paw[foo]=false', 'Object.toQueryString | namespace | false');
  assertQueryStringGenerated({foo:null}, ['paw'], 'paw[foo]=', 'Object.toQueryString | namespace | null');
  assertQueryStringGenerated({foo:NaN}, ['paw'], 'paw[foo]=', 'Object.toQueryString | namespace | NaN');
  assertQueryStringGenerated({foo:''}, ['paw'], 'paw[foo]=', 'Object.toQueryString | namespace | empty string');
  assertQueryStringGenerated({foo:0}, ['paw'], 'paw[foo]=0', 'Object.toQueryString | namespace | 0');
  assertQueryStringGenerated({foo:[['fap','cap']]}, ['paw'], 'paw[foo][0][0]=fap&paw[foo][0][1]=cap', 'Object.toQueryString | namespace | array double nested');
  assertQueryStringGenerated({foo:[['fap'],['cap']]}, ['paw'], 'paw[foo][0][0]=fap&paw[foo][1][0]=cap', 'Object.toQueryString | namespace | array horizonal nested');
  assertQueryStringGenerated({foo:{bar:{map:'fap'}}}, ['paw'], 'paw[foo][bar][map]=fap', 'Object.toQueryString | namespace | object double nested');

  assertQueryStringGenerated({'hello there': 'bar'}, [], 'hello+there=bar', 'Object.toQueryString | spaces in key');
  assertQueryStringGenerated({'"/+': 'bar'}, [], '%22%2F%2B=bar', 'Object.toQueryString | key requires encoding');
  assertQueryStringGenerated({'時刻': 'bar'}, [], '%E6%99%82%E5%88%BB=bar', 'Object.toQueryString | Japanese key');
  assertQueryStringGenerated({'%20': 'bar'}, [], '%2520=bar', 'Object.toQueryString | %20');

  assertQueryStringGenerated(['a','b','c'], [], '0=a&1=b&2=c', 'Object.toQueryString | straight array no namespace');
  assertQueryStringGenerated(8, [], '', 'Object.toQueryString | straight number no namespace');
  assertQueryStringGenerated(date, [], '', 'Object.toQueryString | straight date no namespace');
  assertQueryStringGenerated({foo:'bar'}, ['萬'], '%E8%90%AC[foo]=bar', 'Object.toQueryString | Japanese characters in the namespace');
  equal(Object.toQueryString('foo'), '', 'Object.toQueryString | straight string no namespace');

  var obj = {
    toString: function() {
      return 'hardyhar';
    }
  }

  assertQueryStringGenerated({foo: obj}, [], 'foo=hardyhar', 'Object.toQueryString | toString object member');

  var Foo = function() {};
  Foo.prototype.toString = function() {
    return 'custom';
  }

  assertQueryStringGenerated({foo: new Foo}, [], 'foo=custom', 'Object.toQueryString | toString inherited method');


  // Issue #365 Object.merge can skip when source is object and target is not.

  equal(Object.merge({a:''}, {a:{b:1}}, true), {a:{b:1}}, 'Object.merge | source object wins with empty string');
  equal(Object.merge({a:'1'}, {a:{b:1}}, true), {a:{b:1}}, 'Object.merge | source object wins with number as string');

});
