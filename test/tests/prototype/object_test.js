new Test.Unit.Runner({
  testObjectExtend: function() {
    var object = {foo: 'foo', bar: [1, 2, 3]};
    this.assertIdentical(object, Object.extend(object));
    this.assertHashEqual({foo: 'foo', bar: [1, 2, 3]}, object);
    this.assertIdentical(object, Object.extend(object, {bla: 123}));
    this.assertHashEqual({foo: 'foo', bar: [1, 2, 3], bla: 123}, object);
    this.assertHashEqual({foo: 'foo', bar: [1, 2, 3], bla: null},
      Object.extend(object, {bla: null}));
  },

  testObjectToQueryString: function() {
    this.assertEqual('a=A&b=B&c=C&d=D%23', Object.toQueryString({a: 'A', b: 'B', c: 'C', d: 'D#'}));
  },

  testObjectClone: function() {
    var object = {foo: 'foo', bar: [1, 2, 3]};
    this.assertNotIdentical(object, Object.clone(object));
    this.assertHashEqual(object, Object.clone(object));
    this.assertHashEqual({}, Object.clone());
    var clone = Object.clone(object);
    delete clone.bar;
    this.assertHashEqual({foo: 'foo'}, clone,
      "Optimizing Object.clone perf using prototyping doesn't allow properties to be deleted.");
  },

  testObjectInspect: function() {
    this.assertEqual('undefined', Object.inspect());
    this.assertEqual('undefined', Object.inspect(undefined));
    this.assertEqual('null', Object.inspect(null));
    this.assertEqual("'foo\\\\b\\\'ar'", Object.inspect('foo\\b\'ar'));
    this.assertEqual('[]', Object.inspect([]));
    this.assertNothingRaised(function() { Object.inspect(window.Node) });
  },

  testObjectToJSON: function() {
    this.assertUndefined(Object.toJSON(undefined));
    this.assertUndefined(Object.toJSON(Prototype.K));
    this.assertEqual('\"\"', Object.toJSON(''));
    this.assertEqual('[]', Object.toJSON([]));
    this.assertEqual('[\"a\"]', Object.toJSON(['a']));
    this.assertEqual('[\"a\", 1]', Object.toJSON(['a', 1]));
    this.assertEqual('[\"a\", {\"b\": null}]', Object.toJSON(['a', {'b': null}]));
    this.assertEqual('{\"a\": \"hello!\"}', Object.toJSON({a: 'hello!'}));
    this.assertEqual('{}', Object.toJSON({}));
    this.assertEqual('{}', Object.toJSON({a: undefined, b: undefined, c: Prototype.K}));
    this.assertEqual('{\"b\": [false, true], \"c\": {\"a\": \"hello!\"}}',
      Object.toJSON({'b': [undefined, false, true, undefined], c: {a: 'hello!'}}));
    this.assertEqual('{\"b\": [false, true], \"c\": {\"a\": \"hello!\"}}',
      Object.toJSON($H({'b': [undefined, false, true, undefined], c: {a: 'hello!'}})));
    this.assertEqual('true', Object.toJSON(true));
    this.assertEqual('false', Object.toJSON(false));
    this.assertEqual('null', Object.toJSON(null));
    var sam = new Person('sam');
    this.assertEqual('-sam', Object.toJSON(sam));
    this.assertEqual('-sam', sam.toJSON());
    var element = $('test');
    this.assertUndefined(Object.toJSON(element));
    element.toJSON = function(){return 'I\'m a div with id test'};
    this.assertEqual('I\'m a div with id test', Object.toJSON(element));
  },

  testObjectToHTML: function() {
    this.assertIdentical('', Object.toHTML());
    this.assertIdentical('', Object.toHTML(''));
    this.assertIdentical('', Object.toHTML(null));
    this.assertIdentical('0', Object.toHTML(0));
    this.assertIdentical('123', Object.toHTML(123));
    this.assertEqual('hello world', Object.toHTML('hello world'));
    this.assertEqual('hello world', Object.toHTML({toHTML: function() { return 'hello world' }}));
  },

  testObjectIsArray: function() {
    this.assert(Object.isArray([]));
    this.assert(Object.isArray([0]));
    this.assert(Object.isArray([0, 1]));
    this.assert(!Object.isArray({}));
    this.assert(!Object.isArray($('list').childNodes));
    this.assert(!Object.isArray());
    this.assert(!Object.isArray(''));
    this.assert(!Object.isArray('foo'));
    this.assert(!Object.isArray(0));
    this.assert(!Object.isArray(1));
    this.assert(!Object.isArray(null));
    this.assert(!Object.isArray(true));
    this.assert(!Object.isArray(false));
    this.assert(!Object.isArray(undefined));
  },

  testObjectIsHash: function() {
    this.assert(Object.isHash($H()));
    this.assert(Object.isHash(new Hash()));
    this.assert(!Object.isHash({}));
    this.assert(!Object.isHash(null));
    this.assert(!Object.isHash());
    this.assert(!Object.isHash(''));
    this.assert(!Object.isHash(2));
    this.assert(!Object.isHash(false));
    this.assert(!Object.isHash(true));
    this.assert(!Object.isHash([]));
  },

  testObjectIsElement: function() {
    this.assert(Object.isElement(document.createElement('div')));
    this.assert(Object.isElement(new Element('div')));
    this.assert(Object.isElement($('testlog')));
    this.assert(!Object.isElement(document.createTextNode('bla')));

    // falsy variables should not mess up return value type
    this.assertIdentical(false, Object.isElement(0));
    this.assertIdentical(false, Object.isElement(''));
    this.assertIdentical(false, Object.isElement(NaN));
    this.assertIdentical(false, Object.isElement(null));
    this.assertIdentical(false, Object.isElement(undefined));
  },

  testObjectIsFunction: function() {
    this.assert(Object.isFunction(function() { }));
    this.assert(Object.isFunction(Class.create()));
    this.assert(!Object.isFunction("a string"));
    this.assert(!Object.isFunction($("testlog")));
    this.assert(!Object.isFunction([]));
    this.assert(!Object.isFunction({}));
    this.assert(!Object.isFunction(0));
    this.assert(!Object.isFunction(false));
    this.assert(!Object.isFunction(undefined));
  },

  testObjectIsString: function() {
    this.assert(!Object.isString(function() { }));
    this.assert(Object.isString("a string"));
    this.assert(Object.isString(new String("a string")));
    this.assert(!Object.isString(0));
    this.assert(!Object.isString([]));
    this.assert(!Object.isString({}));
    this.assert(!Object.isString(false));
    this.assert(!Object.isString(undefined));
    this.assert(!Object.isString(document), 'host objects should return false rather than throw exceptions');
  },

  testObjectIsNumber: function() {
    this.assert(Object.isNumber(0));
    this.assert(Object.isNumber(1.0));
    this.assert(Object.isNumber(new Number(0)));
    this.assert(Object.isNumber(new Number(1.0)));
    this.assert(!Object.isNumber(function() { }));
    this.assert(!Object.isNumber({ test: function() { return 3 } }));
    this.assert(!Object.isNumber("a string"));
    this.assert(!Object.isNumber([]));
    this.assert(!Object.isNumber({}));
    this.assert(!Object.isNumber(false));
    this.assert(!Object.isNumber(undefined));
    this.assert(!Object.isNumber(document), 'host objects should return false rather than throw exceptions');
  },

  testObjectIsUndefined: function() {
    this.assert(Object.isUndefined(undefined));
    this.assert(!Object.isUndefined(null));
    this.assert(!Object.isUndefined(false));
    this.assert(!Object.isUndefined(0));
    this.assert(!Object.isUndefined(""));
    this.assert(!Object.isUndefined(function() { }));
    this.assert(!Object.isUndefined([]));
    this.assert(!Object.isUndefined({}));
  },

  // sanity check
  testDoesntExtendObjectPrototype: function() {
    // for-in is supported with objects
    var iterations = 0, obj = { a: 1, b: 2, c: 3 };
    for(property in obj) iterations++;
    this.assertEqual(3, iterations);

    // for-in is not supported with arrays
    iterations = 0;
    var arr = [1,2,3];
    for(property in arr) iterations++;
    this.assert(iterations > 3);
  }
});