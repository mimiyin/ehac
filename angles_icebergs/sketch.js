// Settings
const M = 20;

const SPEEDS = {
  S: 0.00005, // 2
  M: 0.0005, // 20
  F: 0.001, // 100
}

let area;
let flip = true;

function setup() {
  createCanvas(windowWidth, windowHeight);

  //colorMode(HSB, 360, 100, 100, 100);
  noStroke();

}

// Initial position
function pos() {

  // Center
  let cx = random(width * 0.25, width * 0.75);
  let cy = random(height * 0.25, height * 0.75);

  // 4 Sides
  let side = width * random(0.1, 0.4);
  let l = - side;
  let r = + side;
  let t = - side;
  let b = + side;

  return { l: l, r: r, t: t, b: b, cx: cx, cy: cy }
}

function drift() {
  // Populate speeds
  let h = {};
  let v = {};

  // Pick a corner
  let dir = { h: random([-1, 1]), v: random([-1, 1]) };

  // Going left or right?
  h[dir.h] = width * random(SPEEDS.M, SPEEDS.F) * dir.h;
  h[-dir.h] = h[dir.h] * 0.25;

  // Going up or down?
  v[dir.v] = width * random(SPEEDS.M, SPEEDS.F) * dir.v;
  v[-dir.v] = v[dir.v] * 0.25;

  return { l: h[-1], r: h[1], t: v[-1], b: v[1] };
}

function create() {
  let c = flip ? 255 : 0;
    let a = {
      pos: 0,
      speed: random(0.01, 0.1) * 2
    };
    let t = {
      pos: random(TWO_PI),
      speed: random(-0.001, 0.001)
    }
    area = new Area(pos(), drift(), c, a, t);
}

function draw() {
  background(flip ? 255 : 0);

  if (!area || area.off() || keyIsPressed) {
    create();
    flip = !flip;
  } else area.run();
}

class Area {
  constructor(pos, speed, c, a, th) {

    this.cx = pos.cx;
    this.cy = pos.cy;
    this.l = { pos: pos.l, speed: speed.l };
    this.t = { pos: pos.t, speed: speed.t };
    this.r = { pos: pos.r, speed: speed.r };
    this.b = { pos: pos.b, speed: speed.b };
    this.c = c;
    this.a = a;
    this.th = th;
  }

  run() {
    this.update();
    this.display();
  }

  cueing() {
    this.a.pos += this.a.speed;
    return this.a.pos < 10;
  }

  update() {
    if (this.cueing()) return;

    this.l.pos += this.l.speed;
    this.t.pos += this.t.speed;
    this.r.pos += this.r.speed;
    this.b.pos += this.b.speed;

    this.th.pos += this.th.speed;
  }

  corner(_x, _y) {

    // Calculate each corner in cartesian coordinates    
    let r = dist(this.cx, this.cy, this.cx + _x, this.cy + _y);
    let th = createVector(_x, _y).heading() + this.th.pos;
    let x = cos(th) * r + this.cx;
    let y = sin(th) * r + this.cy;
    noStroke();
    fill('red');
    //ellipse(x, y, 15, 15);
    return x < - M || x > width + M || y < - M || y > height + M;
  }

  off() {
    let tl = this.corner(this.l.pos, this.t.pos);
    let tr = this.corner(this.r.pos, this.t.pos);
    let br = this.corner(this.r.pos, this.b.pos);
    let bl = this.corner(this.l.pos, this.b.pos);

    //console.log("OFF", tl, tr, br, bl);
    return (tl && tr && br && bl);
  }

  display() {
    push();
    noStroke();
    translate(this.cx, this.cy);
    rotate(this.th.pos);
    fill(this.c, this.a.pos);
    beginShape();
    vertex(this.l.pos, this.t.pos);
    vertex(this.r.pos, this.t.pos);
    vertex(this.r.pos, this.b.pos);
    vertex(this.l.pos, this.b.pos);
    endShape();
    pop();
  }
}
