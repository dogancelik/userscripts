// ==UserScript==
// @name        Copyable Tracker List
// @namespace   dogancelik.com
// @include     http://torrenttrackerlist.com/torrent-tracker-list/*
// @include     http://www.torrenttrackerlist.com/torrent-tracker-list/*
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/copyable-torrent-tracker-list.user.js
// @version     1.1.0
// @grant       none
// ==/UserScript==

function getTrackerList () {
  return document.querySelector('pre.prettyprint').textContent;
}

var trackers = getTrackerList();

var post = document.querySelector('.entry-content');
post.innerHTML = '';

var text = document.createElement('textarea');
text.textContent = trackers;
text.rows = text.textContent.split('\n').length;
text.readOnly = true;

post.appendChild(text);
