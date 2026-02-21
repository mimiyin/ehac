let x, y, s;
let interval = 60;

function setup() {
  createCanvas(windowWidth, windowHeight);

  x = width / 2;
  y = height / 2;
  s = width / 5;

  rectMode(CENTER);
  noCursor();
}

function draw() {
  background(0);

  if (frameCount % interval < interval/2) {
    fill(255);
    rect(x, y, s);
  }

}

function mousePressed() {
  bx = mouseX;
}

function keyPressed() {
  switch (keyCode) {
    case RIGHT_ARROW:
      interval++;
      break;
    case LEFT_ARROW:
      interval--;
      break;
    case UP_ARROW:
      interval -= 10;
      break;
    case DOWN_ARROW:
      interval += 10;
      break;
  }

  interval = constrain(interval, 1, 10000);
}
