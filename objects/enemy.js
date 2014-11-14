var Enemy = function (game, center) {
    this.game = game;
    this.center = center;
    this.size = {
      x: 15,
      y: 15
    };
    this.speedX = 0.3;
    this.patrolX = 0;
  };

  Enemy.prototype = {
    update: function () {
      this.patrolX += this.speedX;
      this.center.x += this.speedX;

      if (this.patrolX < 0 || this.patrolX > 40) {
        this.speedX = -this.speedX;
      }

      if (Math.random() > 0.995 && !this.game.enemiesBelow(this)) {
        var bullet = new Bullet(this.game, {
          x: this.center.x,
          y: this.center.y + this.size.y
        }, {
          x: 0,
          y: 5
        });
        this.game.shootSound.load();
        this.game.shootSound.play();
        this.game.addBody(bullet);
      }
    },
    draw: function (screen, gameSize) {
      drawRect(screen, this);
    }
  };