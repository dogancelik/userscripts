// ==UserScript==
// @name        Copyable Tracker List
// @namespace   dogancelik.com
// @include     http://torrenttrackerlist.com/torrent-tracker-list/
// @version     1.0.0
// @grant       none
// ==/UserScript==

var pre = document.querySelector('h2 + pre');

var text = document.createElement('textarea');
text.textContent = pre.textContent;
text.rows = text.textContent.split('\n').length;
text.readOnly = true;

pre.parentNode.insertBefore(text, pre);
pre.parentNode.removeChild(pre);
