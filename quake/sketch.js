const SIZE = 50;
let sz = 0;
let t = 0;
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);
  t+= 0.1
  sz+=noise(t) - 0.4;
  stroke(255, 0, 0, 10);
  fill(255, 0, 0, 128);
  for (let x = -width/2; x < width/2; x += SIZE) {
    for (let y = -height/2; y < height/2; y += SIZE) {
      push();
      translate(x, y);
      box(SIZE, SIZE, random(sz));
      pop();
    }
  }
}
