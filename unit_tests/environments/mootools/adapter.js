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

var TestBridge = function(expression){

  this.toBe = function(test){
    equal(expression, test, currentBlock);
  }

  this.toEqual = function(test){
    equal(expression, test, currentBlock);
  };

  this.toBeFalsy = function(){
    equal(!expression, true, currentBlock);
  }

  this.toBeTruthy = function(){
    equal(!!expression, true, currentBlock);
  }

  this.toBeNull = function(){
    equal(expression == null, true, currentBlock);
  }

  this.toBeGreaterThan = function(num){
    equal(expression > num, true, currentBlock);
  }

  this.toBeLessThan = function(num){
    equal(expression < num, true, currentBlock);
  }

  this.toContain = function(test){
    equal(arrayContains(expression, test), true, currentBlock);
  }

  this.toHaveBeenCalled = function(){
    equal(!!expression.wasCalled, true, currentBlock);
  }

  this.toHaveBeenCalledWith = function(){
    equal(!!expression.wasCalled, true, currentBlock);
    equal(expression.withParameters, arguments, currentBlock);
  }

  this.toMatch = function(reg){
    return reg.test(expression);
  }

  this.not = {

    toBe: function(test){
      equal(expression != test, true, currentBlock);
    },

    toEqual: function(test){
      equal(expression != test, true, currentBlock);
    },

    toThrow: function(){
      var error = false;
      try {
        expression.call();
      } catch(e){
        error = true;
      }
      equal(error, false, currentBlock);
    },

    toHaveBeenCalled: function(){
      equal(expression.wasCalled, false, currentBlock);
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

var expect = function(expression){
  return new TestBridge(expression);
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

/*
var waits = function(delay){
  stop();
}

var runs = function(delay){
  start();
}
*/

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
    var ret;
    var spy = function(){
      spy.wasCalled = true;
      spy.withParameters = arguments;
      spy.callCount++;
      spy.mostRecentCall = {
        object: this
      }
      return ret;
    };

    spy.wasCalled = false;
    spy.callCount = 0;

    spy.andReturn = function(r){
      ret = r;
      return spy;
    };

    spy.reset = function(){
      spy.callCount = 0;
      spy.wasCalled = false;
      spy.withParameters = null;
      spy.mostRecentCall = null;
    };

    return spy;
  }

}

