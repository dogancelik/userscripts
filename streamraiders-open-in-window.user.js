// ==UserScript==
// @name         StreamRaiders Open in Window
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Open StreamRaiders in a new window
// @match        https://www.streamraiders.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// ==/UserScript==

/* eslint-env jquery, es6 */

var windowName = 'streamraiders_oiw';

function addStyle() {
	$(`<style>
nav,
.footer-spacer-short,
#footer {
	display: none;
}

#game-container {
	position: fixed;
	height: 100% !important;
}

#game-client {
	height: 100%;
}
</style>`).appendTo('head');
}

function openInWindow(event) {
	event.preventDefault();
	window.open('https://www.streamraiders.com/game/', windowName, 'menubar=no, toolbar=no, location=no');
}

if (window.name === windowName) {
	addStyle();
} else {
	var navItem = $('#header-right .header-streamer'),
		navClone = navItem.clone();

	navClone.insertBefore(navItem);
	navClone.find('a').text('OPEN IN WINDOW').on('click', openInWindow);
}
