// ==UserScript==
// @name         Swagger Copy Path
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Copy Swagger endpoint paths
// @match        https://*/*
// @match        http://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant        none
// ==/UserScript==

/* eslint-env jquery, browser, es2020, greasemonkey */

const isSwagger = $('#swagger-ui').length > 0;

function embed() {
	function onClick(event) {
		event.stopPropagation();
		const path = $(event.target).prev().text().trim();
		window.navigator.clipboard.writeText(path);
	}

	$('<button class="opblock-summary-copyurl">Copy path</button>')
		.on('click', onClick)
		.insertAfter(this);
}

function init() {
	$(document).arrive('.opblock-summary-path a', embed);
	$(`<style>
.swagger-ui button.opblock-summary-copyurl {
	font-size: 80%;
	margin-left: 0.5rem;
}
</style>`).appendTo('head');
}

if (isSwagger) init();
