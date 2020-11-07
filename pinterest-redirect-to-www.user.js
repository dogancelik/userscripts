// ==UserScript==
// @name         Pinterest Redirect to WWW
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Redirect to "www" subdomain
// @include      https://*.pinterest.*/*
// @grant        none
// ==/UserScript==

let currentHostname = window.location.hostname,
	wantedHostname = 'www.pinterest.com';

if (currentHostname !== wantedHostname) {
	window.location.hostname = wantedHostname;
}
