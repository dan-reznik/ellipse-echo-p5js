function ell_error(a,b,[x,y]) {
    return (x*x)/(a*a)+(y*y)/(b*b)-1.0;
}

function in_ell(a,b,p) {
    return ell_err(a,b,p)<0;
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
    return ray([x, y], [nx, ny], ss[1]);
 }
  