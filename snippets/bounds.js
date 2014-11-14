/*globals Bullet*/
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