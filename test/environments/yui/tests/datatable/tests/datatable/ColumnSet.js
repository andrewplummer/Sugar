(function() {
    var gCount = -1;

    var Dom=YAHOO.util.Dom,
        Assert=YAHOO.util.Assert,
        ObjectAssert=YAHOO.util.ObjectAssert,
        ArrayAssert=YAHOO.util.ArrayAssert,
        DateAssert=YAHOO.util.DateAssert,
        UserAction=YAHOO.util.UserAction,
        TestCase = YAHOO.tool.TestCase,
        TestLogger = YAHOO.tool.TestLogger,
        TestRunner = YAHOO.tool.TestRunner,
        TestSuite = YAHOO.tool.TestSuite,

        DataSource = YAHOO.util.DataSource,
        DataTable = YAHOO.widget.DataTable,
        ColumnSet = YAHOO.widget.ColumnSet,
        RecordSet = YAHOO.widget.RecordSet;

    /**
     *
     *
     * Base DataTable test template. Sets up values for a DataTable instance.
     *
     *
     */
    var dtBaseTemplate = {
        name: "DataTable Base Tests",
        
        dsData: [
            {a:"0a",b:"0b",c:"0c"},
            {a:"1a",b:"1b",c:"1c"},
            {a:"2a",b:"2b",c:"2c"},
            {a:"3a",b:"3b",c:"3c"}
        ],
            
        dsConfig: {
            responseType:YAHOO.util.DataSource.TYPE_JSARRAY,
            responseSchema:{fields:["a","b","c"]}
        },

        columns: [{key:"a"},{key:"b"},{key:"c"}]
    };

    /**
     *
     *
     * Base DataTable test case.
     *
     *
     */
    function DataTableTestCase(template) {
        DataTableTestCase.superclass.constructor.call(this, template);
    };
    YAHOO.lang.extend(DataTableTestCase, TestCase);

    DataTableTestCase.prototype.setUp = function() {
        // Create container anew
        this.container = document.createElement("div");
        ///this.container.id = "testDTContainer"; // Is this necessary?
        document.body.appendChild(this.container);
        
        // Create DataSource anew
        this.datasource = new YAHOO.util.DataSource(this.dsData, this.dsConfig);
    };

    DataTableTestCase.prototype.tearDown = function() {
        // Destroy DataTable
        this.datatable.destroy();
        this.datatable = null;
        
        //  Destroy container
        if(this.container !== null) {
            YAHOO.util.Event.purgeElement(this.container, true);
            document.body.removeChild(this.container);
            this.container = null;
        }
        
        // TODO: need a destroy method
        this.datasource = null;
    };

    DataTableTestCase.prototype.createInstance = function(oDT, oConfig) {
        oDT = oDT || DataTable;
        this.datatable = new oDT(this.container, this.columns, this.datasource, oConfig);
        gCount++;
        return this.datatable;
    };

    /**
     *
     *
     * Tests ColumnSet APIs.
     *
     *
     */
    var csColumnSetTemplate = YAHOO.lang.merge(dtBaseTemplate, {
        name: "DataTable ColumnSet Tests",

        testGetColumnSet: function() {
            var dt = this.createInstance();
            var cs = dt.getColumnSet();

            Assert.isInstanceOf(ColumnSet, cs, "Expected a ColumnSet");
        },
        
        testGetColumn: function() {
            var dt = this.createInstance();
            //dt.subscribe("initEvent", function() {
                var cs = dt.getColumnSet();
                var oColumn = cs.keys[0];
                var sColId = oColumn.getId();
                
                var el = dt.getTheadEl().rows[0].cells[0];
                var oTestColumn = dt.getColumn(el);
                Assert.areSame(oColumn, oTestColumn, "Expected to get Column by el reference");
                
                //TODO: get column by el reference child
                
                // Removed col elements
                //el = Dom.get(dt.getId()+"-col"+sColId);
                //oTestColumn = dt.getColumn(el);
                //Assert.areSame(oColumn, oTestColumn, "Expected to get Column by DOM ID");
                
                oTestColumn = dt.getColumn(0);
                Assert.areSame(oColumn, oTestColumn, "Expected to get Column by key index");
    
                oTestColumn = cs.getColumn("a");
                Assert.areSame(oColumn, oTestColumn, "Expected to get Column by key (ColumnSet method)");
    
                oTestColumn = cs.getColumnById(sColId);
                Assert.areSame(oColumn, oTestColumn, "Expected to get Column by Column ID (ColumnSet method)");
            //});
        }

        //TODO: More ColumnSet APIs
    });
    var csColumnSetTest = new DataTableTestCase(csColumnSetTemplate);
    /**
     *
     *
     * Runs tests.
     *
     *
     */
    YAHOO.util.Event.addListener(window, "load", function() {
        var columnsetsuite = new TestSuite("ColumnSet Test Suite");
        columnsetsuite.add(csColumnSetTest);
        
        TestRunner.add(columnsetsuite);
    });
})();
