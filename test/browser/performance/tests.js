
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


function ebFormat(str, obj) {
  var expressions = [];
  for (var key in obj){
    expressions.push({
      expression: new RegExp(
        ["\\{", key, "\\}"].join(""), 
        "gim"
      ),
      value: obj[key]
    })
  }

  var replaced = str;
  expressions.forEach(function(expression) {
    replaced = replaced.replace(expression.expression, expression.value);
  });

  return replaced;
}

var tests = [
  {
    name: 'Original',
    fn: function(arg) {
      return arg.format(templateKey);
    },
    targets: [
      'simpleTemplateString * 10000',
      'complexTemplateString * 1000',
      'complexUniqueTemplateString * 1000'
    ]
  },
  {
    name: 'Earl-Brown',
    fn: function(arg) {
      return ebFormat(arg, templateKey);
    },
    targets: [
      'simpleTemplateString * 10000',
      'complexTemplateString * 1000',
      'complexUniqueTemplateString * 1000'
    ]
  },
  /*
  {
    name: 'Ermouth key pass',
    fn: function(arg) {
      return arg.format2(templateKey);
    },
    targets: [
      'simpleTemplateString * 10000',
      'complexTemplateString * 1000',
      'complexUniqueTemplateString * 1000'
    ]
  },
  {
    name: 'Walk characters',
    fn: function(arg) {
      return arg.format3(templateKey);
    },
    targets: [
      'simpleTemplateString * 10000',
      'complexTemplateString * 1000',
      'complexUniqueTemplateString * 1000'
    ]
  },
  {
    name: 'Ermouth 2nd',
    fn: function(arg) {
      return arg.format4(templateKey);
    },
    targets: [
      'simpleTemplateString * 10000',
      'complexTemplateString * 1000',
      'complexUniqueTemplateString * 1000'
    ]
  },
  {
    name: '.indexOf + .slice',
    fn: function(arg) {
      return arg.format5(templateKey);
    },
    targets: [
      'simpleTemplateString * 10000',
      'complexTemplateString * 1000',
      'complexUniqueTemplateString * 1000'
    ]
  },
  {
    name: 'Original with Object.keys pre-pass',
    fn: function(arg) {
      return arg.format6(templateKey);
    },
    targets: [
      'simpleTemplateString * 10000',
      'complexTemplateString * 1000',
      'complexUniqueTemplateString * 1000'
    ]
  },
  {
    name: 'Simplified regex',
    fn: function(arg) {
      return arg.format7(templateKey);
    },
    targets: [
      'simpleTemplateString * 10000',
      'complexTemplateString * 1000',
      'complexUniqueTemplateString * 1000'
    ]
  },
  {
    name: 'Match all the things!',
    fn: function(arg) {
      return arg.format8(templateKey);
    },
    targets: [
      'simpleTemplateString * 10000',
      'complexTemplateString * 1000',
      'complexUniqueTemplateString * 1000'
    ]
  },
  {
    name: 'Memoize functions',
    fn: function(arg) {
      return arg.format9(templateKey);
    },
    targets: [
      'simpleTemplateString * 10000',
      'complexTemplateString * 1000',
      'complexUniqueTemplateString * 1000'
    ]
  },
  {
    name: 'Ermouth memoize tokens',
    fn: function(arg) {
      return arg.format10(templateKey);
    },
    targets: [
      'simpleTemplateString * 10000',
      'complexTemplateString * 1000',
      'complexUniqueTemplateString * 1000'
    ]
  },
 */
];

