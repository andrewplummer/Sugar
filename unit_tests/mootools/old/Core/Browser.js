/*
Script: Browser.js
	Public Specs for Browser.js 1.2

License:
	MIT-style license.
*/

describe('$exec', {

	'should evaluate on global scope': function(){
		$exec.call($exec, 'var execSpec = 42');
		value_of(window.execSpec).should_be(42);
	},

	'should return the evaluated script': function(){
		value_of($exec('$empty();')).should_be('$empty();');
	}

});

describe('Document', {

	'should hold the parent window': function(){
		value_of(document.window).should_be(window);
	},

	'should hold the head element': function(){
		value_of(document.head.tagName.toLowerCase()).should_be('head');
	}

});

describe('Window', {

	'should set the Element prototype': function(){
		value_of($defined(window.Element.prototype)).should_be_true();
	}

});