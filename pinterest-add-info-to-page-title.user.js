// ==UserScript==
// @name         Pinterest Add Info to Page Title
// @namespace    dogancelik.com
// @version      0.1.1
// @match        https://www.pinterest.com/*
// @icon         https://www.google.com/s2/favicons?domain=pinterest.com
// @grant        none
// ==/UserScript==

function getBoardInfo() {
	let header = document.querySelector('div[data-test-id="LegoBoardHeader__main"]'),
		cardLinks = document.querySelectorAll('.AggregatedCloseupCard a.underlineLink'),
		pinTitle = document.querySelector('div[data-test-id="closeup-title"]'),
		externalLink = document.querySelector('a.linkModuleActionButton'),
		pinId, boardPath, boardSection, boardName, userName, profileName;

	if (header) {
		boardName = header.querySelector('h1');
		userName = header.querySelector('a');
		if (boardName) {
			boardPath = window.location.href.split('/')[4];
			boardName = boardName.textContent.trim();
		}
		if (userName) {
			userName = userName.split('/')[3];
			profileName = userName.textContent.trim();
		}
	}

	if (cardLinks.length === 2) {
		pinId = window.location.href.split('/')[4];
		boardName = cardLinks[1].textContent.trim();
		boardPath = cardLinks[1].href.split('/')[4];
		boardSection = cardLinks[0].href.split('/').slice(4).filter(i => i).join('/');
		userName = cardLinks[0].href.split('/')[3];
		profileName = cardLinks[0].textContent.trim();

	}

	if (pinTitle) {
		pinTitle = pinTitle.textContent.trim();
	}

	if (externalLink) {
		externalLink = externalLink.textContent.trim();
	}

	return {
		pinTitle, pinId, externalLink,
		boardPath, boardSection, boardName,
		userName, profileName
	};
}

function textOrEmpty(text) {
	return text ? text : '';
}

function updatePageTitle() {
	let info = getBoardInfo(),
		title = '';

	if (info.userName) {
		title += info.userName + ' > ';
	}

	if (info.boardSection) {
		title += decodeURI(info.boardSection) + ' > ';
	} else if (info.boardPath) {
		title += decodeURI(info.boardPath) + ' > ';
	}

	if (info.pinTitle) {
		title += info.pinId + ' (' + info.pinTitle + ' @ ' + info.externalLink + ')';
	} else if (info.externalLink) {
		title += info.pinId + ' (@ ' + info.externalLink + ')';
	} else if (info.pinId) {
		title += info.pinId;
	}

	if (title.length > 0) {
		title += ' - Pinterest';
		document.title = title;
	}
}

setInterval(updatePageTitle, 1000);
updatePageTitle();
