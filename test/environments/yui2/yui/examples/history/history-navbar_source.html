<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
  <head>
    <title>YUI Browser History Manager - Simple Navigation Bar Example</title>
    <link rel="stylesheet" type="text/css" href="../../build/reset-fonts-grids/reset-fonts-grids.css"/>
    <link rel="stylesheet" type="text/css" href="assets/yui-bhm-navbar-demo.css"/>
  </head>
  <body>

    <!-- Static markup required by the browser history utility. Note that the
         iframe is only used on Internet Explorer. If this page is server
         generated (by a PHP script for example), it is a good idea to create
         the IFrame ONLY for Internet Explorer (use server side user agent sniffing) -->

    <iframe id="yui-history-iframe" src="assets/blank.html"></iframe>
    <input id="yui-history-field" type="hidden">

    <!-- Handle the case when client-side scripting is disabled. Note that if
         this page is server generated (by a PHP script for example), you can
         degrade gracefully by using the "section" URL parameter and reload the
         entire page. -->

    <noscript>
This example requires client-side scripting enabled.
    </noscript>

    <!-- Dependencies -->
    <script src="../../build/yahoo-dom-event/yahoo-dom-event.js"></script>
    <script src="../../build/connection/connection.js"></script>
    <script src="../../build/history/history.js"></script>

    <script>

(function () {

    var html, bookmarkedSection, querySection, initSection;

    if (location.protocol.substr(0, 4) === "file") {
        document.write('This example cannot be run locally. You must copy it to a web server and access it using HTTP or HTTPS.');
        return;
    }

    html = [];

    html.push('<div id="doc">');
    html.push('  <div id="hd">');
    html.push('    <img src="assets/yui.gif" alt="YUI Logo" id="logo"/>');
    html.push('    <div id="nav">');
    html.push('      <ul>');
    html.push('        <li class="first"><a href="?section=home">Home</a></li>');
    html.push('        <li><a href="?section=overview">Overview</a></li>');
    html.push('        <li><a href="?section=products">Products</a></li>');
    html.push('        <li><a href="?section=aboutus">About Us</a></li>');
    html.push('        <li><a href="?section=contactus">Contact Us</a></li>');
    html.push('        <li class="last"><a href="?section=news">News</a></li>');
    html.push('      </ul>');
    html.push('    </div>');
    html.push('  </div>');
    html.push('  <div id="bd"></div>');
    html.push('  <div id="ft">YUI Browser History Manager - Simple Navigation Bar Example</div>');
    html.push('</div>');

    document.write(html.join(""));

    // This function does an XHR call to load and
    // display the specified section in the page.
    function loadSection(section) {
        var url = "assets/" + section + ".html";

        function successHandler(obj) {
            // Use the response...
            YAHOO.util.Dom.get("bd").innerHTML = obj.responseText;
        }

        function failureHandler(obj) {
            // Fallback...
            location.href = "?section=" + section;
        }

        YAHOO.util.Connect.asyncRequest("GET", url,
            {
                success: successHandler,
                failure: failureHandler
            }
        );
    }

    function initializeNavigationBar() {
        // Process links
        var anchors, i, len, anchor, href, section, currentSection;
        anchors = YAHOO.util.Dom.get("nav").getElementsByTagName("a");
        for (i = 0, len = anchors.length; i < len; i++) {
            anchor = anchors[i];
            YAHOO.util.Event.addListener(anchor, "click", function (evt) {
                href = this.getAttribute("href");
                section = YAHOO.util.History.getQueryStringParameter("section", href) || "home";
                // If the Browser History Manager was not successfuly initialized,
                // the following call to YAHOO.util.History.navigate will throw an
                // exception. We need to catch it and update the UI. The only
                // problem is that this new state will not be added to the browser
                // history.
                //
                // Another solution is to make sure this is an A-grade browser.
                // In that case, under normal circumstances, no exception should
                // be thrown here.
                try {
                    YAHOO.util.History.navigate("navbar", section);
                } catch (e) {
                    loadSection(section);
                }
                YAHOO.util.Event.preventDefault(evt);
            });
        }

        // This is the tricky part... The window's onload handler is called when the
        // user comes back to your page using the back button. In this case, the
        // actual section that needs to be loaded corresponds to the last section
        // visited before leaving the page, and not the initial section. This can
        // be retrieved using getCurrentState:
        currentSection = YAHOO.util.History.getCurrentState("navbar");
        loadSection(currentSection);
    }

    // The initial section will be chosen in the following order:
    //
    // URL fragment identifier (it will be there if the user previously
    // bookmarked the application in a specific state)
    //
    //         or
    //
    // "section" URL parameter (it will be there if the user accessed
    // the site from a search engine result, or did not have scripting
    // enabled when the application was bookmarked in a specific state)
    //
    //         or
    //
    // "home" (default)

    bookmarkedSection = YAHOO.util.History.getBookmarkedState("navbar");
    querySection = YAHOO.util.History.getQueryStringParameter("section");
    initSection = bookmarkedSection || querySection || "home";

    // Register our only module. Module registration MUST take place
    // BEFORE calling initializing the browser history management library!
    YAHOO.util.History.register("navbar", initSection, function (state) {
        // This is called after calling YAHOO.util.History.navigate,
        // or after the user has trigerred the back/forward button.
        // We cannot distinguish between these two situations.
        loadSection(state);
    });

    // Use the Browser History Manager onReady method to initialize the application.
    YAHOO.util.History.onReady(function () {
        initializeNavigationBar();
    });

    // Initialize the browser history management library.
    try {
        YAHOO.util.History.initialize("yui-history-field", "yui-history-iframe");
    } catch (e) {
        // The only exception that gets thrown here is when the browser is
        // not supported (Opera, or not A-grade) Degrade gracefully.
        // Note that we have two options here to degrade gracefully:
        //   1) Call initializeNavigationBar. The page will use Ajax/DHTML,
        //      but the back/forward buttons will not work.
        //   2) Initialize our module. The page will not use Ajax/DHTML,
        //      but the back/forward buttons will work. This is what we
        //      chose to do here:
        loadSection(initSection);
    }

})();

    </script>

  </body>
</html>
