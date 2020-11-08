// ==UserScript==
// @name         Archive.today Auto-submit
// @namespace    dogancelik.com
// @version      1.0.0
// @description  Automatically submit the form
// @include      https://www.google.com/recaptcha/api2/*
// @match        https://archive.today/?url=*
// @match        https://archive.is/*
// @match        https://archive.li/*
// @match        https://archive.vn/*
// @match        https://archive.fo/*
// @match        https://archive.md/*
// @match        https://archive.ph/*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://raw.githubusercontent.com/jgarber623/javascript-debounce/master/dist/javascript-debounce.min.js
// ==/UserScript==

/* eslint-env es6, greasemonkey, jquery, browser */

function submitForm() {
	document.forms.submiturl.submit();
}

var countdown = GM_getValue('autosubmit-countdown') || 3,
	cancelKey = 'autosubmit-cancelled-',
	isCancelled = GM_getValue(`${cancelKey}${window.location.href}`) === 'true',
	cancelButton = undefined;

function progCountdown() {
	updateCancelButtonText();
	if (!isCancelled) {
		if (countdown-- > 0) {
			setTimeout(progCountdown, 1000);
		} else {
			submitForm();
		}
	}
}

function updateCancelButtonText() {
	if (isCancelled) {
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
	isCancelled = true;
	GM_setValue(`${cancelKey}${window.location.href}`, 'true');
	updateCancelButtonText();
}

function createCancelButton() {
	let button = $(`<button id="autosubmit-cancel"></button>`);
	button.on('click', cancelButtonClick);
	button.insertBefore(document.forms.submiturl);
	cancelButton = button[0];
}

function registerEvent() {
	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape' || event.keyCode === 27) {
			cancelButton.click();
		}
	});
}

function createSettings() {
	function changeCountdown(event) {
		let val = countdownEl.val();
		GM_setValue('autosubmit-countdown', val);
		statusEl.text('Saved!');
		resetText();
	}

	let area = $(`<div id="autosubmit-settings">
	<label id="autosubmit-status" for="autosubmit-countdown" data-default="Change auto-submit countdown:"></label>
	<input id="autosubmit-countdown" type="number" value="${countdown}">
</div>`),
		countdownEl = area.find('#autosubmit-countdown'),
		statusEl = area.find('#autosubmit-status'),
		defaultText = statusEl.attr('data-default'),
		resetText = debounce(() => statusEl.text(defaultText), 1000);
	statusEl.text(defaultText);
	countdownEl.on('click', changeCountdown);
	area.insertBefore(document.forms.submiturl);
}

function addStyle() {
	$(`<style>
#autosubmit-settings {
	text-align: center;
	margin: 1.5em 0;
}

#autosubmit-countdown,
#autosubmit-status {
	font-size: 1.5em;
}

#autosubmit-countdown {
	width: 3em;
}

#autosubmit-status {
	display: inline-block;
	width: 15em;
}

#autosubmit-cancel {
	font-size: 1.5em;
	margin: 1em auto;
	padding: 0.5em;
	display: block;
	width: 75%;
}
</style>`).appendTo('head');
}


if (window.top != window.self) {
	// Click reCaptcha
	document.getElementById('rc-anchor-container').click();
} else {
	addStyle();
	if (location.search.indexOf('?url=') > -1 && location.search.length > 5) {
		createCancelButton();
		cancelButton.focus();
		registerEvent();
		progCountdown();
	} else if (location.pathname === '/') {
		createSettings();
	}
}
