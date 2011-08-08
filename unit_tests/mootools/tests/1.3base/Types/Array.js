/*
---
name: Array Specs
description: n/a
requires: [Core/Array]
provides: [Array.Specs]
...
*/
(function(){
	
var getTestArray = function(){
	var a = [0, 1, 2, 3];
	delete a[1];
	delete a[2];
	return a;
};


describe("Array Methods 1.3", {

	// Array.flatten

	'should flatten a multidimensional array': function(){
		var arr = [1,2,3,[4,5,[6,7,[8]]], [[[[[9]]]]]];
		expect(arr.flatten()).toEqual([1,2,3,4,5,6,7,8,9]);
	},

	'should flatten arguments': function(){
		var test = function(){
			return Array.flatten(arguments);
		};
		expect(test(1,2,3)).toEqual([1,2,3]);
		expect(test([1,2,3])).toEqual([1,2,3]);
		expect(test(1,2,[3])).toEqual([1,2,3]);
	},

	// Array.filter

	'should filter an array': function(){
		var array = [1,2,3,0,0,0];
		var arr = array.concat([false, null, 4]).filter(Type.isNumber);
		expect(arr).toEqual(array.concat(4));
	},
	
	'filter should skip deleted elements': function(){
		var i = 0;
		getTestArray().filter(function(){
			i++;
			return true;
		});
		
		expect(i).toEqual(2);
	},

	// Array.clean

	'should clean an array from undefined and null values': function(){
		var array = [null, 1, 0, true, false, "foo", undefined];
		var arr = array.clean();
		expect(arr).toEqual([1, 0, true, false, "foo"]);
	},

	// Array.map

	'should return a mapping of an array': function(){
		var arr = [1,2,3,0,0,0].map(function(item){
			return (item + 1);
		});

		expect(arr).toEqual([2,3,4,1,1,1]);
	},

	'map should skip deleted elements': function(){
		var i = 0;
		getTestArray().map(function(){
			return i++;
		});
		
		expect(i).toEqual(2);
	},
	
	// Array.every

	'should return true if every item matches the comparator, otherwise false': function(){
		expect([1,2,3,0,0,0].every(Type.isNumber)).toBeTruthy();

		expect(['1',2,3,0].every(Type.isNumber)).toBeFalsy();
	},
	
	'every should skip deleted elements': function(){
		var i = 0;
		getTestArray().every(function(){
			i++;
			return true;
		});
		
		expect(i).toEqual(2);
	},

	// Array.some

	'should return true if some of the items in the array match the comparator, otherwise false': function(){
		expect(['1',2,3,0].some(Type.isNumber)).toBeTruthy();

		expect([1,2,3,0,0,0].map(String).some(Type.isNumber)).toBeFalsy();
	},
	
	'some should skip deleted elements': function(){
		var i = 0;
		var a = getTestArray();
		delete a[0];
		
		// skips the first three elements
		a.some(function(value, index){
			i = index;
			return true;
		});
		
		expect(i).toEqual(3);
	},

	// Array.indexOf

	'should return the index of the item': function(){
		expect([1,2,3,0,0,0].indexOf(0)).toEqual(3);
	},

	'should return -1 if the item is not found in the array': function(){
		expect([1,2,3,0,0,0].indexOf('not found')).toEqual(-1);
	},

	// Array.erase

	'should remove all items in the array that match the specified item': function(){
		var arr = [1,2,3,0,0,0].erase(0);
		expect(arr).toEqual([1,2,3]);
	},

	// Array.contains

	'should return true if the array contains the specified item': function(){
		expect([1,2,3,0,0,0].contains(0)).toBeTruthy();
	},

	'should return false if the array does not contain the specified item': function(){
		expect([0,1,2].contains('not found')).toBeFalsy();
	},

	// Array.associate

	'should associate an array with a specified array': function(){
		var obj = [1,2,3,0,0,0].associate(['a', 'b', 'c', 'd']);
		expect(obj).toEqual({a:1, b:2, c:3, d:0});
	},

	// Array.append

	'should append to an array': function(){
		var a = [1,2,4];
		var b = [2,3,4,5];
		a.append(b);
		expect(a).toEqual([1,2,4,2,3,4,5]);
		expect(b).toEqual([2,3,4,5]);
	},

	// Array.combine

	'should combine an array': function(){
		var arr = [1,2,3,4].combine([3,1,4,5,6,7]);
		expect(arr).toEqual([1,2,3,4,5,6,7]);
	},

	// Array.include

	'should include only new items': function(){
		var arr = [1,2,3,4].include(1).include(5);
		expect(arr).toEqual([1,2,3,4,5]);
	},

	// Array.getLast

	'should return the last item in the array': function(){
		expect([1,2,3,0,0,0].getLast()).toEqual(0);
		expect([3].getLast()).toEqual(3);
	},

	'should return null if there are no items': function(){
		expect([].getLast()).toEqual(null);
	},

	// Array.empty

	'should empty the array': function(){
		var arr = [1,2,3,4].empty();
		expect(arr).toEqual([]);
	}

});

describe("Array Color Methods 1.3", {

	// Array.hexToRgb

	'should return null if the length of the array is not 3': function(){
		expect([].hexToRgb()).toBeNull();
	},

	'should return a CSS rgb string': function(){
		expect(['0','0','0'].hexToRgb()).toEqual('rgb(0,0,0)');
	},

	'should support shorthand hex': function(){
		expect(['c','c','c'].hexToRgb()).toEqual('rgb(204,204,204)');
	},

	'should return an array with 16-based numbers when passed true': function(){
		expect(['ff','ff','ff'].hexToRgb(true)).toEqual([255,255,255]);
	},

	// Array.rgbToHex

	'should return null if the array does not have at least 3 times': function(){
		expect([0,1].rgbToHex()).toBeNull();
	},

	'should return a css hexadecimal string': function(){
		expect(['255', '0', '0'].rgbToHex()).toEqual('#ff0000');
		expect([0,0,255].rgbToHex()).toEqual('#0000ff');
	},

	'should return an array with hexadecimal string items': function(){
		expect([0,255,0].rgbToHex(true)).toEqual(['00', 'ff', '00']);
	},

	'should return `transparent` if the fourth item is 0 and first param is not true': function(){
		expect([0,0,0,0].rgbToHex()).toEqual('transparent');
	}

});

describe('Array.getRandom', function(){

	it('should get a random element from an array', function(){
		var a = [1];

		expect(a.getRandom()).toEqual(1);

		a.push(2);

		// Let's try a few times
		expect(a).toContain(a.getRandom());
		expect(a).toContain(a.getRandom());
		expect(a).toContain(a.getRandom());
		expect(a).toContain(a.getRandom());
	});

});

describe('Array.pick', function(){

	it('should pick a value that is not null from the array', function(){
		expect([null, undefined, true, 1].pick()).toEqual(true);
	});

	it('should return null', function(){
		expect([].pick()).toBeNull();
	});

});

})();