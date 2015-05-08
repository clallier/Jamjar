/// <reference path="../../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="../SKYScene"/>

class Level1 extends SKYScene {

  assets: Object[];
  map;

  public init(canvas:HTMLCanvasElement, assets: Object[]) {
    console.log("init Level1");
    this.map = [
      [1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,1],
      [1,0,4,0,0,0,0,0,1],
      [1,2,4,0,0,3,0,0,1],
      [1,0,4,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1]
    ];

    this.assets = assets;

    console.log("lights");
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this);
    light1.intensity = 0.8;

    var light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(0, -1, -1), this);
    light2.position = new BABYLON.Vector3(0, 20, 0);

    console.log("fog");
    this.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.fogEnabled = false;
    this.fogDensity = 0.02;

    let k = 3;
    for (let j = 0; j < this.map.length; j++) {
      for (let i = 0; i < this.map[j].length; i++) {
        let position = new BABYLON.Vector3(i*k-4*k, 0, j*k);

        switch(this.map[j][i]) {
          case 1:
            console.log("box");
            var box = BABYLON.Mesh.CreateBox("box", k, this);
            var boxMaterial = new BABYLON.StandardMaterial("boxMaterial", this);
            boxMaterial.diffuseColor = BABYLON.Color3.Yellow();
            boxMaterial.emissiveColor = BABYLON.Color3.Yellow();
            box.material = boxMaterial;
            position.y = k;
            box.position = position;
            box.scaling.y = j/4+.5;
          break;

          case 2:
            this.cloneAndMoveTo(Items.SpaceCowboy, position);
          break;

          case 3:
            position.y = 4;
            this.cloneAndMoveTo(Items.HiBot, position);
          break;

          case 4:
            position.y = 2;
            this.cloneAndMoveTo(Items.CrateBox, position);
          break;

          default ://0
            this.cloneAndMoveTo(Items.Ground, position);
          break;
        }
      }
    }

    console.log("camera");
    var camera = new BABYLON.ArcRotateCamera("camera", 3 * Math.PI / 2.0, Math.PI / 4.0, 40.0, new BABYLON.Vector3(0, 0, 0), this);
  }

  cloneAndMoveTo(name:string, pos: BABYLON.Vector3) {
    console.log("cloning " + name);
    var item = this.assets[name].mesh;
    item.forEach(function(m) {
        var mm = m.clone();
        mm.position = pos;
        mm.isVisible = true;
    });
  }
}
