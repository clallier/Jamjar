/// <reference path="../../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="../SKYScene"/>


class LoadingScene extends SKYScene {

  public init(canvas:HTMLCanvasElement, assets: Object[]) {
    console.log("init loadingScene");
    var camera = new BABYLON.FollowCamera ("camera", new BABYLON.Vector3(0, 10, 0), this);

    var light1 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0), this);
    light1.intensity = 1;
    var box = BABYLON.Mesh.CreateBox("box", 1, this);
    var boxMaterial = new BABYLON.StandardMaterial("boxMaterial", this);
    boxMaterial.diffuseColor = BABYLON.Color3.Purple();
    boxMaterial.emissiveColor = BABYLON.Color3.Purple();
    box.material = boxMaterial;
    camera.target = box;

    var background = BABYLON.Mesh.CreateGround("background", 100, 100, 1, this);
    var mat = new BABYLON.StandardMaterial("backgroundMaterial", this);
    mat.diffuseColor = BABYLON.Color3.White();
    //var loadingTextTexture = new BABYLON.DynamicTexture("loadingTextTexture", 512, this, false);
    //loadingTextTexture.drawText("0%", 50, 50, "50px Segoe UI", "000000", "ffffff", false, true);
    //mat.diffuseTexture = loadingTextTexture;
    background.material = mat;
  }

}
