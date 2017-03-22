// ==UserScript==
// @name        Warez-BB Search Sub-forums
// @namespace   dogancelik.com
// @include     https://www.warez-bb.org/*
// @version     1.0.0
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/warezbb-search-subforums.user.js
// @grant       none
// ==/UserScript==

function submitForm (forumId, searchQuery) {
  var input = (name, value) => `<input name="${name}" value="${value}" type="hidden" />`;
  var form = jQuery('<form action="/search.php" method="POST"></form>')
    .append(input('show_results', 'topics'))
    .append(input('search_fields', 'titleonly'))
    .append(input('search_forum[]', forumId))
    .append(input('search_keywords', searchQuery))
    .appendTo('body')
    .submit();
}

function searchClick (e) {
  e.preventDefault();
  var id = e.target.href.split('=')[1];
  var query = prompt('Search query');
  !!query && submitForm(id, query);
}

jQuery('.subforumrow').each(function (i, el) {
  var link = jQuery(el).find('a:first');
  link.clone().text(' [Search]').insertAfter(link).click(searchClick);
});
