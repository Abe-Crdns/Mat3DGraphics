/**
 * @author Abraham Cardenas / https://github.com/Abe-Crdns (acarde12@ucsc.edu)
 */

function readFileByType(ev){
  var filename = (fileInput.files[0]).name;
  var reader = new FileReader();

  reader.addEventListener('progress', function(event){
    var size = '(' + Math.floor(event.total / 1000) + ' KB)';
    //var progress = Math.floor( ( event.loaded / event.total ) * 100 ) + '%';
    console.log('Loading', filename, size);
  });

  var prevObj = object;
  var prevObjMesh = objMesh;

  displayLoadScreen();
  removeObjByType();

  var fileExt = filename.split('.').pop().toLowerCase();

  switch(fileExt){
    case 'obj':
      reader.addEventListener('load', function(event){
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
      reader.addEventListener('load', function(event){
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
      }, false);

      if(reader.readAsBinaryString !== undefined){
        reader.readAsBinaryString(fileInput.files[0]);
      }
      else{
        reader.readAsArrayBuffer(fileInput.files[0]);
      }
      break;
      /*
    case 'glb':
    case 'gltf':
      reader.addEventListener('load', function(event){
        var contents = event.target.result;
        var loader;

        if(isGltf1(contents)){
          loader = new THREE.LegacyGLTFLoader();
        }
        else{
          loader = new THREE.GLTFLoader();
        }

        loader.parse(contents, '', function(result){
          result.scene.name = filename;
          scene.add(result.scene);
          //editor.execute(new AddObjectCommand(result.scene));
        });

      }, false);

      reader.readAsArrayBuffer(fileInput.files[0]);
      break;

    case 'fbx':
      reader.addEventListener('load', function(event){
        var contents = event.target.result;

        var loader = new THREE.FBXLoader();
        //console.log(event.target);
        //console.log(contents);
        object = loader.parse(contents);
        //object.name = filename;
      //  scene.add(object);

        //editor.execute( new AddObjectCommand(object));

      }, false);

      reader.readAsArrayBuffer(fileInput.files[0]);
      break;
      */
    case 'zip':
      reader.addEventListener('load', function(event){
        var dateBefore = new Date();

        JSZip.loadAsync(ev.target.files[0])
        .then(function(zip){
          var dateAfter = new Date();
          var objFile = '', mtlFile = '';

          console.log("Loaded in " + (dateAfter - dateBefore) + "ms");
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
            if(object.name != 'cube1' && fileExt != 'stl'){
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
      if(object.name != 'cube1'){
        scene.add(object);
      }
      else{
        scene.add(objMesh);
      }
      removeLoadScreen();
      break;
  }
}

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

    objHeight = objBox.max.y - objBox.min.y;
    objWidth = objBox.max.x - objBox.min.x;
    objDepth = objBox.max.z - objBox.min.z;
  }
  controls.reset();
  object.position.x = 0;
  object.position.y = 0;
  object.position.z = 0;
  camera.position.x = (objHeight + objWidth + objDepth)*2;
  camera.position.y = (objHeight + objWidth + objDepth)*2;
  camera.position.z = (objHeight + objWidth + objDepth)*2;
}

function removeEntity(object, scene){
  var selectedObject = scene.getObjectByName(object.name);
  scene.remove(selectedObject);
  animate();
}

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
  object = null; objMesh = null;
}

function displayLoadScreen(){
  document.getElementById("content").innerHTML =
  '<object id="loadScreen" type="text/html" data="loadingScreen/index.html"></object>';
  document.getElementById('loadScreen').setAttribute("height", window.innerHeight-10);
  document.getElementById('loadScreen').setAttribute("width", window.innerHeight-10);
}

function removeLoadScreen(){
  var loadScreen = document.getElementById('loadScreen');
  loadScreen.parentNode.removeChild(loadScreen);
}

function setupGui(){
  var gui = new dat.GUI();
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
  var colorConvert = handleColorChange(color);
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

  var resetData = {
    reset: function(){ resetObj() }
  };
  gui.add(resetData, 'reset').name("Reset Object");

}

function loadGuiLights(gui, isAmbient, isLight1, isLight2, isLight3){
  // LIGHTS
  var lightsFldr = gui.addFolder('Lights');

  // AMBIENT
  var ambientLightFldr = lightsFldr.addFolder('Ambient Light');
  var ambientData = {
    'Ambient on?': true,
    'Color': ambientLight.color.getHex()
  };
  var ambient = ambientLightFldr.add(ambientData, 'Ambient on?').name('Ambient on?').listen();
  ambient.onChange(function(value){
    handleLightChange(value, isAmbient, ambientCol, ambientLight);
  });
  var ambientCol = ambientLightFldr.addColor(ambientData, 'Color').onChange(handleColorChange(ambientLight.color));

  // POINT LIGHT #1
  var light1Fldr = lightsFldr.addFolder('Point Light #1');
  var light1Data = {
    'Light #1 on?': true,
    'Color': ptLightArr[0].color.getHex()
  };
  var light1 = light1Fldr.add(light1Data, 'Light #1 on?').name('Light #1 on?').listen();
  light1.onChange(function(value){
    handleLightChange(value, isLight1, light1Col, ptLightArr[0], xlight1Pos, ylight1Pos, zlight1Pos);
  });
  var light1Col = light1Fldr.addColor(light1Data, 'Color').onChange(handleColorChange(ptLightArr[0].color));
  var light1PosFldr = light1Fldr.addFolder('Position');
  var light1PosData = {
    'x': xLight1,
    'y': yLight1,
    'z': zLight1
  };
  var xlight1Pos = light1PosFldr.add(light1PosData, 'x').min(-500).max(500).step(1).name('x').listen();
  xlight1Pos.onChange(function(value){ handleLightPosChange(value, 'light1', 'x') });
  var ylight1Pos = light1PosFldr.add(light1PosData, 'y').min(-500).max(500).step(1).name('y').listen();
  ylight1Pos.onChange(function(value){ handleLightPosChange(value, 'light1', 'y') });
  var zlight1Pos = light1PosFldr.add(light1PosData, 'z').min(-500).max(500).step(1).name('z').listen();
  zlight1Pos.onChange(function(value){ handleLightPosChange(value, 'light1', 'z') });

  // POINT LIGHT #2
  var light2Fldr = lightsFldr.addFolder('Point Light #2');
  var light2Data = {
    'Light #2 on?': true,
    'Color': ptLightArr[1].color.getHex()
  };
  var light2 = light2Fldr.add(light2Data, 'Light #2 on?').name('Light #2 on?').listen();
  light2.onChange(function(value){
    handleLightChange(value, isLight2, light2Col, ptLightArr[1], xlight2Pos, ylight2Pos, zlight2Pos);
  });
  var light2Col = light2Fldr.addColor(light2Data, 'Color').onChange(handleColorChange(ptLightArr[1].color));
  var light2PosFldr = light2Fldr.addFolder('Position');
  var light2PosData = {
    'x': xLight2,
    'y': yLight2,
    'z': zLight2
  };
  var xlight2Pos = light2PosFldr.add(light2PosData, 'x').min(-500).max(500).step(1).name('x').listen();
  xlight2Pos.onChange(function(value){ handleLightPosChange(value, 'light2', 'x') });
  var ylight2Pos = light2PosFldr.add(light2PosData, 'y').min(-500).max(500).step(1).name('y').listen();
  ylight2Pos.onChange(function(value){ handleLightPosChange(value, 'light2', 'y') });
  var zlight2Pos = light2PosFldr.add(light2PosData, 'z').min(-500).max(500).step(1).name('z').listen();
  zlight2Pos.onChange(function(value){ handleLightPosChange(value, 'light2', 'z') });

  // POINT LIGHT #3
  var light3Fldr = lightsFldr.addFolder('Point Light #3');
  var light3Data = {
    'Light #3 on?': true,
    'Color': ptLightArr[2].color.getHex()
  };
  var light3 = light3Fldr.add(light3Data, 'Light #3 on?').name('Light #3 on?').listen();
  light3.onChange(function(value){
    handleLightChange(value, isLight3, light3Col, ptLightArr[2], xlight3Pos, ylight3Pos, zlight3Pos);
  });
  var light3Col = light3Fldr.addColor(light3Data, 'Color').onChange(handleColorChange(ptLightArr[2].color));
  var light3PosFldr = light3Fldr.addFolder('Position');
  var light3PosData = {
    'x': xLight3,
    'y': yLight3,
    'z': zLight3
  };
  var xlight3Pos = light3PosFldr.add(light3PosData, 'x').min(-500).max(500).step(1).name('x').listen();
  xlight3Pos.onChange(function(value){ handleLightPosChange(value, 'light3', 'x') });
  var ylight3Pos = light3PosFldr.add(light3PosData, 'y').min(-500).max(500).step(1).name('y').listen();
  ylight3Pos.onChange(function(value){ handleLightPosChange(value, 'light3', 'y') });
  var zlight3Pos = light3PosFldr.add(light3PosData, 'z').min(-500).max(500).step(1).name('z').listen();
  zlight3Pos.onChange(function(value){ handleLightPosChange(value, 'light3', 'z') });
}

function loadGuiTransfms(gui){
  var transformFldr = gui.addFolder('Transformations');

  // TRANSLATE
  var translateFldr = transformFldr.addFolder('Translate');
  var translateData = function(){
    this.x = xTransVal.toString();
    this.y = yTransVal.toString();
    this.z = zTransVal.toString();
  };
  var transData = new translateData();
  var xTrans = translateFldr.add(transData, 'x');
  xTrans.onChange(function(value){ handleTransfmChange(value, 'translate', 'x'); transData.x = 0; });
  var yTrans = translateFldr.add(transData, 'y');
  yTrans.onChange(function(value){ handleTransfmChange(value, 'translate', 'y'); transData.y = 0; });
  var zTrans = translateFldr.add(transData, 'z');
  zTrans.onChange(function(value){ handleTransfmChange(value, 'translate', 'z'); transData.z = 0; });

  // SCALE
  var scaleFldr = transformFldr.addFolder('Scale');
  var scaleData = function(){
    this.x = xScaleVal.toString();
    this.y = yScaleVal.toString();
    this.z = zScaleVal.toString();
  };
  var scleData = new translateData();
  var xScale = scaleFldr.add(scleData, 'x');
  xScale.onChange(function(value){ handleTransfmChange(value, 'scale', 'x'); scleData.x = 0; });
  var yScale = scaleFldr.add(scleData, 'y');
  yScale.onChange(function(value){ handleTransfmChange(value, 'scale', 'y'); scleData.y = 0; });
  var zScale = scaleFldr.add(scleData, 'z');
  zScale.onChange(function(value){ handleTransfmChange(value, 'scale', 'z'); scleData.z = 0; });

  // SHEAR
  var shearFldr = transformFldr.addFolder('Shear');
  var shearData = function(){
    this.x = xShearVal.toString();
    this.y = yShearVal.toString();
    this.z = zShearVal.toString();
  };
  var shrData = new shearData();
  var xShear = shearFldr.add(shrData, 'x');
  xShear.onChange(function(value){ handleTransfmChange(value, 'shear', 'x'); shrData.x = 0; });
  var yShear = shearFldr.add(shrData, 'y');
  yShear.onChange(function(value){ handleTransfmChange(value, 'shear', 'y'); shrData.y = 0; });
  var zShear = shearFldr.add(shrData, 'z');
  zShear.onChange(function(value){ handleTransfmChange(value, 'shear', 'z'); shrData.z = 0; });

  // ROTATION
  var rotatFldr = transformFldr.addFolder('Rotation');
  var rotatData = function(){
    this.x = xRotVal.toString();
    this.y = yRotVal.toString();
    this.z = zRotVal.toString();
  };
  var rotData = new rotatData();
  var xRot = rotatFldr.add(rotData, 'x');
  xRot.onChange(function(value){ handleTransfmChange(value, 'rotation', 'x'); rotData.x = 0; });
  var yRot = rotatFldr.add(rotData, 'y');
  yRot.onChange(function(value){ handleTransfmChange(value, 'rotation', 'y'); rotData.y = 0; });
  var zRot = rotatFldr.add(rotData, 'z');
  zRot.onChange(function(value){ handleTransfmChange(value, 'rotation', 'z'); rotData.z = 0; });
}

function loadGuiCoordSys(gui){
  var coordFldr = gui.addFolder('Coordinate Planes');
  var xyFldr = coordFldr.addFolder('XY Plane');
  var opacityXYVal = 0.4;
  var xyData = {
    'Color': GridXYCol.getHex(),
    'opacity': opacityXYVal,
    'size': GridSizes
  };
  var xyCol = xyFldr.addColor(xyData, 'Color').onChange(function(value){ handleGridColor(value, GridXYCol, GridXY1, GridXY2) });
  var xyOpacity = xyFldr.add(xyData, 'opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
  xyOpacity.onChange(function(value){ handleGridOpacity(value, GridXY1, GridXY2) });
  var xySize = xyFldr.add(xyData, 'size' ).min(20).max(500).step(5).name('Size').listen();
  xySize.onChange(function(value){ GridXY1.resize(value, value); GridXY2.resize(value, value); });

  var xzFldr = coordFldr.addFolder('XZ Plane');
  var opacityXZVal = 0.4;
  var xzData = {
    'Color': GridXZCol.getHex(),
    'Opacity': opacityXZVal,
    'Size': GridSizes
  };
  var xzCol = xzFldr.addColor(xzData, 'Color').onChange(function(value){ handleGridColor(value, GridXZCol, GridXZ1, GridXZ2) });
  var xzOpacity = xzFldr.add(xzData, 'Opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
  xzOpacity.onChange(function(value){ handleGridOpacity(value, GridXZ1, GridXZ2) });
  var xzSize = xzFldr.add(xzData, 'Size' ).min(20).max(500).step(5).name('Size').listen();
  xzSize.onChange(function(value){ GridXZ1.resize(value, value); GridXZ2.resize(value, value); });

  var yzFldr = coordFldr.addFolder('YZ Plane');
  var opacityYZVal = 0.4;
  var yzData = {
    'Color': GridYZCol.getHex(),
    'Opacity': opacityYZVal,
    'Size': GridSizes
  };
  var yzCol = yzFldr.addColor(yzData, 'Color').onChange(function(value){ handleGridColor(value, GridYZCol, GridYZ1, GridYZ2) });
  var yzOpacity = yzFldr.add(yzData, 'Opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
  yzOpacity.onChange(function(value){ handleGridOpacity(value, GridYZ1, GridYZ2) });
  var yzSize = yzFldr.add(yzData, 'Size' ).min(20).max(500).step(5).name('Size').listen();
  yzSize.onChange(function(value){ GridYZ1.resize(value, value); GridYZ2.resize(value, value); });
}

function resetObj(){
  var resMat = new THREE.Matrix4().identity();
  for(var i = 0; i < transformArr.length; i++){
    var temp = new THREE.Matrix4();
    var invMat = temp.getInverse(transformArr[i]);
    resMat.multiply(invMat);//objMesh.geometry.applyMatrix(invMat);
    //objMesh.geometry.verticesNeedUpdate = true;
  }
  objMesh.geometry.applyMatrix(resMat);
  objMesh.geometry.verticesNeedUpdate = true;
  transformArr = [];
  console.clear();
  xTransVal = 0; yTransVal = 0; zTransVal = 0;
  xScaleVal = 0; yScaleVal = 0; zScaleVal = 0;
  xShearVal = 0; yShearVal = 0; zShearVal = 0;
}

function handleLightPosChange(value, lightType, dir){
  switch(lightType){
    case 'light1':
      switch(dir){
        case 'x':
          xLight1 = value;
          ptLightArr[0].position.set(xLight1, yLight1, zLight1);
          break;

        case 'y':
          yLight1 = value;
          ptLightArr[0].position.set(xLight1, yLight1, zLight1);
          break;

        case 'z':
          zLight1 = value;
          ptLightArr[0].position.set(xLight1, yLight1, zLight1);
          break;

        default:
          break;
      }
      break;

    case 'light2':
      switch(dir){
        case 'x':
          xLight2 = value;
          ptLightArr[1].position.set(xLight2, yLight2, zLight2);
          break;

        case 'y':
          yLight2 = value;
          ptLightArr[1].position.set(xLight2, yLight2, zLight2);
          break;

        case 'z':
          zLight2 = value;
          ptLightArr[1].position.set(xLight2, yLight2, zLight2);
          break;

        default:
          break;
      }
      break;

    case 'light3':
      switch(dir){
        case 'x':
          xLight3 = value;
          ptLightArr[2].position.set(xLight3, yLight3, zLight3);
          break;

        case 'y':
          yLight3 = value;
          ptLightArr[2].position.set(xLight3, yLight3, zLight3);
          break;

        case 'z':
          zLight3 = value;
          ptLightArr[2].position.set(xLight3, yLight3, zLight3);
          break;

        default:
          break;
      }
      break;

    default:
      break;
  }
}

function handleTransfmChange(value, transformType, dir){
  var num = stringToNum(value);
  if(num != null){
    if(num == 0){
      return;
    }
    else{
      switch(transformType){
        case 'translate':
          var transMat;
          switch(dir){
            case 'x':
              if(xTransVal != num){
                xTransVal = num;
                transMat = new THREE.Matrix4().makeTranslation(xTransVal, 0, 0);
                console.log("Translated in the x direction by", xTransVal, "units.");
              }
              break;

            case 'y':
              if(yTransVal != num){
                yTransVal = num;
                transMat = new THREE.Matrix4().makeTranslation(0, yTransVal, 0);
                console.log("Translated in the y direction by", yTransVal, "units.");
              }
              break;

            case 'z':
              if(zTransVal != num){
                zTransVal = num;
                transMat = new THREE.Matrix4().makeTranslation(0, 0, zTransVal);
                console.log("Translated in the z direction by", zTransVal, "units.");
              }
              break;

            default:
              console.log("?_? ._.");
              break;
          }
          if(transMat != null){
            transformArr.push(transMat);
            objMesh.geometry.applyMatrix(transMat);
            objMesh.geometry.verticesNeedUpdate = true;
          }
          break;

        case 'scale':
          var scaleMat;
          switch(dir){
            case 'x':
              if(xScaleVal != num){
                xScaleVal = num;
                scaleMat = new THREE.Matrix4().makeScale(xScaleVal, 1, 1);
                console.log("Scaled in the x direction by", xScaleVal, "units.");
              }
              break;

            case 'y':
              if(yScaleVal != num){
                yScaleVal = num;
                scaleMat = new THREE.Matrix4().makeScale(1, yScaleVal, 1);
                console.log("Scaled in the y direction by", yScaleVal, "units.");
              }
              break;

            case 'z':
              if(zScaleVal != num){
                zScaleVal = num;
                scaleMat = new THREE.Matrix4().makeScale(1, 1, zScaleVal);
                console.log("Scaled in the z direction by", zScaleVal, "units.");
              }
              break;

            default:
              console.log("?_? ._.");
              break;
          }
          if(scaleMat != null){
            transformArr.push(scaleMat);
            objMesh.geometry.applyMatrix(scaleMat);
            objMesh.geometry.verticesNeedUpdate = true;
          }
          break;

        case 'shear':
          var shearMat;
          switch(dir){
            case 'x':
              if(xShearVal != num){
                xShearVal = num;
                shearMat = new THREE.Matrix4().makeShear(xShearVal, 0, 0);
                console.log("Sheared in the x direction by", xShearVal, "units.");
              }
              break;

            case 'y':
              if(yShearVal != num){
                yShearVal = num;
                shearMat = new THREE.Matrix4().makeShear(0, yShearVal, 0);
                console.log("Sheared in the y direction by", yShearVal, "units.");
              }
              break;

            case 'z':
              if(zShearVal != num){
                zShearVal = num;
                shearMat = new THREE.Matrix4().makeShear(0, 0, zShearVal);
                console.log("Sheared in the z direction by", zShearVal, "units.");
              }
              break;

            default:
              console.log("?_? ._.");
              break;
          }
          if(shearMat != null){
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
              if(xRotVal != num){
                xRotVal = num;
                rotMat = new THREE.Matrix4().makeRotationX(rad);
                console.log("Rotated in the x direction by", xRotVal, "degrees.");
              }
              break;

            case 'y':
              if(yRotVal != num){
                yRotVal = num;
                rotMat = new THREE.Matrix4().makeRotationY(rad);
                console.log("Rotated in the y direction by", yRotVal, "degrees.");
              }
              break;

            case 'z':
              if(zRotVal != num){
                zRotVal = num;
                rotMat = new THREE.Matrix4().makeRotationZ(rad);
                console.log("Sheared in the z direction by", zRotVal, "degrees.");
              }
              break;

            default:
              console.log("?_? ._.");
              break;
          }
          if(rotMat != null){
            transformArr.push(rotMat);
            objMesh.geometry.applyMatrix(rotMat);
            objMesh.geometry.verticesNeedUpdate = true;
          }
          break;

        default:
          console.log("NANI?!");
          break;
      }
    }
  }

}

function handleObjectType(value){
  switch(value){
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
      objMesh.position.x = 3.5;
      objMesh.position.y = 2;
      objMesh.position.z = 2.5;
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
      fileInput.addEventListener('change', function(ev){ readFileByType(ev); }, false);
      break;

    default:
      console.log("How'd you get here? HAX!");
      break;
  }
  camera.position.x = 25;
  camera.position.y = 25;
  camera.position.z = 25;
}

function handleLightChange(value, isOn, lightCol, lightObj, xLight, yLight, zLight){
  isOn = value;
  if(!isOn){
    lightObj.intensity = 0;
    lightCol.domElement.style.pointerEvents = "none";
    lightCol.domElement.style.opacity = 0.5;
    if(lightObj != ambientLight){
      xLight.domElement.style.pointerEvents = "none";
      xLight.domElement.style.opacity = 0.5;
      yLight.domElement.style.pointerEvents = "none";
      yLight.domElement.style.opacity = 0.5;
      zLight.domElement.style.pointerEvents = "none";
      zLight.domElement.style.opacity = 0.5;
    }
  }
  else if(lightCol.domElement.style.pointerEvents == "none" && isOn){
    lightObj.intensity = 0.75;
    lightCol.domElement.style.pointerEvents = "auto";
    lightCol.domElement.style.opacity = 1.0;
    if(lightObj != ambientLight){
      xLight.domElement.style.pointerEvents = "auto";
      xLight.domElement.style.opacity = 1.0;
      yLight.domElement.style.pointerEvents = "auto";
      yLight.domElement.style.opacity = 1.0;
      zLight.domElement.style.pointerEvents = "auto";
      zLight.domElement.style.opacity = 1.0;
    }
  }
}

function handleGridOpacity(value, grid1, grid2){
  if(value == 0.0){
    grid1.toggle(false);
    grid2.toggle(false);
  }
  else{
    if((!grid1.getToggle()) && (!grid2.getToggle())){
      grid1.toggle(true);
      grid2.toggle(true);
    }
    grid1.setOpacity(value);
    grid2.setOpacity(value);
  }
}

function handleGridColor(val, gridCol, grid1, grid2){
  var hexStr = ('0x' + val.toString(16));
  gridCol.setHex(hexStr);
  grid1.setColor(gridCol.getHex());
  grid2.setColor(gridCol.getHex());
}

function handleColorChange(color){
	return function(value){
    if(typeof value === 'string'){
      value = value.replace('#', '0x');
    }
    color.setHex(value);
	};
}

function stringToNum(input){
  if(!isNaN(input)){
    return +input;
  }
}
/*
function isGltf1(contents){
  var resultContent;

  if(typeof contents === 'string'){
    // contents is a JSON string
    resultContent = contents;
  }
  else{
    var magic = THREE.LoaderUtils.decodeText(new Uint8Array(contents, 0, 4));

    if(magic === 'glTF'){
      // contents is a .glb file; extract the version
      var version = new DataView(contents).getUint32(4, true);
      return version < 2;
    }
    else{
      // contents is a .gltf file
      resultContent = THREE.LoaderUtils.decodeText(new Uint8Array(contents));
    }
  }

  var json = JSON.parse(resultContent);

  return (json.asset != undefined && json.asset.version[0] < 2);

}
*/
