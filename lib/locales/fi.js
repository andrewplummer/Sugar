/*
 *
 * Sugar.Date.addLocale(<code>) adds this locale to Sugar.
 * To set the locale globally, simply call:
 *
 * Sugar.Date.setLocale('ja');
 *
 * var locale = Sugar.Date.getLocale(<code>) will return this object, which
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

Sugar.Date.addLocale('fi', {
    'plural':     true,
    'timeMarker': 'klo',
    'ampm':       ',',
    'months':     'tammikuu:|ta,helmikuu,maaliskuu,huhtikuu,toukokuu:|ta,kesäkuu,heinäkuu,elokuu:ta|,syyskuu,lokakuu,marraskuu,joulukuu',
    'weekdays':   'sunnuntai,maanantai:|na,tiistai:|na,keskiviikko,torstai,perjantai,lauantai',
    'units':      'millisekun:ti|tia|teja|tina|nin,sekun:ti|tia|teja|tina|nin,minuut:ti|tia|teja|tina|in,tun:ti|tia|teja|tina|nin,päiv:ä|ää|iä|änä|än,viik:ko|koa|koja|kona|on,kuukau:si|den|tta+kuussa,vuo:si|sia|tta|den|tena',
    'numbers':    'yksi|ensimmäinen,kaksi|toinen,kolm:e|as,neljä:s,vii:si|des,kuu:si|des,seitsemä:n|s,kahdeksa:n|s,yhdeksä:n|s,kymmene:n|s',

    'tokens':     '.',
    'articles':   '',
    'optionals':  '',
    'short':      '{d}. {month} {yyyy}',
    'long':       '{d}. {month} {yyyy} klo {H}.{mm}',
    'full':       '{weekday} {d}. {month} {yyyy} klo {H}.{mm}',
    'relative':       function(num, unit, ms, format) {
      var units = this['units'];
      function numberWithUnit(mult) {
        return num + ' ' + units[(8 * mult) + unit];
      }
      function baseUnit() {
        var mult;
        if (num > 1 && unit > 5) {
          mult = 2;
        } else if (num > 1) {
          mult = 1;
        } else {
          mult = 0;
        }
        return numberWithUnit(mult);
      }
      switch(format) {
        case 'duration':  return baseUnit();
        case 'past':      return baseUnit() + ' sitten';
        case 'future':    return numberWithUnit(4) + ' päästä';
      }
    },
    'modifiers': [
        { 'name': 'day',   'src': 'toissapäi:sta|vänä', 'value': -2 },
        { 'name': 'day',   'src': 'eilen|eilistä', 'value': -1 },
        { 'name': 'day',   'src': 'tänään', 'value': 0 },
        { 'name': 'day',   'src': 'huomenna|huomista', 'value': 1 },
        { 'name': 'day',   'src': 'ylihuomenna|ylihuomista', 'value': 2 },
        { 'name': 'sign',  'src': 'sitten|aiemmin', 'value': -1 },
        { 'name': 'sign',  'src': 'päästä|kuluttua|myöhemmin', 'value': 1 },
        { 'name': 'edge',  'src': 'viime:|inen|viimeisenä', 'value': -2 },
        { 'name': 'edge',  'src': 'lopussa', 'value': -1 },
        { 'name': 'edge',  'src': 'ensimmäinen|ensimmäisenä', 'value': 1 },
        { 'name': 'shift', 'src': 'edellinen|edellisenä|edeltävä|edeltävänä|viime|toissa', 'value': -1 },
        { 'name': 'shift', 'src': 'tänä|tämän', 'value': 0 },
        { 'name': 'shift', 'src': 'seuraava|seuraavana|tuleva|tulevana|ensi', 'value': 1 }
    ],
    'parse': [
      '{shift} {unit=5-7}'
    ],
    'timeParse': [
        '{shift} {weekday}',
        '{num?} {unit} {sign}',
        '{weekday?} {date?} {month} {year?}'
    ]
});
