let glob2 = {
    gui_sim:null,
    ctr:[0,0],
    ui: {
      //go: false,
  
      // major axis
      a: 1.618,
      aMin: 1,
      aMax: 4,
      aStep: 0.001,
      // dirs
  
      dirs: 1800,
      dirsMin: 1,
      dirsMax: 3600,
      dirsStep: 1,
      depart: ['border', 'center', 'focus', 'top vtx', 'bottom vtx', 'left vtx', 'right vtx', "mid minor", "mid major"],
      // tDeg
      tDeg: 45.,
      tDegMin: -360,
      tDegMax: 360,
      tDegStep: 0.1,
      // init radius
      initRadius: 0,
      initRadiusMin: 0,
      initRadiusMax: 1,
      initRadiusStep: .01
  }
  };

  function gui_changed2() {
    //reset_sim(glob.ui, glob.sim);
    redraw();
  }

  function prepare_sim_gui(width) {
    const gui = createGui('Simulation', gui_changed2);
    gui.addObject(glob2.ui);
    gui.setPosition(20, 180);
    gui.prototype.setWidth(width);
    //gui.prototype.setGlobalChangeHandler(gui_changed2);
  
    return gui;
  }

  function draw() {
    background(clr_black);
  }
  //

  // tentando isolar o bug
function setup() {
   createCanvas(windowWidth, windowHeight);
    
   glob2.gui_sim = prepare_sim_gui(120);
   
   glob2.ctr = [windowWidth / 2, windowHeight / 2];
   noLoop();
  }