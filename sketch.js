let glob = {
  goBtn: null,
  resetBtn: null,
  go: false,
  bgColor: [0, 0, 0],
  scale: .7,
  ctr0: [0, 0], ctr: [0, 0],
  mouse: [0, 0],
  dragged:false,
  ui: {
    //go: false,

    // major axis
    a: 1.618,
    aMin: 1,
    aMax: 4,
    aStep: 0.001,
    // dirs

    dirs: 720,
    dirsMin: 2,
    dirsMax: 3600,
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
    speedPwr: [-3, -4, -5, -6],
    // internal steps
    internalStepsPwr: [0, 1, 2, 3, 4],
    //go: false,
    // major axis
    particles: ['centers', 'chain', 'both'],
    com: true,
    spokes: false,
    newton: false,
    caustics: ["off","3", "4", "5"]

    //bgColor: [0, 0, 0]
  },
  sim: {
    // sim state should probably split
    P0: [0, 0],
    Qs: null,
    vs: null,
    particles: null,
    app:0,bpp:0,orbit:null,
    caustic_index_cw: -1,
    caustic_index_ccw: -1,
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
  gui_dr.setPosition(20, 310);
  // the 2nd argument is an index into the array.
  gui_dr.prototype.setValue('internalStepsPwr', 1);
  gui_dr.prototype.setValue('particles', 1);

  reset_sim(glob.ui, glob.sim);
  textAlign(CENTER, BOTTOM);
  textStyle(NORMAL);
  // only call draw when then gui is changed
  //loop();
  glob.ctr = [windowWidth / 2, windowHeight / 2];
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
  // translate(glob.ctr[0], glob.ctr[1]);
  // scale(glob.width / (glob.scale*glob.scaleFactor));
  // rotate(dict_rot[glob.ui.rot]); 
  draw_text("© 2021 Dan S. Reznik", [.92 * windowWidth, .97 * windowHeight], clr_yellow, 20);
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
  let p = vscale(vdiff(glob.mouse, glob.ctr), 2/(glob.scale*windowHeight));
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