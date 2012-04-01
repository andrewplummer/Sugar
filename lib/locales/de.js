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

Date.setLocale('de', {
  hasPlural: true,
  capitalizeUnit: true,
  futureRelativeFormat: 1,
  months: ['Januar','Februar','März|Marz','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
  weekdays: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
  units: ['Millisekunde:|n','Sekunde:|n','Minute:|n','Stunde:|n','Tag:|en','Woche:|n','Monat:|en','Jahr:|en'],
  numbers: ['ein:|e|er|en|em','zwei','drei','vier','fuenf','sechs','sieben','acht','neun','zehn'],
  optionals: ['der'],
  outputFormat: '{d}. {Month} {yyyy}',
  pastFormat: '{sign} {num} {unit}',
  futureFormat: '{sign} {num} {unit}',
  modifiers: [
    { name: 'day', src: 'vorgestern', value: -2 },
    { name: 'day', src: 'gestern', value: -1 },
    { name: 'day', src: 'heute', value: 0 },
    { name: 'day', src: 'morgen', value: 1 },
    { name: 'day', src: 'übermorgen|ubermorgen|uebermorgen', value: 2 },
    { name: 'sign', src: 'vor', value: -1 },
    { name: 'sign', src: 'in', value: 1 },
    { name: 'shift', src: 'letzte:|r|n|s', value: -1 },
    { name: 'shift', src: 'nächste:|r|n|s+nachste:|r|n|s+naechste:|r|n|s', value: 1 }
  ],
  formats: [
    '{sign} {num} {unit}',
    '{num} {unit} {sign}',
    '{weekday?} {date?} {month} {year?}',
    '{shift} {unit=5-7}'
  ]
});

