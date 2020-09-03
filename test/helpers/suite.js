(function() {
  /* eslint-disable no-undef */

  var currentNamespace;

  function staticTest(protoFn) {
    it('should be a static method', function() {
      assertUndefined(protoFn);
    });
  }

  function instanceTest(protoFn) {
    it('should be an instance method', function() {
      assertInstanceOf(protoFn, Function);
    });
  }

  function withNamespace(describeFn) {
    return function(namespace, suite) {
      describeFn(namespace, function() {
        currentNamespace = Sugar[namespace];
        suite();
        currentNamespace = null;
      });
    };
  }

  function withMethod(typeTest, suiteFn) {
    return function(methodNames, suite) {
      methodNames.split(',').forEach((methodName) => {
        var method = currentNamespace[methodName];
        var protoFn = currentNamespace.prototype[methodName];
        suiteFn(methodName, function() {
          typeTest(protoFn);
          suite(method);
        });
      });
    };
  }

  namespace  = withNamespace(describe);
  fnamespace = withNamespace(fdescribe);
  xnamespace = withNamespace(xdescribe);

  describeStatic  = withMethod(staticTest, describe);
  fdescribeStatic = withMethod(staticTest, fdescribe);
  xdescribeStatic = withMethod(staticTest, xdescribe);

  describeInstance  = withMethod(instanceTest, describe);
  fdescribeInstance = withMethod(instanceTest, fdescribe);
  xdescribeInstance = withMethod(instanceTest, xdescribe);

})();
