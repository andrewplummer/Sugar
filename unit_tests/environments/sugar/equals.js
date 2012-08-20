
// These tests also shamefully stolen from the Underscore.js test suite.
// Careful checks for cyclical references, equality between primitives and
// wrappers, and more. Sugar's Object.equal should now be considered "egal".

test('Equality', function() {

  function First() {
    this.value = 1;
  }
  First.prototype.value = 1;
  function Second() {
    this.value = 1;
  }
  Second.prototype.value = 2;

  // Basic equality and identity comparisons.
  equal(Object.equal(null, null), true, "`null` is equal to `null`");
  equal(Object.equal(), true, "`undefined` is equal to `undefined`");

  equal(Object.equal(0, -0), false, "`0` is not equal to `-0`");
  equal(Object.equal(-0, 0), false, "Commutative equality is implemented for `0` and `-0`");

  equal(Object.equal(null, undefined), false, "`null` is not equal to `undefined`");
  equal(Object.equal(undefined, null), false, "Commutative equality is implemented for `null` and `undefined`");

  // String object and primitive comparisons.
  equal(Object.equal("Curly", "Curly"), true, "Identical string primitives are equal");
  equal(Object.equal(new String("Curly"), new String("Curly")), true, "String objects with identical primitive values are equal");

  equal(Object.equal("Curly", "Larry"), false, "String primitives with different values are not equal");
  equal(Object.equal(new String("Curly"), "Curly"), false, "String primitives and their corresponding object wrappers are not equal");
  equal(Object.equal("Curly", new String("Curly")), false, "Commutative equality is implemented for string objects and primitives");
  equal(Object.equal(new String("Curly"), new String("Larry")), false, "String objects with different primitive values are not equal");
  equal(Object.equal(new String("Curly"), {toString: function(){ return "Curly"; }}), false, "String objects and objects with a custom `toString` method are not equal");

  // Number object and primitive comparisons.
  equal(Object.equal(75, 75), true, "Identical number primitives are equal");
  equal(Object.equal(new Number(75), new Number(75)), true, "Number objects with identical primitive values are equal");

  equal(Object.equal(75, new Number(75)), false, "Number primitives and their corresponding object wrappers are not equal");
  equal(Object.equal(new Number(75), 75), false, "Commutative equality is implemented for number objects and primitives");
  equal(Object.equal(new Number(75), new Number(63)), false, "Number objects with different primitive values are not equal");
  equal(Object.equal(new Number(63), {valueOf: function(){ return 63; }}), false, "Number objects and objects with a `valueOf` method are not equal");


  // Comparisons involving `NaN`.
  equal(Object.equal(NaN, NaN), true, "`NaN` is equal to `NaN`");
  equal(Object.equal(61, NaN), false, "A number primitive is not equal to `NaN`");
  equal(Object.equal(new Number(79), NaN), false, "A number object is not equal to `NaN`");
  equal(Object.equal(Infinity, NaN), false, "`Infinity` is not equal to `NaN`");

  // Boolean object and primitive comparisons.
  equal(Object.equal(true, true), true, "Identical boolean primitives are equal");
  equal(Object.equal(new Boolean, new Boolean), true, "Boolean objects with identical primitive values are equal");
  equal(Object.equal(true, new Boolean(true)), false, "Boolean primitives and their corresponding object wrappers are not equal");
  equal(Object.equal(new Boolean(true), true), false, "Commutative equality is implemented for booleans");
  equal(Object.equal(new Boolean(true), new Boolean), false, "Boolean objects with different primitive values are not equal");

  // Common type coercions.
  equal(Object.equal(true, new Boolean(false)), false, "Boolean objects are not equal to the boolean primitive `true`");
  equal(Object.equal("75", 75), false, "String and number primitives with like values are not equal");
  equal(Object.equal(new Number(63), new String(63)), false, "String and number objects with like values are not equal");
  equal(Object.equal(75, "75"), false, "Commutative equality is implemented for like string and number values");
  equal(Object.equal(0, ""), false, "Number and string primitives with like values are not equal");
  equal(Object.equal(1, true), false, "Number and boolean primitives with like values are not equal");
  equal(Object.equal(new Boolean(false), new Number(0)), false, "Boolean and number objects with like values are not equal");
  equal(Object.equal(false, new String("")), false, "Boolean primitives and string objects with like values are not equal");
  equal(Object.equal(1256428800000, new Date(Date.UTC(2009, 9, 25))), false, "Dates and their corresponding numeric primitive values are not equal");

  // Dates.
  equal(Object.equal(new Date(2009, 9, 25), new Date(2009, 9, 25)), true, "Date objects referencing identical times are equal");
  equal(Object.equal(new Date(2009, 9, 25), new Date(2009, 9, 25, 0, 0, 0, 1)), false, "Date objects 1ms apart");
  equal(Object.equal(new Date(2009, 9, 25), new Date(2009, 11, 13)), false, "Date objects referencing different times are not equal");
  equal(Object.equal(new Date(2009, 11, 13), {
    getTime: function(){
      return 12606876e5;
    }
  }), false, "Date objects and objects with a `getTime` method are not equal");
  equal(Object.equal(new Date("Curly"), new Date("Curly")), true, "Invalid dates are equal");

  // Functions.
  equal(Object.equal(First, Second), false, "Different functions with identical bodies and source code representations are not equal");

  // RegExps.
  equal(Object.equal(/(?:)/gim, /(?:)/gim), true, "RegExps with equivalent patterns and flags are equal");
  equal(Object.equal(/(?:)/g, /(?:)/gi), false, "RegExps with equivalent patterns and different flags are not equal");
  equal(Object.equal(/Moe/gim, /Curly/gim), false, "RegExps with different patterns and equivalent flags are not equal");
  equal(Object.equal(/(?:)/gi, /(?:)/g), false, "Commutative equality is implemented for RegExps");
  equal(Object.equal(/Curly/g, {source: "Larry", global: true, ignoreCase: false, multiline: false}), false, "RegExps and RegExp-like objects are not equal");

  // Empty arrays, array-like objects, and object literals.
  equal(Object.equal({}, {}), true, "Empty object literals are equal");
  equal(Object.equal([], []), true, "Empty array literals are equal");
  equal(Object.equal([{}], [{}]), true, "Empty nested arrays and objects are equal");
  equal(Object.equal({length: 0}, []), false, "Array-like objects and arrays are not equal.");
  equal(Object.equal([], {length: 0}), false, "Commutative equality is implemented for array-like objects");

  equal(Object.equal({}, []), false, "Object literals and array literals are not equal");
  equal(Object.equal([], {}), false, "Commutative equality is implemented for objects and arrays");
  equal(Object.equal((function(){ return arguments; })(), (function(){ return arguments; })()), true, "Empty arguments objects are equal");

  // Arrays with primitive and object values.
  equal(Object.equal([1, true, "Larry", true], [1, true, "Larry", true]), true, "Arrays containing identical primitives are equal");
  equal(Object.equal([/Moe/g, new Date(2009, 9, 25)], [/Moe/g, new Date(2009, 9, 25)]), true, "Arrays containing equivalent elements are equal");

  // Multi-dimensional arrays.
  var a = [new Number(47), false, true, "Larry", /Moe/, new Date(2009, 11, 13), ['running', 'biking', new String('programming')], {a: 47}];
  var b = [new Number(47), false, true, "Larry", /Moe/, new Date(2009, 11, 13), ['running', 'biking', new String('programming')], {a: 47}];
  equal(Object.equal(a, b), true, "Arrays containing nested arrays and objects are recursively compared");

  // Overwrite the methods defined in ES 5.1 section 15.4.4.
  a.forEach = a.map = a.filter = a.every = a.indexOf = a.lastIndexOf = a.some = a.reduce = a.reduceRight = null;
  b.join = b.pop = b.reverse = b.shift = b.slice = b.splice = b.concat = b.sort = b.unshift = null;

  // Array elements and properties.
  equal(Object.equal(a, b), true, "Arrays containing equivalent elements and different non-numeric properties are equal");
  a.push("White Rocks");
  equal(Object.equal(a, b), false, "Arrays of different lengths are not equal");
  a.push("East Boulder");
  b.push("Gunbarrel Ranch", true, "Teller Farm");
  equal(Object.equal(a, b), false, "Arrays of identical lengths containing different elements are not equal");

  // Sparse arrays.
  equal(Object.equal(Array(3), Array(3)), true, "Sparse arrays of identical lengths are equal");
  equal(Object.equal(Array(3), Array(6)), false, "Sparse arrays of different lengths are not equal when both are empty");

  // According to the Microsoft deviations spec, section 2.1.26, JScript 5.x treats `undefined`
  // elements in arrays as elisions. Thus, sparse arrays and dense arrays containing `undefined`
  // values are equivalent.
  if (0 in [undefined]) {
    equal(Object.equal(Array(3), [undefined, undefined, undefined]), true, "Sparse and dense arrays are equal");
    equal(Object.equal([undefined, undefined, undefined], Array(3)), true, "Commutative equality is implemented for sparse and dense arrays");
  }

  // Simple objects.
  equal(Object.equal({a: "Curly", b: 1, c: true}, {a: "Curly", b: 1, c: true}), true, "Objects containing identical primitives are equal");
  equal(Object.equal({a: /Curly/g, b: new Date(2009, 11, 13)}, {a: /Curly/g, b: new Date(2009, 11, 13)}), true, "Objects containing equivalent members are equal");
  equal(Object.equal({a: 63, b: 75}, {a: 61, b: 55}), false, "Objects of identical sizes with different values are not equal");
  equal(Object.equal({a: 63, b: 75}, {a: 61, c: 55}), false, "Objects of identical sizes with different property names are not equal");
  equal(Object.equal({a: 1, b: 2}, {a: 1}), false, "Objects of different sizes are not equal");
  equal(Object.equal({a: 1}, {a: 1, b: 2}), false, "Commutative equality is implemented for objects");
  equal(Object.equal({x: 1, y: undefined}, {x: 1, z: 2}), false, "Objects with identical keys and different values are not equivalent");

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
  equal(Object.equal(a, b), true, "Objects with nested equivalent members are recursively compared");

  // Instances.
  equal(Object.equal(new First, new First), true, "Object instances are equal");
  equal(Object.equal(new First, new Second), false, "Objects with different constructors and identical own properties are not equal");
  equal(Object.equal({value: 1}, new First), false, "Object instances and objects sharing equivalent properties are not identical");
  equal(Object.equal({value: 2}, new Second), false, "The prototype chain of objects should not be examined");

  // Circular Arrays.
  (a = []).push(a);
  (b = []).push(b);
  equal(Object.equal(a, b), true, "Arrays containing circular references are equal");
  a.push(new String("Larry"));
  b.push(new String("Larry"));
  equal(Object.equal(a, b), true, "Arrays containing circular references and equivalent properties are equal");
  a.push("Shemp");
  b.push("Curly");
  equal(Object.equal(a, b), false, "Arrays containing circular references and different properties are not equal");

  // Circular Objects.
  a = {abc: null};
  b = {abc: null};
  a.abc = a;
  b.abc = b;
  equal(Object.equal(a, b), true, "Objects containing circular references are equal");
  a.def = 75;
  b.def = 75;
  equal(Object.equal(a, b), true, "Objects containing circular references and equivalent properties are equal");
  a.def = new Number(75);
  b.def = new Number(63);
  equal(Object.equal(a, b), false, "Objects containing circular references and different properties are not equal");

  // Cyclic Structures.
  a = [{abc: null}];
  b = [{abc: null}];
  (a[0].abc = a).push(a);
  (b[0].abc = b).push(b);
  equal(Object.equal(a, b), true, "Cyclic structures are equal");
  a[0].def = "Larry";
  b[0].def = "Larry";
  equal(Object.equal(a, b), true, "Cyclic structures containing equivalent properties are equal");
  a[0].def = new String("Larry");
  b[0].def = new String("Curly");
  equal(Object.equal(a, b), false, "Cyclic structures containing different properties are not equal");

  // Complex Circular References.
  a = {foo: {b: {foo: {c: {foo: null}}}}};
  b = {foo: {b: {foo: {c: {foo: null}}}}};
  a.foo.b.foo.c.foo = a;
  b.foo.b.foo.c.foo = b;
  equal(Object.equal(a, b), true, "Cyclic structures with nested and identically-named properties are equal");


  // Custom `isEqual` methods.
  var isEqualObj = {isEqual: function (o) { return o.isEqual == this.isEqual; }, unique: {}};
  var isEqualObjClone = {isEqual: isEqualObj.isEqual, unique: {}};

  equal(Object.equal(isEqualObj, isEqualObjClone), true, 'Both objects implement identical `isEqual` methods');
  equal(Object.equal(isEqualObjClone, isEqualObj), true, 'Commutative equality is implemented for objects with custom `isEqual` methods');
  equal(Object.equal(isEqualObj, {}), false, 'Objects that do not implement equivalent `isEqual` methods are not equal');
  equal(Object.equal({}, isEqualObj), false, 'Commutative equality is implemented for objects with different `isEqual` methods');

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
  equal(Object.equal(localized_string1, localized_string2), true, 'comparing same typed instances with same ids');
  equal(Object.equal(localized_string1, localized_string3), false, 'comparing same typed instances with different ids');
  equal(Object.equal(localized_string1, 'Bonjour'), true, 'comparing different typed instances with same values');
  equal(Object.equal('Bonjour', localized_string1), true, 'comparing different typed instances with same values');
  equal(Object.equal('Bonjour', localized_string3), false, 'comparing two localized strings with different ids');
  equal(Object.equal(localized_string1, 'Au revoir'), false, 'comparing different typed instances with different values');
  equal(Object.equal('Au revoir', localized_string1), false, 'comparing different typed instances with different values');

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
    return Object.equal(this_date_components, that_date_components);
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

  equal(Object.equal(date_json, date), 'serialized date matches date');
  equal(Object.equal(date, date_json), 'date matches serialized date');
  */

});

