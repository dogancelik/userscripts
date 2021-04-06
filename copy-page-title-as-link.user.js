// ==UserScript==
// @name         Copy Page Title as Link
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Copy page address with page title or selected text as link to WYSIWYG editors
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

/* eslint-env jquery, browser, es6 */

const clickClass = 'click-required';

$(`<style>
#copy-to-clipboard {
	position: fixed;
	left: -9999px;
}

#copy-to-clipboard.${clickClass} {
	z-index: 9999;
	transform: translateY(-50%);
	top: 50%;
	left: 10%;
	right: 10%;
	background: rgba(0, 0, 0, 0.75);
	color: white;
	text-align: center;
	padding: 1vh;
	font-size: 10vh;
}
</style>`).appendTo('head');

var $link = $(`<a id="copy-to-clipboard" class="" href="#"></a>`)
	.click(copyToClipboard)
	.appendTo('body');

function copyToClipboard(event) {
	event.preventDefault();

	let sel = window.getSelection(),
		type = $link.data('type'),
		selStr = sel.toString().trim(),
		range = window.document.createRange();

	sel.empty();
	$link
		.attr('href', window.location.href)
		.text(type === 'page-title' ? window.document.title : selStr);
	range.selectNode($link[0]);
	sel.addRange(range);
	window.document.execCommand('copy');
	sel.empty();

	$link.removeClass(clickClass);
}

function showClickBox(type) {
	$link
		.text('Click to copy')
		.data({ type })
		.addClass(clickClass)
		.focus();
}

GM_registerMenuCommand('[T] Copy page title', () => showClickBox('page-title'), 'T');
GM_registerMenuCommand('[S] Copy selected text', () => showClickBox('selected'), 'S');
