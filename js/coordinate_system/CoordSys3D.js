/**
 * @author Abraham Cardenas / https://github.com/Abe-Crdns
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

    var xAxisColor = (args !== undefined && args.xAxisColor !== undefined) ? args.xAxisColor : 0xff0000;
    var yAxisColor = (args !== undefined && args.yAxisColor !== undefined) ? args.yAxisColor : 0x00ff00;
    var zAxisColor = (args !== undefined && args.zAxisColor !== undefined) ? args.zAxisColor : 0x0000ff;

    var xzSubGridColor = (args !== undefined && args.xzSubGridColor !== undefined) ? args.xzSubGridColor : 0x707070;
    var xySubGridColor = (args !== undefined && args.xySubGridColor !== undefined) ? args.xySubGridColor : 0x707070;
    var yzSubGridColor = (args !== undefined && args.yzSubGridColor !== undefined) ? args.yzSubGridColor : 0x707070;

    var xzOpacity = (args !== undefined && args.xzOpacity !== undefined) ? args.xzOpacity : 0.5;
    var xyOpacity = (args !== undefined && args.xyOpacity !== undefined) ? args.xyOpacity : 0.5;
    var yzOpacity = (args !== undefined && args.yzOpacity !== undefined) ? args.yzOpacity : 0.5;

    var step = (args !== undefined && args.step !== undefined) ? args.step : 5;
    var stepSubDivisions = (args !== undefined && args.stepSubDivisions !== undefined) ? args.stepSubDivisions : 10;

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

    _this.xzOpacity = xzOpacity;
    _this.xyOpacity = xyOpacity;
    _this.yzOpacity = yzOpacity;

    _this.xAxisColor = xAxisColor;
    _this.yAxisColor = yAxisColor;
    _this.zAxisColor = zAxisColor;

    _this.xzSubGridColor = xzSubGridColor;
    _this.xySubGridColor = xySubGridColor;
    _this.yzSubGridColor = yzSubGridColor;

    _this.step = step;
    _this.stepSubDivisions = stepSubDivisions;

    _this.text = text;
    _this.textColor = textColor;

    _this.name = "";

    _this._draw3DCoordSys({
      drawXZ: drawXZ,
      drawXY: drawXY,
      drawYZ: drawYZ
    });

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
        this.xzGridGeometry1 = new THREE.Geometry();
        this.xzGridGeometry2 = new THREE.Geometry();
        this.xzSubGridGeometry = new THREE.Geometry();
      }

      if(drawXY){
        this.xyGridGeometry1 = new THREE.Geometry();
        this.xyGridGeometry2 = new THREE.Geometry();
        this.xySubGridGeometry = new THREE.Geometry();
      }

      if(drawYZ){
        this.yzGridGeometry1 = new THREE.Geometry();
        this.yzGridGeometry2 = new THREE.Geometry();
        this.yzSubGridGeometry = new THREE.Geometry();
      }

      if(this.xzWidth == this.xyWidth && this.xzWidth == this.yzWidth && this.xyWidth == this.yzWidth &&
         this.xzLength == this.xyLength && this.xzLength == this.yzLength && this.xyLength == this.yzLength){
        this.computeGridVertices({
          computeXZ: true,
          computeXY: true,
          computeYZ: true,
          width: this.xzWidth,
          length: this.xzLength
        });
      }
      else if(this.xzWidth == this.xyWidth && this.xzLength == this.xyLength){
        this.computeGridVertices({
          computeXZ: true,
          computeXY: true,
          width: this.xzWidth,
          length: this.xzLength
        });
        this.computeGridVertices({
          computeYZ: true,
          width: this.yzWidth,
          length: this.yzLength
        });
      }
      else if(this.xzWidth == this.yzWidth && this.xzLength == this.yzLength){
        this.computeGridVertices({
          computeXZ: true,
          computeYZ: true,
          width: this.xzWidth,
          length: this.xzLength
        });
        this.computeGridVertices({
          computeXY: true,
          width: this.xyWidth,
          length: this.xyLength
        });
      }
      else if(this.xyWidth == this.yzWidth && this.xyLength == this.yzLength){
        this.computeGridVertices({
          computeXY: true,
          computeYZ: true,
          width: this.xyWidth,
          length: this.xyLength
        });
        this.computeGridVertices({
          computeXZ: true,
          width: this.xyWidth,
          length: this.xyLength
        });
      }
      else{
        this.computeGridVertices({
          computeXZ: true,
          width: this.xzWidth,
          length: this.xzLength
        });
        this.computeGridVertices({
          computeXY: true,
          width: this.xyWidth,
          length: this.xyLength
        });
        this.computeGridVertices({
          computeYZ: true,
          width: this.yzWidth,
          length: this.yzLength
        });
      }

      var xzUpVector = new THREE.Vector3().fromArray([0, 1, 0]);
      var xyUpVector = new THREE.Vector3().fromArray([0, 0, 1]);
      var yzUpVector = new THREE.Vector3().fromArray([-1, 0, 0]);

      if(drawXZ){
        var xzGridMaterial1 = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.zAxisColor),
          opacity: this.xzOpacity,
          linewidth: 2,
          transparent: true
        });
        var xzGridMaterial2 = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.xAxisColor),
          opacity: this.xzOpacity,
          linewidth: 2,
          transparent: true
        });
        var xzSubGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.xzSubGridColor),
          opacity: this.xzOpacity / 2,
          linewidth: 2,
          transparent: true
        });

        this.xzMainGrid1 = new THREE.LineSegments(this.xzGridGeometry1, xzGridMaterial1);
        this.xzMainGrid2 = new THREE.LineSegments(this.xzGridGeometry2, xzGridMaterial2);
        this.xzSubGrid = new THREE.LineSegments(this.xzSubGridGeometry, xzSubGridMaterial);

        this.xzMainGrid1.lookAt(xzUpVector);
        this.xzMainGrid2.lookAt(xzUpVector);
        this.xzSubGrid.lookAt(xzUpVector);

        this.add(this.xzMainGrid1);
        this.add(this.xzMainGrid2);
        this.add(this.xzSubGrid);
      }

      if(drawXY){
        var xyGridMaterial1 = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.yAxisColor),
          opacity: this.xyOpacity,
          linewidth: 2,
          transparent: true
        });
        var xyGridMaterial2 = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.xAxisColor),
          opacity: this.xyOpacity,
          linewidth: 2,
          transparent: true
        });
        var xySubGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.xySubGridColor),
          opacity: this.xyOpacity / 2,
          linewidth: 2,
          transparent: true
        });

        this.xyMainGrid1 = new THREE.LineSegments(this.xyGridGeometry1, xyGridMaterial1);
        this.xyMainGrid2 = new THREE.LineSegments(this.xyGridGeometry2, xyGridMaterial2);
        this.xySubGrid = new THREE.LineSegments(this.xySubGridGeometry, xySubGridMaterial);

        this.xyMainGrid1.lookAt(xyUpVector);
        this.xyMainGrid2.lookAt(xyUpVector);
        this.xySubGrid.lookAt(xyUpVector);

        this.add(this.xyMainGrid1);
        this.add(this.xyMainGrid2);
        this.add(this.xySubGrid);
      }

      if(drawYZ){
        var yzGridMaterial1 = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.yAxisColor),
          opacity: this.xzOpacity,
          linewidth: 2,
          transparent: true
        });
        var yzGridMaterial2 = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.zAxisColor),
          opacity: this.xzOpacity,
          linewidth: 2,
          transparent: true
        });
        var yzSubGridMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHex(this.yzSubGridColor),
          opacity: this.xzOpacity / 2,
          linewidth: 2,
          transparent: true
        });

        this.yzMainGrid1 = new THREE.LineSegments(this.yzGridGeometry1, yzGridMaterial1);
        this.yzMainGrid2 = new THREE.LineSegments(this.yzGridGeometry2, yzGridMaterial2);
        this.yzSubGrid = new THREE.LineSegments(this.yzSubGridGeometry, yzSubGridMaterial);

        this.yzMainGrid1.lookAt(yzUpVector);
        this.yzMainGrid2.lookAt(yzUpVector);
        this.yzSubGrid.lookAt(yzUpVector);

        this.add(this.yzMainGrid1);
        this.add(this.yzMainGrid2);
        this.add(this.yzSubGrid);
      }

      var xAxisGeometry = new LineGeometry();
      var yAxisGeometry = new LineGeometry();
      var zAxisGeometry = new LineGeometry();
      var xRayLineGeometry1 = new LineGeometry();
      var xRayLineGeometry2 = new LineGeometry();
      var yRayLineGeometry1 = new LineGeometry();
      var yRayLineGeometry2 = new LineGeometry();
      var zRayLineGeometry1 = new LineGeometry();
      var zRayLineGeometry2 = new LineGeometry();

      xAxisGeometry.setPositions([
        this.origin.x, this.origin.y, this.origin.z,
        this.xyLength + this.origin.x, this.origin.y, this.origin.z
      ]);
      yAxisGeometry.setPositions([
        this.origin.x, this.origin.y, this.origin.z,
        this.origin.x, this.xyLength + this.origin.y, this.origin.z
      ]);
      zAxisGeometry.setPositions([
        this.origin.x, this.origin.y, this.origin.z,
        this.origin.x, this.origin.y, this.yzLength + this.origin.z
      ]);

      var xAxisColor = hexToRgb(this.xAxisColor);
      var yAxisColor = hexToRgb(this.yAxisColor);
      var zAxisColor = hexToRgb(this.zAxisColor);

      var xDirColors = [
        xAxisColor.r, xAxisColor.g, xAxisColor.b,
        xAxisColor.r, xAxisColor.g, xAxisColor.b
      ];
      var yDirColors = [
        yAxisColor.r, yAxisColor.g, yAxisColor.b,
        yAxisColor.r, yAxisColor.g, yAxisColor.b
      ];
      var zDirColors = [
        zAxisColor.r, zAxisColor.g, zAxisColor.b,
        zAxisColor.r, zAxisColor.g, zAxisColor.b
      ];

      xAxisGeometry.setColors(xDirColors);
      xRayLineGeometry1.setColors(xDirColors);
      xRayLineGeometry2.setColors(xDirColors);
      yAxisGeometry.setColors(yDirColors);
      yRayLineGeometry1.setColors(yDirColors);
      yRayLineGeometry2.setColors(yDirColors);
      zAxisGeometry.setColors(zDirColors);
      zRayLineGeometry1.setColors(zDirColors);
      zRayLineGeometry2.setColors(zDirColors);

      var axisThickLineMaterial = new LineMaterial({
        color: 0xffffff,
        linewidth: 5,
        vertexColors: THREE.VertexColors,
        dashed: false
      });

      var raylineThickLineMaterial = new LineMaterial({
        color: 0xffffff,
        linewidth: 2,
        vertexColors: THREE.VertexColors,
        dashed: false
      });

      this.xAxisMat = axisThickLineMaterial;
      this.yAxisMat = axisThickLineMaterial;
      this.zAxisMat = axisThickLineMaterial;
      this.xRayLineMat1 = raylineThickLineMaterial;
      this.xRayLineMat2 = raylineThickLineMaterial;
      this.yRayLineMat1 = raylineThickLineMaterial;
      this.yRayLineMat2 = raylineThickLineMaterial;
      this.zRayLineMat1 = raylineThickLineMaterial;
      this.zRayLineMat2 = raylineThickLineMaterial;

      this.xAxis = new Line2( xAxisGeometry, axisThickLineMaterial );
      this.yAxis = new Line2( yAxisGeometry, axisThickLineMaterial );
      this.zAxis = new Line2( zAxisGeometry, axisThickLineMaterial );
      this.xRayLine1 = new Line2( xRayLineGeometry1, raylineThickLineMaterial );
      this.xRayLine2 = new Line2( xRayLineGeometry2, raylineThickLineMaterial );
      this.yRayLine1 = new Line2( yRayLineGeometry1, raylineThickLineMaterial );
      this.yRayLine2 = new Line2( yRayLineGeometry2, raylineThickLineMaterial );
      this.zRayLine1 = new Line2( zRayLineGeometry1, raylineThickLineMaterial );
      this.zRayLine2 = new Line2( zRayLineGeometry2, raylineThickLineMaterial );

      this.xAxisArrow = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(this.origin.x, this.origin.y, this.origin.z),
        this.xzLength + this.xzLength/10,
        this.xAxisColor,
        this.xzLength * 0.1,
        this.xzLength * 0.03
      );
      this.yAxisArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(this.origin.x, this.origin.y, this.origin.z),
        this.xyLength + this.xzLength/10,
        this.yAxisColor,
        this.xyLength * 0.1,
        this.xyLength * 0.03
      );
      this.zAxisArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(this.origin.x, this.origin.y, this.origin.z),
        this.yzLength + this.xzLength/10,
        this.zAxisColor,
        this.yzLength * 0.1,
        this.yzLength * 0.03
      );

      this.xAxis.computeLineDistances();
      this.yAxis.computeLineDistances();
      this.zAxis.computeLineDistances();

      this.xAxis.scale.set( 1, 1, 1 );
      this.yAxis.scale.set( 1, 1, 1 );
      this.zAxis.scale.set( 1, 1, 1 );

      this.xRayLine1.visible = false;
      this.xRayLine2.visible = false;
      this.yRayLine1.visible = false;
      this.yRayLine2.visible = false;
      this.zRayLine1.visible = false;
      this.zRayLine2.visible = false;

      this.add(this.xAxis);
      this.add(this.yAxis);
      this.add(this.zAxis);
      this.add(this.xRayLine1);
      this.add(this.xRayLine2);
      this.add(this.yRayLine1);
      this.add(this.yRayLine2);
      this.add(this.zRayLine1);
      this.add(this.zRayLine2);
      this.add(this.xAxisArrow);
      this.add(this.yAxisArrow);
      this.add(this.zAxisArrow);
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
            var pt1 = new THREE.Vector3(this.origin.x, i - this.origin.z, this.origin.y);
            var pt2 = new THREE.Vector3(length + this.origin.x, i - this.origin.z, this.origin.y);
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
            var pt1 = new THREE.Vector3(this.origin.z, -i + this.origin.y, -this.origin.x);
            var pt2 = new THREE.Vector3(length + this.origin.z, -i + this.origin.y, -this.origin.x);
            this.yzSubGridGeometry.vertices.push(pt1);
            this.yzSubGridGeometry.vertices.push(pt2);
          }

          if (i % step == 0) {
            if(computeXZ){
              var pt1 = new THREE.Vector3(this.origin.x, i - this.origin.z, this.origin.y);
              var pt2 = new THREE.Vector3(length + this.origin.x, i - this.origin.z, this.origin.y);
              this.xzGridGeometry1.vertices.push(pt1);
              this.xzGridGeometry1.vertices.push(pt2);
            }

            if(computeXY){
              var pt1 = new THREE.Vector3(this.origin.x, -i + this.origin.y, this.origin.z);
              var pt2 = new THREE.Vector3(length + this.origin.x, -i + this.origin.y, this.origin.z);
              this.xyGridGeometry1.vertices.push(pt1);
              this.xyGridGeometry1.vertices.push(pt2);
            }

            if(computeYZ){
              var pt1 = new THREE.Vector3(this.origin.z, -i + this.origin.y, -this.origin.x);
              var pt2 = new THREE.Vector3(length + this.origin.z, -i + this.origin.y, -this.origin.x);
              this.yzGridGeometry1.vertices.push(pt1);
              this.yzGridGeometry1.vertices.push(pt2);
            }
          }
        }

        for(var i = step / stepSubDivisions; i <= length; i += step / stepSubDivisions){
          if(computeXZ){
            var pt1 = new THREE.Vector3(i + this.origin.x, -width - this.origin.z, this.origin.y);
            var pt2 = new THREE.Vector3(i + this.origin.x, -this.origin.z, this.origin.y);
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
            var pt1 = new THREE.Vector3(i + this.origin.z, width + this.origin.y, -this.origin.x);
            var pt2 = new THREE.Vector3(i + this.origin.z, this.origin.y, -this.origin.x);
            this.yzSubGridGeometry.vertices.push(pt1);
            this.yzSubGridGeometry.vertices.push(pt2);
          }

          if (i % step == 0) {
            if(computeXZ){
              var pt1 = new THREE.Vector3(i + this.origin.x, -width - this.origin.z, this.origin.y);
              var pt2 = new THREE.Vector3(i + this.origin.x, -this.origin.z, this.origin.y);
              this.xzGridGeometry2.vertices.push(pt1);
              this.xzGridGeometry2.vertices.push(pt2);
            }

            if(computeXY){
              var pt1 = new THREE.Vector3(i + this.origin.x, width + this.origin.y, this.origin.z);
              var pt2 = new THREE.Vector3(i + this.origin.x, this.origin.y, this.origin.z);
              this.xyGridGeometry2.vertices.push(pt1);
              this.xyGridGeometry2.vertices.push(pt2);
            }

            if(computeYZ){
              var pt1 = new THREE.Vector3(i + this.origin.z, width + this.origin.y, -this.origin.x);
              var pt2 = new THREE.Vector3(i + this.origin.z, this.origin.y, -this.origin.x);
              this.yzGridGeometry2.vertices.push(pt1);
              this.yzGridGeometry2.vertices.push(pt2);
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

      if(removeXZ || removeXY || removeYZ){
        if(removeXZ){
          if(this.xzMainGrid1 !== undefined)
            this.remove(this.xzMainGrid1);
          if(this.xzMainGrid2 !== undefined)
            this.remove(this.xzMainGrid2);
          if(this.xzSubGrid !== undefined)
            this.remove(this.xzSubGrid);
        }
        if(removeXY){
          if(this.xyMainGrid1 !== undefined)
            this.remove(this.xyMainGrid1);
          if(this.xyMainGrid2 !== undefined)
            this.remove(this.xyMainGrid2);
          if(this.xySubGrid !== undefined)
            this.remove(this.xySubGrid);
        }
        if(removeYZ){
          if(this.yzMainGrid1 !== undefined)
            this.remove(this.yzMainGrid1);
          if(this.yzMainGrid2 !== undefined)
            this.remove(this.yzMainGrid2);
          if(this.yzSubGrid !== undefined)
            this.remove(this.yzSubGrid);
        }

        if(this.xAxis !== undefined)
          this.remove(this.xAxis);
        if(this.yAxis !== undefined)
          this.remove(this.yAxis);
        if(this.zAxis !== undefined)
          this.remove(this.zAxis);
        if(this.xRayLine1 !== undefined)
          this.remove(this.xRayLine1);
        if(this.xRayLine2 !== undefined)
          this.remove(this.xRayLine2);
        if(this.yRayLine1 !== undefined)
          this.remove(this.yRayLine1);
        if(this.yRayLine2 !== undefined)
          this.remove(this.yRayLine2);
        if(this.zRayLine1 !== undefined)
          this.remove(this.zRayLine1);
        if(this.zRayLine2 !== undefined)
          this.remove(this.zRayLine2);
        if(this.xAxisArrow !== undefined)
          this.remove(this.xAxisArrow);
        if(this.yAxisArrow !== undefined)
          this.remove(this.yAxisArrow);
        if(this.zAxisArrow !== undefined)
          this.remove(this.zAxisArrow);
      }
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

      if(this.origin.x != x || this.origin.y != y || this.origin.z != z){
        this.origin = {x: x, y: y, z: z};
        this.removeGrid({ removeXZ: true, removeXY: true, removeYZ: true });
        return this._draw3DCoordSys({ drawXZ: true, drawXY: true, drawYZ: true });
      }
    }
  }, {
    key: "setOriginAndResizeAll",
    value: function setOriginAndResizeAll(args) {
      var xOrigin = (args.origin !== undefined && args.origin.x !== undefined) ? args.origin.x : 0;
      var yOrigin = (args.origin !== undefined && args.origin.y !== undefined) ? args.origin.y : 0;
      var zOrigin = (args.origin !== undefined && args.origin.z !== undefined) ? args.origin.z : 0;

      var xzWidth = (args !== undefined && args.xzWidth !== undefined) ? args.xzWidth : 5;
      var xyWidth = (args !== undefined && args.xyWidth !== undefined) ? args.xyWidth : 5;
      var yzWidth = (args !== undefined && args.yzWidth !== undefined) ? args.yzWidth : 5;

      var xzLength = (args !== undefined && args.xzLength !== undefined) ? args.xzLength : 5;
      var xyLength = (args !== undefined && args.xyLength !== undefined) ? args.xyLength : 5;
      var yzLength = (args !== undefined && args.yzLength !== undefined) ? args.yzLength : 5;

      var step = (args.step !== undefined) ? args.step : 5;
      var stepSubDivisions = (args.stepSubDivisions !== undefined) ? args.stepSubDivisions : 5;

      if(this.origin.x != xOrigin || this.origin.y != yOrigin || this.origin.z != zOrigin){

        this.origin = {x: xOrigin, y: yOrigin, z: zOrigin};

        this.xzWidth = xzWidth;
        this.xyWidth = xyWidth;
        this.yzWidth = yzWidth;

        this.xzLength = xzLength;
        this.xyLength = xyLength;
        this.yzLength = yzLength;

        this.step = step;
        this.stepSubDivisions = stepSubDivisions;

        this.removeGrid({ removeXZ: true, removeXY: true, removeYZ: true });
        return this._draw3DCoordSys({ drawXZ: true, drawXY: true, drawYZ: true });
      }
    }
  }, {
    key: "resizeXZ",
    value: function resizeXZ(width, length) {
      var width = (args.width !== undefined && args.width !== undefined) ? args.width : 5;
      var length = (args.length !== undefined && args.length !== undefined) ? args.length : 5;

      this.xzWidth = width;
      this.xzLength = length;

      this.removeGrid({removeXZ: true});
      return this._draw3DCoordSys({drawXZ: true});
    }
  }, {
    key: "resizeXY",
    value: function resizeXY(width, length) {
      var width = (args.width !== undefined && args.width !== undefined) ? args.width : 5;
      var length = (args.length !== undefined && args.length !== undefined) ? args.length : 5;

      this.xyWidth = width;
      this.xyLength = length;

      this.removeGrid({removeXY: true});
      return this._draw3DCoordSys({drawXY: true});
    }
  }, {
    key: "resizeYZ",
    value: function resizeYZ(width, length) {
      var width = (args.width !== undefined && args.width !== undefined) ? args.width : 5;
      var length = (args.length !== undefined && args.length !== undefined) ? args.length : 5;

      this.yzWidth = width;
      this.yzLength = length;

      this.removeGrid({removeYZ: true});
      return this._draw3DCoordSys({drawYZ: true});
    }
  }]);

  return CoordSys3D;
}(THREE.Object3D);

export { CoordSys3D }
