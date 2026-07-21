// SETTINGS
const AVG_PERIOD = 5;
const REFRESH_PERIOD = 10;
let period = 10;
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
// Average distance over time
let avg_d = {
  x: 0,
  y: 0
};

// Average deviation from amid
let d_amid = 0;

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
  avg_d = 0;
  
  for (let d of ds) {
    avg_d += d;
  }
  avg_d /= ds.length;
  
  // period is in second
  period = map(avg_d, 0, diag, 180, 10)
}

function draw() {

  // Only proceed if we have A and B
  if (!(movers.A && movers.B)) return;
  calc();

  // move the clock
  a += TWO_PI / (60 * period);

  /////////// DRAWING //////////////////
  background(0);
  push();
  translate(width / 2, height / 2);
  let v1 = calc_vert(a);
  let v2 = calc_vert(a + (TWO_PI * 0.25));  
  let v3 = calc_vert(a + (TWO_PI * 0.63));

  triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
  pop();

  draw_movers(movers);
}

function mouseMoved() {
  movers = reposition(movers);
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
