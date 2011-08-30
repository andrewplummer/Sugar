(function() {

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

  var PrototypeCollisions = [
    {
      module: 'window',
      instance_methods: [
        {
          name: '$A',
          message: '$A casts objects into arrays. It does not exist in Sugar, but Object#merge can achieve something similar:',
          recommend_before: "$A({ 0: 'a', 1: 'b', 2: 'c' })",
          recommend_after: "Object.merge([], { 0: 'a', 1: 'b', 2: 'c' })",
        },
        {
          name: '$H',
          message: '$H exists in Sugar as Object.extended.\nThis will return an extended object with instance methods on it similar to hashes in Prototype.\nKeep in mind, however, that the instance methods available to extended objects in Sugar do not 100% match those of Prototype.',
          recommend_before: "$H({ 0: 'a', 1: 'b', 2: 'c' })",
          recommend_after: "Object.extended({ 0: 'a', 1: 'b', 2: 'c' })",
        },
        {
          name: '$R',
          message: '$R (ObjectRanges) do not exist in Sugar.\nHowever, Number#upto or Number#downto achieve a very similar\neffect by creating arrays that contain that range:',
          recommend_before: "$R(0, 10)",
          recommend_after: "(0).upto(10)",
        },
        {
          name: '$w',
          message: '$w does not exist in Sugar.\nUse String#split instead:',
          recommend_before: "$w('apples and oranges')",
          recommend_after: "'apples and oranges'.split(' ')",
        }
      ]
    },
    {
      module: 'Number',
      instance_methods: [
        {
          name: 'succ',
          message: 'Number#succ does not exist in Sugar.\nThis is often done with the + operator :)',
          recommend_before: "num.succ()",
          recommend_after: "num + 1"
        },
        {
          name: 'times',
          condition: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          message: 'Number#times does not accept a second parameter, but found {1}.\nIf you need to bind context, use Function#bind instead:',
          recommend_before: "(8).times(function(){}, 'barf')",
          recommend_after: "(8).times(function(){}.bind('barf'))",
        },
        {
          name: 'toColorPart',
          message: 'Number#toColorPart does not exist in Sugar.\nUse Number#hex and pad to 2 places instead:',
          recommend_before: "(255).toColorPart()",
          recommend_after: "(255).hex(2)",
        },
        {
          name: 'toPaddedString',
          message: 'Number#toPaddedString exists in Sugar as Number#pad.\nNote that in Sugar, the radix is the third parameter, as the second is to force the sign.',
          recommend_before: "(20).toPaddedString(4, 2)",
          recommend_after: "(20).pad(4, false, 2)",
        }
      ]
        /***
         *
         * Number#abs exists and is identical
         * Number#ceil exists and will not break
         * Number#floor exists and will not break
         * Number#round exists and will not break
         *
         **/
    },
    {
      module: 'String',
      class_methods: [
        {
          name: 'interpret',
          message: 'String.interpret does not exist in Sugar.\nUse String() instead. Note, however that this will not convert\nnull/undefined into a blank string, as is the case with String.interpret.',
          recommend_before: "String.interpret(156)",
          recommend_after: "String(156)"
        }
      ],
      instance_methods: [
        {
          name: 'blank',
          message: 'String#blank exists in Sugar as String#isBlank:',
          recommend_before: "'hello'.blank()",
          recommend_after: "'hello'.isBlank()"
        },
        {
          name: 'camelize',
          condition: function() {
            return /[ _]/.test(this);
          },
          message: 'String#camelize found white space or underscores!\nNote that #camelize in Sugar will remove whitespace and operate on underscores the same as dashes.'
        },
        {
          name: 'dasherize',
          condition: function() {
            return /[A-Z\s]/.test(this);
          },
          message: 'String#dasherize found white space or capital letters!\nNote that #dasherize in Sugar will remove whitespace and operate on capital letters the same as underscores.'
        },
        {
          name: 'empty',
          message: 'String#empty does not exist in Sugar. Use a straight comparison instead.',
          recommend_before: "str.empty()",
          recommend_after: "str === ''",
        },
        {
          name: 'evalJSON',
          message: 'String#evalJSON does not exist in Sugar.\nJSON.parse may work as an alternative, but it is not available in all browsers.\nIf you absolutely require JSON support, consider adding in a separate library such as:\nhttps://github.com/douglascrockford/JSON-js',
          recommend_before: "str.evalJSON()",
          recommend_after: "JSON.parse(str)"
        },
        {
          name: 'evalScripts',
          message: "String#evalScripts does not exist in Sugar.\nIt's highly unlikely that you should be doing something like this anyway,\nbut if you really need to in a pinch, something like this may work:",
          recommend_before: "str.evalScripts()",
          recommend_after: "str.match(/<script.*?>.+?<\/script>/g).map(function(m){ return eval(m.replace(/<\/?script.*?>/g, '')); })",
        },
        {
          name: 'extractScripts',
          message: 'String#extractScripts does not exist in Sugar.\nIf you really need to do this, then in a pinch something like this may work:',
          recommend_before: "str.extractScripts()",
          recommend_after: "str.match(/<script.*?>.+?<\/script>/g).map(function(m){ return m.replace(/<\/?script.*?>/g, ''); })",
        },
        {
          name: 'gsub',
          message: 'String#gsub does not exist in Sugar.\nJust use the native .replace function instead.\nNote that Javascript allows functions to be passed to .replace just like gsub:',
          recommend_before: "'Image: (img.png)'.gsub(/Image: \(.+\)/, function(match, src){ return '<img src=\"' + src + '\" />'; })",
          recommend_after: "'Image: (img.png)'.replace(/Image: \(.+\)/, function(match, src){ return '<img src=\"' + src + '\" />'; })"
        },
        {
          name: 'include',
          message: 'String#include exists in Sugar as String#has:',
          recommend_before: "'foobar'.include('bar')",
          recommend_after: "'foobar'.has('bar')"
        },
        {
          name: 'inspect',
          message: 'String#inspect does not exist in Sugar. Consider using JSON.stringify(str) instead.\nThe JSON global does not exist in all implementations but should be enough to get you through a debug session:',
          recommend_before: "'foofa'.inspect()",
          recommend_after: "JSON.stringify('foofa')"
        },
        // TODO: ADD THIS??
        {
          name: 'interpolate',
          message: 'String#interpolate does not exist in Sugar.\nThis may be added in at a later date.\nFor now, String#replace can serve as a (primitive) alternative:',
          recommend_before: "'i like #{fruit}'.interpolate({ fruit: 'peaches' })",
          recommend_after: "'i like #{fruit}'.replace(/#{fruit}/, 'peaches')"
        },
        {
          name: 'isJSON',
          message: 'String#isJSON does not exist in Sugar.\nThe simplest way of determining if a value is JSON or not is to attempt parsing and catch errors.\nIf you absolutely require full JSON support, consider adding in a separate library such as:\nhttps://github.com/douglascrockford/JSON-js',
          recommend_before: "valid = str.isJSON()",
          recommend_after: "try { JSON.parse(str); valid = true; } catch(e){ valid = false; }"
        },
        {
          name: 'scan',
          message: 'String#scan exists in Sugar as String#each:',
          recommend_before: "'apple, pear & orange'.scan(/\w+/, console.log)",
          recommend_after: "'apple, pear & orange'.each(/\w+/, console.log)"
        },
        {
          name: 'strip',
          message: 'String#strip exists in Sugar as String#trim:',
          recommend_before: "'    howdy   '.strip()",
          recommend_after: "'    howdy   '.trim()"
        },
        {
          name: 'stripScripts',
          message: 'String#stripScripts can be achieved in Sugar with String#removeTags:',
          recommend_before: "'<script>doEvilStuff();</script>'.stripScripts()",
          recommend_after: "'<script>doEvilStuff();</script>'.removeTags('script')"
        },
        {
          name: 'stripTags',
          condition: function() {
            return arguments.length == 0 && /<.*?:.*?>/.test(this);
          },
          message: 'String#stripTags found namespaced tags such as <xsl:template>. Be aware that Sugar will strip these tags too!'
        },
        {
          name: 'sub',
          message: 'String#sub does not exist in Sugar.\nStandard Javascript .replace is the closest approximation.\nIf you need to replace more than one occurrence of a pattern (but not all), your best bet is to set a counter and test against it.',
          recommend_before: "'one two three four'.sub(' ', ', ', 2)",
          recommend_after: "var c = 0; 'one two three four'.replace(/\s/g, function(m, i){ c++; return c < 3 ? ', ' : ' '; })"
        },
        {
          name: 'succ',
          message: 'String#succ exists in Sugar as String#shift, which can move up or down the Unicode range by a number which is the first argument passed.',
          recommend_before: "'a'.succ()",
          recommend_after: "'a'.shift(1);"
        },
        {
          name: 'times',
          message: 'String#times exists in Sugar as String#repeat:',
          recommend_before: "'echo '.times(3)",
          recommend_after: "'echo '.repeat(3);"
        },
        {
          name: 'toArray',
          message: 'String#toArray splits a string into an array of characters.\nThe same effect can be achieved in Sugar by calling String#chars:',
          recommend_before: "'howdy'.toArray()",
          recommend_after: "'howdy'.chars();"
        },
        {
          name: 'toQueryParams',
          message: 'String#toQueryParams exists in Sugar as String#toObject.\nThis method allows two tokens to turn a string into a key/value hash.\nThe default tokens are exactly those for parsing out a URL string, so no parameters are required.',
          recommend_before: "'section=blog&id=45'.toQueryParams()",
          recommend_after: "'section=blog&id=45'.toObject()"
        },
        {
          name: 'truncate',
          message: 'String#truncate does not exist in Sugar.\nUse String#slice instead:',
          recommend_before: "longString.truncate(10, '...')",
          recommend_after: "longString.slice(0, 10) + '...'"
        },
        {
          name: 'underscore',
          condition: function() {
            return /\s/.test(this);
          },
          message: 'String#underscore found white space!\nNote that underscore in Sugar will remove all whitespace.'
        },
        {
          name: 'unfilterJSON',
          message: 'String#unfilterJSON does not exist in Sugar.'
        }
      ]
        /***
         *
         * String#capitalize exists and will not break
         * String#endsWith exists and will not break
         * String#escapeHTML exists and is identical
         * String#startsWith exists and will not break
         * String#unescapeHTML exists and is identical
         *
         **/
    },
    {
      module: 'Hash',
      instance_methods: [
        {
          name: 'each',
          condition: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          message: 'Second argument to .each should be a number but instead was {1}. If you need to bind context, use Function#bind instead:',
          recommend_before: "new Hash().each(function(){}, 'context')",
          recommend_after: "Object.extended().each(function(){}.bind('context'))",
        },
        {
          name: 'get',
          message: 'Sugar extended objects do not have a "get" method.\nSimply access the property as you would a normal object literal.',
          recommend_before: "var h = new Hash({ foo: 'bar' }); h.get('foo')",
          recommend_after: "var h = Object.extended({ foo: 'bar' }); h['foo']",
        },
        {
          name: 'index',
          message: 'Sugar extended objects do not have an "index" method.\nTo find a key in an extended object, you will have to iterate over it manually.',
          recommend_before: "var key = new Hash({ foo: 'bar' }).index('bar')",
          recommend_after: "Object.extended({ foo: 'bar' }).each(function(k, v){ if(v == 'bar') var key = k; })",
        },
        {
          name: 'inspect',
          message: 'Sugar extended objects do not have an "inspect" method.\nConsider using JSON.stringify() instead.\nThe JSON global does not exist in all implementations but should be enough to get you through a debug session:',
          recommend_before: "new Hash({ foo: 'bar' }).inspect()",
          recommend_after: "JSON.stringify(Object.extended({ foo: 'bar' }))"
        },
        {
          name: 'merge',
          message: 'Sugar extended have a "merge" method, however they merge the incoming object onto the original and modify it.\nIf you need to create a clone, use the "clone" method first.',
          recommend_before: "new Hash({ foo: 'bar' }).merge({ moo: 'car' })",
          recommend_after: "Object.extended({ foo: 'bar' }).clone().merge({ moo: 'car' })"
        },
        {
          name: 'set',
          message: 'Sugar extended objects do not have a "set" method.\nSimply set the property as you would a normal object literal.',
          recommend_before: "var h = new Hash({ foo: 'bar' }); h.set('moo', 'car')",
          recommend_after: "var h = Object.extended({ foo: 'bar' }); h['moo'] = 'car'",
        },
        {
          name: 'toJSON',
          message: 'Sugar extended objects do not have a "toJSON" method. \nJSON.stringify may work as an alternative, but it is not available in all browsers.\nIf you absolutely require JSON support, consider adding in a separate library such as:\nhttps://github.com/douglascrockford/JSON-js',
          recommend_before: "Object.toJSON(obj)",
          recommend_after: "JSON.stringify(obj)"
        },
        {
          name: 'toObject',
          message: 'Sugar extended objects do not have a "toObject" method, as they already behave like vanilla objects.'
        },
        {
          name: 'toTemplateReplacements',
          message: 'Sugar extended objects do not have a "toTemplateReplacements" method.\nThis method is not necessary as extended objects already behave like vanilla objects.'
        },
        {
          name: 'unset',
          message: 'Sugar extended objects do not have an "unset" method.\nSimply delete the property as you would a normal object literal.',
          recommend_before: "var h = new Hash({ foo: 'bar' }); h.unset('foo')",
          recommend_after: "var h = Object.extended({ foo: 'bar' }); delete h.foo",
        },
        {
          name: 'update',
          message: 'Sugar extended objects do not have an "update" method.\nAs this merges objects into the hash in place, simply use the "merge" method instead.',
          recommend_before: "new Hash({ foo: 'bar' }).merge({ moo: 'car' })",
          recommend_after: "Object.extended({ foo: 'bar' }).merge({ moo: 'car' })"
        },
        /***
         *
         * Hash#clone exists and is identical
         * Hash#keys exists and is identical
         * Hash#values exists and is identical
         *
         * Hash#toQueryString is for DOM
         *
         **/
      ]
    },
    {
      module: 'Object',
      class_methods: [
        {
          name: 'clone',
          condition: function(obj) {
            var deep = false;
            for(var key in obj){
              if(!obj.hasOwnProperty(key)) continue;
              if(typeof obj[key] == 'object'){
                deep = true;
              }
            }
            return deep;
          },
          message: 'Object.clone was called on a deep (nested) object. Be aware that Sugar will make DEEP copies of such objects. This is different from Prototype, which makes shallow copies. Additionally, Prototype will clone properties in the prototype chain which Sugar will not do.'
        },
        {
          name: 'extend',
          message: 'Object.extend does not exist in Sugar. Use Object.merge instead:',
          recommend_before: "Object.extend( { a: 1 }, { b: 2 })",
          recommend_after: "Object.merge( { a: 1 }, { b: 2 })",
        },
        {
          name: 'inspect',
          message: 'Object.inspect does not exist in Sugar. Consider using JSON.stringify(object) instead.\nThe JSON global does not exist in all implementations but should be enough to get you through a debug session:',
          recommend_before: "Object.inspect([1,2,3])",
          recommend_after: "JSON.stringify([1,2,3])"
        },
        {
          name: 'isHash',
          message: 'Object.isHash does not exist in Sugar. Use Object.isObject instead:',
          recommend_before: "Object.isHash({ a: 1 })",
          recommend_after: "Object.isObject({ a: 1 })"
        },
        {
          name: 'isUndefined',
          message: 'Object.isUndefined does not exist in Sugar. Use straight Javascript instead:',
          recommend_before: "Object.isUndefined(obj)",
          recommend_after: "obj === undefined"
        },
        {
          name: 'toJSON',
          message: 'Object.toJSON does not exist in Sugar.\nJSON.stringify may work as an alternative, but it is not available in all browsers.\nIf you absolutely require JSON support, consider adding in a separate library such as:\nhttps://github.com/douglascrockford/JSON-js',
          recommend_before: "Object.toJSON(obj)",
          recommend_after: "JSON.stringify(obj)"
        }
        /***
         *
         * Object.isArray exists and is identical
         * Object.isDate exists and is identical
         * Object.isFunction exists and is identical
         * Object.isNumber exists and is identical
         * Object.isString exists and is identical
         * Object.keys exists and is identical
         * Object.values exists and is identical
         *
         * Object.isElement is for DOM
         * Object.toHTML is for DOM
         * Object.toQueryString is for DOM
         *
         **/
      ]
    },
    {
      module: 'Array',
      class_methods: [
        {
          name: 'from',
          message: 'Array.from does not exist in Sugar. Object.merge can accomplish similar functionality:',
          recommend_before: "Array.from({ 0: 'a', 1: 'b', 2: 'c' })",
          recommend_after: "Object.merge([], { 0: 'a', 1: 'b', 2: 'c' })",
        }
      ],
      instance_methods: [
        {
          name: 'collect',
          message: 'Enumerable#collect does not exist in Sugar. Use Array#map instead:',
          recommend_before: "[1,2,3].collect(function(n){ return n * 2; })",
          recommend_after: "[1,2,3].map(function(n){ return n * 2; })",
        },
        {
          name: 'detect',
          message: 'Enumerable#detect does not exist in Sugar. Use Array#find instead:',
          recommend_before: "[1,2,3].detect(function(n){ return n > 1; })",
          recommend_after: "[1,2,3].find(function(n){ return n > 1; })",
        },
        {
          name: 'each',
          condition: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          message: 'Second argument to .each should be a number but instead was {1}. If you need to bind context, use Function#bind instead:',
          recommend_before: "['a','b','c'].each(function(){}, 'context')",
          recommend_after: "['a','b','c'].each(function(){}.bind('context'))",
          one_time_warning: 'Caution: If a callback passed to Array#each returns false, it will break out of the loop.'
        },
        {
          name: 'eachSlice',
          message: 'Enumerable#eachSlice does not exist in Sugar. Use Array#inGroupsOf instead:',
          recommend_before: "[1,2,3,4].eachSlice(2, function(){})",
          recommend_after: "[1,2,3,4].inGroupsOf(2).each(function(){})"
        },
        {
          name: 'entries',
          message: 'Enumerable#entries does not exist in Sugar. Use Array#clone instead:',
          recommend_before: "[1,2,3].entries()",
          recommend_after: "[1,2,3].clone()"
        },
        {
          name: 'find',
          condition: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          message: 'Second argument to Array#find should be a number but instead was {1}. If you need to bind context, use Function#bind instead:',
          recommend_before: "['a','b','c'].find(function(){}, 'context')",
          recommend_after: "['a','b','c'].find(function(){}.bind('context'))"
        },
        {
          name: 'findAll',
          condition: function() {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'number', arguments[1]];
          },
          message: 'Second argument to Array#findAll should be a number but instead was {1}. If you need to bind context, use Function#bind instead:',
          recommend_before: "['a','b','c'].findAll(function(){}, 'context')",
          recommend_after: "['a','b','c'].findAll(function(){}.bind('context'))"
        },
        {
          name: 'grep',
          message: 'Enumerable#grep does not exist in Sugar. Use Array#findAll instead:',
          recommend_before: "['a','b','c'].grep(/[ab]/)",
          recommend_after: "['a','b','c'].findAll(/[ab]/)"
        },
        {
          name: 'include',
          condition: function(f) {
            return typeof f !== 'object' && arguments.length == 1;
          },
          message: 'Enumerable#include in Protype detects if an element is in the array and returns true/false.\nIn Sugar this method instead adds the argument passed to the array without modifying it.\nArray#include is a reciprocal of Array#exclude, and a non-destructive version of Array#add.\nUse Array#has instead for equivalent functionality.',
          recommend_before: "[1,2,3].include(1)",
          recommend_after: "[1,2,3].has(1)"
        },
        {
          name: 'inject',
          message: 'Enumerable#inject does not exist in Sugar. Use Javascript native Array#reduce to achieve the same effect:',
          recommend_before: '[1,2,3,4].inject(100, function(a, b){ return a + b; });',
          recommend_after: '[1,2,3,4].reduce(function(a, b){ return a + b; }, 100);'
        },
        {
          name: 'invoke',
          message: 'Enumerable#invoke does not exist in Sugar. Use Array#map to achieve the same effect:',
          recommend_before: "['hello','world'].invoke('toUpperCase')",
          recommend_after: "['hello','world'].map('toUpperCase')"
        },
        {
          name: 'max',
          condition: function(f) {
            return arguments.length > 0;
          },
          message: 'Use caution when using Enumerable#max:\n\n(1) Sugar will return an array of maximum values (as there can be more than one), where Prototype only returns the first value.\n(2) When using iterators, Prototype will return the value compared, where Sugar will return the actual array element itself.\n(3) Finally, Sugar does not allow a context to be passed.',
          recommend_before: "[{ a: 5 },{ a: 10 }].max(function(el){ return el['a']; }, 'context')",
          recommend_after: "[{ a: 5 },{ a: 10 }].max(function(el){ return el['a']; }.bind('context')).first().a"
        },
        {
          name: 'member',
          message: 'Enumerable#member does not exist in Sugar. Use Array#has instead:',
          recommend_before: "[1,2,3].member(1)",
          recommend_after: "[1,2,3].has(1)"
        },
        {
          name: 'min',
          condition: function(f) {
            return arguments.length > 0;
          },
          message: 'Use caution when using Enumerable#min:\n\n(1) Sugar will return an array of minimum values (as there can be more than one), where Prototype only returns the first value.\n(2) When using iterators, Prototype will return the value compared, where Sugar will return the actual array element itself.\n(3) Finally, Sugar does not allow a context to be passed.',
          recommend_before: "[{ a: 5 },{ a: 10 }].min(function(el){ return el['a']; }, 'context')",
          recommend_after: "[{ a: 5 },{ a: 10 }].min(function(el){ return el['a']; }.bind('context')).first().a"
        },
        {
          name: 'partition',
          message: "Enumerable#partition does not exist in Sugar.\nArray#group however has similar functionality, and may be a suitable alternative.\nIt will create a hash with keys based on the return values of the iterator, with each grouping as the value.\nInstead of accessing the split array, you can access the hash by these keys.\nThis method has the added advantage that it can also split into more than two groups.",
          recommend_before: "[1,2,3,4,5,6].partition(function(n){ return n % 2 === 0; })",
          recommend_after: "[1,2,3,4,5,6].group(function(n){ return n % 2 === 0 ? 'even' : 'odd'; })"
        },
        {
          name: 'pluck',
          message: 'Enumerable#pluck does not exist in Sugar. Use Array#map instead:',
          recommend_before: "['hello','world'].pluck('length')",
          recommend_after: "['hello','world'].map('length')"
        },
        {
          name: 'reject',
          message: "Enumerable#reject does not exist in Sugar. Its equivalent is Array#exclude.\nThis is a non-destructive way to remove elements from an array.\nIf you want a destructive version, use Array#remove instead.\nAlso note these methods' reciprocals: Array#include and Array#add.",
          recommend_before: "[1,2,3].reject(function(n){ n < 3; })",
          recommend_after: "[1,2,3].exclude(function(n){ n < 3; })"
        },
        {
          name: 'select',
          message: 'Enumerable#select does not exist in Sugar. Use Array#findAll instead:',
          recommend_before: "[1,2,3].select(function(n){ n < 3; })",
          recommend_after: "[1,2,3].findAll(function(n){ n < 3; })"
        },
        {
          name: 'sortBy',
          condition: function(f, scope) {
            var type = typeof arguments[1];
            return [arguments.length > 1 && type != 'boolean', arguments[1]];
          },
          message: 'Second argument to .sortBy should be a boolean but instead was {1}. If you need to bind context, use Function#bind instead:',
          recommend_before: "[{ a: 5 },{ a: 10 }].sortBy(function(el){ return el['a']; })",
          recommend_after: "[{ a: 5 },{ a: 10 }].sortBy(function(el){ return el['a']; }.bind('context'))"
        },
        {
          name: 'size',
          message: 'Enumerable#size does not exist in Sugar. Just use array.length!',
          recommend_before: "[1,2,3].size()",
          recommend_after: "[1,2,3].length"
        },
        {
          name: 'toArray',
          message: 'Enumerable#toArray does not exist in Sugar. Use Array#clone instead:',
          recommend_before: "[1,2,3].toArray()",
          recommend_after: "[1,2,3].clone()"
        },
        {
          name: 'zip',
          message: 'Enumerable#zip does not exist in Sugar. Array#map can easily achieve the same functionality, however:',
          recommend_before: "firstNames.zip(lastNames)",
          recommend_after: "firstNames.map(function(name, index){ return [name, lastNames[index]]; })"
        },
        {
          name: 'compact',
          condition: function() {
            for(var i = 0; i < this.length; i++){
              if(isNaN(this[i])) return true;
            }
            return false;
          },
          message: 'Caution: Array#compact was called on an array that contains NaN values. Sugar will remove these from the array while Prototype leaves them alone:'
        },
        {
          name: 'clear',
          message: 'Array#clear does not exist in Sugar. Use array = [] instead:',
          recommend_before: "f.clear()",
          recommend_after: "f = []"
        },
        {
          name: 'inspect',
          message: 'Array#inspect does not exist in Sugar. Consider using JSON.stringify(array) instead.\nThe JSON global does not exist in all implementations but should be enough to get you through a debug session:',
          recommend_before: "[1,2,3].inspect()",
          recommend_after: "JSON.stringify([1,2,3])"
        },
        {
          name: 'reverse',
          condition: function(inline) {
            return inline === false;
          },
          message: 'Array#reverse exists in native Javascript, but is destructive. Try cloning the array first:',
          recommend_before: "array.reverse(false)",
          recommend_after: "array.clone().reverse()"
        },
        {
          name: 'uniq',
          message: 'Array#uniq exists in Sugar as Array#unique:',
          recommend_before: "[1,1,1].uniq()",
          recommend_after: "[1,1,1].unique()"
        },
        {
          name: 'without',
          message: 'Array#without exists in Sugar as Array#exclude:',
          recommend_before: "[1,2,3].without(3)",
          recommend_after: "[1,2,3].exclude(3)"
        }
        /***
         *
         * Enumerable#all exists and is identical
         * Enumerable#any exists and is identical
         * Enumerable#every exists and is identical
         * Enumerable#filter exists and is identical
         * Enumerable#inGroupsOf exists and is identical
         * Enumerable#inspect is the same as Array#inspect here
         * Enumerable#map exists and is identical
         * Enumerable#size is the same as Array#size here
         * Enumerable#some exists and is identical
         * Enumerable#toArray is the same as Array#toArray here
         *
         * Array#clone exists and is identical
         * Array#compact also removes NaN
         * Array#first exists and will work with no arguments
         * Array#flatten exists and is identical
         * Array#indexOf polyfill exists and is identical
         * Array#intersect exists and will work with 1 argument
         * Array#last exists and will work with no arguments
         * Array#lastIndexOf polyfill exists and is identical
         *
         **/
      ]
    },
    {
      module: 'Function',
      instance_methods: [
        {
          name: 'argumentNames',
          message: 'Function#argumentNames does not exist in Sugar.',

        },
        {
          name: 'bindAsEventListener',
          message: 'Function#bindAsEventListener does not exist in Sugar.\nIf this is a problem, it can be easily sidestepped.\nFirst, Function#bind will function identically as long as you are not currying arguments.\nIf you are currying arguments you will still receive the event, it will just be at the end of the argument array instead of the beginning.\nAs long as you keep this in mind you should be able to refactor to use .bind instead:',
          recommend_before: "var fn = function(event, one) {\n\t  // this will be \"bound\"\n\t  // event will be the event\n\t  // one will be 1\n\t}\n\tfn.bindAsEventListener('bound', 1)\n",
          recommend_after: "var fn = function(one, event) {\n\t  // this will be \"bound\"\n\t  // one will be 1\n\t  // event will be the event (comes last)\n\t}\n\tfn.bind('bound', 1)",
        },
        {
          name: 'curry',
          message: 'Function#curry does not exist in Sugar.\nSimply use Function#bind with null as the first argument:',
          recommend_before: "fn.curry('one','two')",
          recommend_after: "fn.bind(null, 'one', 'two')",
        },
        {
          name: 'defer',
          message: 'Function#defer exists in Sugar as Function#lazy.\nWhen no params are passed it will behave precisely the same as calling the function with a timeout of 1 ms.',
          recommend_before: "fn.defer()",
          recommend_after: "fn.lazy()"
        },
        {
          name: 'delay',
          message: 'Function#delay exists in Sugar, but is slightly different.\nFirst, the delay is passed in milliseconds, not seconds.\nSecond, delay will return a reference to the function instead of an integer to clear the timeout.\nIf you need to cancel the timeout, instead use Function#cancel.\nArguments passed after the timeout are still curried like Prototype.',
          recommend_before: "var t = fn.delay(2)\n\tclearTimeout(t)\n",
          recommend_after: "fn.delay(2000)\n\tfn.cancel()",
        },
        {
          // MIGHT want this... not sure...
          name: 'methodize',
          message: 'Function#methodize does not exist in Sugar.\nNo direct equivalent exists, but in a pinch the following code will achieve the same effect.\nIf this is an important method you use all the time,\nplease let me know via GitHub (https://github.com/andrewplummer/Sugar) and I will consider adding it.',
          recommend_before: "obj.method = fn.methodize()",
          recommend_after: "obj.method = function(){ fn.apply(null, [this].concat(Array.prototype.slice.call(arguments))); }"
        },
        {
          // MIGHT want this... not sure...
          name: 'wrap',
          message: 'Function#wrap does not exist in Sugar.\nNo direct equivalent exists, but in a pinch the following code will achieve the same effect.\nIf this is an important method you use all the time,\nplease let me know via GitHub (https://github.com/andrewplummer/Sugar) and I will consider adding it.',
          recommend_before: "fn = fn.wrap(function(original){ // do some stuff })",
          recommend_after: "fn = (function(o){ return function(original){ // do some stuff }.bind(null, o); })(fn)"
        }
      ]
        /***
         *
         * Function#bind exists and is identical
         *
         * */
    }
  ];
        /***
         *
         * Date#toISOString exists and is identical
         * Date#toJSON exists and is identical
         *
         * */

  var TS = '              ';

  var warn = function(message, level, skipMeta, docs) {
    var stack, match, file, line;
    stack = new Error().stack;
    message = message.replace(/\t/g, TS);
    if(stack) {
      match = stack.split('\n')[level].match(/@(.+):(\d+)$/);
      file = match[1];
      if(file.match(/prototype[^/]+$/)) {
        // Assumed to be internally called method, so don't display warnings in this case.
        return;
      }
      line = match[2];
      if(!skipMeta) {
        message += '\n\n----------- File: ' + file + ' ---------\n----------- Line: ' + line + ' --------------';
        if(docs){
          message += '\n----------- Docs: ' + docs + ' ---------';
        }
      }
    }
    console.warn(message);
  };



  var wrapMethods = function(collisions) {
    for (var i = 0; i < collisions.length; i += 1) {
      wrapModule(collisions[i].module, collisions[i]['class_methods']);
      wrapModule(collisions[i].module, collisions[i]['instance_methods'], true);
    }
  }

  var wrapModule = function(name, methods, instance){
    if(!methods) return;
    for (var i = 0; i < methods.length; i++) {
      wrapMethod(name, methods[i], instance);
    }
  }

  var wrapMethod = function(module, collision, instance) {
    var m;
    if(module == 'window') {
      m = window;
    } else {
      m = instance ? window[module].prototype : window[module];
    }
    var fn = m[collision.name], message = collision.message;
    m[collision.name] = function() {
      var r = collision.condition ? collision.condition.apply(this, arguments) : true;
      if(message && (r === true || (r.length && r[0] === true))) {
        message = supplant(message, r);
        if(collision.recommend_before){
          //message += '\n\nSugar equivalent...\n';
          message += '\n\n';
          message += '\nPrototype:    ' + collision.recommend_before;
          message += '\nSugar:        ' + collision.recommend_after;
          message += '\n';
        }
        var ref = 'http://sugarjs.com/api/#!/' + module + '#' + (collision.alternate || collision.name);
        warn(message, 3, false, ref);
      }
      if(collision.one_time_warning && !collision.warned) {
        warn(collision.one_time_warning, 3, false);
        collision.warned = true;
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



  var initialize = function() {
    var welcome =
    '### Welcome to the Sugar analyzer script! ###\n\n' +
    'As your program calls various methods, it will warn you about incompatibilities with Sugar, and give suggestions\n' +
    'about how to refactor. You can run this before refactoring to get a general idea about what needs to change,\n' +
    'or you can flip out Prototype for Sugar, let breakages happen, and fix as you go!\n\n';
    console.info(welcome);
    if(typeof Prototype != 'undefined') {
      wrapMethods(PrototypeCollisions);
    } else if(typeof Mootools != 'undefined') {
      wrapMethods(MootoolsCollisions);
    }
  }

  initialize();


})();
