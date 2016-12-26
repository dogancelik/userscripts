// ==UserScript==
// @name        No Betting
// @namespace   dogancelik.com
// @description Closes betting sites automatically
// @include     *bahis*
// @include     *ukbet*
// @include     *albet*
// @include     *betpas*
// @version     1.0.0
// @grant       none
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/no-betting.user.js
// ==/UserScript==

window.close();

var i = document.createElement('iframe');
i.src = 'about:blank';
document.body.appendChild(i);
window.close = i.contentWindow.close;

window.close();
