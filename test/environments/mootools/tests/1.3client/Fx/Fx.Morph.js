/*
---
name: Fx.Morph Specs
description: n/a
requires: [Core/Fx.Morph]
provides: [Fx.Morph.Specs]
...
*/
describe('Fx.Morph', function(){
	
	beforeEach(function(){
		this.clock = sinon.useFakeTimers();
	});
	
	afterEach(function(){
		this.clock.reset();
		this.clock.restore();
	});

	it('should morph the style of an element', function(){

		var element = new Element('div', {
			styles: {
				height: 100,
				width: 100
			}
		}).inject(document.body);

		var fx = new Fx.Morph(element, {
			duration: 100
		});

		fx.start({
			height: [10, 50],
			width: [10, 50]
		});

		this.clock.tick(200);

		expect(element.getStyle('height').toInt()).toEqual(50);
		expect(element.getStyle('width').toInt()).toEqual(50);
		element.destroy();

	});

	it('should set morph options with the element getter and setter', function(){

		var element = new Element('div');

		element.set('morph', {
			duration: 100
		});

		expect(element.get('morph').options.duration).toEqual(100);

	});

});
