/***
 * @method toSentence([conjunction] = 'and')
 * @author nadinengland
 * @returns String
 * @dependencies Array
 * @short Builds a grammatical list from the array.
 * @extra A custom string [conjuction] can be supplied for localization, 'and' is used if not a string.
 * @example
 *
 *   ['a', 'b', 'c'].toSentence()                      -> 'a, b and c';
 *   ['a', 2, {c:3}].toSentence()                      -> 'a, 2 and [object Object]';
 *   ['Lundi', 'Mardi', 'Mercredi'].toSentence('et')   -> 'Lundi, Mardi et Mercredi';
 *
 ***/

(function() {

  var hasExports = typeof module !== 'undefined' && module.exports;

  if(hasExports) {
    Sugar = require('sugar-core');
  }

  Sugar.extend(Array, {

    'toSentence': function(conjunction) {
      var sentence = "",
        twoWordConjunction,
        lastWordConjunction;

      // Quick escape
      if (this.length === 0) return sentence;

      if (typeof conjunction !== 'string') {
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
          sentence = this.slice(0, this.length - 1).join(', ') + lastWordConjunction + this[this.length - 1];
        break;
      };

      return sentence;
    }

  });

  if(hasExports) {
    module.exports = Sugar.Array.toSentence;
  }

})();
