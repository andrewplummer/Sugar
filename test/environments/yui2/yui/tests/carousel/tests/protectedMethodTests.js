(function () {
     var ArrayAssert  = YAHOO.util.ArrayAssert,
         Assert       = YAHOO.util.Assert,
         carousel,
         protectedMethods,
         ObjectAssert = YAHOO.util.ObjectAssert;

    YAHOO.namespace("CarouselTests");

    protectedMethods = new YAHOO.tool.TestCase({
        testGetValidIndex: function () {
            carousel.set("numItems", 9);
            Assert.areEqual(0, carousel._getValidIndex(0),
                            "_getValidIndex(0) should have returned 0");
            Assert.areEqual(3, carousel._getValidIndex(3),
                            "_getValidIndex(3) should have returned 3");
            Assert.areEqual(6, carousel._getValidIndex(6),
                            "_getValidIndex(6) should have returned 6");
            Assert.areEqual(8, carousel._getValidIndex(9),
                            "_getValidIndex(9) should have returned 8");
            Assert.areEqual(0, carousel._getValidIndex(-3),
                            "_getValidIndex(-3) should have returned 0");

            carousel.set("numItems", 8);
            carousel.set("isCircular", true);
        },

        testGetValidIndexForCircularCarousel: function () {
            carousel.set("numItems", 8);
            carousel.set("isCircular", true);
            Assert.areEqual(0, carousel._getValidIndex(0),
                            "_getValidIndex(0) should have returned 0");
            Assert.areEqual(3, carousel._getValidIndex(3),
                            "_getValidIndex(3) should have returned 3");
            Assert.areEqual(6, carousel._getValidIndex(6),
                            "_getValidIndex(6) should have returned 6");
            Assert.areEqual(0, carousel._getValidIndex(9),
                            "_getValidIndex(9) should have returned 0");
            Assert.areEqual(6, carousel._getValidIndex(-3),
                            "_getValidIndex(-3) should have returned 6");
        }
    });

    YAHOO.CarouselTests.protectedMethodTests = new YAHOO.tool.TestSuite({
            name: "Carousel (protected methods) Tests",

            setUp: function () {
                carousel = new YAHOO.widget.Carousel("container5");
            },

            tearDown : function () {
                delete carousel;
            }
    });

    YAHOO.CarouselTests.protectedMethodTests.add(protectedMethods);
})();
/*
;;  Local variables: **
;;  mode: js2 **
;;  indent-tabs-mode: nil **
;;  End: **
*/
