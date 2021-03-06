//extSize(32);
//text('word', 10, 30);

function draw_arrow(from, to, rgb, stroke_w) {
  const p80 = vinterp(to,from,.3);
  const t = toRad(15.);
  const ct = Math.cos(t), st = Math.sin(t);
  const t1 = vrotRel(p80,to,ct,st);
  const t2 = vrotRel(p80,to,ct,-st);
  push();
  stroke(rgb);
  strokeWeight(stroke_w);
  line(from[0], from[1], to[0], to[1]);
  fill(rgb);
  triangle(to[0], to[1], t1[0], t1[1], t2[0],t2[1]);
  pop();  
}

function draw_text(txt, p, rgb, size=1) {
  push();
  textSize(size);
  strokeWeight(0);
  fill(rgb);
  //textAlign(CENTER, BOTTOM);
  textStyle(NORMAL);
  text(txt, p[0], p[1] - 0.02);
  pop();
}

function draw_point([x, y], rgb, stroke_w) {
  push();
  fill(rgb);
  strokeWeight(0);
  circle(x, y, 0.05 * sqrt(stroke_w / 0.01));
  pop();
}

function draw_polyline(vtx, rgb, stroke_w) {
  push();
  noFill();
  stroke(rgb);
  strokeWeight(stroke_w);
  beginShape();
  for (let i = 0; i < vtx.length; i++)
     vertex(...vtx[i]);
  endShape();
  pop();
}

function draw_polygon(vtx, rgb, stroke_w) {
  push();
  noFill();
  stroke(rgb);
  strokeWeight(stroke_w);
  beginShape();
  for (let i = 0; i < vtx.length; i++)
     vertex(...vtx[i]);
  endShape(CLOSE);
  pop();
}

function linedash(p1, p2, dd) {
  let d12 = edist(p1, p2);
  let phat = vnorm(vdiff(p2, p1));
  let flag = true;
  for (let d = 0; d < Math.min(d12, 100) - dd; d += dd) {
    if (flag) {
      let from = vsum(p1, vscale(phat, d));
      let to = vsum(from, vscale(phat, dd));
      line(from[0], from[1], to[0], to[1]);
    } else d += dd;
    flag = !flag;
  }
}

function draw_line_dashed(p1, p2, rgb, stroke_w) {
  push();
  noFill();
  stroke(rgb);
  strokeWeight(stroke_w);
  linedash(p1, p2, 0.025);
  pop();
}

function draw_ellipse_low(a, b, rgb, stroke_w) {
  push();
  noFill();
  stroke(rgb);
  strokeWeight(stroke_w);
  ellipse(0, 0, 2 * a, 2 * b);
  pop();
}

function draw_ellipse(a, b, rgb, stroke_w) {
  const c = Math.sqrt(a * a - b * b);
  push();
  noFill();
  stroke(rgb);
  strokeWeight(stroke_w);
  ellipse(0, 0, 2 * a, 2 * b);
  draw_line_dashed([-a, 0], [a, 0], clr_gray, stroke_w);
  draw_line_dashed([0, -b], [0, b], clr_gray, stroke_w);
  draw_point([-c, 0], rgb, .5 * stroke_w);
  draw_point([c, 0], rgb, .5 * stroke_w);
  pop();
}

function draw_spokes(P0, Qs, rgb, stroke_w) {
  const max_spokes = 128;
  push();
  stroke(rgb);
  strokeWeight(stroke_w);
  // TO DO: limit # of drawn spokes to say 200
  const istep = Qs.length <= max_spokes ? 1 : floor(Qs.length / max_spokes);
  for (let i = 0; i < Qs.length; i += istep)
    line(...P0, ...Qs[i]);
  pop();
}

