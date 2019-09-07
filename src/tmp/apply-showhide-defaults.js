$(function() {
	"use strict";
	//make each link of class showOrHideLink animate a transition to show or hide the nearest following element of class hideable.
	//Existing anchor hrefs will be overruled (set to #!).
	//Usage: 
	// a) Define a hyperlink like: <a href="#!" class="showOrHideLink">...</a> 
	//	   (any href other than "#!" will be replaced by "#!" dynamically and will only persist if JavaScript is disabled)
	//		Exception: If the link has a target attribute (i.e. is meant for loading content in an different frame),
	//		The href-attribut will be left untouched, such that the link both opens the target document and shows
	//		or hides a section.
	// b) Define a section to be shown or hidden like <p [or div] class="hideable [optionally more classes]" id="someID">...
	//	  This section must be the next sibling of the <a...> node or any of its parent nodes.
	//	  example:	 <div>
	//				   <a class="showOrHideLink" href="#!">...</a>
	//				   [first possible position of hideable block]
	//				 </div>
	//				 [second possible position of hideable block]
	//				 ...
	// c) (optional) associate styles to a "heading" of this block for indicating whether the block is visible or hidden:
	//	  This heading might be an image inside the anchor tag, a list item or anything else.
	//	  Naming convention: This element has to be identified by id="someID_h". 
	//	  It will be assigned the CSS class "showing" or "hidden". Other classes are preserved (not overwritten).
	//	  Example 1: <a href='#!' class="showOrHideLink"><img id="myID_h" href="..."></a><div class="hideable" id="myID">...</div>
	//	  Example 2: <ul class="showOrHideGroups">
	//				   <li id="advanced_h" class="hidden"><a href="#"! class="showOrHideLink">...</a>
	//					 <div id="advanced" class="hideable" style="display:none">
	//	 
	// d) (optional) insert a hidden html form field to store the current state (visible or hidden):
	//	  Naming convention: insert a hidden field with id "someID_state". A hidden field of this ID will be
	//	  - empty after the block (someID) has been hidden
	//	  - not empty ("X") after block (someID) has been toggled visible.
	//   See the documentation of the showOrHideSection() jQuery plug-in for details.

	/**
	 * Preset for <ul class="showOrHideGroups">:
	 * For each such list a triangle folding icon is prepended to each of the list's items and
	 * a click handler is registered for that icon that will simulate a click to the first
	 * link of class "showOrHideLink" within that list item, see next preset!
	 * Also, the the class "folding-arrows" is added to the ul's class list for CSS formatting
	 */
	if (typeof $.fn.prependFoldingArrowIcon === "function") {
		$("ul.showOrHideGroups > li")
			.prependFoldingArrowIcon()
			.children("svg.folding-arrow-icon")
			.click(function() {
				$(this).parent().children("a.showOrHideLink").first().click();
			});
		$("ul.showOrHideGroups").addClass("folding-arrows");
	}

	/**
	 * Preset for <a class="showOrHideLink">:
	 * Adds a click handler to those links that will look for the next child or sibling of class "hideable"
	 * and trigger a showOrHideSection() on that hideable node.
	 * If a heading is found (using the default naming scheme, i.e. the hideable section has to have an ID
	 * and the heading is the element with the hideable's ID plus "_h" suffix appended) and that heading
	 * has the class "folding-arrow" and the optional folding-arrow-plug-in is loaded, then 
	 * $(heading).transformFoldingArrowIcon() will be executed (used to toggle the folding-arrow icon
	 * in older browsers like IE which don't support CSS transitions for inline CSS).
	 * It's also allowed to create a link (typically inside a <ul class="showOrHideGroups">)
	 * that not only is a "showOrHideLink", but also contains a "real" href (instead of a dummy href
	 * content like "#!" and a target attribute to specify a frame (usually an iframe) as target:
	 * <ul class="showOrHideGroups">
	 * <li><a class="showOrHideLink" href="somePage.html" target="myFrame">...
	 * In this case, clicking the link while the controlled section is hidden/collapsed, will
	 * a) unfold the section (probably containing more navigation items for sub topics) AND
	 * b) open the referenced page ("somePage.html") in the referenced frame ("myFrame").
	 * Clicking the link again, while the sub-list is showing, will simply close it, the 
	 * frame content will then _not_ be updated!
	 * For links without target attribut, the href attribute will always be ignored.
	 * Actually, href will be set to "#!" for every link of class "showOrHideLink" without
	 * a target attribut, and it will be ensured that this href does not trigger any scrolling,
	 * even if an anchor with ID "!" should exist.
	 */
	$("a.showOrHideLink:not([target])").attr("href", "#!");
	$("a.showOrHideLink")
		.click( function(ev) {
			var finder = $(this);
			var block = finder.nextUntil("a.showOrHideLink", ".hideable");
			while (!block.length && finder.length) {
				finder = finder.parent();
				block = finder.nextUntil("a.showOrHideLink", ".hideable");
			}
			if (block.length) {
				block.showOrHideSection({
					onToggle: function(block, h) {
						if (typeof $.fn.transformFoldingArrowIcon === "function" && h.hasClass("folding-arrow")) {
							h.transformFoldingArrowIcon();
						}
					}
				});
			}
		
			if (!$(this).is("[target]") || block.getSectionToggle().hasClass($.fn.showOrHideSection.DEFAULTS.classHidden))
				ev.preventDefault();
		});
		
	/**
	 * Each element of class "hideable" will be hidden on page load (without transition).
	 * It will not just be set to "display: none", but it will be hidden by $(".hideable").hideSection({duration: 0}),
	 * meaning the hideSection() plug-in will be called and will update heading and store states.
	 */
	 
	$(".hideable").hideSection({duration: 0});
	
	/**
	 * Enable appendMore for default class names "appendMore" for the link and "more" for the following section
	 * with default options including default link label.
	 */
	$(".more").hide();
	$(".appendMore").appendMoreLinks(); 
	
	/**
	 * Initialization for hidden sliding panels:
	 * Hide all sections of classes "slidingpanel" and "inithidden"!
	 */	
	$(".slidingpanel.inithidden").hide();
});