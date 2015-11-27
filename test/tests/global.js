package('Custom Extending', function() {
  "use strict";

  group('Extend | String', function () {
    String.extend({
      foo: function() {
        return 'bar';
      }
    });

    equal(''.foo(), 'bar', 'extend | basic functionality');
    delete String.prototype.foo;
  });

  group('Extend | Number', function () {
    Number.extend({
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

    Number.sugarRestore('chr');

    equal(run(69, 'chr'), 'E', 'string should restore Sugar method');
    equal(run(1, 'plus', [2, 3]), 6, 'extend | restoring Sugar methods should not override other custom extended methods');

  });

  group('Extend | Reverting', function () {

    // Issue #248
    // Ensure that methods can be reverted

    Object.extend({
      foobar: function() { return 'haha'; }
    });

    equal(({}).foobar(), 'haha', 'method exists');
    Object.sugarRevert('foobar');
    equal('foobar' in {}, false, 'custom method should be removed');

    Object.prototype.foobar = function() {
      return 'original';
    }
    Object.extend({
      foobar: function() {
        return 'overwritten';
      }
    });
    equal(({}).foobar(), 'overwritten', 'custom method should overwrite');
    Object.sugarRevert('foobar');
    equal(({}).foobar(), 'original', 'should revert back to original method');
    delete Object.prototype.foobar;

  });

});
