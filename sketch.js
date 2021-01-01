let glob = {
    gui:null,
    goBtn:null,
    go:false
};

function windowResized() {
   //[glob.width, glob.height] = get_window_width_height();
   resizeCanvas(windowWidth,windowHeight);
}

function goBtnPressed() {
    glob.go = !glob.go;
    console.log("Go Btn pressed!", glob.go);
}

function setup() {
  //[glob.width, glob.height] = get_window_width_height();
  createCanvas(windowWidth,windowHeight);
  glob.goBtn = create_go_btn(20,20,goBtnPressed);

  glob.gui = createGui('p5.gui');
  glob.gui.addObject(params);
  glob.gui.setPosition(20, 60);


  // only call draw when then gui is changed
  //noLoop();
}

function draw() {
  background(params.bgColor);
  glob.goBtn.draw();
  draw_scene();
}

