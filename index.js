module.exports = function(game) {
  var THREE = game.THREE;
  var colorCache = Object.create(null);

  var ao = function(face, light, dark) {
    if (arguments.length === 1) {
      light = face.color;
      dark = getDark(light);
    } else if (arguments.length === 2) {
      light = convertColor(light);
      dark = getDark(light);
    } else {
      light = convertColor(light);
      dark = convertColor(dark);
    }
    face.color = light;

    // TODO: AO should be figured better than this
    if (face.normal.y === 1)       face.vertexColors = [light, light, light, light];
    else if (face.normal.y === -1) face.vertexColors = [dark,  dark,  dark,  dark];
    else if (face.normal.x === 1)  face.vertexColors = [dark,  light, light, dark];
    else if (face.normal.x === -1) face.vertexColors = [dark,  dark,  light, light];
    else if (face.normal.z === 1)  face.vertexColors = [dark,  dark,  light, light];
    else                           face.vertexColors = [dark,  light, light, dark];
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

  var getDark = function(light) {
    var hex = light.getHexString();
    if (colorCache[hex]) return colorCache[hex];
    var hsl = light.getHSL();
    var dark = light.clone();
    dark.setHSL(hsl.h, hsl.s, hsl.l - 0.1);
    return colorCache[hex] = dark;
  };

  var convertColor = function(color) {
    if (color instanceof THREE.Color) return color;
    if (colorCache[color]) return colorCache[color];
    return colorCache[color] = new THREE.Color(color);
  };

  return ao;
};
