(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

    YAHOO.log('buttons.js loaded', 'info', 'button.js');
    //Create this loader instance and ask for the Button module
    var loader = new YAHOO.util.YUILoader({
        base: '../../build/',
        require: ['button'],
        ignore: ['containercore'],
        onSuccess: function() {
            YAHOO.log('Create the search button', 'info', 'button.js');
            var searchButton = new YAHOO.widget.Button('search');
            searchButton.on('click', function() {
                var q = Dom.get('query').value;
                if (q !== 'Search the Web..') {
                    window.open('http:/'+'/search.yahoo.com/search?p=' + q);
                }
            });
            YAHOO.log('Create the Check Mail button', 'info', 'button.js');
            var b1 = new YAHOO.widget.Button({
                label: 'Check Mail',
                id: 'checkButton',
                container: Dom.get('check_buttons')
            });
            //inject a span for the icon
            var icon = document.createElement('span');
            icon.className = 'icon';
            b1.appendChild(icon);
            b1.on('click', function() {
                var t = YAHOO.example.app.tabView.get('tabs');
                for (var i = 0; i < t.length; i++) {
                    if (t[i].get('id') == 'inboxView') {
                        YAHOO.example.app.tabView.set('activeTab', t[i]);
                    }
                }
            });
            YAHOO.log('Create the New Message button', 'info', 'button.js');
            var b2 = new YAHOO.widget.Button({
                label: 'New',
                id: 'newButton',
                title: 'New Message',
                container: Dom.get('check_buttons')
            });
            //inject a span for the icon
            var icon2 = document.createElement('span');
            icon2.className = 'icon';
            b2.appendChild(icon2);
            //Setup the click listener for the new message button
            b2.on('click', function() {
                if (!YAHOO.example.app.editor) {
                    YAHOO.log('No editor present, add the tab', 'info', 'button.js');
                    var cTab = new YAHOO.widget.Tab({
                        label: '<span class="close"></span><span class="icon"></span>New Message',
                        id: 'composeView',
                        active: true,
                        contentEl: Dom.get('composeViewEl')
                    });
                    //Add the close button to the tab
                    Event.on(cTab.get('labelEl').getElementsByTagName('span')[0], 'click', function(ev) {
                        YAHOO.log('Closing the Editor tab and destroying the Editor instance', 'info', 'button.js');
                        Event.stopEvent(ev);
                        YAHOO.example.app.tabView.set('activeTab', YAHOO.example.app.tabView.get('tabs')[0]);
                        var cel = Dom.get('composeViewEl');
                        YAHOO.example.app.destroyEditor();
                        YAHOO.example.app.tabView.removeTab(cTab);
                        document.body.appendChild(cel);

                    });
                    YAHOO.example.app.tabView.addTab(cTab);
                    YAHOO.log('Load the Editor', 'info', 'button.js');
                    window.setTimeout(function() {
                        var transactionObj = YAHOO.util.Get.script('assets/js/editor.js', { autopurge: true });
                    }, 0);
                } else {
                    YAHOO.log('If there is an editor, then activate the proper tab', 'info', 'button.js');
                    var t = YAHOO.example.app.tabView.get('tabs');
                    for (var i = 0; i < t.length; i++) {
                        if (t[i].get('id') == 'composeView') {
                            YAHOO.example.app.tabView.set('activeTab', t[i]);
                        }
                    }
                }
            });
            YAHOO.log('Add some functionality to the search box', 'info', 'button.js');
            Event.on('query', 'click', function() {
                this.value = '';
            });
            Event.on('query', 'blur', function() {
                if (this.value === '') {
                    this.value = 'Search the Web..';
                }
            });
        }
    });
    //Call insert, only choosing the JS files, so the skin doesn't over write my custom css
    loader.insert({}, 'js');
})();
