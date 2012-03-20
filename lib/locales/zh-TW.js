/***
 *
 * Note that this localization is alredy included by default.
 * Simply call Date.setLocale(<code>)
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

Date.setLocale('zh-TW', {
  monthSuffix: '月',
  weekdays: ['日','一','二','三','四','五','六'],
  units: ['毫秒','秒鐘','分鐘','小時','天','個星期|週','個月','年'],
  numbers: ['一','二','三','四','五','六','七','八','九','十'],
  numbersAreDigits: true,
  optionals: ['日|號'],
  outputFormat: '{yyyy}年{M}月{d}日',
  pastFormat: '{num}{unit}{sign}',
  futureFormat: '{num}{unit}{sign}',
  modifiers: [
    { name: 'day', src: '前天', value: -2 },
    { name: 'day', src: '昨天', value: -1 },
    { name: 'day', src: '今天', value: 0 },
    { name: 'day', src: '明天', value: 1 },
    { name: 'day', src: '後天', value: 2 },
    { name: 'sign', src: '前', value: -1 },
    { name: 'sign', src: '後', value: 1 },
    { name: 'shift', src: '上|去', value: -1 },
    { name: 'shift', src: '這', value:  0 },
    { name: 'shift', src: '下|明', value:  1 }
  ],
  formats: [
    '{num}{unit}{sign}',
    '星期{weekday}',
    '{shift}{unit=5-7}',
    '{shift}{unit=5}{weekday}',
    '{year}年{month?}月?{date?}{0}',
    '{month}月{date?}{0}',
    '{date}{0}'
  ]
});

