// ==UserScript==
// @name         Github Expand All Starred
// @namespace    dogancelik.com
// @version      0.1.1
// @description  Expand starred repositories on scroll
// @match        https://github.com/
// @icon         https://github.githubassets.com/favicons/favicon.png
// @grant        none
// ==/UserScript==

/* eslint-env es6 */

var news = document.querySelector('#dashboard .news'),
	activity = null,
	timer = null;

function expandDetails() {
	let buttons = activity.querySelectorAll('.Details:not(.Details--on) .js-details-target');
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].click();
	}
}

function callbackFirstLoad(records) {
	let div = news.querySelector('.js-all-activity-header + div[data-repository-hovercards-enabled]');
	if (div) {
		observer.disconnect();
		activity = div;
		window.addEventListener('scroll', expandDetails, false);
		expandDetails();
	}
}

var observer = new MutationObserver(callbackFirstLoad);

observer.observe(news, { childList: true });
