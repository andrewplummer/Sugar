
  'use strict';

  /***
   * @package Number
   * @dependency core
   * @description Number formatting, rounding (with precision). Aliases to Math methods.
   *
   ***/

  function getThousands() {
    var str = sugarNumber.thousands;
    return isString(str) ? str : HALF_WIDTH_COMMA;
  }

  function getDecimal() {
    var str = sugarNumber.decimal;
    return isString(str) ? str : HALF_WIDTH_PERIOD;
  }

  function abbreviateNumber(num, roundTo, str, mid, limit, bytes) {
    var fixed        = num.toFixed(20),
        decimalPlace = fixed.search(/\./),
        numeralPlace = fixed.search(/[1-9]/),
        significant  = decimalPlace - numeralPlace,
        unit, i, divisor;
    if (significant > 0) {
      significant -= 1;
    }
    i = max(min(floor(significant / 3), limit === false ? str.length : limit), -mid);
    unit = str.charAt(i + mid - 1);
    if (significant < -9) {
      i = -3;
      roundTo = abs(significant) - 9;
      unit = str.slice(0,1);
    }
    divisor = bytes ? pow(2, 10 * i) : pow(10, i * 3);
    return numberFormat(withPrecision(num / divisor, roundTo || 0)) + unit.trim();
  }

  function numberFormat(num, place) {
    var i, str, split, integer, fraction, result = '';
    var thousands = getThousands();
    var decimal   = getDecimal();
    str      = (isNumber(place) ? withPrecision(num, place || 0).toFixed(max(place, 0)) : num.toString()).replace(/^-/, '');
    split    = str.split(HALF_WIDTH_PERIOD);
    integer  = split[0];
    fraction = split[1];
    for(i = integer.length; i > 0; i -= 3) {
      if (i < integer.length) {
        result = thousands + result;
      }
      result = integer.slice(max(0, i - 3), i) + result;
    }
    if (fraction) {
      result += decimal + repeatString('0', (place || 0) - fraction.length) + fraction;
    }
    return (num < 0 ? '-' : '') + result;
  }

  function isInteger(n) {
    return n % 1 === 0;
  }

  function isMultipleOf(n1, n2) {
    return n1 % n2 === 0;
  }

  function createRoundingFunction(fn) {
    return function(n, precision) {
      return precision ? withPrecision(n, precision, fn) : fn(n);
    }
  }

  defineStatic(sugarNumber, {

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
      var minNum, maxNum;
      if (arguments.length == 1) n2 = n1, n1 = 0;
      minNum = min(n1 || 0, isUndefined(n2) ? 1 : n2);
      maxNum = max(n1 || 0, isUndefined(n2) ? 1 : n2) + 1;
      return trunc((math.random() * (maxNum - minNum)) + minNum);
    }

  });

  defineInstance(sugarNumber, {

    /***
     * @method isInteger()
     * @returns Boolean
     * @short Returns true if the number has no trailing decimal.
     * @example
     *
     *   (420).isInteger() -> true
     *   (4.5).isInteger() -> false
     *
     ***/
    'isInteger': function(n) {
      return isInteger(n);
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
    'isOdd': function(n) {
      return isInteger(n) && !isMultipleOf(n, 2);
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
    'isEven': function(n) {
      return isMultipleOf(n, 2);
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
    'isMultipleOf': function(n, num) {
      return isMultipleOf(n, num);
    },

    /***
     * @method log(<base> = Math.E)
     * @returns Number
     * @short Returns the logarithm of the number with base <base>, or natural logarithm of the number if <base> is undefined.
     * @example
     *
     *   (64).log(2) -> 6
     *   (9).log(3)  -> 2
     *   (5).log()   -> 1.6094379124341003
     *
     ***/
    'log': function(n, base) {
      return math.log(n) / (base ? math.log(base) : 1);
    },

    /***
     * @method abbr([precision] = 0)
     * @returns String
     * @short Returns an abbreviated form of the number.
     * @extra [precision] will round to the given precision. %Sugar.Number.thousands% and %Sugar.Number.decimal% allow custom markers to be used.
     * @example
     *
     *   (1000).abbr()    -> "1k"
     *   (1000000).abbr() -> "1m"
     *   (1280).abbr(1)   -> "1.3k"
     *
     ***/
    'abbr': function(n, precision) {
      return abbreviateNumber(n, precision, 'kmbt', 0, 4);
    },

    /***
     * @method metric([precision] = 0, [limit] = 1)
     * @returns String
     * @short Returns the number as a string in metric notation.
     * @extra [precision] will round to the given precision. Both very large numbers and very small numbers are supported. [limit] is the upper limit for the units. The default is %1%, which is "kilo". If [limit] is %false%, the upper limit will be "exa". The lower limit is "nano", and cannot be changed. %Sugar.Number.thousands% and %Sugar.Number.decimal% allow custom markers to be used.
     * @example
     *
     *   (1000).metric()            -> "1k"
     *   (1000000).metric()         -> "1,000k"
     *   (1000000).metric(0, false) -> "1M"
     *   (1249).metric(2) + 'g'     -> "1.25kg"
     *   (0.025).metric() + 'm'     -> "25mm"
     *
     ***/
    'metric': function(n, precision, limit) {
      return abbreviateNumber(n, precision, 'nμm kMGTPE', 4, isUndefined(limit) ? 1 : limit);
    },

    /***
     * @method bytes([precision] = 0, [limit] = 4, [si] = false)
     * @returns String
     * @short Returns an abbreviated form of the number, considered to be "Bytes".
     * @extra [precision] will round to the given precision. [limit] is the upper limit for the units. The default is %4%, which is "terabytes" (TB). If [limit] is %false%, the upper limit will be "exa". If [si] is %true%, the standard SI units of 1000 will be used instead of 1024. %Sugar.Number.thousands% and %Sugar.Number.decimal% allow custom markers to be used.
     * @example
     *
     *   (1000).bytes()                 -> "1kB"
     *   (1000).bytes(2)                -> "0.98kB"
     *   ((10).pow(20)).bytes()         -> "90,949,470TB"
     *   ((10).pow(20)).bytes(0, false) -> "87EB"
     *
     ***/
    'bytes': function(n, precision, limit, si) {
      return abbreviateNumber(n, precision, 'kMGTPE', 0, isUndefined(limit) ? 4 : limit, si !== true) + 'B';
    },

    /***
     * @method format([place] = 0)
     * @returns String
     * @short Formats the number to a readable string.
     * @extra If [place] is %undefined%, the place will automatically be determined. %Sugar.Number.thousands% and %Sugar.Number.decimal% allow custom markers to be used.
     * @example
     *
     *   (56782).format()    -> '56,782'
     *   (56782).format(2)   -> '56,782.00'
     *   (4388.43).format(2) -> '4,388.43'
     *
     ***/
    'format': function(n, place) {
      return numberFormat(n, place);
    },

    /***
     * @method hex([pad] = 1)
     * @returns String
     * @short Converts the number to hexidecimal.
     * @extra [pad] will pad the resulting string to that many places.
     * @example
     *
     *   (255).hex()   -> 'ff';
     *   (255).hex(4)  -> '00ff';
     *   (23654).hex() -> '5c66';
     *
     ***/
    'hex': function(n, pad) {
      return padNumber(n, pad || 1, false, 16);
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
    'times': function(n, fn) {
      if (fn) {
        for(var i = 0; i < n; i++) {
          fn.call(n, i);
        }
      }
      return +n;
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
    'chr': function(n) {
      return string.fromCharCode(n);
    },

    /***
     * @method pad(<place> = 0, [sign] = false, [base] = 10)
     * @returns String
     * @short Pads a number with "0" to <place>.
     * @extra [sign] allows you to force the sign as well (+05, etc). [base] can change the base for numeral conversion.
     * @example
     *
     *   (5).pad(2)        -> '05'
     *   (-5).pad(4)       -> '-0005'
     *   (82).pad(3, true) -> '+082'
     *
     ***/
    'pad': function(n, place, sign, base) {
      return padNumber(n, place, sign, base);
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
    'ordinalize': function(n) {
      var suffix, num = abs(n), last = +num.toString().slice(-2);
      return n + getOrdinalizedSuffix(last);
    },

    /***
     * @method toNumber()
     * @returns Number
     * @short Identity function for compatibilty.
     * @example
     *
     *   (420).toNumber() -> 420
     *
     ***/
    'toNumber': function(n) {
      return n;
    },

    /***
     * @method round(<precision> = 0)
     * @returns Number
     * @short Shortcut for %Math.round% that also allows a <precision>.
     *
     * @example
     *
     *   (3.241).round()  -> 3
     *   (-3.841).round() -> -4
     *   (3.241).round(2) -> 3.24
     *   (3748).round(-2) -> 3800
     *
     ***/
    'round': createRoundingFunction(round),

    /***
     * @method ceil(<precision> = 0)
     * @returns Number
     * @short Shortcut for %Math.ceil% that also allows a <precision>.
     *
     * @example
     *
     *   (3.241).ceil()  -> 4
     *   (-3.241).ceil() -> -3
     *   (3.241).ceil(2) -> 3.25
     *   (3748).ceil(-2) -> 3800
     *
     ***/
    'ceil': createRoundingFunction(ceil),

    /***
     * @method floor(<precision> = 0)
     * @returns Number
     * @short Shortcut for %Math.floor% that also allows a <precision>.
     *
     * @example
     *
     *   (3.241).floor()  -> 3
     *   (-3.841).floor() -> -4
     *   (3.241).floor(2) -> 3.24
     *   (3748).floor(-2) -> 3700
     *
     ***/
    'floor': createRoundingFunction(floor)

  });

  /***
   * @method [math]()
   * @returns Number
   * @short Math related functions are mapped as shortcuts to numbers and are identical. Note that %Number#log% provides some special defaults.
   *
   * @set
   *   abs
   *   sin
   *   asin
   *   cos
   *   acos
   *   tan
   *   atan
   *   sqrt
   *   exp
   *   pow
   *
   * @example
   *
   *   (3).pow(3) -> 27
   *   (-3).abs() -> 3
   *   (1024).sqrt() -> 32
   *
   ***/
  defineInstanceSimilar(sugarNumber, 'abs,pow,sin,asin,cos,acos,tan,atan,exp,pow,sqrt', function(methods, name) {
    methods[name] = function(n, arg) {
      return math[name](n, arg);
    }
  });
