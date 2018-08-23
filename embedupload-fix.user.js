// ==UserScript==
// @name        EmbedUpload Fix
// @description shows links without opening a new tab
// @namespace   dogancelik.com
// @include     http*://www.embedupload.com/?d=*
// @include     http*://embedupload.com/?d=*
// @version     2.0
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM.addStyle
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.registerMenuCommand
// @grant       GM.xmlHttpRequest
// ==/UserScript==

function getReveal() {
  return GM.getValue('reveal');
}

getReveal().then(val => {
  if (val === undefined)
    GM.setValue('reveal', 0);
});

GM.registerMenuCommand("Reveal links by click", function() {
  GM.setValue("reveal", 0);
});

GM.registerMenuCommand("Reveal all links on load", function() {
  GM.setValue("reveal", 1);
});

GM.addStyle(".DownloadNowFix { font-size: 12px; font-style: normal; }");

var exceptions = ['?MF'],
    split_first = "You should copy/paste the download link on a new browser window : ",
    split_last = "</b>";

function getLink(link) {
  GM.xmlHttpRequest({
    url: link.href,
    method: "GET",
    onload: function(res) {
      var data = res.responseText;

      var mirror_url,
          is_exception;
      
      for (var i = 0; i < exceptions.length; i++) {
        is_exception = link.href.indexOf(exceptions[i]) !== -1;
      }
      
      if (is_exception) {
        mirror_url = data.split(split_first)[1].split(split_last)[0].trim();
      } else {
        var container = document.createElement('div');
        container.innerHTML = data;
        mirror_url = container.querySelector("a[href^='http']").href;
      }

      link.className = "DownloadNowFix";
      link.target = "";
      link.href = mirror_url;
      link.innerHTML = mirror_url;
    }
  });
}

function loopLinks(callback) {
  var els = document.querySelectorAll(".DownloadNow");
  for (var i = 0; i < els.length; i++) {
    callback(els[i]);
  }
}

getReveal().then(val => {
if (val === 0) {
  loopLinks(function(el) {
    el.onclick = function(e) {
      if (el.className !== "DownloadNowFix") {
        getLink(el);
        e.preventDefault();
      }
    };
  });
} else if (val === 1) {
  window.onload = function() {
    loopLinks(function(el) {
      getLink(el);
    });
  };
}
});
