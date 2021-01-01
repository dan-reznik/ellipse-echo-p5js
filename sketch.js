let glob = {
    goBtn:null,
    resetBtn:null,
    go:false,
    bgColor:[0,0,0],
    ui: {
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
        // vel
        speed : .02,
        speedMin: .005,
        speedMax: .1,
        speedStep: .001,
      
        // dirs
        drawDirs:false,
        dirs: 45,
        dirsMin: 1,
        dirsMax: 720,
        dirsStep: 1,
      
        //bgColor: [0, 0, 0]
      },
      sim: {
        // sim state should probably split
        P0:[0,0],
        Qs:null,
        particles:null
      }
};

function windowResized() {
   //[glob.width, glob.height] = get_window_width_height();
   resizeCanvas(windowWidth,windowHeight);
}

function gui_changed() {
  reset_sim(glob.ui, glob.sim);
  redraw();
}

function setup() {
  //[glob.width, glob.height] = get_window_width_height();
  createCanvas(windowWidth,windowHeight);
  glob.goBtn = create_btn(20,20,"Go",clr_blue,goBtnPressed);
  glob.resetBtn = create_btn(80,20,"Reset",clr_purple,resetBtnPressed);

  let gui = createGui('p5.gui');
  //gui.onchange = gui_changed;
  gui.addObject(glob.ui);
  gui.setPosition(20, 60);
  //gui.loop = qs.setGlobalChangeHandler(gui_changed);
  reset_sim(glob.ui, glob.sim);
  // only call draw when then gui is changed
  //noLoop();
}

function draw() {
  background(glob.bgColor);
  glob.goBtn.draw();
  glob.resetBtn.draw();
  if (glob.goBtn.state) 
     update_sim(glob.ui,glob.sim);
  push();
   translate(windowWidth/2, windowHeight/2);
   scale(0.7*windowHeight/2);
   draw_sim(glob.ui,glob.sim);
  pop();
  return(glob.goBtn.state);
}

