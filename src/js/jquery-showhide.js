// @codekit-append "sliding-panels"
// @codekit-append "appendMoreLinks"
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
	 * @function isTopAboveViewport
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
	 * <pre><code>if ($(selector).isRightInViewport())</code></pre>
	 * @function isRightInViewport
	 * @memberOf jQuery.fn
	 * @param {jqr} [viewport=$(window)] jQuery resultset, the first element in this set 
	 * defines the viewport to check against. The default viewport is the whole window.
	 * @return {boolean} true if the right of the first element of the implicit argument is
	 * within the viewport
	 * @see jQuery.fn.isLeftInViewport
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
	
	function expandAndApplySelector(block, selectorOrResult, startingNode) {
		if (typeof selectorOrResult !== "string")
			return selectorOrResult;
		else if (!block.length)
			return block;
		else {
			const expandedSelector = selectorOrResult.replace(/\${([^}]+)}/g, 
				  (match, group) => block.prop(group)
			);
			if (startingNode)
				return $(expandedSelector, startingNode);
			else
				return $(expandedSelector);
		}
	}
	
	function doShowOrHideBlock(block, showHide, opts) {
	
		//switch class of heading element (if exists)
		const h = block.getSectionHeading(opts);
		//for any found heading (one or none) change class:
		h.toggleClass(opts.classShowing, showHide !== 'hide');
		h.toggleClass(opts.classHidden, showHide === 'hide');
		
		//store aria attribute
		const ariaTarget = expandAndApplySelector(block, opts.toggle).first();
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
				if (block.isTopBelowViewport(opts.viewport, opts.scrollTriggerTolerance)) {
					block.scrollDownIntoView(opts.viewport, opts.scrollTolerance, opts.duration);
				} else if (block.isTopAboveViewport(opts.viewport, opts.scrollTriggerTolerance)) {
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
			opts.onShow.call(block.get(0), block, h);
		}
		if (showHide === 'hide' && typeof opts.onHide === "function") {
			opts.onHide.call(block.get(0), block, h);
		}
		if (typeof opts.onToggle === "function") {
			opts.onToggle.call(block.get(0), block, h);
		}
	}
	
	/**
	 * jQuery plug-in function: Saves options for {@link jQuery.fn.showOrHideSection()} as well
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
	 * jQuery plug-in function: Toggle a section: If the <em>condition</em> is true, show the section,
	 * otherwise hide it. The condition can be specified by a predicate in the options argument,
	 * the default condition (if none is specified by the caller) is that the selected element
	 * is not visible (<code>!$(this).is(":visible")</code>).
	 * <p>This function does not only show or hide the selected element(s), it also supports,
	 * changing the class of a heading, so this may reflect the state (hidden or showing). 
	 * Also a form element used for transmitting the current visibility state in a post request 
	 * can be implicitly updated.
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
			const condition = typeof opts.condition === "undefined" ? !$(this).is(":visible")
					: typeof opts.condition === "function" ? opts.condition.call(this, this) : opts.condition;
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
	
	//TODO: Document
	//FIXME: hard-wired class names "showing" and "hidden"! Evaluate options instead!
	//TODO: condition support ? Compare with showOrHide!
	$.fn.showOrHideChildren = function(childrenSelect, options) {
		this.each(function() {
			const opts = getShowOrHideOptions($(this), options);
			//switch class of heading element 
			const h = $(this).getSectionHeading(options);
			
			const condition = typeof opts.condition === "undefined" ? !h.hasClass("showing")
					: typeof opts.condition === "function" ? opts.condition.call(this, this) : opts.condition;
			const showHide = condition ? "show" : "hide";

			h.toggleClass("showing", condition);
			h.toggleClass("hidden", !condition);

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
	
	$.fn.showChildren = function(childrenSelect, options) {
		this.showOrHideChildren(childrenSelect, $.extend(options, {condition: true}));
	}
	
	$.fn.hideChildren = function(childrenSelect, options) {
		this.showOrHideChildren(childrenSelect, $.extend(options, {condition: false}));
	}
	
	/**
	 * jQuery plug-in: Simple getter function for getting the header element to a section
	 * as defined by the {@link jQuery.fn.showOrHideSection.DEFAULTS headingSelector option}.
	 * Mainly used internally by plug-in functions like {@link jQuery.fn.showOrHideSection()},
	 * but may also be used internally.
	 * @function getSectionHeading
	 * @memberOf jQuery.fn
	 * @param {object} [options] Options just like for {@link jQuery.fn.showOrHideSection()}.
	 * Is searched for existance of the <code>headingSelector</code> option. If that's no present
	 * (or no argument was given at all), the current {@link jQuery.fn.setupShowOrHideSection setup})
	 * is used, and if no setup is present, the {@link jQuery.fn.showOrHideSection.DEFAULTS default value} 
	 * will be used.
	 * @return {jqr} jQuery resultset (possibly empty) with the heading element, if found.
	 */
	$.fn.getSectionHeading = function(options) {
		const opts = getShowOrHideOptions(this, options);
		return expandAndApplySelector(this, opts.heading, opts.restrictSelectorsToChildren ? this : null);
	}
	
	/**
	 * @namespace showOrHideSection
	 * @memberOf jQuery.fn
	 */
	/**
	 * This object defines the default settings for {@link jQuery.fn.showOrHideSection()} and
	 * similar plug-in functions. 
	 * The table also lists all possible properties for the <code>options</code> argument
	 * of said functions.
	 * @member DEFAULTS
	 * @memberOf jQuery.fn.showOrHideSection
	 * @property {string} classShowing ="showing" Name of a CSS class which should be added to 
	 * the heading element (see property heading) when showing the corresponding section and removed
	 * when hiding the section.
	 * @property {string} classHidden ="hidden" Name of a CSS class which should be added to 
	 * the heading element (see property heading) when hiding the corresponding section and removed
	 * when showing the section.
	 * @property {string} [easing] A string indicating which easing function to use for the 
	 * show or hide transition. 
	 * See <a href="https://api.jquery.com/animate/">jQuery.animate()</a>. 
	 * If undefined (default), jQuery.animate()'s default easing function will be used.
	 * @property {boolean} horizontalAnimation =false: Default tries vertical easing when
	 * showing or hiding a section, set to true in order to change to horizontal easing.
	 * @property {int} duration =200 Default duration for animations (scrolling, 
	 * or easing when expanding or collapsing elements).
	 * @property {boolean} scroll =false. When false (default), any call to 
	 * {@link jQuery.fn.showSection showSection()} or 
	 * {@link jQuery.fn.showOrHideSection() showOrHideSection()} (for showing)
	 * will simply show the target section regardless of whether it is in the viewport or not,
	 * i.e. not ensuring that the user will see the newly showing section.
	 * Set this to true to ensure that the newly shown section will be scrolled into viewport:
	 * If the section is {@link jQuery.fn.isTopBelowViewport below viewport}, the page will
	 * {@link jQuery.fn.scrollDownIntoView scroll down until the section is in view},
	 * if {@link jQuery.fn.isTopAboveViewport the section's top is above viewport} (the 
	 * section might be partially showing or not at all, but the start of the section is 
	 * not in view), the page will {@link jQuery.fn.viewportAlignTop scroll up} to show
	 * the beginning of the newly shown section.
	 * @property {int} [scrollTriggerTolerance] =50 Tolerance for the decisions if/when to
	 * trigger a scroll. Only evaluated, of course, if option <code>scroll</code> is true.
	 * See tolerance parameter of {@link jQuery.fn.isTopBelowViewport} resp.
	 * {@link jQuery.fn.isTopAboveViewport}.
	 * @property {int} [scrollTolerance] Tolerance for the scroll operation (see option <code>scroll</code>}).
	 * If left undefined (default), the default tolerance of the called scroll function
	 * ({@link jQuery.fn.scrollDownIntoView} resp. {@link jQuery.fn.viewportAlignTop}) will be used.
	 * @property {string|jqr} heading = "#${id}_h" String pattern for a jQuery selector string used
	 * to find the section heading element (or alternatively a jquery resultset containing the heading element).
	 * This heading element is an HTML element usually above the hideable section itself
	 * and is supposed to be always visible (even if the section is hidden) and to visually
	 * reflect the state (i.e. by an icon), indicating, whether it refers to the following visible
	 * section or to a hidden section. It also usually is or contains a toggle control (like a link or button) 
	 * to trigger an event which will expand a hidden section or hide the visible section.
	 * For example: If you have a link or button and have bound a function to it's click event 
	 * in order to call <code>$("#mySection").showOrHide()</code>, i.e. a link or button which 
	 * is used to toggle the visibility of a section with the example ID "mySection", 
	 * then this link or button is called the toggle control. You may define this toggle 
	 * control itself to be the heading, but you might also define a larger container, say
	 * a DIV, to be the header, and this (among others) contains the toggle control (button/link).
	 * The heading (regardless if it's the control or a surrounding container) should be
	 * designe to optically reflect the current toggle's state (section visible or invisible?).
	 * This should be defined via CSS. In order to do so, the heading can have a showing or a
	 * hidden class, so you may write CSS rules based on these classes to visualize the state,
	 * e.g. by changing an icon.<br>
	 * The default value of this <code>heading</code> property is "#${id}_h". In this string,
	 * any occurrance of "${xyz}" will first be replaced by calling $(this).prop("xyz"). In this
	 * case, when showing or hiding the section with ID "mySection", the selector will resolve
	 * to "#mySection_h". Then this selector will be used a jQuery search parameter to perform something
	 * like <code>$("#mySection_h").addClass("showing").removeClass("hidden")</code>.
	 * If you leave this setting on its default value, all you have to do is to make sure, that
	 * the ID if each heading element equals the actual section's ID with appended suffix "_h".
	 * If you don't like this default convention, specify a different pattern string.
	 * @property {string|jqr} toggle ="#${id}_h a[href]:first, #${id}_h button:first, a[href]#${id}_h, button#${id}_h"
	 * String pattern for a jQuery selector string or alternatively a jQuery resultset, 
	 * see option <code>heading</code>. 
	 * This default value is meant for the case that the <code>heading</code> selects 
	 * a heading element which either <em>contains</em> a toggle control (being either a button 
	 * or a link, i.e. anchor with href attribute), or which <em>is itself</em>
	 * such a button or a link. If the heading itself is not a button or link, the selector
	 * selects the first button or link inside the heading.
	 * This so-found button or link is expected to be the toggle control which a user can click
	 * in order to show or hide the section.
	 * If you modify the default heading selector you'll probably also hav to change
	 * this option accordingly. 
	 * <br>What actually happens with the result is (currently): For the element found by this selector (if any),
	 * the attribute <code>"aria-expanded"</code> will be set to <code>true</code> if the section
	 * is visible or <code>false</code> if the section is hidden.
	 * This is done for better accessibility: A screen reader will then not only read the
	 * toggle's text (link or button label), but will also announce the state (expanded or collapsed)
	 * of the section, and clicking that control will change this state.
	 * @property {string|jqr} [store] A pattern string similar to option <code>heading</code>
	 * specifying a pattern for a jQuery selector string for finding a form element in which to
	 * store the current visibility state. The syntax is the same as for <code>heading</code>.
	 * (Alternatively a jQuery resultset containing the form element to be used.)
	 * The default is undefined, which means that no such form control is used. If you are
	 * designing an HTML form with expandable and collapsable sections and you want the current
	 * state (whether a specific section is visible or hidden) to persist even when submitting
	 * the form, you may introduce hidden fields to your form, one per hideable section, 
	 * and associate them with the sections by specifying this option. For example, if you
	 * set the ID of each of those hidden fields to the ID of the corresponding section
	 * with a suffix of "_state" appended, then set this option to: <code>#${id}_state</code>.
	 * Then for each section the state will be submitted the following way: The hidden field
	 * will be empty if the section is hidden, and the hidden field will be non-empty (value "X"),
	 * if the section is showing. Then your server application may evaluate this form data
	 * and take care of initialising each section's visibility in the response page it produces.
	 * @property {boolean_or_predicate} [condition] Defaults to undefined. If left undefined, the function
	 * {@link jQuery.fn.showOrHideSection()} (<em>not</em> the unconditional {@link jQuery.fn.showSection}
	 * or {@link jQuery.fn.showSection}) will simply toggle the section's visibility, i.e. if it's
	 * visible, the function will hide it, otherwise it will show it. By setting this option,
	 * you can specify a different condition which either statically or dynamically decides whether 
	 * to try and hide or show the section: 
	 * If you set condition to a simple boolean expression (evaluated to a boolean before the actual)
	 * showOrHideSection() function is executed (this is usually not done in a 
	 * {@link jQuery.fn.setupShowOrHideSection setup}, but directly in the options argument to the 
	 * {@link jQuery.fn.showOrHideSection() showOrHideSection} function)), the section will be
	 * shown (or keep visible if it already was) if the value is truthy, otherwise it will be (or keep)
	 * hidden.
	 * You may also set the option to be a zero- or one-argument-predicate, i.e. a (callback) function
	 * with zero or one parameter which returns a boolean value. 
	 * This function will then be executed each time <code>showOrHideSection()</code> is 
	 * executed and it can then decide whether to return true (show section) or false (hide section).
	 * (Such a function would usually be set once in {@link jQuery.fn.setupShowOrHideSection}.)
	 * This call-back function gets passed a reference to the section itself that should be
	 * shown or hidden (depending on the return value). This reference gets passed in the first
	 * explicit argument as well as implicit argument (i.e. <code>this</code> also points to
	 * the section). So you may refer to the section either via this (usually in a parameterless 
	 * function) or to the parameter name of your choice, whatever you prefer.
	 * @property {jqr} viewport =$(window) A jQuery resultset. which should contain one item
	 * representing the viewport in which the section should be aligned. Will be used only if
	 * the <code>scroll</code> option (see above) is true. This then defines the viewport
	 * inside which the newly shown section should be aligned by scrolling (see scroll functions).
	 * @property {function} [onToggle] Optional callback function which will be called
	 * whenever the visibility of the section changes, i.e. the section gets collapsed (hidden)
	 * or expanded (shown) again. Three arguments will be passed, so your call-back function may
	 * accept up to three parameters: The first parameter gets assigned a plain reference to the
	 * section. The second parameter gets assigned a jQuery resultset containing exactly the
	 * same reference. The third parameter gets assigned a jQuery resultset containing the
	 * heading reference (result found by the <code>heading</code>, of course this set
	 * can be empty if the heading selector did not match any nodes).
	 * @property {function} [onShow] Callback function just like onToggle, only this function
	 * will only be called when the section gets shown, not if it gets hidden.
	 * Actually, it will always be called if a showSection() command (or showOrHideSection() 
	 * with truthy condition) gets executed even if the section already was visible.
	 * @property {function} [onHide] Callback function just like onToggle, only this function
	 * will only be called when the section gets hidden, not if it gets shown.
	 * Actually, it will always be called if a hideSection() command (or showOrHideSection() 
	 * with falsy condition) gets executed even if the section already was invisible.
	 */
	$.fn.showOrHideSection.DEFAULTS = {
		classShowing: "showing",
		classHidden: "hidden",
		easing: undefined,
		horizontalAnimation: false,
		duration: 200,
		scroll: false,
		scrollTriggerTolerance: 50,
		scrollTolerance: undefined,
		heading: "#${id}_h",
		store: undefined,
		toggle: "#${id}_h a[href]:first, #${id}_h button:first, a[href]#${id}_h, button#${id}_h",
		restrictSelectorsToChildren: false, //TODO jsDoc
		condition: undefined,
		viewport: $(window),
		onToggle: undefined,
		onShow: undefined,
		onHide: undefined
	};
	
}(jQuery));
