var arg1 = 1;
var arg2 = 2;
var arg3 = 3;
function TestObj() { };
TestObj.prototype.assertingEventHandler =
  function(event, assertEvent, assert1, assert2, assert3, a1, a2, a3) {
    assertEvent(event);
    assert1(a1);
    assert2(a2);
    assert3(a3);
  };

var globalBindTest = null;
