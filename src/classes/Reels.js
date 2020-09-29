import Reel from './Reel.js';

export default class Reels {
  constructor () {
    this.count = 3;
    this.reels = [];
    this.isSpinning = false;
  }

  create (textures) {
    for (let i = 0; i < this.count; i++) {
      this.reels.push(new Reel(textures));
    }
  }

  start (after) {
    this.isSpinning = true;

    let count = Math.ceil(Math.random() * 5);

    this.reels.forEach((r, index, arr) => {
      let extra = Math.ceil(Math.random() * 5 + index * 5);
      let onComplete = () => {
        if (index === arr.length - 1) {
          this.isSpinning = false;
          after();
        }
      }
      r.spin(count + extra, onComplete);
    })
  }

  getResults () {
    let results = {};
    this.reels.forEach(r => {
      let key = r.getTextureID();
      results[key] = (results[key] || 0) + 1;
    });
    return Math.max(...Object.values(results));
  }
}