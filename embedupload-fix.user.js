// ==UserScript==
// @name        EmbedUpload Fix
// @description Shows links without opening a new tab
// @namespace   dogancelik.com
// @include     *://www.embedupload.com/?d=*
// @include     *://embedupload.com/?d=*
// @version     1.1
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM.addStyle
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.registerMenuCommand
// @grant       GM.xmlHttpRequest
// ==/UserScript==

function getReveal() {
	return GM_getValue('reveal') || 0;
}

var reveal = getReveal();

GM_registerMenuCommand('Reveal links by click', function() {
	GM_setValue('reveal', 0);
});

GM_registerMenuCommand('Reveal all links on load', function() {
	GM_setValue('reveal', 1);
	loopLinks(getLink);
});

GM_addStyle('.DownloadNowFix { font-size: 12px; font-style: normal; }');

function getLink(link) {
	let exceptions = ['?MF'],
		split_first = 'You should copy/paste the download link on a new browser window : ',
		split_last = '</b>';

	function parsePage(res) {
		let data = res.responseText,
			mirror_url,
			is_exception;

		for (let i = 0; i < exceptions.length; i++) {
			is_exception = link.href.indexOf(exceptions[i]) !== -1;
		}

		if (is_exception) {
			mirror_url = data.split(split_first)[1].split(split_last)[0].trim();
		} else {
			let container = document.createElement('div');
			container.innerHTML = data;
			mirror_url = container.querySelector('a[href^="http"]').href;
		}

		link.className = 'DownloadNowFix';
		link.target = '';
		link.href = mirror_url;
		link.innerHTML = mirror_url;
	}

	GM_xmlhttpRequest({
		url: link.href,
		method: 'GET',
		onload: parsePage
	});
}

function loopLinks(callback) {
	let els = document.querySelectorAll('.DownloadNow');
	for (let i = 0; i < els.length; i++) {
		callback(els[i]);
	}
}

function revealOnClick(el) {
	el.addEventListener('click', function(e) {
		if (el.className !== 'DownloadNowFix') {
			getLink(el);
			e.preventDefault();
		}
	}, false);
}

if (reveal === 0) {
	loopLinks(revealOnClick);
} else if (reveal === 1) {
	loopLinks(getLink);
}
