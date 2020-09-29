import * as PIXI from 'pixi.js';

class Game {
  constructor ({ resources, ui, sound, reels, fireworks }) {
    this.resources = resources;
    this.sound = sound;
    this.ui = ui;
    this.reels = reels;
    this.fireworks = fireworks;

    this.prize = 0;
    this.score = 0;
  }

  init ({ symbols, prize }) {
    let reelTextures = [];
    symbols.forEach(s => {
      reelTextures.push(this.resources[s].texture)
    });
    this.reels.create(reelTextures);

    this.prize = prize;
  }

  spinReels () {
    if (this.reels.isSpinning) return;

    this.ui.pressButton(true);
    this.ui.drawStatusText('Good Luck!');

    this.sound.stopAllResultSounds();
    this.sound.playSound('reel');

    let after = () => {
      this.ui.pressButton(false);
      this.sound.stopSound('reel', 0.5);
      this.testResults();
    }

    this.reels.start(after);
  }

  testResults () {
    const result = this.reels.getResults();

    let resultSound = 'loss';

    switch (result) {
      case 3:
        resultSound = 'bigwin';
        this.updateScore(3);
        this.ui.drawStatusText('Big Win!');
        this.fireworks.startTheShow();
        break;
      case 2:
        resultSound = 'win';
        this.updateScore(1);
        this.ui.drawStatusText('Winner!');
        break;
      default:
        this.updateScore(-1);
        this.ui.drawStatusText('Too bad...');
        break;
    }
    setTimeout(() => {
      this.sound.playSound(resultSound);
    }, 200);

  }

  updateScore (factor) {
    this.score += factor * this.prize;
    this.ui.drawScore(this.score);
  }
}

export default Game;