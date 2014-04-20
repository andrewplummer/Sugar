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
    if(Sugar.noConflict) {
      equal((3).chr(), 'F', "Ensure that restore doesn't accidentally map methods to prototypes when no-conflict is active");
      delete Number.prototype.chr;
    }

  });

  package('Reverting', function () {

    // Issue #248
    // Ensure that methods can be reverted

    Sugar.extend(Object, {
      foobar: function() { return 'haha'; }
    });

    equal(Sugar.Object.foobar(), 'haha', 'Global method exists');
    equal('foobar' in {}, !Sugar.noConflict, 'Object.prototype was extended only if not no-conflict');
    Sugar.revert(Object, 'foobar');
    equal('foobar' in {}, false, 'custom method should be removed');

    // Reset...
    delete Sugar.Object.foobar;

    Object.prototype.foobar = function() {
      return 'original';
    }
    Sugar.extend(Object, {
      foobar: function() {
        return 'overwritten';
      }
    });
    equal(({}).foobar(), Sugar.noConflict ? 'original' : 'overwritten', 'custom method should overwrite');
    Sugar.revert(Object, 'foobar');
    equal(({}).foobar(), 'original', 'should revert back to original method');
    delete Object.prototype.foobar;

  });

})();
