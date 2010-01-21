new Test.Unit.Runner({
  testRegExpEscape: function() {
    this.assertEqual('word', RegExp.escape('word'));
    this.assertEqual('\\/slashes\\/', RegExp.escape('/slashes/'));
    this.assertEqual('\\\\backslashes\\\\', RegExp.escape('\\backslashes\\'));
    this.assertEqual('\\\\border of word', RegExp.escape('\\border of word'));

    this.assertEqual('\\(\\?\\:non-capturing\\)', RegExp.escape('(?:non-capturing)'));
    this.assertEqual('non-capturing', new RegExp(RegExp.escape('(?:') + '([^)]+)').exec('(?:non-capturing)')[1]);

    this.assertEqual('\\(\\?\\=positive-lookahead\\)', RegExp.escape('(?=positive-lookahead)'));
    this.assertEqual('positive-lookahead', new RegExp(RegExp.escape('(?=') + '([^)]+)').exec('(?=positive-lookahead)')[1]);

    this.assertEqual('\\(\\?<\\=positive-lookbehind\\)', RegExp.escape('(?<=positive-lookbehind)'));
    this.assertEqual('positive-lookbehind', new RegExp(RegExp.escape('(?<=') + '([^)]+)').exec('(?<=positive-lookbehind)')[1]);

    this.assertEqual('\\(\\?\\!negative-lookahead\\)', RegExp.escape('(?!negative-lookahead)'));
    this.assertEqual('negative-lookahead', new RegExp(RegExp.escape('(?!') + '([^)]+)').exec('(?!negative-lookahead)')[1]);

    this.assertEqual('\\(\\?<\\!negative-lookbehind\\)', RegExp.escape('(?<!negative-lookbehind)'));
    this.assertEqual('negative-lookbehind', new RegExp(RegExp.escape('(?<!') + '([^)]+)').exec('(?<!negative-lookbehind)')[1]);

    this.assertEqual('\\[\\\\w\\]\\+', RegExp.escape('[\\w]+'));
    this.assertEqual('character class', new RegExp(RegExp.escape('[') + '([^\\]]+)').exec('[character class]')[1]);

    this.assertEqual('<div>', new RegExp(RegExp.escape('<div>')).exec('<td><div></td>')[0]);

    this.assertEqual('false', RegExp.escape(false));
    this.assertEqual('undefined', RegExp.escape());
    this.assertEqual('null', RegExp.escape(null));
    this.assertEqual('42', RegExp.escape(42));

    this.assertEqual('\\\\n\\\\r\\\\t', RegExp.escape('\\n\\r\\t'));
    this.assertEqual('\n\r\t', RegExp.escape('\n\r\t'));
    this.assertEqual('\\{5,2\\}', RegExp.escape('{5,2}'));

    this.assertEqual(
      '\\/\\(\\[\\.\\*\\+\\?\\^\\=\\!\\:\\$\\{\\}\\(\\)\\|\\[\\\\\\]\\\\\\\/\\\\\\\\\\]\\)\\/g',
      RegExp.escape('/([.*+?^=!:${}()|[\\]\\/\\\\])/g')
    );
  }
});