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

});
