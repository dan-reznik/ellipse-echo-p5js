function hyperbola_points(a,b,t) {
    const x = a*Math.cosh(t);
    const y = b*Math.sinh(t);
    return [[x, y], [-x, -y]];
}

function ell_error(a, b, [x, y]) {
    return (x * x) / (a * a) + (y * y) / (b * b) - 1.0;
}

function in_ell(a, b, p) {
    return ell_error(a, b, p) < 0;
}

function outside_ell(a, b, p) {
    return ell_error(a, b, p) > 0;
}

function ell_grad(a, b, [x, y]) {
    return [-2.0 * x / (a * a), -2.0 * y / (b * b)];
}

function ell_norm(a, b, p) {
    return vnorm(ell_grad(a, b, p));
}

function get_ellipse_point_rad(a, b, t) {
    return [a * Math.cos(t), b * Math.sin(t)];
}

function get_ellipse_point(a, b, tDeg) {
    return get_ellipse_point_rad(a, b, toRad(tDeg));
}

function ellInterRayb(a, b, [x, y], [nx, ny]) {
    let a2 = a * a, b2 = b * b;
    let c2 = b2 * nx * nx + a2 * ny * ny;
    let c1 = 2 * (b2 * nx * x + a2 * ny * y);
    let c0 = b2 * x * x + a2 * y * y - a2 * b2;
    let ss = quadRoots(c2, c1, c0);
    return vray([x, y], [nx, ny], ss[1]);
}

function ellTangentsb(a, b, [px, py]) {
    const a2 = a * a, b2 = b * b;
    const px2 = px * px, py2 = py * py;
    //const px3 = px * px2;
    const py3 = py * py2;
    const denomx = b2 * px2 + a2 * py2;
    const denomy = b2 * px2 * py + a2 * py3;
    const radicand = b2 * px2 + a2 * (py2 - b2);
    const numFact = Math.sqrt(radicand) * py;
    // 1st tang is CW, 2nd is CCW
    return [
        [a2 * (b2 * px + numFact) / denomx, b2 * (a2 * py2 - px * numFact) / denomy],
        [a2 * (b2 * px - numFact) / denomx, b2 * (a2 * py2 + px * numFact) / denomy]
    ];
}

function hypTangentsb(a, b, [px, py]) {
    const a2 = a * a, b2 = b * b;
    const px2 = px * px; py2 = py * py;
    //const px3 = px*px2;
    const py3 = py * py2;
    const denomx = b2 * px2 - a2 * py2;
    const denomy = b2 * px2 * py - a2 * py3;
    const radicand = -b2 * px2 + a2 * (py2 + b2);
    const numFact = Math.sqrt(radicand) * py; // Math.abs(py);
    return [
        [a2 * (b2 * px - numFact) / denomx, b2 * (a2 * py2 - px * numFact) / denomy],
        [a2 * (b2 * px + numFact) / denomx, b2 * (a2 * py2 + px * numFact) / denomy]];
}

function ell_err_prime(a, b, [px, py], [nx, ny], t) {
    // d/dt of the ellipse error fn
    // for a ray from p toward n by t.
    return 2 * (nx * px / (a * a) + ny * py / (b * b));
}

function ellInterNewtonIteration(a, b, p0, n, t0) {
    let f, f_prime, p;
    let t = t0;
    let its = 10;
    while (its-- > 0) {
        p = vray(p0, n, t);
        f = ell_error(a, b, p);
        f_prime = ell_err_prime(a, b, p, n);
        tstep = f / f_prime;
        if (negl(tstep)) break;
        t -= tstep;
    }
    return p;
}
