package('Core', function() {
  "use strict";

  group('Extending All', function () {

    // Extending with .extend()
    assertNoMethodsMapped();
    Sugar.extend();
    assertMethodsMappedToNatives('default');
    assertMethodsNotMappedToNatives('Object');
    revertGlobalExtend();

    // Extending with namespace
    assertNoMethodsMapped();
    Sugar();
    assertMethodsMappedToNatives('default');
    assertMethodsNotMappedToNatives('Object');
    revertGlobalExtend();

  });

  group('Extending Array', function () {

    // Extending with .extend()
    assertNoMethodsMapped();
    Sugar.Array.extend();
    assertMethodsMappedToNatives(['Array']);
    assertMethodsNotMappedToNatives(['Object', 'Boolean', 'Number', 'String', 'Date', 'RegExp', 'Function']);
    revertNamespaceExtend('Array');

    // Extending with namespace
    assertNoMethodsMapped();
    Sugar.Array();
    assertMethodsMappedToNatives(['Array']);
    assertMethodsNotMappedToNatives(['Object', 'Boolean', 'Number', 'String', 'Date', 'RegExp', 'Function']);
    revertNamespaceExtend('Array');
  });

  group('Extending Date', function () {

    // Extending with .extend()
    assertNoMethodsMapped();
    Sugar.Date.extend();
    assertMethodsMappedToNatives(['Date']);
    assertMethodsNotMappedToNatives(['Array', 'Object', 'Boolean', 'Number', 'String', 'RegExp', 'Function']);
    revertNamespaceExtend('Date');

    // Extending with namespace
    assertNoMethodsMapped();
    Sugar.Date();
    assertMethodsMappedToNatives(['Date']);
    assertMethodsNotMappedToNatives(['Array', 'Object', 'Boolean', 'Number', 'String', 'RegExp', 'Function']);
    revertNamespaceExtend('Date');
  });

  group('Extending Object', function () {

    // Extending with .extend()
    assertNoMethodsMapped();
    Sugar.Object.extend();
    assertMethodsMappedToNatives(['Object']);
    assertMethodsNotMappedToNatives(['Array', 'Boolean', 'Number', 'Date', 'String', 'RegExp', 'Function']);
    revertNamespaceExtend('Object');

    // Extending with namespace
    assertNoMethodsMapped();
    Sugar.Object();
    assertMethodsMappedToNatives(['Object']);
    assertMethodsNotMappedToNatives(['Array', 'Boolean', 'Number', 'Date', 'String', 'RegExp', 'Function']);
    revertNamespaceExtend('Object');
  });

  group('Extending by Name', function () {

    // Extending with .extend()
    assertNoMethodsMapped();
    Sugar.String.extend('escapeHTML');
    equal('>'.escapeHTML(), '&gt;', 'String#escapeHTML has been mapped');
    equal('>'.unescapeHTML, undefined, 'String#unescapeHTML has not been mapped');
    revertNamespaceExtend('String');

    // Extending with namespace
    assertNoMethodsMapped();
    Sugar.String('escapeHTML');
    equal('>'.escapeHTML(), '&gt;', 'String#escapeHTML has been mapped');
    equal('>'.unescapeHTML, undefined, 'String#unescapeHTML has not been mapped');
    revertNamespaceExtend('String');

    // Extending multiple with .extend()
    assertNoMethodsMapped();
    Sugar.String.extend(['escapeURL', 'escapeHTML']);
    equal('>'.escapeHTML(), '&gt;', 'String#escapeHTML has been mapped');
    equal('%'.escapeURL(), '%25', 'String#escapeURL has been mapped');
    equal('>'.unescapeHTML, undefined, 'String#unescapeHTML has not been mapped');
    equal('%'.unescapeURL, undefined, 'String#unescapeURL has not been mapped');
    revertNamespaceExtend('String');

    // Extending multiple with namespace
    assertNoMethodsMapped();
    Sugar.String(['escapeURL', 'escapeHTML']);
    equal('>'.escapeHTML(), '&gt;', 'String#escapeHTML has been mapped');
    equal('%'.escapeURL(), '%25', 'String#escapeURL has been mapped');
    equal('>'.unescapeHTML, undefined, 'String#unescapeHTML has not been mapped');
    equal('%'.unescapeURL, undefined, 'String#unescapeURL has not been mapped');
    revertNamespaceExtend('String');

  });

  group('Custom Definitions', function () {

    // No defined arguments should work without issue
    Sugar.String.defineInstance({
      foo: function() {
        return 'foo!';
      }
    });
    equal(Sugar.String.foo(), 'foo!', 'Namespace method exists');
    equal(String.prototype.foo, undefined, 'Instance method is undefined');
    Sugar.String.extend('foo');
    equal('wasabi'.foo(), 'foo!', 'Instance method is mapped');


    // 1 argument should be the instance.
    Sugar.String.defineInstance({
      foo: function(str) {
        return str + 'foo!';
      }
    });
    equal(Sugar.String.foo('wasabi'), 'wasabifoo!', 'Namespace method exists');
    Sugar.String.extend('foo');
    equal('wasabi'.foo(), 'wasabifoo!', 'Instance method is mapped');


    // 2 arguments should curry starting with the second.
    Sugar.String.defineInstance({
      foo: function(str, a) {
        return str + '|' + a;
      }
    });
    equal(Sugar.String.foo('foo', '1'), 'foo|1', 'Namespace method exists');
    Sugar.String.extend('foo');
    equal('foo'.foo('1'), 'foo|1', 'Instance method is mapped');

    // 3 arguments
    Sugar.String.defineInstance({
      foo: function(str, a, b) {
        return str + '|' + a + '|' + b;
      }
    });
    equal(Sugar.String.foo('foo', '1', '2'), 'foo|1|2', 'Namespace method exists');
    Sugar.String.extend('foo');
    equal('foo'.foo('1', '2'), 'foo|1|2', 'Instance method is mapped');

    // 4 arguments
    Sugar.String.defineInstance({
      foo: function(str, a, b, c) {
        return str + '|' + a + '|' + b + '|' + c;
      }
    });
    equal(Sugar.String.foo('foo', '1', '2', '3'), 'foo|1|2|3', 'Namespace method exists');
    Sugar.String.extend('foo');
    equal('foo'.foo('1', '2', '3'), 'foo|1|2|3', 'Instance method is mapped');

    // 5 arguments
    Sugar.String.defineInstance({
      foo: function(str, a, b, c, d) {
        return str + '|' + a + '|' + b + '|' + c + '|' + d;
      }
    });
    equal(Sugar.String.foo('foo', '1', '2', '3', '4'), 'foo|1|2|3|4', 'Namespace method exists');
    Sugar.String.extend('foo');
    equal('foo'.foo('1', '2', '3', '4'), 'foo|1|2|3|4', 'Instance method is mapped');

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

    delete String.prototype.foo;

  });

});
