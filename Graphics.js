/**
 * @author Abraham Cardenas / https://github.com/Abe-Crdns (acarde12@ucsc.edu)
 * @version Mat3d graphics v1.0
 */

// global program variables
var renderer, scene, camera, controls, objMesh, object;
var transformArr = [];

/**
 * Initial function that calls all the helper functions in the GraphicsFuncs.js file.
 */
function init(){
  // RENDERER
  var canvas = document.getElementById('canvas1');
  renderer = new THREE.WebGLRenderer({canvas: canvas}, {antialias: true});
  renderer.setClearColor(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild( renderer.domElement );

  // CAMERA & SCENE
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  scene = new THREE.Scene();

  // CAMERA CONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;

  // DEFAULT CUBE OBJECT
  object = new THREE.BoxGeometry(2, 2, 2);
  var faces_cols = [0xffff00, 0x00ffff, 0xff00ff,
                    0x4f4f4f, 0x4b0082, 0xff8c00];

  var j = 0;
  for(var i = 0; i < object.faces.length; i+=2){
    object.faces[i].color.setHex(faces_cols[j]);
    object.faces[i+1].color.setHex(faces_cols[j]);
    j++
  }

  object.name = 'cube1';
  var material = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: THREE.FaceColors });
  objMesh = new THREE.Mesh(object, material);
  objMesh.name = 'cube1';
  scene.add(objMesh);

  // ADJUST THE SCENE
  controls.reset();
  objMesh.position.x = 1;
  objMesh.position.y = 1;
  objMesh.position.z = 1;
  camera.position.x = 15;
  camera.position.y = 15;
  camera.position.z = 15;

  // DEFAULT COORDINATE SYSTEM
  var GridSizes = 20;
  var GridXZ = new LabeledGrid(GridSizes, GridSizes, 10, [0, 1, 0], 0x0000ff, 0.75, true, "#000000", "left");
  GridXZ.name = "GridXZ";
  scene.add(GridXZ);

  var GridXY = new LabeledGrid(GridSizes, GridSizes, 10, [0, 0, 1], 0x00ff00, 0.75, true, "#000000", "left");
  GridXY.name = "GridXY";
  scene.add(GridXY);

  var GridYZ = new LabeledGrid(GridSizes, GridSizes, 10, [-1, 0, 0], 0xff0000, 0.75, true, "#000000", "left");
  GridYZ.name = "GridYZ";
  scene.add(GridYZ);

  // SETUP GUI
  var gui = new dat.GUI({autoPlace: false});
  var customContainer = document.getElementById('a_gui');
  customContainer.appendChild(gui.domElement);

  // PREDEFINED OBJECTS
  var objData = {
    objects: "Cube"
  };
  var objectTypes = gui.add(objData, 'objects', [ "Cube", "Teapot", "Sphere", "Cylinder", "File" ])
                         .name('Object').listen();
  objectTypes.onChange(function(value){ handleObjectType(value) });

  // TRANSFORMATIONS FOLDER
  loadGuiTransfms(gui);

  // RESET TRANSFORMATIONS
  var resetData = {
    reset: function(){ resetTransfms() }
  };
  gui.add(resetData, 'reset').name("Reset Object");

  // RECURSE THROUGH ANIMATION FRAME
  animate();
}

var animate = function(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

// calls the init function when the window is done loading.
window.onload = init;
