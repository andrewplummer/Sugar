
objectPrototypeMethods = {};
sugarEnabledMethods = [
  'isArray','isBoolean','isDate','isFunction','isNumber','isString','isRegExp','isNaN','isObject',                       // Type methods
  'keys','values','select','reject','each','merge','isEmpty','equals','clone','watch','tap','has',                       // Hash methods
  'any','all','none','count','find','findAll','isEmpty','sum','average','min','max','least','most','map','reduce','size' // Enumerable methods
];

rememberObjectProtoypeMethods = function() {
  for(var m in Object.prototype) {
    if(!Object.prototype.hasOwnProperty(m)) continue;
    objectPrototypeMethods[m] = Object.prototype[m];
  }
}

restoreObjectPrototypeMethods = function() {
  // Cannot iterate over Object.prototype's methods if they've been defined in a modern browser
  // that implements defineProperty, so we'll have to set back the known ones that have been overridden.
  sugarEnabledMethods.forEach(function(name){
    // This is a cute one. Checking for the name in the hash isn't enough because it itself is
    // an object that has been extended, so each and every one of the methods being held here are being
    // perfectly shadowed!
    if(objectPrototypeMethods.hasOwnProperty(name) && objectPrototypeMethods[name]) {
      Object.prototype[name] = objectPrototypeMethods[name];
    } else {
      delete Object.prototype[name];
    }
  });
}

testIterateOverObject = function(obj, fn) {
  var key;
  for(key in obj) {
    if(!Object.hasOwnProperty(key)) continue;
    fn.call(obj, key, obj[key]);
  }
}

testClassAndInstance = function(name, obj, args, expected, message) {
  if(!testIsArray(args)) {
    args = [args];
  }
  equal(Object[name].apply(obj, [obj].concat(args)), expected, message);
  if(Object.extended) {
    extended = Object.extended(testCloneObject(obj));
    equal(extended[name].apply(extended, args), expected, message + ' | On extended object');
  }
}
