
/*
 * TimezoneJS Shim for Sugar
 *
 * This shim creates a class DateWithTimezone that extends timezoneJS.Date
 * and mixes in Sugar methods to allow Sugar's internal constructor to use
 * a timezoneJS object instead of a native date. This means that Sugar's
 * Date.create, internal comparison methods etc will all use timezoneJS
 * objects instead.
 *
 * Note that the better way to do this would be to subclass the native Date
 * class itself, however Javascript does not allow this.
 *
 *
 *
 * Usage with Sugar (example):
 *
 * Date.SugarNewDate = function () {
 *   return new DateWithTimezone('America/New_York');
 * }
 *
 * Also note that Olson timezone files etc need to all be loaded before using!
 *
 */
(function() {

  function DateWithTimezone () {
    timezoneJS.Date.apply(this, arguments);
  };

  function mixInSugar(target) {
    var key, m, methods = Date.SugarMethods;
    for (key in methods) {
      if(!methods.hasOwnProperty(key)) continue;
      m = methods[key];
      if(m.instance && !target[key]) {
        target[key] = m.method;
      }
    };
  }

  DateWithTimezone.prototype = new timezoneJS.Date();
  mixInSugar(DateWithTimezone.prototype);

  this.DateWithTimezone = DateWithTimezone;

})();
