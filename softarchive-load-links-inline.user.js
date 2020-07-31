// ==UserScript==
// @name         SoftArchive Load Links Inline
// @namespace    dogancelik.com
// @version      0.4.0
// @description  Retrieve links without leaving search page
// @author       Doğan Çelik
// @match        https://sanet.st/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

/* eslint-env jquery, es6, greasemonkey */

function loadLinksAs(type) {
	GM_setValue('load_links_as', type);
}

GM_registerMenuCommand('Load links as anchors', () => loadLinksAs('anchor'), undefined);
GM_registerMenuCommand('Load links as text', () => loadLinksAs('text'), undefined);

var darkTheme = $('head').find('link[rel="stylesheet"][href*="dark_theme"]').length > 0;

$('head').append(`<style>
.load_inline_btn {
padding: 5px;
border: 1px solid #ff962e;
color: ${darkTheme ? '#ff962e' : 'inherit'};
}
.load_inline_btn[disabled] {
opacity: 0.75;
}
.load_inline_btn, .load_inline_btn::before {
vertical-align: middle;
}
.load_inline_btn::before {
line-height: 1em;
}
.load_inline_btn:last-of-type {
margin-right: 3px;
}
.load_inline_box textarea {
width: 99%;
background-color: inherit;
color: inherit;
white-space: pre;
overflow-x: scroll;
}
.load_inline_box a {
display: block;
white-space: nowrap;
max-width: 100px;
}
</style>`);

function parsePage(html) {
	let dom = $('<div></div>').append($.parseHTML(html)),
		id = dom.find('.flag_news_id').attr('value'),
		links = dom.find('.c-dl-links a[rel~="external"]').map((i, e) => e.href).get();
	return { id, links };
}

function createTextarea(page) {
	let linksPre = page.links.join('\n') + '\n';
	return $(`<textarea readonly rows="${page.links.length + 1}">${linksPre}</textarea>`);
}

function createAnchors(page) {
	let els = $();
	for (let link of page.links) {
		let split = link.split('/');
		els = els.add($(`<a href="${link}" target="_blank">${split[2]} > ${split[split.length - 1]}</a>`));
	}
	return els;
}

function onLoadClick(event) {
	event.preventDefault();
	let button = $(event.currentTarget);
	button.html('Loading&hellip;').attr('disabled', 'disabled');
	$.ajax({
		url: button.attr('href'),
		success: function(data) {
			let page = parsePage(data),
				loadAs = GM_getValue('load_links_as'),
				loadBox = $(`<div class="markeredBlock load_inline_box"></div>`),
				appendEl = loadAs === 'text' ? createTextarea(page) : createAnchors(page);
			loadBox.append(appendEl);
			$(event.data.filerow).find('.markeredBlock').after(loadBox);
			button.hide();
		}
	});
}

function onThankClick(event) {
	event.preventDefault();
	let button = $(event.currentTarget);
	button.html('Loading&hellip;').attr('disabled', 'disabled');
	$.ajax({
		url: button.attr('href'),
		success: function(data) {
			let page = parsePage(data);
			$.ajax({
				url: '/ajax/thanks.ajax.php',
				data: { news_id: page.id },
				dataType: 'json',
				success: function(res) {
					button.html(res.status === 'success' ? 'Thanked!' : 'Failed!');
				}
			});
		}
	});
}

$('.titles_list_box .filerow').each(function() {
	let mainLink = $(this).find('.cellMainLink'),
		href = mainLink.attr('href');

	$(`<a href="${href}" class="load_inline_btn floatright sa sa-bookmarks">Say Thanks</a>`)
		.on('click', { filerow: this }, onThankClick)
		.prependTo(this.children[0]);

	$(`<a href="${href}" class="load_inline_btn floatright sa sa-download-spoiler">Load Links</a>`)
		.on('click', { filerow: this }, onLoadClick)
		.prependTo(this.children[0]);
});
