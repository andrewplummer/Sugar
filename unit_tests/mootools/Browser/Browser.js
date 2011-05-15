/*
Script: Browser.js
	Public Specs for Browser.js 1.3

License:
	MIT-style license.
*/

describe('Browser', {

	'should think it is executed in a browser': function(){
		expect(Browser.ie || Browser.safari || Browser.chrome || Browser.firefox || Browser.opera).toEqual(true);
	},
	
	'should assume the IE version is emulated by the documentMode (X-UA-Compatible)': function(){
		if (Browser.ie && document.documentMode) expect(Browser.version).toEqual(document.documentMode);
	}

});