
test('Number', function () {

  var counter;
  var ret;

  var rand = Number.random();
  equal(rand == 0 || rand == 1, true, 'Number.random | no params = 0 or 1', { mootools: false });

  rand = Number.random(10);
  equal(rand >= 0 && rand <= 10, true, 'Number.random | min not defined, max is 10', { mootools: false });
  equal(rand % 1, 0, 'Number.random | number is whole', { mootools: 'NaN' });

  rand = Number.random(536224, 536280);
 equal(rand >= 536224 && rand <= 536280, true, 'Number.random | min and max defined');

  rand = Number.random(6, -5);
  equal(rand >= -5 && rand <= 6, true, 'Number.random | min and max can be reversed');



  equal((4).toNumber(), 4, 'Number#toNumber | 4 is 4');
  equal((10000).toNumber(), 10000, 'Number#toNumber | 10000 is 10000');
  equal((5.2345).toNumber(), 5.2345, 'Number#toNumber | 5.2345 is 5.2345');



  equal((5.5).ceil(), 6, 'Number#ceil | 5.5');
  equal((5.14).ceil(), 6, 'Number#ceil | 5.14');
  equal((5).ceil(), 5, 'Number#ceil | 5');
  equal((-5.5).ceil(), -5, 'Number#ceil | -5.5');
  equal((-5.14).ceil(), -5, 'Number#ceil | -5.14');
  equal((-5).ceil(), -5, 'Number#ceil | -5');
  equal((4417.1318).ceil(0), 4418, 'Number#ceil | 0');
  equal((4417.1318).ceil(1), 4417.2, 'Number#ceil | 1', { prototype: 4418, mootools: 4418 });
  equal((4417.1318).ceil(2), 4417.14, 'Number#ceil | 2', { prototype: 4418, mootools: 4418 });
  equal((4417.1318).ceil(3), 4417.132, 'Number#ceil | 3', { prototype: 4418, mootools: 4418 });
  equal((4417.1318).ceil(-1), 4420, 'Number#ceil | -1', { prototype: 4418, mootools: 4418 });
  equal((4417.1318).ceil(-2), 4500, 'Number#ceil | -2', { prototype: 4418, mootools: 4418 });
  equal((4417.1318).ceil(-3), 5000, 'Number#ceil | -3', { prototype: 4418, mootools: 4418 });

  equal((5.5).floor(), 5, 'Number#floor | 5.5');
  equal((5.14).floor(), 5, 'Number#floor | 5.14');
  equal((5.9).floor(), 5, 'Number#floor | 5.9');
  equal((5).floor(), 5, 'Number#floor | 5');
  equal((-5.5).floor(), -6, 'Number#floor | -5.5');
  equal((-5.14).floor(), -6, 'Number#floor | -5.14');
  equal((-5).floor(), -5, 'Number#floor | -5');
  equal((4417.1318).floor(0), 4417, 'Number#floor | 0');
  equal((4417.1318).floor(1), 4417.1, 'Number#floor | 1', { prototype: 4417, mootools: 4417 });
  equal((4417.1318).floor(2), 4417.13, 'Number#floor | 2', { prototype: 4417, mootools: 4417 });
  equal((4417.1318).floor(3), 4417.131, 'Number#floor | 3', { prototype: 4417, mootools: 4417 });
  equal((4417.1318).floor(-1), 4410, 'Number#floor | -1', { prototype: 4417, mootools: 4417 });
  equal((4417.1318).floor(-2), 4400, 'Number#floor | -2', { prototype: 4417, mootools: 4417 });
  equal((4417.1318).floor(-3), 4000, 'Number#floor | -3', { prototype: 4417, mootools: 4417 });


  equal((-5).abs(), 5, 'Number#abs | -5');
  equal((5).abs(), 5, 'Number#abs | 5');
  equal((-3.324).abs(), 3.324, 'Number#abs | -3.324');
  equal((3.324).abs(), 3.324, 'Number#abs | 3.324');


  equal((3).pow(2), 9, 'Number#pow | 3 ^ 2');
  equal((3).pow(1), 3, 'Number#pow | 3 ^ 1');
  equal((12).pow(2), 144, 'Number#pow | 12 ^ 2');
  equal((3).pow(3), 27, 'Number#pow | 3 ^ 3');
  equal((3).pow(0), 1, 'Number#pow | zero is allowed');
  equal((3).pow(), 3, 'Number#pow | undefined defaults to 1', { mootools: 'NaN' });


  equal((3).round(), 3, 'Number#round | 3');
  equal((3.241).round(), 3, 'Number#round | 3.241');
  equal((3.752).round(), 4, 'Number#round | 3.752');
  equal((-3.241).round(), -3, 'Number#round | -3.241');
  equal((-3.752).round(), -4, 'Number#round | -3.752');
  equal((3.241).round(1), 3.2, 'Number#round | 3.241 to 1 place', { prototype: 3 });

  equal((3.752).round(1), 3.8, 'Number#round | 3.752 to 1 place', { prototype: 4 });
  equal((3.241).round(2), 3.24,  'Number#round | 3.241 to 2 places', { prototype: 3 });
  equal((3.752).round(2), 3.75,  'Number#round | 3.752 to 2 places', { prototype: 4 });

  equal((322855.241).round(-2), 322900, 'Number#round | 322855.241 to -2 places', { prototype: 322855 });
  equal((322855.241).round(-3), 323000, 'Number#round | 322855.241 to -3 places', { prototype: 322855 });
  equal((322855.241).round(-4), 320000, 'Number#round | 322855.241 to -4 places', { prototype: 322855 });
  equal((322855.241).round(-6), 0, 'Number#round | 322855.241 to -6 places', { prototype: 322855 });
  equal((722855.241).round(-6), 1000000, 'Number#round | 722855.241 to -6 places', { prototype: 722855 });
  equal((722855.241).round(-8), 0, 'Number#round | 722855.241 to -8 places', { prototype: 722855 });


  equal((65).chr(), 'A', 'Number#chr | 65');
  equal((24536).chr(), '忘', 'Number#chr | 24536');
  equal((20294).chr(), '但', 'Number#chr | 20294');

  counter = 0;
  var dCounter = 5;
  ret = (5).downto(1, function(i) {
    equal(i, dCounter, 'Number#downto | index is set');
    counter++;
    dCounter--;
  });
  equal(counter, 5, 'Number#downto | iterated 5 times');
  equal(ret, [5,4,3,2,1], 'Number#downto | returns array');


  counter = 0;
  var dCounter = 1;
  ret = (1).upto(5, function(i) {
    equal(i, dCounter, 'Number#upto | index is set');
    counter++;
    dCounter++;
  });
  equal(counter, 5, 'Number#upto | iterated 5 times');
  equal(ret, [1,2,3,4,5], 'Number#upto | returns array');

  counter = 0;
  ret = (5).downto(10, function() {});
  equal(counter, 0, 'Number#downto | 5 downto 10 | iterates 0 times');
  equal(ret, [], 'Number#downto | 5 downto 10 | returns empty array');

  counter = 0;
  ret = (5).upto(1, function() {});
  equal(counter, 0, 'Number#downto | 5 up to 1 | iterates 0 times');
  equal(ret, [], 'Number#downto | 5 up to 1 | returns empty array');


  counter = 0;
  (5).times(function(first) {
    equal(first, counter, 'Number#times | first parameter is the index');
    counter++;
  }, 'wasabi');
  equal(counter, 5, 'Number#times | iterated 5 times');



  equal((2).isMultipleOf(2), true, 'Number#multipleOf | 2 is a multiple of 2');
  equal((6).isMultipleOf(2), true, 'Number#multipleOf | 6 is a multiple of 2');
  equal((100).isMultipleOf(2), true, 'Number#multipleOf | 100 is a multiple of 2');
  equal((2).isMultipleOf(100), false, 'Number#multipleOf | 2 is a multiple of 100');
  equal((100).isMultipleOf(-2), true, 'Number#multipleOf | 100 is a multiple of -2');
  equal((6).isMultipleOf(-2), true, 'Number#multipleOf | 6 is a multiple of -2');
  equal((6).isMultipleOf(3), true, 'Number#multipleOf | 6 is a multiple of 3');
  equal((7).isMultipleOf(3), false, 'Number#multipleOf | 7 is a multiple of 3');
  equal((2.5).isMultipleOf(1.25), true, 'Number#multipleOf | 2.5 is a multiple of 1.25');
  equal((2).isMultipleOf('a'), false, 'Number#multipleOf | string arguments');
  equal((2).isMultipleOf(/af/), false, 'Number#multipleOf | other random arguments');
  equal((2).isMultipleOf(null), false, 'Number#multipleOf | null');
  equal((2).isMultipleOf(), false, 'Number#multipleOf | no argument passed');



  equal((1).isOdd(), true, 'Number#odd | 1');
  equal((2).isOdd(), false, 'Number#odd | 2');




  equal((1).isEven(), false, 'Number#even | 1');
  equal((2).isEven(), true, 'Number#even | 2');



  equal((1).ordinalize(), '1st', 'Number#ordinalize | 1');
  equal((2).ordinalize(), '2nd', 'Number#ordinalize | 2');
  equal((3).ordinalize(), '3rd', 'Number#ordinalize | 3');
  equal((4).ordinalize(), '4th', 'Number#ordinalize | 4');
  equal((5).ordinalize(), '5th', 'Number#ordinalize | 5');
  equal((6).ordinalize(), '6th', 'Number#ordinalize | 6');
  equal((7).ordinalize(), '7th', 'Number#ordinalize | 7');
  equal((8).ordinalize(), '8th', 'Number#ordinalize | 8');
  equal((9).ordinalize(), '9th', 'Number#ordinalize | 9');
  equal((10).ordinalize(), '10th', 'Number#ordinalize | 10');
  equal((11).ordinalize(), '11th', 'Number#ordinalize | 11');
  equal((12).ordinalize(), '12th', 'Number#ordinalize | 12');
  equal((13).ordinalize(), '13th', 'Number#ordinalize | 13');
  equal((14).ordinalize(), '14th', 'Number#ordinalize | 14');
  equal((15).ordinalize(), '15th', 'Number#ordinalize | 15');
  equal((20).ordinalize(), '20th', 'Number#ordinalize | 20');
  equal((21).ordinalize(), '21st', 'Number#ordinalize | 21');
  equal((22).ordinalize(), '22nd', 'Number#ordinalize | 22');
  equal((23).ordinalize(), '23rd', 'Number#ordinalize | 23');
  equal((24).ordinalize(), '24th', 'Number#ordinalize | 24');
  equal((25).ordinalize(), '25th', 'Number#ordinalize | 25');
  equal((100).ordinalize(), '100th', 'Number#ordinalize | 100');
  equal((101).ordinalize(), '101st', 'Number#ordinalize | 101');
  equal((102).ordinalize(), '102nd', 'Number#ordinalize | 102');
  equal((103).ordinalize(), '103rd', 'Number#ordinalize | 103');
  equal((104).ordinalize(), '104th', 'Number#ordinalize | 104');
  equal((105).ordinalize(), '105th', 'Number#ordinalize | 105');


  equal((100).format(), '100', 'Number#format | 100')
  equal((1).format(), '1', 'Number#format | 1')
  equal((10).format(), '10', 'Number#format | 10')
  equal((100).format(), '100', 'Number#format | 100')
  equal((1000).format(), '1,000', 'Number#format | 1,000')
  equal((10000).format(), '10,000', 'Number#format | 10,000')
  equal((100000).format(), '100,000', 'Number#format | 100,000')
  equal((1000000).format(), '1,000,000', 'Number#format | 1,000,000')
  equal((1000000.01).format(), '1,000,000.01', 'Number#format | 1,000,000.01')
  equal((-100).format(), '-100', 'Number#format | -100')
  equal((-1).format(), '-1', 'Number#format | -1')
  equal((-1000).format(), '-1,000', 'Number#format | -1,000')
  equal((-1000000.01).format(), '-1,000,000.01', 'Number#format | -1,000,000.01')

  equal((0.52).format(), '0.52', 'Number#format | 0.52')

  // These discrepancies are due to floating point variable limitations.
  equal((100046546510000.022435451).format().replace(/\.\d+$/, ''), '100,046,546,510,000', 'Number#format | 100,046,546,510,000')
  equal((-100046546510000.022435451).format().replace(/\.\d+$/, ''), '-100,046,546,510,000', 'Number#format | -100,046,546,510,000')

  equal((1000).format(' '), '1 000', 'Number#format | 1000')
  equal((1532587).format(' '), '1 532 587', 'Number#format | larger number')
  equal((1532587.5752).format(' ', ','), '1 532 587,5752', 'Number#format | larger number with decimal')
  equal((9999999.99).format(), '9,999,999.99', 'Number#format | Standard');
  equal((9999999.99).format('.',','), '9.999.999,99', 'Number#format | Euro style!');



  equal((1).pad(0), '1', 'Number#pad | 1 no padding')
  equal((1).pad(1), '1', 'Number#pad | 1 padded to 1 place')
  equal((1).pad(2), '01', 'Number#pad | 1 padded to 2 places')
  equal((1).pad(3), '001', 'Number#pad | 1 padded to 3 places')
  equal((1).pad(4), '0001', 'Number#pad | 1 padded to 4 places')
  equal((547).pad(0), '547', 'Number#pad | 547 no padding')
  equal((547).pad(1), '547', 'Number#pad | 547 padded to 1 place')
  equal((547).pad(2), '547', 'Number#pad | 547 padded to 2 places')
  equal((547).pad(3), '547', 'Number#pad | 547 padded to 3 places')
  equal((547).pad(4), '0547', 'Number#pad | 547 padded to 4 places')
  equal((0).pad(0), '', 'Number#pad | 0 no padding')
  equal((0).pad(1), '0', 'Number#pad | 0 padded to 1 place')
  equal((0).pad(2), '00', 'Number#pad | 0 padded to 2 places')
  equal((0).pad(3), '000', 'Number#pad | 0 padded to 3 places')
  equal((0).pad(4), '0000', 'Number#pad | 0 padded to 4 places')
  equal((-1).pad(1), '-1', 'Number#pad | -1 padded to 1 places')
  equal((-1).pad(2), '-01', 'Number#pad | -1 padded to 2 places')
  equal((-1).pad(3), '-001', 'Number#pad | -1 padded to 3 places')
  equal((-1).pad(4), '-0001', 'Number#pad | -1 padded to 4 places')
  equal((1).pad(1, true), '+1', 'Number#pad | 1 padded to 1 places and sign')
  equal((1).pad(2, true), '+01', 'Number#pad | 1 padded to 2 places and sign')
  equal((1).pad(3, true), '+001', 'Number#pad | 1 padded to 3 places and sign')
  equal((1).pad(4, true), '+0001', 'Number#pad | 1 padded to 4 places and sign')
  equal((0).pad(1, true), '+0', 'Number#pad | 0 padded to 1 place and sign')



  equal((0).hex(), '0', 'Number#hex | 0')
  equal((10).hex(), 'a', 'Number#hex | 10')
  equal((255).hex(), 'ff', 'Number#hex | 255')
  equal((0.5).hex(), '0.8', 'Number#hex | 0.5')
  equal((2.5).hex(), '2.8', 'Number#hex | 2.5')
  equal((2553423).hex(), '26f64f', 'Number#hex | 2553423')

  equal((4).milliseconds(), 4, 'Number#milliseconds | 4');
  equal((3.25).milliseconds(), 3, 'Number#milliseconds | rounded');

  equal((0).seconds(), 0, 'Number#seconds | 0');
  equal((1).seconds(), 1000, 'Number#seconds | 1');
  equal((30).seconds(), 30000, 'Number#seconds | 30');
  equal((60).seconds(), 60000, 'Number#seconds | 60');


  equal((1).minutes(), 60000, 'Number#minutes | 1');
  equal((10).minutes(), 600000, 'Number#minutes | 10');
  equal((100).minutes(), 6000000, 'Number#minutes | 100');
  equal((0).minutes(), 0, 'Number#minutes | 0');
  equal((0.5).minutes(), 30000, 'Number#minutes | 0.5');
  equal((1).minutes(), (60).seconds(), 'Number#minutes | 1 minute is 60 seconds');

  equal((1).hours(), 3600000, 'Number#hours | 1');
  equal((10).hours(), 36000000, 'Number#hours | 10');
  equal((100).hours(), 360000000, 'Number#hours | 100');
  equal((0).hours(), 0, 'Number#hours | 0');
  equal((0.5).hours(), 1800000, 'Number#hours | 0.5');
  equal((1).hours(), (60).minutes(), 'Number#hours | 1 hour is 60 minutes');
  equal((1).hours(), (3600).seconds(), 'Number#hours | 1 hour is 3600 seconds');


  equal((1).days(), 86400000, 'Number#days | 1');
  equal((10).days(), 864000000, 'Number#days | 10');
  equal((100).days(), 8640000000, 'Number#days | 100');
  equal((0).days(), 0, 'Number#days | 0');
  equal((0.5).days(), 43200000, 'Number#days | 0.5');
  equal((1).days(), (24).hours(), 'Number#days | 1 day is 24 hours');
  equal((1).days(), (1440).minutes(), 'Number#days | 1 day is 1440 minutes');
  equal((1).days(), (86400).seconds(), 'Number#days | 1 day is 86400 seconds');


  equal((1).weeks(), 604800000, 'Number#weeks | 1');
  equal((0.5).weeks(), 302400000, 'Number#weeks | 0.5');
  equal((10).weeks(), 6048000000, 'Number#weeks | 10');
  equal((0).weeks(), 0, 'Number#weeks | 0');
  equal((1).weeks(), (7).days(), 'Number#weeks | 1 week is 7 days');
  equal((1).weeks(), (24 * 7).hours(), 'Number#weeks | 1 week is 24 * 7 hours');
  equal((1).weeks(), (60 * 24 * 7).minutes(), 'Number#weeks | 1 week is 60 * 24 * 7 minutes');
  equal((1).weeks(), (60 * 60 * 24 * 7).seconds(), 'Number#weeks | 1 week is 60 * 60 * 24 * 7 seconds');

  equal((1).months(), 2629800000, 'Number#months | 1 month');
  equal((0.5).months(), 1314900000, 'Number#months | 0.5 month');
  equal((10).months(), 26298000000, 'Number#months | 10 month');
  equal((0).months(), 0, 'Number#months | 0 months');
  equal((1).months(), (30.4375).days(), 'Number#months | 1 month is 30.4375 days');
  equal((1).months(), (24 * 30.4375).hours(), 'Number#months | 1 month is 24 * 30.4375 hours');
  equal((1).months(), (60 * 24 * 30.4375).minutes(), 'Number#months | 1 month is 60 * 24 * 30.4375 minutes');
  equal((1).months(), (60 * 60 * 24 * 30.4375).seconds(), 'Number#months | 1 month is 60 * 60 * 24 * 30.4375 seconds');

  equal((1).years(), 31557600000, 'Number#years | 1');
  equal((0.5).years(), 15778800000, 'Number#years | 0.5');
  equal((10).years(), 315576000000, 'Number#years | 10');
  equal((0).years(), 0, 'Number#years | 0');
  equal((1).years(), (365.25).days(), 'Number#years | 1 year is 365.25 days');
  equal((1).years(), (24 * 365.25).hours(), 'Number#years | 1 year is 24 * 365.25 hours');
  equal((1).years(), (60 * 24 * 365.25).minutes(), 'Number#years | 1 year is 60 * 24 * 365.25 minutes');
  equal((1).years(), (60 * 60 * 24 * 365.25).seconds(), 'Number#years | 1 year is 60 * 60 * 24 * 365.25 seconds');



  /* compatibility */

  equal((1).second(), 1000, 'Number#second | 1 second');
  equal((1).minute(), 60000, 'Number#minute | 1 minute');
  equal((1).hour(), 3600000, 'Number#hour | 1 hour');
  equal((1).day(), 86400000, 'Number#day | 1 day');
  equal((1).week(), 604800000, 'Number#week | 1 week');
  equal((1).month(), 2629800000, 'Number#month | 1 month');
  equal((1).year(), 31557600000, 'Number#year | 1 year');


  dateEqual((1).secondAfter(), 1000, 'Number#secondAfter | 1');
  dateEqual((5).secondsAfter(), 5000, 'Number#secondsAfter | 5');
  dateEqual((10).minutesAfter(), 600000, 'Number#minutesAfter | 10');

  dateEqual((1).secondFromNow(), 1000, 'Number#secondFromNow | 1');
  dateEqual((5).secondsFromNow(), 5000, 'Number#secondsFromNow | 5');
  dateEqual((10).minutesFromNow(), 600000, 'Number#minutesFromNow | 10');

  dateEqual((1).secondAgo(), -1000, 'Number#secondAgo | 1');
  dateEqual((5).secondsAgo(), -5000, 'Number#secondAgo | 5');
  dateEqual((10).secondsAgo(), -10000, 'Number#secondAgo | 10');

  dateEqual((1).secondBefore(), -1000, 'Number#secondBefore | 1');
  dateEqual((5).secondsBefore(), -5000, 'Number#secondBefore | 5');
  dateEqual((10).secondsBefore(), -10000, 'Number#secondBefore | 10');


  dateEqual((5).minutesAfter((5).minutesAgo()), 0, 'Number#minutesAfter | 5 minutes after 5 minutes ago');
  dateEqual((10).minutesAfter((5).minutesAgo()), 1000 * 60 * 5, 'Number#minutesAfter | 10 minutes after 5 minutes ago');

  dateEqual((5).minutesFromNow((5).minutesAgo()), 0, 'Number#minutesFromNow | 5 minutes from now 5 minutes ago');
  dateEqual((10).minutesFromNow((5).minutesAgo()), 1000 * 60 * 5, 'Number#minutesFromNow | 10 minutes from now 5 minutes ago');

  dateEqual((5).minutesAgo((5).minutesFromNow()), 0, 'Number#minutesAgo | 5 minutes ago 5 minutes from now');
  dateEqual((10).minutesAgo((5).minutesFromNow()), -(1000 * 60 * 5), 'Number#minutesAgo | 10 minutes ago 5 minutes from now');

  dateEqual((5).minutesBefore((5).minutesFromNow()), 0, 'Number#minutesBefore | 5 minutes before 5 minutes from now');
  dateEqual((10).minutesBefore((5).minutesFromNow()), -(1000 * 60 * 5), 'Number#minutesBefore | 10 minutes before 5 minutes from now');


  var christmas = new Date('December 25, 1965');
  dateEqual((5).minutesBefore(christmas), getRelativeDate.call(christmas, null, null, null, null, -5), 'Number#minutesBefore | 5 minutes before christmas');
  dateEqual((5).minutesAfter(christmas), getRelativeDate.call(christmas, null, null, null, null, 5), 'Number#minutesAfter | 5 minutes after christmas');

  dateEqual((5).hoursBefore(christmas), getRelativeDate.call(christmas, null, null, null, -5), 'Number#hoursBefore | 5 hours before christmas');
  dateEqual((5).hoursAfter(christmas), getRelativeDate.call(christmas, null, null, null, 5), 'Number#hoursAfter | 5 hours after christmas');

  dateEqual((5).daysBefore(christmas), getRelativeDate.call(christmas, null, null, -5), 'Number#daysBefore | 5 days before christmas');
  dateEqual((5).daysAfter(christmas), getRelativeDate.call(christmas, null, null, 5), 'Number#daysAfter | 5 days after christmas');

  dateEqual((5).weeksBefore(christmas), getRelativeDate.call(christmas, null, null, -35), 'Number#weeksBefore | 5 weeks before christmas');
  dateEqual((5).weeksAfter(christmas), getRelativeDate.call(christmas, null, null, 35), 'Number#weeksAfter | 5 weeks after christmas');

  dateEqual((5).monthsBefore(christmas), getRelativeDate.call(christmas, null, -5), 'Number#monthsBefore | 5 months before christmas');
  dateEqual((5).monthsAfter(christmas), getRelativeDate.call(christmas, null, 5), 'Number#monthsAfter | 5 months after christmas');

  dateEqual((5).yearsBefore(christmas), getRelativeDate.call(christmas, -5), 'Number#yearsBefore | 5 years before christmas');
  dateEqual((5).yearsAfter(christmas), getRelativeDate.call(christmas, 5), 'Number#yearsAfter | 5 years after christmas');

  dateEqual((5).hoursBefore(1965, 11, 25), getRelativeDate.call(christmas, null, null, null, -5), 'Number#hoursBefore | accepts numbers');

  // Hooking it all up!!

  // Try this in WinXP:
  // 1. Set timezone to Damascus
  // 2. var d = new Date(1998, 3, 3, 17); d.setHours(0); d.getHours();
  // 3. hours = 23
  // 4. PROFIT $$$

  dateEqual((5).minutesBefore('April 2rd, 1998'), new Date(1998, 3, 1, 23, 55), 'Number#minutesBefore | 5 minutes before April 3rd, 1998');
  dateEqual((5).minutesAfter('January 2nd, 2005'), new Date(2005, 0, 2, 0, 5), 'Number#minutesAfter | 5 minutes after January 2nd, 2005');
  dateEqual((5).hoursBefore('the first day of 2005'), new Date(2004, 11, 31, 19), 'Number#hoursBefore | 5 hours before the first day of 2005');
  dateEqual((5).hoursAfter('the last day of 2006'), new Date(2006, 11, 31, 5), 'Number#hoursAfter | 5 hours after the last day of 2006');
  dateEqual((5).hoursAfter('the end of 2006'), new Date(2007, 0, 1, 4, 59, 59, 999), 'Number#hoursAfter | 5 hours after the end of 2006');
  dateEqual((5).daysBefore('last week monday'), getDateWithWeekdayAndOffset(1, -7).rewind({ days: 5 }), 'Number#daysBefore | 5 days before last week monday');
  dateEqual((5).daysAfter('next tuesday'), getDateWithWeekdayAndOffset(2, 7).advance({ days: 5 }), 'Number#daysAfter | 5 days after next week tuesday');
  dateEqual((5).weeksBefore('today'), getRelativeDate(null, null, -35).set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), 'Number#weeksBefore | 5 weeks before today');
  dateEqual((5).weeksAfter('now'), getRelativeDate(null, null, 35), 'Number#weeksAfter | 5 weeks after now');
  dateEqual((5).monthsBefore('today'), getRelativeDate(null, -5).set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), 'Number#monthsBefore | 5 months before today');
  dateEqual((5).monthsAfter('now'), getRelativeDate(null, 5), 'Number#monthsAfter | 5 months after now');




//  dateEqual(Date.create('Monday'), getDateWithWeekdayAndOffset(1), 'Date#create | Fuzzy Dates | Monday');
});

