// Press 'f' to turn flash on/off
// Double press 'f' to increase rate of flashing
// Press ENTER/RETURN to advance rotation
// Press arrow keys to jump to rotation

// FLASH SETTINGS
const FPS = 60;
let flash_mult = 1;
const FLASH_INTERVAL = FPS * flash_mult; // Will flash every 10s
const FLASH_HOLD = FPS * 0.5 // For 1/2 a second
const FLASH_BG = 0

let auto = true;
let flash = false;
let cell = false;

// TURN SETTINGS
const TURN_INTERVAL = parseInt(FPS * 60 * 0.5); // 10 minutes
let counter = 0;

// VIDEO
let video;
let v_w2h;

function preload() {
    video = createVideo('media/cell.mov');
    video.hide();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  v_w2h = video.width / video.height;
  noCursor();
}

function draw() {
  background(0)
  fill(255);

  if (flash) {
    let f = frameCount % floor(FLASH_INTERVAL * flash_mult);
    if (f > 0 && f < FLASH_HOLD) fill(FLASH_BG);
  }

  let f = counter % (TURN_INTERVAL * 4);
  if (f < TURN_INTERVAL * 1) rect(0, 0, REAL_WIDTH / 2, height);
  else if (f < TURN_INTERVAL * 2) rect(0, 0, REAL_WIDTH, height / 2);
  else if (f < TURN_INTERVAL * 3) rect(REAL_WIDTH / 2, 0, REAL_WIDTH / 2, height);
  else rect(0, height / 2, REAL_WIDTH, height / 2);
  if(auto) counter++;

  // Show video
  if(cell) {
    background('blue');
    push();
    imageMode(CENTER);
    translate(REAL_WIDTH/2, height/2);
    rotate(PI/2);
    image(video, 0, 0, width * v_w2h, height);
    pop();
  }
}

function keyPressed() {
  switch (key) {
    case 'v':
      cell = !cell;
      if(cell) {
        video.loop();
        console.log(cell ? 'cell' : 'no cell');
      }
      break;
    case 'f':
      flash = !flash;
      if(flash) {
        flash_mult *= 0.9;
        flash_mult = max(flash_mult, 0.1);
      }
      console.log('flash on?', flash);
      break;
    case 'a':
      auto = !auto;
      console.log('auto', auto);
      break;
  }

  switch (keyCode) {
    case SHIFT:
      counter += TURN_INTERVAL;
      break;
    case LEFT_ARROW:
      counter = 0;
      break;
    case UP_ARROW:
      counter = TURN_INTERVAL;
      break;
    case RIGHT_ARROW:
      counter = TURN_INTERVAL * 2;
      break;
    case DOWN_ARROW:
      counter = TURN_INTERVAL * 3;
      break;
  }
}


