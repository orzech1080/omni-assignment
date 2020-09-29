export default class Sound {
  constructor () {
    this.sounds = {
      reel: new Audio('assets/sounds/slot-machine.mp3'),
      loss: new Audio('assets/sounds/Downer01.mp3'),
      win: new Audio('assets/sounds/Coin01.mp3'),
      bigwin: new Audio('assets/sounds/Rise03.mp3'),
    };
  }

  playSound (name) {
    this.sounds[name].play();
  }

  stopSound (name, delay = 0) {
    const stop = () => {
      this.sounds[name].pause();
      this.sounds[name].currentTime = 0;
    }

    if (!delay) {
      stop();
    } else {
      setTimeout(stop, delay * 1000);
    }
  }

  stopAllResultSounds () {
    this.stopSound('win');
    this.stopSound('bigwin');
    this.stopSound('loss');
  }
}