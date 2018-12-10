
ensureNamespaceNotInitialized = function(name, fn) {
  var namespaceExisted = Sugar.hasOwnProperty(name);
  var previousNamespace = Sugar[name];
  delete Sugar[name];
  fn();
  if (namespaceExisted) {
    Sugar[name] = previousNamespace;
  }
};
