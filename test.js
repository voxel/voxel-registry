'use strict';

var test = require('tape');
var createRegistry = require('./');


test('register block', function(t) {
  var registry = createRegistry(); // doesn't need game nor opts

  registry.registerBlock('dirt', {});
  t.equals(registry.getBlockIndex('dirt'), 1); // note: actual number is implementation detail
  t.equals(registry.getBlockName(1), 'dirt');

  registry.registerBlock('grass', {});
  t.equals(registry.getBlockIndex('grass'), 2);
  t.equals(registry.getBlockName(2), 'grass');

  t.end();
});

test('block properties', function(t) {
  var registry = createRegistry();

  registry.registerBlock('dirt', {hardness:5});
  t.equals(registry.getBlockProps('dirt').hardness, 5);
  t.equals(registry.getProp('dirt', 'hardness'), 5);
  t.end();
});

test('register block duplicate', function(t) {
  var registry = createRegistry();

  registry.registerBlock('dirt', {});
  t.throws(function() {
    registry.registerBlock('dirt', {}); // duplicate block name
  });
  t.end();
});

test('register blocks', function(t) {
  var registry = createRegistry();

  registry.registerBlocks('fence', 4, {foo:1})
  //console.log(registry);

  // registered as many IDs as requested
  t.equals(registry.getBlockProps('fence#0').foo, 1)
  t.equals(registry.getBlockProps('fence#1').foo, 1)
  t.equals(registry.getBlockProps('fence#2').foo, 1)
  t.equals(registry.getBlockProps('fence#3').foo, 1)

  // all identical props
  t.equals(registry.getBlockProps('fence#0'), registry.getBlockProps('fence#1'));
  t.equals(registry.getBlockProps('fence#0'), registry.getBlockProps('fence#2'));
  t.equals(registry.getBlockProps('fence#0'), registry.getBlockProps('fence#3'));

  // index offsets
  t.equals(registry.getBlockIndex('fence#0') - registry.getBlockProps('fence#0').baseIndex, 0);
  t.equals(registry.getBlockIndex('fence#1') - registry.getBlockProps('fence#1').baseIndex, 1);
  t.equals(registry.getBlockIndex('fence#2') - registry.getBlockProps('fence#2').baseIndex, 2);
  t.equals(registry.getBlockIndex('fence#3') - registry.getBlockProps('fence#3').baseIndex, 3);
  t.end()
});

test('register item', function(t) {
  var registry = createRegistry();

  registry.registerItem('tool', {speed:1000});
  t.equals(registry.getItemProps('tool').speed, 1000);
  t.equals(registry.getProp('tool', 'speed'), 1000);

  t.end();
});

test('item and block share same namespace', function(t) { 
  var r = createRegistry();
  r.registerBlock('foo', {});
  t.throws(function() {
    r.registerItem('foo', {}); // conflicts with existing block name
  });

  t.end();
});

test('is block?', function(t) {
  var r = createRegistry();
  r.registerBlock('block', {});
  r.registerItem('item', {});

  t.equals(r.isBlock('block'), true);
  t.equals(r.isBlock('item'), false);
  t.end();
});

test('blocks are implicitly items', function(t) {
  var r = createRegistry();
  r.registerBlock('foo', {bar:9});

  t.equals(r.getBlockProps('foo').bar, 9);
  t.equals(r.getItemProps('foo').bar, 9);
  t.equals(r.getProp('foo', 'bar'), 9);
  t.end();
});

test('but items not necessarily blocks', function(t) {
  var r = createRegistry();
  r.registerItem('tool', {speed:1});

  t.equals(r.getBlockProps('tool') === undefined, true);
  t.equals(r.getItemProps('tool').speed, 1);
  t.end();
});

