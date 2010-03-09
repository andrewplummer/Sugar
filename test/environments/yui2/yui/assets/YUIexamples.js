//Create namespace:
YAHOO.namespace("yui.examples");

//Only instantiate logger stuff if the page has loaded in logger mode:
if((YAHOO.widget.LogReader)&&(YAHOO.util.Dom.get("loggerDiv"))) {
	//Create Logger instance for example page:
	YAHOO.yui.examples.exampleLogger = new YAHOO.widget.LogReader("loggerDiv");
	
	//Logger comes up a bit more cleanly if its container has an approximate
	//height and is visibility:hidden intil after init;
	YAHOO.yui.examples.loggerInit = function() {
		YAHOO.util.Dom.setStyle("loggerDiv", "height", "auto");
		YAHOO.util.Dom.setStyle("loggerDiv", "visibility", "visible");
	}
	YAHOO.util.Event.onDOMReady(YAHOO.yui.examples.loggerInit);
}

//instantiate buttons:
YAHOO.yui.examples.onLinkButtonsMarkupReady = function() {
	//if the logger is in use, enable its button:
	if (YAHOO.util.Dom.get("loggerLink")) {
		var loggerButton = new YAHOO.widget.Button("loggerLink");
	}
	
	//if a new window button is present, initialize it:
	if (YAHOO.util.Dom.get("newWindowLink")) {
		var newWindowButton = new YAHOO.widget.Button("newWindowLink");
	}
}
//wait until loggerDiv is present; the window buttons will have loaded
//by then as well:
YAHOO.util.Event.onDOMReady(YAHOO.yui.examples.onLinkButtonsMarkupReady);