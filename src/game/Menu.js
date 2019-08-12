import {LandscapeCameraController, OrbitCameraController} from './Camera'
import * as THREE from 'three'
import { GUI } from './GUI'
import { Mode } from './Mode'
import { GameMode } from './Game'

export class MenuMode extends Mode {
  constructor (main) {
    const gui = new MenuGUI(main.guiDiv, main.canvas);
    super(main, gui, true);
    this.cameraController = new LandscapeCameraController(this.main.camera, new THREE.Vector3(0, 4, 0), 1);
    //this.cameraController.radius = 50;
    //this.cameraController.phi = 45;

  }

  update () {
    super.update();
    this.cameraController.rotate(+0.1, 0);
    this.cameraController.update();
  }

  handleMouseMove (deltaX, deltaY) {

  }

  handleAction (event, key, value) {
    if(event.target === this.gui.playButton){
      this.main.canvas.requestPointerLock();
      this.main.changeMode(this.main.gameMode);
    }
  }

}

export class MenuGUI extends GUI {

  constructor (guiDiv, canvas) {
    super(guiDiv, canvas);

    // title
    this.menuTitle = document.createElement('h1');
    this.menuTitle.id = 'menuTitle';
    this.menuTitle.classList.add('noselect');
    this.menuTitle.classList.add('title');
    const titleText = document.createTextNode('SPIDER HOUSE');
    this.menuTitle.appendChild(titleText);

    // play text
    this.textMenu = document.createElement('div');
    this.textMenu.id = 'textMenu';
    this.textMenu.classList.add('noselect');
    const textMenu = document.createTextNode('Escape from the house: collect all the keys');
    this.textMenu.appendChild(textMenu);

    // playButton
    this.playButton = document.createElement('button');
    this.playButton.id = 'playButton';
    this.playButton.classList.add('noselect');
    this.playButton.classList.add('flat-button');
    const playButtonText = document.createTextNode('PLAY');
    this.playButton.appendChild(playButtonText);
  }


  load () {
    super.load();
    this.guiDiv.append(this.menuTitle);
    this.guiDiv.append(this.playButton);
    this.guiDiv.append(this.textMenu);
  }

  unload () {
    super.unload();
    this.menuTitle.remove();
    this.playButton.remove();
    this.textMenu.remove();
  }
}