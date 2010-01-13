

module("Mootools");
//test("go fuck youreself", function () {
//    equals($('hey'), document.getElementById('hey'));
//});

test("Basic Selectors", function () {
    //equals(QUnit.equiv({}, {}), true);
    var main = $('main');
    equals(main.id, 'main', 'id');
    equals(main.getElements('a').length, 5, 'links');
    equals(main.getElements('.foo').length, 3, 'by class');
    equals(main.getElements('[rel=external]').length, 1, 'by attribute');
    equals(main.getElements('[href=4]').length, 1, 'by href');
    equals(main.getElements('[target=_blank]').length, 1, 'by target');
    equals(main.getElements('[target^=_bl]').length, 2, 'by beginning');
    equals(main.getElements('[rel$=nuts]').length, 1, 'by end');
    equals(main.getElements('[rel$=nuts]').length, 5, 'how big could this message POSSIBLY be???');
});

//Returns all input tags with name "dialog".
//$('myElement').getElements('input[name=dialog]');
// 
// //Returns all input tags with names ending with 'log'.
// $('myElement').getElements('input[name$=log]');
//  
//  //Returns all email links (starting with "mailto:").
//  $('myElement').getElements('a[href^=mailto:]');
//   
//   //Adds events to all Elements with the class name 'email'.
//   $(document.body).getElements('a.email').addEvents({
  //       'mouseenter': function(){
    //               this.href = 'real@email.com';
    //                   },
    //                       'mouseleave': function(){
      //                               this.href = '#';
      //                                   }
