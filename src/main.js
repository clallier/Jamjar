var SKY = (function () {
    function SKY(canvasId) {
        var _this = this;
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
        this.loader.add("Cube.001", "Cube.001", "protector_bot.babylon");
        this.loader.add("jamjar", "jamjar", "jamjar.babylon");
        this.loader.start();
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
        background.material = mat;
        this.changeScene(this.loadingScene);
    };
    SKY.prototype.initLevel1 = function () {
        var camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 2 - .25, 8, new BABYLON.Vector3(0, 0, 0), this.level1);
        camera.attachControl(this.canvas, false);
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.level1);
        light1.intensity = 0.8;
        var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -1, -1), this.level1);
        light2.position = new BABYLON.Vector3(0, 20, 0);
        this.level1.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        this.level1.fogEnabled = true;
        this.level1.fogDensity = 0.02;
        var ground = BABYLON.Mesh.CreateGround("ground", 9.0, 5.0, 1, this.level1);
        ground.position = new BABYLON.Vector3(0, 0, 0);
        ground.receiveShadows = true;
        var material1 = new BABYLON.StandardMaterial("material1", this.level1);
        material1.diffuseTexture = new BABYLON.MirrorTexture("mirror", 256, this.level1, true);
        ground.material = material1;
        return ground;
        var xpos = -50;
        for (var i = 0; i < 10; i++) {
            var car = this.assets["Cube.001"].mesh;
            car.forEach(function (m) {
                var mm = m.clone();
                mm.position.x = xpos + i * 10;
                mm.isVisible = true;
            });
        }
        this.changeScene(this.level1);
    };
    SKY.prototype.notifyProgress = function (value) {
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
//# sourceMappingURL=main.js.map