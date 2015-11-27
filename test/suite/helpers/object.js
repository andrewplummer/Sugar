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
