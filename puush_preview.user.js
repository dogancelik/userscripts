// ==UserScript==
// @name        puush preview
// @description previews images on account page
// @namespace   dogancelik.com
// @include     http://puush.me/account*
// @grant       none
// @version     1.0
// ==/UserScript==

"use strict";

var tiles = document.querySelectorAll(".puush_tile"),
    preview = document.createElement("img");
  
preview.style.display = "none";
preview.style.position = "fixed";
document.body.appendChild(preview);

function imageLoad () {
  var original = document.createElement("img");
  original.src = preview.src;
  
  original.addEventListener("load", function (e) {
  var maxWidth = window.innerWidth / 2,
      maxHeight = window.innerHeight / 2,
      width = original.width,
      height = original.height,
      ratioWidth = maxWidth / width,
      ratioHeight = maxHeight / height,
      ratio = Math.min(ratioWidth, ratioHeight),
      newWidth = ratio * width,
      newHeight = ratio * height;
  
  preview.style.width = newWidth + "px";
  preview.style.height = newHeight + "px";
  
  mouseMove({
    clientX: globalX,
    clientY: globalY
  });
  
  }, false);
}

preview.addEventListener("load", imageLoad, false);

function mouseEnter (e) {
  preview.style.display = "";
  var link = e.target.children.item(0).children.item(0).href;
  preview.src = link;
}

function mouseLeave () {
  preview.style.display = "none";
  preview.src = "";
}

var globalX, globalY;

function mouseMove (e) {
  var margin = 10,
      posX = globalX = e.clientX,
      posY = globalY = e.clientY;
  
  var rightOverflow = posX + preview.width > window.innerWidth,
      bottomOverflow = posY + preview.height > window.innerHeight;
  
  if (rightOverflow) posX = posX - preview.width - margin; else posX += margin;
  if (bottomOverflow) posY = posY - preview.height - margin; else posY += margin;
  
  preview.style.left = posX + "px";
  preview.style.top = posY + "px";
}

for (var i = 0; tiles.length > i; ++i) {
  tiles[i].addEventListener("mouseenter", mouseEnter, false);
  tiles[i].addEventListener("mouseleave", mouseLeave, false);
  tiles[i].addEventListener("mousemove", mouseMove, false);
}