function getGlobalContext() {
  // Get global context by keyword here to avoid issues with libraries
  // that can potentially alter this script's context object.
  return testContext(typeof global !== 'undefined' && global)
         || testContext(typeof window !== 'undefined' && window)
         || testContext(typeof self   !== 'undefined' && self);
}

function testContext(obj) {
  // Note that Rhino uses a different "global" keyword so perform an
  // extra check here to ensure that it's actually the global object.
  // TODO: test this!
  return obj && obj.Object === Object ? obj : null;
}

export default getGlobalContext();
