// ==UserScript==
// @name         Copy Page Title as Link
// @namespace    dogancelik.com
// @version      0.2.0
// @description  Copy page address with page title or selected text as link to WYSIWYG editors
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

/* eslint-env jquery, browser, es6 */

const mainSelector = '#copy-to-clipboard',
	clickClass = 'click-required';

$(`<style>
${mainSelector} {
	position: fixed;
	left: -9999px;
}

${mainSelector}.${clickClass} {
	z-index: 9999;
	transform: translateX(-50%) translateY(-50%);
	top: 50%;
	left: 50%;
	background: rgba(0, 0, 0, 0.75);
	color: white;
	text-align: center;
	padding: 10%;
	font-size: 5vw;
	border: 1px solid white;
	animation: borderChange 1s linear infinite alternate-reverse;
	box-sizing: content-box;
}

@keyframes borderChange {
	0% { border-width: 1px; }
	100% { border-width: 5px; }
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
	function focus() {
		$link
			.addClass(clickClass)
			.focus()
			.delay(5000)
			.fadeOut('fast', blur)
	}

	function blur() {
		$link
			.clearQueue()
			.blur()
			.removeClass(clickClass);
	}

	$link
		.text('Click to copy')
		.data({ type })
		.fadeIn('fast', focus)
}

GM_registerMenuCommand('[T] Copy page title', () => showClickBox('page-title'), 'T');
GM_registerMenuCommand('[S] Copy selected text', () => showClickBox('selected'), 'S');
