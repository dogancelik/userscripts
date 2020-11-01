// ==UserScript==
// @name         4chan Quick Copy Info
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Adds buttons for copying OP name, subject, message, date, number, thumbnail & file URL
// @match        https://desuarchive.org/*
// @match        https://boards.4chan.org/*
// @match        https://boards.4channel.org/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// ==/UserScript==

/* eslint-env es6, jquery */

var detected = '',
	queries = {
		fourchan: {
			op: ['.post.op', '$'],
			name: ['.postInfo.desktop .nameBlock'],
			subject: ['.postInfo.desktop .subject'],
			message: ['.postMessage', '@innerText'],
			datetime: ['.postInfo.desktop .dateTime', 'data-utc', (v) => (new Date(`${v}000`))],
			number: ['.postInfo.desktop .postNum.desktop a:last-child'],
			thumbnail: ['.file .fileThumb img', 'src'],
			file: ['.file .fileThumb', 'href'],
		},
		desuarchive: {
			op: ['.post_is_op', '$'],
			name: ['> header > .post_data > .post_poster_data'],
			subject: ['> header > .post_data > .post_title'],
			message: ['> .text', '@innerText'],
			datetime: ['> header > .post_data > .time_wrap > time', 'datetime', (v) => (new Date(v))],
			number: ['> header > .post_data > .time_wrap ~ a[data-post]', 'data-post'],
			thumbnail: ['> .thread_image_box > .thread_image_link > .post_image', 'src'],
			file: ['> .thread_image_box > .thread_image_link', 'href'],
		}
	};

function getThreadData(key, context) {
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
	if (location.hostname.indexOf('4channel.org') > -1 || location.hostname.indexOf('4chan.org') > -1) {
		detected = 'fourchan';
	} else if (location.hostname.indexOf('desuarchive.org') > -1) {
		detected = 'desuarchive';
	}

	return detected;
}

detectSite();

function qciEach(index, element) {
	let op = $(element),
		qci = $(`<div id="quick-copy-info-${index}" class="quick-copy-info">
	<b>Copy:</b>
	<button class="qci-name">Name</button>
	<button class="qci-subject">Subject</button>
	<button class="qci-message">Message</button>
	<span>|</span>
	<button class="qci-date">Date</button>
	<button class="qci-number">Number</button>
	<span>|</span>
	<button class="qci-thumbnail">Thumbnail</button>
	<button class="qci-file">File</button>
</div>`);

	qci.find('.qci-name').on('click', (e) => clip(e, getThreadData('name', op)));
	qci.find('.qci-subject').on('click', (e) => clip(e, getThreadData('subject', op)));
	qci.find('.qci-message').on('click', (e) => clip(e, getThreadData('message', op).replace(/\s+/g, ' ').trim()));
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
