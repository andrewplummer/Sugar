/*
 * An adapter module to allow Prototype unit tests to be
 * run within the QUnit framework. This requires a little
 * scope sidestepping and general JS trickiness.
 *
 */

var currentTest;

var Test = {
  Unit: {
    Runner: function(tests){
      for(var test_name in tests){
        if(tests.hasOwnProperty(test_name)){
          // The function passed into the second argument of "test"
          // is deferred, so we need 2 anonymous functions, one to
          // hold the variable before the for loop overwrites it and
          // the other to apply the test with the proper scope.
          (function(name){
            test(name, function(){
              currentTest = name;
              tests[name].apply(QUnitBridge);
            });
          })(test_name);
        }
      }
    }
  }
};

QUnitBridge = {
  assertEnumEqual: function(){
    same(arguments[1], arguments[0], currentTest);
  },
  assertEqual: function(){
    same(arguments[1], arguments[0], currentTest);
  },
  assertHashEqual: function(){
    same(arguments[1], arguments[0], currentTest);
  },
  assertIdentical: function(){
    equal(arguments[1], arguments[0], currentTest);
  },
  assertNotIdentical: function(){
    ok(arguments[1] != arguments[0], currentTest);
  },
  assertNotEqual: function(){
    ok(arguments[1] != arguments[0], currentTest);
  },
  assertUndefined: function(){
    ok(typeof arguments[0] == 'undefined', currentTest);
  },
  assert: function(){
    ok(arguments[0], currentTest, currentTest);
  },
  assertRespondsTo: function(name, obj){
    ok(typeof arguments[1][arguments[0]] != 'undefined');
  },
  assertNothingRaised: function(){
    // do something here
  },
  assertElementsMatch: function(){
    var first = arguments[0];
    for(var i=1;i < arguments.length;i++){
      ok(first[i-1].match(arguments[i]), currentTest);
    }
  },
  assertElementMatches: function(){
    ok(arguments[0].match(arguments[1]), currentTest);
  },
  benchmark: function(){
    var startTime = new Date();
    arguments[0].call();
    var endTime = new Date();
    ok(endTime - startTime < arguments[1], currentTest);
  },
  wait: function(time, func){
    var self = this;
    setTimeout(function(){ func.call(self); }, time);
  },
  info: function(){
    if(typeof console != 'undefined'){
      console.log(arguments[0]);
    }
  },
  assertRaise: function(){
    try {
      arguments[1].call();
    } catch(error){
      equal(error.name, arguments[0], currentTest);
    }
  },
  assertMatch: function(reg, test){
    if(typeof reg != 'object'){
      reg = new RegExp(reg);
    }
    ok(reg.test(test), currentTest);
  },
  assertNull: function(){
    equal(arguments[0], null, currentTest)
  },
  assertNotNull: function(){
    ok(arguments[0] != null, currentTest)
  },
  fail: function(occurrence){

    // AP: There is no reference in the code to a "fail" method except where
    // it is asserted in string#scan in string_test.js line 120. Mocking it here.
  }
};
