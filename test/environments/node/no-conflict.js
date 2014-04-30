package('No Conflict', function() {

  process.env.SUGAR_NO_CONFLICT = 'true';

  var Sugar = require( '../../../release/sugar-full.dev');
  equal(global['Sugar'], undefined, 'Sugar should not exist in the global namespace');

  Sugar.extend(Date, {
    foobar: function() {
      return 'foobar!';
    }
  });

  equal(Sugar.Date.foobar(), 'foobar!', 'Method should be mapped to the required object');
  equal(new Date().foobar, undefined, 'Method should not be mapped to native prototype');

  delete process.env.SUGAR_NO_CONFLICT;

});

