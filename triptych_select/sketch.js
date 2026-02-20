// Set speeds
const SLOW = 0.0001;
const MEDIUM = 0.001;
const FAST = 0.05;

// Set layout ratios
const TRIPTYCH = 0.34;
const SLIVER = 0.49;
const DESERT = 0.1;

// Narrative
const PROGRESSIONS = {
  FILE: {
    PROCESS: [SLOW, SLOW],
    FOLLOW: [MEDIUM, MEDIUM],
    VANISH: [FAST, FAST],
    OVERTAKE: [MEDIUM, SLOW],
    WIPEOUT: [FAST, MEDIUM],
    DEPART: [SLOW, MEDIUM],
    DUST: [SLOW, FAST]
  },
  EXPAND: {
    PROCESS: [-SLOW, SLOW],
    LEAVE: [-MEDIUM, MEDIUM],
    VANISH: [-FAST, FAST],
    DEPART: [-SLOW, MEDIUM],
    RUNAWAY: [-MEDIUM, FAST],
    DESERT: [-SLOW, FAST]
  },
  SHRINK: {
    PROCESS: [SLOW, -SLOW],
    APPROACH: [MEDIUM, -MEDIUM],
    VANISH: [FAST, -FAST],
    ACCOST: [SLOW, -MEDIUM],
    RUSH: [SLOW, -FAST],
  }
}

// Sets
const SCORE = {
  1: {
    layout: SLIVER,
    progression: PROGRESSIONS.FILE.FOLLOW,
    dir : 1,
    fade_time: 3,
    hold_time: 1
  },
  2: {
    layout: TRIPTYCH,
    progression: PROGRESSIONS.SHRINK.APPROACH,
    dir : 1,
    fade_time: 5,
    hold_time: 3
  }
}

// Initial settings
let settings = SCORE[1];

// Animation
let b1, b2;
let b1speed, b2speed;
let low = 0;
let high = 255;
let a = low;
let aspeed;
let m;
let bg = high;
let limit;
let anchor;
let go = true;
let debug = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  noCursor();
  randomSeed(0);
  reset();
}

function calc_speed(duration, range) {
  return range / (duration * 60);
}

function calc_margin(duration, speed) {
  return (duration * 60) * speed;
}

function reset() {
  console.log("RESET");

  // Reset orientation
  limit = height;
  anchor = width;

  // Reset animation variables
  a = low;
  aspeed = calc_speed(settings.fade_time, 255);
  m = calc_margin(settings.hold_time, aspeed);
  b1 = limit * settings.layout;
  b2 = limit - b1;
  b1speed = settings.progression[0] * height * settings.dir;
  b2speed = settings.progression[1] * height * settings.dir;

  console.log("Speeds: " + b1speed, b2speed);
}

function draw() {
  background(bg);
  // Is the background white or black?
  // Make it the oppposite color
  fill(bg > low ? low : high, a);
  rect(0, 0, anchor, b1);
  rect(0, b2, anchor, limit - b2);
  a += aspeed;
  // If fully faded in
  if (a > high + m || a < low - m) {
    b1 += b1speed;
    b2 += b2speed;
    if ((b1 > limit || b1 < 0) && (b2 > limit || b2 < 0)) {
      if (b1 > limit || b2 < 0) {
        // If the background was white, make it black
        bg = bg > low ? low : high;
        console.log(bg);
      }
      reset();
    }
  }

  if (debug) {
    textAlign(RIGHT, BOTTOM);
    textSize(24);
    fill('red');
    text("b1: " + nfs(b1, 0, 2) + "\tb2: " + nfs(b2, 0, 2));
  }
}

function keyPressed() {
  if (typeof +key === 'number') {    
    settings = SCORE[key];
    reset();
    return;
  }
  switch (keyCode) {
    case SHIFT:
      debug = !debug;
      break;
    case ENTER:
      reset();
      break;
    case 32:
      go = !go;
      if (go) loop();
      else noLoop();
      break;
  }
}
