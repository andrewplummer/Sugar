namespace('Core', function() {
  'use strict';

  function defineCustom(target, andStatic) {
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
    if (andStatic) {
      target.defineInstanceAndStatic(methods);
    } else {
      target.defineInstance(methods);
    }
  }

  setup(function() {
    storeNativeState();
  });

  teardown(function() {
    restoreNativeState();
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

  group('Sugar Array extend', function () {
    Sugar.Array.extend();
    assertAllMethodsMappedToNative(['Array']);
    assertNoMethodsMappedToNative(['Object', 'Boolean', 'Number', 'String', 'Date', 'RegExp', 'Function']);
  });

  group('Sugar Date extend', function () {
    Sugar.Date.extend();
    assertAllMethodsMappedToNative(['Date']);
    assertNoMethodsMappedToNative(['Array', 'Object', 'Boolean', 'Number', 'String', 'RegExp', 'Function']);
  });

  group('Sugar Object extend', function () {
    Sugar.Object.extend();
    assertStaticMethodsMappedToNative(['Object']);
    assertInstanceMethodsNotMappedToNative(['Object']);
    assertNoMethodsMappedToNative(['Array', 'Boolean', 'Number', 'Date', 'String', 'RegExp', 'Function']);
  });

  group('Sugar Object namespace full', function () {
    Sugar.Object.extend({
      objectPrototype: true
    });
    assertAllMethodsMappedToNative(['Object']);
    assertNoMethodsMappedToNative(['Array', 'Boolean', 'Number', 'Date', 'String', 'RegExp', 'Function']);
  });

  group('Sugar Object extend full', function () {
    Sugar.Object.extend({
      objectPrototype: true
    });
    assertAllMethodsMappedToNative(['Object']);
    assertNoMethodsMappedToNative(['Array', 'Boolean', 'Number', 'Date', 'String', 'RegExp', 'Function']);
  });

  group('Extending by name', function () {
    defineCustom(Sugar.String);
    Sugar.String.extend('foo');
    equal(''.foo(), 'foo!', 'foo has been mapped');
    equal(''.bar, undefined, 'bar has not been mapped');
  });

  group('Extending by array', function () {
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

  group('Can define single', function () {
    Sugar.String.defineInstance('foo', function(str) {
      return str  + ' + you!';
    });
    equal(Sugar.String.foo('wasabi'), 'wasabi + you!', 'Namespace method exists');
    Sugar.String.extend('foo');
    equal('wasabi'.foo(), 'wasabi + you!', 'Instance method is mapped');
  });

  group('Custom Methods after extending', function () {
    Sugar.String.extend();
    defineCustom(Sugar.String);
    equal(Sugar.String.foo(), 'foo!', 'Namespace method exists when defined after namespace extend');
    equal('wasabi'.foo(), 'foo!', 'Instance method exists when defined after namespace extend');
  });

  group('Will not extend to Object.prototype after namespace extend', function () {
    defineCustom(Sugar.Object, true);
    equal(({}).foo, undefined, 'foo has not been mapped');
  });

  group('Will extend to Object.prototype after namespace extend', function () {
    Sugar.Object.extend({
      objectPrototype: true
    });
    defineCustom(Sugar.Object, true);
    equal(({}).foo(), 'foo!', 'foo has been mapped');
  });

  group('Will extend to Object.prototype on global call with true', function () {
    Sugar({
      objectPrototype: true
    });
    defineCustom(Sugar.Object, true);
    equal(({}).foo(), 'foo!', 'foo has been mapped');
  });

  group('Will extend to Object.prototype on global extend with true', function () {
    Sugar.extend({
      objectPrototype: true
    });
    defineCustom(Sugar.Object, true);
    equal(({}).foo(), 'foo!', 'foo has been mapped');
  });

  group('Can extend single method to object without prototype extension', function () {
    defineCustom(Sugar.Object, true);
    Sugar.Object.extend('foo');
    equal(Object.foo(), 'foo!', 'foo static has been mapped');
    equal(Object.bar, undefined, 'bar static has not been mapped');
    equal(Object.moo, undefined, 'moo static has not been mapped');
    equal(({}).foo, undefined, 'foo instance has not been mapped');
    equal(({}).bar, undefined, 'bar instance has not been mapped');
    equal(({}).moo, undefined, 'moo instance has not been mapped');
  });

  group('Can extend single method to object prototype', function () {
    defineCustom(Sugar.Object, true);
    Sugar.Object.extend({
      methods: ['foo'],
      objectPrototype: true
    });
    equal(Object.foo(), 'foo!', 'foo static has been mapped');
    equal(Object.bar, undefined, 'bar static has not been mapped');
    equal(Object.moo, undefined, 'moo static has not been mapped');
    equal(({}).foo(), 'foo!', 'foo has been mapped');
    equal(({}).bar, undefined, 'bar has not been mapped');
    equal(({}).moo, undefined, 'moo has not been mapped');
  });

  group('Aliasing', function() {
    defineCustom(Sugar.String);
    Sugar.String.alias('foo2', Sugar.String.foo);
    Sugar.String.alias('bar2', 'bar');
    Sugar.String.extend();
    equal(('').foo2(), 'foo!', 'foo2 is an alias of foo');
    equal(('').bar2(), 'bar!', 'bar2 is an alias of foo');
    delete Sugar.String.foo2;
    delete Sugar.String.bar2;
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
    raisesError(function() { [1,2,3].map(1); }, 'map is not enhanced');
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
    raisesError(function() { [1,2,3].map(1); }, 'map is not enhanced');
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

  group('Extending after global hijacking', function() {
    var nativeDate = Date;
    function FakeDate() {}
    defineCustom(Sugar.Date, true);
    // Hijacking the global Date object. Sinon does this to allow time mocking
    // in tests, so need to support this here.
    Date = FakeDate;
    Sugar.Date.extend();
    equal(Date.foo(), 'foo!', 'hijacked global is now the target');
    Date = nativeDate;
  });

  group('Creating new namespaces', function() {

    Sugar.createNamespace('Boolean');
    Sugar.Boolean.defineInstance('trueOnSundays', function(bool) {
      return bool && new Date().getDay() === 0;
    });
    Sugar.Boolean.extend();
    equal(Sugar.Boolean.trueOnSundays(true), new Date().getDay() === 0, 'Only true on sundays!');
    equal(true.trueOnSundays(), new Date().getDay() === 0, 'Only true on sundays! | extended');

    delete Boolean.prototype.trueOnSundays;

    Sugar.extend();
    equal(true.trueOnSundays(), new Date().getDay() === 0, 'extend also extends the namespace');

    delete Boolean.prototype.trueOnSundays;
    delete Sugar.Boolean;

    if (typeof WeakMap !== 'undefined') {
      Sugar.createNamespace('WeakMap');
      Sugar.WeakMap.defineInstance('deleteIf', function(map, key, check) {
        if (check) {
          // Avoiding IE syntax errors
          map['delete'](key);
        }
      });

      Sugar.WeakMap.extend();
      var map = new WeakMap();
      var key = new String('foo');

      map.set(key, 'bar');
      Sugar.WeakMap.deleteIf(map, key, false);
      equal(map.get(key), 'bar', 'no delete');
      Sugar.WeakMap.deleteIf(map, key, true);
      equal(map.get(key), undefined, 'deleted');

      map.set(key, 'bar');
      map.deleteIf(key, false);
      equal(map.get(key), 'bar', 'no delete | extended');
      map.deleteIf(key, true);
      equal(map.get(key), undefined, 'deleted | extended');

      delete WeakMap.prototype.deleteIf;
      delete Sugar.WeakMap;
    }

  });

  group('Extending with exceptions', function() {
    defineCustom(Sugar.String);
    Sugar.String.extend({
      except: ['foo']
    });
    equal(''.foo, undefined, 'foo was not mapped');
    equal(''.bar(), 'bar!', 'bar was mapped');
    equal(''.moo(), 'moo!', 'moo was mapped');
  });

  group('Chaining', function() {
    defineCustom(Sugar.String);
    var superString = new Sugar.String('hai');
    equal(superString.foo().raw, 'foo!', 'foo is chainable');
    equal(superString.bar().raw, 'bar!', 'bar is chainable');
    equal(superString.moo().raw, 'moo!', 'moo is chainable');
    equal(superString.foo().valueOf(), 'foo!', 'valueOf also returns raw value');
    equal(superString.toString(), 'SugarString: hai', 'Chainable should have a toString.');
    equal(superString.foo().toString(), 'SugarChainable: foo!', 'Unknown chainable type should have a toString');
  });

  group('Chaining with factories', function() {
    defineCustom(Sugar.String);
    var superString = Sugar.String('hai');
    equal(superString.foo().raw, 'foo!', 'foo is chainable');
    equal(superString.bar().raw, 'bar!', 'bar is chainable');
    equal(superString.moo().raw, 'moo!', 'moo is chainable');
  });

  group('Chaining across namespaces', function() {
    Sugar.Array.defineInstance('rate', function(arr) {
      // I like even arrays!
      return arr.length % 2 === 0 ? 10 : 2;
    });
    Sugar.Number.defineInstance('twofold', function(num) {
      // Double all the things!
      return num * 2;
    });
    Sugar.Number.defineInstance('big', function(num) {
      // Do I think this number is big??
      return num > 10 ? 'big!' : 'little!';
    });
    Sugar.String.defineInstance('noIs', function(str) {
      // I just love splitting on "i".
      return str.split('i');
    });

    var arr = Sugar.Array([1,2,3]);
    var raw = arr.rate().twofold().big().noIs().raw;
    equal(raw, ['l','ttle!'], 'long chain of methods with odd');

    var arr = Sugar.Array([1,2]);
    var raw = arr.rate().twofold().big().noIs().raw;
    equal(raw, ['b','g!'], 'long chain of methods with even');

  });

  group('Chaining with dismbiguation', function() {
    Sugar.Array.defineInstance('foo', function(arr) {
      return 'array says foo';
    });
    Sugar.String.defineInstance('foo', function(arr) {
      return 'string says foo';
    });

    equal(Sugar.Array().foo().foo().raw, 'string says foo', 'chained disambiguated from Array');
    equal(Sugar.String().foo().foo().raw, 'string says foo', 'chained disambiguated from String');
  });

  group('Disambiguation of an undefined namespace', function() {
    Sugar.Array.defineInstance('foo', function(arr) {
      return null;
    });
    Sugar.String.defineInstance('foo', function(arr) {
      return null;
    });
    raisesError(function() { Sugar.Array().foo().foo().raw }, 'Unknown type cannot be disambiguated');
  });

  group('Chaining special cases', function() {
    Sugar.Array.defineInstance('getNull', function(arr) {
      return null;
    });
    Sugar.Number.defineInstance('getNaN', function(arr) {
      return NaN;
    });
    Sugar.Object.defineInstance('getUndefined', function(arr) {
      return undefined;
    });

    equal(Sugar.Array().getNull().getNaN().getUndefined().raw, undefined, 'Chained to undefined');
    equal(Sugar.Number().getNaN().getUndefined().getNull().raw, null, 'Chained to null');
    equal(Sugar.Object().getUndefined().getNull().getNaN().raw, NaN, 'Chained to null');

  });

});
