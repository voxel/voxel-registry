// # vim: set shiftwidth=2 tabstop=2 softtabstop=2 expandtab:

module.exports = function(game, opts) {
  return new Registry(game, opts);
};

function Registry(game, opts) {
  this.game = game;
  this.game.registry = this;

  this.blockProps = [ {} ];
  this.blockName2ID = { air:0 };

  this.itemProps = {};

  if (opts.registerDefaults) opts.registerDefaults(this);
}

Registry.prototype.registerBlock = function(name, props) {
  var nextID = this.blockProps.length;
  if (this.blockName2ID[name])
    throw "registerBlock: duplicate block name "+name+", existing ID "+this.blockName2ID[name]+" attempted overwrite by "+nextID;

  // default properties
  props.name = props.name || name;
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

Registry.prototype.getItemTexture = function(name) {
  var props = this.getItemProps(name);
  var textureName = props.itemTexture;

  if (textureName === undefined) {
    if (props.texture !== undefined) {
      // no item texture, use block texture
      // TODO: 3D cube, maybe with CSS transforms, like https://github.com/shama/craft
      textureName = typeof props.texture === 'string' ? props.texture : props.texture[0];
    } else {
      // TODO: default for missing texture
      textureName = 'gravel';
    }
  }
  // TODO: different image categories, blocks, items may be in different folders

  // TODO: should this return a three.js image, instead of a URL? how about zipped or stitched texture packs?
  return this.game.materials.texturePath + textureName + '.png';
};

Registry.prototype.getItemPileTexture = function(itemPile) {
  return this.getItemTexture(itemPile.item);
};

// return true if this name is a block, false otherwise (may be an item)
Registry.prototype.isBlock = function(name) {
  return this.blockName2ID[name] !== undefined;
};
