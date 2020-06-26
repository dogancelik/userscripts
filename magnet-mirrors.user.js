// ==UserScript==
// @name        Magnet Mirrors
// @description If a torrent is not available, get it from available mirrors (for Nyaa and RARBG)
// @namespace   dogancelik.com
// @include     *://nyaa.*/*
// @include     *://*.nyaa.*/*
// @include     *://rarbg.to/torrent/*
// @include     *://rarbgmirrored.org/torrent/*
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/magnet-mirrors.user.js
// @version     1.0.0
// @grant       none
// ==/UserScript==

/* eslint-env jquery, es6 */

function query(query) {
	Array.prototype.slice.call(document.querySelectorAll(query));
}

function addStyle(style) {
	var el = document.createElement('style');
	el.innerHTML = style;
	document.head.appendChild(el);
}

function getMagnetInfo(url) {
	let part1 = url.split('magnet:?xt=urn:btih:')[1].split('&dn='),
			title = part1[1].split('&tr=')[0];

	return {
		hash: part1[0],
		title: decodeURIComponent(title).trim()
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
	let info = getMagnetInfo(el.href);
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

if (window.location.hostname.includes('nyaa.net')) {
	nyaaNet();
} else if (window.location.hostname.includes('nyaa.si')) {
	nyaaSi();
} else if (window.location.hostname.includes('rarbg')) {
	rarbg();
}
