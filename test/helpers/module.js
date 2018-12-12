
getModuleNamedExports = function(module) {
  return Object.keys(module).filter(function(name) {
    return name !== 'default';
  });
}

getNamespaceMethodNames = function(namespace) {
  return Object.keys(namespace);
}

assertNamedExports = function(module) {
  var namespace = module.default;
  var methodNames = getModuleNamedExports(module).concat(getNamespaceMethodNames(namespace));
  var asserted = {};
  methodNames.forEach(function(methodName) {
    if (asserted[methodName]) {
      return;
    }
    asserted[methodName] = true;

    var exportExists = typeof module[methodName] === 'function';
    var methodExists = typeof namespace[methodName] === 'function';

    var msg = 'method ' + methodName + ' should be a named export and namespace method';
    assertTrue(exportExists && methodExists, msg);
  });
}

