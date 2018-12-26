(function() {
  /* eslint-disable no-undef */

  var currentNamespace;

  function assertStatic(methodName, testFn) {
    testFn(methodName + ' should be a static method', function() {
      assertUndefined(currentNamespace.prototype[methodName]);
    });
  }

  function assertInstance(methodName, testFn) {
    testFn(methodName + ' should be an instance method', function() {
      assertInstanceOf(currentNamespace.prototype[methodName], Function);
    });
  }

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
    };
  }

  function withTest(assertFn, testFn) {
    return function(methodName, test) {
      assertFn(methodName, testFn);
      testFn(methodName, function() {
        test(currentNamespace[methodName]);
      });
    };
  }

  namespace  = withSuite(describe);
  fnamespace = withSuite(fdescribe);
  xnamespace = withSuite(xdescribe);

  staticMethod  = withTest(assertStatic, it);
  fstaticMethod = withTest(assertStatic, fit);
  xstaticMethod = withTest(assertStatic, xit);

  instanceMethod  = withTest(assertInstance, it);
  finstanceMethod = withTest(assertInstance, fit);
  xinstanceMethod = withTest(assertInstance, xit);

})();
