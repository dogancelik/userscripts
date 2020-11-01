// ==UserScript==
// @name         Archive.today This Page
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Adds a menu item with a keyboard shortcut to archive the current page.
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// ==/UserScript==

/* eslint-env es6, greasemonkey */

function gotoArchive(loc, newTab) {
	let newLoc = 'https://archive.is/?url=' + encodeURIComponent(loc);
	if (newTab === 'bg') {
		GM_openInTab(newLoc, { active: false });
	} else if (newTab === 'fg') {
		GM_openInTab(newLoc, { active: true });
	} else if (newTab === 'cur') {
		window.location.href = newLoc;
	}
}

GM_registerMenuCommand('[C] Archive Page in Current Tab', function() {
	gotoArchive(window.location.href, 'cur');
}, 'C');

GM_registerMenuCommand('[F] Archive Page in New Tab', function() {
	gotoArchive(window.location.href, 'fg');
}, 'F');

GM_registerMenuCommand('[B] Archive Page in Background Tab', function() {
	gotoArchive(window.location.href, 'bg');
}, 'B');
