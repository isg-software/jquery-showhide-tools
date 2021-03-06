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
		if (typeof opts.onSlideOut === "function") {
			block.each(function() {
				if (!isHidden($(this)))
					opts.onSlideOut.apply(this);
			});
		}
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
		//set panel(s) to be invisible in order to ensure that the following show() operation will
		//"render" the panel (calculating its width correctly) but invisibly, so that the starting position
		//for the slide-in-animation can be determined and set before actually showing the panel.
		jqr.css('visibility', 'hidden');
		//Now "show" the panel. It will stay invisble, but this enable the calculation of its width.
		jqr.show();
		//Now the starting position for the slide animation can be calculated and assigned.
		jqr.css('left', -1 * getPanelWidth(jqr, opts));
		//Now that the "invisibly rendered" panel is finally positioned behind its "father",
		//it may finally be made visible...
		jqr.css('visibility', 'visible');
		//... now slide the panel into its final position:
		jqr.animate({
				left:'-1em',
				opacity:1
			}, opts.duration, 
			complete
		);
		if (typeof opts.onSlideIn === "function") {
			jqr.each(function() {
				//if isVisible not necessary here, but precondition ensured by callers
				opts.onSlideIn.apply(this);
			});
		}
	}
	
	function isHidden(jqr) {
		return jqr.css('visibility')!=='visible' || jqr.is(':hidden');
	}
	
	//Slide in a sub-panel from behind its parent. The parent panel (with all its predecessors)
	//must already be visible.
	//Note: This operation supports showing a panel in state "visibility:hidden" as well as a panel
	//      hidden by "display:none" style.
	//Reason: It is explicitly supported to initially hide panels (on load) by simply setting
	//       visibility to hidden and _not_ setting display to none, in order to be able to 
	//       define display values different from the default "block" value (e.g. "display-block").
	//		 When sliding out the panel, this plug-in will use jQuery's hide() function to hide it,
	//       setting display to none. But jQuery will, in this case, remember the inital display value
	//       and restore it when showing the panel again via show().
	function slideInPanel(jqr, opts) {
		if (isHidden(jqr)) {
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
	
	//Slide out (hide) all sub panels of each panel in jqr.
	function slideOutChildren(jqr, opts) {
		slideOutPanel($("." + opts.panelClass, jqr), opts);
	}
	
	function slideInParents(jqr, opts) {
		slideInPanels(jqr.parents("." + opts.panelClass)
						  .filter((idx, node) => isHidden($(node))), 
						  opts);
	}
	
	/**
	 * jQuery plug-in function: Saves options for {@link jQuery.fn.slideToPanel()} as well
	 * as similar functions like {@link jQuery.fn.slideOutPanel} permanently in a data cache
	 * associated with all of the selected elements.
	 * This function may be called for any element <em>containing</em> sliding panels, and
	 * the setup options provided to this function and stored in the data of the selected
	 * container(s) will apply to all sliding panels found within this container (res. these containers).
	 *
	 * @function setupSlideToPanel
	 * @memberOf jQuery.fn
	 * @param {object} [options] An object defining options for the slideToPanel(), slideOutPanel()
	 * or childPanel() functions. See {@link jQuery.fn.slideToPanel.DEFAULTS DEFAULTS options}
	 * for a list of available options and their default values. For any option you omit in your options
	 * argument, the default option will be used. So this argument only needs to specify options
	 * that differ from the defaults.
	 * @return {jqr} the same jQuery resultset this function was called upon, 
	 * allows for chaining several jQuery plug-in calls on the same result set.
	 */
	$.fn.setupSlideToPanel = function(options) {
		if (typeof options !== "object")
			throw "Argument to setupShowOrHideSection must be an object (containing options to be stored as setup)!";
		this.data(SLIDINGPANELS_OPTIONS_DATA_NAME, options)
			.addClass(SLIDINGPANELS_OPTION_CONTAINER_CLASSNAME);
		return this;
	}
	
	/**
	 * jQuery plug-in function: Slide the selected panel into view (to be the last visible panel).
	 * Ensure that the selected panel and all its predecessors are made
	 * visible while all child panels stay or get hidden.
	 * I.e.: If the selected panel is still invisible, show it (after showing all still invisible
	 * predecessord). If the selected panel is already visible and one or more of its successors are
	 * visible too, then hide all those successors.
	 * @function slideToPanel()
	 * @memberOf jQuery.fn
	 * @param {object} [options] An object defining options. 
	 * See {@link jQuery.fn.slideToPanel.DEFAULTS DEFAULTS options}
	 * for a list of available options and their default values. For any option you omit in your options
	 * argument, the default option will be used. So this argument only needs to specify options
	 * that differ from the defaults.
	 * @return {jqr} the same jQuery resultset this function was called upon, 
	 * allows for chaining several jQuery plug-in calls on the same result set.
	 */
	$.fn.slideToPanel = function(options) {
		const opts = getSlPanelOptions($(this), options);
		slideOutChildren(this, opts);
		slideInParents(this, opts);
		slideInPanel(this, opts);
		return 	this;
	};
	
	/**
	 * jQuery plug-in function: Slide the selected panel into view if not yet visible.
	 * Differs from {@link jQuery.fn.slideToPanel()} only in the case that its child panel
	 * is already visible: Then this function will <em>not</em> hide the child panel (or any
	 * successors).
	 * Simply ensures that the selected panel and all its predecessors are made visible.
	 * I.e.: If the selected panel is still invisible, show it (after showing all still invisible
	 * predecessord). If the selected panel is already visible nothing changes.
	 * @function slideInPanel
	 * @memberOf jQuery.fn
	 * @param {object} [options] An object defining options. 
	 * See {@link jQuery.fn.slideToPanel.DEFAULTS DEFAULTS options}
	 * for a list of available options and their default values. For any option you omit in your options
	 * argument, the default option will be used. So this argument only needs to specify options
	 * that differ from the defaults.
	 * @return {jqr} the same jQuery resultset this function was called upon, 
	 * allows for chaining several jQuery plug-in calls on the same result set.
	 */
	$.fn.slideInPanel = function(options) {
		const opts = getSlPanelOptions($(this), options);
		slideInParents(this, opts);
		slideInPanel(this, opts);
		return 	this;
	};	
	
	/**
	 * jQuery plug-in function: Helper function when working with sliding panels
	 * (see {@link jQuery.fn.slideToPanel()}): When called on a one-element jQuery resultset
	 * containing a sliding panel, this function returns a jQuery object containing the panel's
	 * sub panel. If the panel ($(this)) does not yet contain a sub panel (i.e. it's the
	 * last panel in the chain), a new sub panel will be appended and returned.
	 * <p>
	 * Depends on the options <code>panelClass</code> and <code>contentClass</code>, 
	 * see {@link jQuery.fn.slideToPanel.DEFAULTS}.
	 * Selects the children of $(this) of class <code>panelClass</code>, which should usually
	 * be exactly one or none. If it's none, a div element of class <code>panelClass</code> will be
	 * created and appended (and returned), which in turn contains a div child element of class
	 * <code>contentClass</code>.
	 * @function childPanel
	 * @memberOf jQuery.fn
	 * @param {object} [options] An object defining options for the slideToPanel functions.
	 * This function depends on the options panelClass and contentClass.
	 * @return {jqr} a jQuery resultset containing the (previously existing or newly created)
	 * child panel of $(this). Not empty.
	 */
	$.fn.childPanel = function(options) {
		const opts = getSlPanelOptions($(this), options);
		let sub = this.children('.' + opts.panelClass);
        if (!sub.length) { //Neues Slidingpanel einfügen, falls noch keins existiert.
            this.append('<div class="' + opts.panelClass + '"><div class="' + opts.contentClass + '"></div></div>');
			sub = this.children('.' + opts.panelClass).hide();
        }
        return sub;
	};
	
	/**
	 * jQuery plug-in function: Helper function when working with sliding panels
	 * (see {@link jQuery.fn.slideToPanel()}): When called on a one-element jQuery resultset
	 * containing a sliding panel, this function returns a jQuery object containing the panel's
	 * content. More precisely: This function returns the jQuery resultset from a search
	 * for all children of $(this) of class <code>options.contentClass</code>,
	 * (see {@link jQuery.fn.slideToPanel.DEFAULTS}).
	 * @function panelContent
	 * @memberOf jQuery.fn
	 * @param {object} [options] An object defining options for the slideToPanel functions.
	 * This function only depends on the option contentClass.
	 * @return {jqr} a jQuery resultset containing the child element of the panel 
	 * which has the class <code>options.contentClass</code>.
	 */
	$.fn.panelContent = function(options) {
		const opts = getSlPanelOptions($(this), options);
		return this.children("." + opts.contentClass);
	};
	
	/**
	 * @namespace slideToPanel
	 * @memberOf jQuery.fn
	 */
	/**
	 * This object defines the default settings for {@link jQuery.fn.slideToPanel()} and
	 * similar plug-in functions. 
	 * The table also lists all possible properties for the <code>options</code> argument
	 * of said functions.
	 * @member DEFAULTS
	 * @memberOf jQuery.fn.slideToPanel
	 * @property {string} panelClass ="slidingpanel" Name of a CSS class for all sliding panels.
	 * Each HTML node (typically a div) which these plug-in functions should regard as a sliding
	 * panel must be equipped with this class. If the {@link jQuery.fn.childPanel} function is
	 * used to dynamically create new sub panels, these will automatically be equipped with 
	 * a class attribute conaining this class.
	 * @property {string} contentClass ="content" Name of a CSS class for the content block of
	 * a sliding panel: Each panel should have exactly one child node of this class determining the
	 * actual panel content, and up to one element of the "panelClass" which is its child panel.
	 * @property {function} [complete] Optional call-back function, defaults to undefined. If
	 * such a call-back is defined, then it will executed every time after a panel has been
	 * slid into view, and only after the sliding animation has completed. The actual panel
	 * that has just been shown is bound to the implicit parameter 'this'.
	 * @property {function} [onSlideIn] Optional call-back function which gets triggered every
	 * time a sliding panel gets shown. In difference to the 'complete' function, this call-back
	 * gets triggered when the slid-in animation starts (while 'complete' gets triggered after
	 * the animation completed). The actual panel
	 * that has just been shown is bound to the implicit parameter 'this'.
	 * @property {function} [onSlideOut] Optional call-back function which gets triggered every
	 * time a sliding panel gets hidden (slid out of view).  The actual panel
	 * that has just been shown is bound to the implicit parameter 'this'.
	 */
	$.fn.slideToPanel.DEFAULTS = $.extend({
			panelClass: "slidingpanel",
			contentClass: "content",
			complete: undefined,
			onSlideIn: undefined,
			onSlideOut: undefined
		}, $.fn.showOrHideSection.DEFAULTS);
		

	
}(jQuery));
