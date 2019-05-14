chrome.devtools.panels.create("Lyticus", null, "panel.html", function(
  extensionPanel
) {
  let _window = null;
  const data = [];
  const port = chrome.runtime.connect({ name: "devtools" });

  port.onMessage.addListener(function(message) {
    if (_window) {
      _window.processMessage(message);
    } else {
      data.push(message);
    }
  });

  extensionPanel.onShown.addListener(function fn(panelWindow) {
    extensionPanel.onShown.removeListener(fn);
    _window = panelWindow;
    let message;
    while ((message = data.shift())) {
      _window.processMessage(message);
    }
  });
});
