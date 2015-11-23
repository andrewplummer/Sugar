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

testGetPrivateProp = function(obj, name) {
  return obj['_sugar_' + name];
}

testClone = function (obj) {
  var klass = testGetClass(obj);
  var result = testIsArray(obj, klass) ? [] : {}, key, val;
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  if (obj && typeof obj.valueOf() === 'string' && obj.length > 0 && !obj.hasOwnProperty(0)) {
    testForceStringCoercion(obj);
  }
  for(key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    var val = obj[key];
    if (testIsDate(val)) {
      val = new Date(val.getTime());
    } else if (testIsRegExp(val)) {
      val = new RegExp(val);
    } else if (val && typeof val === 'object') {
      val = testClone(val);
    }
    result[key] = val;
  }
  if (obj && typeof obj === 'object' && obj.hasOwnProperty('toString')) {
    result['toString'] = obj['toString'];
  }
  return result;
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
propertyIsEnumerable = function(obj, prop) {
  for (var key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    if(key === prop) return true;
  }
  return false;
}
