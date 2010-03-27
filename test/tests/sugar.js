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

test("String", function () {

  var test;

  equalsWithException('reuben sandwich'.capitalize(), 'Reuben sandwich', { environment: 'MooTools 1.2.4', result: 'Reuben Sandwich' }, 'String#capitalize');
  equalsWithException('REUBEN SANDWICH'.capitalize(), 'Reuben sandwich', { environment: 'MooTools 1.2.4', result: 'REUBEN SANDWICH' }, 'String#capitalize');
  equalsWithException('Reuben sandwich'.capitalize(), 'Reuben sandwich', { environment: 'MooTools 1.2.4', result: 'Reuben Sandwich' }, 'String#capitalize');

  same('wasabi'.chars(), ['w','a','s','a','b','i'], 'String#chars');

  equal('   wasabi   '.trim(), 'wasabi', 'String#chars');
  equal('   wasabi   '.trim('both'), 'wasabi', 'String#chars');
  equal('   wasabi   '.trim('leading'), 'wasabi   ', 'String#trim');
  equal('   wasabi   '.trim('left'), 'wasabi   ', 'String#trim');
  equal('   wasabi   '.trim('trailing'), '   wasabi', 'String#trim');
  equal('   wasabi   '.trim('right'), '   wasabi', 'String#trim');

  equal('wasabi'.pad(), 'wasabi', 'String#pad');
  equal('wasabi'.pad(-1), 'wasabi', 'String#pad');
  equal('wasabi'.pad(3), '   wasabi   ', 'String#pad');
  equal('wasabi'.pad(5), '     wasabi     ', 'String#pad');
  equal('wasabi'.pad(5, '-'), '-----wasabi-----', 'String#pad');
  equal('wasabi'.pad(2).pad(3, '-'), '---  wasabi  ---', 'String#pad');

  equal('wasabi'.repeat(0), '', 'String#repeat');
  equal('wasabi'.repeat(-1), 'wasabi', 'String#repeat');
  equal('wasabi'.repeat(2), 'wasabiwasabi', 'String#repeat');

  // Each without a block just returns false.
  equal('g'.each(), false, 'String#each');

  // Each without a first parameter assumes "each character"
  var result = 'g'.each(function(str, i){
    equal(str, 'g', 'String#each');
    equal(this, 'g', 'String#each');
  });

  equal(result, true, 'String#each');

  var counter = 0;
  'ginger'.each(function(str, i){
    equal(i, counter, 'String#each');
    equal(str, 'ginger'[counter], 'String#each');
    counter++;
  });
  equal(counter, 6, 'String#each');

  counter = 0;
  'ginger'.each('g', function(str, i){
    equal(str, 'g', 'String#each');
    counter++;
  });
  equal(counter, 2, 'String#each');

  counter = 0;
  var letters = ['g','i','g','e'];
  'ginger'.each(/[a-i]/g, function(str, i){
    equal(str, letters[i], 'String#each');
    counter++;
  });
  equal(counter, 4, 'String#each');

  counter = 0;
  var sentence = 'these pretzels are \n\n making me         thirsty!';
  var wordArray = ['these', 'pretzels', 'are', 'making', 'me', 'thirsty!'];
  sentence.eachWord(function(str, i){
    equal(str, wordArray[i], 'String#eachWord');
    counter ++;
  });
  equal(counter, 6, 'String#eachWord');

  counter = 0;
  var paragraph = 'these\npretzels\nare\n\nmaking\nme\n         thirsty!';
  var lineArray = ['these', 'pretzels', 'are', '', 'making', 'me', '         thirsty!'];
  paragraph.eachLine(function(str, i){
    equal(str, lineArray[i], 'String#eachLine');
    counter ++;
  });
  equal(counter, 7, 'String#eachLine');

  counter = 0;
  var essay = 'the history of the united states\n\n';
  essay +=    'it all began back in 1776 when someone declared something from someone.\n';
  essay +=    'it was at this point that we had to get our rears in gear\n\n';
  essay +=    'The British got their revenge in the late 60s with the British Invasion,\n';
  essay +=    'which claimed the lives of over 32,352 young women across the nation.\n\n\n\n\n';
  essay +=    'The End';
  var paragraphArray = ['the history of the united states', 'it all began back in 1776 when someone declared something from someone.\nit was at this point that we had to get our rears in gear', 'The British got their revenge in the late 60s with the British Invasion,\nwhich claimed the lives of over 32,352 young women across the nation.', 'The End'];
  essay.eachParagraph(function(str, i){
    equal(str, paragraphArray[i], 'String#eachParagraph');
    counter ++;
  });
  equal(counter, 4, 'String#eachParagraph');





});

