
var environment;
var startTests;

(function(){

  forwardCallback('begin');
  forwardCallback('log');
  forwardCallback('testStart');
  forwardCallback('testDone');
  forwardCallback('moduleStart');
  forwardCallback('moduleDone');
  forwardCallback('done');

  function forwardCallback(name){
    QUnit[name] = function(){
      var args = [];
      for(var i=0;i<arguments.length;i++){ if(typeof arguments[i] != 'undefined') args.push(arguments[i]); }
      args.push(environment);
      window.parent.$(window.parent.document).trigger(name, [args]);
    }
  }


  function initialize(modules){

    startTests = function(){
      QUnit.init();
      var loaded = 0;
      var methods = [];
      for(var i = 0; i < modules.length; i++){
        var m = modules[i];
        module(m.name);
        for(var j = 0; j < m.tests.length; j++){
          var src = m.tests[j];
          methods.push(src);
          jQuery.getScript(src, function(){
            loaded++;
            if(loaded == methods.length){
              QUnit.start();
            }
          });
        }
      }
    }
  }

  registerEnvironment = function(name, modules){
    if(window.parent && window != window.parent && window.parent.registerEnvironment){
      environment = arguments[0];
      window.parent.registerEnvironment.apply(this, arguments);
    }
    initialize(modules);
  }

})();

