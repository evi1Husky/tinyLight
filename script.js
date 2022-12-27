const light = document.querySelector(".light");

let X = 50;
let Y = 50;
let velocityX = 0;
let velocityY = 0;
let rightReached = false;
let topReached = false;

const rnd = (max, min) => {
  return Math.random() * (max - min) + min;
};

const lightMove = (X, Y) => {
  light.style.left = `${X}%`;
  light.style.top = `${Y}%`;
};

const collision = () => {
  const m1 = 100;
  const m2 = 200;
  const v1 = velocityX + velocityY;
  const v2 = 0;
  const vf = (m1 * v1 + m2 * v2) / (m1 + m2);
  return vf;
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
  }
};

const moveLeft = () => {
  X -= velocityX;
  lightMove(X, Y);
  if (X <= 0) {
    velocityX = collision(velocityX);
    rightReached = false;
  }
};

const moveTop = () => {
  Y -= velocityY;
  lightMove(X, Y);
  if (Y <= 0) {
    velocityY = collision(velocityY);
    topReached = true;
  }
};

const moveBottom = () => {
  Y += velocityY;
  lightMove(X, Y);
  if (Y >= 100) {
    velocityY = collision(velocityY);
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
    velocityX -= rnd(0.001, 0);
    moveRight();
  } else if (rightReached) {
    velocityX -= rnd(0.001, 0);
    moveLeft();
  }
  if (!topReached) {
    velocityY -= rnd(0.001, 0);
    moveTop();
  } else if (topReached) {
    velocityY -= rnd(0.001, 0);
    moveBottom();
  }
};

const getDirection = (event) => {
  let x = event.offsetX;
  let y = event.offsetY;
  if (x === 0 || x === 1) {
    rightReached = false;
    velocityX = x = y / rnd(7, 3);
    velocityY = x / y;
    return;
  } else if (y === 0 || y === 1) {
    topReached = true;
    velocityY = y = x / rnd(7, 3);
    velocityX = y / x;
    return;
  } else if (x < 17 && x > 11) {
    rightReached = true;
    velocityX = x / rnd(7, 3);
    velocityY = y / rnd(7, 3);
    return;
  } else if (x > 1 && x < 12) {
    topReached = false;
    velocityX = x / rnd(7, 3);
    velocityY = y / rnd(7, 3);
    return;
  }
};

light.onmouseover = (event) => {
  getDirection(event);
  loop();
};

light.ontouchmove = (event) => {
  getDirection(event);
  loop();
};
