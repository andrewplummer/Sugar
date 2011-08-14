/*
---
name: Core Specs
description: n/a
requires: [Core/Core]
provides: [Core.Specs]
...
*/
describe('typeOf Client', {

	"should return 'collection' for HTMLElements collections": function(){
		expect(typeOf(document.getElementsByTagName('*'))).toEqual('collection');
	},

	"should return 'element' for an Element": function(){
		var div = document.createElement('div');
		expect(typeOf(div)).toEqual('element');
	},

	"should return 'elements' for Elements": function(){
		expect(typeOf(new Elements)).toEqual('elements');
	},

	"should return 'window' for the window object": function(){
		expect(typeOf(window)).toEqual('window');
	},

	"should return 'document' for the document object": function(){
		expect(typeOf(document)).toEqual('document');
	}

});

describe('Array.from', function(){

	it('should return an array for an Elements collection', function(){
		var div1 = document.createElement('div');
		var div2 = document.createElement('div');
		var div3 = document.createElement('div');

		div1.appendChild(div2);
		div1.appendChild(div3);

		var array = Array.from(div1.getElementsByTagName('*'));
		expect(Type.isArray(array)).toEqual(true);
	});
	
	it('should return an array for an Options collection', function(){
		var div = document.createElement('div');
		div.innerHTML = '<select><option>a</option></select>';
		var select = div.firstChild;
		var array = Array.from(select.options);
		expect(Type.isArray(array)).toEqual(true);
	});

});