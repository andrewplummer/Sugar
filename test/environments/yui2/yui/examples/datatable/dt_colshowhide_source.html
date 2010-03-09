<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<style type="text/css">
/* custom styles for this example */
#dt-example {width:45em;margin:0 auto;}
#dt-options {text-align:right;margin:1em 0;}
#dt-dlg {visibility:hidden;border:1px solid #808080;background-color:#E3E3E3;}
#dt-dlg .hd {font-weight:bold;padding:1em;background:none;background-color:#E3E3E3;border-bottom:0;}
#dt-dlg .ft {text-align:right;padding:.5em;background-color:#E3E3E3;}
#dt-dlg .bd {height:10em;margin:0 1em;overflow:auto;border:1px solid black;background-color:white;}
#dt-dlg .dt-dlg-pickercol {clear:both;padding:.5em 1em 3em;border-bottom:1px solid gray;}
#dt-dlg .dt-dlg-pickerkey {float:left;}
#dt-dlg .dt-dlg-pickerbtns {float:right;}

/* Container workarounds for Mac Gecko scrollbar issues */
.yui-panel-container.hide-scrollbars #dt-dlg .bd {
    /* Hide scrollbars by default for Gecko on OS X */
    overflow: hidden;
}
.yui-panel-container.show-scrollbars #dt-dlg .bd {
    /* Show scrollbars for Gecko on OS X when the Panel is visible  */
    overflow: auto;
}
#dt-dlg_c .underlay {overflow:hidden;}


/* rounded corners */
#dt-dlg .corner_tr {
    background-image: url( assets/img/tr.gif);
    position: absolute;
    background-repeat: no-repeat;
    top: -1px;
    right: -1px;
    height: 4px;
    width: 4px;
}
#dt-dlg .corner_tl {
    background-image: url( assets/img/tl.gif);
    background-repeat: no-repeat;
    position: absolute;
    top: -1px;
    left: -1px;
    height: 4px;
    width: 4px;
}
#dt-dlg .corner_br {
    background-image: url( assets/img/br.gif);
    position: absolute;
    background-repeat: no-repeat;
    bottom: -1px;
    right: -1px;
    height: 4px;
    width: 4px;
}
#dt-dlg .corner_bl {
    background-image: url( assets/img/bl.gif);
    background-repeat: no-repeat;
    position: absolute;
    bottom: -1px;
    left: -1px;
    height: 4px;
    width: 4px;
}

.inprogress {position:absolute;} /* transitional progressive enhancement state */

.yui-dt-liner {white-space:nowrap;}
</style>
</head>

<body class="yui-skin-sam">
<h1>Showing, Hiding, and Reordering Columns</h1>

<p>This example uses the Dialog and Button widgets to interactively show and hide Columns. Columns are also reorderable via built-in integration with the Drag and Drop Utility.</p>

<div id="dt-example">
    <div id="dt-options"><a id="dt-options-link" href="fallbacklink.html">Table Options</a></div>
    <div id="columnshowhide"></div>
</div>

<div id="dt-dlg" class="inprogress">
    <span class="corner_tr"></span>
    <span class="corner_tl"></span>
    <span class="corner_br"></span>
    <span class="corner_bl"></span>
    <div class="hd">
        Choose which columns you would like to see:
    </div>
    <div id="dt-dlg-picker" class="bd">
    </div>
</div>

<script type="text/javascript" src="../../build/yuiloader/yuiloader.js"></script>
<script type="text/javascript" src="./assets/js/data.js"></script>
<script type="text/javascript">
var loader = new YAHOO.util.YUILoader();
loader.insert({
    require: ["fonts", "dragdrop", "container", "button", "datatable"],
    base: '../../build/',
    filter: 'debug',
    allowRollup: false,
    onSuccess: function() {
        YAHOO.example.ColumnShowHide = function() {
            // Define Columns
            var myColumnDefs = [
                {key:"address"},
                {key:"city"},
                {key:"state"},
                {key:"amount"},
                {key:"active"},
                {key:"colors"},
                {key:"last_login", formatter:YAHOO.widget.DataTable.formatDate}
            ];
    
            // Create DataSource
            var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.addresses);
            myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
            myDataSource.responseSchema = {
                fields: ["address","city","state","amount","active","colors",{key:"last_login",parser:"date"}]
            };
    
            // Create DataTable
            var myDataTable = new YAHOO.widget.DataTable("columnshowhide", myColumnDefs, myDataSource, {draggableColumns:true});
                        
            // Shows dialog, creating one when necessary
            var newCols = true;
            var showDlg = function(e) {
                YAHOO.util.Event.stopEvent(e);

                if(newCols) {
                    // Populate Dialog
                    // Using a template to create elements for the SimpleDialog
                    var allColumns = myDataTable.getColumnSet().keys;
                    var elPicker = YAHOO.util.Dom.get("dt-dlg-picker");
                    var elTemplateCol = document.createElement("div");
                    YAHOO.util.Dom.addClass(elTemplateCol, "dt-dlg-pickercol");
                    var elTemplateKey = elTemplateCol.appendChild(document.createElement("span"));
                    YAHOO.util.Dom.addClass(elTemplateKey, "dt-dlg-pickerkey");
                    var elTemplateBtns = elTemplateCol.appendChild(document.createElement("span"));
                    YAHOO.util.Dom.addClass(elTemplateBtns, "dt-dlg-pickerbtns");
                    var onclickObj = {fn:handleButtonClick, obj:this, scope:false };
                    
                    // Create one section in the SimpleDialog for each Column
                    var elColumn, elKey, elButton, oButtonGrp;
                    for(var i=0,l=allColumns.length;i<l;i++) {
                        var oColumn = allColumns[i];
                        
                        // Use the template
                        elColumn = elTemplateCol.cloneNode(true);
                        
                        // Write the Column key
                        elKey = elColumn.firstChild;
                        elKey.innerHTML = oColumn.getKey();
                        
                        // Create a ButtonGroup
                        oButtonGrp = new YAHOO.widget.ButtonGroup({ 
                                        id: "buttongrp"+i, 
                                        name: oColumn.getKey(), 
                                        container: elKey.nextSibling
                        });
                        oButtonGrp.addButtons([
                            { label: "Show", value: "Show", checked: ((!oColumn.hidden)), onclick: onclickObj},
                            { label: "Hide", value: "Hide", checked: ((oColumn.hidden)), onclick: onclickObj}
                        ]);
                                        
                        elPicker.appendChild(elColumn);
                    }
                    newCols = false;
            	}
                myDlg.show();
            };
            var hideDlg = function(e) {
                this.hide();
            };
            var handleButtonClick = function(e, oSelf) {
                var sKey = this.get("name");
                if(this.get("value") === "Hide") {
                    // Hides a Column
                    myDataTable.hideColumn(sKey);
                }
                else {
                    // Shows a Column
                    myDataTable.showColumn(sKey);
                }
            };
            
            // Create the SimpleDialog
            YAHOO.util.Dom.removeClass("dt-dlg", "inprogress");
            var myDlg = new YAHOO.widget.SimpleDialog("dt-dlg", {
                    width: "30em",
    			    visible: false,
    			    modal: true,
    			    buttons: [ 
    					{ text:"Close",  handler:hideDlg }
                    ],
                    fixedcenter: true,
                    constrainToViewport: true
    		});
    		myDlg.render();

            // Nulls out myDlg to force a new one to be created
            myDataTable.subscribe("columnReorderEvent", function(){
                newCols = true;
                YAHOO.util.Event.purgeElement("dt-dlg-picker", true);
                YAHOO.util.Dom.get("dt-dlg-picker").innerHTML = "";
            }, this, true);
    		
    		// Hook up the SimpleDialog to the link
    		YAHOO.util.Event.addListener("dt-options-link", "click", showDlg, this, true);
    		
    		return {
    		  oDS: myDataSource,
    		  oDT: myDataTable
    		};
        }();
    }
});
</script>
</body>
</html>
