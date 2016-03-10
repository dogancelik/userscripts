// ==UserScript==
// @name        Mirrorcreator Fast Links
// @namespace   dogancelik.com
// @include     http://www.mirrorcreator.com/files/*
// @version     1.0
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// ==/UserScript==

// Remove unnecessary stuff
var classAll = document.querySelector(".all");
classAll.removeChild(classAll.querySelector("center"));

// Add style
GM_addStyle(".link-error { background-color: #FDBDBD; border: 1px dotted #FD7C7C; background-image: linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 0)); background-size: 25px 25px; }");
GM_addStyle(".all > br, .ask, center, .separator { display: none; }");

// Get links
var urlIndex = [
  'ajaxRequest.open("GET", "',
  '", true);'
];

var linksUrl = unsafeWindow.ajaxFunction.toString().split(urlIndex[0])[1].split(urlIndex[1])[0];

unsafeWindow.ajaxFunction = function() {};

GM_xmlhttpRequest({
  url: linksUrl,
  method: "GET",
  onload: function (res) {
    document.getElementById("result").innerHTML = res.responseText;

    var els = document.querySelectorAll(".dl_link");
    for (var i = 0; i < els.length; i++)
      findAndChange(els[i].children[0]);
  }
});

function findAndChange(link) {
  GM_xmlhttpRequest({
    url: link.href,
    method: "GET",
    onload: function (res) {
      var data = res.responseText,
          container = document.createElement('div');

      container.innerHTML = data;
      var mirror_url = container.querySelector(".highlight.redirecturl").innerHTML;

      link.target = "";

      if (mirror_url.indexOf('Error') > -1) {
        link.href = "javascript:void(0)";
        link.onclick = function () { alert(mirror_url); };
        link.parentNode.className = "link-error";
      } else {
        link.href = mirror_url;
      }
    }
  });
}
