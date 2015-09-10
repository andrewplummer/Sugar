(function($) {

  $(document).ready(function() {
    createHTML();
    Sugar.extend();
    runTests(testsFinished, true, 'browser');
  });

})(jQuery);
