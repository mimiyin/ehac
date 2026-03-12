// Sound samples
let sounds = [];
// Number of samples to load
let NUM = 7;
let FULL_CIRCLE = 360;
let r;
let cx, cy;
let a = 0;
let aspeed = 8;

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
    new Voice(sounds[3], SCALES.BLUES, 2, 0.5, "rising", "static", [0], 0.1, "orange"),
    new Voice(sounds[1], SCALES.BLUES, 1, 2, "falling", "linear", [180, 240], 0.01, "red"),
    new Voice(sounds[2], SCALES.CHROMATIC, 2, 1, "falling", "varied", [30, 60, 90, 120, 150, 180, 210, 270], 0.01, "green"),
    new Voice(sounds[4], SCALES.CHROMATIC, 1, 1, "rising", "periodic", [70, 130, 270], 0.01, 'blue'),
    //new Voice(sounds[5], [30, 200, 330], 0.05, 'turquoise'),
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
