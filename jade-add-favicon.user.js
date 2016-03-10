// ==UserScript==
// @name        Add Favicon
// @namespace   dogancelik.com
// @include     http://html2jade.org/*
// @include     http://jade-lang.com/*
// @version     1.0.0
// @grant       none
// @updateURL   https://github.com/dogancelik/userscripts/raw/master/jade-add-favicon.user.js
// ==/UserScript==
var link = document.createElement('link');
link.type = 'image/png';
link.rel = 'shortcut icon';
link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAACkUlEQVR4nFRSS2gTXRi9d+bOTJJpm2f/v036NE27EZGCqJSiuBJxUdCFWKigCzeudNMKVQQ3bsSN2IVbFYuoRdc+qgtrWouiRdoi2thH2jSdSSaPmbkPv2kq1MsMzL3fOd895ztDlqenVh48ppaFsCSpKqtU7LWsGo1Ifj+vVuFM0jR4nNymnkq2XBgi+deTaixGGuplXRdCYIwFY4GOdlYqiTpda2zEmkoNE1pgRcm/eUcQwkD9PnId7VqsaMXPnJofvSmoK2APL8bJkSusXJEEZyQUQv+u4re5QFfy/4GToDN6pB95eOxuGcyyJME43I4xnO2goYYoXbp3v+n0ABKi5dwgVATndd1dYBWMKsUvX4XYQSsNDVq8GVxuvnrr5rci/X2sWiWRMLSjZkEDt4ILcONBQ6HUteHQ4YNYwsJlK4/GoVHqxlU7u6GnuoypdGUpo0SjRLgOd1wgpEaHgYO3xTm5XGLobO1Of2fA15JAH9MwzOCBXs+Da5j+ttZQ3yHxVxkrFj1HnP+8c3d94iU1zdqgjA9pwsplTOTk8GVWKArXNdMz9uqaEouBTn9nR/uli9QqWfOLHt22MSFECYdZpWykZyAvbju0UHC2DCjg1oR3VaksB/yVXxkwDcnCPAnIJeFw9ulE44nj5YVFX7wZWkA4wIfy7OB5ACDuSQUhkqZKsh4QlEJXc/qT3pNitrM5+V5QBnZWnzx31jcALbazViJhJ5cnSjDo2UDox63btZ8AVvbZi93B1yKFcDhjeG5szFOZWQaa1vQfs0paIl7X0w0hgIBq5jeS5cLsZ19bK3DUWJQE9nSsPByHUcAm2LsfaPBRXcqUFhZln6ZEIjC6+n17JVUDY7FjR/8EAAD//1ZGRs/6p4v4AAAAAElFTkSuQmCC';
document.getElementsByTagName('head')[0].appendChild(link);
