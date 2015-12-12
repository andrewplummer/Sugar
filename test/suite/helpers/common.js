testIterateOverObject = function (obj, fn) {
  var key;
  for(key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    fn.call(obj, key, obj[key]);
  }
}

testGetClass = function(obj) {
  return testInternalToString.call(obj);
}

testIsArray = function(obj) {
  return testGetClass(obj) === '[object Array]';
}

testIsRegExp = function(obj) {
  return testGetClass(obj) === '[object RegExp]';
}

testIsDate = function(obj) {
  return testGetClass(obj) === '[object Date]';
}

testIsFunction = function(obj) {
  return testGetClass(obj) === '[object Function]';
}

testGetPrivateProp = function(obj, name) {
  return obj['_sugar_' + name];
}

testClone = function (obj) {
  if (obj == null || typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  if (testIsDate(obj)) {
    return new Date(obj.getTime());
  } else if (testIsRegExp(obj)) {
    return testCloneRegExp(obj);
  } else if (testIsFunction(obj)) {
    // Will not clone functions
    return obj;
  }
  if (obj && typeof obj.valueOf() === 'string' && obj.length > 0 && !obj.hasOwnProperty(0)) {
    testForceStringCoercion(obj);
  }
  var result = testIsArray(obj) ? [] : {}, key;
  for(key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    result[key] = testClone(obj[key]);
  }
  if (obj && typeof obj === 'object' && obj.hasOwnProperty('toString')) {
    result['toString'] = obj['toString'];
  }
  return result;
}

testCloneRegExp = function(reg) {
  var flags = '';
  if (reg.global)     flags += 'g';
  if (reg.ignoreCase) flags += 'i';
  if (reg.multiline)  flags += 'm';
  if (reg.sticky)     flags += 'y';
  return RegExp(reg.source, flags);
}

testForceStringCoercion = function(obj) {
  var i = 0, chr;
  while(chr = obj.charAt(i)) {
    obj[i++] = chr;
  }
  for (var key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
  };
}

testStaticAndInstance = function (subject, args, expected, message) {
  // Clone here in case the first test modifies the subject!
  var clonedSubject = testClone(subject);
  test(Object, [subject].concat(args), expected, message);
  if (Sugar.Object && Sugar.Object.extended) {
    var obj = run(Object, 'extended', [clonedSubject]);
    equal(obj[getCurrentTest().name].apply(obj, args), expected, message + ' | extended');
  }
}

testGetSparseArray = function(index) {
  var arr = [];
  for (var i = 1; i < arguments.length; i++) {
    arr[index + i - 1] = arguments[i];
  }
  return arr;
}

// Using the [] constructor with undefined values in <= IE8 will effectively
// produce a sparse array (no property actually gets set) the only workaround
// is to push undefined directly onto the array.
testGetArrayWithUndefined = function() {
  var arr = [];
  for (var i = 0; i < arguments.length; i++) {
    arr.push(arguments[i]);
  }
  return arr;
}

// iOS 8 supports Set but not the iterable constructor syntax (it simply adds
// the array as a set member instead). So this helper method helps creates sets
// from arguments.
testGetSet = function() {
  var s = new Set();
  for (var i = 0; i < arguments.length; i++) {
    s.add(arguments[i]);
  }
  return s;
}

propertyIsEnumerable = function(obj, prop) {
  for (var key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    if(key === prop) return true;
  }
  return false;
}
