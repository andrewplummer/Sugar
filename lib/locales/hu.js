/*
 * Hungarian locale definition.
 * See the readme for customization and more information.
 * To set this locale globally:
 *
 * Sugar.Date.setLocale('hu')
 *
 */
Sugar.Date.addLocale('hu', {
  'plural': true,
  'units': 'ezredmásodperc:|n,másodperc:|n,perc:|n,óra:|n,nap:|en,hét:|n,hónap:|en,év:|en|e',
  'months': 'jan.|jan:uár|,feb.|feb:ruár|,márc.|márc:ius|,ápr.|ápr:ilis|,máj.|máj:us|,jun.|jún.|jún:ius|,jul.|júl.|júl:ius|,aug.|aug:usztus|,szept.|szept:ember|,okt.|okt:óber|,nov.|nov:ember|,dec.|dec:ember|',
  'weekdays': 'So:nntag|,Mo:ntag|,Di:enstag|,Mi:ttwoch|,Do:nnerstag|,Fr:eitag|,Sa:mstag|',
  'numerals': 'null,ein:|e|er|en|em,zwei,drei,vier,fuenf,sechs,sieben,acht,neun,zehn',
  'tokens': 'der',
  'short': '{dd}.{MM}.{yyyy}',
  'medium': '{d}. {Month} {yyyy}',
  'long': '{d}. {Month} {yyyy} {time}',
  'full': '{Weekday}, {d}. {Month} {yyyy} {time}',
  'stamp': '{Dow} {d} {Mon} {yyyy} {time}',
  'time': '{H}:{mm}',
  'past': '{sign} {num} {unit}',
  'future': '{sign} {num} {unit}',
  'duration': '{num} {unit}',
  'timeMarkers': 'um',
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
  'parse': [
    '{months} {year?}',
    '{sign} {num} {unit}',
    '{num} {unit} {sign}',
    '{shift} {unit:5-7}'
  ],
  'timeParse': [
    '{shift?} {day|weekday}',
    '{weekday?},? {date}\\.? {months?}\\.? {year?}'
  ],
  'timeFrontParse': [
    '{shift} {weekday}',
    '{weekday?},? {date}\\.? {months?}\\.? {year?}'
  ]
});
