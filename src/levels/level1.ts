/// <reference path="../../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="../SKYScene"/>

class Level1 extends SKYScene {

  map:Array<Array<number>>;
  ground: BABYLON.Mesh;
  player:Player = null;

  public init(canvas:HTMLCanvasElement, assets: Object[]) {
    //console.log("init Level1");
    this.map = [
      [1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,1],
      [1,0,4,0,0,0,0,0,1],
      [1,2,4,0,0,3,0,0,1],
      [1,0,4,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1]
    ];

    this.createMapHelper(this.map);
    this.assets = assets;

    //console.log("lights");
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this);
    light1.intensity = 0.8;

    var light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(0, -1, -1), this);
    light2.position = new BABYLON.Vector3(0, 20, 0);

    //console.log("fog");
    this.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.fogEnabled = false;
    this.fogDensity = 0.02;

    let k = this.getMapHelper().getK();
    for (let j = 0; j < this.map.length; j++) {
      for (let i = 0; i < this.map[j].length; i++) {
        let tile = new BABYLON.Vector2(i, j);
        let position = this.getMapHelper().getXYZ(tile);

        switch(this.map[j][i]) {
          case 1:
            //console.log("box");
            var box = BABYLON.Mesh.CreateBox("box", k*.8, this);
            var boxMaterial = new BABYLON.StandardMaterial("boxMaterial", this);
            boxMaterial.diffuseColor = BABYLON.Color3.Yellow();
            boxMaterial.emissiveColor = BABYLON.Color3.Yellow();
            box.material = boxMaterial;
            position.y = k/2;
            box.position = position;
          break;

          case 2:
            this.player = new Player(this, position);
          break;

          case 3:
            this.cloneAndMoveTo(Items.HiBot, position);
          break;

          case 4:
            this.cloneAndMoveTo(Items.CrateBox, position);
          break;

          default ://0
            // nothing for the moment
            //this.cloneAndMoveTo(Items.Ground, position);
          break;
        }
      }
    }

    // for each add a square to represent the ground
    this.createGround();

    //console.log("camera");
    let radius = this.getMapHelper().getW() * this.getMapHelper().getK();
    var camera = new BABYLON.ArcRotateCamera("camera", 3 * Math.PI / 2.0, Math.PI / 4.0, radius, this.getMapHelper().getXYZMapCenter(), this);
    //this.activeCamera = camera;
    //this.activeCamera.attachControl(canvas); //onlyt for debug (in game cam must be static)

    // OK end of map init => now we select the player

    this.beforeRender = () => this.update();
    this.onPointerDown = (evt, pickinfo) => this.checkPointer(evt, pickinfo);
    this.skeletonsEnabled = true;
  }

  createGround() {
    //console.log("tiledGround");
    let subdivision = {w:this.getMapHelper().getW(), h:this.getMapHelper().getH()};
    let precision = {w:1, h:1};
    let min = this.getMapHelper().getXYZ(new BABYLON.Vector2(0, 0), false);
    let max = this.getMapHelper().getXYZ(new BABYLON.Vector2(this.getMapHelper().getW(), this.getMapHelper().getH()), false);
    // console.log("subdivision : " + subdivision.w + ", " + subdivision.h);
    // console.log("ground min : " + min.toString());
    // console.log("ground max : " + max.toString());

    // map : 9*7 tiles
    this.ground = BABYLON.Mesh.CreateTiledGround("ground", min.x, min.z, max.x, max.z, subdivision, precision, this);
    var whiteMaterial = new BABYLON.StandardMaterial("White", this);
    whiteMaterial.diffuseColor = new BABYLON.Color3(.97, .89, .42); //light yellow // TODO defines these colors in defines

    var blackMaterial = new BABYLON.StandardMaterial("Black", this);
    blackMaterial.diffuseColor = new BABYLON.Color3(.92, .54, .19);// orange

    var multimat = new BABYLON.MultiMaterial("multi", this);
    multimat.subMaterials.push(whiteMaterial);
    multimat.subMaterials.push(blackMaterial);

    this.ground.material = multimat;
    var verticesCount = this.ground.getTotalVertices();
    var tileIndicesLength = this.ground.getIndices().length / (subdivision.w * subdivision.h);

    this.ground.subMeshes = [];
    var base = 0;
    for (var row = 0; row < subdivision.h; row++) {
        for (var col = 0; col < subdivision.w; col++) {
          this.ground.subMeshes.push(new BABYLON.SubMesh(row%2 ^ col%2, 0, verticesCount, base, tileIndicesLength, this.ground));
             base += tileIndicesLength;
         }
    }
  }

  cloneAndMoveTo(name:string, pos: BABYLON.Vector3) {
    //console.log("cloning " + name);
    var item = this.assets[name].mesh;
    item.forEach(function(m) {
        var mm = m.clone();
        mm.position = pos;
        mm.isVisible = true;
    });
  }

  update() {
    var deltaTime:number = this.getEngine().getDeltaTime();
    //console.log("lastDeltaTime : " + deltaTime);
    this.player.update(deltaTime);
  }

  checkPointer(evt: PointerEvent, pickInfo: BABYLON.PickingInfo) {
    this.player.checkPointer(evt, pickInfo);
  }
}
