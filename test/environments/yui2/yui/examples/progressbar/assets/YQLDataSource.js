/*
Copyright (c) 2009, Daniel Barreiro (a.k.a. Satyam). All rights reserved.
satyam at satyam dot com dot ar (yes, it ends with ar)
It is the intention of the author to make this component freely available for use along the YAHOO User Interface Library
so it is licensed with the same BSD License: http://developer.yahoo.net/yui/license.txt

This is experimental code, not a supported product
*/ 

YAHOO.util.YQLDataSource = function (oLiveData, oConfigs) {
	oLiveData = oLiveData || 'http://query.yahooapis.com/v1/public/yql?format=json&q=';
	YAHOO.util.YQLDataSource.superclass.constructor.call(this, oLiveData, oConfigs); 
};

YAHOO.lang.extend(YAHOO.util.YQLDataSource, YAHOO.util.ScriptNodeDataSource, {
	responseType:YAHOO.util.DataSource.TYPE_JSON,
	parseJSONData: function  ( oRequest , oFullResponse ) {	
		var i,q = oFullResponse.query.results,
			rSch = this.responseSchema,
			fs = {};
			
		if ('fields' in rSch  && rSch.fields.length) {
			for (i = 0;i < rSch.fields.length;i++) {
				fs[rSch.fields[i].key || rSch.fields[i]] = i;
			}
		} else {
			rSch.fields = [];
		}
		var pushFields = function(node,prefix) {
			if (prefix) {
				prefix += '.';
			} else {
				prefix = '';
			}
			for (var field in node) {
				if (node.hasOwnProperty(field) && !(field in fs)) {
					if (YAHOO.lang.isObject(node[field])) {
						pushFields(node[field],prefix + field);
					} else {
						rSch.fields.push(prefix + field);
					}
				}
			}
		};
			
		for (var list in q) {
			if (q.hasOwnProperty(list)) {
				rSch.resultsList = rSch.resultsList || 'query.results.' + list;
				pushFields(q[list][0]);
				return YAHOO.util.YQLDataSource.superclass.parseJSONData.apply(this,arguments);
			}
		}
	},
	makeConnection : function(oRequest, oCallback, oCaller) {
		YAHOO.util.YQLDataSource.superclass.makeConnection.call(this,encodeURIComponent(oRequest),oCallback,oCaller);
	}
});

YAHOO.lang.augmentObject(YAHOO.util.YQLDataSource, YAHOO.util.DataSourceBase);
