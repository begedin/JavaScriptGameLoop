enemiesBelow: function (enemy) {
  return this.bodies.filter(function (b) {
    return b instanceof Enemy &&
      b.center.y > enemy.center.y &&
      b.center.x - enemy.center.x < enemy.size.x;
  }).length > 0;
}