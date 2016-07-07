namespace('Function', function () {
  'use strict';

  group('bind', function() {
    var instance, BoundPerson, Person;

    equal(Function.prototype.bind.length, 1, 'should have argument length of 1');

    raisesError(function() { Function.prototype.bind.call('mooo'); }, 'Raises an error when used on anything un-callable');
    raisesError(function() { Function.prototype.bind.call(/mooo/); }, 'Regexes are functions in chrome');

    equal((function() { return this; }).bind('yellow')().toString(), 'yellow', 'basic binding of this arg');
    equal((function() { return arguments[0]; }).bind('yellow', 'mellow')(), 'mellow', 'currying argument 1');
    equal((function() { return arguments[1]; }).bind('yellow', 'mellow', 'fellow')(), 'fellow', 'currying argument 2');
    equal((function() { return this; }).bind(undefined)(), testNullScope, 'passing undefined as the scope');

    (function(a, b) {
      equal(this.toString(), 'yellow', 'ensure only one call | this object');
      equal(a, 'mellow', 'ensure only one call | argument 1');
      equal(b, 'fellow', 'ensure only one call | argument 2');
    }).bind('yellow', 'mellow', 'fellow')();

    // It seems this functionality can't be achieved in a JS polyfill...
    // equal((function() {}).bind().prototype, undefined, 'currying argument 2'); 

    Person = function(a, b) {
      this.first = a;
      this.second = b;
    };

    BoundPerson = Person.bind({ mellow: 'yellow' }, 'jump');
    instance = new BoundPerson('jumpy');

    equal(instance.mellow, undefined, 'passed scope is ignored when used with the new keyword');
    equal(instance.first, 'jump', 'curried argument makes it to the constructor');
    equal(instance.second, 'jumpy', 'argument passed to the constructor makes it in as the second arg');
    equal(instance instanceof Person, true, 'instance of the class');

    equal(instance instanceof BoundPerson, true, 'instance of the bound class');

    // Note that this spec appears to be wrong in the MDN docs:
    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
    // Changing this test to assert true as native implementations all function this way.
    equal(new Person() instanceof BoundPerson, true, 'instance of unbound class is not an instance of the bound class');

    // Binding functions without a prototype should not explode.
    Object.prototype.toString.bind('hooha')();


    // function.js

    var bound, obj, result;

    obj = { foo: 'bar' };

    bound = (function(num, bool, str, fourth, fifth) {
      equal(this === obj, true, 'Bound object is strictly equal');
      equal(num, 1, 'first parameter');
      equal(bool, true, 'second parameter');
      equal(str, 'wasabi', 'third parameter');
      equal(fourth, 'fourth', 'fourth parameter');
      equal(fifth, 'fifth', 'fifth parameter');
      return 'howdy';
    }).bind(obj, 1, true, 'wasabi');

    result = bound('fourth','fifth');
    equal(result, 'howdy', 'result is correctly returned');

    (function(first) {
      equal(Array.prototype.slice.call(arguments), [], 'arguments array is empty');
      equal(first, undefined, 'first argument is undefined');
    }).bind('foo')();

  });

});
