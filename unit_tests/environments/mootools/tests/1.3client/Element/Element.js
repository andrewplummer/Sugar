/*
---
name: Element Specs
description: n/a
requires: [Core/Element]
provides: [Element.Specs]
...
*/

describe('document.id', function(){

	it('should find IDs with special characters', function(){
		var element = new Element('div#id\\.part.class').inject(document.body);

		var found = document.id('id.part');
		expect(found).toBe(element);
		expect(found.id).toBe('id.part');
		expect(found.className).toBe('class');

		element.destroy();

		element = new Element('div#id\\#part').inject(document.body);

		found = document.id('id#part');
		expect(found).toBe(element);
		expect(found.id).toBe('id#part');
	});

});

describe('Element.getElementById', function(){

	it('should find IDs with special characters', function(){
		var inner = new Element('div#id\\.part');
		var outer = new Element('div').adopt(inner);

		expect(outer.getElementById('id.part')).toBe(inner);
		expect(inner.id).toBe('id.part');
	});

});

describe('Element.removeProperty', function(){

	it('should removeProperty from an Element', function (){
		var readonly = new Element('input', { type: 'text', readonly: 'readonly', maxlenght: 10 });
		readonly.removeProperty('readonly');
		readonly.removeProperty('maxlength');
		var props = readonly.getProperties('type', 'readonly');
		expect(props).toEqual({type: 'text', readonly: false});

		var maxlength = readonly.getProperty('maxlength');
		expect(!maxlength || maxlength == 2147483647).toBeTruthy(); // ie6/7 Bug
	});

});

describe('Element.toQueryString', function(){

	it("should return a query string from the Element's form Elements", function(){
		var form = new Element('form', { 'html': '' +
			'<input type="checkbox" name="input" value="checked" checked="checked" />' +
			'<select name="select[]" multiple="multiple" size="5">' +
				'<option name="none" value="">--</option>' +
				'<option name="volvo" value="volvo">Volvo</option>' +
				'<option name="saab" value="saab" selected="selected">Saab</option>' +
				'<option name="opel" value="opel" selected="selected">Opel</option>' +
				'<option name="bmw" value="bmw">BMW</option>' +
			'</select>' +
			'<textarea name="textarea">textarea-value</textarea>'
		});
		expect(form.toQueryString()).toEqual('input=checked&select%5B%5D=saab&select%5B%5D=opel&textarea=textarea-value');
	});

	it("should return a query string containing even empty values, single select must have a selected option", function() {
		var form = new Element('form').adopt(
			new Element('input', {name: 'input', type: 'checkbox', checked: true, value: ''}),
			new Element('select', {name: 'select[]'}).adopt(
				new Element('option', {name: 'none', value: '', html: '--', selected: true}),
				new Element('option', {name: 'volvo', value: 'volvo', html: 'Volvo'}),
				new Element('option', {name: 'saab', value: 'saab', html: 'Saab'}),
				new Element('option', {name: 'opel', value: 'opel', html: 'Opel'}),
				new Element('option', {name: 'bmw', value: 'bmw', html: 'BMW'})
			),
			new Element('textarea', {name: 'textarea', value: ''})
		);
		expect(form.toQueryString()).toEqual('input=&select%5B%5D=&textarea=');
		expect(form.getElementsByTagName('select')[0].selectedIndex).toEqual(0);
	});

});

describe('Element.clone', function(){

	it('should clone children of object elements', function(){
		var div = new Element('div').set('html', '<div id="swfobject-video" class="video">' +
			'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="425" height="344">' +
				'<param name="movie" value="http://www.youtube.com/v/6nOVQDMOvvE&amp;rel=0&amp;color1=0xb1b1b1&amp;color2=0xcfcfcf&amp;hl=en_US&amp;feature=player_embedded&amp;fs=1" />' +
				'<param name="wmode" value="opaque" />' +
				'<param name="quality" value="high" />' +
				'<param name="bgcolor" value="#000616" />' +
				'<param name="allowFullScreen" value="true" />' +
				'<!--[if !IE]>-->' +
				'<object type="application/x-shockwave-flash" data="http://www.youtube.com/v/6nOVQDMOvvE&amp;rel=0&amp;color1=0xb1b1b1&amp;color2=0xcfcfcf&amp;hl=en_US&amp;feature=player_embedded&amp;fs=1" width="425" height="344">' +
				'<param name="wmode" value="opaque" />' +
				'<param name="quality" value="high" />' +
				'<param name="bgcolor" value="#000616" />' +
				'<param name="allowFullScreen" value="true" />' +
				'<!--<![endif]-->' +
				'<p class="flash-required">Flash is required to view this video.</p>' +
				'<!--[if !IE]>-->' +
				'</object>' +
				'<!--<![endif]-->' +
			'</object>' +
		'</div>');

		expect(div.clone().getElementsByTagName('param').length != 0).toBeTruthy();

		div = new Element('div').set('html', '<div id="ie-video" class="video">' +
			'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="425" height="344">' +
				'<param name="movie" value="http://www.youtube.com/v/6nOVQDMOvvE&amp;rel=0&amp;color1=0xb1b1b1&amp;color2=0xcfcfcf&amp;hl=en_US&amp;feature=player_embedded&amp;fs=1" />' +
				'<param name="wmode" value="opaque" />' +
				'<param name="quality" value="high" />' +
				'<param name="bgcolor" value="#000616" />' +
				'<param name="allowFullScreen" value="true" />' +
			'</object>' +
		'</div>');

		expect(div.clone().getElementsByTagName('param').length != 0).toBeTruthy();
	});

	it('should set the ID of the cloned element and then fetch it with document.id', function(){
		var cloneMe = new Element('div', {id: 'cloneMe', text: 'cloneMe'}).inject(document.body);
		var cloned = $('cloneMe').clone();
		expect(cloned.get('id')).toEqual(null);
		cloned.set('id', 'sauce').inject(cloneMe.parentNode);
		expect($('sauce')).toEqual(cloned);
		cloneMe.destroy();
		cloned.destroy();
	});

});

describe('Elements implement order', function(){

	it('should give precedence to Array over Element', function(){
		var anchor = new Element('a');

		var element = new Element('div').adopt(
			new Element('span'),
			anchor
		);

		expect(element.getLast()).toBe(anchor);
		
		expect(new Elements([element, anchor]).getLast()).toBe(anchor);
	});

});

describe('Element traversal', function(){

	it('should match against all provided selectors', function(){
		var div = new Element('div').adopt(
			new Element('span').adopt(
				new Element('a')
			)
		);

		var span = div.getElement('span');
		var anchor = span.getElement('a');

		expect(anchor.getParent('div, span')).toBe(div);
		expect(anchor.getParent('span, div')).toBe(span);

		expect(anchor.getParent('tagname, div')).toBe(div);
		expect(anchor.getParent('div > span')).toBe(span);
	});

});

describe('Elements.prototype.erase', function(){

	var element = new Element('div', {
		html: '<div></div><p></p><span></span>'
	});

	var original = element.getChildren();
	var altered = element.getChildren().erase(original[1]);

	it('should decrease the length of the collection', function(){
		expect(altered.length).toEqual(2);
	});

	it('should remove an element from the collection', function(){
		expect(altered[1]).toEqual(original[2]);
	});

	it('should remove the last element from the collection', function(){
		expect(altered[2]).toEqual(undefined);
	});

});

describe('Element.set("html")', function(){

	it("should set the html of a tr Element, even when it has no parentNode", function(){
		var html = '<td class="cell c">cell 1</td><td>cell 2</td>';
		var tr = new Element('tr');
		expect(tr.parentNode).toEqual(null);
		// In IE using appendChild like in set('html') sets the parentNode to a documentFragment
		tr.set('html', html).inject(new Element('tbody').inject(new Element('table')));
		expect(tr.get('html').toLowerCase().replace(/>\s+</, '><')).toEqual(html);
		expect(tr.getChildren().length).toEqual(2);
		expect(tr.getFirst().className).toEqual('cell c');
	});

});

describe('Elements.empty', function(){

	it('should empty the Elements collection', function(){
		var list = $$('div').empty();

		expect(list.length).toEqual(0);
		expect(list[0]).toBe(undefined);
	});

});

describe('Elements.append', function(){

	it('should append an Elements collection', function(){
		var list = new Element('div').adopt(
			new Element('div'),
			new Element('div')
		).getChildren();

		var p = new Element('div').adopt(
			new Element('p'),
			new Element('p')
		).getChildren();

		var appended = list.append(p);

		expect(appended).toBe(list);
		expect(appended).toEqual(new Elements([list[0], list[1], p[0], p[1]]));
	});

});

describe('Elements.concat', function(){

	it('should concat an Elements collection', function(){
		var list = new Element('div').adopt(
			new Element('div'),
			new Element('div')
		).getChildren();

		var p = new Element('div').adopt(
			new Element('p'),
			new Element('p')
		).getChildren();

		var concatenated = list.concat(p[0], p[1]);

		expect(concatenated).not.toBe(list);
		expect(concatenated).toEqual(new Elements([list[0], list[1], p[0], p[1]]));

		expect(typeOf(concatenated)).toBe('elements');
	});

});

describe('Element.getElement', function(){

	it('should return null', function(){
		var div = new Element('div'),
			a = new Element('a'),
			span = new Element('span'),
			p = new Element('span');

		p.adopt(span, a);
		div.adopt(p);

		var element = div.getElement();
		expect(element).toBe(null);
	});

});

describe('Element.getElements', function(){

	it('should return an empty collection', function(){
		var div = new Element('div'),
			a = new Element('a'),
			span = new Element('span'),
			p = new Element('span');

		p.adopt(span, a);
		div.adopt(p);

		var elements = div.getElements();
		expect(elements.length).toBe(0);
	});

	it('should return an empty collection if called on document.body', function(){
		expect($(document.body).getElements()).toEqual(new Elements);
	});

});

describe('Element.getFirst', function(){

	it('should return last the first element only if it matches the expression', function(){
		var container = new Element('div');
		var children = [new Element('div').adopt(new Element('a')), new Element('a'), new Element('div')];
		container.adopt(children);
		expect(container.getFirst('div')).toBe(children[0]);
		expect(container.getFirst('a')).toBe(children[1]);
		expect(container.getFirst('span')).toBeNull();
	});
});

describe('Element.getLast', function(){

	it('should return the last element only if it matches the expression', function(){
		var container = new Element('div');
		var children = [new Element('div').adopt(new Element('a')), new Element('a'), new Element('div')];
		container.adopt(children);
		expect(container.getLast('div')).toBe(children[2]);
		expect(container.getLast('a')).toBe(children[1]);
		expect(container.getLast('span')).toBeNull();
	});
});

describe('Elements.unshift', function(){

	it('should not allow to unshift any value', function(){
		var container = new Element('div').adopt(
			new Element('span'),
			new Element('p')
		);

		var collection = container.getElements('*'),
			length = collection.length;
		collection.unshift('someRandomValue');
		
		expect(collection.length).toBe(length);

		collection.unshift(new Element('p'), new Element('span'));
		expect(collection.length).toBe(length + 2);
		expect(collection.filter('p').length).toBe(2);
		expect(collection.filter('span').length).toBe(2);
	});

});