

/***
 * @method toSentence([fn(<n>)], [conjunction] = true [useOnly] = true)
 * @returns String
 * @short Builds a grammatical list from the array
 * @extra [fn] will be called on every object in the array. The default handler will be used if [fn] is not specified or is false. Supplying [useOnly] will omit 'only' for single length arrays. Use a custom [conjuction] for localization.
 * @example
 *
 *   ['a', 'b', 'c'].toSentence()               -> 'a, b and c';
 *   ['a'].toSentence()                         -> 'a only';
 *   ['a', 2, {c:3}].toSentence()               -> 'a, 2 and [object Object]';
 *   ['a', 'b', 'c'].toSentence(function(n) {
 *    // returns 'aa, bb and cc'
 *     return n.repeat(2);
 *   })
 *    ['a', 'b', 'c'].toSentence(false, 'et')    -> 'a, b, et c';
 *   ['a'].toSentence(false, false, false)      -> 'a';
 *
 ***/

Array.extend({

  'toSentence': function(handler, conjunction, useOnly) {
    var sentence = "";

    if (Object.isFunction(handler) == false || handler === false) {
      handler = function(n) { return Object.isString(n) ? n : String(n); };
    }

    if (Object.isString(conjunction) == false || conjunction === false) conjunction = "and";
    if (Object.isBoolean(useOnly) == false) useOnly = true;

    for (var i = 0; i < this.length; i++) {
      sentence += handler(this[i]);

      if (useOnly == true && this.length == 1) sentence += ' only';
      else if (i < (this.length - 2)) sentence += ', ';
      else if (i == (this.length - 2)) sentence += ' ' + conjunction + ' ';
    }

    return sentence;
  }

});

