var Person = function(name){
    this.name = name;
};

Person.prototype.toJSON = function() {
  return '-' + this.name;
};