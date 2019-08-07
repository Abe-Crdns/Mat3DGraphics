/**
 *                MAT3D Graphics
 * @author Abraham Cardenas / https://github.com/Abe-Crdns
 * @version 2.0
 */

import { CoordSys3D } from './coordinate_system/CoordSys3D.js'

// global program variables
var RENDERER, SCENE, CAMERA, CONTROLS;
var RAYCASTER, GEOMETRY, MESH, _3D_GRID;

var DAT_GUI = new dat.GUI();
var MOUSE = new THREE.Vector2(0, 0);
var INTERSECT_OBJS = [];
var TRANSFM_ARR = [];

/**
 * Init/main function
 */
function init(){
  // RENDERER
  var canvas = document.getElementById('canvas1');
  RENDERER = new THREE.WebGLRenderer({canvas: canvas}, {antialias: true});
  RENDERER.setClearColor(0xffffff);
  RENDERER.setSize(window.innerWidth, window.innerHeight);

  // RAY CASTER
  RAYCASTER = new THREE.Raycaster();
  RAYCASTER.linePrecision = 1;

  // CAMERA & SCENE
  CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 5000);
  SCENE = new THREE.Scene();

  // CAMERA CONTROLS
  CONTROLS = new THREE.OrbitControls(CAMERA, RENDERER.domElement);
  CONTROLS.enableDamping = true;
  CONTROLS.dampingFactor = 0.25;
  CONTROLS.enableZoom = true;

  // ambient light
  var light = new THREE.AmbientLight( 0xffffff );
  SCENE.add(light);

  // DEFAULT CUBE OBJECT
  GEOMETRY = MAT3D_CUBE.geometry;
  MESH = MAT3D_CUBE.mesh;
  INTERSECT_OBJS.push(MESH);
  SCENE.add(MESH);

  // DEFAULT COORDINATE SYSTEM (includes axis and raylines)
  _3D_GRID = new CoordSys3D({origin: {x: -2.5, y: -0.5, z: -2.5}});
  _3D_GRID.name = "My3DGrid";
  SCENE.add(_3D_GRID);

  // SETUP GUI
  var customContainer = document.getElementById('a_gui');
  customContainer.appendChild(DAT_GUI.domElement);

  // PREDEFINED OBJECTS
  var objs = { Objects: "Cube" };
  var objectTypes = DAT_GUI.add(objs, 'Objects',
                            [ "Cube", "Teapot", "Sphere", "Cylinder", "File" ]).listen();

  objectTypes.onChange(function(value){ handleObjectType(value) });

  DAT_GUI.add({X: '0.0'}, 'X');
  DAT_GUI.add({Y: '0.0'}, 'Y');
  DAT_GUI.add({Z: '0.0'}, 'Z');

  DAT_GUI.__controllers[1].domElement.style.pointerEvents = "none";
  DAT_GUI.__controllers[2].domElement.style.pointerEvents = "none";
  DAT_GUI.__controllers[3].domElement.style.pointerEvents = "none";

  // ADJUST THE SCENE
  adjustScene(GEOMETRY.boundingBox);

  // TRANSFORMATIONS FOLDER
  loadGuiTransfms();

  // RESET TRANSFORMATIONS
  var resetData = {
    reset: function(){ resetTransfms() }
  };
  DAT_GUI.add(resetData, 'reset').name("Reset Object");

  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);

  // RECURSE THROUGH ANIMATION FRAME
  animate();
}

// calls the init function when the window is done loading.
window.onload = init;

var animate = function(){
  requestAnimationFrame(animate);
  CONTROLS.update();
  RENDERER.setViewport(0, 0, window.innerWidth, window.innerHeight);

  _3D_GRID.xAxisMat.resolution.set(window.innerWidth, window.innerHeight);
  _3D_GRID.yAxisMat.resolution.set(window.innerWidth, window.innerHeight);
  _3D_GRID.zAxisMat.resolution.set(window.innerWidth, window.innerHeight);

  _3D_GRID.xRayLineMat.resolution.set(window.innerWidth, window.innerHeight);
  _3D_GRID.yRayLineMat.resolution.set(window.innerWidth, window.innerHeight);
  _3D_GRID.zRayLineMat.resolution.set(window.innerWidth, window.innerHeight);

  updateRayCaster();
  RENDERER.render(SCENE, CAMERA);
  RENDERER.clearDepth();
};

function onWindowResize(){
  CAMERA.aspect = window.innerWidth / window.innerHeight;
  CAMERA.updateProjectionMatrix();

  RENDERER.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove(event){
  event.preventDefault();

  MOUSE.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  MOUSE.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function updateRayCaster(){
  RAYCASTER.setFromCamera(MOUSE, CAMERA);

  var intersects = RAYCASTER.intersectObjects(INTERSECT_OBJS, true);

  if(intersects.length > 0){
    var intersect_pt = intersects[ 0 ].point;

    var xRayLineGeo = _3D_GRID.xRayLine.geometry;
    var yRayLineGeo = _3D_GRID.yRayLine.geometry;
    var zRayLineGeo = _3D_GRID.zRayLine.geometry;

    var xOrigin = _3D_GRID.origin.x;
    var yOrigin = _3D_GRID.origin.y;
    var zOrigin = _3D_GRID.origin.z;

    xRayLineGeo.setPositions([ xOrigin, intersect_pt.y, intersect_pt.z,
                               intersect_pt.x, intersect_pt.y, intersect_pt.z ]);

    yRayLineGeo.setPositions([ intersect_pt.x, yOrigin, intersect_pt.z,
                               intersect_pt.x, intersect_pt.y, intersect_pt.z ]);

    zRayLineGeo.setPositions([ intersect_pt.x, intersect_pt.y, zOrigin,
                               intersect_pt.x, intersect_pt.y, intersect_pt.z ]);

    _3D_GRID.xRayLine.computeLineDistances();
    _3D_GRID.yRayLine.computeLineDistances();
    _3D_GRID.zRayLine.computeLineDistances();

    _3D_GRID.xRayLine.scale.set(1, 1, 1);
    _3D_GRID.yRayLine.scale.set(1, 1, 1);
    _3D_GRID.zRayLine.scale.set(1, 1, 1);

    _3D_GRID.xRayLine.visible = true;
    _3D_GRID.yRayLine.visible = true;
    _3D_GRID.zRayLine.visible = true;

    DAT_GUI.__controllers[1].setValue(intersect_pt.x.toString());
    DAT_GUI.__controllers[2].setValue(intersect_pt.y.toString());
    DAT_GUI.__controllers[3].setValue(intersect_pt.z.toString());
  }
  else{
    _3D_GRID.xRayLine.visible = false;
    _3D_GRID.yRayLine.visible = false;
    _3D_GRID.zRayLine.visible = false;

    DAT_GUI.__controllers[1].setValue('0.0');
    DAT_GUI.__controllers[2].setValue('0.0');
    DAT_GUI.__controllers[3].setValue('0.0');
  }
}



/**
 * Reads the file in fileInput.files[0]. Files supported in this current version are
 * obj, stl, and "zip" (obj + mtl) files.
 */
function readByFileType(){
  var filename = (fileInput.files[0]).name;
  var reader = new FileReader();

  reader.addEventListener('progress', function(event){
   var size = '(' + Math.floor(event.total / 1000) + ' KB)';
   var progress = Math.floor( ( event.loaded / event.total ) * 100 );
   console.log("Loading " + filename + "..." + progress.toString() + "%", size);
  });

  var file_exten = filename.split('.').pop().toLowerCase();

  switch(file_exten){
    case 'obj':
      var dateBefore = new Date();
      reader.addEventListener('load', function(event){
        var dateAfter = new Date();
        console.log(filename, "loaded in", (dateAfter - dateBefore), "ms");

        removeCurrentObject();

        var contents = event.target.result;
        GEOMETRY = new THREE.OBJLoader().parse(contents);
        GEOMETRY.sourceType = "obj";
        GEOMETRY.sourceFile = filename;

        GEOMETRY.boundingBox = new THREE.Box3();
        GEOMETRY.boundingBox.setFromObject(GEOMETRY);
        adjustCoordSys(GEOMETRY.boundingBox);

        var material = new THREE.MeshStandardMaterial();
        MESH = new THREE.Mesh(GEOMETRY, material);

        filename = filename.replace(/[^\w\s]/g, '');
        GEOMETRY.name = filename;
        MESH.name = filename.concat("mesh");

        INTERSECT_OBJS.push(GEOMETRY);
        SCENE.add(GEOMETRY);

        adjustScene(GEOMETRY.boundingBox);
        removeLoadScreen();
      });
      reader.readAsText(fileInput.files[0]);
      break;

    case 'stl':
      var dateBefore = new Date();
      reader.addEventListener('load', function(event){
        var dateAfter = new Date();
        console.log(filename, "loaded in", (dateAfter - dateBefore), "ms");

        removeCurrentObject();

        var contents = event.target.result;

        GEOMETRY = new THREE.STLLoader().parse(contents);
        GEOMETRY.sourceType = "stl";
        GEOMETRY.sourceFile = filename;

        GEOMETRY.boundingBox = new THREE.Box3();
        GEOMETRY.boundingBox.setFromObject(GEOMETRY);
        adjustCoordSys(GEOMETRY.boundingBox);

        var material = new THREE.MeshStandardMaterial();
        MESH = new THREE.Mesh(geometry, material);

        filename = filename.replace(/[^\w\s]/g, '');
        GEOMETRY = geometry;
        GEOMETRY.name = filename;
        MESH.name = filename.concat("mesh");

        INTERSECT_OBJS.push(MESH);
        SCENE.add(MESH);

        adjustScene(GEOMETRY.boundingBox);
        removeLoadScreen();
      }, false);

      if(reader.readAsBinaryString !== undefined){
        reader.readAsBinaryString(fileInput.files[0]);
      }
      else{
        reader.readAsArrayBuffer(fileInput.files[0]);
      }
     break;

    case 'zip':
      reader.addEventListener('load', function(event){
       var dateBefore = new Date();

       JSZip.loadAsync(fileInput.files[0]).then(function(zip){
         var dateAfter = new Date();
         var objFile = '', mtlFile = '';

         console.log("Loaded " + filename + " in " + (dateAfter - dateBefore) + "ms");
         zip.forEach(function(relativePath, zipEntry){
           var currExt = zipEntry.name.split('.').pop().toLowerCase();
           if(zipEntry.name.indexOf("__MACOSX") == -1){
             if(currExt == 'obj'){
               objFile = zipEntry.name;
             }
             else if(currExt == 'mtl'){
               mtlFile = zipEntry.name;
             }
           }
         });
         if(objFile != '' && mtlFile != ''){
           let mtl = zip.file(mtlFile).async("text");
           let obj = zip.file(objFile).async("text");

           return Promise.resolve([mtl, obj, objFile]);
         }
         else{
           console.log("Error, did not find obj and mtl file within the zip file.");
           removeLoadScreen();
         }
       }, function(e){
           console.log("Error reading " + ev.target.files[0].name + ": " + e.message);
         }).then(async function([mtl, obj, objFile]){
           var resMtl = await mtl;
           var resObj = await obj;

           removeCurrentObject();

           var mtlLoader = new THREE.MTLLoader();
           var materials = mtlLoader.parse(resMtl);
           var objLoader = new THREE.OBJLoader();

           GEOMETRY = objLoader.setMaterials(materials).parse(resObj);
           GEOMETRY.sourceType = "zip";
           GEOMETRY.sourceObjFile = objFile;

           MESH = new THREE.Mesh(GEOMETRY, materials);

           objFile = objFile.replace(/[^\w\s]/g, '');
           GEOMETRY.name = objFile;
           MESH.name = objFile.concat("mesh");

           INTERSECT_OBJS.push(GEOMETRY);
           SCENE.add(GEOMETRY);

           GEOMETRY.boundingBox = new THREE.Box3();
           GEOMETRY.boundingBox.setFromObject(GEOMETRY);

           adjustCoordSys(GEOMETRY.boundingBox);
           adjustScene(GEOMETRY.boundingBox);

           setTimeout(removeLoadScreen, 1500);
         });
      });
      reader.readAsBinaryString(fileInput.files[0]);
      break;

    default:
     console.log('Error, select an obj, stl, or zip (obj + mtl) file.');
     removeLoadScreen();
     break;
  }
}

/**
* Checks the type of the current object being displayed and removes it from the SCENE.
*/
function removeCurrentObject(){
  var selectedObject;
  var name = MESH.name;

  if(name == "cube1mesh" || name == "teapot1mesh" ||
     name == "sphere1mesh" || name == "cylinder1mesh")
    selectedObject = SCENE.getObjectByName(MESH.name);
  else
    selectedObject = SCENE.getObjectByName(GEOMETRY.name);

  SCENE.remove(selectedObject);
  animate();

  INTERSECT_OBJS = [];
  TRANSFM_ARR = [];
  GEOMETRY = null;
  MESH = null;
}

/**
* Displays the loading screen.
*/
function displayLoadScreen(){
  document.getElementById("content").innerHTML =
  '<object id="loadScreen" type="text/html" data="loading_screen/index.html"></object>';
  document.getElementById('loadScreen').setAttribute("height", window.innerHeight);
  document.getElementById('loadScreen').setAttribute("width", window.innerWidth);
}

/**
* Removes the loading screen.
*/
function removeLoadScreen(){
  var loadScreen = document.getElementById('loadScreen');
  if(loadScreen !== null)
    loadScreen.parentNode.removeChild(loadScreen);
}

/**
* Loads the different transformation options.
*
* @param {dat.GUI}
*/
function loadGuiTransfms(){
  // TRANSLATE
  var transmFldr =  DAT_GUI.addFolder('Transformation');
  var translateFldr = transmFldr.addFolder('Translate');
  var translateData = function(){
    this.x = 0;
    this.y = 0;
    this.z = 0;
  };
  var transData = new translateData();
  var xTrans = translateFldr.add(transData, 'x');
  xTrans.onFinishChange(function(value){ handleTransfm(value, 'translate', 'x'); });
  var yTrans = translateFldr.add(transData, 'y');
  yTrans.onFinishChange(function(value){ handleTransfm(value, 'translate', 'y'); });
  var zTrans = translateFldr.add(transData, 'z');
  zTrans.onFinishChange(function(value){ handleTransfm(value, 'translate', 'z'); });

  // SCALE
  var scaleFldr = transmFldr.addFolder('Scale');
  var scaleData = function(){
    this.x = 0;
    this.y = 0;
    this.z = 0;
  };
  var scleData = new scaleData();
  var xScale = scaleFldr.add(scleData, 'x');
  xScale.onFinishChange(function(value){ handleTransfm(value, 'scale', 'x'); });
  var yScale = scaleFldr.add(scleData, 'y');
  yScale.onFinishChange(function(value){ handleTransfm(value, 'scale', 'y'); });
  var zScale = scaleFldr.add(scleData, 'z');
  zScale.onFinishChange(function(value){ handleTransfm(value, 'scale', 'z'); });

  // SHEAR
  var shearFldr = transmFldr.addFolder('Shear');
  var shearData = function(){
    this.x = 0;
    this.y = 0;
    this.z = 0;
  };
  var shrData = new shearData();
  var xShear = shearFldr.add(shrData, 'x');
  xShear.onFinishChange(function(value){ handleTransfm(value, 'shear', 'x'); });
  var yShear = shearFldr.add(shrData, 'y');
  yShear.onFinishChange(function(value){ handleTransfm(value, 'shear', 'y'); });
  var zShear = shearFldr.add(shrData, 'z');
  zShear.onFinishChange(function(value){ handleTransfm(value, 'shear', 'z'); });

  // ROTATION
  var rotatFldr = transmFldr.addFolder('Rotation');
  var rotatData = function(){
    this.x = 0;
    this.y = 0;
    this.z = 0;
  };
  var rotData = new rotatData();
  var xRot = rotatFldr.add(rotData, 'x');
  xRot.onFinishChange(function(value){ handleTransfm(value, 'rotation', 'x'); });
  var yRot = rotatFldr.add(rotData, 'y');
  yRot.onFinishChange(function(value){ handleTransfm(value, 'rotation', 'y'); });
  var zRot = rotatFldr.add(rotData, 'z');
  zRot.onFinishChange(function(value){ handleTransfm(value, 'rotation', 'z'); });
}

/**
* Resets all the transformations that were applied to the current GEOMETRY being displayed.
*/
function resetTransfms(){
  var resMat = new THREE.Matrix4().identity();
  for(var i = 0; i < TRANSFM_ARR.length; i++){
    var temp = new THREE.Matrix4();
    var invMat = temp.getInverse(TRANSFM_ARR[i]);
    resMat.multiply(invMat);
  }
  MESH.geometry.applyMatrix(resMat);
  MESH.geometry.verticesNeedUpdate = true;

  adjustScene(GEOMETRY.boundingBox);
  TRANSFM_ARR = [];
}

/**
* Applies a transformation to the current GEOMETRY on screen.
*
* @param {number} - The number that sets the value of the transformation.
* @param {string} - Specifies the transformation type.
* @param {string} - Specifies which direction to apply the transformation.
*/
function handleTransfm(num, transformType, dir){

 if(num == 0){
   return;
 }
 else if((transformType == 'translate' || transformType == 'scale' || transformType == 'shear') && num > 250){
   console.log("Error, can not apply a " + transformType + " transformation larger than 250 units.");
   return;
 }
 else{
   var strNum = num.toString();
   switch(transformType){
     case 'translate':
       var transMat;
       switch(dir){
         case 'x':
           transMat = new THREE.Matrix4().makeTranslation(num, 0, 0);
           console.log("Translated in the x direction by " + strNum + " units.");
           break;

         case 'y':
           transMat = new THREE.Matrix4().makeTranslation(0, num, 0);
           console.log("Translated in the y direction by " + strNum + " units.");
           break;

         case 'z':
           transMat = new THREE.Matrix4().makeTranslation(0, 0, num);
           console.log("Translated in the z direction by " + strNum + " units.");
           break;

         default:
           break;
       }
       TRANSFM_ARR.push(transMat);
       MESH.geometry.applyMatrix(transMat);
       MESH.geometry.verticesNeedUpdate = true;
       break;

     case 'scale':
       var scaleMat;
       switch(dir){
         case 'x':
           scaleMat = new THREE.Matrix4().makeScale(num, 1, 1);
           console.log("Scaled in the x direction by " + strNum + " units.");
           break;

         case 'y':
           scaleMat = new THREE.Matrix4().makeScale(1, num, 1);
           console.log("Scaled in the y direction by " + strNum + " units.");
           break;

         case 'z':
           scaleMat = new THREE.Matrix4().makeScale(1, 1, num);
           console.log("Scaled in the z direction by " + strNum + " units.");
           break;

         default:
           break;
       }
       TRANSFM_ARR.push(scaleMat);
       MESH.geometry.applyMatrix(scaleMat);
       MESH.geometry.verticesNeedUpdate = true;
       break;

     case 'shear':
       var shearMat;
       if(fileInput.files[0] != null){
         console.log("Due to a bug, shear is disabled in file mode, sorry!");
       }
       else{
         switch(dir){
           case 'x':
             shearMat = new THREE.Matrix4().makeShear(num, 0, 0);
             console.log("Sheared in the x direction by " + strNum + " units.");
             break;

           case 'y':
             shearMat = new THREE.Matrix4().makeShear(0, num, 0);
             console.log("Sheared in the y direction by " + strNum + " units.");
             break;

           case 'z':
             shearMat = new THREE.Matrix4().makeShear(0, 0, num);
             console.log("Sheared in the z direction by " + strNum + " units.");
             break;

           default:
             break;
         }
         TRANSFM_ARR.push(shearMat);
         MESH.geometry.applyMatrix(shearMat);
         MESH.geometry.verticesNeedUpdate = true;
       }
       break;

     case 'rotation':
       var rotMat;
       var rad = num * (Math.PI/180);
       switch(dir){
         case 'x':
           rotMat = new THREE.Matrix4().makeRotationX(rad);
           console.log("Rotated in the x direction by " + strNum + " degrees.");
           break;

         case 'y':
           rotMat = new THREE.Matrix4().makeRotationY(rad);
           console.log("Rotated in the y direction by " + strNum + " degrees.");
           break;

         case 'z':
           rotMat = new THREE.Matrix4().makeRotationZ(rad);
           console.log("Rotated in the z direction by " + strNum + " degrees.");
           break;

         default:
           break;
       }
       TRANSFM_ARR.push(rotMat);
       MESH.geometry.applyMatrix(rotMat);
       MESH.geometry.verticesNeedUpdate = true;
       break;

     default:
       break;
   }
 }

}

/**
* Changes the type of GEOMETRY that is being displayed.
*
* @param {string} - The GEOMETRY type to display.
*/
function handleObjectType(objType){

  switch(objType){
    case 'Cube':
    case 'Teapot':
    case 'Sphere':
    case 'Cylinder':
      removeCurrentObject();

      switch(objType){
        case 'Cube':
          GEOMETRY = MAT3D_CUBE.geometry;
          MESH = MAT3D_CUBE.mesh;
          break;
        case 'Teapot':
          GEOMETRY = MAT3D_TEAPOT.geometry;
          MESH = MAT3D_TEAPOT.mesh;
          break;
        case 'Sphere':
          GEOMETRY = MAT3D_SPHERE.geometry;
          MESH = MAT3D_SPHERE.mesh;
          break;
        case 'Cylinder':
          GEOMETRY = MAT3D_CYLINDER.geometry;
          MESH = MAT3D_CYLINDER.mesh;
          break;
      }

      if(_3D_GRID.origin.x != 0 && _3D_GRID.origin.y != 0 &&
         _3D_GRID.origin.z != 0)
        adjustCoordSys(GEOMETRY.boundingBox);

      adjustScene(GEOMETRY.boundingBox);

      INTERSECT_OBJS.push(MESH);
      SCENE.add(MESH);
      break;

    case 'File':
      document.getElementById('fileInput').click();
      fileInput.type = 'file';
      fileInput.addEventListener('change', function(){
        displayLoadScreen();
        setTimeout(readByFileType, 500);
      }, false);
      break;

    default:
      break;
  }
}

/**
* Checks geometry dimensions and adjusts the coordinate system (if need be)
*
* @param {THREE.Box3} - The bounding box
*/
function adjustCoordSys(boundingBox, centered){
  var xOrigin = _3D_GRID.origin.x;
  var yOrigin = _3D_GRID.origin.y;
  var zOrigin = _3D_GRID.origin.z;

  // check if bounding box goes beyond the current origin
  if(boundingBox.min.x != _3D_GRID.origin.x)
    xOrigin = boundingBox.min.x;
  if(boundingBox.min.y != _3D_GRID.origin.y)
    yOrigin = boundingBox.min.y;
  if(boundingBox.min.z != _3D_GRID.origin.z)
    zOrigin = boundingBox.min.z;

  /**
   * Check if after moving origin, bounding box goes beyond a coordinate grid
   * or is way smaller than a grid
   */
  var scale;
  var step = _3D_GRID.step;
  var stepSubDivisions = _3D_GRID.stepSubDivisions;
  if((boundingBox.max.x > ((xOrigin + _3D_GRID.xzWidth) ||
                           (xOrigin + _3D_GRID.xzLength))) ||
     (boundingBox.max.y > ((yOrigin + _3D_GRID.xyWidth) ||
                           (yOrigin + _3D_GRID.xyLength))) ||
     (boundingBox.max.z > ((zOrigin + _3D_GRID.yzWidth) ||
                           (zOrigin + _3D_GRID.yzLength))) ||
     (Math.abs(boundingBox.max.x) + Math.abs(boundingBox.min.x)) <= _3D_GRID.step/5 ||
     (Math.abs(boundingBox.max.y) + Math.abs(boundingBox.min.y)) <= _3D_GRID.step/5 ||
     (Math.abs(boundingBox.max.z) + Math.abs(boundingBox.min.z)) <= _3D_GRID.step/5){

    var max = Math.max(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z);
    var min = Math.min(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z);
    var scale_amt = Math.abs((max + Math.abs(min)) * 5);

    scale = scale_amt;
    step = scale_amt;
    stepSubDivisions = Math.floor((2 * scale_amt) / (max + Math.abs(min)));
  }


  if(xOrigin != _3D_GRID.origin.x ||
     yOrigin != _3D_GRID.origin.y ||
     zOrigin != _3D_GRID.origin.z){

    if(scale !== undefined){
      _3D_GRID.setOriginAndResizeAll({
        origin:{
          x: xOrigin - (scale/2) + ((Math.abs(boundingBox.max.x) +
                                     Math.abs(boundingBox.min.x))/2),
          y: yOrigin,
          z: zOrigin - (scale/2) + ((Math.abs(boundingBox.max.z) +
                                     Math.abs(boundingBox.min.z))/2)
        },
        xzWidth: scale,
        xyWidth: scale,
        yzWidth: scale,
        xzLength: scale,
        xyLength: scale,
        yzLength: scale,
        step: step,
        stepSubDivisions: stepSubDivisions
      });
    }
    else{
      _3D_GRID.setOrigin({
        x: xOrigin,
        y: yOrigin,
        z: zOrigin
      });
    }
  }
  else if(scale !== undefined){
    _3D_GRID.setOriginAndResizeAll({
      origin:{
        x: _3D_GRID.origin.x,
        y: _3D_GRID.origin.y,
        z: _3D_GRID.origin.z
      },
      xzWidth: scale,
      xyWidth: scale,
      yzWidth: scale,
      xzLength: scale,
      xyLength: scale,
      yzLength: scale,
      step: step,
      stepSubDivisions: stepSubDivisions
    });
  }
}

/**
* Adjusts the CAMERA and resets the CONTROLS and gui coordinates.
*
* @param {THREE.Box3}
*/
function adjustScene(boundingBox){
  CONTROLS.reset();
  DAT_GUI.__controllers[1].setValue('0.0');
  DAT_GUI.__controllers[2].setValue('0.0');
  DAT_GUI.__controllers[3].setValue('0.0');

  var max = Math.max(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z);
  var min = Math.min(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z);

  var amt = (max + Math.abs(min)) * 2;
  CAMERA.position.x = amt;
  CAMERA.position.y = amt;
  CAMERA.position.z = amt;
}
