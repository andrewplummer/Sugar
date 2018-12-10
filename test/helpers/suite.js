
(function() {

  var currentNamespace;

  function withSuite(describeFn) {
    return function(name, suite) {
      describeFn(name, function() {
        beforeAll(function() {
          currentNamespace = Sugar[name];
        });
        afterAll(function() {
          currentNamespace = null;
        });
        suite();
      });
    }
  }

  function withTest(testFn) {
    return function(name, test) {
      testFn(name, function() {
        test(currentNamespace[name]);
      });
    }
  }

  namespace  = withSuite(describe);
  fnamespace = withSuite(fdescribe);
  xnamespace = withSuite(xdescribe);

  method  = withTest(it);
  fmethod = withTest(fit);
  xmethod = withTest(xit);

})();
