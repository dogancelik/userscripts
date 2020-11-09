// ==UserScript==
// @name         Mirrored.to Out URL Fix
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Skip monetization URL
// @match        https://www.mirrored.to/out_url
// @grant        none
// ==/UserScript==

var meta = document.querySelector('meta[http-equiv="Refresh"]');
if (meta) {
	let content = meta.getAttribute('content');
	if (content) {
		let urlSplit = content.split('URL=');
		if (urlSplit.length > 1) {
			let searchSplit = urlSplit[1].split('?');
			if (searchSplit.length > 1) {
				let params = new URLSearchParams(searchSplit[1]),
					url = params.get('s');
				if (url) {
					window.location.href = url;
				}
			}
		}
	}
}
