
function getModuleNamedExports(module) {
  return Object.keys(module).filter(function(name) {
    return name !== 'default';
  });
}

assertMatchingNamedExports = function(module) {
  var allNames = getModuleNamedExports(module).concat(Object.keys(module.default));
  var asserted = {};
  allNames.forEach(function(name) {
    if (asserted[name]) {
      return;
    }
    asserted[name] = true;

    var exportExists   = Object.prototype.hasOwnProperty.call(module, name);
    var propertyExists = module.default.hasOwnProperty(name);

    var msg = name + ' should be a named export and property';
    assertTrue(exportExists && propertyExists, msg);
  });
};
