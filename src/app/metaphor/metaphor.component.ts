import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { DEM } from './dem'
import { DEMLoaderService } from './demloader.service';
import { SRSChooserService } from '../srschooser.service';
import { SRS } from '../definitions';
import { Subscription } from 'rxjs/Subscription';
import { PartsSelectorService } from '../partsselector.service';
import { AppComponent } from '../app.component';

declare var require: any;
let THREE = require('three');
let TrackballControls = require('three-trackballcontrols');
let LUT = require('three-lut');

@Component({
  selector: 'app-metaphor',
  templateUrl: './metaphor.component.html',
  styleUrls: ['./metaphor.component.css'],
  providers: [DEMLoaderService]
})

export class MetaphorComponent implements OnInit {

  graphDimensions = {
    w: 380,	// depth
    d: 380,	// width
    h: 80	  // height
  };

  actualData: DEM;
  actualMapPlane = new THREE.Mesh();
  actualGeometry: THREE.PlaneGeometry;

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ alpha: true, sortObjects: false });
  light = new THREE.AmbientLight(0xffffff);
  camera;
  controls;

  // Declaring plane so the rotation can be set in animate function
  variableMapPlane = new THREE.Mesh();
  variableGeometry = new THREE.PlaneGeometry(this.graphDimensions.w, this.graphDimensions.d, 379, 379);

  rotation = 0;

  lut;
  legendLayout;
  colorMap = 'rainbow';
  numberOfColors = 512;

  // variables for select and click object
  cloudsTargetList = [];
  bluePosList = []; yellowPosList = []; redPosList = [];
  mouse = { x: 0, y: 0 };
  raycaster;

  // Subscription variables
  subscription: Subscription;
  partssubscription: Subscription;

  constructor(
    private demloaderService: DEMLoaderService,
    private srsChooserService: SRSChooserService,
    private partsSelector: PartsSelectorService,
    @Inject(forwardRef(() => AppComponent)) app: AppComponent) {

    this.actualGeometry = new THREE.PlaneGeometry(this.graphDimensions.w, this.graphDimensions.d, 379, 379);

    this.subscription = this.srsChooserService.getSRS().subscribe(srs => {
      // remove any objects left
      this.removeClouds();
      this.removeBlackClouds();
      this.removeBarriers();
      this.removeRegionLabel();
      this.removeBluePos();

      // some checking
      console.log('CHECKING new received srs data on Metaphor Component with name: ' + srs.quality[1].data);
      console.log('CHECKING length of quality data: ' + srs.quality[1].data.length);

      this.applyCompletenessOnGoemetry(srs.quality[1].data);
      this.actualMapPlane.geometry.dispose();
      this.actualMapPlane.geometry = this.variableGeometry.clone();
      this.actualMapPlane.geometry.buffersNeedUpdate = true;
      // In this overall, barriers not needed
      this.removeBarriers();

      // add clouds (unambiguity)
      this.addClouds(srs.quality[0].data);
      // add black clouds (consistency)
      this.addBlackClouds(srs.quality[2].data);
      // in this overall, bluepos not needed
      // this.addBluePos(srs.quality[1].data);

      //this.applyOverallCompletenessOnGoemetry(this.getOverall(srs.quality[1].data));
      //this.actualMapPlane.geometry.dispose();
      //this.actualMapPlane.geometry = this.variableGeometry.clone();
      //this.actualMapPlane.geometry.buffersNeedUpdate = true;
      //this.insertFogToScene(this.getOverall(srs.quality[0].data));

      //let chart = app.getChart();

      //console.log(chart.wrapper);

      //select overal chart not yet implemented
      //chart.wrapper.getDataTable.setSelection([{row: 1, column: 0}]);
    });

    this.partssubscription = this.partsSelector.getParts().subscribe(partsSelected => {
      console.log('CHECKING new received parts name on Metaphor Component with name: ' + partsSelected.name);
      console.log('CHECKING new received parts quality on Metaphor Component with quality: ' + partsSelected.quality[1].data);

      this.applyCompletenessOnGoemetry(partsSelected.quality[1].data);
      this.actualMapPlane.geometry.dispose();
      this.actualMapPlane.geometry = this.variableGeometry.clone();
      this.actualMapPlane.geometry.buffersNeedUpdate = true;
      this.addRegionLabel(partsSelected.label);

      // add clouds (unambiguity)
      this.addClouds(partsSelected.quality[0].data);
      // add black clouds (consistency)
      this.addBlackClouds(partsSelected.quality[2].data);

      // add blue position (completeness)
      this.addBluePos(partsSelected.quality[1].data);
      console.log('---> BLUEPOS data: ' + partsSelected.quality[1].data);
      // add blue position (completeness)
      this.addYellowPos(partsSelected.quality[0].data);
      console.log('---> YELLOWPOS data: ' + partsSelected.quality[0].data);
      // add blue position (completeness)
      this.addRedPos(partsSelected.quality[2].data);
      console.log('---> REDPOS data: ' + partsSelected.quality[2].data);

      // temporary removing fog from scene
      //this.removeFogFromScene();
    });
  }

  /*
  FUNCTION generating initial map, set Variables {actualGeometry, actualMapPlane}
  */
  generateInitialMap(dataDem: DEM) {
    console.log("BEGIN process of generating initial map on:", new Date().getTime());

    let screenWidth = document.getElementById("mapcontainer").offsetWidth;
    let screenHeight = document.getElementById("mapcontainer").offsetHeight;

    console.log("Screen area, width: " + screenWidth + ", and height : " + screenHeight);

    this.renderer.setSize(screenWidth, screenHeight);
    this.renderer.setClearColor(0xffffff, 0);
    document.getElementById("mapcontainer").appendChild(this.renderer.domElement);

    // Axis helper for development
    var axis = new THREE.AxisHelper(200);
    this.scene.add(axis);

    // raycaster
    this.raycaster = new THREE.Raycaster();

    // adding light
    this.scene.add(this.light);

    // adding initial fog
    //this.scene.fog = new THREE.Fog(0xffffff, 0.1, 0); //(color, near. far), set it behind the camera, invisible

    //setting up camera
    this.camera = new THREE.PerspectiveCamera(
      35,
      this.renderer.domElement.clientWidth / this.renderer.domElement.clientHeight,
      1,
      1000
    );
    this.camera.position.set(0, -100, 80);
    this.scene.add(this.camera);

    //Creating geometry
    this.actualGeometry = new THREE.PlaneGeometry(this.graphDimensions.w, this.graphDimensions.d, 379, 379);
    console.log('CHECKING length of actual geometry: ' + this.actualGeometry.vertices.length);
    for (var i = 0, l = this.actualGeometry.vertices.length; i < l; i++) {
      this.actualGeometry.vertices[i].z = dataDem.data[i] / 65535 * 1024;
      this.variableGeometry.vertices[i].z = dataDem.data[i] / 65535 * 1024;
    }
    this.actualGeometry.boundingSphere = null;
    this.actualGeometry.boundingBox = null;
    this.variableGeometry.boundingSphere = null;
    this.variableGeometry.boundingBox = null;
    console.log("End copying data to geometry.vertices on :", new Date().getTime());

    // Creating material
    var material = new THREE.MeshPhongMaterial({
      //side: THREE.DoubleSide,
      //wireframe : true
      map: THREE.ImageUtils.loadTexture('assets/maps/fuji/fujinewplussnow.jpg')
    });

    this.actualMapPlane = new THREE.Mesh(this.variableGeometry, material);
    this.actualMapPlane.scale.set(0.6, 0.6, 0.6);
    this.scene.add(this.actualMapPlane);

    this.controls = new TrackballControls(this.camera, this.renderer.domElement);

    this.animate();

    // bind to window resizes
    window.addEventListener('resize', _ => this.onResize());
    document.getElementById("toggle-fullscreen").addEventListener('click', _ => this.onResize());

    // add event control for rotation
    document.getElementById("btn-rotate-backward").addEventListener('click', _ => this.onRotateBackward());
    document.getElementById("btn-rotate-stop").addEventListener('click', _ => this.onRotateStop());
    document.getElementById("btn-rotate-forward").addEventListener('click', _ => this.onRotateForward());

    // add event for mouse on object
    document.getElementById("mapcontainer").addEventListener('click', _ => this.onMetaphorClick(event));
    document.getElementById("mapcontainer").addEventListener('mouseover', _ => this.onMetaphorMouseOver(event));

    console.log("FINISH process of generating initial map on:", new Date().getTime());
  }

  /*
  FUNCTION animate
  */
  public animate() {
    window.requestAnimationFrame(_ => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    // this must be done inside animate function
    this.actualMapPlane.rotation.z += this.rotation;
    this.variableMapPlane.rotation.z += this.rotation;
  }

  /*
  FUNCTION Resize the mapcontainer
  */
  public onResize() {
    // using the panel-body size, inheriting on mapcontainer doesnt work, maybe this is not the best approach
    const width = document.getElementById("metaphor").offsetWidth;
    const height = document.getElementById("metaphor").offsetHeight;
    // so we need to adjust the mapcontainer also
    document.getElementById("mapcontainer").style.width = width.toString() + "px";
    document.getElementById("mapcontainer").style.height = height.toString() + "px";
    // and we also need to adjust the pdf Frame also (unable to update size from app component, so here it is ;))
    document.getElementById("pdfFrame").style.width = width.toString() + "px";
    document.getElementById("pdfFrame").style.height = height.toString() + "px";

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  /*
  FUNCTION Rotate Backward
  */
  public onRotateBackward() {
    console.log("Rotate Backward");
    this.rotation = -0.01;
  }

  /*
  FUNCTION Rotate Stop
  */
  public onRotateStop() {
    console.log("Rotate Stop");
    this.rotation = 0;
  }

  /*
  FUNCTION Rotate Forward
  */
  public onRotateForward() {
    console.log("Rotate Forward");
    this.rotation = 0.01;
  }

  /*
  FUNCTION Click on Metaphor
  */
  public onMetaphorClick(event) {
    event.preventDefault();
    // update the mouse variable
    console.log('TOP : ' + this.renderer.domElement.getBoundingClientRect().top + 
    ', BOTTOM : ' + this.renderer.domElement.getBoundingClientRect().bottom +
    ', LEFT : ' + this.renderer.domElement.getBoundingClientRect().left +
    ', RIGHT : ' + this.renderer.domElement.getBoundingClientRect().right
    );

    console.log('MOUSE TOP >>>>>>> ' + event.clientY);
    console.log('MOUSE LEFT >>>>>>> ' + event.clientX);
    let rect = this.renderer.domElement.getBoundingClientRect();
    console.log('Renderer WIDTH >>>>>>> ' + rect.width);
    console.log('Renderer HEIGHT >>>>>>> ' + rect.height);
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
    //this.mouse.x = (event.offsetX / rect.width) * 2 - 1;
    //this.mouse.y = - (event.offsetY / rect.height) * 2 + 1;

    let mouse3D = new THREE.Vector3(this.mouse.x, this.mouse.y, 1.0);

    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    this.raycaster.setFromCamera(mouse3D.normalize(), this.camera);

    // create an array containing all objects in the scene with which the ray intersects
    var intersectsBlue = this.raycaster.intersectObjects(this.bluePosList);

    // if there is one (or more) intersections
    if (intersectsBlue.length > 0) {
      console.log("Hit @ " + intersectsBlue[0].point.toString());
      console.log("Hit @ " + intersectsBlue[0].object.name + ' from targetList: ' + this.bluePosList.length);
      //intersectsBlue[0].object.material.color.setHex(Math.random() * 0xffffff);
      alert(intersectsBlue[0].object.name + ' clicked');
    }

    // create an array containing all objects in the scene with which the ray intersects
    var intersectsYellow = this.raycaster.intersectObjects(this.yellowPosList);

    // if there is one (or more) intersections
    if (intersectsYellow.length > 0) {
      console.log("Hit @ " + intersectsYellow[0].point.toString());
      console.log("Hit @ " + intersectsYellow[0].object.name + ' from targetList: ' + this.yellowPosList.length);
      alert(intersectsYellow[0].object.name + ' clicked');
    }

    // create an array containing all objects in the scene with which the ray intersects
    var intersectsRed = this.raycaster.intersectObjects(this.redPosList);

    // if there is one (or more) intersections
    if (intersectsRed.length > 0) {
      console.log("Hit @ " + intersectsRed[0].point.toString());
      console.log("Hit @ " + intersectsRed[0].object.name + ' from targetList: ' + this.redPosList.length);
      alert(intersectsRed[0].object.name + ' clicked');
    }
  }

  /*
    FUNCTION Click on Metaphor
    */
  public onMetaphorMouseOver(event) {
    event.preventDefault();
    // update the mouse variable
    let rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

    let mouse3D = new THREE.Vector3(this.mouse.x, this.mouse.y, 1.0);

    // create a Ray with origin at the mouse position
    // and direction into the scene (camera direction)
    this.raycaster.setFromCamera(mouse3D.normalize(), this.camera);

    // create an array containing all objects in the scene with which the ray intersects
    var intersectsBlue = this.raycaster.intersectObjects(this.bluePosList);

    // if there is one (or more) intersections
    if (intersectsBlue.length > 0) {
      console.log("Hovering @ " + intersectsBlue[0].object.name);
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }

    // create an array containing all objects in the scene with which the ray intersects
    var intersectsYellow = this.raycaster.intersectObjects(this.yellowPosList);

    // if there is one (or more) intersections
    if (intersectsYellow.length > 0) {
      console.log("Hovering @ " + intersectsYellow[0].object.name);
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }

    // create an array containing all objects in the scene with which the ray intersects
    var intersectsRed = this.raycaster.intersectObjects(this.redPosList);

    // if there is one (or more) intersections
    if (intersectsRed.length > 0) {
      console.log("Hovering @ " + intersectsRed[0].object.name);
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
  }

  /*
  FUNCTION Cleaning the scene
  */
  cleanScene() {
    var elementsInTheScene = this.scene.children.length;

    for (var i = elementsInTheScene - 1; i > 0; i--) {
      if (this.scene.children[i].name !== 'camera' &&
        this.scene.children[i].name !== 'ambientLight' &&
        this.scene.children[i].name !== 'directionalLight') {
        this.scene.remove(this.scene.children[i]);
      }
    }
  }

  /*
  FUNCTION generating map Object
  */
  applyCompletenessOnGoemetry(quality: Array<number>) {
    console.log("BEGIN apply completeness on every region of geometry on:", new Date().getTime());

    // some variables
    let n = 380; // width of matrix

    // getting number of region
    let numberOfRegion = quality.length;
    console.log('CHECKING number of region: ' + numberOfRegion);

    // creating barrier
    this.addBarriers(numberOfRegion);

    // calculating angle, right now they have same size, later should be improved to accomodate content size or importancy
    let angle = 360 / numberOfRegion;
    console.log('CHECKING angle each region: ' + angle);

    // determining zero point in Cartesian coordinate, matrix size 380 x 380
    let p1 = {
      x: 0,
      y: 0
    };

    const minData: number = 500;
    const maxData: number = 3770;
    let maxAllowed: number;
    let maxAllowedOnGeometry: number;
    let maxInRegion: Array<number> = new Array(numberOfRegion);
    for (let iterator = 0; iterator < numberOfRegion; iterator++) {
      maxAllowed = minData + (maxData - minData) * quality[iterator];
      maxAllowedOnGeometry = maxAllowed / 65535 * 1024;
      maxInRegion[iterator] = maxAllowedOnGeometry;
    }
    console.log('CHECKING max allowed in each region:' + maxInRegion);

    // iterating each point to determine its angle by its relation to zero point
    // and then by the angle, decide the point region.
    // last, apply the quality
    for (let i = 0, l = this.actualGeometry.vertices.length; i < l; i++) {

      // getting point position in matrix (threejs geometry is just long array, nor actually a matrix)
      let matrixPosition = {
        row: Math.floor(i / n) + 1,   // where "/" is an integer division, so in javascript need to use Math.floor
        col: (i % n) + 1   // % is the "modulo operator", the remainder of i / width;
      };

      // DEBUGGING Purpose
      // if(i == 0 || i == 179 || i == (this.actualGeometry.vertices.length) - 1){
      //  console.log('DEBUGGING vertice position: ' + i);
      //  console.log('DEBUGGING matrix position: (' + matrixPosition.row + ', ' + matrixPosition.col + ')');
      // }

      // convert the indices to Cartesian coordinate
      let candidateX, candidateY: number;
      // condition that apply for even matrix
      // region I
      if (matrixPosition.row <= n / 2 && matrixPosition.col > n / 2) {
        candidateX = matrixPosition.col - (n / 2);
        candidateY = - matrixPosition.row + ((n + 2) / 2);
      }
      // region II
      if (matrixPosition.row <= n / 2 && matrixPosition.col <= n / 2) {
        candidateX = matrixPosition.col - ((n + 2) / 2);
        candidateY = - matrixPosition.row + ((n + 2) / 2);
      }
      // region III
      if (matrixPosition.row > n / 2 && matrixPosition.col <= n / 2) {
        candidateX = matrixPosition.col - ((n + 2) / 2);
        candidateY = - matrixPosition.row + (n / 2);
      }
      // region IV
      if (matrixPosition.row > n / 2 && matrixPosition.col > n / 2) {
        candidateX = matrixPosition.col - (n / 2);
        candidateY = - matrixPosition.row + (n / 2);
      }

      // set to cartesianPosition variable
      let p2 = {
        x: candidateX,
        y: candidateY
      };

      // calculating angle a.k.a converting cartesian coordinate to polar coordinate
      let angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
      //let angleRadian = Math.atan2(p2.y, p2.x);

      if (angleDeg < 0)
        //angleDeg = (180 - Math.abs(angleDeg)) + 180;
        angleDeg = angleDeg + 360;

      //determining region
      let region = Math.floor(angleDeg / angle);

      // DEBUGGING Purpose
      if (matrixPosition.row === 1 && matrixPosition.col === 190 ||
        matrixPosition.row === 380 && matrixPosition.col === 1 ||
        matrixPosition.row === 190 && matrixPosition.col === 190 ||
        matrixPosition.row === 380 && matrixPosition.col === 380) {
        console.log('DEBUGGING matrix position: (' + matrixPosition.row + ', ' + matrixPosition.col + ')');
        console.log('DEBUGGING cartesian position: (' + p2.x + ', ' + p2.y + ')');
        console.log('DEBUGGING angleDeg: ' + angleDeg);
        console.log('DEBUGGING region: ' + region);
      }


      // apply quality
      if (this.actualGeometry.vertices[i].z < maxInRegion[region])
        this.variableGeometry.vertices[i].z = this.actualGeometry.vertices[i].z;
      else
        this.variableGeometry.vertices[i].z = maxInRegion[region];
    }

    console.log("FINISH apply completeness on every region of geometry on:", new Date().getTime());
  }

  addBarriers(numberOfRegion) {
    // removing all existing clouds
    this.removeBarriers();

    // calculating angle, right now they have same size, later should be improved to accomodate content size or importancy
    let angle = 360 / numberOfRegion;

    for (let i = 0; i < numberOfRegion; i++) {
      // set name
      let name = 'barrier' + i;
      // set degree size
      let deg: number;
      deg = (angle * i);

      // create to the group
      this.createBarrier(name, deg);
    }
  }

  removeBarriers() {
    let iterate = true;
    let num = 0;
    while (iterate) {
      if (this.scene.getObjectByName('barrier' + num)) {
        console.log('CHECKING Removing ' + 'barrier' + num);
        THREE.SceneUtils.detach(this.scene.getObjectByName('barrier' + num), this.actualMapPlane, this.scene);
        this.scene.remove(this.scene.getObjectByName('barrier' + num));
      }
      else {
        iterate = false;
      }
      num++;
    }
  }

  createBarrier(name, yRotation) {
    // Rectangle
    let rectLength = 140, rectWidth = 50;

    let posX = 0;
    let posY = 0;
    let posZ = 0;

    // Creating texture
    let loader = new THREE.TextureLoader();
    let texture = loader.load("assets/images/fence2.png");
    // it's necessary to apply these settings in order to correctly display the texture on a shape geometry
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.08, 0.08);

    let rectShape = new THREE.Shape();
    rectShape.moveTo(0, 0);
    rectShape.lineTo(0, rectWidth);
    rectShape.lineTo(rectLength, rectWidth);
    rectShape.lineTo(rectLength, 0);
    rectShape.lineTo(0, 0);

    let geometry = new THREE.ShapeBufferGeometry(rectShape);
    //var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0x4d4dff }));
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: texture, transparent: true }));
    mesh.name = name;
    mesh.position.set(posX, posY, posZ);
    mesh.rotation.x = 90 * Math.PI / 180;
    mesh.rotation.y = yRotation * Math.PI / 180;
    this.actualMapPlane.add(mesh);
  }

  /*
    FUNCTION apply Overall Completeness On Goemetry
    */
  /*  applyOverallCompletenessOnGoemetry(quality: number) {
     console.log("BEGIN apply overall completeness on geometry on:", new Date().getTime());
 
     //Data of DEM should be from 500 - 3770
     let minData: number = 500;
     let maxData: number = 3770;
     let maxAllowed: number = minData + (maxData - minData) * quality;
     let maxAllowedOnGeometry: number = maxAllowed / 65535 * 1025;
 
     for (let i = 0, l = this.actualGeometry.vertices.length; i < l; i++) {
       if (this.actualGeometry.vertices[i].z < maxAllowedOnGeometry) {
           this.variableGeometry.vertices[i].z = this.actualGeometry.vertices[i].z;
       } else {
         this.variableGeometry.vertices[i].z = maxAllowedOnGeometry;
       }
     }
 
     console.log("FINISH apply overall completeness on geometry  on:", new Date().getTime());
   } */

  addRegionLabel(dataLabels: Array<string>) {
    // getting number of region
    let numberOfRegion = dataLabels.length;

    // calculating angle, right now they have same size, later should be improved to accomodate content size or importancy
    let angle = 360 / numberOfRegion;
    let halfAngle = angle / 2; // as determiner the center of each region

    let labels = new THREE.Group();
    labels.name = 'labelGroup';
    for (let i = 0; i < numberOfRegion; i++) {
      let label = this.makeTextSprite(dataLabels[i],
        { fontsize: 34, fontface: "Georgia", borderColor: { r: 0, g: 0, b: 255, a: 1.0 } });
      // set name
      label.name = 'label' + i;

      // set label position
      let deg = (angle * (i + 1)) - halfAngle;
      //let deg = (angle * (i * 1));
      let rad = Math.PI * deg / 180;
      let radius = 140;
      let posX = Math.floor(radius * Math.cos(rad));
      let posY = Math.floor(radius * Math.sin(rad));
      label.position.set(posX, posY, 25); // (x,y,z)

      // add to the group
      labels.add(label);
    }

    this.removeRegionLabel();

    this.actualMapPlane.add(labels);
  }

  removeRegionLabel() {
    if (this.scene.getObjectByName('labelGroup')) {
      THREE.SceneUtils.detach(this.scene.getObjectByName('labelGroup'), this.actualMapPlane, this.scene);
      this.scene.remove(this.scene.getObjectByName('labelGroup'));
    }
  }

  makeTextSprite(message, parameters) {
    if (parameters === undefined) parameters = {};

    var fontface = parameters.hasOwnProperty("fontface") ?
      parameters["fontface"] : "Arial";

    var fontsize = parameters.hasOwnProperty("fontsize") ?
      parameters["fontsize"] : 18;

    var borderThickness = parameters.hasOwnProperty("borderThickness") ?
      parameters["borderThickness"] : 2;

    var borderColor = parameters.hasOwnProperty("borderColor") ?
      parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };

    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
      parameters["backgroundColor"] : { r: 255, g: 255, b: 255, a: 1.0 };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;

    // get size data (height depends only on font size)
    var metrics = context.measureText(message);
    var textWidth = metrics.width;

    // background color
    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
      + backgroundColor.b + "," + backgroundColor.a + ")";
    // border color
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
      + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    this.roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.

    // text color
    context.fillStyle = "rgba(0, 0, 0, 1.0)";

    context.fillText(message, borderThickness, fontsize + borderThickness);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial(
      { map: texture, useScreenCoordinates: false });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(40, 20, 1.0);
    return sprite;
  }

  // function for drawing rounded rectangles
  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  addClouds(quality: Array<number>) {
    // removing all existing clouds
    this.removeClouds();

    // getting number of region
    let numberOfRegion = quality.length;

    // calculating angle, right now they have same size, later should be improved to accomodate content size or importancy
    let angle = 360 / numberOfRegion;
    let halfAngle = angle / 2; // as determiner the center of each region

    for (let i = 0; i < numberOfRegion; i++) {
      // set name
      let name = 'cloud' + i;
      // intensity
      let intensity = Math.abs(1 - quality[i]) * 200; // if quality 1 then intensity 0, multiply by 10 for more dramatic
      // set x and y position
      let deg = (angle * (i + 1)) - halfAngle;
      //let deg = (angle * (i * 1));
      let rad = Math.PI * deg / 180;
      let radius = 70;
      let posX = Math.floor(radius * Math.cos(rad));
      let posY = Math.floor(radius * Math.sin(rad));
      // z position hardcoded to 25
      let posZ = 25;

      // create to the group
      this.createClouds(name, intensity, posX, posY, posZ);
    }
  }

  removeClouds() {
    let iterate = true;
    let num = 0;
    while (iterate) {
      if (this.scene.getObjectByName('cloud' + num)) {
        console.log('CHECKING Removing ' + 'cloud' + num);
        THREE.SceneUtils.detach(this.scene.getObjectByName('cloud' + num), this.actualMapPlane, this.scene);
        this.scene.remove(this.scene.getObjectByName('cloud' + num));
      }
      else {
        iterate = false;
      }
      num++;
    }
  }

  createClouds(name, intensity, posX, posY, posZ) {
    console.log('BEGIN creating clouds');
    //let texture = THREE.ImageUtils.loadTexture('assets/images/cloud.png', null, this.animate());
    let texture = THREE.ImageUtils.loadTexture('assets/images/cloud.png', null);
    texture.magFilter = THREE.LinearMipMapLinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    let cloudsGeometry = new THREE.Geometry();
    let cloudsPlane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));

    var fog = new THREE.Fog(0x4584b4, - 100, 3000);

    let fogMaterial = new THREE.ShaderMaterial({
      uniforms: {
        "map": { type: "t", value: texture },
        "fogColor": { type: "c", value: fog.color },
        "fogNear": { type: "f", value: fog.near },
        "fogFar": { type: "f", value: fog.far },
      },
      side: THREE.DoubleSide,
      vertexShader: document.getElementById('vs').textContent,
      fragmentShader: document.getElementById('fs').textContent,
      //depthWrite: true,
      depthTest: false,
      transparent: true,
      //renderOrder: 100
    });

    //this.actualMapPlane.renderOrder = 1;

    // let cloudIntensity = Math.abs((1 - intensity) * 20);
    let cloudIntensity = intensity;
    for (var i = 0; i < cloudIntensity; i++) {
      cloudsPlane.position.x = Math.random() * 20 - 0;
      cloudsPlane.position.y = - Math.random() * Math.random() * 20 - 0;
      cloudsPlane.position.z = Math.random() * 10 - 0;
      cloudsPlane.rotation.z = Math.random() * Math.PI;
      cloudsPlane.scale.x = cloudsPlane.scale.y = Math.random() * Math.random() * 0.5 + 0.1;

      THREE.GeometryUtils.merge(cloudsGeometry, cloudsPlane);
    }

    let clouds = new THREE.Mesh(cloudsGeometry, fogMaterial);
    clouds.name = name;
    clouds.position.set(posX, posY, posZ);
    this.actualMapPlane.add(clouds);
  }

  /*
    FUNCTION Black Clouds
  */
  addBlackClouds(quality: Array<number>) {
    // removing all existing clouds
    this.removeBlackClouds();

    // Emptying targetList
    //this.targetList.length = 0;

    // getting number of region
    let numberOfRegion = quality.length;

    // calculating angle, right now they have same size, later should be improved to accomodate content size or importancy
    let angle = 360 / numberOfRegion;
    let halfAngle = angle / 2; // as determiner the center of each region

    for (let i = 0; i < numberOfRegion; i++) {
      // set name
      let name = 'blackcloud' + i;
      // intensity
      let intensity = Math.abs(1 - quality[i]) * 200; // if quality 1 then intensity 0, multiply by 10 for more dramatic
      // set x and y position
      let deg = (angle * (i + 1)) - halfAngle;
      //let deg = (angle * (i * 1));
      let rad = Math.PI * deg / 180;
      let radius = 100;
      let posX = Math.floor(radius * Math.cos(rad));
      let posY = Math.floor(radius * Math.sin(rad));
      // z position hardcoded to 25
      let posZ = 25;

      // create to the group
      this.createBlackClouds(name, intensity, posX, posY, posZ);
    }
    //console.log('---> TargetList: ' + this.targetList);
  }

  removeBlackClouds() {
    let iterate = true;
    let num = 0;
    while (iterate) {
      if (this.scene.getObjectByName('blackcloud' + num)) {
        console.log('CHECKING Removing ' + 'blackcloud' + num);
        THREE.SceneUtils.detach(this.scene.getObjectByName('blackcloud' + num), this.actualMapPlane, this.scene);
        this.scene.remove(this.scene.getObjectByName('blackcloud' + num));
      }
      else {
        iterate = false;
      }
      num++;
    }
  }

  createBlackClouds(name, intensity, posX, posY, posZ) {
    console.log('BEGIN creating clouds');
    //let texture = THREE.ImageUtils.loadTexture('assets/images/cloud.png', null, this.animate());
    let texture = THREE.ImageUtils.loadTexture('assets/images/blackcloud.png', null);
    texture.magFilter = THREE.LinearMipMapLinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    let cloudsGeometry = new THREE.Geometry();
    let cloudsPlane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));

    var fog = new THREE.Fog(0x4584b4, - 100, 3000);

    let fogMaterial = new THREE.ShaderMaterial({
      uniforms: {
        "map": { type: "t", value: texture },
        "fogColor": { type: "c", value: fog.color },
        "fogNear": { type: "f", value: fog.near },
        "fogFar": { type: "f", value: fog.far },
      },
      side: THREE.DoubleSide,
      vertexShader: document.getElementById('vs').textContent,
      fragmentShader: document.getElementById('fs').textContent,
      depthWrite: true,
      depthTest: false,
      transparent: true,
    });

    // let cloudIntensity = Math.abs((1 - intensity) * 20);
    let cloudIntensity = intensity;
    for (var i = 0; i < cloudIntensity; i++) {
      cloudsPlane.position.x = Math.random() * 20 - 0;
      cloudsPlane.position.y = - Math.random() * Math.random() * 20 - 0;
      cloudsPlane.position.z = Math.random() * 10 - 0;
      cloudsPlane.rotation.z = Math.random() * Math.PI;
      cloudsPlane.scale.x = cloudsPlane.scale.y = Math.random() * Math.random() * 0.5 + 0.1;

      THREE.GeometryUtils.merge(cloudsGeometry, cloudsPlane);
    }

    let blackClouds = new THREE.Mesh(cloudsGeometry, fogMaterial);
    blackClouds.name = name;
    blackClouds.position.set(posX, posY, posZ);
    //this.targetList.push(blackClouds);
    this.actualMapPlane.add(blackClouds);
  }

  // -------
  // BLUEPOS
  // -------
  addBluePos(quality: Array<number>) {
    // clearing targetList
    this.bluePosList.length = 0;

    const promise = new Promise((resolve, reject) => {
      // removing all existing Blue Pos
      this.removeBluePos();
      // clearing targetList array
      //this.targetList.length = 0;
      resolve();
    });
    promise.then((res) => {
      // getting number of region
      let numberOfRegion = quality.length;

      // calculating angle, right now they have same size, later should be improved to accomodate content size or importancy
      let angle = 360 / numberOfRegion;
      let halfAngle = angle / 2; // as determiner the center of each region

      for (let i = 0; i < numberOfRegion; i++) {
        if (quality[i] !== 1) {
          // set name
          let name = 'bluepos' + i;
          // set x and y position
          let deg = (angle * (i + 1)) - halfAngle;
          //let deg = (angle * (i * 1));
          let rad = Math.PI * deg / 180;
          let radius = 20;
          let posX = Math.floor(radius * Math.cos(rad));
          let posY = Math.floor(radius * Math.sin(rad));
          // z position hardcoded to 25
          let posZ = 60;

          // create to the group
          this.createBluePos(name, posX, posY, posZ);
        }
      }
      console.log('-------> CHECKING length of TargetList: ' + this.bluePosList.length);
    });
    promise.catch((err) => {
      // This is never called
    });
  }

  removeBluePos() {
    let iterate = true;
    let num = 0;
    while (iterate) {
      console.log('-----> Iterate with num: ' + num)
      if (this.scene.getObjectByName('bluepos' + num)) {
        console.log('CHECKING Removing ' + 'bluepos' + num);
        THREE.SceneUtils.detach(this.scene.getObjectByName('bluepos' + num), this.actualMapPlane, this.scene);
        this.scene.remove(this.scene.getObjectByName('bluepos' + num));
      }

      if (num === 20) {
        iterate = false;
      }

      num++;
    }
  }

  createBluePos(thename, posX, posY, posZ) {
    console.log('--------> BEGIN creating bluepos with name: ' + thename);

    let texture = new THREE.TextureLoader().load('assets/images/blue-pos.png');

    /*     let geometry = new THREE.PlaneGeometry(16, 16);
        let material = new THREE.MeshPhongMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
        material.emissive.set(0x333333);
        material.shininess = 250;
    
        let bluepos = new THREE.Mesh(geometry, material); */

    let material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff, fog: true });
    let bluepos = new THREE.Sprite(material);
    bluepos.scale.set(20, 20, 1);

    bluepos.name = thename;
    bluepos.position.set(posX, posY, posZ);
    bluepos.rotation.x = 90 * Math.PI / 180;
    bluepos.lookAt(this.camera.position);
    this.bluePosList.push(bluepos);
    this.actualMapPlane.add(bluepos);
  }

  // -------
  // YellowPOS
  // -------
  addYellowPos(quality: Array<number>) {
    // clearing targetList
    this.bluePosList.length = 0;

    const promise = new Promise((resolve, reject) => {
      // removing all existing Blue Pos
      this.removeYellowPos();
      // clearing targetList array
      //this.targetList.length = 0;
      resolve();
    });
    promise.then((res) => {
      // getting number of region
      let numberOfRegion = quality.length;

      // calculating angle, right now they have same size, later should be improved to accomodate content size or importancy
      let angle = 360 / numberOfRegion;
      let halfAngle = angle / 2; // as determiner the center of each region

      for (let i = 0; i < numberOfRegion; i++) {
        if (quality[i] !== 1) {
          // set name
          let name = 'yellowpos' + i;
          // set x and y position
          let deg = (angle * (i + 1)) - halfAngle;
          //let deg = (angle * (i * 1));
          let rad = Math.PI * deg / 180;
          let radius = 70;
          let posX = Math.floor(radius * Math.cos(rad));
          let posY = Math.floor(radius * Math.sin(rad));
          // z position hardcoded to 25
          let posZ = 60;

          // create to the group
          this.createYellowPos(name, posX, posY, posZ);
        }
      }
      console.log('-------> CHECKING length of TargetList: ' + this.yellowPosList.length);
    });
    promise.catch((err) => {
      // This is never called
    });
  }

  removeYellowPos() {
    let iterate = true;
    let num = 0;
    while (iterate) {
      console.log('-----> Iterate with num: ' + num)
      if (this.scene.getObjectByName('yellowpos' + num)) {
        console.log('CHECKING Removing ' + 'yellowpos' + num);
        THREE.SceneUtils.detach(this.scene.getObjectByName('yellowpos' + num), this.actualMapPlane, this.scene);
        this.scene.remove(this.scene.getObjectByName('yellowpos' + num));
      }

      if (num === 20) {
        iterate = false;
      }

      num++;
    }
  }

  createYellowPos(thename, posX, posY, posZ) {
    console.log('--------> BEGIN creating yellowpos with name: ' + thename);

    let texture = new THREE.TextureLoader().load('assets/images/yellow-pos.png');

    /*     let geometry = new THREE.PlaneGeometry(16, 16);
        let material = new THREE.MeshPhongMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
        material.emissive.set(0x333333);
        material.shininess = 250;
    
        let yellowpos = new THREE.Mesh(geometry, material); */

    let material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff, fog: true });
    let yellowpos = new THREE.Sprite(material);
    yellowpos.scale.set(20, 20, 1);

    yellowpos.name = thename;
    yellowpos.position.set(posX, posY, posZ);
    yellowpos.rotation.x = 90 * Math.PI / 180;
    yellowpos.lookAt(this.camera.position);
    this.yellowPosList.push(yellowpos);
    this.actualMapPlane.add(yellowpos);
  }

  // -------
  // REDPOS
  // -------
  addRedPos(quality: Array<number>) {
    // clearing targetList
    this.redPosList.length = 0;

    const promise = new Promise((resolve, reject) => {
      // removing all existing Blue Pos
      this.removeRedPos();
      // clearing targetList array
      //this.targetList.length = 0;
      resolve();
    });
    promise.then((res) => {
      // getting number of region
      let numberOfRegion = quality.length;

      // calculating angle, right now they have same size, later should be improved to accomodate content size or importancy
      let angle = 360 / numberOfRegion;
      let halfAngle = angle / 2; // as determiner the center of each region

      for (let i = 0; i < numberOfRegion; i++) {
        if (quality[i] !== 1) {
          // set name
          let name = 'redpos' + i;
          // set x and y position
          let deg = (angle * (i + 1)) - halfAngle;
          //let deg = (angle * (i * 1));
          let rad = Math.PI * deg / 180;
          let radius = 100;
          let posX = Math.floor(radius * Math.cos(rad));
          let posY = Math.floor(radius * Math.sin(rad));
          // z position hardcoded to 25
          let posZ = 60;

          // create to the group
          this.createRedPos(name, posX, posY, posZ);
        }
      }
      console.log('-------> CHECKING length of TargetList: ' + this.redPosList.length);
    });
    promise.catch((err) => {
      // This is never called
    });
  }

  removeRedPos() {
    let iterate = true;
    let num = 0;
    while (iterate) {
      console.log('-----> Iterate with num: ' + num)
      if (this.scene.getObjectByName('redpos' + num)) {
        console.log('CHECKING Removing ' + 'redpos' + num);
        THREE.SceneUtils.detach(this.scene.getObjectByName('redpos' + num), this.actualMapPlane, this.scene);
        this.scene.remove(this.scene.getObjectByName('redpos' + num));
      }

      if (num === 20) {
        iterate = false;
      }

      num++;
    }
  }

  createRedPos(thename, posX, posY, posZ) {
    console.log('--------> BEGIN creating bluepos with name: ' + thename);

    let texture = new THREE.TextureLoader().load('assets/images/red-pos.png');

    /* let geometry = new THREE.PlaneGeometry(16, 16);
    let material = new THREE.MeshPhongMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
    material.emissive.set(0x333333);
    material.shininess = 250;

    let redpos = new THREE.Mesh(geometry, material); */

    let material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff, fog: true });
    let redpos = new THREE.Sprite(material);
    redpos.scale.set(20, 20, 1);

    redpos.name = thename;
    redpos.position.set(posX, posY, posZ);
    redpos.rotation.x = 90 * Math.PI / 180;
    this.redPosList.push(redpos);
    this.actualMapPlane.add(redpos);
  }

  /*
  FUNCTION get overall quality for section 3 of SRS
  */
  /*   getOverall(data: Array<number>) {
      let overall: number = 0;
      let sum: number = 0;
  
      let length = data.length;
      for (let i = 0; i < length; i++) {
        sum = sum + data[i];
      }
      overall = sum / length;
  
      return overall;
    } */

  /*
    FUNCTION Insert fog to scene
    */
  /*   insertFogToScene(quality: number) {
      this.scene.fog.near = quality / 100;
      this.scene.fog.far = 200;
    }
  
    removeFogFromScene() {
      this.scene.fog.near = 0.1;
      this.scene.fog.far = 0;
    } */

  /*
  FUNCTION : Initialize Variables {actualData} and draw actual image of metaphor
  */
  ngOnInit() {
    // setting height for mapcontainer
    document.getElementById("mapcontainer").style.height = (window.innerHeight - 28 * 3 - 150 - 20).toString() + "px"; // (panel_header*3 - insetsarea - footer)

    this.demloaderService.getFuji()
      .then((data) => {
        console.log("10. calling function to generate Map with area of: " + data.area + ", and data as following: ");
        this.actualData = data;
        console.log(this.actualData.data);
        this.generateInitialMap(this.actualData);
      })
      .then(() => {
        console.log("12. Map generator should be finished on: ", new Date().getTime());
      });
  }
}