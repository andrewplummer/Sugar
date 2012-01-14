
test('Number', function () {

  var counter;
  var ret;

  var rand = Number.random();
  equal(rand == 0 || rand == 1, true, 'Number.random | no params = 0 or 1', { mootools: false });

  rand = Number.random(10);
  equal(rand >= 0 && rand <= 10, true, 'Number.random | min not defined, max is 10', { mootools: false });
  equal(rand % 1, 0, 'Number.random | number is whole', { mootools: NaN });

  rand = Number.random(536224, 536280);
 equal(rand >= 536224 && rand <= 536280, true, 'Number.random | min and max defined');

  rand = Number.random(6, -5);
  equal(rand >= -5 && rand <= 6, true, 'Number.random | min and max can be reversed');

  equal(Number.random(0, 0), 0, 'Number.random | 0 should always remain 0');
  equal(Number.random(0, 0), 0, 'Number.random | 0 should always remain 0');
  equal(Number.random(0, 0), 0, 'Number.random | 0 should always remain 0');
  equal(Number.random(0, 0), 0, 'Number.random | 0 should always remain 0');
  equal(Number.random(0, 0), 0, 'Number.random | 0 should always remain 0');
  equal(Number.random(0, 0), 0, 'Number.random | 0 should always remain 0');



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
  equal((3).pow(), 3, 'Number#pow | undefined defaults to 1', { mootools: NaN });


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
  equal(counter, 0, 'Number#upto | 5 up to 1 | iterates 0 times');
  equal(ret, [], 'Number#upto | 5 up to 1 | returns empty array');

  equal((3).upto(9, null, 3), [3,6,9], 'Number#upto | can handle multiples');
  equal((3).upto(10, null, 3), [3,6,9], 'Number#upto | can handle multiples stops at 9');
  equal((3).upto(8, null, 3), [3,6], 'Number#upto | can handle multiples stops at 8');
  equal((9).downto(3, null, 3), [9,6,3], 'Number#downto | can handle multiples');
  equal((9).downto(4, null, 3), [9,6], 'Number#downto | can handle multiples stops at 4');
  equal((9).downto(2, null, 3), [9,6,3], 'Number#downto | can handle multiples stops at 2');



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
  equal((111).ordinalize(), '111th', 'Number#ordinalize | 111');
  equal((112).ordinalize(), '112th', 'Number#ordinalize | 112');
  equal((113).ordinalize(), '113th', 'Number#ordinalize | 113');
  equal((114).ordinalize(), '114th', 'Number#ordinalize | 114');
  equal((-1).ordinalize(), '-1st', 'Number#ordinalize | -1');


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

  equal((1000).format(null, ' '), '1 000', 'Number#format | 1000')
  equal((1532587).format(null, ' '), '1 532 587', 'Number#format | larger number')
  equal((1532587.5752).format(null, ' ', ','), '1 532 587,5752', 'Number#format | larger number with decimal')
  equal((9999999.99).format(), '9,999,999.99', 'Number#format | Standard');
  equal((9999999.99).format(null, '.',','), '9.999.999,99', 'Number#format | Euro style!');
  equal((1).format(2), '1.00', 'Number#format | to 2 places')
  equal((10).format(2), '10.00', 'Number#format | to 2 places')
  equal((100).format(2), '100.00', 'Number#format | to 2 places')
  equal((1000).format(2), '1,000.00', 'Number#format | to 2 places')
  equal((10000).format(2), '10,000.00', 'Number#format | to 2 places')
  equal((100000).format(2), '100,000.00', 'Number#format | to 2 places')
  equal((1000000).format(2), '1,000,000.00', 'Number#format | to 2 places')
  equal((1).format(4), '1.0000', 'Number#format | to 4 places')
  equal((10).format(4), '10.0000', 'Number#format | to 4 places')
  equal((100).format(4), '100.0000', 'Number#format | to 4 places')
  equal((1000).format(4), '1,000.0000', 'Number#format | to 4 places')
  equal((10000).format(4), '10,000.0000', 'Number#format | to 4 places')
  equal((100000).format(4), '100,000.0000', 'Number#format | to 4 places')
  equal((1000000).format(4), '1,000,000.0000', 'Number#format | to 4 places')
  equal((-1).format(2), '-1.00', 'Number#format | to 2 places')
  equal((-10).format(2), '-10.00', 'Number#format | to 2 places')
  equal((-100).format(2), '-100.00', 'Number#format | to 2 places')
  equal((-1000).format(2), '-1,000.00', 'Number#format | to 2 places')
  equal((-10000).format(2), '-10,000.00', 'Number#format | to 2 places')
  equal((-100000).format(2), '-100,000.00', 'Number#format | to 2 places')
  equal((-1000000).format(2), '-1,000,000.00', 'Number#format | to 2 places')
  equal((-1).format(4), '-1.0000', 'Number#format | to 4 places')
  equal((-10).format(4), '-10.0000', 'Number#format | to 4 places')
  equal((-100).format(4), '-100.0000', 'Number#format | to 4 places')
  equal((-1000).format(4), '-1,000.0000', 'Number#format | to 4 places')
  equal((-10000).format(4), '-10,000.0000', 'Number#format | to 4 places')
  equal((-100000).format(4), '-100,000.0000', 'Number#format | to 4 places')
  equal((-1000000).format(4), '-1,000,000.0000', 'Number#format | to 4 places')

  equal((2.435).format(2), '2.44', 'Number#format | 2.44')
  equal((553599.435).format(2), '553,599.44', 'Number#format | 553,599.44')
  equal((553599.435).format(1), '553,599.4', 'Number#format | 553,599.4')
  equal((553599.435).format(0), '553,599', 'Number#format | 553,599')
  equal((553599.435).format(-1), '553,600', 'Number#format | 553,600')
  equal((553599.435).format(-2), '553,600', 'Number#format | 553,600')
  equal((553599.435).format(-3), '554,000', 'Number#format | 553,600')
  equal((553599.435).format(-4), '550,000', 'Number#format | 550,000')
  equal((553599.435).format(-5), '600,000', 'Number#format | 600,000')

  raisesError(function(){ (1000).format(2, 5) }, 'Number#format | should raise an error if a digit is given for the thousands separator');


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
  equal((547.528).pad(4), '0547.528', 'Number#pad | does not take decimal places into account')

  equal((255).pad(4, false, 16), '00ff', 'Number#pad | handles hex')
  equal((2).pad(4, false, 2), '0010', 'Number#pad | handles binary')


  equal((0).hex(), '0', 'Number#hex | 0')
  equal((10).hex(), 'a', 'Number#hex | 10')
  equal((255).hex(), 'ff', 'Number#hex | 255')
  equal((0.5).hex(), '0.8', 'Number#hex | 0.5')
  equal((2.5).hex(), '2.8', 'Number#hex | 2.8')
  equal((2553423).hex(), '26f64f', 'Number#hex | 2553423')

  equal((0).hex(2), '00', 'Number#hex | padding 2 places | 0')
  equal((10).hex(2), '0a', 'Number#hex | padding 2 places | 10')
  equal((255).hex(2), 'ff', 'Number#hex | padding 2 places | 10')
  equal((0.5).hex(2), '00.8', 'Number#hex | padding 2 places | 0.5')
  equal((2.5).hex(2), '02.8', 'Number#hex | padding 2 places | 2.8')

  equal((0).hex(4), '0000', 'Number#hex | padding 4 places | 0')
  equal((10).hex(4), '000a', 'Number#hex | padding 4 places | 10')
  equal((255).hex(4), '00ff', 'Number#hex | padding 4 places | 10')
  equal((0.5).hex(4), '0000.8', 'Number#hex | padding 4 places | 0.5')
  equal((2.5).hex(4), '0002.8', 'Number#hex | padding 4 places | 2.8')


  // Number#compare

  equal((0).compare(0), 0, 'Number#compare | 0 is equal to 0');
  equal((0).compare(-1), 1, 'Number#compare | 0 is greater than -1');
  equal((0).compare(1), -1, 'Number#compare | 0 is less than 1');
  equal((1).compare(1), 0, 'Number#compare | 1 is equal to 1');
  equal((1).compare(2), -1, 'Number#compare | 1 is less than 2');
  equal((1).compare(0), 1, 'Number#compare | 1 is greater than than 0');
  equal((5).compare(15), -10, 'Number#compare | 5 is less than than 15');
  equal((15).compare(5), 10, 'Number#compare | 15 is greater than than 5');

  equal((0).compare('0'), 0, 'Number#compare | strings are coerced | 0 is equal to 0');
  equal((0).compare('-1'), 1, 'Number#compare | strings are coerced | 0 is greater than -1');
  equal((0).compare('1'), -1, 'Number#compare | strings are coerced | 0 is less than 1');
  equal((1).compare('1'), 0, 'Number#compare | strings are coerced | 1 is equal to 1');
  equal((1).compare('2'), -1, 'Number#compare | strings are coerced | 1 is less than 2');
  equal((1).compare('0'), 1, 'Number#compare | strings are coerced | 1 is greater than than 0');
  equal((5).compare('15'), -10, 'Number#compare | strings are coerced | 5 is less than than 15');
  equal((15).compare('5'), 10, 'Number#compare | strings are coerced | 15 is greater than than 5');

  equal((15).compare('wasabi'), NaN, 'Number#compare | cannot compare numbers to strings');
  equal((15).compare({ foo: 'bar' }), NaN, 'Number#compare | cannot compare numbers to objects');
  equal((15).compare(/wasabi/), NaN, 'Number#compare | cannot compare numbers to regexps');
  equal((15).compare(new Date) < 0, true, 'Number#compare | Dates are implicitly converted to numbers');

});

