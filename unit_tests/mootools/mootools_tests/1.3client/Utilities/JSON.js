/*
---
name: JSON Specs
description: n/a
requires: [Core/JSON]
provides: [JSON.Specs]
...
*/
describe('JSON', function(){

	it('should encode and decode an object', function(){
		var object = {
			a: [0, 1, 2],
			s: "It's-me-Valerio!",
			u: '\x01',
			n: 1,
			f: 3.14,
			b: false,
			nil: null,
			o: {
				a: 1,
				b: [1, 2],
				c: {
					a: 2,
					b: 3
				}
			}
		};

		expect(JSON.decode(JSON.encode(object))).toEqual(object);
	});

});
