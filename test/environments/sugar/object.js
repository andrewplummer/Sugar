package('Object', function () {

  var definePropertySupport = !!(Object.defineProperty && Object.defineProperties);

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

  method('isArguments', function() {
    test(Object, [{}], false, '{}');
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
    test(Object, [(function(){ return arguments; })()], true, 'arguments object with 0 length');
    test(Object, [(function(){ return arguments; })(1,2,3)], true, 'arguments object with 3 length');
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

    var nonEnumerablePropertySupport = !!Object.getOwnPropertyNames;

    test(Object, [{ foo: 'bar' }, { broken: 'wear' }], { foo: 'bar', broken: 'wear' }, 'basic');
    test(Object, [{ foo: 'bar' }, 'aha'], { foo: 'bar' }, 'will not merge a string');
    test(Object, [{ foo: 'bar' }, null], { foo: 'bar' }, 'will not merge null');
    test(Object, [{}, {}], {}, 'merge multi empty');
    test(Object, [{ foo: 'bar' }, 8], { foo: 'bar' }, 'merge number');
    test(Object, [{ foo:'bar' }, 'wear', 8, null], { foo:'bar' }, 'merge multi invalid');

    var expected = nonEnumerablePropertySupport ? [4,5,6] : [4,5,6,4];
    test(Object, [[1,2,3,4], [4,5,6]], expected, 'arrays are mergeable but result depends on enumerable property support');
    test(Object, [{ foo: { one: 'two' }}, { foo: { two: 'three' }}, true, true], { foo: { one: 'two', two: 'three' }}, 'accepts deep merges');
    test(Object, ['foo', 'bar'], 'foo', 'two strings');
    test(Object, [{ a:1 }, { a:2 }], { a:2 }, 'incoming wins');
    test(Object, [{ a:1 }, { a:2 }], { a:2 }, 'incoming wins | params true');
    test(Object, [{ a:1 }, { a:2 }, false, false], { a:1 }, 'target wins');
    test(Object, [{ a:undefined }, { a:2 }], { a:2 }, 'existing but undefined properties are overwritten');
    test(Object, [{ a:null }, { a:2 }], { a:2 }, 'null properties are not overwritten');
    test(Object, [{ a:undefined }, { a:2 }, false, false], { a:2 }, 'false | existing but undefined properties are overwritten');
    test(Object, [{ a:null }, { a:2 }, false, false], { a:2 }, 'false | null properties are overwritten');
    test(Object, [{ a:true }, { a:2 }, false, false], { a:true }, 'false | true is not overwritten');
    test(Object, [{ a:false }, { a:2 }, false, false], { a:false }, 'false | false is not overwritten');
    test(Object, [{ a:'' }, { a:2 }, false, false], { a:'' }, 'false | empty strings are not overwritten');
    test(Object, [[{ foo:'bar' }], [{ moo:'car' }], true, true], [{ foo:'bar',moo:'car' }], 'can merge arrays as well');

    var fn1 = function() {};
    fn1.foo = 'bar';
    equal(run(Object, 'merge', [function(){}, fn1]).foo, undefined, 'functions are not merged');


    // Merging nested functions

    var fn1 = function() {
      return 'a';
    };
    fn1.foo = 'a';
    var fn2 = function() {
      return 'b';
    };
    fn2.foo = 'b';
    var obj1 = { fn: fn1 };
    var obj2 = { fn: fn2 };
    var result = run(Object, 'merge', [obj1, obj2, true]);
    equal(result.fn(), 'b', 'override merge should choose function b');
    equal(result.fn.foo, 'b', 'override merge should choose function b | fn property');


    // Merging nested functions with resolve false

    var fn1 = function() {
      return 'a';
    };
    fn1.foo = 'a';
    var fn2 = function() {
      return 'b';
    };
    fn2.foo = 'b';
    var obj1 = { fn: fn1 };
    var obj2 = { fn: fn2 };
    var result = run(Object, 'merge', [obj1, obj2, true, false]);
    equal(result.fn(), 'a', 'non-override merge should choose function a');
    equal(result.fn.foo, 'a', 'non-override merge should choose function a | fn property');



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
        mee: 'maw'
      },
      arr: nonEnumerablePropertySupport ? [4,5,6] : [4,5,6,4]
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
    equal(run(Object, 'extended', [function(){}]).merge(fn1).foo, undefined, 'functions are not merged');
    equal(run(Object, 'extended', [{ a:1 }]).merge({ a:2 }), { a:2 }, 'incoming wins');
    equal(run(Object, 'extended', [{ a:1 }]).merge({ a:2 }, true), { a:2 }, 'incoming wins | params true');
    equal(run(Object, 'extended', [{ a:1 }]).merge({ a:2 }, false, false), { a:1 }, 'target wins');
    equal(run(Object, 'extended', [{ a:1 }]).merge({ a:2 }, false, function(key, a, b){ return a + b; }), { a:3 }, 'function resolves');


    // should not merge prototype properties

    var Foo = function(){};
    Foo.prototype.bar = 3;

    var f = new Foo();

    equal(run(Object, 'merge', [{}, f]).bar, undefined, 'Object.merge should not merge inherited properties');

    // Issue #307 - Object.clone should error when cloning unknown types.

    raisesError(function(){ run(Object, 'clone', [f]); }, 'Object.clone | raises an error if clone is not a basic object type');


    // should not choke when target and source contain strictly equal objects

    var obj = { foo: 'bar' };

    test(Object, [{ one: obj }, { one: obj }], { one: obj }, 'Object.merge should be able to handle identical source/target objects');

    obj.moo = obj;

    equal(typeof run(Object, 'merge', [obj, { foo: obj }]), 'object', 'Object.merge should not choke on cyclic references');

    // deep merges should clone regexes

    var obj1 = {
      reg: /foobar/g
    }

    notEqual(run(Object, 'merge', [{}, obj1, true]).reg, obj1.reg, 'Object.merge | deep merging will clone regexes');

    // Issue #365 Object.merge can skip when source is object and target is not.

    test(Object, [{a:''}, {a:{b:1}}, true], {a:{b:1}}, 'source object wins with empty string');
    test(Object, [{a:'1'}, {a:{b:1}}, true], {a:{b:1}}, 'source object wins with number as string');


    var obj1 = {
      foo: 'bar',
      moo: ['a','b','c']
    }
    var obj2 = {
      foo: 'car',
      moo: ['o','p','p']
    }
    var expected = {
      foo: 'car',
      moo: 'wow'
    }

    var fn = function(prop, a1, a2) {
      if(typeof a1 === 'object') {
        return 'wow';
      }
      return a2;
    }

    var result = run(Object, 'merge', [obj1, obj2, true, fn]);
    equal(result, expected, 'Returning something from a resolve function will not traverse further into that object');

    var foobar = { foo: 'bar' };


    var obj1 = {
      a1: foobar,
      one: {
        two: {
          three: {
            a: 1,
            b: 2
          }
        }
      }
    }
    var obj2 = {
      a2: foobar,
      one: {
        two: {
          three: {
            a: 1,
            c: 3
          }
        }
      }
    }
    var expected = {
      a1: { foo: 'bar' },
      a2: { foo: 'bar' },
      one: {
        two: {
          three: {
            a: 2,
            b: 2,
            c: 3
          }
        }
      }
    }

    var fn = function(prop, a, b) {
      if(typeof a === 'number' && typeof b === 'number') {
        return a + b;
      }
    }

    var result = run(Object, 'merge', [testClone(obj1), obj2, true, fn]);
    equal(result, expected, 'deep merge continues traversing into the object if the resolve function returns undefined');
    notEqual(result.a2, foobar, 'non-conflciting property a2 was deep merged');

    var expected = {
      a1: foobar,
      a2: foobar,
      one: {
        two: {
          three: {
            a: 1,
            c: 3
          }
        }
      }
    }

    var result = run(Object, 'merge', [testClone(obj1), obj2, false, fn]);
    equal(result, expected, 'non-deep merge continues on to merge the second object');
    equal(result.a2, foobar, 'non-deep merge keeps strict equality');


    if(definePropertySupport) {

      var obj1 = {};
      var obj2 = {};
      Object.defineProperty(obj1, 'foo', {
        value: 'hello',
        enumerable: false,
        configurable: false
      });

      var result = run(Object, 'merge', [{}, obj1]);
      equal(result.foo, 'hello', 'empty object merged with a non-configurable, non-enumerable property');

      raisesError(function(){
        run(Object, 'merge', [obj1, {foo: 'ohno'}]);
      }, 'attempting to merge into a non-configurable property should raise an error');
    }

  });

  method('clone', function() {

    test(Object, ['hardy'], 'hardy', 'clone on a string');
    test(Object, [undefined], undefined, 'clone on undefined');
    test(Object, [null], null, 'clone on null');
    test(Object, [{ foo: 'bar' }], { foo: 'bar' }, 'basic clone');
    test(Object, [{ foo: 'bar', broken: 1, wear: null }], { foo: 'bar', broken: 1, wear: null }, 'complex clone');
    test(Object, [{ foo: { broken: 'wear' }}], { foo: { broken: 'wear' }}, 'deep clone');
    test(Object, [[1,2,3]], [1,2,3], 'clone on arrays');
    test(Object, [['a','b','c']], ['a','b','c'], 'clone on array of strings');

    var arr1    = [1];
    var arr2    = [2];
    var arr3    = [3];
    var shallow = run(Object, 'clone', [[arr1,arr2,arr3]]);
    var deep    = run(Object, 'clone', [[arr1,arr2,arr3], true]);

    equal(shallow[0], arr1, 'shallow clone | index 0 is strictly equal');
    equal(shallow[1], arr2, 'shallow clone | index 1 is strictly equal');
    equal(shallow[2], arr3, 'shallow clone | index 2 is strictly equal');

    equal(deep[0], arr1, 'deep clone | index 0 is not strictly equal');
    equal(deep[1], arr2, 'deep clone | index 1 is not strictly equal');
    equal(deep[2], arr3, 'deep clone | index 2 is not strictly equal');

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
    obj2 = run(Object, 'clone', [obj1]);
    equal(obj1.foo.jumpy, 'jump', 'cloned object has nested attribute');
    obj1.foo.jumpy = 'hump';
    equal(obj1.foo.jumpy, 'hump', 'original object is modified');
    equal(obj2.foo.jumpy, 'hump', 'clone is shallow');

    obj1 = {
      foo: {
        bar: [1,2,3]
      }
    };
    obj2 = run(Object, 'clone', [obj1]);
    obj3 = run(Object, 'clone', [obj1, true]);

    obj1.foo.bar = ['a','b','c'];
    equal(obj1.foo.bar, ['a','b','c'], 'Object#clone | original object is modified');
    equal(obj2.foo.bar, ['a','b','c'], 'Object#clone | clone is shallow');


    obj1.foo.bar = ['a','b','c'];
    equal(obj3.foo.bar, [1,2,3], 'Object#clone | clone is deep');

    var arr1 = [obj1, obj1, obj1];
    var arr2 = run(Object, 'clone', [arr1, true]);

    equal(arr1.length, arr2.length, 'array deep | lengths should be equal');
    notEqual(arr2[0], obj1, 'array deep | obj1 is not equal');
    notEqual(arr2[1], obj2, 'array deep | obj2 is not equal');
    notEqual(arr2[2], obj3, 'array deep | obj3 is not equal');

    equal(run(Object, 'extended', [{ foo: 'bar' }]).clone(), { foo: 'bar' }, 'extended | basic clone');
    equal(run(Object, 'extended', [{ foo: 'bar', broken: 1, wear: null }]).clone(), { foo: 'bar', broken: 1, wear: null }, 'extended | complex clone');
    equal(run(Object, 'extended', [{ foo: { broken: 'wear' }}]).clone(), { foo: { broken: 'wear' }}, 'extended | deep clone');
    equal(run(Object, 'extended', [{ foo: 'bar', broken: 1, wear: /foo/ }]).clone() == { foo: 'bar', broken: 1, wear: /foo/ }, false, 'extended | fully cloned');

    var obj1, obj2, obj3;

    obj1 = run(Object, 'extended', [{
      broken: 'wear',
      foo: {
        jumpy: 'jump',
        bucket: {
          reverse: true
        }
      }
    }]);
    obj2 = obj1.clone();
    obj3 = obj1.clone(true);

    equal(obj1.foo.jumpy, 'jump', 'extended | cloned object has nested attribute');
    obj1.foo.jumpy = 'hump';
    equal(obj1.foo.jumpy, 'hump', 'extended | original object is modified');
    equal(obj2.foo.jumpy, 'hump', 'extended | clone is shallow');
    equal(obj3.foo.jumpy, 'jump', 'extended | clone is deep');
    equal(obj2.keys().sort(), ['broken','foo'], 'extended | cloned objects are themselves extended');

    obj1 = run(Object, 'extended', [{
      foo: {
        bar: [1,2,3]
      }
    }]);
    obj2 = obj1.clone();
    obj3 = obj1.clone(true);

    obj1.foo.bar[1] = 'b';
    equal(obj1.foo.bar, [1,'b',3], 'extended | original object is modified');
    equal(obj3.foo.bar, [1,2,3], 'extended | cloned object is not modified');

    // dates and regexes

    var obj1 = {
      d: new Date(2000, 5, 25),
      r: /dasfsa/gi
    }

    var obj2 = run(Object, 'clone', [obj1, true]);

    obj1.d.setDate(3);
    obj1.r.source = 'mwahaha';

    equal(obj2.d.getDate(), 25, 'Object.clone | deep cloning also clones dates');
    equal(obj2.r.source, 'dasfsa', 'Object.clone | deep cloning also clones regexes');


    // Issue #396 cloning objects with accessors.

    if(definePropertySupport) {
      var template = {
        data: { label: 'original label' }
      };
      Object.defineProperty(template, 'label', {
        get: function() {
          return this.data.label;
        },
        set: function(value) {
          this.data.label = value;
        }
      });

      var template2 =  run(Object, 'clone', [template]);
      template2.label = 'next label';
      equal(template2.data.label, 'next label', 'data value should be updated');
    }


  });

  method('equal', function() {

    test(Object, [{ broken: 'wear' }, { broken: 'wear' }], true, 'objects are equal');
    test(Object, [{ broken: 'wear' }, { broken: 'jumpy' }], false, 'objects are not equal');
    test(Object, [{}, {}], true, 'empty objects are equal');
    test(Object, [{}, { broken: 'wear' }], false, '1st empty');
    test(Object, [{ broken: 'wear' }, {}], false, '2nd empty');

    test(Object, [{x: 1, y: undefined}, {x: 1, z: 2}], false, 'undefined keys');

    equal(run(Object, 'extended', [{ broken: 'wear' }]).equals({ broken: 'wear' }), true, 'extended | are equal to plain objects');
    equal(run(Object, 'extended', [{ broken: 'wear' }]).equals({ broken: 'jumpy' }), false, 'extended | objects are not equal');
    equal(run(Object, 'extended', [{}]).equals({}), true, 'extended | empty extended objects are equal to empty plain objects');
    equal(run(Object, 'extended', [{}]).equals({ broken: 'wear' }), false, 'extended | 1st empty');
    equal(run(Object, 'extended', [{ broken: 'wear' }]).equals({}), false, 'extended | 2nd empty');

    var obj1 = { foo: 'bar' };
    test(Object, [{ a: obj1, b: obj1 }, { a: obj1, b: obj1 }], true, 'multiple references will not choke');

    var obj1 = { foo: 'bar' };
    obj1.moo = obj1;
    test(Object, [obj1, { foo: 'bar', moo: obj1 }], true, 'cyclical references handled');
    test(Object, [undefined, 'one'], false, 'string to undefined');

  });

  method('Extend All', function() {

    Sugar.extendObject();

    var count = 0;

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

    if(definePropertySupport) {

      var obj = { foo: 'bar' }, ran = false;

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
      equal(propertyIsEnumerable(obj, 'foo'), true, 'Object#watch | property should be enumerable');

    } else {

      var obj = { foo: 'bar' }, ran = false, result;

      result = obj.watch('foo', function() { ran = true; });

      equal(result, false, 'Object#watch | should not have succeeded');
      equal(ran, false, 'Object#watch | setter function should not have run');

    }


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


    equal(!!'foo'.fromQueryString, false, 'Object.fromQueryString should not be mapped');
    equal(!!'foo'.extended, false, 'Object.extended should not be mapped');
    equal('foo'.equal, undefined, 'Object.equal should not be mapped (should be "equals" instead)');

    Sugar.extendObject(false);

    equal(({foo:'bar'}).keys, undefined, 'keys no longer mapped');
    equal(({foo:'bar'}).values, undefined, 'values no longer mapped');
    equal(({foo:'bar'}).equals, undefined, 'equals no longer mapped');
    equal(({foo:'bar'}).merge, undefined, 'merge no longer mapped');
    equal(({foo:'bar'}).clone, undefined, 'clone no longer mapped');
    equal(({foo:'bar'}).isArray, undefined, 'isArray no longer mapped');
    equal(({foo:'bar'}).isBoolean, undefined, 'isBoolean no longer mapped');
    equal(({foo:'bar'}).isDate, undefined, 'isDate no longer mapped');
    equal(({foo:'bar'}).isFunction, undefined, 'isFunction no longer mapped');
    equal(({foo:'bar'}).isString, undefined, 'isString no longer mapped');
    equal(({foo:'bar'}).isRegExp, undefined, 'isRegExp no longer mapped');
    equal(({foo:'bar'}).isNaN, undefined, 'isNaN no longer mapped');
    equal(({foo:'bar'}).watch, undefined, 'watch no longer mapped');
    equal(({foo:'bar'}).tap, undefined, 'tap no longer mapped');
    equal(({foo:'bar'}).fromQueryString, undefined, 'fromQueryString no longer mapped');
    equal(({foo:'bar'}).extended, undefined, 'extended no longer mapped');

  });

  method('fromQueryString', function() {

    test(Object, ['foo=bar&moo=car'], {foo:'bar',moo:'car'}, 'basic');
    test(Object, ['foo=bar&moo=3'], {foo:'bar',moo:'3'}, 'with numbers');

    test(Object, ['foo=bar&moo=true'], {foo:'bar',moo:'true'}, 'with true');
    test(Object, ['foo=bar&moo=false'], {foo:'bar',moo:'false'}, 'with false');

    test(Object, ['foo=bar&moo=true', true], {foo:'bar',moo:true}, 'coerced | with true');
    test(Object, ['foo=bar&moo=false', true], {foo:'bar',moo:false}, 'coerced | with false');

    test(Object, ['foo=bar3'], { foo: 'bar3' }, 'number in back');
    test(Object, ['foo=3bar'], { foo: '3bar' }, 'number up front');
    test(Object, ['foo=345'], { foo: '345' }, 'numbers only');
    test(Object, ['foo=&bar='], { foo: '', bar: '' }, 'undefined params');
    test(Object, ['foo[]=bar&foo[]=car'], { foo: ['bar','car'] }, 'handles array params');
    test(Object, ['foo[bar]=tee&foo[car]=hee'], { foo: { bar: 'tee', car: 'hee' } }, 'handles hash params');
    test(Object, ['foo[0]=a&foo[1]=b&foo[2]=c'], { foo: ['a','b','c'] }, 'handles array indexes');

    test(Object, ['foo[cap][map]=3'], { foo: { cap: { map: '3' } } }, 'handles array indexes');
    test(Object, ['foo[cap][map][]=3'], { foo: { cap: { map: ['3'] } } }, 'nested with trailing array');
    test(Object, ['foo[moo]=1&bar[far]=2'], { foo: { moo: '1' }, bar: { far: '2' }}, 'sister objects');

    test(Object, ['f[]=a&f[]=b&f[]=c&f[]=d&f[]=e&f[]=f'], { f: ['a','b','c','d','e','f'] }, 'large array');
    test(Object, ['foo[0][]=a&foo[1][]=b'], { foo: [['a'],['b']] }, 'nested arrays separate');
    test(Object, ['foo[0][0]=3&foo[0][1]=4'], { foo: [['3','4']] }, 'nested arrays together');
    test(Object, ['foo[][]=3&foo[][]=4'], { foo: [['3'],['4']] }, 'nested arrays');

    var qs = 'foo[cap][map]=true&foo[cap][pap]=false';
    test(Object, [qs], {foo:{cap:{ map:'true',pap:'false'}}}, 'nested boolean without coercion');
    test(Object, [qs, true], {foo:{cap:{map:true,pap:false}}}, 'nested boolean with coercion');

    var sparse = [];
    sparse[3] = 'hardy';
    sparse[10] = 'har har';
    test(Object, ['foo[3]=hardy&foo[10]=har har'], { foo: sparse }, 'constructed arrays can be sparse');

    test(Object, ['text=What%20is%20going%20on%20here%3f%3f&url=http://animalsbeingdicks.com/page/2'], { text: 'What is going on here??', url: 'http://animalsbeingdicks.com/page/2' }, 'handles partially escaped params');
    test(Object, ['text=What%20is%20going%20on%20here%3f%3f&url=http%3A%2F%2Fanimalsbeingdicks.com%2Fpage%2F2'], { text: 'What is going on here??', url: 'http://animalsbeingdicks.com/page/2' }, 'handles fully escaped params');

    test(Object, ['url=http%3A%2F%2Fwww.site.com%2Fslug%3Fin%3D%2Fuser%2Fjoeyblake'], { url: 'http://www.site.com/slug?in=/user/joeyblake' }, 'equal must be escaped as well');

    test(Object, ['http://fake.com?foo=bar'], { foo: 'bar' }, 'handles whole URLs');
    test(Object, {}, 'will not die if no arguments');
    equal(run(Object, 'fromQueryString', ['foo=bar&moo=car']).keys(), ['foo', 'moo'], 'should be extended');

    if(typeof window !== 'undefined') {
      equal(Array.isArray(run(Object, 'fromQueryString', [window.location]).keys()), true, 'can handle just window.location');
    }

    test(Object, ['foo=3.14156'], { foo: '3.14156' }, 'float values are not coerced');
    test(Object, ['foo=127.0.0.1'], { foo: '127.0.0.1' }, 'IP addresses not treated as numbers');
    test(Object, ['zip=00165'], { zip: '00165' }, 'zipcodes are not treated as numbers');
    test(Object, ['foo[=bar'], { 'foo[': 'bar' }, 'opening bracket does not trigger deep parameters');
  });

  method('watch', function() {

    if(definePropertySupport) {

      var obj = { foo: 'bar' }, ran = false, result;

      result = run(Object, 'watch', [obj, 'foo', function(prop, oldVal, newVal) {
        equal(this, obj, 'scope is the object');
        equal(prop, 'foo', 'first argument is the propety');
        equal(oldVal, 'bar', 'second argument is the old value');
        equal(newVal, 'howdy', 'third argument is the new value');
        ran = true;
        return newVal;
      }]);

      equal(result, true, 'should have succeeded');
      equal(obj.foo, 'bar', 'old property is retained');
      obj.foo = 'howdy';
      equal(obj.foo, 'howdy', 'property was set');
      equal(ran, true, 'setter ran');
      equal(propertyIsEnumerable(obj, 'foo'), true, 'property should be enumerable');

      // Non-enumerable
      var obj = {}, result;
      Object.defineProperty(obj, 'foo', {
        enumerable: false,
        value: 3
      });
      result = run(Object, 'watch', [obj, 'foo', function(){}]);
      equal(propertyIsEnumerable(obj, 'foo'), false, 'property should not be enumerable if originally non-enumerable');

      // Non-configurable
      var obj = {}, result;
      Object.defineProperty(obj, 'foo', {
        writable: false,
        enumerable: false,
        configurable: false,
        value: 3
      });
      result = run(Object, 'watch', [obj, 'foo', function(){}]);

      equal(result, false, 'should not have succeeded');
      obj.foo = 4;


      var obj = {}, result, getCounter = 0, setCounter = 0, newSetCounter = 0;
      Object.defineProperty(obj, 'foo', {
        get: function() {
          getCounter++;
        },
        set: function() {
          setCounter++;
        }
      });

      result = run(Object, 'watch', [obj, 'foo', function(){
        newSetCounter++;
      }]);

      obj.foo;
      obj.foo = 4;

      equal(result, false, 'should not have succeeded');
      equal(getCounter, 1, 'original getter should be preserved');
      equal(setCounter, 1, 'original setter should be preserved');
      equal(newSetCounter, 0, 'new setter should be active as well');


      // Undefined property

      var obj = {}, ran = false, result;

      result = run(Object, 'watch', [obj, 'foo', function(prop, oldVal, newVal) {
        equal(this, obj, 'scope is the object');
        equal(prop, 'foo', 'first argument is the propety');
        equal(oldVal, undefined, 'second argument is the old value');
        equal(newVal, 'howdy', 'third argument is the new value');
        ran = true;
        return newVal;
      }]);

      equal(result, true, 'should have succeeded');
      equal(obj.foo, undefined, 'old property should be undefined');
      obj.foo = 'howdy';
      equal(obj.foo, 'howdy', 'property was set');
      equal(ran, true, 'setter ran');
      equal(propertyIsEnumerable(obj, 'foo'), true, 'property should be enumerable');

    } else {

      var obj = { foo: 'bar' }, ran = false, result;

      result = run(Object, 'watch', [obj, 'foo', function() {
        ran = true;
      }]);

      obj.foo = 'howdy';

      equal(result, false, 'should not succeeded');
      equal(ran, false, 'setter function should not have run');

    }

  });

  method('unwatch', function() {

    if(definePropertySupport) {

      var count = 0, obj = { foo: 3 }, fn;

      fn = function() {
        count++;
      };

      run(Object, 'watch', [obj, 'foo', fn]);
      obj.foo = 'a';
      run(Object, 'unwatch', [obj, 'foo']);

      obj.foo = 'a';
      equal(count, 1, 'watch function should have been removed');


      // Non-configurable property

      var count = 0, obj = {}, fn;

      Object.defineProperty(obj, 'foo', {
        value: 3,
        configurable: false
      });

      fn = function() {
        count++;
      };

      run(Object, 'watch', [obj, 'foo', fn]);
      obj.foo = 'a';
      run(Object, 'unwatch', [obj, 'foo']);

      obj.foo = 'a';
      equal(count, 0, 'watch function should not have run on non-configurable property');

      // Non-defined property

      var count = 0, obj = {}, fn;

      fn = function() {
        count++;
      };

      run(Object, 'watch', [obj, 'foo', fn]);
      obj.foo = 'a';
      run(Object, 'unwatch', [obj, 'foo']);

      obj.foo = 'a';
      equal(count, 1, 'watch function should have been removed');

    } else {

      var count = 0, obj = { foo: 3 }, fn;

      fn = function() {
        count++;
      };

      run(Object, 'watch', [obj, 'foo', fn]);
      obj.foo = 'a';
      run(Object, 'unwatch', [obj, 'foo']);

      obj.foo = 'a';
      equal(count, 0, 'watch function should never have run');


    }

  });

  method('tap', function() {

    var fn = function(first) {
      equal(this, [1,2,3,4,5], 'context is the object');
      equal(first, [1,2,3,4,5], 'first argument is also the object');
      this.pop();
    }

    var map = function(n) {
      return n * 2;
    }

    var expected = [2,4,6,8];

    equal(run(Object, 'tap', [[1,2,3,4,5], fn]).map(map), expected, 'pop the array');
    equal(run(Object, 'tap', [[1,2,3,4,5], 'pop']).map(map), expected, 'string shortcut | pop the array');
    equal(run(Object, 'tap', [[1,2], function() { this.push(3, 4); }]).map(map), expected, 'push to the array');
    equal(run(Object, 'tap', [[1,2], 'push', 3, 4]).map(map), [2,4], 'string shortcut | not supported');
    equal(run(Object, 'tap', [[1,2,3,4], function(){ if(this[this.length - 1] === 5) this.pop(); }]).map(map), expected, 'checking last');


    var obj = { foo: 'bar' };
    test(Object, [obj], obj, 'return value is strictly equal');

  });

  method('has', function() {
    test(Object, [{ foo: 'bar' }, 'foo'], true, 'finds a property');
    test(Object, [{ foo: 'bar' }, 'baz'], false, 'does not find a nonexistant property');
    test(Object, [{ hasOwnProperty: true, foo: 'bar' }, 'foo'], true, 'local hasOwnProperty is ignored');
  });



  // Object.extended hasOwnProperty issue #97
  // see: http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/

  //var a = Object.extended({ hasOwnProperty: true });

  method('select', function() {

    var obj = {
      one:    1,
      two:    2,
      three:  3,
      four:   4,
      five:   5
    };

    var obj2 = { foo: obj };

    var obj3 = run(Object, 'extended', [obj]);

    testClassAndInstance(obj, ['one'], { one: 1 }, 'one key');
    testClassAndInstance(obj, ['foo'], {}, 'nonexistent key');
    testClassAndInstance(obj, ['one', 'two'], { one: 1, two: 2 }, 'two keys');
    testClassAndInstance(obj, ['one', 'foo'], { one: 1 }, 'one existing one non-existing');
    testClassAndInstance(obj, ['four', 'two'], { two: 2, four: 4 }, 'keys out of order');
    testClassAndInstance(obj, [['four', 'two']], { two: 2, four: 4 }, 'keys in an array');
    testClassAndInstance(obj, [/o/], { one: 1, two: 2, four: 4 }, 'regex');
    testClassAndInstance(obj, [/o$/], { two: 2 }, 'regex $');
    testClassAndInstance(obj, [/^o/], { one: 1 }, '^ regex');
    testClassAndInstance(obj, [/z/], {}, 'non-matching regex');
    testClassAndInstance(obj, [{ one: 1 }], { one: 1 }, 'comparing object');
    testClassAndInstance(obj, [{ one: 'foobar' }], {}, 'should not match with different values');
    testClassAndInstance(obj, [{}], {}, 'empty object');
    testClassAndInstance(obj, [[/^o/, /^f/]], { one: 1, four: 4, five: 5 }, 'complex nested array of regexes');

    equal(run(Object, 'select', [obj2, 'foo']).foo, obj, 'selected values should be equal by reference');

    equal(typeof run(Object, 'select', [obj,  'one']).select, 'undefined', 'non-Hash should return non Hash');
    equal(typeof run(Object, 'select', [obj,  'two', 'three']).select, 'undefined', 'non-Hash should return non Hash');
    equal(typeof run(Object, 'select', [obj3, 'one']).select, 'function', 'Hash should return Hash');
    equal(typeof run(Object, 'select', [obj3, 'two', 'three']).select, 'function', 'Hash should return Hash');
  });

  method('reject', function() {

    var obj = {
      one:    1,
      two:    2,
      three:  3,
      four:   4,
      five:   5
    };

    var obj2 = { foo: obj };

    testClassAndInstance(obj, ['one'], { two: 2, three: 3, four: 4, five: 5 }, 'one key');
    testClassAndInstance(obj, ['foo'], obj, 'nonexistent key');
    testClassAndInstance(obj, ['one', 'two'], { three: 3, four: 4, five: 5 }, 'two keys');
    testClassAndInstance(obj, ['one', 'foo'], { two: 2, three: 3, four: 4, five: 5 }, 'one existing one non-existing');
    testClassAndInstance(obj, ['four', 'two'], { one: 1, three: 3, five: 5 }, 'keys out of order');
    testClassAndInstance(obj, [['four', 'two']], { one: 1, three: 3, five: 5 }, 'keys in an array');
    testClassAndInstance(obj, [/o/], { three: 3, five: 5 }, 'regex');
    testClassAndInstance(obj, [/o$/], { one: 1, three: 3, four: 4, five: 5 }, 'regex $');
    testClassAndInstance(obj, [/^o/], { two: 2, three: 3, four: 4, five: 5 }, '^ regex');
    testClassAndInstance(obj, [/z/], obj, 'non-matching regex');
    testClassAndInstance(obj, [{ one: 1 }], { two: 2, three: 3, four: 4, five: 5 }, 'comparing object');
    testClassAndInstance(obj, [{ one: 'foobar' }], obj, 'comparing object with different values');
    testClassAndInstance(obj, [{}], obj, 'empty object');
    testClassAndInstance(obj, [[/^o/, /^f/]], { two: 2, three: 3 }, 'complex nested array of regexes');

    equal(run(Object, 'reject', [obj2, 'moo']).foo, obj, 'rejected values should be equal by reference');
  });


  method('clone', function() {

    // Issue #256
    if(Sugar.Date.clone) {
      var date = Sugar.Date.setUTC(new Date(), true);
      equal(date._utc, true, 'utc flag is set');
      equal(run(Object, 'clone', [date])._utc, true, 'should preserve utc flag when set');
    }

  });

  method('toQueryString', function() {

    var date = new Date(2012, 8, 25);

    function assertQueryStringGenerated(obj, args, expected, message) {
      expected = expected.replace(/\[/g, '%5B').replace(/\]/g, '%5D');
      testClassAndInstance(obj, args, expected, message);
    }

    assertQueryStringGenerated({foo:'bar'}, [], 'foo=bar', 'basic string');
    assertQueryStringGenerated({foo:'bar',moo:'car'}, [], 'foo=bar&moo=car', 'two keys');
    assertQueryStringGenerated({foo:'bar',moo:8}, [], 'foo=bar&moo=8', 'one string one numeric');
    assertQueryStringGenerated({foo:'bar3'}, [], 'foo=bar3', 'number in back');
    assertQueryStringGenerated({foo:'3bar'}, [], 'foo=3bar', 'number in front');
    assertQueryStringGenerated({foo: 3}, [], 'foo=3', 'basic number');
    assertQueryStringGenerated({foo: true}, [], 'foo=true', 'basic boolean');
    assertQueryStringGenerated({foo: /reg/}, [], 'foo=%2Freg%2F', 'regexp');
    assertQueryStringGenerated({foo:'a b'}, [], 'foo=a+b', 'should escape string');
    assertQueryStringGenerated({foo: date}, [], 'foo=' + date.getTime(), 'should stringify date');
    assertQueryStringGenerated({foo:['a','b','c']}, [], 'foo[0]=a&foo[1]=b&foo[2]=c', 'basic array');
    assertQueryStringGenerated({foo:{bar:'tee',car:'hee'}}, [], 'foo[bar]=tee&foo[car]=hee', 'basic object');

    assertQueryStringGenerated({foo:undefined}, [], 'foo=', 'undefined');
    assertQueryStringGenerated({foo:false}, [], 'foo=false', 'false');
    assertQueryStringGenerated({foo:null}, [], 'foo=', 'null');
    assertQueryStringGenerated({foo:NaN}, [], 'foo=', 'NaN');
    assertQueryStringGenerated({foo:''}, [], 'foo=', 'empty string');
    assertQueryStringGenerated({foo:0}, [], 'foo=0', '0');
    assertQueryStringGenerated({foo:[['fap','cap']]}, [], 'foo[0][0]=fap&foo[0][1]=cap', 'array double nested');
    assertQueryStringGenerated({foo:[['fap'],['cap']]}, [], 'foo[0][0]=fap&foo[1][0]=cap', 'array horizonal nested');
    assertQueryStringGenerated({foo:{bar:{map:'fap'}}}, [], 'foo[bar][map]=fap', 'object double nested');

    assertQueryStringGenerated({foo:'bar'}, ['paw'], 'paw[foo]=bar', 'namespace | basic string');
    assertQueryStringGenerated({foo:'bar',moo:'car'}, ['paw'], 'paw[foo]=bar&paw[moo]=car', 'namespace | two keys');
    assertQueryStringGenerated({foo:'bar',moo:8}, ['paw'], 'paw[foo]=bar&paw[moo]=8', 'namespace | one string one numeric');
    assertQueryStringGenerated({foo:'bar3'}, ['paw'], 'paw[foo]=bar3', 'namespace | number in back');
    assertQueryStringGenerated({foo:'3bar'}, ['paw'], 'paw[foo]=3bar', 'namespace | number in front');
    assertQueryStringGenerated({foo: 3}, ['paw'], 'paw[foo]=3', 'namespace | basic number');
    assertQueryStringGenerated({foo: true}, ['paw'], 'paw[foo]=true', 'namespace | basic boolean');
    assertQueryStringGenerated({foo: /reg/}, ['paw'], 'paw[foo]=%2Freg%2F', 'namespace | regexp');
    assertQueryStringGenerated({foo:'a b'}, ['paw'], 'paw[foo]=a+b', 'namespace | should escape string');
    assertQueryStringGenerated({foo: date}, ['paw'], 'paw[foo]=' + date.getTime(), 'namespace | should stringify date');
    assertQueryStringGenerated({foo:['a','b','c']}, ['paw'], 'paw[foo][0]=a&paw[foo][1]=b&paw[foo][2]=c', 'namespace | basic array');
    assertQueryStringGenerated({foo:{bar:'tee',car:'hee'}}, ['paw'], 'paw[foo][bar]=tee&paw[foo][car]=hee', 'namespace | basic object');

    assertQueryStringGenerated({foo:undefined}, ['paw'], 'paw[foo]=', 'namespace | undefined');
    assertQueryStringGenerated({foo:false}, ['paw'], 'paw[foo]=false', 'namespace | false');
    assertQueryStringGenerated({foo:null}, ['paw'], 'paw[foo]=', 'namespace | null');
    assertQueryStringGenerated({foo:NaN}, ['paw'], 'paw[foo]=', 'namespace | NaN');
    assertQueryStringGenerated({foo:''}, ['paw'], 'paw[foo]=', 'namespace | empty string');
    assertQueryStringGenerated({foo:0}, ['paw'], 'paw[foo]=0', 'namespace | 0');
    assertQueryStringGenerated({foo:[['fap','cap']]}, ['paw'], 'paw[foo][0][0]=fap&paw[foo][0][1]=cap', 'namespace | array double nested');
    assertQueryStringGenerated({foo:[['fap'],['cap']]}, ['paw'], 'paw[foo][0][0]=fap&paw[foo][1][0]=cap', 'namespace | array horizonal nested');
    assertQueryStringGenerated({foo:{bar:{map:'fap'}}}, ['paw'], 'paw[foo][bar][map]=fap', 'namespace | object double nested');

    assertQueryStringGenerated({'hello there': 'bar'}, [], 'hello+there=bar', 'spaces in key');
    assertQueryStringGenerated({'"/+': 'bar'}, [], '%22%2F%2B=bar', 'key requires encoding');
    assertQueryStringGenerated({'時刻': 'bar'}, [], '%E6%99%82%E5%88%BB=bar', 'Japanese key');
    assertQueryStringGenerated({'%20': 'bar'}, [], '%2520=bar', '%20');

    assertQueryStringGenerated(['a','b','c'], [], '0=a&1=b&2=c', 'straight array no namespace');
    assertQueryStringGenerated(8, [], '', 'straight number no namespace');
    assertQueryStringGenerated(date, [], '', 'straight date no namespace');
    assertQueryStringGenerated({foo:'bar'}, ['萬'], '%E8%90%AC[foo]=bar', 'Japanese characters in the namespace');

    equal(run(Object, 'toQueryString', ['foo']), '', 'straight string no namespace');

    var obj = {
      toString: function() {
        return 'hardyhar';
      }
    }

    assertQueryStringGenerated({foo: obj}, [], 'foo=hardyhar', 'toString object member');

    var Foo = function() {};
    Foo.prototype.toString = function() {
      return 'custom';
    }

    assertQueryStringGenerated({foo: new Foo}, [], 'foo=custom', 'toString inherited method');

  });

  method('map', function() {
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

    testClassAndInstance(obj1, [function(k, v) { return v * 2; }], {foo:6,bar:8,moo:10,car:12}, 'function');
    testClassAndInstance(obj1, ['toString'], {foo:'3',bar:'4',moo:'5',car:'6'}, 'string shortcut');
    testClassAndInstance(obj1, [], obj1, 'no args');
    testClassAndInstance(obj2, [function(k, v) { return v.age; }], {foo:11,bar:22,moo:33,car:44}, 'mapping nested properties');
    testClassAndInstance(obj2, ['age'], {foo:11,bar:22,moo:33,car:44}, 'mapping nested properties with string shortcut');
  });

  method('size', function() {
    testClassAndInstance({}, [], 0, 'empty object');
    testClassAndInstance({foo:'bar'}, [], 1, '1 property');
    testClassAndInstance({foo:'bar',moo:'car'}, [], 2, '2 properties');
    testClassAndInstance({foo:1}, [], 1, 'numbers');
    testClassAndInstance({foo:/bar/}, [], 1, 'regexes');
    testClassAndInstance({foo:function(){}}, [], 1, 'functions');
    testClassAndInstance({foo:{bar:'car'}}, [], 1, 'nested object');
    testClassAndInstance({foo:[1]}, [], 1, 'nested array');
    testClassAndInstance(['a'], [], 1, 'array');
    testClassAndInstance(['a','b'], [], 2, 'array 2 elements');
    testClassAndInstance(['a','b','c'], [], 3, 'array 3 elements');
    testClassAndInstance('foo', [], 3, 'string primitive');
    testClassAndInstance(new String('foo'), [], 3, 'string object');
    testClassAndInstance(1, [], 0, 'number primitive');
    testClassAndInstance(new Number(1), [], 0, 'number object');
    testClassAndInstance(true, [], 0, 'boolean primitive');
    testClassAndInstance(new Boolean(true), [], 0, 'boolean object');
    testClassAndInstance(null, [], 0, 'null');
    testClassAndInstance(undefined, [], 0, 'undefined');

    var Foo = function(){};
    testClassAndInstance(new Foo, [], 0, 'class instances');

    var Foo = function(a){ this.a = a; };
    testClassAndInstance(new Foo, [], 1, 'class instances with a single property');
  });

  method('each', function() {
    var fn = function () {}, callback, result;
    var d = new Date();
    var obj = {
      number: 3,
      person: 'jim',
      date: d,
      func: fn
    };

    var keys = ['number','person','date','func'];
    var values = [3, 'jim', d, fn];
    var count = 0;

    count = 0;
    callback = function(key, value, o) {
      equal(key, keys[count], 'accepts a block');
      equal(value, values[count], 'accepts a block');
      equal(o, obj, 'accepts a block | object is third param');
      count++;
    }
    result = run(Object, 'each', [obj, callback]);
    equal(count, 4, 'accepts a block | iterated properly');
    equal(result, obj, 'accepts a block | result should equal object passed in');

    raisesError(function(){
      run(Object, 'each', [{foo:'bar'}]);
    }, 'no iterator raises an error');

    testClassAndInstance(obj, [function () {}], obj, 'each returns itself');
  });


});
