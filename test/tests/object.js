namespace('Object', function () {
  'use strict';

  // The scope when none is set. Needs to be set here
  // as strict mode affects this"
  var nullScope = (function() { return this; }).call();

  method('get', function() {

    var obj = {
      'a.b.c': 'surprise',
      a: {
        b: {
          c: {
            foo: 'bar'
          },
          str: 'hi',
          num: 5,
          und: undefined,
          nul: null,
          arr: [1]
        },
        str: 'hi',
        num: 5,
        und: undefined,
        nul: null,
        arr: [1]
      },
      str: 'hi',
      num: 5,
      und: undefined,
      nul: null,
      arr: [1]
    };

    // Array

    testStaticAndInstance(obj, [['str']], 'hi', 'array | string');
    testStaticAndInstance(obj, [['num']], 5, 'array | number');
    testStaticAndInstance(obj, [['und']], undefined, 'array | undefined');
    testStaticAndInstance(obj, [['nul']], null, 'array | null');
    testStaticAndInstance(obj, [['arr']], [1], 'array | array');
    testStaticAndInstance(obj, [['non']], undefined, 'array | non-existent');
    testStaticAndInstance(obj, [['a','b','c','foo']], 'bar', 'array | accesses deep property');
    testStaticAndInstance(obj, [['a.b.c']], 'surprise', 'array | allows key with dot notation');
    testStaticAndInstance(obj, [{0:'a',1:'b',2:'c',3:'foo',length:4}], 'bar', 'array | array-like');

    // Dot syntax

    testStaticAndInstance(obj, ['str'], 'hi', 'flat string');
    testStaticAndInstance(obj, ['num'], 5, 'flat number');
    testStaticAndInstance(obj, ['und'], undefined, 'flat undefined');
    testStaticAndInstance(obj, ['nul'], null, 'flat null');
    testStaticAndInstance(obj, ['arr'], [1], 'flat array');
    testStaticAndInstance(obj, ['non'], undefined, 'flat non-existent');

    testStaticAndInstance(obj, ['a.str'], 'hi', 'one level | string');
    testStaticAndInstance(obj, ['a.num'], 5, 'one level | number');
    testStaticAndInstance(obj, ['a.und'], undefined, 'one level | undefined');
    testStaticAndInstance(obj, ['a.nul'], null, 'one level | null');
    testStaticAndInstance(obj, ['a.arr'], [1], 'one level | array');
    testStaticAndInstance(obj, ['a.non'], undefined, 'one level | non-existent');

    testStaticAndInstance(obj, ['a.b.str'], 'hi', 'two levels | string');
    testStaticAndInstance(obj, ['a.b.num'], 5, 'two levels | number');
    testStaticAndInstance(obj, ['a.b.und'], undefined, 'two levels | undefined');
    testStaticAndInstance(obj, ['a.b.nul'], null, 'two levels | null');
    testStaticAndInstance(obj, ['a.b.arr'], [1], 'two levels | array');
    testStaticAndInstance(obj, ['a.b.non'], undefined, 'two levels | non-existent');

    testStaticAndInstance(obj, ['arr.0'], 1, 'flat array property');
    testStaticAndInstance(obj, ['a.arr.0'], 1, 'one level | array property');
    testStaticAndInstance(obj, ['a.b.arr.0'], 1, 'two levels | array property');

    testStaticAndInstance(obj, ['a.b.c'], { foo: 'bar' }, 'deep inner object');
    equal(obj['a.b.c'], 'surprise', 'flat shadowing property can still be accessed');

    testStaticAndInstance(obj, ['a.b.c.foo'], 'bar', 'deep');
    testStaticAndInstance(obj, ['a.b.b'], undefined, 'deep last non-existent');
    testStaticAndInstance(obj, ['c.b.a'], undefined, 'deep none exist');

    testStaticAndInstance(obj, ['.'], undefined, 'single dot');

    testStaticAndInstance({}, [], undefined, 'no arguments');
    testStaticAndInstance({'undefined':1}, [undefined], undefined, 'undefined should not be coerced to string');
    testStaticAndInstance({'null':1}, [null], undefined, 'null should not be coerced to string');
    testStaticAndInstance({3:1}, [3], 1, 'number should be coerced to string');
    testStaticAndInstance({'undefined':1}, ['undefined'], 1, '"undefined" is found');
    testStaticAndInstance({'null':1}, ['null'], 1, '"null" is found');

    testStaticAndInstance({'':1}, [''], 1, 'empty string as key');
    testStaticAndInstance({'':{'':2}}, ['.'], 2, 'nested empty string as key');

    testStaticAndInstance(undefined, ['a'], undefined, 'flat property on undefined');
    testStaticAndInstance(undefined, ['a.b'], undefined, 'deep property on undefined');
    testStaticAndInstance(null, ['a'], undefined, 'flat property on null');
    testStaticAndInstance(null, ['a.b'], undefined, 'deep property on null');
    testStaticAndInstance({}, ['a'], undefined, 'flat property on empty object');
    testStaticAndInstance({}, ['a.b'], undefined, 'deep property on empty object');
    testStaticAndInstance(NaN, ['a'], undefined, 'flat property on NaN');
    testStaticAndInstance(NaN, ['a.b'], undefined, 'deep property on NaN');
    testStaticAndInstance('', ['a'], undefined, 'flat property on empty string');
    testStaticAndInstance('', ['a.b'], undefined, 'deep property on empty string');
    testStaticAndInstance('foo', ['a'], undefined, 'flat property on non-empty string');
    testStaticAndInstance('foo', ['a.b'], undefined, 'deep property on non-empty string');

    testStaticAndInstance(['a','b'], [0], 'a', 'array property found');
    testStaticAndInstance(['a','b'], [1], 'b', 'array property found');
    testStaticAndInstance(['a','b'], ['0'], 'a', 'array property found by string');
    testStaticAndInstance(['a','b'], ['1'], 'b', 'array property found by string');

    testStaticAndInstance([{foo:'bar'}], ['0.foo'], 'bar', 'array deep property');
    testStaticAndInstance({foo:['bar']}, ['foo.0'], 'bar', 'object array property');
    testStaticAndInstance([[['bar']]], ['0.0.0'], 'bar', 'deep array');

    testStaticAndInstance({users:{993425:{name:'Harry'}}}, ['users.993425.name'], 'Harry', 'gets ids in objects');

    // Bracket syntax

    test(['a'], ['[0]'], 'a', 'simple bracket');
    test([['a']], ['[0][0]'], 'a', 'deep array index | 2');
    test([[['a']]], ['[0][0][0]'], 'a', 'deep array index | 3');
    test([[[{a:'a'}]]], ['[0][0][0].a'], 'a', 'deep array index and dot');
    test([[[{a:'a'}]]], ['0[0][0].a'], 'a', 'deep array index with no brackets starting');
    test([[[{a:'a'}]]], ['[-1][-1][-1].a'], 'a', 'deep array index negative');
    test([], ['[0]'], undefined, 'index in empty array');

    testStaticAndInstance({a:['foo','bar']}, ['a'], ['foo','bar'], 'simple prop');
    testStaticAndInstance({a:['foo','bar']}, ['a[0]'], 'foo', 'index 0');
    testStaticAndInstance({a:['foo','bar']}, ['a[1]'], 'bar', 'index 1');
    testStaticAndInstance({a:['foo','bar']}, ['a[2]'], undefined, 'index 2');
    testStaticAndInstance({a:['foo','bar']}, ['a[-1]'], 'bar', 'index -1');
    testStaticAndInstance({a:['foo','bar']}, ['a[-2]'], 'foo', 'index -2');
    testStaticAndInstance({a:['foo','bar']}, ['a[-3]'], undefined, 'index -3');
    testStaticAndInstance({a:['foo','bar']}, ['a[]'], undefined, 'null index');
    testStaticAndInstance({a:['foo','bar']}, ['a.0'], 'foo', 'index 0 | dot');
    testStaticAndInstance({a:['foo','bar']}, ['a.1'], 'bar', 'index 1 | dot');
    testStaticAndInstance({a:['foo','bar']}, ['a.2'], undefined, 'index 2 | dot');

    testStaticAndInstance({a:['foo','bar']}, ['a.-1'], undefined, 'index -1 | dot');
    testStaticAndInstance({a:['foo','bar']}, ['a.-2'], undefined, 'index -2 | dot');
    testStaticAndInstance({a:['foo','bar']}, ['a.-3'], undefined, 'index -3 | dot');

    testStaticAndInstance({a:[{b:'b'},{c:'c'}]}, ['a[0].b'], 'b', 'index followed by dot');


    // Range syntax

    test(['foo','bar','cat'], ['[0..1]'], ['foo','bar'], 'range syntax | 0..1');
    test(['foo','bar','cat'], ['[1..2]'], ['bar','cat'], 'range syntax | 1..2');
    test(['foo','bar','cat'], ['[1..3]'], ['bar','cat'], 'range syntax | 1..3');
    test(['foo','bar','cat'], ['[0..0]'], ['foo'], 'range syntax | -1..0');
    test(['foo','bar','cat'], ['[0..-1]'], ['foo','bar','cat'], 'range syntax | 0..-1');
    test(['foo','bar','cat'], ['[-1..0]'], [], 'range syntax | -1..0');
    test(['foo','bar','cat'], ['[-1..-1]'], ['cat'], 'range syntax | -1..-1');
    test(['foo','bar','cat'], ['[-2..-1]'], ['bar','cat'], 'range syntax | -2..-1');
    test(['foo','bar','cat'], ['[-3..-1]'], ['foo','bar','cat'], 'range syntax | -3..-1');
    test(['foo','bar','cat'], ['[-4..-1]'], ['foo','bar','cat'], 'range syntax | -4..-1');
    test(['foo','bar','cat'], ['[-4..-3]'], ['foo'], 'range syntax | -4..-3');
    test(['foo','bar','cat'], ['[-5..-4]'], [], 'range syntax | -5..-4');
    test(['foo','bar','cat'], ['[0..]'], ['foo','bar','cat'], 'range syntax | 0..');
    test(['foo','bar','cat'], ['[..1]'], ['foo','bar'], 'range syntax | ..1');
    test(['foo','bar','cat'], ['[..]'], ['foo','bar','cat'], 'range syntax | ..');
    test(['foo','bar','cat'], ['..'], undefined, 'range syntax | .. should be undefined');

    testStaticAndInstance({a:['foo','bar','cat']}, ['a[0..1]'], ['foo','bar'], 'range syntax | nested bracket');
    testStaticAndInstance({a:{b:['foo','bar','cat']}}, ['a.b[0..1]'], ['foo','bar'], 'range syntax | dot and bracket');
    testStaticAndInstance({a:{b:[{d:'final'},{d:'fight'}]}}, ['a.b[0..1].d'], ['final','fight'], 'range syntax | dot and bracket with trailing');

    var complex = [[[{x:'a'},{x:'b'},{x:'c'}],[{x:'d'},{x:'e'},{x:'f'}],[{x:'g'},{x:'h'},{x:'i'}]]];
    test(complex[0], ['[0..1][0..1]'], [[{x:'a'},{x:'b'}],[{x:'d'},{x:'e'}]], 'range syntax | compound brackets');
    test(complex, ['[0][0..1][0..1]'], [[{x:'a'},{x:'b'}],[{x:'d'},{x:'e'}]], 'range syntax | compound brackets in 0');
    test(complex, ['[0][0..1][0..1].x'], [['a','b'],['d','e']], 'range syntax | compound brackets with trailing dot');

    var tree = {
      f: [{
          f: [
            {f:['a','b','c']},
            {f:['d','e','f']},
            {f:['g','h','i']}
          ]
        }, {
          f: [
            {f:['j','k','l']},
            {f:['m','n','o']},
            {f:['p','q','r']}
          ]
        }, {
          f: [
            {f:['s','t','u']},
            {f:['v','w','x']},
            {f:['y','z','!']}
          ]
        }]
    };

    testStaticAndInstance(tree, ['f[0..1].f[0..1].f[0..1]'], [[['a','b'],['d','e']],[['j','k'],['m','n']]], 'range syntax | tree');

    var Foo = function() {};
    var Bar = function() { this.c = 'inst-c'; };

    Foo.a = 'class-a';
    Foo.prototype.a = 'foo-a';
    Foo.prototype.b = 'foo-b';
    Foo.prototype.c = 'foo-c';

    Bar.prototype = new Foo;
    Bar.prototype.b = 'bar-b';

    var instFoo = new Foo();
    var instBar = new Bar();

    test(Object, [Foo, 'a'], 'class-a', 'Class method class-a');

    test(Object, [Foo.prototype, 'a'], 'foo-a', 'Foo.prototype.a');
    test(Object, [Bar.prototype, 'a'], 'foo-a', 'Bar.prototype.a');
    test(Object, [Foo.prototype, 'b'], 'foo-b', 'Foo.prototype.b');
    test(Object, [Bar.prototype, 'b'], 'bar-b', 'Bar.prototype.b');

    test(Object, [instFoo, 'a'], 'foo-a', 'foo.a');
    test(Object, [instBar, 'a'], 'foo-a', 'bar.a');
    test(Object, [instFoo, 'b'], 'foo-b', 'foo.b');
    test(Object, [instBar, 'b'], 'bar-b', 'bar.b');
    test(Object, [instFoo, 'c'], 'foo-c', 'foo.c');
    test(Object, [instBar, 'c'], 'inst-c', 'bar.c');

    test(Object, [Array, 'prototype.every'], Array.prototype.every, 'works on built-ins');

    if (definePropertySupport) {
      // Non-enumerable
      var obj = {};
      Object.defineProperty(obj, 'foo', {
        enumerable: false,
        value: 3
      });
      Object.defineProperty(obj, 'bar', {
        enumerable: false,
        value: {}
      });
      Object.defineProperty(obj.bar, 'car', {
        enumerable: false,
        value: 'hi'
      });
      test(Object, [obj, 'foo'], 3, 'works on non-enumerable properties');
      test(Object, [obj, 'bar.car'], 'hi', 'works on deep non-enumerable properties');
    }

  });

  method('set', function() {

    var obj = {};
    run(Object, 'set', [obj, 'foo.bar', 'car']);
    equal(obj.foo.bar, 'car', 'Basic flat property is set on original object');

    test({}, ['.','x'], {'':{'':'x'}}, 'single dot');
    test({'':1}, ['','x'], {'':'x'}, 'empty string as key');

    var obj = {};
    var result = run(Object, 'set', [obj, 'foo', 'bar']);
    equal(obj.foo, 'bar', 'Basic flat property is set on original object');
    equal(result === obj, true, 'returned value is the original object');

    var obj = {};
    run(Object, 'set', [obj, 'foo.bar', 'car']);
    equal(obj.foo.bar, 'car', 'Basic flat property is set on original object');

    // Arrays

    testStaticAndInstance({}, [['str'], 'hi'], {str:'hi'}, 'array | string');
    testStaticAndInstance({}, [['num'], 5], {num:5}, 'array | number');
    testStaticAndInstance({}, [['und'], undefined], {}, 'array | undefined');
    testStaticAndInstance({}, [['nul'], null], {nul:null}, 'array | null');
    testStaticAndInstance({}, [['arr'], [1]], {arr:[1]}, 'array | array');
    testStaticAndInstance({}, [['obj'], {a:'b'}], {obj:{a:'b'}}, 'array | object');
    testStaticAndInstance({}, [['a','b','c'],'foo'], {a:{b:{c:'foo'}}}, 'array | set deep property');
    testStaticAndInstance({}, [['a.b.c'],'foo'], {'a.b.c':'foo'}, 'array | allows key with dot notation');
    testStaticAndInstance({}, [{0:'a',1:'b',2:'c',length:3},'foo'], {a:{b:{c:'foo'}}}, 'array | array-like');

    // Dot syntax

    testStaticAndInstance({}, ['str', 'hi'], {str:'hi'}, 'flat | string');
    testStaticAndInstance({}, ['num', 5], {num:5}, 'flat | number');
    testStaticAndInstance({}, ['und', undefined], {}, 'flat | undefined is not set');
    testStaticAndInstance({}, ['nul', null], {nul:null}, 'flat | null');
    testStaticAndInstance({}, ['arr', [1]], {arr:[1]}, 'flat | array');
    testStaticAndInstance({}, ['obj', {a:'b'}], {obj:{a:'b'}}, 'flat | object');

    testStaticAndInstance({}, ['a.str', 'hi'], {a:{str:'hi'}}, 'one level | string');
    testStaticAndInstance({}, ['a.num', 5], {a:{num:5}}, 'one level | number');
    testStaticAndInstance({}, ['a.und', undefined], {a:{}}, 'one level | undefined is not set');
    testStaticAndInstance({}, ['a.nul', null], {a:{nul:null}}, 'one level | null');
    testStaticAndInstance({}, ['a.arr', [1]], {a:{arr:[1]}}, 'one level | array');
    testStaticAndInstance({}, ['a.obj', {a:'b'}], {a:{obj:{a:'b'}}}, 'one level | object');

    testStaticAndInstance({}, ['a.b.str', 'hi'], {a:{b:{str:'hi'}}}, 'two levels | string');
    testStaticAndInstance({}, ['a.b.num', 5], {a:{b:{num:5}}}, 'two levels | number');
    testStaticAndInstance({}, ['a.b.und', undefined], {a:{b:{}}}, 'two levels | undefined is not set');
    testStaticAndInstance({}, ['a.b.nul', null], {a:{b:{nul:null}}}, 'two levels | null');
    testStaticAndInstance({}, ['a.b.arr', [1]], {a:{b:{arr:[1]}}}, 'two levels | array');
    testStaticAndInstance({}, ['a.b.obj', {a:'b'}], {a:{b:{obj:{a:'b'}}}}, 'two levels | object');

    testStaticAndInstance({}, ['0', 'x'], {0:'x'}, 'numeric index on object');
    testStaticAndInstance({}, ['0.foo', 'x'], {0:{foo:'x'}}, 'keyword after numeric index');
    testStaticAndInstance({}, ['foo.0', 'x'], {foo:{0:'x'}}, 'numeric index after keyword');
    testStaticAndInstance({}, ['foo.bar.0', 'x'], {foo:{bar:{0:'x'}}}, 'numeric index two deep');
    testStaticAndInstance({}, ['foo.0.bar', 'x'], {foo:{0:{bar:'x'}}}, 'numeric index in the middle');

    testStaticAndInstance({}, ['a','x'], {a:'x'}, 'flat property on empty object');
    testStaticAndInstance({}, ['a.b','x'], {a:{b:'x'}}, 'deep property on empty object');

    // Array tests won't make sense on an extended object.
    test(Object, [[], '0', 'x'], ['x'], 'numeric index on array');
    test(Object, [['a','b'], 0,'x'], ['x','b'], 'array property set | 0');
    test(Object, [['a','b'], 1,'x'], ['a','x'], 'array property set | 1');
    test(Object, [['a','b'], '0','x'], ['x','b'], 'array property set by string | 0');
    test(Object, [['a','b'], '1','x'], ['a','x'], 'array property set by string | 1');

    test(Object, [[{foo:'bar'}], '0.foo', 'x'], [{foo:'x'}], 'array deep property');
    test(Object, [{foo:['bar']}, 'foo.0','x'], {foo:['x']}, 'object array property');
    test(Object, [[[['bar']]], '0.0.0', 'x'], [[['x']]], 'deep array');

    var obj = {
      a: {
        b: {
          c: 'bar'
        }
      }
    };

    testStaticAndInstance(testClone(obj), ['a.b.c', 'x'], {a:{b:{c:'x'}}}, 'deep');
    testStaticAndInstance(testClone(obj), ['a.b.b', 'x'], {a:{b:{c:'bar',b:'x'}}}, 'deep last non-existent');
    testStaticAndInstance(testClone(obj), ['c.b.a', 'x'], {a:{b:{c:'bar'}},c:{b:{a:'x'}}}, 'deep none exist');

    testStaticAndInstance({}, ['.','x'], {'':{'':'x'}}, 'single dot');

    testStaticAndInstance({}, [], {}, 'no arguments');
    testStaticAndInstance({}, [undefined, 'x'], {}, 'undefined should be ignored');
    testStaticAndInstance({}, [null, 'x'], {}, 'null should ignored');
    testStaticAndInstance({}, [3, 'x'], {3:'x'}, 'number should be coerced to string');
    testStaticAndInstance({3:1}, [3,'x'], {3:'x'}, 'coerced number is set');

    testStaticAndInstance({'':1}, ['','x'], {'':'x'}, 'empty string as key');
    testStaticAndInstance({'':{'':2}}, ['.','x'], {'':{'':'x'}}, 'nested empty string as key');

    raisesError(function(){ run(Object, 'set', [undefined, 'a', 'x']); }, 'should raise error on undefined');
    raisesError(function(){ run(Object, 'set', [null, 'a', 'x']); }, 'should raise error on null');
    raisesError(function(){ run(Object, 'set', [NaN, 'a', 'x']); }, 'should raise error on NaN');
    raisesError(function(){ run(Object, 'set', ['foo', 'a', 'x']); }, 'should raise error on string');
    raisesError(function(){ run(Object, 'set', ['foo', '[0]', 'x']); }, 'should raise error on string with bracket syntax');

    raisesError(function(){ run(Object, 'set', [{a:undefined}, 'a.b', 'x']); }, 'should raise error on undefined deep');
    raisesError(function(){ run(Object, 'set', [{a:null}, 'a.b', 'x']); }, 'should raise error on null deep');
    raisesError(function(){ run(Object, 'set', [{a:NaN}, 'a.b', 'x']); }, 'should raise error on NaN deep');
    raisesError(function(){ run(Object, 'set', [{a:'foo'}, 'a.b', 'x']); }, 'should raise error on string deep');
    raisesError(function(){ run(Object, 'set', [{a:'foo'}, 'a[0]', 'x']); }, 'should raise error on string deep with bracket syntax');

    testStaticAndInstance({}, ['users.993425.name', 'Harry'], {users:{993425:{name:'Harry'}}}, 'allows IDs as strings');

    var sparse = testGetSparseArray;

    // Bracket syntax

    test([], ['[0]','foo'], ['foo'], 'setting index 0 of array');
    test([], ['[1]','foo'], testGetSparseArray(1,'foo'), 'setting index 1 of array');
    test([], ['[-1]','foo'], testGetSparseArray(-1,'foo'), 'negative index set');
    test([], ['[0][0]','foo'], [['foo']], 'nested index 0 0');
    test([], ['[1][0]','foo'], testGetSparseArray(1,['foo']), 'nested index 1 0');
    test([], ['[0][1]','foo'], [testGetSparseArray(1,'foo')], 'nested index 0 1');
    test([], ['[1][1]','foo'], testGetSparseArray(1,testGetSparseArray(1, 'foo')), 'nested index 1 1');

    test(['bar'], ['[0]','foo'], ['foo'], 'setting index 0 of existing');
    test(['bar','car'], ['[1]','foo'], ['bar','foo'], 'setting index 1 of existing');
    test(['bar'], ['[-1]','foo'], ['foo'], 'setting index -1 of existing');
    test(['bar','car'], ['[-1]','foo'], ['bar','foo'], 'setting index -1 of existing');

    testStaticAndInstance({}, ['f[0]','foo'], {f:['foo']}, 'setting index 0 | deep');
    testStaticAndInstance({}, ['f[1]','foo'], {f:testGetSparseArray(1,'foo')}, 'setting index 1 | deep');
    testStaticAndInstance({}, ['f[-1]','foo'], {f:testGetSparseArray(-1,'foo')}, 'negative index set | deep');
    testStaticAndInstance({}, ['f[0][0]','foo'], {f:[['foo']]}, 'nested index 0 0 | deep');
    testStaticAndInstance({}, ['f[1][0]','foo'], {f:testGetSparseArray(1,['foo'])}, 'nested index 1 0 | deep');
    testStaticAndInstance({}, ['f[0][1]','foo'], {f:[testGetSparseArray(1,'foo')]}, 'nested index 0 1 | deep');
    testStaticAndInstance({}, ['f[1][1]','foo'], {f:testGetSparseArray(1,testGetSparseArray(1, 'foo'))}, 'nested index 1 1 | deep');

    testStaticAndInstance({}, ['f[0].x','foo'], {f:[{x:'foo'}]}, 'setting index 0 | deep with trailing');
    testStaticAndInstance({}, ['f[1].x','foo'], {f:testGetSparseArray(1,{x:'foo'})}, 'setting index 1 | deep with trailing');
    testStaticAndInstance({}, ['f[-1].x','foo'], {f:testGetSparseArray(-1,{x:'foo'})}, 'negative index set | deep with trailing');
    testStaticAndInstance({}, ['f[0][0].x','foo'], {f:[[{x:'foo'}]]}, 'nested index 0 0 | deep with trailing');
    testStaticAndInstance({}, ['f[1][0].x','foo'], {f:testGetSparseArray(1,[{x:'foo'}])}, 'nested index 1 0 | deep with trailing');
    testStaticAndInstance({}, ['f[0][1].x','foo'], {f:[testGetSparseArray(1,{x:'foo'})]}, 'nested index 0 1 | deep with trailing');
    testStaticAndInstance({}, ['f[1][1].x','foo'], {f:testGetSparseArray(1,testGetSparseArray(1, {x:'foo'}))}, 'nested index 1 1 | deep with trailing');

    testStaticAndInstance({}, ['a.b[0].x','foo'], {a:{b:[{x:'foo'}]}}, 'setting index 0 | 2 in front and trailing');
    testStaticAndInstance({}, ['a.b[1].x','foo'], {a:{b:testGetSparseArray(1, {x:'foo'})}}, 'setting index 1 | 2 in front and trailing');
    testStaticAndInstance({}, ['a.b[-1].x','foo'], {a:{b:testGetSparseArray(-1, {x:'foo'})}}, 'negative index set | 2 in front and trailing');
    testStaticAndInstance({}, ['a.b[0][0].x','foo'], {a:{b:[[{x:'foo'}]]}}, 'nested index 0 0 | 2 in front and trailing');
    testStaticAndInstance({}, ['a.b[1][0].x','foo'], {a:{b:testGetSparseArray(1, [{x:'foo'}])}}, 'nested index 1 0 | 2 in front and trailing');
    testStaticAndInstance({}, ['a.b[0][1].x','foo'], {a:{b:[testGetSparseArray(1,{x:'foo'})]}}, 'nested index 0 1 | 2 in front and trailing');
    testStaticAndInstance({}, ['a.b[1][1].x','foo'], {a:{b:testGetSparseArray(1,testGetSparseArray(1,{x:'foo'}))}}, 'nested index 1 1 | 2 in front and trailing');

    testStaticAndInstance({}, ['a.b[0].x[0]','foo'], {a:{b:[{x:['foo']}]}}, 'setting index 0 | 2 in front and trailing index');
    testStaticAndInstance({}, ['a.b[1].x[0]','foo'], {a:{b:testGetSparseArray(1,{x:['foo']})}}, 'setting index 1 | 2 in front and trailing index');
    testStaticAndInstance({}, ['a.b[-1].x[0]','foo'], {a:{b:testGetSparseArray(-1,{x:['foo']})}}, 'negative index set | 2 in front and trailing index');
    testStaticAndInstance({}, ['a.b[0][0].x[0]','foo'], {a:{b:[[{x:['foo']}]]}}, 'nested index 0 0 | 2 in front and trailing index');
    testStaticAndInstance({}, ['a.b[1][0].x[0]','foo'], {a:{b:testGetSparseArray(1,[{x:['foo']}])}}, 'nested index 1 0 | 2 in front and trailing index');
    testStaticAndInstance({}, ['a.b[0][1].x[0]','foo'], {a:{b:[testGetSparseArray(1,{x:['foo']})]}}, 'nested index 0 1 | 2 in front and trailing index');
    testStaticAndInstance({}, ['a.b[1][1].x[0]','foo'], {a:{b:testGetSparseArray(1,testGetSparseArray(1,{x:['foo']}))}}, 'nested index 1 1 | 2 in front and trailing index');

    testStaticAndInstance({}, ['a.b[0].x[0].z','foo'], {a:{b:[{x:[{z:'foo'}]}]}}, 'setting index 0 | 2 in front and trailing index');
    testStaticAndInstance({}, ['a.b[1].x[0].z','foo'], {a:{b:testGetSparseArray(1,{x:[{z:'foo'}]})}}, 'setting index 1 | 2 in front and trailing index');
    testStaticAndInstance({}, ['a.b[-1].x[0].z','foo'], {a:{b:testGetSparseArray(-1,{x:[{z:'foo'}]})}}, 'negative index set | 2 in front and trailing index');
    testStaticAndInstance({}, ['a.b[0][0].x[0].z','foo'], {a:{b:[[{x:[{z:'foo'}]}]]}}, 'nested index 0 0 | 2 in front and trailing index');
    testStaticAndInstance({}, ['a.b[1][0].x[0].z','foo'], {a:{b:testGetSparseArray(1,[{x:[{z:'foo'}]}])}}, 'nested index 1 0 | 2 in front and trailing index');
    testStaticAndInstance({}, ['a.b[0][1].x[0].z','foo'], {a:{b:[testGetSparseArray(1,{x:[{z:'foo'}]})]}}, 'nested index 0 1 | 2 in front and trailing index');
    testStaticAndInstance({}, ['a.b[1][1].x[0].z','foo'], {a:{b:testGetSparseArray(1,testGetSparseArray(1,{x:[{z:'foo'}]}))}}, 'nested index 1 1 | 2 in front and trailing index');

    testStaticAndInstance({}, ['f[0].x.y','foo'], {f:[{x:{y:'foo'}}]}, 'setting index 0 | 2 in back after index');
    testStaticAndInstance({}, ['f[1].x.y','foo'], {f:testGetSparseArray(1,{x:{y:'foo'}})}, 'setting index 1 | 2 in back after index');
    testStaticAndInstance({}, ['f[-1].x.y','foo'], {f:testGetSparseArray(-1, {x:{y:'foo'}})}, 'negative index set | 2 in back after index');
    testStaticAndInstance({}, ['f[0][0].x.y','foo'], {f:[[{x:{y:'foo'}}]]}, 'nested index 0 0 | 2 in back after index');
    testStaticAndInstance({}, ['f[1][0].x.y','foo'], {f:testGetSparseArray(1,[{x:{y:'foo'}}])}, 'nested index 1 0 | 2 in back after index');
    testStaticAndInstance({}, ['f[0][1].x.y','foo'], {f:[testGetSparseArray(1,{x:{y:'foo'}})]}, 'nested index 0 1 | 2 in back after index');
    testStaticAndInstance({}, ['f[1][1].x.y','foo'], {f:testGetSparseArray(1,testGetSparseArray(1,{x:{y:'foo'}}))}, 'nested index 1 1 | 2 in back after index');


    test(['foo'], ['[-1]','bar'], ['bar'], 'negative index means last element in bracket syntax');
    test({f:['foo']}, ['f[-1]','bar'], {f:['bar']}, 'negative index means last element in bracket syntax | deep');

    var arr = ['foo'];
    arr[-1] = 'bar';
    test(['foo'], ['-1','bar'], arr, 'negative index can still be set without brackets');
    test({f:['foo']}, ['f.-1','bar'], {f:arr}, 'negative index can still be set without brackets | deep');

    // Push syntax

    test([], ['[]','foo'], ['foo'], 'push | simple array');
    test(['a'], ['[]','foo'], ['a','foo'], 'push | simple array push with existing');
    test({x:['a']}, ['x[]', 'foo'], {x:['a','foo']}, 'push | array deep');
    test({x:{y:['a']}}, ['x.y[]', 'foo'], {x:{y:['a','foo']}}, 'push | array 2 deep');
    testStaticAndInstance({}, ['x[]', 'foo'], {x:['foo']}, 'push | non-existent array');

    test([], ['[].x','foo'], [{x:'foo'}], 'creates namespace when trailing exists');
    test([], ['[].x.y','foo'], [{x:{y:'foo'}}], 'creates namespace when 2 trailing exist');
    testStaticAndInstance({}, ['a[].x.y','foo'], {a:[{x:{y:'foo'}}]}, 'creates namespace when leading exists');


    // Range syntax

    test([], ['[0..1]', 'wow'], ['wow','wow'], 'range');
    test([], ['[0..1][0..1]', 'wow'], [['wow','wow'],['wow','wow']], 'range | nested');
    test([], ['[0..1].car', 'wow'], [{car:'wow'},{car:'wow'}], 'range | trailing');

    testStaticAndInstance({}, ['foo[0..1]', 'wow'], {foo:['wow','wow']}, 'range | leading');
    testStaticAndInstance({}, ['foo.bar[0..1].car.far','wow'], {foo:{'bar':[{car:{far:'wow'}},{car:{far:'wow'}}]}}, 'range | complex');

    test([], ['[0][0..1]', 'wow'], [['wow','wow']], 'range | leading bracket');
    test([], ['[1][0..1]', 'wow'], testGetSparseArray(1, ['wow','wow']), 'range | leading bracket | 1');
    test([], ['[0..1][0]', 'wow'], [['wow'],['wow']], 'range | trailing bracket');
    test([], ['[0..1][1]', 'wow'], [testGetSparseArray(1, 'wow'),testGetSparseArray(1, 'wow')], 'range | trailing bracket | 1');
    test([], ['[9][2][0..1][3][5]', 'wow'], sparse(9, sparse(2, [sparse(3, sparse(5, 'wow')),sparse(3, sparse(5, 'wow'))])), 'range | bracket complex');

    var inner = sparse(1, {car:'wow'});
    testStaticAndInstance({}, ['foo[3].bar[4..5][1].car', 'wow'], {foo:sparse(3,{bar:sparse(4,inner,inner)})}, 'range | quite complex');

    // Class instances

    var Foo = function() { this.a = 'a'; };
    var Bar = function() { this.b = 'b'; };

    Foo.prototype = new Bar;
    Bar.prototype.c = 'c';

    var f = new Foo();

    equal(f.hasOwnProperty('a'), true,  'instance setup | a is own');
    equal(f.hasOwnProperty('b'), false, 'instance setup | b is not own');
    equal(f.hasOwnProperty('c'), false, 'instance setup | c is not own');

    run(Object, 'set', [f, 'a', 'x']);
    run(Object, 'set', [f, 'b', 'x']);
    run(Object, 'set', [f, 'c', 'x']);

    equal(f.hasOwnProperty('a'), true, 'a is set');
    equal(f.hasOwnProperty('b'), true, 'b is set');
    equal(f.hasOwnProperty('c'), true, 'c is set');

    if (f.__proto__) {
      equal(f.__proto__.b, 'b', 'b is shadowed');
      equal(f.__proto__.c, 'c', 'c is shadowed');
    }

    run(Object, 'set', [Array, 'prototype.whee', 'x']);
    equal(Array.prototype.whee, 'x', 'works on built-ins');
    delete Array.prototype['whee'];

    if (definePropertySupport) {
      // Non-enumerable
      var obj = {};
      Object.defineProperty(obj, 'foo', {
        writable: true,
        enumerable: false,
        value: 3
      });
      Object.defineProperty(obj, 'bar', {
        writable: true,
        enumerable: false,
        value: {}
      });
      Object.defineProperty(obj.bar, 'car', {
        writable: true,
        enumerable: false,
        value: 'hi'
      });
      run(Object, 'set', [obj, 'foo', 'x']);
      equal(obj.foo, 'x', 'Non-enumerable property set');
      equal(obj.bar.car, 'hi', 'deep non-enumerable property exists');

      run(Object, 'set', [obj, 'bar.car', 'x']);
      equal(obj.bar.car, 'x', 'deep non-enumerable property set');
    }

  });

  method('extended', function() {
    var keys, values, obj, strippedValues, count;
    var d = new Date();

    equal(run(Object, 'extended'), run(Object, 'extended', [{}]), 'Object.extended | null argument same as empty object');

    obj = run(Object, 'extended', [{
      number: 3,
      person: 'jim',
      date: d
    }]);
    keys = ['number','person','date'];
    values = [3,'jim',d];
    equal(obj.keys(), keys, "returns object's keys");
    count = 0;
    obj.keys(function(key, value) {
      equal(key, keys[count], 'accepts a function');
      equal(value, values[count], 'value is also passed');
      equal(this, obj, '"this" is the object');
      count++;
    });

    equal(count, 3, 'accepts a function | iterated properly');

    equal(run(Object, 'extended').keys(), [], 'empty object');
    equal(run(run(Object, 'extended'), 'keys', []), [], 'empty object');

    keys = ['number','person','date'];
    values = [3,'jim',d];
    equal(run(obj, 'keys', []), keys, "Object.keys | returns object's keys");
    count = 0;
    run(obj, 'keys', [function(key) {
      equal(key, keys[count], 'Object.keys | accepts a function');
      count++;
    }]);
    equal(count, 3, 'Object.keys | accepts a function | iterated properly');

    strippedValues = obj.values().filter(function(m) { return typeof m != 'function'; });
    equal(strippedValues, values, "returns object's values");
    count = 0;
    obj.values(function(value) {
      equal(value, values[count], 'accepts a function');
      count++;
    });

    equal(count, 3, 'accepts a function | iterated properly');

    strippedValues = run(obj, 'values', []).filter(function(m) { return typeof m != 'function'; });
    equal(strippedValues, values, "Object.values | returns object's values");
    count = 0;
    run(obj, 'values', [function(value) {
      equal(value, values[count], 'Object.values | accepts a function');
      count++;
    }]);
    equal(count, 3, 'Object.values | accepts a function | iterated properly');

    strippedValues = run(Object, 'extended').values().filter(function(m) { return typeof m != 'function'; });
    equal(strippedValues, [], 'empty object');

    strippedValues = run(run(Object, 'extended'), 'values', []).filter(function(m) { return typeof m != 'function'; });
    equal(strippedValues, [], 'empty object');


    // Object.extended hasOwnProperty issue #97
    // see: http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/
    run(Object, 'extended', [{ hasOwnProperty: true }]);

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
    test(Object, ['foo[bar]=tee&foo[car]=hee', {deep:true}], { foo: { bar: 'tee', car: 'hee' } }, 'handles hash params');

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
    assertIsNotHash(run(Object, 'fromQueryString', ['foo=bar&moo=car']));

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
    var testTransformArguments = function(key, value, obj, str) {
      equal(key, 'foo', 'first argument should be the key');
      equal(value, 'bar', 'second argument should be the value');
      count++;
    }
    run(Object, 'fromQueryString', ['foo=bar', {transform:testTransformArguments}]);
    equal(count, 1, 'should have run once');

    var count = 0;
    var expectedKeys = ['foo[name]', 'moo[]'];
    var expectedValues = ['bar', 'beer'];
    var capturedObj;
    var testTransformArgumentsDeep = function(key, value, obj) {
      equal(key, expectedKeys[count], 'first argument');
      equal(value, expectedValues[count], 'second argument');
      capturedObj = obj;
      count++;
    }
    var result = run(Object, 'fromQueryString', ['foo[name]=bar&moo[]=beer', {transform:testTransformArgumentsDeep}]);

    equal(capturedObj, result, 'third argument should be equal to the result');
    equal(count, 2, 'should have run twice');

    var onlyUserName = function(key) {
      if (key === 'user_name') {
        return 'Harry';
      }
    }
    test(Object, ['user_name=moo&user_id=12345', {transform:onlyUserName}], {user_name:'Harry',user_id:12345}, 'only user name');

    var numeralToBoolean = function(key, value) {
      if (value === '1' || value === '0') {
        return !!+value;
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


    var toArray = function(key, value, obj) {
      if (key === 'foo' && !obj[key]) {
        return [value];
      }
    }
    test(Object, ['foo=bar', {transform:toArray}], {'foo':['bar']}, 'single can still be converted to array with cast function');

  });

  method('keys', function() {

    var called = false;
    var fn = function(key, val) {
      equal(key, 'foo', 'First argument should be key');
      equal(val, 'bar', 'Second argument should be value');
      called = true;
    }
    run({foo:'bar'}, 'keys', [fn]);
    equal(called, true, 'Callback should have been called');

    // Issue #525
    var result = [{foo:'foo'},{bar:'bar'}].map(Sugar.Object.keys);
    equal(result, [['foo'],['bar']], 'non-function argument should not be called');

  });

  method('values', function() {

    test({foo:'bar'}, ['bar'], 'Values should be received');

    var called = false;
    var fn = function(key, val) {
      called = true;
    }
    var result = run({foo:'bar'}, 'values', [fn]);
    equal(called, true, 'Callback should have been called');

    // Issue #525
    var result = [{foo:'foo'},{bar:'bar'}].map(Sugar.Object.values);
    equal(result, [['foo'],['bar']], 'non-function argument should not be called');

  });

  method('invert', function() {

    assertIsHash(Sugar.Object.extended({foo:'bar'}).invert());

    testStaticAndInstance({foo:'bar'}, [], {bar:'foo'}, 'basic invert');
    testStaticAndInstance({foo:{bar:'baz'}}, [], {'[object Object]':'foo'}, 'deep objects are simply stringified');
    testStaticAndInstance({foo:['bar','baz']}, [], {'bar,baz':'foo'}, 'arrays are stringified');
    testStaticAndInstance({foo:1,bar:1}, [], {1:'bar'}, 'collisions are overwritten by default');
    testStaticAndInstance({length:15}, [], {15:'length'}, 'works with "length"');
    testStaticAndInstance({foo:1,bar:1}, [true], {1:['foo','bar']}, 'collisions allow multi with flag');

    var result = [{a:1},{b:2},{c:3}].map(Sugar.Object.invert);
    equal(result, [{1:'a'},{2:'b'},{3:'c'}], 'can be iterated with map');

  });

  method('isObject', function() {
    var Person = function() {};
    var p = new Person();

    test({}, true, '{}');
    test(run(Object, 'extended'), true, 'extended object');
    test(new Object({}), true, 'new Object()');
    test([], false, '[]');
    test(new Array(1,2,3), false, 'new Array(1,2,3)');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(null, false, 'null');
    test(undefined, false, 'undefined');
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
    test(null, false, 'null');
    test(undefined, false, 'undefined');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
  });

  method('isBoolean', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(null, false, 'null');
    test(undefined, false, 'undefined');
    test(NaN, false, 'NaN');
    test(false, true, 'false');
    test(true, true, 'true');
  });

  method('isDate', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), true, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(null, false, 'null');
    test(undefined, false, 'undefined');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
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
    test(null, false, 'null');
    test(undefined, false, 'undefined');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
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
    test(null, false, 'null');
    test(undefined, false, 'undefined');
    test(NaN, true, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
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
    test(null, false, 'null');
    test(undefined, false, 'undefined');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
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
    test(null, false, 'null');
    test(undefined, false, 'undefined');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
  });

  method('isNaN', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), false, 'new RegExp()');
    test(/afda/, false, '/afda/');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(new Function(), false, 'new Function()');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(null, false, 'null');
    test(undefined, false, 'undefined');
    test(NaN, true, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
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
    test(null, false, 'null');
    test(undefined, false, 'undefined');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test((function(){ return arguments; })(), true, 'arguments object with 0 length');
    test((function(){ return arguments; })(1,2,3), true, 'arguments object with 3 length');
  });

  group('Non-Shadowable Hashes', function() {

    var obj = {
      foo: 'bar',
      moo: 'car'
    }

    var hash = run(Object, 'extended', [obj, true]);

    equal('foo' in hash, false, 'Non-shadowable hash properties are not directly accessible');
    equal(hash.get('foo'), 'bar', 'Non-shadowable hash properties are accessible through get');

    hash.set('foo', 'baz');
    equal('foo' in hash, false, 'Non-shadowable hash properties are accessible after setting');
    equal(hash.get('foo'), 'baz', 'Non-shadowable hash retains set properties');

    var hash1 = run(Object, 'extended', [{foo:'bar'}, true]);
    var hash2 = run(Object, 'extended', [{foo:'bar'}, true]);
    equal(hash1.isEqual(hash2), true, 'Non-shadowable hashes are egal with equivalent non-shadowable');

    var hash1 = run(Object, 'extended', [{foo:'bar'}]);
    var hash2 = run(Object, 'extended', [{foo:'bar'}, true]);
    equal(hash1.isEqual(hash2), false, 'Regular hashes are not egal with non-shadowable');

    var hash1 = run(Object, 'extended', [{foo:'bar'}, true]);
    var hash2 = run(Object, 'extended', [{foo:'bar'}]);
    equal(hash1.isEqual(hash2), false, 'Non-shadowable are not egal with regular hashes');

    var hash1 = run(Object, 'extended', [{foo:'bar'}, true]);
    var hash2 = run(Object, 'extended', [{foo:'bar'}, true]);
    equal(run(hash, 'isEqual', [hash2]), true, 'Comparing non-shadowable hashes directly through Object.isEqual');

    var hash1 = run(Object, 'extended', [{foo:'foo'}]);
    var hash2 = run(Object, 'extended', [{bar:'bar'}]);
    var result = hash1.merge(hash2);
    equal(result.get('bar'), 'bar', 'regular hash merge produces hash');
    equal(result['bar'], 'bar', 'regular hash merge has public property "bar"');

    var hash1 = run(Object, 'extended', [{foo:'foo'}, true]);
    var hash2 = run(Object, 'extended', [{bar:'bar'}]);
    var result = hash1.merge(hash2);
    equal('foo' in result || 'bar' in result, false, 'non-shadowable with merged hash produces non-shadowable');
    equal(hash1.get('foo'), 'foo', 'non-shadowable with merged hash has original property');
    equal(hash1.get('bar'), 'bar', 'non-shadowable with merged hash has merged property');

    var hash1 = run(Object, 'extended', [{foo:'foo'}]);
    var hash2 = run(Object, 'extended', [{bar:'bar'}, true]);
    var result = hash1.merge(hash2);
    equal(hash1['foo'], 'foo', 'hash with merged non-shadowable has direct original property');
    equal(hash1['bar'], 'bar', 'hash with merged non-shadowable has direct merged property');

  });

  method('merge', function() {

    // Basic no-conflict merging

    testStaticAndInstance({a:'a'}, [{b:'b'}], {a:'a',b:'b'}, 'string');
    testStaticAndInstance({a:'a'}, [{b:8}], {a:'a',b:8}, 'number');
    testStaticAndInstance({a:'a'}, [{b:true}], {a:'a',b:true}, 'boolean');
    testStaticAndInstance({a:'a'}, [{b:null}], {a:'a',b:null}, 'null');
    testStaticAndInstance({a:'a'}, [{b:undefined}], {a:'a'}, 'undefined will not merge');
    testStaticAndInstance({a:'a'}, [{b:NaN}], {a:'a',b:NaN}, 'NaN');
    testStaticAndInstance({a:'a'}, [{b:Infinity}], {a:'a',b:Infinity}, 'NaN');

    testStaticAndInstance({a:'a'}, [{b:[1]}], {a:'a',b:[1]}, 'array');
    testStaticAndInstance({a:'a'}, [{b:{c:'c'}}], {a:'a',b:{c:'c'}}, 'object');

    testStaticAndInstance({a:'a'}, ['aha'], {a:'a',0:'a',1:'h',2:'a'}, 'string has enumerated properties');
    testStaticAndInstance({a:'a'}, [undefined], {a:'a'}, 'undefined has no properties');
    testStaticAndInstance({a:'a'}, [NaN], {a:'a'}, 'undefined has no properties');
    testStaticAndInstance({a:'a'}, [null], {a:'a'}, 'null has no properties');
    testStaticAndInstance({a:'a'}, [8], {a:'a'}, 'number has no properties');
    testStaticAndInstance({}, [{}], {}, 'empty object has no properties');

    // Merging with conflicts

    testStaticAndInstance({a:'a'}, [{a:'b'}], {a:'b'}, 'source should win by default');
    testStaticAndInstance({a:'a'}, [{a:null}], {a:null}, 'null wins');
    testStaticAndInstance({a:'a'}, [{a:false}], {a:false}, 'false wins');
    testStaticAndInstance({a:'a'}, [{a:''}], {a:''}, 'empty string wins');
    testStaticAndInstance({a:'a'}, [{a:[1]}], {a:[1]}, 'array wins');
    testStaticAndInstance({a:'a'}, [{a:{b:'b'}}], {a:{b:'b'}}, 'object wins');
    testStaticAndInstance({a:'a'}, [{a:undefined}], {a:'a'}, 'undefined does not win');

    testStaticAndInstance({a:[1]}, [{a:[2]}], {a:[2]}, 'deep source array wins');
    testStaticAndInstance({a:{b:'b'}}, [{a:{c:'c'}}], {a:{c:'c'}}, 'deep source object wins');

    testStaticAndInstance({a:undefined}, [{a:1}], {a:1}, 'target undefined, source wins');
    testStaticAndInstance({a:null}, [{a:1}], {a:1}, 'target null, source wins');
    testStaticAndInstance({a:false}, [{a:1}], {a:1}, 'target false, source wins');
    testStaticAndInstance({a:true}, [{a:1}], {a:1}, 'target true, source wins');
    testStaticAndInstance({a:''}, [{a:1}], {a:1}, 'target empty string, source wins');

    // Shallow merge, source wins

    var opts = { resolve: false };
    testStaticAndInstance({a:'a'}, [{a:'b'}, opts], {a:'a'}, 'target wins when resolve is false');
    testStaticAndInstance({a:undefined}, [{a:1}, opts], {a:1}, 'source wins when target is undefined');
    testStaticAndInstance({a:null}, [{a:1}, opts], {a:null}, 'target wins when null');
    testStaticAndInstance({a:false}, [{a:1}, opts], {a:false}, 'target wins when false');
    testStaticAndInstance({a:true}, [{a:1}, opts], {a:true}, 'target wins when true');
    testStaticAndInstance({a:''}, [{a:1}, opts], {a:''}, 'target wins when empty string');

    // Deep merge, target wins

    var opts = { deep: true };
    testStaticAndInstance({a:{b:'b'}}, [{a:{c:'c'}}, opts], {a:{b:'b',c:'c'}}, 'deeply merged');
    testStaticAndInstance({a:[1,2]}, [{a:['a']}, opts], {a:['a',2]}, 'array deeply merged');
    test([{a:'a'}], [[{b:'b'}], opts], [{a:'a',b:'b'}], 'objects in arrays deeply merged');

    // Internal object-types

    var d1 = new Date(2015, 9, 13);
    var d2 = new Date(2015, 9, 14);

    var result = run(testClone(d1), 'merge', [testClone(d2)]);
    equal(result, d2, 'should merge one date into another');
    equal(result === d2, false, 'result of date merge should not be the same object');

    var d = testClone(d1);
    var result = run(d, 'merge', [testClone(d2),{resolve:false}]);
    equal(result === d, true, 'resolve false date should be original date object');
    equal(result.getTime() === d1.getTime(), true, 'resolve false date merge should be untouched');

    var obj1 = { d: testClone(d1) };
    var obj2 = { d: testClone(d2) };
    var result = run(obj1, 'merge', [obj2]);
    equal(result.d, d2, 'dates in non-deep merge should be equal by reference');

    var obj1 = { d: testClone(d1) };
    var obj2 = { d: testClone(d2) };
    var result = run(obj1, 'merge', [obj2,{deep:true}]);
    equal(result.d === d2, false, 'dates in deep merge should not be equal by reference');
    equal(result.d.getTime(), obj2.d.getTime(), 'Conflicted deep date should have time value of source');

    var obj1 = { d: testClone(d1) };
    var obj2 = { d: testClone(d2) };
    var result = run(obj1, 'merge', [obj2,{deep:true,resolve:false}]);
    equal(result.d === obj1.d, true, 'deep merged resolve false date should be original date object');
    equal(result.d.getTime() === d1.getTime(), true, 'deep merged resolve false date merge should be untouched');

    var r1 = /foo/gi;
    var r2 = /bar/gi;

    var obj1 = { r: r1 };
    var obj2 = { r: r2 };
    var result = run(obj1, 'merge', [obj2]);
    equal(result.r, r2, 'regexes in non-deep merge should be equal by reference');

    var obj1 = { r: r1 };
    var obj2 = { r: r2 };
    var result = run(obj1, 'merge', [obj2, {deep:true}]);
    equal(result.r === r2, true, 'regexes in deep merge conflict should be overwritten by reference');

    var obj1 = { r: r1 };
    var obj2 = { r: r2 };
    var opts = { deep: true, resolve: false };
    var result = run(obj1, 'merge', [obj2, opts]);
    equal(result.r === r1, true, 'regex in deep merge conflict resolve false should be original regex');


    // Merging functions

    var fn = function() {};
    fn.foo = 'bar';
    var opts = {};
    var result = run(function(){}, 'merge', [fn, opts])
    equal(result.foo, 'bar', 'functions properties are merged');

    var opts = { deep: true };
    var result = run({}, 'merge', [{a:{b:fn}}, opts])
    equal(result.a.b === fn, true, 'functions are not deep merged');
    equal(result.a.b.foo, 'bar', 'function property exists in merged object');


    // Merging nested functions

    var fn1 = function() {
      return 'a';
    };
    fn1.foo = 'a';
    var fn2 = function() {
      return 'b';
    };
    fn2.foo = 'b';
    var obj1 = { fn: fn1 };
    var obj2 = { fn: fn2 };
    var result = run(obj1, 'merge', [obj2, { deep: true }]);
    equal(result.fn(), 'b', 'override merge should choose function b');
    equal(result.fn.foo, 'b', 'override merge should choose function b | fn property');


    var fn1 = function() {
      return 'a';
    };
    fn1.foo = 'a';
    var fn2 = function() {
      return 'b';
    };
    fn2.foo = 'b';
    var obj1 = { fn: fn1 };
    var obj2 = { fn: fn2 };
    var result = run(obj1, 'merge', [obj2, { resolve: false }]);
    equal(result.fn(), 'a', 'non-override merge should choose function a');
    equal(result.fn.foo, 'a', 'non-override merge should choose function a | fn property');


    // Resolve functions

    var fn = function(key, a, b, target, source) {
      equal(key, 'count', 'First argument should be the key');
      equal(a, undefined, 'Second argument should be the target value');
      equal(b, 5, 'Third argument should be the source value');
      equal(target, {}, 'Fourth argument should be the target');
      equal(source, {count:5}, 'Fifth argument should be the source');
      equal(this, nullScope, 'No scope is set by default');
      return b * 2;
    }
    var opts = { resolve: fn };
    testStaticAndInstance({}, [{count:5}, opts], {count:10}, 'custom function is respected');

    var fn = function(key, a, b) { return a + b; };
    var opts = { resolve: fn };
    testStaticAndInstance({a:1}, [{a:2}, opts], {a:3}, 'custom function adds properties together');

    var fn = function(key, a, b) { return 0; };
    var opts = { resolve: fn };
    testStaticAndInstance({a:{b:'b'}}, [{a:{b:'c'}}, opts], {a:0}, '0 is respected as a return value');

    var fn = function(key, a, b) { return null; };
    var opts = { resolve: fn };
    testStaticAndInstance({a:{b:'b'}}, [{a:{b:'c'}}, opts], {a:null}, 'null is respected as a return value');

    var fn = function(key, a, b) { return undefined; };
    var opts = { resolve: fn };
    testStaticAndInstance({}, [{a:'a',b:'b'}, opts], {}, 'returning undefined means no properties are merged');

    var fn = function(key, a, b) { return a.concat(b); };
    var opts = { resolve: fn };
    testStaticAndInstance({a:[1]}, [{a:[2]}, opts], {a:[1,2]}, 'custom function concats arrays');

    var fn = function(key, a, b) {
      if (a && a.length && b && b.length) {
        return a.concat(b);
      }
    };
    var opts = { resolve: fn };
    testStaticAndInstance({a:[1]}, [{a:[2],b:'b'}, opts], {a:[1,2]}, 'property is not merged if custom function returns undefined');

    var count = 0;
    var obj = {a:{a:{a:'a'}}};
    var fn = function(prop, a1, a2) {
      count++;
      return 1;
    }
    var opts = { deep: true, resolve: fn };
    var result = run({}, 'merge', [obj, opts]);
    equal(count, 1, 'resolve function should have been called once');
    equal(result, {a:1}, 'returning defined value in resolve function should not traverse further into that object');


    var obj1 = {a:{b:{c:{one:5,two:10}}}};
    var obj2 = {a:{b:{c:{one:7,three:9}}}};
    var expected = {a:{b:{c:{one:12,two:10,three:9}}}};
    var fn = function(prop, a, b) {
      if (typeof a === 'number' || typeof b === 'number') {
        return (a || 0) + (b || 0);
      }
      return Sugar;
    }
    var opts = { deep: true, resolve: fn };
    testStaticAndInstance(obj1, [obj2, opts], expected, 'continue on if the resolve function returns the Sugar global');


    if (definePropertySupport) {

      // Merging by descriptor

      var opts = { descriptor: true };
      var obj = getAccessorObject();
      var result = run({}, 'merge', [obj]);
      result.data.label = 'bar';
      equal(result.label, 'foo', 'basic merge does not support property descriptors');

      var opts = { descriptor: true };
      var obj = getAccessorObject();
      var result = run({}, 'merge',  [obj, opts]);
      result.data.label = 'bar';
      equal(result.label, 'bar', 'property getter merged');
      result.label = 'car';
      equal(result.data.label, 'car', 'property setter merged');

      var opts = { deep: true, descriptor: true };
      var obj = { foo: getAccessorObject() }
      var result = run({}, 'merge',  [obj, opts]);
      equal(result.foo !== obj.foo, true, 'object was deeply merged');
      result.foo.label = 'bar';
      equal(result.foo.data.label, 'bar', 'deep property setter merged');

      var opts = { hidden: true };
      var obj1 = [1,2,3,4];
      var obj2 = [1,2,3];
      var result = run(obj1, 'merge',  [obj2, opts]);
      equal(result, [1,2,3], 'merging non-enumerable properties includes array.length');

      var opts = { hidden: true, deep: true };
      var obj1 = { foo: [1,2,3,4] };
      var obj2 = { foo: [1,2,3] };
      var result = run(obj1, 'merge',  [obj2, opts]);
      equal(result.foo, [1,2,3], 'deep merging non-enumerable properties includes array.length');

      // Non-enumerated properties

      var obj = getDescriptorObject();
      var result = run({}, 'merge',  [obj]);
      equal(result.foo, undefined, 'default non-enumerable property is not merged');

      var opts = { hidden: true };
      var obj = getDescriptorObject();
      var result = run({}, 'merge',  [obj, opts]);
      equal(result.foo, 'bar', 'non-enumerable property merged with hidden flag on');

      var opts = { hidden: true };
      var obj = {
        yo: getDescriptorObject()
      }
      var result = run({}, 'merge',  [obj, opts]);
      equal(result.yo.foo, 'bar', 'deep non-enumerable property merged with hidden flag on');

      var opts = { descriptor: true, hidden: true };
      var obj = getDescriptorObject();
      var result = run({}, 'merge',  [obj, opts]);
      raisesError(function() { result.foo = 'moo'; }, 're-assignment of non-writable property raises error');

      var obj1 = getDescriptorObject();
      var obj2 = { foo: 'bar' }
      raisesError(function() { run(obj1, 'merge',  [obj2]); }, 'merging into read-only property raises error');

    }

    // Non-standard merges

    test(undefined, ['b'], 'b', 'merge string into undefined');
    test(undefined, [{a:'a'}], {a:'a'}, 'merge object into undefined');
    test(null, ['b'], 'b', 'merge string into null');
    test(null, [{a:'a'}], {a:'a'}, 'merge object into null');
    test('a', ['b'], 'b', 'merge string into string');
    test('a', [{a:'a'}], {a:'a'}, 'merge object into string');
    test(0, ['b'], 'b', 'merge string into 0');
    test(0, [{a:'a'}], {a:'a'}, 'merge object into 0');
    test([1,2,3,4], [[4,5,6]], [4,5,6,4], 'two arrays');

    var a = [1];
    a.b = 'b';
    testStaticAndInstance({a:[1]}, [{a:{b:'b'}}, {deep:true}], {a:a}, 'mis-matched object types do not make an effort to override');

    var obj = {a:'a'};
    testStaticAndInstance({one:obj}, [{one:obj}], {one:obj}, 'should handle identical object conflicts');

    if (Object.create) {
      var obj = Object.create({ bar: 3 }, {
        foo: {
          value: 4,
          enumerable: true
        }
      });
      testStaticAndInstance({}, [obj], {foo:4}, 'should not merge inherited properties');
      testStaticAndInstance({}, [obj, {deep:true}], {foo:4}, 'should not merge deep inherited properties');
    }

    var Foo = function() {};
    raisesError(function(){ run({}, 'merge', [{x: new Foo}, {deep:true}]); }, 'should raise an error if clone is not a basic object type');

    var fn = function(key, a, b) {
      if (b instanceof Foo) {
        return b;
      }
      return Sugar;
    }
    var f = new Foo;
    var obj = {
      a: 'a',
      b: 'b',
      f: f
    }
    var opts = { deep: true, resolve: fn };
    testStaticAndInstance({}, [obj, opts], {a:'a',b:'b',f:f}, 'instead a resolve function can be passed to handle such cases');

    var Foo = function() {};
    Foo.prototype.bar = 3;
    testStaticAndInstance({}, [new Foo], {}, 'properties on the prototype are not merged');

    // Exceeding maximum call stack takes time so disable this on normal runs.
    // var a = {};
    // a.a = a;
    // var opts = { deep: true };
    // raisesError(function() { run({}, 'merge', [a, opts]); }, 'does not work on cyclical objects', RangeError);

    // Deep hashes
    var obj = {a:Sugar.Object.extended({foo:'bar'})};
    var result = run({}, 'merge', [obj, {deep:true}])
    assertIsHash(result.a);
    equal(result.a.foo, 'bar', 'deep merged hash has foo property');

    // Deep hashes
    var obj = {a:Sugar.Object.extended({foo:'bar'}, true)};
    var result = run({}, 'merge', [obj, {deep:true}])
    equal(result.a.get('foo'), 'bar', 'deep merged non-shadowable has foo property');

    // Complex

    var fn1 = function() { return 'joe' };
    var fn2 = function() { return 'moe' };
    var date1 = new Date(2001, 1, 6);
    var date2 = new Date(2005, 1, 6);
    var inner1 = { foo: 'bar', hee: 'haw' }
    var inner2 = { foo: 'car', mee: 'maw' }

    var obj1 = {
      str: 'oolala',
      num: 18,
      fn: fn1,
      date: date1,
      prop1: 'next',
      inner: inner1,
      arr: [1,2,3,4]
    }

    var obj2 = {
      str: 'foofy',
      num: 67,
      fn: fn2,
      date: date2,
      prop2: 'beebop',
      inner: inner2,
      arr: [4,5,6]
    }

    var fn = function(key, a, b) {
      if (key == 'str') {
        return 'conflict!';
      } else if (key == 'num') {
        return a + b;
      } else {
        return b;
      }
    }

    var expected = {
      str: 'conflict!',
      num: 85,
      fn: fn2,
      date: date2,
      prop1: 'next',
      prop2: 'beebop',
      inner: {
        foo: 'car',
        mee: 'maw'
      },
      arr: [4,5,6]
    }

    var opts = { deep: true, resolve: fn };
    testStaticAndInstance(obj1, [obj2, opts], expected, 'complex objects with resolve function');
    equal(obj1.fn(), 'moe', 'fn conflict resolved');
    equal(obj1.date.getTime(), new Date(2005, 1, 6).getTime(), 'date conflict resolved');


    var deepObject1 = {
      user: {
        firstName: 'Darth',
        lastName: 'Vader',
        helmetSize: 22,
        likes: 2
      }
    }

    var deepObject2 = {
      user: {
        firstName: 'Luke',
        lastName: 'Skywalker',
        handSize: 15,
        likes: 4
      }
    }

    var expectedDeepSourceWins = {
      user: {
        firstName: 'Luke',
        lastName: 'Skywalker',
        helmetSize: 22,
        handSize: 15,
        likes: 4
      }
    }

    var expectedDeepTargetWins = {
      user: {
        firstName: 'Darth',
        lastName: 'Vader',
        helmetSize: 22,
        handSize: 15,
        likes: 2
      }
    }

    var expectedDeepCombinator = {
      user: {
        firstName: 'Luke',
        lastName: 'Skywalker',
        helmetSize: 22,
        handSize: 15,
        likes: 6
      }
    }

    var expectedDeepConservativeCombinator = {
      user: {
        firstName: 'Darth',
        lastName: 'Vader',
        helmetSize: 22,
        handSize: 15,
        likes: 6
      }
    }

    var combinator = function(key, targetVal, sourceVal) {
      if (key === 'likes') {
        return targetVal + sourceVal;
      }
      return Sugar;
    }

    var conservativeCombinator = function(key, targetVal, sourceVal) {
      if (key === 'likes') {
        // Merge "likes" by adding them together.
        return targetVal + sourceVal;
      } else if (typeof targetVal === 'object') {
        // Allow Sugar to handle any deep merges.
        return Sugar;
      }
      // Otherwise preserve the targets properties if they exist.
      return targetVal || sourceVal;
    }

    testStaticAndInstance(testClone(deepObject1), [deepObject2], deepObject2, 'standard shallow merge produces source');

    var opts = { resolve: false };
    testStaticAndInstance(testClone(deepObject1), [deepObject2, opts], deepObject1, 'standard shallow merge with resolve: false produces target');

    var opts = { deep: true };
    testStaticAndInstance(testClone(deepObject1), [deepObject2, opts], expectedDeepSourceWins, 'deep merge | source wins');

    var opts = { deep: true, resolve: false };
    testStaticAndInstance(testClone(deepObject1), [deepObject2, opts], expectedDeepTargetWins, 'deep merge | target wins');

    var opts = { deep: true, resolve: combinator };
    testStaticAndInstance(testClone(deepObject1), [deepObject2, opts], expectedDeepCombinator, 'deep merge | combinator function');

    var opts = { deep: true, resolve: conservativeCombinator };
    testStaticAndInstance(testClone(deepObject1), [deepObject2, opts], expectedDeepConservativeCombinator, 'deep merge | conservative combinator function');


    // DontEnum bug in < IE9

    var obj = {toString: function() { return 'foo!'; }};

    var result = run({}, 'merge', [obj]);
    equal(result.toString(), 'foo!', 'dont enum bug');

    var hash = run(Object, 'extended', []);
    var result = hash.merge(obj);
    equal(result.toString(), 'foo!', 'dont enum bug | extended');

    // Issue #335

    var opts = { deep: true, resolve: false };
    testStaticAndInstance({a:{b:1}}, [{a:{b:2,c:3} }, opts], {a:{b:1,c:3}}, 'two deep properties');

    // Issue #365 Object.merge can skip when source is object and target is not.

    var opts = { deep: true };
    test({a:''}, [{a:{b:1}}, opts], {a:{b:1}}, 'source object wins with empty string');
    test({a:'1'}, [{a:{b:1}}, opts], {a:{b:1}}, 'source object wins with number as string');

  });

  method('add', function() {

    var obj = {foo:'foo'};
    var result = run(obj, 'add', [{bar:'bar'}]);
    equal(result, {foo:'foo',bar:'bar'}, 'Objects added together');
    equal(obj, {foo:'foo'}, 'Original object is unchanged');

    // Basic no-conflict merging

    testStaticAndInstance({a:'a'}, [{b:'b'}], {a:'a',b:'b'}, 'string');
    testStaticAndInstance({a:'a'}, [{b:8}], {a:'a',b:8}, 'number');
    testStaticAndInstance({a:'a'}, [{b:true}], {a:'a',b:true}, 'boolean');
    testStaticAndInstance({a:'a'}, [{b:null}], {a:'a',b:null}, 'null');
    testStaticAndInstance({a:'a'}, [{b:undefined}], {a:'a'}, 'undefined will not merge');
    testStaticAndInstance({a:'a'}, [{b:NaN}], {a:'a',b:NaN}, 'NaN');
    testStaticAndInstance({a:'a'}, [{b:Infinity}], {a:'a',b:Infinity}, 'NaN');

    testStaticAndInstance({a:'a'}, [{b:[1]}], {a:'a',b:[1]}, 'array');
    testStaticAndInstance({a:'a'}, [{b:{c:'c'}}], {a:'a',b:{c:'c'}}, 'object');

    testStaticAndInstance({a:'a'}, ['aha'], {a:'a',0:'a',1:'h',2:'a'}, 'string has enumerated properties');
    testStaticAndInstance({a:'a'}, [undefined], {a:'a'}, 'undefined has no properties');
    testStaticAndInstance({a:'a'}, [NaN], {a:'a'}, 'undefined has no properties');
    testStaticAndInstance({a:'a'}, [null], {a:'a'}, 'null has no properties');
    testStaticAndInstance({a:'a'}, [8], {a:'a'}, 'number has no properties');
    testStaticAndInstance({}, [{}], {}, 'empty object has no properties');

    // Merging with conflicts

    testStaticAndInstance({a:'a'}, [{a:'b'}], {a:'b'}, 'source should win by default');
    testStaticAndInstance({a:'a'}, [{a:null}], {a:null}, 'null wins');
    testStaticAndInstance({a:'a'}, [{a:false}], {a:false}, 'false wins');
    testStaticAndInstance({a:'a'}, [{a:''}], {a:''}, 'empty string wins');
    testStaticAndInstance({a:'a'}, [{a:[1]}], {a:[1]}, 'array wins');
    testStaticAndInstance({a:'a'}, [{a:{b:'b'}}], {a:{b:'b'}}, 'object wins');
    testStaticAndInstance({a:'a'}, [{a:undefined}], {a:'a'}, 'undefined does not win');

    testStaticAndInstance({a:[1]}, [{a:[2]}], {a:[2]}, 'deep source array wins');
    testStaticAndInstance({a:{b:'b'}}, [{a:{c:'c'}}], {a:{c:'c'}}, 'deep source object wins');

    testStaticAndInstance({a:undefined}, [{a:1}], {a:1}, 'target undefined, source wins');
    testStaticAndInstance({a:null}, [{a:1}], {a:1}, 'target null, source wins');
    testStaticAndInstance({a:false}, [{a:1}], {a:1}, 'target false, source wins');
    testStaticAndInstance({a:true}, [{a:1}], {a:1}, 'target true, source wins');
    testStaticAndInstance({a:''}, [{a:1}], {a:1}, 'target empty string, source wins');

    // Shallow merge, source wins

    var opts = { resolve: false };
    testStaticAndInstance({a:'a'}, [{a:'b'}, opts], {a:'a'}, 'target wins when resolve is false');
    testStaticAndInstance({a:undefined}, [{a:1}, opts], {a:1}, 'source wins when target is undefined');
    testStaticAndInstance({a:null}, [{a:1}, opts], {a:null}, 'target wins when null');
    testStaticAndInstance({a:false}, [{a:1}, opts], {a:false}, 'target wins when false');
    testStaticAndInstance({a:true}, [{a:1}, opts], {a:true}, 'target wins when true');
    testStaticAndInstance({a:''}, [{a:1}, opts], {a:''}, 'target wins when empty string');

    // Deep merge, target wins

    var opts = { deep: true };
    testStaticAndInstance({a:{b:'b'}}, [{a:{c:'c'}}, opts], {a:{b:'b',c:'c'}}, 'deeply merged');
    testStaticAndInstance({a:[1,2]}, [{a:['a']}, opts], {a:['a',2]}, 'array deeply merged');
    test([{a:'a'}], [[{b:'b'}], opts], [{a:'a',b:'b'}], 'objects in arrays deeply merged');

    // Deferring more specific tests to Object.merge

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

    testStaticAndInstance({foo:undefined,bar:undefined}, [[{bar:3},{foo:1}]], {foo:1,bar:3}, 'overwrites undefined');
    testStaticAndInstance({foo:3}, [[{foo:4},{foo:5}]], {foo:5}, 'last wins');
    testStaticAndInstance({foo:3}, [[{foo:4},{bar:5}],{resolve:false}], {foo:3,bar:5}, 'used as defaults');

    var result = run({}, 'mergeAll', [[{one:obj1}],{deep:true}]);
    equal(result, {one:{a:'a'}}, true, 'object was merged');
    equal(result.one === obj1, false, 'object was deep merged');

    var fn = function(key, a, b) { return a + b; };
    testStaticAndInstance({a:1}, [[{a:2},{a:5},{a:8}],{resolve:fn}], {a:16}, 'custom resolver works on all merged objects');

    testStaticAndInstance({name:'Anonymous'}, [{name:'Frank'}], {name:'Frank'}, 'passing a single object should still work');

    if (definePropertySupport) {
      var obj1 = getAccessorObject('one');
      var obj2 = getAccessorObject('two');
      var result = run({}, 'mergeAll',  [[obj1, obj2], {descriptor:true}]);
      result.data.one = 'hoo';
      result.data.two = 'ha';
      equal(result.one + result.two, 'hooha', 'both descriptors were merged');

      var fn = function(key, a, b) { return (a || '') + b; };
      var obj1 = getDescriptorObject();
      var obj2 = getDescriptorObject();
      var obj3 = getDescriptorObject();
      testStaticAndInstance({}, [[obj1, obj2, obj3],{hidden:true,resolve:fn}],{foo:'barbarbar'}, 'can handle hidden properties');
    }

  });

  method('defaults', function() {

    function add(key, a, b) {
      return a + b;
    }

    testStaticAndInstance({id:999}, [{views:0}], {id:999,views:0}, 'simple defaults');
    testStaticAndInstance({id:999}, [{id:123}], {id:999}, 'does not overwrite');
    testStaticAndInstance({id:999}, [{id:123,views:0}], {id:999,views:0}, 'multiple properties single object');
    testStaticAndInstance({id:999}, [[{id:123},{views:0}]], {id:999,views:0}, 'single property multiple objects');

    testStaticAndInstance({id:null}, [{id:123}], {id:null}, 'does not overwrite null values');
    testStaticAndInstance({id:undefined}, [{id:123}], {id:123}, 'does overwrite undefined values');
    testStaticAndInstance({}, [{constructor:'foo'}], {constructor:'foo'}, 'does overwrite shadowed properties');

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

    testStaticAndInstance({id:999}, [{id:123},{resolve:add}], {id:1122}, 'can override resolver');


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

    testStaticAndInstance(testClone(user), [[userData1, userData2, userData3]], expectedShallow, 'complex | shallow');
    testStaticAndInstance(testClone(user), [[userData1, userData2, userData3],{deep:true}], expectedDeep, 'complex | deep');

  });

  method('clone', function() {

    test('hardy', [], 'hardy', 'clone on a string');
    test(undefined, [], undefined, 'clone on undefined');
    test(null, [], null, 'clone on null');
    test([1,2,3], [], [1,2,3], 'clone on arrays');
    test(['a','b','c'], [], ['a','b','c'], 'clone on array of strings');

    testStaticAndInstance({a:'a'}, [], {a:'a'}, 'basic clone');
    testStaticAndInstance({a:'a',b:1,c:null}, [], {a:'a',b:1,c:null}, 'multiple clone');
    testStaticAndInstance({a:{b:'b'}}, [], {a:{b:'b'}}, 'deep clone');

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


    var obj1, obj2, obj3;

    obj1 = run(Object, 'extended', [{
      broken: 'wear',
      foo: {
        jumpy: 'jump',
        bucket: {
          reverse: true
        }
      }
    }]);
    obj2 = obj1.clone();
    obj3 = obj1.clone(true);

    equal(obj1.foo.jumpy, 'jump', 'extended | cloned object has nested attribute');
    obj1.foo.jumpy = 'hump';
    equal(obj1.foo.jumpy, 'hump', 'extended | original object is modified');
    equal(obj2.foo.jumpy, 'hump', 'extended | clone is shallow');
    equal(obj3.foo.jumpy, 'jump', 'extended | clone is deep');
    equal(obj2.keys().sort(), ['broken','foo'], 'extended | cloned objects are themselves extended');

    obj1 = run(Object, 'extended', [{
      foo: {
        bar: [1,2,3]
      }
    }]);
    obj2 = obj1.clone();
    obj3 = obj1.clone(true);

    obj1.foo.bar[1] = 'b';
    equal(obj1.foo.bar, [1,'b',3], 'extended | original object is modified');
    equal(obj3.foo.bar, [1,2,3], 'extended | cloned object is not modified');

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

    if (definePropertySupport) {
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
    if (Sugar.Date.clone) {
      var date = Sugar.Date.setUTC(new Date(), true);
      equal(testIsUTC(date), true, 'utc flag is set');
      equal(testIsUTC(run(date, 'clone', [])), true, 'should preserve utc flag when set');
    }

  });

  method('isEqual', function() {

    test({ broken: 'wear' }, [{ broken: 'wear' }], true, 'objects are equal');
    test({ broken: 'wear' }, [{ broken: 'jumpy' }], false, 'objects are not equal');
    test({}, [{}], true, 'empty objects are equal');
    test({}, [{ broken: 'wear' }], false, '1st empty');
    test({ broken: 'wear' }, [{}], false, '2nd empty');

    test({x:1,y:undefined}, [{x:1,z:2}], false, 'undefined keys');

    var obj = run(Object, 'extended', [{ broken: 'wear' }]);
    equal(obj.isEqual({ broken: 'wear' }), false, 'extended are not egal with plain objects');

    var obj = run(Object, 'extended', []);
    equal(obj.isEqual({}), false, 'extended plain objects are not egal with plain objects');

    var obj1 = {foo:'bar'};
    test({a:obj1,b:obj1}, [{a:obj1,b:obj1}], true, 'multiple references will not choke');

    var obj1 = { foo: 'bar' };
    obj1.moo = obj1;
    test(obj1, [{foo:'bar',moo:obj1}], true, 'cyclical references handled');
    test(undefined, ['one'], false, 'string to undefined');

    if (typeof Set !== 'undefined') {
      var set = testGetSet;
      test(set(), [set()], true, 'set | empty sets are equal');
      test(set(), [set(1)], false, 'set | empty set vs 1 item');
      test(set('a'), [set('a')], true, 'set | same strings are equal');
      test(set('a'), [set('b')], false, 'set | different strings are not equal');
      test(set(1,2,3,4), [set(1,2,3,4)], true, 'set | sets are equal');
      test(set(1,2,3,4), [set(1,2,3)], false, 'set | 4 vs 3');
      test(set(1,2,3), [set(1,2,3,4)], false, 'set | 3 vs 4');

      var obj = {foo:'bar'};
      test(set(obj), [set(obj)], true, 'set | can have deep structures');
      test(set(obj,'a'), [set(obj, 'a')], true, 'set | deep with same string');
      test(set(obj,'b'), [set(obj, 'a')], false, 'set | deep with different string');

      test(set(), ['a'], false, 'set | set vs primitive');
      test('a', [set()], false, 'set | primitive vs set');

      var s1 = set(1);
      var s2 = set(s1);
      test(s2, [s2], true, 'set | can handle cyclic structures');
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

  method('has', function() {
    test({ foo: 'bar' }, ['foo'], true, 'finds a property');
    test({ foo: 'bar' }, ['baz'], false, 'does not find a nonexistant property');
    test({ hasOwnProperty: true, foo: 'bar' }, ['foo'], true, 'local hasOwnProperty is ignored');
  });

  method('toQueryString', function() {

    var date = new Date(2012, 8, 25);

    function getExpected(str) {
      return str.replace(/\[/g, '%5B').replace(/\]/g, '%5D');
    }

    function assertQueryString(obj, args, expected, message, skipHash) {
      if (skipHash) {
        test(obj, args, getExpected(expected), message);
      } else {
        testStaticAndInstance(obj, args, getExpected(expected), message);
      }
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

    // Directly using arrays so can't go through extended objects here.

    assertQueryString(['a','b','c'], [], 'a&b&c', 'straight array no prefix', true);
    assertQueryString(['a','b','c'], [], 'a&b&c', 'array', true);
    assertQueryString([{a:'b'},{c:'d'}], [], 'a=b&c=d', 'objects in array', true);
    assertQueryString(['a','b','c'], [{deep:true}], 'a&b&c', 'deep | array', true);
    assertQueryString([{a:'b'},{c:'d'}], [{deep:true}], 'a=b&c=d', 'deep | objects in array', true);
    assertQueryString(['Rails', 'coding'], [{prefix:'hobbies'}], 'hobbies=Rails&hobbies=coding', 'ActiveSupport example no brackets', true);
    assertQueryString(['Rails', 'coding'], [{deep:true,prefix:'hobbies'}], 'hobbies[]=Rails&hobbies[]=coding', 'ActiveSupport example with brackets', true);

    var booleanToNumber = function(key, val) {
      return typeof val === 'boolean' ? +val : val;
    }
    assertQueryString({a:true,b:'b',c:false}, [{transform:booleanToNumber}], 'a=1&b=b&c=0', 'values can be overridden with transform');
    assertQueryString({foo:{a:true,b:'b',c:false}}, [{deep:true,transform:booleanToNumber}], 'foo[a]=1&foo[b]=b&foo[c]=0', 'deep values can be overridden with transform');

    var testTransformArguments = function(key, value) {
      equal(key, 'foo', 'first argument should be the key');
      equal(value, 'bar', 'second argument should be the value');
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

  method('remove', function() {

    var obj = {foo:1,bar:2};
    var result = run(obj, 'remove', [1]);
    equal(obj, {bar:2}, 'Property should have been deleted');
    equal(result === obj, true, 'Should have returned the object');

    testStaticAndInstance({a:'a'}, [], {a:'a'}, 'no argument should do nothing');
    testStaticAndInstance({one:'a',two:'a'}, ['a'], {}, 'should remove multiple');

    var obj = {a:1,b:2,c:3,d:4,e:5};
    var fn = function(key, val, o) {
      return val % 2 === 0;
    }
    testStaticAndInstance(obj, [fn], {a:1,c:3,e:5}, 'allows function matcher');

    var obj = {a:1};
    var fn = function(key, val, o) {
      equal(key, 'a', 'first param should be the key');
      equal(val, 1, 'second param should be value');
      equal(o, obj, 'third param should be the object');
    }
    run(obj, 'remove', [fn]);

    var fn = function() {};
    testStaticAndInstance({foo:fn}, [fn], {}, 'can remove by reference');

    var obj = {a:['a','b'],b:['b','c']};
    testStaticAndInstance(obj, [['a','b']], {b:['b','c']}, 'allows nested arrays as equal match');

    var obj = {foo:{a:'a'},bar:{a:'z'}};
    testStaticAndInstance(obj, [{a:/[a-f]/}], {bar:{a:'z'}}, 'allows nested fuzzy matchers');

  });

  method('exclude', function() {

    var obj = {foo:1,bar:2};
    var result = run(obj, 'exclude', [1]);
    equal(obj, {foo:1,bar:2}, 'Original object should be untouched');
    equal(result, {bar:2}, 'Property should have been deleted');

    testStaticAndInstance({a:'a'}, [], {a:'a'}, 'no argument should do nothing');
    testStaticAndInstance({one:'a',two:'a'}, ['a'], {}, 'should remove multiple');

    var obj = {a:1,b:2,c:3,d:4,e:5};
    var fn = function(key, val, o) {
      return val % 2 === 0;
    }
    testStaticAndInstance(obj, [fn], {a:1,c:3,e:5}, 'allows function matcher');

    var obj = {a:1};
    var fn = function(key, val, o) {
      equal(key, 'a', 'first param should be the key');
      equal(val, 1, 'second param should be value');
      equal(o, obj, 'third param should be the object');
    }
    run(obj, 'exclude', [fn]);

    var fn = function() {};
    testStaticAndInstance({foo:fn}, [fn], {}, 'can remove by reference');

    var obj = {a:['a','b'],b:['b','c']};
    testStaticAndInstance(obj, [['a','b']], {b:['b','c']}, 'allows nested arrays as equal match');

    var obj = {foo:{a:'a'},bar:{a:'z'}};
    testStaticAndInstance(obj, [{a:/[a-f]/}], {bar:{a:'z'}}, 'allows nested fuzzy matchers');

  });

  method('intersect', function() {
    testStaticAndInstance({foo:'bar',moo:'car'}, [{foo:'bar',moo:'mar'}], {foo:'bar'}, 'One key');
    testStaticAndInstance({foo:'bar',moo:'car'}, [{foo:'bar',moo:'car'}], {foo:'bar',moo:'car'}, 'Both keys');
    testStaticAndInstance({foo:'bar',moo:'car'}, [{foo:'zar',moo:'zar'}], {}, 'No keys');
    testStaticAndInstance({a:{foo:'bar'}}, [{a:{foo:'bar'}}], {a:{foo:'bar'}}, 'Deep object matches');
    testStaticAndInstance({a:{foo:'bar'}}, [{a:{}}], {}, 'Empty deep object does not match');
    testStaticAndInstance({a:{foo:'bar'}}, [{a:{foo:'bar',moo:'car'}}], {}, 'Deep object with extra does not match');
    testStaticAndInstance({}, [{}], {}, 'Two empty produce empty');
    testStaticAndInstance({foo:'bar',moo:'car'}, [], {}, 'No arguments produces empty');
    test('foo', [], {}, 'no argument on primitive produces empty');
    test('foo', ['str'], {}, 'primitive on primitive produces empty');
    test('foo', [null], {}, 'null on primitive produces empty');
    test('foo', [undefined], {}, 'undefined on primitive produces empty');
    test(null, [{foo:'bar'}], {}, 'object on null produces empty');
    test('foo', [{foo:'bar'}], {}, 'object on primitive produces empty');
  });

  method('subtract', function() {
    testStaticAndInstance({foo:'bar',moo:'car'}, [{foo:'bar',moo:'mar'}], {moo:'car'}, 'One key');
    testStaticAndInstance({foo:'bar',moo:'car'}, [{foo:'bar',moo:'car'}], {}, 'Both keys');
    testStaticAndInstance({foo:'bar',moo:'car'}, [{foo:'zar',moo:'zar'}], {foo:'bar',moo:'car'}, 'No keys');
    testStaticAndInstance({a:{foo:'bar'}}, [{a:{foo:'bar'}}], {}, 'Deep object matches');
    testStaticAndInstance({a:{foo:'bar'}}, [{a:{}}], {a:{foo:'bar'}}, 'Empty deep object does not match');
    testStaticAndInstance({a:{foo:'bar'}}, [{a:{foo:'bar',moo:'car'}}], {a:{foo:'bar'}}, 'Deep object with extra does not match');
    testStaticAndInstance({}, [{}], {}, 'Two empty produce empty');
    testStaticAndInstance({foo:'bar',moo:'car'}, [], {foo:'bar',moo:'car'}, 'No arguments produces original');
    test('foo', [], 'foo', 'no argument on primitive produces original');
    test('foo', ['str'], 'foo', 'primitive on primitive produces original');
    test('foo', [null], 'foo', 'null on primitive produces original');
    test('foo', [undefined], 'foo', 'undefined on primitive produces original');
    test(null, [{foo:'bar'}], null, 'object on null produces null');
    test('foo', [{foo:'bar'}], 'foo', 'object on primitive produces empty');

    var obj = {foo:'bar'};
    var result = run(obj, 'subtract', []);
    equal(result === obj, false, 'No arguments still produces new object');
  });

  method('select', function() {

    var obj = {
      one:   1,
      two:   2,
      three: 3,
      four:  4,
      five:  5
    };

    var obj2 = { foo: obj };

    testStaticAndInstance(obj, ['one'], { one: 1 }, 'one key');
    testStaticAndInstance(obj, ['foo'], {}, 'nonexistent key');
    testStaticAndInstance(obj, ['one', 'two'], { one: 1 }, 'does not accept enumerated arguments');
    testStaticAndInstance(obj, [['four', 'two']], { two: 2, four: 4 }, 'accepts multiple from array');
    testStaticAndInstance(obj, [['one', 'foo']], { one: 1 }, 'one existing one non-existing');
    testStaticAndInstance(obj, [['four', 'two']], { two: 2, four: 4 }, 'keys out of order');
    testStaticAndInstance(obj, [/o/], { one: 1, two: 2, four: 4 }, 'regex');
    testStaticAndInstance(obj, [/o$/], { two: 2 }, 'regex $');
    testStaticAndInstance(obj, [/^o/], { one: 1 }, '^ regex');
    testStaticAndInstance(obj, [/z/], {}, 'non-matching regex');
    testStaticAndInstance(obj, [{one:1}], {one:1}, 'finding object keys');
    testStaticAndInstance(obj, [{one:'foo'}], {one:1}, 'should match if keys exist');
    testStaticAndInstance(obj, [{}], {}, 'empty object');
    testStaticAndInstance(obj, [[/^o/, /^f/]], { one: 1, four: 4, five: 5 }, 'complex nested array of regexes');

    testStaticAndInstance({a:1}, [{a:2}], {a:1}, 'selects keys in matcher object');
    testStaticAndInstance({a:1,b:2}, [{a:2}], {a:1}, 'does not select keys not in matcher');
    testStaticAndInstance({a:1}, [{a:2,b:3}], {a:1}, 'does not select keys not source');

    equal(run(obj2, 'select', ['foo']).foo, obj, 'selected values should be equal by reference');

    assertIsNotHash(run(obj, 'select', ['one']));
    assertIsNotHash(run(obj, 'select', [['two', 'three']]));

    withMethod('extended', function() {
      var obj3 = Sugar.Object.extended(obj);
      assertIsHash(obj3.select('one'));
    });

  });

  method('reject', function() {

    var obj = {
      one:    1,
      two:    2,
      three:  3,
      four:   4,
      five:   5
    };

    var obj2 = { foo: obj };

    testStaticAndInstance(obj, ['one'], { two: 2, three: 3, four: 4, five: 5 }, 'one key');
    testStaticAndInstance(obj, ['foo'], obj, 'nonexistent key');
    testStaticAndInstance(obj, ['one', 'two'], { two: 2, three: 3, four: 4, five: 5 }, 'does not accept enumerated arguments');
    testStaticAndInstance(obj, [['four', 'two']], { one: 1, three: 3, five: 5 }, 'accepts multiple from array');
    testStaticAndInstance(obj, [['one', 'foo']], { two: 2, three: 3, four: 4, five: 5 }, 'one existing one non-existing');
    testStaticAndInstance(obj, [['four', 'two']], { one: 1, three: 3, five: 5 }, 'keys out of order');
    testStaticAndInstance(obj, [/o/], { three: 3, five: 5 }, 'regex');
    testStaticAndInstance(obj, [/o$/], { one: 1, three: 3, four: 4, five: 5 }, 'regex $');
    testStaticAndInstance(obj, [/^o/], { two: 2, three: 3, four: 4, five: 5 }, '^ regex');
    testStaticAndInstance(obj, [/z/], obj, 'non-matching regex');
    testStaticAndInstance(obj, [{one:1}], {two:2,three:3,four:4,five:5}, 'rejects matching key');
    testStaticAndInstance(obj, [{one:'foo'}], {two:2,three:3,four:4,five:5}, 'rejects matching key with different value');
    testStaticAndInstance(obj, [{}], obj, 'empty object');
    testStaticAndInstance(obj, [[/^o/, /^f/]], { two: 2, three: 3 }, 'complex nested array of regexes');

    testStaticAndInstance({a:1}, [{a:2}], {}, 'rejects keys in matcher object');
    testStaticAndInstance({a:1}, [{b:2}], {a:1}, 'does not reject keys not in matcher');
    testStaticAndInstance({a:1}, [{b:1}], {a:1}, 'does not reject keys not source');

    equal(run(obj2, 'reject', ['moo']).foo, obj, 'rejected values should be equal by reference');
  });

  method('isEmpty', function() {

    testStaticAndInstance({}, [], true, 'object is empty');
    testStaticAndInstance({ broken: 'wear' }, [], false, 'object is not empty');
    testStaticAndInstance({ length: 0 }, [], false, 'simple object with length property is not empty');
    testStaticAndInstance({ foo: null }, [], false, 'null is still counted');
    testStaticAndInstance({ foo: undefined }, [], false, 'undefined is still counted');
    testStaticAndInstance({ foo: NaN }, [], false, 'undefined is still counted');
    testStaticAndInstance([], [], true, 'empty array is empty');
    testStaticAndInstance(null, [], true, 'null is empty');
    testStaticAndInstance(undefined, [], true, 'undefined is empty');
    testStaticAndInstance('', [], true, 'empty string is empty');
    testStaticAndInstance(new String(''), [], true, 'empty string object is empty');
    testStaticAndInstance('wasabi', [], false, 'non-empty string is not empty');
    testStaticAndInstance(new String('wasabi'), [], false, 'non-empty string object is not empty');
    testStaticAndInstance(NaN, [], true, 'NaN is empty');
    testStaticAndInstance(8, [], true, '8 is empty');
    testStaticAndInstance(new Number(8), [], true, '8 object is empty');

  });

  method('size', function() {

    testStaticAndInstance({}, [], 0, 'empty object');
    testStaticAndInstance({foo:'bar'}, [], 1, '1 property');
    testStaticAndInstance({foo:'bar',moo:'car'}, [], 2, '2 properties');
    testStaticAndInstance({foo:1}, [], 1, 'numbers');
    testStaticAndInstance({foo:/bar/}, [], 1, 'regexes');
    testStaticAndInstance({foo:function(){}}, [], 1, 'functions');
    testStaticAndInstance({foo:{bar:'car'}}, [], 1, 'nested object');
    testStaticAndInstance({foo:[1]}, [], 1, 'nested array');
    testStaticAndInstance(['a'], [], 1, 'array');
    testStaticAndInstance(['a','b'], [], 2, 'array 2 elements');
    testStaticAndInstance(['a','b','c'], [], 3, 'array 3 elements');
    testStaticAndInstance('foo', [], 3, 'string primitive');
    testStaticAndInstance(new String('foo'), [], 3, 'string object');
    testStaticAndInstance(1, [], 0, 'number primitive');
    testStaticAndInstance(new Number(1), [], 0, 'number object');
    testStaticAndInstance(true, [], 0, 'boolean primitive');
    testStaticAndInstance(new Boolean(true), [], 0, 'boolean object');
    testStaticAndInstance(null, [], 0, 'null');
    testStaticAndInstance(undefined, [], 0, 'undefined');

    var Foo = function(){};
    testStaticAndInstance(new Foo, [], 0, 'class instances');

    var Foo = function(a){ this.a = a; };
    testStaticAndInstance(new Foo, [], 1, 'class instances with a single property');

  });

});
