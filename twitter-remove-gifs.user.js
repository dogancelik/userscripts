// ==UserScript==
// @name         Twitter Remove GIFs
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Removes all GIFs on Twitter
// @match        https://twitter.com/*
// @grant        none
// ==/UserScript==

/* eslint-env browser, es6 */

function getTweets() {
	return document.querySelectorAll('div[data-testid="tweet"]');
}

var expr = "//div[preceding-sibling::div[contains(@style, 'padding-bottom')]][div/@data-testid='placementTracking' and string(.//span/span)='GIF']";

function removeGifs() {
	let tweets = getTweets(),
		nodes = [];

	for (let tweet of tweets) {
		let result = document.evaluate(expr, tweet, null, XPathResult.ANY_TYPE, null),
			node = null;

		node = result.iterateNext();
		while (node) {
			nodes.push(node);
			node = result.iterateNext();
		}
	}

	for (let node of nodes) {
		node.previousSibling.removeAttribute('style');
		node.parentNode.removeChild(node);
	}
}

document.addEventListener('scroll', removeGifs, false);
