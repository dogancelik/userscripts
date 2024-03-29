// ==UserScript==
// @name         Fast Redirect
// @namespace    dogancelik.com
// @version      0.7.1
// @description  Redirect to websites without waiting
// @match        https://www.pixiv.net/jump.php?*
// @match        https://www.youtube.com/redirect?*
// @match        https://hikarinoakari.com/out/*
// @match        https://www.pinterest.com/offsite/?*
// @match        http://joyreactor.cc/redirect?*
// @match        https://www.google.com/url?*
// @match        https://www.linkedin.com/safety/go?url=*
// @grant        none
// ==/UserScript==

/* eslint-env es6 */

function redirect(options) {
	if (options.type === 'search') {
		let params = new URLSearchParams(window.location.search);
		if (options.key != null) {
			window.location.href = params.get(options.key);
		} else {
			for (const entry of params) {
				if (entry[0].includes('http:') || entry[0].includes('https:')) {
					window.location.href = entry[0];
				}
				if (entry[1].includes('http:') || entry[1].includes('https:')) {
					window.location.href = entry[1];
				}
			}
		}
	} else if (options.type === 'match') {
		window.location.href = options.match();
	}
}

if (location.hostname.includes('pixiv') ||
	location.hostname.includes('youtube') ||
	location.hostname.includes('pinterest') ||
	location.hostname.includes('joyreactor') ||
	location.hostname.includes('google') ||
	location.hostname.includes('linkedin')) {
	redirect({
		type: 'search'
	});
} else if (location.hostname.includes('hikarinoakari')) {
	redirect({
		type: 'match',
		match: () => window.atob(window.location.href.match(/out\/\?(.+)\/?/)[1]),
	});
}
