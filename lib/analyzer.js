(function(global) {

  var defineProperty = function(target, name, method) {
    // defineProperty exists in IE8 but will error when trying to define a property on
    // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
    if(Object.defineProperty && Object.defineProperties){
      Object.defineProperty(target, name, { value: method, configurable: true, enumerable: false, writeable: true });
    } else {
      target[name] = method;
    }
  };

  var stored = {};

  var PrototypeMethods = [
    {
      // Global namespace
      type: 'class',
      methods: [
        {
          name: '$A',
          description: '$A exists in Sugar as Array.create.\nBe aware, however, that when a Javascript primitive is passed, it will simply be added to the array.\nIf, for example, you need a string to be split into the array, then use the standard String#split instead. The most common use of this method, converting an arguments object into an actual array, will work, however.',
          original: '$A(arguments)',
          sugar: 'Array.create(arguments)',
          ref: 'Array/create'
        },
        {
          name: '$H',
          description: '$H exists in Sugar as Object.extended.\nThis will return an extended object with instance methods on it similar to hashes in Prototype.\nKeep in mind, however, that the instance methods available to extended objects in Sugar do not 100% match those of Prototype.',
          original: "$H({ 0: 'a', 1: 'b', 2: 'c' })",
          sugar: "Object.extended({ 0: 'a', 1: 'b', 2: 'c' })",
          ref: 'Object/extended'
        },
        {
          name: '$R',
          description: '$R (ObjectRanges) do not exist in Sugar.\nHowever, Number#upto or Number#downto achieve a very similar\neffect by creating arrays that contain that range.',
          original: "$R(0, 10)",
          sugar: "(0).upto(10)",
          ref: 'Number/upto'
        },
        {
          name: '$w',
          description: '$w does not exist in Sugar.\nUse native String#split instead.',
          original: "$w('apples and oranges')",
          sugar: "'apples and oranges'.split(' ')"
        }
      ]
    },
    {
      namespace: 'Number',
      type: 'instance',
      methods: [
        {
          name: 'succ',
          description: 'Number#succ does not exist in Sugar.\nThis is often done with the + operator :)',
          original: "num.succ()",
          sugar: "num + 1"
        },
        {
          name: 'times',
          description: 'Number#times does not accept a second argument, but found {1}.\nIf you need to bind context, use Function#bind instead.',
          conflict: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          original: "(8).times(function(){}, 'barf')",
          sugar: "(8).times(function(){}.bind('barf'))",
          ref: 'Function/bind'
        },
        {
          name: 'toColorPart',
          description: 'Number#toColorPart does not exist in Sugar.\nUse Number#hex can pad to 2 places, however.',
          original: "(255).toColorPart()",
          sugar: "(255).hex(2)",
          ref: 'Number/hex'
        },
        {
          name: 'toPaddedString',
          description: 'Number#toPaddedString exists in Sugar as Number#pad.\nNote that in Sugar, the radix is the third argument, as the second is to force the sign.',
          original: "(20).toPaddedString(4, 2)",
          sugar: "(20).pad(4, false, 2)",
          ref: 'Number/pad'
        },
        {
          name: 'abs',
          description: 'Number#abs exists in Sugar and is identical.',
          conflict: false,
          ref: 'Number/abs'
        },
        {
          name: 'ceil',
          description: 'Number#ceil exists in Sugar.\nIt can additionally round to a precision, specified in the first argument.',
          conflict: false,
          ref: 'Number/ceil'
        },
        {
          name: 'floor',
          description: 'Number#floor exists in Sugar.\nIt can additionally round to a precision, specified in the first argument.',
          conflict: false,
          ref: 'Number/floor'
        },
        {
          name: 'round',
          description: 'Number#round exists in Sugar.\nIt can additionally round to a precision, specified in the first argument.',
          conflict: false,
          ref: 'Number/round'
        }
      ]
    },
    {
      namespace: 'String',
      type: 'class',
      methods: [
        {
          name: 'interpret',
          description: 'String.interpret does not exist in Sugar.\nUse String() instead. Note, however that this will not convert\nnull/undefined into a blank string, as is the case with String.interpret.',
          original: "String.interpret(156)",
          sugar: "String(156)"
        }
      ]
    },
    {
      namespace: 'String',
      type: 'instance',
      methods: [
        {
          name: 'blank',
          description: 'String#blank exists in Sugar as String#isBlank.',
          original: "'hello'.blank()",
          sugar: "'hello'.isBlank()",
          ref: 'String/isBlank'
        },
        {
          name: 'camelize',
          conflict: function() {
            return /[ _]/.test(this);
          },
          description: 'String#camelize found white space or underscores!\nNote that #camelize in Sugar will remove whitespace and operate on underscores the same as dashes.',
          ref: 'String/camelize'
        },
        {
          name: 'dasherize',
          conflict: function() {
            return /[A-Z\s]/.test(this);
          },
          description: 'String#dasherize found white space or capital letters!\nNote that #dasherize in Sugar will remove whitespace and operate on capital letters the same as underscores.',
          ref: 'String/dasherize'
        },
        {
          name: 'empty',
          description: 'String#empty does not exist in Sugar. Use a straight comparison instead.',
          original: "str.empty()",
          sugar: "str === ''"
        },
        {
          name: 'evalJSON',
          description: 'String#evalJSON does not exist in Sugar.\nJSON.parse may work as an alternative, but it is not available in all browsers.\nIf you absolutely require JSON support, consider adding in a separate library such as:\nhttps://github.com/douglascrockford/JSON-js',
          original: "str.evalJSON()",
          sugar: "JSON.parse(str)"
        },
        {
          name: 'evalScripts',
          description: "String#evalScripts does not exist in Sugar.\nIt's highly unlikely that you should be doing something like this anyway, (and even if you are, libraries like jQuery should perform this automatically),\nbut if you really need to in a pinch, something like this may work:",
          original: "str.evalScripts()",
          sugar: "str.match(/<script.*?>.+?<\/script>/g).map(function(m){ return eval(m.replace(/<\/?script.*?>/g, '')); })"
        },
        {
          name: 'extractScripts',
          description: 'String#extractScripts does not exist in Sugar.\nIf you really need to do this, then in a pinch something like this may work.',
          original: "str.extractScripts()",
          sugar: "str.match(/<script.*?>.+?<\/script>/g).map(function(m){ return m.replace(/<\/?script.*?>/g, ''); })"
        },
        {
          name: 'gsub',
          description: 'String#gsub does not exist in Sugar.\nJust use the native .replace function instead.\nNote that Javascript allows functions to be passed to .replace just like gsub.',
          original: "'Image: (img.png)'.gsub(/Image: \(.+\)/, function(match, src){ return '<img src=\"' + src + '\" />'; })",
          sugar: "'Image: (img.png)'.replace(/Image: \(.+\)/, function(match, src){ return '<img src=\"' + src + '\" />'; })"
        },
        {
          name: 'include',
          description: 'String#include exists in Sugar as String#has.',
          original: "'foobar'.include('bar')",
          sugar: "'foobar'.has('bar')",
          ref: 'String/has'
        },
        {
          name: 'inspect',
          description: 'String#inspect does not exist in Sugar. Consider using JSON.stringify(str) instead.\nThe JSON global does not exist in all implementations but should be enough to get you through a debug session.',
          original: "'foofa'.inspect()",
          sugar: "JSON.stringify('foofa')"
        },
        {
          name: 'interpolate',
          description: 'String#interpolate exists in Sugar as String#assign, with a slightly different syntax.',
          original: "'i like #{fruit}'.interpolate({ fruit: 'peaches' })",
          sugar: "'i like {fruit}'.assign({ fruit: 'peaches' })",
          ref: 'String/assign'
        },
        {
          name: 'isJSON',
          description: 'String#isJSON does not exist in Sugar.\nThe simplest way of determining if a value is JSON or not is to attempt parsing and catch errors.\nIf you absolutely require full JSON support, consider adding in a separate library such as:\nhttps://github.com/douglascrockford/JSON-js',
          original: "valid = str.isJSON()",
          sugar: "try { JSON.parse(str); valid = true; } catch(e){ valid = false; }"
        },
        {
          name: 'scan',
          description: 'String#scan exists in Sugar as String#each.',
          original: "'apple, pear & orange'.scan(/\w+/, console.log)",
          sugar: "'apple, pear & orange'.each(/\w+/, console.log)",
          ref: 'String/each'
        },
        {
          name: 'strip',
          description: 'String#strip exists in Sugar as String#trim.',
          original: "'    howdy   '.strip()",
          sugar: "'    howdy   '.trim()",
          ref: 'String/trim'
        },
        {
          name: 'stripScripts',
          description: 'String#stripScripts can be achieved in Sugar with String#removeTags.',
          original: "'<script>doEvilStuff();</script>'.stripScripts()",
          sugar: "'<script>doEvilStuff();</script>'.removeTags('script')",
          ref: 'String/removeTags'
        },
        {
          name: 'stripTags',
          conflict: function() {
            return arguments.length == 0 && /<.*?:.*?>/.test(this);
          },
          description: 'String#stripTags found namespaced tags such as <xsl:template>. Be aware that Sugar will strip these tags too!',
          ref: 'String/stripTags'
        },
        {
          name: 'sub',
          description: 'String#sub does not exist in Sugar.\nStandard Javascript .replace is the closest approximation.\nIf you need to replace more than one occurrence of a pattern (but not all), your best bet is to set a counter and test against it.',
          original: "'one two three four'.sub(' ', ', ', 2)",
          sugar: "var c = 0; 'one two three four'.replace(/\s/g, function(m, i){ c++; return c < 3 ? ', ' : ' '; })"
        },
        {
          name: 'succ',
          description: 'String#succ exists in Sugar as String#shift, which can move up or down the Unicode range by a number which is the first argument passed.',
          original: "'a'.succ()",
          sugar: "'a'.shift(1);",
          ref: 'String/shift'
        },
        {
          name: 'times',
          description: 'String#times exists in Sugar as String#repeat.',
          original: "'echo '.times(3)",
          sugar: "'echo '.repeat(3);",
          ref: 'String/repeat'
        },
        {
          name: 'toArray',
          description: 'String#toArray splits a string into an array of characters.\nThe same effect can be achieved in Sugar by calling String#chars.',
          original: "'howdy'.toArray()",
          sugar: "'howdy'.chars();",
          ref: 'String/chars'
        },
        {
          name: 'toQueryParams',
          description: 'String#toQueryParams exists in Sugar but from an inverted perspective as Object.fromQueryString.\nNote that by default this will also parse out nested params with the non-standard "[]" syntax, however this can be turned off.',
          original: "'section=blog&id=45'.toQueryParams()",
          sugar: "Object.fromQueryString('section=blog&id=45')",
          ref: 'Object/fromQueryString'
        },
        {
          name: 'truncate',
          description: 'String#truncate exists in Sugar but will not split words by default.\nIf you want words to be split, pass true as the last argument.',
          original: "longString.truncate(10, '...')",
          sugar: "longString.truncate(10, '...', true)",
          ref: 'String/truncate'
        },
        {
          name: 'underscore',
          conflict: function() {
            return /\s/.test(this);
          },
          description: 'String#underscore found white space!\nNote that underscore in Sugar will remove all whitespace.',
          ref: 'String/underscore'
        },
        {
          name: 'unfilterJSON',
          description: 'String#unfilterJSON does not exist in Sugar.'
        },
        {
          name: 'capitalize',
          description: 'String#capitalize exists in Sugar and will not break.\nPassing true as the first argument will additionally capitalize all words.',
          conflict: false,
          ref: 'String/capitalize'
        },
        {
          name: 'startsWith',
          description: 'String#startsWith exists in Sugar and will not break.\nSugar additionally accepts an argument for case sensitivity (default is true).',
          conflict: false,
          ref: 'String/startsWith'
        },
        {
          name: 'endsWith',
          description: 'String#endsWith exists in Sugar and will not break.\nSugar additionally accepts an argument for case sensitivity (default is true).',
          conflict: false,
          ref: 'String/endsWith'
        },
        {
          name: 'escapeHTML',
          description: 'String#escapeHTML exists in Sugar is identical.',
          conflict: false,
          ref: 'String/escapeHTML'
        },
        {
          name: 'unescapeHTML',
          description: 'String#unescapeHTML exists in Sugar is identical.',
          ref: 'String/unescapeHTML'
        }
      ]
    },
    {
      namespace: 'Hash',
      type: 'instance',
      methods: [
        {
          name: 'each',
          conflict: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          description: 'Second argument to .each should be a number but instead was {1}. If you need to bind context, use Function#bind instead.',
          original: "new Hash().each(function(){}, 'context')",
          sugar: "Object.extended().each(function(){}.bind('context'))",
          ref: 'Object/each'
        },
        {
          name: 'get',
          description: 'Sugar extended objects do not have a "get" method.\nSimply access the property as you would a normal object literal.',
          original: "var h = new Hash({ foo: 'bar' }); h.get('foo')",
          sugar: "var h = Object.extended({ foo: 'bar' }); h['foo']",
          ref: 'Object/extended'
        },
        {
          name: 'index',
          description: 'Sugar extended objects do not have an "index" method.\nObject.keys can provide help to get this.',
          original: "var key = new Hash({ foo: 'bar' }).index('bar')",
          sugar: "var key; Object.extended({ foo: 'bar' }).keys(function(k){ if(this[k] == 'bar') key = k; })"
        },
        {
          name: 'inspect',
          description: 'Sugar extended objects do not have an "inspect" method.\nConsider using JSON.stringify() instead.\nThe JSON global does not exist in all implementations but should be enough to get you through a debug session.',
          original: "new Hash({ foo: 'bar' }).inspect()",
          sugar: "JSON.stringify(Object.extended({ foo: 'bar' }))"
        },
        {
          name: 'merge',
          description: 'Sugar extended objects have a "merge" method, however they merge the incoming object onto the original and modify it.\nIf you need to create a clone, use the "clone" method first.',
          original: "new Hash({ foo: 'bar' }).merge({ moo: 'car' })",
          sugar: "Object.extended({ foo: 'bar' }).clone().merge({ moo: 'car' })",
          ref: 'Object/merge'
        },
        {
          name: 'set',
          description: 'Sugar extended objects do not have a "set" method.\nSimply set the property as you would a normal object literal.',
          original: "var h = new Hash({ foo: 'bar' }); h.set('moo', 'car')",
          sugar: "var h = Object.extended({ foo: 'bar' }); h['moo'] = 'car'",
          ref: 'Object/extended'
        },
        {
          name: 'toJSON',
          description: 'Sugar extended objects do not have a "toJSON" method. \nJSON.stringify may work as an alternative, but it is not available in all browsers.\nIf you absolutely require JSON support, consider adding in a separate library such as:\nhttps://github.com/douglascrockford/JSON-js',
          original: "Object.toJSON(obj)",
          sugar: "JSON.stringify(obj)"
        },
        {
          name: 'toObject',
          description: 'Sugar extended objects do not have a "toObject" method, as they already behave like vanilla objects.',
          ref: 'Object/extended'
        },
        {
          name: 'toTemplateReplacements',
          description: 'Sugar extended objects do not have a "toTemplateReplacements" method.\nThis method is not necessary as extended objects already behave like vanilla objects.',
          ref: 'Object/extended'
        },
        {
          name: 'unset',
          description: 'Sugar extended objects do not have an "unset" method.\nSimply delete the property as you would a normal object literal.',
          original: "var h = new Hash({ foo: 'bar' }); h.unset('foo')",
          sugar: "var h = Object.extended({ foo: 'bar' }); delete h.foo",
          ref: 'Object/extended'
        },
        {
          name: 'update',
          description: 'Hash#update exists in Sugar as "merge" on extended objects.',
          original: "new Hash({ foo: 'bar' }).merge({ moo: 'car' })",
          sugar: "Object.extended({ foo: 'bar' }).merge({ moo: 'car' })",
          ref: 'Object/merge'
        },
        {
          name: 'clone',
          description: 'Hash#clone exists on Sugar extended objects, and is identical.',
          original: "new Hash({ foo: 'bar' }).clone()",
          sugar: "Object.extended({ foo: 'bar' }).clone()",
          conflict: false,
          ref: 'Object/clone'
        },
        {
          name: 'keys',
          description: 'Hash#keys exists on Sugar extended objects, and is identical.',
          original: "new Hash({ foo: 'bar' }).keys()",
          sugar: "Object.extended({ foo: 'bar' }).keys()",
          conflict: false,
          ref: 'Object/keys'
        },
        {
          name: 'values',
          description: 'Hash#values exists on Sugar extended objects, and is identical.',
          original: "new Hash({ foo: 'bar' }).values()",
          sugar: "Object.extended({ foo: 'bar' }).values()",
          conflict: false,
          ref: 'Object/values'
        },
        {
          name: 'toQueryString',
          description: 'Hash#toQueryString does not exist in Sugar, and requires a workaround.',
          original: "hash.toQueryString()",
          sugar: "var arr, str; Object.each(hash, function(k,v){ arr.push(k+'='+v); }); str = arr.join('&').escapeURL()"
        }
      ]
    },
    {
      namespace: 'Object',
      type: 'class',
      methods: [
        {
          name: 'clone',
          description: 'Object.clone exists in Sugar and will not break.\nPassing true as the first argument will create deep copies.',
          conflict: false,
          ref: 'Object/clone'
        },
        {
          name: 'extend',
          description: 'Object.extend exists in Sugar as Object.merge.\nSugar can additionally accept a third argument to intelligently resolve property conflicts.',
          original: "Object.extend({ a: 1 }, { b: 2 })",
          sugar: "Object.merge({ a: 1 }, { b: 2 })",
          ref: 'Object/merge'
        },
        {
          name: 'inspect',
          description: 'Object.inspect does not exist in Sugar. Consider using JSON.stringify(object) instead.\nThe JSON global does not exist in all implementations but should be enough to get you through a debug session.',
          original: "Object.inspect([1,2,3])",
          sugar: "JSON.stringify([1,2,3])"
        },
        {
          name: 'isHash',
          description: 'Object.isHash does not exist in Sugar. Use Object.isObject instead.',
          original: "Object.isHash({ a: 1 })",
          sugar: "Object.isObject({ a: 1 })",
          ref: 'Object/isObject'
        },
        {
          name: 'isUndefined',
          description: 'Object.isUndefined does not exist in Sugar. Use straight Javascript instead.',
          original: "Object.isUndefined(obj)",
          sugar: "obj === undefined"
        },
        {
          name: 'toJSON',
          description: 'Object.toJSON does not exist in Sugar.\nJSON.stringify may work as an alternative, but it is not available in all browsers.\nIf you absolutely require JSON support, consider adding in a separate library such as:\nhttps://github.com/douglascrockford/JSON-js',
          original: "Object.toJSON(obj)",
          sugar: "JSON.stringify(obj)"
        },
        {
          name: 'isArray',
          description: 'Object.isArray exists in Sugar and is identical.',
          conflict: false,
          ref: 'Object/isArray'
        },
        {
          name: 'isDate',
          description: 'Object.isDate exists in Sugar and is identical.',
          conflict: false,
          ref: 'Object/isDate'
        },
        {
          name: 'isFunction',
          description: 'Object.isFunction exists in Sugar and is identical.',
          conflict: false,
          ref: 'Object/isFunction'
        },
        {
          name: 'isNumber',
          description: 'Object.isNumber exists in Sugar and is identical.',
          conflict: false,
          ref: 'Object/isNumber'
        },
        {
          name: 'isString',
          description: 'Object.isString exists in Sugar and is identical.',
          conflict: false,
          ref: 'Object/isString'
        },
        {
          name: 'keys',
          description: 'Object.keys exists in Sugar and is identical.',
          conflict: false,
          ref: 'Object/keys'
        },
        {
          name: 'values',
          description: 'Object.values exists in Sugar and is identical.',
          conflict: false,
          ref: 'Object/values'
        },
        {
          name: 'isElement',
          description: "Object.isElement does not exist in Sugar,\nas it has no direct association with the DOM. However this functionality can be easily replicated (taken from Prototype's own implementation).",
          original: 'Object.isElement(obj)',
          sugar: 'Object.isElement = function(obj){ return !!(obj && obj.nodeType == 1); }'
        },
        {
          name: 'toHTML',
          description: "Object.toHTML does not exist in Sugar.\nYou'll have to do this one yourself!"
        },
        {
          name: 'toQueryString',
          description: 'Hash#toQueryString does not exist in Sugar, and requires a workaround.',
          original: "Object.toQueryString(obj)",
          sugar: "var arr, str; Object.each(obj, function(k,v){ arr.push(k+'='+v); }); str = arr.join('&').escapeURL()"
        }
      ]
    },
    {
      namespace: 'Array',
      type: 'class',
      methods: [
        {
          name: 'from',
          description: 'Array.from exists in Sugar as Array.create.\nBe aware, however, that when a Javascript primitive is passed, it will simply be added to the array.\nIf, for example, you need a string to be split into the array, then use the standard String#split instead. The most common use of this method, converting an arguments object into an actual array, will work, however.',
          original: "Array.from(arguments)",
          sugar: "Array.create(arguments)",
          ref: 'Array.create'
        }
      ]
    },
    {
      namespace: 'Array',
      type: 'instance',
      methods: [
        {
          name: 'collect',
          description: 'Enumerable#collect does not exist in Sugar. Use Array#map instead.',
          original: "[1,2,3].collect(function(n){ return n * 2; })",
          sugar: "[1,2,3].map(function(n){ return n * 2; })",
          ref: 'Array/map'
        },
        {
          name: 'detect',
          description: 'Enumerable#detect exists in Sugar as Array#find.\nSome semantic differences exist including the ability to pass a starting index in the place of in-line context binding.',
          original: "[1,2,3].detect(function(n){ return n > 1; })",
          sugar: "[1,2,3].find(function(n){ return n > 1; })",
          ref: 'Array/find'
        },
        {
          name: 'each',
          conflict: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          description: 'Second argument to .each should be a number but instead was {1}. If you need to bind context, use Function#bind instead.',
          original: "['a','b','c'].each(function(){}, 'context')",
          sugar: "['a','b','c'].each(function(){}.bind('context'))",
          ref: 'Array/each'
        },
        {
          name: 'eachSlice',
          description: 'Enumerable#eachSlice exists in Sugar as Array#inGroupsOf instead.',
          original: "[1,2,3,4].eachSlice(2, function(){})",
          sugar: "[1,2,3,4].inGroupsOf(2).each(function(){})",
          ref: 'Array/inGroupsOf'
        },
        {
          name: 'entries',
          description: 'Enumerable#entries does not exist in Sugar, but Array#clone or browser native Array#concat will do the same thing.',
          original: "[1,2,3].entries()",
          sugar: "[1,2,3].clone()",
          ref: 'Array/clone'
        },
        {
          name: 'find',
          conflict: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          description: 'Second argument to Array#find should be a number but instead was {1}. If you need to bind context, use Function#bind instead.',
          original: "['a','b','c'].find(function(){}, 'context')",
          sugar: "['a','b','c'].find(function(){}.bind('context'))",
          ref: 'Function/bind'
        },
        {
          name: 'findAll',
          conflict: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          description: 'Second argument to Array#findAll should be a number but instead was {1}. If you need to bind context, use Function#bind instead.',
          original: "['a','b','c'].findAll(function(){}, 'context')",
          sugar: "['a','b','c'].findAll(function(){}.bind('context'))",
          ref: 'Function/bind'
        },
        {
          name: 'grep',
          description: 'Enumerable#grep exists in Sugar as Array#findAll with slightly different semantics.',
          original: "['a','b','c'].grep(/[ab]/)",
          sugar: "['a','b','c'].findAll(/[ab]/)",
          ref: 'Array/findAll'
        },
        {
          name: 'include',
          conflict: function(f) {
            return typeof f !== 'object' && arguments.length == 1;
          },
          description: 'Enumerable#include in Protype detects if an element is in the array and returns true/false.\nIn Sugar this method instead adds the argument passed to the array without modifying it.\nArray#include is a reciprocal of Array#exclude, and a non-destructive version of Array#add.\nUse Array#has instead for equivalent functionality.',
          original: "[1,2,3].include(1)",
          sugar: "[1,2,3].has(1)",
          ref: 'Array/has'
        },
        {
          name: 'inject',
          description: 'Enumerable#inject does not exist in Sugar. Use Javascript native Array#reduce to achieve the same effect.',
          original: '[1,2,3,4].inject(100, function(a, b){ return a + b; });',
          sugar: '[1,2,3,4].reduce(function(a, b){ return a + b; }, 100);'
        },
        {
          name: 'invoke',
          description: 'Enumerable#invoke does not exist in Sugar. Use Array#map to achieve the same effect.',
          original: "['hello','world'].invoke('toUpperCase')",
          sugar: "['hello','world'].map('toUpperCase')",
          ref: 'Array/map'
        },
        {
          name: 'max',
          description: 'Use caution when using Enumerable#max:\n\n(1) Sugar will return an array of maximum values (as there can be more than one), where Prototype only returns the first value.\n(2) When using iterators, Prototype will return the value compared, where Sugar will return the actual array element itself.\n(3) Finally, Sugar does not allow a context to be passed. Use Function#bind instead to bind context.',
          original: "[{ a: 5 },{ a: 10 }].max(function(el){ return el['a']; }, 'context')",
          sugar: "[{ a: 5 },{ a: 10 }].max(function(el){ return el['a']; }.bind('context')).first().a",
          ref: 'Array/max'
        },
        {
          name: 'member',
          description: 'Enumerable#member does not exist in Sugar. Use Array#has instead.',
          original: "[1,2,3].member(1)",
          sugar: "[1,2,3].has(1)",
          ref: 'Array/has'
        },
        {
          name: 'min',
          description: 'Use caution when using Enumerable#min:\n\n(1) Sugar will return an array of minimum values (as there can be more than one), where Prototype only returns the first value.\n(2) When using iterators, Prototype will return the value compared, where Sugar will return the actual array element itself.\n(3) Finally, Sugar does not allow a context to be passed.',
          original: "[{ a: 5 },{ a: 10 }].min(function(el){ return el['a']; }, 'context')",
          sugar: "[{ a: 5 },{ a: 10 }].min(function(el){ return el['a']; }.bind('context')).first().a",
          ref: 'Array/min'
        },
        {
          name: 'partition',
          description: "Enumerable#partition does not exist in Sugar.\nArray#groupBy however has similar functionality, and may be a suitable alternative.\nIt will create a hash with keys based on the return values of the iterator, with each grouping as the value.\nInstead of accessing the split array, you can access the hash by these keys.\nThis method has the added advantage that it can also split into more than two groups.",
          original: "[1,2,3,4,5,6].partition(function(n){ return n % 2 === 0; })",
          sugar: "[1,2,3,4,5,6].group(function(n){ return n % 2 === 0 ? 'even' : 'odd'; })",
          ref: 'Array/groupBy'
        },
        {
          name: 'pluck',
          description: 'Enumerable#pluck does not exist in Sugar. Use Array#map instead.',
          original: "['hello','world'].pluck('length')",
          sugar: "['hello','world'].map('length')",
          ref: 'Array/map'
        },
        {
          name: 'reject',
          description: "Enumerable#reject does not exist in Sugar. Its equivalent is Array#exclude.\nThis is a non-destructive way to remove elements from an array.\nIf you want a destructive version, use Array#remove instead.\nAlso note these methods' reciprocals: Array#include and Array#add.",
          original: "[1,2,3].reject(function(n){ n < 3; })",
          sugar: "[1,2,3].exclude(function(n){ n < 3; })",
          ref: 'Array/exclude'
        },
        {
          name: 'select',
          description: 'Enumerable#select does not exist in Sugar. Use Array#findAll instead.',
          original: "[1,2,3].select(function(n){ n < 3; })",
          sugar: "[1,2,3].findAll(function(n){ n < 3; })",
          ref: 'Array/findAll'
        },
        {
          name: 'sortBy',
          conflict: function(f, scope) {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'boolean', arguments[1]];
          },
          description: 'Second argument to .sortBy should be a boolean but instead was {1}. If you need to bind context, use Function#bind instead.',
          original: "[{ a: 5 },{ a: 10 }].sortBy(function(el){ return el['a']; })",
          sugar: "[{ a: 5 },{ a: 10 }].sortBy(function(el){ return el['a']; }.bind('context'))",
          ref: 'Function/bind'
        },
        {
          name: 'size',
          description: 'Enumerable#size does not exist in Sugar. Just use array.length!',
          original: "[1,2,3].size()",
          sugar: "[1,2,3].length"
        },
        {
          name: 'toArray',
          description: 'Enumerable#toArray does not exist in Sugar. Use Array#clone instead.',
          original: "[1,2,3].toArray()",
          sugar: "[1,2,3].clone()",
          ref: 'Array/clone'
        },
        {
          name: 'zip',
          description: 'Enumerable#zip does not exist in Sugar. Array#map can easily achieve the same functionality, however.',
          original: "firstNames.zip(lastNames)",
          sugar: "firstNames.map(function(name, index){ return [name, lastNames[index]]; })",
          ref: 'Array/map'
        },
        {
          name: 'compact',
          conflict: function() {
            for(var i = 0; i < this.length; i++){
              if(isNaN(this[i])) return true;
            }
            return false;
          },
          description: 'Caution: Array#compact was called on an array that contains NaN values. Sugar will remove these from the array while Prototype leaves them alone.',
          ref: 'Array/compact'
        },
        {
          name: 'clear',
          description: 'Array#clear does not exist in Sugar. Use array = [] instead.',
          original: "f.clear()",
          sugar: "f = []"
        },
        {
          name: 'inspect',
          description: 'Array#inspect does not exist in Sugar. Consider using JSON.stringify(array) instead.\nThe JSON global does not exist in all implementations but should be enough to get you through a debug session.',
          original: "[1,2,3].inspect()",
          sugar: "JSON.stringify([1,2,3])"
        },
        {
          name: 'reverse',
          conflict: function(inline) {
            return inline === false;
          },
          description: 'Array#reverse exists in native Javascript, but is destructive. Try cloning the array first.',
          original: "array.reverse(false)",
          sugar: "array.clone().reverse()",
          ref: 'Array.clone'
        },
        {
          name: 'uniq',
          description: 'Array#uniq exists in Sugar as Array#unique.',
          original: "[1,1,1].uniq()",
          sugar: "[1,1,1].unique()",
          ref: 'Array/unique'
        },
        {
          name: 'without',
          description: 'Array#without exists in Sugar as Array#exclude.',
          original: "[1,2,3].without(3)",
          sugar: "[1,2,3].exclude(3)",
          ref: 'Array/exclude'
        },
        {
          name: 'indexOf',
          description: 'Array#indexOf exists natively in modern browsing engines.\nSugar provides this method when it is not supported.',
          conflict: false,
          ref: 'Array/indexOf'
        },
        {
          name: 'lastIndexOf',
          description: 'Array#lastIndexOf exists natively in modern browsing engines.\nSugar provides this method when it is not supported.',
          conflict: false,
          ref: 'Array/lastIndexOf'
        },
        {
          name: 'all',
          description: 'Array#all exists in Sugar as an alias to native Array#every (for which it adds a polyfill for browsers without support), and is identical.',
          conflict: false,
          ref: 'Array/all'
        },
        {
          name: 'any',
          description: 'Array#any exists in Sugar as an alias to native Array#some (for which it adds a polyfill for browsers without support).',
          conflict: false,
          ref: 'Array/any'
        },
        {
          name: 'map',
          description: 'Array#map exists natively in modern browsing engines.\nSugar provides this method when it is not supported, and additionally augments it to handle string shortcuts.',
          conflict: false,
          ref: 'Array/map'
        },
        {
          name: 'every',
          description: 'Array#every exists natively in modern browsing engines.\nSugar provides this method when it is not supported, and additionally augments it to handle strings, numbers, regexes, and deep objects.',
          conflict: false,
          ref: 'Array/every'
        },
        {
          name: 'filter',
          description: 'Array#filter exists natively in modern browsing engines.\nSugar provides this method when it is not supported, and additionally augments it to handle strings, numbers, regexes, and deep objects.',
          conflict: false,
          ref: 'Array/filter'
        },
        {
          name: 'some',
          description: 'Array#some exists natively in modern browsing engines.\nSugar provides this method when it is not supported, and additionally augments it to handle strings, numbers, regexes, and deep objects.',
          conflict: false,
          ref: 'Array/some'
        },
        {
          name: 'inGroupsOf',
          description: 'Array#inGroupsOf exists in Sugar and is identical.',
          conflict: false,
          ref: 'Array/inGroupsOf'
        },
        {
          name: 'clone',
          description: 'Array#clone exists in Sugar and is identical.',
          conflict: false,
          ref: 'Array/clone'
        },
        {
          name: 'first',
          description: 'Array#first exists in Sugar, and can additionally get the first n elements.',
          conflict: false,
          ref: 'Array/first'
        },
        {
          name: 'last',
          description: 'Array#last exists in Sugar, and can additionally get the last n elements.',
          conflict: false,
          ref: 'Array/last'
        },
        {
          name: 'flatten',
          description: 'Array#flatten exists in Sugar, and can additionally flatten an array to any level.',
          conflict: false,
          ref: 'Array/flatten'
        },
        {
          name: 'intersect',
          description: 'Array#intersect exists in Sugar, and can additionally get the intersection of any number of arrays passed in.',
          conflict: false,
          ref: 'Array/intersect'
        }
      ]
    },
    {
      namespace: 'Function',
      type: 'instance',
      methods: [
        {
          name: 'bind',
          description: 'Function#bind exists natively in modern browsing engines.\nSugar provides this method when it is not supported.',
          conflict: false,
          ref: 'Function/bind'
        },
        {
          name: 'argumentNames',
          description: 'Function#argumentNames does not exist in Sugar.'

        },
        {
          name: 'bindAsEventListener',
          description: 'Function#bindAsEventListener does not exist in Sugar.\nIf this is a problem, it can be easily sidestepped.\nFirst, Function#bind will function identically as long as you are not currying arguments.\nIf you are currying arguments you will still receive the event, it will just be at the end of the argument array instead of the beginning.\nAs long as you keep this in mind you should be able to refactor to use .bind instead.',
          original: "var fn = function(event, one) {\n\t  // this will be \"bound\"\n\t  // event will be the event\n\t  // one will be 1\n\t}\n\tfn.bindAsEventListener('bound', 1)\n",
          sugar: "var fn = function(one, event) {\n\t  // this will be \"bound\"\n\t  // one will be 1\n\t  // event will be the event (comes last)\n\t}\n\tfn.bind('bound', 1)",
          ref: 'Function/bind'
        },
        {
          name: 'curry',
          description: 'Function#curry does not exist in Sugar.\nSimply use Function#bind with null as the first argument.',
          original: "fn.curry('one','two')",
          sugar: "fn.bind(null, 'one', 'two')",
          ref: 'Function/bind'
        },
        {
          name: 'defer',
          description: 'Function#defer exists in Sugar as Function#delay.\nWhen no params are passed it will behave precisely the same as calling the function with a timeout of 1 ms (as with defer).',
          original: "fn.defer()",
          sugar: "fn.delay()",
          ref: 'Function/delay'
        },
        {
          name: 'delay',
          description: 'Function#delay exists in Sugar, but is slightly different.\nFirst, the delay is passed in milliseconds, not seconds.\nSecond, delay will return a reference to the function instead of an integer to clear the timeout.\nIf you need to cancel the timeout, instead use Function#cancel.\nArguments passed after the timeout are still curried like Prototype.',
          original: "var t = fn.delay(2)\n\tclearTimeout(t)\n",
          sugar: "fn.delay(2000)\n\tfn.cancel()",
          ref: 'Function/delay'
        },
        {
          name: 'methodize',
          description: 'Function#methodize does not exist in Sugar.\nNo direct equivalent exists, but in a pinch the following code will achieve the same effect.\nIf this is an important method you use all the time,\nplease let me know via GitHub (https://github.com/andrewplummer/Sugar) and I will consider adding it.',
          original: "obj.method = fn.methodize()",
          sugar: "obj.method = function(){ fn.apply(null, [this].concat(Array.prototype.slice.call(arguments))); }"
        },
        {
          name: 'wrap',
          description: 'Function#wrap does not exist in Sugar.\nNo direct equivalent exists, but Function#bind can be used to achieve the same effect in a pinch.',
          original: "fn = fn.wrap(function(original){ return original() + 3; })",
          sugar: "fn = (function(original){ return original() + 3; }).bind(null, fn);"
        }
      ]
    },
    {
      namespace: 'Date',
      type: 'instance',
      methods: [
        {
          name: 'toISOString',
          description: 'Date#toISOString exists natively in modern browsing engines.\nSugar provides this method when it is not supported.',
          conflict: false,
          ref: 'Date/toISOString'
        },
        {
          name: 'toJSON',
          description: 'Date#toJSON exists natively in modern browsing engines.\nSugar provides this method when it is not supported.',
          conflict: false,
          ref: 'Date/toJSON'
        }
      ]
    }
  ];


  var UnderscoreMethods = [
    {
      namespace: '_',
      type: 'class',
      methods: [
        {
          name: 'each',
          description: '_.each exists natively in modern browsing engines as Array#forEach.\nSugar provides this method when it is not supported. It also provides Array#each,\nwhich can break out of the loop, start from a given index, loop from the beginning,\nand intelligently handle sparse arrays.',
          original: '_.each([1,2,3], function(element, index, array){})',
          sugar: '[1,2,3].forEach(function(element, index, array){})',
          ref: 'Array/each'
        },
        {
          name: 'map',
          description: '_.map exists natively in modern browsing engines as Array#map.\nSugar provides this method when it is not supported, and additionally augments it to allow passing a string as a shortcut.',
          original: '_.map([1,2,3], function(a){ return a * 2; })',
          sugar: '[1,2,3].map(function(a){ return a * 2; })',
          ref: 'Array/map'
        },
        {
          name: 'reduce',
          description: '_.reduce exists natively in modern browsing engines as Array#reduce.\nSugar provides this method when it is not supported.',
          original: '_.reduce([1,2,3], function(m, a){ return m + a; })',
          sugar: '[1,2,3].reduce(function(m, a){ return m + a; })',
          ref: 'Array/reduce'
        },
        {
          name: 'reduceRight',
          description: '_.reduceRight exists natively in modern browsing engines as Array#reduceRight.\nSugar provides this method when it is not supported.',
          original: '_.reduceRight([1,2,3], function(m, a){ return m + a; })',
          sugar: '[1,2,3].reduceRight(function(m, a){ return m + a; })',
          ref: 'Array/reduceRight'
        },
        {
          name: 'find',
          description: '_.find exists in Sugar as Array#find, and additionally allows searching on primitives, deep objects, and testing against regexes.',
          original: '_.find([1,2,3], function(a){ return a == 1; })',
          sugar: '[1,2,3].find(1)',
          bind_context: true,
          ref: 'Array/find'
        },
        {
          name: 'filter',
          description: '_.filter exists natively in modern browsing engines as Array#filter.\nSugar provides this method when it is not supported, and additionally augments it to allow search on primitives, deep objects, or against a regex.\nSugar also provides Array#findAll which can start from a given index, loop from the beginning, and intelligently handles sparse arrays.',
          original: '_.filter([1,2,3], function(a){ return a % 2 == 0; })',
          sugar: '[1,2,3].reduceRight(function(a){ return a % 2 == 0; })',
          ref: 'Array/filter'
        },
        {
          name: 'reject',
          description: '_.reject exists in Sugar as Array#exclude.\nIt additionally allows searching on primitives, deep objects, or against a regex. This method is non-destructive with a destructive reciprocal method: Array#remove.',
          original: '_.reject([1,2,3,4,5,6], function(a){ return a % 2 == 0; })',
          sugar: '[1,2,3,4,5,6].exclude(function(a){ return a % 2 == 0; })',
          ref: 'Array/exclude'
        },
        {
          name: 'all',
          description: '_.all exists natively in modern browsing engines as Array#every.\nSugar provides this method when it is not supported, and addtionally augments it to search on primitives, deep objects, or against a regex.\nSugar also has its own alias Array#all.',
          original: '_.all([1,2,3], function(a){ return a == 2; })',
          sugar: '[1,2,3].all(function(a){ return a % 2 == 0; })',
          ref: 'Array/all'
        },
        {
          name: 'any',
          description: '_.any exists natively in modern browsing engines as Array#some.\nSugar provides this method when it is not supported, and addtionally augments it to search on primitives, deep objects, or against a regex.\nSugar also has its own alias Array#any.',
          original: '_.any([1,2,3], function(a){ return a % 2 == 0; })',
          sugar: '[1,2,3].any(function(a){ return a % 2 == 0; })',
          ref: 'Array/any'
        },
        {
          name: 'include',
          description: '_.include exists in Sugar as browser native Array#some,\nwhich it augments to search on primitive types, deep objects, or against regexes.\nSugar also has its own alias Array#any, which has identical functionality.',
          original: '_.include([1,2,3], 3)',
          sugar: '[1,2,3].any(3)',
          ref: 'Array/any'
        },
        {
          name: 'invoke',
          description: '_.invoke does not exist in Sugar.\nIn most cases, invoking functions through standard methods is more readable.',
          original: "_.invoke([5,1,7],[3,2,1], 'sort')",
          sugar: '[[5,1,7],[3,2,1]].each(function(a){ a.sort(); })',
          ref: 'Array/each'
        },
        {
          name: 'pluck',
          description: '_.pluck exists in Sugar as browser native Array#map, which it augments to accept a string as a shortcut.',
          original: "_.pluck([{name:'moe'},{name:'larry'},{name:'curly'}], 'name')",
          sugar: "[{name:'moe'},{name:'larry'},{name:'curly'}].map('name')",
          ref: 'Array/map'
        },
        {
          name: 'max',
          description: '_.max exists in Sugar as Array#max.\nIt is nearly identical, except that it always returns an array, as there may be more than one max value.',
          original: '_.max([1,2,3])',
          sugar: '[1,2,3].max().first()',
          ref: 'Array/max'
        },
        {
          name: 'min',
          description: '_.min exists in Sugar as Array#min.\nIt is nearly identical, except that it always returns an array, as there may be more than one min value.',
          original: '_.min([1,2,3])',
          sugar: '[1,2,3].min().first()',
          ref: 'Array/min'
        },
        {
          name: 'sortBy',
          description: '_.sortBy exists in Sugar as Array#sortBy.\nIn addition to an iterating function, it will also accept a string as a shortcut to the property to sort by.',
          original: '_.sortBy([1,2,3], Math.sin)',
          sugar: '[1,2,3].sortBy(Math.sin)',
          ref: 'Array/sortBy'
        },
        {
          name: 'groupBy',
          description: '_.groupBy exists in Sugar as Array#groupBy.\nIt allows passing a string as a shortcut to a property and additionally allows an optional callback to be called for each group.',
          original: '_.groupBy([1,2,3,4], function(n){ return n > 2; })',
          sugar: '[1,2,3,4].groupBy(function(n){ return n > 2; })',
          ref: 'Array/groupBy'
        },
        {
          name: 'sortedIndex',
          description: '_.sortedIndex does not exist in Sugar.\nClever use of Array#reduce can achieve something similar, depending on the case.',
          original: '_.sortedIndex([1,2,3,5], 4)',
          sugar: '[1,2,3,5].reduce(function(a, b, i){ if(b > 4) return i - 1; })',
          ref: 'Array/reduce'
        },
        {
          name: 'shuffle',
          description: '_.shuffle exists in Sugar as Array#randomize.\nSugar also uses a Fisher-Yates algorithm.',
          original: '_.shuffle([1,2,3,4])',
          sugar: '[1,2,3,4].randomize()',
          ref: 'Array/randomize'
        },
        {
          name: 'toArray',
          description: '_.toArray exists in Sugar as Array.create, which can accept multiple arguments.',
          original: '_.toArray(arguments)',
          sugar: 'Array.create(arguments)',
          ref: 'Array/create'
        },
        {
          name: 'size',
          description: '_.size does not exist in Sugar.\nIf you need to know the "size" of a hash, you can get the length of Object.keys, although in that case it\'s likely that you should be using an array in any case.',
          original: '_.size(obj)',
          sugar: 'Object.keys(obj).length',
          ref: 'Object/keys'
        },
        {
          name: 'first',
          description: '_.first exists in Sugar as Array#first, and is identical.',
          original: '_.first([1,2,3])',
          sugar: '[1,2,3].first()',
          ref: 'Array/first'
        },
        {
          name: 'initial',
          description: '_.initial does not exist in Sugar.\nUse a negative value for Array#to for the same effect.',
          original: '_.initial([1,2,3], 2)',
          sugar: '[1,2,3].to(-2)',
          ref: 'Array/to'
        },
        {
          name: 'last',
          description: '_.last exists in Sugar as Array#last, and is identical.',
          original: '_.last([1,2,3])',
          sugar: '[1,2,3].last()',
          ref: 'Array/last'
        },
        {
          name: 'rest',
          description: '_.rest does not exist in Sugar.\nUse a Array#from for the same effect.',
          original: '_.rest([1,2,3], 2)',
          sugar: '[1,2,3].from(2)',
          ref: 'Array/from'
        },
        {
          name: 'compact',
          description: '_.compact exists in Sugar as Array#compact.\nNote that only undefined, null, and NaN are removed by default. To remove all falsy values, pass true as the first argument.',
          original: '_.compact([1,0,3,null])',
          sugar: '[1,0,3,null].compact(true)',
          ref: 'Array/compact'
        },
        {
          name: 'flatten',
          description: '_.flatten exists in Sugar as Array#flatten.\nSugar can additionally flatten to any level of depth, specified in the first argument (all levels by default).',
          original: '_.flatten([1,[2,3]])',
          sugar: '[1,[2,3]].flatten()',
          ref: 'Array/flatten'
        },
        {
          name: 'without',
          description: '_.without exists in Sugar as Array#exclude, and is identical.',
          original: '_.without([1,2,3], 1)',
          sugar: '[1,2,3].exclude(1)',
          ref: 'Array/exclude'
        },
        {
          name: 'union',
          description: '_.union exists in Sugar as Array#union, and is identical.',
          original: '_.union([1,2,3], [3,4,5])',
          sugar: '[1,2,3].union([3,4,5])',
          ref: 'Array/union'
        },
        {
          name: 'intersection',
          description: '_.intersection exists in Sugar as Array#intersect, and is identical.',
          original: '_.intersect([1,2,3], [3,4,5])',
          sugar: '[1,2,3].intersect([3,4,5])',
          ref: 'Array/intersect'
        },
        {
          name: 'difference',
          description: '_.difference exists in Sugar as Array#subtract, which can subtract an indefinite number of arrays.',
          original: '_.difference([1,2,3], [3,4,5])',
          sugar: '[1,2,3].subtract([3,4,5])',
          ref: 'Array/subtract'
        },
        {
          name: 'uniq',
          description: '_.uniq exists in Sugar as Array#unique.\nIn addition to accepting a function to transform (map) the property on which to unique, Sugar will also accept a string that is a shortcut to this function. This would most commonly be the unique key of a JSON object, etc.',
          original: '_.uniq([1,2,1,3,1,4])',
          sugar: '[1,2,1,3,1,4].unique()',
          ref: 'Array/unique'
        },
        {
          name: 'zip',
          description: '_.zip exists in Sugar as Array#zip and is identical.',
          original: '_.zip(arr1, arr2)',
          sugar: 'arr1.zip(arr2)',
          ref: 'Array/zip'
        },
        {
          name: 'indexOf',
          description: '_.indexOf exists natively in modern browsing engines as Array#indexOf.\nSugar provides this method when it is not supported.',
          original: '_.indexOf([1,2,3], 1)',
          sugar: '[1,2,3].indexOf(1)',
          ref: 'Array/indexOf'
        },
        {
          name: 'lastIndexOf',
          description: '_.lastIndexOf exists natively in modern browsing engines as Array#lastIndexOf.\nSugar provides this method when it is not supported.',
          original: '_.lastIndexOf([1,2,3], 1)',
          sugar: '[1,2,3].lastIndexOf(1)',
          ref: 'Array/lastIndexOf'
        },
        {
          name: 'range',
          description: '_.range exists in Sugar on numbers as Number#upto and Number#downto.\nSugar additionally accepts a second argument which is a callback that will be run for each number in the range. The [step] parameter becomes the 3rd argument.',
          original: '_.range(0, 30, 5)',
          sugar: '(0).upto(30, null, 5)',
          ref: 'Number/upto'
        },
        {
          name: 'bind',
          description: '_.bind exists natively in modern browsing engines as Function#bind.\nSugar provides this method when it is not supported.',
          original: '_.bind(fn, obj, 1)',
          sugar: 'fn.bind(obj, 1)',
          ref: 'Function/bind'
        },
        {
          name: 'bindAll',
          description: '_.bindAll does not exist in Sugar.\nHowever, the same functionality can be achieved through a workaround.',
          original: '_.bindAll(obj)',
          sugar: 'Object.each(obj, function(key, val){ if(Object.isFunction(val)) obj[key] = val.bind(obj); })',
          ref: 'Function/bind'
        },
        {
          name: 'memoize',
          description: '_.memoize exists in Sugar as Function#once.\nIt does not have the optional [hashFunction] parameter.',
          original: '_.memoize(fn)',
          sugar: 'fn.once()',
          ref: 'Function/once'
        },
        {
          name: 'delay',
          description: '_.delay exists in Sugar as Function#delay, and is identical.',
          original: '_.delay(fn, 1000, 1)',
          sugar: 'fn.delay(1000, 1)',
          ref: 'Function/delay'
        },
        {
          name: 'defer',
          description: '_.defer exists in Sugar as Function#delay, called with no arguments.',
          original: '_.defer(fn)',
          sugar: 'fn.delay()',
          ref: 'Function/delay'
        },
        {
          name: 'throttle',
          description: '_.throttle exists in Sugar as Function#lazy.\nIn addition to basic throttling, Function#lazy can also accepts an upper limit to the queue of functions waiting to execute.',
          original: '_.throttle(fn, 100)',
          sugar: 'fn.lazy(100)',
          ref: 'Function/lazy'
        },
        {
          name: 'debounce',
          description: '_.debounce exists in Sugar as Function#debounce.\nIn addition to the standard functionality of waiting then firing, Function#debounce also has an option to do the opposite: fire then wait.',
          original: '_.debounce(fn, 100)',
          sugar: 'fn.debounce(100)',
          ref: 'Function/debounce'
        },
        {
          name: 'once',
          description: '_.once exists in Sugar as Function#once.\nIn Sugar it is identical to the functionality of _.memoize.',
          original: '_.once(fn)',
          sugar: 'fn.once()',
          ref: 'Function/once'
        },
        {
          name: 'after',
          description: '_.after exists in Sugar as Function#after.\nThe final callback will be passed an array of all argument objects collected (converted to proper arrays).',
          original: '_.after(5, fn)',
          sugar: 'fn.after(5)',
          ref: 'Function/after'
        },
        {
          name: 'wrap',
          description: '_.wrap does not exist in Sugar.\nHowever, Function#bind can be used to achieve the same effect in a pinch.',
          original: "_.wrap(fn, function(fn){ return fn() + 3; })",
          sugar: "(function(fn){ return fn() + 3; }).bind(null, fn)",
          ref: 'Function/bind'
        },
        {
          name: 'compose',
          description: '_.compose does not exist in Sugar.\nHowever, Function#bind can help to achieve the same effect in a pinch.',
          original: "_.compose(fn1, fn2, *)",
          sugar: "Array.prototype.compose = function(){ var i = 0, fn; while(i < arguments.length){ fn = (function(){ return this.apply(this, arguments); }).bind(arguments[i]); i++;  } return fn; }\nfn1.compose(fn2)",
          ref: 'Function/bind'
        },
        {
          name: 'keys',
          description: '_.keys exists natively in modern browsing engines as Object.keys.\nSugar provides this method when it is not supported, and additionally allows a callback to be run against each key.\nSugar can also create extended objects which have this method available as an instance method.',
          original: '_.keys(obj)',
          sugar: 'Object.keys(obj)',
          ref: 'Object/keys'
        },
        {
          name: 'values',
          description: '_.values exists in Sugar as Object.values.\nSugar can also create extended objects which have this method available as an instance method.',
          original: '_.values(obj)',
          sugar: 'Object.values(obj)',
          ref: 'Object/values'
        },
        {
          name: 'functions',
          description: '_.functions does not exist in Sugar.\nHowever, Sugar makes it easy to reproduce the result.',
          original: '_.functions(obj)',
          sugar: 'Object.keys(obj).filter(function(key){ return Object.isFunction(obj[key]); })'
        },
        {
          name: 'extend',
          description: "_.extend exists in Sugar as Object.merge.\nIn the place of the ability to merge an unlimited number of objects,\nSugar instead includes a parameter to determine how property conflicts should be resolved.\nHowever, extended objects can chain for the same effect.",
          original: '_.extend(obj1, obj2, obj3)',
          sugar: 'Object.extended(obj1).merge(obj2).merge(obj3)',
          ref: 'Object/merge'
        },
        {
          name: 'defaults',
          description: "_.defaults can be achieved in Sugar by passing false as the last argument to Object.merge.\nThis will indicate that conflicts should preserve the target object's properties.",
          original: '_.defaults(obj, defaultProperties)',
          sugar: 'Object.merge(obj, defaultProperties, false)',
          ref: 'Object/merge'
        },
        {
          name: 'clone',
          description: '_.clone exists in Sugar as Object.clone.\nCloning is shallow by default but there is an option for deep cloning as well.',
          original: '_.clone(obj)',
          sugar: 'Object.clone(obj)',
          ref: 'Object/clone'
        },
        {
          name: 'tap',
          description: '_.tap exists in Sugar as Object.tap.\nThis method is mostly only useful when using extended objects or modifying the Object.prototype with Object.extend().',
          original: '_.tap(obj)',
          sugar: 'Object.tap(obj)',
          ref: 'Object/tap'
        },
        {
          name: 'isEqual',
          description: '_.isEqual exists in Sugar as Object.equal and is nearly identical,\nsave a couple minor points concerning primitive object equality (ie. new String("foo") is equal to "foo" in Sugar but not in Underscore, which is considered to be "egal").\nNote also that in its instance method form the naming changes to "equals" for better readability.',
          original: '_.isEqual(obj1, obj2)',
          sugar: 'Object.equal(obj1, obj2)',
          ref: 'Object/equal'
        },
        {
          name: 'isElement',
          description: "_.isElement does not exist in Sugar,\nas it has no direct association with the DOM. However this functionality can be easily replicated (taken from Underscore's own implementation).",
          original: '_.isElement(obj1)',
          sugar: 'Object.isElement = function(obj){ return !!(obj && obj.nodeType == 1); }'
        },
        {
          name: 'isArray',
          description: "_.isArray exists natively in modern browsing engines as Array.isArray.\nSugar provides this when it is not supported and also implements it as Object.isArray to maintain a parallel with other type checking methods.",
          original: '_.isArray(obj)',
          sugar: 'Array.isArray(obj)',
          ref: 'Array/isArray'
        },
        {
          name: 'isArguments',
          description: '_.isArguments does not exist in Sugar.\nA simple check of the "callee" parameter may be enough to simulate this (and is also cross-browser).\nNote that Sugar does have Array.create(), which will convert an arguments object into a standard array.',
          original: 'if(_.isArguments(obj))',
          sugar: 'if(obj.callee)'
        },
        {
          name: 'isFunction',
          description: '_.isFunction exists as Object.isFunction and is identical.',
          original: '_.isFunction(obj)',
          sugar: 'Object.isFunction(obj)',
          ref: 'Object/isFunction'
        },
        {
          name: 'isString',
          description: '_.isString exists as Object.isString and is identical.',
          original: '_.isString(obj)',
          sugar: 'Object.isString(obj)',
          ref: 'Object/isString'
        },
        {
          name: 'isNumber',
          description: '_.isNumber exists as Object.isNumber and is identical.',
          original: '_.isNumber(obj)',
          sugar: 'Object.isNumber(obj)',
          ref: 'Object/isNumber'
        },
        {
          name: 'isBoolean',
          description: '_.isBoolean exists as Object.isBoolean and is identical.',
          original: '_.isBoolean(obj)',
          sugar: 'Object.isBoolean(obj)',
          ref: 'Object/isBoolean'
        },
        {
          name: 'isDate',
          description: '_.isDate exists as Object.isDate and is identical.',
          original: '_.isDate(obj)',
          sugar: 'Object.isDate(obj)',
          ref: 'Object/isDate'
        },
        {
          name: 'isRegExp',
          description: '_.isRegExp exists as Object.isRegExp and is identical.',
          original: '_.isRegExp(obj)',
          sugar: 'Object.isRegExp(obj)',
          ref: 'Object/isRegExp'
        },
        {
          name: 'isNaN',
          description: '_.isNaN exists as Object.isNaN and is identical.',
          original: '_.isNaN(obj)',
          sugar: 'Object.isNaN(obj)',
          ref: 'Object/isNaN'
        },
        {
          name: 'isNull',
          description: '_.isNull does not exist in Sugar.\nJust use a straight equality comparison.',
          original: '_.isNull(obj)',
          sugar: 'obj === null'
        },
        {
          name: 'isUndefined',
          description: '_.isUndefined does not exist in Sugar.\nJust use a straight equality comparison.',
          original: '_.isUndefined(obj)',
          sugar: 'obj === undefined'
        },
        {
          name: 'times',
          description: '_.times exists in Sugar as Number#times and is identical.',
          original: '_.times(3, fn)',
          sugar: '(3).times(fn)',
          ref: 'Number/times'
        },
        {
          name: 'template',
          description: '_.template exists in Sugar as String#assign with slightly different syntax.\nAlthough it does not have the complex "eval" functionality of Underscore, it can be useful for quickly assigning a value inside a string. String#assign will also accept numbers for arguments passed.',
          original: "_.template('hello: <%= name %>')({ name: 'joe' })",
          sugar: "'hello: {name}'.assign({ name: 'joe' })",
          ref: 'String/assign'
        }
      ]
    }
  ];

  var urlMatch = /((?:https?|file):[^:]+(?::\d{4})?[^:]+):(\d+)(?::(\d+))?/;
  var warned = [];

  var warn = function(message, stackLevel, skipMeta, docs, logLevel) {
    var stack, files, match, file, line;
    if(SUGAR_ANALYZER_UNIQUE_MESSAGES && hasBeenWarned(message)) {
      return;
    }
    warned.push(message);
    stack = new Error().stack;
    message = message.replace(/\t/g, TS);
    if(stack) {
      files = stack.match(new RegExp(urlMatch.source, 'g'));
      file = files[stackLevel];
      if(!file || file.match(new RegExp('(' + baseExcludePackages.concat(SUGAR_ANALYZER_EXCLUDES).join('|') + ')[^\/]*\.js'))) {
        return;
      }
      match = file.match(urlMatch);
      if(!skipMeta) {
        message += '\n\n----------- File: ' + match[1] + ' ---------';
        if(match[2]) message += '\n----------- Line: ' + match[2] + ' --------------';
        if(match[3]) message += '\n----------- Char: ' + match[3] + ' --------------';
        if(docs){
          message += '\n----------- Docs: http://sugarjs.com/api/' + docs + ' ---------';
        }
      }
    }
    if(SUGAR_ANALYZER_FIRST_LINE_ONLY) {
      message = message.replace(/\n[\S\s]+$/gm, '');
    }
    console[logLevel || globalLogLevel](message);
  };


  var hasBeenWarned = function(message) {
    var length = warned.length, i = 0;
    while(i < length) {
      if(warned[i] === message) {
        return true;
      }
      i += 1;
    }
    return false;
  }

  var wrapAll = function(all) {
    for (var i = 0; i < all.length; i += 1) {
      wrapModule(all[i]);
    }
  }

  var wrapModule = function(module){
    var namespace = this;
    if(module.namespace) {
      if(!namespace[module.namespace]) {
        namespace[module.namespace] = function(){};
      }
      namespace = namespace[module.namespace];
    }
    if(namespace && module.type == 'instance') namespace = namespace.prototype;
    for (var i = 0; i < module.methods.length; i++) {
      wrapMethod(namespace, module.methods[i])
    }
  }

  var wrapMethod = function(namespace, method) {
    var fn = namespace[method.name] || function(){}, description = method.description;
    namespace[method.name] = function() {
      var level;
      if(!method.hasOwnProperty('conflict')) method.conflict = true;
      var result = method.conflict && method.conflict.apply ? method.conflict.apply(this, arguments) : method.conflict;
      var cond = result && result.length ? result[0] : result;
      if(!cond && typeof method.conflict != 'function' && SUGAR_ANALYZER_PROTOTYPE_NOTIFICATIONS) {
        level = 'info';
        cond = true;
      }
      if(cond) {
        description = supplant(method.description, result);
        if(method.original){
          description += '\n\n';
          description += '\n'+library+':    ' + method.original;
          description += '\nSugar:        ' + method.sugar;
          description += '\n';
        }
        warn(description, 2, false, method.ref, level);
      }
      return fn.apply(this, arguments);
    }
  };

  function supplant(str, obj) {
    var val;
    return  str.replace(/\{(.+?)\}/g, function(m, d) {
      val = obj[d];
      return val !== undefined ? jsonify(val) : m;
    });
  }

  function jsonify(o){
    if(typeof JSON != 'undefined') {
      return JSON.stringify(o);
    } else {
      return o.toString();
    }
  }

  function setDefault(name, defaultValue) {
    if(global[name] === undefined) {
      global[name] = defaultValue;
    }
  }


  var initialize = function() {
    var welcome = '### Welcome to the Sugar analyzer script! ###\n\n';
    if(typeof _ != 'undefined') {
      library = 'Underscore';
      globalLogLevel = 'info';
      wrapAll(UnderscoreMethods);
      welcome += "As your program calls various methods, it will show you the differences between Underscore and Sugar,\n" +
      'along with examples of the differing syntax and links to the Sugar docs.';
    } else {
      library = 'Prototype';
      globalLogLevel = 'warn';
      wrapAll(PrototypeMethods);
      welcome += "As your program calls various methods, it will warn you about Prototype's incompatibilities with Sugar, and give\n" +
      'suggestions about how to refactor. You can run this before refactoring to get a general idea about what needs to change\n' +
      'or you can flip out Prototype for Sugar, let breakages happen, and fix as you go!';
    }
    welcome += '\n\nAnalyzer options:\n\n' + 
    'SUGAR_ANALYZER_UNIQUE_MESSAGES         = true/false       |  Display each message only once (default is true)\n' +
    'SUGAR_ANALYZER_FIRST_LINE_ONLY         = true/false       |  Only display the first line of the message (default is false)\n' +
    "SUGAR_ANALYZER_EXCLUDES                = ['a', 'b', ...]  |  Array of filenames to exclude messages from (default is [], can be partial match, leave off .js at the end)\n";
    if(library == 'Prototype') {
      welcome += 'SUGAR_ANALYZER_PROTOTYPE_NOTIFICATIONS = true/false       |  Display messages even when methods are identical (default is true if Prototype lib is present)';
    }
    //welcome += '\n\n#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#';
    console.info(welcome + '\n\n\n');
    //console.info('-------------------------------------------------------------------------------------------------------------------');
  }

  var TS = '              ';
  var stackLevelOffset;
  var globalLogLevel;
  var library;
  var baseExcludePackages = ['prototype','underscore','analyzer'];

  setDefault('SUGAR_ANALYZER_FIRST_LINE_ONLY', false);
  setDefault('SUGAR_ANALYZER_PROTOTYPE_NOTIFICATIONS', typeof Prototype != 'undefined');
  setDefault('SUGAR_ANALYZER_UNIQUE_MESSAGES', true);
  setDefault('SUGAR_ANALYZER_EXCLUDES', []);

  initialize();

})(this);
