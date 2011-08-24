
test('Array', function () {

  Array.sugar(false, 'max');

  equal([12,87,55].max(), 87, 'Array#max | Prototype still has control');

  Array.sugar(true, 'max');

  equal([12,87,55].max(), [87], 'Array#max | Sugar regained control');
  equal([12,87,55].min(), 12, 'Array#min | Prototype still has control');

  Array.sugar('min');

  equal([12,87,55].min(), [12], 'Array#min | Sugar regained control');

});
