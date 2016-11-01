'use strict';

/***
 * @module RegExp
 * @description RegExp escaping and flag manipulation.
 *
 * Note here that methods on the RegExp class like .exec and .test will fail in
 * the current version of SpiderMonkey being used by CouchDB when using
 * shorthand regex notation like /foo/. This is the reason for the intermixed
 * use of shorthand and compiled regexes here. If you're using JS in CouchDB, it
 * is safer to ALWAYS compile your regexes from a string.
 *
 ***/

defineStatic(sugarRegExp, {

  /***
   * @method escape([str] = '')
   * @returns String
   * @static
   * @short Escapes all RegExp tokens in a string.
   *
   * @example
   *
   *   RegExp.escape('really?')      -> 'really\?'
   *   RegExp.escape('yes.')         -> 'yes\.'
   *   RegExp.escape('(not really)') -> '\(not really\)'
   *
   * @param {string} str
   *
   ***/
  'escape': function(str) {
    return escapeRegExp(str);
  }

});

defineInstance(sugarRegExp, {

  /***
   * @method getFlags()
   * @returns String
   * @short Returns the flags of the regex as a string.
   *
   * @example
   *
   *   /texty/gim.getFlags() -> 'gim'
   *
   ***/
  'getFlags': function(r) {
    return getRegExpFlags(r);
  },

  /***
   * @method setFlags(flags)
   * @returns RegExp
   * @short Creates a copy of the regex with `flags` set.
   *
   * @example
   *
   *   /texty/.setFlags('gim') -> now has global, ignoreCase, and multiline set
   *
   * @param {string} flags
   *
   ***/
  'setFlags': function(r, flags) {
    return RegExp(r.source, flags);
  },

  /***
   * @method addFlags(flags)
   * @returns RegExp
   * @short Creates a copy of the regex with `flags` added.
   *
   * @example
   *
   *   /texty/.addFlags('g')  -> /texty/g
   *   /texty/.addFlags('im') -> /texty/im
   *
   * @param {string} flags
   *
   ***/
  'addFlags': function(r, flags) {
    return RegExp(r.source, getRegExpFlags(r, flags));
  },

  /***
   * @method removeFlags(flags)
   * @returns RegExp
   * @short Creates a copy of the regex with `flags` removed.
   *
   * @example
   *
   *   /texty/gim.removeFlags('g')  -> /texty/im
   *   /texty/gim.removeFlags('im') -> /texty/g
   *
   * @param {string} flags
   *
   ***/
  'removeFlags': function(r, flags) {
    var reg = allCharsReg(flags);
    return RegExp(r.source, getRegExpFlags(r).replace(reg, ''));
  }

});
