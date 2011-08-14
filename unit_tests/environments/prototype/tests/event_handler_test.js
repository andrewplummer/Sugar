new Test.Unit.Runner((function() {
  function handle(selector, callback) {
    if (!callback) {
      callback = selector;
      selector = false;
    }
    return new Event.Handler("container", "test:event", selector, callback);
  }

  return {
    testHandlersDoNothingIfStartHasNotBeenCalled: function() {
      var fired = false;
      this.handler = handle(function() { fired = true });

      $("container").fire("test:event");
      this.assert(!fired);
    },

    testHandlersAreFiredWhenStartIsCalled: function() {
      var fired = false;
      this.handler = handle(function() { fired = true });

      this.handler.start();
      this.assert(!fired);
      $("container").fire("test:event");
      this.assert(fired);
    },

    testHandlersDoNotFireAfterStartingAndThenStopping: function() {
      var fired = 0;
      this.handler = handle(function() { fired++ });

      this.handler.start();
      this.assertEqual(0, fired);
      $("container").fire("test:event");
      this.assertEqual(1, fired);
      this.handler.stop();
      $("container").fire("test:event");
      this.assertEqual(1, fired);
    },

    testHandlersWithoutSelectorsPassTheTargetElementToCallbacks: function() {
      var span = $("container").down("span");
      this.handler = handle(function(event, element) {
        this.assertEqual(span, element);
      }.bind(this));

      this.handler.start();
      span.fire("test:event");
    },

    testHandlersWithSelectorsPassTheMatchedElementToCallbacks: function() {
      var link = $("container").down("a"), span = link.down("span");
      this.handler = handle("a", function(event, element) {
        this.assertEqual(link, element);
      }.bind(this));

      this.handler.start();
      span.fire("test:event");
    },

    testHandlersWithSelectorsDoNotCallTheCallbackIfNoMatchingElementIsFound: function() {
      var paragraph = $("container").down("p", 1), fired = false;
      this.handler = handle("a", function(event, element) { fired = true });

      this.handler.start();
      paragraph.fire("test:event");
      this.assert(!fired);
    },

    testHandlerCallbacksAreBoundToTheOriginalElement: function() {
      var span = $("container").down("span"), element;
      this.handler = handle(function() { element = this });

      this.handler.start();
      span.fire("test:event");
      this.assertEqual($("container"), element);
    },

    testCallingStartMultipleTimesDoesNotInstallMultipleObservers: function() {
      var fired = 0;
      this.handler = handle(function() { fired++ });

      this.handler.start();
      this.handler.start();
      $("container").fire("test:event");
      this.assertEqual(1, fired);
    },

    teardown: function() {
      try {
        this.handler.stop();
      } catch (e) {
      } finally {
        delete this.handler;
      }
    }
  }
})());
