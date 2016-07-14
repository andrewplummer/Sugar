// These methods are used in node require so cannot reset.
// delete Number.isNaN;

delete Array.from;
delete Array.prototype.find;
delete Array.prototype.findIndex;

delete String.prototype.endsWith;
delete String.prototype.includes;
delete String.prototype.repeat;
delete String.prototype.startsWith;
