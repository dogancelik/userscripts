// ==UserScript==
// @name        Magnet Mirrors
// @description If a torrent is not available, get it from available mirrors (for Nyaa and RARBG)
// @namespace   dogancelik.com
// @include     *://nyaa.*/*
// @include     *://*.nyaa.*/*
// @include     *://rarbg.to/torrent/*
// @include     *://rarbgmirrored.org/torrent/*
// @include     *://www.btmovi.space/so/*
// @include     *://bt4g.org/*
// @include     *://thepiratebay.org/search.php?*
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/magnet-mirrors.user.js
// @version     1.2.0
// @grant       none
// ==/UserScript==

/* eslint-env jquery, es6 */
/* eslint-disable no-cond-assign, no-unused-vars */

function query(query) {
	return Array.prototype.slice.call(document.querySelectorAll(query));
}

function addStyle(style) {
	var el = document.createElement('style');
	el.innerHTML = style;
	document.head.appendChild(el);
}

function addColors(colors) {
	let style = `.magnet-mirror { padding: 0 3px; border-radius: 3px; transition: all 0.3s; }`,
		dec = (hex, start) => +(`0x${hex.substr(start, 2)}`),
		rgba = (hex, opacity) => opacity < 1.0 ? `rgba(${dec(hex, 0)}, ${dec(hex, 2)}, ${dec(hex, 4)}, ${opacity})` : `#${hex}`;
	for (let i = 0; i < colors.length; i++) {
		console.log(i, colors[i]);
		style += `
.magnet-mirror-${i+1} {
	background-color: ${rgba(colors[i], 0.65)};
	color: white;
}
.magnet-mirror-${i+1}:hover {
	background-color: white;
	color: ${rgba(colors[i], 1.0)};
}
`;
	}
	addStyle(style);
}

var bt4gMagnet = /\/hash\/([a-z0-9]{40})\?name=/i;

function getMagnetInfo(el) {
	let hash, title, match;
	if (el.href.includes('.html')) {
		hash = el.href.match(/(\w+)\.html/i)[1];
		title = el.textContent.trim();
	} else if (el.href.includes('magnet/')) {
		hash = el.href.match(/magnet\/(\w+)/i)[1];
		title = el.textContent.trim();
	} else if (el.href.includes('magnet:')) {
		hash = el.href.match(/urn:btih:(\w+)/i)[1];
		title = el.href.match(/&dn=([^&]+)/i)[1];
		title = decodeURIComponent(title).trim();
	} else if (match = el.href.match(bt4gMagnet)) {
		hash = match[1];
		let params = new URLSearchParams(el.search);
		title = params.get('name');
	}

	return {
		hash: hash,
		title: title
	};
}

function insertClone(el, index, href) {
	let clone = el.cloneNode(),
		text = href.match(/https?:\/\/(\w+)/i)[1];

	clone.innerText = text.substr(0, 2);
	clone.className = 'magnet-mirror magnet-mirror-' + index;
	clone.href = href;
	clone.target = '_blank';

	let space = document.createTextNode(' ');

	el.parentElement.insertBefore(space, el.nextSibling);
	el.parentElement.insertBefore(clone, el.nextSibling);
	el.parentElement.insertBefore(space, el.nextSibling);
	return clone;
}

function addMirrors(el, i) {
	let info = getMagnetInfo(el),
		ref = el,
		j = 0,
		title = encodeURIComponent(info.title);
	ref = insertClone(ref, ++j, `https://itorrents.org/torrent/${info.hash}.torrent${info.title ? '?title=' + title : ''}`);
	ref = insertClone(ref, ++j, `https://torrage.info/torrent.php?h=${info.hash}`);
	ref = insertClone(ref, ++j, `https://btcache.me/torrent/${info.hash.toUpperCase()}${info.title ? '?name=' + title : '' }`);
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

function bt4g() {
	if (location.pathname === '/') {
		query('.col.s12.m6').forEach(el => el.className = el.className.replace('m6', 'm12'));
	}
	query('h5 a[title], a[href^="/magnet/"], a[href*="/hash/"][rel="nofollow"]').forEach(addMirrors);
}

function tpb() {
	query('.list-entry .item-icons a[href^="magnet"]').forEach(addMirrors);
}

addColors(['f72585','3a0ca3','4361ee']);

if (window.location.hostname.includes('nyaa.net')) {
	nyaaNet();
} else if (window.location.hostname.includes('nyaa.si')) {
	nyaaSi();
} else if (window.location.hostname.includes('rarbg')) {
	rarbg();
} else if (window.location.hostname.includes('btmovi')) {
	btmovi();
} else if (window.location.hostname.includes('bt4g')) {
	bt4g();
} else if (window.location.hostname.includes('thepiratebay')) {
	tpb();
}
