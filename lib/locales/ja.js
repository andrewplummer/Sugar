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
 * {0} is a reference to an entry in locale.tokens. Output: (?:the)?
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
  'weekdays': '日曜日|日曜,月曜日|月曜,火曜日|火曜,水曜日|水曜,木曜日|木曜,金曜日|金曜,土曜日|土曜',
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
    { 'name': 'day', 'src': '一昨昨昨日|前前前前日', 'value': -4 },
    { 'name': 'day', 'src': '一昨昨日|前前前日', 'value': -3 },
    { 'name': 'day', 'src': '一昨日|前前日', 'value': -2 },
    { 'name': 'day', 'src': '昨日|前日', 'value': -1 },
    { 'name': 'day', 'src': '今日|当日', 'value': 0 },
    { 'name': 'day', 'src': '明日|翌日', 'value': 1 },
    { 'name': 'day', 'src': '明後日|翌翌日', 'value': 2 },
    { 'name': 'day', 'src': '明明後日|翌翌翌日', 'value': 3 },
    { 'name': 'day', 'src': '明明明後日|翌翌翌翌日', 'value': 4 },
    { 'name': 'sign', 'src': '前', 'value': -1 },
    { 'name': 'sign', 'src': '後', 'value': 1 },
    { 'name': 'edge', 'src': '始|初日|頭', 'value': 1 },
    { 'name': 'edge', 'src': '末|末日|尻', 'value': -2 },
    { 'name': 'shift', 'src': '一昨昨昨|先先先先|前前前前', 'value': -4 },
    { 'name': 'shift', 'src': '一昨昨|先先先|前前前', 'value': -3 },
    { 'name': 'shift', 'src': '一昨|先先|前前', 'value': -2 },
    { 'name': 'shift', 'src': '去|先|前', 'value': -1 },
    { 'name': 'shift', 'src': '本|今|当', 'value': 0 },
    { 'name': 'shift', 'src': '来|次|翌|明', 'value': 1 },
    { 'name': 'shift', 'src': '再来|次次|翌翌|明後', 'value': 2 },
    { 'name': 'shift', 'src': '再再来|次次次|翌翌翌', 'value': 3 }
  ],
  'dateParse': [
    '{num}{unit}{sign}'
  ],
  'timeParse': [
    '{shift}{unit=5-7}{weekday?}',
    '{year}年{month?}月?{date?}日?',
    '{month}月{date?}日?',
    '{date}日',
    '{month}月{edge}',
    '{shift?}{unit}{edge}',
    '{shift}{unit=7}{month?}月?{date?}日?',
    '{shift}{unit=7}{month?}月?{weekday?}',
    '{shift}{unit=7}{shift}{unit=6}{date?}日{edge?}',
    '{shift}{unit=7}{shift}{unit=6}{weekday?}{edge?}',
    '{shift}{unit=6}{date?}日?',
    '{shift}{unit=5}{weekday}{ampm?}{H}時{mm?}分?'
  ]
});
