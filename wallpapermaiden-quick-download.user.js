// ==UserScript==
// @name         WallpaperMaiden Quick Download
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Download all resolutions without waiting
// @match        https://www.wallpapermaiden.com/wallpaper/*
// @icon         https://www.wallpapermaiden.com/images/favicons/favicon-96x96.png
// @grant        GM_addStyle
// ==/UserScript==

var className = '.wallpaperPreviewContent .wpPreviewSection .wpPreviewDefault .wpPreviewSectionContent .wpPSCInside .wpPSCSection .wpPSCList ul li a';

GM_addStyle(`
.defaultButton[style][onclick],
.adsbygoogle {
	display: none !important;
}

${className} {
	background-color: #892c2c;
	color: white;
}

${className}:hover {
	background-color: #ca3e3e;
}
`);

function updateHref(el) {
	let split = el.href.split('/'),
		res = split.pop(),
		dl = split.pop(),
		name = split.pop();
	el.setAttribute('class', 'defaultButton');
	el.setAttribute('download', 'download');
	el.href = split.concat([dl, res, name]).join('/') + '?start_download=true';
}

var resLinks = document.querySelectorAll('.wpPSCList a');
Array.from(resLinks).forEach(updateHref);
