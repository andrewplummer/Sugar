
var o1 = {foo:'bar'};
var o2 = {b:{c:new Date()}};
var o3 = {foo:'bar'};

var arr = [];
arr.push(o1);
arr.push(o2);
arr.push(o3);
arr.push(o1);
arr.push(o2);
arr.push(o3);
arr.push(o1);
arr.push(o2);
arr.push(o3);
arr.push(o1);
arr.push(o2);
arr.push(o3);


arr = arr.concat(arr);
arr = arr.concat(arr);
arr = arr.concat(arr);
arr = arr.concat(arr);
arr = arr.concat(arr);
arr = arr.concat(arr);

var templateObj = {
  'x':  '1,',
  'y':  '2,',
  'yy': '3,',
  'z':  '4,'
}

var tests = [
  {
    fn: function(arg) {
      return arg.format(templateObj);
    },
    targets: [
      'simpleTemplateString * 10000'
    ]
  },
  {
    fn: function(arg) {
      return arg.format(templateObj);
    },
    targets: [
      'complexTemplateString * 1000'
    ]
  },
];

