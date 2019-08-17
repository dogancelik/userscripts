// ==UserScript==
// @name         SoftArchive Load Links Inline
// @namespace    dogancelik.com
// @version      0.1.0
// @description  Retrieve links without leaving search page (only Verified Uploads)
// @author       Doğan Çelik
// @match        https://sanet.st/*
// @grant        none
// ==/UserScript==

/* eslint-env jquery, es6 */

(function() {
  'use strict';

  var darkTheme = $('head').find('link[rel="stylesheet"][href*="dark_theme"]').length > 0;

  $('head').append(`<style>
.load_inline {
padding: 5px;
border: 1px solid #ff962e;
color: ${darkTheme ? '#ff962e' : 'inherit'};
}
.load_inline[disabled] {
opacity: 0.75;
}
.load_inline, .load_inline::before {
vertical-align: middle;
}
.load_inline::before {
line-height: 1em;
}
.inline-links textarea {
width: 99%;
background-color: inherit;
color: inherit;
}
</style>`);

  function parseLinks(html) {
      let dom = $('<div></div>').append($.parseHTML(html));
      console.log(dom);
      return dom.find('.c-dl-links a[rel~="external"]').map((i, e) => e.href).get();
  }

  function onClick(event) {
      event.preventDefault();
      $(event.currentTarget).html('Loading&hellip;').attr('disabled', 'disabled');
      $.ajax({
          url: $(event.currentTarget).attr('href'),
          success: function(data) {
              let links = parseLinks(data).join('\n');
              $(event.data.filerow).find('.markeredBlock').after(`<div class="markeredBlock inline-links"><textarea readonly>${links}</textarea></div>`);
              $(event.currentTarget).hide();
          }
      });
  }

  $('.titles_list_box .filerow').each(function(){
      let mainLink = $(this).find('.cellMainLink'),
          href = mainLink.attr('href');
      $(`<a href="${href}" class="load_inline floatright sa sa-download-spoiler">Load Links</a>`)
          .on('click', { filerow: this }, onClick)
          .prependTo(this.children[0]);
  });
})();