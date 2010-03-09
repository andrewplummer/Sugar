(function () {

	var Event = YAHOO.util.Event,
		Dom = YAHOO.util.Dom,
		Lang = YAHOO.lang,
		UA = YAHOO.env.ua,
		Panel = YAHOO.widget.Panel,
		Tooltip = YAHOO.widget.Tooltip,
		SimpleDialog = YAHOO.widget.SimpleDialog,
		
		ModulePrototype = YAHOO.widget.Module.prototype,
		fnModuleInitDefaultConfig = ModulePrototype.initDefaultConfig,
		fnModuleInitResizeMonitor = ModulePrototype._initResizeMonitor,
		
		OverlayPrototype = YAHOO.widget.Overlay.prototype,
		fnOverlayShowIframe = OverlayPrototype.showIframe,

		PanelPrototype,
		fnPanelInitDefaultConfig,

		SimpleDialogPrototype,
		fnSimpleDialogConfigIcon,

		m_bPanelDocumentListenersAdded = false,
		m_oFocusedElement,	// Currently focused element in the DOM
		m_oOverlayManager,	// An OverlayManager instance

		m_bToolTipDocumentListenersAdded = false,
		m_oContextElements = {},	// Hash of Tooltip context elements, indexed by Tooltip id
		m_oTooltips = {},	// Hash of Tooltips indexed by context element id


		// Private constants for strings

		_ARIA_PREFIX = "aria-",
		_ROLE = "role",
		_PRESENTATION = "presentation",
		_USE_ARIA = "usearia",
		_BLUR = "blur",
		_FOCUS = "focus",
		_VISIBLE = "visible",
		_BEFORE_HIDE = "beforeHide",
		_ALERT_DIALOG = "alertdialog",
		_DIALOG = "dialog",
		_DESCRIBED_BY = "describedby",
		_CONTEXT = "context",
		_HIDDEN = "hidden",
		_CONTAINER_CLOSE = "container-close",
		_A = "a",
		_HREF = "href",
		_BUTTON = "button",
		_KEY_DOWN = "keydown",
		_BEFORE_SHOW = "beforeShow",
		_CLOSE = "close",
		_LABELLED_BY = "labelledby",
		_XY = "xy",
		_TOOLTIP = "tooltip",
		_DESTROY = "destroy";
		
		
	var setARIARole = function (element, role) {
	
		element.setAttribute(_ROLE, role);
	
	};


	var setARIAProperty = function (element, property, value) {

		element.setAttribute((_ARIA_PREFIX + property), value);
	
	};		


	// Module ARIA plugin - augments YAHOO.widget.Module

	Lang.augmentObject(ModulePrototype, {

		_initResizeMonitor: function () {
		
			fnModuleInitResizeMonitor.call(this);

			var oIFrame = this.resizeMonitor;

			if (oIFrame) {
				setARIARole(oIFrame, _PRESENTATION);
				oIFrame.tabIndex = -1;
			}		
		
		},
		

		configUseARIA: function (type, args) {
			// Stub for subclasses
		},

		configDescribedBy: function (type, args) {
		
			var sID = args[0];
		
			if (this.cfg.getProperty(_USE_ARIA) && sID) {
				setARIAProperty(this.element, _DESCRIBED_BY, sID);
			}
		
		},
		
		configLabelledBy: function (type, args) {

			var sID = args[0];
		
			if (this.cfg.getProperty(_USE_ARIA) && sID) {
				setARIAProperty(this.element, _LABELLED_BY, sID);			
			}
		
		},

		initDefaultConfig: function () {

            /**
            * @config usearia
            * @description Boolean indicating if use of the WAI-ARIA Roles and States should 
            * be enabled.
            * @type Boolean
            * @default true for Firefox 3 and IE 8, false for all other browsers.
            */
			this.cfg.addProperty(
				_USE_ARIA, 
				{
					handler: this.configUseARIA, 
					value: (UA.gecko && UA.gecko >= 1.9) || (UA.ie && UA.ie >= 8), 
					validator: Lang.isBoolean
				}
			 );


            /**
            * @config labelledby
            * @description String representing the id of the element that labels the Module.
            * Maps directly to the <a href="http://www.w3.org/TR/wai-aria/#labelledby">
            * <code>aria-labelledby</code></a> attribute.
            * @type String
            * @default null
            */
			this.cfg.addProperty(
				_LABELLED_BY, 
				{
					handler: this.configLabelledBy, 
					validator: Lang.isString
				}
			 );


            /**
            * @attribute describedby
            * @description String representing the id of the element that describes the Module.
            * Maps directly to the <a href="http://www.w3.org/TR/wai-aria/#describedby">
            * <code>aria-describedby</code></a> attribute.
            * @type String
            * @default null
            */
			this.cfg.addProperty(
				_DESCRIBED_BY, 
				{
					handler: this.configDescribedBy, 
					validator: Lang.isString
				}
			 );
			 
			fnModuleInitDefaultConfig.call(this);			 
	
		}
	
	}, "initDefaultConfig", "configUseARIA", "configLabelledBy", 
		"configDescribedBy", "_initResizeMonitor");



	// Overlay ARIA plugin - augments YAHOO.widget.Overlay

	OverlayPrototype.showIframe = function () {

		fnOverlayShowIframe.call(this);
		
		var oIFrame = this.iframe;

		if (this.cfg.getProperty(_USE_ARIA) && oIFrame && !oIFrame.getAttribute(_ROLE)) {
			setARIARole(oIFrame, _PRESENTATION);
			oIFrame.tabIndex = -1;			
		}

	};



	// Panel ARIA plugin - augments YAHOO.widget.Panel


	var onPanelKeyDown = function (event) {

		var nCharCode = Event.getCharCode(event);
		
		if (nCharCode === 27) {

			if (this.cancel) {	// Dialog
				this.cancel();
			}
			else {	// Panel
				this.hide();			
			}

		}
		
	};


	var onPanelDOMFocus = function (event) {

		this.fireEvent(_FOCUS, event);
	
	};


	var onPanelDOMBlur = function (event) {
	
		this.fireEvent(_BLUR, event);
	
	};


	var onPanelFocus = function (type, args) {

		var oEvent = args[0];  // DOM event

		if (m_oOverlayManager._manageFocus(this)) {

			if (this.cfg.getProperty(_VISIBLE) && this.focusFirst) {

				// If the event was not sourced from the UI, focus the first element in the Panel
		
				if (!oEvent) {
					this.focusFirst();
				}

			}

		}

	};


	var onPanelBlur = function (type, args) {

		var oEvent = args[0];	// DOM event

		// If the event was not sourced from the UI fire the blur event

		if (m_oOverlayManager._manageBlur(this) && !oEvent) {
			this.fireEvent(_BLUR);
		}
	
	};


	var restoreFocus = function (type, args, element) {
	
		this.blur();

		if (element && element.focus) {

			try {
				element.focus();				
			}
			catch(e) {
			
			}
			
		}

		this.unsubscribe(type, restoreFocus, element);
	
	};


	var onPanelBeforeShow = function () {
	
		//	If the Panel is modal it is necessary to wait until the modality
		//	mask has been hidden before attempting to restore focus to the 
		//	element in the DOM that had focus before the Panel was made visible.

		var sEvent = (this.cfg.getProperty("modal") === true) ? 
						"hideMask" : _BEFORE_HIDE;

		this.subscribe(sEvent, restoreFocus, m_oFocusedElement);
	
	};


	var setPanelHiddenRole = function () {
	
		setARIAProperty(this.innerElement, _HIDDEN, !this.cfg.getProperty(_VISIBLE));
	
	};


	var setRoleForCloseButton = function () {

		Dom.getElementsByClassName(_CONTAINER_CLOSE, _A, this.element, function (element) {
		
			element.removeAttribute(_HREF);
			setARIARole(element, _BUTTON);
			element.tabIndex = 0;
		
		});
	
	};
	

	var onPanelConfigClose = function (type, args) {
	
		var bClose = args[0];
	
		if (bClose) {

			setRoleForCloseButton.call(this);
		
		}
	
	};


	if (Panel) {

		PanelPrototype = Panel.prototype;
		fnPanelInitDefaultConfig = PanelPrototype.initDefaultConfig;
	
	
		Lang.augmentObject(PanelPrototype, {
			
			hasFocus: function () {
		
				return (m_oOverlayManager && this === m_oOverlayManager.getActive());
			
			},
		
		
			configUseARIA: function (type, args) {
		
				var bUseARIA = args[0];
				
				if (bUseARIA) {
		
					if (!m_oOverlayManager) {
						m_oOverlayManager = new YAHOO.widget.OverlayManager();
					}
					
					m_oOverlayManager.register(this);
					
		
					this.focus = function () {
					
						if (!this.hasFocus()) {
							this.fireEvent(_FOCUS);			
						}
					
					};
					
				
					this.blur = function () {
				
						if (this.hasFocus()) {
							this.fireEvent(_BLUR);
						}
					
					};			
			
		
					Event.onFocus(this.element, onPanelDOMFocus, null, this);
					Event.onBlur(this.element, onPanelDOMBlur, null, this);
		
					this.subscribe(_FOCUS, onPanelFocus);
					this.subscribe(_BLUR, onPanelBlur);
					
					Event.on(this.element, _KEY_DOWN, onPanelKeyDown, null, this);
				
					this.subscribe(_BEFORE_SHOW, onPanelBeforeShow);
	
					setPanelHiddenRole.call(this);
	
					this.cfg.subscribeToConfigEvent(_VISIBLE, setPanelHiddenRole);
					this.cfg.subscribeToConfigEvent(_CLOSE, onPanelConfigClose);
		
					if (!m_bPanelDocumentListenersAdded) {
					
						Event.onFocus(document, function (event) {
						
							m_oFocusedElement = Event.getTarget(event);
						
						});
						
		
						m_bPanelDocumentListenersAdded = true;
		
					}
		
				}
			
			},

			configDescribedBy: function (type, args) {
			
				var sID = args[0];
			
				if (this.cfg.getProperty(_USE_ARIA) && sID) {
					setARIAProperty(this.innerElement, _DESCRIBED_BY, sID);
				}
			
			},
			
			configLabelledBy: function (type, args) {
	
				var sID = args[0];
			
				if (this.cfg.getProperty(_USE_ARIA) && sID) {
					setARIAProperty(this.innerElement, _LABELLED_BY, sID);
				}
			
			},			
			
			configRole: function (type, args) {
			
				var sRole = args[0],
					oBody,
					oHeader,
					sID;
		
	
				if (sRole) {

					switch (sRole) {
						
						case _ALERT_DIALOG:

							oBody = this.body;

							sID = oBody.id || Dom.generateId(oBody);

							this.cfg.setProperty(_DESCRIBED_BY, sID);
						
						break;
						
						case _DIALOG:

							oHeader = this.header;

							sID = oHeader.id || Dom.generateId(oHeader);

							this.cfg.setProperty(_LABELLED_BY, sID);

						break;
						
					}

					setARIARole(this.innerElement, sRole);
					
					setRoleForCloseButton.call(this);
		
				}
			
			},
		
		
			initDefaultConfig: function () {
			
				fnPanelInitDefaultConfig.call(this);
		
				this.cfg.addProperty(
					_ROLE, 
					{
						handler: this.configRole, 
						value: _DIALOG, 
						validator: Lang.isString
					}
				 );
		
			}
		
		}, "initDefaultConfig", "configRole", "configUseARIA", "configLabelledBy", 
			"configDescribedBy", "hasFocus");

	}


	// SimpleDialog ARIA plugin - augments YAHOO.widget.SimpleDialog

	if (SimpleDialog) {

		SimpleDialogPrototype = SimpleDialog.prototype;
		fnSimpleDialogConfigIcon = SimpleDialogPrototype.configIcon;

		SimpleDialogPrototype.configIcon = function (type, args, obj) {
			
			fnSimpleDialogConfigIcon.apply(this, arguments);
			
            var sIcon = args[0],
                sCSSClass = SimpleDialog.ICON_CSS_CLASSNAME,
                oIcon;
        
            if (sIcon && sIcon != "none") {

                oIcon = Dom.getElementsByClassName(sCSSClass, "*" , this.body);

                if (oIcon) {
					setARIARole(oIcon[0], _PRESENTATION);
                }

			}
			
		};
		
	}


	// Tooltip ARIA plugin - augments YAHOO.widget.Tooltip

	var onDocumentFocus = function (event) {
	
		var oTarget = Event.getTarget(event),
			oTooltip = m_oTooltips[oTarget.id],
			aXY;
		
		if (oTooltip) {
		
			aXY = Dom.getXY(oTarget);

			oTooltip.cfg.setProperty(_XY, [aXY[0], (aXY[1] + oTarget.offsetHeight + 5)]);
			oTooltip.show();

		}
	
	};


	var onDocumentBlur = function (event) {

		var oTarget = Event.getTarget(event),
			oTooltip = m_oTooltips[oTarget.id];
		
		if (oTooltip && oTooltip.cfg.getProperty(_VISIBLE)) {
			oTooltip.hide();
		}
		
	};


	var unregisterContextElement = function (element) {

		var sContextElId = element.id,
			oTooltip = m_oTooltips[sContextElId];

		if (oTooltip === this) {
			delete m_oTooltips[sContextElId];
			element.removeAttribute(_DESCRIBED_BY);
		}
	
	};


	var unregisterContextElements = function () {

		var sId = this.element.id,
			aContextElements = m_oContextElements[sId];

		Dom.batch(aContextElements, unregisterContextElement, this, true);

		m_oContextElements[sId] = null;

	};


	var registerContextElement = function (element) {

		var sContextElId = element.id || Dom.generateId(element);
	
		m_oTooltips[sContextElId] = this;
		
		setARIAProperty(element, _DESCRIBED_BY, this.element.id);
	
	};


	var registerContextElements = function () {

		var aContextElements = this.cfg.getProperty(_CONTEXT);

		Dom.batch(aContextElements, registerContextElement, this, true);

		m_oContextElements[this.element.id] = aContextElements;

	};


	var onTooltipContextChange = function (type, args) {
	
		unregisterContextElements.call(this);

		var context = args[0];
		
		if (context) {
			registerContextElements.call(this);
		}
	
	};


	var setTooltipHiddenRole = function () {
	
		setARIAProperty(this.body, _HIDDEN, !this.cfg.getProperty(_VISIBLE));
	
	};


	if (Tooltip) {

		Tooltip.prototype.configUseARIA = function (type, args) {
		
			var bUseARIA = args[0];
			
			if (bUseARIA) {
				
				setARIARole(this.body, _TOOLTIP);
	
				this.cfg.subscribeToConfigEvent(_CONTEXT, onTooltipContextChange);
				
				setTooltipHiddenRole.call(this);
				
				this.cfg.subscribeToConfigEvent(_VISIBLE, setTooltipHiddenRole);
				
				this.subscribe(_DESTROY, unregisterContextElements);
	
	
				if (!m_bToolTipDocumentListenersAdded) {
				
					Event.onFocus(document, onDocumentFocus);
					Event.onBlur(document, onDocumentBlur);
	
					m_bToolTipDocumentListenersAdded = true;
				
				}
	
			}
		
		};
	
	}
	
}());
YAHOO.register("containerariaplugin", YAHOO.widget.Module, {version: "@VERSION@", build: "@BUILD@"});
