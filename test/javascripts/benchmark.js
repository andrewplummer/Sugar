
var benchmarkMethod = function(obj, method){
  var start = new Date();
  for(var i=0;i<10000;i++){
    obj[method]();
  }
  var time = new Date() - start;
  console.info('Time to complete 10,000 iterations: ' + time + 'ms');
}
