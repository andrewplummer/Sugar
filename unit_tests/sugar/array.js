
test('Array', function () {

  fixPrototypeIterators();

  var arr;
  var count;

  same([{a:1},{a:2},{a:1}].exclude({a:1}), [{a:2}], 'Array#exclude | exclude all a:1');

});

