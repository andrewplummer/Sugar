ensureNamespaceNotInitialized = function(name, fn) {
  var namespaceExisted = name in Sugar;
  var previousNamespace = Sugar[name];
  delete Sugar[name];
  fn();
  if (namespaceExisted) {
    Sugar[name] = previousNamespace;
  }
};
