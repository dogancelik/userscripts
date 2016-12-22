// ==UserScript==
// @name        Copyable Tracker List
// @namespace   dogancelik.com
// @include     http://torrenttrackerlist.com/torrent-tracker-list/*
// @include     http://www.torrenttrackerlist.com/torrent-tracker-list/*
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/copyable-torrent-tracker-list.user.js
// @version     1.0.2
// @grant       none
// ==/UserScript==

var pre = document.querySelector('pre.prettyprint');

var text = document.createElement('textarea');
text.textContent = pre.textContent;
text.rows = text.textContent.split('\n').length;
text.readOnly = true;

pre.parentNode.insertBefore(text, pre);
pre.parentNode.removeChild(pre);
