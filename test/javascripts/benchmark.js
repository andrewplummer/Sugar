
var benchmarkMethod = function(obj, method, iterations){
  var start = new Date();
  var args = Array.prototype.slice.call(arguments, 3);
  iterations = iterations || 10000;
  for(var i=0;i<iterations;i++){
    obj[method].apply(obj, args);
  }
  var time = new Date() - start;
  console.info('Time to complete ' + iterations + ' iterations: ' + time + 'ms');
  return time;
}

var averageTimeToRun = function(){
  var sum = 0;
  for(var i=0; i<50; i++){
    sum += benchmarkMethod.apply(this, arguments);
  }
  return Math.round(sum / 50);
}
