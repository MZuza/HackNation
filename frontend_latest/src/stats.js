"use strict";
(function () {
    //TODO remove in production
    function addRequiredStyles() {
        var req = new XMLHttpRequest();
        req.open('GET', document.location.origin + '/version.txt', false);
        req.send(null);
        if (req.status === 200) {
            var link = document.createElement('link')
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', document.location.origin + '/styles.' + req.response + '.css');
            document.head.appendChild(link);
        }
    }

    addRequiredStyles();
    var body;
    document.addEventListener("DOMContentLoaded", function () {
        console.log(window.ResizeObserver)
        body = document.body;
        var observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                window.parent.postMessage({width: entry.contentRect.width, height: entry.contentRect.height}, '*')
            }
        })
        observer.observe(body)

    });
})();
