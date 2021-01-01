function reset_particles(ui, sim) {
    const ell_border = false;
    const minAngle = 5.;
    const sinMinAngle = Math.sin(toRad(minAngle));
    const n0 = ell_norm(ui.a, 1, sim.P0);
    const rad_step = 2 * Math.PI / ui.dirs;
    let Qs, vs;
    if (ell_border) {
        const t0 = toRad(ui.tDeg);
        const ts = range(1, ui.dirs - 1).map(d => rad_step * d);
        Qs = ts.map(t => get_ellipse_point_rad(ui.a, 1, t0 + t));
        vs = Qs.map(q => vnorm(vdiff(q, sim.P0)));
    } else {
        const sinStep = Math.sin(rad_step);
        const cosStep = Math.cos(rad_step);
        const tang0 = vperp(n0);
        vs = range(1, ui.dirs - 1).map(r => [0, 0]);
        vs[0] = tang0;
        for (let i = 1; i <= ui.dirs - 1; i++)
            vs[i] = vrot(vs[i - 1], cosStep, sinStep);
        Qs = vs.map(v => vsum(sim.P0, v));
    }

    const non_whispering = vs.map(v => vdot(v, n0) > sinMinAngle);

    sim.vs = vs.filter((v, i) => non_whispering[i]);
    sim.Qs = Qs.filter((q, i) => non_whispering[i]);
    sim.particles = sim.Qs.map(q => sim.P0);
}

function reset_sim(ui, sim) {
    const t0 = toRad(ui.tDeg);
    sim.P0 = get_ellipse_point_rad(ui.a, 1, t0);
    reset_particles(ui, sim);
    sim.com = [sim.P0];
}

function get_refl_vel(a, from, vel, speed) {
    const inter = ellInterRayb(a, 1, from, vel);
    const dist = edist(from, inter);

    const grad = ell_grad(a, 1, inter);
    const refl_vel = vnorm(vrefl(vscale(vel, -1), grad));
    const new_point = vray(inter, refl_vel, speed - dist);
    return { p: new_point, v: refl_vel };
}

function update_sim(ui, sim) {
    let new_particles = sim.particles.map((z, i) => vsum(z, vscale(sim.vs[i], ui.speed)));
    const crossed = new_particles.map(z => !in_ell(ui.a, 1, z));
    const new_point_vels = sim.vs.map((v, i) => crossed[i] ? get_refl_vel(ui.a, new_particles[i], v, ui.speed) : { p: new_particles[i], v: v });
    sim.particles = new_point_vels.map(pv => pv.p);
    sim.vs = new_point_vels.map(pv => pv.v);
    sim.com.push(vertex_avg(sim.particles));
}

function draw_sim(ui, sim) {
    draw_ellipse(ui.a, 1, clr_white, .01);
    if (ui.drawDirs) {
        draw_spokes(sim.P0, sim.Qs, clr_gray, .005);
        sim.Qs.map(q => draw_point(q, clr_gray, .005));
    }
    sim.particles.map(z => draw_point(z, clr_tourquoise, .005));
    draw_point(sim.P0, clr_red, .02);
    if (sim.com.length>1) {
       draw_polyline(sim.com,clr_green,.005);
       draw_point(sim.com[sim.com.length-1], clr_green, .005);
    }
}