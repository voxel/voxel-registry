
var toArray = require('toarray');

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
  var props = this.blockProps[blockIndex]
    
  return props ? props.name : '<index #'+blockIndex+'>';
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

  // TODO: default for missing texture
  textureName = 'gravel';

  if (props) {
    var textureName = props.itemTexture;

    if (textureName === undefined) {
      if (props.texture !== undefined) {
        // no item texture, use block texture
        // 3D CSS cube using https://github.com/deathcap/cube-icon
        return toArray(props.texture).map(this.getTextureURL);
      }
    }
  }

  // returns a Blob URL, could point inside a zipped pack
  return this.getTextureURL(textureName);
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

// Texture blob URLs - requires https://github.com/deathcap/artpacks
// TODO: move somewhere else?

Registry.prototype.onTexturesReady = function(cb) {
  if (!this.game.materials.artPacks) return;

  if (this.game.materials.artPacks.isQuiescent())
    cb();
  else
    this.game.materials.artPacks.on('loadedAll', cb);
};

Registry.prototype.getTextureURL = function(name) {
  if (!this.game.materials.artPacks) return;

  return this.game.materials.artPacks.getTexture(name);
  // TODO: default texture if undefined
};



