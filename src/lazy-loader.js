!function (initialize) {
  "function" == typeof define && define.amd ? define(initialize) : initialize();
}(function () {
  var userInteractions = [];

  !function () {
    var interactionsToWatch = ["click", "mousemove", "keydown", "touchstart", "touchmove", "wheel"];
    var lazyScripts = document.querySelectorAll("script[data-src]");
    var lazyLinks = document.querySelectorAll("link[data-href]");

    if (lazyScripts.length || lazyLinks.length) {
      var recordInteraction = function (event) {
        userInteractions.push(event);
      };

      document.addEventListener("click", recordInteraction, { passive: true });

      var timeoutID = setTimeout(loadResources, 10000);

      interactionsToWatch.forEach(function (eventType) {
        window.addEventListener(eventType, loadResources, { passive: true });
      });
    }

    function loadScript(index) {
      var scriptElement = lazyScripts[index];

      scriptElement.onload = function () {
        if (index >= lazyScripts.length - 1) {
          window.dispatchEvent(new Event("DOMContentLoaded"));
          window.dispatchEvent(new Event("load"));

          document.removeEventListener("click", recordInteraction);

          userInteractions.forEach(function (event) {
            var replayEvent = new MouseEvent("click", {
              view: event.view,
              bubbles: true,
              cancelable: true
            });
            event.target.dispatchEvent(replayEvent);
          });

          return;
        }

        loadScript(index + 1);
      };

      scriptElement.src = scriptElement.getAttribute("data-src");
    }

    function loadResources() {
      clearTimeout(timeoutID);

      interactionsToWatch.forEach(function (eventType) {
        window.removeEventListener(eventType, loadResources, { passive: true });
      });

      lazyScripts.forEach(function (script) {
        var src = script.getAttribute("data-src");
        if (!src.startsWith("data:")) {
          var preloadLink = document.createElement("link");
          preloadLink.rel = "preload";
          preloadLink.as = "script";
          preloadLink.href = src;
          document.head.appendChild(preloadLink);
        }
      });

      if (lazyScripts.length) loadScript(0);

      lazyLinks.forEach(function (link) {
        link.href = link.getAttribute("data-href");
      });
    }
  }();
});
