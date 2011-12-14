(function($) {

  $(document).bind('suite.finished', function(event, environment, results) {
    var totalTests = 0;
    var totalAssertions = 0;
    var totalFailed = 0;
    var env = $('#' + environment);
    results.forEach(function(module) {
      var mod = $('<ul class="module" />');
      module.results.forEach(function(r) {
        totalTests++;
        totalAssertions += r.assertions;
        totalFailed += r.failures.length;
        var li = $('<li class="test" />');
        var title = '<h5>' + r.name + '</h5>';
        if(r.failures.length > 0) {
          r.failures.forEach(function(f) {
            title += getFailureHTML(f);
            if(f.warning) {
              totalFailed--;
            }

          });
          var warning = r.failures.every(function(f){ return f.warning; });
          if(warning) {
            li.addClass('warning');
            li.text('.');
          } else {
            li.addClass('fail');
            li.text('F');
            title += '<p class="fail">Fail (' + r.assertions + ' assertions)</p>';
          }
        } else {
          li.text('.');
          li.addClass('pass');
          title += '<p class="pass">Pass (' + r.assertions + ' assertions)</p>';
        }

        li.attr('title', '#'+ environment +'_tip_' + totalTests);
        $(document.body).append('<div class="hidden" id="'+ environment +'_tip_' + totalTests + '">' + title + '</div>');
        mod.append(li);
      });
      $('.tests', env).append(mod);
    });

    var stats = $('.stats', env);
    stats.append($('<span class="failures">' + totalFailed + ' ' + (totalFailed == 1 ? 'failure' : 'failures') + '</span>'));
    stats.append($('<span class="tests">' + totalTests + ' ' + (totalTests == 1 ? 'test' : 'tests') + '</span>'));
    stats.append($('<span class="assertions">' + totalAssertions + ' ' + (totalAssertions == 1 ? 'assertion' : 'assertions') + '</span>'));
    stats.append($('<span class="runtime">Completed in ' + results[0].time / 1000 + ' seconds</span>'));
    env.addClass('finished');
    if(totalFailed != 0){
      env.addClass('fail');
    }
    $('[title]', env).tooltip({ color: 'black' });
    $(document).trigger('tests_finished', [environment]);
  });


  $(document).bind('suite.started', function(event, environment, modules) {
    var tests = $('<div id="tests"/>').appendTo(document.body);
    $('<h3>' + $('title').text() + '</h3>').appendTo(tests);
    var test = $('<div id="'+ environment +'"/ class="environment">').appendTo(tests);
    $('<div class="loading">Running tests.</div>').appendTo(test);
    $('<div class="tests"/>').appendTo(test);
    $('<p><span class="stats"></p>').appendTo(test);
  });

  $(document).ready(function() {
    startTests();
  });

  var getFailureHTML = function(f) {
    var expected, actual;
    if(f.warning) {
      return '<p class="warning">Warning: ' + f.message + '</p>';
    } else {
      expected = getStringified(f.expected);
      actual = getStringified(f.actual);
      return '<p class="fail">' + f.message + ', expected: ' + expected + ' actual: ' + actual + '</p>';
    }
  };

  var getStringified = function(p) {
    if(p && p.length > 5000) return 'One BIG ass array of length ' + p.length;
    if(typeof p === 'function') return 'function';
    if(typeof JSON !== 'undefined' && JSON.stringify) return JSON.stringify(p);
    if(typeof p !== 'object') return String(p);
    var isArray = p.join;
    var str = isArray ? '[' : '{';
    var arr;
      arr = [];
      for(var key in p){
        if(!p.hasOwnProperty(key)) continue;
        if(p[key] === undefined) {
          arr.push('undefined');
        } else {
          arr.push(p[key]);
        }
      }
    str += arr.join(',');
    str += isArray ? ']' : '}';
    return str;
  };

})(jQuery);
