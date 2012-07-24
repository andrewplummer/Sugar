/*
 *
 * Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Date.setLocale('de');
 *
 * var locale = Date.getLocale(<code>) will return this object, which
 * can be tweaked to change the behavior of parsing/formatting in the locales.
 *
 * locale.addFormat adds a date format (see this file for examples).
 * Special tokens in the date format will be parsed out into regex tokens:
 *
 * {0} is a reference to an entry in locale.optionals. Output: (?:the)?
 * {unit} is a reference to all units. Output: (day|week|month|...)
 * {unit3} is a reference to a specific unit. Output: (hour)
 * {unit3-5} is a reference to a subset of the units array. Output: (hour|day|week)
 * {unit?} "?" makes that token optional. Output: (day|week|month)?
 *
 * {day} Any reference to tokens in the modifiers array will include all with the same name. Output: (yesterday|today|tomorrow)
 *
 * All spaces are optional and will be converted to "\s*"
 *
 * Locale arrays months, weekdays, units, numbers, as well as the "src" field for
 * all entries in the modifiers array follow a special format indicated by a colon:
 *
 * minute:|s  = minute|minutes
 * thicke:n|r = thicken|thicker
 *
 * Additionally in the months, weekdays, units, and numbers array these will be added at indexes that are multiples
 * of the relevant number for retrieval. For example having "sunday:|s" in the units array will result in:
 *
 * units: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sundays']
 *
 * When matched, the index will be found using:
 *
 * units.indexOf(match) % 7;
 *
 * Resulting in the correct index with any number of alternates for that entry.
 *
 */

Date.addLocale('de', {
  'plural': true,
   'capitalizeUnit': true,
  'months': 'Januar,Februar,März|Marz,April,Mai,Juni,Juli,August,September,Oktober,November,Dezember',
  'weekdays': 'Sonntag,Montag,Dienstag,Mittwoch,Donnerstag,Freitag,Samstag',
  'units': 'Millisekunde:|n,Sekunde:|n,Minute:|n,Stunde:|n,Tag:|en,Woche:|n,Monat:|en,Jahr:|en',
  'numbers': 'ein:|e|er|en|em,zwei,drei,vier,fuenf,sechs,sieben,acht,neun,zehn',
  'optionals': 'der',
  'short':'{d}. {Month} {yyyy}',
  'long': '{d}. {Month} {yyyy} {H}:{mm}',
  'full': '{Weekday} {d}. {Month} {yyyy} {H}:{mm}:{ss}',
  'past': '{sign} {num} {unit}',
  'future': '{sign} {num} {unit}',
  'duration': '{num} {unit}',
  'timeMarker': 'um',
  'ampm': 'am,pm',
  'modifiers': [
    { 'name': 'day', 'src': 'vorgestern', 'value': -2 },
    { 'name': 'day', 'src': 'gestern', 'value': -1 },
    { 'name': 'day', 'src': 'heute', 'value': 0 },
    { 'name': 'day', 'src': 'morgen', 'value': 1 },
    { 'name': 'day', 'src': 'übermorgen|ubermorgen|uebermorgen', 'value': 2 },
    { 'name': 'sign', 'src': 'vor:|her', 'value': -1 },
    { 'name': 'sign', 'src': 'in', 'value': 1 },
    { 'name': 'shift', 'src': 'letzte:|r|n|s', 'value': -1 },
    { 'name': 'shift', 'src': 'nächste:|r|n|s+nachste:|r|n|s+naechste:|r|n|s+kommende:n|r', 'value': 1 }
  ],
  'dateParse': [
    '{sign} {num} {unit}',
    '{num} {unit} {sign}',
    '{shift} {unit=5-7}'
  ],
  'timeParse': [
    '{weekday?} {date?} {month} {year?}',
    '{shift} {weekday}'
  ]
});

/*
 *
 * Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Date.setLocale('es');
 *
 * var locale = Date.getLocale(<code>) will return this object, which
 * can be tweaked to change the behavior of parsing/formatting in the locales.
 *
 * locale.addFormat adds a date format (see this file for examples).
 * Special tokens in the date format will be parsed out into regex tokens:
 *
 * {0} is a reference to an entry in locale.optionals. Output: (?:the)?
 * {unit} is a reference to all units. Output: (day|week|month|...)
 * {unit3} is a reference to a specific unit. Output: (hour)
 * {unit3-5} is a reference to a subset of the units array. Output: (hour|day|week)
 * {unit?} "?" makes that token optional. Output: (day|week|month)?
 *
 * {day} Any reference to tokens in the modifiers array will include all with the same name. Output: (yesterday|today|tomorrow)
 *
 * All spaces are optional and will be converted to "\s*"
 *
 * Locale arrays months, weekdays, units, numbers, as well as the "src" field for
 * all entries in the modifiers array follow a special format indicated by a colon:
 *
 * minute:|s  = minute|minutes
 * thicke:n|r = thicken|thicker
 *
 * Additionally in the months, weekdays, units, and numbers array these will be added at indexes that are multiples
 * of the relevant number for retrieval. For example having "sunday:|s" in the units array will result in:
 *
 * units: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sundays']
 *
 * When matched, the index will be found using:
 *
 * units.indexOf(match) % 7;
 *
 * Resulting in the correct index with any number of alternates for that entry.
 *
 */

Date.addLocale('es', {
  'plural': true,
  'months': 'enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre',
  'weekdays': 'domingo,lunes,martes,miércoles|miercoles,jueves,viernes,sábado|sabado',
  'units': 'milisegundo:|s,segundo:|s,minuto:|s,hora:|s,día|días|dia|dias,semana:|s,mes:|es,año|años|ano|anos',
  'numbers': 'uno,dos,tres,cuatro,cinco,seis,siete,ocho,nueve,diez',
  'optionals': 'el,de',
  'short':'{d} {month} {yyyy}',
  'long': '{d} {month} {yyyy} {H}:{mm}',
  'full': '{Weekday} {d} {month} {yyyy} {H}:{mm}:{ss}',
  'past': '{sign} {num} {unit}',
  'future': '{num} {unit} {sign}',
  'duration': '{num} {unit}',
  'timeMarker': 'a las',
  'ampm': 'am,pm',
  'modifiers': [
    { 'name': 'day', 'src': 'anteayer', 'value': -2 },
    { 'name': 'day', 'src': 'ayer', 'value': -1 },
    { 'name': 'day', 'src': 'hoy', 'value': 0 },
    { 'name': 'day', 'src': 'mañana|manana', 'value': 1 },
    { 'name': 'sign', 'src': 'hace', 'value': -1 },
    { 'name': 'sign', 'src': 'de ahora', 'value': 1 },
    { 'name': 'shift', 'src': 'pasad:o|a', 'value': -1 },
    { 'name': 'shift', 'src': 'próximo|próxima|proximo|proxima', 'value': 1 }
  ],
  'dateParse': [
    '{sign} {num} {unit}',
    '{num} {unit} {sign}',
    '{0} {unit=5-7} {shift}',
    '{0} {shift} {unit=5-7}'
  ],
  'timeParse': [
    '{shift} {weekday}',
    '{weekday} {shift}',
    '{date?} {1} {month} {1} {year?}'
  ]
});
/*
 *
 * Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Date.setLocale('fr');
 *
 * var locale = Date.getLocale(<code>) will return this object, which
 * can be tweaked to change the behavior of parsing/formatting in the locales.
 *
 * locale.addFormat adds a date format (see this file for examples).
 * Special tokens in the date format will be parsed out into regex tokens:
 *
 * {0} is a reference to an entry in locale.optionals. Output: (?:the)?
 * {unit} is a reference to all units. Output: (day|week|month|...)
 * {unit3} is a reference to a specific unit. Output: (hour)
 * {unit3-5} is a reference to a subset of the units array. Output: (hour|day|week)
 * {unit?} "?" makes that token optional. Output: (day|week|month)?
 *
 * {day} Any reference to tokens in the modifiers array will include all with the same name. Output: (yesterday|today|tomorrow)
 *
 * All spaces are optional and will be converted to "\s*"
 *
 * Locale arrays months, weekdays, units, numbers, as well as the "src" field for
 * all entries in the modifiers array follow a special format indicated by a colon:
 *
 * minute:|s  = minute|minutes
 * thicke:n|r = thicken|thicker
 *
 * Additionally in the months, weekdays, units, and numbers array these will be added at indexes that are multiples
 * of the relevant number for retrieval. For example having "sunday:|s" in the units array will result in:
 *
 * units: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sundays']
 *
 * When matched, the index will be found using:
 *
 * units.indexOf(match) % 7;
 *
 * Resulting in the correct index with any number of alternates for that entry.
 *
 */

Date.addLocale('fr', {
  'plural': true,
  'months': 'janvier,février|fevrier,mars,avril,mai,juin,juillet,août,septembre,octobre,novembre,décembre|decembre',
  'weekdays': 'dimanche,lundi,mardi,mercredi,jeudi,vendredi,samedi',
  'units': 'milliseconde:|s,seconde:|s,minute:|s,heure:|s,jour:|s,semaine:|s,mois,an:|s|née|nee',
  'numbers': 'un:|e,deux,trois,quatre,cinq,six,sept,huit,neuf,dix',
  'optionals': ["l'|la|le"],
  'short':'{d} {month} {yyyy}',
  'long': '{d} {month} {yyyy} {H}:{mm}',
  'full': '{Weekday} {d} {month} {yyyy} {H}:{mm}:{ss}',
  'past': '{sign} {num} {unit}',
  'future': '{sign} {num} {unit}',
  'duration': '{num} {unit}',
  'timeMarker': 'à',
  'ampm': 'am,pm',
  'modifiers': [
    { 'name': 'day', 'src': 'hier', 'value': -1 },
    { 'name': 'day', 'src': "aujourd'hui", 'value': 0 },
    { 'name': 'day', 'src': 'demain', 'value': 1 },
    { 'name': 'sign', 'src': 'il y a', 'value': -1 },
    { 'name': 'sign', 'src': "dans|d'ici", 'value': 1 },
    { 'name': 'shift', 'src': 'derni:èr|er|ère|ere', 'value': -1 },
    { 'name': 'shift', 'src': 'prochain:|e', 'value': 1 }
  ],
  'dateParse': [
    '{sign} {num} {unit}',
    '{sign} {num} {unit}',
    '{0} {unit=5-7} {shift}'
  ],
  'timeParse': [
    '{0} {date?} {month} {year?}',
    '{0} {weekday} {shift}'
  ]
});

/*
 *
 * Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Date.setLocale('it');
 *
 * var locale = Date.getLocale(<code>) will return this object, which
 * can be tweaked to change the behavior of parsing/formatting in the locales.
 *
 * locale.addFormat adds a date format (see this file for examples).
 * Special tokens in the date format will be parsed out into regex tokens:
 *
 * {0} is a reference to an entry in locale.optionals. Output: (?:the)?
 * {unit} is a reference to all units. Output: (day|week|month|...)
 * {unit3} is a reference to a specific unit. Output: (hour)
 * {unit3-5} is a reference to a subset of the units array. Output: (hour|day|week)
 * {unit?} "?" makes that token optional. Output: (day|week|month)?
 *
 * {day} Any reference to tokens in the modifiers array will include all with the same name. Output: (yesterday|today|tomorrow)
 *
 * All spaces are optional and will be converted to "\s*"
 *
 * Locale arrays months, weekdays, units, numbers, as well as the "src" field for
 * all entries in the modifiers array follow a special format indicated by a colon:
 *
 * minute:|s  = minute|minutes
 * thicke:n|r = thicken|thicker
 *
 * Additionally in the months, weekdays, units, and numbers array these will be added at indexes that are multiples
 * of the relevant number for retrieval. For example having "sunday:|s" in the units array will result in:
 *
 * units: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sundays']
 *
 * When matched, the index will be found using:
 *
 * units.indexOf(match) % 7;
 *
 * Resulting in the correct index with any number of alternates for that entry.
 *
 */

Date.addLocale('it', {
  'plural': true,
  'months': 'Gennaio,Febbraio,Marzo,Aprile,Maggio,Giugno,Luglio,Agosto,Settembre,Ottobre,Novembre,Dicembre',
  'weekdays': 'Domenica,Luned:ì|i,Marted:ì|i,Mercoled:ì|i,Gioved:ì|i,Venerd:ì|i,Sabato',
  'units': 'millisecond:o|i,second:o|i,minut:o|i,or:a|e,giorn:o|i,settiman:a|e,mes:e|i,ann:o|i',
  'numbers': "un:|a|o|',due,tre,quattro,cinque,sei,sette,otto,nove,dieci",
  'optionals': "l'|la|il",
  'short':'{d} {Month} {yyyy}',
  'long': '{d} {Month} {yyyy} {H}:{mm}',
  'full': '{Weekday} {d} {Month} {yyyy} {H}:{mm}:{ss}',
  'past': '{num} {unit} {sign}',
  'future': '{num} {unit} {sign}',
  'duration': '{num} {unit}',
  'timeMarker': 'alle',
  'ampm': 'am,pm',
  'modifiers': [
    { 'name': 'day', 'src': 'ieri', 'value': -1 },
    { 'name': 'day', 'src': 'oggi', 'value': 0 },
    { 'name': 'day', 'src': 'domani', 'value': 1 },
    { 'name': 'day', 'src': 'dopodomani', 'value': 2 },
    { 'name': 'sign', 'src': 'fa', 'value': -1 },
    { 'name': 'sign', 'src': 'da adesso', 'value': 1 },
    { 'name': 'shift', 'src': 'scors:o|a', 'value': -1 },
    { 'name': 'shift', 'src': 'prossim:o|a', 'value': 1 }
  ],
  'dateParse': [
    '{num} {unit} {sign}',
    '{0} {unit=5-7} {shift}',
    '{0} {shift} {unit=5-7}'
  ],
  'timeParse': [
    '{weekday?} {date?} {month} {year?}',
    '{shift} {weekday}'
  ]
});

/*
 *
 * Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Date.setLocale('ja');
 *
 * var locale = Date.getLocale(<code>) will return this object, which
 * can be tweaked to change the behavior of parsing/formatting in the locales.
 *
 * locale.addFormat adds a date format (see this file for examples).
 * Special tokens in the date format will be parsed out into regex tokens:
 *
 * {0} is a reference to an entry in locale.optionals. Output: (?:the)?
 * {unit} is a reference to all units. Output: (day|week|month|...)
 * {unit3} is a reference to a specific unit. Output: (hour)
 * {unit3-5} is a reference to a subset of the units array. Output: (hour|day|week)
 * {unit?} "?" makes that token optional. Output: (day|week|month)?
 *
 * {day} Any reference to tokens in the modifiers array will include all with the same name. Output: (yesterday|today|tomorrow)
 *
 * All spaces are optional and will be converted to "\s*"
 *
 * Locale arrays months, weekdays, units, numbers, as well as the "src" field for
 * all entries in the modifiers array follow a special format indicated by a colon:
 *
 * minute:|s  = minute|minutes
 * thicke:n|r = thicken|thicker
 *
 * Additionally in the months, weekdays, units, and numbers array these will be added at indexes that are multiples
 * of the relevant number for retrieval. For example having "sunday:|s" in the units array will result in:
 *
 * units: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sundays']
 *
 * When matched, the index will be found using:
 *
 * units.indexOf(match) % 7;
 *
 * Resulting in the correct index with any number of alternates for that entry.
 *
 */

Date.addLocale('ja', {
  'monthSuffix': '月',
  'weekdays': '日曜日,月曜日,火曜日,水曜日,木曜日,金曜日,土曜日',
  'units': 'ミリ秒,秒,分,時間,日,週間|週,ヶ月|ヵ月|月,年',
  'short': '{yyyy}年{M}月{d}日',
  'long': '{yyyy}年{M}月{d}日 {H}時{mm}分',
  'full': '{yyyy}年{M}月{d}日 {Weekday} {H}時{mm}分{ss}秒',
  'past': '{num}{unit}{sign}',
  'future': '{num}{unit}{sign}',
  'duration': '{num}{unit}',
  'timeSuffixes': '時,分,秒',
  'ampm': '午前,午後',
  'modifiers': [
    { 'name': 'day', 'src': '一昨日', 'value': -2 },
    { 'name': 'day', 'src': '昨日', 'value': -1 },
    { 'name': 'day', 'src': '今日', 'value': 0 },
    { 'name': 'day', 'src': '明日', 'value': 1 },
    { 'name': 'day', 'src': '明後日', 'value': 2 },
    { 'name': 'sign', 'src': '前', 'value': -1 },
    { 'name': 'sign', 'src': '後', 'value':  1 },
    { 'name': 'shift', 'src': '去|先', 'value': -1 },
    { 'name': 'shift', 'src': '来', 'value':  1 }
  ],
  'dateParse': [
    '{num}{unit}{sign}'
  ],
  'timeParse': [
    '{shift}{unit=5-7}{weekday?}',
    '{year}年{month?}月?{date?}日?',
    '{month}月{date?}日?',
    '{date}日'
  ]
});

/*
 *
 * Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Date.setLocale('ko');
 *
 * var locale = Date.getLocale(<code>) will return this object, which
 * can be tweaked to change the behavior of parsing/formatting in the locales.
 *
 * locale.addFormat adds a date format (see this file for examples).
 * Special tokens in the date format will be parsed out into regex tokens:
 *
 * {0} is a reference to an entry in locale.optionals. Output: (?:the)?
 * {unit} is a reference to all units. Output: (day|week|month|...)
 * {unit3} is a reference to a specific unit. Output: (hour)
 * {unit3-5} is a reference to a subset of the units array. Output: (hour|day|week)
 * {unit?} "?" makes that token optional. Output: (day|week|month)?
 *
 * {day} Any reference to tokens in the modifiers array will include all with the same name. Output: (yesterday|today|tomorrow)
 *
 * All spaces are optional and will be converted to "\s*"
 *
 * Locale arrays months, weekdays, units, numbers, as well as the "src" field for
 * all entries in the modifiers array follow a special format indicated by a colon:
 *
 * minute:|s  = minute|minutes
 * thicke:n|r = thicken|thicker
 *
 * Additionally in the months, weekdays, units, and numbers array these will be added at indexes that are multiples
 * of the relevant number for retrieval. For example having "sunday:|s" in the units array will result in:
 *
 * units: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sundays']
 *
 * When matched, the index will be found using:
 *
 * units.indexOf(match) % 7;
 *
 * Resulting in the correct index with any number of alternates for that entry.
 *
 */

Date.addLocale('ko', {
  'digitDate': true,
  'monthSuffix': '월',
  'weekdays': '일요일,월요일,화요일,수요일,목요일,금요일,토요일',
  'units': '밀리초,초,분,시간,일,주,개월|달,년',
  'numbers': '일|한,이,삼,사,오,육,칠,팔,구,십',
  'short': '{yyyy}년{M}월{d}일',
  'long': '{yyyy}년{M}월{d}일 {H}시{mm}분',
  'full': '{yyyy}년{M}월{d}일 {Weekday} {H}시{mm}분{ss}초',
  'past': '{num}{unit} {sign}',
  'future': '{num}{unit} {sign}',
  'duration': '{num}{unit}',
  'timeSuffixes': '시,분,초',
  'ampm': '오전,오후',
  'modifiers': [
    { 'name': 'day', 'src': '그저께', 'value': -2 },
    { 'name': 'day', 'src': '어제', 'value': -1 },
    { 'name': 'day', 'src': '오늘', 'value': 0 },
    { 'name': 'day', 'src': '내일', 'value': 1 },
    { 'name': 'day', 'src': '모레', 'value': 2 },
    { 'name': 'sign', 'src': '전', 'value': -1 },
    { 'name': 'sign', 'src': '후', 'value':  1 },
    { 'name': 'shift', 'src': '지난|작', 'value': -1 },
    { 'name': 'shift', 'src': '이번', 'value': 0 },
    { 'name': 'shift', 'src': '다음|내', 'value': 1 }
  ],
  'dateParse': [
    '{num}{unit} {sign}',
    '{shift?} {unit=5-7}'
  ],
  'timeParse': [
    '{shift} {unit=5?} {weekday}',
    '{year}년{month?}월?{date?}일?',
    '{month}월{date?}일?',
    '{date}일'
  ]
});

/*
 *
 * Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Date.setLocale('pl');
 *
 * var locale = Date.getLocale(<code>) will return this object, which
 * can be tweaked to change the behavior of parsing/formatting in the locales.
 *
 * locale.addFormat adds a date format (see this file for examples).
 * Special tokens in the date format will be parsed out into regex tokens:
 *
 * {0} is a reference to an entry in locale.optionals. Output: (?:the)?
 * {unit} is a reference to all units. Output: (day|week|month|...)
 * {unit3} is a reference to a specific unit. Output: (hour)
 * {unit3-5} is a reference to a subset of the units array. Output: (hour|day|week)
 * {unit?} "?" makes that token optional. Output: (day|week|month)?
 *
 * {day} Any reference to tokens in the modifiers array will include all with the same name. Output: (yesterday|today|tomorrow)
 *
 * All spaces are optional and will be converted to "\s*"
 *
 * Locale arrays months, weekdays, units, numbers, as well as the "src" field for
 * all entries in the modifiers array follow a special format indicated by a colon:
 *
 * minute:|s  = minute|minutes
 * thicke:n|r = thicken|thicker
 *
 * Additionally in the months, weekdays, units, and numbers array these will be added at indexes that are multiples
 * of the relevant number for retrieval. For example having "sunday:|s" in the units array will result in:
 *
 * units: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sundays']
 *
 * When matched, the index will be found using:
 *
 * units.indexOf(match) % 7;
 *
 * Resulting in the correct index with any number of alternates for that entry.
 *
 */

Date.addLocale('pl', {
  'plural':    true,
  'months':    'Styczeń|Stycznia,Luty|Lutego,Marzec|Marca,Kwiecień|Kwietnia,Maj|Maja,Czerwiec|Czerwca,Lipiec|Lipca,Sierpień|Sierpnia,Wrzesień|Września,Październik|Października,Listopad|Listopada,Grudzień|Grudnia',
  'weekdays':  'Niedziela|Niedzielę,Poniedziałek,Wtorek,Środ:a|ę,Czwartek,Piątek,Sobota|Sobotę',
  'units':     'milisekund:a|y|,sekund:a|y|,minut:a|y|,godzin:a|y|,dzień|dni,tydzień|tygodnie|tygodni,miesiące|miesiące|miesięcy,rok|lata|lat',
  'numbers':   'jeden|jedną,dwa|dwie,trzy,cztery,pięć,sześć,siedem,osiem,dziewięć,dziesięć',
  'optionals': 'w|we,roku',
  'short':     '{d} {Month} {yyyy}',
  'long':      '{d} {Month} {yyyy} {H}:{mm}',
  'full' :     '{Weekday}, {d} {Month} {yyyy} {H}:{mm}:{ss}',
  'past':      '{num} {unit} {sign}',
  'future':    '{sign} {num} {unit}',
  'duration':  '{num} {unit}',
  'timeMarker':'o',
  'ampm':      'am,pm',
  'modifiers': [
    { 'name': 'day', 'src': 'przedwczoraj', 'value': -2 },
    { 'name': 'day', 'src': 'wczoraj', 'value': -1 },
    { 'name': 'day', 'src': 'dzisiaj|dziś', 'value': 0 },
    { 'name': 'day', 'src': 'jutro', 'value': 1 },
    { 'name': 'day', 'src': 'pojutrze', 'value': 2 },
    { 'name': 'sign', 'src': 'temu|przed', 'value': -1 },
    { 'name': 'sign', 'src': 'za', 'value': 1 },
    { 'name': 'shift', 'src': 'zeszły|zeszła|ostatni|ostatnia', 'value': -1 },
    { 'name': 'shift', 'src': 'następny|następna|następnego|przyszły|przyszła|przyszłego', 'value': 1 }
  ],
  'dateParse': [
    '{num} {unit} {sign}',
    '{sign} {num} {unit}',
    '{month} {year}',
    '{shift} {unit=5-7}',
    '{0} {shift?} {weekday}'
  ],
  'timeParse': [
    '{date} {month} {year?} {1}',
    '{0} {shift?} {weekday}'
  ]
});

/*
 *
 * Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Date.setLocale('pt');
 *
 * var locale = Date.getLocale(<code>) will return this object, which
 * can be tweaked to change the behavior of parsing/formatting in the locales.
 *
 * locale.addFormat adds a date format (see this file for examples).
 * Special tokens in the date format will be parsed out into regex tokens:
 *
 * {0} is a reference to an entry in locale.optionals. Output: (?:the)?
 * {unit} is a reference to all units. Output: (day|week|month|...)
 * {unit3} is a reference to a specific unit. Output: (hour)
 * {unit3-5} is a reference to a subset of the units array. Output: (hour|day|week)
 * {unit?} "?" makes that token optional. Output: (day|week|month)?
 *
 * {day} Any reference to tokens in the modifiers array will include all with the same name. Output: (yesterday|today|tomorrow)
 *
 * All spaces are optional and will be converted to "\s*"
 *
 * Locale arrays months, weekdays, units, numbers, as well as the "src" field for
 * all entries in the modifiers array follow a special format indicated by a colon:
 *
 * minute:|s  = minute|minutes
 * thicke:n|r = thicken|thicker
 *
 * Additionally in the months, weekdays, units, and numbers array these will be added at indexes that are multiples
 * of the relevant number for retrieval. For example having "sunday:|s" in the units array will result in:
 *
 * units: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sundays']
 *
 * When matched, the index will be found using:
 *
 * units.indexOf(match) % 7;
 *
 * Resulting in the correct index with any number of alternates for that entry.
 *
 */

Date.addLocale('pt', {
  'plural': true,
  'months': 'janeiro,fevereiro,março,abril,maio,junho,julho,agosto,setembro,outubro,novembro,dezembro',
  'weekdays': 'domingo,segunda-feira,terça-feira,quarta-feira,quinta-feira,sexta-feira,sábado|sabado',
  'units': 'milisegundo:|s,segundo:|s,minuto:|s,hora:|s,dia:|s,semana:|s,mês|mêses|mes|meses,ano:|s',
  'numbers': 'um,dois,três|tres,quatro,cinco,seis,sete,oito,nove,dez,uma,duas',
  'optionals': 'a,de',
  'short':'{d} de {month} de {yyyy}',
  'long': '{d} de {month} de {yyyy} {H}:{mm}',
  'full': '{Weekday}, {d} de {month} de {yyyy} {H}:{mm}:{ss}',
  'past': '{num} {unit} {sign}',
  'future': '{sign} {num} {unit}',
  'duration': '{num} {unit}',
  'timeMarker': 'às',
  'ampm': 'am,pm',
  'modifiers': [
    { 'name': 'day', 'src': 'anteontem', 'value': -2 },
    { 'name': 'day', 'src': 'ontem', 'value': -1 },
    { 'name': 'day', 'src': 'hoje', 'value': 0 },
    { 'name': 'day', 'src': 'amanh:ã|a', 'value': 1 },
    { 'name': 'sign', 'src': 'atrás|atras|há|ha', 'value': -1 },
    { 'name': 'sign', 'src': 'daqui a', 'value': 1 },
    { 'name': 'shift', 'src': 'passad:o|a', 'value': -1 },
    { 'name': 'shift', 'src': 'próximo|próxima|proximo|proxima', 'value': 1 }
  ],
  'dateParse': [
    '{num} {unit} {sign}',
    '{sign} {num} {unit}',
    '{0} {unit=5-7} {shift}',
    '{0} {shift} {unit=5-7}'
  ],
  'timeParse': [
    '{date?} {1} {month} {1} {year?}',
    '{0} {shift} {weekday}'
  ]
});

/*
 *
 * Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Date.setLocale('ru');
 *
 * var locale = Date.getLocale(<code>) will return this object, which
 * can be tweaked to change the behavior of parsing/formatting in the locales.
 *
 * locale.addFormat adds a date format (see this file for examples).
 * Special tokens in the date format will be parsed out into regex tokens:
 *
 * {0} is a reference to an entry in locale.optionals. Output: (?:the)?
 * {unit} is a reference to all units. Output: (day|week|month|...)
 * {unit3} is a reference to a specific unit. Output: (hour)
 * {unit3-5} is a reference to a subset of the units array. Output: (hour|day|week)
 * {unit?} "?" makes that token optional. Output: (day|week|month)?
 *
 * {day} Any reference to tokens in the modifiers array will include all with the same name. Output: (yesterday|today|tomorrow)
 *
 * All spaces are optional and will be converted to "\s*"
 *
 * Locale arrays months, weekdays, units, numbers, as well as the "src" field for
 * all entries in the modifiers array follow a special format indicated by a colon:
 *
 * minute:|s  = minute|minutes
 * thicke:n|r = thicken|thicker
 *
 * Additionally in the months, weekdays, units, and numbers array these will be added at indexes that are multiples
 * of the relevant number for retrieval. For example having "sunday:|s" in the units array will result in:
 *
 * units: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sundays']
 *
 * When matched, the index will be found using:
 *
 * units.indexOf(match) % 7;
 *
 * Resulting in the correct index with any number of alternates for that entry.
 *
 */

Date.addLocale('ru', {
  'months': 'Январ:я|ь,Феврал:я|ь,Март:а|,Апрел:я|ь,Ма:я|й,Июн:я|ь,Июл:я|ь,Август:а|,Сентябр:я|ь,Октябр:я|ь,Ноябр:я|ь,Декабр:я|ь',
  'weekdays': 'Воскресенье,Понедельник,Вторник,Среда,Четверг,Пятница,Суббота',
  'units': 'миллисекунд:а|у|ы|,секунд:а|у|ы|,минут:а|у|ы|,час:||а|ов,день|день|дня|дней,недел:я|ю|и|ь|е,месяц:||а|ев|е,год|год|года|лет|году',
  'numbers': 'од:ин|ну,дв:а|е,три,четыре,пять,шесть,семь,восемь,девять,десять',
  'optionals': 'в|на,года',
  'short':'{d} {month} {yyyy} года',
  'long': '{d} {month} {yyyy} года {H}:{mm}',
  'full': '{Weekday} {d} {month} {yyyy} года {H}:{mm}:{ss}',
  'past': '{num} {unit} {sign}',
  'future': '{sign} {num} {unit}',
  'duration': '{num} {unit}',
  'timeMarker': 'в',
  'ampm': ' утра, вечера',
  'modifiers': [
    { 'name': 'day', 'src': 'позавчера', 'value': -2 },
    { 'name': 'day', 'src': 'вчера', 'value': -1 },
    { 'name': 'day', 'src': 'сегодня', 'value': 0 },
    { 'name': 'day', 'src': 'завтра', 'value': 1 },
    { 'name': 'day', 'src': 'послезавтра', 'value': 2 },
    { 'name': 'sign', 'src': 'назад', 'value': -1 },
    { 'name': 'sign', 'src': 'через', 'value': 1 },
    { 'name': 'shift', 'src': 'прошл:ый|ой|ом', 'value': -1 },
    { 'name': 'shift', 'src': 'следующ:ий|ей|ем', 'value': 1 }
  ],
  'dateParse': [
    '{num} {unit} {sign}',
    '{sign} {num} {unit}',
    '{month} {year}',
    '{0} {shift} {unit=5-7}'
  ],
  'timeParse': [
    '{date} {month} {year?} {1}',
    '{0} {shift} {weekday}'
  ]
});

/*
 *
 * Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Date.setLocale('sv');
 *
 * var locale = Date.getLocale(<code>) will return this object, which
 * can be tweaked to change the behavior of parsing/formatting in the locales.
 *
 * locale.addFormat adds a date format (see this file for examples).
 * Special tokens in the date format will be parsed out into regex tokens:
 *
 * {0} is a reference to an entry in locale.optionals. Output: (?:the)?
 * {unit} is a reference to all units. Output: (day|week|month|...)
 * {unit3} is a reference to a specific unit. Output: (hour)
 * {unit3-5} is a reference to a subset of the units array. Output: (hour|day|week)
 * {unit?} "?" makes that token optional. Output: (day|week|month)?
 *
 * {day} Any reference to tokens in the modifiers array will include all with the same name. Output: (yesterday|today|tomorrow)
 *
 * All spaces are optional and will be converted to "\s*"
 *
 * Locale arrays months, weekdays, units, numbers, as well as the "src" field for
 * all entries in the modifiers array follow a special format indicated by a colon:
 *
 * minute:|s  = minute|minutes
 * thicke:n|r = thicken|thicker
 *
 * Additionally in the months, weekdays, units, and numbers array these will be added at indexes that are multiples
 * of the relevant number for retrieval. For example having "sunday:|s" in the units array will result in:
 *
 * units: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sundays']
 *
 * When matched, the index will be found using:
 *
 * units.indexOf(match) % 7;
 *
 * Resulting in the correct index with any number of alternates for that entry.
 *
 */

Date.addLocale('sv', {
  'plural': true,
  'months': 'januari,februari,mars,april,maj,juni,juli,augusti,september,oktober,november,december',
  'weekdays': 'söndag|sondag,måndag:|en+mandag:|en,tisdag,onsdag,torsdag,fredag,lördag|lordag',
  'units': 'millisekund:|er,sekund:|er,minut:|er,timm:e|ar,dag:|ar,veck:a|or|an,månad:|er|en+manad:|er|en,år:||et+ar:||et',
  'numbers': 'en|ett,två|tva,tre,fyra,fem,sex,sju,åtta|atta,nio,tio',
  'optionals': 'den,för|for',
  'articles': 'den',
  'short':'den {d} {month} {yyyy}',
  'long': 'den {d} {month} {yyyy} {H}:{mm}',
  'full': '{Weekday} den {d} {month} {yyyy} {H}:{mm}:{ss}',
  'past': '{num} {unit} {sign}',
  'future': '{sign} {num} {unit}',
  'duration': '{num} {unit}',
  'ampm': 'am,pm',
  'modifiers': [
    { 'name': 'day', 'src': 'förrgår|i förrgår|iförrgår|forrgar|i forrgar|iforrgar', 'value': -2 },
    { 'name': 'day', 'src': 'går|i går|igår|gar|i gar|igar', 'value': -1 },
    { 'name': 'day', 'src': 'dag|i dag|idag', 'value': 0 },
    { 'name': 'day', 'src': 'morgon|i morgon|imorgon', 'value': 1 },
    { 'name': 'day', 'src': 'över morgon|övermorgon|i över morgon|i övermorgon|iövermorgon|over morgon|overmorgon|i over morgon|i overmorgon|iovermorgon', 'value': 2 },
    { 'name': 'sign', 'src': 'sedan|sen', 'value': -1 },
    { 'name': 'sign', 'src': 'om', 'value':  1 },
    { 'name': 'shift', 'src': 'i förra|förra|i forra|forra', 'value': -1 },
    { 'name': 'shift', 'src': 'denna', 'value': 0 },
    { 'name': 'shift', 'src': 'nästa|nasta', 'value': 1 }
  ],
  'dateParse': [
    '{num} {unit} {sign}',
    '{sign} {num} {unit}',
    '{1} {num} {unit} {sign}',
    '{shift} {unit5-7}'
  ],
  'timeParse': [
    '{0} {weekday?} {date?} {month} {year}',
    '{date} {month}',
    '{shift} {weekday}'
  ]
});

/*
 *
 * Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Date.setLocale('zh-CN');
 *
 * var locale = Date.getLocale(<code>) will return this object, which
 * can be tweaked to change the behavior of parsing/formatting in the locales.
 *
 * locale.addFormat adds a date format (see this file for examples).
 * Special tokens in the date format will be parsed out into regex tokens:
 *
 * {0} is a reference to an entry in locale.optionals. Output: (?:the)?
 * {unit} is a reference to all units. Output: (day|week|month|...)
 * {unit3} is a reference to a specific unit. Output: (hour)
 * {unit3-5} is a reference to a subset of the units array. Output: (hour|day|week)
 * {unit?} "?" makes that token optional. Output: (day|week|month)?
 *
 * {day} Any reference to tokens in the modifiers array will include all with the same name. Output: (yesterday|today|tomorrow)
 *
 * All spaces are optional and will be converted to "\s*"
 *
 * Locale arrays months, weekdays, units, numbers, as well as the "src" field for
 * all entries in the modifiers array follow a special format indicated by a colon:
 *
 * minute:|s  = minute|minutes
 * thicke:n|r = thicken|thicker
 *
 * Additionally in the months, weekdays, units, and numbers array these will be added at indexes that are multiples
 * of the relevant number for retrieval. For example having "sunday:|s" in the units array will result in:
 *
 * units: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sundays']
 *
 * When matched, the index will be found using:
 *
 * units.indexOf(match) % 7;
 *
 * Resulting in the correct index with any number of alternates for that entry.
 *
 */

Date.addLocale('zh-CN', {
  'variant': true,
  'monthSuffix': '月',
  'weekdays': '星期日|周日,星期一|周一,星期二|周二,星期三|周三,星期四|周四,星期五|周五,星期六|周六',
  'units': '毫秒,秒钟,分钟,小时,天,个星期|周,个月,年',
  'optionals': '日|号',
  'short':'{yyyy}年{M}月{d}日',
  'long': '{yyyy}年{M}月{d}日 {tt}{h}:{mm}',
  'full': '{yyyy}年{M}月{d}日 {weekday} {tt}{h}:{mm}:{ss}',
  'past': '{num}{unit}{sign}',
  'future': '{num}{unit}{sign}',
  'duration': '{num}{unit}',
  'timeSuffixes': '点|时,分钟?,秒',
  'ampm': '上午,下午',
  'modifiers': [
    { 'name': 'day', 'src': '前天', 'value': -2 },
    { 'name': 'day', 'src': '昨天', 'value': -1 },
    { 'name': 'day', 'src': '今天', 'value': 0 },
    { 'name': 'day', 'src': '明天', 'value': 1 },
    { 'name': 'day', 'src': '后天', 'value': 2 },
    { 'name': 'sign', 'src': '前', 'value': -1 },
    { 'name': 'sign', 'src': '后', 'value':  1 },
    { 'name': 'shift', 'src': '上|去', 'value': -1 },
    { 'name': 'shift', 'src': '这', 'value':  0 },
    { 'name': 'shift', 'src': '下|明', 'value':  1 }
  ],
  'dateParse': [
    '{num}{unit}{sign}',
    '{shift}{unit=5-7}'
  ],
  'timeParse': [
    '{shift}{weekday}',
    '{year}年{month?}月?{date?}{0}',
    '{month}月{date?}{0}',
    '{date}{0}'
  ]
});

/*
 *
 * Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Date.setLocale('zh-TW');
 *
 * var locale = Date.getLocale(<code>) will return this object, which
 * can be tweaked to change the behavior of parsing/formatting in the locales.
 *
 * locale.addFormat adds a date format (see this file for examples).
 * Special tokens in the date format will be parsed out into regex tokens:
 *
 * {0} is a reference to an entry in locale.optionals. Output: (?:the)?
 * {unit} is a reference to all units. Output: (day|week|month|...)
 * {unit3} is a reference to a specific unit. Output: (hour)
 * {unit3-5} is a reference to a subset of the units array. Output: (hour|day|week)
 * {unit?} "?" makes that token optional. Output: (day|week|month)?
 *
 * {day} Any reference to tokens in the modifiers array will include all with the same name. Output: (yesterday|today|tomorrow)
 *
 * All spaces are optional and will be converted to "\s*"
 *
 * Locale arrays months, weekdays, units, numbers, as well as the "src" field for
 * all entries in the modifiers array follow a special format indicated by a colon:
 *
 * minute:|s  = minute|minutes
 * thicke:n|r = thicken|thicker
 *
 * Additionally in the months, weekdays, units, and numbers array these will be added at indexes that are multiples
 * of the relevant number for retrieval. For example having "sunday:|s" in the units array will result in:
 *
 * units: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sundays']
 *
 * When matched, the index will be found using:
 *
 * units.indexOf(match) % 7;
 *
 * Resulting in the correct index with any number of alternates for that entry.
 *
 */

  //'zh-TW': '1;月;年;;星期日|週日,星期一|週一,星期二|週二,星期三|週三,星期四|週四,星期五|週五,星期六|週六;毫秒,秒鐘,分鐘,小時,天,個星期|週,個月,年;;;日|號;;上午,下午;點|時,分鐘?,秒;{num}{unit}{sign},{shift}{unit=5-7};{shift}{weekday},{year}年{month?}月?{date?}{0},{month}月{date?}{0},{date}{0};{yyyy}年{M}月{d}日 {Weekday};{tt}{h}:{mm}:{ss};前天,昨天,今天,明天,後天;,前,,後;,上|去,這,下|明',

Date.addLocale('zh-TW', {
  'monthSuffix': '月',
  'weekdays': '星期日|週日,星期一|週一,星期二|週二,星期三|週三,星期四|週四,星期五|週五,星期六|週六',
  'units': '毫秒,秒鐘,分鐘,小時,天,個星期|週,個月,年',
  'optionals': '日|號',
  'short':'{yyyy}年{M}月{d}日',
  'long': '{yyyy}年{M}月{d}日 {tt}{h}:{mm}',
  'full': '{yyyy}年{M}月{d}日 {Weekday} {tt}{h}:{mm}:{ss}',
  'past': '{num}{unit}{sign}',
  'future': '{num}{unit}{sign}',
  'duration': '{num}{unit}',
  'timeSuffixes': '點|時,分鐘?,秒',
  'ampm': '上午,下午',
  'modifiers': [
    { 'name': 'day', 'src': '前天', 'value': -2 },
    { 'name': 'day', 'src': '昨天', 'value': -1 },
    { 'name': 'day', 'src': '今天', 'value': 0 },
    { 'name': 'day', 'src': '明天', 'value': 1 },
    { 'name': 'day', 'src': '後天', 'value': 2 },
    { 'name': 'sign', 'src': '前', 'value': -1 },
    { 'name': 'sign', 'src': '後', 'value': 1 },
    { 'name': 'shift', 'src': '上|去', 'value': -1 },
    { 'name': 'shift', 'src': '這', 'value':  0 },
    { 'name': 'shift', 'src': '下|明', 'value':  1 }
  ],
  'dateParse': [
    '{num}{unit}{sign}',
    '{shift}{unit=5-7}'
  ],
  'timeParse': [
    '{shift}{weekday}',
    '{year}年{month?}月?{date?}{0}',
    '{month}月{date?}{0}',
    '{date}{0}'
  ]
});

