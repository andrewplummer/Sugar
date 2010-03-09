/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */

YAHOO.example.CheckOnClickNode = function(oData, oParent, expanded, checked) {
	if (oParent) { 
		this.init(oData, oParent, expanded);
		this.setUpLabel(oData);
		this.checked = checked;
	}
};

YAHOO.example.CheckOnClickNode.prototype = new YAHOO.widget.TaskNode();

YAHOO.example.CheckOnClickNode.prototype.getCheckLink = function() { 
	return "var n=YAHOO.widget.TreeView.getNode(\'" + this.tree.id + "\'," + 
		this.index + "); " +
        "var r = n.checkClick(); " +
        "YAHOO.example.customCheckClickFunction(n);" +
        "return r;";
};

YAHOO.example.customCheckClickFunction = function(node) {
    alert(node.checked + "(" + node.checkState + ")");
};
