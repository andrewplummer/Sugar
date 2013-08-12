var documentLoaded = document.loaded;

new Test.Unit.Runner({
  
  // test firing an event and observing it on the element it's fired from
  testCustomEventFiring: function() {
    var span = $("span"), fired = false, observer = function(event) {
      this.assertEqual(span, event.element());
      this.assertEqual(1, event.memo.index);
      fired = true;
    }.bind(this);
    
    span.observe("test:somethingHappened", observer);
    span.fire("test:somethingHappened", { index: 1 });
    this.assert(fired);
    
    fired = false;
    span.fire("test:somethingElseHappened");
    this.assert(!fired);
    
    span.stopObserving("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    this.assert(!fired);
  },
  
  // test firing an event and observing it on a containing element
  testCustomEventBubbling: function() {
    var span = $("span"), outer = $("outer"), fired = false, observer = function(event) {
      this.assertEqual(span, event.element());
      fired = true;
    }.bind(this);
    
    outer.observe("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    this.assert(fired);
    
    fired = false;
    span.fire("test:somethingElseHappened");
    this.assert(!fired);
    
    outer.stopObserving("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    this.assert(!fired);
  },
  
  testCustomEventCanceling: function() {
    var span = $("span"), outer = $("outer"), inner = $("inner");
    var fired = false, stopped = false;

    function outerObserver(event) {
      fired = span == event.element();
    }
    
    function innerObserver(event) {
      event.stop();
      stopped = true;
    }
    
    inner.observe("test:somethingHappened", innerObserver);
    outer.observe("test:somethingHappened", outerObserver);
    span.fire("test:somethingHappened");
    this.assert(stopped);
    this.assert(!fired);
    
    fired = stopped = false;
    inner.stopObserving("test:somethingHappened", innerObserver);
    span.fire("test:somethingHappened");
    this.assert(!stopped);
    this.assert(fired);
    
    outer.stopObserving("test:somethingHappened", outerObserver);
  },
  
  testEventObjectIsExtended: function() { 
    var span = $("span"), event, observedEvent, observer = function(e) { observedEvent = e };
    span.observe("test:somethingHappened", observer);
    event = span.fire("test:somethingHappened");
    this.assertEqual(event, observedEvent);
    this.assertEqual(Event.Methods.stop.methodize(), event.stop);
    span.stopObserving("test:somethingHappened", observer);
    
    event = span.fire("test:somethingHappenedButNoOneIsListening");
    this.assertEqual(Event.Methods.stop.methodize(), event.stop);
  },
  
  testEventObserversAreBoundToTheObservedElement: function() {
    var span = $("span"), target, observer = function() { target = this };
    
    span.observe("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    span.stopObserving("test:somethingHappened", observer);
    this.assertEqual(span, target);
    target = null;
    
    var outer = $("outer");
    outer.observe("test:somethingHappened", observer);
    span.fire("test:somethingHappened");
    outer.stopObserving("test:somethingHappened", observer);
    this.assertEqual(outer, target);
  },
  
  testMultipleCustomEventObserversWithTheSameHandler: function() {
    var span = $("span"), count = 0, observer = function() { count++ };
    
    span.observe("test:somethingHappened", observer);
    span.observe("test:somethingElseHappened", observer);
    span.fire("test:somethingHappened");
    this.assertEqual(1, count);
    span.fire("test:somethingElseHappened");
    this.assertEqual(2, count);
  },

  testMultipleEventHandlersCanBeAddedAndRemovedFromAnElement: function() {
    var span = $("span"), count1 = 0, count2 = 0;
    var observer1 = function() { count1++ };
    var observer2 = function() { count2++ };

    span.observe("test:somethingHappened", observer1);
    span.observe("test:somethingHappened", observer2);
    span.fire("test:somethingHappened");
    this.assertEqual(1, count1);
    this.assertEqual(1, count2);

    span.stopObserving("test:somethingHappened", observer1);
    span.stopObserving("test:somethingHappened", observer2);
    span.fire("test:somethingHappened");
    this.assertEqual(1, count1); 
    this.assertEqual(1, count2);
  },
  
  testStopObservingWithoutArguments: function() {
    var span = $("span"), count = 0, observer = function() { count++ };
    
    span.observe("test:somethingHappened", observer);
    span.observe("test:somethingElseHappened", observer);
    span.stopObserving();
    span.fire("test:somethingHappened");
    this.assertEqual(0, count);
    span.fire("test:somethingElseHappened");
    this.assertEqual(0, count);
  },
  
  testStopObservingWithoutHandlerArgument: function() {
    var span = $("span"), count = 0, observer = function() { count++ };
    
    span.observe("test:somethingHappened", observer);
    span.observe("test:somethingElseHappened", observer);
    span.stopObserving("test:somethingHappened");
    span.fire("test:somethingHappened");
    this.assertEqual(0, count);
    span.fire("test:somethingElseHappened");
    this.assertEqual(1, count);
    span.stopObserving("test:somethingElseHappened");
    span.fire("test:somethingElseHappened");
    this.assertEqual(1, count);
  },
  
  testStopObservingRemovesHandlerFromCache: function() {
    var span = $("span"), observer = Prototype.emptyFunction, eventID;
    
    span.observe("test:somethingHappened", observer);
    
    var registry = span.getStorage().get('prototype_event_registry');
    
    this.assert(registry);
    this.assert(Object.isArray(registry.get('test:somethingHappened')));
    this.assertEqual(1, registry.get('test:somethingHappened').length);
    
    span.stopObserving("test:somethingHappened", observer);
    
    registry = span.getStorage().get('prototype_event_registry');
    
    this.assert(registry);
    this.assert(Object.isArray(registry.get('test:somethingHappened')));
    this.assertEqual(0, registry.get('test:somethingHappened').length);
  },
  
  testObserveAndStopObservingAreChainable: function() {
    var span = $("span"), observer = Prototype.emptyFunction;

    this.assertEqual(span, span.observe("test:somethingHappened", observer));
    this.assertEqual(span, span.stopObserving("test:somethingHappened", observer));

    span.observe("test:somethingHappened", observer);
    this.assertEqual(span, span.stopObserving("test:somethingHappened"));

    this.assertEqual(span, span.stopObserving("test:somethingOtherHappened", observer));

    span.observe("test:somethingHappened", observer);
    this.assertEqual(span, span.stopObserving());
    this.assertEqual(span, span.stopObserving()); // assert it again, after there are no observers

    span.observe("test:somethingHappened", observer);
    this.assertEqual(span, span.observe("test:somethingHappened", observer)); // try to reuse the same observer
    span.stopObserving();
  },

  testDocumentLoaded: function() {
    this.assert(!documentLoaded);
    this.assert(document.loaded);
  },
  
  testDocumentContentLoadedEventFiresBeforeWindowLoad: function() {
    this.assert(eventResults.contentLoaded, "contentLoaded");
    this.assert(eventResults.contentLoaded.endOfDocument, "contentLoaded.endOfDocument");
    this.assert(!eventResults.contentLoaded.windowLoad, "!contentLoaded.windowLoad");
    this.assert(eventResults.windowLoad, "windowLoad");
    this.assert(eventResults.windowLoad.endOfDocument, "windowLoad.endOfDocument");
    this.assert(eventResults.windowLoad.contentLoaded, "windowLoad.contentLoaded");
  },
  
  testEventStopped: function() {
    var span = $("span"), event;

    span.observe("test:somethingHappened", Prototype.emptyFunction);
    event = span.fire("test:somethingHappened");
    this.assert(!event.stopped, "event.stopped should be false with an empty observer");
    span.stopObserving("test:somethingHappened");
    
    span.observe("test:somethingHappened", function(e) { e.stop() });
    event = span.fire("test:somethingHappened");
    this.assert(event.stopped, "event.stopped should be true for an observer that calls stop");
    span.stopObserving("test:somethingHappened");
  },
  
  testNonBubblingCustomEvent: function() {
    var span = $('span'), outer = $('outer'), event;
    
    var outerRespondedToEvent = false;
    outer.observe("test:bubbleEvent", function(e) { outerRespondedToEvent = true });
    span.fire("test:bubbleEvent", {}, false);
    
    this.assertEqual(false, outerRespondedToEvent,
     'parent element should not respond to non-bubbling event fired on child');
  },

  testEventFindElement: function() {
    var span = $("span"), event;
    event = span.fire("test:somethingHappened");
    this.assertElementMatches(event.findElement(), 'span#span');
    this.assertElementMatches(event.findElement('span'), 'span#span');
    this.assertElementMatches(event.findElement('p'), 'p#inner');
    this.assertEqual(null, event.findElement('div.does_not_exist'));
    this.assertElementMatches(event.findElement('.does_not_exist, span'), 'span#span');
  },
  
  testEventIDDuplication: function() {
    $('container').down().observe("test:somethingHappened", Prototype.emptyFunction);
    $('container').innerHTML += $('container').innerHTML;
    this.assertUndefined($('container').down(1)._prototypeEventID);
  }
});

document.observe("dom:loaded", function(event) {
  eventResults.contentLoaded = {
    endOfDocument: eventResults.endOfDocument,
    windowLoad:    eventResults.windowLoad
  };
});

Event.observe(window, "load", function(event) {
  eventResults.windowLoad = {
    endOfDocument: eventResults.endOfDocument,
    contentLoaded: eventResults.contentLoaded
  };
});
