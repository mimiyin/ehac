// Sound samples
let sounds = [];
// Number of samples to load
let NUM = 7;
let FULL_CIRCLE = 360;
let r;
let cx, cy;
let a = 0;
let aspeed = 10;

// Beats
let voices = [];

// Rotate?
let rotate = false;

function preload() {
  // Load all the sounds
  for (let i = 0; i < NUM; i++) {
    sounds.push(loadSound("data/bass_note.wav"));
  }
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
    new Voice(sounds[0], [0, 180], 0, "red"),
    new Voice(sounds[1], [0, 90, 150], 0.15, "green"),
    new Voice(sounds[1], [70, 130, 240], 0.1, 'blue'),
    new Voice(sounds[5], [30, 200, 330], 0.2, 'turquoise'),
  ];
}

function draw() {
  background(255);

  // Instructions
  text("Use arrow keys to adjust temp and number keys to (un)mute voices", 10, 20);

  // Translate whole thing to center
  translate(cx, cy);
  
  // Run the voices
  for (let voice of voices) {
    // Skip over last voice until you want to play it
    if(rotate) voice.rotate();
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
      rotate = !rotate;
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
      voices[key].mute();
      }
      catch(err) {
        console.log("No voice at this key:", key);
      }
      break;
  }

  // Constrain the speed
  aspeed = constrain(aspeed, 1, 15);

  
  


}
