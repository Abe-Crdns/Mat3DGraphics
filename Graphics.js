/**
 * @author Abraham Cardenas / https://github.com/Abe-Crdns (acarde12@ucsc.edu)
 * @version Mat3d graphics v1.0
 */

// global program variables
var renderer, scene, camera, controls, objMesh, object;
var ambientLight, ptLightArr = [];
var xLight1, yLight1, zLight1;
var xLight2, yLight2, zLight2;
var xLight3, yLight3, zLight3;
var GridXY, GridXZ, GridYZ;
var GridSizes, GridXYCol, GridXZCol, GridYZCol;
var textColXY, textColXZ, textColYZ;
var transformArr = [];

/**
 * Initial function that calls all the helper functions in the GraphicsFuncs.js file.
 */
function init(){
  // RENDERER
  var canvas = document.getElementById('canvas1');
  renderer = new THREE.WebGLRenderer({canvas: canvas}, {antialias: true});
  renderer.setClearColor(0xA0A0A0);
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

  // DEFAULT LIGHTING
  ptLightArr.push(new THREE.PointLight(0xffffff, 1, 0));
  ptLightArr.push(new THREE.PointLight(0xffffff, 1, 0));
  ptLightArr.push(new THREE.PointLight(0xffffff, 1, 0));

  xLight1 = 0; yLight1 = 200; zLight1 = 0;
  ptLightArr[0].position.set(xLight1, yLight1, zLight1);
  xLight2 = 100; yLight2 = 200; zLight2 = 100;
  ptLightArr[1].position.set(xLight2, yLight2, zLight2);
  xLight3 = -100; yLight3 = -200; zLight3 = -100;
  ptLightArr[2].position.set(xLight3, yLight3, zLight3);

  scene.add(ptLightArr[0]);
  scene.add(ptLightArr[1]);
  scene.add(ptLightArr[2]);

  ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  // DEFAULT CUBE OBJECT
  object = new THREE.BoxGeometry(2, 2, 2);
  object.name = 'cube1';
  var material = new THREE.MeshStandardMaterial();
  objMesh = new THREE.Mesh(object, material);
  objMesh.material.color.setHex(0x2194ce);
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
  GridSizes = 20;
  GridXYCol = new THREE.Color(0x008800);
  GridXZCol = new THREE.Color(0x000088);
  GridYZCol = new THREE.Color(0x880000);
  textColXY = new THREE.Color(0x000000);
  textColXZ = new THREE.Color(0x000000);
  textColYZ = new THREE.Color(0x000000);

  GridXZ = new LabeledGrid(GridSizes, GridSizes, 10, [0, 1, 0], 0x000088, 0.4, true, "#000000", "left");
  GridXZ.name = "GridXZ";
  scene.add(GridXZ);

  GridXY = new LabeledGrid(GridSizes, GridSizes, 10, [0, 0, 1], 0x008800, 0.4, true, "#000000", "left");
  GridXY.name = "GridXY";
  scene.add(GridXY);

  GridYZ = new LabeledGrid(GridSizes, GridSizes, 10, [-1, 0, 0], 0x880000, 0.4, true, "#000000", "left");
  GridYZ.name = "GridYZ";
  scene.add(GridYZ);

  // SETUP GUI
  var gui = new dat.GUI({autoPlace: false});
  var customContainer = document.getElementById('a_gui');
  customContainer.appendChild(gui.domElement);
  var isAmbient = true, isLight1 = true, isLight2 = true, isLight3 = true;

  // PREDEFINED OBJECTS
  var objData = {
    objects: "Cube"
  };
  var objectTypes = gui.add(objData, 'objects', [ "Cube", "Teapot", "Sphere", "Cylinder", "File" ] ).name('Object').listen();
  objectTypes.onChange(function(value){ handleObjectType(value) });

  var backgroundData = {
    Background: '#A0A0A0',
  };
  var color = new THREE.Color();
  var colorConvert = handleLightColor(color);
  gui.addColor(backgroundData, 'Background').onChange(function(value){
    colorConvert(value);
    renderer.setClearColor(color.getHex());
  });

  // LIGHTS FOLDER
  loadGuiLights(gui, isAmbient, isLight1, isLight2, isLight3);

  // TRANSFORMATIONS FOLDER
  loadGuiTransfms(gui);

  // COORDINATE SYSTEM COLORS, OPACITY & SIZE
  loadGuiCoordSys(gui);

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
