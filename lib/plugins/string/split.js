/***
 * @method split([separator], [limit])
 * @author andrewplummer
 * @returns Array
 * @dependencies None
 * @short Split a string into an array. This method is native to Javascript, but this plugin patches it to provide cross-browser reliability when splitting on a regex.
 * @example
 *
 *   'comma,separated,values'.split(',') -> ['comma','separated','values']
 *   'a,b|c>d'.split(/[,|>]/)            -> ['multi','separated','values']
 *
 ***/

// Many thanks to Steve Levithan here for a ton of inspiration and work dealing with
// cross browser Regex splitting.  http://blog.stevenlevithan.com/archives/cross-browser-split

String.extend({

  'split': function(separator, limit) {
    var output = [];
    var lastLastIndex = 0;
    var flags;
    var getRegExpFlags = function(reg, add) {
      var flags = reg.toString().match(/[^/]*$/)[0];
      if(add) {
        flags = (flags + add).split('').sort().join('').replace(/([gimy])\1+/g, '$1');
      }
      return flags;
    }
    var flags = getRegExpFlags(separator, 'g');
    // make `global` and avoid `lastIndex` issues by working with a copy
    var separator = new RegExp(separator.source, flags);
    var separator2, match, lastIndex, lastLength;
    if(!RegExp.NPCGSupport) {
      // doesn't need /g or /y, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    if(limit === undefined || limit < 0) {
      limit = Infinity;
    } else {
      limit = Math.floor(limit);
      if(!limit) return [];
    }

    while (match = separator.exec(this)) {
      lastIndex = match.index + match[0].length; // `separator.lastIndex` is not reliable cross-browser
      if(lastIndex > lastLastIndex) {
        output.push(this.slice(lastLastIndex, match.index));
        // fix browsers whose `exec` methods don't consistently return `undefined` for nonparticipating capturing groups
        if(!RegExp.NPCGSupport && match.length > 1) {
          match[0].replace(separator2, function () {
            for (var i = 1; i < arguments.length - 2; i++) {
              if(arguments[i] === undefined) {
                match[i] = undefined;
              }
            }
          });
        }
        if(match.length > 1 && match.index < this.length) {
          array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if(output.length >= limit) {
          break;
        }
      }
      if(separator.lastIndex === match.index) {
        separator.lastIndex++; // avoid an infinite loop
      }
    }
    if(lastLastIndex === this.length) {
      if(lastLength || !separator.test('')) output.push('');
    } else {
      output.push(this.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  }

}, function(s) {
  return Object.prototype.toString.call(s) === '[object RegExp]';
});


