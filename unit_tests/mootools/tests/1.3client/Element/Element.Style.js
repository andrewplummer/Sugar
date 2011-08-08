/*
---
name: Element.Style Specs
description: n/a
requires: [Core/Element.Style]
provides: [Element.Style.Specs]
...
*/
describe('Element.set opacity', function(){

	it('should return the opacity of an Element without seting it before', function(){
		var div = new Element('div');
		if (document.html.style.opacity == null) div.style.filter = 'alpha(opacity=40)';
		else div.style.opacity = 0.4;
		expect(div.get('opacity') == 0.4).toBeTruthy();
	});

	it('should not remove existent filters on browsers with filters', function(){
		var div = new Element('div');
		if (document.html.style.filter != null && !window.opera && !Syn.browser.gecko){
			div.style.filter = 'blur(strength=50)';
			div.set('opacity', 0.4);
			expect(div.style.filter).toMatch(/blur\(strength=50\)/i);
		}
	});

	it('should handle very small numbers with scientific notation like 1.1e-20 with opacity', function(){
		var div = new Element('div');
		div.set('opacity', 1e-20);
		div.set('opacity', 0.5);
		expect(+div.get('opacity')).toEqual(0.5);
		if (document.html.style.filter != null && !window.opera && !Syn.browser.gecko){
			expect(div.style.filter.split('opacity').length - 1).toEqual(1);
		}
	});

});
