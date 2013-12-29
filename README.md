# voxel-registry

A shared registry for managing item and block IDs (voxel.js plugin)

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

* texture:
* hardness: used by [voxel-mine](https://github.com/deathcap/voxel-mine), required time to mine the block
* itemDrop: used by [voxel-harvest](https://github.com/deathcap/voxel-harvest), name of item to drop when block is harvested


Items are registered similarly:

    registry.registerItem(name, props);

* itemTexture:

Blocks are implicitly considered items.


## License

MIT
