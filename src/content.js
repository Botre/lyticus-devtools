document.addEventListener("lyticus:track", function(e) {
  console.log(`%c[Lyticus]`, "color: #4954d8", e.detail);
  chrome.runtime.sendMessage({
    type: "track",
    payload: e.detail
  });
});
