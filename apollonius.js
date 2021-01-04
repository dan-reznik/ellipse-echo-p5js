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
