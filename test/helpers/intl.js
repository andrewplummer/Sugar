(function() {

  const INTL_SUPPORT = checkFullIntlSupport();

  function checkFullIntlSupport() {
    try {
      var f = new Intl.NumberFormat('de-DE');
      return f.format(0.1) === '0,1';
    } catch (e) {
      return false;
    }
  }

  withNumberFormatter = function(locale, fn) {
    if (!INTL_SUPPORT) {
      return;
    }
    var formatter = new Intl.NumberFormat(locale);
    fn(formatter);
  };

})();
