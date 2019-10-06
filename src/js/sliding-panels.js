"use strict";
(function($){

	const SLIDINGPANELS_OPTIONS_DATA_NAME = "jquery-showhide-slidingpanels-setup";
	const SLIDINGPANELS_OPTION_CONTAINER_CLASSNAME = "jquery-showhide-slidinganels-options";
	
	function getSlPanelOptions(jqrPanel, options) {
		//find options container
		let secOpts = jqrPanel.closest("." + SLIDINGPANELS_OPTION_CONTAINER_CLASSNAME)
				.data(SLIDINGPANELS_OPTIONS_DATA_NAME);
		if (secOpts)
			return $.extend({}, $.fn.slideToPanel.DEFAULTS, secOpts, options);
		else 
			return $.extend({}, $.fn.slideToPanel.DEFAULTS, options);
	}
	
	function getPanelWidth(block, opts) {
		return block.children("." + opts.contentClass).width() + 50;
	}
	
	function slideOutPanel(block, opts) {
		block.animate({
				left: -1 * getPanelWidth(block, opts),
				opacity:0
			}, opts.duration, 
			function(){
				//$(this).css('visibility','hidden');
				$(this).hide();
			}
		);
	}
	
	function slideInPanels(jqr, opts, complete) {
		//Hidden soll sicherstellen, dass show() zwar schon "rendert", aber noch unsichtbar vor Festlegen der Position.
		jqr.css('visibility', 'hidden');
		//Show vor getPanelWidth(), damit die berechnete Breite auch stimmt.
		jqr.show();
		//Startposition für die Animation festlegen, da die im Fall eines noch nie ausgeblendeten Panels nicht stimmt.
		jqr.css('left', -1 * getPanelWidth(jqr, opts));
		//Nun darf das Panel sichtbar werden und anschließend animiert hervorgeschoben werden:
		jqr.css('visibility', 'visible');
		jqr.animate({
				left:'-1em',
				opacity:1
			}, opts.duration, 
			complete
		);
	}
	
	//Ein Sub-Panel einblenden. Alle Parent-Panels müssen dafür sichtbar sein.
	//Notiz: Unterstützt sowohl das Sichtbarmachen von "visibility:hidden" als auch
	//       das (Wieder)-Einblenden per Display-Eigenschaft.
	//Grund: Vorgesehen ist, dass initial eine display-Eingenschaft auch für unsichtbare Panels
	//       != none (z.B. inline-block) erlaubt ist, aber ein späteres dynamisches Ausblenden
	//		 findet per hide() und ein Wieder-Einblenden per show() statt. jQuery merkt sich bei
	//		 hide() die initiale Display-Eigenschaft und stellt sie bei show() wieder her.
	//		 Das komplette Verstecken per hide() hat den Vorteil, dass auch überbreit gewordene Container,
	//		 die einmal (ebenfalls ausgeblendete) Kind-Panels enthielten, nicht mehr lediglich unsichtbar,
	//		 aber rechts über die sichtbaren Panels hinausragen und unnötig ein Scrollen nach rechts
	//		 verursachen können.
	function slideInPanel(jqr, opts) {
		if (jqr.css('visibility')!=='visible' || jqr.is(':hidden')) {
			slideInPanels(jqr, opts, function() {
					//Scroll-Anweisung wird explizit für Vater-Panel ausgestellt, welches das this-Panel ja als Kindknoten enthält.
					//Grund: Auf diese Weise versucht die Scroll-Routine zwar, den rechten Rand von parent (gleich rechtem Rand von this)
					//rechtsbündig in den Viewport zu scrollen, _aber nur, falls damit der linke Rand von Parent_ nicht nach links aus
					//dem Viewport herausscrollt. Immerhin hat oft ein Form-Element im Parent-Panel noch den Fokus, und das soll sichtbar bleiben.
					//In diesem Fall würde nur so weit rechts gescrollt, bis der linke Rand des Parent-Panels linksbündig im Viewport ist
					//und das this-Panel wird nach rechts abgeschnitten. Gibt es kein Parent-Panel, wird auch nicht gescrollt.
					$(this).parent("." + opts.panelClass).scrollRightIntoView(opts.viewport, 10, opts.duration);
					if (typeof opts.complete === "function") {
						opts.complete.apply(this, arguments);
					}
				}
			);
		}
	}
	
	//Alle Sub-Panels des Panels #id ausblenden, #id selbst aber sichtbar lassen.
	function slideOutChildren(jqr, opts) {
		slideOutPanel($("." + opts.panelClass, jqr), opts);
	}
	
	function slideInParents(jqr, opts) {
		slideInPanels(jqr.parents("." + opts.panelClass)
						  .filter((idx, node) => $(node).is(":hidden") || $(node).css("visibility") !== "visible"), 
						  opts);
	}
	
	$.fn.setupSlideToPanel = function(options) {
		if (typeof options !== "object")
			throw "Argument to setupShowOrHideSection must be an object (containing options to be stored as setup)!";
		this.data(SLIDINGPANELS_OPTIONS_DATA_NAME, options)
			.addClass(SLIDINGPANELS_OPTION_CONTAINER_CLASSNAME);
	}
	
	//Panel #id ggf. einblenden, falls noch nicht sichtbar, bzw. alle seine Sub-Panels ausblenden, falls diese sichtbar sein sollten,
	//so dass am Ende genau #id und seine Parent-Panels sichtbar sind.
	$.fn.slideToPanel = function(options) {
		const opts = getSlPanelOptions($(this), options);
		slideOutChildren(this, opts);
		slideInParents(this, opts);
		slideInPanel(this, opts);
		
		return 	this;
	};
	
	$.fn.slideToPanel.DEFAULTS = $.extend({
			panelClass: "slidingpanel",
			contentClass: "content",
			complete: undefined
		}, $.fn.showOrHideSection.DEFAULTS);
		
	$.fn.childPanel = function(options) {
		const opts = getSlPanelOptions($(this), options);
		let sub = this.children('.slidingpanel');
        if (!sub.length) { //Neues Slidingpanel einfügen, falls noch keins existiert.
            this.append('<div class="' + opts.panelClass + '"><div class="' + opts.contentClass + '"></div></div>');
			sub = this.children('.slidingpanel').hide();
        }
        return sub;
	};
	
	$.fn.panelContent = function(options) {
		const opts = getSlPanelOptions($(this), options);
		return this.children("." + opts.contentClass);
	};
	
}(jQuery));
