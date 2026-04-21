// --- Grid ---
const COLS = 10;
const ROWS = 10;
let w, h;

// --- Directions ---
const DIRECTIONS = {
  left:  { dc: -1, dr: 0 },
  right: { dc:  1, dr: 0 },
  up:    { dc:  0, dr: -1 },
  down:  { dc:  0, dr:  1 },
  stay:  { dc:  0, dr: 0 },
};

// --- Movers ---
let humanMover;
let computerMover;
let lastHumanDir = null;

// --- Game State ---
// 'idle' → 'human-moving' → 'computer-delay' → 'computer-moving' → 'idle'
let gameState = 'idle';
let pendingComputerDir = null;
let computerDelayStart = 0;

// --- Response Types (low-level) ---
// Each returns a dirKey or null given (computer, human, lastHumanDir)
const responseTypes = {
  random(computer, human, lastHumanDir) {
    let validMoves = computer.movementOptions.filter(dir => canMove(computer, dir));
    if (validMoves.length === 0) return null;
    return random(validMoves);
  },

  mimic(computer, human, lastHumanDir) {
    if (lastHumanDir && canMove(computer, lastHumanDir)) {
      return lastHumanDir;
    }
    // Fallback: if mimic isn't possible (boundary), pick random
    let validMoves = computer.movementOptions.filter(dir => canMove(computer, dir));
    if (validMoves.length === 0) return null;
    return random(validMoves);
  },
};

// --- Strategies (high-level planning) ---
// Each strategy: { name, memoryWindow, memory[], decide(computer, human, lastHumanDir) }
// decide() picks a response type based on memory, executes it, and returns the dirKey.
const strategies = [
  {
    name: 'always-random',
    memoryWindow: 0,
    memory: [],
    decide(computer, human, lastHumanDir) {
      return responseTypes.random(computer, human, lastHumanDir);
    }
  },
  {
    name: 'always-mimic',
    memoryWindow: 0,
    memory: [],
    decide(computer, human, lastHumanDir) {
      return responseTypes.mimic(computer, human, lastHumanDir);
    }
  },
  {
    name: 'elastic-mimic',
    memoryWindow: 10,
    memory: new Array(10).fill('mimic'), // initialized with 10 mimic
    decide(computer, human, lastHumanDir) {
      // Calculate mimic ratio in the memory window
      let mimicCount = this.memory.filter(r => r === 'mimic').length;
      let mimicRatio = mimicCount / this.memoryWindow;

      // Determine response type based on mimic ratio
      let chosenType = 'mimic';
      if (mimicRatio <= 0.5) {
        // Below 50% mimic → always mimic
        chosenType = 'mimic';
      } else if (mimicRatio > 0.5) {
        // Interpolate: 50% mimic → 50% random chance, 100% mimic → 90% random chance
        let randomChance = map(mimicRatio, 0.5, 1.0, 0.5, 0.9);
        if (random() < randomChance) {
          chosenType = 'random';
        }
      }

      console.log(`Memory: [${this.memory.join(', ')}], Mimic Ratio: ${mimicRatio.toFixed(2)}, Chosen: ${chosenType}`);
      // Execute the chosen response type
      let dirKey = responseTypes[chosenType](computer, human, lastHumanDir);

      // Update memory window
      this.memory.push(chosenType);
      if (this.memory.length > this.memoryWindow) {
        this.memory.shift();
      }

      return dirKey;
    }
  },
];
let currentStrategyIndex = 0;

// --- Helpers ---
function canMove(mover, dirKey) {
  let d = DIRECTIONS[dirKey];
  if (!d) return false;
  let nc = mover.col + d.dc;
  let nr = mover.row + d.dr;
  return nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS;
}

function applyMove(mover, dirKey) {
  let d = DIRECTIONS[dirKey];
  mover.moveTo(mover.col + d.dc, mover.row + d.dr);
}

// --- p5.js ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  w = width / COLS;
  h = height / ROWS;
  colorMode(HSB);

  // Human: row 6, col 6 (1-indexed) → [5, 5] (0-indexed)
  humanMover = new Mover(5, 5, color(0, 0, 100), 'ease', ['left', 'right', 'stay']);
  humanMover.responseDelay = 0;

  // Computer: row 7, col 6 (1-indexed) → [5, 6] (0-indexed)
  computerMover = new Mover(5, 6, color(0, 0, 0), 'ease', ['left', 'right', 'stay']);
  computerMover.responseDelay = 500;  // 0.5s reaction delay

  console.log('Strategy:', strategies[currentStrategyIndex].name);
}

function draw() {
  background(0);
  drawGrid();

  // Update animations
  humanMover.update();
  computerMover.update();

  // --- State machine ---
  if (gameState === 'human-moving' && !humanMover.isMoving()) {
    // Human animation done → start computer delay
    gameState = 'computer-delay';
    computerDelayStart = millis();
    let strategy = strategies[currentStrategyIndex];
    pendingComputerDir = strategy.decide(computerMover, humanMover, lastHumanDir);
  }

  if (gameState === 'computer-delay') {
    if (millis() - computerDelayStart >= computerMover.responseDelay) {
      if (pendingComputerDir) {
        applyMove(computerMover, pendingComputerDir);
        pendingComputerDir = null;
        gameState = 'computer-moving';
      } else {
        gameState = 'idle';
      }
    }
  }

  if (gameState === 'computer-moving' && !computerMover.isMoving()) {
    gameState = 'idle';
  }

  humanMover.display(w, h);
  computerMover.display(w, h);
}

function drawGrid() {
  for (let c = 0; c < COLS; c++) {
    let x = c * w;
    for (let r = 0; r < ROWS; r++) {
      let y = r * h;
      fill((c + r) % 2 == 0 ? 360/r : 0, 60, 70);
      rect(x, y, w, h);
    }
  }
}

function keyPressed() {
  // Cycle strategies with 'S'
  if (key === 's' || key === 'S') {
    currentStrategyIndex = (currentStrategyIndex + 1) % strategies.length;
    console.log('Strategy:', strategies[currentStrategyIndex].name);
    return;
  }

  if (gameState !== 'idle') return;

  let dirKey = null;
  if (keyCode === LEFT_ARROW) dirKey = 'left';
  if (keyCode === RIGHT_ARROW) dirKey = 'right';
  if (key === ' ') dirKey = 'stay';

  if (!dirKey) return;
  if (!canMove(humanMover, dirKey)) return;

  // Human move
  applyMove(humanMover, dirKey);
  lastHumanDir = dirKey;

  if (humanMover.isMoving()) {
    // Animated move — wait for it to finish before computer acts
    gameState = 'human-moving';
  } else {
    // Teleport — skip straight to computer delay
    gameState = 'computer-delay';
    computerDelayStart = millis();
    let strategy = strategies[currentStrategyIndex];
    pendingComputerDir = strategy.decide(computerMover, humanMover, lastHumanDir);
  }
}