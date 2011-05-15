/*
Script: Number.js
	Specs for Number.js

License:
	MIT-style license.
*/

describe("Number Methods", {

	// Number.toInt

	'should convert a number to an integer': function(){
		value_of((111).toInt()).should_be(111);
	},

	'should convert a number depending on the radix provided': function(){
		value_of((111).toInt(2)).should_be(7);
		value_of((0x16).toInt(10)).should_be(22); //ECMA standard, radix is optional so if starts with 0x then parsed as hexadecimal
		value_of((016).toInt(10)).should_be(14); //ECMA standard, radix is optional so if starts with 0 then parsed as octal
	},

	// Number.toFloat

	'should convert a number to a float': function(){
		value_of((1.00).toFloat()).should_be(1);
		value_of((1.12 - 0.12).toFloat()).should_be(1);
		value_of((0.0010).toFloat()).should_be(0.001);
		value_of((Number.MIN_VALUE).toFloat()).should_be(Number.MIN_VALUE);
	},

	// Number.limit

	'should limit a number within a range': function(){
		value_of((-1).limit(0, 1)).should_be(0);
		value_of((3).limit(1, 2)).should_be(2);
	},

	'should not limit a number if within the range': function(){
		value_of((2).limit(0,4)).should_be(2);
	},

	// Number.round

	'should round a number to the nearest whole number if units place is not specified': function(){
		value_of((0.01).round()).should_be(0);
	},

	'should round a number according the units place specified': function(){
		value_of((0.01).round(2)).should_be(0.01);
		value_of((1).round(3)).should_be(1);
		value_of((-1.01).round()).should_be(-1);
		value_of((-1.01).round(2)).should_be(-1.01);
		value_of((111).round(-1)).should_be(110);
		value_of((-111).round(-2)).should_be(-100);
		value_of((100).round(-5)).should_be(0);
	},

	// Number.times

	'should call the function for the specified number of times': function(){
		var found = 0;
		(3).times(function(i){
			found = i;
		});

		var found2 = -1;
		(0).times(function(i){
			found2 = i;
		});

		value_of(found).should_be(2);
		value_of(found2).should_be(-1);
	},

	'should bind and call the function for the specified number of times': function(){
		var aTest = 'hi';
		var found3 = false;
		(1).times(function(i){
			found3 = (this == aTest);
		}, aTest);
		value_of(found3).should_be_true();
	}

});

(function(math){
	var examples = {};
	new Hash(math).each(function(value, key){
		var example = {};
		var b = value.test[1];
		examples['should return the ' + value.title + ' value of the number' + ((b) ? ' and the passed number' : '')] = function(){
			value_of(value.test[0][key](b)).should_be(Math[key].apply(null, value.test));
		};
	});
	describe("Number Math Methods", examples);
})({
	abs: { test: [-1], title: 'absolute' },
	acos: { test: [0], title: 'arc cosine' },
	asin: { test: [0.5], title: 'arc sine' },
	atan: { test: [0.5], title: 'arc tangent' },
	atan2: { test: [0.1, 0.5], title: 'arc tangent' },
	ceil: { test: [0.6], title: 'number closest to and not less than the' },
	cos: { test: [30], title: 'cosine' },
	exp: { test: [2], title: 'exponent' },
	floor: { test: [2.4], title: 'integer closet to and not greater than' },
	log: { test: [2], title: 'log' },
	max: { test: [5, 3], title: 'maximum' },
	min: { test: [-4, 2], title: 'minimum' },
	pow: { test: [2, 2], title: 'power' },
	sin: { test: [0.5], title: 'sine' },
	sqrt: { test: [4], title: 'square root' },
	tan: { test: [0.3], title: 'tangent' }
});