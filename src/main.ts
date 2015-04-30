/// <reference path="refs.ts"/>

class SKY {

  version: string = "1.0.1";
  canvas: HTMLCanvasElement;
  loadingScene: BABYLON.Scene;
  level1: BABYLON.Scene;
  activeScene: BABYLON.Scene;
  engine: BABYLON.Engine;
  loader: Preloader;
  assets: Object[];

  constructor(canvasId: string) {
    console.log("version: " + this.version);
    this.canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
    this.engine = new BABYLON.Engine(this.canvas, false);
    this.engine.setSize(window.innerWidth, window.innerHeight);
    this.engine.setHardwareScalingLevel(1);

    this.loadingScene = new BABYLON.Scene(this.engine);
    this.loadingScene.clearColor = BABYLON.Color3.White();
    this.initLoadingScene();

    this.level1 = new BABYLON.Scene(this.engine);
    this.level1.clearColor = BABYLON.Color3.White();

    this.assets = null;
    this.loader = new Preloader("assets/", this.level1, this);
    this.loader.add("SpaceCowboy", "SpaceCowboy", "map.babylon");
    this.loader.add("CrateBox", "CrateBox" , "map.babylon");
    this.loader.add("Ground", "Ground" , "map.babylon");
    this.loader.add("HiBot", "HiBot" , "map.babylon");
    this.loader.start();

    // create main render loop
    this.engine.runRenderLoop( () => {
        this.activeScene.render();
    });

    window.addEventListener("resize", ev => {
      if(this.engine != null)
        this.engine.resize();
    }, false);
  }

  initLoadingScene() {
    var camera = new BABYLON.FollowCamera ("camera", new BABYLON.Vector3(0, 10, 0), this.loadingScene);

    var light1 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0), this.loadingScene);
    light1.intensity = 1;
    var box = BABYLON.Mesh.CreateBox("box", 1, this.loadingScene);
    var boxMaterial = new BABYLON.StandardMaterial("boxMaterial", this.loadingScene);
    boxMaterial.diffuseColor = BABYLON.Color3.Purple();
    boxMaterial.emissiveColor = BABYLON.Color3.Purple();
    box.material = boxMaterial;
    camera.target = box;

    var background = BABYLON.Mesh.CreateGround("background", 100, 100, 1, this.loadingScene);
    var mat = new BABYLON.StandardMaterial("backgroundMaterial", this.loadingScene);
    mat.diffuseColor = BABYLON.Color3.White();
    //var loadingTextTexture = new BABYLON.DynamicTexture("loadingTextTexture", 512, this.loadingScene, false);
    //loadingTextTexture.drawText("0%", 50, 50, "50px Segoe UI", "000000", "ffffff", false, true);
    //mat.diffuseTexture = loadingTextTexture;
    background.material = mat;

    this.changeScene(this.loadingScene);
  }

  initLevel1() {

    //document.getElementById("loadingScreen").style.transform = "translateX(-300%)";
    //Factory.createJamJar(this.scene, light2);
    //Factory.createBot(this.scene);
    this.level1 = new Level1(this.engine, this.canvas, this.assets);
    this.changeScene(this.level1);
  }

  notifyProgress(value: number) {
    console.log("progress: " + value);
    var box = this.loadingScene.getMeshByName("box");
    box.scaling.x = value * 5;
  }

  notifyComplete(assets: Object[]) {
    this.assets = assets;
    this.initLevel1();
  }

  changeScene(scene:BABYLON.Scene) {
    if(this.activeScene != null) {
      this.activeScene.dispose();
    }

    this.activeScene = scene;
  }
}

document.addEventListener("DOMContentLoaded", ev => {
  if(BABYLON.Engine.isSupported()) {
    var game = new SKY("renderCanvas");
  }
});
