/// <reference path="..\js\Babylon.js-master\babylon.2.1.d.ts"/>
var SKYScene = (function (_super) {
    __extends(SKYScene, _super);
    function SKYScene(engine, name) {
        _super.call(this, engine);
        this._mapHelper = null;
        this._name = "SKYScene";
        this._name = name;
        //console.log("call new SKYScene: " + this._name);
    }
    SKYScene.prototype.name = function () { return this._name; };
    SKYScene.prototype.init = function (canvas, assets) { };
    ;
    SKYScene.prototype.createMapHelper = function (map) { this._mapHelper = new MapHelper(map); };
    SKYScene.prototype.getMapHelper = function () { return this._mapHelper; };
    return SKYScene;
})(BABYLON.Scene);
/// <reference path="../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="SKYScene"/>
var SKY = (function () {
    function SKY(canvasId) {
        this.version = "1.0.37";
        console.log("version: " + this.version);
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas, false);
        this.engine.setSize(window.innerWidth, window.innerHeight);
        this.engine.setHardwareScalingLevel(1);
        //  scenes
        this.loadingScene = new LoadingScene(this.engine, "loadingScene");
        this.level1 = new Level1(this.engine, "level1");
        this.changeScene(this.loadingScene);
        // assets loader
        this.assets = null;
        this.loader = new Preloader("assets/", this.level1, this); // TODO : this.level1
        this.loader.add(Items.SpaceCowboy, Items.SpaceCowboy, "map.babylon");
        this.loader.add(Items.CrateBox, Items.CrateBox, "map.babylon");
        this.loader.add(Items.Ground, Items.Ground, "map.babylon");
        this.loader.add(Items.HiBot, Items.HiBot, "map.babylon");
        this.loader.start();
        // create main render loop
        this.engine.runRenderLoop(function () {
            if (this.activeScene == null)
                console.log("runRenderLoop : activeScene is null");
            else
                this.activeScene.render();
        });
        window.addEventListener("resize", function (ev) {
            if (this.engine != null)
                this.engine.resize();
        }, false);
    }
    SKY.prototype.notifyProgress = function (value) {
        //console.log("progress: " + value);
        var box = this.loadingScene.getMeshByName("box");
        box.scaling.x = value * 5;
    };
    SKY.prototype.notifyComplete = function (assets) {
        this.assets = assets;
        this.changeScene(this.level1);
    };
    SKY.prototype.changeScene = function (scene) {
        if (scene == null) {
            console.log("changeScene : scene is null");
            return;
        }
        if (this.activeScene != null) {
            this.activeScene.dispose();
        }
        scene.init(this.canvas, this.assets);
        this.activeScene = scene;
        //console.log("new active scene: " + this.activeScene.name())
    };
    return SKY;
})();
document.addEventListener("DOMContentLoaded", function (ev) {
    if (BABYLON.Engine.isSupported()) {
        var game = new SKY("renderCanvas");
    }
    else
        console.warn("Babylon not supported on this device/browser");
});
var Items = (function () {
    function Items() {
    }
    Items.SpaceCowboy = "SpaceCowboy";
    Items.CrateBox = "CrateBox";
    Items.Ground = "Ground";
    Items.HiBot = "HiBot";
    return Items;
})();
var State = (function () {
    function State() {
    }
    State.IDLE = 1;
    State.MENU = 2;
    State.MSEL = 3; // path selection
    State.MOVE = 4;
    State.DASH = 5;
    State.SHOT = 6;
    State.DSTY = 7; // DESTROY
    return State;
})();
// Translated Text
var TText = (function () {
    function TText() {
    }
    TText.getValue = function (key) {
        var fullKey = key + "_" + TText.langage;
        var value = TText.textArray[fullKey];
        if (value == undefined)
            value = TText.textArray["default"];
        return value;
    };
    TText.langage = "EN";
    TText.textArray = {
        "default": "Key not found",
        "REM": "EN Texts",
        "MENU_MOVE_EN": "MOVE",
        "MENU_DASH_EN": "DASH",
        "MENU_SHOOT_EN": "SHOOT",
        "MENU_ENDTURN_EN": "END TURN",
        "MENU_FS_EN": "FULLSCREEN"
    };
    return TText;
})();
var Factory = (function () {
    function Factory() {
    }
    Factory.createSkybox = function (scene) {
        BABYLON.Engine.ShadersRepository = "assets/shaders/";
        var skybox = BABYLON.Mesh.CreateSphere("skybox", 10, 2500, scene);
        var shader = new BABYLON.ShaderMaterial("gradient", scene, "gradient", {});
        shader.backFaceCulling = false;
        skybox.material = shader;
        return skybox;
    };
    Factory.createGround = function (scene, array) {
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
    };
    Factory.createJamJarParticles = function (scene, parent) {
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
    };
    Factory.createJamJar = function (scene, light) {
        var shadowGenerator = new BABYLON.ShadowGenerator(256, light);
        var skybox = Factory.createSkybox(scene);
        var diffuseTexture = new BABYLON.Texture("assets/jamjar_layout.png", scene, true, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        diffuseTexture.anisotropicFilteringLevel = 1;
        var mat = new BABYLON.StandardMaterial('material', scene);
        mat.diffuseTexture = diffuseTexture;
        // SceneLoader
        BABYLON.SceneLoader.ImportMesh("jamjar", "assets/", "jamjar.babylon", scene, function (meshes) {
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
            var keys1 = [{ frame: 0, value: 1 }, { frame: 50, value: .5 }, { frame: 100, value: 1 }];
            animation1.setKeys(keys1);
            animation1.setEasingFunction(new BABYLON.SineEase());
            mesh.animations.push(animation1);
            scene.beginAnimation(animation1, 0, 100, true);
            // anim 2
            var animation2 = new BABYLON.Animation("swing", "rotation.x", 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            var keys2 = [{ frame: 0, value: -0.2 }, { frame: 50, value: .2 }, { frame: 100, value: -0.2 }];
            animation2.setKeys(keys2);
            mesh.animations.push(animation2);
            scene.beginAnimation(animation2, 0, 100, true);
            BABYLON.Animation.CreateAndStartAnimation("rotation1", mesh, "rotation.y", 20, 100, 0, Math.PI * 2, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            Factory.createGround(scene, [skybox, mesh]);
            shadowGenerator.getShadowMap().renderList.push(mesh);
        });
    };
    Factory.createBot = function (scene) {
        var diffuseTexture = new BABYLON.Texture("assets/protector_bot.png", scene, true, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        diffuseTexture.anisotropicFilteringLevel = 1;
        var mat = new BABYLON.StandardMaterial('material', scene);
        mat.diffuseTexture = diffuseTexture;
        // SceneLoader
        BABYLON.SceneLoader.ImportMesh("Cube.001", "assets/", "protector_bot.babylon", scene, function (meshes) {
            var mesh = meshes[0];
            mesh.material = mat;
        });
    };
    return Factory;
})();
var MapHelper = (function () {
    function MapHelper(baseMap) {
        this.K = 3;
        this.height = baseMap.length;
        this.width = baseMap[0].length;
        this.actualMap = baseMap;
    }
    MapHelper.prototype.getW = function () { return this.width; };
    MapHelper.prototype.getH = function () { return this.height; };
    MapHelper.prototype.getK = function () { return this.K; };
    MapHelper.prototype.getXZTile = function (position) {
        var x = Math.floor(position.x / this.K);
        var z = Math.floor(position.z / this.K);
        return new BABYLON.Vector2(x, z);
    };
    MapHelper.prototype.getXYZ = function (tile, isCenteredOnTile, yTile) {
        if (isCenteredOnTile === void 0) { isCenteredOnTile = true; }
        if (yTile === void 0) { yTile = 0; }
        var x = tile.x * this.K + (isCenteredOnTile ? 0.5 * this.K : 0);
        var y = yTile * this.K;
        var z = tile.y * this.K + (isCenteredOnTile ? 0.5 * this.K : 0);
        return new BABYLON.Vector3(x, y, z);
    };
    MapHelper.prototype.getXYZMapCenter = function () {
        //i*k-4*k, 0, j*k-3*k
        var x = this.width / 2 * this.K;
        var y = 0;
        var z = this.height / 2 * this.K;
        return new BABYLON.Vector3(x, y, z);
    };
    MapHelper.prototype.getTilesAccessibleFrom = function (tile, ray) {
        ray = Math.round(ray);
        console.log("ray: " + ray);
        var tiles = new Array();
        var min = new BABYLON.Vector2(Math.max(Math.round(tile.x - ray), 0), Math.max(Math.round(tile.y - ray), 0));
        var max = new BABYLON.Vector2(Math.min(Math.round(tile.x + ray), this.width), Math.min(Math.round(tile.y + ray), this.height));
        console.log("min: " + min.toString());
        console.log("max: " + max.toString());
        for (var j = min.y; j < max.y; j++) {
            for (var i = min.x; i < max.x; i++) {
                if (i < 0)
                    continue;
                else if (i > this.width)
                    continue;
                else if (j < 0)
                    continue;
                else if (j > this.height)
                    continue;
                var val = this.actualMap[j][i]; // accès par lignes/colonnes
                if (val != 0)
                    continue;
                var newTile = new BABYLON.Vector2(i, j);
                if (this.pathExists(tile, newTile, ray)) {
                    tiles.push(newTile);
                }
            }
        }
        return tiles;
    };
    MapHelper.prototype.pathExists = function (start, end, threshold) {
        var pathfinder = new AS(this.actualMap, start, end, threshold);
        if (pathfinder.path.length > 0 && pathfinder.path.length < threshold)
            return true;
        return false;
    };
    return MapHelper;
})();
/// <reference path="../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="SKYScene"/>
var ASNode = (function () {
    function ASNode(x, y, v, f, g, h, parent) {
        if (f === void 0) { f = 0; }
        if (g === void 0) { g = 0; }
        if (h === void 0) { h = 0; }
        if (parent === void 0) { parent = null; }
        this.x = x;
        this.y = y;
        this.v = v;
        this.f = f;
        this.g = g;
        this.h = h;
        this.parent = parent;
    }
    ASNode.prototype.toVector2 = function () {
        return new BABYLON.Vector2(this.x, this.y);
    };
    return ASNode;
})();
var AS = (function () {
    /*************************************************************************
    * map : the current map to go througth
    * firstNode : the current node {x, y}
    * targetNode : the target node {x, y}
    * where    x: xpos in tile
    *          y: ypos in tile
    *          f: 0 (the result of the f(x) on this node)
    *          g: 0 (the GScore of this node)
    *          h: 0 (the heuristic result on this node)
    *          parent: null (the previous node in the AStar chain)
    *
    * Return the path to the target
    */
    function AS(map, firstNode, targetNode, maxDist) {
        if (maxDist === void 0) { maxDist = 10; }
        var i, l, openList = new Array(), closedList = new Array();
        // copy locally the map
        this.map = [];
        for (i = 0, l = map.length; i < l; i++) {
            this.map.push([]);
            for (var j = 0, k = map[i].length; j < k; j++) {
                var o = new ASNode(i, j, map[i][j]);
                this.map[i].push(o);
            }
        }
        // add first block
        openList.push(this.map[firstNode.x][firstNode.y]);
        while (openList.length > 0) {
            // Grab the lowest f(x) to process next
            var lowInd = 0;
            for (i = 0; i < openList.length; ++i) {
                if (openList[i].f < openList[lowInd].f) {
                    lowInd = i;
                }
            }
            var currentNode = openList[lowInd];
            // End case -- result has been found, return the traced path
            if (currentNode.y === targetNode.y && currentNode.x === targetNode.x) {
                var tmpNode = currentNode;
                var tmpPath = new Array();
                while (tmpNode.parent != null) {
                    tmpPath.push(new BABYLON.Vector2(tmpNode.x, tmpNode.y));
                    tmpNode = tmpNode.parent;
                }
                // push the first one
                tmpPath.push(new BABYLON.Vector2(tmpNode.x, tmpNode.y));
                tmpPath.reverse();
                this.path = tmpPath;
                //console.log("path: " + this.path);
                return;
            }
            // Normal case -- move currentNode from open to closed, process each of its neighbors
            openList.splice(lowInd); // remove currentNode;
            closedList.push(currentNode);
            var neighbors = this.getNeighbors(currentNode);
            for (i = 0; i < neighbors.length; ++i) {
                var neighbor = neighbors[i];
                // not a valid node to process, skip to next neighbor
                if (closedList.indexOf(neighbor) !== -1)
                    continue;
                // g score is the shortest distance from start to current node, we need to check if
                //	 the path we have arrived at this neighbor is the shortest one we have seen yet
                var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
                var gScoreIsBest = false;
                if (openList.indexOf(neighbor) === -1) {
                    // This the the first time we have arrived at this node, it must be the best
                    // Also, we need to take the h (heuristic) score since we haven't done so yet
                    gScoreIsBest = true;
                    neighbor.h = this.heuristic(neighbor.x, neighbor.y, targetNode.x, targetNode.y);
                    openList.push(neighbor);
                }
                else if (gScore < neighbor.g) {
                    // We have already seen the node, but last time it had a worse g (distance from start)
                    gScoreIsBest = true;
                }
                if (gScoreIsBest) {
                    // Found an optimal (so far) path to this node.	 Store info on how we got here and
                    //	just how good it really is...
                    neighbor.parent = currentNode;
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                }
            }
        }
        //return [];
    }
    /******************************************************************
    * return the neighbors list of the node b
    */
    AS.prototype.getNeighbors = function (node) {
        var neighbors = [], l, r, t, b;
        // l&r neigbors
        if (node.z - 1 >= 0)
            l = this.map[node.x][node.z - 1];
        if (l !== undefined && l.v === 0)
            neighbors.push(l);
        if (node.z + 1 < this.map[node.x].length)
            r = this.map[node.x][node.z + 1];
        if (r !== undefined && r.v === 0)
            neighbors.push(r);
        // t&b neigbors
        if (node.x - 1 >= 0)
            b = this.map[node.x - 1][node.z];
        if (b !== undefined && b.v === 0)
            neighbors.push(b);
        if (node.x + 1 < this.map.length)
            t = this.map[node.x + 1][node.z];
        if (t !== undefined && t.v === 0)
            neighbors.push(t);
        return neighbors;
    };
    AS.prototype.heuristic = function (x1, y1, x2, y2) {
        var d1 = Math.abs(x2 - x1);
        var d2 = Math.abs(y2 - y1);
        return d1 + d2; //manhattan dist
    };
    AS.prototype.getNextMove = function (currentPosition) {
        var i, l;
        for (i = 0, l = this.path.length; i < l; ++i) {
            if (this.path[i].x === currentPosition.x &&
                this.path[i].y === currentPosition.y) {
                // not the end of path
                if (i < l - 1) {
                    //console.log("move to :" + this.path[i+1].x + ", " this.path[i+1].z);
                    return new BABYLON.Vector2((this.path[i + 1].x - currentPosition.x), (this.path[i + 1].y - currentPosition.y));
                }
            }
        }
        // end of path, or current position not matched
        return new BABYLON.Vector2(0, 0);
    };
    return AS;
})();
/// <reference path="../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="SKYScene"/>
var PathSelector = (function () {
    function PathSelector(scene) {
        this.scene = scene;
    }
    PathSelector.prototype.clearAll = function () {
        this.selectedTile = null;
        this.tiles = new Array();
        this.cells = new Array();
    };
    PathSelector.prototype.initFrom = function (tile, ray) {
        //clear all
        this.clearAll();
        // compute accessible tiles
        this.tiles = this.scene.getMapHelper().getTilesAccessibleFrom(tile, ray);
        // hightlight these tiles
        var k = this.scene.getMapHelper().getK();
        // TODO fancy !
        var mat = new BABYLON.StandardMaterial("boxMaterial", this.scene);
        mat.diffuseColor = BABYLON.Color3.Purple();
        for (var t = 0; t < this.tiles.length; t++) {
            var position = this.scene.getMapHelper().getXYZ(this.tiles[t]);
            var cell = BABYLON.Mesh.CreatePlane("select", k * .8, this.scene);
            cell.material = mat;
            position.y = 0.1;
            cell.position = position;
            cell.rotation.x = Math.PI / 2;
            this.cells.push(cell);
        }
    };
    PathSelector.prototype.selectAgainst = function (tile) {
        // pas de tiles ajoutés lors de initFrom
        if (this.tiles == null)
            return false;
        // idem
        if (this.tiles.length == 0)
            return;
        // recherche le tile passé en paramètre
        var idx = this.tiles.indexOf(tile);
        // si pas de correspondance trouvée
        if (idx == -1)
            return;
        // si le tile trouvé correspond à celui déjà séléctionné
        // => double selection (ou selection-validation)
        if (this.selectedTile == tile)
            return true;
        // mise en evidence du tile slectionné
        this.selectedTile = tile;
        var cell = this.cells[idx];
        var mat = new BABYLON.StandardMaterial("boxMaterial", this.scene);
        mat.diffuseColor = BABYLON.Color3.Blue();
        cell.material = mat;
        // TODO MAJ du path
        return false;
    };
    return PathSelector;
})();
/// <reference path="../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="SKYScene"/>
/// <reference path="PathSelector"/>
var Player = (function () {
    function Player(scene, position) {
        this.mesh = null;
        this.skeleton = null;
        this.state = State.IDLE;
        this.wait = 0; // / 100
        this.PA = 0; // / 5
        this.hasFocus = false;
        this.isAnimated = true;
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
        this.pathSelector = new PathSelector(scene);
    }
    Player.prototype.update = function (deltaTime) {
        if (this.isAnimated == false)
            return;
        // en mvt
        if (this.state == State.MOVE) {
            return;
        }
        // msel (mvt selection)
        if (this.state == State.MSEL) {
            return;
        }
        // menu
        if (this.state == State.MENU) {
            return;
        }
        // 100% => focus and menu
        if (this.state == State.IDLE && this.wait >= 100) {
            this.state = State.MENU;
            this.showMenu();
            this.hasFocus = true;
            return;
        }
        // state idle => just wait
        if (this.state == State.IDLE) {
            // deltaTime in ms!
            this.wait += deltaTime / 100;
            return;
        }
    };
    Player.prototype.showMenu = function () {
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
        moveBtn.addEventListener("click", function () { return this.initiateMove(); });
        dashBtn.addEventListener("click", function () { return this.eventDash(); });
        shootBtn.addEventListener("click", function () { return this.eventShoot(); });
        endBtn.addEventListener("click", function () { return this.eventEndOfTurn(); });
        fscreenBtn.addEventListener("click", function () {
            console.log("TOGGLE FULLSCREEN");
            this.scene.getEngine().switchFullscreen(false);
        });
    };
    Player.prototype.hideMenu = function () {
        var menuDiv = document.getElementById("actionMenu");
        while (menuDiv.firstChild) {
            menuDiv.removeChild(menuDiv.firstChild);
        }
    };
    Player.prototype.getFocus = function () {
        return this.hasFocus;
    };
    Player.prototype.setToIdleState = function () {
        this.state = State.IDLE;
        this.wait = 0; // / 100
        this.PA = 3; // / 5
        this.hasFocus = false;
        this.isAnimated = true;
        this.playIdleAnimation();
    };
    Player.prototype.initiateMove = function () {
        console.log("OK LET'S MOVE");
        this.hideMenu();
        this.state = State.MSEL;
        // getpos in tiles
        var tile = this.scene.getMapHelper().getXZTile(this.mesh.position);
        console.log("player will move from : " + tile.toString());
        // TODO pathSelector. init
        this.pathSelector.initFrom(tile, this.PA);
        // wait for pointer event
    };
    Player.prototype.checkPointer = function (evt, pickInfo) {
        if (this.hasFocus == false)
            return;
        if (this.state == State.MSEL) {
            console.log("TOUCH EVENT : MOVE SELECTION");
            console.log("pt : " + pickInfo.pickedPoint);
            if (pickInfo.pickedPoint == null)
                return;
            var tile = this.scene.getMapHelper().getXZTile(pickInfo.pickedPoint);
            // permet de gere la selection-validation d'un tile pour le déplacement
            if (this.pathSelector.selectAgainst(tile)) {
                this.state = State.MOVE;
            }
        }
    };
    Player.prototype.eventDash = function () {
        console.log("DAAAASH");
    };
    Player.prototype.eventShoot = function () {
        console.log("SHOT");
    };
    Player.prototype.eventEndOfTurn = function () {
        console.log("END OF TURN");
        this.setToIdleState();
        this.hideMenu();
    };
    Player.prototype.playIdleAnimation = function () {
        this.scene.beginAnimation(this.skeleton, 0, 15, true);
    };
    Player.prototype.playSelectionAnimation = function () {
        this.scene.beginAnimation(this.skeleton, 0, 15, true, 2);
    };
    return Player;
})();
/// <reference path="../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="app.ts"/>
var FileDesc = (function () {
    function FileDesc(key, path, name) {
        this.key = key;
        this.path = path;
        this.name = name;
    }
    return FileDesc;
})();
var Preloader = (function () {
    function Preloader(rootFolder, targetScene, game) {
        this.progress = 0;
        this.filesLoadedTotal = 0;
        this.filesLoadedError = 0;
        this.isLoading = false;
        this.rootFolder = rootFolder;
        this.targetScene = targetScene;
        this.game = game;
        this.filesToLoad = new Array();
        this.filesLoaded = new Array();
    }
    Preloader.prototype.add = function (key, name, path) {
        this.filesToLoad.push(new FileDesc(key, path, name));
    };
    Preloader.prototype.start = function () {
        //console.log("loading started");
        this.isLoading = true;
        this.filesLoadedTotal = 0;
        for (var i = 0; i < this.filesToLoad.length; ++i) {
            this.loadFile(this.filesToLoad[i]);
        }
    };
    Preloader.prototype.loadFile = function (file) {
        //console.log("loading " +file.key);
        BABYLON.SceneLoader.ImportMesh(file.name, this.rootFolder, file.path, this.targetScene, function (newMeshes, particlesSystem, skeletons) {
            this.onSuccess(file.key, newMeshes, particlesSystem, skeletons);
        }, null, function () {
            this.onError(file.name, file.path);
        });
    };
    Preloader.prototype.onSuccess = function (key, newMeshes, particlesSystem, skeletons) {
        //console.log("loading " + key + " complete");
        this.filesLoadedTotal++;
        this.notifyProgress();
        newMeshes.forEach(function (m) {
            m.isVisible = false;
        });
        this.register(key, newMeshes, particlesSystem, skeletons);
        if (this.isFinished()) {
            this.isLoading = false;
            //var screen:HTMLElement = document.getElementById("loadingScreen");
            this.notifyComplete();
        }
    };
    //
    Preloader.prototype.onError = function (filename, filepath) {
        this.filesLoadedError++;
        console.warn("Unable to load file: " + filename + " at :" + filepath);
    };
    //
    Preloader.prototype.register = function (key, newMeshes, particlesSystem, skeletons) {
        var entry = { mesh: newMeshes, particlesSystem: particlesSystem, skeletons: skeletons };
        this.filesLoaded[key] = entry;
    };
    //
    Preloader.prototype.isFinished = function () {
        return (this.filesLoadedTotal == this.filesToLoad.length);
    };
    //
    Preloader.prototype.notifyProgress = function () {
        this.game.notifyProgress(this.filesLoadedTotal / this.filesToLoad.length);
    };
    //
    Preloader.prototype.notifyComplete = function () {
        this.game.notifyComplete(this.filesLoaded);
    };
    return Preloader;
})();
/// <reference path="../../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="../SKYScene"/>
var Level1 = (function (_super) {
    __extends(Level1, _super);
    function Level1() {
        _super.apply(this, arguments);
        this.player = null;
    }
    Level1.prototype.init = function (canvas, assets) {
        //console.log("init Level1");
        this.map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 4, 0, 0, 0, 0, 0, 1],
            [1, 2, 4, 0, 0, 3, 0, 0, 1],
            [1, 0, 4, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1]
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
        var k = this.getMapHelper().getK();
        for (var j = 0; j < this.map.length; j++) {
            for (var i = 0; i < this.map[j].length; i++) {
                var tile = new BABYLON.Vector2(i, j);
                var position = this.getMapHelper().getXYZ(tile);
                switch (this.map[j][i]) {
                    case 1:
                        //console.log("box");
                        var box = BABYLON.Mesh.CreateBox("box", k * .8, this);
                        var boxMaterial = new BABYLON.StandardMaterial("boxMaterial", this);
                        boxMaterial.diffuseColor = BABYLON.Color3.Yellow();
                        boxMaterial.emissiveColor = BABYLON.Color3.Yellow();
                        box.material = boxMaterial;
                        position.y = k / 2;
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
                    default:
                        // nothing for the moment
                        //this.cloneAndMoveTo(Items.Ground, position);
                        break;
                }
            }
        }
        // for each add a square to represent the ground
        this.createGround();
        //console.log("camera");
        var radius = this.getMapHelper().getW() * this.getMapHelper().getK();
        var camera = new BABYLON.ArcRotateCamera("camera", 3 * Math.PI / 2.0, Math.PI / 4.0, radius, this.getMapHelper().getXYZMapCenter(), this);
        //this.activeCamera = camera;
        //this.activeCamera.attachControl(canvas); //onlyt for debug (in game cam must be static)
        // OK end of map init => now we select the player
        this.beforeRender = function () { return this.update(); };
        this.onPointerDown = function (evt, pickinfo) { return this.checkPointer(evt, pickinfo); };
        this.skeletonsEnabled = true;
    };
    Level1.prototype.createGround = function () {
        //console.log("tiledGround");
        var subdivision = { w: this.getMapHelper().getW(), h: this.getMapHelper().getH() };
        var precision = { w: 1, h: 1 };
        var min = this.getMapHelper().getXYZ(new BABYLON.Vector2(0, 0), false);
        var max = this.getMapHelper().getXYZ(new BABYLON.Vector2(this.getMapHelper().getW(), this.getMapHelper().getH()), false);
        // console.log("subdivision : " + subdivision.w + ", " + subdivision.h);
        // console.log("ground min : " + min.toString());
        // console.log("ground max : " + max.toString());
        // map : 9*7 tiles
        this.ground = BABYLON.Mesh.CreateTiledGround("ground", min.x, min.z, max.x, max.z, subdivision, precision, this);
        var whiteMaterial = new BABYLON.StandardMaterial("White", this);
        whiteMaterial.diffuseColor = new BABYLON.Color3(.97, .89, .42); //light yellow // TODO defines these colors in defines
        var blackMaterial = new BABYLON.StandardMaterial("Black", this);
        blackMaterial.diffuseColor = new BABYLON.Color3(.92, .54, .19); // orange
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
                this.ground.subMeshes.push(new BABYLON.SubMesh(row % 2 ^ col % 2, 0, verticesCount, base, tileIndicesLength, this.ground));
                base += tileIndicesLength;
            }
        }
    };
    Level1.prototype.cloneAndMoveTo = function (name, pos) {
        //console.log("cloning " + name);
        var item = this.assets[name].mesh;
        item.forEach(function (m) {
            var mm = m.clone();
            mm.position = pos;
            mm.isVisible = true;
        });
    };
    Level1.prototype.update = function () {
        var deltaTime = this.getEngine().getDeltaTime();
        //console.log("lastDeltaTime : " + deltaTime);
        this.player.update(deltaTime);
    };
    Level1.prototype.checkPointer = function (evt, pickInfo) {
        this.player.checkPointer(evt, pickInfo);
    };
    return Level1;
})(SKYScene);
/// <reference path="../../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="../SKYScene"/>
var LoadingScene = (function (_super) {
    __extends(LoadingScene, _super);
    function LoadingScene() {
        _super.apply(this, arguments);
    }
    LoadingScene.prototype.init = function (canvas, assets) {
        //console.log("init loadingScene");
        var camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(0, 10, 0), this);
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
    };
    return LoadingScene;
})(SKYScene);
//# sourceMappingURL=app.js.map