
(function() {

  /*
   * An adapter module to allow Prototype unit tests to be run within the framework.
   * This requires a little scope sidestepping and general JS trickiness.
   *
   */

  var currentTest;

  Test = {
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
                tests[name].apply(TestBridge);
              });
            })(test_name);
          }
        }
      }
    }
  };

  /*
  function startTests(){
    for(var i = 0; i < allTests.length; i++){
      allTests[i].call();
    }
  }
  */

  // Stole this from unittest_js. same() won't work because one of the following two parties got something wrong:
  // 1. Either Prototype is incorrect for asserting hash equality on objects whose prototype is knowingly modified.
  // 2. QUnit is incorrect for not using hasOwnProperty when testing for deep equality.
  //
  // Signs point to option 2...

  var hashIsDeeplyEqual = function(expected, actual) {
    expected = $H(expected);
    actual = $H(actual);
    var expected_array = expected.toArray().sort(), actual_array = actual.toArray().sort();
    return expected_array.length == actual_array.length && expected_array.zip(actual_array).all(allEqual);

  };

  var allEqual = function(a, b) {
    var match = true;
    for(var i = 0; i < a[0].length; i++){
      if(typeof a[0][i] == 'object' || typeof a[1][i] == 'object'){
        match = hashIsDeeplyEqual(a[0][i], a[1][i]);
      } else if(a[0][i] != a[1][i]){
        match = false;
      }
    }
    return match;
  }

  TestBridge = {
    assertEnumEqual: function(){
      equal(arguments[1].toArray(), arguments[0].toArray(), currentTest);
    },
    assertEqual: function(){
      equal(arguments[1], arguments[0], currentTest);
    },
    assertHashEqual: function(){
      equal(hashIsDeeplyEqual(arguments[1], arguments[0]), true, currentTest);
    },
    assertHashNotEqual: function(){
      equal(hashIsDeeplyEqual(arguments[1], arguments[0]), false, currentTest);
    },
    assertIdentical: function(){
      equal(arguments[1], arguments[0], currentTest);
    },
    assertNotIdentical: function(){
      equal(arguments[1] != arguments[0], true, currentTest);
    },
    assertNotEqual: function(){
      equal(arguments[1] != arguments[0], true, currentTest);
    },
    assertUndefined: function(){
      equal(typeof arguments[0] == 'undefined', true, currentTest);
    },
    assert: function(){
      equal(arguments[0], true, currentTest);
    },
    assertRespondsTo: function(name, obj){
      equal(typeof arguments[1][arguments[0]] != 'undefined', true, currentTest);
    },
    assertNothingRaised: function(){
      // do something here
    },
    assertElementsMatch: function(){
      var first = arguments[0];
      for(var i=1;i < arguments.length;i++){
        equal(first[i-1].match(arguments[i]), true, currentTest);
      }
    },
    assertElementMatches: function(){
      equal(arguments[0].match(arguments[1]), true, currentTest);
    },
    benchmark: function(){
      var startTime = new Date();
      arguments[0].call();
      var endTime = new Date();
      equal(endTime - startTime < arguments[1], true, currentTest);
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
      var error;
      try {
        arguments[1].call();
      } catch(e){
        error = e;
      }
      equal(error.name, arguments[0], currentTest);
    },
    assertMatch: function(reg, test){
      if(typeof reg != 'object'){
        reg = new RegExp(reg);
      }
      equal(reg.test(test), true, currentTest);
    },
    assertNull: function(){
      equal(arguments[0], null, currentTest)
    },
    assertNotNull: function(){
      equal(arguments[0] != null, true, currentTest)
    },
    assertInstanceOf: function(klass, n){
      equal(n instanceof klass, true, currentTest);
    },
    fail: function(occurrence){

      // AP: There is no reference in the code to a "fail" method except where
      // it is asserted in string#scan in string_test.js line 120. Mocking it here.
    }
  };

})();
