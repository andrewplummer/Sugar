(function () {

	var Lang = YAHOO.lang,
		UA = YAHOO.env.ua,

		ButtonPrototype = YAHOO.widget.Button.prototype,
		fnButtonInitAttributes = ButtonPrototype.initAttributes,

		ButtonGroupPrototype = YAHOO.widget.ButtonGroup.prototype,
		fnButtonGroupInitAttributes = ButtonGroupPrototype.initAttributes,
		fnButtonGroupAddButton = ButtonGroupPrototype.addButton,

		m_bUseARIA = (UA.gecko && UA.gecko >= 1.9) || (UA.ie && UA.ie >= 8),

		// Private constants for strings

		_ARIA_PREFIX = "aria-",
		_USE_ARIA = "usearia",
		_CHECKED = "checked",
		_TYPE = "type",
		_MENU = "menu",
		_SPLIT = "split",
		_HAS_POPUP = "haspopup",
		_RENDER = "render",
		_RADIO = "radio",
		_CHECKBOX = "checkbox",
		_ROLE = "role",
		_CHECKED_CHANGE = "checkedChange",
		_PRESENTATION = "presentation",
		_ELEMENT = "element",
		_RADIO_GROUP = "radiogroup",
		_CHECKED_BUTTON_CHANGE = "checkedButtonChange",
		_APPEND_TO = "appendTo",
		_LABELLED_BY = "labelledby",
		_DESCRIBED_BY = "describedby",
		_ID = "id";


	if (m_bUseARIA) {

		ButtonPrototype.RADIO_DEFAULT_TITLE = "";
		ButtonPrototype.RADIO_CHECKED_TITLE = "";
		ButtonPrototype.CHECKBOX_DEFAULT_TITLE = "";
		ButtonPrototype.CHECKBOX_CHECKED_TITLE = "";

	}
		

	// Button ARIA plugin

	var setARIARole = function (element, role) {
	
		element.setAttribute(_ROLE, role);
	
	};


	var setARIAProperty = function (element, property, value) {

		element.setAttribute((_ARIA_PREFIX + property), value);
	
	};	


	var enableARIAForMenu = function (type, args, button) {

		this.cfg.setProperty(_USE_ARIA, true);
		this.cfg.setProperty(_LABELLED_BY, button.get(_ID));
	
	};


	var onAppendTo = function () {

		this._menu.subscribe(_RENDER, enableARIAForMenu, this);
	
	};	


	var toggleARIACheckedState = function (event) {

		setARIAProperty(this._button, _CHECKED, event.newValue);
	
	};
	

	Lang.augmentObject(ButtonPrototype, {

		_setUseARIA: function (p_bUseARIA) {
		
			var sType = this.get(_TYPE),
				oButtonEl = this._button;
		

			if (p_bUseARIA) {
			
				switch (sType) {
				
					case _MENU:
					case _SPLIT:
	
						setARIAProperty(oButtonEl, _HAS_POPUP, true);

						this.on(_APPEND_TO, onAppendTo);
					
					break;
					
	
					case _RADIO:
					case _CHECKBOX:
					
						setARIARole(oButtonEl, sType);

						setARIAProperty(oButtonEl, _CHECKED, this.get(_CHECKED));
						
						this.on(_CHECKED_CHANGE, toggleARIACheckedState);
					
					break;
				
				}
			
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

			fnButtonInitAttributes.apply(this, arguments);

			if (m_bUseARIA) {
				this.set(_USE_ARIA, true);			
			}
	
		}
	
	}, "initAttributes", "_setUseARIA");
	


	// ButtonGroup ARIA plugin
		
	var updateTabIndex = function (event) {

		var oPreviousButton = event.prevValue;

		if (oPreviousButton) {
			oPreviousButton._button.tabIndex = -1;
		}

		event.newValue._button.tabIndex = 0;
	
	};
	

	Lang.augmentObject(ButtonGroupPrototype, {
	
		addButton: function (p_oButton) {
		
			var oButton = fnButtonGroupAddButton.call(this, p_oButton),
				oButtonEl,
				oParentNode;
			 
			if (this.get(_USE_ARIA)) {
	
				oButton.set(_USE_ARIA, true);
				
				oButtonEl = oButton._button;
				oParentNode = oButtonEl.parentNode;
				
				setARIARole(oParentNode, _PRESENTATION);
				setARIARole(oParentNode.parentNode, _PRESENTATION);
				
				oButtonEl.tabIndex = oButton.get(_CHECKED) ? 0 : -1;
	
			}
			 
			return oButton;
		
		},

		_setUseARIA: function (p_bUseARIA) {	
	
			if (p_bUseARIA) {
	
				setARIARole(this.get(_ELEMENT), _RADIO_GROUP);
				
				this.on(_CHECKED_BUTTON_CHANGE, updateTabIndex);
				
			}
		
		},

		_setLabelledBy: function (id) {

			if (this.get(_USE_ARIA)) {
				setARIAProperty(this.get(_ELEMENT), _LABELLED_BY, id);
			}
			
		},
		
		_setDescribedBy: function (id) {

			if (this.get(_USE_ARIA)) {
				setARIAProperty(this.get(_ELEMENT), _DESCRIBED_BY, id);
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
            * @description String representing the id of the element that labels the ButtonGroup.
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
            * @description String representing the id of the element that describes the ButtonGroup.
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


			fnButtonGroupInitAttributes.apply(this, arguments);


			if (m_bUseARIA) {
				this.set(_USE_ARIA, true);			
			}
		
		}
	
	}, "initAttributes", "_setUseARIA", "_setLabelledBy", "_setDescribedBy", "addButton");
	

}());
YAHOO.register("buttonariaplugin", YAHOO.widget.Button, {version: "@VERSION@", build: "@BUILD@"});
