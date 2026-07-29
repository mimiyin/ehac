let mode = 0;
let byspeeds = [0.5, 1, 5, 10, 20];

let by = 200;
let byspeed = byspeeds[mode];
let rh;
let rows = 5;
let vis_rows = 5;
let a = 0;
let go = false;

let multi = true;
let reverse = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  rh = round(height / vis_rows);
  noStroke();
  background(0);
}

function draw() {
  background(0);
  if (reverse) scale(1, -1);
  if (go) by += byspeed;

  a++;
  if (a > 64) a = 0;
  let _a = a;

  if (multi) {
    for (let row = 0; row < rows; row++) {
      let _by = by - (rh * row);
      let end = _by - (rh * 0.5);
      for (let y = _by; y >= end; y--) {
        _a -= 2.5;
        if (_a < 0) _a = 64;
        stroke(255, round(_a));
        line(-10, y, REAL_WIDTH, y);
      }
    }
  }
  else {
    for (let y = by; y >= 0; y--) {
      _a -= 1.5;
      if (_a < 0) _a = 64;
      stroke(255, round(_a));
      line(-10, y, REAL_WIDTH, y);
    }
  }
}

function mousePressed() {
  by = mouseY;
}

function keyPressed() {

  switch (key) {
    case 'g':
      go = !go;
      console.log(go ? 'go' : 'no go');
      break;
    case 'm':
      multi = !multi;
      console.log(multi ? 'multi' : 'no multi');
      break;
    case 'r':
      reverse = !reverse;
      by = reverse ? -height : 0;
      break;
  }

  switch (keyCode) {
    case SHIFT:
      mode++;
      mode%=byspeeds.length;
      byspeed = byspeeds[mode];
    case RIGHT_ARROW:
      byspeed += 0.001;
      break;
    case LEFT_ARROW:
      byspeed -= 0.001;
      break;
    case UP_ARROW:
      byspeed -= 0.1;
      break;
    case DOWN_ARROW:
      byspeed += 0.1;
      break;
  }
  console.log(nfs(byspeed, 0, 2));
}
