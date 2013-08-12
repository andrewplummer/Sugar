/*
---
name: Browser Specs
description: n/a
requires: [Core/Browser]
provides: [Browser.Specs]
...
*/

describe('Browser', {

	'should think it is executed in a browser': function(){
		expect(Browser.ie || Browser.safari || Browser.chrome || Browser.firefox || Browser.opera).toEqual(true);
	},
	
	'should assume the IE version is emulated by the documentMode (X-UA-Compatible)': function(){
		if (Browser.ie && document.documentMode) expect(Browser.version).toEqual(document.documentMode);
	}

});