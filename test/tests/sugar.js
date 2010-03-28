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

  equal('wasabi'.pad(3, '-', 'right'), 'wasabi---', 'String#pad');
  equal('4'.pad(3, '0', 'left'), '0004', 'String#pad');
  equal('wasabi'.pad(3, ' ', 'both'), '   wasabi   ', 'String#pad');

  equal('wasabi'.repeat(0), '', 'String#repeat');
  equal('wasabi'.repeat(-1), 'wasabi', 'String#repeat');
  equal('wasabi'.repeat(2), 'wasabiwasabi', 'String#repeat');

  // "each" will return an array of everything that was matched, defaulting to individual characters
  same('g'.each(), ['g'], 'String#each');

  // Each without a first parameter assumes "each character"
  var result = 'g'.each(function(str, i){
    equal(str, 'g', 'String#each');
    equal(this, 'g', 'String#each');
  });

  same(result, ['g'], 'String#each');

  var counter = 0;
  result = 'ginger'.each(function(str, i){
    equal(i, counter, 'String#each');
    equal(str, 'ginger'[counter], 'String#each');
    counter++;
  });
  equal(counter, 6, 'String#each');
  same(result, ['g','i','n','g','e','r'], 'String#each');

  counter = 0;
  result = 'ginger'.each('g', function(str, i){
    equal(str, 'g', 'String#each');
    counter++;
  });
  equal(counter, 2, 'String#each');
  same(result, ['g','g'], 'String#each');

  counter = 0;
  test = ['g','i','g','e'];
  result = 'ginger'.each(/[a-i]/g, function(str, i){
    equal(str, test[i], 'String#each');
    counter++;
  });
  equal(counter, 4, 'String#each');
  same(result, ['g','i','g','e'], 'String#each');

  counter = 0;
  test = ['three', 'two', 'one', 'contact'];
  result = 'three|two|one|contact'.each('|', 'split', function(str, i){
    equal(str, test[i], 'String#each');
    counter++;
  });
  equal(counter, 4, 'String#each');
  same(result, test, 'String#each');

  counter = 0;
  test = ['beebop', 'rocksteady', 'and donatello'];
  result = 'beebop, rocksteady, and donatello'.each(/,\s*/g, 'split', function(str, i){
    equal(str, test[i], 'String#each');
    counter++;
  });
  equal(counter, 3, 'String#each');
  same(result, test, 'String#each');


  /* .each should do the same thing as String#scan in ruby except that .each doesn't respect capturing groups */
  var testString = 'cruel world';

  result = testString.each(/\w+/g);
  same(result, ['cruel', 'world'], 'String#each');

  result = testString.each(/.../g);
  same(result, ['cru', 'el ', 'wor'], 'String#each');

  result = testString.each(/(...)/g);
  same(result, ['cru', 'el ', 'wor'], 'String#each');

  result = testString.each(/(..)(..)/g);
  same(result, ['crue', 'l wo'], 'String#each');


  counter = 0;
  test = [103,105,110,103,101,114];
  result = 'ginger'.bytes(function(str, i){
    equal(str, test[i], 'String#bytes');
    counter++;
  });
  equal(counter, 6, 'String#bytes');
  same(result, test, 'String#bytes');

  counter = 0;
  result = 'ginger'.chars(function(str, i){
    equal(i, counter, 'String#chars');
    equal(str, 'ginger'[counter], 'String#chars');
    counter++;
  });
  equal(counter, 6, 'String#chars');
  same(result, ['g','i','n','g','e','r'], 'String#chars');

  counter = 0;
  var sentence = 'these pretzels are \n\n making me         thirsty!\n\n';
  test = ['these', 'pretzels', 'are', 'making', 'me', 'thirsty!'];
  result = sentence.words(function(str, i){
    equal(str, test[i], 'String#words');
    counter ++;
  });
  equal(counter, 6, 'String#words');
  same(result, test, 'String#words');

  counter = 0;
  var paragraph = 'these\npretzels\nare\n\nmaking\nme\n         thirsty!\n\n\n\n';
  test = ['these', 'pretzels', 'are', '', 'making', 'me', '         thirsty!'];
  result = paragraph.lines(function(str, i){
    equal(str, test[i], 'String#lines');
    counter ++;
  });
  equal(counter, 7, 'String#lines');
  same(result, test, 'String#lines');

  counter = 0;
  var essay = 'the history of the united states\n\n';
  essay +=    'it all began back in 1776 when someone declared something from someone.\n';
  essay +=    'it was at this point that we had to get our rears in gear\n\n';
  essay +=    'The British got their revenge in the late 60s with the British Invasion,\n';
  essay +=    'which claimed the lives of over 32,352 young women across the nation.\n\n\n\n\n';
  essay +=    'The End\n\n\n\n\n\n\n';
  test = ['the history of the united states', 'it all began back in 1776 when someone declared something from someone.\nit was at this point that we had to get our rears in gear', 'The British got their revenge in the late 60s with the British Invasion,\nwhich claimed the lives of over 32,352 young women across the nation.', 'The End'];
  result = essay.paragraphs(function(str, i){
    equal(str, test[i], 'String#paragraphs');
    counter ++;
  });
  equal(counter, 4, 'String#paragraphs');
  same(result, test, 'String#paragraphs');


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



  equal('hello'.startsWith('hell'), true, 'String#startsWith');
  equal('HELLO'.startsWith('HELL'), true, 'String#startsWith');
  equal('HELLO'.startsWith('hell'), true, 'String#startsWith');
  equal('valley girls\nrock'.startsWith('valley girls'), true, 'String#startsWith');
  equal('valley girls\nrock'.startsWith('valley girls r'), false, 'String#startsWith');


  equal('vader'.endsWith('der'), true, 'String#endsWith');
  equal('VADER'.endsWith('DER'), true, 'String#endsWith');
  equal('VADER'.endsWith('der'), true, 'String#endsWith');
  equal('i aint your\nfather'.endsWith('father'), true, 'String#endsWith');
  equal('i aint your\nfather'.endsWith('r father'), false, 'String#endsWith');


  equal(''.isEmpty(), true, 'String#isEmpty');
  equal('mayonnaise'.isEmpty(), false, 'String#isEmpty');
  equal('            '.isEmpty(), false, 'String#isEmpty');
  equal('\n'.isEmpty(), false, 'String#isEmpty');


  equal(''.isBlank(), true, 'String#isBlank');
  equal('            '.isBlank(), true, 'String#isBlank');
  equal('\n'.isBlank(), true, 'String#isBlank');
  equal('\t\t\t\t'.isBlank(), true, 'String#isBlank');
  equal('　　　　　\n　　　'.isBlank(), true, 'String#isBlank'); // Japanese space
  equal('日本語では　「マス」　というの知ってた？'.isBlank(), false, 'String#isBlank');
  equal('mayonnaise'.isBlank(), false, 'String#isBlank');


  equal('foo'.has('f'), true, 'String#has');
  equal('foo'.has('oo'), true, 'String#has');
  equal('foo'.has(/f/), true, 'String#has');
  equal('foo'.has(/[a-g]/), true, 'String#has');
  equal('foo'.has(/[p-z]/), false, 'String#has');
  equal('foo'.has(/f$/), false, 'String#has');


  equal('five'.insert('schfifty '), 'schfifty five', 'String#insert');
  equal('dopamine'.insert('e', 3), 'dopeamine', 'String#insert');
  equal('spelling eror'.insert('r', -3), 'spelling error', 'String#insert');
  equal('flack'.insert('a', 0), 'aflack', 'String#insert');
  equal('five'.insert('schfifty', 20), 'five', 'String#insert');
  equal('five'.insert('schfifty', -20), 'five', 'String#insert');
  equal('five'.insert('schfifty', 4), 'fiveschfifty', 'String#insert');
  equal('five'.insert('schfifty', 5), 'five', 'String#insert');

  equal('カタカナ'.hanKaku(), 'ｶﾀｶﾅ', 'String#hankaku');
  equal('こんにちは。ヤマダタロウです。'.hanKaku(), 'こんにちは｡ﾔﾏﾀﾞﾀﾛｳです｡', 'String#hankaku');
  equal('こんにちは。ＴＡＲＯ　ＹＡＭＡＤＡです。'.hanKaku(), 'こんにちは｡TARO YAMADAです｡', 'String#hankaku');
  equal('　'.hanKaku(), ' ', 'String#hankaku');
  equal('　'.hanKaku('p'), ' ', 'String#hankaku');


  var barabara = 'こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！（笑）';
  equal(barabara.hanKaku(), 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)', 'String#hankaku');
  equal(barabara.hanKaku('a'), 'こんにちは。タロウ　YAMADAです。１８才です！（笑）', 'String#hankaku');
  equal(barabara.hanKaku('n'), 'こんにちは。タロウ　ＹＡＭＡＤＡです。18才です！（笑）', 'String#hankaku');
  equal(barabara.hanKaku('k'), 'こんにちは。ﾀﾛｳ　ＹＡＭＡＤＡです。１８才です！（笑）', 'String#hankaku');
  equal(barabara.hanKaku('p'), 'こんにちは｡タロウ ＹＡＭＡＤＡです｡１８才です!（笑）', 'String#hankaku');
  equal(barabara.hanKaku('s'), 'こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！(笑)', 'String#hankaku');

  equal(barabara.hanKaku('a', 'n'), 'こんにちは。タロウ　YAMADAです。18才です！（笑）', 'String#hankaku');
  equal(barabara.hanKaku('a', 'k'), 'こんにちは。ﾀﾛｳ　YAMADAです。１８才です！（笑）', 'String#hankaku');
  equal(barabara.hanKaku('a', 's'), 'こんにちは。タロウ　YAMADAです。１８才です！(笑)', 'String#hankaku');
  equal(barabara.hanKaku('a', 'p'), 'こんにちは｡タロウ YAMADAです｡１８才です!（笑）', 'String#hankaku');

  equal(barabara.hanKaku('alphabet'), 'こんにちは。タロウ　YAMADAです。１８才です！（笑）', 'String#hankaku');
  equal(barabara.hanKaku('numbers'), 'こんにちは。タロウ　ＹＡＭＡＤＡです。18才です！（笑）', 'String#hankaku');
  equal(barabara.hanKaku('katakana'), 'こんにちは。ﾀﾛｳ　ＹＡＭＡＤＡです。１８才です！（笑）', 'String#hankaku');
  equal(barabara.hanKaku('punctuation'), 'こんにちは｡タロウ ＹＡＭＡＤＡです｡１８才です!（笑）', 'String#hankaku');
  equal(barabara.hanKaku('special'), 'こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！(笑)', 'String#hankaku');


  equal('ｶﾀｶﾅ'.zenKaku(), 'カタカナ', 'String#zenKaku');
  equal(' '.zenKaku(), '　', 'String#zenKaku');
  equal(' '.zenKaku('p'), '　', 'String#zenKaku');


  barabara = 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)';

  equal(barabara.zenKaku(), 'こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！（笑）', 'String#zenKaku');
  equal(barabara.zenKaku('a'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡18才です!(笑)', 'String#zenKaku');
  equal(barabara.zenKaku('n'), 'こんにちは｡ﾀﾛｳ YAMADAです｡１８才です!(笑)', 'String#zenKaku');
  equal(barabara.zenKaku('k'), 'こんにちは｡タロウ YAMADAです｡18才です!(笑)', 'String#zenKaku');
  equal(barabara.zenKaku('p'), 'こんにちは。ﾀﾛｳ　YAMADAです。18才です！(笑)', 'String#zenKaku');
  equal(barabara.zenKaku('s'), 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!（笑）', 'String#zenKaku');

  equal(barabara.zenKaku('a', 'n'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡１８才です!(笑)', 'String#zenKaku');
  equal(barabara.zenKaku('a', 'k'), 'こんにちは｡タロウ ＹＡＭＡＤＡです｡18才です!(笑)', 'String#zenKaku');
  equal(barabara.zenKaku('a', 's'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡18才です!（笑）', 'String#zenKaku');
  equal(barabara.zenKaku('a', 'p'), 'こんにちは。ﾀﾛｳ　ＹＡＭＡＤＡです。18才です！(笑)', 'String#zenKaku');

  equal(barabara.zenKaku('alphabet'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡18才です!(笑)', 'String#zenKaku');
  equal(barabara.zenKaku('numbers'), 'こんにちは｡ﾀﾛｳ YAMADAです｡１８才です!(笑)', 'String#zenKaku');
  equal(barabara.zenKaku('katakana'), 'こんにちは｡タロウ YAMADAです｡18才です!(笑)', 'String#zenKaku');
  equal(barabara.zenKaku('special'), 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!（笑）', 'String#zenKaku');
  equal(barabara.zenKaku('punctuation'), 'こんにちは。ﾀﾛｳ　YAMADAです。18才です！(笑)', 'String#zenKaku');




  equal('カタカナ'.hiragana(), 'かたかな', 'String#hiragana');
  equal('ｶﾀｶﾅ'.hiragana(), 'かたかな', 'String#hiragana');
  equal('ｶﾀｶﾅ'.hiragana(false), 'ｶﾀｶﾅ', 'String#hiragana');
  equal(barabara.hiragana(), 'こんにちは｡たろう YAMADAです｡18才です!(笑)', 'String#hiragana');
  equal(barabara.zenKaku().hiragana(), 'こんにちは。たろう　ＹＡＭＡＤＡです。１８才です！（笑）', 'String#hiragana');
  equal(barabara.hiragana(false), 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)', 'String#hiragana');




  equal('ひらがな'.katakana(), 'ヒラガナ', 'String#katakana');
  equal(barabara.katakana(), 'コンニチハ｡ﾀﾛｳ YAMADAデス｡18才デス!(笑)', 'String#katakana');
  equal(barabara.zenKaku().katakana(), 'コンニチハ。タロウ　ＹＡＭＡＤＡデス。１８才デス！（笑）', 'String#katakana');


  equal('こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！（笑）'.katakana().hanKaku(), 'ｺﾝﾆﾁﾊ｡ﾀﾛｳ YAMADAﾃﾞｽ｡18才ﾃﾞｽ!(笑)', 'String#katakana');


  equal('4em'.toNumber(), 4, 'String#toNumber');
  equal('10px'.toNumber(), 10, 'String#toNumber');
  equal('10,000'.toNumber(), 10000, 'String#toNumber');
  equal('5,322,144,444'.toNumber(), 5322144444, 'String#toNumber');
  equal('10.532'.toNumber(), 10.532, 'String#toNumber');
  equal('10'.toNumber(), 10, 'String#toNumber');
  equal('95.25%'.toNumber(), 95.25, 'String#toNumber');
  equal('10.848'.toNumber(), 10.848, 'String#toNumber');

  equal('1234blue'.toNumber(), 1234, 'String#toNumber');
  equal(isNaN('0xA'.toNumber()), true, 'String#toNumber');
  equal('22.5'.toNumber(), 22.5, 'String#toNumber');
  equal(isNaN('blue'.toNumber()), true, 'String#toNumber');

  equal('010'.toNumber(), 10, 'String#toNumber');
  equal('0908'.toNumber(), 908, 'String#toNumber');
  equal('22.34.5'.toNumber(), 22.34, 'String#toNumber');

  equal(isNaN('........'.toNumber()), true, 'String#toNumber');

  equal('1.45kg'.toNumber(), 1.45, 'String#toNumber');
  equal('77.3'.toNumber(), 77.3, 'String#toNumber');
  equal('077.3'.toNumber(), 77.3, 'String#toNumber');
  equal(isNaN('0x77.3'.toNumber()), true, 'String#toNumber');
  equal('.3'.toNumber(), 0.3, 'String#toNumber');
  equal('0.1e6'.toNumber(), 100000, 'String#toNumber');


  equal('spoon'.reverse(), 'noops', 'String#reverse');
  equal('amanaplanacanalpanama'.reverse(), 'amanaplanacanalpanama', 'String#reverse');


  equal('the rain in     spain    falls mainly   on     the        plain'.compact(), 'the rain in spain falls mainly on the plain', 'String#compact');
  equal('\n\n\nthe \n\n\nrain in     spain    falls mainly   on     the        plain\n\n'.compact(), 'the rain in spain falls mainly on the plain', 'String#compact');
  equal('\n\n\n\n           \t\t\t\t          \n\n      \t'.compact(), '', 'String#compact');



  equal('foop'.at(0), 'f', 'String#at');
  equal('foop'.at(1), 'o', 'String#at');
  equal('foop'.at(2), 'o', 'String#at');
  equal('foop'.at(3), 'p', 'String#at');
  equal('foop'.at(4), null, 'String#at');
  equal('foop'.at(1224), null, 'String#at');
  equal('foop'.at(-1), 'p', 'String#at');
  equal('foop'.at(-2), 'o', 'String#at');
  equal('foop'.at(-3), 'o', 'String#at');
  equal('foop'.at(-4), 'f', 'String#at');
  equal('foop'.at(-5), null, 'String#at');
  equal('foop'.at(-1224), null, 'String#at');



  equal('quack'.first(), 'q', 'String#first');
  equal('quack'.first(2), 'qu', 'String#first');
  equal('quack'.first(3), 'qua', 'String#first');
  equal('quack'.first(4), 'quac', 'String#first');
  equal('quack'.first(20), 'quack', 'String#first');
  equal('quack'.first(0), '', 'String#first');
  equal('quack'.first(-1), '', 'String#first');



  equal('quack'.last(), 'k', 'String#last');
  equal('quack'.last(2), 'ck', 'String#last');
  equal('quack'.last(3), 'ack', 'String#last');
  equal('quack'.last(4), 'uack', 'String#last');
  equal('quack'.last(10), 'quack', 'String#last');
  equal('quack'.last(-1), '', 'String#last');


  equal('quack'.from(), 'quack', 'String#from');
  equal('quack'.from(0), 'quack', 'String#from');
  equal('quack'.from(2), 'ack', 'String#from');
  equal('quack'.from(4), 'k', 'String#from');
  equal('quack'.from(-1), 'k', 'String#from');
  equal('quack'.from(-3), 'ack', 'String#from');
  equal('quack'.from(-4), 'uack', 'String#from');


  equal('quack'.to(), 'quack', 'String#to');
  equal('quack'.to(0), 'q', 'String#to');
  equal('quack'.to(2), 'qua', 'String#to');
  equal('quack'.to(4), 'quack', 'String#to');
  equal('quack'.to(-1), 'quack', 'String#to');
  equal('quack'.to(-3), 'qua', 'String#to');
  equal('quack'.to(-4), 'qu', 'String#to');



});

test("RegExp", function () {

  equals('test regexp', 'test regexp', 'RegExp#escape');
  equals('test reg|exp', 'test reg\|exp', 'RegExp#escape');
  equals('hey there (budday)', 'hey there \(budday\)', 'RegExp#escape');
  equals('what a day...', 'what a day\.\.\.', 'RegExp#escape');
  equals('.', '\.', 'RegExp#escape');
  equals('*.+[]{}()?|/', '\*\.\+\[\]\{\}\(\)\?\|\/', 'RegExp#escape');





});

