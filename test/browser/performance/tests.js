
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

var tests = [
  {
    fn: function(arg) {
      return Date.create('2010-08-25')
    },
    targets: [
      'normalString * 1000'
    ]
  },
  {
    fn: function(arg) {
      return arg.findAll(/^a/);
    },
    targets: [
      'emptyArray * 200000',
      'smallNumberArray * 100000',
      'smallStringArray * 100000',
      'bigNumberArray * 100',
      'bigStringArray * 100',
      'bigDateArray * 10',
      'jsonArray * 10000'
    ]
  },
  {
    fn: function(arg) {
      return Object.map(arg, function() {
        return 3;
      });
    },
    targets: [
      'simpleObject * 100000',
      'deepObject * 100000',
      'jsonObject * 100000'
    ]
  },
  {
    fn: function(arg) {
      return Object.isString(arg);
    },
    targets: [
      'emptyString * 1000000',
      'normalString * 1000000',
      'hugeString * 1000000',
    ]
  }
];

