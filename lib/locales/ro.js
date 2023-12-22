/*
 * Romanian locale definition.
 * See the readme for customization and more information.
 * To set this locale globally:
 *
 * Sugar.Date.setLocale('ro')
 *
 */
Sugar.Date.addLocale('ro', {
  'plural': true,
  'units': 'millisecund:ă|e,secund:ă|e,minut:|e,or:ă|e,zi:|le,săptămân:ă|i,lun:ă|i,an:|i',
  'months': 'ian:uarie|,feb:ruarie|,mar:tie|,apr:ilie|,mai,iun:ie|,iul:ie|,aug:ust|,sept:embrie|,oct:obrie|,noi:embrie|,dec:embrie|',
  'weekdays': 'dum:inică|,lun:i|,mar:ți|,mier:curi|,joi|,vin:eri|,sâm:bătă|+sam:bata',
  'numerals': 'zero,un:|a,doi,trei,patru,cinci,șase,șapte,opt,nouă,zece',
  'tokens': "al",
  'short':  '{dd}/{MM}/{yyyy}',
  'medium': '{d} {month} {yyyy}',
  'long':   '{d} {month} {yyyy} {time}',
  'full':   '{weekday} {d} {month} {yyyy} {time}',
  'stamp':  '{dow} {d} {mon} {yyyy} {time}',
  'time':   '{H}:{mm}',
  'past':   '{sign} {num} {unit}',
  'future': '{sign} {num} {unit}',
  'duration': '{num} {unit}',
  'timeMarkers': 'la',
  'ampm': 'am,pm',
  'modifiers': [
    { 'name': 'day', 'src': 'ieri', 'value': -1 },
    { 'name': 'day', 'src': "azi", 'value': 0 },
    { 'name': 'day', 'src': 'mâine', 'value': 1 },
    { 'name': 'day', 'src': 'maine', 'value': 1 },
    { 'name': 'sign', 'src': 'acum', 'value': -1 },
    { 'name': 'sign', 'src': "în", 'value': 1 },
    { 'name': 'shift', 'src': 'ultim:ul|a', 'value': -1 },
    { 'name': 'shift', 'src': 'următ:orul|oarea', 'value': 1 }
  ],
  'parse': [
    '{months} {year?}',
    '{sign} {num} {unit}',
    '{0?} {unit:5-7} {shift}'
  ],
  'timeParse': [
    '{shift?} {day|weekday}',
    '{weekday?},? {0?} {date}{1?} {months}\\.? {year?}'
  ],
  'timeFrontParse': [
    '{0?} {shift} {weekday}',
    '{weekday?},? {0?} {date}{1?} {months}\\.? {year?}'
  ]
});
