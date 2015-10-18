package('Core', function() {
  "use strict";

  function defineCustom(target) {
    var methods = {
      foo: function() {
        return 'foo!';
      },
      bar: function() {
        return 'bar!';
      },
      moo: function() {
        return 'moo!';
      }
    };
    if (target === Sugar.Object) {
      methods.foo.static = true;
      methods.bar.static = true;
      methods.moo.static = true;
    }
    target.defineInstance(methods);
  }

  function deleteCustom() {
    delete Sugar.Object.foo;
    delete Sugar.Object.bar;
    delete Sugar.Object.moo;
    delete Sugar.String.foo;
    delete Sugar.String.bar;
    delete Sugar.String.moo;
  }

  setup(function() {
    storeNativeState();
  });

  teardown(function() {
    restoreNativeState();
    deleteCustom();
  });

  group('Sugar namespace', function () {
    Sugar();
    assertAllMethodsMappedToNative(['Array', 'Boolean', 'Number', 'String', 'Date', 'RegExp', 'Function']);
    assertStaticMethodsMappedToNative(['Object']);
    assertInstanceMethodsNotMappedToNative(['Object']);
  });

  group('Sugar extend', function () {
    Sugar.extendAll();
    assertAllMethodsMappedToNative(['Array', 'Boolean', 'Number', 'String', 'Date', 'RegExp', 'Function']);
    assertStaticMethodsMappedToNative(['Object']);
    assertInstanceMethodsNotMappedToNative(['Object']);
  });

  group('Sugar Array namespace', function () {
    Sugar.Array();
    assertAllMethodsMappedToNative(['Array']);
    assertNoMethodsMappedToNative(['Object', 'Boolean', 'Number', 'String', 'Date', 'RegExp', 'Function']);
  });

  group('Sugar Array extend', function () {
    Sugar.Array.extend();
    assertAllMethodsMappedToNative(['Array']);
    assertNoMethodsMappedToNative(['Object', 'Boolean', 'Number', 'String', 'Date', 'RegExp', 'Function']);
  });

  group('Sugar Date namespace', function () {
    Sugar.Date();
    assertAllMethodsMappedToNative(['Date']);
    assertNoMethodsMappedToNative(['Array', 'Object', 'Boolean', 'Number', 'String', 'RegExp', 'Function']);
  });

  group('Sugar Date extend', function () {
    Sugar.Date.extend();
    assertAllMethodsMappedToNative(['Date']);
    assertNoMethodsMappedToNative(['Array', 'Object', 'Boolean', 'Number', 'String', 'RegExp', 'Function']);
  });

  group('Sugar Object namespace', function () {
    Sugar.Object();
    assertStaticMethodsMappedToNative(['Object']);
    assertInstanceMethodsNotMappedToNative(['Object']);
    assertNoMethodsMappedToNative(['Array', 'Boolean', 'Number', 'Date', 'String', 'RegExp', 'Function']);
  });

  group('Sugar Object extend', function () {
    assertStaticMethodsMappedToNative(['Object']);
    assertInstanceMethodsNotMappedToNative(['Object']);
    assertNoMethodsMappedToNative(['Array', 'Boolean', 'Number', 'Date', 'String', 'RegExp', 'Function']);
  });

  group('Sugar Object namespace full', function () {
    Sugar.Object({
      objectInstance: true
    });
    assertAllMethodsMappedToNative(['Object']);
    assertNoMethodsMappedToNative(['Array', 'Boolean', 'Number', 'Date', 'String', 'RegExp', 'Function']);
  });

  group('Sugar Object extend full', function () {
    Sugar.Object.extend({
      objectInstance: true
    });
    assertAllMethodsMappedToNative(['Object']);
    assertNoMethodsMappedToNative(['Array', 'Boolean', 'Number', 'Date', 'String', 'RegExp', 'Function']);
  });

  group('Extending by name namespace', function () {
    defineCustom(Sugar.String);
    Sugar.String('foo');
    equal(''.foo(), 'foo!', 'foo has been mapped');
    equal(''.bar, undefined, 'bar has not been mapped');
  });

  group('Extending by name extend', function () {
    defineCustom(Sugar.String);
    Sugar.String.extend('foo');
    equal(''.foo(), 'foo!', 'foo has been mapped');
    equal(''.bar, undefined, 'bar has not been mapped');
  });

  group('Extending by name namespace with array', function () {
    defineCustom(Sugar.String);
    Sugar.String(['foo', 'bar']);
    equal(''.foo(), 'foo!', 'foo has been mapped');
    equal(''.bar(), 'bar!', 'bar has been mapped');
    equal(''.moo, undefined, 'moo has not been mapped');
  });

  group('Extending by name extend with array', function () {
    defineCustom(Sugar.String);
    Sugar.String.extend(['foo', 'bar']);
    equal(''.foo(), 'foo!', 'foo has been mapped');
    equal(''.bar(), 'bar!', 'bar has been mapped');
    equal(''.moo, undefined, 'moo has not been mapped');
  });

  group('Custom with no arguments', function () {
    Sugar.String.defineInstance({
      foo: function() {
        return 'foo!';
      }
    });
    equal(Sugar.String.foo(), 'foo!', 'Namespace method exists');
    equal(String.prototype.foo, undefined, 'Instance method is undefined');
    Sugar.String.extend('foo');
    equal('wasabi'.foo(), 'foo!', 'Instance method is mapped');
  });

  group('Custom with 1 argument', function () {
    Sugar.String.defineInstance({
      foo: function(str) {
        return str + 'foo!';
      }
    });
    equal(Sugar.String.foo('wasabi'), 'wasabifoo!', 'Namespace method exists');
    Sugar.String.extend('foo');
    equal('wasabi'.foo(), 'wasabifoo!', 'Instance method is mapped');
  });

  group('Custom with 2 arguments', function () {
    Sugar.String.defineInstance({
      foo: function(str, a) {
        return str + '|' + a;
      }
    });
    equal(Sugar.String.foo('foo', '1'), 'foo|1', 'Namespace method exists');
    Sugar.String.extend('foo');
    equal('foo'.foo('1'), 'foo|1', 'Instance method is mapped');
  });

  group('Custom with 3 arguments', function () {
    Sugar.String.defineInstance({
      foo: function(str, a, b) {
        return str + '|' + a + '|' + b;
      }
    });
    equal(Sugar.String.foo('foo', '1', '2'), 'foo|1|2', 'Namespace method exists');
    Sugar.String.extend('foo');
    equal('foo'.foo('1', '2'), 'foo|1|2', 'Instance method is mapped');
  });

  group('Custom with 4 arguments', function () {
    Sugar.String.defineInstance({
      foo: function(str, a, b, c) {
        return str + '|' + a + '|' + b + '|' + c;
      }
    });
    equal(Sugar.String.foo('foo', '1', '2', '3'), 'foo|1|2|3', 'Namespace method exists');
    Sugar.String.extend('foo');
    equal('foo'.foo('1', '2', '3'), 'foo|1|2|3', 'Instance method is mapped');
  });

  group('Custom with 5 arguments', function () {
    Sugar.String.defineInstance({
      foo: function(str, a, b, c, d) {
        return str + '|' + a + '|' + b + '|' + c + '|' + d;
      }
    });
    equal(Sugar.String.foo('foo', '1', '2', '3', '4'), 'foo|1|2|3|4', 'Namespace method exists');
    Sugar.String.extend('foo');
    equal('foo'.foo('1', '2', '3', '4'), 'foo|1|2|3|4', 'Instance method is mapped');
  });

  group('Custom beyond argument limit', function () {
    // An instance object + 4 arguments should be the maximum allowed curried arguments
    // for methods defined in Sugar. Beyond this limit, methods will not be mapped to prototypes.
    Sugar.String.defineInstance({
      foo: function(str, a, b, c, d, e) {
        return str + '|' + a + '|' + b + '|' + c + '|' + d + '|' + e;
      }
    });
    equal(Sugar.String.foo('foo', '1', '2', '3', '4', '5'), 'foo|1|2|3|4|5', '5 argument method is still mapped to global');
    Sugar.String.extend('foo');
    raisesError(function() { 'foo'.foo('1', '2', '3', '4', '5'); }, 'Instance method with 5 arguments will not be mapped to prototype');
  });

  group('Custom Methods after extending', function () {
    Sugar.String.extend();
    defineCustom(Sugar.String);
    equal(Sugar.String.foo(), 'foo!', 'Namespace method exists when defined after namespace extend');
    equal('wasabi'.foo(), 'foo!', 'Instance method exists when defined after namespace extend');
  });

  group('Will not extend to Object.prototype after namespace extend', function () {
    defineCustom(Sugar.Object);
    equal(({}).foo, undefined, 'foo has not been mapped');
  });

  group('Will extend to Object.prototype after namespace extend', function () {
    Sugar.Object.extend({
      objectInstance: true
    });
    defineCustom(Sugar.Object);
    equal(({}).foo(), 'foo!', 'foo has been mapped');
  });

  group('Will extend to Object.prototype on global call with true', function () {
    Sugar({
      objectInstance: true
    });
    defineCustom(Sugar.Object);
    equal(({}).foo(), 'foo!', 'foo has been mapped');
  });

  group('Will extend to Object.prototype on global extend with true', function () {
    Sugar.extendAll({
      objectInstance: true
    });
    defineCustom(Sugar.Object);
    equal(({}).foo(), 'foo!', 'foo has been mapped');
  });

  group('Can extend single method to object without prototype extension', function () {
    defineCustom(Sugar.Object);
    Sugar.Object.extend('foo');
    equal(Object.foo(), 'foo!', 'foo static has been mapped');
    equal(Object.bar, undefined, 'bar static has not been mapped');
    equal(Object.moo, undefined, 'moo static has not been mapped');
    equal(({}).foo, undefined, 'foo instance has not been mapped');
    equal(({}).bar, undefined, 'bar instance has not been mapped');
    equal(({}).moo, undefined, 'moo instance has not been mapped');
  });

  group('Can extend single method to object prototype', function () {
    defineCustom(Sugar.Object);
    Sugar.Object.extend({
      methods: ['foo'],
      objectInstance: true
    });
    equal(Object.foo(), 'foo!', 'foo static has been mapped');
    equal(Object.bar, undefined, 'bar static has not been mapped');
    equal(Object.moo, undefined, 'moo static has not been mapped');
    equal(({}).foo(), 'foo!', 'foo has been mapped');
    equal(({}).bar, undefined, 'bar has not been mapped');
    equal(({}).moo, undefined, 'moo has not been mapped');
  });

  group('Array enhancements', function() {
    // This test is in core because it cannot be run in
    // the "extended" tests where arrays may already be enhanced.
    Sugar.Array.extend({
      enhanceArray: false
    });
    raisesError(function() { [1,2,3].every(1); }, 'every is not enhanced');
    raisesError(function() { [1,2,3].some(1); }, 'some is not enhanced');
    raisesError(function() { [1,2,3].filter(1); }, 'filter is not enhanced');
    raisesError(function() { [1,2,3].find(1); }, 'find is not enhanced');
    raisesError(function() { [1,2,3].findIndex(1); }, 'findIndex is not enhanced');
    raisesError(function() { [1,2,3].map(1); }, 'findIndex is not enhanced');
  });

  group('Array enhancements with enhance flag', function() {
    // This test is in core because it cannot be run in
    // the "extended" tests where arrays may already be enhanced.
    Sugar.Array.extend({
      enhance: false
    });
    raisesError(function() { [1,2,3].every(1); }, 'every is not enhanced');
    raisesError(function() { [1,2,3].some(1); }, 'some is not enhanced');
    raisesError(function() { [1,2,3].filter(1); }, 'filter is not enhanced');
    raisesError(function() { [1,2,3].find(1); }, 'find is not enhanced');
    raisesError(function() { [1,2,3].findIndex(1); }, 'findIndex is not enhanced');
    raisesError(function() { [1,2,3].map(1); }, 'findIndex is not enhanced');
  });

  group('String enhancements', function() {
    // This test is in core because it cannot be run in
    // the "extended" tests where strings may already be enhanced.
    Sugar.String.extend({
      enhanceString: false
    });
    raisesError(function() { 'foobar'.includes(/foo/); }, 'includes is not enhanced');
  });

  group('String enhancements with enhance flag', function() {
    // This test is in core because it cannot be run in
    // the "extended" tests where strings may already be enhanced.
    Sugar.String.extend({
      enhance: false
    });
    raisesError(function() { 'foobar'.includes(/foo/); }, 'includes is not enhanced');
  });

});
