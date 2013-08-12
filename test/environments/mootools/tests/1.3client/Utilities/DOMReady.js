/*
---
name: DomReady Specs
description: n/a
requires: [Core/DomReady]
provides: [DomReady.Specs]
...
*/
document.addListener = function(type, fn){
	if (this.addEventListener) this.addEventListener(type, fn, false);
	else this.attachEvent('on' + type, fn);
	return this;
};

document.removeListener = function(type, fn){
	if (this.removeEventListener) this.removeEventListener(type, fn, false);
	else this.detachEvent('on' + type, fn);
	return this;
};


window.fireEvent =
document.fireEvent = function(type){
	if (type == 'domready')
	for (var i = 0; i < domreadyCallbacks.length; ++i){
	}
		domreadyCallbacks[i]();
};

window.addEvent = function(){};

var Element = this.Element || {};
Element.Events = {};
