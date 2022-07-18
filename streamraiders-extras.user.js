// ==UserScript==
// @name         StreamRaiders Extras
// @namespace    dogancelik.com
// @version      0.2.1
// @description  Open StreamRaiders in a new window or toggle header/footer
// @match        https://www.streamraiders.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// ==/UserScript==

/* eslint-env jquery, es6 */

// Open in Window
var windowName = 'streamraiders_oiw';

function addStyleWindow() {
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
	window.close();
	window.open('https://www.streamraiders.com/game/', windowName, 'menubar=no, toolbar=no, location=no');
}

function addOiwLink() {
	var navItem = $('#header-right .header-streamer'),
		navClone = navItem.clone();

	navClone.insertBefore(navItem);
	navClone.find('a').text('OPEN IN WINDOW').on('click', openInWindow);
}

// Toggle header/footer
function addStyleTab() {
	$(`<style>
.toggle-nav.nav-hidden .wrapper > nav,
.toggle-nav.nav-hidden #footer {
	display: none;
}

.toggle-nav .toggle-nav-link {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 999;
	display: inline-block;
	background-color: rgba(50, 50, 50, 0.5);
	border: 1px solid black;
	opacity: 0.5;
	padding: 0.25rem;
	font-size: 0.75rem;
	text-align: center;
}

.toggle-nav .toggle-nav-link:hover {
	opacity: 1;
}
</style>`).appendTo('head');
}

function toggleNavClick(event) {
	event.preventDefault();
	$('body').toggleClass('nav-hidden');
}

function addThLink() {
	$('body').addClass('toggle-nav');
	$(`<a class="toggle-nav-link" href="#">Toggle<br>Nav</a>`)
		.click(toggleNavClick)
		.appendTo('body');
}

if (window.name === windowName) {
	addStyleWindow();
} else {
	addOiwLink();
	addStyleTab();
	addThLink();
}
