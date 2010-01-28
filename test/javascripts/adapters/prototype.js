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
    same(arguments[0], arguments[1], currentTest);
  },
  assertEqual: function(){
    same(arguments[0], arguments[1], currentTest);
  },
  assertHashEqual: function(){
    same(arguments[0], arguments[1], currentTest);
  },
  assertIdentical: function(){
    equal(arguments[0], arguments[1], currentTest);
  },
  assertNotIdentical: function(){
    ok(arguments[0] != arguments[1], currentTest);
  },
  assertUndefined: function(){
    ok(typeof arguments[0] == 'undefined', currentTest);
  },
  assert: function(){
    ok(arguments[0], currentTest, currentTest);
  },
  benchmark: function(){
    var startTime = new Date();
    arguments[0].call();
    var endTime = new Date();
    ok(endTime - startTime < arguments[1], currentTest);
  },
  assertRaise: function(){
    try {
      arguments[1].call();
    } catch(error){
      equal(error.name, arguments[0], currentTest);
    }
  },
  assertMatch: function(){
    equal(arguments[0], arguments[1], currentTest);
  },
  assertNull: function(){
    equal(arguments[0], null, currentTest)
  }
};
