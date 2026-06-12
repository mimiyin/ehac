

//URLParams
let urlParams = new URLSearchParams(window.location.search);

// SETTINGS
let tick = parseInt(urlParams.get('tick')) || 0;
let block = parseInt(urlParams.get('block')) || 0;
let period = parseFloat(urlParams.get('period')) || 180;

let a = 0;
let diag;

function setup() {
  createCanvas(windowWidth, windowHeight);
  diag = sqrt(sq(width) + sq(height));
  noCursor();
}

function draw() {
  background(0);
  // move the clock
  if (tick) {
    if (frameCount % 60 == 1) a += TWO_PI / (60 * period);
  }
  else a += TWO_PI / (60 * period);

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

function keyPressed() {
  switch (key) {
    case 't':
      tick = !tick;
      break;
    case 'b':
      block = !block;
      break;
  }
}
