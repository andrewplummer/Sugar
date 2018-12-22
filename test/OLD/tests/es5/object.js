namespace('Object', function () {
  'use strict';

  group('keys', function() {
    var Person;

    equal(Object.keys.length, 1, 'should have argument length of 1');

    raisesError(function() { Object.keys(undefined); }, 'raises a TypeError for undefined');
    raisesError(function() { Object.keys(null); }, 'raises a TypeError for null');

    // ES5 states that a TypeError must be thrown when non-objects are
    // passed to Object.keys. However, ES6 revises this and performs
    // a coercion instead. The Sugar polyfills follow the ES5 spec for now,
    // however some browsers have already started to implement ES6 behavior,
    // so this is not consistent at the moment, so comment these tests out.

    // raisesError(function() { Object.keys(true); }, 'raises a TypeError for boolean');
    // raisesError(function() { Object.keys(3); }, 'raises a TypeError for number');
    // raisesError(function() { Object.keys(NaN); }, 'raises a TypeError for NaN');
    // raisesError(function() { Object.keys('wasabi'); }, 'raises a TypeError for string');

    equal(Object.keys({ moo:'bar', broken:'wear' }), ['moo','broken'], 'returns keys of an object');
    equal(Object.keys(['a','b','c']), ['0','1','2'], 'returns indexes of an array');
    equal(Object.keys(/foobar/), [], 'regexes return a blank array');
    equal(Object.keys(function() {}), [], 'functions return a blank array');
    equal(Object.keys(new Date), [], 'dates return a blank array');
    equal(Object.keys({toString:1}), ['toString'], 'should enumerate toString');

    Person = function() {
      this.broken = 'wear';
    };
    Person.prototype = { cat: 'dog' };

    equal(Object.keys(new Person), ['broken'], 'will get instance properties but not inherited properties');
  });

});
