# voxel-registry

A shared registry for managing item and block IDs (voxel.js plugin)

[![Build Status](https://travis-ci.org/deathcap/voxel-registry.png)](https://travis-ci.org/deathcap/voxel-registry)

## Usage

Load with [voxel-plugins](https://github.com/deathcap/voxel-plugins), then get the registry instance:

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
* hardness: required time to mine the block, used by [voxel-mine](https://github.com/deathcap/voxel-mine)
* itemDrop: name of item to drop when block is harvested, used by [voxel-harvest](https://github.com/deathcap/voxel-harvest)


Items are registered similarly:

    registry.registerItem(name, props);

* itemTexture: texture for rendering in an [inventory-window](https://github.com/deathcap/inventory-window)
* maxDamage: maximum damage before a tool breaks, used by [voxel-harvest](https://github.com/deathcap/voxel-harvest), [inventory-window](https://github.com/deathcap/inventory-window)

Blocks are implicitly considered items.


## License

MIT
