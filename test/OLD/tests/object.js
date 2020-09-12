namespace('Object', function () {
  'use strict';

  group('Chainable', function() {
    equal(new Sugar.Object({foo:'bar'}).raw, {foo:'bar'}, 'argument should be converted to object');
    equal(typeof new Sugar.Object('foo').raw, 'string', 'primitive should not be coerced into object');
    equal(new Sugar.Object({foo:'bar',boo:'mar'}).keys().raw, ['foo','boo'], 'should have keys as instance');
  });

  group('Static Extended', function() {

    if (!isExtendedMode()) {
      // Testing basic instance methods have been
      // mapped over as static, but only in extended mode.
      return;
    };

    // Just test a few basic methods to ensure they've been mapped.
    equal(Object.get({foo:'bar'}, 'foo'), 'bar', 'Object.get was extended');
    equal(Object.isArray(['a']), true, 'Object.isArray was extended');
    equal(Object.fromQueryString('a=b'), {a:'b'}, 'Object.fromQueryString was extended');
    equal(Object.toQueryString({c:'d'}), 'c=d', 'Object.toQueryString was extended');
  });

  method('fromQueryString', function() {

    test(Object, ['foo=bar&moo=car'], {foo:'bar',moo:'car'}, 'basic');
    test(Object, ['foo=bar&moo=3'], {foo:'bar',moo:3}, 'with numbers | auto');
    test(Object, ['foo=bar&moo=3', {auto:false}], {foo:'bar',moo:'3'}, 'with numbers');

    test(Object, ['foo=bar&moo=true'], {foo:'bar',moo:true}, 'with true | auto');
    test(Object, ['foo=bar&moo=false'], {foo:'bar',moo:false}, 'with false | auto');
    test(Object, ['foo=bar&moo=true', {auto:false}], {foo:'bar',moo:'true'}, 'with true not | auto');
    test(Object, ['foo=bar&moo=false', {auto:false}], {foo:'bar',moo:'false'}, 'with false not | auto');

    test(Object, ['foo=bar3'], {foo:'bar3'}, 'number in back');
    test(Object, ['foo=3bar'], {foo:'3bar'}, 'number up front');

    test(Object, ['foo=345'], {foo:345}, 'numbers only | auto');
    test(Object, ['foo&bar'], {foo:null,bar:null}, 'undefined without = | auto');
    test(Object, ['foo&bar', {auto:false}], {foo:'',bar:''}, 'undefined without = | not auto');
    test(Object, ['foo=&bar='], {foo:null,bar:null}, 'undefined params | auto');
    test(Object, ['foo=&bar=', {auto:false}], {foo:'',bar:''}, 'undefined params | not auto');
    test(Object, ['foo[]=bar&foo[]=car'], {'foo[]':['bar','car']}, 'deep strings with default');
    test(Object, ['foo[]=bar&foo[]=car',{auto:false}], {'foo[]':'car'}, 'deep strings with default | not auto');

    test(Object, ['foo[]=bar&foo[]=car', {deep:true}], {'foo':['bar','car']}, 'deep strings with deep');
    test(Object, ['foo[bar]=tee&foo[car]=hee', {deep:true}], { foo: { bar: 'tee', car: 'hee' } }, 'handles keys');

    test(Object, ['foo[cap][map]=3', {deep:true}], {foo:{cap:{map:3}}}, 'deep keys');
    test(Object, ['foo[cap][map][]=3', {deep:true}], {foo:{cap:{map:[3]}}}, 'nested with trailing array');
    test(Object, ['foo[moo]=1&bar[far]=2', {deep:true}], {foo:{moo:1},bar:{far:2}}, 'sister objects');

    test(Object, ['foo[cap][map]=3', {deep:true,auto:false}], {foo:{cap:{map:'3'}}}, 'deep keys not auto');
    test(Object, ['foo[cap][map][]=3', {deep:true,auto:false}], {foo:{cap:{map:['3']}}}, 'nested with trailing array not auto');
    test(Object, ['foo[moo]=1&bar[far]=2', {deep:true,auto:false}], {foo:{moo:'1'},bar:{far:'2'}}, 'sister objects not auto');

    test(Object, ['f[]=a&f[]=b&f[]=c&f[]=d&f[]=e&f[]=f',{deep:true}], { f: ['a','b','c','d','e','f'] }, 'large array');
    test(Object, ['foo[][]=a&foo[][]=b',{deep:true}], {foo:[['a'],['b']]}, 'nested arrays separate');
    test(Object, ['foo[][]=3&foo[][]=4',{deep:true}], {foo:[[3],[4]]}, 'nested arrays together');
    test(Object, ['foo[][]=3&foo[][]=4',{deep:true,auto:false}], {foo:[['3'],['4']]}, 'nested arrays together not auto');

    var qs = 'foo[cap][map]=true&foo[cap][pap]=false';
    test(Object, [qs,{deep:true}], {foo:{cap:{map:true,pap:false}}}, 'nested boolean not auto');
    test(Object, [qs,{deep:true,auto:false}], {foo:{cap:{ map:'true',pap:'false'}}}, 'nested boolean auto');

    test(Object, ['foo[3]=hardy&foo[10]=har har', {deep:true}], {foo:{3:'hardy',10:'har har'}}, 'array keys will construct object');

    test(Object, ['text=What%20is%20going%20on%20here%3f%3f&url=http://animalsbeingdicks.com/page/2'], { text: 'What is going on here??', url: 'http://animalsbeingdicks.com/page/2' }, 'handles partially escaped params');
    test(Object, ['text=What%20is%20going%20on%20here%3f%3f&url=http%3A%2F%2Fanimalsbeingdicks.com%2Fpage%2F2'], { text: 'What is going on here??', url: 'http://animalsbeingdicks.com/page/2' }, 'handles fully escaped params');
    test(Object, ['foo%3Dbar=car'], {'foo=bar':'car'}, 'handles = in encoded keys');
    test(Object, ['foo%2Cbar=car'], {'foo,bar':'car'}, 'handles , in encoded keys');
    test(Object, ['foo=bar%3Dcar'], {'foo':'bar=car'}, 'handles = in encoded values');
    test(Object, ['foo=bar%2Ccar'], {'foo':'bar,car'}, 'handles , in encoded values');

    test(Object, ['url=http%3A%2F%2Fwww.site.com%2Fslug%3Fin%3D%2Fuser%2Fjoeyblake'], { url: 'http://www.site.com/slug?in=/user/joeyblake' }, 'equal must be escaped as well');

    test(Object, ['http://fake.com?foo=bar'], { foo: 'bar' }, 'handles whole URLs');
    test(Object, {}, 'will not die if no arguments');

    if (typeof window !== 'undefined') {
      equal(typeof run(Object, 'fromQueryString', [window.location]), 'object', 'can handle just window.location');
    }

    // Automatic casting

    test(Object, ['foo=3.14156'], { foo: 3.14156 }, 'float values');
    test(Object, ['foo=3.14156', {auto:false}], { foo: '3.14156' }, 'float values not automatic');
    test(Object, ['foo=127.0.0.1'], { foo: '127.0.0.1' }, 'IP addresses not treated as numbers');
    test(Object, ['zip=00165'], { zip: 165 }, 'zipcodes are treated as numbers if auto');
    test(Object, ['zip=00165',{auto:false}], { zip: '00165' }, 'zipcodes are not treated as numbers if not auto');
    test(Object, ['foo[=bar'], { 'foo[': 'bar' }, 'opening bracket does not trigger deep parameters');

    test(Object, ['foo='],        { foo: null },   'auto | null');
    test(Object, ['foo=0'],       { foo:   0 },    'auto | zero');
    test(Object, ['foo=-0'],      { foo:  -0 },    'auto | negative zero');
    test(Object, ['foo=.5'],      { foo:  .5 },    'auto | .5');
    test(Object, ['foo=0.5'],     { foo:  .5 },    'auto | 0.5');
    test(Object, ['foo=0.00'],    { foo: 0 },      'auto | 0.00');
    test(Object, ['foo=1'],       { foo: 1 },      'auto | 1');
    test(Object, ['foo=-1'],      { foo:-1 },      'auto | -1');
    test(Object, ['foo=-0.5'],    { foo: -.5 },    'auto | -0.5');
    test(Object, ['foo=-.5'],     { foo: -.5 },    'auto | -.5');
    test(Object, ['foo=-.0025'],  { foo: -.0025 }, 'auto | -.0025');
    test(Object, ['foo=-0.0025'], { foo: -.0025 }, 'auto | -0.0025');
    test(Object, ['foo=.0025'],   { foo:  .0025 }, 'auto | .0025');
    test(Object, ['foo=0.0025'],  { foo:  .0025 }, 'auto | 0.0025');

    test(Object, ['foo=0x89'],    { foo: '0x89' },     'auto | should not cast 0x89');
    test(Object, ['foo=1e25'],    { foo: '1e25' },     'auto | should not cast 1e25');
    test(Object, ['foo=#fff'],    { foo: '#fff' },     'auto | should not cast #fff');
    test(Object, ['foo=1.2.3'],   { foo: '1.2.3'},     'auto | should not cast 1.2.3');
    test(Object, ['foo=Infinity'],{ foo: 'Infinity' }, 'auto | should not cast Infinity');
    test(Object, ['foo=99,999'],  { foo: '99,999' },   'auto | should not cast numbers with commas');
    test(Object, ['foo=24px'],    { foo: '24px' },     'auto | should not cast 24px');
    test(Object, ['foo=5-'],      { foo: '5-' },       'auto | should not cast 5-');


    test(Object, ['foo=bar&foo=car'], {'foo':['bar','car']}, 'two keys detected by auto');
    test(Object, ['foo=bar&foo=car&foo=moo'], {'foo':['bar','car','moo']}, 'three keys detected by auto');
    test(Object, ['foo=bar&foo=car', {deep:true}], {'foo':['bar','car']}, 'two keys detected by auto');
    test(Object, ['foo=bar&foo=car&foo=moo', {deep:true}], {'foo':['bar','car','moo']}, 'three keys detected by auto');


    // Separators

    test(Object, ['user_name=Harry'], {'user_name':'Harry'}, 'without separator');
    test(Object, ['user_name=Harry', {separator:'_'}], {'user':{name:'Harry'}}, 'with separator');
    test(Object, ['user_name_first=Harry', {separator:'_'}], {'user':{name:{first:'Harry'}}}, 'with separator deeper');

    test(Object, ['user|name=Harry'], {'user|name':'Harry'}, 'without separator | pipe');
    test(Object, ['user|name=Harry', {separator:'|'}], {'user':{name:'Harry'}}, 'with separator | pipe');
    test(Object, ['user|name|first=Harry', {separator:'|'}], {'user':{name:{first:'Harry'}}}, 'with separator deeper | pipe');


    // Cast function

    var toFoo = function() { return 'foo'; }
    test(Object, ['foo=bar',    {transform:toFoo}], {foo:'foo'}, 'transform foo');
    test(Object, ['foo=3',      {transform:toFoo}], {foo:'foo'}, 'transform foo before auto conversion');
    test(Object, ['foo=true',   {transform:toFoo}], {foo:'foo'}, 'transform foo before boolean conversion');
    test(Object, ['foo[]=true', {transform:toFoo}], {'foo[]':'foo'}, 'transform foo on brackets');

    var toEmpty = function() { return ''; }
    test(Object, ['foo=bar', {transform:toEmpty}], {foo:''}, 'transform empty string');


    var count = 0;
    var testTransformArguments = function(val, key, obj, str) {
      equal(val, 'bar', 'first argument should be the value');
      equal(key, 'foo', 'second argument should be the key');
      count++;
    }
    run(Object, 'fromQueryString', ['foo=bar', {transform:testTransformArguments}]);
    equal(count, 1, 'should have run once');

    var count = 0;
    var expectedKeys = ['foo[name]', 'moo[]'];
    var expectedValues = ['bar', 'beer'];
    var capturedObj;
    var testTransformArgumentsDeep = function(val, key, obj) {
      equal(key, expectedKeys[count], 'first argument');
      equal(val, expectedValues[count], 'second argument');
      capturedObj = obj;
      count++;
    }
    var result = run(Object, 'fromQueryString', ['foo[name]=bar&moo[]=beer', {transform:testTransformArgumentsDeep}]);

    equal(capturedObj, result, 'third argument should be equal to the result');
    equal(count, 2, 'should have run twice');

    var onlyUserName = function(val, key) {
      if (key === 'user_name') {
        return 'Harry';
      }
    }
    test(Object, ['user_name=moo&user_id=12345', {transform:onlyUserName}], {user_name:'Harry',user_id:12345}, 'only user name');

    var numeralToBoolean = function(val) {
      if (val === '1' || val === '0') {
        return !!+val;
      }
    }
    var subject = 'user[profile][agreed]=1&user[address][street]=12345%20Foo%20St.&user[profile][friends][]=Mary&user[profile][friends][]=Jerry&user[profile][paid]=0';
    var expected = {
      user: {
        profile: {
          paid: false,
          agreed: true,
          friends: ['Mary', 'Jerry']
        },
        address: {
          street: '12345 Foo St.'
        }
      }
    }
    test(Object, [subject, {deep:true,transform:numeralToBoolean}], expected, 'complex object with numeral cast to boolean');


    var toArray = function(val, key, obj) {
      if (key === 'foo' && !obj[key]) {
        return [val];
      }
    }
    test(Object, ['foo=bar', {transform:toArray}], {'foo':['bar']}, 'single can still be converted to array with cast function');

  });

  method('values', function() {

    test({foo:'bar'}, ['bar'], 'Values should be received');

    var called = false;
    var fn = function(val, o) {
      equal(val, 'bar', 'First argument should be value');
      equal(o, obj, 'Second argument should be the object');
      called = true;
    }

    // Issue #525
    var result = [{foo:'foo'},{bar:'bar'}].map(Sugar.Object.values);
    equal(result, [['foo'],['bar']], 'non-function argument should not be called');

  });

  method('invert', function() {

    test({foo:'bar'}, [], {bar:'foo'}, 'basic invert');
    test({foo:{bar:'baz'}}, [], {'[object Object]':'foo'}, 'deep objects are simply stringified');
    test({foo:['bar','baz']}, [], {'bar,baz':'foo'}, 'arrays are stringified');
    test({foo:1,bar:1}, [], {1:'bar'}, 'collisions are overwritten by default');
    test({length:15}, [], {15:'length'}, 'works with "length"');
    test({foo:1,bar:1}, [true], {1:['foo','bar']}, 'collisions allow multi with flag');

    var result = [{a:1},{b:2},{c:3}].map(Sugar.Object.invert);
    equal(result, [{1:'a'},{2:'b'},{3:'c'}], 'can be iterated with map');

  });

  method('isObject', function() {
    var Person = function() {};
    var p = new Person();

    test({}, true, '{}');
    test(new Object({}), true, 'new Object()');
    test([], false, '[]');
    test(new Sugar.Object(), false, 'chainable');
    test(new Array(1,2,3), false, 'new Array(1,2,3)');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test(p, false, 'instance');

    function Foo() {}
    Foo.prototype = { foo: 3 };
    test(new Foo, false, 'Object with inherited properties');

    if (Object.create) {
      test(Object.create(null), true, 'Object with null prototype');
    }

    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isArray', function() {
    test({}, false, '{}');
    test([], true, '[]');
    test(new Array(1,2,3), true, 'new Array(1,2,3)');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isBoolean', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(false, true, 'false');
    test(true, true, 'true');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isDate', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), true, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isFunction', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, true, 'function() {}');
    test(new Function(), true, 'new Function()');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });


  method('isNumber', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(new Function(), false, 'new Function()');
    test(1, true, '1');
    test(0, true, '0');
    test(-1, true, '-1');
    test(new Number('3'), true, 'new Number("3")');
    test('wasabi', false, '"wasabi"');
    test(NaN, true, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isString', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(new Function(), false, 'new Function()');
    test(1, false, '1');
    test('wasabi', true, '"wasabi"');
    test(new String('wasabi'), true, 'new String("wasabi")');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isRegExp', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), true, 'new RegExp()');
    test(/afda/, true, '/afda/');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(new Function(), false, 'new Function()');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isArguments', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new Array(1,2,3), false, 'new Array(1,2,3)');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test((function(){ return arguments; })(), true, 'arguments object with 0 length');
    test((function(){ return arguments; })(1,2,3), true, 'arguments object with 3 length');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isError', function() {
    test(new Error(),          true, 'Error');
    test(new TypeError(),      true, 'TypeError');
    test(new RangeError(),     true, 'RangeError');
    test(new EvalError(),      true, 'EvalError');
    test(new URIError(),       true, 'URIError');
    test(new SyntaxError(),    true, 'SyntaxError');
    test(new ReferenceError(), true, 'ReferenceError');
    test('Error!', false, 'Error!');
  });

  method('isSet', function() {
    if (typeof Set === 'undefined') return;
    test(new Set(), true, '{}');
    test(new Set(['1','2','3']), true, '{1,2,3}');
    test([], false, 'Array');
    test({}, false, 'Object');
  });

  method('isMap', function() {
    if (typeof Map === 'undefined') return;
    test(new Map(), true, '{}');
    test([], false, 'Array');
    test({}, false, 'Object');
  });

  method('mergeAll', function() {

    var obj1 = {a:'a'};
    var obj2 = {b:'b'};
    var obj3 = {c:'c'};

    var target = {};
    var result = run(target, 'mergeAll', [[obj1, obj2, obj3]]);
    equal(target, {a:'a',b:'b',c:'c'}, 'All objects should be merged into the result');
    equal(obj1, {a:'a'}, 'object 1 should be unchanged');
    equal(obj2, {b:'b'}, 'object 2 should be unchanged');
    equal(obj3, {c:'c'}, 'object 3 should be unchanged');
    equal(result === target, true, 'Returned result should be equal to the target object');

    test({foo:undefined,bar:undefined}, [[{bar:3},{foo:1}]], {foo:1,bar:3}, 'overwrites undefined');
    test({foo:3}, [[{foo:4},{foo:5}]], {foo:5}, 'last wins');
    test({foo:3}, [[{foo:4},{bar:5}],{resolve:false}], {foo:3,bar:5}, 'used as defaults');

    var result = run({}, 'mergeAll', [[{one:obj1}],{deep:true}]);
    equal(result, {one:{a:'a'}}, true, 'object was merged');
    equal(result.one === obj1, false, 'object was deep merged');

    var fn = function(key, a, b) { return a + b; };
    test({a:1}, [[{a:2},{a:5},{a:8}],{resolve:fn}], {a:16}, 'custom resolver works on all merged objects');

    test({name:'Anonymous'}, [{name:'Frank'}], {name:'Frank'}, 'passing a single object should still work');

    if (testDefinePropertySupport) {
      var obj1 = testGetAccessorObject('one');
      var obj2 = testGetAccessorObject('two');
      var result = run({}, 'mergeAll',  [[obj1, obj2], {descriptor:true}]);
      result.data.one = 'hoo';
      result.data.two = 'ha';
      equal(result.one + result.two, 'hooha', 'both descriptors were merged');

      var fn = function(key, a, b) { return (a || '') + b; };
      var obj1 = testGetDescriptorObject();
      var obj2 = testGetDescriptorObject();
      var obj3 = testGetDescriptorObject();
      test({}, [[obj1, obj2, obj3],{hidden:true,resolve:fn}],{foo:'barbarbar'}, 'can handle hidden properties');
    }

  });

  method('add', function() {

    var obj = {foo:'foo'};
    var result = run(obj, 'add', [{bar:'bar'}]);
    equal(result, {foo:'foo',bar:'bar'}, 'Objects added together');
    equal(obj, {foo:'foo'}, 'Original object is unchanged');

    // Basic no-conflict merging

    test({a:'a'}, [{b:'b'}], {a:'a',b:'b'}, 'string');
    test({a:'a'}, [{b:8}], {a:'a',b:8}, 'number');
    test({a:'a'}, [{b:true}], {a:'a',b:true}, 'boolean');
    test({a:'a'}, [{b:null}], {a:'a',b:null}, 'null');
    test({a:'a'}, [{b:undefined}], {a:'a'}, 'undefined will not merge');
    test({a:'a'}, [{b:NaN}], {a:'a',b:NaN}, 'NaN');
    test({a:'a'}, [{b:Infinity}], {a:'a',b:Infinity}, 'NaN');

    test({a:'a'}, [{b:[1]}], {a:'a',b:[1]}, 'array');
    test({a:'a'}, [{b:{c:'c'}}], {a:'a',b:{c:'c'}}, 'object');

    test({a:'a'}, ['aha'], {a:'a',0:'a',1:'h',2:'a'}, 'string has enumerated properties');
    test({a:'a'}, [undefined], {a:'a'}, 'undefined has no properties');
    test({a:'a'}, [NaN], {a:'a'}, 'undefined has no properties');
    test({a:'a'}, [null], {a:'a'}, 'null has no properties');
    test({a:'a'}, [8], {a:'a'}, 'number has no properties');
    test({}, [{}], {}, 'empty object has no properties');

    // Merging with conflicts

    test({a:'a'}, [{a:'b'}], {a:'b'}, 'source should win by default');
    test({a:'a'}, [{a:null}], {a:null}, 'null wins');
    test({a:'a'}, [{a:false}], {a:false}, 'false wins');
    test({a:'a'}, [{a:''}], {a:''}, 'empty string wins');
    test({a:'a'}, [{a:[1]}], {a:[1]}, 'array wins');
    test({a:'a'}, [{a:{b:'b'}}], {a:{b:'b'}}, 'object wins');
    test({a:'a'}, [{a:undefined}], {a:'a'}, 'undefined does not win');

    test({a:[1]}, [{a:[2]}], {a:[2]}, 'deep source array wins');
    test({a:{b:'b'}}, [{a:{c:'c'}}], {a:{c:'c'}}, 'deep source object wins');

    test({a:undefined}, [{a:1}], {a:1}, 'target undefined, source wins');
    test({a:null}, [{a:1}], {a:1}, 'target null, source wins');
    test({a:false}, [{a:1}], {a:1}, 'target false, source wins');
    test({a:true}, [{a:1}], {a:1}, 'target true, source wins');
    test({a:''}, [{a:1}], {a:1}, 'target empty string, source wins');

    // Shallow merge, source wins

    var opts = { resolve: false };
    test({a:'a'}, [{a:'b'}, opts], {a:'a'}, 'target wins when resolve is false');
    test({a:undefined}, [{a:1}, opts], {a:1}, 'source wins when target is undefined');
    test({a:null}, [{a:1}, opts], {a:null}, 'target wins when null');
    test({a:false}, [{a:1}, opts], {a:false}, 'target wins when false');
    test({a:true}, [{a:1}, opts], {a:true}, 'target wins when true');
    test({a:''}, [{a:1}, opts], {a:''}, 'target wins when empty string');

    // Deep merge, target wins

    var opts = { deep: true };
    test({a:{b:'b'}}, [{a:{c:'c'}}, opts], {a:{b:'b',c:'c'}}, 'deeply merged');
    test({a:[1,2]}, [{a:['a']}, opts], {a:['a',2]}, 'array deeply merged');
    test([{a:'a'}], [[{b:'b'}], opts], [{a:'a',b:'b'}], 'objects in arrays deeply merged');

    // Deferring more specific tests to Object.merge

  });

  method('addAll', function() {

    var obj1 = {a:'a'};
    var obj2 = {b:'b'};
    var obj3 = {c:'c'};

    var target = {};
    var result = run(obj1, 'addAll', [[obj2, obj3]]);
    equal(result, {a:'a',b:'b',c:'c'}, 'Result should have all properties added');
    equal(result === obj1, false, 'Result should not be the same reference as target');
    equal(obj1, {a:'a'}, 'Target should be untouched');
    equal(obj2, {b:'b'}, 'First source should be untouched');
    equal(obj3, {c:'c'}, 'Second source should be untouched');

    test({foo:undefined,bar:undefined}, [[{bar:3},{foo:1}]], {foo:1,bar:3}, 'overwrites undefined');
    test({foo:3}, [[{foo:4},{foo:5}]], {foo:5}, 'last wins');
    test({foo:3}, [[{foo:4},{bar:5}],{resolve:false}], {foo:3,bar:5}, 'used as defaults');

    var result = run({}, 'addAll', [[{one:obj1}],{deep:true}]);
    equal(result, {one:{a:'a'}}, true, 'object was added');
    equal(result.one === obj1, false, 'object was deep added');

    var fn = function(key, a, b) { return a + b; };
    test({a:1}, [[{a:2},{a:5},{a:8}],{resolve:fn}], {a:16}, 'custom resolver works on all added objects');

    test({name:'Anonymous'}, [{name:'Frank'}], {name:'Frank'}, 'passing a single object should still work');

    if (testDefinePropertySupport) {
      var obj1 = testGetAccessorObject('one');
      var obj2 = testGetAccessorObject('two');
      var result = run({}, 'addAll',  [[obj1, obj2], {descriptor:true}]);
      result.data.one = 'hoo';
      result.data.two = 'ha';
      equal(result.one + result.two, 'hooha', 'both descriptors were added');

      var fn = function(key, a, b) { return (a || '') + b; };
      var obj1 = testGetDescriptorObject();
      var obj2 = testGetDescriptorObject();
      var obj3 = testGetDescriptorObject();
      test({}, [[obj1, obj2, obj3],{hidden:true,resolve:fn}],{foo:'barbarbar'}, 'can handle hidden properties');
    }

  });

  method('defaults', function() {

    function add(key, a, b) {
      return a + b;
    }

    test({id:999}, [{views:0}], {id:999,views:0}, 'simple defaults');
    test({id:999}, [{id:123}], {id:999}, 'does not overwrite');
    test({id:999}, [{id:123,views:0}], {id:999,views:0}, 'multiple properties single object');
    test({id:999}, [[{id:123},{views:0}]], {id:999,views:0}, 'single property multiple objects');

    test({id:null}, [{id:123}], {id:null}, 'does not overwrite null values');
    test({id:undefined}, [{id:123}], {id:123}, 'does overwrite undefined values');
    test({}, [{constructor:'foo'}], {constructor:'foo'}, 'does overwrite shadowed properties');

    test(['a'], [['b']], ['a'], 'array intepreted as multiple');
    test(['a'], [[['c','b']]], ['a','b'], 'array defaulted in');

    test('a', ['b'], 'a', 'strings');
    test('a', [['b']], 'a', 'string in array');


    var a = {foo:'bar'};
    var obj = run({}, 'defaults', [{a:a}]);
    equal(obj.a === a, true, 'not deep by default');

    var a = {foo:'bar'};
    var obj = run({}, 'defaults', [{a:a}, {deep:true}]);
    equal(obj.a === a, false, 'can be made deep by options');

    test({id:999}, [{id:123},{resolve:add}], {id:1122}, 'can override resolver');


    var user = { name: 'Frank', likes: 552, profile: { foods: 'Carrots', books: 'Dr. Seuss' } };
    var userData1 = { name: 'Anonymous', pic: 'default.jpg' };
    var userData2 = { likes: 0, votes: 53 };
    var userData3 = { profile: { foods: 'Hamburgers', movies: 'Mall Cop' } };

    var expectedShallow = {
      name: 'Frank',
      pic: 'default.jpg',
      likes: 552,
      votes: 53,
      profile: {
        foods: 'Carrots',
        books: 'Dr. Seuss'
      }
    };

    var expectedDeep = {
      name: 'Frank',
      pic: 'default.jpg',
      likes: 552,
      votes: 53,
      profile: {
        foods: 'Carrots',
        books: 'Dr. Seuss',
        movies: 'Mall Cop'
      }
    };

    test(testClone(user), [[userData1, userData2, userData3]], expectedShallow, 'complex | shallow');
    test(testClone(user), [[userData1, userData2, userData3],{deep:true}], expectedDeep, 'complex | deep');

  });

  method('clone', function() {

    test(new String('hardy'), [], new String('hardy'), 'clone on a string object');
    test('hardy', [], 'hardy', 'clone on a string');
    test([1,2,3], [], [1,2,3], 'clone on arrays');
    test(['a','b','c'], [], ['a','b','c'], 'clone on array of strings');

    test(Object, [undefined], undefined, 'clone on undefined');
    test(Object, [null], null, 'clone on null');

    test({a:'a'}, [], {a:'a'}, 'basic clone');
    test({a:'a',b:1,c:null}, [], {a:'a',b:1,c:null}, 'multiple clone');
    test({a:{b:'b'}}, [], {a:{b:'b'}}, 'deep clone');

    var arr1    = [1];
    var arr2    = [2];
    var arr3    = [3];
    var shallow = run([arr1,arr2,arr3], 'clone', []);
    var deep    = run([arr1,arr2,arr3], 'clone', [true]);

    equal(shallow[0], arr1, 'shallow clone | index 0 is strictly equal');
    equal(shallow[1], arr2, 'shallow clone | index 1 is strictly equal');
    equal(shallow[2], arr3, 'shallow clone | index 2 is strictly equal');

    equal(deep[0], arr1, 'deep clone | index 0 is not strictly equal');
    equal(deep[1], arr2, 'deep clone | index 1 is not strictly equal');
    equal(deep[2], arr3, 'deep clone | index 2 is not strictly equal');

    var obj1, obj2, obj3;

    obj1 = {
      broken: 'wear',
      foo: {
        jumpy: 'jump',
        bucket: {
          reverse: true
        }
      }
    }
    obj2 = run(obj1, 'clone', []);
    equal(obj1.foo.jumpy, 'jump', 'cloned object has nested attribute');
    obj1.foo.jumpy = 'hump';
    equal(obj1.foo.jumpy, 'hump', 'original object is modified');
    equal(obj2.foo.jumpy, 'hump', 'clone is shallow');

    obj1 = {
      foo: {
        bar: [1,2,3]
      }
    };
    obj2 = run(obj1, 'clone', []);
    obj3 = run(obj1, 'clone', [true]);

    obj1.foo.bar = ['a','b','c'];
    equal(obj1.foo.bar, ['a','b','c'], 'Object#clone | original object is modified');
    equal(obj2.foo.bar, ['a','b','c'], 'Object#clone | clone is shallow');


    obj1.foo.bar = ['a','b','c'];
    equal(obj3.foo.bar, [1,2,3], 'Object#clone | clone is deep');

    var arr1 = [obj1, obj1, obj1];
    var arr2 = run(arr1, 'clone', [true]);

    equal(arr1.length, arr2.length, 'array deep | lengths should be equal');
    notEqual(arr2[0], obj1, 'array deep | obj1 is not equal');
    notEqual(arr2[1], obj2, 'array deep | obj2 is not equal');
    notEqual(arr2[2], obj3, 'array deep | obj3 is not equal');

    // dates and regexes

    var obj1 = {
      d: new Date(2000, 5, 25),
      r: /dasfsa/gi
    }

    var obj2 = run(obj1, 'clone', [true]);
    obj1.d.setDate(3);
    equal(obj2.d.getDate(), 25, 'Object.clone | deep cloning also clones dates');
    equal(obj2.r.source, 'dasfsa', 'Object.clone | deep cloning also clones regexes');

    var d = new Date(2000, 5, 25);
    // Simulate the Sugar date setUTC without actually requiring it
    d.foo = true;
    var result = run(d, 'clone', []);
    equal(result.foo, true, 'utc property should also be cloned');

    // Issue #396 cloning objects with accessors.

    if (testDefinePropertySupport) {
      var template = {
        data: { label: 'original label' }
      };
      Object.defineProperty(template, 'label', {
        get: function() {
          return this.data.label;
        },
        set: function(value) {
          this.data.label = value;
        }
      });

      var template2 =  run(template, 'clone', []);
      template2.label = 'next label';
      equal(template2.data.label, 'next label', 'data value should be updated');
    }

    // Issue #307 - Object.clone should error when cloning unknown types.

    var Foo = function() {};
    raisesError(function(){ run(new Foo, 'clone', []); }, 'should raise an error if clone is not a basic object type');

    // Issue #256
    if (Sugar.Date.clone && Sugar.Date.setUTC) {
      var date = Sugar.Date.setUTC(new Date(), true);
      equal(testIsUTC(date), true, 'utc flag is set');
      equal(testIsUTC(run(date, 'clone', [])), true, 'should preserve utc flag when set');
    }

  });

  method('tap', function() {

    var fn = function(first) {
      equal(this, [1,2,3,4,5], 'context is the object');
      equal(first, [1,2,3,4,5], 'first argument is also the object');
      this.pop();
    }

    var map = function(n) {
      return n * 2;
    }

    var expected = [2,4,6,8];

    equal(run([1,2,3,4,5], 'tap', [fn]).map(map), expected, 'pop the array');
    equal(run([1,2,3,4,5], 'tap', ['pop']).map(map), expected, 'string shortcut | pop the array');
    equal(run([1,2], 'tap', [function() { this.push(3, 4); }]).map(map), expected, 'push to the array');
    equal(run([1,2], 'tap', ['push', 3, 4]).map(map), [2,4], 'string shortcut | not supported');
    equal(run([1,2,3,4], 'tap', [function(){ if (this[this.length - 1] === 5) this.pop(); }]).map(map), expected, 'checking last');


    var obj = { foo: 'bar' };
    test(obj, [], obj, 'return value is strictly equal');

  });

  method('toQueryString', function() {

    var date = new Date(2012, 8, 25);

    function getExpected(str) {
      return str.replace(/\[/g, '%5B').replace(/\]/g, '%5D');
    }

    function assertQueryString(obj, args, expected, message) {
      test(obj, args, getExpected(expected), message);
    }

    equal(run('foo', 'toQueryString', []), '', 'straight string no prefix');

    assertQueryString({foo:'bar'}, [], 'foo=bar', 'basic string');
    assertQueryString({foo:'bar',moo:'car'}, [], 'foo=bar&moo=car', 'two keys');
    assertQueryString({foo:'bar',moo:8}, [], 'foo=bar&moo=8', 'one string one numeric');
    assertQueryString({foo:'bar3'}, [], 'foo=bar3', 'number in back');
    assertQueryString({foo:'3bar'}, [], 'foo=3bar', 'number in front');
    assertQueryString({foo: 3}, [], 'foo=3', 'basic number');
    assertQueryString({foo: true}, [], 'foo=true', 'basic boolean');
    assertQueryString({foo: /reg/}, [], 'foo=%2Freg%2F', 'regexp');
    assertQueryString({foo:'a b'}, [], 'foo=a%20b', 'should escape string');
    assertQueryString({foo: date}, [], 'foo=' + date.getTime(), 'should stringify date');
    assertQueryString({foo:['a','b','c']}, [], 'foo=a&foo=b&foo=c', 'basic array');
    assertQueryString({foo:{bar:'tee',car:'hee'}}, [], 'foo_bar=tee&foo_car=hee', 'deep object');

    assertQueryString({foo:undefined}, [], 'foo=', 'undefined');
    assertQueryString({foo:false}, [], 'foo=false', 'false');
    assertQueryString({foo:null}, [], 'foo=', 'null');
    assertQueryString({foo:NaN}, [], 'foo=', 'NaN');
    assertQueryString({foo:''}, [], 'foo=', 'empty string');
    assertQueryString({foo:0}, [], 'foo=0', '0');

    assertQueryString({foo:'bar'}, [{prefix:'paw'}], 'paw_foo=bar', 'prefix | basic string');
    assertQueryString({foo:'bar',moo:'car'}, [{prefix:'paw'}], 'paw_foo=bar&paw_moo=car', 'prefix | two keys');
    assertQueryString({foo:'bar',moo:8}, [{prefix:'paw'}], 'paw_foo=bar&paw_moo=8', 'prefix | one string one numeric');
    assertQueryString({foo:'bar3'}, [{prefix:'paw'}], 'paw_foo=bar3', 'prefix | number in back');
    assertQueryString({foo:'3bar'}, [{prefix:'paw'}], 'paw_foo=3bar', 'prefix | number in front');
    assertQueryString({foo: 3}, [{prefix:'paw'}], 'paw_foo=3', 'prefix | basic number');
    assertQueryString({foo: true}, [{prefix:'paw'}], 'paw_foo=true', 'prefix | basic boolean');
    assertQueryString({foo: /reg/}, [{prefix:'paw'}], 'paw_foo=%2Freg%2F', 'prefix | regexp');
    assertQueryString({foo:'a b'}, [{prefix:'paw'}], 'paw_foo=a%20b', 'prefix | should escape string');
    assertQueryString({foo: date}, [{prefix:'paw'}], 'paw_foo=' + date.getTime(), 'prefix | should stringify date');
    assertQueryString({foo:['a','b','c']}, [{prefix:'paw'}], 'paw_foo=a&paw_foo=b&paw_foo=c', 'prefix | deep array');
    assertQueryString({foo:{bar:'tee',car:'hee'}}, [{prefix:'paw'}], 'paw_foo_bar=tee&paw_foo_car=hee', 'prefix | deep object');

    assertQueryString({foo:undefined}, [{prefix:'paw'}], 'paw_foo=', 'prefix | undefined');
    assertQueryString({foo:false}, [{prefix:'paw'}], 'paw_foo=false', 'prefix | false');
    assertQueryString({foo:null}, [{prefix:'paw'}], 'paw_foo=', 'prefix | null');
    assertQueryString({foo:NaN}, [{prefix:'paw'}], 'paw_foo=', 'prefix | NaN');
    assertQueryString({foo:''}, [{prefix:'paw'}], 'paw_foo=', 'prefix | empty string');
    assertQueryString({foo:0}, [{prefix:'paw'}], 'paw_foo=0', 'prefix | 0');

    assertQueryString({'hello there': 'bar'}, [], 'hello%20there=bar', 'spaces in key');
    assertQueryString({'"/+': 'bar'}, [], '%22%2F%2B=bar', 'key requires encoding');
    assertQueryString({'時刻': 'bar'}, [], '%E6%99%82%E5%88%BB=bar', 'Japanese key');
    assertQueryString({'%20': 'bar'}, [], '%2520=bar', '%20');

    assertQueryString(8, [], '', 'straight number no prefix');
    assertQueryString(date, [], '', 'straight date no prefix');
    assertQueryString({foo:'bar'}, [{prefix:'萬'}], '%E8%90%AC_foo=bar', 'Japanese characters in the prefix');
    assertQueryString({type:['a','b']}, [], 'type=a&type=b', 'array in object');

    assertQueryString({foo:'bar'}, [{prefix:'moo'}], 'moo_foo=bar', 'basic with prefix');
    assertQueryString({type:['a','b']}, [{deep:true}], 'type[]=a&type[]=b', 'deep | array in object');
    assertQueryString({type:['a','b']}, [{deep:true}], 'type[]=a&type[]=b', 'deep array');
    assertQueryString({foo:'bar'}, [{deep:true,prefix:'moo'}], 'moo[foo]=bar', 'deep and prefix | shallow');

    assertQueryString({foo:[['fap','cap']]}, [], 'foo=fap&foo=cap', 'array double nested');
    assertQueryString({foo:[['fap'],['cap']]}, [], 'foo=fap&foo=cap', 'array horizontal nested');
    assertQueryString({foo:{bar:{map:'fap'}}}, [], 'foo_bar_map=fap', 'object double nested');

    assertQueryString({foo:[['fap','cap']]}, [{prefix:'paw'}], 'paw_foo=fap&paw_foo=cap', 'prefix | array double nested');
    assertQueryString({foo:[['fap'],['cap']]}, [{prefix:'paw'}], 'paw_foo=fap&paw_foo=cap', 'prefix | array horizontal nested');
    assertQueryString({foo:{bar:{map:'fap'}}}, [{prefix:'paw'}], 'paw_foo_bar_map=fap', 'prefix | object double nested');

    assertQueryString({foo:[['fap'],['cap']]}, [{deep:true,prefix:'paw'}], 'paw[foo][][]=fap&paw[foo][][]=cap', 'deep and | array horizontal nested');
    assertQueryString({foo:[['fap','cap']]}, [{deep:true,prefix:'paw'}], 'paw[foo][][]=fap&paw[foo][][]=cap', 'deep and prefix | array double nested');
    assertQueryString({foo:['a','b','c']}, [{deep:true,prefix:'paw'}], 'paw[foo][]=a&paw[foo][]=b&paw[foo][]=c', 'deep and prefix | deep array');

    assertQueryString({user:{id:12345,name:'pooh'}}, [], 'user_id=12345&user_name=pooh', 'user object');
    assertQueryString({user:{id:12345,name:'pooh'}}, [{separator:'-'}], 'user-id=12345&user-name=pooh', 'user object with separator');
    assertQueryString({user:{id:12345,name:'pooh'}}, [{separator:''}], 'userid=12345&username=pooh', 'allow blank separator');

    var arr = []; arr[1] = 'a';
    assertQueryString({foo:arr}, [{deep:true}], 'foo[]=&foo[]=a', 'should handle sparse arrays');

    assertQueryString(['a','b','c'], [], 'a&b&c', 'straight array no prefix');
    assertQueryString(['a','b','c'], [], 'a&b&c', 'array');
    assertQueryString([{a:'b'},{c:'d'}], [], 'a=b&c=d', 'objects in array');
    assertQueryString(['a','b','c'], [{deep:true}], 'a&b&c', 'deep | array');
    assertQueryString([{a:'b'},{c:'d'}], [{deep:true}], 'a=b&c=d', 'deep | objects in array');
    assertQueryString(['Rails', 'coding'], [{prefix:'hobbies'}], 'hobbies=Rails&hobbies=coding', 'ActiveSupport example no brackets');
    assertQueryString(['Rails', 'coding'], [{deep:true,prefix:'hobbies'}], 'hobbies[]=Rails&hobbies[]=coding', 'ActiveSupport example with brackets');

    var booleanToNumber = function(val) {
      return typeof val === 'boolean' ? +val : val;
    }
    assertQueryString({a:true,b:'b',c:false}, [{transform:booleanToNumber}], 'a=1&b=b&c=0', 'values can be overridden with transform');
    assertQueryString({foo:{a:true,b:'b',c:false}}, [{deep:true,transform:booleanToNumber}], 'foo[a]=1&foo[b]=b&foo[c]=0', 'deep values can be overridden with transform');

    var testTransformArguments = function(val, key) {
      equal(val, 'bar', 'first argument should be the value');
      equal(key, 'foo', 'second argument should be the key');
    }
    run({foo:'bar'}, 'toQueryString', [{transform:testTransformArguments}]);


    var obj = {
      toString: function() {
        return 'hardyhar';
      }
    }

    assertQueryString({foo: obj}, [], 'foo=hardyhar', 'toString object member');

    var Foo = function() {};
    Foo.prototype.toString = function() {
      return 'custom';
    }

    test({foo: new Foo}, getExpected('foo=custom'), 'toString inherited method');

  });

});
