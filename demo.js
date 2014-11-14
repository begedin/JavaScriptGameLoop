/*globals window*/
(function () {

  /**  
   * Description  Class function for the main, game object, in charge of running the main game loop
   * @param {type} canvasId Description
   */
  var Game = function (canvasId) {
    var canvas = window.document.getElementById(canvasId),
      screen = canvas.getContext('2d'),
      gameSize = {
        x: canvas.width,
        y: canvas.height
      };

    this.bodies = [];
    this.addBody(new Player(this, gameSize));
    this.spawnEnemies();

    var self = this;
    
    /**    
     * Runs game's update() and draw() functions, then requests the next frame    
     */
    var tick = function () {
      self.update(gameSize);
      self.draw(screen, gameSize);
      window.requestAnimationFrame(tick);
    };

    loadSound('shoot.wav', function (sound) {
      self.shootSound = sound;
      tick();
    });


  };

  Game.prototype = {};

  /**
   * Runs .update() for all bodies in the game. Also removes colided and out of bounds bodies
   * @param {gameSize} vector containing the game size, { x: Number, y: Number } used for determinig if body is out of bounds
   */
  Game.prototype.update = function (gameSize) {

    var notOutOfBounds = function (b) {
      return !outOfBounds(b, gameSize);
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
  };

  /**
   * Runs .draw() for all bodies existing in the game. Part of the update loop
   * @param {Canvas context} screen to draw the game on
   * @param {Vector} gameSize Size of the game's screen { x: Number, y: Number }
   */
  Game.prototype.draw = function (screen, gameSize) {
    screen.clearRect(0, 0, gameSize.x, gameSize.y);
    this.bodies.forEach(function (body) {
      body.draw(screen, gameSize);
    });

    // we also draw the FPS in the top right of the screen, for debuging purposes
    var time = new Date();
    var fps = 1000 / (time - this.lastDrawTime);
    this.lastDrawTime = time;
    screen.fillText(fps.toFixed(0), gameSize.x - 20, 20);
  };

  /**
   * Adds the provided body to the list of game's bodies
   * @param {Body} body to add to the list of bodies.
   */
  Game.prototype.addBody = function (body) {
    this.bodies.push(body);
  };

  /**
   * Spawns 24 enemies aranged in a grid and adds them to the game's list of bodies
   */
  Game.prototype.spawnEnemies = function () {
    for (var i = 0; i < 24; i++) {
      var center = {
        x: 30 + i % 8 * 30,
        y: 30 + i % 3 * 30
      };

      this.addBody(new Enemy(this, center));
    }
  };

  /**
   * Indicates of provided enemy has enemies below them
   * @param {Enemy} enemy to check if it has any other enemies below them
   * @returns {Boolean} true if provided enemy has enemies below them
   */
  Game.prototype.enemyHasEnemiesBelow = function (enemy) {
    return this.bodies.filter(function (b) {
      return b instanceof Enemy &&
        b.center.y > enemy.center.y &&
        b.center.x - enemy.center.x < enemy.size.x;
    }).length > 0;
  };

  window.onload = function () {
    new Game('game');
  };

  /// GAME ENTITY CLASS FUNCTIONS


  /**  
   * Description  Represents the player of the game
   * @param {Game} game Game containing this player
   * @param {Vector} gameSize Size of the game's screen { x: Number, y: Number }
   */
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

  Player.prototype = {};

  /**
   * Runs update logic for the player. Responds to control input
   */
  Player.prototype.update = function () {
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
  };

  /**
   * Draws the player using the drawBody() helper
   * @param {Canvas context} screen to draw the player on
   * @param {Vector} size of the game's screen { x: Number, y: Number }
   */
  Player.prototype.draw = function (screen, gameSize) {
    drawBody(screen, this);
  };


  /**
   * Represents a single bullet in the game
   * @param {Game} game containing the bullet
   * @param {Vector} center of the bullet. { x: Number, y: Number }
   * @param {Speed} speed of the bullet. { x: Number, y: Number }
   */
  var Bullet = function (game, center, speed) {
    this.game = game;
    this.center = center;
    this.speed = speed;
    this.size = {
      x: 5,
      y: 5
    };
  };

  Bullet.prototype = {};

  /**
   * Runs update logic for the bullet. Update's its position based on its speed
   */
  Bullet.prototype.update = function () {
    this.center.x += this.speed.x;
    this.center.y += this.speed.y;
  };

  /**
   * Draws the bullet using the drawBody helper
   * @param {Canvas context} screen to draw the bullet on
   * @param {Vector} size of the game's screen { x: Number, y: Number }
   */
  Bullet.prototype.draw = function (screen, gameSize) {
    drawBody(screen, this);
  };


  /**  
   * Represents a single enemy in the game
   * @param {Game} game the enemy belongs to
   * @param {Vector} center coordinates of the enemy { x: Number, y: Number }
   */
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

  Enemy.prototype = {};

  /**
   * Runs update logic for the enemy. Moves it along its patrol route and spawns bullet if conditions are right
   */
  Enemy.prototype.update = function () {
    this.patrolX += this.speedX;
    this.center.x += this.speedX;

    // Enemies move 40 pixels to the right and back, in a loop
    if (this.patrolX < 0 || this.patrolX > 40) {
      this.speedX = -this.speedX;
    }

    // Each enemy with no enemies below it has a .5% chance to spawn a bullet
    if (Math.random() > 0.995 & !this.game.enemyHasEnemiesBelow(this)) {
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
  };
  
  /**
   * Draws the enemy using the drawBody() helper
   * @param {Canvas context} screen to draw the enemy on
   * @param {Vector} size of the game's screen { x: Number, y: Number }
   */
  Enemy.prototype.draw = function (screen, gameSize) {
    drawBody(screen, this);
  };

  /// OTHER CLASS FUNCTIONS

  /**  
   * Constructor class for checking key state of the game's supported controls. Used by the Player class
   */
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

    // keyCodes for controls used by the game
    this.KEYS = {
      LEFT: 37,
      RIGHT: 39,
      SPACE: 32
    };
  };

  /// HELPERS

  /**
   * Draws the provided body on the provided canvas context (screen)
   * @param {Canvas context} screen Canvas context to draw the body on
   * @param {Body} body Body to draw. Must contain size and center vectors
   */
  var drawBody = function (screen, body) {
    screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, body.size.x, body.size.y);
  };

  /**
   * Indicates if two bodies are coliding with each other
   * @param {Body} b1 The first of the two bodies
   * @param {Body} b2 The second of the two bodies
   * @returns {Boolean} True of bodies are coliding, false otherwise
   */
  var coliding = function (b1, b2) {
    return !(b1 === b2 || // if the two objects are the same, there's no colision
      // if b1 is strictly to the left of b2, no collision
      b1.center.x + b1.size.x / 2 <= b2.center.x - b2.size.x / 2 ||
      // if b1 is strictly above b2, no collision
      b1.center.y + b1.size.y / 2 <= b2.center.y - b2.size.y / 2 ||
      // if b1 is strictly to the right of b2, no collision
      b1.center.x - b1.size.x / 2 >= b2.center.x + b2.size.x / 2 ||
      // if b1 is strictly bellow b2, no collision
      b1.center.y - b1.size.y / 2 >= b2.center.y + b2.size.y / 2);
  };

  /** 
   * Indicates if the provided bullet is out of screen bounds.
   * @param {Bullet} b The provided body. An object containing a size and center properties
   * @returns {Boolean} True if body is not out of bounds, false if it is.
   */
  var outOfBounds = function (b, gameSize) {
    return (b instanceof Bullet) &&
      (b.center.x < 0 ||
        b.center.y < 0 ||
        b.center.x > gameSize.x ||
        b.center.y > gameSize.y);
  };

  /**
   * Loads a sound, then executes provided callback, if any
   * @param {string} url Location of the sound
   * @param {function} callback Function to execute when sound is loaded. Loaded sound is the first parameter.
   */
  var loadSound = function (url, callback) {
    var sound = new window.Audio(url);
    // callback is wrapped in a different function so it can be executed with 
    // proper arguments and so that event listeners can be removed
    var loaded = function () {
      sound.removeEventListener('canplaythrough', loaded);
      callback(sound);
    };

    sound.addEventListener('canplaythrough', loaded);
  };
})();