/*globals window, document, console, Audio*/
(function () {
  var Game = function (canvasId) {
    var canvas = document.getElementById(canvasId),
      screen = canvas.getContext('2d'),
      gameSize = {
        x: canvas.width,
        y: canvas.height
      };

    this.bodies = [];
    this.addBody(new Player(this, gameSize));
    this.spawnEnemies();


    var self = this;

    var tick = function () {
      self.update(gameSize);
      self.draw(screen, gameSize);
      window.requestAnimationFrame(tick);
    };
    
    loadSound('shoot.wav', function(sound) {
      self.shootSound = sound;
      tick();
    });

    
  };

  Game.prototype = {
    update: function (gameSize) {

      var notOutOfBounds = function (b) {
        return !(b instanceof Bullet) ||
          b.center.x > 0 &&
          b.center.y > 0 &&
          b.center.x < gameSize.x &&
          b.center.y < gameSize.y;
      };

      var bodies = this.bodies;
      var notColidingWithAnything = function (b1) {
        return bodies.filter(function (b2) {
          return coliding(b1, b2);
        }).length === 0;
      };

      this.bodies = this.bodies.filter(notOutOfBounds).filter(notColidingWithAnything);
      this.bodies.forEach(function (body) {
        body.update();
      });
    },
    draw: function (screen, gameSize) {
      screen.clearRect(0, 0, gameSize.x, gameSize.y);
      this.bodies.forEach(function (body) {
        body.draw(screen, gameSize);
      });

      var time = new Date();
      var fps = 1000 / (time - this.lastDrawTime);
      this.lastDrawTime = time;
      screen.fillText(fps.toFixed(0), gameSize.x - 20, 20);
    },
    addBody: function (body) {
      this.bodies.push(body);
    },
    spawnEnemies: function () {
      for (var i = 0; i < 24; i++) {
        var center = {
          x: 30 + i % 8 * 30,
          y: 30 + i % 3 * 30
        };

        this.addBody(new Enemy(this, center));
      }
    },
    enemiesBelow: function (enemy) {
      return this.bodies.filter(function (b) {
        return b instanceof Enemy &&
          b.center.y > enemy.center.y &&
          b.center.x - enemy.center.x < enemy.size.x;
      }).length > 0;
    }
  };

  var Player = function (game, gameSize) {
    this.game = game;
    this.size = {
      x: 20,
      y: 20
    };
    this.center = {
      x: gameSize.x / 2,
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

  var Controls = function () {
    var keyState = {};

    window.onkeydown = function (e) {
      keyState[e.keyCode] = true;
    };

    window.onkeyup = function (e) {
      keyState[e.keyCode] = false;
    };

    this.isDown = function (keyCode) {
      return keyState[keyCode] === true;
    };

    this.KEYS = {
      LEFT: 37,
      RIGHT: 39,
      SPACE: 32
    };
  };

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

  var drawRect = function (screen, body) {
    screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, body.size.x, body.size.y);
  };

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

      if (Math.random() > 0.995 & !this.game.enemiesBelow(this)) {
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

  var coliding = function (b1, b2) {
    return !(b1 === b2 ||
      b1.center.x + b1.size.x / 2 <= b2.center.x - b2.size.x / 2 ||
      b1.center.y + b1.size.y / 2 <= b2.center.y - b2.size.y / 2 ||
      b1.center.x - b1.size.x / 2 >= b2.center.x + b2.size.x / 2 ||
      b1.center.y - b1.size.y / 2 >= b2.center.y + b2.size.y / 2);
  };

  window.onload = function () {
    new Game('game');
  };

  var loadSound = function (url, callback) {
    var sound = new Audio(url);
    var loaded = function () {
      sound.removeEventListener('canplaythrough', loaded);
      callback(sound);
    };

    sound.addEventListener('canplaythrough', loaded);
  };

})();