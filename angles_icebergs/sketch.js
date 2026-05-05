// Settings
const M = 20;

const SPEEDS = {
  S: 0.00005, // 2
  M: 0.0005, // 20
  F: 0.001, // 100
}

// Iceberg
let areas = [];
let flip = true;

// Position of 2 people
let movers = {}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  movers = init_movers();
  console.log(movers);

  pozyx();
}

// Initial position
function pos() {

  // Center
  
  let cx = (movers.A.x + movers.B.x) / 2;
  let cy = (movers.A.y + movers.B.y) / 2;

  // 4 Sides
  let side = dist(movers.A.x, movers.A.y, movers.B.x, movers.B.y)/2;
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
  let c = 255;
  let a = {
    pos: 0,
    speed: distribute([{ min: 0.01, max: 0.02, weight: 1 }, { min: 0.02, max: 0.05, weight: 10 }, { min: 0.08, max: 0.1, weight: 5 }]) // random(0.01, 0.1) * 2
  };

  let th = {
    pos: random(TWO_PI),
    speed: random(-0.001, 0.001)
  }
  areas.push(new Area(pos(), drift(), c, a, th));
}

function all_off() {
  let off = true;
  for(let area of areas) {
    if(!area.off()) off = false;
  }
  return off;
}

function draw() {
  background(0);

  if (areas.length == 0 || all_off() || keyIsPressed) {
    create();
    flip = !flip;
  } 

  // Run all the areas
  // Check for dead
  for(let a in areas) {
    let area = areas[a];
    area.run();
    if(area.dead()) areas.splice(a);
  }

  noStroke();
  textSize(64);
  textAlign(CENTER, CENTER);
  for(let m in movers) {
    let mover = movers[m];
    fill('red');
    ellipse(mover.x, mover.y, 20);
    fill('white');
    text(m, mover.x, mover.y);
  }
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

  fade() {
    this.a.pos -= this.a.speed;
  }

  dead() {
    return this.a.pos < 0;
  }

  update() {
    if (this.cueing()) return;

    this.l.pos += this.l.speed;
    this.t.pos += this.t.speed;
    this.r.pos += this.r.speed;
    this.b.pos += this.b.speed;

    this.th.pos += this.th.speed;

    if(this.off()) this.fade();
  }

  corner(_x, _y) {

    // Calculate each corner in cartesian coordinates    
    let r = dist(this.cx, this.cy, this.cx + _x, this.cy + _y);
    let th = createVector(_x, _y).heading() + this.th.pos;
    let x = cos(th) * r + this.cx;
    let y = sin(th) * r + this.cy;
    noStroke();
    fill('red');
    ellipse(x, y, 15, 15);
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
