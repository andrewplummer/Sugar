namespace('Core', function() {
  'use strict';

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
    target.defineInstance(methods);
  }

  setup(function() {
    storeNativeState();
  });

  teardown(function() {
    restoreNativeState();
  });

  group('Core toString behavior', function () {
    equal(Sugar.toString(), 'Sugar', 'Global toString should return "Sugar"');
  });


  group('Sugar namespace', function () {
    Sugar();
    assertAllMethodsMappedToNative(['Array', 'Boolean', 'Number', 'String', 'Date', 'RegExp', 'Function']);
    assertStaticMethodsMappedToNative(['Object']);
    assertInstanceMethodsNotMappedToNative(['Object']);
  });

  group('Sugar extend', function () {
    var result = Sugar.extend();
    equal(result, Sugar, 'Return value should be the global object');
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

  group('Extend return values', function () {
    equal(Sugar.extend(), Sugar, 'Global extend should return Sugar');
    equal(Sugar.String.extend(), Sugar.String, 'Namespace extend should return the namespace');
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
    defineCustom(Sugar.Object);
    equal(({}).foo, undefined, 'foo has not been mapped');
  });

  group('Will extend to Object.prototype after namespace extend', function () {
    Sugar.Object.extend({
      objectPrototype: true
    });
    defineCustom(Sugar.Object);
    equal(({}).foo(), 'foo!', 'foo has been mapped');
  });

  group('Will extend to Object.prototype on global call with true', function () {
    Sugar({
      objectPrototype: true
    });
    defineCustom(Sugar.Object);
    equal(({}).foo(), 'foo!', 'foo has been mapped');
  });

  group('Will extend to Object.prototype on global extend with true', function () {
    Sugar.extend({
      objectPrototype: true
    });
    defineCustom(Sugar.Object);
    equal(({}).foo(), 'foo!', 'foo has been mapped');
  });

  group('Can extend single method to Object without prototype extension', function () {
    Sugar.Object.defineStatic('foo', function() { return 'foo!'; });
    Sugar.Object.defineStatic('bar', function() { return 'foo!'; });
    Sugar.Object.extend({
      methods: ['foo']
    });
    equal(Object.foo(), 'foo!', 'foo static has been mapped');
    equal(Object.bar, undefined, 'bar static has not been mapped');
    equal(Object.moo, undefined, 'moo static has not been mapped');
    equal(({}).foo, undefined, 'foo instance has not been mapped');
    equal(({}).bar, undefined, 'bar instance has not been mapped');
    equal(({}).moo, undefined, 'moo instance has not been mapped');
  });

  group('Can extend single method to Object.prototype', function () {
    defineCustom(Sugar.Object);
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

  group('Extending specific namespaces by array', function() {
    Sugar.String.defineInstance('foo', function() { return 'foo!'; });
    Sugar.Number.defineInstance('bar', function() { return 'bar!'; });
    Sugar.extend({
      namespaces: [String]
    });
    equal(''.foo(), 'foo!', 'foo was mapped');
    equal((5).bar, undefined, 'bar was not mapped');
  });

  group('Extending with namespace exceptions', function() {
    Sugar.String.defineInstance('foo', function() { return 'foo!'; });
    Sugar.Number.defineInstance('bar', function() { return 'bar!'; });
    Sugar.extend({
      except: [String]
    });
    equal(''.foo, undefined, 'foo was not mapped');
    equal((5).bar(), 'bar!', 'bar was mapped');
  });

  group('Extending with method exceptions', function() {
    defineCustom(Sugar.String);
    Sugar.String.extend({
      except: ['foo']
    });
    equal(''.foo, undefined, 'foo was not mapped');
    equal(''.bar(), 'bar!', 'bar was mapped');
    equal(''.moo(), 'moo!', 'moo was mapped');
  });

  group('Aliasing', function() {
    defineCustom(Sugar.String);
    var result = Sugar.String.alias('foo2', Sugar.String.foo);
    Sugar.String.alias('bar2', 'bar');
    Sugar.String.extend();
    equal(('').foo2(), 'foo!', 'foo2 is an alias of foo');
    equal(('').bar2(), 'bar!', 'bar2 is an alias of foo');
    equal(result, Sugar.String, 'return value should be the namespace');
    delete Sugar.String.foo2;
    delete Sugar.String.bar2;
  });

  group('Defining with flags', function() {
    String.foo = function() {
      return 'native foo!';
    }
    String.prototype.bar = function() {
      return 'native bar!';
    }
    Sugar.String.defineStatic('foo', function() {
      return 'enhanced foo!';
    }, ['fooFlag']);
    Sugar.String.defineInstance('bar', function() {
      return 'enhanced bar!';
    }, ['barFlag']);
    Sugar.String.extend({
      fooFlag: false,
      barFlag: false
    });
    equal(String.foo(), 'native foo!', 'static enhance prevented by flag');
    equal(''.bar(), 'native bar!', 'instance enhance prevented by flag');
    Sugar.String.extend({
      fooFlag: true,
      barFlag: true
    });
    equal(String.foo(), 'enhanced foo!', 'static extended');
    equal(''.bar(), 'enhanced bar!', 'instance extended');
  });

  group('Aliases with flags', function() {
    String.prototype.foo = function() {
      return 'something native!';
    }
    Sugar.String.defineInstance('foo', function(str) {
      return str + ' enhanced!';
    }, ['fooFlag']);
    Sugar.String.alias('foo2', 'foo');
    Sugar.String.extend({
      fooFlag: false
    });
    equal('hi'.foo(), 'something native!', 'foo should not be enhanced');
    equal('hi'.foo2(), 'hi enhanced!', 'foo2 should be extended');
  });

  group('Defining static polyfills', function() {
    var nativeFrom = Array.from;
    delete Array.from;
    function testFrom() {
      return 'polyfilled!';
    }
    var result = Sugar.Array.defineStaticPolyfill('from', testFrom);
    equal(Array.from(), 'polyfilled!', 'from should be polyfilled');
    equal(result, Sugar.Array, 'defineStaticPolyfill should return the namespace');
    Array.from = nativeFrom;
  });

  group('Defining instance polyfills', function() {
    var nativeForEach = Array.prototype.forEach;
    delete Array.prototype.forEach;
    function testForEach() {
      return 'polyfilled!';
    }
    var result = Sugar.Array.defineInstancePolyfill('forEach', testForEach);
    equal([].forEach(), 'polyfilled!', 'forEach should be polyfilled');
    equal(result, Sugar.Array, 'defineInstancePolyfill should return the namespace');
    Array.prototype.forEach = nativeForEach;
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
    Sugar.Date.defineStatic('foo', function() { return 'foo!'; });
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

  group('Basic Chaining', function() {
    defineCustom(Sugar.String);
    var superString = new Sugar.String('hai');
    equal(superString.foo().raw, 'foo!', 'foo is chainable');
    equal(superString.bar().raw, 'bar!', 'bar is chainable');
    equal(superString.moo().raw, 'moo!', 'moo is chainable');
    equal(superString.foo().valueOf(), 'foo!', 'valueOf also returns raw value');
    equal(superString.foo().bar().moo().raw, 'moo!', 'long chain');
  });

  group('Chainables as factories', function() {
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
    Sugar.Number.defineInstance('large', function(num) {
      // Do I think this number is large??
      return num > 10 ? 'large!' : 'small!';
    });
    Sugar.String.defineInstance('noIs', function(str) {
      // I just love splitting on "i".
      return str.split('a');
    });

    equal(new Sugar.Array([1]).large, undefined, 'array chainable does not have number method');

    var arr = new Sugar.Array([1,2,3]);
    equal(arr.rate().twofold().large().noIs().raw, ['sm','ll!'], 'long chain of methods with odd');

    var arr = new Sugar.Array([1,2]);
    equal(arr.rate().twofold().large().noIs().raw, ['l','rge!'], 'long chain of methods with even');

  });

  group('Chaining with dismbiguation', function() {
    Sugar.Array.defineInstance('foo', function(arr) {
      return 'array says foo';
    });
    Sugar.String.defineInstance('foo', function(arr) {
      return 'string says foo';
    });

    equal(Sugar.Array().foo().raw, 'array says foo', 'Array method');
    equal(Sugar.Array().foo().foo().raw, 'string says foo', 'chained disambiguated from Array');
    equal(Sugar.String().foo().foo().raw, 'string says foo', 'chained disambiguated from String');
    equal(Sugar.Number('a').foo, undefined, 'number has no method foo');
  });

  group('Disambiguation of an undefined namespace', function() {
    Sugar.Array.defineInstance('foo', function(arr) {
      return null;
    });
    Sugar.String.defineInstance('foo', function(arr) {
      return {};
    });
    raisesError(function() { Sugar.Array().foo().foo();  }, 'Null type cannot be disambiguated', TypeError);
    raisesError(function() { Sugar.String().foo().foo(); }, 'Unrelated type cannot be disambiguated from default chainable', TypeError);
    raisesError(function() { Sugar.Number(8).foo(); }, 'Unrelated type cannot be disambiguated from class chainable', TypeError);
  });

  group('Disambiguation only happens once', function() {
    var before, after;
    Sugar.String.defineInstance('foo', function(arr) {
      return 'string foo!';
    });
    Sugar.Number.defineInstance('foo', function(arr) {
      return 'number foo!';
    });
    before = testGetDefaultChainablePrototype().foo;
    Sugar.Array.defineInstance('foo', function(arr) {
      return 'array foo!';
    });
    after = testGetDefaultChainablePrototype().foo;
    equal(before === after, true, 'Disambiguation function was only defined once');
  });

  group('Chainables with Object', function() {
    Sugar.Object.defineInstance('foo', function(arr) {
      return 'object foo!';
    });
    Sugar.String.defineInstance('foo', function(arr) {
      return 'string foo!';
    });
    Sugar.Number.defineInstance('bar', function(arr) {
      return null;
    });
    equal(new Sugar.Number(8).foo().raw, 'object foo!', 'object method should work from non-object chainable');
    equal(new Sugar.String(8).foo().raw, 'string foo!', 'non-object chainable still shadows object');
    equal(new Sugar.Number(8).bar().foo().raw, 'object foo!', 'null type disambiguation falls back to Object');

    Sugar.createNamespace('Boolean');
    equal(new Sugar.Boolean(true).foo().raw, 'object foo!', 'namespaces created later still receive object methods');
    delete Sugar.Boolean;
  });

  group('Chaining special cases', function() {
    Sugar.Array.defineInstance('getNull', function(arr) {
      return null;
    });
    Sugar.Number.defineInstance('getNaN', function(arr) {
      return NaN;
    });
    Sugar.String.defineInstance('getUndefined', function(arr) {
      return undefined;
    });

    equal(Sugar.Array().getNull().getNaN().getUndefined().raw, undefined, 'Chained to undefined');
    equal(Sugar.Number().getNaN().getUndefined().getNull().raw, null, 'Chained to null');
    equal(Sugar.String().getUndefined().getNull().getNaN().raw, NaN, 'Chained to NaN');

  });

  group('Chainable built-in methods', function() {

    defineCustom(Sugar.String);
    var str = new Sugar.String('wow');
    equal(str.charCodeAt(0).toFixed(2).raw, '119.00', 'Chaining built-ins');

    var fn = function(n) { return String.fromCharCode(n); }
    var arr = new Sugar.Array([102,111,111]);
    arr.push(33);
    equal(arr.map(fn).join('.').bar().replace('!', '').raw, 'bar', 'run between native and Sugar methods');

    equal(new Sugar.Array([1,2,3]).map(function() { return 'a'; }).raw, ['a','a','a'], 'built-in is mapped to chainable');
    Sugar.String.defineInstance('map', function(str) {
      return 'enhanced string map!'
    });
    Sugar.Array.defineInstance('map', function(str) {
      return 'enhanced array map!'
    });
    equal(new Sugar.Array([1,2,3]).map().raw, 'enhanced array map!', 'enhanced method is mapped to chainable');
    equal(new Sugar.String('1,2,3').split(',').map().raw, 'enhanced array map!', 'enhanced method is disambiguated');
    equal(new Sugar.String('1,2,3').map().raw, 'enhanced string map!', 'string enhancement still works');

    var dcp = testGetDefaultChainablePrototype();
    equal(dcp.hasOwnProperty === Sugar.Object.prototype.hasOwnProperty, true, 'Object#hasOwnProperty should not require disambiguation');
    equal(testHasOwn(Sugar.String.prototype, 'hasOwnProperty'), true, 'Sugar.String should now have its own hasOwnProperty chainable method');

  });

  group('Chainable valueOf behavior', function() {

    var eight = new Sugar.Number(8);
    equal(eight + 8, 16, 'lhs can add primitives');
    equal(12 + eight, 20, 'rhs can be added to primitives');
    equal(eight > 3, true, 'greater than true');
    equal(eight > 13, false, 'greater than false');
    equal(eight < 3, false, 'less than false');
    equal(eight < 13, true, 'less than true');
    equal(eight >= 8, true, 'greater or equal true');
    equal(eight <= 8, true, 'less than or equal true');
    equal(eight * 2 * 8, 128, 'multiplication');
    equal(eight / 2 / 8, .5, 'division');
    equal(eight % 2, 0, 'modulo');

    var foo = new Sugar.String('foo');
    equal(foo + 'bar', 'foobar', 'lhs string concat works');
    equal('bar' + foo, 'barfoo', 'rhs string concat works');
    equal(foo == 'foo', true, '== equality is true');
    equal(foo == 'bar', false, '== equality is false');

    var f = new Sugar.RegExp(/f/);
    equal(f.test('q') == false, true, '== equality is false');
    equal(f.test('f') == true,  true, '== equality is true');
    equal(f.test('f') === false, false, '=== equality is always false');

  });

  group('Chainable toString behavior', function() {
    equal(new Sugar.Number(8).toString().raw, '8', 'toString returns chainable as well');
    equal(new Sugar.Array([1,2,3]).toString().raw, '1,2,3', 'toString are not generic, but match their built-in class');
    equal(new Sugar.String('a,b').split(',').toString().raw, 'a,b', 'toString disambiguates');
    equal(new Sugar.Object(null).toString().raw, testGetClass(null), 'null with Object#toString');
    equal(new Sugar.Object(undefined).toString().raw, testGetClass(undefined), 'undefined with Object#toString');
  });

  group('Chainable polyfill methods', function() {
    var d = new Date(1460646000000);
    function r(a, b) { return parseInt(a, 10) + parseInt(b, 10); }
    equal(new Sugar.Array(['a','b','c']).indexOf('b').raw, 1, 'indexOf should be mapped');
    equal(new Sugar.Date(d).toISOString().trim().split('-').reduce(r).toFixed(2).raw, '2034.00', 'long chained');
  });

});
