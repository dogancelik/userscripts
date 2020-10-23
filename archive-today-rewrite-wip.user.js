// ==UserScript==
// @name         Archive.today Rewrite WIP
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Visually removes "wip" from the URL
// @match        https://archive.today/wip/*
// @match        https://archive.is/wip/*
// @match        https://archive.li/wip/*
// @match        https://archive.vn/wip/*
// @match        https://archive.fo/wip/*
// @match        https://archive.md/wip/*
// @match        https://archive.ph/wip/*
// @grant        none
// ==/UserScript==

/* eslint-env es6, greasemonkey */

for (var i = 0; i < 10000; i++) window.clearInterval(i);

let now = new Date(),
	newPath = window.location.pathname.replace('/wip', '');

window.history.pushState(undefined, now.toString(), newPath);
