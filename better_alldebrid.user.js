// ==UserScript==
// @name        Better Alldebrid
// @namespace   dogancelik.com
// @include     http*://www.alldebrid.com/*
// @version     1.1.0
// @grant       GM_addStyle
// @updateURL   https://github.com/dogancelik/greasemonkey-scripts/raw/master/better_alldebrid.user.js
// ==/UserScript==

GM_addStyle("#navigation { top: 0; bottom: 0; left: 0; right: 180px; position: fixed; width: 180px; padding: 10px; background-color: rgba(255, 255, 255, .65); background: -moz-linear-gradient(left, rgba(229,229,229,1) 0%, rgba(255,255,255,1) 100%); } #navigation a { color: black } #navigation a:hover { font-weight: bold }");

function getAddonUrl() {
  if (navigator.appVersion.indexOf("Chrome") > -1) {
    return "https://chrome.google.com/webstore/detail/mdjbgnpehbhpibonmjjjbjaoechnlcaf";
  } else {
    return "/alldebrid.xpi";
  }
}

var logoutUrl = document.querySelector(".toolbar_disconnect").href;
var accDetails = document.querySelector(".toolbar_welcome").textContent.split("welcome ")[1].replace(",  Your account expires in ", " (") + ")";

var navData1 = [
  ["Downloader", "/service/"],
  ["Torrents", "/torrent/"],
];

var navData2 = [
  [accDetails, "javascript:void(0)"],
  ["Buy Premium", "/offer/"],
  ["My Account", "/account/"],
  ["Referral", "/referrer/"],
  ["Log out", logoutUrl],
];

var navData3 = [
  ["News", "/"],
  ["Forum", "http://forum.alldebrid.com/"],
  ["Contact Us", "/contact/"],
  ["Blog", "http://blog.alldebrid.com/"],
];

var navData4 = [
  ["Browser Add-on", getAddonUrl()],
  ["JDownloader", "/jdownloader/"],
];

var navData5 = [
  ["Imprint", "/legal/"],
  ["Terms of Service", "/tos/"],
  ["Stats", "/stats/"],
];
  
function createList(data) {
  var list = document.createElement("ul");
  
  for (var i = 0; i < data.length; i++) {
    var li = document.createElement("li");

    var a = document.createElement("a");
    a.innerHTML = data[i][0];
    a.href = data[i][1];

    li.appendChild(a);
    list.appendChild(li);
  }
  
  return list;
}

function createDivider() {
  return document.createElement("hr");
}

function deleteEls(els) {
  if (els instanceof NodeList) {
    for (var i = 0; i < els.length; i++) {
      els[i].remove();
    }  
  } else {
   els.remove(); 
  }
}
  
var navigationDiv = document.createElement("div");
navigationDiv.id = "navigation";

var navLogo = document.createElement("img");
navLogo.src = "https://cdn.alldebrid.com/lib/images/default/logo_alldebrid.png";
navLogo.style = "width: 80%; margin: 0 auto; display: block;";
navigationDiv.appendChild(navLogo);

navigationDiv.appendChild(createList(navData1));
navigationDiv.appendChild(createDivider());
navigationDiv.appendChild(createList(navData2));
navigationDiv.appendChild(createDivider());
navigationDiv.appendChild(createList(navData3));
navigationDiv.appendChild(createDivider());
navigationDiv.appendChild(createList(navData4));
navigationDiv.appendChild(createDivider());
navigationDiv.appendChild(createList(navData5));
  
document.body.insertBefore(navigationDiv, document.body.childNodes[0]);

deleteEls(document.querySelectorAll("#container_header_index, #container_header, .dotsline_page, #footer, #container_footer"));

if (location.pathname == "/torrent/") {
  deleteEls(document.querySelectorAll("#lostpassword .title_big, #lostpassword .lostpassword_yellowborder, #lostpassword .lostpassword_text, #lostpassword center, #lostpassword .title_upload, .torrent_left br, .torrent_right br, #lostpassword br"));
  document.querySelector("input[name='magnet']").setAttribute("placeholder", "Magnet");
  document.querySelector(".display_path").setAttribute("placeholder", "Torrent File");
  GM_addStyle("#lostpassword form { margin-top: 20px; }");
  Array.prototype.slice.call(document.querySelectorAll(".torrent_filename")).forEach(function(e) { e.title = e.innerHTML; });
}
