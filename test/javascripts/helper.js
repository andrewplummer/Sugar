
testIterateOverObject = function(obj, fn) {
  var key;
  for(key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    fn.call(obj, key, obj[key]);
  }
}

testClone = function(obj) {
  var isArray = Object.prototype.toString.call(obj) === '[object Array]';
  var result = isArray ? [] : {}, key;
  for(key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    result[key] = obj[key];
  }
  return result;
}
