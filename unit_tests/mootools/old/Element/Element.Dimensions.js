/*
Script: Element.Dimensions.js
	Specs for Element.Dimensions.js

License:
	MIT-style license.
*/

(function(){
	var div, relDiv, absDiv, scrollDiv, tallDiv;
	window.addEvent('domready', function(){
		div = new Element('div', {
			id: 'ElementDimensionsTest',
			styles: {
				width: 100,
				height: 100,
				margin: 2,
				padding: 3,
				border: '1px solid black',
				visibility: 'hidden',
				display: 'block',
				position: 'absolute',
				top: 100,
				left: 100,
				overflow: 'hidden',
				zIndex: 1
			}
		}).inject($(document.body));
		
		relDiv = new Element('div', {
			styles: {
				width: 50,
				height: 50,
				margin: 5,
				padding: 5,
				border: '1px solid green',
				visibility: 'hidden',
				position: 'relative',
				overflow: 'hidden'
			}
		}).inject(div);
		
		absDiv = new Element('div', {
			styles: {
				width: 10,
				height: 10,
				margin: 5,
				padding: 5,
				border: '1px solid red',
				visibility: 'hidden',
				position: 'absolute',
				top: 10,
				left: 10,
				overflow: 'hidden'
			}
		}).inject(relDiv);
	
		scrollDiv = new Element('div', {
			styles: {
				width: 100,
				height: 100,
				overflow: 'scroll',
				visibility: 'hidden', 
				position: 'absolute',
				top: 0,
				left: 0			
			}
		}).inject($(document.body));
	
		tallDiv = new Element('div', {
			styles: {
				width: 200,
				height: 200,
				visibility: 'hidden'			
			}
		}).inject(scrollDiv);
	
	});

	describe('Element.getSize', {
		
		'should measure the width and height of the element': function(){
			value_of(div.getSize().x).should_be(108);
			value_of(div.getSize().y).should_be(108);
		}
		
	});
	
	describe('Element.getPosition', {
		
		'should measure the x and y position of the element': function(){
			value_of(div.getPosition()).should_be({x: 102, y: 102});
		}
		
	});

	describe('Element.getCoordinates', {
		
		'should return the coordinates relative to parent': function(){
			value_of(absDiv.getCoordinates(relDiv)).should_be({left:16, top:16, width:22, height:22, right:38, bottom:38});
		}
		
	});
	
	describe('Element.getScrollSize', {
		
		'should return the scrollSize': function(){
			value_of(scrollDiv.getScrollSize()).should_be({x:200, y:200});
		}
		
	});
	
	describe('Element.scrollTo', {
		
		'should scroll the element': function(){
			value_of(scrollDiv.scrollTo(20,20).getScroll()).should_be({x:20, y:20});
		}
		
	});

})();
