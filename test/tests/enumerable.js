namespace('Array', function() {
  'use strict';

  method('map', function() {

    var fn;
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
    test([{name:'john',age:25},{name:'fred',age:85}], ['cupsize'], twoUndefined, '(nonexistent) cupsize');
    test([], ['name'], [], 'empty array');


    // Nested properties with dot syntax

    test([{name:{first:'John',last:'Waters'}},{name:{first:'Fred',last:'Flintstone'}}], ['name.first'], ['John', 'Fred'], 'deep matching with dot');
    test([{a:{b:{c:'x'}}},{a:{b:{c:'y'}}},{a:{b:{c:'z'}}}], ['a.b.c'], ['x','y','z'], 'deeper matching with dot');
    test([{a:[1]},{a:[2]}], ['a.0'], [1,2], 'matching nested array indexes');
    test([{a:[1]},{b:[2]}], ['a.0'], safeArray(1, undefined), 'matching nested array index non-existent');
    test([{a:'a'},{b:'a'}], ['.'], twoUndefined, 'single dot');
    test([{a:'a'},{b:'a'}], ['..'], twoUndefined, 'double dot');
    test([[[1,2]],[[1,2]]], ['0.1'], [2,2], 'deep arrays');
    test([{name:{first:'Joe',last:'P'}},{name:{first:'John',last:'Q'}}], [['name.first', 'name.last']], [['Joe','P'], ['John', 'Q']], 'array with dots');

    test([1,2,3], ['toString'], ['1','2','3'], 'calls a function on a shortcut string');

    raisesError(function(){ run([1,2,3], 'map') }, 'no argument raises a type error');
    raisesError(function(){ run([1,2,3], 'map', oneUndefined) }, 'undefined raises a type error');
    raisesError(function(){ run([1,2,3], 'map', [null]) }, 'null raises a type error');

    test([1,2,3], [4], threeUndefined, 'number');


    // Nested properties with dot and bracket syntax

    var accounts = [
      {
        profile: {
          addresses: [{
              street: '1600 Pennsylvania Ave',
              city: 'Washington DC'
            }, {
              street: '221B Baker St',
              city: 'London'
            }, {
              street: '350 5th Ave',
              city: 'New York'
            }]
        }
      },
      {
        profile: {
          addresses: [{
              street: '31 Spooner St.',
              city: 'Quahog'
            }, {
              street: '742 Evergreen Terrace',
              city: 'Springfield'
            }, {
              street: '342 Gravelpit Terrace',
              city: 'Bedrock'
            }]
        }
      }
    ];

    test(accounts, ['profile.addresses[0]'], [accounts[0].profile.addresses[0], accounts[1].profile.addresses[0]], 'deep with bracket');
    test(accounts, ['profile.addresses[0].city'], ['Washington DC', 'Quahog'], 'deep with bracket and trailing dot');
    test(accounts, ['profile.addresses[1]'], [accounts[0].profile.addresses[1], accounts[1].profile.addresses[1]], 'deep with bracket | 1');
    test(accounts, ['profile.addresses[1].city'], ['London', 'Springfield'], 'deep with bracket and trailing dot | 1');
    test(accounts, ['profile.addresses[-1]'], [accounts[0].profile.addresses[2], accounts[1].profile.addresses[2]], 'deep with bracket | -1');
    test(accounts, ['profile.addresses[-1].city'], ['New York', 'Bedrock'], 'deep with bracket and trailing dot | -1');


    // Bracket range syntax

    var a1 = accounts[0].profile.addresses.slice(0, 2);
    var a2 = accounts[1].profile.addresses.slice(0, 2);
    test(accounts, ['profile.addresses[0..1]'], [a1, a2], 'allows range syntax');
    test(accounts, ['profile.addresses[0..1].city'], [['Washington DC', 'London'], ['Quahog', 'Springfield']], 'allows range syntax with trailing dot');

    raisesError(function() { run([{foo:'bar'}], 'map', 'foo[0..1]'); }, 'Range syntax on an object should raise an error', TypeError);

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
    test(arr, [['name', 'hair']], [safeArray('john', undefined), safeArray('fred', undefined)], 'mapping on name and non-existent property');
    test(arr, [['hair', 'age']], [safeArray(undefined, 25), safeArray(undefined, 85)], 'mapping on non-existent property and name');
    test(arr, [['hair', 'eyes']], [twoUndefined, twoUndefined], 'mapping on two non-existent properties');

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

    // Testing the context

    var resultContext = null;
    var fn = function() {
      resultContext = this;
    }
    run(['x'], 'map', [fn]);
    equal(resultContext, testNullScope, 'Context should be passable with explicit mapping fn');

    var resultContext = null;
    var fakeContext = {};
    var fn = function() {
      resultContext = this;
    }
    run(['x'], 'map', [fn, fakeContext]);
    equal(resultContext, fakeContext, 'Context should be passable with explicit mapping fn');

    // Issue #525
    var result = [{foo:'foo'},{bar:'bar'}].map(Object.keys);
    equal(result, [['foo'],['bar']], 'non-function argument should not be called');

  });

  method('every', function() {
    var fn, arr;

    raisesError(function() { run([1,2,3], 'every', []); }, 'should error with no args');

    test([1,1,1], [1], true, 'numeric | 1 matches');
    test([1,1,2], [1], false, 'numeric | 1 does not match');
    test([1,2,3], [3], false, 'numeric | 3 does not match');
    test(['a','a','a'], ['a'], true, 'accepts a string shortcut match');
    test(['a','b','a'], ['a'], false, 'accepts a string shortcut no match');
    test(['a','b','c'], [/[a-f]/], true, 'accepts a regex shortcut match');
    test(['a','b','c'], [/[m-z]/], false, 'accepts a regex shortcut no match');
    test([{a:1},{a:1}], [{a:1}], true, 'checks objects match');
    test([{a:1},{a:2}], [{a:1}], false, 'checks object no match');
    test(['a','b','c'], [function(e) { return e.length > 1; }], false, 'alphabet | length is greater than 1');
    test(['a','b','c'], [function(e) { return e.length < 2; }], true, 'alphabet | length is less than 2');
    test(['a','bar','cat'], [function(e) { return e.length < 2; }], false, 'a,bar,cat | length is less than 2');
    test([{a:1},{a:2},{a:1}], [function(e) { return e['a'] == 1; }], false, 'objects | key "a" is 1');
    test([{a:1},{a:2},{a:1}], [function(e) { return e['b'] == 1; }], false, 'objects | key "b" is 1');
    test([{a:1},{a:1},{a:1}], [function(e) { return e['a'] == 1; }], true, 'objects | key "a" is 1 for all');

    fn = function(el) {
      return el >= 10;
    }

    test([12,5,8,130,44], [fn], false, 'not every element is greater than 10');
    test([12,54,18,130,44], [fn], true, 'every element is greater than 10');

    test(threeUndefined, [undefined], true, 'all undefined');
    test(['a', 'b'], [undefined], false, 'none undefined');

    arr = testClone(threeUndefined);
    arr.push('a');

    test(arr, [oneUndefined], false, 'every undefined');

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

  method('some', function() {
    var arr, fn;

    test([1,2,3], [1], true, 'accepts a number shortcut match');
    test([2,3,4], [1], false, 'accepts a number shortcut no match');
    test(['a','b','c'], ['a'], true, 'accepts a string shortcut match');
    test(['b','c','d'], ['a'], false, 'accepts a string shortcut no match');
    test(['a','b','c'], [/[a-f]/], true, 'accepts a regex shortcut match');
    test(['a','b','c'], [/[m-z]/], false, 'accepts a regex shortcut no match');
    test([{a:1},{a:2}], [{a:1}], true, 'checks objects match');
    test([{a:2},{a:3}], [{a:1}], false, 'checks object no match');
    test([0], [0], true, '[0] | 0');

    test([12,5,8,130,44], [function(el, i, a) { return el > 10 }], true, 'some elements are greater than 10');
    test([12,5,8,130,44], [function(el, i, a) { return el < 10 }], true, 'some elements are less than 10');
    test([12,54,18,130,44], [function(el, i, a) { return el >= 10 }], true, 'all elements are greater than 10');
    test([12,5,8,130,44], [function(el, i, a) { return el < 4 }], false, 'no elements are less than 4');
    test([], [function(el, i, a) { return el > 10 }], false, 'no elements are greater than 10 in an empty array');

    test(threeUndefined, oneUndefined, true, 'all undefined');
    test(['a', 'b'], oneUndefined, false, 'none undefined');

    arr = testClone(threeUndefined);
    arr.push('a');

    test(arr, oneUndefined, true, 'some undefined');

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
    test(['a','a','c'], ['a'], ['a','a'], 'a,a');
    test(['a','b','c'], ['q'], [], 'q');
    test([2,2,3], [2], [2,2], '2,2');
    test([1,2,3], [4], [], '4');

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

    raisesError(function() { run([1,2,3], 'filter'); }, 'no argument raises a type error');

    test(threeUndefined, oneUndefined, threeUndefined, 'undefined should match all undefined');
    test(threeUndefined, [null], [], 'null should not match all undefined');
    test(undefinedWithNull, oneUndefined, oneUndefined, 'undefined should match one undefined');
    test(undefinedWithNull, [null], [null], 'null should match one null');
    test([null, null], [null], [null, null], 'null should match all null');
    test([null, null], oneUndefined, [], 'undefined should not match all null');

    test([{a:1},{b:2},{c:3}], [{a:1}], [{a:1}], 'a:1');
    test([{a:1},{a:1},{c:3}], [{a:1}], [{a:1},{a:1}], 'a:1,a:1');
    test([{a:1},{b:2},{c:3}], [{d:4}], [], 'd:4');
    test([{a:1},{b:2},{c:3}], [{c:4}], [], 'c:4');
    test([[1,2],[2,3],[4,5]], [[2,3]], [[2,3]], '2,3');
    test([[1,2],[2,3],[4,5]], [[2,4]], [], '2,4');
    test([[1,2],[2,3],[2,3]], [[2,3]], [[2,3],[2,3]], '[2,3],[2,3]');
    test(['foo','bar'], [/f+/], ['foo'], '/f+/');
    test(['foo','bar'], [/[a-f]/], ['foo','bar'], '/[a-f]/');
    test(['foo','bar'], [ /q+/], [], '/q+/');

    test([{a:10},{a:8},{a:3}], [function(e) { return e['a'] > 5; }, 0], [{a:10},{a:8}], 'key "a" is greater than 5');
    test([{a:10},{a:8},{a:3}], [function(e) { return e['a'] > 5; }, 0, true], [{a:10},{a:8}], 'looping | key "a" is greater than 5');
    test([function() {}], [function(e) {}, 0], [], 'null function');
    test([null, null], [null, 0], [null, null], 'null');
    test([function() {}], [function(e) {}, 0, true], [], 'looping | null function');
    test([null, null], [null, 0, true], [null, null], 'looping | null');

    var fn = function() {
      return false;
    }

    test([fn], [fn], [], 'should not find functions by reference');

    var undefinedContextObj = (function(){ return this; }).call(undefined);
    var fn = function() {
      equal(this, undefinedContextObj, 'this context should be the array');
    }
    run([1], 'filter', [fn]);

    var people = [
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'ronnie', age: 13, hair: 'brown'  },
      { name: 'edmund', age: 27, hair: 'blonde' },
      { name: 'buddy',  age: 82, hair: { color: 'red', type: 'long', cost: 15, last_cut: new Date(2010, 4, 18) } }
    ];

    raisesError(function(){ run([], 'filter') }, 'no argument raises an error', TypeError);

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
    test([one, two, three, four], oneUndefined, [], 'matches class instances | undefined');
    test([one, two, three, four], [{ a: 'twof' }], [], 'matches class instances | nonexistent string');
    test([one, two, three, four], [{ b: 'one' }], [], 'matches class instances | nonexistent property');
    test([one, two, three, four], [{}], [one, two, three, four], 'matches class instances | empty object');
    test([one, two, three, four], [{ a: new Date(2001, 3, 15) }], [four], 'matches class instances | object with correct date');
    test([one, two, three, four], [{ b: new Date(2001, 3, 15) }], [], 'matches class instances | object with correct date but wrong property');
    test([one, two, three, four], [{ a: new Date(2001, 3, 16) }], [], 'matches class instances | object with incorrect date');
    test([one, two, three, four], [{ a: new Date(2001, 3, 15, 0, 0, 0, 1) }], [], 'matches class instances | object with date off by 1ms');

    var date = new Date(2001, 3, 15);
    var timestamp = date.getTime();
    var obj = { a: { getTime: function() { return timestamp; } }};
    test([obj], [{ a: date }], [obj], 'duck typing for date matching');

    var five = new Foo(one);

    test([five], [{ a: 'one' }], [], 'nested instances | object with string');
    test([five], [{ a: { a: 'one' } }], [five], 'nested instances | object with double nested string');
    test([five], [{ a: { a: 'two' } }], [], 'nested instances | object with double nested string but incorrect');


    // Fuzzy matching behavior on functions.

    var count = 0;
    var fn = function(){ count ++; };

    run([1,2,3], 'filter', [fn]);
    equal(count, 3, 'functions treated as callbacks when matching against non-functions');

    count = 0;
    run([function() {}, function() {}, function() {}], 'filter', [fn]);
    equal(count, 3, 'functions are not directly matched');


    var fn1 = function() {};
    var fn2 = function() {};
    var matchFn1 = function(el) {
      return el === fn1;
    }
    var matchFn2 = function(el) {
      return el === fn2;
    }

    equal(run([fn1, fn2, fn1], 'filter', [matchFn1]), [fn1, fn1], 'functions can be matched inside the callback');
    equal(run([fn1, fn2, fn1], 'filter', [matchFn2]), [fn2], 'fn2 | functions can be matched inside the callback');

  });

  method('find', function() {

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
    test(threeUndefined, safeArray(undefined, 0), undefined, 'undefined');
    test(safeArray(undefined, 'a'), safeArray(undefined, 1), undefined, 'undefined can be found');


    var count = 0;
    [1,2,3].find(function(n) {
      count++;
      return n == 1;
    });
    equal(count, 1, 'should immediately finish when it finds a match');

    var count = 0;
    run([1,2,3], 'find', [function(n) {
      count++;
      return n == 1;
    }]);
    equal(count, 1, 'should also be mapped to global');

    raisesError(function() { run([1,2,3], 'find'); }, 'no argument raises a type error');

  });

  method('findIndex', function() {

    raisesError(function() { run([1,2,3], 'findIndex'); }, 'no argument raises a type error');

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

    test(threeUndefined, oneUndefined, false, 'undefined should match all undefined');
    test(threeUndefined, [null], true, 'null should not match all undefined');
    test(undefinedWithNull, oneUndefined, false, 'undefined should match one undefined');
    test(undefinedWithNull, [null], false, 'null should match one null');
    test([null, null], [null], false, 'null should match all null');
    test([null, null], oneUndefined, true, 'undefined should not match all null');

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

  group('Fuzzy Matching', function() {
    var arr = [{name: 'joe', age: 25}];
    var match = { name: /j/ };

    equal(run(arr, 'every', [match]), true, 'every');
    equal(run(arr, 'some', [match]), true, 'some');
    equal(run(arr, 'none', [match]), false, 'none');
    equal(run(arr, 'count', [match]), 1, 'count');
    equal(run(arr, 'filter', [match]), [arr[0]], 'filter');
    equal(run(arr, 'find', [match]), arr[0], 'find');
    equal(run(arr, 'findIndex', [match]), 0, 'findIndex');

  });

  group('Array Inheritance', function() {
    var count;

    // Inherits from array...

    var Soup = function() {}, x;
    Soup.prototype = [1,2,3];

    x = new Soup();
    count = 0;

    run(x, 'forEachFromIndex', [0, function() {
      count++;
    }]);
    run(x, 'findFromIndex', [0, function() {
      count++;
    }]);
    run(x, 'filterFromIndex', [0, function() {
      count++;
    }]);

    equal(count, 9, 'array elements in the prototype chain are also properly iterated');


    // Inherits from sparse array...

    var arr = ['a'];
    arr[20] = 'b';

    Soup.prototype = arr;

    x = new Soup();
    count = 0;

    run(x, 'forEachFromIndex', [0, function() {
      count++;
    }]);

    equal(count, 2, 'sparse array elements in the prototype chain are also properly iterated');

    // This test cannot be framed in a meaninful way... IE will not set the length property
    // when pushing new elements and other browsers will not work on sparse arrays...
    // equal(count, 6, 'Array | objects that inherit from arrays can still iterate');

  });

  method('forEachFromIndex', function() {

    var xyz = ['x','y','z'];

    function assertForEachFromIndex(arr, args, expectedEls, expectedIdx) {
      var els = [], idx = [];

      var fn = function(el, i) {
        els.push(el);
        idx.push(i);
      }
      args.push(fn);
      run(arr, 'forEachFromIndex', args);
      equal(els, expectedEls, 'forEachFromIndex | els');
      equal(idx, expectedIdx, 'forEachFromIndex | idx');
    }

    // Return value
    equal(run(xyz, 'forEachFromIndex', [0, function(){}]), undefined, 'Should return the same as forEach');

    // Errors
    raisesError(function() { run(xyz, 'forEachFromIndex', []); }, 'error with no args', TypeError);
    raisesError(function() { run(xyz, 'forEachFromIndex', [4]); }, 'error with only start index', TypeError);

    // No looping, pos index
    assertForEachFromIndex(xyz, [0], ['x','y','z'], [0, 1, 2]);
    assertForEachFromIndex(xyz, [1], ['y','z'], [1, 2]);
    assertForEachFromIndex(xyz, [2], ['z'], [2]);
    assertForEachFromIndex(xyz, [3], [], []);

    // No looping, neg index
    assertForEachFromIndex(xyz, [-1], ['z'], [2]);
    assertForEachFromIndex(xyz, [-2], ['y','z'], [1, 2]);
    assertForEachFromIndex(xyz, [-3], ['x','y','z'], [0, 1, 2]);
    assertForEachFromIndex(xyz, [-4], ['x','y','z'], [0, 1, 2]);

    // No looping explicit, pos index
    assertForEachFromIndex(xyz, [0, false], ['x','y','z'], [0, 1, 2]);
    assertForEachFromIndex(xyz, [1, false], ['y','z'], [1, 2]);
    assertForEachFromIndex(xyz, [2, false], ['z'], [2]);
    assertForEachFromIndex(xyz, [3, false], [], []);

    // No looping explicit, neg index
    assertForEachFromIndex(xyz, [-1, false], ['z'], [2]);
    assertForEachFromIndex(xyz, [-2, false], ['y','z'], [1, 2]);
    assertForEachFromIndex(xyz, [-3, false], ['x','y','z'], [0, 1, 2]);
    assertForEachFromIndex(xyz, [-4, false], ['x','y','z'], [0, 1, 2]);

    // Looping, pos index
    assertForEachFromIndex(xyz, [0, true], ['x','y','z'], [0, 1, 2]);
    assertForEachFromIndex(xyz, [1, true], ['y','z','x'], [1, 2, 0]);
    assertForEachFromIndex(xyz, [2, true], ['z','x','y'], [2, 0, 1]);
    assertForEachFromIndex(xyz, [3, true], ['x','y','z'], [0, 1, 2]);
    assertForEachFromIndex(xyz, [4, true], ['x','y','z'], [0, 1, 2]);

    // Looping, neg index
    assertForEachFromIndex(xyz, [-1, true], ['z','x','y'], [2, 0, 1]);
    assertForEachFromIndex(xyz, [-2, true], ['y','z','x'], [1, 2, 0]);
    assertForEachFromIndex(xyz, [-3, true], ['x','y','z'], [0, 1, 2]);
    assertForEachFromIndex(xyz, [-4, true], ['x','y','z'], [0, 1, 2]);

    // Args
    assertFromIndexArgs(['x'], 'forEach', [0], ['x', 0]);
    assertFromIndexArgs(['x','y'], 'forEach', [1], ['y', 1]);

    // Passing context value
    var fn = function() { actualContext = this;}, actualContext, fakeContext = {};
    run([1], 'forEachFromIndex', [0, fn, fakeContext]);
    equal(actualContext, fakeContext, 'Context should be passable');

    // Moved from Array#each

    var arr = [2, 5, 9];
    var fn = function(el, i, a) {
      equal(el, arr[i], 'looping successfully');
    };
    run(arr, 'forEachFromIndex', [0, fn]);

    var arr = ['a', [1], { foo: 'bar' }, 352];
    var count = 0;
    var fn = function() {
        count++;
    };
    run(arr, 'forEachFromIndex', [0, fn]);
    equal(count, 4, 'complex array | should have looped 4 times');

    var fn = function(el, i, a) {
      equal(el, 'a', 'first parameter is the element');
      equal(i, 0, 'second parameter is the index');
      equal(a, ['a'], 'third parameter is the array');
      equal(this, 'this', 'scope is also the array');
    };
    run(['a'], 'forEachFromIndex', [0, fn, 'this']);

    var count = 0;

    run({'0':'a','length':'1'}, 'forEachFromIndex', [0, function() { count++; }]);

    equal(count, 1, 'looping over array-like objects with string lengths');

    var result = [];
    var count = 0;
    var fn = function(s, i) {
      result.push(s);
      equal(i, count + 1, 'index should be correct');
      count++;
    }
    run(['a','b','c'], 'forEachFromIndex', [1, fn]);
    equal(count, 2, 'should have run 2 times');
    equal(result, ['b','c'], 'result');

    var result = [];
    var indexes = [1,2,0];
    var count = 0;
    var fn = function(s, i) {
      result.push(s);
      equal(i, indexes[count], 'looping from index 1 | index should be correct');
      count++;
    }
    run(['a','b','c'], 'forEachFromIndex', [1, true, fn]);
    equal(count, 3, 'looping from index 1 | should have run 3 times')
    equal(result, ['b','c','a'], 'looping from index 1 | result');

    var result = [];
    var indexes = [0,1,2];
    var count = 0;
    var fn = function(s, i) {
      result.push(s);
      equal(i, indexes[count], 'looping from index 0 | index should be correct')
      count++;
    }
    run(['a','b','c'], 'forEachFromIndex', [0, true, fn]);
    equal(count, 3, 'looping from index 0 | should have run 3 times')
    equal(result, ['a','b','c'], 'looping from index 0 | result');

    var result = [];
    var indexes = [2,0,1];
    var count = 0;
    var fn = function(s, i) {
      result.push(s);
      equal(i, indexes[count], 'looping from index 2 | index should be correct');
      count++;
    }
    run(['a','b','c'], 'forEachFromIndex', [2, true, fn]);
    equal(count, 3, 'looping from index 2 | should have run 3 times')
    equal(result, ['c','a','b'], 'looping from index 2 | result');

    var result = [];
    var count = 0;
    var fn = function(s, i) {
      result.push(s);
      count++;
    }
    run(['a','b','c'], 'forEachFromIndex', [3, true, fn]);
    equal(count, 3, 'looping from index 3 | should have run 3 times')
    equal(result, ['a','b','c'], 'looping from index 3 | result');

    var result = [];
    var count = 0;
    var fn = function(s, i) {
      result.push(s);
      count++;
    }
    run(['a','b','c'], 'forEachFromIndex', [4, true, fn]);
    equal(count, 3, 'looping from index 4 | should have run 3 times')
    equal(result, ['a','b','c'], 'looping from index 4 | result');

    var result = [];
    var count = 0;
    var fn = function(s, i) {
      result.push(s);
      count++;
    }
    run(['a','b','c'], 'forEachFromIndex', [49, true, fn]);
    equal(count, 3, 'looping from index 49 | should have run 3 times')
    equal(result, ['a','b','c'], 'looping from index 49 | result');

    var result = [];
    var count = 0;
    var fn = function(s, i) {
      result.push(s);
      count++;
    }
    run(['a','b','c'], 'forEachFromIndex', [0, fn, 'hoofa']);
    equal(count, 3, 'string index should default to 0 | should have run 3 times')
    equal(result, ['a','b','c'], 'string index should default to 0 | result');

    // Sparse array handling

    var arr = ['a'];
    arr[Math.pow(2,32) - 2] = 'b';
    var expectedValues = ['a','b'];
    var expectedIndexes = [0, Math.pow(2,32) - 2];
    var count = 0;
    var fn = function(el, i, a) {
      equal(this, testNullScope, 'sparse | this object should be default');
      equal(el, expectedValues[count], 'sparse | first argument should be the current element');
      equal(i, expectedIndexes[count], 'sparse | second argument should be the current index');
      equal(a, arr, 'sparse | third argument should be the array');
      count++;
    }
    run(arr, 'forEachFromIndex', [0, fn]);
    equal(count, 2, 'sparse | count should match');

    var arr = [];
    arr[-2] = 'd';
    arr[2]  = 'f';
    arr[Math.pow(2, 32)] = 'c';
    var count = 0;
    var fn = function(el, i) {
      equal(el, 'f', 'sparse | values outside range are not iterated over | el');
      equal(i, 2, 'sparse | values outside range are not iterated over | index');
      count++;
    }
    run(arr, 'forEachFromIndex', [0, fn]);
    equal(count, 1, 'sparse | values outside range are not iterated over | count');

    var arr = [];
    arr[9] = 'd';
    arr[2] = 'f';
    arr[5] = 'c';
    var count = 0;
    var values = [];
    var indexes = [];
    var expectedValues = ['f','c','d'];
    var expectedIndexes = [2,5,9];
    fn = function(val, i) {
      values.push(val);
      indexes.push(i);
    }
    run(arr, 'forEachFromIndex', [0, fn]);
    equal(values, expectedValues, 'sparse | unordered should produce correct values');
    equal(indexes, expectedIndexes, 'sparse | unordered should produce correct indexes');

    var arr = [];
    arr[9] = 'd';
    arr[2] = 'f';
    arr[5] = 'c';
    var values = [];
    var indexes = [];
    var expectedValues = ['d','f','c'];
    var expectedIndexes = [9,2,5];
    var fn = function(val, i) {
      values.push(val);
      indexes.push(i);
    }
    run(arr, 'forEachFromIndex', [7, true, fn]);
    equal(values, expectedValues, 'sparse | looping should return correct values');
    equal(indexes, expectedIndexes, 'sparse | looping should return correct indexes');

    var count = 0;
    var fn = function() {
      count++;
    }
    run(threeUndefined, 'forEachFromIndex', [0, fn]);
    equal(count, 3, 'simply having an undefined in an array does not qualify it as sparse');

  });

  method('mapFromIndex', function() {

    var arr = [
      { name: 'John' },
      { name: 'Karen' },
      { name: 'Marty' }
    ];

    // No looping, pos index
    assertFromIndex(arr, 'map', [0, 'name'], ['John', 'Karen', 'Marty']);
    assertFromIndex(arr, 'map', [1, 'name'], ['Karen', 'Marty']);
    assertFromIndex(arr, 'map', [2, 'name'], ['Marty']);
    assertFromIndex(arr, 'map', [3, 'name'], []);
    assertFromIndex(arr, 'map', [4, 'name'], []);

    // No looping, neg index
    assertFromIndex(arr, 'map', [-1, 'name'], ['Marty']);
    assertFromIndex(arr, 'map', [-2, 'name'], ['Karen', 'Marty']);
    assertFromIndex(arr, 'map', [-3, 'name'], ['John', 'Karen', 'Marty']);
    assertFromIndex(arr, 'map', [-4, 'name'], ['John', 'Karen', 'Marty']);

    // Looping, pos index
    assertFromIndex(arr, 'map', [0, true, 'name'], ['John', 'Karen', 'Marty']);
    assertFromIndex(arr, 'map', [1, true, 'name'], ['Karen', 'Marty', 'John']);
    assertFromIndex(arr, 'map', [2, true, 'name'], ['Marty', 'John', 'Karen']);
    assertFromIndex(arr, 'map', [3, true, 'name'], ['John', 'Karen', 'Marty']);
    assertFromIndex(arr, 'map', [4, true, 'name'], ['John', 'Karen', 'Marty']);

    // Looping, neg index
    assertFromIndex(arr, 'map', [-1, true, 'name'], ['Marty', 'John', 'Karen']);
    assertFromIndex(arr, 'map', [-2, true, 'name'], ['Karen', 'Marty', 'John']);
    assertFromIndex(arr, 'map', [-3, true, 'name'], ['John', 'Karen', 'Marty']);
    assertFromIndex(arr, 'map', [-4, true, 'name'], ['John', 'Karen', 'Marty']);

    // Function
    assertFromIndex(arr, 'map', [0, function(el) { return el.name; }], ['John', 'Karen', 'Marty']);
    assertFromIndex(arr, 'map', [1, function(el) { return el.name; }], ['Karen', 'Marty']);
    assertFromIndex(arr, 'map', [2, function(el) { return el.name; }], ['Marty']);
    assertFromIndex(arr, 'map', [3, function(el) { return el.name; }], []);

  });

  method('filterFromIndex', function() {

    var xyz = ['x','y','z'];

    // No looping, pos index
    assertFromIndex(xyz, 'filter', [0, 'y'], ['y']);
    assertFromIndex(xyz, 'filter', [1, 'y'], ['y']);
    assertFromIndex(xyz, 'filter', [2, 'y'], []);
    assertFromIndex(xyz, 'filter', [3, 'y'], []);
    assertFromIndex(xyz, 'filter', [4, 'y'], []);

    // No looping, neg index
    assertFromIndex(xyz, 'filter', [-1, 'y'], []);
    assertFromIndex(xyz, 'filter', [-2, 'y'], ['y']);
    assertFromIndex(xyz, 'filter', [-3, 'y'], ['y']);
    assertFromIndex(xyz, 'filter', [-4, 'y'], ['y']);

    // Looping, pos index
    assertFromIndex(xyz, 'filter', [0, true, 'y'], ['y']);
    assertFromIndex(xyz, 'filter', [1, true, 'y'], ['y']);
    assertFromIndex(xyz, 'filter', [2, true, 'y'], ['y']);
    assertFromIndex(xyz, 'filter', [3, true, 'y'], ['y']);
    assertFromIndex(xyz, 'filter', [4, true, 'y'], ['y']);

    // Looping, neg index
    assertFromIndex(xyz, 'filter', [-1, true, 'y'], ['y']);
    assertFromIndex(xyz, 'filter', [-2, true, 'y'], ['y']);
    assertFromIndex(xyz, 'filter', [-3, true, 'y'], ['y']);
    assertFromIndex(xyz, 'filter', [-4, true, 'y'], ['y']);

    // Looping, pos index, does not exist
    assertFromIndex(xyz, 'filter', [0, true, 'q'], []);
    assertFromIndex(xyz, 'filter', [1, true, 'q'], []);
    assertFromIndex(xyz, 'filter', [2, true, 'q'], []);
    assertFromIndex(xyz, 'filter', [3, true, 'q'], []);
    assertFromIndex(xyz, 'filter', [4, true, 'q'], []);

    // Looping, neg index, does not exist
    assertFromIndex(xyz, 'filter', [-1, true, 'q'], []);
    assertFromIndex(xyz, 'filter', [-2, true, 'q'], []);
    assertFromIndex(xyz, 'filter', [-3, true, 'q'], []);
    assertFromIndex(xyz, 'filter', [-4, true, 'q'], []);

    // Regex
    assertFromIndex(xyz, 'filter', [0, /[xy]/], ['x', 'y']);
    assertFromIndex(xyz, 'filter', [1, /[xy]/], ['y']);
    assertFromIndex(xyz, 'filter', [2, /[xy]/], []);
    assertFromIndex(xyz, 'filter', [3, /[xy]/], []);

    // Function
    assertFromIndex(xyz, 'filter', [0, function(el) { return el === 'y'; }], ['y']);
    assertFromIndex(xyz, 'filter', [1, function(el) { return el === 'y'; }], ['y']);
    assertFromIndex(xyz, 'filter', [2, function(el) { return el === 'y'; }], []);
    assertFromIndex(xyz, 'filter', [3, function(el) { return el === 'y'; }], []);


    // Moved from "filterFrom"

    test(['foo','bar'], [1, /[a-f]/], ['bar'], '/[a-f]/ from index 1');
    test(['foo','bar'], [1, true, /[a-f]/], ['bar','foo'], '/[a-f]/ from index 1');
    test([1,2,3], [0, function(e) { return e > 0; }], [1,2,3], 'greater than 0 from index 0');
    test([1,2,3], [1, function(e) { return e > 0; }], [2,3], 'greater than 0 from index 1');
    test([1,2,3], [2, function(e) { return e > 0; }], [3], 'greater than 0 from index 2');
    test([1,2,3], [3, function(e) { return e > 0; }], [], 'greater than 0 from index 3');
    test([1,2,3], [4, function(e) { return e > 0; }], [], 'greater than 0 from index 4');
    test([1,2,3], [0, function(e) { return e > 1; }], [2,3], 'greater than 1 from index 0');
    test([1,2,3], [1, function(e) { return e > 1; }], [2,3], 'greater than 1 from index 1');
    test([1,2,3], [2, function(e) { return e > 1; }], [3], 'greater than 1 from index 2');
    test([1,2,3], [0, function(e) { return e > 2; }], [3], 'greater than 2 from index 0');
    test([1,2,3], [0, function(e) { return e > 3; }], [], 'greater than 3 from index 0');

    test([1,2,3], [0, true, function(e) { return e > 0; }], [1,2,3], 'looping | greater than 0 from index 0');
    test([1,2,3], [1, true, function(e) { return e > 0; }], [2,3,1], 'looping | greater than 0 from index 1');
    test([1,2,3], [2, true, function(e) { return e > 0; }], [3,1,2], 'looping | greater than 0 from index 2');
    test([1,2,3], [3, true, function(e) { return e > 0; }], [1,2,3], 'looping | greater than 0 from index 3');
    test([1,2,3], [0, true, function(e) { return e > 1; }], [2,3], 'looping | greater than 1 from index 0');
    test([1,2,3], [1, true, function(e) { return e > 1; }], [2,3], 'looping | greater than 1 from index 1');
    test([1,2,3], [2, true, function(e) { return e > 1; }], [3,2], 'looping | greater than 1 from index 2');
    test([1,2,3], [0, true, function(e) { return e > 2; }], [3], 'looping | greater than 2 from index 0');
    test([1,2,3], [0, true, function(e) { return e > 3; }], [], 'looping | greater than 3 from index 0');

    test([{a:10},{a:8},{a:3}], [0, function(e) { return e['a'] > 5; }], [{a:10},{a:8}], 'key "a" is greater than 5');
    test([{a:10},{a:8},{a:3}], [1, function(e) { return e['a'] > 5; }], [{a:8}], 'key "a" is greater than 5 from index 1');
    test([{a:10},{a:8},{a:3}], [2, function(e) { return e['a'] > 5; }], [], 'key "a" is greater than 5 from index 2');

    test([{a:10},{a:8},{a:3}], [0, true, function(e) { return e['a'] > 5; }], [{a:10},{a:8}], 'looping | key "a" is greater than 5');
    test([{a:10},{a:8},{a:3}], [1, true, function(e) { return e['a'] > 5; }], [{a:8},{a:10}], 'looping | key "a" is greater than 5 from index 1');
    test([{a:10},{a:8},{a:3}], [2, true, function(e) { return e['a'] > 5; }], [{a:10},{a:8}], 'looping | key "a" is greater than 5 from index 2');

    test([function() {}], [0, function(e) {}], [], 'null function');
    test([function() {}], [1, function(e) {}], [], 'null function from index 1');
    test([null, null], [0, null], [null, null], 'null');
    test([null, null], [1, null], [null], 'null from index 1');

    test([function() {}], [0, true, function(e) {}], [], 'looping | null function');
    test([function() {}], [1, true, function(e) {}], [], 'looping | null function from index 1');
    test([null, null], [0, true, null], [null, null], 'looping | null');
    test([null, null], [1, true, null], [null, null], 'looping | null from index 1');

    // Example: finding last from an index. (reverse order). This means we don't need a filterFromLastIndex
    var arr = [1,2,3,4,5,6,7,8,9];
    test(arr, [4, function(n) { return n % 3 == 0; }], [6,9], 'n % 3 from index 4');
    test(arr, [4, true, function(n) { return n % 3 == 0; }], [6,9,3], 'looping | n % 3 from index 4');

    arr.reverse();
    test(arr, [4, function(n) { return n % 3 == 0; }], [3], 'reversed | n % 3 from index 4 reversed');
    test(arr, [4, true, function(n) { return n % 3 == 0; }], [3,9,6], 'looping | reversed | n % 3 from index 4 reversed');

  });

  method('someFromIndex', function() {

    var xyz = ['x','y','z'];

    // No looping, pos index
    assertFromIndex(xyz, 'some', [0, 'y'], true);
    assertFromIndex(xyz, 'some', [1, 'y'], true);
    assertFromIndex(xyz, 'some', [2, 'y'], false);
    assertFromIndex(xyz, 'some', [3, 'y'], false);
    assertFromIndex(xyz, 'some', [4, 'y'], false);

    // No looping, neg index
    assertFromIndex(xyz, 'some', [-1, 'y'], false);
    assertFromIndex(xyz, 'some', [-2, 'y'], true);
    assertFromIndex(xyz, 'some', [-3, 'y'], true);
    assertFromIndex(xyz, 'some', [-4, 'y'], true);

    // Looping should always be true if the element exists
    assertFromIndex(xyz, 'some', [0, true, 'y'], true);
    assertFromIndex(xyz, 'some', [1, true, 'y'], true);
    assertFromIndex(xyz, 'some', [2, true, 'y'], true);
    assertFromIndex(xyz, 'some', [3, true, 'y'], true);
    assertFromIndex(xyz, 'some', [4, true, 'y'], true);

    assertFromIndex(xyz, 'some', [-1, true, 'y'], true);
    assertFromIndex(xyz, 'some', [-2, true, 'y'], true);
    assertFromIndex(xyz, 'some', [-3, true, 'y'], true);
    assertFromIndex(xyz, 'some', [-4, true, 'y'], true);

    // Looping should never be true if the element does not exist
    assertFromIndex(xyz, 'some', [0, true, 'q'], false);
    assertFromIndex(xyz, 'some', [1, true, 'q'], false);
    assertFromIndex(xyz, 'some', [2, true, 'q'], false);
    assertFromIndex(xyz, 'some', [3, true, 'q'], false);
    assertFromIndex(xyz, 'some', [4, true, 'q'], false);

    assertFromIndex(xyz, 'some', [-1, true, 'q'], false);
    assertFromIndex(xyz, 'some', [-2, true, 'q'], false);
    assertFromIndex(xyz, 'some', [-3, true, 'q'], false);
    assertFromIndex(xyz, 'some', [-4, true, 'q'], false);

    // Regex
    assertFromIndex(xyz, 'some', [0, /[xy]/], true);
    assertFromIndex(xyz, 'some', [1, /[xy]/], true);
    assertFromIndex(xyz, 'some', [2, /[xy]/], false);
    assertFromIndex(xyz, 'some', [3, /[xy]/], false);

    // Function
    assertFromIndex(xyz, 'some', [0, function(el) { return el === 'y'; }], true);
    assertFromIndex(xyz, 'some', [1, function(el) { return el === 'y'; }], true);
    assertFromIndex(xyz, 'some', [2, function(el) { return el === 'y'; }], false);
    assertFromIndex(xyz, 'some', [3, function(el) { return el === 'y'; }], false);

    // Can still run against an array of true
    assertFromIndex([true, true], 'some', [1, true, true], true);

  });

  method('everyFromIndex', function() {

    var xyz = ['x','y','z'];
    var zzz = ['z','z','z'];

    // No looping, pos index
    assertFromIndex(xyz, 'every', [0, 'z'], false);
    assertFromIndex(xyz, 'every', [1, 'z'], false);
    assertFromIndex(xyz, 'every', [2, 'z'], true);

    // As described on MDN, every is "vacuously true", or true even if the array is an empty set.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
    // https://en.wikipedia.org/wiki/Vacuous_truth#Vacuous_truths_in_mathematics
    assertFromIndex(xyz, 'every', [3, 'z'], true);
    assertFromIndex(xyz, 'every', [4, 'z'], true);

    // No looping, neg index
    assertFromIndex(xyz, 'every', [-1, 'z'], true);
    assertFromIndex(xyz, 'every', [-2, 'z'], false);
    assertFromIndex(xyz, 'every', [-3, 'z'], false);
    assertFromIndex(xyz, 'every', [-4, 'z'], false);

    // Looping, pos index
    assertFromIndex(xyz, 'every', [0, true, 'y'], false);
    assertFromIndex(xyz, 'every', [1, true, 'y'], false);
    assertFromIndex(xyz, 'every', [2, true, 'y'], false);
    assertFromIndex(xyz, 'every', [3, true, 'y'], false);
    assertFromIndex(xyz, 'every', [4, true, 'y'], false);

    // Looping, neg index
    assertFromIndex(xyz, 'every', [-1, true, 'y'], false);
    assertFromIndex(xyz, 'every', [-2, true, 'y'], false);
    assertFromIndex(xyz, 'every', [-3, true, 'y'], false);
    assertFromIndex(xyz, 'every', [-4, true, 'y'], false);

    // Looping, all true
    assertFromIndex(zzz, 'every', [0, true, 'z'], true);
    assertFromIndex(zzz, 'every', [1, true, 'z'], true);
    assertFromIndex(zzz, 'every', [2, true, 'z'], true);
    assertFromIndex(zzz, 'every', [3, true, 'z'], true);
    assertFromIndex(zzz, 'every', [4, true, 'z'], true);

    assertFromIndex(zzz, 'every', [-1, true, 'z'], true);
    assertFromIndex(zzz, 'every', [-2, true, 'z'], true);
    assertFromIndex(zzz, 'every', [-3, true, 'z'], true);
    assertFromIndex(zzz, 'every', [-4, true, 'z'], true);

    // Regex
    assertFromIndex(xyz, 'every', [0, /[yz]/], false);
    assertFromIndex(xyz, 'every', [1, /[yz]/], true);
    assertFromIndex(xyz, 'every', [2, /[yz]/], true);
    assertFromIndex(xyz, 'every', [3, /[yz]/], true);

    // Function
    assertFromIndex(xyz, 'every', [0, function(el) { return el === 'z'; }], false);
    assertFromIndex(xyz, 'every', [1, function(el) { return el === 'z'; }], false);
    assertFromIndex(xyz, 'every', [2, function(el) { return el === 'z'; }], true);
    assertFromIndex(xyz, 'every', [3, function(el) { return el === 'z'; }], true);

    // Can still run against an array of true
    assertFromIndex([true, true], 'every', [1, true, true], true);

  });

  method('reduceFromIndex', function() {

    var xy  = ['x','y'];
    var xyz = ['x','y','z'];

    function addArgs(a, b) {
      return a + b;
    }

    raisesError(function() { run(arr, 'reduceFromIndex', [3, addArgs]); }, '3 index is no elements');

    assertFromIndex(xyz, 'reduce', [0, addArgs], 'xyz', 'Reducing from 0');
    assertFromIndex(xyz, 'reduce', [1, addArgs], 'yz', 'Reducing from 1');
    assertFromIndex(xyz, 'reduce', [2, addArgs], 'z', 'Reducing from 2');

    assertFromIndex(xyz, 'reduce', [-1, addArgs], 'z', 'Reducing from -1');
    assertFromIndex(xyz, 'reduce', [-2, addArgs], 'yz', 'Reducing from -2');
    assertFromIndex(xyz, 'reduce', [-3, addArgs], 'xyz', 'Reducing from -3');

    assertFromIndex(xyz, 'reduce', [0, addArgs, 'I: '], 'I: xyz', 'Reducing from 0 with init');
    assertFromIndex(xyz, 'reduce', [1, addArgs, 'I: '], 'I: yz', 'Reducing from 1 with init');
    assertFromIndex(xyz, 'reduce', [2, addArgs, 'I: '], 'I: z', 'Reducing from 2 with init');

    assertFromIndex(xyz, 'reduce', [-1, addArgs, 'I: '], 'I: z', 'Reducing from -1 with init');
    assertFromIndex(xyz, 'reduce', [-2, addArgs, 'I: '], 'I: yz', 'Reducing from -2 with init');
    assertFromIndex(xyz, 'reduce', [-3, addArgs, 'I: '], 'I: xyz', 'Reducing from -3 with init');

    assertFromIndexArgs(xy,  'reduce', [0], ['x', 'y', 1]);
    assertFromIndexArgs(xyz, 'reduce', [1], ['y', 'z', 2]);
    assertFromIndexArgs(xyz, 'reduce', [2],  null);
    assertFromIndexArgs(xyz, 'reduce', [-1], null);
    assertFromIndexArgs(xyz, 'reduce', [-2], ['y','z', 2]);
    assertFromIndexArgs(xy,  'reduce', [-2], ['x','y', 1]);
    assertFromIndexArgs(xy,  'reduce', [-3], ['x','y', 1]);

  });

  method('reduceRightFromIndex', function() {

    var xy  = ['x','y'];
    var xyz = ['x','y','z'];

    function addArgs(a, b) {
      return a + b;
    }

    raisesError(function() { run([],  'reduceRightFromIndex', [ 0,  addArgs]); }, 'no elements from 0');
    raisesError(function() { run([],  'reduceRightFromIndex', [ 1,  addArgs]); }, 'no elements from 1');
    raisesError(function() { run([],  'reduceRightFromIndex', [-1,  addArgs]); }, 'no elements from -1');
    raisesError(function() { run(xyz, 'reduceRightFromIndex', [-4, addArgs]); }, '-4 is no elements');
    raisesError(function() { run(xyz, 'reduceRightFromIndex', [-5, addArgs]); }, '-5 is no elements');

    assertFromIndex(xyz, 'reduceRight', [0, addArgs], 'x',   'Reducing right from 0');
    assertFromIndex(xyz, 'reduceRight', [1, addArgs], 'yx',  'Reducing right from 1');
    assertFromIndex(xyz, 'reduceRight', [2, addArgs], 'zyx', 'Reducing right from 2');
    assertFromIndex(xyz, 'reduceRight', [3, addArgs], 'zyx', 'Reducing right from 3');

    assertFromIndex(xyz, 'reduceRight', [-1, addArgs], 'zyx', 'Reducing right from -1');
    assertFromIndex(xyz, 'reduceRight', [-2, addArgs], 'yx',  'Reducing right from -2');
    assertFromIndex(xyz, 'reduceRight', [-3, addArgs], 'x',   'Reducing from -3');

    assertFromIndex(xyz, 'reduceRight', [0, addArgs, 'I: '], 'I: x', 'Reducing right from 0 with init');
    assertFromIndex(xyz, 'reduceRight', [1, addArgs, 'I: '], 'I: yx', 'Reducing right from 1 with init');
    assertFromIndex(xyz, 'reduceRight', [2, addArgs, 'I: '], 'I: zyx', 'Reducing right from 2 with init');
    assertFromIndex(xyz, 'reduceRight', [3, addArgs, 'I: '], 'I: zyx', 'Reducing right from 3 with init');

    assertFromIndex(xyz, 'reduceRight', [-1, addArgs, 'I: '], 'I: zyx', 'Reducing right from -1 with init');
    assertFromIndex(xyz, 'reduceRight', [-2, addArgs, 'I: '], 'I: yx', 'Reducing right from -2 with init');
    assertFromIndex(xyz, 'reduceRight', [-3, addArgs, 'I: '], 'I: x', 'Reducing right from -3 with init');
    assertFromIndex(xyz, 'reduceRight', [-4, addArgs, 'I: '], 'I: ', 'Reducing right from -4 with init');

    assertFromIndexArgs(xy,  'reduceRight', [1], ['y', 'x', 1]);
    assertFromIndexArgs(xyz, 'reduceRight', [1], ['y', 'x', 1]);
    assertFromIndexArgs(xyz, 'reduceRight', [0],  null);
    assertFromIndexArgs(xy,  'reduceRight', [-1], ['y','x', 1]);
    assertFromIndexArgs(xyz, 'reduceRight', [-2], ['y','x', 1]);
    assertFromIndexArgs(xyz, 'reduceRight', [-3], ['x','y', 1]);

  });

  method('findFromIndex', function() {

    var xyz = ['x','y','z'];

    // No looping, pos index
    assertFromIndex(xyz, 'find', [0, 'y'], 'y');
    assertFromIndex(xyz, 'find', [1, 'y'], 'y');
    assertFromIndex(xyz, 'find', [2, 'y'], undefined);
    assertFromIndex(xyz, 'find', [3, 'y'], undefined);
    assertFromIndex(xyz, 'find', [4, 'y'], undefined);

    // No looping, neg index
    assertFromIndex(xyz, 'find', [-1, 'y'], undefined);
    assertFromIndex(xyz, 'find', [-2, 'y'], 'y');
    assertFromIndex(xyz, 'find', [-3, 'y'], 'y');
    assertFromIndex(xyz, 'find', [-4, 'y'], 'y');

    // Looping, pos index
    assertFromIndex(xyz, 'find', [0, true, 'y'], 'y');
    assertFromIndex(xyz, 'find', [1, true, 'y'], 'y');
    assertFromIndex(xyz, 'find', [2, true, 'y'], 'y');
    assertFromIndex(xyz, 'find', [3, true, 'y'], 'y');
    assertFromIndex(xyz, 'find', [4, true, 'y'], 'y');

    // Looping, neg index
    assertFromIndex(xyz, 'find', [-1, true, 'y'], 'y');
    assertFromIndex(xyz, 'find', [-2, true, 'y'], 'y');
    assertFromIndex(xyz, 'find', [-3, true, 'y'], 'y');
    assertFromIndex(xyz, 'find', [-4, true, 'y'], 'y');

    // Looping, pos index, does not exist
    assertFromIndex(xyz, 'find', [0, true, 'q'], undefined);
    assertFromIndex(xyz, 'find', [1, true, 'q'], undefined);
    assertFromIndex(xyz, 'find', [2, true, 'q'], undefined);
    assertFromIndex(xyz, 'find', [3, true, 'q'], undefined);
    assertFromIndex(xyz, 'find', [4, true, 'q'], undefined);

    // Looping, neg index, does not exist
    assertFromIndex(xyz, 'find', [-1, true, 'q'], undefined);
    assertFromIndex(xyz, 'find', [-2, true, 'q'], undefined);
    assertFromIndex(xyz, 'find', [-3, true, 'q'], undefined);
    assertFromIndex(xyz, 'find', [-4, true, 'q'], undefined);

    // Regex
    assertFromIndex(xyz, 'find', [0, /[xy]/], 'x');
    assertFromIndex(xyz, 'find', [1, /[xy]/], 'y');
    assertFromIndex(xyz, 'find', [2, /[xy]/], undefined);
    assertFromIndex(xyz, 'find', [3, /[xy]/], undefined);

    // Function
    assertFromIndex(xyz, 'find', [0, function(el) { return el === 'y'; }], 'y');
    assertFromIndex(xyz, 'find', [1, function(el) { return el === 'y'; }], 'y');
    assertFromIndex(xyz, 'find', [2, function(el) { return el === 'y'; }], undefined);
    assertFromIndex(xyz, 'find', [3, function(el) { return el === 'y'; }], undefined);

    // Moved from "findFrom"

    test([1,2,3], [0, function(e) { return e > 0; }], 1, 'greater than 0 from index 0');
    test([1,2,3], [1, function(e) { return e > 0; }], 2, 'greater than 0 from index 1');
    test([1,2,3], [2, function(e) { return e > 0; }], 3, 'greater than 0 from index 2');
    test([1,2,3], [3, function(e) { return e > 0; }], undefined, 'greater than 0 from index 3');
    test([1,2,3], [0, function(e) { return e > 1; }], 2, 'greater than 1 from index 0');
    test([1,2,3], [1, function(e) { return e > 1; }], 2, 'greater than 1 from index 1');
    test([1,2,3], [2, function(e) { return e > 1; }], 3, 'greater than 1 from index 2');
    test([1,2,3], [0, function(e) { return e > 2; }], 3, 'greater than 2 from index 0');
    test([1,2,3], [0, function(e) { return e > 3; }], undefined, 'greater than 3 from index 0');

    test([1,2,3], [0, true, function(e) { return e > 0; }], 1, 'loop | greater than 0 from index 0');
    test([1,2,3], [1, true, function(e) { return e > 0; }], 2, 'loop | greater than 0 from index 1');
    test([1,2,3], [2, true, function(e) { return e > 0; }], 3, 'loop | greater than 0 from index 2');
    test([1,2,3], [3, true, function(e) { return e > 0; }], 1, 'loop | greater than 0 from index 3');
    test([1,2,3], [0, true, function(e) { return e > 1; }], 2, 'loop | greater than 1 from index 0');
    test([1,2,3], [1, true, function(e) { return e > 1; }], 2, 'loop | greater than 1 from index 1');
    test([1,2,3], [2, true, function(e) { return e > 1; }], 3, 'loop | greater than 1 from index 2');
    test([1,2,3], [0, true, function(e) { return e > 2; }], 3, 'loop | greater than 2 from index 0');
    test([1,2,3], [0, true, function(e) { return e > 3; }], undefined, 'loop | greater than 3 from index 0');

    test([{a:10},{a:8},{a:3}], [0, function(e) { return e['a'] > 5; }], {a:10}, 'key "a" greater than 5');
    test([{a:10},{a:8},{a:3}], [1, function(e) { return e['a'] > 5; }], {a:8}, 'key "a" greater than 5 from index 1');
    test([{a:10},{a:8},{a:3}], [2, function(e) { return e['a'] > 5; }], undefined, 'key "a" greater than 5 from index 2');
    test([function() {}], [1, function(e) {}], undefined, 'null function from index 1');
    test([null, null], [1, null], null, 'null from index 1');
    test(threeUndefined, [1, undefined], undefined, 'undefined from index 1');

    test(['foo','bar'], [1, /^[a-f]/], 'bar', '/a-f/ from index 1');
    test(['foo','bar','zak'], [2, true, /^[a-f]/], 'foo', '/a-f/ from index 1 looping');

  });

  method('findIndexFromIndex', function() {

    var xyz = ['x','y','z'];

    // No looping, pos index
    assertFromIndex(xyz, 'findIndex', [0, 'y'], 1);
    assertFromIndex(xyz, 'findIndex', [1, 'y'], 1);
    assertFromIndex(xyz, 'findIndex', [2, 'y'], -1);
    assertFromIndex(xyz, 'findIndex', [3, 'y'], -1);
    assertFromIndex(xyz, 'findIndex', [4, 'y'], -1);

    // No looping, neg index
    assertFromIndex(xyz, 'findIndex', [-1, 'y'], -1);
    assertFromIndex(xyz, 'findIndex', [-2, 'y'], 1);
    assertFromIndex(xyz, 'findIndex', [-3, 'y'], 1);
    assertFromIndex(xyz, 'findIndex', [-4, 'y'], 1);

    // Looping, pos index
    assertFromIndex(xyz, 'findIndex', [0, true, 'y'], 1);
    assertFromIndex(xyz, 'findIndex', [1, true, 'y'], 1);
    assertFromIndex(xyz, 'findIndex', [2, true, 'y'], 1);
    assertFromIndex(xyz, 'findIndex', [3, true, 'y'], 1);
    assertFromIndex(xyz, 'findIndex', [4, true, 'y'], 1);

    // Looping, neg index
    assertFromIndex(xyz, 'findIndex', [-1, true, 'y'], 1);
    assertFromIndex(xyz, 'findIndex', [-2, true, 'y'], 1);
    assertFromIndex(xyz, 'findIndex', [-3, true, 'y'], 1);
    assertFromIndex(xyz, 'findIndex', [-4, true, 'y'], 1);

    // Looping, pos index, does not exist
    assertFromIndex(xyz, 'findIndex', [0, true, 'q'], -1);
    assertFromIndex(xyz, 'findIndex', [1, true, 'q'], -1);
    assertFromIndex(xyz, 'findIndex', [2, true, 'q'], -1);
    assertFromIndex(xyz, 'findIndex', [3, true, 'q'], -1);
    assertFromIndex(xyz, 'findIndex', [4, true, 'q'], -1);

    // Looping, neg index, does not exist
    assertFromIndex(xyz, 'findIndex', [-1, true, 'q'], -1);
    assertFromIndex(xyz, 'findIndex', [-2, true, 'q'], -1);
    assertFromIndex(xyz, 'findIndex', [-3, true, 'q'], -1);
    assertFromIndex(xyz, 'findIndex', [-4, true, 'q'], -1);

    // Regex
    assertFromIndex(xyz, 'findIndex', [0, /[xy]/], 0);
    assertFromIndex(xyz, 'findIndex', [1, /[xy]/], 1);
    assertFromIndex(xyz, 'findIndex', [2, /[xy]/], -1);
    assertFromIndex(xyz, 'findIndex', [3, /[xy]/], -1);

    // Function
    assertFromIndex(xyz, 'findIndex', [0, function(el) { return el === 'y'; }], 1);
    assertFromIndex(xyz, 'findIndex', [1, function(el) { return el === 'y'; }], 1);
    assertFromIndex(xyz, 'findIndex', [2, function(el) { return el === 'y'; }], -1);
    assertFromIndex(xyz, 'findIndex', [3, function(el) { return el === 'y'; }], -1);


    // Moved from Array#findIndexFrom

    test(['a','b','c','b'], [2, 'b'], 3, 'finds first instance from index');
    test([5,2,4,4], [3, 4], 3, '4 in 5,2,4,4 from index 3');
    test([5,2,4,4], [10, 4], -1, '4 in 5,2,4,4 from index 10');
    test([5,2,4,4], [-10, 4], 2, '4 in 5,2,4,4 from index -10');
    test([5,2,4,4], [-1, 4], 3, '4 in 5,2,4,4 from index -1');

    test(['a','b','c','b'], [1, true, 'b'], 1, 'finds first instance from index');
    test([5,2,4,4,7,0], [4, true, 4], 2, '4 in 5,2,4,4 from index 3');
    test([5,2,4,4,7,0], [10, true, 4], 2, '4 in 5,2,4,4 from index 10');
    test([5,2,4,4,7,0], [10, true, 8], -1, '8 in 5,2,4,4 from index 10');
    test([5,2,4,4,7,0], [-10, true, 4], 2, '4 in 5,2,4,4 from index -10');
    test([5,2,4,4,7,0], [-1, true, 4], 2, '4 in 5,2,4,4 from index -1');

  });

  method('min', function() {

    test([12,87,55], 12, 'no argument');
    test([12,87,55], oneUndefined, 12, 'undefined');
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
    test([{a:1,b:3},{a:2,b:4},{a:3,b:3}], [true, function(el) { return el['b']; }], [{a:1,b:3},{a:3,b:3}], 'key "b", 2 found');
    test([{a:-1,b:-5},{a:-2,b:-4},{a:-3,b:-3}], [function(el) { return el['b']; }], {a:-1,b:-5}, 'key "b", 1 found');
    test(['short','and','mort'], [function(el) { return el.length; }], 'and', 'length');
    test(['short','and','mort','fat'], [true, function(el) { return el.length; }], ['and','fat'], 'and,fat');
    test(['short','and','mort'], ['length'], 'and', 'length with shortcut');
    test(['short','and','mort'], [true, 'length'], ['and'], 'length with shortcut');
    test([12,12,12], [true, function(n) { return n; }], [12,12,12], 'should not unique');

    var fn = function(el,i,a) {
      equal(this, [1], 'scope should be the array');
      equal(i, 0, 'second param should be the index');
      equal(a, [1], 'third param should also be the array');
      return el;
    }
    run([1], 'min', [fn]);


    raisesError(function() { run(threeUndefined, 'min'); }, 'should raise an error when comparing undefined');
    raisesError(function() { run(undefinedWith1, 'min'); }, 'should raise an error when comparing 1 to undefined');
    raisesError(function() { run([87,12,55], 'min', [4]); }, 'number not found in number, so undefined');

    var arr = [
      {id:1,a:{b:{c:6}}},
      {id:2,a:{b:{c:6}}},
      {id:3,a:{b:{c:4}}},
      {id:4,a:{b:{c:4}}}
    ];
    test(arr, ['a.b.c'], {id:3,a:{b:{c:4}}}, 'by deep dot operator');
    test(arr, [true, 'a.b.c'], [{id:3,a:{b:{c:4}}},{id:4,a:{b:{c:4}}}], 'by deep dot operator multiple');
  });

  method('max', function() {

    test([12,87,55], 87, 'no argument');
    test([12,87,55], oneUndefined, 87, 'undefined');
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
    test([{a:1,b:3},{a:2,b:1},{a:3,b:3}], [true, function(el) { return el['b']; }], [{a:1,b:3},{a:3,b:3}], 'key "b", 2 found');
    test([{a:-1,b:-5},{a:-2,b:-4},{a:-3,b:-3}], [function(el) { return el['b']; }], {a:-3,b:-3}, 'key "b" returns b:-3');
    test(['short','and', 'mort'], [function(el) { return el.length; }], 'short', 'length');
    test(['short','and', 'morts', 'fat'], [true, function(el) { return el.length; }], ['short','morts'], 'short,morts');
    test([12,12,12], [true, function(n){ return n; }], [12,12,12], 'should not unique');

    test([{foo:'bar'}], [], {foo:'bar'}, 'object passed should return itself');
    test([{foo:'bar'}], [true, 'foo'], [{foo:'bar'}], 'object passed with multiple returns array');

    var fn = function(el,i,a) {
      equal(this, [1], 'scope should be the array');
      equal(i, 0, 'second param should be the index');
      equal(a, [1], 'third param should also be the array');
      return el;
    };
    run([1], 'max', [fn]);

    raisesError(function() { run(threeUndefined, 'max'); }, 'should raise an error when comparing undefined');
    raisesError(function() { run(undefinedWith1, 'max'); }, 'should raise an error when comparing 1 to undefined');
    raisesError(function() { run([87,12,55], 'max', [4]); }, 'number not found in number, so undefined');

    var arr = [
      {id:1,a:{b:{c:6}}},
      {id:2,a:{b:{c:6}}},
      {id:3,a:{b:{c:4}}},
      {id:4,a:{b:{c:4}}}
    ];
    test(arr, ['a.b.c'], {id:1,a:{b:{c:6}}}, 'by deep dot operator');
    test(arr, [true, 'a.b.c'], [{id:1,a:{b:{c:6}}},{id:2,a:{b:{c:6}}}], 'by deep dot operator multiple');

    test(['one','two','three'], ['length'], 'three', 'Shold allow a string property');
    test(['','two','three'], ['length'], 'three', 'Shold allow an empty string');

  });


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

  method('sum', function() {
    test([12,87,55], 154, '12,87,55');
    test([12,87,128], 227, '12,87,128');
    test([], 0, 'empty array is 0');
    test([null, false], 0, '[null,false] is 0');
    test([{a:1,b:5},{a:2,b:5},{a:3,b:5}], [function(el) { return el['a']; }], 6, 'key "a"');
    test([{a:1,b:5},{a:2,b:5},{a:3,b:5}], ['a'], 6, 'shortcut for key "a"');
    test([{a:{b:5}},{a:{b:6}}], ['a.b'], 11, 'deep properties');

    var arr = [1,2,3];
    arr['foo'] = 5;
    test(arr, 6, 'Should not enumerate over non-index properties');
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

    test([{a:{b:5}},{a:{b:11}}], ['a.b'], 8, 'deep properties');
  });

  method('median', function() {
    var people = [
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'ronnie', age: 13, hair: 'brown'  },
      { name: 'edmund', age: 27, hair: 'blonde' }
    ];

    test([1,2,3,4,5], 3, '1,2,3,4,5');
    test([5,4,3,2,1], 3, '5,4,3,2,1');
    test([2,1,3,4,5], 3, '2,1,3,4,5');
    test([1,2,2,4,5], 2, '1,2,2,4,5');
    test([5,4,2,2,1], 2, '5,4,2,2,1');
    test([1,1,1,1,1], 1, '1,1,1,1,1');

    test([1,2,3,4,5,6], 3.5, '1,2,3,4,5,6');
    test([6,5,4,3,2,1], 3.5, '6,5,4,3,2,1');

    test([1,5,6,3,9,8,4,2,0,7], 4.5, '1,5,6,3,9,8,4,2,0,7');
    test([1,2,3], 2, '1,2,3');
    test([1,2], 1.5, '1,2');
    test([1], 1, '1');
    test([], 0, 'no entries in array should be undefined');

    test([1.50,.0024,15.25,44.2], 8.375, 'decimals');
    test([0,0,0,0], 0, 'all zero');
    test([NaN,NaN,NaN], NaN, 'all NaN');
    test([null,false], 0, 'null,false coerced');

    test(people, ['age'], 27, 'people median age is 27');
    test(people, [function(p) { return p.age; }], 27, 'people median age is 27 by function');

    test([{a:{b:5}},{a:{b:6}},{a:{b:8}}], ['a.b'], 6, 'deep properties');
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
