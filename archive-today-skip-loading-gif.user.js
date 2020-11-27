// ==UserScript==
// @name         Archive.today Skip Loading GIF
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Try every domain until you skip the loading GIF
// @match        https://archive.today/*
// @match        https://archive.is/*
// @match        https://archive.li/*
// @match        https://archive.vn/*
// @match        https://archive.fo/*
// @match        https://archive.md/*
// @match        https://archive.ph/*
// @grant        none
// ==/UserScript==

var domains = [
	'archive.today',
	'archive.is',
	'archive.li',
	'archive.vn',
	'archive.fo',
	'archive.md',
	'archive.ph',
];

function getNextDomain(hostname) {
	let index = domains.indexOf(hostname);
	return domains[index + 1] ? domains[index + 1] : domains[0];
}

var loading = document.querySelector('img[src*="henley-putnam.edu"][src$="loading.gif"]');

if (loading) {
	location.hostname = getNextDomain(location.hostname);
}
