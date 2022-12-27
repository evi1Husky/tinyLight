const light = document.querySelector(".light");

let X = 50;
let Y = 50;
let speedX = 3;
let speedY = 3;
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
  if ((speedX <= 0) & (speedY <= 0)) {
    return true;
  }
};

const moveRight = () => {
  X += speedX;
  lightMove(X, Y);
  if (X >= 100) {
    speedX = collision(speedX);
    rightReached = true;
    leftReached = false;
  }
};

const moveLeft = () => {
  X -= speedX;
  lightMove(X, Y);
  if (X <= 0) {
    speedX = collision(speedX);
    leftReached = true;
    rightReached = false;
  }
};

const moveTop = () => {
  Y -= speedY;
  lightMove(X, Y);
  if (Y <= 0) {
    speedY = collision(speedY);
    topReached = true;
    bottomReached = false;
  }
};

const moveBottom = () => {
  Y += speedY;
  lightMove(X, Y);
  if (Y >= 100) {
    speedY = collision(speedY);
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
    speedX -= 0.001;
    moveRight();
  }
  if (rightReached) {
    speedX -= 0.001;
    moveLeft();
  }
  if (!topReached) {
    speedY -= 0.001;
    moveTop();
  }
  if (topReached) {
    speedY -= 0.001;
    moveBottom();
  }
};

light.onclick = () => {
  lightMove(X, Y);
  speedX = 3;
  speedY = 3;
  loop();
};
