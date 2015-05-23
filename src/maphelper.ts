
class MapHelper {

  private width:number;
  private height:number;
  private actualMap:Array<Array<number>>; // TODO : double buffering
  private nextMap:Array<Array<number>>;
  private K = 3;

  constructor(baseMap:Array<Array<number>>) {
    this.height = baseMap.length;
    this.width = baseMap[0].length;
    this.actualMap = baseMap;
  }

  getW() {return this.width;}
  getH() {return this.height;}
  getK() {return this.K;}

  getXZTile(position:BABYLON.Vector3):BABYLON.Vector2 {
    let x = Math.floor(position.x / this.K);
    let z = Math.floor(position.z / this.K);
    return new BABYLON.Vector2(x, z);
  }

  getXYZ(tile:BABYLON.Vector2, isCenteredOnTile:boolean = true, yTile:number = 0) {
    let x = tile.x * this.K + (isCenteredOnTile ? 0.5 * this.K : 0);
    let y = yTile * this.K;
    let z = tile.y * this.K + (isCenteredOnTile ? 0.5 * this.K : 0);
    return new BABYLON.Vector3(x, y, z);

  }

  getXYZMapCenter() {
    //i*k-4*k, 0, j*k-3*k
    let x = this.width / 2  * this.K;
    let y = 0;
    let z = this.height / 2 * this.K;
    return new BABYLON.Vector3(x, y, z);
  }

  getTilesAccessibleFrom(tile:BABYLON.Vector2, ray:number): Array<BABYLON.Vector2> {
    ray = Math.round(ray);
    console.log("ray: " + ray);
    let tiles = new Array<BABYLON.Vector2>();
    let min = new BABYLON.Vector2(
      Math.max(Math.round(tile.x - ray), 0),
      Math.max(Math.round(tile.y - ray), 0)
      );

    let max = new BABYLON.Vector2(
      Math.min(Math.round(tile.x + ray), this.width),
      Math.min(Math.round(tile.y + ray), this.height)
      );

    console.log("min: " + min.toString());
    console.log("max: " + max.toString());


    for(let j = min.y; j < max.y; j++) {
      for(let i = min.x; i < max.x; i++) {

        if(i<0) continue;
        else if(i>this.width) continue;
        else if(j<0) continue;
        else if(j>this.height) continue;

        let val = this.actualMap[j][i]; // accès par lignes/colonnes
        if(val != 0) continue;

        let newTile = new BABYLON.Vector2(i, j);
        if(this.pathExists(tile, newTile, ray)) {
          tiles.push(newTile);
          //console.log("newTile: " + newTile.toString());
        }
      }
    }
    return tiles;
  }

  pathExists(start:BABYLON.Vector2, end:BABYLON.Vector2, threshold:number) {
    let pathfinder = new AS(this.actualMap, start, end, threshold);
    if(pathfinder.path.length > 0 && pathfinder.path.length < threshold) return true;
    return false;
  }
  /*
  manhattanDist(x1:number, y1:number, x2:number, y2:number, threshold:number): boolean {
    let d = Math.abs(x2-x1)+Math.abs(y2-y1);
    return (d <= threshold);
  }


  euclideanDist(x1:number, y1:number, x2:number, y2:number, threshold:number): boolean {
      let d = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
      return (d <= threshold);
    }
  */
}
