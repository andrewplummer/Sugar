(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Sel = YAHOO.util.Selector;
        YAHOO.log('tabview.js loaded', 'info', 'tabview.js');
        //Set the time on the home screen
        YAHOO.example.app.setTime = function() {
            var d = new Date();
            var weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            var h = d.getHours(), a = 'am';
            if (h >= 12) {
                a = 'pm';
                if (h > 12) {
                    h = (h - 12);
                }
            }

            var dy = d.getDate();
            if (dy < 10) {
                dy = '0' + dy;
            }

            var m = (d.getMonth() + 1);
            if (m < 10) {
                m = '0' + m;
            }

            var dt = weekday[d.getDay()] + ' ' + m + '/' + dy + '/' + d.getFullYear() + ' ' + h + ':' + d.getMinutes() + ' ' + a;
            YAHOO.util.Dom.get('datetime').innerHTML = dt;
            YAHOO.util.Dom.get('calDateStr').innerHTML = m + '/' + dy + '/' + d.getFullYear();
            YAHOO.log('Setting the time/date string to: ' + dt, 'info', 'tabview.js');
        };
        
        //Method to Resize the tabview
        YAHOO.example.app.resizeTabView = function() {
            var ul = YAHOO.example.app.tabView._tabParent.offsetHeight;
            Dom.setStyle(YAHOO.example.app.tabView._contentParent, 'height', ((YAHOO.example.app.layout.getSizes().center.h - ul) - 2) + 'px');
        };
        
        //Listen for the layout resize and call the method
        YAHOO.example.app.layout.on('resize', YAHOO.example.app.resizeTabView);
        //Create the tabView
        YAHOO.log('Creating the main TabView instance', 'info', 'tabview.js');
        YAHOO.example.app.tabView = new YAHOO.widget.TabView();
        //Create the Home tab       
        YAHOO.example.app.tabView.addTab( new YAHOO.widget.Tab({
            //Inject a span for the icon
            label: '<span></span>Home',
            id: 'homeView',
            content: '<div id="welcomeWrapper"><h2>Welcome to the home screen</h2><span id="datetime"></span><div id="weather"><span><em></em><strong>Sunnyvale, CA</strong></span></div></div><div id="news" class="yui-navset"><ul class="yui-nav"><li class="selected" id="newsTop"><a href="#tab1"><em>Top Stories</em></a></li><li id="newsWorld"><a href="#tab2"><em>World</em></a></li><li id="newsEnt"><a href="#tab3"><em>Entertainment</em></a></li><li id="newsSports"><a href="#tab4"><em>Sports</em></a></li></ul><div class="yui-content"><div></div><div></div><div></div><div></div></div></div>',
            active: true
        }));
        //Create the Inbox tab
        YAHOO.example.app.tabView.addTab( new YAHOO.widget.Tab({
            //Inject a span for the icon
            label: '<span></span>Inbox',
            id: 'inboxView',
            content: ''

        }));
        YAHOO.example.app.tabView.on('activeTabChange', function(ev) {
            //Tabs have changed
            if (ev.newValue.get('id') == 'inboxView') {
                //inbox tab was selected
                if (!YAHOO.example.app.inboxLoaded && !YAHOO.example.app.inboxLoading) {
                    YAHOO.log('Fetching the inbox.js file..', 'info', 'tabview.js');
                    YAHOO.log('Inbox is not loaded yet, use Get to fetch it', 'info', 'tabview.js');
                    YAHOO.log('Adding loading class to tabview', 'info', 'tabview.js');
                    YAHOO.example.app.getFeed();
                }
            }
            //Is an editor present?
            if (YAHOO.example.app.editor) {
                if (ev.newValue.get('id') == 'composeView') {
                    YAHOO.log('Showing the ediitor', 'info', 'tabview.js');
                    YAHOO.example.app.editor.show();
                    YAHOO.example.app.editor.set('disabled', false);
                } else {
                    YAHOO.log('Hiding the editor', 'info', 'tabview.js');
                    YAHOO.example.app.editor.hide();
                    YAHOO.example.app.editor.set('disabled', true);
                }
            }
            //Resize to fit the new content
            YAHOO.example.app.layout.resize();
        });
        //Add the tabview to the center unit of the main layout
        var el = YAHOO.example.app.layout.getUnitByPosition('center').get('wrap');
        YAHOO.example.app.tabView.appendTo(el);

        //resize the TabView
        YAHOO.example.app.resizeTabView();
        //Set the time on the home screen
        YAHOO.example.app.setTime();
        //Setup the interval to update the time
        setInterval(YAHOO.example.app.setTime, 60000);

        
        YAHOO.log('Fetch the news feed', 'info', 'tabview.js');
        YAHOO.util.Get.script('assets/js/news.js'); 


        //When inboxView is available, update the height..
        Event.onAvailable('inboxView', function() {
            var t = YAHOO.example.app.tabView.get('tabs');
            for (var i = 0; i < t.length; i++) {
                if (t[i].get('id') == 'inboxView') {
                    var el = t[i].get('contentEl');
                    el.id = 'inboxHolder';
                    YAHOO.log('Setting the height of the TabViews content parent', 'info', 'tabview.js');
                    Dom.setStyle(el, 'height', Dom.getStyle(YAHOO.example.app.tabView._contentParent, 'height'));
                    
                }
            }

        });

})();
