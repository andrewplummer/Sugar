/*
---
name: Element.Dimensions Specs
description: n/a
requires: [Core/Element.Dimensions]
provides: [Element.Dimensions.Specs]
...
*/
describe('Element.getOffsetParent', function(){

	var container, offsetParent, wrapper, child, table, td;

	beforeEach(function(){
		container = new Element('div');

		offsetParent = new Element('div', {
			styles: {position: 'relative'}
		}).inject(container);

		wrapper = new Element('div', {
			styles: {height: 0}
		}).inject(offsetParent);

		child = new Element('div').inject(wrapper);

		table = new Element('table').inject(offsetParent);

		td = new Element('td').inject(new Element('tr').inject(table));

		container.inject(document.body);
		
	});

	it('Should return the right offsetParent', function(){

		expect(child.getOffsetParent()).toEqual(offsetParent);

	});

	it('Should return body for elements with body as offsetParent', function(){

		expect(offsetParent.getOffsetParent()).toEqual(document.body);

	});

	it('Should return a table element for td-elements', function(){

		expect(td.getOffsetParent()).toEqual(table);

	});

	it('Should return a td element for elements with position:static inside a td', function(){

		child.inject(td);

		expect(child.getOffsetParent()).toEqual(td);

	});

	it('Should not return a td element for elements with a position other than static inside a td', function(){

		child.setStyle('position', 'absolute');

		expect(child.getOffsetParent()).toEqual(offsetParent);

	});

	it('Should return null for elements with position:fixed', function(){

		table.setStyle('position', 'fixed');

		expect(table.getOffsetParent()).toBeNull();

	});

	it('Should return null for the body element', function(){

		expect($(document.body).getOffsetParent()).toBeNull();

	});

	afterEach(function(){
		container.destroy();
	});

});
