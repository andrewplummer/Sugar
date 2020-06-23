'use strict';

namespace('Number', function() {

  describeStatic('random', function(random) {

    it('should generate random numbers', function() {
      assertOneOf(random(), [0,1]);
      assertOneOf(random(10), [0,1,2,3,4,5,6,7,8,9,10]);
      assertOneOf(random(25, 30), [25,26,27,28,29,30]);
      assertOneOf(random(30, 25), [25,26,27,28,29,30]);
      assertOneOf(random(-5, -2), [-5,-4,-3,-2]);
      assertOneOf(random(0, 0), [0]);
    });

  });

  describeStatic('range', function(range) {

    it('#toString', function() {
      assertEqual(range(1, 5).toString(), '1..5');
      assertEqual(range(1, NaN).toString(), 'Invalid Range');
    });

    it('#isValid', function() {
      assertTrue(range(1, 5).isValid());
      assertTrue(range(5, 1).isValid());
      assertTrue(range(0, 0).isValid());
      assertFalse(range(5, NaN).isValid());
      assertFalse(range(NaN, 5).isValid());
      assertFalse(range(5, Infinity).isValid());
      assertFalse(range(Infinity, 5).isValid());
    });

    it('#span', function() {
      assertEqual(range(1, 5).span(), 5);
      assertEqual(range(5, 1).span(), 5);
      assertNaN(range(NaN, NaN).span());
    });

    it('#toArray', function() {
      assertArrayEqual(range(1, 5).toArray(), [1,2,3,4,5]);
      assertArrayEqual(range(5, 1).toArray(), [5,4,3,2,1]);
      assertArrayEqual(range(-2, 2).toArray(), [-2,-1,0,1,2]);
      assertArrayEqual(range(2, -2).toArray(), [2,1,0,-1,-2]);
      assertArrayEqual(range(NaN, NaN).toArray(), []);
    });

    it('#clone', function() {
      assertEqual(range(1, 5).clone().toString(), '1..5');
    });

    it('#clamp', function() {
      assertEqual(range(1, 5).clamp(8), 5);
      assertEqual(range(1, 5).clamp(0), 1);
      assertEqual(range(5, 1).clamp(8), 5);
      assertEqual(range(5, 1).clamp(0), 1);
    });

    it('#contains', function() {
      assertTrue(range(1, 5).contains(range(1, 3)));
      assertTrue(range(1, 5).contains(range(1, 1)));
      assertTrue(range(1, 5).contains(range(5, 5)));
      assertTrue(range(1, 5).contains(range(5, 4)));
      assertFalse(range(1, 5).contains(range(6, 8)));
      assertFalse(range(1, 5).contains(range(0, 1)));
      assertFalse(range(1, 5).contains(range(0, 2)));
      assertFalse(range(1, 5).contains(range(2, 0)));
      assertFalse(range(1, 5).contains(range(4, 6)));
      assertFalse(range(1, 5).contains(range(6, 4)));
      assertFalse(range(1, 5).contains(range(0, 6)));
    });

    it('#every', function() {
      assertArrayEqual(range(1, 5).every(1), [1,2,3,4,5]);
      assertArrayEqual(range(1, 5).every(2), [1,3,5]);
      assertArrayEqual(range(1, 5).every(2, square), [1,9,25]);
      assertArrayEqual(range(1, 2).every(1, args), [[1,0], [2,1]]);
    });

    it('#intersect', function() {
      assertEqual(range(1,10).intersect(range(5,15)).toString(), '5..10');
      assertEqual(range(1,10).intersect(range(15,5)).toString(), '5..10');
      assertEqual(range(1,10).intersect(range(0,3)).toString(), '1..3');
      assertEqual(range(1,10).intersect(range(3,0)).toString(), '1..3');
      assertEqual(range(10,1).intersect(range(5,15)).toString(), '5..10');
      assertEqual(range(10,1).intersect(range(15,5)).toString(), '5..10');
      assertEqual(range(10,1).intersect(range(0,3)).toString(), '1..3');
      assertEqual(range(10,1).intersect(range(3,0)).toString(), '1..3');

      assertEqual(range(0,5).intersect(range(8,10)).toString(), 'Invalid Range');
      assertEqual(range(0,5).intersect(range(NaN,NaN)).toString(), 'Invalid Range');
      assertEqual(range(NaN,NaN).intersect(range(8,10)).toString(), 'Invalid Range');
    });

    it('#union', function() {
      assertEqual(range(1,10).union(range(5,15)).toString(), '1..15');
      assertEqual(range(1,10).union(range(15,5)).toString(), '1..15');
      assertEqual(range(1,10).union(range(0,3)).toString(), '0..10');
      assertEqual(range(1,10).union(range(3,0)).toString(), '0..10');
      assertEqual(range(10,1).union(range(5,15)).toString(), '1..15');
      assertEqual(range(10,1).union(range(15,5)).toString(), '1..15');
      assertEqual(range(10,1).union(range(0,3)).toString(), '0..10');
      assertEqual(range(10,1).union(range(3,0)).toString(), '0..10');

      assertEqual(range(0,5).union(range(NaN,NaN)).toString(), 'Invalid Range');
      assertEqual(range(NaN,NaN).union(range(8,10)).toString(), 'Invalid Range');
    });

  });

  describeInstance('round', function(round) {

    it('should round numbers', function() {
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

  });

  describeInstance('ceil', function(ceil) {

    it('should round up', function() {
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

  });

  describeInstance('floor', function(floor) {

    it('should round down', function() {
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

  });

  describeInstance('trunc', function(trunc) {

    it('should truncate numbers', function() {
      assertEqual(trunc(5), 5);
      assertEqual(trunc(5.25), 5);
      assertEqual(trunc(NaN), NaN);
      assertEqual(trunc(Infinity), Infinity);
      assertEqual(trunc(5.25, 1), 5.2);
      assertEqual(trunc(5.25, 2), 5.25);
      assertEqual(trunc(-5.25, 1), -5.2);
      assertEqual(trunc(-5.25, 2), -5.25);
    });

  });

  describeInstance('abs', function(abs) {

    it('should get absolute value', function() {
      assertEqual(abs(-5), 5);
      assertEqual(abs(5), 5);
      assertEqual(abs(-3.324), 3.324);
      assertEqual(abs(3.324), 3.324);
    });

  });

  describeInstance('pow', function(pow) {

    it('should raise numbers to a power', function() {
      assertEqual(pow(3, [2]), 9);
      assertEqual(pow(3, [1]), 3);
      assertEqual(pow(12, [2]), 144);
      assertEqual(pow(3, [3]), 27);
      assertEqual(pow(3, [0]), 1);
      assertEqual(pow(3), NaN);
    });

  });

  describeInstance('log', function(log) {

    it('should get log of numbers', function() {
      assertEqual(log(64, 2), 6);
      assertEqual(log(32, 2), 5);
      assertEqual(log(16, 2), 4);
      assertEqual(log(Math.E), 1);
    });

  });

  describeInstance('exp', function(exp) {

    it('should get exp', function() {
      assertEqual(exp(0), 1);
      assertEqual(exp(1), Math.exp(1));
    });

  });

  describeInstance('sqrt', function(sqrt) {

    it('should get square root', function() {
      assertEqual(sqrt(9), 3);
      assertEqual(sqrt(1024), 32);
    });

  });

  describeInstance('toChar', function(toChar) {

    it('should get chars', function() {
      assertEqual(toChar(65), 'A');
      assertEqual(toChar(24536), '忘');
      assertEqual(toChar(20294), '但');
      assertError(function() { toChar(NaN); }, RangeError);
      assertError(function() { toChar(-1); }, RangeError);
      assertError(function() { toChar(.5); }, RangeError);
      assertError(function() { toChar(0x110000); }, RangeError);
    });

  });

  describeInstance('clamp', function(clamp) {

    it('should clamp basic range', function() {
      assertEqual(clamp(0, 1, 10), 1);
      assertEqual(clamp(1, 1, 10), 1);
      assertEqual(clamp(5, 1, 10), 5);
      assertEqual(clamp(10, 1, 10), 10);
      assertEqual(clamp(20, 1, 10), 10);
      assertEqual(clamp(1e21, 1, 10), 10);
      assertEqual(clamp(Infinity, 1, 10), 10);
      assertEqual(clamp(-Infinity, 1, 10), 1);
    });

    it('should clamp decimals', function() {
      assertEqual(clamp(-5.5, 1, 10), 1);
      assertEqual(clamp(5.5, 1, 10), 5.5);
      assertEqual(clamp(15.5, 1, 10), 10);
    });


    it('should clamp only one argment', function() {
      assertEqual(clamp(-1, 10), -1);
      assertEqual(clamp(0, 10), 0);
      assertEqual(clamp(5, 10), 5);
      assertEqual(clamp(10, 10), 10);
      assertEqual(clamp(20, 10), 10);
    });

    it('should clamp no arguments', function() {
      assertEqual(clamp(5), 5);
    });

    it('should raise errors on invalid', function() {
      assertError(function() { clamp(NaN); });
      assertError(function() { clamp(null); });
      assertError(function() { clamp(undefined); });
    });

  });

  describeInstance('isMultipleOf', function(isMultipleOf) {

    it('should should determine if multiple', function() {
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

  });

  describeInstance('isOdd', function(isOdd) {

    it('should determine if odd', function() {
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

  });

  describeInstance('isEven', function(isEven) {

    it('should determine if even', function() {
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

  });

  describeInstance('toOrdinal', function(toOrdinal) {

    it('should get basic ordinals', function() {
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
    });

    it('should convert negative numbers', function() {
      assertEqual(toOrdinal(-0), '0th');
      assertEqual(toOrdinal(-1), '-1st');
      assertEqual(toOrdinal(-2), '-2nd');
      assertEqual(toOrdinal(-3), '-3rd');
      assertEqual(toOrdinal(-4), '-4th');
      assertEqual(toOrdinal(-5), '-5th');
    });

    it('should error on invalid input', function() {
      assertError(function() { toOrdinal(NaN); });
      assertError(function() { toOrdinal(5.55); });
      assertError(function() { toOrdinal(null); });
      assertError(function() { toOrdinal(undefined); });
      assertError(function() { toOrdinal(Infinity); });
    });

  });

  describeInstance('isInteger', function(isInteger) {

    it('should find integers', function() {
      assertEqual(isInteger(15), true);
      assertEqual(isInteger(15.2), false);
      assertEqual(isInteger(15.2668), false);
      assertEqual(isInteger(15.0), true);
      assertEqual(isInteger('15'), false);
      assertEqual(isInteger('15.8'), false);
    });

  });

  describeInstance('isSafeInteger', function(isSafeInteger) {

    it('should find safe integers', function() {
      assertEqual(isSafeInteger(-0), true);
      assertEqual(isSafeInteger(0), true);
      assertEqual(isSafeInteger(1), true);
      assertEqual(isSafeInteger(1e255), false);
      assertEqual(isSafeInteger(NaN), false);
      assertEqual(isSafeInteger(Infinity), false);
    });

  });

  describeInstance('isFinite', function(isFinite) {

    it('should return true for finite numbers', function() {
      assertEqual(isFinite(-0), true);
      assertEqual(isFinite(0), true);
      assertEqual(isFinite(1), true);
      assertEqual(isFinite(1e255), true);
      assertEqual(isFinite(NaN), false);
      assertEqual(isFinite(Infinity), false);
      assertEqual(isFinite(-Infinity), false);
    });
  });

  describeInstance('isNaN', function(isNaN) {

    it('should return true for NaN', function() {
      assertEqual(isNaN(1), false);
      assertEqual(isNaN(NaN), true);
      assertEqual(isNaN(Infinity), false);
      assertEqual(isNaN(-Infinity), false);
    });

  });

  describeInstance('times', function(times) {

    function assertCount(n, expected) {
      var count = 0;
      times(n, function() {
        count++;
      });
      assertEqual(count, expected);
    }

    function assertInvalidInput(n) {
      assertError(function() {
        times(n, noop);
      });
    }

    it('should run specified number of times', function() {
      assertCount(1, 1);
      assertCount(5, 5);
      assertCount(10, 10);
    });

    it('should error on invalid input', function() {
      assertInvalidInput(-1);
      assertInvalidInput(1.5);
      assertInvalidInput(NaN);
      assertInvalidInput(null);
      assertInvalidInput(undefined);
      assertInvalidInput(Infinity);
      assertInvalidInput(-Infinity);
    });

    it('should produce correct return values', function() {
      assertArrayEqual(times(3, function(i) {
        return Math.pow(2, i);
      }), [1,2,4]);

      assertArrayEqual(times(1, function(i, n) {
        return n;
      }), [1]);
    });

    it('should error when no function provided', function() {
      assertError(function() { times(1); });
    });

  });

  describeInstance('format', function(format) {

    it('should format positive integers', function() {
      assertEqual(format(1), '1');
      assertEqual(format(10), '10');
      assertEqual(format(100), '100');
      assertEqual(format(1000), '1,000');
      assertEqual(format(1000000), '1,000,000');
      assertEqual(format(1000000000), '1,000,000,000');
    });

    it('should format negative integers', function() {
      assertEqual(format(-1), '-1');
      assertEqual(format(-10), '-10');
      assertEqual(format(-100), '-100');
      assertEqual(format(-1000), '-1,000');
      assertEqual(format(-1000000), '-1,000,000');
      assertEqual(format(-1000000000), '-1,000,000,000');
    });

    it('should format fractions', function() {
      assertEqual(format( 6666.66),  '6,666.66');
      assertEqual(format(-6666.66), '-6,666.66');

      assertEqual(format( 6666.66, 1),  '6,666.7');
      assertEqual(format(-6666.66, 1), '-6,666.7');

      assertEqual(format( 1000, 2),  '1,000.00');
      assertEqual(format(-1000, 2), '-1,000.00');

      assertEqual(format( 6666.66, -1),  '6,670');
      assertEqual(format(-6666.66, -1), '-6,670');
    });

    it('should format exponential notation', function() {
      assertEqual(format( 1e6),  '1,000,000');
      assertEqual(format(-1e6), '-1,000,000');

      assertEqual(format( 1e6, 2),  '1,000,000.00');
      assertEqual(format(-1e6, 2), '-1,000,000.00');
    });

    it('should format 0 and -0', function() {
      assertEqual(format( 0), '0');
      assertEqual(format(-0), '0');

      assertEqual(format( 0, 2), '0.00');
      assertEqual(format(-0, 2), '0.00');
    });

    it('should coerce strings', function() {
      assertEqual(format('1000'), '1,000');
    });

    it('should error on invalid input', function() {
      assertError(function() { format(NaN); });
      assertError(function() { format(1e21); });
      assertError(function() { format(1e-6); });
      assertError(function() { format(Infinity); });
    });

  });

  describeInstance('pad', function(pad) {

    it('should pad basic numbers', function() {
      assertEqual(pad(1), '1');
      assertEqual(pad(1, 0), '1');
      assertEqual(pad(1, 1), '1');
      assertEqual(pad(1, 2), '01');
      assertEqual(pad(1, 3), '001');
    });

    it('should pad negative numbers', function() {
      assertEqual(pad(-1), '-1');
      assertEqual(pad(-1, 0), '-1');
      assertEqual(pad(-1, 1), '-1');
      assertEqual(pad(-1, 2), '-01');
    });

    it('should include sign', function() {
      assertEqual(pad( 1, 2, 0, true), '+01');
      assertEqual(pad(-1, 2, 0, true), '-01');
    });

    it('should pad fractions', function() {
      assertEqual(pad(5.25, 4), '0005.25');
      assertEqual(pad(5.25, 4, 0), '0005');
      assertEqual(pad(5.25, 4, 1), '0005.3');

      assertEqual(pad(5, 4, 2, true), '+0005.00');
      assertEqual(pad(5, 4, null, true), '+0005');
    });

    it('should error on invalid input', function() {
      assertError(function() { pad(NaN); });
      assertError(function() { pad(1e21); });
      assertError(function() { pad(1e-6); });
      assertError(function() { pad(Infinity); });
    });

  });

  describeInstance('toHex', function(toHex) {

    it('should perform basic conversion', function() {
      assertEqual(toHex(255), 'ff');
      assertEqual(toHex(255, 4), '00ff');
    });

    it('should convert 0', function() {
      assertEqual(toHex(0), '0');
      assertEqual(toHex(0, 2), '00');
    });

    it('should preserve decimal', function() {
      assertEqual(toHex(255.5, 4), '00ff.8');
    });

    it('should error on invalid input', function() {
      assertError(function() { toHex(NaN); });
      assertError(function() { toHex(1e21); });
      assertError(function() { toHex(1e-6); });
      assertError(function() { toHex(Infinity); });
    });

  });

  describeInstance('abbr', function(abbr) {

    it('should abbreviate positive integers', function() {
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
    });

    it('should abbreviate negative integers', function() {
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
    });

    it('should abbreviate decimals', function() {
      assertEqual(abbr(0.1), '0.1');
      assertEqual(abbr(0.01), '0.01');
      assertEqual(abbr(0.001), '0.001');
      assertEqual(abbr(0.0001), '0.0001');
      assertEqual(abbr(1000000.25), '1m');
    });

    it('should abbreviate with precision', function() {
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
    });

    it('should abbreviate common si', function() {
      assertEqual(abbr(1, 0, 'common') + 'm', '1m');
      assertEqual(abbr(10, 0, 'common') + 'm', '10m');
      assertEqual(abbr(100, 0, 'common') + 'm', '100m');
      assertEqual(abbr(1000, 0, 'common') + 'm', '1km');
      assertEqual(abbr(10000, 0, 'common') + 'm', '10km');
      assertEqual(abbr(10000000, 0, 'common') + 'm', '10,000km');

      assertEqual(abbr(9, 0, 'common') + 'm', '9m');
      assertEqual(abbr(99, 0, 'common') + 'm', '99m');
      assertEqual(abbr(999, 0, 'common') + 'm', '999m');
      assertEqual(abbr(9999, 0, 'common') + 'm', '9km');
      assertEqual(abbr(99999, 0, 'common') + 'm', '99km');
      assertEqual(abbr(99999999, 0, 'common') + 'm', '99,999km');

      assertEqual(abbr(.1, 0, 'common') + 'm', '100mm');
      assertEqual(abbr(.01, 0, 'common') + 'm', '10mm');
      assertEqual(abbr(.001, 0, 'common') + 'm', '1mm');
      assertEqual(abbr(.0001, 0, 'common') + 'm', '100μm');
      assertEqual(abbr(.00001, 0, 'common') + 'm', '10μm');
      assertEqual(abbr(.000001, 0, 'common') + 'm', '1μm');
      assertEqual(abbr(.0000001, 0, 'common') + 'm', '100nm');
      assertEqual(abbr(.00000001, 0, 'common') + 'm', '10nm');
      assertEqual(abbr(.000000001, 0, 'common') + 'm', '1nm');

      assertEqual(abbr(.9, 0, 'common') + 'm', '900mm');
      assertEqual(abbr(.09, 0, 'common') + 'm', '90mm');
      assertEqual(abbr(.009, 0, 'common') + 'm', '9mm');
      assertEqual(abbr(.0009, 0, 'common') + 'm', '900μm');
      assertEqual(abbr(.00009, 0, 'common') + 'm', '90μm');
      assertEqual(abbr(.000009, 0, 'common') + 'm', '9μm');
      assertEqual(abbr(.0000009, 0, 'common') + 'm', '900nm');
      assertEqual(abbr(.00000009, 0, 'common') + 'm', '90nm');
      assertEqual(abbr(.000000009, 0, 'common') + 'm', '9nm');
    });

    it('should abbreviate full si', function() {
      assertEqual(abbr(1, 0, 'metric'), '1');
      assertEqual(abbr(1000, 0, 'metric'), '1K');
      assertEqual(abbr(1000000, 0, 'metric'), '1M');
      assertEqual(abbr(1000000000, 0, 'metric'), '1G');
      assertEqual(abbr(1000000000000, 0, 'metric'), '1T');
      assertEqual(abbr(1000000000000000, 0, 'metric'), '1P');
      assertEqual(abbr(1000000000000000000, 0, 'metric'), '1E');
      assertEqual(abbr(1000000000000000000000, 0, 'metric'), '1Z');
      assertEqual(abbr(1000000000000000000000000, 0, 'metric'), '1Y');
      assertEqual(abbr(1000000000000000000000000000, 0, 'metric'), '1,000Y');

      assertEqual(abbr(.001, 0, 'metric'), '1m');
      assertEqual(abbr(.000001, 0, 'metric'), '1μ');
      assertEqual(abbr(.000000001, 0, 'metric'), '1n');
      assertEqual(abbr(.000000000001, 0, 'metric'), '1p');
      assertEqual(abbr(.000000000000001, 0, 'metric'), '1f');
      assertEqual(abbr(.000000000000000001, 0, 'metric'), '1a');
      assertEqual(abbr(.000000000000000000001, 0, 'metric'), '1z');
      assertEqual(abbr(.000000000000000000000001, 0, 'metric'), '1y');
      assertEqual(abbr(.000000000000000000000000001, 0, 'metric'), '0');
      assertEqual(abbr(.000000000000000000000000001, null, 'metric'), '0.001y');
    });
    it('should abbreviate base 2', function() {
      assertEqual(abbr(1, 0, 'binary'), '1');
      assertEqual(abbr(Math.pow(2, 10), 0, 'binary') + 'B', '1KB');
      assertEqual(abbr(Math.pow(2, 20), 0, 'binary') + 'B', '1MB');
      assertEqual(abbr(Math.pow(2, 30), 0, 'binary') + 'B', '1GB');
      assertEqual(abbr(Math.pow(2, 40), 0, 'binary') + 'B', '1TB');
      assertEqual(abbr(Math.pow(2, 50), 0, 'binary') + 'B', '1PB');
      assertEqual(abbr(Math.pow(2, 60), 0, 'binary') + 'B', '1EB');
      assertEqual(abbr(Math.pow(2, 70), 0, 'binary') + 'B', '1ZB');

      assertEqual(abbr(Math.pow(2, 10) - Math.pow(2,  0), 0, 'binary') + 'B', '1,023B');
      assertEqual(abbr(Math.pow(2, 20) - Math.pow(2, 10), 0, 'binary') + 'B', '1,023KB');
      assertEqual(abbr(Math.pow(2, 30) - Math.pow(2, 20), 0, 'binary') + 'B', '1,023MB');
      assertEqual(abbr(Math.pow(2, 40) - Math.pow(2, 30), 0, 'binary') + 'B', '1,023GB');
      assertEqual(abbr(Math.pow(2, 50) - Math.pow(2, 40), 0, 'binary') + 'B', '1,023TB');
      assertEqual(abbr(Math.pow(2, 60) - Math.pow(2, 50), 0, 'binary') + 'B', '1,023PB');
      assertEqual(abbr(Math.pow(2, 70) - Math.pow(2, 60), 0, 'binary') + 'B', '1,023EB');
    });

    it('should abbreviate base 10', function() {
      assertEqual(abbr(1, 0, 'metric'), '1');
      assertEqual(abbr(1000, 0, 'metric'), '1K');
      assertEqual(abbr(1000000, 0, 'metric'), '1M');
      assertEqual(abbr(1000000000, 0, 'metric'), '1G');
      assertEqual(abbr(1000000000000, 0, 'metric'), '1T');
      assertEqual(abbr(1000000000000000, 0, 'metric'), '1P');
      assertEqual(abbr(1000000000000000000, 0, 'metric'), '1E');
      assertEqual(abbr(1000000000000000000000, 0, 'metric'), '1Z');
    });

    it('should handle custom cases ', function() {
      assertEqual(abbr(1755, 2, 'integer'), '1.75k');
      assertEqual(abbr(17555, 2, '|'), '17,555');
      assertEqual(abbr(.17555, 2, '|'), '0.17');
      assertEqual(abbr(.17555, null, '|'), '0.17555');
      assertEqual(abbr(17555, 0, 'x|y'), '17x');
      assertEqual(abbr(.17555, 0, 'x|y'), '175y');
      assertEqual(abbr(175000, null, 'm-|'), '0.175m');
      assertEqual(abbr(175000000, null, 'bm-|'), '175m');
      assertEqual(abbr(.175, 0, 'x|-μ'), '175,000μ');
    });

    it('should error on invalid input', function() {
      assertError(function() { abbr(NaN); });
      assertError(function() { abbr(Infinity); });
      assertError(function() { abbr(null); });
      assertError(function() { abbr(undefined); });
    });

    withNumberFormatter('de-DE', function(formatter) {

      it('should accept custom number formatter', function() {
        assertEqual(abbr(1755, 1, 'integer', formatter), '1,7k');
        assertEqual(abbr(1755, 2, 'integer', formatter), '1,75k');
      });

    });

  });

  describeInstance('upto', function(upto) {

    it('should iterate over integers', function() {
      assertArrayEqual(upto(0, 0), [0]);
      assertArrayEqual(upto(0, 1), [0,1]);
      assertArrayEqual(upto(0, 5), [0,1,2,3,4,5]);
      assertArrayEqual(upto(2,-2), [-2,-1,0,1,2]);
      assertArrayEqual(upto(-2, 2), [-2,-1,0,1,2]);
    });

    it('should iterate over fractions', function() {
      assertArrayEqual(upto(-0.5, 0.5), [-0.5,0.5]);
      assertArrayEqual(upto(-0.5, 0.6), [-0.5,0.5]);
      assertArrayEqual(upto(-0.5, 0.4), [-0.5]);
    });

    it('should accept a mapping function', function() {
      assertArrayEqual(upto(0, 1, 1, noop), [undefined, undefined]);
      assertArrayEqual(upto(-1, 1, 1, args), [[-1,0],[0,1],[1,2]]);
      assertArrayEqual(upto(1, -1, 1, args), [[-1,0],[0,1],[1,2]]);
    });

    it('should allow a step argument', function() {
      assertArrayEqual(upto(0, 6, 10), [0]);
      assertArrayEqual(upto(0, 6, 2), [0,2,4,6]);
      assertArrayEqual(upto(0, 2, 0.5), [0,0.5,1,1.5,2]);
    });

    it('should error on invalid input', function() {
      assertError(function() { upto(null, 1); });
      assertError(function() { upto(1, null); });
      assertError(function() { upto(NaN, 1); });
      assertError(function() { upto(1, NaN); });
      assertError(function() { upto(-Infinity, 0); });
      assertError(function() { upto(0, Infinity); });
    });

    it('should error on invalid step', function() {
      assertError(function() { upto(1, 4, 0); });
      assertError(function() { upto(1, 4, 0, noop); });
      assertError(function() { upto(1, 4, -2); });
      assertError(function() { upto(1, 4, Infinity); });
      assertError(function() { upto(1, 4, NaN); });
    });

  });

  describeInstance('downto', function(downto) {

    it('should iterate over integers', function() {
      assertArrayEqual(downto(0, 0), [0]);
      assertArrayEqual(downto(1, 0), [1,0]);
      assertArrayEqual(downto(5, 0), [5,4,3,2,1,0]);
      assertArrayEqual(downto(2, -2), [2,1,0,-1,-2]);
      assertArrayEqual(downto(-2, 2), [2,1,0,-1,-2]);
    });

    it('should iterate over fractions', function() {
      assertArrayEqual(downto(0.5, -0.5), [0.5,-0.5]);
      assertArrayEqual(downto(0.5, -0.6), [0.5,-0.5]);
      assertArrayEqual(downto(0.5, -0.4), [0.5]);
    });

    it('should accept a mapping function', function() {
      assertArrayEqual(downto(0, 1, 1, noop), [undefined, undefined]);
      assertArrayEqual(downto(1, -1, 1, args), [[1,0],[0,1],[-1,2]]);
      assertArrayEqual(downto(-1, 1, 1, args), [[1,0],[0,1],[-1,2]]);
    });


    it('should allow a step argument', function() {
      assertArrayEqual(downto(0, 6, 10), [6]);
      assertArrayEqual(downto(5, 0, 2), [5,3,1]);
      assertArrayEqual(downto(2, 0, 0.5), [2,1.5,1,0.5,0]);
    });

    it('should error on invalid input', function() {
      assertError(function() { downto(null, 1); });
      assertError(function() { downto(1, null); });
      assertError(function() { downto(NaN, 1); });
      assertError(function() { downto(1, NaN); });
      assertError(function() { downto(-Infinity, 0); });
      assertError(function() { downto(0, Infinity); });
    });

    it('should error on invalid step', function() {
      assertError(function() { downto(1, 4, 0); });
      assertError(function() { downto(1, 4, 0, noop); });
      assertError(function() { downto(1, 4, -2); });
      assertError(function() { downto(1, 4, Infinity); });
      assertError(function() { downto(1, 4, NaN); });
    });

  });

});
