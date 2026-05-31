let bass1, bass2, note;
let t = 0;

let ratios = [1, 1.2, 1.34, 1.42, 1.5, 1.78];
let states = [];

let sounds = [];
let s = 'q';
let sb = 100;

let x = 0;
let h = 0;
const NUM = 5;

function preload() {

  bass1 = loadSound("loop1.wav");
  bass2 = loadSound("loop2.wav");
  note = loadSound("bass_note.wav");

  bass2.amp(0.5);

  sounds = { 'q' : bass1, 'w' : bass2 }


}
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Start everything off
  for(let n = 0; n < NUM; n++) {
    states.push(false);
  }

  // Recording
  init_rec();

  h = height / NUM;
  background(0);
}

function draw() {
  x++;
  if (x > width) {
    background(0);
    x = 0;
  }

  let y = 0;

  if (states[0] && frameCount % 120 == 1) {
    play();
    rect(x, y, 5, h/2);
  }
  y += h;

  if (states[1] && frameCount % 40 == 1) {
    play();
    rect(x, y, 5, h/2);
  }
  y += h;

  if (states[2] && frameCount % 60 == 1) {
    play();
    rect(x, y, 5, h/2);
  }
  y += h;

  if (states[3] && frameCount % 100 == 1) {
    play();
    rect(x, y, 5, h/2);
  }
  y += h;

  if (states[4] && frameCount % 120 == sb) {
    sb-=10;
    if (sb < 0) sb = 100;
    play()
    rect(x, y, 5, h/2);
  }
  y += h;

  // let beat = 200;
  // y = 0;
  // fill(255);
  // for (let s = 0; s < 5; s++) {
  //   // Make it more random
  //   //beat += floor(random(s*sounds.length));
  //   // Divide beat by s
  //   if (frameCount % (beat / (s + 1)) == 1) {
  //     note.play();
  //     note.rate(s/5);
  //     let y = s * h;
  //     rect(x, y, 5, h/2);
  //     y += h;

  //   }
  // }
}

function mousePressed() {

}

function keyPressed() {

  switch (key) {
    case 'r':
      rec('bass');
      break;
    case 'q':
      s = 'q';
      t = 0;
      return;
    case 'w':
      s = 'w';
      t = 0;
      return;
  }

  if(typeof int(key) == 'number') {
    states[key] = !states[key]; 
    console.log(states);
    return;
  }

  

  console.log('s', s, sounds[s]);
}

function play() {
  t += 0.5;
  if (t > sounds[s].duration() - 3) t = 0;
  sounds[s].play(0, 1, 1, t, 2);
}

function play3() {
  t3 += random(1) > 0.5 ? 1 : 1;
  let r = floor((sin(t3) + 1) * ratios.length / 2);
  let ratio = ratios[r] * 0.5;
  console.log('3', r);
  note.rate(ratio);
  note.play();
}