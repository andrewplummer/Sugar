/*
Script: Core.js
	Public Specs for Core.js 1.2

License:
	MIT-style license.
*/

describe('$A', {

	'should return a copy for an array': function(){
		var arr1 = [1,2,3];
		var arr2 = $A(arr1);
		value_of(arr1 !== arr2).should_be_true();
	},

	'should return an array for an Elements collection': function(){
		var div1 = document.createElement('div');
		var div2 = document.createElement('div');
		var div3 = document.createElement('div');

		div1.appendChild(div2);
		div1.appendChild(div3);

		var array = $A(div1.getElementsByTagName('*'));
		value_of(Array.type(array)).should_be_true();
	},

	'should return an array for arguments': function(){
		var fnTest = function(){
			return $A(arguments);
		};
		var arr = fnTest(1,2,3);
		value_of(Array.type(arr)).should_be_true();
		value_of(arr).should_have(3, 'items');
	}

});

describe('$arguments', {

	'should return the argument passed according to the index': function(){
		value_of($arguments(0)('a','b','c','d')).should_be('a');
		value_of($arguments(1)('a','b','c','d')).should_be('b');
		value_of($arguments(2)('a','b','c','d')).should_be('c');
		value_of($arguments(3)('a','b','c','d')).should_be('d');
	}

});

describe('$chk', {

	'should return false on false': function(){
		value_of($chk(false)).should_be_false();
	},

	'should return false on null': function(){
		value_of($chk(null)).should_be_false();
	},

	'should return false on undefined': function(){
		value_of($chk(undefined)).should_be_false();
	},

	'should return true on 0': function(){
		value_of($chk(0)).should_be_true();
	},

	'should return true for any truthsie': function(){
		value_of($chk(1)).should_be_true();
		value_of($chk({})).should_be_true();
		value_of($chk(true)).should_be_true();
	}

});

describe('$clear', {

	'should clear timeouts': function(){
		var timeout = setTimeout(function(){}, 100);
		value_of($clear(timeout)).should_be_null();
	},

	'should clear intervals': function(){
		var interval = setInterval(function(){}, 100);
		value_of($clear(interval)).should_be_null();
	}

});

describe('$defined', {

	'should return true on 0': function(){
		value_of($defined(0)).should_be_true();
	},

	'should return true on false': function(){
		value_of($defined(false)).should_be_true();
	},

	'should return false on null': function(){
		value_of($defined(null)).should_be_false();
	},

	'should return false on undefined': function(){
		value_of($defined(undefined)).should_be_false();
	}

});

describe('$each', {

	'should call the function for each item in Function arguments': function(){
		var daysArr = [];
		(function(){
			$each(arguments, function(value, key){
				daysArr[key] = value;
			});
		})('Sun','Mon','Tue');

		value_of(daysArr).should_be(['Sun','Mon','Tue']);
	},

	'should call the function for each item in the array': function(){
		var daysArr = [];
		$each(['Sun','Mon','Tue'], function(value, key){
			daysArr[key] = value;
		});

		value_of(daysArr).should_be(['Sun','Mon','Tue']);
	},

	'should call the function for each item in the object': function(){
		var daysObj = {};
		$each({first: "Sunday", second: "Monday", third: "Tuesday"}, function(value, key){
			daysObj[key] = value;
		});

		value_of(daysObj).should_be({first: 'Sunday', second: 'Monday', third: 'Tuesday'});
	}

});

describe('$extend', {

	'should extend two objects': function(){
		var obj1 = {a: 1, b: 2};
		var obj2 = {b: 3, c: 4};
		$extend(obj1, obj2);
		value_of(obj1).should_be({a: 1, b: 3, c: 4});
	},

	'should overwrite properties': function(){
		var obj1 = {a: 1, b: 2};
		var obj2 = {b: 3, c: 4, a: 5};
		$extend(obj1, obj2);
		value_of(obj1).should_be({a: 5, b: 3, c: 4});
	},

	'should not extend with null argument': function(){
		var obj1 = {a: 1, b: 2};
		$extend(obj1);
		value_of(obj1).should_be({a: 1, b: 2});
	}

});

describe('$lambda', {

	'if a function is passed in that function should be returned': function(){
		var fn = function(a,b){ return a; };
		value_of($lambda(fn)).should_be(fn);
	},

	'should return a function that returns the value passed when called': function(){
		value_of($lambda('hello world!')()).should_be('hello world!');
	}

});

describe('$merge', {

	'should dereference objects': function(){
		var obj1 = {a: 1, b: 2};
		var obj2 = $merge(obj1);
		value_of(obj1 === obj2).should_be_false();
	},

	'should merge any arbitrary number of nested objects': function(){
		var obj1 = {a: {a: 1, b: 2, c: 3}, b: 2};
		var obj2 = {a: {a: 2, b: 8, c: 3, d: 8}, b: 3, c: 4};
		var obj3 = {a: {a: 3}, b: 3, c: false};
		value_of($merge(obj1, obj2, obj3)).should_be({a: {a: 3, b: 8, c: 3, d: 8}, b: 3, c: false});
	}

});

describe('$pick', {

	'should return the first false argument': function(){
		var picked1 = $pick(null, undefined, false, [1,2,3], {});
		value_of(picked1).should_be_false();
	},

	'should return the first defined argument': function(){
		var picked1 = $pick(null, undefined, null, [1,2,3], {});
		value_of(picked1).should_be([1,2,3]);
	}

});

describe('$random', {

	'should return a number between two numbers specified': function(){
		var rand = $random(1, 3);
		value_of((rand <= 3 && rand >= 1)).should_be_true();
	}

});

describe('$splat', {

	'should transform a non array into an array': function(){
		value_of($splat(1)).should_be([1]);
	},

	'should transforum an undefined or null into an empty array': function(){
		value_of($splat(null)).should_be([]);
		value_of($splat(undefined)).should_be([]);
	},

	'should ignore and return an array': function(){
		value_of($splat([1,2,3])).should_be([1,2,3]);
	}

});

describe('$time', {

	'should return a timestamp': function(){
		value_of(Number.type($time())).should_be_true();
	},
	
	'should be within a reasonable range': function(){
		value_of($time() < 1e13 && $time() > 1e12).should_be_true();
	}

});

describe('$try', {

	'should return the result of the first successful function without executing successive functions': function(){
		var calls = 0;
		var attempt = $try(function(){
			calls++;
			throw new Exception();
		}, function(){
			calls++;
			return 'success';
		}, function(){
			calls++;
			return 'moo';
		});
		value_of(calls).should_be(2);
		value_of(attempt).should_be('success');
	},

	'should return null when no function succeeded': function(){
		var calls = 0;
		var attempt = $try(function(){
			calls++;
			return I_invented_this();
		}, function(){
			calls++;
			return uninstall_ie();
		});
		value_of(calls).should_be(2);
		value_of(attempt).should_be_null();
	}

});

describe('$type', {

	"should return 'array' for Array objects": function(){
		value_of($type([1,2])).should_be('array');
	},

	"should return 'string' for String objects": function(){
		value_of($type('ciao')).should_be('string');
	},

	"should return 'regexp' for RegExp objects": function(){
		value_of($type(/_/)).should_be('regexp');
	},

	"should return 'function' for Function objects": function(){
		value_of($type(function(){})).should_be('function');
	},

	"should return 'number' for Number objects": function(){
		value_of($type(10)).should_be('number');
		value_of($type(NaN)).should_not_be('number');
	},

	"should return 'boolean' for Boolean objects": function(){
		value_of($type(true)).should_be('boolean');
		value_of($type(false)).should_be('boolean');
	},

	"should return 'object' for Object objects": function(){
		value_of($type({a:2})).should_be('object');
	},

	"should return 'arguments' for Function arguments": function(){
		value_of($type(arguments)).should_be((window.opera) ? 'array' : 'arguments'); //opera's arguments behave like arrays--which is actually better.
	},

	"should return false for null objects": function(){
		value_of($type(null)).should_be_false();
	},

	"should return false for undefined objects": function(){
		value_of($type(undefined)).should_be_false();
	},

	"should return 'collection' for HTMLElements collections": function(){
		value_of($type(document.getElementsByTagName('*'))).should_be('collection');
	},

	"should return 'element' for an Element": function(){
		var div = document.createElement('div');
		value_of($type(div)).should_be('element');
	},
	
	"should return 'window' for the window object": function(){
		value_of($type(window)).should_be('window');
	},

	"should return 'document' for the document object": function(){
		value_of($type(document)).should_be('document');
	}

});

describe('$unlink', {

	"should unlink an object recursivly": function(){
		var inner = {b: 2};
		var obj = {a: 1, inner: inner};
		var copy = $unlink(obj);
		obj.a = 10;
		inner.b = 20;

		value_of(obj.a).should_be(10);
		value_of(obj.inner.b).should_be(20);
		value_of($type(obj)).should_be('object');

		value_of(copy.a).should_be(1);
		value_of(copy.inner.b).should_be(2);
		value_of($type(copy)).should_be('object');
	},

	"should unlink an Hash": function(){
		var hash = new Hash({a: 'one'});
		var copy = $unlink(hash);

		value_of($type(hash)).should_be('hash');
		value_of($type(copy)).should_be('hash');

		copy.set('a', 'two');

		value_of(hash.get('a')).should_be('one');
		value_of(copy.get('a')).should_be('two');
	}

});

describe('Hash.getLength', {

	"should return the number of items in it": function(){
		var hash = new Hash({});
		value_of(hash.getLength()).should_be(0);
		hash.set('mootools', 'awesome');
		hash.milk = 'yummy';
		value_of(hash.getLength()).should_be(2);
	},

	"should not fail when length is set": function(){
		var hash = new Hash({'length': 10});
		value_of(hash.getLength()).should_be(1);
	},

	"should work as a generic on objects": function(){
		value_of(Hash.getLength({})).should_be(0);
		value_of(Hash.getLength({'': '', '0': '0', 'length': 99})).should_be(3);
	}

});

describe('$H', {

	"should create a new hash": function(){
		var hash = $H({});
		value_of($type(hash)).should_be('hash');
	}

});
