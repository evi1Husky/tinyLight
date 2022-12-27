const light = document.querySelector(".light");

let X = 50;
let Y = 50;
let velocityX = 3;
let velocityY = 3;
let rightReached = false;
let leftReached = false;
let topReached = false;
let bottomReached = false;

const lightMove = (X, Y) => {
  light.style.left = `${X}%`;
  light.style.top = `${Y}%`;
};

const collision = (axisSpeed) => {
  return axisSpeed - (Math.random() * (0.3 - 0) + 0);
};

const stopCondition = () => {
  if ((velocityX <= 0) & (velocityY <= 0)) {
    return true;
  }
};

const moveRight = () => {
  X += velocityX;
  lightMove(X, Y);
  if (X >= 100) {
    velocityX = collision(velocityX);
    rightReached = true;
    leftReached = false;
  }
};

const moveLeft = () => {
  X -= velocityX;
  lightMove(X, Y);
  if (X <= 0) {
    velocityX = collision(velocityX);
    leftReached = true;
    rightReached = false;
  }
};

const moveTop = () => {
  Y -= velocityY;
  lightMove(X, Y);
  if (Y <= 0) {
    velocityY = collision(velocityY);
    topReached = true;
    bottomReached = false;
  }
};

const moveBottom = () => {
  Y += velocityY;
  lightMove(X, Y);
  if (Y >= 100) {
    velocityY = collision(velocityY);
    bottomReached = true;
    topReached = false;
  }
};

const loop = () => {
  if (stopCondition()) {
    window.cancelAnimationFrame(loop);
    return;
  }
  window.requestAnimationFrame(loop);
  if (!rightReached) {
    velocityX -= 0.001;
    moveRight();
  }
  if (rightReached) {
    velocityX -= 0.001;
    moveLeft();
  }
  if (!topReached) {
    velocityY -= 0.001;
    moveTop();
  }
  if (topReached) {
    velocityY -= 0.001;
    moveBottom();
  }
};

light.onclick = () => {
  lightMove(X, Y);
  velocityX = 3;
  velocityY = 3;
  loop();
};
