// SETTINGS
let urlParams = new URLSearchParams(window.location.search);
let tick = parseInt(urlParams.get('tick')) || 0;
let live = parseFloat(urlParams.get('live')) || 0;
let period = parseFloat(urlParams.get('period')) || 10;

let debug = false;

// TIMING
const AVG_PERIOD = 5;
const REFRESH_PERIOD = 10;
let a = 0;
let diag;

// Refresh rate 
let rr = 60 * REFRESH_PERIOD;
// Smoothing over 5s
let ts = 60 * AVG_PERIOD;

// Position of 2 people
let movers = {}
// Average distances
let ds = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  diag = sqrt(sq(width) + sq(height));

  movers = init_movers();
  pozyx();

  noStroke();
  noCursor();
}

function calc() {
  // Calculate the mid-point between 2 points
  // Store this frame's midpoint
  ds.push(distance(movers));

  // Only ts frames of midpoints
  if (ds.length > ts) ds.shift();

  // Calculate average midpoint over time
  let avg_d = 0;
  
  for (let d of ds) {
    avg_d += d;
  }
  avg_d /= ds.length;
  
  // period is in second
  return map(avg_d, 0, diag, 180, 10)
}

function draw() {

  // Only proceed if we have A and B
  if (!(movers.A && movers.B)) return;
  if(live) period = calc();

  if (tick) {
    if (frameCount % 60 == 1) a += TWO_PI / (60 * period);
  }
  else a += TWO_PI / (60 * period);

  /////////// DRAWING //////////////////
  background(0);
  push();
  translate(width / 2, height / 2);
  let v1 = calc_vert(a);
  let v2 = calc_vert(a + (TWO_PI * 0.25));  
  let v3 = calc_vert(a + (TWO_PI * 0.63));

  triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
  pop();

  if(debug) draw_movers(movers);
}

function mouseMoved() {
  movers = reposition(movers);
}

function keyPressed() {
  if(key == 'd') debug = !debug;
}

// Find point on the edge
function calc_vert(a) {
  let x_comp = cos(a);
  let y_comp = sin(a);
  
  // Distance to touching left-right sides
  let dx = (width / 2) / abs(x_comp);
  // Distance to touching top-down sides
  let dy = (height / 2) / abs(y_comp);
  
  // The shorter distance determines the boundary hit
  let r = min(dx, dy);
  
  return { x: x_comp * r, y : y_comp * r };
}
