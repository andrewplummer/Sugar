test('Language', function () {




  // String#is/has[Script]

  equal('ア'.isKatakana(), true, 'String#isKatakana | ア');
  equal('ｱ'.isKatakana(), true, 'String#isKatakana | ｱ');
  equal('ァ'.isKatakana(), true, 'String#isKatakana | ァ');
  equal('ah'.isKatakana(), false, 'String#isKatakana | ah');
  equal('アイカムインピース'.isKatakana(), true, 'String#isKatakana | full katakana');
  equal('アイカムinピース'.isKatakana(), false, 'String#isKatakana | full katakana with romaji');
  equal('アイカム イン ピース'.isKatakana(), true, 'String#isKatakana | full katakana with spaces');

  equal('ア'.hasKatakana(), true, 'String#hasKatakana | ア');
  equal('ｱ'.hasKatakana(), true, 'String#hasKatakana | ｱ');
  equal('ah'.hasKatakana(), false, 'String#hasKatakana | ah');
  equal('aアh'.hasKatakana(), true, 'String#hasKatakana | aアh');
  equal('aｱh'.hasKatakana(), true, 'String#hasKatakana | aｱh');
  equal('アイカムインピース'.hasKatakana(), true, 'String#hasKatakana | full katakana');
  equal('アイカムinピース'.hasKatakana(), true, 'String#hasKatakana | full katakana with romaji');


  equal('あ'.isHiragana(), true, 'String#isHiragana | あ');
  equal('ぁ'.isHiragana(), true, 'String#isHiragana | ぁ');
  equal('ah'.isHiragana(), false, 'String#isHiragana | ah');
  equal('あいかむいんぴーす'.isHiragana(), true, 'String#isHiragana | full hiragana');
  equal('あいかむinぴーす'.isHiragana(), false, 'String#isHiragana | full hiragana with romaji');
  equal('あいかむ in ぴーす'.isHiragana(), false, 'String#isHiragana | full hiragana with romaji and spaces');
  equal('アイカム イン ピース'.isHiragana(), false, 'String#isHiragana | full hiragana with spaces');


  equal('あ'.hasHiragana(), true, 'String#hasHiragana | あ');
  equal('ぁ'.hasHiragana(), true, 'String#hasHiragana | ぁ');
  equal('ah'.hasHiragana(), false, 'String#hasHiragana | ah');
  equal('aあh'.hasHiragana(), true, 'String#hasHiragana | aあh');
  equal('aぁh'.hasHiragana(), true, 'String#hasHiragana | aぁh');
  equal('あいかむいんぴーす'.hasHiragana(), true, 'String#hasHiragana | full hiragana');
  equal('あいかむinぴーす'.hasHiragana(), true, 'String#hasHiragana | full hiragana with romaji');




  equal(''.isKana(), false, 'String#isKana | blank');
  equal('あいうえお'.isKana(), true, 'String#isKana | hiragana');
  equal('アイウエオ'.isKana(), true, 'String#isKana | katakana');
  equal('あうえおアイウエオ'.isKana(), true, 'String#isKana | hiragana and katakan');
  equal('あうえおaeiouアイウエオ'.isKana(), false, 'String#isKana | hiragana, katakana, and romaji');
  equal('  あいうえお  '.isKana(), true, 'String#isKana | hiragana with whitespace');
  equal('  アイウエオ \n '.isKana(), true, 'String#isKana | katakana with whitespace and a newline');





  equal(''.hasKana(), false, 'String#hasKana | blank');
  equal('aeiou'.hasKana(), false, 'String#hasKana | romaji');
  equal('あいうえお'.hasKana(), true, 'String#hasKana | hiragana');
  equal('アイウエオ'.hasKana(), true, 'String#hasKana | katakana');
  equal('あうえおアイウエオ'.hasKana(), true, 'String#hasKana | hiragana and katakana');
  equal('あうえおaeiouアイウエオ'.hasKana(), true, 'String#hasKana | hiragana, katakana, and romaji');
  equal('aeiouアaeiou'.hasKana(), true, 'String#hasKana | katakana with romaji outside');
  equal('aeiouaeiou'.hasKana(), false, 'String#hasKana | romaji all the way');



  equal(''.isHan(), false, 'String#isHan | blank');
  equal('aeiou'.isHan(), false, 'String#isHan | romaji');
  equal('あいうえお'.isHan(), false, 'String#isHan | hiragana');
  equal('アイウエオ'.isHan(), false, 'String#isHan | katakana');
  equal('あうえおaeiouアイウエオ'.isHan(), false, 'String#isHan | hiragana, katakana, and romaji');
  equal('合コン'.isHan(), false, 'String#isHan | mixed kanji and katakana');
  equal('語学'.isHan(), true, 'String#isHan | kango');
  equal('庭には二羽鶏がいる。'.isHan(), false, 'String#isHan | full sentence');
  equal(' 語学 '.isHan(), true, 'String#isHan | kango with whitespace');
  equal(' 語学\t '.isHan(), true, 'String#isHan | kango with whitespace and tabs');



  equal(''.hasHan(), false, 'String#hasHan | blank');
  equal('aeiou'.hasHan(), false, 'String#hasHan | romaji');
  equal('あいうえお'.hasHan(), false, 'String#hasHan | hiragana');
  equal('アイウエオ'.hasHan(), false, 'String#hasHan | katakana');
  equal('あうえおaeiouアイウエオ'.hasHan(), false, 'String#hasHan | hiragana, katakana, and romaji');
  equal('合コン'.hasHan(), true, 'String#hasHan | mixed kanji and katakana');
  equal('語学'.hasHan(), true, 'String#hasHan | kango');
  equal('庭には二羽鶏がいる。'.hasHan(), true, 'String#hasHan | full sentence');
  equal(' 語学 '.hasHan(), true, 'String#hasHan | kango with whitespace');
  equal(' 語学\t '.hasHan(), true, 'String#hasHan | kango with whitespace and tabs');





  equal(''.isKanji(), false, 'String#isKanji | blank');
  equal('aeiou'.isKanji(), false, 'String#isKanji | romaji');
  equal('あいうえお'.isKanji(), false, 'String#isKanji | hiragana');
  equal('アイウエオ'.isKanji(), false, 'String#isKanji | katakana');
  equal('あうえおaeiouアイウエオ'.isKanji(), false, 'String#isKanji | hiragana, katakana, and romaji');
  equal('合コン'.isKanji(), false, 'String#isKanji | mixed kanji and katakana');
  equal('語学'.isKanji(), true, 'String#isKanji | kango');
  equal('庭には二羽鶏がいる。'.isKanji(), false, 'String#isKanji | full sentence');
  equal(' 語学 '.isKanji(), true, 'String#isKanji | kango with whitespace');
  equal(' 語学\t '.isKanji(), true, 'String#isKanji | kango with whitespace and tabs');
  equal(' 語 学\t '.isKanji(), true, 'String#isKanji | middle whitespace is also not counted');





  equal(''.hasKanji(), false, 'String#hasKanji | blank');
  equal('aeiou'.hasKanji(), false, 'String#hasKanji | romaji');
  equal('あいうえお'.hasKanji(), false, 'String#hasKanji | hiragana');
  equal('アイウエオ'.hasKanji(), false, 'String#hasKanji | katakana');
  equal('あうえおaeiouアイウエオ'.hasKanji(), false, 'String#hasKanji | hiragana, katakana, and romaji');
  equal('合コン'.hasKanji(), true, 'String#hasKanji | mixed kanji and katakana');
  equal('語学'.hasKanji(), true, 'String#hasKanji | kango');
  equal('庭には二羽鶏がいる。'.hasKanji(), true, 'String#hasKanji | full sentence');
  equal(' 語学 '.hasKanji(), true, 'String#hasKanji | kango with whitespace');
  equal(' 語学\t '.hasKanji(), true, 'String#hasKanji | kango with whitespace and tabs');


  equal('모'.isHangul(), true, 'String#isHangul | character');
  equal('난 뻔데기를 싫어 한 사람 이다...너는?'.isHangul(), false, 'String#isHangul | full sentence');
  equal('안녕 하세요'.isHangul(), true, 'String#isHangul | how are you?');
  equal('ㅠブラじゃない！'.isHangul(), false, 'String#isHangul | mixed with kana');
  equal('이것도 한굴이야'.isHangul(), true, 'String#isHangul | spaces do not count');

  equal('모'.hasHangul(), true, 'String#hasHangul | character');
  equal('난 뻔데기를 싫어 한 사람 이다...너는?'.hasHangul(), true, 'String#hasHangul | full sentence');
  equal('안녕 하세요.'.hasHangul(), true, 'String#hasHangul | how are you?');
  equal('ㅠブラじゃない！'.hasHangul(), false, 'String#hasHangul | mixed with kana');

  equal('שְׂרָאֵל'.isHebrew(), true, 'String#isHebrew');
  equal('שְׂרָאֵל'.hasHebrew(), true, 'String#hasHebrew');

  equal('सभी मनुष्यों'.hasDevanagari(), true, 'String#hasDevanagari');
  equal('सभी मनुष्यों'.isDevanagari(), true, 'String#isDevanagari');

  equal("l'année dernière".hasLatin(), true, 'String#hasLatin | French');
  equal("l'année dernière".isLatin(), true, 'String#isLatin | French');
  equal('これは one big mix ですよね。'.isLatin(), false, 'String#isLatin | Hiragana romaji mix');
  equal('これは one big mix ですよね。'.hasLatin(), true, 'String#isLatin | Hiragana romaji mix');
  equal('ā'.isLatin(), true, 'String#isLatin | Extended set A');
  equal('ā'.hasLatin(), true, 'String#isLatin | Extended set A');
  equal('Ɖ'.isLatin(), true, 'String#isLatin | Extended set B');
  equal('Ɖ'.hasLatin(), true, 'String#isLatin | Extended set B');
  equal('これはミックスですよね。'.isLatin(), false, 'String#isLatin | Katakana hiragana mix');
  equal('これはミックスですよね。'.hasLatin(), false, 'String#hasLatin | Katakana hiragana mix');





  equal('カタカナ'.hankaku(), 'ｶﾀｶﾅ', 'String#hankaku | katakana');
  equal('こんにちは。ヤマダタロウです。'.hankaku(), 'こんにちは｡ﾔﾏﾀﾞﾀﾛｳです｡', 'String#hankaku |  hankaku katakana inside a string');
  equal('こんにちは。ＴＡＲＯ　ＹＡＭＡＤＡです。'.hankaku(), 'こんにちは｡TARO YAMADAです｡', 'String#hankaku | hankaku romaji inside a string');
  equal('　'.hankaku(), ' ', 'String#hankaku | spaces');
  equal('　'.hankaku('p'), '　', 'String#hankaku | punctuation | spaces');
  equal('　'.hankaku('s'), ' ', 'String#hankaku | spaces');


  var barabara = 'こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！（笑）';
  equal(barabara.hankaku(), 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)', 'String#hankaku | modes | full conversion');
  equal(barabara.hankaku('all'), 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)', 'String#hankaku | modes all | full conversion');
  equal(barabara.hankaku('a'), 'こんにちは。タロウ　YAMADAです。１８才です！（笑）', 'String#hankaku | modes | romaji only');
  equal(barabara.hankaku('n'), 'こんにちは。タロウ　ＹＡＭＡＤＡです。18才です！（笑）', 'String#hankaku | modes | numbers only');
  equal(barabara.hankaku('k'), 'こんにちは。ﾀﾛｳ　ＹＡＭＡＤＡです。１８才です！（笑）', 'String#hankaku | modes | katakana only');
  equal(barabara.hankaku('p'), 'こんにちは｡タロウ　ＹＡＭＡＤＡです｡１８才です!(笑)', 'String#hankaku | modes | punctuation only');
  equal(barabara.hankaku('s'), 'こんにちは。タロウ ＹＡＭＡＤＡです。１８才です！（笑）', 'String#hankaku | modes | spaces only');

  equal(barabara.hankaku('an'), 'こんにちは。タロウ　YAMADAです。18才です！（笑）', 'String#hankaku | modes | alphabet and numbers');
  equal(barabara.hankaku('ak'), 'こんにちは。ﾀﾛｳ　YAMADAです。１８才です！（笑）', 'String#hankaku | modes | alphabet and katakana');
  equal(barabara.hankaku('as'), 'こんにちは。タロウ YAMADAです。１８才です！（笑）', 'String#hankaku | modes | alphabet and spaces');
  equal(barabara.hankaku('ap'), 'こんにちは｡タロウ　YAMADAです｡１８才です!(笑)', 'String#hankaku | modes | alphabet and punctuation');

  equal(barabara.hankaku('na'), 'こんにちは。タロウ　YAMADAです。18才です！（笑）', 'String#hankaku | modes reverse | alphabet and numbers');
  equal(barabara.hankaku('ka'), 'こんにちは。ﾀﾛｳ　YAMADAです。１８才です！（笑）', 'String#hankaku | modes reverse | alphabet and katakana');
  equal(barabara.hankaku('sa'), 'こんにちは。タロウ YAMADAです。１８才です！（笑）', 'String#hankaku | modes reverse | alphabet and spaces');
  equal(barabara.hankaku('pa'), 'こんにちは｡タロウ　YAMADAです｡１８才です!(笑)', 'String#hankaku | modes reverse | alphabet and punctuation');

  equal(barabara.hankaku('alphabet'), 'こんにちは。タロウ　YAMADAです。１８才です！（笑）', 'String#hankaku | modes full | alphabet');
  equal(barabara.hankaku('numbers'), 'こんにちは。タロウ　ＹＡＭＡＤＡです。18才です！（笑）', 'String#hankaku | modes full | numbers');
  equal(barabara.hankaku('katakana'), 'こんにちは。ﾀﾛｳ　ＹＡＭＡＤＡです。１８才です！（笑）', 'String#hankaku | modes full | katakana');
  equal(barabara.hankaku('punctuation'), 'こんにちは｡タロウ　ＹＡＭＡＤＡです｡１８才です!(笑)', 'String#hankaku | modes full | punctuation');
  equal(barabara.hankaku('spaces'), 'こんにちは。タロウ ＹＡＭＡＤＡです。１８才です！（笑）', 'String#hankaku | modes full | spaces');

  var allZenkakuChars = '　、。，．・：；？！ー～／｜（）［］｛｝「」＋－＝＜＞￥＄￠￡％＃＆＊＠０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヲン';
  var allHankakuChars = ' ､｡,.･:;?!ｰ~/|()[]{}｢｣+-=<>¥$¢£%#&*@0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzｧｱｨｲｩｳｪｴｫｵｶｶﾞｷｷﾞｸｸﾞｹｹﾞｺｺﾞｻｻﾞｼｼﾞｽｽﾞｾｾﾞｿｿﾞﾀﾀﾞﾁﾁﾞｯﾂﾂﾞﾃﾃﾞﾄﾄﾞﾅﾆﾇﾈﾉﾊﾊﾞﾊﾟﾋﾋﾞﾋﾟﾌﾌﾞﾌﾟﾍﾍﾞﾍﾟﾎﾎﾞﾎﾟﾏﾐﾑﾒﾓｬﾔｭﾕｮﾖﾗﾘﾙﾚﾛﾜｦﾝ';


  equal(allZenkakuChars.hankaku(), allHankakuChars, 'String#hankaku | everything');
  equal(allHankakuChars.zenkaku(), allZenkakuChars, 'String#zenkaku | everything');


  equal('ｶﾀｶﾅ'.zenkaku(), 'カタカナ', 'String#zenkaku | katakana');
  equal(' '.zenkaku(), '　', 'String#zenkaku | spaces | all');
  equal(' '.zenkaku('s'), '　', 'String#zenkaku | spaces | s');
  equal(' '.zenkaku('p'), ' ', 'String#zenkaku | spaces | p');


  barabara = 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)';

  equal(barabara.zenkaku(), 'こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！（笑）', 'String#zenkaku | modes | full conversion');
  equal(barabara.zenkaku('a'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡18才です!(笑)', 'String#zenkaku | modes | alphabet');
  equal(barabara.zenkaku('n'), 'こんにちは｡ﾀﾛｳ YAMADAです｡１８才です!(笑)', 'String#zenkaku | modes | number');
  equal(barabara.zenkaku('k'), 'こんにちは｡タロウ YAMADAです｡18才です!(笑)', 'String#zenkaku | modes | katakana');
  equal(barabara.zenkaku('p'), 'こんにちは。ﾀﾛｳ YAMADAです。18才です！（笑）', 'String#zenkaku | modes | punctuation');
  equal(barabara.zenkaku('s'), 'こんにちは｡ﾀﾛｳ　YAMADAです｡18才です!(笑)', 'String#zenkaku | modes | spaces');

  equal(barabara.zenkaku('an'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡１８才です!(笑)', 'String#zenkaku | modes | alphabet and numbers');
  equal(barabara.zenkaku('ak'), 'こんにちは｡タロウ ＹＡＭＡＤＡです｡18才です!(笑)', 'String#zenkaku | modes | alphabet and katakana');
  equal(barabara.zenkaku('as'), 'こんにちは｡ﾀﾛｳ　ＹＡＭＡＤＡです｡18才です!(笑)', 'String#zenkaku | modes | alphabet and spaces');
  equal(barabara.zenkaku('ap'), 'こんにちは。ﾀﾛｳ ＹＡＭＡＤＡです。18才です！（笑）', 'String#zenkaku | modes | alphabet and punctuation');

  equal(barabara.zenkaku('na'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡１８才です!(笑)', 'String#zenkaku | modes reverse | alphabet and numbers');
  equal(barabara.zenkaku('ka'), 'こんにちは｡タロウ ＹＡＭＡＤＡです｡18才です!(笑)', 'String#zenkaku | modes reverse | alphabet and katakana');
  equal(barabara.zenkaku('sa'), 'こんにちは｡ﾀﾛｳ　ＹＡＭＡＤＡです｡18才です!(笑)', 'String#zenkaku | modes reverse | alphabet and spaces');
  equal(barabara.zenkaku('pa'), 'こんにちは。ﾀﾛｳ ＹＡＭＡＤＡです。18才です！（笑）', 'String#zenkaku | modes reverse | alphabet and punctuation');

  equal(barabara.zenkaku('alphabet'), 'こんにちは｡ﾀﾛｳ ＹＡＭＡＤＡです｡18才です!(笑)', 'String#zenkaku | modes full | alphabet');
  equal(barabara.zenkaku('numbers'), 'こんにちは｡ﾀﾛｳ YAMADAです｡１８才です!(笑)', 'String#zenkaku | modes full | numbers');
  equal(barabara.zenkaku('katakana'), 'こんにちは｡タロウ YAMADAです｡18才です!(笑)', 'String#zenkaku | modes full | katakana');
  equal(barabara.zenkaku('spaces'), 'こんにちは｡ﾀﾛｳ　YAMADAです｡18才です!(笑)', 'String#zenkaku | modes full | spaces');
  equal(barabara.zenkaku('punctuation'), 'こんにちは。ﾀﾛｳ YAMADAです。18才です！（笑）', 'String#zenkaku | modes full | punctuation');


  equal('ガ'.hankaku(), 'ｶﾞ', 'String#hankaku | dakuten | ガ');
  equal('ｶﾞ'.zenkaku(), 'ガ', 'String#zenkaku | dakuten | ｶ');
  equal('ｶﾞ'.hiragana(), 'が', 'String#hiragana | dakuten | ｶ');


  equal('カタカナ'.hiragana(), 'かたかな', 'String#hiragana | from katakana');
  equal('ｶﾀｶﾅ'.hiragana(), 'かたかな', 'String#hiragana | convert from hankaku katakana');
  equal('ｶﾀｶﾅ'.hiragana(false), 'ｶﾀｶﾅ', 'String#hiragana | no widths |convert from hankaku katakana');
  equal(barabara.hiragana(), 'こんにちは｡たろう YAMADAです｡18才です!(笑)', 'String#hiragana | full string');
  equal(barabara.zenkaku().hiragana(), 'こんにちは。たろう　ＹＡＭＡＤＡです。１８才です！（笑）', 'String#hiragana | full string to zenkaku');
  equal(barabara.hiragana(false), 'こんにちは｡ﾀﾛｳ YAMADAです｡18才です!(笑)', 'String#hiragana | no widths | full string');


  equal('ひらがな'.katakana(), 'ヒラガナ', 'String#katakana | from hiragana');
  equal(barabara.katakana(), 'コンニチハ｡ﾀﾛｳ YAMADAデス｡18才デス!(笑)', 'String#katakana | full string');
  equal(barabara.zenkaku().katakana(), 'コンニチハ。タロウ　ＹＡＭＡＤＡデス。１８才デス！（笑）', 'String#katakana full string to zenkaku');


  equal('こんにちは。タロウ　ＹＡＭＡＤＡです。１８才です！（笑）'.katakana().hankaku(), 'ｺﾝﾆﾁﾊ｡ﾀﾛｳ YAMADAﾃﾞｽ｡18才ﾃﾞｽ!(笑)', 'String#katakana | full string to katakana and hankaku');

  var allHiragana = 'ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖ';
  var allKatakana = 'ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ';

  equal(allKatakana.hiragana(), allHiragana, 'String#hiragana | all');
  equal(allHiragana.katakana(), allKatakana, 'String#katakana | all');


  equal(''.hankaku(), '', 'String#hankaku | blank');
  equal('カ'.hankaku(), 'ｶ', 'String#hankaku | カ');
  equal(''.zenkaku(), '', 'String#zenkaku | blank');
  equal('ｶ'.zenkaku(), 'カ', 'String#zenkaku | ｶ');
  equal(''.hiragana(), '', 'String#hiragana | blank');
  equal('カ'.hiragana(), 'か', 'String#hiragana | カ');
  equal(''.katakana(), '', 'String#katakana | blank');
  equal('か'.katakana(), 'カ', 'String#katakana | か');


});
