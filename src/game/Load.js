import { Spider } from './Spider'
import { default as GLTFLoader } from "three-gltf-loader"
import * as THREE from 'three'
import { GUI } from './GUI'
import { Mode } from './Mode'
import { MenuMode } from './Menu'
import { GameMode } from './Game'
import {PauseMode} from "./Pause";
import {RiddleMode} from "./Riddle";
import {TutorialMode} from "./Tutorial";
import {LandscapeCameraController} from "./Camera";
import { MeshLambertMaterial } from 'three'

export class LoadMode extends Mode {
  constructor (main) {
    const gui = new LoadGUI(main.guiDiv, main.canvas);
    super(main, gui, false);
    this.worldLoaded = false;
    this.spiderLoaded = false;
    this.nonGrippable = ['Key', 'Sky', 'Book', 'Magic1', 'Magic2', 'Magic3', 'Cube.034_0', 'Cube.034_1', 'NoW1',
    'NoW2', 'NoW3', 'NoW4', 'NoW5', 'NoW6', 'NoW7', 'Chick', 'mesh_0', 'mesh_1', 'Hedge1', 'Hedge2', 'Hedge3' ,'Hedge4'];

    this.main.spider = new Spider(this.main, this.main.startPosition);

    this.loadWorld();

  }

  loadWorld () {
    const loader = new GLTFLoader();
    loader.load('./dist/models/world/world.glb', (object) => {
      this.main.scene.add(object.scene);

      object.scene.traverse((obj) => {
        if (obj.name === 'Sky') {
          obj.material = new THREE.MeshBasicMaterial({ map: obj.material.map });
        }
        if (obj.name.includes('Window') || obj.name.includes('Magic')){
         // console.log('Transparent mesh: ', obj);
          obj.material.transparent = true;
          obj.material.opacity = 0.35;
        }
      });
      this.collectMeshes(object.scene);
      // console.log(this.main.meshCollection)
      this.worldLoaded = true;
      const hiddenKey = this.main.scene.getObjectByName('Key');
      hiddenKey.position.set(-2.197236182266963, 11.600000619888306, 8.471925713148226);
      this.main.key0 = this.main.scene.getObjectByName('Key').clone();
      this.main.key0.rotation.x = Math.PI/2;
      this.main.key0.position.set(0.29214821871473184, 6.209139479733212, -8);
      this.main.scene.add(this.main.key0);
      this.main.key1 = this.main.scene.getObjectByName('Key').clone();
      this.main.key1.rotation.x = Math.PI/2;
      this.main.key1.rotation.z = Math.PI/2;
      this.main.key1.position.set(7.370334039870183,1.788003945350647, 19.44658904596832);
      this.main.scene.add(this.main.key1);
      this.main.key2 = this.main.scene.getObjectByName('Key').clone();
      this.main.key2.position.set(5.790642152170828, 0.50000000149011612, -5.114415128789339);
      this.main.key2.rotation.y = Math.PI/2;
      this.main.scene.add(this.main.key2);
      this.main.key3 = this.main.scene.getObjectByName('Key').clone();
      this.main.key3.position.set(-7.827254525456919, 1.9, 15.880617896241798);
      this.main.key3.rotation.y = Math.PI/2;
      this.main.scene.add(this.main.key3);
      this.main.key4 = this.main.scene.getObjectByName('Key').clone();
      this.main.key4.position.set(7.104420790351413, 2.3, 12.08963644339828);
      this.main.key4.rotation.y = Math.PI/2;
      this.main.scene.add(this.main.key4);
      this.main.key5 = this.main.scene.getObjectByName('Key').clone();
      this.main.key5.position.set(-9.931204319000244, 7.217097432997458, 13.339855251442767);
      this.main.key5.rotation.y = Math.PI/2;
      this.main.scene.add(this.main.key5);
      this.main.key6 = this.main.scene.getObjectByName('Key').clone();
      this.main.key6.position.set(-6.867679192801956, 8.235604496961926 , -3.4227404586147387);
      this.main.key6.rotation.y = Math.PI/2;
      this.main.scene.add(this.main.key6);
      this.main.chick = this.main.scene.getObjectByName('ChickScene');
      this.main.chick.position.set(-11.854765048054903, 10.877637737509539, 22.472826621821646);
      this.main.fish = this.main.scene.getObjectByName('Fish');
      // console.log(this.main.scene.getObjectByName('ChickScene'))
    });
  }

  collectMeshes (scene) {
    if (scene.children.length === 0) {

      if (scene.type === 'Mesh' && !this.nonGrippable.includes(scene.name)) {
        this.main.meshCollection.push(scene);
      }
      return;
    }
    for (let child of scene.children) {
      if(child.name !== 'Fish' && child.name !== 'ChickScene') {
        this.collectMeshes(child)
      }
    }
  }

  update () {
    super.update();
    if (this.worldLoaded && this.spiderLoaded) {
      this.main.gameMode = new GameMode(this.main);
      this.main.pauseMode = new PauseMode(this.main);
      this.main.riddleMode = new RiddleMode(this.main);
      this.main.menuMode = new MenuMode(this.main);
      this.main.tutorialMode = new TutorialMode(this.main);
      //this.main.riddleMode.gui.update(8);
      this.main.changeMode(this.main.menuMode);
      //this.main.changeMode(this.main.menuMode);
    }
  }
}

export class LoadGUI extends GUI {
  constructor (guiDiv, canvas) {
    super(guiDiv, canvas);
    this.loadingNode = document.createElement('div');
    this.loadingNode.id = 'load';
    this.loadingText = document.createTextNode('Loading ...');
    this.loadingNode.appendChild(this.loadingText);
  }

  load () {
    super.load();
    //this.canvas.style.visibility = 'hidden';
    this.guiDiv.appendChild(this.loadingNode);
  }

  unload () {
    super.unload();
    //this.canvas.style.visibility = 'visible';
    this.guiDiv.removeChild(this.loadingNode);
  }
}