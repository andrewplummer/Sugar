// These methods are used in node require so cannot reset.
// delete Object.keys;

delete Array.isArray;
delete Array.prototype.every;
delete Array.prototype.filter;
delete Array.prototype.forEach;
delete Array.prototype.indexOf;
delete Array.prototype.lastIndexOf;
delete Array.prototype.map;
delete Array.prototype.reduce;
delete Array.prototype.reduceRight;
delete Array.prototype.some;

delete Date.now;
delete Date.prototype.toISOString;
delete Date.prototype.toJSON;

delete Function.prototype.bind;

delete String.prototype.trim;
