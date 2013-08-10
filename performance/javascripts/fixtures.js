
normalDate = new Date();
normalFunction = function() {
  return 'foo';
}

zero           = 0;
smallInteger   = 85;
hugeNumber     = 893249283429;
floatingNumber = 463.34534533;
numberObject   = new Number(53);



emptyString  = '';
normalString = 'abcdefg';
hugeString   = '';
stringObject = new String('wasabi');
hugeNumberAsString = '893249283429';
hugeNumberAsStringWithTrailingLetters = '893249283429alkdf';


emptyArray       = [];
smallNumberArray = [1,2,3];
smallStringArray = ['a','b','c'];


biggerStringArray = [
  'andere',
  'ändere',
  'chaque',
  'chemin',
  'cote',
  'cotÉ',
  'cÔte',
  'cÔtÉ',
  'Czech',
  'ČuČet',
  'hiŠa',
  'irdisch',
  'lävi',
  'lie',
  'lire',
  'llama',
  'LÖwen',
  'lÒza',
  'LÜbeck',
  'luck',
  'luČ',
  'lye',
  'Männer',
  'mÀŠta',
  'mÎr',
  'mÖchten',
  'myndig',
  'pint',
  'piÑa',
  'pylon',
  'sämtlich',
  'savoir',
  'Sietla',
  'subtle',
  'symbol',
  'Ślub',
  'ŠÀran',
  'väga',
  'verkehrt',
  'vox',
  'waffle',
  'wood',
  'yen',
  'yuan',
  'yucca',
  'zoo',
  'ZÜrich',
  'Zviedrija',
  'zysk',
  'Žal',
  'Žena'
];

smallStringArrayWithNumbersMixedIn = [
  'file 2',
  'file 200',
  'file 15',
  'file 153',
  'file 1',
  'file 25225',
  'file 252',
  'file 95',
  'file 932'
];


bigNumberArray = [];
bigCharacterArray = [];
bigDateArray   = [];

(function() {

  for(var i = 0; i < 10000; i++) {
    var rand = Math.floor(Math.random() * 1000);
    var char = String.fromCharCode(rand);
    bigNumberArray.push(rand);
    bigDateArray.push(new Date(rand));
    bigCharacterArray.push(char);
    hugeString += char;
  }

})();



jsonArray = [
  {
    "id":3895380,
    "uri":"http://iknow.jp/items/3895380",
    "cue":{
      "type":"text",
      "content":{
        "text":"intensive"
      },
      "related":{
        "language":"en",
        "part_of_speech":"Adjective",
        "transcription":"\u026an\u02c8t\u025bns\u026av"
      }
    },
    "response":{
      "type":"meaning",
      "content":{
        "text":"\u96c6\u4e2d\u7684\u306a\u3001\u5f37\u3044"
      },
      "related":{
        "language":"ja",
        "transliterations":[
          {
            "type":"Hira",
            "text":"\u3057\u3085\u3046\u3061\u3085\u3046\u3066\u304d\u306a\u3001\u3064\u3088\u3044"
          },
          {
            "type":"Hrkt",
            "text":"\u3057\u3085\u3046\u3061\u3085\u3046\u3066\u304d\u306a\u3001\u3064\u3088\u3044"
          },
          {
            "type":"Latn",
            "text":"shuuchuutekina,tsuyoi"
          }
        ]
      }
    }
  },
  {
    "id":3895379,
    "uri":"http://iknow.jp/items/3895379",
    "cue":{
      "type":"text",
      "content":{
        "text":"condemn"
      },
      "related":{
        "language":"en",
        "part_of_speech":"Verb",
        "transcription":"k\u0259n\u02c8d\u025bm"
      }
    },
    "response":{
      "type":"meaning",
      "content":{
        "text":"\u3068\u304c\u3081\u308b\u3001\u975e\u96e3\u3059\u308b"
      },
      "related":{
        "language":"ja",
        "transliterations":[
          {
            "type":"Hira",
            "text":"\u3068\u304c\u3081\u308b\u3001\u3072\u306a\u3093\u3059\u308b"
          },
          {
            "type":"Hrkt",
            "text":"\u3068\u304c\u3081\u308b\u3001\u3072\u306a\u3093\u3059\u308b"
          },
          {
            "type":"Latn",
            "text":"togameru,hinansuru"
          }
        ]
      }
    }
  },
  {
    "id":3895378,
    "uri":"http://iknow.jp/items/3895378",
    "cue":{
      "type":"text",
      "content":{
        "text":"Catholic"
      },
      "related":{
        "language":"en",
        "part_of_speech":"Adjective",
        "transcription":"\u02c8k\u00e6\u03b8\u0259l\u026ak"
      }
    },
    "response":{
      "type":"meaning",
      "content":{
        "text":"\u30ab\u30c8\u30ea\u30c3\u30af\u6559\u5f92"
      },
      "related":{
        "language":"ja",
        "transliterations":[
          {
            "type":"Hira",
            "text":"\u304b\u3068\u308a\u3063\u304f\u304d\u3087\u3046\u3068"
          },
          {
            "type":"Hrkt",
            "text":"\u30ab\u30c8\u30ea\u30c3\u30af\u304d\u3087\u3046\u3068"
          },
          {
            "type":"Latn",
            "text":"katorikkukyouto"
          }
        ]
      }
    }
  },
  {
    "id":3895377,
    "uri":"http://iknow.jp/items/3895377",
    "cue":{
      "type":"text",
      "content":{
        "text":"anxiety"
      },
      "related":{
        "language":"en",
        "part_of_speech":"Noun",
        "transcription":"\u00e6\u014b\u02c8za\u026a\u026ati\u02d0"
      }
    },
    "response":{
      "type":"meaning",
      "content":{
        "text":"\u5fc3\u914d\u3001\u4e0d\u5b89"
      },
      "related":{
        "language":"ja",
        "transliterations":[
          {
            "type":"Hira",
            "text":"\u3057\u3093\u3071\u3044\u3001\u3075\u3042\u3093"
          },
          {
            "type":"Hrkt",
            "text":"\u3057\u3093\u3071\u3044\u3001\u3075\u3042\u3093"
          },
          {
            "type":"Latn",
            "text":"shinpai,fuan"
          }
        ]
      }
    }
  },
  {
    "id":3895376,
    "uri":"http://iknow.jp/items/3895376",
    "cue":{
      "type":"text",
      "content":{
        "text":"interfere"
      },
      "related":{
        "language":"en",
        "part_of_speech":"Verb",
        "transcription":"\u02cc\u026ant\u0259r\u02c8fi\u02d0r"
      }
    },
    "response":{
      "type":"meaning",
      "content":{
        "text":"\u90aa\u9b54\u3059\u308b\u3001\u5e72\u6e09\u3059\u308b"
      },
      "related":{
        "language":"ja",
        "transliterations":[
          {
            "type":"Hira",
            "text":"\u3058\u3083\u307e\u3059\u308b\u3001\u304b\u3093\u3057\u3087\u3046\u3059\u308b"
          },
          {
            "type":"Hrkt",
            "text":"\u3058\u3083\u307e\u3059\u308b\u3001\u304b\u3093\u3057\u3087\u3046\u3059\u308b"
          },
          {
            "type":"Latn",
            "text":"jamasuru,kanshousuru"
          }
        ]
      }
    }
  },
  {
    "id":3895375,
    "uri":"http://iknow.jp/items/3895375",
    "cue":{
      "type":"text",
      "content":{
        "text":"discard"
      },
      "related":{
        "language":"en",
        "part_of_speech":"Verb",
        "transcription":"d\u026a\u02c8sk\u0251\u02d0rd"
      }
    },
    "response":{
      "type":"meaning",
      "content":{
        "text":"\u653e\u68c4\u3059\u308b\u3001\uff08\u4e0d\u8981\u306a\u3082\u306e\u3092\uff09\u6368\u3066\u308b"
      },
      "related":{
        "language":"ja",
        "transliterations":[
          {
            "type":"Hira",
            "text":"\u307b\u3046\u304d\u3059\u308b\u3001\uff08\u3075\u3088\u3046\u306a\u3082\u306e\u3092\uff09\u3059\u3066\u308b"
          },
          {
            "type":"Hrkt",
            "text":"\u307b\u3046\u304d\u3059\u308b\u3001\uff08\u3075\u3088\u3046\u306a\u3082\u306e\u3092\uff09\u3059\u3066\u308b"
          },
          {
            "type":"Latn",
            "text":"houkisuru,(fuyounamonowo)suteru"
          }
        ]
      }
    }
  },
  {
    "id":3895374,
    "uri":"http://iknow.jp/items/3895374",
    "cue":{
      "type":"text",
      "content":{
        "text":"fertile"
      },
      "related":{
        "language":"en",
        "part_of_speech":"Adjective",
        "transcription":"\u02c8f\u0259rtl"
      }
    },
    "response":{
      "type":"meaning",
      "content":{
        "text":"\u80a5\u6c83\uff08\u3072\u3088\u304f\uff09\u306a"
      },
      "related":{
        "language":"ja",
        "transliterations":[
          {
            "type":"Hira",
            "text":"\u3072\u3088\u304f\uff08\u3072\u3088\u304f\uff09\u306a"
          },
          {
            "type":"Hrkt",
            "text":"\u3072\u3088\u304f\uff08\u3072\u3088\u304f\uff09\u306a"
          },
          {
            "type":"Latn",
            "text":"hiyoku(hiyoku)na"
          }
        ]
      }
    }
  },
  {
    "id":3895373,
    "uri":"http://iknow.jp/items/3895373",
    "cue":{
      "type":"text",
      "content":{
        "text":"decent"
      },
      "related":{
        "language":"en",
        "part_of_speech":"Adjective",
        "transcription":"\u02c8di\u02d0s\u0259nt"
      }
    },
    "response":{
      "type":"meaning",
      "content":{
        "text":"\u793c\u5100\u6b63\u3057\u3044\u3001\u7acb\u6d3e\u306a\u3001\u304b\u306a\u308a\u306e"
      },
      "related":{
        "language":"ja",
        "transliterations":[
          {
            "type":"Hira",
            "text":"\u308c\u3044\u304e\u305f\u3060\u3057\u3044\u3001\u308a\u3063\u3071\u306a\u3001\u304b\u306a\u308a\u306e"
          },
          {
            "type":"Hrkt",
            "text":"\u308c\u3044\u304e\u305f\u3060\u3057\u3044\u3001\u308a\u3063\u3071\u306a\u3001\u304b\u306a\u308a\u306e"
          },
          {
            "type":"Latn",
            "text":"reigitadashii,rippana,kanarino"
          }
        ]
      }
    }
  },
  {
    "id":3895372,
    "uri":"http://iknow.jp/items/3895372",
    "cue":{
      "type":"text",
      "content":{
        "text":"loose"
      },
      "related":{
        "language":"en",
        "part_of_speech":"Adjective",
        "transcription":"lu\u02d0s"
      }
    },
    "response":{
      "type":"meaning",
      "content":{
        "text":"\u9589\u3058\u3066\u3044\u306a\u3044\u3001\u3086\u308b\u3093\u3060\u3001\u81ea\u7531\u306a"
      },
      "related":{
        "language":"ja",
        "transliterations":[
          {
            "type":"Hira",
            "text":"\u3068\u3058\u3066\u3044\u306a\u3044\u3001\u3086\u308b\u3093\u3060\u3001\u3058\u3086\u3046\u306a"
          },
          {
            "type":"Hrkt",
            "text":"\u3068\u3058\u3066\u3044\u306a\u3044\u3001\u3086\u308b\u3093\u3060\u3001\u3058\u3086\u3046\u306a"
          },
          {
            "type":"Latn",
            "text":"tojiteinai,yurunda,jiyuuna"
          }
        ]
      }
    }
  },
  {
    "id":3895371,
    "uri":"http://iknow.jp/items/3895371",
    "cue":{
      "type":"text",
      "content":{
        "text":"promote"
      },
      "related":{
        "language":"en",
        "part_of_speech":"Verb",
        "transcription":"pr\u0259\u02c8mo\u028at"
      }
    },
    "response":{
      "type":"meaning",
      "content":{
        "text":"\u6607\u9032\u3055\u305b\u308b\u3001\u5ba3\u4f1d\u3059\u308b"
      },
      "related":{
        "language":"ja",
        "transliterations":[
          {
            "type":"Hira",
            "text":"\u3057\u3087\u3046\u3057\u3093\u3055\u305b\u308b\u3001\u305b\u3093\u3067\u3093\u3059\u308b"
          },
          {
            "type":"Hrkt",
            "text":"\u3057\u3087\u3046\u3057\u3093\u3055\u305b\u308b\u3001\u305b\u3093\u3067\u3093\u3059\u308b"
          },
          {
            "type":"Latn",
            "text":"shoushinsaseru,sendensuru"
          }
        ]
      }
    }
  }
];


simpleObject = { id:14 };
deepObject = {
  foo: {
    foo: {
      foo: {
        foo: {
          foo: {
            foo: {
              foo: {
                foo: {
                  foo: {
                    foo: {
                      foo: {
                        foo: {
                          foo: {
                            foo: {
                              foo: {
                                foo: {
                                  foo: {
                                    foo: {
                                      foo: {
                                        foo: {
                                          foo: {
                                            foo: {
                                              foo: {
                                                foo: {
                                                  foo: {
                                                    foo: {
                                                      foo: {
                                                        foo: {
                                                          foo: {
                                                            foo: {
                                                              foo: 'bar'
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
jsonObject   = jsonArray[0];
