import './main.scss';
import * as PIXI from 'pixi.js'
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";
import FontFaceObserver from 'fontfaceobserver';

import UI from './classes/UI.js';
import Fireworks from './classes/Fireworks.js';
import Sound from './classes/Sound.js';
import Reels from './classes/Reels.js';
import Game from './classes/Game';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const app = new PIXI.Application({
  view: document.getElementById("c"),
  width: window.innerWidth,
  height: window.innerHeight,
  background: 0xCCCCCC,
  antialias: true,
});


PIXI.Loader.shared
  .add('blue', 'assets/symbols/blue.png')
  .add('diamond', 'assets/symbols/diamond.png')
  .add('gold', 'assets/symbols/gold.png')
  .add('green', 'assets/symbols/green.png')
  .add('orange', 'assets/symbols/orange.png')
  .add('rainbow', 'assets/symbols/rainbow.png')
  .add('red', 'assets/symbols/red.png')
  .add('silver', 'assets/symbols/silver.png')
  .add('violet', 'assets/symbols/violet.png')
  .add('background', 'assets/bg.png')
  .add('dot', 'assets/dot.png')
  .load(waitForFonts);

const scale = app.view.width / 8;

let ui = new UI(scale, app.view.width, app.view.height);
let sound = new Sound();
let reels = new Reels();
let game;

function waitForFonts (loader, resources) {
  var font = new FontFaceObserver('Yellowtail');
  font.load(null, 5000).then(() => {
    setup(resources);
  });
}

function setup (resources) {
  game = new Game({
    resources,
    ui,
    sound,
    reels,
    fireworks: new Fireworks(resources.dot.texture, app.view.width, app.view.height),
  });

  game.init({ symbols: ['blue', 'red', 'gold'], prize: 200 });

  drawStage();

  app.ticker.add(loop);
}

function loop() {
  game.fireworks.updateParticles();
}

function drawStage () {
  let bg = ui.background(PIXI.Loader.shared.resources.background.texture);
  app.stage.addChild(bg);

  let reelsContainer = ui.drawReels(reels);
  app.stage.addChild(reelsContainer);

  let logo = ui.drawLogo();
  app.stage.addChild(logo);

  let actionButton = ui.drawActionButton();
  actionButton.addListener('pointerup', () => { game.spinReels(); });
  app.stage.addChild(actionButton);

  let statusText = ui.drawStatusText('Good Luck!');
  app.stage.addChild(statusText);

  let score = ui.drawScore();
  app.stage.addChild(score);

  let fireworksContainer = game.fireworks.getContainer();
  app.stage.addChild(fireworksContainer);
}