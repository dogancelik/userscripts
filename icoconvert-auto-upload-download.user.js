// ==UserScript==
// @name         ICOConvert Auto Upload & Download
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Upload image, convert and download icon automatically
// @match        https://icoconvert.com/
// @grant        none
// ==/UserScript==

/* eslint-env browser, es2020 */

var localimg = document.getElementById('localimg'),
	submitbtn = document.getElementById('submitbtn'),
	crop_box = document.getElementById('crop_box'),
	convertbtn = document.getElementById('convertbtn'),
	output_file = document.getElementById('output_file');

function onFileSelect() {
	submitbtn.click();
}

localimg.addEventListener('change', onFileSelect, false);

function observeUpload(mutations) {
	let isUploaded = false;
	for (let m of mutations) {
		if (m.target.src.includes('/files/download')) {
			isUploaded = true;
			break;
		}
	}
	if (isUploaded) {
		convertbtn.click();
	}
}

function observeConvert(mutations) {
	for (let m of mutations) {
		if (m.addedNodes.length > 1 &&
			m.addedNodes[0].nodeName === 'A') {
			m.addedNodes[0].download = true;
			m.addedNodes[0].target = '';
			m.addedNodes[0].click();
			break;
		}
	}
}

var uploadObserver = new MutationObserver(observeUpload),
	convertObserver = new MutationObserver(observeConvert);

uploadObserver.observe(crop_box, { attributes: true });
convertObserver.observe(output_file, { childList: true });
