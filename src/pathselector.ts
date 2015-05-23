/// <reference path="../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="SKYScene"/>

class PathSelector {

  scene: SKYScene;
  private selectedTile:BABYLON.Vector2;
  private tiles:Array<BABYLON.Vector2>;
  private cells:Array<BABYLON.Mesh>;

  constructor(scene:SKYScene) {
    this.scene = scene;
  }

  private clearAll() {
    this.selectedTile = null;
    this.tiles = new Array<BABYLON.Vector2>();
    this.cells = new Array<BABYLON.Mesh>();
  }

  initFrom(tile:BABYLON.Vector2, ray:number) {
    //clear all
    this.clearAll();

    // compute accessible tiles
    this.tiles = this.scene.getMapHelper().getTilesAccessibleFrom(tile, ray);

    // hightlight these tiles
    let k = this.scene.getMapHelper().getK();

    // TODO fancy !
    let mat = new BABYLON.StandardMaterial("boxMaterial", this.scene);
    mat.diffuseColor = BABYLON.Color3.Purple();

    for(let t = 0; t<this.tiles.length; t++) {
      let position = this.scene.getMapHelper().getXYZ(this.tiles[t]);
      let cell = BABYLON.Mesh.CreatePlane("select", k*.8, this.scene);
      cell.material = mat;
      position.y = 0.1;
      cell.position = position;
      cell.rotation.x = Math.PI/2;
      this.cells.push(cell);
    }
  }

  selectAgainst(tile:BABYLON.Vector2):boolean {
    // pas de tiles ajoutés lors de initFrom
    if(this.tiles == null)
      return false;

    // idem
    if(this.tiles.length == 0)
      return;

    // recherche le tile passé en paramètre
    let idx = this.tiles.indexOf(tile);

    // si pas de correspondance trouvée
    if(idx == -1) return;

    // si le tile trouvé correspond à celui déjà séléctionné
    // => double selection (ou selection-validation)
    if(this.selectedTile == tile)
      return true;

    // mise en evidence du tile slectionné
    this.selectedTile = tile;
    let cell = this.cells[idx];
    let mat = new BABYLON.StandardMaterial("boxMaterial", this.scene);
    mat.diffuseColor = BABYLON.Color3.Blue();
    cell.material = mat;
    // TODO MAJ du path
    return false;
  }
}
