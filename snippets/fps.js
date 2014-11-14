var time = new Date();
var fps = 1000 / (time - this.lastDrawTime);
this.lastDrawTime = time;
screen.fillText(fps.toFixed(0), gameSize.x - 20, 20);