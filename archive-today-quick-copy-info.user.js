// ==UserScript==
// @name         Archive.today Quick Copy Info
// @namespace    dogancelik.com
// @version      0.1.0
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

function isTweet() {
	return data.wiki.url.indexOf('twitter.com') > -1 ||
		data.wiki.url.indexOf('threadreaderapp.com') > -1;
}

function getTweetText() {
	let tweet;
	if (tweet = document.querySelector('div[old-class="js-tweet-text-container"]')) {
		return tweet.textContent.trim();
	} else if (tweet = document.querySelector('div[id="tweet_1"]')) {
		return tweet.textContent.replace('\uF0C1', '').trim();
	} else {
		return undefined;
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
	${isTweet() ? '<button id="copy-tweet-text">Tweet Text</button>' : ''}
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
	qci.find('#copy-tweet-text').on('click', (e) => clip(e, getTweetText()));

	qci.find('#copy-archived-url-long').on('click', (e) => clip(e, data.share.longLink));
	qci.find('#copy-markdown').on('click', (e) => clip(e, data.share.markdown));
	qci.find('#copy-html-code').on('click', (e) => clip(e, data.share.htmlCode));
	qci.find('#copy-wiki-code').on('click', (e) => clip(e, data.share.wikiCode));

	qci.prependTo(header);
}
