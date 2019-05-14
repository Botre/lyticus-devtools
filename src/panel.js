import { format } from "date-fns";

chrome.storage.onChanged.addListener(function() {
  render();
});

function render() {
  chrome.storage.local.get(
    { configuration: {}, blacklist: [], events: [] },
    function({ configuration, blacklist, events }) {
      const output = document.querySelector("#lyticus-container");
      output.innerHTML = ``;
      /* Configuration */
      output.innerHTML += `<h2>Configuration</h2>`;
      output.innerHTML += `<pre>${JSON.stringify(
        configuration,
        null,
        2
      )}</pre>`;
      /* Blacklist */
      output.innerHTML += `<h2>Blacklist</h2>`;
      output.innerHTML += `<pre>${JSON.stringify(blacklist)}</pre>`;
      /* Events */
      output.innerHTML += `<h2>Events (${events.length})</h2>`;
      if (!events.length) {
        output.innerHTML += `<div><i>None</i></div>`;
      } else {
        const eventsContainer = document.createElement("div");
        events.forEach(function(event) {
          const { time, propertyId, development, type, ...rest } = event;
          const eventElement = document.createElement("div");
          eventElement.innerHTML += `<div>${format(
            new Date(time),
            "HH:mm:ss"
          )} - ${propertyId} - ${type}</div>`;
          eventElement.innerHTML += `<div><pre>${JSON.stringify(
            rest
          )}</pre></div>`;
          eventElement.innerHTML += `<div style="margin: 0.25rem 0; height: 0; border-top: 1px solid rgba(0,0,0,.1); border-bottom: 1px solid transparent;"></div>`;
          eventsContainer.appendChild(eventElement);
        });
        output.appendChild(eventsContainer);
      }
    }
  );
}

render();
