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

function caustic_N8_ks(a, b) {
    const a2 = a * a, b2 = b * b;
    const c2 = a2-b2;
    const a4 = a2 * a2, b4 = b2 * b2;
    const k4 = c2*c2;
    const k3 = - 2*a2*c2;
    const k2 = 2*a2*b2;
    const k1 = 2*a2*c2;
    const k0 = - a2*a2;
    return [k0, k1, k2, k3, k4];
}

function confocal_caustic_semiaxes_from_cost(a,b,ct) {
    const a2=a*a,b2=b*b,c2=a2-b2;
    const app2 = a2*((a2 - (a2 - 2*b2)*ct)/(a2 + b2 - c2*ct));
    const bpp2 = app2-c2;
    return [app2,bpp2].map(Math.sqrt)
}
function caustic_N8_low(a, b, x0) {
    const ct = newton_optim(a, b, x0, caustic_N8_ks, 4);
    return confocal_caustic_semiaxes_from_cost(a,b,ct)
}

// 
// -

function caustic_N8_I_II_ks(a, b) {
    const a2 = a * a, b2 = b * b;
    const c2 = a2 - b2, c4 = c2 * c2, c8 = c4 * c4;
    const a4 = a2 * a2, b4 = b2 * b2;
    const a6 = a4 * a2, b6 = b4 * b2;
    const a8 = a4 * a4; //, b8 = b4 * b4;

    const k4 = c8*c8;
    const k3 = -3*a4*c8*(a6-4*a4*b2+a2*b4-2*b6);
    const k2 = 2*a8*c4*c2*(3*a6-15*a4*b2-4*b6);
    const k1 = -4*a8*a8*c4*(a2-6*b2);
    const k0 = a8*a8*a4*(a4-8*a2*b2+8*b4);

    return [k0, k1, k2, k3, k4];
}

function caustic_N8_III_ks(a, b) {
    const alpha = a/b;
    const alpha2 = alpha*alpha;
    const alpha4 = alpha2*alpha2;
    const alpha6 = alpha4*alpha2;
    const alpha8 = alpha4*alpha4;
    const c0 = (alpha2-1)*(alpha2-1);

    const k4 = c0*(alpha4+6*alpha2+1);
    const k3 = -4*c0*(alpha2+5)*alpha4;
    const k2 =(6*(alpha4+2*alpha2-7)*alpha2+32)*alpha6;
    const k1 = -4*(alpha6+alpha4-4*alpha2+4)*alpha8;
    const k0 = alpha8*alpha8;

    return [k0, k1, k2, k3, k4];
}


