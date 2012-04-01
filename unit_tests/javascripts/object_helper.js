
objectPrototypeMethods = {};
sugarEnabledMethods = ['isArray','isBoolean','isDate','isFunction','isNumber','isString','isRegExp','isNaN','isObject','keys','values','each','merge','isEmpty','equals','clone','watch','tap','has'];

rememberObjectProtoypeMethods = function() {
  for(var m in Object.prototype) {
    if(!Object.prototype.hasOwnProperty(m)) continue;
    objectPrototypeMethods[m] = Object.prototype[m];
  }
}

restoreObjectPrototypeMethods = function() {
  // Cannot iterate over Object.prototype's methods if they've been defined in a modern browser
  // that implements defineProperty, so we'll have to set back the known ones that have been overridden.
  sugarEnabledMethods.each(function(name){
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
