function calc_sim() {
    const a = glob.ui.a;
    const t0 = toRad(glob.ui.tDeg);
    glob.ui.P0 = get_ellipse_point_rad(a,1,t0);
    const rad_step = 2*Math.PI/glob.ui.dirs;
    const ts = range(1,glob.ui.dirs-1).map(d=>rad_step*d);
    glob.ui.Qs = ts.map(t=>get_ellipse_point_rad(a,1,t0+t));
  }