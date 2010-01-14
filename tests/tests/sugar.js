module("Sugar");

test("Array", function () {

  equals(['a','b','c'].indexOf('b'), 1, 'Array#indexOf');
  equals(['a','b','c'].indexOf('f'), -1, 'Array#indexOf');

});

test("Number", function () {

  equals((1).odd(), true, 'Number#odd');  // 1 is odd
  equals((2).odd(), false, 'Number#odd'); // 2 is not odd

  equals((1).even(), false, 'Number#even');  // 1 is not even
  equals((2).even(), true, 'Number#even');   // 2 is even

});
