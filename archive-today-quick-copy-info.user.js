// ==UserScript==
// @name         Archive.today Quick Copy Info
// @namespace    dogancelik.com
// @version      0.2.1
// @description  Adds buttons for copying saved URL, archived URL, page title & tweet text
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @match        https://archive.today/*
// @match        https://archive.is/*
// @match        https://archive.li/*
// @match        https://archive.vn/*
// @match        https://archive.fo/*
// @match        https://archive.md/*
// @match        https://archive.ph/*
// @grant        none
// ==/UserScript==

/* eslint-env es6, jquery */
/* eslint-disable no-cond-assign */

var data = { share: {}, wiki: {} };

function extractData() {
	let shareKeys = ['shortLink', 'longLink', 'markdown', 'htmlCode', 'wikiCode'],
		wikiKeys = ['title', 'url', 'date', 'archiveurl', 'archivedate'];

	for (let key of shareKeys) {
		let element;
		if (element = document.getElementById(`SHARE_${key.toUpperCase()}`)) {
			data.share[key] = element.value;
		}
	}

	for (let key of wikiKeys) {
		let re = new RegExp(`^ \\| ${key}\\s*= (.*)`, 'm');
		data.wiki[key] = data.share.wikiCode.match(re)[1];
	}
	data.wiki.archivedate = data.wiki.archivedate.replace(' }}', '');
}

function getContextData(site, get) {
	if (site === 'twi') {
		if (get === 'is') {
			return data.wiki.url.indexOf('twitter.com') > -1 ||
				data.wiki.url.indexOf('threadreaderapp.com') > -1;
		} else if (get === 'text') {
			let tweet;
			if (tweet = document.querySelector('div[old-class*="permalink-tweet-container"] div[old-class="js-tweet-text-container"]')) {
				return tweet.textContent.trim();
			} else if (tweet = document.querySelector('div[id="tweet_1"]')) {
				return tweet.textContent.replace('\uF0C1', '').trim();
			} else {
				return undefined;
			}
		}
	} else if (site === '4ch') {
		if (get === 'is') {
			return data.wiki.url.indexOf('4chan.org') > -1 ||
				data.wiki.url.indexOf('4channel.org') > -1;
		} else if (get === 'text') {
			let subject = document.querySelector('[old-class*="opContainer"] [old-class~="postInfo"][old-class~="desktop"] [old-class*="subject"]').innerText,
				message = document.querySelector('[old-class*="opContainer"] [old-class*="postMessage"]').innerText;
			return subject + ' ' + message;
		} else if (get === 'date') {
			let date = document.querySelector('[old-class*="opContainer"] [old-class="dateTime"]').innerText;
			date = new Date(date);
			return date.toISOString();
		}
	}
}


function clip(event, text) {
	let target = $(event.delegateTarget),
		width = target.outerWidth(),
		oldText = target.text();
	navigator.clipboard.writeText(text)
		.then(() => target.outerWidth(width).text('Copied!'));
	setTimeout(() => target.removeAttr('style').text(oldText), 1000);
}

var header = $('#HEADER'),
	qci;

if (header.length > 0) {
	extractData();

	qci = $(`<div id="quick-copy-info" style="padding-top: 10px;">
	<b>Copy</b>
	<button id="copy-archived-url-short">Archived Link (Short)</button>
	<button id="copy-saved-url">Page URL</button>
	<button id="copy-page-title">Page Title</button>
	<button id="copy-archive-date">Archive Date</button>
	<span style="padding: 0 10px;">|</span>
	${getContextData('twi', 'is') ? '<button id="copy-tweet-text">Tweet Text</button>' : ''}
	${getContextData('4ch', 'is') ? '<button id="copy-4chan-text">OP Text</button>' : ''}
	${getContextData('4ch', 'is') ? '<button id="copy-4chan-date">OP Date</button>' : ''}
	<span style="padding: 0 10px;">|</span>
	<button id="copy-archived-url-long">Archived Link (Long)</button>
	<button id="copy-markdown">Markdown</button>
	<button id="copy-html-code">HTML code</button>
	<button id="copy-wiki-code">Wiki code</button>
</div>`);

	qci.find('#copy-archived-url-short').on('click', (e) => clip(e, data.share.shortLink));
	qci.find('#copy-saved-url').on('click', (e) => clip(e, data.wiki.url));
	qci.find('#copy-page-title').on('click', (e) => clip(e, data.wiki.title));
	qci.find('#copy-archive-date').on('click', (e) => clip(e, data.wiki.archivedate));

	qci.find('#copy-tweet-text').on('click', (e) => clip(e, getContextData('twi', 'text')));
	qci.find('#copy-4chan-text').on('click', (e) => clip(e, getContextData('4ch', 'text')));
	qci.find('#copy-4chan-date').on('click', (e) => clip(e, getContextData('4ch', 'date')));

	qci.find('#copy-archived-url-long').on('click', (e) => clip(e, data.share.longLink));
	qci.find('#copy-markdown').on('click', (e) => clip(e, data.share.markdown));
	qci.find('#copy-html-code').on('click', (e) => clip(e, data.share.htmlCode));
	qci.find('#copy-wiki-code').on('click', (e) => clip(e, data.share.wikiCode));

	qci.prependTo(header);
}
