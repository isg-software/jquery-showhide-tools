// @codekit-append "sliding-panels"
/**
 * @license 
 * Copyright (c) 2018, Immo Schulz-Gerlach, www.isg-software.de 
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
 
 /**
 * Namespace of jQuery. Usually bound to the alias <code>$</code>.
 *  
 * @see http://jquery.com/
 * @namespace jQuery 
 */
 
/**
 * Namespace for jQuery plug-ins.
 *  
 * @see http://jquery.com/
 * @namespace fn
 * @memberOf jQuery
 */
 
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
	
	/**
	 * jQuery plug-in function: checks whether the top of the first element in the set of matched elements
	 * is visible within the viewport.
	 * <p>Usage pattern:</p>
	 * <pre><code>if ($(selector).isTopInViewport())</code></pre>
	 * @function isTopInViewport
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to check against. The default viewport is the whole window.
	 * @return {boolean} true if the top of the first element of the implicit argument is
	 * within the viewport
	 * @see jQuery.fn.isBottomInViewport
	 */
	$.fn.isTopInViewport = function(viewport = $(window)) {
		const i = getViewportInfo(this, viewport);
		return i.nodeTop >= i.winTop && i.nodeTop <= i.winBottom;
	};
	
	/**
	 * jQuery plug-in function: checks whether the top of the first element in the set of matched elements
	 * is not within the viewport but lies beneath (so a user has to scroll forwards in order for
	 * the element to enter the viewport).
	 * <p>Usage pattern:</p>
	 * <pre><code>if ($(selector).isTopBelowViewport())</code></pre>
	 * @function isTopBelowViewport
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to check against. The default viewport is the whole window.
	 * @param {int} [delta=0] The delta is substracted from the calculated viewport bottom, i.e.
	 * if you enter a positive value, the function will return true "earlier", i.e. even if the
	 * top is not yet quite below viewport, but below viewport bottom minus delta.
	 * @return {boolean} true if the top of the first element of the implicit argument is
	 * below the bottom of the viewport (minus delta)
	 */
	$.fn.isTopBelowViewport = function(viewport = $(window), delta = 0) {
		const i = getViewportInfo(this, viewport);
		return i.nodeTop > i.winBottom - delta;
	};
	
	/**
	 * jQuery plug-in function: checks whether the top of the first element in the set of matched elements
	 * is not within the viewport but lies above. The element itself may be partially visible, but 
	 * at least its top is cut off.
	 * <p>Usage pattern:</p>
	 * <pre><code>if ($(selector).isTopAboveViewport())</code></pre>
	 * @function isTopBelowViewport
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to check against. The default viewport is the whole window.
	 * @param {int} [delta=0] The delta is added from the calculated viewport top, i.e.
	 * if you enter a positive value, the function will return true "earlier", i.e. even if the
	 * top might be in viewport, but less that delta pixels below the viewport top.
	 * @return {boolean} true if the top of the first element of the implicit argument is
	 * above the top of the viewport (plus delta)
	 */
	$.fn.isTopAboveViewport = function(viewport = $(window), delta = 0) {
		const i = getViewportInfo(this, viewport);
		return i.nodeTop < i.winTop + delta;
	};
	
	/**
	 * jQuery plug-in function: checks whether the left of the first element in the set of matched elements
	 * is visible within the viewport. 
	 * Like {@link jQuery.fn.isTopInViewport}, but meant for horizontally scrolling viewports.
	 * <p>Usage pattern:</p>
	 * <pre><code>if ($(selector).isLeftInViewport())</code></pre>
	 * @function isLeftInViewport
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to check against. The default viewport is the whole window.
	 * @return {boolean} true if the left of the first element of the implicit argument is
	 * within the viewport
	 * @see jQuery.fn.isRightInViewport
	 */
	$.fn.isLeftInViewport = function(viewport = $(window)) {
		const i = getViewportInfo(this, viewport);
		return i.nodeLeft >= i.winLeft && i.nodeLeft <= i.winRight;
	};
	
	/**
	 * jQuery plug-in function: checks whether the left of the first element in the set of matched elements
	 * is not within the viewport but lies to the right of it.
	 * Like {@link jQuery.fn.isTopBelowViewport}, but meant for horizontally scrolling viewports.
	 * <p>Usage pattern:</p>
	 * <pre><code>if ($(selector).isLeftRightOutOfViewport())</code></pre>
	 * @function isLeftRightOutOfViewport
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to check against. The default viewport is the whole window.
	 * @param {int} [delta=0] The delta is substracted from the calculated viewport right, i.e.
	 * if you enter a positive value, the function will return true "earlier", i.e. even if the
	 * top is not yet quite right out of the viewport, but to the right of viewport right minus delta.
	 * @return {boolean} true if the left of the first element of the implicit argument is
	 * to the right of the right-hand side of the viewport (minus delta)
	 */
	$.fn.isLeftRightOutOfViewport = function(viewport = $(window), delta = 0) {
		const i = getViewportInfo(this, viewport);
		return i.nodeLeft > i.winRight - delta;
	};
	
	/**
	 * jQuery plug-in function: checks whether the left of the first element in the set of matched elements
	 * is not within the viewport but to the left of it. The element itself may be partially visible, but 
	 * at least its left part is cut off.
	 * Like {@link jQuery.fn.isTopAboveViewport}, but meant for horizontally scrolling viewports.
	 * <p>Usage pattern:</p>
	 * <pre><code>if ($(selector).isLeftLeftOutOfViewport())</code></pre>
	 * @function isLeftLeftOutOfViewport
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to check against. The default viewport is the whole window.
	 * @param {int} [delta=0] The delta is added from the calculated viewport left, i.e.
	 * if you enter a positive value, the function will return true "earlier", i.e. even if the
	 * top might be in viewport, but less that delta pixels below the left viewport edge.
	 * @return {boolean} true if the left side of the first element of the implicit argument is
	 * to the left of the viewport (plus delta)
	 */
	$.fn.isLeftLeftOutOfViewport = function(viewport = $(window), delta = 0) {
		const i = getViewportInfo(this, viewport);
		return i.nodeLeft < i.winLeft + delta;
	};
	
	/**
	 * jQuery plug-in function: checks whether the bottom of the first element in the set of matched elements
	 * is visible within the viewport.
	 * <p>Usage pattern:</p>
	 * <pre><code>if ($(selector).isBottomInViewport())</code></pre>
	 * @function isBottomInViewport
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to check against. The default viewport is the whole window.
	 * @return {boolean} true if the bottom of the first element of the implicit argument is
	 * within the viewport
	 * @see jQuery.fn.isTopInViewport
	 */
	$.fn.isBottomInViewport = function(viewport = $(window)) {
		const i = getViewportInfo(this, viewport);
		return i.nodeBottom >= i.winTop && i.nodeBottom <= i.winBottom;
	};
	
	/**
	 * jQuery plug-in function: checks whether the right of the first element in the set of matched elements
	 * is visible within the viewport. 
	 * Like {@link jQuery.fn.isBottomInViewport}, but meant for horizontally scrolling viewports.
	 * <p>Usage pattern:</p>
	 * <pre><code>if ($(selector).isLeftInViewport())</code></pre>
	 * @function isLeftInViewport
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to check against. The default viewport is the whole window.
	 * @return {boolean} true if the right of the first element of the implicit argument is
	 * within the viewport
	 * @see jQuery.fn.isTopInViewport
	 */
	$.fn.isRightInViewport = function(viewport = $(window)) {
		const i = getViewportInfo(this, viewport);
		return i.nodeRight >= i.winLeft && i.nodeRight <= i.winRight;
	};
	
	/**
	 * jQuery plug-in function: Tries vertical scroll in order to align the bottom of the first
	 * element in the set of matched elements (jQuery result set) with the bottom of the viewport.
	 * The alignment isn't always quite accurate, also an exact alignment with the bottom of the viewport
	 * often isn't desirable, a little margin between the viewport and the element may look better.
	 * That's why a tolerance is specified, defaulting to 30 px. This means, the plug-in will try
	 * to align the bottom of the matched element approximately 30px above the bottom of the viewport,
	 * the effective margin may be smaller.
	 * <p>Optional Dependency: <a href="https://github.com/flesler/jquery.scrollTo">jquery.scrollTo</a>:
	 * If this plug-in is available, it will be used to scroll animatedly, otherwise the alignment
	 * will be instantaneous, without animation.
 	 * <p>Usage pattern:</p>
	 * <pre><code>$("#mySection").viewportAlignBottom();</code></pre>
	 * @function viewportAlignBottom
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to align against. The default viewport is the whole window.
	 * @param {int} [tolerance=30] approx. margin between bottom of the element and bottom of the viewport, see above
	 * @param {int} [duration=200] duration of the scrolling animation. The default value of 200ms is defined
	 * in {@link jQuery.fn.showOrHideSection.DEFAULTS}, which may be overridden.
	 * (if the scrollTo plug-in is loaded).
	 * @return {jqr} the same jQuery resultset this function was called upon, 
	 * allows for chaining several jQuery plug-in calls on the same result set.
	 */
	$.fn.viewportAlignBottom = function(viewport = $(window), tolerance = 30, duration = $.fn.showOrHideSection.DEFAULTS.duration, viewportInfo) {
		const i = viewportInfo ? viewportInfo : getViewportInfo(this, viewport);
		scrollTo(viewport, i.nodeBottom - i.winHeight + tolerance, duration); 
		return this;
	};
	
	/**
	 * jQuery plug-in function: Tries vertical scroll in order to align the top of the first
	 * element in the set of matched elements (jQuery result set) with the top of the viewport.
	 * The alignment isn't always quite accurate, also an exact alignment with the top of the viewport
	 * often isn't desirable, a little margin between the upper window edge and the element may look better.
	 * That's why a tolerance is specified, defaulting to 20 px. This means, the plug-in will try
	 * to align the top of the matched element approximately 20px above the top of the viewport,
	 * the effective margin may be smaller.
	 * <p>Optional Dependency: <a href="https://github.com/flesler/jquery.scrollTo">jquery.scrollTo</a>:
	 * If this plug-in is available, it will be used to scroll animatedly, otherwise the alignment
	 * will be instantaneous, without animation.
 	 * <p>Usage pattern:</p>
	 * <pre><code>$("#mySection").viewportAlignTop();</code></pre>
	 * @function viewportAlignTop
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to align against. The default viewport is the whole window.
	 * @param {int} [tolerance=20] approx. margin between top of the element and top of the viewport, see above
	 * @param {int} [duration=200] duration of the scrolling animation. The default value of 200ms is defined
	 * in {@link jQuery.fn.showOrHideSection.DEFAULTS}, which may be overridden.
	 * (if the scrollTo plug-in is loaded).
	 * @return {jqr} the same jQuery resultset this function was called upon, 
	 * allows for chaining several jQuery plug-in calls on the same result set.
	 */
	$.fn.viewportAlignTop = function(viewport = $(window), tolerance = 20, duration = $.fn.showOrHideSection.DEFAULTS.duration, viewportInfo) {
		const i = viewportInfo ? viewportInfo : getViewportInfo(this, viewport);
		scrollTo(viewport, i.nodeTop - tolerance, duration);
		return this;
	};
	
	/**
	 * jQuery plug-in function: Tries to scroll the selected section into view. The section
	 * is the first element of the matched elements (jQuery result set).
	 * If this sections height (minus twice the tolerance) is larger than the viewport's height,
	 * it will be aligned by its top (see {@link jQuery.fn.viewportAlignTop viewportAlignTop}),
	 * otherwise it will be aligned by its bottom (see {@link jQuery.fn.viewportAlignBottom viewportAlignBottom}).
	 * If the current viewport is above the target element, this will result in scrolling down only
	 * as far as necessary to get the whole element into view (or to get its top into view, if it's too
	 * large for the viewport).
 	 * <p>Usage pattern:</p>
	 * <pre><code>$("#mySection").scrollDownIntoView();</code></pre>
	 * @function scrollDownIntoView
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to align against. The default viewport is the whole window.
	 * @param {int} [tolerance=30] tolerance / approx. margin to be left free between the viewport
	 * edges and the target element
	 * @param {int} [duration=200] duration of the scrolling animation. The default value of 200ms is defined
	 * in {@link jQuery.fn.showOrHideSection.DEFAULTS}, which may be overridden.
	 * (if the scrollTo plug-in is loaded).
	 * @return {jqr} the same jQuery resultset this function was called upon, 
	 * allows for chaining several jQuery plug-in calls on the same result set.
	 */
	$.fn.scrollDownIntoView = function(viewport = $(window), tolerance = 30, duration = $.fn.showOrHideSection.DEFAULTS.duration) {
		const i = getViewportInfo(this, viewport);
		if (i.nodeHeight + 2 * tolerance > i.winHeight) 
			this.viewportAlignTop(viewport, tolerance, duration, i);
		else
			this.viewportAlignBottom(viewport, tolerance, duration, i);
		return this;
	};
	
	/**
	 * jQuery plug-in function: Tries horizontal scroll in order to align the right of the first
	 * element in the set of matched elements (jQuery result set) with the right of the viewport.
	 * (Horizontal version of {@link jQuery.fn.viewportAlignBottom}.)
	 * <p>Optional Dependency: <a href="https://github.com/flesler/jquery.scrollTo">jquery.scrollTo</a>:
	 * If this plug-in is available, it will be used to scroll animatedly, otherwise the alignment
	 * will be instantaneous, without animation.
 	 * <p>Usage pattern:</p>
	 * <pre><code>$("#mySection").viewportAlignRight();</code></pre>
	 * @function viewportAlignRight
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to align against. The default viewport is the whole window.
	 * @param {int} [tolerance=30] approx. margin between right of the element and right of the viewport, see above
	 * @param {int} [duration=200] duration of the scrolling animation. The default value of 200ms is defined
	 * in {@link jQuery.fn.showOrHideSection.DEFAULTS}, which may be overridden.
	 * (if the scrollTo plug-in is loaded).
	 * @return {jqr} the same jQuery resultset this function was called upon, 
	 * allows for chaining several jQuery plug-in calls on the same result set.
	 */
	$.fn.viewportAlignRight = function(viewport = $(window), tolerance = 30, duration = $.fn.showOrHideSection.DEFAULTS.duration, viewportInfo) {
		const i = viewportInfo ? viewportInfo : getViewportInfo(this, viewport);
		scrollTo(viewport, i.nodeRight - i.winWidth + tolerance, duration, true);
		return this;
	};
	
	/**
	 * jQuery plug-in function: Tries horizontal scroll in order to align the left of the first
	 * element in the set of matched elements (jQuery result set) with the left end of the viewport.
	 * (Horizontal version of {@link jQuery.fn.viewportAlignTop}.)
	 * <p>Optional Dependency: <a href="https://github.com/flesler/jquery.scrollTo">jquery.scrollTo</a>:
	 * If this plug-in is available, it will be used to scroll animatedly, otherwise the alignment
	 * will be instantaneous, without animation.
 	 * <p>Usage pattern:</p>
	 * <pre><code>$("#mySection").viewportAlignLeft();</code></pre>
	 * @function viewportAlignLeft
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to align against. The default viewport is the whole window.
	 * @param {int} [tolerance=20] approx. margin between left of the element and left of the viewport, see above
	 * @param {int} [duration=200] duration of the scrolling animation. The default value of 200ms is defined
	 * in {@link jQuery.fn.showOrHideSection.DEFAULTS}, which may be overridden.
	 * (if the scrollTo plug-in is loaded).
	 * @return {jqr} the same jQuery resultset this function was called upon, 
	 * allows for chaining several jQuery plug-in calls on the same result set.
	 */
	$.fn.viewportAlignLeft = function(viewport = $(window), tolerance = 20, duration = $.fn.showOrHideSection.DEFAULTS.duration, viewportInfo) {
		const i = viewportInfo ? viewportInfo : getViewportInfo(this, viewport);
		scrollTo(viewport, i.nodeLeft - tolerance, duration, true);
		return this;
	};
	
	/**
	 * jQuery plug-in function: Tries to horizontally scroll the selected section into view. The section
	 * is the first element of the matched elements (jQuery result set).
	 * If this sections width (minus twice the tolerance) is larger than the viewport's width,
	 * it will be aligned by its left (see {@link jQuery.fn.viewportAlignLeft viewportAlignLeft}),
	 * otherwise it will be aligned by its bottom (see {@link jQuery.fn.viewportAlignRight viewportAlignRight}).
	 * If the current viewport is to the left of the target element, this will result in scrolling right only
	 * as far as necessary to get the whole element into view (or to get its left into view, if it's too
	 * large for the viewport).
 	 * <p>Usage pattern:</p>
	 * <pre><code>$("#mySection").scrollRightIntoView();</code></pre>
	 * @function scrollRightIntoView
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to align against. The default viewport is the whole window.
	 * @param {int} [tolerance=30] tolerance / approx. margin to be left free between the viewport
	 * edges and the target element
	 * @param {int} [duration=200] duration of the scrolling animation. The default value of 200ms is defined
	 * in {@link jQuery.fn.showOrHideSection.DEFAULTS}, which may be overridden.
	 * (if the scrollTo plug-in is loaded).
	 * @return {jqr} the same jQuery resultset this function was called upon, 
	 * allows for chaining several jQuery plug-in calls on the same result set.
	 */
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
	
	/**
	 * jQuery plug-in function: Saves options for {@link jQuery.fn.showOrHideSection} as well
	 * as similar functions like {@link jQuery.fn.showSection} permanently in a data cache
	 * associated with all of the selected elements.
	 * So whenever you later call something like <code>$(selector).showOrHideSection()</code>
	 * for the same selector or one selecting a subset of that used for this setup, the options
	 * passed to this setup function will be used during that showOrHide operation.
	 * @function setupShowOrHideSection
	 * @memberOf jQuery.fn
	 * @param {object} options An object defining options for the showOrHideSection(), showSection()
	 * oder hideSection() functions. See {@link jQuery.fn.showOrHideSection.DEFAULTS DEFAULTS options}
	 * for a list of available options and their default values. For any option you omit in your options
	 * argument, the default option will be used. So this argument only needs to specify options
	 * that differ from the defaults.
	 * @return {jqr} the same jQuery resultset this function was called upon, 
	 * allows for chaining several jQuery plug-in calls on the same result set.
	 */
	$.fn.setupShowOrHideSection = function(options) {
		if (typeof options !== "object")
			throw "Argument to setupShowOrHideSection must be an object (containing options to be stored as setup)!";
		this.data(SHOW_HIDE_OPTIONS_SECTION_DATA_NAME, options);
	}
	
	/**
	 * jQuery plug-in function: Toggle a section: If it's visible, hide it, if it's hidden, show it.
	 * In difference to standard jQuery functions, this one supports changing a class of 
	 * a toggle control (like a button or link used to trigger this showOrHide action), so this
	 * control may reflect the state (hidden or showing). Also a third element used for 
	 * transmitting the state in a form post request can be implicitly updated.
	 * @function showOrHideSection()
	 * @memberOf jQuery.fn
	 * @param {object} [options] Options for this function. This is merged with the setup.
	 * If no options are given at all, the setup is used (see {@link jQuery.fn.setupShowOrHideSection}).
	 * If no setup has been made, the {@link jQuery.fn.showOrHideSection.DEFAULTS DEFAULTS} are used.
	 * @return {jqr} the same jQuery resultset this function was called upon, 
	 * allows for chaining several jQuery plug-in calls on the same result set.
	 * @see jQuery.fn.showSection
	 * @see jQuery.fn.hideSection
	 */
	$.fn.showOrHideSection = function(options) {
        this.each(function() {
	        const opts = getShowOrHideOptions($(this), options);
            const condition = typeof opts.condition !== "undefined" ? opts.condition : !$(this).is(":visible");
            const showHide = condition ? "show" : "hide";
            doShowOrHideBlock($(this), showHide, opts);
        });
		return this;
	};
	
	/**
	 * jQuery plug-in function: Show a section: If it's hidden, show it, if it's already visible,
	 * do nothing.
	 * @function showSection
	 * @memberOf jQuery.fn
	 * @param {object} [options] Options for this function. This is merged with the setup.
	 * If no options are given at all, the setup is used (see {@link jQuery.fn.setupShowOrHideSection}).
	 * If no setup has been made, the {@link jQuery.fn.showOrHideSection.DEFAULTS DEFAULTS} are used.
	 * @return {jqr} the same jQuery resultset this function was called upon, 
	 * allows for chaining several jQuery plug-in calls on the same result set.
	 * @see jQuery.fn.showOrHideSection()
	 * @see jQuery.fn.hideSection
	 */
	$.fn.showSection = function(options) {
        this.each(function() {
    	    const opts = getShowOrHideOptions($(this), options);
            doShowOrHideBlock($(this), "show", opts);
        });
		return this;
	};
	
	/**
	 * jQuery plug-in function: HIde a section: If it's showing, hide it, if it's already hidden,
	 * do nothing.
	 * @function hideSection
	 * @memberOf jQuery.fn
	 * @param {object} [options] Options for this function. This is merged with the setup.
	 * If no options are given at all, the setup is used (see {@link jQuery.fn.setupShowOrHideSection}).
	 * If no setup has been made, the {@link jQuery.fn.showOrHideSection.DEFAULTS DEFAULTS} are used.
	 * @return {jqr} the same jQuery resultset this function was called upon, 
	 * allows for chaining several jQuery plug-in calls on the same result set.
	 * @see jQuery.fn.showOrHideSection()
	 * @see jQuery.fn.showSection
	 */
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
	
	/**
	 * @namespace showOrHideSection
	 * @memberOf jQuery.fn
	 */
	/**
	 * Default settings for many of the jQuery plug-in-functions of this package.
	 * @member DEFAULTS
	 * @memberOf jQuery.fn.showOrHideSection
	 * @property {int} duration =200 Default duration for animations (scrolling, expanding or collapsing elements).
	 */
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
