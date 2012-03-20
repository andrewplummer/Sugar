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

Date.setLocale('es', {
  hasPlural: true,
  futureRelativeFormat: 1,
  months: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
  weekdays: ['domingo','lunes','martes','miércoles|miercoles','jueves','viernes','sábado|sabado'],
  units: ['milisegundo:|s','segundo:|s','minuto:|s','hora:|s','día|días|dia|dias','semana:|s','mes:|es','año|años|ano|anos'],
  numbers: ['uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez'],
  optionals: ['el','de'],
  outputFormat: '{d} de {month} de {yyyy}',
  pastFormat: '{sign} {num} {unit}',
  futureFormat: '{num} {unit} {sign}',
  modifiers: [
    { name: 'day', src: 'anteayer', value: -2 },
    { name: 'day', src: 'ayer', value: -1 },
    { name: 'day', src: 'hoy', value: 0 },
    { name: 'day', src: 'mañana|manana', value: 1 },
    { name: 'sign', src: 'hace', value: -1 },
    { name: 'sign', src: 'de ahora', value: 1 },
    { name: 'shift', src: 'pasad:o|a', value: -1 },
    { name: 'shift', src: 'próximo|próxima|proximo|proxima', value: 1 }
  ],
  formats: [
    '{sign} {num} {unit}',
    '{num} {unit} {sign}',
    '{date?} {1} {month} {1} {year?}',
    '{0} {unit=5-7} {shift}',
    '{0} {shift} {unit=5-7}'
  ]
});
