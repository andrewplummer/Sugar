/*
 *
 * Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Date.setLocale('fr');
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

Date.addLocale('fr', {
  'plural': true,
  'months': 'janvier,février|fevrier,mars,avril,mai,juin,juillet,août,septembre,octobre,novembre,décembre|decembre',
  'weekdays': 'dimanche,lundi,mardi,mercredi,jeudi,vendredi,samedi',
  'units': 'milliseconde:|s,seconde:|s,minute:|s,heure:|s,jour:|s,semaine:|s,mois,an:|s|née|nee',
  'numbers': 'un:|e,deux,trois,quatre,cinq,six,sept,huit,neuf,dix',
  'tokens': "l'|la|le",
  'short':'{d} {month} {yyyy}',
  'long': '{d} {month} {yyyy} {H}:{mm}',
  'full': '{Weekday} {d} {month} {yyyy} {H}:{mm}:{ss}',
  'past': '{sign} {num} {unit}',
  'future': '{sign} {num} {unit}',
  'duration': '{num} {unit}',
  'timeMarker': 'à',
  'ampm': 'am,pm',
  'modifiers': [
    { 'name': 'day', 'src': 'hier', 'value': -1 },
    { 'name': 'day', 'src': "aujourd'hui", 'value': 0 },
    { 'name': 'day', 'src': 'demain', 'value': 1 },
    { 'name': 'sign', 'src': 'il y a', 'value': -1 },
    { 'name': 'sign', 'src': "dans|d'ici", 'value': 1 },
    { 'name': 'shift', 'src': 'derni:èr|er|ère|ere', 'value': -1 },
    { 'name': 'shift', 'src': 'prochain:|e', 'value': 1 }
  ],
  'dateParse': [
    '{sign} {num} {unit}',
    '{sign} {num} {unit}',
    '{0?} {unit=5-7} {shift}'
  ],
  'timeParse': [
    '{weekday?} {0?} {date?} {month} {year?}',
    '{0?} {weekday} {shift}'
  ]
});

