/**
 * @author Abraham Cardenas / https://github.com/Abe-Crdns (acarde12@ucsc.edu)
 */

 /**
  * Reads the file within fileInput.files[0]. Files supported in this current version are obj, stl, and zip files.
  */
function readFileByType(){
  var filename = (fileInput.files[0]).name;
  var reader = new FileReader();

  reader.addEventListener('progress', function(event){
    var size = '(' + Math.floor(event.total / 1000) + ' KB)';
    var progress = Math.floor( ( event.loaded / event.total ) * 100 );
    console.log("Loading " + filename + "..." + progress.toString() + "%", size);
  });

  // previous values in case invalid file
  var prevObj = object;
  var prevObjMesh = objMesh;
  var prevTransfArr = transformArr;

  removeObjByType();

  var fileExt = filename.split('.').pop().toLowerCase();

  switch(fileExt){
    case 'obj':
      var dateBefore = new Date();
      reader.addEventListener('load', function(event){
        var dateAfter = new Date();
        console.log(filename, "loaded in", (dateAfter - dateBefore), "ms");

        var contents = event.target.result;
        object = new THREE.OBJLoader().parse(contents);
        object.name = filename;
        var material = new THREE.MeshStandardMaterial();
        objMesh = new THREE.Mesh(object, material);

        scene.add(object);
        adjustObjAndCam(object, objMesh);
        removeLoadScreen();
      });
      reader.readAsText(fileInput.files[0]);
      break;

    case 'stl':
      var dateBefore = new Date();
      reader.addEventListener('load', function(event){
        var dateAfter = new Date();
        console.log(filename, "loaded in", (dateAfter - dateBefore), "ms");

        var contents = event.target.result;

        var geometry = new THREE.STLLoader().parse(contents);
        object = geometry;
        object.name = filename;
        geometry.sourceType = "stl";
        geometry.sourceFile = fileInput.files[0].name;

        var material = new THREE.MeshStandardMaterial();
        objMesh = new THREE.Mesh(geometry, material);
        objMesh.name = filename;

        scene.add(objMesh);
        adjustObjAndCam(objMesh, objMesh);
        removeLoadScreen();
        console.log();
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

        JSZip.loadAsync(fileInput.files[0])
        .then(function(zip){
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
            object = prevObj;
            objMesh = prevObjMesh;

            var objName = object.name;
            if(objName != 'cube1' && objName != 'teapot1' && objName != 'sphere1' && objName != 'cylinder1' && fileExt != 'stl'){
              scene.add(object);
            }
            else{
              scene.add(objMesh);
            }
            removeLoadScreen();
          }
        }, function(e){
            console.log("Error reading " + ev.target.files[0].name + ": " + e.message);
        }).then(async function([mtl, obj, objFile]){
          var resMtl = await mtl;
          var resObj = await obj;

          var mtlLoader = new THREE.MTLLoader();
          var materials = mtlLoader.parse(resMtl);
          var objLoader = new THREE.OBJLoader();
          object = objLoader.setMaterials(materials).parse(resObj);
          objMesh = new THREE.Mesh(object, materials);
          object.name = objFile;
          scene.add(object);

          adjustObjAndCam(object, objMesh);
          setTimeout(removeLoadScreen, 1500);
        });
      });
      reader.readAsBinaryString(fileInput.files[0]);
      break;

    default:
      console.log('Error, select an obj, stl, or zip file.');
      object = prevObj;
      objMesh = prevObjMesh;
      transformArr = prevTransfArr;

      var objName = object.name;
      if(objName != 'cube1' && objName != 'teapot1' && objName != 'sphere1' && objName != 'cylinder1' && fileExt != 'stl'){
        scene.add(object);
      }
      else{
        scene.add(objMesh);
      }
      removeLoadScreen();
      break;
  }
}

/**
 * Adjusts the current object and its mesh and resets the controls and camera.
 *
 * @param {THREE.BufferGeometry}
 * @param {THREE.Mesh}
 */
function adjustObjAndCam(object, objMesh){
  var objBox = new THREE.Box3();
  objBox.setFromObject(object);

  var objHeight = objBox.max.y - objBox.min.y;
  var objWidth = objBox.max.x - objBox.min.x;
  var objDepth = objBox.max.z - objBox.min.z;

  if(objHeight > 30 || objWidth > 30 || objDepth > 30){
    var maxVal = Math.max(objHeight, objWidth, objDepth);
    var scaleMatrix = new THREE.Matrix4();
    scaleMatrix.set(
            10/maxVal, 0, 0, 0,
            0, 10/maxVal, 0, 0,
            0, 0, 10/maxVal, 0,
            0, 0, 0, 1
    );
    objMesh.geometry.applyMatrix(scaleMatrix);
    objMesh.geometry.verticesNeedUpdate = true;

    objBox = new THREE.Box3();
    objBox.setFromObject(object);
  }
  controls.reset();
  object.position.x = 0;
  object.position.y = 0;
  object.position.z = 0;
  camera.position.x = 15;
  camera.position.y = 15;
  camera.position.z = 15;
}

/**
 * Removes an entity from the scene.
 *
 * @param {THREE.BufferGeometry}
 * @param {THREE.Scene}
 */
function removeEntity(object, scene){
  var selectedObject = scene.getObjectByName(object.name);
  scene.remove(selectedObject);
  animate();
}

/**
 * Checks the type of the current "object" being displayed and removes it from the scene.
 */
function removeObjByType(){
  // delete displayed object
  var objName = object.name;
  var objExt = objName.split('.').pop().toLowerCase();
  if(objExt != 'stl' && objName != 'cube1' && objName != 'teapot1' && objName != 'sphere1' && objName != 'cylinder1'){
    removeEntity(object, scene);
  }
  else{
    removeEntity(objMesh, scene);
  }
  transformArr = [];
  console.clear();
  object = null; objMesh = null;
}

/**
 * Displays the loading screen.
 */
function displayLoadScreen(){
  document.getElementById("content").innerHTML =
  '<object id="loadScreen" type="text/html" data="loadingScreen/index.html"></object>';
  document.getElementById('loadScreen').setAttribute("height", window.innerHeight);
  document.getElementById('loadScreen').setAttribute("width", window.innerWidth);
}

/**
 * Removes the loading screen.
 */
function removeLoadScreen(){
  var loadScreen = document.getElementById('loadScreen');
  loadScreen.parentNode.removeChild(loadScreen);
}

/**
 * Loads the different transformation options.
 *
 * @param {dat.GUI}
 */
function loadGuiTransfms(gui){
  var transformFldr = gui.addFolder('Transformations');

  // TRANSLATE
  var translateFldr = transformFldr.addFolder('Translate');
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
  var scaleFldr = transformFldr.addFolder('Scale');
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
  var shearFldr = transformFldr.addFolder('Shear');
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
  var rotatFldr = transformFldr.addFolder('Rotation');
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
 * Resets all the transformations that were applied to the current object being displayed.
 */
function resetTransfms(){
  var resMat = new THREE.Matrix4().identity();
  for(var i = 0; i < transformArr.length; i++){
    var temp = new THREE.Matrix4();
    var invMat = temp.getInverse(transformArr[i]);
    resMat.multiply(invMat);
  }
  objMesh.geometry.applyMatrix(resMat);
  objMesh.geometry.verticesNeedUpdate = true;
  controls.reset();
  camera.position.x = 15;
  camera.position.y = 15;
  camera.position.z = 15;

  transformArr = [];
  console.clear();
}

/**
 * Applies a transformation to the current object on screen.
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
            console.log("?_? ._.");
            break;
        }
        transformArr.push(transMat);
        objMesh.geometry.applyMatrix(transMat);
        objMesh.geometry.verticesNeedUpdate = true;
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
            console.log("?_? ._.");
            break;
        }
        transformArr.push(scaleMat);
        objMesh.geometry.applyMatrix(scaleMat);
        objMesh.geometry.verticesNeedUpdate = true;
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
              console.log("?_? ._.");
              break;
          }
          transformArr.push(shearMat);
          objMesh.geometry.applyMatrix(shearMat);
          objMesh.geometry.verticesNeedUpdate = true;
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
            console.log("?_? ._.");
            break;
        }
        transformArr.push(rotMat);
        objMesh.geometry.applyMatrix(rotMat);
        objMesh.geometry.verticesNeedUpdate = true;
        break;

      default:
        console.log("?_?");
        break;
    }
  }

}

/**
 * Changes the type of object that is being displayed.
 *
 * @param {string} - The object type to display.
 */
function handleObjectType(objType){
  switch(objType){
    case 'Cube':
      // delete displayed object
      removeObjByType();

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
      break;

    case 'Teapot':
      // delete displayed object
      removeObjByType();

      object = new THREE.TeapotBufferGeometry(1);
      object.name = 'teapot1';
      var material = new THREE.MeshStandardMaterial();
      objMesh = new THREE.Mesh(object, material);
      objMesh.material.color.setHex(0x2194ce);
      objMesh.name = 'teapot1';
      scene.add(objMesh);

      // ADJUST THE SCENE
      controls.reset();
      objMesh.position.x = 2.5;
      objMesh.position.y = 1;
      objMesh.position.z = 1.5;
      break;

    case 'Sphere':
      // delete displayed object
      removeObjByType();

      object = new THREE.SphereGeometry(1, 32, 32);
      object.name = 'sphere1';
      var material = new THREE.MeshStandardMaterial();
      objMesh = new THREE.Mesh(object, material);
      objMesh.material.color.setHex(0x2194ce);
      objMesh.name = 'sphere1';
      scene.add(objMesh);

      // ADJUST THE SCENE
      controls.reset();
      objMesh.position.x = 1;
      objMesh.position.y = 1;
      objMesh.position.z = 1;
      break;

    case 'Cylinder':
      // delete displayed object
      removeObjByType();

      object = new THREE.CylinderGeometry(1, 1, 2, 48);
      object.name = 'cylinder1';
      var material = new THREE.MeshStandardMaterial();
      objMesh = new THREE.Mesh(object, material);
      objMesh.material.color.setHex(0x2194ce);
      objMesh.name = 'cylinder1';
      scene.add(objMesh);

      // ADJUST THE SCENE
      controls.reset();
      objMesh.position.x = 1;
      objMesh.position.y = 1;
      objMesh.position.z = 1;
      break;

    case 'File':
      document.getElementById('fileInput').click();
      fileInput.type = 'file';
      fileInput.addEventListener('change', function(){
        displayLoadScreen();
        setTimeout(readFileByType, 500);
      }, false);
      break;

    default:
      console.log("How'd you get here? HAX!");
      break;
  }
  camera.position.x = 15;
  camera.position.y = 15;
  camera.position.z = 15;
}
