
// Extra methods for the Array class.

/***
 * @method toSentence([conjunction] = 'and'])
 * @returns String
 * @short Builds a grammatical list from the array
 * @extra A custom string [conjuction] can be supplied for localization, 'and' is used if not a string.
 * @example
 *
 *   ['a', 'b', 'c'].toSentence()                      -> 'a, b and c';
 *   ['a', 2, {c:3}].toSentence()                      -> 'a, 2 and [object Object]';
 *   ['Lundi', 'Mardi', 'Mercredi'].toSentence('et')   -> 'Lundi, Mardi et Mercredi';
 *
 ***/

Array.extend({

  'toSentence': function(conjunction) {
    var sentence = "",
      twoWordConjunction,
      lastWordConjunction;

    // Quick escape
    if (this.length === 0) return sentence;

    if (Object.isString(conjunction) === false) {
      conjunction = "and";
    }

    twoWordConjunction = ' ' + conjunction + ' ';
    lastWordConjunction = ' ' + conjunction + ' ';

    switch (this.length) {
      case 1:
        sentence = this[0];
      break;
      case 2:
        sentence = this.join(twoWordConjunction);
      break;
      default:
        sentence = this.first(this.length - 1).join(', ') + lastWordConjunction + this.last();
      break;
    };

    return sentence;
  }

});
