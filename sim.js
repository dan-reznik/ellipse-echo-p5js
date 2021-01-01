function reset_particles(ui, sim) {
    const ell_border = false; // not used: use ellipse border to spread out directions instead of circular arc
    const interior_point = ['center', 'focus'].includes(ui.depart);
    const minAngle = 5.;
    const sinMinAngle = Math.sin(toRad(minAngle));
    const n0 = ell_norm(ui.a, 1, sim.P0);
    let rad_step = (interior_point ? 2.0 : 1.0) * Math.PI / ui.dirs;
    let Qs, vs;

    if (ell_border) {
        const t0 = toRad(ui.tDeg);
        const ts = range(1, ui.dirs - 1).map(d => rad_step * d);
        Qs = ts.map(t => get_ellipse_point_rad(ui.a, 1, t0 + t));
        vs = Qs.map(q => vnorm(vdiff(q, sim.P0)));
    } else {
        const sinStep = Math.sin(rad_step);
        const cosStep = Math.cos(rad_step);
        vs = range(1, ui.dirs).map(r => [0, 0]);
        const tang0 = interior_point ? [1, 0] : vperp(n0);
        vs[0] = tang0;
        for (let i = 1; i <= ui.dirs; i++)
            // renormalize so doesn't lose precision at every rotation
            // the approach below is fast but introduces a lot of noise!
            //could use 8th or quarter symmetry
            //vs[i] = vnorm(vrot(vs[i - 1], cosStep, sinStep));
            vs[i] = vrot(tang0,Math.cos(rad_step*i),Math.sin(rad_step*i));
        Qs = vs.map(v => vsum(sim.P0, v));
    }
    if (interior_point) {
        sim.vs = vs;
        sim.Qs = Qs;
    } else {
        const non_whispering = vs.map(v => vdot(v, n0) > sinMinAngle);
        sim.vs = vs.filter((v, i) => non_whispering[i]);
        sim.Qs = Qs.filter((q, i) => non_whispering[i]);
    }
    sim.particles = sim.Qs.map(q => sim.P0);
}

function reset_P0(ui, sim) {
    const t0 = toRad(ui.tDeg);
    switch (ui.depart) {
        case "border": sim.P0 = get_ellipse_point_rad(ui.a, 1, t0); break;
        case "focus": sim.P0 = [-Math.sqrt(ui.a * ui.a - 1), 0]; break;
        case "right vtx": sim.P0 = [ui.a, 0]; break;
        case "bottom vtx": sim.P0 = [0, 1]; break;
        case "top vtx": sim.P0 = [0, -1]; break;
        case "left vtx": sim.P0 = [-ui.a, 0]; break;
        default: sim.P0 = [0, 0]; // center
    }
}

function reset_sim(ui, sim) {
    reset_P0(ui, sim);
    reset_particles(ui, sim);
    sim.com = [sim.P0];
}

function get_refl_vel(a, from, vel, speed, newton) {
    const on_ell = negl(ell_error(a, 1, from) ** 2);
    const inter = on_ell ? from : (newton ? ellInterNewtonIteration(a, 1, from, vel, 0) :
        ellInterRayb(a, 1, from, vel));
    const dist = on_ell ? 0 : edist(from, inter);

    const grad = ell_grad(a, 1, inter);
    const refl_vel = vnorm(vrefl(vscale(vel, -1.0), grad));
    const new_point = vray(inter, refl_vel, speed - dist);
    return { p: new_point, v: refl_vel };
}

function update_sim_once(ui, sim, speed, newton) {
    let new_particles = sim.particles.map((z, i) => vsum(z, vscale(sim.vs[i], speed)));
    const crossed = new_particles.map(z => outside_ell(ui.a, 1.0, z));
    const new_point_vels = sim.vs.map((v, i) => crossed[i] ? get_refl_vel(ui.a, new_particles[i], v, speed, newton) : { p: new_particles[i], v: v });
    sim.particles = new_point_vels.map(pv => pv.p);
    sim.vs = new_point_vels.map(pv => pv.v);
    sim.com.push(vertex_avg(sim.particles));
}

function update_sim(ui, sim, ui_dr) {
    const imax = Math.pow(10,ui_dr.internalStepsPwr);
    const speed = Math.pow(10,ui_dr.speedPwr);
    for (let i = 0; i < imax; i++)
       update_sim_once(ui, sim, speed, ui_dr.newton)
}

function draw_sim(ui, sim, ui_dr) {
    draw_text("© 2021 Dan S. Reznik", [2.3, 1.3], clr_yellow);
    draw_ellipse(ui.a, 1, clr_white, .01);
    if (ui_dr.spokes) {
        draw_spokes(sim.P0, sim.Qs, clr_gray, .005);
        sim.Qs.map(q => draw_point(q, clr_gray, .005));
    }
    if (['centers','both'].includes(ui_dr.particles))
    sim.particles.map(z => draw_point(z, clr_tourquoise, .0025));
    draw_point(sim.P0, clr_red, .01);
    if (sim.com.length > 1) {
        if (ui_dr.com) draw_polyline(sim.com, clr_green, .005);
        draw_point(sim.com[sim.com.length - 1], clr_green, .005);
    }
    if (['chain','both'].includes(ui_dr.particles))
    draw_polyline(sim.particles, clr_blue, .005);
}