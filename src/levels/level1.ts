/// <reference path="../../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="../SKYScene"/>

class Level1 extends SKYScene {

  public init(canvas:HTMLCanvasElement, assets: Object[]) {
    console.log("init Level1");

    console.log("lights");
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this);
    light1.intensity = 0.8;

    var light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(0, -1, -1), this);
    light2.position = new BABYLON.Vector3(0, 20, 0);

    console.log("fog");
    this.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.fogEnabled = true;
    this.fogDensity = 0.02;

    console.log("ground");
    var ground = assets[Items.Ground].mesh;
    ground.position = new BABYLON.Vector3(0, 0, 0);
    ground.receiveShadows = true;

    console.log("camera");
    var camera = new BABYLON.FollowCamera ("camera", new BABYLON.Vector3(0, 10, 0), this);
    camera.target = ground;

/*
    console.log("cloning SpaceCowboy");
    var spaceCowboy = assets[Items.SpaceCowboy].mesh;

    console.log("cloning CrateBox");
    var crateBox = assets[Items.CrateBox].mesh;

    console.log("cloning HiBot");
    var HiBot = assets[Items.HiBot].mesh;
*/
  }
}
