
// The current test message. Store this for future reference.
var testMessage;

YUI.prototype.Test = {

  Case: function(YUITestCase){

    var name = YUITestCase.name;

    for(var message in YUITestCase){
      if(YUITestCase.hasOwnProperty(message) && typeof YUITestCase[message] == 'function'){
        testMessage = message;
        test(message, function(){
          YUITestCase[message].call(this);
        });
      }
    }
  },

  Runner: {
    add: function(){
      // tests already set up
    },
    run: function(){
      // tests already set up
    }
  }

}

YUI.prototype.ArrayAssert = {
  itemsAreEqual: function(first, second){
    same(first, second, testMessage);
  }
}

Assert = {
  areEqual: function(first, second){
    equal(first, second, testMessage);
  },
  isUndefined: function(first){
    equal(typeof first, 'undefined', testMessage);
  },
  // isTrue and isFalse are passed their own local messages so use them instead...
  // I mean seriously... this suite is all over the place...
  isTrue: function(first, message){
    equal(first, true, message);
  },
  isFalse: function(first, message){
    equal(first, false, message);
  }
}

YUI.prototype.Assert = Assert;
