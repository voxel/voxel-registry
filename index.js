// # vim: set shiftwidth=2 tabstop=2 softtabstop=2 expandtab:

module.exports = function(game, opts) {
  return new Registry(game, opts);
};

function Registry(game, opts) {
  this.blockProps = [ {} ];
  this.blockName2ID = { air:0 };

  this.itemProps = {};
}

Registry.prototype.registerBlock = function(name, props) {
  var nextID = this.blockProps.length;
  if (this.blockName2ID[name])
    throw "registerBlock: duplicate block name "+name+", existing ID "+this.blockName2ID[name]+" attempted overwrite by "+nextID;

  // default properties
  props.name = props.name || name;
  if (props.texture && !props.itemTexture) {
    // use top of block texture as item texture by default
    props.itemTexture = typeof props.texture === 'string' ? props.texture : props.texture[0];
  }

  this.blockProps.push(props);
  this.blockName2ID[name] = nextID;

  return nextID;
};

Registry.prototype.getBlockID = function(name) {
  return this.blockName2ID[name];
};

Registry.prototype.getBlockName = function(blockID) {
  return this.blockProps[blockID].name;
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


Registry.prototype.registerItem = function(name, props) {
  if (this.itemProps[name])
    throw "registerItem: duplicate item name "+name+", existing properties: "+this.itemProps[name];
  if (this.blockName2ID[name])
    throw "registerItem: item name "+name+" conflicts with existing block name of ID "+this.blockName2ID[name];

  this.itemProps[name] = props;
};

Registry.prototype.getItemProps = function(name) {
  return this.itemProps[name] || this.getBlockProps(name); // blocks are implicitly also items
};

// return true if this name is a block, false otherwise (may be an item)
Registry.prototype.isBlock = function(name) {
  return this.blockName2ID[name] !== undefined;
};
