function ell_error(a,b,[x,y]) {
    return (x*x)/(a*a)+(y*y)/(b*b)-1.0;
}

function in_ell(a,b,p) {
    return ell_error(a,b,p)<0;
}

function outside_ell(a,b,p) {
    return ell_error(a,b,p)>0;
}

function ell_grad(a,b,[x,y]) {
    return [-2.0*x/(a*a),-2.0*y/(b*b)];
}

function ell_norm(a, b, p) {
    return vnorm(ell_grad(a,b,p));
  }

function get_ellipse_point_rad(a,b,t) {
    return [a*Math.cos(t),b*Math.sin(t)];
  }

function get_ellipse_point(a,b,tDeg) {
    return get_ellipse_point_rad(a,b,toRad(tDeg));
}

function ellInterRayb(a, b, [x, y], [nx, ny]) {
    let a2=a*a, b2=b*b;
    let c2 = b2*nx*nx + a2*ny*ny;
    let c1 = 2*(b2*nx*x + a2*ny*y);
    let c0 = b2*x*x + a2*y*y - a2*b2;
    let ss = quadRoots(c2, c1, c0);
    return vray([x, y], [nx, ny], ss[1]);
 }

 function ell_err_prime(a,b,[px,py],[nx,ny],t) {
     // d/dt of the ellipse error fn
     // for a ray from p toward n by t.
     return 2*(nx*px/(a*a)+ny*py/(b*b));
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
  