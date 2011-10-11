
// The "normalize" method has now been deprecated as it simply adds too much overhead to the library
// compared to what it does. It still is a useful method, so I will leave it here for reference.
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
  { base: 'vy', reg: /[ꝡ]/g }
  ];

  extend(String, true, false, {
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
    }

  });
