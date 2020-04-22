/*
 * Indonesian locale definition.
 * See the readme for customization and more information.
 * To set this locale globally:
 *
 * Sugar.Date.setLocale('id')
 *
 */
Sugar.Date.addLocale('id', {
  'code': 'id',
  'plural': false,
  'timeMarkers' : 'jam',
  'units'       : 'mili detik,detik,menit,jam,hari,minggu,bulan,tahun',
  'months'      : 'Jan:uari|,Feb:ruari|,Mar:et|,Apr:il|,Mei,Jun:i|,Jul:i|,Agu:stus|,Sep:tember|,Okt:ober|,Nov:ember|,Des:ember|',
  'weekdays'    : 'Min:ggu|,Sen:in|,Sel:asa|,Rab:u|,Kam:is|,Jum:at|,Sab:tu|+weekend',
  'numerals'    : 'nol,satu,dua,tiga,empat,lima,enam,tujuh,delapan,sembilan,sepuluh',
  'time'        : '{H}:{mm}',
  'past'        : '{num} {unit} {sign}',
  'future'      : '{num} {unit} {sign}',
  'duration'    : '{num} {unit}',
  'modifiers': [
    { 'name': 'half',   'src': 'setengah', 'value': .5 },
    { 'name': 'midday', 'src': 'siang', 'value': 12 },
    { 'name': 'midday', 'src': 'tengah malam', 'value': 24 },
    { 'name': 'day',    'src': 'kemarin', 'value': -1 },
    { 'name': 'day',    'src': 'hari ini|malam ini', 'value': 0 },
    { 'name': 'day',    'src': 'besok', 'value': 1 },
    { 'name': 'sign',   'src': 'lalu|sebelum', 'value': -1 },
    { 'name': 'sign',   'src': 'lagi', 'value': 1 },
    { 'name': 'edge',   'src': 'awal hari|awal', 'value': -2 },
    { 'name': 'edge',   'src': 'akhir hari', 'value': 1 },
    { 'name': 'shift',  'src': 'terakhir', 'value': -1 },
    { 'name': 'shift',  'src': 'berikut:|nya', 'value': 1 }
  ],
  'parse': [
    'sekarang (?:ini)?', //ex: 'sekarang' 'sekarang ini'
    '{unit:5-7} {shift}', //ex: 'bulan terakhir'
    "{months?} (?:{year}|'{yy})", //ex: 'juli 2017' 'juli 17'
    '{4?} {day|weekday} {midday} ', //ex: 'hari minggu siang'
    '{months},?(?:[-.\\/\\s]{year})?', //ex: 'juli,2017' 'juli-2017' 'juli.2017' 'juli 2017'
    '{edge} dari (?:day)? {day|weekday}', //ex: 'awal hari dari senin' 'awal dari senin'
    '{0} {num}{1?} {weekday} {2} {months},? {year?}', // ??
    '{midday} (?:pada)? {day?} {weekday?} {shift?}', //ex: 'siang pada senin terakhir'
    '{sign?} {3?} {half} {3?} {unit:3-4|unit:7} {sign?}', // ??
    '{0?} {edge} {weekday?} {2} {unit:4-7?} {shift?} {months?},? {year?}' //??
  ],
  'timeParse': [
    '{day|weekday}',
    '{unit:5?} {weekday} {shift}',
    '{0?} {date}{1?} {2?} {months?}',
    '{weekday} {2?} {unit:5} {shift}',
    '{0?} {num} {2?} {months}\\.?,? {year?}',
    '{num?} {unit:4-5} {sign} {day|weekday}',
    '{year}[-.\\/\\s]{months}[-.\\/\\s]{date}',
    '{0|months} {date?}{1?} dari {unit:6-7} {shift}',
    '{0?} {num}{1?} {weekday} dari {unit:6} {shift}',
    "{date}[-.\\/\\s]{months}[-.\\/\\s](?:{year}|'?{yy})",
    "{weekday?}\\.?,? {months}\\.?,? {date}{1?},? (?:{year}|'{yy})?"
  ],
  'timeFrontParse': [
    '{sign} {num} {unit}',
    '{num} {unit} {sign}',
    '{4?} {day|weekday}'
  ]
};
