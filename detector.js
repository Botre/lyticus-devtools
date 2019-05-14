window.addEventListener("message", e => {
  if (e.source === window && e.data._lyticus) {
    chrome.runtime.sendMessage(e.data);
  }
});

if (document instanceof HTMLDocument) {
  installScript(function detect(_window) {
    setTimeout(function() {
      const detected = window.__LYTICUS__;
      _window.postMessage(
        {
          _lyticus: true,
          type: "detect",
          payload: detected
        },
        "*"
      );
      return;
    }, 100);
  });
}

function installScript(fn) {
  const source = ";(" + fn.toString() + ")(window)";
  const script = document.createElement("script");
  script.textContent = source;
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
}
