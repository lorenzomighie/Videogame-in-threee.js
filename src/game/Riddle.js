import { OrbitCameraController } from './Camera'
import * as THREE from 'three'
import { GUI } from './GUI'
import { Mode } from './Mode'
import { GameMode } from './Game'

export class RiddleMode extends Mode {
    constructor (main) {
        const gui = new RiddleGUI(main.guiDiv, main.canvas);
        super(main, gui, false);
        this.last = false;
    }

    update (riddleNumber) {
        super.update();
    }

    handleMouseMove (deltaX, deltaY) {

    }

    handleAction (event, key, value) {
        // console.log(key)
        if(key === ' '){
            if (this.main.oldMode instanceof GameMode){
                this.main.gameMode.resetButtons();
            }
            this.main.changeMode(this.main.gameMode);
        }
    }

}

export class RiddleGUI extends GUI {

    constructor (guiDiv, canvas, riddleNum) {
        super(guiDiv, canvas);

        // list containing all possible riddles
        this.riddles = [
        "If you wish to go forward <br>" +
        "don’t be afraid to lower your spot. <br>" +
        "The key factor resides <br>" +
        " where you wait for folks.",

        "Aim for the living room, <br> " +
        "solve this riddle to get your crux, <br> " +
        "so that eventually you can relax: <br>" +
        "look for something which <br> " +
        "has a back and legs, <br> " +
        "but does not have any hair, <br>" +
        "it’s something on which you sit <br>" +
        "which means that it is a  _ _ _ _ _ <br>",

        "The next room is important, <br>" +
        "I think that you’d agree, <br>" +
        "as there’s a container <br>" +
        "which your stomach fulfills. <br>" +
        "Look where you are used to eat! <br>" +
        "Be quick or you will lose your seat. <br>",

        "Do you wish to go out? <br>" +
        "Where would you go? <br>" +
        "You should get ready first <br>" +
        "Keep your head on the ground and <br>" +
        "beware of Narcissus’s curse. <br>",

        "The next room is tough <br>" +
        "for there is nothing like physic laws,<br>" +
        "Sir Isaac Newton could get a heart attack, <br>" +
        "the cornerstone is moving pretty fast. <br>",

        "Burn it down until the embers <br>" +
        "smoke on the ground <br>" +
        "and start new when your heart. <br>" +
        " is an empty room, <br>" +
        "with walls of the deepest blue...<br>",

        "Time to go out <br>" +
        "and get some fresh hair <br>" +
        "have fun! take a look around <br>" +
        "and maybe meet some new friends. <br>" +
        "If you look in the proper places <br>" +
        "you might get a tan <br>",

        "You came a long way up to this point, <br>" +
        "you should get some rest, <br>" +
        "this last one step might get you wet <br>" +
        "... and no it is nothing related to that. <br>" +
        "Go there and chill, <br>" +
        "the last object could have your face frown, <br>" +
        "but beware that you don’t drown. <br>",

        "If you had wings, <br>" +
        "tied to your breast, <br>" +
        "where would you go next? <br>" +
        "Where would you make a nest? <br>",

        "Here is where your journey ends, <br>" +
        "we really hope you had fun <br>" +
        "and that getting here <br>" +
        "was not an Herculean task. <br>" +
        "Anyhow we have to make you <br>" +
        "our own congrats, <br>" +
        "seeing you getting here makes us glad <br>" +
        "<br><br> Lorenzo and Emilian",

        "How did you get here??? <br>" +
        "your curiosity brought you this far, <br>" +
        "sorry that you found this bug. <br> " +
        "We hope this will not screw <br> " +
        "the vibe of climbing around the rooms"
        ];

        // riddle
        this.riddleSetup = document.createElement('div');
        this.riddleSetup.id = 'riddleText';
        this.riddleSetup.classList.add('noselect');
        this.riddleSetup.classList.add('riddleText');

       // this.riddleText = document.createTextNode('');
        //this.riddleTitle.classList.add('title');
        //const riddleText = document.createTextNode('if you wish to go forward \n' +
        //    'don’t be afraid to lower your spot\n' +
        //    'the key factor resides where you wait for folks\n');

        // returnButton
        this.returnSuggest = document.createElement('div');
        this.returnSuggest.id = 'returnSuggest';
        this.returnSuggest.classList.add('noselect');
        const returnSuggestText = document.createTextNode('press the SPACE BAR to continue');
        this.returnSuggest.appendChild(returnSuggestText);

    }

    update (riddleNum) {
        //this.riddleSetup2.appendChild(document.createTextNode("don’t be afraid to lower your spot"));
        this.riddleSetup.innerHTML = (this.riddles[riddleNum]);
        if(riddleNum === 9){
            this.last = true;
        }
    }

    load () {
        super.load();
        if (this.riddleSetup && this.returnSuggest) {
            this.guiDiv.append(this.riddleSetup);
            if(!this.last) {
                this.guiDiv.append(this.returnSuggest);
            }
        }
    }

    unload () {
        super.unload();
        this.riddleSetup.remove();
        if(!this.last) {
            this.returnSuggest.remove();
        }
    }
}