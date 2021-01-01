let glob = {
  goBtn: null,
  resetBtn: null,
  go: false,
  bgColor: [0, 0, 0],
  ui: {
    //go: false,

    // major axis
    a: 1.5,
    aMin: 1,
    aMax: 4,
    aStep: 0.01,
    // dirs

    dirs: 180,
    dirsMin: 2,
    dirsMax: 1800,
    dirsStep: 1,
    depart: ['border', 'center', 'focus', 'top vtx', 'bottom vtx', 'left vtx', 'right vtx'],
    // tDeg
    tDeg: 30.,
    tDegMin: -360,
    tDegMax: 360,
    tDegStep: 0.1,

    //bgColor: [0, 0, 0]
  },
  ui_dr: {
    // vel
    speedPwr: [-3,-4,-5,-6],
    // internal steps
    internalStepsPwr: [1,2,3,4],
    //go: false,
    // major axis
    particles: ['centers','chain','both'],
    com: true,
    spokes: false,
    newton: false

    //bgColor: [0, 0, 0]
  },
  sim: {
    // sim state should probably split
    P0: [0, 0],
    Qs: null,
    vs: null,
    particles: null,
    com: []
  }
};

function windowResized() {
  //[glob.width, glob.height] = get_window_width_height();
  resizeCanvas(windowWidth, windowHeight);
}

function gui_changed() {
  set_btn(glob.goBtn, "Go", clr_blue, false);
  reset_sim(glob.ui, glob.sim);
  redraw();
}

function setup() {
  //[glob.width, glob.height] = get_window_width_height();
  createCanvas(windowWidth, windowHeight);
  glob.goBtn = create_btn(20, 20, "Go", clr_blue, goBtnPressed);
  glob.resetBtn = create_btn(80, 20, "Reset", clr_purple, resetBtnPressed);

  let gui = createGui('Elliptic Echos');
  //gui.onchange = gui_changed;
  gui.addObject(glob.ui);
  gui.setPosition(20, 60);
  gui.prototype.setGlobalChangeHandler(gui_changed);

  let gui_dr = createGui('Draw Controls');
  gui_dr.addObject(glob.ui_dr);
  gui_dr.setPosition(20, 350);

  reset_sim(glob.ui, glob.sim);
  textAlign(CENTER, BOTTOM);
  textStyle(NORMAL);
  // only call draw when then gui is changed
  //loop();
}

function draw() {
  background(glob.bgColor);
  glob.goBtn.draw();
  glob.resetBtn.draw();
  if (glob.goBtn.state)
    update_sim(glob.ui, glob.sim, glob.ui_dr);
  else // should only reset if the control has changed
    ;//reset_sim(glob.ui, glob.sim);
  push();
  translate(windowWidth / 2, windowHeight / 2);
  scale(0.7 * windowHeight / 2);
  draw_sim(glob.ui, glob.sim, glob.ui_dr);
  pop();

  return (glob.goBtn.state);
}

