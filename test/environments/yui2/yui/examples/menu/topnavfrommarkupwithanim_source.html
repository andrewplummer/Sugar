<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>Example: Website Top Nav Using Animation With Submenus Built From Markup (YUI Library)</title>
        
        <!-- Standard reset, fonts and grids -->

        <link rel="stylesheet" type="text/css" href="../../build/reset-fonts-grids/reset-fonts-grids.css">
 

        <!-- CSS for Menu -->

        <link rel="stylesheet" type="text/css" href="../../build/menu/assets/skins/sam/menu.css"> 
 

        <!-- Page-specific styles -->

        <style type="text/css">

            div.yui-b p {
            
                margin: 0 0 .5em 0;
                color: #999;
            
            }
            
            div.yui-b p strong {
            
                font-weight: bold;
                color: #000;
            
            }
            
            div.yui-b p em {

                color: #000;
            
            }            
            
            h1 {

                font-weight: bold;
                margin: 0 0 1em 0;
                padding: .25em .5em;
                background-color: #ccc;

            }

            #productsandservices {
            
                margin: 0 0 10px 0;
            
            }

        </style>


        <!-- Dependency source files -->

        <script type="text/javascript" src="../../build/yahoo-dom-event/yahoo-dom-event.js"></script>
        <script type="text/javascript" src="../../build/animation/animation.js"></script>
        <script type="text/javascript" src="../../build/container/container_core.js"></script>


        <!-- Menu source file -->

        <script type="text/javascript" src="../../build/menu/menu.js"></script>


        <!-- Page-specific script -->

        <script type="text/javascript">

            /*
                 Initialize and render the MenuBar when its elements are ready 
                 to be scripted.
            */

            YAHOO.util.Event.onContentReady("productsandservices", function () {

                var ua = YAHOO.env.ua,
                    oAnim;  // Animation instance


                /*
                     "beforeshow" event handler for each submenu of the MenuBar
                     instance, used to setup certain style properties before
                     the menu is animated.
                */

                function onSubmenuBeforeShow(p_sType, p_sArgs) {

                    var oBody,
                        oElement,
                        oShadow,
                        oUL;
                

                    if (this.parent) {

                        oElement = this.element;

                        /*
                             Get a reference to the Menu's shadow element and 
                             set its "height" property to "0px" to syncronize 
                             it with the height of the Menu instance.
                        */

                        oShadow = oElement.lastChild;
                        oShadow.style.height = "0px";

                        
                        /*
                            Stop the Animation instance if it is currently 
                            animating a Menu.
                        */ 
                    
                        if (oAnim && oAnim.isAnimated()) {
                        
                            oAnim.stop();
                            oAnim = null;
                        
                        }


                        /*
                            Set the body element's "overflow" property to 
                            "hidden" to clip the display of its negatively 
                            positioned <ul> element.
                        */ 

                        oBody = this.body;


                        //  Check if the menu is a submenu of a submenu.

                        if (this.parent && 
                            !(this.parent instanceof YAHOO.widget.MenuBarItem)) {
                        

                            /*
                                There is a bug in gecko-based browsers and Opera where 
                                an element whose "position" property is set to 
                                "absolute" and "overflow" property is set to 
                                "hidden" will not render at the correct width when
                                its offsetParent's "position" property is also 
                                set to "absolute."  It is possible to work around 
                                this bug by specifying a value for the width 
                                property in addition to overflow.
                            */

                            if (ua.gecko || ua.opera) {
                            
                                oBody.style.width = oBody.clientWidth + "px";
                            
                            }
                            
                            
                            /*
                                Set a width on the submenu to prevent its 
                                width from growing when the animation 
                                is complete.
                            */
                            
                            if (ua.ie == 7) {

                                oElement.style.width = oElement.clientWidth + "px";

                            }
                        
                        }

    
                        oBody.style.overflow = "hidden";


                        /*
                            Set the <ul> element's "marginTop" property 
                            to a negative value so that the Menu's height
                            collapses.
                        */ 

                        oUL = oBody.getElementsByTagName("ul")[0];

                        oUL.style.marginTop = ("-" + oUL.offsetHeight + "px");
                    
                    }

                }


                /*
                    "tween" event handler for the Anim instance, used to 
                    syncronize the size and position of the Menu instance's 
                    shadow and iframe shim (if it exists) with its 
                    changing height.
                */

                function onTween(p_sType, p_aArgs, p_oShadow) {

                    if (this.cfg.getProperty("iframe")) {
                    
                        this.syncIframe();
                
                    }
                
                    if (p_oShadow) {
                
                        p_oShadow.style.height = this.element.offsetHeight + "px";
                    
                    }
                
                }


                /*
                    "complete" event handler for the Anim instance, used to 
                    remove style properties that were animated so that the 
                    Menu instance can be displayed at its final height.
                */

                function onAnimationComplete(p_sType, p_aArgs, p_oShadow) {

                    var oBody = this.body,
                        oUL = oBody.getElementsByTagName("ul")[0];

                    if (p_oShadow) {
                    
                        p_oShadow.style.height = this.element.offsetHeight + "px";
                    
                    }


                    oUL.style.marginTop = "";
                    oBody.style.overflow = "";
                    

                    //  Check if the menu is a submenu of a submenu.

                    if (this.parent && 
                        !(this.parent instanceof YAHOO.widget.MenuBarItem)) {


                        // Clear widths set by the "beforeshow" event handler

                        if (ua.gecko || ua.opera) {
                        
                            oBody.style.width = "";
                        
                        }
                        
                        if (ua.ie == 7) {

                            this.element.style.width = "";

                        }
                    
                    }
                    
                }


                /*
                     "show" event handler for each submenu of the MenuBar 
                     instance - used to kick off the animation of the 
                     <ul> element.
                */

                function onSubmenuShow(p_sType, p_sArgs) {

                    var oElement,
                        oShadow,
                        oUL;
                
                    if (this.parent) {

                        oElement = this.element;
                        oShadow = oElement.lastChild;
                        oUL = this.body.getElementsByTagName("ul")[0];
                    

                        /*
                             Animate the <ul> element's "marginTop" style 
                             property to a value of 0.
                        */

                        oAnim = new YAHOO.util.Anim(oUL, 
                            { marginTop: { to: 0 } },
                            .5, YAHOO.util.Easing.easeOut);


                        oAnim.onStart.subscribe(function () {
        
                            oShadow.style.height = "100%";
                        
                        });
    

                        oAnim.animate();

    
                        /*
                            Subscribe to the Anim instance's "tween" event for 
                            IE to syncronize the size and position of a 
                            submenu's shadow and iframe shim (if it exists)  
                            with its changing height.
                        */
    
                        if (YAHOO.env.ua.ie) {
                            
                            oShadow.style.height = oElement.offsetHeight + "px";


                            /*
                                Subscribe to the Anim instance's "tween"
                                event, passing a reference Menu's shadow 
                                element and making the scope of the event 
                                listener the Menu instance.
                            */

                            oAnim.onTween.subscribe(onTween, oShadow, this);
    
                        }
    

                        /*
                            Subscribe to the Anim instance's "complete" event,
                            passing a reference Menu's shadow element and making 
                            the scope of the event listener the Menu instance.
                        */
    
                        oAnim.onComplete.subscribe(onAnimationComplete, oShadow, this);
                    
                    }
                
                }


                /*
                     Instantiate a MenuBar:  The first argument passed to the 
                     constructor is the id of the element in the page 
                     representing the MenuBar; the second is an object literal 
                     of configuration properties.
                */

                var oMenuBar = new YAHOO.widget.MenuBar("productsandservices", { 
                                                            autosubmenudisplay: true, 
                                                            hidedelay: 750, 
                                                            lazyload: true });


                /*
                     Subscribe to the "beforeShow" and "show" events for 
                     each submenu of the MenuBar instance.
                */
                
                oMenuBar.subscribe("beforeShow", onSubmenuBeforeShow);
                oMenuBar.subscribe("show", onSubmenuShow);


                /*
                     Call the "render" method with no arguments since the 
                     markup for this MenuBar already exists in the page.
                */

                oMenuBar.render();          
            
            });

        </script>

    </head>
    <body class="yui-skin-sam" id="yahoo-com">

        <div id="doc" class="yui-t1">
            <div id="hd">
                <!-- start: your content here -->
                
                    <h1>Example: Website Top Nav Using Animation With Submenus Built From Markup (YUI Library)</h1>
        
                <!-- end: your content here -->
            </div>
            <div id="bd">

                <!-- start: primary column from outer template -->
                <div id="yui-main">
                    <div class="yui-b">
                        <!-- start: stack grids here -->

                       <div id="productsandservices" class="yuimenubar yuimenubarnav">
                            <div class="bd">
                                <ul class="first-of-type">
                                    <li class="yuimenubaritem first-of-type"><a class="yuimenubaritemlabel" href="#communication">Communication</a>
                
                                        <div id="communication" class="yuimenu">
                                            <div class="bd">
                                                <ul>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://360.yahoo.com">360&#176;</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://alerts.yahoo.com">Alerts</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://avatars.yahoo.com">Avatars</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://groups.yahoo.com">Groups</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://promo.yahoo.com/broadband/">Internet Access</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="#">PIM</a>
                                                    
                                                        <div id="pim" class="yuimenu">
                                                            <div class="bd">
                                                                <ul class="first-of-type">
                                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://mail.yahoo.com">Yahoo! Mail</a></li>
                                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://addressbook.yahoo.com">Yahoo! Address Book</a></li>
                                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://calendar.yahoo.com">Yahoo! Calendar</a></li>
                                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://notepad.yahoo.com">Yahoo! Notepad</a></li>
                                                                </ul>            
                                                            </div>
                                                        </div>                    
                                                    
                                                    </li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://members.yahoo.com">Member Directory</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://messenger.yahoo.com">Messenger</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://mobile.yahoo.com">Mobile</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://www.flickr.com">Flickr Photo Sharing</a></li>
                                                </ul>
                                            </div>
                                        </div>      
                                    
                                    </li>
                                    <li class="yuimenubaritem"><a class="yuimenubaritemlabel" href="http://shopping.yahoo.com">Shopping</a>
                
                                        <div id="shopping" class="yuimenu">
                                            <div class="bd">                    
                                                <ul>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://auctions.shopping.yahoo.com">Auctions</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://autos.yahoo.com">Autos</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://classifieds.yahoo.com">Classifieds</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://shopping.yahoo.com/b:Flowers%20%26%20Gifts:20146735">Flowers &#38; Gifts</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://realestate.yahoo.com">Real Estate</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://travel.yahoo.com">Travel</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://wallet.yahoo.com">Wallet</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://yp.yahoo.com">Yellow Pages</a></li>
                                                </ul>
                                            </div>
                                        </div>                    
                                    
                                    </li>
                                    <li class="yuimenubaritem"><a class="yuimenubaritemlabel" href="http://entertainment.yahoo.com">Entertainment</a>
                
                                        <div id="entertainment" class="yuimenu">
                                            <div class="bd">                    
                                                <ul>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://fantasysports.yahoo.com">Fantasy Sports</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://games.yahoo.com">Games</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://www.yahooligans.com">Kids</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://music.yahoo.com">Music</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://movies.yahoo.com">Movies</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://music.yahoo.com/launchcast">Radio</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://travel.yahoo.com">Travel</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://tv.yahoo.com">TV</a></li>
                                                </ul>                    
                                            </div>
                                        </div>                                        
                                    
                                    </li>
                                    <li class="yuimenubaritem"><a class="yuimenubaritemlabel" href="#">Information</a>
                
                                        <div id="information" class="yuimenu">
                                            <div class="bd">                                        
                                                <ul>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://downloads.yahoo.com">Downloads</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://finance.yahoo.com">Finance</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://health.yahoo.com">Health</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://local.yahoo.com">Local</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://maps.yahoo.com">Maps &#38; Directions</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://my.yahoo.com">My Yahoo!</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://news.yahoo.com">News</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://search.yahoo.com">Search</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://smallbusiness.yahoo.com">Small Business</a></li>
                                                    <li class="yuimenuitem"><a class="yuimenuitemlabel" href="http://weather.yahoo.com">Weather</a></li>
                                                </ul>                    
                                            </div>
                                        </div>                                        
                                    
                                    </li>
                                </ul>            
                            </div>
                        </div>

                        <p id="note"><strong>NOTE:</strong> <em>This example demonstrates how to add animation effects to a menu bar with submenus built using existing markup.</em></p>

                        <form name="example">
                            <select name="test">
                                <option value="one">One</option>
                                <option value="two">Two</option>
                                <option value="three">Three</option>                                
                            </select>
                        </form>

                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas sit amet metus. Nunc quam elit, posuere nec, auctor in, rhoncus quis, dui. Aliquam erat volutpat. Ut dignissim, massa sit amet dignissim cursus, quam lacus feugiat dolor, id aliquam leo tortor eget odio. Pellentesque orci arcu, eleifend at, iaculis sit amet, posuere eu, lorem. Aliquam erat volutpat. Phasellus vulputate. Vivamus id erat. Nulla facilisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Nunc gravida. Ut euismod, tortor eget convallis ullamcorper, arcu odio egestas pede, ut ornare urna elit vitae mauris. Aenean ullamcorper eros a lacus. Curabitur egestas tempus lectus. Donec et lectus et purus dapibus feugiat. Sed sit amet diam. Etiam ipsum leo, facilisis ac, rutrum nec, dignissim quis, tellus. Sed eleifend.</p>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas sit amet metus. Nunc quam elit, posuere nec, auctor in, rhoncus quis, dui. Aliquam erat volutpat. Ut dignissim, massa sit amet dignissim cursus, quam lacus feugiat dolor, id aliquam leo tortor eget odio. Pellentesque orci arcu, eleifend at, iaculis sit amet, posuere eu, lorem. Aliquam erat volutpat. Phasellus vulputate. Vivamus id erat. Nulla facilisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Nunc gravida. Ut euismod, tortor eget convallis ullamcorper, arcu odio egestas pede, ut ornare urna elit vitae mauris. Aenean ullamcorper eros a lacus. Curabitur egestas tempus lectus. Donec et lectus et purus dapibus feugiat. Sed sit amet diam. Etiam ipsum leo, facilisis ac, rutrum nec, dignissim quis, tellus. Sed eleifend.</p>

                        <!-- end: stack grids here -->
                    </div>
                </div>
                <!-- end: primary column from outer template -->

                <!-- start: secondary column from outer template -->
                <div class="yui-b">
                
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas sit amet metus. Nunc quam elit, posuere nec, auctor in, rhoncus quis, dui. Aliquam erat volutpat. Ut dignissim, massa sit amet dignissim cursus, quam lacus feugiat dolor, id aliquam leo tortor eget odio. Pellentesque orci arcu, eleifend at, iaculis sit amet, posuere eu, lorem. Aliquam erat volutpat. Phasellus vulputate. Vivamus id erat. Nulla facilisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Nunc gravida. Ut euismod, tortor eget convallis ullamcorper, arcu odio egestas pede, ut ornare urna elit vitae mauris. Aenean ullamcorper eros a lacus. Curabitur egestas tempus lectus. Donec et lectus et purus dapibus feugiat. Sed sit amet diam. Etiam ipsum leo, facilisis ac, rutrum nec, dignissim quis, tellus. Sed eleifend.</p>
                    
                </div>
                <!-- end: secondary column from outer template -->
            </div>
            <div id="ft">

                <p>FOOTER: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas sit amet metus. Nunc quam elit, posuere nec, auctor in, rhoncus quis, dui. Aliquam erat volutpat. Ut dignissim, massa sit amet dignissim cursus, quam lacus feugiat.</p>

            </div>
        </div>

    </body>
</html>