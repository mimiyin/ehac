class Voice {
  constructor(sound, ratios, octaves, oct, dir, shape, beats, aspeed, col) {
    this.ratios = this.scale(ratios, octaves, oct, dir);
    this.shape = shape;
    this.sound = sound;
    this.beats = beats;
    this.aspeed = aspeed;
    this.col = color(col);
    this.unmute = false;
    this.reset();
  }

  reset() {
    this.revolving = false;
    this.b = 0;
    this.beat = this.beats[this.b];
  }

  mute() {
    this.unmute = !this.unmute;
  }

  revolve() {
    if (!this.unmute) return;
    this.revolving = !this.revolving;
  }

  _revolve() {
    for (let b in this.beats) {
      let beat = this.beats[b];
      beat += (b + 1) * this.aspeed;
      beat %= 360;
      this.beats[b] = beat;
    }
    // Re-order the beats
    this.beats.sort();
  }

  scale(_ratios, octaves, oct, dir) {
    let ratios = [_ratios[0]];
    for (let o = 1; o <= octaves; o++) {
      for (let r = 1; r < _ratios.length; r++) {
        let ratio = _ratios[r] * o * oct;
        ratios.push(ratio);
      }
    }
    // Halve everything if more than 1 octave
    if (octaves > 1) ratios.forEach((v, k) => { ratios[k] = v / 2 });

    return dir == "falling" ? ratios.reverse() : ratios;
  }

  next(a) {
    let d = 360;
    for(let b in this.beats) {
      let beat = this.beats[b];
      let _d = abs(a-beat);
      if(_d < d) {
        this.b = b;
        this.beat = beat;
        d = _d;
      }
    }
  }

  noisy() {
    return floor(noise(this.beat + (frameCount%360)) * (this.ratios.length));
  }

  melody(shape) {
    switch(shape) {
      case 'static' :
        return 0;
      case 'linear':
        return floor(map(this.beat, 0, 360, 0, this.ratios.length));
      case 'random':
        return floor(random(0, this.ratios.length));
      case 'noisy':
        return this.noisy();
      case 'varied':
        return random(1) > 0.3 ? floor(random(0, this.ratios.length)) : this.noisy();
      case 'periodic':
        return floor((cos(this.beat + frameCount%360) + 1) * (this.ratios.length / 2));
    }
  }

  play(a) {

    // Set the next beat
    this.next(a);

    if (abs(a - this.beat) < aspeed) {
      let r = this.melody(this.shape);
      let ratio = this.ratios[r];
      this.sound.rate(ratio);
      if (this.unmute) this.sound.play();
    }

    if (this.revolving) this._revolve();
  }

  display() {
    this.col.setAlpha(this.unmute ? 255 : 16);
    fill(this.col);
    

    for (let b in this.beats) {
      let beat = this.beats[b];
      let x = cos(beat) * r;
      let y = sin(beat) * r;
      ellipse(x, y, b == this.b ? 80 : 20);

      // push();
      // translate(x,y);
      // rotate(90);
      // textSize(20);
      // textAlign(CENTER, CENTER);
      // fill(255);
      // text(b, 0, 0);
      // pop();
    }
  
  }
}