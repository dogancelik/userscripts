// ==UserScript==
// @name         Teams Fix Mute Key
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Make microphone mute key work in Microsoft Edge
// @match        https://teams.microsoft.com/*
// @require      https://cdn.jsdelivr.net/npm/hotkeys-js@3.8.7/dist/hotkeys.min.js
// @grant        none
// ==/UserScript==

/* eslint-env browser, es2020, greasemonkey */
/* global hotkeys */

hotkeys('ctrl+shift+m', function (event, handler) {
	event.preventDefault();
	document.getElementById('microphone-button').click();
});
