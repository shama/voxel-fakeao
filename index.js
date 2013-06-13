module.exports = function(game) {
  var THREE = game.THREE;

  var ao = function(face, light, dark) {
    if (light) {
      face.color = new THREE.Color(light);
    }
    if (typeof dark === 'string') {
      dark = new THREE.Color(dark);
    }
    light = face.color;
    var ld = (!dark) ? lightDark(light) : [light, dark];

    // TODO: AO should be figured better than this
    if (face.normal.y === 1)       face.vertexColors = [ld[0], ld[0], ld[0], ld[0]];
    else if (face.normal.y === -1) face.vertexColors = [ld[1], ld[1], ld[1], ld[1]];
    else if (face.normal.x === 1)  face.vertexColors = [ld[1], ld[0], ld[0], ld[1]];
    else if (face.normal.x === -1) face.vertexColors = [ld[1], ld[1], ld[0], ld[0]];
    else if (face.normal.z === 1)  face.vertexColors = [ld[1], ld[1], ld[0], ld[0]];
    else                           face.vertexColors = [ld[1], ld[0], ld[0], ld[1]];
  };

  ao.onGeometry = function(geom, light, dark) {
    for (var i = 0; i < geom.faces.length; ++i) {
      ao(geom.faces[i], light, dark);
    }
  };

  ao.onChunk = function(chunk, light, dark) {
    var pos = ('position' in chunk) ? chunk.position : chunk;
    var mesh = game.voxels.meshes[pos.join('|')];
    if (mesh) {
      ao.onGeometry(mesh.geometry, light, dark);
    }
  };

  var lightDark = memoize(function(light) {
    var hsl = light.getHSL();
    var dark = light.clone();
    dark.setHSL(hsl.h, hsl.s, hsl.l - 0.1);
    return [light, dark];
  });

  function memoize(func) {
    function memoized() {
      var cache = memoized.cache, key = arguments[0];
      return hasOwnProperty.call(cache, key)
        ? cache[key]
        : (cache[key] = func.apply(this, arguments));
    }
    memoized.cache = {};
    return memoized;
  }

  return ao;
};