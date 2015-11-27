/*
 * German locale definition.
 * See the readme for customization and more information.
 * To set this locale globally:
 *
 * Sugar.Date.setLocale('de')
 *
 */
Sugar.Date.addLocale('de', {
  'plural':      true,
  'months':     'Jan:uar|,Feb:ruar|,M:är|ärz|ar|arz,Apr:il|,Mai,Juni,Juli,Aug:ust|,Sept:ember|,Okt:ober|,Nov:ember|,Dez:ember|',
  'weekdays':   'So:nntag|,Mo:ntag|,Di:enstag|,Mi:ttwoch|,Do:nnerstag|,Fr:eitag|,Sa:mstag|',
  'units':      'Millisekunde:|n,Sekunde:|n,Minute:|n,Stunde:|n,Tag:|en,Woche:|n,Monat:|en,Jahr:|en|e',
  'numbers':    'null,ein:|e|er|en|em,zwei,drei,vier,fuenf,sechs,sieben,acht,neun,zehn',
  'tokens':     'der',
  'short':      '{dd}.{MM}.{yyyy}',
  'medium':     '{d}. {Month} {yyyy}',
  'long':       '{d}. {Month} {yyyy} {time}',
  'full':       '{Weekday}, {d}. {Month} {yyyy} {time}',
  'stamp':      '{Dow} {d} {Mon} {yyyy} {time}',
  'time':       '{H}:{mm}',
  'past':       '{sign} {num} {unit}',
  'future':     '{sign} {num} {unit}',
  'duration':   '{num} {unit}',
  'timeMarker': 'um',
  'ampm':       'am,pm',
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
    '{sign} {num} {unit}',
    '{num} {unit} {sign}',
    '{shift} {unit=5-7}'
  ],
  'timeParse': [
    '{weekday?} {date?} {month} {year?}',
    '{shift} {weekday}'
  ]
});

