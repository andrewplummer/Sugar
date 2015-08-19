package('Custom Extending', function() {
  "use strict";

  // TODO decide what to do here!

  group('Extending String', function () {
    Sugar.String.extend({
      foo: function() {
        return 'bar';
      }
    });

    equal(run('s', 'foo'), 'bar', 'basic functionality');
    equal('foo' in Sugar.String, true, 'ensure method was added to global as well');
  });

  group('Extending Number', function () {
    var staticNumberChr = Sugar.Number.chr;
    var instanceNumberChr = Number.prototype.chr;
    var instanceNumberChrExisted = 'chr' in Number.prototype;

    Sugar.Number.extend({
      plus: function(a, b) {
        return this + a + b;
      },
      chr: function() {
        return String.fromCharCode(this);
      }
    });

    equal(run(1, 'plus', [2, 3]), 6, 'arguments and scope are correct');
    equal((69).chr(), 'E', 'chr should now exist on the prototype');

  });

});
