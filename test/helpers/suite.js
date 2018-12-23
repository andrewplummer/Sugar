(function() {

  var currentNamespace;

  function assertStatic(methodName, instanceFn) {
    assertUndefined(currentNamespace.prototype[methodName], {
      message: '{methodName} should be a static method',
      methodName: methodName
    });
  }

  function assertInstance(methodName) {
    assertInstanceOf(currentNamespace.prototype[methodName], Function, {
      message: '{methodName} should be an instance method',
      methodName: methodName
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

  function withTest(typeFn, testFn) {
    return function(methodName, test) {
      testFn(methodName, function() {
        typeFn(methodName, currentNamespace.prototype[methodName]);
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
