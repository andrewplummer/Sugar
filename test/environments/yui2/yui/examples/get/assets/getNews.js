//create a namespace for this example:
YAHOO.namespace("example.GetNews");


//This example uses the "Module Pattern"; a full explanation of 
//this pattern can be found on yuiblog:
// http://yuiblog.com/blog/2007/06/12/module-pattern
YAHOO.example.GetNews = function() {

	//set up some shortcuts in case our typing fingers
	//get lazy:
	var Event = YAHOO.util.Event,
		Dom = YAHOO.util.Dom,
		JSON = YAHOO.lang.JSON,
		Button = YAHOO.widget.Button,
		Get = YAHOO.util.Get,
		elResults = Dom.get("results");
		
	//we won't use the Get Utility's success handler in this example
	//because the web service we're using has a built-in callback
	//mechanism.  But we'll stub it out here and use it to simply
	//log a message to the logger:
	var onGetNewsSuccess = function() {
		YAHOO.log("The Get Utility has fired the success handler indicating that the requested script has loaded and is ready for use.", "info", "example");
	}
	
	//function to retrieve data from Yahoo! News Search web service --
	//http://developer.yahoo.com/search/news/V1/newsSearch.html
	var getNewsData = function() {
		YAHOO.log("Button clicked; getGetNewsData firing.", "info", "example");
		
		//Load the transitional state of the results section:
		elResults.innerHTML = "<h3>Retrieving news search results for for " +
			Dom.get("searchString").value + ":</h3>" +
			"<img src='http://l.yimg.com/a/i/nt/ic/ut/bsc/busybar_1.gif' " +
			"alt='Please wait...'>";
		
		//prepare the URL for the Yahoo Site Explorer API:
		var sURL = "http://search.yahooapis.com/NewsSearchService/V1/newsSearch?" +
			"appid=3wEDxLHV34HvAU2lMnI51S4Qra5m.baugqoSv4gcRllqqVZm3UrMDZWToMivf5BJ3Mom" +
			"&results=10&output=json&" +
			"&callback=YAHOO.example.GetNews.callback" +
			"&query=" + encodeURIComponent(Dom.get("searchString").value);
		
		//This simple line is the call to the Get Utility; we pass
		//in the URL and the configuration object, which in this case
		//consists merely of our success and failure callbacks:
		var transactionObj = Get.script(sURL, {
			onSuccess: onGetNewsSuccess,
			scope    : this
		});
		
		//The script method returns a single-field object containing the
		//tranaction id:
		YAHOO.log("Get Utility transaction started; transaction object: " + YAHOO.lang.dump(transactionObj), "info", "example");
		
	}

	return {
		init: function() {
			//suppress default form behavior
			Event.on("newsSearch", "submit", function(e) {
				Event.preventDefault(e);
				getNewsData();
			}, this, true);
		
			//instantiate Button:
			var oButton = new Button("getNewsData");
			YAHOO.log("GetNews Button instantiated.", "info", "example");
			getNewsData();
		},

		callback: function(results) {
			YAHOO.log("Web service returned data to YAHOO.example.GetNews.callback; beginning to process.", "info", "example");
			//work with the returned data to extract meaningful fields:
			var aResults = results.ResultSet.Result;
			var totalLinks = results.ResultSet.totalResultsAvailable;
			var returnedLinkCount = results.ResultSet.totalResultsReturned;
			
			if(returnedLinkCount) {//there are inbound links; process and display them:
			
				//write header and open list of inbound links:			
				var html = "<h3>There are " +
					totalLinks + 
					" news items on this topic; here are the first " + 
					returnedLinkCount +
					":</h3><ol>";
				
				//process list of inbound links:
				for (var i=0; i < aResults.length; i++) {
					html += "<li><strong><a href='" +
						aResults[i].Url +
						"'>" + aResults[i].Title +
						"</a>:</strong> " + aResults[i].Summary +
						"</li>";
				}
				
				//close list of inbound links
				html += "</ol>";
				
			} else {//no inbound links exist for this page:
			
				var html = "<h3>There are no news items available for the topic specified.</h3";
				
			}
			
			//insert string into DOM:
			elResults.innerHTML = html;			
		}
	}
}();

//Initialize the example when the DOM is completely loaded:
YAHOO.util.Event.onDOMReady(
	YAHOO.example.GetNews.init, 
	YAHOO.example.GetNews, 		//pass this object to init and...
	true);								//...run init in the passed object's
										//scope