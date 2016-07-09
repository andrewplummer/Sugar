// Using the [] constructor with undefined values in <= IE8 will effectively
// produce a sparse array (no property actually gets set) the only workaround
// is to push undefined directly onto the array.
safeArray = function() {
  var arr = [];
  for (var i = 0; i < arguments.length; i++) {
    arr.push(arguments[i]);
  }
  return arr;
}

testGetSparseArray = function(index) {
  var arr = [];
  for (var i = 1; i < arguments.length; i++) {
    arr[index + i - 1] = arguments[i];
  }
  return arr;
}

assertRandomized = function(arr, iterFn) {
  var allOne = true;
  for (var i = 0; i < arr.length; i++) {
    if (iterFn(i) !== 1) {
      allOne = false;
    }
  }
  // Note that there is a built-in 0.00000001% chance that this test will fail */
  equal(allOne, false, 'sufficiently randomized');
}

assertFromIndex = function(arr, methodName, args, expected, msg) {
  equal(run(arr, methodName + 'FromIndex', args), expected, msg);
}

assertFromIndexArgs = function(arr, methodName, args, expected, msg) {
  var called = false;
  var fn = function(acc, val, idx, a) {
    called = true;
    for (var i = 0; i < expected.length; i++) {
      var obj = expected[i];
      equal(arguments[i], obj, 'argument ' + i + ' should be ' + obj);
    }
    equal(arguments[arguments.length - 1], arr, 'last argument should be the array');
  }
  args.push(fn);
  run(arr, methodName + 'FromIndex', args);
  if (!expected) {
    equal(called, false, 'should not have been called');
  }
}

oneUndefined    = safeArray(undefined);
twoUndefined    = safeArray(undefined, undefined);
threeUndefined  = safeArray(undefined, undefined, undefined);
nestedUndefined = safeArray(oneUndefined);

undefinedWith1 = [1];
undefinedWith1.push(undefined);

undefinedWithNull = [null];
undefinedWithNull.push(undefined);
