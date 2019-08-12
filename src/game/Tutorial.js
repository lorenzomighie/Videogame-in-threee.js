import { OrbitCameraController } from './Camera'
import * as THREE from 'three'
import { GUI } from './GUI'
import { Mode } from './Mode'
import { GameMode } from './Game'
import {LoadMode} from "./Load";
import {MenuMode} from "./Menu";

export class TutorialMode extends Mode {
    constructor (main) {
        const gui = new TutorialGUI(main.guiDiv, main.canvas);
        super(main, gui, false);
        this.firstCall = true;
    }

    update (riddleNumber) {
        super.update();
    }

    handleMouseMove (deltaX, deltaY) {

    }

    handleAction (event, key, value) {
        //console.log(key)
        if(key === 't' && value){
            //console.log(this.main.gameMode.firstUpdate)
            //console.log(this.main.oldMode)

            if (this.main.oldMode instanceof GameMode){
                this.main.gameMode.resetButtons();
                if(this.main.gameMode.isChangingMode){
                    this.main.gameMode.isChangingMode = false;
                }
            }
            /*if(this.firstCall){
                this.firstCall = false;
                //this.main.changeMode(this.main.clickMode);
                this.main.canvas.requestPointerLock();
                this.main.changeMode(this.main.gameMode);
            } */

            this.main.changeMode(this.main.gameMode);

        }
    }

}

export class TutorialGUI extends GUI {

    constructor (guiDiv, canvas ) {
        super(guiDiv, canvas);

        this.tutorialLine1 = document.createElement('div');
        this.tutorialLine1.id = 'tutorialLine1';
        this.tutorialLine1.classList.add('noselect');
        this.tutorialLine1.classList.add('tutorialSentence');
        this.tutorialLine1.classList.add('title');
        const tutorialText1 = document.createTextNode('TUTORIAL ');
        this.tutorialLine1.appendChild(tutorialText1);

        this.tutorialLine2L = document.createElement('div');
        this.tutorialLine2L.id = 'tutorialLine2L';
        this.tutorialLine2L.classList.add('noselect');
        this.tutorialLine2L.classList.add('tutorialSentence');
        const tutorialLine2L = document.createTextNode('press');
        this.tutorialLine2L.appendChild(tutorialLine2L);

        this.t = document.createElement('img');
        this.t.id = 't';
        this.t.src = './dist/models/t.png';

        this.tutorialLine2R = document.createElement('div');
        this.tutorialLine2R.id = 'tutorialLine2R';
        this.tutorialLine2R.classList.add('noselect');
        this.tutorialLine2R.classList.add('tutorialSentence');
        const tutorialLine2R = document.createTextNode('to enter/exit the tutorial');
        this.tutorialLine2R.appendChild(tutorialLine2R);

        this.wasd = document.createElement('img');
        this.wasd.id = 'wasd';
        this.wasd.src = './dist/models/wasd.png';

        this.wasdText = document.createElement('div');
        this.wasdText.id = 'wasdText';
        this.wasdText.classList.add('noselect');
        this.wasdText.classList.add('tutorialSentence');
        const wasdText = document.createTextNode('Movements');
        this.wasdText.appendChild(wasdText);

        this.ctrl = document.createElement('img');
        this.ctrl.id = 'ctrl';
        this.ctrl.src = './dist/models/ctrl.png';

        this.ctrlText = document.createElement('div');
        this.ctrlText.id = 'ctrlText';
        this.ctrlText.classList.add('noselect');
        this.ctrlText.classList.add('tutorialSentence');
        const ctrlText = document.createTextNode('Point');
        this.ctrlText.appendChild(ctrlText);

        this.click = document.createElement('div');
        this.click.id = 'click';
        this.click.classList.add('noselect');
        this.click.classList.add('tutorialSentence');
        const click = document.createTextNode(' +  CLICK');
        this.click.appendChild(click);

        this.clickText = document.createElement('div');
        this.clickText.id = 'clickText';
        this.clickText.classList.add('noselect');
        this.clickText.classList.add('tutorialSentence');
        const clickText = document.createTextNode('To cast a net');
        this.clickText.appendChild(clickText);

        this.shift = document.createElement('img');
        this.shift.id = 'shift';
        this.shift.src = './dist/models/shift.jpg';

        this.shiftText = document.createElement('div');
        this.shiftText.id = 'shiftText';
        this.shiftText.classList.add('noselect');
        this.shiftText.classList.add('tutorialSentence');
        const shiftText = document.createTextNode('Go faster');
        this.shiftText.appendChild(shiftText);

        this.esc = document.createElement('img');
        this.esc.id = 'esc';
        this.esc.src = './dist/models/esc.png';

        this.escText = document.createElement('div');
        this.escText.id = 'escText';
        this.escText.classList.add('noselect');
        this.escText.classList.add('tutorialSentence');
        const escText = document.createTextNode('Pause');
        this.escText.appendChild(escText);

        this.camera = document.createElement('img');
        this.camera.id = 'camera';
        this.camera.src = './dist/models/v.png';

        this.cameraText = document.createElement('div');
        this.cameraText.id = 'cameraText';
        this.cameraText.classList.add('noselect');
        this.cameraText.classList.add('tutorialSentence');
        const cameraText = document.createTextNode('Change camera');
        this.cameraText.appendChild(cameraText);

        this.enter = document.createElement('img');
        this.enter.id = 'enter';
        this.enter.src = './dist/models/enter.png';

        this.enterText1 = document.createElement('div');
        this.enterText1.id = 'enterText1';
        this.enterText1.classList.add('noselect');
        this.enterText1.classList.add('tutorialSentence');
        const enterText1 = document.createTextNode('Climb down');
        this.enterText1.appendChild(enterText1);

        this.enterText2 = document.createElement('div');
        this.enterText2.id = 'enterText2';
        this.enterText2.classList.add('noselect');
        this.enterText2.classList.add('tutorialSentence');
        const enterText2 = document.createTextNode('(when upside down)');
        this.enterText2.appendChild(enterText2);

        this.mouseText1 = document.createElement('div');
        this.mouseText1.id = 'mouseText1';
        this.mouseText1.classList.add('noselect');
        this.mouseText1.classList.add('tutorialSentence');
        const mouseText1 = document.createTextNode('use your mouse/touchpad');
        this.mouseText1.appendChild(mouseText1);

        this.mouseText2 = document.createElement('div');
        this.mouseText2.id = 'mouseText2';
        this.mouseText2.classList.add('noselect');
        this.mouseText2.classList.add('tutorialSentence');
        const mouseText2 = document.createTextNode('to move the free camera');
        this.mouseText2.appendChild(mouseText2);

    }

    update () {
    }

    load () {
        super.load();
        this.guiDiv.append(this.tutorialLine1);
        this.guiDiv.append(this.tutorialLine2L);
        this.guiDiv.append(this.tutorialLine2R);
        this.guiDiv.append(this.t);
        this.guiDiv.append(this.wasd);
        this.guiDiv.append(this.wasdText);
        this.guiDiv.append(this.ctrl);
        this.guiDiv.append(this.ctrlText);
        this.guiDiv.append(this.click);
        this.guiDiv.append(this.clickText);
        this.guiDiv.append(this.shift);
        this.guiDiv.append(this.shiftText);
        this.guiDiv.append(this.esc);
        this.guiDiv.append(this.escText);
        this.guiDiv.append(this.camera);
        this.guiDiv.append(this.cameraText);
        this.guiDiv.append(this.enter);
        this.guiDiv.append(this.enterText1);
        this.guiDiv.append(this.enterText2);
        this.guiDiv.append(this.mouseText1);
        this.guiDiv.append(this.mouseText2);
    }

    unload () {
        super.unload();
        this.tutorialLine1.remove();
        this.tutorialLine2L.remove();
        this.tutorialLine2R.remove();
        this.t.remove();
        this.wasd.remove();
        this.wasdText.remove();
        this.ctrl.remove();
        this.ctrlText.remove();
        this.click.remove();
        this.clickText.remove();
        this.shift.remove();
        this.shiftText.remove();
        this.esc.remove();
        this.escText.remove();
        this.camera.remove();
        this.cameraText.remove();
        this.enter.remove();
        this.enterText1.remove();
        this.enterText2.remove();
        this.enterText2.remove();
        this.mouseText1.remove();
        this.mouseText2.remove();
    }
}