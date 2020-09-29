import * as PIXI from 'pixi.js';
import { DropShadowFilter } from 'pixi-filters';

export default class UI {
  constructor (scale, appW, appH) {
    this.appDimensions = { width: appW, height: appH };
    this.scale = scale;
    this.colors = {
      primary: 0xe660e3,
      stroke: 0xFFD700,
      background: 0xFFFFFF,
      borderLight: 0xCCCCCC,
      shadow: 0x424242,
    };
    this.defaultTextStyle = {
      fontFamily: "Yellowtail",
      fontSize: this.scale * 0.4,
      fill: this.colors.primary,
      stroke: this.colors.stroke,
      strokeThickness: this.scale * 0.05,
      dropShadow: true,
      dropShadowAngle: 0.6,
      dropShadowBlur: 4,
      dropShadowDistance: 5,
      dropShadowColor: this.colors.shadow,
      padding: 20,
    };

    this.scoreObject = null;
    this.statusTextObject = null;
    this.spinButton= null;
  }

  background (bgTexture) {
    let bg = new PIXI.Sprite(bgTexture);
    bg.width = this.appDimensions.width;
    bg.height = this.appDimensions.height;
    return bg;
  }

  reelsBackground (bgBorderSize, size) {
    let reelBG = new PIXI.Graphics();
    reelBG.lineStyle(bgBorderSize, this.colors.stroke);
    reelBG.beginFill(this.colors.background);
    reelBG.drawRoundedRect(0, 0, this.scale * (size * 1.5 + 0.5), this.scale * 1.5);
    reelBG.endFill();

    reelBG.lineStyle(1, this.colors.borderLight);
    for (let i = 0; i < size + 1; i++) {
      reelBG.moveTo(this.scale * (0.25 + 1.5 * i), this.scale * 0.25);
      reelBG.lineTo(this.scale * (0.25 + 1.5 * i), this.scale * 1.25);
    }

    return reelBG;
  }

  drawReels ({ reels, count }) {
    let reelsContainer = new PIXI.Container();
    let bgBorderSize = this.scale * 0.2;

    let reelBG = this.reelsBackground(bgBorderSize, count);
    reelsContainer.addChild(reelBG);

    reels.forEach((r, index) => {
      r.sprite.width = this.scale;
      r.sprite.height = this.scale;
      r.sprite.x = this.scale * 0.5 + index * this.scale * 1.5;
      r.sprite.y = this.scale * 0.25;
      reelsContainer.addChild(r.sprite);
    });

    reelsContainer.x = (this.appDimensions.width - reelsContainer.width) / 2 + bgBorderSize / 2;
    reelsContainer.y = (this.appDimensions.height - reelsContainer.height) / 2;

    return reelsContainer;
  }

  drawLogo () {
    let logoStyle = new PIXI.TextStyle({
      ...this.defaultTextStyle,
      fontSize: this.scale * 0.8,
      strokeThickness: this.scale * 0.06,
      dropShadowBlur: 8,
      dropShadowDistance: 10,
    })
    let logo = new PIXI.Text("Spin'em", logoStyle);
    logo.anchor.set(0, 0.5);
    logo.x = this.appDimensions.width / 2 - 3 * this.scale;
    logo.y = this.appDimensions.height / 2 -  this.scale;
    logo.rotation = Math.PI / -30;
    return logo;
  }

  drawActionButton () {
    let button = new PIXI.Container();

    let buttonBG = new PIXI.Graphics();
    buttonBG.lineStyle(this.scale * 0.05, this.colors.stroke);
    buttonBG.beginFill(this.colors.primary);
    buttonBG.drawCircle(0, 0, this.scale * 0.6);
    buttonBG.endFill();
    buttonBG.filters = [new DropShadowFilter({ distance: 6, blur: 2 })];
    button.addChild(buttonBG);

    let buttonTextStyle = new PIXI.TextStyle({
      ...this.defaultTextStyle,
      fontSize: this.scale * 0.4,
      dropShadowDistance: 4,
    })
    let buttonText = new PIXI.Text('Spin!', buttonTextStyle);
    buttonText.anchor.set(0.5);
    button.addChild(buttonText);

    button.x = this.appDimensions.width / 2 + this.scale * 2.1;
    button.y = this.appDimensions.height / 2 + this.scale * 1.1;
    button.interactive = true;
    button.buttonMode = true;

    this.spinButton = button;
    return button;
  }

  pressButton(isDown) {
    this.spinButton.x += isDown ? 1 : -1;
    this.spinButton.y += isDown ? 2 : -2;
    this.spinButton.children[0].filters[0].distance = isDown ? 0 : 5;
    this.spinButton.children[0].filters[0].blur = isDown ? 0 : 2;
  }

  drawStatusText(text) {
    if (!this.statusTextObject) {
      let statusTextStyle = new PIXI.TextStyle({ ...this.defaultTextStyle });
      let statusText = new PIXI.Text(text, statusTextStyle);
      statusText.anchor.set(0.5);
      statusText.x = this.appDimensions.width / 2 - this.scale * 0.5;
      statusText.y = this.appDimensions.height / 2 + this.scale * 1.2;

      this.statusTextObject = statusText;
      return statusText;
    }

    this.statusTextObject.text = text;
  }

  drawScore (value = 0) {
    if (!this.scoreObject) {
      let scoreTextStyle = new PIXI.TextStyle({ ...this.defaultTextStyle })
      let scoreText = new PIXI.Text(`Score: ${value}`, scoreTextStyle);
      scoreText.anchor.set(0.5);
      scoreText.x = this.appDimensions.width / 2 + this.scale * 1.3;
      scoreText.y = this.appDimensions.height / 2 - this.scale * 1.3;

      this.scoreObject = scoreText;
      return scoreText;
    }

    this.scoreObject.text = `Score: ${value}`;
  }
}