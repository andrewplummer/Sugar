describe('Element.set opacity', function(){

	it('should return the opacity of an Element without seting it before', function(){
		var div = new Element('div');
		if (document.html.style.opacity == null) div.style.filter = 'alpha(opacity=40)';
		else div.style.opacity = 0.4;
		expect(div.get('opacity') == 0.4).toBeTruthy();
	});

});
