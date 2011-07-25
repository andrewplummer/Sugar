
  /***
   * String module
   *
   ***/


  var fullWidthTable;
  var halfWidthTable;
  var hiraganaTable;
  var katakanaTable;


  // Unsure of the author's name, but much thanks to this blog for helping
  // with the exact characters here http://lehelk.com/2011/05/06/script-to-remove-diacritics/

  var accentedCharacters = [
    { base: 'A',  reg: /[AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ]/g },
    { base: 'B',  reg: /[BⒷＢḂḄḆɃƂƁ]/g },
    { base: 'C',  reg: /[CⒸＣĆĈĊČÇḈƇȻꜾ]/g },
    { base: 'D',  reg: /[DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ]/g },
    { base: 'E',  reg: /[EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ]/g },
    { base: 'F',  reg: /[FⒻＦḞƑꝻ]/g },
    { base: 'G',  reg: /[GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ]/g },
    { base: 'H',  reg: /[HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ]/g },
    { base: 'I',  reg: /[IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ]/g },
    { base: 'J',  reg: /[JⒿＪĴɈ]/g },
    { base: 'K',  reg: /[KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ]/g },
    { base: 'L',  reg: /[LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ]/g },
    { base: 'M',  reg: /[MⓂＭḾṀṂⱮƜ]/g },
    { base: 'N',  reg: /[NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ]/g },
    { base: 'O',  reg: /[OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ]/g },
    { base: 'P',  reg: /[PⓅＰṔṖƤⱣꝐꝒꝔ]/g },
    { base: 'Q',  reg: /[QⓆＱꝖꝘɊ]/g },
    { base: 'R',  reg: /[RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ]/g },
    { base: 'S',  reg: /[SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ]/g },
    { base: 'T',  reg: /[TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ]/g },
    { base: 'U',  reg: /[UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ]/g },
    { base: 'V',  reg: /[VⓋＶṼṾƲꝞɅ]/g },
    { base: 'W',  reg: /[WⓌＷẀẂŴẆẄẈⱲ]/g },
    { base: 'X',  reg: /[XⓍＸẊẌ]/g },
    { base: 'Y',  reg: /[YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ]/g },
    { base: 'Z',  reg: /[ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ]/g },
    { base: 'a',  reg: /[aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ]/g },
    { base: 'b',  reg: /[bⓑｂḃḅḇƀƃɓ]/g },
    { base: 'c',  reg: /[cⓒｃćĉċčçḉƈȼꜿↄ]/g },
    { base: 'd',  reg: /[dⓓｄḋďḍḑḓḏđƌɖɗꝺ]/g },
    { base: 'e',  reg: /[eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ]/g },
    { base: 'f',  reg: /[fⓕｆḟƒꝼ]/g },
    { base: 'g',  reg: /[gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ]/g },
    { base: 'h',  reg: /[hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ]/g },
    { base: 'i',  reg: /[iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı]/g },
    { base: 'j',  reg: /[jⓙｊĵǰɉ]/g },
    { base: 'k',  reg: /[kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ]/g },
    { base: 'l',  reg: /[lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ]/g },
    { base: 'm',  reg: /[mⓜｍḿṁṃɱɯ]/g },
    { base: 'n',  reg: /[nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ]/g },
    { base: 'o',  reg: /[oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ]/g },
    { base: 'p',  reg: /[pⓟｐṕṗƥᵽꝑꝓꝕ]/g },
    { base: 'q',  reg: /[qⓠｑɋꝗꝙ]/g },
    { base: 'r',  reg: /[rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ]/g },
    { base: 's',  reg: /[sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ]/g },
    { base: 't',  reg: /[tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ]/g },
    { base: 'u',  reg: /[uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ]/g },
    { base: 'v',  reg: /[vⓥｖṽṿʋꝟʌ]/g },
    { base: 'w',  reg: /[wⓦｗẁẃŵẇẅẘẉⱳ]/g },
    { base: 'x',  reg: /[xⓧｘẋẍ]/g },
    { base: 'y',  reg: /[yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ]/g },
    { base: 'z',  reg: /[zⓩｚźẑżžẓẕƶȥɀⱬꝣ]/g },
    { base: 'AA', reg: /[Ꜳ]/g },
    { base: 'AE', reg: /[ÆǼǢ]/g },
    { base: 'AO', reg: /[Ꜵ]/g },
    { base: 'AU', reg: /[Ꜷ]/g },
    { base: 'AV', reg: /[ꜸꜺ]/g },
    { base: 'AY', reg: /[Ꜽ]/g },
    { base: 'DZ', reg: /[ǱǄ]/g },
    { base: 'Dz', reg: /[ǲǅ]/g },
    { base: 'LJ', reg: /[Ǉ]/g },
    { base: 'Lj', reg: /[ǈ]/g },
    { base: 'NJ', reg: /[Ǌ]/g },
    { base: 'Nj', reg: /[ǋ]/g },
    { base: 'OI', reg: /[Ƣ]/g },
    { base: 'OO', reg: /[Ꝏ]/g },
    { base: 'OU', reg: /[Ȣ]/g },
    { base: 'TZ', reg: /[Ꜩ]/g },
    { base: 'VY', reg: /[Ꝡ]/g },
    { base: 'aa', reg: /[ꜳ]/g },
    { base: 'ae', reg: /[æǽǣ]/g },
    { base: 'ao', reg: /[ꜵ]/g },
    { base: 'au', reg: /[ꜷ]/g },
    { base: 'av', reg: /[ꜹꜻ]/g },
    { base: 'ay', reg: /[ꜽ]/g },
    { base: 'dz', reg: /[ǳǆ]/g },
    { base: 'hv', reg: /[ƕ]/g },
    { base: 'lj', reg: /[ǉ]/g },
    { base: 'nj', reg: /[ǌ]/g },
    { base: 'oi', reg: /[ƣ]/g },
    { base: 'ou', reg: /[ȣ]/g },
    { base: 'oo', reg: /[ꝏ]/g },
    { base: 'tz', reg: /[ꜩ]/g },
    { base: 'vy', reg: /[ꝡ]/g }];


  var variableWidthChars = [

    { full:'　', half:' ',  type: 'p' },
    { full:'、', half:'､',  type: 'p' },
    { full:'。', half:'｡',  type: 'p' },
    { full:'，', half:',',  type: 'p' },
    { full:'．', half:'.',  type: 'p' },
    { full:'・', half:'･',  type: 'p' },
    { full:'：', half:':',  type: 'p' },
    { full:'；', half:';',  type: 'p' },
    { full:'？', half:'?',  type: 'p' },
    { full:'！', half:'!',  type: 'p' },
    { full:'‘',  half:'\'', type: 'p' },
    { full:'’',  half:'\'', type: 'p' },
    { full:'“',  half:'"',  type: 'p' },
    { full:'”',  half:'"',  type: 'p' },
    { full:'ー', half:'ｰ',  type: 'p' },
    { full:'～', half:'~',  type: 'p' },
    { full:'゛', half:'ﾞ',  type: 's' },
    { full:'゜', half:'ﾟ',  type: 's' },
    { full:'＾', half:'^',  type: 's' },
    { full:'‐',  half:'-',  type: 's' },
    { full:'／', half:'/',  type: 's' },
    { full:'｜', half:'|',  type: 's' },
    { full:'（', half:'(',  type: 's' },
    { full:'）', half:')',  type: 's' },
    { full:'［', half:'[',  type: 's' },
    { full:'］', half:']',  type: 's' },
    { full:'｛', half:'{',  type: 's' },
    { full:'｝', half:'}',  type: 's' },
    { full:'「', half:'｢',  type: 's' },
    { full:'」', half:'｣',  type: 's' },
    { full:'〈', half:'<',  type: 's' },
    { full:'〉', half:'>',  type: 's' },
    { full:'《', half:'«',  type: 's' },
    { full:'》', half:'»',  type: 's' },
    { full:'＋', half:'+',  type: 's' },
    { full:'－', half:'-',  type: 's' },
    { full:'＝', half:'=',  type: 's' },
    { full:'＜', half:'<',  type: 's' },
    { full:'＞', half:'>',  type: 's' },
    { full:'℃',  half:'°C', type: 's' },
    { full:'￥', half:'¥',  type: 's' },
    { full:'＄', half:'$',  type: 's' },
    { full:'￠', half:'¢',  type: 's' },
    { full:'￡', half:'£',  type: 's' },
    { full:'％', half:'%',  type: 's' },
    { full:'＃', half:'#',  type: 's' },
    { full:'＆', half:'&',  type: 's' },
    { full:'＊', half:'*',  type: 's' },
    { full:'＠', half:'@',  type: 's' },
    { full:'０', half:'0',  type: 'n' },
    { full:'１', half:'1',  type: 'n' },
    { full:'２', half:'2',  type: 'n' },
    { full:'３', half:'3',  type: 'n' },
    { full:'４', half:'4',  type: 'n' },
    { full:'５', half:'5',  type: 'n' },
    { full:'６', half:'6',  type: 'n' },
    { full:'７', half:'7',  type: 'n' },
    { full:'８', half:'8',  type: 'n' },
    { full:'９', half:'9',  type: 'n' },
    { full:'Ａ', half:'A',  type: 'a' },
    { full:'Ｂ', half:'B',  type: 'a' },
    { full:'Ｃ', half:'C',  type: 'a' },
    { full:'Ｄ', half:'D',  type: 'a' },
    { full:'Ｅ', half:'E',  type: 'a' },
    { full:'Ｆ', half:'F',  type: 'a' },
    { full:'Ｇ', half:'G',  type: 'a' },
    { full:'Ｈ', half:'H',  type: 'a' },
    { full:'Ｉ', half:'I',  type: 'a' },
    { full:'Ｊ', half:'J',  type: 'a' },
    { full:'Ｋ', half:'K',  type: 'a' },
    { full:'Ｌ', half:'L',  type: 'a' },
    { full:'Ｍ', half:'M',  type: 'a' },
    { full:'Ｎ', half:'N',  type: 'a' },
    { full:'Ｏ', half:'O',  type: 'a' },
    { full:'Ｐ', half:'P',  type: 'a' },
    { full:'Ｑ', half:'Q',  type: 'a' },
    { full:'Ｒ', half:'R',  type: 'a' },
    { full:'Ｓ', half:'S',  type: 'a' },
    { full:'Ｔ', half:'T',  type: 'a' },
    { full:'Ｕ', half:'U',  type: 'a' },
    { full:'Ｖ', half:'V',  type: 'a' },
    { full:'Ｗ', half:'W',  type: 'a' },
    { full:'Ｘ', half:'X',  type: 'a' },
    { full:'Ｙ', half:'Y',  type: 'a' },
    { full:'Ｚ', half:'Z',  type: 'a' },
    { full:'ａ', half:'a',  type: 'a' },
    { full:'ｂ', half:'b',  type: 'a' },
    { full:'ｃ', half:'c',  type: 'a' },
    { full:'ｄ', half:'d',  type: 'a' },
    { full:'ｅ', half:'e',  type: 'a' },
    { full:'ｆ', half:'f',  type: 'a' },
    { full:'ｇ', half:'g',  type: 'a' },
    { full:'ｈ', half:'h',  type: 'a' },
    { full:'ｉ', half:'i',  type: 'a' },
    { full:'ｊ', half:'j',  type: 'a' },
    { full:'ｋ', half:'k',  type: 'a' },
    { full:'ｌ', half:'l',  type: 'a' },
    { full:'ｍ', half:'m',  type: 'a' },
    { full:'ｎ', half:'n',  type: 'a' },
    { full:'ｏ', half:'o',  type: 'a' },
    { full:'ｐ', half:'p',  type: 'a' },
    { full:'ｑ', half:'q',  type: 'a' },
    { full:'ｒ', half:'r',  type: 'a' },
    { full:'ｓ', half:'s',  type: 'a' },
    { full:'ｔ', half:'t',  type: 'a' },
    { full:'ｕ', half:'u',  type: 'a' },
    { full:'ｖ', half:'v',  type: 'a' },
    { full:'ｗ', half:'w',  type: 'a' },
    { full:'ｘ', half:'x',  type: 'a' },
    { full:'ｙ', half:'y',  type: 'a' },
    { full:'ｚ', half:'z',  type: 'a' },
    { full:'ァ', half:'ｧ',  type: 'k' },
    { full:'ア', half:'ｱ',  type: 'k' },
    { full:'ィ', half:'ｨ',  type: 'k' },
    { full:'イ', half:'ｲ',  type: 'k' },
    { full:'ゥ', half:'ｩ',  type: 'k' },
    { full:'ウ', half:'ｳ',  type: 'k' },
    { full:'ェ', half:'ｪ',  type: 'k' },
    { full:'エ', half:'ｴ',  type: 'k' },
    { full:'ォ', half:'ｫ',  type: 'k' },
    { full:'オ', half:'ｵ',  type: 'k' },
    { full:'カ', half:'ｶ',  type: 'k' },
    { full:'ガ', half:'ｶﾞ', type: 'k' },
    { full:'キ', half:'ｷ',  type: 'k' },
    { full:'ギ', half:'ｷﾞ', type: 'k' },
    { full:'ク', half:'ｸ',  type: 'k' },
    { full:'グ', half:'ｸﾞ', type: 'k' },
    { full:'ケ', half:'ｹ',  type: 'k' },
    { full:'ゲ', half:'ｹﾞ', type: 'k' },
    { full:'コ', half:'ｺ',  type: 'k' },
    { full:'ゴ', half:'ｺﾞ', type: 'k' },
    { full:'サ', half:'ｻ',  type: 'k' },
    { full:'ザ', half:'ｻﾞ', type: 'k' },
    { full:'シ', half:'ｼ',  type: 'k' },
    { full:'ジ', half:'ｼﾞ', type: 'k' },
    { full:'ス', half:'ｽ',  type: 'k' },
    { full:'ズ', half:'ｽﾞ', type: 'k' },
    { full:'セ', half:'ｾ',  type: 'k' },
    { full:'ゼ', half:'ｾﾞ', type: 'k' },
    { full:'ソ', half:'ｿ',  type: 'k' },
    { full:'ゾ', half:'ｿﾞ', type: 'k' },
    { full:'タ', half:'ﾀ',  type: 'k' },
    { full:'ダ', half:'ﾀﾞ', type: 'k' },
    { full:'チ', half:'ﾁ',  type: 'k' },
    { full:'ヂ', half:'ﾁﾞ', type: 'k' },
    { full:'ッ', half:'ｯ',  type: 'k' },
    { full:'ツ', half:'ﾂ',  type: 'k' },
    { full:'ヅ', half:'ﾂﾞ', type: 'k' },
    { full:'テ', half:'ﾃ',  type: 'k' },
    { full:'デ', half:'ﾃﾞ', type: 'k' },
    { full:'ト', half:'ﾄ',  type: 'k' },
    { full:'ド', half:'ﾄﾞ', type: 'k' },
    { full:'ナ', half:'ﾅ',  type: 'k' },
    { full:'ニ', half:'ﾆ',  type: 'k' },
    { full:'ヌ', half:'ﾇ',  type: 'k' },
    { full:'ネ', half:'ﾈ',  type: 'k' },
    { full:'ノ', half:'ﾉ',  type: 'k' },
    { full:'ハ', half:'ﾊ',  type: 'k' },
    { full:'バ', half:'ﾊﾞ', type: 'k' },
    { full:'パ', half:'ﾊﾟ', type: 'k' },
    { full:'ヒ', half:'ﾋ',  type: 'k' },
    { full:'ビ', half:'ﾋﾞ', type: 'k' },
    { full:'ピ', half:'ﾋﾟ', type: 'k' },
    { full:'フ', half:'ﾌ',  type: 'k' },
    { full:'ブ', half:'ﾌﾞ', type: 'k' },
    { full:'プ', half:'ﾌﾟ', type: 'k' },
    { full:'ヘ', half:'ﾍ',  type: 'k' },
    { full:'ベ', half:'ﾍﾞ', type: 'k' },
    { full:'ペ', half:'ﾍﾟ', type: 'k' },
    { full:'ホ', half:'ﾎ',  type: 'k' },
    { full:'ボ', half:'ﾎﾞ', type: 'k' },
    { full:'ポ', half:'ﾎﾟ', type: 'k' },
    { full:'マ', half:'ﾏ',  type: 'k' },
    { full:'ミ', half:'ﾐ',  type: 'k' },
    { full:'ム', half:'ﾑ',  type: 'k' },
    { full:'メ', half:'ﾒ',  type: 'k' },
    { full:'モ', half:'ﾓ',  type: 'k' },
    { full:'ャ', half:'ｬ',  type: 'k' },
    { full:'ヤ', half:'ﾔ',  type: 'k' },
    { full:'ュ', half:'ｭ',  type: 'k' },
    { full:'ユ', half:'ﾕ',  type: 'k' },
    { full:'ョ', half:'ｮ',  type: 'k' },
    { full:'ヨ', half:'ﾖ',  type: 'k' },
    { full:'ラ', half:'ﾗ',  type: 'k' },
    { full:'リ', half:'ﾘ',  type: 'k' },
    { full:'ル', half:'ﾙ',  type: 'k' },
    { full:'レ', half:'ﾚ',  type: 'k' },
    { full:'ロ', half:'ﾛ',  type: 'k' },
    { full:'ワ', half:'ﾜ',  type: 'k' },
    { full:'ヲ', half:'ｦ',  type: 'k' },
    { full:'ン', half:'ﾝ',  type: 'k' }

  ];


  var kana = [

    { hira:'ぁ', kata:'ァ' },
    { hira:'あ', kata:'ア' },
    { hira:'ぃ', kata:'ィ' },
    { hira:'い', kata:'イ' },
    { hira:'ぅ', kata:'ゥ' },
    { hira:'う', kata:'ウ' },
    { hira:'ぇ', kata:'ェ' },
    { hira:'え', kata:'エ' },
    { hira:'ぉ', kata:'ォ' },
    { hira:'お', kata:'オ' },
    { hira:'か', kata:'カ' },
    { hira:'が', kata:'ガ' },
    { hira:'き', kata:'キ' },
    { hira:'ぎ', kata:'ギ' },
    { hira:'く', kata:'ク' },
    { hira:'ぐ', kata:'グ' },
    { hira:'け', kata:'ケ' },
    { hira:'げ', kata:'ゲ' },
    { hira:'こ', kata:'コ' },
    { hira:'ご', kata:'ゴ' },
    { hira:'さ', kata:'サ' },
    { hira:'ざ', kata:'ザ' },
    { hira:'し', kata:'シ' },
    { hira:'じ', kata:'ジ' },
    { hira:'す', kata:'ス' },
    { hira:'ず', kata:'ズ' },
    { hira:'せ', kata:'セ' },
    { hira:'ぜ', kata:'ゼ' },
    { hira:'そ', kata:'ソ' },
    { hira:'ぞ', kata:'ゾ' },
    { hira:'た', kata:'タ' },
    { hira:'だ', kata:'ダ' },
    { hira:'ち', kata:'チ' },
    { hira:'ぢ', kata:'ヂ' },
    { hira:'っ', kata:'ッ' },
    { hira:'つ', kata:'ツ' },
    { hira:'づ', kata:'ヅ' },
    { hira:'て', kata:'テ' },
    { hira:'で', kata:'デ' },
    { hira:'と', kata:'ト' },
    { hira:'ど', kata:'ド' },
    { hira:'な', kata:'ナ' },
    { hira:'に', kata:'ニ' },
    { hira:'ぬ', kata:'ヌ' },
    { hira:'ね', kata:'ネ' },
    { hira:'の', kata:'ノ' },
    { hira:'は', kata:'ハ' },
    { hira:'ば', kata:'バ' },
    { hira:'ぱ', kata:'パ' },
    { hira:'ひ', kata:'ヒ' },
    { hira:'び', kata:'ビ' },
    { hira:'ぴ', kata:'ピ' },
    { hira:'ふ', kata:'フ' },
    { hira:'ぶ', kata:'ブ' },
    { hira:'ぷ', kata:'プ' },
    { hira:'へ', kata:'ヘ' },
    { hira:'べ', kata:'ベ' },
    { hira:'ぺ', kata:'ペ' },
    { hira:'ほ', kata:'ホ' },
    { hira:'ぼ', kata:'ボ' },
    { hira:'ぽ', kata:'ポ' },
    { hira:'ま', kata:'マ' },
    { hira:'み', kata:'ミ' },
    { hira:'む', kata:'ム' },
    { hira:'め', kata:'メ' },
    { hira:'も', kata:'モ' },
    { hira:'ゃ', kata:'ャ' },
    { hira:'や', kata:'ヤ' },
    { hira:'ゅ', kata:'ュ' },
    { hira:'ゆ', kata:'ユ' },
    { hira:'ょ', kata:'ョ' },
    { hira:'よ', kata:'ヨ' },
    { hira:'ら', kata:'ラ' },
    { hira:'り', kata:'リ' },
    { hira:'る', kata:'ル' },
    { hira:'れ', kata:'レ' },
    { hira:'ろ', kata:'ロ' },
    { hira:'ゎ', kata:'ヮ' },
    { hira:'わ', kata:'ワ' },
    { hira:'ゐ', kata:'ヰ' },
    { hira:'ゑ', kata:'ヱ' },
    { hira:'を', kata:'ヲ' },
    { hira:'ん', kata:'ン' }

  ];

  var unicodeScripts = [
    { names: ['Greek'],       source: '\\u0370-\\u03FF' },
    { names: ['Cyrillic'],    source: '\\u0400-\\u04FF' },
    { names: ['Armenian'],    source: '\\u0530-\\u058F' },
    { names: ['Hebrew'],      source: '\\u0590-\\u05FF' },
    { names: ['Arabic'],      source: '\\u0600-\\u06FF' },
    { names: ['Thai'],        source: '\\u0E00-\\u0E7F' },
    { names: ['Tibetan'],     source: '\\u0F00-\\u0FFF' },
    { names: ['Georgian'],    source: '\\u10A0-\\u10FF' },
    { names: ['Tagalog'],     source: '\\u1700-\\u171F' },
    { names: ['Mongolian'],   source: '\\u1800-\\u18AF' },
    { names: ['Hiragana'],    source: '\\u3040-\\u309F\\u30FB-\\u30FC' },
    { names: ['Katakana'],    source: "\\u30A0-\\u30FF\\uFF61-\\uFF9F" },
    { names: ['Kana'],        source: '\\u3040-\\u30FF\\uFF61-\\uFF9F' },
    { names: ['Bopomofo'],    source: '\\u3100-\\u312F' },
    { names: ['Hangul'],      source: '\\uAC00-\\uD7AF\\u1100-\\u11FF' },
    { names: ['Han','Kanji'], source: '\\u4E00-\\u9FFF\\uF900-\\uFAFF' }
  ];

  var buildVariableWidthTables = function() {
    fullWidthTable = {};
    halfWidthTable = {};
    for(var i=0; i<variableWidthChars.length; i++) {
      var c = variableWidthChars[i];
      fullWidthTable[c.half] = c;
      halfWidthTable[c.full] = c;
    }
  }

  var buildKanaTables = function() {
    hiraganaTable = {};
    katakanaTable = {};
    for(var i=0; i<kana.length; i++) {
      var k = kana[i];
      hiraganaTable[k.kata] = k;
      katakanaTable[k.hira] = k;
    }
  }

  var buildUnicodeScripts = function() {
    unicodeScripts.each(function(s) {
      var is = new RegExp('^['+s.source+'\\s]+$');
      var has = new RegExp('['+s.source+']');
      s.names.each(function(name) {
        defineProperty(String.prototype, 'is' + name, function() { return !!this.trim().match(is); });
        defineProperty(String.prototype, 'has' + name, function() { return !!this.match(has); });
      });
    });
  }

  var variableWidthMode = function(mode) {
    /* hankaku/zenkaku transposition arguments default to everything */
    if(!mode || mode == 'all') return { 'a':true,'n':true,'k':true,'s':true,'p':true };
    var result = {};
    if(mode.length < 6) {
      for(var i=0; i < mode.length; i++) {
        result[mode.charAt(i)] = true;
      }
    } else {
      if(mode === 'alphabet')    result.a = true;
      if(mode === 'numbers')     result.n = true;
      if(mode === 'katakana')    result.k = true;
      if(mode === 'special')     result.s = true;
      if(mode === 'punctuation') result.p = true;
    }
    return result;
  }

  var padString = function(str, num, padding, direction) {
    num = num || 0;
    padding = padding || ' ';
    direction = direction || 'both';
    for(var i=0; i<num; i++) {
      if(direction === 'left'  || direction === 'both') str = padding + str;
      if(direction === 'right' || direction === 'both') str = str + padding;
    }
    return str.toString();
  }

   // Match patched to support non-participating capturing groups.
   var NPCGMatch = function(str, reg) {
     var match = str.match(reg);
     if(match && !RegExp.NPCGSupport && !reg.global) {
        for(var i = 1; i < match.length; i++) {
          if(match[i] === '') match[i] = undefined;
        }
     }
     return match;
   }

   var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

   if(typeof btoa === 'undefined') {
     btoa = function(str) {
       var output = '';
       var chr1, chr2, chr3 = '';
       var enc1, enc2, enc3, enc4 = '';
       var i = 0;
       do {
         chr1 = str.charCodeAt(i++);
         chr2 = str.charCodeAt(i++);
         chr3 = str.charCodeAt(i++);
         enc1 = chr1 >> 2;
         enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
         enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
         enc4 = chr3 & 63;
         if (isNaN(chr2)) {
           enc3 = enc4 = 64;
         } else if (isNaN(chr3)) {
           enc4 = 64;
         }
         output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
         chr1 = chr2 = chr3 = '';
         enc1 = enc2 = enc3 = enc4 = '';
       } while (i < str.length);
       return output;
     }
   }

   if(typeof atob === 'undefined') {

     atob = function(input) {
       var output = '';
       var chr1, chr2, chr3 = '';
       var enc1, enc2, enc3, enc4 = '';
       var i = 0;

       var base64test = /[^A-Za-z0-9\+\/\=]/g;
       if(base64test.test(input)) {
         throw new Error('String contains invalid base64 characters');
       }
       input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
       do {
         enc1 = keyStr.indexOf(input.charAt(i++));
         enc2 = keyStr.indexOf(input.charAt(i++));
         enc3 = keyStr.indexOf(input.charAt(i++));
         enc4 = keyStr.indexOf(input.charAt(i++));
         chr1 = (enc1 << 2) | (enc2 >> 4);
         chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
         chr3 = ((enc3 & 3) << 6) | enc4;
         output = output + String.fromCharCode(chr1);
         if (enc3 != 64) {
           output = output + String.fromCharCode(chr2);
         }
         if (enc4 != 64) {
           output = output + String.fromCharCode(chr3);
         }
         chr1 = chr2 = chr3 = "";
         enc1 = enc2 = enc3 = enc4 = "";
       } while (i < input.length);
       return unescape(output);
     }
   }

  var buildString = function() {
    buildKanaTables();
    buildVariableWidthTables();
    buildUnicodeScripts();
  }



  extend(String, true, {

     /***
      * @method escapeRegExp()
      * @returns String
      * @short Escapes all RegExp tokens in the string.
      * @example
      *
      *   'really?'.escapeRegExp()       -> 'really\?'
      *   'yes.'.escapeRegExp()         -> 'yes\.'
      *   '(not really)'.escapeRegExp() -> '\(not really\)'
      *
      ***/
    'escapeRegExp': function() {
      return RegExp.escape(this);
    },

     /***
      * @method escapeURL([param] = false)
      * @returns String
      * @short Escapes characters in a string to make a valid URL.
      * @extra If [param] is true, it will also escape valid URL characters for use as a URL parameter.
      * @example
      *
      *   'http://foo.com/"bar"'.escapeURL()     -> 'http://foo.com/%22bar%22'
      *   'http://foo.com/"bar"'.escapeURL(true) -> 'http%3A%2F%2Ffoo.com%2F%22bar%22'
      *
      ***/
    'escapeURL': function(param) {
      return param ? encodeURIComponent(this) : encodeURI(this);
    },

     /***
      * @method unescapeURL([partial] = false)
      * @returns String
      * @short Restores escaped characters in a URL escaped string.
      * @extra If [partial] is true, it will only unescape non-valid URL characters. [partial] is included here for completeness, but should very rarely be needed.
      * @example
      *
      *   'http%3A%2F%2Ffoo.com%2Fthe%20bar'.unescapeURL()     -> 'http://foo.com/the bar'
      *   'http%3A%2F%2Ffoo.com%2Fthe%20bar'.unescapeURL(true) -> 'http%3A%2F%2Ffoo.com%2Fthe bar'
      *
      ***/
    'unescapeURL': function(param) {
      return param ? decodeURI(this) : decodeURIComponent(this);
    },

     /***
      * @method encodeBase64()
      * @returns String
      * @short Encodes the string into base 64 encoding.
      * @extra This methods wraps the browser native %btoa% when available, and uses a custom implementation when not available.
      * @example
      *
      *   'gonna get encoded!'.encodeBase64()  -> 'Z29ubmEgZ2V0IGVuY29kZWQh'
      *   'http://twitter.com/'.encodeBase64() -> 'aHR0cDovL3R3aXR0ZXIuY29tLw=='
      *
      ***/
    'encodeBase64': function() {
      return btoa(this);
    },

     /***
      * @method decodeBase64()
      * @returns String
      * @short Decodes the string from base 64 encoding.
      * @extra This methods wraps the browser native %atob% when available, and uses a custom implementation when not available.
      * @example
      *
      *   'aHR0cDovL3R3aXR0ZXIuY29tLw=='.decodeBase64() -> 'http://twitter.com/'
      *   'anVzdCBnb3QgZGVjb2RlZA=='.decodeBase64()     -> 'just got decoded!'
      *
      ***/
    'decodeBase64': function() {
      return atob(this);
    },

    /***
     * @method capitalize()
     * @returns String
     * @short Capitalizes the first character in the string.
     * @example
     *
     *   'hello'.capitalize()              -> 'Hello'
     *   'why hello there...'.capitalize() -> 'Why hello there...'
     *
     *
     ***/
    'capitalize': function() {
      return this.substr(0,1).toUpperCase() + this.substr(1).toLowerCase();
    },

    /***
     * @method trim()
     * @returns String
     * @short Removes leading and trailing whitespace from the string.
     * @example
     *
     *   '   wasabi   '.trim()   -> 'wasabi'
     *   "   wasabi  \n ".trim() -> 'wasabi'
     *
     ***/
    'trim': function() {
      return this.trimLeft().trimRight();
    },

    /***
     * @method trimLeft()
     * @returns String
     * @short Removes leading whitespace from the string.
     * @example
     *
     *   '   wasabi   '.trimLeft()   -> 'wasabi   '
     *   " \n  wasabi   ".trimLeft() -> 'wasabi   '
     *
     ***/
    'trimLeft': function() {
      return this.replace(/^[\s　][\s　]*/, '');
    },

    /***
     * @method trimRight()
     * @returns String
     * @short Removes trailing whitespace from the string.
     * @example
     *
     *   '   wasabi   '.trimRight()   -> '   wasabi'
     *   "   wasabi  \n ".trimRight() -> '   wasabi'
     *
     ***/
    'trimRight': function() {
      return this.replace(/[\s　][\s　]*$/, '');
    },

    /***
     * @method pad([num] = 0, [padding] = ' ')
     * @returns String
     * @short Pads both sides of the string.
     * @extra [num] is the number of characters on each side, and [padding] is the character to pad with.
     * @example
     *
     *   'wasabi'.pad(2)               -> '  wasabi  '
     *   'wasabi'.pad(2, '--')         -> '--wasabi--'
     *   'wasabi'.pad(2).pad(3, '---') -> '---  wasabi  ---'
     *
     ***/
    'pad': function(num, padding) {
      return this.padLeft(num, padding).padRight(num, padding);
    },

    /***
     * @method padLeft([num] = 0, [padding] = ' ')
     * @returns String
     * @short Pads the left side of the string.
     * @extra [num] is the number of characters, and [padding] is the character to pad with.
     * @example
     *
     *   'wasabi'.padLeft(2)       -> '  wasabi'
     *   'wasabi'.padLeft(2, '--') -> '--wasabi'
     *
     ***/
    'padLeft': function(num, padding) {
      return padString(this, num, padding, 'left');
    },

    /***
     * @method padRight([num] = 0, [padding] = ' ')
     * @returns String
     * @short Pads the right side of the string.
     * @extra [num] is the number of characters, and [padding] is the character to pad with.
     * @example
     *
     *   'wasabi'.padRight(2)       -> 'wasabi  '
     *   'wasabi'.padRight(2, '--') -> 'wasabi--'
     *
     ***/
    'padRight': function(num, padding) {
      return padString(this, num, padding, 'right');
    },


    /***
     * @method repeat([num] = 0)
     * @returns String
     * @short Returns the string repeated [num] times.
     * @example
     *
     *   'jumpy'.repeat(2) -> 'jumpyjumpy'
     *   'a'.repeat(5)     -> 'aaaaa'
     *
     ***/
    'repeat': function(num) {
      num = num || 0;
      if(num < 0) return this;
      var str = '';
      for(var i=0; i<num; i++) {
        str += this;
      }
      return str;
    },

    /***
     * @method each([search], [fn])
     * @returns Array
     * @short Runs callback [fn] against each occurence of [search].
     * @extra Returns an array of matches. [search] may be either a string or regex, and defaults to every character in the string.
     * @example
     *
     *   'jumpy'.each() -> ['j','u','m','p','y']
     *   'jumpy'.each(/[r-z]/) -> ['u','y']
     *   'jumpy'.each(/[r-z]/, function(m) {
     *     // Called twice: "u", "y"
     *   });
     *
     ***/
    'each': function(search, fn) {
      if(Object.isFunction(search)) {
        fn = search;
        search = /./g;
      } else if(!search) {
        search = /./g
      } else if(Object.isString(search)) {
        search = new RegExp(RegExp.escape(search), 'gi');
      } else if(Object.isRegExp(search)) {
        search = search.addFlag('g');
      }
      var match = this.match(search) || [];
      if(fn) {
        for(var i=0; i<match.length; i++) {
          match[i] = fn.call(this, match[i], i) || match[i];
        }
      }
      return match;
    },


    /***
     * @method codes([fn])
     * @returns Array
     * @short Runs callback [fn] against each character code in the string. Returns an array of character codes.
     * @example
     *
     *   'jumpy'.codes() -> [106,117,109,112,121]
     *   'jumpy'.codes(function(c) {
     *     // Called 5 times: 106, 117, 109, 112, 121
     *   });
     *
     ***/
    'codes': function(fn) {
      var codes = [];
      for(var i=0; i<this.length; i++) {
        var code = this.charCodeAt(i);
        codes.push(code);
        if(fn) fn.call(this, code, i);
      }
      return codes;
    },

    /***
     * @method chars([fn])
     * @returns Array
     * @short Runs callback [fn] against each character in the string. Returns an array of characters.
     * @example
     *
     *   'jumpy'.chars() -> ['j','u','m','p','y']
     *   'jumpy'.chars(function(c) {
     *     // Called 5 times: "j","u","m","p","y"
     *   });
     *
     ***/
    'chars': function(fn) {
      return this.trim().each(fn);
    },

    /***
     * @method words([fn])
     * @returns Array
     * @short Runs callback [fn] against each word in the string. Returns an array of words.
     * @extra A "word" here is defined as any sequence of non-whitespace characters.
     * @example
     *
     *   'broken wear'.words() -> ['broken','wear']
     *   'broken wear'.words(function(w) {
     *     // Called twice: "broken", "wear"
     *   });
     *
     ***/
    'words': function(fn) {
      return this.trim().each(/\S+/g, fn);
    },

    /***
     * @method lines([fn])
     * @returns Array
     * @short Runs callback [fn] against each line in the string. Returns an array of lines.
     * @example
     *
     *   'broken wear\nand\njumpy jump'.lines() -> ['broken wear','and','jumpy jump']
     *   'broken wear\nand\njumpy jump'.lines(function(l) {
     *     // Called three times: "broken wear", "and", "jumpy jump"
     *   });
     *
     ***/
    'lines': function(fn) {
      return this.trim().each(/^.*$/gm, fn);
    },

    /***
     * @method paragraphs([fn])
     * @returns Array
     * @short Runs callback [fn] against each paragraph in the string. Returns an array of paragraphs.
     * @extra A paragraph here is defined as a block of text bounded by two or more line breaks.
     * @example
     *
     *   'Once upon a time.\n\nIn the land of oz...'.paragraphs() -> ['Once upon a time.','In the land of oz...']
     *   'Once upon a time.\n\nIn the land of oz...'.paragraphs(function(p) {
     *     // Called twice: "Once upon a time.", "In teh land of oz..."
     *   });
     *
     ***/
    'paragraphs': function(fn) {
      var paragraphs = this.trim().split(/[\r\n]{2,}/);
      paragraphs = paragraphs.map(function(p) {
        if(fn) var s = fn.call(p);
        return s ? s : p;
      });
      return paragraphs;
    },

    /***
     * @method normalize()
     * @returns String
     * @short Returns the string with accented and non-standard Latin-based characters converted into standard letters.
     * @example
     *
     *   'á'.normalize()                  -> 'a'
     *   'Ménage à trois'.normalize()     -> 'Menage a trois'
     *   'Volkswagen'.normalize()         -> 'Volkswagen'
     *   'ＦＵＬＬＷＩＤＴＨ'.normalize() -> 'FULLWIDTH'
     *
     ***/
    'normalize': function() {
      var text = this.toString();
      accentedCharacters.each(function(d) {
        text = text.replace(d.reg, d.base);
      });
      return text;
    },

    /***
     * @method startsWith(<find>, [caseSensitive] = true)
     * @returns Boolean
     * @short Returns true if the string starts with <find>.
     * @extra <find> may be either a string or regex.
     * @example
     *
     *   'hello'.startsWith('hell')        -> true
     *   'hello'.startsWith(/[a-h]/)       -> true
     *   'hello'.startsWith('HELL')        -> false
     *   'hello'.startsWith('HELL', false) -> true
     *
     ***/
    'startsWith': function(reg, caseSensitive) {
      if(caseSensitive === undefined) caseSensitive = true;
      var source = Object.isRegExp(reg) ? reg.source.replace('^', '') : RegExp.escape(reg);
      return new RegExp('^' + source, caseSensitive ? '' : 'i').test(this);
    },

    /***
     * @method endsWith(<find>, [caseSensitive] = true)
     * @returns Boolean
     * @short Returns true if the string ends with <find>.
     * @extra <find> may be either a string or regex.
     * @example
     *
     *   'jumpy'.endsWith('py')         -> true
     *   'jumpy'.endsWith(/[q-z]/)      -> true
     *   'jumpy'.endsWith('MPY')        -> false
     *   'jumpy'.endsWith('MPY', false) -> true
     *
     ***/
    'endsWith': function(reg, caseSensitive) {
      if(caseSensitive === undefined) caseSensitive = true;
      var source = Object.isRegExp(reg) ? reg.source.replace('$', '') : RegExp.escape(reg);
      return new RegExp(source + '$', caseSensitive ? '' : 'i').test(this);
    },

    /***
     * @method isBlank()
     * @returns Boolean
     * @short Returns true if the string has a length of 0 or contains only whitespace.
     * @example
     *
     *   ''.isBlank()      -> true
     *   '   '.isBlank()   -> true
     *   'noway'.isBlank() -> false
     *
     ***/
    'isBlank': function() {
      return this.trim().length === 0;
    },

    /***
     * @method has(<find>)
     * @returns Boolean
     * @short Returns true if the string matches <find>.
     * @extra <find> may be a string or regex.
     * @example
     *
     *   'jumpy'.has('py')     -> true
     *   'broken'.has(/[a-n]/) -> true
     *   'broken'.has(/[s-z]/) -> false
     *
     ***/
    'has': function(find) {
      return this.search(find) !== -1;
    },


    /***
     * @method add(<str>, [index] = 0)
     * @returns String
     * @short Adds <str> at [index]. Negative values are also allowed.
     * @example
     *
     *   'five'.add('schfifty ')      -> schfifty five
     *   'dopamine'.add('e', 3)       -> dopeamine
     *   'spelling eror'.add('r', -3) -> spelling error
     *
     ***/
    'add': function(str, index) {
      index = index || 0;
      if(index < 0) index = this.length + index + 1;
      if(index < 0 || index > this.length) return this;
      return this.substr(0, index) + str + this.substr(index);
    },

    /***
     * @method hankaku([mode] = 'all')
     * @returns String
     * @short Converts full-width characters (zenkaku) to half-width (hankaku).
     * @extra [mode] accepts any combination of "a" (alphabet), "n" (numbers), "k" (katakana), "s" (spaces), "p" (punctuation), or "all".
     * @example
     *
     *   'タロウ　ＹＡＭＡＤＡです！'.hankaku()    -> 'ﾀﾛｳ YAMADAです!'
     *   'タロウ　ＹＡＭＡＤＡです！'.hankaku('a') -> 'タロウ　YAMADAです！'
     *   'タロウ　ＹＡＭＡＤＡです！'.hankaku('k') -> 'ﾀﾛｳ　ＹＡＭＡＤＡです！'
     *
     ***/
    'hankaku': function(mode) {
      mode = variableWidthMode(mode);
      var text = '';
      for(var i=0; i<this.length; i++) {
        var character = this.charAt(i);
        if(halfWidthTable[character] && mode[halfWidthTable[character]['type']]) {
          text += halfWidthTable[character]['half'];
        } else {
          text += character;
        }
      }
      return text;
    },

    /***
     * @method zenkaku([mode] = 'all')
     * @returns String
     * @short Converts half-width characters (hankaku) to full-width (zenkaku).
     * @extra [mode] accepts any combination of "a" (alphabet), "n" (numbers), "k" (katakana), "s" (spaces), "p" (punctuation), or "all".
     * @example
     *
     *   'ﾀﾛｳ YAMADAです!'.zenkaku()    -> 'タロウ　ＹＡＭＡＤＡです！'
     *   'ﾀﾛｳ YAMADAです!'.zenkaku('a') -> 'ﾀﾛｳ ＹＡＭＡＤＡです!'
     *   'ﾀﾛｳ YAMADAです!'.zenkaku('k') -> 'タロウ YAMADAです!'
     *
     ***/
    'zenkaku': function(mode) {
      mode = variableWidthMode(mode);
      var text = '';
      for(var i=0; i<this.length; i++) {
        var character = this.charAt(i);
        var nextCharacter = this.charAt(i+1);
        if(nextCharacter && fullWidthTable[character + nextCharacter]) {
          text += fullWidthTable[character + nextCharacter]['full'];
          i++;
        } else if(fullWidthTable[character] && mode[fullWidthTable[character]['type']]) {
          text += fullWidthTable[character]['full'];
        } else {
          text += character;
        }
      }
      return text;
    },

    /***
     * @method hiragana([all] = true)
     * @returns String
     * @short Converts katakana into hiragana.
     * @extra If [all] is false, only convert full-width katakana, otherwise convert all.
     * @example
     *
     *   'カタカナ'.hiragana()   -> 'かたかな'
     *   'コンニチハ'.hiragana() -> 'こんにちは'
     *   'ｶﾀｶﾅ'.hiragana()       -> 'かたかな'
     *   'ｶﾀｶﾅ'.hiragana(false)  -> 'ｶﾀｶﾅ'
     *
     ***/
    'hiragana': function(convertWidth) {
      var str = convertWidth === false ? this : this.zenkaku('k');
      var text = '';
      for(var i=0; i<str.length; i++) {
        var character = str.charAt(i);
        if(hiraganaTable[character]) {
          text += hiraganaTable[character]['hira'];
        } else {
          text += character;
        }
      }
      return text;
    },

    /***
     * @method katakana()
     * @returns String
     * @short Converts hiragana into katakana.
     * @example
     *
     *   'かたかな'.katakana()   -> 'カタカナ'
     *   'こんにちは'.katakana() -> 'コンニチハ'
     *
     ***/
    'katakana': function() {
      var text = '';
      for(var i=0; i<this.length; i++) {
        var character = this.charAt(i);
        if(katakanaTable[character]) {
          text += katakanaTable[character]['kata'];
        } else {
          text += character;
        }
      }
      return text;
    },

    /***
     * @method toNumber([base] = 10)
     * @returns Number
     * @short Converts the string into a number.
     * @extra Any value with a "." fill be converted to a floating point value, otherwise an integer.
     * @example
     *
     *   '153'.toNumber()    -> 153
     *   '12,000'.toNumber() -> 12000
     *   '10px'.toNumber()   -> 10
     *   'ff'.toNumber(16)   -> 255
     *
     ***/
    'toNumber': function(base) {
      var str = this.replace(/,/g, '');
      return str.match(/\./) ? parseFloat(str) : parseInt(str, base || 10);
    },

    /***
     * @method reverse()
     * @returns String
     * @short Reverses the string.
     * @example
     *
     *   'jumpy'.reverse()        -> 'ypmuj'
     *   'lucky charms'.reverse() -> 'smrahc ykcul'
     *
     ***/
    'reverse': function() {
      return this.split('').reverse().join('');
    },

    /***
     * @method compact()
     * @returns String
     * @short Compacts all white space in the string to a single space and trims the ends.
     * @example
     *
     *   'too \n much \n space'.compact() -> 'too much space'
     *   'enough \n '.compact()           -> 'enought'
     *
     ***/
    'compact': function() {
      var str = this.replace(/[\r\n]/g, '');
      return str.trim().replace(/([\s　])+/g, '$1');
    },

    /***
     * @method at(<index>, [loop] = true)
     * @returns String or Array
     * @short Gets the character(s) at a given index.
     * @extra When [loop] is true, overshooting the end of the string (or the beginning) will begin counting from the other end. As an alternate syntax, passing multiple indexes will get the characters at those indexes.
     * @example
     *
     *   'jumpy'.at(0)               -> 'j'
     *   'jumpy'.at(2)               -> 'm'
     *   'jumpy'.at(5)               -> 'j'
     *   'jumpy'.at(5, false)        -> ''
     *   'jumpy'.at(-1)              -> 'y'
     *   'luckly charms'.at(1,3,5,7) -> ['u','k','y',c']
     *
     ***/
    'at': function() {
      return getFromIndexes(this, arguments, true);
    },


    /***
     * @method first([n] = 1)
     * @returns String
     * @short Returns the first [n] characters of the string.
     * @example
     *
     *   'lucky charms'.first()   -> 'l'
     *   'lucky charms'.first(3)  -> 'luc'
     *
     ***/
    'first': function(num) {
      num = num  === undefined ? 1 : num;
      return this.substr(0, num);
    },

    /***
     * @method last([n] = 1)
     * @returns String
     * @short Returns the last [n] characters of the string.
     * @example
     *
     *   'lucky charms'.last()   -> 's'
     *   'lucky charms'.last(3)  -> 'rms'
     *
     ***/
    'last': function(num) {
      num = num  === undefined ? 1 : num;
      var start = this.length - num < 0 ? 0 : this.length - num;
      return this.substr(start);
    },

    /***
     * @method from([index] = 0)
     * @returns String
     * @short Returns a section of the string starting from [index].
     * @example
     *
     *   'lucky charms'.from()   -> 'lucky charms'
     *   'lucky charms'.from(7)  -> 'harms'
     *
     ***/
    'from': function(num) {
      return this.slice(num);
    },

    /***
     * @method to([index] = end)
     * @returns String
     * @short Returns a section of the string ending at [index].
     * @example
     *
     *   'lucky charms'.to()   -> 'lucky charms'
     *   'lucky charms'.to(7)  -> 'lucky ch'
     *
     ***/
    'to': function(num) {
      if(num === undefined) num = this.length;
      return this.slice(0, num);
    },

    /***
     * @method toDate()
     * @returns Date
     * @short Creates a date from the string.
     * @extra Accepts a wide range of input. See @date_format for more information.
     * @example
     *
     *   'January 25, 2015'.toDate() -> same as Date.create('January 25, 2015')
     *   'yesterday'.toDate()        -> same as Date.create('yesterday')
     *   'next Monday'.toDate()      -> same as Date.create('next Monday')
     *
     ***/
    'toDate': function() {
      return createDate([this.toString()]);
    },

    /***
     * @method dasherize()
     * @returns String
     * @short Converts underscores and camel casing to hypens.
     * @example
     *
     *   'a_farewell_to_arms'.dasherize() -> 'a-farewell-to-arms'
     *   'capsLock'.dasherize()           -> 'caps-lock'
     *
     ***/
    'dasherize': function() {
      return this.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
    },

    /***
     * @method underscore()
     * @returns String
     * @short Converts hyphens and camel casing to underscores.
     * @example
     *
     *   'a-farewell-to-arms'.underscore() -> 'a_farewell_to_arms'
     *   'capsLock'.underscore()           -> 'caps_lock'
     *
     ***/
    'underscore': function() {
      return this.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
    },

    /***
     * @method camelize([first] = true)
     * @returns String
     * @short Converts underscores and hyphens to camel case. If [first] is true the first letter will also be capitalized.
     * @example
     *
     *   'caps_lock'.camelize()              -> 'CapsLock'
     *   'moz-border-radius'.camelize()      -> 'MozBorderRadius'
     *   'moz-border-radius'.camelize(false) -> 'mozBorderRadius'
     *
     ***/
    'camelize': function(first) {
      var split = this.dasherize().split('-');
      var text = '';
      for(var i=0; i<split.length; i++) {
        if(first === false && i === 0) text += split[i].toLowerCase();
        else text += split[i].substr(0, 1).toUpperCase() + split[i].substr(1).toLowerCase();
      }
      return text;
    },

    /***
     * @method titleize()
     * @returns String
     * @short Capitalizes all first letters.
     * @example
     *
     *   'what a title'.titleize() -> 'What A Title'
     *   'no way'.titleize()       -> 'No Way'
     *
     ***/
    'titleize': function() {
      return this.trim().words(function(s) { return s.capitalize(); }).join(' ');
    },

    /***
     * @method stripTags([tag1], [tag2], ...)
     * @returns String
     * @short Strips all HTML tags from the string.
     * @extra Tags to strip may be enumerated in the parameters, otherwise will strip all.
     * @example
     *
     *   '<p>just <b>some</b> text</p>'.stripTags()    -> 'just some text'
     *   '<p>just <b>some</b> text</p>'.stripTags('p') -> 'just <b>some</b> text'
     *
     ***/
    'stripTags': function() {
      args = arguments.length > 0 ? arguments : [''];
      var str = this.toString();
      for(var i=0; i < args.length; i++) {
        var tag = args[i];
        var reg = new RegExp('<\/?' + tag.escapeRegExp() + '[^<>]*>', 'gi');
        str = str.replace(reg, '');
      }
      return str;
    },

    /***
     * @method removeTags([tag1], [tag2], ...)
     * @returns String
     * @short Removes all HTML tags and their contents from the string.
     * @extra Tags to remove may be enumerated in the parameters, otherwise will remove all.
     * @example
     *
     *   '<p>just <b>some</b> text</p>'.removeTags()    -> ''
     *   '<p>just <b>some</b> text</p>'.removeTags('b') -> '<p>just text</p>'
     *
     ***/
    'removeTags': function() {
      var str = this.toString();
      if(arguments.length == 0) {
        str = str.replace(/<.+?\/>/g, '');
        str = str.replace(/<.+?>.*<\/.+?>/g, '');
      } else {
        for(var i=0; i < arguments.length; i++) {
          var match = arguments[i].escapeRegExp();
          str = str.replace(new RegExp('<' + match + '[^<>]*?\/>', 'gi'), '');
          str = str.replace(new RegExp('<' + match + '[^<>]*>.*?<\/' + match + '>', 'gi'), '');
        }
      }
      return str;
    },

    /***
     * @method toObject(<sep1> = '&', <sep2> = '=')
     * @returns Object
     * @short Converts a string into an object.
     * @extra Conversion is based on a compound set of separators, such as would be found in URL params. Defaults are set up to quickly convert the URL query string.
     * @example
     *
     *   'foo=bar&broken=wear'.toObject()       -> { foo: 'bar', broken: 'wear' }
     *   'a|few,more|params'.toObject(',', '|') -> { a: 'few', more: 'params' }
     *
     ***/
    'toObject': function(sep1, sep2) {
      var result = {};
      this.split(sep1 || '&').each(function(el) {
        var split   = el.split(sep2 || '=');
        var key     = split[0];
        var value   = split[1];
        var numeric = parseInt(split[1]);
        if(numeric) {
          value = numeric;
        } else if(value === 'true') {
          value = true;
        } else if(value === 'false') {
          value = false;
        }
        result[key] = value;
      });
      return result;
    }

  });


  extendWithNativeCondition(String, true, function(s) { return !Object.isRegExp(s); }, {

    /*
     * Many thanks to Steve Levithan here for a ton of inspiration and work dealing with
     * cross browser Regex splitting.  http://blog.stevenlevithan.com/archives/cross-browser-split
     */

    /***
     * @method split([separator], [limit])
     * @returns Array
     * @short Splits the string by [separator] into an Array.
     * @extra This method is native to Javascript, but Sugar patches it to provide cross-browser reliability when splitting on a regex.
     * @example
     *
     *   'comma,separated,values'.split(',') -> ['comma','separated','values']
     *   'a,b|c>d'.split(/[,|>]/)            -> ['multi','separated','values']
     *
     ***/
    'split': function(separator, limit) {
      var output = [];
      var lastLastIndex = 0;
      var flags = (separator.ignoreCase ? "i" : "") + (separator.multiline  ? "m" : "") + (separator.sticky     ? "y" : "");
      var separator = separator.addFlag('g'); // make `global` and avoid `lastIndex` issues by working with a copy
      var separator2, match, lastIndex, lastLength;
      if(!RegExp.NPCGSupport) {
        separator2 = RegExp("^" + separator.source + "$(?!\\s)", flags); // doesn't need /g or /y, but they don't hurt
      }
      if(limit === undefined || +limit < 0) {
        limit = Infinity;
      } else {
        limit = Math.floor(+limit);
        if(!limit) return [];
      }

      while (match = separator.exec(this)) {
        lastIndex = match.index + match[0].length; // `separator.lastIndex` is not reliable cross-browser
        if(lastIndex > lastLastIndex) {
          output.push(this.slice(lastLastIndex, match.index));
          // fix browsers whose `exec` methods don't consistently return `undefined` for nonparticipating capturing groups
          if(!RegExp.NPCGSupport && match.length > 1) {
            match[0].replace(separator2, function () {
              for (var i = 1; i < arguments.length - 2; i++) {
                if(arguments[i] === undefined) {
                  match[i] = undefined;
                }
              }
            });
          }
          if(match.length > 1 && match.index < this.length) {
            Array.prototype.push.apply(output, match.slice(1));
          }
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if(output.length >= limit) {
            break;
          }
        }
        if(separator.lastIndex === match.index) {
          separator.lastIndex++; // avoid an infinite loop
        }
      }
      if(lastLastIndex === this.length) {
        if(lastLength || !separator.test("")) output.push("");
      } else {
        output.push(this.slice(lastLastIndex));
      }
      return output.length > limit ? output.slice(0, limit) : output;
    }
  });




  // Aliases

  extend(String, true, {

    /***
     * @method insert()
     * @alias add
     *
     ***/
    'insert': String.prototype.add
  });
