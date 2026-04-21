// --- Move Types ---
// 'teleport' — instant snap
// 'linear'   — animate linearly over moveDuration
// 'ease'     — animate with ease-in-out over moveDuration

// --- Movement Options ---
// 'left', 'right' — horizontal movement
// 'up', 'down'    — vertical movement (placeholder)
// 'stay'          — no movement

class Mover {
  constructor(col, row, color, moveType = 'teleport', movementOptions = ['left', 'right']) {
    this.col = col;
    this.row = row;
    this.color = color;
    this.moveType = moveType;
    this.movementOptions = movementOptions;

    // Configurable timing (ms)
    this.moveDuration = 500;   // animation length for linear/ease (ignored for teleport)
    this.responseDelay = 0;     // delay before move starts (0 for human, e.g. 500 for computer)

    // Animation state
    this._fromCol = col;
    this._fromRow = row;
    this._toCol = col;
    this._toRow = row;
    this._moveStartTime = 0;
    this._moving = false;
  }

  // Returns 0→1 animation progress, applying easing if needed
  _animProgress() {
    if (this.moveDuration <= 0) return 1;
    let elapsed = millis() - this._moveStartTime;
    let t = constrain(elapsed / this.moveDuration, 0, 1);

    if (this.moveType === 'ease') {
      // Cubic ease-in-out
      t = t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2;
    }
    // 'linear' uses t as-is
    return t;
  }

  // Call every frame to advance animation
  update() {
    if (!this._moving) return;
    if (this._animProgress() >= 1) {
      this.col = this._toCol;
      this.row = this._toRow;
      this._moving = false;
    }
  }

  isMoving() {
    return this._moving;
  }

  display(w, h) {
    push();
    fill(this.color);
    noStroke();

    let dc, dr;
    if (this._moving) {
      let t = this._animProgress();
      dc = lerp(this._fromCol, this._toCol, t);
      dr = lerp(this._fromRow, this._toRow, t);
    } else {
      dc = this.col;
      dr = this.row;
    }

    let cx = dc * w + w / 2;
    let cy = dr * h + h / 2;
    let r = min(w, h) * 0.35;
    ellipse(cx, cy, r * 2, r * 2);
    pop();
  }

  moveTo(newCol, newRow) {
    // If still animating, snap to destination first
    if (this._moving) {
      this.col = this._toCol;
      this.row = this._toRow;
      this._moving = false;
    }

    if (this.moveType === 'teleport') {
      this.col = newCol;
      this.row = newRow;
    } else {
      // Start animation (linear or ease)
      this._fromCol = this.col;
      this._fromRow = this.row;
      this._toCol = newCol;
      this._toRow = newRow;
      this._moveStartTime = millis();
      this._moving = true;
    }
  }
}
