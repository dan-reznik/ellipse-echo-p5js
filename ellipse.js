function in_ell(a,b,[px,py]) {
    return (px*px)/(a*a)+(py*py)/(b*b)<1;
}

function ell_grad(a,b,[x,y]) {
    return [-2*x/(a*a),-2*y/(b*b)];
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

function in_ell(a,b,[px,py]) {
    return (px*px)/(a*a)+(py*py)/(b*b)<1;
}

function ellInterRayb(a, b, [x, y], [nx, ny]) {
    let a2=a*a, b2=b*b;
    let c2 = b2*nx*nx + a2*ny*ny;
    let c1 = 2*(b2*nx*x + a2*ny*y);
    let c0 = b2*x*x + a2*y*y - a2*b2;
    let ss = quadRoots(c2, c1, c0);
    return ray([x, y], [nx, ny], ss[1]);
 }
  