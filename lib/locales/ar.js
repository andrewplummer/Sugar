/*
 * Arabic locale definition.
 * See the readme for customization and more information.
 * To set this locale globally:
 *
 * Sugar.Date.setLocale('ar')
 *
 */
Sugar.Date.addLocale('ar', {
  'plural': true,
  'units': 'ثانية|ثواني,دقيقة|دقائق,ساعة|ساعات,يوم|أيام,أسبوع|أسابيع,شهر|أشهر,سنة|سنوات',
  'months': 'جانفي,فيفري,مارس,أفريل,ماي,جوان,جويلية,أوت,سبتمبر,أكتوبر,نوفمبر,ديسمبر',
  'weekdays': 'أحد,اثنين,ثلاثاء,أربعاء,خميس,جمعة,سبت',
  'numerals': 'صفر,واحد|ة,اثنان,ثلاثة,أربعة,خمسة,ستة,سبعة,ثمانية,تسعة,عشرة',
  'tokens': "l'|la|le,er",
  'short':  '{yyyy}/{MM}/{dd}',
  'medium': '{yyyy} {month} {d}',
  'long':   '{yyyy} {month} {d} {time}',
  'full':   '{weekday} {d} {month} {yyyy} {time}',
  'stamp':  '{dow} {d} {mon} {yyyy} {time}',
  'time':   '{mm}:{H}',
  'past':   '{sign} {num} {unit}',
  'future': '{sign} {num} {unit}',
  'duration': '{num} {unit}',
  'timeMarkers': 'à',
  'ampm': 'صباحا,مساء',
  'modifiers': [
    { 'name': 'day', 'src': 'أمس', 'value': -1 },
    { 'name': 'day', 'src': "اليوم", 'value': 0 },
    { 'name': 'day', 'src': 'غدا', 'value': 1 },
    { 'name': 'sign', 'src': 'منذ', 'value': -1 },
    { 'name': 'sign', 'src': "في غضون", 'value': 1 },
    { 'name': 'shift', 'src': 'الماضي|ة', 'value': -1 },
    { 'name': 'shift', 'src': 'الآتي|ة', 'value': 1 }
  ],
  'parse': [
    '{months} {year?}',
    '{sign} {num} {unit}',
    '{0?} {unit:5-7} {shift}'
  ],
  'timeParse': [
    '{day|weekday} {shift?}',
    '{weekday?},? {0?} {date}{1?} {months}\\.? {year?}'
  ],
  'timeFrontParse': [
    '{0?} {weekday} {shift}',
    '{weekday?},? {0?} {date}{1?} {months}\\.? {year?}'
  ]
});
