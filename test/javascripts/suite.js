
(function(){

  var suite = $('#suite');
  var module;
  var test;
  var failedAssertions;
  var totalAssertions;
  var time;

  QUnit = {
    log: function(result, message, environment){
      if(!result){
        failedAssertions += '<p class="fail">'+message.replace(/(&nbsp;)+/g, ' ') +'</p>';
      } else {
        totalAssertions++;
      }
    },

    testStart: function(){
      test = $('<ul class="test"/>');
      failedAssertions = '';
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
      module = $('<div class="module"/>').append(header).append(tests);
    },

    moduleDone: function(name, failures, total, environment){
      if(!module) return;
      $('#'+underscore(environment)).append(module);
      module = null;
    },

    done: function(failures, total, environment){
      var now = new Date();
      var runtime = new Date() - time;
      time = null;
      var stats = $('<p class="stats"/>');
      var fail
      stats.append($('<span class="failures">' + failures + ' ' + (failures == 1 ? 'failure' : 'failures') + '</span>'));
      stats.append($('<span class="assertions">' + total + ' ' + (total == 1 ? 'assertion' : 'assertions') + '</span>'));
      stats.append($('<span class="runtime">Completed in ' + runtime / 1000 + ' seconds</span>'));
      $('#'+underscore(environment)).append(stats);
      if(failures != 0){
        $('#'+underscore(environment)).addClass('fail');
      }
    }

  }

  registerEnvironment = function(name, subheader){
    environment = $('<li/>').addClass('environment');
    environment.attr('id', underscore(name));
    environment.append('<h3>'+name+'</h3>');
    if(subheader){
      $('h3', environment).append('<span class="subheader">('+subheader+')</span>');
    }
    $('#suite .environments').append(environment);
    if(window['sugarOverride']){
      // Each environment reports whether or not sugar is overriding functions,
      // so check it here and set to true if it is.
      $('#sugar_override').show();
    }
  }

  function underscore(s){
    return s.replace(/[ \.]/g, '_');
  }

})();
