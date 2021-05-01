// ==UserScript==
// @name         KHInsider Quick Download
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Download without visiting each page
// @match        https://downloads.khinsider.com/*
// @icon         https://downloads.khinsider.com/images/favicon.ico
// @grant        none
// ==/UserScript==

/* eslint-env jquery, browser, es2020, greasemonkey */

$(`<style>
.playlistDownloadSong {
	width: 10%;
}

.playlistDownloadSong a {
	display: inline-block;
}

.playlistDownloadSong a:not(:last-child) {
	margin-right: 6px;
}
</style>`).appendTo('head');

function mapSongUrl(i, el) {
	let $el = $(el),
		href = $el.attr('href');

	function parseBody(body) {
		return body.split('id="audio"')[1]
			.split('src="')[1]
			.split('"')[0];
	}

	function addUrl(url) {
		$(`<a class="khi_quick_download" href="${url}" download>
			<i class="material-icons">music_video</i></a>`).insertAfter($el);
	}

	window.fetch(href)
		.then(res => res.text())
		.then(parseBody)
		.then(addUrl);
}

$('.playlistDownloadSong a').each(mapSongUrl);
