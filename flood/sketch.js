let bx = 0;
let bxspeed = 0.1;
let cw;
let cols = 100;
let go = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  cw = height/cols;
  
  stroke(0, 16);
  background(0);
}

function draw() {
  background(0, 10);
  if(go) bx += bxspeed;
  for(let x = 0; x < bx; x++) {
    fill(x % 2 == 0 ? 255 : 0, 10);
    rect(0, x, width, cw);
  }
}

function mousePressed() {
  bx = mouseY;
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
