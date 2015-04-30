class FileDesc {
  key: string;
  path: string;
  name: string;

  constructor(key, path, name) {
    this.key = key;
    this.path = path;
    this.name = name;
  }
}

class Preloader {
  rootFolder: string;
  targetScene: BABYLON.Scene;
  game: SKY;
  progress: number = 0;
  filesToLoad: FileDesc[];
  filesLoaded: Object[];
  filesLoadedTotal:number = 0;
  filesLoadedError:number = 0;
  isLoading:boolean = false;

  constructor(rootFolder:string, targetScene: BABYLON.Scene, game:SKY) {
    this.rootFolder = rootFolder;
    this.targetScene = targetScene;
    this.game = game;
    this.filesToLoad = new Array<FileDesc>();
    this.filesLoaded = new Array<Object>();
  }

  add(key:string, name:string, path:string) {
    this.filesToLoad.push(new FileDesc(key, path, name));
  }

  start() {
    console.log("loading started");
    this.isLoading = true;
    this.filesLoadedTotal = 0;

    for(var i=0; i < this.filesToLoad.length; ++i){
      this.loadFile(this.filesToLoad[i]);
    }
  }

  loadFile(file:FileDesc) {
    console.log("loading " +file.key);

    BABYLON.SceneLoader.ImportMesh(file.name, this.rootFolder, file.path, this.targetScene,
    (newMeshes, particlesSystem, skeletons) => {
      this.onSuccess(file.key, newMeshes, particlesSystem, skeletons);
    },
    null,
    () => {
      this.onError(file.name, file.path);
    }
  );
  }

  onSuccess(key: string, newMeshes: BABYLON.AbstractMesh[], particlesSystem: BABYLON.ParticleSystem[], skeletons: BABYLON.Skeleton[]) {
    console.log("loading " + key + " complete");
    this.filesLoadedTotal ++;
    this.notifyProgress();
    newMeshes.forEach((m)=>{
      m.isVisible = false;
    });

    this.register(key, newMeshes, particlesSystem, skeletons);
    if(this.isFinished()) {
      this.isLoading = false;
      var screen:HTMLElement = document.getElementById("loadingScreen");
      this.notifyComplete();
    }
  }

  //
  onError(filename, filepath) {
    this.filesLoadedError ++;
    console.warn("Unable to load file: " + filename + " at :" + filepath);
  }

  //
  register(key: string, newMeshes: BABYLON.AbstractMesh[], particlesSystem: BABYLON.ParticleSystem[], skeletons: BABYLON.Skeleton[]) {
    var entry = {mesh: newMeshes, particlesSystem: particlesSystem, skeletons:skeletons};
    this.filesLoaded[key] = entry;
  }

  //
  isFinished() {
    return (this.filesLoadedTotal == this.filesToLoad.length);
  }

  //
  notifyProgress() {
    this.game.notifyProgress(this.filesLoadedTotal / this.filesToLoad.length);
  }

  //
  notifyComplete() {
    this.game.notifyComplete(this.filesLoaded);
  }
}
