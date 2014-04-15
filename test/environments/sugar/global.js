(function() {

  // Sugar.extend functionality

  package('String', function () {
    Sugar.extend(String, {
      foo: function() {
        return 'bar';
      }
    });

    equal(run('s', 'foo'), 'bar', 'extend | basic functionality');
    equal('foo' in Sugar.String, true, 'extend | ensure method was added to global as well');
  });

  package('Number', function () {
    Sugar.extend(Number, {
      plus: function(a, b) {
        return this + a + b;
      },
      chr: function() {
        return String.fromCharCode(this);
      }
    });

    equal(run(1, 'plus', [2, 3]), 6, 'extend | arguments and scope are correct');

    Number.prototype.chr = function() { return 'F'; };

    equal((69).chr(), 'F', 'extend | should overwrite existing methods');

    Sugar.restore(Number, 'chr');

    equal(run(69, 'chr'), 'E', 'extend | simple array of strings should restore Sugar methods');
    equal(run(1, 'plus', [2, 3]), 6, 'extend | restoring Sugar methods should not override other custom extended methods');

  });

  package('Reverting', function () {

    // Issue #248
    // Ensure that methods can be reverted

    Sugar.extend(Object, {
      foobar: function() {}
    });
    equal('foobar' in {}, true, 'custom method should exist');
    Sugar.revert(Object, 'foobar');
    equal('foobar' in {}, false, 'custom method should be removed');

    // Reset...
    Sugar.Object.foobar = null;

    Object.prototype.foobar = function() {
      return 'original';
    }
    Sugar.extend(Object, {
      foobar: function() {
        return 'overwritten';
      }
    });
    equal(({}).foobar(), 'overwritten', 'custom method should overwrite');
    Sugar.revert(Object, 'foobar');
    equal(({}).foobar(), 'original', 'should revert back to original method');

  });

})();
