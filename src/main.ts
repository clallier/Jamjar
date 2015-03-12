
class Main {

  scene : BABYLON.Scene;
  engine: BABYLON.Engine;

  constructor() {

    var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("renderCanvas");

    this.engine = new BABYLON.Engine(canvas, false);
    this.engine.setHardwareScalingLevel(1);

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = BABYLON.Color3.White();

    var camera = new BABYLON.ArcRotateCamera("camera1", Math.PI/2, Math.PI/2 -.25, 8, new BABYLON.Vector3(0, 0, 0), this.scene);
    camera.attachControl(canvas, false);

    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
    light1.intensity = 0.8;

    var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -1, -1), this.scene);
    light2.position = new BABYLON.Vector3(0, 20, 0);

    var shadowGenerator = new BABYLON.ShadowGenerator(256, light2);

    var skybox = Factory.createSkybox(this.scene);

    this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.scene.fogEnabled = true;
    this.scene.fogDensity = 0.02;

    var texture1 = new BABYLON.Texture("assets/jamjar_layout.png", this.scene, true, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    texture1.anisotropicFilteringLevel = 1;
    var material1 = new BABYLON.StandardMaterial('material1', this.scene);
    material1.diffuseTexture = texture1;

    // SceneLoader
    BABYLON.SceneLoader.ImportMesh("jamjar", "assets/" , "jamjar.babylon", this.scene, meshes =>{
      var m = meshes[0];
      m.outlineColor = new BABYLON.Color3(0.4, 0.7, 1.0);
      m.outlineWidth = 0.06;
      m.renderOutline = true;

      m.material = material1;
      shadowGenerator.getShadowMap().renderList.push(m);

      var particleSystem = new BABYLON.ParticleSystem("particles", 2000, this.scene);
      particleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", this.scene);
      particleSystem.emitter = m;
      particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
      particleSystem.minEmitBox = new BABYLON.Vector3(-1, -2, -1);
      particleSystem.maxEmitBox = new BABYLON.Vector3(1, 1, 1);

      particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, .2);
      particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, .2);
      particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

      particleSystem.minLifeTime = 0.1;
      particleSystem.maxLifeTime = 1.5;

      particleSystem.emitRate = 1000;

      particleSystem.minSize = 0.1;
      particleSystem.maxSize = 0.3;
      particleSystem.start();


      var animation1 = new BABYLON.Animation("bounce", "position.y", 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      var keys1 = [{frame: 0, value: 1}, {frame: 50, value: .5}, {frame: 100, value: 1}];
      animation1.setKeys(keys1);
      animation1.setEasingFunction(new BABYLON.SineEase());
      m.animations.push(animation1);
      this.scene.beginAnimation(animation1, 0, 100, true);

      var animation2 = new BABYLON.Animation("swing", "rotation.x", 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      var keys2 = [{frame: 0, value: -0.2}, {frame: 50, value: .2}, {frame: 100, value: -0.2}];
      animation2.setKeys(keys2);
      m.animations.push(animation2);
      this.scene.beginAnimation(animation2, 0, 100, true);

      BABYLON.Animation.CreateAndStartAnimation("rotation1", m , "rotation.y", 20, 100, 0, Math.PI*2, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

      Factory.createGround(this.scene, [skybox, m]);
    });



    // main render loop
    this.engine.runRenderLoop( () =>
      this.scene.render()
    );
  }
}

///
var main: Main;
window.onload = ev => {
  main = new Main();
};

window.addEventListener("resize", ev => {
  main.engine.resize();
});
