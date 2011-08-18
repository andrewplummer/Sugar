test('Function', function () {

  var bound,obj,result;

  obj = { foo: 'bar' };

  bound = (function(num, bool, str, fourth, fifth) {
    equal(this === obj, true, 'Function#bind | Bound object is strictly equal');
    equal(num, 1, 'Function#bind | first parameter');
    equal(bool, true, 'Function#bind | second parameter', { mootools: undefined });
    equal(str, 'wasabi', 'Function#bind | third parameter', { mootools: undefined });
    equal(fourth, 'fourth', 'Function#bind | fourth parameter', { mootools: undefined });
    equal(fifth, 'fifth', 'Function#bind | fifth parameter', { mootools: undefined });
    return 'howdy';
  }).bind(obj, 1, true, 'wasabi');

  result = bound('fourth','fifth');
  equal(result, 'howdy', 'Function#bind | result is correctly returned');

  (function(first) {
    equal(Array.prototype.slice.call(arguments), [], 'Function#bind | arguments array is empty');
    equal(first, undefined, 'Function#bind | first argument is undefined');
  }).bind('foo')();

  bound = (function(num, bool, str) {}).bind('wasabi', 'moo')();


  var delayedFunction, delayReturn, shouldBeFalse;

  // Prototype's delay function takes the value in seconds, so 20 makes the tests
  // take at least 20 seconds to finish!
  var delayTime = environment === 'prototype' ? 0.02 : 20;

  delayedFunction = function(one, two) {
    equal(one, 'one', 'Function#delay | first parameter', { mootools: 'two' });
    equal(two, 'two', 'Function#delay | second parameter', { mootools: undefined });
    equal(shouldBeFalse, false, 'Function#delay | cancel is working', { prototype: true, mootools: true });
    //start();
  };

  delayReturn = delayedFunction.delay(delayTime, 'one', 'two');
  equal(typeof delayReturn, 'function', 'Function#delay | returns the timeout ID');

  shouldBeFalse = false;
  delayedFunction = function() {
    shouldBeFalse = true;
  };

  delayReturn = delayedFunction.delay(delayTime / 4);
  delayedFunction.cancel();


  bound = (function(num, bool, str) {}).delay(1, 'wasabi');

  bound = (function(one, two) {
    equal(this, 'poo', 'Function#defer | bound object');
    equal(one, 'one', 'Function#defer | first parameter', { mootools: 'two' });
    equal(two, 'two', 'Function#defer | second parameter', { mootools: undefined });
  }).bind('poo').defer('one', 'two');

  bound = (function(num, bool, str) {}).defer('three');


  // Properly unit testing the exact throttle of Function.lazy will probably be a bitch...
  // Will have to rethink strategy here.
  var lazyCounter = 0;
  var lazy = Function.lazy(function() {
    lazyCounter++;
  });
  lazy();
  lazy();
  lazy();
  equal(lazyCounter, 0, "Function.lazy | hasn't executed yet");
  setTimeout(function() {
    equal(lazyCounter, 3, 'Function.lazy | was executed by 10ms');
  }, 10);


  //stop();



});

