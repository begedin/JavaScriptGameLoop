var loadSound = function (url, callback) {
  var sound = new Audio(url);
  var loaded = function () {
    sound.removeEventListener('canplaythrough', loaded);
    callback(sound);
  };

  sound.addEventListener('canplaythrough', loaded);
};