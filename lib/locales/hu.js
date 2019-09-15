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
  'months': 'jan.|jan:uár|,feb.|feb:ruár|,márc.|márc:ius|,ápr.|ápr:ilis|,máj.|máj:us|,jún.|jún:ius|,júl.|júl:ius|,aug.|aug:usztus|,szept.|szept:ember|,okt.|okt:óber|,nov.|nov:ember|,dec.|dec:ember|',
  'weekdays': 'v.|v|vas.|vas:árnap|,h.|h:étfő|,k.|k:edd|,sze.|sze:rda|,csüt.|csüt:örtök|,p.|p:éntek|,szo.|szo:mbat|',
  'numerals': 'nulla,első|egy:|edik,két|második|másod,három|harmadik,négy|negyedik,öt|ötödik,hat|hatodik,hét|hetedik,nyolc|nyolcadik,kilenc|kilencedik,tíz|tizedik',
  'tokens': 'a(z)',
  'short': '{yyyy}. {MM}. {dd}.',
  'medium': '{yyyy}. {Month} {d}.',
  'long': '{yyyy}. {Month} {d}. {time}',
  'full': '{yyyy}. {Month} {d}. ({Weekday}) {time}',
  'stamp': '{yyyy}. {Month} {d}. ({Dow}) {time}',
  'time': '{H}:{mm}',
  'past': '{sign} {num} {unit}',
  'future': '{sign} {num} {unit}',
  'duration': '{num} {unit}',
  'timeMarkers': 'um',
  'ampm': 'am|a.m.|hajnal|reggel|délelőtt|de.,pm|p.m.|délután|du.|szürkület|alkony|este',
  'modifiers': [
    { 'name': 'day', 'src': 'tegnapelőtt', 'value': -2 },
    { 'name': 'day', 'src': 'tegnap|tegnapi', 'value': -1 },
    { 'name': 'day', 'src': 'ma|mai nap', 'value': 0 },
    { 'name': 'day', 'src': 'holnap|holnapi|holnapi nap', 'value': 1 },
    { 'name': 'day', 'src': 'holnapután', 'value': 2 },
    { 'name': 'sign', 'src': 'előtt:|e|i|ije', 'value': -1 },
    { 'name': 'sign', 'src': 'ban|ben', 'value': 1 },
    { 'name': 'shift', 'src': 'utolsó:|e|i|ja', 'value': -1 },
    { 'name': 'shift', 'src': 'következő|legközelebbi|azutáni', 'value': 1 }
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
