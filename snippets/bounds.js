var notOutOfBounds = function (b) {
  return !(b instanceof Bullet) ||
    b.center.x > 0 &&
    b.center.y > 0 &&
    b.center.x < gameSize.x &&
    b.center.y < gameSize.y;
};