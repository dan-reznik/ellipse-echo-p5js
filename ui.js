//function get_window_width_height() {
//    var width = window.innerWidth;
//    var heigth = window.innerHeight;
//    return [width, heigth];
//}
 
  function create_btn(x,y,txt,clr,press_fn) {
    let btn = new Clickable(0,0);
    btn.locate(x,y);
    btn.width=50;
    btn.height=25;
    btn.onPress = press_fn;
    btn.color = clr;       //Background color of the clickable (hex number as a string)
    btn.cornerRadius = 20;       //Corner radius of the clickable (float)
    btn.strokeWeight = 2;        //Stroke width of the clickable (float)
    btn.stroke = "#000000";      //Border color of the clickable (hex number as a string)
    btn.text = txt;       //Text of the clickable (string)
    btn.textColor = "white";   //Color of the text (hex number as a string)
    btn.textSize = 12;           //Size of the text (integer)
    btn.textFont = "sans-serif"; //Font of the text (string)
    btn.textScaled = false;       //Whether to scale the text with the clickable (boolean)
    btn.state = false;
    return btn;
}

function reset_btn(btn,txt,clr,state) {
    btn.color=clr;
    btn.text=txt;
    btn.state=state;
}

function resetBtnPressed() {
  reset_sim(glob.ui,glob.sim);
}

function goBtnPressed() {
  if (glob.goBtn.state)
    reset_btn(glob.goBtn, "Go", clr_blue, false);
  else
    reset_btn(glob.goBtn, "Stop", clr_red, true);
  console.log("Go Btn pressed!", glob.goBtn);
}