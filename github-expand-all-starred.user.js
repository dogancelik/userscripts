// ==UserScript==
// @name         Github Expand All Starred
// @namespace    dogancelik.com
// @version      0.2.0
// @description  Expand starred repositories on scroll
// @match        https://github.com/
// @icon         https://github.githubassets.com/favicons/favicon.png
// @grant        none
// ==/UserScript==

/* eslint-env es6 */

var news = document.querySelector('#dashboard .news'),
	activity = null,
	timer = null;

function expandDetails(starred) {
	let buttons = activity.querySelectorAll(
		(starred ? '.watch_started' : '') +
		' .Details:not(.Details--on) .js-details-target'
	);
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].click();
	}
}

function callbackFirstLoad(records) {
	let div = news.querySelector('h2 + div[data-repository-hovercards-enabled]');
	if (div) {
		activity = div;
		expandDetails(true);
	}
}

var observer = new MutationObserver(callbackFirstLoad);
observer.observe(news, { subtree: true, childList: true });
