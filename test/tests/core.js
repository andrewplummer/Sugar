package('Core', function() {
  "use strict";

  function defineCustom() {
    Sugar.String.defineInstance({
      foo: function() {
        return 'foo!';
      },
      bar: function() {
        return 'bar!';
      },
      moo: function() {
        return 'moo!';
      }
    });
  }

  function deleteCustom() {
    delete Sugar.Object.foo;
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
    Sugar.extend();
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
    // Passing a boolean here to explicitly turn off object
    // instances which may have been affected by other tests.
    Sugar.Object.extend(false);
    assertStaticMethodsMappedToNative(['Object']);
    assertInstanceMethodsNotMappedToNative(['Object']);
    assertNoMethodsMappedToNative(['Array', 'Boolean', 'Number', 'Date', 'String', 'RegExp', 'Function']);
  });

  group('Sugar Object namespace full', function () {
    Sugar.Object(true);
    assertAllMethodsMappedToNative(['Object']);
    assertNoMethodsMappedToNative(['Array', 'Boolean', 'Number', 'Date', 'String', 'RegExp', 'Function']);
  });

  group('Sugar Object extend full', function () {
    Sugar.Object.extend(true);
    assertAllMethodsMappedToNative(['Object']);
    assertNoMethodsMappedToNative(['Array', 'Boolean', 'Number', 'Date', 'String', 'RegExp', 'Function']);
  });

  group('Extending by name namespace', function () {
    defineCustom();
    Sugar.String('foo');
    equal(''.foo(), 'foo!', 'foo has been mapped');
    equal(''.bar, undefined, 'bar has not been mapped');
  });

  group('Extending by name extend', function () {
    defineCustom();
    Sugar.String.extend('foo');
    equal(''.foo(), 'foo!', 'foo has been mapped');
    equal(''.bar, undefined, 'bar has not been mapped');
  });

  group('Extending by name namespace with array', function () {
    defineCustom();
    Sugar.String(['foo', 'bar']);
    equal(''.foo(), 'foo!', 'foo has been mapped');
    equal(''.bar(), 'bar!', 'bar has been mapped');
    equal(''.moo, undefined, 'moo has not been mapped');
  });

  group('Extending by name extend with array', function () {
    defineCustom();
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
    defineCustom();
    equal(Sugar.String.foo(), 'foo!', 'Namespace method exists when defined after namespace extend');
    equal('wasabi'.foo(), 'foo!', 'Instance method exists when defined after namespace extend');
  });

  group('Will not extend to Object.prototype after namespace extend', function () {
    // Passing a boolean here to explicitly turn off object
    // instances which may have been affected by other tests.
    Sugar.Object.extend(false);
    Sugar.Object.defineInstance({
      foo: function() {
        return 'foo!';
      }
    });
    equal(({}).foo, undefined, 'foo has not been mapped');
  });

  group('Will extend to Object.prototype after namespace extend', function () {
    Sugar.Object.extend(true);
    Sugar.Object.defineInstance({
      foo: function() {
        return 'foo!';
      }
    });
    equal(({}).foo(), 'foo!', 'foo has been mapped');
  });
});
