
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
  d.setUTCDate(15); // Pre-emptively preventing a month overflow situation
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

var equalsWithMargin = function(actual, expected, margin, message){
  equals((actual > expected - margin) && (actual < expected + margin), true, message);
}

var equalsWithException = function(actual, expected, exception, message){
  if(exception.hasOwnProperty(environment)) expected = exception[environment];
  if(expected == 'NaN'){
    equals(isNaN(actual), true, message);
  } else {
    equals(actual, expected, message);
  }
}

var sameWithException = function(actual, expected, exception, message, sort){
  if(exception.hasOwnProperty(environment)) expected = exception[environment];
  if(sort){
    actual = actual.concat().sort();
    expected = expected.concat().sort();
  }
  same(actual, expected, message);
}

var strictlyEqualsWithException = function(actual, expected, exception, message){
  equalsWithException(actual === expected, true, exception, message + ' | strict equality');
}

var fixPrototypeIterators = function(){
  if(environment == 'prototype'){
    fixIterator('find');
    fixIterator('findAll');
    fixIterator('min', true);
    fixIterator('max', true);
  }
}

var fixIterator = function(name, map){
  var fn = Array.prototype[name];
  Array.prototype[name] = function(a){
    if(typeof a == 'function'){
      return fn.apply(this, arguments);
    } else {
      return fn.apply(this, [function(s){
        if(map){
          return s && s[a] ? s[a] : s;
        } else {
          return s == a;
        }
      }].concat(Array.prototype.slice.call(arguments, 1)));
    }
  };
}

var testWithErrorHandling = function(test, environments){
  try {
    test.call();
  } catch(error){
    for(var i = 0; i < environments.length; i++){
      if(environments[i] == environment){
        // Allow test to fail
        if(console){
          console.info('Skipping test with exepction "' + error.message + '" for environment ' + environment);
        }
        return;
      }
    }
    throw new Error('Test ' + test.toString() + ' errored with message ' + error.message);
  }
}

var sameProxy = same;

var deepEqualWithoutPrototyping = function(actual, expected){
  for(var key in actual){
    if(!actual.hasOwnProperty(key)) continue;
    if(Object.isObject(actual[key]) || Object.isArray(actual[key])){
      if(!deepEqualWithoutPrototyping(actual[key], expected[key])){
        return false;
      }
    } else if(actual[key] !== expected[key]){
      return false;
    }
  }
  if((actual && !expected) || (expected && !actual)){
    return false;
  }
  return true;
}

same = function(actual, expected, message){
  if(Object.isObject(actual) || Object.isObject(expected)){
    equals(deepEqualWithoutPrototyping(actual, expected), true, message);
  } else {
    sameProxy.apply(this, arguments);
  }
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

var objectPrototypeMethods = {};

var rememberObjectProtoypeMethods = function(){
  for(var m in Object.prototype){
    if(!Object.prototype.hasOwnProperty(m)) continue;
    objectPrototypeMethods[m] = Object.prototype[m];
  }
}

var restoreObjectPrototypeMethods = function(){
  for(var m in Object.prototype){
    if(!Object.prototype.hasOwnProperty(m)) continue;
    var actualProp = objectPrototypeMethods.hasOwnProperty(m) && objectPrototypeMethods[m];
    if(Object.prototype[m] == actualProp){
      continue;
    } else if(actualProp){
      Object.prototype[m] = objectPrototypeMethods[m];
    } else {
      delete Object.prototype[m];
    }
  }
}

var assertRaisesError = function(fn, message){
  var raised = false;
  try {
    fn.call();
  } catch(e){
    raised = true;
  }
  equals(raised, true, message);
}

test('Number', function () {

  var counter;
  var ret;


  var rand = Number.random();
  equalsWithException(rand == 0 || rand == 1, true, { mootools: false }, 'Number.random | no params = 0 or 1');

  rand = Number.random(10);
  equalsWithException(rand >= 0 && rand <= 10, true, { mootools: false }, 'Number.random | min not defined, max is 10');
  equalsWithException(rand % 1, 0, { mootools: 'NaN' }, 'Number.random | number is whole');

  rand = Number.random(536224, 536280);
  equals(rand >= 536224 && rand <= 536280, true, 'Number.random | min and max defined');

  rand = Number.random(6, -5);
  equals(rand >= -5 && rand <= 6, true, 'Number.random | min and max can be reversed');



  equals((4).toNumber(), 4, 'Number#toNumber | 4 is 4');
  equals((10000).toNumber(), 10000, 'Number#toNumber | 10000 is 10000');
  equals((5.2345).toNumber(), 5.2345, 'Number#toNumber | 5.2345 is 5.2345');



  equals((5.5).ceil(), 6, 'Number#ceil | 5.5');
  equals((5.14).ceil(), 6, 'Number#ceil | 5.14');
  equals((5).ceil(), 5, 'Number#ceil | 5');
  equals((-5.5).ceil(), -5, 'Number#ceil | -5.5');
  equals((-5.14).ceil(), -5, 'Number#ceil | -5.14');
  equals((-5).ceil(), -5, 'Number#ceil | -5');
  equals((4417.1318).ceil(0), 4418, 'Number#ceil | 0');
  equalsWithException((4417.1318).ceil(1), 4417.2, { prototype: 4418, mootools: 4418 }, 'Number#ceil | 1');
  equalsWithException((4417.1318).ceil(2), 4417.14, { prototype: 4418, mootools: 4418 }, 'Number#ceil | 2');
  equalsWithException((4417.1318).ceil(3), 4417.132, { prototype: 4418, mootools: 4418 }, 'Number#ceil | 3');
  equalsWithException((4417.1318).ceil(-1), 4420, { prototype: 4418, mootools: 4418 }, 'Number#ceil | -1');
  equalsWithException((4417.1318).ceil(-2), 4500, { prototype: 4418, mootools: 4418 }, 'Number#ceil | -2');
  equalsWithException((4417.1318).ceil(-3), 5000, { prototype: 4418, mootools: 4418 }, 'Number#ceil | -3');

  equals((5.5).floor(), 5, 'Number#floor | 5.5');
  equals((5.14).floor(), 5, 'Number#floor | 5.14');
  equals((5.9).floor(), 5, 'Number#floor | 5.9');
  equals((5).floor(), 5, 'Number#floor | 5');
  equals((-5.5).floor(), -6, 'Number#floor | -5.5');
  equals((-5.14).floor(), -6, 'Number#floor | -5.14');
  equals((-5).floor(), -5, 'Number#floor | -5');
  equals((4417.1318).floor(0), 4417, 'Number#floor | 0');
  equalsWithException((4417.1318).floor(1), 4417.1, { prototype: 4417, mootools: 4417 }, 'Number#floor | 1');
  equalsWithException((4417.1318).floor(2), 4417.13, { prototype: 4417, mootools: 4417 }, 'Number#floor | 2');
  equalsWithException((4417.1318).floor(3), 4417.131, { prototype: 4417, mootools: 4417 }, 'Number#floor | 3');
  equalsWithException((4417.1318).floor(-1), 4410, { prototype: 4417, mootools: 4417 }, 'Number#floor | -1');
  equalsWithException((4417.1318).floor(-2), 4400, { prototype: 4417, mootools: 4417 }, 'Number#floor | -2');
  equalsWithException((4417.1318).floor(-3), 4000, { prototype: 4417, mootools: 4417 }, 'Number#floor | -3');


  equals((-5).abs(), 5, 'Number#abs | -5');
  equals((5).abs(), 5, 'Number#abs | 5');
  equals((-3.324).abs(), 3.324, 'Number#abs | -3.324');
  equals((3.324).abs(), 3.324, 'Number#abs | 3.324');


  equals((3).pow(2), 9, 'Number#pow | 3 ^ 2');
  equals((3).pow(1), 3, 'Number#pow | 3 ^ 1');
  equals((12).pow(2), 144, 'Number#pow | 12 ^ 2');
  equals((3).pow(3), 27, 'Number#pow | 3 ^ 3');
  equals((3).pow(0), 1, 'Number#pow | zero is allowed');
  equalsWithException((3).pow(), 3, { mootools: 'NaN' }, 'Number#pow | undefined defaults to 1');


  equals((3).round(), 3, 'Number#round | 3');
  equals((3.241).round(), 3, 'Number#round | 3.241');
  equals((3.752).round(), 4, 'Number#round | 3.752');
  equals((-3.241).round(), -3, 'Number#round | -3.241');
  equals((-3.752).round(), -4, 'Number#round | -3.752');
  equalsWithException((3.241).round(1), 3.2, { prototype: 3 }, 'Number#round | 3.241 to 1 place');

  equalsWithException((3.752).round(1), 3.8, { prototype: 4 }, 'Number#round | 3.752 to 1 place');
  equalsWithException((3.241).round(2), 3.24, { prototype: 3 },  'Number#round | 3.241 to 2 places');
  equalsWithException((3.752).round(2), 3.75, { prototype: 4 },  'Number#round | 3.752 to 2 places');

  equalsWithException((322855.241).round(-2), 322900, { prototype: 322855 }, 'Number#round | 322855.241 to -2 places');
  equalsWithException((322855.241).round(-3), 323000, { prototype: 322855 }, 'Number#round | 322855.241 to -3 places');
  equalsWithException((322855.241).round(-4), 320000, { prototype: 322855 }, 'Number#round | 322855.241 to -4 places');
  equalsWithException((322855.241).round(-6), 0, { prototype: 322855 }, 'Number#round | 322855.241 to -6 places');
  equalsWithException((722855.241).round(-6), 1000000, { prototype: 722855 }, 'Number#round | 722855.241 to -6 places');
  equalsWithException((722855.241).round(-8), 0, { prototype: 722855 }, 'Number#round | 722855.241 to -8 places');


  equals((65).chr(), 'A', 'Number#chr | 65');
  equals((24536).chr(), '忘', 'Number#chr | 24536');
  equals((20294).chr(), '但', 'Number#chr | 20294');

  counter = 0;
  var dCounter = 5;
  ret = (5).downto(1, function(i){
    equal(i, dCounter, 'Number#downto | index is set');
    counter++;
    dCounter--;
  });
  equal(counter, 5, 'Number#downto | iterated 5 times');
  same(ret, [5,4,3,2,1], 'Number#downto | returns array');


  counter = 0;
  var dCounter = 1;
  ret = (1).upto(5, function(i){
    equal(i, dCounter, 'Number#upto | index is set');
    counter++;
    dCounter++;
  });
  equal(counter, 5, 'Number#upto | iterated 5 times');
  same(ret, [1,2,3,4,5], 'Number#upto | returns array');

  counter = 0;
  ret = (5).downto(10, function(){});
  equal(counter, 0, 'Number#downto | 5 downto 10 | iterates 0 times');
  same(ret, [], 'Number#downto | 5 downto 10 | returns empty array');

  counter = 0;
  ret = (5).upto(1, function(){});
  equal(counter, 0, 'Number#downto | 5 up to 1 | iterates 0 times');
  same(ret, [], 'Number#downto | 5 up to 1 | returns empty array');


  counter = 0;
  (5).times(function(first){
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



  equals((1).isOdd(), true, 'Number#odd | 1');
  equals((2).isOdd(), false, 'Number#odd | 2');




  equals((1).isEven(), false, 'Number#even | 1');
  equals((2).isEven(), true, 'Number#even | 2');



  equals((1).ordinalize(), '1st', 'Number#ordinalize | 1');
  equals((2).ordinalize(), '2nd', 'Number#ordinalize | 2');
  equals((3).ordinalize(), '3rd', 'Number#ordinalize | 3');
  equals((4).ordinalize(), '4th', 'Number#ordinalize | 4');
  equals((5).ordinalize(), '5th', 'Number#ordinalize | 5');
  equals((6).ordinalize(), '6th', 'Number#ordinalize | 6');
  equals((7).ordinalize(), '7th', 'Number#ordinalize | 7');
  equals((8).ordinalize(), '8th', 'Number#ordinalize | 8');
  equals((9).ordinalize(), '9th', 'Number#ordinalize | 9');
  equals((10).ordinalize(), '10th', 'Number#ordinalize | 10');
  equals((11).ordinalize(), '11th', 'Number#ordinalize | 11');
  equals((12).ordinalize(), '12th', 'Number#ordinalize | 12');
  equals((13).ordinalize(), '13th', 'Number#ordinalize | 13');
  equals((14).ordinalize(), '14th', 'Number#ordinalize | 14');
  equals((15).ordinalize(), '15th', 'Number#ordinalize | 15');
  equals((20).ordinalize(), '20th', 'Number#ordinalize | 20');
  equals((21).ordinalize(), '21st', 'Number#ordinalize | 21');
  equals((22).ordinalize(), '22nd', 'Number#ordinalize | 22');
  equals((23).ordinalize(), '23rd', 'Number#ordinalize | 23');
  equals((24).ordinalize(), '24th', 'Number#ordinalize | 24');
  equals((25).ordinalize(), '25th', 'Number#ordinalize | 25');
  equals((100).ordinalize(), '100th', 'Number#ordinalize | 100');
  equals((101).ordinalize(), '101st', 'Number#ordinalize | 101');
  equals((102).ordinalize(), '102nd', 'Number#ordinalize | 102');
  equals((103).ordinalize(), '103rd', 'Number#ordinalize | 103');
  equals((104).ordinalize(), '104th', 'Number#ordinalize | 104');
  equals((105).ordinalize(), '105th', 'Number#ordinalize | 105');


  equals((100).format(), '100', 'Number#format | 100')
  equals((1).format(), '1', 'Number#format | 1')
  equals((10).format(), '10', 'Number#format | 10')
  equals((100).format(), '100', 'Number#format | 100')
  equals((1000).format(), '1,000', 'Number#format | 1,000')
  equals((10000).format(), '10,000', 'Number#format | 10,000')
  equals((100000).format(), '100,000', 'Number#format | 100,000')
  equals((1000000).format(), '1,000,000', 'Number#format | 1,000,000')
  equals((1000000.01).format(), '1,000,000.01', 'Number#format | 1,000,000.01')
  equals((-100).format(), '-100', 'Number#format | -100')
  equals((-1).format(), '-1', 'Number#format | -1')
  equals((-1000).format(), '-1,000', 'Number#format | -1,000')
  equals((-1000000.01).format(), '-1,000,000.01', 'Number#format | -1,000,000.01')

  equals((0.52).format(), '0.52', 'Number#format | 0.52')

  // These discrepancies are due to floating point variable limitations.
  equals((100046546510000.022435451).format().replace(/\.\d+$/, ''), '100,046,546,510,000', 'Number#format | 100,046,546,510,000')
  equals((-100046546510000.022435451).format().replace(/\.\d+$/, ''), '-100,046,546,510,000', 'Number#format | -100,046,546,510,000')

  equals((1000).format(' '), '1 000', 'Number#format | 1000')
  equals((1532587).format(' '), '1 532 587', 'Number#format | larger number')
  equals((1532587.5752).format(' ', ','), '1 532 587,5752', 'Number#format | larger number with decimal')
  equals((9999999.99).format(), '9,999,999.99', 'Number#format | Standard');
  equals((9999999.99).format('.',','), '9.999.999,99', 'Number#format | Euro style!');



  equals((1).pad(0), '1', 'Number#pad | 1 no padding')
  equals((1).pad(1), '1', 'Number#pad | 1 padded to 1 place')
  equals((1).pad(2), '01', 'Number#pad | 1 padded to 2 places')
  equals((1).pad(3), '001', 'Number#pad | 1 padded to 3 places')
  equals((1).pad(4), '0001', 'Number#pad | 1 padded to 4 places')
  equals((547).pad(0), '547', 'Number#pad | 547 no padding')
  equals((547).pad(1), '547', 'Number#pad | 547 padded to 1 place')
  equals((547).pad(2), '547', 'Number#pad | 547 padded to 2 places')
  equals((547).pad(3), '547', 'Number#pad | 547 padded to 3 places')
  equals((547).pad(4), '0547', 'Number#pad | 547 padded to 4 places')
  equals((0).pad(0), '', 'Number#pad | 0 no padding')
  equals((0).pad(1), '0', 'Number#pad | 0 padded to 1 place')
  equals((0).pad(2), '00', 'Number#pad | 0 padded to 2 places')
  equals((0).pad(3), '000', 'Number#pad | 0 padded to 3 places')
  equals((0).pad(4), '0000', 'Number#pad | 0 padded to 4 places')
  equals((-1).pad(1), '-1', 'Number#pad | -1 padded to 1 places')
  equals((-1).pad(2), '-01', 'Number#pad | -1 padded to 2 places')
  equals((-1).pad(3), '-001', 'Number#pad | -1 padded to 3 places')
  equals((-1).pad(4), '-0001', 'Number#pad | -1 padded to 4 places')
  equals((1).pad(1, true), '+1', 'Number#pad | 1 padded to 1 places and sign')
  equals((1).pad(2, true), '+01', 'Number#pad | 1 padded to 2 places and sign')
  equals((1).pad(3, true), '+001', 'Number#pad | 1 padded to 3 places and sign')
  equals((1).pad(4, true), '+0001', 'Number#pad | 1 padded to 4 places and sign')
  equals((0).pad(1, true), '+0', 'Number#pad | 0 padded to 1 place and sign')



  equals((0).hex(), '0', 'Number#hex | 0')
  equals((10).hex(), 'a', 'Number#hex | 10')
  equals((255).hex(), 'ff', 'Number#hex | 255')
  equals((0.5).hex(), '0.8', 'Number#hex | 0.5')
  equals((2.5).hex(), '2.8', 'Number#hex | 2.5')
  equals((2553423).hex(), '26f64f', 'Number#hex | 2553423')

  equals((4).milliseconds(), 4, 'Number#milliseconds | 4');
  equals((3.25).milliseconds(), 3, 'Number#milliseconds | rounded');

  equals((0).seconds(), 0, 'Number#seconds | 0');
  equals((1).seconds(), 1000, 'Number#seconds | 1');
  equals((30).seconds(), 30000, 'Number#seconds | 30');
  equals((60).seconds(), 60000, 'Number#seconds | 60');


  equals((1).minutes(), 60000, 'Number#minutes | 1');
  equals((10).minutes(), 600000, 'Number#minutes | 10');
  equals((100).minutes(), 6000000, 'Number#minutes | 100');
  equals((0).minutes(), 0, 'Number#minutes | 0');
  equals((0.5).minutes(), 30000, 'Number#minutes | 0.5');
  equals((1).minutes(), (60).seconds(), 'Number#minutes | 1 minute is 60 seconds');

  equals((1).hours(), 3600000, 'Number#hours | 1');
  equals((10).hours(), 36000000, 'Number#hours | 10');
  equals((100).hours(), 360000000, 'Number#hours | 100');
  equals((0).hours(), 0, 'Number#hours | 0');
  equals((0.5).hours(), 1800000, 'Number#hours | 0.5');
  equals((1).hours(), (60).minutes(), 'Number#hours | 1 hour is 60 minutes');
  equals((1).hours(), (3600).seconds(), 'Number#hours | 1 hour is 3600 seconds');


  equals((1).days(), 86400000, 'Number#days | 1');
  equals((10).days(), 864000000, 'Number#days | 10');
  equals((100).days(), 8640000000, 'Number#days | 100');
  equals((0).days(), 0, 'Number#days | 0');
  equals((0.5).days(), 43200000, 'Number#days | 0.5');
  equals((1).days(), (24).hours(), 'Number#days | 1 day is 24 hours');
  equals((1).days(), (1440).minutes(), 'Number#days | 1 day is 1440 minutes');
  equals((1).days(), (86400).seconds(), 'Number#days | 1 day is 86400 seconds');


  equals((1).weeks(), 604800000, 'Number#weeks | 1');
  equals((0.5).weeks(), 302400000, 'Number#weeks | 0.5');
  equals((10).weeks(), 6048000000, 'Number#weeks | 10');
  equals((0).weeks(), 0, 'Number#weeks | 0');
  equals((1).weeks(), (7).days(), 'Number#weeks | 1 week is 7 days');
  equals((1).weeks(), (24 * 7).hours(), 'Number#weeks | 1 week is 24 * 7 hours');
  equals((1).weeks(), (60 * 24 * 7).minutes(), 'Number#weeks | 1 week is 60 * 24 * 7 minutes');
  equals((1).weeks(), (60 * 60 * 24 * 7).seconds(), 'Number#weeks | 1 week is 60 * 60 * 24 * 7 seconds');

  equals((1).months(), 2629800000, 'Number#months | 1 month');
  equals((0.5).months(), 1314900000, 'Number#months | 0.5 month');
  equals((10).months(), 26298000000, 'Number#months | 10 month');
  equals((0).months(), 0, 'Number#months | 0 months');
  equals((1).months(), (30.4375).days(), 'Number#months | 1 month is 30.4375 days');
  equals((1).months(), (24 * 30.4375).hours(), 'Number#months | 1 month is 24 * 30.4375 hours');
  equals((1).months(), (60 * 24 * 30.4375).minutes(), 'Number#months | 1 month is 60 * 24 * 30.4375 minutes');
  equals((1).months(), (60 * 60 * 24 * 30.4375).seconds(), 'Number#months | 1 month is 60 * 60 * 24 * 30.4375 seconds');

  equals((1).years(), 31557600000, 'Number#years | 1');
  equals((0.5).years(), 15778800000, 'Number#years | 0.5');
  equals((10).years(), 315576000000, 'Number#years | 10');
  equals((0).years(), 0, 'Number#years | 0');
  equals((1).years(), (365.25).days(), 'Number#years | 1 year is 365.25 days');
  equals((1).years(), (24 * 365.25).hours(), 'Number#years | 1 year is 24 * 365.25 hours');
  equals((1).years(), (60 * 24 * 365.25).minutes(), 'Number#years | 1 year is 60 * 24 * 365.25 minutes');
  equals((1).years(), (60 * 60 * 24 * 365.25).seconds(), 'Number#years | 1 year is 60 * 60 * 24 * 365.25 seconds');



  /* compatibility */

  equals((1).second(), 1000, 'Number#second | 1 second');
  equals((1).minute(), 60000, 'Number#minute | 1 minute');
  equals((1).hour(), 3600000, 'Number#hour | 1 hour');
  equals((1).day(), 86400000, 'Number#day | 1 day');
  equals((1).week(), 604800000, 'Number#week | 1 week');
  equals((1).month(), 2629800000, 'Number#month | 1 month');
  equals((1).year(), 31557600000, 'Number#year | 1 year');


  dateEquals((1).secondAfter(), 1000, 'Number#secondAfter | 1');
  dateEquals((5).secondsAfter(), 5000, 'Number#secondsAfter | 5');
  dateEquals((10).minutesAfter(), 600000, 'Number#minutesAfter | 10');

  dateEquals((1).secondFromNow(), 1000, 'Number#secondFromNow | 1');
  dateEquals((5).secondsFromNow(), 5000, 'Number#secondsFromNow | 5');
  dateEquals((10).minutesFromNow(), 600000, 'Number#minutesFromNow | 10');

  dateEquals((1).secondAgo(), -1000, 'Number#secondAgo | 1');
  dateEquals((5).secondsAgo(), -5000, 'Number#secondAgo | 5');
  dateEquals((10).secondsAgo(), -10000, 'Number#secondAgo | 10');

  dateEquals((1).secondBefore(), -1000, 'Number#secondBefore | 1');
  dateEquals((5).secondsBefore(), -5000, 'Number#secondBefore | 5');
  dateEquals((10).secondsBefore(), -10000, 'Number#secondBefore | 10');


  dateEquals((5).minutesAfter((5).minutesAgo()), 0, 'Number#minutesAfter | 5 minutes after 5 minutes ago');
  dateEquals((10).minutesAfter((5).minutesAgo()), 1000 * 60 * 5, 'Number#minutesAfter | 10 minutes after 5 minutes ago');

  dateEquals((5).minutesFromNow((5).minutesAgo()), 0, 'Number#minutesFromNow | 5 minutes from now 5 minutes ago');
  dateEquals((10).minutesFromNow((5).minutesAgo()), 1000 * 60 * 5, 'Number#minutesFromNow | 10 minutes from now 5 minutes ago');

  dateEquals((5).minutesAgo((5).minutesFromNow()), 0, 'Number#minutesAgo | 5 minutes ago 5 minutes from now');
  dateEquals((10).minutesAgo((5).minutesFromNow()), -(1000 * 60 * 5), 'Number#minutesAgo | 10 minutes ago 5 minutes from now');

  dateEquals((5).minutesBefore((5).minutesFromNow()), 0, 'Number#minutesBefore | 5 minutes before 5 minutes from now');
  dateEquals((10).minutesBefore((5).minutesFromNow()), -(1000 * 60 * 5), 'Number#minutesBefore | 10 minutes before 5 minutes from now');


  var christmas = new Date('December 25, 1965');
  dateEquals((5).minutesBefore(christmas), getRelativeDate.call(christmas, null, null, null, null, -5), 'Number#minutesBefore | 5 minutes before christmas');
  dateEquals((5).minutesAfter(christmas), getRelativeDate.call(christmas, null, null, null, null, 5), 'Number#minutesAfter | 5 minutes after christmas');

  dateEquals((5).hoursBefore(christmas), getRelativeDate.call(christmas, null, null, null, -5), 'Number#hoursBefore | 5 hours before christmas');
  dateEquals((5).hoursAfter(christmas), getRelativeDate.call(christmas, null, null, null, 5), 'Number#hoursAfter | 5 hours after christmas');

  dateEquals((5).daysBefore(christmas), getRelativeDate.call(christmas, null, null, -5), 'Number#daysBefore | 5 days before christmas');
  dateEquals((5).daysAfter(christmas), getRelativeDate.call(christmas, null, null, 5), 'Number#daysAfter | 5 days after christmas');

  dateEquals((5).weeksBefore(christmas), getRelativeDate.call(christmas, null, null, -35), 'Number#weeksBefore | 5 weeks before christmas');
  dateEquals((5).weeksAfter(christmas), getRelativeDate.call(christmas, null, null, 35), 'Number#weeksAfter | 5 weeks after christmas');

  dateEquals((5).monthsBefore(christmas), getRelativeDate.call(christmas, null, -5), 'Number#monthsBefore | 5 months before christmas');
  dateEquals((5).monthsAfter(christmas), getRelativeDate.call(christmas, null, 5), 'Number#monthsAfter | 5 months after christmas');

  dateEquals((5).yearsBefore(christmas), getRelativeDate.call(christmas, -5), 'Number#yearsBefore | 5 years before christmas');
  dateEquals((5).yearsAfter(christmas), getRelativeDate.call(christmas, 5), 'Number#yearsAfter | 5 years after christmas');

  dateEquals((5).hoursBefore(1965, 11, 25), getRelativeDate.call(christmas, null, null, null, -5), 'Number#hoursBefore | accepts numbers');

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



  equals('test regexp'.escapeRegExp(), 'test regexp', 'String#escapeRegExp | nothing to escape');
  equals('test reg|exp'.escapeRegExp(), 'test reg\\|exp', 'String#escapeRegExp | should escape pipe');
  equals('hey there (budday)'.escapeRegExp(), 'hey there \\(budday\\)', 'String#escapeRegExp | should escape parentheses');
  equals('.'.escapeRegExp(), '\\.', 'String#escapeRegExp | should escape period');
  equals('what a day...'.escapeRegExp(), 'what a day\\.\\.\\.', 'String#escapeRegExp | should escape many period');
  equals('*.+[]{}()?|/'.escapeRegExp(), '\\*\\.\\+\\[\\]\\{\\}\\(\\)\\?\\|\\/', 'String#escapeRegExp | complex regex tokens');


  /* Leaving these tests but this method seems all but totally useless
  equals('test regexp'.unescapeRegExp(), 'test regexp', 'String#unescapeRegExp | nothing to unescape');
  equals('test reg\\|exp'.unescapeRegExp(), 'test reg|exp', 'String#unescapeRegExp | should unescape pipe');
  equals('hey there \\(budday\\)'.unescapeRegExp(), 'hey there (budday)', 'String#unescapeRegExp | should unescape parentheses');
  equals('\\.'.unescapeRegExp(), '.', 'String#unescapeRegExp | should unescape period');
  equals('what a day\\.\\.\\.'.unescapeRegExp(), 'what a day...', 'String#unescapeRegExp | should unescape many period');
  equals('\\*\\.\\+\\[\\]\\{\\}\\(\\)\\?\\|\\/'.unescapeRegExp(), '*.+[]{}()?|/', 'String#unescapeRegExp | complex regex tokens');
  */


  equals('what a day...'.escapeURL(), 'what%20a%20day...', 'String#escapeURL | ...');
  equals('/?:@&=+$#'.escapeURL(), '/?:@&=+$#', 'String#escapeURL | url chars');
  equals('!%^*()[]{}\\:'.escapeURL(), '!%25%5E*()%5B%5D%7B%7D%5C:', 'String#escapeURL | non url special chars');
  equals('http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846'.escapeURL(), 'http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846', 'String#escapeURL | amazon link');
  equals('http://twitter.com/#!/nov/status/85613699410296833'.escapeURL(), 'http://twitter.com/#!/nov/status/85613699410296833', 'String#escapeURL | twitter link');
  equals('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2 fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141'.escapeURL(), 'http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%252BIA%252BUA%252BFICS%252%20fBUFI%252BDDSIC&otn=10&pmod=260625794431%252B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', 'String#escapeURL | ebay link');


  equals('what a day...'.escapeURL(true), 'what%20a%20day...', 'String#escapeURL | full | ...');
  equals('/?:@&=+$#'.escapeURL(true), '%2F%3F%3A%40%26%3D%2B%24%23', 'String#escapeURL | full | url chars');
  equals('!%^*()[]{}\\:'.escapeURL(true), '!%25%5E*()%5B%5D%7B%7D%5C%3A', 'String#escapeURL | full | non url special chars');
  equals('http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846'.escapeURL(true), 'http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846', 'String#escapeURL | full | amazon link');
  equals('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2 fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141'.escapeURL(true), 'http%3A%2F%2Fcgi.ebay.com%2FT-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-%2F350233503515%3F_trksid%3Dp5197.m263%26_trkparms%3Dalgo%3DSIC%26itu%3DUCI%252BIA%252BUA%252BFICS%252%20fBUFI%252BDDSIC%26otn%3D10%26pmod%3D260625794431%252B370476659389%26po%3DLVI%26ps%3D63%26clkid%3D962675460977455716%23ht_3216wt_1141', 'String#escapeURL | full | ebay link');

  equals('what%20a%20day...'.unescapeURL(), 'what a day...', 'String#unescapeURL | full | ...');
  equals('%2F%3F%3A%40%26%3D%2B%24%23'.unescapeURL(), '/?:@&=+$#', 'String#unescapeURL | full | url chars');
  equals('!%25%5E*()%5B%5D%7B%7D%5C%3A'.unescapeURL(), '!%^*()[]{}\\:', 'String#unescapeURL | full | non url special chars');
  equals('http%3A%2F%2Fsomedomain.com%3Fparam%3D%22this%3A%20isn\'t%20an%20easy%20URL%20to%20escape%22'.unescapeURL(), 'http://somedomain.com?param="this: isn\'t an easy URL to escape"', 'String#unescapeURL | full | fake url')
  equals('http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846'.unescapeURL(), 'http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846', 'String#unescapeURL | full | amazon link');
  equals('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo%3DSIC%26itu%3DUCI%252BIA%252BUA%252BFICS%252BUFI%252BDDSIC%26otn%3D10%26pmod%3D260625794431%252B370476659389%26po%3DLVI%26ps%3D63%26clkid%3D962675460977455716'.unescapeURL(), 'http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2BUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716', 'String#unescapeURL | full | ebay link');


  equals('what%20a%20day...'.unescapeURL(true), 'what a day...', 'String#unescapeURL | ...');
  equals('%2F%3F%3A%40%26%3D%2B%24%23'.unescapeURL(true), '%2F%3F%3A%40%26%3D%2B%24%23', 'String#unescapeURL | url chars');
  equals('!%25%5E*()%5B%5D%7B%7D%5C:'.unescapeURL(true), '!%^*()[]{}\\:', 'String#unescapeURL | non url special chars');
  equals('http%3A%2F%2Fsomedomain.com%3Fparam%3D%22this%3A%20isn\'t%20an%20easy%20URL%20to%20escape%22'.unescapeURL(true), 'http%3A%2F%2Fsomedomain.com%3Fparam%3D"this%3A isn\'t an easy URL to escape"', 'String#unescapeURL | fake url')
  equals('http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846'.unescapeURL(true), 'http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846', 'String#unescapeURL | amazon link');
  equals('http://twitter.com/#!/nov/status/85613699410296833'.unescapeURL(true), 'http://twitter.com/#!/nov/status/85613699410296833', 'String#unescapeURL | twitter link');
  equals('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141'.unescapeURL(true), 'http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', 'String#unescapeURL | ebay link');




  assertRaisesError(function(){ '% 23'.unescapeURL(); }, 'String#unescapeURL | partial | should raise an error for malformed urls');
  assertRaisesError(function(){ '% 23'.unescapeURL(true); }, 'String#unescapeURL | full | should raise an error for malformed urls');


  equals('This webpage is not available'.encodeBase64(), 'VGhpcyB3ZWJwYWdlIGlzIG5vdCBhdmFpbGFibGU=', 'String#encodeBase64 | webpage');
  equals('I grow, I prosper; Now, gods, stand up for bastards!'.encodeBase64(), 'SSBncm93LCBJIHByb3NwZXI7IE5vdywgZ29kcywgc3RhbmQgdXAgZm9yIGJhc3RhcmRzIQ==', 'String#encodeBase64 | gods');
  equals('räksmörgås'.encodeBase64(), 'cuRrc232cmflcw==', 'String#encodeBase64 | shrimp sandwich');
  equals('rÃ¤ksmÃ¶rgÃ¥s'.encodeBase64(), 'csOka3Ntw7ZyZ8Olcw==', 'String#encodeBase64 | shrimp sandwich');

  equals('VGhpcyB3ZWJwYWdlIGlzIG5vdCBhdmFpbGFibGU='.decodeBase64(), 'This webpage is not available', 'String#decodeBase64 | webpage');
  equals('SSBncm93LCBJIHByb3NwZXI7IE5vdywgZ29kcywgc3RhbmQgdXAgZm9yIGJhc3RhcmRzIQ=='.decodeBase64(), 'I grow, I prosper; Now, gods, stand up for bastards!', 'String#decodeBase64 | gods');

  assertRaisesError(function(){ '@#$^#$^#@$^'.decodeBase64(); }, 'String#decodeBase64 | should throw an error on non-base64 chars');

  var test;

  equalsWithException('reuben sandwich'.capitalize(), 'Reuben sandwich', { mootools: 'Reuben Sandwich' }, 'String#capitalize | should capitalize first letter of first word only.');
  equalsWithException('REUBEN SANDWICH'.capitalize(), 'Reuben sandwich', { mootools: 'REUBEN SANDWICH' }, 'String#capitalize | should uncapitalize all other letter');
  equalsWithException('Reuben sandwich'.capitalize(), 'Reuben sandwich', { mootools: 'Reuben Sandwich' }, 'String#capitalize | should leave the string alone');

  same('wasabi'.chars(), ['w','a','s','a','b','i'], 'String#chars | splits string into constituent chars');

  equal('   wasabi   '.trim(), 'wasabi', 'String#chars | should trim both left and right whitespace');
  equal('   wasabi   '.trimLeft(), 'wasabi   ', 'String#trim | should trim left whitespace only');
  equal('   wasabi   '.trimRight(), '   wasabi', 'String#trim | should trim right whitespace only');

  equal('wasabi'.pad(), 'wasabi', 'String#pad | passing no params');
  equal('wasabi'.pad(-1), 'wasabi', 'String#pad | passing in -1');
  equal('wasabi'.pad(3), '   wasabi   ', 'String#pad | should pad the string with 3 spaces');
  equal('wasabi'.pad(5), '     wasabi     ', 'String#pad | should pad the string with 5 spaces');
  equal('wasabi'.pad(5, '-'), '-----wasabi-----', 'String#pad | should pad the string with 5 hyphens');
  equal('wasabi'.pad(2).pad(3, '-'), '---  wasabi  ---', 'String#pad | should pad the string with 2 spaces and 3 hyphens');

  equal('wasabi'.padRight(3, '-'), 'wasabi---', 'String#pad | should pad the string with 3 hyphens on the right');
  equal('4'.padLeft(3, '0'), '0004', 'String#pad | should pad the string with 4 zeroes on the left');
  equal('wasabi'.padLeft(3), '   wasabi', 'String#pad | should pad the string with 3 spaces on the left');
  equal('wasabi'.padRight(3), 'wasabi   ', 'String#pad | should pad the string with 3 spaces on the right');
  equal('wasabi'.pad() === 'wasabi', true, 'String#pad | strict equality works');

  equal('wasabi'.repeat(0), '', 'String#repeat | 0 should repeat the string 0 times');
  equal('wasabi'.repeat(-1), 'wasabi', 'String#repeat | -1 should do nothing to the string');
  equal('wasabi'.repeat(2), 'wasabiwasabi', 'String#repeat | 2 should repeat the string 2 times');

  // "each" will return an array of everything that was matched, defaulting to individual characters
  same('g'.each(), ['g'], 'String#each | each should return an array of each char');

  // Each without a first parameter assumes "each character"
  var result = 'g'.each(function(str, i){
    strictlyEqual(str, 'g', 'String#each | char should be passed as the first argument');
  });

  same(result, ['g'], "String#each | ['g'] should be the resulting value");

  var counter = 0;
  result = 'ginger'.each(function(str, i){
    equal(str, 'ginger'.charAt(counter), 'String#each | ginger | char should be passed as the first argument');
    equal(i, counter, 'String#each | ginger | index should be passed as the second argument');
    counter++;
  });
  equal(counter, 6, 'String#each | ginger | should have ran 6 times');
  same(result, ['g','i','n','g','e','r'], 'String#each | ginger | resulting array should contain all the characters');

  counter = 0;
  result = 'ginger'.each('g', function(str, i){
    equal(str, 'g', 'String#each | string argument | match should be passed as the first argument to the block');
    counter++;
  });
  equal(counter, 2, 'String#each | string argument | should have ran 2 times');
  same(result, ['g','g'], "String#each | string argument | resulting array should be ['g','g']");

  counter = 0;
  test = ['g','i','g','e'];
  result = 'ginger'.each(/[a-i]/g, function(str, i){
    equal(str, test[i], 'String#each | regexp argument | match should be passed as the first argument to the block');
    counter++;
  });
  equal(counter, 4, 'String#each | regexp argument | should have ran 4 times');
  same(result, ['g','i','g','e'], "String#each | regexp argument | resulting array should have been ['g','i','g','e']");


  /* .each should do the same thing as String#scan in ruby except that .each doesn't respect capturing groups */
  var testString = 'cruel world';

  result = testString.each(/\w+/g);
  same(result, ['cruel', 'world'], 'String#each | complex regexp | /\\w+/g');

  result = testString.each(/.../g);
  same(result, ['cru', 'el ', 'wor'], 'String#each | complex regexp | /.../');

  result = testString.each(/(..)(..)/g);
  same(result, ['crue', 'l wo'], 'String#each | complex regexp | /(..)(..)/');


  result = testString.each(/\w+/);
  same(result, ['cruel', 'world'], 'String#each non-global regexes should still be global');


  /* test each char code */

  same('jumpy'.codes(), [106,117,109,112,121], 'String#codes | jumpy');

  counter = 0;
  test = [103,105,110,103,101,114];
  result = 'ginger'.codes(function(str, i){
    equal(str, test[i], 'String#codes | ginger codes | char code should have been passed into the block');
    counter++;
  });
  equal(counter, 6, 'String#codes | ginger codes | should have ran 6 times');
  same(result, test, 'String#codes | ginger codes | result should be an array');

  /* test each char */
  counter = 0;
  result = 'ginger'.chars(function(str, i){
    equal(str, 'ginger'.charAt(counter), 'String#chars | ginger | char code should be the first argument in the block');
    equal(i, counter, 'String#chars | ginger | index should be the second argument in the block');
    counter++;
  });
  equal(counter, 6, 'String#chars | ginger | should have run 6 times');
  same(result, ['g','i','n','g','e','r'], 'String#chars | result should be an array');

  /* test each char collects when properly returned */
  counter = 0;
  result = 'ginger'.chars(function(str, i){
    counter++;
    return str.toUpperCase();
  });
  same(result, ['G','I','N','G','E','R'], 'String#chars | ginger | resulting array is properly collected');

  counter = 0;
  var sentence = 'these pretzels are \n\n making me         thirsty!\n\n';
  test = ['these', 'pretzels', 'are', 'making', 'me', 'thirsty!'];
  result = sentence.words(function(str, i){
    equal(str, test[i], 'String#words | match is the first argument');
    counter++;
  });
  equal(counter, 6, 'String#words | should have run 6 times');
  same(result, test, 'String#words | result should be an array of matches');

  counter = 0;
  var paragraph = 'these\npretzels\nare\n\nmaking\nme\n         thirsty!\n\n\n\n';
  test = ['these', 'pretzels', 'are', '', 'making', 'me', '         thirsty!'];
  result = paragraph.lines(function(str, i){
    equal(str, test[i], 'String#lines | match is the first argument');
    counter++;
  });
  equal(counter, 7, 'String#lines | should have run 7 times');
  same(result, test, 'String#lines | result should be an array of matches');

  result = 'one\ntwo'.lines(function(str, i){
    return str.capitalize();
  });
  same(['One','Two'], result, 'String#lines | lines can be modified');

  counter = 0;
  var essay = 'the history of the united states\n\n';
  essay +=    'it all began back in 1776 when someone declared something from someone.\n';
  essay +=    'it was at this point that we had to get our rears in gear\n\n';
  essay +=    'The British got their revenge in the late 60s with the British Invasion,\n';
  essay +=    'which claimed the lives of over 32,352 young women across the nation.\n\n\n\n\n';
  essay +=    'The End\n\n\n\n\n\n\n';
  test = ['the history of the united states', 'it all began back in 1776 when someone declared something from someone.\nit was at this point that we had to get our rears in gear', 'The British got their revenge in the late 60s with the British Invasion,\nwhich claimed the lives of over 32,352 young women across the nation.', 'The End'];
  result = essay.paragraphs(function(str, i){
    equal(str, test[i], 'String#paragraphs | match is the first argument');
    counter ++;
  });
  equal(counter, 4, 'String#paragraphs | should have run 4 times');
  same(result, test, 'String#paragraphs | result should be an array of matches');


  same(''.codes(), [], 'String#codes | empty string');
  same(''.chars(), [], 'String#chars | empty string');
  same(''.words(), [], 'String#words | empty string');
  same(''.lines(), [''], 'String#lines | empty string');
  same(''.paragraphs(), [''], 'String#paragraphs | empty string');
  same(''.each('f'), [], 'String#each | empty string | each f');
  same(''.each(/foo/), [], 'String#each | empty string | each /foo/');
  same(''.each(function(){}), [], 'String#each | empty string | passing a block');




  equal('ō'.normalize(), 'o', 'String#normalize | ō is o');
  equal('o'.normalize(), 'o', 'String#normalize | o is o');
  equal('kyōto'.normalize(), 'kyoto', 'String#normalize | kyōto is kyoto ');
  equal(''.normalize(), '', 'String#normalize | empty string');
  equal('äěìøůŷñ'.normalize(), 'aeiouyn', 'String#normalize | äěìøůŷñ is aeiouyn');

  equal('Ō'.normalize(), 'O', 'String#normalize | Ō is O');
  equal('KYŌTO'.normalize(), 'KYOTO', 'String#normalize | KYŌTO is KYOTO');
  equal('ÄĚÌØŮŶÑ'.normalize(), 'AEIOUYN', 'String#normalize | ÄĚÌØŮŶÑ is AEIOUYN');

  equal('ÀÁÂÃÄÅ'.normalize(), 'AAAAAA', 'String#normalize | test basic main chars');
  equal('òóôõöø'.normalize(), 'oooooo', 'String#normalize | test basic o');
  equal('ĆćĈĉĊċČč'.normalize(), 'CcCcCcCc', 'String#normalize | test basic o');
  equal('ǖ'.normalize(), 'u', 'String#normalize | test basic o');
  equal('ＦＵＬＬＷＩＤＴＨ'.normalize(), 'FULLWIDTH', 'String#normalize | fullwidth characters');


  equal('hello'.startsWith('hell'), true, 'String#startsWith | hello starts with hell');
  equal('HELLO'.startsWith('HELL'), true, 'String#startsWith | HELLO starts with HELL');
  equal('HELLO'.startsWith('hell'), false, 'String#startsWith | HELLO starts with hell');
  equal('HELLO'.startsWith('hell', true), false, 'String#startsWith | case sensitive | HELLO starts with hell');
  equalsWithException('hello'.startsWith(/hell/), true, { prototype: false }, 'String#startsWith | accepts regex');
  equalsWithException('hello'.startsWith(/[a-h]/), true, { prototype: false }, 'String#startsWith | accepts regex alternates');
  equalsWithException('HELLO'.startsWith('hell', false), true, { prototype: false }, 'String#startsWith | case insensitive | HELLO starts with hell');
  equal('valley girls\nrock'.startsWith('valley girls'), true, 'String#startsWith | valley girls rock starts with valley girls');
  equal('valley girls\nrock'.startsWith('valley girls r'), false, 'String#startsWith | valley girls rock starts with valley girls r');


  equal('vader'.endsWith('der'), true, 'String#endsWith | vader ends with der');
  equal('VADER'.endsWith('DER'), true, 'String#endsWith | VADER ends with DER');
  equal('VADER'.endsWith('der'), false, 'String#endsWith | VADER ends with der');
  equal('VADER'.endsWith('DER', false), true, 'String#endsWith | case insensitive | VADER ends with DER');
  equalsWithException('vader'.endsWith(/der/), true, { prototype: false }, 'String#endsWith | accepts regex');
  equalsWithException('vader'.endsWith(/[q-z]/), true, { prototype: false }, 'String#endsWith | accepts regex alternates');
  equalsWithException('VADER'.endsWith('der', false), true, { prototype: false }, 'String#endsWith | case insensitive |  VADER ends with der');
  equal('VADER'.endsWith('DER', true), true, 'String#endsWith | case sensitive | VADER ends with DER');
  equal('VADER'.endsWith('der', true), false, 'String#endsWith | case sensitive |  VADER ends with der');
  equal('i aint your\nfather'.endsWith('father'), true, 'String#endsWith | vader ends with der');
  equal('i aint your\nfather'.endsWith('r father'), false, 'String#endsWith | vader ends with der');


  equal(''.isBlank(), true, 'String#blank | blank string');
  equal('0'.isBlank(), false, 'String#blank | 0');
  equal('            '.isBlank(), true, 'String#blank | successive blanks');
  equal('\n'.isBlank(), true, 'String#blank | new line');
  equal('\t\t\t\t'.isBlank(), true, 'String#blank | tabs');
  equal('日本語では　「マス」　というの知ってた？'.isBlank(), false, 'String#blank | japanese');
  equal('mayonnaise'.isBlank(), false, 'String#blank | mayonnaise');
  //equalsWithException('　　　　　\n　　　'.isBlank(), true, { mootools: (jQuery.browser.msie ? false : true) }, 'String#blank | japanese zenkaku space');


  equal('foo'.has('f'), true, 'String#has | foo has f');
  equal('foo'.has('oo'), true, 'String#has | foo has oo');
  equal('foo'.has(/f/), true, 'String#has | foo has /f/');
  equal('foo'.has(/[a-g]/), true, 'String#has | foo has /[a-g]/');
  equal('foo'.has(/[p-z]/), false, 'String#has | foo has /[p-z]/');
  equal('foo'.has(/f$/), false, 'String#has | foo has /f$/');


  equal('five'.insert('schfifty '), 'schfifty five', 'String#insert | schfiffy five');
  equal('dopamine'.insert('e', 3), 'dopeamine', 'String#insert | dopeamine');
  equal('spelling eror'.insert('r', -3), 'spelling error', 'String#insert | inserts from the end');
  equal('flack'.insert('a', 0), 'aflack', 'String#insert | inserts at 0');
  equal('five'.insert('schfifty', 20), 'five', 'String#insert | does not insert out of positive range');
  equal('five'.insert('schfifty', -20), 'five', 'String#insert | does not insert out of negative range');
  equal('five'.insert('schfifty', 4), 'fiveschfifty', 'String#insert | inserts at position 4');
  equal('five'.insert('schfifty', 5), 'five', 'String#insert | inserts at position 5');

  equal('カタカナ'.hankaku(), 'ｶﾀｶﾅ', 'String#hankaku | katakana');
  equal('こんにちは。ヤマダタロウです。'.hankaku(), 'こんにちは｡ﾔﾏﾀﾞﾀﾛｳです｡', 'String#hankaku |  hankaku katakana inside a string');
  equal('こんにちは。ＴＡＲＯ　ＹＡＭＡＤＡです。'.hankaku(), 'こんにちは｡TARO YAMADAです｡', 'String#hankaku | hankaku romaji inside a string');
  equal('　'.hankaku(), ' ', 'String#hankaku | spaces');
  equal('　'.hankaku('p'), ' ', 'String#hankaku | punctuation | spaces');


  var barabara = 'こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！（笑）';
  equal(barabara.hankaku(), 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)', 'String#hankaku | modes | full conversion');
  equal(barabara.hankaku('all'), 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)', 'String#hankaku | modes all | full conversion');
  equal(barabara.hankaku('a'), 'こんにちは。タロウ　YAMADAです。１８才です！（笑）', 'String#hankaku | modes | romaji only');
  equal(barabara.hankaku('n'), 'こんにちは。タロウ　ＹＡＭＡＤＡです。18才です！（笑）', 'String#hankaku | modes | numbers only');
  equal(barabara.hankaku('k'), 'こんにちは。ﾀﾛｳ　ＹＡＭＡＤＡです。１８才です！（笑）', 'String#hankaku | modes | katakana only');
  equal(barabara.hankaku('p'), 'こんにちは｡タロウ ＹＡＭＡＤＡです｡１８才です!（笑）', 'String#hankaku | modes | punctuation only');
  equal(barabara.hankaku('s'), 'こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！(笑)', 'String#hankaku | modes | special chars only');

  equal(barabara.hankaku('an'), 'こんにちは。タロウ　YAMADAです。18才です！（笑）', 'String#hankaku | modes | alphabet and numbers');
  equal(barabara.hankaku('ak'), 'こんにちは。ﾀﾛｳ　YAMADAです。１８才です！（笑）', 'String#hankaku | modes | alphabet and katakana');
  equal(barabara.hankaku('as'), 'こんにちは。タロウ　YAMADAです。１８才です！(笑)', 'String#hankaku | modes | alphabet and special');
  equal(barabara.hankaku('ap'), 'こんにちは｡タロウ YAMADAです｡１８才です!（笑）', 'String#hankaku | modes | alphabet and punctuation');

  equal(barabara.hankaku('na'), 'こんにちは。タロウ　YAMADAです。18才です！（笑）', 'String#hankaku | modes reverse | alphabet and numbers');
  equal(barabara.hankaku('ka'), 'こんにちは。ﾀﾛｳ　YAMADAです。１８才です！（笑）', 'String#hankaku | modes reverse | alphabet and katakana');
  equal(barabara.hankaku('sa'), 'こんにちは。タロウ　YAMADAです。１８才です！(笑)', 'String#hankaku | modes reverse | alphabet and special');
  equal(barabara.hankaku('pa'), 'こんにちは｡タロウ YAMADAです｡１８才です!（笑）', 'String#hankaku | modes reverse | alphabet and punctuation');

  equal(barabara.hankaku('alphabet'), 'こんにちは。タロウ　YAMADAです。１８才です！（笑）', 'String#hankaku | modes full | alphabet');
  equal(barabara.hankaku('numbers'), 'こんにちは。タロウ　ＹＡＭＡＤＡです。18才です！（笑）', 'String#hankaku | modes full | numbers');
  equal(barabara.hankaku('katakana'), 'こんにちは。ﾀﾛｳ　ＹＡＭＡＤＡです。１８才です！（笑）', 'String#hankaku | modes full | katakana');
  equal(barabara.hankaku('punctuation'), 'こんにちは｡タロウ ＹＡＭＡＤＡです｡１８才です!（笑）', 'String#hankaku | modes full | punctuation');
  equal(barabara.hankaku('special'), 'こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！(笑)', 'String#hankaku | modes full | special');


  equal('ｶﾀｶﾅ'.zenkaku(), 'カタカナ', 'String#zenkaku | katakana');
  equal(' '.zenkaku(), '　', 'String#zenkaku | spaces');
  equal(' '.zenkaku('p'), '　', 'String#zenkaku | punctuation | spaces');


  barabara = 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)';

  equal(barabara.zenkaku(), 'こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！（笑）', 'String#zenkaku | modes | full conversion');
  equal(barabara.zenkaku('a'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡18才です!(笑)', 'String#zenkaku | modes | alphabet');
  equal(barabara.zenkaku('n'), 'こんにちは｡ﾀﾛｳ YAMADAです｡１８才です!(笑)', 'String#zenkaku | modes | number');
  equal(barabara.zenkaku('k'), 'こんにちは｡タロウ YAMADAです｡18才です!(笑)', 'String#zenkaku | modes | katakana');
  equal(barabara.zenkaku('p'), 'こんにちは。ﾀﾛｳ　YAMADAです。18才です！(笑)', 'String#zenkaku | modes | punctuation');
  equal(barabara.zenkaku('s'), 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!（笑）', 'String#zenkaku | modes | special');

  equal(barabara.zenkaku('an'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡１８才です!(笑)', 'String#zenkaku | modes | alphabet and numbers');
  equal(barabara.zenkaku('ak'), 'こんにちは｡タロウ ＹＡＭＡＤＡです｡18才です!(笑)', 'String#zenkaku | modes | alphabet and katakana');
  equal(barabara.zenkaku('as'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡18才です!（笑）', 'String#zenkaku | modes | alphabet and special');
  equal(barabara.zenkaku('ap'), 'こんにちは。ﾀﾛｳ　ＹＡＭＡＤＡです。18才です！(笑)', 'String#zenkaku | modes | alphabet and punctuation');

  equal(barabara.zenkaku('na'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡１８才です!(笑)', 'String#zenkaku | modes reverse | alphabet and numbers');
  equal(barabara.zenkaku('ka'), 'こんにちは｡タロウ ＹＡＭＡＤＡです｡18才です!(笑)', 'String#zenkaku | modes reverse | alphabet and katakana');
  equal(barabara.zenkaku('sa'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡18才です!（笑）', 'String#zenkaku | modes reverse | alphabet and special');
  equal(barabara.zenkaku('pa'), 'こんにちは。ﾀﾛｳ　ＹＡＭＡＤＡです。18才です！(笑)', 'String#zenkaku | modes reverse | alphabet and punctuation');

  equal(barabara.zenkaku('alphabet'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡18才です!(笑)', 'String#zenkaku | modes full | alphabet');
  equal(barabara.zenkaku('numbers'), 'こんにちは｡ﾀﾛｳ YAMADAです｡１８才です!(笑)', 'String#zenkaku | modes full | numbers');
  equal(barabara.zenkaku('katakana'), 'こんにちは｡タロウ YAMADAです｡18才です!(笑)', 'String#zenkaku | modes full | katakana');
  equal(barabara.zenkaku('special'), 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!（笑）', 'String#zenkaku | modes full | special');
  equal(barabara.zenkaku('punctuation'), 'こんにちは。ﾀﾛｳ　YAMADAです。18才です！(笑)', 'String#zenkaku | modes full | punctuation');


  equal('ガ'.hankaku(), 'ｶﾞ', 'String#hankaku | dakuten | ガ');
  equal('ｶﾞ'.zenkaku(), 'ガ', 'String#zenkaku | dakuten | ｶ');
  equal('ｶﾞ'.hiragana(), 'が', 'String#hiragana | dakuten | ｶ');


  equal('カタカナ'.hiragana(), 'かたかな', 'String#hiragana | from katakana');
  equal('ｶﾀｶﾅ'.hiragana(), 'かたかな', 'String#hiragana | convert from hankaku katakana');
  equal('ｶﾀｶﾅ'.hiragana(false), 'ｶﾀｶﾅ', 'String#hiragana | no widths |convert from hankaku katakana');
  equal(barabara.hiragana(), 'こんにちは｡たろう YAMADAです｡18才です!(笑)', 'String#hiragana | full string');
  equal(barabara.zenkaku().hiragana(), 'こんにちは。たろう　ＹＡＭＡＤＡです。１８才です！（笑）', 'String#hiragana | full string to zenkaku');
  equal(barabara.hiragana(false), 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)', 'String#hiragana | no widths | full string');




  equal('ひらがな'.katakana(), 'ヒラガナ', 'String#katakana | from hiragana');
  equal(barabara.katakana(), 'コンニチハ｡ﾀﾛｳ YAMADAデス｡18才デス!(笑)', 'String#katakana | full string');
  equal(barabara.zenkaku().katakana(), 'コンニチハ。タロウ　ＹＡＭＡＤＡデス。１８才デス！（笑）', 'String#katakana full string to zenkaku');


  equal('こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！（笑）'.katakana().hankaku(), 'ｺﾝﾆﾁﾊ｡ﾀﾛｳ YAMADAﾃﾞｽ｡18才ﾃﾞｽ!(笑)', 'String#katakana | full string to katakana and hankaku');


  equal('4em'.toNumber(), 4, 'String#toNumber | 4em');
  equal('10px'.toNumber(), 10, 'String#toNumber | 10px');
  equal('10,000'.toNumber(), 10000, 'String#toNumber | 10,000');
  equal('5,322,144,444'.toNumber(), 5322144444, 'String#toNumber | 5,322,144,444');
  equal('10.532'.toNumber(), 10.532, 'String#toNumber | 10.532');
  equal('10'.toNumber(), 10, 'String#toNumber | 10');
  equal('95.25%'.toNumber(), 95.25, 'String#toNumber | 95.25%');
  equal('10.848'.toNumber(), 10.848, 'String#toNumber | 10.848');

  equal('1234blue'.toNumber(), 1234, 'String#toNumber | 1234blue');
  equal(isNaN('0xA'.toNumber()), false, 'String#toNumber | "0xA" should not be NaN');
  equal('22.5'.toNumber(), 22.5, 'String#toNumber | 22.5');
  equal(isNaN('blue'.toNumber()), true, 'String#toNumber | "blue" should not be NaN');

  equal('010'.toNumber(), 10, 'String#toNumber | "010" should be 10');
  equal('0908'.toNumber(), 908, 'String#toNumber | "0908" should be 908');
  equal('22.34.5'.toNumber(), 22.34, 'String#toNumber | "22.34.5" should be 22.34');

  equal(isNaN('........'.toNumber()), true, 'String#toNumber | "......." should be NaN');

  equal('1.45kg'.toNumber(), 1.45, 'String#toNumber | "1.45kg"');
  equal('77.3'.toNumber(), 77.3, 'String#toNumber | 77.3');
  equal('077.3'.toNumber(), 77.3, 'String#toNumber | "077.3" should be 77.3');
  equal(isNaN('0x77.3'.toNumber()), false, 'String#toNumber | "0x77.3" is not NaN');
  equal('.3'.toNumber(), 0.3, 'String#toNumber | ".3" should be 0.3');
  equal('0.1e6'.toNumber(), 100000, 'String#toNumber | "0.1e6" should be 100000');


  // This should handle hexadecimal, etc
  equal('ff'.toNumber(16), 255, 'String#toNumber | hex | ff');
  equal('00'.toNumber(16), 0, 'String#toNumber | hex | 00');
  equal('33'.toNumber(16), 51, 'String#toNumber | hex | 33');
  equal('66'.toNumber(16), 102, 'String#toNumber | hex | 66');
  equal('99'.toNumber(16), 153, 'String#toNumber | hex | 99');
  equal('bb'.toNumber(16), 187, 'String#toNumber | hex | bb');




  equal('spoon'.reverse(), 'noops', 'String#reverse | spoon');
  equal('amanaplanacanalpanama'.reverse(), 'amanaplanacanalpanama', 'String#reverse | amanaplanacanalpanama');


  equal('the rain in     spain    falls mainly   on     the        plain'.compact(), 'the rain in spain falls mainly on the plain', 'String#compact | basic');
  equal('\n\n\nthe \n\n\nrain in     spain    falls mainly   on     the        plain\n\n'.compact(), 'the rain in spain falls mainly on the plain', 'String#compact | with newlines');
  equal('\n\n\n\n           \t\t\t\t          \n\n      \t'.compact(), '', 'String#compact | with newlines and tabs');

  var largeJapaneseSpaces = '　　　日本語　　　　　の　　　　　スペース　　　　　も　　';
  var compactedWithoutJapaneseSpaces = '日本語　の　スペース　も';
  var compactedWithTrailingJapaneseSpaces = '　日本語　の　スペース　も　';
  //equalsWithException(largeJapaneseSpaces.compact(), compactedWithoutJapaneseSpaces, { mootools: (jQuery.browser.msie ? compactedWithTrailingJapaneseSpaces : compactedWithoutJapaneseSpaces) }, 'String#compact | japanese spaces');




  equal('foop'.at(0), 'f', 'String#at | pos 0');
  equal('foop'.at(1), 'o', 'String#at | pos 1');
  equal('foop'.at(2), 'o', 'String#at | pos 2');
  equal('foop'.at(3), 'p', 'String#at | pos 3');
  equal('foop'.at(4), 'f', 'String#at | pos 4');
  equal('foop'.at(5), 'o', 'String#at | pos 5');
  equal('foop'.at(1224), 'f', 'String#at | out of bounds');
  equal('foop'.at(-1), 'p', 'String#at | negative | pos -1');
  equal('foop'.at(-2), 'o', 'String#at | negative | pos -2');
  equal('foop'.at(-3), 'o', 'String#at | negative | pos -3');
  equal('foop'.at(-4), 'f', 'String#at | negative | pos -4');
  equal('foop'.at(-5), 'p', 'String#at | negative | pos -5');
  equal('foop'.at(-1224), 'f', 'String#at | negative | out of bounds');

  equal('foop'.at(0, false), 'f', 'String#at | pos 0');
  equal('foop'.at(1, false), 'o', 'String#at | pos 1');
  equal('foop'.at(2, false), 'o', 'String#at | pos 2');
  equal('foop'.at(3, false), 'p', 'String#at | pos 3');
  equal('foop'.at(4, false), '', 'String#at | pos 4');
  equal('foop'.at(1224, false), '', 'String#at | out of bounds');
  equal('foop'.at(-1, false), '', 'String#at | negative | pos -1');
  equal('foop'.at(-2, false), '', 'String#at | negative | pos -2');
  equal('foop'.at(-3, false), '', 'String#at | negative | pos -3');
  equal('foop'.at(-4, false), '', 'String#at | negative | pos -4');
  equal('foop'.at(-5, false), '', 'String#at | negative | pos -5');
  equal('foop'.at(-1224, false), '', 'String#at | negative | out of bounds');

  same('wowzers'.at(0,2,4,6), ['w','w','e','s'], 'String#at | handles enumerated params');


  equal('quack'.first(), 'q', 'String#first | first character');
  equal('quack'.first(2), 'qu', 'String#first | first 2 characters');
  equal('quack'.first(3), 'qua', 'String#first | first 3 characters');
  equal('quack'.first(4), 'quac', 'String#first | first 4 characters');
  equal('quack'.first(20), 'quack', 'String#first | first 20 characters');
  equal('quack'.first(0), '', 'String#first | first 0 characters');
  equal('quack'.first(-1), '', 'String#first | first -1 characters');
  equal('quack'.first(-5), '', 'String#first | first -5 characters');
  equal('quack'.first(-10), '', 'String#first | first -10 characters');



  equal('quack'.last(), 'k', 'String#last | last character');
  equal('quack'.last(2), 'ck', 'String#last | last 2 characters');
  equal('quack'.last(3), 'ack', 'String#last | last 3 characters');
  equal('quack'.last(4), 'uack', 'String#last | last 4 characters');
  equal('quack'.last(10), 'quack', 'String#last | last 10 characters');
  equal('quack'.last(-1), '', 'String#last | last -1 characters');
  equal('quack'.last(-5), '', 'String#last | last -5 characters');
  equal('quack'.last(-10), '', 'String#last | last -10 characters');
  equal('fa'.last(3), 'fa', 'String#last | last 3 characters');


  equal('quack'.from(), 'quack', 'String#from | no params');
  equal('quack'.from(0), 'quack', 'String#from | from 0');
  equal('quack'.from(2), 'ack', 'String#from | from 2');
  equal('quack'.from(4), 'k', 'String#from | from 4');
  equal('quack'.from(-1), 'k', 'String#from | from -1');
  equal('quack'.from(-3), 'ack', 'String#from | from -3');
  equal('quack'.from(-4), 'uack', 'String#from | from -4');


  equal('quack'.to(), 'quack', 'String#to | no params');
  equal('quack'.to(0), '', 'String#to | to 0');
  equal('quack'.to(1), 'q', 'String#to | to 1');
  equal('quack'.to(2), 'qu', 'String#to | to 2');
  equal('quack'.to(4), 'quac', 'String#to | to 4');
  equal('quack'.to(-1), 'quac', 'String#to | to -1');
  equal('quack'.to(-3), 'qu', 'String#to | to -3');
  equal('quack'.to(-4), 'q', 'String#to | to -4');


  dateEquals('October 16, 1987'.toDate(), new Date('October 16, 1987'), 'String#toDate | text format');
  dateEquals('11/5/56'.toDate(), new Date('11/5/56'), 'String#toDate | slash format');
  equals(''.toDate().toString(), new Date().toString(), 'String#toDate | blank');
  equals('barf'.toDate().toString(), new Date('barf').toString(), 'String#toDate | barf');
  dateEquals('August 25, 1978'.toDate(),  new Date(1978, 7, 25), 'String#toDate | relative format');

  equal('hop_on_pop'.dasherize(), 'hop-on-pop', 'String#dasherize | underscores');
  equalsWithException('HOP_ON_POP'.dasherize(), 'hop-on-pop', { prototype: 'HOP-ON-POP' }, 'String#dasherize | capitals and underscores');
  equalsWithException('hopOnPop'.dasherize(), 'hop-on-pop', { prototype: 'hopOnPop' }, 'String#dasherize | camel-case');
  equalsWithException('hop-on-pop'.camelize(), 'HopOnPop', { prototype: 'hopOnPop' }, 'String#camelize | dashes');
  equalsWithException('HOP-ON-POP'.camelize(), 'HopOnPop', { prototype: 'HOPONPOP' }, 'String#camelize | capital dashes');
  equalsWithException('hop_on_pop'.camelize(), 'HopOnPop', { prototype: 'hop_on_pop' }, 'String#camelize | underscores');
  equal('hop-on-pop'.camelize(false), 'hopOnPop', 'String#camelize | first false | dashes');
  equalsWithException('HOP-ON-POP'.camelize(false), 'hopOnPop', { prototype: 'HOPONPOP' }, 'String#camelize | first false | capital dashes');
  equalsWithException('hop_on_pop'.camelize(false), 'hopOnPop', { prototype: 'hop_on_pop' }, 'String#camelize | first false | underscores');
  equalsWithException('hop-on-pop'.camelize(true), 'HopOnPop', { prototype: 'hopOnPop' }, 'String#camelize | first true | dashes');
  equalsWithException('HOP-ON-POP'.camelize(true), 'HopOnPop', { prototype: 'HOPONPOP' }, 'String#camelize | first true | capital dashes');
  equalsWithException('hop_on_pop'.camelize(true), 'HopOnPop', { prototype: 'hop_on_pop' }, 'String#camelize | first true | underscores');
  equal('hopOnPop'.underscore(), 'hop_on_pop', 'String#underscore | camel-case');
  equal('HopOnPop'.underscore(), 'hop_on_pop', 'String#underscore | camel-case capital first');
  equal('HOPONPOP'.underscore(), 'hoponpop', 'String#underscore | all caps');
  equal('HOP-ON-POP'.underscore(), 'hop_on_pop', 'String#underscore | caps and dashes');
  equal('hop-on-pop'.underscore(), 'hop_on_pop', 'String#underscore | lower-case and dashes');


  equal('what a shame of a title'.titleize(), 'What A Shame Of A Title', 'String#titleize | all lower-case');
  equal('What A Shame Of A Title'.titleize(), 'What A Shame Of A Title', 'String#titleize | already titleized');
  equal(' what a shame of a title    '.titleize(), 'What A Shame Of A Title', 'String#titleize | with whitespace');
  equal(' what a shame of\n a title    '.titleize(), 'What A Shame Of A Title', 'String#titleize | with whitespace and newlines');



  equal('ア'.isKatakana(), true, 'String#isKatakana | ア');
  equal('ｱ'.isKatakana(), true, 'String#isKatakana | ｱ');
  equal('ァ'.isKatakana(), true, 'String#isKatakana | ァ');
  equal('ah'.isKatakana(), false, 'String#isKatakana | ah');
  equal('アイカムインピース'.isKatakana(), true, 'String#isKatakana | full katakana');
  equal('アイカムinピース'.isKatakana(), false, 'String#isKatakana | full katakana with romaji');
  equal('アイカム イン ピース'.isKatakana(), true, 'String#isKatakana | full katakana with spaces');

  equal('ア'.hasKatakana(), true, 'String#hasKatakana | ア');
  equal('ｱ'.hasKatakana(), true, 'String#hasKatakana | ｱ');
  equal('ah'.hasKatakana(), false, 'String#hasKatakana | ah');
  equal('aアh'.hasKatakana(), true, 'String#hasKatakana | aアh');
  equal('aｱh'.hasKatakana(), true, 'String#hasKatakana | aｱh');
  equal('アイカムインピース'.hasKatakana(), true, 'String#hasKatakana | full katakana');
  equal('アイカムinピース'.hasKatakana(), true, 'String#hasKatakana | full katakana with romaji');


  equal('あ'.isHiragana(), true, 'String#isHiragana | あ');
  equal('ぁ'.isHiragana(), true, 'String#isHiragana | ぁ');
  equal('ah'.isHiragana(), false, 'String#isHiragana | ah');
  equal('あいかむいんぴーす'.isHiragana(), true, 'String#isHiragana | full hiragana');
  equal('あいかむinぴーす'.isHiragana(), false, 'String#isHiragana | full hiragana with romaji');
  equal('あいかむ in ぴーす'.isHiragana(), false, 'String#isHiragana | full hiragana with romaji and spaces');
  equal('アイカム イン ピース'.isHiragana(), false, 'String#isHiragana | full hiragana with spaces');


  equal('あ'.hasHiragana(), true, 'String#hasHiragana | あ');
  equal('ぁ'.hasHiragana(), true, 'String#hasHiragana | ぁ');
  equal('ah'.hasHiragana(), false, 'String#hasHiragana | ah');
  equal('aあh'.hasHiragana(), true, 'String#hasHiragana | aあh');
  equal('aぁh'.hasHiragana(), true, 'String#hasHiragana | aぁh');
  equal('あいかむいんぴーす'.hasHiragana(), true, 'String#hasHiragana | full hiragana');
  equal('あいかむinぴーす'.hasHiragana(), true, 'String#hasHiragana | full hiragana with romaji');




  equal(''.isKana(), false, 'String#isKana | blank');
  equal('あいうえお'.isKana(), true, 'String#isKana | hiragana');
  equal('アイウエオ'.isKana(), true, 'String#isKana | katakana');
  equal('あうえおアイウエオ'.isKana(), true, 'String#isKana | hiragana and katakan');
  equal('あうえおaeiouアイウエオ'.isKana(), false, 'String#isKana | hiragana, katakana, and romaji');
  equal('  あいうえお  '.isKana(), true, 'String#isKana | hiragana with whitespace');
  equal('  アイウエオ \n '.isKana(), true, 'String#isKana | katakana with whitespace and a newline');





  equal(''.hasKana(), false, 'String#hasKana | blank');
  equal('aeiou'.hasKana(), false, 'String#hasKana | romaji');
  equal('あいうえお'.hasKana(), true, 'String#hasKana | hiragana');
  equal('アイウエオ'.hasKana(), true, 'String#hasKana | katakana');
  equal('あうえおアイウエオ'.hasKana(), true, 'String#hasKana | hiragana and katakana');
  equal('あうえおaeiouアイウエオ'.hasKana(), true, 'String#hasKana | hiragana, katakana, and romaji');
  equal('aeiouアaeiou'.hasKana(), true, 'String#hasKana | katakana with romaji outside');
  equal('aeiouaeiou'.hasKana(), false, 'String#hasKana | romaji all the way');



  equal(''.isHan(), false, 'String#isHan | blank');
  equal('aeiou'.isHan(), false, 'String#isHan | romaji');
  equal('あいうえお'.isHan(), false, 'String#isHan | hiragana');
  equal('アイウエオ'.isHan(), false, 'String#isHan | katakana');
  equal('あうえおaeiouアイウエオ'.isHan(), false, 'String#isHan | hiragana, katakana, and romaji');
  equal('合コン'.isHan(), false, 'String#isHan | mixed kanji and katakana');
  equal('語学'.isHan(), true, 'String#isHan | kango');
  equal('庭には二羽鶏がいる。'.isHan(), false, 'String#isHan | full sentence');
  equal(' 語学 '.isHan(), true, 'String#isHan | kango with whitespace');
  equal(' 語学\t '.isHan(), true, 'String#isHan | kango with whitespace and tabs');



  equal(''.hasHan(), false, 'String#hasHan | blank');
  equal('aeiou'.hasHan(), false, 'String#hasHan | romaji');
  equal('あいうえお'.hasHan(), false, 'String#hasHan | hiragana');
  equal('アイウエオ'.hasHan(), false, 'String#hasHan | katakana');
  equal('あうえおaeiouアイウエオ'.hasHan(), false, 'String#hasHan | hiragana, katakana, and romaji');
  equal('合コン'.hasHan(), true, 'String#hasHan | mixed kanji and katakana');
  equal('語学'.hasHan(), true, 'String#hasHan | kango');
  equal('庭には二羽鶏がいる。'.hasHan(), true, 'String#hasHan | full sentence');
  equal(' 語学 '.hasHan(), true, 'String#hasHan | kango with whitespace');
  equal(' 語学\t '.hasHan(), true, 'String#hasHan | kango with whitespace and tabs');





  equal(''.isKanji(), false, 'String#isKanji | blank');
  equal('aeiou'.isKanji(), false, 'String#isKanji | romaji');
  equal('あいうえお'.isKanji(), false, 'String#isKanji | hiragana');
  equal('アイウエオ'.isKanji(), false, 'String#isKanji | katakana');
  equal('あうえおaeiouアイウエオ'.isKanji(), false, 'String#isKanji | hiragana, katakana, and romaji');
  equal('合コン'.isKanji(), false, 'String#isKanji | mixed kanji and katakana');
  equal('語学'.isKanji(), true, 'String#isKanji | kango');
  equal('庭には二羽鶏がいる。'.isKanji(), false, 'String#isKanji | full sentence');
  equal(' 語学 '.isKanji(), true, 'String#isKanji | kango with whitespace');
  equal(' 語学\t '.isKanji(), true, 'String#isKanji | kango with whitespace and tabs');





  equal(''.hasKanji(), false, 'String#hasKanji | blank');
  equal('aeiou'.hasKanji(), false, 'String#hasKanji | romaji');
  equal('あいうえお'.hasKanji(), false, 'String#hasKanji | hiragana');
  equal('アイウエオ'.hasKanji(), false, 'String#hasKanji | katakana');
  equal('あうえおaeiouアイウエオ'.hasKanji(), false, 'String#hasKanji | hiragana, katakana, and romaji');
  equal('合コン'.hasKanji(), true, 'String#hasKanji | mixed kanji and katakana');
  equal('語学'.hasKanji(), true, 'String#hasKanji | kango');
  equal('庭には二羽鶏がいる。'.hasKanji(), true, 'String#hasKanji | full sentence');
  equal(' 語学 '.hasKanji(), true, 'String#hasKanji | kango with whitespace');
  equal(' 語学\t '.hasKanji(), true, 'String#hasKanji | kango with whitespace and tabs');


  equal('모'.isHangul(), true, 'String#isHangul | character');
  equal('난 뻔데기를 싫어 한 사람 이다...너는?'.isHangul(), false, 'String#isHangul | full sentence');
  equal('안녕 하세요'.isHangul(), true, 'String#isHangul | how are you?');
  equal('ㅠブラじゃない！'.isHangul(), false, 'String#isHangul | mixed with kana');

  equal('모'.hasHangul(), true, 'String#hasHangul | character');
  equal('난 뻔데기를 싫어 한 사람 이다...너는?'.hasHangul(), true, 'String#hasHangul | full sentence');
  equal('안녕 하세요.'.hasHangul(), true, 'String#hasHangul | how are you?');
  equal('ㅠブラじゃない！'.hasHangul(), false, 'String#hasHangul | mixed with kana');

  equal('שְׂרָאֵל'.isHebrew(), true, 'String#isHebrew');
  equal('שְׂרָאֵל'.hasHebrew(), true, 'String#hasHebrew');


  var stripped;
  var html =
    '<div class="outer">' +
      '<p>text with <a href="http://foobar.com/">links</a>, &quot;entities&quot; and <b>bold</b> tags</p>' +
    '</div>';
  var allStripped = 'text with links, &quot;entities&quot; and bold tags';

  var malformed_html = '<div class="outer"><p>paragraph';


  stripped =
    '<div class="outer">' +
      '<p>text with links, &quot;entities&quot; and <b>bold</b> tags</p>' +
    '</div>';

  equalsWithException(html.stripTags('a'), stripped, { prototype: allStripped }, 'String#stripTags | stripped a tags');
  equal(html.stripTags('a') == html, false, 'String#stripTags | stripped <a> tags was changed');


  stripped =
    '<div class="outer">' +
      '<p>text with links, &quot;entities&quot; and bold tags</p>' +
    '</div>';
  equalsWithException(html.stripTags('a', 'b'), stripped, { prototype: allStripped}, 'String#stripTags | stripped <a> and <b> tags');


  stripped =
    '<div class="outer">' +
      'text with links, &quot;entities&quot; and <b>bold</b> tags' +
    '</div>';
  equalsWithException(html.stripTags('p', 'a'), stripped, { prototype: allStripped}, 'String#stripTags | stripped <p> and <a> tags');


  stripped = '<p>text with <a href="http://foobar.com/">links</a>, &quot;entities&quot; and <b>bold</b> tags</p>';
  equalsWithException(html.stripTags('div'), stripped, { prototype: allStripped}, 'String#stripTags | stripped <div> tags');


  stripped = 'text with links, &quot;entities&quot; and bold tags';
  equal(html.stripTags(), stripped, 'String#stripTags | all tags stripped');


  stripped = '<p>paragraph';
  equalsWithException(malformed_html.stripTags('div'), stripped, { prototype: 'paragraph' }, 'String#stripTags | malformed | div tag stripped');

  stripped = '<div class="outer">paragraph';
  equalsWithException(malformed_html.stripTags('p'), stripped, { prototype: 'paragraph' }, 'String#stripTags | malformed | p tags stripped');

  stripped = 'paragraph';
  equal(malformed_html.stripTags(), stripped, 'String#stripTags | malformed | all tags stripped');



  equalsWithException('<b NOT BOLD</b>'.stripTags(), '<b NOT BOLD', { prototype: '' }, "String#stripTags | does not strip tags that aren't properly closed");
  equal('a < b'.stripTags(), 'a < b', 'String#stripTags | does not strip less than');
  equal('a > b'.stripTags(), 'a > b', 'String#stripTags | does not strip greater than');
  equalsWithException('</foo  >>'.stripTags(), '>', { prototype: '</foo  >>' }, 'String#stripTags | strips closing tags with white space');



  /* Stipping self-closing tags */
  equal('<input type="text" class="blech" />'.stripTags(), '', 'String#stripTags | full input stripped');

  html =
    '<form action="poo.php" method="post">' +
    '<p>' +
      '<label>label for text:</label>' +
      '<input type="text" value="brabra" />' +
      '<input type="submit" value="submit" />' +
    '</p>' +
    '</form>';

  equal(html.stripTags(), 'label for text:', 'String#stripTags | form | all tags removed');
  equalsWithException(html.stripTags('input'), '<form action="poo.php" method="post"><p><label>label for text:</label></p></form>', { prototype: 'label for text:' }, 'String#stripTags | form | input tags stripped');
  equalsWithException(html.stripTags('input', 'p', 'form'), '<label>label for text:</label>', { prototype: 'label for text:' }, 'String#stripTags | form | input, p, and form tags stripped');

  /* Stripping namespaced tags */
  equalsWithException('<xsl:template>foobar</xsl:template>'.stripTags(), 'foobar', { prototype: '<xsl:template>foobar</xsl:template>' }, 'String#stripTags | strips tags with xml namespaces');
  equalsWithException('<xsl:template>foobar</xsl:template>'.stripTags('xsl:template'), 'foobar', { prototype: '<xsl:template>foobar</xsl:template>' }, 'String#stripTags | strips xsl:template');
  equalsWithException('<xsl/template>foobar</xsl/template>'.stripTags('xsl/template'), 'foobar', { prototype: '<xsl/template>foobar</xsl/template>' }, 'String#stripTags | strips xsl/template');


  /* No errors on RegExp */
  equalsWithException('<xsl(template>foobar</xsl(template>'.stripTags('xsl(template'), 'foobar', { prototype: '<xsl(template>foobar</xsl(template>' }, 'String#stripTags | no regexp errors on tokens');




  html =
    '<div class="outer">' +
      '<p>text with <a href="http://foobar.com/">links</a>, &quot;entities&quot; and <b>bold</b> tags</p>' +
    '</div>';
  var removed;

  removed =
    '<div class="outer">' +
      '<p>text with , &quot;entities&quot; and <b>bold</b> tags</p>' +
    '</div>';
  equal(html.removeTags('a'), removed, 'String#removeTags | <a> tag removed');
  equal(html.removeTags('a') == html, false, 'String#removeTags | html was changed');


  removed =
    '<div class="outer">' +
      '<p>text with , &quot;entities&quot; and  tags</p>' +
    '</div>';
  equal(html.removeTags('a', 'b'), removed, 'String#removeTags | <a> and <b> tags removed');


  removed =
    '<div class="outer"></div>';
  equal(html.removeTags('p', 'a'), removed, 'String#removeTags | <p> and <a> tags removed');


  equal(html.removeTags('div'), '', 'String#removeTags | <div> tags removed');
  equal(html.removeTags(), '', 'String#removeTags | removing all tags');

  equal(malformed_html.removeTags('div'), malformed_html, 'String#removeTags | malformed | <div> tags removed');
  equal(malformed_html.removeTags('p'), malformed_html, 'String#removeTags | malformed | <p> tags removed');
  equal(malformed_html.removeTags(), malformed_html, 'String#removeTags | malformed | all tags removed');



  equal('<b NOT BOLD</b>'.removeTags(), '<b NOT BOLD</b>', 'String#removeTags | unclosed opening tag untouched');
  equal('a < b'.removeTags(), 'a < b', 'String#removeTags | less than unaffected');
  equal('a > b'.removeTags(), 'a > b', 'String#removeTags | greater than unaffected');
  equal('</foo  >>'.removeTags(), '</foo  >>', 'String#removeTags | malformed closing tag unaffected');



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

  equal(html.removeTags(), '', 'String#removeTags | form | removing all tags');
  equal(html.removeTags('input'), '<form action="poo.php" method="post"><p><label>label for text:</label></p></form>', 'String#removeTags | form | removing input tags');
  equal(html.removeTags('input', 'p', 'form'), '', 'String#removeTags | form | removing input, p, and form tags');

  /* Stripping namespaced tags */
  equal('<xsl:template>foobar</xsl:template>'.removeTags(), '', 'String#removeTags | form | xml namespaced tags removed');
  equal('<xsl:template>foobar</xsl:template>'.removeTags('xsl:template'), '', 'String#removeTags | form | xsl:template removed');
  equal('<xsl/template>foobar</xsl/template>'.removeTags('xsl/template'), '', 'String#removeTags | form | xsl/template removed');


  /* No errors on RegExp */
  equal('<xsl(template>foobar</xsl(template>'.removeTags('xsl(template'), '', 'String#removeTags | form | no regexp token errors');



  same('foo=bar&moo=car'.toObject(), {foo:'bar',moo:'car'}, 'String#toObject | basic');
  same('foo=bar&moo=3'.toObject(), {foo:'bar',moo:3}, 'String#toObject | with numbers');
  same('foo=bar&moo=true'.toObject(), {foo:'bar',moo:true}, 'String#toObject | with true');
  same('foo=bar&moo=false'.toObject(), {foo:'bar',moo:false}, 'String#toObject | with false');






  strictlyEqual(''.escapeRegExp(), '', 'String#escapeRegExp | blank');
  strictlyEqual('|'.escapeRegExp(), '\\|', 'String#escapeRegExp | pipe');
  strictlyEqual(''.capitalize(), '', 'String#capitalize | blank');
  strictlyEqual('wasabi'.capitalize(), 'Wasabi', 'String#capitalize | wasabi');
  strictlyEqual(''.trim(), '', 'String#trim | blank');
  strictlyEqual(' wasabi '.trim(), 'wasabi', 'String#trim | wasabi with whitespace');
  strictlyEqual(''.trimLeft(), '', 'String#trimLeft | blank');
  strictlyEqual(' wasabi '.trimLeft(), 'wasabi ', 'String#trimLeft | wasabi with whitespace');
  strictlyEqual(''.trimRight(), '', 'String#trimRight | blank');
  strictlyEqual(' wasabi '.trimRight(), ' wasabi', 'String#trimRight | wasabi with whitespace');
  strictlyEqual(''.pad(0), '', 'String#pad | blank');
  strictlyEqual('wasabi'.pad(1), ' wasabi ', 'String#pad | wasabi padded to 1');
  strictlyEqual('wasabi'.repeat(0), '', 'String#repeat | repeating 0 times');
  strictlyEqual('wasabi'.repeat(1), 'wasabi', 'String#repeat | repeating 1 time');
  strictlyEqual('wasabi'.repeat(2), 'wasabiwasabi', 'String#repeat | repeating 2 time');
  strictlyEqual(''.normalize(), '', 'String#normalize | blank');
  strictlyEqual('wasabi'.normalize(), 'wasabi', 'String#normalize | wasabi');
  strictlyEqual(''.insert('-', 0), '-', 'String#insert | - inserted at 0');
  strictlyEqual('b'.insert('-', 0), '-b', 'String#insert | b inserted at 0');
  strictlyEqual('b'.insert('-', 1), 'b-', 'String#insert | b inserted at 1');
  strictlyEqual(''.hankaku(), '', 'String#hankaku | blank');
  strictlyEqual('カ'.hankaku(), 'ｶ', 'String#hankaku | カ');
  strictlyEqual(''.zenkaku(), '', 'String#zenkaku | blank');
  strictlyEqual('ｶ'.zenkaku(), 'カ', 'String#zenkaku | ｶ');
  strictlyEqual(''.hiragana(), '', 'String#hiragana | blank');
  strictlyEqual('カ'.hiragana(), 'か', 'String#hiragana | カ');
  strictlyEqual(''.katakana(), '', 'String#katakana | blank');
  strictlyEqual('か'.katakana(), 'カ', 'String#katakana | か');
  strictlyEqual(''.reverse(), '', 'String#reverse | blank');
  strictlyEqual('wasabi'.reverse(), 'ibasaw', 'String#reverse | wasabi');
  strictlyEqual(''.compact(), '', 'String#compact | blank');
  strictlyEqual('run   tell    dat'.compact(), 'run tell dat', 'String#compact | with extra whitespace');
  strictlyEqual(''.at(3), '', 'String#at | blank');
  strictlyEqual('wasabi'.at(0), 'w', 'String#at | wasabi at pos 0');
  strictlyEqual(''.first(), '', 'String#first | blank');
  strictlyEqual('wasabi'.first(), 'w', 'String#first | no params');
  strictlyEqual(''.last(), '', 'String#last | blank');
  strictlyEqual('wasabi'.last(), 'i', 'String#last | no params');
  strictlyEqual(''.from(0), '', 'String#from | blank');
  strictlyEqual('wasabi'.from(3), 'abi', 'String#from | from pos 3');
  strictlyEqual(''.to(0), '', 'String#to | blank');
  strictlyEqual('wasabi'.to(3), 'was', 'String#to | to pos 3');
  strictlyEqual(''.dasherize(), '', 'String#dasherize | blank');
  strictlyEqualsWithException('noFingWay'.dasherize(), 'no-fing-way', { prototype: false }, 'String#dasherize | noFingWay');
  strictlyEqual(''.underscore(), '', 'String#underscore | blank');
  strictlyEqual('noFingWay'.underscore(), 'no_fing_way', 'String#underscore | noFingWay');
  strictlyEqual(''.camelize(), '', 'String#camelize | blank');
  strictlyEqualsWithException('no-fing-way'.camelize(), 'NoFingWay', { prototype: false }, 'String#camelize | no-fing-way');
  strictlyEqual(''.titleize(), '', 'String#titleize | blank');
  strictlyEqual('chilled monkey brains'.titleize(), 'Chilled Monkey Brains', 'String#titleize | chilled monkey brains');
  strictlyEqual(''.stripTags(), '', 'String#stripTags | blank');
  strictlyEqual('chilled <b>monkey</b> brains'.stripTags(), 'chilled monkey brains', 'String#stripTags | chilled <b>monkey</b> brains');
  strictlyEqual(''.removeTags(), '', 'String#removeTags | blank');
  strictlyEqual('chilled <b>monkey</b> brains'.removeTags(), 'chilled  brains', 'String#removeTags | chilled <b>monkey</b> brains');


  // Thanks to Steven Levitah (http://stevenlevithan.com/demo/split.cfm) for inspiration and information here.


  same('a,b,c,d,e'.split(',') , ['a','b','c','d','e'] , 'Array#split | splits on standard commas');
  same('a|b|c|d|e'.split(',') , ['a|b|c|d|e'] , "Array#split | doesn't split on standard commas");
  same('a|b|c|d|e'.split('|') , ['a','b','c','d','e'] , 'Array#split | splits on pipes');
  same('a,b,c,d,e'.split(/,/) , ['a','b','c','d','e'] , 'Array#split | splits on standard regexp commas');
  same('a|b|c|d|e'.split(/\|/) , ['a','b','c','d','e'] , 'Array#split | splits on standard regexp pipes');
  same('a|b|c|d|e'.split(/[,|]/) , ['a','b','c','d','e'] , 'Array#split | splits on classes');
  same('a|b|c|d|e'.split(/[a-z]/) , ['','|','|','|','|',''] , 'Array#split | splits on classes with ranges');
  same('a|b|c|d|e'.split(/\|*/) , ['a','b','c','d','e'] , 'Array#split | splits on star');
  same('a|b|c|d|e'.split(/\|?/) , ['a','b','c','d','e'] , 'Array#split | splits on optionals');

  same('a,b,c,d,e'.split(',', 2) , ['a','b'] , 'Array#split | handles limits');

  same('a|||b|c|d|e'.split('|') , ['a', '', '', 'b','c','d','e'] , 'Array#split | splits back-to-back separators on a string');
  same('a|||b|c|d|e'.split(/\|/) , ['a', '', '', 'b','c','d','e'] , 'Array#split | splits back-to-back separators on a regexp');

  same('paragraph one\n\nparagraph two\n\n\n'.split(/\n/) , ['paragraph one', '', 'paragraph two','','',''] , 'Array#split | splits on new lines');
  same(''.split() , [''] , 'Array#split | has a single null string for null separators on null strings');
  same(''.split(/./) , [''] , 'Array#split | has a single null string for separators on null strings');

  same(''.split(/.?/) , [] , 'Array#split | has a single null string for optionals on null strings');
  same(''.split(/.??/) , [] , 'Array#split | has a single null string for double optionals on null strings');

  same('a'.split(/./) , ['',''] , 'Array#split | has two entries when splitting on the only character in the string');
  same('a'.split(/-/) , ['a'] , 'Array#split | has one entry when only one character and no match');
  same('a-b'.split(/-/) , ['a', 'b'] , 'Array#split | properly splits hyphens');
  same('a-b'.split(/-?/) , ['a', 'b'] , 'Array#split | properly splits optional hyphens');


  same('a:b:c'.split(/(:)/) , ['a',':','b',':','c'] , 'Array#split | respects capturing groups');


  same('ab'.split(/a*/) , ['', 'b'] , 'Array#split | complex regex splitting | /a*/');
  same('ab'.split(/a*?/) , ['a', 'b'] , 'Array#split | complex regex splitting | /a*?/');
  same('ab'.split(/(?:ab)/) , ['', ''] , 'Array#split | complex regex splitting | /(?:ab)/');
  same('ab'.split(/(?:ab)*/) , ['', ''] , 'Array#split | complex regex splitting | /(?:ab)*/');
  same('ab'.split(/(?:ab)*?/) , ['a', 'b'] , 'Array#split | complex regex splitting | /(?:ab)*?/');
  same('test'.split('') , ['t', 'e', 's', 't'] , 'Array#split | complex regex splitting | empty string');
  same('test'.split() , ['test'] , 'Array#split | complex regex splitting | no argument');
  same('111'.split(1) , ['', '', '', ''] , 'Array#split | complex regex splitting | 1');
  same('test'.split(/(?:)/, 2) , ['t', 'e'] , 'Array#split | complex regex splitting | index is 2');
  same('test'.split(/(?:)/, -1) , ['t', 'e', 's', 't'] , 'Array#split | complex regex splitting | index is -1');
  same('test'.split(/(?:)/, undefined) , ['t', 'e', 's', 't'] , 'Array#split | complex regex splitting | index is undefined');
  same('test'.split(/(?:)/, null) , [] , 'Array#split | complex regex splitting | index is undefined');
  same('test'.split(/(?:)/, NaN) , [] , 'Array#split | complex regex splitting | index is NaN');
  same('test'.split(/(?:)/, true) , ['t'] , 'Array#split | complex regex splitting | index is true');
  same('test'.split(/(?:)/, '2') , ['t', 'e'] , 'Array#split | complex regex splitting | index is "2"');
  same('test'.split(/(?:)/, 'two') , [] , 'Array#split | complex regex splitting | index is two');
  same('a'.split(/-/) , ['a'] , 'Array#split | complex regex splitting | a | /-/');
  same('a'.split(/-?/) , ['a'] , 'Array#split | complex regex splitting | a | /-?/');
  same('a'.split(/-??/) , ['a'] , 'Array#split | complex regex splitting | a | /-??/');
  same('a'.split(/a/) , ['', ''] , 'Array#split | complex regex splitting | a | /a/');
  same('a'.split(/a?/) , ['', ''] , 'Array#split | complex regex splitting | a | /a?/');
  same('a'.split(/a??/) , ['a'] , 'Array#split | complex regex splitting | a | /a??/');
  same('ab'.split(/-/) , ['ab'] , 'Array#split | complex regex splitting | ab | /-/');
  same('ab'.split(/-?/) , ['a', 'b'] , 'Array#split | complex regex splitting | ab | /-?/');
  same('ab'.split(/-??/) , ['a', 'b'] , 'Array#split | complex regex splitting | ab | /-??/');
  same('a-b'.split(/-/) , ['a', 'b'] , 'Array#split | complex regex splitting | a-b | /-/');
  same('a-b'.split(/-?/) , ['a', 'b'] , 'Array#split | complex regex splitting | a-b | /-?/');
  same('a-b'.split(/-??/) , ['a', '-', 'b'] , 'Array#split | complex regex splitting | a-b | /-??/');
  same('a--b'.split(/-/) , ['a', '', 'b'] , 'Array#split | complex regex splitting | a--b | /-/');
  same('a--b'.split(/-?/) , ['a', '', 'b'] , 'Array#split | complex regex splitting | a--b | /-?/');
  same('a--b'.split(/-??/) , ['a', '-', '-', 'b'] , 'Array#split | complex regex splitting | a--b | /-??/');
  same(''.split(/()()/) , [] , 'Array#split | complex regex splitting | empty string | /()()/');
  same('.'.split(/()()/) , ['.'] , 'Array#split | complex regex splitting | . | /()()/');
  same('.'.split(/(.?)(.?)/) , ['', '.', '', ''] , 'Array#split | complex regex splitting | . | /(.?)(.?)/');
  same('.'.split(/(.??)(.??)/) , ['.'] , 'Array#split | complex regex splitting | . | /(.??)(.??)/');
  same('.'.split(/(.)?(.)?/) , ['', '.', undefined, ''] , 'Array#split | complex regex splitting | . | /(.)?(.)?/');
  same('tesst'.split(/(s)*/) , ['t', undefined, 'e', 's', 't'] , 'Array#split | complex regex splitting | tesst | /(s)*/');
  same('tesst'.split(/(s)*?/) , ['t', undefined, 'e', undefined, 's', undefined, 's', undefined, 't'] , 'Array#split | complex regex splitting | tesst | /(s)*?/');
  same('tesst'.split(/(s*)/) , ['t', '', 'e', 'ss', 't'] , 'Array#split | complex regex splitting | tesst | /(s*)/');
  same('tesst'.split(/(s*?)/) , ['t', '', 'e', '', 's', '', 's', '', 't'] , 'Array#split | complex regex splitting | tesst | /(s*?)/');
  same('tesst'.split(/(?:s)*/) , ['t', 'e', 't'] , 'Array#split | complex regex splitting | tesst | /(?:s)*/');
  same('tesst'.split(/(?=s+)/) , ['te', 's', 'st'] , 'Array#split | complex regex splitting | tesst | /(?=s+)/');
  same('test'.split('t') , ['', 'es', ''] , 'Array#split | complex regex splitting | test | t');
  same('test'.split('es') , ['t', 't'] , 'Array#split | complex regex splitting | test | es');
  same('test'.split(/t/) , ['', 'es', ''] , 'Array#split | complex regex splitting | test | /t/');
  same('test'.split(/es/) , ['t', 't'] , 'Array#split | complex regex splitting | test | /es/');
  same('test'.split(/(t)/) , ['', 't', 'es', 't', ''] , 'Array#split | complex regex splitting | test | /(t)/');
  same('test'.split(/(es)/) , ['t', 'es', 't'] , 'Array#split | complex regex splitting | test | /(es)/');
  same('test'.split(/(t)(e)(s)(t)/) , ['', 't', 'e', 's', 't', ''] , 'Array#split | complex regex splitting | test | /(t)(e)(s)(t)/');
  same('.'.split(/(((.((.??)))))/) , ['', '.', '.', '.', '', '', ''] , 'Array#split | complex regex splitting | . | /(((.((.??)))))/');
  same('.'.split(/(((((.??)))))/) , ['.'] , 'Array#split | complex regex splitting | . | /(((((.??)))))/');

  /*
   * Patching the String#match method broke Prototype in IE in a very specific way:
   *
   *  var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
   *    .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
   *    .replace(/\s+/g, '').split(',');
   *
   * Very unlikely that this would cause problems but after much debate I've decided not to
   * patch the method, as it's simply too far-reaching with too few benefits, and too few unit tests
   * to justify it. Will reconsider if the demand arises.
   *
  var match = 'on'.match(/on(e)?/);
  equals(match[1], undefined, 'String#match | capturing group should be undefined');

  var match = 'on'.match(/\b/g);
  equals(match[0], '', 'String#match | first match should be empty string');
  equals(match[1], '', 'String#match | second match should be empty string');
  */


});


test('Array', function () {

  fixPrototypeIterators();

  var arr;
  var count;


  equals(['a','b','c'].indexOf('b'), 1, 'Array#indexOf | b in a,b,c');
  equals(['a','b','c'].indexOf('b', 0), 1, 'Array#indexOf | b in a,b,c from 0');
  equals(['a','b','c'].indexOf('a'), 0, 'Array#indexOf | a in a,b,c');
  equals(['a','b','c'].indexOf('f'), -1, 'Array#indexOf | f in a,b,c');

  equals(['a','b','c','b'].indexOf('b'), 1, 'Array#indexOf | finds first instance');
  equals(['a','b','c','b'].indexOf('b', 2), 3, 'Array#indexOf | finds first instance from index');

  equals([5,2,4].indexOf(5), 0, 'Array#indexOf | 5 in 5,2,4');
  equals([5,2,4].indexOf(2), 1, 'Array#indexOf | 2 in 5,2,4');
  equals([5,2,4].indexOf(4), 2, 'Array#indexOf | 4 in 5,2,4');
  equals([5,2,4,4].indexOf(4, 3), 3, 'Array#indexOf | 4 in 5,2,4,4 from index 3');

  equals([5,2,4,4].indexOf(4, 10), -1, 'Array#indexOf | 4 in 5,2,4,4 from index 10');
  equals([5,2,4,4].indexOf(4, -10), 2, 'Array#indexOf | 4 in 5,2,4,4 from index -10');
  equals([5,2,4,4].indexOf(4, -1), 3, 'Array#indexOf | 4 in 5,2,4,4 from index -1');

  equals([{ foo: 'bar' }].indexOf({ foo: 'bar' }), 0, 'Array#indexOf | handles objects');
  equals([{ foo: 'bar' }].indexOf(function(a){ return a.foo === 'bar'; }), 0, 'Array#indexOf | handles functions');

  equals(['a','b','c','d','a','b'].lastIndexOf('b'), 5, 'Array#lastIndexOf | b');
  equals(['a','b','c','d','a','b'].lastIndexOf('b', 4), 1, 'Array#lastIndexOf | b from index 4');
  equals(['a','b','c','d','a','b'].lastIndexOf('z'), -1, 'Array#lastIndexOf | z');

  equals([1,5,6,8,8,2,5,3].lastIndexOf(3), 7, 'Array#lastIndexOf | 1,5,6,8,8,2,5,3 | 3');
  equals([1,5,6,8,8,2,5,3].lastIndexOf(3, 0), -1, 'Array#lastIndexOf | 1,5,6,8,8,2,5,3 | 3 from index 0');
  equals([1,5,6,8,8,2,5,3].lastIndexOf(8), 4, 'Array#lastIndexOf | 1,5,6,8,8,2,5,3 | 8');
  equals([1,5,6,8,8,2,5,3].lastIndexOf(8, 3), 3, 'Array#lastIndexOf | 1,5,6,8,8,2,5,3 | 8 from index 3');
  equals([1,5,6,8,8,2,5,3].lastIndexOf(1), 0, 'Array#lastIndexOf | 1,5,6,8,8,2,5,3 | 1');
  equals([1,5,6,8,8,2,5,3].lastIndexOf(42), -1, 'Array#lastIndexOf | 1,5,6,8,8,2,5,3 | 42');

  equals([2,5,9,2].lastIndexOf(2), 3, 'Array#lastIndexOf | 2,5,9,2 | 2');
  equals([2,5,9,2].lastIndexOf(7), -1, 'Array#lastIndexOf | 2,5,9,2 | 7');
  equals([2,5,9,2].lastIndexOf(2, 3), 3, 'Array#lastIndexOf | 2,5,9,2 | 2 from index 3');
  equals([2,5,9,2].lastIndexOf(2, 2), 0, 'Array#lastIndexOf | 2,5,9,2 | 2 from index 2');
  equals([2,5,9,2].lastIndexOf(2, -2), 0, 'Array#lastIndexOf | 2,5,9,2 | 2 from index -2');
  equals([2,5,9,2].lastIndexOf(2, -1), 3, 'Array#lastIndexOf | 2,5,9,2 | 2 from index -1');
  equals([2,5,9,2].lastIndexOf(2, -10), -1, 'Array#lastIndexOf | 2,5,9,2 | 2 from index -10');

  // Prototype's "lastIndexOf" apparently doesn't pass this particular test.
  //equalsWithException([2,5,9,2].lastIndexOf(2, 10), 3, { prototype: (jQuery.browser.msie ? 10 : 3) }, 'Array#lastIndexOf | 2,5,9,2 | 2 from index 10');

  equals([{ foo: 'bar' }].lastIndexOf({ foo: 'bar' }), 0, 'Array#lastIndexOf | handles objects');
  equals([{ foo: 'bar' }].lastIndexOf(function(a){ return a.foo === 'bar'; }), 0, 'Array#lastIndexOf | handles functions');



  equals([12,5,8,130,44].every(function(el, i, a){ return el >= 10; }), false, 'Array#every | not every element is greater than 10');
  equals([12,54,18,130,44].every(function(el, i, a){ return el >= 10; }), true, 'Array#every | every element is greater than 10');
  ['a'].every(function(el, i, a){
    equals(el, 'a', 'Array#every | First parameter is the element');
    equals(i, 0, 'Array#every | Second parameter is the index');
    sameWithException(a, ['a'], { prototype: undefined }, 'Array#every | Third parameter is the array');
    equals(this, 'this', 'Array#every | Scope is passed properly');
  }, 'this');


  testWithErrorHandling(function(){
    same([{name:'john',age:25}].all({name:'john',age:25}), true, 'Array#all | handles complex objects');
    same([{name:'john',age:25},{name:'fred',age:85}].all('age'), false, 'Array#all | simple string mistakenly passed for complex objects');
    same([{name:'john',age:25},{name:'fred',age:85}].all({name:'john',age:25}), false, "Array#all | john isn't all");
  }, ['prototype']);



  equals([12,5,8,130,44].some(function(el, i, a){ return el > 10 }), true, 'Array#some | some elements are greater than 10');
  equals([12,5,8,130,44].some(function(el, i, a){ return el < 10 }), true, 'Array#some | some elements are less than 10');
  equals([12,54,18,130,44].some(function(el, i, a){ return el >= 10 }), true, 'Array#some | all elements are greater than 10');
  equals([12,5,8,130,44].some(function(el, i, a){ return el < 4 }), false, 'Array#some | no elements are less than 4');
  equals([].some(function(el, i, a){ return el > 10 }), false, 'Array#some | no elements are greater than 10 in an empty array');
  ['a'].some(function(el, i, a){
    equals(el, 'a', 'Array#some | first parameter is the element');
    equals(i, 0, 'Array#some | second parameter is the index');
    sameWithException(a, ['a'], { prototype: undefined }, 'Array#some | third parameter is the array');
    equals(this, 'this', 'Array#some | scope is passed properly');
  }, 'this');

  same([{name:'john',age:25}].some({name:'john',age:25}), true, 'Array#every | handles complex objects');
  same([{name:'john',age:25},{name:'fred',age:85}].some('age'), false, 'Array#some | simple string mistakenly passed for complex objects');
  same([{name:'john',age:25},{name:'fred',age:85}].some({name:'john',age:25}), true, 'Array#some | john can be found ');




  same([12,4,8,130,44].filter(function(el, i, a){ return el > 10 }), [12,130,44], 'Array#filter | numbers above 10');
  same([12,4,8,130,44].filter(function(el, i, a){ return el < 10 }), [4,8], 'Array#filter | numbers below 10');
  ['a'].filter(function(el, i, a){
    equals(el, 'a', 'Array#filter | first parameter is the element');
    equals(i, 0, 'Array#filter | second parameter is the index');
    sameWithException(a, ['a'], { prototype: undefined }, 'Array#filter | third parameter is the array');
    equals(this, 'this', 'Array#filter | scope is passed properly');
  }, 'this');


  same([{name:'john',age:25},{name:'fred',age:85}].filter('age'), [], 'Array#filter | simple string mistakenly passed for complex objects');
  same([{name:'john',age:25},{name:'fred',age:85}].filter({name:'john',age:25}), [{name:'john',age:25}], 'Array#filter | filtering john');
  same([{name:'john',age:25},{name:'fred',age:85}].filter({name:'fred',age:85}), [{name:'fred',age:85}], 'Array#filter | filtering fred');




  arr = [2, 5, 9];
  arr.forEach(function(el, i, a){
    equals(el, a[i], 'Array#forEach | looping successfully');
  });

  arr = ['a', [1], { foo: 'bar' }, 352];
  count = 0;
  arr.forEach(function(el, i, a){
      count++;
  });
  equals(count, 4, 'Array#forEach | complex array | should have looped 4 times');

  ['a'].forEach(function(el, i, a){
    equals(el, 'a', 'Array#forEach | first parameter is the element');
    equals(i, 0, 'Array#forEach | second parameter is the index');
    equals(this, 'this', 'Array#forEach | scope is passed properly');
  }, 'this');




  arr = [2, 5, 9];
  arr.each(function(el, i, a){
    equals(el, arr[i], 'Array#each | looping successfully');
  });

  arr = ['a', [1], { foo: 'bar' }, 352];
  count = 0;
  arr.each(function(el, i, a){
      count++;
  });
  equals(count, 4, 'Array#each | complex array | should have looped 4 times');

  ['a'].each(function(el, i, a){
    equals(el, 'a', 'Array#each | first parameter is the element');
    equals(i, 0, 'Array#each | second parameter is the index');
    sameWithException(a, ['a'], { prototype: undefined }, 'Array#each | third parameter is the array');
    equals(this, 'this', 'Array#each | scope is passed properly');
  }, 'this');




  same(['foot','goose','moose'].map(function(el){ return el.replace(/o/g, 'e'); }), ['feet', 'geese', 'meese'], 'Array#map | with regexp');
  // cool!
  same([1,4,9].map(Math.sqrt), [1,2,3], 'Array#map | passing Math.sqrt directly');
  same([{ foo: 'bar' }].map(function(el){ return el['foo']; }), ['bar'], 'Array#map | with key "foo"');

  ['a'].map(function(el, i, a){
    equals(el, 'a', 'Array#map | first parameter is the element');
    equals(i, 0, 'Array#map | second parameter is the index');
    sameWithException(a, ['a'], { prototype: undefined }, 'Array#map | third parameter is the array');
    equals(this, 'this', 'Array#map | scope is passed properly');
  }, 'this');


  same(['foot','goose','moose'].map('length'), [4,5,5], 'Array#map | length');
  same([1,2,3].map(2), [undefined,undefined,undefined], 'Array#map | can handle non-string arguments');
  same([{name:'john',age:25},{name:'fred',age:85}].map('age'), [25,85], 'Array#map | age');
  same([{name:'john',age:25},{name:'fred',age:85}].map('name'), ['john','fred'], 'Array#map | name');
  same([{name:'john',age:25},{name:'fred',age:85}].map('cupsize'), [undefined, undefined], 'Array#map | (nonexistent) cupsize');
  same([].map('name'), [], 'Array#map');

  same([1,2,3].map('toString'), ['1','2','3'], 'Array#map | calls a function on a shortcut string');


  same(['foot','goose','moose'].collect(function(el){ return el.replace(/o/g, 'e'); }), ['feet', 'geese', 'meese'], 'Array#collect | with regexp');
  same([1,4,9].collect(Math.sqrt), [1,2,3], 'Array#collect | passing Math.sqrt directly');
  same([{ foo: 'bar' }].collect(function(el){ return el['foo']; }), ['bar'], 'Array#collect | with key "foo"');

  ['a'].collect(function(el, i, a){
    sameWithException(a, ['a'], { prototype: undefined }, 'Array#collect | third paramteter is the array');
    equals(el, 'a', 'Array#collect | first paramteter is the element');
    equals(i, 0, 'Array#collect | second paramteter is the index');
    equals(this, 'this', 'Array#collect | scope is passed properly');
  }, 'this');




  equals([0,1,2,3,4].reduce(function(a,b){ return a + b; }), 10, 'Array#reduce | a + b');
  same([[0,1],[2,3],[4,5]].reduce(function(a,b){ return a.concat(b); }, []), [0,1,2,3,4,5], 'Array#reduce | concat');
  ['a'].reduce(function(p, c, i, a){
    equals(p, 'c', 'Array#reduce | a | first parameter is the lhs');
    equals(c, 'a', 'Array#reduce | a | second parameter is the rhs');
    equals(i, 0, 'Array#reduce | a | third parameter is the index');
    same(a, ['a'], 'Array#reduce | a | fourth parameter is the array');
  }, 'c');
  [55,66].reduce(function(p, c, i, a){
    equals(p, 55, 'Array#reduce | 55,66 | first parameter is the lhs');
    equals(c, 66, 'Array#reduce | 55,66 | second parameter is the rhs');
    equals(i, 1, 'Array#reduce | 55,66 | third parameter is the index');
    same(a, [55,66], 'Array#reduce | 55,66 | fourth parameter is the array');
  });
  [1].reduce(function(p, c, i, a){
    // This assertion should never be called.
    equals(true, false, 'Array#reduce | one element array with no rhs passed in does not iterate');
  });
  equals([1].reduce(function(){}), 1, 'Array#reduce | [1] reduces to 1');


  equals([0,1,2,3,4].reduceRight(function(a,b){ return a + b; }), 10, 'Array#reduceRight | a + b');
  same([[0,1],[2,3],[4,5]].reduceRight(function(a,b){ return a.concat(b); }, []), [4,5,2,3,0,1], 'Array#reduceRight | concat');
  ['a'].reduceRight(function(p, c, i, a){
    equals(p, 'c', 'Array#reduceRight | a | first parameter is the lhs');
    equals(c, 'a', 'Array#reduceRight | a | second parameter is the rhs');
    equals(i, 0, 'Array#reduceRight | a | third parameter is the index');
    same(a, ['a'], 'Array#reduceRight | a | fourth parameter is the array');
  }, 'c');
  [55,66].reduceRight(function(p, c, i, a){
    equals(p, 66, 'Array#reduceRight | 55,66 | first parameter is the lhs');
    equals(c, 55, 'Array#reduceRight | 55,66 | second parameter is the rhs');
    equals(i, 0, 'Array#reduceRight | 55,66 | third parameter is the index');
    same(a, [55,66], 'Array#reduceRight | 55,66 | fourth parameter is the array');
  });
  [1].reduceRight(function(p, c, i, a){
    // This assertion should never be called.
    equals(true, false, 'Array#reduceRight | one element array with no rhs passed in does not iterate');
  });
  equals([1].reduceRight(function(){}), 1, 'Array#reduceRight | [1] reduces to 1');


  var result = [];
  var indices = [1,2];
  var count = 0;
  ['a','b','c'].eachFromIndex(1, function(s, i){
    result.push(s);
    equals(i, indices[count], 'Array#eachFromIndex | index should be correct')
    count++;
  });

  equals(count, 2, 'Array#eachFromIndex | should have run 2 times')
  same(result, ['b','c'], 'Array#eachFromIndex | result');


  result = [];
  indices = [1,2,0];
  count = 0;
  ['a','b','c'].eachFromIndex(1, function(s, i){
    result.push(s);
    equals(i, indices[count], 'Array#eachFromIndex | looping from index 1 | index should be correct')
    count++;
  }, true);

  equals(count, 3, 'Array#eachFromIndex | looping from index 1 | should have run 3 times')
  same(result, ['b','c','a'], 'Array#eachFromIndex | looping from index 1 | result');


  result = [];
  indices = [0,1,2];
  count = 0;
  ['a','b','c'].eachFromIndex(0, function(s, i){
    result.push(s);
    equals(i, indices[count], 'Array#eachFromIndex | looping from index 0 | index should be correct')
    count++;
  }, true);

  equals(count, 3, 'Array#eachFromIndex | looping from index 0 | should have run 3 times')
  same(result, ['a','b','c'], 'Array#eachFromIndex | looping from index 0 | result');



  result = [];
  indices = [2,0,1];
  count = 0;
  ['a','b','c'].eachFromIndex(2, function(s, i){
    result.push(s);
    equals(i, indices[count], 'Array#eachFromIndex | looping from index 2 | index should be correct')
    count++;
  }, true);

  equals(count, 3, 'Array#eachFromIndex | looping from index 2 | should have run 3 times')
  same(result, ['c','a','b'], 'Array#eachFromIndex | looping from index 2 | result');



  result = [];
  count = 0;
  ['a','b','c'].eachFromIndex(3, function(s, i){
    result.push(s);
    count++;
  }, true);

  equals(count, 3, 'Array#eachFromIndex | looping from index 3 | should have run 3 times')
  same(result, ['a','b','c'], 'Array#eachFromIndex | looping from index 3 | result');



  result = [];
  count = 0;
  ['a','b','c'].eachFromIndex(4, function(s, i){
    result.push(s);
    count++;
  }, true);

  equals(count, 3, 'Array#eachFromIndex | looping from index 4 | should have run 3 times')
  same(result, ['b','c','a'], 'Array#eachFromIndex | looping from index 4 | result');



  result = [];
  count = 0;
  ['a','b','c'].eachFromIndex(49, function(s, i){
    result.push(s);
    count++;
  }, true);

  equals(count, 3, 'Array#eachFromIndex | looping from index 49 | should have run 3 times')
  same(result, ['b','c','a'], 'Array#eachFromIndex | looping from index 49 | result');



  ['a','b','c'].eachFromIndex(function(){
    equals(false, true, 'Array#eachFromIndex | this test should never be run');
  });



  same(['a','b','c'].find('a'), 'a', 'Array#find | a');
  same(['a','a','c'].find('a'), 'a', 'Array#find | first a');
  same(['a','b','c'].find('q'), undefined, 'Array#find | q');
  same([1,2,3].find(1), 1, 'Array#find | 1');
  same([2,2,3].find(2), 2, 'Array#find | 2');
  same([1,2,3].find(4), undefined, 'Array#find | 4');
  sameWithException([{a:1},{b:2},{c:3}].find({a:1}), {a:1}, { prototype: undefined }, 'Array#find | a:1');
  sameWithException([{a:1},{a:1},{c:3}].find({a:1}), {a:1}, { prototype: undefined }, 'Array#find | first a:1');
  same([{a:1},{b:2},{c:3}].find({d:4}), undefined, 'Array#find | d:4');
  same([{a:1},{b:2},{c:3}].find({c:4}), undefined, 'Array#find | c:4');
  sameWithException([[1,2],[2,3],[4,5]].find([2,3]), [2,3], { prototype: undefined }, 'Array#find | 2,3');
  same([[1,2],[2,3],[4,5]].find([2,4]), undefined, 'Array#find | 2,4');
  sameWithException([[1,2],[2,3],[2,3]].find([2,3]), [2,3], { prototype: undefined }, 'Array#find | first 2,3');
  sameWithException(['foo','bar'].find(/f+/), 'foo', { prototype: undefined }, 'Array#find | /f+/');
  sameWithException(['foo','bar'].find(/[a-f]/), 'foo', { prototype: undefined }, 'Array#find | /a-f/');
  sameWithException(['foo','bar'].find(/[a-f]/, 1), 'bar', { prototype: undefined }, 'Array#find | /a-f/ from index 1');
  sameWithException(['foo','bar'].find(/q+/), undefined, 'Array#find | /q+/');
  same([1,2,3].find(function(e){ return e > 0; }, 0), 1, 'Array#find | greater than 0 from index 0');
  sameWithException([1,2,3].find(function(e){ return e > 0; }, 1), 2, { prototype: 1 }, 'Array#find | greater than 0 from index 1');
  sameWithException([1,2,3].find(function(e){ return e > 0; }, 2), 3, { prototype: 1 }, 'Array#find | greater than 0 from index 2');
  sameWithException([1,2,3].find(function(e){ return e > 0; }, 3), undefined, { prototype: 1 }, 'Array#find | greater than 0 from index 3');
  same([1,2,3].find(function(e){ return e > 1; }, 0), 2, 'Array#find | greater than 1 from index 0');
  same([1,2,3].find(function(e){ return e > 1; }, 1), 2, 'Array#find | greater than 1 from index 1');
  sameWithException([1,2,3].find(function(e){ return e > 1; }, 2), 3, { prototype: 2 }, 'Array#find | greater than 1 from index 2');
  same([1,2,3].find(function(e){ return e > 2; }, 0), 3, 'Array#find | greater than 2 from index 0');
  same([1,2,3].find(function(e){ return e > 3; }, 0), undefined, 'Array#find | greater than 3 from index 0');

  same([{a:10},{a:8},{a:3}].find(function(e){ return e['a'] > 5; }, 0), {a:10}, 'Array#find | key "a" greater than 5');
  sameWithException([{a:10},{a:8},{a:3}].find(function(e){ return e['a'] > 5; }, 1), {a:8}, { prototype: {a:10} }, 'Array#find | key "a" greater than 5 from index 1');
  sameWithException([{a:10},{a:8},{a:3}].find(function(e){ return e['a'] > 5; }, 2), undefined, { prototype: {a:10} }, 'Array#find | key "a" greater than 5 from index 2');
  same([function(){}].find(function(e){}, 0), undefined, 'Array#find | undefined function');
  same([function(){}].find(function(e){}, 1), undefined, 'Array#find | null function from index 1');
  same([null, null].find(null, 0), null, 'Array#find | null');
  same([null, null].find(null, 1), null, 'Array#find | null from index 1');
  same([undefined, undefined].find(undefined, 0), undefined, 'Array#find | undefined');
  same([undefined, undefined].find(undefined, 1), undefined, 'Array#find | undefined from index 1');
  sameWithException([undefined, 'a'].find(undefined, 1), 'a', { prototype: undefined }, 'Array#find | undefined finds the first element');



  same(['a','b','c'].findAll('a'), ['a'], 'Array#findAll | a');
  same(['a','a','c'].findAll('a'), ['a','a'], 'Array#findAll | a,a');
  same(['a','b','c'].findAll('q'), [], 'Array#findAll | q');
  same([1,2,3].findAll(1), [1], 'Array#findAll | 1');
  same([2,2,3].findAll(2), [2,2], 'Array#findAll | 2,2');
  same([1,2,3].findAll(4), [], 'Array#findAll | 4');
  sameWithException([{a:1},{b:2},{c:3}].findAll({a:1}), [{a:1}], { prototype: [] }, 'Array#findAll | a:1');
  sameWithException([{a:1},{a:1},{c:3}].findAll({a:1}), [{a:1},{a:1}], { prototype: [] }, 'Array#findAll | a:1,a:1');
  same([{a:1},{b:2},{c:3}].findAll({d:4}), [], 'Array#findAll | d:4');
  same([{a:1},{b:2},{c:3}].findAll({c:4}), [], 'Array#findAll | c:4');
  sameWithException([[1,2],[2,3],[4,5]].findAll([2,3]), [[2,3]], { prototype: [] }, 'Array#findAll | 2,3');
  same([[1,2],[2,3],[4,5]].findAll([2,4]), [], 'Array#findAll | 2,4');
  sameWithException([[1,2],[2,3],[2,3]].findAll([2,3]), [[2,3],[2,3]], { prototype: [] }, 'Array#findAll | [2,3],[2,3]');
  sameWithException(['foo','bar'].findAll(/f+/), ['foo'], { prototype: [] }, 'Array#findAll | /f+/');
  sameWithException(['foo','bar'].findAll(/[a-f]/), ['foo','bar'], { prototype: [] }, 'Array#findAll | /[a-f]/');
  sameWithException(['foo','bar'].findAll(/[a-f]/, 1), ['bar'], { prototype: [] }, 'Array#findAll | /[a-f]/ from index 1');
  sameWithException(['foo','bar'].findAll(/[a-f]/, 1, true), ['bar','foo'], { prototype: [] }, 'Array#findAll | /[a-f]/ from index 1');
  same(['foo','bar'].findAll( /q+/), [], 'Array#findAll | /q+/');
  same([1,2,3].findAll(function(e){ return e > 0; }, 0), [1,2,3], 'Array#findAll | greater than 0 from index 0');
  sameWithException([1,2,3].findAll(function(e){ return e > 0; }, 1), [2,3], { prototype: [1,2,3] }, 'Array#findAll | greater than 0 from index 1');
  sameWithException([1,2,3].findAll(function(e){ return e > 0; }, 2), [3], { prototype: [1,2,3] }, 'Array#findAll | greater than 0 from index 2');
  sameWithException([1,2,3].findAll(function(e){ return e > 0; }, 3), [], { prototype: [1,2,3] }, 'Array#findAll | greater than 0 from index 3');
  sameWithException([1,2,3].findAll(function(e){ return e > 0; }, 4), [], { prototype: [1,2,3] }, 'Array#findAll | greater than 0 from index 4');
  same([1,2,3].findAll(function(e){ return e > 1; }, 0), [2,3], 'Array#findAll | greater than 1 from index 0');
  same([1,2,3].findAll(function(e){ return e > 1; }, 1), [2,3], 'Array#findAll | greater than 1 from index 1');
  sameWithException([1,2,3].findAll(function(e){ return e > 1; }, 2), [3], { prototype: [2,3] }, 'Array#findAll | greater than 1 from index 2');
  same([1,2,3].findAll(function(e){ return e > 2; }, 0), [3], 'Array#findAll | greater than 2 from index 0');
  same([1,2,3].findAll(function(e){ return e > 3; }, 0), [], 'Array#findAll | greater than 3 from index 0');

  same([1,2,3].findAll(function(e){ return e > 0; }, 0, true), [1,2,3], 'Array#findAll | looping | greater than 0 from index 0');
  sameWithException([1,2,3].findAll(function(e){ return e > 0; }, 1, true), [2,3,1], { prototype: [1,2,3] }, 'Array#findAll | looping | greater than 0 from index 1');
  sameWithException([1,2,3].findAll(function(e){ return e > 0; }, 2, true), [3,1,2], { prototype: [1,2,3] }, 'Array#findAll | looping | greater than 0 from index 2');
  sameWithException([1,2,3].findAll(function(e){ return e > 0; }, 3, true), [1,2,3], { prototype: [1,2,3] }, 'Array#findAll | looping | greater than 0 from index 3');
  same([1,2,3].findAll(function(e){ return e > 1; }, 0, true), [2,3], 'Array#findAll | looping | greater than 1 from index 0');
  sameWithException([1,2,3].findAll(function(e){ return e > 1; }, 1, true), [2,3], { prototype: [2,3] }, 'Array#findAll | looping | greater than 1 from index 1');
  sameWithException([1,2,3].findAll(function(e){ return e > 1; }, 2, true), [3,2], { prototype: [2,3] }, 'Array#findAll | looping | greater than 1 from index 2');
  same([1,2,3].findAll(function(e){ return e > 2; }, 0, true), [3], 'Array#findAll | looping | greater than 2 from index 0');
  same([1,2,3].findAll(function(e){ return e > 3; }, 0, true), [], 'Array#findAll | looping | greater than 3 from index 0');

  same([{a:10},{a:8},{a:3}].findAll(function(e){ return e['a'] > 5; }, 0), [{a:10},{a:8}], 'Array#findAll | key "a" is greater than 5');
  sameWithException([{a:10},{a:8},{a:3}].findAll(function(e){ return e['a'] > 5; }, 1), [{a:8}], { prototype: [{a:10},{a:8}] }, 'Array#findAll | key "a" is greater than 5 from index 1');
  sameWithException([{a:10},{a:8},{a:3}].findAll(function(e){ return e['a'] > 5; }, 2), [], { prototype: [{a:10},{a:8}] }, 'Array#findAll | key "a" is greater than 5 from index 2');

  same([{a:10},{a:8},{a:3}].findAll(function(e){ return e['a'] > 5; }, 0, true), [{a:10},{a:8}], 'Array#findAll | looping | key "a" is greater than 5');
  sameWithException([{a:10},{a:8},{a:3}].findAll(function(e){ return e['a'] > 5; }, 1, true), [{a:8},{a:10}], { prototype: [{a:10},{a:8}] }, 'Array#findAll | looping | key "a" is greater than 5 from index 1');
  sameWithException([{a:10},{a:8},{a:3}].findAll(function(e){ return e['a'] > 5; }, 2, true), [{a:10},{a:8}], { prototype: [{a:10},{a:8}] }, 'Array#findAll | looping | key "a" is greater than 5 from index 2');

  same([function(){}].findAll(function(e){}, 0), [], 'Array#findAll | null function');
  same([function(){}].findAll(function(e){}, 1), [], 'Array#findAll | null function from index 1');
  same([null, null].findAll(null, 0), [null, null], 'Array#findAll | null');
  sameWithException([null, null].findAll(null, 1), [null], { prototype: [null,null] }, 'Array#findAll | null from index 1');

  same([function(){}].findAll(function(e){}, 0, true), [], 'Array#findAll | looping | null function');
  same([function(){}].findAll(function(e){}, 1, true), [], 'Array#findAll | looping | null function from index 1');
  same([null, null].findAll(null, 0, true), [null, null], 'Array#findAll | looping | null');
  same([null, null].findAll(null, 1, true), [null, null], 'Array#findAll | looping | null from index 1');




  // Example: finding last from an index. (reverse order). This means we don't need a findAllFromLastIndex
  arr = [{name:'john',age:10,food:'sushi'},{name:'randy',age:23,food:'natto'},{name:'karen',age:32,food:'salad'}];
  arr = [1,2,3,4,5,6,7,8,9];
  sameWithException(arr.findAll(function(n){ return n % 3 == 0; }, 4), [6,9], { prototype: [3,6,9] }, 'Array#findAll | n % 3 from index 4');
  sameWithException(arr.reverse().findAll(function(n){ return n % 3 == 0; }, 4), [3], { prototype: [9,6,3] }, 'Array#findAll | reversed | n % 3 from index 4 reversed');

  arr.reverse(); // Array#reverse is destructive, dammit!
  sameWithException(arr.findAll(function(n){ return n % 3 == 0; }, 4, true), [6,9,3], { prototype: [3,6,9] }, 'Array#findAll | looping | n % 3 from index 4');
  sameWithException(arr.reverse().findAll(function(n){ return n % 3 == 0; }, 4, true), [3,9,6], { prototype: [9,6,3] }, 'Array#findAll | looping | reversed | n % 3 from index 4 reversed');


  same([1,1,3].unique(), [1,3], 'Array#unique | 1,1,3');
  same([0,0,0].unique(), [0], 'Array#unique | 0,0,0');
  same(['a','b','c'].unique(), ['a','b','c'], 'Array#unique | a,b,c');
  same(['a','a','c'].unique(), ['a','c'], 'Array#unique | a,a,c');
  same([{foo:'bar'}, {foo:'bar'}].unique(), [{foo:'bar'}], 'Array#unique | objects uniqued as well');




  same([1,2,3].union([3,4,5]), [1,2,3,4,5], 'Array#union | 1,2,3 + 3,4,5');
  same([1,1,1].union([1,2,3]), [1,2,3], 'Array#union | 1,1,1 + 1,2,3');
  same([0,0,0].union([1,2,3]), [0,1,2,3], 'Array#union | 0,0,0 + 1,2,3');
  same([0,0,0].union([0,0,0]), [0], 'Array#union | 0,0,0 + 0,0,0');
  same([].union([]), [], 'Array#union | 2 empty arrays');
  same([-1,-2,-3].union([-2,-4,-5]), [-1,-2,-3,-4,-5], 'Array#union | -1,-2,-3 + -2,-4,-5');
  same([-1,-2,-3].union([3,4,5]), [-1,-2,-3,3,4,5], 'Array#union | -1,-2,-3 + 3,4,5');
  same([{a:1},{b:2}].union([{b:2},{c:3}]), [{a:1},{b:2},{c:3}], 'Array#intersect | a:1,b:2 + b:2,c:3');
  same([1,2,3].union(4), [1,2,3,4], 'Array#union | 1,2,3 + 4');


  same([1,2,3].intersect([3,4,5]), [3], 'Array#intersect | 1,2,3 + 3,4,5');
  same(['a','b','c'].intersect(['c','d','e']), ['c'], 'Array#intersect | a,b,c + c,d,e');
  same([1,2,3].intersect([1,2,3]), [1,2,3], 'Array#intersect | 1,2,3 + 1,2,3');
  same([1,2,3].intersect([3,2,1]), [1,2,3], 'Array#intersect | 1,2,3 + 3,2,1');
  same([].intersect([3]), [], 'Array#intersect | empty array + 3');
  same([3].intersect([]), [], 'Array#intersect | 3 + empty array');
  same([].intersect([]), [], 'Array#intersect | 2 empty arrays');
  same([null].intersect([]), [], 'Array#intersect | [null] + empty array');
  sameWithException([null].intersect([null]), [null], { prototype: [] }, 'Array#intersect | [null] + [null]');
  sameWithException([false].intersect([false]), [false], { prototype: [] }, 'Array#intersect | [false] + [false]');
  same([false].intersect([0]), [], 'Array#intersect | [false] + [0]');
  same([false].intersect([null]), [], 'Array#intersect | [false] + [null]');
  same([false].intersect([undefined]), [], 'Array#intersect | [false] + [undefined]');
  sameWithException([{a:1},{b:2}].intersect([{b:2},{c:3}]), [{b:2}], { prototype: [] }, 'Array#intersect | a:1,b:2 + b:2,c:3');
  same([1,1,3].intersect([1,5,6]), [1], 'Array#intersect | 1,1,3 + 1,5,6');
  same([1,2,3].intersect([4,5,6]), [], 'Array#intersect | 1,1,3 + 4,5,6');
  testWithErrorHandling(function(){
    same([1,2,3].intersect(1), [1], 'Array#intersect | 1,2,3 + 1');
  }, ['prototype']);




  same([1,2,3].subtract([3,4,5]), [1,2], 'Array#subtract | 1,2,3 + 3,4,5');
  same([1,1,2,2,3,3,4,4,5,5].subtract([2,3,4]), [1,1,5,5], 'Array#subtract | 1,1,2,2,3,3,4,4,5,5 + 2,3,4');
  same(['a','b','c'].subtract(['c','d','e']), ['a','b'], 'Array#subtract | a,b,c + c,d,e');
  same([1,2,3].subtract([1,2,3]), [], 'Array#subtract | 1,2,3 + 1,2,3');
  same([1,2,3].subtract([3,2,1]), [], 'Array#subtract | 1,2,3 + 3,2,1');
  same([].subtract([3]), [], 'Array#subtract | empty array + [3]');
  same([3].subtract([]), [3], 'Array#subtract | [3] + empty array');
  same([].subtract([]), [], 'Array#subtract | 2 empty arrays');
  same([null].subtract([]), [null], 'Array#subtract | [null] + empty array');
  same([null].subtract([null]), [], 'Array#subtract | [null] + [null]');
  same([false].subtract([false]), [], 'Array#subtract | [false] + [false]');
  same([false].subtract([0]), [false], 'Array#subtract | [false] + [0]');
  same([false].subtract([null]), [false], 'Array#subtract | [false] + [null]');
  same([false].subtract([undefined]), [false], 'Array#subtract | [false] + [undefined]');
  same([{a:1},{b:2}].subtract([{b:2},{c:3}]), [{a:1}], 'Array#subtract | a:1,b:2 + b:2,c:3');
  same([1,1,3].subtract([1,5,6]), [3], 'Array#subtract | 1,1,3 + 1,5,6');
  same([1,2,3].subtract([4,5,6]), [1,2,3], 'Array#subtract | 1,2,3 + 4,5,6');
  same([1,2,3].subtract(1), [2,3], 'Array#subtract | 1,2,3 + 1');





  equals(['a','b','c'].at(0), 'a', 'Array#at | a,b,c | 0');
  equals(['a','b','c'].at(1), 'b', 'Array#at | a,b,c | 1');
  equals(['a','b','c'].at(2), 'c', 'Array#at | a,b,c | 2');
  equals(['a','b','c'].at(3), 'a', 'Array#at | a,b,c | 3');
  equals(['a','b','c'].at(-1), 'c', 'Array#at | a,b,c | -1');
  equals(['a','b','c'].at(-2), 'b', 'Array#at | a,b,c | -2');
  equals(['a','b','c'].at(-3), 'a', 'Array#at | a,b,c | -3');
  equals(['a','b','c'].at(-4), 'c', 'Array#at | a,b,c | -3');

  equals(['a','b','c'].at(0, false), 'a', 'Array#at | a,b,c | 0');
  equals(['a','b','c'].at(1, false), 'b', 'Array#at | a,b,c | 1');
  equals(['a','b','c'].at(2, false), 'c', 'Array#at | a,b,c | 2');
  equals(['a','b','c'].at(3, false), null, 'Array#at | a,b,c | 3');
  equals(['a','b','c'].at(-1, false), null, 'Array#at | a,b,c | -1');
  equals(['a','b','c'].at(-2, false), null, 'Array#at | a,b,c | -2');
  equals(['a','b','c'].at(-3, false), null, 'Array#at | a,b,c | -3');
  equals(['a','b','c'].at(-4, false), null, 'Array#at | a,b,c | -4');
  equals(['a','b','c'].at(), null, 'Array#at | a,b,c | no argument');
  equals([false].at(0), false, 'Array#at | false | 0');
  equals(['a'].at(0), 'a', 'Array#at | a | 0');
  equals(['a'].at(1), 'a', 'Array#at | a | 1');
  equals(['a'].at(1, false), null, 'Array#at | a | 1');
  equals(['a'].at(-1), 'a', 'Array#at | a | -1');
  same(['a','b','c','d','e','f'].at(0,2,4), ['a','c','e'], 'Array#at | a,b,c,d,e,f | 0,2,4');
  same(['a','b','c','d','e','f'].at(1,3,5), ['b','d','f'], 'Array#at | a,b,c,d,e,f | 1,3,5');
  same(['a','b','c','d','e','f'].at(0,2,4,6), ['a','c','e','a'], 'Array#at | a,b,c,d,e,f | 0,2,4,6');
  same(['a','b','c','d','e','f'].at(0,2,4,6, false), ['a','c','e'], 'Array#at | a,b,c,d,e,f | 0,2,4,6 | false');



  same(['a','b','c'].from(), ['a','b','c'], 'Array#from | no argument');
  same(['a','b','c'].from(1), ['b','c'], 'Array#from| 1');
  same(['a','b','c'].from(2), ['c'], 'Array#from | 2');
  same(['a','b','c'].from(3), [], 'Array#from | 3');
  same(['a','b','c'].from(4), [], 'Array#from | 4');
  same(['a','b','c'].from(-1), ['c'], 'Array#from | -1');
  same(['a','b','c'].from(-2), ['b','c'], 'Array#from | -2');
  same(['a','b','c'].from(-3), ['a','b','c'], 'Array#from | -3');
  same(['a','b','c'].from(-4), ['a','b','c'], 'Array#from | -4');


  same(['a','b','c'].to(), ['a','b','c'], 'Array#to | no argument');
  same(['a','b','c'].to(0), [], 'Array#to | no argument');
  same(['a','b','c'].to(1), ['a'], 'Array#to | 1');
  same(['a','b','c'].to(2), ['a','b'], 'Array#to | 2');
  same(['a','b','c'].to(3), ['a','b','c'], 'Array#to | 3');
  same(['a','b','c'].to(4), ['a','b','c'], 'Array#to | 4');
  same(['a','b','c'].to(-1), ['a','b'], 'Array#to | -1');
  same(['a','b','c'].to(-2), ['a'], 'Array#to | -2');
  same(['a','b','c'].to(-3), [], 'Array#to | -3');
  same(['a','b','c'].to(-4), [], 'Array#to | -4');



  same(['a','b','c'].first(), 'a', 'Array#first | no argument');
  sameWithException(['a','b','c'].first(1), ['a'], { prototype: 'a' }, 'Array#first | 1');
  sameWithException(['a','b','c'].first(2), ['a','b'], { prototype: 'a' }, 'Array#first | 2');
  sameWithException(['a','b','c'].first(3), ['a','b','c'], { prototype: 'a' }, 'Array#first | 3');
  sameWithException(['a','b','c'].first(4), ['a','b','c'], { prototype: 'a' }, 'Array#first | 4');
  sameWithException(['a','b','c'].first(-1), [], { prototype: 'a' }, 'Array#first | -1');
  sameWithException(['a','b','c'].first(-2), [], { prototype: 'a' }, 'Array#first | -2');
  sameWithException(['a','b','c'].first(-3), [], { prototype: 'a' }, 'Array#first | -3');


  same(['a','b','c'].last(), 'c', 'Array#last | no argument');
  sameWithException(['a','b','c'].last(1), ['c'], { prototype: 'c' }, 'Array#last | 1');
  sameWithException(['a','b','c'].last(2), ['b','c'], { prototype: 'c' }, 'Array#last | 2');
  sameWithException(['a','b','c'].last(3), ['a','b','c'], { prototype: 'c' }, 'Array#last | 3');
  sameWithException(['a','b','c'].last(4), ['a','b','c'], { prototype: 'c' }, 'Array#last | 4');
  sameWithException(['a','b','c'].last(-1), [], { prototype: 'c' }, 'Array#last | -1');
  sameWithException(['a','b','c'].last(-2), [], { prototype: 'c' }, 'Array#last | -2');
  sameWithException(['a','b','c'].last(-3), [], { prototype: 'c' }, 'Array#last | -3');
  sameWithException(['a','b','c'].last(-4), [], { prototype: 'c' }, 'Array#last | -4');






  sameWithException([12,87,55].min(), [12], { prototype: 12 }, 'Array#min | 12');
  sameWithException([-12,-87,-55].min(), [-87], { prototype: -87 }, 'Array#min | -87');
  sameWithException([5,5,5].min(), [5], { prototype: 5 }, 'Array#min | 5 is uniqued');
  sameWithException(['a','b','c'].min(), [], { prototype: 'a' }, 'Array#min | strings are not counted');
  sameWithException([].min(), [], { prototype: undefined }, 'Array#min | empty array');
  sameWithException([null].min(), [], { prototype: null }, 'Array#min | [null]');
  sameWithException([undefined].min(), [], { prototype: undefined }, 'Array#min | [undefined]');
  sameWithException([{a:1,b:5},{a:2,b:5},{a:3,b:5}].min(function(el){ return el['a']; }), [{a:1,b:5}], { prototype: 1 }, 'Array#min | key "a"');
  sameWithException([{a:1,b:5},{a:2,b:4},{a:3,b:3}].min(function(el){ return el['b']; }), [{a:3,b:3}], { prototype: 3 }, 'Array#min | key "b", 1 found');
  sameWithException([{a:1,b:5},{a:3,b:3},{a:3,b:3}].min(function(el){ return el['b']; }), [{a:3,b:3}], { prototype: 3 }, 'Array#min | key "b", 1 found');
  sameWithException([{a:1,b:3},{a:2,b:4},{a:3,b:3}].min(function(el){ return el['b']; }), [{a:1,b:3},{a:3,b:3}], { prototype: 3 }, 'Array#min | key "b", 2 found');
  sameWithException([{a:-1,b:-5},{a:-2,b:-4},{a:-3,b:-3}].min(function(el){ return el['b']; }), [{a:-1,b:-5}], { prototype: -5 }, 'Array#min | key "b", 1 found');
  sameWithException(['short','and','mort'].min(function(el){ return el.length; }), ['and'], { prototype: 3 }, 'Array#min | length');
  sameWithException(['short','and','mort','fat'].min(function(el){ return el.length; }), ['and','fat'], { prototype: 3 }, 'Array#min | and,fat');
  sameWithException(['short','and','mort'].min('length'), ['and'], { prototype: 3 }, 'Array#min | length with shortcut');


  sameWithException([12,87,55].max(), [87], { prototype: 87 }, 'Array#max | 87');
  sameWithException([-12,-87,-55].max(), [-12], { prototype: -12 }, 'Array#max | -12');
  sameWithException([5,5,128].max(), [128], { prototype: 128 }, 'Array#max | 128');
  sameWithException([128,128,128].max(), [128], { prototype: 128 }, 'Array#max | 128 is uniqued');
  sameWithException(['a','b','c'].max(), [], { prototype: 'c' }, 'Array#max | strings are not counted');
  sameWithException([].max(), [], { prototype: undefined }, 'Array#max | empty array');
  sameWithException([null].max(), [], { prototype: null }, 'Array#max | [null]');
  sameWithException([undefined].max(), [], { prototype: undefined }, 'Array#max | [undefined]');
  sameWithException([{a:1,b:5},{a:2,b:5},{a:3,b:5}].max(function(el){ return el['a']; }), [{a:3,b:5}], { prototype: 3 }, 'Array#max | key "a"');
  sameWithException([{a:1,b:5},{a:2,b:4},{a:3,b:3}].max(function(el){ return el['b']; }), [{a:1,b:5}], { prototype: 5 }, 'Array#max | key "b" returns b:5');
  sameWithException([{a:1,b:3},{a:2,b:4},{a:3,b:3}].max(function(el){ return el['b']; }), [{a:2,b:4}], { prototype: 4 }, 'Array#max | key "b" returns b:4');
  sameWithException([{a:1,b:3},{a:2,b:4},{a:2,b:4}].max(function(el){ return el['b']; }), [{a:2,b:4}], { prototype: 4 }, 'Array#max | key "b" returns b:4 uniqued');
  sameWithException([{a:1,b:3},{a:2,b:1},{a:3,b:3}].max(function(el){ return el['b']; }), [{a:1,b:3},{a:3,b:3}], { prototype: 3 }, 'Array#max | key "b", 2 found');
  sameWithException([{a:-1,b:-5},{a:-2,b:-4},{a:-3,b:-3}].max(function(el){ return el['b']; }), [{a:-3,b:-3}], { prototype: -3 }, 'Array#max | key "b" returns b:-3');
  sameWithException(['short','and', 'mort'].max(function(el){ return el.length; }), ['short'], { prototype: 5 }, 'Array#max | length');
  sameWithException(['short','and', 'morts', 'fat'].max(function(el){ return el.length; }), ['short','morts'], { prototype: 5 }, 'Array#max | short,morts');




  var people = [
    { name: 'jim',    age: 27, hair: 'brown'  },
    { name: 'mary',   age: 52, hair: 'blonde' },
    { name: 'ronnie', age: 13, hair: 'brown'  },
    { name: 'edmund', age: 27, hair: 'blonde' }
  ];

  same(people.most(function(person){ return person.age; }), [{name:'jim',age:27,hair:'brown'},{name:'edmund',age:27,hair:'blonde'}], 'Array#most | age');
  same(people.most(function(person){ return person.hair; }), [], 'Array#most | hair');

  same([].most(), [], 'Array#most | empty array');
  same([1,2,3].most(), [], 'Array#most | 1,2,3');
  same([1,2,3,3].most(), [3], 'Array#most | 1,2,3,3');
  same([1,1,2,3,3].most(), [1,3], 'Array#most | 1,1,2,3,3');
  same(['a','b','c'].most(), [], 'Array#most | a,b,c');
  same(['a','b','c','c'].most(), ['c'], 'Array#most | a,b,c,c');
  same(['a','a','b','c','c'].most(), ['a','c'], 'Array#most | a,a,b,c,c');

  // Leaving this here as a reference for how to collect the actual number of occurences.
  equal(people.most(function(person){ return person.age; }).length, 2, 'Array#most | collect actual number of occurrences');



  contains(people.least(function(person){ return person.age; }).age, [52,13], 'Array#least | age');
  testWithErrorHandling(function(){
    same(people.least(function(person){ return person.age; }).sortBy('age', true), [{name:'mary',age:52,hair:'blonde'},{name:'ronnie',age:13,hair:'brown'}], 'Array#least | age and sorted by age');
  }, ['prototype']);

  same(people.least(function(person){ return person.hair; }), [], 'Array#least | hair');

  same([].least(), [], 'Array#least | empty array');
  same([1,2,3].least(), [], 'Array#least | 1,2,3');
  same([1,2,3,3].least(), [1,2], 'Array#least | 1,2,3,3');
  same([1,1,2,3,3].least(), [2], 'Array#least | 1,1,2,3,3');
  same([1,1,1,2,2,3,3,3].least(), [2], 'Array#least | 1,1,1,2,2,3,3,3');
  same(['a','b','c'].least(), [], 'Array#least | a,b,c');
  same(['a','b','c','c'].least(), ['a','b'], 'Array#least | a,b,c,c');
  same(['a','a','b','c','c'].least(), ['b'], 'Array#least | a,a,b,c,c');

  // Leaving this here as a reference for how to collect the actual number of occurences.
  same(people.least(function(person){ return person.age; }).length, 2, 'Array#least | collect actual number of occurences');




  same([12,87,55].sum(), 154, 'Array#sum | 12,87,55');
  same([12,87,128].sum(), 227, 'Array#sum | 12,87,128');
  same([].sum(), 0, 'Array#sum | empty array is 0');
  same([null, false].sum(), 0, 'Array#sum | [null,false] is 0');
  same([{a:1,b:5},{a:2,b:5},{a:3,b:5}].sum(function(el){ return el['a']; }), 6, 'Array#sum | key "a"');
  same([{a:1,b:5},{a:2,b:5},{a:3,b:5}].sum('a'), 6, 'Array#sum | shortcut for key "a"');

  same([13,18,13,14,13,16,14,21,13].average(), 15, 'Array#average | 13,18,13,14,13,16,14,21,13');
  same([2,2,2].average(), 2, 'Array#average | 2,2,2');
  same([2,3,4].average(), 3, 'Array#average | 2,3,4');
  same([2,3,4,2].average(), 2.75, 'Array#average | 2,3,4,2');
  same([].average(), 0, 'Array#average | empty array is 0');
  same([null, false].average(), 0, 'Array#average | [null, false] is 0');
  same([{a:1,b:5},{a:2,b:5},{a:3,b:5}].average(function(el){ return el['a']; }), 2, 'Array#average | key "a"');
  same([{a:1,b:5},{a:2,b:5},{a:3,b:5}].average('a'), 2, 'Array#average | shortcut for key "a"');


  same(people.average('age'), 29.75, 'Array#average | people average age is 29.75');
  same(people.average(function(p){ return p.age; }), 29.75, 'Array#average | people average age is 29.75 by function');
  same(isNaN(people.average(function(p){ return p.hair; })), true, 'Array#average | people average hair is NaN');



  same([].groupBy(), {}, 'Array#groupBy | empty array');
  same([1,1,2,2,3,3,4].groupBy(), {1:[1,1],2:[2,2],3:[3,3],4:[4]}, 'Array#groupBy | 1,1,2,2,3,3,4');
  same(['a','b','c','a','e','c'].groupBy(), {'a':['a','a'],'b':['b'],'c':['c','c'],'e':['e']}, 'Array#groupBy | a,b,c,a,e,c');
  same([{a:1,b:5},{a:8,b:5},{a:8,b:3}].groupBy('a'), {8:[{a:8,b:5},{a:8,b:3}],1:[{a:1,b:5}]}, 'Array#groupBy | grouping by "a"');
  same([{a:1,b:5},{a:8,b:5},{a:8,b:3}].groupBy(function(el){ return el['a']; }), {8:[{a:8,b:5},{a:8,b:3}],1:[{a:1,b:5}]}, 'Array#groupBy | grouping by "a" by function');


  testWithErrorHandling(function(){
    people = people.sortBy('hair');
    same(people.groupBy(function(p){ return p.age; }), {27: [{name:'edmund',age:27,hair:'blonde'},{name:'jim',age:27,hair:'brown'}],52:[{name:'mary',age:52,hair:'blonde'}],13:[{name:'ronnie',age:13,hair:'brown'}]}, 'Array#groupBy | grouping people by age');
  }, ['prototype']);




  same([1,2,3,4,5,6,7,8,9,10].inGroups(1), [[1,2,3,4,5,6,7,8,9,10]], 'Array#inGroups | in groups of 1');
  same([1,2,3,4,5,6,7,8,9,10].inGroups(2), [[1,2,3,4,5],[6,7,8,9,10]], 'Array#inGroups | in groups of 2');
  same([1,2,3,4,5,6,7,8,9,10].inGroups(3), [[1,2,3,4],[5,6,7,8],[9,10]], 'Array#inGroups | in groups of 3');
  same([1,2,3,4,5,6,7,8,9,10].inGroups(4), [[1,2,3],[4,5,6],[7,8,9],[10]], 'Array#inGroups | in groups of 4');
  same([1,2,3,4,5,6,7,8,9,10].inGroups(5), [[1,2],[3,4],[5,6],[7,8],[9,10]], 'Array#inGroups | in groups of 5');
  same([1,2,3,4,5,6,7,8,9,10].inGroups(6), [[1,2],[3,4],[5,6],[7,8],[9,10],[]], 'Array#inGroups | in groups of 6');
  same([1,2,3,4,5,6,7,8,9,10].inGroups(7), [[1,2],[3,4],[5,6],[7,8],[9,10],[],[]], 'Array#inGroups | in groups of 7');


  same([1,2,3,4,5,6,7,8,9,10].inGroups(3, null), [[1,2,3,4],[5,6,7,8],[9,10,null,null]], 'Array#inGroups | pad with null | in groups of 3');
  same([1,2,3,4,5,6,7,8,9,10].inGroups(4, null), [[1,2,3],[4,5,6],[7,8,9],[10,null,null]], 'Array#inGroups | pad with null | in groups of 4');
  same([1,2,3,4,5,6,7,8,9,10].inGroups(5, null), [[1,2],[3,4],[5,6],[7,8],[9,10]], 'Array#inGroups | pad with null | in groups of 5');
  same([1,2,3,4,5,6,7,8,9,10].inGroups(6, null), [[1,2],[3,4],[5,6],[7,8],[9,10],[null,null]], 'Array#inGroups | pad with null | in groups of 6');
  same([1,2,3,4,5,6,7,8,9,10].inGroups(7, null), [[1,2],[3,4],[5,6],[7,8],[9,10],[null,null],[null,null]], 'Array#inGroups | pad with null | in groups of 7');



  same([1,2,3,4,5,6,7,8,9,10].inGroupsOf(3), [[1,2,3],[4,5,6],[7,8,9],[10,null,null]], 'Array#inGroupsOf | groups of 3 | 1 to 10');
  same([1,2,3,4,5,6,7,8,9].inGroupsOf(3), [[1,2,3],[4,5,6],[7,8,9]], 'Array#inGroupsOf | groups of 3 | 1 to 9');
  same([1,2,3,4,5,6,7,8].inGroupsOf(3), [[1,2,3],[4,5,6],[7,8,null]], 'Array#inGroupsOf | groups of 3 | 1 to 8');
  same([1,2,3,4,5,6,7].inGroupsOf(3), [[1,2,3],[4,5,6],[7,null,null]], 'Array#inGroupsOf | groups of 3 | 1 to 7');
  same([1,2,3,4,5,6].inGroupsOf(3), [[1,2,3],[4,5,6]], 'Array#inGroupsOf | groups of 3 | 1 to 6');
  same([1,2,3,4,5].inGroupsOf(3), [[1,2,3],[4,5,null]], 'Array#inGroupsOf | groups of 3 | 1 to 5');
  same([1,2,3,4].inGroupsOf(3), [[1,2,3],[4,null,null]], 'Array#inGroupsOf | groups of 3 | 1 to 4');
  same([1,2,3].inGroupsOf(3), [[1,2,3]], 'Array#inGroupsOf | groups of 3 | 1 to 3');
  same([1,2].inGroupsOf(3), [[1,2,null]], 'Array#inGroupsOf | groups of 3 | 1 to 2');
  same([1].inGroupsOf(3), [[1,null,null]], 'Array#inGroupsOf | groups of 3 | 1');

  same([1,2,3,4,5,6,7,8,9,10].inGroupsOf(3, null), [[1,2,3],[4,5,6],[7,8,9],[10, null, null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 10');
  same([1,2,3,4,5,6,7,8,9].inGroupsOf(3, null), [[1,2,3],[4,5,6],[7,8,9]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 9');
  same([1,2,3,4,5,6,7,8].inGroupsOf(3, null), [[1,2,3],[4,5,6],[7,8, null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 8');
  same([1,2,3,4,5,6,7].inGroupsOf(3, null), [[1,2,3],[4,5,6],[7, null, null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 7');
  same([1,2,3,4,5,6].inGroupsOf(3, null), [[1,2,3],[4,5,6]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 6');
  same([1,2,3,4,5].inGroupsOf(3, null), [[1,2,3],[4,5,null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 5');
  same([1,2,3,4].inGroupsOf(3, null), [[1,2,3],[4,null,null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 4');
  same([1,2,3].inGroupsOf(3, null), [[1,2,3]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 3');
  same([1,2].inGroupsOf(3, null), [[1,2,null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1 to 2');
  same([1].inGroupsOf(3, null), [[1,null,null]], 'Array#inGroupsOf | groups of 3 | pad with null | 1');

  same([1].inGroupsOf(3, ' '), [[1,' ',' ']], 'Array#inGroupsOf | pad with spaces');
  same([1].inGroupsOf(3, true), [[1,true,true]], 'Array#inGroupsOf | pad with true');
  same([1].inGroupsOf(3, false), [[1,false,false]], 'Array#inGroupsOf | pad with false');

  sameWithException([1].inGroupsOf(), [[1]], { prototype: [] }, 'Array#inGroupsOf | no argument');
  same([1].inGroupsOf(1, null), [[1]], 'Array#inGroupsOf | pad with null | no argument');

  same([1].inGroupsOf(0), [1], 'Array#inGroupsOf | 0');
  same([1].inGroupsOf(0, null), [1], 'Array#inGroupsOf | pad with null | 0');

  same([1].inGroupsOf(3, null), [[1, null, null]], 'Array#inGroupsOf | pad with null | 3');
  same([1].inGroupsOf(1, null), [[1]], 'Array#inGroupsOf | pad with null | 1');
  same([].inGroupsOf(3), [], 'Array#inGroupsOf | empty array');
  same([].inGroupsOf(3, null), [], 'Array#inGroupsOf | pad with null | empty array');
  same([null].inGroupsOf(3), [[null,null,null]], 'Array#inGroupsOf | [null] in groups of 3');
  same([null].inGroupsOf(3, null), [[null,null,null]], 'Array#inGroupsOf | pad with null | [null] in groups of 3');
  same([1].inGroupsOf(3, undefined), [[1,null,null]], 'Array#inGroupsOf | passing undefined reverts to null');



  // Emulating example of Enumerable#each_slice
  same((1).upto(10).inGroupsOf(3).map(function(g){ return g[1]; }).compact(), [2,5,8], 'Array#inGroupsOf | 1 to 10 in groups of 3 compacted');

  same([1,2,3,4,5].split(3), [[1,2],[4,5]], 'Array#split | split on 3');
  same([1,2,3,4,5].split(1), [[2,3,4,5]], 'Array#split | split on 1');
  same([1,2,3,4,5].split(2), [[1],[3,4,5]], 'Array#split | split on 2');
  same([1,2,3,4,5].split(4), [[1,2,3],[5]], 'Array#split | split on 4');
  same([1,2,3,4,5].split(5), [[1,2,3,4]], 'Array#split | split on 5');
  same([1,2,3,4,5].split(0), [[1,2,3,4,5]], 'Array#split | split on 0');
  same([1,2,3,4,5].split(6), [[1,2,3,4,5]], 'Array#split | split on 6');
  same([1,2,3,4,5,6,7,8,9,10].split(function(i){ return i % 3 == 0; }), [[1,2],[4,5],[7,8],[10]], 'Array#split | split on every 3rd');
  same(['wherever','you','go','whatever','you','do'].split(function(str){ return str.length == 2; }), [['wherever','you'],['whatever','you']], 'Array#split | split on strings with length of 2');
  same(['wherever','you','go','whatever','you','do'].split(function(str){ return str.length == 3; }), [['wherever'],['go','whatever'],['do']], 'Array#split | split on strings with length of 3');
  same(['wherever','you','go','whatever','you','do'].split(function(str){ return str.length < 4; }), [['wherever'],['whatever']], 'Array#split | split on strings with length less than 4');
  same(['wherever','you','go','whatever','you','do'].split(/^[gd]o/), [['wherever','you'],['whatever','you']], 'Array#split | split on regex | split on strings with length of 2');



  same([1,2,3].compact(), [1,2,3], 'Array#compact | 1,2,3');
  same([1,2,null,3].compact(), [1,2,3], 'Array#compact | 1,2,null,3');
  same([1,2,undefined,3].compact(), [1,2,3], 'Array#compact | 1,2,undefined,3');
  same([undefined,undefined,undefined].compact(), [], 'Array#compact | undefined,undefined,undefined');
  same([null,null,null].compact(), [], 'Array#compact | null,null,null');
  sameWithException([NaN,NaN,NaN].compact(), [], { prototype: [NaN,NaN,NaN] }, 'Array#compact | NaN,NaN,NaN');
  same(['','',''], ['','',''], 'Array#compact | empty strings');
  same([false,false,false].compact(), [false,false,false], 'Array#compact | false is left alone');
  same([0,1,2].compact(), [0,1,2], 'Array#compact | 0,1,2');
  same([].compact(), [], 'Array#compact | empty array');
  sameWithException([null,[null],[false,[null,undefined,3]]].compact(), [[],[false,[3]]], { prototype: [[null],[false,[null,undefined,3]]] }, 'Array#compact | deep compacts as well');
  sameWithException([null,null,null,[null],null].compact(), [[]], { prototype: [[null]] }, "Array#compact | deep compact doesn't have index conflicts");


  same([1,2,2,3].count(), 4, 'Array#count | no arugment numeric');
  same([1,2,2,3].count(2), 2, 'Array#count | count 2s');
  same(['a','b','c','c'].count(), 4, 'Array#count | no argument alphabet');
  same(['a','b','c','c'].count('c'), 2, 'Array#count | count "c"s');
  same([1,2,2,3].count(function(el){ return el % 2 == 0; }), 2, 'Array#count | count all odd numbers');
  same([1,2,2,3].count(function(el){ return el > 2; }), 1, 'Array#count | count all numbers greater than 2');
  same([1,2,2,3].count(function(el){ return el > 20; }), 0, 'Array#count | count all numbers greater than 20');
  sameWithException([{a:1},{a:2},{a:1}].count({a:1}), 2, { prototype: 0 }, 'Array#count | count all a:1');






  same([1,2,2,3].remove(), [], 'Array#remove | no argument numeric');
  same([1,2,2,3].remove(2), [1,3], 'Array#remove | remove 2s');
  same(['a','b','c','c'].remove(), [], 'Array#remove | no argument alphabet');
  same(['a','b','c','c'].remove('c'), ['a','b'], 'Array#remove | remove "c"s');
  same([1,2,2,3].remove(function(el){ return el % 2 == 0; }), [1,3], 'Array#remove | remove all odd numbers');
  same([1,2,2,3].remove(function(el){ return el > 2; }), [1,2,2], 'Array#remove | remove all numbers greater than 2');
  same([1,2,2,3].remove(function(el){ return el > 20; }), [1,2,2,3], 'Array#remove | remove all numbers greater than 20');
  same([{a:1},{a:2},{a:1}].remove({a:1}), [{a:2}], 'Array#remove | remove all a:1');
  ['a'].remove(function(el,i,arr){
    equals(el, 'a', 'Array#remove | first param should be the element');
    equals(i, 0, 'Array#remove | second param should be the index');
    same(arr, ['a'], 'Array#remove | third param should be the array');
  });



  same([1,2,2,3].removeAtIndex(), [1,2,2,3], 'Array#removeAtIndex | numeric | no argument');
  same([1,2,2,3].removeAtIndex(0), [2,2,3], 'Array#removeAtIndex | numeric | 0');
  same([1,2,2,3].removeAtIndex(1), [1,2,3], 'Array#removeAtIndex | numeric | 1');
  same([1,2,2,3].removeAtIndex(2), [1,2,3], 'Array#removeAtIndex | numeric | 2');
  same([1,2,2,3].removeAtIndex(3), [1,2,2], 'Array#removeAtIndex | numeric | 3');
  same([1,2,2,3].removeAtIndex(4), [1,2,2,3], 'Array#removeAtIndex | numeric | 4');
  same(['a','b','c','c'].removeAtIndex(), ['a','b','c','c'], 'Array#removeAtIndex | alphabet | no argument');
  same(['a','b','c','c'].removeAtIndex(0), ['b','c','c'], 'Array#removeAtIndex | alphabet | 0');
  same(['a','b','c','c'].removeAtIndex(1), ['a','c','c'], 'Array#removeAtIndex | alphabet | 1');
  same(['a','b','c','c'].removeAtIndex(2), ['a','b','c'], 'Array#removeAtIndex | alphabet | 2');
  same(['a','b','c','c'].removeAtIndex(3), ['a','b','c'], 'Array#removeAtIndex | alphabet | 3');
  same(['a','b','c','c'].removeAtIndex(4), ['a','b','c','c'], 'Array#removeAtIndex | alphabet | 4');
  same([{a:1},{a:2},{a:1}].removeAtIndex(1), [{a:1},{a:1}], 'Array#removeAtIndex | objects | 1');
  same([1,2,2,3].removeAtIndex(0,1), [2,3], 'Array#removeAtIndex | 0 to 1');
  same([1,2,2,3].removeAtIndex(0,2), [3], 'Array#removeAtIndex | 0 to 2');
  same([1,2,2,3].removeAtIndex(1,2), [1,3], 'Array#removeAtIndex | 1 to 2');
  same([1,2,2,3].removeAtIndex(1,5), [1], 'Array#removeAtIndex | 1 to 5');
  same([1,2,2,3].removeAtIndex(0,5), [], 'Array#removeAtIndex | 0 to 5');
  same([1,2,2,3].removeAtIndex(null,5), [], 'Array#removeAtIndex | also accepts null');






  same([1,2,3].add(4), [1,2,3,4], 'Array#add | 1,2,3 + 4');
  same(['a','b','c'].add('d'), ['a','b','c','d'], 'Array#add | a,b,c + d');
  same([{a:1},{a:2}].add({a:3}), [{a:1},{a:2},{a:3}], 'Array#add | a:1,a:2 + a:3');
  same([1,2,3].add([3,4,5]), [1,2,3,3,4,5], 'Array#add | 1,2,3 + 3,4,5');
  same(['a','b','c'].add(['c','d','e']), ['a','b','c','c','d','e'], 'Array#add | a,b,c + c,d,e');
  same([1,2,3].add([1,2,3]), [1,2,3,1,2,3], 'Array#add | 1,2,3 + 1,2,3');
  same([1,2,3].add([3,2,1]), [1,2,3,3,2,1], 'Array#add | 1,2,3 + 3,2,1');
  same([].add([3]), [3], 'Array#add | empty array + 3');
  same([3].add([]), [3], 'Array#add | 3 + empty array');
  same([].add([]), [], 'Array#add | 2 empty arrays');
  same([null].add([]), [null], 'Array#add | [null] + empty array');
  same([null].add([null]), [null, null], 'Array#add | [null] + [null]');
  same([false].add([false]), [false, false], 'Array#add | [false] + [false]');
  same([false].add([0]), [false, 0], 'Array#add | [false] + [0]');
  same([false].add([null]), [false, null], 'Array#add | [false] + [null]');
  same([false].add([undefined]), [false, undefined], 'Array#add | [false] + [undefined]');
  same([{a:1},{b:2}].add([{b:2},{c:3}]), [{a:1},{b:2},{b:2},{c:3}], 'Array#add | a:1,b:2 + b:2,c:3');
  same([1,1,3].add([1,5,6]), [1,1,3,1,5,6], 'Array#add | 1,1,3 + 1,5,6');
  same([1,2,3].add([4,5,6]), [1,2,3,4,5,6], 'Array#add | 1,2,3 + 4,5,6');
  same([1,2,3].add(1), [1,2,3,1], 'Array#add | 1,2,3 + 1');




  same([1,2,3].insert(4, 1), [1,4,2,3], 'Array#insert | 1 | 4');
  same(['a','b','c'].insert('d', 1), ['a','d','b','c'], 'Array#insert | 1 | d');
  same([{a:1},{a:2}].insert({a:3}, 1), [{a:1},{a:3},{a:2}], 'Array#insert | 1 | a:3');

  same([1,2,3].insert(4, 2), [1,2,4,3], 'Array#insert | 2 | 4');
  same(['a','b','c'].insert('d', 2), ['a','b','d','c'], 'Array#insert | 2 | d');
  same([{a:1},{a:2}].insert({a:3}, 2), [{a:1},{a:2},{a:3}], 'Array#insert | 2 | a:3');

  same(['a','b','c'].insert('d', 5), ['a','b','c','d'], 'Array#insert | 5 | d');
  same(['a','b','c'].insert('d', 0), ['d','a','b','c'], 'Array#insert | 0 | d');
  same(['a','b','c'].insert('d', -1), ['a','b','c','d'], 'Array#insert | -1 | d');
  same(['a','b','c'].insert('d', -2), ['a','b','d','c'], 'Array#insert | -2 | d');
  same(['a','b','c'].insert('d', -3), ['a','d','b','c'], 'Array#insert | -3 | d');
  same(['a','b','c'].insert('d', null), ['a','b','c','d'], 'Array#insert | null | d');
  same(['a','b','c'].insert('d', undefined), ['a','b','c','d'], 'Array#insert | undefined | d');
  same(['a','b','c'].insert('d', 'a'), ['a','b','c','d'], 'Array#insert | a | d');
  same(['a','b','c'].insert('d', NaN), ['a','b','c','d'], 'Array#insert | NaN | d');




  equal([1,2,3].isEmpty(), false, 'Array#empty | 1,2,3');
  equal([].isEmpty(), true, 'Array#empty | empty array');
  equal([null].isEmpty(), true, 'Array#empty | [null]');
  equal([undefined].isEmpty(), true, 'Array#empty | [undefined]');
  equal([null,null].isEmpty(), true, 'Array#empty | [null,null]');
  equal([undefined,undefined].isEmpty(), true, 'Array#empty | [undefined,undefined]');
  equal([false,false].isEmpty(), false, 'Array#empty | [false,false]');
  equal([0,0].isEmpty(), false, 'Array#empty | [0,0]');




  testWithErrorHandling(function(){
    equal([1,2,3].any(), true, 'Array#any | numeric | no argument');
    equal([1,2,3].any(1), true, 'Array#any | numeric | 1');
    equal([1,2,3].any(4), false, 'Array#any | numeric | 4');
    equal([1,2,3].any('a'), false, 'Array#any | numeric | a');
    equal(['a','b','c'].any('a'), true, 'Array#any | alphabet | a');
    equal(['a','b','c'].any('f'), false, 'Array#any | alphabet | f');
    equal(['a','b','c'].any(/[a-f]/), true, 'Array#any | alphabet | /[a-f]/');
    equal(['a','b','c'].any(/[m-z]/), false, 'Array#any | alphabet | /[m-z]/');
    same([{a:1},{a:2},{a:1}].any(1), false, 'Array#any | objects | 1');
    equal([0].any(0), true, 'Array#any | [0] | 0');
    same([{a:1},{a:2},{a:1}].any({a:1}), true, 'Array#any | objects | a:1');
  }, ['prototype']);

  equal(['a','b','c'].any(function(e){ return e.length > 1; }), false, 'Array#any | alphabet | length greater than 1');
  equal(['a','b','c'].any(function(e){ return e.length < 2; }), true, 'Array#any | alphabet | length less than 2');
  equal(['a','bar','cat'].any(function(e){ return e.length < 2; }), true, 'Array#any | a,bar,cat | length less than 2');
  same([{a:1},{a:2},{a:1}].any(function(e){ return e['a'] == 1; }), true, 'Array#any | objects | key "a" is 1');
  same([{a:1},{a:2},{a:1}].any(function(e){ return e['b'] == 1; }), false, 'Array#any | objects | key "b" is 1');

  [1].any(function(){
    equal(this, 'wasabi', 'Array#any | scope should be passable');
  }, 'wasabi');



  equal([1,2,3].has(), true, 'Array#has | numeric | no argument');
  equal([1,2,3].has(1), true, 'Array#has | numeric | 1');
  equal([1,2,3].has(4), false, 'Array#has | numeric | 4');
  equal([1,2,3].has('a'), false, 'Array#has | numeric | a');
  equal(['a','b','c'].has('a'), true, 'Array#has | alphabet | a');
  equal(['a','b','c'].has('f'), false, 'Array#has | alphabet | f');
  equal(['a','b','c'].has(/[a-f]/), true, 'Array#has | alphabet | /[a-f]/');
  equal(['a','b','c'].has(/[m-z]/), false, 'Array#has | alphabet | /[m-z]/');
  equal(['a','b','c'].has(function(e){ return e.length > 1; }), false, 'Array#has | alphabet | length greater than 1');
  equal(['a','b','c'].has(function(e){ return e.length < 2; }), true, 'Array#has | alphabet | length less than 2');
  equal(['a','bar','cat'].has(function(e){ return e.length < 2; }), true, 'Array#has | a,bar,cat | length less than 2');
  same([{a:1},{a:2},{a:1}].has(1), false, 'Array#has | objects | 1');
  same([{a:1},{a:2},{a:1}].has({a:1}), true, 'Array#has | objects | a:1');
  same([{a:1},{a:2},{a:1}].has(function(e){ return e['a'] == 1; }), true, 'Array#has | objects | key "a" is 1');
  same([{a:1},{a:2},{a:1}].has(function(e){ return e['b'] == 1; }), false, 'Array#has | objects | key "b" is 1');




  testWithErrorHandling(function(){
    equal([1,2,3].none(), false, 'Array#none | numeric | no argument');
    equal([1,2,3].none(1), false, 'Array#none | numeric | 1');
    equal([1,2,3].none(4), true, 'Array#none | numeric | 4');
    equal([1,2,3].none('a'), true, 'Array#none | numeric | a');
    equal(['a','b','c'].none('a'), false, 'Array#none | alphabet | a');
    equal(['a','b','c'].none('f'), true, 'Array#none | alphabet | f');
    equal(['a','b','c'].none(/[a-f]/), false, 'Array#none | alphabet | /[a-f]/');
    equal(['a','b','c'].none(/[m-z]/), true, 'Array#none | alphabet | /[m-z]/');
    same([{a:1},{a:2},{a:1}].none(1), true, 'Array#none | objects | 1');
    same([{a:1},{a:2},{a:1}].none({a:1}), false, 'Array#none | objects | a:1');
  }, ['prototype']);

  equal(['a','b','c'].none(function(e){ return e.length > 1; }), true, 'Array#none | alphabet | length is greater than 1');
  equal(['a','b','c'].none(function(e){ return e.length < 2; }), false, 'Array#none | alphabet | length is less than 2');
  equal(['a','bar','cat'].none(function(e){ return e.length < 2; }), false, 'Array#none | a,bar,cat | length is less than 2');
  same([{a:1},{a:2},{a:1}].none(function(e){ return e['a'] == 1; }), false, 'Array#none | objects | key "a" is 1');
  same([{a:1},{a:2},{a:1}].none(function(e){ return e['b'] == 1; }), true, 'Array#none | objects | key "b" is 1');





  testWithErrorHandling(function(){
    equal([1,2,3].all(), true, 'Array#all | numeric | no argument');
    equal([0,2,3].all(), false, 'Array#all | numeric | 0 is not truthy');
    equal([1,2,3].all(1), false, 'Array#all | numeric | 1');
    equal([1,1,1].all(1), true, 'Array#all | numeric | 1 is true for all');
    equal([1,2,3].all(3), false, 'Array#all | numeric | 3');
    equal(['a','b','c'].all('a'), false, 'Array#all | alphabet | a');
    equal(['a','a','a'].all('a'), true, 'Array#all | alphabet | a is true for all');
    equal(['a','b','c'].all('f'), false, 'Array#all | alphabet | f');
    equal(['a','b','c'].all(/[a-f]/), true, 'Array#all | alphabet | /[a-f]/');
    equal(['a','b','c'].all(/[a-b]/), false, 'Array#all | alphabet | /[m-z]/');
    same([{a:1},{a:2},{a:1}].all(1), false, 'Array#all | objects | 1');
    same([{a:1},{a:2},{a:1}].all({a:1}), false, 'Array#all | objects | a:1');
    same([{a:1},{a:1},{a:1}].all({a:1}), true, 'Array#all | objects | a:1 is true for all');
  }, ['prototype']);

  equal(['a','b','c'].all(function(e){ return e.length > 1; }), false, 'Array#all | alphabet | length is greater than 1');
  equal(['a','b','c'].all(function(e){ return e.length < 2; }), true, 'Array#all | alphabet | length is less than 2');
  equal(['a','bar','cat'].all(function(e){ return e.length < 2; }), false, 'Array#all | a,bar,cat | length is less than 2');
  same([{a:1},{a:2},{a:1}].all(function(e){ return e['a'] == 1; }), false, 'Array#all | objects | key "a" is 1');
  same([{a:1},{a:2},{a:1}].all(function(e){ return e['b'] == 1; }), false, 'Array#all | objects | key "b" is 1');
  same([{a:1},{a:1},{a:1}].all(function(e){ return e['a'] == 1; }), true, 'Array#all | objects | key "a" is 1 for all');

  [1].all(function(){
    equal(this, 'wasabi', 'Array#all | scope should be passable');
  }, 'wasabi');



  same([1,2,3].flatten(), [1,2,3], 'Array#flatten | 1,2,3');
  same(['a','b','c'].flatten(), ['a','b','c'], 'Array#flatten | a,b,c');
  same([{a:1},{a:2},{a:1}].flatten(), [{a:1},{a:2},{a:1}], 'Array#flatten | a:1,a:2,a:1');
  same([[1],[2],[3]].flatten(), [1,2,3], 'Array#flatten | [1],[2],[3]');
  same([[1,2],[3]].flatten(), [1,2,3], 'Array#flatten | [1,2],[3]');
  same([[1,2,3]].flatten(), [1,2,3], 'Array#flatten | [1,2,3]');
  same([['a'],['b'],['c']].flatten(), ['a','b','c'], 'Array#flatten | [a],[b],[c]');
  same([['a','b'],['c']].flatten(), ['a','b','c'], 'Array#flatten | [a,b],[c]');
  same([['a','b','c']].flatten(), ['a','b','c'], 'Array#flatten | [a,b,c]');
  same([[{a:1}],[{a:2}],[{a:1}]].flatten(), [{a:1},{a:2},{a:1}], 'Array#flatten | [a:1],[a:2],[a:1]');
  same([[{a:1},{a:2}],[{a:1}]].flatten(), [{a:1},{a:2},{a:1}], 'Array#flatten | [a:1,a:2],[a:1]');
  same([[{a:1},{a:2},{a:1}]].flatten(), [{a:1},{a:2},{a:1}], 'Array#flatten | [a:1,a:2,a:1]');
  same([[[['a','b'],'c',['d','e']],'f'],['g']].flatten(), ['a','b','c','d','e','f','g'], 'Array#flatten | [[a,b],c,[d,e],f],g');





  testWithErrorHandling(function(){
    arr = ['more','everyone!','bring','the','family'];
    same(arr.sortBy('length'), ['the','more','bring','family','everyone!'], 'Array#sortBy | sorting by length');
    same(arr.sortBy('length', true), ['everyone!','family','bring','more','the'], 'Array#sortBy | desc | sorting by length');

    same(arr.sortBy(function(a){ return a.length; }), ['the','more','bring','family','everyone!'], 'Array#sortBy | sort by length by function');
    same(arr.sortBy(function(a){ return a.length; }, true), ['everyone!','family','bring','more','the'], 'Array#sortBy | desc | sort by length by function');

    arr = [{a:'foo'},{a:'bar'},{a:'skittles'}];
    same(arr.sortBy('a'), [{a:'bar'},{a:'foo'},{a:'skittles'}], 'Array#sortBy | sort by key "a"');
    same(arr.sortBy('a', true), [{a:'skittles'},{a:'foo'},{a:'bar'}], 'Array#sortBy | desc | sort by key "a"');
  }, ['prototype']);






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
  equals(firsts.all(function(a){ return a == 1; }), false, 'Array#randomize');



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
  equals(firsts.all(function(a){ return a == 1; }), false, 'Array#shuffle');



});



test('Date', function () {

  // Mootools over-stepping itself here with the "create" method implemented as a Function instance method,
  // which interferes with class methods as classes themselves are functions. Taking back this class method
  // for the sake of the tests.
  if(Object.isFunction(Date.create())){
    Date.create = Date.make;
  };

  var day, d, o;
  var timezoneOffset = new Date().getTimezoneOffset();
  var staticWinterTimezoneOffset = new Date(2011, 0, 1).getTimezoneOffset();
  var staticSummerTimezoneOffset = new Date(2011, 8, 1).getTimezoneOffset();
  var now = new Date();
  var thisYear = now.getFullYear();

  // Valid Date

  // Invalid date
  equals(new Date('a fridge too far').isValid(), false, 'Date#isValid | new Date invalid');
  testWithErrorHandling(function(){
    equals(new Date().isValid(), true, 'Date#isValid | new Date valid');
  }, ['mootools']);

  equals(Date.create().isValid(), true, 'Date#isValid | created date is valid');
  equals(Date.create('a fridge too far').isValid(), false, 'Date#isValid | Date#create invalid');


  equals(new Date().isUTC(), timezoneOffset === 0 ? true : false, 'Date#isUTC | UTC is true if the current timezone has no offset');
  // UTC is not if there is a timezone offset, even if the time is reset to the intended utc equivalent, as timezones can never be changed
  equals(new Date(now.getTime()).addMinutes(timezoneOffset).isUTC(), timezoneOffset === 0 ? true : false, 'Date#isUTC | UTC cannot be forced');

  dateEquals(Date.create(), new Date(), 'Date#create | empty');



  // All date modifications are clones

  d = Date.create('1998');

  dateEquals(d.toUTC(), Date.create('1998').addMinutes(timezoneOffset).addMilliseconds(-Date.DSTOffset), 'Date#toUTC | should not affect original date');
  dateEquals(d.toUTC(), Date.create('1998').addMinutes(timezoneOffset).addMilliseconds(-Date.DSTOffset), 'Date#toUTC | should not affect original date');
  dateEquals(d.toUTC().toUTC(), Date.create('1998').addMinutes(timezoneOffset).addMilliseconds(-Date.DSTOffset), 'Date#toUTC | cannot be chained');
  equals(Date.create().toUTC().isUTC(), true, 'Date#isUTC | can be set by toUTC');


  // Date constructor accepts enumerated parameters

  dateEquals(Date.create(1998), new Date(1998), 'Date#create | enumerated | 1998');
  dateEquals(Date.create(1998,1), new Date(1998,1), 'Date#create | enumerated | January, 1998');
  dateEquals(Date.create(1998,1,23), new Date(1998,1,23), 'Date#create | enumerated | January 23, 1998');
  dateEquals(Date.create(1998,1,23,11), new Date(1998,1,23,11), 'Date#create | enumerated | January 23, 1998 11am');
  dateEquals(Date.create(1998,1,23,11,54), new Date(1998,1,23,11,54), 'Date#create | enumerated | January 23, 1998 11:54am');
  dateEquals(Date.create(1998,1,23,11,54,32), new Date(1998,1,23,11,54,32), 'Date#create | enumerated | January 23, 1998 11:54:32');
  dateEquals(Date.create(1998,1,23,11,54,32,454), new Date(1998,1,23,11,54,32,454), 'Date#create | enumerated | January 23, 1998 11:54:32.454');

  dateEquals(Date.create('1998', true), new Date(1998, 0), 'Date#create | will not choke on a boolean as second param');

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

  dateEquals(Date.create(0), new Date(1970, 0, 1, 0, -staticWinterTimezoneOffset) , 'Date#create | Accepts numbers');
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
  dateEquals(Date.create('08/25/0001'), new Date(-62115206400000).toUTC(), 'Date#create | American style slashes | mm/dd/0001');

  // Dashes (American style)
  dateEquals(Date.create('08-25-1978'), new Date(1978, 7, 25), 'Date#create | American style dashes | mm-dd-yyyy');
  dateEquals(Date.create('8-25-1978'), new Date(1978, 7, 25), 'Date#create | American style dashes | m-dd-yyyy');


  // dd-dd-dd is NOT American style as it is a reserved ISO8601 date format
  dateEquals(Date.create('08-05-05'), new Date(2008, 4, 5), 'Date#create | dd-dd-dd is an ISO8601 format');

  // Dots (American style)
  dateEquals(Date.create('08.25.1978'), new Date(1978, 7, 25), 'Date#create | American style dots | mm.dd.yyyy');
  dateEquals(Date.create('8.25.1978'), new Date(1978, 7, 25), 'Date#create | American style dots | m.dd.yyyy');






  // Abbreviated reverse slash format yy/mm/dd cannot exist because it clashes with forward
  // slash format dd/mm/yy (with european variant). This rule however, doesn't follow for dashes,
  // which is abbreviated ISO8601 format: yy-mm-dd
  dateEquals(Date.create('01/02/03'), new Date(2003, 0, 2), 'Date#create | Ambiguous 2 digit format mm/dd/yy');


  Date.allowVariant = true;

  dateEquals(Date.create('08/10'), new Date(thisYear, 9, 8), 'Date#create | European style slashes | dd/mm');
  // Slashes (European style)
  dateEquals(Date.create('8/10'), new Date(thisYear, 9, 8), 'Date#create | European style slashes | d/mm');
  dateEquals(Date.create('08/10/1978'), new Date(1978, 9, 8), 'Date#create | European style slashes | dd/mm/yyyy');
  dateEquals(Date.create('8/10/1978'), new Date(1978, 9, 8), 'Date#create | European style slashes | d/mm/yyyy');
  dateEquals(Date.create('8/10/78'), new Date(1978, 9, 8), 'Date#create | European style slashes | d/mm/yy');
  dateEquals(Date.create('08/10/78'), new Date(1978, 9, 8), 'Date#create | European style slashes | dd/mm/yy');
  dateEquals(Date.create('8/10/01'), new Date(2001, 9, 8), 'Date#create | European style slashes | d/mm/01');
  dateEquals(Date.create('8/10/49'), new Date(2049, 9, 8), 'Date#create | European style slashes | d/mm/49');
  dateEquals(Date.create('8/10/50'), new Date(1950, 9, 8), 'Date#create | European style slashes | d/mm/50');

  // Dashes (European style)
  dateEquals(Date.create('08-10-1978'), new Date(1978, 9, 8), 'Date#create | European style dashes | dd-dd-dd is an ISO8601 format');

  // Dots (European style)
  dateEquals(Date.create('08.10.1978'), new Date(1978, 9, 8), 'Date#create | European style dots | dd.mm.yyyy');
  dateEquals(Date.create('8.10.1978'), new Date(1978, 9, 8), 'Date#create | European style dots | d.mm.yyyy');
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

  dateEquals(Date.create('01-02-03'), new Date(2001, 1, 3), 'Date#create | Ambiguous 2 digit ISO variant yy-mm-dd');

  dateEquals(Date.create('01/02/03'), new Date(2003, 1, 1), 'Date#create | Ambiguous 2 digit European variant dd/mm/yy');
  dateEquals(Date.create('01-02-03'), new Date(2001, 1, 3), 'Date#create | Ambiguous 2 digit ISO variant has NO European variant of its own');
  Date.allowVariant = false;


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
  dateEquals(Date.create('today at 4pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16), 'Date#create | Fuzzy Dates | Today at 4pm');

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
  dateEquals(Date.create('last Monday at 4pm'), getDateWithWeekdayAndOffset(1, -7, 16), 'Date#create | Fuzzy Dates | last Monday at 4pm');

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



  dateEquals(new Date().advance({ years: 1 }), Date.create('one year from now'), 'Date#advance | advancing 1 year');
  dateEquals(new Date().rewind({ years: 1 }), Date.create('one year ago'), 'Date#rewind | rewinding 1 year');









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




  d = new Date('August 25, 2010 11:45:20');
  d.setWeek(1);
  dateEquals(d, new Date(2010,0,8,11,45,20), 'Date#setWeek | week 1');
  d.setWeek(15);
  dateEquals(d, new Date(2010,3,16,11,45,20), 'Date#setWeek | week 15');
  d.setWeek(27);
  dateEquals(d, new Date(2010,6,9,11,45,20), 'Date#setWeek | week 27');
  d.setWeek(52);
  dateEquals(d, new Date(2010,11,31,11,45,20), 'Date#setWeek | week 52');
  d.setWeek();
  dateEquals(d, new Date(2010,11,31,11,45,20), 'Date#setWeek | week stays set');


  // Date formatting. Much thanks to inspiration taken from Date.js here.
  // I quite like the formatting patterns in Date.js, however there are a few
  // notable limitations. One example is a format such as 4m23s which would have
  // to be formatted as mmss and wouldn't parse at all without special massaging.
  // Going to take a different tack here with a format that's more explicit and
  // easy to remember, if not quite as terse and elegant.


  d = new Date('August 5, 2010 13:45:02');


  equals(d.format('{ms}'), '000', 'Date#format | custom formats | ms');
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
  equals(d.format('{date}'), '5', 'Date#format | custom formats | date');
  equals(d.format('{day}'), '5', 'Date#format | custom formats | day');
  equals(d.format('{days}'), '5', 'Date#format | custom formats | days');
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
  equals(d.format('{year}'), '2010', 'Date#format | custom formats | year');
  equals(d.format('{Year}'), '2010', 'Date#format | custom formats | Year');
  equals(d.format('{t}'), 'p', 'Date#format | custom formats | t');
  equals(d.format('{T}'), 'P', 'Date#format | custom formats | T');
  equals(d.format('{tt}'), 'pm', 'Date#format | custom formats | tt');
  equals(d.format('{TT}'), 'PM', 'Date#format | custom formats | TT');
  equals(d.format('{ord}'), '5th', 'Date#format | custom formats | ord');


  d = new Date('August 5, 2010 04:03:02');

  equals(d.format('{min pad}'), '03', 'Date#format | custom formats | min pad');
  equals(d.format('{m pad}'), '03', 'Date#format | custom formats | m pad');
  equals(d.format('{d pad}'), '05', 'Date#format | custom formats | d pad');
  equals(d.format('{date pad}'), '05', 'Date#format | custom formats | days pad');
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
  equals(d.format('{yyyy}-{MM}-{dd}T{hh}:{mm}:{ss}'), '2010-08-05T04:03:02', 'Date#format | full formats | ISO8601 without timezone');
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

  equals(d.format(Date.INTERNATIONAL_TIME), '4:03:02', 'Date#format | constants | INTERNATIONAL_TIME');
  equals(d.format(Date.ISO8601_DATE), '2010-08-05', 'Date#format | constants | ISO8601_DATE');
  equals(d.format(Date.ISO8601_DATETIME), '2010-08-05T04:03:02.000'+isotzd, 'Date#format | constants | ISO8601_DATETIME');


  equals(d.format('INTERNATIONAL_TIME'), '4:03:02', 'Date#format | string constants | INTERNATIONAL_TIME');
  equals(d.format('ISO8601_DATE'), '2010-08-05', 'Date#format | string constants | ISO8601_DATE');
  equals(d.format('ISO8601_DATETIME'), '2010-08-05T04:03:02.000'+isotzd, 'Date#format | constants | ISO8601_DATETIME');

  var iso = d.getUTCFullYear()+'-'+(d.getUTCMonth()+1).pad(2)+'-'+d.getUTCDate().pad(2)+'T'+d.getUTCHours().pad(2)+':'+d.getUTCMinutes().pad(2)+':'+d.getUTCSeconds().pad(2)+'.'+d.getUTCMilliseconds().pad(3)+'Z';

  equals(d.toUTC().format(Date.ISO8601_DATETIME), iso, 'Date#format | constants | ISO8601_DATETIME UTC HOLY');
  equals(d.toUTC().format(Date.ISO8601), iso, 'Date#format | constants | ISO8601 UTC');
  equals(d.toUTC().format('ISO8601_DATETIME'), iso, 'Date#format | string constants | ISO8601_DATETIME UTC');
  equals(d.toUTC().format('ISO8601'), iso, 'Date#format | string constants | ISO8601 UTC');


  var rfc1123 = getWeekday(d).to(3).capitalize()+', '+d.getDate().pad(2)+' '+getMonth(d).to(3).capitalize()+' '+d.getFullYear()+' '+d.getHours().pad(2)+':'+d.getMinutes().pad(2)+':'+d.getSeconds().pad(2)+' GMT'+d.getUTCOffset();
  var rfc1036 = getWeekday(d).capitalize()+', '+d.getDate().pad(2)+'-'+getMonth(d).to(3).capitalize()+'-'+d.getFullYear().toString().last(2)+' '+d.getHours().pad(2)+':'+d.getMinutes().pad(2)+':'+d.getSeconds().pad(2)+' GMT'+d.getUTCOffset();
  equals(d.format(Date.RFC1123), rfc1123, 'Date#format | constants | RFC1123');
  equals(d.format(Date.RFC1036), rfc1036, 'Date#format | constants | RFC1036');
  equals(d.format('RFC1123'), rfc1123, 'Date#format | string constants | RFC1123');
  equals(d.format('RFC1036'), rfc1036, 'Date#format | string constants | RFC1036');


  rfc1123 = getWeekday(d,true).to(3).capitalize()+', '+d.getUTCDate().pad(2)+' '+getMonth(d,true).to(3).capitalize()+' '+d.getUTCFullYear()+' '+d.getUTCHours().pad(2)+':'+d.getUTCMinutes().pad(2)+':'+d.getUTCSeconds().pad(2)+' GMT+0000';
  rfc1036 = getWeekday(d,true).capitalize()+', '+d.getUTCDate().pad(2)+'-'+getMonth(d,true).to(3).capitalize()+'-'+d.getUTCFullYear().toString().last(2)+' '+d.getUTCHours().pad(2)+':'+d.getUTCMinutes().pad(2)+':'+d.getUTCSeconds().pad(2)+' GMT+0000';
  equals(d.toUTC().format('RFC1123'), rfc1123, 'Date#format | string constants | RFC1123 UTC');
  equals(d.toUTC().format('RFC1036'), rfc1036, 'Date#format | string constants | RFC1036 UTC');


  equals(Date.create('totally invalid').format(), 'Invalid Date', 'Date#format | invalid');
  equals(Date.create('totally invalid').format(Date.ISO8601_DATETIME), 'Invalid Date', 'Date#format | invalid');



  // ISO format

  equals(d.toISOString(), d.toUTC().format(Date.ISO8601_DATETIME), 'Date#toISOString is an alias for the ISO8601_DATETIME format in UTC');
  equals(d.iso(), d.toUTC().format(Date.ISO8601_DATETIME), 'Date#iso is an alias for the ISO8601_DATETIME format in UTC');




  // relative time formatting

  equals(Date.create().format('relative'), '1 second ago', 'Date#format | relative | now');
  equals(Date.create('234 milliseconds ago').format('relative'), '1 second ago', 'Date#format | relative | 234 milliseconds');
  equals(Date.create('6234 milliseconds ago').format('relative'), '6 seconds ago', 'Date#format | relative | 6 milliseconds');
  equals(Date.create('6 seconds ago').format('relative'), '6 seconds ago', 'Date#format | relative | 6 seconds');
  equals(Date.create('360 seconds ago').format('relative'), '6 minutes ago', 'Date#format | relative | 360 seconds');
  equals(Date.create('360 minutes ago').format('relative'), '6 hours ago', 'Date#format | relative | minutes');
  equals(Date.create('360 hours ago').format('relative'), '2 weeks ago', 'Date#format | relative | hours');
  equals(Date.create('360 days ago').format('relative'), '11 months ago', 'Date#format | relative | days');
  equals(Date.create('360 weeks ago').format('relative'), '6 years ago', 'Date#format | relative | weeks');
  equals(Date.create('360 months ago').format('relative'), '30 years ago', 'Date#format | relative | months');
  equals(Date.create('360 years ago').format('relative'), '360 years ago', 'Date#format | relative | years');
  equals(Date.create('12 months ago').format('relative'), '1 year ago', 'Date#format | relative | 12 months ago');

  equals(Date.create('6234 milliseconds from now').format('relative'), '6 seconds from now', 'Date#format | relative future | 6 milliseconds');
  equals(Date.create('361 seconds from now').format('relative'), '6 minutes from now', 'Date#format | relative future | 360 seconds');
  equals(Date.create('361 minutes from now').format('relative'), '6 hours from now', 'Date#format | relative future | minutes');
  equals(Date.create('360 hours from now').format('relative'), '2 weeks from now', 'Date#format | relative future | hours');
  equals(Date.create('360 days from now').format('relative'), '11 months from now', 'Date#format | relative future | days');
  equals(Date.create('360 weeks from now').format('relative'), '6 years from now', 'Date#format | relative future | weeks');
  equals(Date.create('360 months from now').format('relative'), '30 years from now', 'Date#format | relative future | months');
  equals(Date.create('360 years from now').format('relative'), '360 years from now', 'Date#format | relative future | years');
  equals(Date.create('13 months from now').format('relative'), '1 year from now', 'Date#format | relative future | 12 months ago');


  var dyn = function(value, unit, ms, dir){
    if(ms > (1).year()){
      return '{Month} {date}, {year}';
    } else {
      return 'relative';
    }
  }

  equals(Date.create('5 minutes ago').format(dyn), '5 minutes ago', 'Date#format | relative fn | 5 minutes should stay relative');
  equals(Date.create('13 months ago').format(dyn), Date.create('13 months ago').format('{Month} {date}, {year}'), 'Date#format | relative fn | higher reverts to absolute');

  // globalize system with plurals

  var strings = {
    second: '秒',
    seconds: '秒達',
    minute: '分',
    minutes: '分達',
    hour: '時間',
    hours: '時間達',
    day: '日',
    days: '日達',
    week: '週間',
    weeks: '週間達',
    month: '月',
    months: '月達',
    year: '年',
    years: '年達'
  }

  dyn = function(value, unit, ms, dir){
    equals(value, 5, 'Date#format | relative fn | 5 minutes ago | value is the closest relevant value');
    equals(unit, 'minutes', 'Date#format | relative fn | 5 minutes ago | unit is the closest relevant unit');
    equalsWithMargin(ms, 300000, 5, 'Date#format | relative fn | 5 minutes ago | ms is the offset in ms');
    equals(dir, -1, 'Date#format | relative fn | 5 minutes ago | dir indicates the offset from "now", negative if in the past');
    return value + strings[unit] + (dir < 0 ? '前' : '後');
  }

  equals(Date.create('5 minutes ago').format(dyn), '5分達前', 'Date#format | relative fn | 5 minutes ago');


  dyn = function(value, unit, ms, dir){
    equals(value, 1, 'Date#format | relative fn | 1 minute from now | value is the closest relevant value');
    equals(unit, 'minute', 'Date#format | relative fn | 1 minute from now | unit is the closest relevant unit');
    equalsWithMargin(ms, 61000, 5, 'Date#format | relative fn | 1 minute from now | ms is the offset in ms');
    equals(dir, 1, 'Date#format | relative fn | 1 minute from now | dir indicates the offset from "now", negative if in the past');
    return value + strings[unit] + (dir < 0 ? '前' : '後');
  }

  equals(Date.create('61 seconds from now').format(dyn), '1分後', 'Date#format | relative fn | 1 minute from now');



  dyn = function(value, unit, ms, dir){
    equals(value, 4, 'Date#format | relative fn | 4 hours ago | value is the closest relevant value');
    equals(unit, 'hours', 'Date#format | relative fn | 4 hours ago | unit is the closest relevant unit');
    equalsWithMargin(ms, 14400000, 5, 'Date#format | relative fn | 4 hours ago | ms is the offset in ms');
    equals(dir, -1, 'Date#format | relative fn | 4 hours ago | dir indicates the offset from "now", negative if in the past');
    return value + strings[unit] + (dir < 0 ? '前' : '後');
  }

  equals(Date.create('240 minutes ago').format(dyn), '4時間達前', 'Date#format | relative fn | 4 hours ago');

  Date.create('223 milliseconds ago').format(function(value, unit){
    equalsWithMargin(value, 223, 5, 'Date format | relative fn | still passes < 1 second');
    equals(unit, 'milliseconds', 'Date format | relative fn | still passes "millisecond"');
  });

  equals(Date.create('300 minutes ago').format(function(){}), '5 hours ago', 'Date#format | function that returns undefined defaults to "relative"');


  equals(Date.create('6234 milliseconds ago').relative(), '6 seconds ago', 'Date#relative | relative | 6 milliseconds');
  equals(Date.create('6 seconds ago').relative(), '6 seconds ago', 'Date#relative | relative | 6 seconds');
  equals(Date.create('360 seconds ago').relative(), '6 minutes ago', 'Date#relative | relative | 360 seconds');
  equals(Date.create('360 minutes ago').relative(), '6 hours ago', 'Date#relative | relative | minutes');
  equals(Date.create('360 hours ago').relative(), '2 weeks ago', 'Date#relative | relative | hours');
  equals(Date.create('360 days ago').relative(), '11 months ago', 'Date#relative | relative | days');
  equals(Date.create('360 weeks ago').relative(), '6 years ago', 'Date#relative | relative | weeks');
  equals(Date.create('360 months ago').relative(), '30 years ago', 'Date#relative | relative | months');
  equals(Date.create('360 years ago').relative(), '360 years ago', 'Date#relative | relative | years');
  equals(Date.create('12 months ago').relative(), '1 year ago', 'Date#relative | relative | 12 months ago');

  equals(Date.create('6234 milliseconds from now').relative(), '6 seconds from now', 'Date#relative | relative future | 6 milliseconds');
  equals(Date.create('361 seconds from now').relative(), '6 minutes from now', 'Date#relative | relative future | 360 seconds');
  equals(Date.create('361 minutes from now').relative(), '6 hours from now', 'Date#relative | relative future | minutes');
  equals(Date.create('360 hours from now').relative(), '2 weeks from now', 'Date#relative | relative future | hours');
  equals(Date.create('360 days from now').relative(), '11 months from now', 'Date#relative | relative future | days');
  equals(Date.create('360 weeks from now').relative(), '6 years from now', 'Date#relative | relative future | weeks');
  equals(Date.create('360 months from now').relative(), '30 years from now', 'Date#relative | relative future | months');
  equals(Date.create('360 years from now').relative(), '360 years from now', 'Date#relative | relative future | years');
  equals(Date.create('13 months from now').relative(), '1 year from now', 'Date#relative | relative future | 12 months ago');


  equals(Date.create('13 months from now').relative(function(value, unit){
    return value + ' ' + unit;
  }), '1 year', 'Date#relative | relative future | 12 months ago');


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
  equals(d.is(1281015902542 + (offset * 60 * 1000)), true, 'Date#is | timestamps also accepted');

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

  equals(new Date(1970, 0, 1, 0, -staticWinterTimezoneOffset).is(0), true, 'Date#is | Accepts numbers');



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


  equals(Date.create('2008').isLeapYear(), true, 'Date#leapYear | 2008');
  equals(Date.create('2009').isLeapYear(), false, 'Date#leapYear | 2009');
  equals(Date.create('2010').isLeapYear(), false, 'Date#leapYear | 2010');
  equals(Date.create('2011').isLeapYear(), false, 'Date#leapYear | 2011');
  equals(Date.create('2012').isLeapYear(), true, 'Date#leapYear | 2012');
  equals(Date.create('2016').isLeapYear(), true, 'Date#leapYear | 2016');
  equals(Date.create('2020').isLeapYear(), true, 'Date#leapYear | 2020');
  equals(Date.create('2021').isLeapYear(), false, 'Date#leapYear | 2021');
  equals(Date.create('1600').isLeapYear(), true, 'Date#leapYear | 1600');
  equals(Date.create('1700').isLeapYear(), false, 'Date#leapYear | 1700');
  equals(Date.create('1800').isLeapYear(), false, 'Date#leapYear | 1800');
  equals(Date.create('1900').isLeapYear(), false, 'Date#leapYear | 1900');
  equals(Date.create('2000').isLeapYear(), true, 'Date#leapYear | 2000');


  d = new Date(2010,7,5,13,45,2,542);

  equals(d.getWeek(), 31, 'Date#getWeek | basic');
  equals(dst(d).getUTCWeek(), staticSummerTimezoneOffset > 615 ? 32 : 31, 'Date#getUTCWeek | basic');

  equals(new Date(2010, 0, 1).getWeek(), 1, 'Date#getWeek | January 1st');
  equals(new Date(2010, 0, 1).getUTCWeek(), staticWinterTimezoneOffset >= 0 ? 1 : 53, 'Date#getUTCWeek | January 1st UTC is actually 2009');
  equals(new Date(2010, 0, 6).getWeek(), 1, 'Date#getWeek | January 6th');
  equals(new Date(2010, 0, 6).getUTCWeek(), 1, 'Date#getUTCWeek | January 6th');
  equals(new Date(2010, 0, 7).getWeek(), 1, 'Date#getWeek | January 7th');
  equals(new Date(2010, 0, 7).getUTCWeek(), 1, 'Date#getUTCWeek | January 7th');
  equals(new Date(2010, 0, 7, 23, 59, 59, 999).getWeek(), 1, 'Date#getWeek | January 7th 23:59:59.999');
  equals(new Date(2010, 0, 7, 23, 59, 59, 999).getUTCWeek(), staticWinterTimezoneOffset > 0 ? 2 : 1, 'Date#getUTCWeek | January 7th 23:59:59.999');
  equals(new Date(2010, 0, 8).getWeek(), 2, 'Date#getWeek | January 8th');
  equals(new Date(2010, 0, 8).getUTCWeek(), staticWinterTimezoneOffset >= 0 ? 2 : 1, 'Date#getUTCWeek | January 8th');
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



  equals(new Date(2010,7,5,13,45,2,543).millisecondsFromNow(d), 1, 'Date#millisecondsFromNow | FromNow alias | milliseconds');
  equals(new Date(2010,7,5,13,45,2,541).millisecondsAgo(d), 1, 'Date#millisecondsAgo | from now alias | milliseconds');
  equals(new Date(2010,7,5,13,45,3,542).secondsFromNow(d), 1, 'Date#secondsFromNow | FromNow alias | seconds');
  equals(new Date(2010,7,5,13,45,1,542).secondsAgo(d), 1, 'Date#secondsAgo | Ago alias | seconds');
  equals(new Date(2010,7,5,13,46,2,542).minutesFromNow(d), 1, 'Date#minutesFromNow | FromNow alias | minutes');
  equals(new Date(2010,7,5,13,44,2,542).minutesAgo(d), 1, 'Date#minutesAgo | Ago alias | minutes');
  equals(new Date(2010,7,5,14,45,2,542).hoursFromNow(d), 1, 'Date#hoursFromNow | FromNow alias | hours');
  equals(new Date(2010,7,5,12,45,2,542).hoursAgo(d), 1, 'Date#hoursAgo | Ago alias | hours');
  equals(new Date(2010,7,6,13,45,2,542).daysFromNow(d), 1, 'Date#daysFromNow | FromNow alias | days');
  equals(new Date(2010,7,4,13,45,2,542).daysAgo(d), 1, 'Date#daysAgo | Ago alias | days');
  equals(new Date(2010,7,12,13,45,2,542).weeksFromNow(d), 1, 'Date#weeksFromNow | FromNow alias | weeks');
  equals(new Date(2010,6,29,13,45,2,542).weeksAgo(d), 1, 'Date#weeksAgo | Ago alias | weeks');
  equals(new Date(2010,8,5,13,45,2,542).monthsFromNow(d), 1, 'Date#monthsFromNow | FromNow alias | months');
  equals(new Date(2010,6,5,13,45,2,542).monthsAgo(d), 1, 'Date#monthsAgo | Ago alias | months');
  equals(new Date(2011,7,5,13,45,2,542).yearsFromNow(d), 1, 'Date#yearsFromNow | FromNow alias | years');
  equals(new Date(2009,7,5,13,45,2,542).yearsAgo(d), 1, 'Date#yearsAgo | Ago alias | years');


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
  var since, until;

  // I'm occasionally seeing some REALLY big lags with IE here (up to 500ms), so giving a 1s buffer here.
  //
  var msSince = d.millisecondsSince('last week');
  var msUntil = d.millisecondsUntil('last week');
  var actualMsSince = offset.round();
  var actualMsUntil = -offset.round();

  equals((msSince <= actualMsSince + 1000) && (msSince >= actualMsSince - 1000), true, 'Date#millisecondsSince | milliseconds since last week');
  equals((msUntil <= actualMsUntil + 1000) && (msUntil >= actualMsUntil - 1000), true, 'Date#millisecondsUntil | milliseconds until last week');

  var secSince = d.secondsSince('last week');
  var secUntil = d.secondsUntil('last week');
  var actualSecSince = (offset / 1000).round();
  var actualSecUntil = (-offset / 1000).round();

  equals((secSince <= actualSecSince + 1) && (secSince >= actualSecSince - 1), true, 'Date#secondsSince | seconds since last week');
  equals((secUntil <= actualSecUntil + 1) && (secUntil >= actualSecUntil - 1), true, 'Date#secondsUntil | seconds until last week');

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


  dateEquals(new Date(d).beginningOfDay(false), new Date(2012, 1, 29, 0, 0, 0), 'Date#beginningOfDay | no time reset on day level makes no sense');
  dateEquals(new Date(d).beginningOfWeek(false), new Date(2012, 1, 26, 22, 15, 42), 'Date#beginningOfWeek | do not reset time | February 29, 2012');
  dateEquals(new Date(d).beginningOfMonth(false), new Date(2012, 1, 1, 22, 15, 42), 'Date#beginningOfMonth | do not reset time | February 29, 2012');
  dateEquals(new Date(d).beginningOfYear(false), new Date(2012, 0, 1, 22, 15, 42), 'Date#beginningOfYear | do not reset time | February 29, 2012');

  dateEquals(new Date(d).endOfDay(false), new Date(2012, 1, 29, 23, 59, 59, 999), 'Date#endOfDay | no time reset on day level makes no sense');
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

  dateEquals(d.toUTC(), dUTC, 'Date#utc');




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

  equals(getRelativeDate(null, null, 7).isLastWeek(), false, 'Date#isLastWeek | next week');
  equals(getRelativeDate(null, null, 7).isThisWeek(), false, 'Date#isThisWeek | next week');
  equals(getRelativeDate(null, null, 7).isNextWeek(), true, 'Date#isNextWeek | next week');

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
  equals(new Date(1998,2).isBetween('January, 1998', 'February, 1998'), false, 'Date#isBetween | string | March, 1998 is not between January, 1998 and February, 1998');

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



  dateEquals(Date.create().rewind((1).day()), new Date(new Date().getTime() - 86400000), 'Date#rewind | can rewind milliseconds');
  dateEquals(Date.create().advance((1).day()), new Date(new Date().getTime() + 86400000), 'Date#advance | can advance milliseconds');

  equals(Date.create().beginningOfWeek().isLastWeek(), false, 'Date#isLastWeek | the beginning of this week is not last week');

  dateEquals(Date.create().set(0), new Date(0), 'Date#set | handles timestamps');



  var date1 = Date.create('July 4th, 1776');
  var date2 = date1.clone().beginningOfYear();

  equals(date2.getMonth(), 0, 'Date#clone | cloned element is reset to January');
  equals(date1.getMonth(), 6, 'Date#clone | source element is reset to unchanged');

  date1 = Date.create('invalid');
  date2 = date1.clone();

  equals(date1.isValid(), false, 'Date#clone | source element is invalid');
  equals(date2.isValid(), false, 'Date#clone | cloned element is also invalid');

});


test('RegExp', function () {

  var r, n;

  equals(RegExp.escape('test regexp'), 'test regexp', 'RegExp#escape');
  equals(RegExp.escape('test reg|exp'), 'test reg\\|exp', 'RegExp#escape');
  equals(RegExp.escape('hey there (budday)'), 'hey there \\(budday\\)', 'RegExp#escape');
  equals(RegExp.escape('what a day...'), 'what a day\\.\\.\\.', 'RegExp#escape');
  equals(RegExp.escape('.'), '\\.', 'RegExp#escape');
  equals(RegExp.escape('*.+[]{}()?|/'), '\\*\\.\\+\\[\\]\\{\\}\\(\\)\\?\\|\\/', 'RegExp#escape');

  r = /foobar/;
  n = r.setFlags('gim');

  equals(n.global, true, 'RegExp#setFlags');
  equals(n.ignoreCase, true, 'RegExp#setFlags');
  equals(n.multiline, true, 'RegExp#setFlags');

  equals(r.global, false, 'RegExp#setFlags | initial regex is untouched');
  equals(r.ignoreCase, false, 'RegExp#setFlags | initial regex is untouched');
  equals(r.multiline, false, 'RegExp#setFlags | initial regex is untouched');

  n = r.addFlag('g');

  equals(n.global, true, 'RegExp#addFlag');
  equals(n.ignoreCase, false, 'RegExp#addFlag');
  equals(n.multiline, false, 'RegExp#addFlag');

  equals(r.global, false, 'RegExp#addFlag | initial regex is untouched');
  equals(r.ignoreCase, false, 'RegExp#addFlag | initial regex is untouched');
  equals(r.multiline, false, 'RegExp#addFlag | initial regex is untouched');


  r = /foobar/gim;
  n = r.removeFlag('g');

  equals(n.global, false, 'RegExp#removeFlag');
  equals(n.ignoreCase, true, 'RegExp#removeFlag');
  equals(n.multiline, true, 'RegExp#removeFlag');

  equals(r.global, true, 'RegExp#removeFlag | initial regex is untouched');
  equals(r.ignoreCase, true, 'RegExp#removeFlag | initial regex is untouched');
  equals(r.multiline, true, 'RegExp#removeFlag | initial regex is untouched');
});

test('Object', function () {

  var count,result;
  var Person = function(){};
  var p = new Person();

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
  equals(Object.isObject(p), false, 'Object#isObject | {}');

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


  equals(({}).keys, undefined, 'Object | native objects are not wrapped by default');
  same(Object.create(), Object.create({}), 'Object#create | null argument same as empty object');

  var keys,values;
  var d = new Date();
  var obj = Object.create({
    number: 3,
    person: 'jim',
    date: d
  });


  // Note here that the need for this complicated syntax is that Prototype's Object.keys method
  // is incorrectly reporting keys up the prototype chain.
  var objectPrototypeMethods = ['keys','values','each','merge','clone','isEmpty','equals'];
  var objectPrototypeMethodReferences = objectPrototypeMethods.map(function(m){ return Object.create()[m]; });

  keys = ['number','person','date'];
  values = [3,'jim',d];
  sameWithException(obj.keys(), keys, { prototype: keys.concat(objectPrototypeMethods) }, "Object#keys | returns object's keys", true);
  count = 0;
  obj.keys(function(key){
    equal(key, keys[count], 'Object#keys | accepts a block');
    count++;
  });

  equal(count, 3, 'Object#keys | accepts a block | iterated properly');

  sameWithException(Object.create().keys(), [], { prototype: objectPrototypeMethods }, 'Object#keys | empty object', true);
  sameWithException(Object.keys(Object.create()), [], { prototype: objectPrototypeMethods }, 'Object#keys | empty object', true);

  keys = ['number','person','date'];
  values = [3,'jim',d];
  sameWithException(Object.keys(obj), keys, { prototype: keys.concat(objectPrototypeMethods) }, "Object.keys | returns object's keys", true);
  count = 0;
  Object.keys(obj, function(key){
    equal(key, keys[count], 'Object.keys | accepts a block');
    count++;
  });
  equal(count, 3, 'Object.keys | accepts a block | iterated properly');



  var strippedValues;

  strippedValues = obj.values().remove(function(m){ return typeof m == 'function'; });
  sameWithException(strippedValues, values, { prototype: values }, "Object#values | returns object's values", true);
  count = 0;
  obj.values(function(value){
    equal(value, values[count], 'Object#values | accepts a block');
    count++;
  });

  equals(count, 3, 'Object#values | accepts a block | iterated properly');

  strippedValues = Object.values(obj).remove(function(m){ return typeof m == 'function'; });
  sameWithException(strippedValues, values, { prototype: values }, "Object.values | returns object's values", true);
  count = 0;
  Object.values(obj, function(value){
    equal(value, values[count], 'Object.values | accepts a block');
    count++;
  });
  equals(count, 3, 'Object.values | accepts a block | iterated properly');

  strippedValues = Object.create().values().remove(function(m){ return typeof m == 'function'; });
  sameWithException(strippedValues, [], { prototype: [] }, 'Object#values | empty object', true);

  strippedValues = Object.values(Object.create()).remove(function(m){ return typeof m == 'function'; });
  sameWithException(strippedValues, [], { prototype: [] }, 'Object#values | empty object', true);




  count = 0;
  result = obj.each(function(key, value, o){
    equalsWithException(key, keys[count], { mootools: values[count] }, 'Object#each | accepts a block | key is first param');
    equalsWithException(value, values[count], { mootools: keys[count] }, 'Object#each | accepts a block | value is second param');
    same(o, obj, 'Object#each | accepts a block | object is third param');
    count++;
  });
  equal(count, 3, 'Object#each | accepts a block | iterated properly');
  equalsWithException(result, obj, { mootools: undefined }, 'Object#each | accepts a block | result should equal object passed in');


  count = 0;
  result = Object.each(obj, function(key, value, o){
    equalsWithException(key, keys[count], { mootools: values[count] }, 'Object.each | accepts a block');
    equalsWithException(value, values[count], { mootools: keys[count] }, 'Object.each | accepts a block');
    same(o, obj, 'Object.each | accepts a block | object is third param');
    count++;
  });
  equal(count, 3, 'Object.each | accepts a block | iterated properly');
  equalsWithException(result, obj, { mootools: undefined }, 'Object.each | accepts a block | result should equal object passed in');


  same(Object.merge({ foo: 'bar' }, { broken: 'wear' }), { foo: 'bar', broken: 'wear' }, 'Object.merge | basic');
  same(Object.merge({ foo: 'bar' }, { broken: 'wear' }, { jumpy: 'jump' }, { fire: 'breath'}), { foo: 'bar', broken: 'wear', jumpy: 'jump', fire: 'breath' }, 'Object.merge | merge 3');
  same(Object.merge({ foo: 'bar' }, 'aha'), { foo: 'bar', 0: 'a', 1: 'h', 2: 'a'  }, 'Object.merge | merge string');
  same(Object.merge({ foo: 'bar' }, null), { foo: 'bar' }, 'Object.merge | merge null');
  same(Object.merge({}, {}, {}), {}, 'Object.merge | merge multi empty');


  sameWithException(
    Object.merge({ foo: 'bar' }, 8),
    { foo: 'bar' },
    { mootools: (function(){ var s = new Number(8); s.foo = 'bar'; return s; })() },
    'Object.merge | merge number');


  sameWithException(
    Object.merge({ foo: 'bar' }, 'wear', 8, null),
    { foo: 'bar', 0: 'w', 1: 'e', 2: 'a', 3: 'r' },
    { mootools: { foo: 'bar', wear: 8 } },
    'Object.merge | merge multi invalid');



  same(Object.create({ foo: 'bar' }).merge({ broken: 'wear' }), { foo: 'bar', broken: 'wear' }, 'Object#merge | basic');
  same(Object.create({ foo: 'bar' }).merge({ broken: 'wear' }, { jumpy: 'jump' }, { fire: 'breath'}), { foo: 'bar', broken: 'wear', jumpy: 'jump', fire: 'breath' }, 'Object#merge | merge 3');
  same(Object.create({ foo: 'bar' }).merge('aha'), { foo: 'bar', 0: 'a', 1: 'h', 2: 'a'  }, 'Object#merge | merge string');
  same(Object.create({ foo: 'bar' }).merge(null), { foo: 'bar' }, 'Object#merge | merge null');
  same(Object.create({}).merge({}, {}, {}), {}, 'Object#merge | merge multi empty');

  sameWithException(
    Object.create({ foo: 'bar' }).merge('wear', 8, null),
    { foo: 'bar', 0: 'w', 1: 'e', 2: 'a', 3: 'r' },
    { mootools: { foo: 'bar', wear: 8 } },
    'Object#merge | merge multi invalid');


  same(Object.clone({ foo: 'bar' }), { foo: 'bar' }, 'Object.clone | basic clone');
  same(Object.clone({ foo: 'bar', broken: 1, wear: null }), { foo: 'bar', broken: 1, wear: null }, 'Object.clone | complex clone');
  same(Object.clone({ foo: { broken: 'wear' }}), { foo: { broken: 'wear' }}, 'Object.clone | deep clone');
  equals(Object.clone({ foo: 'bar', broken: 1, wear: /foo/ }) == { foo: 'bar', broken: 1, wear: /foo/ }, false, 'Object.clone | fully cloned');

  var obj1 = {
    broken: 'wear',
    foo: {
      jumpy: 'jump',
      bucket: {
        reverse: true
      }
    }
  }
  var obj2 = Object.clone(obj1);
  equals(obj1.foo.jumpy, 'jump', 'Object.clone | cloned object has nested attribute');
  obj1.foo.jumpy = 'hump';
  equals(obj1.foo.jumpy, 'hump', 'Object.clone | original object is modified');
  equalsWithException(obj2.foo.jumpy, 'jump', { prototype: 'hump' }, 'Object.clone | cloned object is not modified');

  obj1 = {
    foo: {
      bar: [1,2,3]
    }
  };
  obj2 = Object.clone(obj1);

  obj1.foo.bar = ['a','b','c'];
  same(obj1.foo.bar, ['a','b','c'], 'Object#clone | original object is modified');
  sameWithException(obj2.foo.bar, [1,2,3], { prototype: ['a','b','c'] }, 'Object#clone | cloned object is not modified');



  // Note here that the need for these complicated syntaxes is that both Prototype and Mootools' Object.clone is incorrectly
  // cloning properties in the prototype chain directly into the object itself.
  equalsWithException(deepEqualWithoutPrototyping(Object.create({ foo: 'bar' }).clone(), { foo: 'bar' }), true, { prototype: false, mootools: false }, 'Object#clone | basic clone');
  equalsWithException(deepEqualWithoutPrototyping(Object.create({ foo: 'bar', broken: 1, wear: null }).clone(), { foo: 'bar', broken: 1, wear: null }), true, { prototype: false, mootools: false }, 'Object#clone | complex clone');
  equalsWithException(deepEqualWithoutPrototyping(Object.create({ foo: { broken: 'wear' }}).clone(), { foo: { broken: 'wear' }}), true, { prototype: false, mootools: false }, 'Object#clone | deep clone');

  equals(Object.create({ foo: 'bar', broken: 1, wear: /foo/ }).clone() == { foo: 'bar', broken: 1, wear: /foo/ }, false, 'Object#clone | fully cloned');

  var obj1 = Object.create({
    broken: 'wear',
    foo: {
      jumpy: 'jump',
      bucket: {
        reverse: true
      }
    }
  });
  obj2 = obj1.clone();

  equals(obj1.foo.jumpy, 'jump', 'Object#clone | cloned object has nested attribute');
  obj1.foo.jumpy = 'hump';
  equals(obj1.foo.jumpy, 'hump', 'Object#clone | original object is modified');
  equalsWithException(obj2.foo.jumpy, 'jump', { prototype: 'hump' }, 'Object#clone | cloned object is not modified');

  var withPrototypes = ['broken','foo'].concat(objectPrototypeMethods).sort();
  sameWithException(obj2.keys().sort(), ['broken','foo'], { prototype: withPrototypes, mootools: withPrototypes }, 'Object#clone | cloned objects are themselves extended');

  obj1 = Object.create({
    foo: {
      bar: [1,2,3]
    }
  });
  obj2 = obj1.clone();

  obj1.foo.bar[1] = 'b';
  same(obj1.foo.bar, [1,'b',3], 'Object#clone | original object is modified');
  sameWithException(obj2.foo.bar, [1,2,3], { prototype: [1,'b',3] }, 'Object#clone | cloned object is not modified');

  equals(Object.isEmpty({}), true, 'Object.isEmpty | object is empty');
  equals(Object.isEmpty({ broken: 'wear' }), false, 'Object.isEmpty | object is not empty');

  equals(Object.create({}).isEmpty({}), true, 'Object#isEmpty | object is empty');
  equals(Object.create({ broken: 'wear' }).isEmpty(), false, 'Object#empty | object is not empty');

  equals(Object.equals({ broken: 'wear' }, { broken: 'wear' }), true, 'Object.equals | objects are equal');
  equals(Object.equals({ broken: 'wear' }, { broken: 'jumpy' }), false, 'Object.equals | objects are not equal');
  equals(Object.equals({}, {}), true, 'Object.equals | empty objects are equal');
  equals(Object.equals({}, { broken: 'wear' }), false, 'Object.equals | 1st empty');
  equals(Object.equals({ broken: 'wear' }, {}), false, 'Object.equals | 2nd empty');

  equals(Object.create({ broken: 'wear' }).equals({ broken: 'wear' }), true, 'Object#equals | objects are equal');
  equals(Object.create({ broken: 'wear' }).equals({ broken: 'jumpy' }), false, 'Object#equals | objects are not equal');
  equals(Object.create({}).equals({}), true, 'Object#equals | empty objects are equal');
  equals(Object.create({}).equals({ broken: 'wear' }), false, 'Object#equals | 1st empty');
  equals(Object.create({ broken: 'wear' }).equals({}), false, 'Object#equals | 2nd empty');



  // Enabling native object methods


  rememberObjectProtoypeMethods();

  Object.enableSugar();


  count = 0;
  same(({ foo: 'bar' }).keys(function(){ count++; }), ['foo'], 'Object#keys | Object.prototype');
  same(({ foo: 'bar' }).values(function(){ count++; }), ['bar'], 'Object#values | Object.prototype');
  ({ foo: 'bar' }).each(function(){ count++; });

  equals(count, 3, 'Object | Object.prototype should have correctly called all functions');

  equals(({}).isEmpty(), true, 'Object#empty | Object.prototype');
  equals(({ foo: 'bar' }).equals({ foo: 'bar' }), true, 'Object#equals | Object.prototype');
  same(({ foo: 'bar' }).merge({ moo: 'car' }), { foo: 'bar', moo: 'car' }, 'Object#merge | Object.prototype');

  obj1 = { foo: 'bar' };
  obj2 = obj1.clone();
  obj1.foo = 'mar';

  same(obj2, { foo: 'bar' }, 'Object#clone | Object.prototype');

  equals(([1,2,3]).isArray(), true, 'Object#isArray | Object.prototype');
  equals(([1,2,3]).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equals(([1,2,3]).isDate(), false, 'Object#isDate | Object.prototype');
  equals(([1,2,3]).isFunction(), false, 'Object#isFunction | Object.prototype');
  equals(([1,2,3]).isNumber(), false, 'Object#isNumber | Object.prototype');
  equals(([1,2,3]).isString(), false, 'Object#isString | Object.prototype');
  equals(([1,2,3]).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equals((true).isArray(), false, 'Object#isArray | Object.prototype');
  equals((true).isBoolean(), true, 'Object#isBoolean | Object.prototype');
  equals((true).isDate(), false, 'Object#isDate | Object.prototype');
  equals((true).isFunction(), false, 'Object#isFunction | Object.prototype');
  equals((true).isNumber(), false, 'Object#isNumber | Object.prototype');
  equals((true).isString(), false, 'Object#isString | Object.prototype');
  equals((true).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equals((new Date()).isArray(), false, 'Object#isArray | Object.prototype');
  equals((new Date()).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equals((new Date()).isDate(), true, 'Object#isDate | Object.prototype');
  equals((new Date()).isFunction(), false, 'Object#isFunction | Object.prototype');
  equals((new Date()).isNumber(), false, 'Object#isNumber | Object.prototype');
  equals((new Date()).isString(), false, 'Object#isString | Object.prototype');
  equals((new Date()).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equals((function(){}).isArray(), false, 'Object#isArray | Object.prototype');
  equals((function(){}).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equals((function(){}).isDate(), false, 'Object#isDate | Object.prototype');
  equals((function(){}).isFunction(), true, 'Object#isFunction | Object.prototype');
  equals((function(){}).isNumber(), false, 'Object#isNumber | Object.prototype');
  equals((function(){}).isString(), false, 'Object#isString | Object.prototype');
  equals((function(){}).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equals((3).isArray(), false, 'Object#isArray | Object.prototype');
  equals((3).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equals((3).isDate(), false, 'Object#isDate | Object.prototype');
  equals((3).isFunction(), false, 'Object#isFunction | Object.prototype');
  equals((3).isNumber(), true, 'Object#isNumber | Object.prototype');
  equals((3).isString(), false, 'Object#isString | Object.prototype');
  equals((3).isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equals(('wasabi').isArray(), false, 'Object#isArray | Object.prototype');
  equals(('wasabi').isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equals(('wasabi').isDate(), false, 'Object#isDate | Object.prototype');
  equals(('wasabi').isFunction(), false, 'Object#isFunction | Object.prototype');
  equals(('wasabi').isNumber(), false, 'Object#isNumber | Object.prototype');
  equals(('wasabi').isString(), true, 'Object#isString | Object.prototype');
  equals(('wasabi').isRegExp(), false, 'Object#isRegExp | Object.prototype');
  equals((/wasabi/).isArray(), false, 'Object#isArray | Object.prototype');
  equals((/wasabi/).isBoolean(), false, 'Object#isBoolean | Object.prototype');
  equals((/wasabi/).isDate(), false, 'Object#isDate | Object.prototype');
  equals((/wasabi/).isFunction(), false, 'Object#isFunction | Object.prototype');
  equals((/wasabi/).isNumber(), false, 'Object#isNumber | Object.prototype');
  equals((/wasabi/).isString(), false, 'Object#isString | Object.prototype');
  equals((/wasabi/).isRegExp(), true, 'Object#isRegExp | Object.prototype');

  restoreObjectPrototypeMethods();

});



test('Function', function () {

  var bound,obj,result;

  obj = { foo: 'bar' };

  bound = (function(num, bool, str, fourth, fifth){
    equals(this === obj, true, 'Function#bind | Bound object is strictly equal');
    equals(num, 1, 'Function#bind | first parameter');
    equalsWithException(bool, true, { mootools: undefined }, 'Function#bind | second parameter');
    equalsWithException(str, 'wasabi', { mootools: undefined }, 'Function#bind | third parameter');
    equalsWithException(fourth, 'fourth', { mootools: undefined }, 'Function#bind | fourth parameter');
    equalsWithException(fifth, 'fifth', { mootools: undefined }, 'Function#bind | fifth parameter');
    return 'howdy';
  }).bind(obj, 1, true, 'wasabi');

  result = bound('fourth','fifth');
  equals(result, 'howdy', 'Function#bind | result is correctly returned');

  (function(first){
    same(Array.prototype.slice.call(arguments), [], 'Function#bind | arguments array is empty');
    equals(first, undefined, 'Function#bind | first argument is undefined');
  }).bind('foo')();

  bound = (function(num, bool, str){}).bind('wasabi', 'moo')();


  var delayedFunction,delayReturn;


  var delayedFunction = function(one, two){
    equalsWithException(one, 'one', { mootools: 'two' }, 'Function#delay | first parameter');
    equalsWithException(two, 'two', { mootools: undefined }, 'Function#delay | second parameter');
    equalsWithException(shouldBeFalse, false, { prototype: true, mootools: true }, 'Function#delay | cancel is working');
    start();
  };

  delayReturn = delayedFunction.delay(20, 'one', 'two');
  equals(typeof delayReturn, 'number', 'Function#delay | returns the timeout ID');

  var shouldBeFalse = false;
  delayedFunction = function(){
    shouldBeFalse = true;
  };

  delayReturn = delayedFunction.delay(5);
  delayedFunction.cancel();


  bound = (function(num, bool, str){}).delay(1, 'wasabi');

  bound = (function(one, two){
    equals(this, 'poo', 'Function#defer | bound object');
    equalsWithException(one, 'one', { mootools: 'two' }, 'Function#defer | first parameter');
    equalsWithException(two, 'two', { mootools: undefined }, 'Function#defer | second parameter');
  }).bind('poo').defer('one', 'two');

  bound = (function(num, bool, str){}).defer('three');


  // Properly unit testing the exact throttle of Function.lazy will probably be a bitch...
  // Will have to rethink strategy here.
  var lazyCounter = 0;
  var lazy = Function.lazy(function(){
    lazyCounter++;
  });
  lazy();
  lazy();
  lazy();
  equals(lazyCounter, 0, "Function.lazy | hasn't executed yet");
  setTimeout(function(){
    equals(lazyCounter, 3, 'Function.lazy | was executed by 10ms');
  }, 10);


  stop();



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

