"use strict";
/**
 * @license 
 * Copyright (c) 2019, Immo Schulz-Gerlach, www.isg-software.de 
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are 
 * permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT 
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, 
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED 
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; 
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
 * WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */$(function(){var t=500,o=20,e=200,n=$.fn.prependFoldingArrowIcon.copyOfPreset("plus").prependToGraph("circle",{cx:"0",cy:"0",r:"17"}).prop("viewboxRadius",17).prop("viewboxMargin",0).prop("closePath",!1);$(".accordeon").each(function(){var c=$(this),i={duration:e,scroll:!0,scrollTolerance:20,onToggle:function(t,o){o.transformFoldingArrowIcon()}},r=c.data("storeSelector");r&&(i.store=r),$("section > :first-child",c).each(function(){var r=$(this),a=r.html(),s=r.next(),h=r.parent();function l(t){var o=$(this),e=c.data("touch-timer");void 0!==e&&(window.clearTimeout(e),c.removeData("touch-timer")),0==t.touches.length&&c.removeClass("touch-hold-multiselect"),o.removeData("touchedY"),o.removeData("touch-hold")}r.html('<button type="button" class="raw-style">'+a+"</button>"),s.setupShowOrHideSection(i),$("button",r).appendFoldingArrowIcon({preset:n,separator:""}).click(function(t){s.showOrHideSection(),!h.is(".showing")||c.is(".multi")||c.is(".touch-hold-multiselect")||t.ctrlKey||t.metaKey||c.is(".keydown-multiselect")||$("section.showing",c).filter(function(){return!$(this).is(r.parent())}).children("div:nth-child(2)").hideSection({duration:e-50})}).on("touchstart",function(o){var e=$(this),n=o.changedTouches[0];e.data("touchedY",n.clientY),e.data("touch-hold",!0),1==o.touches.length&&c.data("touch-timer",window.setTimeout(function(){o.preventDefault(),c.addClass("touch-hold-multiselect"),h.is(".showing")||e.removeData("touchedY").click()},t))}).on("touchmove",function(t){var e=$(this),n=t.changedTouches[0],c=e.data("touchedY");"number"==typeof c&&Math.abs(c,n.clientY)>o&&l.call(this,t)}).on("touchend",function(t){t.preventDefault();var o=$(this);1!=t.touches.length&&void 0===o.data("touchedY")||o.click()}).on("touchend touchcancel",l).contextmenu(function(t){$(this).data("touch-hold")&&t.preventDefault()})}),$("section").setupFoldingArrowIconTransformation({preset:n}),$("section.showing > div[id]:nth-child(2)",c).showSection({scroll:!1})}),$(".accordeon section:not(.showing) > div[id]:nth-child(2)").hideSection({duration:0}),$(document).keydown(function(t){var o=t.key;"Meta"!==o&&"Control"!==o||$(".accordeon").addClass("keydown-multiselect")}).keyup(function(t){var o=t.key;"Meta"!==o&&"Control"!==o||t.ctrlKey||t.metaKey||$(".accordeon").removeClass("keydown-multiselect")})});