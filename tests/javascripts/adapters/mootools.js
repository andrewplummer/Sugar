/*
 * An adapter module to allow Mootools unit tests to be
 * run within the QUnit framework. This requires a little
 * scope sidestepping and general JS trickiness.
 *
 */

var currentBlock;
var beforeAll;
var afterAll;

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

var value_of = function(value){
  return new QUnitBridge(value);
}

var describe = function(test_name, blocks){
  test(test_name, function(){
    if(blocks['before all']){
      blocks['before all'].apply(this);
    }
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
    if(blocks['after all']){
      blocks['after all'].apply(this);
    }
  });
};



