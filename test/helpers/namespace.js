(() => {

  let captured;

  function forEachNamespace(obj, fn) {
    for (let [key, val] of Object.entries(obj)) {
      if (key.match(/^[A-Z]/)) {
        fn(key, val);
      }
    }
  }

  function captureNamespaces() {
    captured = {};
    forEachNamespace(Sugar, (key, val) => {
      captured[key] = val;
      delete Sugar[key];
    });
  }

  function restoreNamespaces() {
    forEachNamespace(Sugar, (key) => {
      delete Sugar[key];
    });
    forEachNamespace(captured, (key) => {
      Sugar[key] = captured[key];
    });
    captured = null;
  }

  withResetNamespaces = (fn) => {
    captureNamespaces();
    fn();
    restoreNamespaces();
  }

})();
