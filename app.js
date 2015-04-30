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
/// <reference path="../refs.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Level1 = (function (_super) {
    __extends(Level1, _super);
    function Level1(engine, canvas, assets) {
        _super.call(this, engine);
        console.log("initLevel1");
        console.log("camera");
        var camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 2 - .25, 8, new BABYLON.Vector3(0, 0, 0), this);
        camera.attachControl(canvas, false);
        console.log("lights");
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this);
        light1.intensity = 0.8;
        var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -1, -1), this);
        light2.position = new BABYLON.Vector3(0, 20, 0);
        console.log("fog");
        this.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        this.fogEnabled = true;
        this.fogDensity = 0.02;
        console.log("ground");
        var ground = BABYLON.Mesh.CreateGround("ground", 9.0, 5.0, 1, this);
        ground.position = new BABYLON.Vector3(0, 0, 0);
        ground.receiveShadows = true;
        console.log("mirror");
        var material1 = new BABYLON.StandardMaterial("material1", this);
        material1.diffuseTexture = new BABYLON.MirrorTexture("mirror", 256, this, true);
        ground.material = material1;
        console.log("cloning");
        var xpos = -50;
        for (var i = 0; i < 10; i++) {
            var car = assets["SpaceCowboy"].mesh;
            car.forEach(function (m) {
                console.log("clone " + i);
                var mm = m.clone();
                mm.position.x = xpos + i * 10;
                mm.isVisible = true;
            });
        }
    }
    return Level1;
})(BABYLON.Scene);
/// <reference path="..\js\Babylon.js-master\babylon.2.1.d.ts"/>
/// <reference path="factory.ts"/>
/// <reference path="preloader.ts"/>
/// <reference path="levels/level1.ts"/>
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
/// <reference path="refs.ts"/>
var SKY = (function () {
    function SKY(canvasId) {
        var _this = this;
        this.version = "1.0.1";
        console.log("version: " + this.version);
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas, false);
        this.engine.setSize(window.innerWidth, window.innerHeight);
        this.engine.setHardwareScalingLevel(1);
        this.loadingScene = new BABYLON.Scene(this.engine);
        this.loadingScene.clearColor = BABYLON.Color3.White();
        this.initLoadingScene();
        this.level1 = new BABYLON.Scene(this.engine);
        this.level1.clearColor = BABYLON.Color3.White();
        this.assets = null;
        this.loader = new Preloader("assets/", this.level1, this);
        this.loader.add("SpaceCowboy", "SpaceCowboy", "map.babylon");
        this.loader.add("CrateBox", "CrateBox", "map.babylon");
        this.loader.add("Ground", "Ground", "map.babylon");
        this.loader.add("HiBot", "HiBot", "map.babylon");
        this.loader.start();
        // create main render loop
        this.engine.runRenderLoop(function () {
            _this.activeScene.render();
        });
        window.addEventListener("resize", function (ev) {
            if (_this.engine != null)
                _this.engine.resize();
        }, false);
    }
    SKY.prototype.initLoadingScene = function () {
        var camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(0, 10, 0), this.loadingScene);
        var light1 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0), this.loadingScene);
        light1.intensity = 1;
        var box = BABYLON.Mesh.CreateBox("box", 1, this.loadingScene);
        var boxMaterial = new BABYLON.StandardMaterial("boxMaterial", this.loadingScene);
        boxMaterial.diffuseColor = BABYLON.Color3.Purple();
        boxMaterial.emissiveColor = BABYLON.Color3.Purple();
        box.material = boxMaterial;
        camera.target = box;
        var background = BABYLON.Mesh.CreateGround("background", 100, 100, 1, this.loadingScene);
        var mat = new BABYLON.StandardMaterial("backgroundMaterial", this.loadingScene);
        mat.diffuseColor = BABYLON.Color3.White();
        //var loadingTextTexture = new BABYLON.DynamicTexture("loadingTextTexture", 512, this.loadingScene, false);
        //loadingTextTexture.drawText("0%", 50, 50, "50px Segoe UI", "000000", "ffffff", false, true);
        //mat.diffuseTexture = loadingTextTexture;
        background.material = mat;
        this.changeScene(this.loadingScene);
    };
    SKY.prototype.initLevel1 = function () {
        //document.getElementById("loadingScreen").style.transform = "translateX(-300%)";
        //Factory.createJamJar(this.scene, light2);
        //Factory.createBot(this.scene);
        this.level1 = new Level1(this.engine, this.canvas, this.assets);
        this.changeScene(this.level1);
    };
    SKY.prototype.notifyProgress = function (value) {
        console.log("progress: " + value);
        var box = this.loadingScene.getMeshByName("box");
        box.scaling.x = value * 5;
    };
    SKY.prototype.notifyComplete = function (assets) {
        this.assets = assets;
        this.initLevel1();
    };
    SKY.prototype.changeScene = function (scene) {
        if (this.activeScene != null) {
            this.activeScene.dispose();
        }
        this.activeScene = scene;
    };
    return SKY;
})();
document.addEventListener("DOMContentLoaded", function (ev) {
    if (BABYLON.Engine.isSupported()) {
        var game = new SKY("renderCanvas");
    }
});
//# sourceMappingURL=app.js.map