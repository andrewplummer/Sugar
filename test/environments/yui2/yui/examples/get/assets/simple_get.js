//when this script is loaded by the YUI Get Utility,
//all of its contents will be evaluated in the context
//of the window object -- it has all the access to the
//page, the DOM, cookies, etc., that any other script
//would have, even if you've loaded it from a disparate
//domain.

//create a globally accessible namespace, assuming
//that YUI is already present:
YAHOO.namespace("simple_get");

//store some data:
YAHOO.simple_get.data = {
	script: "assets/simple_get.js",
	loaded: "loaded using YUI's Get Utility",
	time: new Date().toString()
}

