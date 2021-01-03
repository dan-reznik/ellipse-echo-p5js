// by ronaldo garcia, see: appendix B.4 in https://arxiv.org/abs/2011.06640
function caustic_N5_ks(a,b) {
    const a2 = a*a, b2 = b*b;
    const a4 = a2*a2, b4 = b2*b2;
    const a6 = a4*a2, b6 = b4*b2;
    const a8 = a4*a4, b8 = b4*b4;
    const c2 = a2 - b2, c4 = c2*c2;
    
    const k6 = c4*c4*c4;
    const k5 = -2*c4*a2*(3*a8 - 9*a6*b2 + 31*a4*b4 + a2*b6 + 6*b8);
    const k4 = c4*a4*(15*a8 - 30*a6*b2 + 191*a4*b4 + 16*a2*b6 + 16*b8);
    const k3 = -4*c4*a8* a2*(5*a4 - 5*a2*b2 + 66*b4);
    const k2 = a8*a4*(15*a8 - 30*a6*b2 + 191*a4*b4 - 368*a2*b6 + 208*b8);
    const k1 = -2*a8*a6*(3*a8 - 3*a6*b2 + 22*a4*b4 - 48*a2*b6 + 32*b8);
    const k0 = a8*a8*a8;
    return [k0,k1,k2,k3,k4,k5,k6];
  }
  
  function caustic_N5_xs(x) {
      return [0,1,2,3,4,5,6].map(n=>Math.pow(x,n));
  }
  
  function caustic_N5_fx(ks,xs) {
      const fx = ks.map((k,i)=>k*xs[i]);
      return sum(fx);
  }
  
  // call with rest of xs, ks (simulate derivative)
  function caustic_N5_dfx(ks,xs) {
      // k1 + 2 k2 x + 3 k3 x^2 + 4 k4 x^3 + 5 k5 x^4 + 6 k6 x^5
      const ks_rest = ks.slice(1,7); // drops k0
      const xs_rest = xs.slice(0,6); // drops x^6
      const fx = ks_rest.map((k,i)=>(i+1)*k*xs_rest[i]);
      return sum(fx);
  }
  
  // TO DO: test dfx 
  // caustic_N5_iteration(1.5,1,1.2)
  function caustic_N5_newton_step(a,b,x) {
      let ks = caustic_N5_ks(a,b);
      let xs = caustic_N5_xs(x);
      const fx = caustic_N5_fx(ks,xs);
      const dfx = caustic_N5_dfx(ks,xs);
      return fx/dfx;
  }
  
  // x0 is app^2
  function caustic_N5_iteration(a, b, x0) {
      let x = x0;
      let its = 10;
      while (its-- > 0) {
          xstep = caustic_N5_newton_step(a,b,x);
          if (negl(xstep)) break;
          x -= xstep;
      }
      return Math.sqrt(x);
  }