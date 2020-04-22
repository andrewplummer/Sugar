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
  'units': 'ezredmásodperc,másodperc,perc,óra,nap,hét,hónap,év',
  'months': 'jan:uár|,feb:ruár|,márc:ius|,ápr:ilis|,máj:us|,jún:ius|,júl:ius|,aug:usztus|,szept:ember|,okt:óber|,nov:ember|,dec:ember|',
  'weekdays': 'v:as:árnap:on|,h:étfő:n|,k:edd:en|,sze:rd:|a|án|,csüt:örtök:ön|,p:éntek:en|,szo:mbat:on|',
  'numerals': '0|nulla,1|első|egy:|edik,2|két:tő|másod:ik,3|három|harmadik,4|négy|negyedik,5|öt:ödik,6|hat:odik,7|hét|hetedik,8|nyolc:adik,9|kilenc:edik,10|tíz|tizedik',
  'tokens': 'a:z',
  'short': '{yyyy}. {MM}. {dd}.',
  'medium': '{yyyy}. {Month} {d}.',
  'long': '{yyyy}. {Month} {d}. {time}',
  'full': '{yyyy}. {Month} {d}. ({Weekday}) {time}',
  'stamp': '{yyyy}. {Month} {d}. ({Dow}) {time}',
  'time': '{H}:{mm}',
  'past': '{sign} {num} {unit}',
  'future': '{sign} {num} {unit}',
  'duration': '{num} {unit}',
  'timeMarkers': 'által',
  'ampm': 'am|a.m.|hajnal|reggel|délelőtt|de.,pm|p.m.|délután|du.|szürkület|alkony|este',
  'modifiers': [
    { 'name': 'day', 'src': 'tegnapelőtt', 'value': -2 },
    { 'name': 'day', 'src': 'tegnap:i', 'value': -1 },
    { 'name': 'day', 'src': 'ma:i nap', 'value': 0 },
    { 'name': 'day', 'src': 'holnap:i: nap', 'value': 1 },
    { 'name': 'day', 'src': 'holnapután', 'value': 2 },
    { 'name': 'sign', 'src': 'előtt:|e|i|ije', 'value': -1 },
    { 'name': 'sign', 'src': 'ban|ben', 'value': 1 },
    { 'name': 'shift', 'src': 'utolsó:|e|i|ja', 'value': -1 },
    { 'name': 'shift', 'src': 'következő|legközelebbi|azutáni', 'value': 1 }
  ],
  'parse': [
    '{year?}\\.? {months}',
    '{sign} {num}\\.? {unit}',
    '{num}\\.? {unit} {sign}',
    '{shift} {unit:5-7}'
  ],
  'timeParse': [
    '{day|weekday} {shift?}',
    '{year?}\\.? {months?} {date}\\.? \\(?{weekday?}\\)?'
  ],
  'timeFrontParse': [
    '{weekday} {shift}',
    '{year?}\\.? {months?} {date}\\.? {weekday?}? '
  ]
});
