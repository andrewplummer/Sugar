(function() {
    YAHOO.log('editor.js file loaded', 'info', 'editor.js');
    YAHOO.log('Inject some HTML for the Compose Window', 'info', 'editor.js');
    YAHOO.util.Dom.get('composeViewEl').innerHTML = '<div id="composeBarWrap"><div id="composeBar"></div><div id="composeAddr"><span><label>To:</label><input type="text" id="composeTo"></span><span><label>Subject:</label><input type="text"></span></div></div><text'+'area id="compose"></text'+'area><div id="autoTo"></div>';
    //Use loader to load the Editor
    var loader = new YAHOO.util.YUILoader({
        base: '../../build/',
        require: ['autocomplete', 'editor'],
        ignore: ['containercore'],
        onSuccess: function() {
            YAHOO.log('Create a Toolbar above the To/From Fields', 'info', 'editor.js');
            YAHOO.example.app.composeToolbar = new YAHOO.widget.Toolbar('composeBar', {
                buttons: [
                    { id: 'tb_delete', type: 'push', label: 'Send', value: 'send'},
                    { id: 'tb_reply', type: 'push', label: 'Attach', value: 'attach' },
                    { id: 'tb_forward', type: 'push', label: 'Save Draft', value: 'savedraft' },
                    { id: 'tb_forward', type: 'push', label: 'Spelling', value: 'spelling' },
                    { id: 'tb_forward', type: 'push', label: 'Cancel', value: 'cancel' }
                ]
            });
            //Show an alert message with the button they clicked            
            YAHOO.example.app.composeToolbar.on('buttonClick', function(ev) {
                YAHOO.example.app.alert('You clicked: ' + ev.button.label);
            });
            
            //Custom editor resize method
            var editorResize = function() {
                var h = YAHOO.util.Dom.get('composeViewEl').parentNode.clientHeight - (YAHOO.util.Dom.get('composeBarWrap').clientHeight);
                var th = YAHOO.example.app.editor.toolbar.get('element').clientHeight;
                var newH = (h - th);
                YAHOO.example.app.editor.set('height', newH + 'px');
                YAHOO.example.app.editor.set('width', YAHOO.example.app.layout.getSizes().center.w + 'px');
            };
            YAHOO.log('Create the Editor', 'info', 'editor.js');
            var editor = new YAHOO.widget.Editor('compose', {
                width: (YAHOO.example.app.layout.getUnitByPosition('center').getSizes().body.w - 2) + 'px'
            });
            editor.on('afterRender', function() {
                YAHOO.log('The editor is loaded, resize the editor to fit the layout', 'info', 'editor.js');
                var h = YAHOO.util.Dom.get('composeViewEl').parentNode.clientHeight - (YAHOO.util.Dom.get('composeBarWrap').clientHeight);
                var th = this.toolbar.get('element').clientHeight;
                var newH = (h - th);
                this.set('height', newH + 'px');
            }, editor, true);
            //Turn off the titlebar
            editor._defaultToolbar.titlebar = false;
            YAHOO.log('Render the editor', 'info', 'editor.js');
            editor.render();
            YAHOO.example.app.editor = editor;

            //On resize and start resize handlers
            YAHOO.example.app.layout.on('resize', editorResize);
            //Method to destroy the editor.
            YAHOO.example.app.destroyEditor = function() {
                YAHOO.log('Destroying the Editor instance and HTML', 'info', 'editor.js');
                YAHOO.example.app.layout.unsubscribe('resize', editorResize);
                YAHOO.example.app.editor = null;
            };

            YAHOO.log('Setup the AutoComplete for the To Field', 'info', 'editor.js');
            //Build some fake data..
            var team = [
                'Dav',
                'Thomas',
                'Eric',
                'Matt',
                'Adam',
                'Lucas',
                'Nate',
                'Jenny',
                'Satyen',
                'Todd',
                'George'
            ], data = [];

            for (var i = 0; i < team.length; i++) {
                for (var s = 0; s < 5; s++) {
                    data[data.length] = team[i] + ' (' + s + ') [' + team[i].toLowerCase() + '@yui.com]';
                }
            }
            // Instantiate JS Array DataSource
            var oACDS2 = new YAHOO.widget.DS_JSArray(data);
            YAHOO.log('Instantiate AutoComplete', 'info', 'editor.js');
            var oAutoComp = new YAHOO.widget.AutoComplete('composeTo','autoTo', oACDS2);
            oAutoComp.prehighlightClassName = "yui-ac-prehighlight";
            oAutoComp.typeAhead = true;
            oAutoComp.useIFrame = true;
        }
    });
    //Have loader only insert the js files..
    loader.insert({}, 'js');
})();
