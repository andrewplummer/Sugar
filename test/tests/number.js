namespace('Number', function () {
  'use strict';

  group('Options', function() {
    equal(Sugar.Number.getOption('thousands'), ',', 'Thousands should be comma by default');
    equal(Sugar.Number.getOption('decimal'), '.', 'Decimal should be dot by default');
  });

  method('random', function() {
    var rand;

    rand = run(Number);
    equal(rand == 0 || rand == 1, true, 'no params = 0 or 1');

    rand = run(Number, 'random', [10]);
    equal(rand >= 0 && rand <= 10, true, 'min not defined, max is 10');
    equal(rand % 1, 0, 'number is whole');

    rand = run(Number, 'random', [536224, 536280]);
    equal(rand >= 536224 && rand <= 536280, true, 'min and max defined');

    rand = run(Number, 'random', [6, -5]);
    equal(rand >= -5 && rand <= 6, true, 'min and max can be reversed');

    test(Number, [0, 0], 0, '0 should always remain 0');
    test(Number, [0, 0], 0, '0 should always remain 0');
    test(Number, [0, 0], 0, '0 should always remain 0');
    test(Number, [0, 0], 0, '0 should always remain 0');
    test(Number, [0, 0], 0, '0 should always remain 0');
    test(Number, [0, 0], 0, '0 should always remain 0');
  });

  method('toNumber', function() {
    test(4, 4, '4 is 4');
    test(10000, 10000, '10000 is 10000');
    test(5.2345, 5.2345, '5.2345 is 5.2345');
  });

  method('ceil', function() {
    test(5.5, 6, '5.5');
    test(5.14, 6, '5.14');
    test(5, 5, '5');
    test(-5.5, -5, '-5.5');
    test(-5.14, -5, '-5.14');
    test(-5, -5, '-5');
    test(4417.1318, [0], 4418, '0');
    test(4417.1318, [1], 4417.2, '1');
    test(4417.1318, [2], 4417.14, '2');
    test(4417.1318, [3], 4417.132, '3');
    test(4417.1318, [-1], 4420, '-1');
    test(4417.1318, [-2], 4500, '-2');
    test(4417.1318, [-3], 5000, '-3');
  });

  method('floor', function() {
    test(5.5, 5, '5.5');
    test(5.14, 5, '5.14');
    test(5.9, 5, '5.9');
    test(5, 5, '5');
    test(-5.5, -6, '-5.5');
    test(-5.14, -6, '-5.14');
    test(-5, -5, '-5');
    test(4417.1318, [0], 4417, '0');
    test(4417.1318, [1], 4417.1, '1');
    test(4417.1318, [2], 4417.13, '2');
    test(4417.1318, [3], 4417.131, '3');
    test(4417.1318, [-1], 4410, '-1');
    test(4417.1318, [-2], 4400, '-2');
    test(4417.1318, [-3], 4000, '-3');
  });

  method('abs', function() {
    test(-5, 5, '-5');
    test(5, 5, '5');
    test(-3.324, 3.324, '-3.324');
    test(3.324, 3.324, '3.324');
  });

  method('pow', function() {
    test(3, [2], 9, '3 ^ 2');
    test(3, [1], 3, '3 ^ 1');
    test(12, [2], 144, '12 ^ 2');
    test(3, [3], 27, '3 ^ 3');
    test(3, [0], 1, 'zero is allowed');
    test(3, NaN, 'defaults to no number');
  });

  method('sin', function() {
    // A recent change in the V8 engine now produces less accurate values for
    // trigonomic functions in Chrome: https://code.google.com/p/v8/issues/detail?id=3006
    // This issue is flagged for landing in M35.
    equalWithMargin(run(1, 'sin'), 0.8414709848078965, 0.000000000000001);
    test(0, 0);
    test(Math.PI/2, 1);
  });

  method('cos', function() {
    test(0, 1);
    test(Math.PI, -1, 'PI');
    test(Math.PI*2, 1, 'PI*2');
  });

  method('tan', function() {
    test(0, 0);
    // See above
    equalWithMargin(run(45, 'tan'), 1.6197751905438615, 0.000000000000001);
    equalWithMargin(run(90, 'tan'), -1.995200412208242, 0.000000000000001);
  });

  method('asin', function() {
    test(0, 0);
    test(1, Math.PI/2, '1 is PI/2');
  });

  method('acos', function() {
    test(0, Math.PI/2, '0 is PI/2');
    test(1, 0);
  });

  method('atan', function() {
    test(0, 0);
    test(45, 1.5485777614681775);
  });

  method('log', function() {
    test(64, [2], 6, '64 with base 2');
    equalWithMargin(run(9, 'log', [3]), 2, 0.000000000000001, '9 with base 3');
    test(5, 1.6094379124341003, '5');
    test(Math.E, 1, 'E');
  });

  method('exp', function() {
    test(1, Math.E);
    test(0, 1);
  });

  method('sqrt', function() {
    test(9, 3);
    test(1024, 32);
  });

  method('round', function() {
    test(3, 3);
    test(3.241, 3);
    test(3.752, 4);
    test(-3.241, -3);
    test(-3.752, -4);
    test(3.241, [1], 3.2, '3.241 to 1 place');

    test(3.752, [1], 3.8, '3.752 to 1 place');
    test(3.241, [2], 3.24,  '3.241 to 2 places');
    test(3.752, [2], 3.75,  '3.752 to 2 places');

    test(322855.241, [-2], 322900, '322855.241 to -2 places');
    test(322855.241, [-3], 323000, '322855.241 to -3 places');
    test(322855.241, [-4], 320000, '322855.241 to -4 places');
    test(322855.241, [-6], 0, '322855.241 to -6 places');
    test(722855.241, [-6], 1000000, '722855.241 to -6 places');
    test(722855.241, [-8], 0, '722855.241 to -8 places');
  });

  method('chr', function() {
    test(65, 'A');
    test(24536, '忘');
    test(20294, '但');
  });

  method('times', function() {
    var count = 0;
    var callback = function(first) {
      equal(first, count, 'first parameter is the index');
      count++;
      return count;
    };
    var result = run(5, 'times', [callback]);
    equal(result, [1,2,3,4,5], 'result should be the collected return values');
    equal(count, 5, 'iterated 5 times');

    var fn = function() {};
    var result = run(3, 'times', [fn]);
    equal(result, undefined, 'Returning undefined should return nothing');

    var fn = function(i) {
      return i || undefined;
    };
    var result = run(3, 'times', [fn]);
    equal(result, [1, 2], 'Mixed return values only collects non-undefined');

    raisesError(function() { run(5, 'times', []); }, 'no callback raises error', TypeError);
  });

  method('isMultipleOf', function() {
    test(2, [2], true, '2 is a multiple of 2');
    test(6, [2], true, '6 is a multiple of 2');
    test(100, [2], true, '100 is a multiple of 2');
    test(2, [100], false, '2 is a multiple of 100');
    test(100, [-2], true, '100 is a multiple of -2');
    test(6, [-2], true, '6 is a multiple of -2');
    test(6, [3], true, '6 is a multiple of 3');
    test(7, [3], false, '7 is a multiple of 3');
    test(2.5, [1.25], true, '2.5 is a multiple of 1.25');
    test(2, ['a'], false, 'string arguments');
    test(2, [/af/], false, 'other random arguments');
    test(2, [null], false, 'null');
    test(2, false, 'no argument passed');
  });

  method('isOdd', function() {
    test(0, false);
    test(1, true);
    test(2, false);
    test(24, false);
    test(200, false);
    test(1.1, false);
    test(NaN, false);
    test(Infinity, false);
    test(-Infinity, false);
  });

  method('isEven', function() {
    test(0, true);
    test(1, false);
    test(2, true);
    test(24, true);
    test(200, true);
    test(1.1, false);
    test(NaN, false);
    test(Infinity, false);
    test(-Infinity, false);
  });

  method('ordinalize', function() {
    test(1, '1st');
    test(2, '2nd');
    test(3, '3rd');
    test(4, '4th');
    test(5, '5th');
    test(6, '6th');
    test(7, '7th');
    test(8, '8th');
    test(9, '9th');
    test(10, '10th');
    test(11, '11th');
    test(12, '12th');
    test(13, '13th');
    test(14, '14th');
    test(15, '15th');
    test(20, '20th');
    test(21, '21st');
    test(22, '22nd');
    test(23, '23rd');
    test(24, '24th');
    test(25, '25th');
    test(100, '100th');
    test(101, '101st');
    test(102, '102nd');
    test(103, '103rd');
    test(104, '104th');
    test(105, '105th');
    test(111, '111th');
    test(112, '112th');
    test(113, '113th');
    test(114, '114th');
    test(-1, '-1st');

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

    testIterateOverObject(OrdinalNumbers, function(str, ordinalized) {
        test(+str, ordinalized);
    });

  });

  method('format', function() {

    test(100, '100');
    test(1, '1');
    test(10, '10');
    test(100, '100');
    test(1000, '1,000');
    test(10000, '10,000');
    test(100000, '100,000');
    test(1000000, '1,000,000');
    test(1000000.01, '1,000,000.01');
    test(-100, '-100');
    test(-1, '-1');
    test(-1000, '-1,000');
    test(-1000000.01, '-1,000,000.01');
    test(0.52, '0.52');
    test(9999999.99, '9,999,999.99');

    // These discrepancies are due to floating point variable limitations.
    equal(run(100046546510000.022435451, 'format').replace(/\.\d+$/, ''), '100,046,546,510,000');
    equal(run(-100046546510000.022435451, 'format').replace(/\.\d+$/, ''), '-100,046,546,510,000');

    Sugar.Number.setOption('thousands', ' ');
    Sugar.Number.setOption('decimal', ',');
    test(1000, [null, ' '], '1 000', 'with space');
    test(1532587, [null, ' '], '1 532 587', 'larget with space');
    test(1532587.5752, [null, ' ', ','], '1 532 587,5752', 'larger number with decimal');

    Sugar.Number.setOption('thousands', '.');
    Sugar.Number.setOption('decimal', ',');
    test(9999999.99, [null, '.',','], '9.999.999,99', 'Euro style!');

    Sugar.Number.setOption('thousands', '');
    Sugar.Number.setOption('decimal', '.');
    test(9999999.99, [null, ''], '9999999.99', 'empty string');

    Sugar.Number.setOption('thousands', '');
    Sugar.Number.setOption('decimal', '');
    test(9999999.99, [null, '', ''], '999999999', 'no punctuation');

    Sugar.Number.setOption('thousands', null);
    Sugar.Number.setOption('decimal', null);
    test(9999999.99, [null, '', ''], '9,999,999.99', 'null returns to defaults');

    withArgs([2], function() {
      test(1, '1.00');
      test(10, '10.00');
      test(100, '100.00');
      test(1000, '1,000.00');
      test(10000, '10,000.00');
      test(100000, '100,000.00');
      test(1000000, '1,000,000.00');

      test(-1, '-1.00');
      test(-10, '-10.00');
      test(-100, '-100.00');
      test(-1000, '-1,000.00');
      test(-10000, '-10,000.00');
      test(-100000, '-100,000.00');
      test(-1000000, '-1,000,000.00');

      test(2.435, '2.44');
    });

    withArgs([4], function() {
      test(1, '1.0000');
      test(10, '10.0000');
      test(100, '100.0000');
      test(1000, '1,000.0000');
      test(10000, '10,000.0000');
      test(100000, '100,000.0000');
      test(1000000, '1,000,000.0000');
      test(-1, '-1.0000');
      test(-10, '-10.0000');
      test(-100, '-100.0000');
      test(-1000, '-1,000.0000');
      test(-10000, '-10,000.0000');
      test(-100000, '-100,000.0000');
      test(-1000000, '-1,000,000.0000');
    });

    test(553599.435, [2], '553,599.44', 'to 2 places');
    test(553599.435, [1], '553,599.4', 'to 1 place');
    test(553599.435, [0], '553,599', 'to 0 places');
    test(553599.435, [-1], '553,600', 'to -1 places');
    test(553599.435, [-2], '553,600', 'to -2 places');
    test(553599.435, [-3], '554,000', 'to -3 places');
    test(553599.435, [-4], '550,000', 'to -4 places');
    test(553599.435, [-5], '600,000', 'to -5 places');

    // Testing object form
    Sugar.Number.setOption({
      thousands: 'y'
    });
    test(1000, [null, ' '], '1y000', 'y as separator');
    Sugar.Number.setOption({
      thousands: null
    });

  });

  method('pad', function() {
    test(1, [0], '1', '1 no padding');
    test(1, [1], '1', '1 padded to 1 place');
    test(1, [2], '01', '1 padded to 2 places');
    test(1, [3], '001', '1 padded to 3 places');
    test(1, [4], '0001', '1 padded to 4 places');
    test(547, [0], '547', '547 no padding');
    test(547, [1], '547', '547 padded to 1 place');
    test(547, [2], '547', '547 padded to 2 places');
    test(547, [3], '547', '547 padded to 3 places');
    test(547, [4], '0547', '547 padded to 4 places');
    test(0, [0], '0', '0 no padding');
    test(0, [1], '0', '0 padded to 1 place');
    test(0, [2], '00', '0 padded to 2 places');
    test(0, [3], '000', '0 padded to 3 places');
    test(0, [4], '0000', '0 padded to 4 places');
    test(-1, [1], '-1', '-1 padded to 1 places');
    test(-1, [2], '-01', '-1 padded to 2 places');
    test(-1, [3], '-001', '-1 padded to 3 places');
    test(-1, [4], '-0001', '-1 padded to 4 places');
    test(1, [1, true], '+1', '1 padded to 1 places and sign');
    test(1, [2, true], '+01', '1 padded to 2 places and sign');
    test(1, [3, true], '+001', '1 padded to 3 places and sign');
    test(1, [4, true], '+0001', '1 padded to 4 places and sign');
    test(0, [1, true], '+0', '0 padded to 1 place and sign');
    test(547.528, [4], '0547.528', 'does not take decimal places into account');

    test(255, [4, false, 16], '00ff', 'handles hex');
    test(2, [4, false, 2], '0010', 'handles binary');
  });

  method('hex', function() {
    test(0, '0');
    test(10, 'a');
    test(255, 'ff');
    test(0.5, '0.8');
    test(2.5, '2.8');
    test(2553423, '26f64f');

    withArgs([2], function() {
      test(0, '00');
      test(10, '0a');
      test(255, 'ff');
      test(0.5, '00.8');
      test(2.5, '02.8');
    });

    withArgs([4], function() {
      test(0, '0000');
      test(10, '000a');
      test(255, '00ff');
      test(0.5, '0000.8');
      test(2.5, '0002.8');
    });
  });

  method('isInteger', function() {
    test(15, true);
    test(15.2, false);
    test(15.2668, false);
    test(15.0, true);
    test('15', true);
    test('15.8', false);
  });

  method('abbr', function() {
    test(1, '1');
    test(10, '10');
    test(100, '100');
    test(1000, '1k');
    test(10000, '10k');
    test(100000, '100k');
    test(1000000, '1m');
    test(10000000, '10m');
    test(100000000, '100m');
    test(1000000000, '1b');
    test(10000000000, '10b');
    test(100000000000, '100b');
    test(1000000000000, '1t');
    test(1000000000000000000, '1,000,000t');

    test(1, '1');
    test(12, '12');
    test(124, '124');
    test(1249, '1k');
    test(1749, '2k');
    test(12495, '12k');
    test(17495, '17k');
    test(124958, '125k');
    test(174958, '175k');
    test(1249584, '1m');
    test(1749584, '2m');

    withArgs([1], function() {
      test(1, '1', 'decimal 1 place | 1');
      test(12, '12', 'decimal 1 place | 12');
      test(124, '124', 'decimal 1 place | 124');
      test(1249, '1.2k', 'decimal 1 place | 1,249');
      test(1749, '1.7k', 'decimal 1 place | 1,749');
      test(12495, '12.5k', 'decimal 1 place | 12,495');
      test(17495, '17.5k', 'decimal 1 place | 17,495');
      test(124958, '125k', 'decimal 1 place | 124,958');
      test(174958, '175k', 'decimal 1 place | 174,958');
      test(1249584, '1.2m', 'decimal 1 place | 1,249,584');
      test(1749584, '1.7m', 'decimal 1 place | 1,749,584');
    });

    withArgs([2], function() {
      test(1, '1', 'decimal 2 places | 1');
      test(12, '12', 'decimal 2 places | 12');
      test(124, '124', 'decimal 2 places | 124');
      test(1249, '1.25k', 'decimal 2 places | 1,249');
      test(1749, '1.75k', 'decimal 2 places | 1,749');
      test(12495, '12.5k', 'decimal 2 places | 12,495');
      test(17495, '17.5k', 'decimal 2 places | 17,495');
      test(124958, '124.96k', 'decimal 2 places | 124,958');
      test(174958, '174.96k', 'decimal 2 places | 174,958');
      test(1249584, '1.25m', 'decimal 2 places | 1,249,584');
      test(1749584, '1.75m', 'decimal 2 places | 1,749,584');
    });

    withArgs([3], function() {
      test(1, '1', 'decimal 3 places | 1');
      test(12, '12', 'decimal 3 places | 12');
      test(124, '124', 'decimal 3 places | 124');
      test(1249, '1.249k', 'decimal 3 places | 1,249');
      test(1749, '1.749k', 'decimal 3 places | 1,749');
      test(12495, '12.495k', 'decimal 3 places | 12,495');
      test(17495, '17.495k', 'decimal 3 places | 17,495');
      test(124958, '124.958k', 'decimal 3 places | 124,958');
      test(174958, '174.958k', 'decimal 3 places | 174,958');
      test(1249584, '1.25m', 'decimal 3 places | 1,249,584');
      test(1749584, '1.75m', 'decimal 3 places | 1,749,584');

      // Issue #422
      Sugar.Number.setOption('decimal', ',');
      test(1749584, '1,75m', 'should respect global decimal marker');
      Sugar.Number.setOption('decimal', null);
    });

    withArgs([-1], function() {
      test(1, '0', 'decimal -1 places | 1');
      test(12, '10', 'decimal -1 places | 12');
      test(124, '120', 'decimal -1 places | 124');
      test(1249, '0k', 'decimal -1 places | 1,249');
      test(1749, '0k', 'decimal -1 places | 1,749');
      test(12495, '10k', 'decimal -1 places | 12,495');
      test(17495, '20k', 'decimal -1 places | 17,495');
      test(124958, '120k', 'decimal -1 places | 124,958');
      test(174958, '170k', 'decimal -1 places | 174,958');
      test(1249584, '0m', 'decimal -1 places | 1,249,584');
      test(1749584, '0m', 'decimal -1 places | 1,749,584');
    });

    test(0.1, '0', '0.1');
    test(0.01, '0', '0.01');
    test(0.001, '0', '0.001');
    test(0.0001, '0', '0.00001');
    test(0.00001, '0', '0.000001');
    test(0.000001, '0', '0.0000001');
    test(0.0000001, '0', '0.00000001');
    test(0.00000001, '0', '0.000000001');

    test(1.1, '1', '1.1');
    test(1.01, '1', '1.01');
    test(1.001, '1', '1.001');
    test(1.0001, '1', '1.00001');
    test(1.00001, '1', '1.000001');
    test(1.000001, '1', '1.0000001');
    test(1.0000001, '1', '1.00000001');
    test(1.00000001, '1', '1.000000001');

    test(1000.004, '1k', '1000.004');
    test(10000.004, '10k', '10,000.004');
    test(100000.004, '100k', '100,000.004');
    test(1000000.004, '1m', '1,000,000.004');

    withArgs([2], function() {
      test(1000.004, '1k', '2 places | 1000.004');
      test(10000.004, '10k', '2 places | 10,000.004');
      test(100000.004, '100k', '2 places | 100,000.004');
      test(1000000.004, '1m', '2 places | 1,000,000.004');
    });
  });

  method('metric', function() {

    test(1, '1');
    test(10, '10');
    test(100, '100');
    test(1000, '1k');
    test(10000, '10k');
    test(100000, '100k');
    test(1000000, '1,000k');
    test(10000000, '10,000k');
    test(100000000, '100,000k');
    test(1000000000, '1,000,000k');
    test(10000000000, '10,000,000k');
    test(100000000000, '100,000,000k');
    test(1000000000000, '1,000,000,000k');
    test(10000000000000, '10,000,000,000k');
    test(100000000000000, '100,000,000,000k');
    test(1000000000000000, '1,000,000,000,000k');
    test(10000000000000000, '10,000,000,000,000k');
    test(100000000000000000, '100,000,000,000,000k');

    test(1, '1', 'decimal | 1');
    test(12, '12', 'decimal | 12');
    test(124, '124', 'decimal | 124');
    test(1249, '1k', 'decimal | 1,249');
    test(1749, '2k', 'decimal | 1,749');
    test(12495, '12k', 'decimal | 12,495');
    test(17495, '17k', 'decimal | 17,495');
    test(124958, '125k', 'decimal | 124,958');
    test(174958, '175k', 'decimal | 174,958');
    test(1249584, '1,250k', 'decimal | 1,249,584');
    test(1749584, '1,750k', 'decimal | 1,749,584');
    test(1249584000, '1,249,584k', 'decimal | 1,249,584,000');
    test(1749584000, '1,749,584k', 'decimal | 1,749,584,000');

    test(0.1000000000000, '100m',    'fractional | 0.1');
    test(0.0100000000000, '10m',     'fractional | 0.01');
    test(0.0010000000000, '1m',      'fractional | 0.001');
    test(0.0001000000000, '100μ',    'fractional | 0.0001');
    test(0.0000100000000, '10μ',     'fractional | 0.00001');
    test(0.0000010000000, '1μ',      'fractional | 0.000001');
    test(0.0000001000000, '100n',    'fractional | 0.0000001');
    test(0.0000000100000, '10n',     'fractional | 0.00000001');
    test(0.0000000010000, '1n',      'fractional | 0.000000001');
    test(0.0000000001000, '0.1n',    'fractional | 0.0000000001');
    test(0.0000000000100, '0.01n',   'fractional | 0.00000000001');
    test(0.0000000000010, '0.001n',  'fractional | 0.000000000001');
    test(0.0000000000001, '0.0001n', 'fractional | 0.0000000000001');

    test(0.1111111111111, '111m',    'fractional | 0 places | 0.1111111111111');
    test(0.0111111111111, '11m',     'fractional | 0 places | 0.0111111111111');
    test(0.0011111111111, '1m',      'fractional | 0 places | 0.0011111111111');
    test(0.0001111111111, '111μ',    'fractional | 0 places | 0.0001111111111');
    test(0.0000111111111, '11μ',     'fractional | 0 places | 0.0000111111111');
    test(0.0000011111111, '1μ',      'fractional | 0 places | 0.0000011111111');
    test(0.0000001111111, '111n',    'fractional | 0 places | 0.0000001111111');
    test(0.0000000111111, '11n',     'fractional | 0 places | 0.0000000111111');
    test(0.0000000011111, '1n',      'fractional | 0 places | 0.0000000011111');
    test(0.0000000001111, '0.1n',    'fractional | 0 places | 0.0000000001111');
    test(0.0000000000111, '0.01n',   'fractional | 0 places | 0.0000000000111');
    test(0.0000000000011, '0.001n',  'fractional | 0 places | 0.0000000000011');
    test(0.0000000000001, '0.0001n', 'fractional | 0 places | 0.0000000000001');

    test(0.000000000000000001, '1e-9n', 'fractional | 0 places | 0.0000000000001');

    test(1.1111111111111, '1', 'fractional | 0 places | 1.1111111111111');
    test(1.0111111111111, '1', 'fractional | 0 places | 1.0111111111111');
    test(1.0011111111111, '1', 'fractional | 0 places | 1.0011111111111');
    test(1.0001111111111, '1', 'fractional | 0 places | 1.0001111111111');
    test(1.0000111111111, '1', 'fractional | 0 places | 1.0000111111111');
    test(1.0000011111111, '1', 'fractional | 0 places | 1.0000011111111');
    test(1.0000001111111, '1', 'fractional | 0 places | 1.0000001111111');
    test(1.0000000111111, '1', 'fractional | 0 places | 1.0000000111111');
    test(1.0000000011111, '1', 'fractional | 0 places | 1.0000000011111');
    test(1.0000000001111, '1', 'fractional | 0 places | 1.0000000001111');
    test(1.0000000000111, '1', 'fractional | 0 places | 1.0000000000111');
    test(1.0000000000011, '1', 'fractional | 0 places | 1.0000000000011');
    test(1.0000000000001, '1', 'fractional | 0 places | 1.0000000000001');

    test(1.1000000000001, '1', 'fractional | 0 places | 1.1000000000001');
    test(1.0100000000001, '1', 'fractional | 0 places | 1.0100000000001');
    test(1.0010000000001, '1', 'fractional | 0 places | 1.0010000000001');
    test(1.0001000000001, '1', 'fractional | 0 places | 1.0001000000001');
    test(1.0000100000001, '1', 'fractional | 0 places | 1.0000100000001');
    test(1.0000010000001, '1', 'fractional | 0 places | 1.0000010000001');
    test(1.0000001000001, '1', 'fractional | 0 places | 1.0000001000001');
    test(1.0000000100001, '1', 'fractional | 0 places | 1.0000000100001');
    test(1.0000000010001, '1', 'fractional | 0 places | 1.0000000010001');
    test(1.0000000001001, '1', 'fractional | 0 places | 1.0000000001001');
    test(1.0000000000101, '1', 'fractional | 0 places | 1.0000000000101');
    test(1.0000000000011, '1', 'fractional | 0 places | 1.0000000000011');
    test(1.0000000000001, '1', 'fractional | 0 places | 1.0000000000001');

    withArgs([0, 'all'], function() {
      test(10000000, '10M');
      test(100000000, '100M');
      test(1000000000, '1G');
      test(10000000000, '10G');
      test(100000000000, '100G');
      test(1000000000000, '1T');
      test(10000000000000, '10T');
      test(100000000000000, '100T');
      test(1000000000000000, '1P');
      test(10000000000000000, '10P');
      test(100000000000000000, '100P');

      test(1, '1', 'decimal | 1');
      test(12, '12', 'decimal | 12');
      test(124, '124', 'decimal | 124');
      test(1249, '1K', 'decimal | 1,249');
      test(1749, '2K', 'decimal | 1,749');
      test(12495, '12K', 'decimal | 12,495');
      test(17495, '17K', 'decimal | 17,495');
      test(124958, '125K', 'decimal | 124,958');
      test(174958, '175K', 'decimal | 174,958');
      test(1249584, '1M', 'decimal | 1,249,584');
      test(1749584, '2M', 'decimal | 1,749,584');
      test(1249584000, '1G', 'decimal | 1,249,584,000');
      test(1749584000, '2G', 'decimal | 1,749,584,000');
    });

    withArgs([1], function() {
      test(1, '1', 'decimal 1 place | 1');
      test(12, '12', 'decimal 1 place | 12');
      test(124, '124', 'decimal 1 place | 124');
      test(1249, '1.2k', 'decimal 1 place | 1,249');
      test(1749, '1.7k', 'decimal 1 place | 1,749');
      test(12495, '12.5k', 'decimal 1 place | 12,495');
      test(17495, '17.5k', 'decimal 1 place | 17,495');
      test(124958, '125k', 'decimal 1 place | 124,958');
      test(174958, '175k', 'decimal 1 place | 174,958');
      test(1249584, '1,249.6k', 'decimal 1 place | 1,249,584');

      // Issue #422
      Sugar.Number.setOption('decimal', ',');
      test(3232, [1], '3,2k', 'should respect global decimal marker');
      Sugar.Number.setOption('decimal', null);
    });

    withArgs([1, 'all'], function() {
      test(1, '1', 'decimal 1 place | 1');
      test(12, '12', 'decimal 1 place | 12');
      test(124, '124', 'decimal 1 place | 124');
      test(1249, '1.2K', 'decimal 1 place | 1,249');
      test(1749, '1.7K', 'decimal 1 place | 1,749');
      test(12495, '12.5K', 'decimal 1 place | 12,495');
      test(17495, '17.5K', 'decimal 1 place | 17,495');
      test(124958, '125K', 'decimal 1 place | 124,958');
      test(174958, '175K', 'decimal 1 place | 174,958');
      test(1249584, '1.2M', 'decimal 1 place | 1,249,584');
      test(1749584, '1.7M', 'decimal 1 place | 1,749,584');
      test(1249584000, '1.2G', 'decimal 1 place | 1,249,584,000');
      test(1749584000, '1.7G', 'decimal 1 place | 1,749,584,000');
    });

    withArgs([2], function() {
      test(1, '1', 'decimal 2 places | 1');
      test(12, '12', 'decimal 2 places | 12');
      test(124, '124', 'decimal 2 places | 124');
      test(1249, '1.25k', 'decimal 2 places | 1,249');
      test(1749, '1.75k', 'decimal 2 places | 1,749');
      test(12495, '12.5k', 'decimal 2 places | 12,495');
      test(17495, '17.5k', 'decimal 2 places | 17,495');
      test(124958, '124.96k', 'decimal 2 places | 124,958');
      test(174958, '174.96k', 'decimal 2 places | 174,958');
      test(1249584, '1,249.58k', 'decimal 2 places | 1,249,584');
    });

    withArgs([2, 'all'], function() {
      test(1, '1', 'decimal 2 places | 1');
      test(12, '12', 'decimal 2 places | 12');
      test(124, '124', 'decimal 2 places | 124');
      test(1249, '1.25K', 'decimal 2 places | 1,249');
      test(1749, '1.75K', 'decimal 2 places | 1,749');
      test(12495, '12.5K', 'decimal 2 places | 12,495');
      test(17495, '17.5K', 'decimal 2 places | 17,495');
      test(124958, '124.96K', 'decimal 2 places | 124,958');
      test(174958, '174.96K', 'decimal 2 places | 174,958');
      test(1249584, '1.25M', 'decimal 2 places | 1,249,584');
      test(1749584, '1.75M', 'decimal 2 places | 1,749,584');
      test(1249584000, '1.25G', 'decimal 2 places | 1,249,584,000');
      test(1749584000, '1.75G', 'decimal 2 places | 1,749,584,000');
    });

    withArgs([3], function() {
      test(1, '1', 'decimal 3 places | 1');
      test(12, '12', 'decimal 3 places | 12');
      test(124, '124', 'decimal 3 places | 124');
      test(1249, '1.249k', 'decimal 3 places | 1,249');
      test(1749, '1.749k', 'decimal 3 places | 1,749');
      test(12495, '12.495k', 'decimal 3 places | 12,495');
      test(17495, '17.495k', 'decimal 3 places | 17,495');
      test(124958, '124.958k', 'decimal 3 places | 124,958');
      test(174958, '174.958k', 'decimal 3 places | 174,958');
      test(1249584, '1,249.584k', 'decimal 3 places | 1,249,584');
    });

    withArgs([3, 'all'], function() {
      test(1, '1', 'decimal 3 places | 1');
      test(12, '12', 'decimal 3 places | 12');
      test(124, '124', 'decimal 3 places | 124');
      test(1249, '1.249K', 'decimal 3 places | 1,249');
      test(1749, '1.749K', 'decimal 3 places | 1,749');
      test(12495, '12.495K', 'decimal 3 places | 12,495');
      test(17495, '17.495K', 'decimal 3 places | 17,495');
      test(124958, '124.958K', 'decimal 3 places | 124,958');
      test(174958, '174.958K', 'decimal 3 places | 174,958');
      test(1249584, '1.25M', 'decimal 3 places | 1,249,584');
      test(1749584, '1.75M', 'decimal 3 places | 1,749,584');
      test(1249584000, '1.25G', 'decimal 3 places | 1,249,584,000');
      test(1749584000, '1.75G', 'decimal 3 places | 1,749,584,000');
    });

    withArgs([-1], function() {
      test(1, '0', 'decimal -1 places | 1');
      test(12, '10', 'decimal -1 places | 12');
      test(124, '120', 'decimal -1 places | 124');
      test(1249, '0k', 'decimal -1 places | 1,249');
      test(1749, '0k', 'decimal -1 places | 1,749');
      test(12495, '10k', 'decimal -1 places | 12,495');
      test(17495, '20k', 'decimal -1 places | 17,495');
      test(124958, '120k', 'decimal -1 places | 124,958');
      test(174958, '170k', 'decimal -1 places | 174,958');
      test(1249584, '1,250k', 'decimal -1 places | 1,249,584');
    });

    withArgs([-1, 'all'], function() {
      test(1, '0', 'decimal -1 places | 1');
      test(12, '10', 'decimal -1 places | 12');
      test(124, '120', 'decimal -1 places | 124');
      test(1249, '0K', 'decimal -1 places | 1,249');
      test(1749, '0K', 'decimal -1 places | 1,749');
      test(12495, '10K', 'decimal -1 places | 12,495');
      test(17495, '20K', 'decimal -1 places | 17,495');
      test(124958, '120K', 'decimal -1 places | 124,958');
      test(174958, '170K', 'decimal -1 places | 174,958');
      test(1249584, '0M', 'decimal -1 places | 1,249,584');
      test(1749584, '0M', 'decimal -1 places | 1,749,584');
      test(1249584000, '0G', 'decimal -1 places | 1,249,584,000');
      test(1749584000, '0G', 'decimal -1 places | 1,749,584,000');
    });

    withArgs([2], function() {
      test(0.1111111111111, '111.11m', 'fractional | 2 places | 0.1111111111111');
      test(0.0111111111111, '11.11m',  'fractional | 2 places | 0.0111111111111');
      test(0.0011111111111, '1.11m',   'fractional | 2 places | 0.0011111111111');
      test(0.0001111111111, '111.11μ', 'fractional | 2 places | 0.0001111111111');
      test(0.0000111111111, '11.11μ',  'fractional | 2 places | 0.0000111111111');
      test(0.0000011111111, '1.11μ',   'fractional | 2 places | 0.0000011111111');
      test(0.0000001111111, '111.11n', 'fractional | 2 places | 0.0000001111111');
      test(0.0000000111111, '11.11n',  'fractional | 2 places | 0.0000000111111');
      test(0.0000000011111, '1.11n',   'fractional | 2 places | 0.0000000011111');
      test(0.0000000001111, '0.1n',    'fractional | 2 places | 0.0000000001111');
      test(0.0000000000111, '0.01n',   'fractional | 2 places | 0.0000000000111');
      test(0.0000000000011, '0.001n',  'fractional | 2 places | 0.0000000000011');
      test(0.0000000000001, '0.0001n', 'fractional | 2 places | 0.0000000000001');

      test(1.1111111111111, '1.11', 'fractional | 2 places | 1.1111111111111');
      test(1.0111111111111, '1.01', 'fractional | 2 places | 1.0111111111111');
      test(1.0011111111111, '1',    'fractional | 2 places | 1.0011111111111');
      test(1.0001111111111, '1',    'fractional | 2 places | 1.0001111111111');
      test(1.0000111111111, '1',    'fractional | 2 places | 1.0000111111111');
      test(1.0000011111111, '1',    'fractional | 2 places | 1.0000011111111');
      test(1.0000001111111, '1',    'fractional | 2 places | 1.0000001111111');
      test(1.0000000111111, '1',    'fractional | 2 places | 1.0000000111111');
      test(1.0000000011111, '1',    'fractional | 2 places | 1.0000000011111');
      test(1.0000000001111, '1',    'fractional | 2 places | 1.0000000001111');
      test(1.0000000000111, '1',    'fractional | 2 places | 1.0000000000111');
      test(1.0000000000011, '1',    'fractional | 2 places | 1.0000000000011');
      test(1.0000000000001, '1',    'fractional | 2 places | 1.0000000000001');

      test(1.1000000000001, '1.1',  'fractional | 2 places | 1.1000000000001');
      test(1.0100000000001, '1.01', 'fractional | 2 places | 1.0100000000001');
      test(1.0010000000001, '1',    'fractional | 2 places | 1.0010000000001');
      test(1.0001000000001, '1',    'fractional | 2 places | 1.0001000000001');
      test(1.0000100000001, '1',    'fractional | 2 places | 1.0000100000001');
      test(1.0000010000001, '1',    'fractional | 2 places | 1.0000010000001');
      test(1.0000001000001, '1',    'fractional | 2 places | 1.0000001000001');
      test(1.0000000100001, '1',    'fractional | 2 places | 1.0000000100001');
      test(1.0000000010001, '1',    'fractional | 2 places | 1.0000000010001');
      test(1.0000000001001, '1',    'fractional | 2 places | 1.0000000001001');
      test(1.0000000000101, '1',    'fractional | 2 places | 1.0000000000101');
      test(1.0000000000011, '1',    'fractional | 2 places | 1.0000000000011');
      test(1.0000000000001, '1',    'fractional | 2 places | 1.0000000000001');
    });

    equal(run(0.0001)     + 'm', '100μm',       '100μm');
    equal(run(0.001)      + 'm', '1mm',         '1mm');
    equal(run(0.01)       + 'm', '10mm',        '10mm');
    equal(run(0.1)        + 'm', '100mm',       '100mm');
    equal(run(1)          + 'm', '1m',          '1m');
    equal(run(1000)       + 'm', '1km',         '1km');
    equal(run(1000000)    + 'm', '1,000km',     '1,000km');
    equal(run(1000000000) + 'm', '1,000,000km', '1,000,000km');

    withArgs([0, '|'], function() {
      equal(run(1000000000) + 'm', '1,000,000,000m', 'limited to meters | 1,000,000,000m');
      equal(run(1000000)    + 'm', '1,000,000m',     'limited to meters | 1,000,000m');
      equal(run(1000)       + 'm', '1,000m',         'limited to meters | 1,000m');
      equal(run(1)          + 'm', '1m',             'limited to meters | 1m');
    });

    test(12334.5880, '12k', 'fractional | 0 places | 12334.5880');
    test(12334.5880, [3], '12.335k', 'fractional | 3 places | 12334.5880');
    test(.588500, [9], '588.5m', 'fractional | 9 places | .5885');
    test(.580085, [9], '580.085m', 'fractional | 9 places | .580085');
    test(.580085, [7], '580.085m', 'fractional | 7 places | .580085');
    test(.580085, [5], '580.085m', 'fractional | 5 places | .580085');
    test(.580085, [3], '580.085m', 'fractional | 3 places | .580085');
    test(.580085, [1], '580.1m', 'fractional | 1 places | .580085');
    test(12323.424558, [3, '|'], '12,323.425', 'limited and 3 decimals');

    equal(run(1, 'metric', [0, '']) + 'm', '1m', 'no format uses short');
    equal(run(1000, 'metric', [0, '|']) + 'm', '1,000m', 'simple placeholder limits');

    equal(run(1, 'metric', [0, 'm']) + 'm', '1,000mm', 'millimeter max');
    equal(run(1, 'metric', [0, 'μ_']) + 'm', '1,000,000μm', 'micrometer max');
    equal(run(1, 'metric', [0, 'n__']) + 'm', '1,000,000,000nm', 'nanometer max');
    equal(run(1, 'metric', [3, '_k']) + 'm', '0.001km', 'kilometer min');

    equal(run(0.0000001, 'metric', [0, 'nμ_']) + 'm', '100nm', '100nm with micrometer max');
    equal(run(0.0001,    'metric', [0, 'nμ_']) + 'm', '100μm', '100μm with micrometer max');

    equal(run(1000000, 'metric', [3, '_KG']) + 'W', '1GW', 'minimum can format higher');
  });

  method('bytes', function() {

    test(1,                  '1B',    'default | 1B   ');
    test(10,                 '10B',   'default | 10B  ');
    test(100,                '100B',  'default | 100B ');
    test(1000,               '1KB',   'default | 1KB  ');
    test(10000,              '10KB',  'default | 10KB ');
    test(100000,             '100KB', 'default | 100KB');
    test(1000000,            '1MB',   'default | 1MB  ');
    test(10000000,           '10MB',  'default | 10MB ');
    test(100000000,          '100MB', 'default | 100MB');
    test(1000000000,         '1GB',   'default | 1GB  ');
    test(10000000000,        '10GB',  'default | 10GB ');
    test(100000000000,       '100GB', 'default | 100GB');
    test(1000000000000,      '1TB',   'default | 1TB  ');
    test(10000000000000,     '10TB',  'default | 10TB ');
    test(100000000000000,    '100TB', 'default | 100TB');
    test(1000000000000000,   '1PB',   'default | 1PB  ');
    test(10000000000000000,  '10PB',  'default | 10PB ');
    test(100000000000000000, '100PB', 'default | 100PB');

    withArgs([2], function() {
      test(1,                  '1B',    '2 places | 1B   ');
      test(10,                 '10B',   '2 places | 10B  ');
      test(100,                '100B',  '2 places | 100B ');
      test(1000,               '1KB',   '2 places | 1KB  ');
      test(10000,              '10KB',  '2 places | 10KB ');
      test(100000,             '100KB', '2 places | 100KB');
      test(1000000,            '1MB',   '2 places | 1MB  ');
      test(10000000,           '10MB',  '2 places | 10MB ');
      test(100000000,          '100MB', '2 places | 100MB');
      test(1000000000,         '1GB',   '2 places | 1GB  ');
      test(10000000000,        '10GB',  '2 places | 10GB ');
      test(100000000000,       '100GB', '2 places | 100GB');
      test(1000000000000,      '1TB',   '2 places | 1TB  ');
      test(10000000000000,     '10TB',  '2 places | 10TB ');
      test(100000000000000,    '100TB', '2 places | 100TB');
      test(1000000000000000,   '1PB',   '2 places | 1PB  ');
      test(10000000000000000,  '10PB',  '2 places | 10PB ');
      test(100000000000000000, '100PB', '2 places | 100PB');
    });

    withArgs([0, true], function() {
      test(1,                  '1B',    '0 places | base 2 | 1B    ');
      test(10,                 '10B',   '0 places | base 2 | 10B   ');
      test(100,                '100B',  '0 places | base 2 | 100B  ');
      test(1000,               '1KiB',  '0 places | base 2 | 1KiB  ');
      test(10000,              '10KiB', '0 places | base 2 | 10KiB ');
      test(100000,             '98KiB', '0 places | base 2 | 100KiB');
      test(1000000,            '1MiB',  '0 places | base 2 | 1MiB  ');
      test(10000000,           '10MiB', '0 places | base 2 | 10MiB ');
      test(100000000,          '95MiB', '0 places | base 2 | 100MiB');
      test(1000000000,         '1GiB',  '0 places | base 2 | 1GiB  ');
      test(10000000000,        '9GiB',  '0 places | base 2 | 10GiB ');
      test(100000000000,       '93GiB', '0 places | base 2 | 100GiB');
      test(1000000000000,      '1TiB',  '0 places | base 2 | 1TiB  ');
      test(10000000000000,     '9TiB',  '0 places | base 2 | 10TiB ');
      test(100000000000000,    '91TiB', '0 places | base 2 | 100TiB');
      test(1000000000000000,   '1PiB',  '0 places | base 2 | 1PiB  ');
      test(10000000000000000,  '9PiB',  '0 places | base 2 | 10PiB ');
      test(100000000000000000, '89PiB', '0 places | base 2 | 100PiB');
    });

    withArgs([2, true], function() {

      test(1,                  '1B',       '2 places | base 2 | 1B   ');
      test(10,                 '10B',      '2 places | base 2 | 10B  ');
      test(100,                '100B',     '2 places | base 2 | 100B ');
      test(1000,               '0.98KiB',  '2 places | base 2 | 1KB  ');
      test(10000,              '9.77KiB',  '2 places | base 2 | 10KB ');
      test(100000,             '97.66KiB', '2 places | base 2 | 100KB');
      test(1000000,            '0.95MiB',  '2 places | base 2 | 1MB  ');
      test(10000000,           '9.54MiB',  '2 places | base 2 | 10MB ');
      test(100000000,          '95.37MiB', '2 places | base 2 | 100MB');
      test(1000000000,         '0.93GiB',  '2 places | base 2 | 1GB  ');
      test(10000000000,        '9.31GiB',  '2 places | base 2 | 10GB ');
      test(100000000000,       '93.13GiB', '2 places | base 2 | 100GB');
      test(1000000000000,      '0.91TiB',  '2 places | base 2 | 1TB  ');
      test(10000000000000,     '9.09TiB',  '2 places | base 2 | 10TB ');
      test(100000000000000,    '90.95TiB', '2 places | base 2 | 100TB');
      test(1000000000000000,   '0.89PiB',  '2 places | base 2 | 1PB  ');
      test(10000000000000000,  '8.88PiB',  '2 places | base 2 | 10PB ');
      test(100000000000000000, '88.82PiB', '2 places | base 2 | 100PB');

      // Issue #422
      Sugar.Number.setOption('decimal', ',');
      test(1000, '0,98KiB', 'should respect global decimal');
      Sugar.Number.setOption('decimal', null);

    });

    withArgs([0, true, 'si'], function() {
      test(1,                  '1B',   'base 2 with si units | 1B    ');
      test(10,                 '10B',  'base 2 with si units | 10B   ');
      test(100,                '100B', 'base 2 with si units | 100B  ');
      test(1000,               '1KB',  'base 2 with si units | 1KB  ');
      test(10000,              '10KB', 'base 2 with si units | 10KB ');
      test(100000,             '98KB', 'base 2 with si units | 100KB');
      test(1000000,            '1MB',  'base 2 with si units | 1MB  ');
      test(10000000,           '10MB', 'base 2 with si units | 10MB ');
      test(100000000,          '95MB', 'base 2 with si units | 100MB');
      test(1000000000,         '1GB',  'base 2 with si units | 1GB  ');
      test(10000000000,        '9GB',  'base 2 with si units | 10GB ');
      test(100000000000,       '93GB', 'base 2 with si units | 100GB');
      test(1000000000000,      '1TB',  'base 2 with si units | 1TB  ');
      test(10000000000000,     '9TB',  'base 2 with si units | 10TB ');
      test(100000000000000,    '91TB', 'base 2 with si units | 100TB');
      test(1000000000000000,   '1PB',  'base 2 with si units | 1PB  ');
      test(10000000000000000,  '9PB',  'base 2 with si units | 10PB ');
      test(100000000000000000, '89PB', 'base 2 with si units | 100PB');
    });

    withArgs([0, false, 'binary'], function() {

      test(1,                  '1B',     'base 10 with binary units | 1B    ');
      test(10,                 '10B',    'base 10 with binary units | 10B   ');
      test(100,                '100B',   'base 10 with binary units | 100B  ');
      test(1000,               '1KiB',   'base 10 with binary units | 1KiB  ');
      test(10000,              '10KiB',  'base 10 with binary units | 10KiB ');
      test(100000,             '100KiB', 'base 10 with binary units | 100KiB');
      test(1000000,            '1MiB',   'base 10 with binary units | 1MiB  ');
      test(10000000,           '10MiB',  'base 10 with binary units | 10MiB ');
      test(100000000,          '100MiB', 'base 10 with binary units | 100MiB');
      test(1000000000,         '1GiB',   'base 10 with binary units | 1GiB  ');
      test(10000000000,        '10GiB',  'base 10 with binary units | 10GiB ');
      test(100000000000,       '100GiB', 'base 10 with binary units | 100GiB');
      test(1000000000000,      '1TiB',   'base 10 with binary units | 1TiB  ');
      test(10000000000000,     '10TiB',  'base 10 with binary units | 10TiB ');
      test(100000000000000,    '100TiB', 'base 10 with binary units | 100TiB');
      test(1000000000000000,   '1PiB',   'base 10 with binary units | 1PiB  ');
      test(10000000000000000,  '10PiB',  'base 10 with binary units | 10PiB ');
      test(100000000000000000, '100PiB', 'base 10 with binary units | 100PiB');

    });

    test(1024,    [0, true], '1KiB', '1024 bytes is 1KiB');
    test(1048576, [0, true], '1MiB', '2 places | 1048576 bytes is 1MiB');
    test(1024,    [2, true], '1KiB', '2 places | 1024 bytes is 1KiB');
    test(1048576, [2, true], '1MiB', '2 places | 1048576 bytes is 1MiB');

    test(Math.pow(10, 16), [0,  true], '9PiB', '10 ^ 16 bytes');
    test(Math.pow(10, 16), [-2, true], '0PiB', '10 ^ 16 bytes | -2 places');
  });

});
