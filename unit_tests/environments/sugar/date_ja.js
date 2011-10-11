test('Dates | Japanese', function () {

  var now = new Date();
  Date.setLocale('ja');

  dateEqual(Date.create('2011年5月15日'), new Date(2011, 4, 15), 'Date#create | basic Japanese date');
  dateEqual(Date.create('2011年5月15日'), new Date(2011, 4, 15), 'Date#create | once a language has been initialized it will always be recognized');

  dateEqual(Date.create('2011年5月'), new Date(2011, 4), 'Date#create | Japanese | year and month');
  dateEqual(Date.create('5月15日'), new Date(now.getFullYear(), 4, 15), 'Date#create | Japanese | month and date');
  dateEqual(Date.create('2011年'), new Date(2011, 0), 'Date#create | Japanese | year');
  dateEqual(Date.create('5月'), new Date(now.getFullYear(), 4), 'Date#create | Japanese | month');
  dateEqual(Date.create('15日'), new Date(now.getFullYear(), now.getMonth(), 15), 'Date#create | Japanese | date');
  dateEqual(Date.create('月曜日'), getDateWithWeekdayAndOffset(1), 'Date#create | Japanese | Monday');
  dateEqual(Date.create('九日'), new Date(now.getFullYear(), now.getMonth(), 9), 'Date#create | Japanese | the 9th');
  dateEqual(Date.create('二十五日'), new Date(now.getFullYear(), now.getMonth(), 25), 'Date#create | Japanese | the 25th');


  dateEqual(Date.create('一ミリ秒前'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Japanese | one millisecond ago');
  dateEqual(Date.create('一秒前'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Japanese | one second ago');
  dateEqual(Date.create('一分前'), getRelativeDate(null, null, null, null, -1), 'Date#create | Japanese | one minute ago');
  dateEqual(Date.create('一時間前'), getRelativeDate(null, null, null, -1), 'Date#create | Japanese | one hour ago');
  dateEqual(Date.create('一日前'), getRelativeDate(null, null, -1), 'Date#create | Japanese | one day ago');
  dateEqual(Date.create('一週間前'), getRelativeDate(null, null, -7), 'Date#create | Japanese | one week ago');
  dateEqual(Date.create('一ヶ月前'), getRelativeDate(null, -1), 'Date#create | Japanese | one month ago ヵ');
  dateEqual(Date.create('一ヵ月前'), getRelativeDate(null, -1), 'Date#create | Japanese | one month ago ヶ');
  dateEqual(Date.create('一年前'), getRelativeDate(-1), 'Date#create | Japanese | one year ago');


  dateEqual(Date.create('2ミリ秒前'), getRelativeDate(null, null, null, null, null, null,-2), 'Date#create | Japanese | two millisecond ago');
  dateEqual(Date.create('2秒前'), getRelativeDate(null, null, null, null, null, -2), 'Date#create | Japanese | two second ago');
  dateEqual(Date.create('2分前'), getRelativeDate(null, null, null, null, -2), 'Date#create | Japanese | two minute ago');
  dateEqual(Date.create('2時間前'), getRelativeDate(null, null, null, -2), 'Date#create | Japanese | two hour ago');
  dateEqual(Date.create('2日前'), getRelativeDate(null, null, -2), 'Date#create | Japanese | two day ago');
  dateEqual(Date.create('2週間前'), getRelativeDate(null, null, -14), 'Date#create | Japanese | two weeks ago');
  dateEqual(Date.create('2ヶ月前'), getRelativeDate(null, -2), 'Date#create | Japanese | two month ago ヵ');
  dateEqual(Date.create('2ヵ月前'), getRelativeDate(null, -2), 'Date#create | Japanese | two month ago ヶ');
  dateEqual(Date.create('2年前'), getRelativeDate(-2), 'Date#create | Japanese | two years ago');

  dateEqual(Date.create('5ミリ秒後'), getRelativeDate(null, null, null, null, null, null, 5), 'Date#create | Japanese | five millisecond from now');
  dateEqual(Date.create('5秒後'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Japanese | five second from now');
  dateEqual(Date.create('5分後'), getRelativeDate(null, null, null, null, 5), 'Date#create | Japanese | five minute from now');
  dateEqual(Date.create('5時間後'), getRelativeDate(null, null, null, 5), 'Date#create | Japanese | five hour from now');
  dateEqual(Date.create('5日後'), getRelativeDate(null, null, 5), 'Date#create | Japanese | five day from now');
  dateEqual(Date.create('5週間後'), getRelativeDate(null, null, 35), 'Date#create | Japanese | five weeks from now');
  dateEqual(Date.create('5ヶ月後'), getRelativeDate(null, 5), 'Date#create | Japanese | five month from now ヵ');
  dateEqual(Date.create('5ヵ月後'), getRelativeDate(null, 5), 'Date#create | Japanese | five month from now ヶ');
  dateEqual(Date.create('5年後'), getRelativeDate(5), 'Date#create | Japanese | five years from now');

  dateEqual(Date.create('２０１１年５月２５日'), new Date(2011, 4, 25), 'Date#create | Japanese | full-width chars');

  dateEqual(Date.create('５ミリ秒後'), getRelativeDate(null, null, null, null, null, null, 5), 'Date#create | Japanese full-width | five millisecond from now');
  dateEqual(Date.create('５秒後'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Japanese full-width | five second from now');
  dateEqual(Date.create('５分後'), getRelativeDate(null, null, null, null, 5), 'Date#create | Japanese full-width | five minute from now');
  dateEqual(Date.create('５時間後'), getRelativeDate(null, null, null, 5), 'Date#create | Japanese full-width | five hour from now');
  dateEqual(Date.create('５日後'), getRelativeDate(null, null, 5), 'Date#create | Japanese full-width | five day from now');
  dateEqual(Date.create('５週間後'), getRelativeDate(null, null, 35), 'Date#create | Japanese full-width | five weeks from now');
  dateEqual(Date.create('５ヶ月後'), getRelativeDate(null, 5), 'Date#create | Japanese full-width | five month from now ヵ');
  dateEqual(Date.create('５ヵ月後'), getRelativeDate(null, 5), 'Date#create | Japanese full-width | five month from now ヶ');
  dateEqual(Date.create('５年後'), getRelativeDate(5), 'Date#create | Japanese full-width | five years from now');


  dateEqual(Date.create('一昨日'), getRelativeDate(null, null, -2).resetTime(), 'Date#create | Japanese | 一昨日');
  dateEqual(Date.create('昨日'), getRelativeDate(null, null, -1).resetTime(), 'Date#create | Japanese | yesterday');
  dateEqual(Date.create('今日'), getRelativeDate(null, null, 0).resetTime(), 'Date#create | Japanese | today');
  dateEqual(Date.create('明日'), getRelativeDate(null, null, 1).resetTime(), 'Date#create | Japanese | tomorrow');
  dateEqual(Date.create('明後日'), getRelativeDate(null, null, 2).resetTime(), 'Date#create | Japanese | 明後日');

  dateEqual(Date.create('先週'), getRelativeDate(null, null, -7), 'Date#create | Japanese | Last week');
  dateEqual(Date.create('来週'), getRelativeDate(null, null, 7), 'Date#create | Japanese | Next week');

  dateEqual(Date.create('先月'), getRelativeDate(null, -1), 'Date#create | Japanese | Next month');
  dateEqual(Date.create('来月'), getRelativeDate(null, 1), 'Date#create | Japanese | Next month');

  dateEqual(Date.create('去年'), getRelativeDate(-1), 'Date#create | Japanese | Last year');
  dateEqual(Date.create('来年'), getRelativeDate(1), 'Date#create | Japanese | Next year');


  dateEqual(Date.create('先週水曜日'), getDateWithWeekdayAndOffset(3, -7), 'Date#create | Japanese | Last wednesday');
  dateEqual(Date.create('来週金曜日'), getDateWithWeekdayAndOffset(5, 7), 'Date#create | Japanese | Next friday');

  equal(Date.create('2011-08-25').format('{yyyy}年{MM}月{dd}日'), '2011年08月25日', 'Date#create | Japanese | format');

  equal(Date.create('1 second ago').relative(), '1秒前', 'Date#create | Japanese | relative format past');
  equal(Date.create('1 minute ago').relative(), '1分前',  'Date#create | Japanese | relative format past');
  equal(Date.create('1 hour ago').relative(),   '1時間前',     'Date#create | Japanese | relative format past');
  equal(Date.create('1 day ago').relative(),    '1日前',    'Date#create | Japanese | relative format past');
  equal(Date.create('1 week ago').relative(),   '1週間前',  'Date#create | Japanese | relative format past');
  equal(Date.create('1 month ago').relative(),  '1ヶ月前',   'Date#create | Japanese | relative format past');
  equal(Date.create('1 year ago').relative(),   '1年前',     'Date#create | Japanese | relative format past');

  equal(Date.create('2 seconds ago').relative(), '2秒前', 'Date#create | Japanese | relative format past');
  equal(Date.create('2 minutes ago').relative(), '2分前',  'Date#create | Japanese | relative format past');
  equal(Date.create('2 hours ago').relative(),   '2時間前',     'Date#create | Japanese | relative format past');
  equal(Date.create('2 days ago').relative(),    '2日前',    'Date#create | Japanese | relative format past');
  equal(Date.create('2 weeks ago').relative(),   '2週間前',  'Date#create | Japanese | relative format past');
  equal(Date.create('2 months ago').relative(),  '2ヶ月前',   'Date#create | Japanese | relative format past');
  equal(Date.create('2 years ago').relative(),   '2年前',     'Date#create | Japanese | relative format past');

  equal(Date.create('1 second from now').relative(), '1秒後', 'Date#create | Japanese | relative format future');
  equal(Date.create('1 minute from now').relative(), '1分後',  'Date#create | Japanese | relative format future');
  equal(Date.create('1 hour from now').relative(),   '1時間後',     'Date#create | Japanese | relative format future');
  equal(Date.create('1 day from now').relative(),    '1日後',    'Date#create | Japanese | relative format future');
  equal(Date.create('1 week from now').relative(),   '1週間後',  'Date#create | Japanese | relative format future');
  equal(Date.create('1 month from now').relative(),  '1ヶ月後',   'Date#create | Japanese | relative format future');
  equal(Date.create('1 year from now').relative(),   '1年後',     'Date#create | Japanese | relative format future');

  equal(Date.create('5 second from now').relative(), '5秒後', 'Date#create | Japanese | relative format future');
  equal(Date.create('5 minute from now').relative(), '5分後',  'Date#create | Japanese | relative format future');
  equal(Date.create('5 hour from now').relative(),   '5時間後',     'Date#create | Japanese | relative format future');
  equal(Date.create('5 day from now').relative(),    '5日後',    'Date#create | Japanese | relative format future');
  equal(Date.create('5 week from now').relative(),   '1ヶ月後',  'Date#create | Japanese | relative format future');
  equal(Date.create('5 month from now').relative(),  '5ヶ月後',   'Date#create | Japanese | relative format future');
  equal(Date.create('5 year from now').relative(),   '5年後',     'Date#create | Japanese | relative format future');

});


    /* KEEPING THIS HERE FOR NOW
     *
    'en': {
      hasPlural: true,
      months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      units: ['millisecond:|s','second:|s','minute:|s','hour:|s','day:|s','week:|s','month:|s','year:|s'],
      numbers: ['one','two','three','four','five','six','seven','eight','nine','ten'],
      optionals: ['the','st|nd|rd|th','of'],
      modifiers: [
        { name: 'day', text: 'yesterday', value: -1 },
        { name: 'day', text: 'today', value: 0 },
        { name: 'day', text: 'tomorrow', value: 1 },
        { name: 'sign', text: 'ago|before', value: -1 },
        { name: 'sign', text: 'from now|after|from', value: 1 },
        { name: 'edge', text: 'last day', value: -2 },
        { name: 'edge', text: 'end', value: -1 },
        { name: 'edge', text: 'first day|beginning', value: 1 },
        { name: 'shift', text: 'last', value: -1 },
        { name: 'shift', text: 'the|this', value: 0 },
        { name: 'shift', text: 'next', value: 1 }
      ],
      articles: ['a','an','the'],
      formats: [
        '{num} {unit} {sign}',
        '{num} {unit4} {sign} {day}',
        '{weekday?} {month} {date}{2} {year?} {time?}',
        '{date} {month} {year}',
        '{month} {year}',
        '{shift?} {weekday} {time?}',
        '{shift} week {weekday?} {time?}',
        '{shift} {unit=5-7}',
        '{1} {edge} of {shift?} {unit=4-7?}{month?}{year?}',
        '{weekday} {3} {shift} week',
        '{1} {date}{2} of {month}',
        '{1}{month?} {date?}{2} of {shift} {unit=6-7}',
        '{day} at {time?}',
        '{time} {day}'
      ]
    },
    'es': {
      hasPlural: true,
      futureRelativeFormat: 1,
      months: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
      weekdays: ['domingo','lunes','martes','miércoles|miercoles','jueves','viernes','sábado|sabado'],
      units: ['milisegundo:|s','segundo:|s','minuto:|s','hora:|s','día|días|dia|dias','semana:|s','mes:|es','año|años|ano|anos'],
      numbers: ['uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez'],
      optionals: ['el','de'],
      modifiers: [
        { name: 'day', text: 'anteayer', value: -2 },
        { name: 'day', text: 'ayer', value: -1 },
        { name: 'day', text: 'hoy', value: 0 },
        { name: 'day', text: 'mañana|manana', value: 1 },
        { name: 'sign', text: 'hace', value: -1 },
        { name: 'sign', text: 'de ahora', value: 1 },
        { name: 'shift', text: 'pasad:o|a', value: -1 },
        { name: 'shift', text: 'próximo|próxima|proximo|proxima', value: 1 }
      ],
      formats: [
        '{sign} {num} {unit}',
        '{num} {unit} {sign}',
        '{date?} {2} {month} {2} {year?}',
        '{1} {unit=5-7} {shift}',
        '{1} {shift} {unit=5-7}'
      ]
    },
    'pt': {
      hasPlural: true,
      futureRelativeFormat: 1,
      months: ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],
      weekdays: ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado|sabado'],
      units: ['milisegundo:|s','segundo:|s','minuto:|s','hora:|s','dia:|s','semana:|s','mês|mêses|mes|meses','ano:|s'],
      numbers: ['um','dois','três|tres','quatro','cinco','seis','sete','oito','nove','dez','uma','duas'],
      optionals: ['a','de'],
      modifiers: [
        { name: 'day', text: 'anteontem', value: -2 },
        { name: 'day', text: 'ontem', value: -1 },
        { name: 'day', text: 'hoje', value: 0 },
        { name: 'day', text: 'amanh:ã|a', value: 1 },
        { name: 'sign', text: 'atrás|atras|há|ha', value: -1 },
        { name: 'sign', text: 'daqui a', value: 1 },
        { name: 'shift', text: 'passad:o|a', value: -1 },
        { name: 'shift', text: 'próximo|próxima|proximo|proxima', value: 1 }
      ],
      formats: [
        '{num} {unit} {sign}',
        '{sign} {num} {unit}',
        '{date?} {2} {month} {2} {year?}',
        '{1} {unit=5-7} {shift}',
        '{1} {shift} {unit=5-7}'
      ]
    },
    'fr': {
      hasPlural: true,
      months: ['janvier','février|fevrier','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre'],
      weekdays: ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],
      units: ['milliseconde:|s','seconde:|s','minute:|s','heure:|s','jour:|s','semaine:|s','mois','an:|s|née|nee'],
      numbers: ['un:|e','deux','trois','quatre','cinq','six','sept','huit','neuf','dix'],
      optionals: ["l'|la|le"],
      modifiers: [
        { name: 'day', text: 'hier', value: -1 },
        { name: 'day', text: "aujourd'hui", value: 0 },
        { name: 'day', text: 'demain', value: 1 },
        { name: 'sign', text: 'il y a', value: -1 },
        { name: 'sign', text: "dans|d'ici", value: 1 },
        { name: 'shift', text: 'derni:er|ère|ere', value: -1 },
        { name: 'shift', text: 'prochain:|e', value: 1 }
      ],
      formats: [
        '{sign} {num} {unit}',
        '{1} {date?} {month} {year?}',
        '{1} {unit=5-7} {shift}'
      ]
    },
    'de': {
      hasPlural: true,
      capitalizeUnit: true,
      futureRelativeFormat: 1,
      months: ['Januar','Februar','März|Marz','April','Mai','Juni','Juli','August','September','November','Dezember'],
      weekdays: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
      units: ['Millisekunde:|n','Sekunde:|n','Minute:|n','Stunde:|n','Tag:|en','Woche:|n','Monat:|en','Jahr:|en'],
      numbers: ['eine:|r|m','zwei','drei','vier','fuenf','sechs','sieben','acht','neun','zehn'],
      optionals: ['der'],
      modifiers: [
        { name: 'day', text: 'vorgestern', value: -2 },
        { name: 'day', text: 'gestern', value: -1 },
        { name: 'day', text: 'heute', value: 0 },
        { name: 'day', text: 'morgen', value: 1 },
        { name: 'day', text: 'übermorgen|ubermorgen', value: 2 },
        { name: 'sign', text: 'vor', value: -1 },
        { name: 'sign', text: 'in', value: 1 },
        { name: 'shift', text: 'letzte:|r|n|s', value: -1 },
        { name: 'shift', text: 'nächste|nächster|nächsten|nachste|nachster|nachsten', value: 1 }
      ],
      formats: [
        '{num} {unit} {sign}',
        '{sign} {num} {unit}',
        '{weekday?} {date?} {month} {year?}',
        '{shift} {unit=5-7}'
      ]
    },
    'it': {
      hasPlural: true,
      months: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
      weekdays: ['Domenica','Luned:ì|i','Marted:ì|i','Mercoled:ì|i','Gioved:ì|i','Venerd:ì|i','Sabato'],
      units: ['millisecond:o|i','second:o|i','minut:o|i','or:a|e','giorn:o|i','settiman:a|e','mes:e|i','ann:o|i'],
      numbers: ['un:|a|o','due','tre','quattro','cinque','sei','sette','otto','nove','dieci'],
      optionals: ["l'|la|il"],
      modifiers: [
        { name: 'day', text: 'ieri', value: -1 },
        { name: 'day', text: 'oggi', value: 0 },
        { name: 'day', text: 'domani', value: 1 },
        { name: 'day', text: 'dopodomani', value: 2 },
        { name: 'sign', text: 'fa', value: -1 },
        { name: 'sign', text: 'da adesso', value: 1 },
        { name: 'shift', text: 'scors:o|a', value: -1 },
        { name: 'shift', text: 'prossim:o|a', value: 1 }
      ],
      formats: [
        '{num} {unit} {sign}',
        '{weekday?} {date?} {month} {year?}',
        '{1} {unit=5-7} {shift}',
        '{1} {shift} {unit=5-7}'
      ]
    },
    'ru': {
      futureRelativeFormat: 1,
      months: ['Январ:я|ь','Феврал:я|ь','Март:а|','Апрел:я|ь','Ма:я|й','Июн:я|ь','Июл:я|ь','Август:а|','Сентябр:я|ь','Октябр:я|ь','Ноябр:я|ь','Декабр:я|ь'],
      weekdays: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
      units: ['миллисекунд:а|у|ы|','секунд:а|у|ы|','минут:а|у|ы|','час:||а|ов','день|день|дня|дней','недел:я|ю|и|ь|е','месяц:||а|ев|е','год|год|года|лет|году'],
      numbers: ['од:ин|ну','дв:а|е','три','четыре','пять','шесть','семь','восемь','девять','десять'],
      optionals: ['в|на'],
      modifiers: [
        { name: 'day', text: 'позавчера', value: -2 },
        { name: 'day', text: 'вчера', value: -1 },
        { name: 'day', text: 'сегодня', value: 0 },
        { name: 'day', text: 'завтра', value: 1 },
        { name: 'day', text: 'послезавтра', value: 2 },
        { name: 'sign', text: 'назад', value: -1 },
        { name: 'sign', text: 'через', value: 1 },
        { name: 'shift', text: 'прошло:й|м', value: -1 },
        { name: 'shift', text: 'следующе:й|м', value: 1 }
      ],
      formats: [
        '{num} {unit} {sign}',
        '{sign} {num} {unit}',
        '{date} {month} {year?}',
        '{month} {year}',
        '{1} {shift} {unit=5-7}'
      ]
    },
    'ja': {
      monthSuffix: '月',
      weekdays: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
      units: ['ミリ秒','秒','分','時間','日','週間|週','ヶ月|ヵ月|月','年'],
      numbers: ['一','二','三','四','五','六','七','八','九','十'],
      modifiers: [
        { name: 'day', text: '一昨日', value: -2 },
        { name: 'day', text: '昨日', value: -1 },
        { name: 'day', text: '今日', value: 0 },
        { name: 'day', text: '明日', value: 1 },
        { name: 'day', text: '明後日', value: 2 },
        { name: 'sign', text: '前', value: -1 },
        { name: 'sign', text: '後', value:  1 },
        { name: 'shift', text: '去|先', value: -1 },
        { name: 'shift', text: '来', value:  1 }
      ],
      formats: [
        '{num}{unit}{sign}',
        '{year}年{month?}月?{date?}日?',
        '{month}月{date?}日?',
        '{shift}{unit=5-7}{weekday?}',
        '{date}日'
      ]
    },
    'zh-CN': {
      monthSuffix: '月',
      weekdays: ['日','一','二','三','四','五','六'],
      units: ['毫秒','秒钟','分钟','小时','天','个星期|周','个月','年'],
      numbers: ['一','二','三','四','五','六','七','八','九','十'],
      modifiers: [
        { name: 'day', text: '前天', value: -2 },
        { name: 'day', text: '昨天', value: -1 },
        { name: 'day', text: '今天', value: 0 },
        { name: 'day', text: '明天', value: 1 },
        { name: 'day', text: '后天', value: 2 },
        { name: 'sign', text: '前', value: -1 },
        { name: 'sign', text: '后', value:  1 },
        { name: 'shift', text: '上|去', value: -1 },
        { name: 'shift', text: '这', value:  0 },
        { name: 'shift', text: '下|明', value:  1 }
      ],
      formats: [
        '{num}{unit}{sign}',
        '星期{weekday}',
        '{shift}{unit=5-7}',
        '{shift}{unit=5}{weekday}',
        '{year}年{month?}月?{date?}日?',
        '{month}月{date?}日?',
        '{date}日'
      ]
    },
    'zh-TW': {
      monthSuffix: '月',
      weekdays: ['日','一','二','三','四','五','六'],
      units: ['毫秒','秒鐘','分鐘','小時','天','個星期|週','個月','年'],
      numbers: ['一','二','三','四','五','六','七','八','九','十'],
      modifiers: [
        { name: 'day', text: '前天', value: -2 },
        { name: 'day', text: '昨天', value: -1 },
        { name: 'day', text: '今天', value: 0 },
        { name: 'day', text: '明天', value: 1 },
        { name: 'day', text: '後天', value: 2 },
        { name: 'sign', text: '前', value: -1 },
        { name: 'sign', text: '後', value: 1 },
        { name: 'shift', text: '上|去', value: -1 },
        { name: 'shift', text: '這', value:  0 },
        { name: 'shift', text: '下|明', value:  1 }
      ],
      formats: [
        '{num}{unit}{sign}',
        '星期{weekday}',
        '{shift}{unit=5-7}',
        '{shift}{unit=5}{weekday}',
        '{year}年{month?}月?{date?}日?',
        '{month}月{date?}日?',
        '{date}日'
      ]
    },
    'ko': {
      monthSuffix: '월',
      weekdays: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
      units: ['밀리초','초','분','시간','일','주','개월|달','년'],
      numbers: ['일|한','이','삼','사','오','육','칠','팔','구','십'],
      modifiers: [
        { name: 'day', text: '그저께', value: -2 },
        { name: 'day', text: '어제', value: -1 },
        { name: 'day', text: '오늘', value: 0 },
        { name: 'day', text: '내일', value: 1 },
        { name: 'day', text: '모레', value: 2 },
        { name: 'sign', text: '전', value: -1 },
        { name: 'sign', text: '후', value:  1 },
        { name: 'shift', text: '지난|작', value: -1 },
        { name: 'shift', text: '이번', value: 0 },
        { name: 'shift', text: '다음|내', value: 1 }
      ],
      formats: [
        '{num}{unit} {sign}',
        '{shift} {unit=5-7}',
        '{shift} {unit=5?} {weekday}',
        '{year}년{month?}월?{date?}일?',
        '{month}월{date?}일?',
        '{date}일'
      ]
    }
    */
