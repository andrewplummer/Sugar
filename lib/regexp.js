
  /***
   * RegExp module
   *
   ***/

  RegExp.NPCGSupport = /()??/.exec('')[1] === undefined; // NPCG: nonparticipating capturing group


  extend(RegExp, false, {

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
      return str.replace(/([/'*+?|()\[\]{}.^$])/g,'\\$1');
    }

  });

  extend(RegExp, true, {

   /***
    * @method setFlags(<flags>)
    * @returns RegExp
    * @short Sets the flags on a regex and retuns a copy.
    * @example
    *
    *   /texty/.setFlags('gim') -> now has global, ignoreCase, and multiline set
    *
    ***/
    'setFlags': function(flags) {
      return new RegExp(this.source, flags);
    },

   /***
    * @method addFlag(<flag>)
    * @returns RegExp
    * @short Adds <flag> to the regex.
    * @example
    *
    *   /texty/.addFlag('g') -> now has global flag set
    *
    ***/
    'addFlag': function(flag) {
      var flags = '';
      if(this.global || flag == 'g') flags += 'g';
      if(this.ignoreCase || flag == 'i') flags += 'i';
      if(this.multiline || flag == 'm') flags += 'm';
      if(this.sticky || flag == 'y') flags += 'y';
      return this.setFlags(flags);
    },

   /***
    * @method removeFlag(<flag>)
    * @returns RegExp
    * @short Removes <flag> from the regex.
    * @example
    *
    *   /texty/g.removeFlag('g') -> now has global flag removed
    *
    ***/
    'removeFlag': function(flag) {
      var flags = '';
      if(this.global && flag != 'g') flags += 'g';
      if(this.ignoreCase && flag != 'i') flags += 'i';
      if(this.multiline && flag != 'm') flags += 'm';
      if(this.sticky && flag != 'y') flags += 'y';
      return this.setFlags(flags);
    }

  });
