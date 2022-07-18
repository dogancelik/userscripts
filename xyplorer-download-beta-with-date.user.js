// ==UserScript==
// @name         XYplorer Download Beta with Date
// @namespace    dogancelik.com
// @version      0.2.0
// @description  try to take over the world!
// @match        https://www.xyplorer.com/xyfc/viewtopic.php?f=1&t=4&start=*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.scrollto@2.1.3/jquery.scrollTo.min.js
// ==/UserScript==

/* eslint-env jquery, browser, es2020, greasemonkey */

$(`<style>
div.post:nth-last-of-type(3)
a.postlink[href$='noinstall.zip']:last-of-type {
	color: red;
	text-shadow: 0 0 3px yellow;
}

@media (prefers-color-scheme: dark) {
div.post:nth-last-of-type(3)
a.postlink[href$='noinstall.zip']:last-of-type {
	text-shadow: 0 0 3px white;
}
}
</style>`).appendTo('head');

const isLastPage = $('.action-bar.bar-bottom li.active:last-child').length > 0;

if (isLastPage) {
	const link = $(".postlink[href$='noinstall.zip']:last");
	$(document).scrollTo(link, 1000);
}

function formatDate(parts) {
	function find(type) {
		return parts.find(i => i.type === type).value;
	}

	const day = find('day'),
		month = find('month'),
		year = find('year');

	return `${day}-${month}-${year}`;
}

function loopLinks() {
	const el = $(this),
		code = el.closest('.content').find('.codebox code');

	let version, date;
	if (code.length > 0) {
		const split = code.text().split('\n')[0].split(' - ');
		version = split[0].substr(1);
		date = new Date(split[1]);
	}

	const formatter = new Intl.DateTimeFormat('en-US', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}),
		parts = formatter.formatToParts(date);

	const filename = el.attr('href').split('/').pop(),
		basename = filename.replace('_' + version, '').replace('.zip', ''),
		newFilename = `${basename} ${version} (${formatDate(parts)}).zip`;

	el.attr('download', newFilename);
}

$('.postlink[href$=".zip"]').each(loopLinks);
