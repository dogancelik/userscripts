// ==UserScript==
// @name         4chan Quick Copy Info
// @namespace    dogancelik.com
// @version      0.3.0
// @description  Adds buttons for copying OP name, subject, message, date, number, thumbnail & file URL
// @match        https://boards.4chan.org/*
// @match        https://boards.4channel.org/*
// @match        https://yuki.la/*
// @match        https://desuarchive.org/*
// @match        https://archive.nyafuu.org/*
// @match        https://archive.rebeccablacktech.com/*
// @match        https://archived.moe/*
// @match        https://archive.4plebs.org/*
// @match        https://thebarchive.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// ==/UserScript==

/* eslint-env es6, jquery */

this.$ = this.jQuery = jQuery.noConflict(true);

var detected = '',
	queries = {
		fourchan: {
			_domains: [
				'boards.4channel.org',
				'boards.4chan.org',
				'yuki.la'
			],
			op: ['.post.op', '$'],
			name: ['.postInfo.desktop .nameBlock'],
			subject: ['.postInfo.desktop .subject'],
			message: ['.postMessage', '@innerText'],
			datetime: ['.postInfo.desktop .dateTime', 'data-utc', (v) => (new Date(parseInt(`${v}000`, 10)))],
			number: ['.postInfo.desktop .postNum.desktop a:last-of-type'],
			thumbnail: ['.file .fileThumb img', 'src'],
			file: ['.file .fileThumb', 'href'],
			link: ['.postInfo.desktop .postNum a[href^="#"]', '@href', (v) => v.replace(/#.*/, '')]
		},
		desuarchive: {
			_domains: [
				'desuarchive.org',
				'archive.nyafuu.org',
				'archive.rebeccablacktech.com',
				'archived.moe',
				'archive.4plebs.org',
				'thebarchive.com',
			],
			op: ['article.thread', '$'],
			name: ['> header > .post_data > .post_poster_data'],
			subject: ['> header > .post_data > .post_title'],
			message: ['> .text', '@innerText'],
			datetime: ['> header > .post_data > .time_wrap > time', 'datetime', (v) => (new Date(v))],
			number: ['> header > .post_data > .time_wrap ~ a[data-post]', 'data-post'],
			thumbnail: ['> .thread_image_box > .thread_image_link > img', 'src'],
			file: ['> .thread_image_box > .thread_image_link', 'href'],
			link: ['.post_controls a[href^="//"]', '@href'],
		}
	};

function getThreadData(key, context, modifyFinal) {
	let [query, attr, modify] = queries[detected][key],
		el = $(query, context);

	if (el.length) {
		let val;
		if (attr && attr.length > 0) {
			if (attr[0] === '@') {
				val = el[0][attr.substr(1)];
			} else if (attr[0] === '$') {
				val = el;
			} else {
				val = el.attr(attr).trim();
			}
		} else {
			val = el.text().trim();
		}

		if (modify) {
			val = modify(val, el);
		}

		if (modifyFinal) {
			val = modifyFinal(val, el);
		}

		return val;
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

function detectSite() {
	let keys = Object.keys(queries);
	for (let key of keys) {
		let domains = queries[key]._domains;
		for (let domain of domains) {
			if (location.hostname.indexOf(domain) > -1) {
				detected = key;
			}
		}
	}

	return detected;
}

detectSite();

function getAccessData(op) {
	const subject = getThreadData('subject', op),
		message = getThreadData('message', op, trim),
		date = getThreadData('datetime', op).toISOString().split('T')[0].replace(/-/g, '.'),
		link = getThreadData('link', op);
	return link + '\t' +
		(subject ? subject : '') +
		(subject && message ? ' - ' : '') +
		(message ? message : '') + '\t' +
		date;
}

function trim(str) {
	return str.replace(/\s+/g, ' ').trim();
}

function qciEach(index, element) {
	let op = $(element),
		qci = $(`<div id="quick-copy-info-${index}" class="quick-copy-info">
	<b>Copy:</b>
	<button type="button" class="qci-link">Link</button>
	<span>|</span>
	<button type="button" class="qci-name">Name</button>
	<button type="button" class="qci-subject">Subject</button>
	<button type="button" class="qci-message">Message</button>
	<span>|</span>
	<button type="button" class="qci-date">Date</button>
	<button type="button" class="qci-number">Number</button>
	<span>|</span>
	<button type="button" class="qci-thumbnail">Thumbnail</button>
	<button type="button" class="qci-file">File</button>
	<span>|</span>
	<button type="button" class="qci-access">Access</button>
</div>`);

	qci.find('.qci-link').on('click', (e) => clip(e, getThreadData('link', op)));
	qci.find('.qci-access').on('click', (e) => clip(e, getAccessData(op)));
	qci.find('.qci-name').on('click', (e) => clip(e, getThreadData('name', op)));
	qci.find('.qci-subject').on('click', (e) => clip(e, getThreadData('subject', op)));
	qci.find('.qci-message').on('click', (e) => clip(e, getThreadData('message', op, trim)));
	qci.find('.qci-date').on('click', (e) => clip(e, getThreadData('datetime', op)));
	qci.find('.qci-number').on('click', (e) => clip(e, getThreadData('number', op)));
	qci.find('.qci-thumbnail').on('click', (e) => clip(e, getThreadData('thumbnail', op)));
	qci.find('.qci-file').on('click', (e) => clip(e, getThreadData('file', op)));

	qci.insertBefore(op);
}

var ops = getThreadData('op');

if (ops.length > 0) {
	$(`<style>
.quick-copy-info {
	padding: 10px;
	text-align: center;
}

.quick-copy-info span {
	padding: 0 10px;
}

.quick-copy-info button {
	min-width: 61px;
}
</style>`).appendTo('head');

	ops.each(qciEach);
}
