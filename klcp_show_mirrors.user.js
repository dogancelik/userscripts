// ==UserScript==
// @name        KLCP Show Mirrors
// @namespace   dogancelik.com
// @include     http://codecguide.com/download*.htm
// @version     1.0
// @grant       none
// @updateURL   https://github.com/dogancelik/greasemonkey-scripts/raw/master/klcp_show_mirrors.user.js
// ==/UserScript==

var split = window.location.pathname.split('_');
var tag = split[split.length - 1];
var realTag = tag.substr(0, tag.length - 4);
document.getElementById(realTag).className = 'show';
