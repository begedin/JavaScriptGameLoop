/**
 * Indicates if two bodies are coliding with each other
 * @param {Body} b1 The first of the two bodies
 * @param {Body} b2 The second of the two bodies
 * @param True of bodies are coliding, false otherwise
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