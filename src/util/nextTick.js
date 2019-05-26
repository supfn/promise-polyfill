function _setImmediate(fn) {
  if (typeof setImmediate === 'function') {
    return setImmediate(fn);
  }
  return setTimeout(fn, 0);
}

function nextTick(fn) {
  if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
    return process.nextTick(fn);
  }

  if (typeof MutationObserver !== 'undefined') {
    let counter = 1;
    const observer = new MutationObserver(fn);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, { characterData: true });
    counter ^= 1;
    textNode.data = String(counter);
    return observer;
  }
  return _setImmediate(fn);
}

module.exports = nextTick;
