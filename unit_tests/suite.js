
(function($) {

  modulesFinishedCallback = function(environment, results) {
    var totalTests = 0;
    var totalAssertions = 0;
    var totalFailed = 0;
    var env = $('#' + environment);
    results.each(function(module) {
      var mod = $('<ul class="module" />');
      module.results.each(function(r) {
        totalTests++;
        totalAssertions += r.assertions;
        totalFailed += r.failures.length;
        var li = $('<li class="test" />');
        var title = '<h5>' + r.name + '</h5>';
        if(r.failures.length > 0) {
          r.failures.each(function(f) {
            title += getFailureHTML(f);
          });
          li.addClass('fail');
          li.text('F');
          title += '<p class="fail">Fail (' + r.assertions + ' assertions)</p>';
        } else {
          li.text('.');
          li.addClass('pass');
          title += '<p class="pass">Pass (' + r.assertions + ' assertions)</p>';
        }

        li.attr('title', '#tip_' + totalTests);
        $(document.body).append('<div class="hidden" id="tip_' + totalTests + '">' + title + '</div>');
        mod.append(li);
      });
      $('.tests', env).append(mod);
    });

    var stats = $('.stats', env);
    stats.append($('<span class="failures">' + totalFailed + ' ' + (totalFailed == 1 ? 'failure' : 'failures') + '</span>'));
    stats.append($('<span class="tests">' + totalTests + ' ' + (totalTests == 1 ? 'test' : 'tests') + '</span>'));
    stats.append($('<span class="assertions">' + totalAssertions + ' ' + (totalAssertions == 1 ? 'assertion' : 'assertions') + '</span>'));
    //stats.append($('<span class="runtime">Completed in ' + runtime / 1000 + ' seconds</span>'));
    env.addClass('finished');
    if(totalFailed != 0){
      env.addClass('fail');
    }
    $('[title]', env).tooltip({ color: 'black' });
  }

  var getFailureHTML = function(f) {
    return '<p class="fail">' + f.message + ', expected: ' + f.expected + ' actual: ' + f.actual + '</p>';
  };

})(jQuery);

/*
(function($){

  var suite = $('#suite');
  var module;
  var test;
  var failedAssertions;
  var warnings;
  var totalWarnings = 0;
  var totalAssertions;
  var time;

  var events = {
    log: function(result, message, environment){
      if(!result && /warning/i.test(message)) {
        failedAssertions += '<p class="warning">'+message.replace(/(&nbsp;)+/g, ' ') +'</p>';
        warnings++;
      } else if(!result) {
        failedAssertions += '<p class="fail">'+message.replace(/(&nbsp;)+/g, ' ').replace(/</g, '&lt;').replace(/>/, '&gt;') +'</p>';
      } else {
        totalAssertions++;
      }
    },

    testStart: function(){
      test = $('<ul class="test"/>');
      failedAssertions = '';
      warnings = 0;
      totalAssertions = 1;
    },

    testDone: function(name, failures, total, environment){
      if(!module) return;
      var text,css;
      var title = '<h5>' + name + '</h5>';
      if(failures == 0){
        text = '.';
        css = 'pass';
        title += '<p class="pass">Pass ('+totalAssertions+' assertions)</p>';
      } else if (failures == warnings) {
        text = '.';
        css = 'warning';
        title += failedAssertions;
        totalWarnings += warnings;
      } else {
        text = 'F';
        css = 'fail';
        title += failedAssertions;
      }

      $('ul', module).append($('<li class="test '+css+'"></li>').attr('title', title).append(text));
    },

    moduleStart: function(name, environment){
      if(!time) time = new Date();
      var tests = $('<ul/>').addClass(name);
      var header = $('<h4/>').text(name);
      module = $('<div class="module"/>').append(tests);
    },

    moduleDone: function(name, failures, total, environment){
      if(!module) return;
      $('#'+underscore(environment)+' .tests').append(module);
      module = null;
    },

    done: function(failures, total, environment){
      var now = new Date();
      var runtime = new Date() - time;
      time = null;
      var stats = $('#'+underscore(environment)+' .stats');
      failures -= totalWarnings;
      stats.append($('<span class="failures">' + failures + ' ' + (failures == 1 ? 'failure' : 'failures') + '</span>'));
      stats.append($('<span class="assertions">' + total + ' ' + (total == 1 ? 'assertion' : 'assertions') + '</span>'));
      stats.append($('<span class="runtime">Completed in ' + runtime / 1000 + ' seconds</span>'));
      $('#'+underscore(environment)).addClass('finished');
      if(failures != 0){
        $('#'+underscore(environment)).addClass('fail');
      }
      $(document).trigger('tests_finished', [environment]);
    }

  };

  for(var e in events){
    (function(){
      var key = e;
      $(document).bind(e, function(event, args){
        events[key].apply(this, args);
      });
    })();
  }

  registerEnvironment = function(name, subheader){
    environment = $('#'+name);
  }

  function underscore(s){
    return s.replace(/[ \.]/g, '_');
  }

})(jQuery);
*/
