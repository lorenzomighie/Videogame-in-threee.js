import { OrbitCameraController } from './Camera'
import * as THREE from 'three'
import { GUI } from './GUI'
import { Mode } from './Mode'
import { GameMode } from './Game'

export class PauseMode extends Mode {
  constructor (main) {
    const gui = new PauseGUI(main.guiDiv, main.canvas);
    super(main, gui, false);
  }

  update () {
    super.update();
  }

  handleMouseMove (deltaX, deltaY) {

  }

  handleAction (event, key, value) {
    if(event.target === this.gui.returnButton){
      this.main.canvas.requestPointerLock();
      this.main.changeMode(this.main.oldMode);
    }
  }

}

export class PauseGUI extends GUI {

  constructor (guiDiv, canvas) {
    super(guiDiv, canvas);

    // pauseTitle
    this.pauseTitle = document.createElement('h1');
    this.pauseTitle.id = 'pauseTitle';
    this.pauseTitle.classList.add('noselect');
    this.pauseTitle.classList.add('title');
    const pauseText = document.createTextNode('PAUSE');
    this.pauseTitle.appendChild(pauseText);

    // returnButton
    this.returnButton = document.createElement('button');
    this.returnButton.id = 'playButton';
    this.returnButton.classList.add('noselect');
    this.returnButton.classList.add('flat-button');
    const returnButtonText = document.createTextNode('RETURN');
    this.returnButton.appendChild(returnButtonText);
  }


  load () {
    super.load();
    this.guiDiv.append(this.pauseTitle);
    this.guiDiv.append(this.returnButton);
  }

  unload () {
    super.unload();
    this.pauseTitle.remove();
    this.returnButton.remove();
  }
}