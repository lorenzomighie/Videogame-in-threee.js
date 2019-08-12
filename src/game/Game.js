import * as THREE from 'three';

import { OrbitCameraController, ConstrainedCameraController } from './Camera'
import { randomColor } from 'randomcolor'
import { Mode } from './Mode'
import { GUI } from './GUI'
import { addToPx, divPx } from './Utils'
import { EventManager } from './EventManager'


export class GameMode extends Mode {
  constructor (main) {
    super(main, new GameGUI(main.guiDiv, main.canvas), true);
    this.speed = 0.03;
    this.startPosition = new THREE.Vector3(-0.4, 5.5, 3);
    //this.startPosition = new THREE.Vector3(-11.854765048054903, 9.7, 22.472826621821646);
    this.main.spider.root.position.set(this.startPosition.x, this.startPosition.y, this.startPosition.z);

    this.orbitCameraController = new OrbitCameraController(main.camera, this.startPosition, 0.5, main.meshCollection, main);
    this.constrainedCameraController = new ConstrainedCameraController(main.camera, this.startPosition);
    this.activeCameraController = this.orbitCameraController;

    this.spiderController = new SpiderController(this.main, this.startPosition);
    this.directions = {up: false, down: false};
    this.rotateLeft = false;
    this.rotateRight = false;
    this.click = false;
    this.targetEnabled = false;
    this.climbDown = false;
    this.accelerating = false;
    this.deltaX = 0;
    this.deltaY = 0;
    this.enterTutorial = true; // start inside the tutorial
    this.firstUpdate = true;
    this.isChangingMode = false;
    this.theta = 0;
    this.radius = 2.5;

    this.lambdaM = 0;
    this.lambdaM2 = 0;
    this.lambdaM3 = 0;
    this.lambdaF = 0;
    this.countPath = 0;
    this.countPath2 = 0;
    this.countPath3 = 0;
    this.countPathF = 0;

    this.eventManager = new EventManager(this);
  }

  handleAction(event, key, value) {
    super.handleAction(event, key, value);

    if (!this.main.inputManager.isLocked){
      return;
    }

    // don't read on key up:
    if (key === 'enter' && !value){
      return;
    }
    if (key === 'v' && !value){
      return
    }


    switch (key) {
      case 'click':
        this.click = value;
        //this.spiderController.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        //this.spiderController.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
        this.spiderController.mouse.x = (parseInt(this.gui.crosshair.style.left) / window.innerWidth) * 2 - 1;
        this.spiderController.mouse.y = -(parseInt(this.gui.crosshair.style.top) / window.innerHeight) * 2 + 1;
        break;
      case 'control':
        this.targetEnabled = value;
        break;
      case 'w':
        this.directions.up = value;
        break;
      case 's':
        this.directions.down = value;
        break;
      case 'v':
        if (this.activeCameraController instanceof OrbitCameraController) {
          this.activeCameraController = this.constrainedCameraController;
          this.activeCameraController.position = this.orbitCameraController.position;
        } else {
          this.activeCameraController = this.orbitCameraController;
          this.activeCameraController.position = this.constrainedCameraController.position;
        }
        break;
      case 'a':
        this.rotateLeft = value;
        break;
      case 'd':
        this.rotateRight = value;
        break;
      case 'esc':
        break;
      case 'enter':
        this.climbDown = true;
        break;
      case 'shift':
        this.accelerating = value;
        break;
      case 't':
        if (value && !this.firstUpdate) {
          if (!this.enterTutorial) {
            this.enterTutorial = true;
          }
        }
        break;
    }
  }

  handleMouseMove (deltaX, deltaY) {
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    super.handleMouseMove(this.deltaX, this.deltaY);
    if (this.main.inputManager.isLocked){
      if (this.targetEnabled) {
        if (parseInt(this.gui.crosshair.style.left) < 0 ||
            parseInt(this.gui.crosshair.style.left) > parseInt(this.main.canvas.width) ||
            parseInt(this.gui.crosshair.style.top) < 0 ||
            parseInt(this.gui.crosshair.style.top) > parseInt(this.main.canvas.height)) {
          return;

        }
        this.gui.crosshair.style.left = addToPx(this.gui.crosshair.style.left, this.deltaX);
        this.gui.crosshair.style.top = addToPx(this.gui.crosshair.style.top, this.deltaY);

      }
      else if (this.activeCameraController instanceof OrbitCameraController)
        this.activeCameraController.rotate(this.deltaX, this.deltaY);
    }
  }

  update () {
    super.update();


    if ((this.directions.up - this.directions.down) > 0) {
      if (!this.spiderController.isClimbingDown) {
        this.spiderController.walkForward = true;
      }
    }

    if ((this.directions.up - this.directions.down) < 0) {
      if (!this.spiderController.isClimbingDown) {
        this.spiderController.walkBackward = true;
      }
    }

    if ((this.rotateLeft - this.rotateRight) !== 0 && !this.spiderController.isClimbingDown) {
      this.spiderController.turn = (this.rotateLeft - this.rotateRight);
    }

    if (this.climbDown) {
      if (!this.spiderController.isClimbingDown) {
        this.spiderController.requestClimbDown = true;
      }
      this.climbDown = false;
    }

    if (this.targetEnabled) {
      if (!this.gui.crosshairEnabled) {
        this.gui.enableCrosshair();
      }
    } else {
      if (this.gui.crosshairEnabled) {
        this.gui.disableCrosshair();
      }
    }


    if (this.click) {
      this.spiderController.animateClaws = true;
      if (this.targetEnabled) {
        this.spiderController.requestJump = true;
        this.targetEnabled = false;
        this.gui.disableCrosshair();
      }
      this.click = false;
    }

    if (this.accelerating){
      if(this.speed === 0.03) {
        //faster animation
        this.spiderController.reachStandardPositon();
        this.spiderController.deltaLeg1 = -0.07;
        this.spiderController.deltaLeg2 = -0.07 * 0.7 / 1.6;
        this.spiderController.deltaLeg3 = -0.07;
        this.spiderController.deltaLeg4 = -0.07 * 0.7 / 1.6;
        this.spiderController.nIteration = 11;
        this.spiderController.countIterationFL = 11 - 7;
        this.spiderController.countIterationFR = 11 - 4;
      }
      this.speed = 0.06;

    }
    else if(!this.accelerating && this.speed === 0.06){
      this.spiderController.reachStandardPositon();
      this.speed = 0.03;
      this.spiderController.deltaLeg1 = -0.03;
      this.spiderController.deltaLeg2 = -0.03 * 0.7 / 1.6;
      this.spiderController.deltaLeg3 = -0.03;
      this.spiderController.deltaLeg4 = -0.03 * 0.7 / 1.6;
      this.spiderController.nIteration = 25;
      this.spiderController.countIterationFL = 25 - 16;
      this.spiderController.countIterationFR = 25 - 9;
    }

    let deltaZ = new THREE.Vector3(0, 0, -1);
    deltaZ.applyQuaternion(this.main.spider.root.quaternion);
    deltaZ.multiplyScalar(this.speed * (this.directions.up - this.directions.down));
    this.move(deltaZ);

    this.spiderController.update();


    if (this.activeCameraController instanceof ConstrainedCameraController) {
      this.activeCameraController.rotate(this.main.spider.root.quaternion);
      if (!this.spiderController.isChangingEdge) {
        this.activeCameraController.update();
      }
    }
    else{
      if(!this.spiderController.isChangingEdge) {
        this.activeCameraController.update(this.main.spider.root.up, this.main.spider.root.quaternion);
      }
    }

    if(this.enterTutorial && !this.isChangingMode){
      if(this.firstUpdate) {
        setTimeout(() => {
          this.main.changeMode(this.main.tutorialMode);
          this.firstUpdate = false;
          /* this.eventManager.openDoor0();
          this.eventManager.openDoor1();
          this.eventManager.openDoor2();
          this.eventManager.openDoor3();
          this.eventManager.openDoor4();
          this.eventManager.openDoor5();
          this.eventManager.openDoor6(); */
        }, 1500);
        this.isChangingMode = true;
      } else if(!this.firstUpdate){
        this.main.changeMode(this.main.tutorialMode)
      }
    }

    this.rotateObjects();

    this.eventManager.listen()

  }

  rotateObjects () {
    this.main.key0.rotation.y += 0.05;
    this.main.key1.rotation.x += 0.05;
    this.main.key2.rotation.y += 0.05;
    this.main.key3.rotateOnWorldAxis(new THREE.Vector3(0,1,0), 0.05);
    this.main.key4.rotateOnWorldAxis(new THREE.Vector3(0,0,1), 0.05);
    // key 5 is rotated in rotateMagic2
    this.main.key6.rotateOnWorldAxis(new THREE.Vector3(0,0,1), 0.05);

    // clean the increase of the Euler angles
    this.main.key0.rotation.y = this.main.key0.rotation.y % 720;
    this.main.key1.rotation.x = this.main.key1.rotation.x % 720;
    this.main.key2.rotation.y = this.main.key2.rotation.y % 720;

    this.rotateKey6();

    this.rotateMagic1();

    this.rotateMagic2();

    this.rotateMagic3();

    this.moveFish();


    this.main.chick.rotateOnWorldAxis(new THREE.Vector3(0,1,0), 0.001)
    //console.log(this.spiderController.position)
  }

  moveFish () {
    // 0.3728927331765085
    // y: 0.49100666613202293
    // z: -23.461578079442656
    const pos1 =  new THREE.Vector3(0.3728927331765085, 0.2 ,-23.461578079442656);
    const pos2 = new THREE.Vector3(0.31146470614290805, 1.8, -22.15356432072411);
    const pos3 = new THREE.Vector3(0.35709886725087625, 0.2, -21.051229839919376);

    if(this.countPathF === 0) {
      pos2.multiplyScalar(this.lambdaF).add(pos1.multiplyScalar(1 - this.lambdaF));
      this.main.fish.position.set(pos2.x, pos2.y, pos2.z);
      if(this.lambdaF >=1){
        this.countPathF = 1;
        this.lambdaF = 0;
      }
    }

    if(this.countPathF === 1) {
      pos3.multiplyScalar(this.lambdaF).add(pos2.clone().multiplyScalar(1 - this.lambdaF));
      this.main.fish.position.set(pos3.x, pos3.y, pos3.z);
      if(this.lambdaF >=1){
        this.countPathF = 2;
        this.lambdaF = 0;
      }
    }

    if(this.countPathF === 2) {
      pos1.multiplyScalar(this.lambdaF).add(pos3.clone().multiplyScalar(1 - this.lambdaF));
      this.main.fish.position.set(pos1.x, pos1.y, pos1.z);
      if(this.lambdaF >=1){
        this.countPathF = 0;
        this.lambdaF = 0;
      }
    }

    this.lambdaF += 0.01;
  }

  rotateKey6 () {

    //x: -6.867679192801956
    //y: 8.235604496961926
    //z: -3.4227404586147387

    this.main.key6.position.set(-6.867679192801956 + this.radius*Math.cos(this.theta), 8.235604496961926 , -3.4227404586147387 + this.radius*Math.sin(this.theta));
    //this.main.key6.position.set(7.9188, 3.472, -6.9783);
    this.theta += 1 * Math.PI/180;
    this.theta = this.theta%720;

  }

  rotateMagic1 () {
    // -8.778111824644435, y: 5.5, z: 10.907554734315584
    //-3.2111484044972465, y: 7.5, z: 14.941867106902675}
    //-8.47160120261128, y: 9, z: 18.828597806845213
    // rotate magic
    const pos1 = new THREE.Vector3(-8.778111824644435, 5.5, 10.907554734315584);
    const pos2 = new THREE.Vector3(-3.2111484044972465, 7.5, 14.941867106902675);
    const pos3 = new THREE.Vector3(-8.47160120261128, 9, 18.828597806845213);

    if(this.countPath === 0) {
      pos2.multiplyScalar(this.lambdaM).add(pos1.multiplyScalar(1 - this.lambdaM));
      this.main.scene.getObjectByName('Magic1').position.set(pos2.x, pos2.y, pos2.z);
      if(this.lambdaM >=1){
        this.countPath = 1;
        this.lambdaM = 0;
      }
    }

    if(this.countPath === 1) {
      pos3.multiplyScalar(this.lambdaM).add(pos2.clone().multiplyScalar(1 - this.lambdaM));
      this.main.scene.getObjectByName('Magic1').position.set(pos3.x, pos3.y, pos3.z);
      if(this.lambdaM >=1){
        this.countPath = 2;
        this.lambdaM = 0;
      }
    }

    if(this.countPath === 2) {
      pos1.multiplyScalar(this.lambdaM).add(pos3.clone().multiplyScalar(1 - this.lambdaM));
      this.main.scene.getObjectByName('Magic1').position.set(pos1.x, pos1.y, pos1.z);
      if(this.lambdaM >=1){
        this.countPath = 0;
        this.lambdaM = 0;
      }
    }

    this.lambdaM += 0.003;
  }

  rotateMagic2 () {
    //-6.108439832356222, y: 7.488525780920014, z: 20.75716571585833
    // -2.570302336391969, y: 7.570209445806894, z: 9.895978927612305
    const pos1 = new THREE.Vector3(-6.108439832356222, 9.488525780920014, 17.75716571585833);
    const pos2 = new THREE.Vector3(-2.570302336391969, 9.570209445806894, 13.895978927612305);

    if(this.countPath2 === 0) {
      pos2.multiplyScalar(this.lambdaM2).add(pos1.multiplyScalar(1 - this.lambdaM2));
      this.main.scene.getObjectByName('Magic2').position.set(pos2.x, pos2.y, pos2.z);
      this.main.key5.position.set(pos2.x, pos2.y, pos2.z);
      if(this.lambdaM2 >=1){
        this.countPath2 = 1;
        this.lambdaM2 = 0;
      }
    }

    if(this.countPath2 === 1) {
      pos1.multiplyScalar(this.lambdaM2).add(pos2.clone().multiplyScalar(1 - this.lambdaM2));
      this.main.scene.getObjectByName('Magic2').position.set(pos1.x, pos1.y, pos1.z);
      this.main.key5.position.set(pos1.x, pos1.y, pos1.z);
      if(this.lambdaM2 >=1){
        this.countPath2 = 0;
        this.lambdaM2 = 0;
      }
    }

    this.lambdaM2 += 0.006;
  }

  rotateMagic3 () {
    // -6.48607968440411
    // y: 5.5
    // z: 15.375176805476768
    const pos1 = new THREE.Vector3(-6.48607968440411, 6.5, 15.375176805476768);
    const pos2 = new THREE.Vector3(-6.48607968440411, 10.5, 15.375176805476768);

    if(this.countPath3 === 0) {
      pos2.multiplyScalar(this.lambdaM3).add(pos1.multiplyScalar(1 - this.lambdaM3));
      this.main.scene.getObjectByName('Magic3').position.set(pos2.x, pos2.y, pos2.z);
      if(this.lambdaM3 >=1){
        this.countPath3 = 1;
        this.lambdaM3 = 0;
      }
    }

    if(this.countPath3 === 1) {
      pos1.multiplyScalar(this.lambdaM3).add(pos2.clone().multiplyScalar(1 - this.lambdaM3));
      this.main.scene.getObjectByName('Magic3').position.set(pos1.x, pos1.y, pos1.z);
      if(this.lambdaM3 >=1){
        this.countPath3 = 0;
        this.lambdaM3 = 0;
      }
    }

    this.lambdaM3 += 0.002;
  }



  move (deltaZ) {
    if (!this.spiderController.isJumping && !this.spiderController.isChangingEdge) {
      this.spiderController.position.add(deltaZ);
      this.activeCameraController.position.add(deltaZ);
    }
  }

  // required after pressing tab or escaper
  resetButtons () {
    this.directions.up = false;
    this.directions.down = false;
    this.rotateLeft = false;
    this.rotateRight = false;
    this.accelerating = false;
    this.deltaX = 0;
    this.deltaY = 0;
    this.enterTutorial = false;
    this.targetEnabled = false;
  }

}


class SpiderController {

  constructor (main, startPosition) {
    this.main = main;
    this.spider = main.spider;
    this.position = startPosition
    this.rayCaster = new THREE.Raycaster();
    this.startQuaternion = new THREE.Quaternion();
    this.finalQuaternion = new THREE.Quaternion();
    this.newNormal = null;
    this.lambda = 0.0;

    // walking control variables
    this.isChangingEdge = false;
    this.epsilon = 0.05;

    // animation
    this.saveInitialConfig();
    this.deltaClaws = 0.04;
    this.aboutToEnd = false;
    /*
    this.deltaLeg1 = -0.03;
    this.deltaLeg2 = -0.03 * 0.7 / 1.6;
    this.deltaLeg3 = -0.03;
    this.deltaLeg4 = -0.03 * 0.7 / 1.6;
    this.nIteration = 25;
    this.countIterationFL = 25 - 16;
    this.countIterationFR = 25 - 9; */
    this.deltaLeg1 = -0.07;
    this.deltaLeg2 = -0.07 * 0.7 / 1.6;
    this.deltaLeg3 = -0.07;
    this.deltaLeg4 = -0.07 * 0.7 / 1.6;
    this.nIteration = 11;
    this.countIterationFL = 11 - 7;
    this.countIterationFR = 11 - 4;
    this.animateClaws = false;
    this.walkForward = false;
    this.walkBackward = false;

    // jumpnet
    this.requestJump = false;
    this.isJumping = false;
    this.mouse = new THREE.Vector2();
    this.tolerance = Math.pow(10,-2);
    this.targetPosition = new THREE.Vector3();
    this.initialPosition = null;
    this.net = null;

    // face rotation
    this.lambdaRot = 0.5;

    // rotation
    this.turn = 0;

    // climbing down
    this.requestClimbDown = false;
    this.isClimbingDown = false;
    this.initPosClimb = new THREE.Vector3();
  }

  update () {
    this.updateWalk();
    this.updateJump();
    this.updateClaws();
    this.updateTurn();
    this.spider.root.updateMatrix();
  }

  // ------------------------------------ Walk update --------------------------------------------------------

  updateWalk () {

    this.checkEndWorld ();

    if(!this.isChangingEdge && !this.isJumping){
      this.checkEdge();
    }
    if (this.isChangingEdge) {
      // see next face and align inside checkEdge
      // rotate along the x of the spider
      // this one is actived when reaching the edge of a mesh, the upward when front collision occurs
      // this.rotateFace();
      this.rotateFace();
    }

    if( this.requestClimbDown && !this.isClimbingDown ){
      this.checkClimbDown();
    }

    if( this.isClimbingDown){
      this.updateNet();
    }

    this.spider.root.position.set(this.position.x, this.position.y, this.position.z);

    if (this.walkForward || this.walkBackward) {
      this.walkForwardBackwardAnimation();
    }
  }

  checkEdge () {
    if ((!this.main.mode.directions.down && !this.main.mode.directions.up)
      || (this.main.mode.directions.down && this.main.mode.directions.up)){
      return;
    }

    const objNormal = this.spider.root.up;

    const tangentRay = new THREE.Vector3(0, 0, 1);
    tangentRay.applyQuaternion(this.spider.root.quaternion); // need the z pointing the back

    const displacedPositionDown = this.position.clone().add(objNormal.clone().multiplyScalar(-this.epsilon));
    const displacedPositionUp = this.position.clone().add(objNormal.clone().multiplyScalar(this.epsilon));

    if (this.main.mode.directions.down)
      tangentRay.negate();

    let distDown = 9999999;
    this.rayCaster.set(displacedPositionDown, tangentRay);
    const collisionDown = this.rayCaster.intersectObjects(this.main.meshCollection)[0];
    if (collisionDown) {
      distDown = collisionDown.distance;
    }

    let distUp = 9999999;
    this.rayCaster.set(displacedPositionUp, tangentRay);
    const collisionUp = this.rayCaster.intersectObjects(this.main.meshCollection)[0];
    if (collisionUp) {
      distUp = collisionUp.distance;
    }

    let collision;

    let tolerance;
    if (this.main.mode.directions.down){
      tolerance = 0.1
    }
    else {
      tolerance = 0.001;
    }

    //TODO: Nota bene, se e' troppo basso non funziona
    if (distUp > this.main.mode.speed + tolerance && distDown > this.main.mode.speed + tolerance) {
      return;
    }
    if (distUp <= distDown + 0.0001){
      collision = collisionUp;
      this.newNormal = collision.face.normal;
      this.newNormal.applyQuaternion(collision.object.getWorldQuaternion(new THREE.Quaternion()));
    } else {
      collision = collisionDown;
      this.newNormal = collision.face.normal;
      this.newNormal.applyQuaternion(collision.object.getWorldQuaternion(new THREE.Quaternion()));
    }
    const collisionPoint = collision.point;

    if (this.main.mode.directions.down) {
      this.position.set(this.spider.root.position.x, this.spider.root.position.y, this.spider.root.position.z);
      this.main.mode.activeCameraController.position.set(this.position.x, this.position.y, this.position.z);

      return;
    }
    this.position = collisionPoint;
    this.main.mode.activeCameraController.position.set(this.position.x, this.position.y, this.position.z);

    this.isChangingEdge = true;

    // get orbital camera
    if(this.main.mode.activeCameraController instanceof ConstrainedCameraController){
      this.main.mode.activeCameraController = this.main.mode.orbitCameraController;
    }

    if(this.isClimbingDown){
      this.isClimbingDown = false;
    }
    this.findRotationRequested();
  }

  rotateFace () {


    THREE.Quaternion.slerp(this.startQuaternion, this.finalQuaternion, this.spider.root.quaternion, this.lambdaRot);

    //this.lambda += this.increment;
    this.lambdaRot += 0.025;

    this.walkForward = true; // keep the animation

    if(this.lambdaRot >= 1.0){

      this.main.spider.root.quaternion.set(this.finalQuaternion.x,this.finalQuaternion.y,this.finalQuaternion.z,this.finalQuaternion.w);
      //this.main.controller.spiderController.position.set(this.targetPosition.x,this.targetPosition.y,this.targetPosition.z);
      this.main.spider.root.updateMatrix();
      this.spider.root.up = this.newNormal;
      this.lambdaRot = 0.5;
      this.isChangingEdge = false;
      this.walkForward = false;
    }
  }

  checkEndWorld () {
    if (this.position.x <= -19.9 || this.position.x >= 19.69 || this.position.z <= -35.2 || this.position.z >= 35.2){
      this.position.set(this.spider.root.position.x, this.spider.root.position.y, this.spider.root.position.z);
      this.main.mode.activeCameraController.position.set(this.position.x, this.position.y, this.position.z);
    }

    // limit positions :
    //-19.96396180227645, y: 0, z: 35.12432638472683

    //   19.689052609803504, y: 0, z: 35.09399363206599

    // 19.68748555401856, y: -4.502971672600486e-16, z: -35.07878917638166

    // -19.843094254597908, y: 0, z: -35.204782554242435
  }

  walkForwardBackwardAnimation() {

    //console.log(this.countIterationFL)
    //console.log(this.countIterationFR)
    // std was -0.7425997554054885, interval [-0.5,-1.2]
    this.spider.firstLeftLeg.rotation.z += this.deltaLeg1;
    this.countIterationFL += 1;
    this.countIterationFR += 1;

    // std -0.08481777170840049, interval [-0.5, 0.8]
    // delta = 0.01 * 0.7/1.3
    this.spider.thirdLeftLeg.rotation.z += this.deltaLeg2;
    if (this.spider.firstLeftLeg.rotation.z > -0.5 || this.spider.firstLeftLeg.rotation.z < -1.2) {
      this.deltaLeg1 = -this.deltaLeg1;
      this.deltaLeg2 = -this.deltaLeg2;
      //console.log("fl max", this.countIterationFL)
      this.countIterationFL = 0;
    }

    this.spider.firstRightLeg.rotation.z += this.deltaLeg3;
    this.spider.thirdRightLeg.rotation.z += this.deltaLeg4;

    if (this.spider.firstRightLeg.rotation.z < 0.5 || this.spider.firstRightLeg.rotation.z > 1.2) {
      this.deltaLeg3 = -this.deltaLeg3;
      this.deltaLeg4 = -this.deltaLeg4;
      //console.log("fr max", this.countIterationFR)
      this.countIterationFR = 0;
    }

    this.spider.fourthLeftLeg.rotation.z -= this.deltaLeg4 * 1.2;
    this.spider.secondLeftLeg.rotation.z -= this.deltaLeg4 * 1.5;
    this.spider.fourthRightLeg.rotation.z -= this.deltaLeg2 * 1.2;
    this.spider.secondRightLeg.rotation.z -= this.deltaLeg2 * 1.5;

    // THIS PART CONTAINS THE ANIMATION TO HAVE THE LEGS INCREASING THE HEIGHT
    // interpolation to have the wanted movement in height of the leg
    // from y1(0) = -0.9 and y1(n_it/2) = -0.3--> wanted values
    // b = y1(0) and a = 2*[y(n_it/2) - b]/n
    //y1 from count_iteration = 0 to count_iteration = n_iteration/2

    const context = this;
    const y1 = x => {
      return (2 / context.nIteration) * (-0.3 + 0.9) * x - 0.9;
    };
    // second linear interpolation with y2(n_it/2) = -0.2 and  y2(n_it) = -0.9
    const y2 = x => {
      return (2 / context.nIteration) * (-0.9 + 0.3) * x - 0.9 - 2 * (-0.9 + 0.3);
    };

    // fourth leg ranges in [0.78,0.9]
    const y21 = x => {
      return (2 / context.nIteration) * (1.0 - 0.78) * x + 0.78;
    };
    // second linear interpolation with y2(n_it/2) = -0.2 and  y2(n_it) = -0.9
    const y22 = x => {
      return (2 / context.nIteration) * (0.78 - 1.0) * x + 0.78 - 2 * (0.78 - 1.0);
    };

    // quando lancia il passo
    if ((this.walkForward && (this.deltaLeg1 < 0)) || (this.walkBackward && (this.deltaLeg1 > 0)) ) {
      // funzione a tratti
      if (this.countIterationFL < this.nIteration / 2) {
        this.spider.firstLeftLegJ1.rotation.x = y1(this.countIterationFL);
        this.spider.thirdLeftLegJ1.rotation.x = y1(this.countIterationFL);
        this.spider.secondRightLegJ1.rotation.x = y1(this.countIterationFL);
        this.spider.fourthRightLegJ1.rotation.x = y21(this.countIterationFL);
      }
      else {
        this.spider.firstLeftLegJ1.rotation.x = y2(this.countIterationFL);
        this.spider.thirdLeftLegJ1.rotation.x = y2(this.countIterationFL);
        this.spider.secondRightLegJ1.rotation.x = y2(this.countIterationFL);
        this.spider.fourthRightLegJ1.rotation.x = y22(this.countIterationFL);
      }
    }
    if ((this.walkForward && (this.deltaLeg3 > 0)) || (this.walkBackward && (this.deltaLeg3 < 0))){
      // funzione a tratti
      if (this.countIterationFR < this.nIteration / 2){
        this.spider.firstRightLegJ1.rotation.x = y1(this.countIterationFR);
        this.spider.thirdRightLegJ1.rotation.x = y1(this.countIterationFR);
        this.spider.secondLeftLegJ1.rotation.x = y1(this.countIterationFR);
        this.spider.fourthLeftLegJ1.rotation.x = y21(this.countIterationFR);
      }
      else {
        this.spider.firstRightLegJ1.rotation.x = y2(this.countIterationFR);
        this.spider.thirdRightLegJ1.rotation.x = y2(this.countIterationFR);
        this.spider.secondLeftLegJ1.rotation.x = y2(this.countIterationFR);
        this.spider.fourthLeftLegJ1.rotation.x = y22(this.countIterationFR);
      }
    }

    if(this.walkForward) {
      this.walkForward = false;
    }
    if (this.walkBackward) {
      this.walkBackward = false;
    }
  }

  saveInitialConfig () {
    this.FLZ = this.spider.firstLeftLeg.rotation.z;
    this.TLZ = this.spider.thirdLeftLeg.rotation.z;
    this.FRZ = this.spider.firstRightLeg.rotation.z;
    this.TRZ = this.spider.thirdRightLeg.rotation.z;
    this.FOLZ = this.spider.fourthLeftLeg.rotation.z;
    this.SLZ = this.spider.secondLeftLeg.rotation.z;
    this.FORZ = this.spider.fourthRightLeg.rotation.z;
    this.SRZ = this.spider.secondRightLeg.rotation.z;
    this.FLX = this.spider.firstLeftLegJ1.rotation.x;
    this.TLX = this.spider.thirdLeftLegJ1.rotation.x;
    this.SRX = this.spider.secondRightLegJ1.rotation.x;
    this.FORX = this.spider.fourthRightLegJ1.rotation.x;
    this.FRX = this.spider.firstRightLegJ1.rotation.x;
    this.TRX = this.spider.thirdRightLegJ1.rotation.x;
    this.SLX = this.spider.secondLeftLegJ1.rotation.x;
    this.FOLX = this.spider.fourthLeftLegJ1.rotation.x;
  }

  reachStandardPositon () {
    // console.log(this.FLZ)
    this.spider.firstLeftLeg.rotation.z = this.FLZ;
    this.spider.thirdLeftLeg.rotation.z = this.TLZ;
    this.spider.firstRightLeg.rotation.z = this.FRZ;
    this.spider.thirdRightLeg.rotation.z = this.TRZ;
    this.spider.fourthLeftLeg.rotation.z = this.FOLZ;
    this.spider.secondLeftLeg.rotation.z = this.SLZ;
    this.spider.fourthRightLeg.rotation.z = this.FORZ;
    this.spider.secondRightLeg.rotation.z = this.SRZ;
    this.spider.firstLeftLegJ1.rotation.x = this.FLX;
    this.spider.thirdLeftLegJ1.rotation.x = this.TLX;
    this.spider.secondRightLegJ1.rotation.x = this.SRX;
    this.spider.fourthRightLegJ1.rotation.x = this.FORX;
    this.spider.firstRightLegJ1.rotation.x = this.FRX;
    this.spider.thirdRightLegJ1.rotation.x = this.TRX;
    this.spider.secondLeftLegJ1.rotation.x = this.SLX;
    this.spider.fourthLeftLegJ1.rotation.x = this.FOLX;
  }

  // ------------------------------------ Jump update --------------------------------------------------------


  updateJump () {
    if(!this.isJumping && this.requestJump && !this.isChangingEdge){
      this.checkJump();
      this.requestJump = false;

    }
    if(this.isJumping){

      // translation
      const pathJump = (this.targetPosition.clone().multiplyScalar(this.lambda));
      pathJump.add(this.initialPosition.clone().multiplyScalar(1 - this.lambda));
      this.position.set(pathJump.x, pathJump.y, pathJump.z);
      this.main.mode.activeCameraController.position.set(pathJump.x, pathJump.y, pathJump.z);

      // rotation
      THREE.Quaternion.slerp(this.startQuaternion, this.finalQuaternion, this.spider.root.quaternion, this.lambda);
      this.lambda += 0.01;

      // alla fin
      if (this.lambda >= 1.0){
        // be sure of avoiding numerical issues
        this.spider.root.quaternion.set(this.finalQuaternion.x,this.finalQuaternion.y,this.finalQuaternion.z,this.finalQuaternion.w);
        this.position.set(this.targetPosition.x,this.targetPosition.y,this.targetPosition.z);
        this.lambda = 0.0;
        this.isJumping = false;
        this.spider.root.up = this.newNormal;
        this.main.scene.remove(this.net)
        this.net.geometry.dispose();
        this.net.material.dispose();
        this.net = undefined;
        this.main.scene.dispose();
        this.main.mode.update();

      }
    }
  }

  checkJump () {
    this.rayCaster.setFromCamera(this.mouse, this.main.camera);
    // the scene scene is  organized to have as third element all the meshes

    const intersectsObj = this.rayCaster.intersectObjects(this.main.meshCollection)[0];
    if (intersectsObj) {
      // console.log(intersectsObj)
      //the normal has to go in world coordinates
      const a = new THREE.Quaternion();
      this.newNormal = intersectsObj.face.normal.clone(); // intersectsObj.face.normal.clone().
      // console.log('Old normal:',  this.newNormal);
      this.newNormal.applyQuaternion(intersectsObj.object.getWorldQuaternion(a));
      // console.log('New normal:',  this.newNormal)

      //this.newNormal.applyQuaternion(objectQuaternion);
      //const checkSame = this.newNormal.clone().cross(this.spider.root.up);

      // now throw a raycaster directly from the spider to check intersections (otherwise it goes through walls)
      const displacedPosition = this.spider.root.up.clone().multiplyScalar(0.01);
      displacedPosition.add(this.position);
      this.rayCaster.set(displacedPosition, this.position.clone().negate().add(intersectsObj.point).normalize());
      const intersectsObjFromSpider = this.rayCaster.intersectObjects(this.main.meshCollection)[0];

      // this.castSpiderWebDebug(this.position, this.position.clone().negate().add(intersectsObj.point).normalize(), 100)
      // !(Math.sqrt(checkSame.clone().dot(checkSame)) < this.tolerance)
      // robust control of same normal
      if (intersectsObjFromSpider.distance <= 100 && SpiderController.tolerantEquality(intersectsObjFromSpider.point, intersectsObj.point) ) {

        this.initialPosition = this.spider.root.position.clone();
        this.targetPosition.set(intersectsObj.point.x, intersectsObj.point.y, intersectsObj.point.z);

        this.grippedObject = intersectsObj.object.name;

        this.lambda = 0.0;

        this.isJumping = true;

        if(this.isClimbingDown) {
          this.isClimbingDown = false;
        }

        this.findRotationRequested(); // will find the 2 quaternions to be interpolated

        // cast the spider net
        this.castSpiderWeb();
      }
    }

  }

  findRotationRequested () {

    this.startQuaternion = this.spider.root.quaternion.clone();
    // rotation
    this.spider.root.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),this.newNormal);

    let alignDirection;
    if(this.isJumping) {
      alignDirection = (this.targetPosition.clone()).add(this.spider.root.position.clone().negate());
    }
    else if(this.isChangingEdge){
      alignDirection = (this.position.clone()).add(this.spider.root.position.clone().negate());
    }
    alignDirection.projectOnPlane(this.newNormal).normalize();
    const zSpider = new THREE.Vector3(0,0,1).applyQuaternion(this.spider.root.quaternion).negate();
    const thetaZ = alignDirection.angleTo(zSpider);
    this.spider.root.rotateOnAxis(new THREE.Vector3(0,1,0), thetaZ);

    // make sure that the rotation has gone on the right verse
    let zFinal = new THREE.Vector3(0,0,1).applyQuaternion(this.spider.root.quaternion); // no negate !!

    if (!((Math.abs(zFinal.x + alignDirection.x ) < this.tolerance) &&
      (Math.abs(zFinal.y + alignDirection.y ) < this.tolerance) &&
      (Math.abs(zFinal.z + alignDirection.z )< this.tolerance))) {
      this.spider.root.rotateOnAxis(new THREE.Vector3(0,1,0), -2 * thetaZ);
      zFinal = new THREE.Vector3(0,0,1).applyQuaternion(this.spider.root.quaternion.clone());
    }

    this.finalQuaternion.set(this.spider.root.quaternion.x , this.spider.root.quaternion.y,
      this.spider.root.quaternion.z, this.spider.root.quaternion.w);
    this.spider.root.quaternion.set(this.startQuaternion.x, this.startQuaternion.y,
      this.startQuaternion.z, this.startQuaternion.w);

  }

  castSpiderWeb () {
    const netPointer = (this.targetPosition.clone()).add(this.spider.root.position.clone().negate());
    const geometry = new THREE.CylinderGeometry(0.02, 0.02, netPointer.length(), 32);
    const material = new THREE.MeshPhongMaterial({ color: 0x808080, wireframe: false });
    this.net = new THREE.Mesh(geometry, material);
    this.net.position.set(this.spider.root.position.x, this.spider.root.position.y, this.spider.root.position.z);

    const axis = new THREE.Vector3(0, 1, 0);
    this.net.quaternion.setFromUnitVectors(axis, netPointer.clone().normalize());
    this.net.translateOnAxis(axis, netPointer.length()/2);

    this.net.name = "net";
    this.main.scene.add(this.net);
  }

  // ------------------------------------ Equality with tolerance ----------------------------------------

  static tolerantEquality (X, Y) { // da usare solo per raycaster spider - punto che da un grosso errore
    return (Math.abs(X.x - Y.x) < 0.1) && (Math.abs(X.y - Y.y)
      < 0.1) && (Math.abs(X.z - Y.z) < 0.1);
  }

  // ------------------------------------ Claws update ---------------------------------------------------

  updateClaws () {
    if(this.animateClaws) {
      this.spider.leftClaw.rotation.z += this.deltaClaws; // beginning -1.1084125592535539
      this.spider.rightClaw.rotation.z -= this.deltaClaws; // beginning 1.122012840960335
      if (this.spider.leftClaw.rotation.z > -0.4) this.deltaClaws = -this.deltaClaws; // open
      if (this.spider.leftClaw.rotation.z < -1.2) { // close
        this.aboutToEnd = true;
        this.deltaClaws = -this.deltaClaws;
      }

      if (this.aboutToEnd && this.spider.leftClaw.rotation.z > -1.1) {
        this.aboutToEnd = false;
        this.animateClaws = false;
      }
    }
  }

  // ------------------------------------ Climb Down  ---------------------------------------------------

  checkClimbDown () {
    this.requestClimbDown = false;
    if(SpiderController.tolerantEquality(this.spider.root.up, new THREE.Vector3( 0, -1, 0))){
      this.initPosClimb.set( this.position.x, this.position.y, this.position.z );
      this.isClimbingDown = true;
      this.grippedObject = "";
      // ruoto il ragno in modo che la sua zeta diventi la sua up e metto la sua up (1,0,0)

      this.spider.root.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,-1),new THREE.Vector3( 0, -1, 0));
      this.spider.root.up = new THREE.Vector3(1,0,0);
      this.position.y -= 0.2;

      const distance = this.initPosClimb.y - this.position.y;
      const geom = new THREE.CylinderGeometry(0.01, 0.01, distance, 32);
      const mat = new THREE.MeshPhongMaterial({color: randomColor(), wireframe: false});
      this.verticalNet = new THREE.Mesh(geom, mat);
      this.verticalNet.position.set(this.initPosClimb.x, this.initPosClimb.y, this.initPosClimb.z);
      const axis = new THREE.Vector3(0, 1, 0);
      const nAxis = new THREE.Vector3( 0, -1, 0);
      this.verticalNet.quaternion.setFromUnitVectors(axis, nAxis);
      this.verticalNet.translateOnAxis(axis, distance / 2);

      this.verticalNet.name = 'webVertical';
      this.main.scene.add(this.verticalNet);
    }
  }

  updateNet ( ) {

    // remove the old one and build a new one
    if(!this.spider.root.position.equals(this.position)) {

      this.main.scene.remove(this.verticalNet);
      this.verticalNet.geometry.dispose();
      this.verticalNet.material.dispose();
      this.verticalNet = undefined;

      const distance = this.initPosClimb.y - this.position.y;
      const geom = new THREE.CylinderGeometry(0.01, 0.01, distance, 32);
      const mat = new THREE.MeshPhongMaterial({color: randomColor(), wireframe: false});
      this.verticalNet = new THREE.Mesh(geom, mat);
      this.verticalNet.position.set(this.initPosClimb.x, this.initPosClimb.y, this.initPosClimb.z);
      const axis = new THREE.Vector3(0, 1, 0);
      const nAxis = new THREE.Vector3(0, -1, 0);
      this.verticalNet.quaternion.setFromUnitVectors(axis, nAxis);
      this.verticalNet.translateOnAxis(axis, distance / 2);

      this.verticalNet.name = "verticalNet";
      this.main.scene.add(this.verticalNet);
    }

  }



  // ------------------------------------ Turn update ---------------------------------------------------

  updateTurn () {
    if(this.turn === 1){
      this.spider.root.rotateOnAxis(new THREE.Vector3(0, 1, 0), 10 * Math.PI / 360);
    }
    if(this.turn === -1){
      this.spider.root.rotateOnAxis(new THREE.Vector3(0, 1, 0), -10 * Math.PI / 360);
    }
    this.turn = 0;
  }


  castSpiderWebDebug (position, rayDirection, distance) {
    const geometry = new THREE.CylinderGeometry(0.01, 0.01, distance, 32);
    const material = new THREE.MeshPhongMaterial({color: randomColor(), wireframe: false});
    const b = new THREE.Mesh(geometry, material);

    //this.frontPosition = this.zSpider.clone().negate().multiplyScalar(0.3).add(this.main.spider.root.position.clone());
    //this.b.position.set(this.frontPosition.x,this.frontPosition.y,this.frontPosition.z);
    //this.b.position.set(this.spider.root.position.x,this.spider.root.position.y,this.spider.root.position.z);
    b.position.set(position.x, position.y, position.z);

    const axis = new THREE.Vector3(0, 1, 0);
    b.quaternion.setFromUnitVectors(axis, rayDirection);
    b.translateOnAxis(axis, distance / 2);

    b.name = 'webDebug';
    this.main.scene.add(b);
  }
}


export class GameGUI extends GUI {
  constructor (guiDiv, canvas) {
    super(guiDiv, canvas);
    this.crosshairEnabled = false;

    this.crosshair = document.createElement('img');
    this.crosshair.id = 'crosshair';
    this.crosshair.classList.add('noselect');
    this.crosshair.src = './dist/models/pointer.png'
    this.crosshair.style.visibility = 'hidden';
  }

  enableCrosshair () {
    this.crosshair.style.visibility = 'visible';
    this.crosshairEnabled = true;
    this.crosshair.style.left = divPx(window.innerWidth, 2);
    this.crosshair.style.top = divPx(window.innerHeight, 2);
  }

  disableCrosshair () {
    this.crosshair.style.visibility = 'hidden';
    this.crosshairEnabled = false;
    //this.crosshair.style.left = divPx(this.canvas.width, 2);
    //this.crosshair.style.top = divPx(this.canvas.height, 2);
  }

  load () {
    this.guiDiv.append(this.crosshair);
  }

  unload () {
    this.crosshair.remove();
  }
}