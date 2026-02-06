let bass1, bass2, note;
let t1 = 0;
let t2 = 0;
let t3 = 0;
let mx = 8;

let ratios = [1, 1.2, 1.34, 1.42, 1.5, 1.78];

let sounds = [];

function preload() {

  bass1 = loadSound("loop1.wav");
  bass2 = loadSound("loop2.wav");
  note = loadSound("bass_note.wav");

  bass2.amp(0.5);

  sounds = [
    {
      sample: bass1,
      play: play1
    },
    {
      sample: bass2,
      play: play2
    },
    {
      sample: note,
      play: play3
    }
  ]


}
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  if(frameCount % 60 == 1) {
    mx+=sin(frameCount*0.1)*0.5;
    console.log('mx: ', floor(mx));

    //play1();
    play3();
  }

  if(frameCount % 20 == 1) {
    play3();
  }

  if(frameCount % 30 == 1) {
    play3();
  }

  if(frameCount % 60 == 50) {
    //play2();
  }
  let h = 0;
  let beat = 100;
  fill(255);
  for (let s = 0; s < mx; s++) {
    // Make it more random
    //beat += floor(random(s*sounds.length));
    // Divide beat by s
    if (frameCount % (beat / (s + 1)) == 1) {
      //sounds[2].play();
      let y = s * h;
      //rect(x, y, 5, 10);
    }
  }
}

function mousePressed() {

}

function keyPressed() {
  switch (keyCode) {
    case RETURN || ENTER:
      play1();
      break;
    case SHIFT:
      play2();
      break;
    case CONTROL:
      play3();
      break;
    case UP_ARROW:
      break;
    case DOWN_ARROW:
      break;
  }
}

function play1() {
  t1 += 0.01;
  let ts1 = floor((sin(t1) + 1) * random(10)) * 0.7;
  console.log('1', ts1);
  bass1.play();
  bass1.jump(ts1, 0.7);
}

function play2() {
  t2 += 0.01;
  let ts2 = floor((sin(t2) + 1) * random(10)) * 0.7;
  console.log('2', ts2);
  bass2.play();
  bass2.jump(ts2, 0.7);
}

function play3() {
  t3 += random(1) > 0.5 ? 1 : 1;
  let r = floor((sin(t3) + 1) * ratios.length/2);
  let ratio = ratios[r] * 0.5;
  console.log('3', r);
  note.rate(ratio);
  note.play();
}