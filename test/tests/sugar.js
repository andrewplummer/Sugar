module("Sugar");


var dateEquals = function(a, b, message){
  var buffer = 10; // Number of milliseconds of "play" to make sure these tests pass.
  if(typeof b == 'number'){
    var d = new Date();
    d.setTime(d.getTime() + b);
    b = d;
  }
  var offset = Math.abs(a.getTime() - b.getTime());
  equals(offset < buffer, true, message + ' | offset is '+offset);
}

var getDate = function(year, month, day, hours, minutes, seconds, milliseconds){
  var d = new Date();
  if(year) d.setFullYear(year);
  d.setMonth(month === undefined ? 0 : month - 1);
  d.setDate(day === undefined ? 1 : day);
  d.setHours(hours === undefined ? 0 : hours);
  d.setMinutes(minutes === undefined ? 0 : minutes);
  d.setSeconds(seconds === undefined ? 0 : seconds);
  d.setMilliseconds(milliseconds === undefined ? 0 : milliseconds);
  return d;
}

var getRelativeDate = function(year, month, day, hours, minutes, seconds, milliseconds){
  var d = new Date();
  d.setFullYear(d.getFullYear() + (year || 0));
  d.setMonth(d.getMonth() + (month || 0));
  d.setDate(d.getDate() + (day || 0));
  d.setHours(d.getHours() + (hours || 0));
  d.setMinutes(d.getMinutes() + (minutes || 0));
  d.setSeconds(d.getSeconds() + (seconds || 0));
  d.setMilliseconds(d.getMilliseconds() + (milliseconds || 0));
  return d;
}

var getUTCDate = function(year, month, day, hours, minutes, seconds, milliseconds){
  var d = new Date();
  if(year) d.setFullYear(year);
  d.setUTCMonth(month === undefined ? 0 : month - 1);
  d.setUTCDate(day === undefined ? 1 : day);
  d.setUTCHours(hours === undefined ? 0 : hours);
  d.setUTCMinutes(minutes === undefined ? 0 : minutes);
  d.setUTCSeconds(seconds === undefined ? 0 : seconds);
  d.setUTCMilliseconds(milliseconds === undefined ? 0 : milliseconds);
  return d;
}

var getDateWithWeekdayAndOffset = function(weekday, offset){
  var d = new Date();
  if(offset) d.setDate(d.getDate() + offset);
  d.setDate(d.getDate() + (weekday - d.getDay()));
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

var contains = function(actual, expected, message){
  equals(expected.any(actual), true, message);
}

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
  same(ret, [5,4,3,2,1], 'Number#downto');


  counter = 0;
  var dCounter = 1;
  ret = (1).upto(5, function(i){
    equal(i, dCounter, 'Number#upto');
    counter++;
    dCounter++;
  });
  equal(counter, 5, 'Number#upto');
  same(ret, [1,2,3,4,5], 'Number#upto');

  counter = 0;
  ret = (5).downto(10, function(){});
  equal(counter, 0, 'Number#downto');
  same(ret, [], 'Number#downto');

  counter = 0;
  ret = (5).upto(1, function(){});
  equal(counter, 0, 'Number#downto');
  same(ret, [], 'Number#downto');


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
  equals((100046546510000.022435451).format().replace(/\.\d+$/, ''), '100,046,546,510,000')
  equals((-100046546510000.022435451).format().replace(/\.\d+$/, ''), '-100,046,546,510,000')

  equals((1000).format(' '), '1 000', 'Number#format 1000')
  equals((1532587).format(' '), '1 532 587', 'Number#format larger number')
  equals((1532587.5752).format(' ', ','), '1 532 587,5752', 'Number#format larger number with decimal')
  equals((9999999.99).format(),                     '9,999,999.99', 'Number#format Standard');
  equals((9999999.99).format('.',','),              '9.999.999,99', 'Number#format Euro style!');


  equals((0).hex(), '0', 'Number#hex')
  equals((10).hex(), 'a', 'Number#hex')
  equals((255).hex(), 'ff', 'Number#hex')
  equals((0.5).hex(), '0.8', 'Number#hex')
  equals((2.5).hex(), '2.8', 'Number#hex')
  equals((2553423).hex(), '26f64f', 'Number#hex')


  equals((24).blank(), false, 'Number#blank');
  equals((0).blank(), false, 'Number#blank');


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


  dateEquals((1).second().since(), 1000, 'Number#since 1 second since');
  dateEquals((1).minute().since(), 60000, 'Number#since 1 minute since');
  dateEquals((1).hour().since(), 3600000, 'Number#since 1 hour since');
  dateEquals((1).day().since(), 86400000, 'Number#since 1 day since');
  dateEquals((1).week().since(), 604800000, 'Number#since 1 week since');
  dateEquals((1).month().since(), 2592000000, 'Number#since 1 month since');
  dateEquals((1).year().since(), 31557600000, 'Number#since 1 year since');

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
  ((10).minutesAgo((5).minutesFromNow()), -(1000 * 60 * 5), 'Number#minutesAgo');

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
    equal(str, 'ginger'.charAt(counter), 'String#each');
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
    equal(str, 'ginger'.charAt(counter), 'String#chars');
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

  /*
  counter = 0;
  var sentence = 'these pretzels are \n\n making me         thirsty!\n\n';
  test = ['these', 'pretzels', 'are', 'making', 'me', 'thirsty!'];
  result = sentence.words(function(str, i){
    equal(str, test[i], 'String#words');
    counter ++;
  });
  equal(counter, 6, 'String#words');
  same(result, test, 'String#words');
  */

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
  equal('VADER'.endsWith('DER', true), true, 'String#endsWith');
  equal('VADER'.endsWith('der', true), false, 'String#endsWith');
  equal('i aint your\nfather'.endsWith('father'), true, 'String#endsWith');
  equal('i aint your\nfather'.endsWith('r father'), false, 'String#endsWith');


  equal(''.blank(), true, 'String#blank');
  equal('0'.blank(), false, 'String#blank');
  equal('            '.blank(), true, 'String#blank');
  equal('\n'.blank(), true, 'String#blank');
  equal('\t\t\t\t'.blank(), true, 'String#blank');
  equal('　　　　　\n　　　'.blank(), true, 'String#blank'); // Japanese space
  equal('日本語では　「マス」　というの知ってた？'.blank(), false, 'String#blank');
  equal('mayonnaise'.blank(), false, 'String#blank');


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
  equal(isNaN('0xA'.toNumber()), false, 'String#toNumber');
  equal('22.5'.toNumber(), 22.5, 'String#toNumber');
  equal(isNaN('blue'.toNumber()), true, 'String#toNumber');

  equal('010'.toNumber(), 10, 'String#toNumber');
  equal('0908'.toNumber(), 908, 'String#toNumber');
  equal('22.34.5'.toNumber(), 22.34, 'String#toNumber');

  equal(isNaN('........'.toNumber()), true, 'String#toNumber');

  equal('1.45kg'.toNumber(), 1.45, 'String#toNumber');
  equal('77.3'.toNumber(), 77.3, 'String#toNumber');
  equal('077.3'.toNumber(), 77.3, 'String#toNumber');
  equal(isNaN('0x77.3'.toNumber()), false, 'String#toNumber');
  equal('.3'.toNumber(), 0.3, 'String#toNumber');
  equal('0.1e6'.toNumber(), 100000, 'String#toNumber');


  // This should handle hexadecimal, etc
  equal('ff'.toNumber(16), 255, 'String#toNumber');
  equal('00'.toNumber(16), 0, 'String#toNumber');
  equal('33'.toNumber(16), 51, 'String#toNumber');
  equal('66'.toNumber(16), 102, 'String#toNumber');
  equal('99'.toNumber(16), 153, 'String#toNumber');
  equal('bb'.toNumber(16), 187, 'String#toNumber');




  equal('spoon'.reverse(), 'noops', 'String#reverse');
  equal('amanaplanacanalpanama'.reverse(), 'amanaplanacanalpanama', 'String#reverse');


  equal('the rain in     spain    falls mainly   on     the        plain'.compact(), 'the rain in spain falls mainly on the plain', 'String#compact');
  equal('\n\n\nthe \n\n\nrain in     spain    falls mainly   on     the        plain\n\n'.compact(), 'the rain in spain falls mainly on the plain', 'String#compact');
  equal('\n\n\n\n           \t\t\t\t          \n\n      \t'.compact(), '', 'String#compact');
  equal('　　　日本語　　　　　の　　　　　スペース　　　　　も　　'.compact(), '日本語　の　スペース　も', 'String#compact');




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

  same('wowzers'.at(0,2,4,6), ['w','w','e','s'], 'String#at');


  equal('quack'.first(), 'q', 'String#first');
  equal('quack'.first(2), 'qu', 'String#first');
  equal('quack'.first(3), 'qua', 'String#first');
  equal('quack'.first(4), 'quac', 'String#first');
  equal('quack'.first(20), 'quack', 'String#first');
  equal('quack'.first(0), '', 'String#first');
  equal('quack'.first(-1), '', 'String#first');
  equal('quack'.first(-5), '', 'String#first');
  equal('quack'.first(-10), '', 'String#first');



  equal('quack'.last(), 'k', 'String#last');
  equal('quack'.last(2), 'ck', 'String#last');
  equal('quack'.last(3), 'ack', 'String#last');
  equal('quack'.last(4), 'uack', 'String#last');
  equal('quack'.last(10), 'quack', 'String#last');
  equal('quack'.last(-1), '', 'String#last');
  equal('quack'.last(-5), '', 'String#last');
  equal('quack'.last(-10), '', 'String#last');
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



  same('foo=bar&moo=car'.toObject(), {foo:'bar',moo:'car'}, 'String#keyValue');
  same('foo=bar&moo=3'.toObject(), {foo:'bar',moo:3}, 'String#keyValue');
  same('foo=bar&moo=true'.toObject(), {foo:'bar',moo:true}, 'String#keyValue');
  same('foo=bar&moo=false'.toObject(), {foo:'bar',moo:false}, 'String#keyValue');

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

    ['a'].indexOf(function(el, i, a){
      same(a, ['a'], 'Array#indexOf');
      equals(el, 'a', 'Array#indexOf');
      equals(i, 0, 'Array#indexOf');
      equals(this, 'this', 'Array#indexOf');
    }, 'this');

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

    ['a'].lastIndexOf(function(el, i, a){
      same(a, ['a'], 'Array#lastIndexOf');
      equals(el, 'a', 'Array#lastIndexOf');
      equals(i, 0, 'Array#lastIndexOf');
      equals(this, 'this', 'Array#lastIndexOf');
    }, 'this');



    equals([12, 5, 8, 130, 44].every(function(el, i, a){ return el >= 10; }), false, 'Array#every');
    equals([12, 54, 18, 130, 44].every(function(el, i, a){ return el >= 10; }), true, 'Array#every');
    ['a'].every(function(el, i, a){
      same(a, ['a'], 'Array#every');
      equals(el, 'a', 'Array#every');
      equals(i, 0, 'Array#every');
      equals(this, 'this', 'Array#every');
    }, 'this');

    equals([12, 54, 18, 130, 44].every(function(el, i, a){ return el >= 10; }), true, 'Array#every');

    // "every" is implemented in mozilla and only accepts a callback, so it cannot be trusted
    // TODO RECONCILE THIS!!!
    // same([{name:'john',age:25},{name:'fred',age:85}].all('age'), true, 'Array#every');
    // same([{name:'john',age:25},{name:'fred',age:85}].all('name'), true, 'Array#every');
    // same([{name:'john',age:25},{name:'fred',age:85}].all('cupsize'), false, 'Array#every');



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

    // Some is implemented in Firefox so it needs to behave the same way.
    // TODO CONSOLIDATE THIS HANDLING OF STRING PARAMS
    // same([{name:'john',age:25},{name:'fred',age:85}].some('age'), true, 'Array#some');
    // same([{name:'john',age:25},{name:'fred',age:85}].some('name'), true, 'Array#some');
    // same([{name:'john',age:25},{name:'fred',age:85}].some('cupsize'), false, 'Array#some');
    // same([{name:'john',age:25},{name:'fred'}].some('age'), true, 'Array#some');
    // same([{name:'john',age:25},{name:'fred'}].some('cupsize'), false, 'Array#some');




    same([12,4,8,130,44].filter(function(el, i, a){ return el > 10 }), [12,130,44], 'Array#filter');
    same([12,4,8,130,44].filter(function(el, i, a){ return el < 10 }), [4,8], 'Array#filter');
    ['a'].filter(function(el, i, a){
      same(a, ['a'], 'Array#filter');
      equals(el, 'a', 'Array#filter');
      equals(i, 0, 'Array#filter');
      equals(this, 'this', 'Array#filter');
    }, 'this');


    // Filter is implemented in Firefox, so it must behave the same way.
    // TODO RESOVLE HOW THIS WORKS!
    // same([{name:'john',age:25},{name:'fred',age:85}].filter('age'), [{name:'john',age:25},{name:'fred',age:85}], 'Array#filter');
    // same([{name:'john',age:25},{name:'fred',age:85}].filter('cupsize'), [], 'Array#filter');
    // same([{name:'john',age:25},{name:'fred'}].filter('age'), [{name:'john',age:25}], 'Array#filter');




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


    // Map cannot handle string arguments for now (must be a callback).
    // We don't want to overwrite native functionality here
    // TODO: Rethink how to do this!
    //same(['foot','goose','moose'].map('length'), [4,5,5], 'Array#map');
    //same([{name:'john',age:25},{name:'fred',age:85}].map('age'), [25,85], 'Array#map');
    //same([{name:'john',age:25},{name:'fred',age:85}].map('name'), ['john','fred'], 'Array#map');
    //same([{name:'john',age:25},{name:'fred',age:85}].map('cupsize'), [undefined, undefined], 'Array#map');
    //same([].map('name'), [], 'Array#map');




    same(['foot','goose','moose'].collect(function(el){ return el.replace(/o/g, 'e'); }), ['feet', 'geese', 'meese'], 'Array#collect');
    same([1,4,9].collect(Math.sqrt), [1,2,3], 'Array#collect');
    same([{ foo: 'bar' }].collect(function(el){ return el['foo']; }), ['bar'], 'Array#collect');

    ['a'].collect(function(el, i, a){
      same(a, ['a'], 'Array#collect');
      equals(el, 'a', 'Array#collect');
      equals(i, 0, 'Array#collect');
      equals(this, 'this', 'Array#collect');
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
    same([null, null].findAll(null), [null, null], 'Array#findAll');



    same(['a','b','c'].findFromIndex(0, 'a'), 'a', 'Array#findFromIndex');
    same(['a','a','c'].findFromIndex(0, 'a'), 'a', 'Array#findFromIndex');
    same(['a','b','c'].findFromIndex(0, 'q'), null, 'Array#findFromIndex');
    same([1,2,3].findFromIndex(0, 1), 1, 'Array#findFromIndex');
    same([2,2,3].findFromIndex(0, 2), 2, 'Array#findFromIndex');
    same([1,2,3].findFromIndex(0, 4), null, 'Array#findFromIndex');
    same([{a:1},{b:2},{c:3}].findFromIndex(0, {a:1}), {a:1}, 'Array#findFromIndex');
    same([{a:1},{a:1},{c:3}].findFromIndex(0, {a:1}), {a:1}, 'Array#findFromIndex');
    same([{a:1},{b:2},{c:3}].findFromIndex(0, {d:4}), null, 'Array#findFromIndex');
    same([{a:1},{b:2},{c:3}].findFromIndex(0, {c:4}), null, 'Array#findFromIndex');
    same([[1,2],[2,3],[4,5]].findFromIndex(0, [2,3]), [2,3], 'Array#findFromIndex');
    same([[1,2],[2,3],[4,5]].findFromIndex(0, [2,4]), null, 'Array#findFromIndex');
    same([[1,2],[2,3],[2,3]].findFromIndex(0, [2,3]), [2,3], 'Array#findFromIndex');
    same(['foo','bar'].findFromIndex(0, /f+/), 'foo', 'Array#findFromIndex');
    same(['foo','bar'].findFromIndex(0, /[a-f]/), 'foo', 'Array#findFromIndex');
    same(['foo','bar'].findFromIndex(1, /[a-f]/), 'bar', 'Array#findFromIndex');
    same(['foo','bar'].findFromIndex(0, /q+/), null, 'Array#findFromIndex');
    same([1,2,3].findFromIndex(0, function(e){ return e > 0; }), 1, 'Array#findFromIndex');
    same([1,2,3].findFromIndex(1, function(e){ return e > 0; }), 2, 'Array#findFromIndex');
    same([1,2,3].findFromIndex(2, function(e){ return e > 0; }), 3, 'Array#findFromIndex');
    same([1,2,3].findFromIndex(3, function(e){ return e > 0; }), 1, 'Array#findFromIndex');
    same([1,2,3].findFromIndex(0, function(e){ return e > 1; }), 2, 'Array#findFromIndex');
    same([1,2,3].findFromIndex(1, function(e){ return e > 1; }), 2, 'Array#findFromIndex');
    same([1,2,3].findFromIndex(2, function(e){ return e > 1; }), 3, 'Array#findFromIndex');
    same([1,2,3].findFromIndex(0, function(e){ return e > 2; }), 3, 'Array#findFromIndex');
    same([1,2,3].findFromIndex(0, function(e){ return e > 3; }), null, 'Array#findFromIndex');

    same([{a:10},{a:8},{a:3}].findFromIndex(0, function(e){ return e['a'] > 5; }), {a:10}, 'Array#findFromIndex');
    same([{a:10},{a:8},{a:3}].findFromIndex(1, function(e){ return e['a'] > 5; }), {a:8}, 'Array#findFromIndex');
    same([{a:10},{a:8},{a:3}].findFromIndex(2, function(e){ return e['a'] > 5; }), {a:10}, 'Array#findFromIndex');
    same([function(){}].findFromIndex(0, function(e){}), null, 'Array#findFromIndex');
    same([function(){}].findFromIndex(1, function(e){}), null, 'Array#findFromIndex');
    same([null, null].findFromIndex(0, null), null, 'Array#findFromIndex');
    same([null, null].findFromIndex(1, null), null, 'Array#findFromIndex');
    same([undefined, undefined].findFromIndex(0, undefined), undefined, 'Array#findFromIndex');
    same([undefined, undefined].findFromIndex(1, undefined), undefined, 'Array#findFromIndex');
    same([undefined, 'a'].findFromIndex(1, undefined), 'a', 'Array#findFromIndex');
    same([null, null].findFromIndex(1, undefined), null, 'Array#findFromIndex');



    same(['a','b','c'].findAllFromIndex(0, 'a'), ['a'], 'Array#findAllFromIndex');
    same(['a','a','c'].findAllFromIndex(0, 'a'), ['a','a'], 'Array#findAllFromIndex');
    same(['a','b','c'].findAllFromIndex(0, 'q'), [], 'Array#findAllFromIndex');
    same([1,2,3].findAllFromIndex(0, 1), [1], 'Array#findAllFromIndex');
    same([2,2,3].findAllFromIndex(0, 2), [2,2], 'Array#findAllFromIndex');
    same([1,2,3].findAllFromIndex(0, 4), [], 'Array#findAllFromIndex');
    same([{a:1},{b:2},{c:3}].findAllFromIndex(0, {a:1}), [{a:1}], 'Array#findAllFromIndex');
    same([{a:1},{a:1},{c:3}].findAllFromIndex(0, {a:1}), [{a:1},{a:1}], 'Array#findAllFromIndex');
    same([{a:1},{b:2},{c:3}].findAllFromIndex(0, {d:4}), [], 'Array#findAllFromIndex');
    same([{a:1},{b:2},{c:3}].findAllFromIndex(0, {c:4}), [], 'Array#findAllFromIndex');
    same([[1,2],[2,3],[4,5]].findAllFromIndex(0, [2,3]), [[2,3]], 'Array#findAllFromIndex');
    same([[1,2],[2,3],[4,5]].findAllFromIndex(0, [2,4]), [], 'Array#findAllFromIndex');
    same([[1,2],[2,3],[2,3]].findAllFromIndex(0, [2,3]), [[2,3],[2,3]], 'Array#findAllFromIndex');
    same(['foo','bar'].findAllFromIndex(0, /f+/), ['foo'], 'Array#findAllFromIndex');
    same(['foo','bar'].findAllFromIndex(0, /[a-f]/), ['foo','bar'], 'Array#findAllFromIndex');
    same(['foo','bar'].findAllFromIndex(1, /[a-f]/), ['bar','foo'], 'Array#findAllFromIndex');
    same(['foo','bar'].findAllFromIndex(0, /q+/), [], 'Array#findAllFromIndex');
    same([1,2,3].findAllFromIndex(0, function(e){ return e > 0; }), [1,2,3], 'Array#findAllFromIndex');
    same([1,2,3].findAllFromIndex(1, function(e){ return e > 0; }), [2,3,1], 'Array#findAllFromIndex');
    same([1,2,3].findAllFromIndex(2, function(e){ return e > 0; }), [3,1,2], 'Array#findAllFromIndex');
    same([1,2,3].findAllFromIndex(3, function(e){ return e > 0; }), [1,2,3], 'Array#findAllFromIndex');
    same([1,2,3].findAllFromIndex(0, function(e){ return e > 1; }), [2,3], 'Array#findAllFromIndex');
    same([1,2,3].findAllFromIndex(1, function(e){ return e > 1; }), [2,3], 'Array#findAllFromIndex');
    same([1,2,3].findAllFromIndex(2, function(e){ return e > 1; }), [3,2], 'Array#findAllFromIndex');
    same([1,2,3].findAllFromIndex(0, function(e){ return e > 2; }), [3], 'Array#findAllFromIndex');
    same([1,2,3].findAllFromIndex(0, function(e){ return e > 3; }), [], 'Array#findAllFromIndex');

    same([{a:10},{a:8},{a:3}].findAllFromIndex(0, function(e){ return e['a'] > 5; }), [{a:10},{a:8}], 'Array#findAllFromIndex');
    same([{a:10},{a:8},{a:3}].findAllFromIndex(1, function(e){ return e['a'] > 5; }), [{a:8},{a:10}], 'Array#findAllFromIndex');
    same([{a:10},{a:8},{a:3}].findAllFromIndex(2, function(e){ return e['a'] > 5; }), [{a:10},{a:8}], 'Array#findAllFromIndex');
    same([function(){}].findAllFromIndex(0, function(e){}), [], 'Array#findAllFromIndex');
    same([function(){}].findAllFromIndex(1, function(e){}), [], 'Array#findAllFromIndex');
    same([null, null].findAllFromIndex(0, null), [null, null], 'Array#findAllFromIndex');
    same([null, null].findAllFromIndex(1, null), [null, null], 'Array#findAllFromIndex');

    // Find all from index also implements a "stop" parameter to stop after
    // n number of matches
    same(['c','a','n','d','y'].findAllFromIndex(0, function(c){ return c.length == 1; }, 1), ['c'], 'Array#findAllFromIndex with stop');
    same(['c','a','n','d','y'].findAllFromIndex(0, function(c){ return c.length == 1; }, 2), ['c','a'], 'Array#findAllFromIndex with stop');
    same(['c','a','n','d','y'].findAllFromIndex(0, function(c){ return c.length == 1; }, 3), ['c','a','n'], 'Array#findAllFromIndex with stop');
    same(['c','a','n','d','y'].findAllFromIndex(3, function(c){ return c.length == 1; }, 3), ['d','y','c'], 'Array#findAllFromIndex with stop');

    // Example: finding last from an index. (reverse order). This means we don't need a findAllFromLastIndex
    arr = [{name:'john',age:10,food:'sushi'},{name:'randy',age:23,food:'natto'},{name:'karen',age:32,food:'salad'}];
    arr = [1,2,3,4,5,6,7,8,9];
    same(arr.findAllFromIndex(4, function(n){ return n % 3 == 0; }), [6,9,3], 'Array#findAllFromIndex');
    same(arr.reverse().findAllFromIndex(4, function(n){ return n % 3 == 0; }), [3,9,6], 'Array#findAllFromIndex reversed');


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




    same([1,2,3].subtract([3,4,5]), [1,2], 'Array#subtract');
    same([1,1,2,2,3,3,4,4,5,5].subtract([2,3,4]), [1,1,5,5], 'Array#subtract');
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





    same(['a','b','c'].at(0), 'a', 'Array#at');
    same(['a','b','c'].at(1), 'b', 'Array#at');
    same(['a','b','c'].at(2), 'c', 'Array#at');
    same(['a','b','c'].at(3), null, 'Array#at');
    same(['a','b','c'].at(-1), 'c', 'Array#at');
    same(['a','b','c'].at(-2), 'b', 'Array#at');
    same(['a','b','c'].at(-3), 'a', 'Array#at');
    same(['a','b','c'].at(-4), null, 'Array#at');
    same(['a','b','c'].at(), null, 'Array#at');
    same([false].at(0), false, 'Array#at');
    same(['a'].at(0), 'a', 'Array#at');
    same(['a'].at(1), null, 'Array#at');
    same(['a'].at(-1), 'a', 'Array#at');
    same(['a','b','c','d','e','f'].at(0,2,4), ['a','c','e'], 'Array#at');
    same(['a','b','c','d','e','f'].at(1,3,5), ['b','d','f'], 'Array#at');
    same(['a','b','c','d','e','f'].at(0,2,4,6), ['a','c','e'], 'Array#at');



    same(['a','b','c'].from(), ['a','b','c'], 'Array#from');
    same(['a','b','c'].from(1), ['b','c'], 'Array#from');
    same(['a','b','c'].from(2), ['c'], 'Array#from');
    same(['a','b','c'].from(3), [], 'Array#from');
    same(['a','b','c'].from(4), [], 'Array#from');
    same(['a','b','c'].from(-1), ['c'], 'Array#from');
    same(['a','b','c'].from(-2), ['b','c'], 'Array#from');
    same(['a','b','c'].from(-3), ['a','b','c'], 'Array#from');
    same(['a','b','c'].from(-4), ['a','b','c'], 'Array#from');


    same(['a','b','c'].to(), ['a','b','c'], 'Array#to');
    same(['a','b','c'].to(1), ['a','b'], 'Array#to');
    same(['a','b','c'].to(2), ['a','b','c'], 'Array#to');
    same(['a','b','c'].to(3), ['a','b','c'], 'Array#to');
    same(['a','b','c'].to(4), ['a','b','c'], 'Array#to');
    same(['a','b','c'].to(-1), ['a','b','c'], 'Array#to');
    same(['a','b','c'].to(-2), ['a','b'], 'Array#to');
    same(['a','b','c'].to(-3), ['a'], 'Array#to');
    same(['a','b','c'].to(-4), [], 'Array#to');




    same(['a','b','c'].first(), 'a', 'Array#first');
    same(['a','b','c'].first(1), ['a'], 'Array#first');
    same(['a','b','c'].first(2), ['a','b'], 'Array#first');
    same(['a','b','c'].first(3), ['a','b','c'], 'Array#first');
    same(['a','b','c'].first(4), ['a','b','c'], 'Array#first');
    same(['a','b','c'].first(-1), [], 'Array#first');
    same(['a','b','c'].first(-2), [], 'Array#first');
    same(['a','b','c'].first(-3), [], 'Array#first');


    same(['a','b','c'].last(), 'c', 'Array#last');
    same(['a','b','c'].last(1), ['c'], 'Array#last');
    same(['a','b','c'].last(2), ['b','c'], 'Array#last');
    same(['a','b','c'].last(3), ['a','b','c'], 'Array#last');
    same(['a','b','c'].last(4), ['a','b','c'], 'Array#last');
    same(['a','b','c'].last(-1), [], 'Array#last');
    same(['a','b','c'].last(-2), [], 'Array#last');
    same(['a','b','c'].last(-3), [], 'Array#last');
    same(['a','b','c'].last(-4), [], 'Array#last');











    same([12,87,55].min(), 12, 'Array#min');
    same([12,87,55].min(true), [12], 'Array#min');
    same([-12,-87,-55].min(), -87, 'Array#min');
    same([-12,-87,-55].min(true), [-87], 'Array#min');
    same([5,5,128].min(), 5, 'Array#min');
    same([5,5,128].min(true), [5], 'Array#min');
    same([5,5,5].min(), 5, 'Array#min');
    same([5,5,5].min(true), [5], 'Array#min');
    same(['a','b','c'].min(), null, 'Array#min');
    same(['a','b','c'].min(true), [], 'Array#min');
    same([].min(), null, 'Array#min');
    same([].min(true), [], 'Array#min');
    same([null].min(), null, 'Array#min');
    same([null].min(true), [], 'Array#min');
    same([undefined].min(), null, 'Array#min');
    same([undefined].min(true), [], 'Array#min');
    same([{a:1,b:5},{a:2,b:5},{a:3,b:5}].min(function(el){ return el['a']; }), {a:1,b:5}, 'Array#min');
    same([{a:1,b:5},{a:2,b:4},{a:3,b:3}].min(function(el){ return el['b']; }), {a:3,b:3}, 'Array#min');
    same([{a:1,b:5},{a:2,b:4},{a:3,b:3}].min(true, function(el){ return el['b']; }), [{a:3,b:3}], 'Array#min');
    same([{a:1,b:3},{a:2,b:4},{a:3,b:3}].min(true, function(el){ return el['b']; }), [{a:1,b:3},{a:3,b:3}], 'Array#min');
    same([{a:-1,b:-5},{a:-2,b:-4},{a:-3,b:-3}].min(function(el){ return el['b']; }), {a:-1,b:-5}, 'Array#min');
    same([{a:-1,b:-5},{a:-2,b:-4},{a:-3,b:-3}].min(true, function(el){ return el['b']; }), [{a:-1,b:-5}], 'Array#min');
    same(['short','and', 'mort'].min(function(el){ return el.length; }), 'and', 'Array#min');
    same(['short','and', 'mort'].min(true, function(el){ return el.length; }), ['and'], 'Array#min');
    same(['short','and', 'mort', 'fat'].min(function(el){ return el.length; }), 'and', 'Array#min');
    same(['short','and', 'mort', 'fat'].min(true, function(el){ return el.length; }), ['and','fat'], 'Array#min');


    same([12,87,55].max(), 87, 'Array#max');
    same([12,87,55].max(true), [87], 'Array#max');
    same([-12,-87,-55].max(), -12, 'Array#max');
    same([-12,-87,-55].max(true), [-12], 'Array#max');
    same([5,5,128].max(), 128, 'Array#max');
    same([5,128,128].max(true), [128], 'Array#max');
    same([128,128,128].max(true), [128], 'Array#max');
    same(['a','b','c'].max(), null, 'Array#max');
    same(['a','b','c'].max(true), [], 'Array#max');
    same([].max(), null, 'Array#max');
    same([].max(true), [], 'Array#max');
    same([null].max(), null, 'Array#max');
    same([null].max(true), [], 'Array#max');
    same([undefined].max(), null, 'Array#max');
    same([undefined].max(true), [], 'Array#max');
    same([{a:1,b:5},{a:2,b:5},{a:3,b:5}].max(function(el){ return el['a']; }), {a:3,b:5}, 'Array#max');
    same([{a:1,b:5},{a:2,b:5},{a:3,b:5}].max(true, function(el){ return el['a']; }), [{a:3,b:5}], 'Array#max');
    same([{a:1,b:5},{a:2,b:4},{a:3,b:3}].max(function(el){ return el['b']; }), {a:1,b:5}, 'Array#max');
    same([{a:1,b:5},{a:2,b:4},{a:3,b:3}].max(true, function(el){ return el['b']; }), [{a:1,b:5}], 'Array#max');
    same([{a:1,b:3},{a:2,b:4},{a:3,b:3}].max(true, function(el){ return el['b']; }), [{a:2,b:4}], 'Array#max');
    same([{a:1,b:3},{a:2,b:1},{a:3,b:3}].max(true, function(el){ return el['b']; }), [{a:1,b:3},{a:3,b:3}], 'Array#max');
    same([{a:-1,b:-5},{a:-2,b:-4},{a:-3,b:-3}].max(function(el){ return el['b']; }), {a:-3,b:-3}, 'Array#max');
    same([{a:-1,b:-5},{a:-2,b:-4},{a:-3,b:-3}].max(true, function(el){ return el['b']; }), [{a:-3,b:-3}], 'Array#max');
    same(['short','and', 'mort'].max(function(el){ return el.length; }), 'short', 'Array#max');
    same(['short','and', 'mort'].max(true, function(el){ return el.length; }), ['short'], 'Array#max');
    same(['short','and', 'morts', 'fat'].max(function(el){ return el.length; }), 'short', 'Array#max');
    same(['short','and', 'morts', 'fat'].max(true, function(el){ return el.length; }), ['short','morts'], 'Array#max');




    var people = [
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'ronnie', age: 13, hair: 'brown'  },
      { name: 'edmund', age: 27, hair: 'blonde' }
    ];

    equal(people.most(function(person){ return person.age; }).age, 27, 'Array#most');
    same(people.most(function(person){ return person.age; }), {name:'jim',age:27,hair:'brown'}, 'Array#most');
    same(people.most(true, function(person){ return person.age; }), [{name:'jim',age:27,hair:'brown'},{name:'edmund',age:27,hair:'blonde'}], 'Array#most');

    same(people.most(function(person){ return person.hair; }), null, 'Array#most');
    same(people.most(true, function(person){ return person.hair; }), [], 'Array#most');

    same([].most(), null, 'Array#most');
    same([1,2,3].most(), null, 'Array#most');
    same([1,2,3].most(true), [], 'Array#most');
    same([1,2,3,3].most(), 3, 'Array#most');
    same([1,2,3,3].most(true), [3], 'Array#most');
    same([1,1,2,3,3].most(), 1, 'Array#most');
    same([1,1,2,3,3].most(true), [1,3], 'Array#most');
    same(['a','b','c'].most(), null, 'Array#most');
    same(['a','b','c'].most(true), [], 'Array#most');
    same(['a','b','c','c'].most(), 'c', 'Array#most');
    same(['a','b','c','c'].most(true), ['c'], 'Array#most');
    same(['a','a','b','c','c'].most(), 'a', 'Array#most');
    same(['a','a','b','c','c'].most(true), ['a','c'], 'Array#most');

    // Leaving this here as a reference for how to collect the actual number of occurences.
    equal(people.most(true, function(person){ return person.age; }).length, 2, 'Array#most');


    contains(people.least(function(person){ return person.age; }).age, [52,13], 'Array#least');
    contains(people.least(function(person){ return person.age; }), [{name:'mary',age:52,hair:'blonde'},{name:'ronnie',age:13,hair:'brown'}], 'Array#least');
    same(people.least(true, function(person){ return person.age; }).sortBy('age', true), [{name:'mary',age:52,hair:'blonde'},{name:'ronnie',age:13,hair:'brown'}], 'Array#least');


    same(people.least(function(person){ return person.hair; }), null, 'Array#least');
    same(people.least(true, function(person){ return person.hair; }), [], 'Array#least');

    same([].least(), null, 'Array#least');
    same([1,2,3].least(), null, 'Array#least');
    same([1,2,3].least(true), [], 'Array#least');
    same([1,2,3,3].least(), 1, 'Array#least');
    same([1,2,3,3].least(true), [1,2], 'Array#least');
    same([1,1,2,3,3].least(), 2, 'Array#least');
    same([1,1,2,3,3].least(true), [2], 'Array#least');
    same([1,1,1,2,2,3,3,3].least(), 2, 'Array#least');
    same([1,1,1,2,2,3,3,3].least(true), [2], 'Array#least');
    same(['a','b','c'].least(), null, 'Array#least');
    same(['a','b','c'].least(true), [], 'Array#least');
    same(['a','b','c','c'].least(), 'a', 'Array#least');
    same(['a','b','c','c'].least(true), ['a','b'], 'Array#least');
    same(['a','a','b','c','c'].least(), 'b', 'Array#least');
    same(['a','a','b','c','c'].least(true), ['b'], 'Array#least');

    // Leaving this here as a reference for how to collect the actual number of occurences.
    same(people.least(true, function(person){ return person.age; }).length, 2, 'Array#least');





    same([12,87,55].sum(), 154, 'Array#sum');
    same([12,87,128].sum(), 227, 'Array#sum');
    same([].sum(), 0, 'Array#sum');
    same([null, false].sum(), 0, 'Array#sum');
    same([{a:1,b:5},{a:2,b:5},{a:3,b:5}].sum(function(el){ return el['a']; }), 6, 'Array#sum');

    same([13,18,13,14,13,16,14,21,13].average(), 15, 'Array#average');
    same([2,2,2].average(), 2, 'Array#average');
    same([2,3,4].average(), 3, 'Array#average');
    same([2,3,4,2].average(), 2.75, 'Array#average');
    same([].average(), 0, 'Array#average');
    same([null, false].average(), 0, 'Array#average');
    same([{a:1,b:5},{a:2,b:5},{a:3,b:5}].average(function(el){ return el['a']; }), 2, 'Array#average');


    same(people.average('age'), 29.75, 'Array#average');
    same(people.average(function(p){ return p.age; }), 29.75, 'Array#average');
    same(isNaN(people.average(function(p){ return p.hair; })), true, 'Array#average');



    same([1,1,2,2,3,3,4].groupBy(), {1:[1,1],2:[2,2],3:[3,3],4:[4]}, 'Array#groupBy');
    same(['a','b','c','a','e','c'].groupBy(), {'a':['a','a'],'b':['b'],'c':['c','c'],'e':['e']}, 'Array#groupBy');
    same([{a:1,b:5},{a:8,b:5},{a:8,b:3}].groupBy('a'), {8:[{a:8,b:5},{a:8,b:3}],1:[{a:1,b:5}]}, 'Array#groupBy');
    same([{a:1,b:5},{a:8,b:5},{a:8,b:3}].groupBy(function(el){ return el['a']; }), {8:[{a:8,b:5},{a:8,b:3}],1:[{a:1,b:5}]}, 'Array#groupBy');


    people = people.sortBy('hair');
    same(people.groupBy(function(p){ return p.age; }), {27: [{name:'edmund',age:27,hair:'blonde'},{name:'jim',age:27,hair:'brown'}],52:[{name:'mary',age:52,hair:'blonde'}],13:[{name:'ronnie',age:13,hair:'brown'}]}, 'Array#groupBy');




    same([1,2,3,4,5,6,7,8,9,10].inGroups(1), [[1,2,3,4,5,6,7,8,9,10]], 'Array#inGroups');
    same([1,2,3,4,5,6,7,8,9,10].inGroups(2), [[1,2,3,4,5],[6,7,8,9,10]], 'Array#inGroups');
    same([1,2,3,4,5,6,7,8,9,10].inGroups(3), [[1,2,3,4],[5,6,7,8],[9,10]], 'Array#inGroups');
    same([1,2,3,4,5,6,7,8,9,10].inGroups(4), [[1,2,3],[4,5,6],[7,8,9],[10]], 'Array#inGroups');
    same([1,2,3,4,5,6,7,8,9,10].inGroups(5), [[1,2],[3,4],[5,6],[7,8],[9,10]], 'Array#inGroups');
    same([1,2,3,4,5,6,7,8,9,10].inGroups(6), [[1,2],[3,4],[5,6],[7,8],[9,10],[]], 'Array#inGroups');
    same([1,2,3,4,5,6,7,8,9,10].inGroups(7), [[1,2],[3,4],[5,6],[7,8],[9,10],[],[]], 'Array#inGroups');


    same([1,2,3,4,5,6,7,8,9,10].inGroups(3, null), [[1,2,3,4],[5,6,7,8],[9,10,null,null]], 'Array#inGroups');
    same([1,2,3,4,5,6,7,8,9,10].inGroups(4, null), [[1,2,3],[4,5,6],[7,8,9],[10,null,null]], 'Array#inGroups');
    same([1,2,3,4,5,6,7,8,9,10].inGroups(5, null), [[1,2],[3,4],[5,6],[7,8],[9,10]], 'Array#inGroups');
    same([1,2,3,4,5,6,7,8,9,10].inGroups(6, null), [[1,2],[3,4],[5,6],[7,8],[9,10],[null,null]], 'Array#inGroups');
    same([1,2,3,4,5,6,7,8,9,10].inGroups(7, null), [[1,2],[3,4],[5,6],[7,8],[9,10],[null,null],[null,null]], 'Array#inGroups');




    same([1,2,3,4,5,6,7,8,9,10].inGroupsOf(3), [[1,2,3],[4,5,6],[7,8,9],[10]], 'Array#inGroupsOf');
    same([1,2,3,4,5,6,7,8,9].inGroupsOf(3), [[1,2,3],[4,5,6],[7,8,9]], 'Array#inGroupsOf');
    same([1,2,3,4,5,6,7,8].inGroupsOf(3), [[1,2,3],[4,5,6],[7,8]], 'Array#inGroupsOf');
    same([1,2,3,4,5,6,7].inGroupsOf(3), [[1,2,3],[4,5,6],[7]], 'Array#inGroupsOf');
    same([1,2,3,4,5,6].inGroupsOf(3), [[1,2,3],[4,5,6]], 'Array#inGroupsOf');
    same([1,2,3,4,5].inGroupsOf(3), [[1,2,3],[4,5]], 'Array#inGroupsOf');
    same([1,2,3,4].inGroupsOf(3), [[1,2,3],[4]], 'Array#inGroupsOf');
    same([1,2,3].inGroupsOf(3), [[1,2,3]], 'Array#inGroupsOf');
    same([1,2].inGroupsOf(3), [[1,2]], 'Array#inGroupsOf');
    same([1].inGroupsOf(3), [[1]], 'Array#inGroupsOf');

    same([1,2,3,4,5,6,7,8,9,10].inGroupsOf(3, null), [[1,2,3],[4,5,6],[7,8,9],[10, null, null]], 'Array#inGroupsOf');
    same([1,2,3,4,5,6,7,8,9].inGroupsOf(3, null), [[1,2,3],[4,5,6],[7,8,9]], 'Array#inGroupsOf');
    same([1,2,3,4,5,6,7,8].inGroupsOf(3, null), [[1,2,3],[4,5,6],[7,8, null]], 'Array#inGroupsOf');
    same([1,2,3,4,5,6,7].inGroupsOf(3, null), [[1,2,3],[4,5,6],[7, null, null]], 'Array#inGroupsOf');
    same([1,2,3,4,5,6].inGroupsOf(3, null), [[1,2,3],[4,5,6]], 'Array#inGroupsOf');
    same([1,2,3,4,5].inGroupsOf(3, null), [[1,2,3],[4,5,null]], 'Array#inGroupsOf');
    same([1,2,3,4].inGroupsOf(3, null), [[1,2,3],[4,null,null]], 'Array#inGroupsOf');
    same([1,2,3].inGroupsOf(3, null), [[1,2,3]], 'Array#inGroupsOf');
    same([1,2].inGroupsOf(3, null), [[1,2,null]], 'Array#inGroupsOf');
    same([1].inGroupsOf(3, null), [[1,null,null]], 'Array#inGroupsOf');

    same([1].inGroupsOf(3, ' '), [[1,' ',' ']], 'Array#inGroupsOf');
    same([1].inGroupsOf(3, true), [[1,true,true]], 'Array#inGroupsOf');
    same([1].inGroupsOf(3, false), [[1,false,false]], 'Array#inGroupsOf');

    same([1].inGroupsOf(), [[1]], 'Array#inGroupsOf');
    same([1].inGroupsOf(1, null), [[1]], 'Array#inGroupsOf');

    same([1].inGroupsOf(0), [1], 'Array#inGroupsOf');
    same([1].inGroupsOf(0, null), [1], 'Array#inGroupsOf');

    same([1].inGroupsOf(3, null), [[1, null, null]], 'Array#inGroupsOf');
    same([1].inGroupsOf(1, null), [[1]], 'Array#inGroupsOf');
    same([].inGroupsOf(3), [], 'Array#inGroupsOf');
    same([].inGroupsOf(3, null), [], 'Array#inGroupsOf');
    same([null].inGroupsOf(3), [[null]], 'Array#inGroupsOf');
    same([null].inGroupsOf(3, null), [[null,null,null]], 'Array#inGroupsOf');



    // Emulating example of Enumerable#each_slice
    same((1).upto(10).inGroupsOf(3).map(function(g){ return g[1]; }).compact(), [2,5,8], 'Array#inGroupsOf');


    same([1,2,3,4,5].split(3), [[1,2],[4,5]], 'Array#split');
    same([1,2,3,4,5,6,7,8,9,10].split(function(i){ return i % 3 == 0; }), [[1,2],[4,5],[7,8],[10]], 'Array#split');
    same(['wherever','you','go','whatever','you','do'].split(function(str){ return str.length == 2; }), [['wherever','you'],['whatever','you']], 'Array#split');
    same(['wherever','you','go','whatever','you','do'].split(function(str){ return str.length == 3; }), [['wherever'],['go','whatever'],['do']], 'Array#split');
    same(['wherever','you','go','whatever','you','do'].split(function(str){ return str.length < 4; }), [['wherever'],['whatever']], 'Array#split');



    same([1,2,3].compact(), [1,2,3], 'Array#compact');
    same([1,2,null,3].compact(), [1,2,3], 'Array#compact');
    same([1,2,undefined,3].compact(), [1,2,3], 'Array#compact');
    same([undefined,undefined,undefined].compact(), [], 'Array#compact');
    same([null,null,null].compact(), [], 'Array#compact');
    same([false,false,false].compact(), [false,false,false], 'Array#compact');
    same([0,1,2].compact(), [0,1,2], 'Array#compact');
    same([].compact(), [], 'Array#compact');



    same([1,2,2,3].count(), 4, 'Array#count');
    same([1,2,2,3].count(2), 2, 'Array#count');
    same(['a','b','c','c'].count(), 4, 'Array#count');
    same(['a','b','c','c'].count('c'), 2, 'Array#count');
    same([1,2,2,3].count(function(el){ return el % 2 == 0; }), 2, 'Array#count');
    same([1,2,2,3].count(function(el){ return el > 2; }), 1, 'Array#count');
    same([1,2,2,3].count(function(el){ return el > 20; }), 0, 'Array#count');
    same([{a:1},{a:2},{a:1}].count({a:1}), 2, 'Array#count');






    same([1,2,2,3].remove(), [], 'Array#remove');
    same([1,2,2,3].remove(2), [1,3], 'Array#remove');
    same(['a','b','c','c'].remove(), [], 'Array#remove');
    same(['a','b','c','c'].remove('c'), ['a','b'], 'Array#remove');
    same([1,2,2,3].remove(function(el){ return el % 2 == 0; }), [1,3], 'Array#remove');
    same([1,2,2,3].remove(function(el){ return el > 2; }), [1,2,2], 'Array#remove');
    same([1,2,2,3].remove(function(el){ return el > 20; }), [1,2,2,3], 'Array#remove');
    same([{a:1},{a:2},{a:1}].remove({a:1}), [{a:2}], 'Array#remove');



    same([1,2,2,3].removeIndex(), [1,2,2,3], 'Array#removeIndex');
    same([1,2,2,3].removeIndex(0), [2,2,3], 'Array#removeIndex');
    same([1,2,2,3].removeIndex(1), [1,2,3], 'Array#removeIndex');
    same([1,2,2,3].removeIndex(2), [1,2,3], 'Array#removeIndex');
    same([1,2,2,3].removeIndex(3), [1,2,2], 'Array#removeIndex');
    same([1,2,2,3].removeIndex(4), [1,2,2,3], 'Array#removeIndex');
    same(['a','b','c','c'].removeIndex(), ['a','b','c','c'], 'Array#removeIndex');
    same(['a','b','c','c'].removeIndex(0), ['b','c','c'], 'Array#removeIndex');
    same(['a','b','c','c'].removeIndex(1), ['a','c','c'], 'Array#removeIndex');
    same(['a','b','c','c'].removeIndex(2), ['a','b','c'], 'Array#removeIndex');
    same(['a','b','c','c'].removeIndex(3), ['a','b','c'], 'Array#removeIndex');
    same(['a','b','c','c'].removeIndex(4), ['a','b','c','c'], 'Array#removeIndex');
    same([{a:1},{a:2},{a:1}].removeIndex(1), [{a:1},{a:1}], 'Array#removeIndex');
    same([1,2,2,3].removeIndex(0,1), [2,3], 'Array#removeIndex');
    same([1,2,2,3].removeIndex(0,2), [3], 'Array#removeIndex');
    same([1,2,2,3].removeIndex(1,2), [1,3], 'Array#removeIndex');
    same([1,2,2,3].removeIndex(1,5), [1], 'Array#removeIndex');
    same([1,2,2,3].removeIndex(0,5), [], 'Array#removeIndex');






    same([1,2,3].add(4), [1,2,3,4], 'Array#add');
    same(['a','b','c'].add('d'), ['a','b','c','d'], 'Array#add');
    same([{a:1},{a:2}].add({a:3}), [{a:1},{a:2},{a:3}], 'Array#add');
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




    arr = [1,2,3];
    arr.insert(4)
    same(arr, [1,2,3,4], 'Array#insert');

    arr = ['a','b','c'];
    arr.insert('d')
    same(arr, ['a','b','c','d'], 'Array#insert');

    arr = [{a:1},{a:2}];
    arr.insert({a:3})
    same(arr, [{a:1},{a:2},{a:3}], 'Array#insert');

    arr = [1,2,3];
    arr.insert(4, 1)
    same(arr, [1,4,2,3], 'Array#insert');

    arr = ['a','b','c'];
    arr.insert('d', 1)
    same(arr, ['a','d','b','c'], 'Array#insert');

    arr = [{a:1},{a:2}];
    arr.insert({a:3}, 1)
    same(arr, [{a:1},{a:3},{a:2}], 'Array#insert');
    same(arr.insert({a:3}), {a:3}, 'Array#insert');



    equal([1,2,3].blank(), false, 'Array#blank');
    equal([].blank(), true, 'Array#blank');
    equal([null].blank(), true, 'Array#blank');
    equal([undefined].blank(), true, 'Array#blank');
    equal([null,null].blank(), true, 'Array#blank');
    equal([undefined,undefined].blank(), true, 'Array#blank');
    equal([false,false].blank(), false, 'Array#blank');
    equal([0,0].blank(), false, 'Array#blank');




    equal([1,2,3].any(), false, 'Array#any | no parameters');
    equal([1,2,3].any(1), true, 'Array#any | find contained number');
    equal([1,2,3].any(4), false, 'Array#any | find non-contained number');
    equal([1,2,3].any('a'), false, 'Array#any | find non-contained string');
    equal(['a','b','c'].any('a'), true, 'Array#any | find contained string');
    equal(['a','b','c'].any('f'), false, 'Array#any | find non-contained string in string array');
    equal(['a','b','c'].any(/[a-f]/), true, 'Array#any | Regex a-f');
    equal(['a','b','c'].any(/[m-z]/), false, 'Array#any | Regex m-z');
    equal(['a','b','c'].any(function(e){ return e.length > 1; }), false, 'Array#any | find length greater than one');
    equal(['a','b','c'].any(function(e){ return e.length < 2; }), true, 'Array#any | find length less than two');
    equal(['a','bar','cat'].any(function(e){ return e.length < 2; }), true, 'Array#any | find existing length less than two');
    same([{a:1},{a:2},{a:1}].any(1), false, 'Array#any | find number in object array');
    same([{a:1},{a:2},{a:1}].any({a:1}), true, 'Array#any | find object in object array');
    same([{a:1},{a:2},{a:1}].any(function(e){ return e['a'] == 1; }), true, 'Array#any | find object in object array based on function');
    same([{a:1},{a:2},{a:1}].any(function(e){ return e['b'] == 1; }), false, 'Array#any | find non-existing object in object array based on function');
    equal([0].any(0), true, 'Array#any | find zero');



    equal([1,2,3].has(), false, 'Array#has');
    equal([1,2,3].has(1), true, 'Array#has');
    equal([1,2,3].has(4), false, 'Array#has');
    equal([1,2,3].has('a'), false, 'Array#has');
    equal(['a','b','c'].has('a'), true, 'Array#has');
    equal(['a','b','c'].has('f'), false, 'Array#has');
    equal(['a','b','c'].has(/[a-f]/), true, 'Array#has');
    equal(['a','b','c'].has(/[m-z]/), false, 'Array#has');
    equal(['a','b','c'].has(function(e){ return e.length > 1; }), false, 'Array#has');
    equal(['a','b','c'].has(function(e){ return e.length < 2; }), true, 'Array#has');
    equal(['a','bar','cat'].has(function(e){ return e.length < 2; }), true, 'Array#has');
    same([{a:1},{a:2},{a:1}].has(1), false, 'Array#has');
    same([{a:1},{a:2},{a:1}].has({a:1}), true, 'Array#has');
    same([{a:1},{a:2},{a:1}].has(function(e){ return e['a'] == 1; }), true, 'Array#has');
    same([{a:1},{a:2},{a:1}].has(function(e){ return e['b'] == 1; }), false, 'Array#has');



    // None is the reverse of any

    equal([1,2,3].none(), true, 'Array#none');
    equal([1,2,3].none(1), false, 'Array#none');
    equal([1,2,3].none(4), true, 'Array#none');
    equal([1,2,3].none('a'), true, 'Array#none');
    equal(['a','b','c'].none('a'), false, 'Array#none');
    equal(['a','b','c'].none('f'), true, 'Array#none');
    equal(['a','b','c'].none(/[a-f]/), false, 'Array#none');
    equal(['a','b','c'].none(/[m-z]/), true, 'Array#none');
    equal(['a','b','c'].none(function(e){ return e.length > 1; }), true, 'Array#none');
    equal(['a','b','c'].none(function(e){ return e.length < 2; }), false, 'Array#none');
    equal(['a','bar','cat'].none(function(e){ return e.length < 2; }), false, 'Array#none');
    same([{a:1},{a:2},{a:1}].none(1), true, 'Array#none');
    same([{a:1},{a:2},{a:1}].none({a:1}), false, 'Array#none');
    same([{a:1},{a:2},{a:1}].none(function(e){ return e['a'] == 1; }), false, 'Array#none');
    same([{a:1},{a:2},{a:1}].none(function(e){ return e['b'] == 1; }), true, 'Array#none');





    equal([1,2,3].all(), false, 'Array#all');
    equal([1,2,3].all(1), false, 'Array#all');
    equal([1,1,1].all(1), true, 'Array#all');
    equal([1,2,3].all(3), false, 'Array#all');
    equal(['a','b','c'].all('a'), false, 'Array#all');
    equal(['a','a','a'].all('a'), true, 'Array#all');
    equal(['a','b','c'].all('f'), false, 'Array#all');
    equal(['a','b','c'].all(/[a-f]/), true, 'Array#all');
    equal(['a','b','c'].all(/[a-b]/), false, 'Array#all');
    equal(['a','b','c'].all(function(e){ return e.length > 1; }), false, 'Array#all');
    equal(['a','b','c'].all(function(e){ return e.length < 2; }), true, 'Array#all');
    equal(['a','bar','cat'].all(function(e){ return e.length < 2; }), false, 'Array#all');
    same([{a:1},{a:2},{a:1}].all(1), false, 'Array#all');
    same([{a:1},{a:2},{a:1}].all({a:1}), false, 'Array#all');
    same([{a:1},{a:1},{a:1}].all({a:1}), true, 'Array#all');
    same([{a:1},{a:2},{a:1}].all(function(e){ return e['a'] == 1; }), false, 'Array#all');
    same([{a:1},{a:2},{a:1}].all(function(e){ return e['b'] == 1; }), false, 'Array#all');
    same([{a:1},{a:1},{a:1}].all(function(e){ return e['a'] == 1; }), true, 'Array#all');



    same([1,2,3].flatten(), [1,2,3], 'Array#flatten');
    same(['a','b','c'].flatten(), ['a','b','c'], 'Array#flatten');
    same([{a:1},{a:2},{a:1}].flatten(), [{a:1},{a:2},{a:1}], 'Array#flatten');
    same([[1],[2],[3]].flatten(), [1,2,3], 'Array#flatten');
    same([[1,2],[3]].flatten(), [1,2,3], 'Array#flatten');
    same([[1,2,3]].flatten(), [1,2,3], 'Array#flatten');
    same([['a'],['b'],['c']].flatten(), ['a','b','c'], 'Array#flatten');
    same([['a','b'],['c']].flatten(), ['a','b','c'], 'Array#flatten');
    same([['a','b','c']].flatten(), ['a','b','c'], 'Array#flatten');
    same([[{a:1}],[{a:2}],[{a:1}]].flatten(), [{a:1},{a:2},{a:1}], 'Array#flatten');
    same([[{a:1},{a:2}],[{a:1}]].flatten(), [{a:1},{a:2},{a:1}], 'Array#flatten');
    same([[{a:1},{a:2},{a:1}]].flatten(), [{a:1},{a:2},{a:1}], 'Array#flatten');
    same([[[['a','b'],'c',['d','e']],'f'],['g']].flatten(), ['a','b','c','d','e','f','g'], 'Array#flatten');





    arr = ['more','everyone!','bring','the','family'];
    same(arr.sortBy('length'), ['the','more','bring','family','everyone!'], 'Array#sortBy');
    same(arr.sortBy('length', true), ['everyone!','family','bring','more','the'], 'Array#sortBy');

    same(arr.sortBy(function(a){ return a.length; }), ['the','more','bring','family','everyone!'], 'Array#sortBy');
    same(arr.sortBy(function(a){ return a.length; }, true), ['everyone!','family','bring','more','the'], 'Array#sortBy');

    arr = [{a:'foo'},{a:'bar'},{a:'skittles'}];
    same(arr.sortBy('a'), [{a:'bar'},{a:'foo'},{a:'skittles'}], 'Array#sortBy');
    same(arr.sortBy('a', true), [{a:'skittles'},{a:'foo'},{a:'bar'}], 'Array#sortBy');






    arr = [1,2,3,4,5,6,7,8,9,10];
    var firsts = [];
    firsts.push(arr.randomize().first());
    firsts.push(arr.randomize().first());
    firsts.push(arr.randomize().first());
    firsts.push(arr.randomize().first());
    firsts.push(arr.randomize().first());
    firsts.push(arr.randomize().first());
    firsts.push(arr.randomize().first());
    firsts.push(arr.randomize().first());
    firsts.push(arr.randomize().first());
    firsts.push(arr.randomize().first());

    /* Note that there is a built-in 0.00000001% chance that this test will fail */
    equals(firsts.all(1), false, 'Array#randomize');



    // Shuffle is an alias

    arr = [1,2,3,4,5,6,7,8,9,10];
    var firsts = [];
    firsts.push(arr.shuffle().first());
    firsts.push(arr.shuffle().first());
    firsts.push(arr.shuffle().first());
    firsts.push(arr.shuffle().first());
    firsts.push(arr.shuffle().first());
    firsts.push(arr.shuffle().first());
    firsts.push(arr.shuffle().first());
    firsts.push(arr.shuffle().first());
    firsts.push(arr.shuffle().first());
    firsts.push(arr.shuffle().first());

    /* Note that there is a built-in 0.00000001% chance that this test will fail */
    equals(firsts.all(1), false, 'Array#shuffle');




    // These tests are a bit more complicated and are designed to flesh out desired behavior
    var ids = [11235,11211,11235,43248,55232,11456];






    // Thanks to Steven Levitah (http://stevenlevithan.com/demo/split.cfm) for inspiration and information here.


    same('a,b,c,d,e'.split(',') , ['a','b','c','d','e'] , 'Array#split splits on standard commas');
    same('a|b|c|d|e'.split(',') , ['a|b|c|d|e'] , "Array#split doesn't split on standard commas");
    same('a|b|c|d|e'.split('|') , ['a','b','c','d','e'] , 'Array#split splits on pipes');
    same('a,b,c,d,e'.split(/,/) , ['a','b','c','d','e'] , 'Array#split splits on standard regexp commas');
    same('a|b|c|d|e'.split(/\|/) , ['a','b','c','d','e'] , 'Array#split splits on standard regexp pipes');
    same('a|b|c|d|e'.split(/[,|]/) , ['a','b','c','d','e'] , 'Array#split splits on classes');
    same('a|b|c|d|e'.split(/[a-z]/) , ['','|','|','|','|',''] , 'Array#split splits on classes with ranges');
    same('a|b|c|d|e'.split(/\|*/) , ['a','b','c','d','e'] , 'Array#split splits on star');
    same('a|b|c|d|e'.split(/\|?/) , ['a','b','c','d','e'] , 'Array#split splits on optionals');

    same('a,b,c,d,e'.split(',', 2) , ['a','b'] , 'Array#split handles limits');

    same('a|||b|c|d|e'.split('|') , ['a', '', '', 'b','c','d','e'] , 'Array#split splits back-to-back separators on a string');
    same('a|||b|c|d|e'.split(/\|/) , ['a', '', '', 'b','c','d','e'] , 'Array#split splits back-to-back separators on a regexp');

    same('paragraph one\n\nparagraph two\n\n\n'.split(/\n/) , ['paragraph one', '', 'paragraph two','','',''] , 'Array#split splits on new lines');
    same(''.split() , [''] , 'Array#split has a single null string for null separators on null strings');
    same(''.split(/./) , [''] , 'Array#split has a single null string for separators on null strings');

    same(''.split(/.?/) , [] , 'Array#split has a single null string for optionals on null strings');
    same(''.split(/.??/) , [] , 'Array#split has a single null string for double optionals on null strings');

    same('a'.split(/./) , ['',''] , 'Array#split has two entries when splitting on the only character in the string');
    same('a'.split(/-/) , ['a'] , 'Array#split has one entry when only one character and no match');
    same('a-b'.split(/-/) , ['a', 'b'] , 'Array#split properly splits hyphens');
    same('a-b'.split(/-?/) , ['a', 'b'] , 'Array#split properly splits optional hyphens');


    same('a:b:c'.split(/(:)/) , ['a',':','b',':','c'] , 'Array#split respects capturing groups');


    same('ab'.split(/a*/) , ['', 'b'] , 'Array#split complex regex splitting');
    same('ab'.split(/a*?/) , ['a', 'b'] , 'Array#split complex regex splitting');
    same('ab'.split(/(?:ab)/) , ['', ''] , 'Array#split complex regex splitting');
    same('ab'.split(/(?:ab)*/) , ['', ''] , 'Array#split complex regex splitting');
    same('ab'.split(/(?:ab)*?/) , ['a', 'b'] , 'Array#split complex regex splitting');
    same('test'.split('') , ['t', 'e', 's', 't'] , 'Array#split complex regex splitting');
    same('test'.split() , ['test'] , 'Array#split complex regex splitting');
    same('111'.split(1) , ['', '', '', ''] , 'Array#split complex regex splitting');
    same('test'.split(/(?:)/, 2) , ['t', 'e'] , 'Array#split complex regex splitting');
    same('test'.split(/(?:)/, -1) , ['t', 'e', 's', 't'] , 'Array#split complex regex splitting');
    same('test'.split(/(?:)/, undefined) , ['t', 'e', 's', 't'] , 'Array#split complex regex splitting');
    same('test'.split(/(?:)/, null) , [] , 'Array#split complex regex splitting');
    same('test'.split(/(?:)/, NaN) , [] , 'Array#split complex regex splitting');
    same('test'.split(/(?:)/, true) , ['t'] , 'Array#split complex regex splitting');
    same('test'.split(/(?:)/, '2') , ['t', 'e'] , 'Array#split complex regex splitting');
    same('test'.split(/(?:)/, 'two') , [] , 'Array#split complex regex splitting');
    same('a'.split(/-/) , ['a'] , 'Array#split complex regex splitting');
    same('a'.split(/-?/) , ['a'] , 'Array#split complex regex splitting');
    same('a'.split(/-??/) , ['a'] , 'Array#split complex regex splitting');
    same('a'.split(/a/) , ['', ''] , 'Array#split complex regex splitting');
    same('a'.split(/a?/) , ['', ''] , 'Array#split complex regex splitting');
    same('a'.split(/a??/) , ['a'] , 'Array#split complex regex splitting');
    same('ab'.split(/-/) , ['ab'] , 'Array#split complex regex splitting');
    same('ab'.split(/-?/) , ['a', 'b'] , 'Array#split complex regex splitting');
    same('ab'.split(/-??/) , ['a', 'b'] , 'Array#split complex regex splitting');
    same('a-b'.split(/-/) , ['a', 'b'] , 'Array#split complex regex splitting');
    same('a-b'.split(/-?/) , ['a', 'b'] , 'Array#split complex regex splitting');
    same('a-b'.split(/-??/) , ['a', '-', 'b'] , 'Array#split complex regex splitting');
    same('a--b'.split(/-/) , ['a', '', 'b'] , 'Array#split complex regex splitting');
    same('a--b'.split(/-?/) , ['a', '', 'b'] , 'Array#split complex regex splitting');
    same('a--b'.split(/-??/) , ['a', '-', '-', 'b'] , 'Array#split complex regex splitting');
    same(''.split(/()()/) , [] , 'Array#split complex regex splitting');
    same('.'.split(/()()/) , ['.'] , 'Array#split complex regex splitting');
    same('.'.split(/(.?)(.?)/) , ['', '.', '', ''] , 'Array#split complex regex splitting');
    same('.'.split(/(.??)(.??)/) , ['.'] , 'Array#split complex regex splitting');
    same('.'.split(/(.)?(.)?/) , ['', '.', undefined, ''] , 'Array#split complex regex splitting');
    same('tesst'.split(/(s)*/) , ['t', undefined, 'e', 's', 't'] , 'Array#split complex regex splitting');
    same('tesst'.split(/(s)*?/) , ['t', undefined, 'e', undefined, 's', undefined, 's', undefined, 't'] , 'Array#split complex regex splitting');
    same('tesst'.split(/(s*)/) , ['t', '', 'e', 'ss', 't'] , 'Array#split complex regex splitting');
    same('tesst'.split(/(s*?)/) , ['t', '', 'e', '', 's', '', 's', '', 't'] , 'Array#split complex regex splitting');
    same('tesst'.split(/(?:s)*/) , ['t', 'e', 't'] , 'Array#split complex regex splitting');
    same('tesst'.split(/(?=s+)/) , ['te', 's', 'st'] , 'Array#split complex regex splitting');
    same('test'.split('t') , ['', 'es', ''] , 'Array#split complex regex splitting');
    same('test'.split('es') , ['t', 't'] , 'Array#split complex regex splitting');
    same('test'.split(/t/) , ['', 'es', ''] , 'Array#split complex regex splitting');
    same('test'.split(/es/) , ['t', 't'] , 'Array#split complex regex splitting');
    same('test'.split(/(t)/) , ['', 't', 'es', 't', ''] , 'Array#split complex regex splitting');
    same('test'.split(/(es)/) , ['t', 'es', 't'] , 'Array#split complex regex splitting');
    same('test'.split(/(t)(e)(s)(t)/) , ['', 't', 'e', 's', 't', ''] , 'Array#split complex regex splitting');
    same('.'.split(/(((.((.??)))))/) , ['', '.', '.', '.', '', '', ''] , 'Array#split complex regex splitting');
    same('.'.split(/(((((.??)))))/) , ['.'] , 'Array#split complex regex splitting');



});



test('Date', function () {


  window.parent.poo = getDate;
  window.parent.poop = getRelativeDate;
  window.parent.pee = getDateWithWeekdayAndOffset;

//  dateEquals(Date.create('today'), 0, 'Date#constructor');

  // Just the year
  dateEquals(Date.create('1999'), getDate(1999), 'Date#create | Just the year');

  // Just the year
  //dateEquals(Date.create('June'), getDate(null, 6), 'Date#create | Just the month');

  // Slashes (American style)
  dateEquals(Date.create('08/25'), getDate(null,8, 25), 'Date#create | American style slashes | mm/dd');
  dateEquals(Date.create('8/25'), getDate(null, 8, 25), 'Date#create | American style slashes | m/dd');
  dateEquals(Date.create('08/25/1978'), getDate(1978, 8, 25), 'Date#create | American style slashes | mm/dd/yyyy');
  dateEquals(Date.create('08/25/0001'), getDate(1, 8, 25), 'Date#create | American style slashes | mm/dd/0001');
  dateEquals(Date.create('8/25/1978'), getDate(1978, 8, 25), 'Date#create | American style slashes | /m/dd/yyyy');
  dateEquals(Date.create('8/25/78'), getDate(1978, 8, 25), 'Date#create | American style slashes | m/dd/yy');
  dateEquals(Date.create('08/25/78'), getDate(1978, 8, 25), 'Date#create | American style slashes | mm/dd/yy');
  dateEquals(Date.create('8/25/01'), getDate(2001, 8, 25), 'Date#create | American style slashes | m/dd/01');
  dateEquals(Date.create('8/25/49'), getDate(2049, 8, 25), 'Date#create | American style slashes | m/dd/49');
  dateEquals(Date.create('8/25/50'), getDate(1950, 8, 25), 'Date#create | American style slashes | m/dd/50');

  // Dashes (American style)
  dateEquals(Date.create('08-25-1978'), getDate(1978, 8, 25), 'Date#create | American style dashes | mm-dd-yyyy');
  dateEquals(Date.create('8-25-1978'), getDate(1978, 8, 25), 'Date#create | American style dashes | m-dd-yyyy');


  // dd-dd-dd is NOT American style as it is a reserved ISO8601 date format
  dateEquals(Date.create('08-05-05'), getDate(2008, 5, 5), 'Date#create | dd-dd-dd is an ISO8601 format');

  // Dots (American style)
  dateEquals(Date.create('08.25.1978'), getDate(1978, 8, 25), 'Date#create | American style dots | mm.dd.yyyy');
  dateEquals(Date.create('8.25.1978'), getDate(1978, 8, 25), 'Date#create | American style dots | m.dd.yyyy');


  dateEquals(Date.create('08/10', true), getDate(null, 10, 8), 'Date#create | European style slashes | dd/mm');
  // Slashes (European style)
  dateEquals(Date.create('8/10', true), getDate(null, 10, 8), 'Date#create | European style slashes | d/mm');
  dateEquals(Date.create('08/10/1978', true), getDate(1978, 10, 8), 'Date#create | European style slashes | dd/mm/yyyy');
  dateEquals(Date.create('8/10/1978', true), getDate(1978, 10, 8), 'Date#create | European style slashes | d/mm/yyyy');
  dateEquals(Date.create('8/10/78', true), getDate(1978, 10, 8), 'Date#create | European style slashes | d/mm/yy');
  dateEquals(Date.create('08/10/78', true), getDate(1978, 10, 8), 'Date#create | European style slashes | dd/mm/yy');
  dateEquals(Date.create('8/10/01', true), getDate(2001, 10, 8), 'Date#create | European style slashes | d/mm/01');
  dateEquals(Date.create('8/10/49', true), getDate(2049, 10, 8), 'Date#create | European style slashes | d/mm/49');
  dateEquals(Date.create('8/10/50', true), getDate(1950, 10, 8), 'Date#create | European style slashes | d/mm/50');

  // Dashes (European style) 
  dateEquals(Date.create('08-10-1978', true), getDate(1978, 10, 8), 'Date#create | European style dashes | dd-dd-dd is an ISO8601 format');

  // Dots (European style)
  dateEquals(Date.create('08.10.1978', true), getDate(1978, 10, 8), 'Date#create | European style dots | dd.mm.yyyy');
  dateEquals(Date.create('8.10.1978', true), getDate(1978, 10, 8), 'Date#create | European style dots | d.mm.yyyy');
  dateEquals(Date.create('08-05-05'), getDate(2008, 5, 5), 'Date#create | dd-dd-dd is an ISO8601 format');




  // Reverse slashes
  dateEquals(Date.create('1978/08/25'), getDate(1978, 8, 25), 'Date#create | Reverse slashes | yyyy/mm/dd');
  dateEquals(Date.create('1978/8/25'), getDate(1978, 8, 25), 'Date#create | Reverse slashes | yyyy/m/dd');
  dateEquals(Date.create('1978/08'), getDate(1978, 8), 'Date#create | Reverse slashes | yyyy/mm');
  dateEquals(Date.create('1978/8'), getDate(1978, 8), 'Date#create | Reverse slashes | yyyy/m');

  // Reverse dashes
  dateEquals(Date.create('1978-08-25'), getDate(1978, 8, 25), 'Date#create | Reverse dashes | yyyy-mm-dd');
  dateEquals(Date.create('1978-08'), getDate(1978, 8), 'Date#create | Reverse dashes | yyyy-mm');
  dateEquals(Date.create('1978-8'), getDate(1978, 8), 'Date#create | Reverse dashes | yyyy-m');

  // Reverse dots
  dateEquals(Date.create('1978.08.25'), getDate(1978, 8, 25), 'Date#create | Reverse dots | yyyy.mm.dd');
  dateEquals(Date.create('1978.08'), getDate(1978, 8), 'Date#create | Reverse dots | yyyy.mm');
  dateEquals(Date.create('1978.8'), getDate(1978, 8), 'Date#create | Reverse dots | yyyy.m');

  // Abbreviated reverse slash format yy/mm/dd cannot exist because it clashes with forward
  // slash format dd/mm/yy (with european variant). This rule however, doesn't follow for dashes,
  // which is abbreviated ISO8601 format: yy-mm-dd
  dateEquals(Date.create('01/02/03'), getDate(2003, 1, 2), 'Date#create | Ambiguous 2 digit format mm/dd/yy');
  dateEquals(Date.create('01/02/03', true), getDate(2003, 2, 1), 'Date#create | Ambiguous 2 digit European variant dd/mm/yy');
  dateEquals(Date.create('01-02-03'), getDate(2001, 2, 3), 'Date#create | Ambiguous 2 digit ISO variant yy-mm-dd');
  dateEquals(Date.create('01-02-03', true), getDate(2001, 2, 3), 'Date#create | Ambiguous 2 digit ISO variant has NO European variant of its own');


  // Text based formats
  dateEquals(Date.create('June 2008'), getDate(2008, 6), 'Date#create | Full text | Month yyyy');
  dateEquals(Date.create('June-2008'), getDate(2008, 6), 'Date#create | Full text | Month-yyyy');
  dateEquals(Date.create('June.2008'), getDate(2008, 6), 'Date#create | Full text | Month.yyyy');
  dateEquals(Date.create('June 1st, 2008'), getDate(2008, 6, 1), 'Date#create | Full text | Month 1st, yyyy');
  dateEquals(Date.create('June 2nd, 2008'), getDate(2008, 6, 2), 'Date#create | Full text | Month 2nd, yyyy');
  dateEquals(Date.create('June 3rd, 2008'), getDate(2008, 6, 3), 'Date#create | Full text | Month 3rd, yyyy');
  dateEquals(Date.create('June 4th, 2008'), getDate(2008, 6, 4), 'Date#create | Full text | Month 4th, yyyy');
  dateEquals(Date.create('June 15th, 2008'), getDate(2008, 6, 15), 'Date#create | Full text | Month 15th, yyyy');
  dateEquals(Date.create('June 1st 2008'), getDate(2008, 6, 1), 'Date#create | Full text | Month 1st yyyy');
  dateEquals(Date.create('June 2nd 2008'), getDate(2008, 6, 2), 'Date#create | Full text | Month 2nd yyyy');
  dateEquals(Date.create('June 3rd 2008'), getDate(2008, 6, 3), 'Date#create | Full text | Month 3rd yyyy');
  dateEquals(Date.create('June 4th 2008'), getDate(2008, 6, 4), 'Date#create | Full text | Month 4th yyyy');
  dateEquals(Date.create('June 15, 2008'), getDate(2008, 6, 15), 'Date#create | Full text | Month dd, yyyy');
  dateEquals(Date.create('June 15 2008'), getDate(2008, 6, 15), 'Date#create | Full text | Month dd yyyy');
  dateEquals(Date.create('15 July, 2008'), getDate(2008, 7, 15), 'Date#create | Full text | dd Month, yyyy');
  dateEquals(Date.create('15 July 2008'), getDate(2008, 7, 15), 'Date#create | Full text | dd Month yyyy');
  dateEquals(Date.create('juNe 1St 2008'), getDate(2008, 6, 1), 'Date#create | Full text | Month 1st yyyy case insensitive');

  // Special cases
  dateEquals(Date.create(' July 4th, 1987 '), getDate(1987, 7, 4), 'Date#create | Special Cases | Untrimmed full text');
  dateEquals(Date.create('  7/4/1987 '), getDate(1987, 7, 4), 'Date#create | Special Cases | Untrimmed American');
  dateEquals(Date.create('   1987-07-04    '), getDate(1987, 7, 4), 'Date#create | Special Cases | Untrimmed ISO8601');

  // Abbreviated formats
  dateEquals(Date.create('Dec 1st, 2008'), getDate(2008, 12, 1), 'Date#create | Abbreviated | without dot');
  dateEquals(Date.create('Dec. 1st, 2008'), getDate(2008, 12, 1), 'Date#create | Abbreviated | with dot');
  dateEquals(Date.create('1 Dec. 2008'), getDate(2008, 12, 1), 'Date#create | Abbreviated | reversed with dot');
  dateEquals(Date.create('1 Dec., 2008'), getDate(2008, 12, 1), 'Date#create | Abbreviated | reversed with dot and comma');
  dateEquals(Date.create('1 Dec, 2008'), getDate(2008, 12, 1), 'Date#create | Abbreviated | reversed with comma and no dot');


  dateEquals(Date.create('May-09-78'), getDate(1978, 5, 9), 'Date#create | Abbreviated | Mon.-dd-yy');
  dateEquals(Date.create('Wednesday July 3rd, 2008'), getDate(2008, 7, 3), 'Date#create | Full Text | With day of week');
  dateEquals(Date.create('Wed July 3rd, 2008'), getDate(2008, 7, 3), 'Date#create | Full Text | With day of week');
  dateEquals(Date.create('Wed. July 3rd, 2008'), getDate(2008, 7, 3), 'Date#create | Full Text | With day of week');




  // ISO 8601
  dateEquals(Date.create('2001-1-1'), getDate(2001, 1, 1), 'Date#create | ISO8601 | not padded');
  dateEquals(Date.create('2001-01-1'), getDate(2001, 1, 1), 'Date#create | ISO8601 | month padded');
  dateEquals(Date.create('2001-01-01'), getDate(2001, 1, 1), 'Date#create | ISO8601 | month and day padded');
  dateEquals(Date.create('2010-11-22'), getDate(2010,11,22), 'Date#create | ISO8601 | month and day padded 2010');
  dateEquals(Date.create('20101122'), getDate(2010,11,22), 'Date#create | ISO8601 | digits strung together');
  dateEquals(Date.create('-0002-07-26'), getDate(-2, 7, 26), 'Date#create | ISO8601 | minus sign (bc)'); // BC
  dateEquals(Date.create('+1978-04-17'), getDate(1978, 4, 17), 'Date#create | ISO8601 | plus sign (ad)'); // AD



  // Date with time formats
  dateEquals(Date.create('08/25/1978 12:04'), getDate(1978, 8, 25, 12, 4), 'Date#create | Date/Time | Slash format');
  dateEquals(Date.create('08-25-1978 12:04'), getDate(1978, 8, 25, 12, 4), 'Date#create | Date/Time | Dash format');
  dateEquals(Date.create('1978/08/25 12:04'), getDate(1978, 8, 25, 12, 4), 'Date#create | Date/Time | Reverse slash format');
  dateEquals(Date.create('June 1st, 2008 12:04'), getDate(2008, 6, 1, 12, 4), 'Date#create | Date/Time | Full text format');

  dateEquals(Date.create('08-25-1978 12:04:57'), getDate(1978, 8, 25, 12, 4, 57), 'Date#create | Date/Time | with seconds');
  dateEquals(Date.create('08-25-1978 12:04:57.322'), getDate(1978, 8, 25, 12, 4, 57, 322), 'Date#create | Date/Time | with milliseconds');

  dateEquals(Date.create('08-25-1978 12pm'), getDate(1978, 8, 25, 12), 'Date#create | Date/Time | with meridian');
  dateEquals(Date.create('08-25-1978 12:42pm'), getDate(1978, 8, 25, 12, 42), 'Date#create | Date/Time | with minutes and meridian');
  dateEquals(Date.create('08-25-1978 12:42:32pm'), getDate(1978, 8, 25, 12, 42, 32), 'Date#create | Date/Time | with seconds and meridian');
  dateEquals(Date.create('08-25-1978 12:42:32.488pm'), getDate(1978, 8, 25, 12, 42, 32, 488), 'Date#create | Date/Time | with seconds and meridian');

  dateEquals(Date.create('08-25-1978 00:00am'), getDate(1978, 8, 25, 0, 0, 0, 0), 'Date#create | Date/Time | with zero am');
  dateEquals(Date.create('08-25-1978 00:00:00am'), getDate(1978, 8, 25, 0, 0, 0, 0), 'Date#create | Date/Time | with seconds and zero am');
  dateEquals(Date.create('08-25-1978 00:00:00.000am'), getDate(1978, 8, 25, 0, 0, 0, 0), 'Date#create | Date/Time | with milliseconds and zero am');

  dateEquals(Date.create('08-25-1978 1pm'), getDate(1978, 8, 25, 13), 'Date#create | Date/Time | 1pm meridian');
  dateEquals(Date.create('08-25-1978 1:42pm'), getDate(1978, 8, 25, 13, 42), 'Date#create | Date/Time | 1pm minutes and meridian');
  dateEquals(Date.create('08-25-1978 1:42:32pm'), getDate(1978, 8, 25, 13, 42, 32), 'Date#create | Date/Time | 1pm seconds and meridian');
  dateEquals(Date.create('08-25-1978 1:42:32.488pm'), getDate(1978, 8, 25, 13, 42, 32, 488), 'Date#create | Date/Time | 1pm seconds and meridian');

  dateEquals(Date.create('08-25-1978 1am'), getDate(1978, 8, 25, 1), 'Date#create | Date/Time | 1am meridian');
  dateEquals(Date.create('08-25-1978 1:42am'), getDate(1978, 8, 25, 1, 42), 'Date#create | Date/Time | 1am minutes and meridian');
  dateEquals(Date.create('08-25-1978 1:42:32am'), getDate(1978, 8, 25, 1, 42, 32), 'Date#create | Date/Time | 1am seconds and meridian');
  dateEquals(Date.create('08-25-1978 1:42:32.488am'), getDate(1978, 8, 25, 1, 42, 32, 488), 'Date#create | Date/Time | 1am seconds and meridian');

  dateEquals(Date.create('08-25-1978 11pm'), getDate(1978, 8, 25, 23), 'Date#create | Date/Time | 11pm meridian');
  dateEquals(Date.create('08-25-1978 11:42pm'), getDate(1978, 8, 25, 23, 42), 'Date#create | Date/Time | 11pm minutes and meridian');
  dateEquals(Date.create('08-25-1978 11:42:32pm'), getDate(1978, 8, 25, 23, 42, 32), 'Date#create | Date/Time | 11pm seconds and meridian');
  dateEquals(Date.create('08-25-1978 11:42:32.488pm'), getDate(1978, 8, 25, 23, 42, 32, 488), 'Date#create | Date/Time | 11pm seconds and meridian');

  dateEquals(Date.create('08-25-1978 11am'), getDate(1978, 8, 25, 11), 'Date#create | Date/Time | 11am meridian');
  dateEquals(Date.create('08-25-1978 11:42am'), getDate(1978, 8, 25, 11, 42), 'Date#create | Date/Time | 11am minutes and meridian');
  dateEquals(Date.create('08-25-1978 11:42:32am'), getDate(1978, 8, 25, 11, 42, 32), 'Date#create | Date/Time | 11am seconds and meridian');
  dateEquals(Date.create('08-25-1978 11:42:32.488am'), getDate(1978, 8, 25, 11, 42, 32, 488), 'Date#create | Date/Time | 11am seconds and meridian');


  dateEquals(Date.create('2010-11-22T22:59Z'), getUTCDate(2010,11,22,22,59), 'Date#create | ISO8601 | full with UTC timezone');
  dateEquals(Date.create('1997-07-16T19:20+01:00'), getUTCDate(1997, 7, 16, 18, 20), 'Date#create | ISO8601 | minutes with timezone');
  dateEquals(Date.create('1997-07-16T19:20:30+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30), 'Date#create | ISO8601 | seconds with timezone');
  dateEquals(Date.create('1997-07-16T19:20:30.45+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 450), 'Date#create | ISO8601 | milliseconds with timezone');
  dateEquals(Date.create('1994-11-05T08:15:30-05:00'), getUTCDate(1994, 11, 5, 13, 15, 30), 'Date#create | ISO8601 | Full example 1');
  dateEquals(Date.create('1994-11-05T13:15:30Z'), getUTCDate(1994, 11, 5, 13, 15, 30), 'Date#create | ISO8601 | Full example 1');

  dateEquals(Date.create('1776-05-23T02:45:08-08:30'), getUTCDate(1776, 5, 23, 11, 15, 08), 'Date#create | ISO8601 | Full example 3');
  dateEquals(Date.create('1776-05-23T02:45:08+08:30'), getUTCDate(1776, 5, 22, 18, 15, 08), 'Date#create | ISO8601 | Full example 4');
  dateEquals(Date.create('1776-05-23T02:45:08-0830'), getUTCDate(1776, 5, 23, 11, 15, 08), 'Date#create | ISO8601 | Full example 5');
  dateEquals(Date.create('1776-05-23T02:45:08+0830'), getUTCDate(1776, 5, 22, 18, 15, 08), 'Date#create | ISO8601 | Full example 6');

  // No limit on the number of millisecond decimals, so....
  dateEquals(Date.create('1997-07-16T19:20:30.4+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 400), 'Date#create | ISO8601 | milliseconds have no limit 1');
  dateEquals(Date.create('1997-07-16T19:20:30.46+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 460), 'Date#create | ISO8601 | milliseconds have no limit 2');
  dateEquals(Date.create('1997-07-16T19:20:30.462+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 462), 'Date#create | ISO8601 | milliseconds have no limit 3');
  dateEquals(Date.create('1997-07-16T19:20:30.4628+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 463), 'Date#create | ISO8601 | milliseconds have no limit 4');
  dateEquals(Date.create('1997-07-16T19:20:30.46284+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 463), 'Date#create | ISO8601 | milliseconds have no limit 5');


  // These are all the same moment...
  dateEquals(Date.create('2001-04-03T18:30Z'), getUTCDate(2001,4,3,18,30), 'Date#create | ISO8601 | Synonymous dates with timezone 1');
  dateEquals(Date.create('2001-04-03T22:30+04'), getUTCDate(2001,4,3,18,30), 'Date#create | ISO8601 | Synonymous dates with timezone 2');
  dateEquals(Date.create('2001-04-03T1130-0700'), getUTCDate(2001,4,3,18,30), 'Date#create | ISO8601 | Synonymous dates with timezone 3');
  dateEquals(Date.create('2001-04-03T15:00-03:30'), getUTCDate(2001,4,3,18,30), 'Date#create | ISO8601 | Synonymous dates with timezone 4');



  var now = new Date();

  // Fuzzy dates
  dateEquals(Date.create('today'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate()), 'Date#create | Fuzzy Dates | Today');
  dateEquals(Date.create('yesterday'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() - 1), 'Date#create | Fuzzy Dates | Yesterday');
  dateEquals(Date.create('tomorrow'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() + 1), 'Date#create | Fuzzy Dates | Tomorrow');


  dateEquals(Date.create('The day after tomorrow'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() + 2), 'Date#create | Fuzzy Dates | The day after tomorrow');
  dateEquals(Date.create('The day before yesterday'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() - 2), 'Date#create | Fuzzy Dates | The day before yesterday');
  dateEquals(Date.create('One day after tomorrow'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() + 2), 'Date#create | Fuzzy Dates | One day after tomorrow');
  dateEquals(Date.create('One day before yesterday'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() - 2), 'Date#create | Fuzzy Dates | One day before yesterday');
  dateEquals(Date.create('Two days after tomorrow'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() + 3), 'Date#create | Fuzzy Dates | Two days after tomorrow');
  dateEquals(Date.create('Two days before yesterday'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() - 3), 'Date#create | Fuzzy Dates | Two days before yesterday');
  dateEquals(Date.create('Two days after today'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() + 2), 'Date#create | Fuzzy Dates | Two days after today');
  dateEquals(Date.create('Two days before today'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() - 2), 'Date#create | Fuzzy Dates | Two days before today');

  dateEquals(Date.create('tWo dAyS after toMoRRoW'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() + 3), 'Date#create | Fuzzy Dates | tWo dAyS after toMoRRoW');
  dateEquals(Date.create('2 days after tomorrow'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() + 3), 'Date#create | Fuzzy Dates | 2 days after tomorrow');
  dateEquals(Date.create('2 day after tomorrow'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() + 3), 'Date#create | Fuzzy Dates | 2 day after tomorrow');
  dateEquals(Date.create('18 days after tomorrow'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() + 19), 'Date#create | Fuzzy Dates | 18 days after tomorrow');
  dateEquals(Date.create('18 day after tomorrow'), getDate(now.getFullYear(), now.getMonth() + 1, now.getDate() + 19), 'Date#create | Fuzzy Dates | 18 day after tomorrow');

  dateEquals(Date.create('2 years ago'), getRelativeDate(-2), 'Date#create | Fuzzy Dates | 2 years ago');
  dateEquals(Date.create('2 months ago'), getRelativeDate(null, -2), 'Date#create | Fuzzy Dates | 2 months ago');
  dateEquals(Date.create('2 weeks ago'), getRelativeDate(null, null, -14), 'Date#create | Fuzzy Dates | 2 weeks ago');
  dateEquals(Date.create('2 days ago'), getRelativeDate(null, null, -2), 'Date#create | Fuzzy Dates | 2 days ago');
  dateEquals(Date.create('2 hours ago'), getRelativeDate(null, null, null, -2), 'Date#create | Fuzzy Dates | 2 hours ago');
  dateEquals(Date.create('2 minutes ago'), getRelativeDate(null, null, null, null, -2), 'Date#create | Fuzzy Dates | 2 minutes ago');
  dateEquals(Date.create('2 seconds ago'), getRelativeDate(null, null, null, null, null, -2), 'Date#create | Fuzzy Dates | 2 seconds ago');
  dateEquals(Date.create('2 milliseconds ago'), getRelativeDate(null, null, null, null, null, null, -2), 'Date#create | Fuzzy Dates | 2 milliseconds ago');

  dateEquals(Date.create('2 years from now'), getRelativeDate(2), 'Date#create | Fuzzy Dates | 2 years from now');
  dateEquals(Date.create('2 months from now'), getRelativeDate(null, 2), 'Date#create | Fuzzy Dates | 2 months from now');
  dateEquals(Date.create('2 weeks from now'), getRelativeDate(null, null, 14), 'Date#create | Fuzzy Dates | 2 weeks from now');
  dateEquals(Date.create('2 days from now'), getRelativeDate(null, null, 2), 'Date#create | Fuzzy Dates | 2 days from now');
  dateEquals(Date.create('2 hours from now'), getRelativeDate(null, null, null, 2), 'Date#create | Fuzzy Dates | 2 hours from now');
  dateEquals(Date.create('2 minutes from now'), getRelativeDate(null, null, null, null, 2), 'Date#create | Fuzzy Dates | 2 minutes from now');
  dateEquals(Date.create('2 seconds from now'), getRelativeDate(null, null, null, null, null, 2), 'Date#create | Fuzzy Dates | 2 seconds from now');
  dateEquals(Date.create('2 milliseconds from now'), getRelativeDate(null, null, null, null, null, null, 2), 'Date#create | Fuzzy Dates | 2 milliseconds from now');

  dateEquals(Date.create('Monday'), getDateWithWeekdayAndOffset(1), 'Date#create | Fuzzy Dates | Monday');
  dateEquals(Date.create('The day after Monday'), getDateWithWeekdayAndOffset(2), 'Date#create | Fuzzy Dates | The day after Monday');
  dateEquals(Date.create('The day before Monday'), getDateWithWeekdayAndOffset(0), 'Date#create | Fuzzy Dates | The day before Monday');
  dateEquals(Date.create('2 days after monday'), getDateWithWeekdayAndOffset(3), 'Date#create | Fuzzy Dates | 2 days after monday');
  dateEquals(Date.create('2 days before monday'), getDateWithWeekdayAndOffset(6, -7), 'Date#create | Fuzzy Dates | 2 days before monday');

  dateEquals(Date.create('Next Monday'), getDateWithWeekdayAndOffset(1, 7), 'Date#create | Fuzzy Dates | Next Monday');
  dateEquals(Date.create('next week monday'), getDateWithWeekdayAndOffset(1, 7), 'Date#create | Fuzzy Dates | next week monday');
  dateEquals(Date.create('Next friDay'), getDateWithWeekdayAndOffset(5, 7), 'Date#create | Fuzzy Dates | Next friDay');
  dateEquals(Date.create('next week thursday'), getDateWithWeekdayAndOffset(4, 7), 'Date#create | Fuzzy Dates | next week thursday');

  dateEquals(Date.create('last Monday'), getDateWithWeekdayAndOffset(1, -7), 'Date#create | Fuzzy Dates | last Monday');
  dateEquals(Date.create('last week monday'), getDateWithWeekdayAndOffset(1, -7), 'Date#create | Fuzzy Dates | last week monday');
  dateEquals(Date.create('last friDay'), getDateWithWeekdayAndOffset(5, -7), 'Date#create | Fuzzy Dates | last friDay');
  dateEquals(Date.create('last week thursday'), getDateWithWeekdayAndOffset(4, -7), 'Date#create | Fuzzy Dates | last week thursday');

  dateEquals(Date.create('this Monday'), getDateWithWeekdayAndOffset(1, 0), 'Date#create | Fuzzy Dates | this Monday');
  dateEquals(Date.create('this week monday'), getDateWithWeekdayAndOffset(1, 0), 'Date#create | Fuzzy Dates | this week monday');
  dateEquals(Date.create('this friDay'), getDateWithWeekdayAndOffset(5, 0), 'Date#create | Fuzzy Dates | this friDay');
  dateEquals(Date.create('this week thursday'), getDateWithWeekdayAndOffset(4, 0), 'Date#create | Fuzzy Dates | this week thursday');

  dateEquals(Date.create('Monday of last week'), getDateWithWeekdayAndOffset(1, -7), 'Date#create | Fuzzy Dates | Monday of last week');
  dateEquals(Date.create('saturday of next week'), getDateWithWeekdayAndOffset(6, 7), 'Date#create | Fuzzy Dates | saturday of next week');
  dateEquals(Date.create('Monday last week'), getDateWithWeekdayAndOffset(1, -7), 'Date#create | Fuzzy Dates | Monday last week');
  dateEquals(Date.create('saturday next week'), getDateWithWeekdayAndOffset(6, 7), 'Date#create | Fuzzy Dates | saturday next week');

  dateEquals(Date.create('Monday of this week'), getDateWithWeekdayAndOffset(1, 0), 'Date#create | Fuzzy Dates | Monday of this week');
  dateEquals(Date.create('saturday of this week'), getDateWithWeekdayAndOffset(6, 0), 'Date#create | Fuzzy Dates | saturday of this week');
  dateEquals(Date.create('Monday this week'), getDateWithWeekdayAndOffset(1, 0), 'Date#create | Fuzzy Dates | Monday this week');
  dateEquals(Date.create('saturday this week'), getDateWithWeekdayAndOffset(6, 0), 'Date#create | Fuzzy Dates | saturday this week');

  dateEquals(Date.create('Tue of last week'), getDateWithWeekdayAndOffset(2, -7), 'Date#create | Fuzzy Dates | Tue of last week');
  dateEquals(Date.create('Tue. of last week'), getDateWithWeekdayAndOffset(2, -7), 'Date#create | Fuzzy Dates | Tue. of last week');


  dateEquals(Date.create('Next week'), getRelativeDate(null, null, 7), 'Date#create | Fuzzy Dates | Next week');
  dateEquals(Date.create('Last week'), getRelativeDate(null, null, -7), 'Date#create | Fuzzy Dates | Last week');
  dateEquals(Date.create('Next month'), getRelativeDate(null, 1), 'Date#create | Fuzzy Dates | Next month');
  dateEquals(Date.create('Next year'), getRelativeDate(1), 'Date#create | Fuzzy Dates | Next year');

  dateEquals(Date.create('beginning of next week'), getDateWithWeekdayAndOffset(0, 7), 'Date#create | Fuzzy Dates | beginning of next week');
  dateEquals(Date.create('the beginning of next week'), getDateWithWeekdayAndOffset(0, 7), 'Date#create | Fuzzy Dates | the beginning of next week');
  dateEquals(Date.create('beginning of next month'), getDate(now.getFullYear(), now.getMonth() + 1), 'Date#create | Fuzzy Dates | beginning of next month');
  dateEquals(Date.create('the beginning of next month'), getDate(now.getFullYear(), now.getMonth() + 1), 'Date#create | Fuzzy Dates | the beginning of next month');
  // uhoh dateEquals(Date.create('the end of next month'), getDate(now.getFullYear(), now.getMonth() + 1), 'Date#create | Fuzzy Dates | the beginning of next month');
  dateEquals(Date.create('the beginning of next year'), getDate(now.getFullYear() + 1), 'Date#create | Fuzzy Dates | the beginning of next year');
  dateEquals(Date.create('the beginning of last year'), getDate(now.getFullYear() - 1), 'Date#create | Fuzzy Dates | the beginning of last year');
  dateEquals(Date.create('the end of next year'), getDate(now.getFullYear(), 11, 31), 'Date#create | Fuzzy Dates | the end of next year');
  dateEquals(Date.create('the end of last year'), getDate(now.getFullYear() - 1, 11, 31), 'Date#create | Fuzzy Dates | the end of last year');





// weef  dateEquals(Date.create('sdf asdf asf'), /* what should this be?? */, 'Date#create | Fuzzy Dates | Invalid format');

  /*
  dateEquals(Date.create('The 31st of last month.'), new Date(), 'Date#create | Fuzzy Dates | ');
  dateEquals(Date.create('January 30th of last year.'), new Date(), 'Date#create | Fuzzy Dates | ');
  dateEquals(Date.create('First day of may'), new Date(), 'Date#create | Fuzzy Dates | ');
  dateEquals(Date.create('Last day of may'), new Date(), 'Date#create | Fuzzy Dates | ');
  dateEquals(Date.create('Midnight tonight'), new Date(), 'Date#create | Fuzzy Dates | ');
  dateEquals(Date.create('Noon tomorrow'), new Date(), 'Date#create | Fuzzy Dates | ');
  dateEquals(Date.create('Last day of next month'), new Date(), 'Date#create | Fuzzy Dates | ');
  */
















});


test('RegExp', function () {

    equals(RegExp.escape('test regexp'), 'test regexp', 'RegExp#escape');
    equals(RegExp.escape('test reg|exp'), 'test reg\\|exp', 'RegExp#escape');
    equals(RegExp.escape('hey there (budday)'), 'hey there \\(budday\\)', 'RegExp#escape');
    equals(RegExp.escape('what a day...'), 'what a day\\.\\.\\.', 'RegExp#escape');
    equals(RegExp.escape('.'), '\\.', 'RegExp#escape');
    equals(RegExp.escape('*.+[]{}()?|/'), '\\*\\.\\+\\[\\]\\{\\}\\(\\)\\?\\|\\/', 'RegExp#escape');

});

test('Window', function () {

  if(window && window.parent){

    // We're in an iframe here, so...
    var win = window.parent;
    var query = win.location.search.replace(/^\?/, '');

    equal(typeof win.location.params === 'object', true, 'Window params object has been set up');


    if(query && query.match(/=/)){
      var split = query.split('&');
      split.each(function(e){
        var s = e.split('=');
        var key   = s[0];
        var value = s[1];
        if(parseInt(value)){
          value = parseInt(value);
        } else if(value === 'true'){
          value = true;
        } else if(value === 'false'){
          value = false;
        }
        equal(win.location.params[key], value, 'Window params are being properly set');
      });
    }
  }

});

