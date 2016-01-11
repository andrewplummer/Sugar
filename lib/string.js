'use strict';

/***
 * @module String
 * @dependency core
 * @description String manupulation, escaping, encoding, truncation, and conversion.
 *
 ***/

// Flag allowing native string methods to be enhanced
var STRING_ENHANCEMENTS_FLAG = 'enhanceString';

// Regex matching any HTML entity.
var HTML_ENTITY_REG = /&#?(x)?([\w\d]{0,5});/gi;

// Very basic HTML escaping regex.
var HTML_ESCAPE_REG = /[&<>]/g;

// Special HTML entities.
var HTML_SPECIAL_ENTITIES = {
  'lt':    '<',
  'gt':    '>',
  'amp':   '&',
  'nbsp':  ' ',
  'quot':  '"',
  'apos':  "'"
};

var STRING_FORMAT_TOKEN_REG = /(\{\{)|(\}\}?)|(\{\})|\{([^}]+)(\}?)/g;

// Words that should not be capitalized in titles
var DOWNCASED_WORDS = [
  'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at',
  'by', 'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over',
  'with', 'for'
];

// HTML tags that do not have inner content.
var HTML_VOID_ELEMENTS = [
  'area','base','br','col','command','embed','hr','img',
  'input','keygen','link','meta','param','source','track','wbr'
];

var LEFT_TRIM_REG  = RegExp('^['+ TRIM_CHARS +']+');
var RIGHT_TRIM_REG = RegExp('['+ TRIM_CHARS +']+$');
var TRUNC_REG      = RegExp('(?=[' + TRIM_CHARS + '])');


var nativeIncludes = String.prototype.includes;

// Base64
var encodeBase64, decodeBase64;

var specialEntities;

function getAcronym(str) {
  var inflector = sugarString.Inflector;
  var word = inflector && inflector.acronyms[str];
  if (isString(word)) {
    return word;
  }
}

function padString(num, padding) {
  return repeatString(isDefined(padding) ? padding : ' ', num);
}

function spacify(str) {
  return underscore(str).replace(/_/g, ' ');
}

function truncateString(str, length, from, ellipsis, split) {
  var str1, str2, len1, len2;
  if (str.length <= length) {
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
  var i, len, chunks, chunk, ret, result = [];
  if (isFunction(search)) {
    fn = search;
    search = /[\s\S]/g;
  } else if (!search) {
    search = /[\s\S]/g;
  } else if (isString(search)) {
    search = RegExp(escapeRegExp(search), 'gi');
  } else if (isRegExp(search)) {
    search = RegExp(search.source, getRegExpFlags(search, 'g'));
  }
  // Can't use exec as we need to pass the entire array into
  // the callback if it exists.
  chunks = str.match(search);
  // < IE9 has enumable properties on regex matches that will
  // confuse for..in loops, so need to dump to an array.
  if (chunks) {
    for(i = 0, len = chunks.length; i < len; i++) {
      chunk = chunks[i];
      result[i] = chunk;
      if (fn) {
        ret = fn.call(str, chunk, i, chunks);
        if (ret === false) {
          break;
        } else if (isDefined(ret)) {
          result[i] = ret;
        }
      }
    }
  }
  return result;
}

function eachWord(str, fn) {
  return stringEach(trim(str), /\S+/g, fn);
}

function stringCodes(str, fn) {
  var codes = [], i, len;
  for(i = 0, len = str.length; i < len; i++) {
    var code = str.charCodeAt(i);
    codes.push(code);
    if (fn) fn.call(str, code, i);
  }
  return codes;
}

function underscore(str) {
  var inflector = sugarString.Inflector;
  return str
    .replace(/[-\s]+/g, '_')
    .replace(inflector && inflector.acronymRegExp, function(acronym, index) {
      return (index > 0 ? '_' : '') + acronym.toLowerCase();
    })
    .replace(/([A-Z\d]+)([A-Z][a-z])/g,'$1_$2')
    .replace(/([a-z\d])([A-Z])/g,'$1_$2')
    .toLowerCase();
}

function capitalize(str, all) {
  var lastResponded;
  // Identical to /[^']/g. Trying not to break Github's syntax highlighter.
  return str.toLowerCase().replace(all ? /[^\u0027]/g : /^\S/, function(lower) {
    var upper = lower.toUpperCase(), result;
    result = lastResponded ? lower : upper;
    lastResponded = upper !== lower;
    return result;
  });
}

function reverseString(str) {
  return str.split('').reverse().join('');
}

function truncateOnWord(str, limit, fromLeft) {
  if (fromLeft) {
    return reverseString(truncateOnWord(reverseString(str), limit));
  }
  var words = str.split(TRUNC_REG);
  var count = 0;
  return filter(words, function(word) {
    count += word.length;
    return count <= limit;
  }).join('');
}

function unescapeHTML(str) {
  return str.replace(HTML_ENTITY_REG, function(full, hex, code) {
    var special = HTML_SPECIAL_ENTITIES[code];
    return special || chr(hex ? parseInt(code, 16) : +code);
  });
}

function tagIsVoid(tag) {
  return indexOf(HTML_VOID_ELEMENTS, tag.toLowerCase()) !== -1;
}

function stringReplaceAll(str, f, replace) {
  var i = 0, tokens;
  if (isString(f)) {
    f = RegExp(escapeRegExp(f), 'g');
  } else if (f && !f.global) {
    f = RegExp(f.source, getRegExpFlags(f, 'g'));
  }
  if (!replace) {
    replace = '';
  } else {
    tokens = replace;
    replace = function() {
      var t = tokens[i++];
      return t != null ? t : '';
    };
  }
  return str.replace(f, replace);
}

function replaceTags(str, find, replacement, strip) {
  var tags = isString(find) ? [find] : find, reg;
  tags = map(tags || [], function(t) {
    return escapeRegExp(t);
  }).join('|');
  reg = RegExp('<(\\/)?(' + (tags.replace('all', '') || '[^\\s>]+') + ')(\\s+[^<>]*?)?\\s*(\\/)?>', 'gi');
  return runTagReplacements(str.toString(), reg, strip, replacement);
}

function runTagReplacements(str, reg, strip, replacement, fullString) {

  var match;
  var result = '';
  var currentIndex = 0;
  var currentlyOpenTagName;
  var currentlyOpenTagAttributes;
  var currentlyOpenTagCount = 0;

  function processTag(index, tagName, attributes, tagLength, isVoid) {
    var content = str.slice(currentIndex, index), s = '', r = '';
    if (isString(replacement)) {
      r = replacement;
    } else if (replacement) {
      r = replacement.call(fullString, tagName, content, attributes, fullString) || '';
    }
    if (strip) {
      s = r;
    } else {
      content = r;
    }
    if (content) {
      content = runTagReplacements(content, reg, strip, replacement, fullString);
    }
    result += s + content + (isVoid ? '' : s);
    currentIndex = index + (tagLength || 0);
  }

  fullString = fullString || str;
  reg = RegExp(reg.source, 'gi');

  while(match = reg.exec(str)) {

    var tagName         = match[2];
    var attributes      = (match[3]|| '').slice(1);
    var isClosingTag    = !!match[1];
    var isSelfClosing   = !!match[4];
    var tagLength       = match[0].length;
    var isVoid          = tagIsVoid(tagName);
    var isOpeningTag    = !isClosingTag && !isSelfClosing && !isVoid;
    var isSameAsCurrent = tagName === currentlyOpenTagName;

    if (!currentlyOpenTagName) {
      result += str.slice(currentIndex, match.index);
      currentIndex = match.index;
    }

    if (isOpeningTag) {
      if (!currentlyOpenTagName) {
        currentlyOpenTagName = tagName;
        currentlyOpenTagAttributes = attributes;
        currentlyOpenTagCount++;
        currentIndex += tagLength;
      } else if (isSameAsCurrent) {
        currentlyOpenTagCount++;
      }
    } else if (isClosingTag && isSameAsCurrent) {
      currentlyOpenTagCount--;
      if (currentlyOpenTagCount === 0) {
        processTag(match.index, currentlyOpenTagName, currentlyOpenTagAttributes, tagLength, isVoid);
        currentlyOpenTagName       = null;
        currentlyOpenTagAttributes = null;
      }
    } else if (!currentlyOpenTagName) {
      processTag(match.index, tagName, attributes, tagLength, isVoid);
    }
  }
  if (currentlyOpenTagName) {
    processTag(str.length, currentlyOpenTagName, currentlyOpenTagAttributes);
  }
  result += str.slice(currentIndex);
  return result;
}

function numberOrIndex(str, n, from) {
  if (isString(n)) {
    n = str.indexOf(n);
    if (n === -1) {
      n = from ? str.length : 0;
    }
  }
  return n;
}

function buildBase64() {
  var encodeAscii, decodeAscii;

  function catchEncodingError(fn) {
    return function(str) {
      try {
        return fn(str);
      } catch(e) {
        return '';
      }
    };
  }

  if (typeof Buffer !== 'undefined') {
    encodeBase64 = function(str) {
      return new Buffer(str).toString('base64');
    };
    decodeBase64 = function(str) {
      return new Buffer(str, 'base64').toString('utf8');
    };
    return;
  }
  if (typeof btoa !== 'undefined') {
    encodeAscii = catchEncodingError(btoa);
    decodeAscii = catchEncodingError(atob);
  } else {
    var key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
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
    };
    decodeAscii = function(input) {
      var output = '';
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      if (input.match(base64reg)) {
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
    };
  }
  encodeBase64 = function(str) {
    return encodeAscii(unescape(encodeURIComponent(str)));
  };
  decodeBase64 = function(str) {
    return decodeURIComponent(escape(decodeAscii(str)));
  };
}

function buildSpecialEntities() {
  specialEntities = {};
  iterateOverObject(HTML_SPECIAL_ENTITIES, function(k, v) {
    specialEntities[v] = '&' + k + ';';
  });
}

function callIncludesWithRegexSupport(str, search, position) {
  if (!isRegExp(search)) {
    return nativeIncludes.call(str, search, position);
  }
  if (position) {
    str = str.slice(position);
  }
  return search.test(str);
}

defineInstance(sugarString, {

  // Enhancment to String#includes to allow a regex.
  'includes': fixArgumentLength(callIncludesWithRegexSupport)

}, [ENHANCEMENTS_FLAG, STRING_ENHANCEMENTS_FLAG]);

defineInstance(sugarString, {

  /***
   * @method at(<index>, [loop] = true)
   * @returns String or Array
   * @short Gets the character(s) at a given index.
   * @extra When [loop] is true, overshooting the end of the string (or the beginning) will begin counting from the other end. If <index> is an array, multiple elements will be returned.
   * @example
   *
   *   'jumpy'.at(0)             -> 'j'
   *   'jumpy'.at(2)             -> 'm'
   *   'jumpy'.at(5)             -> 'j'
   *   'jumpy'.at(5, false)      -> ''
   *   'jumpy'.at(-1)            -> 'y'
   *   'lucky charms'.at([2, 4]) -> ['u','k']
   *
   ***/
  'at': function(str, index, loop) {
    return getEntriesForIndexes(str, index, loop, true);
  },

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
  'escapeURL': function(str, param) {
    return param ? encodeURIComponent(str) : encodeURI(str);
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
  'unescapeURL': function(str, param) {
    return param ? decodeURI(str) : decodeURIComponent(str);
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
  'escapeHTML': function(str) {
    return str.replace(HTML_ESCAPE_REG, function(chr) {
      return specialEntities[chr];
    });
  },

   /***
    * @method unescapeHTML()
    * @returns String
    * @short Restores escaped HTML characters.
    * @example
    *
    *   '&lt;p&gt;some text&lt;/p&gt;'.unescapeHTML() -> '<p>some text</p>'
    *   'one &amp; two'.unescapeHTML()                -> 'one & two'
    *
    ***/
  'unescapeHTML': function(str) {
    return unescapeHTML(str);
  },

  /***
   * @method stripTags([tag] = 'all', [replace])
   * @returns String
   * @short Strips HTML tags from the string.
   * @extra [tag] may be an array of tags or 'all', in which case all tags will be stripped. [replace] will replace what was stripped, and may be a string or a function to handle replacements. Function arguments are %tag name%, %tag content%, %tag attributes%, and the %string% itself. If this function returns a string, then it will be used for the replacement. If it returns %undefined%, the tags will be stripped normally.
   * @example
   *
   *   '<p>just <b>some</b> text</p>'.stripTags()    -> 'just some text'
   *   '<p>just <b>some</b> text</p>'.stripTags('p') -> 'just <b>some</b> text'
   *   '<p>hi!</p>'.stripTags('p', function('all', content) {
   *     return '|' + content + '|';
   *   }); -> '|hi!|'
   *
   ***/
  'stripTags': function(str, tag, replace) {
    return replaceTags(str, tag, replace, true);
  },

  /***
   * @method removeTags([tag] = 'all', [replace])
   * @returns String
   * @short Removes HTML tags and their contents from the string.
   * @extra [tag] may be an array of tags or 'all', in which case all tags will be removed. [replace] will replace what was removed, and may be a string or a function to handle replacements. Function arguments are %tag name%, %tag content%, %tag attributes%, and the %string% itself. If this function returns a string, then it will be used for the replacement. If it returns %undefined%, the tags will be removed normally.
   * @example
   *
   *   '<p>just <b>some</b> text</p>'.removeTags()    -> ''
   *   '<p>just <b>some</b> text</p>'.removeTags('b') -> '<p>just text</p>'
   *   '<p>hi!</p>'.removeTags('p', function('all', content) {
   *     return 'bye!';
   *   }); -> 'bye!'
   *
   ***/
  'removeTags': function(str, tag, replace) {
    return replaceTags(str, tag, replace, false);
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
  'encodeBase64': function(str) {
    return encodeBase64(str);
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
  'decodeBase64': function(str) {
    return decodeBase64(str);
  },

  /***
   * @method each([search], [fn])
   * @returns Array
   * @short Runs callback [fn] against each occurence of [search] or each character if [search] is not provided.
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
  'each': function(str, search, fn) {
    return stringEach(str, search, fn);
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
  'shift': function(str, n) {
    var result = '';
    n = n || 0;
    stringCodes(str, function(c) {
      result += chr(c + n);
    });
    return result;
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
  'codes': function(str, fn) {
    return stringCodes(str, fn);
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
  'chars': function(str, search, fn) {
    return stringEach(str, search, fn);
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
  'words': function(str, fn) {
    return stringEach(trim(str), /\S+/g, fn);
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
  'lines': function(str, fn) {
    return stringEach(trim(str), /^.*$/gm, fn);
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
  'paragraphs': function(str, fn) {
    var paragraphs = trim(str).split(/[\r\n]{2,}/);
    paragraphs = map(paragraphs, function(p) {
      if (fn) var s = fn.call(p);
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
  'isBlank': function(str) {
    return trim(str).length === 0;
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
  'add': function(str, addStr, index) {
    index = isUndefined(index) ? str.length : index;
    return str.slice(0, index) + addStr + str.slice(index);
  },

  /***
   * @method remove(<f>)
   * @returns String
   * @short Removes the first occurrence of <f> in the string.
   * @extra <f> can be a either case-sensitive string or a regex. In either case only the first match will be removed. To remove multiple occurrences, use %removeAll%.
   * @example
   *
   *   'schfifty five'.remove('f')      -> 'schifty five'
   *   'schfifty five'.remove(/[a-f]/g) -> 'shfifty five'
   *
   ***/
  'remove': function(str, f) {
    return str.replace(f, '');
  },

  /***
   * @method removeAll(<f>)
   * @returns String
   * @short Removes any occurences of <f> in the string.
   * @extra <f> can be either a case-sensitive string or a regex. In either case all matches will be removed. To remove only a single occurence, use %remove%.
   * @example
   *
   *   'schfifty five'.removeAll('f')     -> 'schity ive'
   *   'schfifty five'.removeAll(/[a-f]/) -> 'shity iv'
   *
   ***/
  'removeAll': function(str, f) {
    return stringReplaceAll(str, f);
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
  'reverse': function(str) {
    return reverseString(str);
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
  'compact': function(str) {
    return trim(str).replace(/([\r\n\s　])+/g, function(match, whitespace) {
      return whitespace === '　' ? whitespace : ' ';
    });
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
  'from': function(str, from) {
    return str.slice(numberOrIndex(str, from, true));
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
  'to': function(str, to) {
    if (isUndefined(to)) to = str.length;
    return str.slice(0, numberOrIndex(str, to));
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
  'dasherize': function(str) {
    return underscore(str).replace(/_/g, '-');
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
  'underscore': function(str) {
    return underscore(str);
  },

  /***
   * @method camelize([first] = true)
   * @returns String
   * @short Converts underscores and hyphens to camel case. If [first] is true the first letter will also be capitalized.
   * @extra If the Inflections module is included acryonyms can also be defined that will be used when camelizing.
   * @example
   *
   *   'caps_lock'.camelize()              -> 'CapsLock'
   *   'moz-border-radius'.camelize()      -> 'MozBorderRadius'
   *   'moz-border-radius'.camelize(false) -> 'mozBorderRadius'
   *
   ***/
  'camelize': function(str, first) {
    return underscore(str).replace(/(^|_)([^_]+)/g, function(match, pre, word, index) {
      var acronym = getAcronym(word), cap = first !== false || index > 0;
      if (acronym) return cap ? acronym : acronym.toLowerCase();
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
  'spacify': function(str) {
    return underscore(str).replace(/_/g, ' ');
  },

  /***
   * @method titleize()
   * @returns String
   * @short Creates a title version of the string.
   * @extra Capitalizes all the words and replaces some characters in the string to create a nicer looking title. String#titleize is meant for creating pretty output.
   * @example
   *
   *   'man from the boondocks'.titleize() -> 'Man from the Boondocks'
   *   'x-men: the last stand'.titleize() -> 'X Men: The Last Stand'
   *   'TheManWithoutAPast'.titleize() -> 'The Man Without a Past'
   *   'raiders_of_the_lost_ark'.titleize() -> 'Raiders of the Lost Ark'
   *
   ***/
  'titleize': function(str) {
    var fullStopPunctuation = /[.:;!]$/, hasPunctuation, lastHadPunctuation, isFirstOrLast;
    str = spacify(str);
    if (sugarString.Inflector) {
      str = Inflector.humanize(str);
    }
    return eachWord(str, function(word, index, words) {
      hasPunctuation = fullStopPunctuation.test(word);
      isFirstOrLast = index == 0 || index == words.length - 1 || hasPunctuation || lastHadPunctuation;
      lastHadPunctuation = hasPunctuation;
      if (isFirstOrLast || indexOf(DOWNCASED_WORDS, word) === -1) {
        return capitalizeWithoutDowncasing(word, true);
      } else {
        return word;
      }
    }).join(' ');
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
  'truncate': function(str, length, from, ellipsis) {
    return truncateString(str, length, from, ellipsis);
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
  'truncateOnWord': function(str, length, from, ellipsis) {
    return truncateString(str, length, from, ellipsis, true);
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
  'pad': function(str, num, padding) {
    var half, front, back;
    num   = coercePositiveInteger(num);
    half  = max(0, num - str.length) / 2;
    front = floor(half);
    back  = ceil(half);
    return padString(front, padding) + str + padString(back, padding);
  },

  'padLeft': function(str, num, padding) {
    num = coercePositiveInteger(num);
    return padString(max(0, num - str.length), padding) + str;
  },

  'padRight': function(str, num, padding) {
    num = coercePositiveInteger(num);
    return str + padString(max(0, num - str.length), padding);
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
  'first': function(str, num) {
    if (isUndefined(num)) num = 1;
    return str.substr(0, num);
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
  'last': function(str, num) {
    if (isUndefined(num)) num = 1;
    var start = str.length - num < 0 ? 0 : str.length - num;
    return str.substr(start);
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
  'toNumber': function(str, base) {
    return stringToNumber(str, base);
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
  'capitalize': function(str, all) {
    return capitalize(str, all);
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

  'trimLeft': function(str) {
    return str.replace(LEFT_TRIM_REG, '');
  },

  'trimRight': function(str) {
    return str.replace(RIGHT_TRIM_REG, '');
  }

});


defineInstanceWithArguments(sugarString, {

  /***
   * @method replaceAll(<f>, [str1], [str2], ...)
   * @returns String
   * @short Replaces all occurences of <f> with arguments passed.
   * @extra This method is intended to be a quick way to perform multiple string replacements quickly when the replacement token differs depending on position. <f> can be either a case-sensitive string or a regex. In either case all matches will be replaced.
   * @example
   *
   *   '-x -y -z'.replaceAll('-', 1, 2, 3) -> '1x 2y 3z'
   *   'first and second'.replaceAll(/first|second/, '1st', 2nd') -> '1st and 2nd'
   *
   ***/
  'replaceAll': function(str, f, args) {
    return stringReplaceAll(str, f, args);
  },

  /***
   * @method format(<obj1>, <obj2>, ...)
   * @returns String
   * @short Replaces tokens in the string marked with `{...}` with variables.
   * @extra If a single object is passed, its properties can be accessed by keyword like `{name}`. If multiple objects or a non-object are passed, they can be accessed by the argument position like `{0}`. Deep properties can be accessed using deep property format. Braces in the string can be escaped by repeating them. For more see ???
   * @example
   *
   *   'Welcome, Mr. {name}.'.format({ name: 'Franklin' })            -> 'Welcome, Mr. Franklin.'
   *   'You are {0} years old today.'.format(14)                      -> 'You are 14 years old today.'
   *   '{0.name} and {1.name}'.format({name:'Cheech'},{name:'Chong'}) -> 'Cheech and Chong'
   *
   ***/
  'format': function(str, args) {
    var arg1 = args[0] && args[0].valueOf();
    // Unwrap if a single object is passed in.
    if (args.length === 1 && isObjectType(arg1)) {
      args = arg1;
    }
    return str.replace(STRING_FORMAT_TOKEN_REG, function(match, open, close, empty, key, closeKey) {
      if (empty) {
        // {}
        return empty;
      } else if (open) {
        // {{
        return open.charAt(0);
      } else if (close && close.length === 2) {
        // }}
        return close.charAt(0);
      } else if (close) {
        // Unclosed }
        throw new Error('Unmatched } in format string.');
      } else if (key && !closeKey) {
        // Unclosed {
        throw new Error('Unmatched { in format string.');
      }
      return deepGetProperty(args, key);
    });
  }

});


/***
 * @method insert()
 * @alias add
 *
 ***/
alias(sugarString, 'insert', 'add');

buildBase64();
buildSpecialEntities();
