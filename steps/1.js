/*globals window, document*/
(function () {
  var Game = function (canvasId) {
    var canvas = document.getElementById(canvasId),
        screen = canvas.getContext('2d'),
        gameSize = { x: canvas.width, y: canvas.height };
  };
  
  window.onload = function () {
    new Game('body');
  };
})();