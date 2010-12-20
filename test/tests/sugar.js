module("Sugar");

var format = '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}'

var dateEquals = function(a, b, message){
  var buffer = 50; // Number of milliseconds of "play" to make sure these tests pass.
  if(typeof b == 'number'){
    var d = new Date();
    d.setTime(d.getTime() + b);
    b = d;
  }
  var offset = Math.abs(a.getTime() - b.getTime());
  equals(offset < buffer, true, message + ' | expected: ' + b.format(format) + ' got: ' + a.format(format));
}

var getRelativeDate = function(year, month, day, hours, minutes, seconds, milliseconds){
  var d = this.getFullYear  ? this : new Date();
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

var getDateWithWeekdayAndOffset = function(weekday, offset, hours, minutes, seconds, milliseconds){
  var d = new Date();
  if(offset) d.setDate(d.getDate() + offset);
  d.setDate(d.getDate() + (weekday - d.getDay()));
  d.setHours(hours || 0);
  d.setMinutes(minutes || 0);
  d.setSeconds(seconds || 0);
  d.setMilliseconds(milliseconds || 0);
  return d;
}

var getDaysInMonth = function(year, month){
  return 32 - new Date(year, month, 32).getDate();
}

var getWeekday = function(d, utc){
  var day = utc ? d.getUTCDay() : d.getDay();
  return ['sunday','monday','tuesday','wednesday','thursday','friday','saturday','sunday'][day];
}

var getMonth = function(d, utc){
  var month = utc ? d.getUTCMonth() : d.getMonth();
  return ['january','february','march','april','may','june','july','august','september','october','november','december'][month];
}

var getHours = function(num){
  return Math.floor(num < 0 ? 24 + num : num);
}


var contains = function(actual, expected, message){
  equals(expected.any(actual), true, message);
}

var strictlyEqual = function(actual, expected, message){
  equals(actual === expected, true, message + ' | strict equality');
}

// A DST Safe version of equals for dates
var equalsDST = function(actual, expected, multiplier, message){
  if(multiplier === undefined) multiplier = 1;
  var dst = Date.DSTOffset;
  dst /= multiplier;
  if(expected < 0) expected += dst;
  else expected -= dst;
  equals(actual, expected.round(4), message + ' | DST offset applied');
}

var dst = function(d){
  return new Date(d.getTime() - Date.DSTOffset);
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



  equals((1).pad(0), '1', 'Number#pad')
  equals((1).pad(1), '1', 'Number#pad')
  equals((1).pad(2), '01', 'Number#pad')
  equals((1).pad(3), '001', 'Number#pad')
  equals((1).pad(4), '0001', 'Number#pad')
  equals((547).pad(0), '547', 'Number#pad')
  equals((547).pad(1), '547', 'Number#pad')
  equals((547).pad(2), '547', 'Number#pad')
  equals((547).pad(3), '547', 'Number#pad')
  equals((547).pad(4), '0547', 'Number#pad')
  equals((0).pad(0), '', 'Number#pad')
  equals((0).pad(1), '0', 'Number#pad')
  equals((0).pad(2), '00', 'Number#pad')
  equals((0).pad(3), '000', 'Number#pad')
  equals((0).pad(4), '0000', 'Number#pad')
  equals((-1).pad(1), '-1', 'Number#pad')
  equals((-1).pad(2), '-01', 'Number#pad')
  equals((-1).pad(3), '-001', 'Number#pad')
  equals((-1).pad(4), '-0001', 'Number#pad')
  equals((1).pad(1, true), '+1', 'Number#pad')
  equals((1).pad(2, true), '+01', 'Number#pad')
  equals((1).pad(3, true), '+001', 'Number#pad')
  equals((1).pad(4, true), '+0001', 'Number#pad')
  equals((0).pad(1, true), '+0', 'Number#pad')



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

  equals((1).months(), 2629800000, 'Number#months | 1 month');
  equals((0.5).months(), 1314900000, 'Number#months | 0.5 month');
  equals((10).months(), 26298000000, 'Number#months | 10 month');
  equals((0).months(), 0, 'Number#months | 0 months');
  equals((1).months(), (30.4375).days(), 'Number#months | equal to 30.4375 days');
  equals((1).months(), (24 * 30.4375).hours(), 'Number#months | * 24hours');
  equals((1).months(), (60 * 24 * 30.4375).minutes(), 'Number#months | * 60 minutes');
  equals((1).months(), (60 * 60 * 24 * 30.4375).seconds(), 'Number#months | * 60 seconds');

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
  equals((1).month(), 2629800000, 'Number#month');
  equals((1).year(), 31557600000, 'Number#year');


  dateEquals((1).secondAfter(), 1000, 'Number#secondAfter');
  dateEquals((5).secondsAfter(), 5000, 'Number#secondsAfter');
  dateEquals((10).minutesAfter(), 600000, 'Number#minutesAfter');

  dateEquals((1).secondFromNow(), 1000, 'Number#secondFromNow');
  dateEquals((5).secondsFromNow(), 5000, 'Number#secondsFromNow');
  dateEquals((10).minutesFromNow(), 600000, 'Number#minutesFromNow');

  dateEquals((1).secondAgo(), -1000, 'Number#secondAgo');
  dateEquals((5).secondsAgo(), -5000, 'Number#secondAgo');
  dateEquals((10).secondsAgo(), -10000, 'Number#secondAgo');

  dateEquals((1).secondBefore(), -1000, 'Number#secondBefore');
  dateEquals((5).secondsBefore(), -5000, 'Number#secondBefore');
  dateEquals((10).secondsBefore(), -10000, 'Number#secondBefore');


  dateEquals((5).minutesAfter((5).minutesAgo()), 0, 'Number#minutesAfter');
  dateEquals((10).minutesAfter((5).minutesAgo()), 1000 * 60 * 5, 'Number#minutesAfter');

  dateEquals((5).minutesFromNow((5).minutesAgo()), 0, 'Number#minutesFromNow');
  dateEquals((10).minutesFromNow((5).minutesAgo()), 1000 * 60 * 5, 'Number#minutesFromNow');

  dateEquals((5).minutesAgo((5).minutesFromNow()), 0, 'Number#minutesAgo');
  ((10).minutesAgo((5).minutesFromNow()), -(1000 * 60 * 5), 'Number#minutesAgo');

  dateEquals((5).minutesBefore((5).minutesFromNow()), 0, 'Number#minutesBefore');
  dateEquals((10).minutesBefore((5).minutesFromNow()), -(1000 * 60 * 5), 'Number#minutesBefore');


  var christmas = new Date('December 25, 1965');
  dateEquals((5).minutesBefore(christmas), getRelativeDate.call(christmas, null, null, null, null, -5), 'Number#minutesBefore');
  dateEquals((5).minutesAfter(christmas), getRelativeDate.call(christmas, null, null, null, null, 5), 'Number#minutesAfter');

  dateEquals((5).hoursBefore(christmas), getRelativeDate.call(christmas, null, null, null, -5), 'Number#hoursBefore');
  dateEquals((5).hoursAfter(christmas), getRelativeDate.call(christmas, null, null, null, 5), 'Number#hoursAfter');

  dateEquals((5).daysBefore(christmas), getRelativeDate.call(christmas, null, null, -5), 'Number#daysBefore');
  dateEquals((5).daysAfter(christmas), getRelativeDate.call(christmas, null, null, 5), 'Number#daysAfter');

  dateEquals((5).weeksBefore(christmas), getRelativeDate.call(christmas, null, null, -35), 'Number#weeksBefore');
  dateEquals((5).weeksAfter(christmas), getRelativeDate.call(christmas, null, null, 35), 'Number#weeksAfter');

  dateEquals((5).monthsBefore(christmas), getRelativeDate.call(christmas, null, -5), 'Number#monthsBefore');
  dateEquals((5).monthsAfter(christmas), getRelativeDate.call(christmas, null, 5), 'Number#monthsAfter');

  dateEquals((5).yearsBefore(christmas), getRelativeDate.call(christmas, -5), 'Number#yearsBefore');
  dateEquals((5).yearsAfter(christmas), getRelativeDate.call(christmas, 5), 'Number#yearsAfter');



  // Hooking it all up!!

  // Try this in WinXP:
  // 1. Set timezone to Damascus
  // 2. var d = new Date(1998, 3, 3, 17); d.setHours(0); d.getHours();
  // 3. hours = 23
  // 4. PROFIT $$$

  dateEquals((5).minutesBefore('April 2rd, 1998'), new Date(1998, 3, 1, 23, 55), 'Number#minutesBefore | 5 minutes before April 3rd, 1998');
  dateEquals((5).minutesAfter('January 2nd, 2005'), new Date(2005, 0, 2, 0, 5), 'Number#minutesAfter | 5 minutes after January 2nd, 2005');
  dateEquals((5).hoursBefore('the first day of 2005'), new Date(2004, 11, 31, 19), 'Number#minutesBefore | 5 hours before the first day of 2005');
  dateEquals((5).hoursAfter('the last day of 2006'), new Date(2006, 11, 31, 5), 'Number#minutesAfter | 5 hours after the last day of 2006');
  dateEquals((5).hoursAfter('the end of 2006'), new Date(2007, 0, 1, 4, 59, 59, 999), 'Number#minutesAfter | 5 hours after the end of 2006');
  dateEquals((5).daysBefore('last week monday'), getDateWithWeekdayAndOffset(1, -7).rewind({ days: 5 }), 'Number#minutesAfter | 5 days before last week monday');
  dateEquals((5).daysAfter('next tuesday'), getDateWithWeekdayAndOffset(2, 7).advance({ days: 5 }), 'Number#minutesAfter | 5 days after next week tuesday');
  dateEquals((5).weeksBefore('today'), getRelativeDate(null, null, -35).set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), 'Number#minutesAfter | 5 weeks before today');
  dateEquals((5).weeksAfter('now'), getRelativeDate(null, null, 35), 'Number#minutesAfter | 5 weeks after now');
  dateEquals((5).monthsBefore('today'), getRelativeDate(null, -5).set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), 'Number#minutesAfter | 5 months before today');
  dateEquals((5).monthsAfter('now'), getRelativeDate(null, 5), 'Number#minutesAfter | 5 months after now');





//  dateEquals(Date.create('Monday'), getDateWithWeekdayAndOffset(1), 'Date#create | Fuzzy Dates | Monday');
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
  equal('wasabi'.pad() === 'wasabi', true, 'String#pad | strict equality works');

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


  same(''.bytes(), [], 'String#bytes | empty string');
  same(''.chars(), [], 'String#chars | empty string');
  same(''.words(), [], 'String#words | empty string');
  same(''.lines(), [''], 'String#lines | empty string');
  same(''.paragraphs(), [''], 'String#paragraphs | empty string');
  same(''.each('f'), [], 'String#each | empty string');
  same(''.each(/foo/), [], 'String#each | empty string');
  same(''.each(function(){}), [], 'String#each | empty string');




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
  equal('foop'.at(4), '', 'String#at');
  equal('foop'.at(1224), '', 'String#at');
  equal('foop'.at(-1), 'p', 'String#at');
  equal('foop'.at(-2), 'o', 'String#at');
  equal('foop'.at(-3), 'o', 'String#at');
  equal('foop'.at(-4), 'f', 'String#at');
  equal('foop'.at(-5), '', 'String#at');
  equal('foop'.at(-1224), '', 'String#at');

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
  same(''.toDate().toString(), new Date().toString(), 'String#toDate');
  same('barf'.toDate().toString(), new Date('barf').toString(), 'String#toDate');
  same('the day after tomorrow'.toDate().toString(), Date.create('the day after tomorrow').toString(), 'String#toDate');


  same('hop_on_pop'.dasherize(), 'hop-on-pop', 'String#dasherize');
  same('HOP_ON_POP'.dasherize(), 'hop-on-pop', 'String#dasherize');
  same('hopOnPop'.dasherize(), 'hop-on-pop', 'String#dasherize');
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






  strictlyEqual(''.escapeRegExp(), '', 'String#escapeRegExp');
  strictlyEqual('|'.escapeRegExp(), '\\|', 'String#escapeRegExp');
  strictlyEqual(''.capitalize(), '', 'String#capitalize');
  strictlyEqual('wasabi'.capitalize(), 'Wasabi', 'String#capitalize');
  strictlyEqual(''.trim(), '', 'String#trim');
  strictlyEqual(' wasabi '.trim(), 'wasabi', 'String#trim');
  strictlyEqual(''.trimLeft(), '', 'String#trimLeft');
  strictlyEqual(' wasabi '.trimLeft(), 'wasabi ', 'String#trimLeft');
  strictlyEqual(''.trimRight(), '', 'String#trimRight');
  strictlyEqual(' wasabi '.trimRight(), ' wasabi', 'String#trimRight');
  strictlyEqual(''.pad(0), '', 'String#pad');
  strictlyEqual('wasabi'.pad(1), ' wasabi ', 'String#pad');
  strictlyEqual('wasabi'.repeat(0), '', 'String#repeat');
  strictlyEqual('wasabi'.repeat(1), 'wasabi', 'String#repeat');
  strictlyEqual('wasabi'.repeat(2), 'wasabiwasabi', 'String#repeat');
  strictlyEqual(''.normalize(), '', 'String#normalize');
  strictlyEqual('wasabi'.normalize(), 'wasabi', 'String#normalize');
  strictlyEqual(''.accent('-'), '', 'String#accent');
  strictlyEqual('a'.accent('-'), 'ā', 'String#accent');
  strictlyEqual(''.insert('-', 0), '-', 'String#insert');
  strictlyEqual('b'.insert('-', 0), '-b', 'String#insert');
  strictlyEqual('b'.insert('-', 1), 'b-', 'String#insert');
  strictlyEqual(''.hanKaku(), '', 'String#hanKaku');
  strictlyEqual('カ'.hanKaku(), 'ｶ', 'String#hanKaku');
  strictlyEqual(''.zenKaku(), '', 'String#zenKaku');
  strictlyEqual('ｶ'.zenKaku(), 'カ', 'String#zenKaku');
  strictlyEqual(''.hiragana(), '', 'String#hiragana');
  strictlyEqual('カ'.hiragana(), 'か', 'String#hiragana');
  strictlyEqual(''.katakana(), '', 'String#katakana');
  strictlyEqual('か'.katakana(), 'カ', 'String#katakana');
  strictlyEqual(''.reverse(), '', 'String#reverse');
  strictlyEqual('wasabi'.reverse(), 'ibasaw', 'String#reverse');
  strictlyEqual(''.compact(), '', 'String#compact');
  strictlyEqual('run   tell    dat'.compact(), 'run tell dat', 'String#compact');
  strictlyEqual(''.at(3), '', 'String#at');
  strictlyEqual('wasabi'.at(0), 'w', 'String#at');
  strictlyEqual(''.first(), '', 'String#first');
  strictlyEqual('wasabi'.first(), 'w', 'String#first');
  strictlyEqual(''.last(), '', 'String#last');
  strictlyEqual('wasabi'.last(), 'i', 'String#last');
  strictlyEqual(''.from(0), '', 'String#from');
  strictlyEqual('wasabi'.from(3), 'abi', 'String#from');
  strictlyEqual(''.to(0), '', 'String#to');
  strictlyEqual('wasabi'.to(3), 'wasa', 'String#to');
  strictlyEqual(''.dasherize(), '', 'String#dasherize');
  strictlyEqual('noFingWay'.dasherize(), 'no-fing-way', 'String#dasherize');
  strictlyEqual(''.underscore(), '', 'String#underscore');
  strictlyEqual('noFingWay'.underscore(), 'no_fing_way', 'String#underscore');
  strictlyEqual(''.camelize(), '', 'String#camelize');
  strictlyEqual('no-fing-way'.camelize(), 'NoFingWay', 'String#camelize');
  strictlyEqual(''.titleize(), '', 'String#titleize');
  strictlyEqual('chilled monkey brains'.titleize(), 'Chilled Monkey Brains', 'String#titleize');
  strictlyEqual(''.stripTags(), '', 'String#stripTags');
  strictlyEqual('chilled <b>monkey</b> brains'.stripTags(), 'chilled monkey brains', 'String#stripTags');
  strictlyEqual(''.removeTags(), '', 'String#removeTags');
  strictlyEqual('chilled <b>monkey</b> brains'.removeTags(), 'chilled  brains', 'String#removeTags');


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
      equals(el, 'a', 'Array#every | First parameter is the element');
      equals(i, 0, 'Array#every | Second parameter is the index');
      same(a, ['a'], 'Array#every | Third parameter is the array');
      equals(this, 'this', 'Array#every | Scope is passed properly');
    }, 'this');

    equals([12, 54, 18, 130, 44].every(function(el, i, a){ return el >= 10; }), true, 'Array#every');


    same([{name:'john',age:25},{name:'fred',age:85}].all('age'), false, 'Array#every');
    same([{name:'john',age:25},{name:'fred',age:85}].all('name'), false, 'Array#every');
    same([{name:'john',age:25},{name:'fred',age:85}].all('cupsize'), false, 'Array#every');
    same([{name:'john',age:25}].all({name:'john',age:25}), true, 'Array#every');
    same([{name:'john',age:25},{name:'fred',age:85}].all({name:'john',age:25}), false, 'Array#every');



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

    same([{name:'john',age:25},{name:'fred',age:85}].some('age'), false, 'Array#some');
    same([{name:'john',age:25},{name:'fred',age:85}].some('name'), false, 'Array#some');
    same([{name:'john',age:25},{name:'fred',age:85}].some('cupsize'), false, 'Array#some');
    same([{name:'john',age:25}].some({name:'john',age:25}), true, 'Array#every');
    same([{name:'john',age:25},{name:'fred',age:85}].some({name:'john',age:25}), true, 'Array#every');




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
    same([NaN,NaN,NaN].compact(), [], 'Array#compact');
    same(['','',''], ['','',''], 'Array#compact');
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

    var match = 'on'.match(/on(e)?/);
    equals(match[1], undefined, 'String#match');

    var match = 'on'.match(/\b/g);
    equals(match[0], '', 'String#match');
    equals(match[1], '', 'String#match');

});



test('Date', function () {


  var day;
  var timezoneOffset = new Date().getTimezoneOffset();
  var now = new Date();
  var thisYear = now.getFullYear();

  // Valid Date

  // Invalid date
  equals(new Date('a fridge too far').isValid(), false, 'Date#isValid | new Date invalid');
  equals(new Date().isValid(), true, 'Date#isValid | new Date valid');
  equals(Date.create().isValid(), true, 'Date#isValid | created date is valid');
  equals(Date.create('a fridge too far').isValid(), false, 'Date#isValid | Date#create invalid');


  equals(new Date().isUTC(), timezoneOffset === 0 ? true : false, 'Date#isUTC | UTC is true if the current timezone has no offset');
  // UTC is not if there is a timezone offset, even if the time is reset to the intended utc equivalent, as timezones can never be changed
  equals(new Date(now.getTime()).addMinutes(timezoneOffset).isUTC(), timezoneOffset === 0 ? true : false, 'Date#isUTC | UTC cannot be forced');

  dateEquals(Date.create(), new Date(), 'Date#create | empty');


  // Date constructor accepts enumerated parameters

  dateEquals(Date.create(1998), new Date(1998), 'Date#create | enumerated | 1998');
  dateEquals(Date.create(1998,1), new Date(1998,1), 'Date#create | enumerated | January, 1998');
  dateEquals(Date.create(1998,1,23), new Date(1998,1,23), 'Date#create | enumerated | January 23, 1998');
  dateEquals(Date.create(1998,1,23,11), new Date(1998,1,23,11), 'Date#create | enumerated | January 23, 1998 11am');
  dateEquals(Date.create(1998,1,23,11,54), new Date(1998,1,23,11,54), 'Date#create | enumerated | January 23, 1998 11:54am');
  dateEquals(Date.create(1998,1,23,11,54,32), new Date(1998,1,23,11,54,32), 'Date#create | enumerated | January 23, 1998 11:54:32');
  dateEquals(Date.create(1998,1,23,11,54,32,454), new Date(1998,1,23,11,54,32,454), 'Date#create | enumerated | January 23, 1998 11:54:32.454');


  // Date constructor accepts an object

  dateEquals(Date.create({ year: 1998 }), new Date(1998, 0), 'Date#create | object | 1998');
  dateEquals(Date.create({ year: 1998, month: 1 }), new Date(1998,1), 'Date#create | object | January, 1998');
  dateEquals(Date.create({ year: 1998, month: 1, day: 23 }), new Date(1998,1,23), 'Date#create | object | January 23, 1998');
  dateEquals(Date.create({ year: 1998, month: 1, day: 23, hour: 11 }), new Date(1998,1,23,11), 'Date#create | object | January 23, 1998 11am');
  dateEquals(Date.create({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }), new Date(1998,1,23,11,54), 'Date#create | object | January 23, 1998 11:54am');
  dateEquals(Date.create({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }), new Date(1998,1,23,11,54,32), 'Date#create | object | January 23, 1998 11:54:32');
  dateEquals(Date.create({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }), new Date(1998,1,23,11,54,32,454), 'Date#create | object | January 23, 1998 11:54:32.454');


  // DST Offset is properly set
  equals(Date.DSTOffset, (new Date(2001, 6, 1).getTimezoneOffset() - new Date(2000, 0, 1).getTimezoneOffset()) * 60 * 1000, 'Date#DSTOffset | is the correct offset');

  dateEquals(new Date(new Date(2008, 6, 22)), new Date(2008, 6, 22), 'Date | date accepts itself as a constructor');

  dateEquals(Date.create(0), new Date(1970, 0, 1, 0, -timezoneOffset) , 'Date#create | Accepts numbers');
  dateEquals(Date.create('1999'), new Date(1999, 0), 'Date#create | Just the year');

  dateEquals(Date.create('June'), new Date(thisYear, 5), 'Date#create | Just the month');
  dateEquals(Date.create('June 15'), new Date(thisYear, 5, 15), 'Date#create | Month and day');
  dateEquals(Date.create('June 15th'), new Date(thisYear, 5, 15), 'Date#create | Month and ordinal day');

  // Slashes (American style)
  dateEquals(Date.create('08/25'), new Date(thisYear, 7, 25), 'Date#create | American style slashes | mm/dd');
  dateEquals(Date.create('8/25'), new Date(thisYear, 7, 25), 'Date#create | American style slashes | m/dd');
  dateEquals(Date.create('08/25/1978'), new Date(1978, 7, 25), 'Date#create | American style slashes | mm/dd/yyyy');
  dateEquals(Date.create('8/25/1978'), new Date(1978, 7, 25), 'Date#create | American style slashes | /m/dd/yyyy');
  dateEquals(Date.create('8/25/78'), new Date(1978, 7, 25), 'Date#create | American style slashes | m/dd/yy');
  dateEquals(Date.create('08/25/78'), new Date(1978, 7, 25), 'Date#create | American style slashes | mm/dd/yy');
  dateEquals(Date.create('8/25/01'), new Date(2001, 7, 25), 'Date#create | American style slashes | m/dd/01');
  dateEquals(Date.create('8/25/49'), new Date(2049, 7, 25), 'Date#create | American style slashes | m/dd/49');
  dateEquals(Date.create('8/25/50'), new Date(1950, 7, 25), 'Date#create | American style slashes | m/dd/50');

  // August 25, 0001... the numeral 1 gets interpreted as 1901...
  // freakin' unbelievable...
  dateEquals(Date.create('08/25/0001'), new Date(-62115206400000).utc(), 'Date#create | American style slashes | mm/dd/0001');

  // Dashes (American style)
  dateEquals(Date.create('08-25-1978'), new Date(1978, 7, 25), 'Date#create | American style dashes | mm-dd-yyyy');
  dateEquals(Date.create('8-25-1978'), new Date(1978, 7, 25), 'Date#create | American style dashes | m-dd-yyyy');


  // dd-dd-dd is NOT American style as it is a reserved ISO8601 date format
  dateEquals(Date.create('08-05-05'), new Date(2008, 4, 5), 'Date#create | dd-dd-dd is an ISO8601 format');

  // Dots (American style)
  dateEquals(Date.create('08.25.1978'), new Date(1978, 7, 25), 'Date#create | American style dots | mm.dd.yyyy');
  dateEquals(Date.create('8.25.1978'), new Date(1978, 7, 25), 'Date#create | American style dots | m.dd.yyyy');


  dateEquals(Date.create('08/10', true), new Date(thisYear, 9, 8), 'Date#create | European style slashes | dd/mm');
  // Slashes (European style)
  dateEquals(Date.create('8/10', true), new Date(thisYear, 9, 8), 'Date#create | European style slashes | d/mm');
  dateEquals(Date.create('08/10/1978', true), new Date(1978, 9, 8), 'Date#create | European style slashes | dd/mm/yyyy');
  dateEquals(Date.create('8/10/1978', true), new Date(1978, 9, 8), 'Date#create | European style slashes | d/mm/yyyy');
  dateEquals(Date.create('8/10/78', true), new Date(1978, 9, 8), 'Date#create | European style slashes | d/mm/yy');
  dateEquals(Date.create('08/10/78', true), new Date(1978, 9, 8), 'Date#create | European style slashes | dd/mm/yy');
  dateEquals(Date.create('8/10/01', true), new Date(2001, 9, 8), 'Date#create | European style slashes | d/mm/01');
  dateEquals(Date.create('8/10/49', true), new Date(2049, 9, 8), 'Date#create | European style slashes | d/mm/49');
  dateEquals(Date.create('8/10/50', true), new Date(1950, 9, 8), 'Date#create | European style slashes | d/mm/50');

  // Dashes (European style) 
  dateEquals(Date.create('08-10-1978', true), new Date(1978, 9, 8), 'Date#create | European style dashes | dd-dd-dd is an ISO8601 format');

  // Dots (European style)
  dateEquals(Date.create('08.10.1978', true), new Date(1978, 9, 8), 'Date#create | European style dots | dd.mm.yyyy');
  dateEquals(Date.create('8.10.1978', true), new Date(1978, 9, 8), 'Date#create | European style dots | d.mm.yyyy');
  dateEquals(Date.create('08-05-05'), new Date(2008, 4, 5), 'Date#create | dd-dd-dd is an ISO8601 format');




  // Reverse slashes
  dateEquals(Date.create('1978/08/25'), new Date(1978, 7, 25), 'Date#create | Reverse slashes | yyyy/mm/dd');
  dateEquals(Date.create('1978/8/25'), new Date(1978, 7, 25), 'Date#create | Reverse slashes | yyyy/m/dd');
  dateEquals(Date.create('1978/08'), new Date(1978, 7), 'Date#create | Reverse slashes | yyyy/mm');
  dateEquals(Date.create('1978/8'), new Date(1978, 7), 'Date#create | Reverse slashes | yyyy/m');

  // Reverse dashes
  dateEquals(Date.create('1978-08-25'), new Date(1978, 7, 25), 'Date#create | Reverse dashes | yyyy-mm-dd');
  dateEquals(Date.create('1978-08'), new Date(1978, 7), 'Date#create | Reverse dashes | yyyy-mm');
  dateEquals(Date.create('1978-8'), new Date(1978, 7), 'Date#create | Reverse dashes | yyyy-m');

  // Reverse dots
  dateEquals(Date.create('1978.08.25'), new Date(1978, 7, 25), 'Date#create | Reverse dots | yyyy.mm.dd');
  dateEquals(Date.create('1978.08'), new Date(1978, 7), 'Date#create | Reverse dots | yyyy.mm');
  dateEquals(Date.create('1978.8'), new Date(1978, 7), 'Date#create | Reverse dots | yyyy.m');

  // Abbreviated reverse slash format yy/mm/dd cannot exist because it clashes with forward
  // slash format dd/mm/yy (with european variant). This rule however, doesn't follow for dashes,
  // which is abbreviated ISO8601 format: yy-mm-dd
  dateEquals(Date.create('01/02/03'), new Date(2003, 0, 2), 'Date#create | Ambiguous 2 digit format mm/dd/yy');
  dateEquals(Date.create('01/02/03', true), new Date(2003, 1, 1), 'Date#create | Ambiguous 2 digit European variant dd/mm/yy');
  dateEquals(Date.create('01-02-03'), new Date(2001, 1, 3), 'Date#create | Ambiguous 2 digit ISO variant yy-mm-dd');
  dateEquals(Date.create('01-02-03', true), new Date(2001, 1, 3), 'Date#create | Ambiguous 2 digit ISO variant has NO European variant of its own');


  // Text based formats
  dateEquals(Date.create('June 2008'), new Date(2008, 5), 'Date#create | Full text | Month yyyy');
  dateEquals(Date.create('June-2008'), new Date(2008, 5), 'Date#create | Full text | Month-yyyy');
  dateEquals(Date.create('June.2008'), new Date(2008, 5), 'Date#create | Full text | Month.yyyy');
  dateEquals(Date.create('June 1st, 2008'), new Date(2008, 5, 1), 'Date#create | Full text | Month 1st, yyyy');
  dateEquals(Date.create('June 2nd, 2008'), new Date(2008, 5, 2), 'Date#create | Full text | Month 2nd, yyyy');
  dateEquals(Date.create('June 3rd, 2008'), new Date(2008, 5, 3), 'Date#create | Full text | Month 3rd, yyyy');
  dateEquals(Date.create('June 4th, 2008'), new Date(2008, 5, 4), 'Date#create | Full text | Month 4th, yyyy');
  dateEquals(Date.create('June 15th, 2008'), new Date(2008, 5, 15), 'Date#create | Full text | Month 15th, yyyy');
  dateEquals(Date.create('June 1st 2008'), new Date(2008, 5, 1), 'Date#create | Full text | Month 1st yyyy');
  dateEquals(Date.create('June 2nd 2008'), new Date(2008, 5, 2), 'Date#create | Full text | Month 2nd yyyy');
  dateEquals(Date.create('June 3rd 2008'), new Date(2008, 5, 3), 'Date#create | Full text | Month 3rd yyyy');
  dateEquals(Date.create('June 4th 2008'), new Date(2008, 5, 4), 'Date#create | Full text | Month 4th yyyy');
  dateEquals(Date.create('June 15, 2008'), new Date(2008, 5, 15), 'Date#create | Full text | Month dd, yyyy');
  dateEquals(Date.create('June 15 2008'), new Date(2008, 5, 15), 'Date#create | Full text | Month dd yyyy');
  dateEquals(Date.create('15 July, 2008'), new Date(2008, 6, 15), 'Date#create | Full text | dd Month, yyyy');
  dateEquals(Date.create('15 July 2008'), new Date(2008, 6, 15), 'Date#create | Full text | dd Month yyyy');
  dateEquals(Date.create('juNe 1St 2008'), new Date(2008, 5, 1), 'Date#create | Full text | Month 1st yyyy case insensitive');

  // Special cases
  dateEquals(Date.create(' July 4th, 1987 '), new Date(1987, 6, 4), 'Date#create | Special Cases | Untrimmed full text');
  dateEquals(Date.create('  7/4/1987 '), new Date(1987, 6, 4), 'Date#create | Special Cases | Untrimmed American');
  dateEquals(Date.create('   1987-07-04    '), new Date(1987, 6, 4), 'Date#create | Special Cases | Untrimmed ISO8601');

  // Abbreviated formats
  dateEquals(Date.create('Dec 1st, 2008'), new Date(2008, 11, 1), 'Date#create | Abbreviated | without dot');
  dateEquals(Date.create('Dec. 1st, 2008'), new Date(2008, 11, 1), 'Date#create | Abbreviated | with dot');
  dateEquals(Date.create('1 Dec. 2008'), new Date(2008, 11, 1), 'Date#create | Abbreviated | reversed with dot');
  dateEquals(Date.create('1 Dec., 2008'), new Date(2008, 11, 1), 'Date#create | Abbreviated | reversed with dot and comma');
  dateEquals(Date.create('1 Dec, 2008'), new Date(2008, 11, 1), 'Date#create | Abbreviated | reversed with comma and no dot');


  dateEquals(Date.create('May-09-78'), new Date(1978, 4, 9), 'Date#create | Abbreviated | Mon.-dd-yy');
  dateEquals(Date.create('Wednesday July 3rd, 2008'), new Date(2008, 6, 3), 'Date#create | Full Text | With day of week');
  dateEquals(Date.create('Wed July 3rd, 2008'), new Date(2008, 6, 3), 'Date#create | Full Text | With day of week');
  dateEquals(Date.create('Wed. July 3rd, 2008'), new Date(2008, 6, 3), 'Date#create | Full Text | With day of week');




  // ISO 8601
  dateEquals(Date.create('2001-1-1'), new Date(2001, 0, 1), 'Date#create | ISO8601 | not padded');
  dateEquals(Date.create('2001-01-1'), new Date(2001, 0, 1), 'Date#create | ISO8601 | month padded');
  dateEquals(Date.create('2001-01-01'), new Date(2001, 0, 1), 'Date#create | ISO8601 | month and day padded');
  dateEquals(Date.create('2010-11-22'), new Date(2010, 10,22), 'Date#create | ISO8601 | month and day padded 2010');
  dateEquals(Date.create('20101122'), new Date(2010, 10,22), 'Date#create | ISO8601 | digits strung together');
  dateEquals(Date.create('17760523T024508+0830'), getUTCDate(1776, 5, 22, 18, 15, 08), 'Date#create | ISO8601 | full datetime strung together');
  dateEquals(Date.create('-0002-07-26'), new Date(-2, 6, 26), 'Date#create | ISO8601 | minus sign (bc)'); // BC
  dateEquals(Date.create('+1978-04-17'), new Date(1978, 3, 17), 'Date#create | ISO8601 | plus sign (ad)'); // AD



  // Date with time formats
  dateEquals(Date.create('08/25/1978 12:04'), new Date(1978, 7, 25, 12, 4), 'Date#create | Date/Time | Slash format');
  dateEquals(Date.create('08-25-1978 12:04'), new Date(1978, 7, 25, 12, 4), 'Date#create | Date/Time | Dash format');
  dateEquals(Date.create('1978/08/25 12:04'), new Date(1978, 7, 25, 12, 4), 'Date#create | Date/Time | Reverse slash format');
  dateEquals(Date.create('June 1st, 2008 12:04'), new Date(2008, 5, 1, 12, 4), 'Date#create | Date/Time | Full text format');

  dateEquals(Date.create('08-25-1978 12:04:57'), new Date(1978, 7, 25, 12, 4, 57), 'Date#create | Date/Time | with seconds');
  dateEquals(Date.create('08-25-1978 12:04:57.322'), new Date(1978, 7, 25, 12, 4, 57, 322), 'Date#create | Date/Time | with milliseconds');

  dateEquals(Date.create('08-25-1978 12pm'), new Date(1978, 7, 25, 12), 'Date#create | Date/Time | with meridian');
  dateEquals(Date.create('08-25-1978 12:42pm'), new Date(1978, 7, 25, 12, 42), 'Date#create | Date/Time | with minutes and meridian');
  dateEquals(Date.create('08-25-1978 12:42:32pm'), new Date(1978, 7, 25, 12, 42, 32), 'Date#create | Date/Time | with seconds and meridian');
  dateEquals(Date.create('08-25-1978 12:42:32.488pm'), new Date(1978, 7, 25, 12, 42, 32, 488), 'Date#create | Date/Time | with seconds and meridian');

  dateEquals(Date.create('08-25-1978 00:00am'), new Date(1978, 7, 25, 0, 0, 0, 0), 'Date#create | Date/Time | with zero am');
  dateEquals(Date.create('08-25-1978 00:00:00am'), new Date(1978, 7, 25, 0, 0, 0, 0), 'Date#create | Date/Time | with seconds and zero am');
  dateEquals(Date.create('08-25-1978 00:00:00.000am'), new Date(1978, 7, 25, 0, 0, 0, 0), 'Date#create | Date/Time | with milliseconds and zero am');

  dateEquals(Date.create('08-25-1978 1pm'), new Date(1978, 7, 25, 13), 'Date#create | Date/Time | 1pm meridian');
  dateEquals(Date.create('08-25-1978 1:42pm'), new Date(1978, 7, 25, 13, 42), 'Date#create | Date/Time | 1pm minutes and meridian');
  dateEquals(Date.create('08-25-1978 1:42:32pm'), new Date(1978, 7, 25, 13, 42, 32), 'Date#create | Date/Time | 1pm seconds and meridian');
  dateEquals(Date.create('08-25-1978 1:42:32.488pm'), new Date(1978, 7, 25, 13, 42, 32, 488), 'Date#create | Date/Time | 1pm seconds and meridian');

  dateEquals(Date.create('08-25-1978 1am'), new Date(1978, 7, 25, 1), 'Date#create | Date/Time | 1am meridian');
  dateEquals(Date.create('08-25-1978 1:42am'), new Date(1978, 7, 25, 1, 42), 'Date#create | Date/Time | 1am minutes and meridian');
  dateEquals(Date.create('08-25-1978 1:42:32am'), new Date(1978, 7, 25, 1, 42, 32), 'Date#create | Date/Time | 1am seconds and meridian');
  dateEquals(Date.create('08-25-1978 1:42:32.488am'), new Date(1978, 7, 25, 1, 42, 32, 488), 'Date#create | Date/Time | 1am seconds and meridian');

  dateEquals(Date.create('08-25-1978 11pm'), new Date(1978, 7, 25, 23), 'Date#create | Date/Time | 11pm meridian');
  dateEquals(Date.create('08-25-1978 11:42pm'), new Date(1978, 7, 25, 23, 42), 'Date#create | Date/Time | 11pm minutes and meridian');
  dateEquals(Date.create('08-25-1978 11:42:32pm'), new Date(1978, 7, 25, 23, 42, 32), 'Date#create | Date/Time | 11pm seconds and meridian');
  dateEquals(Date.create('08-25-1978 11:42:32.488pm'), new Date(1978, 7, 25, 23, 42, 32, 488), 'Date#create | Date/Time | 11pm seconds and meridian');

  dateEquals(Date.create('08-25-1978 11am'), new Date(1978, 7, 25, 11), 'Date#create | Date/Time | 11am meridian');
  dateEquals(Date.create('08-25-1978 11:42am'), new Date(1978, 7, 25, 11, 42), 'Date#create | Date/Time | 11am minutes and meridian');
  dateEquals(Date.create('08-25-1978 11:42:32am'), new Date(1978, 7, 25, 11, 42, 32), 'Date#create | Date/Time | 11am seconds and meridian');
  dateEquals(Date.create('08-25-1978 11:42:32.488am'), new Date(1978, 7, 25, 11, 42, 32, 488), 'Date#create | Date/Time | 11am seconds and meridian');


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




  // Fuzzy dates
  dateEquals(Date.create('now'), new Date(), 'Date#create | Fuzzy Dates | Now');
  dateEquals(Date.create('today'), new Date(now.getFullYear(), now.getMonth(), now.getDate()), 'Date#create | Fuzzy Dates | Today');
  dateEquals(Date.create('yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), 'Date#create | Fuzzy Dates | Yesterday');
  dateEquals(Date.create('tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), 'Date#create | Fuzzy Dates | Tomorrow');


  dateEquals(Date.create('The day after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), 'Date#create | Fuzzy Dates | The day after tomorrow');
  dateEquals(Date.create('The day before yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), 'Date#create | Fuzzy Dates | The day before yesterday');
  dateEquals(Date.create('One day after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), 'Date#create | Fuzzy Dates | One day after tomorrow');
  dateEquals(Date.create('One day before yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), 'Date#create | Fuzzy Dates | One day before yesterday');
  dateEquals(Date.create('Two days after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), 'Date#create | Fuzzy Dates | Two days after tomorrow');
  dateEquals(Date.create('Two days before yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3), 'Date#create | Fuzzy Dates | Two days before yesterday');
  dateEquals(Date.create('Two days after today'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), 'Date#create | Fuzzy Dates | Two days after today');
  dateEquals(Date.create('Two days before today'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), 'Date#create | Fuzzy Dates | Two days before today');
  dateEquals(Date.create('Two days from today'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), 'Date#create | Fuzzy Dates | Two days from today');

  dateEquals(Date.create('tWo dAyS after toMoRRoW'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), 'Date#create | Fuzzy Dates | tWo dAyS after toMoRRoW');
  dateEquals(Date.create('2 days after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), 'Date#create | Fuzzy Dates | 2 days after tomorrow');
  dateEquals(Date.create('2 day after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), 'Date#create | Fuzzy Dates | 2 day after tomorrow');
  dateEquals(Date.create('18 days after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 19), 'Date#create | Fuzzy Dates | 18 days after tomorrow');
  dateEquals(Date.create('18 day after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 19), 'Date#create | Fuzzy Dates | 18 day after tomorrow');

  dateEquals(Date.create('2 years ago'), getRelativeDate(-2), 'Date#create | Fuzzy Dates | 2 years ago');
  dateEquals(Date.create('2 months ago'), getRelativeDate(null, -2), 'Date#create | Fuzzy Dates | 2 months ago');
  dateEquals(Date.create('2 weeks ago'), getRelativeDate(null, null, -14), 'Date#create | Fuzzy Dates | 2 weeks ago');
  dateEquals(Date.create('2 days ago'), getRelativeDate(null, null, -2), 'Date#create | Fuzzy Dates | 2 days ago');
  dateEquals(Date.create('2 hours ago'), getRelativeDate(null, null, null, -2), 'Date#create | Fuzzy Dates | 2 hours ago');
  dateEquals(Date.create('2 minutes ago'), getRelativeDate(null, null, null, null, -2), 'Date#create | Fuzzy Dates | 2 minutes ago');
  dateEquals(Date.create('2 seconds ago'), getRelativeDate(null, null, null, null, null, -2), 'Date#create | Fuzzy Dates | 2 seconds ago');
  dateEquals(Date.create('2 milliseconds ago'), getRelativeDate(null, null, null, null, null, null, -2), 'Date#create | Fuzzy Dates | 2 milliseconds ago');
  dateEquals(Date.create('a second ago'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Fuzzy Dates | a second ago');

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
  dateEquals(Date.create('this year'), getRelativeDate(0), 'Date#create | Fuzzy Dates | this year');

  dateEquals(Date.create('beginning of the week'), getDateWithWeekdayAndOffset(0), 'Date#create | Fuzzy Dates | beginning of the week');
  dateEquals(Date.create('beginning of this week'), getDateWithWeekdayAndOffset(0), 'Date#create | Fuzzy Dates | beginning of this week');
  dateEquals(Date.create('end of this week'), getDateWithWeekdayAndOffset(6, 0, 23, 59, 59, 999), 'Date#create | Fuzzy Dates | end of this week');
  dateEquals(Date.create('beginning of next week'), getDateWithWeekdayAndOffset(0, 7), 'Date#create | Fuzzy Dates | beginning of next week');
  dateEquals(Date.create('the beginning of next week'), getDateWithWeekdayAndOffset(0, 7), 'Date#create | Fuzzy Dates | the beginning of next week');

  dateEquals(Date.create('beginning of the month'), new Date(now.getFullYear(), now.getMonth()), 'Date#create | Fuzzy Dates | beginning of the month');
  dateEquals(Date.create('beginning of this month'), new Date(now.getFullYear(), now.getMonth()), 'Date#create | Fuzzy Dates | beginning of this month');
  dateEquals(Date.create('beginning of next month'), new Date(now.getFullYear(), now.getMonth() + 1), 'Date#create | Fuzzy Dates | beginning of next month');
  dateEquals(Date.create('the beginning of next month'), new Date(now.getFullYear(), now.getMonth() + 1), 'Date#create | Fuzzy Dates | the beginning of next month');
  dateEquals(Date.create('the end of next month'), new Date(now.getFullYear(), now.getMonth() + 1, getDaysInMonth(now.getFullYear(), now.getMonth() + 1), 23, 59, 59, 999), 'Date#create | Fuzzy Dates | the end of next month');

  dateEquals(Date.create('the beginning of the year'), new Date(now.getFullYear(), 0), 'Date#create | Fuzzy Dates | the beginning of the year');
  dateEquals(Date.create('the beginning of this year'), new Date(now.getFullYear(), 0), 'Date#create | Fuzzy Dates | the beginning of this year');
  dateEquals(Date.create('the beginning of next year'), new Date(now.getFullYear() + 1, 0), 'Date#create | Fuzzy Dates | the beginning of next year');
  dateEquals(Date.create('the beginning of last year'), new Date(now.getFullYear() - 1, 0), 'Date#create | Fuzzy Dates | the beginning of last year');
  dateEquals(Date.create('the end of next year'), new Date(now.getFullYear() + 1, 11, 31, 23, 59, 59, 999), 'Date#create | Fuzzy Dates | the end of next year');
  dateEquals(Date.create('the end of last year'), new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999), 'Date#create | Fuzzy Dates | the end of last year');

  dateEquals(Date.create('beginning of March'), new Date(now.getFullYear(), 2), 'Date#create | Fuzzy Dates | beginning of March');
  dateEquals(Date.create('end of March'), new Date(now.getFullYear(), 2, 31, 23, 59, 59, 999), 'Date#create | Fuzzy Dates | end of March');
  dateEquals(Date.create('the first day of March'), new Date(now.getFullYear(), 2), 'Date#create | Fuzzy Dates | the first day of March');
  dateEquals(Date.create('the last day of March'), new Date(now.getFullYear(), 2, 31), 'Date#create | Fuzzy Dates | the last day of March');

  dateEquals(Date.create('beginning of 1998'), new Date(1998, 0), 'Date#create | Fuzzy Dates | beginning of 1998');
  dateEquals(Date.create('end of 1998'), new Date(1998, 11, 31, 23, 59, 59, 999), 'Date#create | Fuzzy Dates | end of 1998');
  dateEquals(Date.create('the first day of 1998'), new Date(1998, 0), 'Date#create | Fuzzy Dates | the first day of 1998');
  dateEquals(Date.create('the last day of 1998'), new Date(1998, 11, 31), 'Date#create | Fuzzy Dates | the last day of 1998');





  dateEquals(Date.create('The 15th of last month.'), new Date(now.getFullYear(), now.getMonth() - 1, 15), 'Date#create | Fuzzy Dates | The 15th of last month');
  dateEquals(Date.create('January 30th of last year.'), new Date(now.getFullYear() - 1, 0, 30), 'Date#create | Fuzzy Dates | January 30th of last year');
  dateEquals(Date.create('January of last year.'), new Date(now.getFullYear() - 1, 0), 'Date#create | Fuzzy Dates | January of last year');

  dateEquals(Date.create('First day of may'), new Date(now.getFullYear(), 4, 1), 'Date#create | Fuzzy Dates | First day of may');
  dateEquals(Date.create('Last day of may'), new Date(now.getFullYear(), 4, 31), 'Date#create | Fuzzy Dates | Last day of may');
  dateEquals(Date.create('Last day of next month'), new Date(now.getFullYear(), now.getMonth() + 1, getDaysInMonth(now.getFullYear(), now.getMonth() + 1)), 'Date#create | Fuzzy Dates | Last day of next month');
  dateEquals(Date.create('Last day of november'), new Date(now.getFullYear(), 10, 30), 'Date#create | Fuzzy Dates | Last day of november');

  // Just the time
  dateEquals(Date.create('1pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13), 'Date#create | ISO8601 | 1pm');
  dateEquals(Date.create('Midnight tonight'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), 'Date#create | Fuzzy Dates | Midnight tonight');
  dateEquals(Date.create('Noon tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12), 'Date#create | Fuzzy Dates | Noon tomorrow');
  dateEquals(Date.create('midnight'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), 'Date#create | Fuzzy Dates | midnight');
  dateEquals(Date.create('noon'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12), 'Date#create | Fuzzy Dates | noon');
  dateEquals(Date.create('midnight wednesday'), getDateWithWeekdayAndOffset(4, 0), 'Date#create | Fuzzy Dates | midnight wednesday');
  dateEquals(Date.create('midnight saturday'), getDateWithWeekdayAndOffset(0, 7), 'Date#create | Fuzzy Dates | midnight saturday');


  var d;

  d = new Date('August 25, 2010 11:45:20');
  d.set(2008, 5, 18, 4, 25, 30, 400);

  equals(d.getFullYear(), 2008, 'Date#set | year');
  equals(d.getMonth(), 5, 'Date#set | month');
  equals(d.getDate(), 18, 'Date#set | date');
  equals(d.getHours(), 4, 'Date#set | hours');
  equals(d.getMinutes(), 25, 'Date#set | minutes');
  equals(d.getSeconds(), 30, 'Date#set | seconds');
  equals(d.getMilliseconds(), 400, 'Date#set | milliseconds');

  d = new Date('August 25, 2010 11:45:20');
  d.set({ year: 2008, month: 5, date: 18, hour: 4, minute: 25, second: 30, millisecond: 400 });

  equals(d.getFullYear(), 2008, 'Date#set | object | year');
  equals(d.getMonth(), 5, 'Date#set | object | month');
  equals(d.getDate(), 18, 'Date#set | object | date');
  equals(d.getHours(), 4, 'Date#set | object | hours');
  equals(d.getMinutes(), 25, 'Date#set | object | minutes');
  equals(d.getSeconds(), 30, 'Date#set | object | seconds');
  equals(d.getMilliseconds(), 400, 'Date#set | object | milliseconds');

  d = new Date('August 25, 2010 11:45:20');
  d.set({ years: 2008, months: 5, date: 18, hours: 4, minutes: 25, seconds: 30, milliseconds: 400 });

  equals(d.getFullYear(), 2008, 'Date#set | object plural | year');
  equals(d.getMonth(), 5, 'Date#set | object plural | month');
  equals(d.getDate(), 18, 'Date#set | object plural | date');
  equals(d.getHours(), 4, 'Date#set | object plural | hours');
  equals(d.getMinutes(), 25, 'Date#set | object plural | minutes');
  equals(d.getSeconds(), 30, 'Date#set | object plural | seconds');
  equals(d.getMilliseconds(), 400, 'Date#set | object plural | milliseconds');

  d.set({ weekday: 2 });
  equals(d.getDate(), 17, 'Date#set | object | weekday 2');
  d.set({ weekday: 5 });
  equals(d.getDate(), 20, 'Date#set | object | weekday 5');


  d = new Date('August 25, 2010 11:45:20');
  d.set({ years: 2005, hours: 2 });

  equals(d.getFullYear(), 2005, 'Date#set | no reset | year');
  equals(d.getMonth(), 7, 'Date#set | no reset | month');
  equals(d.getDate(), 25, 'Date#set | no reset | date');
  equals(d.getHours(), 2, 'Date#set | no reset | hours');
  equals(d.getMinutes(), 45, 'Date#set | no reset | minutes');
  equals(d.getSeconds(), 20, 'Date#set | no reset | seconds');
  equals(d.getMilliseconds(), 0, 'Date#set | no reset | milliseconds');



  d = new Date('August 25, 2010 11:45:20');
  d.set({ years: 2008, hours: 4 }, true);

  equals(d.getFullYear(), 2008, 'Date#set | reset | year');
  equals(d.getMonth(), 0, 'Date#set | reset | month');
  equals(d.getDate(), 1, 'Date#set | reset | date');
  equals(d.getHours(), 4, 'Date#set | reset | hours');
  equals(d.getMinutes(), 0, 'Date#set | reset | minutes');
  equals(d.getSeconds(), 0, 'Date#set | reset | seconds');
  equals(d.getMilliseconds(), 0, 'Date#set | reset | milliseconds');


  d = new Date('August 25, 2010 11:45:20');
  d.setUTC({ years: 2008, hours: 4 }, true);

  equals(d.getFullYear(), d.getTimezoneOffset() > 240 ? 2007 : 2008, 'Date#set | reset utc | year');
  equals(d.getMonth(), d.getTimezoneOffset() > 240 ? 11 : 0, 'Date#set | reset utc | month');
  equals(d.getDate(), d.getTimezoneOffset() > 240 ? 31 : 1, 'Date#set | reset utc | date');
  equals(d.getHours(), getHours(4 - (d.getTimezoneOffset() / 60)), 'Date#set | reset utc | hours');
  equals(d.getMinutes(), d.getTimezoneOffset() % 60, 'Date#set | reset utc | minutes');
  equals(d.getSeconds(), 0, 'Date#set | reset utc | seconds');
  equals(d.getMilliseconds(), 0, 'Date#set | reset utc | milliseconds');


  d = new Date('August 25, 2010 11:45:20');
  d.setUTC({ years: 2005, hours: 2 }, false);

  equals(d.getFullYear(), 2005, 'Date#set | no reset utc | year');
  equals(d.getMonth(), 7, 'Date#set | no reset utc | month');
  equals(d.getDate(), d.getTimezoneOffset() >= 135 ? 24 : 25, 'Date#set | no reset utc | date');
  equals(d.getHours(), getHours(2 - (d.getTimezoneOffset() / 60)), 'Date#set | no reset utc | hours');
  equals(d.getMinutes(), 45, 'Date#set | no reset utc | minutes');
  equals(d.getSeconds(), 20, 'Date#set | no reset utc | seconds');
  equals(d.getMilliseconds(), 0, 'Date#set | no reset utc | milliseconds');


  d = new Date('August 25, 2010 11:45:20');
  d.setUTC({ years: 2005, hours: 2 }, false);

  equals(d.getFullYear(), 2005, 'Date#setUTC | no reset | year');
  equals(d.getMonth(), 7, 'Date#setUTC | no reset | month');
  equals(d.getDate(), d.getTimezoneOffset() >= 135 ? 24 : 25, 'Date#setUTC | no reset | date');
  equals(d.getHours(), getHours(2 - (d.getTimezoneOffset() / 60)), 'Date#setUTC | no reset | hours');
  equals(d.getMinutes(), 45, 'Date#setUTC | no reset | minutes');
  equals(d.getSeconds(), 20, 'Date#setUTC | no reset | seconds');
  equals(d.getMilliseconds(), 0, 'Date#setUTC | no reset | milliseconds');


  dateEquals(Date.create('Next week'), getRelativeDate(null, null, 7), 'Date#create | Fuzzy Dates | Next week');

  d = new Date('August 25, 2010 11:45:20');

  equals(d.getWeekday(), 3, 'Date#getWeekday | wednesday');

  d.setWeekday(0);
  equals(d.getDate(), 22, 'Date#setWeekday | sunday');
  d.setWeekday(1);
  equals(d.getDate(), 23, 'Date#setWeekday | monday');
  d.setWeekday(2);
  equals(d.getDate(), 24, 'Date#setWeekday | tuesday');
  d.setWeekday(3);
  equals(d.getDate(), 25, 'Date#setWeekday | wednesday');
  d.setWeekday(4);
  equals(d.getDate(), 26, 'Date#setWeekday | thursday');
  d.setWeekday(5);
  equals(d.getDate(), 27, 'Date#setWeekday | friday');
  d.setWeekday(6);
  equals(d.getDate(), 28, 'Date#setWeekday | saturday');


  d = new Date('August 25, 2010 11:45:20');

  equals(d.getUTCWeekday(), 3, 'Date#getUTCWeekday | wednesday');

  d.setUTCWeekday(0);
  equals(d.getDate(), 22, 'Date#setUTCWeekday | sunday');
  d.setUTCWeekday(1);
  equals(d.getDate(), 23, 'Date#setUTCWeekday | monday');
  d.setUTCWeekday(2);
  equals(d.getDate(), 24, 'Date#setUTCWeekday | tuesday');
  d.setUTCWeekday(3);
  equals(d.getDate(), 25, 'Date#setUTCWeekday | wednesday');
  d.setUTCWeekday(4);
  equals(d.getDate(), 26, 'Date#setUTCWeekday | thursday');
  d.setUTCWeekday(5);
  equals(d.getDate(), 27, 'Date#setUTCWeekday | friday');
  d.setUTCWeekday(6);
  equals(d.getDate(), 28, 'Date#setUTCWeekday | saturday');


  d.setDate(12);
  equals(d.getWeekday(), 4, 'Date#getWeekday | Thursday');
  equals(d.getUTCWeekday(), 4, 'Date#setUTCWeekday | Thursday');

  d.setDate(13);
  equals(d.getWeekday(), 5, 'Date#getWeekday | Friday');
  equals(d.getUTCWeekday(), 5, 'Date#setUTCWeekday | Friday');

  d.setDate(14);
  equals(d.getWeekday(), 6, 'Date#getWeekday | Saturday');
  equals(d.getUTCWeekday(), 6, 'Date#setUTCWeekday | Saturday');

  d.setDate(15);
  equals(d.getWeekday(), 0, 'Date#getWeekday | Sunday');
  equals(d.getUTCWeekday(), 0, 'Date#setUTCWeekday | Sunday');

  d.setDate(16);
  equals(d.getWeekday(), 1, 'Date#getWeekday | Monday');
  equals(d.getUTCWeekday(), 1, 'Date#setUTCWeekday | Monday');

  d.setDate(17);
  equals(d.getWeekday(), 2, 'Date#getWeekday | Tuesday');
  equals(d.getUTCWeekday(), 2, 'Date#setUTCWeekday | Tuesday');

  d.setDate(18);
  equals(d.getWeekday(), 3, 'Date#getWeekday | Wednesday');
  equals(d.getUTCWeekday(), 3, 'Date#setUTCWeekday | Wednesday');


  dateEquals(new Date().advance({ weekday: 7 }), new Date(), 'Date#advance | cannot advance by weekdays');
  dateEquals(new Date().rewind({ weekday: 7 }), new Date(), 'Date#advance | cannot rewind by weekdays');


  var d = new Date(2010, 11, 31, 24, 59, 59);

  equals(d.getWeekday(), d.getDay(), 'Date#getWeekday | equal to getDay');
  equals(d.getUTCWeekday(), d.getUTCDay(), 'Date#getUTCWeekday | equal to getUTCDay');


  d = new Date('August 25, 2010 11:45:20');

  equals(d.getUTCWeekday(), 3, 'Date#getUTCWeekday | wednesday');

  d.setUTCWeekday(0);
  equals(d.getDate(), 22, 'Date#setUTCWeekday | sunday');
  d.setUTCWeekday(1);
  equals(d.getDate(), 23, 'Date#setUTCWeekday | monday');
  d.setUTCWeekday(2);
  equals(d.getDate(), 24, 'Date#setUTCWeekday | tuesday');
  d.setUTCWeekday(3);
  equals(d.getDate(), 25, 'Date#setUTCWeekday | wednesday');
  d.setUTCWeekday(4);
  equals(d.getDate(), 26, 'Date#setUTCWeekday | thursday');
  d.setUTCWeekday(5);
  equals(d.getDate(), 27, 'Date#setUTCWeekday | friday');
  d.setUTCWeekday(6);
  equals(d.getDate(), 28, 'Date#setUTCWeekday | saturday');

  d.setUTCWeekday();
  equals(d.getDate(), 28, 'Date#setUTCWeekday | undefined');


  d = new Date('August 25, 2010 11:45:20');

  d.advance(1,-3,2,8,12,-2,44);

  equals(d.getFullYear(), 2011, 'Date#advance | year');
  equals(d.getMonth(), 4, 'Date#advance | month');
  equals(d.getDate(), 27, 'Date#advance | day');
  equals(d.getHours(), 19, 'Date#advance | hours');
  equals(d.getMinutes(), 57, 'Date#advance | minutes');
  equals(d.getSeconds(), 18, 'Date#advance | seconds');
  equals(d.getMilliseconds(), 44, 'Date#advance | milliseconds');


  d = new Date('August 25, 2010 11:45:20');

  d.rewind(1,-3,2,8,12,-2,4);

  equals(d.getFullYear(), 2009, 'Date#rewind | year');
  equals(d.getMonth(), 10, 'Date#rewind | month');
  equals(d.getDate(), 23, 'Date#rewind | day');
  equals(d.getHours(), 3, 'Date#rewind | hours');
  equals(d.getMinutes(), 33, 'Date#rewind | minutes');
  equals(d.getSeconds(), 21, 'Date#rewind | seconds');
  equals(d.getMilliseconds(), 996, 'Date#rewind | milliseconds');



  d = new Date('August 25, 2010 11:45:20');
  d.advance({ year: 1, month: -3, days: 2, hours: 8, minutes: 12, seconds: -2, milliseconds: 44 });

  equals(d.getFullYear(), 2011, 'Date#advance | object | year');
  equals(d.getMonth(), 4, 'Date#advance | object | month');
  equals(d.getDate(), 27, 'Date#advance | object | day');
  equals(d.getHours(), 19, 'Date#advance | object | hours');
  equals(d.getMinutes(), 57, 'Date#advance | object | minutes');
  equals(d.getSeconds(), 18, 'Date#advance | object | seconds');
  equals(d.getMilliseconds(), 44, 'Date#advance | object | milliseconds');


  d = new Date('August 25, 2010 11:45:20');
  d.rewind({ year: 1, month: -3, days: 2, hours: 8, minutes: 12, seconds: -2, milliseconds: 4 });

  equals(d.getFullYear(), 2009, 'Date#rewind | object | year');
  equals(d.getMonth(), 10, 'Date#rewind | object | month');
  equals(d.getDate(), 23, 'Date#rewind | object | day');
  equals(d.getHours(), 3, 'Date#rewind | object | hours');
  equals(d.getMinutes(), 33, 'Date#rewind | object | minutes');
  equals(d.getSeconds(), 21, 'Date#rewind | object | seconds');
  equals(d.getMilliseconds(), 996, 'Date#rewind | object | milliseconds');



  d = new Date('August 25, 2010 11:45:20');
  d.advance({ week: 1});
  dateEquals(d, new Date(2010, 8, 1, 11, 45, 20), 'Date#advance | positive weeks supported');
  d.advance({ week: -2});
  dateEquals(d, new Date(2010, 7, 18, 11, 45, 20), 'Date#advance | negative weeks supported');


  d = new Date('August 25, 2010 11:45:20');
  d.rewind({ week: 1});
  dateEquals(d, new Date(2010, 7, 18, 11, 45, 20), 'Date#rewind | positive weeks supported');
  d.rewind({ week: -1});
  dateEquals(d, new Date(2010, 7, 25, 11, 45, 20), 'Date#rewind | negative weeks supported');



  dateEquals(new Date().advance(1), Date.create('one year from now'), 'Date#advance | date instance is returned');
  dateEquals(new Date().rewind(1), Date.create('one year ago'), 'Date#rewind | date instance is returned');









  d.set({ month: 0 })
  equals(d.daysInMonth(), 31, 'Date#daysInMonth | jan');
  d.set({ month: 1 })
  equals(d.daysInMonth(), 28, 'Date#daysInMonth | feb');
  d.set({ month: 2 })
  equals(d.daysInMonth(), 31, 'Date#daysInMonth | mar');
  d.set({ month: 3 })
  // This test fails in Casablanca in Windows XP! Reason unknown.
  equals(d.daysInMonth(), 30, 'Date#daysInMonth | apr');
  d.set({ month: 4 })
  equals(d.daysInMonth(), 31, 'Date#daysInMonth | may');
  d.set({ month: 5 })
  equals(d.daysInMonth(), 30, 'Date#daysInMonth | jun');
  d.set({ month: 6 })
  equals(d.daysInMonth(), 31, 'Date#daysInMonth | jul');
  d.set({ month: 7 })
  equals(d.daysInMonth(), 31, 'Date#daysInMonth | aug');
  d.set({ month: 8 })
  equals(d.daysInMonth(), 30, 'Date#daysInMonth | sep');
  d.set({ month: 9 })
  equals(d.daysInMonth(), 31, 'Date#daysInMonth | oct');
  d.set({ month: 10 })
  equals(d.daysInMonth(), 30, 'Date#daysInMonth | nov');
  d.set({ month: 11 })
  equals(d.daysInMonth(), 31, 'Date#daysInMonth | dec');

  d.set({ year: 2012, month: 1 });
  equals(d.daysInMonth(), 29, 'Date#daysInMonth | feb leap year');



  d = new Date('August 5, 2010 13:45:02');
  d.setMilliseconds(234);
  d.set({ month: 3 });

  equals(d.getFullYear(), 2010, 'Date#set | does not reset year');
  equals(d.getMonth(), 3, 'Date#set | does reset month');
  equals(d.getDate(), 5, 'Date#set | does not reset date');
  equals(d.getHours(), 13, 'Date#set | does not reset hours');
  equals(d.getMinutes(), 45, 'Date#set | does not reset minutes');
  equals(d.getSeconds(), 02, 'Date#set | does not reset seconds');
  equals(d.getMilliseconds(), 234, 'Date#set | does not reset milliseconds');



  d = new Date('August 5, 2010 13:45:02');
  d.set({ month: 3 }, true);

  equals(d.getFullYear(), 2010, 'Date#set | does not reset year');
  equals(d.getMonth(), 3, 'Date#set | does reset month');
  equals(d.getDate(), 1, 'Date#set | does reset date');
  equals(d.getHours(), 0, 'Date#set | does reset hours');
  equals(d.getMinutes(), 0, 'Date#set | does reset minutes');
  equals(d.getSeconds(), 0, 'Date#set | does reset seconds');
  equals(d.getMilliseconds(), 0, 'Date#set | does reset milliseconds');



  // Catch for DST inequivalencies
  // FAILS IN DAMASCUS IN XP!
  equals(new Date(2010, 11, 9, 17).set({ year: 1998, month: 3, day: 3}, true).getHours(), 0, 'Date#set | handles DST properly');



  // Date formatting. Much thanks to inspiration taken from Date.js here.
  // I quite like the formatting patterns in Date.js, however there are a few
  // notable limitations. One example is a format such as 4m23s which would have
  // to be formatted as mmss and wouldn't parse at all without special massaging.
  // Going to take a different tack here with a format that's more explicit and
  // easy to remember, if not quite as terse and elegant.


  d = new Date('August 5, 2010 13:45:02');


  equals(d.format('{ms}'), '0', 'Date#format | custom formats | ms');
  equals(d.format('{millisec}'), '0', 'Date#format | custom formats | millisec');
  equals(d.format('{millisecond}'), '0', 'Date#format | custom formats | millisecond');
  equals(d.format('{milliseconds}'), '0', 'Date#format | custom formats | milliseconds');
  equals(d.format('{s}'), '2', 'Date#format | custom formats | s');
  equals(d.format('{ss}'), '02', 'Date#format | custom formats | ss');
  equals(d.format('{sec}'), '2', 'Date#format | custom formats | sec');
  equals(d.format('{second}'), '2', 'Date#format | custom formats | second');
  equals(d.format('{seconds}'), '2', 'Date#format | custom formats | seconds');
  equals(d.format('{m}'), '45', 'Date#format | custom formats | m');
  equals(d.format('{mm}'), '45', 'Date#format | custom formats | mm');
  equals(d.format('{min}'), '45', 'Date#format | custom formats | min');
  equals(d.format('{minute}'), '45', 'Date#format | custom formats | minute');
  equals(d.format('{minutes}'), '45', 'Date#format | custom formats | minutes');
  equals(d.format('{h}'), '13', 'Date#format | custom formats | h');
  equals(d.format('{hh}'), '13', 'Date#format | custom formats | hh');
  equals(d.format('{hour}'), '13', 'Date#format | custom formats | hour');
  equals(d.format('{hours}'), '13', 'Date#format | custom formats | hours');
  equals(d.format('{24hr}'), '13', 'Date#format | custom formats | 24hr');
  equals(d.format('{12hr}'), '1', 'Date#format | custom formats | 12hr');
  equals(d.format('{d}'), '5', 'Date#format | custom formats | d');
  equals(d.format('{dd}'), '05', 'Date#format | custom formats | dd');
  equals(d.format('{dow}'), 'thu', 'Date#format | custom formats | dow');
  equals(d.format('{Dow}'), 'Thu', 'Date#format | custom formats | Dow');
  equals(d.format('{weekday short}'), 'thu', 'Date#format | custom formats | weekday short');
  equals(d.format('{weekday short}'), 'thu', 'Date#format | custom formats | weekday short');
  equals(d.format('{weekday}'), 'thursday', 'Date#format | custom formats | weekday');
  equals(d.format('{Weekday short}'), 'Thu', 'Date#format | custom formats | Weekday short');
  equals(d.format('{Weekday}'), 'Thursday', 'Date#format | custom formats | Weekday');
  equals(d.format('{M}'), '8', 'Date#format | custom formats | M');
  equals(d.format('{MM}'), '08', 'Date#format | custom formats | MM');
  equals(d.format('{Month short}'), 'Aug', 'Date#format | custom formats | Month short');
  equals(d.format('{month short}'), 'aug', 'Date#format | custom formats | month short');
  equals(d.format('{month}'), 'august', 'Date#format | custom formats | month');
  equals(d.format('{Month short}'), 'Aug', 'Date#format | custom formats | Month short');
  equals(d.format('{Mon}'), 'Aug', 'Date#format | custom formats | Mon');
  equals(d.format('{Month}'), 'August', 'Date#format | custom formats | Month');
  equals(d.format('{yy}'), '10', 'Date#format | custom formats | yy');
  equals(d.format('{yyyy}'), '2010', 'Date#format | custom formats | yyyy');
  equals(d.format('{t}'), 'p', 'Date#format | custom formats | t');
  equals(d.format('{T}'), 'P', 'Date#format | custom formats | T');
  equals(d.format('{tt}'), 'pm', 'Date#format | custom formats | tt');
  equals(d.format('{TT}'), 'PM', 'Date#format | custom formats | TT');
  equals(d.format('{ord}'), '5th', 'Date#format | custom formats | ord');


  d = new Date('August 5, 2010 04:03:02');

  equals(d.format('{min pad}'), '03', 'Date#format | custom formats | min pad');
  equals(d.format('{m pad}'), '03', 'Date#format | custom formats | m pad');
  equals(d.format('{d pad}'), '05', 'Date#format | custom formats | d pad');
  equals(d.format('{days pad}'), '05', 'Date#format | custom formats | days pad');
  equals(d.format('{h pad}'), '04', 'Date#format | custom formats | h pad');
  equals(d.format('{hours pad}'), '04', 'Date#format | custom formats | hours pad');
  equals(d.format('{s pad}'), '02', 'Date#format | custom formats | s pad');
  equals(d.format('{sec pad}'), '02', 'Date#format | custom formats | sec pad');
  equals(d.format('{seconds pad}'), '02', 'Date#format | custom formats | seconds pad');


  equals(d.format('{M}/{d}/{yyyy}'), '8/5/2010', 'Date#format | full formats | slashes');
  equals(d.format('{Weekday}, {Month} {dd}, {yyyy}'), 'Thursday, August 05, 2010', 'Date#format | full formats | text date');
  equals(d.format('{Weekday}, {Month} {dd}, {yyyy} {12hr}:{mm}:{ss} {tt}'), 'Thursday, August 05, 2010 4:03:02 am', 'Date#format | full formats | text date with time');
  equals(d.format('{Month} {dd}'), 'August 05', 'Date#format | full formats | month and day');
  equals(d.format('{Dow}, {dd} {Mon} {yyyy} {hh}:{mm}:{ss} GMT'), 'Thu, 05 Aug 2010 04:03:02 GMT', 'Date#format | full formats | full GMT');
  equals(d.format('{yyyy}-{MM}-{dd}T{hh}:{mm}:{ss}'), '2010-08-05T04:03:02', 'Date#format | full formats | ISO8601 Local');
  equals(d.format('{12hr}:{mm} {tt}'), '4:03 am', 'Date#format | full formats | hr:min');
  equals(d.format('{12hr}:{mm}:{ss} {tt}'), '4:03:02 am', 'Date#format | full formats | hr:min:sec');
  equals(d.format('{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}Z'), '2010-08-05 04:03:02Z', 'Date#format | full formats | ISO8601 UTC');
  equals(d.format('{Month}, {yyyy}'), 'August, 2010', 'Date#format | full formats | month and year');


  // Be VERY careful here. Timezone offset is NOT always guaranteed to be the same for a given timezone,
  // as DST may come into play.
  var offset = d.getTimezoneOffset();
  var isotzd = Math.round(-offset / 60).pad(2, true) + ':' + (offset % 60).pad(2);
  var tzd = isotzd.replace(/:/, '');
  if(d.isUTC()){
    isotzd = 'Z';
    tzd = '+0000';
  }

  equals(d.getUTCOffset(), tzd, 'Date#getUTCOffset | no colon');
  equals(d.getUTCOffset(true), isotzd, 'Date#getUTCOffset | colon');

  equals(d.format(Date.AMERICAN_DATE), '8/5/2010', 'Date#format | internal formats | AMERICAN_DATE');
  equals(d.format(Date.AMERICAN_DATETIME), '8/5/2010 4:03am', 'Date#format | internal formats | AMERICAN_DATETIME');
  equals(d.format(Date.EUROPEAN_DATE), '5/8/2010', 'Date#format | internal formats | EUROPEAN_DATE');
  equals(d.format(Date.INTERNATIONAL_TIME), '4:03:02', 'Date#format | internal formats | INTERNATIONAL_TIME');
  equals(d.format(Date.ISO8601_DATE), '2010-08-05', 'Date#format | internal formats | ISO8601_DATE');
  equals(d.format(Date.ISO8601_DATETIME), '2010-08-05T04:03:02'+isotzd, 'Date#format | internal formats | ISO8601_DATETIME');


  equals(d.format('AMERICAN_DATE'), '8/5/2010', 'Date#format | internal formats | AMERICAN_DATE');
  equals(d.format('AMERICAN_DATETIME'), '8/5/2010 4:03am', 'Date#format | internal formats | AMERICAN_DATETIME');
  equals(d.format('EUROPEAN_DATE'), '5/8/2010', 'Date#format | internal formats | EUROPEAN_DATE');
  equals(d.format('INTERNATIONAL_TIME'), '4:03:02', 'Date#format | internal formats | INTERNATIONAL_TIME');
  equals(d.format('ISO8601_DATE'), '2010-08-05', 'Date#format | internal formats | ISO8601_DATE');
  equals(d.format('ISO8601_DATETIME'), '2010-08-05T04:03:02'+isotzd, 'Date#format | internal formats | ISO8601_DATETIME');


  var iso = d.getUTCFullYear()+'-'+(d.getUTCMonth()+1).pad(2)+'-'+d.getUTCDate().pad(2)+'T'+d.getUTCHours().pad(2)+':'+d.getUTCMinutes().pad(2)+':'+d.getUTCSeconds().pad(2)+d.getUTCOffset(true);
  equals(d.format(Date.ISO8601_DATETIME, true), iso, 'Date#format | internal formats | ISO8601_DATETIME UTC');
  equals(d.format(Date.ISO8601, true), iso, 'Date#format | internal formats | ISO8601 UTC');
  equals(d.format('ISO8601_DATETIME', true), iso, 'Date#format | internal formats | ISO8601_DATETIME UTC');
  equals(d.format('ISO8601', true), iso, 'Date#format | internal formats | ISO8601 UTC');


  var rfc1123 = getWeekday(d).to(2).capitalize()+', '+d.getDate().pad(2)+' '+getMonth(d).to(2).capitalize()+' '+d.getFullYear()+' '+d.getHours().pad(2)+':'+d.getMinutes().pad(2)+':'+d.getSeconds().pad(2)+' GMT'+d.getUTCOffset();
  var rfc1036 = getWeekday(d).capitalize()+', '+d.getDate().pad(2)+'-'+getMonth(d).to(2).capitalize()+'-'+d.getFullYear().toString().last(2)+' '+d.getHours().pad(2)+':'+d.getMinutes().pad(2)+':'+d.getSeconds().pad(2)+' GMT'+d.getUTCOffset();
  equals(d.format(Date.RFC1123), rfc1123, 'Date#format | internal formats | RFC1123');
  equals(d.format(Date.RFC1036), rfc1036, 'Date#format | internal formats | RFC1036');
  equals(d.format('RFC1123'), rfc1123, 'Date#format | internal formats | RFC1123');
  equals(d.format('RFC1036'), rfc1036, 'Date#format | internal formats | RFC1036');


  rfc1123 = getWeekday(d,true).to(2).capitalize()+', '+d.getUTCDate().pad(2)+' '+getMonth(d,true).to(2).capitalize()+' '+d.getUTCFullYear()+' '+d.getUTCHours().pad(2)+':'+d.getUTCMinutes().pad(2)+':'+d.getUTCSeconds().pad(2)+' GMT'+d.getUTCOffset();
  rfc1036 = getWeekday(d,true).capitalize()+', '+d.getUTCDate().pad(2)+'-'+getMonth(d,true).to(2).capitalize()+'-'+d.getUTCFullYear().toString().last(2)+' '+d.getUTCHours().pad(2)+':'+d.getUTCMinutes().pad(2)+':'+d.getUTCSeconds().pad(2)+' GMT'+d.getUTCOffset();
  equals(d.format('RFC1123', true), rfc1123, 'Date#format | internal formats | RFC1123 UTC');
  equals(d.format('RFC1036', true), rfc1036, 'Date#format | internal formats | RFC1036 UTC');




  // shortcut for ISO format
  equals(d.iso(), d.format(Date.ISO8601_DATETIME, true), 'Date#iso is an alias for the ISO8601_DATETIME format');



  d = new Date(2010,7,5,13,45,2,542);

  equals(d.is('nonsense'), false, 'Date#is | nonsense');
  equals(d.is('August'), true, 'Date#is | August');
  equals(d.is('August 5th, 2010'), true, 'Date#is | August 5th, 2010');
  equals(d.is('August 5th, 2010 13:45'), true, 'Date#is | August 5th, 2010, 13:45');
  equals(d.is('August 5th, 2010 13:45:02'), true, 'Date#is | August 5th 2010, 13:45:02');
  equals(d.is('August 5th, 2010 13:45:02.542'), true, 'Date#is | August 5th 2010, 13:45:02:542');
  equals(d.is('September'), false, 'Date#is | September');
  equals(d.is('August 6th, 2010'), false, 'Date#is | August 6th, 2010');
  equals(d.is('August 5th, 2010 13:46'), false, 'Date#is | August 5th, 2010, 13:46');
  equals(d.is('August 5th, 2010 13:45:03'), false, 'Date#is | August 5th 2010, 13:45:03');
  equals(d.is('August 5th, 2010 13:45:03.543'), false, 'Date#is | August 5th 2010, 13:45:03:543');
  equals(d.is('July'), false, 'Date#is | July');
  equals(d.is('August 4th, 2010'), false, 'Date#is | August 4th, 2010');
  equals(d.is('August 5th, 2010 13:44'), false, 'Date#is | August 5th, 2010, 13:44');
  equals(d.is('August 5th, 2010 13:45:01'), false, 'Date#is | August 5th 2010, 13:45:01');
  equals(d.is('August 5th, 2010 13:45:03.541'), false, 'Date#is | August 5th 2010, 13:45:03:541');
  equals(d.is('2010'), true, 'Date#is | 2010');
  equals(d.is('today'), false, 'Date#is | today');
  equals(d.is('now'), false, 'Date#is | now');
  equals(d.is('weekday'), true, 'Date#is | weekday');
  equals(d.is('weekend'), false, 'Date#is | weekend');
  equals(d.is('Thursday'), true, 'Date#is | Thursday');
  equals(d.is('Friday'), false, 'Date#is | Friday');

  equals(d.is(d), true, 'Date#is | self is true');
  equals(d.is(new Date(2010,7,5,13,45,2,542)), true, 'Date#is | equal date is true');
  equals(d.is(new Date()), false, 'Date#is | other dates are not true');


  equals(new Date().is('now', 2), true, 'Date#is | now is now');
  equals(new Date(2010,7,5,13,42,42,324).is('August 5th, 2010 13:42:42.324'), true, 'Date#is | August 5th, 2010 13:42:42.324');
  equals(new Date(2010,7,5,13,42,42,324).is('August 5th, 2010 13:42:42.319'), false, 'Date#is | August 5th, 2010 13:42:42.319');
  equals(new Date(2010,7,5,13,42,42,324).is('August 5th, 2010 13:42:42.325'), false, 'Date#is | August 5th, 2010 13:42:42.325');
  equals(new Date(2010,7,5,13,42,42,324).is('August 5th, 2010 13:42:42.323'), false, 'Date#is | August 5th, 2010 13:42:42.323');

  equals(new Date(2001, 0).is('the beginning of 2001'), true, 'Date#is | the beginning of 2001');
  equals(new Date(now.getFullYear(), 2).is('the beginning of March'), true, 'Date#is | the beginning of March');
  equals(new Date(2001, 11, 31, 23, 59, 59, 999).is('the end of 2001'), true, 'Date#is | the end of 2001');
  equals(new Date(now.getFullYear(), 2, 31, 23, 59, 59, 999).is('the end of March'), true, 'Date#is | the end of March');
  equals(new Date(2001, 11, 31).is('the last day of 2001'), true, 'Date#is | the last day of 2001');
  equals(new Date(now.getFullYear(), 2, 31).is('the last day of March'), true, 'Date#is | the last day of March');

  equals(Date.create('the beginning of the week').is('the beginning of the week'), true, 'Date#is | the beginning of the week is the beginning of the week');
  equals(Date.create('the end of the week').is('the end of the week'), true, 'Date#is | the end of the week is the end of the week');
  equals(Date.create('tuesday').is('the beginning of the week'), false, 'Date#is | tuesday is the end of the week');
  equals(Date.create('tuesday').is('the end of the week'), false, 'Date#is | tuesday is the end of the week');

  equals(Date.create('sunday').is('the beginning of the week'), true, 'Date#is | sunday is the beginning of the week');
  equals(Date.create('sunday').is('the beginning of the week'), true, 'Date#is | sunday is the beginning of the week');

  equals(Date.create('tuesday').is('tuesday'), true, 'Date#is | tuesday is tuesday');
  equals(Date.create('sunday').is('sunday'), true, 'Date#is | sunday is sunday');
  equals(Date.create('saturday').is('saturday'), true, 'Date#is | saturday is saturday');

  equals(getDateWithWeekdayAndOffset(0).is('the beginning of the week'), true, 'Date#is | the beginning of the week');
  equals(getDateWithWeekdayAndOffset(6, 0, 23, 59, 59, 999).is('the end of the week'), true, 'Date#is | the end of the week');

  equals(new Date(1970, 0, 1, 0, -timezoneOffset).is(0), true, 'Date#is | Accepts numbers');



  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,431)), false, 'Date#is | accuracy | accurate to millisecond by default');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432)), true, 'Date#is | accuracy |  accurate to millisecond by default');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,433)), false, 'Date#is | accuracy | accurate to millisecond by default');

  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,431), 2), true, 'Date#is | accuracy | accuracy can be overridden');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 2), true, 'Date#is | accuracy | accuracy can be overridden');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,433), 2), true, 'Date#is | accuracy | accuracy can be overridden');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,429), 2), false, 'Date#is | accuracy | accuracy can be overridden but still is constrained');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,435), 2), false, 'Date#is | accuracy | accuracy can be overridden but still is constrained');


  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,431), -500), false, 'Date#is | accuracy | negative accuracy reverts to zero');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), -500), true, 'Date#is | accuracy | negative accuracy reverts to zero');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,433), -500), false, 'Date#is | accuracy | negative accuracy reverts to zero');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,429), -500), false, 'Date#is | accuracy | negative accuracy reverts to zero');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,435), -500), false, 'Date#is | accuracy | negative accuracy reverts to zero');


  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 86400000), true, 'Date#is | accuracy | accurate to a day');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,23,3,1,432), 86400000), true, 'Date#is | accuracy | accurate to a day');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,21,3,1,432), 86400000), true, 'Date#is | accuracy | accurate to a day');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,14,22,3,1,432), 86400000), true, 'Date#is | accuracy | accurate to a day');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,16,22,3,1,432), 86400000), true, 'Date#is | accuracy | accurate to a day');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,14,22,3,1,431), 86400000), false, 'Date#is | accuracy | accurate to a day is still contstrained');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,16,22,3,1,433), 86400000), false, 'Date#is | accuracy | accurate to a day is still contstrained');

  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 31536000000), true, 'Date#is | accuracy | accurate to a year');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,15,22,3,1,432), 31536000000), true, 'Date#is | accuracy | accurate to a year');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 31536000000), true, 'Date#is | accuracy | accurate to a year');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,15,22,3,1,432), 31536000000), true, 'Date#is | accuracy | accurate to a year');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1971,4,15,22,3,1,432), 31536000000), true, 'Date#is | accuracy | accurate to a year');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,14,22,3,2,432), 31536000000), false, 'Date#is | accuracy | accurate to a year is still contstrained');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1971,4,16,22,3,1,432), 31536000000), false, 'Date#is | accuracy | accurate to a year is still contstrained');



  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 'day'), true, 'Date#is | string accuracy | accurate to a day');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,23,3,1,432), 'day'), true, 'Date#is | string accuracy | accurate to a day');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,21,3,1,432), 'day'), true, 'Date#is | string accuracy | accurate to a day');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,14,22,3,1,432), 'day'), true, 'Date#is | string accuracy | accurate to a day');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,16,22,3,1,432), 'day'), true, 'Date#is | string accuracy | accurate to a day');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,14,22,3,1,431), 'day'), false, 'Date#is | string accuracy | accurate to a day is still contstrained');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,16,22,3,1,433), 'day'), false, 'Date#is | string accuracy | accurate to a day is still contstrained');

  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 'year'), true, 'Date#is | string accuracy | accurate to a year');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,15,22,3,1,432), 'year'), true, 'Date#is | string accuracy | accurate to a year');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 'year'), true, 'Date#is | string accuracy | accurate to a year');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,15,22,3,1,432), 'year'), true, 'Date#is | string accuracy | accurate to a year');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1971,4,15,22,3,1,432), 'year'), true, 'Date#is | string accuracy | accurate to a year');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,14,22,3,2,432), 'year'), false, 'Date#is | string accuracy | accurate to a year is still contstrained');
  equals(new Date(1970,4,15,22,3,1,432).is(new Date(1971,4,16,22,3,1,432), 'year'), false, 'Date#is | string accuracy | accurate to a year is still contstrained');









  // Note that relative #is formats can only be considered to be accurate to within a few milliseconds
  // to avoid complications rising from the date being created momentarily after the function is called.
  equals(getRelativeDate(null,null,null,null,null,null, -5).is('3 milliseconds ago'), false, 'Date#is | 3 milliseconds ago is accurate to milliseconds');
  equals(getRelativeDate(null,null,null,null,null,null, -5).is('5 milliseconds ago', 5), true, 'Date#is | 5 milliseconds ago is accurate to milliseconds');
  equals(getRelativeDate(null,null,null,null,null,null, -5).is('7 milliseconds ago'), false, 'Date#is | 7 milliseconds ago is accurate to milliseconds');

  equals(getRelativeDate(null,null,null,null,null,-5).is('4 seconds ago'), false, 'Date#is | 4 seconds ago is accurate to seconds');
  equals(getRelativeDate(null,null,null,null,null,-5).is('5 seconds ago'), true, 'Date#is | 5 seconds ago is accurate to seconds');
  equals(getRelativeDate(null,null,null,null,null,-5).is('6 seconds ago'), false, 'Date#is | 6 seconds ago is accurate to seconds');

  equals(getRelativeDate(null,null,null,null,-5).is('4 minutes ago'), false, 'Date#is | 4 minutes ago is accurate to minutes');
  equals(getRelativeDate(null,null,null,null,-5).is('5 minutes ago'), true, 'Date#is | 5 minutes ago is accurate to minutes');
  equals(getRelativeDate(null,null,null,null,-5).is('6 minutes ago'), false, 'Date#is | 6 minutes ago is accurate to minutes');

  equals(getRelativeDate(null,null,null,-5).is('4 hours ago'), false, 'Date#is | 4 hours ago is accurate to hours');
  equals(getRelativeDate(null,null,null,-5).is('5 hours ago'), true, 'Date#is | 5 hours ago is accurate to hours');
  equals(getRelativeDate(null,null,null,-5).is('6 hours ago'), false, 'Date#is | 6 hours ago is accurate to hours');

  equals(getRelativeDate(null,null,-5).is('4 days ago'), false, 'Date#is | 4 days ago is accurate to days');
  equals(getRelativeDate(null,null,-5).is('5 days ago'), true, 'Date#is | 5 days ago is accurate to days');
  equals(getRelativeDate(null,null,-5).is('6 days ago'), false, 'Date#is | 6 days ago is accurate to days');

  equals(getRelativeDate(null,-5).is('4 months ago'), false, 'Date#is | 4 months ago is accurate to months');
  equals(getRelativeDate(null,-5).is('5 months ago'), true, 'Date#is | 5 months ago is accurate to months');
  equals(getRelativeDate(null,-5).is('6 months ago'), false, 'Date#is | 6 months ago is accurate to months');

  equals(getRelativeDate(-5).is('4 years ago'), false, 'Date#is | 4 years ago is accurate to years');
  equals(getRelativeDate(-5).is('5 years ago'), true, 'Date#is | 5 years ago is accurate to years');
  equals(getRelativeDate(-5).is('6 years ago'), false, 'Date#is | 6 years ago is accurate to years');



  equals(Date.create('tomorrow').is('future'), true, 'Date#is | tomorrow is the future');
  equals(Date.create('tomorrow').is('past'), false, 'Date#is | tomorrow is the past');

  equals(new Date().is('future'), false, 'Date#is | now is the future');

  // now CAN be in the past if there is any lag between when the dates are
  // created, so give this a bit of a buffer...
  equals(new Date().advance({ milliseconds: 5 }).is('past', 5), false, 'Date#is | now is the past');

  equals(Date.create('yesterday').is('future'), false, 'Date#is | yesterday is the future');
  equals(Date.create('yesterday').is('past'), true, 'Date#is | yesterday is the past');

  equals(Date.create('monday').is('weekday'), true, 'Date#is | monday is a weekday');
  equals(Date.create('monday').is('weekend'), false, 'Date#is | monday is a weekend');

  equals(Date.create('friday').is('weekday'), true, 'Date#is | friday is a weekday');
  equals(Date.create('friday').is('weekend'), false, 'Date#is | friday is a weekend');

  equals(Date.create('saturday').is('weekday'), false, 'Date#is | saturday is a weekday');
  equals(Date.create('saturday').is('weekend'), true, 'Date#is | saturday is a weekend');

  equals(Date.create('sunday').is('weekday'), false, 'Date#is | sunday is a weekday');
  equals(Date.create('sunday').is('weekend'), true, 'Date#is | sunday is a weekend');



  equals(new Date(2001,5,4,12,22,34,445).is(new Date(2001,5,4,12,22,34,445)), true, 'Date#is | straight dates passed in are accurate to the millisecond');
  equals(new Date(2001,5,4,12,22,34,445).is(new Date(2001,5,4,12,22,34,444)), false, 'Date#is | straight dates passed in are accurate to the millisecond');
  equals(new Date(2001,5,4,12,22,34,445).is(new Date(2001,5,4,12,22,34,446)), false, 'Date#is | straight dates passed in are accurate to the millisecond');


  equals(Date.create('2008').leapYear(), true, 'Date#leapYear | 2008');
  equals(Date.create('2009').leapYear(), false, 'Date#leapYear | 2009');
  equals(Date.create('2010').leapYear(), false, 'Date#leapYear | 2010');
  equals(Date.create('2011').leapYear(), false, 'Date#leapYear | 2011');
  equals(Date.create('2012').leapYear(), true, 'Date#leapYear | 2012');
  equals(Date.create('2016').leapYear(), true, 'Date#leapYear | 2016');
  equals(Date.create('2020').leapYear(), true, 'Date#leapYear | 2020');
  equals(Date.create('2021').leapYear(), false, 'Date#leapYear | 2021');
  equals(Date.create('1600').leapYear(), true, 'Date#leapYear | 1600');
  equals(Date.create('1700').leapYear(), false, 'Date#leapYear | 1700');
  equals(Date.create('1800').leapYear(), false, 'Date#leapYear | 1800');
  equals(Date.create('1900').leapYear(), false, 'Date#leapYear | 1900');
  equals(Date.create('2000').leapYear(), true, 'Date#leapYear | 2000');


  d = new Date(2010,7,5,13,45,2,542);

  equals(d.getWeek(), 31, 'Date#getWeek | basic');
  equals(dst(d).getUTCWeek(), timezoneOffset > 615 ? 32 : 31, 'Date#getUTCWeek | basic');

  equals(new Date(2010, 0, 1).getWeek(), 1, 'Date#getWeek | January 1st');
  equals(new Date(2010, 0, 1).getUTCWeek(), timezoneOffset >= 0 ? 1 : 53, 'Date#getUTCWeek | January 1st UTC is actually 2009');
  equals(new Date(2010, 0, 6).getWeek(), 1, 'Date#getWeek | January 6th');
  equals(new Date(2010, 0, 6).getUTCWeek(), 1, 'Date#getUTCWeek | January 6th');
  equals(new Date(2010, 0, 7).getWeek(), 1, 'Date#getWeek | January 7th');
  equals(new Date(2010, 0, 7).getUTCWeek(), 1, 'Date#getUTCWeek | January 7th');
  equals(new Date(2010, 0, 7, 23, 59, 59, 999).getWeek(), 1, 'Date#getWeek | January 7th 23:59:59.999');
  equals(new Date(2010, 0, 7, 23, 59, 59, 999).getUTCWeek(), timezoneOffset > 0 ? 2 : 1, 'Date#getUTCWeek | January 7th 23:59:59.999');
  equals(new Date(2010, 0, 8).getWeek(), 2, 'Date#getWeek | January 8th');
  equals(new Date(2010, 0, 8).getUTCWeek(), timezoneOffset >= 0 ? 2 : 1, 'Date#getUTCWeek | January 8th');
  equals(new Date(2010, 3, 15).getWeek(), 15, 'Date#getWeek | April 15th');
  equals(new Date(2010, 3, 15).getUTCWeek(), 15, 'Date#getUTCWeek | April 15th');




  d = new Date(2010,7,5,13,45,2,542);

  equals(new Date(2010,7,5,13,45,2,543).millisecondsSince(d), 1, 'Date#millisecondsSince | 1 milliseconds since');
  equals(new Date(2010,7,5,13,45,2,541).millisecondsUntil(d), 1, 'Date#millisecondsUntil | 1 milliseconds until');
  equals(new Date(2010,7,5,13,45,3,542).secondsSince(d), 1, 'Date#secondsSince | 1 seconds since');
  equals(new Date(2010,7,5,13,45,1,542).secondsUntil(d), 1, 'Date#secondsUntil | 1 seconds until');
  equals(new Date(2010,7,5,13,46,2,542).minutesSince(d), 1, 'Date#minutesSince | 1 minutes since');
  equals(new Date(2010,7,5,13,44,2,542).minutesUntil(d), 1, 'Date#minutesUntil | 1 minutes until');
  equals(new Date(2010,7,5,14,45,2,542).hoursSince(d), 1, 'Date#hoursSince | 1 hours since');
  equals(new Date(2010,7,5,12,45,2,542).hoursUntil(d), 1, 'Date#hoursUntil | 1 hours until');
  equals(new Date(2010,7,6,13,45,2,542).daysSince(d), 1, 'Date#daysSince | 1 days since');
  equals(new Date(2010,7,4,13,45,2,542).daysUntil(d), 1, 'Date#daysUntil | 1 days until');
  equals(new Date(2010,7,12,13,45,2,542).weeksSince(d), 1, 'Date#weeksSince | 1 weeks since');
  equals(new Date(2010,6,29,13,45,2,542).weeksUntil(d), 1, 'Date#weeksUntil | 1 weeks until');
  equals(new Date(2010,8,5,13,45,2,542).monthsSince(d), 1, 'Date#monthsSince | 1 months since');
  equals(new Date(2010,6,5,13,45,2,542).monthsUntil(d), 1, 'Date#monthsUntil | 1 months until');
  equals(new Date(2011,7,5,13,45,2,542).yearsSince(d), 1, 'Date#yearsSince | 1 years since');
  equals(new Date(2009,7,5,13,45,2,542).yearsUntil(d), 1, 'Date#yearsUntil | 1 years until');


  equals(new Date(2011,7,5,13,45,2,542).millisecondsSince(d), 31536000000, 'Date#millisecondsSince | milliseconds since last year');
  equals(new Date(2011,7,5,13,45,2,542).millisecondsUntil(d), -31536000000, 'Date#millisecondsUntil | milliseconds until last year');
  equals(new Date(2011,7,5,13,45,2,542).secondsSince(d), 31536000, 'Date#secondsSince | seconds since last year');
  equals(new Date(2011,7,5,13,45,2,542).secondsUntil(d), -31536000, 'Date#secondsUntil | seconds until last year');
  equals(new Date(2011,7,5,13,45,2,542).minutesSince(d), 525600, 'Date#minutesSince | minutes since last year');
  equals(new Date(2011,7,5,13,45,2,542).minutesUntil(d), -525600, 'Date#minutesUntil | minutes until last year');
  equals(new Date(2011,7,5,13,45,2,542).hoursSince(d), 8760, 'Date#hoursSince | hours since last year');
  equals(new Date(2011,7,5,13,45,2,542).hoursUntil(d), -8760, 'Date#hoursUntil | hours until last year');
  equals(new Date(2011,7,5,13,45,2,542).daysSince(d), 365, 'Date#daysSince | days since last year');
  equals(new Date(2011,7,5,13,45,2,542).daysUntil(d), -365, 'Date#daysUntil | days until last year');
  equals(new Date(2011,7,5,13,45,2,542).weeksSince(d), 52, 'Date#weeksSince | weeks since last year');
  equals(new Date(2011,7,5,13,45,2,542).weeksUntil(d), -52, 'Date#weeksUntil | weeks until last year');
  equals(new Date(2011,7,5,13,45,2,542).monthsSince(d), 12, 'Date#monthsSince | months since last year');
  equals(new Date(2011,7,5,13,45,2,542).monthsUntil(d), -12, 'Date#monthsUntil | months until last year');
  equals(new Date(2011,7,5,13,45,2,542).yearsSince(d), 1, 'Date#yearsSince | years since last year');
  equals(new Date(2011,7,5,13,45,2,542).yearsUntil(d), -1, 'Date#yearsUntil | years until last year');


  // Works with Date.create?
  equals(dst(d).millisecondsSince('the last day of 2011'), -44273697458, 'Date#millisecondsSince | milliseconds since the last day of 2011');
  equals(dst(d).millisecondsUntil('the last day of 2011'), 44273697458, 'Date#millisecondsUntil | milliseconds until the last day of 2011');
  equals(dst(d).secondsSince('the last day of 2011'), -44273697, 'Date#secondsSince | seconds since the last day of 2011');
  equals(dst(d).secondsUntil('the last day of 2011'), 44273697, 'Date#secondsUntil | seconds until the last day of 2011');
  equals(dst(d).minutesSince('the last day of 2011'), -737895, 'Date#minutesSince | minutes since the last day of 2011');
  equals(dst(d).minutesUntil('the last day of 2011'), 737895, 'Date#minutesUntil | minutes until the last day of 2011');
  equals(dst(d).hoursSince('the last day of 2011'), -12298, 'Date#hoursSince | hours since the last day of 2011');
  equals(dst(d).hoursUntil('the last day of 2011'), 12298, 'Date#hoursUntil | hours until the last day of 2011');
  equals(dst(d).daysSince('the last day of 2011'), -512, 'Date#daysSince | days since the last day of 2011');
  equals(dst(d).daysUntil('the last day of 2011'), 512, 'Date#daysUntil | days until the last day of 2011');
  equals(dst(d).weeksSince('the last day of 2011'), -73, 'Date#weeksSince | weeks since the last day of 2011');
  equals(dst(d).weeksUntil('the last day of 2011'), 73, 'Date#weeksUntil | weeks until the last day of 2011');
  equals(dst(d).monthsSince('the last day of 2011'), -17, 'Date#monthsSince | months since the last day of 2011');
  equals(dst(d).monthsUntil('the last day of 2011'), 17, 'Date#monthsUntil | months until the last day of 2011');
  equals(dst(d).yearsSince('the last day of 2011'), -1, 'Date#yearsSince | years since the last day of 2011');
  equals(dst(d).yearsUntil('the last day of 2011'), 1, 'Date#yearsUntil | years until the last day of 2011');



  d = new Date();
  var offset = d.getTime() - new Date(d).advance({ week: -1 });

  // Works with Date.create?
  // need a bit of a buffer here, so...
  // I occasionally get some REALLY big lags with IE here...
  var since = d.millisecondsSince('last week');
  var until = d.millisecondsUntil('last week');

  // IE is showing some REAL big lags (up to 500ms) this deep into testing,
  // so I'm commenting these out for now.
  // equals(since > (offset - 5) && since < offset + 5, true, 'Date#millisecondsSince | milliseconds since last week');
  // equals(since > (5 - offset) && since < (5 + offset), true, 'Date#millisecondsUntil | milliseconds until last week');

  equals(d.secondsSince('last week'), (offset / 1000).round(), 'Date#secondsSince | seconds since last week');
  equals(d.secondsUntil('last week'), (-offset / 1000).round(), 'Date#secondsUntil | seconds until last week');
  equals(d.minutesSince('last week'), (offset / 1000 / 60).round(), 'Date#minutesSince | minutes since last week');
  equals(d.minutesUntil('last week'), (-offset / 1000 / 60).round(), 'Date#minutesUntil | minutes until last week');
  equals(d.hoursSince('last week'), (offset / 1000 / 60 / 60).round(), 'Date#hoursSince | hours since last week');
  equals(d.hoursUntil('last week'), (-offset / 1000 / 60 / 60).round(), 'Date#hoursUntil | hours until last week');
  equals(d.daysSince('last week'), (offset / 1000 / 60 / 60 / 24).round(), 'Date#daysSince | days since last week');
  equals(d.daysUntil('last week'), (-offset / 1000 / 60 / 60 / 24).round(), 'Date#daysUntil | days until last week');
  equals(d.weeksSince('last week'), (offset / 1000 / 60 / 60 / 24 / 7).round(), 'Date#weeksSince | weeks since last week');
  equals(d.weeksUntil('last week'), (-offset / 1000 / 60 / 60 / 24 / 7).round(), 'Date#weeksUntil | weeks until last week');
  equals(d.monthsSince('last week'), (offset / 1000 / 60 / 60 / 24 / 30.4375).round(), 'Date#monthsSince | months since last week');
  equals(d.monthsUntil('last week'), (-offset / 1000 / 60 / 60 / 24 / 30.4375).round(), 'Date#monthsUntil | months until last week');
  equals(d.yearsSince('last week'), (offset / 1000 / 60 / 60 / 24 / 365.25).round(), 'Date#yearsSince | years since last week');
  equals(d.yearsUntil('last week'), (-offset / 1000 / 60 / 60 / 24 / 365.25).round(), 'Date#yearsUntil | years until the last day of 2011');



  d = new Date('August 5, 2010 13:45:02');

  dateEquals(new Date(d).beginningOfDay(), new Date(2010, 7, 5), 'Date#beginningOfDay');
  dateEquals(new Date(d).beginningOfWeek(), new Date(2010, 7, 1), 'Date#beginningOfWeek');
  dateEquals(new Date(d).beginningOfMonth(), new Date(2010, 7), 'Date#beginningOfMonth');
  dateEquals(new Date(d).beginningOfYear(), new Date(2010, 0), 'Date#beginningOfYear');

  dateEquals(new Date(d).endOfDay(), new Date(2010, 7, 5, 23, 59, 59, 999), 'Date#endOfDay');
  dateEquals(new Date(d).endOfWeek(), new Date(2010, 7, 7, 23, 59, 59, 999), 'Date#endOfWeek');
  dateEquals(new Date(d).endOfMonth(), new Date(2010, 7, 31, 23, 59, 59, 999), 'Date#endOfMonth');
  dateEquals(new Date(d).endOfYear(), new Date(2010, 11, 31, 23, 59, 59, 999), 'Date#endOfYear');


  d = new Date('January 1, 1979 01:33:42');

  dateEquals(new Date(d).beginningOfDay(), new Date(1979, 0, 1), 'Date#beginningOfDay | January 1, 1979');
  dateEquals(new Date(d).beginningOfWeek(), new Date(1978, 11, 31), 'Date#beginningOfWeek | January 1, 1979');
  dateEquals(new Date(d).beginningOfMonth(), new Date(1979, 0), 'Date#beginningOfMonth | January 1, 1979');
  dateEquals(new Date(d).beginningOfYear(), new Date(1979, 0), 'Date#beginningOfYear | January 1, 1979');

  dateEquals(new Date(d).endOfDay(), new Date(1979, 0, 1, 23, 59, 59, 999), 'Date#endOfDay | January 1, 1979');
  dateEquals(new Date(d).endOfWeek(), new Date(1979, 0, 6, 23, 59, 59, 999), 'Date#endOfWeek | January 1, 1979');
  dateEquals(new Date(d).endOfMonth(), new Date(1979, 0, 31, 23, 59, 59, 999), 'Date#endOfMonth | January 1, 1979');
  dateEquals(new Date(d).endOfYear(), new Date(1979, 11, 31, 23, 59, 59, 999), 'Date#endOfYear | January 1, 1979');


  d = new Date('December 31, 1945 01:33:42');

  dateEquals(new Date(d).beginningOfDay(), new Date(1945, 11, 31), 'Date#beginningOfDay | January 1, 1945');
  dateEquals(new Date(d).beginningOfWeek(), new Date(1945, 11, 30), 'Date#beginningOfWeek | January 1, 1945');
  dateEquals(new Date(d).beginningOfMonth(), new Date(1945, 11), 'Date#beginningOfMonth | January 1, 1945');
  dateEquals(new Date(d).beginningOfYear(), new Date(1945, 0), 'Date#beginningOfYear | January 1, 1945');

  dateEquals(new Date(d).endOfDay(), new Date(1945, 11, 31, 23, 59, 59, 999), 'Date#endOfDay | January 1, 1945');
  dateEquals(new Date(d).endOfWeek(), new Date(1946, 0, 5, 23, 59, 59, 999), 'Date#endOfWeek | January 1, 1945');
  dateEquals(new Date(d).endOfMonth(), new Date(1945, 11, 31, 23, 59, 59, 999), 'Date#endOfMonth | January 1, 1945');
  dateEquals(new Date(d).endOfYear(), new Date(1945, 11, 31, 23, 59, 59, 999), 'Date#endOfYear | January 1, 1945');


  d = new Date('February 29, 2012 22:15:42');

  dateEquals(new Date(d).beginningOfDay(), new Date(2012, 1, 29), 'Date#beginningOfDay | February 29, 2012');
  dateEquals(new Date(d).beginningOfWeek(), new Date(2012, 1, 26), 'Date#beginningOfWeek | February 29, 2012');
  dateEquals(new Date(d).beginningOfMonth(), new Date(2012, 1), 'Date#beginningOfMonth | February 29, 2012');
  dateEquals(new Date(d).beginningOfYear(), new Date(2012, 0), 'Date#beginningOfYear | February 29, 2012');

  dateEquals(new Date(d).endOfDay(), new Date(2012, 1, 29, 23, 59, 59, 999), 'Date#endOfDay | February 29, 2012');
  dateEquals(new Date(d).endOfWeek(), new Date(2012, 2, 3, 23, 59, 59, 999), 'Date#endOfWeek | February 29, 2012');
  dateEquals(new Date(d).endOfMonth(), new Date(2012, 1, 29, 23, 59, 59, 999), 'Date#endOfMonth | February 29, 2012');
  dateEquals(new Date(d).endOfYear(), new Date(2012, 11, 31, 23, 59, 59, 999), 'Date#endOfYear | February 29, 2012');


  dateEquals(new Date(d).beginningOfDay(false), new Date(2012, 1, 29, 22, 15, 42), 'Date#beginningOfDay | do not reset time | February 29, 2012');
  dateEquals(new Date(d).beginningOfWeek(false), new Date(2012, 1, 26, 22, 15, 42), 'Date#beginningOfWeek | do not reset time | February 29, 2012');
  dateEquals(new Date(d).beginningOfMonth(false), new Date(2012, 1, 1, 22, 15, 42), 'Date#beginningOfMonth | do not reset time | February 29, 2012');
  dateEquals(new Date(d).beginningOfYear(false), new Date(2012, 0, 1, 22, 15, 42), 'Date#beginningOfYear | do not reset time | February 29, 2012');

  dateEquals(new Date(d).endOfDay(false), new Date(2012, 1, 29, 22, 15, 42), 'Date#endOfDay | do not reset time | February 29, 2012');
  dateEquals(new Date(d).endOfWeek(false), new Date(2012, 2, 3, 22, 15, 42), 'Date#endOfWeek | do not reset time | February 29, 2012');
  dateEquals(new Date(d).endOfMonth(false), new Date(2012, 1, 29, 22, 15, 42), 'Date#endOfMonth | do not reset time | February 29, 2012');
  dateEquals(new Date(d).endOfYear(false), new Date(2012, 11, 31, 22, 15, 42), 'Date#endOfYear | do not reset time | February 29, 2012');


  dateEquals(new Date(d).beginningOfDay(true), new Date(2012, 1, 29), 'Date#beginningOfDay | reset if true | February 29, 2012');
  dateEquals(new Date(d).beginningOfWeek(true), new Date(2012, 1, 26), 'Date#beginningOfWeek | reset if true | February 29, 2012');
  dateEquals(new Date(d).beginningOfMonth(true), new Date(2012, 1), 'Date#beginningOfMonth | reset if true | February 29, 2012');
  dateEquals(new Date(d).beginningOfYear(true), new Date(2012, 0), 'Date#beginningOfYear | reset if true | February 29, 2012');

  dateEquals(new Date(d).endOfDay(true), new Date(2012, 1, 29, 23, 59, 59, 999), 'Date#endOfDay | reset if true | February 29, 2012');
  dateEquals(new Date(d).endOfWeek(true), new Date(2012, 2, 3, 23, 59, 59, 999), 'Date#endOfWeek | reset if true | February 29, 2012');
  dateEquals(new Date(d).endOfMonth(true), new Date(2012, 1, 29, 23, 59, 59, 999), 'Date#endOfMonth | reset if true | February 29, 2012');
  dateEquals(new Date(d).endOfYear(true), new Date(2012, 11, 31, 23, 59, 59, 999), 'Date#endOfYear | reset if true | February 29, 2012');



  d = new Date('February 29, 2012 22:15:42');


  dateEquals(new Date(d).addMilliseconds(12), new Date(2012, 1, 29, 22, 15, 42, 12), 'Date#addMilliseconds | 12');
  dateEquals(new Date(d).addSeconds(12), new Date(2012, 1, 29, 22, 15, 54), 'Date#addSeconds | 12');
  dateEquals(new Date(d).addMinutes(12), new Date(2012, 1, 29, 22, 27, 42), 'Date#addMinutes | 12');
  dateEquals(new Date(d).addHours(12), new Date(2012, 2, 1, 10, 15, 42), 'Date#addHours | 12');
  dateEquals(new Date(d).addDays(12), new Date(2012, 2, 12, 22, 15, 42), 'Date#addDays | 12');
  dateEquals(new Date(d).addWeeks(12), new Date(2012, 4, 23, 22, 15, 42), 'Date#addWeeks | 12');
  dateEquals(new Date(d).addMonths(12), new Date(2013, 2, 1, 22, 15, 42), 'Date#addMonths | 12');
  dateEquals(new Date(d).addYears(12), new Date(2024, 1, 29, 22, 15, 42), 'Date#addYears | 12');


  dateEquals(new Date(d).addMilliseconds(-12), new Date(2012, 1, 29, 22, 15, 41, 988), 'Date#addMilliseconds | negative | 12');
  dateEquals(new Date(d).addSeconds(-12), new Date(2012, 1, 29, 22, 15, 30), 'Date#addSeconds | negative | 12');
  dateEquals(new Date(d).addMinutes(-12), new Date(2012, 1, 29, 22, 3, 42), 'Date#addMinutes | negative | 12');
  dateEquals(new Date(d).addHours(-12), new Date(2012, 1, 29, 10, 15, 42), 'Date#addHours | negative | 12');
  dateEquals(new Date(d).addDays(-12), new Date(2012, 1, 17, 22, 15, 42), 'Date#addDays | negative | 12');
  dateEquals(new Date(d).addWeeks(-12), new Date(2011, 11, 7, 22, 15, 42), 'Date#addWeeks | negative | 12');
  dateEquals(new Date(d).addMonths(-12), new Date(2011, 2, 1, 22, 15, 42), 'Date#addMonths | negative | 12');
  dateEquals(new Date(d).addYears(-12), new Date(2000, 1, 29, 22, 15, 42), 'Date#addYears | negative | 12');


  d = new Date('February 29, 2012 22:15:42');

  dUTC = new Date(d.getTime() + (d.getTimezoneOffset() * 60 * 1000));

  dateEquals(d.utc(), dUTC, 'Date#utc');




  d = new Date('February 29, 2012 22:15:42');

  dateEquals(d.resetTime(), new Date(2012, 1, 29), 'Date#resetTime | Clears time');


  equals(now.isYesterday(), false, 'Date#isYesterday');
  equals(now.isToday(), true, 'Date#isToday');
  equals(now.isTomorrow(), false, 'Date#isTomorrow');
  equals(now.isWeekday(), now.getDay() !== 0 && now.getDay() !== 6, 'Date#isWeekday');
  equals(now.isWeekend(), now.getDay() === 0 || now.getDay() === 6, 'Date#isWeekend');
  equals(now.isFuture(), false, 'Date#isFuture');
  equals(now.isPast(), true, 'Date#isPast');


  d = new Date('February 29, 2008 22:15:42');

  equals(d.isYesterday(), false, 'Date#isYesterday | February 29, 2008');
  equals(d.isToday(), false, 'Date#isToday | February 29, 2008');
  equals(d.isTomorrow(), false, 'Date#isTomorrow | February 29, 2008');
  equals(d.isWeekday(), true, 'Date#isWeekday | February 29, 2008');
  equals(d.isWeekend(), false, 'Date#isWeekend | February 29, 2008');
  equals(d.isFuture(), false, 'Date#isFuture | February 29, 2008');
  equals(d.isPast(), true, 'Date#isPast | February 29, 2008');


  d.setFullYear(thisYear + 2);

  equals(d.isYesterday(), false, 'Date#isYesterday | 2 years from now');
  equals(d.isToday(), false, 'Date#isToday | 2 years from now');
  equals(d.isTomorrow(), false, 'Date#isTomorrow | 2 years from now');
  equals(d.isWeekday(), true, 'Date#isWeekday | 2 years from now');
  equals(d.isWeekend(), false, 'Date#isWeekend | 2 years from now');
  equals(d.isFuture(), true, 'Date#isFuture | 2 years from now');
  equals(d.isPast(), false, 'Date#isPast | 2 years from now');




  equals(new Date().isLastWeek(), false, 'Date#isLastWeek | now');
  equals(new Date().isThisWeek(), true, 'Date#isThisWeek | now');
  equals(new Date().isNextWeek(), false, 'Date#isNextWeek | now');
  equals(new Date().isLastMonth(), false, 'Date#isLastMonth | now');
  equals(new Date().isThisMonth(), true, 'Date#isThisMonth | now');
  equals(new Date().isNextMonth(), false, 'Date#isNextMonth | now');
  equals(new Date().isLastYear(), false, 'Date#isLastYear | now');
  equals(new Date().isThisYear(), true, 'Date#isThisYear | now');
  equals(new Date().isNextYear(), false, 'Date#isNextYear | now');

  equals(getRelativeDate(null, null, -7).isLastWeek(), true, 'Date#isLastWeek | last week');
  equals(getRelativeDate(null, null, -7).isThisWeek(), false, 'Date#isThisWeek | last week');
  equals(getRelativeDate(null, null, -7).isNextWeek(), false, 'Date#isNextWeek | last week');
  equals(getRelativeDate(null, null, -7).isLastMonth(), false, 'Date#isLastMonth | last week');
  equals(getRelativeDate(null, null, -7).isThisMonth(), true, 'Date#isThisMonth | last week');
  equals(getRelativeDate(null, null, -7).isNextMonth(), false, 'Date#isNextMonth | last week');
  equals(getRelativeDate(null, null, -7).isLastYear(), false, 'Date#isLastYear | last week');
  equals(getRelativeDate(null, null, -7).isThisYear(), true, 'Date#isThisYear | last week');
  equals(getRelativeDate(null, null, -7).isNextYear(), false, 'Date#isNextYear | last week');

  equals(getRelativeDate(null, null, 7).isLastWeek(), false, 'Date#isLastWeek | next week');
  equals(getRelativeDate(null, null, 7).isThisWeek(), false, 'Date#isThisWeek | next week');
  equals(getRelativeDate(null, null, 7).isNextWeek(), true, 'Date#isNextWeek | next week');
  equals(getRelativeDate(null, null, 7).isLastMonth(), false, 'Date#isLastMonth | next week');
  equals(getRelativeDate(null, null, 7).isThisMonth(), true, 'Date#isThisMonth | next week');
  equals(getRelativeDate(null, null, 7).isNextMonth(), false, 'Date#isNextMonth | next week');
  equals(getRelativeDate(null, null, 7).isLastYear(), false, 'Date#isLastYear | next week');
  equals(getRelativeDate(null, null, 7).isThisYear(), true, 'Date#isThisYear | next week');
  equals(getRelativeDate(null, null, 7).isNextYear(), false, 'Date#isNextYear | next week');

  equals(getDateWithWeekdayAndOffset(0).isLastWeek(), false, 'Date#isLastWeek | this week sunday');
  equals(getDateWithWeekdayAndOffset(0).isThisWeek(), true, 'Date#isThisWeek | this week sunday');
  equals(getDateWithWeekdayAndOffset(0).isNextWeek(), false, 'Date#isNextWeek | this week sunday');

  equals(getDateWithWeekdayAndOffset(6).isLastWeek(), false, 'Date#isLastWeek | this week friday');
  equals(getDateWithWeekdayAndOffset(6).isThisWeek(), true, 'Date#isThisWeek | this week friday');
  equals(getDateWithWeekdayAndOffset(6).isNextWeek(), false, 'Date#isNextWeek | this week friday');

  equals(Date.create('last sunday').isLastWeek(), true, 'Date#isLastWeek | last sunday');
  equals(Date.create('last sunday').isThisWeek(), false, 'Date#isThisWeek | last sunday');
  equals(Date.create('last sunday').isNextWeek(), false, 'Date#isNextWeek | last sunday');

  equals(Date.create('next sunday').isLastWeek(), false, 'Date#isLastWeek | next sunday');
  equals(Date.create('next sunday').isThisWeek(), false, 'Date#isThisWeek | next sunday');
  equals(Date.create('next sunday').isNextWeek(), true, 'Date#isNextWeek | next sunday');

  equals(Date.create('last monday').isLastWeek(), true, 'Date#isLastWeek | last monday');
  equals(Date.create('last monday').isThisWeek(), false, 'Date#isThisWeek | last monday');
  equals(Date.create('last monday').isNextWeek(), false, 'Date#isNextWeek | last monday');

  equals(Date.create('next monday').isLastWeek(), false, 'Date#isLastWeek | next monday');
  equals(Date.create('next monday').isThisWeek(), false, 'Date#isThisWeek | next monday');
  equals(Date.create('next monday').isNextWeek(), true, 'Date#isNextWeek | next monday');

  equals(Date.create('last friday').isLastWeek(), true, 'Date#isLastWeek | last friday');
  equals(Date.create('last friday').isThisWeek(), false, 'Date#isThisWeek | last friday');
  equals(Date.create('last friday').isNextWeek(), false, 'Date#isNextWeek | last friday');

  equals(Date.create('next friday').isLastWeek(), false, 'Date#isLastWeek | next friday');
  equals(Date.create('next friday').isThisWeek(), false, 'Date#isThisWeek | next friday');
  equals(Date.create('next friday').isNextWeek(), true, 'Date#isNextWeek | next friday');

  equals(Date.create('last saturday').isLastWeek(), true, 'Date#isLastWeek | last saturday');
  equals(Date.create('last saturday').isThisWeek(), false, 'Date#isThisWeek | last saturday');
  equals(Date.create('last saturday').isNextWeek(), false, 'Date#isNextWeek | last saturday');

  equals(Date.create('next saturday').isLastWeek(), false, 'Date#isLastWeek | next saturday');
  equals(Date.create('next saturday').isThisWeek(), false, 'Date#isThisWeek | next saturday');
  equals(Date.create('next saturday').isNextWeek(), true, 'Date#isNextWeek | next saturday');

  equals(Date.create('the beginning of the week').isLastWeek(), false, 'Date#isLastWeek | the beginning of the week');
  equals(Date.create('the beginning of the week').isThisWeek(), true, 'Date#isThisWeek | the beginning of the week');
  equals(Date.create('the beginning of the week').isNextWeek(), false, 'Date#isNextWeek | the beginning of the week');

  equals(Date.create('the beginning of the week').addMinutes(-1).isLastWeek(), true, 'Date#isLastWeek | the beginning of the week - 1 minute');
  equals(Date.create('the beginning of the week').addMinutes(-1).isThisWeek(), false, 'Date#isThisWeek | the beginning of the week - 1 minute');
  equals(Date.create('the beginning of the week').addMinutes(-1).isNextWeek(), false, 'Date#isNextWeek | the beginning of the week - 1 minute');

  equals(Date.create('the end of the week').isLastWeek(), false, 'Date#isLastWeek | the end of the week');
  equals(Date.create('the end of the week').isThisWeek(), true, 'Date#isThisWeek | the end of the week');
  equals(Date.create('the end of the week').isNextWeek(), false, 'Date#isNextWeek | the end of the week');

  equals(Date.create('the end of the week').addMinutes(1).isLastWeek(), false, 'Date#isLastWeek | the end of the week + 1 minute');
  equals(Date.create('the end of the week').addMinutes(1).isThisWeek(), false, 'Date#isThisWeek | the end of the week + 1 minute');
  equals(Date.create('the end of the week').addMinutes(1).isNextWeek(), true, 'Date#isNextWeek | the end of the week + 1 minute');


  equals(Date.create('the beginning of last week').isLastWeek(), true, 'Date#isLastWeek | the beginning of last week');
  equals(Date.create('the beginning of last week').isThisWeek(), false, 'Date#isThisWeek | the beginning of last week');
  equals(Date.create('the beginning of last week').isNextWeek(), false, 'Date#isNextWeek | the beginning of last week');

  equals(Date.create('the beginning of last week').addMinutes(-1).isLastWeek(), false, 'Date#isLastWeek | the beginning of last week - 1 minute');
  equals(Date.create('the beginning of last week').addMinutes(-1).isThisWeek(), false, 'Date#isThisWeek | the beginning of last week - 1 minute');
  equals(Date.create('the beginning of last week').addMinutes(-1).isNextWeek(), false, 'Date#isNextWeek | the beginning of last week - 1 minute');

  equals(Date.create('the end of next week').isLastWeek(), false, 'Date#isLastWeek | the end of next week');
  equals(Date.create('the end of next week').isThisWeek(), false, 'Date#isThisWeek | the end of next week');
  equals(Date.create('the end of next week').isNextWeek(), true, 'Date#isNextWeek | the end of next week');

  equals(Date.create('the end of next week').addMinutes(1).isLastWeek(), false, 'Date#isLastWeek | the end of next week + 1 minute');
  equals(Date.create('the end of next week').addMinutes(1).isThisWeek(), false, 'Date#isThisWeek | the end of next week + 1 minute');
  equals(Date.create('the end of next week').addMinutes(1).isNextWeek(), false, 'Date#isNextWeek | the end of next week + 1 minute');

  equals(Date.create('the end of last week').isLastWeek(), true, 'Date#isLastWeek | the end of last week');
  equals(Date.create('the end of last week').isThisWeek(), false, 'Date#isThisWeek | the end of last week');
  equals(Date.create('the end of last week').isNextWeek(), false, 'Date#isNextWeek | the end of last week');

  equals(Date.create('the end of last week').addMinutes(1).isLastWeek(), false, 'Date#isLastWeek | the end of last week + 1 minute');
  equals(Date.create('the end of last week').addMinutes(1).isThisWeek(), true, 'Date#isThisWeek | the end of last week + 1 minute');
  equals(Date.create('the end of last week').addMinutes(1).isNextWeek(), false, 'Date#isNextWeek | the end of last week + 1 minute');

  equals(Date.create('the beginning of next week').isLastWeek(), false, 'Date#isLastWeek | the beginning of next week');
  equals(Date.create('the beginning of next week').isThisWeek(), false, 'Date#isThisWeek | the beginning of next week');
  equals(Date.create('the beginning of next week').isNextWeek(), true, 'Date#isNextWeek | the beginning of next week');

  equals(Date.create('the beginning of next week').addMinutes(-1).isLastWeek(), false, 'Date#isLastWeek | the beginning of next week - 1 minute');
  equals(Date.create('the beginning of next week').addMinutes(-1).isThisWeek(), true, 'Date#isThisWeek | the beginning of next week - 1 minute');
  equals(Date.create('the beginning of next week').addMinutes(-1).isNextWeek(), false, 'Date#isNextWeek | the beginning of next week - 1 minute');




  equals(new Date(2001, 11, 28).isSunday(), false, 'Date#isSunday');
  equals(new Date(2001, 11, 28).isMonday(), false, 'Date#isMonday');
  equals(new Date(2001, 11, 28).isTuesday(), false, 'Date#isTuesday');
  equals(new Date(2001, 11, 28).isWednesday(), false, 'Date#isWednesday');
  equals(new Date(2001, 11, 28).isThursday(), false, 'Date#isThursday');
  equals(new Date(2001, 11, 28).isFriday(), true, 'Date#isFriday');
  equals(new Date(2001, 11, 28).isSaturday(), false, 'Date#isSaturday');

  equals(new Date(2001, 11, 28).isJanuary(), false, 'Date#isJanuary');
  equals(new Date(2001, 11, 28).isFebruary(), false, 'Date#isFebruary');
  equals(new Date(2001, 11, 28).isMarch(), false, 'Date#isMarch');
  equals(new Date(2001, 11, 28).isApril(), false, 'Date#isApril');
  equals(new Date(2001, 11, 28).isMay(), false, 'Date#isMay');
  equals(new Date(2001, 11, 28).isJune(), false, 'Date#isJune');
  equals(new Date(2001, 11, 28).isJuly(), false, 'Date#isJuly');
  equals(new Date(2001, 11, 28).isAugust(), false, 'Date#isAugust');
  equals(new Date(2001, 11, 28).isSeptember(), false, 'Date#isSeptember');
  equals(new Date(2001, 11, 28).isOctober(), false, 'Date#isOctober');
  equals(new Date(2001, 11, 28).isNovember(), false, 'Date#isNovember');
  equals(new Date(2001, 11, 28).isDecember(), true, 'Date#isDecember');




  equals(getRelativeDate(null, -1).isLastWeek(), false, 'Date#isLastWeek | last month');
  equals(getRelativeDate(null, -1).isThisWeek(), false, 'Date#isThisWeek | last month');
  equals(getRelativeDate(null, -1).isNextWeek(), false, 'Date#isNextWeek | last month');
  equals(getRelativeDate(null, -1).isLastMonth(), true, 'Date#isLastMonth | last month');
  equals(getRelativeDate(null, -1).isThisMonth(), false, 'Date#isThisMonth | last month');
  equals(getRelativeDate(null, -1).isNextMonth(), false, 'Date#isNextMonth | last month');

  equals(getRelativeDate(null, 1).isLastWeek(), false, 'Date#isLastWeek | next month');
  equals(getRelativeDate(null, 1).isThisWeek(), false, 'Date#isThisWeek | next month');
  equals(getRelativeDate(null, 1).isNextWeek(), false, 'Date#isNextWeek | next month');
  equals(getRelativeDate(null, 1).isLastMonth(), false, 'Date#isLastMonth | next month');
  equals(getRelativeDate(null, 1).isThisMonth(), false, 'Date#isThisMonth | next month');
  equals(getRelativeDate(null, 1).isNextMonth(), true, 'Date#isNextMonth | next month');


  equals(getRelativeDate(-1).isLastWeek(), false, 'Date#isLastWeek | last year');
  equals(getRelativeDate(-1).isThisWeek(), false, 'Date#isThisWeek | last year');
  equals(getRelativeDate(-1).isNextWeek(), false, 'Date#isNextWeek | last year');
  equals(getRelativeDate(-1).isLastMonth(), false, 'Date#isLastMonth | last year');
  equals(getRelativeDate(-1).isThisMonth(), false, 'Date#isThisMonth | last year');
  equals(getRelativeDate(-1).isNextMonth(), false, 'Date#isNextMonth | last year');
  equals(getRelativeDate(-1).isLastYear(), true, 'Date#isLastYear | last year');
  equals(getRelativeDate(-1).isThisYear(), false, 'Date#isThisYear | last year');
  equals(getRelativeDate(-1).isNextYear(), false, 'Date#isNextYear | last year');

  equals(getRelativeDate(1).isLastWeek(), false, 'Date#isLastWeek | next year');
  equals(getRelativeDate(1).isThisWeek(), false, 'Date#isThisWeek | next year');
  equals(getRelativeDate(1).isNextWeek(), false, 'Date#isNextWeek | next year');
  equals(getRelativeDate(1).isLastMonth(), false, 'Date#isLastMonth | next year');
  equals(getRelativeDate(1).isThisMonth(), false, 'Date#isThisMonth | next year');
  equals(getRelativeDate(1).isNextMonth(), false, 'Date#isNextMonth | next year');
  equals(getRelativeDate(1).isLastYear(), false, 'Date#isLastYear | next year');
  equals(getRelativeDate(1).isThisYear(), false, 'Date#isThisYear | next year');
  equals(getRelativeDate(1).isNextYear(), true, 'Date#isNextYear | next year');



  equals(new Date(2001,1,23).isAfter(new Date(2000,1,23)), true, 'Date#isAfter | January 23, 2000');
  equals(new Date(2001,1,23).isAfter(new Date(2002,1,23)), false, 'Date#isAfter | January 23, 2002');

  equals(new Date(1999,0).isAfter(new Date(1998)), true, 'Date#isAfter | 1999');
  equals(new Date(1998,2).isAfter(new Date(1998,1)), true, 'Date#isAfter | March, 1998');
  equals(new Date(1998,1,24).isAfter(new Date(1998,1,23)), true, 'Date#isAfter | February 24, 1998');
  equals(new Date(1998,1,23,12).isAfter(new Date(1998,1,23,11)), true, 'Date#isAfter | February 23, 1998 12pm');
  equals(new Date(1998,1,23,11,55).isAfter(new Date(1998,1,23,11,54)), true, 'Date#isAfter | February 23, 1998 11:55am');
  equals(new Date(1998,1,23,11,54,33).isAfter(new Date(1998,1,23,11,54,32)), true, 'Date#isAfter | February 23, 1998 11:54:33am');
  equals(new Date(1998,1,23,11,54,32,455).isAfter(new Date(1998,1,23,11,54,32,454)), true, 'Date#isAfter | February 23, 1998 11:54:32.455am');

  equals(new Date(1999,1).isAfter({ year: 1998 }), true, 'Date#isAfter | object | 1999');
  equals(new Date(1998,2).isAfter({ year: 1998, month: 1 }), true, 'Date#isAfter | object | March, 1998');
  equals(new Date(1998,1,24).isAfter({ year: 1998, month: 1, day: 23 }), true, 'Date#isAfter | object | February 24, 1998');
  equals(new Date(1998,1,23,12).isAfter({ year: 1998, month: 1, day: 23, hour: 11 }), true, 'Date#isAfter | object | February 23, 1998 12pm');
  equals(new Date(1998,1,23,11,55).isAfter({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }), true, 'Date#isAfter | object | February 23, 1998 11:55am');
  equals(new Date(1998,1,23,11,54,33).isAfter({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }), true, 'Date#isAfter | object | February 23, 1998 11:54:33am');
  equals(new Date(1998,1,23,11,54,32,455).isAfter({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }), true, 'Date#isAfter | object | February 23, 1998 11:54:32.455am');

  equals(new Date(1999,1).isAfter('1998'), true, 'Date#isAfter | string | 1998');
  equals(new Date(1998,2).isAfter('February, 1998'), true, 'Date#isAfter | string | February, 1998');
  equals(new Date(1998,1,24).isAfter('February 23, 1998'), true, 'Date#isAfter | string | February 23, 1998');
  equals(new Date(1998,1,23,12).isAfter('February 23, 1998 11am'), true, 'Date#isAfter | string | February 23, 1998 11pm');
  equals(new Date(1998,1,23,11,55).isAfter('February 23, 1998 11:54am'), true, 'Date#isAfter | string | February 23, 1998 11:54am');
  equals(new Date(1998,1,23,11,54,33).isAfter('February 23, 1998 11:54:32am'), true, 'Date#isAfter | string | February 23, 1998 11:54:32am');
  equals(new Date(1998,1,23,11,54,32,455).isAfter('February 23, 1998 11:54:32.454am'), true, 'Date#isAfter | string | February 23, 1998 11:54:32.454am');

  equals(new Date(1999,5).isAfter('1999'), false, 'Date#isAfter | June 1999 is not after 1999 in general');
  equals(getRelativeDate(1).isAfter('tomorrow'), true, 'Date#isAfter | relative | next year');
  equals(getRelativeDate(null, 1).isAfter('tomorrow'), true, 'Date#isAfter | relative | next month');
  equals(getRelativeDate(null, null, 1).isAfter('tomorrow'), false, 'Date#isAfter | relative | tomorrow');

  equals(getDateWithWeekdayAndOffset(0).isAfter('monday'), false, 'Date#isAfter | relative | sunday');
  equals(getDateWithWeekdayAndOffset(2).isAfter('monday'), true, 'Date#isAfter | relative | tuesday');
  equals(getDateWithWeekdayAndOffset(0,7).isAfter('monday'), true, 'Date#isAfter | relative | next week sunday');
  equals(getDateWithWeekdayAndOffset(0,-7).isAfter('monday'), false, 'Date#isAfter | relative | last week sunday');
  equals(getDateWithWeekdayAndOffset(0).isAfter('the beginning of this week'), false, 'Date#isAfter | relative | the beginning of this week');
  equals(getDateWithWeekdayAndOffset(0).isAfter('the beginning of last week'), true, 'Date#isAfter | relative | the beginning of last week');
  equals(getDateWithWeekdayAndOffset(0).isAfter('the end of this week'), false, 'Date#isAfter | relative | the end of this week');

  equals(new Date(2001,1,23).isAfter(new Date(2000,1,24), 24 * 60 * 60 * 1000), true, 'Date#isAfter | buffers work');
  equals(new Date(1999,1).isAfter({ year: 1999 }), false, 'Date#isAfter | February 1999 should not be after 1999 in general');



  equals(new Date(2001,1,23).isBefore(new Date(2000,1,23)), false, 'Date#isBefore | January 23, 2000');
  equals(new Date(2001,1,23).isBefore(new Date(2002,1,23)), true, 'Date#isBefore | January 23, 2002');

  equals(new Date(1999,0).isBefore(new Date(1998)), false, 'Date#isBefore | 1999');
  equals(new Date(1998,2).isBefore(new Date(1998,1)), false, 'Date#isBefore | March, 1998');
  equals(new Date(1998,1,24).isBefore(new Date(1998,1,23)), false, 'Date#isBefore | February 24, 1998');
  equals(new Date(1998,1,23,12).isBefore(new Date(1998,1,23,11)), false, 'Date#isBefore | February 23, 1998 12pm');
  equals(new Date(1998,1,23,11,55).isBefore(new Date(1998,1,23,11,54)), false, 'Date#isBefore | February 23, 1998 11:55am');
  equals(new Date(1998,1,23,11,54,33).isBefore(new Date(1998,1,23,11,54,34)), true, 'Date#isBefore | February 23, 1998 11:54:34am');
  equals(new Date(1998,1,23,11,54,32,455).isBefore(new Date(1998,1,23,11,54,32,454)), false, 'Date#isBefore | February 23, 1998 11:54:32.455am');

  equals(new Date(1999,1).isBefore({ year: 1998 }), false, 'Date#isBefore | object | 1999');
  equals(new Date(1998,2).isBefore({ year: 1998, month: 1 }), false, 'Date#isBefore | object | March, 1998');
  equals(new Date(1998,1,24).isBefore({ year: 1998, month: 1, day: 23 }), false, 'Date#isBefore | object | February 24, 1998');
  equals(new Date(1998,1,23,12).isBefore({ year: 1998, month: 1, day: 23, hour: 11 }), false, 'Date#isBefore | object | February 23, 1998 12pm');
  equals(new Date(1998,1,23,11,55).isBefore({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }), false, 'Date#isBefore | object | February 23, 1998 11:55am');
  equals(new Date(1998,1,23,11,54,33).isBefore({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }), false, 'Date#isBefore | object | February 23, 1998 11:54:33am');
  equals(new Date(1998,1,23,11,54,32,455).isBefore({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }), false, 'Date#isBefore | object | February 23, 1998 11:54:32.455am');

  equals(new Date(1997,11,31,23,59,59,999).isBefore({ year: 1998 }), true, 'Date#isBefore | object | 1999');
  equals(new Date(1998,0).isBefore({ year: 1998, month: 1 }), true, 'Date#isBefore | object | March, 1998');
  equals(new Date(1998,1,22).isBefore({ year: 1998, month: 1, day: 23 }), true, 'Date#isBefore | object | February 24, 1998');
  equals(new Date(1998,1,23,10).isBefore({ year: 1998, month: 1, day: 23, hour: 11 }), true, 'Date#isBefore | object | February 23, 1998 12pm');
  equals(new Date(1998,1,23,11,53).isBefore({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }), true, 'Date#isBefore | object | February 23, 1998 11:55am');
  equals(new Date(1998,1,23,11,54,31).isBefore({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }), true, 'Date#isBefore | object | February 23, 1998 11:54:33am');
  equals(new Date(1998,1,23,11,54,32,453).isBefore({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }), true, 'Date#isBefore | object | February 23, 1998 11:54:32.455am');

  equals(new Date(1999,1).isBefore('1998'), false, 'Date#isBefore | string | 1998');
  equals(new Date(1998,2).isBefore('February, 1998'), false, 'Date#isBefore | string | February, 1998');
  equals(new Date(1998,1,24).isBefore('February 23, 1998'), false, 'Date#isBefore | string | February 23, 1998');
  equals(new Date(1998,1,23,12).isBefore('February 23, 1998 11am'), false, 'Date#isBefore | string | February 23, 1998 11pm');
  equals(new Date(1998,1,23,11,55).isBefore('February 23, 1998 11:54am'), false, 'Date#isBefore | string | February 23, 1998 11:54am');
  equals(new Date(1998,1,23,11,54,33).isBefore('February 23, 1998 11:54:32am'), false, 'Date#isBefore | string | February 23, 1998 11:54:32am');
  equals(new Date(1998,1,23,11,54,32,455).isBefore('February 23, 1998 11:54:32.454am'), false, 'Date#isBefore | string | February 23, 1998 11:54:32.454am');

  equals(new Date(1999,5).isBefore('1999'), false, 'Date#isBefore | June 1999 is not after 1999 in general');
  equals(getRelativeDate(1).isBefore('tomorrow'), false, 'Date#isBefore | relative | next year');
  equals(getRelativeDate(null, 1).isBefore('tomorrow'), false, 'Date#isBefore | relative | next month');
  equals(getRelativeDate(null, null, 1).isBefore('tomorrow'), false, 'Date#isBefore | relative | tomorrow');

  equals(getDateWithWeekdayAndOffset(0).isBefore('monday'), true, 'Date#isBefore | relative | sunday');
  equals(getDateWithWeekdayAndOffset(2).isBefore('monday'), false, 'Date#isBefore | relative | tuesday');
  equals(getDateWithWeekdayAndOffset(0,7).isBefore('monday'), false, 'Date#isBefore | relative | next week sunday');
  equals(getDateWithWeekdayAndOffset(0,-7).isBefore('monday'), true, 'Date#isBefore | relative | last week sunday');
  equals(getDateWithWeekdayAndOffset(0).isBefore('the beginning of this week'), false, 'Date#isBefore | relative | the beginning of this week');
  equals(getDateWithWeekdayAndOffset(0).isBefore('the beginning of last week'), false, 'Date#isBefore | relative | the beginning of last week');
  equals(getDateWithWeekdayAndOffset(0).isBefore('the end of this week'), true, 'Date#isBefore | relative | the end of this week');

  equals(new Date(2001,1,25).isBefore(new Date(2001,1,24), 48 * 60 * 60 * 1000), true, 'Date#isBefore | buffers work');






  equals(new Date(2001,1,23).isBetween(new Date(2000,1,23), new Date(2002,1,23)), true, 'Date#isBetween | January 23, 2001 is between January 23, 2000 and January 23, 2002');
  equals(new Date(2001,1,23).isBetween(new Date(2002,1,23), new Date(2000,1,23)), true, 'Date#isBetween | January 23, 2001 is between January 23, 2002 and January 23, 2000');
  equals(new Date(1999,1,23).isBetween(new Date(2002,1,23), new Date(2000,1,23)), false, 'Date#isBetween | January 23, 1999 is between January 23, 2002 and January 23, 2000');
  equals(new Date(2003,1,23).isBetween(new Date(2002,1,23), new Date(2000,1,23)), false, 'Date#isBetween | January 23, 2003 is between January 23, 2002 and January 23, 2000');

  equals(new Date(1998,2).isBetween(new Date(1998,1), new Date(1998, 3)), true, 'Date#isBetween | February, 1998 - April, 1998');
  equals(new Date(1998,2).isBetween(new Date(1998,1), new Date(1998, 0)), false, 'Date#isBetween | February, 1998 - January, 1998');
  equals(new Date(1998,2).isBetween(new Date(1998,5), new Date(1998, 3)), false, 'Date#isBetween | June, 1998 - April, 1998');

  equals(new Date(1998,1,23,11,54,32,455).isBetween(new Date(1998,1,23,11,54,32,454), new Date(1998,1,23,11,54,32,456)), true, 'Date#isBetween | February 23, 1998 11:54:32.454am - February 23, 1998 11:54:32:456am');
  equals(new Date(1998,1,23,11,54,32,455).isBetween(new Date(1998,1,23,11,54,32,456), new Date(1998,1,23,11,54,32,454)), true, 'Date#isBetween | February 23, 1998 11:54:32.456am - February 23, 1998 11:54:32:454am');
  equals(new Date(1998,1,23,11,54,32,455).isBetween(new Date(1998,1,23,11,54,32,454), new Date(1998,1,23,11,54,32,452)), false, 'Date#isBetween | February 23, 1998 11:54:32.454am - February 23, 1998 11:54:32:452am');
  equals(new Date(1998,1,23,11,54,32,455).isBetween(new Date(1998,1,23,11,54,32,456), new Date(1998,1,23,11,54,32,458)), false, 'Date#isBetween | February 23, 1998 11:54:32.456am - February 23, 1998 11:54:32:458am');

  equals(new Date(1999,1).isBetween({ year: 1998 }, { year: 1999 }), true, 'Date#isBetween | object | 1998 - 1999');
  equals(new Date(1999,1).isBetween({ year: 1998 }, { year: 1997 }), false, 'Date#isBetween | object | 1998 - 1997');
  equals(new Date(1998,2).isBetween({ year: 1998, month: 1 }, { year: 1998, month: 3 }), true, 'Date#isBetween | object | March, 1998 is between February, 1998 and April, 1998');
  equals(new Date(1998,2).isBetween({ year: 1998, month: 0 }, { year: 1998, month: 1 }), false, 'Date#isBetween | object | March, 1998 is between January, 1998 and February, 1998');

  equals(new Date(1999,1).isBetween('1998', '1999'), true, 'Date#isBetween | string | 1998 - 1999');
  equals(new Date(1999,1).isBetween('1998', '1997'), false, 'Date#isBetween | string | 1998 - 1997');
  equals(new Date(1998,2).isBetween('February, 1998', 'April, 1998'), true, 'Date#isBetween | string | March, 1998 is between February, 1998 and April, 1998');
  equals(new Date(1998,2).isBetween('January, 1998', 'February, 1998'), false, 'Date#isBetween | string | January, 1998 is between February, 1998 and April, 1998');

  equals(new Date(1999,5).isBetween('1998','1999'), true, 'Date#isBetween | Any ambiguous period "reaches" as much as it can.');
  equals(new Date().isBetween('yesterday','tomorrow'), true, 'Date#isBetween | relative | now is between today and tomorrow');
  equals(getRelativeDate(1).isBetween('yesterday','tomorrow'), false, 'Date#isBetween | relative | last year is between today and tomorrow');
  equals(getRelativeDate(null, 1).isBetween('yesterday','tomorrow'), false, 'Date#isBetween | relative | last month is between today and tomorrow');
  equals(getRelativeDate(null, null, 1).isBetween('today','tomorrow'), true, 'Date#isBetween | relative | tomorrow is between today and tomorrow');

  equals(getDateWithWeekdayAndOffset(0).isBetween('monday', 'friday'), false, 'Date#isBetween | relative | sunday is between monday and friday');
  equals(getDateWithWeekdayAndOffset(2).isBetween('monday', 'friday'), true, 'Date#isBetween | relative | tuesday is between monday and friday');
  equals(getDateWithWeekdayAndOffset(0,7).isBetween('monday', 'friday'), false, 'Date#isBetween | relative | next week sunday is between monday and friday');
  equals(getDateWithWeekdayAndOffset(0,-7).isBetween('monday', 'friday'), false, 'Date#isBetween | relative | last week sunday is between monday and friday');
  equals(getDateWithWeekdayAndOffset(0).isBetween('the beginning of this week','the beginning of last week'), false, 'Date#isBetween | relative | sunday is between the beginning of this week and the beginning of last week');
  equals(getDateWithWeekdayAndOffset(0).isBetween('the beginning of this week','the beginning of next week'), false, 'Date#isBetween | relative | sunday is between the beginning of this week and the beginning of next week');
  equals(getDateWithWeekdayAndOffset(0).isBetween('the beginning of last week','the beginning of next week'), true, 'Date#isBetween | relative | sunday is between the beginning of last week and the beginning of next week');
  equals(getDateWithWeekdayAndOffset(0).isBetween('the beginning of last week','the end of this week'), true, 'Date#isBetween | relative | sunday is between the beginning of last week and the end of this week');








});


test('RegExp', function () {

    equals(RegExp.escape('test regexp'), 'test regexp', 'RegExp#escape');
    equals(RegExp.escape('test reg|exp'), 'test reg\\|exp', 'RegExp#escape');
    equals(RegExp.escape('hey there (budday)'), 'hey there \\(budday\\)', 'RegExp#escape');
    equals(RegExp.escape('what a day...'), 'what a day\\.\\.\\.', 'RegExp#escape');
    equals(RegExp.escape('.'), '\\.', 'RegExp#escape');
    equals(RegExp.escape('*.+[]{}()?|/'), '\\*\\.\\+\\[\\]\\{\\}\\(\\)\\?\\|\\/', 'RegExp#escape');

});

test('Object', function () {

    equals(Object.isObject({}), true, 'Object#isObject | {}');
    equals(Object.isObject(new Object({})), true, 'Object#isObject | new Object()');
    equals(Object.isObject([]), false, 'Object#isObject | []');
    equals(Object.isObject(new Array(1,2,3)), false, 'Object#isObject | new Array(1,2,3)');
    equals(Object.isObject(new RegExp()), false, 'Object#isObject | new RegExp()');
    equals(Object.isObject(new Date()), false, 'Object#isObject | new Date()');
    equals(Object.isObject(function(){}), false, 'Object#isObject | function(){}');
    equals(Object.isObject(1), false, 'Object#isObject | 1');
    equals(Object.isObject('wasabi'), false, 'Object#isObject | "wasabi"');
    equals(Object.isObject(null), false, 'Object#isObject | null');
    equals(Object.isObject(undefined), false, 'Object#isObject | undefined');
    equals(Object.isObject(NaN), false, 'Object#isObject | NaN');
    equals(Object.isObject(), false, 'Object#isObject | blank');
    equals(Object.isObject(false), false, 'Object#isObject | false');
    equals(Object.isObject(true), false, 'Object#isObject | true');

    equals(Object.isArray({}), false, 'Object#isArray | {}');
    equals(Object.isArray([]), true, 'Object#isArray | []');
    equals(Object.isArray(new Array(1,2,3)), true, 'Object#isArray | new Array(1,2,3)');
    equals(Object.isArray(new RegExp()), false, 'Object#isArray | new RegExp()');
    equals(Object.isArray(new Date()), false, 'Object#isArray | new Date()');
    equals(Object.isArray(function(){}), false, 'Object#isArray | function(){}');
    equals(Object.isArray(1), false, 'Object#isArray | 1');
    equals(Object.isArray('wasabi'), false, 'Object#isArray | "wasabi"');
    equals(Object.isArray(null), false, 'Object#isArray | null');
    equals(Object.isArray(undefined), false, 'Object#isArray | undefined');
    equals(Object.isArray(NaN), false, 'Object#isArray | NaN');
    equals(Object.isArray(), false, 'Object#isArray | blank');
    equals(Object.isArray(false), false, 'Object#isArray | false');
    equals(Object.isArray(true), false, 'Object#isArray | true');

    equals(Object.isBoolean({}), false, 'Object#isBoolean | {}');
    equals(Object.isBoolean([]), false, 'Object#isBoolean | []');
    equals(Object.isBoolean(new RegExp()), false, 'Object#isBoolean | new RegExp()');
    equals(Object.isBoolean(new Date()), false, 'Object#isBoolean | new Date()');
    equals(Object.isBoolean(function(){}), false, 'Object#isBoolean | function(){}');
    equals(Object.isBoolean(1), false, 'Object#isBoolean | 1');
    equals(Object.isBoolean('wasabi'), false, 'Object#isBoolean | "wasabi"');
    equals(Object.isBoolean(null), false, 'Object#isBoolean | null');
    equals(Object.isBoolean(undefined), false, 'Object#isBoolean | undefined');
    equals(Object.isBoolean(NaN), false, 'Object#isBoolean | NaN');
    equals(Object.isBoolean(), false, 'Object#isBoolean | blank');
    equals(Object.isBoolean(false), true, 'Object#isBoolean | false');
    equals(Object.isBoolean(true), true, 'Object#isBoolean | true');

    equals(Object.isDate({}), false, 'Object#isDate | {}');
    equals(Object.isDate([]), false, 'Object#isDate | []');
    equals(Object.isDate(new RegExp()), false, 'Object#isDate | new RegExp()');
    equals(Object.isDate(new Date()), true, 'Object#isDate | new Date()');
    equals(Object.isDate(function(){}), false, 'Object#isDate | function(){}');
    equals(Object.isDate(1), false, 'Object#isDate | 1');
    equals(Object.isDate('wasabi'), false, 'Object#isDate | "wasabi"');
    equals(Object.isDate(null), false, 'Object#isDate | null');
    equals(Object.isDate(undefined), false, 'Object#isDate | undefined');
    equals(Object.isDate(NaN), false, 'Object#isDate | NaN');
    equals(Object.isDate(), false, 'Object#isDate | blank');
    equals(Object.isDate(false), false, 'Object#isDate | false');
    equals(Object.isDate(true), false, 'Object#isDate | true');

    equals(Object.isFunction({}), false, 'Object#isFunction | {}');
    equals(Object.isFunction([]), false, 'Object#isFunction | []');
    equals(Object.isFunction(new RegExp()), false, 'Object#isFunction | new RegExp()');
    equals(Object.isFunction(new Date()), false, 'Object#isFunction | new Date()');
    equals(Object.isFunction(function(){}), true, 'Object#isFunction | function(){}');
    equals(Object.isFunction(new Function()), true, 'Object#isFunction | new Function()');
    equals(Object.isFunction(1), false, 'Object#isFunction | 1');
    equals(Object.isFunction('wasabi'), false, 'Object#isFunction | "wasabi"');
    equals(Object.isFunction(null), false, 'Object#isFunction | null');
    equals(Object.isFunction(undefined), false, 'Object#isFunction | undefined');
    equals(Object.isFunction(NaN), false, 'Object#isFunction | NaN');
    equals(Object.isFunction(), false, 'Object#isFunction | blank');
    equals(Object.isFunction(false), false, 'Object#isFunction | false');
    equals(Object.isFunction(true), false, 'Object#isFunction | true');

    equals(Object.isNumber({}), false, 'Object#isNumber | {}');
    equals(Object.isNumber([]), false, 'Object#isNumber | []');
    equals(Object.isNumber(new RegExp()), false, 'Object#isNumber | new RegExp()');
    equals(Object.isNumber(new Date()), false, 'Object#isNumber | new Date()');
    equals(Object.isNumber(function(){}), false, 'Object#isNumber | function(){}');
    equals(Object.isNumber(new Function()), false, 'Object#isNumber | new Function()');
    equals(Object.isNumber(1), true, 'Object#isNumber | 1');
    equals(Object.isNumber(0), true, 'Object#isNumber | 0');
    equals(Object.isNumber(-1), true, 'Object#isNumber | -1');
    equals(Object.isNumber(new Number('3')), true, 'Object#isNumber | new Number("3")');
    equals(Object.isNumber('wasabi'), false, 'Object#isNumber | "wasabi"');
    equals(Object.isNumber(null), false, 'Object#isNumber | null');
    equals(Object.isNumber(undefined), false, 'Object#isNumber | undefined');
    equals(Object.isNumber(NaN), true, 'Object#isNumber | NaN');
    equals(Object.isNumber(), false, 'Object#isNumber | blank');
    equals(Object.isNumber(false), false, 'Object#isNumber | false');
    equals(Object.isNumber(true), false, 'Object#isNumber | true');

    equals(Object.isString({}), false, 'Object#isString | {}');
    equals(Object.isString([]), false, 'Object#isString | []');
    equals(Object.isString(new RegExp()), false, 'Object#isString | new RegExp()');
    equals(Object.isString(new Date()), false, 'Object#isString | new Date()');
    equals(Object.isString(function(){}), false, 'Object#isString | function(){}');
    equals(Object.isString(new Function()), false, 'Object#isString | new Function()');
    equals(Object.isString(1), false, 'Object#isString | 1');
    equals(Object.isString('wasabi'), true, 'Object#isString | "wasabi"');
    equals(Object.isString(new String('wasabi')), true, 'Object#isString | new String("wasabi")');
    equals(Object.isString(null), false, 'Object#isString | null');
    equals(Object.isString(undefined), false, 'Object#isString | undefined');
    equals(Object.isString(NaN), false, 'Object#isString | NaN');
    equals(Object.isString(), false, 'Object#isString | blank');
    equals(Object.isString(false), false, 'Object#isString | false');
    equals(Object.isString(true), false, 'Object#isString | true');

    equals(Object.isRegExp({}), false, 'Object#isRegExp | {}');
    equals(Object.isRegExp([]), false, 'Object#isRegExp | []');
    equals(Object.isRegExp(new RegExp()), true, 'Object#isRegExp | new RegExp()');
    equals(Object.isRegExp(/afda/), true, 'Object#isRegExp | /afda/');
    equals(Object.isRegExp(new Date()), false, 'Object#isRegExp | new Date()');
    equals(Object.isRegExp(function(){}), false, 'Object#isRegExp | function(){}');
    equals(Object.isRegExp(new Function()), false, 'Object#isRegExp | new Function()');
    equals(Object.isRegExp(1), false, 'Object#isRegExp | 1');
    equals(Object.isRegExp('wasabi'), false, 'Object#isRegExp | "wasabi"');
    equals(Object.isRegExp(null), false, 'Object#isRegExp | null');
    equals(Object.isRegExp(undefined), false, 'Object#isRegExp | undefined');
    equals(Object.isRegExp(NaN), false, 'Object#isRegExp | NaN');
    equals(Object.isRegExp(), false, 'Object#isRegExp | blank');
    equals(Object.isRegExp(false), false, 'Object#isRegExp | false');
    equals(Object.isRegExp(true), false, 'Object#isRegExp | true');




});

/**
 * Not going to limit this to a window object for now....
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
**/

