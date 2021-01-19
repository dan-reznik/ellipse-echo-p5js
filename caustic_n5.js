function caustic_xs(x, degree) {
    return range(0, degree).map(n => Math.pow(x, n));
}

function caustic_fx(ks, xs) {
    const fx = ks.map((k, i) => k * xs[i]);
    return sum(fx);
}

// call with rest of xs, ks (simulate derivative)
function caustic_dfx(ks, xs) {
    // k1 + 2 k2 x + 3 k3 x^2 + 4 k4 x^3 + 5 k5 x^4 + 6 k6 x^5
    const ks_rest = ks.slice(1); //  ks.slice(1,7); // drops k0
    const xs_rest = xs.slice(0, xs.length - 1); // drops x^6
    const fx = ks_rest.map((k, i) => (i + 1) * k * xs_rest[i]);
    return sum(fx);
}

function newton_step(a, b, x, ks_fn, degree) {
    let ks = ks_fn(a, b); //caustic_N5_ks(a,b);
    let xs = caustic_xs(x, degree);
    const fx = caustic_fx(ks, xs);
    const dfx = caustic_dfx(ks, xs);
    return fx / dfx;
}

function newton_optim(a, b, x0, ksFn, degree) {
    let x = x0;
    let its = 10;
    while (its-- > 0) {
        xstep = newton_step(a, b, x, ksFn, degree);
        if (negl(xstep)) break;
        x -= xstep;
    }
    return x; // Math.sqrt(x);
}

// by ronaldo garcia, see: appendix B.4 in https://arxiv.org/abs/2011.06640
function caustic_N5_ks(a, b) {
    const a2 = a * a, b2 = b * b;
    const a4 = a2 * a2, b4 = b2 * b2;
    const a6 = a4 * a2, b6 = b4 * b2;
    const a8 = a4 * a4, b8 = b4 * b4;
    const c2 = a2 - b2, c4 = c2 * c2;

    const k6 = c4 * c4 * c4;
    const k5 = -2 * c4 * a2 * (3 * a8 - 9 * a6 * b2 + 31 * a4 * b4 + a2 * b6 + 6 * b8);
    const k4 = c4 * a4 * (15 * a8 - 30 * a6 * b2 + 191 * a4 * b4 + 16 * a2 * b6 + 16 * b8);
    const k3 = -4 * c4 * a8 * a2 * (5 * a4 - 5 * a2 * b2 + 66 * b4);
    const k2 = a8 * a4 * (15 * a8 - 30 * a6 * b2 + 191 * a4 * b4 - 368 * a2 * b6 + 208 * b8);
    const k1 = -2 * a8 * a6 * (3 * a8 - 3 * a6 * b2 + 22 * a4 * b4 - 48 * a2 * b6 + 32 * b8);
    const k0 = a8 * a8 * a8;
    return [k0, k1, k2, k3, k4, k5, k6];
}

// x0 is app^2, return app^2
const caustic_N5_app2 = (a, b, x0) => newton_optim(a, b, x0, caustic_N5_ks, 6);

function caustic_N7_ks(a, b) {
    const a2 = a * a, b2 = b * b;
    const a3 = a2 * a, b3 = b2 * b;
    const a4 = a2 * a2, b4 = b2 * b2;
    const a6 = a4 * a2, b6 = b4 * b2;
    const a8 = a4 * a4, b8 = b4 * b4;
    const c2 = a2 - b2, c4 = c2 * c2;

    const k0 = pow(a8, 3);
    const k1 = 4 * a * a8 * a8 * b2 * (3 * a4 - 10 * a2 * b2 + 8 * b4);
    const k2 = 2 * a8 * a8 * (-3 * a6 + 3 * a4 * b2 - 10 * a2 * b4 + 8 * b6);
    const k3 = -4 * a6 * a6 * a3 * b2 * (15 * a4 - 45 * a2 * b2 + 32 * b4);
    const k4 = a8 * a2 * c2 * (15 * a8 - 15 * a6 * b2 + 80 * a4 * b4 - 32 * a2 * b6 + 64 * b8);
    const k5 = 8 * a * a8 * b2 * (15 * a8 - 40 * a6 * b2 + 23 * a4 * b4 + 6 * a2 * b6 - 4 * b8);
    const k6 = -4 * a8 * c2 * (5 * a8 - 10 * a6 * b2 + 35 * a4 * b4 - 30 * a2 * b6 + 36 * b8);
    const k7 = -8 * a * a6 * c2 * b2 * (15 * a6 - 20 * a4 * b2 - 7 * a2 * b4 + 8 * b6);
    const k8 = a6 * c2 * (15 * a8 - 45 * a6 * b2 + 125 * a4 * b4 - 143 * a2 * b6 + 112 * b8);
    const k9 = 4 * b2 * pow(a3 - a * b2, 3) * (15 * a4 + 15 * a2 * b2 + 2 * b4);
    const k10 = -2 * a2 * c2 * c4 * (3 * a6 - 6 * a4 * b2 + 13 * a2 * b4 - 2 * b6);
    const k11 = -4 * a * c2 * c4 * b2 * (a2 + b2) * (3 * a2 + b2);
    const k12 = c4 * c4 * c4;

    return [k0, k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12];
}

const caustic_N7_app = (a, b, x0) => newton_optim(a, b, x0, caustic_N7_ks, 12);

