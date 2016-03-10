// ==UserScript==
// @name        YouTube Search Export Links
// @description Exports YouTube search result links into a textarea
// @namespace   dogancelik.com
// @include     https://www.youtube.com/results*
// @version     1.0
// @grant       GM_registerMenuCommand
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/youtube-search-export-links.user.js
// ==/UserScript==

var EL_ID = 'export-yt-links';

function getLinks() {
  return Array.prototype.slice.call(document.querySelectorAll(".yt-uix-tile-link")).map(function(i){ return i.href; });
}

function onDblClick() {
  this.parentNode.removeChild(this);
}

function createBox(links) {
  var box = document.createElement('textarea');
  box.value = links.join('\n');
  box.ondblclick = onDblClick;
  return box;
}

function styleBox(box, links) {
  box.id = EL_ID;
  box.style.position = 'fixed';
  box.style.top = '10%';
  box.style.right = '10%';
  box.style.width = '350px';
}

function autoSize(box) {
  box.style.height = '1em';
  box.style.height = box.scrollHeight + 'px';
}

function exportLinks() {
  var links = getLinks();
  var box = document.getElementById(EL_ID);
  if (box == null) {
    var box = createBox(links);
    styleBox(box);
    document.body.appendChild(box);
  } else {
    box.value = links.join('\n');
  }
  autoSize(box);
}

GM_registerMenuCommand('Export YouTube Links', exportLinks);
