
// These tests also shamefully stolen from the Underscore.js test suite.
// Careful checks for cyclical references, equality between primitives and
// wrappers, and more. Sugar's callObjectEqual should now be considered "egal".

package('Object | Equality', function() {

  function callObjectEqual(a, b) {
    return run(Object, 'equal', arguments);
  }

  function First() {
    this.value = 1;
  }
  First.prototype.value = 1;

  function Second() {
    this.value = 1;
  }
  Second.prototype.value = 2;

  // Basic equality and identity comparisons.
  equal(callObjectEqual(null, null), true, "`null` is equal to `null`");
  equal(callObjectEqual(), true, "`undefined` is equal to `undefined`");

  equal(callObjectEqual(0, -0), false, "`0` is not equal to `-0`");
  equal(callObjectEqual(-0, 0), false, "Commutative equality is implemented for `0` and `-0`");

  equal(callObjectEqual(null, undefined), false, "`null` is not equal to `undefined`");
  equal(callObjectEqual(undefined, null), false, "Commutative equality is implemented for `null` and `undefined`");

  // String object and primitive comparisons.
  equal(callObjectEqual("Curly", "Curly"), true, "Identical string primitives are equal");
  equal(callObjectEqual(new String("Curly"), new String("Curly")), true, "String objects with identical primitive values are equal");

  equal(callObjectEqual("Curly", "Larry"), false, "String primitives with different values are not equal");
  equal(callObjectEqual(new String("Curly"), "Curly"), false, "String primitives and their corresponding object wrappers are not equal");
  equal(callObjectEqual("Curly", new String("Curly")), false, "Commutative equality is implemented for string objects and primitives");
  equal(callObjectEqual(new String("Curly"), new String("Larry")), false, "String objects with different primitive values are not equal");
  equal(callObjectEqual(new String("Curly"), {toString: function(){ return "Curly"; }}), false, "String objects and objects with a custom `toString` method are not equal");

  // Number object and primitive comparisons.
  equal(callObjectEqual(75, 75), true, "Identical number primitives are equal");
  equal(callObjectEqual(new Number(75), new Number(75)), true, "Number objects with identical primitive values are equal");

  equal(callObjectEqual(75, new Number(75)), false, "Number primitives and their corresponding object wrappers are not equal");
  equal(callObjectEqual(new Number(75), 75), false, "Commutative equality is implemented for number objects and primitives");
  equal(callObjectEqual(new Number(75), new Number(63)), false, "Number objects with different primitive values are not equal");
  equal(callObjectEqual(new Number(63), {valueOf: function(){ return 63; }}), false, "Number objects and objects with a `valueOf` method are not equal");


  // Comparisons involving `NaN`.
  equal(callObjectEqual(NaN, NaN), true, "`NaN` is equal to `NaN`");
  equal(callObjectEqual(61, NaN), false, "A number primitive is not equal to `NaN`");
  equal(callObjectEqual(new Number(79), NaN), false, "A number object is not equal to `NaN`");
  equal(callObjectEqual(Infinity, NaN), false, "`Infinity` is not equal to `NaN`");

  // Boolean object and primitive comparisons.
  equal(callObjectEqual(true, true), true, "Identical boolean primitives are equal");
  equal(callObjectEqual(new Boolean, new Boolean), true, "Boolean objects with identical primitive values are equal");
  equal(callObjectEqual(true, new Boolean(true)), false, "Boolean primitives and their corresponding object wrappers are not equal");
  equal(callObjectEqual(new Boolean(true), true), false, "Commutative equality is implemented for booleans");
  equal(callObjectEqual(new Boolean(true), new Boolean), false, "Boolean objects with different primitive values are not equal");

  // Common type coercions.
  equal(callObjectEqual(true, new Boolean(false)), false, "Boolean objects are not equal to the boolean primitive `true`");
  equal(callObjectEqual("75", 75), false, "String and number primitives with like values are not equal");
  equal(callObjectEqual(new Number(63), new String(63)), false, "String and number objects with like values are not equal");
  equal(callObjectEqual(75, "75"), false, "Commutative equality is implemented for like string and number values");
  equal(callObjectEqual(0, ""), false, "Number and string primitives with like values are not equal");
  equal(callObjectEqual(1, true), false, "Number and boolean primitives with like values are not equal");
  equal(callObjectEqual(new Boolean(false), new Number(0)), false, "Boolean and number objects with like values are not equal");
  equal(callObjectEqual(false, new String("")), false, "Boolean primitives and string objects with like values are not equal");
  equal(callObjectEqual(1256428800000, new Date(Date.UTC(2009, 9, 25))), false, "Dates and their corresponding numeric primitive values are not equal");

  // Dates.
  equal(callObjectEqual(new Date(2009, 9, 25), new Date(2009, 9, 25)), true, "Date objects referencing identical times are equal");
  equal(callObjectEqual(new Date(2009, 9, 25), new Date(2009, 9, 25, 0, 0, 0, 1)), false, "Date objects 1ms apart");
  equal(callObjectEqual(new Date(2009, 9, 25), new Date(2009, 11, 13)), false, "Date objects referencing different times are not equal");
  equal(callObjectEqual(new Date(2009, 11, 13), {
    getTime: function(){
      return 12606876e5;
    }
  }), false, "Date objects and objects with a `getTime` method are not equal");
  equal(callObjectEqual(new Date("Curly"), new Date("Curly")), true, "Invalid dates are equal");

  // Functions.
  equal(callObjectEqual(First, Second), false, "Different functions with identical bodies and source code representations are not equal");

  // RegExps.
  equal(callObjectEqual(/(?:)/gim, /(?:)/gim), true, "RegExps with equivalent patterns and flags are equal");
  equal(callObjectEqual(/(?:)/g, /(?:)/gi), false, "RegExps with equivalent patterns and different flags are not equal");
  equal(callObjectEqual(/Moe/gim, /Curly/gim), false, "RegExps with different patterns and equivalent flags are not equal");
  equal(callObjectEqual(/(?:)/gi, /(?:)/g), false, "Commutative equality is implemented for RegExps");
  equal(callObjectEqual(/Curly/g, {source: "Larry", global: true, ignoreCase: false, multiline: false}), false, "RegExps and RegExp-like objects are not equal");

  // Empty arrays, array-like objects, and object literals.
  equal(callObjectEqual({}, {}), true, "Empty object literals are equal");
  equal(callObjectEqual([], []), true, "Empty array literals are equal");
  equal(callObjectEqual([{}], [{}]), true, "Empty nested arrays and objects are equal");
  equal(callObjectEqual({length: 0}, []), false, "Array-like objects and arrays are not equal.");
  equal(callObjectEqual([], {length: 0}), false, "Commutative equality is implemented for array-like objects");

  equal(callObjectEqual({}, []), false, "Object literals and array literals are not equal");
  equal(callObjectEqual([], {}), false, "Commutative equality is implemented for objects and arrays");
  equal(callObjectEqual((function(){ return arguments; })(), (function(){ return arguments; })()), true, "Empty arguments objects are equal");

  // Arrays with primitive and object values.
  equal(callObjectEqual([1, true, "Larry", true], [1, true, "Larry", true]), true, "Arrays containing identical primitives are equal");
  equal(callObjectEqual([/Moe/g, new Date(2009, 9, 25)], [/Moe/g, new Date(2009, 9, 25)]), true, "Arrays containing equivalent elements are equal");

  // Multi-dimensional arrays.
  var a = [new Number(47), false, true, "Larry", /Moe/, new Date(2009, 11, 13), ['running', 'biking', new String('programming')], {a: 47}];
  var b = [new Number(47), false, true, "Larry", /Moe/, new Date(2009, 11, 13), ['running', 'biking', new String('programming')], {a: 47}];
  equal(callObjectEqual(a, b), true, "Arrays containing nested arrays and objects are recursively compared");

  // Overwrite the methods defined in ES 5.1 section 15.4.4.
  a.forEach = a.map = a.filter = a.every = a.indexOf = a.lastIndexOf = a.some = a.reduce = a.reduceRight = null;
  b.pop = b.reverse = b.shift = b.slice = b.splice = b.concat = b.sort = b.unshift = null;

  // Array elements and properties.
  equal(callObjectEqual(a, b), true, "Arrays containing equivalent elements and different non-numeric properties are equal");
  a.push("White Rocks");
  equal(callObjectEqual(a, b), false, "Arrays of different lengths are not equal");
  a.push("East Boulder");
  b.push("Gunbarrel Ranch", true, "Teller Farm");
  equal(callObjectEqual(a, b), false, "Arrays of identical lengths containing different elements are not equal");

  // Sparse arrays.
  equal(callObjectEqual(Array(3), Array(3)), true, "Sparse arrays of identical lengths are equal");
  equal(callObjectEqual(Array(3), Array(6)), false, "Sparse arrays of different lengths are not equal when both are empty");

  // According to the Microsoft deviations spec, section 2.1.26, JScript 5.x treats `undefined`
  // elements in arrays as elisions. Thus, sparse arrays and dense arrays containing `undefined`
  // values are equivalent.
  if (0 in [undefined]) {
    equal(callObjectEqual(Array(3), [undefined, undefined, undefined]), true, "Sparse and dense arrays are equal");
    equal(callObjectEqual([undefined, undefined, undefined], Array(3)), true, "Commutative equality is implemented for sparse and dense arrays");
  }

  // Simple objects.
  equal(callObjectEqual({a: "Curly", b: 1, c: true}, {a: "Curly", b: 1, c: true}), true, "Objects containing identical primitives are equal");
  equal(callObjectEqual({a: /Curly/g, b: new Date(2009, 11, 13)}, {a: /Curly/g, b: new Date(2009, 11, 13)}), true, "Objects containing equivalent members are equal");
  equal(callObjectEqual({a: 63, b: 75}, {a: 61, b: 55}), false, "Objects of identical sizes with different values are not equal");
  equal(callObjectEqual({a: 63, b: 75}, {a: 61, c: 55}), false, "Objects of identical sizes with different property names are not equal");
  equal(callObjectEqual({a: 1, b: 2}, {a: 1}), false, "Objects of different sizes are not equal");
  equal(callObjectEqual({a: 1}, {a: 1, b: 2}), false, "Commutative equality is implemented for objects");
  equal(callObjectEqual({x: 1, y: undefined}, {x: 1, z: 2}), false, "Objects with identical keys and different values are not equivalent");

  // `A` contains nested objects and arrays.
  a = {
    name: new String("Moe Howard"),
    age: new Number(77),
    stooge: true,
    hobbies: ["acting"],
    film: {
      name: "Sing a Song of Six Pants",
      release: new Date(1947, 9, 30),
      stars: [new String("Larry Fine"), true, "Shemp Howard"],
      minutes: new Number(16),
      seconds: 54
    }
  };

  // `B` contains equivalent nested objects and arrays.
  b = {
    name: new String("Moe Howard"),
    age: new Number(77),
    stooge: true,
    hobbies: ["acting"],
    film: {
      name: "Sing a Song of Six Pants",
      release: new Date(1947, 9, 30),
      stars: [new String("Larry Fine"), true, "Shemp Howard"],
      minutes: new Number(16),
      seconds: 54
    }
  };
  equal(callObjectEqual(a, b), true, "Objects with nested equivalent members are recursively compared");

  // Instances.
  equal(callObjectEqual(new First, new First), false, "Object instances are equal");
  equal(callObjectEqual(new First, new Second), false, "Objects with different constructors and identical own properties are not equal");
  equal(callObjectEqual({value: 1}, new First), false, "Object instances and objects sharing equivalent properties are not identical");
  equal(callObjectEqual({value: 2}, new Second), false, "The prototype chain of objects should not be examined");

  // Circular Arrays.
  (a = []).push(a);
  (b = []).push(b);
  equal(callObjectEqual(a, b), true, "Arrays containing circular references are equal");
  a.push(new String("Larry"));
  b.push(new String("Larry"));
  equal(callObjectEqual(a, b), true, "Arrays containing circular references and equivalent properties are equal");
  a.push("Shemp");
  b.push("Curly");
  equal(callObjectEqual(a, b), false, "Arrays containing circular references and different properties are not equal");

  // Circular Objects.
  a = {abc: null};
  b = {abc: null};
  a.abc = a;
  b.abc = b;
  equal(callObjectEqual(a, b), true, "Objects containing circular references are equal");
  a.def = 75;
  b.def = 75;
  equal(callObjectEqual(a, b), true, "Objects containing circular references and equivalent properties are equal");
  a.def = new Number(75);
  b.def = new Number(63);
  equal(callObjectEqual(a, b), false, "Objects containing circular references and different properties are not equal");

  // Cyclic Structures.
  a = [{abc: null}];
  b = [{abc: null}];
  (a[0].abc = a).push(a);
  (b[0].abc = b).push(b);
  equal(callObjectEqual(a, b), true, "Cyclic structures are equal");
  a[0].def = "Larry";
  b[0].def = "Larry";
  equal(callObjectEqual(a, b), true, "Cyclic structures containing equivalent properties are equal");
  a[0].def = new String("Larry");
  b[0].def = new String("Curly");
  equal(callObjectEqual(a, b), false, "Cyclic structures containing different properties are not equal");

  // Complex Circular References.
  a = {foo: {b: {foo: {c: {foo: null}}}}};
  b = {foo: {b: {foo: {c: {foo: null}}}}};
  a.foo.b.foo.c.foo = a;
  b.foo.b.foo.c.foo = b;
  equal(callObjectEqual(a, b), true, "Cyclic structures with nested and identically-named properties are equal");


  // Custom `isEqual` methods.
  var isEqualObj = {isEqual: function (o) { return o.isEqual == this.isEqual; }, unique: {}};
  var isEqualObjClone = {isEqual: isEqualObj.isEqual, unique: {}};

  equal(callObjectEqual(isEqualObj, isEqualObjClone), true, 'Both objects implement identical `isEqual` methods');
  equal(callObjectEqual(isEqualObjClone, isEqualObj), true, 'Commutative equality is implemented for objects with custom `isEqual` methods');
  equal(callObjectEqual(isEqualObj, {}), false, 'Objects that do not implement equivalent `isEqual` methods are not equal');
  equal(callObjectEqual({}, isEqualObj), false, 'Commutative equality is implemented for objects with different `isEqual` methods');

  // Custom `isEqual` methods - comparing different types
  /* CHANGED: Leaving the alone off for now
  LocalizedString = (function() {
    function LocalizedString(id) { this.id = id; this.string = (this.id===10)? 'Bonjour': ''; }
    LocalizedString.prototype.isEqual = function(that) {
      if (_.isString(that)) return this.string == that;
      else if (that instanceof LocalizedString) return this.id == that.id;
      return false;
    };
    return LocalizedString;
  })();
  var localized_string1 = new LocalizedString(10), localized_string2 = new LocalizedString(10), localized_string3 = new LocalizedString(11);
  equal(callObjectEqual(localized_string1, localized_string2), true, 'comparing same typed instances with same ids');
  equal(callObjectEqual(localized_string1, localized_string3), false, 'comparing same typed instances with different ids');
  equal(callObjectEqual(localized_string1, 'Bonjour'), true, 'comparing different typed instances with same values');
  equal(callObjectEqual('Bonjour', localized_string1), true, 'comparing different typed instances with same values');
  equal(callObjectEqual('Bonjour', localized_string3), false, 'comparing two localized strings with different ids');
  equal(callObjectEqual(localized_string1, 'Au revoir'), false, 'comparing different typed instances with different values');
  equal(callObjectEqual('Au revoir', localized_string1), false, 'comparing different typed instances with different values');

  // Custom `isEqual` methods - comparing with serialized data
  Date.prototype.toJSON = function() {
    return {
      _type:'Date',
      year:this.getUTCFullYear(),
      month:this.getUTCMonth(),
      day:this.getUTCDate(),
      hours:this.getUTCHours(),
      minutes:this.getUTCMinutes(),
      seconds:this.getUTCSeconds()
    };
  };
  Date.prototype.isEqual = function(that) {
    var this_date_components = this.toJSON();
    var that_date_components = (that instanceof Date) ? that.toJSON() : that;
    delete this_date_components['_type']; delete that_date_components['_type']
    return callObjectEqual(this_date_components, that_date_components);
  };

  var date = new Date();
  var date_json = {
    _type:'Date',
    year:date.getUTCFullYear(),
    month:date.getUTCMonth(),
    day:date.getUTCDate(),
    hours:date.getUTCHours(),
    minutes:date.getUTCMinutes(),
    seconds:date.getUTCSeconds()
  };

  equal(callObjectEqual(date_json, date), 'serialized date matches date');
  equal(callObjectEqual(date, date_json), 'date matches serialized date');
  */

});

