namespace('Array', function() {
  'use strict';


  method('least', function() {

    var fn, arr;
    var people = [
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'ronnie', age: 13, hair: 'brown'  },
      { name: 'edmund', age: 27, hair: 'blonde' }
    ];

    test([1,2,3], [], 1, 'null');
    test([1,2,3], [null], 1, 'null');
    test([1,2,3], oneUndefined, 1, 'undefined');
    test([1,2,3], [4], 1, 'number');

    test(people, people[0], 'contains mary | does not return most');

    fn = function(person) {
      return person.age;
    }
    arr = run(people, 'least', [true, fn]);
    arr.sort(function(a, b) {
      return a.name > b.name;
    });
    assertArrayEquivalent(arr, [people[1], people[2]], 'contains mary and ronnie');

    arr.sort(function(a, b) {
      return a.age - b.age;
    });
    equal(arr, [{name:'ronnie',age:13,hair:'brown'}, {name:'mary',age:52,hair:'blonde'}], 'age and sorted by age');

    test(people, [function(person) { return person.hair; }], people[0], 'hair');
    notEqual(run(people, 'least', [function(person) { return person.age; }]).age, 27, 'map age | does not return most');

    test([], undefined, 'empty array');
    test([1,2,3], 1, '1,2,3');
    test([1,2,3,3], 1, '1,2,3,3');
    test([1,2,3,3], [true, function(n){ return n; }], [1,2], '1,2,3,3 | all');
    test([1,1,2,3,3], 2, '1,1,2,3,3');
    test([1,1,1,2,2,3,3,3], 2, '1,1,1,2,2,3,3,3');
    test(['a','b','c'], 'a', 'a,b,c');
    test(['a','b','c','c'], 'a', 'a,b,c,c');
    test(['a','b','c','c'], [true, function(n) { return n; }], ['a','b'], 'a,b,c,c | all');
    test(['a','a','b','c','c'], 'b', 'a,a,b,c,c');

    fn = function(el,i,a) {
      equal(this, [1], 'scope should be the array');
      equal(i, 0, 'second param should be the index');
      equal(a, [1], 'third param should also be the array');
      return el;
    };
    run([1], 'least', [fn]);

    var arr = [
      {id:1,a:{b:{c:6}}},
      {id:2,a:{b:{c:4}}},
      {id:3,a:{b:{c:4}}},
      {id:4,a:{b:{c:4}}}
    ];
    test(arr, ['a.b.c'], {id:1,a:{b:{c:6}}}, 'by deep dot operator');
    test(arr, [true, 'a.b.c'], [{id:1,a:{b:{c:6}}}], 'by deep dot operator multiple');

  });

  method('most', function() {
    var people = [
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'ronnie', age: 13, hair: 'brown'  },
      { name: 'edmund', age: 27, hair: 'blonde' }
    ];

    test([1,2,3], [null], 1, 'null | returns first');
    test([1,2,3], oneUndefined, 1, 'undefined | returns first');
    test([1,2,3], [4], 1, 'number | returns first');

    equal(run(people, 'most', [function(person) { return person.age; }]).age, 27, 'age | age is 27');
    test(people, [true, function(person) { return person.age; }], [{name:'jim',age:27,hair:'brown'},{name:'edmund',age:27,hair:'blonde'}], 'age | returns all');
    test(people, [function(person) { return person.hair; }], {name:'jim',age:27,hair:'brown'}, 'hair');

    test([], undefined, 'empty array');
    test([1,2,3], 1, '1,2,3');
    test([1,2,3,3], 3, '1,2,3,3');
    test([1,1,2,3,3], 1, '1,1,2,3,3 | first');
    test([1,1,2,3,3], [true, function(n) { return n; }], [1,1,3,3], '1,1,2,3,3 | all');
    test(['a','b','c'], 'a', 'a,b,c');
    test(['a','b','c','c'], 'c', 'a,b,c,c');
    test(['a','a','b','c','c'], 'a', 'a,a,b,c,c | first');
    test(['a','a','b','c','c'], [true, function(s){ return s; }], ['a','a','c','c'], 'a,a,b,c,c | all');

    var fn = function(el,i,a) {
      equal(this, [1], 'scope should be the array');
      equal(i, 0, 'second param should be the index');
      equal(a, [1], 'third param should also be the array');
      return el;
    };
    run([1], 'most', [fn]);

    var arr = [
      {id:1,a:{b:{c:6}}},
      {id:2,a:{b:{c:4}}},
      {id:3,a:{b:{c:4}}},
      {id:4,a:{b:{c:4}}}
    ];
    test(arr, ['a.b.c'], {id:2,a:{b:{c:4}}}, 'by deep dot operator');
    test(arr, [true, 'a.b.c'], [{id:2,a:{b:{c:4}}},{id:3,a:{b:{c:4}}},{id:4,a:{b:{c:4}}}], 'by deep dot operator multiple');

  });

});

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

    test(obj1, [function(val, key) { return val * 2; }], {foo:6,bar:8,moo:10,car:12}, 'function');
    test(obj1, ['toString'], {foo:'3',bar:'4',moo:'5',car:'6'}, 'string shortcut');
    test(obj1, [], obj1, 'no args');
    test(obj2, [function(val, key) { return val.age; }], {foo:11,bar:22,moo:33,car:44}, 'mapping nested properties');
    test(obj2, ['age'], {foo:11,bar:22,moo:33,car:44}, 'mapping nested properties with string shortcut');

    var obj = {
     foo:{a:{b:{c:11}}},
     bar:{a:{b:{c:22}}},
     moo:{a:{b:{c:33}}},
     car:{a:{b:{c:44}}}
    }

    test(obj, ['a.b.c'], {foo:11,bar:22,moo:33,car:44}, 'mapping shortcut can go deep with dot syntax');

  });

  method('forEach', function() {

    var fn = function() {};
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
    var callback = function(val, key, o) {
      equal(key, keys[count], 'accepts a function');
      equal(val, values[count], 'accepts a function');
      equal(o, obj, 'accepts a function | object is third param');
      count++;
    }
    var result = run(obj, 'forEach', [callback]);
    equal(count, 4, 'accepts a function | iterated properly');
    equal(result, obj, 'accepts a function | result should equal object passed in');

    raisesError(function(){
      run({foo:'bar'}, 'forEach', []);
    }, 'no iterator raises an error');

    test(obj, [function() {}], obj, 'each returns itself');

    var count = 0;
    var callback = function() { count++; return false; }
    run({foo:'bar',moo:'bap'}, 'forEach', [callback]);
    equal(count, 2, 'returning false should not break the loop');

    var count = 0;
    var callback = function() { count++; return false; }
    run({toString:1,valueOf:2,hasOwnProperty:3}, 'forEach', [callback]);
    equal(count, 3, 'returning false with dontenum properties');

  });

  method('some', function() {

    var xyz = {x:'x',y:'y',z:'z'};

    test(obj1, [function(val, key) { return key == 'foo'; }], true, 'key is foo');
    test(obj1, [function(val, key, o) {
      equal(val, obj1[key], 'first argument is the value');
      equal(typeof key, 'string', 'second argument is the key');
      equal(o, obj1, 'third argument is the original object');
      equal(this, obj1, '"this" is the original object');
      return true;
    }], true, 'placeholder for callback arguments');
    test(obj1, [function(val, key) { return key == 'foo'; }], true, 'key is foo');
    test(obj1, [function(val, key) { return key.length > 3; }], false, 'key length is greater than 3');
    test(obj1, [function(val, key) { return key.length > 0; }], true, 'key length is greater than 0');
    test(obj1, [function(val, key) { return val > 0; }], true, 'value is greater than 0');
    test(obj1, [function(val, key) { return val > 5; }], true, 'value is greater than 5');
    test(obj1, [function(val, key) { return val > 6; }], false, 'value is greater than 6');
    test(obj1, [2], true,  'shortcut | 2');
    test(obj1, [7], false, 'shortcut | 7');

    var count = 0;
    var callback = function() { count++; return true; }
    run(xyz, 'some', [callback]);
    equal(count, 1, 'using return value to break out of the loop');

  });

  method('every', function() {
    test(obj1, [function(val, key) { return key == 'foo'; }], false, 'key is foo');
    test(obj1, [function(val, key) { return key.length > 3; }], false, 'key length is greater than 3');
    test(obj1, [function(val, key) { return key.length > 0; }], true, 'key length is greater than 0');
    test(obj1, [function(val, key) { return val > 0; }], true, 'value is greater than 0');
    test(obj1, [function(val, key) { return val > 5; }], false, 'value is greater than 5');
    test(obj1, [function(val, key) { return val > 6; }], false, 'value is greater than 6');
    test(obj1, [2], false,  'shortcut | 2');
    test(obj1, [7], false, 'shortcut | 7');
  });

  method('find', function() {
    test(obj1, [function(val, key) { return key == 'foo'; }], 'foo', 'key is foo');
    test(obj1, [function(val, key) { return key.length > 3; }], undefined, 'key length is greater than 3');
    test(obj1, [function(val, key) { return key.length > 0; }], 'foo', 'key length is greater than 0');
    test(obj1, [function(val, key) { return val > 0; }], 'foo', 'value is greater than 0');
    test(obj1, [function(val, key) { return val > 5; }], 'moo', 'value is greater than 5');
    test(obj1, [function(val, key) { return val > 6; }], undefined, 'value is greater than 6');
    test(obj1, [2], 'foo',  'shortcut | 2');
    test(obj1, [7], undefined, 'shortcut | 7');
    test({foo:'bar'}, [/b/], 'foo', 'uses multi-match');
  });

  method('filter', function() {
    test(obj1, [function(val, key) { return key == 'foo'; }], {foo:2}, 'key is foo');
    test(obj1, [function(val, key) { return key.length > 3; }], {}, 'key length is greater than 3');
    test(obj1, [function(val, key) { return key.length > 0; }], obj1, 'key length is greater than 0');
    test(obj1, [function(val, key) { return val > 0; }], obj1, 'value is greater than 0');
    test(obj1, [function(val, key) { return val > 5; }], {moo:6,car:6}, 'value is greater than 5');
    test(obj1, [function(val, key) { return val > 6; }], {}, 'value is greater than 6');
    test(obj1, [2], {foo:2},  'shortcut | 2');
    test(obj1, [7], {}, 'shortcut | 7');
    test({foo:'bar',moo:'car'}, [/a/], {foo:'bar',moo:'car'}, 'uses multi-match');
    test(obj2, [{age:11}], {foo:{age:11}},  'shortcut | object matcher');
  });

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

  method('least', function() {
    test(obj3, [], 'foo', 'no args is least of values');
    test(obj3, [function(val, key) { return val; }], 'foo', 'return value');
    test(obj3, [function(val, key) { return key.length; }], 'blue', 'return key.length');
    test(obj4, ['age'], 'bar', 'accepts a string shortcut');
    test(obj3, [true, function(val, key) { return val; }], {foo:2}, 'all | return value');
    test(obj3, [true, function(val, key) { return key.length; }], {blue:4}, 'all | return key.length');
    test(obj4, [true, 'age'], {bar: {age:22},moo:{age:33},car:{age:44}}, 'all | accepts a string shortcut');
    test(deepObj4, [true, 'user.age'], {bar:{user:{age:22}},moo:{user:{age:33}},car:{user:{age:44}}}, 'all | accepts a deep string shortcut');
  });

  method('most', function() {
    test(obj3, [], 'bar', 'no args is most of values');
    test(obj3, [function(val, key) { return val; }], 'bar', 'return value');
    test(obj3, [function(val, key) { return key.length; }], 'foo', 'return key.length');
    test(obj3, [function(val, key) { return key.charCodeAt(0); }], 'bar', 'return the char code of first letter');
    test(obj4, ['age'], 'foo', 'accepts a string shortcut');
    test(obj3, [true, function(val, key) { return val; }], {bar:4,blue:4,moo:6,car:6}, 'all | return value');
    test(obj3, [true, function(val, key) { return key.length; }], {foo:2,bar:4,moo:6,car:6}, 'all | return key.length');
    test(obj3, [true, function(val, key) { return key.charCodeAt(0); }], {bar: 4,blue:4}, 'all | return the char code of first letter');
    test(obj4, [true, 'age'], {foo: {age:11},blue:{age:11}}, 'all | accepts a string shortcut');
    test(deepObj4, [true, 'user.age'], {foo:{user:{age:11}},blue:{user:{age:11}}}, 'all | accepts a deep string shortcut');
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
