/* eslint-env jquery */
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
 */
$(function(){
	"use strict";
	
	var TOUCH_HOLD_THRESHOLD = 500; //Milliseconds a user has to hold a finger on the screen in order to enable multi-select mode
	//The user has to hold a finger on a heading for the time above in order to enable multi-select. But if he taps the
	//button and starts moving the finger, this is a scroll gesture, and multi-select mode should not be enabled while
	//scrolling. Instead, a "hold" gesture for enabling multi-select should only be detected if the finger stays roughly
	//at the same spot of the display. Some slight movement will always occur, since finger recognition on a touch screen
	//is not pixel-accurate. The following tolerance is the amount of pixels that should be allowed and ignored,
	//only movements greater than that tolerance should be interpreted as potential scroll gesture and abort the
	//wait for the touch_hold_threshold:
	var TOUCH_HOLD_MOVE_TOLERANCE = 20 
	
	var SHOW_TRANSITION_DURATION = 200

	//Define Preset for the folding-arrow-icon			
	var presetWithCircle = $.fn.prependFoldingArrowIcon.copyOfPreset(/*"arrow-up-down"*/ /*"plus-minus"*/ "plus")
		.prependToGraph("circle", {"cx": "0", "cy": "0", "r": "17"})
		.prop("viewboxRadius", 17)
		.prop("viewboxMargin", 0)
		.prop("closePath", false);
		
	$(".accordeon").each(function() {
		var accordeon = $(this);
		var showhideOpts = {
			duration: SHOW_TRANSITION_DURATION,
			scroll: true,
			scrollTolerance: 20,
			onToggle: function(block, heading) {
				heading.transformFoldingArrowIcon();
			}
		}
		var storeSelector = accordeon.data("storeSelector");
		if (storeSelector)
			showhideOpts.store = storeSelector;
			
		$("section > :first-child", accordeon).each(function() {
			var h2 = $(this);
			var text = h2.html();
			var content = h2.next();
			var section = h2.parent();
			
			function click(ev) {
				content.showOrHideSection();
				if (section.is(".showing") && !accordeon.is(".multi") && !accordeon.is(".touch-hold-multiselect") 
					&& !ev.ctrlKey && !ev.metaKey && !accordeon.is(".keydown-multiselect")) {
					//No multi-select mode (neither permanent by class multi nor temporally enabled
					//by touch-hold-gesture or held-down control or meta key): Close all other open sections.
					//(Only when _opening_ a new section, not when closing a section.)
					//In some browsers, reading .ev.ctrlKey or ev.metaKey does not seem to work in a click
					//event handler, so also check the .keydown-multiselect class set by the keydown handlers!
					$("section.showing", accordeon)
						.filter(function() {
							return ! $(this).is(h2.parent());
						})
						.children("div:nth-child(2)")
						.hideSection({duration: SHOW_TRANSITION_DURATION - 50}) 
						//Implementation note: Since
						// a) the showSection animation may start a little earlier than this hideSection animation and
						// b) an alignment (by scrolling into viewport) of the shown section may be triggered after
						//    the showSection animation is finished and
						// c) for that, the hideSecion animations must be finished at most at the same time as
						//	  the showSection animation, better earlier, certainly not later (or it might affect the alignment),
						// the duration for hideSection has to be smaller than that for showSection!
				}
			}
			
			function touchStart(ev) {
				var target = $(this);
				var touch = ev.changedTouches[0];
				target.data("touchedY", touch.clientY);
				target.data("touch-hold", true);
				if (ev.touches.length == 1) {
					accordeon.data("touch-timer", window.setTimeout(function() {
						ev.preventDefault();
						accordeon.addClass("touch-hold-multiselect");
						//This class is explicitly added _before_ the click event gets triggered.
						//See click handler.
						if (!section.is(".showing")) {
							target.removeData("touchedY")
								  .click();
						}
					}, TOUCH_HOLD_THRESHOLD));
				}
			}
			
			function touchMove(ev) {
				var target = $(this);
				var touch = ev.changedTouches[0];
				var startY = target.data("touchedY");
				if (typeof startY === "number") {
					var delta = Math.abs(startY, touch.clientY);
					if (delta > TOUCH_HOLD_MOVE_TOLERANCE) {
						touchEndOrCancel.call(this, ev);
					}
				}
			}
			
			function touchEnd(ev) {
				ev.preventDefault(); 
				//Especially prevents accidentally triggering a following click event by the browser!
				var target = $(this);
				if (ev.touches.length == 1 || (typeof target.data("touchedY") !== "undefined")) {
					target.click();
				}
			}
			
			function touchEndOrCancel(ev) {
				var target = $(this);
				var timer = accordeon.data("touch-timer");
				if (typeof timer != "undefined") {
					window.clearTimeout(timer);
					accordeon.removeData("touch-timer");
				}
				if (ev.touches.length == 0) {
					accordeon.removeClass("touch-hold-multiselect");
				}
				target.removeData("touchedY");
				target.removeData("touch-hold");
			}
			
			function contextMenu(ev) {
				//Prevent opening context menu on touch screens by tap-and-hold, because
				//tap-and-hold is used for multi-selection (in combination with a second finger)
				//and no context menu should prevent the user from multi-selecting.
				//Do NOT prevent context menu by right-click (mouse).
				if ($(this).data("touch-hold"))
					ev.preventDefault();
			}
			
			h2.html('<button type="button" class="raw-style">' + text + '</button>');
			content.setupShowOrHideSection(showhideOpts);
			$("button", h2).appendFoldingArrowIcon({
				preset: presetWithCircle,
				separator: ""
			})
			.click(click)
			.on("touchstart", touchStart)
			.on("touchmove", touchMove)
			.on("touchend", touchEnd)
			.on("touchend touchcancel", touchEndOrCancel)
			.contextmenu(contextMenu);
		});
		$("section").setupFoldingArrowIconTransformation({
			preset: presetWithCircle
		});
		$("section.showing > div[id]:nth-child(2)", accordeon).showSection({
			scroll: false
		}); 
	});

	
	$(".accordeon section:not(.showing) > div[id]:nth-child(2)").hideSection({
		duration: 0
	});
	
	$(document).keydown(function(ev) {
		var k = ev.key;
		if (k === "Meta" || k === "Control") 
			$(".accordeon").addClass("keydown-multiselect");
	}).keyup(function(ev) {
		var k = ev.key;
		if ((k === "Meta" || k === "Control") && !ev.ctrlKey && !ev.metaKey) 
			$(".accordeon").removeClass("keydown-multiselect");
			
	});
});