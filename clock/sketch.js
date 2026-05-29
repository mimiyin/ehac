let a = 0;
let diag;
let tick = true;
let block = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  diag = sqrt(sq(width) + sq(height));
  noCursor();
}

function draw() {
  background(0);
  // move the clock
  if (tick) {
    if (frameCount % 60 == 1) a += TWO_PI / 100;
  }
  else a += TWO_PI / 10000;

  translate(width / 2, height / 2);
  rotate(a);
  if (block) {
    rectMode(CENTER);
    //rect(0, 0, diag / 2);
    triangle(0, -height/2, width/2, 0, -width/2, height/2.5);
  }
  else {
    rectMode(CORNER);
    rect(0, 0, diag, 10);
  }


}

function mousePressed() {
  by = mouseY;
}

function keyPressed() {
  switch (keyCode) {
    case RETURN || ENTER:
      tick = !tick;
      break;
    case SHIFT:
      block = !block;
      break;
  }
}
