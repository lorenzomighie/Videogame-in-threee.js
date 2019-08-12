import * as THREE from "three";
import { RiddleMode } from './Riddle'

export class EventManager {

    constructor(gameMode) {

        this.gameMode = gameMode;

        this.point0 = this.gameMode.main.key0.position;
        this.point1 = this.gameMode.main.key1.position;
        this.point2 = this.gameMode.main.key2.position;
        this.point3 = this.gameMode.main.key3.position;
        this.point4 = this.gameMode.main.key4.position;
        this.point5 = this.gameMode.main.key5.position;
        this.point6 = this.gameMode.main.key6.position;
        this.point7 = this.gameMode.main.fish.position;
        // for the chick can't put its position for displacement reasons
        this.point8 = new THREE.Vector3(-11.827674624063985, 10.192847107828136, 22.527846735831393);
        this.extraPoint = new THREE.Vector3(-2.197236182266963, 11.600000619888306, 8.471925713148226);
        // ROOFTOP POINT (-11.994510077814928, 10.099180718582382, 21.840814353340566)
        // FOUNTAIN POSITION (0.6031084384309228, 0.49100666613202015, -21.77548638878972)

        this.spiderPosition = new THREE.Vector3();
        this.countKey = 0;
        this.y = new THREE.Vector3(0,1,0);

        this.firstChick = false;
        this.firstFish = false;
    }

    listen () {
        this.spiderPosition = this.gameMode.main.spider.root.position; // update position
        this.checkKey0();
        this.checkKey1 ();
        this.checkKey2 ();
        this.checkKey3 ();
        this.checkKey4 ();
        this.checkKey5 ();
        this.checkKey6 ();
        this.checkFish ();
        this.checkChick();
        this.checkExtraKey ();
    }

    checkKey0 () {
        //console.log(this.punto.distanceTo(this.spiderPosition))
        if(this.countKey === 0 && this.point0.distanceTo(this.spiderPosition) < 0.5){
            this.countKey += 1;
            this.openDoor0();
            //this.removeObject(this.gameMode.main.scene.getObjectByName('Key'));
            this.removeObject(this.gameMode.main.key0);
            this.gameMode.main.riddleMode.gui.update(0);
            this.gameMode.main.changeMode(this.gameMode.main.riddleMode);

            // open door 1
        }
    }

    checkKey1 () {
        //console.log(this.punto2.distanceTo(this.spiderPosition))
        if(this.countKey === 1 && this.point1.distanceTo(this.spiderPosition) < 0.5){
            this.countKey += 1;
            this.openDoor1();
            this.removeObject(this.gameMode.main.key1);
            this.gameMode.main.riddleMode.gui.update(1);
            this.gameMode.main.changeMode(this.gameMode.main.riddleMode);

        }
    }

    checkKey2 () {
        //console.log(this.punto2.distanceTo(this.spiderPosition))
        if(this.countKey === 2 && this.point2.distanceTo(this.spiderPosition) < 0.5){
            this.countKey += 1;
            this.openDoor2();
            this.removeObject(this.gameMode.main.key2);
            this.gameMode.main.riddleMode.gui.update(2);
            this.gameMode.main.changeMode(this.gameMode.main.riddleMode);

        }
    }

    checkKey3 () {
        if(this.countKey === 3 && this.point3.distanceTo(this.spiderPosition) < 0.5){
            this.countKey += 1;
            this.openDoor3();
            this.removeObject(this.gameMode.main.key3);
            this.gameMode.main.riddleMode.gui.update(3);
            this.gameMode.main.changeMode(this.gameMode.main.riddleMode);
        }
    }

    checkKey4 () {
        if(this.countKey === 4 && this.point4.distanceTo(this.spiderPosition) < 0.5){
            this.countKey += 1;
            this.openDoor4();
            this.removeObject(this.gameMode.main.key4);
            this.gameMode.main.riddleMode.gui.update(4);
            this.gameMode.main.changeMode(this.gameMode.main.riddleMode);
        }
    }

    checkKey5 () {
        if(this.countKey === 5 && this.point5.distanceTo(this.spiderPosition) < 0.5){
            this.countKey += 1;
            this.openDoor5();
            this.removeObject(this.gameMode.main.key5);
            this.gameMode.main.riddleMode.gui.update(5);
            this.gameMode.main.changeMode(this.gameMode.main.riddleMode);
        }
    }

    checkKey6 () {
        if(this.countKey === 6 && this.point6.distanceTo(this.spiderPosition) < 0.5){
            this.countKey += 1;
            this.openDoor6();
            this.removeObject(this.gameMode.main.key6);
            this.gameMode.main.riddleMode.gui.update(6);
            this.gameMode.main.changeMode(this.gameMode.main.riddleMode);
        }
    }

    checkFish () {
        if(this.countKey > 6 && this.point7.distanceTo(this.spiderPosition) < 0.5){
            if(this.countKey === 7){
                this.gameMode.main.riddleMode.gui.update(8);
                this.gameMode.main.changeMode(this.gameMode.main.riddleMode);
                this.countKey += 1;
                this.firstFish = true;
            } else if(!this.firstFish){ // end of the game
                this.gameMode.main.riddleMode.gui.update(9);
                this.gameMode.main.changeMode(this.gameMode.main.riddleMode);
            }
        }
    }

    checkChick () {
        //console.log(this.point8)
        if(this.countKey > 6 && this.point8.distanceTo(this.spiderPosition) < 0.5){
            if(this.countKey === 7) {
                this.gameMode.main.riddleMode.gui.update(7);
                this.gameMode.main.changeMode(this.gameMode.main.riddleMode);
                this.countKey += 1;
                this.firstChick = true;
            } else if(!this.firstChick){
                this.gameMode.main.riddleMode.gui.update(9);
                this.gameMode.main.changeMode(this.gameMode.main.riddleMode);
            }
        }
    }

    checkExtraKey () {
        if(this.extraPoint.distanceTo(this.spiderPosition) < 0.3){
            this.gameMode.main.riddleMode.gui.update(10);
            this.gameMode.main.changeMode(this.gameMode.main.riddleMode);

        }
    }

    openDoor0 () {
        //THIS IS THE FIRST DOOR TO OPEN
        //this.gameMode.main.scene.getObjectByName('DoorFirst').rotation.x = 0;
        this.gameMode.main.scene.getObjectByName('DoorFirst').rotation.y = -Math.PI/2;
        this.gameMode.main.scene.getObjectByName('DoorFirst').translateZ(0.65);
        this.gameMode.main.scene.getObjectByName('DoorFirst').translateX(-0.8);
    }

    openDoor1 () {
        // this sets the opening of the living room (SECOND DOOR TO BE OPENED)
        this.gameMode.main.scene.getObjectByName('Door1').rotation.y = Math.PI/2;
        this.gameMode.main.scene.getObjectByName('Door1').translateZ(0.6);
        this.gameMode.main.scene.getObjectByName('Door1').translateX(-0.6);
    }

    openDoor2 () {
        // this sets the opening of the kitchen (THIRD DOOR TO BE OPENED)
        this.gameMode.main.scene.getObjectByName('Door2').rotation.y = Math.PI;
        this.gameMode.main.scene.getObjectByName('Door2').translateZ(0.6);
        this.gameMode.main.scene.getObjectByName('Door2').translateX(-0.6);
    }

    openDoor3 () {
        // this sets the opening of the bathroom (FOURTH DOOR TO BE OPENED)
        this.gameMode.main.scene.getObjectByName('Door3').rotateOnWorldAxis(new THREE.Vector3(0,1,0), -Math.PI/2);
        this.gameMode.main.scene.getObjectByName('Door3').translateZ(0.6);
        this.gameMode.main.scene.getObjectByName('Door3').translateX(-0.5);
    }

    openDoor4 () {
        // this sets the opening of the weird room (FIFTH DOOR TO BE OPENED)
        this.gameMode.main.scene.getObjectByName('Door5').rotation.y = Math.PI;
        this.gameMode.main.scene.getObjectByName('Door5').translateZ(0.8);
        this.gameMode.main.scene.getObjectByName('Door5').translateX(-0.6);
        //this.gameMode.main.scene.getObjectByName('Door5').translateY(-0.45);
    }

    openDoor5 () {
        // this sets the opening of the empty blue room (SIXTH DOOR TO BE OPENED)

        this.gameMode.main.scene.getObjectByName('Door4').rotation.y = Math.PI/2;
        this.gameMode.main.scene.getObjectByName('Door4').translateZ(0.8 );
        this.gameMode.main.scene.getObjectByName('Door4').translateX(-0.6 );
        //this.gameMode.main.scene.getObjectByName('Door4').translateX(2.2);
        //this.gameMode.main.scene.getObjectByName('Door4').translateY(-0.45);

    }

    openDoor6 () {
        // opening the front door
        this.gameMode.main.scene.getObjectByName('FrontDoor').rotation.y = -Math.PI/2;
        this.gameMode.main.scene.getObjectByName('FrontDoor').translateZ(0.65);
        this.gameMode.main.scene.getObjectByName('FrontDoor').translateX(0);
    }

    removeObject (obj) {
        // console.log("provo a rimuovere")
        this.gameMode.main.scene.remove(obj)
        obj.geometry.dispose();
        obj.material.dispose();
        obj = undefined;
        this.gameMode.main.scene.dispose();
        this.gameMode.main.mode.update();
    }
     closeDoor1 () {
        //console.log(this.gameMode.main.meshCollection.getObjectByName('DoorFirst'))
        // console.log(this.gameMode.main.meshCollection)
        //this.gameMode.main.scene.getObjectByName('DoorFirst').rotateOnWorldAxis(this.y, Math.Pi/20000);
        // can't rotate around an axis since the Euler angles and the quaternions are not defined
        // so I have to set manually the Euler angles of the door



        /* doors list:

        FirstDoor,

         DoorFirst --> first room position key: ( 0.29214821871473184, y: 6.209139479733212, z: -8.371997792288514)

         Door1 --> living room

         Door2 --> kitchen

         Door3 --> bathroom

         Door4 --> weird room

         Door5 --> empty room

         Door6 --> LOCKED

         FrontDoor --> go outside

        */


        //this.gameMode.main.scene.getObjectByName('DoorFirst').rotation.z = 0;




        // DOOR 6 REMAINS CLOSE



    }


}