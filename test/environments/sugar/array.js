package('Array', function () {

  var sparseArraySupport = 0 in [undefined];

  // Using [] or the constructor "new Array" will cause this test to fail in IE7/8. Evidently passing undefined to the
  // constructor will not push undefined as expected, however the length property will still appear as if it was pushed.
  // arr = [undefined, undefined, undefined];
  //
  // However we can do it this way, which is a much more likely user scenario in any case:
  var arrayOfUndefined = [];
  arrayOfUndefined.push(undefined);
  arrayOfUndefined.push(undefined);
  arrayOfUndefined.push(undefined);

  var arrayOfUndefinedWith1 = [1];
  arrayOfUndefinedWith1.push(undefined);


  method('every', function() {
    var fn, arr;

    test([1,1,1], [1], true, 'accepts a number shortcut match');
    test([1,1,2], [1], false, 'accepts a number shortcut no match');
    test(['a','a','a'], ['a'], true, 'accepts a string shortcut match');
    test(['a','b','a'], ['a'], false, 'accepts a string shortcut no match');
    test(['a','b','c'], [/[a-f]/], true, 'accepts a regex shortcut match');
    test(['a','b','c'], [/[m-z]/], false, 'accepts a regex shortcut no match');
    test([{a:1},{a:1}], [{a:1}], true, 'checks objects match');
    test([{a:1},{a:2}], [{a:1}], false, 'checks object no match');

    fn = function(el) {
      return el >= 10;
    }

    test([12,5,8,130,44], [fn], false, 'not every element is greater than 10');
    test([12,54,18,130,44], [fn], true, 'every element is greater than 10');

    test(arrayOfUndefined, [undefined], true, 'all undefined');
    test(['a', 'b'], [undefined], false, 'none undefined');

    arr = testClone(arrayOfUndefined);
    arr.push('a');

    test(arr, [undefined], false, 'every undefined');

    fn = function(el, i, a) {
      equal(el, 'a', 'First parameter is the element');
      equal(i, 0, 'Second parameter is the index');
      equal(a, ['a'], 'Third parameter is the array');
      equal(this.toString(), 'this', 'Scope is passed properly');
    }
    run(['a'], 'every', [fn, 'this']);

    test([{name:'john',age:25}], [{name:'john',age:25}], true, 'handles complex objects');
    test([{name:'john',age:25},{name:'fred',age:85}], ['age'], false, 'simple string mistakenly passed for complex objects');
    test([{name:'john',age:25},{name:'fred',age:85}], [{name:'john',age:25}], false, "john isn't all");
  });


  method('all', function() {
    test([{name:'john',age:25}], [{name:'john',age:25}], true, 'handles complex objects');
    test([{name:'john',age:25},{name:'fred',age:85}], ['age'], false, 'simple string mistakenly passed for complex objects');
    test([{name:'john',age:25},{name:'fred',age:85}], [{name:'john',age:25}], false, "john isn't all");
  });

  method('some', function() {
    var arr;

    test([1,2,3], [1], true, 'accepts a number shortcut match');
    test([2,3,4], [1], false, 'accepts a number shortcut no match');
    test(['a','b','c'], ['a'], true, 'accepts a string shortcut match');
    test(['b','c','d'], ['a'], false, 'accepts a string shortcut no match');
    test(['a','b','c'], [/[a-f]/], true, 'accepts a regex shortcut match');
    test(['a','b','c'], [/[m-z]/], false, 'accepts a regex shortcut no match');
    test([{a:1},{a:2}], [{a:1}], true, 'checks objects match');
    test([{a:2},{a:3}], [{a:1}], false, 'checks object no match');

    test([12,5,8,130,44], [function(el, i, a) { return el > 10 }], true, 'some elements are greater than 10');
    test([12,5,8,130,44], [function(el, i, a) { return el < 10 }], true, 'some elements are less than 10');
    test([12,54,18,130,44], [function(el, i, a) { return el >= 10 }], true, 'all elements are greater than 10');
    test([12,5,8,130,44], [function(el, i, a) { return el < 4 }], false, 'no elements are less than 4');
    test([], [function(el, i, a) { return el > 10 }], false, 'no elements are greater than 10 in an empty array');

    test(arrayOfUndefined, [undefined], true, 'all undefined');
    test(['a', 'b'], [undefined], false, 'none undefined');

    arr = testClone(arrayOfUndefined);
    arr.push('a');

    test(arr, [undefined], true, 'some undefined');

    fn = function(el, i, a) {
      equal(el, 'a', 'first parameter is the element');
      equal(i, 0, 'second parameter is the index');
      equal(a, ['a'], 'third parameter is the array');
      equal(this.toString(), 'this', 'scope is passed properly');
    }

    run(['a'], 'some', [fn, 'this']);

    test([{name:'john',age:25}], [{name:'john',age:25}], true, 'handles complex objects');
    test([{name:'john',age:25},{name:'fred',age:85}], ['age'], false, 'simple string mistakenly passed for complex objects');
    test([{name:'john',age:25},{name:'fred',age:85}], [{name:'john',age:25}], true, 'john can be found ');


  });

  method('any', function() {
    test([{name:'john',age:25}], [{name:'john',age:25}], true, 'handles complex objects');
    test([{name:'john',age:25},{name:'fred',age:85}], ['age'], false, 'simple string mistakenly passed for complex objects');
    test([{name:'john',age:25},{name:'fred',age:85}], [{name:'john',age:25}], true, 'john can be found ');
  });

  method('filter', function() {
    var fn;

    test([1,2,3], [1], [1], 'accepts a number shortcut match');
    test([2,3,4], [1], [], 'accepts a number shortcut no match');
    test(['a','b','c'], ['a'], ['a'], 'accepts a string shortcut match');
    test(['b','c','d'], ['a'], [], 'accepts a string shortcut no match');
    test(['a','b','c'], [/[a-f]/], ['a','b','c'], 'accepts a regex shortcut match');
    test(['a','b','c'], [/[m-z]/], [], 'accepts a regex shortcut no match');
    test([{a:1},{a:2}], [{a:1}], [{a:1}], 'checks objects match');
    test([{a:2},{a:3}], [{a:1}], [], 'checks object no match');

    test([12,4,8,130,44], [function(el, i, a) { return el > 10 }], [12,130,44], 'numbers above 10');
    test([12,4,8,130,44], [function(el, i, a) { return el < 10 }], [4,8], 'numbers below 10');

    fn = function(el, i, a) {
      equal(el, 'a', 'first parameter is the element');
      equal(i, 0, 'second parameter is the index');
      equal(a, ['a'], 'third parameter is the array');
      equal(this.toString(), 'this', 'scope is passed properly');
    }

    run(['a'], 'filter', [fn, 'this']);


    test([{name:'john',age:25},{name:'fred',age:85}], ['age'], [], 'simple string mistakenly passed for complex objects');
    test([{name:'john',age:25},{name:'fred',age:85}], [{name:'john',age:25}], [{name:'john',age:25}], 'filtering john');
    test([{name:'john',age:25},{name:'fred',age:85}], [{name:'fred',age:85}], [{name:'fred',age:85}], 'filtering fred');
  });


  method('each', function() {
    var arr, fn, result, count;

    arr = [2, 5, 9];
    fn = function(el, i, a) {
      equal(el, arr[i], 'looping successfully');
    };
    run(arr, 'each', [fn]);

    arr = ['a', [1], { foo: 'bar' }, 352];
    count = 0;
    fn = function() {
        count++;
    };
    run(arr, 'each', [fn]);
    equal(count, 4, 'complex array | should have looped 4 times');

    fn = function(el, i, a) {
      equal(el, 'a', 'first parameter is the element');
      equal(i, 0, 'second parameter is the index');
      equal(a, ['a'], 'third parameter is the array');
      // Note: psychotic syntax here because equal() is now strictly equal, and the this object is actually an "object" string
      // as opposed to a primitive string, but only in Prototype. Calling .toString() in a non-prototype environment would effectively
      // try to convert the array to a string, which is also not what we want.
      equal(this, a, 'scope is also the array');
    };
    run(['a'], 'each', [fn, 'this']);

    count = 0;

    run({'0':'a','length':'1'}, 'each', [function() { count++; }], 0, true);

    equal(count, 1, 'looping over array-like objects with string lengths');

    result = [];
    count = 0;
    fn = function(s, i) {
      result.push(s);
      equal(i, count + 1, 'index should be correct');
      count++;
    }
    run(['a','b','c'], 'each', [fn, 1]);
    equal(count, 2, 'should have run 2 times');
    equal(result, ['b','c'], 'result');

    result = [];
    indexes = [1,2,0];
    count = 0;
    fn = function(s, i) {
      result.push(s);
      equal(i, indexes[count], 'looping from index 1 | index should be correct');
      count++;
    }
    run(['a','b','c'], 'each', [fn, 1, true]);
    equal(count, 3, 'looping from index 1 | should have run 3 times')
    equal(result, ['b','c','a'], 'looping from index 1 | result');

    result = [];
    indexes = [0,1,2];
    count = 0;
    fn = function(s, i) {
      result.push(s);
      equal(i, indexes[count], 'looping from index 0 | index should be correct')
      count++;
    }
    run(['a','b','c'], 'each', [fn, 0, true]);
    equal(count, 3, 'looping from index 0 | should have run 3 times')
    equal(result, ['a','b','c'], 'looping from index 0 | result');

    result = [];
    indexes = [2,0,1];
    count = 0;
    fn = function(s, i) {
      result.push(s);
      equal(i, indexes[count], 'looping from index 2 | index should be correct');
      count++;
    }
    run(['a','b','c'], 'each', [fn, 2, true]);
    equal(count, 3, 'looping from index 2 | should have run 3 times')
    equal(result, ['c','a','b'], 'looping from index 2 | result');

    result = [];
    count = 0;
    fn = function(s, i) {
      result.push(s);
      count++;
    }
    run(['a','b','c'], 'each', [fn, 3, true]);
    equal(count, 3, 'looping from index 3 | should have run 3 times')
    equal(result, ['a','b','c'], 'looping from index 3 | result');

    result = [];
    count = 0;
    fn = function(s, i) {
      result.push(s);
      count++;
    }
    run(['a','b','c'], 'each', [fn, 4, true]);
    equal(count, 3, 'looping from index 4 | should have run 3 times')
    equal(result, ['b','c','a'], 'looping from index 4 | result');

    result = [];
    count = 0;
    fn = function(s, i) {
      result.push(s);
      count++;
    }
    run(['a','b','c'], 'each', [fn, 49, true]);
    equal(count, 3, 'looping from index 49 | should have run 3 times')
    equal(result, ['b','c','a'], 'looping from index 49 | result');

    result = [];
    count = 0;
    fn = function(s, i) {
      result.push(s);
      count++;
    }
    run(['a','b','c'], 'each', [fn, 'hoofa']);
    equal(count, 3, 'string index should default to 0 | should have run 3 times')
    equal(result, ['a','b','c'], 'string index should default to 0 | result');


    test(['a','b','c'], [function(){}], ['a','b','c'], 'null function returns the array');
    raisesError(function(){ run([1], 'each') }, 'raises an error if no callback');

    count = 0;
    fn = function() {
      count++;
      return false;
    }
    run(['a','b','c'], 'each', [fn]);
    equal(count, 1, 'returning false will break the loop');

    count = 0;
    fn = function() {
      count++;
      return true;
    };
    run(['a','b','c'], 'each', [fn]);
    equal(count, 3, 'returning true will not break the loop');

    count = 0;
    fn = function() {
      count++;
      return;
    }
    run(['a','b','c'], 'each', [fn]);
    equal(count, 3, 'returning undefined will not break the loop');

  });

  method('map', function() {
    var fn;
    // cool!
    test([1,4,9], [Math.sqrt], [1,2,3], 'passing Math.sqrt directly');
    test([{ foo: 'bar' }], [function(el) { return el['foo']; }], ['bar'], 'with key "foo"');

    fn = function(el, i, a) {
      equal(el, 'a', 'first parameter is the element');
      equal(i, 0, 'second parameter is the index');
      equal(a, ['a'], 'third parameter is the array');
      equal(this.toString(), 'this', 'scope is passed properly');
    };
    run(['a'], 'map', [fn, 'this']);


    test(['foot','goose','moose'], [function(el) { return el.replace(/o/g, 'e'); }], ['feet', 'geese', 'meese'], 'with regexp');
    test(['foot','goose','moose'], ['length'], [4,5,5], 'length');
    test([{name:'john',age:25},{name:'fred',age:85}], ['age'], [25,85], 'age');
    test([{name:'john',age:25},{name:'fred',age:85}], ['name'], ['john','fred'], 'name');
    test([{name:'john',age:25},{name:'fred',age:85}], ['cupsize'], [undefined, undefined], '(nonexistent) cupsize');
    test([], ['name'], [], 'empty array');

    test([1,2,3], ['toString'], ['1','2','3'], 'calls a function on a shortcut string');

    raisesError(function(){ run([1,2,3], 'map') }, 'raises an error if no argument');

    test([1,2,3], [undefined], [1,2,3], 'undefined');
    test([1,2,3], [null], [1,2,3], 'null');
    test([1,2,3], [4], [undefined, undefined, undefined], 'number');


    // Issue #386

    var arr = [
      {
        name: 'john',
        age: 25
      },
      {
        name: 'fred',
        age: 85
      }
    ];
    test(arr, [['name', 'age']], [['john', 25], ['fred', 85]], 'mapping on both name and age');
    test(arr, [['name', 'hair']], [['john', undefined], ['fred', undefined]], 'mapping on name and non-existent property');
    test(arr, [['hair', 'age']], [[undefined, 25], [undefined, 85]], 'mapping on non-existent property and name');
    test(arr, [['hair', 'eyes']], [[undefined, undefined], [undefined, undefined]], 'mapping on two non-existent properties');

    var arr = [
      {
        age: 25,
        size: 3
      },
      {
        age: 85,
        size: 7
      }
    ];
    var count1 = 0;
    var count2 = 0;
    var fn1 = function(obj, i, a) {
      equal(this.valueOf(), 0, 'context should still be passable');
      equal(obj, arr[i], 'first argument should be the element');
      equal(i, count1, 'second argument should be the index');
      equal(a, arr, 'third argument should be the array');
      count1++;
      return obj.age + 5;
    }
    var fn2 = function(obj) {
      count2++;
      return obj.size - 3;
    }
    var expected = [
      [30, 0],
      [90, 4]
    ]
    var result = run(arr, 'map', [[fn1, fn2], 0]);

    equal(result, expected, 'should be able to use two mapping functions');
    equal(count1, 2, 'first mapping function should have run twice');
    equal(count2, 2, 'second mapping function should have run twice');

  });


  method('each', function() {
    // Sparse array handling
    var arr, expected, expectedIndexes, count, fn;

    arr = ['a'];
    arr[Math.pow(2,32) - 2] = 'b';
    expected = ['a','b'];
    expectedIndexes = [0, Math.pow(2,32) - 2];
    count = 0;
    fn = function(el, i, a) {
      equal(this, arr, 'sparse arrays | this object should be the array');
      equal(el, expected[count], 'sparse arrays | first argument should be the current element');
      equal(i, expectedIndexes[count], 'sparse arrays | second argument should be the current index');
      equal(a, arr, 'sparse arrays | third argument should be the array');
      count++;
    }
    run(arr, 'each', [fn]);
    equal(count, 2, 'sparse arrays | count should match');


    arr = [];
    arr[-2] = 'd';
    arr[2]  = 'f';
    arr[Math.pow(2,32)] = 'c';
    count = 0;
    fn = function(el, i) {
      equal(el, 'f', 'sparse arrays | values outside range are not iterated over | el');
      equal(i, 2, 'sparse arrays | values outside range are not iterated over | index');
      count++;
    }
    run(arr, 'each', [fn]);
    equal(count, 1, 'sparse arrays | values outside range are not iterated over | count');

    arr = [];
    arr[9] = 'd';
    arr[2] = 'f';
    arr[5] = 'c';
    count = 0;
    expected = ['f','c','d'];
    expectedIndexes = [2,5,9];
    fn = function(el, i) {
      equal(el, expected[count], 'sparse arrays | elements are in expected order');
      equal(i, expectedIndexes[count], 'sparse arrays | index is in expected order');
      count++;
    }
    run(arr, 'each', [fn]);
    equal(count, 3, 'sparse arrays | unordered array should match');


    count = 0;
    fn = function() {
      count++;
    }
    run(arrayOfUndefined, 'each', [fn]);
    equal(count, 3, 'however, simply having an undefined in an array does not qualify it as sparse');
  });


  method('find', function() {
    var count;
    test(['a','b','c'], ['a'], 'a', 'a');
    test(['a','a','c'], ['a'], 'a', 'first a');
    test(['a','b','c'], ['q'], undefined, 'q');
    test([1,2,3], [1], 1, '1');
    test([2,2,3], [2], 2, '2');
    test([1,2,3], [4], undefined, '4');
    test([{a:1},{b:2},{c:3}], [{a:1}], {a:1}, 'a:1');
    test([{a:1},{a:1},{c:3}], [{a:1}], {a:1}, 'first a:1');
    test([{a:1},{b:2},{c:3}], [{d:4}], undefined, 'd:4');
    test([{a:1},{b:2},{c:3}], [{c:4}], undefined, 'c:4');
    test([[1,2],[2,3],[4,5]], [[2,3]], [2,3], '2,3');
    test([[1,2],[2,3],[4,5]], [[2,4]], undefined, '2,4');
    test([[1,2],[2,3],[2,3]], [[2,3]], [2,3], 'first 2,3');
    test(['foo','bar'], [/f+/], 'foo', '/f+/');
    test(['foo','bar'], [/[a-f]/], 'foo', '/a-f/');
    test(['foo','bar'], [/q+/], undefined, '/q+/');
    test([function() {}], [function(e) {}, 0], undefined, 'undefined function');
    test([null, null], [null, 0], null, 'null');
    test([undefined, undefined], [undefined, 0], undefined, 'undefined');
    test([undefined, 'a'], [undefined, 1], undefined, 'undefined can be found');


    count = 0;
    [1,2,3].find(function(n) {
      count++;
      return n == 1;
    });
    equal(count, 1, 'should immediately finish when it finds a match');

    count = 0;
    Sugar.Array.find([1,2,3], function(n) {
      count++;
      return n == 1;
    });
    equal(count, 1, 'should also be mapped to global');

  });


  method('findAll', function() {
    test(['a','b','c'], ['a'], ['a'], 'a');
    test(['a','a','c'], ['a'], ['a','a'], 'a,a');
    test(['a','b','c'], ['q'], [], 'q');
    test([1,2,3], [1], [1], '1');
    test([2,2,3], [2], [2,2], '2,2');
    test([1,2,3], [4], [], '4');
    test([{a:1},{b:2},{c:3}], [{a:1}], [{a:1}], 'a:1');
    test([{a:1},{a:1},{c:3}], [{a:1}], [{a:1},{a:1}], 'a:1,a:1');
    test([{a:1},{b:2},{c:3}], [{d:4}], [], 'd:4');
    test([{a:1},{b:2},{c:3}], [{c:4}], [], 'c:4');
    test([[1,2],[2,3],[4,5]], [[2,3]], [[2,3]], '2,3');
    test([[1,2],[2,3],[4,5]], [[2,4]], [], '2,4');
    test([[1,2],[2,3],[2,3]], [[2,3]], [[2,3],[2,3]], '[2,3],[2,3]');
    test(['foo','bar'], [/f+/], ['foo'], '/f+/');
    test(['foo','bar'], [/[a-f]/], ['foo','bar'], '/[a-f]/');
    test(['foo','bar'], [/[a-f]/, 1], ['bar'], '/[a-f]/ from index 1');
    test(['foo','bar'], [/[a-f]/, 1, true], ['bar','foo'], '/[a-f]/ from index 1');
    test(['foo','bar'], [ /q+/], [], '/q+/');
    test([1,2,3], [function(e) { return e > 0; }, 0], [1,2,3], 'greater than 0 from index 0');
    test([1,2,3], [function(e) { return e > 0; }, 1], [2,3], 'greater than 0 from index 1');
    test([1,2,3], [function(e) { return e > 0; }, 2], [3], 'greater than 0 from index 2');
    test([1,2,3], [function(e) { return e > 0; }, 3], [], 'greater than 0 from index 3');
    test([1,2,3], [function(e) { return e > 0; }, 4], [], 'greater than 0 from index 4');
    test([1,2,3], [function(e) { return e > 1; }, 0], [2,3], 'greater than 1 from index 0');
    test([1,2,3], [function(e) { return e > 1; }, 1], [2,3], 'greater than 1 from index 1');
    test([1,2,3], [function(e) { return e > 1; }, 2], [3], 'greater than 1 from index 2');
    test([1,2,3], [function(e) { return e > 2; }, 0], [3], 'greater than 2 from index 0');
    test([1,2,3], [function(e) { return e > 3; }, 0], [], 'greater than 3 from index 0');

    test([1,2,3], [function(e) { return e > 0; }, 0, true], [1,2,3], 'looping | greater than 0 from index 0');
    test([1,2,3], [function(e) { return e > 0; }, 1, true], [2,3,1], 'looping | greater than 0 from index 1');
    test([1,2,3], [function(e) { return e > 0; }, 2, true], [3,1,2], 'looping | greater than 0 from index 2');
    test([1,2,3], [function(e) { return e > 0; }, 3, true], [1,2,3], 'looping | greater than 0 from index 3');
    test([1,2,3], [function(e) { return e > 1; }, 0, true], [2,3], 'looping | greater than 1 from index 0');
    test([1,2,3], [function(e) { return e > 1; }, 1, true], [2,3], 'looping | greater than 1 from index 1');
    test([1,2,3], [function(e) { return e > 1; }, 2, true], [3,2], 'looping | greater than 1 from index 2');
    test([1,2,3], [function(e) { return e > 2; }, 0, true], [3], 'looping | greater than 2 from index 0');
    test([1,2,3], [function(e) { return e > 3; }, 0, true], [], 'looping | greater than 3 from index 0');

    test([{a:10},{a:8},{a:3}], [function(e) { return e['a'] > 5; }, 0], [{a:10},{a:8}], 'key "a" is greater than 5');
    test([{a:10},{a:8},{a:3}], [function(e) { return e['a'] > 5; }, 1], [{a:8}], 'key "a" is greater than 5 from index 1');
    test([{a:10},{a:8},{a:3}], [function(e) { return e['a'] > 5; }, 2], [], 'key "a" is greater than 5 from index 2');

    test([{a:10},{a:8},{a:3}], [function(e) { return e['a'] > 5; }, 0, true], [{a:10},{a:8}], 'looping | key "a" is greater than 5');
    test([{a:10},{a:8},{a:3}], [function(e) { return e['a'] > 5; }, 1, true], [{a:8},{a:10}], 'looping | key "a" is greater than 5 from index 1');
    test([{a:10},{a:8},{a:3}], [function(e) { return e['a'] > 5; }, 2, true], [{a:10},{a:8}], 'looping | key "a" is greater than 5 from index 2');

    test([function() {}], [function(e) {}, 0], [], 'null function');
    test([function() {}], [function(e) {}, 1], [], 'null function from index 1');
    test([null, null], [null, 0], [null, null], 'null');
    test([null, null], [null, 1], [null], 'null from index 1');

    test([function() {}], [function(e) {}, 0, true], [], 'looping | null function');
    test([function() {}], [function(e) {}, 1, true], [], 'looping | null function from index 1');
    test([null, null], [null, 0, true], [null, null], 'looping | null');
    test([null, null], [null, 1, true], [null, null], 'looping | null from index 1');

    // Example: finding last from an index. (reverse order). This means we don't need a findAllFromLastIndex
    var arr = [1,2,3,4,5,6,7,8,9];
    test(arr, [function(n) { return n % 3 == 0; }, 4], [6,9], 'n % 3 from index 4');
    test(arr, [function(n) { return n % 3 == 0; }, 4, true], [6,9,3], 'looping | n % 3 from index 4');

    arr.reverse();
    test(arr, [function(n) { return n % 3 == 0; }, 4], [3], 'reversed | n % 3 from index 4 reversed');
    test(arr, [function(n) { return n % 3 == 0; }, 4, true], [3,9,6], 'looping | reversed | n % 3 from index 4 reversed');


    var fn = function() {
      return false;
    }

    test([fn], [fn], [fn], 'should find functions by reference');

    var undefinedContextObj = (function(){ return this; }).call(undefined);
    var fn = function() {
      equal(this, undefinedContextObj, 'this argument should be undefined context');
    }
    run([1], 'findAll', [fn]);
  });

  method('unique', function() {

    test([1,1,3], [1,3], '1,1,3');
    test([0,0,0], [0], '0,0,0');
    test(['a','b','c'], ['a','b','c'], 'a,b,c');
    test(['a','a','c'], ['a','c'], 'a,a,c');

    test([{ foo:'bar' }, { foo:'bar' }], [{foo:'bar'}], 'objects uniqued as well');
    test([{ first: 'John', last: 'Woo' }, { first: 'Reynold', last: 'Woo' }], [function(n){ return n.last; }], [{ first: 'John', last: 'Woo' }], 'can be uniqued via a mapping function');
    test([{ first: 'John', last: 'Woo' }, { first: 'Reynold', last: 'Woo' }], ['last'], [{ first: 'John', last: 'Woo' }], 'can be uniqued via a mapping shortcut');

    var fn = function(el,i,a) {
      equal(this, [1], 'scope should be the array');
      equal(i, 0, 'second param should be the index');
      equal(a, [1], 'third param should also be the array');
    }
    run([1], 'unique', [fn]);

    equal(run([function(){ return 'a' }, function() { return 'a'; }, function() { return 'b'; }]).length, 3, 'Functions are always unique');

    test(['toString'], [], ['toString'], 'toString is respected as unique');
    test(['watch'], [], ['watch'], 'watch is respected as unique');
    test(['watch', 'flowers', 'toString'], [], ['watch', 'flowers', 'toString'], 'toString and watch mixed');

  });

  method('union', function() {
    test([1,2,3], [[3,4,5]], [1,2,3,4,5], '1,2,3 + 3,4,5');
    test([1,1,1], [[1,2,3]], [1,2,3], '1,1,1 + 1,2,3');
    test([0,0,0], [[1,2,3]], [0,1,2,3], '0,0,0 + 1,2,3');
    test([0,0,0], [[0,0,0]], [0], '0,0,0 + 0,0,0');
    test([], [[]], [], '2 empty arrays');
    test([-1,-2,-3], [[-2,-4,-5]], [-1,-2,-3,-4,-5], '-1,-2,-3 + -2,-4,-5');
    test([-1,-2,-3], [[3,4,5]], [-1,-2,-3,3,4,5], '-1,-2,-3 + 3,4,5');
    test([{a:1},{b:2}], [[{b:2},{c:3}]], [{a:1},{b:2},{c:3}], 'a:1,b:2 + b:2,c:3');
    test([1,2,3], [4], [1,2,3,4], '1,2,3 + 4');

    test([1,2,3], [4,8,10], [1,2,3,4,8,10], '1,2,3 + 4 8 10');
    test([1,2,3], [[4],[8],[10]], [1,2,3,4,8,10], '1,2,3 + [4] [8] [10]');

    var arr = [1,2,3];
    run(arr, 'union', [[4,5,6]]);
    equal(arr, [1,2,3], 'is non-destructive');
  });

  method('intersect', function() {
    test([1,2,3], [[3,4,5]], [3], '1,2,3 & 3,4,5');
    test(['a','b','c'], [['c','d','e']], ['c'], 'a,b,c & c,d,e');
    test([1,2,3], [[1,2,3]], [1,2,3], '1,2,3 & 1,2,3');
    test([1,2,3], [[3,2,1]], [1,2,3], '1,2,3 & 3,2,1');
    test([], [[3]], [], 'empty array & 3');
    test([3], [[]], [], '3 & empty array');
    test([], [[]], [], '2 empty arrays');
    test([null], [[]], [], '[null] & empty array');
    test([null], [[null]], [null], '[null] & [null]');
    test([false], [[false]], [false], '[false] & [false]');
    test([false], [[0]], [], '[false] & [0]');
    test([false], [[null]], [], '[false] & [null]');
    test([false], [[undefined]], [], '[false] & [undefined]');
    test([{a:1},{b:2}], [[{b:2},{c:3}]], [{b:2}], 'a:1,b:2 & b:2,c:3');
    test([1,1,3], [[1,5,6]], [1], '1,1,3 & 1,5,6');
    test([1,2,3], [[4,5,6]], [], '1,1,3 & 4,5,6');
    test([1,2,3], [[3,4,5],[0,1]], [1,3], 'handles multiple arguments');
    test([1,1], [1,1,[1,1]], [1], 'assure uniqueness');
    test([1,2,3], [1], [1], '1,2,3 + 1');

    var arr = [1,2,3];
    run(arr, 'intersect', [[3,4,5]]);
    equal(arr, [1,2,3], 'is non-destructive');

  });

  method('subtract', function() {
    test([1,2,3], [[3,4,5]], [1,2], '1,2,3 + 3,4,5');
    test([1,1,2,2,3,3,4,4,5,5], [[2,3,4]], [1,1,5,5], '1,1,2,2,3,3,4,4,5,5 + 2,3,4');
    test(['a','b','c'], [['c','d','e']], ['a','b'], 'a,b,c + c,d,e');
    test([1,2,3], [[1,2,3]], [], '1,2,3 + 1,2,3');
    test([1,2,3], [[3,2,1]], [], '1,2,3 + 3,2,1');
    test([], [[3]], [], 'empty array + [3]');
    test([3], [[]], [3], '[3] + empty array');
    test([], [[]], [], '2 empty arrays');
    test([null], [[]], [null], '[null] + empty array');
    test([null], [[null]], [], '[null] + [null]');
    test([false], [[false]], [], '[false] + [false]');
    test([false], [[0]], [false], '[false] + [0]');
    test([false], [[null]], [false], '[false] + [null]');
    test([false], [[undefined]], [false], '[false] + [undefined]');
    test([{a:1},{b:2}], [[{b:2},{c:3}]], [{a:1}], 'a:1,b:2 + b:2,c:3');
    test([1,1,3], [[1,5,6]], [3], '1,1,3 + 1,5,6');
    test([1,2,3], [[4,5,6]], [1,2,3], '1,2,3 + 4,5,6');
    test([1,2,3], [1], [2,3], '1,2,3 + 1');
    test([1,2,3,4,5], [[1],[3],[5]], [2,4], 'handles multiple arguments');

    var arr = [1,2,3];
    run(arr, 'subtract', [[3]]);
    equal(arr, [1,2,3], 'is non-destructive');
  });

  method('at', function() {
    test(['a','b','c'], [0], 'a', 'a,b,c | 0');
    test(['a','b','c'], [1], 'b', 'a,b,c | 1');
    test(['a','b','c'], [2], 'c', 'a,b,c | 2');
    test(['a','b','c'], [3], 'a', 'a,b,c | 3');
    test(['a','b','c'], [-1], 'c', 'a,b,c | -1');
    test(['a','b','c'], [-2], 'b', 'a,b,c | -2');
    test(['a','b','c'], [-3], 'a', 'a,b,c | -3');
    test(['a','b','c'], [-4], 'c', 'a,b,c | -3');

    test(['a','b','c'], [0, false], 'a', 'a,b,c | loop off | 0');
    test(['a','b','c'], [1, false], 'b', 'a,b,c | loop off | 1');
    test(['a','b','c'], [2, false], 'c', 'a,b,c | loop off | 2');
    test(['a','b','c'], [3, false], undefined, 'a,b,c | loop off | 3');
    test(['a','b','c'], [-1, false], undefined, 'a,b,c | loop off | -1');
    test(['a','b','c'], [-2, false], undefined, 'a,b,c | loop off | -2');
    test(['a','b','c'], [-3, false], undefined, 'a,b,c | loop off | -3');
    test(['a','b','c'], [-4, false], undefined, 'a,b,c | loop off | -4');
    test(['a','b','c'], [], undefined, 'a,b,c | no argument');
    test([false], [0], false, 'false | loop off | 0');
    test(['a'], [0], 'a', 'a | 0');
    test(['a'], [1], 'a', 'a | 1');
    test(['a'], [1, false], undefined, 'a | loop off | 1');
    test(['a'], [-1], 'a', 'a | -1');
    test(['a','b','c','d','e','f'], [0,2,4], ['a','c','e'], 'a,b,c,d,e,f | 0,2,4');
    test(['a','b','c','d','e','f'], [1,3,5], ['b','d','f'], 'a,b,c,d,e,f | 1,3,5');
    test(['a','b','c','d','e','f'], [0,2,4,6], ['a','c','e','a'], 'a,b,c,d,e,f | 0,2,4,6');
    test(['a','b','c','d','e','f'], [0,2,4,6,18], ['a','c','e','a','a'], 'a,b,c,d,e,f | 0,2,4,6,18');
    test(['a','b','c','d','e','f'], [0,2,4,6, false], ['a','c','e', undefined], 'a,b,c,d,e,f | 0,2,4,6,false | false');
  });

  method('from', function() {
    test(['a','b','c'], ['a','b','c'], 'no argument');
    test(['a','b','c'], [1], ['b','c'], '');
    test(['a','b','c'], [2], ['c'], '2');
    test(['a','b','c'], [3], [], '3');
    test(['a','b','c'], [4], [], '4');
    test(['a','b','c'], [-1], ['c'], '-1');
    test(['a','b','c'], [-2], ['b','c'], '-2');
    test(['a','b','c'], [-3], ['a','b','c'], '-3');
    test(['a','b','c'], [-4], ['a','b','c'], '-4');
  });


  method('to', function() {
    test(['a','b','c'], ['a','b','c'], 'no argument');
    test(['a','b','c'], [0], [], 'no argument');
    test(['a','b','c'], [1], ['a'], '1');
    test(['a','b','c'], [2], ['a','b'], '2');
    test(['a','b','c'], [3], ['a','b','c'], '3');
    test(['a','b','c'], [4], ['a','b','c'], '4');
    test(['a','b','c'], [-1], ['a','b'], '-1');
    test(['a','b','c'], [-2], ['a'], '-2');
    test(['a','b','c'], [-3], [], '-3');
    test(['a','b','c'], [-4], [], '-4');
  });


  method('first', function() {
    test(['a','b','c'], 'a', 'no argument');
    test(['a','b','c'], [1], ['a'], '1');
    test(['a','b','c'], [2], ['a','b'], '2');
    test(['a','b','c'], [3], ['a','b','c'], '3');
    test(['a','b','c'], [4], ['a','b','c'], '4');
    test(['a','b','c'], [-1], [], '-1');
    test(['a','b','c'], [-2], [], '-2');
    test(['a','b','c'], [-3], [], '-3');
  });


  method('last', function() {
    test(['a','b','c'], 'c', 'no argument');
    test(['a','b','c'], [1], ['c'], '1');
    test(['a','b','c'], [2], ['b','c'], '2');
    test(['a','b','c'], [3], ['a','b','c'], '3');
    test(['a','b','c'], [4], ['a','b','c'], '4');
    test(['a','b','c'], [-1], [], '-1');
    test(['a','b','c'], [-2], [], '-2');
    test(['a','b','c'], [-3], [], '-3');
    test(['a','b','c'], [-4], [], '-4');
  });


  method('min', function() {
    test([12,87,55], 12, 'no argument');
    test([12,87,55], [undefined], 12, 'undefined');
    test([12,87,55], [null], 12, 'null');
    test([-12,-87,-55], -87, '-87');
    test([5,5,5], 5, '5 is uniqued');
    test(['a','b','c'], 'a', 'strings are not counted');
    test([], undefined, 'empty array');
    test([null], null, '[null]');
    test([{a:1,b:5},{a:2,b:5},{a:3,b:5}], [function(el) { return el['a']; }], {a:1,b:5}, 'key "a"');
    test([{a:1,b:5},{a:2,b:4},{a:3,b:3}], [function(el) { return el['b']; }], {a:3,b:3}, 'key "b", 1 found');
    test([{a:1,b:5},{a:3,b:3},{a:3,b:3}], [function(el) { return el['b']; }], {a:3,b:3}, 'key "b", 1 found');
    test([{a:1,b:3},{a:2,b:4},{a:3,b:3}], [function(el) { return el['b']; }], {a:1,b:3}, 'key "b", first found');
    test([{a:1,b:3},{a:2,b:4},{a:3,b:3}], [function(el) { return el['b']; }, true], [{a:1,b:3},{a:3,b:3}], 'key "b", 2 found');
    test([{a:-1,b:-5},{a:-2,b:-4},{a:-3,b:-3}], [function(el) { return el['b']; }], {a:-1,b:-5}, 'key "b", 1 found');
    test(['short','and','mort'], [function(el) { return el.length; }], 'and', 'length');
    test(['short','and','mort','fat'], [function(el) { return el.length; }, true], ['and','fat'], 'and,fat');
    test(['short','and','mort'], ['length'], 'and', 'length with shortcut');
    test(['short','and','mort'], ['length', true], ['and'], 'length with shortcut');
    test([12,12,12], [function(n) { return n; }, true], [12,12,12], 'should not unique');

    var fn = function(el,i,a) {
      equal(this, [1], 'scope should be the array');
      equal(i, 0, 'second param should be the index');
      equal(a, [1], 'third param should also be the array');
      return el;
    }
    run([1], 'min', [fn]);


    raisesError(function() { run(arrayOfUndefined, 'min'); }, 'should raise an error when comparing undefined');
    raisesError(function() { run(arrayOfUndefinedWith1, 'min'); }, 'should raise an error when comparing 1 to undefined');
    raisesError(function() { run([87,12,55], 'min', [4]); }, 'number not found in number, so undefined');
  });

  method('max', function() {
    test([12,87,55], 87, 'no argument');
    test([12,87,55], [undefined], 87, 'undefined');
    test([12,87,55], [null], 87, 'null');
    test([-12,-87,-55], -12, '-12');
    test([5,5,128], 128, '128');
    test([128,128,128], 128, '128 is uniqued');
    test(['a','b','c'], 'c', 'strings are not counted');
    test([], undefined, 'empty array');
    test([null], null, '[null]');
    test([{a:1,b:5},{a:2,b:5},{a:3,b:5}], [function(el) { return el['a']; }], {a:3,b:5}, 'key "a"');
    test([{a:1,b:5},{a:2,b:4},{a:3,b:3}], [function(el) { return el['b']; }], {a:1,b:5}, 'key "b" returns b:5');
    test([{a:1,b:3},{a:2,b:4},{a:3,b:3}], [function(el) { return el['b']; }], {a:2,b:4}, 'key "b" returns b:4');
    test([{a:1,b:3},{a:2,b:4},{a:2,b:4}], [function(el) { return el['b']; }], {a:2,b:4}, 'key "b" returns b:4 uniqued');
    test([{a:1,b:3},{a:2,b:1},{a:3,b:3}], [function(el) { return el['b']; }], {a:1,b:3}, 'key "b", first found');
    test([{a:1,b:3},{a:2,b:1},{a:3,b:3}], [function(el) { return el['b']; }, true], [{a:1,b:3},{a:3,b:3}], 'key "b", 2 found');
    test([{a:-1,b:-5},{a:-2,b:-4},{a:-3,b:-3}], [function(el) { return el['b']; }], {a:-3,b:-3}, 'key "b" returns b:-3');
    test(['short','and', 'mort'], [function(el) { return el.length; }], 'short', 'length');
    test(['short','and', 'morts', 'fat'], [function(el) { return el.length; }, true], ['short','morts'], 'short,morts');
    test([12,12,12], [function(n){ return n; }, true], [12,12,12], 'should not unique');

    var fn = function(el,i,a) {
      equal(this, [1], 'scope should be the array');
      equal(i, 0, 'second param should be the index');
      equal(a, [1], 'third param should also be the array');
      return el;
    };
    run([1], 'max', [fn]);

    raisesError(function() { run(arrayOfUndefined, 'max'); }, 'should raise an error when comparing undefined');
    raisesError(function() { run(arrayOfUndefinedWith1, 'max'); }, 'should raise an error when comparing 1 to undefined');
    raisesError(function() { run([87,12,55], 'max', [4]); }, 'number not found in number, so undefined');
  });


  method('most', function() {
    var people = [
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'ronnie', age: 13, hair: 'brown'  },
      { name: 'edmund', age: 27, hair: 'blonde' }
    ];

    test([1,2,3], [null], 1, 'null | returns first');
    test([1,2,3], [undefined], 1, 'undefined | returns first');
    test([1,2,3], [4], 1, 'number | returns first');

    equal(run(people, 'most', [function(person) { return person.age; }]).age, 27, 'age | age is 27');
    test(people, [function(person) { return person.age; }, true], [{name:'jim',age:27,hair:'brown'},{name:'edmund',age:27,hair:'blonde'}], 'age | returns all');
    test(people, [function(person) { return person.hair; }], {name:'jim',age:27,hair:'brown'}, 'hair');

    test([], undefined, 'empty array');
    test([1,2,3], 1, '1,2,3');
    test([1,2,3,3], 3, '1,2,3,3');
    test([1,1,2,3,3], 1, '1,1,2,3,3 | first');
    test([1,1,2,3,3], [function(n) { return n; }, true], [1,1,3,3], '1,1,2,3,3 | all');
    test(['a','b','c'], 'a', 'a,b,c');
    test(['a','b','c','c'], 'c', 'a,b,c,c');
    test(['a','a','b','c','c'], 'a', 'a,a,b,c,c | first');
    test(['a','a','b','c','c'], [function(s){ return s; }, true], ['a','a','c','c'], 'a,a,b,c,c | all');

    var fn = function(el,i,a) {
      equal(this, [1], 'scope should be the array');
      equal(i, 0, 'second param should be the index');
      equal(a, [1], 'third param should also be the array');
      return el;
    };
    run([1], 'most', [fn]);
  });

  method('least', function() {
    var fn, arr;
    var people = [
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'ronnie', age: 13, hair: 'brown'  },
      { name: 'edmund', age: 27, hair: 'blonde' }
    ];

    test([1,2,3], [null], 1, 'null');
    test([1,2,3], [undefined], 1, 'undefined');
    test([1,2,3], [4], 1, 'number');

    test(people, people[0], 'contains mary | does not return most');

    fn = function(person) {
      return person.age;
    }
    arr = run(people, 'least', [fn, true]);
    arr.sort(function(a, b) {
      return a.name > b.name;
    });
    setIsEqual(arr, [people[1], people[2]], 'contains mary and ronnie');

    arr.sort(function(a, b) {
      return a.age - b.age;
    });
    equal(arr, [{name:'ronnie',age:13,hair:'brown'}, {name:'mary',age:52,hair:'blonde'}], 'age and sorted by age');

    test(people, [function(person) { return person.hair; }], people[0], 'hair');
    notEqual(run(people, 'least', [function(person) { return person.age; }]).age, 27, 'map age | does not return most');

    test([], undefined, 'empty array');
    test([1,2,3], 1, '1,2,3');
    test([1,2,3,3], 1, '1,2,3,3');
    test([1,2,3,3], [function(n){ return n; }, true], [1,2], '1,2,3,3 | all');
    test([1,1,2,3,3], 2, '1,1,2,3,3');
    test([1,1,1,2,2,3,3,3], 2, '1,1,1,2,2,3,3,3');
    test(['a','b','c'], 'a', 'a,b,c');
    test(['a','b','c','c'], 'a', 'a,b,c,c');
    test(['a','b','c','c'], [function(n) { return n; }, true], ['a','b'], 'a,b,c,c | all');
    test(['a','a','b','c','c'], 'b', 'a,a,b,c,c');

    fn = function(el,i,a) {
      equal(this, [1], 'scope should be the array');
      equal(i, 0, 'second param should be the index');
      equal(a, [1], 'third param should also be the array');
      return el;
    };
    run([1], 'least', [fn]);
  });

  method('sum', function() {
    test([12,87,55], 154, '12,87,55');
    test([12,87,128], 227, '12,87,128');
    test([], 0, 'empty array is 0');
    test([null, false], 0, '[null,false] is 0');
    test([{a:1,b:5},{a:2,b:5},{a:3,b:5}], [function(el) { return el['a']; }], 6, 'key "a"');
    test([{a:1,b:5},{a:2,b:5},{a:3,b:5}], ['a'], 6, 'shortcut for key "a"');
  });

  method('average', function() {
    var people = [
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'ronnie', age: 13, hair: 'brown'  },
      { name: 'edmund', age: 27, hair: 'blonde' }
    ];

    test([13,18,13,14,13,16,14,21,13], 15, '13,18,13,14,13,16,14,21,13');
    test([2,2,2], 2, '2,2,2');
    test([2,3,4], 3, '2,3,4');
    test([2,3,4,2], 2.75, '2,3,4,2');
    test([], 0, 'empty array is 0');
    test([null, false], 0, '[null, false] is 0');
    test([{a:1,b:5},{a:2,b:5},{a:3,b:5}], [function(el) { return el['a']; }], 2, 'key "a"');
    test([{a:1,b:5},{a:2,b:5},{a:3,b:5}], ['a'], 2, 'shortcut for key "a"');

    test(people, ['age'], 29.75, 'people average age is 29.75');
    test(people, [function(p) { return p.age; }], 29.75, 'people average age is 29.75 by function');
    equal(isNaN(run(people, 'average', [function(p) { return p.hair; }])), true, 'people average hair is NaN');
  });

  method('groupBy', function() {
    var grouped;
    var people = [
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'edmund', age: 27, hair: 'blonde' },
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'ronnie', age: 13, hair: 'brown'  }
    ];

    test([], {}, 'empty array');
    test([1,1,2,2,3,3,4], {1:[1,1],2:[2,2],3:[3,3],4:[4]}, '1,1,2,2,3,3,4');
    test(['a','b','c','a','e','c'], {'a':['a','a'],'b':['b'],'c':['c','c'],'e':['e']}, 'a,b,c,a,e,c');
    test([{a:1,b:5},{a:8,b:5},{a:8,b:3}], ['a'], {8:[{a:8,b:5},{a:8,b:3}],1:[{a:1,b:5}]}, 'grouping by "a"');
    test([{a:1,b:5},{a:8,b:5},{a:8,b:3}], [function(el) { return el['a']; }], {8:[{a:8,b:5},{a:8,b:3}],1:[{a:1,b:5}]}, 'grouping by "a" by function');


    test(people, [function(p) { return p.age; }], {27: [{name:'edmund',age:27,hair:'blonde'},{name:'jim',age:27,hair:'brown'}],52:[{name:'mary',age:52,hair:'blonde'}],13:[{name:'ronnie',age:13,hair:'brown'}]}, 'grouping people by age');

    test([1,2,3], [undefined], { 1: [1], 2: [2], 3: [3] }, 'undefined');
    test([1,2,3], [null], { 1: [1], 2: [2], 3: [3] }, 'null');
    test([1,2,3], [4], { 'undefined': [1,2,3] }, 'number');
    equal(run(['one','two','three'], 'groupBy', ['length']).keys, undefined, 'result should not be an extended object');

    var counter = 0;
    var fn = function() {
      counter++;
    }
    run(['one','two','three'], 'groupBy', ['length', fn]);
    equal(counter, 2, 'should allow a callback fn');

    var arr1 = ['a','b','c'];
    var arr2 = ['d','e','f'];
    var fn = function(el, i) {
      return arr2[i];
    };
    var obj = run(arr1, 'groupBy', [fn]);

    var fn = function(el,i,a) {
      equal(this, [1], 'scope should be the array');
      equal(i, 0, 'second param should be the index');
      equal(a, [1], 'third param should also be the array');
    }
    run([1], 'groupBy', [fn]);

    equal(obj, { 'd':['a'],'e':['b'],'f':['c'] }, 'should use an index');
  });

  method('inGroups', function() {
    test([1,2,3,4,5,6,7,8,9,10], [1], [[1,2,3,4,5,6,7,8,9,10]], 'in groups of 1');
    test([1,2,3,4,5,6,7,8,9,10], [2], [[1,2,3,4,5],[6,7,8,9,10]], 'in groups of 2');
    test([1,2,3,4,5,6,7,8,9,10], [3], [[1,2,3,4],[5,6,7,8],[9,10]], 'in groups of 3');
    test([1,2,3,4,5,6,7,8,9,10], [4], [[1,2,3],[4,5,6],[7,8,9],[10]], 'in groups of 4');
    test([1,2,3,4,5,6,7,8,9,10], [5], [[1,2],[3,4],[5,6],[7,8],[9,10]], 'in groups of 5');
    test([1,2,3,4,5,6,7,8,9,10], [6], [[1,2],[3,4],[5,6],[7,8],[9,10],[]], 'in groups of 6');
    test([1,2,3,4,5,6,7,8,9,10], [7], [[1,2],[3,4],[5,6],[7,8],[9,10],[],[]], 'in groups of 7');
    test([1,2,3,4,5,6,7,8,9,10], [3, null], [[1,2,3,4],[5,6,7,8],[9,10,null,null]], 'pad with null | in groups of 3');
    test([1,2,3,4,5,6,7,8,9,10], [4, null], [[1,2,3],[4,5,6],[7,8,9],[10,null,null]], 'pad with null | in groups of 4');
    test([1,2,3,4,5,6,7,8,9,10], [5, null], [[1,2],[3,4],[5,6],[7,8],[9,10]], 'pad with null | in groups of 5');
    test([1,2,3,4,5,6,7,8,9,10], [6, null], [[1,2],[3,4],[5,6],[7,8],[9,10],[null,null]], 'pad with null | in groups of 6');
    test([1,2,3,4,5,6,7,8,9,10], [7, null], [[1,2],[3,4],[5,6],[7,8],[9,10],[null,null],[null,null]], 'pad with null | in groups of 7');
  });

  method('inGroupsOf', function() {

    test([1,2,3,4,5,6,7,8,9,10], [3], [[1,2,3],[4,5,6],[7,8,9],[10,null,null]], 'groups of 3 | 1 to 10');
    test([1,2,3,4,5,6,7,8,9], [3], [[1,2,3],[4,5,6],[7,8,9]], 'groups of 3 | 1 to 9');
    test([1,2,3,4,5,6,7,8], [3], [[1,2,3],[4,5,6],[7,8,null]], 'groups of 3 | 1 to 8');
    test([1,2,3,4,5,6,7], [3], [[1,2,3],[4,5,6],[7,null,null]], 'groups of 3 | 1 to 7');
    test([1,2,3,4,5,6], [3], [[1,2,3],[4,5,6]], 'groups of 3 | 1 to 6');
    test([1,2,3,4,5], [3], [[1,2,3],[4,5,null]], 'groups of 3 | 1 to 5');
    test([1,2,3,4], [3], [[1,2,3],[4,null,null]], 'groups of 3 | 1 to 4');
    test([1,2,3], [3], [[1,2,3]], 'groups of 3 | 1 to 3');
    test([1,2], [3], [[1,2,null]], 'groups of 3 | 1 to 2');
    test([1], [3], [[1,null,null]], 'groups of 3 | 1');

    test([1,2,3,4,5,6,7,8,9,10], [3, null], [[1,2,3],[4,5,6],[7,8,9],[10, null, null]], 'groups of 3 | pad with null | 1 to 10');
    test([1,2,3,4,5,6,7,8,9], [3, null], [[1,2,3],[4,5,6],[7,8,9]], 'groups of 3 | pad with null | 1 to 9');
    test([1,2,3,4,5,6,7,8], [3, null], [[1,2,3],[4,5,6],[7,8, null]], 'groups of 3 | pad with null | 1 to 8');
    test([1,2,3,4,5,6,7], [3, null], [[1,2,3],[4,5,6],[7, null, null]], 'groups of 3 | pad with null | 1 to 7');
    test([1,2,3,4,5,6], [3, null], [[1,2,3],[4,5,6]], 'groups of 3 | pad with null | 1 to 6');
    test([1,2,3,4,5], [3, null], [[1,2,3],[4,5,null]], 'groups of 3 | pad with null | 1 to 5');
    test([1,2,3,4], [3, null], [[1,2,3],[4,null,null]], 'groups of 3 | pad with null | 1 to 4');
    test([1,2,3], [3, null], [[1,2,3]], 'groups of 3 | pad with null | 1 to 3');
    test([1,2], [3, null], [[1,2,null]], 'groups of 3 | pad with null | 1 to 2');
    test([1], [3, null], [[1,null,null]], 'groups of 3 | pad with null | 1');

    test([1], [3, ' '], [[1,' ',' ']], 'pad with spaces');
    test([1], [3, true], [[1,true,true]], 'pad with true');
    test([1], [3, false], [[1,false,false]], 'pad with false');

    test([1], [], [[1]], 'no argument');
    test([1], [1, null], [[1]], 'pad with null | no argument');

    test([1], [0], [1], '0');
    test([1], [0, null], [1], 'pad with null | 0');

    test([1], [3, null], [[1, null, null]], 'pad with null | 3');
    test([1], [1, null], [[1]], 'pad with null | 1');
    test([], [3], [], 'empty array');
    test([], [3, null], [], 'pad with null | empty array');
    test([null], [3], [[null,null,null]], '[null] in groups of 3');
    test([null], [3, null], [[null,null,null]], 'pad with null | [null] in groups of 3');
    test([1], [3, undefined], [[1,null,null]], 'passing undefined reverts to null');

    // Issue #142 - inGroupsOf corrupting array length
    var arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    run(arr, 'inGroupsOf', [3]);
    equal(arr.length, 20, 'does not corrupt original array length');

  });


  method('compact', function() {
    var f1 = function() {};
    var f2 = function() {};

    test([1,2,3], [1,2,3], '1,2,3');
    test([1,2,null,3], [1,2,3], '1,2,null,3');
    test([1,2,undefined,3], [1,2,3], '1,2,undefined,3');
    test([undefined,undefined,undefined], [], 'undefined,undefined,undefined');
    test([null,null,null], [], 'null,null,null');
    test([NaN,NaN,NaN], [], 'NaN,NaN,NaN');
    test(['','',''], ['','',''], 'empty strings');
    test([false,false,false], [false,false,false], 'false is left alone');
    test([0,1,2], [0,1,2], '0,1,2');
    test([], [], 'empty array');
    test(['a','b','c'], ['a','b','c'], 'a,b,c');
    test([f1, f2], [f1, f2], 'functions');
    test([null,[null],[false,[null,undefined,3]]], [[],[false,[3]]], 'deep compacts as well');
    test([null,null,null,[null],null], [[]], "deep compact doesn't have index conflicts");

    test([false,false,false], [true], [], 'falsy | false is removed');
    test([0,0], [true], [], 'falsy | 0');
    test(['',''], [true], [], 'falsy | empty string');
    test([' ',' '], [true], [' ',' '], 'falsy | strings with spaces are kept');
    test([8,3], [true], [8,3], 'falsy | numbers are kept');
    test([false,undefined,false,null,NaN], [true], [], 'falsy | others are also handled');
  });

  method('count', function() {
    test([1,2,2,3], 4, 'no arugment numeric');
    test([1,2,2,3], [2], 2, 'count 2s');
    test(['a','b','c','c'], 4, 'no argument alphabet');
    test(['a','b','c','c'], ['c'], 2, 'count "c"s');
    test([1,2,2,3], [function(el) { return el % 2 == 0; }], 2, 'count all odd numbers');
    test([1,2,2,3], [function(el) { return el > 2; }], 1, 'count all numbers greater than 2');
    test([1,2,2,3], [function(el) { return el > 20; }], 0, 'count all numbers greater than 20');
    test([{a:1},{a:2},{a:1}], [{a:1}], 2, 'count all a:1');
  });

  method('remove', function() {
    var fn;
    fn = function() {};

    test([1,2,2,3], [1,2,2,3], 'no argument numeric');
    test([1,2,2,3], [2], [1,3], 'remove 2s');
    test([0,1,2], [0], [1,2], 'finds 0');
    test(['a','b','c','c'], ['a','b','c','c'], 'no argument alphabet');
    test(['a','b','c','c'], ['c'], ['a','b'], 'remove "c"s');
    test([1,2,2,3], [function(el) { return el % 2 == 0; }], [1,3], 'remove all odd numbers');
    test([1,2,2,3], [function(el) { return el > 2; }], [1,2,2], 'remove all numbers greater than 2');
    test([1,2,2,3], [function(el) { return el > 20; }], [1,2,2,3], 'remove all numbers greater than 20');
    test([{a:1},{a:2},{a:1}], [{a:1}], [{a:2}], 'remove all a:1');
    test([fn], [fn], [], 'can find via strict equality');
    test([1,2,3], [[1,3]], [1,2,3], 'each argument is a separate element');
    test([1,2,3], [1,3], [2], 'however multiple arguments still work');
    test([[1,3],2], [[1,3]], [2], 'and those elements are still properly found');


    fn = function(el,i,arr) {
      equal(el, 'a', 'first param should be the element');
      equal(i, 0, 'second param should be the index');
      equal(arr, ['a'], 'third param should be the array');
    }
    run(['a'], 'remove', [fn]);

    var arr = [1,2,3];
    run(arr, 'remove', [2]);
    equal(arr, [1,3], 'should affect the original array');

    var arr = [1,2,3];
    run(arr, 'remove', [2,3]);
    equal(arr, [1], 'can remove multiple elements');

  });


  method('exclude', function() {
    var fn;
    fn = function() {};

    test([1,2,2,3], [1,2,2,3], 'no argument numeric');
    test([1,2,2,3], [2], [1,3], 'exclude 2s');
    test([0,1,2], [0], [1,2], 'finds 0');
    test(['a','b','c','c'], ['a','b','c','c'], 'no argument alphabet');
    test(['a','b','c','c'], ['c'], ['a','b'], 'exclude "c"s');
    test([1,2,2,3], [function(el){ return el % 2 == 0; }], [1,3], 'exclude all odd numbers');
    test([1,2,2,3], [function(el){ return el > 2; }], [1,2,2], 'exclude all numbers greater than 2');
    test([1,2,2,3], [function(el){ return el > 20; }], [1,2,2,3], 'exclude all numbers greater than 20');
    test([{a:1},{a:2},{a:1}], [{a:1}], [{a:2}], 'exclude all a:1');
    test([1,2,2,3], [2,3], [1], 'can handle multiple arguments');
    test([fn], [fn], [], 'can find via strict equality');
    test([1,2,3], [[1,3]], [1,2,3], 'each argument is a separate element');
    test([1,2,3], [1,3], [2], 'however multiple arguments still work');
    test([[1,3],2], [[1,3]], [2], 'and those elements are still properly found');

    fn = function(el,i,arr){
      equal(el, 'a', 'first param should be the element');
      equal(i, 0, 'second param should be the index');
      equal(arr, ['a'], 'third param should be the array');
    }
    run(['a'], 'exclude', [fn]);

    arr = [1,2,3];
    run(arr, 'exclude', [2]);
    equal(arr, [1,2,3], 'should not affect the original array');

  });


  method('removeAt', function() {
    test([1,2,2,3], [1,2,2,3], 'numeric | no argument');
    test([1,2,2,3], [0], [2,2,3], 'numeric | 0');
    test([1,2,2,3], [1], [1,2,3], 'numeric | 1');
    test([1,2,2,3], [2], [1,2,3], 'numeric | 2');
    test([1,2,2,3], [3], [1,2,2], 'numeric | 3');
    test([1,2,2,3], [4], [1,2,2,3], 'numeric | 4');
    test(['a','b','c','c'], ['a','b','c','c'], 'alphabet | no argument');
    test(['a','b','c','c'], [0], ['b','c','c'], 'alphabet | 0');
    test(['a','b','c','c'], [1], ['a','c','c'], 'alphabet | 1');
    test(['a','b','c','c'], [2], ['a','b','c'], 'alphabet | 2');
    test(['a','b','c','c'], [3], ['a','b','c'], 'alphabet | 3');
    test(['a','b','c','c'], [4], ['a','b','c','c'], 'alphabet | 4');
    test([{a:1},{a:2},{a:1}], [1], [{a:1},{a:1}], 'objects | 1');
    test([1,2,2,3], [0,1], [2,3], '0 to 1');
    test([1,2,2,3], [0,2], [3], '0 to 2');
    test([1,2,2,3], [1,2], [1,3], '1 to 2');
    test([1,2,2,3], [1,5], [1], '1 to 5');
    test([1,2,2,3], [0,5], [], '0 to 5');
    test([1,2,2,3], [null,5], [], 'also accepts null');

    var arr = [1,2,3];
    run(arr, 'removeAt', [1]);
    equal(arr, [1,3], 'should affect the original array');
  });

  method('add', function() {

    test([1,2,3], [4], [1,2,3,4], '1,2,3 + 4');
    test(['a','b','c'], ['d'], ['a','b','c','d'], 'a,b,c + d');
    test([{a:1},{a:2}], [{a:3}], [{a:1},{a:2},{a:3}], 'a:1,a:2 + a:3');
    test([1,2,3], [[3,4,5]], [1,2,3,3,4,5], '1,2,3 + 3,4,5');
    test(['a','b','c'], [['c','d','e']], ['a','b','c','c','d','e'], 'a,b,c + c,d,e');
    test([1,2,3], [[1,2,3]], [1,2,3,1,2,3], '1,2,3 + 1,2,3');
    test([1,2,3], [[3,2,1]], [1,2,3,3,2,1], '1,2,3 + 3,2,1');
    test([], [[3]], [3], 'empty array + 3');
    test([3], [[]], [3], '3 + empty array');
    test([], [[]], [], '2 empty arrays');
    test([null], [[]], [null], '[null] + empty array');
    test([null], [[null]], [null, null], '[null] + [null]');
    test([false], [[false]], [false, false], '[false] + [false]');
    test([false], [[0]], [false, 0], '[false] + [0]');
    test([false], [[null]], [false, null], '[false] + [null]');
    test([false], [[undefined]], [false, undefined], '[false] + [undefined]');
    test([{a:1},{b:2}], [[{b:2},{c:3}]], [{a:1},{b:2},{b:2},{c:3}], 'a:1,b:2 + b:2,c:3');
    test([1,1,3], [[1,5,6]], [1,1,3,1,5,6], '1,1,3 + 1,5,6');
    test([1,2,3], [[4,5,6]], [1,2,3,4,5,6], '1,2,3 + 4,5,6');
    test([1,2,3], [1], [1,2,3,1], '1,2,3 + 1');

    test([1,2,3], [4, 1], [1,4,2,3], 'index 1 | 4');
    test(['a','b','c'], ['d', 1], ['a','d','b','c'], 'index 1 | d');
    test([{a:1},{a:2}], [{a:3}, 1], [{a:1},{a:3},{a:2}], 'index 1 | a:3');
    test([1,2,3], [4, 2], [1,2,4,3], 'index 2 | 4');
    test(['a','b','c'], ['d', 2], ['a','b','d','c'], 'index 2 | d');
    test([{a:1},{a:2}], [{a:3}, 2], [{a:1},{a:2},{a:3}], 'index 2 | a:3');

    test(['a','b','c'], ['d', 5], ['a','b','c','d'], 'index 5 | d');
    test(['a','b','c'], ['d', 0], ['d','a','b','c'], 'index 0 | d');
    test(['a','b','c'], ['d', -1], ['a','b','d','c'], 'index -1 | d');
    test(['a','b','c'], ['d', -2], ['a','d','b','c'], 'index -2 | d');
    test(['a','b','c'], ['d', -3], ['d','a','b','c'], 'index -3 | d');
    test(['a','b','c'], ['d', -4], ['d','a','b','c'], 'index -4 | d');
    test(['a','b','c'], ['d', null], ['d','a','b','c'], 'null index | d');
    test(['a','b','c'], ['d', undefined], ['a','b','c','d'], 'undefined index | d');
    test(['a','b','c'], ['d', 'a'], ['a','b','c','d'], 'index a | d');
    test(['a','b','c'], ['d', NaN], ['a','b','c','d'], 'index NaN | d');

    var arr = [1,2,3];
    run(arr, 'add', [4]);
    equal(arr, [1,2,3,4], 'should affect the original array');

  });


  method('insert', function() {

    test([1,2,3], [4], [1,2,3,4], '1,2,3 + 4');
    test(['a','b','c'], ['d'], ['a','b','c','d'], 'a,b,c + d');
    test([{a:1},{a:2}], [{a:3}], [{a:1},{a:2},{a:3}], 'a:1,a:2 + a:3');
    test([1,2,3], [[3,4,5]], [1,2,3,3,4,5], '1,2,3 + 3,4,5');
    test(['a','b','c'], [['c','d','e']], ['a','b','c','c','d','e'], 'a,b,c + c,d,e');
    test([1,2,3], [[1,2,3]], [1,2,3,1,2,3], '1,2,3 + 1,2,3');
    test([1,2,3], [[3,2,1]], [1,2,3,3,2,1], '1,2,3 + 3,2,1');
    test([], [[3]], [3], 'empty array + 3');
    test([3], [[]], [3], '3 + empty array');
    test([], [[]], [], '2 empty arrays');
    test([null], [[]], [null], '[null] + empty array');
    test([null], [[null]], [null, null], '[null] + [null]');
    test([false], [[false]], [false, false], '[false] + [false]');
    test([false], [[0]], [false, 0], '[false] + [0]');
    test([false], [[null]], [false, null], '[false] + [null]');
    test([false], [[undefined]], [false, undefined], '[false] + [undefined]');
    test([{a:1},{b:2}], [[{b:2},{c:3}]], [{a:1},{b:2},{b:2},{c:3}], 'a:1,b:2 + b:2,c:3');
    test([1,1,3], [[1,5,6]], [1,1,3,1,5,6], '1,1,3 + 1,5,6');
    test([1,2,3], [[4,5,6]], [1,2,3,4,5,6], '1,2,3 + 4,5,6');
    test([1,2,3], [1], [1,2,3,1], '1,2,3 + 1');

    test([1,2,3], [4, 1], [1,4,2,3], 'index 1 | 4');
    test(['a','b','c'], ['d', 1], ['a','d','b','c'], 'index 1 | d');
    test([{a:1},{a:2}], [{a:3}, 1], [{a:1},{a:3},{a:2}], 'index 1 | a:3');
    test([1,2,3], [4, 2], [1,2,4,3], 'index 2 | 4');
    test(['a','b','c'], ['d', 2], ['a','b','d','c'], 'index 2 | d');
    test([{a:1},{a:2}], [{a:3}, 2], [{a:1},{a:2},{a:3}], 'index 2 | a:3');
    test(['a','b','c'], ['d', 5], ['a','b','c','d'], 'index 5 | d');

    test(['a','b','c'], ['d', 0], ['d','a','b','c'], 'index 0 | d');
    test(['a','b','c'], ['d', -1], ['a','b','d','c'], 'index -1 | d');
    test(['a','b','c'], ['d', -2], ['a','d','b','c'], 'index -2 | d');
    test(['a','b','c'], ['d', -3], ['d','a','b','c'], 'index -3 | d');
    test(['a','b','c'], ['d', -4], ['d','a','b','c'], 'index -4 | d');
    test(['a','b','c'], ['d', null], ['d','a','b','c'], 'null index | d');
    test(['a','b','c'], ['d', undefined], ['a','b','c','d'], 'undefined index | d');
    test(['a','b','c'], ['d', 'a'], ['a','b','c','d'], 'index a | d');
    test(['a','b','c'], ['d', NaN], ['a','b','c','d'], 'index NaN | d');

    test(['a','b','c'], ['d', '0'], ['d','a','b','c'], 'string numerals should also be recognized');

    var arr = [1,2,3];
    run(arr, 'insert', [4]);
    equal(arr, [1,2,3,4], 'should affect the original array');

  });


  method('include', function() {

    test([1,2,3], [4], [1,2,3,4], '1,2,3 + 4');
    test(['a','b','c'], ['d'], ['a','b','c','d'], 'a,b,c + d');
    test([{a:1},{a:2}], [{a:3}], [{a:1},{a:2},{a:3}], 'a:1,a:2 + a:3');
    test([1,2,3], [[3,4,5]], [1,2,3,3,4,5], '1,2,3 + 3,4,5');
    test(['a','b','c'], [['c','d','e']], ['a','b','c','c','d','e'], 'a,b,c + c,d,e');
    test([1,2,3], [[1,2,3]], [1,2,3,1,2,3], '1,2,3 + 1,2,3');
    test([1,2,3], [[3,2,1]], [1,2,3,3,2,1], '1,2,3 + 3,2,1');
    test([], [[3]], [3], 'empty array + 3');
    test([3], [[]], [3], '3 + empty array');
    test([], [[]], [], '2 empty arrays');
    test([null], [[]], [null], '[null] + empty array');
    test([null], [[null]], [null, null], '[null] + [null]');
    test([false], [[false]], [false, false], '[false] + [false]');
    test([false], [[0]], [false, 0], '[false] + [0]');
    test([false], [[null]], [false, null], '[false] + [null]');
    test([false], [[undefined]], [false, undefined], '[false] + [undefined]');
    test([{a:1},{b:2}], [[{b:2},{c:3}]], [{a:1},{b:2},{b:2},{c:3}], 'a:1,b:2 + b:2,c:3');
    test([1,1,3], [[1,5,6]], [1,1,3,1,5,6], '1,1,3 + 1,5,6');
    test([1,2,3], [[4,5,6]], [1,2,3,4,5,6], '1,2,3 + 4,5,6');
    test([1,2,3], [1], [1,2,3,1], '1,2,3 + 1');

    test([1,2,3], [4, 1], [1,4,2,3], 'index 1 | 4');
    test(['a','b','c'], ['d', 1], ['a','d','b','c'], 'index 1 | d');
    test([{a:1},{a:2}], [{a:3}, 1], [{a:1},{a:3},{a:2}], 'index 1 | a:3');
    test([1,2,3], [4, 2], [1,2,4,3], 'index 2 | 4');
    test(['a','b','c'], ['d', 2], ['a','b','d','c'], 'index 2 | d');
    test([{a:1},{a:2}], [{a:3}, 2], [{a:1},{a:2},{a:3}], 'index 2 | a:3');
    test(['a','b','c'], ['d', 5], ['a','b','c','d'], 'index 5 | d');

    test(['a','b','c'], ['d', 0], ['d','a','b','c'], 'index 0 | d');
    test(['a','b','c'], ['d', -1], ['a','b','d','c'], 'index -1 | d');
    test(['a','b','c'], ['d', -2], ['a','d','b','c'], 'index -2 | d');
    test(['a','b','c'], ['d', -3], ['d','a','b','c'], 'index -3 | d');
    test(['a','b','c'], ['d', -4], ['d','a','b','c'], 'index -4 | d');
    test(['a','b','c'], ['d', null], ['d','a','b','c'], 'null index | d');
    test(['a','b','c'], ['d', undefined], ['a','b','c','d'], 'undefined index | d');
    test(['a','b','c'], ['d', 'a'], ['a','b','c','d'], 'index a | d');
    test(['a','b','c'], ['d', NaN], ['a','b','c','d'], 'index NaN | d');

    var arr = [1,2,3];
    run(arr, 'include', [4]);
    equal(arr, [1,2,3], 'should not affect the original array');

  });

  method('clone', function() {
    var arr = [1,2,3];
    var arr2 = run(arr, 'clone');
    equal(arr, arr2, 'should clone the array');
    arr2.splice(1, 1);
    equal(arr, [1,2,3], 'original array should be untouched');
  });

  method('isEmpty', function() {
    test([1,2,3], false, '1,2,3');
    test([], true, 'empty array');
    test([null], true, '[null]');
    test([undefined], true, '[undefined]');
    test([null,null], true, '[null,null]');
    test([undefined,undefined], true, '[undefined,undefined]');
    test([false,false], false, '[false,false]');
    test([0,0], false, '[0,0]');
  });


  method('any', function() {

    test([1,2,3], [1], true, 'numeric | 1');
    test([1,2,3], [4], false, 'numeric | 4');
    test([1,2,3], ['a'], false, 'numeric | a');
    test(['a','b','c'], ['a'], true, 'alphabet | a');
    test(['a','b','c'], ['f'], false, 'alphabet | f');
    test(['a','b','c'], [/[a-f]/], true, 'alphabet | /[a-f]/');
    test(['a','b','c'], [/[m-z]/], false, 'alphabet | /[m-z]/');
    test([{a:1},{a:2},{a:1}], [1], false, 'objects | 1');
    test([0], [0], true, '[0] | 0');
    test([{a:1},{a:2},{a:1}], [{a:1}], true, 'objects | a:1');

    test(['a','b','c'], [function(e) { return e.length > 1; }], false, 'alphabet | length greater than 1');
    test(['a','b','c'], [function(e) { return e.length < 2; }], true, 'alphabet | length less than 2');
    test(['a','bar','cat'], [function(e) { return e.length < 2; }], true, 'a,bar,cat | length less than 2');
    test([{a:1},{a:2},{a:1}], [function(e) { return e['a'] == 1; }], true, 'objects | key "a" is 1');
    test([{a:1},{a:2},{a:1}], [function(e) { return e['b'] == 1; }], false, 'objects | key "b" is 1');

    var fn = function() {
      equal(this.toString(), 'wasabi', 'scope should be passable');
    };
    run([1], 'any', [fn, 'wasabi']);

    raisesError(function(){ [1,2,3].any() }, 'no argument raises a TypeError');
  });

  method('none', function() {

    test([1,2,3], [1], false, 'numeric | 1');
    test([1,2,3], [4], true, 'numeric | 4');
    test([1,2,3], ['a'], true, 'numeric | a');
    test(['a','b','c'], ['a'], false, 'alphabet | a');
    test(['a','b','c'], ['f'], true, 'alphabet | f');
    test(['a','b','c'], [/[a-f]/], false, 'alphabet | /[a-f]/');
    test(['a','b','c'], [/[m-z]/], true, 'alphabet | /[m-z]/');
    test([{a:1},{a:2},{a:1}], [1], true, 'objects | 1');
    test([{a:1},{a:2},{a:1}], [{a:1}], false, 'objects | a:1');

    test(['a','b','c'], [function(e) { return e.length > 1; }], true, 'alphabet | length is greater than 1');
    test(['a','b','c'], [function(e) { return e.length < 2; }], false, 'alphabet | length is less than 2');
    test(['a','bar','cat'], [function(e) { return e.length < 2; }], false, 'a,bar,cat | length is less than 2');
    test([{a:1},{a:2},{a:1}], [function(e) { return e['a'] == 1; }], false, 'objects | key "a" is 1');
    test([{a:1},{a:2},{a:1}], [function(e) { return e['b'] == 1; }], true, 'objects | key "b" is 1');

    raisesError(function() { run([1,2,3], 'none'); }, 'no argument raises a TypeError');
  });

  method('all', function() {

    test([1,2,3], [1], false, 'numeric | 1');
    test([1,1,1], [1], true, 'numeric | 1 is true for all');
    test([1,2,3], [3], false, 'numeric | 3');
    test(['a','b','c'], ['a'], false, 'alphabet | a');
    test(['a','a','a'], ['a'], true, 'alphabet | a is true for all');
    test(['a','b','c'], ['f'], false, 'alphabet | f');
    test(['a','b','c'], [/[a-f]/], true, 'alphabet | /[a-f]/');
    test(['a','b','c'], [/[a-b]/], false, 'alphabet | /[m-z]/');
    test([{a:1},{a:2},{a:1}], [1], false, 'objects | 1');
    test([{a:1},{a:2},{a:1}], [{a:1}], false, 'objects | a:1');
    test([{a:1},{a:1},{a:1}], [{a:1}], true, 'objects | a:1 is true for all');


    test(['a','b','c'], [function(e) { return e.length > 1; }], false, 'alphabet | length is greater than 1');
    test(['a','b','c'], [function(e) { return e.length < 2; }], true, 'alphabet | length is less than 2');
    test(['a','bar','cat'], [function(e) { return e.length < 2; }], false, 'a,bar,cat | length is less than 2');
    test([{a:1},{a:2},{a:1}], [function(e) { return e['a'] == 1; }], false, 'objects | key "a" is 1');
    test([{a:1},{a:2},{a:1}], [function(e) { return e['b'] == 1; }], false, 'objects | key "b" is 1');
    test([{a:1},{a:1},{a:1}], [function(e) { return e['a'] == 1; }], true, 'objects | key "a" is 1 for all');


    var fn = function() {
      equal(this.toString(), 'wasabi', 'scope should be passable');
    };
    run([1], 'all', [fn, 'wasabi']);

    raisesError(function() { run([1,2,3], 'all'); }, 'no argument raises a type error');
  });

  method('flatten', function() {

    test([1,2,3], [1,2,3], '1,2,3');
    test(['a','b','c'], ['a','b','c'], 'a,b,c');
    test([{a:1},{a:2},{a:1}], [{a:1},{a:2},{a:1}], 'a:1,a:2,a:1');
    test([[1],[2],[3]], [1,2,3], '[1],[2],[3]');
    test([[1,2],[3]], [1,2,3], '[1,2],[3]');
    test([[1,2,3]], [1,2,3], '[1,2,3]');
    test([['a'],['b'],['c']], ['a','b','c'], '[a],[b],[c]');
    test([['a','b'],['c']], ['a','b','c'], '[a,b],[c]');
    test([['a','b','c']], ['a','b','c'], '[a,b,c]');
    test([[{a:1}],[{a:2}],[{a:1}]], [{a:1},{a:2},{a:1}], '[a:1],[a:2],[a:1]');
    test([[{a:1},{a:2}],[{a:1}]], [{a:1},{a:2},{a:1}], '[a:1,a:2],[a:1]');
    test([[{a:1},{a:2},{a:1}]], [{a:1},{a:2},{a:1}], '[a:1,a:2,a:1]');
    test([[[['a','b'],'c',['d','e']],'f'],['g']], ['a','b','c','d','e','f','g'], '[[a,b],c,[d,e],f],g');

    test([[[['a','b'],'c',['d','e']],'f'],['g']], [1], [[['a','b'],'c',['d','e']],'f','g'], 'can flatten only first level');
    test([[[['a','b'],'c',['d','e']],'f'],['g']], [false], ['a','b','c','d','e','f','g'], 'wont explode on false');
    test([[[['a','b'],'c',['d','e']],'f'],['g']], [true], [[['a','b'],'c',['d','e']],'f','g'], 'wont explode on true');

    equal(run([undefined], 'flatten').length, sparseArraySupport ? 1 : 0, 'should not compact arrays');
  });


  method('sortBy', function() {
    var arr;

    arr = ['more','everyone!','bring','the','family'];
    test(arr, ['length'], ['the','more','bring','family','everyone!'], 'sorting by length');
    test(arr, ['length', true], ['everyone!','family','bring','more','the'], 'desc | sorting by length');

    test(arr, [function(a) { return a.length; }], ['the','more','bring','family','everyone!'], 'sort by length by function');
    test(arr, [function(a) { return a.length; }, true], ['everyone!','family','bring','more','the'], 'desc | sort by length by function');

    arr = [{a:'foo'},{a:'bar'},{a:'skittles'}];
    test(arr, ['a'], [{a:'bar'},{a:'foo'},{a:'skittles'}], 'sort by key "a"');
    test(arr, ['a', true], [{a:'skittles'},{a:'foo'},{a:'bar'}], 'desc | sort by key "a"');

    arr = [1,2,3];
    run(arr, 'sortBy', [function(n){ return 3 - n; }]);
    equal(arr, [1,2,3], 'should not be destructive');

    test([1,2,3], [undefined], [1,2,3], 'undefined');
    test([1,2,3], [null], [1,2,3], 'null');
    test([1,2,3], [4], [1,2,3], 'number');

    var Simple = function(num) {
      this.valueOf = function() {
        return num;
      }
    }

    var a = new Simple(5);
    var b = new Simple(2);
    var c = new Simple(3);
    var d = new Simple(1);
    var e = new Simple(2);

    test([a,b,c,d,e], [d,b,e,c,a], 'objects with "valueOf" defined will also be sorted properly');
  });

  method('randomize', function() {
    var arr = [1,2,3,4,5,6,7,8,9,10];
    var firsts = [];
    firsts.push(run(arr, 'randomize')[0]);
    firsts.push(run(arr, 'randomize')[0]);
    firsts.push(run(arr, 'randomize')[0]);
    firsts.push(run(arr, 'randomize')[0]);
    firsts.push(run(arr, 'randomize')[0]);
    firsts.push(run(arr, 'randomize')[0]);
    firsts.push(run(arr, 'randomize')[0]);
    firsts.push(run(arr, 'randomize')[0]);
    firsts.push(run(arr, 'randomize')[0]);
    firsts.push(run(arr, 'randomize')[0]);

    /* Note that there is a built-in 0.00000001% chance that this test will fail */
    equal(firsts.every(function(a) { return a == 1; }), false, 'sufficiently randomized');

  });

  group('Array Inheritance', function() {

    // Inherits from array...

    var Soup = function() {}, x;
    Soup.prototype = [1,2,3];

    x = new Soup();
    count = 0;

    run(x, 'each', [function() {
      count++;
    }]);
    run(x, 'find', [function() {
      count++;
    }]);
    run(x, 'findAll', [function() {
      count++;
    }]);

    equal(count, 9, 'array elements in the prototype chain are also properly iterated');


    // Inherits from sparse array...

    var arr = ['a'];
    arr[20] = 'b';

    Soup.prototype = arr;

    x = new Soup();
    count = 0;

    run(x, 'each', [function() {
      count++;
    }]);

    equal(count, 2, 'sparse array elements in the prototype chain are also properly iterated');

    // This test cannot be framed in a meaninful way... IE will not set the length property
    // when pushing new elements and other browsers will not work on sparse arrays...
    // equal(count, 6, 'Array | objects that inherit from arrays can still iterate');
  });

  method('create', function() {
    var stringObj = new String('foo');

    test(Array, [], 'no args');
    test(Array, ['one'], ['one'], 'string');
    test(Array, [stringObj], [stringObj], 'string object');
    test(Array, [{length: 2}], [{length: 2}], "can't trick array-like coercion");
    test(Array, [2], [2], 'number');
    test(Array, [[2]], [2], 'in array | number');
    test(Array, [true], [true], 'boolean');
    test(Array, [[true]], [true], 'in array | boolean');
    test(Array, [null], [null], 'null');
    test(Array, [[null]], [null], 'in array | null');
    test(Array, [undefined], [undefined], 'mixed');
    test(Array, [[undefined]], [undefined], 'in array | mixed');
    test(Array, ['one', 2, true, null], ['one', 2, true, null], 'mixed 1');
    test(Array, ['one', 2, true, undefined], ['one', 2, true, undefined], 'mixed 2');

    test(Array, [[1,2,3]], [1,2,3], 'passing an array');
    test(Array, [[[1,2,3]]], [[1,2,3]], 'in array | is nested');
    test(Array, [[1,2,3], [1,2,3]], [1,2,3,1,2,3], 'passing two arrays will concat them');
    test(Array, [[1,2,3], 'four'], [1,2,3,'four'], 'passing an array and another object will concat them');

    test(Array, [{a:1}], [{a:1}], 'object');
    test(Array, [[{a:1}]], [{a:1}], 'in array | object');
    test(Array, [{a:1}, {b:2}], [{a:1},{b:2}], 'two objects');
    test(Array, [{a:1}, ['b']], [{a:1}, 'b'], 'object and array');
    test(Array, [{a:1}, 'b'], [{a:1}, 'b'], 'object and string');

    equal((function(){ return run(Array, 'create', [arguments]); })('one','two'), ['one','two'], 'works on an arguments object');
    equal((function(){ return run(Array, 'create', [arguments]); })(), [], 'works on a zero length arguments object');
    equal((function(){ return run(Array, 'create', [arguments]); })('one').slice, Array.prototype.slice, 'converted arguments object is a true array');
    equal((function(){ return run(Array, 'create', [arguments]); })('one','two').slice, Array.prototype.slice, 'two | converted arguments object is a true array');
    equal((function(){ return Sugar.Array.create.apply(null, [arguments]); })('one','two'), ['one','two'], 'arguments using apply');

    var args = (function() { return arguments; })(true, 1, 'two');
    test(Array, [[args]], [args], 'nested arguments is a nested array');

  });

  method('zip', function() {
    test([1, 2, 3], [[1], [2], [3]], 'one array');
    test([1, 2, 3], [[4, 5, 6]], [[1, 4], [2, 5], [3, 6]], 'two arrays');
    test([1, 2, 3], [[4, 5, 6], [7, 8, 9]], [[1, 4, 7], [2, 5, 8], [3, 6, 9]], 'three arrays');
    test([1, 2], [[4, 5, 6], [7, 8, 9]], [[1, 4, 7], [2, 5, 8]], 'constrained by length of first');
    test([4, 5, 6], [[1, 2], [8]], [[4, 1, 8], [5, 2, null], [6, null, null]], 'filled with null');
  });

  method('findIndex', function() {
    test(['a','b','c'], ['b'], 1, 'b in a,b,c');
    test(['a','b','c'], ['b', 0], 1, 'b in a,b,c from 0');
    test(['a','b','c'], ['a'], 0, 'a in a,b,c');
    test(['a','b','c'], ['f'], -1, 'f in a,b,c');

    test(['a','b','c','b'], ['b'], 1, 'finds first instance');

    test([5,2,4], [5], 0, '5 in 5,2,4');
    test([5,2,4], [2], 1, '2 in 5,2,4');
    test([5,2,4], [4], 2, '4 in 5,2,4');

    test([{ foo: 'bar' }], [{ foo: 'bar' }], 0, 'will find deep objects');
    test([{ foo: 'bar' }], [function(a) { return a.foo === 'bar'; }], 0, 'will run against a function');

    test(['a','b','c'], [/[bz]/], 1, 'matches regexp');

    var people = [
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'ronnie', age: 13, hair: 'brown'  },
      { name: 'edmund', age: 27, hair: 'blonde' }
    ];

    test(people, [function(person) { return person.age == 13; }], 2, 'JSON objects');
  });

  method('sample', function() {
    var arr = [1,2,3,4,5,6,7,8,9,10];
    var samples = [];

    samples.push(run(arr, 'sample'));
    samples.push(run(arr, 'sample'));
    samples.push(run(arr, 'sample'));
    samples.push(run(arr, 'sample'));
    samples.push(run(arr, 'sample'));
    samples.push(run(arr, 'sample'));
    samples.push(run(arr, 'sample'));
    samples.push(run(arr, 'sample'));
    samples.push(run(arr, 'sample'));
    samples.push(run(arr, 'sample'));

    /* Note that there is a built-in 0.00000001% chance that this test will fail */
    equal(samples.every(function(a) { return a == 1; }), false, 'should get a good randomization');

    equal(typeof run(arr, 'sample'), 'number', 'no params');
    equal(run(arr, 'sample', [1]).length, 1, '1');
    equal(run(arr, 'sample', [2]).length, 2, '2');
    equal(run(arr, 'sample', [3]).length, 3, '3');
    equal(run(arr, 'sample', [4]).length, 4, '4');
    equal(run(arr, 'sample', [11]).length, 10, "can't sample more than the length of the array");

    var arr2 = Sugar.Array.unique(run(arr, 'sample', [10]));
    equal(arr2.length, arr.length, "should not sample the same element twice");

    equal(run(arr, 'sample', [0]).length, 0, '0');
  });

  method('findAll', function() {
    var people = [
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'ronnie', age: 13, hair: 'brown'  },
      { name: 'edmund', age: 27, hair: 'blonde' },
      { name: 'buddy',  age: 82, hair: { color: 'red', type: 'long', cost: 15, last_cut: new Date(2010, 4, 18) } }
    ];

    test(people, [], 'complex | no arguments');
    test(people, [{}], people, 'complex | empty object');
    test(people, ['age'], [], 'complex | string argument');
    test(people, [4], [], 'complex | number argument');
    test(people, [{ age: 27 }], [people[0], people[3]], 'complex | one property');
    test(people, [{ age: 27, hair: 'brown' }], [people[0]], 'complex | two properties');
    test(people, [{ hair: { color: 'red' }}], [people[4]], 'complex | nested property');
    test(people, [{ hair: { color: 'green' }}], [], 'complex | non-matching nested property');
    test(people, [{ hair: { color: 'red', type: 'long' }}], [people[4]], 'complex | two nested properties');
    test(people, [{ hair: { color: 'green', type: 'mean' }}], [], 'complex | two non-matching nested properties');
    test(people, [{ hair: { color: 'red', type: 'mean' }}], [], 'complex | two nested properties, one non-matching');
    test(people, [{ hair: { color: 'red', life: 'long' }}], [], 'complex | two nested properties, one non-existing');
    test(people, [{ hair: { color: /r/ }}], [people[4]], 'complex | nested regex');
    test(people, [{ hair: { cost: 15 }}], [people[4]], 'complex | nested number');
    test(people, [{ hair: { cost: 23 }}], [], 'complex | nested non-matching number');
    test(people, [{ hair: { cost: undefined }}], [], 'complex | nested undefined property');
    test(people, [{ hair: { post: undefined }}], [people[4]], 'complex | nested undefined property non-existent');
    test(people, [{ hair: { cost: NaN }}], [], 'complex | nested property is NaN');
    test(people, [{ hair: { color: function(c){ return c == 'red'; } }}], [people[4]], 'complex | nested function');
    test(people, [{ some: { random: { shit: {}}}}], [], 'complex | totally unrelated properties');
    test(people, [{ hair: { last_cut: new Date(2010, 4, 18) }}], [people[4]], 'complex | simple date');
  });

  method('some', function() {
    var people = [
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'ronnie', age: 13, hair: 'brown'  },
      { name: 'edmund', age: 27, hair: 'blonde' },
      { name: 'buddy',  age: 82, hair: { color: 'red', type: 'long', cost: 15, last_cut: new Date(2010, 4, 18) } }
    ];

    test(people, [{ age: 27 }], true, 'complex | one property');
    test(people, [{ age: 27, hair: 'brown' }], true, 'complex | two properties');
    test(people, [{ hair: { color: 'red' }}], true, 'complex | nested property');
    test(people, [{ hair: { color: 'green' }}], false, 'complex | non-matching nested property');
    test(people, [{ hair: { color: 'red', type: 'long' }}], true, 'complex | two nested properties');
    test(people, [{ hair: { color: 'green', type: 'mean' }}], false, 'complex | two non-matching nested properties');
    test(people, [{ hair: { color: 'red', type: 'mean' }}], false, 'complex | two nested properties, one non-matching');
    test(people, [{ hair: { color: 'red', life: 'long' }}], false, 'complex | two nested properties, one non-existing');
    test(people, [{ hair: { color: /r/ }}], true, 'complex | nested regex');
    test(people, [{ hair: { cost: 15 }}], true, 'complex | nested number');
    test(people, [{ hair: { cost: 23 }}], false, 'complex | nested non-matching number');
    test(people, [{ hair: { cost: undefined }}], false, 'complex | nested undefined property');
    test(people, [{ hair: { cost: NaN }}], false, 'complex | nested property is NaN');
    test(people, [{ hair: { color: function(c){ return c == 'red'; } }}], true, 'complex | nested function');
    test(people, [{ some: { random: { shit: {}}}}], false, 'complex | totally unrelated properties');
    test(people, [{ hair: { last_cut: new Date(2010, 4, 18) }}], true, 'complex | simple date');
  });

  method('none', function() {
    var people = [
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'ronnie', age: 13, hair: 'brown'  },
      { name: 'edmund', age: 27, hair: 'blonde' },
      { name: 'buddy',  age: 82, hair: { color: 'red', type: 'long', cost: 15, last_cut: new Date(2010, 4, 18) } }
    ];

    test(people, [{ age: 27 }], false, 'complex | one property');
    test(people, [{ age: 27, hair: 'brown' }], false, 'complex | two properties');
    test(people, [{ hair: { color: 'red' }}], false, 'complex | nested property');
    test(people, [{ hair: { color: 'green' }}], true, 'complex | non-matching nested property');
    test(people, [{ hair: { color: 'red', type: 'long' }}], false, 'complex | two nested properties');
    test(people, [{ hair: { color: 'green', type: 'mean' }}], true, 'complex | two non-matching nested properties');
    test(people, [{ hair: { color: 'red', type: 'mean' }}], true, 'complex | two nested properties, one non-matching');
    test(people, [{ hair: { color: 'red', life: 'long' }}], true, 'complex | two nested properties, one non-existing');
    test(people, [{ hair: { color: /r/ }}], false, 'complex | nested regex');
    test(people, [{ hair: { cost: 15 }}], false, 'complex | nested number');
    test(people, [{ hair: { cost: 23 }}], true, 'complex | nested non-matching number');
    test(people, [{ hair: { cost: undefined }}], true, 'complex | nested undefined property');
    test(people, [{ hair: { cost: NaN }}], true, 'complex | nested property is NaN');
    test(people, [{ hair: { color: function(c){ return c == 'red'; } }}], false, 'complex | nested function');
    test(people, [{ none: { random: { shit: {}}}}], true, 'complex | totally unrelated properties');
    test(people, [{ hair: { last_cut: new Date(2010, 4, 18) }}], false, 'complex | simple date');
  });


  method('fuzzy', function() {
    var arr = [{name: 'joe', age: 25}];
    var match = { name: /j/ };

    equal(run(arr, 'every', [match]), true, 'every');
    equal(run(arr, 'some', [match]), true, 'some');
    equal(run(arr, 'none', [match]), false, 'none');
    equal(run(arr, 'count', [match]), 1, 'count');
    equal(run(arr, 'find', [match]), arr[0], 'find');
    equal(run(arr, 'findAll', [match]), [arr[0]], 'findAll');
    equal(run(arr, 'findIndex', [match]), 0, 'findIndex');
    equal(run(arr, 'exclude', [match]).length, 0, 'exclude');


    var arr2 = run(testClone(arr), 'remove', [match]);
    equal(arr2.length, 0, 'remove');

    equal(run([arr], 'intersect', [[match]]), [], 'intersect is NOT fuzzy');
    equal(run([match], 'intersect', [[arr]]), [], 'intersect reverse is NOT fuzzy');

    equal(run(arr, 'subtract', [[match]]), arr, 'subtract is NOT fuzzy');
    equal(run([match], 'subtract', [[arr]]), [match], 'subtract reverse is NOT fuzzy');

    equal(run(arr, 'unique', [match]), arr, 'unique is NOT fuzzy');
    equal(run([match], 'unique', [arr]), [match], 'unique reverse is NOT fuzzy');
  });

  method('sortBy', function() {
    var arr;

    var CapturedSortOrder       = Sugar.Array.AlphanumericSortOrder;
    var CapturedSortIgnore      = Sugar.Array.AlphanumericSortIgnore;
    var CapturedSortIgnoreCase  = Sugar.Array.AlphanumericSortIgnoreCase;
    var CapturedSortEquivalents = Sugar.Array.AlphanumericSortEquivalents;


    test([0,1,2,3,4], [0,1,2,3,4], '0 is properly sorted');
    test(['0','1','2','3','4'], ['0','1','2','3','4'], 'string numerals are properly sorted');
    test(['c','B','a'], ['a','B','c'], 'upper-case is properly sorted');
    test(['back','Bad','banker'], ['back','Bad','banker'], 'case is ignored by default');
    test(['c','B','a','ä','ò','p'], ['a','ä','B','c','ò','p'], 'should allow normalization if exists');
    test(['apple','apples'], ['apple','apples'], 'basic string length');
    test(['has','hàs','had','hàd'], ['had','hàd','has','hàs'], 'special chars basic');
    test(['AM','AB'], ['AB','AM'], '0 index is properly sorted');

    arr = ['San','San Cristobal','San Juan','San Teodoro','San Tomas','Santa Barbara','Santa Clara','Santa Cruz','Santo Domingo'];
    test(arr, arr, 'spaces are counted');

    arr = ['#foob','(fooc','fooa'];
    test(arr, arr, 'special chars are not ignored by default');

    arr = [
      '8braham',
      'a4raham',
      'abraham'
    ];
    test(arr, arr, 'Numbers are filtered to the top');

    arr = [
      'pine',
      'pino',
      'piñata'
    ];
    test(arr, arr, 'Spanish ñ is respected');

    var frenchNames = [
      'abelle',
      'aceline',
      'adélaïde',
      'adelais',
      'adèle',
      'adélie',
      'adeline',
      'adelle',
      'adelphe',
      'adrienne',
      'agace',
      'agate',
      'aglaë',
      'agnès',
      'agrippine',
      'aimée',
      'alaina',
      'alais',
      'alayna',
      'albertine',
      'alexandrie',
      'alexandrine',
      'aliénor',
      'aline',
      'alison',
      'alphonsine',
      'alvery',
      'amaline',
      'amandine',
      'amarante',
      'ambre',
      'ambrosine',
      'amélie',
      'amorette',
      'anaïs',
      'anastaise',
      'anastasie',
      'andrée',
      'andromaque',
      'anette',
      'angèle',
      'angeline',
      'angelique',
      'ann',
      'anne'
    ];

    test(Sugar.Array.randomize(frenchNames), frenchNames, 'sorting french names');

    arr = frenchNames.map(function(n) {
      return n.toUpperCase();
    });
    test(Sugar.Array.randomize(arr), arr, 'sorting french names in upper case');

    // MSDN http://msdn.microsoft.com/en-us/library/cc194880.aspx
    arr = [
      'andere',
      'ändere',
      'chaque',
      'chemin',
      'cote',
      'cotÉ',
      'cÔte',
      'cÔtÉ',
      'Czech',
      'ČuČet',
      'hiŠa',
      'irdisch',
      'lävi',
      'lie',
      'lire',
      'llama',
      'LÖwen',
      'lÒza',
      'LÜbeck',
      'luck',
      'luČ',
      'lye',
      'Männer',
      'mÀŠta',
      'mÎr',
      'mÖchten',
      'myndig',
      'pint',
      'piÑa',
      'pylon',
      'sämtlich',
      'savoir',
      'Sietla',
      'subtle',
      'symbol',
      'Ślub',
      'ŠÀran',
      'väga',
      'verkehrt',
      'vox',
      'waffle',
      'wood',
      'yen',
      'yuan',
      'yucca',
      'zoo',
      'ZÜrich',
      'Zviedrija',
      'zysk',
      'Žal',
      'Žena'
    ];
    test(Sugar.Array.randomize(arr), arr, 'Default collation');

    arr = [
      'cweat',
      'cwect',
      'čweat',
      'čweet',
      'sweat',
      'swect',
      'šweat',
      'šweet',
      'zweat',
      'zwect',
      'žweat',
      'žweet'
    ];
    test(Sugar.Array.randomize(arr), arr, 'Czech/Lithuanian order is respected');

    arr = [
      'cat',
      'drone',
      'ðroll',
      'ebert'
    ];
    test(Sugar.Array.randomize(arr), arr, 'Icelandic ð order is respected');

    arr = [
      'goth',
      'ğoad',
      'hover',
      'sing',
      'şeparate',
      'tumble'
    ];
    test(Sugar.Array.randomize(arr), arr, 'Turkish order is respected');

    arr = [
      'ape',
      'ące',
      'central',
      'ćenter',
      'eulo',
      'ęula',
      'latch',
      'lever',
      'łevel',
      'martyr',
      'noob',
      'ńookie',
      'oppai',
      'sweat',
      'swect',
      'śweat',
      'śweet',
      'yeouch',
      'ýellow',
      'zipper',
      'zoophilia',
      'źebra',
      'żoo'
    ];
    test(Sugar.Array.randomize(arr), arr, 'Polish order is respected');

    arr = [
      'cab',
      'opec',
      'still',
      'zounds',
      'æee',
      'ølaf',
      'ålegra'
    ];
    test(Sugar.Array.randomize(arr), arr, 'Danish/Norwegian order is respected');

    arr = [
      'llama',
      'luck',
      'lye'
    ];
    // Compressions simply can't be handled without a complex collation system
    // as there is simply no way fundamentally to know what was intended as a
    // compression. For example "catch a llama" vs "catch Al Lama"
    test(Sugar.Array.randomize(arr), arr, 'Compressions are not handled');

    arr = [
      'àbel',
      'abet',
      'äpe',
      'apu',
      'âvec',
      'avel',
      'áxe',
      'axiom',
      'çoupon',
      'coupos',
      'écma',
      'ecmo',
      'êlam',
      'elan',
      'ëpic',
      'epil',
      'ëthen',
      'ether',
      'évac',
      'eval',
      'èxile',
      'exilo',
      'ïce',
      'icy',
      'îll',
      'ilp',
      'ïmpetum',
      'impetus',
      'íp',
      'is',
      'ìtalian',
      'italians',
      'luck',
      'lye',
      'òblast',
      'oblong',
      'ómam',
      'omar',
      'öpal',
      'opam',
      'ôva',
      'ovum',
      'ùla',
      'ule',
      'ûmar',
      'umas',
      'úni',
      'uny',
      'ùral',
      'uranus',
      'üte',
      'utu'
    ];
    test(Sugar.Array.randomize(arr), arr, 'Standard Western-Latin equivalents are enforced');

    // Swedish collation
    var swedishWords = [
      'att borsta',
      'att bränna',
      'att brinna',
      'att brinna',
      'att brista',
      'att bruka',
      'att bryta',
      'att bryta i bitar',
      'att buller',
      'att bygga',
      'att byta',
      'att chocka',
      'att dela',
      'att detaljera',
      'att dimpa',
      'att dö',
      'att dö',
      'att döda',
      'att dofta',
      'att dölja',
      'att döma',
      'att dra',
      'att dra',
      'att drabba',
      'att dricka',
      'att driva',
      'att driva',
      'att drömma',
      'att duga',
      'att erbjuda',
      'att erkänna',
      'att ersätta',
      'att explodera',
      'att falla',
      'att falla',
      'att fängsla',
      'att fara',
      'att fästa',
      'att fastna',
      'att fastställa',
      'att fatta',
      'att finna',
      'att finna',
      'att finnas',
      'att fira',
      'att fläta',
      'att få',
      'att fånga'
    ];
    test(swedishWords, swedishWords, 'swedish strings sorted on utf8_general_ci');

    var swedishCollated = [
      'att borsta',
      'att brinna',
      'att brinna',
      'att brista',
      'att bruka',
      'att bryta',
      'att bryta i bitar',
      'att bränna',
      'att buller',
      'att bygga',
      'att byta',
      'att chocka',
      'att dela',
      'att detaljera',
      'att dimpa',
      'att dofta',
      'att dra',
      'att dra',
      'att drabba',
      'att dricka',
      'att driva',
      'att driva',
      'att drömma',
      'att duga',
      'att dö',
      'att dö',
      'att döda',
      'att dölja',
      'att döma',
      'att erbjuda',
      'att erkänna',
      'att ersätta',
      'att explodera',
      'att falla',
      'att falla',
      'att fara',
      'att fastna',
      'att fastställa',
      'att fatta',
      'att finna',
      'att finna',
      'att finnas',
      'att fira',
      'att fläta',
      'att få',
      'att fånga',
      'att fängsla',
      'att fästa'
    ];

    Sugar.Array.AlphanumericSortEquivalents['ö'] = null;
    Sugar.Array.AlphanumericSortEquivalents['ä'] = null;

    test(swedishWords, swedishCollated, 'removing equivalents can restore sort order');

    // Capitals

    arr = [
      'abner',
      'aBBey',
      'Adrian',
      'aDella'
    ];

    expected = [
      'aBBey',
      'abner',
      'aDella',
      'Adrian'
    ];

    Sugar.Array.AlphanumericSortIgnoreCase = true;
    test(arr, expected, 'allows case ignore');

    expected = [
      'aDella',
      'Adrian',
      'aBBey',
      'abner'
    ];

    Sugar.Array.AlphanumericSortOrder = 'dba';
    test(arr, expected, 'allows other order');

    expected = [
      'aDella',
      'abner',
      'Adrian',
      'aBBey'
    ];
    Sugar.Array.AlphanumericSortIgnore = /[abcde]/g;
    test(arr, expected, 'allows custom ignore');

    Sugar.Array.AlphanumericSortOrder = 'cba';
    Sugar.Array.AlphanumericSortIgnore = CapturedSortIgnore;
    arr = ['cotÉ', 'cÔte', 'cÔtÉ', 'andere', 'ändere'];
    test(arr, arr, 'cba');

    Sugar.Array.AlphanumericSortOrder = CapturedSortOrder;
    Sugar.Array.AlphanumericSortIgnore = CapturedSortIgnore;
    Sugar.Array.AlphanumericSortIgnoreCase = CapturedSortIgnoreCase;
    Sugar.Array.AlphanumericSortEquivalents = CapturedSortEquivalents;


    // Issue #282

    test(['2','100','3'], ['2','3','100'], 'natural sort by default');
    test(['a2','a100','a3'], ['a2','a3','a100'], 'natural sort | leading char');
    test(['a2.5','a2.54','a2.4'], ['a2.4','a2.5','a2.54'], 'natural sort | floating number');
    test(['a100b', 'a100c', 'a100a'], ['a100a', 'a100b', 'a100c'], 'natural sort | number in middle');
    test(['a10.25b', 'a10.42c', 'a10.15a'], ['a10.15a', 'a10.25b', 'a10.42c'], 'natural sort | decimals in middle');
    test(['a10.15b', 'a10.15c', 'a10.15a'], ['a10.15a', 'a10.15b', 'a10.15c'], 'natural sort | middle decimal same, trailing char different');

    test(['a１０．２５b', 'a１０．４２c', 'a１０．１５a'], ['a１０．１５a', 'a１０．２５b', 'a１０．４２c'], 'natural sort | decimals in middle');
    test(['a１０．１５b', 'a１０．１５c', 'a１０．１５a'], ['a１０．１５a', 'a１０．１５b', 'a１０．１５c'], 'natural sort | full-width | middle decimal same, trailing char different');
    test(['２','１００','３'], ['２','３','１００'], 'natural sort | full width');
    test(['a２','a１００','a３'], ['a２','a３','a１００'], 'natural sort | full width | leading char');

    test(['title 1-300', 'title 1-1', 'title 1-5'], ['title 1-1', 'title 1-5', 'title 1-300'], 'natural sort | hyphenated');


    // The following tests were taken from http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm/

    test(['10',9,2,'1','4'], ['1',2,'4',9,'10'], 'other | simple');
    test(['10.0401',10.022,10.042,'10.021999'], ['10.021999',10.022,'10.0401',10.042], 'other | floats');
    test(['10.04f','10.039F','10.038d','10.037D'], ['10.037D','10.038d','10.039F','10.04f'], 'other | float & decimal notation');
    test(['1.528535047e5','1.528535047e7','1.528535047e3'], ['1.528535047e3','1.528535047e5','1.528535047e7'], 'scientific notation');
    test(['192.168.0.100','192.168.0.1','192.168.1.1'], ['192.168.0.1','192.168.0.100','192.168.1.1'], 'other | IP addresses');
    test(['car.mov','01alpha.sgi','001alpha.sgi','my.string_41299.tif'], ['001alpha.sgi','01alpha.sgi','car.mov','my.string_41299.tif'], 'other | filenames');
    test(['$10002.00','$10001.02','$10001.01'], ['$10001.01','$10001.02','$10002.00'], 'other | money');
    test(['1 Title - The Big Lebowski','1 Title - Gattaca','1 Title - Last Picture Show'], ['1 Title - Gattaca','1 Title - Last Picture Show','1 Title - The Big Lebowski'], 'stolen | movie titles');


    Sugar.Array.AlphanumericSortNatural = false;

    test(['2','100','3'], ['100','2','3'], 'natural sort off');
    test(['a2','a100','a3'], ['a100','a2','a3'], 'natural sort off | leading char');
    test(['a2.5','a2.54','a2.4'], ['a2.4','a2.5','a2.54'], 'natural sort off | with floating number');
    test(['２','１００','３'], ['１００','２','３'], 'natural sort off | full width');
    test(['a２','a１００','a３'], ['a１００','a２','a３'], 'natural sort off | full width leading char');

    Sugar.Array.AlphanumericSortNatural = true;



    // Issue #386 - sorting on multiple values

    var arr = [{a:'foo', b: 1},{a:'bar', b: 2},{a:'skittles', b: 1}];
    test(arr, [['b', 'a']], [{a:'foo',b:1},{a:'skittles',b:1},{a:'bar', b:2}], 'sort by key "b" then "a"');
    test([[1, 2], [1, 1], [0, 1], [0, 2]], [[0, 1], [0, 2], [1, 1], [1, 2]], 'sorting elements which are arrays');

    var arr = [
      {
        age: 34,
        name: 'Gary'
      },
      {
        age: 18,
        name: 'Alan'
      },
      {
        age: 8,
        name: 'Toby'
      },
      {
        age: 8,
        name: 'Ted'
      },
      {
        age: 8,
        name: 'Tina'
      }
    ];

    var expected = [
      {
        age: 18,
        name: 'Alan'
      },
      {
        age: 34,
        name: 'Gary'
      },
      {
        age: 8,
        name: 'Ted'
      },
      {
        age: 8,
        name: 'Tina'
      },
      {
        age: 8,
        name: 'Toby'
      }
    ];

    test(arr, [['name', 'age']], expected, 'sorting by name and age');
    test(arr, [['name', 'hair']], expected, 'sorting by non-existent property first');
    test(arr, [['hair', 'name']], expected, 'sorting by non-existent property second');
    test(arr, [['hair', 'eyes']], arr, 'sorting by both properties non-existent');

    var arr = [
      [5,4,3,2,1],
      [3,3,3],
      [4,3,2,1],
      [1,2,3],
      [1,2,3,4]
    ]

    var expected = [
      [1,2,3],
      [3,3,3],
      [1,2,3,4],
      [4,3,2,1],
      [5,4,3,2,1]
    ]

    test(arr, expected, 'sorting arrays of uneven length');

  });


  group('Complex Union/Intersect', function() {

    // Testing Array#union and Array#intersect on complex elements as found http://ermouth.com/fastArray/
    // Thanks to @ermouth!

    var yFunc = function () { return 'y'; }
    var xFunc = function () { return 'x'; }

    var arr1 = [
      { eccbc87e4b5ce2fe28308fd9f2a7baf3: 3 },
      /rowdy/,
      /randy/,
      yFunc,
      [6, "1679091c5a880faf6fb5e6087eb1b2dc"],
      xFunc,
      2
    ];

    var arr2 = [
      { eccbc87e4b5ce2fe28308fd9f2a7baf3: 3 },
      /rowdy/,
      /pandy/,
      xFunc,
      { e4da3b7fbbce2345d7772b0674a318d5: 5 },
      [8, "c9f0f895fb98ab9159f51fd0297e236d"]
    ];

    var unionExpected = [
      { eccbc87e4b5ce2fe28308fd9f2a7baf3: 3 },
      /rowdy/,
      /randy/,
      yFunc,
      [6, "1679091c5a880faf6fb5e6087eb1b2dc"],
      xFunc,
      2,
      /pandy/,
      { e4da3b7fbbce2345d7772b0674a318d5: 5 },
      [8, "c9f0f895fb98ab9159f51fd0297e236d"]
    ];

    var intersectExpected = [
      { eccbc87e4b5ce2fe28308fd9f2a7baf3: 3 },
      /rowdy/,
      xFunc
    ];


    equal(run(arr1, 'union', [arr2]), unionExpected, 'complex array unions');
    equal(run(arr1, 'intersect', [arr2]), intersectExpected, 'complex array intersects');

    equal(run([['a',1]], 'intersect', [[['a',1],['b',2]]]), [['a',1]], 'nested arrays are not flattened');
    equal(run([['a',1],['b',2]], 'subtract', [[['a',1]]]), [['b',2]], 'nested arrays are not flattened');
  });

  method('intersect', function() {

    var yFunc = function () { return 'y'; }
    var xFunc = function () { return 'x'; }

    test([function(){ return 'a' }], [[function() { return 'a'; }, function() { return 'b'; }]], [], 'functions are always unique');
    test([xFunc], [[]], [], 'functions with different content | [x] & []');
    test([yFunc], [[]], [], 'functions with different content | [y] & []');
    test([], [[xFunc]], [], 'functions with different content | [] & [x]');
    test([], [[yFunc]], [], 'functions with different content | [] & [y]');
    test([], [[xFunc, yFunc]], [], 'functions with different content | [] & [x,y]');
    test([xFunc], [[xFunc]], [xFunc], 'functions with different content | [x] & [x]');
    test([xFunc], [[yFunc]], [], 'functions with different content | [x] & [y]');
    test([xFunc], [[xFunc, yFunc]], [xFunc], 'functions with different content | [x] & [x,y]');
    test([xFunc, xFunc], [[xFunc, yFunc]], [xFunc], 'functions with different content | [x,x] & [x,y]');
    test([xFunc, xFunc], [[xFunc, xFunc]], [xFunc], 'functions with different content | [x,x] & [x,x]');
    test([xFunc, yFunc], [[xFunc, yFunc]], [xFunc,yFunc], 'functions with different content | [x,y] & [x,y]');
    test([xFunc, yFunc], [[yFunc, xFunc]], [xFunc,yFunc], 'functions with different content | [x,y] & [y,x]');
    test([xFunc, yFunc], [[yFunc, yFunc]], [yFunc], 'functions with different content | [x,y] & [y,y]');
    test([yFunc, xFunc], [[yFunc, xFunc]], [yFunc,xFunc], 'functions with different content | [y,x] & [y,x]');
    test([yFunc, xFunc], [[xFunc, yFunc]], [yFunc,xFunc], 'functions with different content | [y,x] & [x,y]');
    test([yFunc, xFunc], [[xFunc, xFunc]], [xFunc], 'functions with different content | [y,x] & [x,x]');
    test([xFunc, xFunc], [[yFunc, yFunc]], [], 'functions with different content | [x,x] & [y,y]');
    test([yFunc, yFunc], [[xFunc, xFunc]], [], 'functions with different content | [y,y] & [x,x]');
  });

  method('subtract', function() {

    var yFunc = function () { return 'y'; }
    var xFunc = function () { return 'x'; }

    test([xFunc], [[]], [xFunc], 'functions with different content | [x] - []');
    test([yFunc], [[]], [yFunc], 'functions with different content | [y] - []');
    test([], [[xFunc]], [], 'functions with different content | [] - [x]');
    test([], [[yFunc]], [], 'functions with different content | [] - [y]');
    test([], [[xFunc, yFunc]], [], 'functions with different content | [] - [x,y]');
    test([xFunc], [[xFunc]], [], 'functions with different content | [x] - [x]');
    test([xFunc], [[yFunc]], [xFunc], 'functions with different content | [x] - [y]');
    test([xFunc], [[xFunc, yFunc]], [], 'functions with different content | [x] - [x,y]');
    test([xFunc, xFunc], [[xFunc, yFunc]], [], 'functions with different content | [x,x] - [x,y]');
    test([xFunc, xFunc], [[xFunc, xFunc]], [], 'functions with different content | [x,x] - [x,x]');
    test([xFunc, yFunc], [[xFunc, yFunc]], [], 'functions with different content | [x,y] - [x,y]');
    test([xFunc, yFunc], [[yFunc, xFunc]], [], 'functions with different content | [x,y] - [y,x]');
    test([xFunc, yFunc], [[yFunc, yFunc]], [xFunc], 'functions with different content | [x,y] - [y,y]');
    test([yFunc, xFunc], [[yFunc, xFunc]], [], 'functions with different content | [y,x] - [y,x]');
    test([yFunc, xFunc], [[xFunc, yFunc]], [], 'functions with different content | [y,x] - [x,y]');
    test([yFunc, xFunc], [[xFunc, xFunc]], [yFunc], 'functions with different content | [y,x] - [x,x]');
    test([xFunc, xFunc], [[yFunc, yFunc]], [xFunc,xFunc], 'functions with different content | [x,x] - [y,y]');
    test([yFunc, yFunc], [[xFunc, xFunc]], [yFunc,yFunc], 'functions with different content | [y,y] - [x,x]');
  });


  method('intersect', function() {

    var xFunc = function() {};
    var yFunc = function() {};

    test([xFunc], [[]], [], 'functions with identical content | [x] & []');
    test([yFunc], [[]], [], 'functions with identical content | [y] & []');
    test([], [[xFunc]], [], 'functions with identical content | [] & [x]');
    test([], [[yFunc]], [], 'functions with identical content | [] & [y]');
    test([], [[xFunc, yFunc]], [], 'functions with identical content | [] & [x,y]');
    test([xFunc], [[xFunc]], [xFunc], 'functions with identical content | [x] & [x]');
    test([xFunc], [[yFunc]], [], 'functions with identical content | [x] & [y]');
    test([xFunc], [[xFunc, yFunc]], [xFunc], 'functions with identical content | [x] & [x,y]');
    test([xFunc, xFunc], [[xFunc, yFunc]], [xFunc], 'functions with identical content | [x,x] & [x,y]');
    test([xFunc, xFunc], [[xFunc, xFunc]], [xFunc], 'functions with identical content | [x,x] & [x,x]');
    test([xFunc, yFunc], [[xFunc, yFunc]], [xFunc,yFunc], 'functions with identical content | [x,y] & [x,y]');
    test([xFunc, yFunc], [[yFunc, xFunc]], [xFunc,yFunc], 'functions with identical content | [x,y] & [y,x]');
    test([xFunc, yFunc], [[yFunc, yFunc]], [yFunc], 'jrray#intersect | functions with identical content | [x,y] & [y,y]');
    test([yFunc, xFunc], [[yFunc, xFunc]], [yFunc,xFunc], 'functions with identical content | [y,x] & [y,x]');
    test([yFunc, xFunc], [[xFunc, yFunc]], [yFunc,xFunc], 'functions with identical content | [y,x] & [x,y]');
    test([yFunc, xFunc], [[xFunc, xFunc]], [xFunc], 'functions with identical content | [y,x] & [x,x]');
    test([xFunc, xFunc], [[yFunc, yFunc]], [], 'functions with identical content | [x,x] & [y,y]');
    test([yFunc, yFunc], [[xFunc, xFunc]], [], 'functions with identical content | [y,y] & [x,x]');

  });

  method('subtract', function() {

    var xFunc = function() {};
    var yFunc = function() {};

    test([xFunc], [[]], [xFunc], 'functions with identical content | [x] - []');
    test([yFunc], [[]], [yFunc], 'functions with identical content | [y] - []');
    test([], [[xFunc]], [], 'functions with identical content | [] - [x]');
    test([], [[yFunc]], [], 'functions with identical content | [] - [y]');
    test([], [[xFunc, yFunc]], [], 'functions with identical content | [] - [x,y]');
    test([xFunc], [[xFunc]], [], 'functions with identical content | [x] - [x]');
    test([xFunc], [[yFunc]], [xFunc], 'functions with identical content | [x] - [y]');
    test([xFunc], [[xFunc, yFunc]], [], 'functions with identical content | [x] - [x,y]');
    test([xFunc, xFunc], [[xFunc, yFunc]], [], 'functions with identical content | [x,x] - [x,y]');
    test([xFunc, xFunc], [[xFunc, xFunc]], [], 'functions with identical content | [x,x] - [x,x]');
    test([xFunc, yFunc], [[xFunc, yFunc]], [], 'functions with identical content | [x,y] - [x,y]');
    test([xFunc, yFunc], [[yFunc, xFunc]], [], 'functions with identical content | [x,y] - [y,x]');
    test([xFunc, yFunc], [[yFunc, yFunc]], [xFunc], 'functions with identical content | [x,y] - [y,y]');
    test([yFunc, xFunc], [[yFunc, xFunc]], [], 'functions with identical content | [y,x] - [y,x]');
    test([yFunc, xFunc], [[xFunc, yFunc]], [], 'functions with identical content | [y,x] - [x,y]');
    test([yFunc, xFunc], [[xFunc, xFunc]], [yFunc], 'functions with identical content | [y,x] - [x,x]');
    test([xFunc, xFunc], [[yFunc, yFunc]], [xFunc,xFunc], 'functions with identical content | [x,x] - [y,y]');
    test([yFunc, yFunc], [[xFunc, xFunc]], [yFunc,yFunc], 'functions with identical content | [y,y] - [x,x]');

    equal(run([function(){ return 'a' }, function() { return 'b'; }], 'subtract', [[function() { return 'a'; }]]).length, 2, 'functions are always unique');
    test([xFunc, yFunc], [[xFunc]], [yFunc], 'function references are ===');
  });


  method('union', function() {
    // Comprehensive unit tests for new uniquing method.

    var aFunc = function(){
      return 'a';
    }
    var bFunc = function(){
      return 'b';
    }
    var cFunc = function(){
      return 'c';
    }
    var dFunc = function(){
      return 'd';
    }

    setIsEqual(run([1,2,3], 'union', [[3,4,5]]), [1,2,3,4,5], 'basic');
    setIsEqual(run([1,2,3], 'union', [['1','2','3']]), [1,2,3,'1','2','3'], 'Numbers vs. Strings');
    setIsEqual(run([[1,2,3]], 'union', [[['1','2','3']]]), [[1,2,3],['1','2','3']], 'Numbers vs. Strings nested');

    setIsEqual(run([1,2,3], 'union', [[1,2,3]]), [1,2,3], 'Number array');
    setIsEqual(run([[1,2,3]], 'union', [[[1,2,3]]]), [[1,2,3]], 'Nested number array');
    setIsEqual(run([[1,2,3]], 'union', [[[3,2,1]]]), [[1,2,3],[3,2,1]], 'Nested and reversed');

    setIsEqual(run([aFunc], 'union', [[bFunc]]), [aFunc, bFunc], 'Function references');
    setIsEqual(run([aFunc], 'union', [[bFunc, cFunc]]), [aFunc, bFunc, cFunc], 'Function references');
    setIsEqual(run([aFunc, bFunc], 'union', [[bFunc, cFunc]]), [aFunc, bFunc, cFunc], 'Function references');
    setIsEqual(run([aFunc, bFunc, cFunc], 'union', [[aFunc, bFunc, cFunc]]), [aFunc, bFunc, cFunc], 'Function references');
    setIsEqual(run([cFunc, cFunc], 'union', [[cFunc, cFunc]]), [cFunc], 'Function references');
    setIsEqual(run([], 'union', [[aFunc]]), [aFunc], 'Function references');
    // PICK UP HERE

    equal(run([function() { return 'a'; }], 'union', [[function() { return 'a'; }]]).length, 2, 'Functions are never equivalent');


    setIsEqual(run([/bar/], 'union', [[/bas/]]), [/bar/,/bas/], 'Regexes');
    setIsEqual(run([[/bar/]], 'union', [[[/bas/,/bap/]]]), [[/bar/],[/bas/,/bap/]], 'Nested Regexes');
    setIsEqual(run([{ reg: /bar/ }], 'union', [[{ reg: /bar/ }, { reg: /map/ }]]), [{ reg: /bar/ }, { reg: /map/ }], 'Object Regexes');

    setIsEqual(run([true], 'union', [[false]]), [true,false], 'Booleans');
    setIsEqual(run([true], 'union', [[true]]), [true], 'Same Booleans');
    setIsEqual(run([[true]], 'union', [[[true, false]]]), [[true],[true, false]], 'Nested Booleans');
    setIsEqual(run([{ b: false }], 'union', [[{ b: false }, { b: true }]]), [{ b: false }, { b: true }], 'Object Booleans');


    setIsEqual(run([{},{}], 'union', [[{},{}]]), [{}], 'empty object array');
    setIsEqual(run([[{}]], 'union', [[[{},{}]]]), [[{}],[{},{}]], 'nested empty object array');
    setIsEqual(run([[{},{}]], 'union', [[[{},{}]]]), [[{},{}]], 'nested double object array');

    setIsEqual(run([{0:1}], 'union', [[[1]]]), [{0:1},[1]], 'object posing as array');
    setIsEqual(run([{}], 'union', [[[]]]), [{},[]], 'empty object vs. empty array');

    setIsEqual(run([[[],1]], 'union', [[[[1]]]]), [[[],1], [[1]]], 'empty array, 1 vs. empty array WITH one');

    var aObj = {
      text: 'foo',
      arr:  ['a','b','c'],
      reg: /moofa/,
      arr: [{foo:'bar'},{moo:'car'}],
      date: new Date(2001, 5, 15)
    }

    var bObj = {
      text: 'foo',
      arr:  ['a','b','c'],
      reg: /moofa/,
      arr: [{foo:'bar'},{moo:'car'}],
      date: new Date(2001, 5, 15)
    }

    var cObj = {
      text: 'foo',
      arr:  ['a','b','c'],
      reg: /moofo/,
      arr: [{foo:'bar'},{moo:'car'}],
      date: new Date(2001, 5, 15)
    }

    var dObj = {
      text: 'foo',
      arr:  ['a','b','c'],
      reg: /moofa/,
      arr: [{foo:'bar'},{moo:'car'}],
      date: new Date(2001, 8, 15)
    }

    var eObj = {
      text: 'foo',
      arr:  ['a','b','c'],
      reg: /moofa/,
      arr: [{foo:'bar'},{moo:'par'}],
      date: new Date(2001, 8, 15)
    }


    setIsEqual(run([aObj], 'union', [[aObj]]), [aObj], 'Nested objects a + a');
    setIsEqual(run([aObj], 'union', [[bObj]]), [aObj], 'Nested objects a + b');
    setIsEqual(run([aObj,bObj,cObj], 'union', [[]]), [aObj, cObj], 'Nested objects a,b,c + []');
    setIsEqual(run([], 'union', [[aObj,bObj,cObj]]), [aObj, cObj], 'Nested objects [] + a,b,c');
    setIsEqual(run([aObj,bObj], 'union', [[cObj]]), [aObj, cObj], 'Nested objects a,b + c');
    setIsEqual(run([cObj, cObj], 'union', [[cObj, cObj]]), [cObj], 'Nested objects c,c + c,c');
    setIsEqual(run([aObj, bObj, cObj, dObj], 'union', [[]]), [aObj, cObj, dObj], 'Nested objects a,b,c,d + []');
    setIsEqual(run([], 'union', [[aObj, bObj, cObj, dObj]]), [aObj, cObj, dObj], 'Nested objects a,b,c,d + a,c,d');
    setIsEqual(run([aObj, bObj], 'union', [[cObj, dObj]]), [aObj, cObj, dObj], 'Nested objects a,b + c,d');

    setIsEqual(run([aObj, bObj, cObj, dObj, eObj], 'union', [[aObj, bObj, cObj, dObj, eObj]]), [aObj, cObj, dObj, eObj], 'Nested objects a,b,c,d,e + a,b,c,d,e');

    var aFuncObj = {
      text: 'foo',
      func: function() { return 'a'; },
      arr:  ['a','b','c'],
      reg: /moofa/,
      date: new Date(2001, 5, 15)
    }

    var bFuncObj = {
      text: 'foo',
      func: function() { return 'a'; },
      arr:  ['a','b','c'],
      reg: /moofa/,
      date: new Date(2001, 5, 15)
    }

    var cFuncObj = {
      text: 'foo',
      func: function() { return 'c'; },
      arr:  ['a','b','c'],
      reg: /moofa/,
      date: new Date(2001, 5, 15)
    }


    setIsEqual(run([aFuncObj], 'union', [[aFuncObj]]), [aFuncObj], 'Nested objects with functions');
    setIsEqual(run([aFuncObj], 'union', [[bFuncObj]]), [aFuncObj], 'Nested objects with functions');
    setIsEqual(run([aFuncObj,bFuncObj,cFuncObj], 'union', [[]]), [aFuncObj, cFuncObj], 'Nested objects with functions');
    setIsEqual(run([aFuncObj,bFuncObj], 'union', [[cFuncObj]]), [aFuncObj, cFuncObj], 'Nested objects with functions');
    setIsEqual(run([cFuncObj, cFuncObj], 'union', [[cFuncObj, cFuncObj]]), [cFuncObj], 'Nested objects with functions meh');

    setIsEqual(run([NaN,NaN], 'union', [[NaN,NaN]]), [NaN], 'NaN');
    setIsEqual(run([null,null], 'union', [[null,null]]), [null], 'Null');
    setIsEqual(run([undefined], 'union', [[undefined]]), sparseArraySupport ? [undefined] : [], 'undefined');


    var aObj = {
      one:    1,
      two:    2,
      three:  3
    }

    var bObj = {
      three:  3,
      two:    2,
      one:    1
    }

    equal(run([aObj], 'union', [[bObj]]).length, 1, 'Properties may not be in the same order.');


    xFunc = function (){ return 'x'; }
    yFunc = function (){ return 'y'; }

    setIsEqual(run([xFunc], 'union', [[]]), [xFunc], 'functions with different content | [x] + []');
    setIsEqual(run([yFunc], 'union', [[]]), [yFunc], 'functions with different content | [y] + []');
    setIsEqual(run([], 'union', [[xFunc]]), [xFunc], 'functions with different content | [] + [x]');
    setIsEqual(run([], 'union', [[yFunc]]), [yFunc], 'functions with different content | [] + [y]');
    setIsEqual(run([], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with different content | [] + [x,y]');
    setIsEqual(run([xFunc], 'union', [[xFunc]]), [xFunc], 'functions with different content | [x] + [x]');
    setIsEqual(run([xFunc], 'union', [[yFunc]]), [xFunc,yFunc], 'functions with different content | [x] + [y]');
    setIsEqual(run([xFunc], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with different content | [x] + [x,y]');
    setIsEqual(run([xFunc, xFunc], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with different content | [x,x] + [x,y]');
    setIsEqual(run([xFunc, xFunc], 'union', [[xFunc, xFunc]]), [xFunc], 'functions with different content | [x,x] + [x,x]');
    setIsEqual(run([xFunc, yFunc], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with different content | [x,y] + [x,y]');
    setIsEqual(run([xFunc, yFunc], 'union', [[yFunc, xFunc]]), [xFunc,yFunc], 'functions with different content | [x,y] + [y,x]');
    setIsEqual(run([xFunc, yFunc], 'union', [[yFunc, yFunc]]), [xFunc,yFunc], 'functions with different content | [x,y] + [y,y]');
    setIsEqual(run([yFunc, xFunc], 'union', [[yFunc, xFunc]]), [yFunc,xFunc], 'functions with different content | [y,x] + [y,x]');
    setIsEqual(run([yFunc, xFunc], 'union', [[xFunc, yFunc]]), [yFunc,xFunc], 'functions with different content | [y,x] + [x,y]');
    setIsEqual(run([yFunc, xFunc], 'union', [[xFunc, xFunc]]), [yFunc,xFunc], 'functions with different content | [y,x] + [x,x]');
    setIsEqual(run([xFunc, xFunc], 'union', [[yFunc, yFunc]]), [xFunc,yFunc], 'functions with different content | [x,x] + [y,y]');
    setIsEqual(run([yFunc, yFunc], 'union', [[xFunc, xFunc]]), [yFunc,xFunc], 'functions with different content | [y,y] + [x,x]');


    xFunc = function (){}
    yFunc = function (){}

    setIsEqual(run([xFunc], 'union', [[]]), [xFunc], 'functions with identical content | [x] + []');
    setIsEqual(run([yFunc], 'union', [[]]), [yFunc], 'functions with identical content | [y] + []');
    setIsEqual(run([], 'union', [[xFunc]]), [xFunc], 'functions with identical content | [] + [x]');
    setIsEqual(run([], 'union', [[yFunc]]), [yFunc], 'functions with identical content | [] + [y]');
    setIsEqual(run([], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with identical content | [] + [x,y]');
    setIsEqual(run([xFunc], 'union', [[xFunc]]), [xFunc], 'functions with identical content | [x] + [x]');
    setIsEqual(run([xFunc], 'union', [[yFunc]]), [xFunc,yFunc], 'functions with identical content | [x] + [y]');
    setIsEqual(run([xFunc], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with identical content | [x] + [x,y]');
    setIsEqual(run([xFunc, xFunc], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with identical content | [x,x] + [x,y]');
    setIsEqual(run([xFunc, xFunc], 'union', [[xFunc, xFunc]]), [xFunc], 'functions with identical content | [x,x] + [x,x]');
    setIsEqual(run([xFunc, yFunc], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with identical content | [x,y] + [x,y]');
    setIsEqual(run([xFunc, yFunc], 'union', [[yFunc, xFunc]]), [xFunc,yFunc], 'functions with identical content | [x,y] + [y,x]');
    setIsEqual(run([xFunc, yFunc], 'union', [[yFunc, yFunc]]), [xFunc,yFunc], 'functions with identical content | [x,y] + [y,y]');
    setIsEqual(run([yFunc, xFunc], 'union', [[yFunc, xFunc]]), [yFunc,xFunc], 'functions with identical content | [y,x] + [y,x]');
    setIsEqual(run([yFunc, xFunc], 'union', [[xFunc, yFunc]]), [yFunc,xFunc], 'functions with identical content | [y,x] + [x,y]');
    setIsEqual(run([yFunc, xFunc], 'union', [[xFunc, xFunc]]), [yFunc,xFunc], 'functions with identical content | [y,x] + [x,x]');
    setIsEqual(run([xFunc, xFunc], 'union', [[yFunc, yFunc]]), [xFunc,yFunc], 'functions with identical content | [x,x] + [y,y]');
    setIsEqual(run([yFunc, yFunc], 'union', [[xFunc, xFunc]]), [yFunc,xFunc], 'functions with identical content | [y,y] + [x,x]');

  });


  method('findAll', function() {
    // Issue #157 Ensure that instances can be subject to fuzzy matches despite not being "objects"

    function Foo(a) {
      this.a = a;
    }

    var one   = new Foo('one');
    var two   = new Foo('two');
    var three = new Foo('three');
    var four  = new Foo(new Date(2001, 3, 15));

    test([one, two, three, four], [{ a: 'one' }], [one], 'matches class instances | object with string');
    test([one, two, three, four], [{ a: /^t/ }], [two, three], 'matches class instances | object with regex');
    test([one, two, three, four], ['one'], [], 'matches class instances | string');
    test([one, two, three, four], [/t/], [one, two, three, four], 'directly passing a regex is matching the objects stringified');
    test([one, two, three, four], [/x/], [], 'directly passing a regex with no matching letter');
    test([one, two, three, four], [true], [], 'matches class instances | boolean');
    test([one, two, three, four], [new Date()], [], 'matches class instances | now');
    test([one, two, three, four], [new Date(2001, 3, 15)], [], 'matches class instances | correct date');
    test([one, two, three, four], [null], [], 'matches class instances | null');
    test([one, two, three, four], [undefined], [], 'matches class instances | undefined');
    test([one, two, three, four], [{ a: 'twof' }], [], 'matches class instances | nonexistent string');
    test([one, two, three, four], [{ b: 'one' }], [], 'matches class instances | nonexistent property');
    test([one, two, three, four], [{}], [one, two, three, four], 'matches class instances | empty object');
    test([one, two, three, four], [{ a: new Date(2001, 3, 15) }], [four], 'matches class instances | object with correct date');
    test([one, two, three, four], [{ b: new Date(2001, 3, 15) }], [], 'matches class instances | object with correct date but wrong property');
    test([one, two, three, four], [{ a: new Date(2001, 3, 16) }], [], 'matches class instances | object with incorrect date');
    test([one, two, three, four], [{ a: new Date(2001, 3, 15, 0, 0, 0, 1) }], [], 'matches class instances | object with date off by 1ms');

    var date = new Date(2001, 3, 15);
    var timestamp = date.getTime();
    var obj = { a: { getTime: function () { return timestamp; } }};
    test([obj], [{ a: date }], [obj], 'duck typing for date matching');

    var five = new Foo(one);

    test([five], [{ a: 'one' }], [], 'nested instances | object with string');
    test([five], [{ a: { a: 'one' } }], [five], 'nested instances | object with double nested string');
    test([five], [{ a: { a: 'two' } }], [], 'nested instances | object with double nested string but incorrect');

  });


  method('findAll', function() {
    // Fuzzy matching behavior on functions.

    var count = 0;
    var fn = function(){ count ++; };

    run([1,2,3], 'findAll', [fn]);
    equal(count, 3, 'functions treated as callbacks when matching against non-functions');

    count = 0;
    run([function() {}, function() {}, function() {}], 'findAll', [fn]);
    equal(count, 3, 'functions are not directly matched');


    var fn1 = function() {};
    var fn2 = function() {};

    if(Sugar.Object && Sugar.Object.equal) {
      equal(run([fn1, fn1, fn1], 'all', [function(el) { return Sugar.Object.equal(el, fn1); }]), true, 'functions can be matched inside the callback');
      equal(run([fn1, fn1, fn2], 'all', [function(el) { return Sugar.Object.equal(el, fn1); }]), false, 'functions can be matched inside the callback');
      equal(run([fn1, fn1, fn2], 'any', [function(el) { return Sugar.Object.equal(el, fn1); }]), true, 'functions can be matched inside the callback');
      equal(run([fn1, fn2, fn1], 'findAll', [function(el) { return Sugar.Object.equal(el, fn1); }]), [fn1, fn1], 'functions can be matched inside the callback');
      equal(run([fn1, fn2, fn1], 'findAll', [function(el) { return Sugar.Object.equal(el, fn2); }]), [fn2], 'fn2 | functions can be matched inside the callback');
    }

  });

  method('sortBy', function() {

    // Issue #273 - exposing collateString

    var arr = ['c','b','a','à','å','ä','ö'];

    var viaSort   = arr.sort(Sugar.Array.AlphanumericSort);
    var viaSortBy = run(arr, 'sortBy');

    equal(viaSort, viaSortBy, 'Array.SugarCollateStrings | should be exposed to allow sorting via native Array#sort');

  });

  method('findFrom', function() {
    test(['foo','bar'], [/^[a-f]/, 1], 'bar', '/a-f/ from index 1');
    test(['foo','bar','zak'], [/^[a-f]/, 2, true], 'foo', '/a-f/ from index 1 looping');

    test([1,2,3], [function(e) { return e > 0; }, 0], 1, 'greater than 0 from index 0');
    test([1,2,3], [function(e) { return e > 0; }, 1], 2, 'greater than 0 from index 1');
    test([1,2,3], [function(e) { return e > 0; }, 2], 3, 'greater than 0 from index 2');
    test([1,2,3], [function(e) { return e > 0; }, 3], undefined, 'greater than 0 from index 3');
    test([1,2,3], [function(e) { return e > 1; }, 0], 2, 'greater than 1 from index 0');
    test([1,2,3], [function(e) { return e > 1; }, 1], 2, 'greater than 1 from index 1');
    test([1,2,3], [function(e) { return e > 1; }, 2], 3, 'greater than 1 from index 2');
    test([1,2,3], [function(e) { return e > 2; }, 0], 3, 'greater than 2 from index 0');
    test([1,2,3], [function(e) { return e > 3; }, 0], undefined, 'greater than 3 from index 0');

    test([1,2,3], [function(e) { return e > 0; }, 0, true], 1, 'loop | greater than 0 from index 0');
    test([1,2,3], [function(e) { return e > 0; }, 1, true], 2, 'loop | greater than 0 from index 1');
    test([1,2,3], [function(e) { return e > 0; }, 2, true], 3, 'loop | greater than 0 from index 2');
    test([1,2,3], [function(e) { return e > 0; }, 3, true], 1, 'loop | greater than 0 from index 3');
    test([1,2,3], [function(e) { return e > 1; }, 0, true], 2, 'loop | greater than 1 from index 0');
    test([1,2,3], [function(e) { return e > 1; }, 1, true], 2, 'loop | greater than 1 from index 1');
    test([1,2,3], [function(e) { return e > 1; }, 2, true], 3, 'loop | greater than 1 from index 2');
    test([1,2,3], [function(e) { return e > 2; }, 0, true], 3, 'loop | greater than 2 from index 0');
    test([1,2,3], [function(e) { return e > 3; }, 0, true], undefined, 'loop | greater than 3 from index 0');

    test([{a:10},{a:8},{a:3}], [function(e) { return e['a'] > 5; }, 0], {a:10}, 'key "a" greater than 5');
    test([{a:10},{a:8},{a:3}], [function(e) { return e['a'] > 5; }, 1], {a:8}, 'key "a" greater than 5 from index 1');
    test([{a:10},{a:8},{a:3}], [function(e) { return e['a'] > 5; }, 2], undefined, 'key "a" greater than 5 from index 2');
    test([function() {}], [function(e) {}, 1], undefined, 'null function from index 1');
    test([null, null], [null, 1], null, 'null from index 1');
    test([undefined, undefined], [undefined, 1], undefined, 'undefined from index 1');

  });

  method('findIndexFrom', function() {
    test(['a','b','c','b'], ['b', 2], 3, 'finds first instance from index');
    test([5,2,4,4], [4, 3], 3, '4 in 5,2,4,4 from index 3');
    test([5,2,4,4], [4, 10], -1, '4 in 5,2,4,4 from index 10');
    test([5,2,4,4], [4, -10], 2, '4 in 5,2,4,4 from index -10');
    test([5,2,4,4], [4, -1], 3, '4 in 5,2,4,4 from index -1');

    test(['a','b','c','b'], ['b', 1, true], 1, 'finds first instance from index');
    test([5,2,4,4,7,0], [4, 4, true], 2, '4 in 5,2,4,4 from index 3');
    test([5,2,4,4,7,0], [4, 10, true], 2, '4 in 5,2,4,4 from index 10');
    test([5,2,4,4,7,0], [8, 10, true], -1, '8 in 5,2,4,4 from index 10');
    test([5,2,4,4,7,0], [4, -10, true], 2, '4 in 5,2,4,4 from index -10');
    test([5,2,4,4,7,0], [4, -1, true], 2, '4 in 5,2,4,4 from index -1');
  });

});

