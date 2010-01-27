/*
Script: Element.Style.js
	Specification Examples of Element.Style.js.

License:
	MIT-style license.
*/

test('Element.set `opacity`', function() {

  (function(){
    var el = new Element('div').set('opacity', 0.4);
    if (Browser.Engine.trident) equal(el.style.filter, 'alpha(opacity=40)', 'should set the opacity of an Element');
    equal(el.style.opacity, 0.4, 'should set the opacity of an Element');

    equal(new Element('div').set('opacity', 0.4).get('opacity'), 0.4, 'should return the opacity of an Element');
  })();

});

test('Element.getStyle', function() {

  (function(){
    var el = new Element('div').set('html', '<div style="color:#00ff00"></div>');
    equal(el.getElement('div').getStyle('color'), '#00ff00', 'should get a six digit hex code from a three digit hex code');
  })();

  (function(){
    var el = new Element('div').set('html', '<div style="color:rgb(0, 255, 0)"></div>');
    equal(el.getElement('div').getStyle('color'), '#00ff00', 'should getStyle a six digit hex code from an RGB value');
  })();

  (function(){
    var el = new Element('div').set('html', '<div style="list-style-type:square"></div>');
    equal(el.getElement('div').getStyle('list-style-type'), 'square', 'should `getStyle` with a dash in it');
  })();

});

test('Element.setStyle', function() {

  equal(new Element('div', {styles:{'color':'#00ff00'}}).getStyle('color'), '#00ff00', 'should set the `styles` property on an Element using the Element constructor');

  equal(new Element('div').setStyle('color','#00ff00').getStyle('color'), '#00ff00', 'should `setStyle` on an Element');

  equal(new Element('div').setStyle('list-style-type', 'square').getStyle('list-style-type'), 'square', 'should properly `setStyle` for a property with a dash in it');

});

test('Element.getStyles', function() {

  var el = new Element('div').set('html', '<div style="color:#00ff00;list-style-type:square"></div>');
  same(el.getElement('div').getStyles('color', 'list-style-type'), {color:'#00ff00', 'list-style-type':'square'}, 'should return multiple styles');

});

test('Element.setStyles', function() {

same(new Element('div').setStyles({'list-style-type':'square', 'color':'#00ff00'}).getStyles('list-style-type', 'color'), {'list-style-type':'square', color:'#00ff00'}, 'should set multiple styles');

});



/*
 *
describe('Element.set `opacity`', {

	'should set the opacity of an Element': function() {
		var el = new Element('div').set('opacity', 0.4);
		if (Browser.Engine.trident) value_of(el.style.filter).should_be('alpha(opacity=40)');
		value_of(el.style.opacity).should_be(0.4);
	},

	'should return the opacity of an Element': function() {
		value_of(new Element('div').set('opacity', 0.4).get('opacity')).should_be(0.4);
	}

});

describe('Element.getStyle', {

	'should get a six digit hex code from a three digit hex code': function() {
		var el = new Element('div').set('html', '<div style="color:#00ff00"></div>');
		value_of(el.getElement('div').getStyle('color')).should_be('#00ff00');
	},

	'should getStyle a six digit hex code from an RGB value': function() {
		var el = new Element('div').set('html', '<div style="color:rgb(0, 255, 0)"></div>');
		value_of(el.getElement('div').getStyle('color')).should_be('#00ff00');
	},

	'should `getStyle` with a dash in it': function() {
		var el = new Element('div').set('html', '<div style="list-style-type:square"></div>');
		value_of(el.getElement('div').getStyle('list-style-type')).should_be('square');
	}

});

describe('Element.setStyle', {

	'should set the `styles` property on an Element using the Element constructor': function() {
		value_of(new Element('div', {styles:{'color':'#00ff00'}}).getStyle('color')).should_be('#00ff00');
	},

	'should `setStyle` on an Element': function() {
		value_of(new Element('div').setStyle('color','#00ff00').getStyle('color')).should_be('#00ff00');
	},

	'should properly `setStyle` for a property with a dash in it': function() {
		value_of(new Element('div').setStyle('list-style-type', 'square').getStyle('list-style-type')).should_be('square');
	}

});

describe('Element.getStyles', {

	'should return multiple styles': function() {
		var el = new Element('div').set('html', '<div style="color:#00ff00;list-style-type:square"></div>');
		value_of(el.getElement('div').getStyles('color', 'list-style-type')).should_be({color:'#00ff00', 'list-style-type':'square'});
	}

});

describe('Element.setStyles', {

	'should set multiple styles': function() {
		value_of(new Element('div').setStyles({'list-style-type':'square', 'color':'#00ff00'}).getStyles('list-style-type', 'color')).should_be({'list-style-type':'square', color:'#00ff00'});
	}

});

*/
