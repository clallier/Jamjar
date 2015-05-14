class Items {
  static SpaceCowboy: string= "SpaceCowboy";
  static CrateBox: string= "CrateBox";
  static Ground: string= "Ground";
  static HiBot: string= "HiBot";
}

class State {
  static IDLE = 1;
  static MENU = 2;
  static MSEL = 3; // path selection
  static MOVE = 4;
  static DASH = 5;
  static SHOT = 6;
  static DSTY = 7;  // DESTROY
}

// Translated Text
class TText {

  static langage: string = "EN";

  private static textArray = {
    "default":"Key not found",

    "REM":"EN Texts",
    "MENU_MOVE_EN"    : "MOVE",
    "MENU_DASH_EN"    : "DASH",
    "MENU_SHOOT_EN"   : "SHOOT",
    "MENU_ENDTURN_EN" : "END TURN",
    "MENU_FS_EN" : "FULLSCREEN"
  };

  static getValue (key:string) :string {
    let fullKey:string = key + "_" + TText.langage;
    let value:string = TText.textArray[fullKey];
    if(value == undefined)
      value = TText.textArray["default"];
    return value;
  }
}
