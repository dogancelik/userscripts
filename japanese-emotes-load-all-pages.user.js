// ==UserScript==
// @name        Japanese Emotes Load All Pages
// @namespace   dogancelik.com
// @include     http://japaneseemoticons.me/*
// @version     1.0.0
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/japanese-emotes-load-all-pages.user.js
// @grant       none
// ==/UserScript==

var pages = document.querySelectorAll('.entry-content p:last-child a:nth-last-child(n+2)');
var target = '.entry-content';

function loadPage (pages, start) {
  jQuery.get(pages[start].href, function (html) {
    var add = jQuery(target, jQuery.parseHTML(html));
    add.find('p:last-child').remove();
    add.find('td')
      .addClass('btn')
      .attr('data-clipboard-text', function() { return $(this).text(); });
    add.insertAfter(target);
    loadPage(pages, ++start);
  });
}

loadPage(pages, 0);
