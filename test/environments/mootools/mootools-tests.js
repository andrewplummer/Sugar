module("Mootools");

test("Basic Selectors", function () {

    var main = $('main');
    equals(main.id, 'main', 'id');
    equals(main.getElements('a').length, 5, 'links');
    equals(main.getElements('.foo').length, 3, 'by class');
    equals(main.getElements('[rel=external]').length, 1, 'by attribute');
    equals(main.getElements('[href=4]').length, 1, 'by href');
    equals(main.getElements('[target=_blank]').length, 1, 'by target');
    equals(main.getElements('[target^=_bl]').length, 2, 'by beginning');
    equals(main.getElements('[rel$=nuts]').length, 1, 'by end');

});
