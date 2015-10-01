testIterateOverObject = function (obj, fn) {
  var key;
  for(key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    fn.call(obj, key, obj[key]);
  }
}

testGetClass = function(obj) {
  return internalToString.call(obj);
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

testClone = function (obj) {
  var klass = testGetClass(obj);
  var result = testIsArray(obj, klass) ? [] : {}, key, val;
  for(key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    var val = obj[key];
    if (testIsDate(val)) {
      val = new Date(val);
    } else if (testIsRegExp(val)) {
      val = new RegExp(val);
    } else if (val && typeof val === 'object') {
      val = testClone(val);
    }
    result[key] = val;
  }
  return result;
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

propertyIsEnumerable = function(obj, prop) {
  for (var key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    if(key === prop) return true;
  }
  return false;
}

