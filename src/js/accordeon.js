/* eslint-env jquery */
$(function(){
	"use strict";
	
	var TOUCH_HOLD_THRESHOLD = 500; //Millisekunden zum Gedrückthalten, bevor Touch-Hold-Multiselect aktiviert wird.
	var TOUCH_HOLD_MOVE_TOLERANCE = 20 //Pixel, um die eine vertikale Bewegung bei Touch-Hold toleriert wird. 
	//Bei größeren Drags wird die Touch-Hold-Erkennung abgebrochen, das wird vielmehr als Scrollen interpretiert.
	
	var presetWithCircle = $.fn.prependFoldingArrowIcon.copyOfPreset(/*"arrow-up-down"*/ /*"plus-minus"*/ "plus")
		.prependToGraph("circle", {"cx": "0", "cy": "0", "r": "17"})
		.prop("viewboxRadius", 17)
		.prop("viewboxMargin", 0)
		.prop("closePath", false);
	$(".accordeon").each(function() {
		var accordeon = $(this);
		var showhideOpts = {
			duration: 200,
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
					//Andere schließen.
					//Nur beim Öffnen einer neuen Sektion, nicht beim Schließen einer Sektion nach Multiselect!
					//Außerdem zwecks Multiselect unterbinden bei Ctrl- oder Command-Taste oder im Touch-Hold-Multiselect-Modus
					//Explizit wird auch die Klasse .keydown-multiselect nochmal abgefragt, da nicht in allen Browsern das
					//Auslesen von .metaKey oder .ctrlKey auf einem per Keyboard (Enter, Leertaste) ausgelöstem Klick-Event
					//funktioniert!
					$("section.showing", accordeon)
						.filter(function() {
							return ! $(this).is(h2.parent());
						})
						.children("div:nth-child(2)")
						.hideSection({duration: 150}) //Schneller als "show", da letzteres ggf. früher startet und keinesfalls später fertig werden soll,
						//da nach "show" ggf. ein Alignment (Scroll) stattfindet, was nicht während einer Hide-Animation passieren soll.
				}
			}
			
			function touchStart(ev) {
				var target = $(this);
				var touch = ev.changedTouches[0];
				target.data("touchedY", touch.clientY);
				if (ev.touches.length == 1) {
					accordeon.data("touch-timer", window.setTimeout(function() {
						ev.preventDefault();
						accordeon.addClass("touch-hold-multiselect");
						//Erst die Klasse setzen, bevor ggf. click aufgerufen wird. So kann auch nach Absetzen und Scrollen
						//erneut durch Halten einer Überschrift der Multiselect-Mode gestartet werden, und der click
						//erweitert die Selektion statt alles zurückzusetzen!
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
				ev.preventDefault(); //Verhindert insb. nachträgliches Triggern von Click durch den Browser, obwohl schon alles erledigt!
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
			.on("touchend touchcancel", touchEndOrCancel);
		});
		$("section").setupFoldingArrowIconTransformation({
			preset: presetWithCircle
		});
		$("section.showing > div[id]:nth-child(2)", accordeon).showSection({
			scroll: false
		}); 
		//Da die showing Section zu Beginn ohnehin noch sichtbar ist und durch untenstehenden Code
		//nicht versteckt wird, ist ein showSection "eigentlich" nicht nötig.
		//Diese Anweisung dient nur dazu, im Falle eines konfigurierten Stores für den Zustand
		//(Hidden Field zum Submit, welche Sektion sichtbar ist)
		//auch das Store für die gerade sichtbare Section entsprechend auszufüllen, damit diese
		//Information beim nächsten Submit nicht verloren geht.
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