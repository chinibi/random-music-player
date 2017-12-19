/**
 * Debouncer
 * Executes a function after it is called and stops being called after
 * a specified time.  Useful for things like callbacks on events which
 * trigger many times at once, such as window resizing.
 *
 * @param func Function | The function to be debounced
 * @param wait Number | Delay in milliseconds. Functions will not execute until
 *             they stop being called after this specified time.
 * @param immediate Boolean | If true, the function will be executed before the
 *                  delay timer is set and will not be executed anymore until
 *                  the delay time has passed.
 *
 * Code from https://davidwalsh.name/javascript-debounce-function
 */

function debounce(func, wait, immediate) {
  var timeout; // The container for the setTimeout instance
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export default debounce;
