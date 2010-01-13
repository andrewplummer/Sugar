
(function(){

  var environment;

  forwardCallback('log');
  forwardCallback('testStart');
  forwardCallback('testDone');
  forwardCallback('moduleStart');
  forwardCallback('moduleDone');
  forwardCallback('done');

  function forwardCallback(name){
    if(!window.parent || !window.parent.QUnit || !window.parent.QUnit[name]) return;
    QUnit[name] = function(){
      var args = [];
      for(var i=0;i<arguments.length;i++){ if(typeof arguments[i] != 'undefined') args.push(arguments[i]); }
      args.push(environment);
      window.parent.QUnit[name].apply(this, args);
    }
  }

  registerEnvironment = function(name){
    if(window.parent && window.parent.registerEnvironment){
      environment = name;
      window.parent.registerEnvironment(name);
    }
  }

})();
