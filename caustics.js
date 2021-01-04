getDelta2 = (a2,b2) => Math.sqrt(a2*a2-a2*b2+b2*b2);

function caustic_N3(a, b) {
    const a2 = a * a, b2 = b * b;
    const c2 = a2 - b2;
    if (negl(c2))
        return [a / 2, a / 2];
    else {
        const d = getDelta2(a2, b2);
        const ap = a * (d - b2) / c2;
        const bp = b * (a2 - d) / c2;
        return [ap, bp];
    }
}

function caustic_N4(a,b) {
    const a2=a*a,b2=b*b;
    const denom = Math.sqrt(a2+b2);
    const ap = a2/denom;
    const bp = b2/denom;
    return [ap,bp];
}

// hyperbolic
function caustic_N4_si(a,b) {
    const a2=a*a,b2=b*b;
    const c=Math.sqrt(a2-b2);
    const app=a*Math.sqrt(a2-2*b2)/c;
    const bpp=b2/c;
    return [app,bpp];
}

function hypInter_N4_si(a,b,app,bpp) {
    const c = Math.sqrt(a*a-b*b);
    return [(a/c)*app,(b/c)*bpp];
}

// TO DO: apollonius points

function caustic_N5(a,b) 
{
   // c2 = app^2-bpp^2 => bpp^2=app^2-c2;
   const app2 = caustic_N5_app2(a, b, a*a);
   const c2 = a*a-b*b;
   const app = Math.sqrt(app2);
   const bpp = Math.sqrt(app2-c2);
   return [app,bpp];
}

function caustic_N6(a,b) {
    const denom=a+b;
    const ap=a*Math.sqrt(a*(a+2*b))/denom;
    const bp=b*Math.sqrt(b*(2*a+b))/denom;
    return [ap,bp];
}

function bounce_caustic(a, b, P0, app, bpp, n, tangFn) {
    let tangs, nextP=P0, ps = [JSON.parse(JSON.stringify(P0))];
    for (let i = 0; i < n-1; i++) {
        tangs = tangFn(app, bpp, nextP);
        nextP = ellInterRayb(a, b, nextP, vdiff(tangs[0], nextP));
        ps.push(nextP);
    }
    return(ps);
}

function bounce_billiard(a, b, P0, v0, n) {
    let prevP,nextP=P0, ps = [JSON.parse(JSON.stringify(P0))];
    let v=v0, grad;
    for (let i = 0; i < n-1; i++) {
        prevP=nextP;
        nextP = ellInterRayb(a, b, nextP, v);
        ps.push(nextP);
        grad = ell_grad(a,b,nextP);
        v = vrefl(vdiff(prevP,nextP),grad);
    }
    return(ps);
}

function cos_alpha(a, x) {
    const a2 = a * a;
    const a4 = a2 * a2;
    delta = sqrt(a4 - a2 + 1);
    const num = a2 * sqrt(2 * delta - a2 - 1);
    const denom = (a2 - 1) * sqrt(a4 - (a2 - 1) * x * x);
    return num / denom;
  }

function orbit_N3(a, b, tDeg) {
    const t = toRad(tDeg);
    const p1 = [a * Math.cos(t), b * Math.sin(t)];
    const n1 = ell_norm(a, b, p1);
    // need to generalize
    const ca = cos_alpha(a, p1[0]);
    const sa = sqrt(1 - ca * ca);
    const nrot = rotSinCos(n1, sa, ca);
    const nrotNeg = rotSinCos(n1, -sa, ca);
    const p2 = ellInterRayb(a, b, p1, nrot);
    const p3 = ellInterRayb(a, b, p1, nrotNeg);
    //const n2 = ell_norm(a, b, p2);
    //const n3 = ell_norm(a, b, p3);
   //// const obj = {
     // o: [p1, p2, p3],
    //  n: [n1, n2, n3],
   //   s: tri_sides([p1, p2, p3])
   return [p1, p2, p3];
  }