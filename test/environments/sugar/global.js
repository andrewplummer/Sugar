test('Object', function () {

  // Sugar.extend functionality

  Sugar.extend(String, {
    foo: function() {
      return 'bar';
    }
  });

  equal('s'.foo(), 'bar', 'Sugar.extend | basic functionality');

  Sugar.extend(Number, {
    plus: function(a, b) {
      return this + a + b;
    },
    chr: function() {
      return String.fromCharCode(this);
    }
  });


  equal((1).plus(2, 3), 6, 'Sugar.extend | arguments and scope are correct');

  Number.prototype.chr = function() { return 'F'; };

  equal((69).chr(), 'F', 'Sugar.extend | should overwrite existing methods');

  Sugar.restore(Number, 'chr');

  equal((69).chr(), 'E', 'Sugar.extend | simple array of strings should restore Sugar methods');
  equal((1).plus(2, 3), 6, 'Sugar.extend | restoring Sugar methods should not override other custom extended methods');



  // Issue #248
  // Ensure that methods can be reverted

  Sugar.revert(Object, 'isObject');
  equal('isObject' in {}, false, 'Sugar.revert | isObject should be removed');

  Object.prototype.tap = undefined;
  Sugar.extend(Object, {
    tap: function() {}
  });
  Sugar.revert(Object, 'tap');
  equal('tap' in {}, true, 'Sugar.revert | previously undefined property should not be deleted');
  equal(({}).tap === undefined, true, 'Sugar.revert | previously undefined property is still undefined');
  delete Object.prototype.tap;

});
