(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        layout2 = null,
        dataTable = null,
        emails = {
            account:"jenny@yahoo.com",
            currStorage: 10,
            maxStorage: 200,
            messages: []
        },
        magicNum = 345;
        

        YAHOO.log('inbox.js file is loaded..', 'info', 'inbox.js');
        var prettySize = function(size) {
            var gb = 1024 * 1024 * 1024, mb = 1024 * 1024, mysize;
            if (size > gb) {
                mysize = Math.round(size / gb) + " GB";
            } else if (size > mb) {
                mysize = Math.round(size / mb) + " MB";
            } else if ( size >= 1024 ) {
                mysize = Math.round(size / 1024) + " Kb";
            } else {
                mysize = size + " b";
            }
            return mysize;
        };
        

        var initDataTable = function(h, w) {
            YAHOO.log('Creating the DataTable', 'info', 'inbox.js');
            //Create the Column Definitions
            var myColumnDefs = [
                {key:'', formatter:YAHOO.widget.DataTable.formatCheckbox, width: 10 }, // use the built-in checkbox formatter 
                {key:"From", sortable:true, width: 125 },
                {key:"Subject", sortable:true, width: (w - magicNum) },
                {key:"Date",formatter:YAHOO.widget.DataTable.formatDate, sortable:true, width: 50 },
                {key:"Size", sortable: false, width: 35 }
            ];
            //Create the datasource
            
            var myDataSource = new YAHOO.util.DataSource(emails);
            myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
            myDataSource.responseSchema = {
                resultsList: 'messages',
                fields: ["Date","To","From","Subject",'Size', 'Link', 'Body']
            };
            //Give the DT a custom Height
            var dtH = (h - 27 - YAHOO.example.app.inboxToolbarHeight);

            //Create the DT, setting scrollable to true and setting the height
            YAHOO.widget.DataTable.MSG_EMPTY = 'This folder contains no messages';

            dataTable = new YAHOO.widget.DataTable("standard",
                    myColumnDefs, myDataSource, { scrollable: true, height: dtH + 'px', width: w + 'px' });
            
            
            // Subscribe to events for row selection
            dataTable.subscribe("rowMouseoverEvent", dataTable.onEventHighlightRow);
            dataTable.subscribe("rowMouseoutEvent", dataTable.onEventUnhighlightRow);
            dataTable.subscribe("rowClickEvent", dataTable.onEventSelectRow);
            dataTable.subscribe("rowSelectEvent", function() {
                YAHOO.log('A row is selected, lets update the preview pane below the the data from the recordset', 'info', 'inbox.js');
                var data = this.getRecordSet().getRecord(this.getSelectedRows()[0])._oData;
                var unit = YAHOO.widget.LayoutUnit.getLayoutUnitById('center2');
                unit.set('header', 'Subject: ' + data.Subject + '<br>From: ' + data.From + '<br>To: ' + data.To);
                unit.set('body', '<p>' + data.Body + '<p><p><a href="' + data.Link + '" target="_blank">See the full thread here.</a></p>');
            }, dataTable, true);

            YAHOO.example.app.dt = dataTable;
            YAHOO.example.app.inboxLoaded = true;
        };
        
        YAHOO.example.app.reloadData = function(empty) {
            if (empty === false) {
                var d = {
                    value: {
                        items: []
                    }
                };
                YAHOO.example.app.inboxDataReady(d);
            } else {
                YAHOO.log('Getting data from: ' + YAHOO.example.app.feedURL, 'info', 'inbox.js');
                YAHOO.util.Get.script('http:/'+'/pipes.yahoo.com/pipes/pipe.run?_id=kFM9h0vT3BGxGXVs8ivLAg&_render=json&_callback=YAHOO.example.app.inboxDataReady&feed=' + YAHOO.example.app.feedURL);
            }
        };

        //Pipes callback
        YAHOO.example.app.inboxDataReady = function(d) {
            YAHOO.log('Data returned from the Yahoo! Pipes callback', 'info', 'inbox.js');
            var items = d.value.items;
            emails.messages = [];
            //Create the JS Array that we will feed to the DT 
            for (var i = 0; i < items.length; i++) {
                emails.messages[emails.messages.length] = {
                    To: 'YUI User',
                    From: items[i]['dc:creator'],
                    Subject: items[i]['y:title'],
                    Date: new Date(items[i]['y:published'].year, (parseInt(items[i]['y:published'].month, 10) - 1),items[i]['y:published'].day),
                    Body: items[i].description,
                    Link: items[i].link,
                    Size: prettySize((items[i].description.length * 1024))
                };
            }
            setTimeout(function() {
                //init the datatable
                if (!YAHOO.example.app.inboxLoaded) {
                    initDataTable(layout2.getSizes().top.h, layout2.getSizes().top.w);
                } else {
                    dataTable.getRecordSet().replaceRecords(emails.messages);
                    dataTable.render();
                }
                //Setup some sizes
                layout2.getUnitByPosition('top')._setWidth(Dom.get('standard'), layout2.getSizes().top.w);
                layout2.getUnitByPosition('top')._setHeight(Dom.get('standard'), layout2.getSizes().top.h);
                YAHOO.log('Remove the loading class (icon) from the tabview..', 'info', 'inbox.js');
                YAHOO.util.Dom.removeClass(YAHOO.example.app.tabView._tabParent, 'loading');
                YAHOO.example.app.inboxLoading = false;
            }, 1000);
        };

        YAHOO.log('Using loader to fetch datatable and editor (for the toolbar)', 'info', 'inbox.js');
        var loader = new YAHOO.util.YUILoader({
            base: '../../build/',
            require: ['datatable', 'editor'],
            ignore: ['containercore'],
            onSuccess: function() {
                YAHOO.log('Inject some HTML for the content of this layout.', 'info', 'inbox.js');
                var d = document.createElement('div');
                d.innerHTML = '<div id="top2"><div id="inboxToolbar"></div><div id="standard"></div></div><div id="center2"><div class="yui-layout-bd"><div id="preview"><p><strong>Got your eye on one of those messages up there?</strong></p><p>To view your message down here in this handy Reading pane, just click on it.</p></div></div></div>';
                document.body.appendChild(d);
                YAHOO.log('Creating a second Layout for the inbox and preview pane', 'info', 'inbox.js');
                layout2 = new YAHOO.widget.Layout('inboxHolder', {
                    parent: YAHOO.example.app.layout,
                    units: [
                        { position: 'top', height: '300px', maxHeight: 700, resize: true, id: 'top2', gutter: '0 0 15 0' },
                        { position: 'center', id: 'center2', gutter: '0 0 1 0', scroll: true }
                    ]
                });
                //before the resize, update the parent with the proper height
                layout2.on('beforeResize', function() {
                    Dom.setStyle('inboxHolder', 'height', Dom.getStyle(YAHOO.example.app.tabView._contentParent, 'height'));
                });
                //On resize, resize the table and set the custom width on the Subject Column
                layout2.on('resize', function() {
                    if (dataTable) {
                        this.getUnitByPosition('top')._setWidth(Dom.get('standard'), this.getSizes().top.w);
                        this.getUnitByPosition('top')._setWidth(Dom.get('yui-dt0-table'), this.getSizes().top.w);
                        dataTable.set('height', (this.getSizes().top.h - 27 - YAHOO.example.app.inboxToolbarHeight) + 'px');
                        dataTable.set('width', (this.getSizes().top.w) + 'px');
                        dataTable.setColumnWidth(dataTable.getColumn('Subject'), (this.getSizes().top.w - magicNum));
                        dataTable._syncColWidths();
                    }
                }, layout2, true);
                layout2.on('render', function() {
                    YAHOO.log('On render create the inbox Toolbar', 'info', 'inbox.js');
                    YAHOO.example.app.inboxToolbar = new YAHOO.widget.Toolbar('inboxToolbar', {
                        buttons: [
                            { id: 'tb_delete', type: 'push', label: 'Delete', value: 'delete'},
                            { type: 'separator' },
                            { id: 'tb_reply', type: 'push', label: 'Reply', value: 'reply' },
                            { id: 'tb_forward', type: 'push', label: 'Forward', value: 'forward' },
                            { type: 'separator' },
                            { id: 'tb_spam', type: 'push', label: 'Spam', value: 'spam' },
                            { type: 'separator' },
                            { id: 'tb_move', type: 'push', label: 'Move', value: 'move' },
                            { id: 'tb_print', type: 'push', label: 'Print', value: 'print' }
                        ]
                    });
                    //Show an alert message with the button they clicked
                    YAHOO.example.app.inboxToolbar.on('buttonClick', function(ev) {
                        var data = dataTable.getRecordSet().getRecord(dataTable.getSelectedRows()[0])._oData;
                        YAHOO.example.app.alert(ev.button.label + ': ' + data.Subject);
                    });
                    //Grab it's height for later use
                    YAHOO.example.app.inboxToolbarHeight = Dom.get('inboxToolbar').clientHeight + 3;
                    
                    window.setTimeout(function() {
                        YAHOO.log('Using get to call the Yahoo! Pipe for the inbox feed', 'info', 'inbox.js');
                        YAHOO.util.Get.script('http:/'+'/pipes.yahoo.com/pipes/pipe.run?_id=kFM9h0vT3BGxGXVs8ivLAg&_render=json&_callback=YAHOO.example.app.inboxDataReady&feed=' + YAHOO.example.app.feedURL);
                    }, 0);
                }, layout2, true);
                layout2.render();
                YAHOO.example.app.layout2 = layout2;
            }
        });
        //Have loader insert only the JS files.
        loader.insert({}, 'js');
})();
