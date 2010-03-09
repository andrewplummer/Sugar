<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <title>Creating a Resizable Panel</title>

    <style type="text/css">
    /*
      margin and padding on body element
      can introduce errors in determining
      element position and are not recommended;
      we turn them off as a foundation for YUI
      CSS treatments. 
    */
    body {
        margin:0;
        padding:0;
    }
    </style>

    <link rel="stylesheet" type="text/css" href="../../build/fonts/fonts-min.css" />
    <link rel="stylesheet" type="text/css" href="../../build/container/assets/skins/sam/container.css" />
    <link rel="stylesheet" type="text/css" href="../../build/resize/assets/skins/sam/resize.css" />
    <script type="text/javascript" src="../../build/utilities/utilities.js"></script>
    <script type="text/javascript" src="../../build/container/container.js"></script>
    <script type="text/javascript" src="../../build/resize/resize.js"></script>

    <style type="text/css">
    #examplecontainer {
        padding:10px;
    }

    #resizablepanel .bd {
        overflow:auto;
        background-color:#fff;
        padding:10px;
    }

    #resizablepanel .ft {
        height:15px;
        padding:0;
    }

    #resizablepanel .yui-resize-handle-br {
        right:0;
        bottom:0;
        height: 8px;
        width: 8px;
        position:absolute;
    }

    /*  
        The following CSS is added to prevent scrollbar bleedthrough on
        Gecko browsers (e.g. Firefox) on MacOS.
    */

    /*
        PLEASE NOTE: It is necessary to toggle the "overflow" property 
        of the body element between "hidden" and "auto" in order to 
        prevent the scrollbars from remaining visible after the the 
        Resizable Panel is hidden.  For more information on this issue, 
        read the comments in the "container-core.css" file.
       
        We use the #reziablepanel_c id based specifier, so that the rule
        is specific enough to over-ride the .bd overflow rule above.
    */

    #resizablepanel_c.hide-scrollbars .yui-resize .bd {
        overflow: hidden;
    }

    #resizablepanel_c.show-scrollbars .yui-resize .bd {
        overflow: auto;
    }

    /*
        PLEASE NOTE: It is necessary to set the "overflow" property of
        the underlay element to "visible" in order for the 
        scrollbars on the body of a Resizable Panel instance to be 
        visible.  By default the "overflow" property of the underlay 
        element is set to "auto" when a Panel is made visible on
        Gecko for Mac OS X to prevent scrollbars from poking through
        it on that browser + platform combintation.  For more 
        information on this issue, read the comments in the 
        "container-core.css" file.
    */

    #resizablepanel_c.show-scrollbars .underlay {
        overflow: visible;
    }
    </style>

    <script type="text/javascript">
    YAHOO.util.Event.onDOMReady(

        function() {

            // Create a panel Instance, from the 'resizablepanel' DIV standard module markup
            var panel = new YAHOO.widget.Panel("resizablepanel", {
                draggable: true,
                width: "500px",
                height: "150px",
                autofillheight: "body", // default value, specified here to highlight its use in the example
                constraintoviewport:true,
                context: ["showbtn", "tl", "bl"]
            });
            panel.render();

            // Create Resize instance, binding it to the 'resizablepanel' DIV 
            var resize = new YAHOO.util.Resize("resizablepanel", {
                handles: ["br"],
                autoRatio: false,
                minWidth: 300,
                minHeight: 100,
                status: false 
            });

            // Setup startResize handler, to constrain the resize width/height
            // if the constraintoviewport configuration property is enabled.
            resize.on("startResize", function(args) {

    		    if (this.cfg.getProperty("constraintoviewport")) {
                    var D = YAHOO.util.Dom;

                    var clientRegion = D.getClientRegion();
                    var elRegion = D.getRegion(this.element);

                    resize.set("maxWidth", clientRegion.right - elRegion.left - YAHOO.widget.Overlay.VIEWPORT_OFFSET);
                    resize.set("maxHeight", clientRegion.bottom - elRegion.top - YAHOO.widget.Overlay.VIEWPORT_OFFSET);
	            } else {
                    resize.set("maxWidth", null);
                    resize.set("maxHeight", null);
	        	}

            }, panel, true);

            // Setup resize handler to update the Panel's 'height' configuration property 
            // whenever the size of the 'resizablepanel' DIV changes.

            // Setting the height configuration property will result in the 
            // body of the Panel being resized to fill the new height (based on the
            // autofillheight property introduced in 2.6.0) and the iframe shim and 
            // shadow being resized also if required (for IE6 and IE7 quirks mode).
            resize.on("resize", function(args) {
                var panelHeight = args.height;
                this.cfg.setProperty("height", panelHeight + "px");
            }, panel, true);

            YAHOO.util.Event.on("showbtn", "click", panel.show, panel, true);
        }
    );
    </script>
</head>
<body class="yui-skin-sam">
    <h1>Creating a Resizable Panel</h1>
    <div class="exampleIntro">
        <p>Operating systems offer windows that can be resized, often by dragging from the lower right-hand corner (and, on Microsoft Windows, from the window edges). This example implements resizability for the Panel control, by leveraging YAHOO.util.Resize to introduce a resize handle to the bottom-right corner of the footer. Resize events are listened for, and the height configuration property of the Panel is set to reflect the new height of Panel's containing element.</p>
    </div>

    <div id="examplecontainer">
        <button id="showbtn">Show Resizable Panel</button>
        <div id="resizablepanel">
            <div class="hd">Resizable Panel</div>
            <div class="bd">
                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse nulla. Fusce mauris massa, rutrum eu, imperdiet ut, placerat at, nunc. Vestibulum consequat ligula ut lacus. Nulla nec pede. Fusce consequat, augue et eleifend ornare, nibh mi dapibus lorem, ut lacinia turpis eros at eros. Proin laoreet. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla velit. Fusce id sem sit amet felis porta mollis. Aliquam erat volutpat. Etiam tortor. Donec dui felis, pretium quis, vulputate et, molestie non, nisi.</p>
            </div>
            <div class="ft"></div>
        </div>
    </div>
</body>
</html>

