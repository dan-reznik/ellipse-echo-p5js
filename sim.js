function reset_particles(ui, sim) {
    const ell_border = false; // not used: use ellipse border to spread out directions instead of circular arc
    const interior_point = ['center', 'focus', 'mid major', 'mid minor'].includes(ui.depart);
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
        //const sinStep = Math.sin(rad_step);
        //const cosStep = Math.cos(rad_step);
        vs = range(1, ui.dirs).map(r => [0, 0]);
        const tang0 = interior_point ? [1, 0] : vperp(n0);
        vs[0] = tang0;
        const spoke_rot_rad = 0; // toRad(ui.spokeRot);
        for (let i = 1; i <= ui.dirs; i++)
            // renormalize so doesn't lose precision at every rotation
            // the approach below is fast but introduces a lot of noise!
            //could use 8th or quarter symmetry
            //vs[i] = vnorm(vrot(vs[i - 1], cosStep, sinStep));
            vs[i] = vrot(tang0, Math.cos(rad_step * i + spoke_rot_rad), Math.sin(rad_step * i + spoke_rot_rad));
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
    if (negl(ui.initRadius))
        sim.particles = sim.Qs.map((q, i) => sim.P0);
    else {
        const newPs = sim.Qs.map((q, i) => vsum(sim.P0, vscale(vs[i], ui.initRadius)));
        const interior = newPs.map(p => in_ell(ui.a, 1, p));
        sim.particles = newPs.filter((p, i) => interior[i]);
        sim.vs = vs.filter((v, i) => interior[i]);
        sim.Qs = Qs.filter((q, i) => interior[i]);
    }
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
        case "mid minor": sim.P0 = [0, -.5]; break;
        case "mid major": sim.P0 = [-.5 * ui.a, 0]; break;
        default: sim.P0 = [0, 0]; // center
    }
}

function max_index(vals) {
    let max = vals[0];
    let imax = 0;
    for (let i = 1; i < vals.length; i++)
        if (vals[i] > max) {
            max = vals[i];
            imax = i;
        }
    return imax;
}

const dict_caustic_data = {
    3: { fn: caustic_N3, clr: 0, hyp: false, n: 3 },
    4: { fn: caustic_N4, clr: 1, hyp: false, n: 4 },
    5: { fn: caustic_N5, clr: 2, hyp: false, n: 5 },
    6: { fn: caustic_N6, clr: 3, hyp: false, n: 6 },
    '4si': { fn: caustic_N4_si, clr: 4, hyp: true, n: 4, hypInterFn: hypInter_N4_si }
};

function get_caustic_data(ui, sim, key) {
    let obj = null;
    const entry = dict_caustic_data[key];
    const [app, bpp] = entry.fn(ui.a, 1);
    const hypInter = entry.hyp ? entry.hypInterFn(ui.a, 1, app, bpp) : [0, 0];
    const hyp_points = entry.hyp ? range(-60, 60).map(d => hyperbola_points(app, bpp, toRad(d))) : [[0, 0], [0, 0]];
    // if hyperbola, P0 must lie between intersections
    const validP0 = entry.hyp ? Math.abs(sim.P0[0]) < hypInter[0] : true;
    const tangFn = entry.hyp ? hypTangentsb : ellTangentsb;
    const tangs = validP0 ? tangFn(app, bpp, sim.P0) : [[0, 0], [0, 0]];
    // was bounce caustic but bad for hyperbolas
    const vs = validP0 ? tangs.map(p => vnorm(vdiff(p, sim.P0))) : [[0, 0], [0, 0]];
    const orbit = validP0 ? bounce_billiard(ui.a, 1, sim.P0, vs[0], entry.n) : [sim.P0];

    obj = {
        hyp: entry.hyp,
        validP0: validP0,
        key: key,
        app: app, bpp: bpp,
        orbit: orbit, vs: vs, ps: [sim.P0, sim.P0],
        clr_index: entry.clr,
        tangFn: tangFn,
        hypBranch1: hyp_points.map(p => p[0]),
        hypBranch2: hyp_points.map(p => p[1])
    };
    return obj;
}

function reset_caustics(ui, sim) {
    sim.caustic_list = Object.keys(dict_caustic_data).map(k => get_caustic_data(ui, sim, k));
}

function reset_evolute(ui, sim) {
    sim.evolute = range(0, 359).map(d => ell_evolute(ui.a, 1, d));
    const [ix, iy] = evolute_inter(ui.a, 1);
    sim.evolute_inters = [[ix, iy], [-ix, iy], [-ix, -iy], [ix, -iy]];
}

function reset_apollonius(ui, sim) {
    const ks = apolloniusKs(ui.a, 1, sim.P0);
    const roots = cubic_roots(ks)
    const qs = roots.filter(r => !r.complex).map(r => [r.re, sim.P0[1] < 0 ? ellY(ui.a, 1, r.re) : -ellY(ui.a, 1, r.re)]);
    sim.apollonius_list = qs.map(q => ({ boundary: q, vel: vnorm(vdiff(q, sim.P0)), curr: sim.P0 }));
    // to do: needs state for apollonius
}

function reset_sim(ui, sim) {
    reset_P0(ui, sim);
    reset_particles(ui, sim);
    reset_caustics(ui, sim);
    reset_evolute(ui, sim);
    reset_apollonius(ui, sim);
    sim.com = [sim.P0];
    sim.steps = 0;
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
    sim.steps++;
}

function update_caustic_once(ui, caustic, speed, newton) {
    if (caustic.validP0) {
        const new_particles = caustic.ps.map((z, i) => vsum(z, vscale(caustic.vs[i], speed)));
        const crossed = new_particles.map(z => outside_ell(ui.a, 1.0, z));
        const new_point_vels = caustic.vs.map((v, i) => crossed[i] ? get_refl_vel(ui.a, new_particles[i], v, speed, newton) : { p: new_particles[i], v: v });
        caustic.ps = new_point_vels.map(pv => pv.p);
        caustic.vs = new_point_vels.map(pv => pv.v);
    }
}

function update_apollonius_once_old(ui, sim, speed) {
    // jog position fwd
    sim.apollonius_list.map(app => app.curr = vsum(app.curr, vscale(app.vel, speed)));
    // for those who crossed, change velocity and reflect
    sim.apollonius_list.filter(app => outside_ell(ui.a, 1.0, app.curr))
        .map(app => {
            // avoid newton:crossing is closest between apollonius point & P0
            const dist = Math.min(edist(app.boundary, app.curr), edist(sim.P0, app.curr));
            app.vel = vscale(app.vel, -1); // reflect
            app.curr = vsum(app.curr, vscale(app.vel, Math.abs(speed) + dist));
        });
}

function update_apollonius_once(ui, sim, speed, newton) {
    let new_particles = sim.apollonius_list.map(app => vsum(app.curr, vscale(app.vel, speed)));
    const crossed = new_particles.map(z => outside_ell(ui.a, 1.0, z));
    const new_point_vels = sim.apollonius_list.map((app, i) => crossed[i] ? get_refl_vel(ui.a, new_particles[i], app.vel, speed, newton) : { p: new_particles[i], v: app.vel });
    sim.apollonius_list.map((app,i)=>{app.curr = new_point_vels[i].p; app.vel = new_point_vels[i].v;});
}


function get_shoot(ui,sim,ui_dr) {
    const t = toRad(ui_dr.shootAngle);
    const ct = Math.cos(t), st = Math.sin(t);
    const nhat = ell_norm(ui.a,1,sim.P0);
    const nhat_rot = vrot(nhat,ct,st);
    const ps = bounce_billiard(ui.a, 1, sim.P0, nhat_rot, ui_dr.bounces);
    return { nhat:nhat_rot, ps:ps };

}

function update_sim(ui, sim, ui_dr, bwd = false) {
    const imax = Math.pow(10, ui_dr.internalStepsPwr);
    const speed = Math.pow(10, ui_dr.speedPwr);
    const speed_fb = bwd ? -speed : speed;
    for (let i = 0; i < imax; i++) {
        update_sim_once(ui, sim, speed_fb, ui_dr.newton)
        sim.caustic_list.map(c => c != null ? update_caustic_once(ui, c, speed_fb, ui_dr.newton) : null);
        if (sim.apollonius_list.length > 0)
           update_apollonius_once(ui, sim, speed_fb, newton)
    }
}

function draw_caustic_shapes(caustic) {
    const clr = glob.clrs[caustic.clr_index];
    if (caustic.hyp) {
        draw_polyline(caustic.hypBranch1, clr_brown, .01);
        draw_polyline(caustic.hypBranch2, clr_brown, .01);
    } else
        draw_ellipse_low(caustic.app, caustic.bpp, clr_brown, .01);
    if (caustic.validP0)
        draw_polygon(caustic.orbit, clr, .01);
}

function draw_caustic_ps(caustic) {
    caustic.ps.map(p => draw_point(p, glob.clrs[caustic.clr_index], .005));
}

function draw_boundary_arrow(a,p,nhat,clr) {
    draw_arrow(p, vsum(p,vscale(nhat,.2)), clr, .01);
}

function draw_ell_normal(a,p) {
    draw_arrow(p, vsum(p,vscale(ell_norm(a,1,p),.2)), clr_white, .01);
}

function draw_sim(ui, sim, ui_dr) {
    draw_ellipse(ui.a, 1, clr_white, .01);
    if (ui_dr.evolute) {
        draw_polyline(sim.evolute, clr_dark_gold, .01);
        sim.evolute_inters.map(p => draw_point(p, clr_dark_gold, .005));
    }
    if (ui_dr.apollonius && sim.apollonius_list.length > 0) {
        sim.apollonius_list.map(app => {
            draw_point(app.boundary, clr_white, .005);
            draw_line_dashed(sim.P0, app.boundary, clr_white, .01);
            draw_ell_normal(ui.a,app.boundary);
        });
    }
    if (ui.depart == "border")
        Object.values(glob.ui_caustics).map((v, i) => { if (v) draw_caustic_shapes(sim.caustic_list[i]) });
    if (ui_dr.spokes) {
        draw_spokes(sim.P0, sim.Qs, clr_gray, .005);
        sim.Qs.map(q => draw_point(q, clr_gray, .0025));
    }
    if (['centers', 'both'].includes(ui_dr.particles))
        sim.particles.map(z => draw_point(z, clr_tourquoise, .0025));
    if (sim.com.length > 0 && ui_dr.comTrail) {
        draw_polyline(sim.com, clr_green, .005);
        draw_point(sim.com[sim.com.length - 1], clr_green, .005);
    }
    if (['chain', 'both'].includes(ui_dr.particles)) {
        // only draw sufficiently far away points
        const dmin = Math.pow(10., glob.ui_dr.speedPwr);
        const chain_filt = sim.particles.filter((p, i) => i == 0 ? true : magn(p, sim.particles[i - 1]) > dmin);
        draw_polyline(chain_filt, clr_cyan, .01);
    }
    if (ui.depart == "border")
        Object.values(glob.ui_caustics).map((v, i) => { if (v) draw_caustic_ps(sim.caustic_list[i]) });
    if (ui_dr.hiliteBand > 0)
        draw_polyline(sim.particles.slice(0, (sim.particles.length * ui_dr.hiliteBand) - 1), clr_cyan, .01);
        if (ui_dr.apollonius && sim.apollonius_list.length > 0) {
            sim.apollonius_list.map(app => draw_point(app.curr, clr_white, .005));
        }
    
    if (ui_dr.shoot) {
        const shoot = get_shoot(ui,sim,ui_dr);
        draw_polyline(shoot.ps, clr_red, .01);
        draw_boundary_arrow(ui.a,sim.P0,shoot.nhat,clr_red);
    }

    draw_ell_normal(ui.a,sim.P0);
    draw_point(sim.P0, clr_red, .01);
}