(function() {

  let currentNamespace;

  withNamespace = (name, fn) => {
    const last = withMethod;
    currentNamespace = Sugar[name];
    fn();
    currentNamespace = last;
  };

  withMethod = (str, fn) => {
    const ns = currentNamespace;
    if (!ns) {
      throw new Error('withMethod cannot be called outside a namespace context');
    }
    const methodNames = str.split(',');
    for (let i = 0; i < methodNames.length; i++) {
      const methodName = methodNames[i];
      const method = ns[methodName];
      const proto = ns.prototype[methodName];
      fn(method, proto, methodName);
    }
  };

  function chainNamespace(suiteFn) {
    return (name, fn) => {
        suiteFn(name, () => {
          withNamespace(name, (namespace) => {
          fn(namespace);
        });
      });
    };
  }

  function chainStatic(suiteFn) {
    return (name, fn) => {
      withMethod(name, (method, proto, methodName) => {
        suiteFn(methodName, () => {
          it('should be a static method', function() {
            assertUndefined(proto);
          });
          fn(method);
        });
      });
    };
  }

  function chainInstance(suiteFn) {
    return (name, fn) => {
      withMethod(name, (method, proto, methodName) => {
        suiteFn(methodName, () => {
          it('should be an instance method', function() {
            assertInstanceOf(proto, Function);
          });
          fn(method);
        });
      });
    };
  }

  describeNamespace  = chainNamespace(describe);
  fdescribeNamespace = chainNamespace(fdescribe);
  xdescribeNamespace = chainNamespace(xdescribe);
  pdescribeNamespace = chainNamespace(fpdescribe);

  describeStatic  = chainStatic(describe);
  fdescribeStatic = chainStatic(fdescribe);
  xdescribeStatic = chainStatic(xdescribe);
  pdescribeStatic = chainStatic(fpdescribe);

  describeInstance  = chainInstance(describe);
  fdescribeInstance = chainInstance(fdescribe);
  xdescribeInstance = chainInstance(xdescribe);
  pdescribeInstance = chainInstance(fpdescribe);

})();
