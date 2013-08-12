/*
---
name: Object Specs
description: n/a
requires: [Core/Object]
provides: [Object.Specs]
...
*/
(function(){

var object = { a: 'string', b: 233, c: {} };

describe("Object Methods", {

	// Object subset

	'should return an object with only the specified keys': function(){
		expect(Object.subset(object, ['a', 'b'])).toEqual({a:'string',b:233});
	},

	'should ignore undefined keys': function(){
		var obj = {
			b: 'string',
			d: null
		};
		var subset = Object.subset(obj, ['a', 'b', 'c', 'd']);
		expect(subset).toEqual({b: 'string', d: null});
		// To equal doesn't check for undefined properties
		expect('a' in subset).toBeFalsy();
		expect('c' in subset).toBeFalsy();
	},

	// Object keyOf

	'should return the key of the value or null if not found': function(){
		expect(Object.keyOf(object, 'string')).toEqual('a');
		expect(Object.keyOf(object, 'not found')).toBeNull();
	},

	// Object.contains

	'should return true if the object contains value otherwise false': function(){
		expect(Object.contains(object, 'string')).toBeTruthy();
		expect(Object.contains(object, 'not found')).toBeFalsy();
	},

	// Object.map

	'should map a new object according to the comparator': function(){
		expect(Object.map(object, Type.isNumber)).toEqual({a:false,b:true,c:false});
	},

	// Object.filter

	'should filter the object according to the comparator': function(){
		expect(Object.filter(object, Type.isNumber)).toEqual({b:233});
	},

	// Object.every

	'should return true if every value matches the comparator, otherwise false': function(){
		expect(Object.every(object, typeOf)).toBeTruthy();
		expect(Object.every(object, Type.isNumber)).toBeFalsy();
	},

	// Object.some

	'should return true if some of the values match the comparator, otherwise false': function(){
		expect(Object.some(object, Type.isNumber)).toBeTruthy();
		expect(Object.some(object, Type.isArray)).toBeFalsy();
	},

	// Object.keys

	'keys should return an empty array': function(){
		expect(Object.keys({})).toEqual([]);
	},

	'should return an array containing the keys of the object': function(){
		expect(Object.keys(object)).toEqual(['a', 'b', 'c']);
	},

	// Object.values

	'values should return an empty array': function(){
		expect(Object.values({})).toEqual([]);
	},

	'should return an array with the values of the object': function(){
		expect(Object.values(object)).toEqual(['string', 233, {}]);
	},

	// Object.toQueryString

	'should return a query string': function(){
		var myObject = {apple: "red", lemon: "yellow"};
		expect(Object.toQueryString(myObject)).toEqual('apple=red&lemon=yellow');

		var myObject2 = {apple: ['red', 'yellow'], lemon: ['green', 'yellow']};
		expect(Object.toQueryString(myObject2)).toEqual('apple[0]=red&apple[1]=yellow&lemon[0]=green&lemon[1]=yellow');

		var myObject3 = {fruits: {apple: ['red', 'yellow'], lemon: ['green', 'yellow']}};
		expect(Object.toQueryString(myObject3)).toEqual('fruits[apple][0]=red&fruits[apple][1]=yellow&fruits[lemon][0]=green&fruits[lemon][1]=yellow');
	}

});

describe('Object.getLength', function(){

	it('should get the amount of items in an object', function(){
		var object = {
			a: [0, 1, 2],
			s: "It's-me-Valerio!",
			n: 1,
			f: 3.14,
			b: false
		};

		expect(Object.getLength(object)).toEqual(5);

		object.n = null;

		expect(Object.getLength(object)).toEqual(5);
	});

});

})();