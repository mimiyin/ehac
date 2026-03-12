console.log("POZYX code");

// Auto-pilot
let pozyx_on = false;

// Sockets
let socket = io();
socket.on('connect', function () {
  console.log("HEY, I'VE CONNECTED: ", socket.id);
});

// pozyx
let tags = {};
let tags2MoversLookup = {
  10002038: 'A',
  10002092: 'B',
}
const XMULT = 0.05;
const YMULT = 0.05;
const X_OFF = 0;
const Y_OFF = 250;

// Listen for data coming from the server
function pozyx() {
  socket.on('pozyx', function (message) {
    //return;
    // Log the data
    //console.log('Received message: ', message);
    // Draw a circle at the y-position of the other user
    let tag = message[0];
    let data = tag.data//;
    let id = tag.tagId;
    let ts = tag.ts;

    if (data) {
      if (data.coordinates) {
        let x = data.coordinates.x / 20;
        let y = (data.coordinates.y / 20) + 250;
        if (id in tags) tags[id] = { x: x, y: y, ts: ts };
        if (poxyz) {
          let m = tags2MoversLookup[id];
          movers[m] = calc(x, y);
        }
      }
    }
  });
}

// Map poxyz to projection
function calc(x, y) {
  return { x: x * XMULT + X_OFF, y: y * YMULT + Y_OFF }
}

// Turn pozyx on/off
function toggle_pozyx(key) {
  switch (key) {
    case 'p':
      pozyx_on = !pozyx_on;
      break;
  }
}

// Initial position of mover
function init_movers() {
   return {
    A: { x: width * 0.45, y: height * 0.5 },
    B: { x: width * 0.55, y: height * 0.5 }
  }
}

// Draw people
function draw_movers(movers) {
  fill('red');
  ellipse(movers.A.x, movers.A.y, 10, 10);
  ellipse(movers.B.x, movers.B.y, 10, 10);
}

// Calculate midpoint between movers
function midpoint(movers) {
  return { x : (movers.A.x + movers.B.x) / 2, y: (movers.A.y + movers.B.y) / 2 }
}

// Calculate distance between movers
function distance(movers) {
  return dist(movers.A.x, movers.A.y, movers.B.x, movers.B.y);
}

//Manually reposition people
function reposition(movers) {
  let d1 = dist(mouseX, mouseY, movers.A.x, movers.A.y);
  let d2 = dist(mouseX, mouseY, movers.B.x, movers.B.y);
  if (d1 < d2) {
    movers.A.x = mouseX;
    movers.A.y = mouseY;
  } else {
    movers.B.x = mouseX;
    movers.B.y = mouseY;
  }
  return movers;
}