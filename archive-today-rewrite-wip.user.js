// ==UserScript==
// @name         Archive.today Rewrite WIP
// @namespace    dogancelik.com
// @version      1.1.0
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

/* eslint-env es6, browser */

for (var i = 0; i < 10000; i++) window.clearInterval(i);

let now = new Date(),
	newPath = window.location.pathname.replace('/wip', ''),
	isLoading = document.querySelector('img[src$="loading.gif"]'),
	isInQueue = document.querySelector('img + span').textContent.indexOf('in queue') > -1,
	getReqCount = (nodeList) => nodeList ? nodeList.length : 0,
	allRequests = document.querySelectorAll('tr[valign="top"]:not([style="background-color:silver"])'),
	finRequests = document.querySelectorAll('tr[valign="top"][style="background-color:#66FF66"]');

if (isInQueue) {
	// document.title = 'In queue';
} else if (isLoading) {
	// document.title = `Loading: ${getReqCount(finRequests)} / ${getReqCount(allRequests)}`;
}

// window.history.pushState(undefined, now.toString(), newPath);
console.log("Don't use this userscript, it erases the tab history.")
