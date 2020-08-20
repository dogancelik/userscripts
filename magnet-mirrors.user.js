// ==UserScript==
// @name        Magnet Mirrors
// @description If a torrent is not available, get it from available mirrors (for Nyaa and RARBG)
// @namespace   dogancelik.com
// @include     *://nyaa.*/*
// @include     *://*.nyaa.*/*
// @include     *://rarbg.to/torrent/*
// @include     *://rarbgmirrored.org/torrent/*
// @include     *://www.btmovi.space/so/*
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/magnet-mirrors.user.js
// @version     1.1.0
// @grant       none
// ==/UserScript==

/* eslint-env jquery, es6 */

function query(query) {
	return Array.prototype.slice.call(document.querySelectorAll(query));
}

function addStyle(style) {
	var el = document.createElement('style');
	el.innerHTML = style;
	document.head.appendChild(el);
}

function getMagnetInfo(el) {
	let hash, title;
	if (el.href.includes('.html')) {
		hash = el.href.match(/(\w+)\.html/i)[1];
		title = el.textContent.trim();
	} else if (el.href.includes('magnet:')) {
		hash = el.href.match(/urn:btih:(\w+)/i)[1];
		title = el.href.match(/&dn=([^&]+)/i)[1];
		title = decodeURIComponent(title).trim();
	}

	return {
		hash: hash,
		title: title
	};
}

function insertClone(el, href) {
	let clone = el.cloneNode(),
		text = href.match(/https?:\/\/(\w+)/i)[1];

	clone.innerText = '[' + text.substr(0, 2) + ']';
	clone.href = href;
	clone.target = '_blank';

	let space = document.createTextNode(' ');

	el.parentElement.insertBefore(space, el.nextSibling);
	el.parentElement.insertBefore(clone, el.nextSibling);
	el.parentElement.insertBefore(space, el.nextSibling);
}

function addMirrors(el, i) {
	let info = getMagnetInfo(el);
	insertClone(el, `http://itorrents.org/torrent/${info.hash}.torrent`);
	insertClone(el, `http://torrage.info/torrent.php?h=${info.hash}`);
	insertClone(el, `http://btcache.me/torrent/${info.hash.toUpperCase()}`);
}

function nyaaNet() {
	addStyle(`
	.tr-links {
		width: 120px;
		padding-right: 10px !important;
	}

	.tr-links a {
		display: inline-block;
	}
	`);

	query('.tr-links a[href^="magnet:"], .torrent-buttons .download[href^="magnet:"]').forEach(addMirrors);
}

function nyaaSi() {
	query('.torrent-list a[href^="magnet:"], .card-footer-item[href^="magnet:"]').forEach(addMirrors);
}

function rarbg() {
	query('.lista a[href^="magnet:"]').forEach(addMirrors);
}

function btmovi() {
	query('.search-item .item-title h3 a').forEach(addMirrors);
}

if (window.location.hostname.includes('nyaa.net')) {
	nyaaNet();
} else if (window.location.hostname.includes('nyaa.si')) {
	nyaaSi();
} else if (window.location.hostname.includes('rarbg')) {
	rarbg();
} else if (window.location.hostname.includes('btmovi')) {
	btmovi();
}
