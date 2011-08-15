
fixPrototypeIterators = function() {
  fixIterator('find');
  fixIterator('findAll');
  fixIterator('any');
  fixIterator('all');
  fixIterator('sortBy', true);
  fixIterator('min', true);
  fixIterator('max', true);
}

fixIterator = function(name, map) {
  var fn = Array.prototype[name];
  Array.prototype[name] = function(a) {
    if((a && a.call) || arguments.length == 0) {
      return fn.apply(this, arguments);
    } else {
      return fn.apply(this, [function(s) {
        if(map) {
          return s && s[a] ? s[a] : s;
        } else {
          return s == a;
        }
      }].concat(Array.prototype.slice.call(arguments, 1)));
    }
  };
}

fixPrototypeIterators();
