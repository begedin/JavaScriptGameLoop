/**
 * Draws the provided body on the provided canvas context (screen)
 * @param {Canvas context} screen Canvas context to draw the body on
 * @param {Body} body Body to draw. Must contain size and center vectors
 */
var drawBody = function (screen, body) {
  screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, body.size.x, body.size.y);
};