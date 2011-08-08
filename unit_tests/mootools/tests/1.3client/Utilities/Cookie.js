/*
---
name: Cookie Specs
description: n/a
requires: [Core/Cookie]
provides: [Cookie.Specs]
...
*/
describe('Cookie', function(){

	it('should read and write a cookie', function(){
		var options = {
			duration: 1
		};
		
		Cookie.write('key', 'value', options);

		expect(Cookie.read('key', options)).toBe('value');

		Cookie.dispose('key', options);

		expect(Cookie.read('key', options)).toBeNull();
	});

});