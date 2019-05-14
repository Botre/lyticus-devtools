function updateIcon() {
  chrome.tabs.query({ active: true }, function(tabs) {
    try {
      const tab = tabs[0];
      const url = new URL(tab.url);
      const origin = url.origin;
      chrome.storage.local.get({ blacklist: [] }, function({ blacklist }) {
        const suffix = blacklist.includes(origin) ? "-grayscale" : "";
        chrome.browserAction.setIcon({
          tabId: tab.id,
          path: {
            16: `icons/16x16${suffix}.png`,
            32: `icons/32x32${suffix}.png`,
            128: `icons/128x128${suffix}.png`
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  });
}

chrome.runtime.onInstalled.addListener(function() {
  updateIcon();
  chrome.browserAction.setBadgeBackgroundColor({ color: "#4954d8" });
});

chrome.tabs.onActivated.addListener(function() {
  updateIcon();
});

chrome.tabs.onUpdated.addListener(function() {
  updateIcon();
});

/* Manage blacklist */

let blacklist = [];

chrome.storage.local.get({ blacklist: [] }, function({
  blacklist: storageBlacklist
}) {
  blacklist = storageBlacklist;
  updateIcon();
});

chrome.storage.onChanged.addListener(function({ blacklist: storageBlacklist }) {
  if (storageBlacklist) {
    blacklist = [...storageBlacklist.newValue];
    updateIcon();
  }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  try {
    const url = new URL(tab.url);
    const origin = url.origin;
    chrome.storage.local.get({ blacklist: [] }, function({
      blacklist: storageBlacklist
    }) {
      let blacklist = [...storageBlacklist];
      if (blacklist.includes(origin)) {
        blacklist = blacklist.filter(
          blacklistedOrigin => blacklistedOrigin !== origin
        );
      } else {
        blacklist.push(origin);
      }
      blacklist.sort();
      chrome.storage.local.set({ blacklist });
    });
  } catch (error) {
    console.error(error);
  }
});

/* Ports */

const ports = [];

function postMessageToPorts(message) {
  ports.forEach(function(port) {
    port.postMessage(message);
  });
}

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name !== "devtools") {
    return;
  }
  ports.push(port);
  port.onDisconnect.addListener(function() {
    const i = ports.indexOf(port);
    if (i !== -1) {
      ports.splice(i, 1);
    }
  });
  port.onMessage.addListener(function(message) {
    console.log("DevTools message", message);
  });
});

/* Content script listeners */

chrome.runtime.onMessage.addListener(function(request) {
  console.log(request);
  if (request.type === "detect") {
    chrome.storage.local.set({ configuration: request.payload || null });
  } else if (request.type === "track") {
    chrome.storage.local.get({ events: [] }, function({ events }) {
      const merged = [...events, request.payload];
      merged.sort((a, b) => b.time - a.time);
      const sliced = merged.slice(0, 50);
      chrome.storage.local.set({ events: sliced });
    });
  }
});

/* Beacon interceptor */

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    try {
      const { initiator, method } = details;
      const url = new URL(initiator);
      const origin = url.origin;
      if (method === "OPTIONS") {
        return { cancel: false };
      }
      return { cancel: blacklist.includes(origin) };
    } catch (error) {
      console.error(error);
    }
    return { cancel: false };
  },
  { urls: ["*://beacon.lyticus.com/*"], types: ["xmlhttprequest"] },
  ["blocking"]
);
