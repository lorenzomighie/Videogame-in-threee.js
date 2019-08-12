import * as THREE from 'three'

class CameraController {
  constructor (camera, position) {
    this.camera = camera;
    this.position = position.clone();
  }

  rotate () {

  }

  update () {

  }
}

export class OrbitCameraController extends CameraController {

  constructor (camera, position, sensitivity, meshColl, main) {
    super(camera, position);
    this.sensitivity = sensitivity;
    this.phi = 70;
    this.theta = 280;
    this.radius = 2;
    this.rayCaster = new THREE.Raycaster();
    this.upSpider = new THREE.Vector3();
    this.meshCollection = meshColl;
    this.main = main;
    this.upSpider = new THREE.Vector3();
    this.init = true;
  }

  rotate(deltaX, deltaY) {
    this.theta -= deltaX * this.sensitivity;
    this.theta %= 720;
    this.phi += deltaY * this.sensitivity;
    this.phi = Math.min(170, Math.max(15, this.phi));
  }

  update(up, quat) {
    this.upSpider = up;
    this.init = true;
    if(this.cameraLimitReached()) {
      this.camera.position.set(this.position.x, this.position.y, this.position.z);
      this.init = false;
      //this.camera.position.add(this.upSpider.clone().multiplyScalar(1.9));
      this.camera.position.add(new THREE.Vector3(0, 1, 0).applyQuaternion(quat).multiplyScalar(1.5));
      //console.log(this.cameraLimitReached())
      //const zSpider = new THREE.Vector3(0,0,1.414).applyQuaternion(this.quaternion);
      //console.log("zspider", zSpider)
      //console.log("up", this.upSpider)
      //this.camera.position.add(zSpider);
      if (this.cameraLimitReached()) {
        this.camera.position.set(this.position.x, this.position.y, this.position.z);
        this.camera.position.add(new THREE.Vector3(0, 1, 0).applyQuaternion(quat).multiplyScalar(1));
        this.camera.position.add(new THREE.Vector3(-1, 0, 0).applyQuaternion(quat).multiplyScalar(1));
        // console.log(this.cameraLimitReached())

        if (this.cameraLimitReached()) {
          this.camera.position.set(this.position.x, this.position.y, this.position.z);
          this.camera.position.add(new THREE.Vector3(0, 1, 0).applyQuaternion(quat).multiplyScalar(0.6));
          this.camera.position.add(new THREE.Vector3(1, 0, 0).applyQuaternion(quat).multiplyScalar(0.6));
          this.camera.position.add(new THREE.Vector3(0, 0, 1).applyQuaternion(quat).multiplyScalar(0.6));
          // console.log(this.cameraLimitReached())
        }
      }
    }else{

      this.camera.position.x = this.position.x + this.radius * Math.sin(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
      this.camera.position.y = this.position.y + this.radius * Math.sin(this.phi * Math.PI / 360);
      this.camera.position.z = this.position.z + this.radius * Math.cos(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);

    }
    this.camera.updateMatrix();
    this.camera.lookAt(this.position);
  }

  cameraLimitReached () {

    const virtualPosition = new THREE.Vector3();

    if (this.init) {
      const virtualX = this.position.x + this.radius * Math.sin(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
      const virtualY = this.position.y + this.radius * Math.sin(this.phi * Math.PI / 360);
      const virtualZ = this.position.z + this.radius * Math.cos(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
      virtualPosition.set(virtualX, virtualY, virtualZ);
    } else{
      virtualPosition.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    }

    // tolerance also on this so that it does not go below the ground
    virtualPosition.add(this.upSpider.clone().multiplyScalar(- 0.1));
    // cast a ray from spider position to camera position to see if
    // a limit is reached, if so, stop the movement and go back

    const displacedPosition = this.upSpider.clone().multiplyScalar(0.01);
    displacedPosition.add(this.position);
    this.rayCaster.set(displacedPosition, this.position.clone().negate().add(virtualPosition).normalize());
    const intersectsObjFromSpider = this.rayCaster.intersectObjects(this.meshCollection)[0];

    //this.castSpiderWebDebug(displacedPosition, this.position.clone().negate().add(virtualPosition).normalize(), 2)
    if(intersectsObjFromSpider && intersectsObjFromSpider.distance < this.radius - 0.05)  {
      return true;
    }else{
      //return false;
    }
    return false;
  }
}

export class ConstrainedCameraController extends CameraController {

  constructor (camera, position) {
    super(camera, position);
    this.quaternion = new THREE.Quaternion();
    this.cameraDirection = new THREE.Vector3(0,1,1);
    this.lookDirection = new THREE.Vector3(0,-1,-3);
  }

  rotate (quaternion) {
    this.quaternion = quaternion;
  }

  update () {
    const cameraPos = this.cameraDirection.clone().applyQuaternion(this.quaternion); // displacement
    cameraPos.add(this.position);
    this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    const lookDisplacement = this.lookDirection.clone().applyQuaternion(this.quaternion);
    const lookAt = this.position.clone().add(lookDisplacement);
    this.camera.updateMatrix();
    this.camera.lookAt(lookAt);
  }
}

export class LandscapeCameraController extends CameraController {

  constructor (camera, position, sensitivity) {
    super(camera, position);
    this.camera = camera;
    this.position = position;
    this.sensitivity = sensitivity;
    this.phi = 45;
    this.theta = 0;
    this.radius = 50;
  }

  rotate(deltaX, deltaY) {
    this.theta -= deltaX * this.sensitivity;
    this.theta %= 720;
    this.phi += deltaY * this.sensitivity;
    this.phi = Math.min(170, Math.max(15, this.phi));
  }

  update() {
      this.camera.position.x = this.position.x + this.radius * Math.sin(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
      this.camera.position.y = this.position.y + this.radius * Math.sin(this.phi * Math.PI / 360);
      this.camera.position.z = this.position.z + this.radius * Math.cos(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
      this.camera.updateMatrix();
      this.camera.lookAt(this.position);
  }

}