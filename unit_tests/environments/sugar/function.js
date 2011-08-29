test('Function', function () {

  var bound,obj,result,num,fn;

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
  };

  delayReturn = delayedFunction.delay(delayTime, 'one', 'two');
  equal(typeof delayReturn, 'function', 'Function#delay | returns the timeout ID', { mootools: 'number' });

  shouldBeFalse = false;
  delayedFunction = function() {
    shouldBeFalse = true;
  };

  delayReturn = delayedFunction.delay(delayTime / 4);
  var cancelReturn = delayedFunction.cancel();

  equal(cancelReturn, delayedFunction, 'Function#cancel | returns a reference to itself');


  bound = (function(num, bool, str) {}).delay(1, 'wasabi');

  // Properly unit testing Function#lazy will probably be a bitch...
  // Will have to rethink strategy here.

  var lazyCounter = 0;
  var lazyExpected = [['maybe','a',1],['baby','b',2],['you lazy','c',3]];
  var fn = (function(one, two) {
    equal([this, one, two], lazyExpected[lazyCounter], 'Function#lazy | scope and arguments are correct');
    lazyCounter++;
  }).lazy();
  fn.call('maybe', 'a', 1);
  fn.call('baby', 'b', 2);
  fn.call('you lazy', 'c', 3);
  equal(lazyCounter, 0, "Function#lazy | hasn't executed yet");
  setTimeout(function() {
    equal(lazyCounter, 3, 'Function#lazy | was executed by 10ms');
  }, 10);


  var lazyCounter2 = 0;
  var lazy2 = (function() { lazyCounter2++; }).lazy();
  lazy2();
  lazy2();
  lazy2.cancel();
  setTimeout(function() {
    equal(lazyCounter2, 0, 'Function#lazy | lazy functions can also be canceled');
  }, 10);





  // Debounce

  var debounceCounter = 0;
  var debounceExpected = [['leia', 4],['han solo', 6]];
  var debounced = (function(one){
    equal([this, one], debounceExpected[debounceCounter], 'Function#debounce | scope and arguments are correct');
    debounceCounter++;
  }).debounce(50);

  debounced.call('3p0', 1);
  debounced.call('r2d2', 2);
  debounced.call('chewie', 3);

  setTimeout(function() {
    debounced.call('leia', 4);
  }, 5);

  setTimeout(function() {
    debounced.call('luke', 5);
    debounced.call('han solo', 6);
  }, 200);


  setTimeout(function() {
    equal(debounceCounter, 2, 'Function#debounce | counter is correct');
  }, 300);





});

