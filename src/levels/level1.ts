/// <reference path="../refs.ts"/>

class Level1 extends BABYLON.Scene {
  constructor(engine: BABYLON.Engine, canvas:HTMLCanvasElement, assets: Object[]) {
    super(engine);
    console.log("initLevel1");

    console.log("camera");
    var camera = new BABYLON.ArcRotateCamera("camera1", Math.PI/2, Math.PI/2 -.25, 8, new BABYLON.Vector3(0, 0, 0), this);
    camera.attachControl(canvas, false);

    console.log("lights");
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this);
    light1.intensity = 0.8;

    var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -1, -1), this);
    light2.position = new BABYLON.Vector3(0, 20, 0);

    console.log("fog");
    this.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.fogEnabled = true;
    this.fogDensity = 0.02;

    console.log("ground");
    var ground = BABYLON.Mesh.CreateGround("ground", 9.0, 5.0, 1, this);
    ground.position = new BABYLON.Vector3(0, 0, 0);
    ground.receiveShadows = true;

    console.log("mirror");
    var material1 = new BABYLON.StandardMaterial("material1", this);
    material1.diffuseTexture = new BABYLON.MirrorTexture("mirror", 256, this, true);
    ground.material = material1;

    console.log("cloning");
    var xpos = -50;
    for (var i=0; i<10; i++) {
        var car = assets["SpaceCowboy"].mesh;
        car.forEach(function(m) {
            console.log("clone " + i);
            var mm = m.clone();
            mm.position.x = xpos + i*10;
            mm.isVisible = true;
        });
    }

  }
}
