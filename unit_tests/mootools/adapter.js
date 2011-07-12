/*
 * An adapter module to allow Mootools unit tests to be
 * run within the QUnit framework. This requires a little
 * scope sidestepping and general JS trickiness.
 *
 */

var currentBlock;
var beforeAll;
var afterAll;
var beforeEachFn;
var afterEachFn;

/*
var QUnitBridge = function(value){

  this.should_be_true = function(){
    ok(value, currentBlock);
  };

  this.should_have = function(){
  };

  this.should_be = function(asserted){
    var type = typeof asserted;
    if(type == 'string' || type == 'number'){
      equal(value, asserted, currentBlock);
    } else {
      same(value, asserted, currentBlock);
    }
  };

  this.should_be_false = function(){
    equal(value, false, currentBlock);
  };

  this.should_be_null = function(){
    equal(value, null, currentBlock);
  };

  this.should_not_be = function(asserted){
    ok(value != asserted, currentBlock);
  };

  this.should_match = function(reg){
    ok(reg.test(value), currentBlock);
  };

}
*/

var QUnitBridge = function(expression){

  this.toBe = function(test){
    equals(expression, test, currentBlock);
  }

  this.toEqual = function(test){
    same(expression, test, currentBlock);
  };

  this.toBeFalsy = function(){
    equals(!expression, true, currentBlock);
  }

  this.toBeTruthy = function(){
    equals(!!expression, true, currentBlock);
  }

  this.toBeNull = function(){
    equals(expression == null, true, currentBlock);
  }

  this.toContain = function(test){
    equals(arrayContains(expression, test), true, currentBlock);
  }

  this.toHaveBeenCalled = function(){
    equals(!!expression.wasCalled, true, currentBlock);
  }

  this.toHaveBeenCalledWith = function(){
    equals(!!expression.wasCalled, true, currentBlock);
    same(expression.withParameters, arguments, currentBlock);
  }

  this.toMatch = function(reg){
    return reg.test(expression);
  }

  this.not = {

    toBe: function(test){
      equals(expression != test, true, currentBlock);
    },

    toEqual: function(test){
      equals(expression != test, true, currentBlock);
    },

    toThrow: function(){
      var error = false;
      try {
        expression.call();
      } catch(e){
        error = true;
      }
      equals(error, false, currentBlock);
    },

    toHaveBeenCalled: function(){
      equals(expression.wasCalled, false, currentBlock);
    }


  }

}

var arrayContains = function(a, expr){
  for(var i = 0; i < a.length; i++){
    if(a[i] == expr){
      return true;
    }
  }
  return false;
}

/*
var value_of = function(value){
  return new QUnitBridge(value);
}
*/

var expect = function(expression){
  return new QUnitBridge(expression);
}

var it = function(block_name, fn){
  currentBlock = block_name;
  if(beforeEachFn) beforeEachFn.call();
  fn.call();
  if(afterEachFn) afterEachFn.call();
}

var beforeEach = function(fn){
  beforeEachFn = fn;
}

var afterEach = function(fn){
  afterEachFn = fn;
}

var waits = function(delay){
  stop();
}

var runs = function(delay){
  start();
}

var describe = function(test_name, blocks){
  beforeEachFn = null;
  afterEachFn = null;
  test(test_name, function(){
    if(blocks['before all']){
      blocks['before all'].apply(this);
    }
    if(typeof blocks == 'function'){
      blocks();
    } else {
      for(var block_name in blocks){
        if(blocks.hasOwnProperty(block_name)){
          if(blocks['before each']){
            blocks['before each'].apply(this);
          }
          if(block_name == 'before all' || block_name == 'after all' || block_name == 'before each'){
            continue;
          }
          currentBlock = block_name;
          blocks[block_name].call();
        }
      }
    }
    if(blocks['after all']){
      blocks['after all'].apply(this);
    }
  });
};


var jasmine = {

  createSpy: function(){
    var f = function(){
      f.wasCalled = true;
      f.withParameters = arguments;
    };
    f.andReturn = function(){
      return f;
    };
    return f;
  }

}

var waitsFor = function(timeout, fn){
  fn.call();
  return true;
}

var Syn = { browser: {} };
