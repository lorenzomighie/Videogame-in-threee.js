import * as THREE from 'three';
import { default as GLTFLoader } from 'three-gltf-loader';

export class Spider {
  constructor (main) {
    this.main = main;
    this.loadModel();
  }

  loadModel () {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./dist/models/spider/spider.gltf', (object) => {
      const root = object.scene;
      this.root = root;
      this.main.scene.add(root);
      const rootBone = root.getObjectByName('Armature');
      this.thirdRightLeg = rootBone.getObjectByName('Bone005_R001_Armature');
      this.firstRightLeg = rootBone.getObjectByName('Bone007_R001_Armature');
      this.thirdLeftLeg = rootBone.getObjectByName('Bone005_L001_Armature');
      this.firstLeftLeg = rootBone.getObjectByName('Bone007_L001_Armature');
      this.fourthLeftLeg = rootBone.getObjectByName('Bone004_L001_Armature');
      this.secondLeftLeg = rootBone.getObjectByName('Bone006_L001_Armature');
      this.fourthRightLeg = rootBone.getObjectByName('Bone004_R001_Armature');
      this.secondRightLeg = rootBone.getObjectByName('Bone006_R001_Armature');
      this.firstLeftLegJ1 = rootBone.getObjectByName('Bone007_L002_Armature');
      this.firstRightLegJ1 = rootBone.getObjectByName('Bone007_R002_Armature');
      this.thirdLeftLegJ1 = rootBone.getObjectByName('Bone005_L002_Armature');
      this.thirdRightLegJ1 = rootBone.getObjectByName('Bone005_R002_Armature');
      this.secondLeftLegJ1 = rootBone.getObjectByName('Bone006_L002_Armature');
      this.secondRightLegJ1 = rootBone.getObjectByName('Bone006_R002_Armature');
      this.fourthLeftLegJ1 = rootBone.getObjectByName('Bone004_L001_Armature');
      this.fourthRightLegJ1 = rootBone.getObjectByName('Bone004_R001_Armature');
      this.firstLeftLegJ2 = rootBone.getObjectByName('Bone007_L003_Armature');
      this.leftClaw = rootBone.getObjectByName('Bone008_L001_Armature');
      this.rightClaw = rootBone.getObjectByName('Bone008_R001_Armature');

      this.root.scale.set(0.001, 0.001, 0.001);
      this.root.up = new THREE.Vector3(0,1,0);
      this.main.mode.spiderLoaded = true;

    });
  }
}