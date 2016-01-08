package('Array', function() {
  "use strict";

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

  });

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

    test(threeUndefined, oneUndefined, true, 'all undefined');
    test(['a', 'b'], oneUndefined, false, 'none undefined');

    arr = testClone(threeUndefined);
    arr.push('a');

    test(arr, oneUndefined, false, 'every undefined');

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
    var obj = { a: { getTime: function () { return timestamp; } }};
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

  method('all', function() {

    test([{name:'john',age:25}], [{name:'john',age:25}], true, 'handles complex objects');
    test([{name:'john',age:25},{name:'fred',age:85}], ['age'], false, 'simple string mistakenly passed for complex objects');
    test([{name:'john',age:25},{name:'fred',age:85}], [{name:'john',age:25}], false, "john isn't all");

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

    test(threeUndefined, oneUndefined, true, 'undefined should match all undefined');
    test(threeUndefined, [null], false, 'null should not match all undefined');
    test(undefinedWithNull, oneUndefined, false, 'undefined should match one undefined');
    test(undefinedWithNull, [null], false, 'null should match one null');
    test([null, null], [null], true, 'null should match all null');
    test([null, null], oneUndefined, false, 'undefined should not match all null');

    var fn1 = function() {};
    var fn2 = function() {};
    var matchFn1 = function(el) {
      return el === fn1;
    }
    var matchFn2 = function(el) {
      return el === fn2;
    }

    equal(run([fn1, fn1, fn1], 'all', [matchFn1]), true, 'functions can be matched inside the callback');
    equal(run([fn1, fn1, fn2], 'all', [matchFn1]), false, 'functions can be matched inside the callback');

  });

  method('any', function() {

    test([{name:'john',age:25}], [{name:'john',age:25}], true, 'handles complex objects');
    test([{name:'john',age:25},{name:'fred',age:85}], ['age'], false, 'simple string mistakenly passed for complex objects');
    test([{name:'john',age:25},{name:'fred',age:85}], [{name:'john',age:25}], true, 'john can be found ');

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

    raisesError(function() { run([1,2,3], 'any') }, 'no argument raises a TypeError');

    test(threeUndefined, oneUndefined, true, 'undefined should match all undefined');
    test(threeUndefined, [null], false, 'null should not match all undefined');
    test(undefinedWithNull, oneUndefined, true, 'undefined should match one undefined');
    test(undefinedWithNull, [null], true, 'null should match one null');
    test([null, null], [null], true, 'null should match all null');
    test([null, null], oneUndefined, false, 'undefined should not match all null');

    var fn1 = function() {};
    var fn2 = function() {};
    var matchFn1 = function(el) {
      return el === fn1;
    }
    var matchFn2 = function(el) {
      return el === fn2;
    }

    equal(run([fn1, fn2, fn2], 'any', [matchFn1]), true, 'functions can be matched inside the callback');
    equal(run([fn2, fn2, fn2], 'any', [matchFn1]), false, 'functions can be matched inside the callback');

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
    equal(run(arr, 'exclude', [match]).length, 0, 'exclude');

    var arr2 = run(testClone(arr), 'remove', [match]);
    equal(arr2.length, 0, 'remove');

  });

  group('Array Inheritance', function() {
    var count;

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
    run(x, 'filter', [function() {
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

  method('isEmpty', function() {

    test([1,2,3], false, '1,2,3');
    test([], true, 'empty array');
    test([null], false, '[null]');
    test(oneUndefined, false, '[undefined]');
    test([null,null], false, '[null,null]');
    test(twoUndefined, false, '[undefined,undefined]');
    test([false,false], false, '[false,false]');
    test([0,0], false, '[0,0]');

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
    test(threeUndefined, [undefined, 1], undefined, 'undefined from index 1');

  });

  method('filterFrom', function() {

    test(['foo','bar'], [/[a-f]/, 1], ['bar'], '/[a-f]/ from index 1');
    test(['foo','bar'], [/[a-f]/, 1, true], ['bar','foo'], '/[a-f]/ from index 1');
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

    // Example: finding last from an index. (reverse order). This means we don't need a filterFromLastIndex
    var arr = [1,2,3,4,5,6,7,8,9];
    test(arr, [function(n) { return n % 3 == 0; }, 4], [6,9], 'n % 3 from index 4');
    test(arr, [function(n) { return n % 3 == 0; }, 4, true], [6,9,3], 'looping | n % 3 from index 4');

    arr.reverse();
    test(arr, [function(n) { return n % 3 == 0; }, 4], [3], 'reversed | n % 3 from index 4 reversed');
    test(arr, [function(n) { return n % 3 == 0; }, 4, true], [3,9,6], 'looping | reversed | n % 3 from index 4 reversed');

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

  method('each', function() {
    var arr, fn, result, count, indexes;

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
    raisesError(function(){ run([1], 'each') }, 'raises an error if no callback', TypeError);

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
    }
    run(['a','b','c'], 'each', [fn]);
    equal(count, 3, 'returning undefined will not break the loop');


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
    run(threeUndefined, 'each', [fn]);
    equal(count, 3, 'however, simply having an undefined in an array does not qualify it as sparse');
  });

  method('forEachFrom', function() {

    var arr = [2, 5, 9];
    var fn = function(el, i, a) {
      equal(el, arr[i], 'looping successfully');
    };
    run(arr, 'forEachFrom', [fn]);

    var fn = function(el, i, a) {
      equal(el, 'a', 'first parameter is the element');
      equal(i, 0, 'second parameter is the index');
      equal(a, ['a'], 'third parameter is the array');
      equal(this, a, 'scope is also the array');
    };
    run(['a'], 'forEachFrom', [fn, 'this']);

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
    test(arr, ['a.b.c', true], [{id:3,a:{b:{c:4}}},{id:4,a:{b:{c:4}}}], 'by deep dot operator multiple');
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
    test([{a:1,b:3},{a:2,b:1},{a:3,b:3}], [function(el) { return el['b']; }, true], [{a:1,b:3},{a:3,b:3}], 'key "b", 2 found');
    test([{a:-1,b:-5},{a:-2,b:-4},{a:-3,b:-3}], [function(el) { return el['b']; }], {a:-3,b:-3}, 'key "b" returns b:-3');
    test(['short','and', 'mort'], [function(el) { return el.length; }], 'short', 'length');
    test(['short','and', 'morts', 'fat'], [function(el) { return el.length; }, true], ['short','morts'], 'short,morts');
    test([12,12,12], [function(n){ return n; }, true], [12,12,12], 'should not unique');

    test([{foo:'bar'}], [], {foo:'bar'}, 'object passed should return itself');
    test([{foo:'bar'}], ['foo', true], [{foo:'bar'}], 'object passed with multiple returns array');

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
    test(arr, ['a.b.c', true], [{id:1,a:{b:{c:6}}},{id:2,a:{b:{c:6}}}], 'by deep dot operator multiple');

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
    arr = run(people, 'least', [fn, true]);
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

    var arr = [
      {id:1,a:{b:{c:6}}},
      {id:2,a:{b:{c:4}}},
      {id:3,a:{b:{c:4}}},
      {id:4,a:{b:{c:4}}}
    ];
    test(arr, ['a.b.c'], {id:1,a:{b:{c:6}}}, 'by deep dot operator');
    test(arr, ['a.b.c', true], [{id:1,a:{b:{c:6}}}], 'by deep dot operator multiple');

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

    var arr = [
      {id:1,a:{b:{c:6}}},
      {id:2,a:{b:{c:4}}},
      {id:3,a:{b:{c:4}}},
      {id:4,a:{b:{c:4}}}
    ];
    test(arr, ['a.b.c'], {id:2,a:{b:{c:4}}}, 'by deep dot operator');
    test(arr, ['a.b.c', true], [{id:2,a:{b:{c:4}}},{id:3,a:{b:{c:4}}},{id:4,a:{b:{c:4}}}], 'by deep dot operator multiple');

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
    var arr, fn;

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


});

package('Object', function() {
  "use strict";

  // Array.prototype.min may shadow Object.prototype.min,
  // throwing off test results, so add a check for that here.
  function arrayMinExtended() {
    return 'min' in Array.prototype;
  }

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


  method('select', function() {

    var obj = {
      one:   1,
      two:   2,
      three: 3,
      four:  4,
      five:  5
    };

    var obj2 = { foo: obj };

    testStaticAndInstance(obj, ['one'], { one: 1 }, 'one key');
    testStaticAndInstance(obj, ['foo'], {}, 'nonexistent key');
    testStaticAndInstance(obj, ['one', 'two'], { one: 1 }, 'does not accept enumerated arguments');
    testStaticAndInstance(obj, [['four', 'two']], { two: 2, four: 4 }, 'accepts multiple from array');
    testStaticAndInstance(obj, [['one', 'foo']], { one: 1 }, 'one existing one non-existing');
    testStaticAndInstance(obj, [['four', 'two']], { two: 2, four: 4 }, 'keys out of order');
    testStaticAndInstance(obj, [/o/], { one: 1, two: 2, four: 4 }, 'regex');
    testStaticAndInstance(obj, [/o$/], { two: 2 }, 'regex $');
    testStaticAndInstance(obj, [/^o/], { one: 1 }, '^ regex');
    testStaticAndInstance(obj, [/z/], {}, 'non-matching regex');
    testStaticAndInstance(obj, [{one:1}], {one:1}, 'finding object keys');
    testStaticAndInstance(obj, [{one:'foo'}], {one:1}, 'should match if keys exist');
    testStaticAndInstance(obj, [{}], {}, 'empty object');
    testStaticAndInstance(obj, [[/^o/, /^f/]], { one: 1, four: 4, five: 5 }, 'complex nested array of regexes');

    testStaticAndInstance({a:1}, [{a:2}], {a:1}, 'selects keys in matcher object');
    testStaticAndInstance({a:1,b:2}, [{a:2}], {a:1}, 'does not select keys not in matcher');
    testStaticAndInstance({a:1}, [{a:2,b:3}], {a:1}, 'does not select keys not source');

    equal(run(Object, 'select', [obj2, 'foo']).foo, obj, 'selected values should be equal by reference');

    equal(typeof run(Object, 'select', [obj,  'one']).select, 'undefined', 'non-Hash should return non Hash');
    equal(typeof run(Object, 'select', [obj,  ['two', 'three']]).select, 'undefined', 'non-Hash should return non Hash');

    if (Sugar.Object.extended) {
      var obj3 = Sugar.Object.extended(obj);
      equal(typeof run(Object, 'select', [obj3, 'one']).select, 'function', 'Hash should return Hash');
      equal(typeof run(Object, 'select', [obj3, ['two', 'three']]).select, 'function', 'Hash should return Hash');
    }

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

    testStaticAndInstance(obj, ['one'], { two: 2, three: 3, four: 4, five: 5 }, 'one key');
    testStaticAndInstance(obj, ['foo'], obj, 'nonexistent key');
    testStaticAndInstance(obj, ['one', 'two'], { two: 2, three: 3, four: 4, five: 5 }, 'does not accept enumerated arguments');
    testStaticAndInstance(obj, [['four', 'two']], { one: 1, three: 3, five: 5 }, 'accepts multiple from array');
    testStaticAndInstance(obj, [['one', 'foo']], { two: 2, three: 3, four: 4, five: 5 }, 'one existing one non-existing');
    testStaticAndInstance(obj, [['four', 'two']], { one: 1, three: 3, five: 5 }, 'keys out of order');
    testStaticAndInstance(obj, [/o/], { three: 3, five: 5 }, 'regex');
    testStaticAndInstance(obj, [/o$/], { one: 1, three: 3, four: 4, five: 5 }, 'regex $');
    testStaticAndInstance(obj, [/^o/], { two: 2, three: 3, four: 4, five: 5 }, '^ regex');
    testStaticAndInstance(obj, [/z/], obj, 'non-matching regex');
    testStaticAndInstance(obj, [{one:1}], {two:2,three:3,four:4,five:5}, 'rejects matching key');
    testStaticAndInstance(obj, [{one:'foo'}], {two:2,three:3,four:4,five:5}, 'rejects matching key with different value');
    testStaticAndInstance(obj, [{}], obj, 'empty object');
    testStaticAndInstance(obj, [[/^o/, /^f/]], { two: 2, three: 3 }, 'complex nested array of regexes');

    testStaticAndInstance({a:1}, [{a:2}], {}, 'rejects keys in matcher object');
    testStaticAndInstance({a:1}, [{b:2}], {a:1}, 'does not reject keys not in matcher');
    testStaticAndInstance({a:1}, [{b:1}], {a:1}, 'does not reject keys not source');

    equal(run(Object, 'reject', [obj2, 'moo']).foo, obj, 'rejected values should be equal by reference');
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

    testStaticAndInstance(obj1, [function(k, v) { return v * 2; }], {foo:6,bar:8,moo:10,car:12}, 'function');
    testStaticAndInstance(obj1, ['toString'], {foo:'3',bar:'4',moo:'5',car:'6'}, 'string shortcut');
    testStaticAndInstance(obj1, [], obj1, 'no args');
    testStaticAndInstance(obj2, [function(k, v) { return v.age; }], {foo:11,bar:22,moo:33,car:44}, 'mapping nested properties');
    testStaticAndInstance(obj2, ['age'], {foo:11,bar:22,moo:33,car:44}, 'mapping nested properties with string shortcut');

    var obj = {
     foo:{a:{b:{c:11}}},
     bar:{a:{b:{c:22}}},
     moo:{a:{b:{c:33}}},
     car:{a:{b:{c:44}}}
    }

    testStaticAndInstance(obj, ['a.b.c'], {foo:11,bar:22,moo:33,car:44}, 'mapping shortcut can go deep with dot syntax');

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
      equal(key, keys[count], 'accepts a function');
      equal(value, values[count], 'accepts a function');
      equal(o, obj, 'accepts a function | object is third param');
      count++;
    }
    result = run(Object, 'each', [obj, callback]);
    equal(count, 4, 'accepts a function | iterated properly');
    equal(result, obj, 'accepts a function | result should equal object passed in');

    raisesError(function(){
      run(Object, 'each', [{foo:'bar'}]);
    }, 'no iterator raises an error');

    testStaticAndInstance(obj, [function () {}], obj, 'each returns itself');
  });

  method('size', function() {

    testStaticAndInstance({}, [], 0, 'empty object');
    testStaticAndInstance({foo:'bar'}, [], 1, '1 property');
    testStaticAndInstance({foo:'bar',moo:'car'}, [], 2, '2 properties');
    testStaticAndInstance({foo:1}, [], 1, 'numbers');
    testStaticAndInstance({foo:/bar/}, [], 1, 'regexes');
    testStaticAndInstance({foo:function(){}}, [], 1, 'functions');
    testStaticAndInstance({foo:{bar:'car'}}, [], 1, 'nested object');
    testStaticAndInstance({foo:[1]}, [], 1, 'nested array');
    testStaticAndInstance(['a'], [], 1, 'array');
    testStaticAndInstance(['a','b'], [], 2, 'array 2 elements');
    testStaticAndInstance(['a','b','c'], [], 3, 'array 3 elements');
    testStaticAndInstance('foo', [], 3, 'string primitive');
    testStaticAndInstance(new String('foo'), [], 3, 'string object');
    testStaticAndInstance(1, [], 0, 'number primitive');
    testStaticAndInstance(new Number(1), [], 0, 'number object');
    testStaticAndInstance(true, [], 0, 'boolean primitive');
    testStaticAndInstance(new Boolean(true), [], 0, 'boolean object');
    testStaticAndInstance(null, [], 0, 'null');
    testStaticAndInstance(undefined, [], 0, 'undefined');

    var Foo = function(){};
    testStaticAndInstance(new Foo, [], 0, 'class instances');

    var Foo = function(a){ this.a = a; };
    testStaticAndInstance(new Foo, [], 1, 'class instances with a single property');

  });

  method('sum', function() {
    testStaticAndInstance(obj1, [], 18, 'no args is sum of values');
    testStaticAndInstance(obj1, [function(key, value) { return value; }], 18, 'should sum values');
    testStaticAndInstance(obj1, [function(key, value) { return key === 'foo' ? 0 : value; }], 16, 'without foo');
    testStaticAndInstance(obj2, ['age'], 110, 'accepts a string shortcut');
    testStaticAndInstance(deepObj2, ['user.age'], 110, 'accepts a deep string shortcut');
    test([{age:2},{age:3}], ['age'], 5, 'called on arrays should still work');
  });

  method('average', function() {
    testStaticAndInstance(obj1, [], 4.5, 'no args is average of values');
    testStaticAndInstance(obj1, [function(key, value) { return value; }], 4.5, 'should average values');
    testStaticAndInstance(obj1, [function(key, value) { return key === 'foo' ? 0 : value; }], 4, 'without foo');
    testStaticAndInstance(obj2, ['age'], 27.5, 'accepts a string shortcut');
    testStaticAndInstance(deepObj2, ['user.age'], 27.5, 'accepts a deep string shortcut');
    test([{age:2},{age:4}], ['age'], 3, 'called on arrays should still work');
  });

  method('median', function() {
    testStaticAndInstance(obj1, [], 5, 'no args is average of values');
    testStaticAndInstance(obj1, [function(key, value) { return value; }], 5, 'should average values');
    testStaticAndInstance(obj1, [function(key, value) { return key === 'moo' ? 0 : value; }], 3, 'without moo');
    testStaticAndInstance(obj2, ['age'], 27.5, 'accepts a string shortcut');
    testStaticAndInstance(deepObj2, ['user.age'], 27.5, 'accepts a deep string shortcut');
    test([{age:2},{age:2},{age:4}], ['age'], 2, 'called on arrays should still work');
  });

  method('min', function() {
    testStaticAndInstance(obj3, [], 'foo', 'no args is min of values');
    testStaticAndInstance(obj3, [function(key, value) { return value; }], 'foo', 'return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }], 'foo', 'return key.length');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }, true], {foo:2,bar:4,moo:6,car:6}, 'return key.length');
    testStaticAndInstance(obj3, [function(key, value) { return key.charCodeAt(0); }, true], {bar: 4,blue:4}, 'all | return the char code of first letter');
    testStaticAndInstance(obj4, ['age'], 'foo', 'accepts a string shortcut');
    testStaticAndInstance(obj4, ['age', true], {foo: {age:11},blue:{age:11}}, 'all | accepts a string shortcut');
    testStaticAndInstance(deepObj2, ['user.age'], 'foo', 'accepts a deep string shortcut');

    if (!arrayMinExtended()) {
      test([{age:2},{age:4}], ['age'], '0', 'called on arrays returns index');
      test([{age:2},{age:2}], ['age', true], {'0':{age:2},'1':{age:2}}, 'all | called on arrays returns object');
    }
  });

  method('max', function() {
    testStaticAndInstance(obj3, [], 'moo', 'no args is first object');
    testStaticAndInstance(obj3, [function(key, value) { return value; }], 'moo', 'return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }], 'blue', 'return key.length');
    testStaticAndInstance(obj3, [function(key, value) { return key.charCodeAt(0); }], 'moo', 'return the char code of first letter');
    testStaticAndInstance(obj4, ['age'], 'car', 'accepts a string shortcut');
    testStaticAndInstance(obj3, [function(key, value) { return value; }, true], {moo:6,car:6}, 'all | return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }, true], {blue:4}, 'all | return key.length');
    testStaticAndInstance(obj3, [function(key, value) { return key.charCodeAt(0); }, true], {moo:6}, 'all | return the char code of first letter');
    testStaticAndInstance(obj4, ['age', true], {car:{age:44}}, 'all | accepts a string shortcut');
    testStaticAndInstance(deepObj2, ['user.age'], 'car', 'accepts a deep string shortcut');

    if (!arrayMinExtended()) {
      test([{age:2},{age:4}], ['age'], '1', 'called on arrays returns index');
      test([{age:2},{age:4}], ['age', true], {'1':{age:4}}, 'all | called on arrays returns object');
    }
  });

  method('least', function() {
    testStaticAndInstance(obj3, [], 'foo', 'no args is least of values');
    testStaticAndInstance(obj3, [function(key, value) { return value; }], 'foo', 'return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }], 'blue', 'return key.length');
    testStaticAndInstance(obj4, ['age'], 'bar', 'accepts a string shortcut');
    testStaticAndInstance(obj3, [function(key, value) { return value; }, true], {foo:2}, 'all | return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }, true], {blue:4}, 'all | return key.length');
    testStaticAndInstance(obj4, ['age', true], {bar: {age:22},moo:{age:33},car:{age:44}}, 'all | accepts a string shortcut');
    testStaticAndInstance(deepObj4, ['user.age',true], {bar:{user:{age:22}},moo:{user:{age:33}},car:{user:{age:44}}}, 'all | accepts a deep string shortcut');
  });

  method('most', function() {
    testStaticAndInstance(obj3, [], 'bar', 'no args is most of values');
    testStaticAndInstance(obj3, [function(key, value) { return value; }], 'bar', 'return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }], 'foo', 'return key.length');
    testStaticAndInstance(obj3, [function(key, value) { return key.charCodeAt(0); }], 'bar', 'return the char code of first letter');
    testStaticAndInstance(obj4, ['age'], 'foo', 'accepts a string shortcut');
    testStaticAndInstance(obj3, [function(key, value) { return value; }, true], {bar:4,blue:4,moo:6,car:6}, 'all | return value');
    testStaticAndInstance(obj3, [function(key, value) { return key.length; }, true], {foo:2,bar:4,moo:6,car:6}, 'all | return key.length');
    testStaticAndInstance(obj3, [function(key, value) { return key.charCodeAt(0); }, true], {bar: 4,blue:4}, 'all | return the char code of first letter');
    testStaticAndInstance(obj4, ['age', true], {foo: {age:11},blue:{age:11}}, 'all | accepts a string shortcut');
    testStaticAndInstance(deepObj4, ['user.age', true], {foo:{user:{age:11}},blue:{user:{age:11}}}, 'all | accepts a deep string shortcut');
  });

  method('some', function() {
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], true, 'key is foo');
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
    testStaticAndInstance(obj1, [2], true,  'shortcut | 2');
    testStaticAndInstance(obj1, [7], false, 'shortcut | 7');
  });

  method('any', function() {
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], true, 'key is foo');
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
    testStaticAndInstance(obj1, [2], true,  'shortcut | 2');
    testStaticAndInstance(obj1, [7], false, 'shortcut | 7');
  });

  method('every', function() {
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], false, 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 3; }], false, 'key length is greater than 3');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 0; }], true, 'key length is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 0; }], true, 'value is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 5; }], false, 'value is greater than 5');
    testStaticAndInstance(obj1, [function(key, value) { return value > 6; }], false, 'value is greater than 6');
    testStaticAndInstance(obj1, [2], false,  'shortcut | 2');
    testStaticAndInstance(obj1, [7], false, 'shortcut | 7');
  });

  method('all', function() {
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], false, 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 3; }], false, 'key length is greater than 3');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 0; }], true, 'key length is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 0; }], true, 'value is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 5; }], false, 'value is greater than 5');
    testStaticAndInstance(obj1, [function(key, value) { return value > 6; }], false, 'value is greater than 6');
    testStaticAndInstance(obj1, [2], false,  'shortcut | 2');
    testStaticAndInstance(obj1, [7], false, 'shortcut | 7');
  });

  method('find', function() {
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], 'foo', 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 3; }], undefined, 'key length is greater than 3');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 0; }], 'foo', 'key length is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 0; }], 'foo', 'value is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 5; }], 'moo', 'value is greater than 5');
    testStaticAndInstance(obj1, [function(key, value) { return value > 6; }], undefined, 'value is greater than 6');
    testStaticAndInstance(obj1, [2], 'foo',  'shortcut | 2');
    testStaticAndInstance(obj1, [7], undefined, 'shortcut | 7');
    testStaticAndInstance({foo:'bar'}, [/b/], 'foo', 'uses multi-match');
  });

  method('filter', function() {
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], {foo:2}, 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 3; }], {}, 'key length is greater than 3');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 0; }], obj1, 'key length is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 0; }], obj1, 'value is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 5; }], {moo:6,car:6}, 'value is greater than 5');
    testStaticAndInstance(obj1, [function(key, value) { return value > 6; }], {}, 'value is greater than 6');
    testStaticAndInstance(obj1, [2], {foo:2},  'shortcut | 2');
    testStaticAndInstance(obj1, [7], {}, 'shortcut | 7');
    testStaticAndInstance({foo:'bar',moo:'car'}, [/a/], {foo:'bar',moo:'car'}, 'uses multi-match');
  });

  method('count', function() {
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], 1, 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 3; }], 0, 'key length is greater than 3');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 0; }], 4, 'key length is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 0; }], 4, 'value is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 5; }], 2, 'value is greater than 5');
    testStaticAndInstance(obj1, [function(key, value) { return value > 6; }], 0, 'value is greater than 6');
    testStaticAndInstance(obj1, [2], 1,  'shortcut | 2');
    testStaticAndInstance(obj1, [7], 0, 'shortcut | 7');
  });

  method('none', function() {
    testStaticAndInstance(obj1, [function(key, value) { return key == 'foo'; }], false, 'key is foo');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 3; }], true, 'key length is greater than 3');
    testStaticAndInstance(obj1, [function(key, value) { return key.length > 0; }], false, 'key length is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 0; }], false, 'value is greater than 0');
    testStaticAndInstance(obj1, [function(key, value) { return value > 5; }], false, 'value is greater than 5');
    testStaticAndInstance(obj1, [function(key, value) { return value > 6; }], true, 'value is greater than 6');
    testStaticAndInstance(obj1, [2], false,  'shortcut | 2');
    testStaticAndInstance(obj1, [7], true, 'shortcut | 7');
  });

  group('Enumerables on Object.prototype', function() {
    storeNativeState();
    Sugar.Object.extend({
      objectInstance: true
    });

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
    equal(({a:1,b:2,c:3}).filter(3), {c:3}, 'Object#filter');
    equal(({a:1,b:2,c:3}).find(3), 'c', 'Object#find');

    equal(({a:'a',b:'b',c:'c'}).filter(/[ac]/), {a:'a',c:'c'}, 'Object#filter');
    equal(({}).isEmpty(), true, 'Object#isEmpty');
    equal(({a:1}).isEmpty(), false, 'Object#isEmpty');

    restoreNativeState();
  });

});
