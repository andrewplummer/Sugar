<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: Editor Image Browser</title>
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.3.1/build/reset-fonts-grids/reset-fonts-grids.css"> 
    <style type="text/css" media="screen">
    #doc {
        min-width: 500px;
        width: 90%;
    }
    #images p {
        float: left;
        padding: 3px;
        margin: 3px;
        border: 1px solid black;
        height: 100px;
        width: 100px;
        cursor: pointer;
    }
    </style>
</head>
</head>
<body class="yui-skin-sam">
<div id="doc" class="yui-t7">
 <p>Click an image to place it in the Editor.</p>
<div id="images">
    <p><img src="http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/yui.jpg" title="Click me"></p>
    <p><img src="http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/japan.jpg" title="Click me"></p>
    <p><img src="http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/katatjuta.jpg" title="Click me"></p>
    <p><img src="http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/morraine.jpg" title="Click me"></p>
    <p><img src="http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/museum.jpg" title="Click me"></p>
    <p><img src="http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/uluru.jpg" title="Click me"></p>
</div>
</div>
<script type="text/javascript" src="http://yui.yahooapis.com/2.3.1/build/yahoo-dom-event/yahoo-dom-event.js"></script>
<script type="text/javascript">
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        myEditor = window.opener.YAHOO.widget.EditorInfo.getEditorById('msgpost');
        //Get a reference to the editor on the other page
    
    //Add a listener to the parent of the images
    Event.on('images', 'click', function(ev) {
        var tar = Event.getTarget(ev);
        //Check to see if we clicked on an image
        if (tar && tar.tagName && (tar.tagName.toLowerCase() == 'img')) {
            //Focus the editor's window
            myEditor._focusWindow();
            //Fire the execCommand for insertimage
            myEditor.execCommand('insertimage', tar.getAttribute('src', 2));
            //Close this window
            window.close();
        }
    });
    //Internet Explorer will throw this window to the back, this brings it to the front on load
    Event.on(window, 'load', function() {
        window.focus();
    });
})();
</script>
</body>
</head>
