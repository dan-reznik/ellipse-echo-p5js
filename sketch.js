let glob = {
    goBtn:null,
    go:false,
    bgColor:[0,0,0],
    P0:[0,0],
    Qs:null,
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
      
        // dirs
        drawDirs:false,
        dirs: 45,
        dirsMin: 1,
        dirsMax: 720,
        dirsStep: 1,
      
        //bgColor: [0, 0, 0]
      }
};

function windowResized() {
   //[glob.width, glob.height] = get_window_width_height();
   resizeCanvas(windowWidth,windowHeight);
}

function goBtnPressed() {
    if (glob.go) {
        reset_go_btn(glob.goBtn,"Go",clr_blue);
        glob.go = false;
    } else {
        reset_go_btn(glob.goBtn,"Stop",clr_red);
        glob.go = true;
    }
    console.log("Go Btn pressed!", glob.go);
}

function setup() {
  //[glob.width, glob.height] = get_window_width_height();
  createCanvas(windowWidth,windowHeight);
  glob.goBtn = create_go_btn(20,20,goBtnPressed);

  let gui = createGui('p5.gui');
  gui.addObject(glob.ui);
  gui.setPosition(20, 60);

  // only call draw when then gui is changed
  //noLoop();
}

function draw() {
  calc_sim();
  background(glob.bgColor);
  glob.goBtn.draw();
  push();
   translate(windowWidth/2, windowHeight/2);
   scale(0.7*windowHeight/2);
   draw_scene(glob.ui);
  pop();
}

