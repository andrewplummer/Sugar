getAccessorObject = function(name) {
  var data = {};
  name = name || 'label';
  data[name] = 'foo';
  var obj = {
    data: data
  }
  // Need to use defineProperty here as get label() is a syntax error
  // that would halt tests in < IE9.
  Object.defineProperty(obj, name, {
    enumerable: true,
    get: function() {
      return this.data[name];
    },
    set: function(value) {
      this.data[name] = value;
    }
  });
  return obj;
}

getDescriptorObject = function() {
  return Object.defineProperty({}, 'foo', {
    // writable should be false
    // enumerable should be false
    // configurable should be false
    value: 'bar'
  });
}

testStaticAndInstance = function (subject, args, expected, message) {

  function testExtended(flag, type) {
    var obj = Sugar.Object.extended(testClone(subject), flag);
    var result = obj[getCurrentTest().name].apply(obj, args);
    if (testIsHash(result) && result.unwrap) {
      result = result.unwrap();
    }
    equal(result, expected, type + ' | ' + message);
  }

  if (Sugar.Object && Sugar.Object.extended) {
    // Need to perform extended tests first as the test subject
    // may be altered in the process of the main test.
    testExtended(false, 'extended');
    testExtended(true, 'non-shadowable extended');
  }
  test(subject, args, expected, message);
}

testIsHash = function(obj) {
  // Simple way to check for extended objects
  return obj && typeof obj.keys === 'function' && typeof obj.values === 'function';
}

assertIsHash = function(obj) {
  equal(testIsHash(obj), true, 'obj is hash');
}
