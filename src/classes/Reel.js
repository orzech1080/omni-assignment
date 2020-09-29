import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export default class Reel {
  constructor (textures) {
    this.textures = [...textures];
    this.current = 0;
    this.timer = 0;

    this.sprite = this.prepareSprite();
  }

  prepareSprite () {
    let sprite = new PIXI.Sprite(this.textures[this.current])
    sprite.filters = [new PIXI.filters.BlurFilter()];
    sprite.filters[0].blur = 0;

    return sprite;
  }

  spin (count, onComplete = () => {}) {
    this.sprite.filters[0].blurY = 15;
    gsap.to(this, {
      timer: 1,
      duration: 0.1,
      repeat: count,
      onRepeat: () => {
        this.updateTexture() },
      onComplete: () => {
        this.stop();
        onComplete(); }
    });
  }

  stop () {
    gsap.to(this.sprite, {
      y: `+=${this.sprite.height * 0.1}`,
      duration: 0.2, yoyo: true, repeat: 1});
    this.sprite.filters[0].blurY = 0;
  }

  updateTexture () {
    this.current = (this.current + 1) % this.textures.length;
    this.sprite.texture = this.textures[this.current];
  }

  getTextureID () {
    return this.textures[this.current].textureCacheIds[0];
  }
}