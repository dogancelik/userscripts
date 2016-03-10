// ==UserScript==
// @name        KLCP Show Mirrors
// @namespace   dogancelik.com
// @include     http://codecguide.com/download*.htm
// @version     1.0
// @grant       none
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/klcp-show-mirrors.user.js
// ==/UserScript==

var split = window.location.pathname.split('_');
var tag = split[split.length - 1];
var realTag = tag.substr(0, tag.length - 4);
document.getElementById(realTag).className = 'show';
