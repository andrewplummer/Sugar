
test('Array', function () {

  var arr, expected, expectedIndexes, count, f1 = function(){}, f2 = function(){};
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


  arr = [1,2,3];
  count = 0;

  for(var key in arr){
    count++;
  }

  equalWithWarning(count, 3, 'for..in loops will break on arrays.');


  equal(['a','b','c'].indexOf('b'), 1, 'Array#indexOf | b in a,b,c');
  equal(['a','b','c'].indexOf('b', 0), 1, 'Array#indexOf | b in a,b,c from 0');
  equal(['a','b','c'].indexOf('a'), 0, 'Array#indexOf | a in a,b,c');
  equal(['a','b','c'].indexOf('f'), -1, 'Array#indexOf | f in a,b,c');

  equal(['a','b','c','b'].indexOf('b'), 1, 'Array#indexOf | finds first instance');
  equal(['a','b','c','b'].indexOf('b', 2), 3, 'Array#indexOf | finds first instance from index');

  equal([5,2,4].indexOf(5), 0, 'Array#indexOf | 5 in 5,2,4');
  equal([5,2,4].indexOf(2), 1, 'Array#indexOf | 2 in 5,2,4');
  equal([5,2,4].indexOf(4), 2, 'Array#indexOf | 4 in 5,2,4');
  equal([5,2,4,4].indexOf(4, 3), 3, 'Array#indexOf | 4 in 5,2,4,4 from index 3');

  equal([5,2,4,4].indexOf(4, 10), -1, 'Array#indexOf | 4 in 5,2,4,4 from index 10');
  equal([5,2,4,4].indexOf(4, -10), 2, 'Array#indexOf | 4 in 5,2,4,4 from index -10');
  equal([5,2,4,4].indexOf(4, -1), 3, 'Array#indexOf | 4 in 5,2,4,4 from index -1');

  equal([{ foo: 'bar' }].indexOf({ foo: 'bar' }), -1, 'Array#indexOf | will not find deep objects (use findIndex)');
  equal([{ foo: 'bar' }].indexOf(function(a) { return a.foo === 'bar'; }), -1, 'Array#indexOf | will not run against a function (use findIndex)');

  equal(['a','b','c','d','a','b'].lastIndexOf('b'), 5, 'Array#lastIndexOf | b');
  equal(['a','b','c','d','a','b'].lastIndexOf('b', 4), 1, 'Array#lastIndexOf | b from index 4');
  equal(['a','b','c','d','a','b'].lastIndexOf('z'), -1, 'Array#lastIndexOf | z');

  equal([1,5,6,8,8,2,5,3].lastIndexOf(3), 7, 'Array#lastIndexOf | 1,5,6,8,8,2,5,3 | 3');
  equal([1,5,6,8,8,2,5,3].lastIndexOf(3, 0), -1, 'Array#lastIndexOf | 1,5,6,8,8,2,5,3 | 3 from index 0');
  equal([1,5,6,8,8,2,5,3].lastIndexOf(8), 4, 'Array#lastIndexOf | 1,5,6,8,8,2,5,3 | 8');
  equal([1,5,6,8,8,2,5,3].lastIndexOf(8, 3), 3, 'Array#lastIndexOf | 1,5,6,8,8,2,5,3 | 8 from index 3');
  equal([1,5,6,8,8,2,5,3].lastIndexOf(1), 0, 'Array#lastIndexOf | 1,5,6,8,8,2,5,3 | 1');
  equal([1,5,6,8,8,2,5,3].lastIndexOf(42), -1, 'Array#lastIndexOf | 1,5,6,8,8,2,5,3 | 42');

  equal([2,5,9,2].lastIndexOf(2), 3, 'Array#lastIndexOf | 2,5,9,2 | 2');
  equal([2,5,9,2].lastIndexOf(7), -1, 'Array#lastIndexOf | 2,5,9,2 | 7');
  equal([2,5,9,2].lastIndexOf(2, 3), 3, 'Array#lastIndexOf | 2,5,9,2 | 2 from index 3');
  equal([2,5,9,2].lastIndexOf(2, 2), 0, 'Array#lastIndexOf | 2,5,9,2 | 2 from index 2');
  equal([2,5,9,2].lastIndexOf(2, -2), 0, 'Array#lastIndexOf | 2,5,9,2 | 2 from index -2');
  equal([2,5,9,2].lastIndexOf(2, -1), 3, 'Array#lastIndexOf | 2,5,9,2 | 2 from index -1');
  equal([2,5,9,2].lastIndexOf(2, -10), -1, 'Array#lastIndexOf | 2,5,9,2 | 2 from index -10');

  // Prototype's "lastIndexOf" apparently doesn't pass this particular test.
  //equal([2,5,9,2].lastIndexOf(2, 10), 3, 'Array#lastIndexOf | 2,5,9,2 | 2 from index 10', { prototype: (jQuery.browser.msie ? 10 : 3) });

  equal([{ foo: 'bar' }].lastIndexOf({ foo: 'bar' }), -1, 'Array#lastIndexOf | will not find deep objects (use findIndex)');
  equal([{ foo: 'bar' }].lastIndexOf(function(a) { return a.foo === 'bar'; }), -1, 'Array#lastIndexOf | will not run against a function (use findIndex)');



  equal([1,1,1].every(1), true, 'Array#every | accepts a number shortcut match');
  equal([1,1,2].every(1), false, 'Array#every | accepts a number shortcut no match');
  equal(['a','a','a'].every('a'), true, 'Array#every | accepts a string shortcut match');
  equal(['a','b','a'].every('a'), false, 'Array#every | accepts a string shortcut no match');
  equal(['a','b','c'].every(/[a-f]/), true, 'Array#every | accepts a regex shortcut match');
  equal(['a','b','c'].every(/[m-z]/), false, 'Array#every | accepts a regex shortcut no match');
  equal([{a:1},{a:1}].every({a:1}), true, 'Array#every | checks objects match');
  equal([{a:1},{a:2}].every({a:1}), false, 'Array#every | checks object no match');

  equal([12,5,8,130,44].every(function(el, i, a) { return el >= 10; }), false, 'Array#every | not every element is greater than 10');
  equal([12,54,18,130,44].every(function(el, i, a) { return el >= 10; }), true, 'Array#every | every element is greater than 10');

  equal(arrayOfUndefined.every(undefined), true, 'Array#every | all undefined');
  equal(arrayOfUndefined.clone().add('a').every(undefined), false, 'Array#every | every undefined');
  equal(['a', 'b'].every(undefined), false, 'Array#every | none undefined');

  ['a'].every(function(el, i, a) {
    equal(el, 'a', 'Array#every | First parameter is the element');
    equal(i, 0, 'Array#every | Second parameter is the index');
    equal(a, ['a'], 'Array#every | Third parameter is the array', { prototype: undefined });
    equal(this.toString(), 'this', 'Array#every | Scope is passed properly');
  }, 'this');


  equal([{name:'john',age:25}].all({name:'john',age:25}), true, 'Array#all | handles complex objects', { prototype: false });
  equal([{name:'john',age:25},{name:'fred',age:85}].all('age'), false, 'Array#all | simple string mistakenly passed for complex objects');
  equal([{name:'john',age:25},{name:'fred',age:85}].all({name:'john',age:25}), false, "Array#all | john isn't all");



  equal([1,2,3].some(1), true, 'Array#some | accepts a number shortcut match');
  equal([2,3,4].some(1), false, 'Array#some | accepts a number shortcut no match');
  equal(['a','b','c'].some('a'), true, 'Array#some | accepts a string shortcut match');
  equal(['b','c','d'].some('a'), false, 'Array#some | accepts a string shortcut no match');
  equal(['a','b','c'].some(/[a-f]/), true, 'Array#some | accepts a regex shortcut match');
  equal(['a','b','c'].some(/[m-z]/), false, 'Array#some | accepts a regex shortcut no match');
  equal([{a:1},{a:2}].some({a:1}), true, 'Array#some | checks objects match');
  equal([{a:2},{a:3}].some({a:1}), false, 'Array#some | checks object no match');

  equal([12,5,8,130,44].some(function(el, i, a) { return el > 10 }), true, 'Array#some | some elements are greater than 10');
  equal([12,5,8,130,44].some(function(el, i, a) { return el < 10 }), true, 'Array#some | some elements are less than 10');
  equal([12,54,18,130,44].some(function(el, i, a) { return el >= 10 }), true, 'Array#some | all elements are greater than 10');
  equal([12,5,8,130,44].some(function(el, i, a) { return el < 4 }), false, 'Array#some | no elements are less than 4');


  equal(arrayOfUndefined.some(undefined), true, 'Array#some | all undefined');
  equal(arrayOfUndefined.clone().add('a').some(undefined), true, 'Array#some | some undefined');
  equal(['a', 'b'].some(undefined), false, 'Array#some | none undefined');



  equal([].some(function(el, i, a) { return el > 10 }), false, 'Array#some | no elements are greater than 10 in an empty array');
  ['a'].some(function(el, i, a) {
    equal(el, 'a', 'Array#some | first parameter is the element');
    equal(i, 0, 'Array#some | second parameter is the index');
    equal(a, ['a'], 'Array#some | third parameter is the array', { prototype: undefined });
    equal(this.toString(), 'this', 'Array#some | scope is passed properly');
  }, 'this');

  equal([{name:'john',age:25}].some({name:'john',age:25}), true, 'Array#every | handles complex objects');
  equal([{name:'john',age:25},{name:'fred',age:85}].some('age'), false, 'Array#some | simple string mistakenly passed for complex objects');
  equal([{name:'john',age:25},{name:'fred',age:85}].some({name:'john',age:25}), true, 'Array#some | john can be found ');




  equal([1,2,3].filter(1), [1], 'Array#filter | accepts a number shortcut match');
  equal([2,3,4].filter(1), [], 'Array#filter | accepts a number shortcut no match');
  equal(['a','b','c'].filter('a'), ['a'], 'Array#filter | accepts a string shortcut match');
  equal(['b','c','d'].filter('a'), [], 'Array#filter | accepts a string shortcut no match');
  equal(['a','b','c'].filter(/[a-f]/), ['a','b','c'], 'Array#filter | accepts a regex shortcut match');
  equal(['a','b','c'].filter(/[m-z]/), [], 'Array#filter | accepts a regex shortcut no match');
  equal([{a:1},{a:2}].filter({a:1}), [{a:1}], 'Array#filter | checks objects match');
  equal([{a:2},{a:3}].filter({a:1}), [], 'Array#filter | checks object no match');

  equal([12,4,8,130,44].filter(function(el, i, a) { return el > 10 }), [12,130,44], 'Array#filter | numbers above 10');
  equal([12,4,8,130,44].filter(function(el, i, a) { return el < 10 }), [4,8], 'Array#filter | numbers below 10');
  ['a'].filter(function(el, i, a) {
    equal(el, 'a', 'Array#filter | first parameter is the element');
    equal(i, 0, 'Array#filter | second parameter is the index');
    equal(a, ['a'], 'Array#filter | third parameter is the array', { prototype: undefined });
    equal(this.toString(), 'this', 'Array#filter | scope is passed properly');
  }, 'this');


  equal([{name:'john',age:25},{name:'fred',age:85}].filter('age'), [], 'Array#filter | simple string mistakenly passed for complex objects');
  equal([{name:'john',age:25},{name:'fred',age:85}].filter({name:'john',age:25}), [{name:'john',age:25}], 'Array#filter | filtering john');
  equal([{name:'john',age:25},{name:'fred',age:85}].filter({name:'fred',age:85}), [{name:'fred',age:85}], 'Array#filter | filtering fred');


  arr = [2, 5, 9];
  arr.forEach(function(el, i, a) {
    equal(el, a[i], 'Array#forEach | looping successfully');
  });

  arr = ['a', [1], { foo: 'bar' }, 352];
  count = 0;
  arr.forEach(function(el, i, a) {
      count++;
  });
  equal(count, 4, 'Array#forEach | complex array | should have looped 4 times');

  ['a'].forEach(function(el, i, a) {
    equal(el, 'a', 'Array#forEach | first parameter is the element');
    equal(i, 0, 'Array#forEach | second parameter is the index');
    equal(this.toString(), 'this', 'Array#forEach | scope is passed properly');
  }, 'this');




  // Array#each now splits functionality from forEach

  arr = [2, 5, 9];
  arr.each(function(el, i, a) {
    equal(el, arr[i], 'Array#each | looping successfully');
  });

  arr = ['a', [1], { foo: 'bar' }, 352];
  count = 0;
  arr.each(function() {
      count++;
  });
  equal(count, 4, 'Array#each | complex array | should have looped 4 times');

  ['a'].each(function(el, i, a) {
    equal(el, 'a', 'Array#each | first parameter is the element');
    equal(i, 0, 'Array#each | second parameter is the index');
    equal(a, ['a'], 'Array#each | third parameter is the array', { prototype: undefined });
    // Note: psychotic syntax here because equal() is now strictly equal, and the this object is actually an "object" string
    // as opposed to a primitive string, but only in Prototype. Calling .toString() in a non-prototype environment would effectively
    // try to convert the array to a string, which is also not what we want.
    equal(this, a, 'Array#each | scope is also the array', { prototype: (function(){ return this; }).call('this'), mootools: 'this' });
  }, 'this');



  equal(['foot','goose','moose'].map(function(el) { return el.replace(/o/g, 'e'); }), ['feet', 'geese', 'meese'], 'Array#map | with regexp');
  // cool!
  equal([1,4,9].map(Math.sqrt), [1,2,3], 'Array#map | passing Math.sqrt directly');
  equal([{ foo: 'bar' }].map(function(el) { return el['foo']; }), ['bar'], 'Array#map | with key "foo"');

  ['a'].map(function(el, i, a) {
    equal(el, 'a', 'Array#map | first parameter is the element');
    equal(i, 0, 'Array#map | second parameter is the index');
    equal(a, ['a'], 'Array#map | third parameter is the array', { prototype: undefined });
    equal(this.toString(), 'this', 'Array#map | scope is passed properly');
  }, 'this');


  equal(['foot','goose','moose'].map('length'), [4,5,5], 'Array#map | length');
  equal([{name:'john',age:25},{name:'fred',age:85}].map('age'), [25,85], 'Array#map | age');
  equal([{name:'john',age:25},{name:'fred',age:85}].map('name'), ['john','fred'], 'Array#map | name');
  equal([{name:'john',age:25},{name:'fred',age:85}].map('cupsize'), [undefined, undefined], 'Array#map | (nonexistent) cupsize');
  equal([].map('name'), [], 'Array#map');

  equal([1,2,3].map('toString'), ['1','2','3'], 'Array#map | calls a function on a shortcut string');

  raisesError(function(){ [1,2,3].map() }, 'Array#map | raises an error if no argument', { prototype: false });

  equal([1,2,3].map(undefined), [1,2,3], 'Array#map | undefined');
  equal([1,2,3].map(null), [undefined, undefined, undefined], 'Array#map | null');
  equal([1,2,3].map(4), [undefined, undefined, undefined], 'Array#map | number');



  equal([0,1,2,3,4].reduce(function(a,b) { return a + b; }), 10, 'Array#reduce | a + b');
  equal([[0,1],[2,3],[4,5]].reduce(function(a,b) { return a.concat(b); }, []), [0,1,2,3,4,5], 'Array#reduce | concat');
  ['a'].reduce(function(p, c, i, a) {
    equal(p, 'c', 'Array#reduce | a | first parameter is the lhs');
    equal(c, 'a', 'Array#reduce | a | second parameter is the rhs');
    equal(i, 0, 'Array#reduce | a | third parameter is the index');
    equal(a, ['a'], 'Array#reduce | a | fourth parameter is the array');
  }, 'c');
  [55,66].reduce(function(p, c, i, a) {
    equal(p, 55, 'Array#reduce | 55,66 | first parameter is the lhs');
    equal(c, 66, 'Array#reduce | 55,66 | second parameter is the rhs');
    equal(i, 1, 'Array#reduce | 55,66 | third parameter is the index');
    equal(a, [55,66], 'Array#reduce | 55,66 | fourth parameter is the array');
  });
  [1].reduce(function(p, c, i, a) {
    // This assertion should never be called.
    equal(true, false, 'Array#reduce | one element array with no rhs passed in does not iterate');
  });
  equal([1].reduce(function() {}), 1, 'Array#reduce | [1] reduces to 1');


  equal([0,1,2,3,4].reduceRight(function(a,b) { return a + b; }), 10, 'Array#reduceRight | a + b');
  equal([[0,1],[2,3],[4,5]].reduceRight(function(a,b) { return a.concat(b); }, []), [4,5,2,3,0,1], 'Array#reduceRight | concat');
  ['a'].reduceRight(function(p, c, i, a) {
    equal(p, 'c', 'Array#reduceRight | a | first parameter is the lhs');
    equal(c, 'a', 'Array#reduceRight | a | second parameter is the rhs');
    equal(i, 0, 'Array#reduceRight | a | third parameter is the index');
    equal(a, ['a'], 'Array#reduceRight | a | fourth parameter is the array');
  }, 'c');
  [55,66].reduceRight(function(p, c, i, a) {
    equal(p, 66, 'Array#reduceRight | 55,66 | first parameter is the lhs');
    equal(c, 55, 'Array#reduceRight | 55,66 | second parameter is the rhs');
    equal(i, 0, 'Array#reduceRight | 55,66 | third parameter is the index');
    equal(a, [55,66], 'Array#reduceRight | 55,66 | fourth parameter is the array');
  });
  [1].reduceRight(function(p, c, i, a) {
    // This assertion should never be called.
    equal(true, false, 'Array#reduceRight | one element array with no rhs passed in does not iterate');
  });
  equal([1].reduceRight(function() {}), 1, 'Array#reduceRight | [1] reduces to 1');


  var result = [];
  var count = 0;
  ['a','b','c'].each(function(s, i) {
    result.push(s);
    equal(i, count + 1, 'Array#each | index should be correct', { prototype: count, mootools: count });
    count++;
  }, 1);

  equal(count, 2, 'Array#each | should have run 2 times', { prototype: 3, mootools: 3 });
  equal(result, ['b','c'], 'Array#each | result', { prototype: ['a','b','c'], mootools: ['a','b','c'] });


  result = [];
  indexes = [1,2,0];
  count = 0;
  ['a','b','c'].each(function(s, i) {
    result.push(s);
    equal(i, indexes[count], 'Array#each | looping from index 1 | index should be correct', { prototype: indexes.at(count - 1), mootools: indexes.at(count - 1) })
    count++;
  }, 1, true);

  equal(count, 3, 'Array#each | looping from index 1 | should have run 3 times')
  equal(result, ['b','c','a'], 'Array#each | looping from index 1 | result', { prototype: ['a','b','c'], mootools: ['a','b','c'] });


  result = [];
  indexes = [0,1,2];
  count = 0;
  ['a','b','c'].each(function(s, i) {
    result.push(s);
    equal(i, indexes[count], 'Array#each | looping from index 0 | index should be correct')
    count++;
  }, 0, true);

  equal(count, 3, 'Array#each | looping from index 0 | should have run 3 times')
  equal(result, ['a','b','c'], 'Array#each | looping from index 0 | result');



  result = [];
  indexes = [2,0,1];
  count = 0;
  ['a','b','c'].each(function(s, i) {
    result.push(s);
    equal(i, indexes[count], 'Array#each | looping from index 2 | index should be correct', { prototype: indexes.at(count + 1), mootools: indexes.at(count + 1) })
    count++;
  }, 2, true);

  equal(count, 3, 'Array#each | looping from index 2 | should have run 3 times')
  equal(result, ['c','a','b'], 'Array#each | looping from index 2 | result', { prototype: ['a','b','c'], mootools: ['a','b','c'] });



  result = [];
  count = 0;
  ['a','b','c'].each(function(s, i) {
    result.push(s);
    count++;
  }, 3, true);

  equal(count, 3, 'Array#each | looping from index 3 | should have run 3 times')
  equal(result, ['a','b','c'], 'Array#each | looping from index 3 | result');



  result = [];
  count = 0;
  ['a','b','c'].each(function(s, i) {
    result.push(s);
    count++;
  }, 4, true);

  equal(count, 3, 'Array#each | looping from index 4 | should have run 3 times')
  equal(result, ['b','c','a'], 'Array#each | looping from index 4 | result', { prototype: ['a','b','c'], mootools: ['a','b','c'] });



  result = [];
  count = 0;
  ['a','b','c'].each(function(s, i) {
    result.push(s);
    count++;
  }, 49, true);

  equal(count, 3, 'Array#each | looping from index 49 | should have run 3 times')
  equal(result, ['b','c','a'], 'Array#each | looping from index 49 | result', { prototype: ['a','b','c'], mootools: ['a','b','c'] });



  result = [];
  count = 0;
  ['a','b','c'].each(function(s, i) {
    result.push(s);
    count++;
  }, 'hoofa');

  equal(count, 3, 'Array#each | string index should default to 0 | should have run 3 times')
  equal(result, ['a','b','c'], 'Array#each | string index should default to 0 | result');


  equal(['a','b','c'].each(function(){}), ['a','b','c'], 'Array#each | null function returns the array');
  raisesError(function(){ [1].each() }, 'Array#each | raises an error if no callback');

  count = 0;
  ['a','b','c'].each(function() {
    count++;
    return false;
  });
  equal(count, 1, 'Array#each | returning false will break the loop', { prototype: 3, mootools: 3 });

  count = 0;
  ['a','b','c'].each(function() {
    count++;
    return true;
  });
  equal(count, 3, 'Array#each | returning true will not break the loop');

  count = 0;
  ['a','b','c'].each(function() {
    count++;
    return;
  });
  equal(count, 3, 'Array#each | returning undefined will not break the loop');


  // Sparse array handling with Array#each
  // These tests cannot be run with Prototype/Mootools, as they will lock the browser

  skipEnvironments(['prototype','mootools'], function() {

    arr = ['a'];
    arr[Math.pow(2,32) - 2] = 'b';
    expected = ['a','b'];
    expectedIndexes = [0, Math.pow(2,32) - 2];
    count = 0;
    arr.each(function(el, i, a) {
      equal(this, arr, 'Array#each | sparse arrays | this object should be the array');
      equal(el, expected[count], 'Array#each | sparse arrays | first argument should be the current element');
      equal(i, expectedIndexes[count], 'Array#each | sparse arrays | second argument should be the current index');
      equal(a, arr, 'Array#each | sparse arrays | third argument should be the array');
      count++;
    });
    equal(count, 2, 'Array#each | sparse arrays | count should match');


    arr = [];
    arr[-2] = 'd';
    arr[2]  = 'f';
    arr[Math.pow(2,32)] = 'c';
    count = 0;
    arr.each(function(el, i) {
      equal(el, 'f', 'Array#each | sparse arrays | values outside range are not iterated over | el');
      equal(i, 2, 'Array#each | sparse arrays | values outside range are not iterated over | index');
      count++;
    });
    equal(count, 1, 'Array#each | sparse arrays | values outside range are not iterated over | count');

  });



  arr = [];
  arr[9] = 'd';
  arr[2] = 'f';
  arr[5] = 'c';
  count = 0;
  expected = ['f','c','d'];
  expectedIndexes = [2,5,9];
  arr.each(function(el, i) {
    equal(el, expected[count], 'Array#each | sparse arrays | elements are in expected order');
    // TODO REWORK THIS AS IT SHOULD BE STRICT!!
    equal(i, expectedIndexes[count], 'Array#each | sparse arrays | index is in expected order', { prototype: count });
    count++;
  });
  equal(count, 3, 'Array#each | sparse arrays | unordered array should match');


  count = 0;
  arrayOfUndefined.each(function() {
    count++;
  });
  equal(count, 3, 'Array#each | however, simply having an undefined in an array does not qualify it as sparse');



  equal(['a','b','c'].find('a'), 'a', 'Array#find | a');
  equal(['a','a','c'].find('a'), 'a', 'Array#find | first a');
  equal(['a','b','c'].find('q'), undefined, 'Array#find | q');
  equal([1,2,3].find(1), 1, 'Array#find | 1');
  equal([2,2,3].find(2), 2, 'Array#find | 2');
  equal([1,2,3].find(4), undefined, 'Array#find | 4');
  equal([{a:1},{b:2},{c:3}].find({a:1}), {a:1}, 'Array#find | a:1', { prototype: undefined });
  equal([{a:1},{a:1},{c:3}].find({a:1}), {a:1}, 'Array#find | first a:1', { prototype: undefined });
  equal([{a:1},{b:2},{c:3}].find({d:4}), undefined, 'Array#find | d:4');
  equal([{a:1},{b:2},{c:3}].find({c:4}), undefined, 'Array#find | c:4');
  equal([[1,2],[2,3],[4,5]].find([2,3]), [2,3], 'Array#find | 2,3', { prototype: undefined });
  equal([[1,2],[2,3],[4,5]].find([2,4]), undefined, 'Array#find | 2,4');
  equal([[1,2],[2,3],[2,3]].find([2,3]), [2,3], 'Array#find | first 2,3', { prototype: undefined });
  equal(['foo','bar'].find(/f+/), 'foo', 'Array#find | /f+/', { prototype: undefined });
  equal(['foo','bar'].find(/[a-f]/), 'foo', 'Array#find | /a-f/', { prototype: undefined });
  equal(['foo','bar'].find(/[a-f]/, 1), 'bar', 'Array#find | /a-f/ from index 1', { prototype: undefined });
  equal(['foo','bar'].find(/q+/), undefined, 'Array#find | /q+/');
  equal([1,2,3].find(function(e) { return e > 0; }, 0), 1, 'Array#find | greater than 0 from index 0');
  equal([1,2,3].find(function(e) { return e > 0; }, 1), 2, 'Array#find | greater than 0 from index 1', { prototype: 1 });
  equal([1,2,3].find(function(e) { return e > 0; }, 2), 3, 'Array#find | greater than 0 from index 2', { prototype: 1 });
  equal([1,2,3].find(function(e) { return e > 0; }, 3), undefined, 'Array#find | greater than 0 from index 3', { prototype: 1 });
  equal([1,2,3].find(function(e) { return e > 1; }, 0), 2, 'Array#find | greater than 1 from index 0');
  equal([1,2,3].find(function(e) { return e > 1; }, 1), 2, 'Array#find | greater than 1 from index 1');
  equal([1,2,3].find(function(e) { return e > 1; }, 2), 3, 'Array#find | greater than 1 from index 2', { prototype: 2 });
  equal([1,2,3].find(function(e) { return e > 2; }, 0), 3, 'Array#find | greater than 2 from index 0');
  equal([1,2,3].find(function(e) { return e > 3; }, 0), undefined, 'Array#find | greater than 3 from index 0');

  equal([{a:10},{a:8},{a:3}].find(function(e) { return e['a'] > 5; }, 0), {a:10}, 'Array#find | key "a" greater than 5');
  equal([{a:10},{a:8},{a:3}].find(function(e) { return e['a'] > 5; }, 1), {a:8}, 'Array#find | key "a" greater than 5 from index 1', { prototype: {a:10} });
  equal([{a:10},{a:8},{a:3}].find(function(e) { return e['a'] > 5; }, 2), undefined, 'Array#find | key "a" greater than 5 from index 2', { prototype: {a:10} });
  equal([function() {}].find(function(e) {}, 0), undefined, 'Array#find | undefined function');
  equal([function() {}].find(function(e) {}, 1), undefined, 'Array#find | null function from index 1');
  equal([null, null].find(null, 0), null, 'Array#find | null');
  equal([null, null].find(null, 1), null, 'Array#find | null from index 1');
  equal([undefined, undefined].find(undefined, 0), undefined, 'Array#find | undefined');
  equal([undefined, undefined].find(undefined, 1), undefined, 'Array#find | undefined from index 1');
  equal([undefined, 'a'].find(undefined, 1), undefined, 'Array#find | undefined can be found');


  count = 0;
  [1,2,3].find(function(n) {
    count++;
    return n == 1;
  });
  equal(count, 1, 'Array#find | should immediately finish when it finds a match');





  equal(['a','b','c'].findAll('a'), ['a'], 'Array#findAll | a');
  equal(['a','a','c'].findAll('a'), ['a','a'], 'Array#findAll | a,a');
  equal(['a','b','c'].findAll('q'), [], 'Array#findAll | q');
  equal([1,2,3].findAll(1), [1], 'Array#findAll | 1');
  equal([2,2,3].findAll(2), [2,2], 'Array#findAll | 2,2');
  equal([1,2,3].findAll(4), [], 'Array#findAll | 4');
  equal([{a:1},{b:2},{c:3}].findAll({a:1}), [{a:1}], 'Array#findAll | a:1', { prototype: [] });
  equal([{a:1},{a:1},{c:3}].findAll({a:1}), [{a:1},{a:1}], 'Array#findAll | a:1,a:1', { prototype: [] });
  equal([{a:1},{b:2},{c:3}].findAll({d:4}), [], 'Array#findAll | d:4');
  equal([{a:1},{b:2},{c:3}].findAll({c:4}), [], 'Array#findAll | c:4');
  equal([[1,2],[2,3],[4,5]].findAll([2,3]), [[2,3]], 'Array#findAll | 2,3', { prototype: [] });
  equal([[1,2],[2,3],[4,5]].findAll([2,4]), [], 'Array#findAll | 2,4');
  equal([[1,2],[2,3],[2,3]].findAll([2,3]), [[2,3],[2,3]], 'Array#findAll | [2,3],[2,3]', { prototype: [] });
  equal(['foo','bar'].findAll(/f+/), ['foo'], 'Array#findAll | /f+/', { prototype: [] });
  equal(['foo','bar'].findAll(/[a-f]/), ['foo','bar'], 'Array#findAll | /[a-f]/', { prototype: [] });
  equal(['foo','bar'].findAll(/[a-f]/, 1), ['bar'], 'Array#findAll | /[a-f]/ from index 1', { prototype: [] });
  equal(['foo','bar'].findAll(/[a-f]/, 1, true), ['bar','foo'], 'Array#findAll | /[a-f]/ from index 1', { prototype: [] });
  equal(['foo','bar'].findAll( /q+/), [], 'Array#findAll | /q+/');
  equal([1,2,3].findAll(function(e) { return e > 0; }, 0), [1,2,3], 'Array#findAll | greater than 0 from index 0');
  equal([1,2,3].findAll(function(e) { return e > 0; }, 1), [2,3], 'Array#findAll | greater than 0 from index 1', { prototype: [1,2,3] });
  equal([1,2,3].findAll(function(e) { return e > 0; }, 2), [3], 'Array#findAll | greater than 0 from index 2', { prototype: [1,2,3] });
  equal([1,2,3].findAll(function(e) { return e > 0; }, 3), [], 'Array#findAll | greater than 0 from index 3', { prototype: [1,2,3] });
  equal([1,2,3].findAll(function(e) { return e > 0; }, 4), [], 'Array#findAll | greater than 0 from index 4', { prototype: [1,2,3] });
  equal([1,2,3].findAll(function(e) { return e > 1; }, 0), [2,3], 'Array#findAll | greater than 1 from index 0');
  equal([1,2,3].findAll(function(e) { return e > 1; }, 1), [2,3], 'Array#findAll | greater than 1 from index 1');
  equal([1,2,3].findAll(function(e) { return e > 1; }, 2), [3], 'Array#findAll | greater than 1 from index 2', { prototype: [2,3] });
  equal([1,2,3].findAll(function(e) { return e > 2; }, 0), [3], 'Array#findAll | greater than 2 from index 0');
  equal([1,2,3].findAll(function(e) { return e > 3; }, 0), [], 'Array#findAll | greater than 3 from index 0');

  equal([1,2,3].findAll(function(e) { return e > 0; }, 0, true), [1,2,3], 'Array#findAll | looping | greater than 0 from index 0');
  equal([1,2,3].findAll(function(e) { return e > 0; }, 1, true), [2,3,1], 'Array#findAll | looping | greater than 0 from index 1', { prototype: [1,2,3] });
  equal([1,2,3].findAll(function(e) { return e > 0; }, 2, true), [3,1,2], 'Array#findAll | looping | greater than 0 from index 2', { prototype: [1,2,3] });
  equal([1,2,3].findAll(function(e) { return e > 0; }, 3, true), [1,2,3], 'Array#findAll | looping | greater than 0 from index 3', { prototype: [1,2,3] });
  equal([1,2,3].findAll(function(e) { return e > 1; }, 0, true), [2,3], 'Array#findAll | looping | greater than 1 from index 0');
  equal([1,2,3].findAll(function(e) { return e > 1; }, 1, true), [2,3], 'Array#findAll | looping | greater than 1 from index 1', { prototype: [2,3] });
  equal([1,2,3].findAll(function(e) { return e > 1; }, 2, true), [3,2], 'Array#findAll | looping | greater than 1 from index 2', { prototype: [2,3] });
  equal([1,2,3].findAll(function(e) { return e > 2; }, 0, true), [3], 'Array#findAll | looping | greater than 2 from index 0');
  equal([1,2,3].findAll(function(e) { return e > 3; }, 0, true), [], 'Array#findAll | looping | greater than 3 from index 0');

  equal([{a:10},{a:8},{a:3}].findAll(function(e) { return e['a'] > 5; }, 0), [{a:10},{a:8}], 'Array#findAll | key "a" is greater than 5');
  equal([{a:10},{a:8},{a:3}].findAll(function(e) { return e['a'] > 5; }, 1), [{a:8}], 'Array#findAll | key "a" is greater than 5 from index 1', { prototype: [{a:10},{a:8}] });
  equal([{a:10},{a:8},{a:3}].findAll(function(e) { return e['a'] > 5; }, 2), [], 'Array#findAll | key "a" is greater than 5 from index 2', { prototype: [{a:10},{a:8}] });

  equal([{a:10},{a:8},{a:3}].findAll(function(e) { return e['a'] > 5; }, 0, true), [{a:10},{a:8}], 'Array#findAll | looping | key "a" is greater than 5');
  equal([{a:10},{a:8},{a:3}].findAll(function(e) { return e['a'] > 5; }, 1, true), [{a:8},{a:10}], 'Array#findAll | looping | key "a" is greater than 5 from index 1', { prototype: [{a:10},{a:8}] });
  equal([{a:10},{a:8},{a:3}].findAll(function(e) { return e['a'] > 5; }, 2, true), [{a:10},{a:8}], 'Array#findAll | looping | key "a" is greater than 5 from index 2', { prototype: [{a:10},{a:8}] });

  equal([function() {}].findAll(function(e) {}, 0), [], 'Array#findAll | null function');
  equal([function() {}].findAll(function(e) {}, 1), [], 'Array#findAll | null function from index 1');
  equal([null, null].findAll(null, 0), [null, null], 'Array#findAll | null');
  equal([null, null].findAll(null, 1), [null], 'Array#findAll | null from index 1', { prototype: [null,null] });

  equal([function() {}].findAll(function(e) {}, 0, true), [], 'Array#findAll | looping | null function');
  equal([function() {}].findAll(function(e) {}, 1, true), [], 'Array#findAll | looping | null function from index 1');
  equal([null, null].findAll(null, 0, true), [null, null], 'Array#findAll | looping | null');
  equal([null, null].findAll(null, 1, true), [null, null], 'Array#findAll | looping | null from index 1');

  // Example: finding last from an index. (reverse order). This means we don't need a findAllFromLastIndex
  arr = [{name:'john',age:10,food:'sushi'},{name:'randy',age:23,food:'natto'},{name:'karen',age:32,food:'salad'}];
  arr = [1,2,3,4,5,6,7,8,9];
  equal(arr.findAll(function(n) { return n % 3 == 0; }, 4), [6,9], 'Array#findAll | n % 3 from index 4', { prototype: [3,6,9] });
  equal(arr.reverse().findAll(function(n) { return n % 3 == 0; }, 4), [3], 'Array#findAll | reversed | n % 3 from index 4 reversed', { prototype: [9,6,3] });

  arr.reverse(); // Array#reverse is destructive, dammit!
  equal(arr.findAll(function(n) { return n % 3 == 0; }, 4, true), [6,9,3], 'Array#findAll | looping | n % 3 from index 4', { prototype: [3,6,9] });
  equal(arr.reverse().findAll(function(n) { return n % 3 == 0; }, 4, true), [3,9,6], 'Array#findAll | looping | reversed | n % 3 from index 4 reversed', { prototype: [9,6,3] });


  equal([1,1,3].unique(), [1,3], 'Array#unique | 1,1,3');
  equal([0,0,0].unique(), [0], 'Array#unique | 0,0,0');
  equal(['a','b','c'].unique(), ['a','b','c'], 'Array#unique | a,b,c');
  equal(['a','a','c'].unique(), ['a','c'], 'Array#unique | a,a,c');


  equal([{ foo:'bar' }, { foo:'bar' }].unique(), [{foo:'bar'}], 'Array#unique | objects uniqued as well', { prototype: [{foo:'bar'},{foo:'bar'}] });
  equal([{ first: 'John', last: 'Woo' }, { first: 'Reynold', last: 'Woo' }].unique(function(n){ return n.last; }), [{ first: 'John', last: 'Woo' }], 'Array#unique | can be uniqued via a mapping function');
  equal([{ first: 'John', last: 'Woo' }, { first: 'Reynold', last: 'Woo' }].unique('last'), [{ first: 'John', last: 'Woo' }], 'Array#unique | can be uniqued via a mapping shortcut');

  [1].unique(function(el,i,a) {
    equal(this, [1], 'Array#unique | scope should be the array');
    equal(i, 0, 'Array#unique | second param should be the index');
    equal(a, [1], 'Array#unique | third param should also be the array');
  });

  equal([function(){ return 'a' }, function() { return 'a'; }, function() { return 'b'; }].unique().length, 3, 'Array#unique | Functions are always unique');

  equal([1,2,3].union([3,4,5]), [1,2,3,4,5], 'Array#union | 1,2,3 + 3,4,5');
  equal([1,1,1].union([1,2,3]), [1,2,3], 'Array#union | 1,1,1 + 1,2,3');
  equal([0,0,0].union([1,2,3]), [0,1,2,3], 'Array#union | 0,0,0 + 1,2,3');
  equal([0,0,0].union([0,0,0]), [0], 'Array#union | 0,0,0 + 0,0,0');
  equal([].union([]), [], 'Array#union | 2 empty arrays');
  equal([-1,-2,-3].union([-2,-4,-5]), [-1,-2,-3,-4,-5], 'Array#union | -1,-2,-3 + -2,-4,-5');
  equal([-1,-2,-3].union([3,4,5]), [-1,-2,-3,3,4,5], 'Array#union | -1,-2,-3 + 3,4,5');
  equal([{a:1},{b:2}].union([{b:2},{c:3}]), [{a:1},{b:2},{c:3}], 'Array#union | a:1,b:2 + b:2,c:3', { prototype: [{a:1},{b:2},{b:2},{c:3}] });
  equal([1,2,3].union(4), [1,2,3,4], 'Array#union | 1,2,3 + 4');

  equal([1,2,3].union(4,8,10), [1,2,3,4,8,10], 'Array#union | 1,2,3 + 4 8 10');
  equal([1,2,3].union([4],[8],[10]), [1,2,3,4,8,10], 'Array#union | 1,2,3 + [4] [8] [10]');

  arr = [1,2,3];
  arr.union([4,5,6]);
  equal(arr, [1,2,3], 'Array#union | is non-destructive');



  equal([1,2,3].intersect([3,4,5]), [3], 'Array#intersect | 1,2,3 & 3,4,5');
  equal(['a','b','c'].intersect(['c','d','e']), ['c'], 'Array#intersect | a,b,c & c,d,e');
  equal([1,2,3].intersect([1,2,3]), [1,2,3], 'Array#intersect | 1,2,3 & 1,2,3');
  equal([1,2,3].intersect([3,2,1]), [1,2,3], 'Array#intersect | 1,2,3 & 3,2,1');
  equal([].intersect([3]), [], 'Array#intersect | empty array & 3');
  equal([3].intersect([]), [], 'Array#intersect | 3 & empty array');
  equal([].intersect([]), [], 'Array#intersect | 2 empty arrays');
  equal([null].intersect([]), [], 'Array#intersect | [null] & empty array');
  equal([null].intersect([null]), [null], 'Array#intersect | [null] & [null]', { prototype: [], mootools: [] });
  equal([false].intersect([false]), [false], 'Array#intersect | [false] & [false]', { prototype: [] });
  equal([false].intersect([0]), [], 'Array#intersect | [false] & [0]');
  equal([false].intersect([null]), [], 'Array#intersect | [false] & [null]');
  equal([false].intersect([undefined]), [], 'Array#intersect | [false] & [undefined]');
  equal([{a:1},{b:2}].intersect([{b:2},{c:3}]), [{b:2}], 'Array#intersect | a:1,b:2 & b:2,c:3', { prototype: [] });
  equal([1,1,3].intersect([1,5,6]), [1], 'Array#intersect | 1,1,3 & 1,5,6');
  equal([1,2,3].intersect([4,5,6]), [], 'Array#intersect | 1,1,3 & 4,5,6');

  equal([1,2,3].intersect([3,4,5],[0,1]), [1,3], 'Array#intersect | handles multiple arguments', { prototype: [3] });

  arr = [1,2,3];
  arr.intersect([3,4,5]);
  equal(arr, [1,2,3], 'Array#intersect | is non-destructive');


  // Prototype will blow up here
  skipEnvironments(['prototype'], function(){
    equal([1,1].intersect(1,1,[1,1]), [1], 'Array#intersect | assure uniqueness');
    equal([1,2,3].intersect(1), [1], 'Array#intersect | 1,2,3 + 1');
  });





  equal([1,2,3].subtract([3,4,5]), [1,2], 'Array#subtract | 1,2,3 + 3,4,5');
  equal([1,1,2,2,3,3,4,4,5,5].subtract([2,3,4]), [1,1,5,5], 'Array#subtract | 1,1,2,2,3,3,4,4,5,5 + 2,3,4');
  equal(['a','b','c'].subtract(['c','d','e']), ['a','b'], 'Array#subtract | a,b,c + c,d,e');
  equal([1,2,3].subtract([1,2,3]), [], 'Array#subtract | 1,2,3 + 1,2,3');
  equal([1,2,3].subtract([3,2,1]), [], 'Array#subtract | 1,2,3 + 3,2,1');
  equal([].subtract([3]), [], 'Array#subtract | empty array + [3]');
  equal([3].subtract([]), [3], 'Array#subtract | [3] + empty array');
  equal([].subtract([]), [], 'Array#subtract | 2 empty arrays');
  equal([null].subtract([]), [null], 'Array#subtract | [null] + empty array');
  equal([null].subtract([null]), [], 'Array#subtract | [null] + [null]', { mootools: [null] });
  equal([false].subtract([false]), [], 'Array#subtract | [false] + [false]');
  equal([false].subtract([0]), [false], 'Array#subtract | [false] + [0]');
  equal([false].subtract([null]), [false], 'Array#subtract | [false] + [null]');
  equal([false].subtract([undefined]), [false], 'Array#subtract | [false] + [undefined]');
  equal([{a:1},{b:2}].subtract([{b:2},{c:3}]), [{a:1}], 'Array#subtract | a:1,b:2 + b:2,c:3');
  equal([1,1,3].subtract([1,5,6]), [3], 'Array#subtract | 1,1,3 + 1,5,6');
  equal([1,2,3].subtract([4,5,6]), [1,2,3], 'Array#subtract | 1,2,3 + 4,5,6');
  equal([1,2,3].subtract(1), [2,3], 'Array#subtract | 1,2,3 + 1');

  equal([1,2,3,4,5].subtract([1],[3],[5]), [2,4], 'Array#subtract | handles multiple arguments');

  arr = [1,2,3];
  arr.subtract([3]);
  equal(arr, [1,2,3], 'Array#subtract | is non-destructive');





  equal(['a','b','c'].at(0), 'a', 'Array#at | a,b,c | 0');
  equal(['a','b','c'].at(1), 'b', 'Array#at | a,b,c | 1');
  equal(['a','b','c'].at(2), 'c', 'Array#at | a,b,c | 2');
  equal(['a','b','c'].at(3), 'a', 'Array#at | a,b,c | 3');
  equal(['a','b','c'].at(-1), 'c', 'Array#at | a,b,c | -1');
  equal(['a','b','c'].at(-2), 'b', 'Array#at | a,b,c | -2');
  equal(['a','b','c'].at(-3), 'a', 'Array#at | a,b,c | -3');
  equal(['a','b','c'].at(-4), 'c', 'Array#at | a,b,c | -3');

  equal(['a','b','c'].at(0, false), 'a', 'Array#at | a,b,c | loop off | 0');
  equal(['a','b','c'].at(1, false), 'b', 'Array#at | a,b,c | loop off | 1');
  equal(['a','b','c'].at(2, false), 'c', 'Array#at | a,b,c | loop off | 2');
  equal(['a','b','c'].at(3, false), undefined, 'Array#at | a,b,c | loop off | 3');
  equal(['a','b','c'].at(-1, false), undefined, 'Array#at | a,b,c | loop off | -1');
  equal(['a','b','c'].at(-2, false), undefined, 'Array#at | a,b,c | loop off | -2');
  equal(['a','b','c'].at(-3, false), undefined, 'Array#at | a,b,c | loop off | -3');
  equal(['a','b','c'].at(-4, false), undefined, 'Array#at | a,b,c | loop off | -4');
  equal(['a','b','c'].at(), undefined, 'Array#at | a,b,c | no argument');
  equal([false].at(0), false, 'Array#at | false | loop off | 0');
  equal(['a'].at(0), 'a', 'Array#at | a | 0');
  equal(['a'].at(1), 'a', 'Array#at | a | 1');
  equal(['a'].at(1, false), undefined, 'Array#at | a | loop off | 1');
  equal(['a'].at(-1), 'a', 'Array#at | a | -1');
  equal(['a','b','c','d','e','f'].at(0,2,4), ['a','c','e'], 'Array#at | a,b,c,d,e,f | 0,2,4');
  equal(['a','b','c','d','e','f'].at(1,3,5), ['b','d','f'], 'Array#at | a,b,c,d,e,f | 1,3,5');
  equal(['a','b','c','d','e','f'].at(0,2,4,6), ['a','c','e','a'], 'Array#at | a,b,c,d,e,f | 0,2,4,6');
  equal(['a','b','c','d','e','f'].at(0,2,4,6,18), ['a','c','e','a','a'], 'Array#at | a,b,c,d,e,f | 0,2,4,6,18');
  equal(['a','b','c','d','e','f'].at(0,2,4,6, false), ['a','c','e', undefined], 'Array#at | a,b,c,d,e,f | 0,2,4,6,false | false');


  equal(['a','b','c'].from(), ['a','b','c'], 'Array#from | no argument');
  equal(['a','b','c'].from(1), ['b','c'], 'Array#from| 1');
  equal(['a','b','c'].from(2), ['c'], 'Array#from | 2');
  equal(['a','b','c'].from(3), [], 'Array#from | 3');
  equal(['a','b','c'].from(4), [], 'Array#from | 4');
  equal(['a','b','c'].from(-1), ['c'], 'Array#from | -1');
  equal(['a','b','c'].from(-2), ['b','c'], 'Array#from | -2');
  equal(['a','b','c'].from(-3), ['a','b','c'], 'Array#from | -3');
  equal(['a','b','c'].from(-4), ['a','b','c'], 'Array#from | -4');


  equal(['a','b','c'].to(), ['a','b','c'], 'Array#to | no argument');
  equal(['a','b','c'].to(0), [], 'Array#to | no argument');
  equal(['a','b','c'].to(1), ['a'], 'Array#to | 1');
  equal(['a','b','c'].to(2), ['a','b'], 'Array#to | 2');
  equal(['a','b','c'].to(3), ['a','b','c'], 'Array#to | 3');
  equal(['a','b','c'].to(4), ['a','b','c'], 'Array#to | 4');
  equal(['a','b','c'].to(-1), ['a','b'], 'Array#to | -1');
  equal(['a','b','c'].to(-2), ['a'], 'Array#to | -2');
  equal(['a','b','c'].to(-3), [], 'Array#to | -3');
  equal(['a','b','c'].to(-4), [], 'Array#to | -4');



  equal(['a','b','c'].first(), 'a', 'Array#first | no argument');
  equal(['a','b','c'].first(1), ['a'], 'Array#first | 1', { prototype: 'a' });
  equal(['a','b','c'].first(2), ['a','b'], 'Array#first | 2', { prototype: 'a' });
  equal(['a','b','c'].first(3), ['a','b','c'], 'Array#first | 3', { prototype: 'a' });
  equal(['a','b','c'].first(4), ['a','b','c'], 'Array#first | 4', { prototype: 'a' });
  equal(['a','b','c'].first(-1), [], 'Array#first | -1', { prototype: 'a' });
  equal(['a','b','c'].first(-2), [], 'Array#first | -2', { prototype: 'a' });
  equal(['a','b','c'].first(-3), [], 'Array#first | -3', { prototype: 'a' });


  equal(['a','b','c'].last(), 'c', 'Array#last | no argument');
  equal(['a','b','c'].last(1), ['c'], 'Array#last | 1', { prototype: 'c' });
  equal(['a','b','c'].last(2), ['b','c'], 'Array#last | 2', { prototype: 'c' });
  equal(['a','b','c'].last(3), ['a','b','c'], 'Array#last | 3', { prototype: 'c' });
  equal(['a','b','c'].last(4), ['a','b','c'], 'Array#last | 4', { prototype: 'c' });
  equal(['a','b','c'].last(-1), [], 'Array#last | -1', { prototype: 'c' });
  equal(['a','b','c'].last(-2), [], 'Array#last | -2', { prototype: 'c' });
  equal(['a','b','c'].last(-3), [], 'Array#last | -3', { prototype: 'c' });
  equal(['a','b','c'].last(-4), [], 'Array#last | -4', { prototype: 'c' });





  equal([12,87,55].min(), 12, 'Array#min | no argument', { prototype: 12 });
  equal([12,87,55].min(undefined), 12, 'Array#min | undefined', { prototype: 12 });
  equal([-12,-87,-55].min(), -87, 'Array#min | -87', { prototype: -87 });
  equal([5,5,5].min(), 5, 'Array#min | 5 is uniqued', { prototype: 5 });
  equal(['a','b','c'].min(), 'a', 'Array#min | strings are not counted', { prototype: 'a' });
  equal([].min(), undefined, 'Array#min | empty array', { prototype: undefined });
  equal([null].min(), null, 'Array#min | [null]', { prototype: null });
  equal([{a:1,b:5},{a:2,b:5},{a:3,b:5}].min(function(el) { return el['a']; }), {a:1,b:5}, 'Array#min | key "a"', { prototype: 1 });
  equal([{a:1,b:5},{a:2,b:4},{a:3,b:3}].min(function(el) { return el['b']; }), {a:3,b:3}, 'Array#min | key "b", 1 found', { prototype: 3 });
  equal([{a:1,b:5},{a:3,b:3},{a:3,b:3}].min(function(el) { return el['b']; }), {a:3,b:3}, 'Array#min | key "b", 1 found', { prototype: 3 });
  equal([{a:1,b:3},{a:2,b:4},{a:3,b:3}].min(function(el) { return el['b']; }), {a:1,b:3}, 'Array#min | key "b", first found', { prototype: 3 });
  equal([{a:1,b:3},{a:2,b:4},{a:3,b:3}].min(function(el) { return el['b']; }, true), [{a:1,b:3},{a:3,b:3}], 'Array#min | key "b", 2 found', { prototype: 3 });
  equal([{a:-1,b:-5},{a:-2,b:-4},{a:-3,b:-3}].min(function(el) { return el['b']; }), {a:-1,b:-5}, 'Array#min | key "b", 1 found', { prototype: -5 });
  equal(['short','and','mort'].min(function(el) { return el.length; }), 'and', 'Array#min | length', { prototype: 3 });
  equal(['short','and','mort','fat'].min(function(el) { return el.length; }, true), ['and','fat'], 'Array#min | and,fat', { prototype: 3 });
  equal(['short','and','mort'].min('length'), 'and', 'Array#min | length with shortcut', { prototype: 3 });
  equal(['short','and','mort'].min('length', true), ['and'], 'Array#min | length with shortcut', { prototype: 3 });

  skipEnvironments(['prototype'], function() {
    [1].min(function(el,i,a) {
      equal(this, [1], 'Array#min | scope should be the array');
      equal(i, 0, 'Array#min | second param should be the index');
      equal(a, [1], 'Array#min | third param should also be the array');
      return el;
    });
  });

  equal([12,12,12].min(function(n) { return n; }, true), [12,12,12], 'Array#min | should not unique', { prototype: 12 });

  raisesError(function() { arrayOfUndefined.min(); }, 'Array#min | should raise an error when comparing undefined');
  raisesError(function() { arrayOfUndefinedWith1.min(); }, 'Array#min | should raise an error when comparing 1 to undefined');
  raisesError(function() { [87,12,55].min(4); }, 'Array#min | number not found in number, so undefined');
  raisesError(function() { [12,87,55].min(null); }, 'Array#min | null not found in number, so undefined');


  equal([12,87,55].max(), 87, 'Array#max | no argument', { prototype: 87 });
  equal([12,87,55].max(undefined), 87, 'Array#max | undefined', { prototype: 87 });
  equal([-12,-87,-55].max(), -12, 'Array#max | -12', { prototype: -12 });
  equal([5,5,128].max(), 128, 'Array#max | 128', { prototype: 128 });
  equal([128,128,128].max(), 128, 'Array#max | 128 is uniqued', { prototype: 128 });
  equal(['a','b','c'].max(), 'c', 'Array#max | strings are not counted', { prototype: 'c' });
  equal([].max(), undefined, 'Array#max | empty array', { prototype: undefined });
  equal([null].max(), null, 'Array#max | [null]', { prototype: null });
  equal([{a:1,b:5},{a:2,b:5},{a:3,b:5}].max(function(el) { return el['a']; }), {a:3,b:5}, 'Array#max | key "a"', { prototype: 3 });
  equal([{a:1,b:5},{a:2,b:4},{a:3,b:3}].max(function(el) { return el['b']; }), {a:1,b:5}, 'Array#max | key "b" returns b:5', { prototype: 5 });
  equal([{a:1,b:3},{a:2,b:4},{a:3,b:3}].max(function(el) { return el['b']; }), {a:2,b:4}, 'Array#max | key "b" returns b:4', { prototype: 4 });
  equal([{a:1,b:3},{a:2,b:4},{a:2,b:4}].max(function(el) { return el['b']; }), {a:2,b:4}, 'Array#max | key "b" returns b:4 uniqued', { prototype: 4 });
  equal([{a:1,b:3},{a:2,b:1},{a:3,b:3}].max(function(el) { return el['b']; }), {a:1,b:3}, 'Array#max | key "b", first found', { prototype: 3 });
  equal([{a:1,b:3},{a:2,b:1},{a:3,b:3}].max(function(el) { return el['b']; }, true), [{a:1,b:3},{a:3,b:3}], 'Array#max | key "b", 2 found', { prototype: 3 });
  equal([{a:-1,b:-5},{a:-2,b:-4},{a:-3,b:-3}].max(function(el) { return el['b']; }), {a:-3,b:-3}, 'Array#max | key "b" returns b:-3', { prototype: -3 });
  equal(['short','and', 'mort'].max(function(el) { return el.length; }), 'short', 'Array#max | length', { prototype: 5 });
  equal(['short','and', 'morts', 'fat'].max(function(el) { return el.length; }, true), ['short','morts'], 'Array#max | short,morts', { prototype: 5 });

  skipEnvironments(['prototype'], function() {
    [1].max(function(el,i,a) {
      equal(this, [1], 'Array#max | scope should be the array');
      equal(i, 0, 'Array#max | second param should be the index');
      equal(a, [1], 'Array#max | third param should also be the array');
      return el;
    });
  });

  equal([12,12,12].max(function(n){ return n; }, true), [12,12,12], 'Array#max | should not unique', { prototype: 12 });

  raisesError(function() { arrayOfUndefined.max(); }, 'Array#max | should raise an error when comparing undefined');
  raisesError(function() { arrayOfUndefinedWith1.max(); }, 'Array#max | should raise an error when comparing 1 to undefined');
  raisesError(function() { [87,12,55].max(4); }, 'Array#max | number not found in number, so undefined');
  raisesError(function() { [12,87,55].max(null); }, 'Array#max | null not found in number, so undefined');



  var people = [
    { name: 'jim',    age: 27, hair: 'brown'  },
    { name: 'mary',   age: 52, hair: 'blonde' },
    { name: 'ronnie', age: 13, hair: 'brown'  },
    { name: 'edmund', age: 27, hair: 'blonde' }
  ];

  equal([1,2,3].most(null), 1, 'Array#most | null | returns first');
  equal([1,2,3].most(undefined), 1, 'Array#most | undefined | returns first');
  equal([1,2,3].most(4), 1, 'Array#most | number | returns first');

  equal(people.most(function(person) { return person.age; }).age, 27, 'Array#most | age | age is 27');
  equal(people.most(function(person) { return person.age; }, true), [{name:'jim',age:27,hair:'brown'},{name:'edmund',age:27,hair:'blonde'}], 'Array#most | age | returns all');
  equal(people.most(function(person) { return person.hair; }), {name:'jim',age:27,hair:'brown'}, 'Array#most | hair');

  equal([].most(), undefined, 'Array#most | empty array');
  equal([1,2,3].most(), 1, 'Array#most | 1,2,3');
  equal([1,2,3,3].most(), 3, 'Array#most | 1,2,3,3');
  equal([1,1,2,3,3].most(), 1, 'Array#most | 1,1,2,3,3 | first');
  equal([1,1,2,3,3].most(function(n) { return n; }, true), [1,1,3,3], 'Array#most | 1,1,2,3,3 | all');
  equal(['a','b','c'].most(), 'a', 'Array#most | a,b,c');
  equal(['a','b','c','c'].most(), 'c', 'Array#most | a,b,c,c');
  equal(['a','a','b','c','c'].most(), 'a', 'Array#most | a,a,b,c,c | first');
  equal(['a','a','b','c','c'].most(function(s){ return s; }, true), ['a','a','c','c'], 'Array#most | a,a,b,c,c | all');

  // Leaving this here as a reference for how to collect the actual number of occurences.
  equal(people.most(function(person) { return person.age; }, true).length, 2, 'Array#most | collect actual number of occurrences');

  [1].most(function(el,i,a) {
    equal(this, [1], 'Array#most | scope should be the array');
    equal(i, 0, 'Array#most | second param should be the index');
    equal(a, [1], 'Array#most | third param should also be the array');
    return el;
  });


  equal([1,2,3].least(null), 1, 'Array#least | null');
  equal([1,2,3].least(undefined), 1, 'Array#least | undefined');
  equal([1,2,3].least(4), 1, 'Array#least | number');

  equal(people.least(), people[0], 'Array#least | contains mary | does not return most');
  equal(people.least(function(person) { return person.age; }).age != 27, true, 'Array#least | map age | does not return most');
  equal(people.least(function(person) { return person.age; }, true).sortBy('name'), [people[1], people[2]], 'Array#least | contains mary and ronnie');
  equal(people.least(function(person) { return person.age; }, true).sortBy('age'), [{name:'ronnie',age:13,hair:'brown'}, {name:'mary',age:52,hair:'blonde'}], 'Array#least | age and sorted by age');

  equal(people.least(function(person) { return person.hair; }), people[0], 'Array#least | hair');

  equal([].least(), undefined, 'Array#least | empty array');
  equal([1,2,3].least(), 1, 'Array#least | 1,2,3');
  equal([1,2,3,3].least(), 1, 'Array#least | 1,2,3,3');
  equal([1,2,3,3].least(function(n){ return n; }, true), [1,2], 'Array#least | 1,2,3,3 | all');
  equal([1,1,2,3,3].least(), 2, 'Array#least | 1,1,2,3,3');
  equal([1,1,1,2,2,3,3,3].least(), 2, 'Array#least | 1,1,1,2,2,3,3,3');
  equal(['a','b','c'].least(), 'a', 'Array#least | a,b,c');
  equal(['a','b','c','c'].least(), 'a', 'Array#least | a,b,c,c');
  equal(['a','b','c','c'].least(function(n) { return n; }, true), ['a','b'], 'Array#least | a,b,c,c | all');
  equal(['a','a','b','c','c'].least(), 'b', 'Array#least | a,a,b,c,c');

  // Leaving this here as a reference for how to collect the actual number of occurences.
  equal(people.least(function(person) { return person.age; }, true).length, 2, 'Array#least | collect actual number of occurences');

  [1].least(function(el,i,a) {
    equal(this, [1], 'Array#least | scope should be the array');
    equal(i, 0, 'Array#least | second param should be the index');
    equal(a, [1], 'Array#least | third param should also be the array');
    return e;
  });

  equal([12,87,55].sum(), 154, 'Array#sum | 12,87,55');
  equal([12,87,128].sum(), 227, 'Array#sum | 12,87,128');
  equal([].sum(), 0, 'Array#sum | empty array is 0');
  equal([null, false].sum(), 0, 'Array#sum | [null,false] is 0');
  equal([{a:1,b:5},{a:2,b:5},{a:3,b:5}].sum(function(el) { return el['a']; }), 6, 'Array#sum | key "a"');
  equal([{a:1,b:5},{a:2,b:5},{a:3,b:5}].sum('a'), 6, 'Array#sum | shortcut for key "a"');

  equal([13,18,13,14,13,16,14,21,13].average(), 15, 'Array#average | 13,18,13,14,13,16,14,21,13');
  equal([2,2,2].average(), 2, 'Array#average | 2,2,2');
  equal([2,3,4].average(), 3, 'Array#average | 2,3,4');
  equal([2,3,4,2].average(), 2.75, 'Array#average | 2,3,4,2');
  equal([].average(), 0, 'Array#average | empty array is 0');
  equal([null, false].average(), 0, 'Array#average | [null, false] is 0');
  equal([{a:1,b:5},{a:2,b:5},{a:3,b:5}].average(function(el) { return el['a']; }), 2, 'Array#average | key "a"');
  equal([{a:1,b:5},{a:2,b:5},{a:3,b:5}].average('a'), 2, 'Array#average | shortcut for key "a"');


  equal(people.average('age'), 29.75, 'Array#average | people average age is 29.75');
  equal(people.average(function(p) { return p.age; }), 29.75, 'Array#average | people average age is 29.75 by function');
  equal(isNaN(people.average(function(p) { return p.hair; })), true, 'Array#average | people average hair is NaN');


  var grouped;

  equal([].groupBy(), {}, 'Array#groupBy | empty array');
  equal([1,1,2,2,3,3,4].groupBy(), {1:[1,1],2:[2,2],3:[3,3],4:[4]}, 'Array#groupBy | 1,1,2,2,3,3,4');
  equal(['a','b','c','a','e','c'].groupBy(), {'a':['a','a'],'b':['b'],'c':['c','c'],'e':['e']}, 'Array#groupBy | a,b,c,a,e,c');
  equal([{a:1,b:5},{a:8,b:5},{a:8,b:3}].groupBy('a'), {8:[{a:8,b:5},{a:8,b:3}],1:[{a:1,b:5}]}, 'Array#groupBy | grouping by "a"');
  equal([{a:1,b:5},{a:8,b:5},{a:8,b:3}].groupBy(function(el) { return el['a']; }), {8:[{a:8,b:5},{a:8,b:3}],1:[{a:1,b:5}]}, 'Array#groupBy | grouping by "a" by function');


  people = people.sortBy('hair');
  equal(people.groupBy(function(p) { return p.age; }), {27: [{name:'edmund',age:27,hair:'blonde'},{name:'jim',age:27,hair:'brown'}],52:[{name:'mary',age:52,hair:'blonde'}],13:[{name:'ronnie',age:13,hair:'brown'}]}, 'Array#groupBy | grouping people by age');

  equal([1,2,3].groupBy(undefined), { 1: [1], 2: [2], 3: [3] }, 'Array#groupBy | undefined');
  equal([1,2,3].groupBy(null), { 'undefined': [1,2,3] }, 'Array#groupBy | null');
  equal([1,2,3].groupBy(4), { 'undefined': [1,2,3] }, 'Array#groupBy | number');
  equal(['one','two','three'].groupBy('length').keys, undefined, 'Array#groupBy | result should not be an extended object');

  var counter = 0;
  ['one','two','three'].groupBy('length', function() {
    counter++;
  });

  equal(counter, 2, 'Array#groupBy | should allow a callback fn');

  var arr1 = ['a','b','c'];
  var arr2 = ['d','e','f'];
  var obj = arr1.groupBy(function(el, i) {
    return arr2[i];
  });

  [1].groupBy(function(el,i,a) {
    equal(this, [1], 'Array#groupBy | scope should be the array');
    equal(i, 0, 'Array#groupBy | second param should be the index');
    equal(a, [1], 'Array#groupBy | third param should also be the array');
  });

  equal(obj, { 'd':['a'],'e':['b'],'f':['c'] }, 'Array#groupBy | should use an index');





  equal([1,2,3,4,5,6,7,8,9,10].inGroups(1), [[1,2,3,4,5,6,7,8,9,10]], 'Array#inGroups | in groups of 1');
  equal([1,2,3,4,5,6,7,8,9,10].inGroups(2), [[1,2,3,4,5],[6,7,8,9,10]], 'Array#inGroups | in groups of 2');
  equal([1,2,3,4,5,6,7,8,9,10].inGroups(3), [[1,2,3,4],[5,6,7,8],[9,10]], 'Array#inGroups | in groups of 3');
  equal([1,2,3,4,5,6,7,8,9,10].inGroups(4), [[1,2,3],[4,5,6],[7,8,9],[10]], 'Array#inGroups | in groups of 4');
  equal([1,2,3,4,5,6,7,8,9,10].inGroups(5), [[1,2],[3,4],[5,6],[7,8],[9,10]], 'Array#inGroups | in groups of 5');
  equal([1,2,3,4,5,6,7,8,9,10].inGroups(6), [[1,2],[3,4],[5,6],[7,8],[9,10],[]], 'Array#inGroups | in groups of 6');
  equal([1,2,3,4,5,6,7,8,9,10].inGroups(7), [[1,2],[3,4],[5,6],[7,8],[9,10],[],[]], 'Array#inGroups | in groups of 7');


  equal([1,2,3,4,5,6,7,8,9,10].inGroups(3, null), [[1,2,3,4],[5,6,7,8],[9,10,null,null]], 'Array#inGroups | pad with null | in groups of 3');
  equal([1,2,3,4,5,6,7,8,9,10].inGroups(4, null), [[1,2,3],[4,5,6],[7,8,9],[10,null,null]], 'Array#inGroups | pad with null | in groups of 4');
  equal([1,2,3,4,5,6,7,8,9,10].inGroups(5, null), [[1,2],[3,4],[5,6],[7,8],[9,10]], 'Array#inGroups | pad with null | in groups of 5');
  equal([1,2,3,4,5,6,7,8,9,10].inGroups(6, null), [[1,2],[3,4],[5,6],[7,8],[9,10],[null,null]], 'Array#inGroups | pad with null | in groups of 6');
  equal([1,2,3,4,5,6,7,8,9,10].inGroups(7, null), [[1,2],[3,4],[5,6],[7,8],[9,10],[null,null],[null,null]], 'Array#inGroups | pad with null | in groups of 7');



  equal([1,2,3,4,5,6,7,8,9,10].inGroupsOf(3), [[1,2,3],[4,5,6],[7,8,9],[10,null,null]], 'Array#inGroupsOf | groups of 3 | 1 to 10');
  equal([1,2,3,4,5,6,7,8,9].inGroupsOf(3), [[1,2,3],[4,5,6],[7,8,9]], 'Array#inGroupsOf | groups of 3 | 1 to 9');
  equal([1,2,3,4,5,6,7,8].inGroupsOf(3), [[1,2,3],[4,5,6],[7,8,null]], 'Array#inGroupsOf | groups of 3 | 1 to 8');
  equal([1,2,3,4,5,6,7].inGroupsOf(3), [[1,2,3],[4,5,6],[7,null,null]], 'Array#inGroupsOf | groups of 3 | 1 to 7');
  equal([1,2,3,4,5,6].inGroupsOf(3), [[1,2,3],[4,5,6]], 'Array#inGroupsOf | groups of 3 | 1 to 6');
  equal([1,2,3,4,5].inGroupsOf(3), [[1,2,3],[4,5,null]], 'Array#inGroupsOf | groups of 3 | 1 to 5');
  equal([1,2,3,4].inGroupsOf(3), [[1,2,3],[4,null,null]], 'Array#inGroupsOf | groups of 3 | 1 to 4');
  equal([1,2,3].inGroupsOf(3), [[1,2,3]], 'Array#inGroupsOf | groups of 3 | 1 to 3');
  equal([1,2].inGroupsOf(3), [[1,2,null]], 'Array#inGroupsOf | groups of 3 | 1 to 2');
  equal([1].inGroupsOf(3), [[1,null,null]], 'Array#inGroupsOf | groups of 3 | 1');

  equal([1,2,3,4,5,6,7,8,9,10].inGroupsOf(3, null), [[1,2,3],[4,5,6],[7,8,9],[10, null, null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 10');
  equal([1,2,3,4,5,6,7,8,9].inGroupsOf(3, null), [[1,2,3],[4,5,6],[7,8,9]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 9');
  equal([1,2,3,4,5,6,7,8].inGroupsOf(3, null), [[1,2,3],[4,5,6],[7,8, null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 8');
  equal([1,2,3,4,5,6,7].inGroupsOf(3, null), [[1,2,3],[4,5,6],[7, null, null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 7');
  equal([1,2,3,4,5,6].inGroupsOf(3, null), [[1,2,3],[4,5,6]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 6');
  equal([1,2,3,4,5].inGroupsOf(3, null), [[1,2,3],[4,5,null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 5');
  equal([1,2,3,4].inGroupsOf(3, null), [[1,2,3],[4,null,null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 4');
  equal([1,2,3].inGroupsOf(3, null), [[1,2,3]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 3');
  equal([1,2].inGroupsOf(3, null), [[1,2,null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 2');
  equal([1].inGroupsOf(3, null), [[1,null,null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1');

  equal([1].inGroupsOf(3, ' '), [[1,' ',' ']], 'Array#inGroupsOf | pad with spaces');
  equal([1].inGroupsOf(3, true), [[1,true,true]], 'Array#inGroupsOf | pad with true');
  equal([1].inGroupsOf(3, false), [[1,false,false]], 'Array#inGroupsOf | pad with false');

  equal([1].inGroupsOf(), [[1]], 'Array#inGroupsOf | no argument', { prototype: [] });
  equal([1].inGroupsOf(1, null), [[1]], 'Array#inGroupsOf | pad with null | no argument');

  equal([1].inGroupsOf(0), [1], 'Array#inGroupsOf | 0');
  equal([1].inGroupsOf(0, null), [1], 'Array#inGroupsOf | pad with null | 0');

  equal([1].inGroupsOf(3, null), [[1, null, null]], 'Array#inGroupsOf | pad with null | 3');
  equal([1].inGroupsOf(1, null), [[1]], 'Array#inGroupsOf | pad with null | 1');
  equal([].inGroupsOf(3), [], 'Array#inGroupsOf | empty array');
  equal([].inGroupsOf(3, null), [], 'Array#inGroupsOf | pad with null | empty array');
  equal([null].inGroupsOf(3), [[null,null,null]], 'Array#inGroupsOf | [null] in groups of 3');
  equal([null].inGroupsOf(3, null), [[null,null,null]], 'Array#inGroupsOf | pad with null | [null] in groups of 3');
  equal([1].inGroupsOf(3, undefined), [[1,null,null]], 'Array#inGroupsOf | passing undefined reverts to null');


  // Issue #142 - inGroupsOf corrupting array length
  arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  arr.inGroupsOf(3);
  equal(arr.length, 20, 'Array#inGroupsOf | does not corrupt original array length');


  // Emulating example of Enumerable#each_slice
  equal([1,2,3,4,5,6,7,8,9,10].inGroupsOf(3).map(function(g) { return g[1]; }).compact(), [2,5,8], 'Array#inGroupsOf | 1 to 10 in groups of 3 compacted');



  equal([1,2,3].compact(), [1,2,3], 'Array#compact | 1,2,3');
  equal([1,2,null,3].compact(), [1,2,3], 'Array#compact | 1,2,null,3');
  equal([1,2,undefined,3].compact(), [1,2,3], 'Array#compact | 1,2,undefined,3');
  equal([undefined,undefined,undefined].compact(), [], 'Array#compact | undefined,undefined,undefined');
  equal([null,null,null].compact(), [], 'Array#compact | null,null,null');
  equal([NaN,NaN,NaN].compact(), [], 'Array#compact | NaN,NaN,NaN', { prototype: [NaN,NaN,NaN] });
  equal(['','',''], ['','',''], 'Array#compact | empty strings');
  equal([false,false,false].compact(), [false,false,false], 'Array#compact | false is left alone');
  equal([0,1,2].compact(), [0,1,2], 'Array#compact | 0,1,2');
  equal([].compact(), [], 'Array#compact | empty array');
  equal(['a','b','c'].compact(), ['a','b','c'], 'Array#compact | a,b,c');
  equal([f1, f2].compact(), [f1, f2], 'Array#compact | functions');
  equal([null,[null],[false,[null,undefined,3]]].compact(), [[],[false,[3]]], 'Array#compact | deep compacts as well', { prototype: [[null],[false,[null,undefined,3]]] });
  equal([null,null,null,[null],null].compact(), [[]], "Array#compact | deep compact doesn't have index conflicts", { prototype: [[null]] });

  equal([false,false,false].compact(true), [], 'Array#compact | falsy | false is removed', { prototype: [false,false,false] });
  equal([0,0].compact(true), [], 'Array#compact | falsy | 0', { prototype: [0,0] });
  equal(['',''].compact(true), [], 'Array#compact | falsy | empty string', { prototype: ['',''] });
  equal([' ',' '].compact(true), [' ',' '], 'Array#compact | falsy | strings with spaces are kept');
  equal([8,3].compact(true), [8,3], 'Array#compact | falsy | numbers are kept');
  equal([false,undefined,false,null,NaN].compact(true), [], 'Array#compact | falsy | others are also handled', { prototype: [false,false,NaN] });

  equal([1,2,2,3].count(), 4, 'Array#count | no arugment numeric');
  equal([1,2,2,3].count(2), 2, 'Array#count | count 2s');
  equal(['a','b','c','c'].count(), 4, 'Array#count | no argument alphabet');
  equal(['a','b','c','c'].count('c'), 2, 'Array#count | count "c"s');
  equal([1,2,2,3].count(function(el) { return el % 2 == 0; }), 2, 'Array#count | count all odd numbers');
  equal([1,2,2,3].count(function(el) { return el > 2; }), 1, 'Array#count | count all numbers greater than 2');
  equal([1,2,2,3].count(function(el) { return el > 20; }), 0, 'Array#count | count all numbers greater than 20');
  equal([{a:1},{a:2},{a:1}].count({a:1}), 2, 'Array#count | count all a:1', { prototype: 0 });





  equal([1,2,2,3].remove(), [1,2,2,3], 'Array#remove | no argument numeric');
  equal([1,2,2,3].remove(2), [1,3], 'Array#remove | remove 2s');
  equal([0,1,2].exclude(0), [1,2], 'Array#remove | finds 0');
  equal(['a','b','c','c'].remove(), ['a','b','c','c'], 'Array#remove | no argument alphabet');
  equal(['a','b','c','c'].remove('c'), ['a','b'], 'Array#remove | remove "c"s');
  equal([1,2,2,3].remove(function(el) { return el % 2 == 0; }), [1,3], 'Array#remove | remove all odd numbers');
  equal([1,2,2,3].remove(function(el) { return el > 2; }), [1,2,2], 'Array#remove | remove all numbers greater than 2');
  equal([1,2,2,3].remove(function(el) { return el > 20; }), [1,2,2,3], 'Array#remove | remove all numbers greater than 20');
  equal([{a:1},{a:2},{a:1}].remove({a:1}), [{a:2}], 'Array#remove | remove all a:1');
  ['a'].remove(function(el,i,arr) {
    equal(el, 'a', 'Array#remove | first param should be the element');
    equal(i, 0, 'Array#remove | second param should be the index');
    equal(arr, ['a'], 'Array#remove | third param should be the array');
  });

  arr = [1,2,3];
  arr.remove(2);
  equal(arr, [1,3], 'Array#remove | should affect the original array');

  arr = [1,2,3];
  arr.remove(2,3);
  equal(arr, [1], 'Array#remove | can remove multiple elements');

  equal([f1].remove(f1), [], 'Array#remove | can find via strict equality');

  equal([1,2,3].remove([1,3]), [1,2,3], 'Array#remove | each argument is a separate element');
  equal([1,2,3].remove(1,3), [2], 'Array#remove | however multiple arguments still work');
  equal([[1,3],2].remove([1,3]), [2], 'Array#remove | and those elements are still properly found');



  equal([1,2,2,3].exclude(), [1,2,2,3], 'Array#exclude | no argument numeric');
  equal([1,2,2,3].exclude(2), [1,3], 'Array#exclude | exclude 2s');
  equal([0,1,2].exclude(0), [1,2], 'Array#exclude | finds 0');
  equal(['a','b','c','c'].exclude(), ['a','b','c','c'], 'Array#exclude | no argument alphabet');
  equal(['a','b','c','c'].exclude('c'), ['a','b'], 'Array#exclude | exclude "c"s');
  equal([1,2,2,3].exclude(function(el){ return el % 2 == 0; }), [1,3], 'Array#exclude | exclude all odd numbers');
  equal([1,2,2,3].exclude(function(el){ return el > 2; }), [1,2,2], 'Array#exclude | exclude all numbers greater than 2');
  equal([1,2,2,3].exclude(function(el){ return el > 20; }), [1,2,2,3], 'Array#exclude | exclude all numbers greater than 20');
  equal([{a:1},{a:2},{a:1}].exclude({a:1}), [{a:2}], 'Array#exclude | exclude all a:1');
  ['a'].exclude(function(el,i,arr){
    equal(el, 'a', 'Array#exclude | first param should be the element');
    equal(i, 0, 'Array#exclude | second param should be the index');
    equal(arr, ['a'], 'Array#exclude | third param should be the array');
  });

  arr = [1,2,3];
  arr.exclude(2);
  equal(arr, [1,2,3], 'Array#exclude | should not affect the original array');

  equal([1,2,2,3].exclude(2,3), [1], 'Array#exclude | can handle multiple arguments');
  equal([f1].exclude(f1), [], 'Array#exclude | can find via strict equality');

  equal([1,2,3].exclude([1,3]), [1,2,3], 'Array#exclude | each argument is a separate element');
  equal([1,2,3].exclude(1,3), [2], 'Array#exclude | however multiple arguments still work');
  equal([[1,3],2].exclude([1,3]), [2], 'Array#exclude | and those elements are still properly found');





  equal([1,2,2,3].removeAt(), [1,2,2,3], 'Array#removeAt | numeric | no argument');
  equal([1,2,2,3].removeAt(0), [2,2,3], 'Array#removeAt | numeric | 0');
  equal([1,2,2,3].removeAt(1), [1,2,3], 'Array#removeAt | numeric | 1');
  equal([1,2,2,3].removeAt(2), [1,2,3], 'Array#removeAt | numeric | 2');
  equal([1,2,2,3].removeAt(3), [1,2,2], 'Array#removeAt | numeric | 3');
  equal([1,2,2,3].removeAt(4), [1,2,2,3], 'Array#removeAt | numeric | 4');
  equal(['a','b','c','c'].removeAt(), ['a','b','c','c'], 'Array#removeAt | alphabet | no argument');
  equal(['a','b','c','c'].removeAt(0), ['b','c','c'], 'Array#removeAt | alphabet | 0');
  equal(['a','b','c','c'].removeAt(1), ['a','c','c'], 'Array#removeAt | alphabet | 1');
  equal(['a','b','c','c'].removeAt(2), ['a','b','c'], 'Array#removeAt | alphabet | 2');
  equal(['a','b','c','c'].removeAt(3), ['a','b','c'], 'Array#removeAt | alphabet | 3');
  equal(['a','b','c','c'].removeAt(4), ['a','b','c','c'], 'Array#removeAt | alphabet | 4');
  equal([{a:1},{a:2},{a:1}].removeAt(1), [{a:1},{a:1}], 'Array#removeAt | objects | 1');
  equal([1,2,2,3].removeAt(0,1), [2,3], 'Array#removeAt | 0 to 1');
  equal([1,2,2,3].removeAt(0,2), [3], 'Array#removeAt | 0 to 2');
  equal([1,2,2,3].removeAt(1,2), [1,3], 'Array#removeAt | 1 to 2');
  equal([1,2,2,3].removeAt(1,5), [1], 'Array#removeAt | 1 to 5');
  equal([1,2,2,3].removeAt(0,5), [], 'Array#removeAt | 0 to 5');
  equal([1,2,2,3].removeAt(null,5), [], 'Array#removeAt | also accepts null');

  arr = [1,2,3];
  arr.removeAt(1);
  equal(arr, [1,3], 'Array#removeAt | should affect the original array');







  equal([1,2,3].add(4), [1,2,3,4], 'Array#add | 1,2,3 + 4');
  equal(['a','b','c'].add('d'), ['a','b','c','d'], 'Array#add | a,b,c + d');
  equal([{a:1},{a:2}].add({a:3}), [{a:1},{a:2},{a:3}], 'Array#add | a:1,a:2 + a:3');
  equal([1,2,3].add([3,4,5]), [1,2,3,3,4,5], 'Array#add | 1,2,3 + 3,4,5');
  equal(['a','b','c'].add(['c','d','e']), ['a','b','c','c','d','e'], 'Array#add | a,b,c + c,d,e');
  equal([1,2,3].add([1,2,3]), [1,2,3,1,2,3], 'Array#add | 1,2,3 + 1,2,3');
  equal([1,2,3].add([3,2,1]), [1,2,3,3,2,1], 'Array#add | 1,2,3 + 3,2,1');
  equal([].add([3]), [3], 'Array#add | empty array + 3');
  equal([3].add([]), [3], 'Array#add | 3 + empty array');
  equal([].add([]), [], 'Array#add | 2 empty arrays');
  equal([null].add([]), [null], 'Array#add | [null] + empty array');
  equal([null].add([null]), [null, null], 'Array#add | [null] + [null]');
  equal([false].add([false]), [false, false], 'Array#add | [false] + [false]');
  equal([false].add([0]), [false, 0], 'Array#add | [false] + [0]');
  equal([false].add([null]), [false, null], 'Array#add | [false] + [null]');
  equal([false].add([undefined]), [false, undefined], 'Array#add | [false] + [undefined]');
  equal([{a:1},{b:2}].add([{b:2},{c:3}]), [{a:1},{b:2},{b:2},{c:3}], 'Array#add | a:1,b:2 + b:2,c:3');
  equal([1,1,3].add([1,5,6]), [1,1,3,1,5,6], 'Array#add | 1,1,3 + 1,5,6');
  equal([1,2,3].add([4,5,6]), [1,2,3,4,5,6], 'Array#add | 1,2,3 + 4,5,6');
  equal([1,2,3].add(1), [1,2,3,1], 'Array#add | 1,2,3 + 1');

  equal([1,2,3].add(4, 1), [1,4,2,3], 'Array#add | index 1 | 4');
  equal(['a','b','c'].add('d', 1), ['a','d','b','c'], 'Array#add | index 1 | d');
  equal([{a:1},{a:2}].add({a:3}, 1), [{a:1},{a:3},{a:2}], 'Array#add | index 1 | a:3');
  equal([1,2,3].add(4, 2), [1,2,4,3], 'Array#add | index 2 | 4');
  equal(['a','b','c'].add('d', 2), ['a','b','d','c'], 'Array#add | index 2 | d');
  equal([{a:1},{a:2}].add({a:3}, 2), [{a:1},{a:2},{a:3}], 'Array#add | index 2 | a:3');

  equal(['a','b','c'].add('d', 5), ['a','b','c','d'], 'Array#add | index 5 | d');
  equal(['a','b','c'].add('d', 0), ['d','a','b','c'], 'Array#add | index 0 | d');
  equal(['a','b','c'].add('d', -1), ['a','b','d','c'], 'Array#add | index -1 | d');
  equal(['a','b','c'].add('d', -2), ['a','d','b','c'], 'Array#add | index -2 | d');
  equal(['a','b','c'].add('d', -3), ['d','a','b','c'], 'Array#add | index -3 | d');
  equal(['a','b','c'].add('d', -4), ['d','a','b','c'], 'Array#add | index -4 | d');
  equal(['a','b','c'].add('d', null), ['d','a','b','c'], 'Array#add | null index | d');
  equal(['a','b','c'].add('d', undefined), ['a','b','c','d'], 'Array#add | undefined index | d');
  equal(['a','b','c'].add('d', 'a'), ['a','b','c','d'], 'Array#add | index a | d');
  equal(['a','b','c'].add('d', NaN), ['a','b','c','d'], 'Array#add | index NaN | d');

  arr = [1,2,3];
  arr.add(4);
  equal(arr, [1,2,3,4], 'Array#add | should affect the original array');



  equal([1,2,3].insert(4), [1,2,3,4], 'Array#insert | 1,2,3 + 4');
  equal(['a','b','c'].insert('d'), ['a','b','c','d'], 'Array#insert | a,b,c + d');
  equal([{a:1},{a:2}].insert({a:3}), [{a:1},{a:2},{a:3}], 'Array#insert | a:1,a:2 + a:3');
  equal([1,2,3].insert([3,4,5]), [1,2,3,3,4,5], 'Array#insert | 1,2,3 + 3,4,5');
  equal(['a','b','c'].insert(['c','d','e']), ['a','b','c','c','d','e'], 'Array#insert | a,b,c + c,d,e');
  equal([1,2,3].insert([1,2,3]), [1,2,3,1,2,3], 'Array#insert | 1,2,3 + 1,2,3');
  equal([1,2,3].insert([3,2,1]), [1,2,3,3,2,1], 'Array#insert | 1,2,3 + 3,2,1');
  equal([].insert([3]), [3], 'Array#insert | empty array + 3');
  equal([3].insert([]), [3], 'Array#insert | 3 + empty array');
  equal([].insert([]), [], 'Array#insert | 2 empty arrays');
  equal([null].insert([]), [null], 'Array#insert | [null] + empty array');
  equal([null].insert([null]), [null, null], 'Array#insert | [null] + [null]');
  equal([false].insert([false]), [false, false], 'Array#insert | [false] + [false]');
  equal([false].insert([0]), [false, 0], 'Array#insert | [false] + [0]');
  equal([false].insert([null]), [false, null], 'Array#insert | [false] + [null]');
  equal([false].insert([undefined]), [false, undefined], 'Array#insert | [false] + [undefined]');
  equal([{a:1},{b:2}].insert([{b:2},{c:3}]), [{a:1},{b:2},{b:2},{c:3}], 'Array#insert | a:1,b:2 + b:2,c:3');
  equal([1,1,3].insert([1,5,6]), [1,1,3,1,5,6], 'Array#insert | 1,1,3 + 1,5,6');
  equal([1,2,3].insert([4,5,6]), [1,2,3,4,5,6], 'Array#insert | 1,2,3 + 4,5,6');
  equal([1,2,3].insert(1), [1,2,3,1], 'Array#insert | 1,2,3 + 1');

  equal([1,2,3].insert(4, 1), [1,4,2,3], 'Array#insert | index 1 | 4');
  equal(['a','b','c'].insert('d', 1), ['a','d','b','c'], 'Array#insert | index 1 | d');
  equal([{a:1},{a:2}].insert({a:3}, 1), [{a:1},{a:3},{a:2}], 'Array#insert | index 1 | a:3');
  equal([1,2,3].insert(4, 2), [1,2,4,3], 'Array#insert | index 2 | 4');
  equal(['a','b','c'].insert('d', 2), ['a','b','d','c'], 'Array#insert | index 2 | d');
  equal([{a:1},{a:2}].insert({a:3}, 2), [{a:1},{a:2},{a:3}], 'Array#insert | index 2 | a:3');
  equal(['a','b','c'].insert('d', 5), ['a','b','c','d'], 'Array#insert | index 5 | d');

  equal(['a','b','c'].insert('d', 0), ['d','a','b','c'], 'Array#insert | index 0 | d');
  equal(['a','b','c'].insert('d', -1), ['a','b','d','c'], 'Array#insert | index -1 | d');
  equal(['a','b','c'].insert('d', -2), ['a','d','b','c'], 'Array#insert | index -2 | d');
  equal(['a','b','c'].insert('d', -3), ['d','a','b','c'], 'Array#insert | index -3 | d');
  equal(['a','b','c'].insert('d', -4), ['d','a','b','c'], 'Array#insert | index -4 | d');
  equal(['a','b','c'].insert('d', null), ['d','a','b','c'], 'Array#insert | null index | d');
  equal(['a','b','c'].insert('d', undefined), ['a','b','c','d'], 'Array#insert | undefined index | d');
  equal(['a','b','c'].insert('d', 'a'), ['a','b','c','d'], 'Array#insert | index a | d');
  equal(['a','b','c'].insert('d', NaN), ['a','b','c','d'], 'Array#insert | index NaN | d');

  equal(['a','b','c'].insert('d', '0'), ['d','a','b','c'], 'Array#insert | string numerals should also be recognized');

  arr = [1,2,3];
  arr.insert(4);
  equal(arr, [1,2,3,4], 'Array#insert | should affect the original array');



  equal([1,2,3].include(4), [1,2,3,4], 'Array#include | 1,2,3 + 4', { prototype: false });
  equal(['a','b','c'].include('d'), ['a','b','c','d'], 'Array#include | a,b,c + d', { prototype: false });
  equal([{a:1},{a:2}].include({a:3}), [{a:1},{a:2},{a:3}], 'Array#include | a:1,a:2 + a:3', { prototype: false });
  equal([1,2,3].include([3,4,5]), [1,2,3,3,4,5], 'Array#include | 1,2,3 + 3,4,5', { prototype: false, mootools: [1,2,3,[3,4,5]] });
  equal(['a','b','c'].include(['c','d','e']), ['a','b','c','c','d','e'], 'Array#include | a,b,c + c,d,e', { prototype: false, mootools: ['a','b','c',['c','d','e']] });
  equal([1,2,3].include([1,2,3]), [1,2,3,1,2,3], 'Array#include | 1,2,3 + 1,2,3', { prototype: false, mootools: [1,2,3,[1,2,3]] });
  equal([1,2,3].include([3,2,1]), [1,2,3,3,2,1], 'Array#include | 1,2,3 + 3,2,1', { prototype: false, mootools: [1,2,3,[3,2,1]] });
  equal([].include([3]), [3], 'Array#include | empty array + 3', { prototype: false, mootools: [[3]] });
  equal([3].include([]), [3], 'Array#include | 3 + empty array', { prototype: false, mootools: [3,[]] });
  equal([].include([]), [], 'Array#include | 2 empty arrays', { prototype: false, mootools: [[]] });
  equal([null].include([]), [null], 'Array#include | [null] + empty array', { prototype: false, mootools: [null,[]] });
  equal([null].include([null]), [null, null], 'Array#include | [null] + [null]', { prototype: false, mootools: [null,[null]] });
  equal([false].include([false]), [false, false], 'Array#include | [false] + [false]', { prototype: false, mootools: [false,[false]] });
  equal([false].include([0]), [false, 0], 'Array#include | [false] + [0]', { prototype: true, mootools: [false,[0]] });
  equal([false].include([null]), [false, null], 'Array#include | [false] + [null]', { prototype: true, mootools: [false, [null]] });
  equal([false].include([undefined]), [false, undefined], 'Array#include | [false] + [undefined]', { prototype: true, mootools: [false,[undefined]] });
  equal([{a:1},{b:2}].include([{b:2},{c:3}]), [{a:1},{b:2},{b:2},{c:3}], 'Array#include | a:1,b:2 + b:2,c:3', { prototype: false, mootools: [{a:1},{b:2},[{b:2},{c:3}]] });
  equal([1,1,3].include([1,5,6]), [1,1,3,1,5,6], 'Array#include | 1,1,3 + 1,5,6', { prototype: false, mootools: [1,1,3,[1,5,6]] });
  equal([1,2,3].include([4,5,6]), [1,2,3,4,5,6], 'Array#include | 1,2,3 + 4,5,6', { prototype: false, mootools: [1,2,3,[4,5,6]] });
  equal([1,2,3].include(1), [1,2,3,1], 'Array#include | 1,2,3 + 1', { prototype: true, mootools: [1,2,3] });

  equal([1,2,3].include(4, 1), [1,4,2,3], 'Array#include | index 1 | 4', { prototype: false, mootools: [1,2,3,4] });
  equal(['a','b','c'].include('d', 1), ['a','d','b','c'], 'Array#include | index 1 | d', { prototype: false, mootools: ['a','b','c','d'] });
  equal([{a:1},{a:2}].include({a:3}, 1), [{a:1},{a:3},{a:2}], 'Array#include | index 1 | a:3', { prototype: false, mootools: [{a:1},{a:2},{a:3}] });
  equal([1,2,3].include(4, 2), [1,2,4,3], 'Array#include | index 2 | 4', { prototype: false, mootools: [1,2,3,4] });
  equal(['a','b','c'].include('d', 2), ['a','b','d','c'], 'Array#include | index 2 | d', { prototype: false, mootools: ['a','b','c','d'] });
  equal([{a:1},{a:2}].include({a:3}, 2), [{a:1},{a:2},{a:3}], 'Array#include | index 2 | a:3', { prototype: false });
  equal(['a','b','c'].include('d', 5), ['a','b','c','d'], 'Array#include | index 5 | d', { prototype: false });

  equal(['a','b','c'].include('d', 0), ['d','a','b','c'], 'Array#include | index 0 | d', { prototype: false, mootools: ['a','b','c','d'] });
  equal(['a','b','c'].include('d', -1), ['a','b','d','c'], 'Array#include | index -1 | d', { prototype: false, mootools: ['a','b','c','d'] });
  equal(['a','b','c'].include('d', -2), ['a','d','b','c'], 'Array#include | index -2 | d', { prototype: false, mootools: ['a','b','c','d'] });
  equal(['a','b','c'].include('d', -3), ['d','a','b','c'], 'Array#include | index -3 | d', { prototype: false, mootools: ['a','b','c','d'] });
  equal(['a','b','c'].include('d', -4), ['d','a','b','c'], 'Array#include | index -4 | d', { prototype: false, mootools: ['a','b','c','d'] });
  equal(['a','b','c'].include('d', null), ['d','a','b','c'], 'Array#include | null index | d', { prototype: false });
  equal(['a','b','c'].include('d', undefined), ['a','b','c','d'], 'Array#include | undefined index | d', { prototype: false });
  equal(['a','b','c'].include('d', 'a'), ['a','b','c','d'], 'Array#include | index a | d', { prototype: false });
  equal(['a','b','c'].include('d', NaN), ['a','b','c','d'], 'Array#include | index NaN | d', { prototype: false });

  arr = [1,2,3];
  arr.include(4);
  equal(arr, [1,2,3], 'Array#include | should not affect the original array', { mootools: [1,2,3,4] });


  arr = [1,2,3];
  var arr2 = arr.clone();
  equal(arr, arr2, 'Array#clone | should clone the array');
  arr2.remove(2);
  equal(arr, [1,2,3], 'Array#clone | original array should be untouched');
  equal(arr2, [1,3], 'Array#clone | new array should be modified');






  equal([1,2,3].isEmpty(), false, 'Array#empty | 1,2,3');
  equal([].isEmpty(), true, 'Array#empty | empty array');
  equal([null].isEmpty(), true, 'Array#empty | [null]');
  equal([undefined].isEmpty(), true, 'Array#empty | [undefined]');
  equal([null,null].isEmpty(), true, 'Array#empty | [null,null]');
  equal([undefined,undefined].isEmpty(), true, 'Array#empty | [undefined,undefined]');
  equal([false,false].isEmpty(), false, 'Array#empty | [false,false]');
  equal([0,0].isEmpty(), false, 'Array#empty | [0,0]');


  raisesError(function(){ [1,2,3].any() }, 'Array#any | no argument raises a TypeError', { prototype: false });
  equal([1,2,3].any(1), true, 'Array#any | numeric | 1');
  equal([1,2,3].any(4), false, 'Array#any | numeric | 4');
  equal([1,2,3].any('a'), false, 'Array#any | numeric | a');
  equal(['a','b','c'].any('a'), true, 'Array#any | alphabet | a');
  equal(['a','b','c'].any('f'), false, 'Array#any | alphabet | f');
  equal(['a','b','c'].any(/[a-f]/), true, 'Array#any | alphabet | /[a-f]/', { prototype: false });
  equal(['a','b','c'].any(/[m-z]/), false, 'Array#any | alphabet | /[m-z]/');
  equal([{a:1},{a:2},{a:1}].any(1), false, 'Array#any | objects | 1');
  equal([0].any(0), true, 'Array#any | [0] | 0');
  equal([{a:1},{a:2},{a:1}].any({a:1}), true, 'Array#any | objects | a:1', { prototype: false });

  equal(['a','b','c'].any(function(e) { return e.length > 1; }), false, 'Array#any | alphabet | length greater than 1');
  equal(['a','b','c'].any(function(e) { return e.length < 2; }), true, 'Array#any | alphabet | length less than 2');
  equal(['a','bar','cat'].any(function(e) { return e.length < 2; }), true, 'Array#any | a,bar,cat | length less than 2');
  equal([{a:1},{a:2},{a:1}].any(function(e) { return e['a'] == 1; }), true, 'Array#any | objects | key "a" is 1');
  equal([{a:1},{a:2},{a:1}].any(function(e) { return e['b'] == 1; }), false, 'Array#any | objects | key "b" is 1');

  [1].any(function() {
    equal(this.toString(), 'wasabi', 'Array#any | scope should be passable');
  }, 'wasabi');




  raisesError(function() { [1,2,3].none(); }, 'Array#none | no argument raises a TypeError', { prototype: false });
  equal([1,2,3].none(1), false, 'Array#none | numeric | 1');
  equal([1,2,3].none(4), true, 'Array#none | numeric | 4');
  equal([1,2,3].none('a'), true, 'Array#none | numeric | a');
  equal(['a','b','c'].none('a'), false, 'Array#none | alphabet | a');
  equal(['a','b','c'].none('f'), true, 'Array#none | alphabet | f');
  equal(['a','b','c'].none(/[a-f]/), false, 'Array#none | alphabet | /[a-f]/', { prototype: true });
  equal(['a','b','c'].none(/[m-z]/), true, 'Array#none | alphabet | /[m-z]/');
  equal([{a:1},{a:2},{a:1}].none(1), true, 'Array#none | objects | 1');
  equal([{a:1},{a:2},{a:1}].none({a:1}), false, 'Array#none | objects | a:1', { prototype: true });

  equal(['a','b','c'].none(function(e) { return e.length > 1; }), true, 'Array#none | alphabet | length is greater than 1');
  equal(['a','b','c'].none(function(e) { return e.length < 2; }), false, 'Array#none | alphabet | length is less than 2');
  equal(['a','bar','cat'].none(function(e) { return e.length < 2; }), false, 'Array#none | a,bar,cat | length is less than 2');
  equal([{a:1},{a:2},{a:1}].none(function(e) { return e['a'] == 1; }), false, 'Array#none | objects | key "a" is 1');
  equal([{a:1},{a:2},{a:1}].none(function(e) { return e['b'] == 1; }), true, 'Array#none | objects | key "b" is 1');



  raisesError(function() { [1,2,3].all(); }, 'Array#all | no argument raises a type error', { prototype: false });
  equal([1,2,3].all(1), false, 'Array#all | numeric | 1');
  equal([1,1,1].all(1), true, 'Array#all | numeric | 1 is true for all');
  equal([1,2,3].all(3), false, 'Array#all | numeric | 3');
  equal(['a','b','c'].all('a'), false, 'Array#all | alphabet | a');
  equal(['a','a','a'].all('a'), true, 'Array#all | alphabet | a is true for all');
  equal(['a','b','c'].all('f'), false, 'Array#all | alphabet | f');
  equal(['a','b','c'].all(/[a-f]/), true, 'Array#all | alphabet | /[a-f]/', { prototype: false });
  equal(['a','b','c'].all(/[a-b]/), false, 'Array#all | alphabet | /[m-z]/');
  equal([{a:1},{a:2},{a:1}].all(1), false, 'Array#all | objects | 1');
  equal([{a:1},{a:2},{a:1}].all({a:1}), false, 'Array#all | objects | a:1');
  equal([{a:1},{a:1},{a:1}].all({a:1}), true, 'Array#all | objects | a:1 is true for all', { prototype: false });


  equal(['a','b','c'].all(function(e) { return e.length > 1; }), false, 'Array#all | alphabet | length is greater than 1');
  equal(['a','b','c'].all(function(e) { return e.length < 2; }), true, 'Array#all | alphabet | length is less than 2');
  equal(['a','bar','cat'].all(function(e) { return e.length < 2; }), false, 'Array#all | a,bar,cat | length is less than 2');
  equal([{a:1},{a:2},{a:1}].all(function(e) { return e['a'] == 1; }), false, 'Array#all | objects | key "a" is 1');
  equal([{a:1},{a:2},{a:1}].all(function(e) { return e['b'] == 1; }), false, 'Array#all | objects | key "b" is 1');
  equal([{a:1},{a:1},{a:1}].all(function(e) { return e['a'] == 1; }), true, 'Array#all | objects | key "a" is 1 for all');


  [1].all(function() {
    equal(this.toString(), 'wasabi', 'Array#all | scope should be passable');
  }, 'wasabi');



  equal([1,2,3].flatten(), [1,2,3], 'Array#flatten | 1,2,3');
  equal(['a','b','c'].flatten(), ['a','b','c'], 'Array#flatten | a,b,c');
  equal([{a:1},{a:2},{a:1}].flatten(), [{a:1},{a:2},{a:1}], 'Array#flatten | a:1,a:2,a:1');
  equal([[1],[2],[3]].flatten(), [1,2,3], 'Array#flatten | [1],[2],[3]');
  equal([[1,2],[3]].flatten(), [1,2,3], 'Array#flatten | [1,2],[3]');
  equal([[1,2,3]].flatten(), [1,2,3], 'Array#flatten | [1,2,3]');
  equal([['a'],['b'],['c']].flatten(), ['a','b','c'], 'Array#flatten | [a],[b],[c]');
  equal([['a','b'],['c']].flatten(), ['a','b','c'], 'Array#flatten | [a,b],[c]');
  equal([['a','b','c']].flatten(), ['a','b','c'], 'Array#flatten | [a,b,c]');
  equal([[{a:1}],[{a:2}],[{a:1}]].flatten(), [{a:1},{a:2},{a:1}], 'Array#flatten | [a:1],[a:2],[a:1]');
  equal([[{a:1},{a:2}],[{a:1}]].flatten(), [{a:1},{a:2},{a:1}], 'Array#flatten | [a:1,a:2],[a:1]');
  equal([[{a:1},{a:2},{a:1}]].flatten(), [{a:1},{a:2},{a:1}], 'Array#flatten | [a:1,a:2,a:1]');
  equal([[[['a','b'],'c',['d','e']],'f'],['g']].flatten(), ['a','b','c','d','e','f','g'], 'Array#flatten | [[a,b],c,[d,e],f],g');

  equal([[[['a','b'],'c',['d','e']],'f'],['g']].flatten(1), [[['a','b'],'c',['d','e']],'f','g'], 'Array#flatten | can flatten only first level', { prototype: ['a','b','c','d','e','f','g'] });
  equal([[[['a','b'],'c',['d','e']],'f'],['g']].flatten(false), ['a','b','c','d','e','f','g'], 'Array#flatten | wont explode on false');
  equal([[[['a','b'],'c',['d','e']],'f'],['g']].flatten(true), [[['a','b'],'c',['d','e']],'f','g'], 'Array#flatten | wont explode on true', { prototype: ['a','b','c','d','e','f','g'] });

  // Prototype will compact but only if IE, so we can't assert this in that environment.
  skipEnvironments(['prototype'], function() {
    equal([undefined].flatten().length, sparseArraySupport ? 1 : 0, 'Array#flatten | should not compact arrays');
  });





  arr = ['more','everyone!','bring','the','family'];
  equal(arr.sortBy('length'), ['the','more','bring','family','everyone!'], 'Array#sortBy | sorting by length');
  equal(arr.sortBy('length', true), ['everyone!','family','bring','more','the'], 'Array#sortBy | desc | sorting by length', { prototype: ['the','more','bring','family','everyone!'] });

  equal(arr.sortBy(function(a) { return a.length; }), ['the','more','bring','family','everyone!'], 'Array#sortBy | sort by length by function');
  equal(arr.sortBy(function(a) { return a.length; }, true), ['everyone!','family','bring','more','the'], 'Array#sortBy | desc | sort by length by function', { prototype: ['the','more','bring','family','everyone!'] });

  arr = [{a:'foo'},{a:'bar'},{a:'skittles'}];
  equal(arr.sortBy('a'), [{a:'bar'},{a:'foo'},{a:'skittles'}], 'Array#sortBy | sort by key "a"');
  equal(arr.sortBy('a', true), [{a:'skittles'},{a:'foo'},{a:'bar'}], 'Array#sortBy | desc | sort by key "a"', { prototype: [{a:'bar'},{a:'foo'},{a:'skittles'}] });

  arr = [1,2,3];
  arr.sortBy(function(n){ return 3 - n; });
  equal(arr, [1,2,3], 'Array#sortBy | should not be destructive');

  equal([1,2,3].sortBy(undefined), [1,2,3], 'Array#sortBy | undefined');
  equal([1,2,3].sortBy(null), [1,2,3], 'Array#sortBy | null');
  equal([1,2,3].sortBy(4), [1,2,3], 'Array#sortBy | number');

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

  equal([a,b,c,d,e].sortBy(), [d,b,e,c,a], 'Array#sortBy | objects with "valueOf" defined will also be sorted properly');

  arr = [1,2,3,4,5,6,7,8,9,10];
  var firsts = [];
  firsts.push(arr.randomize().first());
  firsts.push(arr.randomize().first());
  firsts.push(arr.randomize().first());
  firsts.push(arr.randomize().first());
  firsts.push(arr.randomize().first());
  firsts.push(arr.randomize().first());
  firsts.push(arr.randomize().first());
  firsts.push(arr.randomize().first());
  firsts.push(arr.randomize().first());
  firsts.push(arr.randomize().first());

  /* Note that there is a built-in 0.00000001% chance that this test will fail */
  equal(firsts.all(function(a) { return a == 1; }), false, 'Array#randomize');




  // Inherits from array...

  var Soup = function(){}, x;
  Soup.prototype = [1,2,3];

  x = new Soup();
  count = 0;

  x.each(function() {
    count++;
  });
  x.find(function() {
    count++;
  });
  x.findAll(function() {
    count++;
  });

  equal(count, 9, 'Array | array elements in the prototype chain are also properly iterated');


  // Inherits from sparse array...

  arr = ['a'];
  arr[20] = 'b';

  Soup.prototype = arr;

  x = new Soup();
  count = 0;

  x.each(function() {
    count++;
  });

  equal(count, 2, 'Array | sparse array elements in the prototype chain are also properly iterated');

  // This test cannot be framed in a meaninful way... IE will not set the length property
  // when pushing new elements and other browsers will not work on sparse arrays...
  // equal(count, 6, 'Array | objects that inherit from arrays can still iterate');


  // Array.create

  equal(Array.create(), [], 'Array.create | no args');
  equal(Array.create('one'), ['one'], 'Array.create | string');
  equal(Array.create(2), [2], 'Array.create | number');
  equal(Array.create([2]), [2], 'Array.create | in array | number');
  equal(Array.create(true), [true], 'Array.create | boolean');
  equal(Array.create([true]), [true], 'Array.create | in array | boolean');
  equal(Array.create(null), [null], 'Array.create | null');
  equal(Array.create([null]), [null], 'Array.create | in array | null');
  equal(Array.create(undefined), [undefined], 'Array.create | mixed');
  equal(Array.create([undefined]), [undefined], 'Array.create | in array | mixed');
  equal(Array.create('one', 2, true, null), ['one', 2, true, null], 'Array.create | mixed 1');
  equal(Array.create('one', 2, true, undefined), ['one', 2, true, undefined], 'Array.create | mixed 2');

  equal(Array.create([1,2,3]), [1,2,3], 'Array.create | passing an array');
  equal(Array.create([[1,2,3]]), [[1,2,3]], 'Array.create | in array | is nested');
  equal(Array.create([1,2,3], [1,2,3]), [1,2,3,1,2,3], 'Array.create | passing two arrays will concat them');
  equal(Array.create([1,2,3], 'four'), [1,2,3,'four'], 'Array.create | passing an array and another object will concat them');

  equal(Array.create({a:1}), [{a:1}], 'Array.create | object');
  equal(Array.create([{a:1}]), [{a:1}], 'Array.create | in array | object');
  equal(Array.create({a:1}, {b:2}), [{a:1},{b:2}], 'Array.create | two objects');
  equal(Array.create({a:1}, ['b']), [{a:1}, 'b'], 'Array.create | object and array');
  equal(Array.create({a:1}, 'b'), [{a:1}, 'b'], 'Array.create | object and string');

  equal((function(){ return Array.create(arguments); })('one','two'), ['one','two'], 'Array.create | works on an arguments object');
  equal((function(){ return Array.create(arguments); })('one').slice, Array.prototype.slice, 'Array.create | converted arguments object is a true array');
  equal((function(){ return Array.create(arguments); })('one','two').slice, Array.prototype.slice, 'Array.create | two | converted arguments object is a true array');

  var args = (function() { return arguments; })(true, 1, 'two');
  equal(Array.create([args]), [args], 'Array.create | nested arguments is a nested array');

  // Array#zip

  equal([1, 2, 3].zip(), [[1], [2], [3]], 'Array.zip | one array');
  equal([1, 2, 3].zip([4, 5, 6]), [[1, 4], [2, 5], [3, 6]], 'Array.zip | two arrays');
  equal([1, 2, 3].zip([4, 5, 6], [7, 8, 9]), [[1, 4, 7], [2, 5, 8], [3, 6, 9]], 'Array.zip | three arrays');
  equal([1, 2].zip([4, 5, 6], [7, 8, 9]), [[1, 4, 7], [2, 5, 8]], 'Array.zip | constrained by length of first');
  equal([4, 5, 6].zip([1, 2], [8]), [[4, 1, 8], [5, 2, null], [6, null, null]], 'Array.zip | filled with null', { prototype: [[4,1,8],[5,2,undefined],[6,undefined,undefined]]});



  // Array#findIndex

  equal(['a','b','c'].findIndex('b'), 1, 'Array#findIndex | b in a,b,c');
  equal(['a','b','c'].findIndex('b', 0), 1, 'Array#findIndex | b in a,b,c from 0');
  equal(['a','b','c'].findIndex('a'), 0, 'Array#findIndex | a in a,b,c');
  equal(['a','b','c'].findIndex('f'), -1, 'Array#findIndex | f in a,b,c');

  equal(['a','b','c','b'].findIndex('b'), 1, 'Array#findIndex | finds first instance');
  equal(['a','b','c','b'].findIndex('b', 2), 3, 'Array#findIndex | finds first instance from index');

  equal([5,2,4].findIndex(5), 0, 'Array#findIndex | 5 in 5,2,4');
  equal([5,2,4].findIndex(2), 1, 'Array#findIndex | 2 in 5,2,4');
  equal([5,2,4].findIndex(4), 2, 'Array#findIndex | 4 in 5,2,4');
  equal([5,2,4,4].findIndex(4, 3), 3, 'Array#findIndex | 4 in 5,2,4,4 from index 3');

  equal([5,2,4,4].findIndex(4, 10), -1, 'Array#findIndex | 4 in 5,2,4,4 from index 10');
  equal([5,2,4,4].findIndex(4, -10), 2, 'Array#findIndex | 4 in 5,2,4,4 from index -10');
  equal([5,2,4,4].findIndex(4, -1), 3, 'Array#findIndex | 4 in 5,2,4,4 from index -1');

  equal([{ foo: 'bar' }].findIndex({ foo: 'bar' }), 0, 'Array#findIndex | will find deep objects');
  equal([{ foo: 'bar' }].findIndex(function(a) { return a.foo === 'bar'; }), 0, 'Array#findIndex | will run against a function');

  equal(['a','b','c'].findIndex(/[bz]/), 1, 'Array#findIndex | matches regexp');

  var people = [
    { name: 'jim',    age: 27, hair: 'brown'  },
    { name: 'mary',   age: 52, hair: 'blonde' },
    { name: 'ronnie', age: 13, hair: 'brown'  },
    { name: 'edmund', age: 27, hair: 'blonde' }
  ];

  equal(people.findIndex(function(person) { return person.age == 13; }), 2, 'Array#findIndex | JSON objects');

  // Array#sample

  arr = [1,2,3,4,5,6,7,8,9,10];
  var samples = [];
  samples.push(arr.sample());
  samples.push(arr.sample());
  samples.push(arr.sample());
  samples.push(arr.sample());
  samples.push(arr.sample());
  samples.push(arr.sample());
  samples.push(arr.sample());
  samples.push(arr.sample());
  samples.push(arr.sample());
  samples.push(arr.sample());

  /* Note that there is a built-in 0.00000001% chance that this test will fail */
  equal(samples.all(function(a) { return a == 1; }), false, 'Array#sample');

  equal(typeof arr.sample(), 'number', 'Array#sample | no params');
  equal(arr.sample(1).length, 1, 'Array#sample | 1');
  equal(arr.sample(2).length, 2, 'Array#sample | 2');
  equal(arr.sample(3).length, 3, 'Array#sample | 3');
  equal(arr.sample(4).length, 4, 'Array#sample | 4');
  equal(arr.sample(11).length, 10, "Array#sample | can't sample more than the length of the array");
  equal(arr.sample(10).unique().length, arr.length, "Array#sample | should not sample the same element twice");

  equal(arr.sample(0).length, 0, 'Array#sample | 0');

  // Array#findAll - Complex matching

  var people = [
    { name: 'jim',    age: 27, hair: 'brown'  },
    { name: 'mary',   age: 52, hair: 'blonde' },
    { name: 'ronnie', age: 13, hair: 'brown'  },
    { name: 'edmund', age: 27, hair: 'blonde' },
    { name: 'buddy', age: 82, hair: { color: 'red', type: 'long', cost: 15, last_cut: new Date(2010, 4, 18) } }
  ];


  equal(people.findAll({}), people, 'Array#findAll | complex | empty object');
  equal(people.findAll(), [], 'Array#findAll | complex | no arguments');
  equal(people.findAll('age'), [], 'Array#findAll | complex | string argument');
  equal(people.findAll(4), [], 'Array#findAll | complex | number argument');
  equal(people.findAll({ age: 27 }), [people[0], people[3]], 'Array#findAll | complex | one property');
  equal(people.findAll({ age: 27, hair: 'brown' }), [people[0]], 'Array#findAll | complex | two properties');
  equal(people.findAll({ hair: { color: 'red' }}), [people[4]], 'Array#findAll | complex | nested property');
  equal(people.findAll({ hair: { color: 'green' }}), [], 'Array#findAll | complex | non-matching nested property');
  equal(people.findAll({ hair: { color: 'red', type: 'long' }}), [people[4]], 'Array#findAll | complex | two nested properties');
  equal(people.findAll({ hair: { color: 'green', type: 'mean' }}), [], 'Array#findAll | complex | two non-matching nested properties');
  equal(people.findAll({ hair: { color: 'red', type: 'mean' }}), [], 'Array#findAll | complex | two nested properties, one non-matching');
  equal(people.findAll({ hair: { color: 'red', life: 'long' }}), [], 'Array#findAll | complex | two nested properties, one non-existing');
  equal(people.findAll({ hair: { color: /r/ }}), [people[4]], 'Array#findAll | complex | nested regex');
  equal(people.findAll({ hair: { cost: 15 }}), [people[4]], 'Array#findAll | complex | nested number');
  equal(people.findAll({ hair: { cost: 23 }}), [], 'Array#findAll | complex | nested non-matching number');
  equal(people.findAll({ hair: { cost: undefined }}), [], 'Array#findAll | complex | nested undefined property');
  equal(people.findAll({ hair: { cost: NaN }}), [], 'Array#findAll | complex | nested property is NaN');
  equal(people.findAll({ hair: { color: function(c){ return c == 'red'; } }}), [people[4]], 'Array#findAll | complex | nested function');
  equal(people.findAll({ some: { random: { shit: {}}}}), [], 'Array#findAll | complex | totally unrelated properties');
  equal(people.findAll({ hair: { last_cut: new Date(2010, 4, 18) }}), [people[4]], 'Array#findAll | complex | simple date');

  equal(people.some({ age: 27 }), true, 'Array#some | complex | one property');
  equal(people.some({ age: 27, hair: 'brown' }), true, 'Array#some | complex | two properties');
  equal(people.some({ hair: { color: 'red' }}), true, 'Array#some | complex | nested property');
  equal(people.some({ hair: { color: 'green' }}), false, 'Array#some | complex | non-matching nested property');
  equal(people.some({ hair: { color: 'red', type: 'long' }}), true, 'Array#some | complex | two nested properties');
  equal(people.some({ hair: { color: 'green', type: 'mean' }}), false, 'Array#some | complex | two non-matching nested properties');
  equal(people.some({ hair: { color: 'red', type: 'mean' }}), false, 'Array#some | complex | two nested properties, one non-matching');
  equal(people.some({ hair: { color: 'red', life: 'long' }}), false, 'Array#some | complex | two nested properties, one non-existing');
  equal(people.some({ hair: { color: /r/ }}), true, 'Array#some | complex | nested regex');
  equal(people.some({ hair: { cost: 15 }}), true, 'Array#some | complex | nested number');
  equal(people.some({ hair: { cost: 23 }}), false, 'Array#some | complex | nested non-matching number');
  equal(people.some({ hair: { cost: undefined }}), false, 'Array#some | complex | nested undefined property');
  equal(people.some({ hair: { cost: NaN }}), false, 'Array#some | complex | nested property is NaN');
  equal(people.some({ hair: { color: function(c){ return c == 'red'; } }}), true, 'Array#some | complex | nested function');
  equal(people.some({ some: { random: { shit: {}}}}), false, 'Array#some | complex | totally unrelated properties');
  equal(people.some({ hair: { last_cut: new Date(2010, 4, 18) }}), true, 'Array#some | complex | simple date');

  equal(people.none({ age: 27 }), false, 'Array#none | complex | one property');
  equal(people.none({ age: 27, hair: 'brown' }), false, 'Array#none | complex | two properties');
  equal(people.none({ hair: { color: 'red' }}), false, 'Array#none | complex | nested property');
  equal(people.none({ hair: { color: 'green' }}), true, 'Array#none | complex | non-matching nested property');
  equal(people.none({ hair: { color: 'red', type: 'long' }}), false, 'Array#none | complex | two nested properties');
  equal(people.none({ hair: { color: 'green', type: 'mean' }}), true, 'Array#none | complex | two non-matching nested properties');
  equal(people.none({ hair: { color: 'red', type: 'mean' }}), true, 'Array#none | complex | two nested properties, one non-matching');
  equal(people.none({ hair: { color: 'red', life: 'long' }}), true, 'Array#none | complex | two nested properties, one non-existing');
  equal(people.none({ hair: { color: /r/ }}), false, 'Array#none | complex | nested regex');
  equal(people.none({ hair: { cost: 15 }}), false, 'Array#none | complex | nested number');
  equal(people.none({ hair: { cost: 23 }}), true, 'Array#none | complex | nested non-matching number');
  equal(people.none({ hair: { cost: undefined }}), true, 'Array#none | complex | nested undefined property');
  equal(people.none({ hair: { cost: NaN }}), true, 'Array#none | complex | nested property is NaN');
  equal(people.none({ hair: { color: function(c){ return c == 'red'; } }}), false, 'Array#none | complex | nested function');
  equal(people.none({ none: { random: { shit: {}}}}), true, 'Array#none | complex | totally unrelated properties');
  equal(people.none({ hair: { last_cut: new Date(2010, 4, 18) }}), false, 'Array#none | complex | simple date');


  // Testing change to fuzzy finding on objects


  arr = [{name: 'joe', age: 25}];
  var match = { name: /j/ };

  equal(arr.every(match), true, 'Array#every is now fuzzy');
  equal(arr.some(match), true, 'Array#some is now fuzzy');
  equal(arr.none(match), false, 'Array#none is now fuzzy');
  equal(arr.count(match), 1, 'Array#count is now fuzzy');
  equal(arr.find(match), arr[0], 'Array#find is now fuzzy');
  equal(arr.findAll(match), [arr[0]], 'Array#findAll is now fuzzy');
  equal(arr.findIndex(match), 0, 'Array#findIndex is now fuzzy');
  equal(arr.exclude(match).length, 0, 'Array#exclude is now fuzzy');


  equal(arr.clone().remove(match).length, 0, 'Array#remove is now fuzzy');
  equal(arr.clone().remove(match).length, 0, 'Array#remove is now fuzzy');

  equal([arr].intersect([match]), [], 'Array#intersect is NOT fuzzy');
  equal([match].intersect([arr]), [], 'Array#intersect reverse is NOT fuzzy');

  equal(arr.subtract([match]), arr, 'Array#subtract is NOT fuzzy');
  equal([match].subtract([arr]), [match], 'Array#subtract reverse is NOT fuzzy');

  equal(arr.unique(match), arr, 'Array#unique is NOT fuzzy');
  equal([match].unique(arr), [match], 'Array#unique reverse is NOT fuzzy');



  // Testing sortBy behavior

  var CapturedSortOrder       = Array.AlphanumericSortOrder;
  var CapturedSortIgnore      = Array.AlphanumericSortIgnore;
  var CapturedSortIgnoreCase  = Array.AlphanumericSortIgnoreCase;
  var CapturedSortEquivalents = Array.AlphanumericSortEquivalents;


  equal([0,1,2,3,4].sortBy(), [0,1,2,3,4], 'Array#sortBy | 0 is properly sorted');
  equal(['0','1','2','3','4'].sortBy(), ['0','1','2','3','4'], 'Array#sortBy | string numerals are properly sorted');
  equal(['c','B','a'].sortBy(), ['a','B','c'], 'Array#sortBy | upper-case is properly sorted');
  equal(['back','Bad','banker'].sortBy(), ['back','Bad','banker'], 'Array#sortBy | case is ignored by default');
  equal(['c','B','a','ä','ò','p'].sortBy(), ['a','ä','B','c','ò','p'], 'Array#sortBy | should allow normalization if exists');
  equal(['apple','apples'].sortBy(), ['apple','apples'], 'Array#sortBy | basic string length');
  equal(['has','hàs','had','hàd'].sortBy(), ['had','hàd','has','hàs'], 'Array#sortBy | special chars basic');

  arr = ['San','San Cristobal','San Juan','San Teodoro','San Tomas','Santa Barbara','Santa Clara','Santa Cruz','Santo Domingo'];
  equal(arr.sortBy(), arr, 'Array#sortBy | spaces are counted');

  equal(['AM','AB'].sortBy(), ['AB','AM'], '0 index is properly sorted');


  arr = ['#foob','(fooc','fooa'];
  equal(arr.sortBy(), arr, 'Array#sortBy | special chars are not ignored by default');

  arr = [
    '8braham',
    'a4raham',
    'abraham'
  ];

  equal(arr.sortBy(), arr, 'Array#sortBy | Numbers are filtered to the top');

  arr = [
    'pine',
    'pino',
    'piñata'
  ];

  equal(arr.sortBy(), arr, 'Array#sortBy | Spanish ñ is respected');

  var french_names = [
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

  equal(french_names.randomize().sortBy(), french_names, 'Array#sortBy | sorting french names');
  equal(french_names.map('toUpperCase').randomize().sortBy(), french_names.map('toUpperCase'), 'Array#sortBy | sorting french names in upper case');


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

  equal(arr.randomize().sortBy(), arr, 'Array#sortBy | Default collation');

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

  equal(arr.randomize().sortBy(), arr, 'Array#sortBy | Czech/Lithuanian order is respected');


  arr = [
    'cat',
    'drone',
    'ðroll',
    'ebert'
  ];

  equal(arr.randomize().sortBy(), arr, 'Array#sortBy | Icelandic ð order is respected');

  arr = [
    'goth',
    'ğoad',
    'hover',
    'sing',
    'şeparate',
    'tumble'
  ];

  equal(arr.randomize().sortBy(), arr, 'Array#sortBy | Turkish order is respected');

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

  equal(arr.randomize().sortBy(), arr, 'Array#sortBy | Polish order is respected');

  arr = [
    'cab',
    'opec',
    'still',
    'zounds',
    'æee',
    'ølaf',
    'ålegra'
  ];

  equal(arr.randomize().sortBy(), arr, 'Array#sortBy | Danish/Norwegian order is respected');

  arr = [
    'llama',
    'luck',
    'lye'
  ];



  // Compressions simply can't be handled without a complex collation system
  // as there is simply no way fundamentally to know what was intended as a
  // compression. For example "catch a llama" vs "catch Al Lama"
  equal(arr.randomize().sortBy(), arr, 'Array#sortBy | Compressions are not handled');


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

  equal(arr.randomize().sortBy(), arr, 'Array#sortBy | Standard Western-Latin equivalents are enforced');

  // Swedish collation
  var swedish_words = [
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

  equal(swedish_words.sortBy(), swedish_words, 'Array#sortBy | swedish strings sorted on utf8_general_ci');

  var swedish_collated = [
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

  Array.AlphanumericSortEquivalents['ö'] = null;
  Array.AlphanumericSortEquivalents['ä'] = null;

  equal(swedish_words.sortBy(), swedish_collated, 'Array#sortBy | removing equivalents can restore sort order');

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

  Array.AlphanumericSortIgnoreCase = true;
  equal(arr.sortBy(), expected, 'Array#sortBy | allows case ignore');


  expected = [
    'aDella',
    'Adrian',
    'aBBey',
    'abner'
  ];

  Array.AlphanumericSortOrder = 'dba';
  equal(arr.sortBy(), expected, 'Array#sortBy | allows other order');

  expected = [
    'aDella',
    'abner',
    'Adrian',
    'aBBey'
  ];


  Array.AlphanumericSortIgnore = /[abcde]/g;
  equal(arr.sortBy(), expected, 'Array#sortBy | allows custom ignore');

  Array.AlphanumericSortOrder = 'cba';
  Array.AlphanumericSortIgnore = CapturedSortIgnore;
  arr = ['cotÉ', 'cÔte', 'cÔtÉ', 'andere', 'ändere'];
  equal(arr.sortBy(), arr, 'Array#sortBy | cba');

  Array.AlphanumericSortOrder = CapturedSortOrder;
  Array.AlphanumericSortIgnore = CapturedSortIgnore;
  Array.AlphanumericSortIgnoreCase = CapturedSortIgnoreCase;
  Array.AlphanumericSortEquivalents = CapturedSortEquivalents;



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


  equal(arr1.union(arr2), unionExpected, 'Array#union | complex array unions');
  equal(arr1.intersect(arr2), intersectExpected, 'Array#union | complex array intersects');


  equal([function(){ return 'a' }].intersect([function() { return 'a'; }, function() { return 'b'; }]), [], 'Array#intersect | functions are always unique');

  equal([xFunc].intersect([]), [], 'Array#intersect | functions with different content | [x] & []');
  equal([yFunc].intersect([]), [], 'Array#intersect | functions with different content | [y] & []');
  equal([].intersect([xFunc]), [], 'Array#intersect | functions with different content | [] & [x]');
  equal([].intersect([yFunc]), [], 'Array#intersect | functions with different content | [] & [y]');
  equal([].intersect([xFunc, yFunc]), [], 'Array#intersect | functions with different content | [] & [x,y]');
  equal([xFunc].intersect([xFunc]), [xFunc], 'Array#intersect | functions with different content | [x] & [x]');
  equal([xFunc].intersect([yFunc]), [], 'Array#intersect | functions with different content | [x] & [y]');
  equal([xFunc].intersect([xFunc, yFunc]), [xFunc], 'Array#intersect | functions with different content | [x] & [x,y]');
  equal([xFunc, xFunc].intersect([xFunc, yFunc]), [xFunc], 'Array#intersect | functions with different content | [x,x] & [x,y]');
  equal([xFunc, xFunc].intersect([xFunc, xFunc]), [xFunc], 'Array#intersect | functions with different content | [x,x] & [x,x]');
  equal([xFunc, yFunc].intersect([xFunc, yFunc]), [xFunc,yFunc], 'Array#intersect | functions with different content | [x,y] & [x,y]');
  equal([xFunc, yFunc].intersect([yFunc, xFunc]), [xFunc,yFunc], 'Array#intersect | functions with different content | [x,y] & [y,x]');
  equal([xFunc, yFunc].intersect([yFunc, yFunc]), [yFunc], 'Array#intersect | functions with different content | [x,y] & [y,y]');
  equal([yFunc, xFunc].intersect([yFunc, xFunc]), [yFunc,xFunc], 'Array#intersect | functions with different content | [y,x] & [y,x]');
  equal([yFunc, xFunc].intersect([xFunc, yFunc]), [yFunc,xFunc], 'Array#intersect | functions with different content | [y,x] & [x,y]');
  equal([yFunc, xFunc].intersect([xFunc, xFunc]), [xFunc], 'Array#intersect | functions with different content | [y,x] & [x,x]');
  equal([xFunc, xFunc].intersect([yFunc, yFunc]), [], 'Array#intersect | functions with different content | [x,x] & [y,y]');
  equal([yFunc, yFunc].intersect([xFunc, xFunc]), [], 'Array#intersect | functions with different content | [y,y] & [x,x]');

  equal([xFunc].subtract([]), [xFunc], 'Array#subtract | functions with different content | [x] - []');
  equal([yFunc].subtract([]), [yFunc], 'Array#subtract | functions with different content | [y] - []');
  equal([].subtract([xFunc]), [], 'Array#subtract | functions with different content | [] - [x]');
  equal([].subtract([yFunc]), [], 'Array#subtract | functions with different content | [] - [y]');
  equal([].subtract([xFunc, yFunc]), [], 'Array#subtract | functions with different content | [] - [x,y]');
  equal([xFunc].subtract([xFunc]), [], 'Array#subtract | functions with different content | [x] - [x]');
  equal([xFunc].subtract([yFunc]), [xFunc], 'Array#subtract | functions with different content | [x] - [y]');
  equal([xFunc].subtract([xFunc, yFunc]), [], 'Array#subtract | functions with different content | [x] - [x,y]');
  equal([xFunc, xFunc].subtract([xFunc, yFunc]), [], 'Array#subtract | functions with different content | [x,x] - [x,y]');
  equal([xFunc, xFunc].subtract([xFunc, xFunc]), [], 'Array#subtract | functions with different content | [x,x] - [x,x]');
  equal([xFunc, yFunc].subtract([xFunc, yFunc]), [], 'Array#subtract | functions with different content | [x,y] - [x,y]');
  equal([xFunc, yFunc].subtract([yFunc, xFunc]), [], 'Array#subtract | functions with different content | [x,y] - [y,x]');
  equal([xFunc, yFunc].subtract([yFunc, yFunc]), [xFunc], 'Array#subtract | functions with different content | [x,y] - [y,y]');
  equal([yFunc, xFunc].subtract([yFunc, xFunc]), [], 'Array#subtract | functions with different content | [y,x] - [y,x]');
  equal([yFunc, xFunc].subtract([xFunc, yFunc]), [], 'Array#subtract | functions with different content | [y,x] - [x,y]');
  equal([yFunc, xFunc].subtract([xFunc, xFunc]), [yFunc], 'Array#subtract | functions with different content | [y,x] - [x,x]');
  equal([xFunc, xFunc].subtract([yFunc, yFunc]), [xFunc,xFunc], 'Array#subtract | functions with different content | [x,x] - [y,y]');
  equal([yFunc, yFunc].subtract([xFunc, xFunc]), [yFunc,yFunc], 'Array#subtract | functions with different content | [y,y] - [x,x]');

  xFunc = function() {};
  yFunc = function() {};

  equal([xFunc].intersect([]), [], 'Array#intersect | functions with identical content | [x] & []');
  equal([yFunc].intersect([]), [], 'Array#intersect | functions with identical content | [y] & []');
  equal([].intersect([xFunc]), [], 'Array#intersect | functions with identical content | [] & [x]');
  equal([].intersect([yFunc]), [], 'Array#intersect | functions with identical content | [] & [y]');
  equal([].intersect([xFunc, yFunc]), [], 'Array#intersect | functions with identical content | [] & [x,y]');
  equal([xFunc].intersect([xFunc]), [xFunc], 'Array#intersect | functions with identical content | [x] & [x]');
  equal([xFunc].intersect([yFunc]), [], 'Array#intersect | functions with identical content | [x] & [y]');
  equal([xFunc].intersect([xFunc, yFunc]), [xFunc], 'Array#intersect | functions with identical content | [x] & [x,y]');
  equal([xFunc, xFunc].intersect([xFunc, yFunc]), [xFunc], 'Array#intersect | functions with identical content | [x,x] & [x,y]');
  equal([xFunc, xFunc].intersect([xFunc, xFunc]), [xFunc], 'Array#intersect | functions with identical content | [x,x] & [x,x]');
  equal([xFunc, yFunc].intersect([xFunc, yFunc]), [xFunc,yFunc], 'Array#intersect | functions with identical content | [x,y] & [x,y]');
  equal([xFunc, yFunc].intersect([yFunc, xFunc]), [xFunc,yFunc], 'Array#intersect | functions with identical content | [x,y] & [y,x]');
  equal([xFunc, yFunc].intersect([yFunc, yFunc]), [yFunc], 'jrray#intersect | functions with identical content | [x,y] & [y,y]');
  equal([yFunc, xFunc].intersect([yFunc, xFunc]), [yFunc,xFunc], 'Array#intersect | functions with identical content | [y,x] & [y,x]');
  equal([yFunc, xFunc].intersect([xFunc, yFunc]), [yFunc,xFunc], 'Array#intersect | functions with identical content | [y,x] & [x,y]');
  equal([yFunc, xFunc].intersect([xFunc, xFunc]), [xFunc], 'Array#intersect | functions with identical content | [y,x] & [x,x]');
  equal([xFunc, xFunc].intersect([yFunc, yFunc]), [], 'Array#intersect | functions with identical content | [x,x] & [y,y]');
  equal([yFunc, yFunc].intersect([xFunc, xFunc]), [], 'Array#intersect | functions with identical content | [y,y] & [x,x]');

  equal([xFunc].subtract([]), [xFunc], 'Array#subtract | functions with identical content | [x] - []');
  equal([yFunc].subtract([]), [yFunc], 'Array#subtract | functions with identical content | [y] - []');
  equal([].subtract([xFunc]), [], 'Array#subtract | functions with identical content | [] - [x]');
  equal([].subtract([yFunc]), [], 'Array#subtract | functions with identical content | [] - [y]');
  equal([].subtract([xFunc, yFunc]), [], 'Array#subtract | functions with identical content | [] - [x,y]');
  equal([xFunc].subtract([xFunc]), [], 'Array#subtract | functions with identical content | [x] - [x]');
  equal([xFunc].subtract([yFunc]), [xFunc], 'Array#subtract | functions with identical content | [x] - [y]');
  equal([xFunc].subtract([xFunc, yFunc]), [], 'Array#subtract | functions with identical content | [x] - [x,y]');
  equal([xFunc, xFunc].subtract([xFunc, yFunc]), [], 'Array#subtract | functions with identical content | [x,x] - [x,y]');
  equal([xFunc, xFunc].subtract([xFunc, xFunc]), [], 'Array#subtract | functions with identical content | [x,x] - [x,x]');
  equal([xFunc, yFunc].subtract([xFunc, yFunc]), [], 'Array#subtract | functions with identical content | [x,y] - [x,y]');
  equal([xFunc, yFunc].subtract([yFunc, xFunc]), [], 'Array#subtract | functions with identical content | [x,y] - [y,x]');
  equal([xFunc, yFunc].subtract([yFunc, yFunc]), [xFunc], 'Array#subtract | functions with identical content | [x,y] - [y,y]');
  equal([yFunc, xFunc].subtract([yFunc, xFunc]), [], 'Array#subtract | functions with identical content | [y,x] - [y,x]');
  equal([yFunc, xFunc].subtract([xFunc, yFunc]), [], 'Array#subtract | functions with identical content | [y,x] - [x,y]');
  equal([yFunc, xFunc].subtract([xFunc, xFunc]), [yFunc], 'Array#subtract | functions with identical content | [y,x] - [x,x]');
  equal([xFunc, xFunc].subtract([yFunc, yFunc]), [xFunc,xFunc], 'Array#subtract | functions with identical content | [x,x] - [y,y]');
  equal([yFunc, yFunc].subtract([xFunc, xFunc]), [yFunc,yFunc], 'Array#subtract | functions with identical content | [y,y] - [x,x]');

  equal([function(){ return 'a' }, function() { return 'b'; }].subtract([function() { return 'a'; }]).length, 2, 'Array#subtract | functions are always unique');
  equal([xFunc, yFunc].subtract([xFunc]), [yFunc], 'Array#subtract | function references are ===');


  equal([['a',1]].intersect([['a',1],['b',2]]), [['a',1]], 'Array#intersect | nested arrays are not flattened');
  equal([['a',1],['b',2]].subtract([['a',1]]), [['b',2]], 'Array#subtract | nested arrays are not flattened');



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


  arrayEquivalent([1,2,3].union([3,4,5]), [1,2,3,4,5], 'Array#union | Basic');
  arrayEquivalent([1,2,3].union(['1','2','3']), [1,2,3,'1','2','3'], 'Array#union | Numbers vs. Strings');
  arrayEquivalent([[1,2,3]].union([['1','2','3']]), [[1,2,3],['1','2','3']], 'Array#union | Numbers vs. Strings nested');

  arrayEquivalent([1,2,3].union([1,2,3]), [1,2,3], 'Array#union | Number array');
  arrayEquivalent([[1,2,3]].union([[1,2,3]]), [[1,2,3]], 'Array#union | Nested number array');
  arrayEquivalent([[1,2,3]].union([[3,2,1]]), [[1,2,3],[3,2,1]], 'Array#union | Nested and reversed');

  arrayEquivalent([aFunc].union([bFunc]), [aFunc, bFunc], 'Array#union | Function references');
  arrayEquivalent([aFunc].union([bFunc, cFunc]), [aFunc, bFunc, cFunc], 'Array#union | Function references');
  arrayEquivalent([aFunc, bFunc].union([bFunc, cFunc]), [aFunc, bFunc, cFunc], 'Array#union | Function references');
  arrayEquivalent([aFunc, bFunc, cFunc].union([aFunc, bFunc, cFunc]), [aFunc, bFunc, cFunc], 'Array#union | Function references');
  arrayEquivalent([cFunc, cFunc].union([cFunc, cFunc]), [cFunc], 'Array#union | Function references');
  arrayEquivalent([].union([aFunc]), [aFunc], 'Array#union | Function references');

  equal([function() { return 'a'; }].union([function() { return 'a'; }]).length, 2, 'Array#union | Functions are never equivalent');


  arrayEquivalent([/bar/].union([/bas/]), [/bar/,/bas/], 'Array#union | Regexes');
  arrayEquivalent([[/bar/]].union([[/bas/,/bap/]]), [[/bar/],[/bas/,/bap/]], 'Array#union | Nested Regexes');
  arrayEquivalent([{ reg: /bar/ }].union([{ reg: /bar/ }, { reg: /map/ }]), [{ reg: /bar/ }, { reg: /map/ }], 'Array#union | Object Regexes');

  arrayEquivalent([true].union([false]), [true,false], 'Array#union | Booleans');
  arrayEquivalent([true].union([true]), [true], 'Array#union | Same Booleans');
  arrayEquivalent([[true]].union([[true, false]]), [[true],[true, false]], 'Array#union | Nested Booleans');
  arrayEquivalent([{ b: false }].union([{ b: false }, { b: true }]), [{ b: false }, { b: true }], 'Array#union | Object Booleans');


  arrayEquivalent([{},{}].union([{},{}]), [{}], 'Array#union | empty object array');
  arrayEquivalent([[{}]].union([[{},{}]]), [[{}],[{},{}]], 'Array#union | nested empty object array');
  arrayEquivalent([[{},{}]].union([[{},{}]]), [[{},{}]], 'Array#union | nested double object array');

  arrayEquivalent([{0:1}].union([[1]]), [{0:1},[1]], 'Array#union | object posing as array');
  arrayEquivalent([{}].union([[]]), [{},[]], 'Array#union | empty object vs. empty array');

  arrayEquivalent([[[],1]].union([[[1]]]), [[[],1], [[1]]], 'Array#union | empty array, 1 vs. empty array WITH one');

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


  arrayEquivalent([aObj].union([aObj]), [aObj], 'Array#union | Nested objects a + a');
  arrayEquivalent([aObj].union([bObj]), [aObj], 'Array#union | Nested objects a + b');
  arrayEquivalent([aObj,bObj,cObj].union([]), [aObj, cObj], 'Array#union | Nested objects a,b,c + []');
  arrayEquivalent([].union([aObj,bObj,cObj]), [aObj, cObj], 'Array#union | Nested objects [] + a,b,c');
  arrayEquivalent([aObj,bObj].union([cObj]), [aObj, cObj], 'Array#union | Nested objects a,b + c');
  arrayEquivalent([cObj, cObj].union([cObj, cObj]), [cObj], 'Array#union | Nested objects c,c + c,c');
  arrayEquivalent([aObj, bObj, cObj, dObj].union([]), [aObj, cObj, dObj], 'Array#union | Nested objects a,b,c,d + []');
  arrayEquivalent([].union([aObj, bObj, cObj, dObj]), [aObj, cObj, dObj], 'Array#union | Nested objects a,b,c,d + a,c,d');
  arrayEquivalent([aObj, bObj].union([cObj, dObj]), [aObj, cObj, dObj], 'Array#union | Nested objects a,b + c,d');

  arrayEquivalent([aObj, bObj, cObj, dObj, eObj].union([aObj, bObj, cObj, dObj, eObj]), [aObj, cObj, dObj, eObj], 'Array#union | Nested objects a,b,c,d,e + a,b,c,d,e');

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


  arrayEquivalent([aFuncObj].union([aFuncObj]), [aFuncObj], 'Array#union | Nested objects with functions');
  arrayEquivalent([aFuncObj].union([bFuncObj]), [aFuncObj], 'Array#union | Nested objects with functions');
  arrayEquivalent([aFuncObj,bFuncObj,cFuncObj].union([]), [aFuncObj, cFuncObj], 'Array#union | Nested objects with functions');
  arrayEquivalent([aFuncObj,bFuncObj].union([cFuncObj]), [aFuncObj, cFuncObj], 'Array#union | Nested objects with functions');
  arrayEquivalent([cFuncObj, cFuncObj].union([cFuncObj, cFuncObj]), [cFuncObj], 'Array#union | Nested objects with functions meh');


  arrayEquivalent([NaN,NaN].union([NaN,NaN]), [NaN], 'Array#union | NaN');
  arrayEquivalent([null,null].union([null,null]), [null], 'Array#union | Null');
  arrayEquivalent(arrayOfUndefined.union(arrayOfUndefined), sparseArraySupport ? [undefined] : [], 'Array#union | undefined');


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

  equal([aObj].union([bObj]).length, 1, 'Array#union | Properties may not be in the same order.');


  xFunc = function (){ return 'x'; }
  yFunc = function (){ return 'y'; }

  equal([xFunc].union([]), [xFunc], 'Array#union | functions with different content | [x] + []');
  equal([yFunc].union([]), [yFunc], 'Array#union | functions with different content | [y] + []');
  equal([].union([xFunc]), [xFunc], 'Array#union | functions with different content | [] + [x]');
  equal([].union([yFunc]), [yFunc], 'Array#union | functions with different content | [] + [y]');
  equal([].union([xFunc, yFunc]), [xFunc,yFunc], 'Array#union | functions with different content | [] + [x,y]');
  equal([xFunc].union([xFunc]), [xFunc], 'Array#union | functions with different content | [x] + [x]');
  equal([xFunc].union([yFunc]), [xFunc,yFunc], 'Array#union | functions with different content | [x] + [y]');
  equal([xFunc].union([xFunc, yFunc]), [xFunc,yFunc], 'Array#union | functions with different content | [x] + [x,y]');
  equal([xFunc, xFunc].union([xFunc, yFunc]), [xFunc,yFunc], 'Array#union | functions with different content | [x,x] + [x,y]');
  equal([xFunc, xFunc].union([xFunc, xFunc]), [xFunc], 'Array#union | functions with different content | [x,x] + [x,x]');
  equal([xFunc, yFunc].union([xFunc, yFunc]), [xFunc,yFunc], 'Array#union | functions with different content | [x,y] + [x,y]');
  equal([xFunc, yFunc].union([yFunc, xFunc]), [xFunc,yFunc], 'Array#union | functions with different content | [x,y] + [y,x]');
  equal([xFunc, yFunc].union([yFunc, yFunc]), [xFunc,yFunc], 'Array#union | functions with different content | [x,y] + [y,y]');
  equal([yFunc, xFunc].union([yFunc, xFunc]), [yFunc,xFunc], 'Array#union | functions with different content | [y,x] + [y,x]');
  equal([yFunc, xFunc].union([xFunc, yFunc]), [yFunc,xFunc], 'Array#union | functions with different content | [y,x] + [x,y]');
  equal([yFunc, xFunc].union([xFunc, xFunc]), [yFunc,xFunc], 'Array#union | functions with different content | [y,x] + [x,x]');
  equal([xFunc, xFunc].union([yFunc, yFunc]), [xFunc,yFunc], 'Array#union | functions with different content | [x,x] + [y,y]');
  equal([yFunc, yFunc].union([xFunc, xFunc]), [yFunc,xFunc], 'Array#union | functions with different content | [y,y] + [x,x]');


  xFunc = function (){}
  yFunc = function (){}

  equal([xFunc].union([]), [xFunc], 'Array#union | functions with identical content | [x] + []');
  equal([yFunc].union([]), [yFunc], 'Array#union | functions with identical content | [y] + []');
  equal([].union([xFunc]), [xFunc], 'Array#union | functions with identical content | [] + [x]');
  equal([].union([yFunc]), [yFunc], 'Array#union | functions with identical content | [] + [y]');
  equal([].union([xFunc, yFunc]), [xFunc,yFunc], 'Array#union | functions with identical content | [] + [x,y]');
  equal([xFunc].union([xFunc]), [xFunc], 'Array#union | functions with identical content | [x] + [x]');
  equal([xFunc].union([yFunc]), [xFunc,yFunc], 'Array#union | functions with identical content | [x] + [y]');
  equal([xFunc].union([xFunc, yFunc]), [xFunc,yFunc], 'Array#union | functions with identical content | [x] + [x,y]');
  equal([xFunc, xFunc].union([xFunc, yFunc]), [xFunc,yFunc], 'Array#union | functions with identical content | [x,x] + [x,y]');
  equal([xFunc, xFunc].union([xFunc, xFunc]), [xFunc], 'Array#union | functions with identical content | [x,x] + [x,x]');
  equal([xFunc, yFunc].union([xFunc, yFunc]), [xFunc,yFunc], 'Array#union | functions with identical content | [x,y] + [x,y]');
  equal([xFunc, yFunc].union([yFunc, xFunc]), [xFunc,yFunc], 'Array#union | functions with identical content | [x,y] + [y,x]');
  equal([xFunc, yFunc].union([yFunc, yFunc]), [xFunc,yFunc], 'Array#union | functions with identical content | [x,y] + [y,y]');
  equal([yFunc, xFunc].union([yFunc, xFunc]), [yFunc,xFunc], 'Array#union | functions with identical content | [y,x] + [y,x]');
  equal([yFunc, xFunc].union([xFunc, yFunc]), [yFunc,xFunc], 'Array#union | functions with identical content | [y,x] + [x,y]');
  equal([yFunc, xFunc].union([xFunc, xFunc]), [yFunc,xFunc], 'Array#union | functions with identical content | [y,x] + [x,x]');
  equal([xFunc, xFunc].union([yFunc, yFunc]), [xFunc,yFunc], 'Array#union | functions with identical content | [x,x] + [y,y]');
  equal([yFunc, yFunc].union([xFunc, xFunc]), [yFunc,xFunc], 'Array#union | functions with identical content | [y,y] + [x,x]');



  // Issue #157 Ensure that instances can be subject to fuzzy matches despite not being "objects"

  function Foo(a) {
    this.a = a;
  }

  var one   = new Foo('one');
  var two   = new Foo('two');
  var three = new Foo('three');
  var four  = new Foo(new Date(2001, 3, 15));

  equal([one, two, three, four].findAll({ a: 'one' }), [one], 'Array#findAll | matches class instances | object with string');
  equal([one, two, three, four].findAll({ a: /t/ }), [two, three], 'Array#findAll | matches class instances | object with regex');
  equal([one, two, three, four].findAll('one'), [], 'Array#findAll | matches class instances | string');
  equal([one, two, three, four].findAll(/t/), [], 'Array#findAll | matches class instances | regex');
  equal([one, two, three, four].findAll(true), [], 'Array#findAll | matches class instances | boolean');
  equal([one, two, three, four].findAll(new Date()), [], 'Array#findAll | matches class instances | now');
  equal([one, two, three, four].findAll(new Date(2001, 3, 15)), [], 'Array#findAll | matches class instances | correct date');
  equal([one, two, three, four].findAll(null), [], 'Array#findAll | matches class instances | null');
  equal([one, two, three, four].findAll(undefined), [], 'Array#findAll | matches class instances | undefined');
  equal([one, two, three, four].findAll({ a: 'twof' }), [], 'Array#findAll | matches class instances | nonexistent string');
  equal([one, two, three, four].findAll({ b: 'one' }), [], 'Array#findAll | matches class instances | nonexistent property');
  equal([one, two, three, four].findAll({}), [one, two, three, four], 'Array#findAll | matches class instances | empty object');
  equal([one, two, three, four].findAll({ a: new Date(2001, 3, 15) }), [four], 'Array#findAll | matches class instances | object with correct date');
  equal([one, two, three, four].findAll({ b: new Date(2001, 3, 15) }), [], 'Array#findAll | matches class instances | object with correct date but wrong property');
  equal([one, two, three, four].findAll({ a: new Date(2001, 3, 16) }), [], 'Array#findAll | matches class instances | object with incorrect date');
  equal([one, two, three, four].findAll({ a: new Date(2001, 3, 15, 0, 0, 0, 1) }), [], 'Array#findAll | matches class instances | object with date off by 1ms');

  var five = new Foo(one);

  equal([five].findAll({ a: 'one' }), [], 'Array#findAll | nested instances | object with string');
  equal([five].findAll({ a: { a: 'one' } }), [five], 'Array#findAll | nested instances | object with double nested string');
  equal([five].findAll({ a: { a: 'two' } }), [], 'Array#findAll | nested instances | object with double nested string but incorrect');







  // Object enumerable methods

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
    equal(value, obj1[key],      'Object enumerable methods | second argument is always the value');
    equal(o, obj1,               'Object enumerable methods | third argument is always the original object');
    equal(this, obj1,            'Object enumerable methods | "this" is always the original object');
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

  var obj3 = testCloneObject(obj1); obj3['blue'] = 4;
  var obj4 = testCloneObject(obj2); obj4['blue'] = {age:11};

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


  // Object.isEmpty

  testClassAndInstance('isEmpty', {}, [], true, 'Object.isEmpty | object is empty');
  testClassAndInstance('isEmpty', { broken: 'wear' }, [], false, 'Object.isEmpty | object is not empty');
  testClassAndInstance('isEmpty', { length: 0 }, [], false, 'Object.isEmpty | simple object with length property is not empty');
  testClassAndInstance('isEmpty', { foo: null }, [], false, 'Object.isEmpty | null is still counted');
  testClassAndInstance('isEmpty', { foo: undefined }, [], false, 'Object.isEmpty | undefined is still counted');
  testClassAndInstance('isEmpty', { foo: NaN }, [], false, 'Object.isEmpty | undefined is still counted');
  testClassAndInstance('isEmpty', [], [], true, 'Object.isEmpty | empty array is empty');

  raisesError(function(){ Object.isEmpty(null); }, 'Object.isEmpty | null is empty');
  raisesError(function(){ Object.isEmpty(undefined); }, 'Object.isEmpty | undefined is empty');
  raisesError(function(){ Object.isEmpty(''); }, 'Object.isEmpty | empty string is empty');
  raisesError(function(){ Object.isEmpty('wasabi'); }, 'Object.isEmpty | non-empty string is not empty');
  raisesError(function(){ Object.isEmpty(NaN); }, 'Object.isEmpty | NaN is empty');
  raisesError(function(){ Object.isEmpty(8); }, 'Object.isEmpty | 8 is empty');
  raisesError(function(){ Object.isEmpty((function(){ return this; }).call('wasabi')); }, 'Object.isEmpty | non-primitive string still errors');
  raisesError(function(){ Object.isEmpty((function(){ return this; }).call(8)); }, 'Object.isEmpty | non-primitive number still errors');


  // Object.size

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

  raisesError(function(){ Object.size('foo') }, 'Object.size | string primitive');
  raisesError(function(){ Object.size(1) }, 'Object.size | number primitive');
  raisesError(function(){ Object.size(true) }, 'Object.size | boolean primitive');
  raisesError(function(){ Object.size(null) }, 'Object.size | null');
  raisesError(function(){ Object.size(undefined) }, 'Object.size | undefined');
  raisesError(function(){ Object.size((function(){ return this; }).call('foo')) }, 'Object.size | non-primitive string still errors');
  raisesError(function(){ Object.size((function(){ return this; }).call(1)) }, 'Object.size | non-primitive number still errors');
  raisesError(function(){ Object.size((function(){ return this; }).call(true)) }, 'Object.size | non-primitive boolean still errors');

  var Foo = function(){};
  testClassAndInstance('size', new Foo, [], 0, 'Object.size | class instances');

  var Foo = function(a){ this.a = a; };
  testClassAndInstance('size', new Foo, [], 1, 'Object.size | class instances with a single property');



  // Fuzzy matching behavior on functions.

  var fn = function(){ count ++; };
  count = 0;

  [1,2,3].findAll(fn);
  equal(count, 3, 'Array#findAll | functions treated as callbacks when matching against non-functions');

  count = 0;
  [function() {}, function() {}, function() {}].findAll(fn);
  equal(count, 3, 'Array#findAll | functions are not directly matched');


  if(Object.equal) {
    var fn1 = function() {};
    var fn2 = function() {};
    equal([fn1, fn1, fn1].all(function(el) { return Object.equal(el, fn1); }), true, 'Array#all | functions can be matched inside the callback');
    equal([fn1, fn1, fn2].all(function(el) { return Object.equal(el, fn1); }), false, 'Array#all | functions can be matched inside the callback');
    equal([fn1, fn1, fn2].any(function(el) { return Object.equal(el, fn1); }), true, 'Array#any | functions can be matched inside the callback');
    equal([fn1, fn2, fn1].findAll(function(el) { return Object.equal(el, fn1); }), [fn1, fn1], 'Array#findAll | functions can be matched inside the callback');
    equal([fn1, fn2, fn1].findAll(function(el) { return Object.equal(el, fn2); }), [fn2], 'Array#findAll | fn2 | functions can be matched inside the callback');
  }

  // Object.each

  var fn = function () {};
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
  result = Object.each(obj, function(key, value, o) {
    equal(key, keys[count], 'Object.each | accepts a block', { mootools: values[count] });
    equal(value, values[count], 'Object.each | accepts a block', { mootools: keys[count] });
    equal(o, obj, 'Object.each | accepts a block | object is third param');
    count++;
  });
  equal(count, 4, 'Object.each | accepts a block | iterated properly');
  equal(result, obj, 'Object.each | accepts a block | result should equal object passed in', { mootools: undefined });

  raisesError(function(){
    Object.each({foo:'bar'});
  }, 'Object.each | no iterator raises an error');

  testClassAndInstance('each', obj, [function () {}], obj, 'Object.size | each returns itself');


});

