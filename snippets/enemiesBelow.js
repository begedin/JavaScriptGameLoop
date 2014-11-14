/* globals Game, Enemy*/
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