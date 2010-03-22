
/*
 * isSet and isObj have been deprecated in QUnit, but
 * they are still being used in jQuery's unit tests.
 * isSet should be changed to same(), but shows some unexpected
 * (unequal) behavior. I also don't want to mess with the expected
 * assertions of the core jQuery tests, so do a basic equal() comparison
 * on the length, and throw an error if the contents aren't the same
 * to be sure.
 */

var isSet = function(first, second, message){
  equal(first.length, second.length, message);
  for(var i = 0; i < first.length; i++){
    if(first[i] != second[i]){
      throw new Error('Objects not equal');
    }
  }
}

var isObj = QUnit.same;
