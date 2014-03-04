
objectPrototypeMethods = {};
sugarEnabledMethods = [
  'isArray','isBoolean','isDate','isFunction','isNumber','isString','isRegExp','isNaN','isObject',                       // Type methods
  'keys','values','select','reject','each','merge','isEmpty','equals','clone','watch','tap','has','toQueryString',       // Hash methods
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

testIsArray = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

testClassAndInstance = function(subject, args, expected, message) {
  var ext = run(Object, 'extended', [subject]);
  test(ext, args, expected, message);
  test(Object, [ext].concat(args), expected, message);
}

