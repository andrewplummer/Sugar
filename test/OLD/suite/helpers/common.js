
// Properties


// Scope will be undefined for environments that support strict mode.
testNullScope = (function() { 'use strict'; return this; }).call(undefined);
canTestPrimitiveScope = testNullScope === undefined;

// Methods

testHasOwn = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

testIterateOverObject = function (obj, fn) {
  var key;
  for(key in obj) {
    if(!testHasOwn(obj, key)) continue;
    fn.call(obj, key, obj[key]);
  }
}

testGetClass = function(obj) {
  return testInternalToString.call(obj);
}

testIsArray = function(obj) {
  return testGetClass(obj) === '[object Array]';
}

testIsRegExp = function(obj) {
  return testGetClass(obj) === '[object RegExp]';
}

testIsDate = function(obj) {
  return testGetClass(obj) === '[object Date]';
}

testIsFunction = function(obj) {
  return testGetClass(obj) === '[object Function]';
}

testGetPrivatePropKey = function(name) {
  return '_sugar_' + name;
}

testGetPrivateProp = function(obj, name) {
  return obj[testGetPrivatePropKey(name)];
}

testGetStringified = function(obj) {
  return typeof obj === 'object' && typeof JSON !== 'undefined' ? JSON.stringify(obj) : obj;
}

testClone = function (obj) {
  if (obj == null || typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  if (testIsDate(obj)) {
    var d = new Date(obj.getTime());
    var utcKey = testGetPrivatePropKey('utc');
    if (testHasOwn(obj, utcKey)) {
      d[utcKey] = obj[utcKey];
    }
    return d;
  } else if (testIsRegExp(obj)) {
    return testCloneRegExp(obj);
  } else if (testIsFunction(obj)) {
    // Will not clone functions
    return obj;
  }
  if (obj && typeof obj.valueOf() === 'string' && obj.length > 0 && !testHasOwn(obj, 0)) {
    testForceStringCoercion(obj);
  }
  var result = testIsArray(obj) ? [] : {}, key;
  for(key in obj) {
    if(!testHasOwn(obj, key)) continue;
    result[key] = testClone(obj[key]);
  }
  if (obj && typeof obj === 'object' && testHasOwn(obj, 'toString')) {
    result['toString'] = obj['toString'];
  }
  return result;
}

testCloneRegExp = function(reg) {
  var flags = '';
  if (reg.global)     flags += 'g';
  if (reg.ignoreCase) flags += 'i';
  if (reg.multiline)  flags += 'm';
  if (reg.sticky)     flags += 'y';
  return RegExp(reg.source, flags);
}

testForceStringCoercion = function(obj) {
  var i = 0, chr;
  while(chr = obj.charAt(i)) {
    obj[i++] = chr;
  }
  for (var key in obj) {
    if(!testHasOwn(obj, key)) continue;
  };
}

testGetArgs = function(args) {
  return Array.prototype.slice.call(args);
}

testCapitalize = function(str) {
  return str.slice(0,1).toUpperCase() + str.slice(1);
}

propertyIsEnumerable = function(obj, prop) {
  for (var key in obj) {
    if(!testHasOwn(obj, key)) continue;
    if(key === prop) return true;
  }
  return false;
}
