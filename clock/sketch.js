// SETTINGS
let urlParams = new URLSearchParams(window.location.search);
let live = parseFloat(urlParams.get('live')) || 0;
let period = parseFloat(urlParams.get('period')) || 10;
let hand = parseFloat(urlParams.get('hand')) || 0;
let tick = parseInt(urlParams.get('tick')) || 0;
let debug = parseInt(urlParams.get('debug')) || 0;

// TIMING
const AVG_PERIOD = 10;
const REFRESH_PERIOD = 10;
let a = 0;
let diag;

// Refresh rate 
let rr = 30 * REFRESH_PERIOD;
// Smoothing over 5s
let ts = 30 * AVG_PERIOD;

// Position of 2 people
let movers = {}
// Average distances
let ds = [];
// Average periods
let ps = [];

// Invert mapping
let invert = false;
let invert_fc = 30 * 60; // <-- seconds
let revert_fc = 30 * 120;

function setup() {
  createCanvas(windowWidth, windowHeight);
  diag = sqrt(sq(width) + sq(height));

  movers = init_movers();
  pozyx();

  noStroke();
  noCursor();
}

function calc_period() {
  // Calculate the mid-point between 2 points
  // Store this frame's midpoint
  let d = distance(movers);
  ds.push(d);

  // Only ts frames of midpoints
  if (ds.length > ts) ds.shift();
  // Calculate avg distance
  let avg_d = calc_avg(ds);
  
  // period is in second
  let dim = diag/avg_d; //avg_d;
  let p = invert ? map_period(dim, 5, 0) : map_period(dim, 0, 360);

  // Store periods
  ps.push(p);
   // Only ts frames of midpoints
  if (ps.length > ts) ps.shift();
  // Calculate avg period
  let avg_p = calc_avg(ps);
  return avg_p;
  //if(invert) return map_period(dim, 360, 0);
  //else return map_period(dim, 0, 360);
}

function map_period(val, mini, maxi) {
  return constrain(map(val, 1.5, 30, mini, maxi), 0.1, 360);
}

function calc_avg(values) {
  // Calculate average midpoint over time
  let avg = 0;
  for (let value of values) {
    avg += value;
  }
  avg /= values.length;
  return max(avg, 1);
}

function draw() {

  // Only proceed if we have A and B
  if (!(movers.A && movers.B)) return;
  if(live) {
    // Invert mapping automatically
    if(frameCount == invert_fc || frameCount == revert_fc) invert = !invert;
    period = calc_period();
    console.log(period);
  }


  // Update
  if (tick) {
    if (frameCount % 60 == 1) advance();
  }
  else advance();

  /////////// DRAWING //////////////////
  background(0);
  push();
  translate(width / 2, height / 2);
  if(hand) draw_hand();
  else draw_tri();
  pop();

  if(debug) {
    push();
    draw_movers(movers);
    textAlign(CENTER);
    textSize(64);
    fill('black');
    textSize(128);
    text(round(millis()/1000, 0, 2) + 's ' + round(frameCount, 0, 2) + 'f ' + nfs(period, 0, 2), width/2, height/2);
    pop();

    // Show triangle is inverted
    fill(invert ? 'hotpink' : 'white');
  }
}

function mouseMoved() {
  movers = reposition(movers);
}

function keyPressed() {
  switch(key) {
    case 'd':
      debug = !debug;
      break;
    case 'i':
      invert = !invert;
      break;
  }    
}

function advance() {
  a += TWO_PI / (60 * period)
}

function draw_tri() {
  let v1 = calc_vert(a);
  let v2 = calc_vert(a + (TWO_PI * 0.25));  
  let v3 = calc_vert(a + (TWO_PI * 0.63));
  triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
}

function draw_hand() {
  rectMode(CORNER);
  rotate(a);
  rect(0, 0, diag, 10);
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
  let r = min(dx, dy) - 10;
  
  return { x: x_comp * r, y : y_comp * r };
}
