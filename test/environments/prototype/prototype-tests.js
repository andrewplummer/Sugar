

module("Prototype");
//test("go fuck youreself", function () {
//    equals($('hey'), document.getElementById('hey'));
//});

test("Basic Selectors", function () {
    //equals(QUnit.equiv({}, {}), true);
    var main = $('main');
    equals(main.id, 'main', 'id');
    equals(main.select('a').length, 5, 'links');
    equals(main.select('.foo').length, 3, 'by class');
    equals(main.select('[rel=external]').length, 1, 'by attribute');
    equals(main.select('[href=4]').length, 1, 'by href');
    equals(main.select('[target=_blank]').length, 1, 'by target');
    equals(main.select('[target^=_bl]').length, 2, 'by beginning');
    equals(main.select('[rel$=nuts]').length, 1, 'by end');
});
