import { GameMode } from './Game'
import {LoadMode} from "./Load";
import {PauseMode} from "./Pause";

export class InputManager {
  constructor (main) {
    this.main = main;
    this.canvas = this.main.canvas;
    this.guiDiv = this.main.guiDiv;
    this.canvas = this.main.canvas;
    this.guiDiv.onclick = (event) => this.onGuiClick(event);
    this.canvas.onclick = (event) => this.onCanvasClick(event);
    this.isLocked = false;

    this.canvas.addEventListener("mousemove", event => this.onMouseMove(event));
    document.addEventListener("keydown", event => this.onKeyDown(event), false);
    document.addEventListener("keyup", event => this.onKeyUp(event), false);
    document.addEventListener('pointerlockchange', () => {
      this.isLocked = document.pointerLockElement === this.canvas;
      if(!this.isLocked){
        // mustn't do it the first iteration
        this.main.changeMode(this.main.pauseMode);
        if (this.main.oldMode instanceof GameMode){
          this.main.gameMode.resetButtons();
        }
      }
      }, false);

  }

  onGuiClick (event) {
    if (this.main.mode != null)
      this.main.mode.handleAction(event, 'click', true);
  }

  onCanvasClick (event) {
    if (this.main.mode instanceof GameMode){
      this.canvas.requestPointerLock();
      this.isLocked = true;
    }
  }

  onMouseMove (event) {
    if (this.main.mode != null)
      this.main.mode.handleMouseMove(event.movementX, event.movementY);
  }


  onKeyDown (event) {
    if (this.main.mode != null) {
      const key = event.key.toLowerCase();
      this.main.mode.handleAction(event, key, true);
    }
  }

  onKeyUp (event) {
    if (this.main.mode != null) {
      const key = event.key.toLowerCase();
      this.main.mode.handleAction(event, key, false);
    }
  }

}