(function () {

	var Event = YAHOO.util.Event,
		Dom = YAHOO.util.Dom,
		Selector = YAHOO.util.Selector,
		UA = YAHOO.env.ua,

		bKeyListenersInitialized = false,
		bMouseListenersInitialized = false,
		sCheckboxFocusClass = "yui-checkbox-focus",
		sCheckboxCheckedClass = "yui-checkbox-checked",
		sCheckboxActiveClass = "yui-checkbox-active",
		forAttr = (UA.ie && UA.ie < 8) ? "htmlFor" : "for",
		bBlockDocumentMouseUp = false,
		bBlockClearActive = false,
		bBlockBlur = false,
		oActiveCheckbox;			
	

	var initKeyListeners = function () {

		Event.delegate(this, "keydown", onCheckboxKeyDown, ".yui-checkbox");
		Event.delegate(this, "click", onCheckboxClick, ".yui-checkbox");
		Event.delegate(this, "focusout", onCheckboxBlur, "input[type=checkbox]");

		bKeyListenersInitialized = true;

	};


	var initMouseListeners = function () {

		Event.delegate(this, "mouseover", onCheckboxMouseOver, ".yui-checkbox");
		Event.delegate(this, "mouseout", onCheckboxMouseOut, ".yui-checkbox-active");
		Event.on(this.ownerDocument, "mouseup", onDocumentMouseUp);

		bMouseListenersInitialized = true;

	};


	var getCheckbox = function (node) {

		return (Dom.hasClass(node, "yui-checkbox") ? node: 
					Dom.getAncestorByClassName(node, "yui-checkbox"));

	};


	var getCheckboxForLabel = function (label) {

		var sID = label.getAttribute(forAttr),
			oInput,
			oCheckbox;

		if (sID) {

			oInput = Dom.get(sID);

			if (oInput) {
				oCheckbox = getCheckbox(oInput);
			}

		}

		return oCheckbox;

	};


	var updateCheckedState = function (input) {

		var oCheckbox = getCheckbox(input);

		if (input.checked) {
			Dom.addClass(oCheckbox, sCheckboxCheckedClass);
		}
		else {
			Dom.removeClass(oCheckbox, sCheckboxCheckedClass);
		}

	};


	var setActiveCheckbox = function (checkbox) {

		Dom.addClass(checkbox, sCheckboxActiveClass);
		oActiveCheckbox = checkbox;

	};


	var clearActiveCheckbox = function () {

		if (oActiveCheckbox) {
			Dom.removeClass(oActiveCheckbox, sCheckboxActiveClass);
			oActiveCheckbox = null;
		}

	};


	var onCheckboxMouseOver = function (event, matchedEl) {

		if (oActiveCheckbox === matchedEl) {
			Dom.addClass(oActiveCheckbox, sCheckboxActiveClass);
		}

	};


	var onCheckboxMouseOut = function (event, matchedEl) {

		Dom.removeClass(matchedEl, sCheckboxActiveClass);

	};				


	var onDocumentMouseUp = function (event) {

		var oCheckbox;

		if (!bBlockDocumentMouseUp) {

			oCheckbox = getCheckbox(Event.getTarget(event));

			if ((oCheckbox && oActiveCheckbox !== oCheckbox) || !oCheckbox) {
				clearActiveCheckbox();
			}

		}

		bBlockDocumentMouseUp = false;

	};


	var onCheckboxFocus = function (event, matchedEl, container) {

		//	Remove the focus style from any checkbox that might still have it

		var oCheckbox = Selector.query(".yui-checkbox-focus", "checkboxes", true);

		if (oCheckbox) {
			Dom.removeClass(oCheckbox, sCheckboxFocusClass);
		}


		//	Defer adding key-related and click event listeners until 
		//	one of the checkboxes is initially focused.

		if (!bKeyListenersInitialized) {
			initKeyListeners.call(container);
		}

		oCheckbox = getCheckbox(matchedEl);

		Dom.addClass(oCheckbox, sCheckboxFocusClass);

	};


	var onCheckboxBlur = function (event, matchedEl) {

		if (bBlockBlur) {
			bBlockBlur = false;
			return;
		}

		var oCheckbox = getCheckbox(matchedEl);

		Dom.removeClass(oCheckbox, sCheckboxFocusClass);

		if (!bBlockClearActive && oCheckbox === oActiveCheckbox) {
			clearActiveCheckbox();
		}

		bBlockClearActive = false;

	};


	var onCheckboxMouseDown = function (event, matchedEl, container) {

		//	Defer adding mouse-related and click event listeners until 
		//	the user mouses down on one of the checkboxes.

		if (!bMouseListenersInitialized) {
			initMouseListeners.call(container);
		}

		var oCheckbox,
			oInput;


		if (matchedEl.nodeName.toLowerCase() === "label") {

			//	If the target of the event was the checkbox's label element, the
			//	label will dispatch a click event to the checkbox, meaning the 
			//	"onCheckboxClick" handler will be called twice.  For that reason
			//	it is necessary to block the "onDocumentMouseUp" handler from
			//	clearing the active state, so that a reference to the active  
			//	checkbox still exists the second time the "onCheckboxClick"
			//	handler is called.

			bBlockDocumentMouseUp = true;

			//	When the user clicks the label instead of the checkbox itself, 
			//	the checkbox will be blurred if it has focus.  Since the 
			//	"onCheckboxBlur" handler clears the active state it is 
			//	necessary to block the clearing of the active state when the 
			//	label is clicked instead of the checkbox itself.

			bBlockClearActive = true;

			oCheckbox = getCheckboxForLabel(matchedEl);

		}
		else {

			oCheckbox = matchedEl;

		}

		//	Need to focus the input manually for two reasons:
		//	1) 	Mousing down on a label in Webkit doesn't focus its  
		//		associated checkbox
		//	2)	By default checkboxes are focused when the user mouses 
		//		down on them.  However, since the actually checkbox is 
		//		obscurred by the two span elements that are used to 
		//		style it, the checkbox wont' receive focus as it was 
		//		never the actual target of the mousedown event.

		oInput = Selector.query("input", oCheckbox, true);

		//	Calling Event.preventDefault won't block the blurring of the 
		//	currently focused element in IE, so we'll use the "bBlockBlur"
		//	variable to stop the code in the blur event handler  
		//	from executing.

		bBlockBlur = (UA.ie && document.activeElement == oInput);

		oInput.focus();

		setActiveCheckbox(oCheckbox);

		//	Need to call preventDefault because by default mousing down on
		//	an element will blur the element in the document that currently 
		//	has focus--in this case, the input element that was 
		//	just focused.

		Event.preventDefault(event);

	};


	var onCheckboxClick = function (event, matchedEl) {

		var oTarget = Event.getTarget(event),
			oInput;


		if (matchedEl === oActiveCheckbox) {

			oInput = Selector.query("input", matchedEl, true);

			if (oTarget !== oInput) {

				//	If the click event was fired via the mouse the checked
				//	state will have to be manually updated since the input 
				//	is hidden offscreen and therefore couldn't be the 
				//	target of the click.

				oInput.checked = (!oInput.checked);

			}

			updateCheckedState(oInput);
			clearActiveCheckbox();

		}

	};


	var onCheckboxKeyDown = function (event, matchedEl) {

		//	Style the checkbox as being active when the user presses the 
		//	space bar

		if (Event.getCharCode(event) === 32) {
			setActiveCheckbox(matchedEl);						
		}

	};


	var checkboxes = Selector.query("#checkboxes>div>span");
	
	for (var i = checkboxes.length - 1; i >= 0; i--) {
		Dom.addClass(checkboxes[i], "yui-checkbox");
	}

	//	Remove the "yui-checkboxes-loading" class used to hide the 
	//	checkboxes now that the checkboxes have been skinned.	
	
	document.documentElement.className = "";


	//	Add the minimum number of event listeners needed to start, bind the 
	//	rest when needed

	Event.delegate("checkboxes", "mousedown", onCheckboxMouseDown, ".yui-checkbox,label");
	Event.delegate("checkboxes", "focusin", onCheckboxFocus, "input[type=checkbox]");
	
}());