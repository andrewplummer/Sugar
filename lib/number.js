
  /***
   * Number module
   *
   ***/

  var round = function(val, precision, method) {
    var fn = Math[method];
    var multiplier = Math.pow(10, Math.abs(precision || 0));
    if(precision < 0) multiplier = 1 / multiplier;
    return fn(val * multiplier) / multiplier;
  }


  /***
   * @method milliseconds()
   * @returns Number
   * @short Takes the number as milliseconds and returns milliseconds.
   * @extra This method is included for completeness and effectively just rounds the number. %millisecond% is provided as an alias.
   * @example
   *
   *   (5).milliseconds() -> 5
   *   (1).millisecond() -> 1
   *
   ***
   * @method millisecondsBefore([d])
   * @returns Date
   * @short Returns a date <n> milliseconds before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %millisecondsAgo% is provided as an alias. Also accepts %millisecondBefore% and %millisecondAgo%.
   * @example
   *
   *   (5).millisecondsBefore('3:00pm') -> "5 milliseconds before 3pm"
   *   (5).millisecondsAgo()            -> "5 milliseconds ago"
   *
   ***
   * @method millisecondsAfter([d])
   * @returns Date
   * @short Returns a date <n> milliseconds after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %millisecondsFromNow% is provided as an alias. Also accepts %millisecondAfter% and %millisecondFromNow%.
   * @example
   *
   *   (5).millisecondsAfter('3:00pm') -> "5 milliseconds after 3pm"
   *   (5).millisecondsFromNow()       -> "5 milliseconds from now"
   *
   ***
   * @method millisecondsAgo()
   * @alias millisecondsBefore
   *
   ***
   * @method millisecondsFromNow()
   * @alias millisecondsAfter
   *
   ***
   * @method seconds()
   * @returns Number
   * @short Takes the number as seconds and returns milliseconds.
   * @extra %second% is provided as an alias.
   * @example
   *
   *   (5).seconds() -> 5000
   *   (1).second()  -> 1000
   *
   ***
   * @method secondsBefore([d])
   * @returns Date
   * @short Returns a date <n> seconds before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %secondsAgo% is provided as an alias. Also accepts %secondBefore% and %secondAgo%.
   * @example
   *
   *   (5).secondsBefore('3:00pm') -> "5 seconds before 3pm"
   *   (5).secondsAgo()            -> "5 seconds ago"
   *
   ***
   * @method secondsAfter([d])
   * @returns Date
   * @short Returns a date <n> seconds after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %secondsFromNow% is provided as an alias. Also accepts %secondAfter% and %secondFromNow%.
   * @example
   *
   *   (5).secondsAfter('3:00pm') -> "5 seconds after 3pm"
   *   (5).secondsFromNow()       -> "5 seconds from now"
   *
   ***
   * @method secondsAgo()
   * @alias secondsBefore
   *
   ***
   * @method secondsFromNow()
   * @alias secondsAfter
   *
   ***
   * @method minutes()
   * @returns Number
   * @short Takes the number as minutes and returns milliseconds.
   * @extra %minute% is provided as an alias.
   * @example
   *
   *   (5).minutes() -> 300000
   *   (1).minute()  -> 60000
   *
   ***
   * @method minutesBefore([d])
   * @returns Date
   * @short Returns a date <n> minutes before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %minutesAgo% is provided as an alias. Also accepts %minuteBefore% and %minuteAgo%.
   * @example
   *
   *   (5).minutesBefore('3:00pm') -> "5 minutes before 3pm"
   *   (5).minutesAgo()            -> "5 minutes ago"
   *
   ***
   * @method minutesAfter([d])
   * @returns Date
   * @short Returns a date <n> minutes after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %minutesFromNow% is provided as an alias. Also accepts %minuteAfter% and %minuteFromNow%.
   * @example
   *
   *   (5).minutesAfter('3:00pm') -> "5 minutes after 3pm"
   *   (5).minutesFromNow()       -> "5 minutes from now"
   *
   ***
   * @method minutesAgo()
   * @alias minutesBefore
   *
   ***
   * @method minutesFromNow()
   * @alias minutesAfter
   *
   ***
   * @method hours()
   * @returns Number
   * @short Takes the number as hours and returns milliseconds.
   * @extra %hour% is provided as an alias.
   * @example
   *
   *   (5).hours() -> 18000000
   *   (1).hour()  -> 3600000
   *
   ***
   * @method hoursBefore([d])
   * @returns Date
   * @short Returns a date <n> hours before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %hoursAgo% is provided as an alias. Also accepts %hourBefore% and %hourAgo%.
   * @example
   *
   *   (5).hoursBefore('3:00pm') -> "5 hours before 3pm"
   *   (5).hoursAgo()            -> "5 hours ago"
   *
   ***
   * @method hoursAfter([d])
   * @returns Date
   * @short Returns a date <n> hours after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %hoursFromNow% is provided as an alias. Also accepts %hourAfter% and %hourFromNow%.
   * @example
   *
   *   (5).hoursAfter('3:00pm') -> "5 hours after 3pm"
   *   (5).hoursFromNow()       -> "5 hours from now"
   *
   ***
   * @method hoursAgo()
   * @alias hoursBefore
   *
   ***
   * @method hoursFromNow()
   * @alias hoursAfter
   *
   ***
   * @method days()
   * @returns Number
   * @short Takes the number as days and returns milliseconds.
   * @extra %day% is provided as an alias.
   * @example
   *
   *   (5).days() -> 432000000
   *   (1).day()  -> 86400000
   *
   ***
   * @method daysBefore([d])
   * @returns Date
   * @short Returns a date <n> days before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %daysAgo% is provided as an alias. Also accepts %dayBefore% and %dayAgo%.
   * @example
   *
   *   (5).daysBefore('June 2nd') -> "5 days before June 2nd"
   *   (5).daysAgo()              -> "5 days ago"
   *
   ***
   * @method daysAfter([d])
   * @returns Date
   * @short Returns a date <n> days after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %daysFromNow% is provided as an alias. Also accepts %dayAfter% and %dayFromNow%.
   * @example
   *
   *   (5).daysAfter('June 2nd') -> "5 days after June 2nd"
   *   (5).daysFromNow()         -> "5 days from now"
   *
   ***
   * @method daysAgo()
   * @alias daysBefore
   *
   ***
   * @method daysFromNow()
   * @alias daysAfter
   *
   ***
   * @method weeks()
   * @returns Number
   * @short Takes the number as weeks and returns milliseconds.
   * @extra %week% is provided as an alias.
   * @example
   *
   *   (5).weeks() -> 3024000000
   *   (1).week()  -> 604800000
   *
   ***
   * @method weeksBefore([d])
   * @returns Date
   * @short Returns a date <n> weeks before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %weeksAgo% is provided as an alias. Also accepts %weekBefore% and %weekAgo%.
   * @example
   *
   *   (5).weeksBefore('June 2nd') -> "5 weeks before June 2nd"
   *   (5).weeksAgo()              -> "5 weeks ago"
   *
   ***
   * @method weeksAfter([d])
   * @returns Date
   * @short Returns a date <n> weeks after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %weeksFromNow% is provided as an alias. Also accepts %weekAfter% and %weekFromNow%.
   * @example
   *
   *   (5).weeksAfter('June 2nd') -> "5 weeks after June 2nd"
   *   (5).weeksFromNow()         -> "5 weeks from now"
   *
   ***
   * @method weeksAgo()
   * @alias weeksBefore
   *
   ***
   * @method weeksFromNow()
   * @alias weeksAfter
   *
   ***
   * @method months()
   * @returns Number
   * @short Takes the number as months and returns milliseconds.
   * @extra %month% is provided as an alias. Note that "a month" as a unit of time has inherent ambiguity. When no specific month can be infered, the value 30.4375 is used, which is the average number of days in a month.
   * @example
   *
   *   (5).months() -> 13149000000
   *   (1).month()  -> 2629800000
   *
   ***
   * @method monthsBefore([d])
   * @returns Date
   * @short Returns a date <n> months before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %monthsAgo% is provided as an alias. Also accepts %monthBefore% and %monthAgo%.
   * @example
   *
   *   (5).monthsBefore('July') -> "February"
   *   (5).monthsAgo()          -> "5 months ago"
   *
   ***
   * @method monthsAfter([d])
   * @returns Date
   * @short Returns a date <n> months after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %monthsFromNow% is provided as an alias. Also accepts %monthAfter% and %monthFromNow%.
   * @example
   *
   *   (5).monthsAfter('July') -> "December"
   *   (5).monthsFromNow()     -> "5 months from now"
   *
   ***
   * @method monthsAgo()
   * @alias monthsBefore
   *
   ***
   * @method monthsFromNow()
   * @alias monthsAfter
   *
   ***
   * @method years()
   * @returns Number
   * @short Takes the number as years and returns milliseconds.
   * @extra %year% is provided as an alias. Note that "a year" as a unit of time has inherent ambiguity. When no specific year can be infered, a calculation of 365.25 days is used, however exact calculations that take leap years into consideration should not use these methods.
   * @example
   *
   *   (5).years() -> 157788000000
   *   (1).year()  -> 31557600000
   *
   ***
   * @method yearsBefore([d])
   * @returns Date
   * @short Returns a date <n> years before [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %yearsAgo% is provided as an alias. Also accepts %yearBefore% and %yearAgo%.
   * @example
   *
   *   (5).yearsBefore('2011') -> "2006"
   *   (5).yearsAgo()          -> "5 years ago"
   *
   ***
   * @method yearsAfter([d])
   * @returns Date
   * @short Returns a date <n> years after [d], where <n> is the number.
   * @extra [d] will accept a date object, timestamp, or text format. See @date_format for more information. If not specified, [d] is assumed to be now. %yearsFromNow% is provided as an alias. Also accepts %yearAfter% and %yearFromNow%.
   * @example
   *
   *   (5).yearsAfter(2011) -> "2016"
   *   (5).yearsFromNow()   -> "5 years from now"
   *
   ***
   * @method yearsAgo()
   * @alias yearsBefore
   *
   ***
   * @method yearsFromNow()
   * @alias yearsAfter
   *
   ***/
  var buildNumberToDateAlias = function(unit, multiplier) {
    var base   = function() {  return Math.round(this * multiplier); }
    var before = function() { return getOffsetDate(this, arguments, unit, 'rewind'); }
    var after  = function() { return getOffsetDate(this, arguments, unit, 'advance'); }
    defineProperty(Number.prototype, unit, base);
    defineProperty(Number.prototype, unit + 's', base);
    defineProperty(Number.prototype, unit + 'Before', before);
    defineProperty(Number.prototype, unit + 'sBefore', before);
    defineProperty(Number.prototype, unit + 'Ago', before);
    defineProperty(Number.prototype, unit + 'sAgo', before);
    defineProperty(Number.prototype, unit + 'After', after);
    defineProperty(Number.prototype, unit + 'sAfter', after);
    defineProperty(Number.prototype, unit + 'FromNow', after);
    defineProperty(Number.prototype, unit + 'sFromNow', after);
  }





  extend(Number, false, {

    /***
     * @method Number.random([n1], [n2])
     * @returns Number
     * @short Returns a random integer between [n1] and [n2].
     * @extra If only 1 number is passed, the other will be 0. If none are passed, the number will be either 0 or 1.
     * @example
     *
     *   Number.random(50, 100) -> ex. 85
     *   Number.random(50)      -> ex. 27
     *   Number.random()        -> ex. 0
     *
     ***/
    'random': function(n1, n2) {
      if(arguments.length == 1) n2 = n1, n1 = 0;
      min = Math.min(n1 || 0, n2 || 1);
      max = Math.max(n1 || 0, n2 || 1);
      return Math.round((Math.random() * (max - min)) + min);
    }

  });

  extend(Number, true, {

    /***
     * @method toNumber()
     * @returns Number
     * @short Returns a number. This is mostly for compatibility reasons.
     * @example
     *
     *   (420).toNumber() -> 420
     *
     ***/
    'toNumber': function() {
      return parseFloat(this, 10);
    },

    /***
     * @method ceil([precision] = 0)
     * @returns Number
     * @short Rounds the number up. [precision] will round to the given precision.
     * @example
     *
     *   (4.434).ceil()  -> 5
     *   (-4.434).ceil() -> -4
     *   (44.17).ceil(1) -> 44.2
     *   (4417).ceil(-2) -> 4500
     *
     ***/
    'ceil': function(precision) {
      return round(this, precision, 'ceil');
    },

    /***
     * @method floor([precision] = 0)
     * @returns Number
     * @short Rounds the number down. [precision] will round to the given precision.
     * @example
     *
     *   (4.434).floor()  -> 4
     *   (-4.434).floor() -> -5
     *   (44.17).floor(1) -> 44.1
     *   (4417).floor(-2) -> 4400
     *
     ***/
    'floor': function(precision) {
      return round(this, precision, 'floor');
    },

    /***
     * @method abs()
     * @returns Number
     * @short Returns the absolute value for the number.
     * @example
     *
     *   (3).abs()  -> 3
     *   (-3).abs() -> 3
     *
     ***/
    'abs': function() {
      return Math.abs(this);
    },

    /***
     * @method pow(<p> = 1)
     * @returns Number
     * @short Returns the number to the power of <p>.
     * @example
     *
     *   (3).pow(2) -> 9
     *   (3).pow(3) -> 27
     *   (3).pow()  -> 3
     *
     ***/
    'pow': function(power) {
      if(power === undefined || power == null) power = 1;
      return Math.pow(this, power);
    },

    /***
     * @method round(<precision> = 0)
     * @returns Number
     * @short Rounds a number to the precision of <precision>.
     * @example
     *
     *   (3.241).round()  -> 3
     *   (3.841).round()  -> 4
     *   (-3.241).round() -> -3
     *   (-3.841).round() -> -4
     *   (3.241).round(2) -> 3.24
     *   (3748).round(-2) -> 3800
     *
     ***/
    'round': function(precision) {
      return round(this, precision, 'round');
    },

    /***
     * @method chr()
     * @returns String
     * @short Returns a string at the code point of the number.
     * @example
     *
     *   (65).chr() -> "A"
     *   (75).chr() -> "K"
     *
     ***/
    'chr': function() {
      return String.fromCharCode(this);
    },

    /***
     * @method isOdd()
     * @returns Boolean
     * @short Returns true if the number is odd.
     * @example
     *
     *   (3).isOdd()  -> true
     *   (18).isOdd() -> false
     *
     ***/
    'isOdd': function() {
      return !this.isMultipleOf(2);
    },

    /***
     * @method isEven()
     * @returns Boolean
     * @short Returns true if the number is even.
     * @example
     *
     *   (6).isEven()  -> true
     *   (17).isEven() -> false
     *
     ***/
    'isEven': function() {
      return this.isMultipleOf(2);
    },

    /***
     * @method isMultipleOf(<num>)
     * @returns Boolean
     * @short Returns true if the number is a multiple of <num>.
     * @example
     *
     *   (6).isMultipleOf(2)  -> true
     *   (17).isMultipleOf(2) -> false
     *   (32).isMultipleOf(4) -> true
     *   (34).isMultipleOf(4) -> false
     *
     ***/
    'isMultipleOf': function(num) {
      return this % num === 0;
    },

    /***
     * @method upto(<num>, [fn])
     * @returns Array
     * @short Returns an array containing numbers from the number up to <num>. Optionally calls [fn] callback for each number in that array.
     * @example
     *
     *   (2).upto(6) -> [2, 3, 4, 5, 6]
     *   (2).upto(6, function(n) {
     *     // This function is called 5 times receiving n as the value.
     *   });
     *
     ***/
    'upto': function(num, fn) {
      var arr = [];
      for(var i = parseInt(this); i <= num; i++) {
        arr.push(i);
        if(fn) fn.call(this, i);
      }
      return arr;
    },

    /***
     * @method downto(<num>, [fn])
     * @returns Array
     * @short Returns an array containing numbers from the number down to <num>. Optionally calls [fn] callback for each number in that array.
     * @example
     *
     *   (8).downto(3) -> [8, 7, 6, 5, 4, 3]
     *   (8).upto(3, function(n) {
     *     // This function is called 6 times receiving n as the value.
     *   });
     *
     ***/
    'downto': function(num, fn) {
      var arr = [];
      for(var i = parseInt(this); i >= num; i--) {
        arr.push(i);
        if(fn) fn.call(this, i);
      }
      return arr;
    },


    /***
     * @method times(<fn>)
     * @returns Number
     * @short Calls <fn> a number of times equivalent to the number.
     * @example
     *
     *   (8).times(function(i) {
     *     // This function is called 8 times.
     *   });
     *
     ***/
    'times': function(fn) {
      if(fn) {
        for(var i = 0; i < this; i++) {
          fn.call(this, i);
        }
      }
      return this.toNumber();
    },

    /***
     * @method ordinalize()
     * @returns String
     * @short Returns an ordinalized (English) string, i.e. "1st", "2nd", etc.
     * @example
     *
     *   (1).ordinalize() -> '1st';
     *   (2).ordinalize() -> '2nd';
     *   (8).ordinalize() -> '8th';
     *
     ***/
    'ordinalize': function() {
      var suffix;
      if(this >= 11 && this <= 13) {
        suffix = 'th';
      } else {
        switch(this % 10) {
          case 1:  suffix = 'st'; break;
          case 2:  suffix = 'nd'; break;
          case 3:  suffix = 'rd'; break;
          default: suffix = 'th';
        }
      }
      return this.toString() + suffix;
    },


    /***
     * @method pad(<place> = 0, [sign] = false)
     * @returns String
     * @short Pads a number with "0" to <place>.
     * @extra [sign] allows you to force the sign as well (+05, etc).
     * @example
     *
     *   (5).pad(2)        -> '05'
     *   (-5).pad(4)       -> '-0005'
     *   (82).pad(3, true) -> '+082'
     *
     ***/
    'pad': function(place, sign) {
      var str  = this.toNumber() === 0 ? '' : this.toString().replace(/^-/, '');
      str = str.padLeft(place - str.length, '0');
      if(sign || this < 0) {
        str = (this < 0 ? '-' : '+') + str;
      }
      return str;
    },

    /***
     * @method format([comma] = ',', [period] = '.')
     * @returns String
     * @short Formats the number to a readable string.
     * @extra [comma] is the character used for the thousands separator. [period] is the character used for the decimal point.
     * @example
     *
     *   (56782).format()           -> '56,782'
     *   (4388.43).format()         -> '4,388.43'
     *   (4388.43).format(' ')      -> '4 388.43'
     *   (4388.43).format('.', ',') -> '4.388,43'
     *
     ***/
    'format': function(comma, period) {
      comma = comma || ',';
      period = period || '.';
      var split = this.toString().split('.');
      var numeric = split[0];
      var decimal = split.length > 1 ? period + split[1] : '';
      var reg = /(\d+)(\d{3})/;
      while (reg.test(numeric)) {
        numeric = numeric.replace(reg, '$1' + comma + '$2');
      }
      return numeric + decimal;
    },

    /***
     * @method hex()
     * @returns String
     * @short Converts the number to hexidecimal.
     * @example
     *
     *   (255).hex()   -> 'ff';
     *   (23654).hex() -> '5c66';
     *
     ***/
    'hex': function() {
      return this.toString(16);
    }

  });
