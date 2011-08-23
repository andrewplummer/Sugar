

// Don't need this for our purposes
module = function(){};
equals = equal;
ok = function(actual, message) {
  equal(actual, true, message);
}

var ensureArray = function(obj) {
  return Object.isArray(obj) ? obj : Array.prototype.slice.call(obj);
}

var CompatibleMethods = [
  {
    module: Array.prototype,
    methods: [
      {
        name: 'first',
        method: function(arr, n){
          return ensureArray(arr).first(n);
        }
      },
      {
        name: 'last',
        method: function(arr, n){
          return ensureArray(arr).last(n);
        }
      },
      {
        name: 'rest',
        method: function(arr, n){
          if(n === undefined) n = 1;
          return ensureArray(arr).from(n);
        }
      },
      {
        name: 'compact',
        method: function(arr){
          return ensureArray(arr).compact(true);
        }
      },
      {
        name: 'flatten',
        method: function(arr){
          return ensureArray(arr).flatten();
        }
      },
      {
        name: 'without',
        method: function(arr){
          arr = ensureArray(arr);
          var args = Array.prototype.slice.call(arguments, 1);
          return Array.prototype.exclude.apply(arr, args);
        }
      },
      {
        name: 'uniq',
        method: function(arr){
          return ensureArray(arr).unique();
        }
      },
      {
        name: 'intersection',
        method: function(arr){
          arr = ensureArray(arr);
          var args = Array.prototype.slice.call(arguments, 1);
          return Array.prototype.intersect.apply(arr, args);
        }
      },
      {
        name: 'union',
        method: function(arr, a){
          arr = ensureArray(arr);
          var args = Array.prototype.slice.call(arguments, 1);
          return Array.prototype.union.apply(arr, args);
        }
      },
      {
        name: 'difference',
        method: function(arr, a){
          arr = ensureArray(arr);
          var args = Array.prototype.slice.call(arguments, 1);
          return Array.prototype.subtract.apply(arr, args);
        }
      }
    ]
  }
];

var mapMethods = function() {
  var proto;
  CompatibleMethods.forEach(function(cm) {
    cm.methods.forEach(function(m) {
      _[m.name] = m.method;
    });
  });
}

mapMethods();
