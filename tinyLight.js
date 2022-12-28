"use strict";

customElements.define(
  "tiny-light",
  class Light extends HTMLElement {
    constructor() {
      const template = document.createElement("template");
      template.innerHTML = `
      <style>
      :host {
        --shadowVal1: 50px;
        --shadowVal2: 15px;
        --brightness: 1;
        --blur: 0.8px;
      }

      .box {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        overflow-y: hidden;
        background: black;
      }

      .light {
        position: sticky;
        top: 50%;
        left: 50%;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        will-change: background-color;
        will-change: box-shadow;
        background-color: rgba(187, 230, 255, var(--brightness));
        box-shadow: 0 0 var(--shadowVal1) var(--shadowVal2) rgba(187, 230, 255, 1);
        filter: blur(var(--blur));
       
      }
      </style>
      <main class="box">
        <div class="light"></div>
      </main>`;

      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.light = this.shadow.querySelector(".light");

      this.X = 50;
      this.Y = 50;
      this.velocityX = 0.1;
      this.velocityY = 0.1;
      this.rightReached = false;
      this.topReached = false;

      this.randomMoves = true;
      this.moves = [
        this.moveRight,
        this.moveLeft,
        this.moveTop,
        this.moveBottom,
      ];

      this.glowSize = 15;
      this.maxGlowSize = false;
      this.minGlowSize = false;
      this.brightness = 1;
      this.maxBrightness = false;
      this.minBrightness = false;
    }

    connectedCallback() {
      this.light.onmouseover = (event) => {
        this.randomMoves = false;
        this.getDirection(event);
        this.loop();
      };

      this.light.ontouchmove = (event) => {
        this.randomMoves = false;
        this.getDirection(event);
        this.loop();
      };

      this.lightAnimation();

      this.randomMove();
    }

    randomMove() {
      let callback = this.moves[~~this.rnd(this.moves.length, 0)].bind(this);
      let isFinished = false;
      window.requestAnimationFrame(this.randomMove.bind(this));

      function moveRandomly() {
        if (isFinished) {
          window.cancelAnimationFrame(moveRandomly);
          return;
        }
        window.requestAnimationFrame(moveRandomly);

        isFinished = callback();
      }
      if (this.randomMoves) {
        moveRandomly();
      }
    }

    loop() {
      if (this.stopCondition()) {
        window.cancelAnimationFrame(this.loop.bind(this));
        return;
      }
      window.requestAnimationFrame(this.loop.bind(this));
      if (!this.rightReached) {
        this.velocityX -= this.rnd(0.001, 0);
        this.moveRight();
      } else if (this.rightReached) {
        this.velocityX -= this.rnd(0.001, 0);
        this.moveLeft();
      }
      if (!this.topReached) {
        this.velocityY -= this.rnd(0.001, 0);
        this.moveTop();
      } else if (this.topReached) {
        this.velocityY -= this.rnd(0.001, 0);
        this.moveBottom();
      }
    }

    getDirection(event) {
      let x = event.offsetX;
      let y = event.offsetY;
      if (x >= 0 && x <= 2) {
        this.rightReached = false;
        this.velocityX = x = y / this.rnd(15, 10);
        this.velocityY = x / y;
        return;
      } else if (y >= 0 && y <= 2) {
        this.topReached = true;
        this.velocityY = y = x / this.rnd(15, 10);
        this.velocityX = y / x;
        return;
      } else if (x < 17 && x > 11) {
        this.rightReached = true;
        this.velocityX = x / this.rnd(15, 10);
        this.velocityY = y / this.rnd(15, 10);
        return;
      } else if (x > 1 && x < 12) {
        this.topReached = false;
        this.velocityX = x / this.rnd(15, 10);
        this.velocityY = y / this.rnd(15, 10);
        return;
      }
    }

    lightMove(X, Y) {
      this.light.style.left = `${X}%`;
      this.light.style.top = `${Y}%`;
    }

    collision() {
      const m1 = 100;
      const m2 = 500;
      const v1 = this.velocityX + this.velocityY;
      const v2 = 0;
      const vf = (m1 * v1 + m2 * v2) / (m1 + m2);
      return vf;
    }

    stopCondition() {
      if ((this.velocityX <= 0) & (this.velocityY <= 0)) {
        return true;
      }
    }

    moveRight() {
      this.X += this.velocityX;
      this.lightMove(this.X, this.Y);
      if (this.X >= 100) {
        if (!this.randomMoves) {
          this.velocityX = this.collision(this.velocityX);
        }
        this.rightReached = true;
        return "finished";
      }
    }

    moveLeft() {
      this.X -= this.velocityX;
      this.lightMove(this.X, this.Y);
      if (this.X <= 0) {
        if (!this.randomMoves) {
          this.velocityX = this.collision(this.velocityX);
        }
        this.rightReached = false;
        return "finished";
      }
    }

    moveTop() {
      this.Y -= this.velocityY;
      this.lightMove(this.X, this.Y);
      if (this.Y <= 0) {
        if (!this.randomMoves) {
          this.velocityY = this.collision(this.velocityY);
        }
        this.topReached = true;
        return "finished";
      }
    }

    moveBottom() {
      this.Y += this.velocityY;
      this.lightMove(this.X, this.Y);
      if (this.Y >= 100) {
        if (!this.randomMoves) {
          this.velocityY = this.collision(this.velocityY);
        }
        this.topReached = false;
        return "finished";
      }
    }

    rnd(max, min) {
      return Math.random() * (max - min) + min;
    }

    lightAnimation() {
      window.requestAnimationFrame(this.lightAnimation.bind(this));
      if (this.glowSize < 15 && !this.maxGlowSize) {
        this.glowSize += 0.06;
        if (this.glowSize >= 15) {
          this.maxGlowSize = true;
          this.minGlowSize = false;
        }
      } else if (this.glowSize > 8 && !this.minGlowSize) {
        this.glowSize -= 0.06;
        if (this.glowSize <= 8) {
          this.maxGlowSize = false;
          this.minGlowSize = true;
        }
      }
      if (this.brightness < 1 && !this.maxBrightness) {
        this.brightness += 0.006;
        if (this.brightness >= 1) {
          this.maxBrightness = true;
          this.minBrightness = false;
        }
      } else if (this.brightness > 0.85 && !this.minBrightness) {
        this.brightness -= 0.006;
        if (this.brightness <= 0.85) {
          this.maxBrightness = false;
          this.minBrightness = true;
        }
      }
      this.style.setProperty("--shadowVal1", `${this.glowSize * 3.7}px`);
      this.style.setProperty("--shadowVal2", `${this.glowSize}px`);
      this.style.setProperty("--brightness", `${this.brightness}`);
      this.style.setProperty("--blur", `${this.brightness - 0.25}px`);
    }
  }
);
