// # vim: set shiftwidth=2 tabstop=2 softtabstop=2 expandtab:

module.exports = function(game, opts) {
  return new Registry(game, opts);
};

function Registry(game, opts) {
  this.game = game;

  this.blockProps = [ {} ];
  this.blockName2Index= { air:0 };

  this.itemProps = {};
}

Registry.prototype.registerBlock = function(name, props) {
  var nextIndex = this.blockProps.length;
  if (this.blockName2Index[name])
    throw "registerBlock: duplicate block name "+name+", existing index "+this.blockName2Index[name]+" attempted overwrite by "+nextIndex;

  // default properties
  props.name = props.name || name;
  this.blockProps.push(props);
  this.blockName2Index[name] = nextIndex;

  return nextIndex;
};

// @deprecated in favor of getBlockIndex
Registry.prototype.getBlockID = function(name) {
  return this.getBlockIndex(name);
};

Registry.prototype.getBlockIndex = function(name) {
  return this.blockName2Index[name];
};

Registry.prototype.getBlockName = function(blockIndex) {
  return this.blockProps[blockIndex].name;
};

Registry.prototype.getBlockProps = function(name) {
  var blockIndex = this.getBlockIndex(name);
  return this.blockProps[blockIndex];
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
  if (this.blockName2Index[name])
    throw "registerItem: item name "+name+" conflicts with existing block name of index"+this.blockName2Index[name];

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
  return (this.game ? this.game.materials.texturePath : '') + textureName + '.png';
};

Registry.prototype.getItemDisplayName = function(name) {
  var props = this.getItemProps(name);
  
  if (!props) return '<unknown>';

  if (props.displayName) return props.displayName;

  // default is initial-uppercased internal name
  var initialCap = name.substr(0, 1).toUpperCase();
  var rest = name.substr(1);
  return initialCap + rest;
};

Registry.prototype.getItemPileTexture = function(itemPile) {
  return this.getItemTexture(itemPile.item);
};

// return true if this name is a block, false otherwise (may be an item)
Registry.prototype.isBlock = function(name) {
  return this.blockName2Index[name] !== undefined;
};
