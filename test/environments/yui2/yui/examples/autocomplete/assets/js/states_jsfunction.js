var getStates = function(sQuery) {
    aResults = [];
    if(sQuery && sQuery.length > 0) {
        var charKey = sQuery.substring(0,1).toLowerCase();
        var oResponse = dataset[charKey];
        
        if(oResponse) {
            for(var i = oResponse.length-1; i >= 0; i--) {
                var sKey = oResponse[i].STATE;
                var sKeyIndex = encodeURI(sKey.toLowerCase()).indexOf(sQuery.toLowerCase());

                // Query found at the beginning of the key string for STARTSWITH
                // returns an array of arrays where STATE is index=0, ABBR is index=1
                if(sKeyIndex === 0) {
                    aResults.unshift([sKey, oResponse[i].ABBR]);
                }
            }
            return aResults;
        }
    }
    // Empty queries return all states
    else {
        for(var letter in dataset) {
            var oResponse = dataset[letter];
            for(var i = 0; i < oResponse.length; i++) {
                aResults.push([oResponse[i].STATE, oResponse[i].ABBR]);
            }
        }
        return aResults;
    }
}
//{"STATE" : "", "ABBR" : ""}
var dataset =
    {'a': [{"STATE" : "Alabama", "ABBR" : "AL"},
		{"STATE" : "Alaska", "ABBR" : "AK"},
		{"STATE" : "Arizona", "ABBR" : "AZ"},
		{"STATE" : "Arkansas", "ABBR" : "AR"}],
	'b' : [
		],
	'c' : [
		{"STATE" : "California", "ABBR" : "CA"},
		{"STATE" : "Colorado", "ABBR" : "CO"},
        {"STATE" : "Connecticut", "ABBR" : "CT"}],
	'd' : [
		{"STATE" : "Delaware", "ABBR" : "DE"}],
	'e' : [
		],
	'f' : [
		{"STATE" : "Florida", "ABBR" : "FL"}],
	'g' : [
		{"STATE" : "Georgia", "ABBR" : "GA"}],
	'h' : [
		{"STATE" : "Hawaii", "ABBR" : "HI"}],
	'i' : [
		{"STATE" : "Idaho", "ABBR" : "ID"},
        {"STATE" : "Illinois", "ABBR" : "IL"},
        {"STATE" : "Indiana", "ABBR" : "IN"},
        {"STATE" : "Iowa", "ABBR" : "IA"}],
	'j' : [
		],
	'k' : [
		{"STATE" : "Kansas", "ABBR" : "KS"},
        {"STATE" : "Kentucky", "ABBR" : "KY"}],
	'l' : [
		{"STATE" : "Louisiana", "ABBR" : "LA"}],
	'm' : [
		{"STATE" : "Maine", "ABBR" : "ME"},
        {"STATE" : "Maryland", "ABBR" : "MD"},
        {"STATE" : "Massachusetts", "ABBR" : "MA"},
        {"STATE" : "Michigan", "ABBR" : "MI"},
        {"STATE" : "Minnesota", "ABBR" : "MN"},
        {"STATE" : "Mississippi", "ABBR" : "MS"},
        {"STATE" : "Missouri", "ABBR" : "MO"},
        {"STATE" : "Montana", "ABBR" : "MT"}],
	'n' : [
		{"STATE" : "Nebraska", "ABBR" : "NE"},
		{"STATE" : "Nevada", "ABBR" : "NV"},
        {"STATE" : "New Hampshire", "ABBR" : "NH"},
        {"STATE" : "New Jersey", "ABBR" : "NJ"},
        {"STATE" : "New Mexico", "ABBR" : "NM"},
        {"STATE" : "New York", "ABBR" : "NY"},
        {"STATE" : "North Dakota", "ABBR" : "ND"},
        {"STATE" : "North Carolina", "ABBR" : "NC"}],
	'o' : [
		{"STATE" : "Ohio", "ABBR" : "OH"},
		{"STATE" : "Oklahoma", "ABBR" : "OK"},
        {"STATE" : "Oregon", "ABBR" : "OR"}],
	'p' : [
		{"STATE" : "Pennsylvania", "ABBR" : "PA"}],
	'q' : [
		],
	'r' : [
		{"STATE" : "Rhode Island", "ABBR" : "RI"}],
	's' : [
		{"STATE" : "South Carolina", "ABBR" : "SC"},
        {"STATE" : "South Dakota", "ABBR" : "SD"}],
	't' : [
		{"STATE" : "Tennessee", "ABBR" : "TN"},
        {"STATE" : "Texas", "ABBR" : "TX"}],
	'u' : [
		{"STATE" : "Utah", "ABBR" : "UT"}],
	'v' : [
		{"STATE" : "Vermont", "ABBR" : "VT"},
        {"STATE" : "Virginia", "ABBR" : "VA"}],
	'w' : [
		{"STATE" : "Washington", "ABBR" : "WA"},
		{"STATE" : "West Virginia", "ABBR" : "WV"},
		{"STATE" : "Wisconsin", "ABBR" : "WI"},
        {"STATE" : "Wyoming", "ABBR" : "WY"}],
	'x' : [
		],
	'y' : [
		],
	'z' : [
		]
	};
