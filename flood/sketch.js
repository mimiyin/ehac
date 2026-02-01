let bx = 0;
let bxspeed = 0.05;
let cw;
let cols = 100;
let go = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  cw = width/cols;
  fill(255, 1);
  stroke(0, 10);
}

function draw() {
  background(0, 10);
  if(go) bx += bxspeed;
  for(let x = 0; x < bx; x++) {
    rect(x, 0, cw, height);
  }
}

function mousePressed() {
  bx = mouseX;
}

function keyPressed() {
  switch (keyCode) {
    case RETURN || ENTER:
      go = !go;
      break;
    case RIGHT_ARROW:
      bxspeed += 0.001;
      break;
    case LEFT_ARROW:
      bxspeed -= 0.001;
      break;
    case UP_ARROW:
      bxspeed -= 0.1;
      break;
    case DOWN_ARROW:
      bxspeed += 0.1;
      break;
  }
  console.log(nfs(bxspeed, 0, 2));
}
