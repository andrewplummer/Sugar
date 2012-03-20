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

Date.setLocale('en', {
  hasPlural: true,
  months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  units: ['millisecond:|s','second:|s','minute:|s','hour:|s','day:|s','week:|s','month:|s','year:|s'],
  numbers: ['one','two','three','four','five','six','seven','eight','nine','ten'],
  optionals: ['the','st|nd|rd|th','of'],
  outputFormat: '{Month} {d}, {yyyy}',
  pastFormat: '{num} {unit} {sign}',
  futureFormat: '{num} {unit} {sign}',
  modifiers: [
    { name: 'day', src: 'yesterday', value: -1 },
    { name: 'day', src: 'today', value: 0 },
    { name: 'day', src: 'tomorrow', value: 1 },
    { name: 'sign', src: 'ago|before', value: -1 },
    { name: 'sign', src: 'from now|after|from', value: 1 },
    { name: 'edge', src: 'last day', value: -2 },
    { name: 'edge', src: 'end', value: -1 },
    { name: 'edge', src: 'first day|beginning', value: 1 },
    { name: 'shift', src: 'last', value: -1 },
    { name: 'shift', src: 'the|this', value: 0 },
    { name: 'shift', src: 'next', value: 1 }
  ],
  articles: ['a','an','the'],
  formats: [
    '{num} {unit} {sign}',
    '{num} {unit4} {sign} {day}',
    '{weekday?} {month} {date}{1} {year?} {time?}',
    '{date} {month} {year}',
    '{month} {year}',
    '{shift?} {weekday} {time?}',
    '{shift} week {weekday} {time?}',
    '{shift} {unit=5-7}',
    '{0} {edge} of {shift?} {unit=4-7?}{month?}{year?}',
    '{weekday} {2} {shift} week',
    '{0} {date}{1} of {month}',
    '{0}{month?} {date?}{1} of {shift} {unit=6-7}',
    '{day} at {time?}',
    '{time} {day}'
  ]
});

