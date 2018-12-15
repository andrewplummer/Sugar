
function getGlobalContext() {
  // Get global context by keyword here to avoid issues with libraries
  // that can potentially alter this script's context object.
  return testGlobalContext(typeof global !== 'undefined' && global)
         || testGlobalContext(typeof window !== 'undefined' && window)
         || testGlobalContext(typeof self   !== 'undefined' && self);
}

function testGlobalContext(obj) {
  // Note that Rhino uses a different "global" keyword so perform an
  // extra check here to ensure that it's actually the global object.
  // TODO: test this!
  return obj && obj.Object === Object ? obj : null;
}

export default getGlobalContext();
