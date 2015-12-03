var runner = require('../setup');

runner.setSource('../../release/npm/sugar/regexp');

// Tests
runner.loadTest('regexp');

runner.run();
