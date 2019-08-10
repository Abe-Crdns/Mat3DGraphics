/**
 * @author Abraham Cardenas
 * Default mat3d geometries.
 */

const MAT3D_CUBE = function(){
  var cube_geo = new THREE.BoxGeometry(1, 1, 1);
  cube_geo.name = "mat3dcube";
  cube_geo.computeBoundingBox();

  var j = 0;
  var cube_colors = [
    0xffff00, 0xff8c00, 0xff00ff,
    0x00fe0e, 0x00ffff, 0x4c4c4c
  ];
  for(var i = 0; i < cube_geo.faces.length; i+=2){
    cube_geo.faces[i].color.setHex(cube_colors[j]);
    cube_geo.faces[i+1].color.setHex(cube_colors[j]);
    j++;
  }

  var material = new THREE.MeshStandardMaterial({
    vertexColors: THREE.FaceColors,
    opacity: 0.7,
    transparent: true
  });
  var cube_mesh = new THREE.Mesh(cube_geo, material);
  cube_mesh.name = "cube1mesh";

  return { geometry: cube_geo, mesh: cube_mesh };
}();


const MAT3D_TEAPOT = function(){
  var teapot_geo = new THREE.TeapotBufferGeometry(0.5);
  teapot_geo.name = "mat3dteapot";
  teapot_geo.computeBoundingBox();

  var teapot_material = new THREE.MeshStandardMaterial({
    vertexColors: THREE.FaceColors,
    opacity: 0.7,
    transparent: true
  });
  var teapot_mesh = new THREE.Mesh(teapot_geo, teapot_material);
  teapot_mesh.name = "teapot1mesh";

  return { geometry: teapot_geo, mesh: teapot_mesh };
}();


const MAT3D_SPHERE = function(){
  var sphere_geo = new THREE.SphereGeometry(0.5, 64, 64);
  sphere_geo.name = "mat3dsphere";
  sphere_geo.computeBoundingBox();

  var col_ind = 0;
  var wrap_around = false;
  var beach_ball_cols = [0x000ff, 0xffffff, 0x00ff00];
  for(var i = 0; i < sphere_geo.faces.length; i+=16){
    for(var j = 0; j < 16; j++){
      sphere_geo.faces[i+j].color.setHex(beach_ball_cols[2-col_ind]);
    }
    if(col_ind == 0)
      wrap_around = true;
    else if(col_ind == 2)
      wrap_around = false;

    if(wrap_around)
      col_ind++;
    else
      col_ind--;
  }

  var material = new THREE.MeshStandardMaterial({
    vertexColors: THREE.FaceColors,
    opacity: 0.7,
    transparent: true
  });
  var sphere_mesh = new THREE.Mesh(sphere_geo, material);
  sphere_mesh.name = "sphere1mesh";

  return { geometry: sphere_geo, mesh: sphere_mesh };
}();


const MAT3D_CYLINDER = function(){
  var cylinder_geo = new THREE.CylinderGeometry(0.5, 0.5, 1, 48);
  cylinder_geo.name = "mat3dcylinder";
  cylinder_geo.computeBoundingBox();

  var cylinder_colors = [0xffff00, 0x00ffff, 0xff00ff];
  cylinder_geo.faces.forEach(function(faces, i){
    faces.color.setHex(cylinder_colors[i % 3]);
  });

  var material = new THREE.MeshStandardMaterial({
    vertexColors: THREE.FaceColors,
    opacity: 0.7,
    transparent: true
  });
  var cylinder_mesh = new THREE.Mesh(cylinder_geo, material);
  cylinder_mesh.name = "cylinder1mesh";

  return { geometry: cylinder_geo, mesh: cylinder_mesh };
}();
