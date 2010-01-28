/*
Script: Class.Extras.js
	Public specs for Class.Extras.js

License:
	MIT-style license.
*/

var Local = Local || {};

describe("Chain Class", {

	"before all": function(){
		Local.Chain = new Class({

			Implements: Chain

		});
	},

	"callChain should not fail when nothing was added to the chain": function(){
		var chain = new Local.Chain();
		chain.callChain();
	},

	"should pass arguments to the function and return values": function(){
		var chain = new Local.Chain();
		var arr = [];
		chain.chain(function(a, b){
			var str = "0" + b + a;
			arr.push(str);
			return str;
		});
		chain.chain(function(a, b){
			var str = "1" + b + a;
			arr.push(str);
			return str;
		});
		var ret;
		value_of(arr).should_be([]);
		ret = chain.callChain("a", "A");
		value_of(ret).should_be("0Aa");
		value_of(arr).should_be(["0Aa"]);

		ret = chain.callChain("b", "B");
		value_of(ret).should_be("1Bb");
		value_of(arr).should_be(["0Aa", "1Bb"]);

		ret = chain.callChain();
		value_of(ret).should_be(false);
		value_of(arr).should_be(["0Aa", "1Bb"]);
	},

	"should chain any number of functions": function(){
		var chain = new Local.Chain();
		var arr = [];

		chain.chain(function(){
			arr.push(0);
		}, function(){
			arr.push(1);
		});

		value_of(arr).should_be([]);
		chain.callChain();
		value_of(arr).should_be([0]);
		chain.chain(function(){
			arr.push(2);
		});
		chain.callChain();
		value_of(arr).should_be([0, 1]);
		chain.callChain();
		value_of(arr).should_be([0, 1, 2]);
		chain.callChain();
		value_of(arr).should_be([0, 1, 2]);
	},

	"should allow an array of functions": function(){
		var chain = new Local.Chain();
		var arr = [];

		chain.chain([function(){
			arr.push(0);
		}, function(){
			arr.push(1);
		}, function(){
			arr.push(2);
		}]);

		value_of(arr).should_be([]);
		chain.callChain();
		value_of(arr).should_be([0]);
		chain.callChain();
		value_of(arr).should_be([0, 1]);
		chain.callChain();
		value_of(arr).should_be([0, 1, 2]);
		chain.callChain();
		value_of(arr).should_be([0, 1, 2]);
	},

	"each instance should have its own chain": function(){
		var foo = new Local.Chain();
		var bar = new Local.Chain();
		foo.val = "F";
		bar.val = "B";
		foo.chain(function(){
			this.val += 'OO';
		});
		bar.chain(function(){
			this.val += 'AR';
		});
		value_of(foo.val).should_be('F');
		value_of(bar.val).should_be('B');
		foo.callChain();
		bar.callChain();
		value_of(foo.val).should_be('FOO');
		value_of(bar.val).should_be('BAR');
	},
	
	"should be able to clear the chain": function(){
		var called;
		var fn = function(){
			called = true;
		};

		var chain = new Local.Chain();
		chain.chain(fn, fn, fn, fn);

		chain.callChain();
		value_of(called).should_be_true();
		called = false;

		chain.clearChain();

		chain.callChain();
		value_of(called).should_be_false();
		called = false;
	},

	"should be able to clear the chain from within": function(){
		var foo = new Local.Chain();

		var test = 0;
		foo.chain(function(){
			test++;
			foo.clearChain();
		}).chain(function(){
			test++;
		}).callChain();

		value_of(test).should_be(1);
	}

});

Hash.each({

	element: function(){
		return new Element('div');
	},
	
	mixin: function(){
		return new Events();
	}

}, function(createObject, type){
	describe('Events API: ' + type.capitalize(), {

		'before each': function(){
			Local.called = 0;
			Local.fn = function(){
				return Local.called++;
			};
		},

		'should add an Event to the Class': function(){
			var object = createObject();

			object.addEvent('event', Local.fn).fireEvent('event');

			value_of(Local.called).should_be(1);
		},

		'should add multiple Events to the Class': function(){
			createObject().addEvents({
				event1: Local.fn,
				event2: Local.fn
			}).fireEvent('event1').fireEvent('event2');

			value_of(Local.called).should_be(2);
		},

		// TODO 2.0only
		/*'should be able to remove event during firing': function(){
			createObject().addEvent('event', Local.fn).addEvent('event', function(){
				Local.fn();
				this.removeEvent('event', arguments.callee);
			}).addEvent('event', function(){ Local.fn(); }).fireEvent('event').fireEvent('event');

			value_of(Local.called).should_be(5);
		},*/

		'should add a protected event': function(){
			var object = createObject();
			
			//TODO 2.0; 1.2 intentionally has a different API
			if (type == 'element'){
				value_of(1).should_be(1);
				return;
			}
			
			var protectedFn = (function(){ Local.fn(); });

			object.addEvent('protected', protectedFn, true).removeEvent('protected', protectedFn).fireEvent('protected');

			value_of(Local.called).should_be(1);
		},

		'should remove a specific method for an event': function(){
			var object = createObject();
			var x = 0, fn = function(){ x++; };

			object.addEvent('event', Local.fn).addEvent('event', fn).removeEvent('event', Local.fn).fireEvent('event');

			value_of(x).should_be(1);
			value_of(Local.called).should_be(0);
		},

		'should remove an event and its methods': function(){
			var object = createObject();
			var x = 0, fn = function(){ x++; };

			object.addEvent('event', Local.fn).addEvent('event', fn).removeEvents('event').fireEvent('event');

			value_of(x).should_be(0);
			value_of(Local.called).should_be(0);
		},

		'should remove all events': function(){
			var object = createObject();
			var x = 0, fn = function(){ x++; };

			object.addEvent('event1', Local.fn).addEvent('event2', fn).removeEvents();
			object.fireEvent('event1').fireEvent('event2');
			
			value_of(x).should_be(0);
			value_of(Local.called).should_be(0);
		},

		'should remove events with an object': function(){
			var object = createObject();
			var events = {
				event1: Local.fn,
				event2: Local.fn
			};

			object.addEvent('event1', function(){ Local.fn(); }).addEvents(events).fireEvent('event1');
			value_of(Local.called).should_be(2);

			object.removeEvents(events);
			object.fireEvent('event1');
			value_of(Local.called).should_be(3);

			object.fireEvent('event2');
			value_of(Local.called).should_be(3);
		},

		'should remove an event immediately': function(){
			var object = createObject();

			var methods = [];

			var three = function(){
				methods.push(3);
			};

			object.addEvent('event', function(){
				methods.push(1);
				this.removeEvent('event', three);
			}).addEvent('event', function(){
				methods.push(2);
			}).addEvent('event', three);
			
			object.fireEvent('event');
			value_of(methods).should_be([1, 2]);

			object.fireEvent('event');
			value_of(methods).should_be([1, 2, 1, 2]);
		}
	});
});

describe("Options Class", {

	"before all": function(){
		Local.OptionsTest = new Class({
			Implements: [Options, Events],
			
			options: {
				a: 1,
				b: 2
			},

			initialize: function(options){
				this.setOptions(options);
			}
		});
	},

	"should set options": function(){
		var myTest = new Local.OptionsTest({a: 1, b: 3});
		value_of(myTest.options).should_not_be(undefined);
	},

	"should override default options": function(){
		var myTest = new Local.OptionsTest({a: 3, b: 4});
		value_of(myTest.options.a).should_be(3);
		value_of(myTest.options.b).should_be(4);
	}

});

describe("Options Class with Events", {

	"before all": function(){
		Local.OptionsTest = new Class({
			Implements: [Options, Events],
			
			options: {
				onEvent1: function(){
					return true;
				},
				onEvent2: function(){
					return false;
				}
			},
	
			initialize: function(options){
				this.setOptions(options);
			}
		});
	},
	
	"should add events in the options object if class has implemented the Events class": function(){
		var myTest = new Local.OptionsTest({
			onEvent2: function(){
				return true;
			},
			
			onEvent3: function(){
				return true;
			}
		});

		value_of(myTest.$events.event1.length).should_be(1);
		value_of(myTest.$events.event2.length).should_be(1);
		value_of(myTest.$events.event3.length).should_be(1);
	}

});

describe("Options Class", {

	"before all": function(){
		Local.OptionsTest = new Class({
			Implements: Options,

			initialize: function(options){
				this.setOptions(options);
			}
		});
	},

	"should set options": function(){
		var myTest = new Local.OptionsTest({ a: 1, b: 2});
		value_of(myTest.options).should_not_be(undefined);
	},

	"should override default options": function(){
		Local.OptionsTest.implement({
			options: {
				a: 1,
				b: 2
			}
		});
		var myTest = new Local.OptionsTest({a: 3, b: 4});
		value_of(myTest.options.a).should_be(3);
		value_of(myTest.options.b).should_be(4);
	},

	"should add events in the options object if class has implemented the Events class": function(){
		Local.OptionsTest.implement(new Events).implement({
			options: {
				onEvent1: function(){
					return true;
				},
				onEvent2: function(){
					return false;
				}
			}
		});
		var myTest = new Local.OptionsTest({
			onEvent3: function(){
				return true;
			}
		});
		var events = myTest.$events;
		value_of(events).should_not_be(undefined);
		value_of(events.event1.length).should_be(1);
		value_of(events.event1.length).should_be(1);
		value_of(events.event1.length).should_be(1);
	}

});