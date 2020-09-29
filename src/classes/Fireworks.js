import * as PIXI from 'pixi.js';

export default class Fireworks {
  constructor (texture, maxX, maxY) {
    this.texture = texture;
    this.container = new PIXI.ParticleContainer();
    this.maxX = maxX;
    this.maxY = maxY;
    this.particles = [];
    this.gravity = 0.09;
  }

  createParticle (x, y, v, ttl = 2) {
    let particle = new PIXI.Sprite(this.texture);
    particle.x = x;
    particle.y = y;
    particle.v = v;
    particle.ttl = ttl;
    particle.isSource = ttl > 0;
    particle.age = 0;
    particle.fuse = 40 + Math.floor(Math.random() * 25);
    // particle.tint = particle.isSource ? Math.random() * 0xFFD700 : parent.tint;
    particle.tint = Math.random() * 0xFFD700;

    this.particles.push(particle);
    this.container.addChild(particle);

    return particle;
  }

  particleExplode (particle) {
    this.particles.splice(this.particles.indexOf(particle), 1);
    this.container.removeChild(particle);
    if (particle.isSource) {
      let initSpeed = 4;
      let childPartCount = 10;
      for (let j = 1; j <= 2; j++) {
        for (let i = 0; i < childPartCount; i++) {
          this.createParticle(
            particle.x,
            particle.y,
            {
              x: (initSpeed / j) * Math.sin(2*Math.PI * (i + j/2) / childPartCount) + particle.v.x * 0.1,
              y: (initSpeed / j) * Math.cos(2*Math.PI * (i + j/2) / childPartCount),
            },
            particle.ttl - 1
          );
        }
      }
    }
    particle.destroy();
  }

  updateParticle (particle) {
    particle.x += particle.v.x;
    particle.y += particle.v.y;
    particle.age += 1;
    particle.v.y += this.gravity;

    if (particle.age >= particle.fuse) {
      this.particleExplode(particle);
    }
  }

  updateParticles () {
    this.particles.forEach(p => {
      this.updateParticle(p);
    });
  }

  startTheShow () {
    this.createParticle(0, (2 * this.maxY / 3), { x: 7, y: -8 });
    this.createParticle(this.maxX * 1.2, (2.4 * this.maxY / 3), { x: -8, y: -8 });
    this.createParticle(this.maxX * 0.4, this.maxY, { x: 2, y: -12 });
  }

  getContainer () {
    return this.container;
  }
};