
test('ECMAScript', function () {

  var arr, count;

  arr = [1,2,3];

  raisesError(function(){ arr.forEach(); }, 'Array#forEach | should raise an error when no fn given');

  equals(arr.forEach(function(){}), undefined, 'Array#forEach | returns undefined');

  count = 0;
  arr.forEach(function(el, i, arr){
    arr.push(3)
    count++;
  });

  equals(count, 3, 'Array#forEach | will not visit elements that were added since beginning the loop');

});
