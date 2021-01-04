
function cubic_discriminant(k0, k1, k2, k3) {
  return 18 * k0 * k1 * k2 * k3 -
  4 * k2 * k2 * k2 * k0 + 
  k2 * k2 * k1 * k1 -
  4 * k3 * k1 * k1 * k1 - 
  27 * k3 * k3 * k0 * k0;
}

// https://gist.github.com/weepy/6009631
function cubic_roots(ks) { // k0,k1,k2,k3
  let [d, c, b, a] = ks;
  b /= a;
  c /= a;
  d /= a;
  let q = (3.0 * c - (b * b)) / 9.0;
  let r = -(27.0 * d) + b * (9.0 * c - 2.0 * (b * b));
  r /= 54.0;
  let discrim = q * q * q + r * r;
  let roots = [{ re: 0, im: 0, complex: false }, { re: 0, im: 0, complex: false }, { re: 0, im: 0, complex: false }]
  let term1 = (b / 3.0);

  // case 1: one real, two complex
  if (discrim > 0) {
    let s = r + Math.sqrt(discrim);
    s = ((s < 0) ? -Math.pow(-s, (1.0 / 3.0)) : Math.pow(s, (1.0 / 3.0)));
    let t = r - Math.sqrt(discrim);
    t = ((t < 0) ? -Math.pow(-t, (1.0 / 3.0)) : Math.pow(t, (1.0 / 3.0)));

    roots[0].re = -term1 + s + t;
    term1 += (s + t) / 2.0;
    roots[2].re = roots[2].re = -term1;
    term1 = Math.sqrt(3.0) * (-t + s) / 2;

    roots[1].im = term1; roots[1].complex = true;
    roots[2].im = -term1; roots[2].complex = true;
    return roots;
  } // End if (discrim > 0)

  // The remaining options are all real

  // case 2: all roots real, w two equal.
  if (negl(discrim)) {
    const r13 = ((r < 0) ? -Math.pow(-r, (1.0 / 3.0)) : Math.pow(r, (1.0 / 3.0)));
    roots[0].re = -term1 + 2.0 * r13;
    roots[2].re = roots[1].re = -(r13 + term1);
    return roots;
  } // End if (discrim == 0)

  // case 3: three distinct real (to get here, q < 0)
  q = -q;
  let dum1 = q * q * q;
  dum1 = Math.acos(r / Math.sqrt(dum1));
  const r13 = 2.0 * Math.sqrt(q);

  roots[0].re = -term1 + r13 * Math.cos(dum1 / 3.0);
  roots[1].re = -term1 + r13 * Math.cos((dum1 + 2.0 * Math.PI) / 3.0);
  roots[2].re = -term1 + r13 * Math.cos((dum1 + 4.0 * Math.PI) / 3.0);

  return roots;
} 