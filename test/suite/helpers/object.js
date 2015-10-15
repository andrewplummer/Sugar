

getAccessorObject = function() {
  return {
    data: {
      label: 'foo'
    },

    get label() {
      return this.data.label;
    },
    set label(value) {
      this.data.label = value;
    }
  };
}

getDescriptorObject = function() {
  return Object.defineProperty({}, 'foo', {
    // writable should be false
    // enumerable should be false
    // configurable should be false
    value: 'bar'
  });
}
