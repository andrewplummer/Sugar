  'use strict';

  /***
   * @package RegExp
   * @dependency core
   * @description Escaping regexes and manipulating their flags.
   *
   * Note here that methods on the RegExp class like .exec and .test will fail in the current version of SpiderMonkey being
   * used by CouchDB when using shorthand regex notation like /foo/. This is the reason for the intermixed use of shorthand
   * and compiled regexes here. If you're using JS in CouchDB, it is safer to ALWAYS compile your regexes from a string.
   *
   ***/

  defineStatic(sugarRegExp, {

   /***
    * @method RegExp.escape(<str> = '')
    * @returns String
    * @short Escapes all RegExp tokens in a string.
    * @example
    *
    *   RegExp.escape('really?')      -> 'really\?'
    *   RegExp.escape('yes.')         -> 'yes\.'
    *   RegExp.escape('(not really)') -> '\(not really\)'
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
    * @example
    *
    *   /texty/gim.getFlags() -> 'gim'
    *
    ***/
    'getFlags': function(r) {
      return getRegExpFlags(r);
    },

   /***
    * @method setFlags(<flags>)
    * @returns RegExp
    * @short Sets the flags on a regex and retuns a copy.
    * @example
    *
    *   /texty/.setFlags('gim') -> now has global, ignoreCase, and multiline set
    *
    ***/
    'setFlags': function(r, flags) {
      return RegExp(r.source, flags);
    },

   /***
    * @method addFlags(<flags>)
    * @returns RegExp
    * @short Adds any flag in the <flags> string to the regex.
    * @example
    *
    *   /texty/.addFlags('g')  -> /texty/g
    *   /texty/.addFlags('im') -> /texty/im
    *
    ***/
    'addFlags': function(r, flags) {
      return RegExp(r.source, getRegExpFlags(r, flags));
    },

   /***
    * @method removeFlags(<flags>)
    * @returns RegExp
    * @short Removes any flag in the <flags> string from the regex.
    * @example
    *
    *   /texty/gim.removeFlags('g')  -> /texty/im
    *   /texty/gim.removeFlags('im') -> /texty/g
    *
    ***/
    'removeFlags': function(r, flags) {
      var reg = RegExp('[' + flags + ']', 'g');
      return RegExp(r.source, getRegExpFlags(r).replace(reg, ''));
    }

  });
