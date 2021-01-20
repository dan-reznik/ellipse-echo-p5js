function newton_xs(x, degree) {
    return range(0, degree).map(n => Math.pow(x, n));
}

function newton_fx(ks, xs) {
    const fx = ks.map((k, i) => k * xs[i]);
    return sum(fx);
}

// call with rest of xs, ks (simulate derivative)
function newton_dfx(ks, xs) {
    // k1 + 2 k2 x + 3 k3 x^2 + 4 k4 x^3 + 5 k5 x^4 + 6 k6 x^5
    const ks_rest = ks.slice(1); //  ks.slice(1,7); // drops k0
    const xs_rest = xs.slice(0, xs.length - 1); // drops x^6
    const fx = ks_rest.map((k, i) => (i + 1) * k * xs_rest[i]);
    return sum(fx);
}

function newton_step(a, b, x, ks_fn, degree) {
    let ks = ks_fn(a, b); //caustic_N5_ks(a,b);
    let xs = newton_xs(x, degree);
    const fx = newton_fx(ks, xs);
    const dfx = newton_dfx(ks, xs);
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