module("Sugar");

test('Number', function () {

  var counter;
  var ret;

  equals((4).toNumber(), 4, 'Number#toNumber');
  equals((10000).toNumber(), 10000, 'Number#toNumber');
  equals((5.2345).toNumber(), 5.2345, 'Number#toNumber');



  equals((5.5).ceil(), 6, 'Number#ceil');
  equals((5.14).ceil(), 6, 'Number#ceil');
  equals((5).ceil(), 5, 'Number#ceil');
  equals((-5.5).ceil(), -5, 'Number#ceil');
  equals((-5.14).ceil(), -5, 'Number#ceil');
  equals((-5).ceil(), -5, 'Number#ceil');


  equals((5.5).floor(), 5, 'Number#floor');
  equals((5.14).floor(), 5, 'Number#floor');
  equals((5.9).floor(), 5, 'Number#floor');
  equals((5).floor(), 5, 'Number#floor');
  equals((-5.5).floor(), -6, 'Number#floor');
  equals((-5.14).floor(), -6, 'Number#floor');
  equals((-5).floor(), -5, 'Number#floor');


  equals((-5).abs(), 5, 'Number#abs');
  equals((5).abs(), 5, 'Number#abs');
  equals((-3.324).abs(), 3.324, 'Number#abs');
  equals((3.324).abs(), 3.324, 'Number#abs');


  equals((3).pow(2), 9, 'Number#pow');
  equals((3).pow(1), 3, 'Number#pow');
  equals((12).pow(2), 144, 'Number#pow');
  equals((3).pow(3), 27, 'Number#pow');
  equals(isNaN((3).pow()), true, 'Number#pow');


  equals((3).round(), 3, 'Number#round');
  equals((3.241).round(), 3, 'Number#round');
  equals((3.752).round(), 4, 'Number#round');
  equals((-3.241).round(), -3, 'Number#round');
  equals((-3.752).round(), -4, 'Number#round');
  equals((3.241).round(1), 3.2, 'Number#round');
  equals((3.752).round(1), 3.8, 'Number#round');
  equals((3.241).round(2), 3.24, 'Number#round');
  equals((3.752).round(2), 3.75, 'Number#round');

  equals((322855.241).round(-2), 322900, 'Number#round');
  equals((322855.241).round(-3), 323000, 'Number#round');
  equals((322855.241).round(-4), 320000, 'Number#round');
  equals((322855.241).round(-6), 0, 'Number#round');
  equals((722855.241).round(-6), 1000000, 'Number#round');
  equals((722855.241).round(-8), 0, 'Number#round');


  equals((65).chr(), 'A', 'Number#chr');
  equals((24536).chr(), '忘', 'Number#chr');

  counter = 0;
  var dCounter = 5;
  ret = (5).downto(1, function(i){
    equal(i, dCounter, 'Number#downto');
    counter++;
    dCounter--;
  });
  equal(counter, 5, 'Number#downto');
  equal(ret, 5, 'Number#downto');


  counter = 0;
  var dCounter = 1;
  ret = (1).upto(5, function(i){
    equal(i, dCounter, 'Number#upto');
    counter++;
    dCounter++;
  });
  equal(counter, 5, 'Number#upto');
  equal(ret, 1, 'Number#upto');

  counter = 0;
  (5).downto(10, function(){});
  equal(counter, 0, 'Number#downto');

  counter = 0;
  (5).upto(1, function(){});
  equal(counter, 0, 'Number#downto');


  counter = 0;
  (5).times(function(){
    counter++;
  });
  equal(counter, 5, 'Number#times');



  equal((2).multipleOf(2), true, 'Number#multipleOf');
  equal((6).multipleOf(2), true, 'Number#multipleOf');
  equal((100).multipleOf(2), true, 'Number#multipleOf');
  equal((2).multipleOf(100), false, 'Number#multipleOf');
  equal((100).multipleOf(-2), true, 'Number#multipleOf');
  equal((6).multipleOf(-2), true, 'Number#multipleOf');
  equal((6).multipleOf(3), true, 'Number#multipleOf');
  equal((7).multipleOf(3), false, 'Number#multipleOf');
  equal((2.5).multipleOf(1.25), true, 'Number#multipleOf');



  equals((1).odd(), true, 'Number#odd');  // 1 is odd
  equals((2).odd(), false, 'Number#odd'); // 2 is not odd




  equals((1).even(), false, 'Number#even');  // 1 is not even
  equals((2).even(), true, 'Number#even');   // 2 is even



  equals((1).ordinalize(), '1st', 'Number#ordinalize');
  equals((2).ordinalize(), '2nd', 'Number#ordinalize');
  equals((3).ordinalize(), '3rd', 'Number#ordinalize');
  equals((4).ordinalize(), '4th', 'Number#ordinalize');
  equals((5).ordinalize(), '5th', 'Number#ordinalize');
  equals((6).ordinalize(), '6th', 'Number#ordinalize');
  equals((7).ordinalize(), '7th', 'Number#ordinalize');
  equals((8).ordinalize(), '8th', 'Number#ordinalize');
  equals((9).ordinalize(), '9th', 'Number#ordinalize');
  equals((10).ordinalize(), '10th', 'Number#ordinalize');
  equals((11).ordinalize(), '11th', 'Number#ordinalize');
  equals((12).ordinalize(), '12th', 'Number#ordinalize');
  equals((13).ordinalize(), '13th', 'Number#ordinalize');
  equals((14).ordinalize(), '14th', 'Number#ordinalize');
  equals((15).ordinalize(), '15th', 'Number#ordinalize');
  equals((20).ordinalize(), '20th', 'Number#ordinalize');
  equals((21).ordinalize(), '21st', 'Number#ordinalize');
  equals((22).ordinalize(), '22nd', 'Number#ordinalize');
  equals((23).ordinalize(), '23rd', 'Number#ordinalize');
  equals((24).ordinalize(), '24th', 'Number#ordinalize');
  equals((25).ordinalize(), '25th', 'Number#ordinalize');
  equals((100).ordinalize(), '100th', 'Number#ordinalize');
  equals((101).ordinalize(), '101st', 'Number#ordinalize');
  equals((102).ordinalize(), '102nd', 'Number#ordinalize');
  equals((103).ordinalize(), '103rd', 'Number#ordinalize');
  equals((104).ordinalize(), '104th', 'Number#ordinalize');
  equals((105).ordinalize(), '105th', 'Number#ordinalize');


  equals((100).format(), '100')
  equals((1).format(), '1')
  equals((10).format(), '10')
  equals((100).format(), '100')
  equals((1000).format(), '1,000')
  equals((10000).format(), '10,000')
  equals((100000).format(), '100,000')
  equals((1000000).format(), '1,000,000')
  equals((1000000.01).format(), '1,000,000.01')
  equals((-100).format(), '-100')
  equals((-1).format(), '-1')
  equals((-1000).format(), '-1,000')
  equals((-1000000.01).format(), '-1,000,000.01')

  equals((0.52).format(), '0.52')

  // These discrepancies are due to floating point variable limitations.
  equals((100046546510000.022435451).format(), '100,046,546,510,000.02')
  equals((-100046546510000.022435451).format(), '-100,046,546,510,000.02')

  equals((1000).format(' '), '1 000')
  equals((1532587).format(' '), '1 532 587')
  equals((1532587.5752).format(' ', ','), '1 532 587,5752')



  equals((0).hex(), '0', 'Number#hex')
  equals((10).hex(), 'a', 'Number#hex')
  equals((255).hex(), 'ff', 'Number#hex')
  equals((0.5).hex(), '0.8', 'Number#hex')
  equals((2.5).hex(), '2.8', 'Number#hex')
  equals((2553423).hex(), '26f64f', 'Number#hex')


  equals((24).isBlank(), false, 'Number#isBlank');
  equals((0).isBlank(), false, 'Number#isBlank');


  equals((0).seconds(), 0, 'Number#seconds');
  equals((1).seconds(), 1000, 'Number#seconds');
  equals((30).seconds(), 30000, 'Number#seconds');
  equals((60).seconds(), 60000, 'Number#seconds');


  equals((1).minutes(), 60000, 'Number#minutes');
  equals((10).minutes(), 600000, 'Number#minutes');
  equals((100).minutes(), 6000000, 'Number#minutes');
  equals((0).minutes(), 0, 'Number#minutes');
  equals((0.5).minutes(), 30000, 'Number#minutes');
  equals((1).minutes(), (60).seconds(), 'Number#minutes');

  equals((1).hours(), 3600000, 'Number#hours');
  equals((10).hours(), 36000000, 'Number#hours');
  equals((100).hours(), 360000000, 'Number#hours');
  equals((0).hours(), 0, 'Number#hours');
  equals((0.5).hours(), 1800000, 'Number#hours');
  equals((1).hours(), (60).minutes(), 'Number#hours');
  equals((1).hours(), (3600).seconds(), 'Number#hours');


  equals((1).days(), 86400000, 'Number#days');
  equals((10).days(), 864000000, 'Number#days');
  equals((100).days(), 8640000000, 'Number#days');
  equals((0).days(), 0, 'Number#days');
  equals((0.5).days(), 43200000, 'Number#days');
  equals((1).days(), (24).hours(), 'Number#days');
  equals((1).days(), (1440).minutes(), 'Number#days');
  equals((1).days(), (86400).seconds(), 'Number#days');


  equals((1).weeks(), 604800000, 'Number#weeks');
  equals((0.5).weeks(), 302400000, 'Number#weeks');
  equals((10).weeks(), 6048000000, 'Number#weeks');
  equals((0).weeks(), 0, 'Number#weeks');
  equals((1).weeks(), (7).days(), 'Number#weeks');
  equals((1).weeks(), (24 * 7).hours(), 'Number#weeks');
  equals((1).weeks(), (60 * 24 * 7).minutes(), 'Number#weeks');
  equals((1).weeks(), (60 * 60 * 24 * 7).seconds(), 'Number#weeks');

  equals((1).months(), 2592000000, 'Number#months');
  equals((0.5).months(), 1296000000, 'Number#months');
  equals((10).months(), 25920000000, 'Number#months');
  equals((0).months(), 0, 'Number#months');
  equals((1).months(), (30).days(), 'Number#months');
  equals((1).months(), (24 * 30).hours(), 'Number#months');
  equals((1).months(), (60 * 24 * 30).minutes(), 'Number#months');
  equals((1).months(), (60 * 60 * 24 * 30).seconds(), 'Number#months');

  equals((1).years(), 31557600000, 'Number#years');
  equals((0.5).years(), 15778800000, 'Number#years');
  equals((10).years(), 315576000000, 'Number#years');
  equals((0).years(), 0, 'Number#years');
  equals((1).years(), (365.25).days(), 'Number#years');
  equals((1).years(), (24 * 365.25).hours(), 'Number#years');
  equals((1).years(), (60 * 24 * 365.25).minutes(), 'Number#years');
  equals((1).years(), (60 * 60 * 24 * 365.25).seconds(), 'Number#years');



  /* compatibility */

  equals((1).second(), 1000, 'Number#second');
  equals((1).minute(), 60000, 'Number#minute');
  equals((1).hour(), 3600000, 'Number#hour');
  equals((1).day(), 86400000, 'Number#day');
  equals((1).week(), 604800000, 'Number#week');
  equals((1).month(), 2592000000, 'Number#month');
  equals((1).year(), 31557600000, 'Number#year');


  var buffer = 10; // Number of milliseconds "play" to make sure these tests pass.

  function dateEquals(d, offset, message){
    var now = new Date().getTime() + offset;
    var max = now + buffer;
    var min = now - buffer;
    var time = d.getTime();
    equals(time < max && time > min, true, message);
  }


  dateEquals((1).second().since(), 1000, 'Number#since');
  dateEquals((1).minute().since(), 60000, 'Number#since');
  dateEquals((1).hour().since(), 3600000, 'Number#since');
  dateEquals((1).day().since(), 86400000, 'Number#since');
  dateEquals((1).week().since(), 604800000, 'Number#since');
  dateEquals((1).month().since(), 2592000000, 'Number#since');
  dateEquals((1).year().since(), 31557600000, 'Number#since');

  dateEquals((1).second().fromNow(), 1000, 'Number#fromNow');
  dateEquals((1).minute().fromNow(), 60000, 'Number#fromNow');
  dateEquals((1).hour().fromNow(), 3600000, 'Number#fromNow');
  dateEquals((1).day().fromNow(), 86400000, 'Number#fromNow');
  dateEquals((1).week().fromNow(), 604800000, 'Number#fromNow');
  dateEquals((1).month().fromNow(), 2592000000, 'Number#fromNow');
  dateEquals((1).year().fromNow(), 31557600000, 'Number#fromNow');

  dateEquals((1).second().ago(), -1000, 'Number#ago');
  dateEquals((1).minute().ago(), -60000, 'Number#ago');
  dateEquals((1).hour().ago(), -3600000, 'Number#ago');
  dateEquals((1).day().ago(), -86400000, 'Number#ago');
  dateEquals((1).week().ago(), -604800000, 'Number#ago');
  dateEquals((1).month().ago(), -2592000000, 'Number#ago');
  dateEquals((1).year().ago(), -31557600000, 'Number#ago');

  dateEquals((1).second().until(), -1000, 'Number#until');
  dateEquals((1).minute().until(), -60000, 'Number#until');
  dateEquals((1).hour().until(), -3600000, 'Number#until');
  dateEquals((1).day().until(), -86400000, 'Number#until');
  dateEquals((1).week().until(), -604800000, 'Number#until');
  dateEquals((1).month().until(), -2592000000, 'Number#until');
  dateEquals((1).year().until(), -31557600000, 'Number#until');



  dateEquals((1).secondSince(), 1000, 'Number#secondSince');
  dateEquals((5).secondsSince(), 5000, 'Number#secondsSince');
  dateEquals((10).minutesSince(), 600000, 'Number#minutesSince');

  dateEquals((1).secondFromNow(), 1000, 'Number#secondFromNow');
  dateEquals((5).secondsFromNow(), 5000, 'Number#secondsFromNow');
  dateEquals((10).minutesFromNow(), 600000, 'Number#minutesFromNow');

  dateEquals((1).secondAgo(), -1000, 'Number#secondAgo');
  dateEquals((5).secondsAgo(), -5000, 'Number#secondAgo');
  dateEquals((10).secondsAgo(), -10000, 'Number#secondAgo');

  dateEquals((1).secondUntil(), -1000, 'Number#secondUntil');
  dateEquals((5).secondsUntil(), -5000, 'Number#secondUntil');
  dateEquals((10).secondsUntil(), -10000, 'Number#secondUntil');


  dateEquals((5).minutes().since((5).minutes().ago()), 0, 'Number#minutesSince');
  dateEquals((5).minutesSince((5).minutesAgo()), 0, 'Number#minutesSince');
  dateEquals((10).minutesSince((5).minutesAgo()), 1000 * 60 * 5, 'Number#minutesSince');

  dateEquals((5).minutes().fromNow((5).minutes().ago()), 0, 'Number#minutesfromNow');
  dateEquals((5).minutesFromNow((5).minutesAgo()), 0, 'Number#minutesFromNow');
  dateEquals((10).minutesFromNow((5).minutesAgo()), 1000 * 60 * 5, 'Number#minutesFromNow');

  dateEquals((5).minutes().ago((5).minutes().fromNow()), 0, 'Number#minutesAgo');
  dateEquals((5).minutesAgo((5).minutesFromNow()), 0, 'Number#minutesAgo');
  dateEquals((10).minutesAgo((5).minutesFromNow()), -(1000 * 60 * 5), 'Number#minutesAgo');

  dateEquals((5).minutes().until((5).minutes().fromNow()), 0, 'Number#minutesUntil');
  dateEquals((5).minutesUntil((5).minutesFromNow()), 0, 'Number#minutesUntil');
  dateEquals((10).minutesUntil((5).minutesFromNow()), -(1000 * 60 * 5), 'Number#minutesUntil');


  var christmas = new Date('December 25, 1965');
  equals((5).minutesUntil(christmas).getTime(), new Date(christmas.getTime() - (5 * 60 * 1000)).getTime(), 'Number#minutesUntil');
  equals((5).minutesSince(christmas).getTime(), new Date(christmas.getTime() + (5 * 60 * 1000)).getTime(), 'Number#minutesSince');

  equals((5).hoursUntil(christmas).getTime(), new Date(christmas.getTime() - (5 * 60 * 60 * 1000)).getTime(), 'Number#hoursUntil');
  equals((5).hoursSince(christmas).getTime(), new Date(christmas.getTime() + (5 * 60 * 60 * 1000)).getTime(), 'Number#hoursSince');

  equals((5).daysUntil(christmas).getTime(), new Date(christmas.getTime() - (5 * 24 * 60 * 60 * 1000)).getTime(), 'Number#daysUntil');
  equals((5).daysSince(christmas).getTime(), new Date(christmas.getTime() + (5 * 24 * 60 * 60 * 1000)).getTime(), 'Number#daysSince');

  equals((5).weeksUntil(christmas).getTime(), new Date(christmas.getTime() - (5 * 7 * 24 * 60 * 60 * 1000)).getTime(), 'Number#weeksUntil');
  equals((5).weeksSince(christmas).getTime(), new Date(christmas.getTime() + (5 * 7 * 24 * 60 * 60 * 1000)).getTime(), 'Number#weeksSince');

  equals((5).monthsUntil(christmas).getTime(), new Date(christmas.getTime() - (5 * 30 * 24 * 60 * 60 * 1000)).getTime(), 'Number#monthsUntil');
  equals((5).monthsSince(christmas).getTime(), new Date(christmas.getTime() + (5 * 30 * 24 * 60 * 60 * 1000)).getTime(), 'Number#monthsSince');

  equals((5).yearsUntil(christmas).getTime(), new Date(christmas.getTime() - (5 * 365.25 * 24 * 60 * 60 * 1000)).getTime(), 'Number#yearsUntil');
  equals((5).yearsSince(christmas).getTime(), new Date(christmas.getTime() + (5 * 365.25 * 24 * 60 * 60 * 1000)).getTime(), 'Number#yearsSince');

});

test('String', function () {



  equals('test regexp'.escapeRegExp(), 'test regexp', 'RegExp#escape');
  equals('test reg|exp'.escapeRegExp(), 'test reg\\|exp', 'RegExp#escape');
  equals('hey there (budday)'.escapeRegExp(), 'hey there \\(budday\\)', 'RegExp#escape');
  equals('what a day...'.escapeRegExp(), 'what a day\\.\\.\\.', 'RegExp#escape');
  equals('.'.escapeRegExp(), '\\.', 'RegExp#escape');
  equals('*.+[]{}()?|/'.escapeRegExp(), '\\*\\.\\+\\[\\]\\{\\}\\(\\)\\?\\|\\/', 'RegExp#escape');


  var test;

  equalsWithException('reuben sandwich'.capitalize(), 'Reuben sandwich', { environment: 'MooTools 1.2.4', result: 'Reuben Sandwich' }, 'String#capitalize');
  equalsWithException('REUBEN SANDWICH'.capitalize(), 'Reuben sandwich', { environment: 'MooTools 1.2.4', result: 'REUBEN SANDWICH' }, 'String#capitalize');
  equalsWithException('Reuben sandwich'.capitalize(), 'Reuben sandwich', { environment: 'MooTools 1.2.4', result: 'Reuben Sandwich' }, 'String#capitalize');

  same('wasabi'.chars(), ['w','a','s','a','b','i'], 'String#chars');

  equal('   wasabi   '.trim(), 'wasabi', 'String#chars');
  equal('   wasabi   '.trimLeft(), 'wasabi   ', 'String#trim');
  equal('   wasabi   '.trimLeft(), 'wasabi   ', 'String#trim');
  equal('   wasabi   '.trimRight(), '   wasabi', 'String#trim');
  equal('   wasabi   '.trimRight(), '   wasabi', 'String#trim');

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


  /* test each char code */
  counter = 0;
  test = [103,105,110,103,101,114];
  result = 'ginger'.bytes(function(str, i){
    equal(str, test[i], 'String#bytes');
    counter++;
  });
  equal(counter, 6, 'String#bytes');
  same(result, test, 'String#bytes');

  /* test each char */
  counter = 0;
  result = 'ginger'.chars(function(str, i){
    equal(i, counter, 'String#chars');
    equal(str, 'ginger'[counter], 'String#chars');
    counter++;
  });
  equal(counter, 6, 'String#chars');
  same(result, ['g','i','n','g','e','r'], 'String#chars');

  /* test each char collects when properly returned */
  counter = 0;
  result = 'ginger'.chars(function(str, i){
    counter++;
    return str.toUpperCase();
  });
  equal(counter, 6, 'String#chars');
  same(result, ['G','I','N','G','E','R'], 'String#chars');

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
  equal('0'.isBlank(), false, 'String#isBlank');
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


  equal('ガ'.hanKaku(), 'ｶﾞ', 'String#hankaku:Convert dakuten');
  equal('ｶﾞ'.zenKaku(), 'ガ', 'String#zenkaku:Convert dakuten');
  equal('ｶﾞ'.hiragana(), 'が', 'String#hiragana:Convert dakuten');


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
  equal('fa'.last(3), 'fa', 'String#last');


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


  same('October 16, 1987'.toDate(), new Date('October 16, 1987'), 'String#toDate');
  same('11/5/56'.toDate(), new Date('11/5/56'), 'String#toDate');
  same(''.toDate().toString(), new Date('').toString(), 'String#toDate');
  same('barf'.toDate().toString(), new Date('barf').toString(), 'String#toDate');


  same('hop_on_pop'.dasherize(), 'hop-on-pop', 'String#dasherize');
  same('HOP_ON_POP'.dasherize(), 'HOP-ON-POP', 'String#dasherize');
  same('hopOnPop'.dasherize(), 'hopOnPop', 'String#dasherize');
  same('hop-on-pop'.camelize(), 'HopOnPop', 'String#camelize');
  same('HOP-ON-POP'.camelize(), 'HopOnPop', 'String#camelize');
  same('hop_on_pop'.camelize(), 'HopOnPop', 'String#camelize');
  same('hop-on-pop'.camelize('lower'), 'hopOnPop', 'String#camelize');
  same('HOP-ON-POP'.camelize('lower'), 'hopOnPop', 'String#camelize');
  same('hop_on_pop'.camelize('lower'), 'hopOnPop', 'String#camelize');
  same('hopOnPop'.underscore(), 'hop_on_pop', 'String#underscore');
  same('HopOnPop'.underscore(), 'hop_on_pop', 'String#underscore');
  same('HOPONPOP'.underscore(), 'hoponpop', 'String#underscore');
  same('HOP-ON-POP'.underscore(), 'hop_on_pop', 'String#underscore');
  same('hop-on-pop'.underscore(), 'hop_on_pop', 'String#underscore');


  equal('what a shame of a title'.titleize(), 'What A Shame Of A Title', 'String#titleize');
  equal('What A Shame Of A Title'.titleize(), 'What A Shame Of A Title', 'String#titleize');
  equal(' what a shame of a title    '.titleize(), 'What A Shame Of A Title', 'String#titleize');
  equal(' what a shame of\n a title    '.titleize(), 'What A Shame Of A Title', 'String#titleize');



  equal('ア'.isKatakana(), true, 'String#isKatakana');
  equal('ｱ'.isKatakana(), true, 'String#isKatakana');
  equal('ァ'.isKatakana(), true, 'String#isKatakana');
  equal('ah'.isKatakana(), false, 'String#isKatakana');
  equal('アイカムインピース'.isKatakana(), true, 'String#isKatakana');
  equal('アイカムinピース'.isKatakana(), false, 'String#isKatakana');
  equal('アイカム イン ピース'.isKatakana(), true, 'String#isKatakana');

  equal('ア'.hasKatakana(), true, 'String#hasKatakana');
  equal('ｱ'.hasKatakana(), true, 'String#hasKatakana');
  equal('ah'.hasKatakana(), false, 'String#hasKatakana');
  equal('aアh'.hasKatakana(), true, 'String#hasKatakana');
  equal('aｱh'.hasKatakana(), true, 'String#hasKatakana');
  equal('アイカムインピース'.hasKatakana(), true, 'String#hasKatakana');
  equal('アイカムinピース'.hasKatakana(), true, 'String#hasKatakana');


  equal('あ'.isHiragana(), true, 'String#isHiragana');
  equal('ぁ'.isHiragana(), true, 'String#isHiragana');
  equal('ah'.isHiragana(), false, 'String#isHiragana');
  equal('あいかむいんぴーす'.isHiragana(), true, 'String#isHiragana');
  equal('あいかむinぴーす'.isHiragana(), false, 'String#isHiragana');
  equal('あいかむ in ぴーす'.isHiragana(), false, 'String#isHiragana');
  equal('アイカム イン ピース'.isHiragana(), false, 'String#isHiragana');


  equal('あ'.hasHiragana(), true, 'String#hasHiragana');
  equal('ぁ'.hasHiragana(), true, 'String#hasHiragana');
  equal('ah'.hasHiragana(), false, 'String#hasHiragana');
  equal('aあh'.hasHiragana(), true, 'String#hasHiragana');
  equal('aぁh'.hasHiragana(), true, 'String#hasHiragana');
  equal('あいかむいんぴーす'.hasHiragana(), true, 'String#hasHiragana');
  equal('あいかむinぴーす'.hasHiragana(), true, 'String#hasHiragana');




  equal(''.isKana(), false, 'String#isKana');
  equal('あいうえお'.isKana(), true, 'String#isKana');
  equal('アイウエオ'.isKana(), true, 'String#isKana');
  equal('あうえおアイウエオ'.isKana(), true, 'String#isKana');
  equal('あうえおaeiouアイウエオ'.isKana(), false, 'String#isKana');
  equal('  あいうえお  '.isKana(), true, 'String#isKana');
  equal('  アイウエオ \n '.isKana(), true, 'String#isKana');





  equal(''.hasKana(), false, 'String#hasKana');
  equal('aeiou'.hasKana(), false, 'String#hasKana');
  equal('あいうえお'.hasKana(), true, 'String#hasKana');
  equal('アイウエオ'.hasKana(), true, 'String#hasKana');
  equal('あうえおアイウエオ'.hasKana(), true, 'String#hasKana');
  equal('あうえおaeiouアイウエオ'.hasKana(), true, 'String#hasKana');
  equal('aeiouアaeiou'.hasKana(), true, 'String#hasKana');
  equal('aeiouaeiou'.hasKana(), false, 'String#hasKana');



  equal(''.isHan(), false, 'String#isHan');
  equal('aeiou'.isHan(), false, 'String#isHan');
  equal('あいうえお'.isHan(), false, 'String#isHan');
  equal('アイウエオ'.isHan(), false, 'String#isHan');
  equal('あうえおaeiouアイウエオ'.isHan(), false, 'String#isHan');
  equal('合コン'.isHan(), false, 'String#isHan');
  equal('語学'.isHan(), true, 'String#isHan');
  equal('庭には二羽鶏がいる。'.isHan(), false, 'String#isHan');
  equal(' 語学 '.isHan(), true, 'String#isHan');
  equal(' 語学\t '.isHan(), true, 'String#isHan');



  equal(''.hasHan(), false, 'String#hasHan');
  equal('aeiou'.hasHan(), false, 'String#hasHan');
  equal('あいうえお'.hasHan(), false, 'String#hasHan');
  equal('アイウエオ'.hasHan(), false, 'String#hasHan');
  equal('あうえおaeiouアイウエオ'.hasHan(), false, 'String#hasHan');
  equal('合コン'.hasHan(), true, 'String#hasHan');
  equal('語学'.hasHan(), true, 'String#hasHan');
  equal('庭には二羽鶏がいる。'.hasHan(), true, 'String#hasHan');
  equal(' 語学 '.hasHan(), true, 'String#hasHan');
  equal(' 語学\t '.hasHan(), true, 'String#hasHan');





  equal(''.isKanji(), false, 'String#isKanji');
  equal('aeiou'.isKanji(), false, 'String#isKanji');
  equal('あいうえお'.isKanji(), false, 'String#isKanji');
  equal('アイウエオ'.isKanji(), false, 'String#isKanji');
  equal('あうえおaeiouアイウエオ'.isKanji(), false, 'String#isKanji');
  equal('合コン'.isKanji(), false, 'String#isKanji');
  equal('語学'.isKanji(), true, 'String#isKanji');
  equal('庭には二羽鶏がいる。'.isKanji(), false, 'String#isKanji');
  equal(' 語学 '.isKanji(), true, 'String#isKanji');
  equal(' 語学\t '.isKanji(), true, 'String#isKanji');



  equal(''.hasKanji(), false, 'String#hasKanji');
  equal('aeiou'.hasKanji(), false, 'String#hasKanji');
  equal('あいうえお'.hasKanji(), false, 'String#hasKanji');
  equal('アイウエオ'.hasKanji(), false, 'String#hasKanji');
  equal('あうえおaeiouアイウエオ'.hasKanji(), false, 'String#hasKanji');
  equal('合コン'.hasKanji(), true, 'String#hasKanji');
  equal('語学'.hasKanji(), true, 'String#hasKanji');
  equal('庭には二羽鶏がいる。'.hasKanji(), true, 'String#hasKanji');
  equal(' 語学 '.hasKanji(), true, 'String#hasKanji');
  equal(' 語学\t '.hasKanji(), true, 'String#hasKanji');


  equal('모'.isHangul(), true, 'String#isHangul');
  equal('난 뻔데기를 싫어 한 사람 이다...너는?'.isHangul(), false, 'String#isHangul');
  equal('안녕 하세요'.isHangul(), true, 'String#isHangul');
  equal('ㅠブラじゃない！'.isHangul(), false, 'String#isHangul');

  equal('모'.hasHangul(), true, 'String#hasHangul');
  equal('난 뻔데기를 싫어 한 사람 이다...너는?'.hasHangul(), true, 'String#hasHangul');
  equal('안녕 하세요.'.hasHangul(), true, 'String#hasHangul');
  equal('ㅠブラじゃない！'.hasHangul(), false, 'String#hasHangul');


  var stripped;
  var html =
    '<div class="outer">' +
      '<p>text with <a href="http://foobar.com/">links</a>, &quot;entitites&quot; and <b>bold</b> tags</p>' +
    '</div>';

  var malformed_html = '<div class="outer"><p>paragraph';


  stripped =
    '<div class="outer">' +
      '<p>text with links, &quot;entitites&quot; and <b>bold</b> tags</p>' +
    '</div>';
  equal(html.stripTags('a'), stripped, 'String#stripTags');
  equal(html.stripTags('a') == html, false, 'String#stripTags');


  stripped =
    '<div class="outer">' +
      '<p>text with links, &quot;entitites&quot; and bold tags</p>' +
    '</div>';
  equal(html.stripTags('a', 'b'), stripped, 'String#stripTags');


  stripped =
    '<div class="outer">' +
      'text with links, &quot;entitites&quot; and <b>bold</b> tags' +
    '</div>';
  equal(html.stripTags('p', 'a'), stripped, 'String#stripTags');


  stripped = '<p>text with <a href="http://foobar.com/">links</a>, &quot;entitites&quot; and <b>bold</b> tags</p>';
  equal(html.stripTags('div'), stripped, 'String#stripTags');


  stripped = 'text with links, &quot;entitites&quot; and bold tags';
  equal(html.stripTags(), stripped, 'String#stripTags');


  stripped = '<p>paragraph';
  equal(malformed_html.stripTags('div'), stripped, 'String#stripTags');

  stripped = '<div class="outer">paragraph';
  equal(malformed_html.stripTags('p'), stripped, 'String#stripTags');

  stripped = 'paragraph';
  equal(malformed_html.stripTags(), stripped, 'String#stripTags');



  equal('<b NOT BOLD</b>'.stripTags(), '<b NOT BOLD', 'String#stripTags');
  equal('a < b'.stripTags(), 'a < b', 'String#stripTags');
  equal('a > b'.stripTags(), 'a > b', 'String#stripTags');
  equal('</foo  >>'.stripTags(), '>', 'String#stripTags');



  /* Stipping self-closing tags */
  equal('<input type="text" class="blech" />'.stripTags(), '', 'String#stripTags');

  html =
    '<form action="poo.php" method="post">' +
    '<p>' +
      '<label>label for text:</label>' +
      '<input type="text" value="brabra" />' +
      '<input type="submit" value="submit" />' +
    '</p>' +
    '</form>';

  equal(html.stripTags(), 'label for text:', 'String#stripTags');
  equal(html.stripTags('input'), '<form action="poo.php" method="post"><p><label>label for text:</label></p></form>', 'String#stripTags');
  equal(html.stripTags('input', 'p', 'form'), '<label>label for text:</label>', 'String#stripTags');

  /* Stripping namespaced tags */
  equal('<xsl:template>foobar</xsl:template>'.stripTags(), 'foobar', 'String#stripTags');
  equal('<xsl:template>foobar</xsl:template>'.stripTags('xsl:template'), 'foobar', 'String#stripTags');
  equal('<xsl/template>foobar</xsl/template>'.stripTags('xsl/template'), 'foobar', 'String#stripTags');


  /* No errors on RegExp */
  equal('<xsl(template>foobar</xsl(template>'.stripTags('xsl(template'), 'foobar', 'String#stripTags');




  html =
    '<div class="outer">' +
      '<p>text with <a href="http://foobar.com/">links</a>, &quot;entitites&quot; and <b>bold</b> tags</p>' +
    '</div>';
  var removed;

  removed =
    '<div class="outer">' +
      '<p>text with , &quot;entitites&quot; and <b>bold</b> tags</p>' +
    '</div>';
  equal(html.removeTags('a'), removed, 'String#removeTags');
  equal(html.removeTags('a') == html, false, 'String#removeTags');


  removed =
    '<div class="outer">' +
      '<p>text with , &quot;entitites&quot; and  tags</p>' +
    '</div>';
  equal(html.removeTags('a', 'b'), removed, 'String#removeTags');


  removed =
    '<div class="outer"></div>';
  equal(html.removeTags('p', 'a'), removed, 'String#removeTags');


  equal(html.removeTags('div'), '', 'String#removeTags');
  equal(html.removeTags(), '', 'String#removeTags');

  equal(malformed_html.removeTags('div'), malformed_html, 'String#removeTags');
  equal(malformed_html.removeTags('p'), malformed_html, 'String#removeTags');
  equal(malformed_html.removeTags(), malformed_html, 'String#removeTags');



  equal('<b NOT BOLD</b>'.removeTags(), '<b NOT BOLD</b>', 'String#removeTags');
  equal('a < b'.removeTags(), 'a < b', 'String#removeTags');
  equal('a > b'.removeTags(), 'a > b', 'String#removeTags');
  equal('</foo  >>'.removeTags(), '</foo  >>', 'String#removeTags');



  /* Stipping self-closing tags */
  equal('<input type="text" class="blech" />'.removeTags(), '', 'String#removeTags');

  html =
    '<form action="poo.php" method="post">' +
    '<p>' +
      '<label>label for text:</label>' +
      '<input type="text" value="brabra" />' +
      '<input type="submit" value="submit" />' +
    '</p>' +
    '</form>';

  equal(html.removeTags(), '', 'String#removeTags');
  equal(html.removeTags('input'), '<form action="poo.php" method="post"><p><label>label for text:</label></p></form>', 'String#removeTags');
  equal(html.removeTags('input', 'p', 'form'), '', 'String#removeTags');

  /* Stripping namespaced tags */
  equal('<xsl:template>foobar</xsl:template>'.removeTags(), '', 'String#removeTags');
  equal('<xsl:template>foobar</xsl:template>'.removeTags('xsl:template'), '', 'String#removeTags');
  equal('<xsl/template>foobar</xsl/template>'.removeTags('xsl/template'), '', 'String#removeTags');


  /* No errors on RegExp */
  equal('<xsl(template>foobar</xsl(template>'.removeTags('xsl(template'), '', 'String#removeTags');



});

test('Array', function () {


});



test('Array', function () {

    var arr;
    var count;

    equals(['a','b','c'].indexOf('b'), 1, 'Array#indexOf');
    equals(['a','b','c'].indexOf('b', 0), 1, 'Array#indexOf');
    equals(['a','b','c'].indexOf('a'), 0, 'Array#indexOf');
    equals(['a','b','c'].indexOf('f'), -1, 'Array#indexOf');

    equals(['a','b','c','b'].indexOf('b'), 1, 'Array#indexOf');
    equals(['a','b','c','b'].indexOf('b', 2), 3, 'Array#indexOf');

    equals([5,2,4].indexOf(5), 0, 'Array#indexOf');
    equals([5,2,4].indexOf(2), 1, 'Array#indexOf');
    equals([5,2,4].indexOf(4), 2, 'Array#indexOf');
    equals([5,2,4,4].indexOf(4, 3), 3, 'Array#indexOf');

    equals([5,2,4,4].indexOf(4, 10), -1, 'Array#indexOf');
    equals([5,2,4,4].indexOf(4, -10), 2, 'Array#indexOf');
    equals([5,2,4,4].indexOf(4, -1), 3, 'Array#indexOf');

    equals([{ foo: 'bar' }].indexOf({ foo: 'bar' }), -1, 'Array#indexOf');


    equals(['a', 'b', 'c', 'd', 'a', 'b'].lastIndexOf('b'), 5, 'Array#lastIndexOf');
    equals(['a', 'b', 'c', 'd', 'a', 'b'].lastIndexOf('b', 4), 1, 'Array#lastIndexOf');
    equals(['a', 'b', 'c', 'd', 'a', 'b'].lastIndexOf('z'), -1, 'Array#lastIndexOf');

    equals([1,5,6,8,8,2,5,3].lastIndexOf(3), 7, 'Array#lastIndexOf');
    equals([1,5,6,8,8,2,5,3].lastIndexOf(3, 0), -1, 'Array#lastIndexOf');
    equals([1,5,6,8,8,2,5,3].lastIndexOf(8), 4, 'Array#lastIndexOf');
    equals([1,5,6,8,8,2,5,3].lastIndexOf(8, 3), 3, 'Array#lastIndexOf');
    equals([1,5,6,8,8,2,5,3].lastIndexOf(1), 0, 'Array#lastIndexOf');
    equals([1,5,6,8,8,2,5,3].lastIndexOf(42), -1, 'Array#lastIndexOf');

    equals([2, 5, 9, 2].lastIndexOf(2), 3, 'Array#lastIndexOf');
    equals([2, 5, 9, 2].lastIndexOf(7), -1, 'Array#lastIndexOf');
    equals([2, 5, 9, 2].lastIndexOf(2, 3), 3, 'Array#lastIndexOf');
    equals([2, 5, 9, 2].lastIndexOf(2, 2), 0, 'Array#lastIndexOf');
    equals([2, 5, 9, 2].lastIndexOf(2, -2), 0, 'Array#lastIndexOf');
    equals([2, 5, 9, 2].lastIndexOf(2, -1), 3, 'Array#lastIndexOf');
    equals([2, 5, 9, 2].lastIndexOf(2, 10), 3, 'Array#lastIndexOf');
    equals([2, 5, 9, 2].lastIndexOf(2, -10), -1, 'Array#lastIndexOf');

    equals([{ foo: 'bar' }].lastIndexOf({ foo: 'bar' }), -1, 'Array#lastIndexOf');



    equals([12, 5, 8, 130, 44].every(function(el, i, a){ return el >= 10 }), false, 'Array#every');
    equals([12, 54, 18, 130, 44].every(function(el, i, a){ return el >= 10 }), true, 'Array#every');
    ['a'].every(function(el, i, a){
      same(a, ['a'], 'Array#every');
      equals(el, 'a', 'Array#every');
      equals(i, 0, 'Array#every');
      equals(this, 'this', 'Array#every');
    }, 'this');



    equals([12, 5, 8, 130, 44].some(function(el, i, a){ return el > 10 }), true, 'Array#some');
    equals([12, 5, 8, 130, 44].some(function(el, i, a){ return el < 10 }), true, 'Array#some');
    equals([12, 54, 18, 130, 44].some(function(el, i, a){ return el >= 10 }), true, 'Array#some');
    equals([12, 5, 8, 130, 44].some(function(el, i, a){ return el < 4 }), false, 'Array#some');
    equals([].some(function(el, i, a){ return el > 10 }), false, 'Array#some');
    ['a'].some(function(el, i, a){
      same(a, ['a'], 'Array#some');
      equals(el, 'a', 'Array#some');
      equals(i, 0, 'Array#some');
      equals(this, 'this', 'Array#some');
    }, 'this');





    same([12,4,8,130,44].filter(function(el, i, a){ return el > 10 }), [12,130,44], 'Array#filter');
    same([12,4,8,130,44].filter(function(el, i, a){ return el < 10 }), [4,8], 'Array#filter');
    ['a'].filter(function(el, i, a){
      same(a, ['a'], 'Array#filter');
      equals(el, 'a', 'Array#filter');
      equals(i, 0, 'Array#filter');
      equals(this, 'this', 'Array#filter');
    }, 'this');




    arr = [2, 5, 9];
    arr.forEach(function(el, i, a){
      equals(el, arr[i], 'Array#forEach');
    });
    arr.forEach(function(el, i, a){
      equals(el, a[i], 'Array#forEach');
    });

    arr = ['a', [1], { foo: 'bar' }, 352];
    count = 0;
    arr.forEach(function(el, i, a){
        count++;
    });
    equals(count, 4, 'Array#forEach');

    ['a'].forEach(function(el, i, a){
      same(a, ['a'], 'Array#forEach');
      equals(el, 'a', 'Array#forEach');
      equals(i, 0, 'Array#forEach');
      equals(this, 'this', 'Array#forEach');
    }, 'this');




    arr = [2, 5, 9];
    arr.each(function(el, i, a){
      equals(el, arr[i], 'Array#each');
    });
    arr.each(function(el, i, a){
      equals(el, a[i], 'Array#each');
    });

    arr = ['a', [1], { foo: 'bar' }, 352];
    count = 0;
    arr.each(function(el, i, a){
        count++;
    });
    equals(count, 4, 'Array#each');

    ['a'].each(function(el, i, a){
      same(a, ['a'], 'Array#each');
      equals(el, 'a', 'Array#each');
      equals(i, 0, 'Array#each');
      equals(this, 'this', 'Array#each');
    }, 'this');




    same(['foot','goose','moose'].map(function(el){ return el.replace(/o/g, 'e'); }), ['feet', 'geese', 'meese'], 'Array#map');
    same([1,4,9].map(Math.sqrt), [1,2,3], 'Array#map');
    same([{ foo: 'bar' }].map(function(el){ return el['foo']; }), ['bar'], 'Array#map');

    ['a'].map(function(el, i, a){
      same(a, ['a'], 'Array#map');
      equals(el, 'a', 'Array#map');
      equals(i, 0, 'Array#map');
      equals(this, 'this', 'Array#map');
    }, 'this');




    equals([0,1,2,3,4].reduce(function(a,b){ return a + b; }), 10, 'Array#reduce');
    same([[0,1],[2,3],[4,5]].reduce(function(a,b){ return a.concat(b); }, []), [0,1,2,3,4,5], 'Array#reduce');
    ['a'].reduce(function(p, c, i, a){
      equals(p, 'c', 'Array#reduce');
      equals(c, 'a', 'Array#reduce');
      equals(i, 0, 'Array#reduce');
      same(a, ['a'], 'Array#reduce');
    }, 'c');
    [55,66].reduce(function(p, c, i, a){
      equals(p, 55, 'Array#reduce');
      equals(c, 66, 'Array#reduce');
      equals(i, 1, 'Array#reduce');
      same(a, [55,66], 'Array#reduce');
    });
    [1].reduce(function(p, c, i, a){
      // This assertion should never be called.
      equals(true, false, 'Array#reduce');
    });
    equals([1].reduce(function(){}), 1, 'Array#reduce');


    equals([0,1,2,3,4].reduceRight(function(a,b){ return a + b; }), 10, 'Array#reduceRight');
    same([[0,1],[2,3],[4,5]].reduceRight(function(a,b){ return a.concat(b); }, []), [4,5,2,3,0,1], 'Array#reduceRight');
    ['a'].reduceRight(function(p, c, i, a){
      equals(p, 'c', 'Array#reduceRight');
      equals(c, 'a', 'Array#reduceRight');
      equals(i, 0, 'Array#reduceRight');
      same(a, ['a'], 'Array#reduceRight');
    }, 'c');
    [55,66].reduceRight(function(p, c, i, a){
      equals(p, 66, 'Array#reduceRight');
      equals(c, 55, 'Array#reduceRight');
      equals(i, 0, 'Array#reduceRight');
      same(a, [55,66], 'Array#reduceRight');
    });
    [1].reduceRight(function(p, c, i, a){
      // This assertion should never be called.
      equals(true, false, 'Array#reduceRight');
    });
    equals([1].reduceRight(function(){}), 1, 'Array#reduceRight');


    same(['a','b','c'].find('a'), 'a', 'Array#find');
    same(['a','b','c'].find('b'), 'b', 'Array#find');
    same(['a','b','c'].find('c'), 'c', 'Array#find');
    same(['a','b','c'].find('d'), null, 'Array#find');
    same([1,2,3].find(1), 1, 'Array#find');
    same([1,2,3].find(2), 2, 'Array#find');
    same([1,2,3].find(3), 3, 'Array#find');
    same([1,2,3].find(4), null, 'Array#find');
    same([{a:1},{b:2},{c:3}].find({a:1}), {a:1}, 'Array#find');
    same([{a:1},{b:2},{c:3}].find({c:3}), {c:3}, 'Array#find');
    same([{a:1},{b:2},{c:3}].find({d:4}), null, 'Array#find');
    same([{a:1},{b:2},{c:3}].find({c:4}), null, 'Array#find');
    same([[1,2],[2,3],[4,5]].find([2,3]), [2,3], 'Array#find');
    same([[1,2],[2,3],[4,5]].find([2,4]), null, 'Array#find');
    same([[1,2],[2,3],[2,3]].find([2,3]), [2,3], 'Array#find');
    same(['foo','bar'].find(/f+/), 'foo', 'Array#find');
    same(['foo','bar'].find(/r+/), 'bar', 'Array#find');
    same(['foo','bar'].find(/q+/), null, 'Array#find');
    same([1,2,3].find(function(e){ return e > 0; }), 1, 'Array#find');
    same([1,2,3].find(function(e){ return e > 2; }), 3, 'Array#find');
    same([1,2,3].find(function(e){ return e > 3; }), null, 'Array#find');
    same([{a:1},{b:2},{c:3}].find(function(e){ return e['a'] === 1; }), {a:1}, 'Array#find');
    same([function(){}].find(function(e){}), null, 'Array#find');
    same([null, null].find(null), null, 'Array#find');



    same(['a','b','c'].findAll('a'), ['a'], 'Array#findAll');
    same(['a','a','c'].findAll('a'), ['a','a'], 'Array#findAll');
    same(['a','b','c'].findAll('q'), [], 'Array#findAll');
    same([1,2,3].findAll(1), [1], 'Array#findAll');
    same([2,2,3].findAll(2), [2,2], 'Array#findAll');
    same([1,2,3].findAll(4), [], 'Array#findAll');
    same([{a:1},{b:2},{c:3}].findAll({a:1}), [{a:1}], 'Array#findAll');
    same([{a:1},{a:1},{c:3}].findAll({a:1}), [{a:1},{a:1}], 'Array#findAll');
    same([{a:1},{b:2},{c:3}].findAll({d:4}), [], 'Array#findAll');
    same([{a:1},{b:2},{c:3}].findAll({c:4}), [], 'Array#findAll');
    same([[1,2],[2,3],[4,5]].findAll([2,3]), [[2,3]], 'Array#findAll');
    same([[1,2],[2,3],[4,5]].findAll([2,4]), [], 'Array#findAll');
    same([[1,2],[2,3],[2,3]].findAll([2,3]), [[2,3],[2,3]], 'Array#findAll');
    same(['foo','bar'].findAll(/f+/), ['foo'], 'Array#findAll');
    same(['foo','bar'].findAll(/[a-f]/), ['foo','bar'], 'Array#findAll');
    same(['foo','bar'].findAll(/q+/), [], 'Array#findAll');
    same([1,2,3].findAll(function(e){ return e > 0; }), [1,2,3], 'Array#findAll');
    same([1,2,3].findAll(function(e){ return e > 1; }), [2,3], 'Array#findAll');
    same([1,2,3].findAll(function(e){ return e > 2; }), [3], 'Array#findAll');
    same([1,2,3].findAll(function(e){ return e > 3; }), [], 'Array#findAll');
    same([{a:10},{a:8},{a:3}].findAll(function(e){ return e['a'] > 5; }), [{a:10},{a:8}], 'Array#findAll');
    same([function(){}].findAll(function(e){}), [], 'Array#findAll');
    same([null, null].findAll(null), [null, null], 'Array#find');




    same([1,1,3].unique(), [1,3], 'Array#unique');
    same([0,0,0].unique(), [0], 'Array#unique');
    same(['a','b','c'].unique(), ['a','b','c'], 'Array#unique');
    same(['a','a','c'].unique(), ['a','c'], 'Array#unique');
    same([{foo:'bar'}, {foo:'bar'}].unique(), [{foo:'bar'}], 'Array#unique');



    same([1,2,3].union([3,4,5]), [1,2,3,4,5], 'Array#union');
    same([1,1,1].union([1,2,3]), [1,2,3], 'Array#union');
    same([0,0,0].union([1,2,3]), [0,1,2,3], 'Array#union');
    same([0,0,0].union([0,0,0]), [0], 'Array#union');
    same([].union([]), [], 'Array#union');
    same([-1,-2,-3].union([-2,-4,-5]), [-1,-2,-3,-4,-5], 'Array#union');
    same([-1,-2,-3].union([3,4,5]), [-1,-2,-3,3,4,5], 'Array#union');
    same([{a:1},{b:2}].union([{b:2},{c:3}]), [{a:1},{b:2},{c:3}], 'Array#intersect');
    same([1,2,3].union(4), [1,2,3,4], 'Array#union');


    same([1,2,3].intersect([3,4,5]), [3], 'Array#intersect');
    same(['a','b','c'].intersect(['c','d','e']), ['c'], 'Array#intersect');
    same([1,2,3].intersect([1,2,3]), [1,2,3], 'Array#intersect');
    same([1,2,3].intersect([3,2,1]), [1,2,3], 'Array#intersect');
    same([].intersect([3]), [], 'Array#intersect');
    same([3].intersect([]), [], 'Array#intersect');
    same([].intersect([]), [], 'Array#intersect');
    same([null].intersect([]), [], 'Array#intersect');
    same([null].intersect([null]), [null], 'Array#intersect');
    same([false].intersect([false]), [false], 'Array#intersect');
    same([false].intersect([0]), [], 'Array#intersect');
    same([false].intersect([null]), [], 'Array#intersect');
    same([false].intersect([undefined]), [], 'Array#intersect');
    same([{a:1},{b:2}].intersect([{b:2},{c:3}]), [{b:2}], 'Array#intersect');
    same([1,1,3].intersect([1,5,6]), [1], 'Array#intersect');
    same([1,2,3].intersect([4,5,6]), [], 'Array#intersect');
    same([1,2,3].intersect(1), [1], 'Array#intersect');




    same([1,2,3].add([3,4,5]), [1,2,3,3,4,5], 'Array#add');
    same(['a','b','c'].add(['c','d','e']), ['a','b','c','c','d','e'], 'Array#add');
    same([1,2,3].add([1,2,3]), [1,2,3,1,2,3], 'Array#add');
    same([1,2,3].add([3,2,1]), [1,2,3,3,2,1], 'Array#add');
    same([].add([3]), [3], 'Array#add');
    same([3].add([]), [3], 'Array#add');
    same([].add([]), [], 'Array#add');
    same([null].add([]), [null], 'Array#add');
    same([null].add([null]), [null, null], 'Array#add');
    same([false].add([false]), [false, false], 'Array#add');
    same([false].add([0]), [false, 0], 'Array#add');
    same([false].add([null]), [false, null], 'Array#add');
    same([false].add([undefined]), [false, undefined], 'Array#add');
    same([{a:1},{b:2}].add([{b:2},{c:3}]), [{a:1},{b:2},{b:2},{c:3}], 'Array#add');
    same([1,1,3].add([1,5,6]), [1,1,3,1,5,6], 'Array#add');
    same([1,2,3].add([4,5,6]), [1,2,3,4,5,6], 'Array#add');
    same([1,2,3].add(1), [1,2,3,1], 'Array#add');




    same([1,2,3].subtract([3,4,5]), [1,2], 'Array#subtract');
    same(['a','b','c'].subtract(['c','d','e']), ['a','b'], 'Array#subtract');
    same([1,2,3].subtract([1,2,3]), [], 'Array#subtract');
    same([1,2,3].subtract([3,2,1]), [], 'Array#subtract');
    same([].subtract([3]), [], 'Array#subtract');
    same([3].subtract([]), [3], 'Array#subtract');
    same([].subtract([]), [], 'Array#subtract');
    same([null].subtract([]), [null], 'Array#subtract');
    same([null].subtract([null]), [], 'Array#subtract');
    same([false].subtract([false]), [], 'Array#subtract');
    same([false].subtract([0]), [false], 'Array#subtract');
    same([false].subtract([null]), [false], 'Array#subtract');
    same([false].subtract([undefined]), [false], 'Array#subtract');
    same([{a:1},{b:2}].subtract([{b:2},{c:3}]), [{a:1}], 'Array#subtract');
    same([1,1,3].subtract([1,5,6]), [3], 'Array#subtract');
    same([1,2,3].subtract([4,5,6]), [1,2,3], 'Array#subtract');
    same([1,2,3].subtract(1), [2,3], 'Array#subtract');



});




test('RegExp', function () {

    equals(RegExp.escape('test regexp'), 'test regexp', 'RegExp#escape');
    equals(RegExp.escape('test reg|exp'), 'test reg\\|exp', 'RegExp#escape');
    equals(RegExp.escape('hey there (budday)'), 'hey there \\(budday\\)', 'RegExp#escape');
    equals(RegExp.escape('what a day...'), 'what a day\\.\\.\\.', 'RegExp#escape');
    equals(RegExp.escape('.'), '\\.', 'RegExp#escape');
    equals(RegExp.escape('*.+[]{}()?|/'), '\\*\\.\\+\\[\\]\\{\\}\\(\\)\\?\\|\\/', 'RegExp#escape');

});

