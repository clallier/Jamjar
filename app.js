/// <reference path="..\js\Babylon.js-master\babylon.2.1.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SKYScene = (function (_super) {
    __extends(SKYScene, _super);
    function SKYScene(engine, name) {
        _super.call(this, engine);
        this._name = "SKYScene";
        this._name = name;
        console.log("call new SKYScene: " + this._name);
    }
    SKYScene.prototype.name = function () { return this._name; };
    SKYScene.prototype.init = function (canvas, assets) { };
    ;
    return SKYScene;
})(BABYLON.Scene);
/// <reference path="../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="SKYScene"/>
var SKY = (function () {
    function SKY(canvasId) {
        var _this = this;
        this.version = "1.0.19";
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
            if (_this.activeScene == null)
                console.log("runRenderLoop : activeScene is null");
            _this.activeScene.render();
        });
        /*
        window.addEventListener("resize", ev => {
          if(this.engine != null)
            this.engine.resize();
        }, false);
        */
    }
    /*
    initLoadingScene() {
      this.changeScene(this.loadingScene);
    }
  
    initLevel1() {
  
      //document.getElementById("loadingScreen").style.transform = "translateX(-300%)";
      //Factory.createJamJar(this.scene, light2);
      //Factory.createBot(this.scene);
      this.changeScene(this.level1);
    }
    */
    SKY.prototype.notifyProgress = function (value) {
        console.log("progress: " + value);
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
        console.log("new active scene: " + this.activeScene.name());
    };
    return SKY;
})();
document.addEventListener("DOMContentLoaded", function (ev) {
    //if(BABYLON.Engine.isSupported()) {
    var game = new SKY("renderCanvas");
    //}
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
// http://joeriks.com/2013/03/30/simple-module-dependencies-in-typescript/
// <reference path=
//"..\js\Babylon.js-master\babylon.2.1.d.ts"/>
//"defines"/>
//"factory"/>
//"preloader"/>
//"SKYScene"/>
//"./levels/loadingScene"/>
//"./levels/level1"/>
/// <reference path="refs.ts"/>
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
        console.log("loading started");
        this.isLoading = true;
        this.filesLoadedTotal = 0;
        for (var i = 0; i < this.filesToLoad.length; ++i) {
            this.loadFile(this.filesToLoad[i]);
        }
    };
    Preloader.prototype.loadFile = function (file) {
        var _this = this;
        console.log("loading " + file.key);
        BABYLON.SceneLoader.ImportMesh(file.name, this.rootFolder, file.path, this.targetScene, function (newMeshes, particlesSystem, skeletons) {
            _this.onSuccess(file.key, newMeshes, particlesSystem, skeletons);
        }, null, function () {
            _this.onError(file.name, file.path);
        });
    };
    Preloader.prototype.onSuccess = function (key, newMeshes, particlesSystem, skeletons) {
        console.log("loading " + key + " complete");
        this.filesLoadedTotal++;
        this.notifyProgress();
        newMeshes.forEach(function (m) {
            m.isVisible = false;
        });
        this.register(key, newMeshes, particlesSystem, skeletons);
        if (this.isFinished()) {
            this.isLoading = false;
            var screen = document.getElementById("loadingScreen");
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
    }
    Level1.prototype.init = function (canvas, assets) {
        console.log("init Level1");
        console.log("lights");
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this);
        light1.intensity = 0.8;
        var light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(0, -1, -1), this);
        light2.position = new BABYLON.Vector3(0, 20, 0);
        console.log("fog");
        this.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        this.fogEnabled = true;
        this.fogDensity = 0.02;
        console.log("ground");
        var ground = assets[Items.Ground].mesh;
        ground.position = new BABYLON.Vector3(0, 0, 0);
        ground.receiveShadows = true;
        console.log("camera");
        var camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(0, 10, 0), this);
        camera.target = ground;
        /*
            console.log("cloning SpaceCowboy");
            var spaceCowboy = assets[Items.SpaceCowboy].mesh;
        
            console.log("cloning CrateBox");
            var crateBox = assets[Items.CrateBox].mesh;
        
            console.log("cloning HiBot");
            var HiBot = assets[Items.HiBot].mesh;
        */
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
        console.log("init loadingScene");
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