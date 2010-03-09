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
     * Tests RecordSet APIs.
     *
     *
     */
    var rsRecordSetTemplate = YAHOO.lang.merge(dtBaseTemplate, {
        name: "DataTable RecordSet Tests",

        testGetRecordSet: function() {
            var dt = this.createInstance();
            var rs = dt.getRecordSet();

            Assert.isInstanceOf(RecordSet, rs, "Expected a RecordSet");    
        },
        
        testGetRecord: function() {
            var dt = this.createInstance();
            //dt.subscribe("initEvent", function() {
                var rs = dt.getRecordSet();
                var oRecord = rs._records[3];
                var sRecordId = oRecord.getId();
    
                var el = dt.getTbodyEl().rows[3];
                var oTestRecord = dt.getRecord(el);
                Assert.areSame(oRecord, oTestRecord, "Expected to get Record by el reference");
    
                var el = dt.getTbodyEl().rows[3].cells[2];
                oTestRecord = dt.getRecord(el);
                Assert.areSame(oRecord, oTestRecord, "Expected to get Record by el reference child");
    
                el = Dom.get(oTestRecord.getId());
                oTestRecord = null;
                oTestRecord = dt.getRecord(el);
                Assert.areSame(oRecord, oTestRecord, "Expected to get Record by DOM ID");
    
                oTestRecord = dt.getRecord(3);
                Assert.areSame(oRecord, oTestRecord, "Expected to get Record by position index");
    
                oTestRecord = dt.getRecord(sRecordId);
                Assert.areSame(oRecord, oTestRecord, "Expected to get Record by Record ID");
                
                oTestRecord = dt.getRecord(oRecord);
                Assert.areSame(oRecord, oTestRecord, "Expected to get Record by Record instance");
    
                oTestRecord = rs.getRecord(3);
                Assert.areSame(oRecord, oTestRecord, "Expected to get Record by position index (RecordSet method)");
    
                oTestRecord = rs.getRecord(sRecordId);
                Assert.areSame(oRecord, oTestRecord, "Expected to get Record by Record ID (RecordSet method)");
                
                oTestRecord = rs.getRecord(oRecord);
                Assert.areSame(oRecord, oTestRecord, "Expected to get Record by Record instance (RecordSet method)");
            //});
        },
        
        testGetInvalidRecord: function() {
            var dt = this.createInstance();
            //dt.subscribe("initEvent", function() {
                var rs = dt.getRecordSet();
                var oRecord = rs._records[3];
                dt.deleteRow(3);
    
                oTestRecord = dt.getRecord(oRecord);
                Assert.areSame(null, oTestRecord, "Expected not to get Record by invalid Record instance");
    
                oTestRecord = rs.getRecord(oRecord);
                Assert.areSame(null, oTestRecord, "Expected not to get Record by invalid Record instance (RecordSet method)");
            //});
        },

        testUpdateKey: function() {
            var dt = this.createInstance();
            //dt.subscribe("initEvent", function() {
                var rs = dt.getRecordSet();
                var oTestRecord = rs._records[0];
                rs.updateKey(0, "b", "xxx");
                Assert.areSame("xxx", oTestRecord.getData("b"), "Failed to update key b of Record 0 by position index");
    
                rs.updateKey(oTestRecord, "b", "zzz");
                Assert.areSame("zzz", oTestRecord.getData("b"), "Failed to update key b of Record 0 by instance");
    
                rs.updateKey(oTestRecord.getId(), "b", "yyy");
                Assert.areSame("yyy", oTestRecord.getData("b"), "Failed to update key b of Record 0 by ID");
            //});
        }


        //TODO: More RecordSet APIs
    });
    var rsRecordSetTest = new DataTableTestCase(rsRecordSetTemplate);
    
        /**
     *
     *
     * Runs tests.
     *
     *
     */
    YAHOO.util.Event.addListener(window, "load", function() {
        var recordsetsuite = new TestSuite("RecordSet Test Suite");
        recordsetsuite.add(rsRecordSetTest);
        
        TestRunner.add(recordsetsuite);
    });
})();
