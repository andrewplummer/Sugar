package('Object', function() {

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

  testClassAndInstance('any', obj1, function(key, value, o) {
    equal(typeof key, 'string', 'Object enumerable methods | first argument is always the key');
    equal(value, obj1[key],     'Object enumerable methods | second argument is always the value');
    equal(o, obj1,              'Object enumerable methods | third argument is always the original object');
    equal(this, obj1,           'Object enumerable methods | "this" is always the original object');
    return true;
  }, true, 'Object.any | placeholder for callback arguments');

  testClassAndInstance('map', obj1, function(k, v) { return v * 2; }, {foo:6,bar:8,moo:10,car:12}, 'Object.map | function');
  testClassAndInstance('map', obj1, 'toString', {foo:'3',bar:'4',moo:'5',car:'6'}, 'Object.map | string shortcut');
  testClassAndInstance('map', obj1, [], obj1, 'Object.map | no args');
  testClassAndInstance('map', obj2, function(k, v) { return v.age; }, {foo:11,bar:22,moo:33,car:44}, 'Object.map | mapping nested properties');
  testClassAndInstance('map', obj2, 'age', {foo:11,bar:22,moo:33,car:44}, 'Object.map | mapping nested properties with string shortcut');

  testClassAndInstance('any', obj1, function(key, value) { return key == 'foo'; }, true, 'Object.any | key is foo');
  testClassAndInstance('any', obj1, function(key, value) { return key.length > 3; }, false, 'Object.any | key length is greater than 3');
  testClassAndInstance('any', obj1, function(key, value) { return key.length > 0; }, true, 'Object.any | key length is greater than 0');
  testClassAndInstance('any', obj1, function(key, value) { return value > 0; }, true, 'Object.any | value is greater than 0');
  testClassAndInstance('any', obj1, function(key, value) { return value > 5; }, true, 'Object.any | value is greater than 5');
  testClassAndInstance('any', obj1, function(key, value) { return value > 6; }, false, 'Object.any | value is greater than 6');
  testClassAndInstance('any', obj1, 5, true,  'Object.any | shortcut | 5');
  testClassAndInstance('any', obj1, 7, false, 'Object.any | shortcut | 7');

  testClassAndInstance('all', obj1, function(key, value) { return key == 'foo'; }, false, 'Object.all | key is foo');
  testClassAndInstance('all', obj1, function(key, value) { return key.length > 3; }, false, 'Object.all | key length is greater than 3');
  testClassAndInstance('all', obj1, function(key, value) { return key.length > 0; }, true, 'Object.all | key length is greater than 0');
  testClassAndInstance('all', obj1, function(key, value) { return value > 0; }, true, 'Object.all | value is greater than 0');
  testClassAndInstance('all', obj1, function(key, value) { return value > 5; }, false, 'Object.all | value is greater than 5');
  testClassAndInstance('all', obj1, function(key, value) { return value > 6; }, false, 'Object.all | value is greater than 6');
  testClassAndInstance('all', obj1, 5, false,  'Object.all | shortcut | 5');
  testClassAndInstance('all', obj1, 7, false, 'Object.all | shortcut | 7');

  testClassAndInstance('none', obj1, function(key, value) { return key == 'foo'; }, false, 'Object.none | key is foo');
  testClassAndInstance('none', obj1, function(key, value) { return key.length > 3; }, true, 'Object.none | key length is greater than 3');
  testClassAndInstance('none', obj1, function(key, value) { return key.length > 0; }, false, 'Object.none | key length is greater than 0');
  testClassAndInstance('none', obj1, function(key, value) { return value > 0; }, false, 'Object.none | value is greater than 0');
  testClassAndInstance('none', obj1, function(key, value) { return value > 5; }, false, 'Object.none | value is greater than 5');
  testClassAndInstance('none', obj1, function(key, value) { return value > 6; }, true, 'Object.none | value is greater than 6');
  testClassAndInstance('none', obj1, 5, false,  'Object.none | shortcut | 5');
  testClassAndInstance('none', obj1, 7, true, 'Object.none | shortcut | 7');

  testClassAndInstance('count', obj1, function(key, value) { return key == 'foo'; }, 1, 'Object.count | key is foo');
  testClassAndInstance('count', obj1, function(key, value) { return key.length > 3; }, 0, 'Object.count | key length is greater than 3');
  testClassAndInstance('count', obj1, function(key, value) { return key.length > 0; }, 4, 'Object.count | key length is greater than 0');
  testClassAndInstance('count', obj1, function(key, value) { return value > 0; }, 4, 'Object.count | value is greater than 0');
  testClassAndInstance('count', obj1, function(key, value) { return value > 5; }, 1, 'Object.count | value is greater than 5');
  testClassAndInstance('count', obj1, function(key, value) { return value > 6; }, 0, 'Object.count | value is greater than 6');
  testClassAndInstance('count', obj1, 5, 1,  'Object.count | shortcut | 5');
  testClassAndInstance('count', obj1, 7, 0, 'Object.count | shortcut | 7');

  testClassAndInstance('sum', obj1, [], 18, 'Object.sum | no args is sum of values');
  testClassAndInstance('sum', obj1, function(key, value) { return value; }, 18, 'Object.sum | key is foo');
  testClassAndInstance('sum', obj1, function(key, value) { return key === 'foo' ? value : 0; }, 3, 'Object.sum | key is foo');
  testClassAndInstance('sum', obj2, 'age', 110, 'Object.sum | accepts a string shortcut');

  testClassAndInstance('average', obj1, [], 4.5, 'Object.average | no args is average of values');
  testClassAndInstance('average', obj1, function(key, value) { return value; }, 4.5, 'Object.average | key is foo');
  testClassAndInstance('average', obj1, function(key, value) { return key === 'foo' ? value : 0; }, .75, 'Object.average | key is foo');
  testClassAndInstance('average', obj2, 'age', 27.5, 'Object.average | accepts a string shortcut');

  testClassAndInstance('find', obj1, function(key, value) { return key == 'foo'; }, 'foo', 'Object.find | key is foo');
  testClassAndInstance('find', obj1, function(key, value) { return key.length > 3; }, undefined, 'Object.find | key length is greater than 3');
  testClassAndInstance('find', obj1, function(key, value) { return key.length > 0; }, 'foo', 'Object.find | key length is greater than 0');
  testClassAndInstance('find', obj1, function(key, value) { return value > 0; }, 'foo', 'Object.find | value is greater than 0');
  testClassAndInstance('find', obj1, function(key, value) { return value > 5; }, 'car', 'Object.find | value is greater than 5');
  testClassAndInstance('find', obj1, function(key, value) { return value > 6; }, undefined, 'Object.find | value is greater than 6');
  testClassAndInstance('find', obj1, 5, 'moo',  'Object.find | shortcut | 5');
  testClassAndInstance('find', obj1, 7, undefined, 'Object.find | shortcut | 7');
  testClassAndInstance('find', {foo:'bar'}, /b/, 'foo', 'Object.find | uses multi-match');

  testClassAndInstance('findAll', obj1, function(key, value) { return key == 'foo'; }, {foo:3}, 'Object.findAll | key is foo');
  testClassAndInstance('findAll', obj1, function(key, value) { return key.length > 3; }, {}, 'Object.findAll | key length is greater than 3');
  testClassAndInstance('findAll', obj1, function(key, value) { return key.length > 0; }, obj1, 'Object.findAll | key length is greater than 0');
  testClassAndInstance('findAll', obj1, function(key, value) { return value > 0; }, obj1, 'Object.findAll | value is greater than 0');
  testClassAndInstance('findAll', obj1, function(key, value) { return value > 5; }, {car:6}, 'Object.findAll | value is greater than 5');
  testClassAndInstance('findAll', obj1, function(key, value) { return value > 6; }, {}, 'Object.findAll | value is greater than 6');
  testClassAndInstance('findAll', obj1, 5, {moo:5},  'Object.findAll | shortcut | 5');
  testClassAndInstance('findAll', obj1, 7, {}, 'Object.findAll | shortcut | 7');
  testClassAndInstance('findAll', {foo:'bar',moo:'car'}, /a/, {foo:'bar',moo:'car'}, 'Object.findAll | uses multi-match');

  var obj3 = testClone(obj1); obj3['blue'] = 4;
  var obj4 = testClone(obj2); obj4['blue'] = {age:11};

  testClassAndInstance('min', obj3, [], 'foo', 'Object.min | no args is min of values');
  testClassAndInstance('min', obj3, function(key, value) { return value; }, 'foo', 'Object.min | return value');
  testClassAndInstance('min', obj3, function(key, value) { return key.length; }, 'foo', 'Object.min | return key.length');
  testClassAndInstance('min', obj3, [function(key, value) { return key.length; }, true], {foo:3,bar:4,moo:5,car:6}, 'Object.min | return key.length');
  testClassAndInstance('min', obj3, [function(key, value) { return key.charCodeAt(0); }, true], {bar: 4,blue:4}, 'Object.min | all | return the char code of first letter');
  testClassAndInstance('min', obj4, 'age', 'foo', 'Object.min | accepts a string shortcut');
  testClassAndInstance('min', obj4, ['age', true], {foo: {age:11},blue:{age:11}}, 'Object.min | all | accepts a string shortcut');


  testClassAndInstance('max', obj3, [], 'car', 'Object.max | no args is first object');
  testClassAndInstance('max', obj3, [function(key, value) { return value; }], 'car', 'Object.max | return value');
  testClassAndInstance('max', obj3, [function(key, value) { return key.length; }], 'blue', 'Object.max | return key.length');
  testClassAndInstance('max', obj3, [function(key, value) { return key.charCodeAt(0); }], 'moo', 'Object.max | return the char code of first letter');
  testClassAndInstance('max', obj4, ['age'], 'car', 'Object.max | accepts a string shortcut');


  testClassAndInstance('max', obj3, [function(key, value) { return value; }, true], {car:6}, 'Object.max | all | return value');
  testClassAndInstance('max', obj3, [function(key, value) { return key.length; }, true], {blue:4}, 'Object.max | all | return key.length');
  testClassAndInstance('max', obj3, [function(key, value) { return key.charCodeAt(0); }, true], {moo:5}, 'Object.max | all | return the char code of first letter');
  testClassAndInstance('max', obj4, ['age', true], {car:{age:44}}, 'Object.max | all | accepts a string shortcut');

  testClassAndInstance('least', obj3, [], 'foo', 'Object.least | no args is least of values');
  testClassAndInstance('least', obj3, function(key, value) { return value; }, 'foo', 'Object.least | return value');
  testClassAndInstance('least', obj3, function(key, value) { return key.length; }, 'blue', 'Object.least | return key.length');
  testClassAndInstance('least', obj4, 'age', 'bar', 'Object.least | accepts a string shortcut');

  testClassAndInstance('least', obj3, [function(key, value) { return value; }, true], {foo:3,moo:5,car:6}, 'Object.least | all | return value');
  testClassAndInstance('least', obj3, [function(key, value) { return key.length; }, true], {blue:4}, 'Object.least | all | return key.length');
  testClassAndInstance('least', obj4, ['age', true], {bar: {age:22},moo:{age:33},car:{age:44}}, 'Object.least | all | accepts a string shortcut');

  testClassAndInstance('most', obj3, [], 'bar', 'Object.most | no args is most of values');
  testClassAndInstance('most', obj3, function(key, value) { return value; }, 'bar', 'Object.most | return value');
  testClassAndInstance('most', obj3, function(key, value) { return key.length; }, 'foo', 'Object.most | return key.length');
  testClassAndInstance('most', obj3, function(key, value) { return key.charCodeAt(0); }, 'bar', 'Object.most | return the char code of first letter');
  testClassAndInstance('most', obj4, 'age', 'foo', 'Object.most | accepts a string shortcut');

  testClassAndInstance('most', obj3, [function(key, value) { return value; }, true], {bar: 4,blue:4}, 'Object.most | all | return value');
  testClassAndInstance('most', obj3, [function(key, value) { return key.length; }, true], {foo:3,bar:4,moo:5,car:6}, 'Object.most | all | return key.length');
  testClassAndInstance('most', obj3, [function(key, value) { return key.charCodeAt(0); }, true], {bar: 4,blue:4}, 'Object.most | all | return the char code of first letter');
  testClassAndInstance('most', obj4, ['age', true], {foo: {age:11},blue:{age:11}}, 'Object.most | all | accepts a string shortcut');

  testClassAndInstance('reduce', obj1, [function(acc, b) { return acc + b; }], 18, 'Object.reduce | obj1 | default');
  testClassAndInstance('reduce', obj1, [function(acc, b) { return acc + b; }, 10], 28, 'Object.reduce | obj1 | with initial');
  testClassAndInstance('reduce', obj1, [function(acc, b) { return acc - b; }], -12, 'Object.reduce | obj1 | a - b');
  testClassAndInstance('reduce', obj1, [function(acc, b) { return acc - b; }, 10], -8, 'Object.reduce | obj1 | a - b with initial');
  testClassAndInstance('reduce', obj1, [function(acc, b) { return acc * b; }, 0], 0, 'Object.reduce | obj1 | a * b with 0 initial is 0');

  testClassAndInstance('reduce', obj2, [function(acc, b) { return (acc.age ? acc.age : acc) + b.age; }], 110, 'Object.reduce | obj2 | a + b');
  testClassAndInstance('reduce', obj2, [function(acc, b) { return acc - b.age; }, 10], -100, 'Object.reduce | obj2 | a - b with initial');


  testClassAndInstance('isEmpty', {}, [], true, 'object is empty');
  testClassAndInstance('isEmpty', { broken: 'wear' }, [], false, 'object is not empty');
  testClassAndInstance('isEmpty', { length: 0 }, [], false, 'simple object with length property is not empty');
  testClassAndInstance('isEmpty', { foo: null }, [], false, 'null is still counted');
  testClassAndInstance('isEmpty', { foo: undefined }, [], false, 'undefined is still counted');
  testClassAndInstance('isEmpty', { foo: NaN }, [], false, 'undefined is still counted');
  testClassAndInstance('isEmpty', [], [], true, 'empty array is empty');
  testClassAndInstance('isEmpty', null, [], true, 'null is empty');
  testClassAndInstance('isEmpty', undefined, [], true, 'undefined is empty');
  testClassAndInstance('isEmpty', '', [], true, 'empty string is empty');
  testClassAndInstance('isEmpty', new String(''), [], true, 'empty string object is empty');
  testClassAndInstance('isEmpty', 'wasabi', [], false, 'non-empty string is not empty');
  testClassAndInstance('isEmpty', new String('wasabi'), [], false, 'non-empty string object is not empty');
  testClassAndInstance('isEmpty', NaN, [], true, 'NaN is empty');
  testClassAndInstance('isEmpty', 8, [], true, '8 is empty');
  testClassAndInstance('isEmpty', new Number(8), [], true, '8 object is empty');

  testClassAndInstance('size', {}, [], 0, 'Object.size | empty object');
  testClassAndInstance('size', {foo:'bar'}, [], 1, 'Object.size | 1 property');
  testClassAndInstance('size', {foo:'bar',moo:'car'}, [], 2, 'Object.size | 2 properties');
  testClassAndInstance('size', {foo:1}, [], 1, 'Object.size | numbers');
  testClassAndInstance('size', {foo:/bar/}, [], 1, 'Object.size | regexes');
  testClassAndInstance('size', {foo:function(){}}, [], 1, 'Object.size | functions');
  testClassAndInstance('size', {foo:{bar:'car'}}, [], 1, 'Object.size | nested object');
  testClassAndInstance('size', {foo:[1]}, [], 1, 'Object.size | nested array');
  testClassAndInstance('size', ['a'], [], 1, 'Object.size | array');
  testClassAndInstance('size', ['a','b'], [], 2, 'Object.size | array 2 elements');
  testClassAndInstance('size', ['a','b','c'], [], 3, 'Object.size | array 3 elements');
  testClassAndInstance('size', 'foo', [], 3, 'Object.size | string primitive');
  testClassAndInstance('size', new String('foo'), [], 3, 'Object.size | string object');
  testClassAndInstance('size', 1, [], 0, 'Object.size | number primitive');
  testClassAndInstance('size', new Number(1), [], 0, 'Object.size | number object');
  testClassAndInstance('size', true, [], 0, 'Object.size | boolean primitive');
  testClassAndInstance('size', new Boolean(true), [], 0, 'Object.size | boolean object');
  testClassAndInstance('size', null, [], 0, 'Object.size | null');
  testClassAndInstance('size', undefined, [], 0, 'Object.size | undefined');

  var Foo = function(){};
  testClassAndInstance('size', new Foo, [], 0, 'Object.size | class instances');

  var Foo = function(a){ this.a = a; };
  testClassAndInstance('size', new Foo, [], 1, 'Object.size | class instances with a single property');


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

    testClassAndInstance('each', obj, [function () {}], obj, 'Object.size | each returns itself');
  });

});

