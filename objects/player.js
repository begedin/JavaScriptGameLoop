var Player = function (game, gameSize) {
    this.game = game;
    this.size = {
      x: 20,
      y: 20
    };
    this.center = {
      x: gameSize.x / 2 - this.size.x / 2,
      y: gameSize.y - this.size.y
    };
    this.controls = new Controls();
  };

  Player.prototype = {
    update: function () {
      if (this.controls.isDown(this.controls.KEYS.LEFT)) {
        this.center.x -= 3;
      }
      if (this.controls.isDown(this.controls.KEYS.RIGHT)) {
        this.center.x += 3;
      }

      if (this.controls.isDown(this.controls.KEYS.SPACE)) {
        var bullet = new Bullet(this.game, {
          x: this.center.x,
          y: this.center.y - this.size.y
        }, {
          x: 0,
          y: -10
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