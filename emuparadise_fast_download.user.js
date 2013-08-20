// ==UserScript==
// @name        emuparadise fast download
// @namespace   dogancelik.com
// @description one click downloads for high quality soundtracks
// @include     http://www.emuparadise.me/soundtracks/highquality/*
// @grant       none
// @version     1.0
// ==/UserScript==

var links = document.querySelectorAll('a[href*="/soundtracks/highquality/download/"]');

function getMusicLink (doc) {
  var content = doc.getElementById("content");
  if (content != null) return content.querySelector('a[style*="font-size"]');
  return null;
}

var iframe;

(function initIframe () {
  iframe = document.createElement("iframe");
  iframe.addEventListener("load", function () {
    var link = getMusicLink(this.contentDocument);
    if (link != null) { // chrome fires load on empty src
      link.setAttribute("download", ""); // tell chrome this is a download
      link.click();
    }
  }, false);
  iframe.setAttribute("style", "visibility: hidden");
  document.body.appendChild(iframe);
})();

function onClick (e) {
  var url = e.target.parentElement.href;
  iframe.src = url;
  e.preventDefault();
}

for (var i = 0; i < links.length - 1; i++) {
  links[i].addEventListener("click", onClick, false);
}