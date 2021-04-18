// ==UserScript==
// @name        Github Add Commented
// @description Add "Commented" button to Issues page
// @namespace   dogancelik.com
// @include     https://github.com/issues/*
// @include     https://github.com/issues?*
// @include     https://github.com/issues
// @version     1.2.0
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/github-add-commented.user.js
// @icon        https://github.githubassets.com/favicons/favicon.png
// @grant       none
// ==/UserScript==

/* eslint-env jquery, greasemonkey */

var username = document.querySelector('meta[name="octolytics-actor-login"]').getAttribute('content'),
	defaultCommenterQuery = 'is:open is:issue commenter:' + username,
	justCommenterQuery = 'commenter:' + username;

function addItem(i, links) {
	let query = encodeURIComponent(defaultCommenterQuery),
		html = `<a href="/issues?q=${query}"
	aria-label="Issues commented on by you"
	class="js-selected-navigation-item subnav-item"
	data-selected-links="dashboard_commented /issues?q=${query}"
	role="tab">Commented</a>`;
	if (window.location.search.indexOf(query) > -1) {
		html = html.replace('js-selected-navigation-item', 'js-selected-navigation-item selected');
	}
	links.innerHTML = links.innerHTML + html;
}

function removeCommenter(i, e) {
	e.href = e.href.replace(encodeURIComponent(justCommenterQuery), '');
}

function check() {
	let links = $('nav.subnav-links'),
		isAdded = links[0].innerHTML.indexOf('Commented') > -1;
	if (links.length !== 0 && !isAdded) {
		$(links)
			.each(addItem)
			.find('a').on('click', check)
			.slice(0, 3).each(removeCommenter);
	} else setTimeout(check, 50);
}

$('#js-pjax-container').on('pjax:end', check);
$(document).ready(check);
