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


  // Prototype's delay function takes the value in seconds, so 20 makes the tests
  // take at least 20 seconds to finish!
  var delayTime = environment === 'prototype' ? 0.02 : 20;

  async(function(){
    var fn, ref;
    fn = function(one, two) {
      equal(one, 'one', 'Function#delay | first parameter', { mootools: 'two' });
      equal(two, 'two', 'Function#delay | second parameter', { mootools: undefined });
    };
    ref = fn.delay(delayTime, 'one', 'two');
    equal(typeof ref, 'function', 'Function#delay | returns the function', { prototype: 'number', mootools: 'number' });
  });

  async(function(){
    var fn, ref, shouldBeFalse = false;
    fn = function() {
      shouldBeFalse = true;
    };
    fn.delay(delayTime / 4);
    fn.delay(delayTime / 5);
    fn.delay(delayTime / 6);
    ref = fn.cancel();
    equal(ref, fn, 'Function#cancel | returns a reference to the function');
    setTimeout(function() {
      equal(shouldBeFalse, false, 'Function#delay | cancel is working', { prototype: true, mootools: true });
    }, 60);
  });

  skipEnvironments(['prototype'], function() {
    async(function(){

      var counter = 0;
      var fn = function(){ counter++; }

      fn.delay(50);
      fn.delay(10);

      setTimeout(function() {
        fn.cancel();
      }, 30);

      setTimeout(function() {
        equal(counter, 1, 'Function#cancel | should be able to find the correct timers', { prototype: 0 });
        fn.cancel();
      }, 60);

    });
  });

  async(function() {
    var counter = 0;
    var expected = [['maybe','a',1],['baby','b',2],['you lazy','c',3],['biotch','d',4]];
    var fn = (function(one, two) {
      equal([this.toString(), one, two], expected[counter], 'Function#lazy | scope and arguments are correct');
      counter++;
    }).lazy();
    fn.call('maybe', 'a', 1);
    fn.call('baby', 'b', 2);
    fn.call('you lazy', 'c', 3);
    equal(counter, 1, "Function#lazy | should have executed once");
    setTimeout(function() {
      equal(counter, 3, 'Function#lazy | was executed by 10ms');
      fn.call('biotch', 'd', 4);
      equal(counter, 4, 'Function#lazy | next execution should be immediate');
    }, 100);
  });


  async(function() {
    var counter = 0;
    var fn = (function() { counter++; }).lazy();
    fn();
    fn();
    fn();
    fn.cancel();
    setTimeout(function() {
      equal(counter, 1, 'Function#lazy | lazy functions can also be canceled');
    }, 10);
  });



  async(function() {
    var counter = 0;
    var fn = (function() { counter++; }).lazy(0.1);
    for(var i = 0; i < 20; i++) {
      fn();
    }
    setTimeout(function() {
      equal(counter, 20, 'Function#lazy | lazy (throttled) functions can have a [wait] value of < 1ms');
    }, 100);
  });



  async(function() {
    var counter = 0;
    var fn = (function() { counter++; }).lazy(0.1, 10);
    for(var i = 0; i < 50; i++) {
      fn();
    }
    setTimeout(function() {
      equal(counter, 10, 'Function#lazy | lazy functions have an upper threshold');
    }, 50);
  });


  async(function() {
    var counter = 0;
    var fn = (function() { counter++; }).lazy(0.1, 1);
    for(var i = 0; i < 50; i++) {
      fn();
    }
    setTimeout(function() {
      equal(counter, 1, 'Function#lazy | lazy functions with a limit of 1 WILL still execute');
    }, 50);
  });



  // Function#debounce

  async(function(){
    var fn, ret, counter = 0, expected = [['leia', 5],['han solo', 7]];
    var fn = (function(one){
      equal([this.toString(), one], expected[counter], 'Function#debounce | scope and arguments are correct');
      counter++;
    }).debounce(30);

    fn.call('3p0', 1);
    fn.call('r2d2', 2);
    fn.call('chewie', 3);

    setTimeout(function() {
      fn.call('leia', 5);
    }, 10);

    setTimeout(function() {
      fn.call('luke', 6);
      fn.call('han solo', 7);
    }, 200);

    ret = fn.call('vader', 4);

    equal(ret, undefined, 'Function#debounce | calls to a debounced function return undefined');

    setTimeout(function() {
      equal(counter, 2, 'Function#debounce | counter is correct');
    }, 500);
  });


  // Function#throttle

  async(function(){
    var fn, ret, counter = 0, expected = [['3p0', 1],['luke', 6]];
    var fn = (function(one){
      equal([this.toString(), one], expected[counter], 'Function#throttle | immediate execution | scope and arguments are correct');
      counter++;
    }).throttle(50);

    fn.call('3p0', 1);
    fn.call('r2d2', 2);
    fn.call('chewie', 3);

    setTimeout(function() {
      fn.call('leia', 5);
    }, 10);

    setTimeout(function() {
      fn.call('luke', 6);
      fn.call('han solo', 7);
    }, 100);

    ret = fn.call('vader', 4);

    setTimeout(function() {
      equal(counter, 2, 'Function#throttle | immediate execution | counter is correct');
    }, 200);
  });


  // Function#after

  async(function() {
    var fn, ret, counter = 0, i = 1;
    var expectedArguments = [[[1,'bop'],[2,'bop'],[3,'bop'],[4,'bop'],[5,'bop']],[[6,'bop'],[7,'bop'],[8,'bop'],[9,'bop'],[10,'bop']]];
    fn = (function(args) {
      equal(args, expectedArguments[counter], 'Function#after | collects arguments called');
      equal(!!args[0].slice, true, 'Function#after | arguments are converted to actual arrays');
      counter++;
      return 'hooha';
    }).after(5);
    while(i <= 10) {
      ret = fn(i, 'bop');
      equal(ret, (i % 5 == 0 ? 'hooha' : undefined), 'Function#after | collects return value as well');
      i++;
    }
    equal(counter, 2, 'Function#after | calls a function only after a certain number of calls');
  });

  async(function() {
    var fn, counter = 0;
    var fn = (function(args) { counter++; }).after(0);
    equal(counter, 1, 'Function#after | 0 should fire the function immediately');
    equal(typeof fn, 'function', 'Function#after | 0 should still return a function');
  });


  // Function#once

  async(function() {
    var fn, obj = { foo:'bar' }, counter = 0;
    fn = (function(one, two) {
      counter++;
      equal(this, obj, 'Function#once | scope is properly set');
      equal(one, 'one', 'Function#once | first argument is passed');
      equal(two, 'two', 'Function#once | second argument is passed');
      return counter * 30;
    }).once();

    equal(fn.call(obj, 'one', 'two'), 30, 'Function#once | first call calculates the result');
    equal(fn.call(obj, 'one', 'two'), 30, 'Function#once | second call memoizes the result');
    equal(fn.call(obj, 'one', 'two'), 30, 'Function#once | third call memoizes the result');
    equal(fn.call(obj, 'one', 'two'), 30, 'Function#once | fourth call memoizes the result');
    equal(fn.call(obj, 'one', 'two'), 30, 'Function#once | fifth call memoizes the result');

    equal(counter, 1, 'Function#once | counter is only incremented once');
  });


  async(function() {
    var fn, counter = 0;
    fn = (function(one, two) {
      counter++;
    }).once();

    fn.call();
    fn.call();
    fn.call();

    equal(counter, 1, 'Function#once | returning undefined will not affect the number of calls');
  });


  // Function#fill

  // Now that core is being split up, Number#format may not exist, so replicating it here.

  var format = function(place, last){
      return (last || '') + this.toFixed(place);
    }

  Number.prototype.two = format.fill(2);

  equal((18).two(), '18.00', 'Function#fill | two | 18');
  equal((9999).two(), '9999.00', 'Function#fill | two | 9999.00');
  equal((9999).two('$'), '$9999.00', 'Function#fill | two | $9999.00');


  Number.prototype.euro = format.fill(undefined, '€');

  equal((9999.77).euro(), '€10000', 'Function#fill | euro | no params | 9.999,77');
  equal((9999.77).euro(0), '€10000', 'Function#fill | euro | 0 | 9.999');
  equal((9999.77).euro(1), '€9999.8', 'Function#fill | euro | 1 | 9.999,8');
  equal((9999.77).euro(2), '€9999.77', 'Function#fill | euro | 2 | 9.999,77');
  equal((9999.77).euro(3), '€9999.770', 'Function#fill | euro | 3 | 9.999,777');


  Number.prototype.noop = format.fill();

  equal((1000).noop(3, '$'), '$1000.000', 'Function#fill | noop | noop | 1 000,000');
  equal((1000).noop(4, '$'), '$1000.0000', 'Function#fill | noop | noop | 1 000,0000');
  equal((1000).noop(5, '$'), '$1000.00000', 'Function#fill | noop | noop | 1 000,00000');

  equal((function(first){ return first; }).fill(['a','b'])(), ['a','b'], 'Function#fill | can be passed arrays');

  equal((function(){ return arguments; }).fill(0)('a'), [0, 'a'], 'Function#fill | falsy values can be passed');

});

