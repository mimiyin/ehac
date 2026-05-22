let by = 200;
let byspeed = 0.05;
let rh;
let rows = 10;
let a = 0;
let go = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  rh = height / rows;
  noStroke();
  background(0);
  console.log(rh);
}

function draw() {
  background(0);
  if (go) by += byspeed;

  a++;
  //a=40;
  if(a > 64) a = 0;
  let _a = a;
  for (let y = by; y >= 0; y--) {
    _a-=3;
    if (_a < 0) _a = 64;
    stroke(255, round(_a));
    //stroke(255);
    line(-10, y, width + 10, y);
  }
}

function mousePressed() {
  by = mouseY;
}

function keyPressed() {
  switch (keyCode) {
    case RETURN || ENTER:
      go = !go;
      break;
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
