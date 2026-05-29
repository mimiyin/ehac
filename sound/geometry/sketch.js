// Sound samples
let sounds = [];
// Number of samples to load
let NUM = 7;
let FULL_CIRCLE = 360;
let r;
let cx, cy;
let a = 0;
let aspeed = 10 ;

// Beats
let v = 0;
let voices = [];

// Rotate?
let revolve = false;

function preload() {
  // Load all the sounds
  sounds[0] = loadSound("data/2.mp3");
  sounds[1] = loadSound("data/bass_note.wav");
  sounds[2] = loadSound("data/bass_note.wav");
  sounds[3] = loadSound("data/bass_note.wav");
  sounds[4] = loadSound("data/bass_note.wav");
  sounds[5] = loadSound("data/cowbell.wav");
  sounds[6] = loadSound("data/cowbell.wav");
  
  
}

function setup() {
  frameRate(30);
  createCanvas(windowWidth, windowHeight);
  r = height / 2.5;
  cx = width / 2;
  cy = height / 2;

  angleMode(DEGREES);
  textSize(16);

  // Makes voices with following parameters:
  // soundfile, array of beats, max random rotation speed, color
  voices = [
    new Voice(sounds[3], SCALES.PLUNGE, 1, 0.34, "falling", 0, [0], 0.05, "red"),
    new Voice(sounds[3], SCALES.PLUNGE, 1, 0.34, "falling", 0, [0], 0.02, "royalblue"),
    new Voice(sounds[3], SCALES.PLUNGE, 1, 0.34, "falling", 1, [75], -0.03, "blue"),
    new Voice(sounds[3], SCALES.PLUNGE, 1, 0.34, "falling", 2, [140], 0.04, "mediumblue"),
    new Voice(sounds[3], SCALES.PLUNGE, 1, 0.34, "falling", 3, [210], 0.05, "darkblue"),
    new Voice(sounds[3], SCALES.PLUNGE, 1, 0.34, "falling", "linear", [0, 75, 140, 210], -0.02, "orange"),
    new Voice(sounds[3], SCALES.PLUNGE, 1, 0.34, "falling", "linear", [0, 75, 140, 210], 0.04, "darkorange"),
  ];
}

function draw() {
  background(255);

  // Instructions
  text("Current voice: " + v, 10, 20);

  // Translate whole thing to center
  translate(cx, cy);
  rotate(-90);
  
  // Run the voices
  for (let voice of voices) {
    // Skip over last voice until you want to play it
    if(revolve) voice.revolve();
    voice.play(a);
    voice.display();
  }

  // Display circle
  noFill();
  stroke("black");
  strokeWeight(1);
  ellipse(0, 0, r * 2, r * 2);

  // Display playhead
  noStroke();
  fill("black");
  let x = cos(a) * r;
  let y = sin(a) * r;
  ellipse(x, y, 20, 20);

  // Move the playhead (in DEGREES, not radians)
  a += aspeed;  
  // Wrap around
  a %= FULL_CIRCLE;

}

function keyPressed() {

  switch(keyCode) {
    case 32:
      voices[v].mute();
      break;
    case RETURN:
      voices[v].revolve();
      break;
    case UP_ARROW:
      aspeed++;
      break;
    case DOWN_ARROW:
      aspeed--;
      break;
    case RIGHT_ARROW:
      aspeed+=0.1;
      break;
    case LEFT_ARROW:
      aspeed-=0.1;
      break;
    default:
      try {
      // Turn on off voices
      if(Number.isFinite(+key)) v = key;
        v = key;
      }
      catch(err) {
        console.log("No voice at this key:", key);
      }
      break;
  }

  // Constrain the speed
  aspeed = constrain(aspeed, 1, 15);

  
  


}
