// ==UserScript==
// @name         Archive.today Auto-submit
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Automatially submits the form after a few seconds
// @include      https://www.google.com/recaptcha/api2/*
// @match        https://archive.today/?url=*
// @match        https://archive.is/?url=*
// @match        https://archive.li/?url=*
// @match        https://archive.vn/?url=*
// @match        https://archive.fo/?url=*
// @match        https://archive.md/?url=*
// @match        https://archive.ph/?url=*
// @grant        none
// ==/UserScript==

/* eslint-env es6, greasemonkey */

function submitForm() {
	document.forms.submiturl.submit();
}

var countdown = 3,
	cancelled = window.localStorage.getItem(`cancelled_${window.location.href}`) === 'true',
	cancelButton = undefined;

function progCountdown() {
	updateCancelButtonText();
	if (!cancelled) {
		if (countdown-- > 0) {
			setTimeout(progCountdown, 1000);
		} else {
			submitForm();
		}
	}
}

function updateCancelButtonText() {
	if (cancelled) {
		cancelButton.textContent = 'Auto-submit is Cancelled';
	} else {
		if (countdown > 0) {
			cancelButton.textContent = `Auto-submit in ${countdown} (Click or Escape to Cancel)`;
		} else {
			cancelButton.innerHTML = `Auto-submitting&hellip;`;
		}
	}
}

function cancelButtonClick() {
	cancelled = true;
	window.localStorage.setItem(`cancelled_${window.location.href}`, 'true');
	updateCancelButtonText();
}

function createButton() {
	let button = document.createElement('button');
	button.id = 'autosubmit';
	button.setAttribute('style', 'font-size: 2em; margin: 1em auto; display: block; width: 50%;');
	button.addEventListener('click', cancelButtonClick, false);
	cancelButton = document.forms.submiturl.parentNode.insertBefore(button, document.forms.submiturl);
}

function registerEvent() {
	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape' || event.keyCode === 27) {
			cancelButton.click();
		}
	});
}

if (location.search.indexOf('?url') > -1) {
	createButton();
	cancelButton.focus();
	registerEvent();
	progCountdown();
}

if (window.top != window.self) {
	document.getElementById('rc-anchor-container').click();
}
