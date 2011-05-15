/*
Script: Function.js
	Specs for Function.js

License:
	MIT-style license.
*/

describe('Function.bind', function(){

	it('should return the function bound to an object', function(){
		var spy = jasmine.createSpy();
		var f = spy.bind('MooTools');
		expect(spy).not.toHaveBeenCalled();
		f();
		expect(spy).toHaveBeenCalledWith();
		f('foo', 'bar');
		expect(spy).toHaveBeenCalledWith('foo', 'bar');
	});

	it('should return the function bound to an object with specified argument', function(){
		var binding = {some: 'binding'};
		var spy = jasmine.createSpy().andReturn('something');
		var f = spy.bind(binding, 'arg');

		expect(spy).not.toHaveBeenCalled();
		expect(f('additional', 'arguments')).toEqual('something');
		expect(spy).toHaveBeenCalledWith('arg');
		expect(spy.mostRecentCall.object).toEqual(binding);
	});

	it('should return the function bound to an object with multiple arguments', function(){
		var binding = {some: 'binding'};
		var spy = jasmine.createSpy().andReturn('something');
		var f = spy.bind(binding, ['foo', 'bar']);

		expect(spy).not.toHaveBeenCalled();
		expect(f('additional', 'arguments')).toEqual('something');
		expect(spy).toHaveBeenCalledWith('foo', 'bar');
		expect(spy.mostRecentCall.object).toEqual(binding);
	});

});

describe('Function.pass', function(){

	it('should return a function that when called passes the specified arguments to the original function', function(){
		var spy = jasmine.createSpy().andReturn('the result');
		var fnc = spy.pass('an argument');
		expect(spy).not.toHaveBeenCalled();
		expect(fnc('additional', 'arguments')).toBe('the result');
		expect(spy).toHaveBeenCalledWith('an argument');
		expect(spy.callCount).toBe(1);
	});

	it('should pass multiple arguments and bind the function to a specific object when it is called', function(){
		var spy = jasmine.createSpy().andReturn('the result');
		var binding = {some: 'binding'};
		var fnc = spy.pass(['multiple', 'arguments'], binding);
		expect(spy).not.toHaveBeenCalled();
		expect(fnc('additional', 'arguments')).toBe('the result');
		expect(spy.mostRecentCall.object).toEqual(binding);
		expect(spy).toHaveBeenCalledWith('multiple', 'arguments');
	});

});

describe('Function.run', function(){

	it('should run the function', function(){
		var spy = jasmine.createSpy().andReturn('something');
		expect(spy.run()).toEqual('something');
		expect(spy).toHaveBeenCalledWith();
	});

	it('should run the function with a single argument', function(){
		var spy = jasmine.createSpy().andReturn('something');
		expect(spy.run('arg')).toEqual('something');
		expect(spy).toHaveBeenCalledWith('arg');
	});

	it('should run the function with multiple arguments', function(){
		var spy = jasmine.createSpy().andReturn('something');
		expect(spy.run(['foo', 'bar'])).toEqual('something');
		expect(spy).toHaveBeenCalledWith('foo', 'bar');
	});

	it('should run the function with multiple arguments and bind the function to an object', function(){
		var spy = jasmine.createSpy().andReturn('something');
		var binding = {some: 'binding'};
		expect(spy.run(['foo', 'bar'], binding)).toEqual('something');
		expect(spy).toHaveBeenCalledWith('foo', 'bar');
		expect(spy.mostRecentCall.object).toEqual(binding);
	});

});

describe('Function.extend', function(){

	it("should extend the function's properties", function(){
		var fnc = (function(){}).extend({a: 1, b: 'c'});
		expect(fnc.a).toEqual(1);
		expect(fnc.b).toEqual('c');
	});

});

describe('Function.attempt', function(){

	it('should call the function without raising an exception', function(){
		var fnc = function(){
			throw 'up';
		};
		fnc.attempt();
	});

	it("should return the function's return value", function(){
		var spy = jasmine.createSpy().andReturn('hello world!');
		expect(spy.attempt()).toEqual('hello world!');
	});

	it('should return null if the function raises an exception', function(){
		var fnc = function(){
			throw 'up';
		};
		expect(fnc.attempt()).toBeNull();
	});

});

describe('Function.delay', function(){

	it('should return a timer pointer', function(){
		var spyA = jasmine.createSpy('Alice');
		var spyB = jasmine.createSpy('Bob');

		var timerA = spyA.delay(200);
		var timerB = spyB.delay(200);

		waits(100);
		runs(function(){
			expect(spyA).not.toHaveBeenCalled();
			expect(spyB).not.toHaveBeenCalled();
			clearTimeout(timerB);
		});
		waits(250);
		runs(function(){
			expect(spyA.callCount).toBe(1);
			expect(spyB.callCount).toBe(0);
		});
	});

	it('should pass parameter 0', function(){
		var spy = jasmine.createSpy();
		spy.delay(50, null, 0);
		waits(100);
		runs(function(){
			expect(spy).toHaveBeenCalledWith(0);
		});
	});

	it('should not pass any argument when no arguments passed', function(){
		var argumentCount = null;
		var spy = function(){
			argumentCount = arguments.length;
		}
		spy.delay(50);
		waits(100);
		runs(function(){
			expect(argumentCount).toEqual(0);
		});
	});

});

describe('Function.periodical', function(){

	it('should return an interval pointer', function(){
		var spy = jasmine.createSpy('Bond');

		var interval = spy.periodical(10);
		expect(spy).not.toHaveBeenCalled();

		waits(100);
		runs(function(){
			expect(spy.callCount).toBeGreaterThan(2);
			expect(spy.callCount).toBeLessThan(15);
			clearInterval(interval);
			spy.reset();
			expect(spy).not.toHaveBeenCalled();
		});

		waits(100);
		runs(function(){
			expect(spy).not.toHaveBeenCalled();
		});
	});

	it('should pass parameter 0', function(){
		var spy = jasmine.createSpy();
		var timer = spy.periodical(10, null, 0);
		waits(100);
		runs(function(){
			expect(spy).toHaveBeenCalledWith(0);
			clearInterval(timer);
		});
	});

	it('should not pass any argument when no arguments passed', function(){
		var argumentCount = null;
		var spy = function(){
			argumentCount = arguments.length;
		}
		var timer = spy.periodical(50);
		waits(100);
		runs(function(){
			expect(argumentCount).toEqual(0);
			clearInterval(timer);
		});
	});

});
