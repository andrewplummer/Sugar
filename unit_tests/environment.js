
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


  function getScript(path, callback){
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = path;
    script.onload = callback;
    head.appendChild(script);
  }

  function initialize(modules){

    startTests = function(){
      QUnit.init();
      var loaded = 0;
      for(var i = 0; i < modules.length; i++){
        var m = modules[i];
        module(m.name);
        for(var j = 0; j < m.tests.length; j++){
          var src = m.tests[j];
          getScript(src, function(){
            loaded++;
            if(loaded == m.tests.length){
              QUnit.start();
            }
          });
        }
      }
    }
  }

  registerEnvironment = function(name, modules){
    initialize(modules);
    if(window.parent && window != window.parent && window.parent.registerEnvironment){
      environment = arguments[0];
      window.parent.registerEnvironment.apply(this, arguments);
    }
  }

})();

