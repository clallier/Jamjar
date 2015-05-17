/// <reference path="../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="SKYScene"/>

class Player{

  scene:SKYScene;
  mesh:BABYLON.Mesh = null;
  skeleton:BABYLON.Skeleton = null;
  state:State = State.IDLE;
  wait = 0; // / 100
  PA = 0; // / 5
  hasFocus = false;
  isAnimated = true;
  selectedTile:BABYLON.Vector2;

  constructor(scene:SKYScene, position:BABYLON.Vector3) {

    this.scene = scene;

    // TODO creer un object pour contenir ces elements
    // TODO trouver comment assigner le skeleton au mesh
    this.mesh = scene.assets[Items.SpaceCowboy].mesh[0];
    this.skeleton = scene.assets[Items.SpaceCowboy].skeletons[0];
    this.mesh.position = position;
    this.mesh.isVisible = true;
    this.mesh.skeleton = this.skeleton;

    //console.log("player mesh " + this.mesh.id);
    console.log("player skel " + this.skeleton.id);

    // idle state is default state
    this.setToIdleState();
  }

  update(deltaTime:number) {
    if(this.isAnimated == false) return;

    // msel (mvt selection)
    if(this.state == State.MSEL) {
      return;
    }

    // menu
    if(this.state == State.MENU) {
      return;
    }

    // 100% => focus and menu
    if(this.state == State.IDLE && this.wait >= 100) {
      this.state = State.MENU;
      this.showMenu();
      this.hasFocus = true;
      return;
    }

    // state idle => just wait
    if(this.state == State.IDLE)
    {
      // deltaTime in ms!
      this.wait += deltaTime / 100;
      return;
    }
  }

  showMenu() {
    var menuDiv = document.getElementById("actionMenu");
    var menuUl = document.createElement("ul");

    var moveLi = document.createElement("li");
    var moveBtn = document.createElement("button");
    moveBtn.innerHTML = TText.getValue("MENU_MOVE");

    var dashLi = document.createElement("li");
    var dashBtn = document.createElement("button");
    dashBtn.innerHTML = TText.getValue("MENU_DASH");

    var shootLi = document.createElement("li");
    var shootBtn = document.createElement("button");
    shootBtn.innerHTML = TText.getValue("MENU_SHOOT");

    var endLi = document.createElement("li");
    var endBtn = document.createElement("button");
    endBtn.innerHTML = TText.getValue("MENU_ENDTURN");

    var fscreenLi = document.createElement("li");
    var fscreenBtn = document.createElement("button");
    fscreenBtn.innerHTML = TText.getValue("MENU_FS");

    // Append all to the menu
    menuDiv.appendChild(menuUl);
    // move
    menuUl.appendChild(moveLi);
    moveLi.appendChild(moveBtn);
    // dash
    menuUl.appendChild(dashLi);
    dashLi.appendChild(dashBtn);
    // shoot
    menuUl.appendChild(shootLi);
    shootLi.appendChild(shootBtn);
    // end turn
    menuUl.appendChild(endLi);
    endLi.appendChild(endBtn);
    // fullscreen (TODO to move in a main menu)
    menuUl.appendChild(fscreenLi);
    fscreenLi.appendChild(fscreenBtn);

    // 3. Add event handler
    moveBtn.addEventListener ("click", () => this.initiateMove());
    dashBtn.addEventListener ("click", () => this.eventDash());
    shootBtn.addEventListener ("click", () => this.eventShoot());
    endBtn.addEventListener ("click", () => this.eventEndOfTurn());
    fscreenBtn.addEventListener ("click", () => {
      console.log("TOGGLE FULLSCREEN");
      this.scene.getEngine().switchFullscreen(false);
    });
  }

  hideMenu() {
    var menuDiv = document.getElementById("actionMenu");
    while (menuDiv.firstChild) {
      menuDiv.removeChild(menuDiv.firstChild);
    }
  }

  getFocus() : boolean  {
    return this.hasFocus;
  }

  setToIdleState() {
    this.state = State.IDLE;
    this.wait = 0; // / 100
    this.PA = 3; // / 5
    this.hasFocus = false;
    this.isAnimated = true;
    this.playIdleAnimation();
  }


  initiateMove() {
    console.log("OK LET'S MOVE");
    this.hideMenu();
    this.state = State.MSEL;

    // getpos in tiles
    let tile = this.scene.getMapHelper().getXZTile(this.mesh.position);
    console.log("player will move from : " + tile.toString())

    // compute accessible tiles
    let tiles = this.scene.getMapHelper().getTilesAccessibleFrom(tile, this.PA);

    // hightlight these tiles
    let k = this.scene.getMapHelper().getK();

    for(let t = 0; t<tiles.length; t++) {
      let position = this.scene.getMapHelper().getXYZ(tiles[t]);
      let cell = BABYLON.Mesh.CreatePlane("select", k*.8, this.scene);
      let mat = new BABYLON.StandardMaterial("boxMaterial", this.scene);
      mat.diffuseColor = BABYLON.Color3.Purple();
      cell.material = mat;
      position.y = 0.1;
      cell.position = position;
      cell.rotation.x = Math.PI/2;
    }

    // wait for pointer event
  }

  checkPointer(evt: PointerEvent, pickInfo: BABYLON.PickingInfo) {
    if(this.hasFocus == false) return;

    if(this.state == State.MSEL) {
      console.log("TOUCH EVENT : MOVE SELECTION");
      console.log("pt : "+ pickInfo.pickedPoint);
      if(pickInfo.pickedPoint == null) return;
      let tile = this.scene.getMapHelper().getXZTile(pickInfo.pickedPoint);
      let position = this.scene.getMapHelper().getXYZ(tile);
      let cell = BABYLON.Mesh.CreatePlane("select",  this.scene.getMapHelper().getK()*.9, this.scene);
      let mat = new BABYLON.StandardMaterial("boxMaterial", this.scene);
      mat.diffuseColor = BABYLON.Color3.Blue();
      cell.material = mat;
      position.y = 0.2;
      cell.position = position;
      cell.rotation.x = Math.PI/2;
    }
  }

  eventDash() {
    console.log("DAAAASH");
  }

  eventShoot() {
    console.log("SHOT");
  }

  eventEndOfTurn() {
    console.log("END OF TURN");
    this.setToIdleState();
    this.hideMenu();
  }

  playIdleAnimation() {
    this.scene.beginAnimation(this.skeleton, 0, 15, true);
  }

  playSelectionAnimation() {
    this.scene.beginAnimation(this.skeleton, 0, 15, true, 2);
  }

}
