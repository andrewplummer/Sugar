/*
 * Japanese locale definition.
 * See the readme for customization and more information.
 * To set this locale globally:
 *
 * Sugar.Date.setLocale('ja')
 *
 */
Sugar.Date.addLocale('ja', {
  'firstDayOfWeek': 0,
  'firstDayOfWeekYear': 1,
  'monthSuffix': '月',
  'weekdays': '日:曜日|,月:曜日|,火:曜日|,水:曜日|,木:曜日|,金:曜日|,土:曜日|',
  'units': 'ミリ秒,秒,分,時間,日,週間|週,ヶ月|ヵ月|月,年',
  'short':  '{yyyy}/{MM}/{dd}',
  'medium': '{yyyy}年{M}月{d}日',
  'long':   '{yyyy}年{M}月{d}日{time}',
  'full':   '{yyyy}年{M}月{d}日{time} {weekday}',
  'stamp':  '{yyyy}年{M}月{d}日 {H}:{mm} {dow}',
  'time':   '{tt}{h}時{mm}分',
  'past':   '{num}{unit}{sign}',
  'future': '{num}{unit}{sign}',
  'duration': '{num}{unit}',
  'timeSuffixes': '時,分,秒',
  'ampm': '午前,午後',
  'modifiers': [
    { 'name': 'day', 'src': 'おととい', 'value': -2 },
    { 'name': 'day', 'src': '一昨日', 'value': -2 },
    { 'name': 'day', 'src': '昨日', 'value': -1 },
    { 'name': 'day', 'src': '今日', 'value': 0 },
    { 'name': 'day', 'src': '明日', 'value': 1 },
    { 'name': 'day', 'src': '明後日', 'value': 2 },
    { 'name': 'day', 'src': '明々後日', 'value': 3 },
    { 'name': 'sign', 'src': '前', 'value': -1 },
    { 'name': 'sign', 'src': '後', 'value':  1 },
    { 'name': 'shift', 'src': '去|先', 'value': -1 },
    { 'name': 'shift', 'src': '来', 'value':  1 }
  ],
  'parse': [
    '{num}{unit}{sign}'
  ],
  'timeParse': [
    '{shift}{unit=5-7}{weekday?}',
    '{year}年{month?}月?{date?}日?',
    '{month}月{date?}日?',
    '{date}日'
  ]
});

