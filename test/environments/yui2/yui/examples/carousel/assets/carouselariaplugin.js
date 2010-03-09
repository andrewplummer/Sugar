(function () {

	var Event = YAHOO.util.Event,
		Dom = YAHOO.util.Dom,
		Lang = YAHOO.lang,
		UA = YAHOO.env.ua,
		
		CarouselPrototype = YAHOO.widget.Carousel.prototype,
		fnCarouselInitAttributes = CarouselPrototype.initAttributes,

		m_oToolbarButtons = {},
		m_oCurrentButtonIndex = {},

		m_bUseARIA = (UA.gecko && UA.gecko >= 1.9) || (UA.ie && UA.ie >= 8),
		
		m_aFocusableElements = {
		
			"A": true,
			"SELECT": true,
			"TEXTAREA": true,
			"BUTTON": true,
			"INPUT": true
		
		},

		_USE_ARIA = "usearia",
		_ARIA_PREFIX = "aria-",
		_HIDDEN = "hidden",
		_ASTERIX = "*",
		_ID = "id",
		_ROLE = "role",
		_OPTION = "option",
		_LISTBOX = "listbox",
		_LI = "li",
		_SELECTED_ITEM = "selectedItem",
		_SELECTED = "selected",
		_TOOLBAR = "toolbar",
		_KEY_DOWN = "keydown",
		_PRESENTATION = "presentation",
		_BUTTON = "button",
		_UL = "UL",
		_A = "A",
		_RENDER = "render", 
		_SELECTED_ITEM_CHANGE = "selectedItemChange",
		_SHOW = "show",
		_PAGE_CHANGE = "pageChange",
		_KEY_PRESS = "keypress",
		_CONTROLS = "controls",
		_LABELLED_BY = "labelledby",
		_DESCRIBED_BY = "describedby",
		_CURRENT_PAGE = " (Current Page)";



	var setARIARole = function (element, role) {
	
		element.setAttribute(_ROLE, role);
	
	};

	var setARIAProperty = function (element, property, value) {

		element.setAttribute((_ARIA_PREFIX + property), value);
	
	};

	var getCarouselListElement = function () {

		var aCarouselEl = this.getElementsByClassName(this.CLASSES.CAROUSEL_EL);

		if (aCarouselEl.length === 1) {
			return aCarouselEl[0];
		}
	
	};
	

	var getCarouselNavElement = function () {

		var aNavigationEl = this.getElementsByClassName(this.CLASSES.NAVIGATION);
		
		if (aNavigationEl.length === 1) {
			return aNavigationEl[0];
		}
	
	};

	var isFocusableElement = function (element) {

		return ((element.tabIndex > -1 || m_aFocusableElements[element.nodeName.toUpperCase()]) && 
			element.type !== _HIDDEN && !element.disabled);

	};


	var addToTabIndex = function (element) {
	
		element.tabIndex = 0;
	
	};


	var removeFromTabIndex = function (element) {
	
		element.tabIndex = -1;
	
	};	


	var enableCarouselItem = function (index) {
	
		var oItem = this.getItem(index);

		if (oItem) {
			Dom.getElementsBy(isFocusableElement, _ASTERIX, oItem.id, addToTabIndex);
		}
	
	};

	
	var disableCarouselItem = function (index) {

		var oItem = this.getItem(index);
		
		if (oItem) {
			Dom.getElementsBy(isFocusableElement, _ASTERIX, oItem.id, removeFromTabIndex);
		}
	
	};


	var onSelectedItemChange = function (event) {

		var nPreviousItemIndex = event.prevValue;

		if (Lang.isNumber(nPreviousItemIndex)) {
			disableCarouselItem.call(this, nPreviousItemIndex);
		}

		enableCarouselItem.call(this, event.newValue);
		
		setARIAProperty(this.getElementForItem(event.newValue), _SELECTED, true);
	
	};


	var onKeyDown = function (event) {
	
		Event.stopPropagation(event);

		var sId = this.get(_ID),
			aToolBarButtons = m_oToolbarButtons[sId],
			nCurrentButtonIndex = m_oCurrentButtonIndex[sId],
			oNextButton,
			oCurrentButton;
		
		
		switch (Event.getCharCode(event)) {

            case 0x25:	// left arrow
            case 0x26:	// up arrow

				oCurrentButton = aToolBarButtons[nCurrentButtonIndex];
				oCurrentButton.tabIndex = -1;

				nCurrentButtonIndex = nCurrentButtonIndex - 1;

				oNextButton = aToolBarButtons[nCurrentButtonIndex];
				
				if (!oNextButton) {
					nCurrentButtonIndex = aToolBarButtons.length - 1;
					oNextButton = aToolBarButtons[nCurrentButtonIndex];
				}
				
				m_oCurrentButtonIndex[sId] = nCurrentButtonIndex;

				oNextButton.tabIndex = 0;
				oNextButton.focus();

			break;

            case 0x27:	// right arrow
            case 0x28:	// down arrow

				oCurrentButton = aToolBarButtons[nCurrentButtonIndex];
				oCurrentButton.tabIndex = -1;

				nCurrentButtonIndex = nCurrentButtonIndex + 1;

				oNextButton = aToolBarButtons[nCurrentButtonIndex];
				
				if (!oNextButton) {
					nCurrentButtonIndex = 0;
					oNextButton = aToolBarButtons[nCurrentButtonIndex];
				}

				m_oCurrentButtonIndex[sId] = nCurrentButtonIndex;
				
				oNextButton.tabIndex = 0;
				oNextButton.focus();

			break;
		
		}

	};


	var addOptionRole = function (element) {

		setARIARole(element, _OPTION);
		
		Dom.getElementsBy(isFocusableElement, _ASTERIX, element, removeFromTabIndex);

	};


	var onRender = function () {

		var oList = getCarouselListElement.call(this),
			nSelectedItemIndex,
			oNavigation;		


		if (oList) {

			setARIARole(oList, _LISTBOX);
			Dom.batch(oList.getElementsByTagName(_LI), addOptionRole);
	

			nSelectedItemIndex = this.get(_SELECTED_ITEM);
		
			if (Lang.isNumber(nSelectedItemIndex)) {
				setARIAProperty(this.getElementForItem(nSelectedItemIndex), _SELECTED, true);
				enableCarouselItem.call(this, nSelectedItemIndex);
			}
			
	
			oNavigation = getCarouselNavElement.call(this);
	
			if (oNavigation) {
				setARIARole(oNavigation, _TOOLBAR);
				Event.on(oNavigation, _KEY_DOWN, onKeyDown, null, this);
			}
	
		}
	
	};


	var setupPageButton = function (element, object) {

		var oCarousel = object.carousel,
			aToolBarButtons = object.toolbarButtons;

		setARIARole(element, _PRESENTATION);
		
		var oAnchor = Dom.getFirstChild(element);

		setARIARole(oAnchor, _BUTTON);
		setARIAProperty(oAnchor, _CONTROLS, object.listID);

		var nTabIndex = Dom.hasClass(element, oCarousel.CLASSES.SELECTED_NAV) ? 0 : -1;

		oAnchor.tabIndex = nTabIndex;
		
		var nToolBarIndex = aToolBarButtons.length,
			oEM = Dom.getFirstChild(oAnchor);

		if (nTabIndex === 0) {
			m_oCurrentButtonIndex[oCarousel.get(_ID)] = nToolBarIndex;
			oEM.innerHTML = oEM.innerHTML + _CURRENT_PAGE;
		}

		aToolBarButtons[nToolBarIndex] = oAnchor;
	
	};
	

	var setupNextPrevPageButton = function (element, object) {

		var aToolbarButtons = object.toolbarButtons;

		setARIARole(element, _PRESENTATION);
		setARIAProperty(element, _CONTROLS, object.listID);
		
		var oInput = Dom.getFirstChild(element);
		
		if (!oInput.disabled) {
			oInput.tabIndex = -1;
			aToolbarButtons[aToolbarButtons.length] = oInput;
		}
	
	};


	var updatePagingNav = function (event) {
	
		var oNavigation = getCarouselNavElement.call(this),
			aToolBarButtons = [],
			oFirstChild,
			oList,
			sListID;
		

		if (oNavigation) {

			oFirstChild = Dom.getFirstChild(oNavigation);
			oList = getCarouselListElement.call(this);


			if (oFirstChild && oList) {

				sListID = oList.id || Dom.generatId(oList);
	
				if (oFirstChild.nodeName.toUpperCase() === _UL) {

					setARIARole(oFirstChild, _PRESENTATION);

					Dom.batch(oFirstChild.getElementsByTagName(_LI), setupPageButton, 
						{ carousel: this, toolbarButtons: aToolBarButtons, listID: sListID });

				}
				else {

					oFirstChild.tabIndex = 0;
					setARIAProperty(oFirstChild, _CONTROLS, sListID);

				}
				
				Dom.batch(this.getElementsByClassName(this.CLASSES.BUTTON), 
					setupNextPrevPageButton, { toolbarButtons: aToolBarButtons, listID: sListID });
	
				m_oToolbarButtons[this.get(_ID)] = aToolBarButtons;
			
			}
		
		}

	};


	var onPageChange = function () {

		Lang.later(0, this, updatePagingNav);
	
	};


	var onKeyPress = function (event) {
				
		var oTarget = Event.getTarget(event),
			nCharCode = Event.getCharCode(event);

		if (oTarget.nodeName.toUpperCase() === _A && 
			Dom.getAncestorByClassName(oTarget, this.CLASSES.NAVIGATION) && 
			(nCharCode === 13 || nCharCode === 32)) {

			this._pagerClickHandler(event);
		
		}
	
	};


	var setLabelledByOnRender = function (event, id) {

		this.set(_LABELLED_BY, id, true);
		this.removeListener(_RENDER, setLabelledByOnRender);

	};


	var setDescribedByOnRender = function (event, id) {

		this.set(_DESCRIBED_BY, id, true);
		this.removeListener(_RENDER, setDescribedByOnRender);

	};


	Lang.augmentObject(CarouselPrototype, {
	
		_setLabelledBy: function (id) {

			var oNav = getCarouselNavElement.call(this),
				oList = getCarouselListElement.call(this);

			if (this.get(_USE_ARIA) && oNav && oList) {
				setARIAProperty(oNav, _LABELLED_BY, id);
				setARIAProperty(oList, _LABELLED_BY, id);
			}
			else {
				this.on(_RENDER, setLabelledByOnRender, id);
			}
			
		},
		
		_setDescribedBy: function (id) {

			var oNav = getCarouselNavElement.call(this),
				oList = getCarouselListElement.call(this);

			if (this.get(_USE_ARIA) && oNav && oList) {
				setARIAProperty(oNav, _DESCRIBED_BY, id);
				setARIAProperty(oList, _DESCRIBED_BY, id);
			}
			else {
				this.on(_RENDER, setDescribedByOnRender, id);
			}
		
		},
	
		_setUseARIA: function (p_bUseARIA) {
	
			if (p_bUseARIA) {
	
				this.on(_RENDER, onRender);
				this.on(_SELECTED_ITEM_CHANGE, onSelectedItemChange);
				this.on(_SHOW, updatePagingNav);
				this.on(_PAGE_CHANGE, onPageChange);
				this.on(_KEY_PRESS, onKeyPress);
			
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
		
				value: p_oAttributes.usearia || m_bUseARIA,
				validator: Lang.isBoolean,
				writeOnce: true,
				method: this._setUseARIA
		
			});


            /**
            * @attribute labelledby
            * @description String representing the id of the element that labels the Carousel's
            * navigation (<code>&#60;div class="yui-carousel-nav"&#62;</code>) and content 
            * (<code>&#60;div class="yui-carousel-content"&#62;</code>) elements.
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
            * @description String representing the id of the element that describes the Carousel's
            * navigation (<code>&#60;div class="yui-carousel-nav"&#62;</code>) and content 
            * (<code>&#60;div class="yui-carousel-content"&#62;</code>) elements.
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


			fnCarouselInitAttributes.apply(this, arguments);


			if (m_bUseARIA) {
				this.set(_USE_ARIA, true);			
			}			
	
		}
	
	}, "initAttributes", "_setUseARIA", "_setLabelledBy", "_setDescribedBy");

}());
YAHOO.register("carouselariaplugin", YAHOO.widget.Carousel, {version: "@VERSION@", build: "@BUILD@"});
