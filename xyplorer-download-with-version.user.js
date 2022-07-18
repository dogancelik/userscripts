// ==UserScript==
// @name         XYplorer Download with Version
// @namespace    dogancelik.com
// @version      0.1.1
// @description  Download files with their versions appended to their filenames
// @match        https://www.xyplorer.com/download.php
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// ==/UserScript==

/* eslint-env jquery, browser, es2020, greasemonkey */

function getFilename(href) {
	return href.split('/').pop();
}

function parseFilename(filename) {
	const match = filename.match(/(.*)(\.(zip|rar))/i);
	if (!match) throw new Error(`No match: ${filename}`);
	return {
		basename: match[1],
		extension: match[2],
	};
}

function getVersion(element) {
	const td = element.closest('.licbox')
		.find('tr:nth(2) td:last');
	return td.length > 0 ? td[0].firstChild.textContent.trim() : '';
}

function addVersion() {
	const el = $(this),
		href = el.attr('href'),
		filename = getFilename(href),
		parts = parseFilename(filename),
		version = getVersion(el);
	el.attr('download', `${parts.basename} ${version}${parts.extension}`)
}

function getQuery(extensions) {
	const split = extensions.split(',');
	return split.map(e => `a[href$="${e}"]`).join(',');
}

$(getQuery('zip,rar')).each(addVersion);
