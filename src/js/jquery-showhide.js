// @codekit-append "sliding-panels"
"use strict";
(function($){
	
	function scrollTo(jqr, pos, duration, horizontal) {
		if (!horizontal) {
			if (typeof $.fn.scrollTo === "function") 
				jqr.scrollTo(pos, duration);
			else
				jqr.scrollTop(pos);
		} else {
			if (typeof $.fn.scrollTo === "function")
				jqr.scrollTo({left: pos, top: "+=0"}, duration);
			else
				jqr.scrollLeft(pos);
		}
	}

	function getViewportInfo(node, win) {
		const winTop = win.scrollTop();
		const winHeight = win.height();
		const winLeft = win.scrollLeft();
		const winWidth = win.width();
		let nodeTop = node.offset().top;
		const nodeHeight = node.outerHeight();
		let nodeLeft = node.offset().left;
		const nodeWidth = node.outerWidth();
		if (win.get(0) !== window) {
			//node.offset() ist relativ zum Dokument, nicht zum scrollbaren Viewport "win". Daher dessen aktuelle Scrollposition mit berücksichtigen:
			//nodeLeft ist bei scrollLeft == 0 (also ganz links) identisch zu win.offset().left, i.d.R. also > 0!
			//Daher von nodeLeft zunächst win.offset().left abziehen, um die linke Position relativ zu "win" zu bekommen.
			//Da sich diese nun aber relativ auf den linken Rand der Scrollbox bezieht, addiere win.scrollLeft() (winLeft), um die Position
			//relativ zum Inhalt der Scrollbox zu bekommen:
			nodeLeft += winLeft - win.offset().left;
			//analog für Top:
			nodeTop += winTop - win.offset().top;
		}
		return {
			nodeTop: nodeTop,
			nodeBottom: nodeTop + nodeHeight,
			nodeHeight: nodeHeight,
			nodeLeft: nodeLeft,
			nodeRight: nodeLeft + nodeWidth,
			nodeWidth: nodeWidth,
			winTop: winTop,
			winBottom: winTop + winHeight,
			winHeight: winHeight,
			winLeft: winLeft,
			winRight: winLeft + winWidth,
			winWidth: winWidth
		};
	}
	
	const SHOW_HIDE_OPTIONS_SECTION_DATA_NAME = "jquery-showhide-setup";
	
	function getShowOrHideOptions(section, options) {
		let secOpts = section.data(SHOW_HIDE_OPTIONS_SECTION_DATA_NAME);
		if (typeof secOpts !== "object") {
			secOpts = {};
		}
		return $.extend({}, $.fn.showOrHideSection.DEFAULTS, secOpts, options);
	}
	
	$.fn.isTopInViewport = function(viewport = $(window)) {
		const i = getViewportInfo(this, viewport);
		return i.nodeTop >= i.winTop && i.nodeTop <= i.winBottom;
	};
	
	$.fn.isTopBelowViewport = function(viewport = $(window), delta = 0) {
		const i = getViewportInfo(this, viewport);
		return i.nodeTop > i.winBottom - delta;
	};
	
	$.fn.isTopAboveViewport = function(viewport = $(window), delta = 0) {
		const i = getViewportInfo(this, viewport);
		return i.nodeTop < i.winTop + delta;
	};
	
	$.fn.isLeftInViewport = function(viewport = $(window)) {
		const i = getViewportInfo(this, viewport);
		return i.nodeLeft >= i.winLeft && i.nodeLeft <= i.winRight;
	};
	
	$.fn.isLeftRightOutOfViewport = function(viewport = $(window), delta = 0) {
		const i = getViewportInfo(this, viewport);
		return i.nodeLeft > i.winRight - delta;
	};
	
	$.fn.isLeftLeftOutOfViewport = function(viewport = $(window), delta = 0) {
		const i = getViewportInfo(this, viewport);
		return i.nodeLeft < i.winLeft + delta;
	};
	
	$.fn.isBottomInViewport = function(viewport = $(window)) {
		const i = getViewportInfo(this, viewport);
		return i.nodeBottom >= i.winTop && i.nodeBottom <= i.winBottom;
	};
	
	$.fn.isRightInViewport = function(viewport = $(window)) {
		const i = getViewportInfo(this, viewport);
		return i.nodeRight >= i.winLeft && i.nodeRight <= i.winRight;
	};
	
	$.fn.viewportAlignBottom = function(viewport = $(window), tolerance = 30, duration = $.fn.showOrHideSection.DEFAULTS.duration, viewportInfo) {
		const i = viewportInfo ? viewportInfo : getViewportInfo(this, viewport);
		scrollTo(viewport, i.nodeBottom - i.winHeight + tolerance, duration); 
		return this;
	};
	
	$.fn.viewportAlignTop = function(viewport = $(window), tolerance = 20, duration = $.fn.showOrHideSection.DEFAULTS.duration, viewportInfo) {
		const i = viewportInfo ? viewportInfo : getViewportInfo(this, viewport);
		scrollTo(viewport, i.nodeTop - tolerance, duration);
		return this;
	};
	
	$.fn.scrollDownIntoView = function(viewport = $(window), tolerance = 30, duration = $.fn.showOrHideSection.DEFAULTS.duration) {
		const i = getViewportInfo(this, viewport);
		if (i.nodeHeight + 2 * tolerance > i.winHeight) 
			this.viewportAlignTop(viewport, tolerance, duration, i);
		else
			this.viewportAlignBottom(viewport, tolerance, duration, i);
		return this;
	};
	
	$.fn.viewportAlignRight = function(viewport = $(window), tolerance = 30, duration = $.fn.showOrHideSection.DEFAULTS.duration, viewportInfo) {
		const i = viewportInfo ? viewportInfo : getViewportInfo(this, viewport);
		scrollTo(viewport, i.nodeRight - i.winWidth + tolerance, duration, true);
		return this;
	};
	
	$.fn.viewportAlignLeft = function(viewport = $(window), tolerance = 20, duration = $.fn.showOrHideSection.DEFAULTS.duration, viewportInfo) {
		const i = viewportInfo ? viewportInfo : getViewportInfo(this, viewport);
		scrollTo(viewport, i.nodeLeft - tolerance, duration, true);
		return this;
	};
	
	$.fn.scrollRightIntoView = function(viewport = $(window), tolerance = 30, duration = $.fn.showOrHideSection.DEFAULTS.duration) {
		const i = getViewportInfo(this, viewport);
		if (i.nodeWidth + 2 * tolerance > i.winWidth) 
			this.viewportAlignLeft(viewport, tolerance, duration, i);
		else
			this.viewportAlignRight(viewport, tolerance, duration, i);
		return this;
	};
	
	function expandAndApplySelector(block, selectorOrResult) {
		return typeof selectorOrResult !== "string" ? selectorOrResult 
			: !block.length ? block
			: $(selectorOrResult.replace(/\${([^}]+)}/g, 
				  (match, group) => block.prop(group)
			  ));
	}
	
	function doShowOrHideBlock(block, showHide, opts) {
	
		//switch class of toggle element (if exists)
		const toggle = expandAndApplySelector(block, opts.toggle);
		//for any found heading (one or none) change class:
		toggle.toggleClass(opts.classShowing, showHide !== 'hide');
		toggle.toggleClass(opts.classHidden, showHide === 'hide');
		
		//store aria attribute
		const ariaTarget = expandAndApplySelector(block, opts.ariaExpandedSelector).first();
		ariaTarget.attr("aria-expanded", "" + (showHide !== 'hide'));
		
		//store state in hidden field (if exists)
		const findstore = expandAndApplySelector(block, opts.store);
		if (findstore && findstore.length) { //found
			const store = findstore.get(0);
			if (showHide==='hide')
				store.value="";
			else
				store.value="X";
		}
		
		function complete() {
			//scroll?
			if (opts.scroll && showHide === "show") {
				if (block.isTopBelowViewport(opts.viewport, 50)) {
					block.scrollDownIntoView(opts.viewport, opts.scrollTolerance, opts.duration);
				} else if (block.isTopAboveViewport(opts.viewport, 50)) {
					block.viewportAlignTop(opts.viewport, opts.scrollTolerance, opts.duration);
				}
			}
		}

		//animate target itself
		if (opts.horizontalAnimation)
			block.animate({
				width: showHide,
				opacity: showHide
				}, opts.duration, opts.easing, complete);
		else
			block.animate({
				height: showHide,
				opacity: showHide
				}, opts.duration, opts.easing, complete);

		if (showHide === 'show' && typeof opts.onShow === "function") {
			opts.onShow.call(block.get(0), block, toggle);
		}
		if (showHide === 'hide' && typeof opts.onHide === "function") {
			opts.onHide.call(block.get(0), block, toggle);
		}
		if (typeof opts.onToggle === "function") {
			opts.onToggle.call(block.get(0), block, toggle);
		}
	}
	
	$.fn.setupShowOrHideSection = function(options) {
		if (typeof options !== "object")
			throw "Argument to setupShowOrHideSection must be an object (containing options to be stored as setup)!";
		this.data(SHOW_HIDE_OPTIONS_SECTION_DATA_NAME, options);
	}
	
	$.fn.showOrHideSection = function(options) {
        this.each(function() {
	        const opts = getShowOrHideOptions($(this), options);
            const condition = typeof opts.condition !== "undefined" ? opts.condition : !$(this).is(":visible");
            const showHide = condition ? "show" : "hide";
            doShowOrHideBlock($(this), showHide, opts);
        });
		return this;
	};
		
	$.fn.showSection = function(options) {
        this.each(function() {
    	    const opts = getShowOrHideOptions($(this), options);
            doShowOrHideBlock($(this), "show", opts);
        });
		return this;
	};
		
	$.fn.hideSection = function(options) {
        this.each(function() {
        	const opts = getShowOrHideOptions($(this), options);
            doShowOrHideBlock($(this), "hide", opts);
        });
		return this;
	};
	
	
	$.fn.showOrHideChildren = function(childrenSelect, options) {
        this.each(function() {
        	const opts = getShowOrHideOptions($(this), options);
            //switch class of toggle element 
            const toggle = $(this).getSectionToggle(options);

            var showing = toggle.hasClass("showing");
            //switch class of block heading (if exists)
            toggle.toggleClass("showing", !showing);
            toggle.toggleClass("hidden", showing);

            var showHide = showing ? "hide" : "show";

            var resultset = $(childrenSelect, $(this));

            //animate block itself
            if (opts.horizontalAnimation)
                resultset.animate({
                    width: showHide,
                    opacity: showHide
                    }, opts.duration, opts.easing);
            else
                resultset.animate({
                    height: showHide,
                    opacity: showHide
                    }, opts.duration, opts.easing);
        });
		return this;
	};
	
	$.fn.getSectionToggle = function(options) {
		const opts = getShowOrHideOptions(this, options);
		return expandAndApplySelector(this, opts.toggle);
	}
	
	$.fn.showOrHideSection.DEFAULTS = {
		classShowing: "showing",
		classHidden: "hidden",
		easing: undefined,
		horizontalAnimation: false,
		duration: 200,
		scroll: false,
		scrollTolerance: undefined,
		toggle: "#${id}_h",
//		store: "#${id}_state"
		store: undefined,
		ariaExpandedSelector: "#${id}_h a[href]:first, #${id}_h button:first",
		condition: undefined,
		viewport: $(window),
		onToggle: undefined,
		onShow: undefined,
		onHide: undefined
	};
	
	
	
	/* Ib) More-Links und More-Blocks 
	 * 
	 * Usage: Ein Block (z.B. Absatz) wird mit der Klasse .appendMore ausgestattet. 
	 * (Der Mehr...-Link wird an den Inhalt des .appendMore-Blocks angefügt. Absätze können selbst von der Klasse appendMore sein, soll aber z.B. auf eine
	 * Liste (ul) ein Mehr...-Link folgen, darf nicht die Liste selbst von der Klasse appendMore sein, sondern ist in einen Div-Block der Klasse appendMore einzufassen,
	 * damit der Link sp‰ter *hinter* dem UL-Element eingef¸gt wird.)
	 * Entweder folgt innerhalb dieses Blocks ein Kindelement der Klasse .more, oder als direkter Nachbar (Nachfolger) des .appendMore.Blocks
	 * oder eines seiner Vorfahren. 
	 * Geschachtelte Blöcke: Es ist erlaubt, dass ein appendMore-Block selbst innere appendMore-/More-Blöcke enthält. In dem Fall darf sein "eigener" more-Block
	 * nicht ebenfalls ein Kindelement sein, sondern muss ein Nachfolger sein wie oben beschrieben.
	 * Ist JavaScript aktiviert, wird an den Inhalt jedes appendMore-Blocks automatisch ein "Mehr..."-Link angefügt und die more-Blocks ausgeblendet.
	 * Der Link blendet diese dann wieder ein. Nur für echte Block-Elemente der Klasse .more (Div, Absatz etc.) wird eine slideDown-Animation
	 * angewendet. Ist der .more-Teil z.B. ein Span innerhalb eines Absatzes der Klasse .appendMore, so wird zwar das Einblenden des more-Blocks
	 * funktionieren, jedoch ohne Animation (da die auf Inline-Elemente nicht anwendbar ist).
	 * 
	 **/
	$.fn.appendMoreLinks = function(options) {
		const opts = $.extend({}, $.fn.appendMoreLinks.DEFAULTS, options);
		this.append(" <a href='#!' class='" + opts.moreLinkClass + "'>" + opts.moreLinkLabel + "</a>");
		//Soeben eingefügte Links nun mit Leben ausstatten:
		$("a." + opts.moreLinkClass).click(function() {
			$(this).hide();
			//Suche den .more-Block zum Link.
			var finder = $(this).parent(); //Ausgangspunkt ist der Vorfahr des .more-Links (Block der Klasse .appendMore)
			var found = finder.next(opts.moreContentSelector);
			while (!found.length && finder.length) { //Pr¸fe ansonsten noch die Nachfolger der Vorfahren
				finder = finder.parent();
				found = finder.next(opts.moreContentSelector);
			}
			found.slideDown("fast");

			return false; //Springen zum Anchor '#' vermeiden
		});
		return this;
	};
	
	$.fn.appendMoreLinks.DEFAULTS = {
		moreLinkClass: "moreLink",
		moreLinkLabel: "more&nbsp;&hellip;",
		moreContentSelector: ".more"
	};
	
}(jQuery));
