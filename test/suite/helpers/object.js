getAccessorObject = function() {
  var obj = {
    data: { label: 'foo' }
  }
  // Need to use defineProperty here as get label() is a syntax error
  // that would halt tests in < IE9.
  Object.defineProperty(obj, 'label', {
    enumerable: true,
    get: function() {
      return this.data.label;
    },
    set: function(value) {
      this.data.label = value;
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
