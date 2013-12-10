// # vim: set shiftwidth=2 tabstop=2 softtabstop=2 expandtab:

module.exports = function(game, opts) {
  return new Registry(game, opts);
};

function Registry(game, opts) {
  this.blockProps = [ {} ];
  this.blockName2ID = {};
}

Registry.prototype.registerBlock = function(name, props) {
  var nextID = this.blockProps.length;
  this.blockProps.push(props);
  this.blockName2ID[name] = props;  // TODO: check overwrite

  return nextID;
};

Registry.prototype.getBlockID = function(name) {
  return this.blockName2ID[name];
};

Registry.prototype.getBlockProps = function(name) {
  var blockID = this.getBlockID(name);
  return this.blockProps[blockID];
};

Registry.prototype.getBlockPropsAll = function(prop) {
  var props = [];
  for (var i = 1; i < this.blockProps.length; ++i) {
    props.push(this.blockProps[i][prop]);
  }
  return props;
};
