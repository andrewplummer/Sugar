

// Don't need this for our purposes
module = function(){};
equals = equal;
ok = function(actual, message) {
  equal(actual, true, message);
}


var CompatibleMethods = [
  {
    module: Array.prototype,
    methods: [
      'first',
      'last',
      'compact'
    ]
  }
];

var mapMethods = function() {
  var proto;
  CompatibleMethods.forEach(function(cm) {
    cm.methods.forEach(function(m) {
      _[m] = function(obj){
        return cm.module[m].apply(obj, Array.prototype.slice.call(arguments, 1));
      }
    });
  });
}

mapMethods();
