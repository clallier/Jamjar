/// <reference path="refs.ts"/>

class Factory {

  static createSkybox(scene: BABYLON.Scene) {
    BABYLON.Engine.ShadersRepository = "assets/shaders/";
    var skybox = BABYLON.Mesh.CreateSphere("skybox", 10, 2500, scene);

    var shader = new BABYLON.ShaderMaterial("gradient", scene, "gradient", {});
    shader.backFaceCulling = false;
    skybox.material = shader;
    return skybox;
  }

  static createGround(scene: BABYLON.Scene, array:BABYLON.AbstractMesh[]) {
    var ground = BABYLON.Mesh.CreateGround("ground", 12.0, 12.0, 8, scene);
    ground.position = new BABYLON.Vector3(0, -2, 0);
    ground.receiveShadows = true;

    var material1 = new BABYLON.StandardMaterial("material1", scene);
    material1.diffuseColor = new BABYLON.Color3(.15, .4, .4);
    var reflectionTexture = new BABYLON.MirrorTexture("mirror", 256, scene, true);
    reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1.0, 0, -1.0);
    reflectionTexture.renderList = array;
    material1.reflectionTexture = reflectionTexture;
    ground.material = material1;
    return ground;
  }

  static createJamJarParticles(scene: BABYLON.Scene, parent: BABYLON.AbstractMesh) {

    var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", scene);
    particleSystem.emitter = parent;
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
    return particleSystem;
  }

  static createJamJar(scene: BABYLON.Scene, light: BABYLON.IShadowLight) {
    var shadowGenerator = new BABYLON.ShadowGenerator(256, light);
    var skybox = Factory.createSkybox(scene);


    var diffuseTexture = new BABYLON.Texture("assets/jamjar_layout.png", scene, true, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    diffuseTexture.anisotropicFilteringLevel = 1;
    var mat = new BABYLON.StandardMaterial('material', scene);
    mat.diffuseTexture = diffuseTexture;

    // SceneLoader
    BABYLON.SceneLoader.ImportMesh("jamjar", "assets/" , "jamjar.babylon", scene, meshes =>{
      var mesh = meshes[0];
      mesh.material = mat;

       // outline
       mesh.outlineColor = new BABYLON.Color3(0.4, 0.7, 1.0);
       mesh.outlineWidth = 0.06;
       mesh.renderOutline = true;

       // particles
       var particles = Factory.createJamJarParticles(scene, mesh);

      // anim 1
      var animation1 = new BABYLON.Animation("bounce", "position.y", 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      var keys1 = [{frame: 0, value: 1}, {frame: 50, value: .5}, {frame: 100, value: 1}];
      animation1.setKeys(keys1);
      animation1.setEasingFunction(new BABYLON.SineEase());
      mesh.animations.push(animation1);
      scene.beginAnimation(animation1, 0, 100, true);

      // anim 2
      var animation2 = new BABYLON.Animation("swing", "rotation.x", 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      var keys2 = [{frame: 0, value: -0.2}, {frame: 50, value: .2}, {frame: 100, value: -0.2}];
      animation2.setKeys(keys2);
      mesh.animations.push(animation2);
      scene.beginAnimation(animation2, 0, 100, true);

      BABYLON.Animation.CreateAndStartAnimation("rotation1", mesh , "rotation.y", 20, 100, 0, Math.PI*2, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

      Factory.createGround(scene, [skybox, mesh]);
      shadowGenerator.getShadowMap().renderList.push(mesh);
    });
  }

  static createBot(scene: BABYLON.Scene) {
    var diffuseTexture = new BABYLON.Texture("assets/protector_bot.png", scene, true, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    diffuseTexture.anisotropicFilteringLevel = 1;
    var mat = new BABYLON.StandardMaterial('material', scene);
    mat.diffuseTexture = diffuseTexture;

    // SceneLoader
    BABYLON.SceneLoader.ImportMesh("Cube.001", "assets/" , "protector_bot.babylon", scene, meshes =>{
      var mesh = meshes[0];
      mesh.material = mat;
    });
  }

}
