let glob = {
  url: 'https://dan-reznik.github.io/ellipse-echo-p5js/',
  clrs: null,
  bgColor: [0, 0, 0],
  scale: .7,
  ctr0: [0, 0], ctr: [0, 0],
  mouse: [0, 0],
  dragged: false,
  gui_width: 120,
  gui_fc: null, gui_sim: null, gui_dr: null, gui_caustics: null,
  json_url: null, // compress json into url
  ui0: null,
  ui: {
    //go: false,

    // major axis
    a: 1.618,
    aMin: 1,
    aMax: 4,
    aStep: 0.001,
    // tDeg
    tDeg: 45.,
    tDegMin: -360,
    tDegMax: 360,
    tDegStep: 0.1,
    depart: ['border', 'center', 'focus', 'top vtx', 'bottom vtx', 'left vtx', 'right vtx', "mid minor", "mid major"],
    // dirs

    dirs: 1800,
    dirsMin: 1,
    dirsMax: 3600,
    dirsStep: 1,
        
    // init radius
    initRadius: 0,
    initRadiusMin: 0,
    initRadiusMax: 1,
    initRadiusStep: .01
    // spoke rotation
    // spokeRot:0,
    // spokeRotMin:-60,
    // spokeRotMax:60,
    // spokeRotStep:.1
    //bgColor: [0, 0, 0]
    //style: ["black","white","tiny","tiny_white","tiny_black"]
  },
  ui_dr: {
    // vel
    speedPwr: [-3, -4, -5, -6],
    // internal steps
    internalStepsPwr: [0, 1, 2, 3, 4],
    //go: false,
    // major axis
    particles: ['off', 'centers', 'chain', 'both'],
    comTrail: false,
    spokes: false,
    newton: true,
    clrSeed: 1,
    clrSeedMin: 0,
    clrSeedMax: 256,
    // highlight band
    hiliteBand: 0,
    hiliteBandMin: 0,
    hiliteBandMax: 1,
    hiliteBandStep: .01,
    // evolute
    evolute: false,
    apollonius: false,
    shoot: false,
    shootAngle: 0,
    shootAngleMin: -60,
    shootAngleMax: 60,
    shootAngleStep: .1,
    bounces: 3,
    bouncesMax: 100,
    bouncesMin: 0
  },
  ui_caustics: { // needs space to retain order
    "      3": false,
    "      4": false,
    "    4si": false,
    "      5": false,
    "    5si": false,
    "      6": false,
    "  6si-I": false,
    " 6si-II": false,
    "      7": false,
    "  7si-I": false,
    " 7si-II": false,
    "      8": false,
    //"  8si-I": false,
    //" 8si-II": false,
    "8si-III": false
  },
  sim: {
    // sim state should probably split
    P0: [0, 0],
    Qs: null,
    vs: null,
    particles: null,
    caustic_list: null,
    evolute: null,
    evolute_inters: [],
    apollonius_list: [],
    com: [],
    steps: 0
  }
};

function windowResized() {
  //[glob.width, glob.height] = get_window_width_height();

  resizeCanvas(windowWidth, windowHeight);
  glob.gui_dr.setPosition(windowWidth - glob.gui_width - 20, 20);
  glob.gui_caustics.setPosition(windowWidth - (glob.gui_width + 20)*2, 20);
  glob.ctr = [windowWidth / 2, windowHeight / 2];
  redraw();
}

function gui_changed() {
  if (isLooping())
     noLoop();
  reset_sim(glob.ui, glob.sim);
  redraw();
}

function gui_dr_changed() {
  glob.clrs = shuffle_seeded(clrs_crayola.map(c => c.rgb), glob.ui_dr.clrSeed);
  redraw();
}

function gui_caustic_changed() {
  //reset_sim(glob.ui, glob.sim);
  redraw();
}

function prepare_sim_gui(width) {
  const gui = createGui('Simulation', gui_changed);
  gui.addObject(glob.ui);
  gui.setPosition(20, 180);
  gui.prototype.setWidth(width);
  // gui.prototype.setGlobalChangeHandler(gui_changed);

  return gui;
}

function prepare_dr_gui(width) {
  const gui = createGui('Draw', gui_dr_changed);
  gui.addObject(glob.ui_dr);
  gui.prototype.setWidth(width);
  gui.setPosition(windowWidth - width - 20, 20);
  // the 2nd argument is an index into the array.
  gui.prototype.setValue('speedPwr', 1);
  gui.prototype.setValue('internalStepsPwr', 2);
  gui.prototype.setValue('particles', 2);
  gui.prototype.setValue('clrSeed', 114);
  // gui.prototype.setValue('caustics', 2);
  //gui.prototype.setGlobalChangeHandler(gui_dr_changed);
  return gui;
}

function prepare_caustic_gui(width) {
  const gui = createGui('Caustics', gui_dr_changed);
  gui.addObject(glob.ui_caustics);
  gui.prototype.setWidth(width);
  gui.setPosition(windowWidth-2*(1.5*width+20), 20);
  //gui.prototype.setGlobalChangeHandler(gui_dr_changed);
  return gui;
}

function config_btn_pressed() {
  const ui_obj = get_UI_state();
  // async promise
  glob.json_url.compress(ui_obj).then(output=>updateClipboard(glob.url+"?config="+output));
}

function reset_ui_btn_pressed() {
  document.getElementById("Start").value = "Start";
  restoreSettings(glob.ui0);
  noLoop();
}

function start_btn_pressed(btn) {
  if (btn.value=="Stop") {
    btn.value="Start";
    noLoop();
  } else {
    btn.value="Stop";
    loop();
  }
}

function reset_btn_pressed(btn) {
  if (isLooping())
    document.getElementById("Start").value = "Start";
  reset_sim(glob.ui, glob.sim);
  redraw();
  noLoop();
}

function prepare_fc_gui(width) {
  const gui_fc = QuickSettings.create(20, 20, "Start/Stop");
  gui_fc.setWidth(width);
  gui_fc.addButton("Start", start_btn_pressed);
  gui_fc.addButton("Reset", reset_btn_pressed);
  gui_fc.addButton("Copy Config", config_btn_pressed);
  gui_fc.addButton("Reset UI", reset_ui_btn_pressed);                        // creates a button
}

// && when come back: need to think of a solution without noLoop()
// debug -- go back to setup
function setup() {
  //[glob.width, glob.height] = get_window_width_height();
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, BOTTOM);
  textStyle(NORMAL);
  strokeCap(SQUARE);
  strokeJoin(ROUND);

  QuickSettings.useExtStyleSheet();
  glob.gui_fc = prepare_fc_gui(glob.gui_width);
  glob.gui_sim = prepare_sim_gui(glob.gui_width);
  glob.gui_dr = prepare_dr_gui(glob.gui_width);
  glob.gui_caustics = prepare_caustic_gui(glob.gui_width/2);

  glob.clrs = shuffle_seeded(clrs_crayola.map(c => c.rgb), glob.ui_dr.clrSeed);

  glob.ctr = [windowWidth / 2, windowHeight / 2];
  glob.json_url = JsonUrl('lzma'); // JsonUrl is added to the window object
  reset_sim(glob.ui, glob.sim);
  saveUI0(); // saves it as json for resetUIBtn
  // occurs after reset_sim to avoid race condition
  const params = getURLParams();
  if (params.config != null)
    restoreSettings(params.config);
  noLoop();
}

function keyPressed() {
  if (!isLooping() && mouse_in_ell()) {
    if (keyCode == LEFT_ARROW || keyCode == DOWN_ARROW)
      update_sim(glob.ui, glob.sim, glob.ui_dr, true);
    else if (keyCode == RIGHT_ARROW || keyCode == UP_ARROW)
      update_sim(glob.ui, glob.sim, glob.ui_dr, false);
    redraw();
  }
}

function draw_titles() {
  push();
  textAlign(CENTER, BASELINE);
  draw_text("~~Elliptic Echos~~", [.5 * windowWidth, 30], clr_magenta, 24);
  //draw_text("© 2021 Dan S. Reznik -- bit.ly/3qCgVJG", [.5 * windowWidth,55], clr_yellow, 16);
  draw_text("© 2021 Dan S. Reznik", [.5 * windowWidth,55], clr_yellow, 16);
  textAlign(RIGHT, BASELINE);
  draw_text("github.com/dan-reznik/ellipse-echo-p5js", [windowWidth-20, windowHeight-20], clr_yellow, 16);
  pop();
}

function draw_titles_old() {
  push();
  textAlign(LEFT, BASELINE);
  draw_text("~~~Elliptic Echos~~~", [30, 30], clr_magenta, 24);
  draw_text("© 2021 Dan S. Reznik", [30, 55], clr_yellow, 16);
  draw_text("https://bit.ly/3qCgVJG", [30, 75], clr_yellow, 16);
  pop();
}


function draw() {
  background(glob.bgColor);
  draw_titles();
  push();
  translate(glob.ctr[0], glob.ctr[1]);
  scale(glob.scale * windowHeight / 2);
  draw_sim(glob.ui, glob.sim, glob.ui_dr);
  pop();
  if (isLooping())
    update_sim(glob.ui, glob.sim, glob.ui_dr, false);
}

function mouseWheel(event) {
  if (event.delta < 0)
    glob.scale *= 1.05;
  else
    glob.scale *= 0.95;
  redraw();
  return false;
}

function mouse_in_ell() {
  let p = vscale(vdiff([mouseX, mouseY], glob.ctr), 2 / (glob.scale * windowHeight));
  return in_ell(glob.ui.a, 1, p);
}

function mousePressed() {
  glob.mouse = [mouseX, mouseY];
  //check_btns();
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
  redraw();
}