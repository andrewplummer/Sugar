var editor = null;
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Tool = YAHOO.tool,
        Suite = new Tool.TestSuite('yuisuite'),
        Assert = YAHOO.util.Assert,
        eFocus = null;



    Event.onDOMReady(function() {
        editor = new YAHOO.widget.Editor('editor', {
            dompath: true,
            nodeChangeDelay: false,
            removeLineBreaks: true,
            animate: true,
            width: '700px',
            resize: true,
            drag: true
        });
        editor.render();

        var logger = new Tool.TestLogger(null, { height: '80%' });
        editor.on('windowRender', function() { //We have to wait until the all windows render before we can start testing it..
            Suite.add( new Tool.TestCase({
                name: 'YAHOO.widget.Editor',
                test_render: function() {
                    Assert.areEqual(Dom.get('editor_container'), editor.get('element_cont').get('element'), 'Could not find Editors container');
                    Assert.areEqual(Dom.get('editor_toolbar'), editor.toolbar.get('element'), 'Could not find Editors Toolbar');
                    Assert.isInstanceOf(YAHOO.widget.Toolbar, editor.toolbar, 'Could not find Toolbars Instance');
                    Assert.areEqual(Dom.getStyle('editor', 'display'), editor.getStyle('display'), 'Textarea is visible..');
                    Assert.isInstanceOf(YAHOO.widget.Overlay, editor.get('panel'), 'Could not find Overlay Instance');
                },
                test_content: function() {
                    var t_data = Dom.get('editor').value;
                    var e_data = editor.getEditorHTML();
                    Assert.areEqual(t_data, e_data, 'Editor data is different than text area');
                },
                test_window: function() {
                    Assert.areEqual(document.getElementById('editor_editor').contentWindow, editor._getWindow(), 'Window object is not right');
                },
                test_doc: function() {
                    Assert.areEqual(document.getElementById('editor_editor').contentWindow.document, editor._getDoc(), 'Document object is not right');
                },
                test_focus: function() {
                    YAHOO.util.UserAction.click(document);

                    editor.on('editorWindowFocus', function() {
                        eFocus = true;
                    });
                    editor.focus();
                    editor.afterElement.focus();

                    Assert.areEqual(true, eFocus, 'Editor focus event FAILED');
                },
                test_ol_list_create_inline: function() {
                    var html = 'Item1<br>Item2<br>Item3<br>Item4<br>';
                    editor.setEditorHTML(html);
                    editor.execCommand('selectall');
                    editor.execCommand('insertorderedlist', '');
                    var ol = editor._getDoc().getElementsByTagName('ol');
                    Assert.areEqual(ol.length, 1, 'Failed to create list from source');
                    var lis = editor._getDoc().getElementsByTagName('li');
                    Assert.areEqual(lis.length, 4, 'Failed to create list items from source');
                    editor.execCommand('selectall');
                    editor.execCommand('insertorderedlist', '');
                    var lis = editor._getDoc().getElementsByTagName('li');
                    Assert.areEqual(lis.length, 0, 'Failed to remove list items from source');
                },
                test_ul_list_create_inline: function() {
                    var html = 'Item1<br>Item2<br>Item3<br>Item4<br>Item5<br>Item6<br>Item7';
                    editor.setEditorHTML(html);
                    editor.execCommand('selectall');
                    editor.execCommand('insertunorderedlist', '');
                    var ul = editor._getDoc().getElementsByTagName('ul');
                    Assert.areEqual(ul.length, 1, 'Failed to create list from source');
                    var lis = editor._getDoc().getElementsByTagName('li');
                    Assert.areEqual(lis.length, 7, 'Failed to create list items from source');
                    editor.execCommand('selectall');
                    editor.execCommand('insertunorderedlist', '');
                    var lis = editor._getDoc().getElementsByTagName('li');
                    Assert.areEqual(lis.length, 0, 'Failed to remove list items from source');
                },
                test_regex: function() {
                    editor.setEditorHTML(Dom.get('testRegEx').innerHTML);
                    //editor._getDoc().body.innerHTML = Dom.get('testRegEx').innerHTML;
                    var e_data = (editor.cleanHTML()).toLowerCase().replace(/;"/g, '"');
                    var real_data = editor.filter_all_rgb(Dom.get('testRegEx2').innerHTML.toLowerCase()).replace(/;"/g, '"');
                    Assert.areEqual(real_data, e_data, 'Regex save routine failed');
                },
                
                test_blank_image: function() {
                    editor.toolbar.resetAllButtons();
                    var picURL = editor.get('blankimage');
                    editor._focusWindow();
                    editor.toolbar.getButtonByValue('insertimage').fireEvent('mousedown', { ev: 'mousedown' });
                    var pic = editor._getDoc().getElementsByTagName('img')[0];

                    Assert.areEqual(picURL, pic.getAttribute('src', 2), 'Image source and string do not match');
                    Assert.isInstanceOf(YAHOO.widget.EditorWindow, editor.currentWindow, 'Editor Window Failed to Open');
                    editor.closeWindow();
                    Assert.areEqual(null, editor.currentWindow, 'Editor Window Failed to Close');
                    editor.toolbar.resetAllButtons();
                    Assert.areEqual(null, pic.parentNode, 'Image is still inside the editor');

                },
                test_selected_element: function() {
                    
                    editor.setEditorHTML('<em id="test">This is a test element</em>');
                    var em = editor._getDoc().getElementById('test');
                    editor._selectNode(em);
                    
                    Assert.areEqual(editor._getDoc().getElementById('test'), editor._getSelectedElement(), 'Selected Element is not em#test');
                    Assert.areEqual(true, editor.toolbar.getButtonByValue('italic').hasClass('yui-button-selected'), 'Italic button is not selected');
                    editor.toolbar.resetAllButtons();
                    
                },
                test_dom_path: function() {
                    editor.setEditorHTML('<p>This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test.</p><p>This is a test. This is a test. <em style="font-family: Comic Sans MS">This is a test. <strong id="test">This is a test.</strong> This is a test.</em> This is a test. This is a test. This is a test.</p><p>This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test.</p>');
                    var em = editor._getDoc().getElementById('test');
                    editor._selectNode(em);
                    //Editor timing is out here, force a DomPath write..
                    editor._writeDomPath();
                    Assert.areEqual('<span title=body>body</span> &lt; <span title=p>p</span> &lt; <span title=em>em</span> &lt; <span title=strong#test>strong#tes...</span>', editor.dompath.innerHTML.toLowerCase().replace(/"/g, ''), 'Dom path is not correct..');
                    Assert.areEqual(true, editor.toolbar.getButtonByValue('bold').hasClass('yui-button-selected'), 'Bold button is not selected');
                    Assert.areEqual(true, editor.toolbar.getButtonByValue('italic').hasClass('yui-button-selected'), 'Italic button is not selected');
                    editor.toolbar.resetAllButtons();
                },
                test_insertimage: function() {
                    var picURL = 'http:/'+'/farm1.static.flickr.com/171/379031784_e4ba36a375_t_d.jpg';
                    editor._focusWindow();
                    editor.execCommand('insertimage', picURL);
                    var pic = editor._getDoc().getElementsByTagName('img')[0];

                    Assert.areEqual(picURL, pic.getAttribute('src', 2));
                },
                test_image_props: function() {
                    var pic = editor._getDoc().getElementsByTagName('img')[0];
                    YAHOO.util.UserAction.dblclick(pic);
                    Assert.isInstanceOf(YAHOO.widget.EditorWindow, editor.currentWindow, 'Editor Window Failed to Open');
                },
                test_close_window: function() {
                    editor.closeWindow();
                    Assert.areEqual(null, editor.currentWindow, 'Editor Window Failed to Close');
                    editor.toolbar.resetAllButtons();
                },
                test_hidden_elements: function() {
                    editor.toolbar.getButtonByValue('hiddenelements').fireEvent('mousedown', { ev: 'mousedown' });
                    Assert.areEqual(true, Dom.hasClass(editor._getDoc().body, 'yui-hidden'), 'hidden class is not on the body');
                    editor.toolbar.getButtonByValue('hiddenelements').fireEvent('mousedown', { ev: 'mousedown' });
                    Assert.areEqual(false, Dom.hasClass(editor._getDoc().body, 'yui-hidden'), 'hidden class is on the body');
                },
                test_event_before_mouseup: function() {
                    var event = false;
                    editor.on('beforeEditorMouseUp', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.mouseup(editor._getDoc().body);
                    Assert.areEqual(true, event, 'BeforeMouseUP Event failed to Fired');
                },
                test_event_mouseup: function() {
                    var event = false;
                    editor.on('editorMouseUp', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.mouseup(editor._getDoc().body);
                    Assert.areEqual(true, event, 'MouseUP Event failed to Fired');
                },
                test_event_before_mousedown: function() {
                    var event = false;
                    editor.on('beforeEditorMouseDown', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.mousedown(editor._getDoc().body);
                    Assert.areEqual(true, event, 'BeforeMouseDsaveown Event failed to Fired');
                },
                test_event_mousedown: function() {
                    var event = false;
                    editor.on('editorMouseDown', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.mousedown(editor._getDoc().body);
                    Assert.areEqual(true, event, 'MouseDown Event failed to Fired');
                },
                test_event_before_click: function() {
                    var event = false;
                    editor.on('beforeEditorClick', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.click(editor._getDoc().body);
                    Assert.areEqual(true, event, 'BeforeClick Event failed to Fired');
                },
                test_event_click: function() {
                    var event = false;
                    editor.on('editorClick', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.click(editor._getDoc().body);
                    Assert.areEqual(true, event, 'Click Event failed to Fired');
                },
                test_event_before_double_click: function() {
                    var event = false;
                    editor.on('beforeEditorDoubleClick', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.dblclick(editor._getDoc().body);
                    Assert.areEqual(true, event, 'BeforeDoubleClick Event failed to Fired');
                },
                test_event_double_click: function() {
                    var event = false;
                    editor.on('editorDoubleClick', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.dblclick(editor._getDoc().body);
                    Assert.areEqual(true, event, 'DoubleClick Event failed to Fired');
                },
                test_event_before_keyup: function() {
                    var event = false;
                    editor.on('beforeEditorKeyUp', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.keyup(editor._getDoc().body);
                    Assert.areEqual(true, event, 'beforeKeyUp Event failed to Fired');
                },
                test_event_keyup: function() {
                    var event = false;
                    editor.on('editorKeyUp', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.keyup(editor._getDoc().body);
                    Assert.areEqual(true, event, 'KeyUp Event failed to Fired');
                },
                test_event_before_keydown: function() {
                    var event = false;
                    editor.on('beforeEditorKeyDown', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.keydown(editor._getDoc().body);
                    Assert.areEqual(true, event, 'BeforeKeyDown Event failed to Fired');
                },
                test_event_keydown: function() {
                    var event = false;
                    editor.on('editorKeyDown', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.keydown(editor._getDoc().body);
                    Assert.areEqual(true, event, 'KeyDown Event failed to Fired');
                },
                test_event_before_keypress: function() {
                    var event = false;
                    editor.on('beforeEditorKeyPress', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.keypress(editor._getDoc().body);
                    Assert.areEqual(true, event, 'BeforeKeyPress Event failed to Fired');
                },
                test_event_keypress: function() {
                    var event = false;
                    editor.on('editorKeyPress', function() {
                        event = true;
                    });
                    YAHOO.util.UserAction.keypress(editor._getDoc().body);
                    Assert.areEqual(true, event, 'KeyPress Event failed to Fired');
                },
                test_createlink: function() {
                    editor.toolbar.resetAllButtons();
                    editor.setEditorHTML('test');
                    var e_data = editor.getEditorHTML();
                    Assert.areEqual('test', e_data, 'Editor data is different than what was injected');
                    editor.execCommand('selectall', ''); //FF 3.5 doesn't like this when contentEditable is used
                    editor.toolbar.getButtonByValue('createlink').fireEvent('mousedown', { ev: 'mousedown' });
                    
                    Assert.isInstanceOf(YAHOO.widget.EditorWindow, editor.currentWindow, 'Editor Window Failed to Open');
                    Dom.get(editor.get('id') + '_createlink_url').value = 'http:/'+'/www.yahoo.com';

                    editor.closeWindow();
                    Assert.areEqual(null, editor.currentWindow, 'Editor Window Failed to Close');

                    var link = editor._getDoc().getElementsByTagName('a')[0];
                    var linkURL = link.getAttribute('href', 2);

                    Assert.areEqual('http:/'+'/www.yahoo.com', linkURL, 'Link url does not match what was set');
                    editor.toolbar.resetAllButtons();
                },
                test_content_after: function() {
                    var t_data = Dom.get('editor').value;
                    editor.setEditorHTML(t_data);
                    var e_data = editor.getEditorHTML();
                    Assert.areEqual(t_data, e_data, 'Editor data is different than text area');
                },
                test_dd: function() {
                    Assert.isInstanceOf(YAHOO.util.DD, editor.dd, 'DD not instantiated');
                },
                test_resize: function() {
                    Assert.isInstanceOf(YAHOO.util.Resize, editor.resize, 'Resize not instantiated');
                },
                test_headers: function() {
                    for (var i = 1; i < 6; i++) {
                        editor.setEditorHTML('This is a test header #' + i);
                        editor.execCommand('selectall', '');
                        editor.execCommand('heading', 'h' + i);
                        var h1 = editor._getDoc().body.getElementsByTagName('h' + i);
                        Assert.areEqual(h1.length, 1, 'Did not find one H' + i + ' tag');
                    }
                },
                test_forecolor: function() {
                    editor.setEditorHTML('TEST');
                    editor.execCommand('selectall', '');
                    editor.execCommand('forecolor', '#bebebe');
                    var el = editor._getDoc().body.firstChild;
                    var color = editor.filter_rgb(el.style.color);
                    Assert.areEqual(color, '#bebebe', 'Fore Colors do not match');
                },
                test_backcolor: function() {
                    editor.setEditorHTML('TEST');
                    editor.execCommand('selectall', '');
                    editor.execCommand('backcolor', '#bebebe');
                    var el = editor._getDoc().body.firstChild;
                    var color = editor.filter_rgb(el.style.backgroundColor);
                    Assert.areEqual(color, '#bebebe', 'Back Colors do not match');
                },
                test_forecolor_font: function() {
                    editor.setEditorHTML('TEST');
                    editor.execCommand('selectall', '');
                    editor.execCommand('fontname', 'Verdana');
                    editor.execCommand('selectall', '');
                    editor.execCommand('forecolor', '#bebebe');
                    var el = editor._getDoc().body.firstChild;
                    var color = editor.filter_rgb(el.style.color);
                    Assert.areEqual(color, '#bebebe', 'Fore Colors do not match');
                    Assert.areEqual(el.style.fontFamily, 'Verdana', 'Font Names do not match');
                },
                test_forecolor_font_el: function() {
                    editor.setEditorHTML('<b>TEST</b>');
                    editor.execCommand('selectall', '');
                    editor.execCommand('fontname', 'Verdana');
                    editor.execCommand('selectall', '');
                    editor.execCommand('forecolor', '#bebebe');
                    var el = editor._getDoc().body.firstChild,
                        testel = el;
                    
                    if (Dom.getFirstChild(el)) {
                        testel = el.firstChild;
                    }
                    var color = editor.filter_rgb(testel.style.color);
                    Assert.areEqual(color, '#bebebe', 'Fore Colors do not match');
                    Assert.areEqual(testel.style.fontFamily, 'Verdana', 'Font Names do not match');
                    Assert.areEqual(el.tagName.toLowerCase(), 'b', 'Elements do not match');
                },
                test_disable: function() {
                    editor.set('disabled', true);
                    Assert.isInstanceOf(YAHOO.util.Element, editor.get('disabled_iframe'), 'No Disabled Iframe');
                    Assert.isInstanceOf(YAHOO.util.Element, editor._orgIframe, 'No Org Iframe');
                    Assert.areEqual(editor.get('iframe'), editor.get('disabled_iframe'), 'Current iframe and disabled iframe are not the same');
                    Assert.isNotNull(editor._mask, 'Mask is null');
                    editor.set('disabled', false);
                    Assert.areEqual(editor.get('iframe'), editor._orgIframe, 'Current iframe and orginal iframe are not the same');
                    Assert.isNull(editor._mask, 'Mask is not null');

                },
                test_destroy: function() {
                    //More Tests Here
                    var panel = editor.get('panel').element;
                    editor.destroy();
                    Assert.isNull(panel.offsetParent, 'Panel offsetParent is not null')
                },
                test_render_node: function() {
                    var el = document.getElementById('editor');
                    editor = new YAHOO.widget.SimpleEditor(el);
                    editor.render();
                    Assert.areEqual(true, editor._rendered, 'Editor failed to render with HTML element passed to constructor');
                    window.setTimeout(function() {
                        editor.destroy();
                    }, 2000);
                },
                test_no_textarea: function() {
                    var div = document.createElement('div');
                    div.id = 'editor_div';
                    div.style.height = '300px';
                    div.style.width = '700px';
                    div.innerHTML = '<strong>This is a new div</strong>';
                    document.body.appendChild(div);

                    editor2 = new YAHOO.widget.SimpleEditor('editor_div');
                    editor2.render();
                    window.setTimeout(function() {
                        editor2.destroy();
                    }, 3000);
                    Assert.areEqual('div', editor2._configs.element.value.tagName.toLowerCase(), 'Editor failed to render with HTML element (non TEXTAREA) passed to constructor');
                }
            })); 
            Tool.TestRunner.add(Suite);

            if (parent && parent != window) {
                YAHOO.tool.TestManager.load();
            } else {
                YAHOO.tool.TestRunner.run();
            }
        });
    }); 
})();

