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
}
