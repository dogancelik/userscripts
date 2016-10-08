// ==UserScript==
// @name        Mycroft Project Show Source
// @namespace   dogancelik.com
// @include     http://mycroftproject.com/*
// @version     1.0.0
// @grant       none
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/mycroft-show-source.user.js
// ==/UserScript==

var plugins = document.querySelectorAll('#plugins a[href="/jsreq.html"]');
var baseUrl = 'http://mycroftproject.com/installos.php';
var regex = /Ref:\s*(\S+)\s*\((\d+)\)/i;

function findJudgeLink (id) {
  return document.querySelector(`a[href="/judge.php?id=${id}"]`);
}

function addSourceLink (el) {
  var match = el.getAttribute('title').match(regex);
  var pid = match[2];
  var name = match[1];
  var judge = findJudgeLink(pid);
  
  var source = document.createElement('A');
  source.href = `${baseUrl}/${pid}/${name}.xml`;
  source.innerHTML = '[Source]';
  judge.parentNode.insertBefore(source, judge.nextSibling);
}

[].slice.call(plugins).forEach(addSourceLink);
