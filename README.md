# voxel-fakeao

Apply a naive ambient occlusion to geometry faces.

Currently this just gradients horizontal faces dark to light, top faces light
and bottom faces dark. Could definitely be better but hey it's fake.

## example

```js
var fakeao = require('voxel-fakeao')(game);

// Apply fakeao to every chunk
game.on('renderChunk', function(chunk) {
  fakeao.onChunk(chunk);
});

// Or apply to a specify geometry
fakeao.onGeometry(mesh.geometry, '#ff0000');

// Or specific faces
for (var i = 0; i < geometry.faces.length; ++i) {
  fakeao(geometry.faces[i], '#dddddd', (Math.random() * 0xffffff)|0);
}
```

## api

### `var fakeao = require('voxel-fakeao')(game)`

#### `fakeao(face, [light, dark])`
Will apply gradient between light and dark onto the face. If `light` is omitted
it will use the existing face color. If `dark` is omitted then it will be
automatically calculated at 10% darker than `light`.

#### `fakeao.onGeometry(geometry, [light, dark])`
Apply to all the faces of a geometry.

#### `fakeao.onChunk(chunk, [light, dark])`
Apply to all the faces of a geometry on a chunk.

## install

With [npm](https://npmjs.org) do:

```
npm install voxel-fakeao
```

Use [browserify](http://browserify.org) to `require('voxel-fakeao')`.

## release history
* 0.1.1 - fix color conversions
* 0.1.0 - initial release

## license
Copyright (c) 2013 Kyle Robinson Young<br/>
Licensed under the MIT license.
