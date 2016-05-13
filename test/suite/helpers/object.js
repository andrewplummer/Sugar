(function() {

  // IE9 has no strict mode, and so still allows writing
  // to properties whose descriptors are writable: false

  var hasNonWritableBug = false;

  function testNonWritableBug() {
    var obj = {};
    Object.defineProperty(obj, 'foo', {
      writable: false,
      value: 'bar'
    });
    try {
      obj.foo = 'wow';
      hasNonWritableBug = true;
    } catch(e) {}
  }

  assertNonWritableRaisesError = function(fn) {
    if (!hasNonWritableBug) {
      raisesError(fn, 're-assignment of non-writable property raises error');
    }
  }

  if (testDefinePropertySupport) {
    testNonWritableBug();
  }

})();

testGetAccessorObject = function(name) {
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

testGetDescriptorObject = function() {
  return Object.defineProperty({}, 'foo', {
    // writable should be false
    // enumerable should be false
    // configurable should be false
    value: 'bar'
  });
}
