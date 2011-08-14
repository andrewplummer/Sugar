new Test.Unit.Runner({
  testPeriodicalExecuterStop: function() {
    var peEventCount = 0;
    function peEventFired(pe) {
      if (++peEventCount > 2) pe.stop();
    }

    // peEventFired will stop the PeriodicalExecuter after 3 callbacks
    new PeriodicalExecuter(peEventFired, 0.05);

    this.wait(600, function() {
      this.assertEqual(3, peEventCount);
    });
  },

  testOnTimerEventMethod: function() {
    var testcase = this,
        pe = {
          onTimerEvent: PeriodicalExecuter.prototype.onTimerEvent,
          execute: function() {
            testcase.assert(pe.currentlyExecuting);
          }
        };

    pe.onTimerEvent();
    this.assert(!pe.currentlyExecuting);

    pe.execute = function() {
      testcase.assert(pe.currentlyExecuting);
      throw new Error()
    }
    this.assertRaise('Error', pe.onTimerEvent.bind(pe));
    this.assert(!pe.currentlyExecuting);
  }
});