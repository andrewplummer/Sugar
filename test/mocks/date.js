(() => {

  function mockTimezoneOffset() {

    let mockOffset;

    Date.mockTimezoneOffset = function mockTimezoneOffset(offset) {
      mockOffset = offset;
    }

    const getTimezoneOffset = Date.prototype.getTimezoneOffset;

    Date.prototype.getTimezoneOffset = function() {
      return mockOffset != null ? mockOffset : getTimezoneOffset.call(this);
    }

  }

  mockTimezoneOffset();
})();
