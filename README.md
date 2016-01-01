# voxel-registry

A shared registry for managing item and block IDs (voxel.js plugin)

[![Build Status](https://travis-ci.org/voxel/voxel-registry.png)](https://travis-ci.org/voxel/voxel-registry)

## Usage

Load with [voxel-plugins](https://github.com/voxel/voxel-plugins), then get the registry instance:

    var registry = game.plugins.get('voxel-registry');

To register a new block:

    registry.registerBlock(name, props);

`name` should be a fixed textual identifier, `props` an object with information about the block.
The block will be allocated a numerical index value automatically, which can be used in the 
voxel.js chunk data arrays. (The initial motivation for voxel-registry was to avoid hardcoded
numerical IDs, allowing blocks to be referred to across plugins by name, instead.) You can 
translate between IDs and names using this module (see the source for details).

Property names can be anything, but the following conventions are known:

* texture: textures for rendering voxels
* hardness: required time (seconds) to mine the block with no tool, used by [voxel-mine](https://github.com/voxel/voxel-mine)
* effectiveTool: tool class name which gives a speedup when mining, used by [voxel-mine](https://github.com/voxel/voxel-mine)
* itemDrop: name of item to drop when block is harvested, used by [voxel-harvest](https://github.com/voxel/voxel-harvest)


Items are registered similarly:

    registry.registerItem(name, props);

* itemTexture: texture for rendering in an [inventory-window](https://github.com/deathcap/inventory-window)
* maxDamage: maximum damage before a tool breaks, used by [voxel-harvest](https://github.com/voxel/voxel-harvest), [inventory-window](https://github.com/deathcap/inventory-window)
* toolClass: general category of the tool, matches `effectiveTool`, used by [voxel-mine](https://github.com/voxel/voxel-mine)
* speed: mining speedup multiplier when `toolClass` matches `effectiveTool`, used by [voxel-mine](https://github.com/voxel/voxel-mine)
* displayName: human-readable name for GUI displays, returned by `getItemDisplayName(name)`

Blocks are implicitly considered items.

### Dynamic properties

If a property value is set to a function, then `registry.getProp(itemName, propName[, arg])`
will execute the function and return the result. If `arg` is given it will be passed to the function.

### Item textures

`getItemPileTexture(itemPile)` gets the texture URL(s) for an
[itempile](https://github.com/deathcap/itempile) for display in GUIs.
If the texture is a 3D cube, this will be an array for each face, otherwise a string.
Texture URLs are resolved through `game.materials.artPacks`, assumed to be an instance
of [artpacks](https://github.com/deathcap/artpacks).

If `itemTexture` or `texture` is a dynamic property, then it will
be called with the item pile's `tags` as an argument.

### Metablocks and states

Sometimes it is desirable to associate a small amount of extra data with a block
(examples: on/off, orientation, age, height, growth, subtype, color, etc.). The
`registerBlocks()` method can be used for this purpose:

    registry.registerBlocks(name, count, props);

where `count` is the number of "states" needed. Dynamic property functions
will be called with each corresponding metadata value (for example, count=16
corresponds to 0 to 15) as the argument. For examples of this API in
action, see the
[voxel-pumpkin](https://github.com/voxel/voxel-pumpkin) and
[voxel-wool](https://github.com/voxel/voxel-wool) plugins.

Internally, `count` blocks are registered with identical `props`, and
the index offset is used as the metadata/state, so `count` should be a
small integer, as it is limited by and shared with the available block index space
(e.g. 2^16 if voxel-engine `arrayType` is `Uint16Array`). However,
[unlike Minecraft](http://minecraft.gamepedia.com/Data_values#Data), it is
not restricted to 4-bits (16) and can be sized precisely as needed. 

If larger amounts of data are needed, arbitrary objects can be stored
at a block location using [voxel-blockdata](https://github.com/voxel/voxel-blockdata) instead.

## License

MIT
