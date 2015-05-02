/// <reference path="..\js\Babylon.js-master\babylon.2.1.d.ts"/>

class SKYScene extends BABYLON.Scene {

  private _name:string = "SKYScene";

  constructor(engine: BABYLON.Engine, name:string) {
    super(engine);
    this._name = name;
    console.log("call new SKYScene: " + this._name);
  }

  public name() {return this._name;}
  public init(canvas:HTMLCanvasElement, assets: Object[]){};
}
