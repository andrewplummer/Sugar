(function() {
    YAHOO.example.app = {
        inboxLoaded: false,
        inboxLoading: false,
        feedURL: 'http:/'+'/rss.groups.yahoo.com/group/ydn-javascript/rss?count=50',
        getFeed: function(u) {
            if (!YAHOO.example.app.inboxLoading) {
                var reload = true;
                YAHOO.example.app.inboxLoading = true;
                if (u) {
                    if (YAHOO.example.app.feedURL === (u + '?count=50')) {
                        reload = false;
                    }
                    YAHOO.example.app.feedURL = u + '?count=50';
                }
                YAHOO.util.Dom.addClass(YAHOO.example.app.tabView._tabParent, 'loading');            
                if (!YAHOO.example.app.inboxLoaded) {
                    var transactionObj = YAHOO.util.Get.script('assets/js/inbox.js', { autopurge: true });
                } else {
                    if (reload) {
                        YAHOO.example.app.reloadData(u);
                    } else {
                        YAHOO.util.Dom.removeClass(YAHOO.example.app.tabView._tabParent, 'loading');            
                        YAHOO.example.app.inboxLoading = false;
                    }
                }
            }
        }
    };

    //Call loader the first time
    var loader = new YAHOO.util.YUILoader({
        base: '../../build/',
        //Get these modules
        require: ['reset-fonts-grids', 'utilities', 'logger', 'button', 'container', 'tabview', 'selector', 'resize', 'layout'],
        rollup: true,
        onSuccess: function() {
            //Use the DD shim on all DD objects
            YAHOO.util.DDM.useShim = true;
            //Load the global CSS file.
            YAHOO.log('Main files loaded..', 'info', 'main.js');
            YAHOO.util.Get.css('assets/css/example1.css');

            YAHOO.log('Create the first layout on the page', 'info', 'main.js');
            YAHOO.example.app.layout = new YAHOO.widget.Layout({
                minWidth: 1000,
                units: [
                    { position: 'top', height: 45, resize: false, body: 'top1' },
                    { position: 'right', width: 300, body: '', header: 'Logger Console', collapse: true },
                    { position: 'left', width: 190, resize: true, body: 'left1', gutter: '0 5 0 5px', minWidth: 190 },
                    { position: 'center', gutter: '0 5px 0 2' }
                ]
            });
            //On resize, resize the left and right column content
            YAHOO.example.app.layout.on('resize', function() {
                var l = this.getUnitByPosition('left');
                var th = l.get('height') - YAHOO.util.Dom.get('folder_top').offsetHeight;
                var h = th - 4; //Borders around the 2 areas
                h = h - 9; //Padding between the 2 parts
                YAHOO.util.Dom.setStyle('folder_list', 'height', h + 'px');
            }, YAHOO.example.app.layout, true);
            //On render, load tabview.js and button.js
            YAHOO.example.app.layout.on('render', function() {
                window.setTimeout(function() {
                    YAHOO.util.Get.script('assets/js/logger.js');
                    YAHOO.util.Get.script('assets/js/tabview.js'); 
                    YAHOO.util.Get.script('assets/js/buttons.js');
                    YAHOO.util.Get.script('assets/js/calendar.js');
                }, 0);
                YAHOO.example.app.layout.getUnitByPosition('right').collapse();
                setTimeout(function() {
                    YAHOO.util.Dom.setStyle(document.body, 'visibility', 'visible');
                    YAHOO.example.app.layout.resize();
                }, 1000);
            });
            //Render the layout
            YAHOO.example.app.layout.render();
            //Setup the click listeners on the folder list
            YAHOO.util.Event.on('folder_list', 'click', function(ev) {
                var tar = YAHOO.util.Event.getTarget(ev);
                if (tar.tagName.toLowerCase() != 'a') {
                    tar = null;
                }
                //Make sure we are a link in the list's 
                if (tar && YAHOO.util.Selector.test(tar, '#folder_list ul li a')) {
                    //if the href is a '#' then select the proper tab and change it's label
                    if (tar && tar.getAttribute('href', 2) == '#') {
                        YAHOO.util.Dom.removeClass(YAHOO.util.Selector.query('#folder_list li'), 'selected');
                        var feedName = tar.parentNode.className;
                        YAHOO.util.Dom.addClass(tar.parentNode, 'selected');
                        YAHOO.util.Event.stopEvent(ev);
                        var title = tar.innerHTML;
                        var t = YAHOO.example.app.tabView.get('tabs');
                        for (var i = 0; i < t.length; i++) {
                            if (t[i].get('id') == 'inboxView') {
                                t[i].set('label', title);
                                var u = false;
                                if (feedName.indexOf('-') != -1) {
                                    u = 'http:/'+'/rss.groups.yahoo.com/group/' + feedName + '/rss';
                                }
                                if (feedName.indexOf('inbox') != -1) {
                                    u = 'http:/'+'/rss.groups.yahoo.com/group/ydn-javascript/rss';
                                }
                                YAHOO.example.app.getFeed(u);
                                YAHOO.example.app.tabView.set('activeTab', t[i]);
                            }
                        }
                    }
                }
            });
            
            //Create a SimpleDialog used to mimic an OS dialog
            var panel = new YAHOO.widget.SimpleDialog('alert', {
                fixedcenter: true,
                visible: false,
                modal: true,
                width: '300px',
                constraintoviewport: true, 
                icon: YAHOO.widget.SimpleDialog.ICON_WARN,
                buttons: [
                    { text: 'OK', handler: function() {
                        panel.hide();
                    }, isDefault: true }
                ]
            });
            //Set the header
            panel.setHeader('Alert');
            //Give the body something to render with
            panel.setBody('Notta');
            //Render the Dialog to the body
            panel.render(document.body);

            //Create a namepaced alert method
            YAHOO.example.app.alert = function(str) {
                YAHOO.log('Firing panel setBody with string: ' + str, 'info', 'main.js');
                //Set the body to the string passed
                panel.setBody(str);
                //Set an icon
                panel.cfg.setProperty('icon', YAHOO.widget.SimpleDialog.ICON_WARN);
                //Bring the dialog to the top
                panel.bringToTop();
                //Show it
                panel.show();
            };

            YAHOO.example.app.alert('This is not a new product from Yahoo! or YUI, just a demonstration of how YUI components can work in concert in the context of a more complex application.');
        }
    });
    loader.insert();
})();
