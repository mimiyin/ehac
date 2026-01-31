let x1, x2, y;
let a = 0;
let aspeed = 0;
let go = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  x1 = 0;
  x2 = width;
  y = height / 2;
  noCursor();
  stroke(255);
  strokeWeight(10);
}

function draw() {
  background(0);
  translate(x1, y);
  rotate(a);
  //aspeed = -pow(1.001, frameCount * 0.000000005) * 0.00001;
  if (go) a += aspeed;
  line(0, 0, x2 * 4, 0);

}

function keyPressed() {
  switch (keyCode) {
    case RETURN || ENTER:
      go = !go;
      break;
    case RIGHT_ARROW:
      aspeed += 0.00001;
      break;
    case LEFT_ARROW:
      aspeed -= 0.000001;
      break;
    case UP_ARROW:
      aspeed -= 0.0001;
      break;
    case DOWN_ARROW:
      aspeed += 0.00001;
      break;
  }
  console.log(nfs(aspeed, 0, 2));
}
