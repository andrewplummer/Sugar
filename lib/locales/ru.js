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

Date.setLocale('ru', {
  futureRelativeFormat: 1,
  months: ['Январ:я|ь','Феврал:я|ь','Март:а|','Апрел:я|ь','Ма:я|й','Июн:я|ь','Июл:я|ь','Август:а|','Сентябр:я|ь','Октябр:я|ь','Ноябр:я|ь','Декабр:я|ь'],
  weekdays: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
  units: ['миллисекунд:а|у|ы|','секунд:а|у|ы|','минут:а|у|ы|','час:||а|ов','день|день|дня|дней','недел:я|ю|и|ь|е','месяц:||а|ев|е','год|год|года|лет|году'],
  numbers: ['од:ин|ну','дв:а|е','три','четыре','пять','шесть','семь','восемь','девять','десять'],
  optionals: ['в|на','года'],
  outputFormat: '{d} {month} {yyyy} года',
  pastFormat: '{num} {unit} {sign}',
  futureFormat: '{sign} {num} {unit}',
  modifiers: [
    { name: 'day', src: 'позавчера', value: -2 },
    { name: 'day', src: 'вчера', value: -1 },
    { name: 'day', src: 'сегодня', value: 0 },
    { name: 'day', src: 'завтра', value: 1 },
    { name: 'day', src: 'послезавтра', value: 2 },
    { name: 'sign', src: 'назад', value: -1 },
    { name: 'sign', src: 'через', value: 1 },
    { name: 'shift', src: 'прошло:й|м', value: -1 },
    { name: 'shift', src: 'следующе:й|м', value: 1 }
  ],
  formats: [
    '{num} {unit} {sign}',
    '{sign} {num} {unit}',
    '{date} {month} {year?} {1}',
    '{month} {year}',
    '{0} {shift} {unit=5-7}'
  ]
});

