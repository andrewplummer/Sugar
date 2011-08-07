/*
---
name: Function Specs
description: n/a
requires: [Core/Function]
provides: [Function.Specs]
...
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
		expect(spy.mostRecentCall.object).toEqual(binding);
	});

	it('should return the function bound to an object with multiple arguments', function(){
		var binding = {some: 'binding'};
		var spy = jasmine.createSpy().andReturn('something');
		var f = spy.bind(binding, ['foo', 'bar']);

		expect(spy).not.toHaveBeenCalled();
		expect(f('additional', 'arguments')).toEqual('something');
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

/*
 * AP: Sinon is breaking on these tests. It may be incompatible with < IE8 but it also appears
 * that Mootools shadowing Object.create may also be responsible, or it could be both....
 *
describe('Function.delay', function(){
	
	beforeEach(function(){
		this.clock = sinon.useFakeTimers();
	});
	
	afterEach(function(){
		this.clock.reset();
		this.clock.restore();
	});

	it('should return a timer pointer', function(){
		var spyA = jasmine.createSpy('Alice');
		var spyB = jasmine.createSpy('Bob');

		var timerA = spyA.delay(200);
		var timerB = spyB.delay(200);

		this.clock.tick(100);

		expect(spyA).not.toHaveBeenCalled();
		expect(spyB).not.toHaveBeenCalled();
		clearTimeout(timerB);

		this.clock.tick(250);
		expect(spyA.callCount).toBe(1);
		expect(spyB.callCount).toBe(0);
	});

	it('should pass parameter 0', function(){
		var spy = jasmine.createSpy();
		spy.delay(50, null, 0);
		
		this.clock.tick(100);
		expect(spy).toHaveBeenCalledWith(0);
	});

	it('should not pass any argument when no arguments passed', function(){
		var argumentCount = null;
		var spy = function(){
			argumentCount = arguments.length;
		};
		spy.delay(50);
		this.clock.tick(100);
		expect(argumentCount).toEqual(0);
	});

});

describe('Function.periodical', function(){
	
	beforeEach(function(){
		this.clock = sinon.useFakeTimers();
	});
	
	afterEach(function(){
		this.clock.reset();
		this.clock.restore();
	});

	it('should return an interval pointer', function(){
		var spy = jasmine.createSpy('Bond');

		var interval = spy.periodical(10);
		expect(spy).not.toHaveBeenCalled();

		this.clock.tick(100);

		expect(spy.callCount).toBeGreaterThan(2);
		expect(spy.callCount).toBeLessThan(15);
		clearInterval(interval);
		spy.reset();
		expect(spy).not.toHaveBeenCalled();

		this.clock.tick(100);
		
		expect(spy).not.toHaveBeenCalled();
	});

	it('should pass parameter 0', function(){
		var spy = jasmine.createSpy();
		var timer = spy.periodical(10, null, 0);
		
		this.clock.tick(100);

		expect(spy).toHaveBeenCalledWith(0);
		clearInterval(timer);
	});

	it('should not pass any argument when no arguments passed', function(){
		var argumentCount = null;
		var spy = function(){
			argumentCount = arguments.length;
		};
		var timer = spy.periodical(50);
		this.clock.tick(100);

		expect(argumentCount).toEqual(0);
		clearInterval(timer);
	});

});

*/
