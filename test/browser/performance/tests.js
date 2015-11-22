
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
      return Sugar.Object.get(arg, '0.response.related.transliterations[1].text');
    },
    targets: [
      'jsonArray * 10000'
    ]
  },
  {
    fn: function(arg) {
      return Sugar.Object.get2(arg, '0.response.related.transliterations[1].text');
    },
    targets: [
      'jsonArray * 10000'
    ]
  },
  {
    fn: function(arg) {
      return Sugar.Object.get3(arg, '0.response.related.transliterations[1].text');
    },
    targets: [
      'jsonArray * 10000'
    ]
  },
];

