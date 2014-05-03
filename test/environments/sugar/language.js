package('String', function () {

  // String#is/has[Script]

  method('isKatakana', function() {
    test('ア', true);
    test('ｱ', true);
    test('ァ', true);
    test('ah', false);
    test('アイカムインピース', true);
    test('アイカムinピース', false);
    test('アイカム イン ピース', true);
  });

  method('hasKatakana', function() {
    test('ア', true);
    test('ｱ', true);
    test('ah', false);
    test('aアh', true);
    test('aｱh', true);
    test('アイカムインピース', true);
    test('アイカムinピース', true);
  });


  method('isHiragana', function() {
    test('あ', true);
    test('ぁ', true);
    test('ah', false);
    test('あいかむいんぴーす', true);
    test('あいかむinぴーす', false);
    test('あいかむ in ぴーす', false);
    test('アイカム イン ピース', false);
  });


  method('hasHiragana', function() {
    test('あ', true);
    test('ぁ', true);
    test('ah', false);
    test('aあh', true);
    test('aぁh', true);
    test('あいかむいんぴーす', true);
    test('あいかむinぴーす', true);
  });


  method('isKana', function() {
    test('', false, 'blank');
    test('あいうえお', true, 'hiragana');
    test('アイウエオ', true, 'katakana');
    test('あうえおアイウエオ', true, 'hiragana and katakan');
    test('あうえおaeiouアイウエオ', false, 'hiragana, katakana, and romaji');
    test('  あいうえお  ', true, 'hiragana with whitespace');
    test('  アイウエオ \n ', true, 'katakana with whitespace and a newline');
  });

  method('hasKana', function() {
    test('', false, 'blank');
    test('aeiou', false, 'romaji');
    test('あいうえお', true, 'hiragana');
    test('アイウエオ', true, 'katakana');
    test('あうえおアイウエオ', true, 'hiragana and katakana');
    test('あうえおaeiouアイウエオ', true, 'hiragana, katakana, and romaji');
    test('aeiouアaeiou', true, 'katakana with romaji outside');
    test('aeiouaeiou', false, 'romaji all the way');
  });

  method('isHan', function() {
    test('', false, 'blank');
    test('aeiou', false, 'romaji');
    test('あいうえお', false, 'hiragana');
    test('アイウエオ', false, 'katakana');
    test('あうえおaeiouアイウエオ', false, 'hiragana, katakana, and romaji');
    test('合コン', false, 'mixed kanji and katakana');
    test('語学', true, 'kango');
    test('庭には二羽鶏がいる。', false, 'full sentence');
    test(' 語学 ', true, 'kango with whitespace');
    test(' 語学\t ', true, 'kango with whitespace and tabs');
  });

  method('hasHan', function() {
    test('', false, 'blank');
    test('aeiou', false, 'romaji');
    test('あいうえお', false, 'hiragana');
    test('アイウエオ', false, 'katakana');
    test('あうえおaeiouアイウエオ', false, 'hiragana, katakana, and romaji');
    test('合コン', true, 'mixed kanji and katakana');
    test('語学', true, 'kango');
    test('庭には二羽鶏がいる。', true, 'full sentence');
    test(' 語学 ', true, 'kango with whitespace');
    test(' 語学\t ', true, 'kango with whitespace and tabs');
  });


  method('isKanji', function() {
    test('', false, 'blank');
    test('aeiou', false, 'romaji');
    test('あいうえお', false, 'hiragana');
    test('アイウエオ', false, 'katakana');
    test('あうえおaeiouアイウエオ', false, 'hiragana, katakana, and romaji');
    test('合コン', false, 'mixed kanji and katakana');
    test('語学', true, 'kango');
    test('庭には二羽鶏がいる。', false, 'full sentence');
    test(' 語学 ', true, 'kango with whitespace');
    test(' 語学\t ', true, 'kango with whitespace and tabs');
    test(' 語 学\t ', true, 'middle whitespace is also not counted');
  });

  method('hasKanji', function() {
    test('', false, ' blank');
    test('aeiou', false, ' romaji');
    test('あいうえお', false, ' hiragana');
    test('アイウエオ', false, ' katakana');
    test('あうえおaeiouアイウエオ', false, ' hiragana, katakana, and romaji');
    test('合コン', true, ' mixed kanji and katakana');
    test('語学', true, ' kango');
    test('庭には二羽鶏がいる。', true, ' full sentence');
    test(' 語学 ', true, ' kango with whitespace');
    test(' 語学\t ', true, ' kango with whitespace and tabs');
  });

  method('isHangul', function() {
    test('모', true, 'character');
    test('난 뻔데기를 싫어 한 사람 이다...너는?', false, 'full sentence');
    test('안녕 하세요', true, 'how are you?');
    test('ㅠブラじゃない！', false, 'mixed with kana');
    test('이것도 한굴이야', true, 'spaces do not count');
  });

  method('hasHangul', function() {
    test('모', true, 'character');
    test('난 뻔데기를 싫어 한 사람 이다...너는?', true, 'full sentence');
    test('안녕 하세요.', true, 'how are you?');
    test('ㅠブラじゃない！', false, 'mixed with kana');
  });

  method('isHebrew', function() {
    test('שְׂרָאֵל', true, 'basic');
  });

  method('hasHebrew', function() {
    test('שְׂרָאֵל', true, 'basic');
  });

  method('isDevanagari', function() {
    test('सभी मनुष्यों', true, 'basic');
  });

  method('hasDevanagari', function() {
    test('सभी मनुष्यों', true, 'basic');
  });

  method('isLatin', function() {
    test('ā', true, 'Extended set A');
    test('Ɖ', true, 'Extended set B');
    test('これはミックスですよね。', false, 'Katakana hiragana mix');
    test("l'année dernière", true, 'French');
    test('これは one big mix ですよね。', false, 'Hiragana romaji mix');
  });

  method('hasLatin', function() {
    test("l'année dernière", true, 'French');
    test('これは one big mix ですよね。', true, 'Hiragana romaji mix');
    test('ā', true, 'Extended set A');
    test('Ɖ', true, 'Extended set B');
    test('これはミックスですよね。', false, 'Katakana hiragana mix');
  });



  var allZenkakuChars = '　、。，．・：；？！ー～／｜（）［］｛｝「」＋－＝＜＞￥＄￠￡％＃＆＊＠０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヲン';
  var allHankakuChars = ' ､｡,.･:;?!ｰ~/|()[]{}｢｣+-=<>¥$¢£%#&*@0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzｧｱｨｲｩｳｪｴｫｵｶｶﾞｷｷﾞｸｸﾞｹｹﾞｺｺﾞｻｻﾞｼｼﾞｽｽﾞｾｾﾞｿｿﾞﾀﾀﾞﾁﾁﾞｯﾂﾂﾞﾃﾃﾞﾄﾄﾞﾅﾆﾇﾈﾉﾊﾊﾞﾊﾟﾋﾋﾞﾋﾟﾌﾌﾞﾌﾟﾍﾍﾞﾍﾟﾎﾎﾞﾎﾟﾏﾐﾑﾒﾓｬﾔｭﾕｮﾖﾗﾘﾙﾚﾛﾜｦﾝ';


  method('hankaku', function() {

    test('カ', 'ｶ', 'カ');
    test('ガ', 'ｶﾞ', 'dakuten | ガ');
    test('', '', 'blank');
    test('カタカナ', 'ｶﾀｶﾅ', 'katakana');
    test('こんにちは。ヤマダタロウです。', 'こんにちは｡ﾔﾏﾀﾞﾀﾛｳです｡', ' hankaku katakana inside a string');
    test('こんにちは。ＴＡＲＯ　ＹＡＭＡＤＡです。', 'こんにちは｡TARO YAMADAです｡', 'hankaku romaji inside a string');
    test('　', ' ', 'spaces');
    test('　', ['p'], '　', 'punctuation | spaces');
    test('　', ['s'], ' ', 'spaces');

    var barabara = 'こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！（笑）';

    test(barabara, 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)', 'modes | full conversion');
    test(barabara, ['all'], 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)', 'modes all | full conversion');
    test(barabara, ['a'], 'こんにちは。タロウ　YAMADAです。１８才です！（笑）', 'modes | romaji only');
    test(barabara, ['n'], 'こんにちは。タロウ　ＹＡＭＡＤＡです。18才です！（笑）', 'modes | numbers only');
    test(barabara, ['k'], 'こんにちは。ﾀﾛｳ　ＹＡＭＡＤＡです。１８才です！（笑）', 'modes | katakana only');
    test(barabara, ['p'], 'こんにちは｡タロウ　ＹＡＭＡＤＡです｡１８才です!(笑)', 'modes | punctuation only');
    test(barabara, ['s'], 'こんにちは。タロウ ＹＡＭＡＤＡです。１８才です！（笑）', 'modes | spaces only');

    test(barabara, ['an'], 'こんにちは。タロウ　YAMADAです。18才です！（笑）', 'modes | alphabet and numbers');
    test(barabara, ['ak'], 'こんにちは。ﾀﾛｳ　YAMADAです。１８才です！（笑）', 'modes | alphabet and katakana');
    test(barabara, ['as'], 'こんにちは。タロウ YAMADAです。１８才です！（笑）', 'modes | alphabet and spaces');
    test(barabara, ['ap'], 'こんにちは｡タロウ　YAMADAです｡１８才です!(笑)', 'modes | alphabet and punctuation');

    test(barabara, ['na'], 'こんにちは。タロウ　YAMADAです。18才です！（笑）', 'modes reverse | alphabet and numbers');
    test(barabara, ['ka'], 'こんにちは。ﾀﾛｳ　YAMADAです。１８才です！（笑）', 'modes reverse | alphabet and katakana');
    test(barabara, ['sa'], 'こんにちは。タロウ YAMADAです。１８才です！（笑）', 'modes reverse | alphabet and spaces');
    test(barabara, ['pa'], 'こんにちは｡タロウ　YAMADAです｡１８才です!(笑)', 'modes reverse | alphabet and punctuation');

    test(barabara, ['alphabet'], 'こんにちは。タロウ　YAMADAです。１８才です！（笑）', 'modes full | alphabet');
    test(barabara, ['numbers'], 'こんにちは。タロウ　ＹＡＭＡＤＡです。18才です！（笑）', 'modes full | numbers');
    test(barabara, ['katakana'], 'こんにちは。ﾀﾛｳ　ＹＡＭＡＤＡです。１８才です！（笑）', 'modes full | katakana');
    test(barabara, ['punctuation'], 'こんにちは｡タロウ　ＹＡＭＡＤＡです｡１８才です!(笑)', 'modes full | punctuation');
    test(barabara, ['spaces'], 'こんにちは。タロウ ＹＡＭＡＤＡです。１８才です！（笑）', 'modes full | spaces');

    test('－', '-', 'Full-width hyphen should be converted to half-width');

    test('ー', ['n'], '-', 'KATAKANA-HIRAGANA PROLONGED SOUND MARK converted to hyphen in number mode');
    test('−', ['n'], '-', 'MINUS SIGN converted to hyphen in number mode');

    test('ー', ['a'], 'ー', 'KATAKANA-HIRAGANA PROLONGED SOUND MARK not converted to hyphen in alphabet mode');
    test('−', ['a'], '−', 'MINUS SIGN not converted to hyphen in alphabet mode');

    test('ー', 'ｰ', 'KATAKANA-HIRAGANA PROLONGED SOUND MARK not converted to hyphen in "all" mode');
    test('−', '-', 'MINUS SIGN still converted to hyphen in "all" mode');

    test(allZenkakuChars, allHankakuChars, 'everything');
  });

  method('zenkaku', function() {

    test('', '', 'blank');
    test('ｶ', 'カ', 'ｶ');
    test('ｶﾞ', 'ガ', 'dakuten | ｶ');
    test('ｶﾀｶﾅ', 'カタカナ', 'katakana');
    test(' ', '　', 'spaces | all');
    test(' ', ['s'], '　', 'spaces | s');
    test(' ', ['p'], ' ', 'spaces | p');

    var barabara = 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)';

    test(barabara, 'こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！（笑）', 'modes | full conversion');
    test(barabara, ['a'], 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡18才です!(笑)', 'modes | alphabet');
    test(barabara, ['n'], 'こんにちは｡ﾀﾛｳ YAMADAです｡１８才です!(笑)', 'modes | number');
    test(barabara, ['k'], 'こんにちは｡タロウ YAMADAです｡18才です!(笑)', 'modes | katakana');
    test(barabara, ['p'], 'こんにちは。ﾀﾛｳ YAMADAです。18才です！（笑）', 'modes | punctuation');
    test(barabara, ['s'], 'こんにちは｡ﾀﾛｳ　YAMADAです｡18才です!(笑)', 'modes | spaces');

    test(barabara, ['an'], 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡１８才です!(笑)', 'modes | alphabet and numbers');
    test(barabara, ['ak'], 'こんにちは｡タロウ ＹＡＭＡＤＡです｡18才です!(笑)', 'modes | alphabet and katakana');
    test(barabara, ['as'], 'こんにちは｡ﾀﾛｳ　ＹＡＭＡＤＡです｡18才です!(笑)', 'modes | alphabet and spaces');
    test(barabara, ['ap'], 'こんにちは。ﾀﾛｳ ＹＡＭＡＤＡです。18才です！（笑）', 'modes | alphabet and punctuation');

    test(barabara, ['na'], 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡１８才です!(笑)', 'modes reverse | alphabet and numbers');
    test(barabara, ['ka'], 'こんにちは｡タロウ ＹＡＭＡＤＡです｡18才です!(笑)', 'modes reverse | alphabet and katakana');
    test(barabara, ['sa'], 'こんにちは｡ﾀﾛｳ　ＹＡＭＡＤＡです｡18才です!(笑)', 'modes reverse | alphabet and spaces');
    test(barabara, ['pa'], 'こんにちは。ﾀﾛｳ ＹＡＭＡＤＡです。18才です！（笑）', 'modes reverse | alphabet and punctuation');

    test(barabara, ['alphabet'], 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡18才です!(笑)', 'modes full | alphabet');
    test(barabara, ['numbers'], 'こんにちは｡ﾀﾛｳ YAMADAです｡１８才です!(笑)', 'modes full | numbers');
    test(barabara, ['katakana'], 'こんにちは｡タロウ YAMADAです｡18才です!(笑)', 'modes full | katakana');
    test(barabara, ['spaces'], 'こんにちは｡ﾀﾛｳ　YAMADAです｡18才です!(笑)', 'modes full | spaces');
    test(barabara, ['punctuation'], 'こんにちは。ﾀﾛｳ YAMADAです。18才です！（笑）', 'modes full | punctuation');

    test('-', '－', 'Half-width hyphen should be converted to full-width');
    test('-', ['p'], '－', 'Half-width hyphen should be converted to full-width in punctuation mode');
    test('-', ['n'], '－', 'Half-width hyphen should be converted to full-width in number mode');
    test('ｰ', 'ー', 'KATAKANA-HIRAGANA PROLONGED SOUND MARK converted to full-width');

    test(allHankakuChars, allZenkakuChars, 'everything');
  });



  var allHiragana = 'ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖ';
  var allKatakana = 'ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ';

  method('hiragana', function() {
    var barabara = 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)';

    test('', '', 'blank');
    test('カ', 'か', 'カ');
    test('ｶﾞ', 'が', 'dakuten | ｶ');
    test('カタカナ', 'かたかな', 'from katakana');
    test('ｶﾀｶﾅ', 'かたかな', 'convert from hankaku katakana');
    test(barabara, 'こんにちは｡たろう YAMADAです｡18才です!(笑)', 'full string');
    test('ｶﾀｶﾅ', [false], 'ｶﾀｶﾅ', 'no widths |convert from hankaku katakana');
    test(barabara, [false], 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)', 'no widths | full string');
    test(run(barabara, 'zenkaku'), 'こんにちは。たろう　ＹＡＭＡＤＡです。１８才です！（笑）', 'full string to zenkaku');
    test(allKatakana, allHiragana, 'all');
  });

  method('katakana', function() {
    var barabara = 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)';

    test('', '', 'blank');
    test('か', 'カ', 'か');
    test('ひらがな', 'ヒラガナ', 'from hiragana');
    test(barabara, 'コンニチハ｡ﾀﾛｳ YAMADAデス｡18才デス!(笑)', 'full string');
    test(run(barabara, 'zenkaku'), 'コンニチハ。タロウ　ＹＡＭＡＤＡデス。１８才デス！（笑）', 'full string to zenkaku');
    test(allHiragana, allKatakana, 'all');
  });

  equal(run(run('こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！（笑）', 'katakana'), 'hankaku'), 'ｺﾝﾆﾁﾊ｡ﾀﾛｳ YAMADAﾃﾞｽ｡18才ﾃﾞｽ!(笑)', 'full string to katakana and hankaku');

});
