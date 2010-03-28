
var benchmarkMethod = function(obj, method, iterations){
  var start = new Date();
  var args = Array.prototype.slice.call(arguments, 2);
  iterations = iterations || 10000;
  for(var i=0;i<iterations;i++){
    obj[method](args);
  }
  var time = new Date() - start;
  console.info('Time to complete ' + iterations + ' iterations: ' + time + 'ms');
}
