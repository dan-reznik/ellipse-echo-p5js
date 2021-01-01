function reset_sim(ui,sim) {
    const t0 = toRad(ui.tDeg);
    sim.P0 = get_ellipse_point_rad(ui.a,1,t0);
    const rad_step = 2*Math.PI/ui.dirs;
    const ts = range(1,ui.dirs-1).map(d=>rad_step*d);
    sim.Qs = ts.map(t=>get_ellipse_point_rad(ui.a,1,t0+t));
    sim.vs = sim.Qs.map(q=>vnorm(vdiff(q,sim.P0)));
    sim.particles = sim.Qs.map(q=>sim.P0);
}

function get_refl_vel(a,from,vel,speed) {
    const inter = ellInterRayb(a, 1, from, vel);
    const dist = edist(from,inter);

    const grad = ell_grad(a,1,inter);
    const refl_vel = vnorm(vrefl(vscale(vel,-1),grad));
    const new_point = vray(inter,refl_vel,speed-dist);
    return {p:new_point,v:refl_vel};
}

function update_sim(ui, sim) {
   let new_particles = sim.particles.map((z,i)=>vsum(z,vscale(sim.vs[i],ui.speed)));
   const crossed = new_particles.map(z=>!in_ell(ui.a,1,z));
   const new_point_vels = sim.vs.map((v,i)=>crossed[i]? get_refl_vel(ui.a,new_particles[i],v,ui.speed) : {p:new_particles[i],v:v});
   sim.particles = new_point_vels.map(pv=>pv.p);
   sim.vs = new_point_vels.map(pv=>pv.v);
}

function draw_sim(ui,sim) {
    draw_ellipse(ui.a, 1, clr_white, .01);
    if (ui.drawDirs) {
      draw_spokes(sim.P0, sim.Qs, clr_gray, .005);
      sim.Qs.map(q=>draw_point(q, clr_gray, .005));
    }
    sim.particles.map(z=>draw_point(z,clr_purple,.005));
    draw_point(sim.P0, clr_red, .02);
}