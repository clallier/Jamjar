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
        this.isLoading = true;
        this.filesLoadedTotal = 0;
        for (var i = 0; i < this.filesToLoad.length; ++i) {
            this.loadFile(this.filesToLoad[i]);
        }
    };
    Preloader.prototype.loadFile = function (file) {
        var _this = this;
        BABYLON.SceneLoader.ImportMesh(file.name, this.rootFolder, file.path, this.targetScene, function (newMeshes, particlesSystem, skeletons) {
            _this.onSuccess(file.key, newMeshes, particlesSystem, skeletons);
        }, null, function () {
            _this.onError(file.name, file.path);
        });
    };
    Preloader.prototype.onSuccess = function (key, newMeshes, particlesSystem, skeletons) {
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
    Preloader.prototype.onError = function (filename, filepath) {
        this.filesLoadedError++;
        console.warn("Unable to load file: " + filename + " at :" + filepath);
    };
    Preloader.prototype.register = function (key, newMeshes, particlesSystem, skeletons) {
        var entry = { mesh: newMeshes, particlesSystem: particlesSystem, skeletons: skeletons };
        this.filesLoaded[key] = entry;
    };
    Preloader.prototype.isFinished = function () {
        return (this.filesLoadedTotal == this.filesToLoad.length);
    };
    Preloader.prototype.notifyProgress = function () {
        this.game.notifyProgress(this.filesLoadedTotal / this.filesToLoad.length);
    };
    Preloader.prototype.notifyComplete = function () {
        this.game.notifyComplete(this.filesLoaded);
    };
    return Preloader;
})();
//# sourceMappingURL=preloader.js.map