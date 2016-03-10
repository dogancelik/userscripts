// ==UserScript==
// @name        Facebook HTML5 Video
// @namespace   dogancelik.com
// @description Converts Flash video to HTML5 video
// @include     http*://www.facebook.com/*
// @version     1.1.1
// @grant       none
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/facebook-html5-video.user.js
// ==/UserScript==
var srcList = ['hd_src_no_ratelimit', 'hd_src', 'sd_src_no_ratelimit', 'sd_src'];

function getVids() {
  return document.querySelectorAll('embed');
}

function toArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
}

function convertEmbed (el) {
  var parent = el.parentElement;
  var embed = el;
  var jsonObj = JSON.parse(decodeURIComponent(embed.getAttribute("flashvars")).replace(/params=(.*)&width.*/, '$1'));
  var src;

  var videoData = jsonObj.video_data[0];
  for (var i = 0; i < srcList.length; i++) {
    if (videoData[srcList[i]]) {
      src = videoData[srcList[i]];
      console.log("Found:", srcList[i]);
      break;
    }
  }

  parent.removeChild(embed);
  var video = document.createElement('video');
  video.src = src;
  video.width = embed.width;
  video.height = embed.height;
  video.setAttribute('controls', '');
  video.setAttribute('preload', 'metadata');
  // video.setAttribute('autoplay', '');
  video.className = '_ox1';
  parent.appendChild(video);
}

function watchEl (mutations) {
  toArray(getVids()).forEach(convertEmbed);
}

var observer = new MutationObserver(watchEl);
observer.observe(document.documentElement, { childList: true, subtree: true });
