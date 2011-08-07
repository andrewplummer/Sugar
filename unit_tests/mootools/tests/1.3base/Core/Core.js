/*
---
name: Core Specs
description: n/a
requires: [Core/Core]
provides: [Core.Specs]
...
*/

describe('Function.prototype.extend', {
	
	"should extend the function": function(){
		var fn = (function(){}).extend({a: 1});
		expect(fn.a).toEqual(1);
		expect((new fn).a).toEqual(undefined);
	}
	
});

describe('Function.prototype.implement', {
	
	"should implement the function prototype": function(){
		var fn = (function(){}).implement({a: 1});
		expect(fn.a).toEqual(undefined);
		expect((new fn).a).toEqual(1);
	}
	
});

describe('Function.prototype.overloadGetter', function(){

	it('should call a getter for each argument', function(){
		var object = {
			a: 1,
			b: 2,
			c: 3
		};

		var getter = (function(key){
			return object[key] || null;
		}).overloadGetter();

		expect(getter('a')).toEqual(1);
		expect(getter('b')).toEqual(2);
		expect(getter('c')).toEqual(3);
		expect(getter('d')).toBeNull();

		expect(getter('a', 'b', 'c')).toEqual(object);
		expect(getter(['a', 'b', 'c'])).toEqual(object);
		expect(getter(['a', 'c', 'd'])).toEqual({a: 1, c: 3, d: null});
	});

});

describe('typeOf', {

	"should return 'array' for Array objects": function(){
		expect(typeOf([1,2])).toEqual('array');
	},

	"should return 'string' for String objects": function(){
		expect(typeOf('ciao')).toEqual('string');
	},

	"should return 'regexp' for RegExp objects": function(){
		expect(typeOf(/_/)).toEqual('regexp');
	},

	"should return 'function' for Function objects": function(){
		expect(typeOf(function(){})).toEqual('function');
	},

	"should return 'number' for Number objects": function(){
		expect(typeOf(10)).toEqual('number');
		expect(typeOf(NaN)).not.toEqual('number');
	},

	"should return 'boolean' for Boolean objects": function(){
		expect(typeOf(true)).toEqual('boolean');
		expect(typeOf(false)).toEqual('boolean');
	},

	"should return 'object' for Object objects": function(){
		expect(typeOf({a:2})).toEqual('object');
	},

	"should return 'arguments' for Function arguments": function(){
		if (typeof window != 'undefined' && window.opera){ // Seems like the Opera guys can't decide on this
			var type = $type(arguments);
			expect(type == 'array' || type == 'arguments').toBeTruthy();
			return;
		}
		
		expect(typeOf(arguments)).toEqual('arguments');
	},

	"should return 'null' for null objects": function(){
		expect(typeOf(null)).toEqual('null');
	},

	"should return 'null' for undefined objects": function(){
		expect(typeOf(undefined)).toEqual('null');
	}

});

describe('instanceOf', {
	
	"should return false on null object": function(){
		expect(instanceOf(null, null)).toBeFalsy();
	},
	
	"should return true for Arrays": function(){
		expect(instanceOf([], Array)).toBeTruthy();
	},
	
	"should return true for Numbers": function(){
		expect(instanceOf(1, Number)).toBeTruthy();
	},
	
	"should return true for Objects": function(){
		expect(instanceOf({}, Object)).toBeTruthy();
	},
	
	"should return true for Dates": function(){
		expect(instanceOf(new Date(), Date)).toBeTruthy();
	},
	
	"should return true for Booleans": function(){
		expect(instanceOf(true, Boolean)).toBeTruthy();
	},
	
	"should return true for RegExps": function(){
		expect(instanceOf(/_/, RegExp)).toBeTruthy();
	},
	
	"should respect the parent property of a custom object": function(){
		var X = function(){};
		X.parent = Array;
		expect(instanceOf(new X, Array)).toBeTruthy();
	}
	
});

describe('Array.from', {

	'should return the same array': function(){
		var arr1 = [1,2,3];
		var arr2 = Array.from(arr1);
		expect(arr1 === arr2).toBeTruthy();
	},

	'should return an array for arguments': function(){
		var fnTest = function(){
			return Array.from(arguments);
		};
		var arr = fnTest(1,2,3);
		expect(Type.isArray(arr)).toBeTruthy();
		expect(arr.length).toEqual(3);
	},

	'should transform a non array into an array': function(){
		expect(Array.from(1)).toEqual([1]);
	},

	'should transforum an undefined or null into an empty array': function(){
		expect(Array.from(null)).toEqual([]);
		expect(Array.from(undefined)).toEqual([]);
	},

	'should ignore and return an array': function(){
		expect(Array.from([1,2,3])).toEqual([1,2,3]);
	},
	
	'should return a copy of arguments or the arguments if it is of type array': function(){
		// In Opera arguments is an array so it does not return a copy
		// This is intended. Array.from is expected to return an Array from an array-like-object
		// It does not make a copy when the passed in value is an array already
		var args, type, copy = (function(){
			type = typeOf(arguments);
			args = arguments;
			
			return Array.from(arguments);
		})(1, 2);
		
		expect((type == 'array') ? (copy === args) : (copy !== args)).toBeTruthy();
	}

});

describe('String.from', function(){

	it('should convert to type string', function(){
		expect(typeOf(String.from('string'))).toBe('string');

		expect(typeOf(String.from(1))).toBe('string');

		expect(typeOf(String.from(new Date))).toBe('string');
		
		expect(typeOf(String.from(function(){}))).toBe('string');
	});

});

describe('Function.from', {

	'if a function is passed in that function should be returned': function(){
		var fn = function(a,b){ return a; };
		expect(Function.from(fn)).toEqual(fn);
	},

	'should return a function that returns the value passed when called': function(){
		expect(Function.from('hello world!')()).toEqual('hello world!');
	}

});

describe('Number.from', {

	'should return the number representation of a string': function(){
		expect(Number.from("10")).toEqual(10);
		expect(Number.from("10px")).toEqual(10);
	},

	'should return null when it fails to return a number type': function(){
		expect(Number.from("ciao")).toBeNull();
	}

});

describe('Type', function(){

	var Instrument = new Type('Instrument', function(name){
		this.name = name;
	}).implement({

		method: function(){
			return 'playing ' + this.name;
		}

	});

	var Car = new Type('Car', function(name){
		this.name = name;
	}).implement({

		method: (function(){
			return 'driving a ' + this.name;
		}).protect()

	});

	it('should allow implementation over existing methods when a method is not protected', function(){
		Instrument.implement({
			method: function(){
				return 'playing a guitar';
			}
		});
		var myInstrument = new Instrument('Guitar');
		expect(myInstrument.method()).toEqual('playing a guitar');
	});

	it('should not override a method when it is protected', function(){
		Car.implement({
			method: function(){
				return 'hell no!';
			}
		});
		var myCar = new Car('nice car');
		expect(myCar.method()).toEqual('driving a nice car');
	});

	it('should allow generic calls', function(){
		expect(Car.method({name: 'not so nice car'})).toEqual('driving a not so nice car');
	});

	it("should be a Type", function(){
		expect(Type.isType(Instrument)).toBeTruthy();
	});
	
	it("should generate and evaluate correct types", function(){
		var myCar = new Car('nice car');
		expect(Type.isCar(myCar)).toBeTruthy();
	});
	
	it("isEnumerable method on Type should return true for arrays, arguments, objects with a numerical length property", function(){
		expect(Type.isEnumerable([1,2,3])).toBeTruthy();
		(function(){
			expect(Type.isEnumerable(arguments)).toBeTruthy();
		})(1,2,3);
		expect(Type.isEnumerable({length: 2})).toBeTruthy();
	});

	it('sould chain any function on a type', function(){
		var MyType = new Type('MyType', function(){}.implement({
			a: function(){}
		}));

		expect(MyType.alias('a', 'b').implement({
			method: function(){}
		}).extend({
			staticMethod: function(){}
		})).toBe(MyType);
	});

});

describe('Function.attempt', {

	'should return the result of the first successful function without executing successive functions': function(){
		var calls = 0;
		var attempt = Function.attempt(function(){
			calls++;
			throw new Exception();
		}, function(){
			calls++;
			return 'success';
		}, function(){
			calls++;
			return 'moo';
		});
		expect(calls).toEqual(2);
		expect(attempt).toEqual('success');
	},

	'should return null when no function succeeded': function(){
		var calls = 0;
		var attempt = Function.attempt(function(){
			calls++;
			return I_invented_this();
		}, function(){
			calls++;
			return uninstall_ie();
		});
		expect(calls).toEqual(2);
		expect(attempt).toBeNull();
	}

});

describe('Object.each', {

	'should call the function for each item in the object': function(){
		var daysObj = {};
		Object.each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
			daysObj[key] = value;
		});

		expect(daysObj).toEqual({first: 'Sunday', second: 'Monday', third: 'Tuesday'});
	}

});

describe('Array.each', {

	'should call the function for each item in Function arguments': function(){
		var daysArr = [];
		(function(){
			Array.each(Array.from(arguments), function(value, key){
				daysArr[key] = value;
			});
		})('Sun','Mon','Tue');

		expect(daysArr).toEqual(['Sun','Mon','Tue']);
	},

	'should call the function for each item in the array': function(){
		var daysArr = [];
		Array.each(['Sun','Mon','Tue'], function(value, i){
			daysArr.push(value);
		});
	
		expect(daysArr).toEqual(['Sun','Mon','Tue']);
	},

	'should not iterate over deleted elements': function(){
		var array = [0, 1, 2, 3],
			testArray = [];
		delete array[1];
		delete array[2];

		array.each(function(value){
			testArray.push(value);
		});

		expect(testArray).toEqual([0, 3]);
	}
	
});

describe('Array.clone', {
	'should recursively clone and dereference arrays and objects, while mantaining the primitive values': function(){
		var a = [1,2,3, [1,2,3, {a: [1,2,3]}]];
		var b = Array.clone(a);
		expect(a === b).toBeFalsy();
		expect(a[3] === b[3]).toBeFalsy();
		expect(a[3][3] === b[3][3]).toBeFalsy();
		expect(a[3][3].a === b[3][3].a).toBeFalsy();
		
		expect(a[3]).toEqual(b[3]);
		expect(a[3][3]).toEqual(b[3][3]);
		expect(a[3][3].a).toEqual(b[3][3].a);
	}
});

describe('Object.clone', {
	'should recursively clone and dereference arrays and objects, while mantaining the primitive values': function(){
		var a = {a:[1,2,3, [1,2,3, {a: [1,2,3]}]]};
		var b = Object.clone(a);
		expect(a === b).toBeFalsy();
		expect(a.a[3] === b.a[3]).toBeFalsy();
		expect(a.a[3][3] === b.a[3][3]).toBeFalsy();
		expect(a.a[3][3].a === b.a[3][3].a).toBeFalsy();
		
		expect(a.a[3]).toEqual(b.a[3]);
		expect(a.a[3][3]).toEqual(b.a[3][3]);
		expect(a.a[3][3].a).toEqual(b.a[3][3].a);
	}
});

describe('Object.merge', {
	
	'should merge any object inside the passed in object, and should return the passed in object': function(){
		var a = {a:1, b:2, c: {a:1, b:2, c:3}};
		var b = {c: {d:4}, d:4};
		var c = {a: 5, c: {a:5}};
		
		var merger = Object.merge(a, b);
		
		expect(merger).toEqual({a:1, b:2, c:{a:1, b:2, c:3, d:4}, d:4});
		expect(merger === a).toBeTruthy();
		
		expect(Object.merge(a, b, c)).toEqual({a:5, b:2, c:{a:5, b:2, c:3, d:4}, d:4});
	},
	
	'should recursively clone sub objects and sub-arrays': function(){
		var a = {a:1, b:2, c: {a:1, b:2, c:3}, d: [1,2,3]};
		var b = {e: {a:1}, f: [1,2,3]};
		
		var merger = Object.merge(a, b);
		
		expect(a.e === b.e).toBeFalsy();
		expect(a.f === b.f).toBeFalsy();
	}
	
});

describe('Object.append', {
	'should combine two objects': function(){
		var a = {a: 1, b: 2}, b = {b: 3, c: 4};
		expect(Object.append(a, b)).toEqual({a: 1, b: 3, c: 4});
		
		a = {a: 1, b: 2}; b = {b: 3, c: 4};
		expect(Object.append(a, b)).toEqual(a);
		
		a = {a: 1, b: 2}; b = {b: 3, c: 4};
		var c = {a: 2, d: 5};
		expect(Object.append(a, b, c)).toEqual({a: 2, b: 3, c: 4, d: 5});
	}
});

describe('Date.now', {

	'should return a timestamp': function(){
		expect(Type.isNumber(Date.now())).toBeTruthy();
	}

});

describe('String.uniqueID', function(){

	it('should be a string', function(){
		expect(typeof String.uniqueID()).toBe('string');
	});

	it("should generate unique ids", function(){
		expect(String.uniqueID()).not.toEqual(String.uniqueID());
	});
	
});
