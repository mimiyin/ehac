// Array of oscillators
let notes = [];

let keys = {
  1 : 0,
  2 : 1,
  3 : 2,
  4 : 3,
  5 : 4,
  6 : 5,
  7 : 6,
  8 : 7,
  9 : 8,
  0 : 9,
  '-' : 10,
  '=' : 11,
  '`' : 12
}

let ratios = [];
// Western Diatonic Major Ratios
//ratios = [1, 1.125, 1.25, 1.34, 1.5, 1.67, 1.875, 2];
// Western Diatonic Minor Ratios
//ratios = [1, 1.125, 1.2, 1.34, 1.5, 1.6, 1.875, 2];
// Western Chromatic  Ratios
ratios = [1, 1.067, 1.125, 1.2, 1.25, 1.34, 1.42, 1.5, 1.6, 1.67, 1.78, 1.875, 2];

// Pentatonic Scale
//ratios = [1, 1.125, 1.25, 1.5, 1.67, 2];
// Arabic / Indian Scale
//ratios = [1, 1.067, 1.25, 1.34, 1.5, 1.6, 1.875, 2];

// Base frequency
let BASE = 300;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  // Loop through all the oscillators
  for (let n = notes.length - 1; n >= 0; n--) {

    let note = notes[n];
    // Get the oscillator's volume level
    let volume = note.amp().value;

    // If it's reached 1, fade it out over 5 seconds
    if (volume >= 1) note.setVolume(0, 15);
    // If it's fully faded out...
    else if (volume <= 0) {
      // Stop the oscillator
      note.stop();
      // Remove it from the array
      notes.splice(n, 1);
    }
  }
}

// Create a new oscillator on each keypress
function keyPressed() {
  console.log(keys[key]);
  loadSound('note.wav', (note) => {
    play(note, keys[key]);
  });
}

function play (note, key) {
    console.log("hello", key);
    let f = ratios[key] * 0.5; //random(ratios) * 0.5;
    note.rate(f);
    // Fade it in over 5 seconds
    note.setVolume(1, 10);
    note.loop();

    setTimeout(() => {
      note.setVolume(0, 5);
      setTimeout(() => {
        note = null;
      }, 5 * 1000)
    }, random(3) * 1000);
  }