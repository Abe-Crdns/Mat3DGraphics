/**
 * @author Abraham Cardenas https://github.com/Abe-Crdns
 * A 3D variation of the LabeledGrid class at
 * https://github.com/usco/glView-helpers/blob/master/src/grids/LabeledGrid.js
 */

import { Line2 } from '../geometries/lines/Line2.js';
import { LineMaterial } from '../geometries/lines/LineMaterial.js';
import { LineGeometry } from '../geometries/lines/LineGeometry.js';
import { _createClass, _classCallCheck,
        _possibleConstructorReturn, _inherits } from '../lib/__class.js';


var CoordSys3D = function(_THREE$Object3D){
  _inherits(CoordSys3D, _THREE$Object3D);

  function CoordSys3D(args){
    var xzWidth = (args !== undefined && args.xzWidth !== undefined) ? args.xzWidth : 5;
    var xyWidth = (args !== undefined && args.xyWidth !== undefined) ? args.xyWidth : 5;
    var yzWidth = (args !== undefined && args.yzWidth !== undefined) ? args.yzWidth : 5;

    var xzLength = (args !== undefined && args.xzLength !== undefined) ? args.xzLength : 5;
    var xyLength = (args !== undefined && args.xyLength !== undefined) ? args.xyLength : 5;
    var yzLength = (args !== undefined && args.yzLength !== undefined) ? args.yzLength : 5;

    var xzColor = (args !== undefined && args.xzColor !== undefined) ? args.xzColor : 0x0000ff;
    var xyColor = (args !== undefined && args.xyColor !== undefined) ? args.xyColor : 0x00ff00;
    var yzColor = (args !== undefined && args.yzColor !== undefined) ? args.yzColor : 0xff0000;

    var xzOpacity = (args !== undefined && args.xzOpacity !== undefined) ? args.xzOpacity : 0.5;
    var xyOpacity = (args !== undefined && args.xyOpacity !== undefined) ? args.xyOpacity : 0.5;
    var yzOpacity = (args !== undefined && args.yzOpacity !== undefined) ? args.yzOpacity : 0.5;

    var xAxisColor = (args !== undefined && args.xAxisColor !== undefined) ? args.xAxisColor : 0xff0000;
    var yAxisColor = (args !== undefined && args.yAxisColor !== undefined) ? args.yAxisColor : 0x00ff00;
    var zAxisColor = (args !== undefined && args.zAxisColor !== undefined) ? args.zAxisColor : 0x0000ff;

    var xAxisOpacity = (args !== undefined && args.xAxisOpacity !== undefined) ? args.xAxisOpacity : 1;
    var yAxisOpacity = (args !== undefined && args.yAxisOpacity !== undefined) ? args.yAxisOpacity : 1;
    var zAxisOpacity = (args !== undefined && args.zAxisOpacity !== undefined) ? args.zAxisOpacity : 1;

    var step = (args !== undefined && args.step !== undefined) ? args.step : 5;
    var text = (args !== undefined && args.text !== undefined) ? args.text : true;
    var textColor = (args !== undefined && args.textColor !== undefined) ? args.textColor : "#000000";

    var drawXZ = (args !== undefined && args.drawXZ !== undefined) ? args.drawXZ : true;
    var drawXY = (args !== undefined && args.drawXY !== undefined) ? args.drawXY : true;
    var drawYZ = (args !== undefined && args.drawYZ !== undefined) ? args.drawYZ : true;


    _classCallCheck(this, CoordSys3D);

    var _this = _possibleConstructorReturn(this, (CoordSys3D.__proto__ ||
                                                  Object.getPrototypeOf(CoordSys3D)).call(this));
    _this.xzWidth = xzWidth;
    _this.xyWidth = xyWidth;
    _this.yzWidth = yzWidth;

    _this.xzLength = xzLength;
    _this.xyLength = xyLength;
    _this.yzLength = yzLength;

    _this.xzColor = xzColor;
    _this.xyColor = xyColor;
    _this.yzColor = yzColor;

    _this.xzOpacity = xzOpacity;
    _this.xyOpacity = xyOpacity;
    _this.yzOpacity = yzOpacity;

    _this.xAxisColor = xAxisColor;
    _this.yAxisColor = yAxisColor;
    _this.zAxisColor = zAxisColor;

    _this.xAxisOpacity = xAxisOpacity;
    _this.yAxisOpacity = yAxisOpacity;
    _this.zAxisOpacity = zAxisOpacity;

    _this.step = step;
    _this.text = text;
    _this.textColor = textColor;

    _this.name = "grid";

    //TODO: clean this up
    _this.marginSize = 5;
    _this.stepSubDivisions = step;

    _this._draw3DGrid({drawXZ: drawXZ, drawXY: drawXY, drawYZ: drawYZ});

    return _this;
  }

  function computePlaneVertices(args){

    var computeXZ = (args !== undefined && args.computeXZ !== undefined) ? args.computeXZ : false;
    var computeXY = (args !== undefined && args.computeXY !== undefined) ? args.computeXY : false;
    var computeYZ = (args !== undefined && args.computeYZ !== undefined) ? args.computeYZ : false;
    var width = (args !== undefined && args.width !== undefined) ? args.width : 5;
    var length = (args !== undefined && args.length !== undefined) ? args.length : 5;
    var step = (args !== undefined && args.step !== undefined) ? args.step : 5;
    var stepSubDivisions = (args !== undefined && args.stepSubDivisions !== undefined) ? args.stepSubDivisions : 5;

    if((computeXZ || computeXY || computeYZ) &&  width && length){
      var xzGridGeometry, xzSubGridGeometry, xyGridGeometry,
          xySubGridGeometry, yzGridGeometry, yzSubGridGeometry;

      if(computeXZ){
        xzGridGeometry = new THREE.Geometry();
        xzSubGridGeometry = new THREE.Geometry();
      }

      if(computeXY){
        xyGridGeometry = new THREE.Geometry();
        xySubGridGeometry = new THREE.Geometry();
      }

      if(computeYZ){
        yzGridGeometry = new THREE.Geometry();
        yzSubGridGeometry = new THREE.Geometry();
      }

      for(var i = -width; i < 0; i += step / stepSubDivisions){
        if(computeXZ){
          xzSubGridGeometry.vertices.push(new THREE.Vector3(0, i, 0));
          xzSubGridGeometry.vertices.push(new THREE.Vector3(length, i, 0));
        }

        if(computeXY){
          xySubGridGeometry.vertices.push(new THREE.Vector3(0, -i, 0));
          xySubGridGeometry.vertices.push(new THREE.Vector3(length, -i, 0));
        }

        if(computeYZ){
          yzSubGridGeometry.vertices.push(new THREE.Vector3(0, -i, 0));
          yzSubGridGeometry.vertices.push(new THREE.Vector3(length, -i, 0));
        }

        if (i % step == 0) {
          if(computeXZ){
            xzGridGeometry.vertices.push(new THREE.Vector3(0, i, 0));
            xzGridGeometry.vertices.push(new THREE.Vector3(length, i, 0));
          }

          if(computeXY){
            xyGridGeometry.vertices.push(new THREE.Vector3(0, -i, 0));
            xyGridGeometry.vertices.push(new THREE.Vector3(length, -i, 0));
          }

          if(computeYZ){
            yzGridGeometry.vertices.push(new THREE.Vector3(0, -i, 0));
            yzGridGeometry.vertices.push(new THREE.Vector3(length, -i, 0));
          }
        }
      }

      for (var i = step / stepSubDivisions; i <= length; i += step / stepSubDivisions) {
        if(computeXZ){
          xzSubGridGeometry.vertices.push(new THREE.Vector3(i, -width, 0));
          xzSubGridGeometry.vertices.push(new THREE.Vector3(i, 0, 0));
        }

        if(computeXY){
          xySubGridGeometry.vertices.push(new THREE.Vector3(i, width, 0));
          xySubGridGeometry.vertices.push(new THREE.Vector3(i, 0, 0));
        }

        if(computeYZ){
          yzSubGridGeometry.vertices.push(new THREE.Vector3(i, width, 0));
          yzSubGridGeometry.vertices.push(new THREE.Vector3(i, 0, 0));
        }

        if (i % step == 0) {
          if(computeXZ){
            xzGridGeometry.vertices.push(new THREE.Vector3(i, -width, 0));
            xzGridGeometry.vertices.push(new THREE.Vector3(i, 0, 0));
          }

          if(computeXY){
            xyGridGeometry.vertices.push(new THREE.Vector3(i, width, 0));
            xyGridGeometry.vertices.push(new THREE.Vector3(i, 0, 0));
          }

          if(computeYZ){
            yzGridGeometry.vertices.push(new THREE.Vector3(i, width, 0));
            yzGridGeometry.vertices.push(new THREE.Vector3(i, 0, 0));
          }
        }
      }


      return {  xzSubGridGeometry: xzSubGridGeometry, xySubGridGeometry: xySubGridGeometry,
                yzSubGridGeometry: yzSubGridGeometry, xzGridGeometry: xzGridGeometry,
                xyGridGeometry: xyGridGeometry, yzGridGeometry: yzGridGeometry  };
    }
  }

  function hexToRgb(hex) {
    var bigint = parseInt(hex.toString(10));
    var r = (bigint >> 16) & 1.0;
    var g = (bigint >> 8) & 1.0;
    var b = bigint & 1.0;

    return {r: r, g: g, b: b};
  }

  _createClass(CoordSys3D, [{
    key: "_draw3DGrid",
    value: function _draw3DGrid(args){
      var drawXZ = (args !== undefined && args.drawXZ !== undefined) ? args.drawXZ : false;
      var drawXY = (args !== undefined && args.drawXY !== undefined) ? args.drawXY : false;
      var drawYZ = (args !== undefined && args.drawYZ !== undefined) ? args.drawYZ : false;

      if(!drawXZ && !drawXY && !drawYZ){
        console.log("_draw3DGrid: Nothing to draw");
        return;
      }

      var xzGridGeometry, xzGridMaterial, xzMainGridZ, xzPlaneFragmentShader,
        xzPlaneGeometry, xzPlaneMaterial, xzSubGridGeometry, xzSubGridMaterial, xzSubGridZ;
      var xyGridGeometry, xyGridMaterial, xyMainGridZ, xyPlaneFragmentShader,
        xyPlaneGeometry, xyPlaneMaterial, xySubGridGeometry, xySubGridMaterial, xySubGridZ;
      var yzGridGeometry, yzGridMaterial, yzMainGridZ, yzPlaneFragmentShader,
        yzPlaneGeometry, yzPlaneMaterial, yzSubGridGeometry, yzSubGridMaterial, yzSubGridZ;


      if(drawXZ){
        xzGridGeometry = new THREE.Geometry();
        xzGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.xzColor),
          opacity: this.xzOpacity,
          linewidth: 2,
          transparent: true
        });

        xzSubGridZ = 0;
        xzSubGridGeometry = new THREE.Geometry();
        xzSubGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.xzColor),
          opacity: this.xzOpacity / 2,
          transparent: true
        });
      }

      if(drawXY){
        xyGridGeometry = new THREE.Geometry();
        xyGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.xyColor),
          opacity: this.xyOpacity,
          linewidth: 2,
          transparent: true
        });

        xySubGridGeometry = new THREE.Geometry();
        xySubGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.xyColor),
          opacity: this.xyOpacity / 2,
          transparent: true
        });
      }

      if(drawYZ){
        yzGridGeometry = new THREE.Geometry();
        yzGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.yzColor),
          opacity: this.yzOpacity,
          linewidth: 2,
          transparent: true
        });

        yzSubGridGeometry = new THREE.Geometry();
        yzSubGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.yzColor),
          opacity: this.yzOpacity / 2,
          transparent: true
        });
      }

      var xzWidth = this.xzWidth;
      var xzLength = this.xzLength;
      var xyWidth = this.xyWidth;
      var xyLength = this.xyLength;
      var yzWidth = this.yzWidth;
      var yzLength = this.yzLength;
      var step = this.step;
      var stepSubDivisions = this.stepSubDivisions;

      if(xzWidth == xyWidth && xzWidth == yzWidth && xyWidth == yzWidth &&
         xzLength == xyLength && xzLength == yzLength && xyLength == yzLength){
        var computedAllVert = computePlaneVertices( {  computeXZ: true, computeXY: true, computeYZ: true,
                                                      width: xzWidth, length: xzLength, step: step,
                                                      stepSubDivisions: stepSubDivisions } );

        xzGridGeometry = computedAllVert.xzGridGeometry;
        xyGridGeometry = computedAllVert.xyGridGeometry;
        yzGridGeometry = computedAllVert.yzGridGeometry
        xzSubGridGeometry = computedAllVert.xzSubGridGeometry;
        xySubGridGeometry = computedAllVert.xySubGridGeometry;
        yzSubGridGeometry = computedAllVert.yzSubGridGeometry;
      }
      else if(xzWidth == xyWidth && xzLength == xyLength){
        var computedXZXY_Vert = computePlaneVertices({ computeXZ: true, computeXY: true,
                                                      width: xzWidth, length: xzLength, step: step,
                                                      stepSubDivisions: stepSubDivisions });

        var computedYZ_Vert = computePlaneVertices({   computeYZ: true,
                                                      width: yzWidth, length: yzLength, step: step,
                                                      stepSubDivisions: stepSubDivisions });

        xzGridGeometry = computedXZXY_Vert.xzGridGeometry;
        xyGridGeometry = computedXZXY_Vert.xyGridGeometry;
        yzGridGeometry = computedYZ_Vert.yzGridGeometry
        xzSubGridGeometry = computedXZXY_Vert.xzSubGridGeometry;
        xySubGridGeometry = computedXZXY_Vert.xySubGridGeometry;
        yzSubGridGeometry = computedYZ_Vert.yzSubGridGeometry;
      }
      else if(xzWidth == yzWidth && xzLength == yzLength){
        var computedXZYZ_Vert = computePlaneVertices({ computeXZ: true, computeYZ: true,
                                                      width: xzWidth, length: xzLength, step: step,
                                                      stepSubDivisions: stepSubDivisions  });

        var computedXY_Vert = computePlaneVertices({  computeXY: true,
                                                     width: xyWidth, length: xyLength, step: step,
                                                     stepSubDivisions: stepSubDivisions  });

        xzGridGeometry = computedXZYZ_Vert.xzGridGeometry;
        xyGridGeometry = computedXY_Vert.xyGridGeometry;
        yzGridGeometry = computedXZYZ_Vert.yzGridGeometry
        xzSubGridGeometry = computedXZYZ_Vert.xzSubGridGeometry;
        xySubGridGeometry = computedXY_Vert.xySubGridGeometry;
        yzSubGridGeometry = computedXZYZ_Vert.yzSubGridGeometry;
      }
      else if(xyWidth == yzWidth && xyLength == yzLength){
        var computedXYYZ_Vert = computePlaneVertices({ computeXY: true, computeYZ: true,
                                                      width: xyWidth, length: xyLength, step: step,
                                                      stepSubDivisions: stepSubDivisions  });

        var computedXZ_Vert = computePlaneVertices({  computeXZ: true,
                                                     width: xyWidth, length: xyLength, step: step,
                                                     stepSubDivisions: stepSubDivisions  });

        xzGridGeometry = computedXZ_Vert.xzGridGeometry;
        xyGridGeometry = computedXYYZ_Vert.xyGridGeometry;
        yzGridGeometry = computedXYYZ_Vert.yzGridGeometry
        xzSubGridGeometry = computedXZ_Vert.xzSubGridGeometry;
        xySubGridGeometry = computedXYYZ_Vert.xySubGridGeometry;
        yzSubGridGeometry = computedXYYZ_Vert.yzSubGridGeometry;
      }
      else{
        var computedXZ_Vert = computePlaneVertices({ computeXZ: true, width: xzWidth, length: xzLength,
                                                    step: step, stepSubDivisions: stepSubDivisions  });
        var computedXY_Vert = computePlaneVertices({ computeXY: true, width: xyWidth, length: xyLength,
                                                    step: step, stepSubDivisions: stepSubDivisions  });
        var computedYZ_Vert = computePlaneVertices({ computeYZ: true, width: yzWidth, length: yzLength,
                                                    step: step, stepSubDivisions: stepSubDivisions  });

        xzGridGeometry = computedXZ_Vert.xzGridGeometry;
        xyGridGeometry = computedXYYZ_Vert.xyGridGeometry;
        yzGridGeometry = computedXYYZ_Vert.yzGridGeometry
        xzSubGridGeometry = computedXZ_Vert.xzSubGridGeometry;
        xySubGridGeometry = computedXYYZ_Vert.xySubGridGeometry;
        yzSubGridGeometry = computedXYYZ_Vert.yzSubGridGeometry;
      }

      var xzOffsetWidth = xzWidth + this.marginSize;
      var xzOffsetLength = xzLength + this.marginSize;
      var xyOffsetWidth = xyWidth + this.marginSize;
      var xyOffsetLength = xyLength + this.marginSize;
      var yzOffsetWidth = yzWidth + this.marginSize;
      var yzOffsetLength = yzLength + this.marginSize;

      var xzUpVector = new THREE.Vector3().fromArray([0, 1, 0]);
      var xyUpVector = new THREE.Vector3().fromArray([0, 0, 1]);
      var yzUpVector = new THREE.Vector3().fromArray([-1, 0, 0]);

      if(drawXZ){
        this.xzMainGrid = new THREE.LineSegments(xzGridGeometry, xzGridMaterial);
        this.xzSubGrid = new THREE.LineSegments(xzSubGridGeometry, xzSubGridMaterial);

        this.xzMainGrid.lookAt(xzUpVector);
        this.xzSubGrid.lookAt(xzUpVector);

        this.add(this.xzMainGrid);
        this.add(this.xzSubGrid);
      }

      if(drawXY){
        this.xyMainGrid = new THREE.LineSegments(xyGridGeometry, xyGridMaterial);
        this.xySubGrid = new THREE.LineSegments(xySubGridGeometry, xySubGridMaterial);

        this.xyMainGrid.lookAt(xyUpVector);
        this.xySubGrid.lookAt(xyUpVector);

        this.add(this.xyMainGrid);
        this.add(this.xySubGrid);
      }

      if(drawYZ){
        this.yzMainGrid = new THREE.LineSegments(yzGridGeometry, yzGridMaterial);
        this.yzSubGrid = new THREE.LineSegments(yzSubGridGeometry, yzSubGridMaterial);

        this.yzMainGrid.lookAt(yzUpVector);
        this.yzSubGrid.lookAt(yzUpVector);

        this.add(this.yzMainGrid);
        this.add(this.yzSubGrid);
      }

      var xAxisGeometry = new LineGeometry();
      xAxisGeometry.setPositions( [0, 0, 0,   xyLength, 0, 0] );
      var xAxisColor = hexToRgb(this.xAxisColor);
      xAxisGeometry.setColors([ xAxisColor.r, xAxisColor.g, xAxisColor.b,
                                xAxisColor.r, xAxisColor.g, xAxisColor.b ]);

      var yAxisGeometry = new LineGeometry();
      yAxisGeometry.setPositions( [0, 0, 0,   0, xyLength, 0] );
      var yAxisColor = hexToRgb(this.yAxisColor);
      yAxisGeometry.setColors([ yAxisColor.r, yAxisColor.g, yAxisColor.b,
                                yAxisColor.r, yAxisColor.g, yAxisColor.b ]);

      var zAxisGeometry = new LineGeometry();
      zAxisGeometry.setPositions( [0, 0, 0,   0, 0, yzLength] );
      var zAxisColor = hexToRgb(this.zAxisColor);
      zAxisGeometry.setColors([ zAxisColor.r, zAxisColor.g, zAxisColor.b,
                                zAxisColor.r, zAxisColor.g, zAxisColor.b ]);

      var xRayLineGeometry = new LineGeometry();
      xRayLineGeometry.setPositions([0, 0, 0,   0, 0, 0]);
      xRayLineGeometry.setColors([xAxisColor.r, xAxisColor.g, xAxisColor.b,
                                  xAxisColor.r, xAxisColor.g, xAxisColor.b]);

      var yRayLineGeometry = new LineGeometry();
      yRayLineGeometry.setPositions( [0, 0, 0,   0, 0, 0] );
      yRayLineGeometry.setColors([yAxisColor.r, yAxisColor.g, yAxisColor.b,
                                  yAxisColor.r, yAxisColor.g, yAxisColor.b]);

      var zRayLineGeometry = new LineGeometry();
      zRayLineGeometry.setPositions( [0, 0, 0,   0, 0, 0] );
      zRayLineGeometry.setColors([zAxisColor.r, zAxisColor.g, zAxisColor.b,
                                  zAxisColor.r, zAxisColor.g, zAxisColor.b]);

      var axisThickLineMaterial = new LineMaterial({
        color: 0xffffff,
        linewidth: 5,
        vertexColors: THREE.VertexColors,
        dashed: false
      });

      var raylineThickLineMaterial = new LineMaterial({
        color: 0xffffff,
        linewidth: 2.5,
        vertexColors: THREE.VertexColors,
        dashed: false
      });

      this.xAxisMat = axisThickLineMaterial;
      this.yAxisMat = axisThickLineMaterial;
      this.zAxisMat = axisThickLineMaterial;
      this.xRayLineMat = raylineThickLineMaterial;
      this.yRayLineMat = raylineThickLineMaterial;
      this.zRayLineMat = raylineThickLineMaterial;

      this.xAxis = new Line2( xAxisGeometry, axisThickLineMaterial );
      this.yAxis = new Line2( yAxisGeometry, axisThickLineMaterial );
      this.zAxis = new Line2( zAxisGeometry, axisThickLineMaterial );
      this.xRayLine = new Line2( xRayLineGeometry, raylineThickLineMaterial );
      this.yRayLine = new Line2( yRayLineGeometry, raylineThickLineMaterial );
      this.zRayLine = new Line2( zRayLineGeometry, raylineThickLineMaterial );

      this.xAxis.computeLineDistances();
      this.yAxis.computeLineDistances();
      this.zAxis.computeLineDistances();
      this.xRayLine.computeLineDistances();
      this.yRayLine.computeLineDistances();
      this.zRayLine.computeLineDistances();

      this.xAxis.scale.set( 1, 1, 1 );
      this.yAxis.scale.set( 1, 1, 1 );
      this.zAxis.scale.set( 1, 1, 1 );
      this.xRayLine.scale.set( 1, 1, 1 );
      this.yRayLine.scale.set( 1, 1, 1 );
      this.zRayLine.scale.set( 1, 1, 1 );

      this.xRayLine.visible = false;
      this.yRayLine.visible = false;
      this.zRayLine.visible = false;

      this.add(this.xAxis);
      this.add(this.yAxis);
      this.add(this.zAxis);
      this.add(this.xRayLine);
      this.add(this.yRayLine);
      this.add(this.zRayLine);
      //this._drawNumbering();
    }
  }, {
    key: "setOpacityXZ",
    value: function setOpacity(opacity) {
      this.xzOpacity = opacity;
      this.xzMainGrid.material.opacity = opacity;
      this.xzSubGrid.material.opacity = opacity / 2;
      this.xzMargin.material.opacity = opacity * 2;
    }
  }, {
    key: "setOpacityXY",
    value: function setOpacity(opacity) {
      this.xyOpacity = opacity;
      this.xyMainGrid.material.opacity = opacity;
      this.xySubGrid.material.opacity = opacity / 2;
      this.xyMargin.material.opacity = opacity * 2;
    }
  }, {
    key: "setOpacityYZ",
    value: function setOpacity(opacity) {
      this.yzOpacity = opacity;
      this.yzMainGrid.material.opacity = opacity;
      this.yzSubGrid.material.opacity = opacity / 2;
      this.yzMargin.material.opacity = opacity * 2;
    }
  }, {
    key: "setColorXZ",
    value: function setColor(color) {
      this.xzColor = color;
      this.xzMainGrid.material.color = new THREE.Color().setHex(this.xzColor);
      this.xzSubGrid.material.color = new THREE.Color().setHex(this.xzColor);
      this.xzMargin.material.color = new THREE.Color().setHex(this.xzColor);
    }
  }, {
    key: "setColorXY",
    value: function setColor(color) {
      this.xyColor = color;
      this.xyMainGrid.material.color = new THREE.Color().setHex(this.xyColor);
      this.xySubGrid.material.color = new THREE.Color().setHex(this.xyColor);
      this.xyMargin.material.color = new THREE.Color().setHex(this.xyColor);
    }
  }, {
    key: "setColorYZ",
    value: function setColor(color) {
      this.yzColor = color;
      this.yzMainGrid.material.color = new THREE.Color().setHex(this.yzColor);
      this.yzSubGrid.material.color = new THREE.Color().setHex(this.yzColor);
      this.yzMargin.material.color = new THREE.Color().setHex(this.yzColor);
    }
  }, {
    key: "toggleText",
    value: function toggleText(toggle) {
      this.text = toggle;
      var labels = this.labels.children;
      for (var i = 0; i < this.labels.children.length; i++) {
        var label = labels[i];
        label.visible = toggle;
      }
    }
  }, {
    key: "setTextColor",
    value: function setTextColor(color) {
      this.textColor = color;
      this._drawNumbering();
    }
  }, {
    key: "setTextLocation",
    value: function setTextLocation(location) {
      this.textLocation = location;
      return this._drawNumbering();
    }
  }, {
    key: "resizeXZ",
    value: function resize(width, length) {
      if (width && length) {
        this.xzWidth = width;
        this.xzLength = length;

        this.remove(this.xzMainGrid);
        this.remove(this.xzSubGrid);
        this.remove(this.xzMargin);
        return this._draw3DGrid({drawXZ: true});
      }
    }
  }, {
    key: "resizeXY",
    value: function resize(width, length) {
      if (width && length) {
        this.xyWidth = width;
        this.xyLength = length;

        this.remove(this.xyMainGrid);
        this.remove(this.xySubGrid);
        this.remove(this.xyMargin);
        return this._draw3DGrid({drawXY: true});
      }
    }
  }, {
    key: "resizeYZ",
    value: function resize(width, length) {
      if (width && length) {
        this.yzWidth = width;
        this.yzLength = length;

        this.remove(this.yzMainGrid);
        this.remove(this.yzSubGrid);
        this.remove(this.yzMargin);
        return this._draw3DGrid({drawYZ: true});
      }
    }
  }, {
    key: "_drawNumbering",
    value: function _drawNumbering() {
      var label, sizeLabel, sizeLabel2, xLabelsLeft, xLabelsRight, yLabelsBack, yLabelsFront;
      var step = this.step;

      this._labelStore = {};

      if (this.labels != null) {
        this.mainGrid.remove(this.labels);
      }
      this.labels = new THREE.Object3D();

      var width = this.width;
      var length = this.length;
      var numbering = this.numbering = "centerBased";

      var labelsFront = new THREE.Object3D();
      /*
      var labelsBack = new THREE.Object3D();
      var labelsSideRight = new THREE.Object3D();
      var labelsSideLeft = new THREE.Object3D();
      */

      if (numbering == "centerBased") {

        for (var i = step; i <= width / 2; i += step) {
          var sizeLabel = this.drawTextOnPlane("" + i, 32);
          var sizeLabel2 = this.drawTextOnPlane("" + i, 32);
          /*
          var sizeLabel3 = sizeLabel2.clone();
          var sizeLabel4 = sizeLabel.clone();
          */

          sizeLabel.position.set(length / 2, -i, 0);
          sizeLabel.rotation.z = -Math.PI / 2;
          labelsFront.add(sizeLabel);

          sizeLabel2.position.set(length / 2, -i, 0);
          sizeLabel2.rotation.x = -Math.PI;
          sizeLabel2.rotation.z = -Math.PI / 2;
          labelsFront.add(sizeLabel2);

          /*
          sizeLabel3.position.set(length / 2, -i, 0);
          sizeLabel3.rotation.z = -Math.PI/2;
          labelsBack.add(sizeLabel3);
          labelsBack.rotation.z = -Math.PI;

          sizeLabel4.position.set(length / 2, i, 0);
          sizeLabel4.rotation.z = -Math.PI/2;
          labelsBack.add(sizeLabel4);
          labelsBack.rotation.z = -Math.PI;
          */

        }

        /*
        for (var i = 0; i <= length / 2; i += step) {
          var sizeLabel = this.drawTextOnPlane("" + i, 32);
          var sizeLabel2 = this.drawTextOnPlane("" - i, 32);
          var sizeLabel3 = sizeLabel.clone();
          var sizeLabel4 = sizeLabel2.clone();

          sizeLabel.position.set(i, width / 2, 0);
          labelsSideRight.add(sizeLabel);

          sizeLabel2.position.set(-i, width / 2, 0);
          labelsSideRight.add(sizeLabel2);

          sizeLabel3.position.set(-i, width / 2, 0);
          labelsSideLeft.add(sizeLabel3);
          labelsSideLeft.rotation.z = -Math.PI;

          sizeLabel4.position.set(i, width / 2, 0);
          labelsSideLeft.add(sizeLabel4);
          labelsSideLeft.rotation.z = -Math.PI;
        }
        */
      }

      this.labels.add(labelsFront);
      /*
      this.labels.add(labelsBack);
      this.labels.add(labelsSideRight);
      this.labels.add(labelsSideLeft);
      */

      //apply visibility settings to all labels
      var textVisible = this.text;
      this.labels.traverse(function (child) {
        child.visible = textVisible;
      });
      this.mainGrid.add(this.labels);
    }
  },  {
    key: "_textRotateZ",
    value: function _textRotateZ(rads){
      this.labels.rotateZ(rads);
    }
  }, {
    key: "drawTextOnPlane",
    value: function drawTextOnPlane(text, size) {
      var canvas, context, material, plane, texture;

      if (size == null) {
        size = 256;
      }

      canvas = document.createElement('canvas');
      var size = 128;
      canvas.width = size;
      canvas.height = size;
      context = canvas.getContext('2d');
      context.font = "8px Arial";
      context.textAlign = 'center';
      context.fillStyle = this.textColor;
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      context.strokeStyle = this.textColor;
      context.strokeText(text, canvas.width / 2, canvas.height / 2);

      texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      texture.generateMipmaps = true;
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearFilter;

      material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        color: 0xffffff,
        alphaTest: 0.6
      });
      plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(size / 8, size / 8), material);
      plane.doubleSided = true;
      plane.overdraw = true;

      return plane;
    }
  }]);

  return CoordSys3D;
}(THREE.Object3D);

export { CoordSys3D }
