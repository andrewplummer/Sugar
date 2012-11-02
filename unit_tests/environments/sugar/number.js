
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
  equal((3).pow(), NaN, 'Number#pow | defaults to no number');


  equal((1).sin(), 0.8414709848078965, 'Number#sin | 1');
  equal((0).sin(), 0, 'Number#sin | 0');
  equal((Math.PI/2).sin(), 1, 'Number#sin | PI/2');
  equal((0).cos(), 1, 'Number#cos | 0');
  equal((Math.PI).cos(), -1, 'Number#cos | PI');
  equal((Math.PI*2).cos(), 1, 'Number#cos | PI*2');
  equal((0).tan(), 0, 'Number#tan | 0');
  equal((45).tan(), 1.6197751905438615, 'Number#tan | 45');
  equal((90).tan(), -1.995200412208242, 'Number#tan | 90');
  equal((0).asin(), 0, 'Number#asin | 0');
  equal((1).asin(), Math.PI/2, 'Number#asin | 1');
  equal((0).acos(), Math.PI/2, 'Number#acos | 0');
  equal((1).acos(), 0, 'Number#acos | 1');
  equal((0).atan(), 0, 'Number#atan | 0');
  equal((45).atan(), 1.5485777614681775, 'Number#atan | 45');


  equal((64).log(2), 6, 'Number#log | 64 with base 2');
  equal((9).log(3), 2, 'Number#log | 9 with base 3');
  equal((5).log(), 1.6094379124341003, 'Number#log | 5');
  equal((Math.E).log(), 1, 'Number#log | E');
  equal((1).exp(), Math.E, 'Number#exp | 1');
  equal((0).exp(), 1, 'Number#exp | 0');


  equal((9).sqrt(), 3, 'Number#sqrt | 9');
  equal((1024).sqrt(), 32, 'Number#sqrt | 1024');



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



  equal((0).isOdd(), false, 'Number#isOdd | 0');
  equal((1).isOdd(), true, 'Number#isOdd | 1');
  equal((2).isOdd(), false, 'Number#isOdd | 2');
  equal((24).isOdd(), false, 'Number#isOdd | 24');
  equal((200).isOdd(), false, 'Number#isOdd | 200');
  equal((NaN).isOdd(), false, 'Number#isOdd | NaN');




  equal((0).isEven(), true, 'Number#isEven | 0');
  equal((1).isEven(), false, 'Number#isEven | 1');
  equal((2).isEven(), true, 'Number#isEven | 2');
  equal((24).isEven(), true, 'Number#isEven | 24');
  equal((200).isEven(), true, 'Number#isEven | 200');
  equal((NaN).isEven(), false, 'Number#isEven | NaN');



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


  // Moved from inflections tests

  var OrdinalNumbers = {
    "-1"    : "-1st",
    "-2"    : "-2nd",
    "-3"    : "-3rd",
    "-4"    : "-4th",
    "-5"    : "-5th",
    "-6"    : "-6th",
    "-7"    : "-7th",
    "-8"    : "-8th",
    "-9"    : "-9th",
    "-10"   : "-10th",
    "-11"   : "-11th",
    "-12"   : "-12th",
    "-13"   : "-13th",
    "-14"   : "-14th",
    "-20"   : "-20th",
    "-21"   : "-21st",
    "-22"   : "-22nd",
    "-23"   : "-23rd",
    "-24"   : "-24th",
    "-100"  : "-100th",
    "-101"  : "-101st",
    "-102"  : "-102nd",
    "-103"  : "-103rd",
    "-104"  : "-104th",
    "-110"  : "-110th",
    "-111"  : "-111th",
    "-112"  : "-112th",
    "-113"  : "-113th",
    "-1000" : "-1000th",
    "-1001" : "-1001st",
    "0"     : "0th",
    "1"     : "1st",
    "2"     : "2nd",
    "3"     : "3rd",
    "4"     : "4th",
    "5"     : "5th",
    "6"     : "6th",
    "7"     : "7th",
    "8"     : "8th",
    "9"     : "9th",
    "10"    : "10th",
    "11"    : "11th",
    "12"    : "12th",
    "13"    : "13th",
    "14"    : "14th",
    "20"    : "20th",
    "21"    : "21st",
    "22"    : "22nd",
    "23"    : "23rd",
    "24"    : "24th",
    "100"   : "100th",
    "101"   : "101st",
    "102"   : "102nd",
    "103"   : "103rd",
    "104"   : "104th",
    "110"   : "110th",
    "111"   : "111th",
    "112"   : "112th",
    "113"   : "113th",
    "1000"  : "1000th",
    "1001"  : "1001st"
  }

  // Test ordinalize
  testIterateOverObject(OrdinalNumbers, function(str, ordinalized) {
      equal(parseInt(str).ordinalize(), ordinalized, 'String#ordinalize')
  });










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
  equal((9999999.99).format(null, ''), '9999999.99', 'Number#format | empty string');
  equal((9999999.99).format(null, '', ''), '999999999', 'Number#format | no punctuation');

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
  equal((0).pad(0), '0', 'Number#pad | 0 no padding')
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


  // Number#isInteger

  equal((15).isInteger(), true, 'Number#isInteger | 15');
  equal((15.2).isInteger(), false, 'Number#isInteger | 15.2');
  equal((15.2668).isInteger(), false, 'Number#isInteger | 15.2668');
  equal((15.0).isInteger(), true, 'Number#isInteger | 15.0');
  equal(Number.prototype.isInteger.call('15'), true, 'Number#isInteger | "15"');
  equal(Number.prototype.isInteger.call('15.8'), false, 'Number#isInteger | "15.8"');


  // Number#abbr

  equal((1).abbr(), '1', 'Number#abbr | 1');
  equal((10).abbr(), '10', 'Number#abbr | 10');
  equal((100).abbr(), '100', 'Number#abbr | 100');
  equal((1000).abbr(), '1k', 'Number#abbr | 1,000');
  equal((10000).abbr(), '10k', 'Number#abbr | 10,000');
  equal((100000).abbr(), '100k', 'Number#abbr | 100,000');
  equal((1000000).abbr(), '1m', 'Number#abbr | 1,000,000');
  equal((10000000).abbr(), '10m', 'Number#abbr | 10,000,000');
  equal((100000000).abbr(), '100m', 'Number#abbr | 100,000,000');
  equal((1000000000).abbr(), '1b', 'Number#abbr | 1,000,000,000');
  equal((10000000000).abbr(), '10b', 'Number#abbr | 10,000,000,000');
  equal((100000000000).abbr(), '100b', 'Number#abbr | 100,000,000,000');
  equal((1000000000000).abbr(), '1t', 'Number#abbr | 1,000,000,000,000');
  equal((1000000000000000000).abbr(), '1,000,000t', 'Number#abbr | 1,000,000,000,000,000,000');

  equal((1).abbr(), '1', 'Number#abbr | decimal | 1');
  equal((12).abbr(), '12', 'Number#abbr | decimal | 12');
  equal((124).abbr(), '124', 'Number#abbr | decimal | 124');
  equal((1249).abbr(), '1k', 'Number#abbr | decimal | 1,249');
  equal((1749).abbr(), '2k', 'Number#abbr | decimal | 1,749');
  equal((12495).abbr(), '12k', 'Number#abbr | decimal | 12,495');
  equal((17495).abbr(), '17k', 'Number#abbr | decimal | 17,495');
  equal((124958).abbr(), '125k', 'Number#abbr | decimal | 124,958');
  equal((174958).abbr(), '175k', 'Number#abbr | decimal | 174,958');
  equal((1249584).abbr(), '1m', 'Number#abbr | decimal | 1,249,584');
  equal((1749584).abbr(), '2m', 'Number#abbr | decimal | 1,749,584');

  equal((1).abbr(1), '1', 'Number#abbr | decimal 1 place | 1');
  equal((12).abbr(1), '12', 'Number#abbr | decimal 1 place | 12');
  equal((124).abbr(1), '124', 'Number#abbr | decimal 1 place | 124');
  equal((1249).abbr(1), '1.2k', 'Number#abbr | decimal 1 place | 1,249');
  equal((1749).abbr(1), '1.7k', 'Number#abbr | decimal 1 place | 1,749');
  equal((12495).abbr(1), '12.5k', 'Number#abbr | decimal 1 place | 12,495');
  equal((17495).abbr(1), '17.5k', 'Number#abbr | decimal 1 place | 17,495');
  equal((124958).abbr(1), '125k', 'Number#abbr | decimal 1 place | 124,958');
  equal((174958).abbr(1), '175k', 'Number#abbr | decimal 1 place | 174,958');
  equal((1249584).abbr(1), '1.2m', 'Number#abbr | decimal 1 place | 1,249,584');
  equal((1749584).abbr(1), '1.7m', 'Number#abbr | decimal 1 place | 1,749,584');

  equal((1).abbr(2), '1', 'Number#abbr | decimal 2 places | 1');
  equal((12).abbr(2), '12', 'Number#abbr | decimal 2 places | 12');
  equal((124).abbr(2), '124', 'Number#abbr | decimal 2 places | 124');
  equal((1249).abbr(2), '1.25k', 'Number#abbr | decimal 2 places | 1,249');
  equal((1749).abbr(2), '1.75k', 'Number#abbr | decimal 2 places | 1,749');
  equal((12495).abbr(2), '12.5k', 'Number#abbr | decimal 2 places | 12,495');
  equal((17495).abbr(2), '17.5k', 'Number#abbr | decimal 2 places | 17,495');
  equal((124958).abbr(2), '124.96k', 'Number#abbr | decimal 2 places | 124,958');
  equal((174958).abbr(2), '174.96k', 'Number#abbr | decimal 2 places | 174,958');
  equal((1249584).abbr(2), '1.25m', 'Number#abbr | decimal 2 places | 1,249,584');
  equal((1749584).abbr(2), '1.75m', 'Number#abbr | decimal 2 places | 1,749,584');

  equal((1).abbr(3), '1', 'Number#abbr | decimal 3 places | 1');
  equal((12).abbr(3), '12', 'Number#abbr | decimal 3 places | 12');
  equal((124).abbr(3), '124', 'Number#abbr | decimal 3 places | 124');
  equal((1249).abbr(3), '1.249k', 'Number#abbr | decimal 3 places | 1,249');
  equal((1749).abbr(3), '1.749k', 'Number#abbr | decimal 3 places | 1,749');
  equal((12495).abbr(3), '12.495k', 'Number#abbr | decimal 3 places | 12,495');
  equal((17495).abbr(3), '17.495k', 'Number#abbr | decimal 3 places | 17,495');
  equal((124958).abbr(3), '124.958k', 'Number#abbr | decimal 3 places | 124,958');
  equal((174958).abbr(3), '174.958k', 'Number#abbr | decimal 3 places | 174,958');
  equal((1249584).abbr(3), '1.25m', 'Number#abbr | decimal 3 places | 1,249,584');
  equal((1749584).abbr(3), '1.75m', 'Number#abbr | decimal 3 places | 1,749,584');

  equal((1).abbr(-1), '0', 'Number#abbr | decimal -1 places | 1');
  equal((12).abbr(-1), '10', 'Number#abbr | decimal -1 places | 12');
  equal((124).abbr(-1), '120', 'Number#abbr | decimal -1 places | 124');
  equal((1249).abbr(-1), '0k', 'Number#abbr | decimal -1 places | 1,249');
  equal((1749).abbr(-1), '0k', 'Number#abbr | decimal -1 places | 1,749');
  equal((12495).abbr(-1), '10k', 'Number#abbr | decimal -1 places | 12,495');
  equal((17495).abbr(-1), '20k', 'Number#abbr | decimal -1 places | 17,495');
  equal((124958).abbr(-1), '120k', 'Number#abbr | decimal -1 places | 124,958');
  equal((174958).abbr(-1), '170k', 'Number#abbr | decimal -1 places | 174,958');
  equal((1249584).abbr(-1), '0m', 'Number#abbr | decimal -1 places | 1,249,584');
  equal((1749584).abbr(-1), '0m', 'Number#abbr | decimal -1 places | 1,749,584');

  equal((0.1).abbr(), '0', 'Number#abbr | 0.1');
  equal((0.01).abbr(), '0', 'Number#abbr | 0.01');
  equal((0.001).abbr(), '0', 'Number#abbr | 0.001');
  equal((0.0001).abbr(), '0', 'Number#abbr | 0.00001');
  equal((0.00001).abbr(), '0', 'Number#abbr | 0.000001');
  equal((0.000001).abbr(), '0', 'Number#abbr | 0.0000001');
  equal((0.0000001).abbr(), '0', 'Number#abbr | 0.00000001');
  equal((0.00000001).abbr(), '0', 'Number#abbr | 0.000000001');

  equal((1.1).abbr(), '1', 'Number#abbr | 1.1');
  equal((1.01).abbr(), '1', 'Number#abbr | 1.01');
  equal((1.001).abbr(), '1', 'Number#abbr | 1.001');
  equal((1.0001).abbr(), '1', 'Number#abbr | 1.00001');
  equal((1.00001).abbr(), '1', 'Number#abbr | 1.000001');
  equal((1.000001).abbr(), '1', 'Number#abbr | 1.0000001');
  equal((1.0000001).abbr(), '1', 'Number#abbr | 1.00000001');
  equal((1.00000001).abbr(), '1', 'Number#abbr | 1.000000001');

  equal((1000.004).abbr(), '1k', 'Number#abbr | 1000.004');
  equal((10000.004).abbr(), '10k', 'Number#abbr | 10,000.004');
  equal((100000.004).abbr(), '100k', 'Number#abbr | 100,000.004');
  equal((1000000.004).abbr(), '1m', 'Number#abbr | 1,000,000.004');

  equal((1000.004).abbr(2), '1k', 'Number#abbr | 2 places | 1000.004');
  equal((10000.004).abbr(2), '10k', 'Number#abbr | 2 places | 10,000.004');
  equal((100000.004).abbr(2), '100k', 'Number#abbr | 2 places | 100,000.004');
  equal((1000000.004).abbr(2), '1m', 'Number#abbr | 2 places | 1,000,000.004');

  // Number#metric

  equal((1).metric(0, false), '1', 'Number#metric | 1');
  equal((10).metric(0, false), '10', 'Number#metric | 10');
  equal((100).metric(0, false), '100', 'Number#metric | 100');
  equal((1000).metric(0, false), '1k', 'Number#metric | 1,000');
  equal((10000).metric(0, false), '10k', 'Number#metric | 10,000');
  equal((100000).metric(0, false), '100k', 'Number#metric | 100,000');
  equal((1000000).metric(0, false), '1M', 'Number#metric | 1,000,000');
  equal((10000000).metric(0, false), '10M', 'Number#metric | 10,000,000');
  equal((100000000).metric(0, false), '100M', 'Number#metric | 100,000,000');
  equal((1000000000).metric(0, false), '1G', 'Number#metric | 1,000,000,000');
  equal((10000000000).metric(0, false), '10G', 'Number#metric | 10,000,000,000');
  equal((100000000000).metric(0, false), '100G', 'Number#metric | 100,000,000,000');
  equal((1000000000000).metric(0, false), '1T', 'Number#metric | 10,000,000,000,000');
  equal((10000000000000).metric(0, false), '10T', 'Number#metric | 100,000,000,000,000');
  equal((100000000000000).metric(0, false), '100T', 'Number#metric | 1,000,000,000,000,000');
  equal((1000000000000000).metric(0, false), '1P', 'Number#metric | 10,000,000,000,000,000');
  equal((10000000000000000).metric(0, false), '10P', 'Number#metric | 100,000,000,000,000,000');
  equal((100000000000000000).metric(0, false), '100P', 'Number#metric | 1,000,000,000,000,000,000');

  equal((1).metric(0, false), '1', 'Number#metric | decimal | 1');
  equal((12).metric(0, false), '12', 'Number#metric | decimal | 12');
  equal((124).metric(0, false), '124', 'Number#metric | decimal | 124');
  equal((1249).metric(0, false), '1k', 'Number#metric | decimal | 1,249');
  equal((1749).metric(0, false), '2k', 'Number#metric | decimal | 1,749');
  equal((12495).metric(0, false), '12k', 'Number#metric | decimal | 12,495');
  equal((17495).metric(0, false), '17k', 'Number#metric | decimal | 17,495');
  equal((124958).metric(0, false), '125k', 'Number#metric | decimal | 124,958');
  equal((174958).metric(0, false), '175k', 'Number#metric | decimal | 174,958');
  equal((1249584).metric(0, false), '1M', 'Number#metric | decimal | 1,249,584');
  equal((1749584).metric(0, false), '2M', 'Number#metric | decimal | 1,749,584');
  equal((1249584000).metric(0, false), '1G', 'Number#metric | decimal | 1,249,584,000');
  equal((1749584000).metric(0, false), '2G', 'Number#metric | decimal | 1,749,584,000');

  equal((1).metric(1, false), '1', 'Number#metric | decimal 1 place | 1');
  equal((12).metric(1, false), '12', 'Number#metric | decimal 1 place | 12');
  equal((124).metric(1, false), '124', 'Number#metric | decimal 1 place | 124');
  equal((1249).metric(1, false), '1.2k', 'Number#metric | decimal 1 place | 1,249');
  equal((1749).metric(1, false), '1.7k', 'Number#metric | decimal 1 place | 1,749');
  equal((12495).metric(1, false), '12.5k', 'Number#metric | decimal 1 place | 12,495');
  equal((17495).metric(1, false), '17.5k', 'Number#metric | decimal 1 place | 17,495');
  equal((124958).metric(1, false), '125k', 'Number#metric | decimal 1 place | 124,958');
  equal((174958).metric(1, false), '175k', 'Number#metric | decimal 1 place | 174,958');
  equal((1249584).metric(1, false), '1.2M', 'Number#metric | decimal 1 place | 1,249,584');
  equal((1749584).metric(1, false), '1.7M', 'Number#metric | decimal 1 place | 1,749,584');
  equal((1249584000).metric(1, false), '1.2G', 'Number#metric | decimal 1 place | 1,249,584,000');
  equal((1749584000).metric(1, false), '1.7G', 'Number#metric | decimal 1 place | 1,749,584,000');

  equal((1).metric(2, false), '1', 'Number#metric | decimal 2 places | 1');
  equal((12).metric(2, false), '12', 'Number#metric | decimal 2 places | 12');
  equal((124).metric(2, false), '124', 'Number#metric | decimal 2 places | 124');
  equal((1249).metric(2, false), '1.25k', 'Number#metric | decimal 2 places | 1,249');
  equal((1749).metric(2, false), '1.75k', 'Number#metric | decimal 2 places | 1,749');
  equal((12495).metric(2, false), '12.5k', 'Number#metric | decimal 2 places | 12,495');
  equal((17495).metric(2, false), '17.5k', 'Number#metric | decimal 2 places | 17,495');
  equal((124958).metric(2, false), '124.96k', 'Number#metric | decimal 2 places | 124,958');
  equal((174958).metric(2, false), '174.96k', 'Number#metric | decimal 2 places | 174,958');
  equal((1249584).metric(2, false), '1.25M', 'Number#metric | decimal 2 places | 1,249,584');
  equal((1749584).metric(2, false), '1.75M', 'Number#metric | decimal 2 places | 1,749,584');
  equal((1249584000).metric(2, false), '1.25G', 'Number#metric | decimal 2 places | 1,249,584,000');
  equal((1749584000).metric(2, false), '1.75G', 'Number#metric | decimal 2 places | 1,749,584,000');

  equal((1).metric(3, false), '1', 'Number#metric | decimal 3 places | 1');
  equal((12).metric(3, false), '12', 'Number#metric | decimal 3 places | 12');
  equal((124).metric(3, false), '124', 'Number#metric | decimal 3 places | 124');
  equal((1249).metric(3, false), '1.249k', 'Number#metric | decimal 3 places | 1,249');
  equal((1749).metric(3, false), '1.749k', 'Number#metric | decimal 3 places | 1,749');
  equal((12495).metric(3, false), '12.495k', 'Number#metric | decimal 3 places | 12,495');
  equal((17495).metric(3, false), '17.495k', 'Number#metric | decimal 3 places | 17,495');
  equal((124958).metric(3, false), '124.958k', 'Number#metric | decimal 3 places | 124,958');
  equal((174958).metric(3, false), '174.958k', 'Number#metric | decimal 3 places | 174,958');
  equal((1249584).metric(3, false), '1.25M', 'Number#metric | decimal 3 places | 1,249,584');
  equal((1749584).metric(3, false), '1.75M', 'Number#metric | decimal 3 places | 1,749,584');
  equal((1249584000).metric(3, false), '1.25G', 'Number#metric | decimal 3 places | 1,249,584,000');
  equal((1749584000).metric(3, false), '1.75G', 'Number#metric | decimal 3 places | 1,749,584,000');


  equal((1).metric(-1, false), '0', 'Number#metric | decimal -1 places | 1');
  equal((12).metric(-1, false), '10', 'Number#metric | decimal -1 places | 12');
  equal((124).metric(-1, false), '120', 'Number#metric | decimal -1 places | 124');
  equal((1249).metric(-1, false), '0k', 'Number#metric | decimal -1 places | 1,249');
  equal((1749).metric(-1, false), '0k', 'Number#metric | decimal -1 places | 1,749');
  equal((12495).metric(-1, false), '10k', 'Number#metric | decimal -1 places | 12,495');
  equal((17495).metric(-1, false), '20k', 'Number#metric | decimal -1 places | 17,495');
  equal((124958).metric(-1, false), '120k', 'Number#metric | decimal -1 places | 124,958');
  equal((174958).metric(-1, false), '170k', 'Number#metric | decimal -1 places | 174,958');
  equal((1249584).metric(-1, false), '0M', 'Number#metric | decimal -1 places | 1,249,584');
  equal((1749584).metric(-1, false), '0M', 'Number#metric | decimal -1 places | 1,749,584');
  equal((1249584000).metric(-1, false), '0G', 'Number#metric | decimal -1 places | 1,249,584,000');
  equal((1749584000).metric(-1, false), '0G', 'Number#metric | decimal -1 places | 1,749,584,000');

  equal((0.1000000000000).metric(), '100m',    'Number#metric | fractional | 0.1');
  equal((0.0100000000000).metric(), '10m',     'Number#metric | fractional | 0.01');
  equal((0.0010000000000).metric(), '1m',      'Number#metric | fractional | 0.001');
  equal((0.0001000000000).metric(), '100μ',    'Number#metric | fractional | 0.0001');
  equal((0.0000100000000).metric(), '10μ',     'Number#metric | fractional | 0.00001');
  equal((0.0000010000000).metric(), '1μ',      'Number#metric | fractional | 0.000001');
  equal((0.0000001000000).metric(), '100n',    'Number#metric | fractional | 0.0000001');
  equal((0.0000000100000).metric(), '10n',     'Number#metric | fractional | 0.00000001');
  equal((0.0000000010000).metric(), '1n',      'Number#metric | fractional | 0.000000001');
  equal((0.0000000001000).metric(), '0.1n',    'Number#metric | fractional | 0.0000000001');
  equal((0.0000000000100).metric(), '0.01n',   'Number#metric | fractional | 0.00000000001');
  equal((0.0000000000010).metric(), '0.001n',  'Number#metric | fractional | 0.000000000001');
  equal((0.0000000000001).metric(), '0.0001n', 'Number#metric | fractional | 0.0000000000001');

  equal((0.1111111111111).metric(), '111m',    'Number#metric | fractional | 0 places | 0.1111111111111');
  equal((0.0111111111111).metric(), '11m',     'Number#metric | fractional | 0 places | 0.0111111111111');
  equal((0.0011111111111).metric(), '1m',      'Number#metric | fractional | 0 places | 0.0011111111111');
  equal((0.0001111111111).metric(), '111μ',    'Number#metric | fractional | 0 places | 0.0001111111111');
  equal((0.0000111111111).metric(), '11μ',     'Number#metric | fractional | 0 places | 0.0000111111111');
  equal((0.0000011111111).metric(), '1μ',      'Number#metric | fractional | 0 places | 0.0000011111111');
  equal((0.0000001111111).metric(), '111n',    'Number#metric | fractional | 0 places | 0.0000001111111');
  equal((0.0000000111111).metric(), '11n',     'Number#metric | fractional | 0 places | 0.0000000111111');
  equal((0.0000000011111).metric(), '1n',      'Number#metric | fractional | 0 places | 0.0000000011111');
  equal((0.0000000001111).metric(), '0.1n',    'Number#metric | fractional | 0 places | 0.0000000001111');
  equal((0.0000000000111).metric(), '0.01n',   'Number#metric | fractional | 0 places | 0.0000000000111');
  equal((0.0000000000011).metric(), '0.001n',  'Number#metric | fractional | 0 places | 0.0000000000011');
  equal((0.0000000000001).metric(), '0.0001n', 'Number#metric | fractional | 0 places | 0.0000000000001');

  equal((0.1111111111111).metric(2, false), '111.11m', 'Number#metric | fractional | 2 places | 0.1111111111111');
  equal((0.0111111111111).metric(2, false), '11.11m',  'Number#metric | fractional | 2 places | 0.0111111111111');
  equal((0.0011111111111).metric(2, false), '1.11m',   'Number#metric | fractional | 2 places | 0.0011111111111');
  equal((0.0001111111111).metric(2, false), '111.11μ', 'Number#metric | fractional | 2 places | 0.0001111111111');
  equal((0.0000111111111).metric(2, false), '11.11μ',  'Number#metric | fractional | 2 places | 0.0000111111111');
  equal((0.0000011111111).metric(2, false), '1.11μ',   'Number#metric | fractional | 2 places | 0.0000011111111');
  equal((0.0000001111111).metric(2, false), '111.11n', 'Number#metric | fractional | 2 places | 0.0000001111111');
  equal((0.0000000111111).metric(2, false), '11.11n',  'Number#metric | fractional | 2 places | 0.0000000111111');
  equal((0.0000000011111).metric(2, false), '1.11n',   'Number#metric | fractional | 2 places | 0.0000000011111');
  equal((0.0000000001111).metric(2, false), '0.1n',    'Number#metric | fractional | 2 places | 0.0000000001111');
  equal((0.0000000000111).metric(2, false), '0.01n',   'Number#metric | fractional | 2 places | 0.0000000000111');
  equal((0.0000000000011).metric(2, false), '0.001n',  'Number#metric | fractional | 2 places | 0.0000000000011');
  equal((0.0000000000001).metric(2, false), '0.0001n', 'Number#metric | fractional | 2 places | 0.0000000000001');

  equal((1.1111111111111).metric(), '1', 'Number#metric | fractional | 0 places | 1.1111111111111');
  equal((1.0111111111111).metric(), '1', 'Number#metric | fractional | 0 places | 1.0111111111111');
  equal((1.0011111111111).metric(), '1', 'Number#metric | fractional | 0 places | 1.0011111111111');
  equal((1.0001111111111).metric(), '1', 'Number#metric | fractional | 0 places | 1.0001111111111');
  equal((1.0000111111111).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000111111111');
  equal((1.0000011111111).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000011111111');
  equal((1.0000001111111).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000001111111');
  equal((1.0000000111111).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000000111111');
  equal((1.0000000011111).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000000011111');
  equal((1.0000000001111).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000000001111');
  equal((1.0000000000111).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000000000111');
  equal((1.0000000000011).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000000000011');
  equal((1.0000000000001).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000000000001');

  equal((1.1111111111111).metric(2, false), '1.11', 'Number#metric | fractional | 2 places | 1.1111111111111');
  equal((1.0111111111111).metric(2, false), '1.01', 'Number#metric | fractional | 2 places | 1.0111111111111');
  equal((1.0011111111111).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0011111111111');
  equal((1.0001111111111).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0001111111111');
  equal((1.0000111111111).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000111111111');
  equal((1.0000011111111).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000011111111');
  equal((1.0000001111111).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000001111111');
  equal((1.0000000111111).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000000111111');
  equal((1.0000000011111).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000000011111');
  equal((1.0000000001111).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000000001111');
  equal((1.0000000000111).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000000000111');
  equal((1.0000000000011).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000000000011');
  equal((1.0000000000001).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000000000001');

  equal((1.1000000000001).metric(), '1', 'Number#metric | fractional | 0 places | 1.1000000000001');
  equal((1.0100000000001).metric(), '1', 'Number#metric | fractional | 0 places | 1.0100000000001');
  equal((1.0010000000001).metric(), '1', 'Number#metric | fractional | 0 places | 1.0010000000001');
  equal((1.0001000000001).metric(), '1', 'Number#metric | fractional | 0 places | 1.0001000000001');
  equal((1.0000100000001).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000100000001');
  equal((1.0000010000001).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000010000001');
  equal((1.0000001000001).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000001000001');
  equal((1.0000000100001).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000000100001');
  equal((1.0000000010001).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000000010001');
  equal((1.0000000001001).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000000001001');
  equal((1.0000000000101).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000000000101');
  equal((1.0000000000011).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000000000011');
  equal((1.0000000000001).metric(), '1', 'Number#metric | fractional | 0 places | 1.0000000000001');

  equal((1.1000000000001).metric(2, false), '1.1',  'Number#metric | fractional | 2 places | 1.1000000000001');
  equal((1.0100000000001).metric(2, false), '1.01', 'Number#metric | fractional | 2 places | 1.0100000000001');
  equal((1.0010000000001).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0010000000001');
  equal((1.0001000000001).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0001000000001');
  equal((1.0000100000001).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000100000001');
  equal((1.0000010000001).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000010000001');
  equal((1.0000001000001).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000001000001');
  equal((1.0000000100001).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000000100001');
  equal((1.0000000010001).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000000010001');
  equal((1.0000000001001).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000000001001');
  equal((1.0000000000101).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000000000101');
  equal((1.0000000000011).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000000000011');
  equal((1.0000000000001).metric(2, false), '1',    'Number#metric | fractional | 2 places | 1.0000000000001');

  equal((12334.5880).metric(3, false), '12.335k', 'Number#metric | fractional | 3 places | 12334.5880');
  equal((12334.5880).metric(), '12k', 'Number#metric | fractional | 0 places | 12334.5880');
  equal((.588500).metric(9, false), '588.5m', 'Number#metric | fractional | 9 places | .5885');
  equal((.580085).metric(9, false), '580.085m', 'Number#metric | fractional | 9 places | .580085');
  equal((.580085).metric(7, false), '580.085m', 'Number#metric | fractional | 7 places | .580085');
  equal((.580085).metric(5, false), '580.085m', 'Number#metric | fractional | 5 places | .580085');
  equal((.580085).metric(3, false), '580.085m', 'Number#metric | fractional | 3 places | .580085');
  equal((.580085).metric(1, false), '580.1m', 'Number#metric | fractional | 1 places | .580085');


  equal((0.0001).metric()     + 'm', '100μm',       'Number#metric | 100μm');
  equal((0.001).metric()      + 'm', '1mm',         'Number#metric | 1mm');
  equal((0.01).metric()       + 'm', '10mm',        'Number#metric | 10mm');
  equal((0.1).metric()        + 'm', '100mm',       'Number#metric | 100mm');
  equal((1).metric()          + 'm', '1m',          'Number#metric | 1m');
  equal((1000).metric()       + 'm', '1km',         'Number#metric | 1km');
  equal((1000000).metric()    + 'm', '1,000km',     'Number#metric | 1,000km');
  equal((1000000000).metric() + 'm', '1,000,000km', 'Number#metric | 1,000,000km');

  equal((1000000000).metric(0, 0) + 'm', '1,000,000,000m', 'Number#metric | limited to meters | 1,000,000,000m');
  equal((1000000).metric(0, 0)    + 'm', '1,000,000m',     'Number#metric | limited to meters | 1,000,000m');
  equal((1000).metric(0, 0)       + 'm', '1,000m',         'Number#metric | limited to meters | 1,000m');
  equal((1).metric(0, 0)          + 'm', '1m',             'Number#metric | limited to meters | 1m');

  equal((12323.424558).metric(3, 0), '12,323.425', 'Number#metric | limited and 3 decimals');
  equal((1).metric(0, -1) + 'm', '1,000mm', 'Number#metric | 1 meter is 1,000mm');



  // Number#bytes

  equal((1).bytes(),                  '1B' ,       'Number#bytes | 1B       ');
  equal((10).bytes(),                 '10B' ,      'Number#bytes | 10B      ');
  equal((100).bytes(),                '100B' ,     'Number#bytes | 100B     ');
  equal((1000).bytes(),               '1kB' ,      'Number#bytes | 1kB      ');
  equal((10000).bytes(),              '10kB' ,     'Number#bytes | 10kB     ');
  equal((100000).bytes(),             '98kB' ,     'Number#bytes | 100kB    ');
  equal((1000000).bytes(),            '1MB' ,      'Number#bytes | 1MB      ');
  equal((10000000).bytes(),           '10MB' ,     'Number#bytes | 10MB     ');
  equal((100000000).bytes(),          '95MB' ,     'Number#bytes | 100MB    ');
  equal((1000000000).bytes(),         '1GB' ,      'Number#bytes | 1GB      ');
  equal((10000000000).bytes(),        '9GB' ,      'Number#bytes | 10GB     ');
  equal((100000000000).bytes(),       '93GB' ,     'Number#bytes | 100GB    ');
  equal((1000000000000).bytes(),      '1TB' ,      'Number#bytes | 1TB      ');
  equal((10000000000000).bytes(),     '9TB' ,      'Number#bytes | 10TB     ');
  equal((100000000000000).bytes(),    '91TB' ,     'Number#bytes | 100TB    ');
  equal((1000000000000000).bytes(),   '909TB' ,    'Number#bytes | 1,000TB  ');
  equal((10000000000000000).bytes(),  '9,095TB' ,  'Number#bytes | 10,000TB ');
  equal((100000000000000000).bytes(), '90,949TB' , 'Number#bytes | 10,000TB ');

  equal((1).bytes(0, false),                  '1B' ,   'Number#bytes | no limit | 1B       ');
  equal((10).bytes(0, false),                 '10B' ,  'Number#bytes | no limit | 10B      ');
  equal((100).bytes(0, false),                '100B' , 'Number#bytes | no limit | 100B     ');
  equal((1000).bytes(0, false),               '1kB' ,  'Number#bytes | no limit | 1kB      ');
  equal((10000).bytes(0, false),              '10kB' , 'Number#bytes | no limit | 10kB     ');
  equal((100000).bytes(0, false),             '98kB' , 'Number#bytes | no limit | 100kB    ');
  equal((1000000).bytes(0, false),            '1MB' ,  'Number#bytes | no limit | 1MB      ');
  equal((10000000).bytes(0, false),           '10MB' , 'Number#bytes | no limit | 10MB     ');
  equal((100000000).bytes(0, false),          '95MB' , 'Number#bytes | no limit | 100MB    ');
  equal((1000000000).bytes(0, false),         '1GB' ,  'Number#bytes | no limit | 1GB      ');
  equal((10000000000).bytes(0, false),        '9GB' ,  'Number#bytes | no limit | 10GB     ');
  equal((100000000000).bytes(0, false),       '93GB' , 'Number#bytes | no limit | 100GB    ');
  equal((1000000000000).bytes(0, false),      '1TB' ,  'Number#bytes | no limit | 1TB      ');
  equal((10000000000000).bytes(0, false),     '9TB' ,  'Number#bytes | no limit | 10TB     ');
  equal((100000000000000).bytes(0, false),    '91TB' , 'Number#bytes | no limit | 100TB    ');
  equal((1000000000000000).bytes(0, false),   '1PB' ,  'Number#bytes | no limit | 1,000TB  ');
  equal((10000000000000000).bytes(0, false),  '9PB' ,  'Number#bytes | no limit | 10,000TB ');
  equal((100000000000000000).bytes(0, false), '89PB' , 'Number#bytes | no limit | 10,000TB ');

  equal((1).bytes(2, false),                  '1B' ,      'Number#bytes | no limit, 2 places | 1B       ');
  equal((10).bytes(2, false),                 '10B' ,     'Number#bytes | no limit, 2 places | 10B      ');
  equal((100).bytes(2, false),                '100B' ,    'Number#bytes | no limit, 2 places | 100B     ');
  equal((1000).bytes(2, false),               '0.98kB' ,  'Number#bytes | no limit, 2 places | 1kB      ');
  equal((10000).bytes(2, false),              '9.77kB' ,  'Number#bytes | no limit, 2 places | 10kB     ');
  equal((100000).bytes(2, false),             '97.66kB' , 'Number#bytes | no limit, 2 places | 100kB    ');
  equal((1000000).bytes(2, false),            '0.95MB' ,  'Number#bytes | no limit, 2 places | 1MB      ');
  equal((10000000).bytes(2, false),           '9.54MB' ,  'Number#bytes | no limit, 2 places | 10MB     ');
  equal((100000000).bytes(2, false),          '95.37MB' , 'Number#bytes | no limit, 2 places | 100MB    ');
  equal((1000000000).bytes(2, false),         '0.93GB' ,  'Number#bytes | no limit, 2 places | 1GB      ');
  equal((10000000000).bytes(2, false),        '9.31GB' ,  'Number#bytes | no limit, 2 places | 10GB     ');
  equal((100000000000).bytes(2, false),       '93.13GB' , 'Number#bytes | no limit, 2 places | 100GB    ');
  equal((1000000000000).bytes(2, false),      '0.91TB' ,  'Number#bytes | no limit, 2 places | 1TB      ');
  equal((10000000000000).bytes(2, false),     '9.09TB' ,  'Number#bytes | no limit, 2 places | 10TB     ');
  equal((100000000000000).bytes(2, false),    '90.95TB' , 'Number#bytes | no limit, 2 places | 100TB    ');
  equal((1000000000000000).bytes(2, false),   '0.89PB' ,  'Number#bytes | no limit, 2 places | 1,000TB  ');
  equal((10000000000000000).bytes(2, false),  '8.88PB' ,  'Number#bytes | no limit, 2 places | 10,000TB ');
  equal((100000000000000000).bytes(2, false), '88.82PB' , 'Number#bytes | no limit, 2 places | 10,000TB ');

  equal((1024).bytes(),     '1kB', 'Number#bytes | 1024 bytes is 1kB');
  equal((1024).bytes(2),    '1kB', 'Number#bytes | 2 places | 1024 bytes is 1kB');
  equal((1048576).bytes(),  '1MB', 'Number#bytes | 2 places | 1048576 bytes is 1MB');
  equal((1048576).bytes(2), '1MB', 'Number#bytes | 2 places | 1048576 bytes is 1MB');

  equal(((10).pow(16)).bytes(), '9,095TB', 'Number#bytes | 10 ^ 16 bytes');
  equal(((10).pow(16)).bytes(-2), '9,100TB', 'Number#bytes | 10 ^ 16 bytes | -2 places');

});

