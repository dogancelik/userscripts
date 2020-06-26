// ==UserScript==
// @name         Instagram Add Username to Post URL
// @namespace    dogancelik.com
// @version      0.3.0
// @description  Add username to post URL
// @author       Doğan Çelik
// @match        https://www.instagram.com/p/*
// @grant        none
// ==/UserScript==

if (location.pathname.indexOf('/p/') === 0) {
  var data = {};
  var keys = Object.keys(window.__additionalData);
  if (keys.length > 0) {
    data = window.__additionalData[keys[0]].data;
  } else if (window._sharedData && window._sharedData.hasOwnProperty('entry_data')) {
    data = window._sharedData.entry_data.PostPage[0];
  } else {
    throw new Error("No user data");
  }

  var username = data.graphql.shortcode_media.owner.username;
  window.location.pathname = '/' + username + window.location.pathname;
}
