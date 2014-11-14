/*globals window*/


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