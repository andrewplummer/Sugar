/*
Script: NewElement.js
	Behavior Spec for new Element(expression)

License:
	MIT-style license.
*/

describe('new Element(expression)', {
	
	'should create a new div element': function(){
		var div = new Element('div');
		
		expect(div.tagName.toLowerCase()).toEqual('div');
		expect(!div.className && div.className.length == 0).toBeTruthy();
		expect(!div.id && div.id.length == 0).toBeTruthy();
		expect(typeOf(div)).toEqual('element');
	},
	
	'should create a new element with id and class': function(){
		var p = new Element('p', {
			id: 'myParagraph',
			'class': 'test className'
		});
		
		expect(p.tagName.toLowerCase()).toEqual('p');
		expect(p.className).toEqual('test className');
	},
	
	'should create a new element with id and class from css expression': function(){
		var p = new Element('p#myParagraph.test.className');
		
		expect(p.tagName.toLowerCase()).toEqual('p');
		expect(p.className).toEqual('test className');
	},
	
	'should create attributes from css expression': function(){
		var input = new Element('input[type=text][readonly=true][value=Some Text]');
		
		expect(input.tagName.toLowerCase()).toEqual('input');
		expect(input.type).toEqual('text');
		expect(input.readOnly).toEqual(true);
		expect(input.value).toEqual('Some Text');
	},
	
	'should overwrite ids and classes': function(){
		var div = new Element('div#myDiv.myClass', {
			id: 'myOverwrittenId',
			'class': 'overwrittenClass'
		});
		
		expect(div.tagName.toLowerCase()).toEqual('div');
		expect(div.id).toEqual('myOverwrittenId');
		expect(div.className).toEqual('overwrittenClass');
	},
	
	'should overwrite attributes': function(){
		var a = new Element('a[href=http://dojotoolkit.org/]', {
			href: 'http://mootools.net/'
		});
		
		expect(a.tagName.toLowerCase()).toEqual('a');
		expect(a.href).toEqual('http://mootools.net/');
	},
	
	'should reset attributes and classes with empty string': function(){
		var div = new Element('div#myDiv.myClass', {
			id: '',
			'class': ''
		});
		
		expect(div.tagName.toLowerCase()).toEqual('div');
		expect(div.id).toEqual('');
		expect(div.className).toEqual('');
	},
	
	'should not reset attributes and classes with null': function(){
		var div = new Element('div#myDiv.myClass', {
			id: null,
			'class': null
		});
		
		expect(div.tagName.toLowerCase()).toEqual('div');
		expect(div.id).toEqual('myDiv');
		expect(div.className).toEqual('myClass');
	},
	
	'should not reset attributes and classes with undefined': function(){
		var div = new Element('div#myDiv.myClass', {
			id: undefined,
			'class': undefined
		});
		
		expect(div.tagName.toLowerCase()).toEqual('div');
		expect(div.id).toEqual('myDiv');
		expect(div.className).toEqual('myClass');
	},
	
	'should fall back to a div tag': function(){
		var someElement = new Element('#myId');
		
		expect(someElement.tagName.toLowerCase()).toEqual('div');
		expect(someElement.id).toEqual('myId');
	},
	
	'should allow zero (0) values': function(){
		var table = new Element('table[cellpadding=0]');
		
		expect(table.tagName.toLowerCase()).toEqual('table');
		expect(table.cellPadding == 0).toBeTruthy();
	},
	
	'should allow false to be passed for checked': function() {
		var input = new Element('input', {
			type: 'checkbox',
			checked: false
		});
		
		expect(input.checked).toEqual(false);
	}
	
});