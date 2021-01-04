function cubic_discr(k0, k1, k2, k3) {
    return 18 * k0 * k1 * k2 * k3 -
    4 * k2 * k2 * k2 * k0 + 
    k2 * k2 * k1 * k1 -
    4 * k3 * k1 * k1 * k1 - 
    27 * k3 * k3 * k0 * k0;
}

function apolloniusKs(a, b, [mx, my]) {
    const a2 = a * a, b2 = b * b;
    const a4 = a2 * a2, c2 = a2 - b2;
    const k0 = a4 * a2 * mx;
    const k1 = a4 * (2 * b2 - a2);
    const k2 = -c2 * mx * (a2 + b2);
    const k3 = c2 * c2;
    return [k0, k1, k2, k3];
}

function apolloniusX_low(ks, x) {
    return sum(ks.map((k, i) => k * Math.pow(x, i)));
}

function apolloniusX(a, b, P, x) {
    const ks = apolloniusKs(a, b, P);
    return apolloniusX_low(ks, x);
}
