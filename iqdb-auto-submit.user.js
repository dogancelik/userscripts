// ==UserScript==
// @name        IQDB Auto-submit
// @namespace   dogancelik.com
// @include     http://iqdb.org/
// @version     1.0
// @grant       none
// ==/UserScript==
document.forms[0].querySelector("#file").onchange = function () { document.forms[0].submit(); };
