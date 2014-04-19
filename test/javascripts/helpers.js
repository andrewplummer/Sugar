
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

testClassAndInstance = function (subject, args, expected, message) {
  var ext = run(Object, 'extended', [subject]);
  test(ext, args, expected, message);
  test(Object, [ext].concat(args), expected, message);
}

propertyIsEnumerable = function(obj, prop) {
  for (var key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    if(key === prop) return true;
  }
  return false;
}
