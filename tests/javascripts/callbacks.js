
(function(){

  var suite = $('#suite');
  var module;
  var test;
  var assertions;
  var time;

  QUnit = {
    log: function(result, message, environment){
      if(!result){
        assertions += '<p class="fail">'+message+'</p>';
      }
    },

    testStart: function(){
      test = $('<ul class="test"/>');
      assertions = '';
    },

    testDone: function(name, failures, total, environment){
      var text,css;
      var title = '<h4>' + name + '</h4>';
      if(failures == 0){
        text = '.';
        css = 'pass';
        title += '<p class="pass">Pass</p>';
      } else {
        text = 'F';
        css = 'fail';
        title += assertions;
      }

      module.append($('<li class="test '+css+'"></li>').attr('title', title).append(text));
    },

    moduleStart: function(name, environment){
      if(!time) time = new Date();
      module = $('<ul/>').addClass('module').addClass(name);
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

function equalWithExceptions(){
console.info('hmmmkay');
alert("HUI???");
}
