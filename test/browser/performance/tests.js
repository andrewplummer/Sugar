
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
      return arg.indexOf('.') !== -1;
    },
    vars: {
      noDots: 'one',
      oneDot: 'one.two',
      tenDots: 'one.two.three.four.five.six.seven.eight.nine.ten'
    },
    targets: [
      'noDots * 1000000',
      'oneDot * 1000000',
      'tenDots * 1000000'
    ]
  },
  {
    fn: function(arg) {
      var split = arg.split('.');
      return split.length > 1;
    },
    vars: {
      noDots: 'one',
      oneDot: 'one.two',
      tenDots: 'one.two.three.four.five.six.seven.eight.nine.ten'
    },
    targets: [
      'noDots * 1000000',
      'oneDot * 1000000',
      'tenDots * 1000000'
    ]
  },
  {
    fn: function(arg) {
      return /\./.test(arg);
    },
    vars: {
      noDots: 'one',
      oneDot: 'one.two',
      tenDots: 'one.two.three.four.five.six.seven.eight.nine.ten'
    },
    targets: [
      'noDots * 1000000',
      'oneDot * 1000000',
      'tenDots * 1000000'
    ]
  },
];

