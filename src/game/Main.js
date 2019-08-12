import * as THREE from 'three'
import { InputManager } from './InputManager'
import { LoadMode } from './Load'
import {GameMode} from "./Game";
import {LandscapeCameraController} from "./Camera";

export class Main {
  constructor () {
    const scope = this;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.gammaOutput = true;
    this.canvas = this.renderer.domElement
    this.canvas.id = 'canvas';
    this.guiDiv = document.createElement('div');
    this.guiDiv.id = 'gui';
    this.guiDiv.appendChild(this.canvas);
    document.body.appendChild(this.guiDiv);
    this.meshCollection = [];
    this.spider = null;
    this.mode = null;
    this.pauseMode = null;
    this.gameMode = null;
    this.riddleMode = null;
    this.tutorialMode = null;
    this.oldMode = null;
    this.loadMode = null;

    this.key1 = null;
    this.key2 = null;
    this.key3 = null;
    this.key4 = null;
    this.key5 = null;
    this.key6 = null;
    this.fish = null;
    this.chick = null;


    function onWindowResize()
    {
      scope.camera.aspect = window.innerWidth / window.innerHeight;
      scope.camera.updateProjectionMatrix();
      scope.renderer.setSize(window.innerWidth, window.innerHeight);
      // effectFXAA.uniforms['resolution'].value.set(1 / (window.innerWidth * dpr), 1 / (window.innerHeight * dpr));
      // scope.composer.setSize(window.innerWidth * dpr, window.innerHeight * dpr);
    }

    window.addEventListener('resize', onWindowResize, false);

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdddddd);

    // light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    this.scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 0.2);
   // pointLight.shininess = 0;

    this.scene.add(pointLight);

    /*this.dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.dirLight.castShadow = true;
    this.dirLight.position.set(1, 1, 1);
    this.dirLight.target.position.set(0, 0, 0);
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 1;
    this.dirLight.shadow.camera.far = 100;

    this.dirLight.shadow.camera.top = 50;
    this.dirLight.shadow.camera.right = 50;
    this.dirLight.shadow.camera.bottom = -50;
    this.dirLight.shadow.camera.left = -50;

    this.scene.add(this.dirLight);
*/
    // camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);

    // input
    this.inputManager = new InputManager(this);
  }

  changeMode(newMode) {
    //console.log("oldMode", this.mode)
    //console.log("newMode", newMode)
    if (this.mode !== null) {
      this.mode.gui.unload();
      this.oldMode = this.mode;
    }
    this.mode = newMode;
    this.mode.gui.load();
  }

  mainLoop () {
    requestAnimationFrame(() => this.mainLoop());
    this.mode.update();
    if (this.mode.canRender) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  start () {
    this.cameraController = new LandscapeCameraController(this.camera, new THREE.Vector3(0, 4, 0), 1);

    this.loadMode = new LoadMode(this);
    this.changeMode(this.loadMode);
    this.mainLoop();
  }
}

