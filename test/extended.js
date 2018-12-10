'use strict';

fdescribe('Extended', function () {

  // TODO: except vs exclude?
  // TODO: defineAlias vs defineSimilar???
  // TODO: how to handle enhanced methods? flags?? defineMathMethods?
  // TODO: Sugar.Array.extend({ enhanceArray: false });
  // TODO: document API changes in changelog!

  it('should alias global extend method to all namespaces', function() {
    Sugar.extend();
  });

  it('should allow extending object prototypes', function() {
    Sugar.extend({
      dangerousObjectPrototype: true
    });
  });

  it('should allow extending by namespace ??', function() {
    Sugar.extend([
      namespaces: [String, Number],
      exclude: [String, Number]
    ]);
  });

  it('should extend instance methods', function() {
    Sugar.Array.extend();
    // assert no non-array methods are extended
  });

  it('should extend specific methods by array argument ??', function() {
    Sugar.Number.extend(['add']);
    assertEqual((5).add(1,2,3,4,5,6,7,8,9,10), 60);
  });

  it('should accept methods param', function() {
    Sugar.Number.extend({
      methods: ['add']
    });
  });

  it('should accept exclude param', function() {
    Sugar.Number.extend({
      exclude: ['add']
    });
  });

  it('should not extend instance methods', function() {
    Sugar.Object.extend();
  });

  // MORE
  it('should extend after global hijacking', function() {
    var nativeDate = Date;
    function FakeDate() {}
    Sugar.Date.defineStatic('foo', function() { return 'foo!'; });
    // Hijacking the global Date object. Sinon does this to allow time mocking
    // in tests, so need to support this here.
    Date = FakeDate;
    Sugar.Date.extend();
    equal(Date.foo(), 'foo!', 'hijacked global is now the target');
    Date = nativeDate;
  });


});
