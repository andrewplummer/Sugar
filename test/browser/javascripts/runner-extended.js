(function($) {

  $(document).ready(function() {
    Sugar.extend({
      objectPrototype: true
    });
    runTests(testsFinished, 'extended', 'browser');
  });

})(jQuery);
