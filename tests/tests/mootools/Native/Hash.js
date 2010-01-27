/*
Script: Hash.js
	Specs for Hash.js

License:
	MIT-style license.
*/

(function(){

var hash2 = new Hash({ a: 'string', b: 233, c: {} });

describe("Hash Methods", {

	// Hash.constructor

	'should return a new hash': function(){
		value_of(Hash.type(new Hash())).should_be_true();
	},

	'should return a copy of a hash': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		var copy = new Hash(hash);
		value_of(copy !== hash).should_be_true();
		value_of(copy).should_be(hash);
	},

	// Hash.erase

	'should remove a key and its value from the hash': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.erase('a')).should_be(new Hash({b:2,c:3}));
		value_of(hash.erase('d')).should_be(new Hash({b:2,c:3}));

		hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.erase('a')).should_be(new Hash({b:2,c:3}));
		value_of(hash.erase('d')).should_be(new Hash({b:2,c:3}));
	},

	// Hash.get

	'should return the value corresponding to the specified key otherwise null': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.get('c')).should_be(3);
		value_of(hash.get('d')).should_be_null();
	},

	// Hash.set

	'should set the key with the corresponding value': function(){
		var myHash = new Hash({a: 1, b: 2, c: 3}).set('c', 7).set('d', 8);
		value_of(myHash).should_be(new Hash({a:1,b:2,c:7,d:8}));
	},

	// Hash.empty

	'should empty the hash': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.empty()).should_be(new Hash());
	},

	// Hash.include

	'should include a key value if the hash does not have the key otherwise ignore': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.include('e', 7)).should_be(new Hash({a:1,b:2,c:3,e:7}));
		value_of(hash.include('a', 7)).should_be(new Hash({a:1,b:2,c:3,e:7}));
	},

	// Hash.keyOf | Hash.indexOf

	'should return the key of the value or null if not found': function(){
		var hash = new Hash({a: 1, b: 2, c: 3, d: 1});
		value_of(hash.keyOf(1)).should_be('a');
		value_of(hash.keyOf('not found')).should_be_null();

		value_of(hash.indexOf(1)).should_be('a');
		value_of(hash.indexOf('not found')).should_be_null();
	},

	// Hash.has

	'should return true if the hash has the key otherwise false': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.has('a')).should_be_true();
		value_of(hash.has('d')).should_be_false();
	},

	// Hash.hasValue | Hash.contains

	'should return true if the hash hasValue otherwise false': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.hasValue(1)).should_be_true();
		value_of(hash.hasValue('not found')).should_be_false();

		value_of(hash.contains(1)).should_be_true();
		value_of(hash.contains('not found')).should_be_false();
	},

	// Hash.getClean

	'should getClean JavaScript object': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.getClean()).should_be({a:1,b:2,c:3});
	},

	// Hash.extend

	'should extend a Hash with an object': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.extend({a:4,d:7,e:8})).should_be(new Hash({a:4,b:2,c:3,d:7,e:8}));
	},

	'should extend a Hash with another Hash': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.extend(new Hash({a:4,d:7,e:8}))).should_be(new Hash({a:4,b:2,c:3,d:7,e:8}));
	},

	// Hash.combine

	'should merge a Hash with an object': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.combine({a:4,d:7,e:8})).should_be(new Hash({a:1,b:2,c:3,d:7,e:8}));
	},

	'should merge a Hash with another Hash': function(){
		var hash = new Hash({a: 1, b: 2, c: 3});
		value_of(hash.combine(new Hash({a:4,d:7,e:8}))).should_be(new Hash({a:1,b:2,c:3,d:7,e:8}));
	},

	// Hash.each

	'should iterate through each property': function(){
		var newHash = new Hash();
		var hash = new Hash({a: 1, b: 2, c: 3});
		hash.each(function(value, key){
			newHash.set(key, value);
		});
		value_of(newHash).should_be(hash);
	},

	// Hash.map

	'should map a new Hash according to the comparator': function(){
		value_of(hash2.map(Number.type)).should_be(new Hash({a:false,b:true,c:false}));
	},

	// Hash.filter

	'should filter the Hash according to the comparator': function(){
		value_of(hash2.filter(Number.type)).should_be(new Hash({b:233}));
	},

	// Hash.every

	'should return true if every value matches the comparator, otherwise false': function(){
		value_of(hash2.every($defined)).should_be_true();
		value_of(hash2.every(Number.type)).should_be_false();
	},

	// Hash.some

	'should return true if some of the values match the comparator, otherwise false': function(){
		value_of(hash2.some(Number.type)).should_be_true();
		value_of(hash2.some(Array.type)).should_be_false();
	},

	// Hash.getKeys

	'getKeys should return an empty array': function(){
		value_of(new Hash().getKeys()).should_be([]);
	},

	'should return an array containing the keys of the hash': function(){
		value_of(hash2.getKeys()).should_be(['a', 'b', 'c']);
	},

	// Hash.getValues

	'getValues should return an empty array': function(){
		value_of(new Hash().getValues()).should_be([]);
	},

	'should return an array with the values of the hash': function(){
		value_of(hash2.getValues()).should_be(['string', 233, {}]);
	},

	// Hash.toQueryString

	'should return a query string': function(){
		var myHash = new Hash({apple: "red", lemon: "yellow"});
		value_of(myHash.toQueryString()).should_be('apple=red&lemon=yellow');

		var myHash2 = new Hash({apple: ['red', 'yellow'], lemon: ['green', 'yellow']});
		value_of(myHash2.toQueryString()).should_be('apple[0]=red&apple[1]=yellow&lemon[0]=green&lemon[1]=yellow');

		var myHash3 = new Hash({fruits: {apple: ['red', 'yellow'], lemon: ['green', 'yellow']}});
		value_of(myHash3.toQueryString()).should_be('fruits[apple][0]=red&fruits[apple][1]=yellow&fruits[lemon][0]=green&fruits[lemon][1]=yellow');
	}

});

})();