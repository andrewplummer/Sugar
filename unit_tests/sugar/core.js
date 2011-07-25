


/**
 * Not going to limit this to a window object for now....
test('Window', function () {

  if(window && window.parent) {

    // We're in an iframe here, so...
    var win = window.parent;
    var query = win.location.search.replace(/^\?/, '');

    equal(typeof win.location.params === 'object', true, 'Window params object has been set up');


    if(query && query.match(/=/)) {
      var split = query.split('&');
      split.each(function(e) {
        var s = e.split('=');
        var key   = s[0];
        var value = s[1];
        if(parseInt(value)) {
          value = parseInt(value);
        } else if(value === 'true') {
          value = true;
        } else if(value === 'false') {
          value = false;
        }
        equal(win.location.params[key], value, 'Window params are being properly set');
      });
    }
  }

});
**/

