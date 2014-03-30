
function testIterateOverObject(obj, fn) {
  var key;
  for(key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    fn.call(obj, key, obj[key]);
  }
}

function testClone(obj) {
  var isArray = Object.prototype.toString.call(obj) === '[object Array]';
  var result = isArray ? [] : {}, key;
  for(key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
    result[key] = obj[key];
  }
  return result;
}
function testClassAndInstance(subject, args, expected, message) {
  var ext = run(Object, 'extended', [subject]);
  test(ext, args, expected, message);
  test(Object, [ext].concat(args), expected, message);
}

