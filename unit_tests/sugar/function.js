test('Function', function () {

  var bound,obj,result;

  obj = { foo: 'bar' };

  bound = (function(num, bool, str, fourth, fifth) {
    equals(this === obj, true, 'Function#bind | Bound object is strictly equal');
    equals(num, 1, 'Function#bind | first parameter');
    equalsWithException(bool, true, { mootools: undefined }, 'Function#bind | second parameter');
    equalsWithException(str, 'wasabi', { mootools: undefined }, 'Function#bind | third parameter');
    equalsWithException(fourth, 'fourth', { mootools: undefined }, 'Function#bind | fourth parameter');
    equalsWithException(fifth, 'fifth', { mootools: undefined }, 'Function#bind | fifth parameter');
    return 'howdy';
  }).bind(obj, 1, true, 'wasabi');

  result = bound('fourth','fifth');
  equals(result, 'howdy', 'Function#bind | result is correctly returned');

  (function(first) {
    same(Array.prototype.slice.call(arguments), [], 'Function#bind | arguments array is empty');
    equals(first, undefined, 'Function#bind | first argument is undefined');
  }).bind('foo')();

  bound = (function(num, bool, str) {}).bind('wasabi', 'moo')();


  var delayedFunction,delayReturn;


  var delayedFunction = function(one, two) {
    equalsWithException(one, 'one', { mootools: 'two' }, 'Function#delay | first parameter');
    equalsWithException(two, 'two', { mootools: undefined }, 'Function#delay | second parameter');
    equalsWithException(shouldBeFalse, false, { prototype: true, mootools: true }, 'Function#delay | cancel is working');
    start();
  };

  delayReturn = delayedFunction.delay(20, 'one', 'two');
  equals(typeof delayReturn, 'number', 'Function#delay | returns the timeout ID');

  var shouldBeFalse = false;
  delayedFunction = function() {
    shouldBeFalse = true;
  };

  delayReturn = delayedFunction.delay(5);
  delayedFunction.cancel();


  bound = (function(num, bool, str) {}).delay(1, 'wasabi');

  bound = (function(one, two) {
    equals(this, 'poo', 'Function#defer | bound object');
    equalsWithException(one, 'one', { mootools: 'two' }, 'Function#defer | first parameter');
    equalsWithException(two, 'two', { mootools: undefined }, 'Function#defer | second parameter');
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
  equals(lazyCounter, 0, "Function.lazy | hasn't executed yet");
  setTimeout(function() {
    equals(lazyCounter, 3, 'Function.lazy | was executed by 10ms');
  }, 10);


  stop();



});

