//function get_window_width_height() {
//    var width = window.innerWidth;
//    var heigth = window.innerHeight;
//    return [width, heigth];
//}
 
const params = {
    //go: false,

    // major axis
    a: 1.5,
    aMin: 1,
    aMax: 4,
    aStep: 0.01,
    // tDeg
    tDeg: 30.,
    tDegMin: -360,
    tDegMax: 360,
    tDegStep: 0.1,
  
    // dirs
    dirs: 180,
    dirsMin: 1,
    dirsMax: 1800,
    dirsStep: 1,
  
    bgColor: [0, 0, 0]
  };

  function create_go_btn(x,y,press_fn) {
    let btn = new Clickable(0,0);
    btn.locate(x,y);
    btn.width=50;
    btn.height=25;
    btn.onPress = press_fn;
    btn.color = "blue";       //Background color of the clickable (hex number as a string)
    btn.cornerRadius = 20;       //Corner radius of the clickable (float)
    btn.strokeWeight = 2;        //Stroke width of the clickable (float)
    btn.stroke = "#000000";      //Border color of the clickable (hex number as a string)
    btn.text = "Go";       //Text of the clickable (string)
    btn.textColor = "white";   //Color of the text (hex number as a string)
    btn.textSize = 12;           //Size of the text (integer)
    btn.textFont = "sans-serif"; //Font of the text (string)
    btn.textScaled = false;       //Whether to scale the text with the clickable (boolean)
    return btn;
}