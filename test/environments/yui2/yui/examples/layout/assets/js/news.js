(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Sel = YAHOO.util.Selector,
        tt = null,
        pdata = {};
        YAHOO.log('news.js file loaded..', 'info', 'news.js');
        //Callback from the Pipes data call
        YAHOO.example.app.getWeather = function(r) {
            //Sometimes pipes fails..
            if (r && r.value && r.value.items && r.value.items.length) {
                YAHOO.log('Inside weather callback from Pipes data', 'info', 'news.js');
                var data = r.value.items[1].content;
                var img = data[0].content.substring(10);
                img = img.substring(0, (img.length - 3));
                Sel.query('#weather em', '', true).innerHTML = data[2].content; //Tempurature
                Dom.setStyle('weather', 'background-image', 'url( ' + img + ' )');
                var url = data[8].content;
                url = url.substring(url.indexOf('http'));
                url = url.substring(0, url.indexOf('">'));
                YAHOO.log('Creating the Weather tooltip', 'info', 'news.js');
                var tt = new YAHOO.widget.Tooltip('weatherTooltip', { 
	                context: 'weather', 
	                text: r.value.items[0].content + '<br><strong>Forecast:</strong><br>' + data[5].content + '<br>' + data[6].content
                });
                
                Event.on('weather', 'click', function() {
                    window.open(url);
                });
            } else {
                //Attempt to fetch it again
                window.setTimeout(function() {
                    YAHOO.util.Get.script('http:/'+'/pipes.yahoo.com/pipes/pipe.run?_id=cnZFI_rR3BGvnn8h8ivLAg&_render=json&_callback=YAHOO.example.app.getWeather');
                }, 5000);
            }
        };
        YAHOO.log('Get the weather data from Pipes..', 'info', 'news.js');
        YAHOO.util.Get.script('http:/'+'/pipes.yahoo.com/pipes/pipe.run?_id=cnZFI_rR3BGvnn8h8ivLAg&_render=json&_callback=YAHOO.example.app.getWeather');
        //Generic Filter Method
        var _filter = function(r, type) {
            pdata[type] = [];
            var data = r.value.items,
                str = '';
                pdata[type][0] = data[0];
                for (var i = 1; i < data.length; i++) {
                    pdata[type][i] = data[i];
                    if (i <= 8) {
                        str += '<li><a href="' + data[i].link + '" target="_blank" class="' + type + '_' + i + '">' + data[i].title + '</a></li>';
                    }
                }
                str = '<ul>' + str + '</ul>';
                var d = data[0].description.replace('</a>', '<h3><a href="' + data[0].link + '">' + data[0].title + '</a></h3>');
                str =  d + str;
                str += '<p><a href="#' + type + '" class="moreNews">Click here for more news...</a></p>';
            return str;
        };
        YAHOO.example.app.getWorldNews = function(r) {
            YAHOO.log('Fetch the World News', 'info', 'news.js');
            var str = _filter(r, 'world');
            YAHOO.example.app.homeTabView.get('tabs')[1].set('content', str);
        };
        YAHOO.example.app.getEntNews = function(r) {
            YAHOO.log('Fetch the Entertainment News', 'info', 'news.js');
            var str = _filter(r, 'ent');
            YAHOO.example.app.homeTabView.get('tabs')[2].set('content', str);
        };
        YAHOO.example.app.getSportsNews = function(r) {
            YAHOO.log('Fetch the Sports News', 'info', 'news.js');
            var str = _filter(r, 'sports');
            YAHOO.example.app.homeTabView.get('tabs')[3].set('content', str);
        };
        YAHOO.example.app.getTopNews = function(r) {
            YAHOO.log('Fetch the Top News', 'info', 'news.js');
            var str = _filter(r, 'top');
            YAHOO.example.app.homeTabView.get('tabs')[0].set('content', str);
            //Now that the Top news is loaded, load the other news in a timeout..
            window.setTimeout(function() {
                YAHOO.util.Get.script('http:/'+'/pipes.yahoo.com/pipes/pipe.run?_id=VE3fZVjT3BG0lA1gjtzu1g&newsfeed=world&_render=json&_callback=YAHOO.example.app.getWorldNews'); 
                YAHOO.util.Get.script('http:/'+'/pipes.yahoo.com/pipes/pipe.run?_id=VE3fZVjT3BG0lA1gjtzu1g&newsfeed=entertainment&_render=json&_callback=YAHOO.example.app.getEntNews'); 
                YAHOO.util.Get.script('http:/'+'/pipes.yahoo.com/pipes/pipe.run?_id=VE3fZVjT3BG0lA1gjtzu1g&newsfeed=sports&_render=json&_callback=YAHOO.example.app.getSportsNews'); 
            }, 0);
            YAHOO.log('Create a dynamic tooltip on the news articles', 'info', 'news.js');
            tt = new YAHOO.widget.Tooltip('newsTip', {
                context: Sel.query('#news .yui-content'),
                text: 'Test',
                width: '300px',
	            showDelay: 500,
                hideDelay: 500
            });
            //Listen for the contextMouseOverEvent
            tt.contextMouseOverEvent.subscribe(function(cev, ev) {
                //Get the target of the mouseover event
                var tar = Event.getTarget(ev[1]);
                //It needs to be an A tag
                if (tar && tar.tagName && (tar.tagName.toLowerCase() == 'a')) {
                    //Does it have a className
                    if (tar.className) {
                        //Split the className on the _ (data placed above)
                        var tmp = tar.className.split('_');
                        //Get the data from the pdata object
                        if (tmp.length != 2) {
                            return false;
                        }
                        var d = pdata[tmp[0]][tmp[1]];
                        if (d) {
                            //It exists, parse it and set the Tooltip's text property with the descrition of the news article
                            var data = d.description.replace('</a>', '</a><h3>' + d.title + '</h3>');
                            tt.cfg.setProperty('text', data);
                        } else {
                            //Failed don't show the TT
                            return false;
                        }
                    } else {
                        //Failed don't show the TT
                        return false;
                    }
                } else {
                    //Failed don't show the TT
                    return false;
                }
            });
            Event.on('news', 'click', function(ev) {
                var tar = Event.getTarget(ev);
                //Did we click on an a inside #news with the className of moreNews
                if (Sel.test(tar, '#news a.moreNews')) {
                    YAHOO.log('You clicked on a More News link', 'info', 'news.js');
                    Event.stopEvent(ev);
                    //Get the news type
                    var type = tar.getAttribute('href', 2).split('#')[1];
                    //get all of the tabs
                    var t = YAHOO.example.app.tabView.get('tabs');
                    var tab = null;
                    for (var i = 0; i < t.length; i++) {
                        if (t[i].get('id') == 'newsView') {
                            YAHOO.log('We found an existing newsView tab', 'info', 'news.js');
                            //setup a reference and change it to the active tab
                            tab = t[i];
                            YAHOO.example.app.tabView.set('activeTab', tab);
                        }
                    }
                    //get the data from the pdata array (above)
                    var data = pdata[type], news = '';
                    //Loop through it and create the news string
                    for (var n = 0; n < data.length; n++) {
                        news += '<div class="feedData">' + data[n].description.replace('</a>', '<h3><a href="' + data[n].link + '">' + data[n].title + '</a></h3>') + '</div>';
                    }
                    if (!tab) {
                        YAHOO.log('News Tab doesn\'t exist, create it', 'info', 'news.js');
                        var nt = document.createElement('div');
                        nt.id = 'newsEl';
                        YAHOO.example.app.tabView._contentParent.appendChild(nt);
                        tab = new YAHOO.widget.Tab({
                            label: '<span class="close"></span>News Reader',
                            id: 'newsView',
                            content: '',
                            contentEl: nt,
                            active: true
                        });
                        Dom.setStyle(nt, 'height', Dom.getStyle(YAHOO.example.app.tabView._contentParent, 'height'));
                        YAHOO.example.app.layout.on('resize', function() {
                            Dom.setStyle(nt, 'height', Dom.getStyle(YAHOO.example.app.tabView._contentParent, 'height'));
                        });
                        YAHOO.log('Use YUILoader to fetch slider', 'info', 'news.js');
                        var loader = new YAHOO.util.YUILoader({
                                base: '../../build/',
                                require: ['slider'],
                                onSuccess: function() {
                                    //Setup our default article size and font size
                                    var s = 500, f = 93;
                                    //Create the slider wrapper
                                    var d = document.createElement('div');
                                    d.id = 'newsSlider';
                                    //Inject the Slider HTML
                                    d.innerHTML = '<h3>Adjust font and article size</h3><div id="slider-bg" tabindex="-1" title="Adjust font and article size"><div id="slider-thumb"><img src="assets/css/thumb-n.gif"></div></div>';
                                    //Give the Slider a little UI update when mousing over it..
                                    Event.on(d, 'mouseover', function() {
                                        Dom.addClass(this, 'over');
                                    });
                                    Event.on(d, 'mouseout', function() {
                                        Dom.removeClass(this, 'over');
                                    });
                                    //Append the wrapper to the TabView's content parent
                                    YAHOO.example.app.tabView._contentParent.appendChild(d);
                                    YAHOO.log('Create the slider', 'info', 'news.js');
                                    var slider = YAHOO.widget.Slider.getHorizSlider('slider-bg', 'slider-thumb', 0, 200);
                                    slider.subscribe('change', function(o) {
                                        //On change we will change the width and the font-size of the newsFeed div
                                        Dom.setStyle(Sel.query('.newsFeeds'), 'font-size', (f + (o / 3)) + '%');
                                        Dom.setStyle(Sel.query('.newsFeeds'), 'width', (s + (o * 2)) + 'px');
                                    });
                                    //Hook into the tabView activeTabChange event to hide the slider when it is not being used.
                                    YAHOO.example.app.tabView.on('activeTabChange', function(ev) {
                                        //Tabs have changed
                                        if (ev.newValue.get('id') == 'newsView') {
                                            YAHOO.log('Show slider', 'info', 'news.js');
                                            Dom.setStyle(d, 'display', 'block');
                                        } else {
                                            YAHOO.log('Hide Slider', 'info', 'news.js');
                                            Dom.setStyle(d, 'display', 'none');
                                        }
                                    });
                                    
                                }
                            });
                            //Inject the scripts
                            loader.insert({}, 'js');

                        
                        YAHOO.log('Add the close button to the tab', 'info', 'news.js');
                        Event.on(tab.get('labelEl').getElementsByTagName('span')[0], 'click', function(ev) {
                            Event.stopEvent(ev);
                            YAHOO.log('Close the news tab', 'info', 'news.js');
                            YAHOO.example.app.tabView.set('activeTab', YAHOO.example.app.tabView.get('tabs')[0]);
                            YAHOO.example.app.tabView.removeTab(tab);
                            Dom.get('newsSlider').parentNode.removeChild(Dom.get('newsSlider'));
                        });
                        YAHOO.log('Add the tab to the tabView', 'info', 'news.js');
                        YAHOO.example.app.tabView.addTab(tab);
                    }
                    YAHOO.log('Set the content of the tab to the string news', 'info', 'news.js');
                    tab.set('content', '<div class="newsFeeds">' + news + '</div>');
                }
            });
        };
        

        YAHOO.log('Create the tabview for the home screen', 'info', 'news.js');
        YAHOO.example.app.homeTabView = new YAHOO.widget.TabView('news');
        window.setTimeout(function() {
            YAHOO.util.Get.script('http:/'+'/pipes.yahoo.com/pipes/pipe.run?_id=VE3fZVjT3BG0lA1gjtzu1g&newsfeed=topstories&_render=json&_callback=YAHOO.example.app.getTopNews'); 
        }, 0);

})();
