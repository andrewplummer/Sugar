'use strict';

/***
 * @package ES7
 * @description Methods that provide some basic ES7 compatibility. This package is intended to provide the base for Sugar functionality, not as a full polyfill suite.
 *
 ***/

/*** @namespace Array */


function sameValueZero(a, b) {
  if (isRealNaN(a)) {
    return isRealNaN(b);
  }
  return a === b ? a !== 0 || 1 / a === 1 / b : false;
}

defineInstancePolyfill(sugarArray, {

  /***
   * @method includes(<search>, [fromIndex] = 0)
   * @returns Boolean
   * @short Returns true if <search> is contained within the array.
   * @extra Search begins at [fromIndex], which defaults to the beginning of the array.
   * @polyfill
   * @example
   *
   *   [1,2,3].includes(2)    -> true
   *   [1,2,3].includes(4)    -> false
   *   [1,2,3].includes(2, 3) -> false
   *
   ***/
  'includes': function(search) {
    // Force compiler to respect argument length.
    var argLen = arguments.length, fromIndex = arguments[1];
    var arr = this, len;
    if (isString(arr)) return arr.includes(search, fromIndex);
    fromIndex = fromIndex ? fromIndex.valueOf() : 0;
    len = arr.length;
    if (fromIndex < 0) {
      fromIndex = max(0, fromIndex + len);
    }
    for (var i = fromIndex; i < len; i++) {
      if (sameValueZero(search, arr[i])) {
        return true;
      }
    }
    return false;
  }

});
