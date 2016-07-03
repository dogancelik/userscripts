// ==UserScript==
// @name        IQDB Drag & Drop Upload
// @namespace   dogancelik.com
// @include     http://iqdb.org/*
// @include     https://iqdb.org/*
// @include     http://www.iqdb.org/*
// @include     https://www.iqdb.org/*
// @version     1.0.1
// @grant       none
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/iqdb-dd-upload.user.js
// ==/UserScript==

// Init

var ddStyle, ddContainer, ddResults;

function createStyle () {
  var el = document.createElement('style');
  el.type = 'text/css';
  el.innerHTML = '#drop { background: gray; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999; opacity: 0.6; visibility: hidden; } #results { background-color: rgba(255, 0, 0, 0.125); }';
  document.head.appendChild(el);
  return el;
}

function createResults () {
  var news = document.querySelector('div');
  var results = document.createElement('div');
  results.id = 'results';
  news.parentNode.insertBefore(results, news.nextSibling);
  return results;
}

function createDrop () {
  var el = document.createElement('div');
  el.id = 'drop';
  document.body.appendChild(el);
  return el;
}

function init () {
  ddStyle = createStyle();
  ddContainer = createDrop();
  ddResults = createResults();

  window.addEventListener('dragenter', dragEnter, false); // show
  ddContainer.addEventListener('dragleave', function () { toggleDrop(false); }, false); // hide
  ddContainer.addEventListener('dragenter', allowDrag, false);
  ddContainer.addEventListener('dragover', allowDrag, false);
  ddContainer.addEventListener('drop', drop, false);
}

// Drag / Drop

function toggleDrop (vis) {
  ddContainer.style.visibility = vis ? 'visible' : 'hidden';
}

function dragEnter (e) {
  toggleDrop(true);
}

function allowDrag (e) {
  e.preventDefault();
}

function updateResults (els) {
  ddResults.innerHTML = '';
  els.forEach(function (el) { ddResults.appendChild(el); });
}

function xhrLoad (e) {
  var html = e.target.responseText.split('IRC channel</a>.</div>')[1].split('<form')[0];
  var doc = new DOMParser().parseFromString(html, 'text/html');
  var results = [].slice.call(doc.body.children);
  updateResults(results);
}

function submit (files) {
  var input = document.getElementById('file');
  var form = input.form;
  var formData = new FormData();

  formData.append('MAX_FILE_SIZE', '8388608');
  [1, 2, 3, 4, 5, 6, 10, 11, 12, 13].forEach(function (val) {
   formData.append('service[]', val);
  });
  formData.append('file', files[0]);

  var xhr = new XMLHttpRequest();
  xhr.onload = xhrLoad;
  xhr.open('POST', '/');
  xhr.setRequestHeader('Content-Encoding', 'multipart/form-data');
  xhr.send(formData);
}

function drop (e) {
  e.stopPropagation();
  e.preventDefault();
  toggleDrop(false);

  var files = e.dataTransfer.files;
  submit(files);
}

init();
