//function get_window_width_height() {
//    var width = window.innerWidth;
//    var heigth = window.innerHeight;
//    return [width, heigth];
//}

function create_btn(x, y, txt, clr, width, press_fn) {
  let btn = new Clickable(0, 0);
  btn.locate(x, y);
  btn.width = width;
  btn.height = 25;
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

function set_btn(btn, txt, clr, state) {
  btn.color = clr;
  btn.text = txt;
  btn.state = state;
}

function resetBtnPressed() {
  set_btn(glob.goBtn, "Go", clr_blue, false);
  reset_sim(glob.ui, glob.sim);
}

function updateClipboard(newClip) {
  navigator.clipboard.writeText(newClip).then(function() {
    /* clipboard successfully set */
  }, function() {
    /* clipboard write failed */
  });
}

function get_UI_state() {
  const gui_obj = glob.gui.prototype.getValuesAsJSON();
  const gui_dr_obj = glob.gui_dr.prototype.getValuesAsJSON();
  const both_obj = { gui: gui_obj, gui_dr: gui_dr_obj, ctr: glob.ctr, scale: glob.scale };
  return both_obj;
}

function configBtnPressed() {
  const ui_obj = get_UI_state();
  // async promise
  glob.json_url.compress(ui_obj).then(output=>updateClipboard(glob.url+"?config="+output));
}

function saveUI0() {
  const ui_obj = get_UI_state();
  // async promise
  glob.json_url.compress(ui_obj).then(output=>glob.ui0=output);
}

function restoreSettings(str) {
  glob.json_url.decompress(str).then(json => { 
    glob.gui.prototype.setValuesFromJSON(json.gui);
    glob.gui_dr.prototype.setValuesFromJSON(json.gui_dr);
    glob.ctr = json.ctr;
    glob.scale = json.scale;
    reset_sim(glob.ui, glob.sim);
    redraw(); })
}

function resetUIBtnPressed() {
  restoreSettings(glob.ui0);
}


function goBtnPressed() {
  if (glob.goBtn.state)
    set_btn(glob.goBtn, "Go", clr_blue, false);
  else
    set_btn(glob.goBtn, "Stop", clr_red, true);
  //console.log("Go Btn pressed!", glob.goBtn);
}