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
  test = ['g','i','g','e'];
  'ginger'.each(/[a-i]/g, function(str, i){
    equal(str, test[i], 'String#each');
    counter++;
  });
  equal(counter, 4, 'String#each');

  counter = 0;
  test = ['three', 'two', 'one', 'contact'];
  'three|two|one|contact'.each('|', 'split', function(str, i){
    equal(str, test[i], 'String#each');
    counter++;
  });
  equal(counter, 4, 'String#each');

  counter = 0;
  test = ['beebop', 'rocksteady', 'and donatello'];
  'beebop, rocksteady, and donatello'.each(/,\s*/g, 'split', function(str, i){
    equal(str, test[i], 'String#each');
    counter++;
  });
  equal(counter, 3, 'String#each');

  counter = 0;
  var sentence = 'these pretzels are \n\n making me         thirsty!';
  test = ['these', 'pretzels', 'are', 'making', 'me', 'thirsty!'];
  sentence.eachWord(function(str, i){
    equal(str, test[i], 'String#eachWord');
    counter ++;
  });
  equal(counter, 6, 'String#eachWord');

  counter = 0;
  var paragraph = 'these\npretzels\nare\n\nmaking\nme\n         thirsty!';
  test = ['these', 'pretzels', 'are', '', 'making', 'me', '         thirsty!'];
  paragraph.eachLine(function(str, i){
    equal(str, test[i], 'String#eachLine');
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
  test = ['the history of the united states', 'it all began back in 1776 when someone declared something from someone.\nit was at this point that we had to get our rears in gear', 'The British got their revenge in the late 60s with the British Invasion,\nwhich claimed the lives of over 32,352 young women across the nation.', 'The End'];
  essay.eachParagraph(function(str, i){
    equal(str, test[i], 'String#eachParagraph');
    counter ++;
  });
  equal(counter, 4, 'String#eachParagraph');


  equal('ō'.normalize(), 'o', 'String#normalize');
  equal('o'.normalize(), 'o', 'String#normalize');
  equal('kyōto'.normalize(), 'kyoto', 'String#normalize');
  equal(''.normalize(), '', 'String#normalize');
  equal('äěìøůŷñ'.normalize(), 'aeiouyn', 'String#normalize');

  equal('Ō'.normalize(), 'O', 'String#normalize');
  equal('KYŌTO'.normalize(), 'KYOTO', 'String#normalize');
  equal('ÄĚÌØŮŶÑ'.normalize(), 'AEIOUYN', 'String#normalize');


  equal('o'.accent('-'), 'ō', 'String#accent');
  equal('a'.accent('`'), 'à', 'String#accent');
  equal('a'.accent('v'), 'ǎ', 'String#accent');
  equal('e'.accent(':'), 'ë', 'String#accent');
  equal('e'.accent('-'), 'ē', 'String#accent');
  equal('th'.accent(), 'þ', 'String#accent');
  equal('dh'.accent(), 'ð', 'String#accent');
  equal('ss'.accent(), 'ß', 'String#accent');
  equal('oe'.accent(), 'œ', 'String#accent');

  equal('A'.accent('`'), 'À', 'String#accent');
  equal('A'.accent('v'), 'Ǎ', 'String#accent');
  equal('E'.accent(':'), 'Ë', 'String#accent');
  equal('E'.accent('-'), 'Ē', 'String#accent');



  ok('hello'.startsWith('hell'), 'String#startsWith');
  ok('HELLO'.startsWith('HELL'), 'String#startsWith');
  ok('HELLO'.startsWith('hell'), 'String#startsWith');
  ok('valley girls\nrock'.startsWith('valley girls'), 'String#startsWith');
  equal('valley girls\nrock'.startsWith('valley girls r'), false, 'String#startsWith');


  ok('vader'.endsWith('der'), 'String#endsWith');
  ok('VADER'.endsWith('DER'), 'String#endsWith');
  ok('VADER'.endsWith('der'), 'String#endsWith');
  ok('i aint your\nfather'.endsWith('father'), 'String#endsWith');
  equal('i aint your\nfather'.endsWith('r father'), false, 'String#endsWith');

});

test("RegExp", function () {

  equals('test regexp', 'test regexp', 'RegExp#escape');
  equals('test reg|exp', 'test reg\|exp', 'RegExp#escape');
  equals('hey there (budday)', 'hey there \(budday\)', 'RegExp#escape');
  equals('what a day...', 'what a day\.\.\.', 'RegExp#escape');
  equals('*.+[]{}()?|/', '\*\.\+\[\]\{\}\(\)\?\|\/', 'RegExp#escape');

});

