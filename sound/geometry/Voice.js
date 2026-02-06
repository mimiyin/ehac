// Blues Scale Ratios
let ratios = [1, 1.2, 1.34, 1.42, 1.5, 1.78];

class Voice {
  constructor(sound, beats, aspeed, col) {
    this.sound = sound;
    this.beats = beats;
    this.aspeed = aspeed;
    this.col = color(col);
    this.unmute = false;
    this.reset();
  }
  
  reset() {
    this.t = random(360);
    this.b = 0;
    this.beat = this.beats[this.b];    
  }

  mute() {
    this.unmute = !this.unmute;
  }
  
  rotate() {
    for(let b in this.beats) {
      let beat = this.beats[b];
      beat += this.aspeed;
      this.beats[b] = beat;
    }
  }
  
  play(a) {    
    if(abs(a - this.beat) < aspeed) {
      this.t += 15;
      let r = floor((sin(this.t) + 1) * ratios.length/2);
      let ratio = ratios[r];
      this.sound.rate(ratio);
      if(this.unmute) this.sound.play();
      this.b++;
      this.b %= this.beats.length;
      this.beat = this.beats[this.b];
    }
  }
  
  display() {
    this.col.setAlpha(this.unmute ? 255 : 100);
    fill(this.col);
    for(let b in this.beats) {
      let beat = this.beats[b];
      let x = cos(beat) * r;
      let y = sin(beat) * r;
      ellipse(x, y, b == this.b ? 80 : 20);
    }
  }
}