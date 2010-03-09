(function () {

	var Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event,
		UA = YAHOO.env.ua,
		Lang = YAHOO.lang,
		
		TabViewPrototype = YAHOO.widget.TabView.prototype,
		fnTabViewInitAttributes = TabViewPrototype.initAttributes,
		fnTabViewAddTab = TabViewPrototype.addTab,

		m_bUseARIA = (UA.gecko && UA.gecko >= 1.9) || (UA.ie && UA.ie >= 8),
		m_oTabListItems = {},
		m_oTabIndexMap = {},


		// Private constants for strings

		_A = "A",
		_ARIA_PREFIX = "aria-",
		_USE_ARIA = "usearia",
		_ELEMENT = "element",
		_ACTIVE_TAB = "activeTab",
		_ROLE = "role",
		_PRESENTATION = "presentation",
		_TAB = "tab",
		_HREF = "href",
		_CONTENT_EL = "contentEl",
		_TAB_PANEL = "tabpanel",
		_LABELLED_BY = "labelledby",
		_DESCRIBED_BY = "describedby",		
		_ACTIVE_INDEX = "activeIndex",
		_TAB_LIST = "tablist",
		_KEY_PRESS = "keypress",
		_KEY_DOWN = "keydown",
		_ID = "id";
		

	var setARIARole = function (element, role) {
	
		element.setAttribute(_ROLE, role);
	
	};

	var setARIAProperty = function (element, property, value) {

		element.setAttribute((_ARIA_PREFIX + property), value);
	
	};


	//	Returns the <A> element representing each Tab in the TabView.

	var getTabAnchor = function (element) {
	
		var oTabAnchor;
	
		if (Dom.getAncestorByClassName(element, this.TAB_PARENT_CLASSNAME)) {

			if (element.nodeName.toUpperCase() === _A) {
				oTabAnchor = element;
			}
			else {
				oTabAnchor = Dom.getAncestorByTagName(element, _A);
			}

		}
		
		return oTabAnchor;
	
	};


	var onKeyPress = function (event) {
			
		var oTabAnchor = getTabAnchor.call(this, Event.getTarget(event)),
			nCharCode = Event.getCharCode(event);

		if (oTabAnchor && (nCharCode === 13 || nCharCode === 32) && 
			(oTabAnchor.parentNode !== this.get(_ACTIVE_TAB).get(_ELEMENT))) {

			this.set(_ACTIVE_INDEX, m_oTabIndexMap[this.get(_ID)][oTabAnchor.id]);
		
		}
	
	};


	var onKeyDown = function (event) {
	
		var oCurrentTabAnchor = getTabAnchor.call(this, Event.getTarget(event)),
			aTabListItems = m_oTabListItems[this.get(_ID)],
			oCurrentTabLI,
			oNextTabLI,
			oNextTabAnchor;


		if (oCurrentTabAnchor) {

			oCurrentTabLI = oCurrentTabAnchor.parentNode;

			switch (Event.getCharCode(event)) {

				case 37:	// Left
				case 38:	// Up

					oNextTabLI = Dom.getPreviousSibling(oCurrentTabLI);
					
					if (!oNextTabLI) { 
						oNextTabLI = aTabListItems[aTabListItems.length-1];
					}
				
				
				break;

				case 39:	// Right
				case 40:	// Down

					oNextTabLI = Dom.getNextSibling(oCurrentTabLI);
					
					if (!oNextTabLI) { 
						oNextTabLI = aTabListItems[0];
					}
				
				break;
			
			}


			if (oNextTabLI) {

				oNextTabAnchor = Dom.getFirstChild(oNextTabLI);
	
				oCurrentTabAnchor.tabIndex = -1;
				oNextTabAnchor.tabIndex = 0;
	
				oNextTabAnchor.focus();
			
			}

		}

	};


	Lang.augmentObject(TabViewPrototype, {

		addTab: function (tab, index) {
		
			fnTabViewAddTab.apply(this, arguments);
	
			var sID = this.get(_ID),
				aTabListItems = m_oTabListItems[sID],
				oTabEl,
				oTabAnchor,
				oTabContentEl,
				sTabId;
	

			if (this.get(_USE_ARIA)) {
	
	
				oTabEl = tab.get(_ELEMENT);
				oTabAnchor = Dom.getFirstChild(oTabEl);
	
	
				//	Set the "tabIndex" attribute of each Tab's <A> element: The 
				//	"tabIndex" of the active Tab's <A> element is set to 0, the others to -1.
				//	This improves the keyboard accessibility of the TabView by placing
				//	only one Tab in the browser's tab index by default, allowing the user
				//	to easily skip over the control when navigating the page with the tab key.	
		
				oTabAnchor.tabIndex = (this.get(_ACTIVE_TAB) === tab) ? 0 : -1;
		
		
				//	Create a map that links the ids of each Tab's <A> element to  
				//	the Tab's "index" attribute to make it possible to retrieve a Tab
				//	instance reference by id.
		
				sTabId = oTabAnchor.id || Dom.generateId(oTabAnchor);
		
				m_oTabIndexMap[sID][sTabId] = this.getTabIndex(tab);
		
		
				//	Need to set the "role" attribute of each Tab's <LI> element to 
				//  "presentation" so that Window-Eyes recognizes that each Tab belongs to 
				//	the same TabList. Without this, Window-Eyes will announce each Tab as  
				//	being "1 of 1" as opposed to "1 of 3," or "2 of 3".
		
				setARIARole(oTabEl, _PRESENTATION);
		
				setARIARole(oTabAnchor, _TAB);
		
		
		
				//	JAWS announces the value of the "href" attribute of each Tab's <A>  
				//	element when it recieves focus.  Ideally JAWS would allow the 
				//	applied "role" attribute of "tab" to take precedence over the default   
				//  role of the <A> element like NVDA and Window-Eyes do.  It is 
				//	possible to fix this problem by removing the "href" attribute from 
				//	the <A>.
		
				oTabAnchor.removeAttribute(_HREF);
		
		
				oTabContentEl = tab.get(_CONTENT_EL);
				
	
				aTabListItems[aTabListItems.length] = oTabContentEl;
		
	
				setARIARole(oTabContentEl, _TAB_PANEL);
				
		
				//	Set the "aria-labelledby" attribute for the TabPanel <LI> element to 
				//	the id of its corresponding Tab's <A> element.  Doing so enables the 
				//	screen reader to announce the label of the Tab for each TabPanel when  
				//	the first element in a TabPanel receives focus, providing the user  
				//	with some context as to where they are.
				
				oTabContentEl.setAttribute(_LABELLED_BY, sTabId);
			
			}
		
		},

		_setLabelledBy: function (id) {

			var oTabList = Dom.getFirstChild(this.get(_ELEMENT));

			if (this.get(_USE_ARIA) && oTabList) {
				setARIAProperty(oTabList, _LABELLED_BY, id);
			}
			
		},
		
		_setDescribedBy: function (id) {

			var oTabList = Dom.getFirstChild(this.get(_ELEMENT));

			if (this.get(_USE_ARIA) && oTabList) {
				setARIAProperty(oTabList, _DESCRIBED_BY, id);
			}
		
		},
	
		_setUseARIA: function (p_bUseARIA) {	
	
			var oTabList,
            	sID;

	
			if (p_bUseARIA) {

            	sID = this.get(_ID);

				if (!sID) {
					this.set(_ID, Dom.generateId());
					sID = this.get(_ID);
				}
	
	
				m_oTabListItems[sID] = [];
				m_oTabIndexMap[sID] = {};
	

				oTabList = Dom.getFirstChild(this.get(_ELEMENT));


				//	Set the "role" attribute of the <UL> encapsulating the Tabs to "tablist"
		
				if (!oTabList) {
				
					this.on("appendTo", function () {
					
						setARIARole(Dom.getFirstChild(this.get(_ELEMENT)), _TAB_LIST);
					
					}, null, this);
				
				}
				else {
					setARIARole(oTabList, _TAB_LIST);
				}
		
		
				//	Add a keypress listener that toggles the active Tab instance when the user 
				//	presses the Enter key.  This is necessary because the removal of the "href" 
				//	attribute from each Tab's <A> element (for JAWS support) causes the 
				//	TabView's default Enter key support to stop working.  Support for the Space
				//	Bar is also added as an additional convience for the user.
		
				this.on(_KEY_PRESS, onKeyPress);
				
	
				//	Keydown event listener for the TabView that provides support for 
				//	using the arrow keys to move focus between each Tab.
			
				this.on(_KEY_DOWN, onKeyDown);
			
			}
		
		},
	
		initAttributes: function (p_oAttributes) {
	
            /**
            * @attribute usearia
            * @description Boolean indicating if use of the WAI-ARIA Roles and States should 
            * be enabled.
            * @type Boolean
            * @default true for Firefox 3 and IE 8, false for all other browsers.
            */
			this.setAttributeConfig(_USE_ARIA, {
		
				value: (p_oAttributes.usearia || m_bUseARIA),
				validator: Lang.isBoolean,
				writeOnce: true,
				method: this._setUseARIA
		
			});


            /**
            * @attribute labelledby
            * @description String representing the id of the element that labels the TabView.
            * Maps directly to the <a href="http://www.w3.org/TR/wai-aria/#labelledby">
            * <code>aria-labelledby</code></a> attribute.
            * @type String
            * @default null
            */
			this.setAttributeConfig(_LABELLED_BY, {
		
				value: p_oAttributes.labelledby,
				validator: Lang.isString,
				method: this._setLabelledBy

			});


            /**
            * @attribute describedby
            * @description String representing the id of the element that describes the TabView.
            * Maps directly to the <a href="http://www.w3.org/TR/wai-aria/#describedby">
            * <code>aria-describedby</code></a> attribute.
            * @type String
            * @default null
            */
			this.setAttributeConfig(_DESCRIBED_BY, {
		
				value: p_oAttributes.describedby,
				validator: Lang.isString,
				method: this._setDescribedBy

			});


			if (m_bUseARIA) {
				this.set(_USE_ARIA, true);
			}

			fnTabViewInitAttributes.call(this, p_oAttributes);
		
		}
	
	}, "initAttributes", "_setUseARIA", "_setLabelledBy", "_setDescribedBy", "addTab");

}());
YAHOO.register("tabviewariaplugin", YAHOO.widget.TabView, {version: "@VERSION@", build: "@BUILD@"});
