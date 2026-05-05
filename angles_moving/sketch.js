// SETTINGS
// Period in seconds
const PERIOD = 2;

// Position of 2 people
let movers = {}

// Swing mode
let swing = true;

// Flip of divison?
let flip = true;

// Average midpoints
let mids = [];
// Average angles
let dxys = [];

// Average midpoint over time
let amid = {
  x: 0,
  y: 0
};

// Average relative positions over time
let adxy = {
  x: 0,
  y: 0
};

// Diag of canvas
let diag = 0;

// Angle
let angle = 0;
let pangle = 0;
let _angle = 0;
let a_dir = 1;
let a_off = 0;
let a_speed = 0.0001;

// Refresh rate 
let rr = 60 * PERIOD;
// Smoothing over 5s
let ts = 60 * PERIOD

// Alpha
let a = -1;
let amax = 255;
let aspeed = 1;
let adir = 1;

// Calc real angle difference
function diff(a, pa) {
  let d = abs(a - pa);
  if (abs(d) > PI) {
    if (a < PI) d = a + (TWO_PI - pa);
    else d = pa + (TWO_PI - a);
  }
  return d;
}

// Calc dir
function dir(d) {
  // Take the shortest route
  if (d > PI) return -1
  else if (d > 0) return 1
  else if (d > -PI) return -1
  else if (d <= -PI) return 1
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Start off on a diagonal
  movers = init_movers();

  // Calculate diagonal of screen
  diag = sqrt(sq(width) + sq(height)) * 0.67;

  // Calculate aspeed
  aspeed = amax / rr;

  noStroke();
  //noCursor();

  // Listen for pozyx data
  pozyx(); 
}

function draw() {
  
  // Only proceed if we have A and B
  if(!(movers.A && movers.B)) return;

  // Calculate the mid-point between 2 points
  // Store this frame's midpoint
  mids.push(midpoint(movers));

  // Only ts frames of midpoints
  if (mids.length > ts) mids.shift();


  // Calculate the relative position of 2 points
  let dXY = {
    x: movers.B.x - movers.A.x,
    y: movers.B.y - movers.A.y
  };
  // Store this frame's relative position
  dxys.push(dXY);
  // Only store ts frames of relative positions
  if (dxys.length > ts) dxys.shift();

  // Fade in
  a += aspeed * adir;

  // If we're all black or all white
  if (a < 0 || a > amax * 2) {
    // Flip color of division
    // When you go to white or black
    flip = !flip;
    a = 0;

    // Calculate average midpoint over time
    amid = {
      x: 0,
      y: 0
    };
    for (let mid of mids) {
      amid.x += mid.x;
      amid.y += mid.y;
    }
    amid.x /= mids.length;
    amid.y /= mids.length;

    // Set-up an object to store the average relative xy position over time
    adxy = {
      x: 0,
      y: 0
    };

    // Calculate the average relative xy position
    for (let dxy of dxys) {
      adxy.x += dXY.x;
      adxy.y += dXY.y;
    }
    adxy.x /= dxys.length;
    adxy.y /= dxys.length;

    pangle = angle;
    angle = atan(adxy.y / adxy.x);
    angle = map(angle, -PI, PI, 0, TWO_PI);
    let a_diff = angle - pangle;
    a_dir = dir(a_diff);

    // Go the long way if the angle hasn't really changed
    // let real_diff = diff(angle, pangle);
    // if(real_diff < TWO_PI * 0.01) a_dir *= -1;

  }


  // Calculate the average angle
  if (diff(angle, _angle) > 0.1) _angle += a_dir * abs(angle - _angle) * 0.2;
  //console.log(nfs(pangle, 0, 2), 'to ' + nfs(angle, 0, 2), 'now ' + nfs(_angle, 0, 2), 'dir ' + a_dir);
  // Wrap in both angles
  if (_angle < 0) _angle = TWO_PI;
  _angle %= TWO_PI;
  a_off += a_speed;

  // Draw the background
  background(flip ? 255 : 0);
  if(swing) background(0);

  // Rotate the canvas to that angle
  // to draw the dividing rectangle
  fill(flip ? 0 : 255, a - amax);
  if(swing) fill(0);
  rect(0, 0, width, height);
  push();
  translate(amid.x, amid.y);
  rotate(_angle + a_off);
  // Draw the xy division
  // If flip, then this one is ahead
  //fill(255);
  fill(flip ? 0 : 255, a);
  if(swing) fill(255);
  rect(0, -diag / 2, diag, diag);
  // If flip, then this one is behind
  pop();


  // Draw the people
  draw_movers(movers);

}

function keyPressed() {
  switch (key) {
    case 'p':
      toggle_pozyx();
      break;
    case 's':
      swing = !swing;
  }
}

// Move the closest point with the mouse
// mouse is being dragged
function mouseDragged() {
  movers = reposition(movers)
}
