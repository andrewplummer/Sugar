/*
---
name: Object Specs
description: n/a
requires: [Core/Object]
provides: [Object.Specs]
...
*/

(function(){

describe('Object hasOwnProperty', function(){

	it('should not fail on window', function(){
		expect(function(){
			var fn = function(){};
			Object.each(window, fn);
			Object.keys(window);
			Object.values(window);
			Object.map(window, fn);
			Object.every(window, fn);
			Object.some(window, fn);
			Object.keyOf(window, document);
		}).not.toThrow();
	});

});

})();
