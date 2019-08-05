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

    var origin = (args !== undefined && args.origin !== undefined && args.origin.x !== undefined &&
      args.origin.y !== undefined && args.origin.z !== undefined) ? args.origin : {x: 0, y: 0, z: 0};

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
    var stepSubDivisions = (args !== undefined && args.stepSubDivisions !== undefined) ? args.stepSubDivisions : 5;

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

    _this.origin = origin;

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
    _this.stepSubDivisions = stepSubDivisions;

    _this.text = text;
    _this.textColor = textColor;

    _this.name = "";


    _this._draw3DCoordSys({drawXZ: drawXZ, drawXY: drawXY, drawYZ: drawYZ});

    return _this;
  }

  function hexToRgb(hex) {
    var bigint = parseInt(hex.toString(10));
    var r = (bigint >> 16) & 1.0;
    var g = (bigint >> 8) & 1.0;
    var b = bigint & 1.0;

    return {r: r, g: g, b: b};
  }

  _createClass(CoordSys3D, [{
    key: "_draw3DCoordSys",
    value: function _draw3DCoordSys(args){
      var drawXZ = (args !== undefined && args.drawXZ !== undefined) ? args.drawXZ : false;
      var drawXY = (args !== undefined && args.drawXY !== undefined) ? args.drawXY : false;
      var drawYZ = (args !== undefined && args.drawYZ !== undefined) ? args.drawYZ : false;

      if(!drawXZ && !drawXY && !drawYZ){
        console.log("_draw3DCoordSys: Nothing to draw");
        return;
      }

      if(drawXZ){
        this.xzGridGeometry = new THREE.Geometry();
        this.xzGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.xzColor),
          opacity: this.xzOpacity,
          linewidth: 2,
          transparent: true
        });

        this.xzSubGridGeometry = new THREE.Geometry();
        this.xzSubGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.xzColor),
          opacity: this.xzOpacity / 2,
          transparent: true
        });
      }

      if(drawXY){
        this.xyGridGeometry = new THREE.Geometry();
        this.xyGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.xyColor),
          opacity: this.xyOpacity,
          linewidth: 2,
          transparent: true
        });

        this.xySubGridGeometry = new THREE.Geometry();
        this.xySubGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.xyColor),
          opacity: this.xyOpacity / 2,
          transparent: true
        });
      }

      if(drawYZ){
        this.yzGridGeometry = new THREE.Geometry();
        this.yzGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.yzColor),
          opacity: this.yzOpacity,
          linewidth: 2,
          transparent: true
        });

        this.yzSubGridGeometry = new THREE.Geometry();
        this.yzSubGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.yzColor),
          opacity: this.yzOpacity / 2,
          transparent: true
        });
      }

      if(this.xzWidth == this.xyWidth && this.xzWidth == this.yzWidth && this.xyWidth == this.yzWidth &&
         this.xzLength == this.xyLength && this.xzLength == this.yzLength && this.xyLength == this.yzLength){
        this.computeGridVertices({ computeXZ: true, computeXY: true, computeYZ: true,
                                   width: this.xzWidth, length: this.xzLength });
      }
      else if(this.xzWidth == this.xyWidth && this.xzLength == this.xyLength){
        this.computeGridVertices({ computeXZ: true, computeXY: true,
                                   width: this.xzWidth, length: this.xzLength });
        this.computeGridVertices({ computeYZ: true, width: this.yzWidth, length: this.yzLength });
      }
      else if(this.xzWidth == this.yzWidth && this.xzLength == this.yzLength){
        this.computeGridVertices({ computeXZ: true, computeYZ: true,
                                   width: this.xzWidth, length: this.xzLength });
        this.computeGridVertices({ computeXY: true, width: this.xyWidth, length: this.xyLength });
      }
      else if(this.xyWidth == this.yzWidth && this.xyLength == this.yzLength){
        this.computeGridVertices({ computeXY: true, computeYZ: true,
                                   width: this.xyWidth, length: this.xyLength });
        this.computeGridVertices({ computeXZ: true, width: this.xyWidth, length: this.xyLength });
      }
      else{
        this.computeGridVertices({ computeXZ: true, width: this.xzWidth, length: this.xzLength });
        this.computeGridVertices({ computeXY: true, width: this.xyWidth, length: this.xyLength });
        this.computeGridVertices({ computeYZ: true, width: this.yzWidth, length: this.yzLength });
      }

      var xzUpVector = new THREE.Vector3().fromArray([0, 1, 0]);
      var xyUpVector = new THREE.Vector3().fromArray([0, 0, 1]);
      var yzUpVector = new THREE.Vector3().fromArray([-1, 0, 0]);

      if(drawXZ){
        this.xzMainGrid = new THREE.LineSegments(this.xzGridGeometry, this.xzGridMaterial);
        this.xzSubGrid = new THREE.LineSegments(this.xzSubGridGeometry, this.xzSubGridMaterial);

        this.xzMainGrid.lookAt(xzUpVector);
        this.xzSubGrid.lookAt(xzUpVector);

        this.add(this.xzMainGrid);
        this.add(this.xzSubGrid);
      }

      if(drawXY){
        this.xyMainGrid = new THREE.LineSegments(this.xyGridGeometry, this.xyGridMaterial);
        this.xySubGrid = new THREE.LineSegments(this.xySubGridGeometry, this.xySubGridMaterial);

        this.xyMainGrid.lookAt(xyUpVector);
        this.xySubGrid.lookAt(xyUpVector);

        this.add(this.xyMainGrid);
        this.add(this.xySubGrid);
      }

      if(drawYZ){
        this.yzMainGrid = new THREE.LineSegments(this.yzGridGeometry, this.yzGridMaterial);
        this.yzSubGrid = new THREE.LineSegments(this.yzSubGridGeometry, this.yzSubGridMaterial);

        this.yzMainGrid.lookAt(yzUpVector);
        this.yzSubGrid.lookAt(yzUpVector);

        this.add(this.yzMainGrid);
        this.add(this.yzSubGrid);
      }

      var xAxisGeometry = new LineGeometry();
      var yAxisGeometry = new LineGeometry();
      var zAxisGeometry = new LineGeometry();
      var xRayLineGeometry = new LineGeometry();
      var yRayLineGeometry = new LineGeometry();
      var zRayLineGeometry = new LineGeometry();
      var initRayLinesPos = [ this.origin.x, this.origin.y, this.origin.z,
                              this.origin.x, this.origin.y, this.origin.z ];

                              console.log(this.origin.x);
      xAxisGeometry.setPositions([ this.origin.x, this.origin.y, this.origin.z,
                                   this.xyLength + this.origin.x, this.origin.y, this.origin.z ]);
      yAxisGeometry.setPositions([ this.origin.x, this.origin.y, this.origin.z,
                                   this.origin.x, this.xyLength + this.origin.y, this.origin.z ]);
      zAxisGeometry.setPositions([ this.origin.x, this.origin.y, this.origin.z,
                                   this.origin.x, this.origin.y, this.yzLength + this.origin.z]);
      xRayLineGeometry.setPositions(initRayLinesPos);
      yRayLineGeometry.setPositions(initRayLinesPos);
      zRayLineGeometry.setPositions(initRayLinesPos);

      var xAxisColor = hexToRgb(this.xAxisColor);
      var yAxisColor = hexToRgb(this.yAxisColor);
      var zAxisColor = hexToRgb(this.zAxisColor);

      var xDirColors = [ xAxisColor.r, xAxisColor.g, xAxisColor.b,
                         xAxisColor.r, xAxisColor.g, xAxisColor.b ];
      var yDirColors = [ yAxisColor.r, yAxisColor.g, yAxisColor.b,
                         yAxisColor.r, yAxisColor.g, yAxisColor.b ];
      var zDirColors = [ zAxisColor.r, zAxisColor.g, zAxisColor.b,
                         zAxisColor.r, zAxisColor.g, zAxisColor.b ];

      xAxisGeometry.setColors(xDirColors);
      xRayLineGeometry.setColors(xDirColors);
      yAxisGeometry.setColors(yDirColors);
      yRayLineGeometry.setColors(yDirColors);
      zAxisGeometry.setColors(zDirColors);
      zRayLineGeometry.setColors(zDirColors);

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
    }
  }, {
    key: "computeGridVertices",
    value: function computeGridVertices(args) {
      var computeXZ = (args !== undefined && args.computeXZ !== undefined) ? args.computeXZ : false;
      var computeXY = (args !== undefined && args.computeXY !== undefined) ? args.computeXY : false;
      var computeYZ = (args !== undefined && args.computeYZ !== undefined) ? args.computeYZ : false;
      var width = (args !== undefined && args.width !== undefined) ? args.width : 5;
      var length = (args !== undefined && args.length !== undefined) ? args.length : 5;

      var step = this.step;
      var stepSubDivisions = this.stepSubDivisions;

      if(computeXZ || computeXY || computeYZ){
        for(var i = -width; i < 0; i += step / stepSubDivisions){
          if(computeXZ){
            var pt1 = new THREE.Vector3(this.origin.x, i - this.origin.y, this.origin.z);
            var pt2 = new THREE.Vector3(length + this.origin.x, i - this.origin.y, this.origin.z);
            this.xzSubGridGeometry.vertices.push(pt1);
            this.xzSubGridGeometry.vertices.push(pt2);
          }

          if(computeXY){
            var pt1 = new THREE.Vector3(this.origin.x, -i + this.origin.y, this.origin.z);
            var pt2 = new THREE.Vector3(length + this.origin.x, -i + this.origin.y, this.origin.z);
            this.xySubGridGeometry.vertices.push(pt1);
            this.xySubGridGeometry.vertices.push(pt2);
          }

          if(computeYZ){
            var pt1 = new THREE.Vector3(this.origin.x, -i + this.origin.y, -this.origin.z);
            var pt2 = new THREE.Vector3(length + this.origin.x, -i + this.origin.y, -this.origin.z);
            this.yzSubGridGeometry.vertices.push(pt1);
            this.yzSubGridGeometry.vertices.push(pt2);
          }

          if (i % step == 0) {
            if(computeXZ){
              var pt1 = new THREE.Vector3(this.origin.x, i - this.origin.y, this.origin.z);
              var pt2 = new THREE.Vector3(length + this.origin.x, i - this.origin.y, this.origin.z);
              this.xzGridGeometry.vertices.push(pt1);
              this.xzGridGeometry.vertices.push(pt2);
            }

            if(computeXY){
              var pt1 = new THREE.Vector3(this.origin.x, -i + this.origin.y, this.origin.z);
              var pt2 = new THREE.Vector3(length + this.origin.x, -i + this.origin.y, this.origin.z);
              this.xyGridGeometry.vertices.push(pt1);
              this.xyGridGeometry.vertices.push(pt2);
            }

            if(computeYZ){
              var pt1 = new THREE.Vector3(this.origin.x, -i + this.origin.y, -this.origin.z);
              var pt2 = new THREE.Vector3(length + this.origin.x, -i + this.origin.y, -this.origin.z);
              this.yzGridGeometry.vertices.push(pt1);
              this.yzGridGeometry.vertices.push(pt2);
            }
          }
        }

        for (var i = step / stepSubDivisions; i <= length; i += step / stepSubDivisions) {
          if(computeXZ){
            var pt1 = new THREE.Vector3(i + this.origin.x, -width - this.origin.y, this.origin.z);
            var pt2 = new THREE.Vector3(i + this.origin.x, -this.origin.y, this.origin.z);
            this.xzSubGridGeometry.vertices.push(pt1);
            this.xzSubGridGeometry.vertices.push(pt2);
          }

          if(computeXY){
            var pt1 = new THREE.Vector3(i + this.origin.x, width + this.origin.y, this.origin.z);
            var pt2 = new THREE.Vector3(i + this.origin.x, this.origin.y, this.origin.z);
            this.xySubGridGeometry.vertices.push(pt1);
            this.xySubGridGeometry.vertices.push(pt2);
          }

          if(computeYZ){
            var pt1 = new THREE.Vector3(i + this.origin.x, width + this.origin.y, -this.origin.z);
            var pt2 = new THREE.Vector3(i + this.origin.x, this.origin.y, -this.origin.z);
            this.yzSubGridGeometry.vertices.push(pt1);
            this.yzSubGridGeometry.vertices.push(pt2);
          }

          if (i % step == 0) {
            if(computeXZ){
              var pt1 = new THREE.Vector3(i + this.origin.x, -width - this.origin.y, this.origin.z);
              var pt2 = new THREE.Vector3(i + this.origin.x, -this.origin.y, this.origin.z);
              this.xzGridGeometry.vertices.push(pt1);
              this.xzGridGeometry.vertices.push(pt2);
            }

            if(computeXY){
              var pt1 = new THREE.Vector3(i + this.origin.x, width + this.origin.y, this.origin.z);
              var pt2 = new THREE.Vector3(i + this.origin.x, this.origin.y, this.origin.z);
              this.xyGridGeometry.vertices.push(pt1);
              this.xyGridGeometry.vertices.push(pt2);
            }

            if(computeYZ){
              var pt1 = new THREE.Vector3(i + this.origin.x, width + this.origin.y, -this.origin.z);
              var pt2 = new THREE.Vector3(i + this.origin.x, this.origin.y, -this.origin.z);
              this.yzGridGeometry.vertices.push(pt1);
              this.yzGridGeometry.vertices.push(pt2);
            }
          }
        }
      }
      else{
        console.log("computeGridVertices: Nothing to compute, please specify a grid");
      }
    }
  }, {
    key: "removeGrid",
    value: function removeGrid(args) {
      var removeXZ = (args !== undefined && args.removeXZ !== undefined) ? args.removeXZ : false;
      var removeXY = (args !== undefined && args.removeXY !== undefined) ? args.removeXY : false;
      var removeYZ = (args !== undefined && args.removeYZ !== undefined) ? args.removeYZ : false;

      if(!remove_XZ && !remove_XY && !remove_YZ)
        return;

      if(removeXZ){
        if(this.xzMainGrid !== undefined)
          this.remove(this.xzMainGrid);
        if(this.xzSubGrid !== undefined)
          this.remove(this.xzSubGrid);
      }
      if(removeXY){
        if(this.xyMainGrid !== undefined)
          this.remove(this.xyMainGrid);
        if(this.xySubGrid !== undefined)
          this.remove(this.xySubGrid);
      }
      if(removeYZ){
        if(this.yzMainGrid !== undefined)
          this.remove(this.yzMainGrid);
        if(this.yzSubGrid !== undefined)
          this.remove(this.yzSubGrid);
      }

      if(this.xAxis !== undefined)
        this.remove(this.xAxis);
      if(this.yAxis !== undefined)
        this.remove(this.yAxis);
      if(this.zAxis !== undefined)
        this.remove(this.zAxis);
      if(this.xRayLine !== undefined)
        this.remove(this.xRayLine);
      if(this.yRayLine !== undefined)
        this.remove(this.yRayLine);
      if(this.zRayLine !== undefined)
        this.remove(this.zRayLine);
    }
  }, {
    key: "setXZopacity",
    value: function setXZopacity(opacity) {
      this.xzOpacity = opacity;
      this.xzMainGrid.material.opacity = opacity;
      this.xzSubGrid.material.opacity = opacity / 2;
    }
  }, {
    key: "setXYopacity",
    value: function setXYopacity(opacity) {
      this.xyOpacity = opacity;
      this.xyMainGrid.material.opacity = opacity;
      this.xySubGrid.material.opacity = opacity / 2;
    }
  }, {
    key: "setYZopacity",
    value: function setYZopacity(opacity) {
      this.yzOpacity = opacity;
      this.yzMainGrid.material.opacity = opacity;
      this.yzSubGrid.material.opacity = opacity / 2;
    }
  }, {
    key: "setXZcolor",
    value: function setXZcolor(color) {
      this.xzColor = color;
      this.xzMainGrid.material.color = new THREE.Color().setHex(this.xzColor);
      this.xzSubGrid.material.color = new THREE.Color().setHex(this.xzColor);
    }
  }, {
    key: "setXYcolor",
    value: function setXYcolor(color) {
      this.xyColor = color;
      this.xyMainGrid.material.color = new THREE.Color().setHex(this.xyColor);
      this.xySubGrid.material.color = new THREE.Color().setHex(this.xyColor);
    }
  }, {
    key: "setYZcolor",
    value: function setYZcolor(color) {
      this.yzColor = color;
      this.yzMainGrid.material.color = new THREE.Color().setHex(this.yzColor);
      this.yzSubGrid.material.color = new THREE.Color().setHex(this.yzColor);
    }
  }, {
    key: "setOrigin",
    value: function setOrigin(position) {
      var x = (position !== undefined && position.x !== undefined) ? position.x : 0;
      var y = (position !== undefined && position.y !== undefined) ? position.y : 0;
      var z = (position !== undefined && position.z !== undefined) ? position.z : 0;

      if(this.origin.x != x && this.origin.y != y && this.origin.z != z){
        this.origin = {x: x, y: y, z: z};
        removePlane({ removeXZ: true, removeXY: true, removeYZ: true });
        return this._draw3DCoordSys({ drawXZ: true, drawXY: true, drawYZ: true });
      }
    }
  }, {
    key: "setOriginAndResize",
    value: function setOriginAndResize(args) {
      var xOrigin = (args.origin !== undefined && args.origin.x !== undefined) ? args.origin.x : 0;
      var yOrigin = (args.origin !== undefined && args.origin.y !== undefined) ? args.origin.y : 0;
      var zOrigin = (args.origin !== undefined && args.origin.z !== undefined) ? args.origin.z : 0;
      var step = (args.step !== undefined) ? args.step : this.step;
      var stepSubDivisions = (args.stepSubDivisions !== undefined) ? args.stepSubDivisions : this.stepSubDivisions;

      if(this.origin.x != x && this.origin.y != y && this.origin.z != z){
        this.origin = {x: x, y: y, z: z};
        this.step = step;
        this.stepSubDivisions = stepSubDivisions;

        removePlane({ removeXZ: true, removeXY: true, removeYZ: true });
        return this._draw3DCoordSys({ drawXZ: true, drawXY: true, drawYZ: true });
      }
    }
  }, {
    key: "resizeXZ",
    value: function resize(width, length) {
      if (width && length) {
        this.xzWidth = width;
        this.xzLength = length;

        removePlane({removeXZ: true});
        return this._draw3DCoordSys({drawXZ: true});
      }
    }
  }, {
    key: "resizeXY",
    value: function resize(width, length) {
      if (width && length) {
        this.xyWidth = width;
        this.xyLength = length;

        removePlane({removeXY: true});
        return this._draw3DCoordSys({drawXY: true});
      }
    }
  }, {
    key: "resizeYZ",
    value: function resize(width, length) {
      if (width && length) {
        this.yzWidth = width;
        this.yzLength = length;

        removePlane({removeYZ: true});
        return this._draw3DCoordSys({drawYZ: true});
      }
    }
  }]);

  return CoordSys3D;
}(THREE.Object3D);

export { CoordSys3D }
