/// <reference path="../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="SKYScene"/>

class SKY {

  version: string = "1.0.36";
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;

  loadingScene: SKYScene;
  level1: SKYScene;
  activeScene: SKYScene;
  loader: Preloader;

  assets: Object[];


  constructor(canvasId: string) {
    console.log("version: " + this.version);
    this.canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");

    this.engine = new BABYLON.Engine(this.canvas, false);
    this.engine.setSize(window.innerWidth, window.innerHeight);
    this.engine.setHardwareScalingLevel(1);


    //  scenes
    this.loadingScene = new LoadingScene(this.engine, "loadingScene");
    this.level1 = new Level1(this.engine, "level1");
    this.changeScene(this.loadingScene);

    // assets loader
    this.assets = null;
    this.loader = new Preloader("assets/", this.level1, this); // TODO : this.level1
    this.loader.add(Items.SpaceCowboy, Items.SpaceCowboy, "map.babylon");
    this.loader.add(Items.CrateBox, Items.CrateBox, "map.babylon");
    this.loader.add(Items.Ground, Items.Ground, "map.babylon");
    this.loader.add(Items.HiBot, Items.HiBot, "map.babylon");
    this.loader.start();


    // create main render loop
    this.engine.runRenderLoop( () => {
      if(this.activeScene == null)
        console.log("runRenderLoop : activeScene is null")
      this.activeScene.render();
    });


    window.addEventListener("resize", ev => {
      if(this.engine != null)
        this.engine.resize();
    }, false);

  }

  notifyProgress(value: number) {
    //console.log("progress: " + value);
    var box = this.loadingScene.getMeshByName("box");
    box.scaling.x = value * 5;
  }

  notifyComplete(assets: Object[]) {
    this.assets = assets;
    this.changeScene(this.level1);
  }

  changeScene(scene:SKYScene) {

    if(scene == null) {
      console.log("changeScene : scene is null")
      return;
    }

    if(this.activeScene != null) {
      this.activeScene.dispose();
    }

    scene.init(this.canvas, this.assets);
    this.activeScene = scene;
    //console.log("new active scene: " + this.activeScene.name())
  }
}

document.addEventListener("DOMContentLoaded", ev => {
  if(BABYLON.Engine.isSupported()) {
    var game = new SKY("renderCanvas");
  } else console.warn("Babylon not supported on this device/browser");
});
