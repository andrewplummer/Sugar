
/***
 * Full localization sets for use with the Date class.
 * These can be added using Date.setLocale(<code>, <set>);
 * I'm keeping the default ones here but keep adding to these as
 * they will be modular for non-default languages.
 *
 */


Date.setLocale'en', {
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
});


Date.setLocale('es', {
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
});


Date.setLocale('pt', {
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
});


Date.setLocale('fr', {
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
});


Date.setLocale('de', {
  hasPlural: true,
  capitalizeUnit: true,
  futureRelativeFormat: 1,
  months: ['Januar','Februar','März|Marz','April','Mai','Juni','Juli','August','September','November','Dezember'],
  weekdays: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
  units: ['Millisekunde:|n','Sekunde:|n','Minute:|n','Stunde:|n','Tag:|en','Woche:|n','Monat:|en','Jahr:|en'],
  numbers: ['ein:|e|er|en|em','zwei','drei','vier','fuenf','sechs','sieben','acht','neun','zehn'],
  optionals: ['der'],
  modifiers: [
    { name: 'day', text: 'vorgestern', value: -2 },
    { name: 'day', text: 'gestern', value: -1 },
    { name: 'day', text: 'heute', value: 0 },
    { name: 'day', text: 'morgen', value: 1 },
    { name: 'day', text: 'übermorgen|ubermorgen|uebermorgen', value: 2 },
    { name: 'sign', text: 'vor', value: -1 },
    { name: 'sign', text: 'in', value: 1 },
    { name: 'shift', text: 'letzte:|r|n|s', value: -1 },
    { name: 'shift', text: 'nächste:|r|n|s+nachste:|r|n|s+naechste:|r|n|s', value: 1 }
  ],
  formats: [
    '{sign} {num} {unit}',
    '{num} {unit} {sign}',
    '{weekday?} {date?} {month} {year?}',
    '{shift} {unit=5-7}'
  ]
});


Date.setLocale('it', {
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
});


Date.setLocale('ru', {
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
});


Date.setLocale('ja', {
  monthSuffix: '月',
  weekdays: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
  units: ['ミリ秒','秒','分','時間','日','週間|週','ヶ月|ヵ月|月','年'],
  numbers: ['一','二','三','四','五','六','七','八','九','十'],
  numbersAreDigits: true,
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
});


Date.setLocale('zh-CN', {
  monthSuffix: '月',
  weekdays: ['日','一','二','三','四','五','六'],
  units: ['毫秒','秒钟','分钟','小时','天','个星期|周','个月','年'],
  numbers: ['一','二','三','四','五','六','七','八','九','十'],
  numbersAreDigits: true,
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
});


Date.setLocale('zh-TW', {
  monthSuffix: '月',
  weekdays: ['日','一','二','三','四','五','六'],
  units: ['毫秒','秒鐘','分鐘','小時','天','個星期|週','個月','年'],
  numbers: ['一','二','三','四','五','六','七','八','九','十'],
  numbersAreDigits: true,
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
});


Date.setLocale('ko', {
  monthSuffix: '월',
  weekdays: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  units: ['밀리초','초','분','시간','일','주','개월|달','년'],
  numbers: ['일|한','이','삼','사','오','육','칠','팔','구','십'],
  numbersAreDigits: true,
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
});
