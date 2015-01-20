
  'use strict';

  /***
   * @package String
   * @dependency core
   * @description String manupulation, escaping, encoding, truncation, and:conversion.
   *
   ***/

  var HTML_CODE_MATCH = /&#(x)?([\w\d]{0,5});/i;

  var HTML_VOID_ELEMENTS = [
    'area','base','br','col','command','embed','hr','img',
    'input','keygen','link','meta','param','source','track','wbr'
  ];

  function getInflector() {
    return sugarString.Inflector;
  }

  function getAcronym(word) {
    var inflector = getInflector();
    var word = inflector && inflector.acronyms[word];
    if(isString(word)) {
      return word;
    }
  }

  function checkRepeatRange(num) {
    num = +num;
    if(num < 0 || num === Infinity) {
      throw new RangeError('Invalid number');
    }
    return num;
  }

  function padString(num, padding) {
    return repeatString(isDefined(padding) ? padding : ' ', num);
  }

  function truncateString(str, length, from, ellipsis, split) {
    var str1, str2, len1, len2;
    if(str.length <= length) {
      return str.toString();
    }
    ellipsis = isUndefined(ellipsis) ? '...' : ellipsis;
    switch(from) {
      case 'left':
        str2 = split ? truncateOnWord(str, length, true) : str.slice(str.length - length);
        return ellipsis + str2;
      case 'middle':
        len1 = ceil(length / 2);
        len2 = floor(length / 2);
        str1 = split ? truncateOnWord(str, len1) : str.slice(0, len1);
        str2 = split ? truncateOnWord(str, len2, true) : str.slice(str.length - len2);
        return str1 + ellipsis + str2;
      default:
        str1 = split ? truncateOnWord(str, length) : str.slice(0, length);
        return str1 + ellipsis;
    }
  }

  function stringEach(str, search, fn) {
    var i, len, result, chunks;
    if(isFunction(search)) {
      fn = search;
      search = /[\s\S]/g;
    } else if(!search) {
      search = /[\s\S]/g
    } else if(isString(search)) {
      search = regexp(escapeRegExp(search), 'gi');
    } else if(isRegExp(search)) {
      search = regexp(search.source, getRegExpFlags(search, 'g'));
    }
    chunks = str.match(search) || [];
    if(fn) {
      for(i = 0, len = chunks.length; i < len; i++) {
        result = fn.call(str, chunks[i], i, chunks);
        if(result === false) {
          chunks.length = i + 1;
          break;
        } else if(isDefined(result)) {
          chunks[i] = result;
        }
      }
    }
    return chunks;
  }

  function eachWord(str, fn) {
    return stringEach(str.trim(), /\S+/g, fn);
  }

  function stringCodes(str, fn) {
    var codes = [], i, len;
    for(i = 0, len = str.length; i < len; i++) {
      var code = str.charCodeAt(i);
      codes.push(code);
      if(fn) fn.call(str, code, i);
    }
    return codes;
  }

  function shiftChar(str, n) {
    var result = '';
    n = n || 0;
    stringCodes(str, function(c) {
      result += chr(c + n);
    });
    return result;
  }

  function underscore(str) {
    var inflector = getInflector();
    return str
      .replace(/[-\s]+/g, '_')
      .replace(inflector && inflector.acronymRegExp, function(acronym, index) {
        return (index > 0 ? '_' : '') + acronym.toLowerCase();
      })
      .replace(/([A-Z\d]+)([A-Z][a-z])/g,'$1_$2')
      .replace(/([a-z\d])([A-Z])/g,'$1_$2')
      .toLowerCase();
  }

  function spacify(str) {
    return underscore(str).replace(/_/g, ' ');
  }

  function capitalize(str, all) {
    var lastResponded;
    return str.toLowerCase().replace(all ? /[^']/g : /^\S/, function(lower) {
      var upper = lower.toUpperCase(), result;
      result = lastResponded ? lower : upper;
      lastResponded = upper !== lower;
      return result;
    });
  }

  function reverseString(str) {
    return str.split('').reverse().join('');
  }

  function stringFirst(str, num) {
    if(isUndefined(num)) num = 1;
    return str.substr(0, num);
  }

  function stringLast(str, num) {
    if(isUndefined(num)) num = 1;
    var start = str.length - num < 0 ? 0 : str.length - num;
    return str.substr(start);
  }

  function stringFrom(str, from) {
    return str.slice(numberOrIndex(str, from, true));
  }

  function stringTo(str, to) {
    if(isUndefined(to)) to = str.length;
    return str.slice(0, numberOrIndex(str, to));
  }

  function stringAssign(str, args) {
    var obj = {};
    flattenedArgs(args, function(a, i) {
      if(isObjectType(a)) {
        simpleMerge(obj, a);
      } else {
        obj[i + 1] = a;
      }
    });
    return str.replace(/\{([^{]+?)\}/g, function(m, key) {
      return hasOwnProperty(obj, key) ? obj[key] : m;
    });
  }

  function isBlank(str) {
    return str.trim().length === 0;
  }

  function truncateOnWord(str, limit, fromLeft) {
    if(fromLeft) {
      return reverseString(truncateOnWord(reverseString(str), limit));
    }
    var reg = regexp('(?=[' + getTrimmableCharacters() + '])');
    var words = str.split(reg);
    var count = 0;
    return words.filter(function(word) {
      count += word.length;
      return count <= limit;
    }).join('');
  }

  function convertHTMLCodes(str) {
    return str.replace(HTML_CODE_MATCH, function(full, hex, code) {
      return string.fromCharCode(parseInt(code, hex ? 16 : 10));
    });
  }

  function tagIsVoid(tag) {
    return HTML_VOID_ELEMENTS.indexOf(tag.toLowerCase()) !== -1;
  }

  function replaceTags(str, args, strip) {
    var lastIndex = args.length - 1, lastArg = args[lastIndex], replacementFn, tags, reg;
    if(isFunction(lastArg)) {
      replacementFn = lastArg;
      args.length = lastIndex;
    }
    tags = flattenedArgs(args).map(function(tag) {
      return escapeRegExp(tag);
    }).join('|');
    reg = regexp('<(\\/)?(' + (tags || '[^\\s>]+') + ')(\\s+[^<>]*?)?\\s*(\\/)?>', 'gi');
    return runTagReplacements(str, reg, strip, replacementFn);
  }

  function runTagReplacements(str, reg, strip, replacementFn, fullString) {

    var match;
    var result = '';
    var currentIndex = 0;
    var currentlyOpenTagName;
    var currentlyOpenTagAttributes;
    var currentlyOpenTagCount = 0;

    function processTag(index, tagName, attributes, tagLength) {
      var content = str.slice(currentIndex, index), replacement;
      if(replacementFn) {
        replacement = replacementFn.call(fullString, tagName, content, attributes, fullString);
        if(isDefined(replacement)) {
          content = replacement;
        } else if(!strip) {
          content = '';
        }
      } else if(!strip) {
        content = '';
      }
      result += runTagReplacements(content, reg, strip, replacementFn, fullString);
      currentIndex = index + (tagLength || 0);
    }

    fullString = fullString || str;
    reg = regexp(reg.source, 'gi');

    while(match = reg.exec(str)) {

      var tagName         = match[2];
      var attributes      = (match[3]|| '').slice(1);
      var isClosingTag    = !!match[1];
      var isSelfClosing   = !!match[4];
      var tagLength       = match[0].length;
      var isOpeningTag    = !isClosingTag && !isSelfClosing && !tagIsVoid(tagName);
      var isSameAsCurrent = tagName === currentlyOpenTagName;

      if(!currentlyOpenTagName) {
        result += str.slice(currentIndex, match.index);
        currentIndex = match.index;
      }

      if(isOpeningTag) {
        if(!currentlyOpenTagName) {
          currentlyOpenTagName = tagName;
          currentlyOpenTagAttributes = attributes;
          currentlyOpenTagCount++;
          currentIndex += tagLength;
        } else if(isSameAsCurrent) {
          currentlyOpenTagCount++;
        }
      } else if(isClosingTag && isSameAsCurrent) {
        currentlyOpenTagCount--;
        if(currentlyOpenTagCount === 0) {
          processTag(match.index, currentlyOpenTagName, currentlyOpenTagAttributes, tagLength);
          currentlyOpenTagName       = null;
          currentlyOpenTagAttributes = null;
        }
      } else if(!currentlyOpenTagName) {
        processTag(match.index, tagName, attributes, tagLength);
      }
    }
    if(currentlyOpenTagName) {
      processTag(str.length, currentlyOpenTagName, currentlyOpenTagAttributes);
    }
    result += str.slice(currentIndex);
    return result;
  }

  function numberOrIndex(str, n, from) {
    if(isString(n)) {
      n = str.indexOf(n);
      if(n === -1) {
        n = from ? str.length : 0;
      }
    }
    return n;
  }

  var encodeBase64, decodeBase64;

  function buildBase64(key) {
    var encodeAscii, decodeAscii;

    function catchEncodingError(fn) {
      return function(str) {
        try {
          return fn(str);
        } catch(e) {
          return '';
        }
      }
    }

    if(typeof Buffer !== 'undefined') {
      encodeBase64 = function(str) {
        return new Buffer(str).toString('base64');
      }
      decodeBase64 = function(str) {
        return new Buffer(str, 'base64').toString('utf8');
      }
      return;
    }
    if(typeof btoa !== 'undefined') {
      encodeAscii = catchEncodingError(btoa);
      decodeAscii = catchEncodingError(atob);
    } else {
      var base64reg = /[^A-Za-z0-9\+\/\=]/g;
      encodeAscii = function(str) {
        var output = '';
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        do {
          chr1 = str.charCodeAt(i++);
          chr2 = str.charCodeAt(i++);
          chr3 = str.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }
          output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
          chr1 = chr2 = chr3 = '';
          enc1 = enc2 = enc3 = enc4 = '';
        } while (i < str.length);
        return output;
      }
      decodeAscii = function(input) {
        var output = '';
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        if(input.match(base64reg)) {
          return '';
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        do {
          enc1 = key.indexOf(input.charAt(i++));
          enc2 = key.indexOf(input.charAt(i++));
          enc3 = key.indexOf(input.charAt(i++));
          enc4 = key.indexOf(input.charAt(i++));
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          output = output + chr(chr1);
          if (enc3 != 64) {
            output = output + chr(chr2);
          }
          if (enc4 != 64) {
            output = output + chr(chr3);
          }
          chr1 = chr2 = chr3 = '';
          enc1 = enc2 = enc3 = enc4 = '';
        } while (i < input.length);
        return output;
      }
    }
    encodeBase64 = function(str) {
      return encodeAscii(unescape(encodeURIComponent(str)));
    }
    decodeBase64 = function(str) {
      return decodeURIComponent(escape(decodeAscii(str)));
    }
  }

  function getCoercedStringSubject(obj) {
    if(obj == null) {
      throw new TypeError();
    }
    return string(obj);
  }

  function getCoercedSearchString(obj, errorOnRegex) {
    if(errorOnRegex && isRegExp(obj)) {
      throw new TypeError();
    }
    return string(obj);
  }

  function buildStartEndsWith() {
    var override = true;
    try {
      // If String#startsWith does not exist or alternately if it exists but
      // correctly throws an error here, then there is no need to flag the
      // method to override the existing implementation.
      ''.startsWith(/./);
    } catch(e) {
      override = false;
    }
    extend(string, {

      /***
       * @method startsWith(<search>, [pos] = 0)
       * @returns Boolean
       * @short Returns true if the string starts with <search>, which must be a string.
       * @extra Search begins at [pos], which defaults to the entire string length.
       * @example
       *
       *   'hello'.startsWith('hell')   -> true
       *   'hello'.startsWith('HELL')   -> false
       *   'hello'.startsWith('ell', 1) -> true
       *
       ***/
      'startsWith': function(searchString) {
        var str, start, pos, len, searchLength, position = arguments[1];
        str = getCoercedStringSubject(this);
        searchString = getCoercedSearchString(searchString, true);
        pos = number(position) || 0;
        len = str.length;
        start = min(max(pos, 0), len);
        searchLength = searchString.length;
        if(searchLength + start > len) {
          return false;
        }
        if(str.substr(start, searchLength) === searchString) {
          return true;
        }
        return false;
      },

      /***
       * @method endsWith(<search>, [pos] = length)
       * @returns Boolean
       * @short Returns true if the string ends with <search>, which must be a string.
       * @extra Search ends at [pos], which defaults to the entire string length.
       * @example
       *
       *   'jumpy'.endsWith('py')    -> true
       *   'jumpy'.endsWith('MPY')   -> false
       *   'jumpy'.endsWith('mp', 4) -> false
       *
       ***/
      'endsWith': function(searchString) {
        var str, start, end, pos, len, searchLength, endPosition = arguments[1];
        str = getCoercedStringSubject(this);
        searchString = getCoercedSearchString(searchString, true);
        len = str.length;
        pos = len;
        if(isDefined(endPosition)) {
          pos = number(endPosition) || 0;
        }
        end = min(max(pos, 0), len);
        searchLength = searchString.length;
        start = end - searchLength;
        if(start < 0) {
          return false;
        }
        if(str.substr(start, searchLength) === searchString) {
          return true;
        }
        return false;
      }

    }, true, true, override);
  }
  extend(string, {

    /***
     * @method contains(<search>, [pos] = 0)
     * @returns Boolean
     * @short Returns true if <search> is contained within the string.
     * @extra Search begins at [pos], which defaults to the entire string length.
     * @example
     *
     *   'jumpy'.contains('py')      -> true
     *   'broken'.contains('ken', 3) -> true
     *   'broken'.contains('bro', 3) -> false
     *
     ***/
    'contains': function(searchString) {
      var str = getCoercedStringSubject(this), position = arguments[1];
      return str.indexOf(searchString, position) > -1;
    },

    /***
     * @method repeat([num] = 0)
     * @returns String
     * @short Returns the string repeated [num] times.
     * @example
     *
     *   'jumpy'.repeat(2) -> 'jumpyjumpy'
     *   'a'.repeat(5)     -> 'aaaaa'
     *   'a'.repeat(0)     -> ''
     *
     ***/
    'repeat': function(num) {
      num = checkRepeatRange(num);
      return repeatString(this, num);
    }

  }, true, true);

  extend(string, {

     /***
      * @method escapeURL([param] = false)
      * @returns String
      * @short Escapes characters in a string to make a valid URL.
      * @extra If [param] is true, it will also escape valid URL characters for use as a URL parameter.
      * @example
      *
      *   'http://foo.com/"bar"'.escapeURL()     -> 'http://foo.com/%22bar%22'
      *   'http://foo.com/"bar"'.escapeURL(true) -> 'http%3A%2F%2Ffoo.com%2F%22bar%22'
      *
      ***/
    'escapeURL': function(param) {
      return param ? encodeURIComponent(this) : encodeURI(this);
    },

     /***
      * @method unescapeURL([partial] = false)
      * @returns String
      * @short Restores escaped characters in a URL escaped string.
      * @extra If [partial] is true, it will only unescape non-valid URL characters. [partial] is included here for completeness, but should very rarely be needed.
      * @example
      *
      *   'http%3A%2F%2Ffoo.com%2Fthe%20bar'.unescapeURL()     -> 'http://foo.com/the bar'
      *   'http%3A%2F%2Ffoo.com%2Fthe%20bar'.unescapeURL(true) -> 'http%3A%2F%2Ffoo.com%2Fthe bar'
      *
      ***/
    'unescapeURL': function(param) {
      return param ? decodeURI(this) : decodeURIComponent(this);
    },

     /***
      * @method escapeHTML()
      * @returns String
      * @short Converts HTML characters to their entity equivalents.
      * @example
      *
      *   '<p>some text</p>'.escapeHTML() -> '&lt;p&gt;some text&lt;/p&gt;'
      *   'one & two'.escapeHTML()        -> 'one &amp; two'
      *
      ***/
    'escapeHTML': function() {
      return this.replace(/&/g,  '&amp;' )
                 .replace(/</g,  '&lt;'  )
                 .replace(/>/g,  '&gt;'  )
                 .replace(/"/g,  '&quot;')
                 .replace(/'/g,  '&apos;')
                 .replace(/\//g, '&#x2f;');
    },

     /***
      * @method unescapeHTML([partial] = false)
      * @returns String
      * @short Restores escaped HTML characters.
      * @example
      *
      *   '&lt;p&gt;some text&lt;/p&gt;'.unescapeHTML() -> '<p>some text</p>'
      *   'one &amp; two'.unescapeHTML()                -> 'one & two'
      *
      ***/
    'unescapeHTML': function() {
      return convertHTMLCodes(this)
                 .replace(/&lt;/g,   '<')
                 .replace(/&gt;/g,   '>')
                 .replace(/&nbsp;/g, ' ')
                 .replace(/&quot;/g, '"')
                 .replace(/&apos;/g, "'")
                 .replace(/&amp;/g,  '&');
    },

     /***
      * @method encodeBase64()
      * @returns String
      * @short Encodes the string into base64 encoding.
      * @extra This method wraps native methods when available, and uses a custom implementation when not available. It can also handle Unicode string encodings.
      * @example
      *
      *   'gonna get encoded!'.encodeBase64()  -> 'Z29ubmEgZ2V0IGVuY29kZWQh'
      *   'http://twitter.com/'.encodeBase64() -> 'aHR0cDovL3R3aXR0ZXIuY29tLw=='
      *
      ***/
    'encodeBase64': function() {
      return encodeBase64(this);
    },

     /***
      * @method decodeBase64()
      * @returns String
      * @short Decodes the string from base64 encoding.
      * @extra This method wraps native methods when available, and uses a custom implementation when not available. It can also handle Unicode string encodings.
      * @example
      *
      *   'aHR0cDovL3R3aXR0ZXIuY29tLw=='.decodeBase64() -> 'http://twitter.com/'
      *   'anVzdCBnb3QgZGVjb2RlZA=='.decodeBase64()     -> 'just got decoded!'
      *
      ***/
    'decodeBase64': function() {
      return decodeBase64(this);
    },

    /***
     * @method each([search] = single character, [fn])
     * @returns Array
     * @short Runs callback [fn] against each occurence of [search].
     * @extra Returns an array of matches. [search] may be either a string or regex, and defaults to every character in the string. If [fn] returns false at any time it will break out of the loop.
     * @example
     *
     *   'jumpy'.each() -> ['j','u','m','p','y']
     *   'jumpy'.each(/[r-z]/) -> ['u','y']
     *   'jumpy'.each(/[r-z]/, function(m) {
     *     // Called twice: "u", "y"
     *   });
     *
     ***/
    'each': function(search, fn) {
      return stringEach(this, search, fn);
    },

    /***
     * @method map(<fn>, [scope])
     * @returns String
     * @short Maps the string to another string containing the values that are the result of calling <fn> on each element.
     * @extra [scope] is the %this% object. <fn> is a function, it receives three arguments: the current character, the current index, and a reference to the string.
     * @example
     *
     *   'jumpy'.map(function(l) {
     *     return String.fromCharCode(l.charCodeAt(0) + 1);
     *
     *   }); // Returns the string with each character shifted one code point down.
     *
     ***/
    'map': function(map, scope) {
      var str = this.toString();
      if(isFunction(map)) {
        var fn = map;
        map = function(letter, i, arr) {
          return fn.call(scope, letter, i, str);
        }
      }
      return str.split('').map(map, scope).join('');
    },

    /***
     * @method shift(<n>)
     * @returns Array
     * @short Shifts each character in the string <n> places in the character map.
     * @example
     *
     *   'a'.shift(1)  -> 'b'
     *   'ク'.shift(1) -> 'グ'
     *
     ***/
    'shift': function(n) {
      return shiftChar(this, n);
    },

    /***
     * @method codes([fn])
     * @returns Array
     * @short Runs callback [fn] against each character code in the string. Returns an array of character codes.
     * @example
     *
     *   'jumpy'.codes() -> [106,117,109,112,121]
     *   'jumpy'.codes(function(c) {
     *     // Called 5 times: 106, 117, 109, 112, 121
     *   });
     *
     ***/
    'codes': function(fn) {
      return stringCodes(this, fn);
    },

    /***
     * @method chars([fn])
     * @returns Array
     * @short Runs callback [fn] against each character in the string. Returns an array of characters.
     * @example
     *
     *   'jumpy'.chars() -> ['j','u','m','p','y']
     *   'jumpy'.chars(function(c) {
     *     // Called 5 times: "j","u","m","p","y"
     *   });
     *
     ***/
    'chars': function(fn) {
      return stringEach(this, fn);
    },

    /***
     * @method words([fn])
     * @returns Array
     * @short Runs callback [fn] against each word in the string. Returns an array of words.
     * @extra A "word" here is defined as any sequence of non-whitespace characters.
     * @example
     *
     *   'broken wear'.words() -> ['broken','wear']
     *   'broken wear'.words(function(w) {
     *     // Called twice: "broken", "wear"
     *   });
     *
     ***/
    'words': function(fn) {
      return eachWord(this, fn);
    },

    /***
     * @method lines([fn])
     * @returns Array
     * @short Runs callback [fn] against each line in the string. Returns an array of lines.
     * @example
     *
     *   'broken wear\nand\njumpy jump'.lines() -> ['broken wear','and','jumpy jump']
     *   'broken wear\nand\njumpy jump'.lines(function(l) {
     *     // Called three times: "broken wear", "and", "jumpy jump"
     *   });
     *
     ***/
    'lines': function(fn) {
      return stringEach(this.trim(), /^.*$/gm, fn);
    },

    /***
     * @method paragraphs([fn])
     * @returns Array
     * @short Runs callback [fn] against each paragraph in the string. Returns an array of paragraphs.
     * @extra A paragraph here is defined as a block of text bounded by two or more line breaks.
     * @example
     *
     *   'Once upon a time.\n\nIn the land of oz...'.paragraphs() -> ['Once upon a time.','In the land of oz...']
     *   'Once upon a time.\n\nIn the land of oz...'.paragraphs(function(p) {
     *     // Called twice: "Once upon a time.", "In teh land of oz..."
     *   });
     *
     ***/
    'paragraphs': function(fn) {
      var paragraphs = this.trim().split(/[\r\n]{2,}/);
      paragraphs = paragraphs.map(function(p) {
        if(fn) var s = fn.call(p);
        return s ? s : p;
      });
      return paragraphs;
    },

    /***
     * @method isBlank()
     * @returns Boolean
     * @short Returns true if the string has a length of 0 or contains only whitespace.
     * @example
     *
     *   ''.isBlank()      -> true
     *   '   '.isBlank()   -> true
     *   'noway'.isBlank() -> false
     *
     ***/
    'isBlank': function() {
      return isBlank(this);
    },

    /***
     * @method add(<str>, [index] = length)
     * @returns String
     * @short Adds <str> at [index]. Negative values are also allowed.
     * @extra %insert% is provided as an alias, and is generally more readable when using an index.
     * @example
     *
     *   'schfifty'.add(' five')      -> schfifty five
     *   'dopamine'.insert('e', 3)       -> dopeamine
     *   'spelling eror'.insert('r', -3) -> spelling error
     *
     ***/
    'add': function(str, index) {
      index = isUndefined(index) ? this.length : index;
      return this.slice(0, index) + str + this.slice(index);
    },

    /***
     * @method remove(<f>)
     * @returns String
     * @short Removes any part of the string that matches <f>.
     * @extra <f> can be a stringuor a regex. When it is a string only the first match will be removed.
     * @example
     *
     *   'schfifty five'.remove('f')      -> 'schifty five'
     *   'schfifty five'.remove(/f/g)     -> 'schity ive'
     *   'schfifty five'.remove(/[a-f]/g) -> 'shity iv'
     *
     ***/
    'remove': function(f) {
      return this.replace(f, '');
    },

    /***
     * @method reverse()
     * @returns String
     * @short Reverses the string.
     * @example
     *
     *   'jumpy'.reverse()        -> 'ypmuj'
     *   'lucky charms'.reverse() -> 'smrahc ykcul'
     *
     ***/
    'reverse': function() {
      return reverseString(this);
    },

    /***
     * @method compact()
     * @returns String
     * @short Compacts all white space in the string to a single space and trims the ends.
     * @example
     *
     *   'too \n much \n space'.compact() -> 'too much space'
     *   'enough \n '.compact()           -> 'enought'
     *
     ***/
    'compact': function() {
      return this.trim().replace(/([\r\n\s　])+/g, function(match, whitespace){
        return whitespace === '　' ? whitespace : ' ';
      });
    },

    /***
     * @method at(<index>, [loop] = true)
     * @returns String or Array
     * @short Gets the character(s) at a given index.
     * @extra When [loop] is true, overshooting the end of the string (or the beginning) will begin counting from the other end. As an alternate syntax, passing multiple indexes will get the characters at those indexes.
     * @example
     *
     *   'jumpy'.at(0)               -> 'j'
     *   'jumpy'.at(2)               -> 'm'
     *   'jumpy'.at(5)               -> 'j'
     *   'jumpy'.at(5, false)        -> ''
     *   'jumpy'.at(-1)              -> 'y'
     *   'lucky charms'.at(2,4,6,8) -> ['u','k','y',c']
     *
     ***/
    'at': function() {
      return getEntriesForIndexes(this, arguments, true);
    },

    /***
     * @method from([index] = 0)
     * @returns String
     * @short Returns a section of the string starting from [index].
     * @example
     *
     *   'lucky charms'.from()   -> 'lucky charms'
     *   'lucky charms'.from(7)  -> 'harms'
     *
     ***/
    'from': function(from) {
      return stringFrom(this, from);
    },

    /***
     * @method to([index] = end)
     * @returns String
     * @short Returns a section of the string ending at [index].
     * @example
     *
     *   'lucky charms'.to()   -> 'lucky charms'
     *   'lucky charms'.to(7)  -> 'lucky ch'
     *
     ***/
    'to': function(to) {
      return stringTo(this, to);
    },

    /***
     * @method dasherize()
     * @returns String
     * @short Converts underscores and camel casing to hypens.
     * @example
     *
     *   'a_farewell_to_arms'.dasherize() -> 'a-farewell-to-arms'
     *   'capsLock'.dasherize()           -> 'caps-lock'
     *
     ***/
    'dasherize': function() {
      return underscore(this).replace(/_/g, '-');
    },

    /***
     * @method underscore()
     * @returns String
     * @short Converts hyphens and camel casing to underscores.
     * @example
     *
     *   'a-farewell-to-arms'.underscore() -> 'a_farewell_to_arms'
     *   'capsLock'.underscore()           -> 'caps_lock'
     *
     ***/
    'underscore': function() {
      return underscore(this);
    },

    /***
     * @method camelize([first] = true)
     * @returns String
     * @short Converts underscores and hyphens to camel case. If [first] is true the first letter will also be capitalized.
     * @extra If the Inflections package is included acryonyms can also be defined that will be used when camelizing.
     * @example
     *
     *   'caps_lock'.camelize()              -> 'CapsLock'
     *   'moz-border-radius'.camelize()      -> 'MozBorderRadius'
     *   'moz-border-radius'.camelize(false) -> 'mozBorderRadius'
     *
     ***/
    'camelize': function(first) {
      return underscore(this).replace(/(^|_)([^_]+)/g, function(match, pre, word, index) {
        var acronym = getAcronym(word), cap = first !== false || index > 0;
        if(acronym) return cap ? acronym : acronym.toLowerCase();
        return cap ? capitalize(word) : word;
      });
    },

    /***
     * @method spacify()
     * @returns String
     * @short Converts camel case, underscores, and hyphens to a properly spaced string.
     * @example
     *
     *   'camelCase'.spacify()                         -> 'camel case'
     *   'an-ugly-string'.spacify()                    -> 'an ugly string'
     *   'oh-no_youDid-not'.spacify().capitalize(true) -> 'something else'
     *
     ***/
    'spacify': function() {
      return spacify(this);
    },

    /***
     * @method stripTags([tag1], [tag2], ...)
     * @returns String
     * @short Strips HTML tags from the string.
     * @extra Tags to strip may be enumerated in the parameters, otherwise will strip all. A single function may be passed to this method as the final argument which will allow case by case replacements. This function arguments are the tag name, tag content, tag attributes, and the string itself. If this function returns a string, then it will be used for the replacement. If it returns %undefined%, the tags will be stripped normally.
     * @example
     *
     *   '<p>just <b>some</b> text</p>'.stripTags()    -> 'just some text'
     *   '<p>just <b>some</b> text</p>'.stripTags('p') -> 'just <b>some</b> text'
     *   '<p>hi!</p>'.stripTags('p', function(tag, content) {
     *     return '|' + content + '|';
     *   }); // returns '|hi!|'
     *
     ***/
    'stripTags': function() {
      return replaceTags(this, arguments, true);
    },

    /***
     * @method removeTags([tag1], [tag2], ...)
     * @returns String
     * @short Removes HTML tags and their contents from the string.
     * @extra Tags to remove may be enumerated in the parameters, otherwise will remove all. A single function may be passed to this method as the final argument which will allow case by case replacements. This function arguments are the tag name, tag content, tag attributes, and the string itself. If this function returns a string, then it will be used for the replacement. If it returns %undefined%, the tags will be removed normally.
     * @example
     *
     *   '<p>just <b>some</b> text</p>'.removeTags()    -> ''
     *   '<p>just <b>some</b> text</p>'.removeTags('b') -> '<p>just text</p>'
     *   '<p>hi!</p>'.removeTags('p', function(tag, content) {
     *     return 'bye!';
     *   }); // returns 'bye!'
     *
     ***/
    'removeTags': function() {
      return replaceTags(this, arguments, false);
    },

    /***
     * @method truncate(<length>, [from] = 'right', [ellipsis] = '...')
     * @returns String
     * @short Truncates a string.
     * @extra [from] can be %'right'%, %'left'%, or %'middle'%. If the string is shorter than <length>, [ellipsis] will not be added.
     * @example
     *
     *   'sittin on the dock of the bay'.truncate(18)           -> 'just sittin on the do...'
     *   'sittin on the dock of the bay'.truncate(18, 'left')   -> '...the dock of the bay'
     *   'sittin on the dock of the bay'.truncate(18, 'middle') -> 'just sitt...of the bay'
     *
     ***/
    'truncate': function(length, from, ellipsis) {
      return truncateString(this, length, from, ellipsis);
    },

    /***
     * @method truncateOnWord(<length>, [from] = 'right', [ellipsis] = '...')
     * @returns String
     * @short Truncates a string without splitting up words.
     * @extra [from] can be %'right'%, %'left'%, or %'middle'%. If the string is shorter than <length>, [ellipsis] will not be added.
     * @example
     *
     *   'here we go'.truncateOnWord(5)               -> 'here...'
     *   'here we go'.truncateOnWord(5, 'left')       -> '...we go'
     *
     ***/
    'truncateOnWord': function(length, from, ellipsis) {
      return truncateString(this, length, from, ellipsis, true);
    },

    /***
     * @method pad[Side](<num> = null, [padding] = ' ')
     * @returns String
     * @short Pads the string out with [padding] to be exactly <num> characters.
     *
     * @set
     *   pad
     *   padLeft
     *   padRight
     *
     * @example
     *
     *   'wasabi'.pad(8)           -> ' wasabi '
     *   'wasabi'.padLeft(8)       -> '  wasabi'
     *   'wasabi'.padRight(8)      -> 'wasabi  '
     *   'wasabi'.padRight(8, '-') -> 'wasabi--'
     *
     ***/
    'pad': function(num, padding) {
      var half, front, back;
      num   = checkRepeatRange(num);
      half  = max(0, num - this.length) / 2;
      front = floor(half);
      back  = ceil(half);
      return padString(front, padding) + this + padString(back, padding);
    },

    'padLeft': function(num, padding) {
      num = checkRepeatRange(num);
      return padString(max(0, num - this.length), padding) + this;
    },

    'padRight': function(num, padding) {
      num = checkRepeatRange(num);
      return this + padString(max(0, num - this.length), padding);
    },

    /***
     * @method first([n] = 1)
     * @returns String
     * @short Returns the first [n] characters of the string.
     * @example
     *
     *   'lucky charms'.first()   -> 'l'
     *   'lucky charms'.first(3)  -> 'luc'
     *
     ***/
    'first': function(num) {
      return stringFirst(this, num);
    },

    /***
     * @method last([n] = 1)
     * @returns String
     * @short Returns the last [n] characters of the string.
     * @example
     *
     *   'lucky charms'.last()   -> 's'
     *   'lucky charms'.last(3)  -> 'rms'
     *
     ***/
    'last': function(num) {
      return stringLast(this, num);
    },

    /***
     * @method toNumber([base] = 10)
     * @returns Number
     * @short Converts the string into a number.
     * @extra Any value with a "." fill be converted to a floating point value, otherwise an integer.
     * @example
     *
     *   '153'.toNumber()    -> 153
     *   '12,000'.toNumber() -> 12000
     *   '10px'.toNumber()   -> 10
     *   'ff'.toNumber(16)   -> 255
     *
     ***/
    'toNumber': function(base) {
      return stringToNumber(this, base);
    },

    /***
     * @method capitalize([all] = false)
     * @returns String
     * @short Capitalizes the first character in the string and downcases all other letters.
     * @extra If [all] is true, all words in the string will be capitalized.
     * @example
     *
     *   'hello'.capitalize()           -> 'Hello'
     *   'hello kitty'.capitalize()     -> 'Hello kitty'
     *   'hello kitty'.capitalize(true) -> 'Hello Kitty'
     *
     *
     ***/
    'capitalize': function(all) {
      return capitalize(this, all);
    },

    /***
     * @method assign(<obj1>, <obj2>, ...)
     * @returns String
     * @short Assigns variables to tokens in a string, demarcated with `{}`.
     * @extra If an object is passed, it's properties can be assigned using the object's keys (i.e. {name}). If a non-object (string, number, etc.) is passed it can be accessed by the argument number beginning with {1} (as with regex tokens). Multiple objects can be passed and will be merged together (original objects are unaffected).
     * @example
     *
     *   'Welcome, Mr. {name}.'.assign({ name: 'Franklin' })   -> 'Welcome, Mr. Franklin.'
     *   'You are {1} years old today.'.assign(14)             -> 'You are 14 years old today.'
     *   '{n} and {r}'.assign({ n: 'Cheech' }, { r: 'Chong' }) -> 'Cheech and Chong'
     *
     ***/
    'assign': function() {
      return stringAssign(this, arguments);
    },

    /***
     * @method trim[Side]()
     * @returns String
     * @short Removes leading or trailing whitespace from the string.
     * @extra Whitespace is defined as line breaks, tabs, and any character in the "Space, Separator" Unicode category, conforming to the the ES5 spec.
     *
     * @set
     *   trimLeft
     *   trimRight
     *
     * @example
     *
     *   '   wasabi   '.trimLeft()  -> 'wasabi   '
     *   '   wasabi   '.trimRight() -> '   wasabi'
     *
     ***/

    'trimLeft': function() {
      return this.replace(regexp('^['+getTrimmableCharacters()+']+'), '');
    },

    'trimRight': function() {
      return this.replace(regexp('['+getTrimmableCharacters()+']+$'), '');
    }

  });

  /***
   * @method insert()
   * @alias add
   *
   ***/
  alias(string, 'insert', 'add');

  buildStartEndsWith();
  buildBase64('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=');

