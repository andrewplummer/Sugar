'use strict';

namespace('Number', function() {

  /*
  TODO: what about these?
  group('Options', function() {
    equal(Sugar.Number.getOption('thousands'), ',', 'Thousands should be comma by default');
    equal(Sugar.Number.getOption('decimal'), '.', 'Decimal should be dot by default');
  });
  */

  method('random', function(random) {
    assertOneOf(random(), [0,1]);
    assertOneOf(random(10), [0,1,2,3,4,5,6,7,8,9,10]);
    assertOneOf(random(25, 30), [25,26,27,28,29,30]);
    assertOneOf(random(30, 25), [25,26,27,28,29,30]);
    assertOneOf(random(-5, -2), [-5,-4,-3,-2]);
    assertOneOf(random(0, 0), [0]);
  });

  method('round', function(round) {
    assertEqual(round(3), 3);
    assertEqual(round(3.241), 3);
    assertEqual(round(3.752), 4);
    assertEqual(round(-3.241), -3);
    assertEqual(round(-3.752), -4);
    assertEqual(round(3.241, 1), 3.2);
    assertEqual(round(3.752, 1), 3.8);
    assertEqual(round(3.241, 2), 3.24);
    assertEqual(round(3.752, 2), 3.75);
    assertEqual(round(322855.241, -2), 322900);
    assertEqual(round(322855.241, -3), 323000);
    assertEqual(round(322855.241, -4), 320000);
    assertEqual(round(322855.241, -6), 0);
    assertEqual(round(722855.241, -6), 1000000);
    assertEqual(round(722855.241, -8), 0);
    assertEqual(round(1e-21, 1), 0);
    assertEqual(round(1e-21, -1), 0);
  });

  method('ceil', function(ceil) {
    assertEqual(ceil(5.5), 6);
    assertEqual(ceil(5.14), 6);
    assertEqual(ceil(5), 5);
    assertEqual(ceil(-5.5), -5);
    assertEqual(ceil(-5.14), -5);
    assertEqual(ceil(-5), -5);
    assertEqual(ceil(4417.1318, 0), 4418);
    assertEqual(ceil(4417.1318, 1), 4417.2);
    assertEqual(ceil(4417.1318, 2), 4417.14);
    assertEqual(ceil(4417.1318, 3), 4417.132);
    assertEqual(ceil(4417.1318, -1), 4420);
    assertEqual(ceil(4417.1318, -2), 4500);
    assertEqual(ceil(4417.1318, -3), 5000);
  });

  method('floor', function(floor) {
    assertEqual(floor(5.5), 5);
    assertEqual(floor(5.14), 5);
    assertEqual(floor(5.9), 5);
    assertEqual(floor(5), 5);
    assertEqual(floor(-5.5), -6);
    assertEqual(floor(-5.14), -6);
    assertEqual(floor(-5), -5);
    assertEqual(floor(4417.1318, [0]), 4417);
    assertEqual(floor(4417.1318, [1]), 4417.1);
    assertEqual(floor(4417.1318, [2]), 4417.13);
    assertEqual(floor(4417.1318, [3]), 4417.131);
    assertEqual(floor(4417.1318, [-1]), 4410);
    assertEqual(floor(4417.1318, [-2]), 4400);
    assertEqual(floor(4417.1318, [-3]), 4000);
  });

  method('trunc', function(trunc) {
    assertEqual(trunc(5), 5);
    assertEqual(trunc(5.25), 5);
    assertEqual(trunc(NaN), NaN);
    assertEqual(trunc(Infinity), Infinity);
    assertEqual(trunc(5.25, 1), 5.2);
    assertEqual(trunc(5.25, 2), 5.25);
    assertEqual(trunc(-5.25, 1), -5.2);
    assertEqual(trunc(-5.25, 2), -5.25);
  });

  method('abs', function(abs) {
    assertEqual(abs(-5), 5);
    assertEqual(abs(5), 5);
    assertEqual(abs(-3.324), 3.324);
    assertEqual(abs(3.324), 3.324);
  });

  method('pow', function(pow) {
    assertEqual(pow(3, [2]), 9);
    assertEqual(pow(3, [1]), 3);
    assertEqual(pow(12, [2]), 144);
    assertEqual(pow(3, [3]), 27);
    assertEqual(pow(3, [0]), 1);
    assertEqual(pow(3), NaN);
  });

  method('log', function(log) {
    assertEqual(log(64, 2), 6);
    assertEqual(log(32, 2), 5);
    assertEqual(log(16, 2), 4);
    assertEqual(log(Math.E), 1);
  });

  method('exp', function(exp) {
    assertEqual(exp(0), 1);
    assertEqual(exp(1), Math.exp(1));
  });

  method('sqrt', function(sqrt) {
    assertEqual(sqrt(9), 3);
    assertEqual(sqrt(1024), 32);
  });

  method('toChar', function(toChar) {
    assertEqual(toChar(65), 'A');
    assertEqual(toChar(24536), '忘');
    assertEqual(toChar(20294), '但');
  });

  method('isMultipleOf', function(isMultipleOf) {
    assertEqual(isMultipleOf(2, 2), true);
    assertEqual(isMultipleOf(6, 2), true);
    assertEqual(isMultipleOf(100, 2), true);
    assertEqual(isMultipleOf(2, 100), false);
    assertEqual(isMultipleOf(100, -2), true);
    assertEqual(isMultipleOf(6, -2), true);
    assertEqual(isMultipleOf(6, 3), true);
    assertEqual(isMultipleOf(7, 3), false);
    assertEqual(isMultipleOf(2.5, 1.25), true);
    assertEqual(isMultipleOf(2, 'a'), false);
    assertEqual(isMultipleOf(2, /af/), false);
    assertEqual(isMultipleOf(2, null), false);
    assertEqual(isMultipleOf(2), false);
  });

  method('isOdd', function(isOdd) {
    assertEqual(isOdd(0), false);
    assertEqual(isOdd(1), true);
    assertEqual(isOdd(2), false);
    assertEqual(isOdd(24), false);
    assertEqual(isOdd(200), false);
    assertEqual(isOdd(1.1), false);
    assertEqual(isOdd(NaN), false);
    assertEqual(isOdd(Infinity), false);
    assertEqual(isOdd(-Infinity), false);
  });

  method('isEven', function(isEven) {
    assertEqual(isEven(0), true);
    assertEqual(isEven(1), false);
    assertEqual(isEven(2), true);
    assertEqual(isEven(24), true);
    assertEqual(isEven(200), true);
    assertEqual(isEven(1.1), false);
    assertEqual(isEven(NaN), false);
    assertEqual(isEven(Infinity), false);
    assertEqual(isEven(-Infinity), false);
  });

  method('toOrdinal', function(toOrdinal) {

    assertEqual(toOrdinal(0), '0th');
    assertEqual(toOrdinal(1), '1st');
    assertEqual(toOrdinal(2), '2nd');
    assertEqual(toOrdinal(3), '3rd');
    assertEqual(toOrdinal(4), '4th');
    assertEqual(toOrdinal(5), '5th');
    assertEqual(toOrdinal(6), '6th');
    assertEqual(toOrdinal(7), '7th');
    assertEqual(toOrdinal(8), '8th');
    assertEqual(toOrdinal(9), '9th');
    assertEqual(toOrdinal(10), '10th');
    assertEqual(toOrdinal(11), '11th');
    assertEqual(toOrdinal(12), '12th');
    assertEqual(toOrdinal(13), '13th');
    assertEqual(toOrdinal(14), '14th');
    assertEqual(toOrdinal(15), '15th');
    assertEqual(toOrdinal(20), '20th');
    assertEqual(toOrdinal(21), '21st');
    assertEqual(toOrdinal(22), '22nd');
    assertEqual(toOrdinal(23), '23rd');
    assertEqual(toOrdinal(24), '24th');
    assertEqual(toOrdinal(25), '25th');
    assertEqual(toOrdinal(100), '100th');
    assertEqual(toOrdinal(101), '101st');
    assertEqual(toOrdinal(102), '102nd');
    assertEqual(toOrdinal(103), '103rd');
    assertEqual(toOrdinal(104), '104th');
    assertEqual(toOrdinal(105), '105th');

    assertEqual(toOrdinal(-0), '0th');
    assertEqual(toOrdinal(-1), '-1st');
    assertEqual(toOrdinal(-2), '-2nd');
    assertEqual(toOrdinal(-3), '-3rd');
    assertEqual(toOrdinal(-4), '-4th');
    assertEqual(toOrdinal(-5), '-5th');

    assertError(toOrdinal.bind(null, NaN));
    assertError(toOrdinal.bind(null, 5.55));
    assertError(toOrdinal.bind(null, null));
    assertError(toOrdinal.bind(null, undefined));
    assertError(toOrdinal.bind(null, Infinity));

  });

  method('isInteger', function(isInteger) {
    assertEqual(isInteger(15), true);
    assertEqual(isInteger(15.2), false);
    assertEqual(isInteger(15.2668), false);
    assertEqual(isInteger(15.0), true);
    assertEqual(isInteger('15'), false);
    assertEqual(isInteger('15.8'), false);
  });

  method('isSafeInteger', function(isSafeInteger) {
    assertEqual(isSafeInteger(-0), true);
    assertEqual(isSafeInteger(0), true);
    assertEqual(isSafeInteger(1), true);
    assertEqual(isSafeInteger(1e255), false);
    assertEqual(isSafeInteger(NaN), false);
    assertEqual(isSafeInteger(Infinity), false);
  });

  method('isFinite', function(isFinite) {
    assertEqual(isFinite(-0), true);
    assertEqual(isFinite(0), true);
    assertEqual(isFinite(1), true);
    assertEqual(isFinite(1e255), true);
    assertEqual(isFinite(NaN), false);
    assertEqual(isFinite(Infinity), false);
    assertEqual(isFinite(-Infinity), false);
  });

  method('isNaN', function(isNaN) {
    assertEqual(isNaN(1), false);
    assertEqual(isNaN(NaN), true);
    assertEqual(isNaN(Infinity), false);
    assertEqual(isNaN(-Infinity), false);
  });

  method('times', function(times) {

    function assertTimesRan(n, actual) {
      var count = 0;
      times(n, function() {
        count++;
      });
      assertEqual(count, actual);
    }

    function assertInvalidInput(n) {
      assertError(function() {
        times(n, function() {});
      }, TypeError);
    }

    assertTimesRan(1, 1);
    assertTimesRan(5, 5);
    assertTimesRan(10, 10);

    assertInvalidInput(-1);
    assertInvalidInput(1.5);
    assertInvalidInput(NaN);
    assertInvalidInput(null);
    assertInvalidInput(undefined);
    assertInvalidInput(Infinity);
    assertInvalidInput(-Infinity);

    assertArrayEqual(times(3, function(i) {
      return Math.pow(2, i);
    }), [1,2,4]);

    assertArrayEqual(times(1, function(i, n) {
      return n;
    }), [1]);

    assertError(function() {
      times(1);
    }, TypeError);

  });

  method('format', function(format) {

    assertEqual(format(1), '1');
    assertEqual(format(10), '10');
    assertEqual(format(100), '100');
    assertEqual(format(1000), '1,000');
    assertEqual(format(1000000), '1,000,000');
    assertEqual(format(1000000000), '1,000,000,000');

    assertEqual(format(-1), '-1');
    assertEqual(format(-10), '-10');
    assertEqual(format(-100), '-100');
    assertEqual(format(-1000), '-1,000');
    assertEqual(format(-1000000), '-1,000,000');
    assertEqual(format(-1000000000), '-1,000,000,000');

    assertEqual(format( 6666.66),  '6,666.66');
    assertEqual(format(-6666.66), '-6,666.66');

    assertEqual(format( 6666.66, 1),  '6,666.7');
    assertEqual(format(-6666.66, 1), '-6,666.7');

    assertEqual(format( 1000, 2),  '1,000.00');
    assertEqual(format(-1000, 2), '-1,000.00');

    assertEqual(format( 6666.66, -1),  '6,670');
    assertEqual(format(-6666.66, -1), '-6,670');

    assertEqual(format( 1e6),  '1,000,000');
    assertEqual(format(-1e6), '-1,000,000');

    assertEqual(format( 1e6, 2),  '1,000,000.00');
    assertEqual(format(-1e6, 2), '-1,000,000.00');

    assertEqual(format( 0), '0');
    assertEqual(format(-0), '0');

    assertEqual(format( 0, 2), '0.00');
    assertEqual(format(-0, 2), '0.00');

    assertEqual(format('1000'), '1,000');

    assertError(function() { format(NaN); });
    assertError(function() { format(1e21); });
    assertError(function() { format(1e-6); });
    assertError(function() { format(Infinity); });

  });

  method('pad', function(pad) {

    assertEqual(pad(1), '1');
    assertEqual(pad(1, 0), '1');
    assertEqual(pad(1, 1), '1');
    assertEqual(pad(1, 2), '01');
    assertEqual(pad(1, 3), '001');

    assertEqual(pad(-1), '-1');
    assertEqual(pad(-1, 0), '-1');
    assertEqual(pad(-1, 1), '-1');
    assertEqual(pad(-1, 2), '-01');

    assertEqual(pad( 1, 2, 0, true), '+01');
    assertEqual(pad(-1, 2, 0, true), '-01');

    assertEqual(pad(5.25, 4), '0005.25');
    assertEqual(pad(5.25, 4, 0), '0005');
    assertEqual(pad(5.25, 4, 1), '0005.3');
    assertEqual(pad(5, 4, 2, true), '+0005.00');
    assertEqual(pad(5, 4, null, true), '+0005');

    assertError(function() { pad(NaN); });
    assertError(function() { pad(1e21); });
    assertError(function() { pad(1e-6); });
    assertError(function() { pad(Infinity); });

  });

  method('toHex', function(toHex) {

    assertEqual(toHex(0), '0');
    assertEqual(toHex(0, 2), '00');

    assertEqual(toHex(255), 'ff');
    assertEqual(toHex(255, 4), '00ff');

    assertEqual(toHex(255.5, 4), '00ff.8');

    assertError(function() { toHex(NaN); });
    assertError(function() { toHex(1e21); });
    assertError(function() { toHex(1e-6); });
    assertError(function() { toHex(Infinity); });

  });

  method('abbr', function(abbr) {

    // Positive
    assertEqual(abbr(0), '0');
    assertEqual(abbr(1), '1');
    assertEqual(abbr(10), '10');
    assertEqual(abbr(100), '100');
    assertEqual(abbr(999), '999');
    assertEqual(abbr(1000), '1k');
    assertEqual(abbr(1999), '1k');
    assertEqual(abbr(10000), '10k');
    assertEqual(abbr(100000), '100k');
    assertEqual(abbr(1000000), '1m');
    assertEqual(abbr(1000000000), '1b');
    assertEqual(abbr(1000000000000), '1t');
    assertEqual(abbr(1000000000000000), '1,000t');

    // Negative
    assertEqual(abbr(-1), '-1');
    assertEqual(abbr(-10), '-10');
    assertEqual(abbr(-100), '-100');
    assertEqual(abbr(-1000), '-1k');
    assertEqual(abbr(-10000), '-10k');
    assertEqual(abbr(-100000), '-100k');
    assertEqual(abbr(-1000000), '-1m');
    assertEqual(abbr(-1000000000), '-1b');
    assertEqual(abbr(-1000000000000), '-1t');
    assertEqual(abbr(-1000000000000000), '-1,000t');

    // Decimal
    assertEqual(abbr(0.1), '0.1');
    assertEqual(abbr(0.01), '0.01');
    assertEqual(abbr(0.001), '0.001');
    assertEqual(abbr(0.0001), '0.0001');
    assertEqual(abbr(1000000.25), '1m');

    // With Precision
    assertEqual(abbr(0,  0), '0');
    assertEqual(abbr(0, -1), '0');
    assertEqual(abbr(1748), '1k');
    assertEqual(abbr(1748, 1), '1.7k');
    assertEqual(abbr(1748, 2), '1.74k');
    assertEqual(abbr(1748, 3), '1.748k');
    assertEqual(abbr(1748, -1), '1k');
    assertEqual(abbr(155555,  0), '155k');
    assertEqual(abbr(155555, -1), '150k');
    assertEqual(abbr(155555, -2), '100k');
    assertEqual(abbr(155555, -3), '100k');
    assertEqual(abbr(-1748), '-1k');
    assertEqual(abbr(-1748, 1), '-1.7k');
    assertEqual(abbr(-1748, 2), '-1.74k');
    assertEqual(abbr(-1748, 3), '-1.748k');
    assertEqual(abbr(-155555,  0), '-155k');
    assertEqual(abbr(-155555, -1), '-150k');
    assertEqual(abbr(-155555, -2), '-100k');

    // Basic si
    assertEqual(abbr(1, 0, 'basic') + 'm', '1m');
    assertEqual(abbr(10, 0, 'basic') + 'm', '10m');
    assertEqual(abbr(100, 0, 'basic') + 'm', '100m');
    assertEqual(abbr(1000, 0, 'basic') + 'm', '1km');
    assertEqual(abbr(10000, 0, 'basic') + 'm', '10km');
    assertEqual(abbr(10000000, 0, 'basic') + 'm', '10,000km');

    assertEqual(abbr(9, 0, 'basic') + 'm', '9m');
    assertEqual(abbr(99, 0, 'basic') + 'm', '99m');
    assertEqual(abbr(999, 0, 'basic') + 'm', '999m');
    assertEqual(abbr(9999, 0, 'basic') + 'm', '9km');
    assertEqual(abbr(99999, 0, 'basic') + 'm', '99km');
    assertEqual(abbr(99999999, 0, 'basic') + 'm', '99,999km');

    assertEqual(abbr(.1, 0, 'basic') + 'm', '100mm');
    assertEqual(abbr(.01, 0, 'basic') + 'm', '10mm');
    assertEqual(abbr(.001, 0, 'basic') + 'm', '1mm');
    assertEqual(abbr(.0001, 0, 'basic') + 'm', '100μm');
    assertEqual(abbr(.00001, 0, 'basic') + 'm', '10μm');
    assertEqual(abbr(.000001, 0, 'basic') + 'm', '1μm');
    assertEqual(abbr(.0000001, 0, 'basic') + 'm', '100nm');
    assertEqual(abbr(.00000001, 0, 'basic') + 'm', '10nm');
    assertEqual(abbr(.000000001, 0, 'basic') + 'm', '1nm');

    assertEqual(abbr(.9, 0, 'basic') + 'm', '900mm');
    assertEqual(abbr(.09, 0, 'basic') + 'm', '90mm');
    assertEqual(abbr(.009, 0, 'basic') + 'm', '9mm');
    assertEqual(abbr(.0009, 0, 'basic') + 'm', '900μm');
    assertEqual(abbr(.00009, 0, 'basic') + 'm', '90μm');
    assertEqual(abbr(.000009, 0, 'basic') + 'm', '9μm');
    assertEqual(abbr(.0000009, 0, 'basic') + 'm', '900nm');
    assertEqual(abbr(.00000009, 0, 'basic') + 'm', '90nm');
    assertEqual(abbr(.000000009, 0, 'basic') + 'm', '9nm');

    // Full si
    assertEqual(abbr(1, 0, 'si'), '1');
    assertEqual(abbr(1000, 0, 'si'), '1k');
    assertEqual(abbr(1000000, 0, 'si'), '1M');
    assertEqual(abbr(1000000000, 0, 'si'), '1G');
    assertEqual(abbr(1000000000000, 0, 'si'), '1T');
    assertEqual(abbr(1000000000000000, 0, 'si'), '1P');
    assertEqual(abbr(1000000000000000000, 0, 'si'), '1E');
    assertEqual(abbr(1000000000000000000000, 0, 'si'), '1Z');
    assertEqual(abbr(1000000000000000000000000, 0, 'si'), '1Y');
    assertEqual(abbr(1000000000000000000000000000, 0, 'si'), '1,000Y');

    assertEqual(abbr(.001, 0, 'si'), '1m');
    assertEqual(abbr(.000001, 0, 'si'), '1μ');
    assertEqual(abbr(.000000001, 0, 'si'), '1n');
    assertEqual(abbr(.000000000001, 0, 'si'), '1p');
    assertEqual(abbr(.000000000000001, 0, 'si'), '1f');
    assertEqual(abbr(.000000000000000001, 0, 'si'), '1a');
    assertEqual(abbr(.000000000000000000001, 0, 'si'), '1z');
    assertEqual(abbr(.000000000000000000000001, 0, 'si'), '1y');
    assertEqual(abbr(.000000000000000000000000001, 0, 'si'), '0');
    assertEqual(abbr(.000000000000000000000000001, null, 'si'), '0.001y');

    // Binary
    assertEqual(abbr(1, 0, 'binary'), '1');
    assertEqual(abbr(Math.pow(2, 10), 0, 'binary') + 'B', '1KB');
    assertEqual(abbr(Math.pow(2, 20), 0, 'binary') + 'B', '1MB');
    assertEqual(abbr(Math.pow(2, 30), 0, 'binary') + 'B', '1GB');
    assertEqual(abbr(Math.pow(2, 40), 0, 'binary') + 'B', '1TB');
    assertEqual(abbr(Math.pow(2, 50), 0, 'binary') + 'B', '1PB');
    assertEqual(abbr(Math.pow(2, 60), 0, 'binary') + 'B', '1EB');
    assertEqual(abbr(Math.pow(2, 70), 0, 'binary') + 'B', '1,024EB');

    assertEqual(abbr(Math.pow(2, 10) - Math.pow(2,  0), 0, 'binary') + 'B', '1,023B');
    assertEqual(abbr(Math.pow(2, 20) - Math.pow(2, 10), 0, 'binary') + 'B', '1,023KB');
    assertEqual(abbr(Math.pow(2, 30) - Math.pow(2, 20), 0, 'binary') + 'B', '1,023MB');
    assertEqual(abbr(Math.pow(2, 40) - Math.pow(2, 30), 0, 'binary') + 'B', '1,023GB');
    assertEqual(abbr(Math.pow(2, 50) - Math.pow(2, 40), 0, 'binary') + 'B', '1,023TB');
    assertEqual(abbr(Math.pow(2, 60) - Math.pow(2, 50), 0, 'binary') + 'B', '1,023PB');
    assertEqual(abbr(Math.pow(2, 70) - Math.pow(2, 60), 0, 'binary') + 'B', '1,023EB');

    // Memory
    assertEqual(abbr(1, 0, 'memory'), '1');
    assertEqual(abbr(1000, 0, 'memory'), '1K');
    assertEqual(abbr(1000000, 0, 'memory'), '1M');
    assertEqual(abbr(1000000000, 0, 'memory'), '1G');
    assertEqual(abbr(1000000000000, 0, 'memory'), '1T');
    assertEqual(abbr(1000000000000000, 0, 'memory'), '1P');
    assertEqual(abbr(1000000000000000000, 0, 'memory'), '1E');
    assertEqual(abbr(1000000000000000000000, 0, 'memory'), '1,000E');

    // Other
    assertEqual(abbr(1755, 2, 'integer'), '1.75k');
    assertEqual(abbr(17555, 2, '|'), '17,555');
    assertEqual(abbr(.17555, 2, '|'), '0.17');
    assertEqual(abbr(.17555, null, '|'), '0.17555');

    // Errors
    assertError(function() { abbr(NaN); });
    assertError(function() { abbr(Infinity); });
    assertError(function() { abbr(null); });
    assertError(function() { abbr(undefined); });

    withNumberFormatter('de-DE', function(formatter) {
      assertEqual(abbr(1755, 1, 'integer', formatter), '1,7k');
      assertEqual(abbr(1755, 2, 'integer', formatter), '1,75k');
    });

  });

  /*


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
  */

});
