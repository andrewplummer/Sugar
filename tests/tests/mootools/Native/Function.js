/*
Script: Function.js
	Specs for Function.js

License:
	MIT-style license.
*/

(function(){

var fn = function(){
	return $A(arguments);
};

var Rules = function(){
	return this + ' rules';
};

var Args = function(){
	return [this].concat($A(arguments));
};

describe("Function Methods", {

	// Function.create

	'should return a new function': function(){
		var fnc = $empty.create();
		value_of($empty === fnc).should_be_false();
	},

	'should return a new function with specified argument': function(){
		var fnc = fn.create({'arguments': 'rocks'});
		value_of(fnc()).should_be(['rocks']);
	},

	'should return a new function with multiple arguments': function(){
		var fnc = fn.create({'arguments': ['MooTools', 'rocks']});
		value_of(fnc()).should_be(['MooTools', 'rocks']);
	},

	'should return a new function bound to an object': function(){
		var fnc = Rules.create({'bind': 'MooTools'});
		value_of(fnc()).should_be('MooTools rules');
	},

	'should return a new function as an event': function(){
		var fnc = fn.create({'arguments': [0, 1], 'event': true});
		value_of(fnc('an Event occurred')).should_be(['an Event occurred', 0, 1]);
	},

	// Function.bind

	'should return the function bound to an object': function(){
		var fnc = Rules.bind('MooTools');
		value_of(fnc()).should_be('MooTools rules');
	},

	'should return the function bound to an object with specified argument': function(){
		var fnc = Args.bind('MooTools', 'rocks');
		value_of(fnc()).should_be(['MooTools', 'rocks']);
	},

	'should return the function bound to an object with multiple arguments': function(){
		var fnc = Args.bind('MooTools', ['rocks', 'da house']);
		value_of(fnc()).should_be(['MooTools', 'rocks', 'da house']);
	},

	'should return the function bound to an object and make the function an event listener': function(){
		var fnc = Args.bindWithEvent('MooTools');
		value_of(fnc('an Event ocurred')).should_be(['MooTools', 'an Event ocurred']);
	},

	'should return the function bound to an object and make the function event listener with multiple arguments': function(){
		var fnc = Args.bindWithEvent('MooTools', ['rocks', 'da house']);
		value_of(fnc('an Event ocurred')).should_be(['MooTools', 'an Event ocurred', 'rocks', 'da house']);
	},

	// Function.pass

	'should return a function that when called passes the specified arguments to the original function': function(){
		var fnc = fn.pass('MooTools is beautiful and elegant');
		value_of(fnc()).should_be(['MooTools is beautiful and elegant']);
	},

	'should pass multiple arguments and bind the function to a specific object when it is called': function(){
		var fnc = Args.pass(['rocks', 'da house'], 'MooTools');
		value_of(fnc()).should_be(['MooTools', 'rocks', 'da house']);
	},

	// Function.run

	'should run the function': function(){
		var result = fn.run();
		value_of(result).should_be([]);
	},

	'should run the function with multiple arguments': function(){
		var result = fn.run(['MooTools', 'beautiful', 'elegant']);
		value_of(result).should_be(['MooTools', 'beautiful', 'elegant']);
	},

	'should run the function with multiple arguments and bind the function to an object': function(){
		var result = Args.run(['beautiful', 'elegant'], 'MooTools');
		value_of(result).should_be(['MooTools', 'beautiful', 'elegant']);
	},

	// Function.extend

	"should extend the function's properties": function(){
		var fnc = (function(){}).extend({a: 1, b: 'c'});
		value_of(fnc.a).should_be(1);
		value_of(fnc.b).should_be('c');
	},

	// Function.attempt

	'should call the function without raising an exception': function(){
		var fnc = function(){
			this_should_not_work();
		};
		fnc.attempt();
	},

	"should return the function's return value": function(){
		var fnc = $lambda('hello world!');
		value_of(fnc.attempt()).should_be('hello world!');
	},

	'should return null if the function raises an exception': function(){
		var fnc = function(){
			this_should_not_work();
		};
		value_of(fnc.attempt()).should_be_null();
	},

	// Function.delay

	'delay should return a timer pointer': function(){
		var timer = $empty.delay(10000);
		value_of(Number.type(timer)).should_be_true();
		$clear(timer);
	},

	// Function.periodical

	'periodical should return a timer pointer': function(){
		var timer = $empty.periodical(10000);
		value_of(Number.type(timer)).should_be_true();
		$clear(timer);
	}

});

})();