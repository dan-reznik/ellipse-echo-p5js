let glob = {
  url: 'https://dan-reznik.github.io/ellipse-echo-p5js/',
  clrs: null,
  goBtn: null,
  resetBtn: null,
  configBtn: null,
  go: false,
  bgColor: [0, 0, 0],
  scale: .7,
  ctr0: [0, 0], ctr: [0, 0],
  mouse: [0, 0],
  dragged: false,
  gui_width:150,
  gui:null, ui_dr: null,
  json_url:null, // compress json into url
  ui: {
    //go: false,

    // major axis
    a: 1.618,
    aMin: 1,
    aMax: 4,
    aStep: 0.001,
    // dirs

    dirs: 1800,
    dirsMin: 2,
    dirsMax: 3600,
    dirsStep: 1,
    depart: ['border', 'center', 'focus', 'top vtx', 'bottom vtx', 'left vtx', 'right vtx', "mid minor","mid major"],
    // tDeg
    tDeg: 45.,
    tDegMin: -360,
    tDegMax: 360,
    tDegStep: 0.1,
    // seed radius
    initRadius:0,
    initRadiusMin:0,
    initRadiusMax:1,
    initRadiusStep:.01,
    //bgColor: [0, 0, 0]
  },
  ui_dr: {
    // vel
    speedPwr: [-3, -4, -5, -6],
    // internal steps
    internalStepsPwr: [0, 1, 2, 3, 4],
    //go: false,
    // major axis
    particles: ['off','centers', 'chain', 'both'],
    comTrail: false,
    spokes: false,
    newton: true,
    caustics: ["off", "3", "3,4", "3,4,5","3,4,5,6","3,4,4si"],
    //bgColor: [0, 0, 0]
    clrSeed: 1,
    clrSeedMin: 0,
    clrSeedMax: 256,
    // highlight band
    hiliteBand:0,
    hiliteBandMin:0,
    hiliteBandMax:1,
    hiliteBandStep:.01
  },
  sim: {
    // sim state should probably split
    P0: [0, 0],
    Qs: null,
    vs: null,
    particles: null,
    caustic_list: null,
    com: []
  }
};

function windowResized() {
  //[glob.width, glob.height] = get_window_width_height();
  
  resizeCanvas(windowWidth, windowHeight);
  glob.gui_dr.setPosition(windowWidth-glob.gui_width-20, 20);
  glob.ctr = [windowWidth / 2, windowHeight / 2];
}

function gui_changed() {
  set_btn(glob.goBtn, "Go", clr_blue, false);
  reset_sim(glob.ui, glob.sim);
  redraw();
}

function gui_dr_changed() {
  glob.clrs = shuffle_seeded(clrs_crayola.map(c => c.rgb), glob.ui_dr.clrSeed);
  redraw();
}

function prepare_main_gui(width) {
  const gui = createGui('Elliptic Echos');
  //gui.onchange = gui_changed;
  gui.addObject(glob.ui);
  gui.setPosition(20, 60);
  gui.prototype.setWidth(width);
  gui.prototype.setGlobalChangeHandler(gui_changed);
  return gui;
}

function prepare_draw_gui(width) {
  const gui_dr = createGui('Draw Controls');
  gui_dr.addObject(glob.ui_dr);
  gui_dr.prototype.setWidth(width);
  gui_dr.setPosition(windowWidth-width-20, 20);
  // the 2nd argument is an index into the array.
  gui_dr.prototype.setValue('speedPwr', 1);
  gui_dr.prototype.setValue('internalStepsPwr', 2);
  gui_dr.prototype.setValue('particles', 2);
  gui_dr.prototype.setValue('clrSeed', 114);
  // gui_dr.prototype.setValue('caustics', 2);
  gui_dr.prototype.setGlobalChangeHandler(gui_dr_changed);
  return gui_dr;
}

function setup() {
  //[glob.width, glob.height] = get_window_width_height();
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, BOTTOM);
  textStyle(NORMAL);

  glob.goBtn = create_btn(20, 20, "Go", clr_blue, goBtnPressed);
  glob.resetBtn = create_btn(80, 20, "Reset", clr_purple, resetBtnPressed);
  glob.configBtn = create_btn(140,20, "Config", clr_dark_orange, configBtnPressed)

  glob.gui = prepare_main_gui(glob.gui_width);
  glob.gui_dr = prepare_draw_gui(glob.gui_width);

  glob.clrs = shuffle_seeded(clrs_crayola.map(c => c.rgb), glob.ui_dr.clrSeed);

  // only call draw when then gui is changed
  //loop();
  glob.ctr = [windowWidth / 2, windowHeight / 2];
  glob.json_url = JsonUrl('lzma'); // JsonUrl is added to the window object
  const params = getURLParams();
  if (params.config!=null) {
    restoreSettings(params.config);
  } else
    reset_sim(glob.ui, glob.sim);
}

function keyPressed() {
  if (!glob.goBtn.state)
    if (keyCode === LEFT_ARROW)
      update_sim(glob.ui, glob.sim, glob.ui_dr, true);
    else if (keyCode === RIGHT_ARROW)
      update_sim(glob.ui, glob.sim, glob.ui_dr, false);
}


function draw() {
  background(glob.bgColor);
  glob.goBtn.draw();
  glob.resetBtn.draw();
  glob.configBtn.draw();
  if (glob.goBtn.state)
    update_sim(glob.ui, glob.sim, glob.ui_dr, false);
  else // should only reset if the control has changed
    ;//reset_sim(glob.ui, glob.sim);
  push();
  // translate(glob.ctr[0], glob.ctr[1]);
  // scale(glob.width / (glob.scale*glob.scaleFactor));
  // rotate(dict_rot[glob.ui.rot]); 
  draw_text("© 2021 Dan S. Reznik", [.94 * windowWidth, .98 * windowHeight], clr_yellow, 16);
  translate(glob.ctr[0], glob.ctr[1]);
  scale(glob.scale * windowHeight / 2);
  draw_sim(glob.ui, glob.sim, glob.ui_dr);
  pop();

  return (glob.goBtn.state);
}

function mouseWheel(event) {
  if (event.delta < 0)
    glob.scale *= 1.05;
  else
    glob.scale *= 0.95;
  if (!glob.goBtn.state)
    redraw();
  return false;
}

function mouse_in_ell() {
  let p = vscale(vdiff(glob.mouse, glob.ctr), 2 / (glob.scale * windowHeight));
  return in_ell(glob.ui.a, 1, p);
}

function mousePressed() {
  glob.mouse = [mouseX, mouseY];
  if (mouse_in_ell()) {
    glob.dragged = true;
    glob.ctr0 = JSON.parse(JSON.stringify(glob.ctr));
  }
}

function mouseReleased() {
  //glob.click_ell = false;
  glob.dragged = false;
}

function mouseDragged() {
  if (glob.dragged)
    glob.ctr = vsum(glob.ctr0, vdiff([mouseX, mouseY], glob.mouse));
  if (!glob.goBtn.state)
    redraw();
}