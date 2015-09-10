testIterateOverObject = function (obj, fn) {
  var key;
  for(key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    fn.call(obj, key, obj[key]);
  }
}

testClone = function (obj) {
  var isArray = Object.prototype.toString.call(obj) === '[object Array]';
  var result = isArray ? [] : {}, key;
  for(key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    result[key] = obj[key];
  }
  return result;
}

testStaticAndInstance = function (subject, args, expected, message) {
  test(Object, [subject].concat(args), expected, message);
  if (Sugar.Object && Sugar.Object.extended) {
    var obj = run(Object, 'extended', [subject]);
    equal(obj[getCurrentTest().name].apply(obj, args), expected, message);
  }
}

propertyIsEnumerable = function(obj, prop) {
  for (var key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    if(key === prop) return true;
  }
  return false;
}

