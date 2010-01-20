/*
Script: Class.Extras.js
	Public specs for Class.Extras.js

License:
	MIT-style license.
*/


test("callChain should not fail when nothing was added to the chain", function(){

		var chain = new Local.Chain();
		var arr = [];
		chain.chain(function(a, b){
			var str = "0" + b + a;
			arr.push(str);
			return str;
		});
		chain.chain(function(a, b){
			var str = "1" + b + a;
			arr.push(str);
			return str;
		});
		var ret;
		value_of(arr).should_be([]);
		ret = chain.callChain("a", "A");
		value_of(ret).should_be("0Aa");
		value_of(arr).should_be(["0Aa"]);

		ret = chain.callChain("b", "B");
		value_of(ret).should_be("1Bb");
		value_of(arr).should_be(["0Aa", "1Bb"]);

		ret = chain.callChain();
		value_of(ret).should_be(false);
		value_of(arr).should_be(["0Aa", "1Bb"]);
	});

