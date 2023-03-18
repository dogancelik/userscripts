// ==UserScript==
// @name         VirusTotal Auto Dark Mode
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Sync VirusTotal dark theme with system color scheme
// @match        https://www.virustotal.com/*
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function getBsTheme() {
	return document.documentElement.getAttribute('data-bs-theme');
}

function setIsDark(isDark) {
	const theme = getBsTheme();
	if (theme !== 'dark' && isDark) {
		document.documentElement.setAttribute('data-bs-theme', 'dark');
		unsafeWindow.localStorage.setItem('colorMode', 'dark');
	}
}

function queryListener(event) {
	setIsDark(event.matches);
}

setIsDark(darkQuery.matches);
darkQuery.addEventListener('change', queryListener);

function startObserver() {
	function observerCallback() {
		setIsDark(darkQuery.matches);
	}
	const observer = new MutationObserver(observerCallback),
		config = { attributes: true };
	observer.observe(document.documentElement, config);
}
