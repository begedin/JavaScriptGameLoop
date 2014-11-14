var Bullet = function (game, center, speed) {
    this.game = game;
    this.center = center;
    this.speed = speed;
    this.size = {
      x: 5,
      y: 5
    };
  };

  Bullet.prototype = {
    update: function () {
      this.center.x += this.speed.x;
      this.center.y += this.speed.y;
    },
    draw: function (screen, gameSize) {
      drawRect(screen, this);
    }
  };